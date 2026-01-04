// ==UserScript==
// @name         Fuck-Yudao
// @namespace    none
// @version      0.7
// @license      MIT
// @description  Help you climb over the paywall for a so-called "Free & Open Source Software", built by someone who truly understand our generations duty. To you-know-who: *thank you*. China's OSS environment got much better because of professionals like you.
// @author       The love you care
// @match        https://www.iocoder.cn/*
// @match        https://doc.iocoder.cn/*
// @match        https://cloud.iocoder.cn/*
// @grant        unsafeWindow
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/494723/Fuck-Yudao.user.js
// @updateURL https://update.greasyfork.org/scripts/494723/Fuck-Yudao.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Overwrite jqueryAlert, simply comment out `init` can disable the annoying dialog
    unsafeWindow.jqueryAlert = function(opts) {
        var dialog;
        dialog.show = function() {}
        // dialog.init();
        // dialog.close();
        return dialog;
    }


    // The content of yudao's pooly-written documentation. Almost at the same miserable level as uni-app's docs.
    // Read the docs of vue, react and a lot more responsible, real open source repos to learn how to make professional statements.
    let yudaosPoorlyWrittenDoc = null, prevPath = document.location.pathname;
    // The routes that are currently being marked as VIP only. Real jokes.
    const blockPathList = ["/bpm/", "/user-center/", "/social-user/", "/oauth2/", "/saas-tenant/", "/sms/", "/mail/", "/notify/", "/mybatis-pro/", "/dynamic-datasource/", "/report/", "/Spring-Boot", "/Spring-Cloud", "/api-doc/", "/module-new/", "/new-feature/", "/dev-hot-swap/", "/file/", "/message-queue/", "/job/", "/idempotent/", "/distributed-lock/", "/rate-limiter/", "/http-sign/", "/project-rename/", "/delete-code/", "/resource-permission/", "/data-permission/", "/deployment-linux/", "/deployment-docker/", "/deployment-baota", "/registry-center/", "/config-center/", "/rpc/", "/gateway/", "/distributed-transaction/", "/server-protection/", "/cloud-debug/", "/mp/", "/mall/", "/pay/", "/crm/", "/member/", "/erp/", "/ai/", "/websocket/", "/vo/", "/system-log/"];

    // If the current url is 'blocked'.
    // You do know that for a static documentation site nothing is really blocked, don't you
    const isBlocked = () => {
        const ret = blockPathList.some((e) => document.location.pathname.includes(e));
        return ret;
    }

    // Get the documentation content wrapper element
    const getWrapper = () => {
        return document.querySelector('.content-wrapper');
    }

    const replace = (str) => {
        const wrapper = getWrapper()
        if (str) {
            while (wrapper.innerHTML !== str) {
                wrapper.innerHTML = str
            }
        }
    }

    const contentObserver = new MutationObserver(() => {
        if (getWrapper().innerHTML.includes('仅 VIP 可见')) {
            replace(yudaosPoorlyWrittenDoc)
        }
    })

    const urlObserver = new MutationObserver(() => {
        const wrapperEl = getWrapper()
        /*
        if (document.location.href !== 'https://doc.iocoder.cn/' && isBlocked() && !window.location.href.includes('refreshed')) {
            window.location.href = window.location.href + '?refreshed=1'
            // window.location.reload();
        }
        */
        if (prevPath !== document.location.pathname) {
            window.location.reload()
        }
    })

    urlObserver.observe(document.body, { childList: true })

    //=============================================================================================================================================

    const $$wrapper = getWrapper();
    if (getWrapper() && isBlocked()) {
        yudaosPoorlyWrittenDoc = $$wrapper.innerHTML.includes('仅 VIP 可见') ? null : $$wrapper.innerHTML;
        unsafeWindow.$$content = yudaosPoorlyWrittenDoc;
        unsafeWindow.$$replace = function() {
            replace(unsafeWindow.$$content)
        }
        contentObserver.observe($$wrapper, { childList: true, characterData: true, subtree: true });
        replace(yudaosPoorlyWrittenDoc);
    }

    //=============================================================================================================================================

})();
