// ==UserScript==
// @name         TJUPT Helper
// @namespace    https://greasyfork.org/scripts/445739
// @version      1.2
// @description  TJUPT 辅种工具
// @author       xqm32
// @include      /^https?://www\.tjupt\.org/userdetails.php\?id=.*/
// @icon         none
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445739/TJUPT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445739/TJUPT%20Helper.meta.js
// ==/UserScript==

(function () {
  let getUserPassKey = function () {
    let passkey = $("#th-passkey").val();
    if (passkey.length == 0) passkey = "YOUR_PASSKEY";
    return passkey;
  };

  let getUserID = function () {
    let url = new URL(window.location.href);
    return url.searchParams.get("id");
  };

  let getTorrentList = async function (e, t, n) {
    const i = $(`#${n}`);
    console.log("getTorrentList");
    $("#th-copy").text(`获取中`);
    klappe_news(n.substr(1)),
      "加载中..." === i.html() &&
        (await $.get(
          "getusertorrentlistajax.php",
          {
            userid: e,
            type: t,
          },
          (e) => {
            i.html(e);
          }
        ));
  };

  let showTorrentList = function (n) {
    $(`#${n} > table > tbody > tr:nth-child(1)`).append(
      `<td class="colhead" align="center">种子 ID</td>`
    );
    let trs = $(`#${n} > table > tbody > tr`);
    $("#th-copy").text(`点击复制获取的 ${trs.length - 1} 条记录`);
    let passkey = getUserPassKey();
    for (let i = 1; i < trs.length; ++i) {
      let href = $(trs[i]).find(`td[class="rowfollow"] > a`).attr("href");
      let url = new URL(window.location.origin + "/" + href);
      let id = url.searchParams.get("id");
      $(trs[i]).append(`<td class="rowfollow" align="center">${id}</td>`);
      $("#th-torrentList").append(
        `https://www.tjupt.org/download.php?id=${id}&passkey=${passkey}\n`
      );
    }
  };

  $("#outer > table > tbody > tr > td > h2").after(
    `<button id="th-seeding">获取做种中种子</button>` +
      `<button id="th-completed">获取已完成种子</button>` +
      `<button id="th-copy" class="th-btn" data-clipboard-target="#th-torrentList">请先点击获取</button>` +
      `<label for="th-passkey">你的密钥(可选)：</label>` +
      `<input id="th-passkey"/>` +
      `<br/>` +
      `<textarea id="th-torrentList" rows="5" style="width: 600px; height: 90px;"></textarea>`
  );

  $("#th-seeding").click(() =>
    getTorrentList(getUserID(), "seeding", "ka1").then(() =>
      showTorrentList("ka1")
    )
  );
  $("#th-completed").click(() =>
    getTorrentList(getUserID(), "completed", "ka3").then(() =>
      showTorrentList("ka3")
    )
  );

  new ClipboardJS(".th-btn");
})();
