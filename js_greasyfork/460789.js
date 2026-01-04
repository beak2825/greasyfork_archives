// ==UserScript==
// @name        Zimuku Sort
// @namespace   Violentmonkey Scripts
// @match       *://zimuku.org/subs/*
// @match       *://zimuku.org/detail/*
// @match       *://zimuku.org/dld/*
// @grant       GM_addStyle
// @version     0.5.1
// @author      Ifover
// @license     MIT License
// @description 字幕库按下载量排序,内嵌下载页面
// @downloadURL https://update.greasyfork.org/scripts/460789/Zimuku%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/460789/Zimuku%20Sort.meta.js
// ==/UserScript==

(function () {
  let style_zimuku = `
   .main .container{
      padding-left:0;
    }
    .main .container table tr td:nth-child(2){
        display:none;
    }
      .main  .container table {
        border:none !important ;
        margin:0!important ;
    }
    .subinfo.clearfix .li.dlsub{
      display:none;
    }

`;

  GM_addStyle(style_zimuku);
  if (location.href.indexOf("dld") === -1) {
    let tbody = $(".table tbody");
    let hTr = tbody.children();
    let trArr = Array.from(hTr);

    let sortNumArr = [];
    for (let tr of trArr) {
      let tds = $(tr).children();
      if (tds.length) {
        let num = $(tds[3]).text() || $(tds[4]).text();

        num =
          num.indexOf("万") !== -1 ? parseFloat(num) * 10000 : parseInt(num);
        sortNumArr.push(num);
      }
    }

    for (let i = 0; i < sortNumArr.length; i++) {
      for (let j = 0; j < i; j++) {
        if (sortNumArr[i] > sortNumArr[j]) {
          let temp = sortNumArr[i];
          sortNumArr[i] = sortNumArr[j];
          sortNumArr[j] = temp;

          let temp2 = trArr[i];
          trArr[i] = trArr[j];
          trArr[j] = temp2;
        }
      }
    }

    hTr.remove();
    for (let tr of trArr) {
      tbody.append(tr);
    }

    let subInfo = $(".subinfo.clearfix");
    if (subInfo) {
      let liC = document.createElement("li");

      let ifrm = document.createElement("iframe");
      // ifrm.id = 'download_page'
      let page = location.href.substr(location.href.indexOf('detail') + 7)
      ifrm.src = "https://zimuku.org/dld/" + page;
      ifrm.style.border = "none";
      ifrm.style.width = "400px";
      ifrm.style.height = "166px";
      liC.append(ifrm);
      subInfo.append(liC);
    }
  }
})();
