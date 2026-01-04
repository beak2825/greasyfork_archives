// ==UserScript==
// @name         IQRPG - WebSocket override for window hook
// @description  Overrides the WebSocket class and hooks any new instance of a WebSocket to a window.socket reference
// @namespace    https://www.iqrpg.com/
// @version      0.0.2
// @author       Xortrox
// @match        http://www.iqrpg.com/game.php
// @match        https://www.iqrpg.com/game.php
// @match        https://iqrpg.com/game.php
// @match        http://iqrpg.com/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389435/IQRPG%20-%20WebSocket%20override%20for%20window%20hook.user.js
// @updateURL https://update.greasyfork.org/scripts/389435/IQRPG%20-%20WebSocket%20override%20for%20window%20hook.meta.js
// ==/UserScript==

const OldSocket = WebSocket;

window.WebSocket = function () {
    const socket = new OldSocket(...arguments);
    window.socket = socket;

    return socket;
}