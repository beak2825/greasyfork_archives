// ==UserScript==
// @name         TBe+ 新闻自动点赞
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      Apache-2.0
// @description  自动点赞!!
// @author       s1n1
// @match        https://ejia.tbea.com/*
// @match        https://tbeanews.tbea.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACUUlEQVR4nO2ZgW3aQBSG37tUqmltRDegG7BBkw3oBHUWIM4EJRPUsEDIBA0TFCYImSDtBKWYFiMld/3PCpXVpMbgI+FJ/STrniU433d+Zx5nJuHsTOD1PGrdaXOCkFiZiTlQw7QWfyXH7ESgYaLGItE36L2B0xwcL4PeKQJn7ESgNo8ibfQnhA9g4lEa9I4QOoFxOMdLOiND9A7hozCr49SPB+SAnQi8TDoGTRHDZdBvo62Mc4Es/+f6O8JCIODk2k46yeMl0aEh/QVhIXsr8GoWte9Yf0ZYyN4KeLPOwDB9QFjIPgvcQKBJa9hLAW8ehcboc4TruIZAC21lnAnYp0+a6Ksysw+GEGijrQzjcII3Ozk3bEIqAS56lgb9LjkAfVVng9TJODDq/a96fImwMpUFbNV5a/QVwtLwC/XWVWVaSSAbvMaP1oOqswDDP5b1XvnPr2Frga0GD3DBMfL/kByB/jZn05zPY8tp3AYc28FMU0Vq/NOPJzhFfxuCUvmjIerSs8OXNZ+PeV3pC8Mz3PIugbKF2lNhxyZdYPxf4DlhQxeiBRSrU9ECTOpItAAqWpYscA2BllgBu4DTej8UK2AX8MKPY7ECdgGnQTwSK4D8x9AwPqEC2QJGK1NgtYAJyBTI7W7LFMj9pxYngPT5hvRp0j0SBS4gENI98gRy+W8RJ1Dz1Zspx1OEGdIEhnj+t9H+QZTA3+ljkSOAHb1awM18+ljECOTHkUeGwD9m3yJC4LHcX8HYKhxREawGqy97i6hJtzqkJ0QZNSl6l4AJls1vxejNmo+FR/8AAAAASUVORK5CYII=
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/518876/TBe%2B%20%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/518876/TBe%2B%20%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function initStyles() {
    let style = document.createElement("style");
    let txt=`.auto-digg-div { height:100px;width:100px;position:fixed;bottom:0;right:0;background:#3cbaff}`;
    txt+=`.auto-digg-div-msg {color:#000;font-size:14px}`;
    style.appendChild(document.createTextNode(txt));
    document.head.appendChild(style);
})();

function setNewsTotalCount(value) {
    if (value !== undefined) {
        GM_setValue('totalCount', value);
        return value;
    }

    return GM_getValue('totalCount', 0);
}

function diggCount(value) {
    if (value !== undefined) {
        GM_setValue('diggCount', value);
        return value;
    }

    return GM_getValue('diggCount', 0);
}


function thisDiggCount(value) {
    if (value !== undefined) {
        GM_setValue('thisDiggCount', value);
        return value;
    }

    return GM_getValue('thisDiggCount', 0);
}

function setMsg(value) {
    if (value !== undefined) {
        GM_setValue('msg', value);
        return value;
    }

    return GM_getValue('msg', '');
}

function initListener(){
    setMsg('')
    setNewsTotalCount(0)
    diggCount(0)
    thisDiggCount(0)
    GM_addValueChangeListener(
        'msg',
        function (name, oldValue, newValue, remote) {
            let msgEle=document.getElementsByClassName('auto-digg-div-msg');
            msgEle[0].innerText=newValue;
        }
    );
    GM_addValueChangeListener(
        'totalCount',
        function (name, oldValue, newValue, remote) {
            let totalCountEle=document.getElementsByClassName('total-count-span');
            totalCountEle[0].innerText=newValue;
        }
    );
    GM_addValueChangeListener(
        'diggCount',
        function (name, oldValue, newValue, remote) {
            let diggCountEle=document.getElementsByClassName('digg-count-span');
            diggCountEle[0].innerText=newValue;
        }
    );
    GM_addValueChangeListener(
        'thisDiggCount',
        function (name, oldValue, newValue, remote) {
            let diggCountEle=document.getElementsByClassName('this-digg-count-span');
            diggCountEle[0].innerText=newValue;
        }
    );
}

/**
 * 向页面中添加div
 * @param className   类名
 * @param innerHtml   内容
 * @param clickFunc   点击事件函数
 * @returns {HTMLDivElement}
 */
function addDivEle(className = '', innerHtml = '', clickFunc = false, parentSelector = '') {
  // console.log('addDivEle.className', className)
  let div = document.createElement('div')
  div.className = className
  div.innerHTML = innerHtml
  if (typeof clickFunc == 'function') {
    div.onclick = clickFunc
  }
  // console.log('addDivEle.parentSelector', parentSelector)
  if (parentSelector.length > 0) {
    document.querySelector(parentSelector).append(div)
  } else {
    document.body.append(div)
  }
  return div
}

function joinFormDataStr(obj){
    let str='';
    if(obj){
        for(let key in obj){
            str+=key+'='+obj[key]+'&';
        }
        str=str.substring(0,str.length-1);
    }
    return str;
}

/**
 * 获取近30天的新闻资讯
 */
function getNewsList(day){
    let formData={
        'groupId': 'XT-65494635bd8c554a12af71a8-XT-2bb8a866-d2a3-47da-bbad-8c63db21e9b6',
        'type': "new",
        'count':day
    }
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://ejia.tbea.com/im/rest/message/listMessage",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data:joinFormDataStr(formData),
        onload: function(response) {
            let result=JSON.parse(response.responseText)
            if(result.success){
                setMsg('新闻资讯列表加载成功');
                let totalCount=0;
                for(let dayNewsItem of result.data.list){
                    for(let news of dayNewsItem.param.list){
                        totalCount++;
                        let id=getUrlParam(news.url,'id');
                        queryIsDigg(id);
                    }
                }
                setNewsTotalCount(totalCount);
            }else{
                setMsg('新闻资讯列表加载失败');
            }
        }
    });
}

function getUrlParam(url,paramName){
    const regex = new RegExp('[?&]' + paramName + '(=([^#&]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * 查询是否点赞
 */
function queryIsDigg(id){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://tbeanews.tbea.com/api/article/detail?id="+id,
        onload: function(response) {
            let result=JSON.parse(response.responseText);
            let isDigg=result.data.is_digg;
            //console.log(111,isDigg)
            if(isDigg){
                let dc= diggCount()
                diggCount(dc+1);
            }else{
                doDigg(id);
            }
        }
    });
}


/**
 * 进行点赞
 */
function doDigg(id){
    let data={
        id
    }
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://tbeanews.tbea.com/api/article/addDigg",
        headers: {
            "Content-Type": "application/json"
        },
        data:JSON.stringify(data),
        onload: function(response) {
            //console.log(111,response.responseText)
            let result=JSON.parse(response.responseText);
            if(result.code==1){
                let dc= diggCount()
                diggCount(dc+1);
                let this_dc= thisDiggCount()
                thisDiggCount(this_dc+1);
            }
        }
    });
}

function createAutoDiggDiv(){
    let autoDiggDiv = addDivEle('auto-digg-div','<span class="auto-digg-div-msg"></span>');
    let diggCountDiv = document.createElement('div');
    diggCountDiv.className = 'digg-count-div';
    let diggLabel=document.createElement('span');
    diggLabel.innerText='点赞/总数：';
    diggCountDiv.appendChild(diggLabel);
    let diggCountSpan = document.createElement('span');
    diggCountSpan.className = 'digg-count-span';
    diggCountSpan.innerText = '0';
    diggCountDiv.appendChild(diggCountSpan);
    let xiegang=document.createElement('span');
    xiegang.innerText= '/';
    diggCountDiv.appendChild(xiegang);
    let totalCountSpan = document.createElement('span');
    totalCountSpan.className = 'total-count-span';
    totalCountSpan.innerText = '0';
    diggCountDiv.appendChild(totalCountSpan);

    let thisDiggCountDiv = document.createElement('div');
    thisDiggCountDiv.innerText = '本次自动点赞：';
    let thisDiggCountSpan = document.createElement('span');
    thisDiggCountSpan.className = 'this-digg-count-span';
    thisDiggCountSpan.innerText = '0';
    thisDiggCountDiv.appendChild(thisDiggCountSpan);

    autoDiggDiv.appendChild(diggCountDiv);
    autoDiggDiv.appendChild(thisDiggCountDiv);
}

(function() {
    'use strict';
    //登录后的首页
    if(window.location.href=='https://ejia.tbea.com/yzj-layout/home/'){
        createAutoDiggDiv();
        initListener();
        getNewsList(30);
    }
})();

