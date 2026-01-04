// ==UserScript==
// @name         Forum WS - Amélioration affichage notification MP non lu(s)
// @namespace    Forum-WS-MP
// @version      1.1.1
// @description  Rendre le "MP" en rouge et indiquer le nombre de message(s) non lu(s), en haut à droite du forum WS (style "v4" seulement)
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369730/Forum%20WS%20-%20Am%C3%A9lioration%20affichage%20notification%20MP%20non%20lu%28s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369730/Forum%20WS%20-%20Am%C3%A9lioration%20affichage%20notification%20MP%20non%20lu%28s%29.meta.js
// ==/UserScript==

function INIT()
{
    var check_v3 = "noxContent";
    if (document.getElementById(check_v3))
    {
        var error_msg = "Le Script 'Forum WS - Amélioration affichage notification MP non lu(s)' ne fonctionne pas sur le style d'affichage 'v3'.";
        END(error_msg);
    }
    if (document.getElementsByClassName('conl')[0])
    {
        var check_mp = document.getElementsByClassName('conl')[0];
        if (check_mp.getElementsByTagName('li')[3])
        {
            var mp_msg = check_mp.getElementsByTagName('li')[3].getElementsByTagName('span')[0].textContent;
            var number = /\d+/;
            var mp_nb;
            if (mp_msg.match(number))
            {
                mp_nb = mp_msg.match(number)[0];
            }
            else
            {
                mp_nb = "1";
            }
            var mp_notif = document.getElementById('navpm');
            mp_notif.innerHTML = "<a href=\"https://www.wareziens.net/forum/pms_inbox.php\"><span style=\"color: red;\">(" + mp_nb + ") MP</span></a>";
        }
    }
}

function END(o)
{
    throw o;
}

INIT();