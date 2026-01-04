// ==UserScript==
// @name         氢水电
// @namespace    https://greasyfork.org/users/1420235
// @supportURL   https://www.luogu.com.cn/article/12o9z4ob
// @version      0.2.4
// @description  Just try your best
// @author       lemon_qwq
// @icon         https://cdn.luogu.com.cn/upload/image_hosting/jjcokp3q.png
// @match        *://*/*
// @grant        GM_info
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      https://www.luogu.com.cn/
// @downloadURL https://update.greasyfork.org/scripts/523011/%E6%B0%A2%E6%B0%B4%E7%94%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/523011/%E6%B0%A2%E6%B0%B4%E7%94%B5.meta.js
// ==/UserScript==
/* ==UserConfig==
setting:
  background:
    title: 背景图片
    description: 请填写背景图片URL，不使用则不填
    default: https://cdn.luogu.com.cn/images/bg/fe/Day_And_Night_1.jpg
  background-size:
    title: 背景图片填充方式
    description: 请选择背景图片填充方式
    type: select
    default: 填充
    values: [自动,填充,适应]
  background-color:
    title: 背景颜色
    description: 请填写当背景图片无法加载时的背景颜色
    default: '#edf0f2'
  opacity:
    title: 卡片透明度
    description: 请填写卡片透明度
    type: number
    default: 0.8
    min: 0
    max: 1
  opacity2:
    title: 鼠标悬停时的透明度
    description: 请填写鼠标悬停时的透明度
    type: number
    default: 1
    min: 0
    max: 1
  transform:
    title: 鼠标悬停时上浮的距离
    description: 请填写鼠标悬停时上浮的距离
    type: number
    default: 5
    min: -10
    max: 10
    unit: px
  border:
    title: 圆角半径
    description: 请填写圆角半径
    type: number
    default: 8
    min: 0
    max: 20
    unit: px
  menu:
    title: 菜单栏背景颜色
    description: 请填写菜单栏背景颜色
    default: '#ffffffaa'
  menu-blur:
    title: 菜单栏背景模糊程度
    description: 请填写菜单栏背景模糊程度，不使用则为0
    type: number
    default: 5
    min: 0
    max: 100
orther:
  music:
    description: 是否启用歌曲组件
    type: checkbox
    default: false
  musicURL:
    title: 歌曲链接
    description: 请填写歌曲链接
    default: https://music.163.com/outchain/player?type=2&id=5221167&auto=0&height=66
  welcome:
    description: 是否启用欢迎栏
    type: checkbox
    default: true
  logo:
    title: 自定义图标
    description: 请填写自定义图标，不用则不填
    default: 
  fish:
    description: 是否启用敲木鱼
    type: checkbox
    default: true
  fish-text:
    title: 敲木鱼文字
    description: 请填写敲木鱼文字
    default: rp++
    max: 7
  AC:
    description: 是否启用「恭喜你通过了此题」
    type: checkbox
    default: true
  cuteH:
    description: 可爱小H
    type: checkbox
    default: true
  tag:
    title: 为指定用户添加tag
    default: 'lemon_qwq/SSU/#000000/#ffffff'
    type: textarea
  better-menu:
    description: 使用洛谷同款顶栏、侧栏（待完善）
    type: checkbox
    default: false
  colorfulscroll:
    description: 阅读进度条
    type: checkbox
    default: true
 ==/UserConfig== */
 (function(){
    'use strict';
    try{
        function downloadString(content, filename) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            GM_download({
                url: url,
                name: filename,
                onload: function() {
                    URL.revokeObjectURL(url);
                },
                onerror: function() {
                    console.error('File download failed');
                }
            });
        }
        if(true){
            GM_registerMenuCommand('导出当前配置',(function(){
                let s="";
                for(let key in GM_info.userConfig){
                    for(let yek in GM_info.userConfig[key]){
                        if(GM_getValue(`${key}.${yek}`)!=undefined)
                        s=s+`${key}.${yek}\n`+window.btoa(encodeURIComponent(GM_getValue(`${key}.${yek}`)))+'\n';
                    }
                }
                downloadString(s,"setting.txt");
            }))
        }
        if(true){
            GM_registerMenuCommand("导入配置文件", function() {
                const input=document.createElement("input");
                input.type="file";
                input.click();
                input.addEventListener("change", function(event) {
                const file=event.target.files[0];
                if(file){
                    console.log('读取成功');
                    const reader=new FileReader();
                    reader.onload=function(e) {
                        const content=e.target.result;
                        let lines=content.split('\n');
                        let f=true;
                        let s="";
                        lines.forEach(function(line,index){
                            if(f){
                                s=line;
                            }else{
                                let tmp=decodeURIComponent(window.atob(line));
                                if(tmp=='true')tmp=true;
                                if(tmp=='false')tmp=false;
                                let num=parseFloat(tmp);
                                if(!isNaN(num)&&num.toString()==tmp)tmp=num;
                                GM_setValue(s,tmp);
                            }
                            f=!f;
                        });
                    };
                    reader.readAsText(file);
                }
            });
        });

        }
        function rand(n){
            const array=new Uint32Array(1);
            window.crypto.getRandomValues(array);
            return (array[0]%n);
        }
        function blackcheck(color){
            if(document.querySelector('html').classList.toString().includes('theme--light'))return color;
            let r,g,b,a=1;
            if(color.startsWith('#')&&color.length==4){
                color='#'+color[1] +color[1]+color[2]+color[2]+color[3]+color[3];
            }
            if(color.startsWith('#')){
                let hex=color.slice(1);
                r=parseInt(hex.slice(0,2),16);
                g=parseInt(hex.slice(2,4),16);
                b=parseInt(hex.slice(4,6),16);
                if(color.length==8){
                    a=parseInt(hex.slice(6,8),16);
                }
            }
            let compR=255-r;
            let compG=255-g;
            let compB=255-b;
            return `rgba(${compR}, ${compG}, ${compB}, ${a})`;
        }
        const window_href=window.location.href;
        if(window.location.pathname=='/reset'){
            if(confirm('你真的要重置设置吗')){
                for(let key in GM_info.userConfig){
                    for(let yek in GM_info.userConfig[key]){
                        GM_deleteValue(`${key}.${yek}`);
                    }
                }
                location.href='/';
            }
        }
        GM_registerMenuCommand("千万别点",(function(){
            GM_addStyle('html{transform:rotate(180deg);}');
        }));
        function decode(s){
            if(!s.includes(','))return s;
            let s2;
            if(s[0]=='@'){
                s=s.slice(1);
                s2=`linear-gradient(${s})`;
            }else{
                s2=`linear-gradient(${135}deg,${s})`;
            }
            return s2;
        }
        let bg=GM_getValue("setting.background","https://cdn.luogu.com.cn/images/bg/fe/Day_And_Night_1.jpg");
        let bgs=GM_getValue("setting.background-size","填充");if(bgs=='自动')bgs="auto";if(bgs=="填充")bgs="cover";if(bgs=="适应")bgs="contain";
        let bgc=GM_getValue("setting.background-color","#edf0f2");
        let menu=blackcheck(GM_getValue("setting.menu","#ffffffaa"));
        let mb=GM_getValue("setting.menu-blur",5);
        let opacity=GM_getValue("setting.opacity","0.8");
        let opacity2=GM_getValue("setting.opacity2","1");
        let transform=-GM_getValue("setting.transform",5);
        let border=GM_getValue("setting.border","8");
        let a=GM_getValue("orther.a","#aaaaff");
        let username=Array.from(document.querySelectorAll('li[data-dropdown-target="#menu-nav-user"]')).map(item=>item.querySelector('a')).find(link=>link&&link.textContent.trim()!='Language')?.textContent.trim()||'';
        let toppage=window_href+'/';
        if(window_href.includes('/d/'))toppage=window_href.substring(0,window_href.indexOf('/', window_href.indexOf('/d/') + 3) + 1);
        else toppage=window_href.substring(0,window_href.indexOf('/',8))+'/';
        console.log(toppage);
        const name=document.title.split("-").pop().trim();
        const link=document.createElement('link');
        link.rel='stylesheet';
        link.href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap';
        document.head.appendChild(link);
        if(document.querySelector("html").dataset.app=='Hydro'){
            GM_addStyle('html {scroll-behavior: smooth;}');
            let css="";
            css+=[
                `#panel{
                   background:url(${bg}),${decode(bgc)}!important;
                   background-attachment:fixed!important;
                   background-size:${bgs}!important;
                   background-position:center!important;
                }
                .section{
                   opacity:${opacity}!important;
                   border-radius:${border}px!important;
                   overflow: hidden!important;
                   box-shadow:rgba(0,0,0,0.35) 0px 5px 15px!important;
                }
                .section:hover{
                   opacity:${opacity2}!important;
                   transform:translateY(${transform}px)!important;
                }
                .autocomplete-list{
                   position: absolute!important;
                   z-index: 1000000!important;
                }
                #menu{
                   background:${decode(menu)}!important;
                   backdrop-filter:blur(${mb}px)!important;
                }
                #menu:hover{
                   background:${blackcheck("#ffffff")}!important;
                }
                @keyframes floatUp{
                    0%{opacity:1;transform:translateY(0);}
                    100%{opacity:0;transform:translateY(-100px);}
                }
                .floating-text {
                    position:absolute;
                    font-size:20px;
                    font-family:'Comic Sans MS'!important;
                    color: #ff6347;
                    animation:floatUp 1s ease-out forwards;
                    pointer-events:none;
                }
                @keyframes shake {
                    0%{transform:rotate(0deg);}
                    25%{transform:rotate(8deg);}
                    50%{transform:rotate(0deg);}
                    75%{transform:rotate(-8deg);}
                    100%{transform:rotate(0deg);}
                }
                .shake{
                    animation:shake 0.3s ease-in-out;
                }
                ::selection{
                   background: #C0EEFD99!important;
                }
                #percentageCounter{
                    position:fixed;
                    left:0; top:0;`, 
                `    height:3px;
                    z-index:999999; 
                    background: skyblue;
                    border-radius:5px;
                }
                .H_Hydro_text{
                   background:#fff0!important;
                   color:#fff!important;
                   font-family:'Comic Sans MS'!important;
                }
                .H_Hydro_text:empty{
                   display: none;
                }
                .H_Hydro_text:after{
                   display: none;
                }
                .nav-icon {
                    transition: transform 0.3s ease;
                    width:18px;
                    height:auto;
                    display: block;
                    margin: 0 auto;
                    transform: translateY(0.5em);
                }
                .nav-text {
                    opacity: 0;
                    display: block;
                    margin: 0 auto;
                }
                .nav-van{
                    height:2em;
                    width:100%;
                    display: inline-block!important;
                }
                .nav-van:after{
                    opacity: 0;
                }
                .nav-van:hover .nav-text {
                    opacity: 1;
                }
                .nav-van:hover .nav-icon {
                    transform-origin: top center;
                    transform: scale(0.9);
                }`,
            ];
            if(GM_getValue("orther.better-menu",false)){
                css+=[
                    `#menu{`,
                    `   width:auto!important;`,
                    `   right: 30px!important;`,
                    `   left: auto!important;`,
                    `   height: 3rem!important;`,
                    `   border-radius:0 0 ${border}px ${border}px!important;`,
                    `   position: absolute;`,
                    `}`,
                    `body{`,
                    `   padding-left:3.7em;`,
                    `   weith:100%!important;`,
                    `}`,
                ].join('\n');
            }
            if(typeof GM_addStyle!="undefined") {
                GM_addStyle(css);
            }else if(typeof PRO_addStyle!="undefined") {
                PRO_addStyle(css);
            }else if(typeof addStyle!="undefined") {
                addStyle(css);
            }else{
                let node=document.createElement("style");
                node.type="text/css";
                node.appendChild(document.createTextNode(css));
                let heads=document.getElementsByTagName("head");
                if(heads.length>0){
                    heads[0].appendChild(node);
                }else{
                    document.documentElement.appendChild(node);
                }
            }
            if(GM_getValue("orther.music",false)){
                const musicURL=GM_getValue("orther.musicURL","");
                const newHTML=`<div class="section side visible"><div class="section__body typo"><iframe frameborder="no"border="0"marginwidth="0"marginheight="0"width="100%"height="80"src="${musicURL}"></iframe></div></div>`;
                const row=document.getElementById('panel').querySelector('.main').querySelector('.row');
                if(row!=null){
                    const divs=row.querySelectorAll(':scope > div');
                    divs.forEach(div=>{
                        const className=div.className;
                        if(className.includes('medium-3')&&className.includes('columns')){
                            div.insertAdjacentHTML('afterbegin',newHTML);
                        }
                    });
                }
            }
            if(GM_getValue("orther.welcome",true)){
                const newHTML=`<div class="section visible"><div class="section__header"><h1 class="section__title">欢迎 ${username} 来到 ${name}!</h1></div></div>`;
                const main=document.querySelector('#panel').querySelector('.main');
                const element=main.querySelector('div');
                element.insertAdjacentHTML('afterbegin',newHTML);
            }
            let ico=GM_getValue("orther.logo","*");
            if(ico!="*"){
                const element=document.querySelector("#menu").querySelector(".nav__logo");
                element.src=ico;
            }
            if(GM_getValue("orther.fish",true)){
                const newHTML=`<div class="fish section side visible" style="height:200px;padding-top:100px;padding-left:70px;background:#000000ff;color:#fff"><div class="section__header"><img src="https://img.z4a.net/images/2025/01/04/b7c572e046da8f9b73e4c43a3f232d7f.png" style="width:100px;user-select: none;"></img></div><h style="position: absolute; right: 10px; bottom: 10px; margin: 5px;">今日已敲0次</h></div>`;
                const row=document.getElementById('panel').querySelector('.main').querySelector('.row');
                if(row!=null){
                    const divs=row.querySelectorAll(':scope > div');
                    divs.forEach(div=>{
                        const className=div.className;
                        if(className.includes('medium-3')&&className.includes('columns')){
                            div.insertAdjacentHTML('afterbegin',newHTML);
                            const element=document.querySelector('.fish');
                            const element2=element.querySelector('img');
                            element2.addEventListener('click', function(event) {
                                element2.classList.add('shake');
                                setTimeout(()=>{
                                    element2.classList.remove('shake');
                                }, 300);
                                const floatText=document.createElement('div');
                                floatText.classList.add('floating-text');
                                floatText.textContent=GM_getValue("orther.fish-text","rp++");
                                floatText.style.left=`${element2.offsetLeft+element2.offsetWidth/2+20+Math.random()*30}px`;
                                floatText.style.top=`${element2.offsetTop+70}px`;
                                element.appendChild(floatText);
                                setTimeout(()=>{
                                    element.removeChild(floatText);
                                }, 1000); 
                                GM_setValue("fish-count",GM_getValue("fish-count",0)+1);
                            });
                            setInterval((function(){
                                let element3=element.querySelector('h');
                                element3.textContent=`今日已敲${GM_getValue("fish-count",0)}次`;
                            }),1);
                            (function(){
                                let time=(new Date())-(new Date(0));
                                time=Math.floor((time+28800000)/(86400000));
                                if(time!=GM_getValue("fish-lasttime",0)){
                                    GM_setValue("fish-lasttime",time);
                                    GM_setValue("fish-count",0);
                                }
                            })();
                        }
                    });
                }
            }
            if(GM_getValue("orther.AC",true)){
                let flag=0,flag2=0;
                setInterval((function(){
                    let element=document.querySelector('#status');
                    if(element&&!flag2){
                        if(element.querySelector('.section__title').querySelector('.record-status--text.progress').textContent=='\n        Running\n      '||element.querySelector('.section__title').querySelector('.record-status--text.progress').textContent=='\n        Wating\n      '){
                            flag2=1;
                        }
                    }
                }));
                setInterval((function(){
                    let element=document.querySelector('#status');
                    if(element!=null&&element!=undefined){
                        if(flag==0&&element.querySelector('.section__title').querySelector('.record-status--text.pass').textContent=='\n        Accepted\n      '){
                            if(flag2){
                                GM_notification({text:`恭喜你通过了此题`,title:`AC`});
                                const floatText=`<div style="margin: auto;text-align: center;"><img src="https://fecdn.luogu.com.cn/luogu/ac-congrats.png" style="position:fixed;z-index:10000;transform:translateX(-50%);overflow: hidden;padding-top:80px;height:600px" class="AC"></img></div>`;
                                document.body.insertAdjacentHTML('afterbegin',floatText);
                                setTimeout(()=>{
                                    document.querySelector('.AC').remove();
                                },2000);
                            }
                            flag=1;
                        }
                    }
                }));
            }
            if(GM_getValue("orther.cuteH",true)){
                const floatText=`<div id="Himage" style="position: fixed;pointer-events: none;z-index:10005;transition: left 0.2s,top 0.2s;"><img src="https://cdn.luogu.com.cn/upload/image_hosting/jjcokp3q.png" style="height:20px;"></img></div>`;
                document.body.insertAdjacentHTML('afterbegin',floatText);
                const element = document.getElementById('Himage');
                document.addEventListener('mousemove', (event) => {
                    const mouseX=event.clientX-8;
                    const mouseY=event.clientY+12;
                    element.style.left=mouseX+'px';
                    element.style.top=mouseY+'px';
                });
            }
            if(true){
                (function(){
                    let s=GM_getValue("orther.tag","lemon_qwq/SSU/#000000/#ffffff");
                    s="\n"+s;
                    let name=[];
                    let n=-1,k=0;
                    if(true){
                        for(let i=0;i<s.length;i++){
                            if(s[i]=='\n') {
                                n++;
                                k=0;
                            }else if(s[i]=='/'){
                                k++;
                            }else{
                                if(!name[n])name[n]=[];
                                if(!name[n][k])name[n][k]='';
                                name[n][k]+=s[i];
                            }
                        }
                    }
                    const divs=document.querySelectorAll('.user-profile-link');
                    divs.forEach(div=>{
                        let uname=div.querySelector('.user-profile-name').textContent.replace(/\s+/g,'');
                        for(let i=0;i<=n;i++){
                            if(uname==name[i][0]||uname.includes(`(${name[i][0]})`)){
                                div.querySelector('.user-profile-name').insertAdjacentHTML('afterend',`<a><span class="user-profile-badge v-center" style="background:${decode(name[i][2])};"><span style="background: ${decode(name[i][3])};-webkit-background-clip:text;color:transparent;font-weight:400">${name[i][1]}</span></span></a>`);
                                console.log(`${name[i][0]} 的 tag:${name[i][1]} 使用成功`);
                                break;
                            }
                        }
                    });
                })();
            }
            if(true){
                document.addEventListener('keydown',function(event){
                    if(event.ctrlKey&&event.key=='s') {
                        event.preventDefault();
                    }
                });
            }
            if(GM_getValue("orther.colorfulscroll",true)){
                $(window).scroll(function() {
                    let a=$(window).scrollTop(),c=$(document).height(),b=$(window).height();
                    let scrollPercent=a/(c-b)*100;
                    scrollPercent=scrollPercent.toFixed(1);
                    $("#percentageCounter").css({width:scrollPercent+"%"});
                }).trigger("scroll");
                document.body.insertAdjacentHTML(`afterbegin`,`<div id="percentageCounter"></div>`);
            }
            if(GM_getValue("orther.better-menu",false)){
                let text_list=[
                    '关于 SPFA，它死了',
                    '不开 long long 见祖宗',
                    '多测不清空，爆 0 两行泪',
                    '稻花乡里说丰年，听取 <b style="color:red">WA</b> 声一片',
                    `<b style="color:${['red','purple','green','orange'][rand(4)]}">${username}`,
                ];
                document.body.insertAdjacentHTML('afterbegin',`<a style="z-index:99999;position: absolute;top:15px;left:80px;padding:5px;cursor:auto;" class="H_Hydro_text" href="/">${text_list[rand(text_list.length)]}</a>`)
                if(true){
                    let div=document.querySelector('.nav__list.nav__list--main.clearfix');
                    div.remove();
                    div=document.querySelector('nav.nav--shadow');
                    div.remove();
                }
                if(window_href.includes('/homework/')&&!window_href.includes('/edit')&&!window_href.includes('/create')){
                    setTimeout((function(){
                        const url=window_href.substring(0,window_href.indexOf("/homework/")+"/homework/".length);
                        const xhr=new XMLHttpRequest();
                        xhr.open('GET',url,true);
                        xhr.onload=function(){
                            if(xhr.status==200){
                                const html=xhr.responseText;
                                const tmp=document.createElement('div');
                                tmp.innerHTML=html;
                                let divs=tmp.querySelectorAll('.homework__title');
                                divs.forEach(div=>{
                                    if(window_href.includes(div.querySelector('a').href)){
                                        document.querySelector('.H_Hydro_text').textContent='所属作业：'+div.querySelector('a').textContent;
                                    }
                                });
                            }else{
                                console.error('Request failed with status:',xhr.status);
                            }
                        };
                        xhr.onerror=function(){
                            console.error('Error while making the request');
                        };
                        xhr.send();
                    }),10);
                }
                if(true){
                    // setTimeout((function(){
                    //     const sessionID = document.cookie.match(/sessionID=([^;]*)/)?.[1];
                    //     const authToken = localStorage.getItem('authToken');
                    //     GM_xmlhttpRequest({
                    //         method: 'GET',
                    //         url: 'https://www.luogu.com.cn/',
                    //         headers: {
                    //             'Authorization': 'Bearer ' + authToken,
                    //             'Cookie': 'sessionID=' + sessionID
                    //         },
                    //         onload: function(response) {
                    //             console.log('请求成功！');
                    //             let tmp=document.createElement('div');
                    //             tmp.innerHTML=response.responseText;
                    //             var divs=tmp.querySelectorAll('img');
                    //             divs.forEach(div=>{
                    //                 console.log(div);
                    //             });
                    //         },
                    //         onerror: function(error) {
                    //             console.log('请求失败:', error);
                    //         }
                    //     });
                    // }))

                    document.querySelector('html').insertAdjacentHTML('afterbegin',`
    <nav style="width:3.7em;height:100%;background: #34495e;margin-right: 3.7em;position: fixed;z-index:0;color: #ddd;">
      <a href=${toppage}>
        <div style="text-align: center; background: #3498db;height:64px;padding-top: 14px;margin-bottom: 14px;">
          <img src="https://cdn.luogu.com.cn/upload/usericon/715948.png" style="height: 32px;"></img>
        </div>
      </a>
      <div class="nav-van" style="margin-bottom: 2em;">
        <a style="color: inherit;" href="${toppage+'p/'}">
          <svg class="nav-icon" style="width:1em;padding-bottom:.5em" aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" class=""></path></svg>
          <p class="nav-text" style="color: #ddd;text-align: center;line-height: 5px;font-size: 13px;">题库</p>
        </a>
      </div>
      <div class="nav-van" style="margin-bottom: 2em;">
        <a style="color: inherit;" href="${toppage+'training/'}">
          <svg class="nav-icon" style="width:1em;padding-bottom:.5em" aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-4.7 132.7c6.2 6.2 6.2 16.4 0 22.6l-64 64c-6.2 6.2-16.4 6.2-22.6 0l-32-32c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L112 249.4l52.7-52.7c6.2-6.2 16.4-6.2 22.6 0zM192 272c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H208c-8.8 0-16-7.2-16-16zm-16 80H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" class=""></path></svg>
          <p class="nav-text" style="color: #ddd;text-align: center;line-height: 5px;font-size: 13px;">训练</p>
        </a>
      </div>
      <div class="nav-van" style="margin-bottom: 2em;">
        <a style="color: inherit;" href="${toppage+'contest/'}">
          <svg class="nav-icon" style="width:1.2em;padding-bottom:.5em" aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M576 0c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V32c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V128c0-17.7 14.3-32 32-32zM352 224V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32zM96 416v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V416c0-17.7 14.3-32 32-32s32 14.3 32 32z" class=""></path></svg>
          <p class="nav-text" style="color: #ddd;text-align: center;line-height: 5px;font-size: 13px;">比赛</p>
        </div>
      </a>
      <div class="nav-van" style="margin-bottom: 2em;">
        <a style="color: inherit;" href="${toppage+'record?uidOrName='+username}">
          <svg class="nav-icon" style="width:1.2em;padding-bottom:.5em" aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z" class=""></path></svg>
          <p class="nav-text" href="" style="color: #ddd;text-align: center;line-height: 5px;font-size: 13px;">记录</p>
        </a>
      </div>
      <div class="nav-van" style="margin-bottom: 2em;">
        <a style="color: inherit;" href="${toppage+'discuss/'}">
          <svg class="nav-icon" style="width:1.2em;padding-bottom:.5em" aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" class=""></path></svg>
          <p class="nav-text" href="" style="color: #ddd;text-align: center;line-height: 5px;font-size: 13px;">讨论</p>
        </a>
      </div>
      <div class="nav-van">
        <a style="color: inherit;" href="${toppage+'homework/'}">
          <svg class="nav-icon" style="padding-bottom:.5em" aria-hidden="true" focusable="false" data-prefix="fas" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v80c0 13.3 10.7 24 24 24H296c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z" class=""></path></svg>
          <p class="nav-text" href="" style="color: #ddd;text-align: center;line-height: 5px;font-size: 13px;">作业</p>
        </a>
      </div>
    </nav>`);
                }
            }
            if(true){
                class Circle {
                    constructor({ origin, speed, color, angle, context }) {
                        this.origin = origin
                        this.position = { ...this.origin }
                        this.color = color
                        this.speed = speed
                        this.angle = angle
                        this.context = context
                        this.renderCount = 0
                    }

                    draw() {
                        this.context.fillStyle = this.color
                        this.context.beginPath()
                        this.context.arc(this.position.x, this.position.y, 4, 0, Math.PI * 2)
                        this.context.fill()
                    }

                    move() {
                        this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
                        this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
                        this.renderCount++
                    }
                }

                class Boom {
                    constructor({ origin, context, circleCount = 10, area }) {
                        this.origin = origin
                        this.context = context
                        this.circleCount = circleCount
                        this.area = area
                        this.stop = false
                        this.circles = []
                    }

                    randomArray(range) {
                        const length = range.length
                        const randomIndex = Math.floor(length * Math.random())
                        return range[randomIndex]
                    }

                    randomColor() {
                        const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
                        return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
                    }

                    randomRange(start, end) {
                        return (end - start) * Math.random() + start
                    }

                    init() {
                        for (let i = 0; i < this.circleCount; i++) {
                            const circle = new Circle({
                                context: this.context,
                                origin: this.origin,
                                color: this.randomColor(),
                                angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                                speed: this.randomRange(1, 6)
                            })
                            this.circles.push(circle)
                        }
                    }

                    move() {
                        this.circles.forEach((circle, index) => {
                            if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
                                return this.circles.splice(index, 1)
                            }
                            circle.move()
                        })
                        if (this.circles.length == 0) {
                            this.stop = true
                        }
                    }

                    draw() {
                        this.circles.forEach(circle => circle.draw())
                    }
                }

                class CursorSpecialEffects {
                    constructor() {
                        this.computerCanvas = document.createElement('canvas')
                        this.renderCanvas = document.createElement('canvas')

                        this.computerContext = this.computerCanvas.getContext('2d')
                        this.renderContext = this.renderCanvas.getContext('2d')

                        this.globalWidth = window.innerWidth
                        this.globalHeight = window.innerHeight

                        this.booms = []
                        this.running = false
                    }

                    handleMouseDown(e) {
                        const boom = new Boom({
                            origin: { x: e.clientX, y: e.clientY },
                            context: this.computerContext,
                            area: {
                                width: this.globalWidth,
                                height: this.globalHeight
                            }
                        })
                        boom.init()
                        this.booms.push(boom)
                        this.running || this.run()
                    }

                    handlePageHide() {
                        this.booms = []
                        this.running = false
                    }

                    init() {
                        const style = this.renderCanvas.style
                        style.position = 'fixed'
                        style.top = style.left = 0
                        style.zIndex = '99999'
                        style.pointerEvents = 'none'

                        style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
                        style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

                        document.body.append(this.renderCanvas)

                        window.addEventListener('mousedown', this.handleMouseDown.bind(this))
                        window.addEventListener('pagehide', this.handlePageHide.bind(this))
                    }

                    run() {
                        this.running = true
                        if (this.booms.length == 0) {
                            return this.running = false
                        }

                        requestAnimationFrame(this.run.bind(this))

                        this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
                        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

                        this.booms.forEach((boom, index) => {
                            if (boom.stop) {
                                return this.booms.splice(index, 1)
                            }
                            boom.move()
                            boom.draw()
                        })
                        this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
                    }
                }
                const cursorSpecialEffects = new CursorSpecialEffects()
                cursorSpecialEffects.init();
                if(true){
                    let prismCssUrl='https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: prismCssUrl,
                        onload: function (response) {
                        // 将加载的 CSS 内容注入到页面中
                        GM_addStyle(response.responseText);
                        console.log('Prism CSS 加载并注入成功！');
                        },
                        onerror: function (error) {
                        console.error('Prism CSS 加载失败：', error);
                        },
                    });
                    prismCssUrl='https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism-coy.min.css';
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: prismCssUrl,
                        onload: function (response) {
                        // 将加载的 CSS 内容注入到页面中
                            GM_addStyle(response.responseText);
                            console.log('Prism CSS 加载并注入成功！');
                        },
                        onerror: function (error) {
                            console.error('Prism CSS 加载失败：', error);
                        },
                    });
                }
            }
        }
    }catch(e){
        console.error('Error-code:'+e);
    }
})();