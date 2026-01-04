// ==UserScript==
// @name         德米萨扩展脚本
// @namespace    http://tampermonkey.net/
// @version      2025103001
// @description  Grace的魔法键!
// @author       承尘
// @match        https://app.dimix.com.cn:66/hainingkeyouli/dimix/welcome/main.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504232/%E5%BE%B7%E7%B1%B3%E8%90%A8%E6%89%A9%E5%B1%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/504232/%E5%BE%B7%E7%B1%B3%E8%90%A8%E6%89%A9%E5%B1%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var modify_create_date
    function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2){
            month = '0' + month;
        }
        if (day.length < 2){
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    function changeFormat() {
        var inputDate = document.getElementById('date_modify_input').value;
        var formattedDate = formatDate(inputDate);
        document.getElementById('date_modify_input').textContent = formattedDate;
        modify_create_date = formattedDate
    }

    function dataLiaohaoInputKeydown(date_modify_input) {
        var input_date_liaohao = document.getElementById('data_liaohao_input').value;
        var input_date_liaohaos = input_date_liaohao.split("\t")
        if (input_date_liaohaos.length == 2){
            var date_str = input_date_liaohaos[0]
            if(date_str.includes(".")){
               date_str = date_str.split(".").join("-")
            }
            date_modify_input.value = date_str

            let mainTable = document.getElementsByClassName('mainTable')[0]
            let topframe = mainTable.querySelector('iframe#topframe')
            let desktopframe = mainTable.querySelector('iframe#desktopframe')
            let frameSrc = desktopframe.contentWindow.location.href
            if(frameSrc.includes('https://app.dimix.com.cn:66/hainingkeyouli/dimix/jxc/xsgl/xsdd.jsp')){
                let iframeXsgl = desktopframe.contentDocument || desktopframe.contentWindow.document;
                let queryInput_CPBM = iframeXsgl.querySelector('#moreQueryConditions input[name="CPBM"]')
                if(queryInput_CPBM) queryInput_CPBM.value = input_date_liaohaos[1]
                let queryButton = iframeXsgl.querySelector('input[value="查 询"]')
                queryButton.click()
            }
            if(frameSrc.includes("https://app.dimix.com.cn:66/hainingkeyouli/dimix/jxc/xsgl/bbzx/xsdd_wfmxb.jsp")){
                let iframeXsgl = desktopframe.contentDocument || desktopframe.contentWindow.document;
                let queryInput_CPBM = iframeXsgl.querySelector('#moreQueryConditions input[name="CPBM"]')
                if(queryInput_CPBM) queryInput_CPBM.value = input_date_liaohaos[1]
                let queryButton = iframeXsgl.querySelector('input[value="查 询"]')
                queryButton.click()
            }
            changeFormat()
            document.getElementById('data_liaohao_input').value = ""
        }
    }

    var liaohaoDanjiaMap = new Map()
    function dataLiaohaoDanjiaChange(){
        var input_liaohao_danjia = document.getElementById('data_lioahao_danjia_jichushuju').value;
        if(!input_liaohao_danjia){liaohaoDanjiaMap.clear()}
        var input_liaohao_danjias = input_liaohao_danjia.split(/ +/)
        for(let i=0;i<input_liaohao_danjias.length;i++){
            let input_liaohao_values_i = input_liaohao_danjias[i].split(/\t/)
             if(input_liaohao_values_i.length > 1){
                 liaohaoDanjiaMap.set(input_liaohao_values_i[0].trim(),input_liaohao_values_i[1])
             }

        }
        console.log(liaohaoDanjiaMap)
    }

    // Your code here...
    window.onload = function(){
        let mainTable = document.getElementsByClassName('mainTable')[0]
        let topframe = mainTable.querySelector('iframe#topframe')
        let date_modify_input = document.createElement('input');
        date_modify_input.id = 'date_modify_input'
        date_modify_input.name = 'modify_create_date'
        date_modify_input.addEventListener('change', function() {
            changeFormat()
        });
        date_modify_input.type = 'date'
        topframe.parentNode.insertBefore(date_modify_input,topframe)

        let data_liaohao_input = document.createElement('input');
        data_liaohao_input.id = "data_liaohao_input"
        data_liaohao_input.name = "data_liaohao_input"
        data_liaohao_input.setAttribute("placeholder","请输入日期+料号")
        data_liaohao_input.addEventListener('keydown', function() {
            dataLiaohaoInputKeydown(date_modify_input)
        });
        topframe.parentNode.insertBefore(data_liaohao_input,topframe)

        let data_lioahao_danjia_jichushuju = document.createElement('input');
        data_lioahao_danjia_jichushuju.id = "data_lioahao_danjia_jichushuju"
        data_lioahao_danjia_jichushuju.name = "data_lioahao_danjia_jichushuju"
        data_lioahao_danjia_jichushuju.setAttribute("placeholder","请输入料号+单价")
        data_lioahao_danjia_jichushuju.addEventListener('change', function() {
            dataLiaohaoDanjiaChange()
        });
        topframe.parentNode.insertBefore(data_lioahao_danjia_jichushuju,topframe)

        let desktopframe = mainTable.querySelector('iframe#desktopframe')
        var CPBM_value
        var CPXH_value
        var KHMC_value

        desktopframe.onload = function(){
            let frameSrc = desktopframe.contentWindow.location.href
            if(frameSrc.includes('https://app.dimix.com.cn:66/hainingkeyouli/dimix/jxc/xsgl/xsdd.jsp')){
                var iframeXsgl = desktopframe.contentDocument || desktopframe.contentWindow.document;
                let queryInput_CPBM = iframeXsgl.querySelector('#moreQueryConditions input[name="CPBM"]')
                let queryInput_CPXH = iframeXsgl.querySelector('#moreQueryConditions input[name="CPXH"]')
                let queryInput_KHMC = iframeXsgl.querySelector('input[name="KHMC"]')
                if(queryInput_CPBM) CPBM_value = queryInput_CPBM.value
                if(queryInput_CPXH) CPXH_value = queryInput_CPXH.value
                if(queryInput_KHMC) KHMC_value = queryInput_KHMC.value

                let queryButton = iframeXsgl.querySelector('input[value="查 询"]')
                let matchButton = iframeXsgl.createElement('input');
                matchButton.type = 'button'
                matchButton.classList.add('inputButton')
                matchButton.value = "匹配未发订单";
                matchButton.id = "matchButton";
                queryButton.parentNode.insertBefore(matchButton,queryButton)
                matchButton.onclick= function() {
                    let url = "https://app.dimix.com.cn:66/hainingkeyouli/dimix/jxc/xsgl/bbzx/xsdd_wfmxb.jsp?XSDDLX=10&CJRQ_S=&CJRQ_E=&rowsPerPage=500"
                    if(CPBM_value) url = url + "&CPBM=" + encodeURIComponent(CPBM_value)
                    if(CPXH_value) url = url + "&CPXH=" + encodeURIComponent(CPXH_value)
                    console.log(url)
                    GM_xmlhttpRequest({
                        method: "GET",
                        url:url,
                        headers: {
                            'Cookie':document.cookie,
                            'Accept': 'application/json, text/plain, */*',
                            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                        },
                        onload: function(response) {
                            console.log("请求成功")
                            console.log(response.responseText)
                            let regex = /\d{8}-\d{4}/g
                            let orderNos = [...response.responseText.matchAll(regex)];
                            if(orderNos){
                                console.log([...orderNos])
                                orderNos.forEach(orderNo => {
                                    var pageTableView = iframeXsgl.querySelector('#pageTableView')
                                    var tr_list = pageTableView.querySelectorAll('tr');
                                    if(tr_list){
                                        for(var i=0;i<tr_list.length;i++){
                                            var tr = tr_list[i]
                                            var orderno_a = tr.querySelector('tr td a')
                                            if(orderno_a && orderno_a.innerText.includes(orderNo[0])){
                                                console.log(orderno_a)
                                                orderno_a.style.color='red'
                                                orderno_a.innerText = orderno_a.innerText + '√'
                                            }
                                        }
                                    }

                                })
                            }
                        },
                        onerror: function(error) { console.error("Request failed:", error); }
                    });
                };
                queryButton.parentNode.insertBefore(matchButton,queryButton)
            }
            if(frameSrc.includes('https://app.dimix.com.cn:66/hainingkeyouli/dimix/jxc/xsgl/xskd_Add_new.jsp?urls=/hainingkeyouli/dimix/jxc/xsgl/xsdd.jsp')){
                var iframeDocument = desktopframe.contentDocument || desktopframe.contentWindow.document;

                // 补单操作
                // 默认补单单选
                 let radios = iframeDocument.querySelectorAll('input[name="SFBD_RADIO"]')
                 // console.log(radios)
                 for(var i = 0; i < radios.length; i++) {
                     if(radios[i].value === '1') {
                         radios[i].click()//点击是
                         break; // 找到后退出循环
                     }
                 }
                // 补充补单日期
                if(modify_create_date && modify_create_date != 'NaN-NaN-NaN'){
                    let create_date_dimix = iframeDocument.querySelector('table.tableEditWithoutBottomBorder input#CJRQIN')
                    create_date_dimix.value = modify_create_date

                }

                let inputAddRow = iframeDocument.querySelector('#BtnPoistionId > input:nth-child(2)')
                let inputMyself = iframeDocument.createElement('input');
                if(CPBM_value) inputMyself.value = CPBM_value
                if(CPXH_value) inputMyself.value = CPXH_value
                inputMyself.id = 'inputMyself'
                inputAddRow.parentNode.insertBefore(inputMyself,inputAddRow)
                let buttonMyself = iframeDocument.createElement('button');
                buttonMyself.innerHTML = "Grace的魔法键";
                buttonMyself.id = "myButton";
                buttonMyself.addEventListener('click', function() {
                    let inputMyself_value = iframeDocument.getElementById('inputMyself').value
                    let inputMyself_values = inputMyself_value.split(/ +/)
                    const input_map = new Map()
                    for(let k = 0;k < inputMyself_values.length; k++){
                        let inputMyself_values_i = inputMyself_values[k].split(/\t/)
                        if(inputMyself_values_i.length > 1){
                            input_map.set(inputMyself_values_i[0].trim(),inputMyself_values_i[1])
                        }else{
                            let danjia = liaohaoDanjiaMap.get(inputMyself_values_i[0].trim())
                            if(danjia){
                                input_map.set(inputMyself_values_i[0].trim(),danjia)
                            }else{
                                input_map.set(inputMyself_values_i[0].trim(),0)
                            }
                        }
                    }
                    console.log(inputMyself_values)
                    console.log(input_map)
                    let tableEdit = iframeDocument.getElementsByClassName('tableEdit')[0]
                    // console.log(tableEdit)
                    let tr_list = tableEdit.getElementsByTagName('tr');
                    var cnt = 0
                    for (var i = tr_list.length - 1; i >=0 ; i--) {
                        // 自定义代码逻辑
                        let tr = tr_list[i]
                        let tr_input_CPBM = tr.querySelector('input[name="CPBM"]')
                        let tr_input_CPXH = tr.querySelector('input[name="CPXH"]')
                        if((tr_input_CPBM && input_map.has(tr_input_CPBM.value)) || (tr_input_CPXH && input_map.has(tr_input_CPXH.value))){
                            let hsdj = 0
                            if(input_map.has(tr_input_CPBM.value)){
                                hsdj = input_map.get(tr_input_CPBM.value)
                            }
                            if(input_map.has(tr_input_CPXH.value)){
                                hsdj = input_map.get(tr_input_CPXH.value)
                            }
                            if(hsdj > 0){
                                let tr_input_HSDJ = tr.querySelector('input[name="HSDJ"]')
                                tr_input_HSDJ.focus()
                                tr_input_HSDJ.value = hsdj
                                tr_input_HSDJ.blur()
                            }
                        }else{
                            let tr_a = tr.querySelector('a[onclick*="del_row"]')
                            if(tr_a){
                                cnt++
                                tr_a.click();
                            }
                        }
                    }
                    if(cnt == 0) {
                        // let myButton = iframeDocument.querySelector('#myButton')
                        // myButton.disabled = true
                        CPBM_value = ''
                        CPXH_value = ''
                        alert('删除完成！')
                    }
                });
                inputAddRow.parentNode.insertBefore(buttonMyself,inputAddRow)
            }
        }
    }

})();