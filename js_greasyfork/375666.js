// ==UserScript==
// @name         ZhihuHelper
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A real "helper" for Zhihu
// @author       You
// @match        https://*.zhihu.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375666/ZhihuHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/375666/ZhihuHelper.meta.js
// ==/UserScript==

function AddPersonalStyle() {
    'use strict';
    //Expend the read div width

    var myStyle = document.createElement("style");
    myStyle.setAttribute("id","myStyle");
    myStyle.setAttribute("type","text/css");
    myStyle.appendChild(document.createTextNode(""));
    document.head.appendChild(myStyle);
    myStyle.sheet.insertRule('.GlobalSideBar{display:none}',0);
    //Hide images
    myStyle.sheet.insertRule('figure{display:none}',1);
    myStyle.sheet.insertRule('.ContentItem-title{font-size:15px;font-weight:400}',2);
    myStyle.sheet.insertRule('.RichContent-cover{display:none}',3);
    myStyle.sheet.insertRule('.ArticleItem-image{display:none}',3);
    //Buttons at the article bottom
    myStyle.sheet.insertRule('.Button--withIcon{display:none}',4);
    myStyle.sheet.insertRule('.Sticky div a svg{display:none}',5);
    myStyle.sheet.insertRule('.TopstoryItem--advertCard{display:none}',6);
    myStyle.sheet.insertRule('.btnFloatCorner{position:fixed;margin:20px;float:right;top:50px}',7);
    myStyle.sheet.insertRule('.VoteButton {background: #FFF; color: #000;}',8);
    myStyle.sheet.insertRule('.TopstoryItem--advertCard{display:none}',9);
    myStyle.sheet.insertRule('svg{display:none}',10);
    myStyle.sheet.insertRule('.ContentItem-more{float:right}', 11);
    myStyle.sheet.insertRule('.Topstory-container{width:70%}',12);
    myStyle.sheet.insertRule('.Topstory-mainColumn{width:100%}',12);
    myStyle.sheet.insertRule('.stackoverflow{width:10%;float:left}',12);
}
AddPersonalStyle();
    
function AddControlBtn(){
    var ctlBtn = document.createElement("button");
    ctlBtn.setAttribute("id", "mainCtlBtn");
    ctlBtn.setAttribute("class", "btnFloatCorner");
    var btnImg = document.createElement("img");
    btnImg.setAttribute("src", "https://www.stackoverflowbusiness.com/hubfs/B2B-SO/images/SO_Talent.svg");
    btnImg.setAttribute("class", "stackoverflow");
    ctlBtn.appendChild(btnImg);
    document.body.appendChild(ctlBtn);
}
AddControlBtn();
    
/*******************************Below is functions********************************** */
//Control the img display
$("#mainCtlBtn").on("click", function (){
    var styleElement = document.getElementById("myStyle");
    if(styleElement.sheet.cssRules[1].style.display == "none"){
        styleElement.sheet.cssRules[1].style.display = "block";
    }else{
        styleElement.sheet.cssRules[1].style.display = "none";
    }
});