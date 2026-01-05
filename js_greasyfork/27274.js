// ==UserScript==
// @name           Earth Empires Editor
// @namespace      Earth Empires Editor
// @author         Jabroni1134
// @description    Earth Empires Editor (EEE) adds several easy to use functions for EE.
// @include	   	   http://*.earthempires.com/*
// @include	   	   https://*.earthempires.com/*
// @exclude		   http://*.earthempires.com/loggedin
// @exclude		   https://*.earthempires.com/loggedin
// @match          http://*.earthempires.com/*
// @match          https://*.earthempires.com/*
// @version        1.15
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_listValues
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27274/Earth%20Empires%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/27274/Earth%20Empires%20Editor.meta.js
// ==/UserScript==

var scriptVersion=1.15;
var ChangeLog = scriptVersion+" Change Log: *Fixed some bugs on the AttackLog page.";

var path = window.location.toString();					// get the URL of the current page
var page = path.substring(path.lastIndexOf('/'));		// extract page name from URL

if(!GM_getValue('UNIQUEKEY',false)){
    var rand = Math.floor(Math.random()*10000000000000);
    GM_setValue('UNIQUEKEY',rand.toString());
}
var UNIQUEKEY = GM_getValue('UNIQUEKEY', false);

var turns = 0;
var turnsnum = Number($c("topbar").length) - 1;
turns = $c("topbar")[turnsnum].firstChild.firstChild.firstChild.innerHTML;
turns = Number(turns.replace(/\D/g, ''));
var cash = 0;
cash = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.innerHTML;
cash = Number(cash.replace(/\D/g, ''));
var start_pos =$c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.title.indexOf('(');
var cashturns = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.title.substring(0, start_pos)
cashturns = cashturns.replace(/\D/g,'');
if(cashturns == ""){
    cashturns = 300;
}
cashturns = Number(cashturns);
if(cashturns <= 20 && cashturns != ""){
    $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.style.color = 'RED';
    $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.style.fontSize = 'large';
    $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.innerHTML = 'Cash: '+cash.toLocaleString()+'('+cashturns+' turns)';
}

var bushels = 0;
bushels = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.innerHTML;
bushels = Number(bushels.replace(/\D/g, ''));
start_pos = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.title.indexOf('(');
var bushelsturns = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.title.substring(0, start_pos)
bushelsturns = Number(bushelsturns.replace(/\D/g,''));
if(bushelsturns == ""){
    bushelsturns = 300;
}
bushelsturns = Number(bushelsturns);
if(bushelsturns <= 20 && bushelsturns != ""){
    $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.style.color = 'RED';
    $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.style.fontSize = 'large';
    $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.innerHTML = 'Food: '+bushels.toLocaleString()+'('+bushelsturns+' turns)';
}





//==========================================
//Get/Set Functions
//Prefixes server name to settings
//==========================================
function getSetting(key,value){
    if (typeof value == "float") value+="";
    return GM_getValue(key,value);
}

function setSetting(key,value){
    if (typeof value == "float") value+="";
    return GM_setValue(key,value);
}

// Simple replacement of getelementbyid with $ to save typing
function $(variable)
{
    if(!variable) return;
    if (document.getElementById(variable)) return document.getElementById(variable);
}

// Simple replacement of getelementbyclass with $ to save typing
function $c(variable)
{
    if(!variable) return;
    if (document.getElementsByClassName(variable)) return document.getElementsByClassName(variable);
}

// Simple replacement of getelementbyname with $ to save typing
function $n(variable)
{
    if(!variable) return;
    if (document.getElementsByName(variable)) return document.getElementsByName(variable);
}

function parseNumber (val) {
  val = val.replace(/,/g, '');
  var multiplier = val.substr(-1).toLowerCase();
  if (multiplier == "k"){
    return parseFloat(val) * 1000;
  }else if (multiplier == "m"){
    return parseFloat(val) * 1000000;
  }else{
    return val;
  }
}
function cleanAttackLog(){
    var thisTime = new Date().getTime();
    var clean = thisTime - 60*60*24;
    if(getSetting( 'AttackLogLastClean', '0' ) < clean){
        setSetting( 'AttackLogLastClean', thisTime.toString() );
        var AttackLog = getSetting( 'AttackLog', '' )
        var AttackLogArray = AttackLog.split('::::::');
        var curTime = new Date().getTime();
        var youngestTime = curTime - 60*60*24*1000;
        if(AttackLogArray.length != 0){
            for(var i=0; i<AttackLogArray.length; ++i){
                var ALAS = AttackLogArray[i].split('::');
                if(ALAS.length <= 3){ continue; }
                if(youngestTime >= ALAS[1]){
                    AttackLog.split("::::::"+ALAS[0]+"::"+ALAS[1])
                    setSetting( 'AttackLog', AttackLog[0] );
                    continue;
                }
            }
        }
    }
}

//==========================================
// Check if new install
//==========================================
function installCheck(){
        var OldVersion = parseFloat(GM_getValue("scriptVersion",0+""));
        var NewVersion = parseFloat(scriptVersion);
        if (OldVersion===null || OldVersion==="" || OldVersion=="0.1"){
            GM_setValue("scriptVersion",NewVersion+"");
            insertNotification("You have sucessfully installed Earth Empires Editor Version: "+NewVersion+" to your web browser.<br /><br/>"+ChangeLog);
            return;
        } else if (NewVersion>OldVersion){
            GM_setValue("scriptVersion",NewVersion+"");
            insertNotification("You have sucessfully upgraded Earth Empires Editor From ("+OldVersion+") To ("+NewVersion+").<br/><br/>"+ChangeLog);
        }
}
function insertNotification(message){
    if (message !== null)
    {
        var notification = document.createElement("div");
        notification.setAttribute('id', 'gm_update_alert');
        var close = document.createElement("div");
        close.setAttribute('id', 'gm_update_alert_button_close');
        close.innerHTML = "Click to hide";
        close.addEventListener('click', function(event) {
            document.body.removeChild($('gm_update_alert'));
            document.body.removeChild($('gm_update_alert_button_close'));
        }, true);
        notification.innerHTML = '<div id="gm_update_title">Earth Empires Editor Notification</div><hr class="cphr" /><p>' + message + '</p>';
        notification.appendChild(close);
        document.body.insertBefore(notification, document.body.firstChild);
    }
}

//NOTE: These are simpy defaults. There's no need to edit these here in the script.
var MESSAGE_CLASS = "notifier";
var MESSAGE_CLASS_ERROR = "notifierError";

GM_addStyle('.notifier {background-color: Black;border: solid 1px;color: white;padding: 10px 10px 10px 10px;}}'+
            '.notifierError {background-color: Black;border: solid 2px;color: red;padding: 10px 10px 10px 10px;}}'+
            'hr.cphr {color: orange;  width: 400px;}'+
            '.cpscripttimes {text-align: center;margin:0 auto;width:200px;background-color: #191919;border: #333333 solid 1px;padding-bottom: 10px;color: white;margin-top: 10px;font-size: 8px;opacity: 0.82;  z-index: 0;}'+
            '#gm_update_alert {position: relative;top: 0px;left: 0px;margin:0 auto;width:600px;background-color: #191919;text-align: center;font-size: 11px;font-family: Tahoma;border: #333333 solid 1px;margin-bottom: 10px;padding-left: 0px;padding-right: 0px;padding-top: 10px;padding-bottom: 10px;opacity: 0.82;color: white;}'+
            '.gm_update_alert_buttons {'+
            '  position: relative;'+
            '  top: -5px;'+
            '  margin: 5px;'+
            '}'+
            '#gm_update_alert_button_close {'+
            '  position: absolute;'+
            '  right: 20px;'+
            '  top: 20px;'+
            '  padding: 3px 5px 3px 5px;'+
            '  border-style: outset;'+
            '  border-width: thin;'+
            '  z-index: 11;'+
            '  background-color: orange;'+
            '  color: #FFFFFF;'+
            '  cursor:pointer;'+
            '}'+
            '.gm_update_alert_buttons span, .gm_update_alert_buttons span a  {'+
            '  text-decoration:underline;'+
            '  color: #003399;'+
            '  font-weight: bold;'+
            '  cursor:pointer;'+
            '}'+
            '.gm_update_alert_buttons span a:hover  {'+
            '  text-decoration:underline;'+
            '  color: #990033;'+
            '  font-weight: bold;'+
            '  cursor:pointer;'+
            '}'+
            '#gm_update_title {'+
            '  font-weight:bold;'+
            '  color:orange;'+
            '}'+
            '.right_Menu {'+
            '	color: gold;'+
            '	font-weight: bold;'+
            '  font-size: 11px;'+
            '  cursor:pointer;'+
            '}'+
            '.right_MenuHeader {'+
            '	color: gold;'+
            '	font-weight: bold;'+
            '  font-size: 11px;'+
            '}'+
            '.left_Menu {'+
            '	color: #DDDDDD;'+
            '  font-size: 12px;'+
            '	font-weight: bold;'+
            '}');
//==========================================
// BUILD SCREEN
//==========================================
function page_build() {
    function UpdateTotals(){
        var t = $("contentarea").getElementsByTagName('input');
        var total = 0;
        var x = 0;
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text"){
                if(t[i].name == "build[cs]") continue;
                x = parseNumber(t[i].value);
                if(isNaN(x)) x = 0;
                total = Number(total) + Number(x);
            }
        }
        total = Math.ceil(total / BPT);
        total = Number($n("build[cs]")[0].value) + total;
        if(total > turns) {
            $("TotalTurns").innerHTML = "<font color='RED'><b>Turns: "+total+"</B></font>";
        }else{
            $("TotalTurns").innerHTML = "Turns: "+total;
        }
    }
    function PostToBox(variable){
        var textbox =  variable.parentNode.parentNode.cells[2].firstChild.value;
        var id = variable.innerHTML;
        switch (id){
            case "-":
                var newnum = Number(textbox) - Number(BPT);
                if(Number(newnum) < Number(0)){
                    newnum = 0;
                }
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(newnum);
                break;
            case "+":
                var newnum = Number(textbox) + Number(BPT);
                if(Number(newnum) > Number(mBuild2)){
                    break;
                }
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(textbox) + Number(BPT);
                break;
            case "Max BPT":
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(maxBPTnum);
                break;
            case "Max":
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(mBuild2);
                break;
            case "+4":
                var newnum = Number(textbox) + Number(4);
                if(Number(newnum) > Number(mBuild2) || Number(newnum) > Number(turns)){
                    break;
                }
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(newnum);
                break;
            case "-4":
                var newnum = Number(textbox) - Number(4);
                if(Number(newnum) < Number(0)){
                    newnum = 0;
                }
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(newnum);
                break;
            case "Max CS":
                if(Number(turns) > Number(mBuild2)){
                    variable.parentNode.parentNode.cells[2].firstChild.value = Number(mBuild2);
                }else{
                    variable.parentNode.parentNode.cells[2].firstChild.value = Number(turns);
                }
                break;
            case "0":
                variable.parentNode.parentNode.cells[2].firstChild.value = Number(0);
                break;
            default:

                break;
        }
        x = UpdateTotals();
    }
    var BPT = $c("BPT")[0].innerHTML;
    var table = $c("contenttable")[0];
    var mBuild = $("contentarea");
    var mBuild2 = mBuild.getElementsByTagName('span')[1].innerHTML;
    mBuild2 = parseFloat(mBuild2.replace(/,/g, ''));
    var row;
    var x;
    var maxBPTnum = 0;
    var turnNumber = 0;
    for (var i = 0; i<50; i++) {
        if(Number(maxBPTnum) + Number(BPT) > Number(mBuild2)){
            break;
        }
        maxBPTnum = Number(maxBPTnum) + Number(BPT);
   }
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        x = row.insertCell(-1);
        x.align = "left";
        if (row.cells[0].innerHTML == "Structure") continue;
        if (row.cells[0].innerHTML == "Unused Land Area"){
            i++;
            row = table.rows[i];
            x = row.insertCell(-1);
            x.id = "TotalTurns";
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.innerHTML = "Turns: "+turnNumber;
            break;
        }
        row.cells[2].firstChild.onkeyup  = function(){UpdateTotals();};
        if (row.cells[0].innerHTML == "Construction Sites"){
            x.innerHTML = "<a id='"+i+"_cssubfour'>-4</a> | <a id='"+i+"_zero'>0</a> | <a id='"+i+"_csaddfour'>+4</a> | <a id='"+i+"_csmaxbuild'>Max CS</a>";
            x.style='cursor: pointer;';
            $(i+"_cssubfour").addEventListener("click", function(){PostToBox(this);}, false);
            $(i+"_zero").addEventListener("click", function(){PostToBox(this);}, false);
            $(i+"_csaddfour").addEventListener("click", function(){PostToBox(this);}, false);
            $(i+"_csmaxbuild").addEventListener("click", function(){PostToBox(this);}, false);
            continue;
        }
        x.innerHTML = "<a id='"+i+"_minus'>-</a> | <a id='"+i+"_zero'>0</a> | <a id='"+i+"_addBPT'>+</a> | <a id='"+i+"_maxBPT'>Max BPT</a> | <a id='"+i+"_maxbuild'>Max</a>";
        x.style='cursor: pointer;';
        $(i+"_minus").addEventListener("click", function(){PostToBox(this);}, false); 
        $(i+"_zero").addEventListener("click", function(){PostToBox(this);}, false); 
        $(i+"_addBPT").addEventListener("click", function(){PostToBox(this);}, false);
        $(i+"_maxBPT").addEventListener("click", function(){PostToBox(this);}, false);
        $(i+"_maxbuild").addEventListener("click", function(){PostToBox(this);}, false);
    }

  //  window.alert(BPT[0].innerHTML);
}
/*
*  END: BUILD PAGE
*/

//==========================================
// RESEARCH SCREEN
//==========================================
function page_research() {
    function UpdateTotals(){
        var t = $("contentarea").getElementsByTagName('input');
        var total = 0;
        var x = 0;
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text"){
                x = parseNumber(t[i].value);
                if(isNaN(x)) x = 0;
                total = Number(total) + Number(x);
            }
        }
        total = Math.ceil(total / TPT);
        if(total > turns) {
            $("TotalTurns").innerHTML = "<font color='RED'><b>Turns: "+total+"</B></font>";
        }else{
            $("TotalTurns").innerHTML = "Turns: "+total;
        }
    }
    function PostToBox2(variable){
        var textbox =  variable.parentNode.parentNode.cells[3].firstChild.value;
        var id = variable.innerHTML;
        switch (id){
            case "-":
                var newnum = Number(textbox) - Number(TPT);
                if(Number(newnum) < Number(0)){
                    newnum = 0;
                }
                variable.parentNode.parentNode.cells[3].firstChild.value = Number(newnum);
                break;
            case "+":
                var newnum = Number(textbox) + Number(TPT);
                if(Number(newnum) > Number(maxTech)){
                    break;
                }
                variable.parentNode.parentNode.cells[3].firstChild.value = newnum;
                break;
            case "0":
                variable.parentNode.parentNode.cells[3].firstChild.value = Number(0);
                break;
            case "#":
                var input = prompt("Choose the amount of turns you want to use for this research item.", "0");
                if (input != null && isNaN(input) === false) {
                    var math = Number(TPT) * Number(input);
                    variable.parentNode.parentNode.cells[3].firstChild.value = Number(math);
                }
                break;
            default:

                break;
        }
        x = UpdateTotals();
    }
    var TPT = $c("TPT")[0].innerHTML;
    TPT = parseFloat(TPT.replace(/,/g, ''));
    var tablenum = Number($c("turntable").length) - 1;
    var table = $c("turntable")[tablenum];
    var maxTech = $("contentarea");
    maxTech = maxTech.getElementsByTagName('span')[1].innerHTML;
    maxTech = parseFloat(maxTech.replace(/,/g, ''));
    var row;
    var x;
    var maxTPTnum = 0;
    var turnNumber = 0;
    for (var i = 0; i<135; i++) {
        if(Number(maxTPTnum) + Number(TPT) > Number(maxTech)){
            break;
        }
        maxTPTnum = Number(maxTPTnum) + Number(TPT);
   }
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        row.cells[3].firstChild.onkeyup = function(){UpdateTotals();};
        x = row.insertCell(-1);
        x.align = "left";
        x.style.whiteSpace = 'nowrap';
        if (row.cells[0].innerHTML == "Technology") continue;
        x.innerHTML = "<a id='"+i+"_minus'>-</a> | <a id='"+i+"_zero'>0</a> | <a id='"+i+"_addTPT'>+</a> | <a id='"+i+"_Turns'>#</a>";
        x.style.cursor ='pointer';
        $(i+"_minus").addEventListener("click", function(){PostToBox2(this);}, false);
        $(i+"_zero").addEventListener("click", function(){PostToBox2(this);}, false);
        $(i+"_addTPT").addEventListener("click", function(){PostToBox2(this);}, false);
        $(i+"_Turns").addEventListener("click", function(){PostToBox2(this);}, false);
        if (row.cells[0].innerHTML == "SDI") {
            i++;
            row = table.rows[i];
            x = row.insertCell(-1);
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.id = "TotalTurns";
            x.innerHTML = "Turns: "+turnNumber;
            break;
        }
    }
  //  window.alert(BPT[0].innerHTML);
}
/*
*  END: RESEARCH PAGE
*/

//==========================================
// MARKET SCREEN
//==========================================
function page_market() {
    function UpdateCosts(){
        var t = $c("contenttable ct")[0].getElementsByTagName('input');
        var total = 0;
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text"){
                x = t[i].parentNode.parentNode.cells[2].innerHTML;
                var n = x.indexOf('<');
                x = x.substring(1, n != -1 ? n : x.length);
                x = parseNumber(t[i].value) * Number(x);
                if(isNaN(x)) x = 0;
               t[i].parentNode.parentNode.cells[7].innerHTML = "$"+x.toLocaleString();
                total = Number(total) + Number(x);
            }
        }
        if(Number(total) > cash){
            $("TotalCost").innerHTML = "<font color='RED'><b>Total Cost: $"+total.toLocaleString()+"</b></font>";
        }else{
            $("TotalCost").innerHTML = "Total Cost: $"+total.toLocaleString();
        }
    }
    var table = $c("contenttable ct")[0];
    var row;
    var x;
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        x = row.insertCell(-1);
        x.align = "left";
        x.style.whiteSpace = 'nowrap';
        x.id = i+"_Costs";
        if (row.cells[0].innerHTML == "Item") continue;
        x.innerHTML = "$0";
        row.cells[6].firstChild.onkeyup = function(){UpdateCosts();};
        row.cells[5].addEventListener("click", function(){UpdateCosts();}, false);        
        if (row.cells[0].innerHTML == "Oil Barrels") {
            i++;
            row = table.rows[i];
            x = row.insertCell(-1);
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.id = "TotalCost";
            x.innerHTML = "Total Cost: $0";
            row.cells[0].colSpan ='6';
            x.colSpan = '2';
            break;
        }
    }

  //  window.alert(BPT[0].innerHTML);
}
/*
*  END: MARKET PAGE
*/

//==========================================
// MARKET BUY TECH SCREEN
//==========================================
function page_marketTech() {
    function UpdateCosts(){
        var t = $c("contenttable ct")[0].getElementsByTagName('input');
        var total = 0;
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text"){
                x = t[i].parentNode.parentNode.cells[2].innerHTML;
                var n = x.indexOf('<');
                x = x.substring(1, n != -1 ? n : x.length);
                x = parseNumber(t[i].value) * Number(x);
                if(isNaN(x)) x = 0;
               //t[i].parentNode.parentNode.cells[7].innerHTML = "$"+x.toLocaleString();
                total = Number(total) + Number(x);
            }
        }
        if(Number(total) > cash){
            $("TotalCost").innerHTML = "<font color='RED'><b>Total Cost: $"+total.toLocaleString()+"</b></font>";
        }else{
            $("TotalCost").innerHTML = "Total Cost: $"+total.toLocaleString();
        }
    }
    var table = $c("contenttable ct")[0];
    var row;
    var x;
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        row.cells[6].firstChild.onkeyup = function(){UpdateCosts();};
        row.cells[5].addEventListener("click", function(){UpdateCosts();}, false);
        if (row.cells[0].innerHTML.slice(0, 3) == "SDI") {
            i++;
            row = table.rows[i];
            row.cells[0].colSpan ='4';
            x = row.insertCell(-1);
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.id = "TotalCost";
            x.innerHTML = "Total Cost: $0";
            x.colSpan = '3';
            break;
        }
    }

  //  window.alert(BPT[0].innerHTML);
}

//==========================================
// MARKET SELL GOODS AND TECH SCREEN
//==========================================
function page_marketSell() {
    function UpdateCosts(){
        var total = 0;
        var total2 = 0;
        var tottax = 0;
        var t = $c("contenttable ct")[0].getElementsByTagName('input');
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text" && t[i].name.slice(0, 1) == "q"){
                x = t[i].parentNode.parentNode.cells[4].firstChild.value;
                x = parseNumber(t[i].value) * Number(x);
                if(isNaN(x)) x = 0;
               t[i].parentNode.parentNode.cells[6].innerHTML = "<font color='green'>$"+x.toLocaleString()+"</font>";
                total = Number(total) + Number(x);
            }
        }
        tottax = (tax / 100) * total;
        tottax = Math.ceil(tottax);
        total2 = total - tottax;
        total2 = Math.ceil(total2);
        $("TotalCost").innerHTML = "<b>$"+total.toLocaleString()+"</b><BR><font color='red'><b>$"+tottax.toLocaleString()+"</b></font><BR><font color='green'><b>$"+total2.toLocaleString()+"</b></font>";
    }
    var table = $c("contenttable ct")[0];
    var row;
    var x;

    var tax = $c("mTax")[0].innerHTML.replace(/\D/g, '');
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        x = row.insertCell(-1);
        x.align = "right";
        x.style.whiteSpace = 'nowrap';
        x.id = i+"_Costs";
        if (row.cells[0].innerHTML == "Item"){
            x.innerHTML = "Income";
            continue;
        }
        if (row.cells[0].innerHTML === "") {
            continue;
        }
        x.innerHTML = "<font color='green'>$0</font>";
        row.cells[4].firstChild.onkeyup = function(){UpdateCosts();};
        row.cells[5].firstChild.onkeyup = function(){UpdateCosts();};
        row.cells[5].addEventListener("click", function(){UpdateCosts();}, false);
        if (row.cells[0].innerHTML.slice(0, 3) == "Oil" || row.cells[0].innerHTML.slice(0, 3) == "SDI") {
            if(row.cells[0].innerHTML.slice(0, 3) == "SDI") i++;
            i++;
            row = table.rows[i];
            row.cells[0].colSpan ='5';
            x = row.insertCell(-1);
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.innerHTML = "Income:<BR>Tax:<BR><font color='green'><b>Profit:</b></font>";
            x = row.insertCell(-1);
            x.align = "Right";
            x.style.whiteSpace = 'nowrap';
            x.id = "TotalCost";
            x.innerHTML = "$0<BR>"+tax+"%<BR>$0";
            break;
        }
    }

  //  window.alert(BPT[0].innerHTML);
}
/*
*  END: MARKET PAGE
*/

//==========================================
// PRIVATE MARKET SCREEN
//==========================================
function page_marketPrivate() {
    function UpdateCosts(){
        var t = $c("contenttable")[0].getElementsByTagName('input');
        var total = 0;
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text"){
                x = t[i].parentNode.parentNode.cells[2].innerHTML.slice(1);
                x = parseNumber(t[i].value) * Number(x);
                if(isNaN(x)) x = 0;
               t[i].parentNode.parentNode.cells[6].innerHTML = "$"+x.toLocaleString();
                total = Number(total) + Number(x);
            }
        }
        if(Number(total) > cash){
            $("TotalCost").innerHTML = "<font color='RED'><b>Total Cost: $"+total.toLocaleString()+"</b></font>";
        }else{
            $("TotalCost").innerHTML = "Total Cost: $"+total.toLocaleString();
        }
    }
    var table = $c("contenttable")[0];
    var row;
    var x;
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        x = row.insertCell(-1);
        x.align = "Right";
        x.style.whiteSpace = 'nowrap';
        x.id = i+"_Costs";
        if (row.cells[0].innerHTML == "Unit"){ x.innerHTML = "Cost"; continue; }
        x.innerHTML = "$0";
        row.cells[5].firstChild.onkeyup = function(){UpdateCosts();};
        row.cells[4].addEventListener("click", function(){UpdateCosts();}, false);        
        if (row.cells[0].innerHTML == "Bushels") {
            i++;
            row = table.rows[i];
            x = row.insertCell(-1);
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.id = "TotalCost";
            x.innerHTML = "Total Cost: $0";
            row.cells[0].colSpan ='5';
            x.colSpan = '2';
            break;
        }
    }

  //  window.alert(BPT[0].innerHTML);
}
/*
*  END: MARKET PAGE
*/

//==========================================
// PRIVATE MARKET SCREEN
//==========================================
function page_marketPrivateSellMilitary() {
    function UpdateCosts(){
        var t = $c("contenttable")[0].getElementsByTagName('input');
        var total = 0;
        for (var i = 0; t[i]; i++) {
            if(t[i].type == "text"){
                x = t[i].parentNode.parentNode.cells[1].innerHTML.slice(1);
                x = parseNumber(t[i].value) * Number(x);
                if(isNaN(x)) x = 0;
               t[i].parentNode.parentNode.cells[4].innerHTML = "$"+x.toLocaleString();
                total = Number(total) + Number(x);
            }
        }
            $("TotalCost").innerHTML = "<font color='Green'><b>Total Profit: $"+total.toLocaleString()+"</b></font>";
    }
    var table = $c("contenttable")[0];
    var row;
    var x;
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        x = row.insertCell(-1);
        x.align = "Right";
        x.style.whiteSpace = 'nowrap';
        x.id = i+"_Costs";
        if (row.cells[0].innerHTML == "Unit"){ x.innerHTML = "Cost"; continue; }
        x.innerHTML = "$0";
        row.cells[3].firstChild.onkeyup = function(){UpdateCosts();};
        row.cells[3].addEventListener("click", function(){UpdateCosts();}, false);
        if (row.cells[0].innerHTML == "Food") {
            i++;
            row = table.rows[i];
            x = row.insertCell(-1);
            x.align = "right";
            x.style.whiteSpace = 'nowrap';
            x.id = "TotalCost";
            x.innerHTML = "Total Cost: $0";
            row.cells[0].colSpan ='3';
            x.colSpan = '2';
            break;
        }
    }

  //  window.alert(BPT[0].innerHTML);
}
/*
*  END: MARKET PAGE
*/

//==========================================
// EXPLORE SCREEN
//==========================================
function page_explore() {
    function Update(){
        x = $n("turns")[0].value;
        if(isNaN(x)) x = 0;
        x = x * Number(explorerate);
        $("totalland").innerHTML = "<font color='Green'><b>You will gain "+x+" Acres of land. (Humanitarians are not factored in.)</b></font>";
    }
    var explorerates = [99999,99999,99999,99999,99999,99999,21280,17882,15389,13484,11979,10761,9755,8909,8189,7569,7028,6553,6132,5757,5420,5116,4841,4589,4360,4149,3954,3774,3608,3453,3308,3173,3047,2928,2816,2711,2612,2518,2429,2345,2265,2189,2117,2048,1983,1920];
    var exploreratesrep = [99999,99999,99999,99999,99999,99999,99999,21620,18629,16342,14537,13075,11868,10853,9989,9245,8596,8026,7521,7071,6666,6302,5971,5669,5394,5141,4907,4691,4491,4305,4132,3970,3818,3676,3542,3416,3297,3184,3077,2977,2881,2789,2703,2620,2541,2466,2394,2325,2259,2196,2135,2077,2021,1967,1915];
    var x;
    var y;
    var div = $("contentarea");
    var totalland = 0;
    var acreshave = $("contentarea").getElementsByClassName("positive")[0].innerHTML;
    acreshave = Number(parseFloat(acreshave.replace(/,/g, '')));
    var unusedacres = $("contentarea").getElementsByClassName("positive")[1].innerHTML;
    unusedacres = Number(parseFloat(unusedacres.replace(/,/g, '')));
    var maxlandgrab = acreshave - unusedacres;
    var n = div.innerHTML.indexOf('about ');
    n = n + 5;
    var m = div.innerHTML.indexOf('acres');
    var explorerate = div.innerHTML.slice(n, m);
    if(isNaN(explorerate)) explorerate = 1;
    for (x = 0; x < explorerates.length; x++) {
        if(explorerates[x] <= Number(acreshave)){
            break;
        }
    }
    if((Number(x)-1) !== Number(explorerate)) explorerates = exploreratesrep;
    var maxtable = turns;
    var table = "<table class='contenttable ct' align='center'><tr><td style='background-color:  #400000; font-weight: bold; width: 110px;'>Turns Used</td><td style='background-color:  #400000; font-weight: bold; width: 110px;'>  Land gained  </td><td style='background-color:  #400000; font-weight: bold; width: 110px;'>  Total land  </td></tr>";
    var color = "#000000";
    var curexplorerate = 0;
    var lastexplorerate = 0;
    for (var i = 1; i <= maxtable; i++) {
        if (i * Number(explorerate) > maxlandgrab) break;
        for (x = 0; x < explorerates.length; x++) {
            if(explorerates[x] <= (i * Number(explorerate) + Number(acreshave))){
                curexplorerate = x;
                x--;
                break;
            }
        }
        if(lastexplorerate !== curexplorerate){
            table = table + "<tr><td style='background-color: #8B0000;' colSpan='3'>Explore rate will change to "+x+" below this.</td></tr>";
            lastexplorerate = curexplorerate;
        }

        table = table + "<tr><td style='background-color: "+color+";'>"+i+"</td><td style='background-color: "+color+";'>"+i * Number(explorerate)+" Acres</td><td style='background-color: "+color+";'>"+ (i * Number(explorerate) + Number(acreshave)) +"</td></tr>";
        if(color == "#000000"){ color = "#222222"; }else{ color = "#000000"; }
    }
    i--;
    table = table + "</table>";
    div.innerHTML = div.innerHTML + "<br><br><div id='totalland'>You can explore a max of "+ i +" turns.</div><br /><br /><div id='extrac'>"+table+"</div>";
    var t = div.getElementsByTagName('input');
    $n("turns")[0].onkeyup = function(){Update();};
}
/*
*  END
*/

//==========================================
// WAR SCREEN
//==========================================




function page_war() {
    var listening = false;
    var myRef = false;
    var lastpost = false;

    function ChangeAttack(){
        var miltable = $c("mil_table")[0];
        $c("contenttable")[0].rows[1].cells[0].style.display = '';
        $c("contenttable")[0].rows[1].cells[1].style.display = 'none';
        switch ( $('ATTTYPE').value){
            case "Standard":
            case "Planned":
                miltable.rows[1].style.display = '';
                miltable.rows[2].style.display = '';
                miltable.rows[3].style.display = '';
                break;
            case "Guerilla":
                miltable.rows[2].value = 0;
                miltable.rows[3].value = 0;
                miltable.rows[1].style.display = '';
                miltable.rows[2].style.display = 'none';
                miltable.rows[3].style.display = 'none';
                break;
            case "Bombing":
                miltable.rows[1].value = 0;
                miltable.rows[3].value = 0;
                miltable.rows[1].style.display = 'none';
                miltable.rows[2].style.display = '';
                miltable.rows[3].style.display = 'none';
                break;
            case "Artillery":
                miltable.rows[1].value = 0;
                miltable.rows[2].value = 0;
                miltable.rows[1].style.display = 'none';
                miltable.rows[2].style.display = 'none';
                miltable.rows[3].style.display = '';
                break;
            case "Declare":
                $c("contenttable")[0].rows[1].cells[0].style.display = 'none';
                miltable.rows[1].value = 0;
                miltable.rows[2].value = 0;
                miltable.rows[3].value = 0;
                                break;
            case "Missile":
                $c("contenttable")[0].rows[1].cells[0].style.display = 'none';
                $c("contenttable")[0].rows[1].cells[1].style.display = '';
                miltable.rows[1].value = 0;
                miltable.rows[2].value = 0;
                miltable.rows[3].value = 0;
                break;
        }
    }

      function monitor_PrepareAttack() {
         if($("attack_info")){
              var allInputs = $("attack_info").getElementsByTagName('input');
              for(var i=0; i<allInputs.length; ++i){
                  if(allInputs[i].value == "Send Attack"){
                      allInputs[i].removeAttribute('onclick');
                      allInputs[i].addEventListener("click", send_attack);
                      allInputs[i].addEventListener("click", monitor_SendAttack);
                  }
              }
         }else{
             setTimeout(function() { monitor_PrepareAttack(); }, 500);
         }
      }

      function monitor_SendAttack() {
          //Parse the results
          if($("warwrap")){
              if($("resend_button") && !listening){
                  $("resend_button").firstChild.removeAttribute('onclick');
                  $("resend_button").firstChild.addEventListener("click", send_attack);
                  $("resend_button").firstChild.addEventListener("click", monitor_SendAttack);
                  listening = true;
              }
              //LOG ATTACK
              var country = $('target_name').innerHTML;
              //RESULT PASS/FAIL
              var result = "FAILED";
              if($("warwrap").firstChild.getAttribute("class") == "positive"){
                  result = "SUCCESS";
              }
              //CURRENT TIME
              var d = new Date();
              var time = d.getTime();
              //TYPE
              var type = $('strike_type').innerHTML;
              //ATTACK GAINS
              var civs = 0;
              var oil = 0;
              var stoldcash = 0;
              var tech = 0;
              var acres = 0;
              if($('att_gains')){
                  var t = $('att_gains');
                  var children = t.children;
                  for (var i = 0; i < children.length; i++) {
                      var tc = children[i];
                      if(tc.innerHTML.includes("Civilians")){
                          civs = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Oil Barrels")){
                          oil = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("$")){
                          stoldcash = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Technology Points")){
                          tech = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Gained")){
                          var start_pos = tc.innerHTML.indexOf('Acres') + 1;
                          acres = tc.innerHTML.substring(start_pos)
                          acres = acres.replace(/\D/g,'');
                          continue;
                      }
                  }
              }
              //ATTACKER LOSSES
              var troops = 0;
              var jets = 0;
              var tanks = 0;
              if($('att_losses')){
                  var t = $('att_losses');
                  var children = t.children;
                  for (var i = 0; i < children.length; i++) {
                      var tc = children[i];
                      if(tc.innerHTML.includes("Troops")){
                          troops = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Jets")){
                          jets = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Tanks")){
                          tanks = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                  }
              }
              //DEFENDER LOSSES
              var ktroops = 0;
              var kturrets = 0;
              var ktanks = 0;
              if($('def_losses')){
                  var t = $('def_losses');
                  var children = t.children;
                  for (var i = 0; i < children.length; i++) {
                      var tc = children[i];
                      if(tc.innerHTML.includes("Troops")){
                          ktroops = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Turrets")){
                          kturrets = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                      if(tc.innerHTML.includes("Tanks")){
                          ktanks = tc.innerHTML.replace(/\D/g,'');
                          continue;
                      }
                  }
              }
              var t = oil+stoldcash+tech+acres+troops+jets+tanks+civs+ktroops+kturrets+ktanks;
              if(t == lastpost){
                  setTimeout(function() { monitor_SendAttack(); }, 100);
                  return;
              }
              var cash = 0;
              cash = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.innerHTML;
              cash = Number(cash.replace(/\D/g, ''));
              var start_pos =$c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.title.indexOf('(');
              var cashturns = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.title.substring(0, start_pos)
              cashturns = cashturns.replace(/\D/g,'');
              if(cashturns == ""){
                  cashturns = 300;
              }
              cashturns = Number(cashturns);
              if(cashturns <= 20 && cashturns != ""){
                  $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.style.color = 'RED';
                  $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.style.fontSize = 'large';
                  $c("topbar")[turnsnum].firstChild.firstChild.childNodes[1].firstChild.innerHTML = 'Cash: '+cash.toLocaleString()+'('+cashturns+' turns)';
              }

              var bushels = 0;
              bushels = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.innerHTML;
              bushels = Number(bushels.replace(/\D/g, ''));
              start_pos = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.title.indexOf('(');
              var bushelsturns = $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.title.substring(0, start_pos)
              bushelsturns = Number(bushelsturns.replace(/\D/g,''));
              if(bushelsturns == ""){
                  bushelsturns = 300;
              }
              bushelsturns = Number(bushelsturns);
              if(bushelsturns <= 20 && bushelsturns != ""){
                  $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.style.color = 'RED';
                  $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.style.fontSize = 'large';
                  $c("topbar")[turnsnum].firstChild.firstChild.childNodes[2].firstChild.innerHTML = 'Food: '+bushels.toLocaleString()+'('+bushelsturns+' turns)';
              }
              if(cashturns <= 1){
                  alert("WARNING: You are out of CASH!");
              }
              if(bushelsturns <= 1){
                  alert("WARNING: You are out of BUSHELS!");
              }
              lastpost = t;
              var AttackLog = getSetting( 'AttackLog', '' );
              var log = country+"::"+time+"::"+result+"::"+type+"::"+oil+"::"+stoldcash+"::"+tech+"::"+acres+"::"+troops+"::"+jets+"::"+tanks+"::"+civs+"::"+ktroops+"::"+kturrets+"::"+ktanks;
              setSetting('AttackLog', AttackLog+log+'::::::');
         }else{
             setTimeout(function() { monitor_SendAttack(); }, 500);
         }
      }



    function monitorPage() {
        myRef = window.open('about:blank','AttackMonitor','left=20,top=20,width=1100,height=700,scrollbars=1');
        myRef.document.body.innerHTML = ''; //FIREFOX OLD
        myRef.document.write('<meta content="Earth" name="keywords"><html><head><meta content="en-us" http-equiv="Content-Language"></head><body background="" bgcolor="black" link="#00C0FF" text="#DDDDDD" vlink="#d3d3d3">');
        myRef.document.write('<h1 style="text-align: center;"><strong>Attack Monitor!</strong></h1><h4 style="text-align: center;">(This will list all your attacks in the last 24 hours)</h4>');
        var AttackLog = getSetting( 'AttackLog', '' );
        if(AttackLog === ''){ return; }
        var AttackLogArray = AttackLog.split('::::::');
        var LastCountry = 0;
        if(AttackLogArray.length != 0){
            for(var i=0; i<AttackLogArray.length; ++i){
                var ALAS = AttackLogArray[i].split('::');
                if(ALAS.length <= 3){
                    myRef.document.write('<tr bgcolor="#400000">');
                    myRef.document.write('<td style="color: Red; text-align: center;" colspan="3">Total Attacks: '+totattacks+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Oil">'+totoil.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Cash">$'+totcash.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Tech">'+tottech.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Land">'+totland.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_LostTroops">'+totlosttroops.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_LostJets">'+totlostjets.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_LostTanks">'+totlosttanks.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledCivs">'+totkilledcivs.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledTroops">'+totkilledtroops.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledTurrets">'+totkilledturrets.toLocaleString()+'</td>');
                    myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledTanks">'+totkilledtanks.toLocaleString()+'</td>');
                    myRef.document.write('</tr>');
                    myRef.document.write('</table><br><br>');
                    continue;
                }
                if(LastCountry !== ALAS[0]){
                    if(LastCountry !== 0){
                        myRef.document.write('<tr bgcolor="#400000">');
                        myRef.document.write('<td style="color: Red; text-align: center;" colspan="3">Total Attacks: '+totattacks+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Oil">'+totoil.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Cash">$'+totcash.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Tech">'+tottech.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_Land">'+totland.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_LostTroops">'+totlosttroops.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_LostJets">'+totlostjets.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_LostTanks">'+totlosttanks.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledCivs">'+totkilledcivs.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledTroops">'+totkilledtroops.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledTurrets">'+totkilledturrets.toLocaleString()+'</td>');
                        myRef.document.write('<td style="color: Red; text-align: center;" id="Header_KilledTanks">'+totkilledtanks.toLocaleString()+'</td>');
                        myRef.document.write('</tr>');
                        myRef.document.write('</table><br><br>');
                    }
                    myRef.document.write('<table width="100%" border="1"><tbody><tr bgcolor="#400000"><td style="text-align: center;" colspan="14"><h4>'+ALAS[0]+'</h4></td></tr><tr bgcolor="#400000"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td id="Header_Stolen" style="text-align: center;" colspan="3">&nbsp;Stolen</td><td id="Header_MilLost" style="text-align: center;" colspan="3">&nbsp;Military Lost</td><td id="Header_MilKilled" style="text-align: center;" colspan="4">&nbsp;Killed</td></tr><tr bgcolor="#400000"><td style="text-align: center;">Time</td><td style="text-align: center;">Result</td><td style="text-align: center;">Type</td><td id="Header_Oil" style="text-align: center;">Oil</td><td id="Header_Cash" style="text-align: center;">Cash</td><td id="Header_Tech" style="text-align: center;">Tech</td><td id="Header_Land" style="text-align: center;">Land</td><td id="Header_LostTroops" style="text-align: center;">Troops</td><td id="Header_LostJets" style="text-align: center;">Jets</td><td id="Header_LostTanks" style="text-align: center;">Tanks</td><td id="Header_KilledCivs" style="text-align: center;">Civs Killed</td><td id="Header_KilledTroops" style="text-align: center;">Troops</td><td id="Header_KilledTurrets" style="text-align: center;">Turrets</td><td id="Header_KilledTanks" style="text-align: center;">Tanks</td></tr>');
                    LastCountry = ALAS[0];
                    var totoil = 0;
                    var totcash = 0;
                    var tottech = 0;
                    var totland = 0;
                    var totlosttroops = 0;
                    var totlostjets = 0;
                    var totlosttanks = 0;
                    var totkilledcivs = 0;
                    var totkilledtroops = 0;
                    var totkilledturrets = 0;
                    var totkilledtanks = 0;
                    var totattacks = 0;
                }
                totoil = Number(totoil) + Number(ALAS[4]);
                totcash = Number(totcash) + Number(ALAS[5]);
                tottech =Number(tottech) + Number(ALAS[6]);
                totland = Number(totland) + Number(ALAS[7]);
                totlosttroops = Number(totlosttroops) + Number(ALAS[8]);
                totlostjets = Number(totlostjets) + Number(ALAS[9]);
                totlosttanks = Number(totlosttanks) + Number(ALAS[10]);
                totkilledcivs = Number(totkilledcivs) + Number(ALAS[11]);
                totkilledtroops = Number(totkilledtroops) + Number(ALAS[12]);
                totkilledturrets = Number(totkilledturrets) + Number(ALAS[13]);
                totkilledtanks = Number(totkilledtanks) + Number(ALAS[14]);
                totattacks++;
                myRef.document.write('<tr bgcolor="#262626">');
                myRef.document.write('<td style="text-align: center;">'+new Date(Number(ALAS[1])).toLocaleTimeString()+'</td>');
                myRef.document.write('<td style="text-align: center;">'+ALAS[2]+'</td>');
                myRef.document.write('<td style="text-align: center;">'+ALAS[3]+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_Oil">'+Number(ALAS[4]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_Cash">$'+Number(ALAS[5]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_Tech">'+Number(ALAS[6]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_Land">'+Number(ALAS[7]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_LostTroops">'+Number(ALAS[8]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_LostJets">'+Number(ALAS[9]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_LostTanks">'+Number(ALAS[10]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_KilledCivs">'+Number(ALAS[11]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_KilledTroops">'+Number(ALAS[12]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_KilledTurrets">'+Number(ALAS[13]).toLocaleString()+'</td>');
                myRef.document.write('<td style="text-align: center;" id="Header_KilledTanks">'+Number(ALAS[14]).toLocaleString()+'</td>');
                myRef.document.write('</tr>');
            }
        }
    }


    $("submit_att_button").addEventListener("click", monitor_PrepareAttack, false);


    function Update(variable){
        var num = 0;
        switch (variable.innerHTML){
            case "0":
                variable.parentNode.cells[2].firstChild.value = 0;
                break;
            case "1k":
                variable.parentNode.cells[2].firstChild.value = 1000;
                break;
            case "10k":
                variable.parentNode.cells[2].firstChild.value = 10000;
                break;
            case "1/4":
                num = variable.parentNode.cells[1].firstChild.innerHTML;
                num = Number(parseFloat(num.replace(/,/g, '')));
                num = Number(num) / 4 - 1;
                num = Math.floor(num);
                variable.parentNode.cells[2].firstChild.value = num;
                break;
            case "1/3":
                num = variable.parentNode.cells[1].firstChild.innerHTML;
                num = Number(parseFloat(num.replace(/,/g, '')));
                num = Number(num) / 3 - 1;
                num = Math.floor(num);
                variable.parentNode.cells[2].firstChild.value = num;
                break;
        }
    }

    function UpdateEffectiveBreak(variable){
        var num = 0;
        num = Number(parseNumber(variable.value));
        num = num * GovBonus * WeapBonus;
        num = Math.round(num);
        variable.parentNode.parentNode.cells[8].innerHTML = num.toLocaleString();
    }
    var GovBonus = getSetting("GovBonus","1");
    var WeapBonus = getSetting("WeapBonus","1");
    var y;
    var x;
    //REWORK TARGET SELECT
    x = $('attack_target');
    x.style.width = '400px';
    x.rows[0].cells[0].align = "Right";
    x.rows[0].cells[0].innerHTML = "";
    x.rows[0].cells[0].style.width = "1px";
    x.rows[0].cells[1].innerHTML = "Target:";
    x.rows[0].cells[1].align = "Right";
    x.rows[0].cells[1].style.width = "125px";
    x.rows[0].cells[2].align = "Left";
    $('targetnum').style.fontSize = "x-large";
    $('targetnum').style.backgroundColor = "Black";
    $('targetnum').style.color = "Red";
    $('ATTTYPE').style.width = "190px";
    $c('contenttable')[0].rows[0].cells[0].innerHTML = $c('contenttable')[0].rows[0].cells[0].innerHTML.slice(25, -1);
    $c('contenttable')[0].rows[0].cells[1].innerHTML = "";
    $('ATTTYPE').addEventListener("change", function(){ChangeAttack();}, false);
    var readiness = $('readiness');
    if(readiness.innerHTML < 70){
        readiness.style.color = "Yellow";
        readiness.style.fontSize = "large";
        if(readiness.innerHTML < 50){
            readiness.style.color = "Red";
            readiness.style.fontSize = "x-large";
        }
    }
    var oil = $("oil_support");
    var cm = $("m_cm").innerHTML;
    if(cm >= 1){
        cm = "<font color='Red' Size='2'>Chems: "+cm+"</font>";
    } else { cm = "Chems: "+cm; }
    var nm = $("m_nm").innerHTML;
    if(nm >= 1){
        nm = "<font color='Red' Size='2'>Nukes: "+nm+"</font>";
    } else { nm = "Nukes: "+nm; }
    var em = $("m_em").innerHTML;
    if(em >= 1){
        em = "<font color='Red' Size='2'>Cruise: "+em+"</font>";
    } else { em = "Cruise: "+em; }
    oil.parentNode.innerHTML = 'Oil Support: '+oil.innerHTML+' | '+cm+' | '+nm+' | '+em+' | <span onmouseover="this.style.cursor=\'pointer\';" id="LoadAttackLog"><font style="color: Orange; font-size: 12px;">Load Attack Log</font></span>';
    $('LoadAttackLog').addEventListener("click", function(){monitorPage();}, false);
    var table = $c("mil_table")[0];
    var row;
    for (var i = 0; table.rows[i]; i++) {
        row = table.rows[i];
        x = row.insertCell(-1);
        x.align = "Center";
        x.style.whiteSpace = 'nowrap';
        if (row.cells[0].innerHTML == "Unit"){
            x.colSpan = 5;
            x.innerHTML = "Quick Sets";
            x = row.insertCell(-1);
            x.align = "Center";
            x.style.whiteSpace = 'nowrap';
            x.colSpan = 5;
            x.innerHTML = GovBonus+"*"+WeapBonus;
            continue;
        }
        x.innerHTML = "0";
        x.style='cursor: pointer;';
        x = row.insertCell(-1);
        x.align = "Center";
        x.style.whiteSpace = 'nowrap';
        x.innerHTML = "1k";
        x.style='background-color:  #400000; font-weight: bold; cursor: pointer;';
        x = row.insertCell(-1);
        x.align = "Center";
        x.style.whiteSpace = 'nowrap';
        x.innerHTML = "10k";
        x.style='cursor: pointer;';
        x = row.insertCell(-1);
        x.align = "Center";
        x.style.whiteSpace = 'nowrap';
        x.innerHTML = "1/4";
        x.style='background-color:  #400000; font-weight: bold; cursor: pointer;';
        x = row.insertCell(-1);
        x.align = "Center";
        x.style.whiteSpace = 'nowrap';
        x.innerHTML = "1/3";
        x.style='cursor: pointer;';
        x = row.insertCell(-1);
        x.align = "Center";
        x.style.whiteSpace = 'nowrap';
        x.innerHTML = "";
        x.style='cursor: pointer;';
        row.cells[2].firstChild.onkeyup = function(){UpdateEffectiveBreak(this);};
        row.cells[3].addEventListener("click", function(){Update(this);}, false);
        row.cells[4].addEventListener("click", function(){Update(this);}, false);
        row.cells[5].addEventListener("click", function(){Update(this);}, false);
        row.cells[6].addEventListener("click", function(){Update(this);}, false);
        row.cells[7].addEventListener("click", function(){Update(this);}, false);
    }
    ChangeAttack();


  //  window.alert(BPT[0].innerHTML);
}
/*
*  END
*/

//==========================================
// SPY PAGE
//==========================================
function page_spy() {

    //var type = $n("op")[0];
    //type.selectedIndex = 1;

}
/*
*  END
*/

//==========================================
// MAIN PAGE   //  window.alert(BPT[0].innerHTML);
//==========================================
function page_main() {
    var table = $('maintable');
    var land = table.rows[6].cells[1].innerHTML.slice(0, -6);
    land = Number(parseFloat(land.replace(/,/g, '')));
    var spies = table.rows[9].cells[4].innerHTML;
    spies = Number(parseFloat(spies.replace(/,/g, '')));
    var SPAL = spies / land;
    table.rows[9].cells[3].innerHTML = table.rows[9].cells[3].innerHTML + "<br>Raw SPAL";
    table.rows[9].cells[4].innerHTML = table.rows[9].cells[4].innerHTML + "<br>"+Math.round(SPAL);
}
/*
*  END
*/

//==========================================
// ADVISOR PAGE
//==========================================
function page_advisor() {
    var allTD = $('content').getElementsByTagName('td');			// get all TD elements
    //for(var i=0; i<allTD.length; ++i){
    //    if(allTD[i].innerHTML !== "Spies"){
    //        continue;
    //    }
    //   alert(i);
    //}
    var gov = $('content').getElementsByTagName('strong')[0].innerHTML;
    if(gov === "Dictatorship"){
        gov = 1.3;
        setSetting("GovBonus","1.25");
    }else{
        gov = 1;
        setSetting("GovBonus","1");
    }
    var spyTech = Number(allTD[72].innerHTML.replace(/[^0-9.]/g,''));
    var land = Number(parseFloat(allTD[16].innerHTML.replace(/[^0-9.]/g,'')));
    var spies = Number(parseFloat(allTD[112].innerHTML.replace(/[^0-9.]/g,'')));
    var WeapBonus = Number(parseFloat(allTD[66].innerHTML.replace(/[^0-9.]/g,'')));
    WeapBonus = Math.round(WeapBonus) / 100;
    setSetting("WeapBonus",WeapBonus);
    var rSPAL = Math.round(spies / land);
    var SPAL = Math.round(spies / land * (Number(spyTech) / 100) * Number(gov));
    var newRow = allTD[23].parentNode.parentNode.insertRow(-1);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    cell1.innerHTML = "Raw SPAL";
    cell1.style.backgroundColor = "#262626";
    cell1.style.color = "Orange";
    cell2.innerHTML = rSPAL;
    cell2.align = "right";
    cell2.style.backgroundColor = "#262626";
    cell2.style.color = "Orange";
    newRow = newRow.parentNode.insertRow(-1);
    cell1 = newRow.insertCell(0);
    cell2 = newRow.insertCell(1);
    cell1.innerHTML = "SPAL + Tech + Gov";
    cell1.style.backgroundColor = "#262626";
    cell1.style.color = "Orange";
    cell2.innerHTML = SPAL;
    cell2.align = "right";
    cell2.style.backgroundColor = "#262626";
    cell2.style.color = "Orange";
}
/*
*  END
*/

//==========================================
//MAIN LOAD
//==========================================

installCheck();
switch (page){
    case "/build":
        cleanAttackLog();
        page_build();
        break;
    case "/research":
        cleanAttackLog();
        page_research();
        break;
    case "/market":
        cleanAttackLog();
        page_market();
        break;
    case "/tech": //Market buy Tech
        page_marketTech();
        break;
    case "/sell":
        if($("contentarea")){
            page_marketPrivateSellMilitary();//Market Private Sell Military
        }else{
            page_marketSell();//Market Sell Goods
        }
        break;
    case "/private": //Private Market
        page_marketPrivate();
        break;
    case "/explore": //Explore Page
        page_explore();
        break;
    case "/war": //War
        page_war();
        break;
    case "/main": //mainpage
        cleanAttackLog();
        page_main();
        break;
    case "/spy": //SpyPage
        page_spy();
        break;
    case "/advisor": //advisor
        page_advisor();
        break;
    default:
        break;
}