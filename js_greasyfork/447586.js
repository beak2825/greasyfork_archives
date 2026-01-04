// ==UserScript==
// @name         自动查询本周代码量（内部使用）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this is inner test code
// @author       You
// @match        *://*/*
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.19/lodash.js
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.8.32/dayjs.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=110.111
// @grant        GM_xmlhttpRequest
// @grant       GM_addElement
// @grant       GM_setValue
// @grant       GM_getValue
// @grant      GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect     *
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447586/%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%9C%AC%E5%91%A8%E4%BB%A3%E7%A0%81%E9%87%8F%EF%BC%88%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447586/%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%9C%AC%E5%91%A8%E4%BB%A3%E7%A0%81%E9%87%8F%EF%BC%88%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
const username =  "";
const password = "";
const startDate = dayjs().day(0).format('YYYY-MM-DD');
const endDate = dayjs().day(6).format('YYYY-MM-DD');
GM_addElement('link', {
    href: 'https://blog.huangwx.cn/css/sweetalert.css',
    type: 'text/css',
    rel:"stylesheet"
});
GM_addElement('script', {
    src: 'https://blog.huangwx.cn/js/sweetalert-dev.js',
    type: 'text/javascript'
});
(function() {
    'use strict';
    let name = GM_getValue('username', username);
    let pwd = GM_getValue('password', password);
    function query(){
        return new Promise((resolve, reject) => {
            if(!name ||  !pwd){
                resolve(JSON.stringify({
                    result: {
                        msg100: true
                    }
                }))
                return;
            }
            GM_xmlhttpRequest({
                "method": "POST" ,
                "url":  "http://10.8.110.111:8001/gitcommitinfo2",
                "data": `password=${pwd}&username=${name}&startDate=${startDate}&endDate=${endDate}`,
                "headers": {
                    "Accept": " */*",
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                "responseType": "json",
                "onload": result => {
                    //GM_deleteValue('username');
                    //GM_deleteValue('password');
                    resolve(result.responseText)
                },
                "onerror": err => {
                    reject(err)
                }
            });
        })
    }
    function setInfo(){
        let lock = setTimeout(() => {
            clearTimeout(lock)
            swal({
                title: "填写账号信息",
                text: `
                      <div>名字:
                        <input id="testtestname" value="${name}" type="text" name="name" style="display: flex"/>
                      </div>
                      <div>工号:
                        <div style="display:flex;align-items:center">
                          <span style="font-weight:bold">SH-</span>
                          <input id="testtestpassword" value="${pwd.substring(3)}" type="number" name="account" style="display: flex"/>
                        </div>
                      </div>
                    `,
                confirmButtonText: "保存",
                html: true
            },
                 function(isConfirm){
                let names = document.getElementById("testtestname").value
                let pwds = document.getElementById("testtestpassword").value
                GM_setValue('username', names);
                GM_setValue('password', "SH-" + pwds);
            });
        }, 1000)
        }
    query().then(res => {
        let { msg1,  msg2,  msg3,  msg4,  msg5, msg100 } = JSON.parse(res).result
        if(msg5?.length) {
            let { commit_additions, commit_deletions, commit_total } = msg5[0];
            swal({
                title: `日期：${startDate}至${endDate}`,
                text: `
                  <div>新增代码行数:
                    <strong style="color:green;font-size:20px">${commit_additions}</strong>
                  </div>
                  <div>删除代码行数:
                    <strong style="color:#3D96E2;font-size:25px">${commit_deletions}</strong>
                  </div>
                  <div>变更代码行数:
                    <strong style="color:red;font-size:30px">${commit_total}</strong>
                  </div>
                `,
                showCancelButton: true,
                html: true,
                cancelButtonText: "设置"
            }, function(flag){
                if(!flag) setInfo()
            })
        }else if(msg2){
            swal({
                title: "查询异常",
                text: msg2,
                showCancelButton: true,
                html: true,
                cancelButtonText: "设置"
            },function(flag){
                !flag && setInfo()
            })
        }else if(msg100){
            setInfo();
        }
    })
})();