// ==UserScript==
// @name         自动评教（西电专版）
// @namespace    https://jashshor.fun/
// @version      0.6
// @description  （适用西安电子科技大学网上评教应用APP）自动网上选项评教+文本框评教，自动选择非常满意，填入"对教授内容很满意，老师辛苦了！" （脑抽瞎更新了一下……好像0.3版本没有问题）
// @author       JashShor
// @match        *://ehall.xidian.edu.cn/jwapp/sys/wspjyyapp/*default/*
// @icon         https://bkimg.cdn.bcebos.com/pic/7aec54e736d12f2ec1809b2345c2d562843568ef?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg
// @grant        某个原创小哥
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window
// @downloadURL https://update.greasyfork.org/scripts/426427/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E8%A5%BF%E7%94%B5%E4%B8%93%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/426427/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E8%A5%BF%E7%94%B5%E4%B8%93%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
'use strict';
/**
    var shor = {
        'name': 'jash'
    };
**/

$(()=> {

 let param = {

  tag: true,

  num: 1,

  ele: document.createElement('div'),

  icon: '&#xe6a2;',

  homeIcon: '&#xe643;',

  moreIcon: '&#xe627;',

  personalIcon: '&#xe644;',

  closeIcon: '&#xe628;',

  distance: '500',

  css: "position:fixed;" +

  "bottom:4rem;" +

  "box-shadow:10px 10px 10px gray;" +

  "right:10px;" +

  "display:none;" +

  "font-size:1.5rem;" +

  "color:#fff;" +

  "z-index:1000;" +

  "height:2.5rem;" +

  "width:2.5rem;" +

  "background:#f44336;" +

  "border-radius:50%;" +

  "line-height:2.5rem;" +

  "text-align:center",

  menuCss: "position:absolute;" +

  // "bottom:3rem;" +

  "display:none;" +

  "box-shadow:10px 10px 10px gray;" +

  "font-size:1.2rem;" +

  "color:#fff;" +

  "background:orange;" +

  "height:2rem;" +

  "width:2rem;" +

  "border-radius:50%;" +

  "text-align:center;" +

  "line-height:2rem;"

  // type: '#top'

 };

 {

  document.querySelector('body').appendChild(((ele)=> {

   ele.className = 'scroll iconfont';

   ele.innerHTML = param.moreIcon;

   // ele.href = param.type;

   ele.style.cssText = param.css;

   for (let i = 0; i < 3; i++) {

    let menu_personal = document.createElement('a');

    menu_personal.className = 'iconfont';

    menu_personal.style.cssText = param.menuCss;

    switch (i) {

     case 0:

      setStyle(menu_personal, '#2196f3', '2.4rem', '2.4rem', param.homeIcon, 'home');

      break;

     case 1:

      setStyle(menu_personal, '#4caf50', 0, '3.5rem', param.personalIcon, 'personal');

      break;

     case 2:

      setStyle(menu_personal, '#fdd835', '3.5rem', '0', param.icon, 'top');

      break;

    }

    param.ele.appendChild(menu_personal);

   }

   return ele;

  })(param.ele));

  function setStyle(ele, ...args) {

   ele.style.background = args[0];

   ele.style.bottom = args[1];

   ele.style.right = args[2];

   ele.innerHTML = args[3];

   ele.id = args[4];

  }

 }

 {

  $(window).scroll(()=> {

   var scrollValue = $(window).scrollTop();

   if (scrollValue > param.distance) {

    if (param.tag) {

     $(param.ele).css('display', 'block').animateCss('fadeInRight');

     param.tag = !param.tag;

    }

   } else {

    if (!param.tag) {

     $(param.ele).css('display', 'none');

     $(param.ele).children().css('display', 'none');

     param.num++;

     param.tag = !param.tag;

    }

   }

  });

  $(param.ele).click((e)=> {
      finish();

  })

 }

});






//    GM_setValue('jash', shor);
//alert('预计10s后开始答卷，确保页面已经加载完成');
//setTimeout(()=>check(),5000);

return;
})();

/**
function check(){
var optionBtn=document.getElementsByClassName("bh-radio-label");
if(GM_getValue('jash').name =='jash'|(GM_getValue('jash').name =='shor'&optionBtn.checked==0)){
setTimeout(()=>check(),1500);
if(optionBtn.length!=0){
	setTimeout(()=>finish(),500);
    var shor = {
        'name': 'shor'
    };
    GM_setValue('jash', shor);
}}
return false;
}
**/

function finish(){
console.log(0);
var optionBtn=document.getElementsByClassName("bh-radio-label");
for(var i=0;i<optionBtn.length;i+=4)
{
	optionBtn[i].click();
    console.log(1);
}
var textAreaOption=document.getElementsByClassName("bh-txt-input__txtarea");
for(i=0;i<textAreaOption.length;i++)
{
    textAreaOption[i].value="对教授内容很满意，老师辛苦了！";
    console.log(2);
}
}
