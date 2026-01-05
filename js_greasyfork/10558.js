// ==UserScript==
// @name       jawz Hybrid - Available Tasks +
// @version    1.5
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10558/jawz%20Hybrid%20-%20Available%20Tasks%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/10558/jawz%20Hybrid%20-%20Available%20Tasks%20%2B.meta.js
// ==/UserScript==

var task = $('h1').text().trim().substring(0, 10);
var tasks, pay, earnings = '$0.00';

function getTasks() {
	$.get('http://www.gethybrid.io/workers/projects')
    .done(function(d) {
        var data = $(d);
        var links = data.find('a:contains(' + task + ')');
        tasks = links.parent().next().text();
        pay = links.parent().next().next().text();
        $('h1').append('<br><b><font size="2">Available Tasks:</b> ' + tasks + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Pay:</b> ' + pay + '</font></b>')
    });
}

function getPay() {
	$.get('http://www.gethybrid.io/workers/payments')
    .done(function(d) {
        var data = $(d);
        earnings = data.find('input[type="submit"]');
        earnings = earnings.val().replace('Get paid', '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Earnings Available</b>');
        $('h1').append('<font size="2">' + earnings + '</font>')
    });
}

$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});

getTasks();
getPay();
