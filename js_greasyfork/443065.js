// ==UserScript==
// @name         Sunflower Land Farmer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  sunflower-land 自动收菜脚本
// @author       GuaGua-fooyao
// @match        https://sunflower-land.com/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunflower-land.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443065/Sunflower%20Land%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/443065/Sunflower%20Land%20Farmer.meta.js
// ==/UserScript==
 
 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
function queryList(ele, arr) {
    if (ele.childElementCount == 0) {
        arr.push(ele);
    } else {
        for (var i = 0; i < ele.childElementCount; ++ i) {
            arr = queryList(ele.childNodes[i], arr)
        }
    }
    return arr;
}
 
function clickAll(eles) {
    for (var i = 0; i < eles.length; ++ i) {
        eles[i].click();
    }
}
 
async function clickAndThen(ele) {
    if(ele !== null){
      ele.click();
      await sleep(1000);
    }
}
async function clickAndThen2(ele) {
    if(ele !== null){
      ele.click();
      await sleep(100);
    }
}
 
async function autoSell() {
    var shop = document.querySelector("#shop div");
    await clickAndThen(shop);
    var sellTab = document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > div > div:nth-child(2)");
    await clickAndThen(sellTab);
    for (var i = 0; i < 10; ++ i) {
      var iteam = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(" + (i + 1) +") > div");
      if(iteam !== null){
        await clickAndThen2(iteam);
        var sellAll = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button.bg-brown-200.w-full.p-1.shadow-sm.text-white.text-shadow.object-contain.justify-center.items-center.hover\\:bg-brown-300.cursor-pointer.flex.disabled\\:opacity-50.text-xs.mt-1.whitespace-nowrap")
        if(sellAll !== null){
          await clickAndThen(sellAll);
          var yesBtn = document.querySelector("body > div:nth-child(14) > div > div > div > div > div.flex.justify-content-around.p-1 > button:nth-child(1)");
          await clickAndThen(yesBtn);
        }
      }
    }
    var exitBtn = document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > img");
    await clickAndThen(exitBtn)
    
}
 
async function autoBuy(maxnum) {
    var shop = document.querySelector("#shop div");
    await clickAndThen(shop);
    for (var i = 1; i < maxnum + 1; ++ i) {
      var iteam = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.w-3\\/5.flex.flex-wrap.h-fit > div:nth-child(" + i +") > div");  
      if(iteam !== null){
        await clickAndThen2(iteam);
        var buyOne = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(5)")
        var buyTen = document.querySelector("body > div.fade.modal.show > div > div > div > div > div:nth-child(2) > div.bg-brown-600.p-0\\.5.text-white.shadow-lg.flex-1.w-1\\/3 > div > button:nth-child(6)")
        for (var s = 0; s < 100; ++ s) {
          if (buyTen) {
            if(buyTen.disabled == false){
              await clickAndThen2(buyTen);
            }else if(buyOne.disabled == false){
              await clickAndThen2(buyOne);
            }else{
              break;
            }
          }
        } 
      }
    }
    var exitBtn = document.querySelector("body > div.fade.modal.show > div > div > div > div > div.flex.justify-between.absolute.top-1\\.5.left-0\\.5.right-0.items-center > img");
    await clickAndThen(exitBtn)
}
 
async function autoOpenBox() {
    var box0 = document.querySelector("body > div.fade.modal.show > div > div > div > div > div > div > img.w-16.hover\\:img-highlight.cursor-pointer");
    await clickAndThen(box0);
    var box1 = document.querySelector("body > div:nth-child(6) > div > div > div > div > div > div > img.w-16.hover\\:img-highlight.cursor-pointer");
    await clickAndThen(box1);
    var box2 = document.querySelector("body > div.fade.modal.show > div > div > div > div > div > button");
    await clickAndThen(box2);
  
}
 
async function autoSave() {
    var save = document.querySelector("#gameboard > div:nth-child(4) > div.w-5\\/12.sm\\:w-60.fixed.top-2.left-2.z-50.shadow-lg > div > div.flex.justify-center.p-1 > button:nth-child(2)");
    await clickAndThen(save);
}
 
async function autoChangeSeed() {
  var save = document.querySelector("#gameboard > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(1) > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10");
  if (save == null){
    for (var i = 2; i < 4; ++ i) {
      var save = document.querySelector("#gameboard > div:nth-child(4) > div.flex.flex-col.items-end.mr-2.sm\\:block.fixed.top-16.right-0.z-50 > div.flex.flex-col.items-center.sm\\:mt-8 > div:nth-child(" + i + ") > div > div.bg-silver-300.text-white.text-shadow.text-xs.object-contain.justify-center.items-center.flex.absolute.-top-4.-right-3.px-0\\.5.text-xs.z-10");
      if (save != null){
        await clickAndThen(save);
        break;
      }
    }
  }
}
 
async function autoFarm() {
    var container = document.querySelector("#gameboard > div:nth-child(6) > div:nth-child(2)");
    var farms_eles = queryList(container, []);
    var container2 = document.querySelector("#cropzone-two");
    var farms_eles2 = queryList(container2, []);
    var container3 = document.querySelector("#cropzone-three");
    var farms_eles3 = queryList(container3, []);
    var container4 = document.querySelector("#cropzone-four");
    var farms_eles4 = queryList(container4, []);
    
    var img2 = document.querySelector("#gameboard > div:nth-child(6) > img.absolute.z-10.hover\\:img-highlight.cursor-pointer");
    var img3 = document.querySelector("#gameboard > div:nth-child(6) > img:nth-child(7)");
    if(img3 == null){
      img3 = document.querySelector("#gameboard > div:nth-child(6) > img:nth-child(6)");
    }
    var img4 = document.querySelector("#gameboard > div:nth-child(6) > img.absolute.z-20.hover\\:img-highlight.cursor-pointer.-scale-x-100");
    if(img2 == null){
      clickAll(farms_eles2);
    }
    if(img3.src.length == 2166){
      clickAll(farms_eles3);
    }
    if(img4 == null){
      clickAll(farms_eles4);
    }
    clickAll(farms_eles);
    await sleep(2000);
    clickAll(farms_eles);
    if(img2 == null){
      clickAll(farms_eles2);
    }
    if(img3.src.length == 2166){
      clickAll(farms_eles3);
    }
    if(img4 == null){
      clickAll(farms_eles4);
    }
    await autoSave();
    await autoChangeSeed();
}
 
(async function() {
    'use strict';
    setInterval(async function() {
        try {
            autoFarm();
        } catch (error) {
            console.log("[AutoFarm] 无法获取到游戏，自动重试")
        }
    }, 10 * 1000);
  setInterval(async function() {
        try {
            autoOpenBox();
        } catch (error) {
            console.log("[autoOpenBox] 无法获取到游戏，自动重试")
        }
    }, 1000);
  setInterval(async function() {
        try {
            await autoSell();  //关闭自动卖，删除此行
            await autoBuy(1);  //关闭自动买种子，删除此行  //括号内数字为购买前几个种子，只买向日葵就填1，购买前3个就填3
        } catch (error) {
            console.log("[autoSell] 无法获取到游戏，自动重试")
        }
    }, 100 * 1000);
    alert("脚本注入成功");
})();