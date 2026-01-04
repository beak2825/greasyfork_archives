// ==UserScript==
// @name         Acfun_UP稿件搜索
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  来点稿件搜索
// @author       幽想
// @match        https://www.acfun.cn/u/*
// @license      GNU GPLv3
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      member.acfun.cn
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.0.18/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/440321/Acfun_UP%E7%A8%BF%E4%BB%B6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/440321/Acfun_UP%E7%A8%BF%E4%BB%B6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

var searchPage = 0;

if (!GM_getValue('showSearchCount')) {
    GM_setValue('showSearchCount',20);
}
if (!GM_getValue('searchDefType')) {
    GM_setValue('searchDefType',0);
}
var searchDefType = GM_getValue('searchDefType');
var count = GM_getValue('showSearchCount');

GM_addStyle(`
    #yx_search_main{
        flex-wrap: wrap;
        overflow: visible;
        justify-content: center;
    }
    .yx_search-video,.yx_search-article{
        padding: 0.75rem;
        display: flex;
        border-bottom: 1px solid #ececec;
        transition: all 0.3s ease-in-out;
        max-height: 90px;
        align-items: center;
        background-color: white;
        border-radius: 5px;
    }
    .yx_search-video:hover{
        transform: scale(1.01);
        background-color: lightgrey;
    }
    .yx_search-article{
        width: 47%;
    }
    .yx_search-article:hover{
        transform: scale(1.05);
        background-color: #f3f3f3;
        border: 2px solid #fd4c5d;
    }
    .yx_svideo_main{
        margin-left: 20px;
        display: flex;
        width: 100%;
        flex-wrap: wrap;
    }
    .yx_svideo_main_title{
        font-size: 1.1rem;
        font-weight: bold;
        width: 100%;
    }
    .yx_svideo_main_info{
        font-size: 1rem;
        width: 100%;
        height: 100%;
        margin-top: 1rem;
    }
    .yx_search_keyWord{
        padding-top: 0.5rem;
        height: 30px;
        display: flex;
        justify-content: flex-end;
    }
    .yx_search_keyWord_main{
        border: 1px solid #ccc;
        display: flex;
        width: fit-content;
    }
    .yx_search_keyWord_main > input{
        outline-style: none;
        border: 0;
        padding: 0.3rem;
        border-right: 1px solid #ccc;
        width: 18rem;
    }
    .yx_search_keyWord_main > div{
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0px 0.3rem;
        transition: all 0.3s ease-in-out;
        background: white;
    }
    .yx_search_keyWord_main > div:hover{
        background: #fd4c5b;
        color: white;
        transform: scale(1.1);
    }
    #yx_searchBtn_Video{
        border-right: 1px solid #ccc;
    }
    #yx_search_pager{
        margin-top: 0.7rem;
        display: flex;
        justify-content: center;
    }
    .yx_search_aComment{
        float: left;
        width: 130px;
        margin-top: -1px;
        text-align: right;
        font-size: 14px;
        line-height: 14px;
        color: #999;
        cursor: pointer;
    }
    .yx_search_aComment_count{
        font-size: 28px;
        line-height: 28px;
        color: #fd4c5d;
        margin-bottom: 7px;
    }
    #yx_search_settings{
        border-right: 1px solid #ccc;
    }
    #yx_search_settings:hover svg{
        animation: 1s rotate180;
    }
    @keyframes rotate180 {
        from { transform: rotate(0deg); }
        to   { transform: rotate(180deg); }
    }
`)

function toast_info (t,timer = 2000) {
    Swal.fire({
        icon:'info',
        title:t,
        showConfirmButton: false,
        toast: true,
        timer: timer
    });
}
function toast_error (t,timer = 2000) {
    Swal.fire({
        icon:'error',
        title:t,
        showConfirmButton: false,
        toast: true,
        timer: timer
    });
}

function gensHTML_v (acid,coverUrl,title,infos) {
    const content = `
<div class="yx_search-video">
    <div class="yx_svideo_cover">
        <a href="/v/ac${acid}" target="_blank">
            <img src="${coverUrl}" alt="" onerror="onImageError(event, '?imageView2/1/w/160/h/90')">
        </a>
    </div>
    <div class="yx_svideo_main">
        <div class="yx_svideo_main_title">
            <a href="/v/ac${acid}" target="_blank">${title}</a>
        </div>
        <div class="yx_svideo_main_info">
            <p>${infos}</p>
        </div>
    </div>
</div>`
    return content;
}

function gensHTML_a (acid,commentCount,title,infos) {
    const content = `
<div class="yx_search-article">
    <div class="yx_svideo_cover">
        <a href="/a/ac${acid}" target="_blank">
            <div class="yx_search_aComment">
                <div class="yx_search_aComment_count">${commentCount}</div>
                <span>评论</span>
            </div>
        </a>
    </div>
    <div class="yx_svideo_main">
        <div class="yx_svideo_main_title">
            <a href="/a/ac${acid}" target="_blank">${title}</a>
        </div>
        <div class="yx_svideo_main_info">
            <p>${infos}</p>
        </div>
    </div>
</div>`
    return content;
}

function updateNum (n) {
    let div = document.querySelector('#yx_search_TotalNum');
    if (!!div) {
        div.textContent = n;
    }
}

function addPager (np,tp,kw,rt) {
    if (tp==1){
        return;
    }
    let e = document.createElement('div');
    let prev = '';
    let next = '';
    if (np == 0) {
        prev = 'pager__btn__disabled';
    }
    if (np == tp-1) {
        next = 'pager__btn__disabled';
    }
    let content = `<div id="yx_search_pager" class="pager__wrapper">
    <a class="pager__btn pager__btn__prev ${prev}" id="yx_search_pager_prev">上一页</a><span class="pager__ellipsis">${np+1} / ${tp}</span>
    <a class="pager__btn pager__btn__next ${next}" id="yx_search_pager_next">下一页</a><div class="pager__input">跳至<input type="text" id="yx_search_pager_input">页</div></div>`;
    append2Div(content);
    document.querySelector('#yx_search_pager_prev').addEventListener('click',function(){
        if (document.querySelector('#yx_search_pager_prev').classList.contains('pager__btn__disabled')) {
            return;
        }
        search(kw,np-1,rt);
    });
    document.querySelector('#yx_search_pager_next').addEventListener('click',function(){
        if (document.querySelector('#yx_search_pager_next').classList.contains('pager__btn__disabled')) {
            return;
        }
        search(kw,np+1,rt);
    });
    document.querySelector('#yx_search_pager_input').addEventListener('keypress',function(e){
        if (e.keyCode == 13) {
            let page = Number(document.querySelector("#yx_search_pager_input").value) - 1;
            if (page+1 > tp) {
                toast_error('超出页数范围，最大页数为 ' + tp);
                return;
            }
            search(kw,page,rt);
        }
    });
}

function append2Div (v) {
    let tdiv = document.querySelector('#yx_search_main');
    if (!tdiv) {
        //更新，报错
        toast_error('出错,搜索结果面板异常,请刷新页面重试。');
        return;
    }
    let n = document.createElement('div');
    tdiv.appendChild(n);
    n.outerHTML = v;
}

function clearSearchPanel () {
    document.querySelector("#yx_search_main").innerHTML = '';
}

async function getKW (uid,keyword,page = 0,rtype = 2,stype = 3) {//返回JSON
    let res = await gm_xhr('POST','https://member.acfun.cn/list/api/queryContributeList',`pcursor=${page}&count=${count}&resourceType=${rtype}&sortType=${stype}&authorId=${uid}&keyword=${keyword}`);
    if (!!res) {
        res = res.responseText;
    };
    let j = null;
    try {
        j = JSON.parse(res);
    } catch (e) {
    };
    return j;
}

async function search (keyword,page = 0,rtype = 2, append = false) {
    if (!append) {
        clearSearchPanel();
    }
    toast_info('正在获取数据…',1000);
    let uid;
    try {
       uid = document.URL.match(/acfun.cn\/u\/(.*)/)[1];
    } catch {
        toast_error('uid获取出错');
        console.log('uid获取出错');
        return;
    }
    let j = await getKW (uid,keyword,page,rtype);
    if (j == null) {
        toast_error('API返回信息出错');
        console.log('返回信息出错');
        return;
    }
    //console.log(j)
    if (j.totalNum == 0) {
        toast_info('未找到相关稿件');
        console.log('未找到相关稿件');
        return;
    };
    updateNum(j.totalNum);
    let arr = j.feed;
    let content;
    arr.forEach(function(v){
        if (rtype == 2) {
            let resizeCoverUrl = v.coverUrl.replace('?imageslim',`?imageView2/1/w/160/h/90|imageMogr2/auto-orient/format/webp/quality/80!/ignore-error/1`);
            //console.log(resizeCoverUrl);
            content = gensHTML_v(v.dougaId,resizeCoverUrl,v.title,`播放:${v.viewCountShow} 评论:${v.commentCount} 弹幕:${v.danmakuCount} 时间:${v.createTime}`);
        }
        if (rtype == 3) {
            let otime = v.contributeTime;
            let ntime = getTime_Unix(otime);
            content = gensHTML_a(v.contentId,v.commentCount,v.contentTitle,`浏览:${v.viewCountShow} 时间:${ntime}`);
        }
        if (!!content) {
            append2Div(content);
        }
    });
    if (rtype == 2) {
        document.querySelector('#yx_search_main').style.display = '';
    }
    if (rtype == 3) {
        document.querySelector('#yx_search_main').style.display = 'flex';
    }
    addPager(page,Math.ceil(j.totalNum/count),keyword,rtype);
    document.querySelector("#yx_search_li").click();
}

function getTime_Unix (unix) {
    unix = Number(unix);
    let le = unix.toString().length;
    if (le == 10) {//10为unix则乘1000
        unix = unix * 1000;
    }
    let time = new Date(unix);
    return time.getFullYear() + '/' + (time.getMonth()+1) + '/' + time.getDate();
}

function changeSearchDefType (v) {
    GM_setValue('searchDefType',v);
    searchDefType = v;
}

function showSettings () {
    Swal.fire({
        title: '稿件搜索栏设置',
        html:
          `<div style="border-bottom: 1px solid lightblue;padding-bottom: 1rem;display: flex;flex-wrap: wrap;justify-content: center;">
          <p style="text-align: left;width: 100%;font-weight: bold;color: black;">回车键默认搜索</p>
          <div style="margin-right: 3rem;"><input type="radio" name="defSerchType" id="yx_search_settings_defVideo"><span>视频</span></div>
          <div><input type="radio" name="defSerchType" id="yx_search_settings_defArticle"><span>文章</span></div>
      </div>
      <div style="border-bottom: 1px solid lightblue;padding: 1rem 0;display: flex;flex-wrap: wrap;justify-content: center;">
          <p style="text-align: left;width: 100%;font-weight: bold;color: black;">检索结果每页显示数量</p>
            <div>
              <input class="swal2-input" style="width: 7rem;text-align: center;" type="text" maxlength="2" id="yx_search_settings_showCountForSPage">
              <p>(1-99)</p>
            </div>
      </div>
      <p style="width: 100%;margin-top: 1rem;color: black;">设置将实时保存</p>
      `,
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        didOpen: function () {
            //导入默认配置
            if (GM_getValue('searchDefType') == 1) {
                document.querySelector("#yx_search_settings_defArticle").checked = true
            } else {
                document.querySelector("#yx_search_settings_defVideo").checked = true
            };
            document.querySelector("#yx_search_settings_showCountForSPage").value = count;
            //实现按钮效果
            document.querySelector("#yx_search_settings_defVideo").addEventListener('click',function(){
                changeSearchDefType(0);
            });
            document.querySelector("#yx_search_settings_defArticle").addEventListener('click',function(){
                changeSearchDefType(1);
            });
            document.querySelector("#yx_search_settings_showCountForSPage").addEventListener('keyup',function(){
                let text = document.querySelector("#yx_search_settings_showCountForSPage").value;
                text = text.replace(/[^\d]/g,'');
                let num = Number(text);
                num = Math.floor(num);
                if (!num || text.includes('.')) {
                    alert('输入了非法字符\n(只能输入数字,不可输入小数点)');
                    document.querySelector("#yx_search_settings_showCountForSPage").value = '';
                    return;
                };
                if (num < 1) {
                    alert('数量区间在1-99');
                    document.querySelector("#yx_search_settings_showCountForSPage").value = '1';
                };
                count = num;
                GM_setValue('showSearchCount',num);
            });
        },

    })
      
}

function init () {
    let tagsDiv = document.querySelector("ul.tags");
    let n = document.createElement('li');
    tagsDiv.insertBefore(n,tagsDiv.lastElementChild)
    n.outerHTML = `<li data-index="yx_search" data-count="0" id="yx_search_li">搜索结果<span id="yx_search_TotalNum">0</span></li>`;
    let contentDiv = document.querySelector("div.ac-space-contribute-list");
    let n1 = document.createElement('div');
    n1.setAttribute('data-index','yx_search');
    n1.setAttribute('id','yx_search_main');
    n1.setAttribute('class','tag-content');
    contentDiv.appendChild(n1);
    let contributeDiv;
    document.querySelectorAll("#ac-space > div.wp > div.tab-content").forEach(function(v){
        if (v.getAttribute('tab-index') == 'contribute') {
            contributeDiv = v;
        }
    })
    let n2 = document.createElement('div');
    contributeDiv.insertBefore(n2,contributeDiv.firstChild);
    n2.outerHTML = `<div class="yx_search_keyWord"><div class="yx_search_keyWord_main"><div id="yx_search_settings"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"></path><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"></path></svg></div><input id="yx_search_keyWordInput" autocomplete="off"><div id="yx_searchBtn_Video">搜索视频</div><div id="yx_searchBtn_Article">搜索文章</div></div></div>`;
    document.querySelector("#yx_search_keyWordInput").addEventListener('keypress',function(e){
        if (e.keyCode == 13) {
            if (searchDefType == 0) {//检索视频
                search(document.querySelector("#yx_search_keyWordInput").value);
            } else {//检索文章
                search(document.querySelector("#yx_search_keyWordInput").value,0,3);
            }
        }
    })
    document.querySelector("#yx_searchBtn_Video").addEventListener('click',function(){
        search(document.querySelector("#yx_search_keyWordInput").value);
    });
    document.querySelector("#yx_searchBtn_Article").addEventListener('click',function(){
        search(document.querySelector("#yx_search_keyWordInput").value,0,3);
    });
    document.querySelector("#yx_search_settings").addEventListener('click',function(){
        showSettings();
    })
}

function xhrAsync(method,url,data,headers) {//发出请求
    if (!data) {
        data = null;
    };
    if (!headers) {
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: method,
            url: url,
            data: data,
            headers: headers,
            onload: resolve
        });
    });
}

function delayAsync(time) {//超时返回
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

async function gm_xhr(method,url,data,headers) {
    console.log("发起请求…");
    return xhrAsync(method,url,data,headers).then(response => {//返回xhr请求结果
        if (response.responseText == "未响应" || response.responseText.includes("ERRO")) {
            return null;
        } else {//正常获得返回数据
            console.log('获得数据…');
            return response;
        }
    });
}

window.onload = function() {
    init();
}
