// ==UserScript==
// @name         在线翻译
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  复制粘贴点击翻译即可，可以机器发声翻译之后的文本，也可以复制翻译之后的内容
// @license       MIT
// @author       acxgdxy
// @match        *://*/*
// @icon         https://th.bing.com/th/id/R.81c41e9a6ac6aefdef1845b4d9bc2b99?rik=S6L5yItkn5R%2bjQ&riu=http%3a%2f%2fimg1.3png.com%2f81c41e9a6ac6aefdef1845b4d9bc2b994130.png&ehk=MctCYYmO6W8AyE9wQ2OUUUYnRhZEn4EloBRBfkvfVYE%3d&risl=&pid=ImgRaw&r=0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483947/%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/483947/%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
let body = document.getElementsByTagName('body')[0];
let head = document.getElementsByTagName('head')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';


const styles = `
/* Import Google Font - Poppins */

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
*{
  font-family: 'Poppins', sans-serif;
}
.acxgdxy-container{
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  max-width: 300px;
  width: 100%;
  padding: 30px;
  background: #70717e;
  border-radius: 7px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.01);
  z-index: 100;
}
.acxgdxy-wrapper{
  border-radius: 5px;
  border: 1px solid #ccc;
}
.acxgdxy-wrapper .acxgdxy-text-input{
  display: flex;
  border-bottom: 1px solid #ccc;
}
.acxgdxy-text-input .acxgdxy-to-text{
  border-radius: 0px;
  border-left: 1px solid #ccc;
}
.acxgdxy-text-input textarea{
  height: 200px;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: none;
  font-size: 18px;
  padding: 10px 15px;
  border-radius: 5px;
}
.acxgdxy-text-input textarea::placeholder{
  color: #b7b6b6;
}
.acxgdxy-text-input {
  position: relative;
}
.acxgdxy-controls{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.acxgdxy-controls{
  list-style: none;
  padding: 12px 15px;
}

.acxgdxy-icons {
  display: flex;
  position: absolute;
  height: 20px;
  bottom: 0;
  right: 0;
}
.acxgdxy-icons i {
  height: 10px;
  width: 50px;
}
.acxgdxy-controls .acxgdxy-row{
  width: 38%;
}
.acxgdxy-controls .acxgdxy-row .acxgdxy-icons i{
  width: 50px;
  color: #adadad;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
  justify-content: center;
}
.acxgdxy-controls .acxgdxy-row .acxgdxy-from{
  padding-right: 15px;
  border-right: 1px solid #ccc;
}
.acxgdxy-controls .acxgdxy-row.acxgdxy-to{
  padding-left: 10px;
  /*border-left: 1px solid #ccc;*/
}
.acxgdxy-controls .acxgdxy-row select{
  color: #333;
  border: none;
  outline: none;
  font-size: 13px;
  background: none;
  /*padding-left: 5px;*/
}
.acxgdxy-text-input textarea::-webkit-scrollbar{
  width: 4px;
}
.acxgdxy-controls .acxgdxy-row select::-webkit-scrollbar{
  width: 8px;
}
.acxgdxy-text-input textarea::-webkit-scrollbar-track,
.acxgdxy-controls .acxgdxy-row select::-webkit-scrollbar-track{
  background: #fff;
}
.acxgdxy-text-input textarea::-webkit-scrollbar-thumb{
  background: #ddd;
  border-radius: 8px;
}
.acxgdxy-controls .acxgdxy-row select::-webkit-scrollbar-thumb{
  background: #999;
  border-radius: 8px;
  /*border-right: 2px solid #ffffff;*/
}
.acxgdxy-controls .acxgdxy-exchange{
  color: #adadad;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s ease;
}
.acxgdxy-controls i:active{
  transform: scale(0.9);
}
.acxgdxy-container button{
  width: 100%;
  padding: 14px;
  outline: none;
  border: none;
  color: #fff;
  cursor: pointer;
  margin-top: 20px;
  font-size: 17px;
  border-radius: 5px;
  background: #5372F0;
}

@media (max-width: 660px){
  .acxgdxy-container{
    padding: 20px;
  }
  .acxgdxy-wrapper .acxgdxy-text-input{
    flex-direction: column;
  }
  .acxgdxy-text-input .acxgdxy-to-text{
    border-left: 0px;
    border-top: 1px solid #ccc;
  }
  .acxgdxy-text-input textarea{
    height: 200px;
  }
  .acxgdxy-controls .acxgdxy-row .acxgdxy-icons{
    display: none;
  }
  .acxgdxy-container button{
    padding: 13px;
    font-size: 16px;
  }
  .acxgdxy-controls .acxgdxy-row select{
    font-size: 16px;
  }
  .acxgdxy-controls .acxgdxy-exchange{
    font-size: 14px;
  }
}

`;
let style = document.createElement('style');

function build() {
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));
    let select = document.createElement('div');
    select.innerHTML = `<div class="acxgdxy-container">
      <div class="acxgdxy-wrapper">
        <div class="acxgdxy-text-input">
          <textarea spellcheck="false" class="acxgdxy-from-text" placeholder="输入文本(enter)"></textarea>
          <textarea spellcheck="false" readonly disabled class="acxgdxy-to-text" placeholder="翻译结果(result)"></textarea>
          <div class="acxgdxy-icons">
            <i class="fas fa-volume-up to"></i>
            <i class="fas fa-copy to"></i>
          </div>
        </div>
        <ul class="acxgdxy-controls">
          <li class="acxgdxy-row acxgdxy-from">
            <select class="acxgdxy-select"></select>
          </li>
          <li class="acxgdxy-exchange"><i class="fas fa-exchange-alt"></i></li>
          <li class="acxgdxy-row acxgdxy-to">
            <select class="acxgdxy-select"></select>
          </li>
        </ul>
      </div>
      <button class="acxgdxy-button">点击翻译文本(click to translate!)</button>
    </div>`;
    body.appendChild(select);
    head.appendChild(style);
    head.appendChild(link);
}


// <!-- ref https://www.codingnepalweb.com/language-translator-app-html-css-javascript/ -->
function mywork() {
    // <!-- ref https://www.codingnepalweb.com/language-translator-app-html-css-javascript/ -->
    const fromText = document.querySelector(".acxgdxy-from-text"),
        toText = document.querySelector(".acxgdxy-to-text"),
        exchageIcon = document.querySelector(".acxgdxy-exchange"),
        selectTag = document.getElementsByClassName('acxgdxy-select'),
        icons = document.querySelectorAll(".acxgdxy-icons"),
        translateBtn = document.getElementsByClassName('acxgdxy-button')[0];
    // console.log(typeof selectTag);
    const countries = {

        "zh": "	Chinese",
        "de-DE": "German",
        "en-GB": "English",
        "es-ES": "Spanish",
        "it-IT": "Italian",
        "ja-JP": "Japanese",
        "la-VA": "Latin",
        "ru-RU": "Russian",
    }
    let Array = Object.keys(selectTag);
    Array.forEach((id) => {
        let tag = selectTag[id];
        for (let country_code in countries) {
            let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "zh" ? "selected" : "";
            let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
            tag.insertAdjacentHTML("beforeend", option);
            // console.log(country_code);
        }
    })


    exchageIcon.addEventListener("click", () => {
        let tempText = fromText.value,
            tempLang = selectTag[0].value;
        fromText.value = toText.value;
        toText.value = tempText;
        selectTag[0].value = selectTag[1].value;
        selectTag[1].value = tempLang;
    });

    fromText.addEventListener("keyup", () => {
        if (!fromText.value) {
            toText.value = "";
        }
    });

    translateBtn.addEventListener("click", () => {
        let text = fromText.value.trim(),
            translateFrom = selectTag[0].value,
            translateTo = selectTag[1].value;
        if (!text) return;
        toText.setAttribute("placeholder", "Translating...");
        // https://api.mymemory.translated.net/get?q=Hello World!&langpair=en|it
        let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        fetch(apiUrl).then(res => res.json()).then(data => {
            toText.value = data.responseData.translatedText;
            data.matches.forEach(data => {
                if (data.id === 0) {
                    toText.value = data.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
        });
    });

    icons.forEach(icon => {
        icon.addEventListener("click", ({target}) => {
            if (!fromText.value || !toText.value) return;
            if (target.classList.contains("fa-copy")) {
                if (target.classList["acxgdxy-from"]) {
                    navigator.clipboard.writeText(fromText.value);
                } else {
                    navigator.clipboard.writeText(toText.value);
                }
            } else {
                let utterance;
                if (target.classList["acxgdxy-from"]) {
                    utterance = new SpeechSynthesisUtterance(fromacxgdxy - Text.value);
                    utterance.lang = selectTag[0].value;
                } else {
                    utterance = new SpeechSynthesisUtterance(toText.value);
                    utterance.lang = selectTag[1].value;
                }
                speechSynthesis.speak(utterance);
            }
        });
    });

}

(function() {
    'use strict';
    build();
    mywork();
    // Your code here...
})();