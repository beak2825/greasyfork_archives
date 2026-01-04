// ==UserScript==
// @name        Asil Graph Size Change 2.0
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     2.0
// @author      모느나
// @editor      그레이스호퍼
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @description 아실 그래프 사이즈 조절 플러그인 1.1버전에서 버그발생 부분 해결한 코드입니다.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/483746/Asil%20Graph%20Size%20Change%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/483746/Asil%20Graph%20Size%20Change%2020.meta.js
// ==/UserScript==
 
 
(function sizeChangeFnc() {
 
  let panelSizeOrg = 390;
  let panelSizeMod = 1000;
  let panelSize = 390;
 
  let changeColor = "red";
  let orgColor = "white"
 
 
   let compareSizeModifyEle = `<div class="filter_item" id="graphSizeBtnWrap"><a href="#" class="filter_btn" id="compareSizeModify"><i></i>S</a></div>`;
 
 
   jQuery('#filter > div.filter_scroll > div').append(compareSizeModifyEle);
 
   jQuery(document).on('click', (e) => {
 
     if(e.target.id === 'compareSizeModify'){
 
         panelSize = panelSize === panelSizeOrg ? panelSizeMod : panelSizeOrg;
 
         // 1. 그래프 판텔사이즈 변경
         //jQuery('#contents > div.ctn_wrap.open').css('width', panelSize); 버그
         jQuery('#contents > div.detail_wrap.open').css('width', panelSize); //추가코드
 
         // 2. map 판넬 사이즈 변경
         let mapPanel = jQuery('#contents > div.map_wrap');
         let mapPanelSize = parseInt(mapPanel.css('width'), 10);
 
         if( panelSize === panelSizeOrg ){
           jQuery('#graphSizeBtnWrap').css('background-color', orgColor);
           mapPanel.css('width', "");
         }
         else{
           mapPanelSize = mapPanelSize - (panelSizeMod - panelSizeOrg);
           jQuery('#graphSizeBtnWrap').css('background-color', changeColor);
           mapPanel.css('width', mapPanelSize);
         }
 
        // 3. 단지리스크 TEXT DIV 크기조절
        // document.querySelector('#sub1').contentWindow.document.querySelectorAll("#search_lst > span").forEach(item => item.style.width = "auto" ); 버그
        document.querySelector('#sub2').contentWindow.document.querySelectorAll("#search_lst > span").forEach(item => item.style.width = "auto" ); //추가코드
     }
 
   });
 
 
 
})();v