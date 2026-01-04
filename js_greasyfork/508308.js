// ==UserScript==
// @name         MinimalisticThreadLOLZ
// @namespace    llimonix/LZT
// @version      1.3
// @description  Удаляет лишнее из списка тем + добавляет нормальный предпросмотр
// @author       llimonix
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://ibb.org.ru/images/2024/09/13/eye.png
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/508308/MinimalisticThreadLOLZ.user.js
// @updateURL https://update.greasyfork.org/scripts/508308/MinimalisticThreadLOLZ.meta.js
// ==/UserScript==

(function() {
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    function waitForXenForo() {
        if (!win.XenForo) {
            setTimeout(waitForXenForo, 50);
            return;
        }

        const XenForo = win.XenForo;

        function minimalisticThread(thread) {
            const $t = $(thread);
            $t.find('.threadLastPost').remove(); // Удалить последний комментарий
            $t.find('.threadMessage.bbCodeQuote.noQuote').remove();  // Удалить текст темы
            // $t.find('.threadInfo').remove(); // Удалить симпатии и комментарии
            // $t.find('.threadSeperator').remove(); // Удалить разделитель
        }

        XenForo.MinimalisticThreadPreview = function($el) {
            let previewUrl = $el.find('.threadHeaderMain h3 a').attr('href');
            if (!previewUrl) return;
            if (!parseInt(XenForo._enableOverlays)) return;
            $el.find('[title]').addBack().attr('title', '');
            let loaded = false;
            tippy($el[0], {
                touch: false,
                interactive: false,
                arrow: true,
                theme: 'popup PreviewTooltip',
                animation: 'shift-toward',
                distance: 5,
                appendTo: document.body,
                delay: [300, 0],
                maxWidth: 400,
                placement: 'top-start',
                flipOnUpdate: true,
                content: '',
                onShow(instance) {
                    if (window.lastScrollTime && Date.now() < window.lastScrollTime + 500) {
                        clearTimeout(XenForo._ShowPreviewTimeout);
                        XenForo._ShowPreviewTimeout = setTimeout(() => {
                            if (!(window.lastScrollTime && Date.now() < window.lastScrollTime + 500)) {
                                $el[0]._tippy.show();
                            }
                        }, 700);
                        return false;
                    }
                    if (XenForo._ActivePreviewTooltip && XenForo._ActivePreviewTooltip !== instance) {
                        XenForo._ActivePreviewTooltip.hide();
                    }
                    if (!loaded) {
                        XenForo.ajax(previewUrl + 'preview', {}, ajaxData => {
                            loaded = true;
                            instance.setContent(ajaxData.templateHtml);
                            if ($el.is(':hover')) {
                                instance.show();
                                XenForo._ActivePreviewTooltip = instance;
                            }
                        });
                        return false;
                    }
                    XenForo._ActivePreviewTooltip = instance;
                    return true;
                }
            });
        };

        function processThread(thread) {
            minimalisticThread(thread);
            XenForo.MinimalisticThreadPreview($(thread));
        }

        $('.discussionListMainPage .discussionListItem').each(function () {
            processThread(this);
        });

        const originalActivate = XenForo.activate;
        XenForo.activate = function($content) {
            const result = originalActivate.apply(this, arguments);
            $($content).each(function(){
                if (this.nodeType !== 1) return;
                $(this).find('.discussionListItem').each(processThread);
                if (this.classList.contains('discussionListItem')) processThread(this);
            });
            return result;
        };
    }

    waitForXenForo();
})();
