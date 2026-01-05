// ==UserScript==
// @name        SeriousMagog
// @namespace   http://the-magog-forum.freeforums.net
// @description SeriousMagog: No text changes, no images, no videos.
// @include     http://the-magog-forum.freeforums.net/*
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25432/SeriousMagog.user.js
// @updateURL https://update.greasyfork.org/scripts/25432/SeriousMagog.meta.js
// ==/UserScript==
setTimeout(function () {
    $(document).ready(function () {
        /// Text in regular color, size and font family
        $('div.message font').css('color', $('div.message').css('color'));
        $('div.message font').css('font-size', $('div.message').css('font-size'));
        $('div.message font').css('font-family', $('div.message').css('font-family'));
        $('.sptitle').css('color', $('div.message').css('color'));
        /// Hide pictures except avatars
        $('div.message img, div.signature img').not('div.avatar-wrapper img').each(function () {
            $this = $(this);
            var url = $this.attr('src');
            // Replaces smilies with text version taken from ALT
            if (url.includes('proboards') && url.includes('smiley')) {
                var alt = $this.attr('alt');
                $this.replaceWith(alt);
                return;
            }
            if (url.includes('proboards') && url.includes('thumbnailer')) {
                url = $this.parent().attr('href');
            }
            var replacement = '<a href="' + url + '">REMOVED IMAGE</a>';
            if ($this.parent().hasClass('imgresized')) {
                $this.parent().html(replacement);
            }
            $this.replaceWith(replacement);
        });
        /// Removes videos
        $('div.message iframe').each(function () {
            $this = $(this);
            var url = $this.attr('src').replace('embed/', 'watch?v=');
            $this.replaceWith('<a href="' + url + '">REMOVED VIDEO</a>');
        });
    })
}, 25);
