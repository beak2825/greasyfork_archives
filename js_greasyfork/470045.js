// ==UserScript==
// @name            一键认领
// @name:en         torrents claim
// @namespace       claim
// @version         0.0.29
// @description     一键认领种子
// @description:en  one key claim all the seeding torrents
// @author          Exception
// @match           *://hdtime.org/userdetails.php?id=*
// @match           *://hdvideo.one/userdetails.php?id=*
// @match           *://carpt.net/userdetails.php?id=*
// @match           *://1ptba.com/userdetails.php?id=*
// @match           *://hdatmos.club/userdetails.php?id=*
// @match           *://ptchina.org/userdetails.php?id=*
// @match           *://zmpt.cc//userdetails.php?id=*
// @match           *://hdmayi.com/userdetails.php?id=*
// @match           *://wintersakura.net/userdetails.php?id=*
// @match           *://pt.0ff.cc/userdetails.php?id=*
// @match           *://leaves.red/userdetails.php?id=*
// @match           *://wwww.leaves.red/userdetails.php?id=*
// @match           *://cyanbug.net/userdetails.php?id=*
// @match           *://pt.soulvoice.club/userdetails.php?id=*
// @match           *://piggo.me/userdetails.php?id=*
// @match           *://dajiao.cyou/userdetails.php?id=*
// @match           *://zmpt.cc/userdetails.php?id=*
// @match           *://hdfans.org/userdetails.php?id=*
// @match           *://discfan.net/userdetails.php?id=*
// @match           *://pandapt.net/userdetails.php?id=*
// @match           *://www.okpt.net/userdetails.php?id=*
// @match           *://ptvicomo.net/userdetails.php?id=*
// @match           *://*.agsvpt.com/userdetails.php?id=*
// @match           *://ubits.club/userdetails.php?id=*
// @match           *://share.ilolicon.com/userdetails.php?id=*
// @match           *://www.hdkyl.in/userdetails.php?id=*
// @match           *://www.icc2022.com/userdetails.php?id=*
// @match           *://kufei.org/userdetails.php?id=*
// @match           *://ptcafe.club/userdetails.php?id=*
// @match           *://public.ecustpt.eu.org/userdetails.php?id=*
// @match           *://new.qingwa.pro/userdetails.php?id=*
// @match           *://www.qingwapt.com/userdetails.php?id=*
// @match           *://crabpt.vip/userdetails.php?id=*
// @match           *://t.tosky.club/userdetails.php?id=*
// @match           *://hdpt.xyz/userdetails.php?id=*
// @match           *://raingfh.top/userdetails.php?id=*
// @match           *://ptlgs.org/userdetails.php?id=*



// @license         MIT
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/470045/%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/470045/%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

/**
 * 改自大青虫一键认领, 原网址: https://greasyfork.org/zh-CN/scripts/434757-烧包一键认领
 */

(function () {
    'use strict';
    var host = window.location.host;
    var href = window.location.href;
    console.log("host:" + host)
    console.log("href:" + href)
    // Your code here...
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e) => { console.log(e); });
    }

    window.onload = function () {
        var rows = document.querySelectorAll("tr");//tr表行元素，获取所有表行
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].childElementCount == 2 && rows[i].cells[0].innerText == "当前做种") {//如果该表行只有两个子元素且第一个子元素的内部文本为“当前做种”
                var idClaim = document.getElementById("claimAllTorrents");//获取所有ID为的claimAllTorrents的元素
                if (idClaim == null) {//如果为空，则创建一键认领按钮
                    const dom = document.createElement('div')
                    dom.innerHTML = '<a id="claimAllTorrents" href="javascript:void(0);" onclick="window.manualClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键认领</a>';
                    rows[i].cells[1].prepend(dom)
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

        var msg = "确定要认领全部种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负! \n点击后请等待至弹窗, 种子越多越要等捏(每个种子访问间隔500ms)";
        if (confirm(msg) == true) {//提示选择确认
            for (var i = 0; i < list.length; i++) {
                var maxClaim = 10000;
                var result = await unsafeWindow.ClassificationClaimTorrents(list, maxClaim);
                var total = result.total;
                var success = result.success;
                alert(`共计${total}个种子，本次成功认领${success}个。`);
                var idClaim = document.getElementById("claimAllTorrents");
                //翻页以后可以继续使用一键认领
                //idClaim.parentNode.removeChild(idClaim);
            }
        }
    }

    unsafeWindow.ClassificationClaimTorrents = async function (element, maxClaim) {
        var total = 0, success = 0;

        for (const el of element) {
            if (success >= maxClaim) {
                alert("最多只能认领10000个种子！");
                break;
            }

            total += 1

            const claimId = el.dataset.torrent_id
            if (claimId > 0) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://'+host+'/ajax.php', true);
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
})();