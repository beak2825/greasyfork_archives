// ==UserScript==
// @name         멜티 잠긴 좌석 확인
// @namespace    https://www.psbooks.kr/
// @version      5.23
// @description  잠긴 좌석 수 보여줌
// @match        https://ticket.melon.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487918/%EB%A9%9C%ED%8B%B0%20%EC%9E%A0%EA%B8%B4%20%EC%A2%8C%EC%84%9D%20%ED%99%95%EC%9D%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/487918/%EB%A9%9C%ED%8B%B0%20%EC%9E%A0%EA%B8%B4%20%EC%A2%8C%EC%84%9D%20%ED%99%95%EC%9D%B8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var iframeDocument = parent.oneStopFrame.document
    var originalSend = window.XMLHttpRequest.prototype.send;
 
    window.XMLHttpRequest.prototype.send = function(data) {
        var self = this;
 
        self.addEventListener('load', function() {
            var responseText = self.responseText;
 
            if (responseText.includes('/**/getBlockSummaryCountCallBack(')) {
                var spread = iframeDocument.querySelectorAll('[onmouseout="viewLastGradeZone()"]')
                var div_array = [...spread]; // converts NodeList to Array
                    div_array.forEach(div => {
                        div.click()
                    })
                responseText = responseText.replace('/**/getBlockSummaryCountCallBack(', '');
                responseText = responseText.replace('});', '}');
                try {
                    var responseData = JSON.parse(responseText);
 
                    responseData.summary.forEach(function(item) {
                        if (item.lockSeatCntlk !== undefined) {
                            console.log(item)
                            var lockseatcntlkValue = item.lockSeatCntlk;
                            var floorNo = item.floorNo;
                            var areaNo = item.areaNo;
                            var seatGradeNo = item.seatGradeNo;
                            updateElementValue(lockseatcntlkValue, floorNo, areaNo, seatGradeNo);
                        }
                    })
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        });
        originalSend.apply(this, arguments);
    };
    function updateElementValue(lockseatcntlkValue, floorNo, areaNo, seatGradeNo) {
        var element = iframeDocument.querySelector('[id="li' +seatGradeNo + floorNo + areaNo + '"]')
        var seatSpan = element.querySelector('span.seat_residual');
 
        if (seatSpan) {
            var text = seatSpan.textContent;
            text += " / (" + lockseatcntlkValue + ")석";
            seatSpan.textContent = text;
        }
        }
})();