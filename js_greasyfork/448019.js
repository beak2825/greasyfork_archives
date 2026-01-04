// ==UserScript==
// @name       获取下载路径
// @namespace  http://www.hifini.com/
// @version    0.1
// @description  get donwload url
// @include    https://www.hifini.com/*
// @copyright  2012+, You
// @grant      unsafeWindow
// @license MIT
// @grant      GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/448019/%E8%8E%B7%E5%8F%96%E4%B8%8B%E8%BD%BD%E8%B7%AF%E5%BE%84.user.js
// @updateURL https://update.greasyfork.org/scripts/448019/%E8%8E%B7%E5%8F%96%E4%B8%8B%E8%BD%BD%E8%B7%AF%E5%BE%84.meta.js
// ==/UserScript==


GM_registerMenuCommand('获取下载地址', function () {


    var ps = document.evaluate("/html/body/main/div/div/div[1]/div[1]/div/div[2]/div[2]", document).iterateNext();
    ps = ps.querySelectorAll('span');

    var in_arr = document.evaluate("/html/body/main/div/style[1]", document).iterateNext();
    in_arr = in_arr.innerText.split('{display:inline !important;}');
    in_arr = in_arr[0];
    in_arr = in_arr.split(',');
    in_arr.forEach((item, index, in_arr) => {
        in_arr[index] = item.replace('.', '');
    });


    var psStr = '';
    ps.forEach((e) => {
        in_arr.forEach((a) => {
            if (e.getAttribute('class') == a) {
                psStr += e.innerText;
            }
        })
    })


    var link = document.querySelector('#body > div > div > div.col-lg-9.main > div.jan.card.card-thread > div > div.message.break-all')
    link = link.querySelector("[target='_blank']")

    link = link.innerText;

    var cmd = "cd /media/usdt/app/BaiduPCS; /media/usdt/app/BaiduPCS/BaiduPCS-Go transfer " + link + " " + psStr + " --download";

    // navigator.clipboard.writeText(cmd)

    console.log(cmd)


    var input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', cmd);
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log('复制成功');
        alert('复制成功')
    } else {
        alert(cmd)
    }

    document.body.removeChild(input);

}, 'r');
