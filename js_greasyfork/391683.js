// ==UserScript==
// @name         麻子表格助手-装卸船查询
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        *://www.npedi.com/ediportal-web/ediweb/EdiScoarri.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391683/%E9%BA%BB%E5%AD%90%E8%A1%A8%E6%A0%BC%E5%8A%A9%E6%89%8B-%E8%A3%85%E5%8D%B8%E8%88%B9%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/391683/%E9%BA%BB%E5%AD%90%E8%A1%A8%E6%A0%BC%E5%8A%A9%E6%89%8B-%E8%A3%85%E5%8D%B8%E8%88%B9%E6%9F%A5%E8%AF%A2.meta.js
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
        <li><label><input name="checkBox" type="checkbox" value="I" checked>国际中转</label></li>
        <li><label><input name="checkBox" type="checkbox" value="D"checked>内贸箱</label></li>
        <li><label><input name="checkBox" type="checkbox" value="N"checked>内支线</label></li>
        <li><label><input name="checkBox" type="checkbox" value="B"checked>退关箱</label></li>
        <li><label><input name="checkBox" type="checkbox" value="T"checked>海铁</label></li>
        <li><label><input name="checkBox" type="checkbox" value="F"checked>分拨</label></li>
        <li><label><input name="checkBox" type="checkbox" value=""checked>其他(箱属性栏为空的数据)</label></li>
    </ul>
</div>`).insertAfter($panel)
    $panel.find("button").click(_ => {
        getEdiScoarri()
    })

    $CheckBox.find("#filterBox").on("change", e => {
        $("#BoxList").toggle(DoFilter = e.target.checked)
    })
})();
//进出口查询
let EdiScodecoUrl = "/ediportal-web/scodeco/getEdiScodeco.action";
//装卸船查询
let EdiScoarriUrl = "/ediportal-web/getEdiScoarri.action";
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
async function getEdiScoarri(){
    var ediScodecoDataArray = await getEdiScodeco()
    if(!ediScodecoDataArray){
        return
    }
    var dataSet = new Set();
    ediScodecoDataArray.map((d,i)=>dataSet.add(d.blNo))
    $("#btnSearchAndClip").prop("disabled", true).text("正在处理")
    let dataArray = []
    let data = getData("EdiScoarri")
    data.pageCount = 500
    data.gotoPage = 1
    let url = EdiScoarriUrl
    let res = await get(url, data)
    if (!res.result) {
        showTips("无法获取数据！请尝试重新登录");
        console.log(res)
        $("#btnSearchAndClip").prop("disabled", false).text("查询并复制")
        return
    }
    let totalCount = res.totalCount
    console.log(`总共数据项:` + totalCount)
    console.log(`当前数据页:${res.pageNo},当页数据量${res.result.length}`)
    // dataArray = dataArray.concat(res.result)
    dataArray = dataArray.concat(res.result.filter(d=>dataSet.has(d.blNo)))
    while (data.gotoPage * data.pageCount <= totalCount) {
        data.gotoPage += 1
        let rres = await get(url, data)
        dataArray = dataArray.concat(rres.result.filter(d=>dataSet.has(d.blNo)))
        console.log(`当前数据页:${rres.pageNo},当页数据量${rres.result.length}`)
    }
    $("#btnSearchAndClip").prop("disabled", false).text("查询并复制")
    exportData(dataArray)
}


async function getEdiScodeco() {
    let data = getData("EdiScodeco")
    if (!data) {
        return
    }
    $("#btnSearchAndClip").prop("disabled", true).text("正在处理")
    let dataArray = []
    data.pageCount = 500
    data.gotoPage = 1
    var url = EdiScodecoUrl;
    let res = await get(url, data)
    if (!res.result) {
        showTips("无法获取数据！请尝试重新登录");
        console.log(res)
        $("#btnSearchAndClip").prop("disabled", false).text("查询并复制")
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
    $("#btnSearchAndClip").prop("disabled", false).text("查询并复制")
    // exportData(dataArray)
    return dataArray.filter(d => {
        let keep = false;
        let containerType = d.containerType||""
        let type = changeType(containerType)
        keep = type == "" //只选择没有箱属性的信息
        if (DoFilter) {
            keep = ary.indexOf(containerType) > -1 //选中的箱属性信息
        }
        return keep
    })
}

function getFilterList() {
    let a = []
    let ndlist = document.querySelectorAll("input[name='checkBox']")
    for (let i = 0; i < ndlist.length; i++) {
        let node = ndlist[i];
        if (node.checked) {
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
        //dischargePortCode:卸货港 ctnSizeType:尺寸类型 ctnOperatorCode:箱主
        for (const result of dataArray) {
            content += result.dischargePortCode + "\t" + result.ctnSizeType + "\t" + result.ctnSizeType + "\t" + result.ctnOperatorCode + "\n"
        }
    } else {
        //获取箱主卸货港的吨数
        let operatorMap = {}
        let dlPortIdx = {}
        let dlPortArray = []
        let idx = 1
        for (const data of dataArray) {
            if (!operatorMap[data.ctnOperatorCode])
                operatorMap[data.ctnOperatorCode] = {}

            if (!operatorMap[data.ctnOperatorCode][data.dischargePortCode])
                operatorMap[data.ctnOperatorCode][data.dischargePortCode] = 0
            //计算tun数
            let tun = getTun(data.ctnSizeType)
            operatorMap[data.ctnOperatorCode][data.dischargePortCode] += tun
            if (!dlPortIdx[data.dischargePortCode]) {
                dlPortIdx[data.dischargePortCode] = idx
                dlPortArray.push(data.dischargePortCode)
                idx += 1
            }
        }
        //表头
        content = "\t" + dlPortArray.join("\t") + "\n"

        for (const operatorName in operatorMap) {
            const operator = operatorMap[operatorName];
            content += operatorName
            for (const dlPort of dlPortArray) {
                content += `\t${operator[dlPort]!=undefined?operator[dlPort]:0}`
            }
            content += "\n"
        }

    }
    console.log(content)
    _CopyToClipboard(content)
}

function getTun(ctnSizeType) {
    //等于l5gp是3
    if (ctnSizeType.toUpperCase() == "L5GP") {
        return 3
    }
    //等于22开头是1
    if (/^22/.test(ctnSizeType)) {
        return 1
    }
    //其他是2
    return 2
}


function getData(flag) {
    if ($.trim($("#cmhc").val()) == "" && $.trim($("#xz").val()) == "" && $.trim($("#ctnNo").val()) == "" && $.trim($("#blNo").val()) == "") {

        showTips("请至少输入一个条件！");
        return false;

    } else if ($.trim($("#cmhc").val()) == "" && $.trim($("#xz").val()) != "") {

        showTips("已选择箱主，请选择船名航次！");
        return false;

    } else {

        var pageCount = $("#pageCount").val(); //每页显示行数，默认是10条

        //进出门选择判断
        var _radio = $('input:radio[name="scoarri"]:checked').val();
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
        if (flag == "EdiScodeco")
            return {
                vesselname,
                blNo: $.trim($("#blNo").val()),
                ctnNo: $.trim($("#ctnNo").val()),
                inOrOut,
                ctnOperatorCode: $("#xz").val(),
                vesselcode,
                voyage
            }
        else if (flag == "EdiScoarri")
            return {
                billno: $.trim($("#blNo").val()),
                xzcode: $("#xz").val(),
                loadOrNot: _radio,
                ctnNo: $.trim($("#ctnNo").val()),
                vesselcode,
                voyage,
                blNo: $.trim($("#blNo").val()),
                vesselname,
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