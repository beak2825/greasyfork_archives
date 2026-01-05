// ==UserScript==
// @name         Diggy's Adventure - Game in full window
// @version      2.6
// @description  Remove useless widgets/panels in Diggy's Adventure
// @author       Vins
// @match        https://diggysadventure.com/miner/*
// @match        https://apps.facebook.com/diggysadventure/*
// @match        https://portal.pixelfederation.com/_da/miner/*
// @match        https://portal.pixelfederation.com/*/diggysadventure/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/98672
// @downloadURL https://update.greasyfork.org/scripts/26920/Diggy%27s%20Adventure%20-%20Game%20in%20full%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/26920/Diggy%27s%20Adventure%20-%20Game%20in%20full%20window.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var isFullwindow = true, miner, btn, refresh, onResize, iframe, originalHeight;
	isFullwindow = GM_getValue("DAfullwindow") !== "0";
    function forceResize() { window.dispatchEvent(new Event('resize')); }
    function getById(id) { return document.getElementById(id); }
    function iterate(el, fn) { if(el) if(typeof el.length == "number") { for(var i = el.length - 1; i >= 0; i--) { iterate(el[i], fn); } } else { fn(el); } }
    function hide(el) { if(el && el.style) { el.style.display = isFullwindow ? "none" : ""; } }

    miner = getById("miner");
    if(miner) { // inner IFRAME has a "miner" object
        originalHeight = miner.height;
        btn = document.createElement("button");
        Object.assign(btn, { innerText:"\u058e", title:"Toggle Fullwindow" });
        Object.assign(btn.style, { position:"fixed", top:(miner.offsetTop + 4) + "px", left:"4px", opacity:"0.5", backgroundColor:"#66f", color:"white", fontSize:"16pt", borderRadius:"6px", padding:"0px 2px", cursor:"pointer" });
        document.body.appendChild(btn);
        onResize = function() {
            btn.style.top = (miner.offsetTop + 4) + "px";
            miner.height = isFullwindow ? document.body.clientHeight : originalHeight;
            miner.width = isFullwindow ? document.body.clientWidth : "100%";
        };
        refresh = function() {
            GM_setValue("DAfullwindow", isFullwindow ? "1" : "0");
            // display news in a floating box
            iterate(document.getElementsByClassName("news"), function(el) { if(el && el.style) {
                var options = { position: "fixed", top: "0px", left: "64px", margin: "0px", padding: "0px" };
                for(var name in options) {
                    el.style[name] = isFullwindow ? options[name] : "";
                }
            } });
            iterate([document.getElementsByClassName("header-menu"), document.getElementsByClassName("cp_banner bottom_banner"), getById("bottom_news"), getById("footer"), getById("gems_banner")], hide);
            document.body.style.overflowY = isFullwindow ? "hidden" : "";
            Object.assign(btn.style, isFullwindow ? { backgroundColor:"white", color:"black", borderStyle:"inset" } : { backgroundColor:"#66f", color:"white", borderStyle:"outset" });
            var data = "fullwindow=" + (isFullwindow ? 1 : 0);
            try { window.parent.postMessage(data, "https://apps.facebook.com"); } catch(e) {}
            try { window.parent.postMessage(data, "https://portal.pixelfederation.com"); } catch(e) {}
            onResize();
        };
        btn.addEventListener("click", function() { isFullwindow = !isFullwindow; refresh(); });
        if(isFullwindow) { setTimeout(refresh, 5000); }
    }
    else if(getById("skrollr-body")) { // portal.pixelfederation
        onResize = function() { var t = document.getElementsByClassName("game-iframe game-iframe--da")[0]; if(t) t.style.height = isFullwindow ? window.innerHeight + "px" : ""; };
        refresh = function() {
            document.body.style.overflowY = isFullwindow ? "hidden" : "";  // remove vertical scrollbar
            iterate([getById("header"), getById("footer")], hide);
        };
    }
    else if(getById("pagelet_bluebar")) { // main document (Facebook)
        onResize = function() {
            var iframe = getById("iframe_canvas");
			if(originalHeight === undefined) originalHeight = iframe && iframe.style.height;
			if(iframe) iframe.style.height = isFullwindow ? window.innerHeight + "px" : originalHeight;
		};
        refresh = function(event) {
            document.body.style.overflowY = isFullwindow ? "hidden" : "";  // remove vertical scrollbar
            iterate([getById("rightCol"),getById("pagelet_bluebar"),getById("pagelet_dock")], hide);
        };
    }
    if(onResize) window.addEventListener("resize", onResize);
    if(refresh && !btn) window.addEventListener("message", function(event) {
        if((event.origin === "https://portal.pixelfederation.com" || event.origin === "https://diggysadventure.com") && event.data.substr(0, 11) === "fullwindow=") {
            isFullwindow = event.data.substr(11) === "1";
            refresh();
            onResize();
            setTimeout(forceResize, 2000);
        }
    });
})();