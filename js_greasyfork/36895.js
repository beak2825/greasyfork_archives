// ==UserScript==
// @name            Facebook Aucunes Publicités
// @namespace       https://facebook.com/
// @version         1.8
// @description     Vous en avez marre des distractions? C'est le moment d'essayé ce-çi
// @copyright       Okaïdo53
// @author          Okaïdo53
// @Secure          Okaïdo53
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      Safari
// @license         https://creativecommons.org/licence/by-nc-nd/4.0
// @licensebuttons  https://licensebuttons.net/l/by-nd/3.0/80x15.png
// @include         http://facebook.com/*
// @include         https://facebook.com/*
// @include         http://*.facebook.com/*
// @include         https://*.facebook.com/*
// @match           https://www.facebook.com/
// @require         https://code.jquery.com/jquery-2.2.4.js#md5=ac56d...,sha256-iT6Q9iMJYuQiMWNd9lDyBUStIq/8PuOW33aOqmvFpqI=
// @resource        ccs_https://gist.github.com/Okaido53/d464732c59e0e9d51970401fd48f4e58/Facebook Aucunes Publicités.css?v=1.8
// @homepage        https://greasyfork.org/fr/scripts/36895-facebook-aucunes-publicités
// @homepageURL     https://gist.github.com/Okaido53/d464732c59e0e9d51970401fd48f4e58
// @supportURL      https://fr-fr.facebook.com/help/326603310765065?helpref=faq_content
// @contributionURL https://www.paypal.com/
// @icon            https://www.facebook.com/images/fb_icon_325x325.png
// @iconURL         https://www.facebook.com/images/fb_icon_325x325.png
// @defaulticon     https://www.facebook.com/images/fb_icon_325x325.png
// @icon64          https://www.facebook.com/images/fb_icon_325x325.png
// @icon64URL       https://www.facebook.com/images/fb_icon_325x325.png
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
// @downloadURL https://update.greasyfork.org/scripts/36895/Facebook%20Aucunes%20Publicit%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/36895/Facebook%20Aucunes%20Publicit%C3%A9s.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
        "div#u_0_e._3_s0._1toe._3_s1._3_s1.uiBoxGray.noborder      {display:none !important;}",
        "div#u_0_i.pam fbPageBanner._73y_.uiBoxGray.bottomborder   {display:none !important;}",
        "div#u_0_k.pam.fbPageBanner._3d9x.uiBoxGray.bottomborder   {display:none !important;}",
        "div#pam.fbPageBanner._3d9x.uiBoxGray.bottomborder         {display:none !important;}",
        "div.fbPageBannerInner                                     {display:none !important;}",
        "button#u_0_l._42ft._5upp._5la0                            {display:none !important;}",
        "div._4juw                                                 {display:none !important;}",
        "div#pagelet_megaphone                                     {display:none !important;}",
	    "div#pagelet_ego_pane                                      {display:none !important;}",
	    "div.ego_column                                            {display:none !important;}",
	    "div#pagelet_trending_tags_and_topics                      {display:none !important;}",
	    "div#friend_list_sidecol                                   {display:none !important;}",
	    "a._54dd                                                   {display:none !important;}",
	    "div._5mym                                                 {display:none !important;}",
	    "div#pagelet_games_rhc                                     {display:none !important;}",
	    "div#pagelet_canvas_nav_content                            {display:none !important;}",
        "div#pagelet_rhc_footer                                    {display:none !important;}",
        "div#stories_pagelet_rhc                                   {display:none !important;}",
        "div._50f9._50f3                                           {display:none !important;}",
        "div._3-8o._52jv                                           {display:none !important;}",
        "div._3-8h._3-8x                                           {display:none !important;}",
        "li#navItem_217974574879787                                {display:none !important;}",
        "li#navItem_2530096808                                     {display:none !important;}",
        "li#navItem_140472815972081                                {display:none !important;}",
        "li#navItem_765518473459969                                {display:none !important;}",
        "li#navItem_577076605805053                                {display:none !important;}",
        "li#navItem_1572366616371383                               {display:none !important;}",
        "li#navItem_219124168114356                                {display:none !important;}",
        "li#navItem_280033845760645                                {display:none !important;}",
        "li#navItem_2356318349                                     {display:none !important;}",
        "li#navItem_1157621394365930                               {display:none !important;}",
        "li#navItem_285571681929755                                {display:none !important;}",
        "li#navItem_969105076459966                                {display:none !important;}",
        "li#navItem_605397933004645                                {display:none !important;}",
        "li#navItem_526732794016279                                {display:none !important;}",
        "li#navItem_192507801105969                                {display:none !important;}",
        "li#navItem_302677536798470                                {display:none !important;}",
        "div#profile_timeline_tiles_unit_pagelets_albums           {display:none !important;}",
        "div#profile_timeline_tiles_unit_pagelets_fun_fact_answers {display:none !important;}",
        "div._5ciw rhcFooter                                       {display:none !important;}",
        "div.pagelet _5qrt x_1h6jpnq_7s egoOrganicColumn           {display:none !important;}",
        "div.wrapper                                               {display:none !important;}",
        "div._1-ia                                                 {display:none !important;}",
        "div._j_2._5pcr                                            {display:none !important;}",
        "div#u_0_g.pam.fbPageBanner._3d9x.uiBoxGray.bottomborder                                                     {display:none !important;}",
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
