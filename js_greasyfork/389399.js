// ==UserScript==
// @name         Komica Hidden Politic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  內文出現"政治廚又來綜合噴屎"隱藏該篇文章,若有安裝NGID同時NGID
// @match        http://sora.komica.org/00/*
// @match        https://sora.komica.org/00/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389399/Komica%20Hidden%20Politic.user.js
// @updateURL https://update.greasyfork.org/scripts/389399/Komica%20Hidden%20Politic.meta.js
// ==/UserScript==
    function hidePolitic() {
        $.each($(".quote"), function (index, item) {
            if ((item.innerText).replace(/\s/g, '').trim('').indexOf('政治廚又來綜合噴屎') != -1) {
                $(this).closest('.post').hide();
                let PoliticId = $(this).parent().find('.id').attr('data-id');
                $.each($(".ngid-text-button"), function (PoliticIndex, PoliticItem) {
                    if ($(PoliticItem).attr('data-id') == PoliticId) {
                        $(PoliticItem).click().change();
                    }
                });
            }
        });
    }

hidePolitic();

   $("span:contains('展開')").on('click', function () {
         setTimeout(function(){hidePolitic();},1000);
  });