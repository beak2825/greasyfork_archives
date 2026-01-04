function isEditable() {
     // 判断是否处于可编辑状态
    if (document.getElementsByClassName("edm-record-page").length>0) {
        return false
    }
    else {
        return true
    }
}

function searchDeviceConnection(searchString) {
    // 根据选择的文本搜索“仪器连接”表格，并以字典列表的格式返回
    if (!isEditable()) {
        // 定位仪器连接表格
        var deviceConnection = document.evaluate("//div[@class='mbfrom' and contains(., '仪器连接')]//table", document, null, XPathResult.ANY_TYPE).iterateNext();
        
        //解析表头
        var th = deviceConnection.tHead.rows[0].cells
        var columns = {}
        for (let i = 0; i < th.length; i++) {
            columns[th[i].innerHTML] = i
        }

        //按内容搜索
        var tr = deviceConnection.rows
        
        // 字典储存一行查找到的结果，多个字典存于列表
        var searchedRows = []
        for (var s=0; s<searchString.length; s++) {
            for (i = 0; i < tr.length; i++) {
                if (tr[i]) {
                    if (tr[i].innerHTML.indexOf(searchString[s]) > -1) {
                        row = {"名称": tr[i].cells[columns["名称"]].innerText,
                            "实际值":tr[i].cells[columns["实际值"]].innerText,
                            "设备编号":tr[i].cells[columns["设备编号"]].innerText,
                            "测试时间": tr[i].cells[columns["测试时间"]].innerText
                        }
                        searchedRows.push(row)
                    }
                } 
            }
        }
    }
    // else {
    // }

    return searchedRows
}

function displayResults(x, y, content){
    // 在鼠标位置显示查找到的内容

    let hint = document.createElement("div")
    hint.innerHTML = content
    hint.style = `
        position: fixed;
        left: ${x-10}px;
        top: ${y-10}px;
        position: fixed;
        background-color: AliceBlue;
        border: solid;
        font-size: 16px;
        padding: 5px;

        `
    document.body.append(hint)
    // 鼠标移出后删除悬浮框
    hint.onmouseleave=function(){
        document.body.removeChild(hint)
    }
}

function getMousePos(event) {
    // 获取鼠标坐标
    var x, y; 
    var e = event || window.event; 
    x = e.clientX; 
    y = e.clientY; 
    return { x: x, y: y } 
}

function main() {
    // 根据选中的文本，查找“仪器连接”表格中的数据，并悬浮显示结果，使记录自查或审核更方便
    window.addEventListener("mouseup", textSelected)
}

function textSelected(event) {
    //文本选中事件触发时，根据选中内容查找“仪器连接”表格
    var text = window.getSelection().toString();

    let mouse = getMousePos(event)

    var re = /\d+.\d+\s?g/g; //提取选中文本中的称量数据
    // var extracted = re.exec(text)
    var extracted = text.match(re)
    // if (extracted) {
    //     extracted = extracted.toString();
    // }

    for (var i=0; i < extracted.length; i++) {
        extracted[i] = extracted[i].replace(/\s+/g, "")  //去掉空格
    }

    if (extracted!=null) {
        results = searchDeviceConnection(extracted)
        // 将字典格式的搜索结果转换为可读的文本
        content = ""
        for (let i = 0; i < results.length; i++ ) {
            for (key in results[i]){
                content = content + key + ": " + "<b>" + results[i][key] + "</b>" + "&emsp;&emsp;"
            }
            content = content + "<br>"
        }

        displayResults(mouse["x"], mouse["y"], content)
    }
}

// ==UserScript==
// @name         EDM Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  EDM 电子记录系统辅助插件
// @author       You
// @match        http://edm.ilab.huiyuseacross.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/434343/EDM%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/434343/EDM%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    main();
})();