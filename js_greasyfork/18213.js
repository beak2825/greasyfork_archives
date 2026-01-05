// ==UserScript==
// @name         T411 Shoutbox - Change Color Name
// @namespace    www.t411.ch
// @version      1.2.1
// @description  Modif couleur pseudos shout
// @author       Micdu70
// @include      http://www.t411.al/chati/*
// @include      https://www.t411.al/chati/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18213/T411%20Shoutbox%20-%20Change%20Color%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/18213/T411%20Shoutbox%20-%20Change%20Color%20Name.meta.js
// ==/UserScript==
function INIT() {
    //
    // --- INFO ---
    // * Vous pouvez créer différentes listes pour appliquer
    // une couleur différente en définissant une autre variable :
    //
    // var username1 = ["pseudo1"];
    //
    // * Pour créer une liste avec plusieurs pseudos :
    //
    // var username2 = ["pseudo2","pseudo3"];
    //
    // Remplacez pseudo par votre pseudo T411 :
    //
    var username0 = ["pseudo"];
    //
    // --- INFO ---
    // * Choisissez la couleur à appliquer en indiquant soit :
    // - Le nom de la couleur en HTML
    // - Le code couleur HEX
    //
    // * Vous pouvez créer une autre couleur à appliquer
    // à une autre liste en définissant une autre variable :
    //
    // var color1 = "pink";
    //
    // Couleur par défaut : gold
    //
    var color0 = "gold";
    //
    // --- INFO ---
    // * Vous pouvez ajouter les différentes listes
    // et la couleur à appliquer à chacune d'elle :
    //
    // ColorNameChange(username1, color1);
    //
    ColorNameChange(username0, color0);
}
function ColorNameChange(username, color) {
    document.getElementById('messages').addEventListener('DOMNodeInserted', function (event) {
        if (event.target.parentNode.id == 'messages') {
            var element = document.getElementsByClassName(event.target.className) [0];
            var pv = element.className.split(' ') [1];
            var _first = element.getElementsByTagName('a') [0];
            var _second = element.getElementsByTagName('div') [0];
            var _third = _second.getElementsByTagName('div') [0];
            var _fourth = _third.getElementsByTagName('strong') [0];
            var _last = _fourth.getElementsByTagName('a') [0];
            var user_url_split = _last.href.split('/');
            var name_user = user_url_split[5];
            if (username.indexOf(name_user) >= 0) {
                _last.style.color = color;
            }
            if (pv === 'private') {
                var _fourth_pv = _third.getElementsByTagName('strong') [1];
                var _last_pv = _fourth_pv.getElementsByTagName('a') [0];
                var user_url_split_pv = _last_pv.href.split('/');
                var name_user_pv = user_url_split_pv[5];
                if (username.indexOf(name_user_pv) >= 0) {
                    _last_pv.style.color = color;
                }
            }
        }
    }, false);
}
INIT();