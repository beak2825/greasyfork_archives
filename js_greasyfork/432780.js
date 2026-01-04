// ==UserScript==
// @name         GetAllImg
// @namespace    none
// @version      0.2
// @description  Get all the pictures of the web page
// @author       onePone
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432780/GetAllImg.user.js
// @updateURL https://update.greasyfork.org/scripts/432780/GetAllImg.meta.js
// ==/UserScript==

(function() {
    let css = `
.crawl-btn {
  position: fixed;
  bottom: 60px;
  right: 60px;
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: bold;
  background-color: #06c;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0,0,0, .3);
  cursor: pointer;
}

/* modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.modal-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, .3);
}

.modal .modal-content {
  position: relative;
  z-index: 1001;
  width: 632px;
  margin: 100px auto auto;
  height: 520px;
  border-radius: 6px;
  overflow-y:scroll;
  background-color: #fff;
}

.modal .modal-content .modal-title {
  position: relative;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.modal .modal-content .modal-close-btn {
  position: absolute;
  font-weight: normal;
  font-size: 14px;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.img-box {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  max-height: 440px;
  overflow-y: scroll;
}

.img-box .img-wrap {
  box-sizing: border-box;
  margin-right: 16px;
  margin-bottom: 16px;
  width: 180px;
  overflow: hidden;
  border: 1px dashed;
}

.img-box .img-wrap:nth-child(3n+3) {
  margin-right: 0;
}

.img-box .img-wrap img {
  max-width: 100%;
}`

    let crawlBtn = document.createElement("div");
    crawlBtn.setAttribute('class',"crawl-btn")
    crawlBtn.innerHTML = "提取"
    document.querySelector("body").appendChild(crawlBtn);
    crawlBtn.onclick = function () {
        var imgArr = [];
        document.querySelectorAll("img").forEach(function (i) {
            var src = i.getAttribute("src");
            var realSrc = /^(http|https)/.test(src)
            ? src
            : /^\/\//.test(src)?location.protocol+ src:/^\//.test(src)? location.protocol + "//" + location.host + src:null;
            realSrc&&imgArr.push(realSrc)
            // if(/^(http|https)/.test(src)){
            //     imgArr.push(src);
            // }
        });
        var imgBox = document.createElement("div");
        imgBox.setAttribute('class','img-box')
        imgArr.forEach((item) => {
            var imgWrap = document.createElement("div");
            imgWrap.setAttribute('class','img-wrap')
            var img = document.createElement("img");
            img.setAttribute('src',item)
            imgWrap.append(img);
            imgBox.append(imgWrap);
        });
        console.log(imgArr);

        var modal = document.createElement("div");
        modal.setAttribute('class','modal')
        var title = document.createElement("div");
        title.setAttribute('class','modal-title')
        title.innerHTML='提取结果'
        var close_btn = document.createElement("span");
        close_btn.setAttribute('class','modal-close-btn')
        close_btn.innerHTML='X'
        var content = document.createElement("div");
        content.setAttribute('class','modal-content')
        var mask = document.createElement("div");
        mask.setAttribute('class','modal-mask')
        close_btn.onclick = function () {
            document.querySelector("body").removeChild(modal);
        };
        title.append(close_btn);
        content.append(title);
        content.append(imgBox);
        modal.append(content);
        modal.append(mask);
        document.querySelector("body").append(modal);
    }


    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    document.querySelector("body").appendChild(styleNode);

})();
