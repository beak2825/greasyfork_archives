// ==UserScript==
// @name         乌云网漏洞及知识库链接转换器
// @namespace    http://think3t.iteye.com/
// @version      0.3
// @description  将原乌云网漏洞及知识库链接转换为指定的镜像站链接，实现无缝浏览！
// @author       hktk_hrl
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22897/%E4%B9%8C%E4%BA%91%E7%BD%91%E6%BC%8F%E6%B4%9E%E5%8F%8A%E7%9F%A5%E8%AF%86%E5%BA%93%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/22897/%E4%B9%8C%E4%BA%91%E7%BD%91%E6%BC%8F%E6%B4%9E%E5%8F%8A%E7%9F%A5%E8%AF%86%E5%BA%93%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

var mirrorHostName = 'http://wooyun.jozxing.cc';       //乌云镜像站地址，可改为自己可用的地址
var mirrorUrlPrefix = mirrorHostName + '/static';      //乌云镜像站URL前缀，默认为http://mirrorHostName/static
var bugsReg = /http:\/\/www\.wooyun\.org(\/bugs\/wooyun-\d+-\d+)/;    //乌云漏洞页面URL匹配规则
var dropsReg = /http:\/\/drops\.wooyun\.org\/(.+)\/(\d+)/;            //乌云知识库页面URL匹配规则

var allLinks = document.getElementsByTagName('a');

for (var i = 0; i < allLinks.length; i++) {
    var a = allLinks[i];
    var oldUrl = a.href;
    var arr, newUrl;
    //漏洞页面规则：http://www.wooyun.org/bugs/wooyun-2012-011833 --> http://wooyun.jozxing.cc/static/bugs/wooyun-2012-011833.html
    if (bugsReg.test(oldUrl)) {
        arr = bugsReg.exec(oldUrl);
        newUrl = mirrorUrlPrefix + arr[1] + '.html';
        a.href = newUrl;
    }
    //知识库页面规则：http://drops.wooyun.org/category/12345 --> http://wooyun.jozxing.cc/static/drops/category-12345.html
    else if (dropsReg.test(oldUrl)) {
        arr = dropsReg.exec(oldUrl);
        newUrl = mirrorUrlPrefix + '/drops/' + arr[1] + '-' + arr[2] + '.html';
        a.href = newUrl;
    }
}