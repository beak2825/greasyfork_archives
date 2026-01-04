// ==UserScript==
// @name         PT魔力自动兑换(适用于NexusPHP)
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  可对NexusPHP架构PT站实现自动点击多次兑换，支持设置点击间隔
// @author       red2us
// @match        https://pt.btschool.club/mybonus.php*
// @match        https://raingfh.top/mybonus.php*
// @match        https://www.pttime.org/mybonus.php*
// @match        https://ptvicomo.net/mybonus.php*
// @match        https://hdtime.org/mybonus.php*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544264/PT%E9%AD%94%E5%8A%9B%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%28%E9%80%82%E7%94%A8%E4%BA%8ENexusPHP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544264/PT%E9%AD%94%E5%8A%9B%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2%28%E9%80%82%E7%94%A8%E4%BA%8ENexusPHP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const executeDuration = localStorage.getItem('duration');
     if(executeDuration) {
         setTimeout(function() {
             console.log(executeDuration + "秒后执行代码");
             loadScript();
         }, executeDuration * 1000);
     }else {
         loadScript();
     }

    function clearCache() {
        localStorage.removeItem('executeCount');
        localStorage.removeItem('actionUrl');
        localStorage.removeItem('formData');
        localStorage.removeItem('duration');
    }

    function loadScript() {
     const executeCount = localStorage.getItem('executeCount');
     if (executeCount && executeCount!= 'NaN') {
         if(executeCount == 0){
             clearCache();
             alert('兑换已执行完成')
         }else {
             console.log(`This page submit remain ${executeCount} times.`);
             // 执行自动兑换
             const actionUrl = localStorage.getItem('actionUrl');
             const formDataStr = localStorage.getItem('formData');
             const formDataObj = JSON.parse(formDataStr);
             const restoredFormData = new FormData();
             for (const key in formDataObj) {
                 if (formDataObj.hasOwnProperty(key)) {
                     restoredFormData.append(key, formDataObj[key]);
                 }
             }
            localStorage.setItem('executeCount', executeCount - 1);
             autoSubmitForm(actionUrl, restoredFormData);
             return;
         }
     }
    // Select all form submit inputs
    var submitInputs = document.querySelectorAll('input[type="submit"]');
    // Iterate over each submit input
    submitInputs.forEach(function(submitInput) {
        // Add a click event listener to each input
        submitInput.addEventListener('click', function(event) {
            // Prevent the default form submission
            event.preventDefault();
              var trElement = submitInput.closest('tr');
            // 从 <tr> 中查找 <form>
                var form = trElement.querySelector('form');
                console.log('find form:' + form)
                if (form) {
                    // Get the form's action URL
                    var actionUrl = form.action || window.location.href; // Default to current URL if action is not set

                    // Create a URLSearchParams object to collect form data
                    var formData = new URLSearchParams(new FormData(form));

                    // Log the action URL and parameters
                    console.log('Form action URL:', actionUrl);
                    console.log('Form parameters:', formData.toString());
                    localStorage.setItem('actionUrl', actionUrl);
                    const formDataObj = {};
                    formData.forEach((value, key) => {
                        formDataObj[key] = value;
                    });
                    localStorage.setItem('formData',JSON.stringify(formDataObj));
                }
            // Execute your logic here

            var times = prompt("请输入要执行的次数：");
            if(times == null){
                return;
            }
            // 将用户输入转换为整数
            times = parseInt(times, 10);
            localStorage.setItem('executeCount', times - 1);
            if(times > 1){
                var duration = prompt("请输入要执行间隔(秒)：");
                if(duration == null){
                    duration = 10
                }
                duration = parseInt(duration, 10);
                localStorage.setItem('duration', duration);
            }

            autoSubmitForm(actionUrl, formData);

        });
    });
    }

    function autoSubmitForm(actionUrl, formData){
         // 提交表单
            const addForm = document.createElement('form');
            addForm.method = 'POST';
            addForm.action = actionUrl;
            // 将表单数据作为隐藏输入元素添加到表单中
            for (const [key, value] of formData.entries()) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                addForm.appendChild(input);
            }
            document.body.appendChild(addForm);
            addForm.submit();
            console.log('执行提交')
    }
})();