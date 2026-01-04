// ==UserScript==
// @name         Google Meet 自動加入 & 接受
// @name:en      Google Meet auto join & accept
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Google Meet 自動加入 & 接受 & 重起
// @description:en  Google Meet auto join & accept & restart
// @author       YC白白
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/437352/Google%20Meet%20%E8%87%AA%E5%8B%95%E5%8A%A0%E5%85%A5%20%20%E6%8E%A5%E5%8F%97.user.js
// @updateURL https://update.greasyfork.org/scripts/437352/Google%20Meet%20%E8%87%AA%E5%8B%95%E5%8A%A0%E5%85%A5%20%20%E6%8E%A5%E5%8F%97.meta.js
// ==/UserScript==

// v1.0
// v2.0 解決多人申請加入時，能全部接受
// v2.1 修復bug，使中文以外使用者也能使用

//存Google Meet原始網址
let url = window.location.href;
url = url.slice(0,36);

setInterval(function() {
    console.log("start")
    // document.querySelector("div.uArJ5e.UQuaGc.kCyAyd.QU4Gid.xKiqt.cd29Sd").tabIndex => 0 = "要求加入" or "立即加入"  -1 = "joining..."
    if (document.querySelector("div.uArJ5e.UQuaGc.kCyAyd.QU4Gid.xKiqt.cd29Sd") && document.querySelector("div.uArJ5e.UQuaGc.kCyAyd.QU4Gid.xKiqt.cd29Sd").tabIndex) {
        // 不做任何事
        console.log("joining...")
    } else {
        console.log("not joining...")
        // 若有，則自動點 "查看全部" or "全部接受" or "接受"       
        if (document.querySelectorAll("div.U26fgb.O0WRkf.oG5Srb.C0oVfc.kHssdc.zLRJne.M9Bg4d")[1]) {
            document.querySelectorAll("div.U26fgb.O0WRkf.oG5Srb.C0oVfc.kHssdc.zLRJne.M9Bg4d")[1].click()
            console.log(document.querySelectorAll("div.U26fgb.O0WRkf.oG5Srb.C0oVfc.kHssdc.zLRJne.M9Bg4d")[1].innerText)  // "查看全部" or "全部接受" or "接受"
        }

        //輸出"你已結束整場會議"or"這場會議超過時間上限"
        if (document.querySelector("button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.CX8SS.ctOmyb")) {
            console.log("find", document.getElementsByClassName("roSPhc")[0].innerHTML)  // find "你已結束整場會議"or"這場會議超過時間上限"
            //回到url
            // window.location.href = url
            console.log("back to", url)
        }

        //輸出"要求加入"
        let wantJoin = document.querySelector("div.uArJ5e.UQuaGc.Y5sE8d.uyXBBb.xKiqt")
        if (wantJoin) {            
            console.log(`偵測到 "${wantJoin.innerText}" 的頁面`)  // "要求加入" or "立即加入"
            //若mic開起時，則關閉mic
            let mic = document.querySelectorAll("div.U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d")[0]
            if (mic.dataset["isMuted"] === "false") {
                mic.click()
                console.log("已關閉麥克風")
            }
            
            //若camera開起時，則關閉camera
            let camera = document.querySelectorAll("div.U26fgb.JRY2Pb.mUbCce.kpROve.yBiuPb.y1zVCf.M9Bg4d")[1]
            if (camera.dataset["isMuted"] === "false") {
                camera.click()
                console.log("已關閉視訊鏡頭")
            }

            //按一下"要求加入"or"立即加入"
            wantJoin.click()
            console.log(`按一下 "${wantJoin.innerText}"`)
        }
    }
    console.log("end")
}, 1000);