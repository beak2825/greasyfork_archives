// ==UserScript==
// @name         百度网盘金钥匙
// @namespace    404 not found
// @icon         https://ae01.alicdn.com/kf/Uc77376caf9ed479a913042743fe2330aP.png
// @version      0.2
// @description  自动获取百度网盘提取码（99%的破解率）并自动填写
// @author       满天星
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @match        *://pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395880/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%87%91%E9%92%A5%E5%8C%99.user.js
// @updateURL https://update.greasyfork.org/scripts/395880/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%87%91%E9%92%A5%E5%8C%99.meta.js
// ==/UserScript==

(function(){
    'use strict';
    eval(function (p, a, c, k, e, d) {
        e = function (c) {
            return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
        };
        if (!''.replace(/^/, String)) {
            while (c--) d[e(c)] = k[c] || e(c);
            k = [function (e) {
                return d[e]
            }];
            e = function () {
                return '\\w+'
            };
            c = 1;
        };
        while (c--)
            if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
        return p;
    }('h 5(){3 c=6.7(".8-2 .9 a.g-o");c.5()}$.n({m:"l",f:"q://p.j.i/?f="+k.r.x,y:h(4){z(4!="A"){3 d=6.7(".8-2 .9 2");3 e=4.b(\'w：\')[1].b(\'</t>\')[0];d.s=e;v(5(),u)}},});', 37, 37, '||input|var|data|click|document|querySelector|verify|pickpw||split|codebtn|codebox|code|url||function|cn|xzzxz|window|GET|type|ajax|button|pan|https|location|value|body|1000|setTimeout|提取码|href|success|if|error'.split('|'), 0, {}))
})();