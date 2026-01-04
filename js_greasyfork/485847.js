// ==UserScript==
// @name         F95-Zone Skipper Ultra
// @namespace    -
// @version      0.1.5
// @description  Skips masked URLs on F95zone (F95Zone.to) automatically and seamlessly.
// @author       Cat-Ling
// @homepageURL  https://github.com/Cat-Ling
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @match        https://f95zone.to/masked/*
// @exclude      https://f95zone.to/masked/
// @license      GPL-2.0
// @supportURL   https://github.com/Cat-Ling/f95zone-skipper/issues
// @downloadURL https://update.greasyfork.org/scripts/485847/F95-Zone%20Skipper%20Ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/485847/F95-Zone%20Skipper%20Ultra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $leaving = document.querySelector(".leaving");
    var $loading = document.getElementById("loading");
    var $captcha = document.getElementById("captcha");
    var $error = document.getElementById("error");

    function handleError(title, message, retry) {
        $error.innerHTML = "<h2>" + title + "</h2><p>" + message + "</p>" + (retry ? '<p><a href="javascript:window.location.reload(true);">Retry</a></p>' : "");
        $loading.style.display = "none";
        $error.style.display = "block";
    }

    $leaving.style.width = $leaving.offsetWidth + "px";
    document.querySelector(".leaving-text").style.display = "none";
    $loading.style.display = "block";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", document.location.pathname, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                switch (response.status) {
                    case "ok":
                        window.location.href = response.msg;
                        break;
                    case "error":
                        handleError("Error", response.msg, true);
                        break;
                    case "captcha":
                        $captcha.style.display = "block";
                        handleCaptcha(response);
                        break;
                }
            } else {
                handleError("Server Error", "Please try again in a few moments", true);
            }
        }
    };
    xhr.send("xhr=1&download=1");

    function handleCaptcha(response) {
        grecaptcha.render("captcha", {
            theme: "dark",
            sitekey: "6LcwQ5kUAAAAAAI-_CXQtlnhdMjmFDt-MruZ2gov",
            callback: function(captchaResponse) {
                $captcha.style.display = "none";
                $loading.style.display = "block";
                var xhr = new XMLHttpRequest();
                xhr.open("POST", document.location.pathname, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            var response = JSON.parse(xhr.responseText);
                            if (response.status !== "ok") {
                                handleError("Captcha Error", response.msg, true);
                            } else {
                                window.location.href = response.msg;
                            }
                        } else {
                            handleError("Server Error", "Please try again in a few moments", true);
                        }
                    }
                };
                xhr.send("xhr=1&download=1&captcha=" + captchaResponse);
            }
        });
    }
})();