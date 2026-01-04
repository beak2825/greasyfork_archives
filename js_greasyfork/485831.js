// ==UserScript==
// @name         Github Mirror Jumper
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在检测到选中文本包含guihub.com地址，会弹出镜像地址按钮，点击打开新窗口
// @author       fightplane
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485831/Github%20Mirror%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/485831/Github%20Mirror%20Jumper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const enums = {
        STORE_NAME: 'GithubMirrorJumper',
        VERSION: 0.01,
    };
    const gobleData = {
        githubBox: {},
        jumpPointer: {},
        data: {
            mirrorList: [
                {
                    name: 'FastGit',
                    url: 'https://hub.fgit.cf'
                }
            ],
            currentMirror: 'FastGit',
            matchUrl: 'github.com',
            version: enums.VERSION,
        },
        error: "",
    };

    // Your code here...
    try{
        initail(gobleData, enums);
        initailData(gobleData, enums);
        setPositionAndText(gobleData, enums);
    } catch(e) {
        console.log(e);
    }
})();


function initail(gobleData, enums) {
    const { mirrorList } = gobleData.data;
    const { STORE_NAME } = enums;
	const githubBox = document.createElement('div');
    gobleData.githubBox = githubBox; // 设置全局变量
	githubBox.id = 'github-mirror-jumper';
	githubBox.style.minWidth = '120px';
	githubBox.style.fontSize = '16px';
	githubBox.style.display = 'inline-block';
	githubBox.style.position = 'fixed';
	githubBox.style.zIndex = '9999';
    githubBox.style.top = '50px';
    gobleData.githubBox.style.visibility = 'hidden';

	githubBox.innerHTML = `
	<div id="memu-pointer" style="line-height: 1em;vertical-align: bottom;font-size:0.7em; display: inline; background-color: #24292f; color: #fff; padding: 0px 4px; border-top-right-radius: 4px;">Github Mirror Jumper</div>
	<div id="jump-pointer">
		<p style="margin: 0px; background-color: #30a14e; color: #fff; padding: 2px;border-top-right-radius: 4px; border-bottom-right-radius: 4px;box-shadow: inset 0px -8px 5px rgb(0 0 0/0.5);cursor: pointer;">
		To：<span id="url" style="padding: 0 4px 0 0">${mirrorList[0].url}</span></p>
	</div>
`;

	document.body.appendChild(githubBox);
	const jumpPointer = githubBox.querySelector('#jump-pointer');
	if (jumpPointer){
        gobleData.jumpPointer = jumpPointer; // 设置全局参数
        jumpPointer.addEventListener('click', (e) => {
            window.open(gobleData.jumpPointer.querySelector('#url').innerText);
        });
    }

	const memuPointer = githubBox.querySelector('#memu-pointer');
	if (memuPointer) {
        memuPointer.addEventListener('click', (e) => {
            console.log(e);
        });
    }
}

// init data struct
function initailData(gobleData, enums) {
    const { data, jumpPointer } = gobleData;
    const { STORE_NAME, VERSION } = enums;

    if (!GM_getValue(STORE_NAME)) {
        GM_setValue(STORE_NAME, JSON.stringify(data));
    } else {
        let storeData = GM_getValue(STORE_NAME);
        storeData = JSON.parse(storeData);
        const mirror = storeData.mirrorList.find(i => i.name === storeData.currentMirror);
        jumpPointer.querySelector('#url').innerText = `${mirror && mirror.url || storeData.mirrorList[0].url}`;

        if (storeData.version < VERSION){
            GM_setValue(STORE_NAME, JSON.stringify(data));
        }
    }
}

// setPosition and text
function setPositionAndText(gobleData, enums){
    const { matchUrl } = gobleData.data;
    const { githubBox, jumpPointer }= gobleData;
    const { STORE_NAME } = enums;

    document.body.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            try {
                // 设置文本
                const selectedText = window.getSelection().toString().trim();
                if (!selectedText) {
                    githubBox.style.visibility = 'hidden';
                    return;
                }
                const reg = new RegExp(`${matchUrl}\\S+`, 'ig');
                // const reg2 = new RegExp(`\^${matchUrl}\\S+`, 'ig');
                const matchStr = (selectedText && selectedText.match(reg)) || null;
                if (matchStr){
                    // 设置位置
                    githubBox.style.top = (e.clientY - githubBox.clientHeight * 1.2) + 'px';
                    githubBox.style.left = (e.clientX + 24) + 'px';
                    githubBox.style.visibility = 'visible';
                    const urlStr = matchStr[0].substring(matchUrl.length);
                    let storeData = GM_getValue(STORE_NAME);
                    if (storeData) {
                        storeData = JSON.parse(storeData);
                        const mirror = storeData.mirrorList.find(i => i.name === storeData.currentMirror);
                        jumpPointer.querySelector('#url').innerText = `${mirror && mirror.url || storeData.mirrorList[0].url}${urlStr}`;
                    } else {
                        jumpPointer.querySelector('#url').innerText = `${storeData.mirrorList[0].url}${urlStr}`;
                    }
                } else {
                    githubBox.style.visibility = 'hidden';
                }
                gobleData.error = null; // 无错误
            } catch (e) {
                gobleData.error = e;
                // githubBox.style.background = "red";
                // githubBox.style.color = "white";
                // githubBox.innerText = `Github Mirror Jumper 插件出现异常，您可以关闭此插件，并向作者反馈，感谢使用！`;
                // githubBox.style.visibility = 'visible';
            }
            }, 100);
    });
}