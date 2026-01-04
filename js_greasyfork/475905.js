// ==UserScript==
// @name         [AO3-PAC] Mass URL Opener
// @description  Upon page load/refresh, removes emails from clipboard text and opens AO3 links
// @version      1.1
// @author       lydia-theda
// @match        https://codegena.com/generator/multiple-url-opener/
// @match        https://www.openmultipleurl.com/
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/475905/%5BAO3-PAC%5D%20Mass%20URL%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/475905/%5BAO3-PAC%5D%20Mass%20URL%20Opener.meta.js
// ==/UserScript==


(function() {
    'use strict';

     var box = '';

    if (window.location.href == 'https://codegena.com/generator/multiple-url-opener/')
    {
        box = 'textarea#urlField';
    }
    else if (window.location.href == 'https://www.openmultipleurl.com/')
    {
        box = '.form-control';
    }

    function paste()
    {
        const clipBoard = navigator.clipboard;
        navigator.clipboard.readText().then( clipText => { document.querySelector(box).value = clipText.replace(/@\S+\.\S+/g,'').replace(/ff.net/gi,'') });
    }

    function clicky()
    {
        if (/(https?:\/\/)?((www|insecure|test)\.)?(ao3|archiveofourown)\.(org|com|net)/.test(document.querySelector(box).value))
        {
            document.querySelector('.btn:not([id="generatebtn"])').click();
        }
        else
        {
            console.log('No AO3 links in clipboard.')
        }
    }

    paste();
    setTimeout(clicky, 200)

})();