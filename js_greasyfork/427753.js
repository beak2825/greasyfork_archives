// ==UserScript==
// @name         Bilibili分P标题fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从列表中抽取Bilibili分P视频中当前part的标题，并写入到标题中
// @author       tumuyan
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427753/Bilibili%E5%88%86P%E6%A0%87%E9%A2%98fix.user.js
// @updateURL https://update.greasyfork.org/scripts/427753/Bilibili%E5%88%86P%E6%A0%87%E9%A2%98fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title="";

    function updateTitle(){
        var searchStr = location.search;
        var t=0;

        if(searchStr.length>1){
            t= Number(searchStr.replace(/.*(\?|&)p=([0-9]+)(&.*|$)/,"$2"))-1;
        }
        console.log("bilibili分P p="+t);

        var p= document.getElementsByClassName("list-box")[0];
        var l=p.childNodes[t];

        if(l==undefined){
            console.log("Bilibili分P 未找到列表");
            return;
        }

        let h=document.getElementsByTagName("h1")[0];

        if(title==""){
            title=h.innerText;
        }

        let m=title+" / "+l.innerText.replace(/[\s0-9:]+$/,'');

        console.log("bilibili分P title= "+m);
        h.textContent=m;
        let n=document.getElementsByTagName("title")[0];
        n.textContent=m+" - 哔哩哔哩_bilibili";
    }

    setTimeout(function () {


        var p= document.getElementsByClassName("list-box")[0];

        if(p!=undefined){

            // 观察者的选项(要观察哪些突变)
            var config = { attributes: true, childList: true, subtree: true };

            // 当观察到突变时执行的回调函数
            var callback = function(mutationsList) {
                mutationsList.forEach(function(item,index){
                    console.log("callback: "+item);
                    if (item.type == 'childList') {
                        console.log('有节点发生改变，当前节点的内容是：');
                        console.log(item.target.innerHTML);
                    } else if (item.type == 'attributes') {
                        console.log('修改了'+item.attributeName+'属性');

                        if(item.attributeName=='style'){
                            updateTitle();

                        }
                    }
                });
            };

            // 创建一个链接到回调函数的观察者实例
            var observer = new MutationObserver(callback);

            // 开始观察已配置突变的目标节点
            observer.observe(p, config);

            updateTitle();

        }

    },3000)

})();