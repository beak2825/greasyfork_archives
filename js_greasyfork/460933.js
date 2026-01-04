// ==UserScript==
// @name         Keyboard shortcut using Waze Wrap
// @description  Just trying to figure out coding for a keyboard shortcut to execute a function
// @author       TxAgBQ
// @version      20230228.002
// @namespace    https://greasyfork.org/en/users/820296-txagbq/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/27023-jscolor/code/JSColor.js
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect      status.waze.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460933/Keyboard%20shortcut%20using%20Waze%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/460933/Keyboard%20shortcut%20using%20Waze%20Wrap.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var settings = {};

    function bootstrap(tries = 1) {
        if (W &&
            W.map &&
            W.model &&
            W.loginManager.user &&
            $ && WazeWrap.Ready)
            init();
        else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }

    bootstrap();

   function init() {
       console.log("Keyboard shorcut: Bootstrap succeeded not moving on to the init function XXXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
       new WazeWrap.Interface.Shortcut('customShortcut', 'Toggles TxAgBQ test', 'TxAgBQtestshortcuts', 'TxAgBQ test Shortcuts', settings.ZoomNew10Shortcut, function(){W.map.olMap.zoomTo(10);}, null).add();
   //Stopped here... still in middle of editing new WW line....
   
   
   }

    function callback() {
    // shortcut callback
    console.log("Shift+T was pressed")
    }


    new WazeWrap.Interface.Shortcut('customShortcut', 'Toggles Shortcut', 'groupId', 'Group Title', "Shift+T", callback, null).add();


})();