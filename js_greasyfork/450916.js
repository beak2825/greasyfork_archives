// ==UserScript==
// @name         鼠鼠我啊
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  B站新版首页推荐视频关键词屏蔽，新增屏蔽分区功能
// @author       NANXIANGHUMAO
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450916/%E9%BC%A0%E9%BC%A0%E6%88%91%E5%95%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450916/%E9%BC%A0%E9%BC%A0%E6%88%91%E5%95%8A.meta.js
// ==/UserScript==

//想添加屏蔽词在下面这一行中的单引号内添加，例如屏蔽猫和狗，可写为var keywords = new Array('猫','狗');                   然后文件保存即可
var keywords_new = new Array('孤独','人生','改变大脑','生肉','情绪','不要笑');
//屏蔽分区的方法如上
var area = new Array('直播','综艺','课堂','娱乐');

























//分区屏蔽
function RubbishFuckingGetout(arr){
    for(var i = 0;i < arr.length;i++){
        if(document.getElementById(arr[i]) != null){
        if(document.getElementById(arr[i]).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id = 'i_cecream'){
           document.getElementById(arr[i]).parentNode.parentNode.parentNode.parentNode.remove();
        }else{
            document.getElementById(arr[i]).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }
        //document.getElementById(arr[i]).parentNode.parentNode.parentNode.parentNode.remove();
    }
    }
}

//推荐视频屏蔽
function refresh_new(arr){
    var list = document.getElementsByClassName('bili-video-card is-rcmd');
    for(var a = 0;a < list.length;a++){
        //console.log(a);
        for(var j = 0;j < arr.length;j++){
            var tem_arr = new RegExp(arr[j]);
            //console.log(tem_arr);
            if(tem_arr.test(list[a].children[1].children[0].children[0].children[0].children[1].lastElementChild.alt)){
               list[a].remove();
               console.log('已屏蔽'+a+'个视频');
               a = -1;
               tem_arr.lastIndex=0;
               break;
            }else{
                  tem_arr.lastIndex=0;
            }
        }
    }
}
(function() {
//屏蔽首页分区
    setTimeout(function(){
        RubbishFuckingGetout(area);
    },1500);
//屏蔽首页推荐视频
    setTimeout(function(){
               refresh_new(keywords_new);
               //console.log("已执行1");
    },500);
    setTimeout(function(){
               refresh_new(keywords_new);
               //console.log("已执行1");
    },500);
    var refresh_bottom = document.getElementsByClassName('primary-btn roll-btn');
    refresh_bottom[0].onclick = function(){
        setTimeout(function(){
                   refresh_new(keywords_new);
                   //console.log("已执行2");
        },500);
        setTimeout(function(){
                   refresh_new(keywords_new);
        },500);
    };
})();