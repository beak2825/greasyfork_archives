// ==UserScript==
// @name         估算5E天梯分(已失效)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  算法来自 @THaGKI9 thagki9.com/5e
// @author       Amaz1ngDM
// @include      https://www.5ewin.com/data/player/*
// @require http://code.jquery.com/jquery-3.5.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/400689/%E4%BC%B0%E7%AE%975E%E5%A4%A9%E6%A2%AF%E5%88%86%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400689/%E4%BC%B0%E7%AE%975E%E5%A4%A9%E6%A2%AF%E5%88%86%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var uid = window.location.href.split("data/player/")[1];

    var userType =$('body').text().indexOf("房间靓号")>-1;
    if(userType)
    {
        $(".match-tab-item.posr.fleft.c-pointer").click(function(){

            setTimeout(function(){
                if($("#J_MainContent > div.season-datas > div.bd.mt10 > div > div.fleft.single-data.ml10 > ul > li:nth-child(3) > p.fs14.s-label").text()=="天梯"){

                    console.log("loading...");
                    var svip_eloElm =$('#J_MainContent > div.season-datas > div.bd.mt10 > div > div.fleft.single-data.ml10 > ul > li:nth-child(3) > p.fs20.b.font-industry.s-val.elo.posr');
                    var eloElmOriText =svip_eloElm.text();
                    $.getJSON("https://1217741033825494.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/FiveEEloLookup/InferElo/?id="+uid+"&t="+new Date(),function(data){
                        if(data.success){
                            debugger
                            svip_eloElm.text(eloElmOriText+"("+data.data.elo+")");
                        }else{
                            svip_eloElm.text(eloElmOriText+"(API错误)");
                        }
                    });
                }
            }, 200);

        });
    }else
    {
        var eloElm =$('body > div.player-main-wrap > div > ul > li.posr > span');
        var eloType =$('body > div.player-main-wrap > div > ul > li.posr > h3');

        if(eloType.text()!="天梯"){
            return;
        }

        console.log("loading...");
        var eloElmOriText =eloElm.text();
        $.getJSON("https://1217741033825494.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy/FiveEEloLookup/InferElo/?id="+uid+"&t="+new Date(),function(data){
            if(data.success){
                eloElm.text(eloElmOriText+"("+data.data.elo+")");
            }else{
                eloElm.text(eloElmOriText+"(API错误)");
            }
        });
    }
})();