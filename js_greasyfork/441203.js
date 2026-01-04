// ==UserScript==
// @name         360插件弹出插件下载地址
// @namespace    https://zhaojiafu.blog.csdn.net/
// @version      0.1
// @description  方便获取360插件的下载地址
// @author       zhaojiafu
// @match        https://ext.chrome.360.cn/webstore/search/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441203/360%E6%8F%92%E4%BB%B6%E5%BC%B9%E5%87%BA%E6%8F%92%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/441203/360%E6%8F%92%E4%BB%B6%E5%BC%B9%E5%87%BA%E6%8F%92%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 访问地址：https://ext.chrome.360.cn/webstore/search/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD
    function Get_extid_crx(extid_list,extid){
        for (let extid_i in extid_list){
            let extid_one = extid_list[extid_i]
            if (extid_one["crx_id"] == extid){
                return extid_one["filename"]
            }
        }
    };


    function check_img_items(){
        //debugger;
        let applist = $(".ext-btns");
        applist.map((index,item)=>{
            console.log("index",index);
            console.log("item",item);
            let extid = item.getAttribute('extid');
            let extid_list = __initData["list"];
            // 获取当前的地址
            let filename = Get_extid_crx(extid_list,extid);
            item.onclick = function () {
                console.log(extid,filename)
                alert(filename);
            }

            debugger;
        });
    };

    // 定时器
    setInterval(check_img_items,5000);

})();