// ==UserScript==
// @name         Redirect arxiv.org to in.arxiv.org/pdf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将任何网页内指向arxiv.org的pdf链接重定向到in.arxiv.org
// @author       GFU
// @include      http://*.*
// @include      https://*.*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/425184/Redirect%20arxivorg%20to%20inarxivorgpdf.user.js
// @updateURL https://update.greasyfork.org/scripts/425184/Redirect%20arxivorg%20to%20inarxivorgpdf.meta.js
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
		ele.href = ele.href.replace('https://arxiv.org/', 'http://in.arxiv.org/')+'.pdf';
	}
}