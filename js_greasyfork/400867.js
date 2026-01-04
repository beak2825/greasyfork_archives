// ==UserScript==
// @name         A 站视频缓存 视频链接解析
// @namespace 	 czzonet
// @version      1.1.1
// @description  谁不想在遇到好视频的时候能够缓存下来呢？
// @author       czzonet
// @include      *://www.acfun.cn/v/ac*
// @include      *://www.acfun.cn/bangumi/aa*
// @exclude      *://*.eggvod.cn/*
// @connect      www.acfun.cn
// @license      MIT License
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/400867/A%20%E7%AB%99%E8%A7%86%E9%A2%91%E7%BC%93%E5%AD%98%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/400867/A%20%E7%AB%99%E8%A7%86%E9%A2%91%E7%BC%93%E5%AD%98%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
// 等待页面加载完毕
window.onload = function () {
    // 插入到标题
    let descriptionElement = document.getElementsByClassName("video-description clearfix")[0];
    // 创建一个按钮节点
    let oButNode = nodeButton("获取链接");
    oButNode.onclick = function () {
        const dataVideos = getlink();
        if (!dataVideos) {
            descriptionElement.appendChild(nodeText(`解析播放器数据源失败！`));
        }
        else {
            // descriptionElement.appendChild(nodeText(`视频共${dataVideos.length}P`));
            for (let i = 0; i < dataVideos.length; i++) {
                // descriptionElement.appendChild(nodeText(`---`));
                // descriptionElement.appendChild(nodeText(`第${i + 1}P`));
                const representation = dataVideos[i].representation;
                for (let j = 0; j < representation.length; j++) {
                    const dataVideo = representation[j];
                    const url = dataVideo.url;
                    const qualityLabel = dataVideo.qualityLabel;
                    descriptionElement.appendChild(nodeText(`【${qualityLabel}】\n${url}`));
                }
            }
        }
    };
    descriptionElement.appendChild(oButNode);
};
// type Target = {
//   pagrInfo:any
// }
// type MyWindow = typeof that& Target
// 解析链接
function getlink() {
    // 获取当前window
    let pageWindow = this.window;
    // 视频链接的json对象
    const ksPlay = JSON.parse(pageWindow.pageInfo.currentVideoInfo.ksPlayJson);
    if (!ksPlay) {
        console.log("解析播放器数据源失败！");
    }
    else {
        const dataVideos = ksPlay.adaptationSet;
        // console.log("视频共" + dataVideos.length + "P");
        for (let i = 0; i < dataVideos.length; i++) {
            // console.log("---");
            // console.log(`第${i + 1}P`);
            const representation = dataVideos[i].representation;
            for (let j = 0; j < representation.length; j++) {
                const dataVideo = representation[j];
                const url = dataVideo.url;
                const qualityLabel = dataVideo.qualityLabel;
                console.log(`【${qualityLabel}】${url}`);
            }
        }
    }
    return ksPlay.adaptationSet;
}
// 创建一个文字节点
function nodeText(text) {
    let textNode = document.createElement("div");
    textNode.innerText = text;
    return textNode;
}
// 创建一个按钮节点
function nodeButton(text) {
    let oButNode = document.createElement("input");
    oButNode.type = "button";
    oButNode.value = text;
    oButNode.style.margin = "10px";
    oButNode.style.borderWidth = "1px";
    oButNode.style.paddingTop = "5px";
    oButNode.style.paddingBottom = "5px";
    oButNode.style.paddingLeft = "10px";
    oButNode.style.paddingRight = "10px";
    oButNode.style.backgroundColor = "#5e64ff";
    oButNode.style.color = "#fff";
    oButNode.style.fontSize = "12px";
    oButNode.style.lineHeight = "1.5";
    oButNode.style.borderRadius = "3px";
    oButNode.style.borderColor = "#444bff";
    oButNode.style.display = "block";
    oButNode.style.cursor = "pointer";
    return oButNode;
}
//# sourceMappingURL=index.js.map