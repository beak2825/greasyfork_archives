// ==UserScript==
// @name            NP一键认领
// @name:en         NP torrents claim
// @namespace       http://shadowflow.org/
// @version         0.0.13
// @description     适用于NP架构的一键认领
// @description:en  one key claim all the seeding torrents for NesusPHP.
// @author          Lancertony
// @match           https://shadowflow.org/userdetails.php?id=*
// @match           https://1ptba.com/userdetails.php?id=*
// @match           https://pt.btschool.club/userdetails.php?id=*
// @match           https://carpt.net/userdetails.php?id=*
// @match           https://cyanbug.net/userdetails.php?id=*
// @match           https://hdfans.org/userdetails.php?id=*
// @match           https://hdvideo.one/userdetails.php?id=*
// @match           https://hdtime.org/userdetails.php?id=*
// @match           https://hdpt.xyz/userdetails.php?id=*
// @match           https://hdatmos.club/userdetails.php?id=*
// @match           https://pt.0ff.cc/userdetails.php?id=*
// @match           https://discfan.net/userdetails.php?id=*
// @match           https://zmpt.cc/userdetails.php?id=*
// @match           https://wintersakura.net/userdetails.php?id=*
// @match           https://pt.soulvoice.club/userdetails.php?id=*
// @match           https://piggo.me/userdetails.php?id=*
// @match           https://www.pthome.net/userdetailspage.php?userid=*
// @match           https://kamept.com/userdetails.php?id=*
// @match           https://audiences.me/userdetails.php?id=*
// @match           https://dajiao.cyou/userdetails.php?id=*
// @match           https://springsunday.net/userdetails.php?id=*
// @match           https://shadowflow.org/claim.php?uid=*
// @license         MIT
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/471923/NP%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/471923/NP%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

/**
 * 改自KamePT一键认领, 原网址: https://greasyfork.org/zh-CN/scripts/434757-烧包一键认领
 * 理论上NP架构的都可以用
 * 增加个别站点的一键取消认领
 */

(function () {
  'use strict';

  // Your code here...
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time)).catch((e) => { console.log(e); });
  }

  window.onload = function () {
      if (location.href.match(/^https:\/\/shadowflow.org\/claim.php/)) {
         var claimBtn = document.getElementById("declaimAllTorrents");
         if (claimBtn == null) {
             const dom = document.createElement('div');
             dom.innerHTML = '<div id="declaimAllTorrents"><button class="bg-[#CDAE9C] rounded-sm w-[50px] h-[24px]" onclick="window.deClaimTorrents();" style="width: 120px;"><img style="margin-right: 4px;" class="staff_delete" src="pic/trans.gif">一键取消认领</button></div>';
             document.getElementById("claim-table").prepend(dom);
         }
     } else {
        var rows = document.querySelectorAll("tr");//tr表行元素，获取所有表行
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].childElementCount == 2 && rows[i].cells[0].innerText == "当前做种") {//如果该表行只有两个子元素且第一个子元素的内部文本为“当前做种”
                var idClaim = document.getElementById("claimAllTorrents");//获取所有ID为的claimAllTorrents的元素
                if (idClaim == null) {//如果为空，则创建一键认领按钮
                    const dom = document.createElement('div');
                    dom.innerHTML = '<a id="claimAllTorrents" href="javascript:void(0);" onclick="window.manualClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键认领</a>';
                    rows[i].cells[1].prepend(dom)
                    break;
                }
            }
        }
     }
  }

  unsafeWindow.deClaimTorrents = async function() {
    const _raw_list = Array.from(document.querySelectorAll('button[data-action="removeClaim"]'));
    const list = _raw_list.filter(el => el.style.display != 'none');
    console.log(list);
    if (list.length == 0) {
      alert('未检测到可取消认领的种子\n若列表没有种子您无法取消认领!')
      return
    }
    var msg = "确定要取消认领本页全部种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n取消认领可能会被扣除魔力!请一定要考虑清楚! \n点击后请等待至弹窗, 种子越多越要等捏O(∩_∩)O(每个种子访问间隔500ms)";
    if (confirm(msg) == true) {
        await unsafeWindow.ClassificationDeClaimTorrents(list);
    }
    var total = result.total;
    var success = result.success;
    alert(`共计${total}个种子，本次取消认领${success}个，即将刷新页面。`);
    location.reload();
  }

  unsafeWindow.ClassificationDeClaimTorrents = async function (element) {
    var total = 0, success = 0;
    for (const el of element) {
      total += 1;
      var claimId = el.dataset.claim_id;
      if (claimId > 0) {
        var xhr = new XMLHttpRequest();
        var params = 'action=removeClaim&params%5Bid%5D=';
        var endpoint = '';
        if (location.href.match(/^https:\/\/shadowflow.org\//)) {
            endpoint = 'https://shadowflow.org/ajax.php';
        }
        xhr.open('POST', endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params + claimId);
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

  unsafeWindow.getRawList = function () {
    if (location.href.match(/^https:\/\/audiences.me\//)) {
        return Array.from(document.querySelectorAll('a[href^="javascript:claim(\'add\'"]'));
    } else if (location.href.match(/^https:\/\/springsunday.net\//)) {
        return Array.from(document.querySelectorAll('button[onclick^="adopt_new"]'));
    } else {
        return Array.from(document.querySelectorAll("button[data-action='addClaim']"));
    }
  }

  unsafeWindow.manualClaimTorrents = async function () {
    const _raw_list = unsafeWindow.getRawList();
    const list = _raw_list.filter(el => el.style.display != 'none');//获取所有a元素
    console.log(list);
    if (list.length == 0) {
      alert('未检测到已做种种子或已经全部认领\n请打开当前做种列表, 若列表没有种子您无法认领!\n若您已经全部认领请无视!')
      return
    }

    var msg = "确定要认领本页全部种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负! \n点击后请等待至弹窗, 种子越多越要等捏O(∩_∩)O(每个种子访问间隔500ms)";
    if (confirm(msg) == true) {//提示选择确认
      var maxClaim = 10000;
      var result = {};
      if (location.href.match(/^https:\/\/audiences.me\//)) {
        result = await unsafeWindow.AudiencesClaimTorrents(list, maxClaim);
      } else {
        result = await unsafeWindow.ClassificationClaimTorrents(list, maxClaim);
      }
      var total = result.total;
      var success = result.success;
      alert(`共计${total}个种子，本次成功认领${success}个。`);
    }
  }

  unsafeWindow.AudiencesClaimTorrents = async function (element, maxClaim) {
    var total = 0, success = 0;
    for (const el of element) {
      if (success >= maxClaim) {
        alert("最多只能认领10000个种子！");
        break;
      }
      total += 1;
      var strs = el.pathname.split(',');
      const claimId = strs[1].substring(1, strs[1].length-1);
      if (claimId > 0) {
        var xhr = new XMLHttpRequest();
        var params = 'act=add&tid=' + claimId;
        var endpoint = 'claim.php?'+ params;
        xhr.open('GET', endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
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

  unsafeWindow.ClassificationClaimTorrents = async function (element, maxClaim) {
    var total = 0, success = 0;
    for (const el of element) {
      if (success >= maxClaim) {
        alert("最多只能认领10000个种子！");
        break;
      }
      total += 1;
      var claimId = el.dataset.torrent_id;
      if (location.href.match(/^https:\/\/springsunday.net\//)) {
          claimId = el.id.substring(3);
      }
      if (claimId > 0) {
        var xhr = new XMLHttpRequest();
        var params = 'action=addClaim&params%5Btorrent_id%5D=';
        var endpoint = '';
        if (location.href.match(/^https:\/\/shadowflow.org\//)) {
            endpoint = 'https://shadowflow.org/ajax.php';
        } else if (location.href.match(/^https:\/\/1ptba.com\//)) {
            endpoint = 'https://1ptba.com/ajax.php';
        } else if (location.href.match(/^https:\/\/pt.btschool.club\//)) {
            endpoint = 'https://pt.btschool.club/ajax.php';
        } else if (location.href.match(/^https:\/\/carpt.net\//)) {
            endpoint = 'https://carpt.net/ajax.php';
        } else if (location.href.match(/^https:\/\/cyanbug.net\//)) {
            endpoint = 'https://cyanbug.net/ajax.php';
        } else if (location.href.match(/^https:\/\/hdfans.org\//)) {
            endpoint = 'https://hdfans.org/ajax.php';
        } else if (location.href.match(/^https:\/\/hdvideo.one\//)) {
            endpoint = 'https://hdvideo.one/ajax.php';
        } else if (location.href.match(/^https:\/\/hdtime.org\//)) {
            endpoint = 'https://hdtime.org/ajax.php';
        } else if (location.href.match(/^https:\/\/hdpt.xyz\//)) {
            endpoint = 'https://hdpt.xyz/ajax.php';
        } else if (location.href.match(/^https:\/\/hdatmos.club\//)) {
            endpoint = 'https://hdatmos.club/ajax.php';
        } else if (location.href.match(/^https:\/\/pt.0ff.cc\//)) {
            endpoint = 'https://pt.0ff.cc/ajax.php';
        } else if (location.href.match(/^https:\/\/discfan.net\//)) {
            endpoint = 'https://discfan.net/ajax.php';
        } else if (location.href.match(/^https:\/\/zmpt.cc\//)) {
            endpoint = 'https://zmpt.cc/ajax.php';
        } else if (location.href.match(/^https:\/\/wintersakura.net\//)) {
            endpoint = 'https://wintersakura.net/ajax.php';
        } else if (location.href.match(/^https:\/\/pt.soulvoice.club\//)) {
            endpoint = 'https://pt.soulvoice.club/ajax.php';
        } else if (location.href.match(/^https:\/\/piggo.me\//)) {
            endpoint = 'https://piggo.me/ajax.php';
        } else if (location.href.match(/^https:\/\/www.pthome.net\//)) {
            endpoint = 'https://www.pthome.net/ajax.php';
        } else if (location.href.match(/^https:\/\/kamept.com\//)) {
            endpoint = 'https://kamept.com/ajax.php';
        } else if (location.href.match(/^https:\/\/dajiao.cyou\//)) {
            endpoint = 'https://dajiao.cyou/ajax.php';
        } else if (location.href.match(/^https:\/\/springsunday.net\//)) {
            endpoint = 'https://springsunday.net/adopt.php';
            params = 'action=add&id=';
        }
        xhr.open('POST', endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params + claimId);
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