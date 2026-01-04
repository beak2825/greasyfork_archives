// ==UserScript==
// @name GazsifyHVG
// @version 1.1
// @author Herr Otto Flick
// @namespace https://greasyfork.org/hu/users/323718-%C3%A1d%C3%A1m-francz
// @description Szabad kommentelés HVG-n
// @match https://*.hvg.hu/*
// @match https://hvg.hu/*
// @downloadURL https://update.greasyfork.org/scripts/404209/GazsifyHVG.user.js
// @updateURL https://update.greasyfork.org/scripts/404209/GazsifyHVG.meta.js
// ==/UserScript==

var findComments = function(el) {
    var arr = [];
    for(var i = 0; i < el.childNodes.length; i++) {
        var node = el.childNodes[i];
        if(node.nodeType === 8 && node.textContent.trim() === 'Disqus') {
            arr.push(node);
        } else {
            arr.push.apply(arr, findComments(node));
        }
    }
    return arr;
};

var inhtml = `	<div class="site-disqus-holder" id="article-comments" data-scroll-event-name="ScrollToArticleDisqus">
		<div class="heading-with_line"><span>Hozzászólások</span></div>
		<div class="site-disqus">
<div id="disqus_thread"></div>
			<div class="disqus-overlay"><a class="show_all"><i class="icon-comment"></i>Hozzászólások megjelenítése (GazsifyHVG)</a></div>
		</div>
	</div>`;

//check is there Disqus, if no, we are adding it
if(! document.getElementById("article-comments")){
	var disqus_shortname = 'hvg';
	var disqus_identifier = window.location;
	var disqus_title = document.title;
	var disqus_url = window.location;
	var disqus_config = function () {
		this.language = "hu";
		this.page.api_key = 'tWtbL1OV8by298LctEFv9ccPxqJ7DUCg5sS064ItLBAWl11EdFJYcHqIgiZCVvS1';
		this.page.remote_auth_s3 = '{}';
	};
	(function () {
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

		// Comment számláláshoz async JS behívása
		var dsqCommentCount = document.createElement('script'); dsqCommentCount.id = 'dsq-count-scr'; dsqCommentCount.type = 'text/javascript'; dsqCommentCount.async = true;
		dsqCommentCount.src = '//' + disqus_shortname + '.disqus.com/count.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsqCommentCount);
	})();

    var commentReference = findComments(document)[0];
    var div=document.createElement("div");
    div.innerHTML=inhtml;
    commentReference.parentNode.insertBefore(div, commentReference.nextSibling);
}
