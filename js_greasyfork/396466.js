// ==UserScript==
// @name         淘宝电脑无线互转
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  淘宝电脑无线互转更方便
// @author       crazyqf
// @match      http*://product.suning.com/*
// @match      http*://m.suning.com/product/*
// @match      http*://item.taobao.com/*
// @match      http*://h5.m.taobao.com/*
// @match      http*://detail.m.tmall.com/*
// @match      http*://detail.tmall.com/*
// @match      http*://item.jd.com/*
// @match      http*://item.m.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396466/%E6%B7%98%E5%AE%9D%E7%94%B5%E8%84%91%E6%97%A0%E7%BA%BF%E4%BA%92%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/396466/%E6%B7%98%E5%AE%9D%E7%94%B5%E8%84%91%E6%97%A0%E7%BA%BF%E4%BA%92%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tony='';
    var tonyhost=window.location.host;
    var tonypath=window.location.pathname;
    var reg;
    var r;
    var elemDiv = document.createElement('div');
    var first=document.body.firstChild;
    elemDiv.style.cssText = 'position:fixed;display:block;z-index:999999;left:93%;top:50%;';
    elemDiv.innerHTML = '<img src="http://m.qpic.cn/psc?/V11U9dGZ0Ee4an/ZJMW0P.lz3M14c3xRpp*DiBrbV3vA83IT2*u0nuuRQ1tQMvhZSAtfwKLdofTUIRvPLUk38QEmVluEchP5uMaDg!!/b&bo=GAFoAAAAAAARB0E!&rf=viewer_4" width="110" height="40" alt="adfasdf" style="cursor:pointer" id="letTonyChange"/>';
    document.body.insertBefore(elemDiv,first);
    if(tonyhost == "m.suning.com"){tony="https://product.suning.com"+tonypath.replace('/product','');}
    else if(tonyhost == "product.suning.com"){tony="https://m.suning.com/product"+tonypath;}
    else if(tonyhost == "h5.m.taobao.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://item.taobao.com/item.htm?id="+unescape(r[2]);}else{tony='';}}
    else if(tonyhost == "detail.m.tmall.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://detail.tmall.com/item.htm?id="+unescape(r[2]);}else{tony='';}}
    else if(tonyhost=="item.taobao.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://h5.m.taobao.com/awp/core/detail.htm?id="+unescape(r[2]);}else{tony='';}}
    else if(tonyhost=="detail.tmall.com"){reg = new RegExp("(^|&)id=([^&]*)(&|$)", "i");r = window.location.search.substr(1).match(reg);if (r != null){tony="https://detail.m.tmall.com/item.htm?id="+unescape(r[2]);}else{tony='';}}
    else if(tonyhost=="item.jd.com"){tony="https://item.m.jd.com/product"+tonypath+'?cu=true&utm_source=media.jd.com&utm_medium=tuiguang&utm_campaign=t_2008911829_&utm_term=af07bf9e89304c3c987eea6975acc003';}
    else if(tonyhost=="item.m.jd.com"){tony="https://item.jd.com"+tonypath.replace('/product','')+'?cu=true&utm_source=media.jd.com&utm_medium=tuiguang&utm_campaign=t_2008911829_&utm_term=af07bf9e89304c3c987eea6975acc003';}
    document.getElementById("letTonyChange").onclick=function(){location.href=tony;};
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?7f9964d6e2815216bcb376aa3325f971";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
    // Your code here...
})();