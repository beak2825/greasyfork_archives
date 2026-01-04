// ==UserScript==
// @name         Tabun Keyboard (Comments)
// @namespace    https://tabun.everypony.ru/
// @version      0.3
// @description  Клавиатурная навигация по комментам на табуне.
// @author       Lunavod
// @match        https://tabun.everypony.ru/blog/*/*.html
// @match        https://tabun.everypony.ru/blog/*.html
// @match        https://tabun.everypony.ru/talk/read/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34118/Tabun%20Keyboard%20%28Comments%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34118/Tabun%20Keyboard%20%28Comments%29.meta.js
// ==/UserScript==

/*
CTRL+SPACE - перейти к следующему непрочитанному комментарию.
ALT+U - обновить комментарии. CTRl+(UP/DOWN) - перейти к комменту выше/ниже.
CTRL+DOWN - перейти к комменту ниже.
ALT+(UP/DOWN) - проголосовать +/- за выбранный комментарий.
ALT+R - показать/скрыть форму ответа на выбранный комментарий.
ALT+N - показать/скрыть форму нового комментария.
ALT+SHIFT+P - перейти к комментарию-родителю
*/

(function() {
    'use strict';

    function goTo(d){
        var comments = [...document.querySelectorAll('.comment')];
        var cur_comm = document.querySelector('.comment-current') || comments[0];
        var cur_index = comments.indexOf(cur_comm);
        ls.comments.scrollToComment(comments[cur_index+d].getAttribute('data-id'));
    }

    function voteCurr(d) {
        var cur_comm = document.querySelector('.comment-current');
        if (!cur_comm) {
            return;
        }
        return ls.vote.vote(cur_comm.getAttribute('data-id'),this,d,'comment');
    }

    document.addEventListener('keyup', (e)=>{
        if (e.ctrlKey && e.code=="Space") {
            ls.comments.goToNextComment();
        }
        if (e.ctrlKey && !e.shiftKey && e.code=="ArrowUp") {
            goTo(-1);
        }
        if (e.ctrlKey && !e.shiftKey && e.code=="ArrowDown") {
            goTo(1);
        }
        if (e.altKey&& e.code=="ArrowUp") {
            voteCurr(1);
        }
        if (e.altKey && e.code=="ArrowDown") {
            voteCurr(-1);
        }
        if (e.altKey && e.code=="KeyU") {
            document.querySelector('#update-comments').click();
        }
        if (e.altKey && e.code=="KeyR") {
            var cur_comm = document.querySelector('.comment-current');
            if (!cur_comm) {
                return;
            }
            ls.comments.toggleCommentForm(cur_comm.getAttribute('data-id'));
        }
        if (e.altKey && e.code=="KeyN") {
            ls.comments.toggleCommentForm(0);
        }
        if (e.shiftKey && e.altKey && e.code=="KeyP") {
            var a = document.querySelector('.comment-current .goto-comment-parent a');
            if (!a) {
                return;
            }
            a.click();
        }
    });
})();