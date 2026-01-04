// ==UserScript==
// @name         KissAnime Bookmark AutoSort
// @author       RainbowRoots
// @version      1.0
// @description  Opens user-specified bookmarks list on kissanime.ru
// @include      http://kissanime.ru/BookmarkList*
// @include      https://kissanime.ru/BookmarkList*
// @grant        none
// @namespace https://greasyfork.org/users/201276
// @downloadURL https://update.greasyfork.org/scripts/370925/KissAnime%20Bookmark%20AutoSort.user.js
// @updateURL https://update.greasyfork.org/scripts/370925/KissAnime%20Bookmark%20AutoSort.meta.js
// ==/UserScript==

function changeCategory(myCategory) {

    var odd = true;

    $("tr.trAnime").removeClass('odd');
    $(".aCategory").show();
    $('.selectCats').remove();
    $("tr.trAnime").hide();
    $("tr.trAnime[catName='" + myCategory + "']").show();

    $("tr.trAnime[catName='" + myCategory + "']").each(function(){

        if (odd) {
            odd = false;
            $(this).addClass('odd');
        }
        else {
            odd = true;
        }
    });
}

changeCategory("Currently Watching");