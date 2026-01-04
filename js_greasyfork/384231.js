// ==UserScript==
// @name         EBonus.gg Video
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Click the next video button and the circles/bubbles coins automatically. With other cool features added. It also skip the captcha!
// @author       CharlesCraft50
// @copyright    2019, CharlesCraft50 (https://openuserjs.org/users/CharlesCraft50)
// @license      MIT
// @include      https://ebonus.gg/*
// @match        https://www.google.com/recaptcha/api2/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/384231/EBonusgg%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/384231/EBonusgg%20Video.meta.js
// ==/UserScript==

$(document).ready(function(){
    GM_addStyle(`.dropdown-content{display:none;position:absolute;background-color:#f1f1f1;min-width:160px;overflow:auto;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);right:0;z-index:1}.dropdown-content span{color:#000;padding:12px 16px;text-decoration:none;display:block}.dropdown-content span:hover{background-color:#ddd}.showdd {display: block;}`);
    //Functions

    function simulateClick(a) {
        var event = new MouseEvent('click');
        a.dispatchEvent(event);
    }

    window.ClickOnBubble = function(){
        if ($(".coins_popup.circle.adsbox").length > 0 || $('div.adsbox:contains("COINS")').length > 0) {
            circleClicked += 1;
            sessionStorage.setItem("circleClick", circleClicked);
            circleEarned = parseInt(sessionStorage.getItem("circleEarnedGet")) + parseInt($('.coins_popup.circle.adsbox').text().replace(/COIN|\s/gi, ""));
            sessionStorage.setItem("circleEarnedGet", circleEarned);
            //console.log("circle clicked = " + circleClicked);
            /*$(".coins_popup.circle.adsbox").click();
            $('.coins_popup.circle.adsbox a').trigger('click');
            $('div.adsbox:contains("COINS")').click();*/
            $('#cCarea').html("Circle Clicked: " + circleClicked);
            $('#cEarea').html("Circle Earned: " + circleEarned);
            $('#coinsEarnArea').html(parseInt(coinsEarn + circleEarned));
            setTimeout(function(){simulateClick(document.querySelector('.coins_popup.circle.adsbox'));}, 10);
        }
    };

    window.ClickNext = function(){
        if ($(".sweet-alert.showSweetAlert.visible").length > 0) {
            console.log("videos clicked");
            $(".confirm").click();
            setTimeout(function(){window.location.href = 'https://ebonus.gg/earn-coins/watch/';}, 5000);
        }
    };

    window.resetData = function(){
        sessionStorage.clear();
        circleClicked = 0;
        circleEarned = 0;
        sessionStorage.setItem("circleEarnedGet", circleEarned)
        $('#coinsEarnArea').html('0');
        $('#coinCountArea').html('0');
        $('#vCarea').html(""+numberOfVideos+" Videos: 0");
        $('#vEarea').html("Video Coins Earned: 0");
        $('#cCarea').html("Circle Clicked: 0");
        $('#cEarea').html("Circle Earned: 0");
    };

     //Captcha Funtion
    if (location.href.indexOf('google.com/recaptcha') > -1) {
        var clickCheck = setInterval(function() {
            if (document.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
                clearInterval(clickCheck);
                document.querySelector('.recaptcha-checkbox-checkmark').click();
            }
        }, 2000);
    } else {
        var forms = document.forms;
        for (var i = 0; i < forms.length; i++) {
            if (forms[i].innerHTML.indexOf('google.com/recaptcha') > -1) {
                var rc_form = forms[i];
                var solveCheck = setInterval(function() {
                    if (grecaptcha.getResponse().length > 0) {
                        clearInterval(solveCheck);
                        $('input[value="Continue"]').click();
                    }
                }, 100);
            }
        }
    }

    setTimeout(function(){
        if(window.location.href.indexOf("ebonus.gg/earn-coins/watch") > -1) {
            window.location.reload();
        }
    }, 120000);

    if($('p:contains("Please complete this captcha to continue watching videos.")').length > 0) {
        console.log("Captcha Alert");
    } else {
        //Start
        var coinsclicker = setInterval(function() {
            ClickNext();
            ClickOnBubble();
        }, 1000);
        $('li:contains("144")').click();

        var muteVideo = setInterval(function(){
            if($('.vjs-mute-control[title="Mute"]').length > 0) {
               $('.vjs-mute-control').click();
            } else {
                clearInterval(muteVideo);
            }
        }, 1000);

        var playVideo = setInterval(function(){
            if($('.vjs-play-control.vjs-control.vjs-button[title="Play"]').length == 1) {
               $('.vjs-play-control.vjs-control.vjs-button').click();
            }
        }, 1000);
        setTimeout(function(){clearInterval(playVideo);}, 15000);
    }

    var removeElements = function(text, selector) {
        var wrapped = $("<div>" + text + "</div>");
        wrapped.find(selector).remove();
        return wrapped.html();
    }

    //Number of videos
    var numberOfVideos = removeElements($('h3.desc_item.nomargin').html(), 'span').replace(/Watch|videos|\s/gi, "");

    if(sessionStorage.getItem("coinGet") === null || sessionStorage.getItem("coinGet") == NaN || sessionStorage.getItem("coinGet") == "NaN") {
        var coinCount = 0;
    } else {
        coinCount = parseInt(sessionStorage.getItem("coinGet"));
    }

    if(sessionStorage.getItem("circleClick") === null || sessionStorage.getItem("circleClick") == NaN || sessionStorage.getItem("circleClick") == "NaN") {
        var circleClicked = 0;
    } else {
        circleClicked = parseInt(sessionStorage.getItem("circleClick"));
    }

    if(sessionStorage.getItem("coinsEarned") === null || sessionStorage.getItem("coinsEarned") == NaN || sessionStorage.getItem("coinsEarned") == "NaN") {
        var coinsEarn = 0;
        sessionStorage.setItem("coinsEarned", coinsEarn);
    } else {
        coinsEarn = parseInt(sessionStorage.getItem("coinsEarned"));
    }

    if(sessionStorage.getItem("circleEarnedGet") === null || sessionStorage.getItem("circleEarnedGet") == NaN || sessionStorage.getItem("circleEarnedGet") == "NaN") {
        var circleEarned = 0;
        sessionStorage.setItem("circleEarnedGet", circleEarned);
    } else {
        circleEarned = parseInt(sessionStorage.getItem("circleEarnedGet"));
    }

    if($('p:contains("Please complete this captcha to continue watching videos.")').length > 0) {
        console.log("Captcha Alert");
    } else {
        if($("#next-video-btn").html() == "Next Video ["+numberOfVideos+"/"+numberOfVideos+"]") {
            coinsEarn = parseInt(sessionStorage.getItem("coinsEarned")) + parseInt(removeElements($('a[href="#coins_per_video"]').html(), "i").replace(/to earn|coins!|\s/gi, ""));
            sessionStorage.setItem("coinsEarned", coinsEarn);
        }

        if($("#next-video-btn").html() == "Next Video ["+numberOfVideos+"/"+numberOfVideos+"]") {
            coinCount += 1;
            sessionStorage.setItem("coinGet", coinCount);
            console.log(""+numberOfVideos+" videos = " + coinCount);
        }
    }

    //Coins Earned:
    $("body").append("<div class='button cEBtn' style='position: fixed; bottom: 0; right: 0; font-size: 20px;' title='Click to see more information'>Total Coins Earned: <span id='coinsEarnArea'>" + parseInt(coinsEarn + circleEarned) +"</span> <div class='coin-image' style='width:16px;background-size:16px;height:16px;margin-bottom:-2px;'></div><i class='fa fa-caret-up'></i></div>");
    $("body").append("<div class='button' id='videoCount' style='position: fixed; bottom: 190px; right: 0; font-size: 20px; cursor: default; transform: translateY(140px); transition: transform 0.5s linear;'>Video "+$('a#next-video-btn').html().replace(/Next Video /gi, '')+": <span id='coinCountArea'>"+coinCount+"</span></div>");
    $("body").append("<input type='button' id='resetDataEarned' class='button' style='position: fixed; bottom: 240px; right: 0; font-size: 20px; transform: translateY(140px); transition: transform 0.5s linear;' title='Resets data' value='Reset'>");
    //$("body").append("<a class='coins_popup circle adsbox' href='#' style='top: 140px; right: 0; background-color: rgb(91, 155, 209);'><span>10</span><br>COIN</a>");
    $("body").append("<div id='dataArea' class='dropdown-content' style='position: fixed; bottom: 45px; right: 0; font-size: 20px; cursor: default;'><span id='vCarea'>"+numberOfVideos+" Videos: "+coinCount+"</span><span id='vEarea' style='background-color: #73cf11; color: white;'>Video Coins Earned: "+coinsEarn+"</span><span id='cCarea'>Circle Clicked: "+circleClicked+"</span><span id='cEarea' style='background-color: #73cf11; color: white;'>Circle Earned: "+circleEarned+"</span></div>");

    $(".cEBtn").click(function(){
        document.getElementById("dataArea").classList.toggle("showdd");
        if($(".dropdown-content.showdd").length > 0) {
            $("#resetDataEarned").css({"transform":"translateY(-80px)"});
            $("#videoCount").css({"transform":"translateY(-80px)"});
        } else {
            $("#resetDataEarned").css({"transform":"translateY(140px)"});
            $("#videoCount").css({"transform":"translateY(140px)"});
        }
    });

   window.onclick = function(event) {
       if (!event.target.matches('.cEBtn')) {
           var dropdowns = document.getElementsByClassName("dropdown-content");
           var i;
           for (i = 0; i < dropdowns.length; i++) {
               var openDropdown = dropdowns[i];
               if (openDropdown.classList.contains('showdd')) {
                   openDropdown.classList.remove('showdd');
                   $("#resetDataEarned").css({"transform":"translateY(140px)"});
                   $("#videoCount").css({"transform":"translateY(140px)"});
               }
           }
       }
   }

    //Resets Data
    $('#resetDataEarned').click(function(){ resetData(); });
});
