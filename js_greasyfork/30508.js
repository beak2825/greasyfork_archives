// ==UserScript==
// @name       Notizen
// @include  https://fussballcup.de/*
// @version    0.2.8
// @description  Fügt dem Header bei fussballcup einen Platz für Notizen hinzu
// @copyright  Klaid, 2013 - edited by mot33, 2018
// @connect <value>
// @grant       GM_addStyle
// @grant       GM_getValue 
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/30508/Notizen.user.js
// @updateURL https://update.greasyfork.org/scripts/30508/Notizen.meta.js
// ==/UserScript==

function init()
{
    if (window.top != window.self)  //Script soll nicht in Frames oder iFrames angezeigt werden
    {
        return;
    }


 var notiz = false;

    GM_addStyle("#notice_in { color: white; background-color:#088A08; padding: 4px; width:170px; margin: auto; border-radius: 12px; cursor: pointer; letter-spacing:0.10em} #notice_out {height: 130px; width: 100%; background-color: transparent; padding: 10px; border: 0px solid #088A08;} .notiz_button {  border-radius: 12px; background-color: #B40404; border: none;color: #FFFFFF;text-align: center;font-size: 15px;padding: 4px;width: 110px;transition: all 0.5s;cursor: pointer;margin: 8px;}.button span {cursor: pointer;display: inline-block;position: relative;transition: 0.5s;}.button span:after {content: '»';position: absolute;opacity: 0;top: 0;right: -20px;transition: 0.5s;}.button:hover span {padding-right: 12px;}.button:hover span:after {opacity: 5;right: 0;}} #Notizbereich{border-radius: 12px; height: 170px; background-color: #FFFFFF; border: 1px solid #DF0101; padding: 0px;}");
                var notice_area = document.createElement("div");
    notice_area.setAttribute('id', 'notice_area');

    var notice_in = document.createElement("div");
    notice_in.setAttribute('id', 'notice_in');
    notice_in.addEventListener("click", openNotice, false);

    var notice_out = document.createElement("div");
    notice_out.setAttribute('id', 'notice_out');

    var clue_text = document.createElement("p");
    clue_text.setAttribute('id', 'change_clue');

    var Notice_Text = document.createElement("p");
    var Notice_Buttons = document.createElement("p");
    var element = document.createElement("p");
    var Notice_Textarea = document.createElement("textarea");
    var Notice_Savebutton = document.createElement("input");
    var Notice_Resetbutton = document.createElement("input");
    var Notice_Element = document.createElement("a");
    var link = "http://www.fcup-tools.de";



    Notice_Textarea.cols = "100";
    Notice_Textarea.rows = "6";
    Notice_Textarea.setAttribute('id', 'Notizbereich');
    Notice_Textarea.appendChild(document.createTextNode(GM_getValue('Notiz')));



    Notice_Savebutton.type = "Button";
    Notice_Savebutton.value = "Notiz speichern";
    Notice_Savebutton.setAttribute('class', 'notiz_button');
    Notice_Savebutton.addEventListener("click", save, false);

    Notice_Element.type = "Button";
    Notice_Element.setAttribute("href", link);
    Notice_Element.setAttribute('class', 'notiz_button');
    Notice_Element.innerHTML = "Fcup-Tools";
    Notice_Element.addEventListener("onclick", open, false);
    Notice_Element.setAttribute('target','_blank');
    document.body.appendChild(Notice_Element);
    // and append it to where you'd like it to go:



    Notice_Resetbutton.type = "Button";
    Notice_Resetbutton.value = "Feld leeren";
    Notice_Resetbutton.setAttribute('class', 'notiz_button');
    Notice_Resetbutton.addEventListener("click", reset, false);



    Notice_Buttons.appendChild(Notice_Savebutton);
    Notice_Buttons.appendChild(Notice_Element);  
    Notice_Buttons.appendChild(Notice_Resetbutton);

    Notice_Text.appendChild(Notice_Textarea);
    Notice_Text.appendChild(Notice_Buttons);

    notice_out.appendChild(Notice_Text);
    notice_out.appendChild(clue_text);
    notice_out.appendChild(notice_in);

    notice_area.appendChild(notice_in);
    notice_area.appendChild(notice_out);

    document.body.insertBefore(notice_area, document.body.firstChild);
    document.body.appendChild(element);

    document.getElementById("notice_in").innerHTML = "Notiz &ouml;ffnen";

    notice_out.style.display="none";


    function openNotice()
    {
        if(!notiz)
        {
            notiz = true;
            notice_out.style.display="table";
            document.getElementById("notice_in").innerHTML = "Notiz verbergen";
        }
        else
        {
            notiz = false;
            notice_out.style.display="none";
            document.getElementById("notice_in").innerHTML = "Notiz öffnen";
        }
    }

    function save()
    {
        GM_setValue('Notiz', document.getElementById("Notizbereich").value);
        change_clue("Notiz wurde gespeichert.");
        window.setTimeout (function() { change_clue(""); }, 1500);
    }

    function change_clue(value)
    {
        document.getElementById("change_clue").innerHTML = "<font color='#190707'>"+ value +"</font>";
    }

    function reset()
    {
        change_clue("Notiz wurde gelöscht.");
        document.getElementById("Notizbereich").innerHTML = "";
    }
}

init();

