// ==UserScript==
// @name        双搜索引擎
// @namespace   Violentmonkey Scripts
// @include     https://www.google.com*
// @match       https://www.baidu.com/s
// @match       https://www.baidu.com/
// @grant       none
// @version     1.3
// @author      -
// @description 2021/1/4 上午10:33:27
// @downloadURL https://update.greasyfork.org/scripts/419608/%E5%8F%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/419608/%E5%8F%8C%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==
var e_0 = document.createElement("div");
var e_1 = document.createElement("div");
e_1.setAttribute("class", "FAuhyb zgAlFc");
var e_2 = document.createElement("span");
e_2.setAttribute("class", "z1asCe MZy1Rb");
var e_3 = document.createElementNS("http://www.w3.org/2000/svg","svg");
e_3.setAttribute("focusable", "false");
e_3.setAttribute("xmlns", "http://www.w3.org/2000/svg");
e_3.setAttribute("fill", "#4e6ef2");
e_3.setAttribute("viewBox", "0 0 24 24");
var e_4 = document.createElementNS("http://www.w3.org/2000/svg","path");
e_4.setAttribute("d", "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z");
e_3.appendChild(e_4);
e_2.appendChild(e_3);
e_1.appendChild(e_2);
e_0.appendChild(e_1);

window.onload = () => {
  if ( /www\.google\.com\./.test(window.location.hostname)) {
        const box = document.querySelector("div.RNNXgb[jsname='RNNXgb']");
        const input = document.querySelector("input[aria-label='搜索']");
        const a = document.createElement('a');
        a.className = 'Tg7LZd'
        a.ariaLabel = '百度搜索'
        a.style = `
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        `
        a.href = `https://www.baidu.com/s?wd=${input.value}`
        input.oninput = (e) => {
          a.href= `https://www.baidu.com/s?wd=${e.target.value}`
        }
        a.appendChild(e_0)
        box.appendChild(a)
      } else if (/www\.google\.com/.test(window.location.hostname)) {
        const box = document.querySelector("div.RNNXgb[jsname='RNNXgb']");
        const textarea = document.querySelector("textarea[aria-label='搜索']");
        const a = document.createElement('a');
        a.className = 'Tg7LZd'
        a.ariaLabel = '百度搜索'
        a.style = `
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        `
        a.href = `https://www.baidu.com/s?wd=${textarea.value}`
        textarea.oninput = (e) => {
          a.href= `https://www.baidu.com/s?wd=${e.target.value}`
        }
        a.appendChild(e_0)
        box.appendChild(a)
      } else if (window.location.hostname === "www.baidu.com") {
        const su = document.getElementById('su')
        su.style = 'border-radius: 0'
        const input = document.createElement('input')
        const kw = document.getElementById('kw')
        input.style = `
          vertical-align:top;
          cursor: pointer;
          width: 60px;
          height: 100%;
          line-height: 40px;
          line-height: 40px\\9;
          background-color: #4e6ef2;
          border-radius: 0 10px 10px 0;
          font-size: 17px;
          box-shadow: none;
          font-weight: 400;
          border: 0;
          outline: 0;
          letter-spacing: normal;
          color: #ffffff;
        `
        input.type = 'submit'
        input.value = '谷歌'
        input.onclick = () => {
          window.location.href=`https://www.google.com/search?q=${kw.value}`
          // window.open(`https://www.google.com/search?q=${kw.value}`)
        }
        const box = su.parentNode
        box.style = `width: max-content;`
        const form = document.getElementById('form')
        form.style.width = 'max-content'

        box.appendChild(input)
      }
}