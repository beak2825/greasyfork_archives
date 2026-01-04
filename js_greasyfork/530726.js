// ==UserScript==
// @name         Edna.cz Future Schedule with Enhanced Countdown
// @name:cs         Edna.cz Budoucí Epizody s Odpočtem
// @namespace    https://greasyfork.org/en/scripts/530726-edna-cz-future-schedule-with-enhanced-countdown
// @version      0.93
// @description  Adds upcoming episodes to the main page summary
// @description:cs  Přidá budoucí epizody do přehledu na hlavní stránce
// @author       Setcher
// @match        https://www.edna.cz/
// @match        https://www.edna.cz/?*
// @match        https://www.edna.cz/#
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.js
// @resource     modalCSS https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.2/jquery.modal.min.css
// @downloadURL https://update.greasyfork.org/scripts/530726/Ednacz%20Future%20Schedule%20with%20Enhanced%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/530726/Ednacz%20Future%20Schedule%20with%20Enhanced%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add modal CSS
    GM_addStyle(GM_getResourceText("modalCSS"));
    GM_addStyle(`
        .future-episode {
            opacity: 0.9;
        }
        .countdown-cell {
            text-align: right !important;
            white-space: nowrap;
            min-width: 120px;
        }
        .seen-episode {
            display: none;
        }
        #edna-settings-btn {
            margin-left: 0.5rem;
        }
        /* Dark mode for modal */
        #edna-settings-modal {
            color: #f8f9fa;
        }
        #edna-settings-modal > div {
            background-color: #343a40 !important;
            border: 1px solid #495057;
        }
        #edna-settings-modal h2 {
            color: #f8f9fa !important;
        }
        #edna-settings-modal label {
            color: #dee2e6 !important;
        }
        #edna-settings-modal input[type="number"],
        #edna-settings-modal input[type="checkbox"] {
            background-color: #495057;
            border-color: #6c757d;
            color: #f8f9fa;
        }
        #edna-settings-modal .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
        }
        #edna-settings-modal .btn-primary {
            background-color: #0d6efd;
            border-color: #0d6efd;
        }
        /* Combine rating and seen columns for countdown */
        .combined-countdown-column {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 120px;
        }
        .combined-countdown-column .stars {
            margin-right: 8px;
        }
    `);

    // Settings
    const defaultSettings = {
        maxDaysInFuture: 7,
        maxFutureItems: 7,
        countdownFormat: 'DD:HH:MM:SS',
        hideSeenEpisodes: true
    };

    let settings = {
        ...defaultSettings,
        ...{
            maxDaysInFuture: GM_getValue('maxDaysInFuture', defaultSettings.maxDaysInFuture),
            maxFutureItems: GM_getValue('maxFutureItems', defaultSettings.maxFutureItems),
            countdownFormat: GM_getValue('countdownFormat', defaultSettings.countdownFormat),
            hideSeenEpisodes: GM_getValue('hideSeenEpisodes', defaultSettings.hideSeenEpisodes)
        }
    };

    // Create settings modal
    function createSettingsModal() {
        const modalHTML = `
            <div id="edna-settings-modal" class="modal" style="display: none;">
                <div style="padding: 20px; border-radius: 5px; max-width: 500px; margin: 0 auto;">
                    <h2 style="margin-top: 0;">Nastavení budoucích epizod</h2>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Maximální dní dopředu:</label>
                        <input type="number" id="edna-max-days" value="${settings.maxDaysInFuture}" min="1" max="60"
                               style="width: 100%; padding: 8px; border-radius: 4px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Maximálně epizod:</label>
                        <input type="number" id="edna-max-items" value="${settings.maxFutureItems}" min="1" max="100"
                               style="width: 100%; padding: 8px; border-radius: 4px;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Formát odpočtu:</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="radio" name="countdownFormat" value="DD:HH" ${settings.countdownFormat === 'DD:HH' ? 'checked' : ''}>
                                <span>DD:HH (Dny a hodiny)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="radio" name="countdownFormat" value="DD:HH:MM" ${settings.countdownFormat === 'DD:HH:MM' ? 'checked' : ''}>
                                <span>DD:HH:MM (Dny, hodiny, minuty)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px;">
                                <input type="radio" name="countdownFormat" value="DD:HH:MM:SS" ${settings.countdownFormat === 'DD:HH:MM:SS' ? 'checked' : ''}>
                                <span>DD:HH:MM:SS (Přesný odpočet)</span>
                            </label>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="edna-hide-seen" ${settings.hideSeenEpisodes ? 'checked' : ''}>
                            <span style="font-weight: bold;">Skrýt již zhlédnuté epizody</span>
                        </label>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button id="edna-cancel-settings" class="btn btn-secondary">Zrušit</button>
                        <button id="edna-save-settings" class="btn btn-primary">Uložit</button>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHTML);

        // Add settings button to controls
        const settingsBtn = $(`
            <a href="#" class="nav-link" id="edna-settings-btn">
                <i class="bi bi-gear-fill"></i> Nastavení
            </a>
        `);
        $('.custom-tabs').append(settingsBtn);

        // Modal handlers
        $('#edna-settings-btn').click(function(e) {
            e.preventDefault();
            $('#edna-settings-modal').modal({
                escapeClose: true,
                clickClose: false,
                showClose: false
            });
        });

        $('#edna-save-settings').click(function() {
            settings.maxDaysInFuture = parseInt($('#edna-max-days').val());
            settings.maxFutureItems = parseInt($('#edna-max-items').val());
            settings.countdownFormat = $('input[name="countdownFormat"]:checked').val();
            settings.hideSeenEpisodes = $('#edna-hide-seen').is(':checked');

            GM_setValue('maxDaysInFuture', settings.maxDaysInFuture);
            GM_setValue('maxFutureItems', settings.maxFutureItems);
            GM_setValue('countdownFormat', settings.countdownFormat);
            GM_setValue('hideSeenEpisodes', settings.hideSeenEpisodes);

            $.modal.close();
            location.reload();
        });

        $('#edna-cancel-settings').click(function() {
            $.modal.close();
        });
    }

    // Main function to load and process future schedule
    function processFutureSchedule() {
        // Wait for the main schedule table to load
        const checkTable = setInterval(function() {
            const $scheduleTable = $('table.table-responsive');
            if ($scheduleTable.length && $('#snippet--episodes').length) {
                clearInterval(checkTable);
                loadFutureSchedule();
            }
        }, 200);
    }

    // Fix episode images (replace placeholder with data-src)
    function fixImages($element) {
        $element.find('img[data-src]').each(function() {
            const $img = $(this);
            if ($img.attr('src') !== $img.attr('data-src')) {
                $img.attr('src', $img.attr('data-src'));
            }
        });
    }

    // Convert timestamp to countdown string
    function getCountdownString(timestamp) {
        const now = new Date().getTime();
        const diff = timestamp - now;

        if (diff < 0) return "Právě vysíláno";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        switch(settings.countdownFormat) {
            case 'DD:HH':
                return `${days}d ${hours}h`;
            case 'DD:HH:MM':
                return `${days}d ${hours}h ${minutes}m`;
            case 'DD:HH:MM:SS':
            default:
                return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    // Update all countdowns
    function updateCountdowns() {
        $('.countdown-text').each(function() {
            const $cell = $(this);
            const timestamp = parseInt($cell.attr('data-countdown'));
            $cell.text(getCountdownString(timestamp));
        });
    }

    // Hide seen episodes if setting is enabled
    function handleSeenEpisodes() {
        if (settings.hideSeenEpisodes) {
            $('a[title^="Označit jako viděno"], a[title^="Označit jako neviděno"]').each(function() {
                const $link = $(this);
                const isWatched = $link.attr('title').startsWith("Označit jako neviděno");
                if (isWatched) {
                    $link.closest('tr').addClass('seen-episode');
                }
            });
        } else {
            $('.seen-episode').removeClass('seen-episode');
        }
    }

    // Load and merge future episodes
    function loadFutureSchedule() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.edna.cz/vysilani/nadchazejici/",
            onload: function(response) {
                const $futureHtml = $($.parseHTML(response.responseText));
                const $scheduleTable = $('table.table-responsive');
                const $episodesContainer = $('#snippet--episodes');

                if (!$scheduleTable.length || !$episodesContainer.length) {
                    console.error('Required elements not found');
                    return;
                }

                const now = new Date();
                const maxDate = new Date(now.getTime() + (settings.maxDaysInFuture * 24 * 60 * 60 * 1000));
                let addedItems = 0;

                $futureHtml.find('#snippet--episodes table.episodes tr').each(function() {
                    if (addedItems >= settings.maxFutureItems) return false;

                    const $row = $(this);
                    const $timeCell = $row.find('td[data-countdown]');

                    if ($timeCell.length) {
                        const timestamp = parseInt($timeCell.attr('data-countdown'));
                        const itemDate = new Date(timestamp);

                        if (itemDate > now && itemDate <= maxDate) {
                            // Extract show information
                            const $showLink = $row.find('td:nth-child(3) a');
                            const showLink = $showLink.attr('href');
                            const showTitle = $showLink.text();
                            const episodeCode = $row.find('td:nth-child(4)').text();
                            const imgSrc = $row.find('img').attr('data-src');
                            const dateText = $timeCell.text().trim().split(' | ')[0];
                            const shortDate = dateText.split('.').slice(0, 2).join('.');

                            // Create new row matching the current layout
                            const $newRow = $(`
                                <tr class="future-episode">
                                    <td class="text-secondary text-nowrap ps-3 text-start" title="${dateText}">${shortDate}</td>
                                    <td onclick="location.href='${showLink}'" class="cursor-pointer" href="${showLink}">
                                        <div class="d-flex align-items-center">
                                            <div class="latest-series-image position-relative rounded-circle overflow-hidden">
                                                <img src="${imgSrc}" alt="${showTitle}" class="position-absolute top-0 start-0 w-100">
                                            </div>
                                            <div class="ms-3">
                                                <a class="text-reset text-decoration-none" href="${showLink}">
                                                    <p class="m-0 my-auto text-start text-white">${episodeCode} ${showTitle}</p>
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="pe-3 combined-countdown-column">
                                        <span class="countdown-text" data-countdown="${timestamp}" title="${$timeCell.text().trim()}"></span>
                                    </td>
                                </tr>
                            `);

                            $episodesContainer.prepend($newRow);
                            fixImages($newRow);
                            addedItems++;
                        }
                    }
                });

                if (addedItems > 0) {
                    handleSeenEpisodes();
                    updateCountdowns();
                    const updateInterval = settings.countdownFormat === 'DD:HH:MM:SS' ? 1000 : 60000;
                    setInterval(updateCountdowns, updateInterval);
                }
            },
            onerror: function(error) {
                console.error('Error loading future schedule:', error);
            }
        });
    }

    // Initialize
    $(document).ready(function() {
        createSettingsModal();
        // Wait a bit longer to ensure all elements are loaded
        setTimeout(processFutureSchedule, 1500);
    });
})();