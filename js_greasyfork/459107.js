// ==UserScript==
// @name         OurXes
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  更改并美化code.xes.com
// @license      GPL-3.0
// @author       林林
// @match        https://code.xueersi.com/*
// @icon         https://static0.xesimg.com/talcode/assets/logo.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459107/OurXes.user.js
// @updateURL https://update.greasyfork.org/scripts/459107/OurXes.meta.js
// ==/UserScript==
const style = document.createElement("style");
style.innerHTML = /*
    div .layout[data-v-704641f8] {
        background-color:rgba(16,16,16,0.5) !important;
    }*/
    `
    @keyframes sssd1{
        100% {background-color: rgba(255,255,255,0.8); border-radius: 10px;text-shadow:2px 2px 5px rgba(128,255,128,1);font-size: 22px;}
    }
    .sbbbd{
        z-index:900;
        position: fixed;
        right:40px;
        color: rgba(0,255,0,0.5);
        font-size: 20px;
        border-radius: 5px;
        background-color: rgba(255,255,255,0.5);
        font-weight: 900;
        text-decoration: none;
    }
    .sbbbd:link {
        background-color: rgba(255,255,255,0.5);
    }
    .sbbbd:visited {
        background-color: rgba(255,255,255,0.5);
    }
    .sbbbd:hover {
        animation:sssd1 0.25s;
        animation-fill-mode: forwards;
        animation-iteration-count:1;
    }
    .ace_text-input {
        color: #333;
        caret-color: red;
    }
    @supports (-webkit-mask: none) and (not (caret-color: red)) {
        .ace_text-input { color: red; }
        .ace_text-input::first-line { color: #333; }
    }
    `
/*
    header {
        background-color:rgba(255,255,255,0.5) !important;
    }
    body{
        background-color:rgba(16,16,16,0.5) !important;
    }
    main {
        background:rgba(0,0,0,0) !important;
    }
    .project-detail-container .detail-content{
        border-radius: 20px !important;
        background:#707070 !important;
    }
    .side-bar{
        border-radius: 20px;
        background:rgba(255,255,255,0.7) !important;
    }
    .message-container[data-v-262188f0]{
        border-radius: 20px;
        background:rgba(255,255,255,0.7) !important;
    }
    .message-con{
        border-radius: 20px;
        background:rgba(255,255,255,0.7) !important;
    }
    .show-area .project-group {
        border-radius: 20px;
        background:rgba(255,255,255,0.8) !important;
    }
    .user-tabs {
        border-radius: 20px !important;
        background:rgba(255,255,255,0.8) !important;
    }
    .card {
        border-radius: 20px;
        background:#dedede !important;
    }
    .pagination-con .pagination ul li[data-v-7a0a2b29] {
        border: 2px solid rgba(128,128,128,1) !important;
        border-radius: 10px !important;
        background:rgba(255,255,255,0.8) !important;
    }
    .guess-like-content{
        border-radius: 10px !important;
        background:rgba(255,255,255,0.8) !important;
    }
    .homepages .user-introduction[data-v-9fe8f08e] {
        background-image: none !important;
        background-color:rgba(0,0,0,0.5) !important;
    }
    .user-pages .user-page-title h2 span[data-v-d3f2a2b4]{
        color:rgba(255,255,255,0.9) !important;
    }
    .personal-card .personal-title[data-v-5c6f5b6e] {
        color:rgba(255,255,255,0.9) !important;
    }
    .personal-card .personal-thumbnail[data-v-5c6f5b6e] {
        border-radius: 5% !important;
    }
    .homepages .user-introduction .user-info .user-icon[data-v-9fe8f08e] {
        border-radius: 5% !important;
    }
    .homepages .user-introduction .user-info[data-v-9fe8f08e] {
        border-radius: 5% !important;
    }
    .follow-piece .follow-thumbnail[data-v-edbdbf26] {
        border-radius: 5% !important;
    }
    h1[data-v-c3da3842] {
        color:rgba(255,255,255,0.9) !important;
    }
    .project-statistics {
        border-radius: 10px !important;
        background-color:rgba(255,255,255,0.5) !important;
    }
    .pagination-con .pagination ul li.active[data-v-7a0a2b29] {
        color:rgba(0,0,0,1) !important;
        border: 2px solid rgba(255,255,255,1) !important;
    }
    .comment-piece .comment-detail .user-info .user-name[data-v-57385c10] {
        color:rgba(255,255,255,1) !important;
    }
    .comtent-area p {
        color:rgba(255,255,255,1) !important;
    }
    .coment-list .reply-comment-con[data-v-f8b7f6a6] {
        background-color:rgba(255,255,255,0.3) !important;
    }
    .reply-item .comment-detail .comment-content .grey-span[data-v-57385c10] {
        color:rgba(255,255,255,1) !important;
    }
    span.comtent-area {
        color:rgba(255,255,255,1) !important;
    }
    .project-detail-container .detail-content .project-detail-con .project-detail .project-operate .project-operate-left[data-v-135cd84a] {
        background-color:rgba(255,255,255,0.7) !important;
    }
    .project-detail-container .detail-content .project-detail-con .project-detail .project-operate .project-operate-right[data-v-135cd84a]{
        background-color:rgba(255,255,255,0.7) !important;
    }
    .project-detail-container .detail-content .project-detail-con .detail-recommend .user-access-con {
        background-color:rgba(255,255,255,0.2) !important;
    }
    .project-detail-container .detail-content .project-detail-con .detail-recommend .project-description-scratch {
        background-color:rgba(255,255,255,0.2) !important;
    }
    .project-detail-container .detail-content .project-detail-con .detail-recommend .project-recommend-scratch:last-child {
        background-color:rgba(255,255,255,0.2) !important;
    }
    .project-detail-container .detail-content .project-detail-con .detail-recommend .project-recommend-scratch {
        background-color:rgba(255,255,255,0.2) !important;
    }
    .user-pages .user-page .user-honor[data-v-d3f2a2b4] {
        background-color:rgba(255,255,255,0.7) !important;
    }
    .work-card[data-v-6260ba2e] {
        background-color:#bebebe !important;
    }
    .header.is-homepage[data-v-0ad9a040] {
        background:rgba(255,255,255,0.5) !important;
    }
    .app-navbar[data-v-0ad9a040] {
        background:rgba(0,0,0,0) !important;
    }
    .header-menu {
        background:rgba(255,255,255,0.7) !important;
    }
    .coment-list .reply-comment-box[data-v-f8b7f6a6] {
        background:rgba(255,255,255,0.4) !important;
    }
    .reply-comment-box .comment-box .draw-comment textarea[data-v-26e07e7a] {
        background-color:#bebebe !important;
    }
    .reply-comment-box .comment-box .draw-comment .xes-textarea{
        background-color:#bebebe !important;
    }
    .comment-box .draw-comment .xes-textarea textarea {
        background-color:#e0e0e0 !important;
    }
    .comment-box .draw-comment .xes-textarea {
        background-color:#e0e0e0 !important;
    }
    .project-detail-container .detail-content .project-detail-con .detail-recommend .project-description-scratch .description-con {
        color:#ffffff !important;
    }
    .card-style[data-v-3e341266] {
        background:rgba(255,255,255,0.7) !important;
    }
    .header .tag_search[data-v-33d0287b] {
        background:rgba(255,255,255,0.7) !important;
    }
    .homepages .user-introduction .user-menu[data-v-9fe8f08e] {
        background:rgba(255,255,255,0.7) !important;
    }
    .project-detail-container .detail-content .project-detail-con .detail-recommend .user-access-con .user-access-detail .user-info .user-realname {
        border-radius: 10px !important;
        background:rgba(255,255,255,0.5) !important;
    }
    .work-menu[data-v-a0099470] {
        background:rgba(255,255,255,0.7) !important;
    }
    .follow-list[data-v-1f68a1ae], .menu-tab[data-v-1f68a1ae] {
        background:rgba(255,255,255,0.7) !important;
    }
    .medal_master .show_medal[data-v-1c321bbd] {
        background:rgba(255,255,255,0.7) !important;
    }
    .comtent-area a {
        border-radius: 5px !important;
        background:rgba(255,255,255,0.7) !important;
    }
    .medal_card_con .medal_card[data-v-c481e1f8] {
        background:rgba(255,255,255,0.7) !important;
    }
    .xcr{
        z-index:900;
        position: fixed;
        right:2px;
        height: 8px;
        width: 20px;
        background:rgba(255,255,0,0.7) !important;
    }
    .comment-box .draw-comment {
        border-radius: 5px !important;
        background-color:#f0f0f0 !important;
    }
    .header-content{
        position: fixed;
        top: 0;
        left: 17%;
        background: rgba(255,255,255,0.5);
    }*/
document.head.appendChild(style);
function pb() {
    const c = document.getElementById('homePageKeduoGuide');//屏蔽首页无用内容
    if(c)
    {
        c.style.display = 'none';
    }
    const a = document.getElementsByClassName('cursor-follow-item-banner')[0];//屏蔽首页无用内容
    if(a)
    {
        a.style.display = 'none';
    }
    const d = document.getElementById('home-component-cursor-follow');//屏蔽首页无用内容
    if(d)
    {
        d.style.display = 'none';
    }
    const b = document.getElementsByClassName('floor-bar-wrapper')[0];//屏蔽首页无用内容
    if(b)
    {
        b.style.display = 'none';
    }
    const r = document.getElementsByClassName('div-content floor-item')[2];//屏蔽首页无用内容
    if(r)
    {
        r.style.display = 'none';
    }
    var l = document.getElementsByTagName("label");//屏蔽scratch，避免成为scratcher
    for(var p=0;p<l.length;p++)
    {
        if(l[p].innerHTML == '图形化编程')
        {
            l[p].style.display = 'none';
        }
    }
    var f = document.getElementsByTagName("li");//屏蔽scratch，避免成为scratcher
    for(var o=0;o<f.length;o++)
    {
        if(f[o].innerHTML == '图形化编程')
        {
            f[o].style.display = 'none';
        }
    }
    var s = document.getElementsByClassName("search-box_sort-item");//屏蔽scratch，避免成为scratcher
    for(var g=0;g<s.length;g++)
    {
        if(s[g].innerHTML == '图形化编程')
        {
            s[g].style.display = 'none';
        }
    }
    var u;//屏蔽scratch，避免成为scratcher
    u = document.getElementsByClassName("header-menu-item")
    for (var i = 0; i < u.length; i++) {
        if(u[i].getAttribute('data-logtype') == "clickCreateScratch")
        {
            u[i].style.display = 'none';
        }
    }
    var e;//替换“编程百科”和“模板”按钮网址，原版的太不靠谱了
    e = document.getElementsByClassName('headercon-right__btn')
    for (var k = 0; k < e.length; k++) {
        if(e[k].getAttribute('data-logtype') == 'btn-wiki')
        {
            e[k].href = 'https://www.runoob.com/python3/python3-tutorial.html';
        }else if(e[k].innerText.includes('发布')){
            //e[k].addEventListener("click",rtfk);
        }
    }
    if(e[0])
    {
        e[0].target = "_blank"
        e[0].href = 'https://www.runoob.com/python3/python3-examples.html';
    }
    //const tn23 = document.querySelector(".active_tag");
    //const spe23 = document.getElementsByClassName("tag-tooltip")[0];
    //const uip23 = document.createElement("li");
    //uip23.href = 'https://code.xueersi.com/search?value=&tag=api&type=all';
    //tn23.insertBefore(uip23,spe23);
    var utr = document.getElementsByClassName("user-icon")[0];//实用拓展类：头像文件查看
    var utrev = document.getElementById("userPageMenuGuideAvatar");
    if(utr&&utrev)
    {
        if(utr.style.backgroundImage != 'url("undefined")')
        {
            var jejb=document.getElementById("icon-hrefsss");
            if(jejb==null)
            {
                const tnu = document.querySelector("body");
                const speu = document.getElementsByTagName("")[0];
                const uip8 = document.createElement("a");
                uip8.innerHTML = '头像文件';
                uip8.className = 'sbbbd';
                uip8.id = 'icon-hrefsss';
                uip8.style.top = '200px';
                uip8.target = "_blank"
                uip8.href = utr.style.backgroundImage.slice(5,-2);
                tnu.insertBefore(uip8,speu);
            }
        }
    }
    else
    {
        var utre = document.getElementById("icon-hrefsss");
        if(utre)
        {
            utre.remove()
        }
    }
    var utrew2f = document.getElementsByClassName("adapt")[0];
    if(utrew2f){
        utrew2f.addEventListener("click",rtt)
    }
    var utrew = document.getElementsByClassName("project-info")[0];//实用拓展类：破源（为非“维c”用户提供方便）
    if(utrew)
    {
        var ajejb=document.getElementById("icon-hrefuty2");
        if(ajejb==null)
        {
            var work_data = window.location.search;
            var work_type = work_data.split("&")[3].split("=")[1];
            work_data = work_data.split("&")[1].split("=")[1];
            const tnu9 = document.querySelector("body");
            const speu9 = document.getElementsByTagName("")[0];
            const uip11 = document.createElement("a");
            uip11.addEventListener('click',psave);
            uip11.innerHTML = '保存源码';
            uip11.className = 'sbbbd';
            uip11.id = 'icon-hrefuty2';
            uip11.style.top = '230px';
            tnu9.insertBefore(uip11,speu9);
        }
    }
    else
    {
        var utrer2 = document.getElementById("icon-hrefuty2");
        if(utrer2)
        {
            utrer2.remove()
        }
    }
    var trew = document.getElementById("iframe-player");//实用拓展类：查看封面文件
    if(trew)
    {
        var work_data1 = window.location.search;
        const work_lang = work_data1.split("&")[0].split("=")[1];
        const work_type = work_data1.split("&")[3].split("=")[1];
        work_data1 = work_data1.split("&")[1].split("=")[1];
        let xhr3 = new XMLHttpRequest()
        xhr3.open('GET', "https://code.xueersi.com/api/compilers/v2/"+work_data1,true)
        xhr3.send()
        xhr3.onload = () => {
            if(xhr3.status == 200){
                var jcejb=document.getElementById("iconuu-hrefuty");
                if(jcejb==null)
                {
                    var dart=JSON.parse(xhr3.responseText)
                    const tnu = document.querySelector("body");
                    const speu = document.getElementsByTagName("")[0];
                    const uip8 = document.createElement("a");
                    uip8.innerHTML = '封面文件';
                    uip8.className = 'sbbbd';
                    uip8.id = 'iconuu-hrefuty';
                    uip8.style.top = '170px';
                    uip8.target = "_blank"
                    uip8.href = dart.data.thumbnail;
                    tnu.insertBefore(uip8,speu);
                }
            }else{
                console.log(`error ${xhr3.status}`)
            }
        }
    }
    else
    {
        var trer = document.getElementById("iconuu-hrefuty");
        if(trer)
        {
            trer.remove()
        }
    }
    var trewuu = document.getElementById("iframe-player");//呼声强烈类：一键三连！
    if(trewuu)
    {
        var joocejb=document.getElementById("iconuu-hrefutyoo");
        if(joocejb==null)
        {
            const tnu12 = document.querySelector("body");
            const speu12 = document.getElementsByTagName("")[0];
            const uip12 = document.createElement("a");
            uip12.innerHTML = '一键三连';
            uip12.className = 'sbbbd';
            uip12.id = 'iconuu-hrefutyoo';
            uip12.style.top = '140px';
            uip12.addEventListener('click',pkuy);
            tnu12.insertBefore(uip12,speu12);
        }
    }
    else
    {
        var treruu = document.getElementById("iconuu-hrefutyoo");
        if(treruu)
        {
            treruu.remove()
        }
    }
    var treswuu = document.getElementById("iframe-player");//超级逆天类：一键催更！
    if(treswuu)
    {
        var jooscejb=document.getElementById("iconuu-hrefutysoo");
        if(jooscejb==null)
        {
            const tnu12 = document.querySelector("body");
            const speu12 = document.getElementsByTagName("")[0];
            const uip12 = document.createElement("a");
            uip12.innerHTML = '一键催更';
            uip12.className = 'sbbbd';
            uip12.id = 'iconuu-hrefutysoo';
            uip12.style.top = '110px';
            uip12.addEventListener('click',pxsy);
            tnu12.insertBefore(uip12,speu12);
        }
    }
    else
    {
        var tresruu = document.getElementById("iconuu-hrefutysoo");
        if(tresruu)
        {
            tresruu.remove()
        }
    }
    const wee = document.getElementsByClassName('headercon-input')[0]
    if (wee) {
        wee.maxLength=100000;
    }
    let ecw = document.getElementsByClassName('publish_work_name')[0]
    if (ecw) {
        ecw.getElementsByTagName('input')[0].maxLength=100000;
    }
    const ws = document.getElementsByClassName('publish_button_confirm')[0]
    if (ws) {
        ws.addEventListener("click",rtfk2);
    }
    ecw = document.getElementsByClassName('work_description_textarea')[0]
    if (ecw) {
        ecw.getElementsByTagName('textarea')[0].maxLength=100000;
    }
    ecw = document.getElementsByClassName('tag-list')[0]
    if(ecw){
        ecw=ecw.getElementsByTagName('li')
        for (var kcc = 0; kcc < ecw.length; kcc++) {
            ecw[kcc].addEventListener('click',setTimeout(function (){
                console.log(this.class)
                if(this.class=='tag-selected'){
                    this.class=null
                }else{
                    this.class='tag-selected'
                }
            },500))
        }
    }
}

function pxsy() {
    var work_data1 = window.location.search;
    const work_type = work_data1.split("&")[3].split("=")[1];
    work_data1 = work_data1.split("&")[1].split("=")[1];
    const header = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33','Cookie':String(document.cookie)}
    let data;
    if(work_type=="cpp")
    {
        data={"appid":1001108,"topic_id":"CC_"+work_data1,"target_id":0,"content":"催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更"};
    }
    else if(work_type=="scratch")
    {
        data={"appid":1001108,"topic_id":"CS_"+work_data1,"target_id":0,"content":"催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更"};
    }
    else
    {
        data={"appid":1001108,"topic_id":"CP_"+work_data1,"target_id":0,"content":"催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更！催更"};
    }
    const xhr6 = new XMLHttpRequest();
    xhr6.open('POST', "https://code.xueersi.com/api/comments/submit",true);
    xhr6.setRequestHeader('Content-Type', "application/json");
    xhr6.send(JSON.stringify((header,data)));
    const xhr7 = new XMLHttpRequest();
    xhr7.open('POST', "https://code.xueersi.com/api/comments/submit",true);
    xhr7.setRequestHeader('Content-Type', "application/json");
    xhr7.send(JSON.stringify((header,data)));
}
function pkuy() {//反反强制三连
    var work_data1 = window.location.search;
    const work_lang = work_data1.split("&")[0].split("=")[1];
    const work_type = work_data1.split("&")[3].split("=")[1];
    work_data1 = work_data1.split("&")[1].split("=")[1];
    var data;
    if(work_lang)
    {
        data = {'params': {'id': work_data1, 'lang': work_lang, 'form': work_type}}
    }
    else
    {
        data = {'params': {'id': work_data1, 'lang': work_lang}}
    }
    const headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33'}
    let likeBtn = top.document.querySelector(".like");//点赞
    if (!likeBtn.classList.contains("hasLiked"))
    {
        let xhr = new XMLHttpRequest()
        if(work_type=="scratch")
        {
            xhr.open('POST', "https://code.xueersi.com/api/projects/"+work_data1+"/like")
        }
        else if(work_type=="cpp")
        {
            xhr.open('POST', "https://code.xueersi.com/api/compilers/"+work_data1+"/like")
        }
        else
        {
            xhr.open('POST', "https://code.xueersi.com/api/python/"+work_data1+"/like")
        }
        xhr.setRequestHeader('Content-Type', headers)
        xhr.send(JSON.stringify(data))
    }
    const header = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33','Cookie':String(document.cookie)}
    let xhr4 = new XMLHttpRequest()
    xhr4.open('POST', "https://code.xueersi.com/api/space/favorite",true)
    xhr4.setRequestHeader('Content-Type', "application/json")
    if(work_type=="cpp")
    {
        data={"topic_id":"CC_"+work_data1,"state":1}
    }
    else if(work_type=="scratch")
    {
        data={"topic_id":"CS_"+work_data1,"state":1}
    }
    else
    {
        data={"topic_id":"CP_"+work_data1,"state":1}
    }
    xhr4.send(JSON.stringify((header,data)))
    let xhr3 = new XMLHttpRequest()
    xhr3.open('GET', "https://code.xueersi.com/api/compilers/v2/"+work_data1,true)
    xhr3.send()
    xhr3.onload = () => {
        if(xhr3.status == 200){
            var dart=JSON.parse(xhr3.responseText)
            data = {'followed_user_id': dart.data.user_id, 'state': 1}
            let xhr2 = new XMLHttpRequest()
            xhr2.open('POST', "https://code.xueersi.com/api/space/follow")
            xhr2.setRequestHeader('Content-Type', "application/json")
            xhr2.send(JSON.stringify((header,data)))
        }else{
            console.log(`error ${xhr3.status}`)
        }
    }
    setTimeout(()=>location.reload(),500)
}
function pk() {
    var equ;//屏蔽词，避免看到低质作品
    equ = document.getElementsByClassName("card-bottom-title");
    var ilk=0;
    while ( ilk < equ.length)
    {
        if(equ[ilk].innerText.includes("图形化编程")||equ[ilk].innerText.includes("随堂")||equ[ilk].innerText.includes("脑洞大开")||equ[ilk].innerText.includes("模板")||equ[ilk].innerText.includes("我的世界")||equ[ilk].innerText.includes("原神")||equ[ilk].innerText.includes("Hello")||equ[ilk].innerText.includes("封面")||equ[ilk].innerText.includes("课堂巩固"))
        {
            equ[ilk].parentNode.parentNode.parentNode.style.display = 'none';
        }
        else
        {
            equ[ilk].parentNode.parentNode.parentNode.style.display = 'block';
        }
        ilk++;
    }
    var equ2;//屏蔽词，避免看到低质作品
    equ2 = document.getElementsByClassName("card-title");
    if (equ2 != {})
    {
        var ilk2=0;
        while ( ilk2 < equ2.length)
        {
            if(equ2[ilk2].innerText.includes("图形化编程")||equ2[ilk2].innerText.includes("随堂")||equ2[ilk2].innerText.includes("脑洞大开")||equ2[ilk2].innerText.includes("模板")||equ2[ilk2].innerText.includes("我的世界")||equ2[ilk2].innerText.includes("原神")||equ2[ilk2].innerText.includes("Hello")||equ2[ilk2].innerText.includes("封面")||equ2[ilk2].innerText.includes("课堂巩固"))
            {
                equ2[ilk2].parentNode.parentNode.parentNode.style.display = 'none';
            }
            else
            {
                equ2[ilk2].parentNode.parentNode.parentNode.style.display = 'block';
            }
            ilk2++;
        }
    }
    const rq = document.getElementsByClassName('user-name');//屏蔽无意义留言
    for(var xs=0;xs<rq.length;xs++)
    {
        if(rq[xs].innerText.includes("智能艾克"))
        {
            rq[xs].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        }else
        {
            rq[xs].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'block';
        }
    }
    const rfq = document.getElementsByClassName('comtent-area');//http写a标签
    for(var xfs=0;xfs<rfq.length;xfs++)
    {
        let owue = rfq[xfs].getElementsByTagName('p')[0];
        if(rfq[xfs].innerText.includes("http"))
        {
            let gew = rfq[xfs].innerText.search("http");
            let yew = rfq[xfs].innerText.slice(gew);
            let gew2;
            if(yew.includes(" ")){
                gew2 = yew.search(" ");
            }else{
                gew2 = yew.length;
            }
            yew = yew.slice(0,gew2);
            let yew2 = yew.slice(yew.search("/")+2)
            owue.innerHTML=owue.innerText.slice(0,gew)+"<a target='_blank' href='"+yew+"'>"+yew2+"</a>"+owue.innerText.slice(gew2,owue.innerText.length);
        }
    }
    const rqq = document.getElementsByClassName('reply-message-title-line');//屏蔽艾克留言消息
    for(var xsq=0;xsq<rqq.length;xsq++)
    {
        var jsdh;
        if(rqq[xsq].getElementsByTagName('span')[0])
        {
            jsdh=rqq[xsq].getElementsByTagName('span')[0];
        }
        else
        {
            jsdh=rqq[xsq].getElementsByTagName('p')[0];
        }
        if(jsdh.innerText.includes("智能艾克"))
        {
            const px = rqq[xsq].parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('notifition-dot')[0]
            if(px)
            {
                px.click();//删除艾克的通知
            }
            rqq[xsq].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        }
        else
        {
            rqq[xsq].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'block';
        }
    }
}
function pan() {
    var freu = document.getElementById("signatureInput");//实用类：解除个人简介长度限制
    if(freu)
    {
        console.log(freu.value=(freu.value));
        freu.maxLength=100000;//其实还是有限制的，再长就成dos了
    }
    var frex = document.getElementById("comment-box");//实用类：解除个人简介长度限制
    if(frex)
    {
        frex.maxLength=100000;//其实还是有限制的，再长就成dos了
    }
    var fxty = document.getElementsByClassName("comment-emoji")[0];
    if(fxty)
    {
        var wex=fxty.querySelector(".submit-btn");
        if(wex)
        {
            wex.click = () => {
                console.log("a");
            }
        }
    }
}
function pu() {
    const tn = document.querySelector("body");
    const spe = document.getElementsByTagName("")[0];
    const uipy = document.createElement("a");
    uipy.innerHTML = 'ourxes-唯';
    uipy.className = 'sbbbd';
    uipy.style.top = '610px';
    uipy.href = 'https://greasyfork.org/zh-CN/scripts/465277-ourxes-%E5%94%AF';
    uipy.target = "_blank"
    tn.insertBefore(uipy,spe);
    const uip = document.createElement("a");
    uip.innerHTML = 'XesExt';
    uip.className = 'sbbbd';
    uip.style.top = '640px';
    uip.href = 'https://greasyfork.org/zh-CN/scripts/457247-xesext';
    uip.target = "_blank"
    tn.insertBefore(uip,spe);
    const uip6 = document.createElement("a");
    uip6.innerHTML = 'xes_beautify';
    uip6.className = 'sbbbd';
    uip6.style.top = '670px';
    uip6.href = 'https://greasyfork.org/zh-CN/scripts/457470-xes-beautify';
    uip6.target = "_blank"
    tn.insertBefore(uip6,spe);
    const uip3 = document.createElement("a");
    uip3.innerHTML = '推荐的教程';
    uip3.className = 'sbbbd';
    uip3.style.top = '700px';
    uip3.href = 'https://www.runoob.com/';
    uip3.target = "_blank"
    tn.insertBefore(uip3,spe);
    const uip5 = document.createElement("a");
    uip5.innerHTML = 'XES网盘';
    uip5.className = 'sbbbd';
    uip5.style.top = '730px';
    uip5.id="uuiipp5"
    uip5.addEventListener('click',derv);
    tn.insertBefore(uip5,spe);
    const uip4 = document.createElement("a");
    uip4.innerHTML = '作者主页';
    uip4.className = 'sbbbd';
    uip4.style.top = '760px';
    uip4.href = 'https://code.xueersi.com/space/2731368';
    uip4.target = "_blank"
    tn.insertBefore(uip4,spe);
    const uip10 = document.createElement("a");
    uip10.innerHTML = 'JSXesApi';
    uip10.className = 'sbbbd';
    uip10.style.top = '790px';
    uip10.id="uuiipp5"
    uip10.addEventListener('click',pdw);
    tn.insertBefore(uip10,spe);
    const uip7 = document.createElement("div");
    uip7.innerHTML='<input ref="file" type="file" id="uuida">'
    uip7.className = 'sbbbd';
    uip7.style.top = '730px';
    uip7.id="uuiipp7";
    uip7.style.display = 'none';
    tn.insertBefore(uip7,spe);
    const tn2 = document.querySelector("#uuiipp7");
    const spe2 = document.getElementsByTagName("")[0];
    const uip9 = document.createElement("a");
    uip9.innerHTML = '上传';
    uip9.addEventListener('click',shac);
    tn2.insertBefore(uip9,spe2);
    const uip8 = document.createElement("a");
    uip8.innerHTML = '收起';
    uip8.addEventListener('click',dera);
    tn2.insertBefore(uip8,spe2);
}
function derv() {
    document.getElementById('uuiipp5').style.display = 'none';
    document.getElementById('uuiipp7').style.display = 'block';
}
function dera() {
    document.getElementById('uuiipp5').style.display = 'block';
    document.getElementById('uuiipp7').style.display = 'none';
}
function shac() {
    var datf=document.getElementById('uuida').files[0];
    const filename=document.getElementById('uuida').value;
    var reader = new FileReader()
    reader.readAsText(datf);
    //reader.readAsArrayBuffer(datf);
    reader.onload = function(){
    //const fs=require("fs");
    //fs.readFile(datf,function(err,dataStr){
        const uuyr=this.result;
        console.log(uuyr)
        let xhr4 = new XMLHttpRequest();
        const uuyrt = uuyr;
        var md5tr=md5(uuyrt);
        xhr4.open('GET', "https://code.xueersi.com/api/assets/get_oss_upload_params?scene=offline_python_assets&md5="+md5tr+"&filename="+filename,true)
        xhr4.send()
        xhr4.onload = () => {
            if(xhr4.status == 200){
                var dart=JSON.parse(xhr4.responseText).data
                let xhr5 = new XMLHttpRequest()
                xhr5.open('PUT', dart.host,true)
                for(var sd in dart.headers)
                {
                    xhr5.setRequestHeader(sd, dart.headers[sd])
                    //console.log((sd, dart.headers[sd]));
                }
                xhr5.send(uuyrt)
                xhr5.onload = () => {
                    if(xhr5.status == 200){
                        window.alert("已发送到"+dart.url);
                    }
                    else
                    {
                        window.alert("发送失败"+xhr5.status);
                    }
                }
                xhr5.upload.onprocess = function(event){ // event包含两个只读属性，loaded和total
                	var per = Math.round(event.loaded/event.total*100);
                	console.log(per);
                }
            }else{
                console.log(`error ${xhr4.status}`)
            }
        }
    }//)
}
function pfh() {//反强制三连
    const lty = document.querySelector('.like')
    if (lty) {
      lty.click = () => {window.alert('点赞按钮异常触发。此作品可能含有刷点赞代码。')}
    }
    const faty = document.querySelector('.favorites')
    if (faty) {
      faty.click = () => {window.alert('收藏按钮异常触发。此作品可能含有刷收藏代码。')}
    }
    const fty = document.querySelector('.focus-btn')
    if (fty) {
      fty.click = () => {window.alert('关注按钮异常触发。此作品可能含有刷关注代码。')}
    }
}
let cmd = 'xxx';
function pdw() {//jsxesapi
    while(cmd){
        cmd = prompt("请输入指令名（改个签/发留言/赞作品/关注用户/收藏作品/获取作品信息/获取用户信息）：");
        const nxhr = new XMLHttpRequest();
        let data;
        let header;
        if(cmd=="改个签")
        {
            header={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33','Cookie':String(document.cookie)};
            const txt = prompt("请输入新的个性签名");
            data={'signature':txt}
            nxhr.open('POST', "https://code.xueersi.com/api/space/edit_signature",true);
            nxhr.setRequestHeader('Content-Type', 'application/json');
            nxhr.send(JSON.stringify((header,data)));
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    window.alert("操作成功")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
        else if(cmd=="发留言")
        {
            const url = prompt("请输入作品网址");
            const work_type = url.split("&")[3].split("=")[1];
            const work_data1 = url.split("&")[1].split("=")[1];
            let work_data0;
            if(work_type=="cpp")
            {
                work_data0="CC_";
            }
            else if(work_type=="scratch")
            {
                work_data0="CS_";
            }
            else
            {
                work_data0="CP_"
            }
            header={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33','Cookie':String(document.cookie)};
            const txt = prompt("请输入留言内容");
            data={"appid":1001108,"topic_id":work_data0+work_data1,"target_id":0,"content":txt};
            nxhr.open('POST', "https://code.xueersi.com/api/comments/submit",true);
            nxhr.setRequestHeader('Content-Type', 'application/json');
            nxhr.send(JSON.stringify((header,data)));
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    window.alert("操作成功")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
        else if(cmd=="赞作品")
        {
            const url = prompt("请输入作品网址");
            const work_type = url.split("&")[3].split("=")[1];
            const work_data1 = url.split("&")[1].split("=")[1];
            if(work_type=="scratch")
            {
                nxhr.open('POST', "https://code.xueersi.com/api/projects/"+work_data1+"/like")
            }
            else if(work_type=="cpp")
            {
                nxhr.open('POST', "https://code.xueersi.com/api/compilers/"+work_data1+"/like")
            }
            else
            {
                nxhr.open('POST', "https://code.xueersi.com/api/python/"+work_data1+"/like")
            }
            header={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36 Edg/102.0.1245.33','Cookie':String(document.cookie)};
            const work_lang = url.split("&")[0].split("=")[1];
            if(work_lang)
            {
                data = {'params': {'id': work_data1, 'lang': work_lang, 'form': work_type}}
            }
            else
            {
                data = {'params': {'id': work_data1, 'lang': work_lang}}
            }
            nxhr.setRequestHeader('Content-Type', 'application/json');
            nxhr.send(JSON.stringify((header,data)));
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    window.alert("操作成功")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
        else if(cmd=="关注用户")
        {
            const uid = prompt("请输入要关注的用户的id");
            data = {'followed_user_id': uid, 'state': 1}
            nxhr.open('POST', "https://code.xueersi.com/api/space/follow")
            nxhr.setRequestHeader('Content-Type', "application/json")
            nxhr.send(JSON.stringify((header,data)))
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    window.alert("操作成功")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
        else if(cmd=="收藏作品")
        {
            const url = prompt("请输入作品网址");
            const work_type = url.split("&")[3].split("=")[1];
            const work_data1 = url.split("&")[1].split("=")[1];
            nxhr.open('POST', "https://code.xueersi.com/api/space/favorite",true)
            nxhr.setRequestHeader('Content-Type', "application/json")
            if(work_type=="cpp")
            {
                data={"topic_id":"CC_"+work_data1,"state":1}
            }
            else if(work_type=="scratch")
            {
                data={"topic_id":"CS_"+work_data1,"state":1}
            }
            else
            {
                data={"topic_id":"CP_"+work_data1,"state":1}
            }
            nxhr.send(JSON.stringify((header,data)))
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    window.alert("操作成功")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
        else if(cmd=="获取作品信息")
        {
            const url = prompt("请输入作品网址");
            const work_data1 = url.split("&")[1].split("=")[1];
            nxhr.open('GET', "https://code.xueersi.com/api/compilers/v2/"+work_data1,true)
            nxhr.send()
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    console.log(nxhr.responseText)
                    window.alert("操作成功，警告窗无法放下全部内容，请在控制台查看")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
        else if(cmd=="获取用户信息")
        {
            const uid = prompt("请输入用户id");
            nxhr.open('GET', "https://code.xueersi.com/api/space/profile?user_id="+uid,true)
            nxhr.send()
            nxhr.onload = () => {
                if(nxhr.status == 200){
                    console.log(nxhr.responseText)
                    window.alert("操作成功，警告窗无法放下全部内容，请在控制台查看")
                }else{
                    window.alert("操作失败，请检测输入并稍后再试")
                }
            }
        }
    }
}
function psave() {//事件更改
    var work_data1 = window.location.search;
    if(work_data1.split("&")[2]){
        const work_type = work_data1.split("&")[2].split("=")[1];
        work_data1 = work_data1.split("&")[1].split("=")[1];
        let xhr3 = new XMLHttpRequest()
        xhr3.open('GET', "https://code.xueersi.com/api/compilers/v2/"+work_data1,true)
        xhr3.send()
        xhr3.onload = () => {
            if(xhr3.status == 200){
                var dart=JSON.parse(xhr3.responseText)
                let work_xml=dart.data.xml;
                let work_fil=dart.data.assets.code_complete_json;
                if(work_fil==null){
                    work_fil=dart.data.assets.assets_url;
                }
                let work_nam=dart.data.name;
                let ass;
                ass={"name": work_nam, "xml": work_xml, "type": work_type, "lang": work_type, "id": '',"original_id": 3, "version": work_type, "args": [], "planid": 'null', "problemid": '', "projectid": 3,"code_complete": 1, "removed": 0, "user_id": 8510061,"assets": {"assets": [],"assets_url":work_fil, "cdns": ["https://livefile.xesimg.com"], "hide_filelist": false}};
                let xhr4 = new XMLHttpRequest()
                xhr4.open('POST', "https://code.xueersi.com/api/compilers/save",true);
                xhr4.setRequestHeader('Content-Type', 'application/json');
                xhr4.send(JSON.stringify(ass));
                xhr4.onload = () => {
                    if(xhr4.status == 200){
                        window.alert("保存成功")
                        console.log(JSON.parse(xhr4.responseText))
                    } else{
                        window.alert("保存失败")
                    }
                }
            }
        }
    }
}
function rtt() {//作品源码
    let psf;
    let work_data = window.location.search;
    let work_type = work_data.split("&")[3].split("=")[1];
    work_data = work_data.split("&")[1].split("=")[1];
    if(work_type=='scratch')
    {
        psf = 'https://code.xueersi.com/scratch3/index.html?pid='+work_data+'&version=3.0&env=community&from=adapt&v=1675044613019';
    }
    else
    {
        psf = 'https://code.xueersi.com/ide/code/'+work_data;
    }
    top.location=psf;
}
function rtfk() {
    let xhr3 = new XMLHttpRequest()
    xhr3.open('GET', "https://code.xueersi.com/api/index/shequ/permission_level",true)
    xhr3.send()
    xhr3.onload = () => {
        if(xhr3.status == 200){
            var dart=JSON.parse(xhr3.responseText)
            if(dart.data.permission_level<8){
                let d=window.location.href;
                let id=d.split('/')[5];
                let xhr5 = new XMLHttpRequest()
                xhr5.open('GET', "https://code.xueersi.com/api/compilers/v2/"+id,true)
                xhr5.send()
                xhr5.onload = () => {
                    if(xhr5.status == 200){
                        var dart=JSON.parse(xhr5.responseText)
                        let work_nam=dart.data.name;
                        let ass;
                        ass = {"projectId": id, "name": work_nam, "description": "OurXes", "created_source": "original","hidden_code": 2, "thumbnail": 'https://static0.xesimg.com/programme/assets/a7d1900a27c099a38d1d7d6101bd00bf.jpg',"tags": "OurXes 游戏 沙盒专区 艺术 算法 网站 模拟 其他"}
                        let xhr4 = new XMLHttpRequest()
                        xhr4.open('POST', "https://code.xueersi.com/api/python/"+id+"/publish",true);
                        xhr4.setRequestHeader('Content-Type', 'application/json');
                        xhr4.send(JSON.stringify(ass));
                        xhr4.onload = () => {
                            if(xhr4.status == 200 || xhr4.status == 4){
                                window.alert("发布成功")
                            } else{
                                window.alert("发布失败")
                            }
                        }
                    }
                }
            }
        }
    }
}
function rtfk2() {
    let d=window.location.href;
    let id=d.split('/')[5].split('=')[1].split('&')[0];
    let xhr5 = new XMLHttpRequest()
    xhr5.open('GET', "https://code.xueersi.com/api/compilers/v2/"+id,true)
    xhr5.send()
    xhr5.onload = () => {
        if(xhr5.status == 200){
            var dart=JSON.parse(xhr5.responseText)
            let work_nam;
            let ew = document.getElementsByClassName('publish_work_name')[0]
            if (ew) {
                work_nam=ew.getElementsByTagName('input')[0].value
            }
            let work_des;
            ew = document.getElementsByClassName('work_description_textarea')[0]
            if (ew) {
                work_des=ew.getElementsByTagName('textarea')[0].value
            }
            let work_tag='其他';
            ew = document.getElementsByClassName('tag-list')[0]
            if (ew) {
                let oiuu=ew.getElementsByClassName('tag-selected')
                for(let i in oiuu){
                    if(oiuu[i].innerText){
                        work_tag+=' '+oiuu[i].innerText
                    }
                }
            }
            let work_img;
            ew = document.getElementsByClassName('publish_choiced_cover')[0]
            if (ew) {
                work_img=ew.getElementsByTagName('img')[0].src.split('?')[0]//"https://livefile.xesimg.com/programme/assets/fcf68cfa88e5aa21c5b9660d97c9f2d1.gif"
            }
            let ass;
            ass = {"projectId": id, "name": work_nam, "description": work_des, "created_source": "original","hidden_code": 2, "thumbnail": work_img,"tags": work_tag}
            let xhr4 = new XMLHttpRequest()
            xhr4.open('POST', "https://code.xueersi.com/api/python/"+id+"/publish",true);
            xhr4.setRequestHeader('Content-Type', 'application/json');
            xhr4.send(JSON.stringify(ass));
            xhr4.onload = () => {
                if(xhr4.status == 200 || xhr4.status == 4){
                    window.alert("发布成功")
                } else{
                    window.alert("发布失败")
                }
            }
        }
    }
}
function pufg() {//webpy作品js危险操作预警
    var work_data1 = window.location.search;
    if(work_data1.split("&")[2]){
        const work_type = work_data1.split("&")[2].split("=")[1];
        work_data1 = work_data1.split("&")[1].split("=")[1];
        if(work_type=="webpy")
        {
            let xhr3 = new XMLHttpRequest()
            xhr3.open('GET', "https://code.xueersi.com/api/compilers/v2/"+work_data1,true)
            xhr3.send()
            xhr3.onload = () => {
                if(xhr3.status == 200){
                    var dart=JSON.parse(xhr3.responseText)
                    let xhr4 = new XMLHttpRequest()
                    xhr4.open('GET', dart.data.assets.assets_url,true)
                    xhr4.send()
                    xhr4.onload = () => {
                        if(xhr4.status == 200){
                            var dartt=JSON.parse(xhr4.responseText);
                            console.log(dartt)
                            let oqi=0;
                            var swe=0;
                            for(let ia=0;ia<dartt.treeAssets.length;ia++)
                            {
                                if(dartt.treeAssets[ia].md5ext)
                                {
                                    if(dartt.treeAssets[ia].dataFormat=="js")
                                    {
                                        oqi=1;
                                        let xhr5 = new XMLHttpRequest();
                                        let swsw = new Fasss;
                                        xhr5.open('GET', "https://livefile.xesimg.com/programme/python_assets/"+dartt.treeAssets[ia].md5ext,false)
                                        xhr5.send();
                                        swsw.todo_c(xhr5);
                                        xhr5.open('GET', "https://static0.xesimg.com/programme/python_assets/"+dartt.treeAssets[ia].md5ext,false)
                                        xhr5.send();
                                        swsw.todo_c(xhr5)
                                        swe=swsw.get();
                                    }
                                }
                            }
                            if(oqi==1)
                            {
                                if(swe==1){
                                    window.alert("此作品有与cookie有关的js文件，风险较高")
                                }else if(swe==2){
                                    window.alert("此作品极度危险！可能复制！")
                                }else{
                                    window.alert("此作品有js文件，可能有危险")
                                    console.log(swe)
                                }
                            }
                        }else{
                            console.log(`error ${xhr4.status}`)
                        }
                    }
                }else{
                    console.log(`error ${xhr3.status}`)
                }
            }
        }
    }
}
class Fasss {
    constructor() {
        this.aweia=0;
    }
    todo_c(xhr5){
        const trt = xhr5.responseText;
        if(trt.includes("/api/compilers/save")&&trt.includes("/api/python/")&&trt.includes("/publish")){
            this.aweia=2;
        }else if(trt.includes("cookie")){
            this.aweia=1;
        }
    }
    get(){
        return this.aweia;
    }
}
(function() {
    'use strict';
    // Your code here...
    document.getElementsByTagName('title')[0].innerHTML = '大家的社区，大家的学而思';
    if(document.getElementById('loading-dom'))
    {
        document.getElementsByTagName('p')[0].innerHTML = 'OurXes';
        document.getElementsByTagName('p')[0].style="font-size: 40px;color: rgba(64, 128, 255, 1);";
    }
    document.body.addEventListener('DOMNodeInserted', () => pb())
    document.body.addEventListener('DOMSubtreeModified', () => pk())
    document.body.addEventListener('DOMNodeInserted', () => pfh())
    document.body.addEventListener('DOMNodeInserted', () => pan())
    window.onload=pufg()
    pu()
})()