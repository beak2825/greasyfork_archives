// ==UserScript==
// @name         Reddit domain share user list
// @namespace    org.thorlancaster.redditdomainuserparser
// @version      0.1
// @description  Compile list of users who have shared links from a domain on Reddit. Useful for spammer busting
// @author       Thor Lancaster
// @match        https://www.reddit.com/domain*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418209/Reddit%20domain%20share%20user%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/418209/Reddit%20domain%20share%20user%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var helpText =
        "<ol style='list-style: initial'><li>Go to a reddit.com domain page</li>"+
        "<li>Click \"Add this page\" button for each page of posts</li>"+
        "<li>When finished, click \"Expor\"</li><li>Remember to clear pages when done to prevent old, possibly banned users.</li></ol>";
    // Utility Functions
    var DGE = function(name){
        return document.getElementById(name);
    }
    var DCE = function(name){
        return document.createElement(name);
    }
    // UI functions
    // Show a modal message box
    var showMessageBox = function(titleTxt, txt){
        var root = DCE("div");
        var rs = root.style;
        root.id = "fpe-alert";
        rs.position = "fixed";
        rs.zIndex = "9999999";
        rs.width = "100%";
        rs.height = "100%";
        rs.top = "0px";
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
        bts.bottom = "1rem";
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
    // Create and return the UI element
    var createUIPane = function(){
        var root = DCE("div");
        var rs = root.style;
        rs.position = "fixed";
        rs.bottom = "0px";
        rs.width = "10rem";
        rs.right = "0px";
        rs.borderRadius = "0.5rem";
        rs.background = "#0A2132";
        rs.color = "#FFF";
        rs.textAlign = "center";
        ////////
        var title = DCE("div");
        title.innerHTML = "Reddit Domain<br/>Exporter<br/>";
        var ts = title.style;
        ts.fontSize = "1.5em";
        ts.padding = "0.3em";
        ts.background = "#FF9204";
        ts.borderTopLeftRadius = ts.borderTopRightRadius = "0.5rem";
        root.appendChild(title);
        ////////
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
        ////////
        for(var x = 0; x < 4; x++){
            var txt = "Button " + x;
            if(x == 0) txt = "Add this page";
            if(x == 1) txt = "Clear pages";
            if(x == 2) txt = "Export list";
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
        } else if(num == 1){
            clearPages();
        } else if(num == 2){
            exportData();
        } else if(num == 3){
            showHelp();
        }
    }
    // Data parsing functions
    var addThisPage = function(){
        var fpeDatabase = fpeDatabase = JSON.parse(sessionStorage.getItem("fpe-database"));
        if(fpeDatabase == null){
            fpeDatabase = {};
        }
        //////////////// BEGIN DATA SCRAPING
        var rows = document.getElementsByClassName("top-matter");
        for(var x = 0; x < rows.length; x++){
            var row = rows[x];
            var user = row.getElementsByClassName("author")[0];
            if(!user) continue;
            user = "u/" + user.textContent;

            var count = fpeDatabase[user] | 0;

            Object.defineProperty(fpeDatabase, user, {
                value: count + 1,
                writable: true,
                enumerable: true
            });
        }
        //////////////// END DATA SCRAPING
        sessionStorage.setItem("fpe-database", JSON.stringify(fpeDatabase));
    }
    var clearPages = function(){
        sessionStorage.removeItem("fpe-database");
    }
    var exportData = function(){
        var fpeDatabase = JSON.parse(sessionStorage.getItem("fpe-database"));
        if(fpeDatabase != null){
            showMessageBox("List of accounts", "<pre>" + formatOutput(fpeDatabase) + "</pre>");
        } else {
            setStatusText("No data yet. Add some pages first.");
        }
    }
    var formatOutput = function(db){
        console.log(db);
        var rtn = "";
        for(var key in db){
            rtn += key + " " + db[key] + "<br/>";
        }
        return rtn;
    }
    var showHelp = function(){
        showMessageBox("How to use", helpText);
    }
    // Main function
    var init = function(){
        var ui = createUIPane();
        document.body.appendChild(ui);
    }
    init();
})();