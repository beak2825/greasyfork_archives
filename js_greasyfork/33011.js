// ==UserScript==
// @name        Forenchat
// @namespace   Wolkenflitzer
// @description Wiederbelebung des ehemaligen HappyChats
// @include     *rpg-city.de/forum/
// @include     *rpg-city.de/forum/chatSettings/
// @version     1.4
// @downloadURL https://update.greasyfork.org/scripts/33011/Forenchat.user.js
// @updateURL https://update.greasyfork.org/scripts/33011/Forenchat.meta.js
// ==/UserScript==


/*
ChatPositions: 0 = Über 7 Beiträge, 1 = Unter 7 Beiträge
*/

//https://chat.phpprojects.de/userscript/forenchat.user.js

if(window.localStorage.getItem("hide") === null) window.localStorage.setItem("hide", 0);
if(window.localStorage.getItem("chatPosition") === null) window.localStorage.setItem("chatPosition", 0);
var hide = window.localStorage.getItem("hide");
var chatPosition = window.localStorage.getItem("chatPosition");

if(document.URL.indexOf("chatSettings") === -1) {
    var username = document.getElementById("userMenu").getElementsByTagName("span")[0].innerHTML;
    username = username.split(' ').join('_');


    var div = document.createElement("div");
    div.setAttribute("style", "padding:10px;margin-bottom:10px;margin-top:10px;border:1px rgba(0,0,0,0.5) solid;border-radius:3px;background-color:rgba(230,230,230, 1);");
    div.innerHTML = "<p style='cursor:pointer;text-align:center;background-color:rgba(200,200,200,1);color:#5a5a5a;border-radius:3px;' onclick='if(document.getElementById(\"chatframe\").style.display==\"\"){document.getElementById(\"chatframe\").style.display = \"none\";window.localStorage.setItem(\"hide\", 1);}else {document.getElementById(\"chatframe\").style.display = \"\";window.localStorage.setItem(\"hide\", 0);}'>Forenchat einklappen/ausklappen</p>";
    var frame = document.createElement("iframe");
    frame.src = "https://chat.phpprojects.de/?name=" + username;
    frame.setAttribute("frameborder", "0");
    frame.setAttribute("scrolling", "no");
    if(hide == 1) {
        frame.setAttribute("style", "width:100%;height:300px;margin-top:10px;display:none;");
    } else {
        frame.setAttribute("style", "width:100%;height:300px;margin-top:10px;");
    }
    frame.id = "chatframe";
    div.appendChild(frame);

    if(chatPosition == 0) {
        document.getElementsByClassName("contentHeaderTitle")[0].appendChild(div);
    } else if(chatPosition == 1) {
        document.getElementsByClassName("boxContainer")[0].appendChild(div);
    } else {
        //Wenn nichts angegeben, zeige unter 7 Beiträge
        document.getElementsByClassName("boxContainer")[0].appendChild(div);
    }
} else {
    var title = document.getElementsByClassName("contentTitle")[0];
    var text = document.getElementById("errorMessage");
    title.innerHTML = "Forenchat Einstellungen";
    text.innerHTML = "Bitte wähle aus, an welcher Stelle der Forenchat angezeigt werden soll: ";

    var optionList = ["Über den letzten 7 Beiträgen","Unter den letzen 7 Beiträgen"];

    //Create and append select list
    var selectList = document.createElement("select");
    selectList.setAttribute("id", "selectPosition");

    selectList.onchange = function () {
        window.localStorage.setItem("chatPosition", this.value);
        text.innerHTML = "<font color='#228b22'><b>Der Chat wird nun '"+optionList[this.value]+"' angezeigt!</b></font>";
    };

    text.appendChild(selectList);

    //Create and append the options
    for (var i = 0; i < optionList.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", i);
        option.text = optionList[i];
        if(window.localStorage.getItem("chatPosition") == i) {
            option.setAttribute("selected","selected");
        }
        selectList.appendChild(option);
    }
}