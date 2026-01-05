// ==UserScript==
// @name       jawz Hybrid - Dashboard
// @version    1.6
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10313/jawz%20Hybrid%20-%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/10313/jawz%20Hybrid%20-%20Dashboard.meta.js
// ==/UserScript==


var theHead = document.getElementsByClassName('collapse navbar-collapse');
var tasks, pay, earnings = '$0.00';
var spaces = '&nbsp;'
for (i=0; i<4; i++) { spaces += '&nbsp;'; }
var links = document.links

var dashboard = document.createElement("a");
dashboard.style.lineHeight = "50px";

$(theHead).append(dashboard);

function getPay() {
	$.get('http://www.gethybrid.io/workers/payments')
    .done(function(d) {
        var data = $(d);
        earnings = data.find('input[type="submit"]');
        earnings = earnings.val().replace('Get paid', '');
        
        var earningsE = document.createElement("a");
        earningsE.style.lineHeight = "50px";

        dashboard.innerHTML = '<a href="http://www.gethybrid.io/workers/payments?dashboard" class="nounderline">' + spaces + 'Dashboard</a>';
        for (i=0; i<3; i++) { spaces += '&nbsp;'; }
        earningsE.innerHTML = '<a href="http://www.gethybrid.io/workers/payments" class="nounderline">' + spaces + 'Available:' + earnings + '</a>';
        
        $(theHead).append(earningsE);
        
        $('a').css('text-decoration', 'none');
        var css='a.nounderline:link{color: #757575;} a.nounderline:visited{color: #757575;} a.nounderline:hover{color: #ffffff; text-decoration: none;}';
        style=document.createElement('style');
        if (style.styleSheet)
            style.styleSheet.cssText=css;
        else 
            style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style);
    });
}

$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});

getPay();


if (document.URL.indexOf("http://www.gethybrid.io/workers/payments?dashboard") >= 0) {
    $('li[class="active"]').text('Dashboard');
    $('table[class="table table-striped data-table"]').hide();
    
    var todayMoney = 0;
    var outMoney = 0;
    var paidMoney = 0;
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    function getTime() {
        var d = new Date();
        var day = d.getUTCDate(), month = d.getUTCMonth();
        return months[month] + ' ' + day;
    }

    var today = getTime();
    console.log(today);
    function countMoney() {
        var money = $('td:contains("$")').text().trim().split('$');
        var stats = $('td:contains("$")')
    
        var sum = 0;
        for (var i = 0, length = money.length - 1; i < length; i++) {
            var check = stats[i].nextSibling.nextSibling.textContent;
            if (check == today)
                todayMoney += Number(money[i + 1]);
            if (stats[i].nextSibling.nextSibling.nextSibling.nextSibling.textContent == 'Outstanding')
                outMoney += Number(money[i + 1]);
            else
                paidMoney += Number(money[i + 1]);
        };
        outMoney += sum;
    }
    
    
    
    var isChromium = window.chrome,
    vendorName = window.navigator.vendor;
    if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc.") {
        while (!$('li#table_next.paginate_button.next.disabled').length) {
            countMoney();
            var nextBtn = $('li#table_next');
            nextBtn.click();
        }
        countMoney();
    } else {
        countMoney();
    }
    var total = outMoney + paidMoney;
    var header = $('h1:contains("Transfer Funds")');
    
    var para = document.createElement("p");
    para.style.lineHeight = "14px";
    para.style.fontSize = "12px";
    para.innerHTML = '<br><b>Today\'s Earnings:</b> $' +
                     todayMoney.toFixed(2) +
                     '<br><b>Outstanding Earnings:</b> $' +
                     outMoney.toFixed(2) +
                     '<br><b>Paid Earnings:</b> $' +
                     paidMoney.toFixed(2) +
                     '<br><b>Total Earnings:</b> $' +
                     total.toFixed(2);

    $('h1').text('Dashboard');
    header.append(para);
    $('ul[class="pagination"]').hide();
    
    var tbl = $('table[class="table table-striped data-table dataTable no-footer"]')[0]
    
    tbl.rows[0].cells[0].innerHTML = 'Date';
    tbl.rows[0].cells[1].innerHTML = 'Tasks Completed';
    tbl.rows[0].cells[2].innerHTML = 'Earnings';
    $('table[class="table table-striped data-table dataTable no-footer"]').find('th:last-child, td:last-child').remove();
    $('table[class="table table-striped data-table dataTable no-footer"]').find('th:last-child, td:last-child').remove();
    for (i=0; i<6; i++) {
        var rowCount = table.rows.length
        tbl.deleteRow(rowCount -1);
    }
    tbl.rows[1].cells[0].style.width = '70%';
    tbl.rows[1].cells[0].innerHTML = '(SAMPLE)Today';
    tbl.rows[1].cells[1].innerHTML = '865';
    tbl.rows[1].cells[2].innerHTML = '$62.52';
    
    tbl.rows[2].cells[0].innerHTML = '(SAMPLE)June 24';
    tbl.rows[2].cells[1].innerHTML = '985';
    tbl.rows[2].cells[2].innerHTML = '$70.36';
    
    tbl.rows[3].cells[0].innerHTML = '(SAMPLE)June 23';
    tbl.rows[3].cells[1].innerHTML = '450';
    tbl.rows[3].cells[2].innerHTML = '$36.22';
    
    tbl.rows[4].cells[0].innerHTML = '(SAMPLE)June 22';
    tbl.rows[4].cells[1].innerHTML = '744';
    tbl.rows[4].cells[2].innerHTML = '$69.21';
    
    
}