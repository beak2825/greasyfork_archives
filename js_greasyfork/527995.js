// ==UserScript==
// @name        百度地图 tpov 插件
// @namespace   Violentmonkey Scripts
// @match       *://map.baidu.com/*
// @match       *://maps.baidu.com/*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description 一键将百度地图显示的公交线路导入 tpov_extract 脚本
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/527995/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%20tpov%20%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/527995/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%20tpov%20%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

const tpovBtnId = "tpovExportBtn";
const tpovBtn = document.createElement("div");
tpovBtn.id = tpovBtnId;
tpovBtn.style.display = "inline-block";
tpovBtn.style.float = "left";
tpovBtn.innerHTML = `
    <a class="ui3-city-change-inner" style="padding: 0px 12px !important; color: black !important; font-weight: bold !important;">tpov 导出</a>
`;
tpovBtn.addEventListener("click", (ev) => {
    const params = new URLSearchParams(window.location.search);
    const tpovExport = `python tpov_extract.py baidu tpov-${params.get("sug_forward")}-${params.get("wd2")}-${SECKEY} baidu_extract.json`;
    navigator.clipboard.writeText(tpovExport);
    alert("以拷贝 " + tpovExport);
});

const observer = new MutationObserver((muts) => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("wd2") && params.has("sug_forward")) {
        const ctrlWrap = document.getElementById("ui3_control_wrap");
        if (ctrlWrap && !ctrlWrap.contains(tpovBtn)) {
            const cityBtn = document.getElementById("ui3_city_change");
            cityBtn.parentNode.insertBefore(tpovBtn, cityBtn.nextSibling);
        }
    } else {
        tpovBtn.remove();
    }
});

observer.observe(document.body, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree:true
});