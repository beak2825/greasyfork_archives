// ==UserScript==
// @name         멜티 잠긴 좌석 확인
// @namespace    https://www.psbooks.kr/
// @version      5.23
// @description  잠긴 좌석 수 보여줌
// @match        https://ticket.melon.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487256/%EB%A9%9C%ED%8B%B0%20%EC%9E%A0%EA%B8%B4%20%EC%A2%8C%EC%84%9D%20%ED%99%95%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/487256/%EB%A9%9C%ED%8B%B0%20%EC%9E%A0%EA%B8%B4%20%EC%A2%8C%EC%84%9D%20%ED%99%95%EC%9D%B8.meta.js
// ==/UserScript==
 
    'use strict';
    var iframeDocument = parent.oneStopFrame.document
    var originalSend = window.XMLHttpRequest.prototype.send;
 
        var self = this;
 
            var responseText = self.responseText;

            