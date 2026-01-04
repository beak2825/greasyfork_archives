// ==UserScript==
// @name        笔趣阁小说/起点小说自动翻页/阅读到达底部自动翻页/空格手动翻页
// @namespace   1933987037@qq.com
// @include     http://www.cits0871.com/*
// @include     https://www.qidian.com/*
// @license MIT
// @grant       no
// @version     1.7
// @run-at      document-end
// @description 笔趣阁小说/起点小说自动翻页
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/449148/%E7%AC%94%E8%B6%A3%E9%98%81%E5%B0%8F%E8%AF%B4%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E9%98%85%E8%AF%BB%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E7%A9%BA%E6%A0%BC%E6%89%8B%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/449148/%E7%AC%94%E8%B6%A3%E9%98%81%E5%B0%8F%E8%AF%B4%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E9%98%85%E8%AF%BB%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E7%A9%BA%E6%A0%BC%E6%89%8B%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {


    xh()//1.执行自动循环翻页
    function xh(){
        setTimeout(function(){//延迟器
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {//到达底部
                setTimeout(function(){//延迟器
                    xyz();
                },10000)
            }

            xh();
        },3000)
    }

    //2.手动执行翻页
    $(document).keydown(function(event){
        if(event.keyCode == 32){//监听空格键，当到达底部并且空格键按下自动翻页
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
                xyz();
            }
        }
        if(event.keyCode == 39 ){//监听右箭头，按下自动翻页
            xyz();
        }
    });

    function xyz(){//翻页点击
        if(document.querySelector('.bottem2') !== null){
            if(document.getElementsByClassName("bottem2")[0].children[3].text=='下一章'){
                document.getElementsByClassName("bottem2")[0].children[3].click();
            }else if(document.getElementsByClassName("bottem2")[0].children[2].text=='下一章'){
                document.getElementsByClassName("bottem2")[0].children[2].click();
            }else{
                document.getElementsByClassName("bottem2")[0].children[4].click();
            }
        }
        if(document.querySelector('.nav-btn-group') !== null){
            document.getElementsByClassName("nav-btn-group")[0].children[2].click();
        }


    }

    document.getElementsByClassName("header_logo")[0].style.display='none';
    document.getElementsByClassName("logo")[0].style.display='none';





})();