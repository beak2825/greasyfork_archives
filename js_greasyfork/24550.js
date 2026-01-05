// ==UserScript==
// @name         Kitt3
// @namespace    http://www.jobillico.com/
// @version      1.2
// @description  Ajoute des fonctionalités de recherche au CRM
// @author       Gabriel Soucy
// @match        http://crm.jobillico.com/companies/view-company/*
// @downloadURL https://update.greasyfork.org/scripts/24550/Kitt3.user.js
// @updateURL https://update.greasyfork.org/scripts/24550/Kitt3.meta.js
// ==/UserScript==

var menu = $('#menu').find('li:first a').attr('title');
if (menu == "Dashboard") {
     var histo = 'Hiring history';
     var doubl = 'Duplicate';
     var mod = 'Change/Add informations';
     var stat = 'Change status';
 } else {
     var histo = 'Historique de recrutement';
     var doubl = 'Doublon';
     var mod = 'Modifier/Ajouter informations';
     var stat = 'Changer le statut';
 }
sdfasdfasdfasdfasdfasdfaf


var crm = window.location.href.slice(48);
var space = '<div style="margin: 5px;">&nbsp;</div>';
var rec = '<div class="action-col"><h2 class="title-col">KITT</h2><div class="menu-list"><a target="_blank" href="http://kitt.jobillico.com/index.php?page=kitt&amp;searchtype=CRM&amp;kword='+crm+'&amp;submit="><span class="add">'+histo+'</span></a></div>';
var doublon = '<div class="menu-list"><a href="" onclick="window.open(\'http://google.com/signalement.php?type=1&amp;crm='+crm+'\', \'_blank\')"><span class="add">'+doubl+'</span></a></div>';
var info = '<div class="menu-list"><a href="" onclick="window.open(\'dfadfadfasdfasdfasdf/signalement.php?type=3&amp;crm='+crm+'\', \'_blank\')"><span class="add">'+mod+'</span></a></div>';
var status = '<div class="menu-list"><a href="" onclick="window.open(\'http://kitt.jobillico.com/signalement.php?type=2&amp;crm='+crm+'\', \'_blank\')"><span class="add">'+stat+'</span></a></div>';
var divend = '</div>';

$(space+rec+doublon+info+status+divend).insertAfter( ".action-col" );