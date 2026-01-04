// ==UserScript==
// @name        StackOverflow extended
// @namespace   https://github.com/XelaNimed
// @version     0.10.1-SNAPSHOT
// @description Copy code to clipboard; hiding and saving the state of the "Blog", "Meta" blocks by clicking; adding links to all questions of the author and all questions only with tags of the current question to the user's card; stretching and restoring page content for better reading of code listings; redirecting from localized versions of the site to an English-language domain with a search for the current question.
// @author      XelaNimed
// @copyright   2021, XelaNimed (https://github.com/XelaNimed)
// @match       https://*.stackoverflow.com/*
// @match       https://*.meta.stackoverflow.com/*
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @homepageURL https://github.com/XelaNimed/ruSO
// @supportURL  https://github.com/XelaNimed/ruSO/issues
// @iconURL     https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=32
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js#sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==
// @require     https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.6.1/js/iziModal.min.js#sha512-lR/2z/m/AunQdfBTSR8gp9bwkrjwMq1cP0BYRIZu8zd4ycLcpRYJopB+WsBGPDjlkJUwC6VHCmuAXwwPHlacww==
// @resource    IZI_MODAL https://cdnjs.cloudflare.com/ajax/libs/izimodal/1.6.1/css/iziModal.min.css#sha512-3c5WiuZUnVWCQGwVBf8XFg/4BKx48Xthd9nXi62YK0xnf39Oc2FV43lIEIdK50W+tfnw2lcVThJKmEAOoQG84Q==
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/424184/StackOverflow%20extended.user.js
// @updateURL https://update.greasyfork.org/scripts/424184/StackOverflow%20extended.meta.js
// ==/UserScript==

const $ = window.jQuery;

$.fn.extend({
    toggleText: function(a, b){
        return this.text(this.text() == b ? a : b);
    }
});

/**
 * Root object
 */
const ruSO = {
    $sidebar: $('#sidebar'),
    $content: $('#content'),
    $container: $('body>.container'),
    $fullWidthBtn: null,
    /**
     * Keys for access to Local Storage values.
     */
    lsKeys: {
        metaBlockIsVisible: 'so-ext-metaBlockIsVisible',
        nativeLang: 'so-ext-nativeLanguage',
        useSearchRedirectBtn: 'so-ext-useSearchRedirectBtn',
        addLinkToMeta: 'so-ext-addLinkToMeta',
        toggleMetaBlock: 'so-ext-toggleMetaBlock',
        appLang: 'so-ext-appLang'
    },
    strings: {
        clickToToggle: 'Скрыть/показать',
        setFullWidth: 'Растянуть',
        resetFullWidth: 'Восстановить',
        copy: 'Копировать',
        copied: 'Скопировано',
        canNotCopy: 'Упс, ошибка',
        intoClipboard: 'В буфер'
    },

    /**
     * Checks if a value with the specified key exists in local storage.
     * @param {string} key Value key in local storage
     * @returns Returns true if the value with the specified key is present in local storage, is not null or an empty string, false otherwise.
     */
    isLSNotInitForKey: function(key) { return localStorage[key] === undefined || localStorage[key] == null || localStorage[key] === ''; },
    setLSDefaults: function() {

        if(this.isLSNotInitForKey(this.lsKeys.nativeLang)) {
            const lang = navigator.language || navigator.userLanguage;
            if(this.getSupportedSubDomains().includes(lang)) {
                localStorage[this.lsKeys.nativeLang] = lang;
            } else {
                localStorage[this.lsKeys.useSearchRedirectBtn] = false;
            }
        }
        if(this.isLSNotInitForKey(this.lsKeys.useSearchRedirectBtn)) {
           localStorage[this.lsKeys.useSearchRedirectBtn] = true;
        }
        if(this.isLSNotInitForKey(this.lsKeys.toggleMetaBlock)) {
           localStorage[this.lsKeys.toggleMetaBlock] = true;
        }
        if(this.isLSNotInitForKey(this.lsKeys.metaBlockIsVisible)) {
            localStorage[this.lsKeys.metaBlockIsVisible] = true;
        }
        return this;
    },
    isUseSearchRedirectBtn: function() { return localStorage[this.lsKeys.useSearchRedirectBtn] == 'true'; },
    getNativeLang: function() { return localStorage[this.lsKeys.nativeLang]; },
    isNativeLang: function(lang) { return localStorage[this.lsKeys.nativeLang] === lang; },
    addLinkToMeta: function() { return localStorage[this.lsKeys.addLinkToMeta] == 'true'; },
    toggleMetaBlock: function() { return localStorage[this.lsKeys.toggleMetaBlock] == 'true'; },
    getSupportedSubDomains: function() { return ['ru', 'es', 'pt', 'ja']; },
    
    addSettingsModalDialog: function() {

        let options = this.getSupportedSubDomains()
                        .flatMap((l) => '<option value="' + l + '"' + (this.isNativeLang(l) ? ' selected="selected"' : '') + '>' + l + '</option>' )
                        .join('');

        $(document.body).append(`<div id="iziModal" style="display: none;">

                                    <div class="izi-content">

                                        <div class="d-flex ai-center jc-space-between p16">
                                            <label class="flex--item s-label p0" for="so-ext-search-btn-toggle">
                                                <div class="d-flex ai-center">Use redirect to enSO</div>
                                                <p class="s-description">When this option is enabled, a button redirecting the current search to the English-language StackOverflow site will be added at the end of the search field.</p>
                                            </label>
                                            <div class="flex--item s-toggle-switch">
                                                <input id="so-ext-search-btn-toggle" type="checkbox"${this.isUseSearchRedirectBtn() ? 'checked="checked"' : ''}>
                                                <div class="s-toggle-switch--indicator"></div>
                                            </div>
                                        </div>

                                        <div id="so-ext-native-language-block" class="d-flex ai-center jc-space-between p16${this.isUseSearchRedirectBtn() ? '' : ' o50 pe-none'}">
                                            <label class="s-label flex--item" for="so-ext-native-language">Native language
                                                <p class="s-description">The two-letter code for the subdomain of the regional StackOverflow site. Used when redirecting search queries to the English version and vice versa.</p>
                                            </label>
                                            <div class="d-flex">
                                                <select id="so-ext-native-language" class="flex--item s-input" style="width: 75px;" autofocus="true">
                                                    ${options}
                                                </select>
                                            </div>
                                        </div>

                                        <div class="d-flex ai-center jc-space-between p16">
                                            <label class="flex--item s-label p0" for="so-ext-add-meta-link">
                                                <div class="d-flex ai-center">Add a link to the side menu</div>
                                                <p class="s-description">If this option is enabled, a link to the Meta will be added to the side menu of the StackOverflow site, and a link to the StackOverflow site will be added to the Meta site.</p>
                                            </label>
                                            <div class="flex--item s-toggle-switch">
                                                <input id="so-ext-add-meta-link" type="checkbox"${this.addLinkToMeta() ? 'checked="checked"' : ''}>
                                                <div class="s-toggle-switch--indicator"></div>
                                            </div>
                                        </div>

                                        <div class="d-flex ai-center jc-space-between p16">
                                            <label class="flex--item s-label p0" for="so-ext-toggle-meta-block">
                                                <div class="d-flex ai-center">Minimize the Meta block</div>
                                                <p class="s-description">If this option is enabled, the Meta block with popular questions can be minimized and maximized with the state saved in the local storage.</p>
                                            </label>
                                            <div class="flex--item s-toggle-switch">
                                                <input id="so-ext-toggle-meta-block" type="checkbox"${this.toggleMetaBlock() ? 'checked="checked"' : ''}>
                                                <div class="s-toggle-switch--indicator"></div>
                                            </div>
                                        </div>

                                        <div class="d-flex ai-center p16 button-panel">
                                            <button class="flex--item s-btn s-btn__filled" role="button" value="cancel">Cancel</button>
                                            <button class="flex--item s-btn s-btn__filled" role="button" value="save">Save</button>
                                            <button class="flex--item s-btn s-btn__primary" role="button" value="save-reload">Save and reload</button>
                                        </div>

                                    </div>

                                </div>`);
        return this;
    },
    addCSSStyles: function() {

        'use strict';

        GM_addStyle(GM_getResourceText("IZI_MODAL"));
        GM_addStyle('#iziModal { background-color: var(--theme-content-background-color); box-shadow: 0px 0px 2px 0px var(--theme-button-color); }'+
                    '#iziModal * { font-family: var(--theme-body-font-family); }' +
                    '#iziModal .iziModal-header-title, #iziModal label { color: var(--theme-body-font-color); }' +
                    '#iziModal .iziModal-header-subtitle { color: var(--theme-footer-link-color); }' +
                    '#iziModal .iziModal-header .iziModal-button-close { background: ' +
                                                                        'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAl' +
                                                                        'CAYAAADFniADAAAACXBIWXMAAAsTAAALEwEAmpwYAAADIklEQVRYhe2XTWjUQ' +
                                                                        'BSA1/qHP+A//oAgqCcVFA9W7WYSu1YPBfWwIFWbmSys+FM9qcfFiqggFMWDJ/' +
                                                                        'EmFfWooCfRg4gXZRWUaruzSX8Ei9aTRbu+l0x2s9mNu8lmC0IehCTz8+Z7782' +
                                                                        'bvMRikUQSyX8ouYS2xlC0Dq7QLk7UHp2ohw1Z3f1pf8/caQXBBfMyO6PL7DXc' +
                                                                        'p+BecF95wn7kCe3XJW1n04G4xA7BYkOlxekfnbCsLtPHOqEP8jJ9AW2j5ZD00' +
                                                                        'SBRV4UOU4jFZsCCvUXPEKZjuIbi6dWVYzMteaK2wvg74LHfAn6IE21zqFCg9K' +
                                                                        'LD8j7empxXzzwu0S0A98EEk+lEaGBc1o6gh6yLHse2AsnMqjUPx6CHPyfSiyC' +
                                                                        '0zwXYF96RWtoQUK6tawkoGxchu4xtepyuResNoh70mvdme3o27iWYcxvB9PZj' +
                                                                        'y+B5QITyVkNQoOCaCNu7QjI5EzesrRzuv6qBmUCEPXQkw3XTGFltF+Gf5CS1I' +
                                                                        'RAQQoBHvqIiQ6YHSm3snmN/TWJGlgGhhxz9TnCY+9QKI7sUCIormiSUj+Ni5b' +
                                                                        'CVYLWATCiFddueDwQFXrogFNx397lDhACQ/i+L7xha4V2nDLexFfaYkb1HF/i' +
                                                                        'Ggoy5IRa4Wq2/0mPeHnIZO2FCEXWdbyiw/K61n9h5rzFGZ3q++wTH5PinXpkN' +
                                                                        'in21IwCUlXlei1Tuobo99dPUK9GNvqF0op1r5p4aIycX+oYyJBqvln1eWVYtK' +
                                                                        '90egzbVgqZvfQOhlJ1TQnmttK8FBvqeic9NbyAo0zLIPBGObMMnOmEJe15O6V' +
                                                                        '4fGAogFoOrvwmrr5jK6/j2lTxG+/DbZ5D0cjvr4LoZGMgWrBJECk+BlSfMRX1' +
                                                                        'UCWgYFn/CSwMNVwm2FMMoLK33NIaafStk5Ue7noKwbQoFCMUsP+CIMMtfK5TD' +
                                                                        'sMhZ/HGoHJtp0RW6Cw9fezw856Be3xYakFPAY51YqBU3MRZ+hL6H5yelGp2Nu' +
                                                                        'fr7R/ekVjYFyJZsMjnHIPQ0QLzy+puBvu+40QN9ShoV/HHgMt0HoaUAcwozEn' +
                                                                        '+rEHzaYSKJJJIQ5C/46/lP65NjdQAAAABJRU5ErkJggg==\') no-repeat 50% 50%;' +
                                                                        'width: 48px; }' +
                    '#iziModal .izi-content { background-color: var(--theme-content-background-color); }' +
                    '#iziModal .izi-content > div { border-bottom: 1px solid var(--theme-content-border-color); }' +
                    '#iziModal .izi-content > div:last-child { border-bottom: 0; }' +
                    '#iziModal label {  }' +
                    '#iziModal .s-description { color: var(--theme-footer-link-color); }' +
                    '#iziModal .button-panel { justify-content: flex-end; background-color: var(--theme-footer-background-color); }' +
                    '#iziModal .button-panel button { margin-left: 10px; }' +
                    'body > div.iziModal-overlay { backdrop-filter: blur(1px); }' +
                    'body > .container, #content { transition: all 0.5s ease-in-out; }' +
                    'body > div.container.fullWidth, ' +
                    'body > div.container.fullWidth #content { max-width: 100% !important;  }');

        return this;
    },

    init: function() {
        return this.setLSDefaults()
            .addSettingsModalDialog()
            .addCSSStyles();
    },
    addButtons: function () {
        let self = this,
        addScriptSettings = function() {
            $('<li><ol class="nav-links"><a href="#" class="nav-links--link">UserScript settings</a></li></ol></li>')
                .on('click', 'a', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("#iziModal").iziModal({
                        title: 'Extended StackOverflow Settings',
                        subtitle: 'All settings are saved in the local storage and will take effect when the page reloads',
                        headerColor: 'var(--theme-footer-background-color)',
                        // background: 'rgba(78, 78, 71, 1)',
                        // icon: '.close-icon',
                        // iconText: null,
                        //iconColor: 'var(--theme-body-font-color)',
                        width: 600,
                        radius: 'var(--br-sm)',
                        borderBottom: false,
                        zindex: 9999,
                        focusInput: true,
                        bodyOverflow: false,
                        // fullscreen: true,
                        // openFullscreen: false,
                        appendToOverlay: 'body', // or false
                        overlay: true,
                        overlayClose: true,
                        // overlayColor: 'rgba(0, 0, 0, 0.3)'
                    }).iziModal('open');
                })
                .insertAfter($('#left-sidebar nav > ol > li').last());

         $('#iziModal')
            .on('click', 'button', function(e) {
                 if(e.target.value.startsWith('save')) {
                     localStorage[self.lsKeys.nativeLang] = $('#so-ext-native-language option:selected').val();
                     localStorage[self.lsKeys.useSearchRedirectBtn] = $('#so-ext-search-btn-toggle').is(':checked');
                     localStorage[self.lsKeys.addLinkToMeta] = $('#so-ext-add-meta-link').is(':checked');
                     localStorage[self.lsKeys.toggleMetaBlock] = $('#so-ext-toggle-meta-block').is(':checked');
                 }
                 if(e.target.value.endsWith('reload')) {
                     document.location.reload();
                 }
                 $('#iziModal').iziModal('close');
            })
            .on('change', 'input', function(e) {
               if(e.target.id == 'so-ext-search-btn-toggle') {
                   $('#so-ext-native-language-block')[e.target.checked ? 'removeClass' : 'addClass']('o50 pe-none');
               }
            });
        },
        addWatchedTags = function () {
            let tags = [],
            urlPrefix = window.location.origin + '/questions/tagged/';
            $('.js-watched-tag-list a.user-tag').each(function (idx, itm) {
                let url = itm.href;
                tags.push(url.substring(url.lastIndexOf('/') + 1));
            });
            if (tags.length) {
                let url = urlPrefix + tags.join('+or+');
                let $header = self.$sidebar.find(".js-tag-preferences-container > div").first().find("h2");
                if ($header.length > 0) {

                    $header[0].innerHTML = '<a class="post-tag user-tag" href="' + url + '">' + $header.text() + '</a>';
                }
            }
        },
        addMetaToggles = function () {
            if(!self.toggleMetaBlock()) {
                return;
            }
            let showHideMetas = function ($elem) {
                let isVisible = localStorage[self.lsKeys.metaBlockIsVisible] === 'true';
                let $elems = $elem.parent().children('li.s-sidebarwidget--item');
                $elems.each(function(idx, itm){
                    let $itm = $(itm);
                    if(isVisible)
                    {
                        $itm.removeAttr('style');
                    } else {
                         $itm.attr('style', 'display: none !important');
                    }
                });
            };
            self.$sidebar
            .find('div.s-sidebarwidget li.s-sidebarwidget--header')
            .each(function (idx, itm) {
                let $itm = $(itm);
                $itm
                .attr('title', ruSO.strings.clickToToggle)
                .css('cursor', 'pointer')
                .on('click', function (e) {
                    let isVisible = localStorage.getItem(self.lsKeys.metaBlockIsVisible) === 'true';
                    localStorage.setItem(self.lsKeys.metaBlockIsVisible, !isVisible);
                    showHideMetas($(e.target));
                });
                showHideMetas($itm);
            });
        },
        addLinkToMeta = function () {
            if(!self.addLinkToMeta()) {
                return;
            }
            const isMeta = window.location.host.includes('meta.');
            const link = isMeta ? window.location.host.split('.').filter(part => part !== 'meta').join('.')
                                : 'meta.' + window.location.host;
            const linkText = isMeta ? 'StackOverflow' : 'Meta';
            $('<li><ol class="nav-links"><a href="https://' + link + '" class="nav-links--link">' + linkText + '</a></ol></li>').insertAfter($('#left-sidebar nav > ol > li').last());
        },
        addFullWidth = function () {
            let $header = $('#question-header');
            self.$fullWidthBtn = $header.find('div').clone();
            self.$fullWidthBtn.attr('id', 'set-full-width-btn').find('a')
            .removeClass('s-btn__primary')
            .addClass('s-btn__filled')
            .attr('href', '#')
            .text(self.strings.setFullWidth)
            .on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.$container.toggleClass('fullWidth');
                $(this).toggleText(self.strings.setFullWidth, self.strings.resetFullWidth);
            });
            $header.append(self.$fullWidthBtn);
        },
        addRedirectToSO = function () {
            if(!self.isUseSearchRedirectBtn()) {
                return;
            }
            let localPrefix = self.getNativeLang() + '.';
            let isLocalSO = location.host.substr(0, 3) === localPrefix;
            let btnText = isLocalSO ? 'en' : self.getNativeLang();
            let $btn = $('<div class="print:d-none"><a href="#" class="s-btn s-btn__filled s-btn__xs s-btn__icon ws-nowrap">' + btnText + '</a></div>');
            $btn.insertAfter($('#search'));
            $btn.on('click', function () {
                location.host = isLocalSO ? location.host.substr(localPrefix.length)
                                        : localPrefix + location.host;
            });
        };
        addWatchedTags();
        addMetaToggles();
        addLinkToMeta();
        addFullWidth();
        addRedirectToSO();
        addScriptSettings();
        return this;
    },
    addAuthorQuestionsLinks: function () {
        let $userDetails = $('div.owner > div.user-info > div.user-details');
        if ($userDetails.length > 0) {
            let $postTags = $('div.post-taglist').find('a.post-tag');
            let tags = [];
            for (const $postTag of $postTags) {
                tags.push('[' + $postTag.href.split('/').slice(-1).pop() + ']');
            }
            let tagsUrl = tags.join('+or+');
            for (const userDetail of $userDetails) {
                const $userDetail = $(userDetail);
                const $userUrl = $userDetail.find('a');
                const userName = $userUrl.text();
                const userId = $userUrl[0].href.split('/')[4];
                const baseSearchUrl = `https://ru.stackoverflow.com/search?tab=newest&q=user%3A${userId}+is%3Aq`;
                let elem = `<span>? <a href="${baseSearchUrl}" title="Все вопросы ${userName}">все</a>`;
                if (tags.length > 0) {
                    elem += `, <a href="${baseSearchUrl}+${tagsUrl}" title="Вопросы ${userName} с метками текущего вопроса">с такими-же метками</a>`;
                }
                elem += '</span>';
                $(elem).insertAfter($userDetail);
            }
        }
        return this;
    },
    selectElemText: function(elem) {
		const range = document.createRange();
        range.selectNodeContents(elem);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    },
    getSelectedText: function() {
        let text = '';
        if (window.getSelection) {
            text = window.getSelection();
        } else if (document.getSelection) {
            text = document.getSelection();
        } else if (document.selection) {
            text = document.selection.createRange().text;
        }
        return text;
    },
    copyToClipboard: function(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            return window.clipboardData.setData("Text", text);
        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            const textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");
            } catch (ex) {
                console.warn("Copy to clipboard failed", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    },
	addCopyToClipboard: function() {

		const self = this;

        $('.snippet-ctas').each(function() {
            const $el = $(this);
            const $availableBtn = $el.find('.copySnippet');
            const $snipBtn = $availableBtn.clone();
            $snipBtn.val(self.strings.intoClipboard);
            $snipBtn.click(function() {

                let code = "";

                $snipBtn.closest('.snippet-code').find('pre > code').each(function() {
                    self.selectElemText(this);
                    let selectedText = self.getSelectedText();
                    code += selectedText + '\n';
                    window.getSelection().removeAllRanges();
                });

                if(self.copyToClipboard(code)) {
                    $snipBtn.val(self.strings.copied);
                } else {
                    $snipBtn.val(self.strings.canNotCopy);
                }

                setTimeout(function () {
                    $snipBtn.val(self.strings.intoClipboard);
                }, 2000);
            });
            $availableBtn.after($snipBtn);
        });

        $("pre").each(function () {

            const $pre = $(this);
            const $parent = $pre.parent();

            if($parent.hasClass('snippet-code')) {
                const padding = ($parent.innerWidth() - $parent.width()) / 2;
                $pre.wrapAll('<div style="position: relative; padding-bottom: ' + padding + 'px;"></div>');
            } else {
                $pre.wrapAll('<div style="position: relative;"></div>');
            }

            const $btn = $("<button class='copy-code-button s-btn s-btn__filled s-btn__xs'>" + self.strings.copy + "</button>");
            $btn.css({
                "position": "absolute",
                "top": "6px",
                "right": "12px",
                "display": "none"
            });
            $pre.append($btn);

            let $container = $btn.siblings("code");
            $pre.hover(function () {
                $btn.css("display", "block");
            }, function () {
                $btn.css("display", "none");
            });

            setTimeout(function () {
                if ($container.length == 0) {
                    $pre.contents().filter(function () {
                        return this.className !== "copy-code-button";
                    }).wrapAll('<code style= "overflow-x: auto; padding: 0px;"></code>');
                    $container = $btn.siblings("code").get(0);
                } else {
                    $container = $container.get(0);
                }
            }, 0);

            $btn.click(function () {
                self.selectElemText($container);
                const selectedText = self.getSelectedText();
                let buttonNewText = "";
                if (self.copyToClipboard(selectedText)) {
                    buttonNewText = self.strings.copied;
                } else {
                    buttonNewText = self.strings.canNotCopy;
                }
                window.getSelection().removeAllRanges();
                $(this).text(buttonNewText);
                const that = this;
                setTimeout(function () {
                    $(that).text(self.strings.copy);
                }, 400);
            });
        });
        return this;
    }
};

ruSO.init();

window.addEventListener('load', function () {
    ruSO
    .addButtons()
    .addAuthorQuestionsLinks()
    .addCopyToClipboard();
}, false);
