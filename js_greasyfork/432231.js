// ==UserScript==
// @name                UU看書手機版
// @version             0.1.10
// @description         幫助在使用手機閱讀UU看書時，能使用滑鼠手勢輕鬆地換頁
// @author              John
// @match               *://*.uukanshu.com/read.aspx*
// @grant               none
// @license             MIT License
// @namespace           https://greasyfork.org/users/814278
// @downloadURL https://update.greasyfork.org/scripts/432231/UU%E7%9C%8B%E6%9B%B8%E6%89%8B%E6%A9%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/432231/UU%E7%9C%8B%E6%9B%B8%E6%89%8B%E6%A9%9F%E7%89%88.meta.js
// ==/UserScript==

var lastX,lastY,lastSign,afterGestures,gesturesWords,gesturesContent,gestures,signs;
const defaultFun={
    prePage:"prePage()",
    nextPage:"nextPage()"
};
var bookName = getBookName();

var filterList = ['UU看書 www.uukanshu.com'
                 ,'UU看書www.uukanshu.com'
                  ,'UU看书 www.uukanshu.com'
                  ,'UU看书www.uukanshu.com'
                  ,"\\n\\n"+bookName+'.*https://'
                  ,'https://'
                  ,'請記住本書首發域名:。'
                  ,'手機版閱讀網址:'
                  ,'\\(未完待續。\\)'
                  ,'\\(未完待续。\\)'
                  ,'\\(\\)'
                  ,'\\[\\]'
                  ,'天才一秒記住本站地址:最快更新!無廣告!'
                  ,'章節缺失、錯誤舉報'
                  ,'章节缺失、錯誤举报'
                  ,'章节缺失、错误举报'
                  ,'天才壹秒記住,為您提供精彩小說閱讀。'
                  ,'手機用戶請瀏覽m閱讀,更優質的閱讀體驗。'
                  ,'手机用户请浏览m阅读,更优质的阅读体验。'
                  ,'最新網址:'
                  ,"UU看書.*!"
                  ,'手機用戶請到閱讀。'
                  ,"您可以在百度裏搜索“"+bookName+"搜小說”查找最新章節!\\n"
                  ,"您可以在百度里搜索“"+bookName+"搜小說”查找最新章節!\\n"
                  ,"\\n\\n為了方便下次閱讀.*下次打開書架即可看到!"
                  ,"\\n\\n喜歡《"+bookName+"》請向你的朋友\\(QQ、博客、微信等方式\\)推薦本書,謝謝您的支持!!"
                  ,"\\n\\n\\n"
                 ];

var replaceList = {
                    ",":"，"
                    , ":":"："
                    , ";":'；'
                    , "\\?":"？"
                    , "!":"！"
                    , "。":"..."
                    , "夸":"誇"
                    , "并":"並"
                    , "閑":"閒"
                    , "圣":"聖"
                    , "里":"裡"
                    , "云":"雲"
                    , "愿":"願"
                    , "后":"後"
                    , "尸":"屍"
                    , "其于":"其餘"
                    , "于":"於"
                    , "賬":"帳"
                    , "凈":"淨"
                    , "裏":"裡"
                    , "淀":"澱"
                    , "贊":"讚"
                    , "钻":"鑽" , "鉆":"鑽"
                    , "仆":"僕"
                    , "皇後":"皇后" , "王後":"王后" , "太後":"太后" , "天後":"天后"
                    , "隻能":"只能" , "隻要":"只要" , "隻是":"只是" , "隻可":"只可" , "隻允":"只允" , "隻說":"只說" , "隻求":"只求" , "隻願":"只願", "隻見":"只見"
                    , "這么":"這麼" , "那么":"那麼" , "怎么":"怎麼" , "什么":"什麼" , "多么":"多麼" , "要么":"要麼" , "是么\\?":"是嗎\\?"
                    , "答復":"答覆" , "復數":"複數"
                    , "開采":"開採" , "采收":"採收" , "采集":"採集" , "采納":"採納" , "采取":"採取"
                    , "舍不":"捨不" , "舍棄":"捨棄" , "舍身":"捨身" , "舍去":"捨去" , "有舍":"有捨"
                    , "松動":"鬆動" , "松了":"鬆了" , "松開":"鬆開" , "松手":"鬆手" , "松掉":"鬆掉" , "松綁":"鬆綁" , "輕松":"輕鬆"
                    , "干干":"乾乾" , "干脆":"乾脆" , "干淨":"乾淨" , "干燥":"乾燥" , "干貨":"乾貨" , "干涸":"乾涸" , "干系":"關係"
                    , "干道":"幹道" , "干過":"幹過" , "干的":"幹的" , "骨干":"骨幹" , "干什":"幹什" , "干嘛":"幹嘛"
                    , "聯系":"聯繫" , "關系":"關係"
                    , "合並":"合併" , "吞並":"吞併" , "並吞":"併吞"
                    , "典范":"典範" , "范例":"範例" , "范疇":"範疇" , "范圍":"範圍"
                    , "須髮":"鬚髮" , "鬍須":"鬍鬚"
                    , "余生":"餘生" , "余情":"餘情" , "余溫":"餘溫" , "余力":"餘力"
                    , "標志":"標誌" , "號志":"號誌"
                    , "穀底":"谷底" , "山穀":"山谷"
                    , "能斗":"能鬥" , "戰斗":"戰鬥" , "斗戰":"鬥戰" , "斗志":"鬥志" , "斗不過":"鬥不過"
                    , "麵對":"面對" , "迎麵":"迎面" , "下麵":"下面"
                    , "jian貨":"賤貨"
                    , "撫mo":"撫摸"
                    //, "關于":"關於" , "大于":"大於" , "小于":"小於" , "等于":"等於" , "高于":"高於" , "低于":"低於"  , "至于":"至於"
                    };
                    




function prePage(){
    var url = $("#read_pre").attr("href");
    if (url == undefined){
        url = $("#prev").attr("href");
    }
    if (url == undefined){
        return false;
    }
    window.location.href = url;
}

function nextPage(){
    var url = $("#read_next").attr("href");
    if (url == undefined){
        url = $("#next").attr("href");
    }
    if (url == undefined){
        return false;
    }
    window.location.href = url;
}

function initEventListener(start,move,end,tracer,clientX,clientY,startBool){
    var isMouse=start=="mousedown";
    function moveFun(e){
        tracer(eval(clientX),eval(clientY), isMouse);
        gesturesWords.innerHTML=signs;
        var gesturesWidth=signs.length*51+40;
        gesturesContent.style.width=gesturesWidth+"px";
        gesturesContent.style.marginLeft=-gesturesWidth/2+"px";
    };

    document.addEventListener(start, function(e) {
        if(!startBool || eval(startBool)){
            lastX=eval(clientX);
            lastY=eval(clientY);
            lastSign=signs="";
            document.addEventListener(move, moveFun, false);
        }
    }, false);

    function endFun(e) {
        document.removeEventListener(move, moveFun, false);
        setTimeout(function(){if(gesturesContent.parentNode)gesturesContent.parentNode.removeChild(gesturesContent);},500);
        if(signs){
            if(afterGestures)afterGestures();
            for(var g of gestures){
                var gSign=g.gesture;
                if(signs==gSign){
                    if(!isMouse) document.body.appendChild(gesturesContent);
                    var fun=defaultFun[g.fun];
                    if(fun===undefined || !fun){
                        eval(g.fun);
                    }else{
                        eval(fun);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                }
            }
            signs="";
        }
    };

    document.addEventListener(end, endFun, false);
    document.addEventListener("mouseup", endFun, false);
}

function fullToHalf(val) {
    var result = "";

    try{
        var value = val || "";
        if (value) {
            for (var i = 0; i <= value.length; i++) {
                if (value.charCodeAt(i) == 12288) {
                    result += " ";
                } else {
                    if (value.charCodeAt(i) > 65280 && value.charCodeAt(i) < 65375) {
                        result += String.fromCharCode(value.charCodeAt(i) - 65248);
                    } else {
                        result += String.fromCharCode(value.charCodeAt(i));
                    }
                }
            }
        }
    }catch(e){
        console.error(e);
    }

  return result;
}

function alterContent(){
    try{
        var obj = document.getElementById("bookContent");
        obj.style.cssText += 'word-break: break-all;';
        var val = fullToHalf(obj.innerText);

        for(const str of filterList){
            val = val.replace(new RegExp(str,"gi"),'');
        }

        setTimeout(function() {
            for (var key in replaceList) {
                val = val.replace(new RegExp(key, "gi"), replaceList[key]);
            }
            obj.innerText = val;
        },5);
    }catch(e){
        console.error(e);
    }
}

function addNexPagetLink(){
    try{
        var newEle = document.createElement("div");
        var oldEle = document.querySelector(".rp-switch");
        var nextLinkEle = document.getElementById("read_next")

        var leftEle = nextLinkEle.cloneNode(true);
        var rightEle = nextLinkEle.cloneNode(true);
        leftEle.style.cssText = 'left:0px;position:absolute;';
        rightEle.style.cssText = 'right:0px;position:absolute;';
        newEle.appendChild(leftEle);
        newEle.appendChild(rightEle);
        oldEle.parentNode.insertBefore(newEle ,oldEle);
    }catch(e){
        console.error(e);
    }
}


function alterEleLoction(){
    var toolbtm1Ele = document.getElementById("tool_btm1");
    var toolbtm2Ele = document.getElementById("tool_btm2");
    var fontBtbEle = document.getElementById("funfont");
    var nextBtnEle = document.getElementById("funnext");
    fontBtbEle.style = 'width:50px;position: absolute;right:10px;left:auto;padding-top: 12px;';
    nextBtnEle.style = 'width:50px;position: absolute;left:10px;';

    toolbtm1Ele.insertBefore(nextBtnEle, fontBtbEle);
    toolbtm1Ele.removeChild(fontBtbEle);
    toolbtm2Ele.appendChild(fontBtbEle);
}

function getBookName(){
    var result = "";
    try{
        var headerEle = document.querySelector("header");
        var aa = headerEle.innerText.split("\n");
        result = aa[1];
    }catch(e){
        console.error(e);
    }
    return result;
}


(function() {
    'use strict';
    const minLength=256;
    const tg=0.5;
    gestures=[
          {gesture:"→", fun:"prePage"},
          {gesture:"←", fun:"nextPage"},
         ];

    function tracer(curX,curY,showSign) {
        let distanceX=curX-lastX,distanceY=curY-lastY;
        let distance=(distanceX*distanceX)+(distanceY*distanceY);
        if (distance>minLength) {
            lastX=curX;
            lastY=curY;
            let direction="";
            let slope=Math.abs(distanceY/distanceX);
            if(slope>tg){
                if(distanceY>0) {
                    direction="↓";
                }else{
                    direction="↑";
                }
            }else if(slope<=1/tg) {
                if(distanceX>0) {
                    direction="→";
                }else{
                    direction="←";
                }
            }
            if(lastSign!=direction) {
                signs+=direction;
                lastSign=direction;
                if(showSign){
                    document.body.appendChild(gesturesContent);
                }
            }
        }
    }

    gesturesContent=document.createElement("div");
    gesturesContent.id="gesturesContent";
    gesturesContent.style.cssText="width:300px;height:70px;position:fixed;left:50%;top:50%;margin-top:-25px;margin-left:-150px;z-index:999999999;background-color:#000;border:1px solid;border-radius:10px;opacity:0.65;filter:alpha(opacity=65);box-shadow:5px 5px 20px 0px #000;";
    gesturesContent.innerHTML='<div id="gesturesWords" style="position:absolute;left:20px;top:5px;font:bold 50px \'黑体\';color:#ffffff"></div>';
    gesturesWords = gesturesContent.querySelector("#gesturesWords");

    initEventListener("touchstart","touchmove","touchend",tracer,"e.changedTouches[0].clientX","e.changedTouches[0].clientY");
    initEventListener("mousedown","mousemove","contextmenu",tracer,"e.clientX","e.clientY","e.which === 3");

    alterContent();
    // alterEleLoction();
    addNexPagetLink();

    try{
        document.querySelector('.samebooks1').style.display = 'none';
        document.querySelector('.socialBtn').style.display = 'none';
    }catch(e){
        console.error(e);
    }

/*
    BookReader.ReadSetting.SetFontSize = function(val) {
        val = parseInt(val);
        var rf = parseInt(Common.GetCookie("ziti") || "18");
        if (isNaN(rf)) {
            rf = 20
        }
        val = val + rf;
        if (val > 36) {
            Common.Toast("已經是最大了...");
            val = 36
        }
        if (val < 16) {
            Common.Toast("已經是最小了...");
            val = 16
        }
        Common.SetCookie("ziti", val, (new Date()).AddDays(365), "/");
        $(BookReader.Display.Containers.ChapterDivId).css("font-size", val + "px");
        $(BookReader.Display.Containers.ChapterDivId).children("p").css("font-size", val + "px");
        $(BookReader.Display.Containers.ChapterDivId).css("line-height", val * BookReader.Options.Config.lineHeightRate +"px");
        $(BookReader.Display.Containers.ChapterDivId).children("p").css("line-height", val * BookReader.Options.Config.lineHeightRate + "px")
    }
    */
})();