// ==UserScript==
// @name         Auto Watch Video Ads
// @namespace    http://huuminh.net/
// @version      0.4
// @description  Support auto watch and spin for (snuckls.com, baymack.com)
// @author       Nguyen Minh
// @match        *.flamzy.com/*
// @match        *.skylom.com/*
// @match        *.snuckls.com/*
// @match        *.sharkday.com/*
// @match        *.vipbirdie.com/*
// @match        *.outbuck.com/*
// @match        https://www.google.com/recaptcha*
// @match        https://www.youtube.com/embed/*
// @match        https://img.youtube.com/*
// @connect      snuckls.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @grant        none
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/387439/Auto%20Watch%20Video%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/387439/Auto%20Watch%20Video%20Ads.meta.js
// ==/UserScript==
var $ = jQuery;
var isChrome = false;
var autoClickCapcha = false;
var antiCaptchaApi = "ad475b99b317d2fa1e85de921fb0d4a9";

var autoSpin = true;

var acceptedDomain = [
    'snuckls.com'
];
var phpToJsDataVideos = window.phpToJsDataVideos || {};

var captchaProcessing = false;
var recaptchaToken = "";
var reload = false;

function initialize() {
    if (window.location.href.includes("https://www.youtube.com/embed/")) {
        var e = (window.location != window.parent.location) ? document.referrer : document.location.href;
        setTimeout(playVideo, 3000);
    } else if (window.location.href.includes('recaptcha')) {
        if(autoClickCapcha) {
            var bt = window.document.querySelector('.recaptcha-checkbox-checkmark');
            if(bt && bt.length) {
                bt.click();
            }
        }
    } else if (window.location.href.includes("https://img.youtube.com/")) {
        setTimeout(function() {
            var a = document.getElementsByTagName("img")[0];
            var b = getBase64Image(a);
            var c = a.src.split("/")[4];
            document.body.removeChild(a)
        }, 1000)
    } else if (window.location.href.includes("entry")) {
        location.reload(true);
    } else {
        var scripts = window.document.getElementsByTagName("script");
        for(let i = 0; i < scripts.length; i++) {
            var scriptText = scripts[i].innerHTML;
            if(/currenttime/g.test(scriptText)) {
                scriptText.innerHTML = scriptText.replace(/currenttime =\d+/g, 'currenttime = 20');
                console.log(scriptText.innerHTML);
            }
        }
        /*
        var replaceData = setInterval(function() {
            if(window.phpToJsDataVideos && window.phpToJsDataVideos.videosData) {

                window.phpToJsDataVideos.videosData.forEach(function(videoData) {
                    videoData.oldVidDuration = videoData.measuredDuration;
                    videoData.measuredDuration = 20;
                });
                clearInterval(replaceData);
            }
        }, 100);*/
        //var videoSrc = document.getElementById("video_player").src;
        //document.getElementById("video_player").src = videoSrc.replace("start=0", "start=30");
        setTimeout(autoSnuckls, 1000);
        setTimeout(function() {
            var currentTime = $('.video-page-current-duration').text();
            var currentTimeInt = parseInt(currentTime);
            if (!currentTime || currentTimeInt === 0) {
                location.reload(true)
            }
        }, 15000);
        if (window.location.href.includes("videos")) {

        } else if (window.location.href.includes("entry")) {
            location.reload(true)
        }
    }
}

function getBase64Image(a) {
    var b = document.createElement("canvas");
    b.width = a.width;
    b.height = a.height;
    var c = b.getContext("2d");
    c.drawImage(a, 0, 0);
    var d = b.toDataURL("image/png");
    return d.slice(200, 500)
}


function playVideo() {
    var btn = document.getElementsByClassName("ytp-large-play-button ytp-button")[0];
    var container = $(".html5-video-container");
    var b = document.getElementsByTagName("video")[0];
    if(!b.muted) {
        b.muted = true;
    }

    //    console.log(player.play());
    if(btn) {
        if (b.paused) {
            btn.click();
            container.hide();
        }
    }
}

function autoSnuckls() {
    if(!window.location.href.includes("snuckls")) return;
    toastr.info('Starting auto...');
    var scripts = window.document.getElementsByTagName("script");
    for(let i = 0; i < scripts.length; i++) {
        var scriptText = scripts[i].innerHTML;
        if(/var phpToJsDataVideos/g.test(scriptText)) {
            scripts[i].innerHTML = scriptText.replace(/"measuredDuration":\d+/g, '"measuredDuration": 10')
        }

        if(/evaluate_option/g.test(scriptText)) {
            scripts[i].innerHTML = scriptText.replace(/var watchedTime = currenttime/g, 'var watchedTime = 120');
        }
    }


    if(autoSpin) {
        var atSpin = setInterval(function(){
            var spinBtn = $("#spin a");
            var spinLeft = parseInt($("#spinsLeft").text(), 10);
            var backgroundBtn = spinBtn.parent().attr('style');
            if(spinLeft > 0 && !/spin_btn_disabled/g.test(backgroundBtn)) {
                $('#spin').click();
            } else if(spinLeft === 0) {
                clearInterval(atSpin);
            }
        }, 3000);


    }

    if(window.location.href.includes("videos")) {
        var d = false;
        var e = setInterval(function() {
            var b = document.getElementsByClassName("video-category video-category-questions-div")[0];
            var c = document.getElementsByClassName("captchaDivs")[0];

            if (c.style.display === "block" && !d) {
                d = true;
                if(antiCaptchaApi) {
                    solveRecaptchaV2("https://www.snuckls.com/videos", "6LfkbSMUAAAAAHPAhDmPr5ZmSg0ijddy8kqz4WRP");
                }
            } else if (b.style.display === "block") {
                var videoId = "";
                if(phpToJsDataVideos && phpToJsDataVideos.videosData) {
                    videoId = phpToJsDataVideos.videosData[0].videoId;
                }


                var question = $("ul.link-btn-list.video-category-options li");
                var videoOptions = document.getElementsByClassName("watch-vdo-msg")[0];
                var button = document.getElementsByClassName("border-btn");
                var localAnswer = localStorage.getItem(videoId);
                var f = Math.floor(Math.random() * 4);
                if(localAnswer && videoId !== '') {
                    for (var i = 0; i < button.length; i++) {
                        if (button[i].innerHTML.includes(localAnswer)) {
                            f = i;
                            break;
                        }
                    }
                }
                button[f].click();
                var g = setInterval(function() {
                    if (videoOptions.innerHTML.toLowerCase().match(/correct|Congrats|You earned|success|Congrats/i)) {
                        localStorage.setItem(videoId, button[f].innerHTML);
                        clearInterval(g);
                    }
                }, 1000);
                clearInterval(e);
                location.reload(true);
            }
        }, 2000)
        }

}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function WaitingForRecaptchaResult() {
    var c = 90;
    var d = setInterval(function() {
        if (recaptchaToken.length > 3 || grecaptcha.getResponse().length > 3) {
            if (recaptchaToken.length > 3) {
                document.getElementById("g-recaptcha-response").innerHTML = recaptchaToken;
            }
            var a = !!window.chrome && !!window.chrome.webstore;
            var b = typeof InstallTrigger !== 'undefined';
            if (___grecaptcha_cfg.clients[0].aa) {
                ___grecaptcha_cfg.clients[0].aa.l.callback()
            }
            if (___grecaptcha_cfg.clients[0].ba) {
                ___grecaptcha_cfg.clients[0].ba.l.callback()
            }
        }
        c--;
        if (c < 0) {
            location.reload(true);
            clearInterval(d)
        }
    }, 5000)
    }

function solveRecaptchaV2(siteUrl, reCaptchaSiteKey) {
    captchaProcessing = true;
    toastr.info("Starting anti-captcha...");
    var request = $.ajax({
        url: "https://api.anti-captcha.com/createTask",
        method: "POST",
        async: false,
        dataType: 'json',
        data: JSON.stringify({
            "clientKey": antiCaptchaApi,
            "task": {
                "type":"NoCaptchaTaskProxyless",
                "websiteURL": siteUrl,
                "websiteKey": reCaptchaSiteKey,
            },
            "softId":0,
            "languagePool":"en"
        })
    });

    request.done(function( result ) {
        if(result && result.taskId) {
            getAntiCaptchaResult(result.taskId);
        }
    });

    request.fail(function( jqXHR, textStatus ) {
        captchaProcessing = false;
        toastr.error(textStatus);
        setTimeout(function(){
            location.reload(true);
        }, 3000);
    });
}

function getAntiCaptchaResult(taskId) {
    if(!taskId) return;

    var v = document.getElementsByClassName("video-category video-category-questions-div")[0];
    var request = $.ajax({
        url: "https://api.anti-captcha.com/getTaskResult",
        method: "POST",
        async: false,
        dataType: 'json',
        data: JSON.stringify({
            "clientKey": antiCaptchaApi,
            "taskId": taskId
        })
    });

    request.done(function( result ) {
        if(result && result.status === 'ready') {
            captchaProcessing = false;
            recaptchaToken = result.solution.gRecaptchaResponse;
            $(".g-recaptcha-response").val(recaptchaToken);
            if(recaptchaToken) {
                v.style.display = 'block';
                $(".captchaDivs").hide();
                toastr.info("Recaptcha decoded with cost: " +result.cost);
            }
        } else {
            if(result && result.status) {
                toastr.info(result.status, "Decoding ReCaptcha...", {timeOut: 5000});
            }
            setTimeout(function(){
                getAntiCaptchaResult(taskId)
            }, 6000);
        }
    });

    request.fail(function( jqXHR, textStatus ) {
        captchaProcessing = false;
        location.reload(true);
    });
}

function initializeInterface() {
    var parent = document.getElementsByTagName('head').item(0) || document.documentElement;
    var toasterCss = document.createElement("link");
    toasterCss.type = "text/css";
    toasterCss.rel = "stylesheet";
    toasterCss.setAttribute('href', "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css");
    parent.appendChild(toasterCss);
    var toasterEl = document.createElement("script");
    toasterEl.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js");

    var style = document.createElement("style");
    style.innerHTML = `.auto-wrapper{
     width: 300px;
     background: #e1ffe1;
     padding: 10px;
     border: 3px solid #c2dac2;
     font-family: "Roboto","LocalRoboto","Helvetica Neue","Helvetica","sans-serif";
     font-size: 14px;
position: fixed;
z-index: 99999;
top: 0;
left: 0;
    }
    .field-controls {
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      padding: 5px;
    }
    .setting-wrapper{
      display: flex;
      justify-content: center;
    }
    label{
      display: block;
      font-weight: bold;
      padding-right: 10px;
      width: 100%
    }
    .setting-wrapper label, .auto-spin-wrapper label{
      display: inline-block;
    }
    input{
      border: 1px solid #ccc;
      padding: 5px;
    }
`;
    parent.appendChild(style);
    var content = `<div class="auto-wrapper">
    <div class="field-controls setting-wrapper">
    <label>
      <input type="radio" value="on" name="mode"> Turn On
    </label>
    <label>
      <input type="radio" value="off" name="mode"> Turn Off
    </label>
  </div>
  <div class="field-controls captcha-api-wrapper">
    <label>Anti captcha api</label>
    <input type="text" value="" name="anti_captcha_api">
  </div>
  <div class="field-controls auto-spin-wrapper">
    <label>Auto Spin</label>
    <input type="checkbox" value="yes" name="auto_spin">
  </div>
  </div>`;
    antiCaptchaApi = localStorage.getItem("localStorage") || antiCaptchaApi;
    $('body').append(content);
    $("input[name=anti_captcha_api]").val(antiCaptchaApi);
    parent.appendChild(toasterEl);
}

(function() {
    isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    initializeInterface();
    initialize();
})();