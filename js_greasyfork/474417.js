// ==UserScript==
// @name         CART TO TXT DESKTOP/TABLET
// @namespace    http://tampermonkey.net/
// @version      0.53
// @description  A CART TO TXT CONVERTER
// @author       (C)2023 PANOS ILIOPOULOS info@pinet.gr
// @match        https://www.e-jumbo.gr/cart/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-jumbo.gr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474417/CART%20TO%20TXT%20DESKTOPTABLET.user.js
// @updateURL https://update.greasyfork.org/scripts/474417/CART%20TO%20TXT%20DESKTOPTABLET.meta.js
// ==/UserScript==

/*(function() {
    'use strict';
})();*/

    function downloadCSV(filename, text) {
        var element = document.createElement('a');
        //element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('href', 'data:text/txt;charset=iso-8859-1,' + text);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    var div = document.createElement("div");
    div.innerHTML = '<select id="segmentid_select" style="padding: 8px 16px;margin-bottom:10px;"> \
                      <option value="  ">ΚΕΝΤΡΙΚΟ</option> \
                      <option value="01">ΜΟΛΑΟΙ</option> \
                      <option value="02">ΜΕΓΑΛΟΠΟΛΗ</option> \
                      <option value="03">ΓΑΡΓΑΛΙΝΟΙ</option> \
                      <option value="04">ΦΙΛΙΑΤΡΑ</option> \
                      <option value="05">ΚΥΘΗΡΑ</option> \
                      <option value="06">ΜΟΝΕΜΒΑΣΙΑ</option> \
                      <option value="07">ΜΕΛΙΓΑΛΑΣ</option> \
                      <option value="08">ΣΚΑΛΑ</option> \
                      <option value="09">ΝΕΑΠΟΛΗ</option> \
                      <option value="10">ΑΡΕΟΠΟΛΗ</option> \
                      <option value="11">ΣΤΟΥΠΑ</option> \
                     </select><br>';
    div.style = "position: fixed;top: 10px;left: 10px;padding: 10px 10px;background-color: #aaaaaa ; border: 1px solid #333333;box-shadow: #333 5px 5px 10px -4px;";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(div);

    var button = document.createElement("button");
    button.innerHTML = "ΑΠΟΘΗΚΕΥΣΗ";
    button.style = "padding: 10px 10px;background-color: darkorange;color:white;";
    div.appendChild(button);

    button.addEventListener ("click", function() {
        let objectDate = new Date();
        let time_filename = "jumbo-cart-"+objectDate.getFullYear().toString()+(objectDate.getMonth()+1).toString().padStart(2,'0')+objectDate.getDate().toString().padStart(2,'0')+objectDate.getHours().toString().padStart(2,'0')+objectDate.getMinutes().toString().padStart(2,'0')+objectDate.getSeconds().toString().padStart(2,'0');
        let csvid = prompt("Παρακαλώ δώστε ενα id / όνομα αρχείου");
        var filename = '';
        if ( csvid!=null && csvid.trim()!='' ) { filename = csvid; } else { filename = time_filename; }

        //var lines ="\ufeff"; // utf-8 BOM header gia na anagnorisei to excel to utf-8
        var lines =""; // utf-8 BOM header gia na anagnorisei to excel to utf-8
        var items = document.querySelectorAll('li.cart-item');

        items.forEach(function(item,index){console.info(item);
            /*lines += item.children[1].children[3].children[1].textContent.replace("[Κωδ. ",'').replace(']','').trim()+';';
            lines += item.children[1].children[3].children[0].children[0].textContent+';';
            lines += item.children[2].children[2].children[1].value+';';
            lines += item.children[1].children[2].children[0].href+';';
            lines += item.children[1].children[2].children[0].children[0].src+';';*/
            lines += "220530  ";
            lines += document.querySelector('select#segmentid_select').value;
            lines += "XO";
            lines += item.children[1].children[3].children[1].textContent.replace("[Κωδ. ",'').replace(']','').trim().padEnd(15,' ');
            //lines += item.children[2].children[2].children[1].value.toString().padStart(5,'0');
            lines += '00001';
            lines += "\r";
        });

        downloadCSV(filename+'.txt',lines);
    });