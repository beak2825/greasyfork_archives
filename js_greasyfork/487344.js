// ==UserScript==
// @name         멜론티켓 취소표 좌석 표시
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  멜론티켓 취소표를 빨간색으로 표시해줌
// @license MIT
// @match        https://ticket.melon.com/*
// @downloadURL https://update.greasyfork.org/scripts/487344/%EB%A9%9C%EB%A1%A0%ED%8B%B0%EC%BC%93%20%EC%B7%A8%EC%86%8C%ED%91%9C%20%EC%A2%8C%EC%84%9D%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/487344/%EB%A9%9C%EB%A1%A0%ED%8B%B0%EC%BC%93%20%EC%B7%A8%EC%86%8C%ED%91%9C%20%EC%A2%8C%EC%84%9D%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    console.log("멜론티켓 취소표 좌석 표시")
    const inj = document.createElement("script")
    inj.append(`
const tempDrawSeatBlock = function( pSB , pST )
{
var mx = pSB.cd.x;
var my = pSB.cd.y;
var mw = pSB.cd.w;
var mh = pSB.cd.h;
var mr = pSB.rt;
var sw = pSB.ls;
 

        }
    }
}
 
if (SeatJson != null) {
    for (var i = 0; i < SeatJson.length; i++) {
        tmpSeat[SeatJson[i].sbid] = SeatJson[i];
    }
}
 
if (cusMap.da.bb != null) {
    for (var i = 0; i < cusMap.da.bb.length; i++) {
        ezCusMgn.DrawBackBlock(cusMap.da.bb[i]);
    }
}
 
if (cusMap.mt == "ALL")
{
    fnDrawSeatBlock(cusMap , tmpSeat);
}else{
    if (_VIEW_SEAT_BLOCK)
    {
        fnDrawSeatBlock(cusMap , tmpSeat);
    }else{
 
    }
}
 
if (!_VIEW_SEAT_BLOCK) {
    if (cusMap.da.zb != null) {
        for (var i = 0; i < cusMap.da.zb.length; i++) {
            ezCusMgn.DrawZoneBlock(cusMap.da.zb[i]);
        }
    }
}
}
 
`)
    document.body.append(inj)
 
})();