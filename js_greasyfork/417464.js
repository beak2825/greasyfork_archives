// ==UserScript==
// @name         页面隐私保护
// @namespace    No Privacy Spys
// @version      2021.05.01.1
// @description  No Privacy Spys
// @author       PY-DNG
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/417464/%E9%A1%B5%E9%9D%A2%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/417464/%E9%A1%B5%E9%9D%A2%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==
(function() {
    let protectSites;
    let canvas, link;
    let menuCmdId, timeoutId;
    let oriTitle;

    const URL_SITE = location.href.match(/^(?:\w+):\/{2,3}(.*?)\//)[1];
    const TEXT_PROTECT_TITLE = '后台页面';
    const TEXT_PROTECT_TITLE_TIP = '单击页面解除保护';
    const TEXT_PROTECT_MENU_ADD = '保护' + URL_SITE;
    const TEXT_PROTECT_MENU_DEL = '不保护' + URL_SITE;
    const TEXT_ID_CANVAS = 'blurUI';
    const PIC_ICON = 'data:image/gif;base64,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';
    //GM_setValue('protectSites', ['www.lianaiyx.com']);

    // delete the item we want from the array we choose
    function delItem(array, item) {
        array.forEach(function(arritem, index, arr) {
            if(arritem === item) {
                arr.splice(index, 1);
            }
        })
    }

    let protect = function(protectAnyway=false) {
        // When switching to this tab, show the tip for 3s
        if (!(protectAnyway === true) && document.visibilityState !== 'hidden') {
            document.title = TEXT_PROTECT_TITLE_TIP;
            // Clear previous title changing task
            if (timeoutId) {clearTimeout(timeoutId);};
            timeoutId = setTimeout(function() {
                // After 3s: If still protecting then hide the tip; If not then just don't change anything
                document.title = document.title === TEXT_PROTECT_TITLE_TIP ? TEXT_PROTECT_TITLE : document.title;
            }, 3000);
            return;
        };
        // Blur GUI
        blur();
        // Hide title
        oriTitle = (document.title !== TEXT_PROTECT_TITLE) && (document.title !== TEXT_PROTECT_TITLE_TIP) ? document.title : oriTitle
        document.title = TEXT_PROTECT_TITLE;
        // Hide icon
        document.head.appendChild(link);
    }

    let recover = function() {
        // Cancel blur GUI
        cancelBlur();
        // Recover title
        document.title = oriTitle;
        // Recover icon
        if (link.parentElement === document.head) {document.head.removeChild(link);};
        // Clear title changing task
        if (timeoutId) {clearTimeout(timeoutId);};
    }

    let config = function() {
        // Initialize protectSites
        protectSites = GM_getValue('protectSites', '');
        if (protectSites === '') {
            protectSites = [];
            GM_setValue('protectSites', protectSites);
        }
    }

    function cancelBlur() {
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto';
        document.removeEventListener('blur', GUIonblur);
        canvas.style.display = 'none';
    }

    function blur() {
        if (!canvas) {
            setTimeout(blur, 100);
            return;
        }
        initGUI();
        let b = 0;
        document.body.style.filter = 'blur(40px)';
        document.body.style.pointerEvents = 'none';
        document.addEventListener('blur', GUIonblur);
        canvas.style.display = '';
    }

    function GUIonblur() {
        canvas.focus();
    }

    let initGUI = function() {
        if (!link) {
            link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = PIC_ICON;
            //link.href = 'https://www.luogu.com.cn/favicon.ico';
        }
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.addEventListener('click', recover);
            canvas.id = TEXT_ID_CANVAS;
            canvas.style.position = 'fixed';
            canvas.style.left = 0;
            canvas.style.top = 0;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.display = 'none';
        }
        if (!document.getElementById(TEXT_ID_CANVAS)) {
            document.lastChild.appendChild(canvas);
        }
    }

    let addThisSite = function() {
        protectSites.push(URL_SITE);
        GM_setValue('protectSites', protectSites);
        initGUI();
        protect(true);
        window.addEventListener('visibilitychange', protect);
        GM_unregisterMenuCommand(menuCmdId);
        menuCmdId = GM_registerMenuCommand('不保护' + URL_SITE, delThisSite);
    }

    let delThisSite = function() {
        delItem(protectSites, URL_SITE);
        GM_setValue('protectSites', protectSites);
        recover();
        window.removeEventListener('visibilitychange', protect);
        GM_unregisterMenuCommand(menuCmdId);
        menuCmdId = GM_registerMenuCommand(TEXT_PROTECT_MENU_ADD, addThisSite);
    }

    let init = function() {
        config();
        if (protectSites.indexOf(URL_SITE) != -1) {
            window.addEventListener('load', initGUI);
            window.addEventListener('load', function() {window.addEventListener('visibilitychange', protect);});
            window.addEventListener('load', function() {if (document.visibilityState !== 'visible') {protect(true);};})
        }
        menuCmdId = protectSites.indexOf(URL_SITE) === -1 ? GM_registerMenuCommand(TEXT_PROTECT_MENU_ADD, addThisSite) : GM_registerMenuCommand(TEXT_PROTECT_MENU_DEL, delThisSite);
        //menuCmdId = GM_registerMenuCommand((protectSites.indexOf(URL_SITE) === -1 ? TEXT_PROTECT_MENU_ADD : TEXT_PROTECT_MENU_DEL), protectSites.indexOf(URL_SITE) === -1 ? addThisSite : delThisSite);
    }

    init();
})();

// @version 2020.12.05.1
