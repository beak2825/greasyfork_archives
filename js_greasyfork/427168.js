// ==UserScript==
// @name         vipc
// @namespace    *
// @version      1.2
// @description  在线解析腾讯 芒果 优酷 爱奇艺 的vip视频
// @author       be1xc
// @include    *://v.qq.com/x/*
// @include    *://www.iqiyi.com/v*
// @include    *://v.youku.com/v*
// @include    *//www.mgtv.com/b*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427168/vipc.user.js
// @updateURL https://update.greasyfork.org/scripts/427168/vipc.meta.js
// ==/UserScript==
(function () {
    let vip_list = [
        'https://www.8090.la/api/?url=',// 8090
        'https://www.nxflv.com/?url=',// 思诺
        'http://pangujx.cc/?url=', // 盘古
        'http://sgjxc.vip/?url=', // 思古
        'http://h8jx.vip/?url=', // H8
        'https://www.nxflv.com/?url=', //  诺讯解析
        'https://jx.618g.com/?url=', // 618G解析
        'http://jqaaa.com/jx.php?url=', // 金桥解析
        'https://660e.com/?url=', // 乐乐云
        'http://www.82190555.com/index.php?url=', // 无名小站
        'http://jx.sujx.top/jiexi.php/?url=', // V8智能解析
        'https://jx.ergan.top/?url=', // 云解析
        'https://www.xymav.com/?url=', // 小野马解析
        'https://jx.jiubojx.com/vip.php?url=', // 明日解析
        'https://jx.ppflv.com/?url=', // 小狼云
    ]
    let vip_name = ['8090', '思诺', '盘古', '思古', 'H8', '诺讯解析', '618G解析', '金桥解析', '乐乐云', '无名小站', 'V8智能解析', '云解析', '小野马解析', '明日解析', '小狼云']

    var style = document.createElement('style');
    style.innerHTML =
        '.vipc {' +
        'position: fixed;' +
        'float: left;' +
        'z-index: 999;' +
        'left: 0;' +
        'font-size: 16px;' +
        'color: purple;' +
        'color: red;' +
        'cursor:pointer;' +
        'background:none' +
        '}'
    var ref = document.querySelector('script');
    ref.parentNode.insertBefore(style, ref);

    var style_2 = document.createElement('style');
    style_2.innerHTML =
        '.vipc:hover {' +
        'background: beige;' +
        'transition:background .2s' +
        '}'
    ref.parentNode.insertBefore(style_2, ref);

    let html_dom = document.getElementsByTagName('body')[0]

    function dom_style(num, vip, name) {
        let dom = document.createElement('div');
        dom.setAttribute('id', 'vipc' + num);
        dom.setAttribute('class', 'vipc');
        dom.innerHTML = name
        dom.style.top = 30 + 2 * (num - 1) + '%'
        dom.onclick = function () {
            window.open(vip + window.location.href)
        }
        html_dom.appendChild(dom)
    }

    for (let i = 0; i < vip_list.length; i++) {
        dom_style(i + 1, vip_list[i], vip_name[i])
    }

})();