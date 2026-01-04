// ==UserScript==
// @name         Help Tools
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  try to take over the world!
// @author       Alex
// @include      *.sroffice.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30323/Help%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/30323/Help%20Tools.meta.js
// ==/UserScript==

//搜名字
(function() {
    setInterval(() => {
        const titlea = document.querySelector('#excel_menu_left');
        if(titlea.innerText.indexOf("转账汇款补单") >= 0 ){
            var input = document.createElement('input');
            input.style.width = '100px';
            input.className = "searchName";
            input.value = "搜名字。";
            input.setAttribute('onblur', 'if (value ==""){value="搜名字。"}');
            input.setAttribute('onfocus', 'if (value =="搜名字。"){value =""}');
            /* 输入框容器 */
            const container = document.querySelector('#cardNo');
            const pd = document.querySelector('.searchName');
            if (!pd) {
                container.parentElement.append(input);
            }

            input.addEventListener('keyup', (e) => {
                const { value } = e.target;
                /* 下拉框类 */
                const cards = document.querySelector('#cardNo');
                const bankList = Array.from(cards.querySelectorAll('option')).map((o) => {
                    return {value: o.value, text: o.innerText};
                });
                const card = bankList.find(y => y.text.includes(value));
                if (card === null) {
                    return;
                }
                cards.value = card.value;
            });
        }
    }, 1000);
})();

//搜卡号
(function() {
    setInterval(() => {
        const titlea = document.querySelector('#excel_menu_left');
        if(titlea.innerText.indexOf("转账汇款补单") >= 0 ){
            const cardNo = document.querySelector('#cardNo');
            const cardNoList = Array.from(cardNo.querySelectorAll('option')).map(o => o.value);
            const input = document.createElement('input');
            input.className = "searchCard";
            input.style.width = '100px';
            input.value = "搜卡号。";
            input.setAttribute('onblur', 'if (value ==""){value="搜卡号。"}');
            input.setAttribute('onfocus', 'if (value =="搜卡号。"){value =""}');

            const pd = document.querySelector('.searchCard');
            if (!pd) {
                cardNo.parentElement.append(input);
            }

            input.addEventListener('keyup', (e) => {
                const term = e.target.value;
                console.log(term);
                // find by term
                const find = cardNoList.find(cn => {
                    return cn.endsWith(term);
                });
                if (find) {
                    cardNo.value = find;
                }
            });
        }
    }, 1000);
})();

//删除时间和空格
(function() {
    setInterval(() => {
        const titlea = document.querySelector('#excel_menu_left');
        if(titlea.innerText.indexOf("会员列表") >= 0 ){
            const checkTime = document.querySelector('.searchTime');
            const sTime = document.querySelector('#mainform_start');
            const sMail = document.querySelector('#mainform_email');
            const sName = document.querySelector('#mainform_accountName');
            const sPhone = document.querySelector('#mainform_phone');
            const check = document.querySelector('#mainform_loginname');
            if (sTime.value!=='2009-01-01 00:00:00' && check.value=='' && !checkTime) {
                const span = document.createElement('span');
                span.className = "searchTime";
                check.append(span);
                sTime.value = '2009-01-01 00:00:00';
            }

            if (check.value.indexOf(" ") >=0) {
                check.value =check.value.replace(/\s+/g, "");
            }

            if (sName.value.indexOf(" ") >=0) {
                sName.value =sName.value.replace(/\s+/g, "");
            }

            if (sMail.value.indexOf(" ") >=0) {
                sMail.value =sMail.value.replace(/\s+/g, "");
            }

            if (sPhone.value.indexOf(" ") >=0) {
                sPhone.value =sPhone.value.replace(/\s+/g, "");
            }
        }
    }, 200);
})();

//查询结果个数
(function() {
    setInterval(() => {
        const button = document.querySelector('#excel_menu_left');
        const input = document.createElement('input');
        input.style.width = '50px';
        input.value = "50";
        input.className = "searchSize";
        input.setAttribute('name', 'size');
        const pd = document.querySelector('.searchSize');
        const check = document.querySelector('select[name="size"]');
        const submit = document.querySelector('input[value="查询"]');
        if (!pd && !check && submit) {
            button.append("　　　　　查询结果个数：");
            button.append(input);
        }else if (!pd && check.value == 20 && submit) {
            const span = document.createElement('span');
            span.className = "searchSize";
            button.append(span);
            check.value = "50";
        }
    }, 200);
})();
