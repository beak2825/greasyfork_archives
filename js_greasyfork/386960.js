// ==UserScript==
// @name         Komica Hidden idiotKing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  內文出現尼特王三個字直接隱藏該篇文章,若有安裝NGID同時NGID
// @match        http://sora.komica.org/00/*
// @match        https://sora.komica.org/00/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386960/Komica%20Hidden%20idiotKing.user.js
// @updateURL https://update.greasyfork.org/scripts/386960/Komica%20Hidden%20idiotKing.meta.js
// ==/UserScript==
    function hideNeet() {
        $.each($(".quote"), function (index, item) {
            if ((item.innerText).replace(/\s/g, '').trim('').indexOf('尼特王') != -1) {
                $(this).closest('.post').hide();
                let NeetId = $(this).parent().find('.id').attr('data-id');
                $.each($(".ngid-text-button"), function (neetIndex, neetItem) {
                    if ($(neetItem).attr('data-id') == NeetId) {
                        $(neetItem).click().change();
                    }
                });
            }
        });
    }

hideNeet();

   $("span:contains('展開')").on('click', function () {
         setTimeout(function(){hideNeet();},1000);
  });