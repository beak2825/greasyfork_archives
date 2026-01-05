// ==UserScript==
// @name         ᏩᎿ✿ Extension
// @description  Extension para el clan GT
// @version      1.0
// @author       ᏩᎿ✿
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/24985
// @downloadURL https://update.greasyfork.org/scripts/15737/%E1%8F%A9%E1%8E%BF%E2%9C%BF%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/15737/%E1%8F%A9%E1%8E%BF%E2%9C%BF%20Extension.meta.js
// ==/UserScript==
 
window.stop(), document.documentElement.innerHTML = null, GM_xmlhttpRequest({
    method: "GET",
    url: "http://gtxextension.webcindario.com/",
    onload: function(e) {
    document.open(), document.write(e.responseText), document.close()
    }
});       
             
(function() {
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined')
            window.setTimeout(GM_wait, 100);
        else
            unsafeWindow.jQuery(function() {
                letsJQuery(unsafeWindow.jQuery);
                
    if (location.host == "agar.io" && location.pathname == "/") {
		location.href = "http://agar.io/GoTeamYT" + location.hash;
		return;
	}                
                             
            });
    }
    GM_wait();
 
    function letsJQuery($) {
        //MadeByCik
        //Please, read the Description in GreasyFork. Thanks a lot!
        $(".adsbygoogle").remove();
        $("h2.extTitle").replaceWith('<h2 style="color: #5c009a" class="extTitle">ᏩᎿ✿</h2>');
        $("span.leaderboardTitle").replaceWith('<span style="color: #5c009a" class="leaderboard Title">ᏩᎿ✿</span>');
        //Please, read the Description in GreasyFork. Thanks a lot!
        $(".agarioProfilePanel:nth-last-child(1):not(.hotkeys)").remove();
        $(".agarioProfilePanel:nth-last-child(1):not(.hotkeys)").before('<div id="LvlWillBeFixed" class="agario-panel agario-side-panel agario-profile-panel level"></div>')
        $("#LvlWillBeFixed").append('<div style="position: relative; margin-bottom: -15px;" class="clearfix"><div class="agario-exp-bar progress"><span class="progress-bar-text">0/504500</span><div class="progress-bar progress-bar-striped" style="width: 0.00%;"></div></div><div class="progress-bar-border"></div><div class="progress-bar-star">100</div></div>').append('<h20></h20>')
        $("#LvlWillBeFixed").append('<div style="display: none" class="agario-loggedout-panel"><h4>Log in Facebook</h4></div>')
        $(".agarioProfilePanel:nth-last-child(1):not(.hotkeys)").after('<div id="CikYouTubeChannelBox" class="agario-panel agario-side-panel"></div>')
        $("#CikYouTubeChannelBox").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCPDEmCf3J1AYdEB7ebCUiXQ" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
        $("#CikYouTubeChannelBox").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UC2gMjlxJmapKxr5qpO7T1tA" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
        $("#CikYouTubeChannelBox").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCn-VH3-Pufbsgi8XsNm0Kbw" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
        $("#CikYouTubeChannelBox").append('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" data-channelid="UCEZ9GpOXwK3-7fgGotPH6Gw" data-layout="full" data-theme="dark" data-count="default" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 163px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 163px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;"></div>');
        
        //Please, read the Description in GreasyFork. Thanks a lot!
        $("div#mainPanelOverlay.agario-panel").append('<br>').append('<br>').append('<br>').append('<hr>').append('<br>').append('<div id="privateServerBox" class=""></div>')
        $("#privateServerBox").append('<select id="privateServer" class="form-control privateServer" style="height: 35px; display: block; width: 100; float: left; margin-bottom: 10px"></select>');
        $("#privateServer").append('<option value=">ᏩᎿ✿ Private Servers" disabled default selected style="display: none;">ᏩᎿ✿ Private Servers  <option value="ws://dmr.secureobscure.com:4444">Juegos Del Hambre 1</option><option value="ws://dmr.secureobscure.com:4111">Juegos Del Hambre 2</option><option value="ws://dmr.secureobscure.com:4001">FFA1 Ultra Split</option><option value="ws://dmr.secureobscure.com:4002">FFA2 Normal</option><option value="ws://dmr.secureobscure.com:4021">Experimental 1</option><option value="ws://evo1001001.cloudapp.net:666">Spliturring battle</option><option value="ws://70.35.196.193:443">NBK Private</option><option value="ws://vps56296.vps.ovh.ca:443">Canada</option><option value="ws://185.38.150.87:443">Servidor 1</option><option value="ws://85.118.134.139:999">Servidor 2</option><option value="ws://vps56296.vps.ovh.ca:443">Servidor 3</option><option value="ws://vps62061.vps.ovh.ca:443">Servidor 4</option><option value="ws://fr.agary.info:447">Servidor 5</option><option value="ws://vps62061.vps.ovh.ca:443">Servidor 6');
        $("#privateServer").after('<button class="btn btn-nosx joinPrivate1" style="margin-bottom: 12px" onclick="$(\'.partyToken\').val($(\'#privateServer\').val()); connect($(\'#privateServer\').val());">Entrar</button>');
        //Please, read the Description in GreasyFork. Thanks a lot!
        $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1 { width: 100%; background: #000a9f!important}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.joinPrivate1:hover { background: #000a9f!important}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.focus,.btn-nosx:focus {    color: #fff;    background-color: #000a9f;    border-color: #000a9f}</style>");
        //Please, read the Description in GreasyFork. Thanks a lot!
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:hover {    color: #fff;    background-color: #000a9f;    border-color: #000a9f}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active.focus,.btn-nosx.active:focus,.btn-nosx.active:hover,.btn-nosx:active.focus,.btn-nosx:active:focus { color: #fff; background-color: #79822b; border-color: #79822b}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx:active:hover,.open>.dropdown-toggle.btn-nosx.focus,.open>.dropdown-toggle.btn-nosx:focus,.open>.dropdown-toggle.btn-nosx:hover { color: #fff; background-color: #79822b; border-color: #421F63}</style>");
        //Please, read the Description in GreasyFork. Thanks a lot!
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.active,.btn-nosx:active,.open>.dropdown-toggle.btn-nosx {    background-image: none}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx .badge { color: #79822b; background-color: #fff}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled,.btn-nosx.disabled.active,.btn-nosx.disabled.focus,.btn-nosx.disabled:active,.btn-nosx.disabled:focus { background-color: #79822b; border-color: #79822b}</style>");
        //Please, read the Description in GreasyFork. Thanks a lot!
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx.disabled:hover,.btn-nosx[disabled],.btn-nosx[disabled].active,.btn-nosx[disabled].focus,.btn-nosx[disabled]:active { background-color: #79822b; border-color: #79822b}</style>");
        $("head link[rel='stylesheet']").last().after("<style>.btn-nosx[disabled]:focus,.btn-nosx[disabled]:hover,fieldset[disabled] .btn-nosx,fieldset[disabled] .btn-nosx.active { background-color: #79822b; border-color: #79822b}</style>");
        $("head link[rel='stylesheet']").last().after("<style>fieldset[disabled] .btn-nosx.focus,fieldset[disabled] .btn-nosx:active,fieldset[disabled] .btn-nosx:focus,fieldset[disabled] .btn-nosx:hover { background-color: #79822b; border-color: #79822b}</style>");
        //Please, read the Description in GreasyFork. Thanks a lot!
        //MadeByCik
        $.getJSON("", function(json){
            $.each(json, function(i, obj){
            });
        }) 
    }
})();