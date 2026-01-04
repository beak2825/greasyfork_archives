// ==UserScript==
// @name         WHMCS - Template Switcher
// @namespace    Digimol
// @version      0.1
// @description  Adds the ability to switch between templates
// @author       Dave Mol
// @match        https://shop.idfnv.com/beheer/configproducts.php*
// @match        https://shop.wdmsh.com/beheer/configproducts.php*
// @match        https://sales.microglollc.com/beheer/configproducts.php*
// @match        https://pay4fee.net/bill/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427849/WHMCS%20-%20Template%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/427849/WHMCS%20-%20Template%20Switcher.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const removeParam = (key, sourceURL) => {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split("=")[0];
                if (param === key) {
                    params_arr.splice(i, 1);
                }
            }
            if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    }

    let menu = document.querySelector('#main-menu');
    if (!menu) { return false; }
    let switcher = document.createElement('div');
    switcher.style.textAlign = 'center';
    switcher.style.background = '#FFF';

    let href = (window.location.href.includes('?')) ? window.location.href + '&' :  window.location.href + '?';
    href = removeParam('systpl', href);
    href = removeParam('carttpl', href);

    switcher.innerHTML = 'Switch template: ';

    let btn_idfnv = document.createElement('a');
    btn_idfnv.innerHTML = 'IDFNV';
    btn_idfnv.href = href + 'systpl=idfnv810&carttpl=microglollc_cart810';
    btn_idfnv.style.margin = '0 5px';
    switcher.appendChild(btn_idfnv);

    let btn_wdmsh = document.createElement('a');
    btn_wdmsh.innerHTML = 'WDMSH';
    btn_wdmsh.href = href + 'systpl=wdmsh810&carttpl=microglollc_cart810';
    btn_wdmsh.style.margin = '0 5px';
    switcher.appendChild(btn_wdmsh);

    let btn_123thai = document.createElement('a');
    btn_123thai.innerHTML = '123ThaiHost';
    btn_123thai.href = href + 'systpl=123thai810&carttpl=microglollc_cart810';
    btn_123thai.style.margin = '0 5px';
    switcher.appendChild(btn_123thai);

    let btn_dmca4free = document.createElement('a');
    btn_dmca4free.innerHTML = 'DMCA4FREE';
    btn_dmca4free.href = href + 'systpl=dmca810&carttpl=microglollc_cart810';
    btn_dmca4free.style.margin = '0 5px';
    switcher.appendChild(btn_dmca4free);

    let btn_gameworld = document.createElement('a');
    btn_gameworld.innerHTML = 'TheGameWorld';
    btn_gameworld.href = href + 'systpl=tgw&carttpl=tgw_cart';
    btn_gameworld.style.margin = '0 5px';
    switcher.appendChild(btn_gameworld);

    menu.parentNode.insertBefore(switcher, menu.nextSibling);
})();

