// ==UserScript==
// @name        Currency Tomsk
// @description The best currencies 5 in list.
// @namespace   http://bank.tomsk.ru/
// @include     http://banki.tomsk.ru/pages/41/
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant       none
// @version     1.7
// @downloadURL https://update.greasyfork.org/scripts/10097/Currency%20Tomsk.user.js
// @updateURL https://update.greasyfork.org/scripts/10097/Currency%20Tomsk.meta.js
// ==/UserScript==

(function () {
    function doProcess() {
        try {
            var panel = $("<div>" +
                "<div style='border-bottom: 2px solid red; font-weight: bold; color: black; font-size: 1.3em;'>" +
                "5 лучших курсов</div>" +
                "<table id='tbleMain'><tr><td style='width: 100%;'><select id='cboxFollowBank'></select></td><td><span style='color: yellow;' id='tbFollowBankRate'>--</span></td></tr></table>"+
                "</div>");
            panel.css({
                float:"left",
                border:"2px solid red",
                padding: "5px",
                width:"360px",
                height:"135px",
                position:"fixed",
                top:"5px",
                left:"20px",
                display:"block",
                "background-color":"#FF6A00",
                color: "white"
            });
            $("body").append(panel);

            $("#cboxFollowBank").change(function (){
                $("#tbFollowBankRate").text($(this).val());
                $.cookie("selected_bank_nm", $("#cboxFollowBank option:selected").text(), {
                    expires: 7
                });
            });

            var selectedBankName = $.cookie("selected_bank_nm");
            var banks = [];
            $(".curbody>.bank").each(function(){

                var bankName = $(this).text();
                var ratio = $(this).next().text();

                if (selectedBankName ==  bankName)
                    $("#tbFollowBankRate").text(ratio);
                $("#cboxFollowBank").append("<option "+ (selectedBankName ==  bankName ? "selected" : "")
                    +" value='"+ ratio +"'>"+ bankName +"</option>");

                console.info(bankName);
                console.info(ratio);
                
                if (ratio.indexOf("-") != -1)
                    return;
                
                banks.push({
                    bank: bankName,
                    href: $("a", $(this)).attr("href"),
                    ratio: parseFloat(ratio.replace(",", ".")),
                    ratio_text: ratio
                });
            });
            
            banks = banks.sort(function (item1, item2) {
                return item2.ratio > item1.ratio;
            });
            for (var i = 0; i < 5; i++) {
                $("#tbleMain").append("<tr><td><a href='"+ banks[i].href +"' style='color: #7F0000;'>"
                    + banks[i].bank +"</a></td><td>"+ banks[i].ratio_text +"</td></tr>");
            }
        } catch (ex) {
            alert(ex.message);
        }
    }

    $(document).ready(doProcess);
})(jQuery);