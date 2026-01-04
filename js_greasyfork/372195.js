// ==UserScript==
// @name         靜宜大學課程清單選課人數顯示
// @namespace    https://www.moontai0724.tw
// @version      1.1.1
// @description  於靜宜大學課程清單網頁顯示目前選課人數與人數上限
// @author       moontai0724
// @match        https://alcat.pu.edu.tw/2011courseAbstract/main.php*
// @supportURL   https://github.com/moontai0724/pu-courses-quota-filter-script
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/372195/%E9%9D%9C%E5%AE%9C%E5%A4%A7%E5%AD%B8%E8%AA%B2%E7%A8%8B%E6%B8%85%E5%96%AE%E9%81%B8%E8%AA%B2%E4%BA%BA%E6%95%B8%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/372195/%E9%9D%9C%E5%AE%9C%E5%A4%A7%E5%AD%B8%E8%AA%B2%E7%A8%8B%E6%B8%85%E5%96%AE%E9%81%B8%E8%AA%B2%E4%BA%BA%E6%95%B8%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.head.innerHTML += `<style type="text/css">#menu>li { padding: 0px 0px 0px 0px !important; }</style>`;
  document.querySelector("tr>th:nth-child(2)").innerHTML +=
    "(目前人數/人數上限)";

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.innerHTML = "獲取目前修課人數";
  button.addEventListener("click", showQuota);
  li.appendChild(button);
  document.querySelector("#menu").appendChild(li);

  function showQuota() {
    if (Number(sessionStorage.getItem("delayTime")) > new Date().getTime()) {
      window.alert("請稍後再嘗試！冷卻時間十秒！");
      return;
    }

    sessionStorage.setItem("delayTime", new Date().getTime() + 10000);
    removeExisting();

    const courses = Array.from(document.getElementsByTagName("tr"))
      .map((element) => {
        const items = element.getElementsByTagName("td");
        if (items.length === 0) return NaN;
        const id = items[0];
        return { id: parseInt(id.textContent), target: items[1], element };
      })
      .filter((item) => !isNaN(item.id));

    courses.forEach(async (course) => {
      const quota = await fetchQuota(course.id);
      const display = document.createElement("span");
      display.classList.add("classQuota");
      if (quota.current >= quota.quota) {
        display.style.color = "red";
        display.style.fontWeight = "bold";
      }
      display.innerHTML = `(${quota.current}/${quota.quota})`;
      course.target.appendChild(display);
    });
  }

  function removeExisting() {
    const existing = document.getElementsByClassName("classQuota");
    Array.from(existing).forEach((e) => e.remove());
  }

  async function fetchQuota(classNumber) {
    const data = new URLSearchParams({
      selectno: classNumber.toString().padStart(4, "0"),
    });
    const response = await fetch(
      "https://alcat.pu.edu.tw/choice/q_person.html",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
        cache: "no-cache",
      }
    ).then((response) => response.text());

    const rawTable = response.match(/\<table[\s\S]*?\<\/table\>/).shift();
    let table = document.createElement("table");
    table.innerHTML = rawTable;

    const list = Array.from(table.querySelectorAll("tr"));

    const quota = Number(list.shift().querySelectorAll("td")[1].textContent);
    const current = list
      .map((e) => Number(e.querySelectorAll("td")[1].textContent))
      .reduce((a, b) => a + b, 0);

    return { quota, current };
  }
})();
