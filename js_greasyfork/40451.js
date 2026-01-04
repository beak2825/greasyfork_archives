// ==UserScript==
// @name         PageJaune SCRAP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.pagesjaunes.fr/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40451/PageJaune%20SCRAP.user.js
// @updateURL https://update.greasyfork.org/scripts/40451/PageJaune%20SCRAP.meta.js
// ==/UserScript==

(function() {
    function addScript(attribute, text, callback) {
        var s = document.createElement('script');
        for (var attr in attribute) {
            s.setAttribute(attr, attribute[attr] ? attribute[attr] : null);
        }
        s.innerHTML = text;
        s.onload = callback;
        document.body.appendChild(s);
    }

    addScript({
        src: 'https://code.jquery.com/jquery-3.3.1.js',
        type: 'text/javascript',
        async: null
    });
    setTimeout(function() {
        currentCode = 78;
        const getUrl = (code, page = 1) => `https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=gestion%20locative&ou=${code}&page=${page}`;
        currentPageLS = localStorage.getItem('SCRAP_PAGE');
        currentPage = currentPageLS ? currentPageLS : 1;
        var countPage = $('#SEL-compteur').text().split('/');
        var totalPage = parseInt(countPage[countPage.length - 1].trim());
        console.log(totalPage);
        currentDataLS = JSON.parse(localStorage.getItem('SCRAP_DATA'));
        if (!currentDataLS) { localStorage.setItem('SCRAP_DATA', JSON.stringify([])); currentDataLS = []; }

        var dataThisPage = [];
        $('.results article').each(function() {
            currentDataLS.push({
                code: currentCode,
                tel1: $(this).find('.bi-contact-numbers').find('strong').eq(0).text().trim(),
                tel2: $(this).find('.bi-contact-numbers').find('strong').eq(1).text().trim(),
                address: $(this).find('.adresse').text().trim(),
                name: $(this).find('a.denomination-links').text().trim(),
                page: currentPage
            });
        });

        localStorage.setItem('SCRAP_DATA', JSON.stringify(currentDataLS));
        setTimeout(function() {
            currentPage++;
            if (totalPage >= currentPage) {
                localStorage.setItem('SCRAP_PAGE', currentPage);
                window.location.href = getUrl(currentCode, currentPage);
            }
        }, 100);
    }, 1000);
})();