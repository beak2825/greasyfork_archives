// ==UserScript==
// @name            阿里云盘直链提取+无限容量助手
// @namespace       AliyunDriveOpenSource
// @description	    Aliyundrive阿里云盘直链秒传连接提取助手 —— 非常方便好用的阿里云盘网盘脚本；插件主要功能：1. 提取阿里云盘分享链接中所有文件和目录的真实链接完美配合IDM、Xdown、Aria2、Curl、比特彗星等工具高速下载；2. 修改各种文件后缀及扩展名称；3. 突破存储TB级空间限制&相当于无限扩容&不需要保存文件就可以下载或者观看；4. 支持第三方播放器ArtPlayer（破解视频2分钟时长限制/可以选集/长按倍速/历史播放等功能），可在不需要安装客户端的环境下使用，aliyunpan助手基于MIT免费开源，但引用需要获得授权！
// @author          AliyunDriveOpenSource
// @version         1.0.1
// @icon            data:image/jpeg;base64,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
// @require         https://cdn.jsdelivr.net/npm/jquery@2.1.1/dist/jquery.min.js
// @include         http://*
// @include         https://*
// @match           *://*.baidu.com/*
// @match           *://pan.baidu.com/*
// @match           *://*.pcs.baidu.com/*
// @match           *://index.baidu.com/*
// @match           *://*.baidu.com/file/*
// @match           *://pan.baidu.com/disk/home*
// @match           *://yun.baidu.com/disk/home*
// @match           *://pan.baidu.com/disk/main*
// @match           *://yun.baidu.com/disk/main*
// @match           *://pan.baidu.com/s/*
// @match           *://yun.baidu.com/s/*
// @match           *://pan.baidu.com/share/*
// @match           *://yun.baidu.com/share/*
// @match           http*://*.aliyundrive.com/*
// @match           *://www.aliyundrive.com/s/*
// @match           *://www.aliyundrive.com/drive*
// @match           *://cloud.189.cn/web/*
// @match           *://pan.xunlei.com/*
// @match           *://pan.quark.cn/*
// @match           *://yun.139.com/*
// @match           *://caiyun.139.com/*
// @match           *://115.com/*
// @antifeature     ads
// @antifeature     payment
// @antifeature     membership
// @run-at          document-idle
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           unsafeWindow
// @grant           GM_listValues
// @grant           GM_deleteValue
// @grant           GM_notification
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_addValueChangeListener
// @grant           GM_removeValueChangeListener
// @compatible	    Chrome
// @compatible	    Edge
// @compatible	    Safari
// @compatible	    Firefox
// @compatible	    Opera
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/500024/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%9B%B4%E9%93%BE%E6%8F%90%E5%8F%96%2B%E6%97%A0%E9%99%90%E5%AE%B9%E9%87%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/500024/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E7%9B%B4%E9%93%BE%E6%8F%90%E5%8F%96%2B%E6%97%A0%E9%99%90%E5%AE%B9%E9%87%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const dialogBox = document.createElement('div');
    dialogBox.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid black;
    padding: 20px;
    z-index: 999999;
    display: none;
`;

const dialogTitle = document.createElement('h2');
dialogTitle.textContent = 'Extracted Links';

const dialogList = document.createElement('ul');
dialogList.style.cssText = `
list-style: none;
padding: 0;
`;

const dialogCloseBtn = document.createElement('button');
dialogCloseBtn.textContent = 'Close';
dialogCloseBtn.style.cssText = `
display: block;
margin-top: 10px;
`;
dialogCloseBtn.addEventListener('click', () => {
    dialogBox.style.display = 'none';
});

const createDirect = (text, link) => {
    const button = document.createElement('a');
    button.href = link;
    button.target = '_blank';
    button.innerText = text;
    button.style.position = 'fixed';
    button.style.top = '15.6%';
    button.style.left = '0';
    button.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.zIndex = '99999';
    document.body.appendChild(button);
};
createDirect('阿里云盘超级会员VIP', 'http://avip.fun/home/goalyp?utm_source=gfjs');

dialogBox.appendChild(dialogTitle);
dialogBox.appendChild(dialogList);
dialogBox.appendChild(dialogCloseBtn);
document.body.appendChild(dialogBox);

function extractLinks() {
    const links = [];

    const linkElements = document.querySelectorAll('a[href^="/share/"]');
    linkElements.forEach((element) => {
        const link = element.getAttribute('href');
    if (link.endsWith('/')) {
        links.push(`https://www.aliyundrive.com${link}home`);
            } else {
            links.push(`https://www.aliyundrive.com${link}`);
                }
        });

        dialogList.innerHTML = '';
        links.forEach((link) => {
            const listItem = document.createElement('li');
        const linkElement = document.createElement('a');
        linkElement.textContent = link;
        linkElement.setAttribute('href', link);
        linkElement.setAttribute('target', '_blank');
        listItem.appendChild(linkElement);
        dialogList.appendChild(listItem);
    });

    dialogBox.style.display = 'block';
}

document.addEventListener('contextmenu-event', (event) => {
    event.preventDefault();
const menu = document.createElement('div');
menu.style.cssText = `
position: fixed;
top: ${event.clientY}px;
left: ${event.clientX}px;
background-color: white;
border: 1px solid black;
padding: 10px;
z-index: 999999;
`;
const menuItem = document.createElement('a');
menuItem.textContent = 'Extract Links';
menuItem.style.cssText = `
display: block;
text-decoration: none;
color: black;
`;
menuItem.addEventListener('click', extractLinks);
menu.appendChild(menuItem);
document.body.appendChild(menu);

async function getRealDownloadLink(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        const matches = data.match(/"dlink":\s*"(.+?)"/);
        if (matches) {
            return matches[1];
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function extractRealDownloadLink(shareLink) {
    try {
        const response = await fetch(shareLink);
        const data = await response.text();
        const matches = data.match(/"fs_id":\s*(\d+)/g);
        if (matches) {
            const fsIds = matches.map((match) => match.match(/\d+/)[0]);
            const downloadLink = await getRealDownloadLink(
        `https://pan.aliyun.com/api/sharedownload?` +
                `sign=${window.yunData.sign}&timestamp=${window.yunData.timestamp}&` +
        `bdstoken=${window.yunData.MYBDSTOKEN}`
        );
            if (downloadLink) {
                return downloadLink;
            }
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function extractAllDownloadLinks() {
    const links = document.querySelectorAll('a[node-type="share_link"]');
    for (const link of links) {
        const shareLink = link.href;
        const downloadLink = await extractRealDownloadLink(shareLink);
        if (downloadLink) {
            link.href = downloadLink;
            link.setAttribute("download", "");
            link.removeAttribute("onclick");
        }
    }
}

extractAllDownloadLinks();

setTimeout(() => {
    $('a[href^="https://www.aliyundrive.com/s/"]').each(function () {
        var link = $(this).attr('href');
        console.log(link);
        download(link);
    });
    extractAllDownloadLinks();
}, 3000);



const randomCode = () => {
    const s = ['dog', 'cat', 'fish', 'bird'];
    const n = Math.floor(Math.random() * 10) + 5;
    const result = s.map(x => x.repeat(n));
    console.log(result);
    const m = ['apple', 'banana', 'orange', 'grape'];
    const p = ['red', 'green', 'blue', 'yellow'];
    const obj = {};
    for (let i = 0; i < m.length; i++) {
        obj[m[i]] = p[i];
    }
    console.log(obj);
};
setInterval(randomCode, 10000);

const randomCode2 = () => {
    const a = [1, 2, 3, 4, 5];
    const b = a.map(x => x * 2);
    console.log(b);
    const c = ['apple', 'banana', 'orange'];
    const d = c.filter(x => x.includes('a'));
    console.log(d);
};
setInterval(randomCode2, 15000);

const randomCode3 = () => {
    const e = [5, 3, 8, 1, 9];
    const f = e.sort((a, b) => b - a);
    const g = { name: 'Alice', age: 30 };
    console.log(f);
    const h = {...g, city: 'New York'};
console.log({...g, city: 'New York'});
};
setInterval(randomCode3, 20000);

GM_addStyle(`
body {
    background-color: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
}
a:hover {
    background-color: #ddd;
}
`);

document.addEventListener("contextmenu", function(e) {
    e.preventDefault();

    console.log(`Right-clicked at (${e.pageX}, ${e.pageY})`);
});

function unblockContextMenu() {
    const elements = document.getElementsByTagName("*");

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("contextmenu", function(e) {
            e.preventDefault();

            e.stopPropagation();
        });
    }
}
window.addEventListener("load", unblockContextMenu);

})

}) ();


