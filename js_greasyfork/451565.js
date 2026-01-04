// ==UserScript==
// @name                易班一键删除&解绑-JHPatchouli
// @namespace           https://bbs.tampermonkey.net.cn/
// @version             0.1.1
// @description         一键删除&解绑
// @author              JHPatchouli
// @match               https://mp.yiban.cn/app/org-certification/list/*
// @downloadURL https://update.greasyfork.org/scripts/451565/%E6%98%93%E7%8F%AD%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E8%A7%A3%E7%BB%91-JHPatchouli.user.js
// @updateURL https://update.greasyfork.org/scripts/451565/%E6%98%93%E7%8F%AD%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E8%A7%A3%E7%BB%91-JHPatchouli.meta.js
// ==/UserScript==

(function () {
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    'use strict';
    let divObj = document.createElement('div');
    divObj.innerHTML = '<h3 style="color: white;">易班一键解绑&删除-JHPatchouli</h3><h4 style="color: black;"><b>数据无价谨慎操作</b></h4><button id="btnx" style="width: 80px;height: 40px;">解绑</button><button id="btny" style="width: 80px;height: 40px;">删除</button>';
    divObj.style = "position: fixed;z-index: 999;top: 0px;margin: 0px auto;text-align: center;width: 1900px;";
    //把div添加到body作为他的子元素
    document.body.appendChild(divObj);
    btnx.addEventListener('click', async function () {
        try {
            var pagelen = Number(document.getElementsByClassName("mdc-data-table__pagination-navigation")[0].getElementsByClassName("mdc-data-table__pagination-page")[0].children[4].innerText);
        }
        catch (err) {
            var pagelen = Number(1)
        }
        for (let l = 1; l <= pagelen; l++) {
            var std_tab = document.getElementsByClassName("mdc-data-table__content")[0].children;
            var docle = std_tab.length;
            for (let i = 0; i < docle; i++) {
                std_tab = document.getElementsByClassName("mdc-data-table__content")[0].children;
                elemen = std_tab[i];
                elemenjb = elemen.getElementsByClassName("yb-list-view__actions")[0].children[1];
                elemen = elemen.children[0].children[0].children[0];
                if (elemenjb.title === "解绑") {
                    console.log("ok");
                    elemen.checked = !elemen.checked;
                    elemenjb.click();
                    await sleep(1000);
                    var ok_tab = document.getElementsByClassName("mdc-confirm-dialog mdc-dialog mdc-dialog--open");
                    ok_tab[0].children[0].children[0].children[1].children[0].click();
                } else {
                    console.log("no");
                    continue;
                }
                await sleep(3000);
            }
            document.getElementsByClassName("mdc-data-table__pagination-button mdc-data-table__pagination-next-button mdc-button")[0].click();
            await sleep(3000);
        }
        alert("年级解绑完成");
    })
    btny.addEventListener('click', async function () {
        try {
            var pagelen = Number(document.getElementsByClassName("mdc-data-table__pagination-navigation")[0].getElementsByClassName("mdc-data-table__pagination-page")[0].children[4].innerText);
        }
        catch (err) {
            var pagelen = Number(1)
        }

        for (let l = 1; l <= pagelen; l++) {
            document.getElementsByClassName("mdc-checkbox__native-control")[0].click();
            await sleep(500);
            document.getElementsByClassName("mdc-button mdc-button--raised mdc-ripple-upgraded")[2].click();
            await sleep(1000);
            var ok_tab = document.getElementsByClassName("mdc-confirm-dialog mdc-dialog mdc-dialog--open");
            ok_tab[0].children[0].children[0].children[1].children[0].click();
            await sleep(6000);
        }
        alert("年级删除完成");
    })
})();