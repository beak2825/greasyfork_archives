// ==UserScript==
// @name         让我康康（b站港澳台搜索补全）
// @namespace    http://tampermonkey.net/
// @version      0.6.0.beta
// @description  修补b站（bilibili，哔哩哔哩）番剧搜索功能，在搜索普通番剧的同时搜索港澳台番剧，将仅限港澳台观看的番剧插入搜索结果最前面，目前略显简陋。
// @author       thunder-sword【b站up主：月雨洛然】
// @match        *://search.bilibili.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require      https://fastly.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/cn2t.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459620/%E8%AE%A9%E6%88%91%E5%BA%B7%E5%BA%B7%EF%BC%88b%E7%AB%99%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%90%9C%E7%B4%A2%E8%A1%A5%E5%85%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459620/%E8%AE%A9%E6%88%91%E5%BA%B7%E5%BA%B7%EF%BC%88b%E7%AB%99%E6%B8%AF%E6%BE%B3%E5%8F%B0%E6%90%9C%E7%B4%A2%E8%A1%A5%E5%85%A8%EF%BC%89.meta.js
// ==/UserScript==
/*
更新日志：
v0.6：这次脚本失效不同往常，报错信息中直接是："风控校验失败"，如果没猜错的话，b站应该完全禁止番剧出差的境内访问了，属于是掀桌子的行为了。既然如此，咱们也不装了，直接用biliplus又不是不能用，现在这个脚本既然没办法起作用了，干脆再起一点小作用，自动跳转到biliplus搜索界面，也不算完全失效不是？这段时间感谢大家的支持了，断断续续更新了也将近一年了，一直都是用爱发电，希望这个脚本帮到了大家，小生也算是有一些成就感了。
v0.5：添加biliplus接口支持，因为b站新策略，导致友方脚本（解除B站区域限制，https://github.com/ipcjs）不能直接在遇到av和bv页面时自动跳转到播放页面，目前友方脚本还没修复这个问题，为了不影响本脚本的使用，只能添加接口支持，自动获取播放地址，若之后修复此问题，可将switch_id参数置0，取消本脚本接口支持；
v0.4：添加简中搜索功能；
v0.3：修复json数据异常错误；
v0.2：将番剧标题数字全部去除，以识别不同集的重复番剧【缺点：番剧本身如果有数字则会漏掉】
*/

/* 全局设置 */
const settings={
    "simplified_search": 1,      //是否打开简中搜索，打开简中搜索可能导致某些番剧搜索失败，各位遇到问题后反馈下；不愿尝试简中搜索就将此参数置0
}

/* 实例作用：繁简转换器 */
// 采用台湾繁体
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
//console.log(converter('漢語'));

function getKeyword() {
    const match = window.location.search.match(/(\?|&)keyword=([^&]+)(&|$)/);
    const keyword = match ? decodeURIComponent(match[2]) : null;
    if (keyword === null) {
        alert("获取keyword失败，无法搜索港澳台");
        throw new Error("获取keyword失败，无法搜索港澳台");
    }
    return keyword;
}

//作用：生成toast，让其在toast_container中，显示在页面中上部，会永久性向页面添加一个id为ths_toast_container的div标签
function showStackToast(message, timeout=3000){
    //没有容器则生成容器
    let box=document.querySelector("body > div#ths_toast_container");
    if(!box){
        box=document.createElement('div');
        box.id="ths_toast_container";
        box.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    right: 10px;
    width: 300px;
    height: auto;
    display: flex;
    z-index: 9999;
    flex-direction: column-reverse;`;
        document.body.appendChild(box);
    }
    //创建toast
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
    padding: 10px;
    background-color: rgb(76, 175, 80);
    color: rgb(255, 255, 255);
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    box-shadow: rgb(0 0 0 / 30%) 0px 5px 10px;
    opacity: 1;
    transition: opacity 0.3s ease-in-out 0s;
    z-index: 9999;
    margin: 5px;
  `;
    box.appendChild(toast);
    toast.style.opacity = 1;
    if(timeout > 0){
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => {
                box.removeChild(toast);
            }, 300);
        }, timeout);
    }
    return toast;
}

async function mainFunction() {
    const flag1 = !settings["show_in_main_page"] && window.location.pathname==="/all";
    if(window.location.pathname==="/bangumi" || window.location.pathname==="/all"){
            let keyword = getKeyword();
            /* 如果开启简中搜索，就将关键字转化为繁体后再搜索 */
            if(settings["simplified_search"]){
                keyword = converter(keyword);
            }
            //console.log(keyword);
            showStackToast("正在尝试打开新窗口");
            window.open(`https://www.biliplus.com/api/do.php?source=bilibili&act=search&o=default&n=20&p=1&word=${keyword}`);
            showStackToast("打开完毕");
            showStackToast("若未打开新窗口请检查弹窗权限");
    }
}

window.addEventListener('load', async () => {
    'use strict';

    //alert("测试");
    let previousUrl = '';
    const observer = new MutationObserver(async function(mutations) {
        /* 去除vt干扰 */
        let nowUrl=window.location.href.replace(/(\?|&)vt=\d+(&|$)/, "&");
        if (nowUrl !== previousUrl) {
            console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
            previousUrl = nowUrl;
            await mainFunction();
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
});