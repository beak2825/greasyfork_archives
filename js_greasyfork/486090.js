// ==UserScript==
// @name         Meneame.net - Menú ampliado ¡EXPANDIBLE!
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Ten todas las opciones SIEMPRE en el mismo sitio ocupando el mínimo espacio
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486090/Meneamenet%20-%20Men%C3%BA%20ampliado%20%C2%A1EXPANDIBLE%21.user.js
// @updateURL https://update.greasyfork.org/scripts/486090/Meneamenet%20-%20Men%C3%BA%20ampliado%20%C2%A1EXPANDIBLE%21.meta.js
// ==/UserScript==

const menu_New = '<ul class="' + (IsMobileDevice() ? 'menu01-itemsl' : 'menu01-itemsr') +'">MENU_OPTIONS</ul>';
const menu_Location = IsMobileDevice() ? '#nav-panel .header-menu01' : '#more-options';
const menu_Category = '<li class="mnu-c" title="%1"><details><summary class="mnu-c">%2</summary><ul class="mnu-c">MENU_ITEMS</li></details></li>';
const menu_Item = '<li class="mnu-c" title="%1"><a href="%2" data-option-name="%3" class="nav-bar-option"><div class="option-title">%3</div></a></li>';
const menu_Extended_CSS = '<style>ul.mnu-c {list-style: none; padding: 0;} li.mnu-c{padding: 4px 12px !important;text-transform: uppercase; font-weight: 600;color: #fff;}</style>';
const search = '&#x1F50D;&#xfe0e; ';

const parent_Items = [
    [0, 'noticias', 'distintas vistas de noticias'],
    [1, 'nótame','distintas vistas del nótame'],
    [2, 'otros','otras opciones'],
    [3, 'información','información varia de menéame'],
    [4, user_login,'enlaces de tu usuario']
];

const items = [
    ['portada de noticias', '/', 'portada',0],
    ['menear noticias pendientes', '/queue', 'nuevas',0],
    ['noticias candidatas', '/queue?meta=_popular', 'candidatas',0],
    ['noticias más populares', '/popular', 'populares',0],
    ['noticias más negativizadas', '/topshames.php', 'impopulares',0],
    ['noticias más visitadas', '/top_visited', 'más visitadas',0],
    ['noticias más activas', '/top_active', 'destacadas',0],
    ['noticias favoritas', '/user/' + user_login + '/favorites', 'guardadas',0],
    ['buscar noticias', '/search?q=&w=links&h=&o=date&u=', search + 'buscar',0],
    ['comentarios entre dos usuarios', '/between.php?type=comments&u1=' + user_login, 'debates',0],
    ['leer o escribir notas', '/notame/', 'todas',1],
    ['notas más populares', '/notame/_best', 'populares',1],
    ['notas con encuestas', '/notame/_poll', 'encuestas',1],
    ['notas de amistades', '/user/' + user_login + '/notes_friends', 'amigos',1],
    ['notas favoritas', '/user/' + user_login + '/notes_favorites', 'guardadas',1],
    ['buscar notas', '/search?q=&w=posts&h=&o=date&u=', search + ' buscar',1],
    ['notas entre dos usuarios', '/between.php?type=posts&u1=' + user_login, 'debates',1],
    ['últimas imágenes del nótame', 'javascript:fancybox_gallery(\'post\');', 'galería',1],
    ['Comunidades', '/subs', 'comunidades',2],
    ['artículos de usuarios', '/articles', 'artículos',2],
    ['artículos favoritos', '/user/' + user_login + '/articles_favorites', 'art. guardados',2],
    ['las imágenes subidas por los usuarios', 'javascript:fancybox_gallery(\'all\');', 'galería',2],
    ['mejores comentarios', '/top_comments', 'comentarios +&#x2b06;',2],
    ['publicar una noticia', '/submit', '+ meneo',2],
    ['publicar un artículo', '/submit?type=article&write=true', '+ artículo',2],
    ['visualizador en tiempo real', '/sneak', 'fisgona',3],
    ['visualizador en tiempo real estilo telnet', '/telnet', 'telnet',3],
    ['buscar notas', '/search?q=&w=posts&h=&o=date&u=', search + 'buscar',3],
    ['ayuda para principiantes', 'https://github.com/Meneame/meneame.net/wiki/Comenzando', 'ayuda',3],
    ['nube de etiquetas', '/cloud.php', 'nube etiquetas',3],
    ['Información sobre valores de karma y límites', '/values.php', 'valores',3],
    ['noticias pendientes de subir/bajar', '/promote.php', 'promote',3],
    ['mi perfil', '/user/' + user_login, 'perfil',4],
    ['mis artículos', '/user/' + user_login + '/articles', 'mis artículos',4],
    ['mis meneos', '/user/' + user_login + '/history', 'mis historias',4],
    ['mis comunidades', '/user/' + user_login + '/subs', 'comunidades',4],
    ['mis comentarios', '/user/' + user_login + '/commented', 'mis comentarios',4],
    ['respuestas a mis comentarios','/user/' + user_login + '/conversation', 'me comentan',4],
    ['buscar en mis comentarios', '/search?q=&w=comments&h=&o=date&u=' + user_login, search + 'comentarios',4],
    ['mis notas', '/user/' + user_login + '/notes', 'mis notas',4],
    ['respuestas a mis notas','/user/' + user_login + '/notes_conversation', 'me notean',4],
    ['buscar en mis notas', '/search?q=&w=posts&h=&o=date&u=' + user_login, search + 'notas',4],
    ['mis privados', '/user/' + user_login + '/notes_privates', 'mis privados',4],
];

function BuildMenu() {
    if (IsMobileDevice()) LoadMobileMenu();
    let result = '';
    for (const parent of parent_Items) {
        const childItems = items.filter(item => item[3] === parent[0]);
        let childResult = '';
        childItems.forEach(child => {childResult += menu_Item.replace('%1', child[0]).replace('%2', child[1]).replaceAll('%3', child[2]);});
        result += menu_Category.replace('%1', parent[2]).replace('%2', parent[1]).replace('MENU_ITEMS', childResult);
    }
    var menu_Old = document.querySelector(menu_Location);
    menu_Old.innerHTML = menu_New.replace('MENU_OPTIONS', result);
    document.querySelectorAll("li.mnu-c[title]").forEach(li => {li.title = li.title.toUpperCase();});
    AdjustMenuHeight();
    DetectResize();
}

function LoadMobileMenu() {
    let element = document.querySelector('#header-top #nav-menu');
    if(element) {element.click(); element.click();}
}

function IsMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function AdjustMenuHeight() {
    var mnu = document.querySelector(menu_Location);
    var headerTopBar = document.getElementById('header-top-bar');
    mnu.style.maxHeight = (window.innerHeight - headerTopBar.clientHeight) + 'px';
    mnu.style.overflow = 'hidden auto';
}

function DetectResize() {
    window.addEventListener('orientationchange', AdjustMenuHeight);
    window.addEventListener('resize', AdjustMenuHeight);
}

(function() {
    document.head.insertAdjacentHTML("beforeend", menu_Extended_CSS);
    BuildMenu();
})();