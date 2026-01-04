// ==UserScript==
// @name         掌阅自动签到
// @namespace    http://m.zhangyue.com/
// @version      1.0
// @description  省掉在手机上点击步骤
// @author       Lennon
// @match        *://*/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @run-at       document-end
// @icon         http://zhangyue.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/382474/%E6%8E%8C%E9%98%85%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/382474/%E6%8E%8C%E9%98%85%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

// put your user id here
var usr = 'i1401647982';

eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return c.toString(36);
    };
    if ('0'.replace(0, e) === 0) {
        while (c--)r[e(c)] = k[c];
        k = [function (e) {
            return r[e] || e;
        }];
        e = function () {
            return '[4-79c-r]';
        };
        c = 1;
    }
    while (c--)if (k[c])p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p;
}('7 getRebuildUrl(h,c){4 6=k(c);h=h+\'&_s_3d=\'+c+\'&_s_3c=\'+6;9 h}7 k(c){4 d=c.split(\'|\');4 a=d[0];4 b=d[1];4 e=d[2];4 f=d[3];4 l=m(b,a);4 n=o(f,a);4 p=q(e,a);4 6=l+\'zY.\'+n+p;6=6.i(g(6,a),8);9 6}7 m(b,a){4 5=g(b,a);9 b.i(5,3)}7 o(f,a){4 5=g(f,a);9 f.i(5,3)}7 q(e,a){4 5=g(e,a);9 e.i(5,3)}7 g(r,a){4 j=r.j;4 5=a%j;5=5<j/2?5:-5;9 5}', [], 28, '||||var|start|hashCode|function||return|||seed|data|name|time|getStartIndex|url|substr|length|getHashCode|param1|getPart1|param2|getPart2|param3|getPart3|str'.split('|'), 0, {}));

// 生成一个种子
function getSeed(usr) {
    var seed = '';
    $.ajax({
        url: "https://ah2.zhangyue.com/zyam/app/app.php?ca=Sign.Seed&pca=Sign.Index&usr=" + usr,
        async: false,
        dataType: 'json',
        type: 'GET',
        timeout: 10000,
        success: function (res) {
            seed = res.data.seed;
        }
    });

    return seed;
}

// get一个种子
function getCard(usr) {
    //获取种子
    var seed = getSeed(usr);

    // 定义ajax请求的url
    var url = getRebuildUrl("https://ah2.zhangyue.com/zyam/app/app.php?ca=Sign.Card&pca=Sign.Index&usr=" + usr + "&from=1&type=0", seed);

    // 签到
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        timeout: 10000,
        success: function () {
            $.ajax({
                url: "https://ah2.zhangyue.com/zyam/app/app.php?ca=Sign.Turn&pca=Sign.Index&usr=" + usr,
                async: false,
                dataType: 'json',
                type: 'GET',
                timeout: 10000,
                success: function (res) {
                    console.log(usr + ': ' + res.msg);
                }
            });
        }
    });
}

setTimeout(function(){
    getCard(usr);
}, 2000);
