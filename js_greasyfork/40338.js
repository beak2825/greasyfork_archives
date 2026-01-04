// ==UserScript==
// @name        Bold Reply
// @namespace   http://quovadis.dk/
// @description Bedre reply-funktion på bold.dk
// @include     https://www.bold.dk/snak/index.php?action=reply&id=*
// @include     https://www.bold.dk/snak/index.php?action=thread&id=*
// @icon        https://www.bold.dk/favicon.ico
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/40338/Bold%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/40338/Bold%20Reply.meta.js
// ==/UserScript==

console.log('Bold Reply');

function bold_reply_main() {
    var url = document.location;
    console.log(url);
    if (/thread/.test(url)) {
        addAuthor();
    }
    if (/reply/.test(url)) {
        addQuote();
    }
}

function addAuthor() {
    $('a.tekst').each(function (idx) {
        var href = $(this).attr('href');
        if (/reply/.test(href)) {
            var author = $(this).parent().parent().find('a > b').html();
            console.log(author);
            $(this).attr('href', href + '&author=' + encodeURIComponent(author));
        }
    });
}

function getAuthor() {
    var author = '';
    try {
        author = decodeURIComponent(/author=(.*)$/.exec(document.location)[1]);
    }
    catch (e) {
        console.warn('No author found');
    }
    return author;
}

function addQuote() {
    var post = '[quote][b]' + getAuthor() + '[/b]: ';
    var quote = $('div.col1 > div').first().html();
    quote = quote.replace(/<strong>.*<\/strong>/, '');
    quote = quote.replace(/<(i|blockquote)>/gm, '[i]');
    quote = quote.replace(/<\/i>/gm, '[/i]');
    quote = quote.replace(/<\/blockquote>/gm, '[/i]\n\n');
    quote = quote.replace(/<b>/gm, '[b]');
    quote = quote.replace(/<\/b>/gm, '[/b]');
    quote = quote.replace(/<br>/gm, '\n');
    $('#post').val(post + quote.trim() + '[/quote]');
}

bold_reply_main();
