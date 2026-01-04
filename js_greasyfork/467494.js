// ==UserScript==
// @name        Asil Graph Size Change
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     1.2
// @author      모느나
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @description 아실 그래프 사이즈 조절 플러그인
// @downloadURL https://update.greasyfork.org/scripts/467494/Asil%20Graph%20Size%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/467494/Asil%20Graph%20Size%20Change.meta.js
// ==/UserScript==


(function sizeChangeFnc() {

  let panelSizeOrg = 390;
  let panelSizeMod = 1000;
  let panelSize = 390;

  let changeColor = "red";
  let orgColor = "white"


   let compareSizeModifyEle = `<div class="filter_item" id="graphSizeBtnWrap"><a href="#" class="filter_btn" id="compareSizeModify"><i></i>S</a></div>`;
   let devClearEle = `<div class="filter_item"  id="hideDepBtnWrap"><a href="#" class="filter_btn" id="devClear"><i></i>H</a></div>`;


   jQuery('#filter > div.filter_scroll > div').append(compareSizeModifyEle).append(devClearEle);

   jQuery(document).on('click', (e) => {

     if(e.target.id === 'compareSizeModify'){

         panelSize = panelSize === panelSizeOrg ? panelSizeMod : panelSizeOrg;

         // 1. 그래프 판텔사이즈 변경
         jQuery('#contents > div.ctn_wrap.open').css('width', panelSize);

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
        document.querySelector('#sub1').contentWindow.document.querySelectorAll("#search_lst > span").forEach(item => item.style.width = "auto" );
     }
     else if( e.target.id === "devClear"){


       let color = jQuery('#hideDepBtnWrap').css('background-color') === 'rgb(255, 0, 0)' ? orgColor : changeColor;

       jQuery('#hideDepBtnWrap').css('background-color', color);

       if( color === changeColor){
          jQuery('path').each((idx, item) => {
            if(jQuery(item).css("fill") === "rgb(75, 234, 236)") jQuery(item).hide()
          })
          jQuery('.devTitle').hide()
       }
    }

   });


})();


$( document ).ready(function(){


  function fnc(){
    var target =  document.querySelector('#map > div:nth-child(1)');

    var inDebounce;
    var timer;

    if (!target)
        return;

    console.log(target);

        var observer = new MutationObserver(function(mutations) {

        mutations.forEach(function(mutation) {

            if(jQuery('#hideDepBtnWrap').css('background-color') != 'rgb(255, 0, 0)')
                return false;

            [].slice.call(mutation.addedNodes).forEach(function(addedNode) {
                //console.log('???');
                console.log(addedNode.classList);


                var runFnc = function (){

                    jQuery('path').each((idx, item) => {
                        if(jQuery(item).css("fill") === "rgb(75, 234, 236)") jQuery(item).hide()
                    })
                    jQuery('.devTitle').hide()
                 };

                 if(inDebounce) clearTimeout(inDebounce)
                 inDebounce = setTimeout(runFnc, 100);

              console.error(1)

            });
        });
    });

    var config = {
        childList: true,
        subtree: true,
    };

    observer.observe(target, config);

  }

  setTimeout(fnc, 3000)

} )

