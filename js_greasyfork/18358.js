// ==UserScript==
// @name         RPG-Post-Template
// @namespace    http://www.dermrsimon.com/
// @include      http://rpg-city.de/*
// @version      0.1.1
// @description  Templates fuer Beitraege im RPG-Forum.
// @author       Simon Marsh
// @downloadURL https://update.greasyfork.org/scripts/18358/RPG-Post-Template.user.js
// @updateURL https://update.greasyfork.org/scripts/18358/RPG-Post-Template.meta.js
// ==/UserScript==

// Eintrag "Vorlagen" in die Toolbar wcf3 hinzufügen
var input = document.createElement("li");
input.id = "templates";
input.dataset.name = "templates";
input.onclick = showDiv;
input.setAttribute("style", "display: inline-block;");
document.getElementById("wcf3").getElementsByTagName("ul")[0].appendChild(input);
document.getElementById("templates").innerHTML = "<a><span>Vorlagen</span></a>";

// Texte, die bei den Vorlagen ausgegeben werden sollen
var template_text_1 =
    "\nDieser Text wurde durch Klicken auf den Template 1-Button eingefügt.";
var template_text_2 =
    "\n[img]http://puu.sh/nYexg/8937eae462.png[/img]\nNatürlich können auch Bilder eingefügt oder [b]der Text mit HTML-Tags formatiert[/b] werden.";
// var template_text_3 =
//     "Template 3 Text";
// var template_text_4 =
//     "Template 4 Text";

/* Zu faul umzuschreiben, machs selbst.. :P
var template_text = newArray();
template_text[0] = "\nDieser Text wurde durch Klicken auf den Template 1-Button eingefügt.";
template_text[1] = "[img]http://puu.sh/nYexg/8937eae462.png[/img]\nNatürlich können auch Bilder eingefügt oder [b]der Text mit HTML-Tags formatiert[/b] werden.";
..
*/


// Buttons
var input_template_1 = document.createElement("input");
input_template_1.type = "button";
input_template_1.value = "Template 1 (Test)";
input_template_1.onclick = pasteText;
input_template_1.setAttribute("style", "font-size:12px;");

var input_template_2 = document.createElement("input");
input_template_2.type = "button";
input_template_2.value = "Template 2 (Bild)";
input_template_2.onclick = pasteText2;
input_template_2.setAttribute("style", "font-size:12px;");

/*
var input_template_3 = document.createElement("input");
input_template_3.type = "button";
input_template_3.value = "Template 3 ButtonName";
input_template_3.onclick = pasteText3;
input_template_3.setAttribute("style", "font-size:12px;");

var input_template_4 = document.createElement("input");
input_template_4.type = "button";
input_template_4.value = "Template 4 ButtonName";
input_template_4.onclick = pasteText4;
input_template_4.setAttribute("style", "font-size:12px;");
*/

// div-Menü
var template_1 = document.createElement("div");
template_1.id = "temp1";
template_1.className = "container containerPadding";
template_1.setAttribute("style", "display: none;");
document.getElementsByClassName("messageTabMenu")[0].appendChild(template_1);

// Buttons im div-Menü
document.getElementById("temp1").appendChild(input_template_1);
document.getElementById("temp1").appendChild(input_template_2);
document.getElementById("temp1").appendChild(input_template_3);
document.getElementById("temp1").appendChild(input_template_4);

// div ein-/ausblenden
function showDiv()
{
    if(document.getElementById("temp1")){
        document.getElementById("temp1").style.display =
        (document.getElementById("temp1").style.display == 'none') ? 'block' : 'none';
    }
}

// Texte nach Buttonklick einfügen
// Natürlich könnte man das auch mit nur einer Methode machen, aber.. machs selbst.
function pasteText()
{
    document.getElementsByClassName("redactor-editor")[0].getElementsByTagName("p")[0].innerText += template_text_1;
}

function pasteText2()
{
    document.getElementsByClassName("redactor-editor")[0].getElementsByTagName("p")[0].innerText += template_text_2;
}

function pasteText3()
{
    document.getElementsByClassName("redactor-editor")[0].getElementsByTagName("p")[0].innerText += template_text_3;
}

function pasteText4()
{
    document.getElementsByClassName("redactor-editor")[0].getElementsByTagName("p")[0].innerText += template_text_4;
}