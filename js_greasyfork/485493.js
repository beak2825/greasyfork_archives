// ==UserScript==
// @name         馒头筛种脚本
// @namespace    http://tampermonkey.net/
// @version      2024-01-13
// @description  用于m-team筛选符合体积大小的种子并自动复制下载链接
// @author       NGDXW
// @match        https://kp.m-team.cc/torrents.php*
// @match        https://xp.m-team.io/torrents.php*
// @match        https://xp.m-team.cc/torrents.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/485493/%E9%A6%92%E5%A4%B4%E7%AD%9B%E7%A7%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485493/%E9%A6%92%E5%A4%B4%E7%AD%9B%E7%A7%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    let panel=document.createElement('div');
    panel.style.background='#ffffff';
    panel.style.width='240px';
    panel.style.height='360px';
    panel.style.border='2px solid #2083fd';
    panel.style.position='fixed';
    panel.style.top='calc(20% - 20px)';
    panel.style.left='7px';
    panel.style.display='none';
    panel.style.borderRadius='4px';
    panel.style.textAlign='center';
    panel.innerHTML ='<p><img src=\'./favicon.ico\' width=\'20px\'/>筛种</p><p> Passkey: <input style=\'display:inline\' placeholder=\'Passkey\' id=\'filter_passkey\' /></p>';
    panel.innerHTML+='<p>最小体积: <input style=\'display:inline\' placeholder=\'最小体积（KB）\' id=\'filter_min_size\' /></p>';
    panel.innerHTML+='<p>最大体积: <input style=\'display:inline\' placeholder=\'最大体积（KB）\' id=\'filter_max_size\' /></p>';
    panel.innerHTML+='<p><button id=\'filter_btn\'>筛选</button></p>';
    panel.innerHTML+='<p><textarea style=\'width:220px;height:120px\' id=\'filter_res\' placeholder=\'筛选结果\'></textarea></p>';
    panel.innerHTML+='<p id=\'filter_notice\' style=\'display:none\'>已自动复制到剪贴板</p>';
    let btn=document.createElement('div');
    btn.style.background='rgba(255,255,255,.8)';
    btn.style.borderRadius='0 4px 4px 0';
    btn.style.width='20px';
    btn.style.height='60px';
    btn.style.position='fixed';
    btn.style.left='10px';
    btn.style.top='20%';
    btn.style.border='1px solid #2083fd';
    btn.style.lineHeight='58px';
    btn.style.textAlign='center';
    btn.style.fontSize='14px';
    btn.style.color='#2083fd';
    btn.style.userSelect='none';
    btn.style.display='block';
    btn.innerHTML='▶';
    btn.onclick=()=>{
        if(btn.innerHTML=='▶'){
            btn.innerHTML='◀';
            btn.style.left='250px';
            panel.style.display='block';
        }else{
            btn.innerHTML='▶';
            btn.style.left='10px';
            panel.style.display='none';
        }
    };
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    let xhr=new XMLHttpRequest();
    xhr.open('POST','./getrss.php',false);
    xhr.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('inclbookmarked=0&showrows=10&https=1');
    let res=xhr.responseText;
    let l=res.indexOf('passkey=')+8;
    let r=l+32;
    res=res.substring(l,r)
    document.getElementById('filter_passkey').value=res;
    document.getElementById('filter_btn').onclick=()=>{
        let passkey=document.getElementById('filter_passkey').value;
        let min_size=document.getElementById('filter_min_size').value;
        let max_size=document.getElementById('filter_max_size').value;
        if(passkey=='' || min_size=='' || max_size==''){
            alert('Error');
            return;
        }
        let torrents=Array.from(document.getElementsByClassName('torrents')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
        torrents.shift();
        let downloads='';
        torrents.forEach((e,i)=>{
            if(i%2==0){
                let url=e.getElementsByTagName('a')[2].href;
                url=url.replace('details','download');
                url=url.replace('hit=1','https=1');
                url+='&passkey='+passkey
                let size=e.getElementsByTagName('td')[7].innerText.split('\n');
                size[0]=parseFloat(size[0]);
                switch(size[1]){
                    case 'MB':
                        size[0]*=1024;
                        break;
                    case 'GB':
                        size[0]*=1048576;
                        break;
                    case 'TB':
                        size[0]*=1073741824;
                        break;
                }
                size=size[0];
                if(parseInt(size)>parseInt(min_size) && parseInt(size)<parseInt(max_size)){
                    downloads+=url+'\n';
                }
            }
        });
        let textarea = document.getElementById("filter_res");
        textarea.value = downloads;
        textarea.select();
        document.execCommand('copy');
        document.getElementById('filter_notice').style.display='block';
    };
})();