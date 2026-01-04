// ==UserScript==
// @name        autoMoveToAhref
// @namespace   Violentmonkey Scripts
// @match       https://m.cafe.naver.com/ca-fe/web/cafes/27549420/articles/*
// @match       https://m.cafe.naver.com/ca-fe/web/cafes/27549420/menus/*
// @grant       none
// @version     1.1
// @author      -
// @description 2022. 12. 19. 오전 1:02:50
// @downloadURL https://update.greasyfork.org/scripts/457288/autoMoveToAhref.user.js
// @updateURL https://update.greasyfork.org/scripts/457288/autoMoveToAhref.meta.js
// ==/UserScript==

function printTime(){
  let today = new Date();
  console.log(`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}.${today.getMilliseconds()}`);
}

function autoMoveToAhref() {
   let inDebounce;
   let title;

   var target = document.querySelector('#app');


   if (!target)
       return;


   var observer = new MutationObserver(function(mutations) {

       mutations.forEach(function(mutation) {
           [].slice.call(mutation.addedNodes).forEach(function(addedNode) {


             let aEle = document.querySelectorAll('.se-oglink-info')[0]
             // console.log(addedNode, addedNode.nodeType)

             var runFnc = function (){
               printTime()
               // console.log(addedNode, aEle)
               aEle.click()

               setTimeout(() => title = '' , 2000);

             };


             if( aEle == null || addedNode.nodeType != 1){
               return false;
             }
             else if( addedNode.classList.length > 0 && addedNode.classList[0] === 'eg-flick-camera' && title != document.title){

               if(inDebounce) clearTimeout(inDebounce)

               inDebounce = setTimeout(runFnc, 100);
               title = document.title;
             }

           });
       });
   });

   var config = {
       // attributes: true,
       childList: true,
       subtree: true,
   };

   observer.observe(target, config);

}

autoMoveToAhref();