// ==UserScript==
// @name         key words detect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       LeeYuan
// @match        https://www.amazon.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant  GM_addStyle
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/410884/key%20words%20detect.user.js
// @updateURL https://update.greasyfork.org/scripts/410884/key%20words%20detect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url=window.location.href;
    if(url.indexOf('https://www.amazon.com/s?')==-1){
    return;
    }


GM_addStyle(".popblock{width:300px;height: 200px;overFlow:scroll;top:200px;left:450px;z-index: 100;position:fixed;background: #fff;}.popmask{width:100%; height: 100%;left: 0;top: 0;position:fixed;  z-index:99; background: rgba(0,0,0,0.6);}.a-text-center{position:fixed;top:100px;left:550px;z-index:9999}")

insertContent();
var mapping=gatMpping();
    var items= getNaturalItem();
    let hasN=false;
    let hasA=false;
    for(let i=0;i<items.length;i++){

        if(mapping[items[i]]!=undefined){
        if(!hasN){
        $('#content').html('-------------------自然排名:---------------------')
        hasN=true;

        }
         $('#content').text( $('#content').text()+mapping[items[i]]+'--------'+(i+1)+'------------'+items[i]+'\n')
           }

    }
    var aditems= getAdItems();
    for(let i=0;i<aditems.length;i++){

        if(mapping[aditems[i]]!=undefined){

         if(!hasA){
             if(!hasN){
              $('#content').text('------------------------广告排名:-------------------------')
             }else{
                  $('#content').text( $('#content').text()+'------------------------广告排名:-------------------------')
             }
              
        hasA=true;
        }

         $('#content').text( $('#content').text()+mapping[aditems[i]]+'--------'+(i+1)+'--------------'+aditems[i]+'\n')

        }

        }
  $('#shade').toggle();

    
 // Your code here...
})();



function getAdItems()
{
var items=document.querySelectorAll(".AdHolder");
var AdItems=Array();
    for(var i=0;i<items.length;i++){
   AdItems.push(items[i].dataset.asin)
    }
    return AdItems;
}




function getNaturalItem(){
    var items=document.querySelectorAll(".s-result-item");
    var naturalItems=Array();
    for(var i=0;i<items.length;i++){
    if(items[i].classList.contains("s-inner-result-item")|items[i].classList.contains("AdHolder")){
//不予处理
    }
        else
        {
        if(items[i].dataset.asin!=''){
            naturalItems.push(items[i].dataset.asin)
        }

    }

    }
    return naturalItems;

}

function appenTable(text1,text2){

}
function isTymoAsin(asin){
    if(ModelMappings[asin]!=undefind){
    return true
    }
    return false;
}
function getModeByAsin(asin){
return ModelMappings[asin]
}
function gatMpping(){
    var obj={
B07MMQ4BZH:'HC100',
B07MW7BTS9:'HM-400',
B07NQFW1VN:'HM-101',
B07PF2Q8RZ:'HM-101C',
B07QKN3FKC:'HC101',
B07RHXMRDM:'HC210',
B07RLYXZRJ:'HC200',
B07RLTPSLB:'HC100R',
B08625QBFK:'HC200',
B085YD8MQ5:'HC201',
B085FT7KWQ:'HC100N',
B07NQCLD81:'HC500',
B07RLTPSLB:'HC100R',
B086YQHZ74:'HC201',
B088CYKDPQ:'HC201',
B088QYXF44:'A100',
B088ZS9WQB:'HC500',
B089NPCF6G:'HC100R',
B08F7M2LL2:'HC500',

 }
    return obj;

}
function insertContent(){
    var text="<div id='shade' style='display:none;'><div class='popblock'>  <span id=content>无结果...</span> </div> <div class='popmask' onclick='remove()'></div></div>"
    $('body').append(text);

}
unsafeWindow.remove=function(){
$('#shade').toggle();
}


