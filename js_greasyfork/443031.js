// ==UserScript==
// @name         Text Converter
// @namespace    https://github.com/invobzvr
// @version      0.4
// @description  Convert selected text to HTML Element
// @author       invobzvr
// @match        *://*/*
// @grant        GM_addStyle
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/text_converter
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/443031/Text%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/443031/Text%20Converter.meta.js
// ==/UserScript==

(function () {
    function pointOf(evt) {
        let pageX, pageY;
        isMobile && (evt = evt.changedTouches[0]);
        pageX = evt.pageX;
        pageY = evt.pageY + 10;
        return { pageX, pageY };
    }

    const isMobile = navigator.userAgent.includes('Mobile'),
        EVTS = [DOWN_EVT, UP_EVT] = isMobile ? ['touchstart', 'touchend'] : ['mousedown', 'mouseup'],
        SLCN = window.getSelection(),
        EL_TYPE = {
            Image: 'img',
            Video: 'video',
            Link: 'a',
        };
    let ctnr, rng, cr, text;
    addEventListener(DOWN_EVT, () => ctnr && (ctnr = ctnr.remove()));
    addEventListener(UP_EVT, evt => {
        if (!SLCN.rangeCount || rng === (cr = SLCN.getRangeAt(0)) || !(text = (rng = cr).toString())) {
            return;
        }
        const { pageX, pageY } = pointOf(evt);
        ctnr = document.body.insertAdjacentElement('beforeend', document.createElement('div'));
        ctnr.className = 'tc_ctnr';
        ctnr.style = `top:${pageY}px;left:${pageX}px`;
        EVTS.forEach(name => ctnr.addEventListener(name, evt => evt.stopPropagation()));
        ctnr.addEventListener('click', evt => {
            let el = document.createElement(EL_TYPE[evt.target.innerText]);
            switch (evt.target.innerText) {
                case 'Image':
                case 'Video':
                    el.src = text;
                    break;
                case 'Link':
                    el.target = '_blank';
                    el.href = text;
                    break;
            }
            rng.surroundContents(el);
            rng.collapse();
            ctnr && (ctnr = ctnr.remove());
        });
        ctnr.innerHTML = `<div>Image</div><div>Video</div><div>Link</div>`;
    });

    GM_addStyle(`.tc_ctnr {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #0009;
    color: #000;
    font-size: 12px;
    line-height: initial;
    overflow: hidden;
    position: absolute;
    user-select: none;
    z-index: 999;
}
.tc_ctnr>div {
    padding: 5px 7px;
    transition: .2s;
}
.tc_ctnr>div:hover {
    background: #0002;
}
.tc_ctnr>div:not(:last-child) {
    border-bottom: 1px solid #0003;
}`);
})();