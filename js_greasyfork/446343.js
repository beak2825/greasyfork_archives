// ==UserScript==
// @name           hwm_arts_links_to_auction
// @author         Gexator
// @namespace      Gexator
// @description    Переход к артефакту на рынке с любой страницы.
// @homepage       https://greasyfork.org/ru/users/924441-gexator
// @icon           https://sun9-8.userapi.com/s/v1/ig2/uuP3ekzDdtxUGLkN_lmCW15PwkcrsLWS2RVjUlm2HbG5Pj7cBxl5aomu4cmXoOKaTABgUhogki2wwvLHSuH4C90K.jpg?size=64x64&quality=95
// @version        1.0
// @license        MIT
// @encoding 	   utf-8
// @include        *heroeswm.ru/object-info.php*
// @include        *heroeswm.ru/home.php*
// @include        *heroeswm.ru/inventory.php*
// @include        *heroeswm.ru/auction.php*
// @include        *heroeswm.ru/pl_info.php*
// @include        *heroeswm.ru/sklad_info.php*
// @include        *heroeswm.ru/shop.php*
// @include        *heroeswm.ru/help.php*
// @downloadURL https://update.greasyfork.org/scripts/446343/hwm_arts_links_to_auction.user.js
// @updateURL https://update.greasyfork.org/scripts/446343/hwm_arts_links_to_auction.meta.js
// ==/UserScript==

function getArtID(art) {
    if (node = art.closest('div[id*="id_inv_item"]')) {
        let regex = /id_inv_item(\d+)/g;
        let idx = parseInt(regex.exec(node.id)[1]);
        return arts[idx]['art_id'];
    }
    else if (node = art.closest('div[id*="slot"]')) {
        let regex = /slot(\d+)/g;
        let idx = parseInt(regex.exec(node.id)[1]);
        let locid = slots[idx];
        for (i = 0; i < arts.length; i++) {
            if (arts[i]['id'] == locid) return arts[i]['art_id'];
        }
    }
    else {
        let src = art.querySelector('img[src*="artifacts"]').src;
        let regex = /artifacts.*\/(\w+).png/g;
        return regex.exec(src)[1];
    }
}

function getHREF(art) {
    if (node = art.querySelector('a[href*="art_info.php"]')) return node.href;
    else return `art_info.php?id=${getArtID(art)}`;
}

function getLink(page) {
    if (a = page.querySelector('div.art_info_left_block a[href*="auction.php"]')) return a.href;
    return null;
}

function requestHandler(event) {
    if (request.readyState == 4 && request.status == 200) {
        let page = document.createElement('div');
        page.innerHTML = request.responseText;
        if (link = getLink(page)) window.open(link);
    }
}

function navigate(event) {
    if (event.ctrlKey) {
        event.preventDefault();
        request.open('GET', getHREF(event.currentTarget));
        //request.open('GET', `art_info.php?id=${getID(event.currentTarget)}`);
        request.send(null);
    }
}

function linkEvs(container, selector, evname, evfunc) {
    var elements = container.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
        let elem = elements[i];
        elem.addEventListener(evname, evfunc);
    }
}

function artlink(container) {
    linkEvs(container, 'div[class*="arts_info shop_art_info"]', 'click', navigate);
}

//
//main
try {
    var request = new XMLHttpRequest();
    request.onreadystatechange = requestHandler;
    //
    artlink(document);
    if (!location.pathname.includes('inventory')) return;
    //для инвентаря
    let block = document.querySelector('div.inventory_block');
    let pers = document.querySelector('div#inv_doll_inside');
    let observer = new MutationObserver(mutationRecords => {artlink(block);});
    let observer1 = new MutationObserver(mutationRecords => {artlink(pers);});
    observer.observe(block, {childList: true, subtree: true});
    observer1.observe(pers, {childList: true, subtree: true});
    return;
}
catch (ex) {
    alert(ex);
}