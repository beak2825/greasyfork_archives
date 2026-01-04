// ==UserScript==
// @name         91wii
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  www.91tvg.com
// @author       backrock12
// @match        https://www.91wii.com/thread*
// @match        https://www.91wii.com/*
// @match        https://www.91tvg.com/thread*
// @match        https://www.91tvg.com/*
// @icon         https://www.google.com/s2/favicons?domain=91wii.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443448/91wii.user.js
// @updateURL https://update.greasyfork.org/scripts/443448/91wii.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function find(str, cha, num) {
    if (cha == "") return -1;
    var x = str.indexOf(cha);
    if (num == 1) return x;
    for (var i = 0; i < num; i++) {
      x = str.indexOf(cha, x + 1);
    }
    return x;
  }

  function gettitle(t, str1, str2, num = 1) {
    let lnum, rnum, title;
    // lnum = t.indexOf(str1);
    // rnum = t.indexOf(str2);
    if (str1 == str2) {
      lnum = find(t, str1, num);
      rnum = find(t, str2, num + 1);
    } else {
      lnum = find(t, str1, num);
      rnum = find(t, str2, num);
    }

    // if (lnum < 0) lnum = 0;
    if (rnum < 0) rnum = 0;
    if (lnum > 0 || rnum > 0) {
      title = t.substring(lnum + 1, rnum);
    }
    if (str1 == null && str2) {
      title = t;
      if (str1 == null && rnum > 0) {
        title = title.substring(0, rnum);
      }
    }
    if (str2 == null && str1) {
      title = t;
      if (str2 == null && lnum > 0) {
        title = title.substring(lnum + 1);
      }
    }
    if (title) {
      title = title.replace("[TXT格式]", "").replace("\n", "");
      title = title.replace(/^\s*|\s*$/g, "");
    }
    if (title && title.indexOf("合购") > 0) {
      num++;
      title = gettitle(t, str1, str2, num);
    }

    return title;
  }

  function settitle(titleid, str1, str2) {
    const titleobj = document.querySelector(titleid);
    if (!titleobj) return;
    let t = gettitle(titleobj.innerText, str1, str2);
    console.log(t);
    if (t) {
      const strs = t.split("/");
      let htmltext = titleobj.outerHTML;
      for (let i = 0; i < strs.length; i++) {
        let urlname = strs[i];
        const url = "https://www.baidu.com/baidu?wd=" + urlname;
        const ahtml = `<a href=${url}    target = "_blank">${urlname}</a>`;
        htmltext = htmltext.replace(urlname, ahtml);
      }
      titleobj.outerHTML = htmltext;
      console.log(htmltext);
    }
    return t;
  }


  function titleselect() {
    const titleid = "#thread_subject";

    if (titleid) {
      let temp = null;
      temp = settitle(titleid, "[", "]");
      temp = temp | settitle(titleid, "《", "》");
      temp = temp | settitle(titleid, "<", ">");
      temp = temp | settitle(titleid, "(", ")");

      if (!temp)
        temp = settitle(titleid, "", "(");
      if (!temp)
        if (!temp)
          temp = settitle(titleid, " ", " ");
      if (!temp) {
        temp = settitle(titleid, "", " ");
      }
    }
  }

  function autoadd() {
    const number_id = 'body > form:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > b:nth-child(3)';
    const input_id = 'body > form:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(6)'
    const button_id = '.button';

    const text = document.querySelector(number_id);
    if (!text) return;
    const numbertext = text.innerHTML.replace('= ?', '')
    const list = numbertext.split('+');

    let re = 0;
    for (let index = 0; index < list.length; index++) {
      re += Number(list[index]);
    }
    const input = document.querySelector(input_id);
    input.value = re;

    const button = document.querySelector(button_id);
    if (button) {
      setTimeout(() => {
        button.click();
      }, 1000)
    }
  }


  titleselect();
  autoadd();

        const adlist = [
      ".bilibili-player-video-btn-jump-to-bilibili-qrcode",
            ".bilibili-player-video-btn-jump",

    ];
   // adlist.forEach((e) => {
    //  let r = document.querySelectorAll(e);
   //   if (r.length > 0)
   //     r.forEach((e) => {
   //       e.innerText="";
   //     });
   // });

  // Your code here...
})();
