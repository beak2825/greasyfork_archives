// ==UserScript==
// @name    Xthor Gang Money
// @match   https://xthor.tk/gang.php?id=12
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at document-end
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @version 0.1.0.0
// @description Send Money from Gang
// @namespace https://greasyfork.org/users/74987
// @downloadURL https://update.greasyfork.org/scripts/402544/Xthor%20Gang%20Money.user.js
// @updateURL https://update.greasyfork.org/scripts/402544/Xthor%20Gang%20Money.meta.js
// ==/UserScript==

BASE_URL = "https://xthor.tk/userdetails.php?id=";

listUserImg = $("#icarousel > div > i.fa.fa-user");
for (var i = 0; i < listUserImg.length; i++) {
    parentUser = $(listUserImg[i]).parent()
    hrefUser = $("span > a",parentUser).attr('href');
    idUser = hrefUser.replace(BASE_URL,"")

    parentUser.append(`
         <select id="bonusgift`+idUser+`">
            <option value="100.0" selected> 100 $</option>
            <option value="200.0"> 200 $</option>
            <option value="300.0"> 300 $</option>
            <option value="400.0"> 400 $</option>
            <option value="500.0"> 500 $</option>
            <option value="1000.0"> 1 000 $</option>
            <option value="5000.0"> 5 000 $</option>
            <option value="10000.0"> 10 000 $</option>
            <option value="20000.0"> 20 000 $</option>
            <option value="50000.0"> 50 000 $</option>
            <option value="100000.0"> 100 000 $</option>
            <option value="1000000.0"> 1 000 000 $</option>
            <option value="10000000.0"> 10 000 000 $</option>
            <option value="100000000.0"> 100 000 000 $</option>
            <option value="1000000000.0"> 1 000 000 000 $</option>
         </select>
         <button type="button" class="btn btn-primary sendMoney" style="width: 100px; height: 30px; padding: 5px;" value="`+idUser+`">Donner</button>`);
    $(listUserImg[i]).parent().css("height", "205px");
}


$( ".sendMoney" ).click(function() {
    idUser = $(this).val();
    bonusgift_val = $("#bonusgift"+idUser).val();
    $.post(BASE_URL+$(this).val(),
        {
            bonusgift: bonusgift_val,
        },
        function(data, status, jqXHR) {

        }
    );
});