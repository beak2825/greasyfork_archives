// ==UserScript==
// @name         Fuck FuckAdblock(t66y.com)
// @namespace    https://greasyfork.org/zh-CN/scripts/377038
// @version      0.4
// @description  try to take over the world!
// @author       Potatso
// @match        http://t66y.com/*
// match 是设置该脚本适用的网站
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377038/Fuck%20FuckAdblock%28t66ycom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377038/Fuck%20FuckAdblock%28t66ycom%29.meta.js
// ==/UserScript==



(function() {
    readS= null;
    r1eadS= null;
    re1adS= null;
    rea1dS= null;
    read1S= null;
    readS1= null;
    r2eadS= null;
    re2adS= null;
    rea2dS= null;
    read2S= null;
    readS2= null;
    r3eadS= null;
    re3adS= null;
    rea3dS= null;
    read3S= null;
    readS3= null;
    r4eadS= null;
    re4adS= null;
    rea4dS= null;
    read4S= null;
    readS4= null;
})();

var picUrl1 = 'http://img599.net/';
var picUrl3 = 'https://img599.net/';
var picUrl2 = 'http://kccdk.com/files/';
var regUrl1 = /http:\/\/img599\.net\/(.*?)\.th\.jpg/;
var regUrl3 = /https:\/\/img599\.net\/(.*?)\.th\.jpg/;
var regUrl2 = /http:\/\/kccdk\.com\/files\/(.*?)thumbs\/(.*?)\.md\.jpg/;
var pic
var allimgs = document.getElementsByTagName("img");
for (var i = 0;i < allimgs.length;i++){
    var a = allimgs[i];
    var oldUrl = a.src;
    var arr,newUrl;
    if(regUrl1.test(oldUrl)){
        arr = regUrl1.exec(oldUrl);
        newUrl = picUrl1 + arr[1] + '.jpg';
        a.src = newUrl;
    }
    else if(regUrl3.test(oldUrl)){
        arr = regUrl3.exec(oldUrl);
        newUrl = picUrl3 + arr[1] + '.jpg';
        a.src = newUrl;
    }
    else if(regUrl2.test(oldUrl)){
        arr = regUrl2.exec(oldUrl);
        newUrl = picUrl2 + arr[1] + arr[2] + '.jpeg';
        a.src = newUrl;
    }
}


var PLANETWORK = {
    isPlanetHasWater: function() {
        return CONSTANTS.regularBlog.test(CONSTANTS.localurl);
    },
    isPlanetHasPeople: function() {
        return CONSTANTS.regularList.test(CONSTANTS.localurl);
    },
    KillVill: function(orginUrl) {
        var decodeStr = /.*\?(http|https):/g;
        var decodeSig = /______/g;
        var jsSuffix = '&amp;z';
        var htmlSuffix = '&z';
        var returnSuffix = 'return false';
        if (orginUrl.indexOf('viidii') != -1) {
            var pureUrl = orginUrl.replace(decodeStr, 'http:').replace(decodeSig, '.').replace(jsSuffix, '').replace(htmlSuffix, '').replace(returnSuffix, '');
            return pureUrl;
        } else {
            return orginUrl;
        }
    },
    Mercury: function() {

        var self = this;
        // 处理链接
        var linkNode = $('a[href*=\'viidii\']');
        if (linkNode.length != 0) {
            linkNode.each(function() {
                var orginLink = $(this).attr('href');
                var pureLink = self.KillVill(orginLink);
                $(this).attr('href', pureLink);
            });
        }

        linkNode = $('a[href*=\'hash\=\']');
        if (linkNode.length != 0) {
            linkNode.each(function() {
                var orginLink = $(this).attr('href');
                var tempLink = orginLink.split('hash=');
                var hrefMagnet = 'magnet:?xt=urn:btih:' + tempLink[1].substring(3);

                $(this).after('<a href="' + orginLink + '" target="_blank">下载种子</a>');
                $(this).attr('href', hrefMagnet).text(hrefMagnet);
                $(this).parent().addClass('link-braces');
            });
        }
    }
}
PLANETWORK.Mercury();

