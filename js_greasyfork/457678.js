// ==UserScript==
// @name         易班考试（小白专用）
// @namespace    http://tampermonkey.net/
// @license Common
// @version      0.2.5
// @description  小白你好！理论上易班考试都可以满分。如果显示404，请打开手机模式（按下f12，在新界面最左上角点击第二个图标），或者使用via浏览器（手机端的可以使用脚本的浏览器）。
// @author       木木
// @match        https://exam.yooc.me/group/*/exam/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yooc.me
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457678/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95%EF%BC%88%E5%B0%8F%E7%99%BD%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/457678/%E6%98%93%E7%8F%AD%E8%80%83%E8%AF%95%EF%BC%88%E5%B0%8F%E7%99%BD%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var localStorage = window.localStorage;

  function set_value(key, value) {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  }

  function get_value(key) {
    if (localStorage)
      var v = localStorage.getItem(key);
    if (!v) {
      return;
    }
    return v;
  }

  let tk;
  let local_str = get_value("tk");
  if (typeof (local_str) !== "undefined") {
    tk = JSON.parse(local_str);
  } else {
    tk = JSON.parse("{}");
  }
  let hook_fetch = window.fetch;
  window.fetch = async function (...args) {
    if (args[0].indexOf("paper") !== -1) {
      return await hook_fetch(...args).then((oriRes) => {
        let hookRes = oriRes.clone()
        hookRes.text().then(res => {
          decode_res(JSON.parse(res));
        })
        return oriRes
      })
    }
    return hook_fetch(...args)
  }

  function reverseString(str) {
    if (str === '') return '';
    else return reverseString(str.substr(1)) + str.charAt(0);
  }

  function decode_res(res) {
    for (let i = 0; i < res['data'].length; i++) {
      for (let j = 0; j < res['data'][i]['subjects'].length; j++) {
        let one = res['data'][i]['subjects'][j];
        let an_str = atob(reverseString(one['answer']))
        let an_list = []
        let ans = an_str.match(/\d/g);
        for (let k = 0; k < ans.length; k++) {
          an_list.push(my_replace(one['option'][parseInt(ans[k])][0]));
        }
        tk[my_replace(one['title'][0])] = an_list;
      }
    }
  }

  function my_replace(text) {
    text = text.replace(new RegExp(/( |	|[\r\n])|\s+|\s+$/g), "");
    return text;
  }

  function add_button() {
    if (!document.getElementsByTagName("ul").length > 0) {
      setTimeout(function () {
        add_button();
      }, 1000);
    }


    let ul = document.getElementsByTagName("ul");
    
    let bottom = ul[1];
    let next = bottom.getElementsByTagName("li")[3].children[0];
    let jiaojuan_p = document.getElementsByClassName("pr-s")[0];
    let bt = document.createElement("button");
    bt.innerText = "小白冲！";
    let main = document.getElementsByTagName("main")[0];
    let h3 = main.getElementsByTagName("h3")[0];
    bt.onclick = function () {
      let span = bottom.getElementsByTagName("span");
      let count_text = span[0].innerText;
      let count_list = count_text.split("/");
      for (let i = 0; i < parseInt(count_list[1]) - parseInt(count_list[0]) + 1; i++) {
        let title = my_replace(h3.getElementsByTagName("div")[0].innerText);
        let ans = tk[title];
        let body = h3.parentElement.children[1].children[0];
        let ans_l = body.getElementsByTagName("li");
        if (typeof (ans) !== "undefined") {
          for (let j = 0; j < ans_l.length; j++) {
            let an_str = my_replace(ans_l[j].children[1].innerText.slice(2));
            if (ans.indexOf(an_str) !== -1) {
              ans_l[j].click();
            }
          }
        }
        next.click();
      }
    };
    jiaojuan_p.appendChild(bt);

  }

  window.onload = function () {
    add_button();
  }

  // Your code here...
})();
