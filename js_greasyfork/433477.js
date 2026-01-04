// ==UserScript==
// @name         HWM: поиск крафта на рынке
// @version      1.2
// @description  Фильтр по модам, посчет ЦЗБ с помощью сервиса https://daily.heroeswm.ru/opt_slom
// @author       Kam
// @include      https://www.heroeswm.ru/auction.php*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/433477/HWM%3A%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BA%D1%80%D0%B0%D1%84%D1%82%D0%B0%20%D0%BD%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/433477/HWM%3A%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BA%D1%80%D0%B0%D1%84%D1%82%D0%B0%20%D0%BD%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B5.meta.js
// ==/UserScript==

(function (undefined) {

    var configHtml = '<div><input type="text" id="fkr_filter" value="" placeholder="Поиск. Например W10"></div>';
    $('form[name="sort"]').append(configHtml);

    $('a.pi[href*="_lot_protocol.php?id="]').each(function(){
        if( $(this).html().match(/\#(\d+)/) ){
            var artTR = $(this).closest('table').parent().parent();
            var artTD = artTR.find('>td:eq(0)');
            artTD.css({position: 'relative'});
            artTD.append('<a class="fkr_czb" style="position:absolute;right:0;bottom:0;cursor:pointer;text-decoration:underline;margin-bottom:6px;">ЦЗБ</a>');
        }
    });

    $('#fkr_filter').on('keyup change', function(){
        var ss = $(this).val().toUpperCase();
        $('a.pi[href*="_lot_protocol.php?id="]').each(function(){
            if( $(this).html().match(/\#(\d+)/) ){
                var artTR = $(this).closest('table').parent().parent();
                var text = $(this).parent().text();
                if( !ss.length || text.indexOf(ss) > 0 ){
                    artTR.css({display: 'table-row'});
                }else{
                    artTR.css({display: 'none'});
                }
            }
        });
    });

    $('a.fkr_czb').click(function(){
        var $czbLink = $(this);
        var artLink = document.location.origin +'/'+ $(this).prev().find('a:first').attr('href');
        var artSum = $(this).closest('tr').find('>td:eq(2)').text().replace(/,/g,'').trim();
        var artProchka = $(this).closest('tr').find('.art_durability_hidden').text().split('/');
        console.log(artLink,artSum,artProchka);

        GM_xmlhttpRequest({
            method: "POST",
            url: artLink,
            data: "value=1",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                const regex = /<td\b[^>]*>(.*?)<\/td>/g;
                let match;
                let lastTd;
                // Iterate through all matches and store the last one
                while ((match = regex.exec(response.responseText)) !== null) {
                    lastTd = match[0]; // Capture the full <td>...</td> tag
                }
                lastTd = lastTd.replace(/<\/?[^>]+(>|$)/g, "").replace(',','');
                console.log("Price:", lastTd);

                var stmremnt = lastTd;//htm.split('Стоимость ремонта:')[1].replace(',','');
                console.log(artLink, stmremnt);
                console.log("sum="+artSum+"&pr1="+artProchka[0]+"&pr2="+artProchka[1]+"&rem="+stmremnt);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'https://daily.heroeswm.ru/opt_slom',
                    data: "sum="+artSum+"&pr1="+artProchka[0]+"&pr2="+artProchka[1]+"&rem="+stmremnt,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "charset": "windows-1251"
                    },
                    onload: function(response) {
                        var htm = response.responseText;//.replace(/<\/?[^>]+(>|$)/g, "");
                        var CZB = htm.split('<BR><HR><BR><p><b>')[1];
                        CZB = CZB.split(' ')[5].split('<')[0];
                        console.log(CZB);
                        $czbLink.html( 'ЦЗБ: ' + CZB ).css({
                            'cursor': 'default',
                            'text-decoration': 'none',
                            'font-weight': '800'
                        }).removeClass('fkr_czb');
                    }
                });
            }
        });
    });

}());
