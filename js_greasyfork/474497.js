// ==UserScript==
// @name            NexusPHP PT 一键认领
// @name:en         NexusPHP PT torrents claim
// @version         0.0.2
// @description     一键认领
// @description:en  one key claim all the seeding torrents in NexusPHP PT.
// @author          mintiang
// @match           https://*/userdetails.php?id=*
// @license         MIT
// @grant           unsafeWindow
// @namespace https://greasyfork.org/users/920757
// @downloadURL https://update.greasyfork.org/scripts/474497/NexusPHP%20PT%20%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/474497/NexusPHP%20PT%20%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

/**
 * 改自HDTIME一键认领, 原网址: https://greasyfork.org/scripts/469883
 */

(function () {
    'use strict';

    // Your code here...
    function wait(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e) => {
            console.log(e);
        });
    }

    window.onload = function () {
        if (!jQuery || !layer) {
            alert('站点无法使用该脚本')
        }
        let url = new URL(window.location.href);
        let params = url.searchParams;
        if (jQuery("a[href='claim.php?uid=" + params.get("id") + "']").length) {
            let aTag = '<a id="claimAllTorrents" href="javascript:void(0);" onclick="window.manualClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键认领</a><br>'
            jQuery('#ka1').parent().prepend(aTag)
        }
    }

    unsafeWindow.manualClaimTorrents = async function () {
        var msg = "确定要认领全部种子吗？\n种子越多越要等捏(每个种子访问间隔5000ms)\n停止脚本刷新当前页面即可。";
        if (!confirm(msg)) return;
        jQuery('#claimAllTorrents').css("pointer-events",'none');
        jQuery('#ka1').parent().find('a')[1].click()
        layer.msg('脚本开始执行', {
            icon: 6,
            time: 4000
        })
        await wait(3000)
        let buttonArr = new Array(...(jQuery('#ka1').find('[data-action="addClaim"]').length ? jQuery('#ka1').find('[data-action="addClaim"]') : []))
        buttonArr = buttonArr.filter(x => jQuery(x).css('display') !== 'none')
        if (!buttonArr || !buttonArr.length) {
            alert('未检测到可以认领的种子\n请打开当前做种列表, 若列表没有种子您无法认领!\n若您已经全部认领请无视!')
            return
        }
        let total = 0, success = 0;
        for (let el of buttonArr) {
            total++
            let torrentId = jQuery(el).attr("data-torrent_id")
            let action = jQuery(el).attr("data-action")
            let param = {
                "action": action,
                "params": {
                    torrent_id: torrentId
                }
            }
            new Promise((resolve) => {
                jQuery.post("ajax.php", param, function (response) {
                    if (response.ret == 0) {
                        success++
                    }
                }, "json")
            })
            layer.msg(`正在认领第${total}/${buttonArr.length}个，成功认领${success}个`, {
                icon: 6,
                time: 4000
            })
            await wait(5000)
        }
        alert(`共计可认领${total}个种子，本次成功认领${success}个。`);
        jQuery('#claimAllTorrents').css("pointer-events",'');
    }
})();
