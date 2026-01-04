// ==UserScript==
// @name         [BFD]Block Fake Download
// @name:zh      伪下载屏蔽助手
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  屏蔽遇到过的资源网站伪下载区域, 不定期更新
// @author       Zszen John
// @include     *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406940/%5BBFD%5DBlock%20Fake%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/406940/%5BBFD%5DBlock%20Fake%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var label = 'Zszen '
    var url = window.location.href;
    var res = /\/\/.+?\.(.*?)\//.exec(url);
    if(res==null || res.length<2){
        return
    }
    var site = res[1];
    ELs('a', el=>el.href.indexOf('.exe')>=0 || el.textContent.indexOf('速下载')>=0 , el=>txtDel(el));//el=>el.style.textDecoration="line-through" //el=>el.style.display = 'none'
    ELs('span', el=>el.textContent.indexOf('速下载')>=0 , el=>txtDel(el.parentElement));//el=>el.parentElement.style.display = 'none'
    var isDeal = true;
    var els;
    var dic = {
        '3xiazai.com':null,
        'winwin7.com':null,
        'uzzf.com':null,
        'pc6.com':null,
        '9ht.com':null,
        'onlinedown.net':null,
        'qqtn.com':null,
        'pcsoft.com.cn':null,
        'pconline.com.cn':null,
        'yxdown.com':null,
        'jisuxz.com':null,
        'yesky.com':null,
        'cncrk.com':null,
        'liangchan.net':null,
        'aixuefu.com':null,
        'xz7.com':null,
        'zdfans.com':null,
        'newyx.net':null,
        'yunqishi.net':null,
        'veryhuo.com':null,
        'zuiben.com':null,
        'mydown.com':null,
        'cr173.com':null,
        'downcc.com':null,
        'newasp.net':null,
        '3h3.com':null,
        'xue51.com':null,
        'jb51.net':null,
        'kxdw.com':null,
        '7down.com':null,
        '32r.com':null,
        'jyrd.com':null,
        'downza.cn':null,
        'zol.com.cn':null,
        'ali213.net':null,
        'anyxz.com':()=>{
            ELs('p',el=>el.className=='fontcolor2',el=>ELs('div',null,el2=>txtDel(el2),el));
        },
        'xpgod.com':()=>{
            ELs('ul',el=>el.className=='clearfix show_xzq',el=>txtDel(el));
        },
        'xp510.com':()=>{
            ELs('ul',el=>el.className='clearfix bendi',el=>txtDel(el));
        },
        'baidu.com':()=>{
            // console.log(label, site);
            function delay_deal(){
               var arr = ELs('a',
                             el=>{for(var k in dic){if(el.href.indexOf(k)>=0 && k!='baidu.com' && k!='bing.com')return true;}return false},
                            el=>txtDel(el)
               )
               console.log(arr);
            }
            delay_deal();
            setTimeout(delay_deal, 1000);
        },
    }
    dic['bing.com'] = dic['baidu.com'];
    if(dic[site]!=null){
        dic[site]();
        ELs('iframe',null,el=>el.style.textDecoration="line-through");
    }else{

    }

    function ELs(tagName, conditionFun, dealFun, parent){
        if(parent==null) parent = document;
        var tags = [...parent.getElementsByTagName(tagName)];
        if(conditionFun){
            tags = tags.filter(conditionFun);
        }
        if(dealFun){
            tags.forEach(dealFun);
        }
        return tags;
    }

    function txtDel(el){
        el.style.textDecoration="line-through";
        el.style["font-weight"]="bolder";
        el.style.color='red';
    }
})();