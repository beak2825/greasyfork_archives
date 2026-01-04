// ==UserScript==
// @name         一键备注
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  快捷备注!
// @author       大魔王
// @match        http*://www.deskpro.cn/*
// @downloadURL https://update.greasyfork.org/scripts/482806/%E4%B8%80%E9%94%AE%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482806/%E4%B8%80%E9%94%AE%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let remarkStr;
    remarkStr = encodeURIComponent("惠企宣传");
    myMain();

    function myMain() {

        //默认惠企宣传
        addBtn();

    }

    function getUnmarkedList() {
        let arr = document.querySelectorAll('tr.ivu-table-row');
        //通话列表 
        let array = [];
        let j = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].childElementCount >= 27) {
                array[j++] = arr[i];
            }
        }
        if (arr.length == 0) {
            console.log('未查询到通话记录');
            alert('未查询到通话记录');
            return null;
        }
        //console.log(array[18].querySelector('.ivu-tooltip-rel'));//
        //console.log(array[0].querySelector('.ivu-tooltip-rel').textContent==='--');//接触ID
        arr = [];
        j = 0;
        let eq;
        for (let i = 0; i < array.length; i++) {
            eq = array[i].querySelector('.ivu-tooltip-rel').textContent;
            if (eq === '--' || eq === 'undefined') {
                //备注未填写
                console.log('备注未填写 or 未定义', array[i].querySelector('.theme-font-primary-color').textContent);
                arr[j++] = array[i].querySelector('.theme-font-primary-color');
            }
        }
        if (arr.length == 0) {
            console.log('未查询到需修改的备注');
            alert('未查询到需修改的备注');
            return null;
        }
        //console.log(arr);
        //去除重复
        array = [];
        j = 0;
        let a = 0;
        for (let i = 0; i < arr.length; i++) {
            //console.log(`当前值：${arr[i].textContent}，对比值：${a}`);
            // if (arr[i].textContent != a) {
            //     array[j++] = arr[i];
            // }
            //a = arr[i].textContent;
            array = arr.filter((obj, index) => {
                return arr.findIndex(otherObj => otherObj.textContent === obj.textContent) === index;
            }
            );

        }
        arr = [];
        console.log('查重结束', array);
        //至此，未填写备注的都筛选出来array
        return array;
    }
    function deleteFirstAndRecurse(arr, remarkStr) {
        if (arr.length == 0) {
            console.log('修改结束,重置界面');
            let btnArr = document.querySelectorAll('.ivu-btn.ivu-btn-primary.ivu-btn-ghost');
            for (let i = 0; i < btnArr.length; i++) {
                if (btnArr[i].textContent == '  重置\n            ') {

                    btnArr[i].click();
                    break;
                }
            }
            setTimeout(function () {
                alert('修改结束');
            }, 1000);

            return;
        }
        //arr[0].click();
        mypost(remarkStr, arr[0].textContent);
        // 删除数组的第一个元素  
        arr.shift();
        console.log(arr);
        // 延迟1秒  
        setTimeout(() => {
            // 再次调用自身，传入删除数据后的数组  
            deleteFirstAndRecurse(arr, remarkStr);
        }
            , 1000);
    }
    function mypost(str, contactId) {
        if (str == undefined || str == 'undefined') {
            console.log(`error:${str}`);
            return;
        }
        console.log(`修改 ${contactId}备注为 ${str}`);
        fetch(`https://www.deskpro.cn/sccc/labelName/editRemark?remark=${str}&contactId=${contactId}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://www.deskpro.cn/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
    }

    function addBtn() {
        // 创建按钮
        if (document.querySelector('#popup-button')) {
            console.log('一键备注重新注册');
            document.querySelector('#popup-button').remove();
        }
        let button = document.createElement("input");
        button.id = 'popup-button';
        button.type = "button";
        button.value = "一键备注";
        button.title = '右键设置备注内容，左键运行。只会对未备注或备注undefined的进行修改';
        button.addEventListener('click', function () {
            let array = getUnmarkedList();
            if (array) {
                deleteFirstAndRecurse(array, remarkStr);
            }
        });
        button.addEventListener('contextmenu', function (event) {
            console.log('右键');
            event.preventDefault();
            let userInput = prompt("请输入备注内容：", decodeURIComponent(remarkStr));
            if (userInput) {
                userInput = userInput.trim();
            }
            let judgeFn = new RegExp(/\s+/g);
            if (judgeFn.test(userInput)) {
                alert("内容包含有空格!");
                return;
            }
            if (userInput == '') {
                alert('内容为空!');
                return;
            }
            if (userInput == null) return;
            remarkStr = encodeURIComponent(userInput);
            alert("备注内容为:【" + decodeURIComponent(remarkStr) + "】");
            //alert("备注内容为【",userInput,"】");
        });

        document.body.appendChild(button);
        let css = `
  #popup-button {
    background-color: #4CAF50; /* 绿色背景 */
    border: none; /* 无边框 */
    color: white; /* 白色文本 */
    padding: 15px 32px; /* 内边距 */
    text-align: center; /* 文本居中 */
    text-decoration: none; /* 无下划线 */
    display: inline-block; /* 内容块级元素 */
    font-size: 16px; /* 字体大小 */
    transition-duration: 0.4s; /* 过渡效果时长 */
    cursor: pointer; /* 鼠标指针变为手形 */
    top: 50%;
    left: 91%;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
    //border-radius: 25px;
    position: fixed;//
    z-index: 1000; //确保置于顶层
    
  }

  /* 按钮鼠标悬停时的样式 */
  #popup-button:hover {
    border-radius: 10px;
    background-color: #45a049; /* 悬停时变为深绿色 */
  }

  /* 按钮点击时的样式 */
  #popup-button:active {
    background-color: #45a049; /* 点击时变为更深的绿色 */
    transform: translateY(4px); /* 点击时向下移动4像素 */
    border-radius: 25px;
    transition-duration: 0.1s; /* 过渡效果时长 */
  }`
        // 将CSS样式添加到页面头部
        let style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    }

})();