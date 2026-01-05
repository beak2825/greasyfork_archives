// ==UserScript==
// @name        MasterKISS
// @namespace   czechia.com
// @include     http://intranet*
// @include     https://intranet*
// @include     http://www*
// @icon        http://hotline.testwebu.com/master_chc/icon.png
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @require     https://cdn.jsdelivr.net/jquery.hotkeys/0.1.0/jquery.hotkeys.js
// @require     https://cdn.jsdelivr.net/tablesorter/2.17.4/js/jquery.tablesorter.min.js
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @description ultimativní pomocník pro KISS
// @update      https://greasyfork.org/scripts/2056-masterkiss/code/MasterKISS.user.js
// @version     0.4.20151218
// @downloadURL https://update.greasyfork.org/scripts/2056/MasterKISS.user.js
// @updateURL https://update.greasyfork.org/scripts/2056/MasterKISS.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////
/// řazení zahraničních domén
/// funguje ve správě zahraničních domén 


function timeToInt(input) {
    //vstup - datum ve tvaru 'DD.MM.YY' nebo 'D.M.YY';
    var datum = input.split(".");

    //každý položka musí být dva znaky dlouhá 9 => 09 atp.
    for (var i = 0; i < 3; i++) {
        if (datum[i].length < 2) {
            datum[i] = "0" + String(datum[i]);
        }
    }

    //vrací int - sestrojíme a  převedeme
    var ret = datum[2] + datum[1] + datum [0];
    //console.log("+++" + ret);
    return parseInt(ret, 10);
}




if (location.href.match(/\?module=Invoice&action=ExtraneousDomainsList/)) {

    var css = "";
    css += ".tablesorter-header {cursor: hand; cursor: pointer}";
    css += ".tablesorter-headerAsc {color: #FFCC66!important; background-image: url('http://hotline.testwebu.com/greasemonkey_imgs/up.png')!important; background-repeat: no-repeat!important; background-position: 2px center!important;}";
    css += ".tablesorter-headerDesc {color: #FFCC66!important; background-image: url('http://hotline.testwebu.com/greasemonkey_imgs/down.png')!important; background-repeat: no-repeat!important; background-position: 2px center!important;}";
    GM_addStyle(css);
    
    $(document).ready(function () {

        $('table').tablesorter({
            debug: 'true',
            textExtraction: function (node) {
                var puvodni;
                if (!node.firstChild.innerHTML) {
                    puvodni = node.innerHTML.trim();
                    //console.log("hodnota: " + node.innerHTML.trim());                      
                } else {
                    puvodni = node.firstChild.innerHTML.trim();
                    //console.log("hodnota: " + node.firstChild.innerHTML.trim()); 
                }
                //console.log("---------------------------");
                if (puvodni.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{2,4}\s[0-9]{1,2}:[0-9]{1,2}/)) {
                    var splitted = puvodni.split(" ");
                    //console.log("-" + timeToInt(splitted[0]));
                    var dateint =  timeToInt(splitted[0]);
                    var time = splitted[1].split(":");
                    var timeint = String(time[0]) + String(time[1]);
                            
                    return parseInt(dateint + "" +  timeint);
                } else if (puvodni.match(/[0-9]{1,2}\.{1}[0-9]{1,2}\.{1}[0-9]{2}/)) {
                    return timeToInt(puvodni);
                }
                return puvodni;
            }
        });
    });
    var h2 = document.getElementsByTagName('h2')[0];
    h2.id = "h2";
    $("<p><strong>MasterKISS: </strong>Tip - Řádky tabulky můžeš seřadit kliknutím na hlavičku sloupce</p>").insertAfter("#" + h2.id);
}


//////////////////////////////////////////////////////////////
/// expirace pro domény s chybou pro šumbiho
/// funguje ve správě zahraničních domén v doménách k opravě
//  aktuálně nepotřebujeme, data již načítá přímo aleš
//if (location.href.match(/\?module=Invoice&action=ExtraneousDomainsList.*type=4.*/)) {
//    function nactiDataCA(id, domena, rows, i) {
//        var ca_url = "http://intranet/?module=Hotline&action=Service&id=";
//        var parser;
//        if (!parser)
//            parser = new DOMParser();
//        GM_xmlhttpRequest({
//            method: "GET",
//            url: ca_url + id,
//            onload: function (response) {
//                if ((response.readyState == 4) && (response.status == 200)) {
//                    console.log("ok");
//                    var doc = parser.parseFromString(response.responseText, "text/html");
//                    var ddd = domena.replace('.', '\\.', 'g'); //je třeba escapovat tečku
//                    var resultNode = doc.querySelector('#exp-' + id + '-' + ddd);
//                    // některé mají acronym s redemption, je třeba ořezat
//                    var kids = resultNode.childNodes;
//                    if (kids.length > 1) {
//                        var exp_date = kids[1].innerHTML.trim();
//                    } else {
//                        var exp_date = resultNode.innerHTML.trim();
//                    }
//
//
//                    console.log('ok načteno: "' + domena + "\t" + exp_date);
//                    var abbr = '<abbr title="Načteno z KISS pomocí skriptu MasterKISS" style="border-bottom: 1px dotted; cursor: help;">';
//                    rows[i].getElementsByTagName('td')[7].innerHTML = abbr + exp_date;
//                    return resultNode;
//                } else {
//                    alert('MasterKISS: Došlo k chybě, načtení dat expirace z CA pro ' + domena + ' (ID service ' + id + ') se nezdařilo.');
//                }
//            }
//        })
//    }
//
//    var domains_table = document.getElementsByTagName('table')[3];
//    var domain_rows = domains_table.getElementsByTagName('tr');
//    for (var i = 1; i <= domain_rows.length; i++) {
//        var row_links = domain_rows[i].getElementsByTagName('a');
//        var domena = row_links[2].innerHTML;
//        var id_service = row_links[1].innerHTML;
//        var log = nactiDataCA(id_service, domena, domain_rows, i);
//    }
//}
