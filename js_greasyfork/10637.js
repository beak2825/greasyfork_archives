// ==UserScript==
// @name       jawz +Hybrid 
// @version    1.92
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10637/jawz%20%2BHybrid.user.js
// @updateURL https://update.greasyfork.org/scripts/10637/jawz%20%2BHybrid.meta.js
// ==/UserScript==


var theHead = document.getElementsByClassName('collapse navbar-collapse');
var tasks = [], pay = [], earnings = '$0.00';
var spaces = '&nbsp;'
for (i=0; i<4; i++) { spaces += '&nbsp;'; }
var links = document.links
var task;

//var dashboard = document.createElement("a");
//dashboard.style.lineHeight = "50px";

//$(theHead).append(dashboard);

function getPay() {
	$.get('https://www.gethybrid.io/workers/payments')
    .done(function(d) {
        var data = $(d);
        var earnings = data.find('p').eq(0);
        var earnings2 = data.find('p').eq(1);
        if (earnings.length) {
            earnings = earnings.text().replace('You currently have $', '').replace(' available in your account.', '');
            earnings2 = earnings2.text().replace('You also have $', '').replace(' pending 72h approval.', '');
            earnings = Number(earnings) + Number(earnings2);
        } else if (data.find('p:contains("Because of corrections")').text().length)
            earnings = data.find('p:contains("Because of corrections")').text().replace('Because of corrections you have a negative balance of ','').replace(', complete more tasks to make it positive.','');
        else    
            earnings = '$0.00';
        
        var earningsE = document.createElement("a");
        earningsE.style.lineHeight = "50px";

        //dashboard.innerHTML = '<a href="http://www.gethybrid.io/workers/payments?dashboard" class="nounderline">' + spaces + 'Dashboard</a>';
        for (i=0; i<3; i++) { spaces += '&nbsp;'; }
        earningsE.innerHTML = '<a href="http://www.gethybrid.io/workers/payments" class="nounderline">' + spaces + 'Earnings: $' + earnings.toFixed(2) + '</a>';
        
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

function getTasks() {
 	$.get('https://www.gethybrid.io/workers/projects')
    .done(function(d) {
        var data = $(d);
        var links = data.find('a:contains(' + task + ')');
        for (i=0;i<links.length;i++) {
            pay[i] = links.eq(i).parent().next().next().text();
            tasks[i] = links.eq(i).parent().next().text();
        }
        $('li').eq(7).append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size="2">Available Tasks:</b> ' + tasks + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Pay:</b> ' + pay + '</font></b>')
    });
}

$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});

getPay();



if (document.URL.indexOf('tasks') > -1){
    task = $('li').eq(7).text().trim();//.substring(0, 10)
    getTasks();
}