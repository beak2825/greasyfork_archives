// ==UserScript==
// @name         Weread-Progress-Show
// @namespace    https://github.com/ralix/Weread-Progress-Show
// @version      1.0.1
// @description  在网页版微信读书右下角显示当前阅读进度
// @match        https://weread.qq.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481490/Weread-Progress-Show.user.js
// @updateURL https://update.greasyfork.org/scripts/481490/Weread-Progress-Show.meta.js
// ==/UserScript==

var currentChapterRatio=0;
var nextChapterRatio=0;
var result=0;
var count=0;

(function () {
    'use strict';

    GM_addStyle('#progressBox {position: fixed; bottom: 60px; right: 5px; width: 50px; \
    height: 30px; \
    font-size: xx-small; \
    padding: 0px; \
    align-items: center; \
    align-content: center; \
    text-align: center; \
    display: flex; \
    justify-content: center; \
    background-color: #6b6b6b; \
    color: #fff; \
    border-radius: 5px;\ }')

    //console.log("start");

    window.addEventListener('load', function() {
    //console.log("loaded");
    // 在页面加载完成后执行的操作
        updateProgressBox();
    });

    window.addEventListener('keydown', function() {
    //console.log("loaded");
    // 在页面加载完成后执行的操作
        updateProgressBox();
    });

    // Listen for scroll events
    window.addEventListener('scroll', updateSrollRatio);

    // watch chapter change
    watchChapterChange();



})();

function watchChapterChange(){

        // 查找具有class="chapterItem"的元素
    //let chapterItems = document.getElementsByClassName("chapterItem");
    let chapterItems = document.querySelectorAll(".readerCatalog_list_item");

    // 创建一个 MutationObserver 实例
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // 检查属性变化的类型
        if (mutation.type === "attributes") {
          // 属性发生变化。 evoke when chapter changes.
          updateChapterRatio(chapterItems);
          //console.log("属性发生变化：" + mutation.attributeName);
        }
      });
    });

    // 配置观察选项
    var config = { attributes: true };

    // 开始观察目标元素列表中的每个元素
    for (var i = 0; i < chapterItems.length; i++) {
      observer.observe(chapterItems[i], config);
    }

}

//evoke when sroll changes
function updateSrollRatio(){
  const scrollPosition = window.scrollY;
//  console.log("scrollPosition: "+scrollPosition);
  const maxScrollPosition = document.documentElement.scrollHeight - window.innerHeight;
//  console.log("maxScrollPosition: "+maxScrollPosition);

  let scrollRatio;
  let totalRatio;

  if(maxScrollPosition == 0){
    //只有一页
  }
  else {
    scrollRatio = scrollPosition / maxScrollPosition;
    totalRatio = (nextChapterRatio - currentChapterRatio) * scrollRatio + currentChapterRatio;
    result = totalRatio.toFixed(1);
  }
  //console.log("scrolled");
  updateProgressBox();

}


function updateChapterRatio(chapterItems) {

    let chapterTotal = chapterItems.length;

    for (let i = 0; i < chapterTotal; i++) {
        let className = chapterItems[i].className;
        if (className.includes("readerCatalog_list_item_selected")) {
            currentChapterRatio = parseFloat(((i / chapterTotal) * 100).toFixed(1));
            nextChapterRatio = parseFloat((( (i+1) / chapterTotal) * 100).toFixed(1)) ;

            result=currentChapterRatio;
            //console.log("chapter changed");
            updateProgressBox();
        }
    }
}


//show the percentage result
function updateProgressBox(){

    let progressBox = document.querySelector("#progressBox");

    if (!progressBox){ //not found, then create.
        progressBox = document.createElement('div');
        progressBox.setAttribute('id', 'progressBox');
        document.body.appendChild(progressBox);
    }
    //update
    progressBox.innerHTML = result + "%";


    let footerAddon = document.querySelector('#footerAddon');
    if (!footerAddon) {
        footerAddon = document.createElement('div');
        footerAddon.setAttribute('id', 'footerAddon');
        footerAddon.setAttribute('style',"font-size:large");
        //console.log(footerAddon);
    }
    //update
    footerAddon.innerHTML = "<p>Progress Now:</p> <p>"+ result + "% </p>";



    let footer = document.querySelector('.readerFooter');
    if (footer){
        footer.setAttribute('style',"padding:300px 100px");
        footer.appendChild(footerAddon);
        console.log("footer added");

    }
    else{
        console.log("footer is null."+ count);
    }
    //count++;


}
