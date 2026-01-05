// ==UserScript==
// @name        jawz Crowd Task Cat
// @author      jawz
// @description   Crowd Task
// @include     *
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.5
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10664/jawz%20Crowd%20Task%20Cat.user.js
// @updateURL https://update.greasyfork.org/scripts/10664/jawz%20Crowd%20Task%20Cat.meta.js
// ==/UserScript==

var company_node;

if(document.URL.indexOf("https://www.mturk.com/") >= 0) { 
    if (document.getElementsByName("/submit").length > 0) {
        company_node = $("li:contains('Website:')").text().replace("Website: ", "");
        var industry = $("li:contains('Industry:')").text().replace("Industry: ", "");
        var popupW = window.open(company_node);
        $("title").text(industry);
        var timer = setInterval(function(){ listenFor(); }, 250);        
        window.onbeforeunload = function (e) { popupW.close(); }
    }
} else {
    var btn = document.createElement("BUTTON");
    btn.style.position = 'fixed';
    btn.style.zIndex = '1000';
    btn.style.top = '100px';
    btn.style.left = '30px';
    btn.innerHTML = 'Yes';
    btn.type = "button";
    btn.onclick = function() { sendMsg('yes'); }
    document.body.appendChild(btn);
    
    var btn = document.createElement("BUTTON");
    btn.style.position = 'fixed';
    btn.style.zIndex = '1000';
    btn.style.top = '130px';
    btn.style.left = '30px';
    btn.innerHTML = 'No';
    btn.type = "button";
    btn.onclick = function() { sendMsg('no'); }
    document.body.appendChild(btn);
    
    var btn = document.createElement("BUTTON");
    btn.style.position = 'fixed';
    btn.style.zIndex = '1000';
    btn.style.top = '160px';
    btn.style.left = '30px';
    btn.innerHTML = 'Inactive';
    btn.type = "button";
    btn.onclick = function() { sendMsg('inactive'); }
    document.body.appendChild(btn);
}

function listenFor() {
    if (GM_getValue("Msg")) {
        var data = GM_getValue("Msg");
        var pos = window.screenLeft;
        if (pos == data[1]) {
            if (data[0] == 'yes')
                $('input[class="question selection"][value ="Selection_Y29ycmVjdA--"]').prop( "checked", true );
            else if (data[0] == 'no')
                $('input[class="question selection"][value ="Selection_aW5jb3JyZWN0"]').prop( "checked", true );
            else if (data[0] == 'inactive')
                $('input[class="question selection"][value ="Selection_aW5hY3RpdmVfdXJs"]').prop( "checked", true );
            
            popupW.close();
            $('input[name="/submit"]').click();
        }
        GM_deleteValue("Msg")
    }
}

function sendMsg(msg) {
    GM_setValue("Msg", [msg, window.screenLeft]);
    setTimeout(function(){ GM_deleteValue("Msg"); }, 1000);
}
