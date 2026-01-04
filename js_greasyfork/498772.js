// ==UserScript==
// @name            PT一键认领
// @name:en         PT torrents claim
// @description     根据关键字，种子大小批量认领种子
// @description:en  Claim seeds in bulk based on keywords, seed size
// @match           https://springsunday.net/userdetails.php?id=*
// @match           https://pterclub.com/userdetails.php?id=*
// @match           https://pterclub.com/getusertorrentlist.php?userid=*
// @match           https://zmpt.cc/userdetails.php?id=*
// @match           https://hdfans.org/userdetails.php?id=*
// @match           https://crabpt.vip/userdetails.php?id=*
// @match           https://leaves.red/userdetails.php?id=*
// @match           https://audiences.me/userdetails.php?id=*
// @match           https://pt.0ff.cc/userdetails.php?id=*
// @match           https://hdatmos.club/userdetails.php?id=*
// @match           https://hdtime.org/userdetails.php?id=*
// @match           https://www.icc2022.com/userdetails.php?id=*
// @match           https://www.okpt.net/userdetails.php?id=*
// @match           https://pandapt.net/userdetails.php?id=*
// @match           https://piggo.me/userdetails.php?id=*
// @match           https://ubits.club/userdetails.php?id=*
// @match           https://dajiao.cyou/userdetails.php?id=*
// @match           https://pt.soulvoice.club/userdetails.php?id=*
// @license         MIT
// @author          ngtrio
// @version         0.0.4
// @namespace       github.com/ngtrio
// @downloadURL https://update.greasyfork.org/scripts/498772/PT%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/498772/PT%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
  "use strict";

  onload = async function () {
    let block = getSeedingBlock();
    if (!block) {
      console.log("当前做种未找到");
      return;
    }

    const claim = document.createElement("div");
    let keywordInput = document.createElement("input");
    keywordInput.id = "claim-keyword";
    keywordInput.placeholder = "种子标题关键词";
    claim.appendChild(keywordInput);

    let sizeInput = document.createElement("input");
    sizeInput.id = "claim-size";
    sizeInput.placeholder = "种子最低大小(GB)";
    claim.appendChild(sizeInput);

    let btn1 = document.createElement("button");
    btn1.id = "pre-claim";
    btn1.innerHTML = "检测认领";
    btn1.onclick = preClaimTorrents;
    btn1.style.marginLeft = "10px";
    claim.appendChild(btn1);

    let btn2 = document.createElement("button");
    btn2.id = "do-claim";
    btn2.innerHTML = "确认认领";
    btn2.style.marginLeft = "10px";
    btn2.onclick = doClaimTorrents;
    claim.appendChild(btn2);

    block.prepend(claim);
  };

  function getKeywordInput() {
    let keyword = document.querySelector("#claim-keyword").value;
    console.log(`input keyword: [${keyword}]`);
    return keyword;
  }

  function getSizeInput() {
    let size = document.querySelector("#claim-size").value;
    console.log(`input size: [${size}]`);
    return size;
  }

  function getSeedingBlock() {
    if (location.href.match(/https:\/\/pterclub.com\/getusertorrentlist.php/)) {
      let tbody = document.querySelectorAll("tbody");
      return tbody[tbody.length - 1];
    } else {
      let rows = document.querySelectorAll("tr");
      for (let i = 0; i < rows.length; i++) {
        if (
          rows[i].childElementCount == 2 &&
          rows[i].cells[0].innerText == "当前做种"
        ) {
          return rows[i].cells[1];
        }
      }
    }
  }

  function getTorrentSize(str) {
    let size = Number(str.replace(RegExp(/B|KB|MB|GB|TB/), ""));
    let unit = str.replace(RegExp(/^[0-9]+(\.[0-9]+)?/), "");

    switch (unit) {
      case "KB":
        size *= 1024;
        break;
      case "MB":
        size *= 1024 * 1024;
        break;
      case "GB":
        size *= 1024 * 1024 * 1024;
        break;
      case "TB":
        size *= 1024 * 1024 * 1024 * 1024;
        break;
    }

    return size;
  }

  let preClaimTorrents = async function () {
    let targets = getTargetsToClaim(true);
    for (const target of targets) {
      target.elem.style.backgroundColor = "orange";
    }
  };

  let doClaimTorrents = async function () {
    let targets = getTargetsToClaim();
    let msg = `确定要认领检测到的${targets.length}个种子吗？`;
    if (confirm(msg) == true) {
      for (const target of targets) {
        let url = "";
        let method = "POST";
        let contentType = "application/x-www-form-urlencoded";
        let body = "";
        if (location.href.match(/https:\/\/springsunday.net\//)) {
          url = `/adopt.php`;
          body = new URLSearchParams({
            action: "add",
            id: target.id,
          }).toString();
        } else if (location.href.match(/https:\/\/pterclub.com\//)) {
          url = `/viewclaims.php?in_modal=yes&do_ajax=1&add_torrent_id=${target.id}`;
          method = "GET";
        } else if (location.href.match(/https:\/\/audiences.me\//)) {
          url = `/claim.php?act=add&tid=${target.id}`;
          method = "GET";
        } else {
          url = `/ajax.php`;
          body = new URLSearchParams({
            action: "addClaim",
            "params[torrent_id]": target.id,
          }).toString();
        }

        await fetch(url, {
          method: method,
          headers: {
            "Content-Type": contentType,
          },
          body: body ? body : null,
        }).then(async (resp) => {
          try {
            if (resp.status == 200) {
              if (location.href.match(/https:\/\/pterclub.com\//)) {
                try {
                    await resp.json();
                } catch (e) {
                    throw "认领失败（多半是认领人数满了）"
                }
              } else if (location.href.match(/https:\/\/springsunday.net\//)) {
                // do nothing
              } else if (location.href.match(/https:\/\/audiences.me\//)) {
                let rsp = await resp.json();
                if (!rsp["res"]) {
                  throw rsp["message"];
                }
              } else {
                let rsp = await resp.json();
                if (rsp["ret"] != 0) {
                  throw rsp["msg"];
                }
              }
              console.log(`认领成功: ${target.title}`);
              target.elem.style.backgroundColor = "lightgreen";
            } else {
                throw resp.status
            }
          } catch (e) {
            console.log(`认领失败: ${resp.status} ${e} ${target.title}`);
            target.elem.style.backgroundColor = "pink";
          }
        });

        await sleep(500);
      }
    }
  };

  function getTargetsToClaim(clearColor = false) {
    let keyword = getKeywordInput();
    let size = getSizeInput();
    let block = getSeedingBlock();
    if (!block) {
      return;
    }

    let rows = block.querySelectorAll("tr");
    console.log(`seeding num: ${rows.length}`);
    let targets = [];
    for (let i = 0; i < rows.length; i++) {
      let columns = rows[i].cells;

      let titleIdx = 1;
      let sizeIdx = 3;
      let btnIdx = columns.length - 1;
      if (location.href.match(/https:\/\/pterclub.com\//)) {
        btnIdx = columns.length - 7;
      } else if (location.href.match(/https:\/\/springsunday.net\//)) {
        sizeIdx = 2;
      } else if (location.href.match(/https:\/\/audiences.me\//)) {
        sizeIdx = 2;
      }

      if (clearColor) {
        columns[btnIdx].style.backgroundColor = "";
      }

      let titleElem = columns[titleIdx].querySelector("a");
      if (!titleElem) {
        continue;
      }
      let title = titleElem.getAttribute("title");
      if (keyword != "" && !title.includes(keyword)) {
        continue;
      }

      let sizeElem = columns[sizeIdx].textContent;
      let torrentSize = getTorrentSize(sizeElem);
      if (size != "") {
        let minSize = Number(size) * 1024 * 1024 * 1024;
        if (minSize >= torrentSize) {
          continue;
        }
      }

      let claimTorrentId = "";
      if (location.href.match(/https:\/\/pterclub.com\//)) {
        let btnElem = columns[btnIdx].querySelector("a");
        if (btnElem) {
          const parts = /add_torrent_id=(\d+)/.exec(
            btnElem.getAttribute("data-url")
          );
          if (parts && parts.length > 1) {
            claimTorrentId = parts[1];
          }
        }
      } else if (location.href.match(/https:\/\/audiences.me\//)) {
        let btnElem = columns[btnIdx].querySelector("a");
        if (btnElem && btnElem.textContent.includes('认领种子')) {
          const parts = /claim_block(\d+)/.exec(btnElem.getAttribute("href"));
          if (parts && parts.length > 1) {
            claimTorrentId = parts[1];
          }
        }
      } else {
        let btnElem = columns[btnIdx].querySelector("button");
        if (btnElem) {
          if (location.href.match(/https:\/\/springsunday.net\//)) {
            claimTorrentId = btnElem.getAttribute("id").replace("btn", "");
          } else if (btnElem.style.display != "none") {
            claimTorrentId = btnElem.getAttribute("data-torrent_id");
          }
        }
      }
      if (claimTorrentId == "") {
        continue;
      }

      targets.push({
        title: title,
        elem: columns[btnIdx],
        id: claimTorrentId,
      });
    }

    console.log(targets);
    return targets;
  }

  function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
})();
