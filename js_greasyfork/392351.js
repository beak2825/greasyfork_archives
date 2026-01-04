// ==UserScript==
// @name         pixivnovel
// @namespace    http://tampermonkey.net/
// @version      2.04
// @description  pixiv网站小说自动下载
// @author       You
// @match        https://www.pixiv.net/novel/show.php?id=*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/392351/pixivnovel.user.js
// @updateURL https://update.greasyfork.org/scripts/392351/pixivnovel.meta.js
// ==/UserScript==

 
(function ( ) {
  "use strict";
var $ = $ || window.$;
  let textlist = [];
  let pagecount = 1;
  let lurl = location.href;
  let title;

  let csspath = [
    ".sc-LzMYn.csHEBi",
    ".sc-LzMXa.laextB",
    ".sc-LzMXa.bjDNku",
    ".sc-LzMXb.iCdDQq",
    ".sc-LzMXd.dGbQJU",
    "p.sc-LzMXL"
  ];

  const s = location.href.indexOf("#");
  if (s > 0) {
    lurl = location.href.substring(0, s);
  }

  function pageone(doc) {
    title = doc.find("a.sc-LzMkp.hioFgp").text();
    if (!title) title = doc.find(".sc-LzMkp.hioFgp").text();
    if (!title) title = doc.find(".sc-LzMjH.iDvlwg").text();

    let title0 = doc.find(".sc-LzMjG.iwvplz").text();
    if (!title0) title0 = doc.find(".sc-LzMjH.cooGwo").text();
    if (!title0) title0 = doc.find(".sc-LzMiZ.emTkzd").text();

    if (!title) title = title0;
    let wordcount = doc.find("sc-LzMkp.jDjWlD").text();
    if (!wordcount) wordcount = doc.find(".sc-LzMkq.dvdnws").text();
    if (!wordcount) wordcount = doc.find(".sc-LzMjI.XMQfT").text();

    let Introduction = doc.find(".sc-LzMjI.jkOmgw").text();
    if (!Introduction) Introduction = doc.find(".sc-LzMiv.jkOmgI").text();

    let updatetime = doc.find("sc-LzMjf.diKqPA").text();
    if (!updatetime) updatetime = doc.find(".sc-LzMjg.ipZrzl").text();

    if (!title) title = document.title;

    textlist.push(title);
    textlist.push(title0);
    textlist.push(wordcount);
    textlist.push(Introduction);
    textlist.push(updatetime);
    console.log(textlist);
  }

  async function Analysis() {
    const url = lurl + "#" + pagecount;
    console.log("url", url);
    let str = await gethtml(url);
    str = str.document.body.innerHTML;

    const str2 = str.replace(/<br>/g, "\r\n");

    let doc = $("<html></html>");
    doc.html(str2);

    //let doc = $(str);

    if (!title) {
      pageone(doc);
    }

    // const text = doc.find(".sc-LzMYn").text();

    $.each(csspath, function(i, v) {
      doc.find(v).each((si, sv) => {
        textlist.push($(sv).text());
      });
    });

    pagecount++;

    const button = doc.find(":button.gtm-novel-work-footer-pager-next");
    if (button.length > 0) {
      console.log(button);
      Analysis();
    } else {
      console.log("END");

      if (textlist.length > 0) {
        console.log(textlist);

        var blob = new Blob([textlist.join("\r\n\r\n")], {
          type: "text/plain;charset=utf-8"
        });
        saveAs(blob, `${title}.txt`);

        $("#CWDownSave").css("background-color", "red");
      } else {
        alert(" NO DOWNLOAD");
      }
    }
  }

  async function gethtml(url) {
    return new Promise((resolve, reject) => {
      const iframeId = "iframeId" + pagecount;
      var ele1 = document.createElement("iframe");
      ele1.src = url;
      ele1.name = iframeId;
      ele1.id = iframeId;
      ele1.width = "195px";
      ele1.height = "126px";
      ele1.style.display = "none";

      ele1.onload = function() {
        var frame = this;

        resolve(
          new Promise((resolve2, reject2) => {
            function loopcheck() {
              if (frame) {
                console.log("loop1");

                let isok = false;
                $.each(csspath, function(i, v) {
                  const e = frame.contentWindow.document.querySelector(v);
                  if (e) {
                    isok = true;
                    return false;
                  }
                });

                if (isok) {
                  clearInterval(akoop);
                  resolve2(frame.contentWindow);
                }
              }
            }

            const akoop = setInterval(function() {
              loopcheck();
            }, 1000);
          })
        );
      };
      document.body.appendChild(ele1);
    });
  }

  function inits() {
    var content = document.createElement("div");
    document.body.appendChild(content);
    content.outerHTML = `
<div id="CWDownContent">
<div style="width:40px;height:25px;position:fixed;left:3PX;top:3PX;z-index:100000;/*! background-color:#ffffff; *//*! border:1px solid #afb3b6; *//*! opacity:0.95; */filter:alpha(opacity=95);">
<div id="CWDownSave" style="/*! width:43px; *//*! height:26px; */cursor: pointer;background-color:#3169da;/*! margin: 2px 5px 3px 10px; */">
<span style="/*! line-height:25px; */display:block;color:#FFF;text-align:center;font-size: 14px;">pixiv
novel</span>
</div>
</div>
</div>
`;

    var WCSave = document.querySelector("#CWDownSave");

    WCSave.onclick = Analysis;

    Analysis();
  }

  inits();
  // Your code here...
})( );
