// ==UserScript==
// @name         NoTrending
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  remove trending(ads)
// @description:zh-cn 干掉知乎，百度，哔哩哔哩热搜;百度首页，哔哩哔哩首页简洁模式;知乎免登录弹窗
// @author       jkt3sq851rm
// @run-at       document-start
// @match        https://www.baidu.com/*
// @match        https://*.bilibili.com/*
// @match        https://tieba.baidu.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431963/NoTrending.user.js
// @updateURL https://update.greasyfork.org/scripts/431963/NoTrending.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SITE_CONFIG_STORAGE = [
    {
        "urlRegex": "www\\.baidu\\.com",
        "styleRules": [
            "#content_right{display:none !important}",
            "#s_main,#s_menus_wrapper,#s-hotsearch-wrapper{display:none !important}"
        ],
        "popupRules": []
    },
    {
        "urlRegex": "manga\\.bilibili\\.com",
        "styleRules": [
            ".placeholder-item {color:#f4f4f4 !important}",
            ".international-footer {display:none}"
        ],
        "popupRules": []
    },
    {
        "urlRegex": "search\\.bilibili\\.com",
        "styleRules": [
            ".suggest-wrap .hotword-wrap {display:none}",
            ".home-wrap .home-suggest {display:none}",
            ".international-footer {display:none}"
        ],
        "popupRules": []
    },
    {
        "urlRegex": "(t|space|www)\\.bilibili\\.com",
        "styleRules": [
            "::-webkit-input-placeholder {color:#f1f2f3 !important; background-color:#f1f2f3}",
            "#nav-searchform {background-color:#f1f2f3}",
            "#i_cecream .search-panel {display:none}",
            "#internationalHeader .trending {display:none}",
            ".international-home>* {display:none}",
            ".international-home>#internationalHeader {display:block}",
            ".international-footer {display:none}",
            ".mini-header-right-entry .login-panel-popover {display:none}",
            "main.bili-layout {display:none}",
            ".bili-footer {display:none}",
            ".palette-button-outer {display:none}",
            ".bili-header__banner {background:none !important}",
            ".bili-banner {background:none !important}",
            "html, body, #i_cecream, #i_cecream>.LargeHeader {height: 100%}",
            "#i_cecream>.LargeHeader {overflow-y: hidden}"
        ],
        "popupRules": []
    },
    {
        "urlRegex": "tieba\\.baidu\\.com",
        "styleRules": [
            "#head .suggestion_list .bdfengyun{display:none}",
            "#head .suggestion_list .operation_item{display:none}",
            "#head .suggestion_list .break_title{display:none}",
            "[ad-dom-img]{display:none}",
            "#thread_list>:not(.thread_item_box):not(.thread_top_list_folder){display:none !important}",
            ".topic_list_box{display:none}"
        ],
        "popupRules": []
    },
    {
        "urlRegex": "(zhuanlan|www)\\.zhihu\\.com",
        "styleRules": [
            "html {overflow: auto !important}",
            "::-webkit-input-placeholder {color:#f6f6f6 !important}",
            ".SearchBar-label {display: none}",
            ".SearchBar-topSearchItem {display: none}",
            ".TopSearch {display: none}"
        ],
        "popupRules": ".signFlowModal"
    }
];

    const href = location.href;
    let siteConfig = {'styleRules': '', 'popupRules': []};
	for (let config of SITE_CONFIG_STORAGE) {
        const regex_url = new RegExp(config.urlRegex);
        if (regex_url.test(href)) {
			if (config.styleRules) {
				siteConfig.styleRules += config.styleRules.join(' ');
			}
			if (config.popupRules) {
				siteConfig.popupRules = siteConfig.popupRules.concat(config.popupRules);
			}
        }
    }

    const handleStyleRule = function() {

        const styleElementId = 'stylesheet_no_trending';
        if (document.getElementById(styleElementId)) {
            return;
        }

        const styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        styleElement.setAttribute('id', styleElementId);
        styleElement.innerHTML = siteConfig.styleRules;
        document.head.appendChild(styleElement);

    };

    const handlePopupRule = function() {
	    for (let selector of siteConfig.popupRules) {
			let elem = document.body.querySelector(selector);
			while (elem) {
				if (elem.parentElement == document.body) {
					elem.setAttribute('style', 'display:none');
					break;
				}
				elem = elem.parentElement;
			}
		}
    };
	
	// 百度会覆盖MutationObserver，在此获取
    function newMutationObserver(args) {
        let MutationObserver = window.MutationObserver;
        if (!MutationObserver) {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
			MutationObserver = iframe.contentWindow.MutationObserver;
			window.MutationObserver = MutationObserver;
            
        }
        return new MutationObserver(args);
    }

	function starthandleStyleRule() {
		handleStyleRule();

        const styleObserver = newMutationObserver(handleStyleRule);
        styleObserver.observe(document.head, {childList: true});
	}

    if (siteConfig.styleRules) {
        if (document.head) {
			starthandleStyleRule();
		} else {
			document.addEventListener('DOMContentLoaded', starthandleStyleRule);
		}
    }

    function startHandlePopupRule() {
        handlePopupRule();

        const popupObserver = newMutationObserver(handlePopupRule);
        popupObserver.observe(document.body, {childList: true});
    }

    if (siteConfig.popupRules.length > 0) {
        if (document.body) {
            startHandlePopupRule();
        } else {
            document.addEventListener('DOMContentLoaded', startHandlePopupRule);
        }
    }

})();