// ==UserScript==
// @name	GK parent comment
// @namespace	GK
// @description	Adds links to parent commentary to GK comments, and sets parent commentary text as link tooltip.
// @include	http://govnokod.ru/*
// @include	http://www.govnokod.ru/*
// @version	1.2.0
// @grant	unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/2502/GK%20parent%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/2502/GK%20parent%20comment.meta.js
// ==/UserScript==

(function(){
function RunInPage(func) {
	var s = document.createElement("script"); 
	s.textContent = "(" + func + ")();"; 
	document.body.appendChild(s);
	setTimeout(function(){document.body.removeChild(s)}, 0);
}
RunInPage(function(){
	var PARENT = '<a class="comment-link comment-parent-link" href="">↑</a>';
	var $ = jQuery;

	//dirty, DIRTY hack to wait for certain element to appear. -_- 
	//But I have no idea how to do it right.
	function waitForSelector(selector, context, mustexist, callback) {
		if (($(selector, context).length>0) == mustexist)
			callback();
		else
			setTimeout(function(){waitForSelector(selector, context, mustexist, callback)}, 50);
		}

	//short function for adding custom CSS rules. Why use Greasemonkey specific GM_setStyle() just for that?
	function addCSS(rule) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		if (typeof styleElement.styleSheet !== 'undefined')
			styleElement.styleSheet.cssText = rule;
		else
			styleElement.appendChild(document.createTextNode(rule));
		document.getElementsByTagName("head")[0].appendChild(styleElement);
		}

	addCSS([
		'.comment-parent-link {margin-left:10px;font-size:10pt}',
		].join('/n'));

	function hijackComments() {
		var oldLoadComments = comments['load'];

		function newLoadComments(aElemTrigger) {
			var $parent = $(aElemTrigger).closest('.entry-comments');
			oldLoadComments.call(this,aElemTrigger);
			waitForSelector('.hcomment', $parent, true, function(){
				setParentLinks($parent);
				});
			}

		comments['load'] = newLoadComments;
		}

	function highlightComment(e) {
		if (! $(e.target).is('a.comment-parent-link')) return;
		var match = $(e.target).attr('href').match(/\#comment(\d+)$/);
		if (match) {
			$('body').find('.highlight').removeClass('highlight');
			$('#comment-'+match[1]).addClass('highlight');
			}
		}
		
	function setParentLinks($context) {
		$context.find('.hcomment').each(function(i,e){
			var $this = $(this);
			var $parent = $this.parents('.hcomment:eq(0)');
			if ($parent.length) {
				var $parentlink = $(PARENT);
				$parentlink.attr('href', '#'+$parent.find('a.comment-link:eq(0)').attr('name'));
				$parentlink.attr('title', $parent.find('.comment-text:eq(0)').text());
				$this.find('a.comment-link:eq(0)').after($parentlink);
				}
			});
		}

	setParentLinks($('body'));
	hijackComments();
	$('body').click(highlightComment);
	});
})();