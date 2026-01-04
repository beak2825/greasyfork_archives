// ==UserScript==
// @name         멜론티켓 취소표 표시
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  멜론티켓 취소표를 빨간색으로 표시해줌
// @license MIT
// @match        https://m.ticket.melon.com/main/index.htm
// @downloadURL https://update.greasyfork.org/scripts/494743/%EB%A9%9C%EB%A1%A0%ED%8B%B0%EC%BC%93%20%EC%B7%A8%EC%86%8C%ED%91%9C%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/494743/%EB%A9%9C%EB%A1%A0%ED%8B%B0%EC%BC%93%20%EC%B7%A8%EC%86%8C%ED%91%9C%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("멜론티켓 취소표 표시")
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