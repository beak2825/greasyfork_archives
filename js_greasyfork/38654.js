// ==UserScript==
// @name            Badoo Aucunes Publicités
// @namespace       https://badoo.com/
// @version         1.4
// @description     Badoo épuré.
// @copyright       Okaïdo53
// @author          Okaïdo53
// @Secure          Okaïdo53
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      Safari
// @license         https://creativecommons.org/licence/by-nc-nd/4.0
// @domain          badoo.com
// @domain          www.badoo.com
// @domain          apis.google.com
// @include         http://badoo.com/*
// @include         https://badoo.com/*
// @include         http://*.badoo.com/*
// @include         https://*.badoo.com/*
// @match           http://badoo.com/*
// @match           https://badoo.com/*
// @match           http://*badoo.com/*
// @match           https://*.badoo.com/*
// @require         https://code.jquery.com/jquery-2.2.4.js#md5=ac56d...,sha256-iT6Q9iMJYuQiMWNd9lDyBUStIq/8PuOW33aOqmvFpqI=
// @resource        ccs_https://gist.github.com/Okaido53/837cb1c38da765db95156fe30eb4f489/Badoo Aucunes Publicités.ccs?v=1.2
// @homepage        https://greasyfork.org/fr/scripts/38654-badoo-aucunes-publicit%C3%A9s
// @homepageURL     https://gist.github.com/Okaido53/837cb1c38da765db95156fe30eb4f489
// @supportURL      https://badoo.com/team/fr/contacts/
// @supportURL 2    https://badoo.com/fr/feedback/
// @contributionURL https://www.paypal.com/
// @icon            https://icons.duckduckgo.com/ip3/badoo.com.ico
// @iconURL         https://icons.duckduckgo.com/ip3/badoo.com.ico
// @defaulticon     https://icons.duckduckgo.com/ip3/badoo.com.ico
// @icon64          https://icons.duckduckgo.com/ip3/badoo.com.ico
// @icon64URL       https://icons.duckduckgo.com/ip3/badoo.com.ico
// @run-at          document-start
// @run-at          document-end
// @run-at          document-body
// @run-at          document-end
// @run-at          document-idle
// @run-at          context-menu
// @connect         <value>
// @nocompat        Chrome
// @noframes
// @grant           none
// @grant           GM_setClipboard
// @grant           GM_log
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @grant           window.focus
// @grant           window.close
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/38654/Badoo%20Aucunes%20Publicit%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/38654/Badoo%20Aucunes%20Publicit%C3%A9s.meta.js
// ==/UserScript==
(function() {var css = [
	    "@namespace url(http://www.w3.org/1999/xhtml);",
        "div#page-cookie-notification.page__footer-notifications.js-core-events-container                       {display:none !important;}",
        "div.cookie-notification__inner                                                                         {display:none !important;}",
        "a.link.js-about-notification                                                                           {display:none !important;}",
        "div.footer-apps                                                                                        {display:none !important;}",
        "div.likes-wrap                                                                                         {display:none !important;}",
        "div.spotlight__title                                                                                   {display:none !important;}",
        "div.sidebar__promo.is-invisible-when-sidebar-collapsed.js-sidebar-promo.js-core-events-container       {display:none !important;}",
        "div.messenger__contacts-surprise                                                                       {display:none !important;}",
        "div#page-surprise-top.page__surprise                                                                   {display:none !important;}",
        "div.surprise.js-google-ad-container                                                                    {display:none !important;}",
        "ins.adsbygoogle.js-google-ad                                                                           {display:none !important;}",
        "ins#aswift_0_anchor                                                                                    {display:none !important;}",
        "div.big-photo__footer.js-profile-footer-container                                                      {display:none !important;}",
        "div.banner-container.js-banner-slot                                                                    {display:none !important;}",
        "div.banner.banner--inbox-full.js-banner-wrap                                                           {display:none !important;}",
        ".trigger-icon-hover.react-button--color-primary.react-button--sm.react-button--filled.react-button     {display:none !important;}",
        ".sidebar-info__metric--premium.sidebar-info__metric > .sidebar-info__metric-content                    {display:none !important;}",
        "div.sidebar-info__metric:nth-of-type(1) > .sidebar-info__metric-content                                {display:none !important;}",
        ".js-spotlight-real                                                                                     {display:none !important;}",
        ".sidebar-promo--spotlight.sidebar-promo                                                                {display:none !important;}",
        ".js-im-promos                                                                                          {display:none !important;}",
        ".js-im-promo.b-link                                                                                    {display:none !important;}",
        ".fast-message                                                                                          {display:none !important;}",
        "a.sidebar-menu__item:nth-of-type(3)                                                                    {display:none !important;}",
        "a.sidebar-menu__item:nth-of-type(4)                                                                    {display:none !important;}",
        ].join("\n");
        if (typeof GM_addStyle != "undefined") {
	    GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
    	PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
    	addStyle(css);
        } else {
	    var node = document.createElement("style");
	    node.type = "text/css";
    	node.appendChild(document.createTextNode(css));
    	var heads = document.getElementsByTagName("head");
	    if (heads.length > 0) {
    	heads[0].appendChild(node);
     	} else {
	    // no head yet, stick it whereever
    	document.documentElement.appendChild(node);
    	}
        }
        })();
