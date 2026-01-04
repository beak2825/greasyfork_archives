// ==UserScript==
// @name         大陆快速下载arxiv.org论文
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  加速arXiv网站pdf下载速度.将任何网页内指向arxiv.org的pdf链接重写为arxiv中文镜像站xxx.itp.ac.cn的对应链接，加速pdf加载。 Redirect arxiv.org to xxx.itp.ac.cn/pdf. 修改自Redirect arxiv.org to xxx.itp.ac.cn/pdf，原作者：LTGuo
// @author       Joe
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/394308/%E5%A4%A7%E9%99%86%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BDarxivorg%E8%AE%BA%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/394308/%E5%A4%A7%E9%99%86%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BDarxivorg%E8%AE%BA%E6%96%87.meta.js
// ==/UserScript==

window.onload = function() {
	'use strict';
    $('a[href*="arxiv.org"]').each(function() {
    	console.log('Contains arxiv href');
    	// console.log(this.href);
	    if ( this.href.match(/http[s]?:\/\/arxiv.org\/(pdf|abs)/) ) {
	    	console.log("match")
	        this.href = this.href.replace(/http[s]?:\/\/arxiv.org\/(pdf|abs)/, 'http://xxx.itp.ac.cn/pdf');
	    }
	    if (this.href.match(/http?:\/\/xxx.itp.ac.cn\/pdf/) && !this.href.match(/\.pdf/) )
	    {
	       this.href = this.href + '.pdf';
	    }
	});

    //handle the pdf link in arxiv.org/abs page
	if (/arxiv\.org\/abs/i.test(window.location.href)){
		var ele = $(".full-text ul li a")[0];
		ele.href = ele.href.replace('https://arxiv.org/', 'http://xxx.itp.ac.cn/')+'.pdf';
	}
}