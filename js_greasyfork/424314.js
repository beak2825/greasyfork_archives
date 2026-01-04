// ==UserScript==
// @name        Overflow extended blog
// @namespace   https://github.com/XelaNimed
// @version     1.1
// @description Redirecting from localized versions of the site to an English-language domain with a search for the current question.
// @author      XelaNimed
// @copyright   2021, XelaNimed (https://github.com/XelaNimed)
// @match       https://*.stackoverflow.com/*
// @match       https://*.meta.stackoverflow.com/*
// @grant       none
// @homepageURL https://raw.githubusercontent.com/XelaNimed/ruSO
// @supportURL  https://github.com/XelaNimed/ruSO/issues
// @iconURL     https://raw.githubusercontent.com/XelaNimed/ruSO/master/stackoverflow.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/424314/Overflow%20extended%20blog.user.js
// @updateURL https://update.greasyfork.org/scripts/424314/Overflow%20extended%20blog.meta.js
// ==/UserScript==
const $ = window.jQuery;
 
window.addEventListener('load', function () {
	ruSO
	.initLocalStorage()
	.addButtons()
    .addAuthorQuestionsLinks();
}, false);
 
var ruSO = {
	$sidebar: $('#sidebar'),
	$content: $('#content'),
	$container: $('body>.container'),
    $fullWidthBtn: null,
	params: {
		animationSpeed: 250
	},
	keys: {
		showMetasKey: 'showMetaPosts',
        contentMaxWidth: 'contentMaxWidth',
        containerMaxWidth: 'containerMaxWidth',
        fooFullWidth: 'fooFullWidth'
	},
	strings: {
		watchedTagsText: 'Отслеживаемые метки',
		clickToToggle: 'Скрыть/показать',
		setFullWidth: 'Растянуть',
		resetFullWidth: 'Восстановить'
	},
	initLocalStorage: function initLocalStorage() {
		localStorage[this.keys.showMetasKey] || localStorage.setItem(this.keys.showMetasKey, true);
        localStorage[this.keys.containerMaxWidth] = this.$container.css('max-width');
        localStorage[this.keys.contentMaxWidth] = this.$content.css('max-width');
        localStorage[this.keys.fooFullWidth] = 'setFullWidth';
		return this;
	},
	addButtons: function () {
		var self = this,
		addWatchedTags = function () {
			let tags = [],
			urlPrefix = window.location.origin + '/questions/tagged/';
			$('.js-watched-tag-list a.user-tag').each(function (idx, itm) {
				let url = itm.href;
				tags.push(url.substring(url.lastIndexOf('/') + 1));
			});
			if (tags.length) {
				let url = urlPrefix + tags.join('+or+');
				let spanArr = self.$sidebar.find("span:contains('" + self.strings.watchedTagsText + "')");
				self.$sidebar.find('span.grid--cell.mr4').hide();
				if (spanArr.length > 0) {
					spanArr[0].innerHTML = '<a class="post-tag user-tag" href="' + url + '">' + self.strings.watchedTagsText + '</a>';
				}
			}
		},
		addMetaToggles = function () {
			let showHideMetas = function ($elem) {
				let isVisible = localStorage.getItem(self.keys.showMetasKey) === 'true';
				$elem.parent().children('li')[isVisible ? 'show' : 'hide'](ruSO.params.animationSpeed);
			};
			self.$sidebar
			.find('div.s-sidebarwidget:first div.s-sidebarwidget--header, #how-to-format, #how-to-title')
			.each(function (idx, itm) {
				let $itm = $(itm);
				$itm
				.attr('title', ruSO.strings.clickToToggle)
				.css('cursor', 'pointer')
				.on('click', function (e) {
					let isVisible = localStorage.getItem(self.keys.showMetasKey) === 'true';
					localStorage.setItem(self.keys.showMetasKey, !isVisible);
					showHideMetas($(e.target));
				});
				showHideMetas($itm);
			});
		},
        addFullWidth = function() {
            let $header = $('#question-header');
            self.$fullWidthBtn = $header.find('div').clone();
            self.$fullWidthBtn.attr('id', 'set-full-width-btn').find('a')
            .removeClass('s-btn__primary')
            .addClass('s-btn__filled')
            .attr('href', '#')
            .text(self.strings.setFullWidth)
            .on('click', function() {
                self[localStorage[self.keys.fooFullWidth]]();
            });
            $header.append(self.$fullWidthBtn);
        },
        addRedirectToSO = function(){
                let localPrefix = "ru.";
                let isLocalSO = location.host.substr(0,3) === localPrefix;
                let btnText = isLocalSO ? "en" : "ru";
                let $btn = $(`<div class="print:d-none"><a href="#" class="s-btn s-btn__filled s-btn__xs s-btn__icon ws-nowrap">${btnText}</a></div>`);
                $btn.insertAfter($("#search"));
                $btn.on('click', function() {
                    location.host = isLocalSO
                        ? location.host.substr(localPrefix.length)
                        : localPrefix + location.host;
                });
            };
        addWatchedTags();
	    addMetaToggles();
        addFullWidth();
        addRedirectToSO();
		return this;
	},
    addAuthorQuestionsLinks: function(){
        let $userDetails = $('div.owner > div.user-info > div.user-details');
        if($userDetails.length > 0){
            let $postTags = $('div.post-taglist').find('a.post-tag');
            let tags = [];
            for(let i = 0; i < $postTags.length; i++){
                tags.push('[' + $postTags[i].href.split('/').slice(-1).pop() + ']');
            }
            let tagsUrl = tags.join('+or+');
            for(let i = 0; i < $userDetails.length; i++){
                let $userDetail = $($userDetails[i]);
                let $userUrl = $userDetail.find('a');
                let userName = $userUrl.text();
                let userId = $userUrl[0].href.split('/')[4];
                let baseSearhcUrl = 'https://ru.stackoverflow.com/search?tab=newest&q=user%3A' + userId + '+is%3Aq';
                let elem = '<span>? <a href="' + baseSearhcUrl + '" title="Все вопросы ' + userName + '">все</a>';
                if(tags.length > 0){
                    elem += ', <a href="' + baseSearhcUrl + '+' + tagsUrl+ '" title="Вопросы ' + userName + ' с метками текущего вопроса">с такими-же метками</a>';
                }
                elem += '</span>';
                $(elem).insertAfter($userDetail);
            }
        }
        return this;
    },
    setFullWidth: function() {
        this.$container.add(this.$content).css({'max-width':'none'});
        this.$fullWidthBtn.find('a').text(this.strings.resetFullWidth);
        localStorage[this.keys.fooFullWidth] = 'resetFullWidth';
        return this;
    },
    resetFullWidth: function() {
        this.$container.css({'max-width': localStorage[this.keys.containerMaxWidth]});
        this.$content.css({'max-width': localStorage[this.keys.contentMaxWidth]});
        this.$fullWidthBtn.find('a').text(this.strings.setFullWidth);
        localStorage[this.keys.fooFullWidth] = 'setFullWidth';
        return this;
    }
};