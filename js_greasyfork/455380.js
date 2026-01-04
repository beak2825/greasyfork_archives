// ==UserScript==
// @name         xhtml定制脚本
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  强化xhtml功能，点击醒目标记弹出具体内容，支持页面标签搜索
// @author       kanami
// @include      *.xhtml
// @match        *.xhtml
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455380/xhtml%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455380/xhtml%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
let infoBox = document.createElement('div')
let content_box = document.createElement('div')
let currentPageIndexInput = document.createElement('input')
let datalist = [{}, {}]
let searchResultBox = document.createElement('div')
let bkkdIcon=document.createElement('div')
$(document).ready(function () {
    let showBox = document.createElement('div');
    let pageIndexBox = document.createElement('div');
    let prevBtn = document.createElement('button');
    let nextBtn = document.createElement('button');
    let searchBtn = document.createElement('button');
    let searchInput = document.createElement('input');
    let searchBox = document.createElement('div');
    let resultBox = document.createElement('div');
    let ft = document.createElement('div');
    let header = document.createElement('div');
    let quantity = document.createElement('div');
    let headerInfo = document.createElement('div');
    let close_btn = document.createElement('div');
    let style = document.createElement('style');
    let blankBlock = document.createElement('div');
    let fc = document.body.firstChild;

    let factsArr = document.getElementsByTagName('ix:nonFraction');
    let factsArr2 = document.getElementsByTagName('ix:nonNumeric');
    factsArr=[...factsArr,...factsArr2]
    let pageNum = Math.max(1, Math.ceil(datalist.length / 10));

    showBox.id = 'showBox';
    showBox.style.height = 'calc(100vh - 100px)';
    showBox.style.width = '200px';
    showBox.style.border = '2px solid rgb(0, 55, 104)';
    showBox.style.position = 'fixed';
    showBox.style.display = 'none';
    showBox.style.flexDirection = 'column';
    showBox.style.justifyContent = 'center';
    showBox.style.alignItems = 'center';
    showBox.style.right = '0px';
    showBox.style.top = '50px';
    showBox.style.backgroundColor = 'rgba(220, 220, 220,0.5)';
    showBox.style.overflow = 'auto';
    pageIndexBox.id = 'pageIndexBox';
    pageIndexBox.style.backgroundColor = 'white';
    pageIndexBox.style.height = '10%';
    pageIndexBox.style.width = '95%';
    pageIndexBox.style.display = 'flex';
    pageIndexBox.style.justifyContent = 'center';
    pageIndexBox.style.alignItems = 'center';
    pageIndexBox.style.margin = '0 0 auto 0';
    pageIndexBox.style.border = '2px solid rgba(220, 220, 220,0.5)';
    prevBtn.id = 'prevBtn';
    prevBtn.innerText = 'prev';
    prevBtn.style.height = '35px';
    prevBtn.addEventListener('click', () => {
        let val = Number(currentPageIndexInput.value);
        if (isNaN(val)) {
            alert('请输入数字');
            return;
        }
        currentPageIndexInput.value = Math.max(1, currentPageIndexInput.value - 1);
        currentPageIndexInput.value = Math.min(pageNum, currentPageIndexInput.value);
        showList(currentPageIndexInput.value);
    })
    currentPageIndexInput.id = 'currentPageIndexInput';
    currentPageIndexInput.style.height = '30px';
    currentPageIndexInput.style.width = '50px';
    currentPageIndexInput.style.textAlign = 'center';
    currentPageIndexInput.defaultValue = '1';
    currentPageIndexInput.style.margin = '0 5px 0 5px';
    currentPageIndexInput.onkeyup = (e) => {
        if (e.keyCode === 13) {
            let val = Number(currentPageIndexInput.value);
            if (isNaN(val)) {
                alert('请输入数字');
            } else {
                if (val > pageNum) {
                    val = pageNum;
                }
                if (val < 1) {
                    val = 1;
                }
                currentPageIndexInput.value=val;
                showList(val);
            }
        }
    }
    nextBtn.id = 'nextBtn';
    nextBtn.innerText = 'next';
    nextBtn.style.height = '35px';
    nextBtn.addEventListener('click', () => {
        let val = Number(currentPageIndexInput.value);
        if (isNaN(val)) {
            alert('请输入数字');
            return;
        }
        currentPageIndexInput.value = Math.min(pageNum, val + 1);
        currentPageIndexInput.value = Math.max(1, currentPageIndexInput.value);
        showList(currentPageIndexInput.value);
    })
    pageIndexBox.appendChild(prevBtn);
    pageIndexBox.appendChild(currentPageIndexInput);
    pageIndexBox.appendChild(nextBtn);
    searchResultBox.id = 'searchResultBox';

    searchResultBox.style.overflow = 'auto';
    searchResultBox.style.flex = '1';
    searchResultBox.style.width = '97%';
    showBox.appendChild(pageIndexBox);
    showBox.appendChild(searchResultBox);
    document.body.appendChild(showBox);

    searchBtn.id = 'searchBtn';
    searchBtn.style.height = '40px';
    searchBtn.style.width = '40px';
    searchBtn.style.backgroundColor = 'white';
    searchBtn.style.position='relative';
    searchBtn.style.margin = '0 0 0 5px';
    searchBtn.style.cursor = 'pointer';
    searchBtn.addEventListener('click', () => {
        if (!searchInput.value) {
            alert('请勿输入空值');
            return;
        }
        datalist = searchFacts(factsArr, searchInput.value);
        quantity.innerHTML = datalist.length;
        pageNum = Math.max(1, Math.ceil(datalist.length / 10));
        currentPageIndexInput.value = 1;
        showList(1);
        showBox.style.display = 'flex';
    })
    bkkdIcon.id='bkkdIcon'
    bkkdIcon.classList.add('mybkkd')
    searchBtn.appendChild(bkkdIcon)
    searchInput.id = 'searchInput'
    searchInput.style.backgroundColor = 'white'
    searchInput.style.height = '70%'
    searchInput.style.width = '200px'
    searchInput.style.margin = '0 0 0 50px'
    searchInput.placeholder = 'Search Facts'
    searchInput.style.paddingLeft = '8px'
    searchInput.onkeyup = (e) => {
        if (e.keyCode === 13) {
            searchBtn.click()
        }
    }

    searchBox.id = 'searchBox'
    searchBox.style.height = '50px'
    searchBox.style.width = '100%'
    searchBox.style.position = 'fixed'
    searchBox.style.display = 'flex'
    searchBox.style.justifyContent = 'center'
    searchBox.style.alignItems = 'center'
    searchBox.style.right = '0%'
    searchBox.style.top = '0%'
    searchBox.style.transform = 'translate(0,0)'
    searchBox.style.backgroundColor = '#003768'
    resultBox.id = 'resultBox'
    resultBox.style.height = '30px'
    resultBox.style.width = 'auto'
    resultBox.style.justifyContent = 'center'
    resultBox.style.alignItems = 'center'
    resultBox.style.display = 'flex'
    resultBox.style.flex = 'column'
    resultBox.style.margin = '0 10px 0 auto'
    resultBox.style.cursor = 'pointer'
    ft.id = 'ft'
    ft.style.color = 'rgba(255,255,255,.7)'
    ft.style.height = '20px'
    ft.innerHTML = 'Facts'
    ft.style.margin = '0 5px 0 0'
    ft.style.textAlign = 'center'
    quantity.id = 'quantity'
    quantity.style.backgroundColor = 'white'
    quantity.style.font = 'black'
    quantity.style.height = '20px'
    quantity.style.width = 'auto'
    quantity.style.padding = '0 5px 0 5px'
    quantity.style.borderRadius = '3px'
    quantity.style.textAlign = 'center'
    quantity.innerHTML = '0'
    resultBox.addEventListener('click', () => {
        if (showBox.style.display !== 'flex') {
            showBox.style.display = 'flex'
        } else {
            showBox.style.display = 'none'
        }
    })
    searchBox.appendChild(searchInput)
    searchBox.appendChild(searchBtn)
    resultBox.appendChild(ft)
    resultBox.appendChild(quantity)
    searchBox.appendChild(resultBox)


    infoBox.style.position = 'fixed'
    infoBox.style.left = '50%'
    infoBox.style.top = '50%'
    infoBox.style.transform = 'translate(-50%,-50%)'
    infoBox.style.display = 'none'
    infoBox.style.border = '2px solid #003768'
    infoBox.style.borderRadius = '0.3rem'
    infoBox.style.flexDirection = 'column'
    infoBox.id = 'infoBox'
    header.id = 'header'
    header.style.height = '20px'
    header.style.width = '100%'
    header.style.backgroundColor = '#003768'
    header.style.display = 'flex'

    headerInfo.id = 'headerInfo'
    headerInfo.style.color = 'white'
    headerInfo.innerText = 'Attributes'
    headerInfo.style.margin = '0 0 0 5px'
    close_btn.id = 'close_btn'
    close_btn.style.margin = '0 0 0 auto'
    close_btn.style.height = '100%'
    close_btn.style.width = '20px'
    close_btn.style.position='relative'
    close_btn.style.cursor = 'pointer'
    close_btn.addEventListener('click', () => {
        infoBox.style.display = 'none'
    })
    close_btn.classList.add('closeIcon')
    header.appendChild(headerInfo)
    header.appendChild(close_btn)
    content_box.id = 'content_box'
    content_box.style.flex = '1'
    content_box.style.display = 'flex'
    content_box.style.justifyContent = 'center'
    content_box.style.alignItems = 'center'
    content_box.style.backgroundColor = 'white'
    content_box.style.width = '100%'
    infoBox.appendChild(header)
    infoBox.appendChild(content_box)

    style.type = 'text/css';
    style.innerHTML = `
            .mark{
                border-bottom: 2px solid #FF6600;
            }
            .mark:hover{
                cursor: pointer;
                background-color: rgba(255,0,0,0.3);
            }
            .listItem{
                word-break:break-all;
                width: 98%;
                height: 20%;
                cursor: pointer;
                border:2px solid rgba(220, 220, 220,0.5);
                font-size:14px;
                background-color:white;
            }
            .listItem:hover{
                background-color: rgba(220, 220, 220,0.5);
            }
            .mybkkd {
                font-size: 10px;
                display: inline-block;
                width: 10px;
                box-sizing: content-box;
                height: 10px;
                border: 2px solid black;
                position: absolute;
                border-radius: 10px;
                left:10px;
                top:8px;
              }
            .mybkkd:before {
                content: "";
                display: inline-block;
                position: absolute;
                right: -7px;
                bottom: -5px;
                border-width: 0;
                background: black;
                width: 10px;
                height: 2px;
                transform: rotate(50deg);
            }
            .closeIcon:before{
                content: "";
                display: inline-block;
                position: absolute;
                right: 0px;
                bottom: 8px;
                border-width: 0;
                background: white;
                width: 20px;
                height: 3px;
                transform: rotate(45deg);
            }
            .closeIcon:after{
                content: "";
                display: inline-block;
                position: absolute;
                right: 0px;
                bottom: 8px;
                border-width: 0;
                background: white;
                width: 20px;
                height: 3px;
                transform: rotate(-45deg);
            }
            `
            blankBlock.id = 'blankBlock'
    blankBlock.style.height = '50px'
    document.body.style.margin = '0'
    document.querySelector('head').appendChild(style)
    document.body.insertBefore(searchBox, fc)
    document.body.insertBefore(blankBlock, fc)
    document.body.appendChild(infoBox)

    //给每一个标签添加醒目标记
    for (let i = 0; i < factsArr.length; i++) {
        let label = factsArr[i]
        label.parentNode.classList.add('mark')
        label.addEventListener('click', () => {
            getInfo(label)
        })
    }
});
function getInfo(label) {
    infoBox.style.left = '50%'
    infoBox.style.top = '50%'
    infoBox.style.display = 'flex'
    content_box.innerHTML = ''
    let tableBox = document.createElement('div')
    tableBox.id = 'tableBox'
    tableBox.style.display = 'flex'
    tableBox.style.width = '99%'
    tableBox.style.overflow = 'auto'
    tableBox.style.alignItems = 'center'
    tableBox.style.justifyContent = 'center'
    let tab = document.createElement('table')
    tab.id = 'tab'
    tab.style.width = '99%'
    tab.style.border = '1px solid rgb(212, 212, 212)'
    tab.style.borderCollapse = 'collapse'
    tab.style.fontSize = '16.7px'
    for (let i = 0; i < label.attributes.length ; i++) {
        let tr = document.createElement('tr')
        let td_name = document.createElement('td')
        td_name.innerText = label.attributes[i].name
        td_name.style.border = '1px solid rgb(212, 212, 212)'
        td_name.style.borderCollapse = 'collapse'
        td_name.style.padding = '5px'
        td_name.style.height = '27px'
        let td_value = document.createElement('td')
        td_value.innerText = label.attributes[i].value
        td_value.style.border = '1px solid rgb(212, 212, 212)'
        td_value.style.borderCollapse = 'collapse'
        td_value.style.overflowX = 'auto'
        td_value.style.padding = '5px'
        tr.appendChild(td_name)
        tr.appendChild(td_value)
        tab.appendChild(tr)
    }
    tableBox.appendChild(tab)
    content_box.appendChild(tableBox)
}

function searchFacts(arr, val) {
    let res = []
    let valTest = new RegExp(val, 'i')
    for (let i = 0; i < arr.length; i++) {
        let label = arr[i]
        if (label.attributes['name'] && valTest.test(label.attributes['name'].value)) {
            res.push(label)
        } else if (label.attributes['contextRef'] && valTest.test(label.attributes['contextRef'].value)) {
            res.push(label)
        } else if (label.attributes['unitRef'] && valTest.test(label.attributes['unitRef'].value)) {
            res.push(label)
        } else if (label.attributes['id'] && valTest.test(label.attributes['id'].value)) {
            res.push(label)
        }
    }
    return res
}

function showList(pageIndex) {
    searchResultBox.innerHTML = ''
    let l = Math.max(0, (pageIndex - 1) * 10),
        r = Math.min(datalist.length, pageIndex * 10)
    for (let i = l; i < r; i++) {
        let tmp = document.createElement('div')
        tmp.innerHTML = datalist[i].attributes['name'].value
        tmp.classList.add('listItem')
        tmp.addEventListener('click', () => {
            datalist[i].scrollIntoView(false)
            getInfo(datalist[i])
        })
        tmp.addEventListener('mouseover', () => {
            datalist[i].parentNode.style.backgroundColor = 'rgba(255,0,0,0.3)'
        })
        tmp.addEventListener('mouseout', () => {
            datalist[i].parentNode.style.backgroundColor = ''
        })
        searchResultBox.appendChild(tmp)
    }
}