// ==UserScript==
// @name        Photopea Ads Remover  - photopea.com
// @namespace   https://github.com/Thibb1
// @match       https://www.photopea.com/*
// @grant       none
// @version     1.1.0
// @author      Thibb1
// @description Remove ads from Photopea and scale the canvas correctly
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/469292/Photopea%20Ads%20Remover%20%20-%20photopeacom.user.js
// @updateURL https://update.greasyfork.org/scripts/469292/Photopea%20Ads%20Remover%20%20-%20photopeacom.meta.js
// ==/UserScript==

const style = document.createElement("style");
style.innerHTML = `
    .flexrow.app > div:nth-child(2) {
        display: none;
    }
    .storageset > div:nth-child(2) > div {
        display: flex;
        flex: 1;
        justify-content: center;
    }
    .storageset > div:nth-child(2) > div > div {
        margin-left: 0 !important;
    }
`;
document.head.appendChild(style);

const _min = Math.min;
Math.min = function (...args) {
    const a = args[0];
    if (a === window.screen.width) {
        return _min(400, ...args.slice(1));
    } else {
        return _min(...args);
    }
}

const _bind = Function.prototype.bind;
Function.prototype.bind = function (...args) {
    if (args && args[0] && args[0].o0) {
        args[0].o0.bS = false;
    }
    return _bind.apply(this, [...args]);
}
