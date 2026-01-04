// ==UserScript==
// @name        BZUCO Customers
// @namespace   https://jiraskuvhronov.bzuco.cloud/
// @description Neoficiální vylepšení administrace zákazníků
// @license     MIT; https://opensource.org/licenses/MIT
// @match       https://jiraskuvhronov.bzuco.cloud/admin/cs/customers/*
// @match       https://test-9.bzuco.cloud/admin/cs/customers/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/448493/BZUCO%20Customers.user.js
// @updateURL https://update.greasyfork.org/scripts/448493/BZUCO%20Customers.meta.js
// ==/UserScript==

const $ = this.jQuery = jQuery.noConflict(true); // eslint-disable-line

const modal = $('#modal')

// oprava přetékání obsahu v okně detailu objednávek zákazníka
modal.find('.modal-content').css('overflow-x', 'auto');

function getIcon(status) {
    if (status === 'Uhrazená') return '<i class="fa fa-check-circle-o" style="color: #27ae60"></i>';
    if (status.indexOf('Zrušená') !== -1) return '<i class="fa fa-times-circle-o" style="color: #ffa500">';
    return '';
}

function setTrCSS(tr, status) {
    if (status.indexOf('Zrušená') !== -1)
        tr.css('text-decoration', 'line-through').css('color', 'gray');
    else if (status === 'Vytvořená')
        tr.css('color', 'silver');
}

const observer = new MutationObserver(function(mutations, observer) {
    observer.disconnect();

    const objednavky = [];

    modal.find('.modal-body .table').each(function() {
        let rows = $(this).find('tbody tr');
        let section = $(this).prev().text().trim();

        switch (section) {
            case 'Objednávky':
                $(this).find('thead').prepend('<th></th>');

                rows.each(function() {
                    const tr = $(this);
                    let id = tr.find('td:first-child').text().trim();
                    let status = tr.find('td:nth-child(18)').text().trim();

                    objednavky[id] = status;

                    setTrCSS(tr, status);

                    tr.prepend('<th>' + getIcon(status) + '</th>');
                });
            break;

            case 'Vstupenky':
                $(this).find('thead').prepend('<th></th>');

                rows.each(function() {
                    const tr = $(this);

                    let id = tr.find('td:first-child').text().trim();
                    let status = objednavky[id];

                    setTrCSS(tr, status);

                    tr.prepend('<th>' + getIcon(status) + '</th>');
                });
            break;
        }
    });

    observer.observe(modal[0], { childList: true, subtree: true });
});

observer.observe(modal[0], { childList: true, subtree: true });
