// ==UserScript==
// @name         zentao
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修改禅道input超出当前日期无法修改的问题，快速完成任务
// @author       lanning
// @match        zentao.tangees.com/*
// @match        zentao.tgsu.cn/*
// @match        zentao.tungee-internal.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tangees.com
// @downloadURL https://update.greasyfork.org/scripts/471751/zentao.user.js
// @updateURL https://update.greasyfork.org/scripts/471751/zentao.meta.js
// ==/UserScript==

(function () {
    // 获取当前日期
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const formattedDate = year + '-' + month + '-' + day;
    const btn = document.createElement('button');
    btn.innerHTML = '启用input';
    btn.style.width = '100px';
    btn.style.height = '40px';
    btn.style.position = 'fixed';
    btn.style.bottom = '60px';
    btn.style.right = '20px';
    btn.style.zIndex = '999999';
    document.body.appendChild(btn);

    window.onload = () => {
        console.log('onload');
        document.getElementById('finishedDate')?.removeAttribute('disabled');
    };

    btn.onclick = () => {
        document.getElementById('finishedDate')?.removeAttribute('disabled');
    };
    // Your code here...
   $('.c-actions').each(function (item) {
        const  submitBtn = $('<button style="margin-left:8px">完成</button>');
        const taskID= parseInt($(this).parent().children('.c-id').html())
        const hour = parseInt($(this).parent().children('.c-hours').first().html())
        submitBtn.on('click', function () {

            const formData = new FormData();

            // 添加需要发送的数据
            formData.append('currentConsumed', hour);
            formData.append('consumed', hour);
            formData.append('assignedTo', 'yanglin');
            formData.append('finishedDate', formattedDate);
            formData.append('status', 'done');

            fetch(
                `${location.origin + location.pathname}?m=task&f=finish&taskID=${taskID}&onlybody=yes`,
                {
                    method: 'POST',
                    body: formData,
                },
            ).finally(() => {
                location.reload()
            });
        });
        $(this).prepend(submitBtn)
    })
}());
