// ==UserScript==
// @name         Сортировка комментариев
// @version      0.9
// @description  Сортировка комментариев по рейтингу для geektimes и habrahabr

// @author       Saikava
// @include      https://geektimes.ru*
// @include      https://habrahabr.ru*
// @include      https://habr.com*
// @include      https://geektimes.com*
// @namespace Сортировка комментариев по рейтингу для geektimes и habrahabr
// @downloadURL https://update.greasyfork.org/scripts/429639/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/429639/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);


(function() {

 setTimeout(function () {
     let btn = document.createElement("button");
     btn.innerHTML = "Сортировать";
     btn.onclick = function () {
     sortComments()
};
     $('.tm-main-menu__section-content').append(btn);
}, 7000)

function sortComments(){

        var comments = $('.tm-comment-thread__comment');
        var commentVotes = [];

        jQuery.each(comments, function(i,e){
            commentVotes.push(parseInt($(e).find('.tm-votes-meter__value').first().text().replace('–', '-')));
        });
    $('.tm-comments__tree').empty();
        for (var i = 0; i < commentVotes.length; i++){
            var max = commentVotes[i];
            var indexOfMax = i;
            for (var j = i + 1; j < commentVotes.length; j++){
                if (commentVotes[j] > max){
                    max = commentVotes[j];
                    indexOfMax = j;
                }
            }
            //
            //$('.tm-comment-thread__comment').empty();
            var topComment = comments[indexOfMax];
            comments[indexOfMax] = comments[i];
            commentVotes[indexOfMax] = commentVotes[i];
            $('.tm-comments__tree').append(topComment);
        }

        $('#sortCommentsButton').hide();
    }

}());