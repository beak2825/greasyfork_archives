// ==UserScript==
// @name        download Lib Model With Pic And Info
// @namespace   www.leizingyiu.net
// @match       http*://www.liblib.art/modelinfo/*
// @grant       none
// @version     20250512
// @author      leizingyiu
// @description 下载模型时，以我的习惯命名下载的例图和信息，以便模型命名。 可自行修改排序及内容。
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/533935/download%20Lib%20Model%20With%20Pic%20And%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/533935/download%20Lib%20Model%20With%20Pic%20And%20Info.meta.js
// ==/UserScript==

let    最大重试次数 = 100;
const  重试延迟 = 500, // 加载页面绑定点击事件的重试次数，和重试间隔 ms
       图片最大下载数量 = 5, // 作者例图最大下载数量
       是否自动下载图片 = true,
       是否自动下载描述文件 = true ;


let downloadBtnSelecter =
  "div[class^=ModelInfoBody_modelInfoBody] > div.model-info-right > div[class^=ModelActionCard_modelActionCard] > div[class^=ModelActionCard_addDownModelWrap] > div[class^=ModelActionCard_downModel]";

window.onload = loadFn;

loadFn();

function loadFn() {
  if (document.querySelector(downloadBtnSelecter) && 最大重试次数 !== 0) {
    result = main();
    if(result == true ){
      最大重试次数 = 0;
    }else{
      setTimeout(loadFn, 重试延迟);
      最大重试次数 = 最大重试次数 - 1;
    };
  } else {
    if (最大重试次数 > 0) {
      setTimeout(loadFn, 重试延迟);
      最大重试次数 = 最大重试次数 - 1;
    }
  }
}

function main() {
  "use strict";

  const   titleSelector = "div[class^=ModelInfoHead_modelInfoHead] > div[class^=ModelInfoHead_first] > div > div.flex.w-full.items-center > span",
      baseSelector = "div.ModelInfoBody_modelInfoBody__FaPZ9 > div.model-info-right > div:nth-child(4) > div[class^=ModelDetailCard_body] > div:nth-child(4) > div[class^=ModelDetailCard_value]",
      wordsSelector =      "div[class^=ModelInfoBody_modelInfoBody] > div.model-info-right > div:nth-child(4) > div[class^=ModelDetailCard_body] > div:last-child > div[class^=ModelDetailCard_value] > div > span";

  const title = document.querySelector(titleSelector    ).innerText,
    base = document      .querySelector(baseSelector)      .innerText.replace(/基础((模型)|(算法))/, "")      .replace(/[ \.]/g, ""),
    words = document.querySelector(wordsSelector)?'[ '+[
      ...document.querySelectorAll(wordsSelector)
    ]
      .map((i) => i.innerText)
      .join(" , ")+' ]':'',
    libId = window.location.href.replace(/.*modelinfo\/([^\?]*).*/, "$1"),
    txt = [base, words, title, "lib", libId].filter(i=>i.length!=0) .join(" - ") + " ";

  console.log([base, words, title].map(i=>i+':'+i.length));

if(base == "无" && 最大重试次数>0){
      return false ;
}

    const ttl =  document.querySelector(titleSelector).parentElement;
    ttl.innerHTML+=txt;
    ttl.style.flexDirection = 'column';
    ttl.style.alignItems = 'flex-start';


    document.querySelector(downloadBtnSelecter).addEventListener("click", function (event) {

    if(是否自动下载描述文件==true){
      
      const fileName = txt + ".html";
      const fileContent = document.querySelector('[class^=ModelDescription_desc]').innerHTML;


      const a = document.createElement("a");
      a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(fileContent);
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    }

    if(是否自动下载图片==true){
      let imageUrls = [
        ...document.querySelectorAll(
          "[id^=rc-tabs-0-panel] > div > div > div img",
        ),
      ]
        .map((i) => {
          let s = i.src;
          if (s.includes("?")) {
            s = s.split("?")[0];
          }
          return s;
        })
        .filter((s) => s.match(/png$/));

      imageUrls.map((imageUrl, idx) => {
        if (idx >= 图片最大下载数量 ) {
          return;
        }else{
        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const aImg = document.createElement("a");
            aImg.href = blobUrl;
            aImg.download = txt + ".png";
            document.body.appendChild(aImg);
            aImg.click();
            document.body.removeChild(aImg);
            URL.revokeObjectURL(blobUrl);
          });}
      });

    }
  });

  最大重试次数 = 0;
  
  return true ;
}
