// ==UserScript==
// @name         Hide Mastodon Left Panel
// @namespace    http://www.teamshave.com/mastodonleftpanel
// @version      2024-01-26
// @description  A script to shrink the left nav panel when using Mastodon's advanced interface. Click below the profile pic to shrink/expand.
// @author       Dave Tansley
// @match        https://mastodon.world/*
// @match        https://mastodon.social/*
// @match        https://mstdn.social/*
// @match        https://mastodonapp.uk/*
// @match        https://sunny.garden/*
// @match        https://mastodon.gamedev.place/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485702/Hide%20Mastodon%20Left%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/485702/Hide%20Mastodon%20Left%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var toggleStyle = function() {
        var elements = document.getElementsByClassName("drawer");

        if (elements.length>0) {
           if (elements[0].classList.contains("collapsed-leftnav")==true){
               elements[0].classList.remove("collapsed-leftnav");
               elements[0].classList.add("expanded-leftnav");
           } else {
               elements[0].classList.add("collapsed-leftnav");
               elements[0].classList.remove("expanded-leftnav");
           } 
        }
    };

    var addEvent = function () {
        var elements = document.getElementsByClassName("drawer__inner__mastodon");

        if (elements.length == 0) {
            setTimeout(addEvent, 1000);
        } else {
            elements[0].addEventListener('click', toggleStyle, false);
            toggleStyle();
        }
    };

    // Listen for the reply button being pressed
    document.addEventListener("click", function(e){
        const target = e.target;
        if (target.classList.contains("fa-reply") || target.classList.contains("fa-reply-all")){
           var elements = document.getElementsByClassName("collapsed-leftnav");
           if (elements.length > 0) toggleStyle();
        }
    });

    addEvent();

    var css = [
	"    .collapsed-leftnav { width: 80px !important;}",
    "    .collapsed-leftnav .compose-form, .collapsed-leftnav .search { display: none; }",
    "    .collapsed-leftnav .navigation-bar__profile, .collapsed-leftnav .navigation-bar__actions { display: none; }",
    "    .collapsed-leftnav .drawer__header {flex-direction: column;}",
    "    .collapsed-leftnav .navigation-bar {padding:10px;}",
    "    .drawer.expanded-leftnav, .drawer.collapsed-leftnav {transition: width 0.2s;}"
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