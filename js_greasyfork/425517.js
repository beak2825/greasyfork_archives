// ==UserScript==
// @name        海棠去除重复,关键词过滤
// @description  海棠去除重复，一本书只出现一次
// @version      1.2
// @author       古海沉舟
// @include       *longmabookcn*rankingall*
// @exclude *bookid=*
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @connect      *
// @namespace https://greasyfork.org/users/6167
// @downloadURL https://update.greasyfork.org/scripts/425517/%E6%B5%B7%E6%A3%A0%E5%8E%BB%E9%99%A4%E9%87%8D%E5%A4%8D%2C%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/425517/%E6%B5%B7%E6%A3%A0%E5%8E%BB%E9%99%A4%E9%87%8D%E5%A4%8D%2C%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
var bt = new Array("古剑", "一人之下", "明日方舟", "审神者", "刀剑乱舞", "刀乱", "东方不败", "女攻", "", "", "");
var aa, i, j, ret, k, b, c, x, z, pd = 0;
var arr = [];
if (location.href.indexOf("act=rankingall") < 0) return;

const progress = function () {
    var t = new Date;
    var t0 = new Date;
    console.log("加载完成，开始过滤");
    console.log("");
    console.log("删除非男男");
    x = [];
    aa = document.querySelectorAll("#ranking > div > div > div > table > tbody > tr > td:nth-child(1) > font:nth-child(3)");
    console.log("共 ", aa.length, " 项");
    for (i = 0; i < aa.length; i++) {
        if (aa[i].innerText.indexOf("男男") < 0) {
            x.push(aa[i].parentElement.parentElement);
        }
    }
    for (i = x.length - 1; i > -1; i--) {
        x[i].remove();
    }
    console.log("删除非男男完成，耗时" + [new Date - t] / 1000 + "秒");
    console.log("");
    t = new Date;
    console.log("删除重复项");
    x = [];
    //删除重复
    aa = document.querySelectorAll("#ranking > div > div > div > table > tbody > tr > td:nth-child(1) > a:nth-child(1)");
    console.log("共 ", aa.length, " 项");
    for (i = 0; i < aa.length; i++) {
        b = aa[i].innerText;
        //console.log("判断 ",b);
        c = false;
        for (j = 0; j < arr.length; j++) {
            if (arr[j] == b) {
                x.push(aa[i].parentElement.parentElement);
                //console.log("删除  重复 ",b);
                c = true;
                break;
            }
        }
        if (c) continue;
        arr.push(b);
    }
    for (i = x.length - 1; i > -1; i--) {
        x[i].remove();
    }
    console.log("删除重复项完成，耗时" + [new Date - t] / 1000 + "秒");
    console.log("");
    t = new Date;

    z = 0;
    x = [];
    y = [];
    console.log("恢复 * 为完整书名");
    aa = document.querySelectorAll("#ranking > div > div > div > table > tbody > tr > td:nth-child(1) > a:nth-child(1)");
    for (i = 0; i < aa.length; i++) {
        b = aa[i].innerText;
        if (b.indexOf("*") > -1) {
            c = aa[i].href;
            //console.log("判断 ",b,"   ",c);
            x.push(aa[i]);
            y.push(aa[i].href);
            z++;
        }
    }
    async function getName(c) {
        try {
            let gn = await new Promise((resolve, reject) => {
                let mc = GM_getValue(c, "");
                if (mc != "") {
                    resolve(mc);
                    return;
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: c,
                    onload: (res) => {
                        let ht = res.responseText + "";
                        let b = ht.match(/(?<=<h4>)([\s\S]+?)(?=<\/h4>)/g)[1];
                        // console.log(b, "   ", res.finalUrl);
                        if (b + "" != "undefined") {
                            GM_setValue(res.finalUrl, b);
                        }
                        resolve(b);
                    }
                });
            });
            return gn;
        } catch (e) {
            throw e;
        }
    }
    //异步处理
    async function hf() {
        //书名*恢复
        console.log("当前和谐书名共有 ：", z);
        const prs = y.map(url => getName(url));
        //console.log("y: ", y, " prs: ", prs);
        for (i = 0; i < x.length; i++) {
            const mc = await prs[i];
            if (typeof (mc) != "undefined") {
                console.log(x[i].innerText, "\t:\t", mc);
                x[i].innerText = mc;
            }
        }

        console.log("恢复书名完成，耗时" + [new Date - t] / 1000 + "秒");
        console.log("");
        t = new Date;


        //关键词过滤
        console.log("关键词过滤");
        aa = document.querySelectorAll("#ranking > div > div > div > table > tbody > tr > td:nth-child(1) > a:nth-child(1)");
        console.log("共 ", aa.length, " 项");
        for (i = aa.length - 1; i > -1; i--) {
            b = aa[i].innerText;
            //console.log("判断 ",b);
            c = false;
            for (j = 0; j < bt.length; j++) {
                if (bt[j] != "") {
                    if (b.indexOf(bt[j]) > -1) {
                        aa[i].parentElement.parentElement.remove();
                        console.log("删除关键词      ", bt[j], "   ", b);
                        c = true;
                        break;
                    }
                }
            }
            if (c) continue;
        }
        console.log("关键词过滤完成，耗时" + [new Date - t] / 1000 + "秒");
        console.log("");
        t = new Date;

        //重新排版
        console.log("重新排版");
        aa = document.querySelectorAll("#ranking > div > div > div > table > tbody > tr");
        z = Math.ceil(aa.length / 3);
        console.log("总共 ", aa.length, " 项      每栏：", z);
        x = [];
        for (var i = 0; i < aa.length; i++) {
            x.push(aa[i].innerHTML);
        }
        aa = document.querySelector("#ranking > div > div.uk-first-column > div > table > tbody");
        aa.innerHTML = "";
        for (i = 0; i < z; i++) {
            aa.innerHTML += x[i];
        }
        aa = document.querySelector("#ranking > div > div:nth-child(2) > div > table > tbody");
        aa.innerHTML = "";
        for (i = z; i < 2 * z; i++) {
            aa.innerHTML += x[i];
        }
        aa = document.querySelector("#ranking > div > div:nth-child(3) > div > table > tbody");
        aa.innerHTML = "";
        for (i = 2 * z; i < x.length; i++) {
            aa.innerHTML += x[i];
        }
        console.log("重新排版完成，耗时" + [new Date - t] / 1000 + "秒");
        console.log("");
        console.log("全部完成耗时" + [new Date - t0] / 1000 + "秒");

    }
    hf();
}
window.addEventListener('load', progress, false);