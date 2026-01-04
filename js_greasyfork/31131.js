// ==UserScript==
// @name         SwiftPath Script Maker
// @namespace    undefined
// @version      0.2.2
// @description  Créateur de trajet pour swiftbot en utilisant le site dofus-map
// @author       DrakeRoxas
// @match        *://dofus-map.com/
// @downloadURL https://update.greasyfork.org/scripts/31131/SwiftPath%20Script%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/31131/SwiftPath%20Script%20Maker.meta.js
// ==/UserScript==
// ========================================
// SwiftPath Script Maker
//            By Drake Roxas
// ========================================
// V 0.2.2
//    - Corrections pour compatibilité GreaseMonkey
// V 0.2.1
//    - Correction du bug faisant apparaitre gather et fight en fonction des directions choisies et non des cases
// V 0.2.0
//    - Passage du script en version Lua et les modifications qui l'accompagne
// V 0.1.5
//    - Ajout des autres Banques
// V 0.1.4
//    - Ajout de la partie Banque
//    - Gestion de la banque d'Astrub
// V 0.1.3
//    - Ajout du "gather{;id;}"
// V 0.1.2
//    - Correction du bug qui faisait que les fichiers générés sous windows n'avais qu'une seule ligne
//    - Correction des espaces dans le fichier générer empéchant le bot de lire les coordonnées
// V 0.1.1
//    - Les marqueurs ne disparaissent plus avec la checkbox
// V 0.1.0
//    - Sortie du script
 
var css = document.createElement('style');
css.type = 'text/css';
css.textContent="#pathdata,#bankdata{max-height:0px;overflow-y:hidden;padding:15px;padding-top:0px;padding-bottom:5px;transition:max-height 0.5s ease-in;}#pathdata div,#bankdata div{text-align:center;font-weight:600;margin:3px auto}#pathdata table,#bankdata table{width:100%}#pathdata table td,#bankdata table td{width:50%}#pathdata table td:first-child,#bankdata table td:first-child{text-align:right}#pathdata input[type='checkbox'],#bankdata input[type='checkbox']{vertical-align:middle}.markersOnMap.wayTop{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGNyaW1zb247Ii8+Cjwvc3ZnPg==');transform:rotate(180deg)}.markersOnMap.wayBottom{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGNyaW1zb247Ii8+Cjwvc3ZnPg==')}.markersOnMap.wayLeft{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGNyaW1zb247Ii8+Cjwvc3ZnPg==');transform:rotate(90deg)}.markersOnMap.wayRight{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGNyaW1zb247Ii8+Cjwvc3ZnPg==');transform:rotate(-90deg)}.markersOnMap.wayGather{background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTExLjk5OSA1MTEuOTk5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTEuOTk5IDUxMS45OTk7ZmlsbDojMDBmZjAwOyI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC43NSwwLDAsMC43NSwzMy45OTk5NTMsNjQuMDAwMDI3KSI+IDxwYXRoIGQ9Im0gMzMwLjQxLDExMy41MDcgLTg0Ljk2LC04NC45NiBjIC02LjM3NiwtNi4zNzYgLTE2Ljg0NCwtNi4wNTkgLTIyLjgyMiwwLjc2MyAtMTUuMDk3LDE3LjIzMiAtMzMuOTA1LDM1LjU3NSAtNTQuNzY3LDUzLjY2MyBMIDE1Ni4yMDYsNzEuMzE4IGMgLTE2LjgyNSwtMTYuODI1IC00NC4wNTcsLTE2LjgyNyAtNjAuODg1LDAgLTE2LjgyNywxNi44MjUgLTE2LjgyNyw0NC4wNTcgLTAuMDAxLDYwLjg4NSBsIDMuOTA5LDMuOTA5IGMgLTMzLjY5MywyMy4yNDkgLTY4LjIyNCw0My4wNzUgLTk4LjczLDU1LjM1OCAtNi4zMDYsMTEzLjI1NyA0Ny4xNzEsMTY2LjczNCAxNjAuNDI5LDE2MC40MjggMTEuNDAxLC0yOC4zMTYgMzAuMTYxLC01OS4yNDEgNTIuMzY4LC04OS41MDIgMzMuODM2LC01MS41NjYgOTMuMzMyLC0xMDUuMTM3IDExNi4xODksLTEyNS45MjkgNi43NzksLTYuMTY3IDcuMzIzLC0xNi41NjIgMC45MjUsLTIyLjk2IHoiLz48L2c+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMC43NSwwLDAsMC43NSwzMy45OTk5NTMsNjQuMDAwMDI3KSI+PHBhdGggZD0iTSA0OTkuNDExLDQxNC41MjMgMjk3LjI1OCwyMTIuMzcyIGMgLTExLjc3NCwxMS40NjEgLTMzLjgzMSwzNC43MTYgLTU1LjA1NSw2Ni43MTYgbCAxOTYuMzIxLDE5Ni4zMjEgYyAxNi44MjMsMTYuODI1IDQ0LjA1NywxNi44MjkgNjAuODg1LDAgMTYuNzg3LC0xNi43ODcgMTYuNzg3LC00NC4xIDAuMDAyLC02MC44ODYgeiIvPjwvZz48L3N2Zz4=')}.markersOnMap.wayFight{background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iOTI3Ljk2OXB4IiBoZWlnaHQ9IjkyNy45NjlweCIgdmlld0JveD0iMCAwIDkyNy45NjkgOTI3Ljk2OSIgc3R5bGU9ImZpbGw6I2ZmNjYwMDsiPjxwYXRoIGQ9Im0gMjg2LjYyMDc5LDc0My40MDcwMyBjIC05LjMsLTEwLjg3NSAtMjIuMzQ5MjUsLTE4LjUyNSAtMzcuMDUsLTE4LjQ1MDc1IC0xNi43OTg1LDAuMzc1IC0zMy40NSwxMC42NSAtNDAuMTI1LDI2LjI1IC0yLjMyNSw1LjQgLTMuNDUsMTEuMjUgLTMuNDUsMTcuMTAwNzUgMCwyNC4wNzUgMTkuNSw0My42NDkyNSA0My42NTA3NSw0My42NDkyNSAyNC4xNDkyNSwwIDQzLjY0OTI1LC0xOS41IDQzLjY0OTI1LC00My42NDkyNSAwLC0xLjA1IC0wLjA3NSwtMi4xMDA3NSAtMC4xNDkyNSwtMy4wNzU3NSBsIDcyLjU5OTI1LC03Mi42IDQyLjIyNTc1LDQyLjIyNSBjIDQuNjQ5MjUsNC42NSAxMi4zLDQuNjUgMTYuOTUsMCBsIDE2LjY0OTI1LC0xNi43MjUgYyA0LjY1MDc1LC00LjY1IDQuNjUwNzUsLTEyLjMgMCwtMTYuOTUgbCAtMTI0Ljk1LC0xMjQuODc1IGMgLTQuNjQ5MjUsLTQuNjUgLTEyLjMsLTQuNjUgLTE2Ljk1LDAgbCAtMTYuNzI1NzUsMTYuNzI1IGMgLTQuNjQ5MjUsNC42NSAtNC42NDkyNSwxMi4yOTkyNSAwLDE2Ljk1IGwgNDIuMjI1NzUsNDIuMjI1IC01OS41NSw1OS41NSBjIDAuMDc1LDAuMDc1IDAuMTUwNzUsMC4wNzUgMC4yMjU3NSwwLjE1IDAuNzUsMC41MjUgMS41NzUsMS4wNDkyNSAyLjMyNSwxLjU3NSAzLDIuMjUgNS43LDQuNTc1NzUgOC4wMjQyNSw3LjA1IDQuMDUsNC4zNSA3LjcyNTc1LDkuMzc1IDEwLjI3NTc1LDE0Ljg1IDEuODc1LDMuNiAzLjM3NSw3LjUgNC41LDExLjQgMC44MjUsMi43NzUgMS4xMjUsNC40MjQyNSAxLjEyNSw0LjQyNDI1IDAsMCAtMC44MjUsLTEuNDI0MjUgLTIuNDc1NzUsLTMuNzUgLTAuODk5MjUsLTEuNDIzNSAtMS45NDkyNSwtMi43NzM1IC0zLC00LjA0ODUgeiIvPjxwYXRoIGQ9Im0gNjg3Ljk0NTc5LDE2NC4zMzIwMyBjIC04LjQsMi4wMjUgLTE1LjksNi45IC0yMS4xNSwxMy44IGwgLTMwMS44NzUsMzk4LjU1IDI3LDI3IDM0NC4xLC0zMjIuNjUgLTMyMi42NSwzNDQuMSAyNy45MDA3NSwyNy45IDQwMC4yLC0yOTkuNzAwNzUgYyA3LjEyNSwtNS4zMjUgMTIuMDc1LC0xMi45NzUgMTQuMSwtMjEuNjc0MjUgbCA0Ni4xMjUsLTIwMS44MjUgYyAxLjgsLTguMTc1IC01LjQ3NSwtMTUuNDUgLTEzLjY1LC0xMy41IGwgLTIwMC4xMDA3NSw0OCB6Ii8+PC9zdmc+')}.markersOnMap.bankTop{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGdvbGQ7Ii8+Cjwvc3ZnPg==');transform:rotate(180deg)}.markersOnMap.bankBottom{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGdvbGQ7Ii8+Cjwvc3ZnPg==')}.markersOnMap.bankLeft{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGdvbGQ7Ii8+Cjwvc3ZnPg==');transform:rotate(90deg)}.markersOnMap.bankRight{background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgaWQ9IkNhbHF1ZV9Cb3R0b20iPgoKPHBhdGggZD0iTTcxLjUsNTAuMkg1OFYxOS43YzAtMS4yLTEuOS0yLjItNC4yLTIuMmgtNy40Yy0yLjMsMC00LjIsMS00LjIsMi4ydjMwLjRIMjguNWMtMS40LDAtMi41LDAuOS0yLjUsMS45ICBjMCwwLDIwLjIsMjkuNywyMi4xLDMxLjFjMS44LDEuNCwzLjcsMCwzLjcsMGwyMi4xLTMxLjFDNzMuOSw1MSw3Mi44LDUwLjIsNzEuNSw1MC4yeiIgc3R5bGU9ImZpbGw6IGdvbGQ7Ii8+Cjwvc3ZnPg==');transform:rotate(-90deg)}#gatheronly li{width:52px;padding:0 7.5px;}div.tab{overflow:hidden;border:1px solid #680300;background-color:#FF221C;}div.tab button{background-color:inherit;float:left;border:none;outline:none;cursor:pointer;padding:4px 25px;transition:0.3s;color:white;}div.tab .info{background-color:white;float:left;padding:5px 0px;color:black;width:52px;text-align:center;font-weight:bold;}div.tab button:hover{background-color:#AD0400;}div.tab button.active{background-color:#680300;}.tabcontent{display:none;padding:6px 12px;border:1px solid #680300;border-top:none;}";
document.getElementsByTagName('head')[0].appendChild(css);
document.getElementById('onBottom').innerHTML = '<div class="separation"></div><h4>Ressources Récoltées</h4>' +
'<ul class="RC" id="gatheronly"><li><span class="position1" onclick="toggleRessourcesData(this, 4);" id="position4">?</span></li></ul>' +
'<div class="separation"></div>' +
'<div class="tab"><button id="pathbutton" class="tablinks active">Récolte</button><span id="currentCoord" class="info"></span>' +
'<button id="bankbutton" class="tablinks">Banque</button></div>' +
'<div id="pathdata" class="tabcontent"></div><div id="bankdata" class="tabcontent"></div><div style="text-align:center;"><button id="generator">Generer le trajet</button></div>' +
document.getElementById('onBottom').innerHTML;

function openTabPath(evt, id) {
    var i, tabcontent, tablinks, markers;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    markers = document.getElementsByClassName("customMarker");
    for (i = 0; i < markers.length; i++) {
        markers[i].style.display = "none";
    }

    document.getElementById(id).style.display = "block";
    evt.className += " active";

    if (id == "pathdata") {
        markers = Array.prototype.slice.call(document.getElementsByClassName("wayTop"), 0);
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("wayBottom"), 0));
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("wayLeft"), 0));
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("wayRight"), 0));
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("wayGather"), 0));
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("wayFight"), 0));
    } else {
        markers = Array.prototype.slice.call(document.getElementsByClassName("bankTop"), 0);
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("bankBottom"), 0));
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("bankLeft"), 0));
        markers = markers.concat(Array.prototype.slice.call(document.getElementsByClassName("bankRight"), 0));
    }
    for (i = 0; i < markers.length; i++) {
        markers[i].style.display = "block";
    }
}
openTabPath(document.getElementById('pathbutton'), 'pathdata');

var maxPos = 4;

function moveBackRessourcesData(position) {
	var oldPosition = document.getElementById('position'+(position+1));
	if (oldPosition == null) {
		document.getElementById('position'+position).parentNode.remove();
		maxPos -= 1;
		return;
	}
	var newPosition = document.getElementById('position'+position);

	newPosition.innerHTML = oldPosition.innerHTML;
	newPosition.style.backgroundPosition = oldPosition.style.backgroundPosition;
	newPosition.parentNode.className = oldPosition.parentNode.className;
	newPosition.dataset = oldPosition.dataset;

	moveBackRessourcesData(position + 1);
}

function toggleRessourcesData(node, position) {
	if (map) {
		if (node.parentNode.className.indexOf('assigned') > -1) {
		//already there so remove the ressource
			if (position <= 3) {
				if (waitingPositions[position] == false)
					removeRessourcesData(position);
				else
					waitingPositions[position] = false;
				node.parentNode.className = '';
				node.style.backgroundPosition = '52px 52px';
				node.innerHTML = '?';
				delete node.dataset.ressource;
				verbalRessourcesSelected();
			} else {
				removeRessourcesData(position);
				moveBackRessourcesData(position);
			}
		} else {
			var rs = document.getElementById('RS');
			rs.className = 'RSmain visible';
			rs.dataset.position = position;
		}
	}
}

function assignRessourcesData(node, ressource) {
	var rs = document.getElementById('RS');
	var position = rs.dataset.position;
	var spanPosition = document.getElementById('position'+position);
	spanPosition.style.backgroundPosition = node.firstChild.style.backgroundPosition;
	spanPosition.innerHTML = '';
	if (position <= 3)
		spanPosition.parentNode.className = 'assigned loading';
	else
		spanPosition.parentNode.className = 'assigned';
	spanPosition.dataset.ressource = ressource;
	verbalRessourcesSelected();
	rs.className = 'RSmain';
	if (position <= 3) {
		waitingPositions[position] = true;
		putRessourcesData(ressource, mapData.id, position);
	} else {
		maxPos += 1;
		document.getElementById('gatheronly').innerHTML = document.getElementById('gatheronly').innerHTML +
'<li><span class="position1" onclick="toggleRessourcesData(this, ' + maxPos + ');" id="position' + maxPos + '">?</span></li>';
	}
}
 
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = new obj.constructor();
    for (var key in obj) {
        if (key != "googleMarker")
            temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}
 
var flag = 0;
function editOnClick(element, func, ...args) {
    element.addEventListener("mousedown", function(){
        flag = 0;
    }, false);
    element.addEventListener("mousemove", function(){
        flag = 1;
    }, false);
    element.addEventListener("mouseup", function(){
        if(flag === 0){
        func(...args);
        }
    }, false);
}
 
function createMarker(type, mtype, x, y) {
    marker = cloneObject(mapData.markers[0]);
 
    marker.type = mtype;
    if (type == "top") {
        marker.x = x + 0.5;
        marker.y = y + 0.1;
    } else if (type == "bottom") {
        marker.x = x + 0.5;
        marker.y = y + 0.9;
    } else if (type == "left") {
        marker.x = x + 0.1;
        marker.y = y + 0.5;
    } else if (type == "right") {
        marker.x = x + 0.9;
        marker.y = y + 0.5;
    } else if (type == "gather") {
        marker.x = x + 0.5;
        marker.y = y + 0.5;
    } else if (type == "fight") {
        marker.x = x + 0.5;
        marker.y = y + 0.5;
    }
    ll=getTileLatLng(marker);
    marker.lat = ll.lat();
    marker.lng = ll.lng();
 
    customMarker(marker);
    return marker;
}
 
function customMarker(element) {
    var div = document.createElement('div');
        div.className = 'markersOnMap customMarker ' + element.type;
        div.style = 'display:block';
 
    var marker = new RichMarker({
        map: map,
        position: new google.maps.LatLng(element.lat, element.lng, true),
        flat: true,
        anchor: RichMarkerPosition.MIDDLE,
        content: div
    });
 
    element.googleMarker = marker;
}
 
function clearMarker(element) {
    element.googleMarker.content.remove();
}
 
function ChangeData(element, index)
{
    element.onchange = function() {
        var currentCoord = document.getElementById('currentCoord').innerText;
        if (element.checked) {
            var splitted = currentCoord.split(/[, ()]/); // = ["", "X", "", "Y", ""]
            if (index == 0)
                pathdata[currentCoord][index] = createMarker("top", "wayTop", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 1)
                pathdata[currentCoord][index] = createMarker("bottom", "wayBottom", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 2)
                pathdata[currentCoord][index] = createMarker("left", "wayLeft", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 3)
                pathdata[currentCoord][index] = createMarker("right", "wayRight", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 4)
                pathdata[currentCoord][index] = createMarker("gather", "wayGather", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 5)
                pathdata[currentCoord][index] = createMarker("fight", "wayFight", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 6)
                pathdata[currentCoord][index] = createMarker("top", "bankTop", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 7)
                pathdata[currentCoord][index] = createMarker("bottom", "bankBottom", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 8)
                pathdata[currentCoord][index] = createMarker("left", "bankLeft", parseInt(splitted[1]), parseInt(splitted[3]));
            else if (index == 9)
                pathdata[currentCoord][index] = createMarker("right", "bankRight", parseInt(splitted[1]), parseInt(splitted[3]));
        } else {
            clearMarker(pathdata[currentCoord][index]);
            pathdata[currentCoord][index] = undefined;
        }
    };
}
 
var pathdata = {};
function MapClick(coord = null) {
    if (coord == null) coord = document.getElementById('coord').innerText;
    if (pathdata[coord] == undefined)
        pathdata[coord] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    var l = pathdata[coord];
 
    document.getElementById('currentCoord').innerHTML = coord;
    e = document.getElementById('pathdata');
    e.innerHTML = '<table><tr><td><label data-text-true="Oui" data-text-false="Non">Haut <input type="checkbox" name="top"' + (l[0] ? ' checked' : '') + '></label></td>' +
        '<td><label data-text-true="Oui" data-text-false="Non"><input type="checkbox" name="bottom"' + (l[1] ? ' checked' : '') + '> Bas</label></td></tr>' +
        '<tr><td><label data-text-true="Oui" data-text-false="Non">Gauche <input class="css-checkbox" type="checkbox" name="left"' + (l[2] ? ' checked' : '') + '></label></td>' +
        '<td><label data-text-true="Oui" data-text-false="Non"><input type="checkbox" name="right"' + (l[3] ? ' checked' : '') + '> Droite</label></td></tr>' +
        '<tr><td><label data-text-true="Oui" data-text-false="Non">Récolter <input class="css-checkbox" type="checkbox" name="gather"' + (l[4] ? ' checked' : '') + '></label></td>' +
        '<td><label data-text-true="Oui" data-text-false="Non"><input type="checkbox" name="fight"' + (l[5] ? ' checked' : '') + '> Combattre</label></td></tr></table>';
 
    ChangeData(document.getElementsByName("top")[0], 0);
    ChangeData(document.getElementsByName("bottom")[0], 1);
    ChangeData(document.getElementsByName("left")[0], 2);
    ChangeData(document.getElementsByName("right")[0], 3);
    ChangeData(document.getElementsByName("gather")[0], 4);
    ChangeData(document.getElementsByName("fight")[0], 5);
 
    e.style.maxHeight = "100px";

    e = document.getElementById('bankdata');
    e.innerHTML = '<table><tr><td><label data-text-true="Oui" data-text-false="Non">Haut <input type="checkbox" name="top"' + (l[6] ? ' checked' : '') + '></label></td>' +
        '<td><label data-text-true="Oui" data-text-false="Non"><input type="checkbox" name="bottom"' + (l[7] ? ' checked' : '') + '> Bas</label></td></tr>' +
        '<tr><td><label data-text-true="Oui" data-text-false="Non">Gauche <input class="css-checkbox" type="checkbox" name="left"' + (l[8] ? ' checked' : '') + '></label></td>' +
        '<td><label data-text-true="Oui" data-text-false="Non"><input type="checkbox" name="right"' + (l[9] ? ' checked' : '') + '> Droite</label></td></tr></table>';

    ChangeData(document.getElementsByName("top")[1], 6);
    ChangeData(document.getElementsByName("bottom")[1], 7);
    ChangeData(document.getElementsByName("left")[1], 8);
    ChangeData(document.getElementsByName("right")[1], 9);
 
    e.style.maxHeight = "100px";
}
 
function GenerateLine(line) {
    var txt = "";
    if (line[0] != undefined)
        txt = "top";
    if (line[1] != undefined)
        txt += (txt=="" ? "" : "|") + "bottom";
    if (line[2] != undefined)
        txt += (txt=="" ? "" : "|") + "left";
    if (line[3] != undefined)
        txt += (txt=="" ? "" : "|") + "right";
    return txt;
}
 
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
function saveTextAsFile(txt)
{
    var textToSaveAsBlob = new Blob([txt], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = "Trajet.lua";
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}
 
function Generate() {
    var txt = "-- Generated On Dofus-Map with SwiftPath Script Maker --\r\n";
    txt +=    "--                          a Drake Roxas's Script :3 --\r\n";
    var gathered = "";
    var ids = {'ort' : '254,', 'sau' : '255,', 'tre' : '67,', 'men' : '66,', 'orc' : '68,', 'ede' : '61,', 'gra' : '112,', 'gin' : '256,', 'bel' : '257,', 'man' : '258,', 'per' : '131,', 'fre' : '1,', 'cha' : '33,', 'noy' : '34,', 'che' : '8,', 'bom' : '98,', 'era' : '31,', 'oli' : '101,', 'if' : '28,', 'bam' : '108,', 'mer' : '35,', 'noi' : '259,', 'ebe' : '29,', 'kal' : '121,', 'arm' : '32,', 'som' : '109,', 'orm' : '30,', 'sac' : '110,', 'emb' : '133,', 'fer' : '17,', 'cui' : '53,', 'bro' : '55,', 'kob' : '37,', 'gan' : '54,', 'eta' : '52,', 'sil' : '114,', 'arg' : '24,', 'bau' : '26,', 'or' : '25,', 'dol' : '113,', 'obs' : '135,', 'ble' : '38,', 'org' : '43,', 'avo' : '45,', 'hou' : '39,', 'lin' : '42,', 'sei' : '44,', 'riz' : '111,', 'mal' : '47,', 'anv' : '46,', 'mai' : '260,', 'mil' : '261,', 'fro' : '134,', 'gou' : '75,', 'gre' : '71,', 'tru' : '74,', 'cra' : '77,', 'ton' : '76,', 'pan' : '78,', 'car' : '79,', 'sar' : '81,', 'och' : '263,', 'kra' : '264,', 'ang' : '265,', 'dor' : '266,', 'erc' : '267,', 'rai' : '268,', 'lot' : '269,', 'req' : '270,', 'bar' : '271,', 'mor' : '272,', 'tan' : '273,', 'esp' : '274,', 'poi' : '132,', 'eau' : '', 'aqu' : '', 'sal' : '', 'ecu' : '', 'qui' : '', 'pat' : ''};
    for (i = 4; i < maxPos; i++)
        gathered += ids[document.getElementById('position'+i).dataset.ressource];
    if (gathered != "")
        txt += "GATHER = {" + gathered + "}\r\n";

    txt += "\r\nfunction move()\r\n\treturn {\r\n" +
           "\t\t{ map = \"83887104\", path = \"396\" }, --Interieur banque Astrub vers Sortie--\r\n" +
           "\t\t{ map = \"54534165\", path = \"424\" }, --Interieur banque Frigost vers Sortie--\r\n" +
           "\t\t{ map = \"2885641\", path = \"424\" }, --Interieur banque Bonta vers Sortie--\r\n" +
           "\t\t{ map = \"99095051\", path = \"410\" }, --Interieur banque Amakna vers Sortie--\r\n" +
           "\t\t{ map = \"8912911\", path = \"424\" }, --Interieur banque Brakmar vers Sortie--\r\n" +
           "\t\t{ map = \"91753985\", path = \"396\" }, --Interieur banque Sufokia vers Sortie (Non fait)--\r\n" +
           "\t\t{ map = \"86511105\", door = \"452\" }, --Interieur banque Ottomaï vers Sortie--\r\n" +
           "\t\t{ map = \"8129542\", path = \"409\" }, --Interieur banque Pandala vers Sortie--\r\n" +
           "\t\t{ map = \"84935175\", path = \"425\" }, --Interieur banque Montagne Koalak vers Sortie--\r\n";
    for(var key in pathdata) {
        txtcoord = key.split(/ /)[0]+key.split(/ /)[1]; // = ["", "(X,", "", "Y)", ""] : (X,Y)
        txtcoord = txtcoord.split("(")[1]; // = ["", "X, Y)"] 
        txtcoord = txtcoord.split(")")[0]; // = ["X, Y", ""] 
        line = pathdata[key];
        linepath = GenerateLine(line);
        if (linepath != "") {
            txt += "\t\t{ map = \"" + txtcoord + "\", path = \"" + linepath + "\""
            if (line[4] != undefined)
                txt += ", gather = true";
            if (line[5] != undefined)
                txt += ", fight = true";
            txt += " },\r\n";
        }
    }
    txt +=    "\t}\r\nend\r\n\r\nfunction bank()\r\n\treturn {\r\n";
    for(var key in pathdata) {
        txtcoord = key.split(/ /)[0]+key.split(/ /)[1]; // = ["", "(X,", "", "Y)", ""] : (X,Y)
        txtcoord = txtcoord.split("(")[1]; // = ["", "X, Y)"] 
        txtcoord = txtcoord.split(")")[0]; // = ["X, Y", ""] 
        line = pathdata[key];
        line = GenerateLine([line[6], line[7], line[8], line[9]]);
        if (line != "")
            txt += "\t\t{ map = \"" + txtcoord + "\", path = \"" + line + "\" },\r\n"
    }
    txt += "\t\t{ map = \"84674566\", door = \"303\" }, --Devant banque Astrub--\r\n" +
           "\t\t{ map = \"83887104\", path = \"396\", npcbank = true }, --Banque Astrub--\r\n" +
           "\t\t{ map = \"54172457\", door = \"358\" }, --Devant banque Frigost--\r\n" +
           "\t\t{ map = \"54534165\", path = \"424\", npcbank = true }, --Banque Frigost--\r\n" +
           "\t\t{ map = \"147254\", door = \"383\" }, --Devant banque Bonta--\r\n" +
           "\t\t{ map = \"2885641\", path = \"424\", npcbank = true }, --Banque Bonta--\r\n" +
           "\t\t{ map = \"88081177\", door = \"216\" }, --Devant banque Amakna--\r\n" +
           "\t\t{ map = \"99095051\", path = \"410\", npcbank = true }, --Banque Amakna--\r\n" +
           "\t\t{ map = \"144931\", door = \"248\" }, --Devant banque Brakmar--\r\n" +
           "\t\t{ map = \"8912911\", path = \"424\", npcbank = true }, --Banque Brakmar--\r\n" +
           "\t\t{ map = \"90703872\", door = \"248\" }, --Devant banque Sufokia (Non fait)--\r\n" +
           "\t\t{ map = \"91753985\", path = \"396\", npcbank = true }, --Banque Sufokia--\r\n" +
           "\t\t{ map = \"155157\", door = \"355\" }, --Devant banque Ottomaï--\r\n" +
           "\t\t{ map = \"86511105\", door = \"452\", npcbank = true }, --Banque Ottomaï--\r\n" +
           "\t\t{ map = \"12580\", door = \"284\" }, --Devant banque Pandala--\r\n" +
           "\t\t{ map = \"8129542\", path = \"409\", npcbank = true }, --Banque Pandala--\r\n" +
           "\t\t{ map = \"73400323\", door = \"330\" }, --Devant banque Montagne Koalak--\r\n" +
           "\t\t{ map = \"84935175\", path = \"425\", npcbank = true }, --Banque Montagne Koalak--\r\n\t}\r\nend\r\n";
    saveTextAsFile(txt);
}

MapClick("(0, 0)");
editOnClick(document.getElementById('pathbutton'), openTabPath, document.getElementById('pathbutton'), 'pathdata');
editOnClick(document.getElementById('bankbutton'), openTabPath, document.getElementById('bankbutton'), 'bankdata');
editOnClick(document.getElementById('map'), MapClick);
editOnClick(document.getElementById('generator'), Generate);