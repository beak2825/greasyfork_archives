// ==UserScript==
// @name         招聘求职助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  暂时只支持boss直聘。支持给岗位添加备注，下次可以直接看到自己添加的备注
// @author       indigo6a
// @match        https://www.zhipin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465859/%E6%8B%9B%E8%81%98%E6%B1%82%E8%81%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465859/%E6%8B%9B%E8%81%98%E6%B1%82%E8%81%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
    // 监听查询工作的ajax请求
/**
const originFetch = fetch
unsafeWindow.fetch = (...args)=>{
    console.log("fetch:",args[0])
    if(args[0].indexOf("search/joblist.json")!=-1) {

    }
    return originFetch(...args);
}
**/
// 拦截http请求
function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}
(function() {
    'use strict';

  addXMLRequestCallback( function( xhr ) {
            xhr.addEventListener("load", function(){
              //判断页面加载状态的
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                     console.log("load url:",xhr.responseURL);
                    //判断是不是自己想要监听的URl地址  字符串就是 你需要监听的地址
                    if ( xhr.responseURL.includes("search/joblist.json")||xhr.responseURL.includes("job/list.json") ) {
                        console.log(xhr.responseURL);
                        // 请求完列表后，1.5秒开始处理列表
                        setTimeout(processPage,1500)
                    }
                }
            });
        });
console.log("init...");
    // 处理页面
    function processPage() {
              let items = document.querySelectorAll(".job-card-wrapper");
  //  console.log("result:",items);

        let data = GM_getValue("data");
        console.log("get init data:",data);
    // 添加备注按钮和查询备注信息
       for(let item of items) {
           // 获取公司名字和岗位名字
           let companyName = "";
           let jobName = "";
           let companyEle = item.querySelector(".company-name")
           let jobNameEle = item.querySelector(".job-name")
           // 右下角的描述
           let infoDescEle = item.querySelector(".info-desc")

           if(companyEle) {
               companyName = companyEle.textContent
           }
           if(jobNameEle) {
               jobName = jobNameEle.textContent
           }
           // 生成岗位的唯一键
           let key = companyName+"-"+jobName;
           if(data[key]) {
               let remark = data[key].remark
               infoDescEle.innerHTML=`<span style="color:red">${remark}</span><span>${infoDescEle.innerHTML}</span>`;
           }

           // 添加按钮到位置
           let tagList = item.querySelector(".job-info")
           if(!tagList) {
               console.error("没有找到taglist，插入按钮失败");
               return;
           }

           // 生成一个a标签包围按钮，不然点击后会跳到连接
           let a = document.createElement("a");
           a.href="javascript:;"

           let button = document.createElement("button");
           button.innerText="修改备注";
           button.addEventListener("click",(event)=>{
                event.stopPropagation();
               console.log("点击添加备注",companyName)
               let key = companyName+"-"+jobName;
               let data = GM_getValue("data", {});
               console.log("get data",data)
               let detail = data[key]||{
                   remark:''
               };
               let remark = '';
               if(detail) {
                   remark = detail['remark']
               }
               let value = prompt( key,remark);
               if(value==null) {
                   // cancel
                   return;
               }
               detail['remark']=value
               data[key] = detail;;
               GM_setValue("data",data)

           },true);
           button.type="button";

a.appendChild(button);
           tagList.appendChild(a)

       }
    }
   
    // Your code here...
})();