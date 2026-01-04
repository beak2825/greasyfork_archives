// ==UserScript==
// @name         Kazanç Toplayıcı
// @version      0.1.2
// @description  Popmundo şirket gelirlerini toplar.
// @namespace    https://greasyfork.org/users/6949
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/q.js/1.5.1/q.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/locales/tr.min.js
// @match        htt*://*.popmundo.com/World/Popmundo.aspx/Company/LocaleMoneyTransfer/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/38587/Kazan%C3%A7%20Toplay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/38587/Kazan%C3%A7%20Toplay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {
    /*
     * Setting the same PPM user locale for Numeral,
     * so that units can be understandable.
     */
    numeral.locale('tr');

    /*
     * jQuery selector for the table.
     */
    var table = $('#tablelocales');

    /*
     * How much money should the locale keep after the transaction?
     *
     * @type int
     */
    var keep = 400000;

    /*
     * Run the collector?
     *
     * @type bool
     */
    var run = GM_getValue('should_run') || false;

    /*
     * Latest row index processed.
     *
     * @type int
     */
    var index = GM_getValue('latest_index') || 0;

    if (!run) {
        var total_cash = 0;

        $.each(table.find('tbody > tr'), function (key, locale) {
            var cash_numeral = numeral($(locale).find('td:eq(1)').text().trim());
            total_cash += cash_numeral.subtract(keep).value();
        });

        table.after(
            '<div class="box">' +
            '<h2>Kazancı Topla</h2>' +
            '<p>Şirket bünyesindeki mekânların tümünde bulunan ' + numeral(total_cash).format('0.0[,]00 ₺') + ' nakdi, önceden belirlenmiş olan miktarı mekân kasasında bırakarak otomatik şekilde toplayabilirsiniz.</p>' +
            '<p class="actionbuttons">'+
            '<input type="button" name="collect_income" value="Topla">' +
            '</p>' +
            '</div>'
        );

        $('input[name="collect_income"]').on('click', function() {
            GM_setValue('should_run', true);
            GM_setValue('latest_index', 0);

            window.location.reload();
        });

        return;
    }

    if (index >= table.find('tbody > tr').length) {
        GM_setValue('should_run', false);
        GM_setValue('latest_index', 0);

        return;
    }

    var index_row = table.find('tbody > tr').eq(index),
        cash_numeral = numeral(index_row.find('td:eq(1)').text().trim());

    Q.fcall(function() {
        index_row.find('td:eq(2) > input').val(
            - Math.floor(cash_numeral.subtract(keep).value())
        );
    }).then(function() {
        GM_setValue('latest_index', index + 1);
    }).then(function() {
        index_row.find('td:eq(3) > input').click();
    });
});
