// ==UserScript==
// @name         DB SK
// @namespace    https://greasyfork.org/ru/users/229054-rovor
// @version      1.5
// @description  WebSQL script
// @author       Rovor
// @match        http://*uni1.spacekings.ru/galaxy.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376907/DB%20SK.user.js
// @updateURL https://update.greasyfork.org/scripts/376907/DB%20SK.meta.js
// ==/UserScript==

(function() {
var planet = Array();
var planetname = Array();
var player = Array();
var alliance = Array();
var place = Array();
var db = openDatabase("SK", "1", "Space kings: Players", 200000);
var galaxy = Number($("[name='galaxy']")[0].value);
var system = Number($("[name='system']")[0].value);
    if (galaxy == 1 && system ==1) {
        db.transaction(function(tx) {tx.executeSql("CREATE TABLE players (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, galaxy INTEGER, system INTEGER, planet INTEGER, planetname TEXT, name TEXT, alliance TEXT,top INTEGER);")});
    }
var count = $(".galaxy_row");
count.each(function(i, elem){
planet[i] = Number(elem.children[1].innerText);
planetname[i] = elem.children[3].innerText;
player[i] = elem.children[6].innerText;
alliance[i] = elem.children[7].innerText;
        if (!!elem.children[6].children[0]) {
            place[i] = Number(elem.children[6].children[0].attributes[1].value.substr(elem.children[6].children[0].attributes[1].value.indexOf("Место ")+6,elem.children[6].children[0].attributes[1].value.indexOf("</td")-elem.children[6].children[0].attributes[1].value.indexOf("Место ")-6));
        }
db.transaction(function(tx) {tx.executeSql("INSERT INTO players (galaxy, system, planet, planetname, name, alliance, top) VALUES (?,?,?,?,?,?,?);",[galaxy,system,planet[i],planetname[i],player[i],alliance[i],place[i]])});
   })
function submit(){
if (($("[name~='system']")[0].value != 499 || $("[name~='galaxy']")[0].value != 9)) {
    if ($("[name~='system']")[0].value != 499){
galaxy_submit('systemRight');
    }
    else {
$("[name~='system']")[0].value = 1;
galaxy_submit('galaxyRight');
    }}}
    var s = count.length * 150;
    setTimeout(submit,s);
})();
