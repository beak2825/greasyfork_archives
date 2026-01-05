// ==UserScript==
// @name         Add Movie QueryUrl For Douban
// @namespace    http://weibo.com/willxiangwb
// @version      0.5
// @description  方便直接搜索资源
// @author       willxiang
// @include      *://movie.douban.com/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16448/Add%20Movie%20QueryUrl%20For%20Douban.user.js
// @updateURL https://update.greasyfork.org/scripts/16448/Add%20Movie%20QueryUrl%20For%20Douban.meta.js
// ==/UserScript==


var url = location.host;

var movieTitle = $('h1 span:eq(0)').text().split(' ')[0];

var divInfo = $('#info');

var downloadLink = $('<span>').attr('class','pl').html('搜索资源:');

/*添加搜索地址*/
var youku = $('<a>').attr('href','http://www.soku.com/search_video/q_'+movieTitle).attr('target','_blank').html('优酷');
var qq = $('<a>').attr('href','http://v.qq.com/search.html?pagetype=3&stj2=search.search&stag=txt.index&ms_key='+movieTitle).attr('target','_blank').html('腾讯');
var iqiyi = $('<a>').attr('href','http://so.iqiyi.com/so/q_'+movieTitle).attr('target','_blank').html('爱奇艺');
var pptv = $('<a>').attr('href','http://search.pptv.com/s_video?kw='+movieTitle).attr('target','_blank').html('PPTV');
var bilibili = $('<a>').attr('href','http://search.bilibili.com/all?keyword='+movieTitle).attr('target','_blank').html('B站');
var acfun = $('<a>').attr('href','http://www.acfun.cn/search/?#query='+movieTitle).attr('target','_blank').html('A站');
var neets = $('<a>').attr('href','https://neets.cc/search?key='+movieTitle).attr('target','_blank').html('Neets');
var yyets = $('<a>').attr('href','http://www.zimuzu.io/search/index?keyword='+movieTitle).attr('target','_blank').html('字幕组（人人影视）');
var ed2000 = $('<a>').attr('href','http://zhannei.baidu.com/cse/search?s=5102198518115871963&q='+movieTitle+'&isNeedCheckDomain=1&jump=1').attr('target','_blank').html('ed2000');
var mgtv = $('<a>').attr('href','https://so.mgtv.com/so/k-'+movieTitle).attr('target','_blank').html('芒果TV');

downloadLink.append(yyets);


downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(ed2000);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(acfun);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(bilibili);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(youku);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(qq);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(iqiyi);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(mgtv);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(pptv);

downloadLink.append('&nbsp;/&nbsp;');
downloadLink.append(neets);

divInfo.append(downloadLink);