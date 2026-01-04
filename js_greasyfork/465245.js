// ==UserScript==
// @name        QQ邮箱增强
// @namespace   Violentmonkey Scripts
// @match       *://mail.qq.com/*
// @version     XiaoYing_2023.05.25.22
// @grant       GM_info
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       unsafeWindow
// @run-at      document-start
// @author      github.com @XiaoYingYo
// @require     https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @description Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/465245/QQ%E9%82%AE%E7%AE%B1%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/465245/QQ%E9%82%AE%E7%AE%B1%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


var Func = new Map();
Func.set('delMail', async () => {
    let op = await global_module.waitForElement("div[class^='dialog_operate']", null, null);
    let confirm = $(op).find('a').eq(0);
    global_module.clickElement(confirm[0]);
});
Func.set('frame_html.html', async () => {
    window.addEventListener(
        'message',
        (event) => {
            let data = event.data;
            if (data.origin !== 'QQ邮箱增强') {
                return;
            }
            let func = data.func;
            if (!Func.has(func)) {
                return;
            }
            Func.get(func)();
        },
        false
    );
    let clearRecycleBin = async () => {
        let folder_5 = $("li[id='folder_5_td']").eq(0);
        let a = folder_5.find('a');
        if (a.length === 1) {
            return;
        }
        $(a[1]).on('click', async () => {
            console.log('delMail');
            Func.get('delMail')();
        });
    };
    let observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            let Element = mutation.target;
            let id = $(Element).attr('id');
            if (id !== 'navMidBar') {
                continue;
            }
            clearRecycleBin();
            return;
        }
    });
    clearRecycleBin();
    let navMidBar = await global_module.waitForElement('div#navMidBar', null, null, -1);
    observer.observe(navMidBar.eq(0)[0], { childList: true, subtree: true });
});
Func.set('readmail.html', async () => {
    let delMail = await global_module.waitForElement("a[ck='delMail'][opt]", null, null, -1);
    for (let i = 0; i < delMail.length; i++) {
        let Item = delMail[i];
        $(Item).on('click', async () => {
            window.parent.postMessage({ origin: 'QQ邮箱增强', func: 'delMail' }, '*');
        });
    }
});
Func.set('mail_list.html', async () => {
    let delMail = await global_module.waitForElement("a[id='quick_completelydel'][class]", null, null, -1);
    for (let i = 0; i < delMail.length; i++) {
        let Item = delMail[i];
        $(Item).on('click', async () => {
            window.parent.postMessage({ origin: 'QQ邮箱增强', func: 'delMail' }, '*');
        });
    }
});

(async () => {
    let path = window.location.pathname;
    let last = path.lastIndexOf('/');
    let name = path.substring(last + 1) + '.html';
    if (!Func.has(name)) {
        return;
    }
    Func.get(name)();
})();
