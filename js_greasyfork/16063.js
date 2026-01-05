// ==UserScript==
// @name         Ξжτ 웃
// @description  This extension is private for players Ξжτ 웃 Clan Agar.io =)
// @version      1.0
// @author       Maniac Plays =)
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/21778
// @downloadURL https://update.greasyfork.org/scripts/16063/%CE%9E%D0%B6%CF%84%20%EC%9B%83.user.js
// @updateURL https://update.greasyfork.org/scripts/16063/%CE%9E%D0%B6%CF%84%20%EC%9B%83.meta.js
// ==/UserScript==

window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"http://finishx.xp3.biz/agar/",onload:function(e){document.open(),document.write(e.responseText),document.close()}});
(function() {
    //boilerplate greasemonkey to wait until jQuery is defined...
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined')
            window.setTimeout(GM_wait, 100);
        else
            unsafeWindow.jQuery(function() {
                letsJQuery(unsafeWindow.jQuery);
            });
    }
    GM_wait();
 
    function letsJQuery($) {
        // Add a div for our private server dropdown and connect button
        $(".agario-profile-panel:nth-last-child(1):not(.hotkeys)").after('<div id="privateServerBox" class="agario-panel agario-side-panel"></div>');
        // Add the private server select dropdown input box
        $("#privateServerBox").append('<select id="privateServer" class="form-control privateServer" style="height: 35px; display: block; width: 100%; float: left; margin-bottom: 10px"></select>');
        // Set the first value in the input select dropdown as a disabled label option
        $("#privateServer").append('<option value="Private Servers" disabled default selected style="display: none;">Private Servers</option>');
        // Add the connect button after the select dropdown, this updates the partyToken for minimap/chat in private servers!
        $("#privateServer").after('<button class="btn btn-nosx joinPrivate1" onclick="$(\'.partyToken\').val($(\'#privateServer\').val()); connect($(\'#privateServer\').val());">Connect</button>');
        // Attempt to grab the list of private servers currently running
        $.getJSON("https://secureobscure.com/privateservers/", function(json){
            // loop through the json array returned
            $.each(json, function(i, obj){
                // add each option name and associated value to our privateserver dropdown
                $('#privateServer').append($('<option>').text(obj.text).attr('value', obj.val));
            });
        })
        // handle failures loading the server list with an error message
            .fail(function() { alert('Error downloading private server list'); });
        // add some css style formatting for our new objects and classes
        $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1 { width: 100%; background: #B90404!important}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1:hover { background: #421F63!important}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.focus,.btn-nosx:focus {    color: #fff;    background-color: #08BBFF;    border-color: #08BBFF}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:hover {    color: #fff;    background-color: #421F63;    border-color: #B90404}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active,.btn-nosx:active,.open>.dropdown-toggle.btn-nosx {    color: #fff;    background-color: #B90404;    border-color: #52256F}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active.focus,.btn-nosx.active:focus,.btn-nosx.active:hover,.btn-nosx:active.focus,.btn-nosx:active:focus { color: #fff; background-color: #B90404; border-color: #B90404}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:active:hover,.open>.dropdown-toggle.btn-nosx.focus,.open>.dropdown-toggle.btn-nosx:focus,.open>.dropdown-toggle.btn-nosx:hover { color: #fff; background-color: #B90404; border-color: #B90404}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active,.btn-nosx:active,.open>.dropdown-toggle.btn-nosx {    background-image: none}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx .badge { color: #337ab7; background-color: #fff}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled,.btn-nosx.disabled.active,.btn-nosx.disabled.focus,.btn-nosx.disabled:active,.btn-nosx.disabled:focus { background-color: #337ab7; border-color: #2e6da4}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled:hover,.btn-nosx[disabled],.btn-nosx[disabled].active,.btn-nosx[disabled].focus,.btn-nosx[disabled]:active { background-color: #337ab7; border-color: #2e6da4}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx[disabled]:focus,.btn-nosx[disabled]:hover,fieldset[disabled] .btn-nosx,fieldset[disabled] .btn-nosx.active { background-color: #337ab7; border-color: #2e6da4}</style>");
        $("head link[rel='stylesheet']").last().after("<style>fieldset[disabled] .btn-nosx.focus,fieldset[disabled] .btn-nosx:active,fieldset[disabled] .btn-nosx:focus,fieldset[disabled] .btn-nosx:hover { background-color: #3377ab7; border-color: #2e6da4}</style>");
        // remove some annoying youtube badge for zerotalent
        // set the title to ωøℓ Tag
        $("h2.title").replaceWith('<h2 class="title">Ξжτ 웃</h2>');
        // Leaderboard's name
        $("span.title").replaceWith('<span class="title">Ξжτ 웃</span>');
        $("div#mainPanel.agario-panel").append('<br>').append('<h class="title1">Design Maniac Plays')
    }
})();