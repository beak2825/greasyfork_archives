// ==UserScript==
// @name         Duolingo Speedy Timed Practice
// @namespace    mog86uk-duo-speedy-timed-practice
// @version      1.0
// @description  Duolingo - Speedier Timed Practice
// @author       mog86uk (aka. testmoogle)
// @match        https://www.duolingo.com
// @match        https://www.duolingo.com/practice
// @match        https://www.duolingo.com/skill/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/36125/Duolingo%20Speedy%20Timed%20Practice.user.js
// @updateURL https://update.greasyfork.org/scripts/36125/Duolingo%20Speedy%20Timed%20Practice.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $clonedResultBar;
    var speedyToggle = 0;
    var timerSpeedy;
    var timerCheckPageUrl;

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    jQuery.noConflict();
    jQuery(document).ready(function($) {

        addGlobalStyle('#duplicateResultBar div.PYCF5 * {color:#BBB!important;}');
        addGlobalStyle('#duplicateResultBar div._2KMvD._3nzjY {cursor:help;}');
        //addGlobalStyle('#duplicateResultBar {bottom:120px!important;height:120px!important;}');

        function Speedy() {
            if (!$('button._1pp2C._1MQOP._3qSMp._3cu46.T6NVk._27uC9').length) {
                if (!$('button[data-test="player-skip"]').length &&
                    $('button._3XJPq._1MQOP._3qSMp._3cu46._27uC9:enabled').length) {

                    if ($('#duplicateResultBar').length) {
                        $('#duplicateResultBar').remove();
                    }

                    $clonedResultBar =  $('div._1sntG').clone().prop('id', 'duplicateResultBar');
                    $('div._1sntG').after($clonedResultBar);
                    $('#duplicateResultBar button._3XJPq._1MQOP._3qSMp._3cu46._27uC9').remove();
                    $('#duplicateResultBar div._2KMvD._3nzjY')
                        .attr('title', 'Click to SKIP the current question')
                        .on('click', function(){$('button[data-test="player-skip"]').click();});

                    $('button._3XJPq._1MQOP._3qSMp._3cu46._27uC9').click();
                }
            }
            else {
                if (!$('button[data-test="secondary-button"]').length) {
                    if ($('#duplicateResultBar').length) {
                        $('#duplicateResultBar').remove();
                    }
                }
            }
        }

        function CheckPageUrl() {
            if (/^https:\/\/www\.duolingo\.com\/(practice|skill\/.+\/.+\/practice)/.test(window.location.href)) {
                if (speedyToggle === 0) {
                    window.clearInterval(timerSpeedy);
                    timerSpeedy = window.setInterval(Speedy, 50);
                    speedyToggle = 1;
                }
            }
            else {
                if (speedyToggle === 1) {
                    window.clearInterval(timerSpeedy);
                    speedyToggle = 0;
                }
            }
        }
        timerCheckPageUrl = window.setInterval(CheckPageUrl, 2000);
    });
})();