// ==UserScript==
// @name         哪吒VPS橱窗后台脚本
// @namespace    http://bmqy.net/
// @version      1.0.2
// @description  配合哪吒面板自定义代码VPS橱窗打造的后台油猴脚本
// @author       bmqy
// @match        http://*/*
// @match        https://*/*
// @icon        https://avatars.githubusercontent.com/u/105093572?s=48&v=4
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/495551/%E5%93%AA%E5%90%92VPS%E6%A9%B1%E7%AA%97%E5%90%8E%E5%8F%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495551/%E5%93%AA%E5%90%92VPS%E6%A9%B1%E7%AA%97%E5%90%8E%E5%8F%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const storageKey = 'nzVpsChuChuangData';
    const extraDataKeyName = {
        shop:"商家名称",
        pid: '产品ID',
        price:"购买价格",
        cycle: "付款周期",
        start: "购买日期",
        expire: "过期时间",
        autoPay: '自动续费',
    }
    const cycleOptions = [
        '年付',
        '半年付',
        '季付',
        '月付',
        '年',
        '半',
        '季',
        '月',
        'Year',
        'Half',
        'Quarterly',
        'Month',
        'Y',
        'H',
        'Q',
        'M',
        'year',
        'half',
        'quarterly',
        'month',
    ];
    const autoPayOptions = [
        '否',
        '是'
    ];
    let timmer = null;
    let changer = false;
    const pathname = location.pathname;
    const $footer = document.querySelector('.footer');
    if(!$footer || $footer.innerText.indexOf('Powered by 哪吒监控')==-1) return false;
    let raw = GM_getValue(storageKey +'.raw', '');
    let extra = GM_getValue(storageKey +'.extra', null);
    if(pathname === '/setting'){
        const $settingForm = document.forms.settingForm;
        let settingData = new FormData($settingForm);
        settingData = new URLSearchParams(settingData).toString();
        GM_setValue(storageKey +'.raw', settingData);
        const CustomCode = document.querySelector('textarea[name=CustomCode]').value;
        let CustomCodeValue =CustomCode.match(/(?<=extraData = )[\s\S]+(?=\nconst cycleNames)/g);
        if(!CustomCodeValue){
            alert('请检查是否已经添加《哪吒面板VPS橱窗脚本》，脚本可去：https://www.bmqy.net/2665.html，获取');
            return false;
        }
        CustomCodeValue = CustomCodeValue ? CustomCodeValue[0] : '{}';
        CustomCodeValue = CustomCodeValue.replace(/([0-9a-zA-Z]+):/g, '"$1":').replace(/},\n}/g, '}\n}').replace(/'/g, '"');
        extra = JSON.parse(CustomCodeValue);
        GM_setValue(storageKey +'.extra', extra);
        if(extra == null){
            alert('数据获取成功，脚本可以正常使用了。')
        } else {
            console.log('已重新获取数据。');
        }
    } else {
        if(pathname !='/' && pathname !='/login' && extra == null){
            alert('请先进入【设置】页面获取脚本所需数据！！！');
            return false;
        }
        if(pathname === '/server'){
            const $table = document.querySelector('table.table');
            const $tableTr = $table.querySelectorAll('tbody tr');
            $tableTr.forEach(e=>{
                let $tds = e.querySelectorAll('td');
                let id = $tds[1].innerText;
                id = id.replace(/\(\d+\)/g, '');
                let $nameTd = $tds[2];
                let $extraDataBox = document.createElement('div');
                $extraDataBox.id = id;
                $extraDataBox.setAttribute('class', 'extra-box');
                $extraDataBox.setAttribute('style', 'margin-top:10px;');
                for(let key in extraDataKeyName){
                    let extraData = extra[id];
                    let $inputLabel = document.createElement('div');
                    $inputLabel.setAttribute('style', 'white-space: nowrap;padding-bottom:3px;');
                    let requiredTag = '';
                    if(['price', 'cycle', 'start'].indexOf(key) > -1){
                        requiredTag = '*';
                    }
                    $inputLabel.innerHTML = '<span style="display:inline-block;width:70px;">'+ requiredTag + extraDataKeyName[key] +'：</span>';
                    let $input = document.createElement('input');
                    if(['cycle', 'autoPay'].indexOf(key) > -1){
                        $input = document.createElement('select');
                        if(key === 'cycle'){
                            for(let key in cycleOptions){
                                $input.options.add(new Option(cycleOptions[key], cycleOptions[key]));
                            }
                        }
                        if(key === 'autoPay'){
                            for(let key in autoPayOptions){
                                $input.options.add(new Option(autoPayOptions[key], autoPayOptions[key]));
                            }
                        }
                    }
                    $input.name = key;
                    if(extraData){
                        $input.value = extraData[key] ? extraData[key] : '';
                    }
                    $input.addEventListener('change', ()=>{
                        changer = true;
                        if(timmer) return false;
                        console.log('1s 后提交');
                        timmer = setTimeout(function(){
                            updateExtraData();
                        }, 1500);
                    });
                    $input.addEventListener('focus', ()=>{
                        if(timmer){
                            console.log('终断提交');
                            clearTimeout(timmer);
                            timmer = null;
                        }
                    });
                    $input.addEventListener('blur', ()=>{
                        if(timmer) return false;
                        if(changer){
                            console.log('1s 后提交');
                            timmer = setTimeout(function(){
                                updateExtraData();
                            }, 1500);
                        }
                    });
                    $inputLabel.append($input);
                    $extraDataBox.append($inputLabel);
                }
                $nameTd.append($extraDataBox);
            })
        }
    }
    const updateExtraData = function(){
        let paramsRaw = new URLSearchParams(raw);
        let customCodeOld = paramsRaw.get('CustomCode');
        let $extraBox = document.querySelectorAll('table.table .extra-box');
        let extraNew = {};
        $extraBox.forEach(e=>{
            let shop = e.querySelector('input[name=shop]').value,
                pid = e.querySelector('input[name=pid]').value,
                price =e.querySelector('input[name=price]').value,
                cycle = e.querySelector('select[name=cycle]').value,
                start = e.querySelector('input[name=start]').value,
                expire = e.querySelector('input[name=expire]').value,
                autoPay = e.querySelector('select[name=autoPay]').value;
            if(price && cycle && start){
                extraNew[e.id] = {
                    shop:shop,
                    pid: pid,
                    price:price,
                    cycle: cycle,
                    start: start,
                    expire: expire,
                    autoPay: autoPay,
                }
            }
        });
        GM_setValue(storageKey +'.extra', extraNew);
        let customCodeNew = customCodeOld.replace(/(?<=extraData = )[\s\S]+(?=\nconst cycleNames)/g, JSON.stringify(extraNew));
        paramsRaw.set('CustomCode', customCodeNew)
        GM_xmlhttpRequest({
            method: 'POST',
            url: '/api/setting',
            headers: {
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
            },
            responseType: 'json',
            data: paramsRaw.toString(),
            onload: function(responses){
                let res = responses.response;
                if(res.code == 200){
                    alert('更新成功');
                } else {
                    alert(responses.responseText);
                }
                clearTimeout(timmer);
                timmer = null;
                changer = false;
            }
        })
    }
})();
