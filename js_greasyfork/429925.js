// ==UserScript==
// @name         SDU本科生院教务系统助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  偷懒专用
// @author       You
// @match        http://bkjws.sdu.edu.cn/f/common/main
// @icon         https://www.google.com/s2/favicons?domain=.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429925/SDU%E6%9C%AC%E7%A7%91%E7%94%9F%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429925/SDU%E6%9C%AC%E7%A7%91%E7%94%9F%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //添加脚本设置组件
    var AutoView = true
    var total_xf = 0
    var total_wfzjd = 0
    var appendScriptUnitVar = setInterval(function(){appendScriptUnit()}, 10)
    setInterval(function(){
        if(AutoView){
            viewAll()
            rapidSubmit()
        }
    }, 10)
    function appendScriptUnit(){
        if(document.querySelector('body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li:nth-child(5)') != null){
            var cloneUnit = document.querySelector('body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li:nth-child(5)')
            var Unit = cloneUnit.cloneNode(true)
            var ul = document.querySelector("body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul")
            ul.appendChild(Unit)
            document.querySelector('body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li:nth-child(10) > a > span.title').innerHTML = "脚本设置"
            var AutoViewSetting = document.querySelector('body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li:nth-child(10) > ul > li:nth-child(1) > a')
            AutoViewSetting.innerHTML = "自动评教设置：开"
            AutoViewSetting.removeAttribute("href")
            AutoViewSetting.removeAttribute("class")
            AutoViewSetting.addEventListener("click", AutoViewSettingPage)
            var enquireGPA = document.querySelector('body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li:nth-child(10) > ul > li:nth-child(2) > a')
            enquireGPA.innerHTML = "绩点查询"
            enquireGPA.removeAttribute("href")
            enquireGPA.removeAttribute("class")
            enquireGPA.addEventListener("click", function(){enquireGPAPage1(); enquireGPAPage2()})
            clearInterval(appendScriptUnitVar)
        }
    }
    function AutoViewSettingPage(){
        var AA = document.querySelector('body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li.open > ul > li:nth-child(1) > a')
        if(AutoView){
            AA.innerText = "自动评教设置：关"
            AutoView = false
        }
        else{
            AA.innerText = "自动评教设置：开"
            AutoView = true
        }
    }
    function enquireGPAPage1(){
        var http = new XMLHttpRequest()
        var url = 'http://bkjws.sdu.edu.cn/b/cj/cjcx/xs/lscx'
        var params = 'aoData=[{"name":"sEcho","value":2},{"name":"iColumns","value":10},{"name":"sColumns","value":""},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":-1},{"name":"mDataProp_0","value":"xnxq"},{"name":"mDataProp_1","value":"kch"},{"name":"mDataProp_2","value":"kcm"},{"name":"mDataProp_3","value":"kxh"},{"name":"mDataProp_4","value":"xf"},{"name":"mDataProp_5","value":"kssj"},{"name":"mDataProp_6","value":"kscjView"},{"name":"mDataProp_7","value":"wfzjd"},{"name":"mDataProp_8","value":"wfzdj"},{"name":"mDataProp_9","value":"kcsx"},{"name":"iSortCol_0","value":5},{"name":"sSortDir_0","value":"desc"},{"name":"iSortingCols","value":1},{"name":"bSortable_0","value":false},{"name":"bSortable_1","value":false},{"name":"bSortable_2","value":false},{"name":"bSortable_3","value":false},{"name":"bSortable_4","value":false},{"name":"bSortable_5","value":true},{"name":"bSortable_6","value":false},{"name":"bSortable_7","value":false},{"name":"bSortable_8","value":false},{"name":"bSortable_9","value":false}]'
        http.open('POST', url, true)
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var resp1 = http.responseText
                var obj = JSON.parse(resp1)
                //console.log(obj.object.aaData['0'].wfzjd)
                for(var i = 0; i<obj.object.iTotalRecords; i++){
                    if(obj.object.aaData[i].kcsx == "必修" || obj.object.aaData[i].kcsx == "限选"){
                        total_xf += obj.object.aaData[i].xf
                        total_wfzjd += obj.object.aaData[i].wfzjd * obj.object.aaData[i].xf
                    }
                }
                //console.log(total_wfzjd / total_xf)
            }
        }
        http.send(params)
    }
        function enquireGPAPage2(){
        var http = new XMLHttpRequest()
        var url = 'http://bkjws.sdu.edu.cn/b/cj/cjcx/xs/list'
        var params = 'aoData=[{"name":"sEcho","value":1},{"name":"iColumns","value":10},{"name":"sColumns","value":""},{"name":"iDisplayStart","value":0},{"name":"iDisplayLength","value":-1},{"name":"mDataProp_0","value":"function"},{"name":"mDataProp_1","value":"kch"},{"name":"mDataProp_2","value":"kcm"},{"name":"mDataProp_3","value":"kxh"},{"name":"mDataProp_4","value":"xf"},{"name":"mDataProp_5","value":"kssj"},{"name":"mDataProp_6","value":"kscjView"},{"name":"mDataProp_7","value":"wfzjd"},{"name":"mDataProp_8","value":"wfzdj"},{"name":"mDataProp_9","value":"kcsx"},{"name":"iSortingCols","value":0},{"name":"bSortable_0","value":false},{"name":"bSortable_1","value":false},{"name":"bSortable_2","value":false},{"name":"bSortable_3","value":false},{"name":"bSortable_4","value":false},{"name":"bSortable_5","value":false},{"name":"bSortable_6","value":false},{"name":"bSortable_7","value":false},{"name":"bSortable_8","value":false},{"name":"bSortable_9","value":false}]'
        http.open('POST', url, true)
        http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var resp1 = http.responseText
                var obj = JSON.parse(resp1)
                for(var i = 0; i<obj.object.iTotalRecords; i++){
                    if(obj.object.aaData[i].kcsx == "必修" || obj.object.aaData[i].kcsx == "限选"){
                        total_xf += obj.object.aaData[i].xf
                        total_wfzjd += obj.object.aaData[i].wfzjd * obj.object.aaData[i].xf
                    }
                }
                console.log("总绩点为：" + (total_wfzjd / total_xf).toFixed(2))
                alert("总绩点为：" + (total_wfzjd / total_xf).toFixed(2))
            }
        }
        http.send(params)
    }
    function viewAll(){
        if(document.querySelector("#zbda_1") != null){
            var i = 0
            while(i < 21){
                document.querySelector("#zbda_" + i).click()
                i++
            }
            document.querySelector("input[value=\"课程难度适中\"]").click()
            document.querySelector("#zbda_21").value = "讲课生动，受益良多"
        }
    }

    function rapidSubmit(){
        var Button1 = document.querySelector("body > div.aui_state_lock.aui_state_focus > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(3) > td > div > button.aui_state_highlight")
        var Button2 = document.querySelector("body > div.aui_state_focus.aui_state_lock > div > table > tbody > tr:nth-child(2) > td.aui_c > div > table > tbody > tr:nth-child(3) > td > div > button")
        var Button3 = document.querySelector("body > div.page-container > div.page-sidebar.nav-collapse.collapse > ul > li.open.active > ul > li.active > a")
        if(Button1 != null){
            Button1.click()
            Button2.click()
            Button3.click()
        }

    }

})();

