// ==UserScript==
// @name            Auto clicker for urle.co +
// @name:ja         urle.co(+α)で楽をするためのスクリプト
// @namespace       http://hogehoge/
// @version         1.8.0
// @description     Bypass clicking continue button after reCAPTCHA
// @description:ja  urle.coとかでreCAPTCHA解決後に"continue"を自動でクリックします
// @author          H. Amami
// @include         *://urle.co/*
// @include         *://tmearn.com/*
// @include         *://u2s.io/*
// @include         *://adshorte.com/*
// @include         *://coshurl.co/*
// @include         *://linkfly.gaosmedia.com/*
// @include         *://coshurl.co/*
// @include         *://elde.me/*
// @include         *://clik.pw/*
// @include         *://zipfile.co/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/29019/Auto%20clicker%20for%20urleco%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/29019/Auto%20clicker%20for%20urleco%20%2B.meta.js
// ==/UserScript==

if (~location.href.indexOf("adshorte.com/")) {
    var iframes = document.getElementsByTagName('iframe');
    for (var iframe of iframes) {
        if (~iframe.src.indexOf("dailymotion")) {
            iframe.parentNode.removeChild(iframe);
        }
    }
}

captchaCheckAdblockUser = checkAdblockUser = function() {};

bannerHiddenDivs = function() {
    return false;
};


if (document.getElementById("link-view") !== null) {
    var a = function() {
        if (grecaptcha.getResponse(0) !== "") {
            document.getElementById("link-view").submit();
            clearInterval(b);
        }
    };
    var b = setInterval(a, 500);
}

if (document.getElementById("go-link") !== null) {
    var goForm = $("#go-link");
    var submitButton = goForm.find('button');
    $.ajax({
        dataType: 'json',
        type: 'POST',
        url: goForm.attr('action'),
        data: goForm.serialize(),
        success: function(result, status, xhr) {
            if (result.url) {
                location.href = result.url;
            } else {
                console.info(result.message);
            }
        },
        error: function(xhr, status, error) {
            console.log("An error occured: " + xhr.status + " " + xhr.statusText);
        },
        complete: function(xhr, status) {}
    });
}