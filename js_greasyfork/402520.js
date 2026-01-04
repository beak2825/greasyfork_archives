// ==UserScript==
// @name         Bilibili Ban Conventer
// @namespace    https://github.com/tylzh97
// @version      0.2
// @description  Bilibili BV号转AV号工具
// @author       Birkhoff
// @match        *.bilibili.com/video/BV*
// @require      http://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402520/Bilibili%20Ban%20Conventer.user.js
// @updateURL https://update.greasyfork.org/scripts/402520/Bilibili%20Ban%20Conventer.meta.js
// ==/UserScript==

// 网络状况较好时，可以将次数值调低；网络较差时将此数字调高
// 网页加载完成多少秒后，将av号渲染到页面中
// 由于Bilibili前端使用Vue框架，修改页面模板后可能会导致页面渲染失败，因此要在Vue渲染完毕后脚本才能渲染
const delayTime = 3.5

// 点击复制内容函数
function copy(str) {
    let transfer = document.createElement('input');
    transfer.id = 'copy-temp-input'
    let v_r = $("#viewbox_report")
    v_r.append(transfer)
    transfer.value = str;
    transfer.focus();
    transfer.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    transfer.blur();
    $('#copy-temp-input').remove()
}

(function() {
    'use strict';
    console.log("This is bilibili Tampermonkey Script.")
    // 当DOM渲染完成时
    $(document).ready(_ => {
        console.log("Page Loading!")
        const patt = /video\/(bv.+)/i
        const url = window.location.href
        const bv = patt.exec(url)[1]
        console.log(bv)
        // 转码参考 https://www.zhihu.com/question/381784377/answer/1099438784
        const magicStr = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
        let table = {};
        for (let i = 0; i < magicStr.length; i++) table[magicStr[i]] = BigInt(i);
        let s = [11, 10, 3, 8, 4, 6, 2, 9, 5, 7];
        const XOR = 177451812n, ADD = 100618342136696320n;
        // bv转av解码
        function decode(src) {
            let r = 0n;
            for (let i = 0; i < 10; i++) {
                r += table[src[s[i]]] * (58n ** BigInt(i));
            }
            return (r - ADD) ^ XOR;
        }
        // 获取bigint类型av号
        const av = decode(bv);
        const str_av = 'av' + av
        console.log(av)
        console.log(str_av)
        // 在视频信息中添加av号标签
        let avinfo = '<div class="video-data">'
        avinfo += '<span style="cursor: pointer" class="a-crumbs" id="av-copy">' + str_av + '</span>'
        avinfo += '<span style="cursor: pointer" id="url-copy">https://www.bilibili.com/video/' + str_av + '</span>'
        avinfo += '</div>'
        let v_r = $("#viewbox_report")
        // 由于bilibili前端使用了VUE框架，在VUE渲染完毕前修改HTML模板会造成VUE渲染失败，因此此处定时3秒再将av号信息渲染到页面中
        setTimeout(_ => {
            v_r.append(avinfo)
            $('#av-copy').click(function() {
                copy(str_av.toString())
            })
            $('#url-copy').click(function() {
                copy('https://www.bilibili.com/video/' + str_av)
            })
        }, delayTime * 1000)
    })
})();