// ==UserScript==
// @name         Port.hu reklámblokkoló-blokkoló blokkoló
// @namespace    https://greasyfork.org/hu/users/547610-fu-manchu
// @version      0.3
// @description  Eltávolítja a bekapcsolt reklámblokkolónál megjelenő kék figyelmeztető üzenetet a port.hu-n, és engedélyezi a görgetést.
// @author       Fu Manchu
// @match        https://port.hu/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402408/Porthu%20rekl%C3%A1mblokkol%C3%B3-blokkol%C3%B3%20blokkol%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/402408/Porthu%20rekl%C3%A1mblokkol%C3%B3-blokkol%C3%B3%20blokkol%C3%B3.meta.js
// ==/UserScript==

window.addEventListener ("load", runAfter, false);
function runAfter() {
document.body.style = 'overflow: initial !important;';

    var eltuntet = document.evaluate('/html/body/div[2]/div/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    eltuntet.remove();


if(location.pathname.includes("/tv")) {
    var eltuntet_tvmusor1= document.evaluate('/html/body/div[3]/div[2]/style', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    eltuntet_tvmusor1.remove();
    var eltuntet_tvmusor2 = document.evaluate('/html/body/div[3]/div[2]/div[5]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    eltuntet_tvmusor2.remove();
    var eltuntet_tvmusor3 = document.evaluate('/html/body/div[3]/div[2]/script[18]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    eltuntet_tvmusor3.remove();
    var eltuntet_tvmusor4= document.evaluate('/html/body/div[3]/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    eltuntet_tvmusor4.emove();
    }
 }