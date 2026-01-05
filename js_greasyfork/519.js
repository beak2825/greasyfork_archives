// ==UserScript==
// @name            pikabu.ru Comment Colorizer
// @description     Colorizes comments by rating
// @author          Sanya_Zol (Alexander Zolotarev)
// @license         Public domain
// @icon            https://s.pikabu.ru/favicon.ico
// @homepageURL     https://greasyfork.org/en/scripts/519-pikabu-ru-comment-colorizer
// @namespace       Sanya_Zol
// @version         0.2.6
// @match           *://pikabu.ru/*
// @run-at          document-end
// @grant           none
// @require         https://code.jquery.com/jquery-3.3.1.slim.js
// @downloadURL https://update.greasyfork.org/scripts/519/pikaburu%20Comment%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/519/pikaburu%20Comment%20Colorizer.meta.js
// ==/UserScript==

(function($){
	var myStyles = document.createElement('style');
	myStyles.innerHTML = (
		'.comment__body .comment__content{background: #fff;padding:0 3px;border-radius:4px;opacity:.9;}'
		+ '.comment__body{padding:3px;margin-top:4px;margin-bottom:4px;border-radius:4px;}'
	).replace(/;/g,' !important;');
	$('body').append(myStyles);
    var filterstr='.comment__rating-count:not([data-pkbcolored])';
    var elfunc2=function(element){
        var a = $(element).closest('.comment__body');
		var content = a.find('.comment__content');
		if(!content || !content.length)return false;
        var c = ZolCalcColor( parseInt($(element).html()) );
        a.css({backgroundColor:c});
        // ZolGradient( a.find('td.comment_b'), 'top, '+c+' 0%,#ffffff 100%' );
        $(element).attr('data-pkbcolored','yes');
		return true;
    };
	var elfunc=function(){
		var This=this;
		if(!elfunc2(This)){
			setTimeout(function(){
				elfunc2(This);
			},50);
		}
	};
    // var ZolCalcColor = function(r){var sub = (255-Math.min( Math.round( Math.abs(r)*10 ), 255 )+256).toString(16).substr(1); return '#'+( (r>0)?(sub+'ff'+sub):('ff'+sub+sub) );};
    var ZolCalcColor_max = 255/Math.log(1000);
    var ZolCalcColor = function(r){
        var sub = (255-Math.min( Math.round( Math.log(Math.abs(r)+1)*ZolCalcColor_max ), 255 )+256).toString(16).substr(1);
        return '#'+( (r>0)?(sub+'ff'+sub):('ff'+sub+sub) );
    };
    var ZolGradient = function(a,gr){
        // http://stackoverflow.com/a/16697618/870183
        // a.css("background-image", "-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #333), color-stop(100%, #222))");
        a
        .css('background-image', '-webkit-linear-gradient('+gr+')')
        .css('background-image', '-moz-linear-gradient('+gr+')')
        .css('background-image', '-o-linear-gradient('+gr+')')
        .css('background-image', 'linear-gradient('+gr+')');
    };
    $(filterstr).each(elfunc);
    /*
    // this won't work
    $(document).on('DOMNodeInserted','.comments',function(e){
        $(e.originalEvent.relatedNode).find(filterstr).each(elfunc);
    });
    */
    var elementWaitFn;
    elementWaitFn = function (node, deep) {
        if (node.querySelector('.comment__placeholder')) {
            if (deep > 50) {
                return;
            }
            setTimeout(function () {
                elementWaitFn(node, deep + 1);
            }, 50 * deep);
            return;
        }
        $(node).find(filterstr).each(elfunc);
    };
    var observer = new MutationObserver(function (mutationsList, _observer) {
        var nodes = [];
        for (let mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;
            for (let node of mutation.addedNodes) {
                if (node.classList?.contains('comment')) {
                    nodes.push(node);
                }
            }
        }
        if (nodes.length == 0) return;
        setTimeout(function () {
            for (let node of nodes) {
                if (!node.isConnected) continue;
                elementWaitFn(node, 0);
            }
        }, 10);
    });
    observer.observe(document.getElementsByTagName('body')[0], {childList: true, attributes: false, characterData: false, subtree: true});
})(jQuery);