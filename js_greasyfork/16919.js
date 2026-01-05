// ==UserScript==
// @name         ℬℱ✿ Clan Edition
// @description  ℬℱ✿ Clan New Edition
// @version      V1.0
// @author       Barbaric.io [KιɴɢGαмιɴɢ烎]
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/16919/%E2%84%AC%E2%84%B1%E2%9C%BF%20Clan%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/16919/%E2%84%AC%E2%84%B1%E2%9C%BF%20Clan%20Edition.meta.js
// ==/UserScript==

window.stop(), document.documentElement.innerHTML = null, GM_xmlhttpRequest({
    method: "GET",
    url: "Agarplus.io",
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
            });
    }
    GM_wait();

    function letsJQuery($) {
        
               //HERE'S WHERE THE MAGIC HAPPENS
               $("div#mainPanelOverlay").append('<input type="text" placeholder=Party Rekting Timw" class="partyToken form-control">');
               $("div#mainPanelOverlay").append('<button class="btn btn-primary joinParty" onclick=$"joinParty($(".partyToken").val());">ℬℱ✿</button>');
               $("div#mainPanelOverlay").append('<button class="btn btn-success createParty" style="margin-bottom: 23px;" onclick="$(\'#helloContainer\').attr(\'data-party-state\', (\'3\'));createParty();">ℬℱ✿ Pᴀʀᴛʏ Mᴀᴋᴇʀ</button>');
                    
               //FOR AATREZ (TWITCH/TWITTER/DISCORD) USE TWO SLASHES (//) BEFORE TO DISABLE THEM. 
               $("div#mainPanelOverlay").append('<hr>').append('<h class="title2"><a href="https://www.youtube.com/channel/UCayVlZTtwwsYBbpFuI4Ynpw" class="text-muted" target="_blank" data-itr="forum"><center>Cʟɪᴄᴋ Fᴏʀ SᴜᴘᴇʀMᴀɴs YᴏᴜTᴜʙᴇ﹗</center></a></font>')
               $("div#mainPanelOverlay").append('<hr>').append('<h class="title2"><a href="https://www.youtube.com" class="text-muted" target="_blank" data-itr="forum"><center>Cʟᴀɴ Yᴏᴜᴛᴜʙᴇ Cᴏᴍɪɴɢ Sᴏᴏɴ﹗</center></a></font>')
               //$("div#mainPanelOverlay").append('<hr>').append('<div id="privateServerBox" class=""></div>');
                    
               //HOTKEYS CURRENTLY AT ORANGE. DELETE ALL "<font color="orange" BEFORE EACH HOTKEY. 
               $("div.hotkeys").replaceWith('<div class="agario-panel agario-side-panel agario-profile-panel hotkeys" style="display: block !important;"><span class="hotkey"><font color="FF9100">[E]</span><font color="white"> Macro<br><span class="hotkey"><font color="FF9100">[X]</span><font color="white">Reset Zoom<br><span class="hotkey"><font color="FF9100">[S]</span><font color="white">Stop Movement<br><span class="hotkey"><font color="FF9100">[H]</span><font color="white">Commands<br><span class="hotkey"><font color="FF9100">[L]</span><font color="white">Copy Leaderboard<br><hr><span class="hotkey"><font color="FF9100">[C]</span><input type="checkbox" id="toggleChat" class="?toggle?"><font color="white">Chat<br><span class="hotkey"><font color="FF9100">[N]</span><input type="checkbox" id="toggleCustomSkins" class="?toggle?"><font color="white">Skins<br><span class="hotkey"><font color="FF9100">[M]</span><input type="checkbox" id="toggleMap" class="?toggle?"><font color="white"> Minimap<br><span class="hotkey"><font color="FF9100">[G]</span><input type="checkbox" id="toggleGrid" class="?toggle?"><font color="white"> Grid<br><span class="hotkey"><font color="FF9100">[P]</span><input type="checkbox" id="togglePellets" class="?toggle?"><font color="white"> Pellets<br><span class="hotkey"><font color="FF9100">[J]</span><input type="checkbox" id="toggleRainbowPellets" class="?toggle?"><font color="white">Rainbow Pellets<br><span class="hotkey"><font color="FF9100">[B]</span><input type="checkbox" id="toggleRainbowFeeds" class="?toggle?"><font color="white"> Rainbow Feeds<br><span class="hotkey"><font color="FF9100">[V]</span><input type="checkbox" id="toggleTransparentVirus" class="?toggle?"><font color="white"> Transparent Viruses<br><span class="hotkey"><font color="FF9100">[K]</span><input type="checkbox" id="toggleCursorLines" class="?toggle?"><font color="white"> Cursor Line<br><span class="hotkey"><font color="FF9100">[X]</span><input type="checkbox" id="toggleManualZoom" class="?toggle?"><font color="white"> Manual Zoom<br><span class="hotkey"><font color="FF9100">[T]</span><input type="checkbox" id="toggleTransparency" class="?toggle?"><font color="white">Transparency<br><span class="hotkey"><font color="FF9100">[I]</span><input type="checkbox" id="toggleIndicators" class="?toggle?"><font color="white">Split Color Indicator<br><span class="hotkey"><font color="FF9100">[U]</span><input type="checkbox" id="togglePlayerSplitGuide" class="?toggle?"><font color="white">Split Radius<br><span class="hotkey"><font color="FF9100">[O]</span><input type="checkbox" id="toggleEnemySplitGuides" class="?toggle?"><font color="white"> Enemy Split Radius<br><span class="hotkey"><font color="FF9100">[.]</span><input type="checkbox" id="toggleBlobMass" class="?toggle?"><font color="white">Mass<br><span class="hotkey"><font color="FF9100">[,]</span><input type="checkbox" id="togglePlayerNames" class="?toggle?"><font color="white"> Names<br><span class="hotkey"><font color="FF9100">[/]</span><input type="checkbox" id="toggleStrokes" class="?toggle?"><font color="white"> Strokes<br><span class="hotkey"><font color="FF9100">[R]</span><input type="checkbox" id="toggleRSplit" class="?toggle?"><font color="white"> Split<br><span class="hotkey"><font color="FF9100">[Q]</span><input type="checkbox" id="toggleDoubleSplit" class="?toggle?"><font color="white"> Double Split<br><span class="hotkey"><font color="FF9100">[SHIFT]</span><input type="checkbox" id="toggleSplitSixteen" class="?toggle?"><font color="white">Sixteen Split</div>');
               //REPLACE HEADER/TITLE AND LEADERBOARD HEADER/TITLE
               $("h2.aTitle").replaceWith('<h2 class="aTitle"><font color="Gold">✿ <font color="#1c76ac">ℬℱ✿ adιτισπ<font color="Gold"> ✿</h2>');
               $("span.lbTitle").replaceWith('<span class="lbTitle"><font color="Gold">✿<font color="#1c76ac">ℬℱ✿<font color="Gold">✿</span>');
                    
               //CUSTOMIZE THEME SIDE PANEL
               $("#ThemeBackground").append('<select id="background" class="form-control" onchange="setBackground($(\'#background\').val());" required="" style="margin-bottom: 10px !important;"><option value="Dark">Dark Side</option><option value="light">Light Theme</option></select><select id="theme" class="form-control" onchange="setTheme($(\'#theme\').val());" required=""><option value="blue">Blue</option><option value="cyan">Cyan</option><option value="red">Red</option><option value="orange">Orange</option><option value="yellow">Yellow</option><option value="green">Green flavor</option><option value="pink">Pink</option><option value="purple">Purple</option><option value="grey">Grey</option></select></div>')
               $(".adsbygoogle").remove();
        
               //TEAM TAGS DROPDOWN - =====DOES NOT WORK ANYMORE=====
               $('#teamNameList').empty();
               $('#teamNameList').append($('<option>').text('?').attr('value', '?'));
               $('#teamNameList').append($('<option>').text('ΛƬ?').attr('value', 'ΛƬ?'));
               $('#teamNameList').append($('<option>').text('ƵŦ✿').attr('value', 'ƵŦ✿'));
               $('#teamNameList').append($('<option>').text('ᓮᗯᗩᘐ夔').attr('value', 'ᓮᗯᗩᘐ夔'));
               $('#teamNameList').append($('<option>').text('《ℝ》').attr('value', '《ℝ》'));
               $('#teamNameList').append($('<option>').text('ㄅЯ').attr('value', 'ㄅЯ'));
               $('#teamNameList').append($('<option>').text('ℛɨᎮ').attr('value', 'ℛɨᎮ'));
               $('#teamNameList').append($('<option>').text('ℬℱ✿').attr('value', 'ℬℱ✿'));
               $('#teamNameList').append($('<option>').text('ℬℱ✿').attr('value', 'ℬℱ✿'));
    }
})();