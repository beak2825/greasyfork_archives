// ==UserScript==
// @name         Youtube Peek Preview
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  See video thumbnails, ratings and other details when you mouse over a Youtube link from almost any website
// @author       scriptpost
// @match        *://*/*
// @exclude      https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/370755/Youtube%20Peek%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/370755/Youtube%20Peek%20Preview.meta.js
// ==/UserScript==
(function () {
    // Remove deprecated storage structure from earlier versions.
    // Configure settings through your browser extension icon, under "Youtube Peek Settings"
    const settings = JSON.parse(GM_getValue('userSettings', '{}'));
    if (settings.hasOwnProperty('REGIONS')) {
        GM_deleteValue('userSettings');
    }
})();
/*!
* Clamp.js 0.5.1
*
* Copyright 2011-2013, Joseph Schmitt http://joe.sh
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*/
(function () {
    /**
     * Clamps a text node.
     * @param {HTMLElement} element. Element containing the text node to clamp.
     * @param {Object} options. Options to pass to the clamper.
     */
    function clamp(element, options) {
        options = options || {};
        var self = this, win = window, opt = {
            clamp: options.clamp || 2,
            useNativeClamp: typeof (options.useNativeClamp) != 'undefined' ? options.useNativeClamp : true,
            splitOnChars: options.splitOnChars || ['.', '-', '–', '—', ' '],
            animate: options.animate || false,
            truncationChar: options.truncationChar || '…',
            truncationHTML: options.truncationHTML
        }, sty = element.style, originalText = element.innerHTML, supportsNativeClamp = typeof (element.style.webkitLineClamp) != 'undefined', clampValue = opt.clamp, isCSSValue = clampValue.indexOf && (clampValue.indexOf('px') > -1 || clampValue.indexOf('em') > -1), truncationHTMLContainer;
        if (opt.truncationHTML) {
            truncationHTMLContainer = document.createElement('span');
            truncationHTMLContainer.innerHTML = opt.truncationHTML;
        }
        // UTILITY FUNCTIONS
        /**
         * Return the current style for an element.
         * @param {HTMLElement} elem The element to compute.
         * @param {string} prop The style property.
         * @returns {number}
         */
        function computeStyle(elem, prop) {
            if (!win.getComputedStyle) {
                win.getComputedStyle = function (el, pseudo) {
                    this.el = el;
                    this.getPropertyValue = function (prop) {
                        var re = /(\-([a-z]){1})/g;
                        if (prop == 'float')
                            prop = 'styleFloat';
                        if (re.test(prop)) {
                            prop = prop.replace(re, function () {
                                return arguments[2].toUpperCase();
                            });
                        }
                        return el.currentStyle && el.currentStyle[prop] ? el.currentStyle[prop] : null;
                    };
                    return this;
                };
            }
            return win.getComputedStyle(elem, null).getPropertyValue(prop);
        }
        /**
         * Returns the maximum number of lines of text that should be rendered based
         * on the current height of the element and the line-height of the text.
         */
        function getMaxLines(height) {
            var availHeight = height || element.clientHeight, lineHeight = getLineHeight(element);
            return Math.max(Math.floor(availHeight / lineHeight), 0);
        }
        /**
         * Returns the maximum height a given element should have based on the line-
         * height of the text and the given clamp value.
         */
        function getMaxHeight(clmp) {
            var lineHeight = getLineHeight(element);
            return lineHeight * clmp;
        }
        /**
         * Returns the line-height of an element as an integer.
         */
        function getLineHeight(elem) {
            var lh = computeStyle(elem, 'line-height');
            if (lh == 'normal') {
                // Normal line heights vary from browser to browser. The spec recommends
                // a value between 1.0 and 1.2 of the font size. Using 1.1 to split the diff.
                lh = parseInt(computeStyle(elem, 'font-size')) * 1.2;
            }
            return parseInt(lh);
        }
        // MEAT AND POTATOES (MMMM, POTATOES...)
        var splitOnChars = opt.splitOnChars.slice(0), splitChar = splitOnChars[0], chunks, lastChunk;
        /**
         * Gets an element's last child. That may be another node or a node's contents.
         */
        function getLastChild(elem) {
            //Current element has children, need to go deeper and get last child as a text node
            if (elem.lastChild.children && elem.lastChild.children.length > 0) {
                return getLastChild(Array.prototype.slice.call(elem.children).pop());
            }
            //This is the absolute last child, a text node, but something's wrong with it. Remove it and keep trying
            else if (!elem.lastChild || !elem.lastChild.nodeValue || elem.lastChild.nodeValue == '' || elem.lastChild.nodeValue == opt.truncationChar) {
                elem.lastChild.parentNode.removeChild(elem.lastChild);
                return getLastChild(element);
            }
            //This is the last child we want, return it
            else {
                return elem.lastChild;
            }
        }
        /**
         * Removes one character at a time from the text until its width or
         * height is beneath the passed-in max param.
         */
        function truncate(target, maxHeight) {
            if (!maxHeight) {
                return;
            }
            /**
             * Resets global variables.
             */
            function reset() {
                splitOnChars = opt.splitOnChars.slice(0);
                splitChar = splitOnChars[0];
                chunks = null;
                lastChunk = null;
            }
            var nodeValue = target.nodeValue.replace(opt.truncationChar, '');
            //Grab the next chunks
            if (!chunks) {
                //If there are more characters to try, grab the next one
                if (splitOnChars.length > 0) {
                    splitChar = splitOnChars.shift();
                }
                //No characters to chunk by. Go character-by-character
                else {
                    splitChar = '';
                }
                chunks = nodeValue.split(splitChar);
            }
            //If there are chunks left to remove, remove the last one and see if
            // the nodeValue fits.
            if (chunks.length > 1) {
                // console.log('chunks', chunks);
                lastChunk = chunks.pop();
                // console.log('lastChunk', lastChunk);
                applyEllipsis(target, chunks.join(splitChar));
            }
            //No more chunks can be removed using this character
            else {
                chunks = null;
            }
            //Insert the custom HTML before the truncation character
            if (truncationHTMLContainer) {
                target.nodeValue = target.nodeValue.replace(opt.truncationChar, '');
                element.innerHTML = target.nodeValue + ' ' + truncationHTMLContainer.innerHTML + opt.truncationChar;
            }
            //Search produced valid chunks
            if (chunks) {
                //It fits
                if (element.clientHeight <= maxHeight) {
                    //There's still more characters to try splitting on, not quite done yet
                    if (splitOnChars.length >= 0 && splitChar != '') {
                        applyEllipsis(target, chunks.join(splitChar) + splitChar + lastChunk);
                        chunks = null;
                    }
                    //Finished!
                    else {
                        return element.innerHTML;
                    }
                }
            }
            //No valid chunks produced
            else {
                //No valid chunks even when splitting by letter, time to move
                //on to the next node
                if (splitChar == '') {
                    applyEllipsis(target, '');
                    target = getLastChild(element);
                    reset();
                }
            }
            //If you get here it means still too big, let's keep truncating
            if (opt.animate) {
                setTimeout(function () {
                    truncate(target, maxHeight);
                }, opt.animate === true ? 10 : opt.animate);
            }
            else {
                return truncate(target, maxHeight);
            }
        }
        function applyEllipsis(elem, str) {
            elem.nodeValue = str + opt.truncationChar;
        }
        // CONSTRUCTOR
        if (clampValue == 'auto') {
            clampValue = getMaxLines();
        }
        else if (isCSSValue) {
            clampValue = getMaxLines(parseInt(clampValue));
        }
        var clampedText;
        if (supportsNativeClamp && opt.useNativeClamp) {
            sty.overflow = 'hidden';
            sty.textOverflow = 'ellipsis';
            sty.webkitBoxOrient = 'vertical';
            sty.display = '-webkit-box';
            sty.webkitLineClamp = clampValue;
            if (isCSSValue) {
                sty.height = opt.clamp + 'px';
            }
        }
        else {
            var height = getMaxHeight(clampValue);
            if (height <= element.clientHeight) {
                clampedText = truncate(getLastChild(element), height);
            }
        }
        return {
            'original': originalText,
            'clamped': clampedText
        };
    }
    window.$clamp = clamp;
})();
(function () {
    // Begin script: Youtube Peek
    'use strict';
    const DEFAULT_OPTIONS = {
        regions: [],
        noTooltip: true,
        allowOnYoutube: false
    };
    const OPTIONS = JSON.parse(GM_getValue('userSettings', JSON.stringify(DEFAULT_OPTIONS)));
    const apiKey = 'AIzaSyBnibVlVDGC7t_wd3ZErVK6XF3hp3G7xtA';
    const re = {
        isVideoLink: /(?:youtube\.com\/(?:watch\?.*v=|attribution_link)|youtu\.be\/|y2u\.be\/)/i,
        getVideoId: /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|y2u\.be\/)([-_A-Za-z0-9]{11})/i,
        getTimeLength: /\d+[A-Z]/g,
    };
    const cache = {};
    const delay_open = 100;
    const delay_close = 0;
    let tmo_open;
    let tmo_close;
    const _stylesheet = String.raw `<style type="text/css" id="yt-peek">.yt-peek,.yt-peek-loading{position:absolute;z-index:123456789}.yt-peek,.yt-peek-cfg{box-shadow:var(--shadow-big);--shadow-big:0 4px 8px hsla(0,0%,0%,.2),0 8px 16px hsla(0,0%,0%,.2),0 4px 4px hsla(0,0%,100%,.1)}.yt-peek-loading{width:16px;height:16px;border-radius:50%;background:#fff;border-width:6px 0;border-style:solid;border-color:#8aa4b1;box-sizing:border-box;animation-duration:1s;animation-name:spin;animation-iteration-count:infinite;animation-timing-function:cubic-bezier(.67,.88,.53,.37)}.yt-peek .yt-peek-loading{top:0;bottom:0;left:0;right:0;margin:auto;background:0 0;border-color:hsla(200,20%,62%,.5);width:32px;height:32px}.yt-peek .yt-peek-chan,.yt-peek-blocked{border-top:1px solid hsla(0,0%,100%,.1);box-sizing:border-box}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.yt-peek{box-sizing:border-box;background:#232628;margin:0;padding:0;color:#999!important;font:400 12px/1.2 "segoe ui",arial,sans-serif!important;border-radius:3px!important;overflow:hidden}.yt-peek-cols{display:flex;flex-direction:row;position:relative}.yt-peek-cols>div{display:flex;flex:1 1 auto}.yt-peek-info{box-sizing:border-box;max-width:230px;display:flex;flex:1 0 auto;flex-direction:column}.yt-peek-row{display:flex;justify-content:space-between}.yt-peek-info>div{padding:6px 12px}.yt-peek .yt-peek-title{font-size:14px;color:#fff}.yt-peek .yt-peek-desc{padding-top:0;font-size:14px}.yt-peek .yt-peek-date{display:inline-block;order:-1}.yt-peek .yt-peek-views{display:inline-block}.yt-peek .yt-peek-chan{color:#fff;position:absolute;bottom:0;width:100%}.yt-peek-preview{position:relative;flex-direction:column;order:-1;justify-content:space-between}.yt-peek-thumb{position:relative;min-height:169px;width:300px}.yt-peek-thumb img{object-fit:none;display:block;width:100%}.yt-peek-length{font:700 12px/1 arial,sans-serif;position:absolute;bottom:8px;left:4px;padding:2px 5px;color:#fff;background:hsla(0,0%,0%,.9);border-radius:3px}.yt-peek-score{margin:1px 0;width:100%;height:3px;background:#ccc}.yt-peek-score div{height:inherit;background:#0098e5}.yt-peek-blocked{padding:5px 12px;color:#b2b2b2;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:530px}.yt-peek-blocked em{font-weight:700;font-style:normal;color:#fff;padding:0 2px;background:#dc143c;border-radius:2px}.yt-peek-cfg{font:400 12px/1.35 sans-serif;position:fixed;top:0;right:15px;left:0;margin:auto;padding:0 15px;width:300px;box-sizing:border-box;color:#000;background:#fff;border-radius:0 0 3px 3px;border-width:0 1px 1px;border-style:solid;border-color:#999;max-height:100vh;overflow:auto;z-index:12345679}.yt-peek-cfg-footer,.yt-peek-cfg-item{padding:10px 0}.yt-peek-cfg-heading{padding:10px 0;font:400 14px/1 sans-serif}.yt-peek-cfg-label{font-weight:700}.yt-peek-cfg-item label{display:block}.yt-peek-cfg-desc{color:#8c8c8c;margin:.25em 0 0}.yt-peek-cfg-item textarea{box-sizing:border-box;min-width:100px;width:100%;min-height:2em}.yt-peek-cfg button{display:inline-block;font:400 12px/1 sans-serif;border:none;border-radius:3px;margin:0 .5em 0 0;padding:10px 18px;transition:background .2s;cursor:default}.yt-peek-cfg-save{color:#fff;background:#d82626}.yt-peek-cfg-cancel{color:#000;background:0 0}.yt-peek-cfg-save:hover{background:#b71414}.yt-peek-cfg-cancel:hover{background:#e5e5e5}.yt-peek-missing .yt-peek-chan,.yt-peek-missing .yt-peek-row,.yt-peek-missing .yt-peek-thumb{display:none}.yt-peek,.yt-peek-loading,.yt-peek-thumb img{opacity:0;transition:opacity .25s}.yt-peek-ready{opacity:1!important}</style>`;
    document.body.insertAdjacentHTML('beforeend', _stylesheet);
    function containsEncodedComponents(x) {
        return (decodeURI(x) !== decodeURIComponent(x));
    }
    /**
     * Check if we're on a particular domain name.
     * @param host Name of the website.
     */
    function site(host) {
        return window.location.host.includes(host);
    }
    function handleMouseOver(ev) {
        let target = ev.target;
        target = target.closest('a');
        if (!target)
            return;
        let href = target.href;
        if (!href)
            return;
        // Some sites put the URL in a dataset. (note: twitter blocks goog API)
        if (site('twitter.com')) {
            const dataUrl = target.dataset.expandedUrl;
            if (dataUrl)
                href = dataUrl;
        }
        // Check if the URL goes to a youtube video.
        if (!re.isVideoLink.test(href))
            return;
        // Need to know if it's an attribution link so we can read the encoded params.
        if (/attribution_link\?/i.test(href)) {
            const URIComponent = href.substr(href.indexOf('%2Fwatch%3Fv%3D'));
            if (containsEncodedComponents(URIComponent)) {
                href = 'https://www.youtube.com' + decodeURIComponent(URIComponent);
            }
        }
        // Finally get the video ID;
        const id = re.getVideoId.exec(href)[1];
        if (!id)
            return console.error('Invalid video ID');
        window.clearTimeout(tmo_open);
        window.clearTimeout(tmo_close);
        const noTooltip = JSON.parse(GM_getValue('userSettings', JSON.stringify(DEFAULT_OPTIONS))).noTooltip;
        if (noTooltip) {
            target.removeAttribute('title');
        }
        tmo_open = window.setTimeout(() => {
            if (!cache.hasOwnProperty(id)) {
                const parts = 'snippet,contentDetails,statistics';
                requestVideoData(ev, id, parts);
            }
            else {
                handleSuccess(ev, id, cache[id]);
            }
        }, delay_open);
        function handleMouseLeave(ev) {
            target.removeEventListener('mouseleave', handleMouseLeave);
            window.clearTimeout(tmo_open);
            tmo_open = null;
            tmo_close = window.setTimeout(() => {
                removePeekBoxes();
            }, delay_close);
        }
        target.addEventListener('mouseleave', handleMouseLeave);
    }
    function loadImage(path) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = ev => resolve(img);
            img.onerror = ev => resolve(undefined);
            img.src = path || '';
        });
    }
    function getScorePercent(lovers, haters) {
        if (isNaN(lovers) || isNaN(haters))
            return undefined;
        return Math.round(100 * lovers / (lovers + haters));
    }
    function toDigitalTime(str) {
        if (!str)
            return undefined;
        function pad(s) {
            return s.length < 2 ? `0${s}` : s;
        }
        const hours = /(\d+)H/.exec(str);
        const mins = /(\d+)M/.exec(str);
        const secs = /(\d+)S/.exec(str);
        const output = [];
        if (hours)
            output.push(pad(hours[1]));
        output.push(mins ? pad(mins[1]) : '00');
        output.push(secs ? pad(secs[1]) : '00');
        return output.join(':');
    }
    function insertPeekBox(ev, d) {
        const a = ev.target;
        const settings = JSON.parse(GM_getValue('userSettings', JSON.stringify(DEFAULT_OPTIONS)));
        // Tokens:
        const title = d.snippet.localized.title;
        const desc = d.snippet.localized.description;
        const date = dateAsAge(d.snippet.publishedAt);
        const chan = d.snippet.channelTitle;
        const thumbs = d.snippet.thumbnails;
        const imagePath = thumbs.hasOwnProperty('medium') ? thumbs.medium.url : undefined;
        let blockMatched = [];
        let blockOther = [];
        if (settings.regions.length && d.contentDetails.hasOwnProperty('regionRestriction')) {
            const blocked = d.contentDetails.regionRestriction.blocked;
            if (blocked) {
                blockMatched = blocked.filter(v => settings.regions.includes(v)).map(v => `<em>${v}</em>`);
                blockOther = blocked.filter(v => !settings.regions.includes(v));
            }
        }
        const viewCount = +d.statistics.viewCount;
        const views = viewCount ? viewCount.toLocaleString() : undefined;
        const score = getScorePercent(+d.statistics.likeCount, +d.statistics.dislikeCount);
        const length = toDigitalTime(d.contentDetails.duration);
        loadImage(imagePath).then(img => {
            finishedLoading();
            if (!img)
                return;
            img.setAttribute('alt', title);
            container.querySelector('.yt-peek-thumb').appendChild(img);
            window.setTimeout(() => {
                img.classList.add('yt-peek-ready');
            }, 70);
        });
        // Create HTML:
        const container = document.createElement('div');
        container.innerHTML = `
    <div class="yt-peek-cols">
      <div class="yt-peek-info">
        <div class="yt-peek-row">
          <div class="yt-peek-views">${views ? views + ' views' : ''}</div>
          <div class="yt-peek-date">${date ? date : ''}</div>
        </div>
        <div class="yt-peek-title">${title ? title : `Not found`}</div>
        <div class="yt-peek-desc">${desc ? desc : ''}</div>
        <div class="yt-peek-chan">${chan ? chan : ''}</div>
      </div>
      <div class="yt-peek-preview">
        <div class="yt-peek-thumb"></div>
        <div class="yt-peek-loading yt-peek-ready"></div>
        ${length ? `<div class="yt-peek-length">${length}</div>` : ``}
        ${score ? `<div class="yt-peek-score"><div style="width: ${score}%;"></div></div>` : ``}
      </div>
    </div>
    ${blockMatched.length ? `<div class="yt-peek-blocked"><span>Blocked in:</span> ${blockMatched.join(' ')} ${blockOther.join(' ')}</div>` : ``}
    `;
        container.classList.add('yt-peek');
        if (!title) {
            container.classList.add('yt-peek-missing');
        }
        document.body.insertAdjacentElement('beforeend', container);
        // Clamp long lines of text:
        const $title = container.querySelector('.yt-peek-title');
        const $description = container.querySelector('.yt-peek-desc');
        $clamp($title, { clamp: 4, useNativeClamp: false });
        $clamp($description, { clamp: 4, useNativeClamp: false });
        // Find optimal position within viewport:
        setPosition(a, container);
        // Allow for smooth CSS transition:
        window.setTimeout(() => {
            container.classList.add('yt-peek-ready');
        }, 0);
        // Event listener to remove container because it shouldn't be interacted with:
        container.addEventListener('mouseenter', ev => {
            removePeekBoxes();
        });
    }
    function removePeekBoxes() {
        const elements = document.getElementsByClassName('yt-peek');
        for (const element of elements) {
            element.classList.remove('yt-peek-ready');
            // Allow for smooth CSS transition:
            window.setTimeout(() => {
                element.remove();
            }, 250);
        }
    }
    // Utility to check if a peek box is currently open in the document.
    function activePeekBox() {
        const elements = document.getElementsByClassName('yt-peek');
        if (elements.length)
            return elements[0];
    }
    function startedLoading(ev) {
        const indicator = document.createElement('div');
        indicator.classList.add('yt-peek-loading', 'yt-peek-ready');
        document.body.insertAdjacentElement('beforeend', indicator);
        setPosition(ev.target, indicator);
    }
    function finishedLoading() {
        const elements = document.getElementsByClassName('yt-peek-loading');
        for (const element of elements) {
            element.classList.remove('yt-peek-ready');
            window.setTimeout(() => {
                element.remove();
            }, 250);
        }
    }
    function handleSuccess(ev, id, d) {
        removePeekBoxes();
        if (!d) {
            d = {};
            d.id = id;
            d.contentDetails = {
                duration: undefined
            };
            d.snippet = {
                channelTitle: '',
                thumbnails: { medium: { url: undefined } },
                localized: {
                    title: undefined,
                    description: `The video might be removed.`
                },
                publishedAt: undefined
            };
            d.statistics = {};
        }
        insertPeekBox(ev, d);
        if (!cache.hasOwnProperty(id))
            cache[id] = d;
    }
    function requestVideoData(ev, id, parts) {
        startedLoading(ev);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=${parts}&key=${apiKey}`);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                finishedLoading();
                if (!tmo_open)
                    return;
                if (!xhr.responseText.length)
                    return;
                const response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    handleSuccess(ev, id, response.items[0]);
                }
                else {
                    // handleError()
                }
            }
            else {
                finishedLoading();
            }
        };
        xhr.send();
    }
    function dateAsAge(inputValue) {
        if (!inputValue)
            return undefined;
        let date = new Date(inputValue);
        const difference = new Date(new Date().valueOf() - date.valueOf());
        let y = parseInt(difference.toISOString().slice(0, 4), 10) - 1970;
        let m = +difference.getMonth();
        let d = difference.getDate() - 1;
        let result;
        if (y > 0)
            result = (y === 1) ? y + ' year ago' : y + ' years ago';
        else if (m > 0)
            result = (m === 1) ? m + ' month ago' : m + ' months ago';
        else if (d > 0) {
            result = (d === 1) ? d + ' day ago' : d + ' days ago';
        }
        else {
            result = 'Today';
        }
        return result;
    }
    /**
     *
     * @param source Element to use for the relative position.
     * @param element The element to position.
     */
    function setPosition(source, element) {
        const srcRect = source.getBoundingClientRect();
        const clearanceHeight = element.clientHeight < 60 ? 60 : element.clientHeight;
        // Viewport dimensions:
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        // Calculate:
        const leftOfTarget = vw < (srcRect.left + element.clientWidth);
        // Add extra space for browser status tooltip.
        const topOfTarget = vh < (srcRect.top + srcRect.height + clearanceHeight + 24);
        // Apply position:
        if (leftOfTarget) {
            element.style.right = vw - srcRect.right + 'px';
        }
        else {
            element.style.left = srcRect.left + 'px';
        }
        if (topOfTarget && (vh / 2 < srcRect.top)) {
            element.style.bottom = (vh - srcRect.top) - window.scrollY + 'px';
        }
        else {
            element.style.top = srcRect.bottom + window.scrollY + 'px';
        }
    }
    function insertSettingsDialog() {
        if (document.querySelector('.yt-peek-cfg'))
            return closeSettingsDialog();
        const data = JSON.parse(GM_getValue('userSettings', JSON.stringify(DEFAULT_OPTIONS)));
        const container = document.createElement('div');
        container.addEventListener('click', handleSettingsClick);
        container.classList.add('yt-peek-cfg');
        container.innerHTML = `
      <div class="yt-peek-cfg-heading">Youtube Peek</div>
      <div class="yt-peek-cfg-item">
        <label class="yt-peek-cfg-label" for="yt-peek-cfg-regions">Warn me if the video is blocked in:</label>
        <textarea id="yt-peek-cfg-regions">${data.regions.join(' ')}</textarea>
        <div class="yt-peek-cfg-desc">Space-separated list of region codes. E.g. US GB CA. Leave blank to ignore.</div>
      </div>
      <div class="yt-peek-cfg-item">
        <label>
          <input type="checkbox" id="yt-peek-cfg-noTooltip"${data.noTooltip ? ` checked` : ``}>
          Remove tooltips from video links
        </label>
        <div class="yt-peek-cfg-desc">Because tooltips can get in the way of the video preview.</div>
      </div>
      <div class="yt-peek-cfg-item">
        <label>
          <input type="checkbox" id="yt-peek-cfg-youtube"${data.allowOnYoutube ? ` checked` : ``}>
          Enable on youtube.com
        </label>
        <div class="yt-peek-cfg-desc">Peek isn't intended for use on youtube.com, but you can still use it there. (this change takes effect after reloading)</div>
      </div>
      <div class="yt-peek-cfg-footer">
        <button class="yt-peek-cfg-save" id="yt-peek-cfg-save">SAVE</button>
        <button class="yt-peek-cfg-cancel" id="yt-peek-cfg-cancel">CANCEL</button>
      </div>
    `;
        document.body.appendChild(container);
    }
    function handleSaveSettings() {
        const dialog = document.querySelector('.yt-peek-cfg');
        if (!dialog)
            return;
        // Retrieve values:
        const regionsInput = document.getElementById('yt-peek-cfg-regions');
        const noTooltipInput = document.getElementById('yt-peek-cfg-noTooltip');
        const allowOnYoutube = document.getElementById('yt-peek-cfg-youtube');
        // Format values:
        let regions = regionsInput.value.trim().replace(/\s\s+/g, ' ').toUpperCase();
        // Prepare data object for storage:
        const db_entry = {
            regions: regions.split(/\s/),
            noTooltip: noTooltipInput.checked,
            allowOnYoutube: allowOnYoutube.checked
        };
        GM_setValue('userSettings', JSON.stringify(db_entry));
        closeSettingsDialog();
    }
    function handleSettingsClick(ev) {
        if (ev.target.id === 'yt-peek-cfg-cancel') {
            closeSettingsDialog();
        }
        if (ev.target.id === 'yt-peek-cfg-save') {
            handleSaveSettings();
        }
    }
    function closeSettingsDialog() {
        const dialog = document.querySelector('.yt-peek-cfg');
        if (dialog)
            dialog.remove();
    }
    function handleMenuCommand() {
        insertSettingsDialog();
    }
    GM_registerMenuCommand('Youtube Peek Settings', handleMenuCommand);
    if (site('youtube.com') && !OPTIONS.allowOnYoutube)
        return;
    document.addEventListener('mouseover', handleMouseOver);
})();
