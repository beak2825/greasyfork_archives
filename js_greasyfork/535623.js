// ==UserScript==
// @name         讓 YouTube 的推薦影片變回4個一行
// @name:en      Change YouTube's recommended videos back to 4 rows
// @namespace    http://tampermonkey.net/
// @version      2025-05-11 1.10
// @description  這個腳本會將YouTube的推薦影片從三個一排，變回四個一排
// @description:en This script will change YouTube's recommended videos from three in a row to four in a row
// @author       bahamutID：ra45388791
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wayne-blog.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535623/%E8%AE%93%20YouTube%20%E7%9A%84%E6%8E%A8%E8%96%A6%E5%BD%B1%E7%89%87%E8%AE%8A%E5%9B%9E4%E5%80%8B%E4%B8%80%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/535623/%E8%AE%93%20YouTube%20%E7%9A%84%E6%8E%A8%E8%96%A6%E5%BD%B1%E7%89%87%E8%AE%8A%E5%9B%9E4%E5%80%8B%E4%B8%80%E8%A1%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let IronIndex = 0
    let VideoCount = 0
    const rowBtnCount = 4
    let lastPath = ""
    // let settime

    new MutationObserver((e) => {

        if (location.pathname !== "/") {
            //切換頁面行為重置影片數量觸發機制
            if (document.VideoCount !== 0) {
                document.VideoCount = 0
            }
            return;
        }
        let cnt = document.querySelector("#contents");

        //狀態檢查
        //是否渲染過
        if (cnt.dataset.isActiveScript === "true") {
            //是否變更過推薦類別
            // if (IronIndex === activeIronIndex) {
            //     console.log("推薦中止")
            //     return;
            // }
            //影片數量是否不同
            if (cnt.children.length === document.VideoCount) {
                //第8位是否是非影片按鈕
                if (cnt.children[8].tagName === "YTD-RICH-SECTION-RENDERER") {
                    return;
                }
            }
        }
        //設定狀態
        cnt.dataset.isActiveScript = "true"
        // IronIndex = activeIronIndex
        cnt.style = `--ytd-rich-grid-items-per-row: ${rowBtnCount};`

        if (document.settime !== undefined) {
            clearInterval(document.settime)
        }
        //確保頁面渲染完成
        document.settime = setInterval(() => {
            // const lastVideoSrc = cnt.children[0].querySelector("#thumbnail yt-image img")
            // console.log("1:" + lastVideoSrc)
            // console.log("2:" + document.lastVideo)
            // if (document.lastVideo !== lastVideoSrc) {
            //     document.VideoCount = 0
            //     document.lastVideo = lastVideoSrc
            // }


            checkStructure(cnt)
            clearInterval(document.settime)
        }, 500);

    }).observe(document, {
        childList: true,
        // attributes: true,
        subtree: true
    });

})();


function checkStructure(cnt) {
    let cntBtns = cnt.children

    //第8位沒有 isSet 判斷結構改變
    if (cnt.children.length > 8 && cnt.children[8].dataset.isSet !== "true") {
        const tagCount = Array.from(cnt.children).filter(e => { return e.tagName === "YTD-RICH-SECTION-RENDERER" }).length
        if (tagCount !== 0) {
            document.VideoCount = 0
        }
    }
    //影片數量是否不同
    if (cnt.children.length === document.VideoCount) {
        return;
    }

    if (cntBtns.length > 4) {
        let count = cnt.children.length

        //影片數量變更時重新定位
        for (let btn of cntBtns) {
            if (btn.dataset.isSet === "true") {
                btn.dataset.isSet = ""
            }
        }
        document.VideoCount = count
        //移動節點
        moveElement()
    }
}



//取得目前推薦類別序號
function getIronIndex() {
    const irons = document.querySelectorAll("#chips > yt-chip-cloud-chip-renderer")

    for (let i = 0; i < irons.length; i++) {
        const haveClass = irons[i].classList.contains("iron-selected")
        if (haveClass) {
            return i + 1
        }
    }
    return 0
}

function moveElement() {
    let cnt = document.querySelector("#contents").children;
    let count = 0;   //待移動節點數量
    if (cnt.length < 9) { return }

    //把節點移到最後
    for (let i = 0; i < cnt.length; i++) {
        const e = cnt[i];
        if (e.tagName === "YTD-RICH-SECTION-RENDERER") {
            if (e.dataset.isSet !== "true") {       //已定位不允許再移動
                e.parentNode.insertBefore(e, cnt[cnt.length - 1])
                count++
            }
        }
    }

    //移動節點
    let setIndex = 0
    for (let i = 0; i < count; i++) {
        let index
        //紀錄需要移動的節點
        for (let j = setIndex; j < cnt.length; j++) {
            const e = cnt[j];
            if (e.tagName === "YTD-RICH-SECTION-RENDERER") {
                if (e.dataset.isSet !== "true") {   //已定位不允許再移動
                    index = j
                    break;
                }
            }
        }

        //以8個為一組
        setIndex += 8 + i

        const targetIndex = cnt[index]
        //將 targetIndex 移動到 setIndex 之前
        cnt[0].parentNode.insertBefore(targetIndex, cnt[setIndex])
        //該節點狀態設為已定位
        targetIndex.dataset.isSet = "true"
    }
}
