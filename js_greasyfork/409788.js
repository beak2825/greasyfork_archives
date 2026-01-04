// ==UserScript==
// @name         zimuku
// @namespace    http://tampermonkey.net/
// @version      3.12
// @description  zimuku明细页直接显示下载地址
// @author       backrock12
// @match        *zmk.pw/*
// @include      /.*zimuku\..*\/.*/
// @include      *srtku.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/409788/zimuku.user.js
// @updateURL https://update.greasyfork.org/scripts/409788/zimuku.meta.js
// ==/UserScript==

(function () {
  "use strict";

  async function gethtml(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "GET",
        onload: function (response) {
          resolve(response.responseText);
        },
      });
    });
  }

  async function showurl() {
    let lhref = location.href;
    lhref = lhref.replace("/detail/", "/dld/");

    const htmltxt = await gethtml(lhref);

    if (!htmltxt) return;
    let doc = $("<html></html>");
    doc.html(htmltxt);
    let td = doc.find(".col-xs-12 td:nth-child(1) div");
    //console.log(td);

    const subinfo = $(".subinfo");
    subinfo.append(td);
  }

  function noad() {
    function subnoad(csspath) {
      const ad1 = $(csspath);
      if (csspath.length > 0) ad1.css("display", "none");
    }

    subnoad(".table");
    subnoad("div.tbhd");
    subnoad("font[color=#ca6445]");
    subnoad(".rside");
    subnoad(".rater-click-tips");
    subnoad(".rater-star-item-tips");
  }

  async function subdown(url) {
    url = url.replace("/detail/", "/dld/");
    const htmltxt = await gethtml(url);

    if (!htmltxt) return;
    let doc = $("<html></html>");
    doc.html(htmltxt);
    let td = doc.find(".down  ul li a");
    if (td.length == 0) {
      alert("获取下载页失败");
    }
    const durl = td[0].href;
    td[0].click();
    console.log(durl);

    return;
    GM_xmlhttpRequest({
      url: durl,
      method: "GET",
      onload: function (response) {
        console.log(response.finalUrl);
      },
    });

    return;
    GM_download({
      url: durl,
      name: "name",
      onerror: (error) => {
        console.log(url);
        console.log(error);
        alert("下载失败");
      },
    });
  }

  function showtable() {
    var ischeckbox = false;

    //const alist = $("#subtb td.first a");
    const alist = $("table td.first > a");

    alist.each((i, e) => {
      if (e.getAttribute("SHOWTABLE") == "true") {
        return;
      }
      e.setAttribute("SHOWTABLE", "true");

      console.log(e.href);

      const td = document.createElement("td");
      const button = document.createElement("button");
      button.id = "TALLDownBtnpage";
      button.textContent = "下载";
      button.className = "btn btn-md btn-default btn-sm";
      button.onclick = () => {
        subdown(e.href);
      };
      td.append(button);
      e.parentNode.parentNode.append(td);

      //---------------------
      //insertcheckbox(e, i);
    });

    function insertcheckbox(e, i) {
      function alldown() {
        const list = $("input[type='checkbox']:checked");
        //console.log(list);
        list.each(async (i, e) => {
          const vurl = $(e).attr("value");
          if (vurl) {
            await subdown(vurl);
          }
        });
      }

      if (!ischeckbox) {
        $("th.first").before(
          "<td> <input  style='width: 25px;height: 17px;' type='checkbox' id='allcheck'  class='checkbox' /></td>"
        );

        const allbutton = document.createElement("button");
        allbutton.id = "TALLDownBtnpage";
        allbutton.textContent = "下载";
        allbutton.className = "btn btn-md btn-default btn-sm";
        allbutton.onclick = alldown;
        $("th.first").append(allbutton);

        $("#subtb  thead > tr").append(
          "<td> <input  style='width: 25px;height: 17px;' type='checkbox' id='allcheck'  class='checkbox' /></td>"
        );

        $("#allcheck").click(function () {
          $("input[type='checkbox']").attr("checked", $(this).prop("checked"));
        });
        ischeckbox = true;
      }

      const td2 = document.createElement("td");
      const check = document.createElement("input");
      check.setAttribute("type", "checkbox");
      check.setAttribute("id", "mayi");
      $(td2).append(
        "<input   style='width: 25px;height: 17px;' type='checkbox' id='downcheck' class='checkbox' value='" +
          e.href +
          "' name='" +
          i +
          "'/>"
      );

      $(e).parent().before(td2);
    }
  }

  function addtable() {}

  function start() {
     if (/subs\/.*/.test(location.href)) {
        console.log("002");
      // noad();
      showtable();
    } else if (/detail\/.*/.test(location.href)) {
        console.log("003");
      noad();
      showurl();
    }else
         {
      console.log("001");
      showtable();
    }
  }

  start();
})();
