// ==UserScript==
// @name         U2批量下载种子文件
// @namespace    http://github.com/Zhuoy3
// @version      0.1.0
// @description  为U2（u2.dmhy.org/）增加批量下载的功能
// @author       Zhuoy3
// @match        *://u2.dmhy.org/torrent*
// @grant        none
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/444614/U2%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444614/U2%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

function u2_download_all() {
    let mc = prompt('请输入获取范围 (不填或 0 为无限)', '1-10');
    let d = $('.download').parent();
    let start = 1;
    let end = d.length;
    if (isNaN(mc)) {
        var mcs = mc.split('-');
        if (mcs.length > 1 && !isNaN(mcs[0]) && !isNaN(mcs[1])) {
            start = parseInt(mcs[0]);
            end = parseInt(mcs[1])
        }
    } else {
        mc = parseInt(mc);
        if (mc > 0) {
            start = 1;
            end = mc
        } else if (mc < 0) {
            start = d.length + mc + 1;
            end = d.length
        }
    }
    // let passkey = prompt('请输入 passkey');
    // if (!passkey) {
    //     // console.log('请注意: 没有输入 passkey 可能会导致种子文件无法下载')
    //     window.alert('请注意: 没有输入 passkey 可能会导致种子文件无法下载')
    // }
    // let t = '';
    let i = 0;
    d.each(
        function () {
            i++;
            if (i > end || i < start) {
                return
            }
            // t += this.href + '&passkey=' + passkey + '&https=1\n'
            var elemIF = document.createElement("iframe");
            // elemIF.src = this.href + '&passkey=' + passkey + '&https=1';
            elemIF.src = this.href + '&https=1';
            elemIF.style.display = "none";
            document.body.appendChild(elemIF)
        }
    );
    i = 0;
    let size = 0;
    let num = 0;
    $('.torrents tr td.rowfollow:nth-child(5n)').each(
        function () {
            i++;
            if (i > end || i < start) {
                return
            }
            let s = this.innerText.split('\n');
            let m = 1;
            switch (s[1].substr(0, 1)) {
                case 'T':
                    m = 1024;
                    break;
                case 'M':
                    m /= 1024;
                    break;
                case 'K':
                    m /= 1048576
            }
            num++;
            size += s[0] * m
        }
    );
    //console.log(t);
    // console.log('共有 ' + num + ' 个种子, 大小: ' + size + ' GiB')
    window.alert('共有 ' + num + ' 个种子, 大小: ' + size.toFixed(2) + ' GiB')
}

$('.searchbox tbody:nth-child(3n) td.rowfollow:nth-child(2n)').append('<input id="download_all" type="button" class="btn" name="download_all" value="批量下载">')
document.getElementsByName("download_all")[0].addEventListener('click', function () {
    u2_download_all()
});
