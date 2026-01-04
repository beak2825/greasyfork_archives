// ==UserScript==
// @name         İmzacıbaşı
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.popmundo.com/World/Popmundo.aspx/City/PeopleOnline/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/423437/%C4%B0mzac%C4%B1ba%C5%9F%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/423437/%C4%B0mzac%C4%B1ba%C5%9F%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function colorArrangement(){
        if($('#availableToGetSignature').length == 0){
            $("#tablepeople thead tr th:first").append(" <span id='availableToGetSignature'>(" + $("#tablepeople tbody tr").length + ")</span>");
        }else{
            $('#availableToGetSignature').text("(" + $("#tablepeople tbody tr").length + ")");
        }
        var flag = true;
        $("#tablepeople tr").each(function(index, element){
            $(element).removeClass("odd");
            $(element).removeClass("even");
            $(element).addClass( (flag ? "odd" : "even") );
            flag = !flag;
        });
    }

    $(document).ready(function(){
        $('#ctl00_cphLeftColumn_ctl00_pnlFreshFaces div').each(function(){
            $(this).css("float", "left");
        })

        $("#tablepeople tr").each(function(index, element){
            var status = $(element).find("td:nth-of-type(2)").text();
            if(/Seyahatte|Randevuda|Sahnede|Provada|Uçuyor|Parça|Hastanede|Televizyonda|Film çekiyor/.test(status)){
                $(element).remove();
                return;
            }
            $(element).find("td:nth-of-type(1) a:first").click(function(){
                $(element).remove();
                colorArrangement();
            })
        });
        colorArrangement();
    });
})();