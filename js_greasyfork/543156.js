// ==UserScript==
// @name         Holotower Catalog Highlights and Pin
// @namespace    http://holotower.org/
// @version      1.02
// @author       anonymous
// @license      CC0
// @description  Highlight and pin threads in the catalog
// @icon         https://boards.holotower.org/static/emotes/ina/_tehepero.png
// @match        *://boards.holotower.org/*/catalog.html
// @match        *://holotower.org/*/catalog.html
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/543156/Holotower%20Catalog%20Highlights%20and%20Pin.user.js
// @updateURL https://update.greasyfork.org/scripts/543156/Holotower%20Catalog%20Highlights%20and%20Pin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (active_page != 'catalog') {
        return;
    }

    const STORAGE_KEY = 'pinnedThreadSettings';

    function getSettings() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!parsed || !Array.isArray(parsed.highlights)) throw new Error();
            return parsed;
        } catch {
            const defaults = {
                highlights: [{ name: 'Hololive Global', color: '#00bfff' }],
                pinThreads: true,
                hideOlderThreads: false
            };
            saveSettings(defaults);
            return defaults;
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function createSettingsButtonAndPopup() {

        // Button
        $("<button>", {
            text: 'Pin Settings',
            css: {
                'margin-left': '6px',
                'padding': '2px 8px',
                'font-size': '13px',
            }
        }).click(function () {
            refreshList();
            $("#pin-settings").toggle();
        }).insertAfter('span.catalog_search');

        // Popup
        const $pinSettings = $("<div>", {
            id: 'pin-settings',
            css: {
                'position': 'fixed',
                'overflow': 'auto',
                'max-height': '90vh',
                'top': '50%',
                'left': '50%',
                'transform': 'translate(-50%, -50%)',
                'background': '#1c1c1c',
                'color': '#eee',
                'border': '1px solid #444',
                'box-shadow': '0 4px 12px rgba(0,0,0,0.4)',
                'padding': '14px',
                'z-index': 999,
                'width': '330px',
                'border-radius': '6px',
                'display': 'none'
            }
        }).appendTo('body');

        // Close Button
        $("<button>", {
            text: '✖',
            css: {
                'border': 'none',
                'background': 'transparent',
                'color': '#ccc',
                'fontSize': '16px',
                'cursor': 'pointer',
                'position': 'absolute',
                'top': '8px',
                'right': '12px'
            }
        }).click(function () {
            $("#pin-settings").hide();
        }).appendTo($pinSettings);

        // Header
        $("<h3>", {
            text: 'Highlight Settings',
            css: {
                'margin': '0',
                'padding': '0',
                'color': '#fff'
            }
        }).appendTo($pinSettings);

        // List
        const $list = $("<div>", {
            css: {
                'padding': '0',
                'margin-top': '8px'
            }
        }).appendTo($pinSettings);


        const settings = getSettings();

        function refreshList() {
            $list.empty();

            settings.highlights.forEach((entry, index) => {
                const $listItem = $("<div>", {
                    css: {
                        'margin-bottom': '8px',
                        'display': 'flex',
                        'align-items': 'center',
                        'gap': '4px'
                    }
                }).appendTo($list);

                // Subject Input
                $("<input>", {
                    type: 'text',
                    placeholder: 'Subject',
                    value: entry.name,
                    title: 'Text to search in threads subject. If a thread has no subject, its comment is searched instead. Case insensitive',
                    css: {
                        'flex': '2',
                        'background': '#2a2a2a',
                        'color': '#eee',
                        'border': '1px solid #555',
                        'padding': '3px'
                    }
                }).change(function () {
                    entry.name = this.value;
                    saveSettings(settings);
                    highlightLatestThreads();
                }).appendTo($listItem);

                // Color Input
                $("<input>", {
                    type: 'color',
                    class: 'color-picker',
                    value: entry.color,
                    css: {
                        'width': '30px',
                        'height': '30px',
                        'border': 'none',
                        'background': 'transparent'
                    }
                }).change(function () {
                    entry.color = this.value;
                    $(this).siblings('.hex-color').val(this.value);
                    saveSettings(settings);
                    highlightLatestThreads();
                }).appendTo($listItem);

                // Hex Input
                $("<input>", {
                    type: 'text',
                    class: 'hex-color',
                    placeholder: 'Hex',
                    value: entry.color,
                    css: {
                        'width': '54px',
                        'background': '#2a2a2a',
                        'color': '#eee',
                        'border': '1px solid #555',
                        'padding': '3px'
                    }
                }).change(function () {
                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.value)) {
                        entry.color = this.value;
                        $(this).siblings('.color-picker').val(this.value);
                        saveSettings(settings);
                        highlightLatestThreads();
                    }
                }).appendTo($listItem);

                // Remove Button
                $("<button>", {
                    text: '✖',
                    css: {
                        'background': '#400',
                        'color': '#fff',
                        'border': '1px solid #700',
                        'cursor': 'pointer'
                    }
                }).click(function () {
                    settings.highlights.splice(index, 1);
                    saveSettings(settings);
                    refreshList();
                    highlightLatestThreads();
                }).appendTo($listItem);

            });

        }

        // Add button
        $("<button>", {
            text: '+ Add',
            css: {
                'margin-top': '4px',
                'background': '#333',
                'color': '#eee',
                'border': '1px solid #555',
                'padding': '4px 8px 4px 5px',
                'cursor': 'pointer'
            }
        }).click(function () {
            settings.highlights.push({ name: '', color: '#00bfff' });
            saveSettings(settings);
            refreshList();
            setTimeout(() => {
                const inputs = $list.find('input[placeholder="Subject"]');
                if (inputs.length > 0) {
                    inputs[inputs.length - 1].focus();
                }
            }, 0);
        }).appendTo($pinSettings);


        // Pin threads checkbox
        $("<label>",
            {
                title: 'Pin the most recently bumped highlighted threads'
            }
        ).append(
            $("<input>", {
                type: 'checkbox',
                checked: settings.pinThreads,
                css: {
                    'margin-left': '10px'
                }
            }).change(function () {
                settings.pinThreads = this.checked;
                saveSettings(settings);
                highlightLatestThreads();
            }),
            "Pin"
        ).appendTo($pinSettings);

        // Hide non-pinned threads checkbox
        $("<label>",
            {
                title: 'Hide all the older highlighted threads'
            }
        ).append(
            $("<input>", {
                type: 'checkbox',
                checked: settings.hideOlderThreads,
                css: {
                    'margin-left': '10px'
                }
            }).change(function () {
                settings.hideOlderThreads = this.checked;
                saveSettings(settings);
                highlightLatestThreads();
            }),
            "Hide older threads"
        ).appendTo($pinSettings);

    }

    function highlightLatestThreads() {
        const settings = getSettings();
        if (!settings.highlights || !settings.highlights.length) return;

        const $grid = $('#Grid');

        const highlightedThreads = {};

        $("#Grid > div.mix").each(function () {
            const $mix = $(this);
            const $thread = $mix.find('.thread');

            if ($mix.data('thread-highlighter-hidden') === 'true') {
                $mix.show();
                $mix.data('thread-highlighter-hidden', 'false')
            }

            $mix.removeClass('highlighted');
            $thread.css('box-shadow', '');

            const subjectEl = $mix.find('.subject');
            var subjectText = '';

            if (subjectEl)
                subjectText = subjectEl.text().trim().replace(/\s+/g, ' ').toLowerCase();

            if (!subjectText) {
                // if no subject try the post content
                subjectText = Array.from($mix.find(".replies strong").parent().contents().filter(function () {
                    return this.nodeType == Node.TEXT_NODE;
                }), (x) => x.textContent).join(' ').toLowerCase();
            }

            for (const setting of settings.highlights) {
                const matchText = setting.name.trim().replace(/\s+/g, ' ').toLowerCase();
                if (!matchText || !subjectText.includes(matchText)) continue;

                $mix.addClass('highlighted');
                $mix[0].style.setProperty('--pin-color', setting.color);

                // push thread into array
                if (!highlightedThreads[matchText]) highlightedThreads[matchText] = [];
                highlightedThreads[matchText].push($mix);
            }
        });

        // sort by bump
        for (const matchText in highlightedThreads) {
            highlightedThreads[matchText].sort(($a, $b) => $b.data('bump') - $a.data('bump'));
        }

        // sort the object by the array with the most recent bump
        const sortedThreads = Object.entries(highlightedThreads).sort(([, a], [, b]) => a[0].data('bump') - b[0].data('bump'));

        const sort_by = $("#sort_by").val();
        $grid.mixItUp('sort', (sort_by == "random" ? sort_by : "sticky:desc " + sort_by));

        // loop through sorted threads
        for (const [matchText, threads] of sortedThreads) {
            if (settings.pinThreads) {
                $grid.find('.mix').first().before(threads[0], ' ');

            }
            if (settings.hideOlderThreads) {
                for (let i = 1; i < threads.length; i++) {
                    threads[i].hide();
                    threads[i].data('thread-highlighter-hidden', 'true');
                }
            }
        }
    }

    $(document).ready(function () {
        var cssString = '\n\n/**Generated by Catalog Highlights and Pin**/\n.highlighted > div { box-shadow: inset 0 0 2px 2px var(--pin-color); }';
        if (!$('style.generated-css').length) $('<style class="generated-css">').appendTo('head');
        $('style.generated-css').html($('style.generated-css').html() + cssString);
        createSettingsButtonAndPopup();
        highlightLatestThreads();
    });

    $("#sort_by").on("change", function () { highlightLatestThreads(); });
})();
