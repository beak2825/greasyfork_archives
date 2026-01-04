// ==UserScript==
// @name            ECUSTPT种子一键认领和取消认领
// @name:en         ECUSTPT torrents addclaim & removeclaim
// @namespace       https://public.ecustpt.eu.org/
// @version         0.0.9
// @description     种子一键认领和取消认领
// @description:en  One key claim or removeclaim all the seeding torrents in ECUSTPT.
// @author          Lancertony
// @match           http*://pt.ecust.pp.ua/userdetails.php?id=*
// @match           http*://ecustpt.eu.org/userdetails.php?id=*
// @license         MIT
// @icon            https://ecust.edu.cn/_upload/tpl/00/2c/44/template44/images/logo.png
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/486639/ECUSTPT%E7%A7%8D%E5%AD%90%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86%E5%92%8C%E5%8F%96%E6%B6%88%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/486639/ECUSTPT%E7%A7%8D%E5%AD%90%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86%E5%92%8C%E5%8F%96%E6%B6%88%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

/**
 * 改自KamePT一键认领, 原网址: https://greasyfork.org/zh-CN/scripts/434757-烧包一键认领
 */

(function () {
  'use strict';

  // Your code here...
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time)).catch((e) => { console.log(e); });
  }

  window.onload = function () {
    var rows = document.querySelectorAll("tr");//tr表行元素，获取所有表行
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].childElementCount == 2 && rows[i].cells[0].innerText == "当前做种") {//如果该表行只有两个子元素且第一个子元素的内部文本为“当前做种”
        var idClaim = document.getElementById("claimAllTorrents");//获取所有ID为的claimAllTorrents的元素
          if (idClaim == null) { // 如果为空，则创建一键认领和取消认领按钮
              const parentCell = rows[i].cells[1];

              // 创建一键取消认领按钮
              const removeClaimButtonDom = document.createElement('div');
              removeClaimButtonDom.innerHTML = '<a id="removeclaimAllTorrents" href="javascript:void(0);" onclick="window.manualremoveClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="取消认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键取消认领</a>';
              parentCell.prepend(removeClaimButtonDom);

              // 创建一键认领按钮
              const claimButtonDom = document.createElement('div');
              claimButtonDom.innerHTML = '<a id="claimAllTorrents" href="javascript:void(0);" onclick="window.manualClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键认领</a>';
              parentCell.prepend(claimButtonDom);

              break;
          }
      }
    }
  }

  unsafeWindow.manualClaimTorrents = async function () {
    const _raw_list = Array.from(document.querySelectorAll("button[data-action='addClaim']"));
    const list = _raw_list.filter(el => el.style.display != 'none');//获取所有a元素
    console.log(list);
    if (list.length == 0) {
      alert('未检测到已做种种子或已经全部认领\n请打开当前做种列表, 若列表没有种子您无法认领!\n若您已经全部认领请无视!')
      return
    }

    var msg = "确定要认领本页全部种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负! \n点击后请等待至弹窗, 种子越多越要等捏O(∩_∩)O(每个种子访问间隔500ms)\n贝极星佬可爱捏";
    if (confirm(msg) == true) {//提示选择确认
      var maxClaim = 5000;
      var result = await unsafeWindow.ClassificationClaimTorrents(list, maxClaim);
      var total = result.total;
      var success = result.success;
      alert(`共计${total}个种子，本次成功认领${success}个。（高延迟情况下计数不准，建议刷新看看）`);
    }
  }

  unsafeWindow.manualremoveClaimTorrents = async function () {
    const _raw_list = Array.from(document.querySelectorAll("button[data-action='removeClaim']"));
    const list = _raw_list.filter(el => el.style.display != 'none');//获取所有a元素
    console.log(list);
    if (list.length == 0) {
      alert('未检测到已做种种子或已经全部取消认领\n请打开当前做种列表, 若列表没有种子您无法认领!\n若您已经全部取消认领请无视!')
      return
    }

    var msg = "确定要取消认领本页全部种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负! \n点击后请等待至弹窗, 种子越多越要等捏O(∩_∩)O(每个种子访问间隔500ms)\n贝极星佬可爱捏";
    if (confirm(msg) == true) {//提示选择确认
      var maxClaim = 5000;
      var result = await unsafeWindow.ClassificationremoveClaimTorrents(list, maxClaim);
      var total = result.total;
      var success = result.success;
      alert(`共计${total}个种子，本次成功取消认领${success}个。（高延迟情况下计数不准，建议刷新看看）`);
    }
  }

  unsafeWindow.ClassificationClaimTorrents = async function (element, maxClaim) {
    var total = 0, success = 0;

    for (const el of element) {
      if (success >= maxClaim) {
        alert("最多只能认领5000个种子！");
        break;
      }

      total += 1

      const claimId = el.dataset.torrent_id
      if (claimId > 0) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://pt.ecust.pp.ua/ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('action=addClaim&params%5Btorrent_id%5D=' + claimId);
      }

      xhr.onload = function () {
        if (xhr.status == 200) {
          // response 就是你要的东西
          var response = xhr.responseText
          el.style.background = 'lime';
          el.innerText = '成功';

          // console.log(response)

          success += 1;
        }
      }

      await sleep(500);
    }
    return {
      total: total,
      success: success
    }
  }

  unsafeWindow.ClassificationremoveClaimTorrents = async function (element, maxClaim) {
    var total = 0, success = 0;

    for (const el of element) {
      if (success >= maxClaim) {
        alert("最多只能取消认领5000个种子！");
        break;
      }

      total += 1

      const claimId = el.dataset.claim_id
      if (claimId > 0) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://pt.ecust.pp.ua/ajax.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('action=removeClaim&params%5Bid%5D=' + claimId);
      }

      xhr.onload = function () {
        if (xhr.status == 200) {
          // response 就是你要的东西
          var response = xhr.responseText
          el.style.background = 'lime';
          el.innerText = '成功';

          // console.log(response)

          success += 1;
        }
      }

      await sleep(500);
    }
    return {
      total: total,
      success: success
    }
  }
})();