// ==UserScript==
// @name         Коментатор
// @namespace    https://greasyfork.org/bg/users/2402-n-tsvetkov
// @version      1.0
// @description  Коментира статиите в ряпата, вотва коментарите.
// @author       You
// @match        https://www.erepublik.com/*/article/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382098/%D0%9A%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/382098/%D0%9A%D0%BE%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

(function() {
    function comment(i, z, text) {
        $j.post('https://www.erepublik.com/en/main/articleComments/create', {_token: csrfToken,articleId: SERVER_DATA.articleData.articleId,parentId: 0,message: text})
            .done(function() {
            i++;
            $j('#count').val(z - i);
            if (i < z) {
                setTimeout(function() {
                    comment(i, z, text);
                }, 3e3); // timeout
            } else {
                $j('#count').val('Готово');
            }
        });
    }
    function loadMoreComments() {
        setTimeout(function () {
            if ($j('#articleComments > a').is(":visible")) {
                $j('#articleComments > a').click();
                window.scrollTo(0,document.body.scrollHeight);
                loadMoreComments();
            }
        }, 2e3);
    }
    $j('.submitComment').after('<input type="text" size="5" id="count" style="margin: 20px 0px;" value="5">');
    $j('.submitComment').after('<a href="javascript:void(0);" id="all-comments" class="std_global_btn mediumSize floatLeft ng-binding" style="margin: 10px 10px;">Покажи всички коментари</a>');
    $j('.submitComment').after('<a href="javascript:void(0);" id="komentator" class="std_global_btn mediumSize floatLeft ng-binding" style="margin: 10px 10px;">Коментирай</a>');
    $j('.submitComment').after('<a href="javascript:void(0);" id="votcomment" class="std_global_btn mediumSize floatLeft ng-binding" style="margin: 10px 10px;">Вот на коментарите</a>');
    $j('#komentator').click(function(){
        var i = 0,
            z = parseInt($j('#count').val()),
            text = $j('textarea').val();
        if (text.length == 0) {
            alert('Моля, въведи текст, с който ще се коментира');
        } else {
            if (z <= 0 || isNaN(z)) {
                alert('Моля, въведи брой коментари');
            } else {
                comment(i, z, text);
            }
        }
    });
    $j('#votcomment').click(function(){
        $j('li:contains("Vote")').click();
    });
    $j('#all-comments').click(function(){
        loadMoreComments();
    });
})();