// ==UserScript==
// @name         sbi
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  这个是公司内容方便员工使用的一个脚本，不涉及任何其他人信息，只是一个方便自己公司同事操作的一个脚本，自动化点击操作
// @author       czt
// @match        https://corp.onlinesbi.sbi/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/477405/sbi.user.js
// @updateURL https://update.greasyfork.org/scripts/477405/sbi.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 创建容器
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "20px";
    container.style.zIndex = 1000;
    container.style.padding = "10px";
    container.style.backgroundColor = "#f1f1f1";
    container.style.border = "1px solid #ccc";
    // 创建输入框
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "请输入 ID";
    input.style.display = "block";
    input.style.marginBottom = "10px";
    // 创建开始按钮
    const startButton = document.createElement("button");
    startButton.innerText = "开始";
    startButton.style.marginRight = "5px";
    // 创建关闭按钮
    const stopButton = document.createElement("button");
    stopButton.innerText = "关闭";
    stopButton.disabled = true;
    // 将输入框和按钮添加到容器和页面
    container.appendChild(input);
    container.appendChild(startButton);
    container.appendChild(stopButton);
    document.body.appendChild(container);
    let timeoutId;

  //获取银行卡号
    function getYhNum(){
        // 获取包含 span 元素的父容器元素
        var wrapper = document.querySelector('.col-sm-6.col-xs-12.no-padding');

        // 获取 span 元素
        var spanElement = wrapper.querySelector('span');

        // 获取 span 元素的文本内容
        var value = spanElement.textContent;

        console.log(value);
        return value;
    }
 // 点击去10行数据的页面按钮
  function clickTargetLink() {
    const targetLink = document.querySelector('#dr1 a');
    if (targetLink) {
      targetLink.click();
    }
  }

    //获取页面的数据
   async function extractTableData(account_num,id,num) {
        const table = document.querySelector(".content_table");
        const rows = table.querySelectorAll("tbody tr");
        const result = [];
        rows.forEach((row) => {
            const descriptionCell = row.querySelector("td:nth-child(2)");
            const creditCell = row.querySelector("td:nth-child("+num+")");
            // 如果第6列中没有值，跳过这个行
            if (!creditCell.textContent.trim()) {
                return;
            }
            // 从第2列中的值中找到UPI开始的位置
            const upiStartIndex = descriptionCell.textContent.indexOf("UPI");
            // 如果没有找到UPI数据，跳过这个行
            if (upiStartIndex === -1) {
                return;
            }
            // 提取从UPI开始的值
            const upiDataAll = descriptionCell.textContent.slice(upiStartIndex);
            const upiData = upiDataAll.split("\n")[0].trim();
            // 将第2列（提取的UPI数据）和第6列的数据添加到数组中
            result.push([upiData.trim(), creditCell.textContent.trim()]);
        });
        const response = await uploadData(result,account_num,id);
        return response;
    }
    //跳转到选择125页面
    function goto125(){
    // 调用 onclick 函数来触发点击事件
        callURL('/corpuser/accountstatementnew.htm');
    }
    //跳转到选择银行卡页面
    function goteYhk(){
        callURL('/corpuser/accountsummary.htm');
    }
    function dateInfo(){
        var date = new Date();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        // 将日期、月份和年份格式化为两位数（如果小于 10，则在前面添加 0）
        day = ("0" + day).slice(-2);
        month = ("0" + month).slice(-2);

        var formattedDate = day + "/" + month + "/" + year;

        console.log(formattedDate);
        return formattedDate
    }
    //设置125叶页面信息
   async function setinfo125(){
        let a = document.getElementById('fromDate')
        console.log(a)
        a.value = dateInfo()
        await sleep(2000)
        let b = document.getElementById('toDate')
        console.log(b)
        b.value = dateInfo()
        await sleep(2000)
        let c = document.getElementById('numberofrows')
        console.log(c)
        c.value = '125'
        await sleep(2000)
        var d = document.querySelector('label.radio-inline input');
        d.onclick();
        await sleep(2000)
        var button = document.querySelector('input[name="Submit3"]');
        button.onclick();
    }
  // 将数据发送到 API
  function uploadData(data,account_num,id) {
      return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('data', JSON.stringify(data));
          formData.append("token", "87386dcb444esacee7378a6eaa51133f");
          formData.append("payin_channel_id", id);
          formData.append("account", account_num);
          // 发送 POST 请求到 API
          GM_xmlhttpRequest({
              method: 'POST',
              url: 'https://aipaytm.in/device/uploadBySbiData',
              data: formData,
              onload: function (response) {
                  if (response.status === 200) {
                      const responseData = JSON.parse(response.responseText);
                      resolve(responseData);
                  } else {
                      console.error('Data upload failed');
                      reject(new Error('Data upload failed'));
                  }
              },
              onerror: function (error) {
                  console.error('Request failed:', error);
                  reject(error);
              },
          });
      });
  }
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // 主函数
    async function main(id) {

        const dr1 = document.querySelector('#dr1 a'); //是否在Account Summary页面
        const info_10 = document.querySelector('#Submit'); //是否在获取10条信息页面
        const fromDate = document.querySelector('[name="Submit22"]'); //是否在125设置页面
        const table = document.querySelector('[name="Submit3"]');//是否在125信息页面
        var targetText = "There is no financial transaction available for online display for the selected date range.";
        // 获取页面内容
        var pageContent = document.documentElement.innerHTML;
        // 使用 includes() 方法检测页面内容中是否包含目标文本
        if (pageContent.includes(targetText)) {
            console.log("页面中存在目标文本");
             localStorage.setItem("done",1);
             goteYhk()
        } else {
            console.log("页面中不存在目标文本");
        }
        if(dr1){
            await sleep(2000)
            clickTargetLink()
        }
        if(info_10){
            let account_num = await getYhNum()
            if(account_num){
                 let res = await extractTableData(account_num,id,4)
                 console.log(res)
                 console.log(res.code)
                 console.log(res.code==0)
                if(res.code==0){
                    let done =  Number(localStorage.getItem("done"));
                    if(done>=10){
                        //跳转到125页面
                        await sleep(5000)
                        goto125()
                    }else{
                        // 跳转到银行卡页面
                        await sleep(5000)
                        done = Number(done)+1
                        localStorage.setItem("done",done);
                        goteYhk()
                    }
                }
            }

        }
        if(fromDate){
            setinfo125()
        }
        if(table){
            let account_num = await getYhNum()
            if(account_num){
                let res = await extractTableData(account_num,id,6)
                console.log(res)
                if(res.code==0){
                    await sleep(5000)
                    localStorage.setItem("done",1);
                    goteYhk()
                }
            }
        }
         await sleep(10000)
         if (!stopButton.disabled) {
            timeoutId = setTimeout(() => main(id), 5000);
        }
    }
  // 开始按钮的事件处理函数
    function start() {
        const id = input.value;
        if (!id) {
            alert("请输入 ID");
            return;
        }
        // 禁用输入框和开始按钮，启用停止按钮
        input.disabled = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        localStorage.setItem("running", "true");
        localStorage.setItem("id", id);
        let done = localStorage.getItem("done");
        if(!done){
            localStorage.setItem("done", 1);
        }
        main(id);
    }
    // 停止按钮的事件处理函数
    function stop() {
        // 打印取消
        console.log("Cancelled");
        // 启用输入框和开始按钮，禁用停止按钮
        input.disabled = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        localStorage.setItem("running", "false");
        localStorage.removeItem("done");
       clearTimeout(timeoutId); // 清除计时器
    }
    // 为开始和停止按钮添加 click 事件监听器
    startButton.addEventListener("click", start);
    stopButton.addEventListener("click", stop);
    function checkStatus() {
        const running = localStorage.getItem("running");
        const id = localStorage.getItem("id");
        input.value = id;
        if (running === "true") {
            startButton.click();
        }
    }
    // 检查本地存储的状态并根据状态创建用户界面
    checkStatus();
})();
