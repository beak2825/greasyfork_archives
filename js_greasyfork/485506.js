// ==UserScript==
// @name         IP自动查询-批量查询IP-无人值守-站长工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automate actions on ip.tool.chinaz.com/ipbatch
// @author       simon
// @match        https://ip.tool.chinaz.com/ipbatch
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/485506/IP%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2-%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2IP-%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88-%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/485506/IP%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2-%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2IP-%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88-%E7%AB%99%E9%95%BF%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your IP list stored in an array
    let ipList = GM_getValue("ipList");
    let ipIndex = GM_getValue("ipIndex");
    let autoCmd = GM_getValue("autoCmd");
    let tableIp =  GM_getValue("tableIp");
    let onceNum = 100; //单次查询多少个IP
    if(tableIp == undefined){
        tableIp="";
    }
    debugger
    // Function to set IP addresses in the textarea
    function setIPAddresses() {
        const textarea = document.getElementById('address');
        let ipArray = ipList.split('\n');
        var lastIndex = parseInt(ipIndex) +onceNum;
        if(ipArray){
            var currIP=[];
            debugger
            for(var i = parseInt(ipIndex);i<ipArray.length&&i<lastIndex;i++){
                currIP.push(ipArray[i]);
            }
            if(currIP.length>0){
                textarea.value = currIP.join('\n');
                GM_setValue('ipIndex', lastIndex);
                return true;
            }
        }else{
            console.log("没有找到IP列表："+ipList);
        }
            return false;

    }

    // Function to copy table content to clipboard
    function copyTableToClipboard() {
        debugger
        const ipListTable = document.getElementById('ipList');
        if (ipListTable) {
            tableIp+="\n" + ipListTable.innerText;
            GM_setValue("tableIp",tableIp);
        } else {
            console.log('Table not found.');
        }
    }

    function search(){

        // Clear textarea
        const textarea = document.getElementById('address');
        textarea.value = '';

        // Set IP addresses in the textarea
        if(setIPAddresses() == false){
            return;
        }

        // Click the 'submore' button
        const submoreButton = document.getElementById('submore');
        if (submoreButton) {
            submoreButton.click();
        }
    }

    // Wait for the page to load
    window.addEventListener('load', function() {
        copyTableToClipboard();
        if(autoCmd){
            setTimeout(function() {
                search();
              }, 1000);
        }
    });



     // 注册菜单
     GM_registerMenuCommand('#️⃣ 设置任务', function() {
        // 创建 Bootstrap 模态框元素
        const modalHtml = `
            <div class="modal" id="myModal" tabindex="-1" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">设置任务</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                   <div class="form-group">
                      <label for="input2">IP列表（一行一个）</label>
                      <textarea id="iplist" placeholder="IP列表（一行一个）" cols="50">${ipList}</textarea>
                    </div>
                   <div class="form-group">
                      <label for="input2">当前行号</label>
                      <input type="text" id="ipindex" value="${ipIndex}" class="form-control" placeholder="请输入序号">
                    </div>
                    <div class="form-group">
                       <label for="input2">自动执行(刷新页面后自动执行)</label>
                       <input type="checkbox" id="autocmd" name="checkbox" ${autoCmd?"checked":""}>
                     </div>
                    <div class="form-group">
                       <label for="input2">执行一次</label>
                        <button id="btnSearch" class="btn btn-success">执行</button>
                     </div>
                     <div class="form-group">
                      <label for="input2">结果列表</label>
                      <textarea id="resultlist" placeholder="IP结果列表，可以直接复制到Excel" cols="50">${tableIp}</textarea>
                      <button id="btnClearResult" class="btn btn-success" >清空</button>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="saveInfo">保存</button>
                  </div>
                </div>
              </div>
            </div>`;

        // 获取模态框和输入框元素
        let modal = document.getElementById('myModal');
        if(modal==null){
            // 将模态框添加到页面
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            //重新获取模态框
            modal = document.getElementById('myModal');

            const iplist = document.getElementById('iplist');
            const ipindex = document.getElementById('ipindex');
            const autocmd = document.getElementById('autocmd');

            $("#btnSearch").click(function(){
                search();
            });

            $("#btnClearResult").click(function(){
                    tableIp = "";
                    GM_setValue('tableIp', tableIp);
                    $("#resultlist").val(tableIp);
            });

            // 监听保存按钮的点击事件
            document.getElementById('saveInfo').addEventListener('click', function() {
                const iplistValue = iplist.value;
                const ipindexValue = ipindex.value;
                const autocmdValue = autocmd.checked;
                debugger
                // 如果用户点击了保存按钮，且输入不为空，就保存序号
                if (iplistValue !== '') {
                    GM_setValue('ipList', iplistValue);
                    ipList = iplistValue;
                }
                if (ipindexValue !== '') {
                    GM_setValue('ipIndex', ipindexValue);
                    ipIndex=ipindexValue;
                }
                if (autocmdValue !== '') {
                    GM_setValue('autoCmd', autocmdValue);
                    autoCmd=autocmdValue;
                }
                console.log('设置成功');
                // 隐藏模态框
                $(modal).modal('hide');
            });
        }
        // 打开模态框
        $(modal).modal('show');
    });
    // 动态添加 Bootstrap CSS 样式文件
    const bootstrapCss = document.createElement('link');
    bootstrapCss.rel = 'stylesheet';
    // bootstrapCss.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';  // 根据实际路径进行修改
    bootstrapCss.href = 'https://cdn.staticfile.org/bootstrap/5.3.1/css/bootstrap.min.css';  // 根据实际路径进行修改

    document.head.appendChild(bootstrapCss);

    // 动态添加 jQuery 和 Bootstrap JavaScript 文件
    const jQueryScript = document.createElement('script');
    // jQueryScript.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
    jQueryScript.src = 'https://cdn.staticfile.org/jquery/3.7.0/jquery.min.js';

    jQueryScript.onload = function() {
        const bootstrapJs = document.createElement('script');
        // bootstrapJs.src = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js';
        bootstrapJs.src = 'https://cdn.staticfile.org/bootstrap/5.3.1/js/bootstrap.min.js';
        document.head.appendChild(bootstrapJs);
    };
    document.head.appendChild(jQueryScript);

})();
