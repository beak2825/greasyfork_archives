// ==UserScript==
// @name            OpenCD 一键感谢
// @name:en         OpenCD 三克油
// @version         0.0.1
// @description    OpenCD 一键感谢，,禁止在invites.fun转载，其他随意。
// @description:en  one key thanks all the finished torrents,禁止在invites.fun转载，其他随意。
// @author          avatasia
// @match           https://open.cd/userdetails.php?id=*
// @license         MIT
// @grant           unsafeWindow
// @namespace https://greasyfork.org/users/920757
// @downloadURL https://update.greasyfork.org/scripts/487814/OpenCD%20%E4%B8%80%E9%94%AE%E6%84%9F%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/487814/OpenCD%20%E4%B8%80%E9%94%AE%E6%84%9F%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function wait(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e) => {
            console.log(e);
        });
    }

   window.onload = function () {
        if (!jQuery) {
            alert('站点无法使用该脚本')
        }


            let aTag = '<a id="thankAllTorrents" href="javascript:void(0);" onclick="window.manualThankTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="一键感谢（运行后无法停止，强制停止可关闭页面，进度看console日志）">一键感谢</a><br>'
            jQuery('#ka3').parent().prepend(aTag)

    }

    unsafeWindow.manualThankTorrents = async function () {
        var msg = "确定要感谢全部种子吗？\n种子越多越要等捏(每个种子访问间隔5000ms)\n停止脚本刷新当前页面即可。";
        if (!confirm(msg)) return;
        jQuery('#thankAllTorrents').css("pointer-events",'none');
        jQuery('#ka3').parent().find('a')[1].click()
        
        await wait(3000)
            let buttonArr = new Array(...(jQuery('#ka3 a[href^="details.php?id="]').length ? jQuery('#ka3 a[href^="details.php?id="]').toArray() : []));
            if (!buttonArr || !buttonArr.length) {
                alert('未检测到可以感谢的种子\n请打开当前完成种子列表, 若列表没有种子您无法认领!\n若您已经全部认领请无视!');
                return
            }
            let total = 0, success = 0;
            for (let el of buttonArr) {
                total++;
                // 获取href属性的值
                const hrefValue = jQuery(el).attr('href');
                console.log(hrefValue);
                // 提取id参数的值
                const id = hrefValue.split('=')[1];
               let param = { "id": id}
            new Promise((resolve) => {
                jQuery.post("thanks.php", param, function (response) {
                        success++
                }, "json")
            })
                // 提取id参数的值
                //const id = hrefValue.split('=')[1];
                console.log(`正在认领第${total}/${jQuery('#ka1 a[href^="details.php?id="]').length}个，成功认领${success}个`);
                await wait(5000);
            }

            alert(`共计可感谢${total}个种子，本次成功感谢${success}个。`);
            jQuery('#thankAllTorrents').css("pointer-events",'');
            return;
        }
    // Your code here...
})();