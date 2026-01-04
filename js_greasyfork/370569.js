// ==UserScript==
// @name         Redirect arxiv.org to cn.arxiv.org/pdf
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将任何网页内指向arxiv.org的pdf链接重写为arxiv中文镜像站cn.arxiv.org的对应链接，加速pdf加载。 Redirect arxiv.org to cn.arxiv.org/pdf. 
// @author       LTGuo
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/370569/Redirect%20arxivorg%20to%20cnarxivorgpdf.user.js
// @updateURL https://update.greasyfork.org/scripts/370569/Redirect%20arxivorg%20to%20cnarxivorgpdf.meta.js
// ==/UserScript==

window.onload = function() {
	'use strict';
    $('a[href*="arxiv.org"]').each(function() {
    	console.log('Contains arxiv href');
    	// console.log(this.href);
	    if ( this.href.match(/http[s]?:\/\/arxiv.org\/(pdf|abs)/) ) {
	    	console.log("match")
	        this.href = this.href.replace(/http[s]?:\/\/arxiv.org\/(pdf|abs)/, 'http://cn.arxiv.org/pdf');
	    }
	    if (this.href.match(/http?:\/\/cn.arxiv.org\/pdf/) && !this.href.match(/\.pdf/) )
	    {
	       this.href = this.href + '.pdf';
	    }
	});

    //handle the pdf link in arxiv.org/abs page
	if (/arxiv\.org\/abs/i.test(window.location.href)){
		var ele = $(".full-text ul li a")[0];
		ele.href = ele.href.replace('https://arxiv.org/', 'http://cn.arxiv.org/')+'.pdf';
	}
}
