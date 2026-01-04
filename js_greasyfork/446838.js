// ==UserScript==
// @name         LRTV
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Make money automating rewareded tv - added Loot tv videos- random skip ads (not every ad)
// @match        https://loot.tv/rewardedtv
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loot.tv
// @author      Bboy Tech
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446838/LRTV.user.js
// @updateURL https://update.greasyfork.org/scripts/446838/LRTV.meta.js
// ==/UserScript==
(function() {
    if(window.location.href == "https://loot.tv/rewardedtv") {
        var claimaTimer = setInterval (function() {claima(); }, Math.floor(Math.random() * 500) + 500);
        var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 500) + 500);
        var claimcTimer = setInterval (function() {claimc(); }, Math.floor(Math.random() * 4000) + 4000);
        var claimc1Timer = setInterval (function() {claimc1(); }, Math.floor(Math.random() * 4000) + 4000);
        var claimc2Timer = setInterval (function() {claimc2(); }, Math.floor(Math.random() * 4000) + 4000);
        var claimc3Timer = setInterval (function() {claimc3(); }, Math.floor(Math.random() * 4000) + 4000);
        var clickTimer = setInterval (function() {click1(); }, Math.floor(Math.random() * 1000) + 10000);
        var claimc4Timer = setInterval (function() {claimc4(); }, Math.floor(Math.random() * 150000) + 150000);
        var refreshTimer = setInterval (function() {refresh(); }, Math.floor(Math.random() * 1800000) + 1800000);
        function claima() {
            document.querySelector('.rewardedtv_playButtonWrapper__JPHsP').click();
        }
        function claimb() {
            document.querySelector('#aipPauseButton').click();
        }
        function claimc() {
            document.querySelector('.cpmsvideowrapper > a:nth-child(1) > video:nth-child(2)').click();
        }
        function claimc1() {
            document.querySelector('#aipPrerollContainer > div:nth-child(1) > div:nth-child(1) > video:nth-child(2)').click();
        }
        function claimc2() {
            document.querySelector('#aipPrerollContainer > div:nth-child(1) > div:nth-child(1) > lima-video:nth-child(1)').click();
        }
        function claimc3() {
            document.querySelector('#aipPrerollContainer > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)').click();
        }
        function claimc4() {
            var test = document.getElementsByClassName("Topnav_balanceDisplay__D2UKj")[0].innerHTML;
            test = test.replace("<span>", "");
            test = test.replace("<!-- --> Points</span>", "");
            test = Number(test);
                var interval = setInterval(function(){
                     var test1 = document.getElementsByClassName("Topnav_balanceDisplay__D2UKj")[0].innerHTML;
                     test1 = test1.replace("<span>", "");
                     test1 = test1.replace("<!-- --> Points</span>", "");
                     test1 = Number(test1);
                     if(test == test1){
                        location.href = "https://loot.tv/rewardedtv";
                    }
                }, 150000);
        }
        function refresh(){
                location.href = "https://loot.tv/rewardedtv";
        }
        function click1() {
           var x = (Math.floor(Math.random() * 200) + 400);
           var y = (Math.floor(Math.random() * 200) + 300);
           document.elementFromPoint(x, y).click();
        }
    }
    else if(window.location.href == "https://loot.tv/redeem"){
        var redeemTimer = setInterval (function() {redeem(); }, Math.floor(Math.random() * 500) + 500);
        var redeem1Timer = setInterval (function() {redeem1(); }, Math.floor(Math.random() * 5000) + 5000);
        function redeem() {
            var test = document.getElementsByClassName("Topnav_balanceDisplay__D2UKj")[0].innerHTML;
            test = test.replace("<span>", "");
            test = test.replace("<!-- --> Points</span>", "");
            test = Number(test);
            if(test > 500){
                document.querySelector('#__next > div > div._app_mainWrappr__G3eiJ > div._app_contentWrapper__KFde2 > div > div > div.redeem_redeemPointsSectionWrapper__jSQP4 > div.redeem_pointCountColumn__6YFbX > div.redeem_balanceBox__2CzFs > div.redeem_boxBody___fUA3 > div.redeem_redeemButtonWrapper__EWQzb > button').click();
                document.querySelector('body > div.ReactModalPortal > div > div > div.Modal_modalContent__80NGX > div > div.RedeemModal_selectPlacementWrapper__obec2 > div > div.Dropdown_iconWrapper__mRmmP').click();
                document.querySelector('body > div.ReactModalPortal > div > div > div.Modal_modalContent__80NGX > div > div.RedeemModal_selectPlacementWrapper__obec2 > div > div.Dropdown_modalDropdown__Q_6_m > div').click();
                document.querySelector('body > div.ReactModalPortal > div > div > div.Modal_modalContent__80NGX > div > div.RedeemModal_redeemButtonWrapper__ndyh1 > button').click();
             }
            else{
                location.href = "https://loot.tv/redeem";
            }
        }
        function redeem1() {
            location.href = "https://loot.tv/redeem";
        }
    }
    else if(location.href.match("loot.tv/video/")){
        //document.getElementsByClassName("_videoID__recommendedVideosColumn__DyqAF")[0].remove();
        //document.getElementsByClassName("_videoID__descriptionWrapper__taEqM")[0].remove();
        var claimaVTimer = setInterval (function() {claimaV(); }, 500);
        var claimbVTimer = setInterval (function() {claimbV(); }, 500);
        var claimcVTimer = setInterval (function() {claimcV(); }, 60000);
        var claimdVTimer = setInterval (function() {claimdV(); }, 500);
        var claimeVTimer = setInterval (function() {claimeV(); }, 3000);
        //var claimgVTimer = setInterval (function() {claimgV(); }, 500);
        var a = ["https://loot.tv/video/672685", "https://loot.tv/video/672566", "https://loot.tv/video/672561","https://loot.tv/video/671731","https://loot.tv/video/671762","https://loot.tv/video/672670","https://loot.tv/video/672674","https://loot.tv/video/672014","https://loot.tv/video/672574","https://loot.tv/video/672028","https://loot.tv/video/672578","https://loot.tv/video/672647","https://loot.tv/video/672539","https://loot.tv/video/671715","https://loot.tv/video/672625","https://loot.tv/video/672710","https://loot.tv/video/672579","https://loot.tv/video/671709","https://loot.tv/video/672561","https://loot.tv/video/672678","https://loot.tv/video/672496","https://loot.tv/video/671711","https://loot.tv/video/672450","https://loot.tv/video/672672","https://loot.tv/video/671735","https://loot.tv/video/671955","https://loot.tv/video/672673","https://loot.tv/video/671637","https://loot.tv/video/672636","https://loot.tv/video/672679","https://loot.tv/video/672507","https://loot.tv/video/672403","https://loot.tv/video/671734","https://loot.tv/video/672451","https://loot.tv/video/671753","https://loot.tv/video/671948","https://loot.tv/video/671703","https://loot.tv/video/671725","https://loot.tv/video/671713","https://loot.tv/video/672669","https://loot.tv/video/672498","https://loot.tv/video/671881","https://loot.tv/video/672700","https://loot.tv/video/671807","https://loot.tv/video/671897","https://loot.tv/video/672442","https://loot.tv/video/672677","https://loot.tv/video/671721","https://loot.tv/video/672662","https://loot.tv/video/671991","https://loot.tv/video/671742","https://loot.tv/video/672705","https://loot.tv/video/671877","https://loot.tv/video/672675","https://loot.tv/video/672689"]
        function claimaV() {
            var b = window.location.href;
            if(a.includes(b)) {
                document.querySelector('#__next > div > div._app_mainWrappr__G3eiJ > div._app_sidenavClosed__EhKlt._app_contentWrapper__KFde2 > div > div > div._videoID__videoInformationColumn__KLKrZ > div._videoID__videoPlayerWrapper__X2Uvb > cnx > cnx > cnx.cnx-content-wrapper > cnx > cnx.cnx-ui.cnx-ui-video.cnx-is-paused.cnx-in-show-controls > cnx.cnx-ui-content.cnx-ui-bar.cnx-center-align > cnx > cnx').click();
            }
            else if(location.href.match("https://loot.tv/video/")){
                var num = (Math.floor(Math.random() * (54 - 0 + 1) + 0));
                var link = a[num];
                window.location.href = link;
            }
            else{}
        }
        function claimcV() {
            var test = document.getElementsByClassName("cnx-ui-progress-label")[0].innerHTML;
            if(test == "<cnx-span></cnx-span>"){
                var interval = setInterval(function(){
                    var test1 = document.getElementsByClassName("cnx-ui-progress-label")[0].innerHTML;
                    if(test == test1){
                        var num = (Math.floor(Math.random() * (54 - 0 + 1) + 0));
                        var link = a[num];
                        if(window.location.href == link) {
                            claimcV();
                        }
                        else{
                            window.location.href = link;
                        }
                    }
                }, 60000);
            }
        }
        function claimbV() {
            document.querySelector('.skip').click();
        }
        function claimdV() {
            document.querySelector('body > div.ReactModalPortal > div > div > div.Modal_modalContent__80NGX > div > div.StillWatchingModal_buttonWrapper__9NzLp > button').click();
        }
        function claimeV() {
            window.scrollTo(0, 10000);
            setTimeout(function(){
                window.scrollTo(0, 0);
            },500);
        }
/*function claimgV() {
            document.getElementsByClassName("_videoID__recommendedVideosColumn__DyqAF")[0].remove();
            document.getElementsByClassName("_videoID__descriptionWrapper__taEqM")[0].remove();
        }*/
    }
    else{
        if(window.self == top && window.history.length == 1){
        setInterval(function(){
            window.close();
        },500);}
        else{
            var num1 = (Math.floor(Math.random() * 2) + 1);
            if(num1 == 1){
                var claimfVTimer = setInterval (function() {claimfV(); }, 1000);
                function claimfV() {
                    document.querySelector('.videoAdUiSkipButton').click();
                }
            }
        }
    }
})();