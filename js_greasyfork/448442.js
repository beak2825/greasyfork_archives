// ==UserScript==
// @name:zh-CN     中文华尔街日报付费墙移除、全文显示
// @description:zh-CN     用户在访问华尔街日报网站时移除付费墙，让您免费阅读文章。
// @name:zh-TW     中文華爾街日報付費牆移除、全文顯示
// @description:zh-TW     用戶在訪問華爾街日報網站時移除付費牆，讓您免費閱讀文章。
// @name            The Wall Street Journal CN site Full Text Articles
// @name:it         The Wall Street Journal CN - Articoli con testo completo
// @namespace       iamfredchu
// @version         0.0.13
// @description     Fetch the full text of The Wall Street Journal articles from the AMP version. I've identified an issue affecting iOS Safari users while reading articles on wsj.com. The font size may appear too large. As a temporary workaround, please use the font adjustment tool in the Safari address bar to increase or decrease the font size, then reset it to the original size. This should fix the issue. This bug is not present on cn.wsj.com. Thank you for your cooperation and understanding.
// @description:it  Mostra il testo completo degli articoli su The Wall Street Journal
// @author          Fred Chu
// @match           https://cn.wsj.com/articles/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @inject-into     content
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @run-at       document-end
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/448442/The%20Wall%20Street%20Journal%20CN%20site%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/448442/The%20Wall%20Street%20Journal%20CN%20site%20Full%20Text%20Articles.meta.js
// ==/UserScript==

function fetch(params) {
    return new Promise(function(resolve, reject) {
        params.onload = resolve;
        params.onerror = reject;
        GM.xmlHttpRequest(params);
    });
}

(function() {
    'use strict';
    const $body = $(document.body);
    const paywalled = $body.find("#cx-snippet-promotion");

    if (!paywalled) {
        return;
    }

    fetch({
        method: 'GET',
        url: location.protocol + '//' + location.host + '/amp/articles/' + location.pathname.split('/').pop(),
    }).then(function(responseDetails) {
        var r = responseDetails.responseText;
        r = r.replace(/<script/gi, '<div').replace(/script>/gi, 'div>');
        r = r.replace(/\?width=/gi, '?__=').replace(/<amp-img/gi, '<img').replace(/<.amp-img>/, '').replace(/amp-iframe/gi, 'iframe');

        var data = $(r);

        setTimeout(function(){
            let hasSnippet = $body.find('.wsj-snippet-body');
            let $preview = $body.find('article section').length ?
                $body.find('article section') :
                $body.find('.wsj-snippet-body');

            $preview.replaceWith(data.find('section[subscriptions-section="content"]')
                                 .css('margin-bottom', '5rem')
                                 .css('color', 'var(--primary-text-color)')
                                 .css('font-family', 'var(--article-font-family)')
                                 .css('font-weight', 'var(--article-font-weight)')
                                 .css('line-height', 'calc(27 / 17)')
                                 .css('direction', 'var(--article-direction);')
                                );

            $body.find('[aria-label*="Listen"]').next().next().remove();
            $body.find('[aria-label*="What"]').remove();
            $body.find('#cx-snippet-overlay').length && $body.find('#cx-snippet-overlay').parent().remove();
            $body.find('.snippet-promotion, #cx-what-to-read-next').length && $body.find('.snippet-promotion, #cx-what-to-read-next').remove();

            $body.find('.responsive-media').css('height', 'auto');
            $body.find('.responsive-media img').css({
                'height': 'auto',
                'width': 'auto',
                'max-width': '100%',
                'display': 'block',
                'position': 'relative',
            });

            $body.find('article section p').css('margin', '0 0 1em 0')
                .css('font-size', 'calc((17 / var(--article-base-font-size)) * var(--article-text-size-scale) * 1rem)');

            const $videoWrapper = $('<div class="video-player"></div>');
            $videoWrapper.css('height', '225px');
            $body.find('.media-object-video iframe').css('max-width', '100%').removeClass('video-wrapper').wrap($videoWrapper);

            $body.find('.media-object-podcast iframe').css('max-width', '100%');
            $body.find('.imageCaption').each(function() {
                var element = $(this);
                var parent = element.parent();
                var wrapper = $('<div class="wsj-article-caption"></div>');
                wrapper.append(element.html()).appendTo(parent);
                element.remove();
            }).find('.imageCredit').addClass('wsj-article-credit').prepend(' ');
            $body.find('.media-object').addClass('media-object-image');
            $body.find('.media-object img').css('height', 'auto');
        }, 3000);
    }).catch(error => {
        console.error(arguments);
    });
})();