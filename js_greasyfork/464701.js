// ==UserScript==
// @name         See Eggs
// @version      1.2
// @description  Для предварительного просмотра кодов и ссылок на страницу яйца дракона в dragoncave.net
// @author       Ivypoolflame
// @match        https://dragcave.net/abandoned
// @namespace https://greasyfork.org/users/1066328
// @downloadURL https://update.greasyfork.org/scripts/464701/See%20Eggs.user.js
// @updateURL https://update.greasyfork.org/scripts/464701/See%20Eggs.meta.js
// ==/UserScript==
var links = document.querySelectorAll('a:not([class])')
for (var i = 0; i < links.length - 2; i= i +1) {
    var necessary_links = links[i+11] //первые 11 ссылок - это ссылки не на яйца
    var orig_link = necessary_links.href //достаём ссылки из элементов
    var sekond_link = orig_link.replace('abandoned', 'view'); //чтобы не забирать яйцо, а посмотреть
    //console.log('элемент: ', necessary_links, 'нормальная ссыль: ',sekond_link,'ссылка элемента ', orig_link) /*для проверки багов*/
    var href = sekond_link.slice(0, -9)
    document.querySelectorAll('div.ap>div')[i].insertBefore(Object.assign(document.createElement("a"), {className:"something", innerHTML: '<a class="something" href="'+ href + '">' + href.replace('https://dragcave.net/view/', '') + '</a>'}), null)
}