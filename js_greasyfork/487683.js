// ==UserScript==
// @name         멜론티켓 취소표 좌석 표시
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  멜론티켓 취소표를 빨간색으로 표시해줌
// @license MIT
// @match        https://ticket.melon.com/*
// @downloadURL https://update.greasyfork.org/scripts/487683/%EB%A9%9C%EB%A1%A0%ED%8B%B0%EC%BC%93%20%EC%B7%A8%EC%86%8C%ED%91%9C%20%EC%A2%8C%EC%84%9D%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/487683/%EB%A9%9C%EB%A1%A0%ED%8B%B0%EC%BC%93%20%EC%B7%A8%EC%86%8C%ED%91%9C%20%EC%A2%8C%EC%84%9D%20%ED%91%9C%EC%8B%9C.meta.js
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
 
var sFloor = "";
var sArea = "";
var sRow = "";
var sEtc = "";
var dRow = null;
 
sFloor = pSB.sntv.f;
sArea = pSB.sntv.a;
sEtc = pSB.sntv.e;
 
var dSB      = ezCusPaper.rect(mx, my, mw, mh, 0, sw, 'B', 'none');
var bBoxInfo = dSB._getBBox();
if (mr != 0)
{
    dSB.rotate( mr , bBoxInfo.x + (bBoxInfo.width / 2),
        bBoxInfo.y + (bBoxInfo.height / 2));
}
 
if (pST != undefined) {
    var txtPosMinX = 99999999;
    var txtPosY = new Array();
    var txtY = new Array();
    for (var i = 0; i < pST.ss.length; i++) {
 
        txtPosMinX = Math.min(txtPosMinX, pST.ss[i].cd.x);
        txtPosY[pST.ss[i].rn] = pST.ss[i].cd.y;
        txtY[pST.ss[i].rn] = pST.ss[i].rn;
 
        if (pST.ss[i].uf == "Y") {
            var dST = ezCusPaper.rect(pST.ss[i].cd.x, pST.ss[i].cd.y, 11, 11, 0, 0, 'S', pST.ss[i].sl == 'Y' ? "#" + pST.ss[i].gc : '#DDDDDD');
 
            dST.id = pST.ss[i].sid;
 
            if (mr != 0) {
                dST.rotate(mr, bBoxInfo.x + (bBoxInfo.width / 2),
                    bBoxInfo.y + (bBoxInfo.height / 2));
            }
 
            //취소표 와드
            if(pST.ss[i].sl != "Y" && pST.ss[i].slc > 0){
                var dST = ezCusPaper.rect(pST.ss[i].cd.x, pST.ss[i].cd.y, 11, 11, 0, 0, 'S', pST.ss[i].sl == 'Y' ? "#" + pST.ss[i].gc : '#D1180B');
            }
 
            //판매 안하는거 같음
            if(pST.ss[i].sl != "Y" && pST.ss[i].slc > 0 && pST.ss[i].std != null){
                var dST = ezCusPaper.rect(pST.ss[i].cd.x, pST.ss[i].cd.y, 11, 11, 0, 0, 'S', pST.ss[i].sl == 'Y' ? "#" + pST.ss[i].gc : '#33CCFF');
            }
 
            if (pST.ss[i].sl == "Y") {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

snd.play();
 
                dST.data("snm"	, pST.ss[i].snm);
                dST.data("sbt"	, pSB.sbt);
                dST.data("gd"	, pST.ss[i].gd);
                dST.data("rn"	, pST.ss[i].rn != "" ? pST.ss[i].rn : "");
                dST.data("csid"	, pST.ss[i].csid);
                dST.data("csnm"	, pST.ss[i].csnm);
                dST.data("gn"	, pST.ss[i].gn);
                if (MAP_VIEW_TYPE != "RS_MAP") {
                    dST.mouseover(function () {
                        this.attr("cursor", "pointer");
                    });
 
                    dST.mouseout(function () {
                        this.attr("cursor", "");
                    });
 
                    dST.click(function () {
                        var setDpNm = fnGetSeatDpName(sFloor, sArea, this.data("rn"), sEtc, this.data("snm"));
                        if(this.data("csnm") != null){
                                setDpNm = this.data("csnm");
                        }
                        if (SELECTED_SEAT[this.id] == undefined) {
                            SELECTED_SEAT[this.id] = this;
                            fnReservationSeat(this.data("sbt"), this.data("gd"), this.id, setDpNm, this.data("csid"), this.data("gn"));
                        } else {
                            fnCancelSeat(this.id)
                        }
                    });
                }
            } else {
 
                if ( (MAP_VIEW_TYPE == "RS_MAP") || (MAP_VIEW_TYPE == "JN_MAP") )
                {
                    if ( REV_SEAT_ARRAY[ pST.ss[i].sid ] != null)
                    {
                        dST.attr("fill", "#"+REV_SEAT_ARRAY[ pST.ss[i].sid ]);
                    }
                }
            }
        }
    }
 
    if (this.GetMapType() == "BLOCK"){
            txtPosMinX = blockTxtPosMinX;
            for(var i in txtPosY){
                if(blockTxtY[i] != txtY[i]){
                    blockTxtY[i] = txtY[i];
                    rSpace = 15 + ( (((txtY[i])+"").length) *2);
                    dRow = ezCusPaper.text(txtPosMinX- ( rSpace ) , txtPosY[i] + 9 , txtY[i]).attr({'font-size': 12, 'fill':'#AAAAAA'});
                    try {
                        if (dRow.node.childNodes[0].attributes[0].name == "dy") {
                            dRow.node.childNodes[0].attributes[0].value = 0;
                        }
                    } catch (err) {}
                    if (mr != 0) {
                        dRow.rotate(mr, bBoxInfo.x + (bBoxInfo.width / 2),bBoxInfo.y + (bBoxInfo.height / 2));
                    }
                }
            }
    }
}
 
if (_VIEW_SEAT_BLOCK)
{
    _LAST_SELECTED_SEAT_BLOCK_SNTV = sFloor+","+sArea;
}
 
return dSB._getBBox();
};
 
function fnCusMapLoadingProcess( cusMap )
{
if (ezCusMgn != null)
{
    // 삭제안함
    ezCusMgn.RemoveAll();
    ezCusMgn = null;
}
 
SELECTED_SEAT = new Array();
 
mFloor = (cusMap.snt.f.use == "Y" ? cusMap.snt.f.name : "");
mArea = (cusMap.snt.a.use == "Y" ? cusMap.snt.a.name : "");
mRow = (cusMap.snt.r.use == "Y" ? cusMap.snt.r.name : "");
mEtc = (cusMap.snt.e.use == "Y" ? cusMap.snt.e.name : "");
mNum = (cusMap.snt.n.use == "Y" ? cusMap.snt.n.name : "");
 
// 삭제안함
ezCusMgn = new EzSeatCus();
ezCusMgn.DrawSeatBlock = tempDrawSeatBlock
ezCusMgn.InitSeat( "1" , cusMap.ms.width , cusMap.ms.height , cusMap.mt );
 
ezCusMgn.SetBackGroundColor( cusMap.bg );
 
if(brCheck){
    ezCusMgn.SetBackGround( cusMap.im );
    ezCusPaper.setViewBox(0 , 0, cusMap.ms.width , cusMap.ms.height, true);
}else{
    ezCusMgn.SetBackGround( cusMap.bu );
}
 
ezCusMgn.SetIndexMap( cusMap.im );
 
var SeatJson = cusMap.st;
var tmpSeat = new Object();
 
 
if ( (MAP_VIEW_TYPE == "RS_MAP") || (MAP_VIEW_TYPE == "JN_MAP") )
{
    if (ezCusMgn.GetMapType() == "BLOCK") {
        _VIEW_SEAT_BLOCK = true;
    }
 
    if (cusMap.rs != undefined)
    {
 
        for (var i = 0; i < cusMap.rs.length; i++)
        {
            REV_SEAT_ARRAY[cusMap.rs[i].sid] = cusMap.rs[i].sc;
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