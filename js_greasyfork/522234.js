// ==UserScript==
// @name         DNA_weekly_helper
// @namespace    dgistdna.com
// @version      2024-12-29
// @description  DNA_weekly_cp
// @author       You
// @match        https://stuecm.dgist.ac.kr/s/potal_board/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/522234/DNA_weekly_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/522234/DNA_weekly_helper.meta.js
// ==/UserScript==

// (function() {
//     'use strict';

//     // Your code here...

// })();

function extractPathAndQuery(url) {
  // Find the position of the third slash (/) which marks the end of the domain
  var domainEndIndex = url.indexOf("/", url.indexOf("//") + 2);

  // Extract the path and query string from the URL
  var pathAndQuery = url.substring(domainEndIndex);

  return pathAndQuery;
}

function copyLink2() {
  /*$("#copyLinkText").val("test111");

  var $temp = document.getElementById('copyLinkText');
  $temp.select();*/

  var domain = "https://ecm.dgist.ac.kr";
  var domain_stu = "https://stuecm.dgist.ac.kr";
  var url = extractPathAndQuery(document.URL);
  var title='';
  var titles = [];
  var elem1 = document.querySelector(
    "#content > table > tbody > tr:nth-child(1) > th > strong > b"
  );
  if (elem1 != null) {
     title = elem1.innerText;
     titles = title.split("\n");
  } else {
    var elem2 = document.querySelector(
      "#content > table > tbody > tr:nth-child(1) > th > strong"
    );
    if (elem2 != null) {
       title = elem2.innerHTML;
       titles=title.split("<br>");
       titles=titles.map(function (x) {return x.trim()});
    } else {
        return;
    }
  }


//   alert(title);

  var copyLinkHtml;
  if (titles.length == 1) {
    copyLinkHtml =
      titles[0] +
      " " +
      "<a href='" +
      domain_stu +
      url +
      "'>[학생]</a> <a href='" +
      domain +
      url +
      "'> [교직원]</a>";
  } else {
    copyLinkHtml =
      titles[0] +
      " " +
      "<a href='" +
      domain_stu +
      url +
      "'>[학생]</a> <a href='" +
      domain +
      url +
      "'> [교직원]</a><br>" +
      titles[1] +
      " " +
      "<a href='" +
      domain_stu +
      url +
      "'>[student]</a> <a href='" +
      domain +
      url +
      "'> [employee]</a>";
  }
  navigator.clipboard
    .write([
      new ClipboardItem({
        "text/html": new Blob([copyLinkHtml], { type: "text/html" }),
        "text/plain": new Blob([copyLinkHtml], { type: "text/plain" }),
      }),
    ])
    .then(function () {
    //   alert("복사 되었습니다.");
    })
    .catch(function (error) {
      //   console.error("Copy failed", error);
      alert("Copy failed", error);
    });
  //   //alert("my 복사");
}
copyLink2();
// //GM_setClipboard('dwd','html')
// alert("end");
// console.log("end");
