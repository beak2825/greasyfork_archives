// ==UserScript==
// @name       Jimmy Dragon
// @author		jawz
// @version    1.2
// @description Doin stuff
// @match      https://www.google.com/search*
// @match      https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/24494/Jimmy%20Dragon.user.js
// @updateURL https://update.greasyfork.org/scripts/24494/Jimmy%20Dragon.meta.js
// ==/UserScript==
var t = window.screenX;
if(document.URL.indexOf("s3.amazonaws.com") >= 0) {
    if ($('#submitButton').val() !== 'You must ACCEPT the HIT before you can submit the results.') {
        var company_text = $('h4:contains("Search URL:")').find('a').text();
        //var url = "http://www.google.com/search?q=" + company_text;
        var url = company_text;
        url = url.replace(/[" "]/g, "+");
        url = url.replace("&", "%26");

        var wleft = window.screenX;
    
        var halfScreen = window.outerWidth;
        var windowHeight = window.outerHeight;
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
        popupX = window.open(url);
        window.onbeforeunload = function (e) { popupX.close(); };

        var timer = setInterval(function(){ listenFor(); }, 250);
    }
}

if (document.URL.indexOf("google.com/search?q=") > 0) {
    var plinks = [];
    var rlinks = [];
    var bplace = [];
    var glinks = document.getElementsByClassName("r");
    
    for (i=0;i<glinks.length;i++) {
        if (i==0) {
            //plinks[i] = glinks[i].getElementsByTagName("a")[0];
            plinks[i] = document.getElementById("resultStats");
    	    var btn1 = document.createElement("BUTTON");
    	    btn1.innerHTML = "Not Available";
		   btn1.type = "button";
    	    (function(i){ btn1.onclick = function() { GM_setValue(t, "NA"); }; })(i);
    	    //plinks[i].parentNode.insertBefore(btn1,plinks[i])
            plinks[i].appendChild(btn1);
        }
            
        rlinks[i] = glinks[i].getElementsByTagName("a")[0];
    	var btn = document.createElement("BUTTON");
    	btn.innerHTML = "Submit";
		btn.type = "button";
    	(function(i){ btn.onclick = function() { GM_setValue(t, rlinks[i].href); }; })(i);
    	rlinks[i].parentNode.insertBefore(btn,rlinks[i]);
    }
}

function listenFor() {
    if (GM_getValue(t)) {
        popupX.close();
        var data = GM_getValue(t);
        $('#web_url').val(data);
        GM_deleteValue(t);
        setTimeout(function(){ 
            if ($('#web_url').val())
                $('#submitButton').click(); 
        }, 1000);
        
    }
}
