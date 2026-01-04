// ==UserScript==
// @name         Userscript Console (For developers)
// @namespace    Userscript Console
// @version      0.1
// @description  Simple script that provides window.GM_Exec that can access GM_*functions
// @author       PY-DNG
// @include      *
// @connect      *
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/429766/Userscript%20Console%20%28For%20developers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429766/Userscript%20Console%20%28For%20developers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set a password and you will get access to use GM_Exec in browser's console
    // password should be a random string that is impossible to be guessed by anyone else, and should be longer than 4 characters.
    // This aims to prevent the fucking crackers attacking you from their website.
    let password = 'pswd';

    /* Usage:
    **     window.GM_Exec(code, pswd): the same as GM_Exec
    **     GM_Exec(code, pswd):
    **       - code: The code you want to execute in Tempermonkey Sandbox
    **       - pswd: The password you set above
    ** Remember:
    **     Calling GM_Exec with wrong password has no effect but to increase the number variable <triedCount>, your code will not be executed.
    **     For safety, you have to wait at least 1 second before you call GM_Exec again after you called it with a wrong password
    **     GM_Exec will be deleted if triedCount has reached a big number
    **     All these above is for safety, protecting your password from being tested out or guessed from the fucking crackers attacking you from their website
    */



    // Code
    let lastTry;
    let triedCount = 0;
    unsafeWindow.GM_Exec = function(code, pswd) {
        // Password verify
        if (typeof(password) !== 'string') {
            GM_log('Password should be a string!');
            return;
        }
        if (password.length === 0) {
            GM_log('You should set a password first!');
            return;
        }
        if (password.length < 4) {
            GM_log('Password should be equal or longer than 4 characters!');
            return;
        }
        if (!pswd) {
            GM_log('You should call GM_Exec with your password as the second argument!');
            return;
        }
        if ((((new Date()).getTime() - lastTry) / 1000) < 1) {
            GM_log('You should wait at least 1 second before you call GM_Exec again after you called it with a wrong password.');
            lastTry = (new Date()).getTime();
            triedCount++;
            return;
        }
		if (triedCount >= 10 ** (password.length-2)) {
			if (unsafeWindow.GM_Exec) {
				delete unsafeWindow.GM_Exec;
				GM_log('You have tried too many times with wrong passwords, and GM_Exec is now deleted. Please reload.');
			}
            return;
        }
        if (pswd !== password) {
            lastTry = (new Date()).getTime();
            triedCount++;
            GM_log('Wrong password! Your code will not be executed. Try again after 1 second. You has input wrong passwords for {T} time(s). '.replace('{T}', triedCount));
            return;
        };
        triedCount = 0;
        eval(code);
    };

    // Run in Tempermonkey's MenuCommand is safe and needs no verification
    GM_registerMenuCommand('Execute javascript in Tempermonkey Sandbox', function() {
        const code = prompt('Your code：', 'GM_log(GM_Exec);');
        eval(code);
    });
})();