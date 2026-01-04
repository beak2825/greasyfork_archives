// ==UserScript==
// @name         Shoptet "Nové filtry statistik"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.01
// @description  Nové filtrování ve statistikách
// @author       Zuzana Nyiri
// @match        */admin/statistiky-objednavek-a-obratu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405651/Shoptet%20%22Nov%C3%A9%20filtry%20statistik%22.user.js
// @updateURL https://update.greasyfork.org/scripts/405651/Shoptet%20%22Nov%C3%A9%20filtry%20statistik%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mySelect = document.getElementById("dateRange");
    if (mySelect !== null){
        var options = ["Tento měsíc", "Minulý měsíc", "Tento rok", "Minulý rok"];
        var values = ["this-M", "last-M", "this-Y", "last-Y"]
        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var val = values[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = val;
            mySelect.appendChild(el);
        }
    }

    function logValue() {
        switch (this.value) {
            case 'this-M':
                ThisM();
                break;
            case 'last-M':
                LastM();
                break;
            case 'this-Y':
                ThisY();
                break;
            case 'last-Y':
                LastY();
                break;
            default:
                setTimeout (function() {
                    $('.btn.btn-md.btn-action.submit-js').click();
                },100);
                break;
        }
    }
    mySelect.addEventListener('change', logValue, false);

    var newDate = new Date();
    var myMonth = newDate.getMonth();
    var myYear = newDate.getFullYear();

    function ThisM()
    {
        var dateFrom = "1."+(myMonth+1)+"."+myYear;
        var lastDay = new Date(myYear, (myMonth+1), 0);
        var dateTo = lastDay.getDate()+"."+(myMonth+1)+"."+myYear;
        window.location.assign('/admin/statistiky-objednavek-a-obratu/?f[dateFrom]='+dateFrom+'&f[dateUntil]='+dateTo+'&f[dateRange]=0');
    }

    function LastM()
    {
        var dateFrom = "1."+myMonth+"."+myYear;
        var lastDay = new Date(myYear, myMonth, 0);
        var dateTo = lastDay.getDate()+"."+myMonth+"."+myYear;
        window.location.assign('/admin/statistiky-objednavek-a-obratu/?f[dateFrom]='+dateFrom+'&f[dateUntil]='+dateTo+'&f[dateRange]=0');
    }

    function ThisY()
    {
        window.location.assign('/admin/statistiky-objednavek-a-obratu/?f[dateFrom]=1.1.'+myYear+'&f[dateUntil]=31.12.'+myYear+'&f[dateRange]=0');
    }
    function LastY()
    {
        window.location.assign('/admin/statistiky-objednavek-a-obratu/?f[dateFrom]=1.1.'+(myYear-1)+'&f[dateUntil]=31.12.'+(myYear-1)+'&f[dateRange]=0');
    }
})();