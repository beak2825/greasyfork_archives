// ==UserScript==
// @name         poe Table/Code 樣式修改2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  poe code / table css changes for CHATGPT
// @author       Whatever
// @match        https://poe.com/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464029/poe%20TableCode%20%E6%A8%A3%E5%BC%8F%E4%BF%AE%E6%94%B92.user.js
// @updateURL https://update.greasyfork.org/scripts/464029/poe%20TableCode%20%E6%A8%A3%E5%BC%8F%E4%BF%AE%E6%94%B92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load" , function(){
         Main();
      });


    function Main(){
        const forSwitchBot = document.querySelector('.PageWithSidebarLayout_centeringDiv___L9br');//this dom for check if switch page and update code
        const MainmessagesBoard = document.querySelector('.ChatMessagesView_infiniteScroll__K_SeP');
        const highlightJS = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js";

        //https://cdnjs.com/libraries/highlight.js  to find fav code style
        //https://highlightjs.org/static/demo/   code style demo
        const highlightCSS = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/base16/gruvbox-dark-soft.min.css";


        //import external file
        var script = document.createElement("script");
        script.src = highlightJS;
        document.head.appendChild(script);
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = highlightCSS;
        document.head.appendChild(link);


        const observer = new MutationObserver(function(mutations) {
            hljs.highlightAll();
        });
        observer.observe(MainmessagesBoard, { childList: true});




        //
        var observer2 = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    // 獲取新增的子元素
                    var addedNodes = mutation.addedNodes;
                    for (var i = 0; i < addedNodes.length; i++) {
                        var addedNode = addedNodes[i];
                        // 判斷新增的子元素是否為 <pre><code></code></pre>
                        if (addedNode.nodeName === "PRE" && addedNode.firstChild.nodeName === "CODE") {
                            console.log("新增 <pre><code></code></pre> 元素：", addedNode);
                            observerCode(addedNode.firstChild);
                            //setTimeout(() => {hljs.highlightBlock(addedNode.firstChild)},1000);
                        }
                    }
                }
            });
        });




        function observerCode(target){
            let prevContent="";
            let currentContent="";
            let intervalId = setInterval(() => {
                prevContent=target.innerHTML;
                if (prevContent==currentContent) {

                    hljs.highlightBlock(target);
                    observer.disconnect();
                    clearInterval(intervalId);
                }

                currentContent=target.innerHTML;
            }, 1000);
        }



        observer2.observe(MainmessagesBoard, { childList: true, subtree: true });


       const observer3 = new MutationObserver(function(mutations) {
            setTimeout(() => {hljs.highlightAll();},500);
        });
        observer3.observe(forSwitchBot, { childList: true, subtree: true });






        //add CSS style
        var css = document.createElement("style");
        css.textContent =`
    .PageWithSidebarLayout_mainSection__i1yOg{
    max-width:1200px !important;

}

@media screen and (min-width: 685px){
.PageWithSidebarLayout_mainSection__i1yOg {
    width: 1200px;
}
}
table { border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif; min-width: 400px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); }
thead tr {
background-color: #009879;
color: #ffffff;
text-align: left;
}
th,td {
padding: 12px 15px;
}

tbody tr {
border-bottom: 1px solid #dddddd;
}

tbody tr:nth-of-type(even) {
background-color: #f3f3f3; }

tbody tr:last-of-type {
border-bottom: 2px solid #009879; }
`;
          document.head.appendChild(css);

          setTimeout(() => {hljs.highlightAll();},1000);


    }



})();