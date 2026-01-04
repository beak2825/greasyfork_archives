// ==UserScript==
// @name         Vjudge Contest Better
// @namespace    https://smkttl.github.io
// @version      3.8
// @description  Add Origin(if valid) and luogu/AT/CF submission to vjudge contest
// @author       limesarine
// @match        https://vjudge.net/contest/*
// @match        https://www.vjudge.net/contest/*
// @match        https://vjudge.net.cn/contest/*
// @match        https://www.vjudge.net.cn/contest/*
// @license      CC-BY-NC-ND
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549266/Vjudge%20Contest%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/549266/Vjudge%20Contest%20Better.meta.js
// ==/UserScript==

let good=false,alerted=false,aborted=false,logging=true,expanded=false;

function limesarine_expand()
{
    if(expanded) return;
    expanded=true;
    aborted=true;
    let dialog=document.createElement("div");
    dialog.style.position="fixed";
    dialog.style.top="25vh";
    dialog.style.left="25vw";
    dialog.style.width="50vw";
    dialog.style.height="50vh";
    dialog.style.borderRadius="8px";
    dialog.style.boxShadow="0 1px 6px rgba(0, 0, 0, .2)";
    dialog.style.borderColor="#F0F8FF";
    dialog.style.backgroundColor="#E0E8FC";
    dialog.style.fontSize="90%";
    dialog.style.padding="20px";
    dialog.style.lineHeight="0px";
    dialog.innerHTML=`
  <h2>设置（如果不想提供cookie也可以选择两个复选框都不选择）</h2>
  <p><input type="checkbox" class="lsCheckbox" name="useLG" id="useLG"></input><label for="useLG" class="lsCheckboxLabel">启用洛谷</label></p>
  <span id="LGdata">
    <p>
      <label for="uid">_uid</label>
      <input id="uid" placeholder="_uid" name="uid"></input>
    </p>
    <p>
      <label for="token">__client_id</label>
      <input id="token" placeholder="__client_id"></input>
    </p>
  </span>
  <p><input type="checkbox" class="lsCheckbox" name="useAT" id="useAT"></input><label for="useAT" class="lsCheckboxLabel">启用AtCoder</label></p>
  <span id="ATdata">
    <p>
      <label for="uid">REVEL_SESSION</label>
      <input id="uid" placeholder="session" name="session"></input>
    </p>
  </span>
  <p><input type="checkbox" class="lsCheckbox" name="useCF" id="useCF"></input><label for="useCF" class="lsCheckboxLabel">启用CodeForces</label></p>
  <span id="CFdata">
    <p>
      <label for="uid">username</label>
      <input id="uid" placeholder="username" name="username"></input>
    </p>
  </span>
  <button class="setting-confirm">刷新并保存设置</button>
`;
    document.body.appendChild(dialog);
    if(localStorage.uselg=='true') {
        dialog.children[1].children[0].checked=true;
        dialog.children[2].children[0].children[1].value=localStorage.uid;
        dialog.children[2].children[1].children[1].value=localStorage.token;
    }
    if(localStorage.useat=='true') {
        dialog.children[3].children[0].checked=true;
        dialog.children[4].children[0].children[1].value=localStorage.session;
    }
    if(localStorage.usecf=='true') {
        dialog.children[5].children[0].checked=true;
        dialog.children[6].children[0].children[1].value=localStorage.username;
    }
    dialog.children[1].children[0].addEventListener('change',function(){
        dialog.children[2].style.display=(dialog.children[1].children[0].checked?"":"none");
    });
    dialog.children[2].style.display=(dialog.children[1].children[0].checked?"":"none");
    dialog.children[3].children[0].addEventListener('change',function(){
        dialog.children[4].style.display=(dialog.children[3].children[0].checked?"":"none");
    });
    dialog.children[4].style.display=(dialog.children[3].children[0].checked?"":"none");
    dialog.children[5].children[0].addEventListener('change',function(){
        dialog.children[6].style.display=(dialog.children[5].children[0].checked?"":"none");
    });
    dialog.children[6].style.display=(dialog.children[5].children[0].checked?"":"none");
    dialog.children[7].addEventListener('click',function(){
        if(dialog.children[1].children[0].checked) {
            localStorage.uselg=true;
            localStorage.uid=dialog.children[2].children[0].children[1].value;
            localStorage.token=dialog.children[2].children[1].children[1].value;
        } else {
            localStorage.uselg=false;
        }
        if(dialog.children[3].children[0].checked) {
            localStorage.useat=true;
            localStorage.session=dialog.children[4].children[0].children[1].value;
        } else {
            localStorage.useat=false;
        }
        if(dialog.children[5].children[0].checked) {
            localStorage.usecf=true;
            localStorage.username=dialog.children[6].children[0].children[1].value;
        } else {
            localStorage.usecf=false;
        }
        location.href=location.href;
    });
}
window.addEventListener('message', function(event) {
    if(aborted)	return;
    if (event.origin !== "https://jylh8y-55315.csb.app" || (typeof event.data != "string")) {
        console.log('Denied message from',event.origin);
        return;
    }
    let data=JSON.parse(event.data);
    console.log(data)
    if(data.good=='good') {
        if(alerted)
        {
            location.href=location.href;
        }
        good=true;
        return;
    }
    if(data.text=='-553') {
        if(logging)	return;
        logging=true;
        console.log("Login failed!");
        alert('Your '+data.add.split('.')[2]+' login data is out of date. Please re-login.');
        limesarine_expand();
        return;
    }
    if(data.text=='-553553' && data.add!='test') {
        alert('Request failed! For more data, see the console.');
        return;
    }
    if(data.text=='-553553') {
        return;
    }
    if(data.text=='0') {
        console.log(data.add)
        alert('Failed to get data! For more data, see the console.');
    }
    if(data.text>0 || data.text=='-238315' || data.add.split('.')[2]=='AT' || data.add.split('.')[2]=='CF') {
        let html='',add=data.add.split('.');
        let label=parseInt(add[0]),pid=add[1];
        if(add[2]=='LG') {
            if(data.text=='-238315') {
                html=`<a href="https://www.luogu.com.cn/problem/${pid}" class='lg-WA'>${pid}</a>`;
            } else {
                html=`<a href="https://www.luogu.com.cn/record/${data.text}" class='lg-AC'>${pid}</a>`
            }
            document.getElementsByClassName('lg-stat')[label].innerHTML=`${html}`
        } else {
            let datas=data.text.split('|');
            html=`<a href="${datas[0]}" class=${datas[1]}>${datas[2]}</a>`
            document.getElementsByClassName('prob-title')[label].innerHTML=document.getElementsByClassName('prob-title')[label].innerHTML.replaceAll(datas[2],html);
        }
        console.log(add,label,pid);
    }
}, false);
function testConnection()
{
    let e=document.createElement('iframe');
    e.src="https://jylh8y-55315.csb.app/?add=test";
    document.body.appendChild(e);
    e.classList.add('lg-frame');
    let img=document.createElement('img');
    img.src="https://jylh8y-55315.csb.app/testimg";
    document.body.appendChild(e);
    e.classList.add('lg-frame');
    img.onload=function(){
        console.log('Image loaded!');
        setTimeout(function(){
            if(!good)
            {
                e.style="position: fixed; height: 100vh; width: 100vw; top: 0; left: 0; z-index: 553553553;";
                setTimeout(function(){
                    alerted=true;
                    alert('Please click the "Yes, proceed to preview" button below.');
                },100);
            }
            else
            {
                document.body.removeChild(e);
                console.log('Connected.');
                deal();
            }
        },1000);
    }
    img.onerror=function(){
        alert('It seems the server has died, please contact smkttl immediately.');
        aborted=true;
    }
}
function getLocalStorage(key,reset) {
    if(aborted)	return;
    if(localStorage[key] && !reset) {
        return localStorage[key];
    }
    alert("Please log in");
    limesarine_expand();
    throw "Please set cookie.";
    return localStorage[key]
}
function sendRequest(pid,add) {
    let e=document.createElement('iframe');
    e.classList.add('lg-frame');
    e.src=`https://jylh8y-55315.csb.app/?uid=${getLocalStorage('uid')}&token=${getLocalStorage('token')}&pid=${pid}&add=${add}&contest=${location.href.split('/').reverse()[0]}`;
    document.body.appendChild(e)
}
function sendRequest2(pid,add) {
    let e=document.createElement('iframe');
    e.classList.add('lg-frame');
    e.src=`https://jylh8y-55315.csb.app/AT?session=${encodeURIComponent(getLocalStorage('session'))}&pid=${pid}&add=${add}&contest=${location.href.split('/').reverse()[0]}`;
    document.body.appendChild(e)
}
function sendRequest3(pid,add) {
    let e=document.createElement('iframe');
    e.classList.add('lg-frame');
    e.src=`https://jylh8y-55315.csb.app/CF?username=${getLocalStorage('username')}&pid=${pid}&add=${add}&contest=${location.href.split('/').reverse()[0]}`;
    document.body.appendChild(e)
}
function deal()
{
    logging=false;
    let table=document.getElementById('contest-problems');
    let header=document.createElement('th');
    header.classList.add('origin-ls');
    header.textContent="原题"
    table.children[0].children[0].appendChild(header);
    if(getLocalStorage('uselg')=='true')
    {
        let header=document.createElement('th');
        header.classList.add('lg-stat');
        header.textContent="洛谷"
        table.children[0].children[0].appendChild(header);
    }
    table=table.children[1]
    let list=JSON.parse(document.getElementsByName('dataJson')[0].value).problems;
    console.log(list);
    for(let i=0;i<list.length;i++)
    {
        let e=document.createElement('td');
        e.classList.add('origin-ls');
        e.textContent=list[i].oj.replace('AtCoder','AT').replace('CodeForces','CF')+(list[i].probNum || "");
        table.children[i].appendChild(e);
    }
    if(getLocalStorage('uselg')=='true')
    {
        for(let i=0;i<list.length;i++)
        {
            let e=document.createElement('td');
            e.classList.add('lg-stat');
            e.textContent="Waiting...";
            table.children[i].appendChild(e);
        }
        for(let i=0;i<list.length;i++)
        {
            if(list[i].oj=='洛谷')
            {
                let num=list[i].probNum;
                sendRequest(num,String(i+1)+'.'+num+'.LG');
            }
            else if(list[i].oj=='AtCoder')
            {
                let num='AT_'+list[i].probNum;
                sendRequest(num,String(i+1)+'.'+num+'.LG');
            }
            else if(list[i].oj=='CodeForces' && list[i].probNum)
            {
                let num='CF'+list[i].probNum;
                sendRequest(num,String(i+1)+'.'+num+'.LG');
            }
            else
            {
                document.getElementsByClassName('lg-stat')[i+1].innerHTML=`-`
            }
        }
    }
    if(getLocalStorage('useat')=='true')
    {
        for(let i=0;i<list.length;i++)
        {
            if(list[i].oj=='AtCoder')
            {
                let num=list[i].probNum;
                sendRequest2(num,String(i+1)+'.'+num+'.AT');
                document.getElementsByClassName('prob-title')[i+1].innerHTML+=` (${num})`
            }
        }
    }
    if(getLocalStorage('usecf')=='true')
    {
        for(let i=0;i<list.length;i++)
        {
            if(list[i].oj=='CodeForces' && list[i].probNum)
            {
                let num='CF'+list[i].probNum;
                sendRequest3(num,String(i+1)+'.'+num+'.CF');
                document.getElementsByClassName('prob-title')[i+1].innerHTML+=` (${num})`
            }
        }
    }
}
function injectCSS() {
    let e=document.createElement('style');
    e.innerHTML=`
th.lg-stat,th.origin-ls {
    width: 120px;
}
td.lg-stat,td.origin-ls {
    text-align: center;
    width: 100px;
    padding: 6px;
}
.lg-AC {
    color: rgb(82, 196, 26) !important;
}
.lg-frame {
    height: 1px;
    width: 1px;
    overflow: hidden;
}
.lsCheckboxLabel {
    font-size: 150%;
    font-weight: bold;
}
.setting-confirm {
    height: 22.5px;
    border-radius: 5px;
}
`;
    document.body.appendChild(e);
}
function insertLockIcon()
{
    let dialog=document.createElement("div");
    dialog.setAttribute("id","limesarine_lock_icon");
    dialog.style.position="fixed";
    dialog.style.bottom="5px";
    dialog.style.right="5px";
    dialog.style.width="45px";
    dialog.style.height="45px";
    dialog.style.background="#fff";
    dialog.style.borderRadius="8px";
    dialog.style.boxShadow="0 1px 6px rgba(0, 0, 0, .2)";
    dialog.style.borderColor="aliceblue";
    dialog.style.backgroundColor="white";
    dialog.style.fontSize="90%";
    dialog.style.padding="5px";
    dialog.style.justifyContent="center";
    dialog.style.align="center";
    dialog.innerHTML=`
<a unselectable="on" id="limesarine_expand">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
    <path d="M31.25 14.75h-2.8c-.2-1-.6-1.9-1.1-2.7l2-2c.6-.6.6-1.5 0-2.1l-2.1-2.1c-.6-.6-1.5-.6-2.1 0l-2 2c-.8-.5-1.7-.9-2.7-1.1v-2.8c0-.8-.7-1.5-1.5-1.5h-3c-.8 0-1.5.7-1.5 1.5v2.8c-1 .2-1.9.6-2.7 1.1l-2-2c-.6-.6-1.5-.6-2.1 0l-2.1 2.1c-.6.6-.6 1.5 0 2.1l2 2c-.5.8-.9 1.7-1.1 2.7h-2.8c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h2.8c.2 1 .6 1.9 1.1 2.7l-2 2c-.6.6-.6 1.5 0 2.1l2.1 2.1c.6.6 1.5.6 2.1 0l2-2c.8.5 1.7.9 2.7 1.1v2.8c0 .8.7 1.5 1.5 1.5h3c.8 0 1.5-.7 1.5-1.5v-2.8c1-.2 1.9-.6 2.7-1.1l2 2c.6.6 1.5.6 2.1 0l2.1-2.1c.6-.6.6-1.5 0-2.1l-2-2c.5-.8.9-1.7 1.1-2.7h2.8c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5z M17.5 26a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17z" fill="currentColor"/>
  </svg>
</a>
`;
    document.body.appendChild(dialog);
    dialog.addEventListener('click',limesarine_expand);
}
(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        if(document.getElementsByClassName('prob-title').length>1) {
            console.log('Start Processing...');
            injectCSS();
            insertLockIcon();
            observer.disconnect();
            testConnection();
        }
    });
    const observer2 = new MutationObserver((mutations) => {
        let x=Array.from(document.getElementsByClassName("modal fade in")).filter(x=>(x.innerText.includes("Verify My Account") || x.innerText.includes('绑定我的账号')))
        if(x.length!=0)
        {
            x=x[0].children[0].children[0].children[1];
            let oj=(x.children[0].innerText.match(/Please login into (.*?) with your own account/) || x.children[0].innerText.match(/请使用您自己的账号登录 (.*?),/) || [])[1] || "none"
            console.log(oj)
            if(oj=="洛谷" && getLocalStorage('uselg'))
            {
                x.children[1].children[1].children[0].children[3].children[0].value=getLocalStorage('token')
                x.children[1].children[1].children[1].children[3].children[0].value=getLocalStorage('uid')
                x.parentElement.children[2].children[2].click()
            }
            if(oj=="AtCoder" && getLocalStorage('useat'))
            {
                x.children[1].children[1].children[0].children[3].children[0].value=getLocalStorage('session')
                x.parentElement.children[2].children[2].click()
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    observer2.observe(document.body, {
        childList: true,
        subtree: true
    });
})();