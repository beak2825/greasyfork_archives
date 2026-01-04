// ==UserScript==
// @name         Backlog Lightbox
// @namespace    net.ghippos.backlog.lightbox
// @version      2
// @description  Backlogの画像にLightbox風のプレビューを追加する
// @author       mohemohe
// @match        https://*.backlog.jp/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30417/Backlog%20Lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/30417/Backlog%20Lightbox.meta.js
// ==/UserScript==

const lightboxClass = 'preview-lightbox';

const style = `
.${lightboxClass} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
}

.${lightboxClass} > img {
    width: auto;
    height: auto;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
}

.ImageAttachmentBubble {
    display: none !important;
}
`;

(() => {
    document.body.insertAdjacentHTML('beforeend', `<style>${style}</style>`);

    window.addEventListener('click', (event) => {
        const target = event.target;
        const targetClass = target.attributes.class;

        if(targetClass !== undefined && (targetClass.value.indexOf('js_imageAttachment') === -1 && targetClass.value.indexOf(lightboxClass) === -1)) {
            return true;
        }

        if (targetClass.value == lightboxClass) {
            document.body.removeChild(document.querySelector(`.${lightboxClass}`));
        } else {
            document.body.insertAdjacentHTML('beforeend', `
<div class=${lightboxClass}>
    <img src=${target.href.replace('ViewAttachment','ViewAttachmentImage')}>
</div>
            `);
        }

        event.preventDefault();
        event.stopPropagation();
        return false;
    });
})();
