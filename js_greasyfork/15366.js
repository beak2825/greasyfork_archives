// ==UserScript==
// @name         NPO Theme
// @namespace    georgiy.tugai@gmail.com
// @version      1.4
// @description  Advanced NPO theme for Cybernations
// @author       Georgiy Tugai
// @match        http://www.cybernations.net/*
// @match        http://tournament.cybernations.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/15366/NPO%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/15366/NPO%20Theme.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function a2h(a) {
    var h = {};
    for (var i = 0;i < a.length;i++) {h[a[i]]=true;}
    return h;
}

// ==========================================================================
// Configuration
// Prefix for themed images
var prefix="https://s3-us-west-1.amazonaws.com/resonantriseimages/";
// These classes are replaced with custom URLs
var classes_replace = {"cn_logo": prefix+"images/npo_logo.png"};
// CSS stylesheet (optional)
var stylesheet="https://s3-us-west-1.amazonaws.com/resonantriseimages/npo.css";
// These classes get images resized to 35px^2
var classes_35 = a2h(["resources"]);
// These classes get images resized to 183x60 (navy ships)
var classes_183 = a2h(["navy"]);
// These classes are not substituted
var classes_ignore = a2h(["signup", "arrow", "fbgroup",
                          // Tiny action/info icons
                          "message_compose", "nation_save", "message_block", "note_edit", "share", "earth", "invite_friends",
                          "icon_rankings", "ranking", "world", "icon_war", "alliance_pending", "icon_aid", "warning", "improve_icon", 
                          "icon_spy", "planet", "add", "up", "down", "up_active", "down_active", "compose_message", "deny",
                          "alliance_owner", "alliance_heir", "alliance_manager", "alliance_member", "alliance_statistic",
                          "active", "magnify", "milita4", "generals", "milita6", "milita5", "milita1", "milita3", "spy_purchase", "milita2",
                          "team_results", "team_vote", "team_harbor", "team_proposals", "team_messages", "teams_sanctions", "vote",
                          "quotesleft", "quotesright", "thumb_up", "thumb_down", "view_news", "cancel", "jpgtaxes", "billsfinal", "infras1",
                          "denylimit", "denymoney", "landbu3", "technologyl", "soldier_buy", "aircraft", "cruise2", "spy", "war_info", "icon_war_end", "note",
                          "download3", "download1", "download4", "download2", "ruler_icon", "message_opened", "message_open",
                          // Larger icons
                          "government", "religion", "currency", "flags",
                          "teams",
                          // Found on "about" page(s)
                          "home1", "home2", "enviro_none", "enviro_add",
                          "information", "sameip", "check", "tank5",
                          "aid_small", "about", "land_small", "asterisk_red",
                          "forgotpassword",
                          // Found on "about", but likely to exist on nation pages
                          "navy",
                          // Tournament
                          "cn_logo_tournament", "prizes", "tournament_home1", "about5"]);
// Fallback to original images?
var fallback = true;
// Restrict to #table18?
var restrict = false;
var restrictID = "table18";
// ==========================================================================

var processed = false;
var insertedCSS = false;
var failed = [];

function hasAnyClass(elt,cls) {
    var cl = elt.classList;
    for (var i = 0; i < cl.length; i++) {
        if (typeof cls === "object") {
            if (!!cls[cl[i]]) {
                return cls[cl[i]];
            }
        } else {
            for (var j = 0; j < cls.length; j++) {
                if (cl[i] === cls[j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function maybeReset(ev) {
    if (ev.srcElement) {
        var elt = ev.srcElement;
        if ((elt.complete === false || elt.naturalWidth === 0) &&
            typeof elt.getAttribute("origSrc") === "string") {
            var origSrc = elt.getAttribute("origSrc");
            failed.push(elt.className);
            if (fallback) {
                console.log("Failed to load "+elt.src+", resetting");
                elt.removeAttribute("origSrc");
                elt.src = origSrc;
            } else {
                elt.removeAttribute("origSrc");
                if (hasAnyClass(elt,classes_35)) {
                    elt.style.width = 35;
                    elt.style.height = 35;
                    elt.style.overflow = "hidden";
                }
            }
        }
    }
}

function scaleAndPad(elt,tw,th) {
    var w = elt.width;
    var h = elt.height;
    if (w > tw || h > th) {
        elt.style.maxWidth = tw;
        elt.style.maxHeight = th;
        w = elt.width;h = elt.height;
    }
    if (w < tw) {
        elt.style.paddingRight = elt.style.paddingLeft = (tw-w)/2;
    }
    if (h < th) {
        elt.style.paddingTop = elt.style.paddingBottom = (th-h)/2;
    }
}

function setPadding(ev) {
    var elt = ev.srcElement || ev.path[0];
    if (!elt.getAttribute("origSrc")) {return;}
    elt.removeAttribute("width");
    elt.removeAttribute("height");
    if (hasAnyClass(elt,classes_35)) {scaleAndPad(elt,35,35);}
    else if (hasAnyClass(elt,classes_183)) {scaleAndPad(elt,183,60);}
}

function process() {
    console.log(document.readyState);
    if (processed) {return;}
    if (document.readyState === "uninitalized") {return;}
    if (document.readyState != "loading") {
        processed = true;
    }
    if (!insertedCSS && typeof stylesheet === "string" && stylesheet !== "") {
        insertedCSS = true;
        var css_link = document.createElement("link");
        css_link.rel = "stylesheet";
        css_link.href = stylesheet;
        (document.head || document).appendChild(css_link);
    }
    var elts = (restrict ? document.getElementById(restrictID) : document).getElementsByTagName('img');
    for (var i = 0; i < elts.length; i++) {
        var x = elts[i];
        if (x.getAttribute("origSrc")) {
            continue;
        }
        var orig = x.src;
        var path = new URL(x.src).pathname;
        var parts = path.split("/");
        
        if (parts[0] === "" &&
            (parts[1] == "images" || parts[1] == "assets") &&
            (parts.length == 3 || parts.length == 4)) {
            
            var file = parts[parts.length-1];
            var dir = parts[1] + "/" + (parts.length == 4 ? parts[2] + "/" : "");
            var basename = (file.split("."))[0];
            
            if (parts.length == 4) {
                x.className += " " + parts[2] + "-" + basename.toLowerCase() + " " + parts[2];
            }
            x.className += " " + basename.toLowerCase();
            
            if (hasAnyClass(x,classes_ignore)) {
                continue;
            }
            var newurl = prefix + dir + basename.toLowerCase() + ".png";
            var custom = hasAnyClass(x,classes_replace);
            if (custom) {
                newurl = custom;
            }
            
            x.setAttribute("src", newurl);
            x.setAttribute("origSrc", orig);
            x.addEventListener('abort',maybeReset);
            x.addEventListener('error',maybeReset);
            x.onload = setPadding;
        }
    }
}
addEventListener('readystatechange', process, true);
addEventListener('load', function() {
    if (failed.length > 0) {
        console.log("Some images were not found on " + prefix + ", their CSS classes are listed below:");
        console.log(failed);
    }
});
process();
