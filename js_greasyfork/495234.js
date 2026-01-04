// ==UserScript==
// @name         Cookies切换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  掌控你的cookie吧~~
// @author       Cheney
// @match        http://*/*
// @match        https://*/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAArlJREFUSEullktoE0EYx//ftEKxD2uVFitW8AH25AssKIiCvVQQsaAeeiiKBzWZRMylXmwvnipkZ6OUoniwh6BexMdBPYiIggcVRS1YwQdUbKWRIhLbuJ+d3abNdjfJNlmYw+73+H0z859vllDgYSlbAMQAVJNSxwv5FrORnwNHo/VgvgDmkzn2PlKqt1jCfHYPiKPRLbCsAQBtniDL2kuJxONSYC4Qh0IHIcRVAA2+yZiryDT/lgXiUKgZQjwBsN43EdFLMoztpUB0zNyMWMpLAE5lE70Zz+Dy6z8YaK9zPjGPkGluLAvEUnYAuJebpFaN2a89bdU411btmIgOk2HcLAVmz4ilvALAJV/PjLLZS4QRR6OrYFnvAdQvotIkgM+kVE/QGGIpTwNIBA3I8RsmpVqDxmmQlvOxoAE5fmkIsY7i8e9BYokjkadg3hXE2ccncLfQoHEwrywRpMM8MI7FGqm/35Ht7OMBfZ38Z5ta6ipc7NHfFtpvpbC2tgL3Oz26+QTmb7NHYA+EOEPxeHwhyLV0+vy0NlTiRZe7C32YyGDH0IRdwLvuFcUWYBjMnWSaWs0OnyORa2Duzn7YnZxAzRLhVzVejWXQtFSguUYUA2l7Gun0Ghoc/OmApNSt/3yQyCA+qbSF5VWuQvocUCi0CUK8BVAZJFEhn0O3f+Hhlyl7aRfs8dlsC7oOoKtc0IkHk3g2Oo2hjmXY2jhX9w9MT7c6oHB4P4julgvKE99LSvXNXxORSBLMRwrBFikGneoOKXXA3qPcxCwl5wMtUt46zSgptXpO3i5QOLwZRI9mmqynU0xOMfbdSGFbU+X8ZZivKqLnZBg7XQfWz7csyRPFyDAuLszr+7uVI5CjAPQoJv0MAL3HSTJN103tu3S+s3POmYZtmB3Z/4aPM0dixB6WlaREYriQkP4DhYT2pc+2+CQAAAAASUVORK5CYII=
// @grant       GM_cookie
// @grant       GM_getValue
// @grant       GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495234/Cookies%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/495234/Cookies%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const hostname = location.hostname;
  const domain = hostname;
  const cookiesConfig = GM_getValue("cookiesConfig", {});
  const mainClassName = `cookieSwitchWrapper_${randomStr()}`;

  function randomStr() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < 6; i++) {
      str += letters[Math.floor(Math.random() * 26)];
    }
    return str;
  }

  // 关闭操作界面
  function closePannel() {
    $(`.${mainClassName}`).css("transform", "translateX(110%)");
  }
  // 样式
  function createStyle() {
    const css = `.${mainClassName} {position: fixed;z-index: 999999;top: 0;right: 0;width: 1000px;height: 100%;padding: 10px;transition: transform 200ms;transform: translateX(110%);background-color: #fff;box-shadow: -10px 0 10px #ddd;.topWrapper {display: flex;justify-content: space-between;select {min-width: 200px;}.titleInput {font-size: 14px;padding: 4px 8px;outline: none;}}.cookieTable {width: 100%;margin-top: 20px;thead {background-color: #fafafa;th {font-size: 14px;position: relative;padding: 6px;white-space: nowrap;&::before {position: absolute;top: 50%;right: 0;width: 1px;height: 16px;content: "";transform: translateY(-50%);background-color: #f0f0f0;}}}tbody {tr {border-bottom: 1px solid #f0f0f0;td {font-size: 12px;padding: 4px;text-align: center;&.cookie-value {text-align: left;word-break: break-all;}input {width: calc(100% - 8px);padding: 2px;border: 1px solid #fff;outline: none;background-color: transparent;}button {word-break: keep-all;border: 1px solid #ccc;border-radius: 2px;}}}}}.btnWrapper {display: flex;justify-content: center;margin-top: 20px;button {margin-left: 20px;padding: 8px 20px;cursor: pointer;border: 1px solid #ddd;border-radius: 4px;background-color: #fff;&:hover {background-color: #f1f1f1;}}}}`;
    return $("<style lang='scss'></style>").text(css);
  }

  // 悬浮按钮
  function createCookieBtn() {
    const pageWidth = $(window).width();
    const pageHeight = $(window).height();
    let left0 = 0;
    let top0 = 0;
    const cookieBtn = $(
      `<div id="cookieBtn"><svg t="1715656222971" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1852" width="26" height="26"><path d="M1023.72271 650.495659a541.231658 541.231658 0 0 1-881.127308 230.481105 544.362949 544.362949 0 0 1 221.599077-880.946655A161.773348 161.773348 0 0 0 414.897311 63.37854c9.183114 12.133754 19.901765 23.002948 31.915085 32.366713-12.766034 33.26997-49.468381 147.381451 27.097713 191.791593 16.077976 28.84401 48.655449 49.980227 108.782264 51.184569 0.602171 41.579935 9.785285 109.264001 59.283775 139.222029 27.850427 44.620901 84.635191 71.206769 198.716563 22.611536A167.102565 167.102565 0 0 0 903.288429 609.186701a98.816327 98.816327 0 0 0 120.434281 41.308958z" fill="#FF6E6E" p-id="1853" data-spm-anchor-id="a313x.search_index.0.i1.7c3a3a81JPZWHS" class=""></path><path d="M195.737029 542.104807a45.162855 45.162855 0 1 1 0 90.32571 45.162855 45.162855 0 0 1 0-90.32571z m270.977132 270.977132a45.162855 45.162855 0 1 1 0 90.32571 45.162855 45.162855 0 0 1 0-90.32571z m0-301.085703a45.162855 45.162855 0 1 1 0 90.325711 45.162855 45.162855 0 0 1 0-90.325711z m-180.651422-301.085702a45.162855 45.162855 0 1 1 0 90.325711 45.162855 45.162855 0 0 1 0-90.325711z m511.845694 451.628553a45.162855 45.162855 0 1 1 0 90.325711 45.162855 45.162855 0 0 1 0-90.325711z" fill="#0C0058" p-id="1854" data-spm-anchor-id="a313x.search_index.0.i3.7c3a3a81JPZWHS" class="selected"></path></svg></div>`
    )
      .css({
        width: "26px",
        height: "26px",
        position: "fixed",
        right: "40px",
        bottom: "40px",
        "z-index": 99999,
        cursor: "pointer",
        "user-select": "none",
        "box-shadow": "-4px 4px 8px #ddd ",
        "border-radius": "50%",
      })
      .mousedown(() => {
        left0 = parseFloat(cookieBtn.css("left"));
        top0 = parseFloat(cookieBtn.css("top"));
        console.log("[ left0, top0 ] =====>", left0, top0);
        $(document).on("mousemove.drag", (e) => {
          let left = e.pageX - 13;
          let top = e.pageY - 13;
          left = left < 0 ? 0 : left;
          left = left > pageWidth - 26 ? pageWidth - 26 : left;
          top = top < 0 ? 0 : top;
          top = top > pageHeight - 26 ? pageHeight - 26 : top;
          cookieBtn.css({
            left,
            top,
            right: "unset",
            bottom: "unset",
          });
        });
      })
      .mouseup(() => {
        const left = parseFloat(cookieBtn.css("left"));
        const top = parseFloat(cookieBtn.css("top"));
        if (Math.abs(left0 - left) + Math.abs(top0 - top) < 10) {
          $(`.${mainClassName}`).css("transform", "translateX(0)");
        }
        $(document).off("mousemove.drag");
      });
    return cookieBtn;
  }
  // 主页面
  function createMain() {
    let title = cookiesConfig[domain]?.[0].title;
    const titleSelect = $("<select class='title-select'>")
      .val(title)
      .change((e) => {
        title = $(e.target).val();
        const currentCookie = cookiesConfig[domain].find((item) => item.title === title);
        fillTable(currentCookie?.cookies);
        titleInput.val(title);
      });
    if (cookiesConfig[domain]) {
      cookiesConfig[domain].forEach((item) => {
        titleSelect.append($("<option>").text(item.title));
      });
    }
    const titleInput = $("<input class='titleInput' />")
      .attr("placeholder", "输入标题")
      .val(title)
      .change((e) => {
        title = $(e.target).val();
        titleSelect.val(title);
      });
    const closeBtn = $("<button>关闭</button>").click(closePannel);
    const topDiv = $("<div class='topWrapper'>").append(
      `<span>当前域名：${domain}</span>`,
      titleSelect,
      titleInput,
      closeBtn
    );
    const cookieTable = $("<table class='cookieTable'></table>")
      .append(
        `<thead><tr><th>Name</th><th>Value</th><th>Domain</th><th>Path</th><th>Expires/Max-Age</th><th>Size</th><th>HttpOnly</th><th>Secure</th><th>SameSite</th><th>操作</th></tr></thead>`,
        `<tbody>`
      )
      .on("click", ".editable:not(.editing)", (event) => {
        const td = $(event.target);
        td.toggleClass("editing");
        const input = $("<input />");
        input.val(td.text());
        input.blur(() => {
          td.toggleClass("editing");
          td.html(input.val());
        });
        td.html(input);
        input.focus();
      });
    const addBtn = $("<button>新增</button>").click(() => {
      const deleteBtn = $("<button>删除</button>").click(() => {
        if (confirm(`确认删除吗？`)) {
          tr.remove();
        } else {
          console.log("取消");
        }
      });
      const deleteTd = $("<td>").append(deleteBtn);
      const tr = $("<tr class='cookie-row'>").append(
        `<td class="editable"></td><td class="editable cookie-value"></td><td class="editable">${domain}</td><td class="editable">/</td><td class="editable"></td><td></td><td class="editable"></td><td class="editable"></td><td class="editable"></td>`,
        deleteTd
      );
      $(`.${mainClassName} tbody`).append(tr);
    });
    const saveBtn = $("<button>保存</button>").click(() => {
      saveCookie();
    });
    const applyBtn = $("<button>保存并应用</button>").click(() => {
      applyCookie();
    });
    const btnWrapper = $("<div class='btnWrapper'></div>").append(addBtn, saveBtn, applyBtn);
    return $(`<div class='${mainClassName}'></div>`).append(topDiv, cookieTable, btnWrapper);
  }

  // 初始化页面
  function initPage() {
    const domain = document.domain;
    const main = createMain();
    const style = createStyle();
    const cookieBtn = createCookieBtn();
    $("body").append(style, cookieBtn, main);
    GM_cookie.list({}, function (cookies, error) {
      if (!error) {
        fillTable(cookies);
      } else {
        alert("获取cookie失败，请检查是否支持GM_cookie函数（目前只有beta版支持）");
      }
    });
  }

  // 保存cookie
  function saveCookie() {
    const title = $(".titleInput").val();
    if (["", undefined, null].includes(title)) {
      alert("请输入标题");
      return;
    }
    const cookies = [];
    $(".cookieTable .cookie-row").each(function () {
      const tds = $(this).children("td");
      cookies.push({
        name: tds[0].innerText,
        value: tds[1].innerText,
        domain: tds[2].innerText,
        path: tds[3].innerText,
        expirationDate: +new Date(tds[4].innerText) / 1000,
        httpOnly: Boolean(tds[6].innerText),
        secure: Boolean(tds[7].innerText),
        sameSite: tds[8].innerText,
      });
    });
    const currentDomain = cookiesConfig[domain];
    if (currentDomain) {
      const currentCookie = currentDomain.find((item) => item.title === title);
      if (currentCookie) {
        currentCookie.cookies = cookies;
      } else {
        currentDomain.push({
          title,
          cookies,
        });
      }
    } else {
      cookiesConfig[domain] = [
        {
          title,
          cookies,
        },
      ];
    }
    console.log("[ cookiesConfig ] =====>", cookiesConfig);
    GM_setValue("cookiesConfig", cookiesConfig);
    return cookies;
  }

  // 保存并应用cookie
  function applyCookie() {
    const cookies = saveCookie();
    cookies.forEach((cookie) => {
      console.log(cookie);
      GM_cookie.set(cookie, function (error) {
        if (error) {
          console.error(error);
        } else {
          console.log("Cookie set successfully.");
        }
      });
    });
    closePannel();
  }

  // 填充表格
  function fillTable(cookies) {
    $(`.${mainClassName} tbody`).html("");
    cookies?.forEach((cookie, index) => {
      const deleteBtn = $("<button>删除</button>").click(() => {
        if (confirm(`确认删除${cookie.name}吗？`)) {
          tr.remove();
        }
      });
      const deleteTd = $("<td>").append(deleteBtn);
      const tr = $("<tr class='cookie-row'>").append(
        `
                <td class="editable">${cookie.name || ""}</td>
                <td class="editable cookie-value">${cookie.value || ""}</td>
                <td class="editable">${cookie.domain || ""}</td>
                <td class="editable">${cookie.path || ""}</td>
                <td class="editable">${new Date(cookie.expirationDate * 1000).toLocaleString() || ""}</td>
                <td>${cookie.value?.length || ""}</td>
                <td class="editable">${cookie.httpOnly}</td>
                <td class="editable">${cookie.secure}</td>
                <td class="editable">${cookie.sameSite || ""}</td>`,
        deleteTd
      );
      $(`.${mainClassName} tbody`).append(tr);
    });
  }

  initPage();
})();
