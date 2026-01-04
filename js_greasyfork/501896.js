// ==UserScript==
// @name         Spacehey Details Grabber
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Hover users and press SHIFT to see their details/mood/status in a popup.
// @author       sudofry
// @match        https://spacehey.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501896/Spacehey%20Details%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/501896/Spacehey%20Details%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var css = document.createElement("style");
    css.innerHTML = `

    #showDetails {
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: #434343!important;
        background-image: none!important;
        color: #cbcbcb!important;
        width: auto;
        height: auto;
        padding: 10px;
        margin: 0;
        border-radius: 8px;
        border: 2px solid #252525!important;
        text-align: center!important;
        font-family: "Segoe UI", Arial, sans-serif!important;
        font-weight: normal!important;
        font-style: normal!important;
        font-size: 13px!important;
        text-shadow: none!important;
        text-decoration: none!important;
        letter-spacing: 0!important;
        z-index: 100000!important;
        display: none;
    }

    #showDetails p {
        color: #cbcbcb!important;
        background-color: transparent!important;
        font-family: "Segoe UI", Arial, sans-serif!important;
        font-weight: normal!important;
        font-style: normal!important;
        font-size: 13px!important;
        text-shadow: none!important;
        text-decoration: none!important;
        letter-spacing: 0!important;
    }

    #showDetails p:first-child {
        display: inline;
    }

    #showDetails a {
        color: #00c08a!important;
        font-family: sans!important;
        font-weight: normal!important;
        font-style: normal!important;
        font-size: 13px!important;
        text-shadow: none!important;
        text-decoration: none!important;
        letter-spacing: 0!important;
    }

    #showDetails .online img {
        vertical-align: middle;
        content: url('https://static.spacehey.net/img/green_person.svg');
        width: 20px;
    }

    #showDetails b {
        color: #00c08a!important;
        letter-spacing: 0!important;
    }

    #showDetails .awards {
        display: none;
    }`;

    document.head.appendChild(css);

    var divPop = document.createElement("div");
    divPop.id = "showDetails";
    $("body").append(divPop);

    $(".person a, .comments-table td:first-child a, .comments-table td small a:first-child").hover(function () {
        var getUrl = $(this).attr("href");
        var userId = getUrl.split('=')[1];
        $(document).keydown(function(e) {
            var code = e.keyCode || e.which;
            if (code == 16) {
                $("#showDetails").html("Loading...").show();
                $.get('https://spacehey.com/profile?id=' + userId, function(getDetails) {
                    var code = $(getDetails).find('.private-profile').html();
                    if (code) {
                        $("#showDetails").html('Private Profile');
                    }
                    else {
                        var details = $(getDetails).find('.details').html();
                        var mood = $(getDetails).find('.mood p:first-child').html();
                        var checkMood = mood.split('<b>Mood:</b>')[1];
                        if (checkMood.trim()) {
                            details += mood;
                        }
                        $("#showDetails").html(details);
                        var last = $("#showDetails time.ago").text();
                        if (last != "") {
                            var date = new Date(last * 1000);
                            var active = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " at " + (date.getHours() % 12 || 12) + ":" + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()) + " " + ((date.getHours() >= 12) ? 'pm' : 'am');
                            $("#showDetails time.ago").prev().remove()
                            $("#showDetails time.ago").replaceWith(active);
                        }
                    }
                });
            }
        });
    }, function() {
           $(document).unbind("keydown");
           $("#showDetails").hide();
    });

})();