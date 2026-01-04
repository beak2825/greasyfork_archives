// ==UserScript==
// @name         知乎Fxxk
// @version      2.1
// @namespace    undefined
// @description  移除知乎官方的回答,推荐页广告,回答页中广告
// @author       SHIFU
// @grant        none
// @match        *://www.zhihu.com/*

// @downloadURL https://update.greasyfork.org/scripts/404529/%E7%9F%A5%E4%B9%8EFxxk.user.js
// @updateURL https://update.greasyfork.org/scripts/404529/%E7%9F%A5%E4%B9%8EFxxk.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const answerIgnoreList = new Array("故事档案局", "盐选推荐", "真实职业故事","盐选健康必修课","盐选科普","知乎盐选会员","知乎盐选会员",
                                       "盐选科技前沿","盐选文学甄选","盐选成长计划","盐选会员精品","盐选点金",
                                       "盐选生活馆","盐选职场","盐选奇妙物语","盐选博物馆","亲历者说","盐选心理","知乎盐选创作者","真实故事计划");

    const elementIgnoreList = new Array("Pc-feedAd-container ", "RichText-MCNLinkCardContainer",
                                        "Pc-card Card","Card-section RelatedCommodities-list","Card-section RelatedCommodities-list","ecommerce-ad-box",
                                       "RichText-ADLinkCardContainer");
    setInterval(function(){
        var obj = document.getElementsByClassName("ContentItem AnswerItem");
        for(var i = 0;i < obj.length; i++){
            if( obj[i].innerHTML.indexOf("本回答节选自盐选专栏，有助于解答该问题")>=0) {
                 obj[i].style.display = "none";
               // console.log(obj[i].innerHTML);
                continue;
            }
            var trashNode=obj[i].attributes["data-zop"].value;
            try {
                var jsonObject= JSON.parse(trashNode);
                if(answerIgnoreList.indexOf(jsonObject.authorName)>=0) {
                    obj[i].style.display = "none";

                }
            } catch (e) {
            }
        }

        for (var n =0;n<elementIgnoreList.length; n++) {
            var element = document.getElementsByClassName(elementIgnoreList[n]);
            for(var j = 0;j < element.length; j++){
                element[j].style.display = "none";
            }

        }
    },1500);

})();
