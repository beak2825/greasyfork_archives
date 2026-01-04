// ==UserScript==
// @name           Crypto Mines Opener
// @version        1.02
// @namespace      crypto_mines_opener
// @description    Фраудис Висус
// @include        https://virtonomica.ru/crypto/main/unit/create/*/step6
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/373074/Crypto%20Mines%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/373074/Crypto%20Mines%20Opener.meta.js
// ==/UserScript==

(function () {
    if ($('td.value-complite  > div > span').eq(0).text().replace(/\s/g,'') == 'Шахта') {
        //Настройка сложности и качества. Разделение разрядов точкой - например, 1.25
        var quality = 1, hardity = 1;

        $('input#selectedQuality').val(quality);
        $('input#selectedHardity').val(hardity);

        $('span#selectedQualityValue').text(quality);
        $('span#selectedHardityValue').text(hardity);

        $('div#qualitySlider > a').eq(0).slider('value', quality);
        $('div#harditySlider > a').eq(0).slider('value', hardity);

        $('div[style="display: none;"]').each(function() {
            $(this).css('display','');
        });
    }
})(window);