// ==UserScript==
// @name        GA split quotes
// @namespace   glav.su
// @description Добавляет в редактор кнопку для разбивки цитат
// @include     https://glav.su/forum/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26475/GA%20split%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/26475/GA%20split%20quotes.meta.js
// ==/UserScript==
$(document).ready(function(){
	if(typeof $.sceditor == 'function' && $("div.sceditor-group").length > 0){
		function addStyle(styleText) {
			var style = document.createElement('style');
			if (document.head) {
				document.head.appendChild(style);
				style.innerHTML = styleText;
			}
		}
		addStyle([
			'.split_button {',
				'background-color: #eee;',
				'background-clip: padding-box;',
				'border: 1px solid #ccc;',
				'border-radius: 0px;',
				'cursor: pointer;',
				'display: block;',
				'float: left;',
				'height: 24px;',
				'margin: 0px 1px 0px 0px;',
				'padding: 0;',
				'text-decoration: none;',
				'width: 24px;',
				'-moz-background-clip: padding;',
				'-moz-border-radius: 0px;',
				'-webkit-background-clip: padding-box;',
				'-webkit-border-radius: 0px;',
			'}',
			'.split_button:hover {',
				'background-color: #ccc;',
				'text-decoration: none;',
			'}',
			'.split_button div{',
				'background-image: url(/files/messages/89e86e02a654a2c75224b1c4556ca5c9.png);',
				'display: block;',
				'height: 24px;',
				'width: 24px;',
			'}',
		].join(''));
		$('<a class="split_button" title="Разбить цитату">')
			.append($('<div>'))
			.click(function(){
				var eD = $('#messageBBCodeForm').find('textarea').sceditor('instance'), qSp = '', mch;
				if( eD.inSourceMode() === true ){
					var caret = eD.sourceEditorCaret().start;
					function getQouteSplit(c, src, s, lock){
						if( c < 0 ) return '';
						s = src[c] + s;
						if( mch = s.match(/^\[\/quote\]/) ) lock++;
						if( mch = s.match(/^\[quote.*?\]/) ){
							if( lock == 0 ){
								return '[/quote]\n\n' + mch[0];
							}else{
								lock--;
							}
						}
						return getQouteSplit(--c, src, s, lock);
					}
					eD.sourceEditorInsertText( getQouteSplit(caret, eD.val(), '', 0) );
				}else if( (fBP = eD.getRangeHelper().getFirstBlockParent()).nodeName == 'BLOCKQUOTE' ){
					qSp = '[/quote]<br><br>[quote';
					qSp	+= (typeof (au = $(fBP).attr('author')) !== 'undefined')? ' author='+au : '';
					qSp	+= (typeof (ln = $(fBP).attr('link')) !== 'undefined')? ' link='+ln : '';
					qSp	+= (typeof (dt = $(fBP).attr('date')) !== 'undefined')? ' date='+dt : '';
					qSp	+= ']';
					eD.wysiwygEditorInsertHtml(qSp);
					eD.toggleSourceMode();
					eD.toggleSourceMode();
				}
			})
			.appendTo( $($("div.sceditor-group")[5]) );
	}
});