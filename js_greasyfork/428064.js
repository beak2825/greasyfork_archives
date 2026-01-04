// ==UserScript==
// @name         Super Script for flowgame
// @namespace    http://tampermonkey.net/
// @version      4
// @description  A nice script for flowgame
// @author       Mhero
// @match        http://flowgame.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428064/Super%20Script%20for%20flowgame.user.js
// @updateURL https://update.greasyfork.org/scripts/428064/Super%20Script%20for%20flowgame.meta.js
// ==/UserScript==
//super script runs in here
//scripts in progress
window.superScripts = {
    superScriptStarted: function(){
        alert('Hey, thanks for using this script! I really think you should try my other one. It works for flowgame and for agma and for cellcraft! Here is the link: "https://greasyfork.org/en/scripts/425754-super-script" Features of this script: attempt to give current user blackname')
    },

    init: function(){
        superScriptStarted()
       document.getElementById('blackNickNameStyle').css('display', 'block').find(cell).innerDisplay('position', 'black').nickname()
    }
}
window.superScripts.init()