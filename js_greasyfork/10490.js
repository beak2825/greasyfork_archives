// ==UserScript==
// @name Forum-messagerie
// @namespace Forum
// @author Gideon, Kmaschta
// @date 21/12/2013
// @version 2.3
// @description Ajoute la messagerie sur le Forum
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Forum/2-21-Messagerie
// @compat Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/10490/Forum-messagerie.user.js
// @updateURL https://update.greasyfork.org/scripts/10490/Forum-messagerie.meta.js
// ==/UserScript==
/* A LIRE :
 Le script utilise simplement les requêtes standard tout reste dans le serveur de MS pixel.
 Il n'y a donc pas à avoir de crainte sur la possible lecture de vos messages par un tier.
 Une fois installé rendez vous à l'adresse contenu dans @include pour lire vos nouveaux mps */
// Patch 2.0 : Rendu compatible avec la nouvelle interface (Kmaschta)
// Patch 2.2 : Passage au .eu
// Patch 2.3 : Repassage au .net


function getElementsByRegExpId(p_regexp, p_element, p_tagName) {
    p_element = p_element === undefined ? document : p_element;
    p_tagName = p_tagName === undefined ? '*' : p_tagName;
    var v_return = [];
    var v_inc = 0;
    for(var v_i = 0, v_il = p_element.getElementsByTagName(p_tagName).length; v_i < v_il; v_i++) {
        if(p_element.getElementsByTagName(p_tagName).item(v_i).id && p_element.getElementsByTagName(p_tagName).item(v_i).id.match(p_regexp)) {
            v_return[v_inc] = p_element.getElementsByTagName(p_tagName).item(v_i);
            v_inc++;
        }
    }
    return v_return;
}

function removeElementsByClass(className){
    elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

document.getElementById('liste_forums').innerHTML= '<h2>Messagerie</h2>';
var newMess = document.createElement('div');
newMess.id = "message";
newMess.style = "padding:5px;margin:5px;text-align:center;";
newMess.style.marginLeft = '290px';
document.getElementById('liste_forums').appendChild(newMess);
var newMenu = document.createElement('div');
newMenu.id = "menu";
document.getElementById('liste_forums').appendChild(newMenu);

var xhr = new XMLHttpRequest();
xhr.open('POST', 'https://www.dreadcast.net/Menu/Messaging/OpenFolder');
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xhr.send("id_folder=0");
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) { 
        document.getElementById('menu').innerHTML = xhr.responseText;
        setTimeout(function() {
            var div=getElementsByRegExpId(/^message_\d+$/);
            for(var i=0; i<div.length; i++) {
                var id = div[i].id.replace(/message_(\d+)$/, '$1')
                removeElementsByClass('selecteur');
                removeElementsByClass('indicateur');
                div[i].setAttribute('style', "cursor:pointer;background-color:lightgray;display:inline-block;margin:3px;padding:1px;font-size:small;vertical-align:top;text-align:center;");
                div[i].setAttribute('onclick', "var xhr2 = new XMLHttpRequest();xhr2.open('GET', 'https://www.dreadcast.net/Menu/Messaging/action=OpenMessage&id_conversation="+id+"');xhr2.send(null); xhr2.onreadystatechange = function() {if (xhr2.readyState == 4) { document.getElementById('message').innerHTML = xhr2.responseText; document.getElementsByClassName('zone_conversation')[0].innerHTML=''; document.getElementsByClassName('zone_reponse')[0].innerHTML=''; document.getElementsByClassName('avatar')[0].parentNode.removeChild(document.getElementsByClassName('avatar')[0]);}};");
            }
        }, 1000);
    }
};



/**/

