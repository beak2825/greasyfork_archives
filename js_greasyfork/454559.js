// ==UserScript==
// @name         ASEhelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  my ASEhelper
// @author       You
// @match        https://servicedesk.yydg.com.cn/esp/index.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yydg.com.cn
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454559/ASEhelper.user.js
// @updateURL https://update.greasyfork.org/scripts/454559/ASEhelper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // sleep 函数--Promise 版本
  function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  var run_mk = false;
  var isrun_mk = false;
  var run_num = 0;
  const run_max = 20;
  function auto_run() {
    isrun_mk = true;
    const trig = $("a:contains('關聯事件')");
    console.log(trig);
    if (trig.length > 0) {
      trig[0].click();

      const aurl = $("#evenTr > td:nth-child(2) > a");
      if (aurl.length > 0) {
        console.log("a", aurl);
        aurl[0].click();

        run_mk = true;
        clearInterval(tervalid);
        setTimeout(() => {
          window.close();
        }, 100);
      }
    }

    run_num++;
  }

  async function auto_insert() {
    isrun_mk = true;

    const n = $(
      "#lytDiv > div.commentDetailDiv > div > table:nth-child(1) > tbody > tr > td:nth-child(2) > span.lightBlue"
    );
    console.log(n);
    if (n.length > 0) {
      if (!n[0].text().indexOf("鄭偉坤")) {
        run_mk = true;
        clearInterval(tervalid);
      }
    }

    let orikey = $("#commentTypeSel")
      .find("option[orikey='討論']")
      .attr("selected", true);

    if (orikey.length == 0) {
      const ibtn = $(" #answer");
      console.log(ibtn);
      if (ibtn.length > 0) {
        ibtn[0].click();

        await sleep(1000); // 睡眠

        let orikey = $("#commentTypeSel")
          .find("option[orikey='討論']")
          .attr("selected", true);

        if (orikey.length == 0) {
          return;
        }

        run_mk = true;
        clearInterval(tervalid);
      }
    } else {
      run_mk = true;
      clearInterval(tervalid);
    }

    run_num++;
  }

  function run() {
    if (isrun_mk) {
      return;
    }

    if (run_mk) {
      clearInterval(tervalid);
      return;
    }
    if (run_num > run_max) {
      console.log("NO RUN OK");
      clearInterval(tervalid);
      return;
    }

    auto_run();

    auto_insert();

    isrun_mk = false;
  }

  function get_sj_date(item_obj) {
    const lastitem = $(item_obj).parents("tr").next();

    const sj_date = lastitem.find(" td:nth-child(4)")[1].innerText;

    // console.log("lastitem", lastitem);
    // console.log("sj_date", sj_date);
    return sj_date;
  }

  function check_month(c_date) {
    if (!c_date || c_date == "") return false;

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    const mdate = year + "/" + month + "/" + "01";

    c_date = c_date.substring(0, 10);
    let date1 = new Date(mdate);
    let date2 = new Date(c_date);

    // console.log("date1", date1);
    // console.log("date2", date2);

    if (date2.getTime() >= date1.getTime()) {
      return false;
    } else {
      return true;
    }
  }

  function ITEM_ALL() {
    // $($("#myTask tr > td:nth-child(1) > p > a")[0]).parents("tr").next();

    const lists = $("#myTask tr > td:nth-child(1) > p > a");
    const lastitem = lists[lists.length - 1];

    const sj_date = get_sj_date(lastitem);
    const re_date = check_month(sj_date);
    console.log(re_date);
    if (!re_date) {
      const loadMore = $("#loadMore");
      if (loadMore.length > 0) {
        loadMore[0].click();
        setTimeout(ITEM_ALL, 1000);
      } else {
        alert(" no loadMore");
        return;
      }
    } else {
      let is_date = false;
      const len = lists.length;
      for (let index = 1; index < len; index++) {
        const element = lists[len - index];
        if (!is_date) {
          const esj_date = get_sj_date(element);
          const ere_date = check_month(esj_date);
          if (!ere_date) {
            is_date = true;

            element.href = element.href + "#ASEhelper";
            element.click();
          }
        } else {
          element.href = element.href + "#ASEhelper";
          element.click();
        }
      }
    }
  }

  function addbutn() {
    let sh1 = "#taskHtml > thead > tr:nth-child(1) > td:nth-child(1)";
    sh1 = "#personInfo > div:nth-child(3)";
    const h1 = document.querySelector(sh1);

    console.log("h1", h1);
    if (h1) {
      const ce = document.createElement("button");
      ce.id = "RUN";
      ce.textContent = "RUN";
      ce.className = "btn-default";
      ce.onclick = function () {
        ITEM_ALL();
      };
      h1.append(ce);
    }
  }

  var tervalid = setInterval(run, 200);
  setTimeout(addbutn, 1000);
  addbutn();
})();