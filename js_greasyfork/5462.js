// ==UserScript==
// @name         FTB comment spiffifier
// @namespace    http://niko.cat/
// @version      0.1
// @description  Make commenting on FTB more better
// @include      http://freethoughtblogs.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5462/FTB%20comment%20spiffifier.user.js
// @updateURL https://update.greasyfork.org/scripts/5462/FTB%20comment%20spiffifier.meta.js
// ==/UserScript==


/*
<li class="comment byuser comment-author-nerdofredhead odd alt thread-odd thread-alt depth-1" id="comment-860508">
<article itemprop="comment" itemscope="itemscope" itemtype="http://schema.org/UserComments">
<header class="comment-header">
<p class="comment-author" itemprop="creator" itemscope="itemscope" itemtype="http://schema.org/Person">
<img alt='' src='http://0.gravatar.com/avatar/47f9d14fc29ffe78436ab7c50d58dc08?s=48&amp;d=identicon&amp;r=R' class='avatar avatar-48 photo' height='48' width='48'/><span itemprop="name">Nerd of Redhead, Dances OM Trolls</span> <span class="says">says</span> </p>
<p class="comment-meta">
<time itemprop="commentTime" datetime="2014-10-02T09:33:13+00:00"><a href="http://freethoughtblogs.com/pharyngula/2014/10/02/my-morning-mail-bag-so-far/comment-page-1/#comment-860508" itemprop="url">2 October 2014 at 9:33 am</a></time> </p>
</header>
<div class="comment-content" itemprop="commentText">
<blockquote><p>does Reddit have any responsibility to build a healthy community? I argue they do not. </p></blockquote>
<p>Then you argue from a position of moral bankruptcy, and can and will be criticized for that moral failure. There is no excuse for an unhealthy community.</p>
</div>
</article>
</li> 
*/


// http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
$.fn.selectRange = function(start, end) {
    if (!end) end = start; 
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};


var hoverbox = $('<span id="hoverbox">' +
                 '\xa0|\xa0<a class="reply-link" href="#"><b>Reply</b></a>' +
                 '</span>');
var template = $('<div>' +
                 '<a><span class="comment-author-link"></span>@<span class="comment-number-link"></span>:</a>\n' +
                 '<blockquote></blockquote>' +
                 '</div>');

jQuery(document).on('mouseenter', 'li.comment', function hover() {
    jQuery('#hoverbox').remove();
    jQuery(this).closest('li.comment').find('time').first().after(hoverbox);
}).on('mouseleave', 'li.comment', function unhover() {
    jQuery('#hoverbox').remove();
}).on('click', '#hoverbox a.reply-link', function(event) {
    event.preventDefault();
    var comment = $(this).closest('li.comment');
    var id = comment.attr('id');
    var link = comment.find('time a').attr('href');
    var author = comment.find('.comment-author span[itemprop="name"]').text();
    var label = comment[0].getAttribute('value');
    if (label === null) label = comment.index() + 1;  // sigh
    var content = comment.find('.comment-content');
    
    var fake = template.clone();
    fake.find('a').attr('href', '#' + id).end()
    .find('span.comment-author-link').text(author).end()
    .find('span.comment-number-link').text(label).end()
    .find('blockquote').attr('cite', link).append(content.clone().contents()).end();
    
    var textarea = $('#comment');
    var text = textarea.val();
    if (text.length > 0) text += '\n';
    text += fake.html() + '\n';
    textarea.val(text);
    
    window.location.hash = '#comment';
	textarea.selectRange(textarea.val().length).scrollTop(textarea[0].scrollHeight);
});
