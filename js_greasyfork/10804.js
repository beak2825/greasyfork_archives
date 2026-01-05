// ==UserScript==
// @name         T411 Shoutbox - Bouton Répondre
// @namespace    https://www.t411.io
// @version      1.6.1
// @description  Ajoute un bouton répondre dans la shoutbox de T411
// @author       Micdu70
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @exclude      http://www.t411.al/chati/history.php*
// @exclude      https://www.t411.al/chati/history.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10804/T411%20Shoutbox%20-%20Bouton%20R%C3%A9pondre.user.js
// @updateURL https://update.greasyfork.org/scripts/10804/T411%20Shoutbox%20-%20Bouton%20R%C3%A9pondre.meta.js
// ==/UserScript==
function ButtonCheck(check, username) {
    if (check === true) {
        ButtonDisplay(null);
    } else {
        ButtonDisplay(username);
    }
}
function ButtonDisplay(check) {
    if (check === null) {
        document.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
            if (event.target.parentNode.id == 'messages') {
                var elems_show = document.getElementsByTagName('a');
                for (var i = 0; i < elems_show.length; i++) {
                    elems_show[i].style.visibility = 'visible';
                }
            }
        }, false);
    } else {
        document.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
            if (event.target.parentNode.id == 'messages') {
                var elems_hide = document.getElementsByClassName(check);
                for (var i = 0; i < elems_hide.length; i++) {
                    elems_hide[i].style.visibility = 'hidden';
                }
            }
        }, false);
    }
}
function ButtonClicked(x, username, button) {
    document.getElementById('text-input').focus();
    var text = document.getElementById('text-input').value;
    if (button == "Répondre") {
        if (!text.match(/\s$/)) {
            if (text.charAt(0) != '@') {
                document.getElementById('text-input').value = x + ': ' + text;
            } else {
                document.getElementById('text-input').value = x + text;
            }
        } else {
            if (text.match(/@\S+\s/g)) {
                var last = text.substr(text.lastIndexOf('@'));
                if (last.match(/@\S+\s:\s\S+/g)) {
                    document.getElementById('text-input').value = text + x;
                } else {
                    if (last.match(/@\S+\s:\s/g)) {
                        text = text.replace(/(@\S+\s)(:\s)/g, '$1');
                        document.getElementById('text-input').value = text + x + ': ';
                    } else {
                        document.getElementById('text-input').value = text + x;
                    }
                }
            } else {
                document.getElementById('text-input').value = text + x;
            }
        }
        var elems_hide = document.getElementsByClassName(username);
        for (var i = 0; i < elems_hide.length; i++) {
            elems_hide[i].style.visibility = 'hidden';
        }
        ButtonCheck(false, username);
    } else {
        if (text.indexOf(x) == -1) {
            document.getElementById('text-input').value = text + x;
        }
    }
}
function BuildLink(message, libelle, libelleColor, respondItem) {
    var link = document.createElement('a');
    link.setAttribute('class', respondItem);
    link.setAttribute('style', 'color:' + libelleColor + ';a:hover{text-decoration:underline;};cursor:pointer;position:relative;right:1px;display:block;');
    link.addEventListener('click', function () {
        ButtonClicked(this.className, respondItem, libelle);
    }, false);
    var newText = document.createTextNode(libelle);
    link.appendChild(newText);
    var emplacement_0 = message;
    var emplacement_1 = emplacement_0.getElementsByTagName('div') [0];
    emplacement_1.appendChild(link);
}
function AnswerItems() {
    document.getElementById('send').onclick = function () {
        var elems_show = document.getElementsByTagName('a');
        for (var i = 0; i < elems_show.length; i++) {
            elems_show[i].style.visibility = 'visible';
        }
        ButtonCheck(true, null);
    };
    document.styleSheets[0].insertRule('#messages .data>a {display:block !important;}', 0);
    document.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
        if (event.target.parentNode.id == 'messages') {
            var element = document.getElementsByClassName(event.target.className) [0];
            var _first = element.getElementsByTagName('div') [0];
            var _second = _first.getElementsByTagName('div') [0];
            var third = _second.getElementsByClassName('button-delete').length;
            var pv = element.className.split(' ') [1];
            if ((third === 0) && (pv !== 'private')) {
                var element2 = element.getElementsByTagName('a') [0];
                var user_url_split = element2.href.split('/');
                var name_user = user_url_split[5];
                var bouton = _first;
                // Syntaxe pour l'ajout d'un bouton :
                // BuildLink(bouton, 'Nom_du_button', 'Couleur_du_button', 'Votre_message');
                // Exemple réel :
                // BuildLink(bouton, 'Bonjour', '#000', 'Bonjour la shout !');
                
                
                // Conseil : Gardez la ligne pour le bouton 'Répondre' comme dernière ligne dans le code
                // pour que ça soit le bouton le plus à gauche.
                BuildLink(bouton, 'Répondre', '#777', '@' + name_user + ' ');
            }
        }
    }, false);
}
function addClearButton() {
    var clear_button = document.createElement('input');
    clear_button.setAttribute('type', 'button');
    clear_button.setAttribute('class', 'button');
    clear_button.setAttribute('id', 'clear');
    clear_button.setAttribute('value', 'Effacer @pseudo');
    var history_button = document.getElementById('history');
    var parentDiv = history_button.parentNode;
    parentDiv.insertBefore(clear_button, history_button);
    clear_button.addEventListener('click', function () {
        clearText();
    }, false);
}
function clearText() {
    var elems_show = document.getElementsByTagName('a');
    for (var i = 0; i < elems_show.length; i++) {
        elems_show[i].style.visibility = 'visible';
    }
    ButtonCheck(true, null);
    document.getElementById('text-input').focus();
    var text = document.getElementById('text-input').value;
    var newtext = text.replace(/@\S+(\s:\s|\s:|\s)?/gi, '');
    document.getElementById('text-input').value = newtext;
}
addClearButton();
AnswerItems();