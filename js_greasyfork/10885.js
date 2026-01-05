// ==UserScript==
// @name        MyDealz Enhancer
// @namespace   mydealz_enhancer
// @description Verbessert Funktionen von MyDealz, oder stellt sie wieder her
// @author	BAERnado
// @contributor	lolnickname (remodelNavBar, grabQuote, maxQuotes, error-display [avatar border])
// @contributor	richi2k (modifySearch-Teile, showUserInfo, embedYoutube, minimizeQuotes, dealTextPreview)
// @contributor	vielleichtmann1 (Image Preview)
// @contributor	Nico (insertDirectLink-Idee)
// @include     http://www.mydealz.de/*
// @include     https://www.mydealz.de/*
// @version     1.5.017
// @require	http://code.jquery.com/jquery-2.1.4.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/10885/MyDealz%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/10885/MyDealz%20Enhancer.meta.js
// ==/UserScript==

function ModifyPage() {

	var defaultSettings = {behavior: {showGreenDots: true}, comments: {maxQuoteLevel: 1, editReason: '', signature: '', useSignature: false}, deals: {hide: ''}, userMenuDirect : {pn: false, account: false}, hideAds: {topBar: true, gsWidget: true, inside: true,nlSection: true, app: true}, moveButtons: {_: true, deals: true, gutscheine: true, freebies: true, custom: true, gesuche: false, diverses: false}, fromTo: {deals: 'deals-new', gutscheine: 'gutscheine-new', freebies: 'freebies-new', gesuche: 'gesuche', diverses: 'diverses', bugreports: 'bugreports'}, smileys: {}, oldSmileys: {use: false, show: false}, display: {embedYoutube: true, minimizeQuotes: true, userInfo: true, dealPreview: 0}, search: {presetCategory: 1}};
	var settings = {};
	var oldSmileys = {oO: 'http://up.picr.de/24681919lc.png', ':(': 'http://up.picr.de/24681920wk.png', ':)': 'http://up.picr.de/24681921vt.png', ':p': 'http://up.picr.de/24681922sp.png', ';)': 'http://up.picr.de/24681923bn.png', '(_;)': 'http://up.picr.de/24681924zb.png', ':|': 'http://up.picr.de/24681925vj.png', ':{': 'http://up.picr.de/24682144sm.png', '8)': 'http://up.picr.de/24682161iz.png', 'X)': 'http://up.picr.de/24682170wf.png', '&lt;3': 'http://up.picr.de/24682514fl.png'};
	var searchCategories = {all: {id: 0, category: 'Alle'}, deals: {id: 1, category: 'Deals'}, gutscheine: {id: 2, category: 'Gutscheine'}, freebies: {id: 3, category: 'Freebies'}, gesuche: {id: 4, category: 'Gesuche'}, diverses: {id: 5, category: 'Diverses'}, bugreports: {id: 7, category: 'Bug Reports'}};
	var timer = {};
	var lastFocus = null;
	var save = {pn: {}};
	var userName;

	$.fn.hasAttr = function(name) {  
		return this.attr(name) !== undefined;
	};

	$.fn.extend({
		insertAtCaret: function(myValue) {
			var elem = this[0];
			if (document.selection) {
				elem.focus();
				sel = document.selection.createRange();
				sel.text = myValue;
				elem.focus();
			} else if (elem.selectionStart || elem.selectionStart == '0') {
				var startPos = elem.selectionStart;
				var endPos = elem.selectionEnd;
				var scrollTop = elem.scrollTop;
				var oldLength = elem.value.length;
				elem.value = elem.value.substring(0, startPos)+myValue+elem.value.substring(endPos,elem.value.length);
				elem.focus();
				elem.selectionStart = startPos + elem.value.length - oldLength;
				elem.selectionEnd = startPos + elem.value.length - oldLength;
				elem.scrollTop = scrollTop;
			} else {
				elem.value += myValue;
				elem.focus();
			}
		}
	});

	$.fn.setCursorPosition = function(pos) {
		var _elem = this[0];
    if (_elem.setSelectionRange) {
      _elem.setSelectionRange(pos, pos);
    } else if (_elem.createTextRange) {
      var range = _elem.createTextRange();
      range.collapse(true);
      if(pos < 0) {
        pos = $(_elem).val().length + pos;
      }
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

	if(!RegExp.escape){
		RegExp.escape = function(s){
			return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
		};
	}

	function printUTCDate(_date) {
		return ('0'+_date.getUTCHours().toString()).replace(/^0*([0-9]{2})$/, '$1') + ':' + ('0'+_date.getUTCMinutes().toString()).replace(/^0*([0-9]{2})$/, '$1') + ':' + ('0'+_date.getUTCSeconds().toString()).replace(/^0*([0-9]{2})$/, '$1');
	}

	function printDate(_date) {
		return ('0'+_date.getHours().toString()).replace(/^0*([0-9]{2})$/, '$1') + ':' + ('0'+_date.getMinutes().toString()).replace(/^0*([0-9]{2})$/, '$1') + ':' + ('0'+_date.getSeconds().toString()).replace(/^0*([0-9]{2})$/, '$1');
	}

	function timeTick() {
		var _allTimes = document.getElementsByClassName('bf-carousel-date');
		var _remain;
		var _until;
		var _diffDate;
		var _toDate;
		var _diffTime;
		var _now = new Date();
		for(var _i = 0; _i < _allTimes.length; _i++) {
			_until = _allTimes[_i];
			_remain = _allTimes[_i].parentNode.getElementsByClassName('bf-carousel-date-remain')[0];
			_toDate = new Date();
			_toDate.setTime(parseInt(_until.innerHTML, 10)*1000);
			_diffDate = new Date();
			_diffTime = _toDate.getTime() - _now.getTime();
			if(_diffTime <= 0) {
				$(_allTimes[_i]).parent().find('.space--left-2').text(/Beginnt in/.test($(_allTimes[_i]).parent().find('.space--left-2').text('')) ? 'Begonnen' : 'Abgelaufen');
				$(_remain).remove();
			} else {
				_diffDate.setTime(_diffTime);
				_remain.innerHTML = printUTCDate(_diffDate); // + ' (' + printDate(_toDate) + ')';
			}
		}
	}

	function addTimes() {
		var _allTimes = document.getElementsByClassName('bf-carousel-date');
		var _newSpan;
		for(var _i = 0; _i < _allTimes.length; _i++) {
			_allTimes[_i].style.display = 'none';
			_newSpan = document.createElement('span');
			_newSpan.setAttribute('class', 'bf-carousel-date-remain');
			_allTimes[_i].parentNode.insertBefore(_newSpan, null);
		}
		timeTick();
		window.setInterval(timeTick, 1000);
	}

	function fixPositions() {
		var _allElems = document.getElementsByTagName('article');
		for(var _i = 0;_i < _allElems.length; _i++) {
			_allElems[_i].setAttribute('style', 'position: absolute; width: 1200px; left: 0px; top: ' + _i*404 + 'px');
		}
		window.setTimeout("document.getElementsByTagName('article')[0].parentNode.setAttribute('style', 'height: " + _allElems.length * 404 + "px;');", 20);
	}

	function changeLinks() {
		var _allLinks = $('a.navTrigger1, .navTrigger1-row-items .menu:last .menu-list .navMenu1-item');
		var _fromTo = settings.fromTo;

		var _loc;
		$(_allLinks).each(function (_lInd, _lVal) {
			var _link = $(_lVal);
			if(_link.hasAttr('href')) {
				_loc = _link.attr('href').replace(/^https?:\/\/www\.mydealz\.de(\/(hot|discussed|new)?)?$/, '/').replace(/^https?:\/\/www\.mydealz\.de\/([a-zA-Z-]+)?$/, '$1').replace(/-?(new|discussed)?$/,'');
				if(_loc in _fromTo) {
					_link.attr('href', _link.attr('href').replace(/^(https?:\/\/www\.mydealz\.de).*$/, '$1' + '/' + _fromTo[_loc]));
				}
			}
		});
	}

	function remodelNavBar() {
		var _subMenu = $('header strong[data-handler="menu"]');
		_subMenu.find('span[class!="navTrigger-arrow"]').remove();
		_subMenu = _subMenu.parent().parent();
		var _buttonIndex = 1;
		var _buttonBeforeSubIndex = 0;
		var _button;
		var _subHiddenButton;
		var _selected;
		var _moreHighlight = true;
		for(_bInd in settings.moveButtons) {
			if(_bInd == '_') {
				_button = $('.navTrigger1-row-items > li > a.navTrigger1[href="http://www.mydealz.de/"], .navTrigger1-row-items li.menu ul.menu-list li.hide--downThrough- a[href="http://www.mydealz.de/"]');
			} else {
				_button = $('.navTrigger1-row-items > li > a.navTrigger1[href*="' + _bInd + '"], .navTrigger1-row-items li.menu ul.menu-list li.hide--downThrough- a[href*="' + _bInd + '"]');
			}

			_selected = _button.hasClass('navTrigger1--selected') || _button.hasClass('navMenu1-item--selected');

			if(_button.hasClass('navTrigger1') && settings.moveButtons[_bInd]) {
				_button.attr('class', 'navTrigger1 navTrigger1hide--upTo-menu' + _buttonIndex++);
			} else if (_button.hasClass('navTrigger1') && !settings.moveButtons[_bInd]) {
				// Verschiebe in Untermenu
				_subMenu.find('li.hide--downThrough- a.navMenu1-item').eq(_buttonBeforeSubIndex++).parent().before(_button.attr('class', 'navMenu1-item').parent().attr('class', 'hide--downThrough-'));
			} else if(_button.hasClass('navMenu1-item') && settings.moveButtons[_bInd]) {
				// Verschiebe ins Hauptmenu
				_subMenu.before(_button.removeClass('navMenu1-item navMenu1-item--selected').addClass('navTrigger1').parent().removeClass('navMenu1-item hide--downThrough-').addClass('tGrid-cell hide--upTo-menu' + _buttonIndex));
			}

			if(_selected) {
				if(_button.hasClass('navTrigger1')) {
					_button.addClass('navTrigger1--selected');
					_moreHighlight = false;
				} else {
					_button.addClass('navMenu1-item--selected');
					if($('header.header .navTrigger1-row .navTrigger1-row-items a.navTrigger1[href="' + _button.attr('href') + '"]').length == 0) {
						_moreHighlight = true;
					} else {
						_moreHighlight = false;
					}
				}
			}
		}

		for(_buttonIndex = 1; _buttonIndex <= 4; _buttonIndex++) {
			_button = $('.navTrigger1-row-items > li.hide--upTo-menu' + _buttonIndex + ' > a.navTrigger1');
			if(_button.length) {
				_subHiddenButton = $('.navTrigger1-row-items li.menu ul.menu-list li.hide--downThrough-menu' + _buttonIndex + ' a');
				_subHiddenButton.attr('href', _button.attr('href')).html(_button.html());
			} else {
				$('.navTrigger1-row-items li.menu ul.menu-list li.hide--downThrough-menu' + _buttonIndex).remove();
			}
		}

		$('header strong[data-handler="menu"]').removeClass('navTrigger1--selected');
		if(_moreHighlight) {
			$('header strong[data-handler="menu"]').addClass('navTrigger1--selected');
		}
		if(settings.userMenuDirect.pn) {
			var _menuElem = $('ul.userBar label.userBar-button--pm').removeAttr('data-menu').removeAttr('data-handler');
			_menuElem.find('input').removeAttr('data-handler').click(function() { window.location.href = document.location.protocol + '//' + document.location.hostname + '/profile/' + userName + '/messages'; });
		}
		if(settings.userMenuDirect.account) {
			var _menuElem = $('ul.userBar label.userBar-button--user').removeAttr('data-menu').removeAttr('data-handler');
			_menuElem.find('input').removeAttr('data-handler').click(function() { window.location.href = document.location.protocol + '//' + document.location.hostname + '/profile/' + userName; });
		}

		var _addDeal = $('.navTrigger1-row ul.header-user>li.userbar-padding-right span.inline');
		_addDeal.text(_addDeal.text().replace(/ eintragen/,''));
	}

	function addCyberDealz() {
		var _newMenu = $('<li>').addClass('hide--downThrough-').append($('<a>').addClass('navMenu1-item').attr('href','http://www.mydealz.de/cyber-monday/cyberdeals').html('Cyber-Deals')).appendTo($('.navMenu--width-l').eq(0));
	}

	function removeAds() {
		var _ads = {topBar: '.topBar', gsWidget: '#gs-widget', inside: "#side section[data-track=\"{\\\"category\\\":\\\"Banner Sidebar\\\"}\"]", nlSection: '.inline-newsletter, .newsletter', app: '[alt="app banner for ios android and window phone"]'};
		for(_aInd in _ads) {
			if(_aInd in settings.hideAds && settings.hideAds[_aInd]) {
				if($(_ads[_aInd]) != null) {
					$(_ads[_aInd]).remove();
				}
			}
		}
	}

	function addFuncLinks() {
		var _threads = $('div.thread, li.thread');
		if(_threads.length) {
			$(_threads).each(function (_tInd, _tVal) {
				_thread = $(_tVal);
				var _list = _thread.find('footer ul');
				var _author = $.trim(_thread.find(".thread-author").eq(0).text());
				var _topic  = $.trim(_thread.find(".thread-title h1").eq(0).text());
				var _pnLink = $('<li>').addClass('hList-item').append($('<a>').click(startWaitForPN).addClass('link').addClass('ico').addClass('ico--type-pn-blue').html('PN').attr('data-modal', '{"endpoint":"http:\\/\\/www.mydealz.de\\/profile\\/' + userName + '\\/messages\\/modal-window?to=' + encodeURIComponent(_author) + '"}').attr('data-handler', 'modal').attr('href', 'http://hukd.mydealz.de/profile/' + userName + '/messages/compose-mail?to=' + encodeURIComponent(_author)));
				addGlobalStyle('.ico--type-pn-blue::before { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB/SURBVChTY/gPBm8+/Vh95N6kTVeACMgAciHiIOkbjz9oZ61FQ0BBkPTnb7+AnP2XniHLQbhAKYYTN14iCyEzgFIMQJsgHIgEsjFAKRRpNLTt9CMGZOVoCOg6hvsvPqGJwhHUY0C/okkAEVAQKg0Bz95+vXDvLdC1QAZU6P9/AKPpvjdJZe34AAAAAElFTkSuQmCC); background-size: 10px 10px; background-position: 3px 3px;}');
				_list.append(_pnLink);

				var _reportLink = _thread.find('.ico--type-megaphone-blue').parent();
				_newLink = $('<div>').addClass('hList-item').html('<button class="link ico ico--type-spam-blue ico--pos-l" data-handler="replace" type="button">Spam</button>').find('button').attr('data-replace', '["/vote?v=spam&t=' + _thread.attr('id') + '", "div"]').parent();
				_reportLink.before(_newLink);
				_newLink = $('<div>').addClass('hList-item').html('<button class="link ico ico--type-time-blue ico--pos-l" data-handler="replace" type="button">Abgelaufen</button>').find('button').attr('data-replace', '["/vote?v=expired&t=' + _thread.attr('id') + '", "div"]').parent();
				_reportLink.before(_newLink);
				_reportLink.remove();
			});
		}
	}

	function startWaitForPN () {
		var _thread_id = $('div.thread, li.thread').has($(this)).attr('id');
		timer.pn = window.setInterval(function () { waitForPN(_thread_id) }, 50);
	}

	function waitForPN(_thread_id) {
		if(!$('#' + _thread_id).find('.ico--type-pn-blue').hasClass('seal--spin')) {
			if('pn' in timer) {
				window.clearInterval(timer.pn);
				delete timer.pn;
			}
			$('#pm-subject').val($.trim($('#' + _thread_id + ' header.thread-head div.thread-title .inlineText').text()));
			saveRestorePN($.trim($('#' + _thread_id + ' header.thread-head .thread-meta a.thread-author').text()), _thread_id);
		}
	}

	function insertDirectLink() {
		// onClick entfernt
		$(".comments-list > li").each(function(_index) {
			var _directLink = document.location.protocol + '//' + document.location.hostname + document.location.pathname + '?page=' + $(".form--narrow input[name=cur_page]").val() +'#' + $(this).prop('id');
			$(this).find(".hList:first").append("<li class=\"comment-option hList-item\"> <a href=" + _directLink +"><button class=\"link ico ico--type-arrow-blue ico--pos-l\">Direktlink</button><a/></li>");
		});
	}

	function addFeedbackButtons() {
		var _thread = $('div.thread');
		if(_thread.length) {
			var _list = _thread.find('footer ul');
			var _author = $.trim(_thread.find(".thread-author").eq(0).text());
		}
	}

	function markPnRead() {
		if(settings.userMenuDirect.pn) {
			$.ajax({
				method: 'POST',
				url: 'http://www.mydealz.de/activity?type=pm',
				contentType: 'application/x-www-form-urlencoded',
				accept: 'application/json, text/javascript, */*',
				dataType: 'json'
			}).done(function () {
				$('#activities-count-pm').remove();
			});
		}
	}

	function filterPath() {
		_path = document.location.pathname.replace(/^\/(new|hot|discussed)$/, '/').replace(/^\/([^\/]+).*$/, '$1').replace(/(-?(new|discussed))?$/, '');
		if(_path != '/' && !(_path in settings.fromTo)) {
			return false;
		}
		return _path;
	}

	function startWaitForSubmit() {
		timer.submit = window.setInterval(waitForSubmit, 50);
	}

	function waitForSubmit() {
		if(!$('#commentForm').eq(0).hasClass('seal--spin')) {
			if('submit' in timer) {
				window.clearInterval(timer.submit);
				delete timer.submit;
			}
			modifyComments();
			addFeedbackButtons();
		}
	}

	function startWaitForChange() {
		var _link = $(this);
		var _params = JSON.parse(_link.attr('data-replace'))[2];
		timer['change_'+_params.comment_id] = window.setInterval(function() { waitForChange(_params.comment_id)}, 50);
	}

	function waitForChange(_comment_id) {
		if(!$('ul.comments-list #post' + _comment_id + ' div.comments-body').eq(0).hasClass('seal--spin')) {
			if(('change_'+_comment_id) in timer) {
				window.clearInterval(timer['change_'+_comment_id]);
				delete timer['change_'+_comment_id];
			}
			$('ul.comments-list #post' + _comment_id + ' #commentEditForm-reason').attr('value', settings.comments.editReason).val(settings.comments.editReason);
			var _commentField = $('#commentEditForm-content-' + _comment_id);
			_commentField.val(_commentField.val().replace(/\<br\s*\/\>$/m, ''));
			_commentField.change(customSmileys);
			_commentField.parent().parent().parent().parent().parent().parent().find('#commentEditForm-reason').change(customSmileys);
			_commentField.parent().find('div.markItUpHeader li.editor-option--type-emoticons>button').click(startWaitForSmileys);
		}
	}
	
	function startWaitForSmileys() {
		lastFocus = $(':focus');
		var _li = $(this);
		try {
			var _form = $(_li.parent().parent().parent().parent().find('textarea.input')[0].form);
			var _comment_id = 'new';
			if(_form.attr('id') == 'commentEditForm') {
				_comment_id = _form.find('input[name="comment_id"]').val();
			}
			timer['smileys_'+_comment_id] = window.setInterval(function() { waitForSmileys(_comment_id)}, 5);
		} catch (e) { }
	}

	function waitForSmileys(_comment_id) {
		if($('#powerTip:visible>ul>li>a').length) {
			if(('smileys_'+_comment_id) in timer) {
				window.clearInterval(timer['smileys_'+_comment_id]);
				delete timer['smileys_'+_comment_id];
			}
			$('#powerTip>ul>li>a').each(function(_sInd, _sVal) {
				if($(_sVal).attr('title') in oldSmileys) {
					var _li = $(_sVal).parent();
					var _classes = _li.attr('class').split(/ /);
					$(_classes).each(function (_cInd, _cVal) {
						if(_cVal.match(/^editor-menu-item--type-/)) {
							_li.removeClass(_cVal);
						}
					});
					_li.find('>a').attr('style', "background-image: url('" + oldSmileys[$(_sVal).attr('title')] + "');");
				}
			});
			// eigene Smileys
			var _sID = parseInt(($('#powerTip>ul>li:last').attr('class') + ' ').replace(/^.*markItUpButton5-([0-9]+) .*$/, '$1'), 10);
			for(_sInd in settings.smileys) {
				var _newElem = $('<li>').addClass('markItUpButton markItUpButton5-' + (++_sID) + ' iGrid-item text--align-center editor-menu-item').append('<a title="' + _sInd + '" href="" data-handler="popover-close" style="background-image: url(\'' + settings.smileys[_sInd] + '\');"></a>');
				$('#powerTip>ul').append(_newElem);
				_newElem.find('>a').click(addSmileyToComment);
			}
		}
	}

	function addSmileyToComment() {
		var _smiley = '[img]' + settings.smileys[$(this).attr('title')] + '[/img]';
		if(lastFocus.prop('tagName').toLowerCase() == 'textarea') {
			var _selStart = lastFocus[0].selectionStart;
			var _newText = lastFocus.val().substr(0,_selStart) + _smiley + lastFocus.val().substr(lastFocus[0].selectionEnd);
			lastFocus.val(_newText);
			lastFocus[0].selectionEnd = lastFocus[0].selectionStart = _selStart + _smiley.length;
		}
	}

	function startWaitForCommentMenu(_commentField) {
		timer['commentmenu'] = window.setInterval(function() { waitForCommentMenu(_commentField)}, 50);
	}
	
	function waitForCommentMenu(_commentField) {
		var _li = _commentField.parent().find('div.markItUpHeader li.editor-option--type-emoticons');
		if(_li.length) {
			window.clearInterval(timer['commentmenu']);
			delete(timer['commentmenu']);
			_li.find('>button').click(startWaitForSmileys);
		}
	}
	
	function customSmileys() {
		var _commentField = $(this);
		if(settings.oldSmileys.use) {
			for(_sInd in oldSmileys) {
				_commentField.val(_commentField.val().replace(new RegExp(RegExp.escape(_sInd), 'g'), '[img]'+oldSmileys[_sInd]+'[/img]'));
			}
		}
		for(_sInd in settings.smileys) {
			_commentField.val(_commentField.val().replace(new RegExp(RegExp.escape(_sInd), 'g'), '[img]'+settings.smileys[_sInd]+'[/img]'));
		}
	}

	function modifyComments() {
		var _changeLinks = $('ul.comments-list .ico--type-edit-blue').off('click', startWaitForChange).on('click', startWaitForChange);
		$('#commentForm').submit(startWaitForSubmit);

		_commentField = $('#commentForm-content');
		if(settings.comments.useSignature) {
			if(_commentField.length && settings.comments.signature.length && _commentField.val().indexOf(settings.comments.signature) == -1) {
				_commentField.val(_commentField.val() + "\n" + settings.comments.signature);
				_commentField.setCursorPosition(0);
			}
		}
		_commentField.change(customSmileys);
		_commentField.blur(customSmileys);
		startWaitForCommentMenu(_commentField);

		var _quoteLinks = $('.ico--type-quote-blue');
		if(_quoteLinks.length) {
			_quoteLinks.each(function (_qlInd, _qlVal) {
				var _quoteLink = $(_qlVal);
				_quoteLink.removeAttr('data-track').removeAttr('data-handler');
				_quoteLink.click(grabQuote);
			});
		}

		var _userAvatars = $('img.avatar-image--comment:not([data-popover*="/' + userName + '?"])');
		if(_userAvatars.length) {
			_userAvatars.off('click', startWaitForUserCommentMenu).on('click', startWaitForUserCommentMenu);
		}
	}

	function startWaitForUserCommentMenu() {
		var _link = $(this);
		var _commentUser = _link.attr('data-popover').replace(/^.*profile\\\/([^\?]+)\?.*$/, '$1');
		timer['userCommentMenu_'+_commentUser] = window.setInterval(function() { waitForUserCommentMenu(_commentUser)}, 50);
	}

	function waitForUserCommentMenu(_commentUser) {
		if($('#powerTip > div').hasClass('profile')) {
			if('userCommentMenu_' + _commentUser in timer) {
				window.clearInterval(timer['userCommentMenu_' + _commentUser]);
				delete timer['userCommentMenu_' + _commentUser];
			}
			// attach Events on PN-Button
			$('#powerTip > div.profile ul.profile-column a.button').has('span.ico--type-mail-white').on('click', startWaitForCommentPN);
		}
	}

	function startWaitForCommentPN() {
		var _link = $(this);
		var _pnUser = _link.attr('href').replace(/^.*\?to=(.*)$/, '$1');
		timer['pnWindow_'+_pnUser] = window.setInterval(function() { waitForCommentPN(_pnUser)}, 50);
	}

	function waitForCommentPN(_pnUser) {
		if(!$('#powerTip > div.profile ul.profile-column a.button').has('span.ico--type-mail-white').hasClass('seal--spin')) {
			if('pnWindow_' + _pnUser in timer) {
				window.clearInterval(timer['pnWindow_' + _pnUser]);
				delete timer['pnWindow_' + _pnUser];
			}
			saveRestorePN(_pnUser);
		}
	}

	function savePN(_userPath) {
		save.pn[_userPath] = {message: $('#pm-message').val(), subject: $('#pm-subject').val()};
	}

	function saveRestorePN(_pnUser, _thread_id, _initSave) {
		// attach Events on PN-Button
		var _userPath = _pnUser + (_thread_id != null ? '_' + _thread_id : '');
		if(_userPath in save.pn) {
			$('#pm-subject').val(save.pn[_userPath].subject);
			$('#pm-message').val(save.pn[_userPath].message);
		}
		if(_initSave != null && _initSave) {
			savePN(_userPath);
		}
		$('#pm-subject, #pm-message').change(function() { savePN(_userPath); });
		$('div.modalWin-body').has('#pm-message').find('form.form').submit(function () {
			if(_userPath in save.pn) {
				delete save.pn[_userPath];
			}
			timer['pnSent_' + _userPath] = window.setInterval(function () { waitForPNSent(_pnUser, _thread_id) }, 50);
		});
	}

	function waitForPNSent(_pnUser, _thread_id) {
		GM_log('Waiting for PN sent');
		var _form = $('#template-modal .modalWin').has('#pm-subject').find('form.form');
		if(!_form.hasClass('seal--spin')) {
			var _userPath = _pnUser + (_thread_id != null ? '_' + _thread_id : '');
			if('pnSent_' + _userPath in timer) {
				window.clearInterval(timer['pnSent_' + _userPath]);
				delete timer['pnSent_' + _userPath];
			}
			var _success = _form.find('.message').eq(0).hasClass('message--type-success');
			GM_log('Gesendet: ' + _success);
			if(_success) {
				$('#template-modal .modalWin').html('').removeClass('modalWin');
				$(document.body).removeClass('modal--active');
				createMessageWindow('Nachricht verschickt!', 'success');
			} else {
				saveRestorePN(_pnUser, _thread_id, true);
			}
		}
	}

	function grabQuote() {
		var _quoteLink = $(this);
		var _params = JSON.parse(_quoteLink.attr('data-comment-quote'));
		$.ajax({
			method: 'POST',
			url: 'http://www.mydealz.de/comment?raw=1',
			contentType: 'application/x-www-form-urlencoded',
			accept: 'application/json, text/javascript, */*',
			data: 'comment_id=' + _params.commentId + '&thread_id=' + _params.threadId,
			dataType: 'json'
		}).done(function (_rdata) {
			if(typeof _rdata == 'object' && 'data' in _rdata && typeof _rdata.data == 'object' && 'comment_id' in _rdata.data) {
				var _comment = '[quote=' + _params.username + ']' + _rdata.data.content.replace(/\<br \/\>\[edit_reasons\][^]+\[\/edit_reasons\]/m, '') + '[/quote]';
				/* Zeilenwechsel entfernen */
				_comment = _comment.replace(/^\s+$/g, '');
				while(/\n\r?\n/m.test(_comment)) {
					_comment = _comment.replace(/\n\r?\n/m,"\n");
				}
				/* mehrfache Leerzeichen */
				while(/(\S)[^\S\r\n]{2,}(\S)/.test(_comment)) {
					_comment = _comment.replace(/(\S)[^\S\r\n]{2,}(\S)/g,"$1 $2");
				}
				/* einzelne Leerzeichen nach BBCode */
				_comment = _comment.replace(/quote(=([a-zA-Z0-9]+)?)?\]\s/g,"quote$1]");           
				/* einzelne Leerzeichen vor BBCode */
				_comment = _comment.replace(/\s\[(\/)?quote/g,"[$1quote");
				/* Leerzeichen an Anfang und Ende des Strings */
				_comment = $.trim(_comment);
				_comment = maxQuotes(_comment);
				$('#commentForm-content').insertAtCaret(_comment);
			}
		});
	}

	function maxQuotes(_quoteContent) {
		var _quoteStartPattern = /\[quote(=[0-9a-zA-Z_]+)?\]/g;
		var _quoteEndPattern = /\[\/quote\]/g;
		var _quoteStarts = _quoteContent.match(_quoteStartPattern);
		var _quoteEnds = _quoteContent.match(_quoteEndPattern);
		var _quoteStartCount = 0;
		var _quoteEndCount = 0;

		if (_quoteStarts && _quoteEnds)	{
			_quoteStartCount = _quoteStarts.length;
			_quoteEndCount = _quoteEnds.length;
		}

		if (_quoteStartCount != _quoteEndCount) {
			alert("BBCodes fuer Zitate nicht eindeutig.");
			return _quoteContent;
		}

		/* maximale Ebenen  */
		/* mit 0 beginnend */
		var _maxQuoteLevel = settings.comments.maxQuoteLevel;
		if (_quoteStartCount <= _maxQuoteLevel) {
			return _quoteContent;
		}

		var _startPos = new Array();
		var _endPos = new Array();  	
		var _positions = Array();
		for (var _i = 0; _i < _quoteStartCount; _i++) {
			_positions.push({pos: _quoteContent.indexOf(_quoteStarts[_i], _startPos[_i-1] + 1), type: 'start', match: _quoteStarts[_i]});
			_startPos[_i] = _quoteContent.indexOf(_quoteStarts[_i], _startPos[_i-1] + 1);
			_positions.push({pos: _quoteContent.indexOf(_quoteEnds[_i], _endPos[_i-1] + 1), type: 'end', match: _quoteEnds[_i]});
			_endPos[_i] = _quoteContent.indexOf(_quoteEnds[_i], _endPos[_i-1] + 1);
		}
		delete _startPos;
		delete _endPos;

		var _curQuoteLevel = 0;
		var _reducedQuote = '';
		var _startSnippet = 0;
		_positions.sort(function (_a, _b) { return _a.pos - _b.pos; });

		for(_i = 0; _i < _positions.length; _i++) {
			if(_positions[_i].type == 'start') {
				if(_curQuoteLevel == _maxQuoteLevel) {
					_reducedQuote += _quoteContent.substring(_startSnippet, _positions[_i].pos);
				}
				_curQuoteLevel++;
			} else {
				_curQuoteLevel--;
				if(_curQuoteLevel == _maxQuoteLevel) {
					_startSnippet = _positions[_i].pos + _positions[_i].match.length;
				}
			}
		}
		_reducedQuote += _quoteContent.substr(_startSnippet);

		return _reducedQuote;
	}

	function addMenuSwitcher(_path) {
		addGlobalStyle('.enhancer-link-menuswitch { color: #ff0000 !important; }');
		_path = filterPath(_path);
		if(!_path) {
			return;
		}

		var _menu = $('.navTrigger2-row .fGrid-last .menu:first');
		if(_menu.length) {
			_menu.on('mouseenter', initMenuSwitch);
			_menu.on('mouseleave', stopMenuSwitch);
		}
	}

	function initMenuSwitch() {
		timer.menuSwitch = window.setTimeout(menuSwitch, 3000);
	}

	function menuSwitch() {
		var _menu = $('.navTrigger2-row .fGrid-last .menu:first');
		_menu.find('li a.nav2Morph-link').addClass('enhancer-link-menuswitch').on('click', savePageChoice);
		_menu.find('li a.nav2Morph-link--selected').addClass('enhancer-link-menuswitch--selected');
	}

	function savePageChoice() {
		var _elem = $(this);
		_path = filterPath(_path);
		if(!_path) {
			return;
		}

		settings.fromTo[_path] = _elem.attr('href').replace(document.location.origin + '/', '');
		saveSettings();
	}

	function stopMenuSwitch() {
		if('menuSwitch' in timer) {
			try {
				window.clearTimeout(timer.menuSwitch);
			} finally {
				delete timer.menuSwitch;
			}
		}
		var _menu = $('.navTrigger2-row .fGrid-last .menu:first');
		_menu.find('.enhancer-link-menuswitch').removeClass('enhancer-link-menuswitch').removeClass('enhancer-link-menuswitch--selected').off('click', savePageChoice);
	}

	function modifyListings() {
		var _elems = $('li.thread');
		if(_elems.length && settings.deals.hide.length) {
			_elems.each(function (_eInd, _eVal) {
				if((new RegExp(settings.deals.hide, 'i')).test($(_eVal).find('.thread-head .section-title-link').text())) {
					$(_eVal).remove();
				}
			});
		}
	}

	function addScrollUpButton() {
		var _newElem = $('<span>').attr('id', 'scrollUpButton').append($('<form>').addClass('tGrid tGrid tGrid--auto').append($('<label>').addClass('tGrid-cell button').html('&uarr;').click(function () {window.scrollTo(0,0); })));
		$(document.body).append(_newElem);
		addGlobalStyle('#scrollUpButton { display: block; position: fixed; left: 1px; bottom: 30px;} #scrollUpButton > form > label { font-size: 20pt;  min-width: 20px; max-width: 40px; width: ' + ($('.page-canvas').length && $('.page-content').length ? Math.floor(($('.page-canvas').width() - $('.page-content').width())/2) + 'px' : '20px') + '; padding: 0px 0px 5px 0px;}');
	}

	function addImageZoom() {
		// Besten Dank an vielleichtmann1 für die Idee
		// Bilder-Vergroesserungs-Button einfuegen
		var _imgs = $('span.imageFrame .imageFrame-image');
		if(_imgs.length) {
			_imgs.each(function (_iInd, _iVal) {
				var _img = $(_iVal);
				var _link = $('<a>').attr('href', _img.attr('src').replace("threads/", "threads/high-res/")).attr('target', '_blank');
				_link.appendTo(_img.parent()).append(_img);
				_link.click(zoomImage);
			});
		}
		var _imgLinks = $('a.imageFrame');
		_imgLinks.click(zoomImage);
	}

	function zoomImage(_evt) {
		_evt.preventDefault();
		_evt.stopPropagation();
		var _link = $(this);
		var _container = $('<div>').attr('style', 'position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 99; background-color: rgba(68,68,68,0.5); white-space: nowrap; text-align: center; margin: 0;').appendTo($(document.body)).append($('<span>').attr('style', 'display: inline-block; height: 100%; vertical-align: middle;')).append($('<img>').attr('src', _link.attr('href')).attr('style', 'vertical-align: middle; max-height: ' + ($(window).height() - 2) + 'px; max-width: ' + ($(window).width() - 2) + 'px; border-radius: 5px; border: 1px solid #ffffff;'));
		_container.click(function () { $(this).remove();});
	}

	function retrieveUserName() {
		try {
			userName = $('.userBar-userCenter-menu .avatar-frame').parent().html().replace(/(\r|\n)/g, '').replace(/^.*\\\/profile\\\/([^\\\<\>]+)\\\/ajax.*$/, '$1');
		} catch (e) {
			if(window.location.href != 'https://www.mydealz.de/login') {
				window.location.href = 'https://www.mydealz.de/login';
			}
		}
	}

	function addGlobalStyle(_css) {
		var _head, _style;
		_head = document.getElementsByTagName('head')[0];
		if (!_head) { return; }
		_style = document.createElement('style');
		_style.type = 'text/css';
		_style.innerHTML = _css;
		_head.appendChild(_style);
	}

	function loadSettings() {
		var _verbose = false;

		var _lSettings = JSON.parse(GM_getValue('settings', '{}'));
		var _sprop;

		// sinnvolleren, rekursiven Parser schreiben
		for (var _prop in defaultSettings) {
			if(_prop in _lSettings) {
				settings[_prop] = _lSettings[_prop];
			} else {
				settings[_prop] = defaultSettings[_prop];
			}

			if(_verbose) {
				GM_log(_prop + ': ' + settings[_prop]);
			}
			for(_sprop in defaultSettings[_prop]) {
				if(typeof _lSettings[_prop] == 'object' && _sprop in _lSettings[_prop]) {
					settings[_prop][_sprop] = _lSettings[_prop][_sprop];
				} else {
					settings[_prop][_sprop] = defaultSettings[_prop][_sprop];
				}
				if(_verbose) {
					GM_log(_prop + '.' + _sprop + ': ' + settings[_prop][_sprop]);
				}
			}
		}
	}

	function addSmiley() {
		var _addButton = $(this);
		var _from = _addButton.parent().find('input[type="text"][name="from"]');
		var _to   = _addButton.parent().find('input[type="text"][name="to"]');

		if(!$.trim($(_from).val()).length) {
			createMessageWindow('Smileyausl&ouml;ser darf nicht leer sein.', 'error');
			return false;
		}

		if(!$.trim($(_to).val()).length) {
			createMessageWindow('Es muss ein Bild-URI angegeben werden.', 'error');
			return false;
		}

		try {
			var _tmpFrom = new RegExp(RegExp.escape(_from.val()), 'g');
			var _exists = false;
			$('#smileysTable tr').each(function (_sInd, _sVal) {
				if($(_sVal).find('td:first').text() == _from.val()) {
					_exists = true;
					return false;
				}
			});
			if(_exists) {
				createMessageWindow('Smiley existiert bereits', 'error');
				return false;
			} else {
				$('#smileysTable').append($('<tr>').append($('<td>').text(_from.val())).append($('<td>').html('&rarr;')).append($('<td>').addClass('smileyExample').append($('<img>').attr('src', _to.val()))).append($('<td>').addClass('smileys_remove').attr('alt', 'Entfernen').text('X').click(removeSmiley)));
				_from.val('');
				_to.val('');
			}
		} catch (e) {
				createMessageWindow('Ungültiger Suchausdruck.' + e, 'error');
				return false;
		}
	}
	
	function removeSmiley() {
		var _removeCell = $(this);
		_removeCell.parent().remove();
	}

	function createMessageWindow(_text, _type, _callback) {
		var _messageList = $('#globalMsg .globalMsg-list');
		$('<li>').addClass('globalMsg-item globalMsg-item--type-success message  message--type-success').html('<li class="globalMsg-item globalMsg-item--type-' + _type + ' message  message--type-' + _type + '"><div class="message-inner mGrid"><span class="globalMsg-icon  globalMsg-icon--type-' + _type + ' mGrid-media centerChild2 ico ico--middle size--all-large"></span><button data-handler="globalMsg-close" class="globalMsg-close fGrid-right space--left-4 ico ico--type-close-' + (_type == 'error' ? 'red' : 'green' )+ '"></button><div class="mGrid-content"><div class="globalMsg-title">' + _text + '</div></div></div></li>').appendTo(_messageList);
		window.setTimeout(function () {
			try {
				if(_callback != null) {
					_callback();
				}
				_messageList.find('li').remove();
			} catch(e) {
			}
		}, 4000);
	}

	function showOldSmileys() {
		if(settings.oldSmileys.show) {
			$('.bbcode_smiley').each(function (_bbInd, _bbVal) {
				if($(_bbVal).attr('title') in oldSmileys) {
					$(_bbVal).addClass('bbcode_smiley_old').attr('src', oldSmileys[$(_bbVal).attr('title')]);
				}
			});
		}
		addGlobalStyle('.comments-body .bbcode_smiley_old{height: 18px; vertical-align: top;}');
	}

	function embedYoutube() {
		if(!settings.display.embedYoutube) {
			return;
		}

		function _isYoutubeUrl(_url) {
			var _p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
			if(_url.match(_p)) {
				return _url.match(_p)[1];
			}
			return false;
		}

		function _getYoutubeId(_url) {
			var _regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var _match = _url.match(_regExp);

			if (_match && _match[2]) {
				return _match[2];
			} else {
				return 'error';
			}
		}

		$(".bbcode_url").each(function(){
			if(_isYoutubeUrl($(this).attr("href"))) {
				$(this).replaceWith(function() {
					return '<div><iframe width="400" height="200" src="https://www.youtube.com/embed/' + _getYoutubeId( $(this).attr("href") ) + '" frameborder="0" allowfullscreen></iframe></div>'; 
				});
			}
		});
	}
	
	function minimizeQuotes() {
		if(!settings.display.minimizeQuotes) {
			return;
		}

		function _prepQuoteHeader(_root) {
			// BEGIN REQUIRED ONE TIME INIT 
			// hides all quoted content except those without a header
			$(_root).find(".bbcode_quote_head:not(:empty)  ~ .bbcode_quote_body").hide();

			// sets 'pointer' as cursor to indicate, that the element is clickable
			$(_root).find(".bbcode_quote_head:not(:empty)").css("cursor", "pointer").each(function () {
				// END REQUIRED ONE TIME INIT

				var _onlyText = $(this).siblings(".bbcode_quote_body").clone()	//clone the element
					.find('.bbcode_quote')	//select all subquotes
					.remove()	//remove all the children
					.end()	//again go back to selected element
					.text();	//get the text of element
				$(this).append( $( '<span class="comment-quote-preview"> - ' + $.trim(_onlyText.substring(0,80).replace(/[\r\n]/g,'').replace(/\s+/g, ' ')) + ' [...] </span>' ) );
			});
		}

		_prepQuoteHeader(document);

    $(document).on( "click",".bbcode_quote_head", function(){
        // toggles the related content area
        $(this).siblings(".bbcode_quote_body").slideToggle(); 
        $(this).children(".comment-quote-preview").toggle();
    });
    // 
    $(document).on('DOMNodeInserted DOMNodeRemoved',".comments-item", function(_event) {
        if (_event.type == 'DOMNodeInserted') {
            // Here we need to set the same things up, that we setup in the one time init section, 
            // because we get a new set of dom elements 
            if($(this).hasClass("comments-item") && !$(this).find('.comment-quote-preview').length){
							_prepQuoteHeader(this);
            }
            
        }
    });
	}

	function showUserInfo() {
		if(!settings.display.userInfo) {
			return;
		}
		var _userProfileArray = [];

		$(".avatar-link").each(function(){ 
			var _username = $(this).text().trim();
			var _endpoint = $(this).attr("href") + "?user_details=1";

			var _possibleUserInfoElId = "#" + _username + "-md-userinfo"; // may be relevant in next releases
			// var _possibleUserInfoEl = $(_possibleUserInfoElId);

			if(jQuery.inArray( _username, _userProfileArray ) === -1) {
				_userProfileArray.push(_username);
				$.ajax({
					url: _endpoint,
					type: "GET",
					dataType: "json",
					success: function (_data) {

						var _tmpEl = $('<div />', {id:_possibleUserInfoElId}).append( _data.data.content );//;

						/*
						var _imgAvatarElement = _tmpEl.find("img.avatar-image");
						var _imgAvatarSrc = _imgAvatarElement.attr("src");
						*/

						$('.avatar-image--comment[data-popover*="'+_username+'"]').each(function(){
							var _onlineStatus = _tmpEl.find(".profile-name").siblings("span").clone().css({"display" : "inline", "text-align" : "center", "margin": "2px"});
							var _profileDate = _tmpEl.find(".profile-date").clone().css({"display" : "inline", "text-align" : "right", "margin": "2px"});

							var _profileStateUl = $("<ul />").css({"background":"#f5f6ff","display":"block","margin": "0.2em 2em 1.42857em 10em","padding" : "2px"});

							var _liCss = {"margin":"3px 5px","display":"inline-block"};

							var _nrOfComments = _tmpEl.find(".profile-stat-item:contains('Kommentare')").clone().css(_liCss);
							var _nrOfActiveDeals = _tmpEl.find(".profile-stat-item:contains('Aktive Deals')").clone().css(_liCss);
							var _nrOfSubscriptions = _tmpEl.find(".profile-stat-item:contains('Abonnements')").clone().css(_liCss);
							var _nrOfPostedDeals = _tmpEl.find(".profile-stat-item:contains('Gemeldete Deals')").clone().css(_liCss);

							var _liUsername = $("<li />").text(_username + " ist ").css(_liCss);
							var _liOnlineStatus = $("<li />").append(_onlineStatus).css(_liCss);
							var _liProfileDate = $("<li />").append(_profileDate).css(_liCss);

							_profileStateUl.append(_liUsername).append(_liOnlineStatus).append(_liProfileDate).append(_nrOfComments).append(_nrOfActiveDeals).append(_nrOfSubscriptions).append(_nrOfPostedDeals);

							var _profileStateLi = $("<li />").append(_profileStateUl).addClass("comments-item comments-item--active section--padded--narrow").css({"margin":"0","padding":"0"});

							$("li.section--divided").css( "border-bottom","none" );
							$(this).closest(".comments-item").after(_profileStateLi);

						});

					}
				});
			}
		});
	}

	function dealTextPreview() {
		if(settings.display.dealPreview <= 0) {
			return;
		}
		$(".thread-body div.section-sub:not(:contains('Weiterlesen'))").each(function(){
			if($(this).height() < settings.display.dealPreview) {
				return;
			}
			var _dealDescTogglerElement = $('<div class="deal-desc-toggler">Mehr</div>');
			_dealDescTogglerElement.addClass("link");

			$(this).css({
				"max-height": $(this).height() + "px",
				"height": settings.display.dealPreview + "px",
				"overflow" : "hidden"
			}).addClass("toggled").after(_dealDescTogglerElement);
		});
    $(document).on("click", ".deal-desc-toggler", function() {
			var _dealDescription = $(this).siblings(".thread-body .section-sub");

			if(_dealDescription.hasClass("toggled")) {
				_dealDescription.removeClass("toggled").animate({"height": _dealDescription.css("max-height")});
				$(this).text("Weniger");
			} else {
				_dealDescription.addClass("toggled").animate({"height": settings.display.dealPreview + "px"});
				$(this).text("Mehr");
			}
		});
	}

	function modifySearch() {

		function openGoogle(_source) {
			window.open('https://www.google.de/#q=site:mydealz.de+' + encodeURIComponent(_source.siblings("input.search-input").val()) , '_blank');
		}

		var gSearchElement = $('<a class="search-button search-logo-google" style="right: 1.7em;cursor: pointer;">'+
			'<img src="https://www.google.de/images/branding/product/ico/googleg_lodp.ico" style="height: 20px;">'+
			'</a>');

		gSearchElement.click(function () { openGoogle($(this)); });
		var _presetCat = searchCategories.all;
		for(var _cInd in searchCategories) {
			if(searchCategories[_cInd].id == settings.search.presetCategory) {
				_presetCat = searchCategories[_cInd];
				break;
			}
		}
		var _curCat = document.location.pathname.replace(/^\/([a-z]+).*$/, '$1');
		_curCat = (_curCat in searchCategories) ? searchCategories[_curCat] : searchCategories.all;

		$("input.search-input").attr('title', "Shift+Enter => " + _presetCat.category + "-Suche\nStrg+Enter => " + _curCat.category + "-Suche (aktuelle Kategorie)\nAlt+Enter => Google-Suche").after(gSearchElement);

		$(document).on('keydown', 'form.search', function (_event) {
			if(_event.keyCode == 13) {
				if(_event.shiftKey && !_event.ctrlKey && !_event.altKey) {
					$(this).append('<input type="hidden" name="type" value="' + _presetCat.id + '">');
				} else if(!_event.shiftKey && _event.ctrlKey && !_event.altKey) {
					$(this).append('<input type="hidden" name="type" value="' + _curCat.id + '">');
				} else if(!_event.shiftKey && !_event.ctrlKey && _event.altKey) {
					openGoogle($(this).find('a.search-logo-google'));
					_event.preventDefault();
				}
			}
		});
	}

	function backToAnchor() {
		$(document).ajaxStop(function(){
			if(window.location.hash.length && window.location.hash != '#mydealz-enhancer') {
				// Seite wurde modifiziert, Ankerpunkt verschoben, erneut zum Anker springen
				window.location.href = window.location;
				$(this).unbind("ajaxStop");
			}
		});
	}

	function addSetupLink() {
		var _newMenu = $('<li>').addClass('hide--downThrough-').attr('id', 'mydealz-enhancer-setup--link').append($('<a>').addClass('navMenu1-item').attr('href','#mydealz-enhancer').html('MyDealz-Enhancer')).appendTo($('.navMenu--width-l').eq(0));
		_newMenu.find('a').click(showSetup);
	}

	function saveSettings() {
		GM_setValue('settings', JSON.stringify(settings));
	}

	function showSetup() {
		document.title = 'MyDealz-Enhancer Einstellungen';
		$('strong[data-handler="menu"]').parent().parent().removeClass('menu--active');
		$('.navTrigger1--selected, .navMenu1-item--selected').removeClass('navTrigger1--selected navMenu1-item--selected');
		$('#mydealz-enhancer-setup--link').addClass('navMenu1-item--selected');
		$('.navTrigger2-row').remove();
		$('.page-canvas > section').eq(0).remove();
		$('div.page-canvas:first > div.page-content').html('<div id="main"></div>');
		$('#main').html('').attr('class', 'content-main content-background').html('<ul class="breadcrumb section--padded--tight"><li class="breadcrumb-item size--all-xSmall size--xxSmall-small" itemtype="http://data-vocabulary.org/Breadcrumb" itemscope="itemscope" itemprop="child"><a class="breadcrumb-link link" href="/" itemprop="url">Home</a><ul class="breadcrumb-list "><li class="breadcrumb-item size--all-xSmall size--xxSmall-small" itemtype="http://data-vocabulary.org/Breadcrumb" itemscope="itemscope" itemprop="child"><span class="breadcrumb-current">Bearbeite Deine MyDealz-Enhancer Einstellungen</span></li></ul></li></ul><form class="form"><div class="section section--padded"><h1 class="section-title">Bearbeite Deine MyDealz-Enhancer Einstellungen</h1></div></form>');
		var _sections = $('#main .section--padded');
		var _form = $('#main form.form');
		_form.submit(submitSettings);
		addGlobalStyle('#smileysTable { border: none;} #smileysTable tr>td:first { text-align: right } #smileysTable tr td { padding: 3px; padding-left: 5px; padding-right: 5px; } .smileys_remove { font-family: Verdana; font-weight: bold; color: #800000; font-size: 10pt; cursor: pointer; cursor: hand; }');

		var _section;
		// _section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Info und Diskussionsthread</h2><ul class="form-list"><li class="form-list-row"><label class="form-list-label" for="dealsForm-deals_hide"> Ausblenden </label><div class="form-list-content"><input id="dealsForm-deals_hide" class="input" type="text"	name="hide" title="Angabe als reg. Ausdruck."></div></li></ul>');
		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Info und Diskussionsthread</h2><ul class="form-list"><li class="form-list-row"><label class="form-list-label"></label><div class="form-list-content">Informationen und Verbesserungsvorschl&auml;ge im <a href="http://www.mydealz.de/diverses/mydealz-enhancer-userscript-573012" class="link">MyDealz-Enhancer-Thread</a>.</div></li><li class="form-list-row"><label class="form-list-label" style="padding-top: 0;"> Autor </label><div class="form-list-content"><a href="' + window.location.protocol + '//www.mydealz.de/profile/BAERnado" class="link">BAERnado</a></div></li><li class="form-list-row"><label class="form-list-label" style="padding-top: 0;"> Contributors </label><div class="form-list-content"><a href="' + window.location.protocol + '//www.mydealz.de/profile/lolnickname" class="link">lolnickname</a><br /><a href="' + window.location.protocol + '//www.mydealz.de/profile/Nico" class="link">Nico</a><br /><a href="' + window.location.protocol + '//www.mydealz.de/profile/richi2k" class="link">richi2k</a><br /></div></li></ul>');
		_section.appendTo(_sections);

		if(typeof GM_info === 'object') {
			_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Enhancer Version</h2><ul class="form-list"><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"> ' + GM_info.script.version + '</div></li></ul>');
			_section.appendTo(_sections);
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Enhancer Verhalten</h2><ul class="form-list"><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text" title="Ein roter Rahmen wird im Fehlerfall immer angezeigt."><input id="behaviorForm-behavior_showGreenDots" type="checkbox" name="behavior_showGreenDots"> Zeige gr&uuml;nen Rahmen um Avatar</label></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.behavior) {
			if(settings.behavior[_sInd]) {
				_section.find('#behaviorForm-behavior_' + _sInd).prop('checked', 'checked').attr('checked', 'checked');
			} else {
				_section.find('#behaviorForm-behavior_' + _sInd).prop('checked', false).removeAttr('checked');
			}
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Werbung ausblenden</h2><ul class="form-list"><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="adForm-hideAds_topBar" type="checkbox" name="hideAds_topBar"> Top-Bar (Gutscheinsammler, Urlaubspiraten, …)</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="adForm-hideAds_nlSection" type="checkbox" name="hideAds_nlSection"> Newsletter</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="adForm-hideAds_inside" type="checkbox" name="hideAds_inside"> MyDealz Inside Banner</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="adForm-hideAds_gsWidget" type="checkbox" name="hideAds_gsWidget"> Gutschein-Widget</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="adForm-hideAds_app" type="checkbox" name="hideAds_app"> MyDealz-App</label></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.hideAds) {
			if(settings.hideAds[_sInd]) {
				_section.find('#adForm-hideAds_' + _sInd).prop('checked', 'checked').attr('checked', 'checked');
			} else {
				_section.find('#adForm-hideAds_' + _sInd).prop('checked', false).removeAttr('checked');
			}
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Buttons im Hauptmenu</h2><ul class="form-list"><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons__" type="checkbox" name="moveButtons__"> Alles</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons_deals" type="checkbox" name="moveButtons_deals"> Deals</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons_gutscheine" type="checkbox" name="moveButtons_gutscheine"> Gutscheine</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons_freebies" type="checkbox" name="moveButtons_freebies"> Freebies</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons_custom" type="checkbox" name="moveButtons_custom"> MyTab</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons_gesuche" type="checkbox" name="moveButtons_gesuche"> Gesuche</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="buttonForm-moveButtons_diverses" type="checkbox" name="moveButtons_diverses"> Diverses</label></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.moveButtons) {
			if(settings.moveButtons[_sInd]) {
				_section.find('#buttonForm-moveButtons_' + _sInd).prop('checked', 'checked').attr('checked', 'checked');
			} else {
				_section.find('#buttonForm-moveButtons_' + _sInd).prop('checked', false).removeAttr('checked');
			}
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">UserMenu Direktlinks</h2><ul class="form-list"><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="userMenuForm-direct_pn" type="checkbox" name="direct_pn"> Private Nachrichten</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="userMenuForm-direct_account" type="checkbox" name="direct_account"> Account</label></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.userMenuDirect) {
			if(settings.userMenuDirect[_sInd]) {
				_section.find('#userMenuForm-direct_' + _sInd).prop('checked', 'checked').attr('checked', 'checked');
			} else {
				_section.find('#userMenuForm-direct_' + _sInd).prop('checked', false).removeAttr('checked');
			}
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Deals/Gutscheine/…</h2><ul class="form-list"><li class="form-list-row"><label class="form-list-label" for="dealsForm-deals_hide"> Ausblenden </label><div class="form-list-content"><input id="dealsForm-deals_hide" class="input" type="text"	name="hide" title="Angabe als reg. Ausdruck."></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.deals) {
			_section.find('#dealsForm-deals_' + _sInd).val(settings.deals[_sInd]).attr('value', settings.deals[_sInd]);
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Inhalte anzeigen</h2><ul class="form-list"><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="displayForm-display_embedYoutube" type="checkbox" name="display_embedYoutube"> YouTube-Videos direkt einbinden</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="displayForm-display_minimizeQuotes" type="checkbox" name="display_minimizeQuotes"> Quotes einklappen (ausklappen mit Klick)</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="displayForm-display_userInfo" type="checkbox" name="display_userInfo"> User Infos</label></div></li><li class="form-list-row"><label class="form-list-label" for="displayForm-display_dealPreview"> Dealtext-Previewhöhe in Pixel </label><div class="form-list-content"><input id="displayForm-display_dealPreview" class="input" type="number" min="0"	required="" title="0 deaktiviert Previews" name="display_dealPreview"></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.display) {
			switch(typeof settings.display[_sInd]) {
				case 'boolean':
					if(settings.display[_sInd]) {
						_section.find('#displayForm-display_' + _sInd).prop('checked', 'checked').attr('checked', 'checked');
					} else {
						_section.find('#displayForm-display_' + _sInd).prop('checked', false).removeAttr('checked');
					}
					break;
				case 'number':
				case 'string':
					_section.find('#displayForm-display_' + _sInd).val(settings.display[_sInd]).attr('value', settings.display[_sInd]);
			}
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Suche</h2><ul class="form-list"><li class="form-list-row"><label class="form-list-label" for="searchForm-search_presetCategory"> voreingestellte Kategorie </label><div class="form-list-content"><select id="searchForm-search_presetCategory" class="input" name="search_presetCategory"></select></div></li></ul>');
		_section.appendTo(_sections);
		_section.find('select').each(function () {
			var _sInd = $(this).attr('name').replace(/^search_/, '');
			if(_sInd == 'presetCategory') {
				for(var _cInd in searchCategories) {
					$(this).append($('<option/>').text(searchCategories[_cInd].category).val(searchCategories[_cInd].id));
				}
			}
		});
		for(var _sInd in settings.search) {
			switch(typeof settings.search[_sInd]) {
				case 'boolean':
					if(settings.search[_sInd]) {
						_section.find('#searchForm-search_' + _sInd).prop('checked', 'checked').attr('checked', 'checked');
					} else {
						_section.find('#searchForm-search_' + _sInd).prop('checked', false).removeAttr('checked');
					}
					break;
				case 'number':
				case 'string':
					_section.find('#searchForm-search_' + _sInd).val(settings.search[_sInd]).attr('value', settings.search[_sInd]);
			}
		}

		_section = $('<section>').addClass('section-sub').html('<h2 class="section-subTitle">Kommentieren</h2><ul class="form-list"><li class="form-list-row"><label class="form-list-label" for="commentForm-comments_maxQuoteLevel"> Zitattiefe </label><div class="form-list-content"><input id="commentForm-comments_maxQuoteLevel" class="input" type="number" min="1"	required="" name="maxQuoteLevel"></div></li><li class="form-list-row"><label class="form-list-label" for="commentForm-comments_editReason"> Grund der &Auml;nderung </label><div class="form-list-content"><input id="commentForm-comments_editReason" class="input" type="text" name="editReason"></div></li>' + (settings.comments.useSignature ? '<li class="form-list-row"><label class="form-list-label" for="commentForm-comments_signature"> Signatur </label><div class="form-list-content"><textarea id="commentForm-comments_signature" class="input" type="text" name="signature" style="resize: none"></textarea></div></li>' : '') + '<li class="form-list-row"><label class="form-list-label" for="commentForm-smileys_from"> Smileys </label><div class="form-list-content"><input id="commentForm-smileys_from" class="input" type="text" name="from" /> &rarr; <input id="commentForm-smileys_to" class="input" type="text" name="to" /> <input id="commentForm-smileys_add" type="button" class="button" value="Hinzuf&uuml;gen" /><br /><table id="smileysTable"></table></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="commentForm-oldSmileys_use" type="checkbox" name="oldSmileys_use"> Verwende alte Smileys beim Schreiben</label></div></li><li class="form-list-row"><span class="form-list-label"></span><div class="form-list-content"><label class="form-text"><input id="commentForm-oldSmileys_show" type="checkbox" name="oldSmileys_show"> Zeige alte Smileys </label></div></li></ul>');
		_section.appendTo(_sections);
		for(var _sInd in settings.comments) {
			if(_section.find('#commentForm-comments_' + _sInd).length) {
				switch(typeof settings.comments[_sInd]) {
					case 'boolean':
						if(settings.comments[_sInd]) {
							_section.find('#commentForm-comments_' + _sInd).prop('checked', 'checked').attr('checked');
						} else {
							_section.find('#commentForm-comments_' + _sInd).prop('checked', false).removeAttr('checked');
						}
					default:
						_section.find('#commentForm-comments_' + _sInd).val(settings.comments[_sInd]).attr('value', settings.comments[_sInd]);
						break;
				}
			}
		}
		for(var _sInd in settings.oldSmileys) {
			if(_section.find('#commentForm-oldSmileys_' + _sInd).length) {
				switch(typeof settings.oldSmileys[_sInd]) {
					case 'boolean':
						if(settings.oldSmileys[_sInd]) {
							_section.find('#commentForm-oldSmileys_' + _sInd).prop('checked', 'checked').attr('checked');
						} else {
							_section.find('#commentForm-oldSmileys_' + _sInd).prop('checked', false).removeAttr('checked');
						}
					default:
						_section.find('#commentForm-oldSmileys_' + _sInd).val(settings.oldSmileys[_sInd]).attr('value', settings.oldSmileys[_sInd]);
						break;
				}
			}
		}
		
		for(_sInd in settings.smileys) {
			$('#smileysTable').append($('<tr>').append($('<td>').text(_sInd)).append($('<td>').html('&rarr;')).append($('<td>').addClass('smileyExample').append($('<img>').attr('src',settings.smileys[_sInd]))).append($('<td>').addClass('smileys_remove').text('X').click(removeSmiley)));
		}
		
		$('#commentForm-smileys_add').click(addSmiley);

		_section.find('ul').append($('<li>').addClass('form-list-row').html('<span class="form-list-label"></span><div class="form-list-content"><input class="button button--type-primary" type="submit" name="save_privacy_options" value="Speichern"><input class="link form-cancel" type="reset" value="Zurücksetzen"></div>'));
	}
	
	function submitSettings(_evt) {
		_evt.preventDefault();
		_evt.stopPropagation();

		var _errMessage = '';

		var _allOK = true;
		for(var _sInd in settings.behavior) {
			try {
				settings.behavior[_sInd] = $('#behaviorForm-behavior_' + _sInd).prop('checked');
			} catch(e) {
				_allOK = false;
			}
		}

		for(var _sInd in settings.hideAds) {
			try {
				settings.hideAds[_sInd] = $('#adForm-hideAds_' + _sInd).prop('checked');
			} catch(e) {
				_allOK = false;
			}
		}

		for(var _sInd in settings.moveButtons) {
			try {
				settings.moveButtons[_sInd] = $('#buttonForm-moveButtons_' + _sInd).prop('checked');
			} catch(e) {
				_allOK = false;
			}
		}

		for(var _sInd in settings.userMenuDirect) {
			try {
				settings.userMenuDirect[_sInd] = $('#userMenuForm-direct_' + _sInd).prop('checked');
			} catch(e) {
				_allOK = false;
			}
		}

		for(var _sInd in settings.deals) {
			if(_sInd == 'hide') {
				try {
					new RegExp($('#dealsForm-deals_' + _sInd).val());
				} catch (e) {
					_errMessage += e + '<br />';
					_allOK = false;
				}
			}
			try {
				settings.deals[_sInd] = ($('#dealsForm-deals_' + _sInd).attr('type') == 'number' ? parseInt($('#dealsForm-deals_' + _sInd).val(), 10) : $('#dealsForm-deals_' + _sInd).val());
			} catch(e) {
				_allOK = false;
			}
		}

		for(var _sInd in settings.display) {
			if($('#displayForm-display_' + _sInd).length) {
				try {
					switch(typeof settings.display[_sInd]) {
						case 'boolean':
							settings.display[_sInd] = $('#displayForm-display_' + _sInd).prop('checked');
							break;
						case 'number':
							settings.display[_sInd] = parseInt($('#displayForm-display_' + _sInd).val(), 10);
							break;
						default:
							settings.display[_sInd] = $('#displayForm-display_' + _sInd).val();
							break;
					}
				} catch(e) {
					_allOK = false;
				}
			}
		}

		for(var _sInd in settings.search) {
			if($('#searchForm-search_' + _sInd).length) {
				try {
					switch(typeof settings.search[_sInd]) {
						case 'boolean':
							settings.search[_sInd] = $('#searchForm-search_' + _sInd).prop('checked');
							break;
						case 'number':
							settings.search[_sInd] = parseInt($('#searchForm-search_' + _sInd).val(), 10);
							break;
						default:
							settings.search[_sInd] = $('#searchForm-search_' + _sInd).val();
							break;
					}
				} catch(e) {
					_allOK = false;
				}
			}
		}

		for(var _sInd in settings.comments) {
			if($('#commentForm-comments_' + _sInd).length) {
				try {
					settings.comments[_sInd] = ($('#commentForm-comments_' + _sInd).attr('type') == 'number' ? parseInt($('#commentForm-comments_' + _sInd).val(), 10) : $('#commentForm-comments_' + _sInd).val());
				} catch(e) {
					_allOK = false;
				}
			}
		}
		
		settings.smileys = {};
		$('#smileysTable tr').each(function (_sInd, _sVal) {
			settings.smileys[$(_sVal).find('td').eq(0).text()] = $(_sVal).find('td').eq(2).find('img').attr('src');
		});
		for(var _sInd in settings.oldSmileys) {
			try {
				settings.oldSmileys[_sInd] = $('#commentForm-oldSmileys_' + _sInd).prop('checked');
			} catch(e) {
				_allOK = false;
			}
		}

		if(_allOK) {
			saveSettings();
			createMessageWindow('Deine Einstellungen wurden gespeichert.<br />Weiterleitung zur urspr&uuml;nglichen Seite...', 'success', function () { window.location.href = window.location.href.replace(/#mydealz-enhancer/,''); });
		} else {
			createMessageWindow('Ein Fehler trat beim Speichern auf.' + (_errMessage.length ? '<br />' + _errMessage : ''), 'error');
		}
	}

	function init() {
		var _noError = true;
		if(window != window.top) {
			// Momentaner Workaround
			// Ansonsten werden alle nachgeladenen Elemente auch bearbeitet
			return;
		}
		try {
			var _path = document.location.pathname.replace(/^\/([^\?]+).*$/, '$1');
			if(/^(visit|image)/.test(_path) || /^JavaScript Shell/.test(document.title)) {
				return;
			}
			retrieveUserName();
			loadSettings();
			addMenuSwitcher(filterPath());
			remodelNavBar();
			removeAds();
			// addCyberDealz();
			modifySearch();
			addSetupLink();
			changeLinks();

			if(document.location.hash == '#mydealz-enhancer') {
				showSetup();
			}
			switch(_path) {
				case 'cyber-monday/cyberdeals':
					addTimes();
				case 'profile/' + userName + '/messages':
					markPnRead();
			}

			modifyListings();
			addScrollUpButton();
			addImageZoom();
			insertDirectLink();
			addFeedbackButtons();
			addFuncLinks();
			modifyComments();
			showOldSmileys();
			dealTextPreview();
			showUserInfo();
			embedYoutube();
			minimizeQuotes();
			backToAnchor();
		} catch (e) {
			alert(e);
			_noError = false;
		}

		if(_noError) {
			if(settings.behavior.showGreenDots) {
				$('.userBar-link .avatar-image').css('border', '1px dotted #00ff00');
			}
		} else {
			$('.userBar-link .avatar-image').css('border', '1px dotted #aa0000');
		}
	}

	init();
}

// Erst laden, wenn DOM fertig ist
if(document.readyState == 'interactive') {
	ModifyPage();
} else {
	$(document).ready(ModifyPage);
}