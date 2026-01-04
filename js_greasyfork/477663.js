// ==UserScript==
// @name            KwejkAntyRetardowyTesting
// @name:pl         KwejkAntyRetardowyTesting
// @namespace       https://greasyfork.org/pl/scripts/kwejkantyretardowytesting/code
// @version         1.9
// @description     Block kwejk.pl comments by login
// @description:pl  Blokuj komentarze ludzi po loginie
// @author          You
// @license         MIT
// @match           https://kwejk.pl/*
// @match           https://m.kwejk.pl/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=kwejk.pl
// @downloadURL https://update.greasyfork.org/scripts/477663/KwejkAntyRetardowyTesting.user.js
// @updateURL https://update.greasyfork.org/scripts/477663/KwejkAntyRetardowyTesting.meta.js
// ==/UserScript==
 
(function() {
    console.log('# Started!');
    
    const toxicPeople = [
        '',
        'grodt',
        'LBGTplus',
        'MaciejM',
        'Munga',
        'MichałS',
        'nakwasowany',
        '',
        'OP_to_ciota',
        'Shauri',
        'wojciech-chmielewski',
        '',
    ];
 
    blockComments();
    
    console.log('# Finished!');
 
    // ----------------------------------------------------------------------
 
    function blockComments() {
        const waitSeconds = 2.5;
        setTimeout(blockCommentsOfToxicAuthors, waitSeconds * 1000);
    }
 
    function blockCommentsOfToxicAuthors() {
        const postsOfRetards = document.querySelectorAll('.comment-list li');
        console.log(postsOfRetards.length);
        let blockedCount = 0;
        console.log('Znalazłem komentarzy: ' + postsOfRetards.length);
        Array.from(postsOfRetards).forEach((comment) => {
            const shouldBlock = shouldBlockComment(comment);
            if (shouldBlock) {
                replaceCommentOfToxicPersonWithHappyLife(comment, shouldBlock);
                blockedCount++;
            }
        });
        if (blockedCount > 0) console.log('Zablokowałem ' + blockedCount + ' toksyków :-)');
    }
 
    function shouldBlockComment(comment) {
        const author = comment.querySelectorAll('.name a')[0].innerText;
        return toxicPeople.includes(author) ? author : null;
    }
 
    function replaceCommentOfToxicPersonWithHappyLife(comment, nick) {
        comment.innerHTML = '<span style="color:#6a8670">═══ Żyj szczęśliwie nie czytając (' + nick + ') ═══</span>';
    }
})();