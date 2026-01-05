// ==UserScript==
// @name           Hatebu Tag Filter
// @description:en Normalizes filtering tag on Hatena Bookmark, when you display related tag to 'block'.
// @version        0.1
// @namespace      https://twitter.com/foldrr
// @include        http://b.hatena.ne.jp/
// @description Normalizes filtering tag on Hatena Bookmark, when you display related tag to 'block'.
// @downloadURL https://update.greasyfork.org/scripts/13692/Hatebu%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/13692/Hatebu%20Tag%20Filter.meta.js
// ==/UserScript==
(function(){
	var d = document;
	var tagsParent = d.getElementById('related-tags');
	if(! tagsParent){
		return;
	} 
	
	var tags = tagsParent.getElementsByTagName('li');
	if((! tags) || ! tags.length ){
		return;
	}
	
	var form = d.getElementById('tag-search-related-form');
	var input = form.getElementsByTagName('input')[0];
	input.addEventListener('keyup', function(e){
		for(var i = 0, n = tags.length; i < n; i++){
			tags[i].setAttribute('style', 'display:none !important');
		}
	}, true);
})();
