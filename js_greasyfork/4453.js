// ==UserScript==
// @name       Batch Download
// @namespace  https://greasyfork.org/scripts/4453
// @version    0.4
// @description  快传 旋风 批量连接生成
// @match http://fenxiang.qq.com/*
// @match http://kuai.xunlei.com/d/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4453/Batch%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/4453/Batch%20Download.meta.js
// ==/UserScript==

var links = '';

// 旋风
$('.download_file').each(function(){
    var qhref = $(this).attr('qhref');
    $(this).attr('href',qhref);
    $(this).unbind();
    links += qhref + '\n';
});

// 快传
$('a[xsid]').each(function(){
    var href = $(this).attr('href');
	$(this).unbind();
    links += href + '\n';
});

// 右下角文本框
$('body').append('<style>.myboard{position:fixed;bottom:0px;right:0px;width:300px;height:200px;}</style>');
$('body').append('<textarea class="myboard">'+links+'</textarea>');
$('.myboard').focus();
$('.myboard').select();