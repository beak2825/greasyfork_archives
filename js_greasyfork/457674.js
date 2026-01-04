// ==UserScript==
// @name         ApolloConfigSearch
// @namespace    https://apollo.com/
// @version      0.3
// @description  用于进行配置系统apollo的Key的快速搜索和定位
// @author       AustinYoung
// @match        https://*/config.html
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457674/ApolloConfigSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/457674/ApolloConfigSearch.meta.js
// ==/UserScript==
// 用于进行appllo系统的 Key内容的快速搜索和定位
// 支持用空格分割关键字对输入内容进行“与”方式搜索
// 全局变量保存基础信息
var CurrIndex = 0; // 当前查询到的位置
var ArrlIndex = []; // 总共的位置集合
let PreObj = null;  // 前一个获取对象
let PreSearchKey = '';  // 前一个获取对象
var ArrObj = [];   // 文字和td对象数组
// 全局变量结束
(function () {
    'use strict';
    addButton()
    // Your code here...
})();
// 返回表格中每一行中 Key的内容，形成数组
function getKeys(objTrs, index) {
    //let text,obj;
    let objArr = []
    objTrs.forEach(x => {
        let obj = x.querySelector('td:nth-child(' + (index + 1) + ')')
        if (obj == null) {
            return;
        }
        let txt = obj.innerText.toLowerCase(); // 无视大小写
        objArr.push({ obj, txt })
    })
    return objArr;
}

function addButton() {
    var strControlHTML = `
    <div style="padding:2px;position:fixed;top:40px;left:2px;z-index:99999" id="myselfFloat">
    <div  style="background-color:rgb(208, 227, 245);opacity: 0.8;">
        <span style="cursor:pointer;" onclick="showList()">🔎</span>
        <span id="searchBar">
            <input id="mySearchKey" size="20" placeholder="请输入回车搜索Key 可空格分割多条件"/>
            <span style="cursor:pointer;" id="btPre">▲</span> <span style="cursor:pointer;" id="btNext">▼</span>
            <span id="searchHint"></span>
        </span>
    </div>
  </div>
  `;
    var oNode = document.createElement('div');
    oNode.innerHTML = strControlHTML;
    document.body.append(oNode);
    setTimeout( function(){
        getAllKeys()
        btPre.onclick= function(){
            doSearch(-1)
            return false
        }
        btNext.onclick= function(){
            doSearch(1)
            return false
        }
        mySearchKey.onkeypress = function(){
            doSearch(window.event)
        }
    },1)
}
unsafeWindow.showList = function () {
    searchBar.style.display = searchBar.style.display == '' ? 'none' : ''
}
function doSearch(e) {
    if (e.keyCode == 13) {
        // 默认为往下收缩
        e = 1
    }
    // 只有当e不是事件时才执行搜索
    if (e.keyCode == null) {
        // 获取输入内容
        let currKeys = mySearchKey.value.trim();
        // 不输入内容，则表示清空
        if(currKeys =='')
        {
            CurrIndex = 0;
            ArrlIndex = [];
            showHint('请输入内容！','red')
            return;
        }
        if (currKeys != PreSearchKey) {
            // 重新搜索
            searchTxt(currKeys)
            PreSearchKey = currKeys;
        }
        if (e == 1) {
            //console.log('doSearch')
            searchFocus(e)
        } else if (e == -1) {
            //console.log('doSearch back')
            searchFocus(e)
        }
    }
}
function getAllKeys() {
    if (ArrObj.length > 0) {
        //console.log('getAllKeys.len:',getAllKeys.length)
        return;
    }
    var allTableDiv = document.querySelectorAll('.namespace-view-table table')
    allTableDiv.forEach(x => {
        // 要获取判断第几列是 Key
        if (x.className.indexOf('hide') > -1) {
            return
        }
        let ths = Array.from(x.querySelectorAll('th'))
        let keyCol = 2; // 默认第二列
        ths.find((v, i) => {
            let txt = v.innerText;
            if (txt.indexOf('Key') > -1) {
                keyCol = i;
                return true;
            }
        })
        ArrObj.push(...getKeys(x.querySelectorAll('tr'), keyCol))
    })
    //console.log("getAllKeys ",ArrObj)
}
// 搜索内容并复位相关标记
function searchTxt(keyword) {
    if (ArrObj.length == 0) {
        getAllKeys();
    }
    CurrIndex = 0;
    ArrlIndex = [];
    // 无视大小写
    let arrKey=keyword.toLowerCase().split(/\s+/);
    ArrObj.forEach((x, i) => {
        // 核心搜索
        let hasFound = arrKey.every(y=>{
            return (x.txt.indexOf(y) > -1) 
        })
        if (hasFound) {
            ArrlIndex.push(i)
        }
    })
    // console.log(ArrlIndex)
}
// 根据当前搜索内容，定位到需要的位置
function searchFocus(flag) {
    let curr = CurrIndex
    curr += flag
    let extHint = ''
    let color = 'blue'
    if (curr < 0) {
        extHint = '到达顶部，从尾部开始'
        curr = ArrlIndex.length - 1
    } else if (curr >= ArrlIndex.length) {
        extHint = '到达尾部，从头开始'
        curr = 0
    }
    // 在范围以内
    CurrIndex = curr
    // 清除上次的标记
    if (PreObj != null) {
        PreObj.style.borderColor = ''
    }
    let realIndex = ArrlIndex[CurrIndex]
    if(ArrlIndex.length==0)
    {
        extHint ='未搜索到任何信息！'
        showHint(extHint,'Magenta')
        return;
    }
    let realObj = ArrObj[realIndex]
    if(realObj==null){
        extHint ='对象不存在！'
        color = 'red'
    }else{
        showFocus(realObj.obj)
    }
    showHint(extHint,color)
}
// 显示提示信息
function showHint(txt,color)
{
    searchHint.innerHTML = `当前${CurrIndex+1}/${ArrlIndex.length} <span style="color:${color}">${txt}<span>`
}
// 高亮搜索到的内容并滚动到当前
function showFocus(obj) {
    //console.log(obj)
    obj.style.borderColor = 'red'
    obj.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" })
    PreObj = obj;
}