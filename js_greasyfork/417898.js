// ==UserScript==
// @name         GitHub 清道夫
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  屏蔽GitHub某些项目 提议
// @author       zj1d
// @match        https://github.com/search*
// @downloadURL https://update.greasyfork.org/scripts/417898/GitHub%20%E6%B8%85%E9%81%93%E5%A4%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/417898/GitHub%20%E6%B8%85%E9%81%93%E5%A4%AB.meta.js
// ==/UserScript==
const 黑名单 = [
    "haoxuesen","zhaohmng","zaohmeing","haoxuesen","zhaohmng-outlook-com","Thestrangercamus","shengxinjing"
];
const 检测项目 = ["issue-list-item","repo-list-item","hx_hit-code","commits-list-item","discussion-list-item","hx_hit-package","hx_hit-wiki"];
const 检测内容 = ["muted-link ","v-align-middle","link-gray","link-gray","muted-link","text-gray","muted-link"];
(function() {
    'use strict';
    检测();

})();
document.addEventListener('pjax:success',function(){ // pjax 事件发生后
    检测();
});
function 检测(){
    for(var 类 in 检测项目){
        var 列表 = document.getElementsByClassName(检测项目[类])
        //console.log(列表)
        for(var 项 in 列表){
            项 = 列表[项]
            if(项.toString().indexOf("[object HTML")!=-1){
                // console.log(项.getElementsByClassName(检测内容[类]))
                // console.log(检测内容[类])

                var 开发者 = 项.getElementsByClassName(检测内容[类])[0].innerText
                开发者 = 开发者.split("/")[0]
                // console.log(开发者+"-是否屏蔽-"+黑名单.includes(开发者))
                if(黑名单.includes(开发者)){
                    项.parentNode.removeChild(项)
                    检测()
                }
            }else{
                //console.log(项.toString())
            }
        }
    }

}