// ==UserScript==
// @name            一键取消认领种子
// @name:en         torrents declaim
// @namespace       https://hanyuan6.cn
// @version         1.0
// @description     一键取消所有已经认领的种子，在下载器中大量删除种子后可以使用
// @description:en  one key declaim all the seeding torrents
// @author          Hanyuan Liu
// @match           *://*/claim.php?uid=*
// @license         MIT
// @icon            https://github.com/lhy2871/lhy2871.github.io/blob/master/Hanyuan_square2.png
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/519532/%E4%B8%80%E9%94%AE%E5%8F%96%E6%B6%88%E8%AE%A4%E9%A2%86%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/519532/%E4%B8%80%E9%94%AE%E5%8F%96%E6%B6%88%E8%AE%A4%E9%A2%86%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

/**
 * 改自Nexusphp PT种子一键认领, 原网址: https://greasyfork.org/zh-CN/scripts/434757-烧包一键认领
 * 项目地址: https://github.com/lhy2871/AutoDeclaimPTTorrents
 * 如有修改意见,欢迎提交PR
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

    //创建一键取消认领按钮
    window.onload = function () {
        var rows = document.querySelectorAll("tr");//tr表行元素，获取所有表行
        for (var i = 0; i < rows.length; i++) {
            //if (rows[i].childElementCount == 2 && rows[i].cells[0].innerText == "用户认领种子详情") {//如果该表行只有两个子元素且第一个子元素的内部文本为“用户认领种子详情”
            if (rows[i].cells[0].textContent == "ID") {//如果该表第6个子元素的内部文本为“认领时间”
                if (rows[i].cells[5].textContent == "认领时间") {//如果该表第6个子元素的内部文本为“认领时间”
                    var idDeclaim = document.getElementById("deClaimAllTorrents");//获取所有ID为的deClaimAllTorrents的元素
                    if (idDeclaim == null) {//如果为空，则创建一键认领按钮
                        const dom = document.createElement('div')
                        dom.innerHTML = '<a id="deClaimAllTorrents" href="javascript:void(0);" onclick="window.manualDeclaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="取消认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键取消认领</a>';
                        rows[i].cells[0].prepend(dom)
                        break;
                    }
                }
            }
        }
    }

    //搜索需要取消认领的种子个数
    unsafeWindow.manualDeclaimTorrents = async function () {
        const _raw_list = Array.from(document.querySelectorAll("button[data-action='removeClaim']"));
        const list = _raw_list.filter(el => el.style.display != 'none');//获取所有取消认领的按钮元素
        if (list.length == 0) {
            alert('未检测到已认领种子或已经全部取消认领\n请打开认领列表, 若列表没有种子您无法认领!\n若您已经全部取消认领请无视!')
            return
        }

        var msg = "确定要取消认领全部本月未做种的种子吗？\n\n严正警告: \n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负！\n请勿短时间内多次点击, 否则后果自负! \n点击后请等待至弹窗, 种子越多越要等捏(每个种子访问间隔500ms)";
        if (confirm(msg) == true) {//提示确认继续操作
            var maxClaim = 500;
            var result = await unsafeWindow.ClassificationDeclaimTorrents(list, maxClaim);
            var total = result.total;
            var success = result.success;
            alert(`共计${total}个种子，本次成功取消认领${success}个。（高延迟情况下计数不准，建议刷新看看）`);
            var idDeclaim = document.getElementById("deClaimAllTorrents");
            //翻页以后可以继续使用一键取消认领
            //idDeclaim.parentNode.removeChild(idDeclaim);
        }
    }

    unsafeWindow.ClassificationDeclaimTorrents = async function (element, maxClaim) {
        var total = 0, success = 0;

        for (const el of element) {
            if (success >= maxClaim) {
                alert("最多只能认领500个种子！");
                break;
            }
            total += 1
            //发送取消认领信息
            const deClaimId = el.dataset.claim_id
            if (deClaimId > 0) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://'+host+'/ajax.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                xhr.setRequestHeader("x-requested-with","XMLHttpRequest")
                xhr.setRequestHeader("setaccept","application/json, text/javascript, */*; q=0.01")
                xhr.send('action=removeClaim&params%5Bid%5D=' + deClaimId);
            }
            //接受网站回复
            xhr.onload = function () {
                if (xhr.status == 200) {
                    // response 就是你要的东西
                    var response = xhr.responseText
                    el.style.background = 'lime';
                    el.innerText = '已取消';
                    // console.log(response)

                    success += 1;
                }
            }
            //等待500ms
            await sleep(500);
        }
        return {
            total: total,
            success: success
        }
    }
})();