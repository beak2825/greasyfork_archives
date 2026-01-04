// ==UserScript==
// @name         Meneame.net - Menú ampliado
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ten todas las opciones SIEMPRE en el mismo sitio
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486084/Meneamenet%20-%20Men%C3%BA%20ampliado.user.js
// @updateURL https://update.greasyfork.org/scripts/486084/Meneamenet%20-%20Men%C3%BA%20ampliado.meta.js
// ==/UserScript==

const menu_New = '<ul class="menu01-itemsr">MENU_OPTIONS</ul>';
const menu_Location = '#more-options';
const menu_Item = '<li title="%1"><a href="%2" data-option-name="%3" class="nav-bar-option"><div class="option-title">%3</div></a></li>';
const username_Shown = document.querySelector('#userinfo .usertext.wideonly .tooltip').innerHTML;

const items = [
    ['Comunidades', '/subs', 'comunidades'],
    ['menear noticias pendientes', '/queue', 'nuevas'],
    ['leer o escribir notas y mensajes privados', '/notame/', 'nótame'],
    ['visualizador en tiempo real', '/sneak', 'fisgona'],
    ['las imágenes subidas por los usuarios', 'javascript:fancybox_gallery(\'all\');', 'galería'],
    ['ayuda para principiantes', 'https://github.com/Meneame/meneame.net/wiki/Comenzando', 'ayuda'],
    ['noticias candidatas', '/queue?meta=_popular', 'candidatas'],
    ['noticias más populares', '/popular', 'populares'],
    ['noticias más negativizadas', '/topshames.php', 'impopulares'],
    ['artículos de usuarios', '/articles', 'artículos'],
    ['noticias más visitadas', '/top_visited', 'más visitadas'],
    ['noticias más activas', '/top_active', 'destacadas'],
    ['mejores comentarios', '/top_comments', 'comentarios +🔼'],
    ['conversaciones entre dos usuarios', '/between.php', 'debates'],
    ['mis comentarios', '/user/' + username_Shown + '/commented', 'mis comentarios'],
    ['mis notas', '/user/' + username_Shown + '/notes', 'mis notas'],
    ['mis privados', '/user/' + username_Shown + '/notes_privates', 'mis privados'],
    ['nube de etiquetas', '/cloud.php', 'nube etiquetas'],
    ['Información sobre valores de karma y límites', '/values.php', 'valores'],
];

const [Comunidades, Nuevas, Notame, Fisgona, Galeria, Ayuda, Candidatas, Populares, Impopulares, Articulos, Mas_Visitadas,
       Más_Activas, Mejores_Comentarios, Debates, Mis_Comentarios, Mis_Notas, Mis_Privados, Nube_Etiquetas, Valores] =
      items.map(([title, href, menuItem]) => {return menu_Item.replace('%1', title).replace('%2', href).replaceAll('%3', menuItem);
});

(function() {
    var menu_Old = document.querySelector(menu_Location);
    menu_Old.innerHTML = menu_New.replace(
        'MENU_OPTIONS',
     /* Comunidades + */
        Nuevas +
        Notame +
     /* Fisgona + */
        Galeria +
     /* Ayuda + */
        Candidatas +
        Populares +
        Impopulares +
        Articulos +
        Mas_Visitadas +
        Más_Activas +
        Mejores_Comentarios +
        Debates +
        Mis_Comentarios +
        Mis_Notas +
        Mis_Privados +
        Nube_Etiquetas +
        Valores
    );
})();