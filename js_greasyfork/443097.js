// ==UserScript==
// @name         种菜
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  自动种菜+自动收菜+自动买种子+自动卖成品+自动切换背包种子
// @author       QGX
// @match        https://sunflower-land.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunflower-land.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443097/%E7%A7%8D%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/443097/%E7%A7%8D%E8%8F%9C.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function qrandom(min, max) {
        return parseInt(Math.random() * (max - min + 1) + min);
    }
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function zhongcai(a) {
        a.click();
        await sleep(qrandom(2,5)*qrandom(950,1000));
        let sy = document.querySelector(
            "#gameboard > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(1) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10"
        );
        if (sy) {
            console.log("剩余种子：" + sy.innerHTML);
        } else {
            console.log("没有种子啦！！！");
        }
        await sleep(qrandom(1,2)*qrandom(950,1000));
        a.click();
    }
    function di1() {
        let a1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div.flex.justify-center > div > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let b1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div.flex.justify-center > div > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        if (a1 && !b1) {
            //console.log("开始收第一块地,第1个坑的菜!");
            zhongcai(a1);
        }
        if (a2 && !b2) {
            //console.log("开始收第一块地,第2个坑的菜!");
            zhongcai(a2);
        }
        if (a3 && !b3) {
            //console.log("开始收第一块地,第3个坑的菜!");
            zhongcai(a3);
        }
        if (a4 && !b4) {
            //console.log("开始收第一块地,第4个坑的菜!");
            zhongcai(a4);
        }
        if (a5 && !b5) {
            //console.log("开始收第一块地,第5个坑的菜!");
            zhongcai(a5);
        }
    }
    function di2() {
        let a1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div.flex.justify-center > div > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let b1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div.flex.justify-center > div > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(6) > div:nth-child(3) > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        if (a1 && !b1) {
            //console.log("开始收第二块地,第1个坑的菜!");
            zhongcai(a1);
        }
        if (a2 && !b2) {
            //console.log("开始收第二块地,第2个坑的菜!");
            zhongcai(a2);
        }
        if (a3 && !b3) {
            //console.log("开始收第二块地,第3个坑的菜!");
            zhongcai(a3);
        }
        if (a4 && !b4) {
            //console.log("开始收第二块地,第4个坑的菜!");
            zhongcai(a4);
        }
        if (a5 && !b5) {
            //console.log("开始收第二块地,第5个坑的菜!");
            zhongcai(a5);
        }

    }
    function di3() {
        let a1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a6 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let b1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div:nth-child(1) > div:nth-child(3) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b6 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(9) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        if (a1 && !b1) {
            //console.log("开始收第三块地,第1个坑的菜!");
            zhongcai(a1);
        }
        if (a2 && !b2) {
            //console.log("开始收第三块地,第2个坑的菜!");
            zhongcai(a2);
        }
        if (a3 && !b3) {
            //console.log("开始收第三块地,第3个坑的菜!");
            zhongcai(a3);
        }
        if (a4 && !b4) {
            //console.log("开始收第三块地,第4个坑的菜!");
            zhongcai(a4);
        }
        if (a5 && !b5) {
            //console.log("开始收第三块地,第5个坑的菜!");
            zhongcai(a5);
        }
        if (a6 && !b6) {
            //console.log("开始收第三块地,第5个坑的菜!");
            zhongcai(a6);
        }

    }
     function di4() {
        let a1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let a6 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > img.absolute.inset-0.w-full.opacity-0.sm\\:group-hover\\:opacity-100.sm\\:hover\\:\\!opacity-100.z-20.cursor-pointer");
        let b1 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b2 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b3 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div:nth-child(1) > div:nth-child(3) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b4 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(1) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b5 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(2) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        let b6 = document.querySelector("#root > div > div > div:nth-child(6) > div:nth-child(12) > div.flex.justify-between.items-center.z-10 > div:nth-child(3) > div.relative.w-full.h-full > div.absolute.w-full.-bottom-4.z-10 > div > span");
        if (a1 && !b1) {
            //console.log("开始收第四块地,第1个坑的菜!");
            zhongcai(a1);
        }
        if (a2 && !b2) {
            //console.log("开始收第四块地,第2个坑的菜!");
            zhongcai(a2);
        }
        if (a3 && !b3) {
            //console.log("开始收第四块地,第3个坑的菜!");
            zhongcai(a3);
        }
        if (a4 && !b4) {
            //console.log("开始收第四块地,第4个坑的菜!");
            zhongcai(a4);
        }
        if (a5 && !b5) {
            //console.log("开始收第四块地,第5个坑的菜!");
            zhongcai(a5);
        }
        if (a6 && !b6) {
            //console.log("开始收第四块地,第5个坑的菜!");
            zhongcai(a6);
        }

    }
    let moni;
    let sell;
    function monimove(){
        clearInterval(moni);
        //console.log("模拟移动");
        var e = document.createEvent("MouseEvents");
        e.initEvent("mousemove", true, true);
        let x1 = document.querySelector("#root > div > div > div:nth-child(6)");
        let x2 = document.querySelector("#root > div > div > div:nth-child(8)");
        let x3 = document.querySelector("#town");
        let x4 = document.querySelector("#root > div > div > div:nth-child(9) > div > div");
        if(x1){ x1.dispatchEvent(e);}
        if(x2){ x2.dispatchEvent(e);}
        if(x3){ x3.dispatchEvent(e);}
        if(x4){ x3.dispatchEvent(e);}
        moni = setInterval(monimove, qrandom(1,2)*qrandom(500,1000));
    }
    function erwai(){
        let jiangli = document.querySelector(
            "body > div.fade.modal.show > div > div > div > div > div > div > img.w-16.hover\\:img-highlight.cursor-pointer"
        );
        if (jiangli) {
            console.log("开始收额外奖励!");
            jiangli.click();
        }
        let jlgb = document.querySelector(
            "body > div.fade.modal.show > div > div > div > div > div > button"
        );
        if (jlgb) {
            jlgb.click();
        }
    }
    function shoucai() {
        console.log("开始检查收菜啦!");
        let di4kai = document.querySelector("#gameboard > div:nth-child(6) > img.absolute.z-20.hover\\:img-highlight.cursor-pointer.-scale-x-100");
        di1();
        di2();
        di3();
        if(!di4kai){
            di4();
        }
        erwai();
        console.log("收菜完毕!");
    }

    let prices = [0.001,0.01,0.02,0.05];
    //自动买
    async function autobuy(){
        console.log("开始自动购买！");
        let zq = document.querySelector("#gameboard > div:nth-child(4) > div.bg-brown-300.p-1.fixed.top-2.right-2.z-50.flex.items-center.shadow-lg.cursor-pointer > span").innerHTML;
        let shop = document.querySelector("#shop > img")
        if(!zq||!shop){return;}
        shop.click();
        await sleep(qrandom(2,3)*qrandom(900,1000));
        let p = document.querySelectorAll("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div");
        if(!p){ return}
        for(let i = 0;i<4;i++){
            let zq = document.querySelector("#gameboard > div:nth-child(4) > div.bg-brown-300.p-1.fixed.top-2.right-2.z-50.flex.items-center.shadow-lg.cursor-pointer > span").innerHTML;
            await sleep(500);
            let img = p[i].querySelector("div > img");
            img.click();
            await sleep(500);
            let kucun = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > span.w-32.-mt-4.sm\\:mr-auto.bg-blue-600.text-shadow.border.text-xxs.p-1.rounded-md").innerHTML;
            if(!kucun){ continue;}
            kucun = kucun.match(/\d+/)[0];
            if(kucun>0){
               let buyone = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(5)")
               let buyten = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(6)")
               let kemai = parseInt(zq/prices[i]);
               console.log("检查第"+(i+1)+"个格子数量:"+kucun+",当前账户总余额:"+zq+",可买:"+kemai);
               if(kemai>0){
                 let kk = kemai;
                 if(kemai>kucun){
                     kk = kucun;
                 }
                 for(let k = 0;k<kk;k++){
                    buyone.click();
                    await sleep(500);
                 }
               }
            }
        }
        //关闭窗口
        document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > img").click();
        console.log("结束自动购买！");
    }
    //自动卖
    async function autosell(){
        let sf = document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > img");
        if(!sf){
            clearInterval(sell);
            sell = setInterval(autosell, 30000);
            return;
        }
        console.log("开始自动卖！");
        let zq = document.querySelector("#root > div > div > div:nth-child(4) > div.bg-brown-300.p-1.fixed.top-2.right-2.z-50.flex.items-center.shadow-lg.cursor-pointer > span").innerHTML;
        let shop = document.querySelector("#shop > img")
        if(!zq||!shop){return;}
        shop.click();
        await sleep(800);
        document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > div > div:nth-child(2)").click();
        await sleep(1000);
        let p = document.querySelectorAll("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div");
        if(!p){ return}
        for(let i = 0;i<4;i++){
            let p = document.querySelectorAll("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div");
            let zq = document.querySelector("#root > div > div > div:nth-child(4) > div.bg-brown-300.p-1.fixed.top-2.right-2.z-50.flex.items-center.shadow-lg.cursor-pointer > span").innerHTML;
            await sleep(500);
            let kucun = p[i].querySelector(" div > div.bg-silver-300");
            if(!kucun){ continue;}
            kucun=kucun.innerHTML;
            let img = p[i].querySelector("div > img");
            img.click();
            await sleep(1000);
            if(kucun>0){
               let maione = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(5)")
               console.log("检查第"+(i+1)+"个格子可卖数量:"+kucun+",当前账户总余额:"+zq);
               for(let k = 0;k<kucun;k++){
                    maione.click();
                    await sleep(500);
               }
            }
        }
        //关闭窗口
        document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > img").click();
        console.log("结束自动卖！");
    }
    //自动检查背包种子
    async function checkBag(){
        let items = document.querySelectorAll("#root > div > div > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div");
        if(!items){ return}
        for(let i = 0;i<3;i++){
            let item = items[i].querySelector("div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10");
            if(!item){ continue;}
            //剩余种子
            let syzz = item.innerHTML;
            if(i==0&&syzz>0){
                break;
            }
            if(syzz>0&&i>0){
                console.log("切换种子",item)
                item.click();
                break;
            }
        }

    }
    function save() {
        document.querySelector("#root > div > div > div:nth-child(4) > div.w-5\\/12.sm\\:w-60.fixed.top-2.left-2.z-50.shadow-lg > div > div.flex.justify-center.p-1 > button:nth-child(2)").click();
    }
    setInterval(shoucai, 5000);
    setInterval(save, qrandom(5,8)*1000*60);
    moni = setInterval(monimove, qrandom(1,2)*qrandom(500,1000));
    setInterval(autobuy, 40000);
    sell = setInterval(autosell, 30000);
    setInterval(checkBag, 10000);
    // Your code here...
})();
