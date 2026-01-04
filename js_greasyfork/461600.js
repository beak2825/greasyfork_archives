// ==UserScript==
// @name         IdleMiner Force DarkMode
// @name:tr      IdleMiner Karanlık Tema
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces to use dark theme.
// @description:tr  Karanlık tema kullanmaya zorlar.
// @author       ferixinder
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/461600/IdleMiner%20Force%20DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/461600/IdleMiner%20Force%20DarkMode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        Items.load('ui_chat_background_color~#3d3d3d~ui_menu_background_color~#353131~ui_chat_area_background_color~#969696~ui_main_background_color~#000000~ui_primary_background_color~#545454~ui_top_bar_background_color~#000000');
    }, 2000)
})();