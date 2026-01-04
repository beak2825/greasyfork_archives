// ==UserScript==
// @name         麻子表格助手
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  try to take over the world!
// @author       You
// @match        *://www.npedi.com/ediportal-web/ediweb/EdiScodeco.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387851/%E9%BA%BB%E5%AD%90%E8%A1%A8%E6%A0%BC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387851/%E9%BA%BB%E5%AD%90%E8%A1%A8%E6%A0%BC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Your code here...123
    let $panel = $(`<div style="margin-top:10px">
<label>数据<input type="radio" value="0" name="tabelType" checked/></label>
<label>表格<input type="radio" value="1" name="tabelType"/></label>
<button id="btnSearchAndClip" type="button" class="ui-submit">查询并复制</button>
</div>`).appendTo(".search-form td.button")

    let $CheckBox = $(`<div>
    <label>箱属性筛选
    <input id="filterBox"  name="filterBox" type="checkbox" value="1"></label>
    <ul id="BoxList" style="display:none">
        <li><label>国际中转<input name="checkBox" type="checkbox" value="I" checked></label></li>
        <li><label>内贸箱<input name="checkBox" type="checkbox" value="D"checked></label></li>
        <li><label>内支线<input name="checkBox" type="checkbox" value="N"checked></label></li>
        <li><label>退关箱<input name="checkBox" type="checkbox" value="B"checked></label></li>
        <li><label>海铁<input name="checkBox" type="checkbox" value="T"checked></label></li>
        <li><label>分拨<input name="checkBox" type="checkbox" value="F"checked></label></li>
    </ul>
</div>`).insertAfter($panel)
    $panel.find("button").click(_ => {
        getEdiScodeco()
    })

    $CheckBox.find("#filterBox").on("change",e=>{
        $("#BoxList").toggle( DoFilter=e.target.checked)
    })
})();
let DoFilter = false;

function get(url, data) {
    let getQueryStr = () => {
        let query = ""
        for (const key in data) {
            const value = data[key];
            query += `&${key}=${encodeURIComponent(value)}`
        }
        let urlQuery = (url + query).replace("&", "?")
        return urlQuery
    }

    return new Promise(resolve => {

        let req = new XMLHttpRequest()
        req.open('GET', getQueryStr());
        req.onload = function () {
            if (req.status == 200) {
                // 请求成功,可以把返回数据res.response传给resolve方法中
                resolve(JSON.parse(req.response))
            } else {
                // 请求失败，可以把失败信息 req.statusText传给reject中
            };
        };
        req.onerror = function () {
            //请求失败，把"Network Error" 传给reject
        };
        req.send();
    })
}

function getEdiScodeco() {
    let data = getData()
    if (!data) {
        return
    }
    (async () => {
        $("#btnSearchAndClip").prop("disabled",true).text("正在处理")
        let dataArray = []
        data.pageCount = 500
        data.gotoPage = 1
        var url = "/ediportal-web/scodeco/getEdiScodeco.action";
        let res = await get(url, data)
        if(!res.result){
            showTips("无法获取数据！请尝试重新登录");
            console.log(res)
            $("#btnSearchAndClip").prop("disabled",false).text("查询并复制")
            return
        }
        let totalCount = res.totalCount
        console.log(`总共数据项:` + totalCount)
        console.log(`当前数据页:${res.pageNo},当页数据量${res.result.length}`)
        dataArray = dataArray.concat(res.result)
        while (data.gotoPage * data.pageCount <= totalCount) {
            data.gotoPage += 1
            let rres = await get(url, data)
            dataArray = dataArray.concat(rres.result)
            console.log(`当前数据页:${rres.pageNo},当页数据量${rres.result.length}`)
        }
        let ary = getFilterList()
        //过滤
        dataArray = dataArray.filter(d => {
            let remove = false;
            let type = changeType(d.containerType)
            remove = type==""
            if(DoFilter){
                if (ary.indexOf(d.containerType)>-1){
                    remove = true
                }
            }
            return remove
        })
        $("#btnSearchAndClip").prop("disabled",false).text("查询并复制")
        exportData(dataArray)
    })()
}
function getFilterList (){
    let a = []
    let ndlist = document.querySelectorAll("input[name='checkBox']")
    for(let i =0;i<ndlist.length;i++){
        let node = ndlist[i];
        if(node.checked){
            a.push(node.value)
        }
    }
    return a;
}

function exportData(dataArray) {
    let tabelType = $("input[name='tabelType']:checked").val()
    let content
    if (tabelType === "0") {
        content = "卸货港\t尺寸类型\t尺寸类型2\t箱主\n"
        //dlPortCode:卸货港 ctnSizeType:尺寸类型 ctnOperatorCode:箱主
        for (const result of dataArray) {
            content += result.dlPortCode + "\t" + result.ctnSizeType + "\t" + result.ctnSizeType + "\t" + result.ctnOperatorCode + "\n"
        }
    }else{
        //获取箱主卸货港的吨数
        let operatorMap = {}
        let dlPortIdx ={}
        let dlPortArray =[]
        let idx = 1 
        for (const data of dataArray) {
            if(!operatorMap[data.ctnOperatorCode])
                operatorMap[data.ctnOperatorCode]={}
            
            if(!operatorMap[data.ctnOperatorCode][data.dlPortCode])
                operatorMap[data.ctnOperatorCode][data.dlPortCode]=0
            //计算tun数
            let tun = getTun(data.ctnSizeType)
            operatorMap[data.ctnOperatorCode][data.dlPortCode]+=tun
            if(!dlPortIdx[data.dlPortCode]){
                dlPortIdx[data.dlPortCode] = idx
                dlPortArray.push(data.dlPortCode)
                idx += 1
            }
        }
        //表头
        content = "\t"+dlPortArray.join("\t")+"\n"
        
        for (const operatorName in operatorMap) {
            const operator = operatorMap[operatorName];
            content+= operatorName 
            for (const dlPort of dlPortArray) {
                content+=`\t${operator[dlPort]!=undefined?operator[dlPort]:0}`
            }
            content+="\n"
        }

    }
    console.log(content)
    _CopyToClipboard(content)
}
function getTun(ctnSizeType){
    //等于l5gp是3
    if(ctnSizeType.toUpperCase()=="L5GP"){
        return 3
    }
    //等于22开头是1
    if(/^22/.test(ctnSizeType)){
        return 1
    }
    //其他是2
    return 2
}


function getData() {
    if ($.trim($("#cmhc").val()) == "" && $.trim($("#xz").val()) == "" && $.trim($("#ctnNo").val()) == "" && $.trim($("#blNo").val()) == "") {

        showTips("请至少输入一个条件！");
        return false;

    } else if ($.trim($("#cmhc").val()) == "" && $.trim($("#xz").val()) != "") {

        showTips("已选择箱主，请选择船名航次！");
        return false;

    } else {

        var pageCount = $("#pageCount").val(); //每页显示行数，默认是10条

        //进出门选择判断
        var _radio = $('input:radio[name="scodeco"]:checked').val();
        var inOrOut = "in";
        if (_radio != "1") {
            inOrOut = "out";
        }

        //船名航次赋值
        var vesselcode = "";
        var voyage = "";
        var vesselname = "";
        if ($("#cmhc").val() == undefined || $.trim($("#cmhc").val()) == "") {

        } else {
            try {
                var temp = $("#cmhc").val().split("/");
                var templist = temp[1].split("-");
                vesselname = temp[0];
                vesselcode = templist[1] || '';
                voyage = templist[0];
            } catch (e) {
                alert("请输入完整信息");
                return false
            }
        }
        return {
            vesselname,
            blNo: $.trim($("#blNo").val()),
            ctnNo: $.trim($("#ctnNo").val()),
            inOrOut,
            ctnOperatorCode: $("#xz").val(),
            vesselcode,
            voyage
        }
    }
}

function _CopyToClipboard(content) {
    let temp = document.createElement('textarea');
    temp.value = content;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("Copy");
    alert('复制成功');
    temp.remove()
}

function changeType(data) {
    if (data == "I") {
        return "国际中转";
    } else if (data == "D") {
        return "内贸箱";
    } else if (data == "N") {
        return "内支线";
    } else if (data == "B") {
        return "退关箱";
    } else if (data == "T") {
        return "海铁";
    } else if (data == "F") {
        return "分拨";
    } else {
        return "";
    }
}