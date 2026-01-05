// ==UserScript==
// @name         monnsutogatya_reload
// @namespace    http://qqboxy.blogspot.com/
// @version      0.2
// @description  Reload tool.
// @author       QQBoxy
// @match        http://tw.monnsutogatya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12766/monnsutogatya_reload.user.js
// @updateURL https://update.greasyfork.org/scripts/12766/monnsutogatya_reload.meta.js
// ==/UserScript==


(function() {
    var ms = null;
    var started = null;
    var refreshTimmer = null;
    var keyTimer = null;
    
    var getCookie = function(name) {
        var n = name + "=";
        var nlen = n.length;
        var clen = document.cookie.length;
        var i = 0;
        while(i < clen) {
            var j = i + nlen;
            if(document.cookie.substring(i, j) == n) {
                var endstr = document.cookie.indexOf(";", j);
                if(endstr == -1)
                    endstr = clen;
                return unescape(document.cookie.substring(j, endstr));
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if(i == 0) break;
        }
        return null;
    };
    
    var set = function() {
        var c_started = getCookie("c_started");
        var c_ms = getCookie("c_ms");
        if(c_ms && ms==null) {
        	ms = c_ms;
        } else if(!c_ms && ms==null) {
        	ms = 60000;
        }
        document.cookie = "c_ms=" + escape(ms);
        document.getElementById('secboxy').value = ms/1000;
        
        if(c_started && started==null) {
	    	if(c_started=="true") {
	    		started = true;
	    	} else if(c_started=="false") {
	    		started = false;
	    	}
        } else if(!c_started && started==null) {
        	started = false;
        }
        document.cookie = "c_started=" + escape(started);
        clearTimeout(refreshTimmer);
    	if(started) {
            document.getElementById('startboxy').innerHTML = "Pause";
            refreshTimmer = setTimeout(function(){
		        location.reload();
		    }, ms);
        } else {
            document.getElementById('startboxy').innerHTML = "Start";
        }
    };
    
    var tbox = document.getElementById("t-box");
    var ctrl = document.createElement("div");
    var start = document.createElement("button");
    start.setAttribute("id", "startboxy");
    start.onclick = function() {
        if(started) {
            started = false;
        } else {
            started = true;
        }
        set();
    };
    
    var sec = document.createElement("input");
    sec.setAttribute("id", "secboxy");
    sec.onkeyup = function() {
    	if(keyTimer) clearTimeout(keyTimer);
		keyTimer = setTimeout(function() {
			ms = parseInt(document.getElementById('secboxy').value, 10) * 1000;
	    	if(ms>=5000) {
		        set();
	        } else {
	        	alert("不允許小於5秒");
	        }
		}, 500);
    };
    
    ctrl.appendChild(start);
    ctrl.appendChild(sec);
    tbox.parentNode.insertBefore(ctrl, tbox);
    
    set();
})();