// ==UserScript==
// @name         小説を読もう ブロック機能
// @namespace    http://tampermonkey.net/
// @version      2024-11-05
// @description  作品単体のブロック機能です
// @author       ぐらんぴ
// @match        https://yomou.syosetu.com/search.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syosetu.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516505/%E5%B0%8F%E8%AA%AC%E3%82%92%E8%AA%AD%E3%82%82%E3%81%86%20%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/516505/%E5%B0%8F%E8%AA%AC%E3%82%92%E8%AA%AD%E3%82%82%E3%81%86%20%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

let $s = (el) => document.querySelector(el),
    $sa = (el) => document.querySelectorAll(el),
    $c = (el) => document.createElement(el),
    $a = (el) => document.body.appendChild(el),
    log = console.log,
    syosetu = GM_getValue("blocked", []);
log(syosetu)
// delete all:  syosetu = []; GM_setValue("blocked", syosetu);
let searchForm = $s("#searchForm"),
    span = $c('span'),
    n = 0
span.innerHTML = `このページでは${n}件の小説をブロックしました。<span class="displayBox" style="color: #03c; cursor: pointer;">表示する</span>`
searchForm.appendChild(span)
///----------------------------///
let tables = $sa(".searchkekka_box > table")
tables.forEach(table =>{
    let findBlockedShosetu = syosetu.findIndex(({ novel }) => novel === table.closest("div").childNodes[5].href)
    if(findBlockedShosetu !== -1){
        table.closest('div').style.backgroundColor = "beige"
        table.closest('div').style.display = "none"
        n++
    }
    // ブロック button function
    let btn = $c('span')
    btn.innerHTML = `／<button>ブロック</button>`
    btn.onclick = e =>{
        let target = e.target.closest('div'),
            tagetHref = target.childNodes[5].href,
            val = {
                novel: tagetHref,
            }
        if(e.target.textContent == "ブロック"){
            if(syosetu.findIndex(({ novel }) => novel === tagetHref) === -1){
                syosetu.push(val);
                log("pushed: ", val)
                n++
                target.style.backgroundColor = "beige"
                target.style.display = "none"
            }
        }else{
            let restore = syosetu.findIndex(({ novel }) => novel === tagetHref);
            syosetu.splice(restore, 1);
            n--
            target.style.backgroundColor = ""
            table.closest('div').querySelector('span > button').textContent = "ブロック"
        }
        GM_setValue("blocked", syosetu);
        // update n
        span.innerHTML = `このページでは${n}件の小説をブロックしました。<span class="displayBox" style="color: #03c; cursor: pointer;">表示する</span>`
        searchForm.appendChild(span)
        displayBox()
    }
    table.before(btn)
});
// set span.innerHTML again
span.innerHTML = `このページでは${n}件の小説をブロックしました。<span class="displayBox" style="color: #03c; cursor: pointer;">表示する</span>`
searchForm.appendChild(span)
//
function displayBox(){
    $s(".displayBox").onclick = e =>{
        if(e.target.className == "displayBox"){
            tables.forEach(table =>{
                table.closest('div').style.display = ""
                if(table.closest('div').style.backgroundColor == "beige"){
                    table.closest('div').querySelector('span > button').textContent = "ブロック解除"
                }
            });
            e.target.textContent = "表示しない"
            e.target.classList.add("show");
        }else{
            tables.forEach(table =>{
                if(table.closest('div').style.backgroundColor == "beige"){
                    table.closest('div').style.display = "none"
                }
            });
            e.target.classList.remove("show");
            e.target.textContent = "表示する"
        }
    };
}displayBox()