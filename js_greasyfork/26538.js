// ==UserScript==
// @name         Suppression des "Publications Sponsorisées / Suggérées" de Facebook.
// @description  Retire les publications sponsorisées et suggérées même si des ami(e)s les ont aimé
// @namespace    https://greasyfork.org/users/94925
// @author       ReActif
// @version      1.1
// @match        https://www.facebook.com/*
// @match        http://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26538/Suppression%20des%20%22Publications%20Sponsoris%C3%A9es%20%20Sugg%C3%A9r%C3%A9es%22%20de%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/26538/Suppression%20des%20%22Publications%20Sponsoris%C3%A9es%20%20Sugg%C3%A9r%C3%A9es%22%20de%20Facebook.meta.js
// ==/UserScript==

// la class CSS '_4ikz' correspond à la zone indiquant "Publication sponsorisée/suggérée"
// la class CSS '_m8d' correspond à la zone indiquant "Sponsorisé"
// la class CSS 'ego_column' correspond à la colonne de droite
// la class CSS 'ego_section' correspond à la zone de "publicité suggérée" de la colonne de droite

//A chaque changement de page
document.addEventListener('DOMNodeInserted', SearchPosts, false);
function SearchPosts()
{
    var TMP_Post = document.getElementsByClassName('_4ikz');
    for (var i = 0; i < TMP_Post.length; i++)
    {
        if (TMP_Post[i].getElementsByClassName('_m8d') [0] !== undefined)
        {
            //Debug, permet d'afficher une alerte si des élements sont trouvés.
            //alert ("Element trouvé : " + TMP_Post[i].getElementsByClassName('_m8d')[0].innerHTML);
            TMP_Post[i].remove();
        }
    }

    // On supprime aussi les publicités suggérées de la colonne de droite
    var TMP_Ego = document.getElementsByClassName('ego_column');
    for (var i = 0; i < TMP_Ego.length; i++)
    {
        if (TMP_Ego[i].getElementsByClassName('ego_section') [0] !== undefined)
        {
            TMP_Ego[i].remove();
        }
    }
}