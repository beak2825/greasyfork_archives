// ==UserScript==
// @name         MT_3房6产
// @namespace    http://www.csgxcf.com/
// @version      1.0.0
// @description  "美团辅助"
// @author       yida  &  nkg
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @match        https://*.magicmirror.sankuai.com/*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425557/MT_3%E6%88%BF6%E4%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/425557/MT_3%E6%88%BF6%E4%BA%A7.meta.js
// ==/UserScript==
(function() {
    'use strict';


    setInterval(() => {
        let disSeAr = document.getElementsByName("disCountSelect");
        for (let i = 0; i < disSeAr.length; i++) {
            if(disSeAr[i].value == "体验·黄金会员减" && document.activeElement != disSeAr[i]){
                disSeAr[i].selectedIndex = 0;
                clearInterval();
            }
        }
    }, 300);

    setInterval(() => {
        let disDeAr = document.getElementsByName("discountDesc");
        for (let i = 0; i < disDeAr.length; i++) {
            if(disDeAr[i].value.indexOf("劵")!=-1 || disDeAr[i].value.indexOf("卷")!=-1){
                disDeAr[i].value = "";
                clearInterval();
            }
        }
    }, 300);

    //0餐食和2餐食检测部分
    setInterval(() => {
        let roomsAr = document.getElementsByName("rooms");
        for (let i = 1; i< roomsAr.length; i++) {
            let dealDivAr = roomsAr[i].children[1].children[0].children;
            if(dealDivAr.length == 2){
                let br1 = dealDivAr[1].children[0].children[2];
                if(br1.value!=0 && br1.value!=2 && document.activeElement != br1){
                    br1.value = "";
                }
            }
            if(dealDivAr.length == 3){
                let br1 = dealDivAr[1].children[0].children[2];
                let br2 = dealDivAr[2].children[0].children[2];
                let cp1 = dealDivAr[1].children[0].children[0]
                let cp2 = dealDivAr[2].children[0].children[0]
                if(cp1.value != cp2.value && cp1.value!="" && cp2.value!=""){
                    cp2.style.background= DColor;
                }else if(cp1.value == cp2.value&& cp1.value!=""){
                    cp2.style.background="";
                }
                if(br1.value == br2.value && br1.value!=""){
                    br2.value = "";
                }else if(br1.value!=0 && br1.value!=2 && document.activeElement != br1){
                    br1.value = "";
                }else if(br2.value!=0 && br2.value!=2 && document.activeElement != br2){
                    br2.value = "";
                }
            }

        }
    }, 300);

    //手动输入后续仍为手动输入
    setInterval(() => {
        let disAr = document.getElementsByName("discountDiv")
        for (let i = 1; i < disAr.length; i++) {
            let disSelect  = disAr[i].children
            if(disSelect.length > 1 && disSelect[0].children[0].selectedIndex == disSelect[0].children[0].length - 1){
                for (let j = 1; j < disSelect.length; j++) {
                    if(disSelect[j].children[0].selectedIndex == 0 && document.activeElement != disSelect[j].children[0]){
                        disSelect[j].children[0].selectedIndex = disSelect[j].children[0].length -1
                    }
                }
            }
        }
    }, 300);
    //房型名称与产品名称对比
    setInterval(() => {
        let roomsAr = document.getElementsByName("rooms");
        let t1divAr = document.querySelectorAll("#t1 > div");
        for (let l = 1; l <= t1divAr.length; l++) {
            for (let i = 1; i < roomsAr.length; i++) {
                let roomS = document.querySelector('#t1 > div:nth-child('+l+') > div:nth-child(2) > table > tbody > tr:nth-child('+ (i+1) +') > td:nth-child(1) > select');
                let dealDivAr = document.querySelectorAll('#t1 > div:nth-child('+l+') > div:nth-child(2) > table > tbody > tr:nth-child('+ (i+1) +') >td:nth-child(2)>div>div');
                for (let j = 1; j < dealDivAr.length; j++) {
                    let dealS = document.querySelector('#t1 > div:nth-child('+l+') > div:nth-child(2) > table > tbody > tr:nth-child('+ (i+1) +') >td:nth-child(2)>div>div:nth-child('+ (j+1)+')>div>select');
                    if(roomS.value.indexOf("大床")!=-1 && dealS.value == "双床" && document.activeElement!= roomS && document.activeElement!= dealS){
                        roomS.style.background = DColor;
                        clearInterval();
                    }else if(roomS.value.indexOf("双床")!=-1 && dealS.value == "大床" && document.activeElement!= roomS && document.activeElement!= dealS){
                        roomS.style.background = DColor;
                        clearInterval();
                    }else{
                        roomS.style.background = "";
                        clearInterval();
                    }
                }
            }
        }
    }, 300);

    //var FColor = "#ffb3a7"; #字幕功能已取消
    var DColor = "#f47983";
    var timeoutflag = null;

    $("#t1").bind("DOMNodeInserted", function(e) {
        if(timeoutflag != null){
            clearTimeout(timeoutflag);
        }
        timeoutflag = setTimeout(function() {
            startIt();
        }, 500);
        setTimeout(function() {
            //产品类型：默认非团购全日房
            $("#dealDiv select[name='dealType']").val("0");

            //房态：默认可预订
            $("#dealDiv input[name='dealStatus']").prop("checked", true);

        }, 100);

    });

    function startIt(){
        function compareIt(eachS, findS, model){
            let fakePack = [],
                realPack = [];
            $.each(eachS,function(n,info){
                fakePack.push($(info).find(findS));
            });

            for (var i=0; i<fakePack.length; i++) {
                realPack.push([]);
            }
            for (let i = 0; i < fakePack.length; i++) {
                realPack[i] = [];
                for (let j = 0; j < fakePack[i].length; j++) {
                    realPack[i].push($(fakePack[i][j]).val());
                    if(model == 1){
                        if (isRepeat(realPack[i], 1)) {
                            $(fakePack[i][isRepeat(realPack[i], 1).index]).css("background", DColor);
                            continue;
                        } else {
                            $(fakePack[i][j]).css("background", "");
                            continue;
                        }
                    }
                    else if(model == 2){
                        if (isRepeat(realPack[i], 1)) {
                            $(fakePack[i][isRepeat(realPack[i], 1).index]).css("background", DColor);
                            continue;
                        } else {
                            $(fakePack[i][j]).css("background", "");
                            continue;
                        }
                    }else if(model == 3){
                        if (isRepeat(realPack[i], 1) && isRepeat(realPack[i], 1).name!="十亿豪补减") {
                            $(fakePack[i][isRepeat(realPack[i], 1).index]).css("background", DColor);
                            $(fakePack[i][isRepeat(realPack[i], 1).index]).val("");
                            continue;
                        } else {
                            $(fakePack[i][j]).css("background", "");
                            continue;
                        }
                    }else if(model == 4){
                        if (isRepeat(realPack[i]) && isNoName(realPack[i][j])) {
                            $(fakePack[i][j]).val("");
                        } else if (isRepeat(realPack[i]) && !isNoName(realPack[i][j])) {
                            $(fakePack[i][j]).val("");
                        } else if (!isRepeat(realPack[i]) && isNoName(realPack[i][j])) {
                            $(fakePack[i][j]).val("");
                        }
                        if (!$(fakePack[i][j]).val()) {
                            $(fakePack[i][j]).css("background", DColor);
                        } else {
                            $(fakePack[i][j]).css("background", "");
                        }
                    }
                }
            }
        }

        /*
        3房3产需要 而3房6产不需要的部分
        //产品名称select比较
        $("#dealDiv select[name='dealSelect']").change(function() {
            let eachS = $("#t1>div>div:last-child");
            let findS = "#dealDiv select[name='dealSelect']";
            compareIt(eachS,findS,1);
        });

        //产品名称input比较
        $("#dealDiv input[name='dealName']").bind("input propertychange", function() {
            let eachS = $("#t1>div>div:last-child");
            let findS = "#dealDiv input[name='dealName']";
            compareIt(eachS,findS,2)
        })
        */

        //促销名称slect比较
        $("#dealDiv select[name='disCountSelect']").change(function(){
            let eachS = $(this).parent().parent().parent();
            let findS = "select[name='disCountSelect']";
            compareIt(eachS,findS,3)
        })

        //促销名称input比较
        $("input[name='discountDesc']").change(function(){
            let eachS = $(this).parent().parent().parent();
            let findS = "input[name='discountDesc']";
            compareIt(eachS,findS,4)
        })

        function priceCheck(priceInput){
            priceInput.bind("input propertychange",function(){
                let pricePack = [];
                let originPrice = $(this).parent().parent().find("input[name='originPrice']").val();
                let showPrice = $(this).parent().parent().find("input[name='showPrice']").val();
                let discount = 0;
                $.each($(this).parent().parent(),function(n,info){
                    pricePack = $(info).find("input[name='discount']");
                });
                if (pricePack.length > 0) {
                    for (var i=0; i<pricePack.length; i++) {
                        if ($(pricePack[i]).val()) {
                            discount += Number($(pricePack[i]).val());
                        }
                    }
                    if (originPrice!=="" && showPrice!=="" && discount!=="") {
                        if (originPrice - discount != showPrice) {
                            $(this).parent().parent().find("input[name='showPrice']").css("background", DColor);
                        } else {
                            $(this).parent().parent().find("input[name='showPrice']").css("background", "");
                        }
                    } else {
                        $(this).parent().parent().find("input[name='showPrice']").css("background", "");
                    }
                } else {
                    if (originPrice!=="" && showPrice!=="") {
                        if (originPrice != showPrice) {
                            $(this).parent().parent().find("input[name='showPrice']").css("background", DColor);
                        } else {
                            $(this).parent().parent().find("input[name='showPrice']").css("background", "");
                        }
                    } else {
                        $(this).parent().parent().find("input[name='showPrice']").css("background", "");
                    }
                }
            })
        }

        //检查原价
        let originPrice = $("input[name='originPrice']");
        priceCheck(originPrice);
        //检查实价
        let showPrice = $("input[name='showPrice']");
        priceCheck(showPrice);
        //促销总和
        $("input[name='discount']").bind("input propertychange", function() {
            let discountPack = [];
            var originPrice = $(this).parent().parent().parent().find("input[name='originPrice']").val(),
                showPrice = $(this).parent().parent().parent().find("input[name='showPrice']").val(),
                discount = 0;
            $.each($(this).parent().parent().parent(), function(n, info) {
                discountPack = $(info).find("input[name='discount']");
            });

            for (var i=0; i<discountPack.length; i++) {
                if ($(discountPack[i]).val()) {
                    discount += Number($(discountPack[i]).val());
                }
            }
            if (originPrice!=="" && showPrice!=="" && discount!=="") {
                if (originPrice - discount != showPrice) {
                    $(this).parent().parent().parent().find("input[name='showPrice']").css("background", DColor);
                } else {
                    $(this).parent().parent().parent().find("input[name='showPrice']").css("background", "");
                }
            } else {
                $(this).parent().parent().parent().find("input[name='showPrice']").css("background", "");
            }
        });

        function isRepeat(ary, num) {
            for (var i=0; i<ary.length; i++) {
                if (ary[i] && ary.indexOf(ary[i]) != i) {
                    if (num == 1) {
                        if (ary[i] != "手动输入") {
                            return {
                                name: ary[i],
                                index: i
                            };
                        }
                    } else {
                        return {
                            name: ary[i],
                            index: i
                        };
                    }
                }
            }
            return "";
        }
        function isNoName(name) {
            if (name.substr(name.length-1, 1) == "减" || name.substr(name.length-1, 1) == "返") {
                return "";
            }
            return name;
        }
    }
})();