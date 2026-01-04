// ==UserScript==
// @name         HideMyName Free Proxy exporter (PLAIN TEXT) modified by me
// @version      1.0
// @namespace    thorlancaster, HashCrusher
// @description  Export IP:PORT from HideMyName into a TXT file. Premium membership NOT required
// @author       thorlancaster, HashCrusher
// @license MIT
// @match        https://hidemy.io/*/proxy-list/*
// @match        https://hidemy.name/*/proxy-list/*
// @match        https://hidemyna.me/*/proxy-list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hidemy.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486527/HideMyName%20Free%20Proxy%20exporter%20%28PLAIN%20TEXT%29%20modified%20by%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/486527/HideMyName%20Free%20Proxy%20exporter%20%28PLAIN%20TEXT%29%20modified%20by%20me.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize pagesAdded counter from localStorage
var pagesAdded = parseInt(localStorage.getItem('pagesAdded')) || 0;
var proxiesAdded = parseInt(localStorage.getItem('proxiesAdded')) || 0;

    var helpText =
        "<ol style='list-style: initial'><li>Use the site to generate a list of proxies you want</li>"+
        "<li>Click \"Add this page\" button for each page of proxies</li>"+
        "<li>When finished, click \"Export Plain Text\"</li><li>Remember to clear pages when done to prevent old, possibly expired proxies.</li></ol>";

    // Utility Functions
    var DGE = function(name){
        return document.getElementById(name);
    }

    var DCE = function(name){
        return document.createElement(name);
    }

    // UI functions
    var showMessageBox = function(titleTxt, txt){
        var root = DCE("div");
        var rs = root.style;
        root.id = "fpe-alert";
        rs.position = "fixed";
        rs.zIndex = "9999999";
        rs.width = "100%";
        rs.height = "100%";
        rs.top = "0px";
        rs.left = "0px";
        rs.background = "#0A2132";
        rs.color = "#FFF";
        rs.fontSize = "1.2em";
        var title = DCE("div");
        title.innerHTML = titleTxt;
        var ts = title.style;
        ts.fontSize = "1.5em";
        ts.padding = "0.5em";
        root.appendChild(title);
        var msg = DCE("div");
        msg.innerHTML = txt;
        var mss = msg.style;
        mss.padding = "2%";
        mss.border = "1px solid #777";
        mss.width = "95%";
        mss.maxHeight = "90%";
        mss.maxHeight = "calc(100% - 6rem)";
        mss.overflowY = "auto";
        root.appendChild(msg);
        var exit = DCE("button");
        var bts = exit.style;
        bts.position = "fixed";
        bts.bottom = "0px";
        bts.color = "#000";
        bts.background = "#1CD798";
        bts.padding = "0.5em";
        bts.borderRadius = "0.2rem";
        bts.border = "none";
        bts.fontSize = "1.1rem";
        exit.innerText = "Back to site";
        exit.onclick = function(){
            DGE("fpe-alert").parentElement.removeChild(DGE("fpe-alert"));
        }
        root.appendChild(exit);
        document.body.appendChild(root);
    }

var createUIPane = function(){
    var root = DCE("div");
    var rs = root.style;
    rs.position = "fixed";
    rs.bottom = "0px";
    rs.width = "10rem";
    rs.borderRadius = "0.5rem";
    rs.background = "#0A2132";
    rs.color = "#FFF";
    rs.textAlign = "center";

    var title = DCE("div");
    title.innerHTML = "Plain Text Proxy<br/>Exporter<br/>";
    var ts = title.style;
    ts.fontSize = "1.5em";
    ts.padding = "0.3em";
    ts.background = "#FF9204";
    ts.borderTopLeftRadius = ts.borderTopRightRadius = "0.5rem";
    root.appendChild(title);

    // Create a div to display the proxies added counter
var counterDiv = DCE("div");
counterDiv.id = "proxies-counter";
var counterStyle = counterDiv.style;
counterStyle.padding = "0.5em";
counterStyle.fontSize = "1rem";
counterDiv.innerText = "Pages added: " + pagesAdded + "  Proxies added: " + proxiesAdded;
root.appendChild(counterDiv);

    var status = DCE("div");
    status.id = "fpe-status";
    var ss = status.style;
    ss.display = "none";
    ss.position = "absolute";
    ss.top = "2rem";
    ss.left = "10rem";
    ss.width = "10rem";
    ss.minHeight = "3rem";
    ss.borderRadius = "0.5em";
    ss.background = "#0A2132";
    root.appendChild(status);

    for(var x = 0; x < 4; x++){
        var txt = "Button " + x;
        if(x == 0) txt = "Add this page";
        if(x == 1) txt = "Clear pages";
        if(x == 2) txt = "Export Plain Text";
        if(x == 3) txt = "How to use";
        var btn = DCE("button");
        var bts = btn.style;
        bts.color = "#000";
        bts.padding = "0.5em";
        bts.borderRadius = "0.2rem";
        bts.border = "none";
        bts.fontSize = "1.1rem";
        if(x == 3){
            bts.fontSize = "0.8rem";
        }
        if(x == 2) { // Emphasized
            bts.background = "#1CD798";
            btn.nNmBg = "#1CD798";
            btn.nHvBg = "#15AE7A";
        } else { // Normal
            bts.background = "#1C98D7";
            btn.nNmBg = "#1C98D7";
            btn.nHvBg = "#157AAE";
        }
        btn.dataset.btnNum = x;
        btn.onmouseover = function(){this.style.background = this.nHvBg;}
        btn.onmouseout = function(){this.style.background = this.nNmBg;}
        btn.onclick = onButtonClick;
        var bdiv = DCE("div");
        var bs = bdiv.style;
        bs.height = "3rem";
        bs.display = "flex";
        bs.alignItems = "center";
        bs.justifyContent = "center";
        btn.innerHTML = txt;
        bdiv.appendChild(btn);
        root.appendChild(bdiv);
    }

    return root;
}

    var stTimer = null;

    var setStatusText = function(stTxt){
        clearTimeout(stTimer);
        stTimer = setTimeout(function(){
            DGE("fpe-status").style.display = "none";
        }, 2200);
        var el = DGE("fpe-status");
        el.style.display = "block";
        el.innerHTML = stTxt;
    }

    var onButtonClick = function(){
        var num = this.dataset.btnNum;
        if(num == 0){
            addThisPage();
            // Increment pagesAdded counter
            pagesAdded++;
            updateProxiesCounter();
        } else if(num == 1){
            clearPages();
        } else if(num == 2){
            exportPlainText();
        } else if(num == 3){
            showHelp();
        }
    }

var updateProxiesCounter = function() {
    var counterElement = DGE("proxies-counter");
    if (counterElement) {
        counterElement.innerText = "Pages added: " + pagesAdded + "  Proxies added: " + proxiesAdded;
        // Store both counters in localStorage
        localStorage.setItem('pagesAdded', pagesAdded.toString());
        localStorage.setItem('proxiesAdded', proxiesAdded.toString());
    }
}

var addThisPage = function(){
    var fpeDatabase = JSON.parse(localStorage.getItem("fpe-database")) || {};

    var table = document.getElementsByClassName("table_block")[0].getElementsByTagName("table")[0];
    var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for(var x = 0; x < rows.length; x++){
        var row = rows[x];
        var tds = row.getElementsByTagName("td");
        var ip = tds[0].innerText;
        var port = tds[1].innerText;
        var entry = ip + ":" + port;

        // Check if the entry doesn't already exist in the database
        if (!fpeDatabase[entry]) {
            Object.defineProperty(fpeDatabase, entry, {
                value: entry,
                writable: true,
                enumerable: true
            });
            proxiesAdded++; // Increment proxiesAdded counter
        }
    }

    localStorage.setItem("fpe-database", JSON.stringify(fpeDatabase));
    updateProxiesCounter();
}

var clearPages = function(){
    localStorage.removeItem("fpe-database");
    pagesAdded = 0;
    proxiesAdded = 0; // Reset proxiesAdded counter
    updateProxiesCounter();
}

    var exportPlainText = function(){
        var fpeDatabase = JSON.parse(localStorage.getItem("fpe-database"));
        if(fpeDatabase != null){
            var plainTextOutput = Object.keys(fpeDatabase).join('\n');
            showMessageBox("Plain Text Output", "<pre>" + plainTextOutput + "</pre>");
        } else {
            setStatusText("No data yet. Add some pages first.");
        }
    }

    var showHelp = function(){
        showMessageBox("How to use", helpText);
    }

    var init = function(){
        var ui = createUIPane();
        document.body.appendChild(ui);
    }

    init();
})();