// ==UserScript==
// @name         Add Picture in Picture button
// @version      1.2
// @description  Adds a Picture in Picture button below stream
// @author       Spedwards
// @match        https://www.twitch.tv/*
// @run-at       document-end
// @namespace    https://greasyfork.org/users/6797
// @downloadURL https://update.greasyfork.org/scripts/377875/Add%20Picture%20in%20Picture%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/377875/Add%20Picture%20in%20Picture%20button.meta.js
// ==/UserScript==

const selector = `#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.channel-root.tw-full-height > div.channel-root__player-container.tw-pd-b-2 > div > div.channel-info-bar.tw-border-b.tw-border-bottom-left-radius-large.tw-border-bottom-right-radius-large.tw-border-l.tw-border-r.tw-border-t.tw-flex.tw-flex-wrap.tw-justify-content-between.tw-lg-pd-b-0.tw-lg-pd-t-1.tw-lg-pd-x-1.tw-pd-1 > div > div > div > div.channel-info-bar__content-right.tw-full-width > div.tw-align-items-start.tw-flex.tw-flex-wrap.tw-justify-content-between.tw-mg-t-05 > div:nth-child(2) > div:nth-child(2) > div.tw-mg-x-1`;

(function() {
    (new MutationObserver(function(mutationList) {
        const button = document.getElementById('pip');
        if (!button) {
            const el = document.querySelector(selector);
            if (el) {
                el.className = 'tw-mg-l-1';
                el.insertAdjacentElement('afterend', createButton());
            }
        }
    })).observe(document.getElementsByTagName('title')[0] || document, {childList: true, subtree: true});

    function createButton() {
        const pipDiv = createElement('DIV', {id: 'pip'});
        const divWrap = createElement('DIV', {class: 'tw-relative'});
        const btn = createElement('BUTTON', {class: 'tw-interactive tw-button tw-button--text', events: [{type: 'click', fn: () => document.querySelector('div.player-video video').requestPictureInPicture()}]});
        const btnText = createElement('SPAN', {class: 'tw-button__text', innerHTML: 'Picture in Picture'});
        btn.appendChild(btnText);
        divWrap.appendChild(btn);
        pipDiv.appendChild(divWrap);
        return pipDiv;
    }

    function createElement(e, opts) {
        const el = document.createElement(e);
        if (!opts) return el;
        if (opts.id) el.id = opts.id;
        if (opts.class) el.className = opts.class;
        if (opts.innerHTML) el.innerHTML = opts.innerHTML;
        if (opts.events) opts.events.forEach(event => el.addEventListener(event.type, event.fn));
        return el;
    }
})();