// ==UserScript==
// @name        Remove livejournal-promo
// @name:ru     Удаление промо-блоков livejournal
// @version     3.2020.4.11
// @description Remove livejournal's promo blocks, promo-posts, hide spam-authors by list in localStorage, fix CSS.
// @description:ru Remove livejournal's promo. Удаляет промо-блоки, промо-посты из френд-ленты, скрывает спам-авторов по списку, подправляет CSS (шрифт без засечек, размеры аватаров, общий светлый фон) на некоторые группы стилей.
// @namespace   https://github.com/spmbt/
// @include     http://livejournal.com/
// @include     http://*.livejournal.com/
// @include     http://*.livejournal.com/*
// @include     https://livejournal.com/
// @include     https://*.livejournal.com/
// @include     https://*.livejournal.com/*
// @downloadURL https://update.greasyfork.org/scripts/14879/Remove%20livejournal-promo.user.js
// @updateURL https://update.greasyfork.org/scripts/14879/Remove%20livejournal-promo.meta.js
// ==/UserScript==

(function(css){

var spamSList = [
		'fred2265','tonyhofstra','zaven926','eduard_456' //insert your own list of spammers
	]
	,wrapperS = ['.appwidget.appwidget-homepage-selfpromo'
		,'.appwidget.appwidget-homepage-commpromo'
		,'.appwidget.appwidget-journalpromo'
		,'iframe[data-link*="youtube.com/watch?v=cFvuGr0Voic"]'
		,{q:'b-item-type-ad.i-friendsfeed-ad-close', parent: 4}
		,{q:'a >img[src*="star-colored150.png"], a >img[src*="178679_1000.jpg"]', parent: 2} //some images
		,{q:'.comment-wrap .comment-head-in >p .i-ljuser >.i-ljuser-username'
				+',.comments-body .comment-meta .i-ljuser >.i-ljuser-username b'
				+',.b-tree .b-leaf-inner .i-ljuser >.i-ljuser-username'
			,spamS: spamSList //block spam by authors of comment
			,parent: 5}
		,{q:'.comment-wrap.partial >.i-ljuser >.i-ljuser-username'
				+',.comments-body .collapsed-comment .i-ljuser >.i-ljuser-username'
			,spamS: spamSList //block spam by authors of wrapped comment
			,parent: 2}
	]
	,win = typeof unsafeWindow !='undefined'? unsafeWindow : window
	,$q = function(q, f){return (f||document).querySelector(q)}
	,setLocStor = function(name, hh){
		if(!localStorage) return;
		localStorage['removeLj_'+ name] = JSON.stringify({h: hh});
	},
	getLocStor = function(name){
		return (JSON.parse(localStorage && localStorage['removeLj_'+ name] ||'{}')).h;
	}
	,removeLocStor = function(name){localStorage.removeItem('removeLj_'+ name);}
	,cleaning = function(){
		for(var i in wrapperS){
			var wI = wrapperS[i]
				,wObj = typeof wI !='string'
				,wQA = [].slice.call(document.querySelectorAll(wObj ? wI.q : wI) );
			for(var j =0; j < wQA.length; j++){
				var wJ = wQA[j];
				if(wObj && wI.spamS){ //block spam
					var isSpam =0;
					for(var k =0; k < wI.spamS.length; k++){
						if(wJ.innerHTML.replace(/<.*?>/g,'') == wI.spamS[k]){
							isSpam =1;
						break;}}
				}
				if(wObj && wI.parent){ //block upper
					for(var k =0; k < wI.parent; k++)
						wJ = wJ.parentNode;
				}
				if(!wObj || wObj && !wI.spamS || wObj && wI.spamS && isSpam)
					wJ.style.display ='none';
				//TODO add grey blocks
			}
			//TODO add supress by click
		}};
cleaning();
	spamSList = getLocStor('spamList') || spamSList;
	//TODO button to add to spamList
var Tout = function(h){
	var th = this;
	(function(){
		if((h.dat = h.check(h.t) )) //wait of positive result, then occcurense
			h.occur();
		else if(h.i-- >0) //next slower step
			th.ww = window.setTimeout(arguments.callee, (h.t *= h.m) );
	})();
};

new Tout({t:320, i:6, m: 1.6 //нижний баннер
	,check: function(t){
		return document && $q('.b-discoverytimes-wrapper');
	}
	,occur: function(){
		var underBanner = this.dat;
		underBanner &&(underBanner.style.display = 'none');
	}
});
new Tout({t:370, i:6, m: 1.6
	,check: function(t){
		return document && $q('.s-body #comments .b-tree-root .b-leaf');
	}
	,occur: cleaning
});

(function(css){ //addRules
  console.log('22221', typeof GM_addStyle, typeof addStyle);
	if(typeof GM_addStyle !='undefined') GM_addStyle(css); //Fx,Chr
	else if(typeof addStyle !='undefined') addStyle(css);
	else{ //Op12
		var heads = document.getElementsByTagName('head');
		if(heads.length){
			var node = document.createElement('style');
			node.type ='text/css';
			node.appendChild(document.createTextNode(css));
			heads[0].appendChild(node);
	}}
})(css);

})('body{background: transparent!important} html, body, .comment-wrap partial, .comment-wrap, .comment-text{font-family: sans-serif!important}' //common BGs
+'#page{background: none!important}'
+'#page{background-color: #f6f6f8!important}'
+'.header a:link, .header a:visited, .sidebar a:link, .sidebar a:visited{color: #bbc!important}'
+'.lj-like, iframe[id], .pagewide-wrapper, div[id^="super_footer"]{display: none!important}' //likes under article
//ava sizes
+'.comment-head .comment-upic img, .comment-inner .user-icon img,.b-leaf .b-leaf-userpic-inner img, .b-leaf-userpic,'
	+'.comment-text .comment-meta{width: auto!important; max-height: 45px!important; margin: 0 3px 0!important; padding: 3px 3px!important}'
	+'.comment-head .comment-upic{width: auto!important; height: auto!important}.comment-text .comment-meta{min-height: 46px!important}'
+'.b-leaf-userpic-inner{width: auto!important; height: 49px!important}'
+'.b-leaf-userpic{margin-left:10px!important}'
+'.b-leaf.b-leaf-collapsed .b-leaf-shorttime{margin-left:6px!important}'
+'.comment-body{margin-left: 3px!important}'
+'.b-leaf.b-leaf-poster, .b-leaf-username{margin: 0!important}'
+'.b-leaf{margin: 8px 0 4px!important}'
+'.b-singlepost-wrapper, .b-tree-twig,.content .entry-wrap,.comment-wrap{max-width: 800px}'
);