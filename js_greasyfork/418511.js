// ==UserScript==
// @name         markList Script
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  special Follows!
// @author       行亦难

// @match        https://*.summer-plus.net/*
// @match        https://*.level-plus.net/*
// @match        https://*.white-plus.net/*
// @match        https://*.south-plus.net/*
// @match        https://*.imoutolove.me/*

// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/418511/markList%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/418511/markList%20Script.meta.js
// ==/UserScript==

// 最大条数
var max_count = 100;

(function() {
    'use strict';

    //use tools

    if(!jQuery){
        console.log('没获取到jq');
        return;
    }

    home_element();
    home_event();
    if(window.location.pathname.includes('index.php') || window.location.pathname == '/'){
        console.log('首页')

    }else if(window.location.pathname == '/u.php'){
        console.log('用户信息')

    }else if(window.location.pathname == '/read.php'){
        console.log('帖子详情')
        // if(jQuery('a[href$="fid-48.html"].gray3').length){
        if(jQuery('.crumbs-item.gray3').text().includes('询问&求物')){
            page_element();
        }

    }else{
        console.log('其他页面')
    }

    //initTempDiv(`/read.php?tid-1020134.html`)
    // Your code here...
})();

function home_event(){
    // 获取元素和初始值
    let oBox = document.querySelector('.div1'),
        disX = 0, disY = 0;
    let div2 = document.querySelector('.div2');
    let close2 = document.querySelector('.c-close');
    let open2 = document.querySelector('.c-open');
    let refresh = document.querySelector('.refresh-btn');
    let loader = document.querySelector('.c-loader');



    // 容器鼠标按下事件
    oBox.onmousedown = function (e) {
        let ev = e || window.event;
        disX = ev.clientX - this.offsetLeft;
        disY = ev.clientY - this.offsetTop;
        document.onmousemove = function (e) {
            let ev = e || window.event;
            oBox.style.left = (ev.clientX - disX) + 'px';
            oBox.style.top = (ev.clientY - disY) + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };
    // 事件不冒泡
    div2.onmousedown = (event) => {
        event.stopPropagation();
    }
    close2.onclick = () => {
        oBox.style.display = 'none';
        open2.style.display = 'block';
    }
    open2.onclick = (event) => {
        oBox.style.display = 'block';
        //event.target.style.display = 'none';
        jQuery('.c-open').hide()
    }
    refresh.onclick = () => {
        while (document.querySelector('.c-item')) {
            document.querySelector('.c-item').remove();
        }

        loader.style.display = 'block';
        refresh.style.display = 'none';

        let mark_map = GM_getValue('mark_map') ? GM_getValue('mark_map') : new Object();
        let arr_p = []
        for(let item in mark_map){
            arr_p.push(initTempDiv(`/read.php?tid=${item}`, item));
        }
        Promise.all(arr_p).then((res)=>{

            console.log(res);

            for(let i of res){
                if(i.isAnswer){
                    mark_map[i.id].isAnswer = true;
                }else{
                    mark_map[i.id].isAnswer = false;
                }
            }
            GM_setValue('mark_map', mark_map);

            loader.style.display = 'none';
            refresh.style.display = 'block';
            addHomeList();
        })
        console.log('循环结束')
        return;
        //GM_setValue('mark_map', mark_map);
        setTimeout(() => {
            loader.style.display = 'none';
            refresh.style.display = 'block';
            addHomeList();
        }, 2000)
    }
    // 清空已读
    let reset2 = document.querySelector('.c-reset');
    reset2.onclick = () => {
        let mark_map = GM_getValue('mark_map');
        if(mark_map){
            let arr_temp = []
            for(let i in mark_map){
                if(mark_map[i].rank == 2){
                    arr_temp.push(mark_map[i])
                    delete mark_map[i];
                }
            }
            if(arr_temp.length > 0){
                GM_setValue('mark_map', mark_map);
                while (document.querySelector('.c-item')) {
                    document.querySelector('.c-item').remove();
                }
                addHomeList();
            }
        }
    }
}
function home_element(){
    // 初始化悬浮窗节点
    let cssDiv = document.createElement('style');
    cssDiv.innerHTML = initCss();
    //let nTable = document.querySelector('#main .t table');
    //nTable.appendChild(cssDiv);
    let $ = jQuery;
    $('#toptool').append($(cssDiv))
    $('#toptool').append($(initHtml()))

    // 12.12更新
    $('#guide').prepend($('.c-open'));

    // 缓存中读取列表
    addHomeList()

}


function page_element(){

    let $ = jQuery;

    $('#toptool').append($(initMark()));
    // 12.12更新

    let tizName = $('strong [href^=read]').text();
    let tizUrl = window.location.pathname + window.location.search;
    let tizId = tizUrl.match(/[0-9]+/).toString();
    // 加强匹配
    //let isAnswer = Boolean($('.tpc_content:eq(3) .s3').length);
    let isAnswer = false;
    if($('.tpc_content:eq(3) .s3').length){

        if($('.tpc_content:eq(3) .s3').text().includes('最佳答案奖励')){
            isAnswer = true
        }
    }else{
        isAnswer = false;
    }

    let map = GM_getValue('mark_map') ? GM_getValue('mark_map') : new Object();

    $('.t3').prepend($('.c-mark'));

    let flag = true

    for(let key in map){
        if(key === tizId){
            flag = false;
            $('.c-mark').addClass('unmark').text('已 Mark');
        }
    }


    // 点击mark
    $('.c-mark').click((event)=>{
        console.log($(event.target));
        console.log(flag);
        flag=!flag;

        //console.log(tizName, tizUrl, tizId, isAnswer)

        map[tizId] = {tizName, tizUrl, tizId, isAnswer, rank: isAnswer?0:1}

        if(flag){
            $('.c-mark').removeClass('unmark').text('Mark');
            delete map[tizId];
            GM_setValue('mark_map', map);
        }else{
            $('.c-mark').addClass('unmark').text('已 Mark');
            if(Object.keys(map).length > max_count){
                return
            }
            GM_setValue('mark_map', map);
        }
    })
}

function addHomeList(){
    // 缓存中读取列表
    let $ = jQuery;
    let mark_map = GM_getValue('mark_map') ? GM_getValue('mark_map') : new Object();

    if(!Object.keys(mark_map).length){
        $('.c-items').append($(`
                <div class="c-item">
                    <a href="">
                        没有mark了~
                    </a>
                </div>`))
    }


    let arr = [];
    for (let key in mark_map) {
        arr.push(mark_map[key]);
    }
    if (arr.length > 0) {
        if (arr.length > 1) {
            arr.sort(function (a, b) {
                return  a.rank -  b.rank;
            })
        }
        for(let item of arr){
            let str = `<div class="c-item" data-id="${item.tizId}">
                <span class="isRead">${item.rank == 2 ? '[已读]' : ''}</span>
                <a href="${item.tizUrl}" class="c-item-text" data-id="${item.tizId}" target="_blank">
                    ${item.tizName}
</a>
                <b class="answer">${item.isAnswer ? '[有答案]' : ''}</b>
                <strong><a href="javascript:void(0);" class="c-del">[删除]</a></strong>
            </div>`
            $('.c-items').append($(str))
        }
    }

    $('.c-del').click(function(event){
        //删除marke
        let item = $(event.target).parent().parent();
        console.log(item.data())
        if(item.data().id){
            item.remove()
            //console.log(mark_map)
            delete mark_map[item.data().id]
            GM_setValue('mark_map', mark_map);
        }
    })

    //点击有答案的，标记已读
    $('.c-item-text').on('click', function(event){

        console.log($(event.target).data())
        let id = $(event.target).data().id
        if(id && mark_map[id].isAnswer){
            $('.c-items').append($(event.target).parent())
            mark_map[id].rank = 2;
            GM_setValue('mark_map', mark_map);
            $(event.target).parent().find('.isRead').text('[已读]');
        }

    })
}
function delItem(id){

}

async function initTempDiv(url, id){
    // 创建缓存节点，解析文本形式的html
    let $ = jQuery;
    let p1 = await getPageData(url);
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = p1;

    let tic = $(tempDiv)
    //let flag = tic.find('.tpc_content:eq(3) .s3').get(0)

    let flag = false;
    if(tic.find('.tpc_content:eq(3) .s3').length){

        if(tic.find('.tpc_content:eq(3) .s3').text().includes('最佳答案奖励')){
            flag = true
        }
    }else{
        flag = false;
    }

    if(flag){
        console.log(flag)
        return {isAnswer:Boolean(flag), id};
    }else{
        console.log('无')
        return {isAnswer: false, id};
    }

}
// 获取求物区的帖子数据
function getPageData(url){
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
                resolve(xhr.responseText)
            }
        }
        xhr.send();
    })
}



function initHtml(){
    return `<div class="div1">
        <span>&nbsp;&nbsp;此处拖动</span><span>&nbsp;&nbsp;>>>> Mark列表</span>
        <span class="btn c-close">缩小</span>
        <span class="btn c-reset">清空已读</span>
        <div class="div2">
            <div class="c-items">
            </div>
            <div class="c-loader">
                <div class="loader">Loading...</div>
            </div>
        </div>
        <div class="refresh-btn">

            <span class="btn">刷新</span>

        </div>
    </div>
    <li class="c-open">
      <a  href="javascript:void(0);">Mark列表</a>
    </li>`
}
function initMark(){
    return `<div class="c-mark btn">Mark</div>`
}
function initCss() {
    // 初始化样式
    let textCss = `
        .div1 {
            width: 20vw;
            min-height: 100px;
            max-height: 75vh;
            position: fixed;
            right: 0;
            top: 30%;
            padding-top: 20px;
            border-radius: 5px;
            overflow-x: hidden;
            overflow-y: scroll;
            z-index: 999;
            text-align: left;
            cursor: pointer;
            display:none;
            background-color: white;
            border: 1px solid black;
        }
        .c-open{
            cursor: pointer;
            float: left;
        }
       .refresh-btn{
            height: 20px;
            padding: 8px;
            width: max-content;
        }
        .div2 {
            margin-top: 20px;
            min-height: 200px;
            background-color: white;
            border-bottom: 1px solid;
            border-top: 1px solid;

        }

        .c-close, .c-reset {
            cursor: pointer;
            float: right;
            margin-right: 5px;
            padding: 2px 10px;
        }

        .c-item {
          line-height: 24px;
          border-bottom: 1px dashed;
          padding: 0 0 0 3px;
        }
        .c-mark{
            cursor: pointer;
            float: right;
            color: white;
            width: 83px;
            height: 25px;
            line-height: 25px;
            margin: 0 5px;
            font-size: 18px;
            border-radius: 3px;
            text-align: center;
            position: relative;
            z-index: 1;
            overflow: hidden;
            box-shadow: 0rem 0.25rem 0.25rem rgb(45, 50, 58);
            cursor: pointer;
            transition: all 200ms ease;
        }
        .unmark{
          filter: grayscale(100%);
        }

        .answer {
         color:red;
         }

        .c-loader {
            display: none;
        }

        .loader {
            color: yellow;
            font-size: 60px;
            text-indent: -9999em;
            overflow: hidden;
            width: 1em;
            height: 1em;
            border-radius: 50%;
            margin: 0px auto;
            position: relative;
            -webkit-transform: translateZ(0);
            -ms-transform: translateZ(0);
            transform: translateZ(0);
            -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
            animation: load6 1.7s infinite ease, round 1.7s infinite ease;
        }

        @-webkit-keyframes load6 {
            0% {
                box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
            }

            5%,
            95% {
                box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
            }

            10%,
            59% {
                box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
            }

            20% {
                box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
            }

            38% {
                box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
            }

            100% {
                box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
            }
        }

        @keyframes load6 {
            0% {
                box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
            }

            5%,
            95% {
                box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
            }

            10%,
            59% {
                box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
            }

            20% {
                box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
            }

            38% {
                box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
            }

            100% {
                box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
            }
        }

        @-webkit-keyframes round {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @keyframes round {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }`;
    return textCss;
}