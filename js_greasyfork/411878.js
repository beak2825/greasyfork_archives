// ==UserScript==
// @name         键盘刷NGA,去除主页冗余header
// @namespace    com.nathan.du.script
// @version      0.2
// @description  Read NTR Threads with one hand using keyboard arrow keys!
// @author       Nathan
// @include      *://bbs.nga.cn*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/411878/%E9%94%AE%E7%9B%98%E5%88%B7NGA%2C%E5%8E%BB%E9%99%A4%E4%B8%BB%E9%A1%B5%E5%86%97%E4%BD%99header.user.js
// @updateURL https://update.greasyfork.org/scripts/411878/%E9%94%AE%E7%9B%98%E5%88%B7NGA%2C%E5%8E%BB%E9%99%A4%E4%B8%BB%E9%A1%B5%E5%86%97%E4%BD%99header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //var script = document.createElement('script');
    //script.src = "https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js";
    //document.head.appendChild(script);
    function delayInvoke(func,delay=0){
        setTimeout(()=>{
            func && func();
        },delay);
    };



    function isListPage(){
        let url = window.location.href;
        return url == "https://bbs.nga.cn/thread.php?fid=-7";
    }

    var currentIndex = 0;
    var currentHref = undefined;
    var count = document.getElementsByClassName("topicrow").length;
    let topOffset = document.getElementById("m_pbtntop").offsetTop;

    function changeThreadBg(index){
        console.log("changeThreadBg:"+index)

        let threadTag = document.getElementsByClassName("topic")[index];
        threadTag.style.backgroundColor = "#f00873";
        currentHref = threadTag.href;

    };
    function restoreThreadBg(index){
        console.log("restoreThreadBg:"+index)
        let threadTag = document.getElementsByClassName("topic")[index];
        if(!threadTag){
            return;
        }
        console.log("href:"+threadTag.href)
        threadTag.style.backgroundColor = "";
    };




    window.onload = function(){
        if(isListPage()){
            document.getElementById("sub_forums").style.display="none";
            document.getElementsByClassName("contentBlock")[0].style.display="none";
            changeThreadBg(currentIndex);
        };
        delayInvoke(()=>{
            window.scrollTo(0,topOffset);
        },100);
        document.onkeydown = function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            console.log("keyCode:"+ e.keyCode);
            if (e && (e.keyCode == 113 || e.keyCode == 96 )) { // 按 F2　 或者 数字0
                window.location.href = "https://bbs.nga.cn/thread.php?fid=-7";
            }

            if (e && e.keyCode == 13 && isListPage()) { // enter 键

                window.location.href = currentHref;

            }
            if (event.keyCode == 37){  //方向键左
                window.history.back(-1);
            }
            if (event.keyCode == 39 && isListPage()){  //方向键右
                window.location.href = currentHref;
            }
            if (event.keyCode == 38 && isListPage()){  //方向键上
                if(currentIndex == 0){
                    return;
                }
                window.scrollTo(0,topOffset+document.getElementsByClassName("topicrow")[currentIndex].offsetTop);
                restoreThreadBg(currentIndex);
                currentIndex --;
                changeThreadBg(currentIndex);
            }
            if (event.keyCode ==40 && isListPage()){  //方向键下
                if(currentIndex >= count - 1){
                    return;
                }
                window.scrollTo(0,topOffset+document.getElementsByClassName("topicrow")[currentIndex].offsetTop);
                restoreThreadBg(currentIndex);
                currentIndex ++;
                changeThreadBg(currentIndex);
                console.log("scroll:"+document.documentElement.scrollTop)

            }



        };
    };






})();