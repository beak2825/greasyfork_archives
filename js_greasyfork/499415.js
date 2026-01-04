// ==UserScript==
// @name         LZTlastPostPreview
// @namespace    MeloniuM/LZT
// @version      1.0
// @description  Предпросмотр последнего поста в теме
// @author       MeloniuM
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499415/LZTlastPostPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/499415/LZTlastPostPreview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function is_scrolling() {
		return window.lastScrollTime && Date.now() < window.lastScrollTime + 500
	}

    XenForo.lastPostInfoPreview = function($el){
        var previewUrl;

		if (!parseInt(XenForo._enableOverlays)) {
			return;
		}

		if (!(previewUrl = $el.attr('href'))) {
			console.warn('Preview tooltip has no preview: %o', $el);
			return;
		}

		$el.find('[title]').andSelf().attr('title', '');
		var loaded = false;

		tippy($el.get(), {
			touch: false,
			interactive: false,
			arrow: true,
			theme: 'popup PreviewTooltip',
			animation: 'shift-toward',
			distance: 5,
			appendTo: $el[0] || document.body,
			delay: [300, 0],
			maxWidth: 400,
			placement: 'top-start',
			flipOnUpdate: true,
			content: '',
			popperOptions: {
				modifiers: {
					computeStyle: {
						gpuAcceleration: false
					}
				}
			},
			onShow(instance) {

				if (is_scrolling()) {
					clearTimeout(XenForo._ShowPreviewTimeout);
					XenForo._ShowPreviewTimeout = setTimeout(function () {
						console.log('check scroll', is_scrolling());
						if (!is_scrolling()) {
							console.log('trigger hover', $el[0]._tippy);
							$el[0]._tippy.show();
						}
					}, 700);

					return false;
				}

				if (XenForo._ActivePreviewTooltip && XenForo._ActivePreviewTooltip !== instance) {
					XenForo._ActivePreviewTooltip.hide();
				}

				if (!loaded) {
					XenForo.ajax(previewUrl + 'translate', {}, function (ajaxData) {
                        let template = `<div class="text"><blockquote class="previewText"></blockquote></div>`
                        loaded = true;
                        var $content = $('#PreviewTooltip').clone();
                        $content.find('.previewContent').html('');
                        $(`<div class="text"><blockquote class="previewText">${$(ajaxData.messagesTemplateHtml[previewUrl.replace('posts/', '#post-').replace('/', '')]).find('.messageContent .messageText').html()}</blockquote></div>`).xfInsert('appendTo', $content.find('.previewContent'), 'fadeIn', 50, function () {
                            instance.setContent($content.html());
                            loaded = true;
                            if ($el.is(':hover')) {
                                instance.show();
                                    XenForo._ActivePreviewTooltip = instance;
                                return true;
                            }
                        });
                        return true;
                    });

					return false;
				}

				return true;
			},
		})
    }
    XenForo.register('a.lastPostInfo', 'XenForo.lastPostInfoPreview');
    $('a.lastPostInfo').each(function(){
        XenForo.lastPostInfoPreview($(this));
    })
})();