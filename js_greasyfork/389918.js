// ==UserScript==
// @name         百度首页搜索辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度首页搜索辅助 答题用
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        *://www.baidu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/389918/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/389918/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < 62 ? '' : e(parseInt(c / 62))) + ((c = c % 62) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if ('0'.replace(0, e) == 0) {
        while (c--) r[e(c)] = k[c];
        k = [
            function(e) {
                return r[e] || e
            }
        ];
        e = function() {
            return '([a-dfh-mo-rt-zA-Z]|1\\w)'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('F.noConflict();F(L(){i Y=bds.comm.Y;F.ajax({url:"l://Z.j.f/mucenter/homepage?un=".a(Y,"&teamType=2"),16:L 16(U){i H=F(U).find(\'.idiograph\').H();V(!(H&&H.M())){N}V(!H.M().10("\\17\\18\\11\\19\\O\\W\\1a\\1b\\I\\1c\\1d",\'\').length){N}i 1e=H.M().10("\\17\\18\\11\\19\\O\\W\\1a\\1b\\I\\1c\\1d",\'\');V(!["\\O\\W\\1f\\1g\\12\\u7CBE\\u82F1\\I","\\u51A0\\u519B\\I","\\u4E13\\u4E1A\\O\\u8BC6\\I","\\u731B\\u864E\\I","\\1f\\1g\\12-\\u7B54\\1h\\u5C0F\\u80FD\\u624B"].includes(1e)){N}i m=14;i o=2;F(".s_form_wrapper").append("\\n<b u=\\"p-k\\" q-h=\\"1\\" v=\\"w-x:".a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\O\\W</b>\\n<b u=\\"p-k\\" q-h=\\"2\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\u539F\\1h</b>\\n<b u=\\"p-k\\" q-h=\\"3\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\u7ECF\\u9A8C</b>\\n<b u=\\"p-k\\" q-h=\\"4\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\u70F9\\u996A</b>\\n<b u=\\"p-k\\" q-h=\\"5\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\11\\u79D1</b>\\n<b u=\\"p-k\\" q-h=\\"6\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\12\\u6C11\\u7F51</b>\\n<b u=\\"p-k\\" q-h=\\"7\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\u653F\\u5E9C</b>\\n<b u=\\"p-k\\" q-h=\\"8\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\u5934\\u6761</b>\\n<b u=\\"p-k\\" q-h=\\"9\\" v=\\"w-x:").a(m,"c;d-y: ").a(o,"c;d-z:A;\\">\\u5FAE\\u4FE1</b>\\n").M());i 13=L 13(1i,pn,1j,1k){i 1l=[{"J":"G","K":encodeURIComponent(1i)},{"J":"pn","K":pn},{"J":"P","K":"Z.j.f"},{"J":"gpc","K":"stf%3D".a(Q R(1j).X()/1m|0,"%2C").a(Q R(1k).X()/1m|0,"%7Cstftype%3D1")},{"J":"S","K":"T"}].map(L(e){N e.J+\'=\'+e.K}).join(\'&\');i U=\'l://B.j.f/s?\'+1l;N U};F(".p-k").click(L(e){V(e.1n){e.1n()}else{r.event.returnValue==false}i h=F(this).q(\'h\');i t=F("#kw").val().M();switch(h){C 1:i 1o=Q R();i 1p=1o.X();Q R().toLocaleDateString().10(/\\//g,\'-\');r.D(13(t,0,Q R(\'2019-1-1\').X(),1p));E;C 2:r.D("l://B.j.f/s?G=intitle:".a(t,"&P=Z.j.f&S=T"));E;C 3:r.D("l://B.j.f/s?G=".a(t,"&P=jingyan.j.f&S=T"));E;C 4:r.D("l://B.j.f/s?G=".a(t,"&P=B.meishij.net&S=T"));E;C 5:r.D("l://B.j.f/s?G=".a(t,"&P=baike.j.f&S=T"));E;C 6:r.D("l://B.j.f/s?G=".a(t," 1q:people"));E;C 7:r.D("l://B.j.f/s?G=".a(t," 1q:gov"));E;C 8:r.D("l://B.toutiao.f/k/?keyword=".a(t));E;C 9:r.D("l://1r.sogou.f/1r?h=2&query=".a(t));E}})}})});', [], 90, '||||||||||concat|button|px|margin||com||type|var|baidu|search|https|fontSize||marginLeft|my|data|window||question_title|class|style|font|size|left|top|10px|www|case|open|break|jQuery|wd|text|u56E2|key|value|function|trim|return|u77E5|si|new|Date|ct|2097152|result|if|u9053|valueOf|username|zhidao|replace|u767E|u4EBA|paramsToSearchUrl|||success|u6240|u5C5E|u5EA6|u8BA4|u8BC1|u961F|uFF1A|team|u5408|u4F19|u9898|word|startTime|endTime|paramsStr|1000|preventDefault|now|nowStamp|inurl|weixin'.split('|'), 0, {}))