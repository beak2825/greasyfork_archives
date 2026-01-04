// ==UserScript==
// @name         Bangumi Host Autojumper
// @namespace    https://yinr.cc/
// @version      0.3
// @description  Auto jump to bangumi.tv in bgm.tv or chii.in.
// @author       Yinr
// @icon         https://bgm.tv/img/favicon.ico
// @icon64       https://bgm.tv/img/ico/ico_ios.png
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)\/.*/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396578/Bangumi%20Host%20Autojumper.user.js
// @updateURL https://update.greasyfork.org/scripts/396578/Bangumi%20Host%20Autojumper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mainHost = 'bangumi.tv';

    let hosts = ['bgm.tv', 'bangumi.tv', 'chii.in'];

    // Auto Jump to main host
    if (hosts.filter(i => i !== mainHost).includes(location.host)) {
        location.href = location.href.replace(/^https?:\/\/[^/]+\//, 'https://' + mainHost + '/');
    }
})();