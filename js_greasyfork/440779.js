// ==UserScript==
// @name         R34.XXX Favorites Button
// @namespace    https://linktr.ee/GanbatGAN
// @version      1.3
// @description  Adds a favorite button to gallery pages on rule34.xxx.
// @author       Ganbat
// @match        https://rule34.xxx/index.php?page=post&s=list&tags=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/440779/R34XXX%20Favorites%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/440779/R34XXX%20Favorites%20Button.meta.js
// ==/UserScript==

/* globals $ */

GM_addStyle ( `
    .galFavBtn {
        cursor: pointer;
        color: #009;
    }
    .galFavBtn:hover {
        color: #000;
    }
` );

function IBEButton(){
    const tpDetails = document.getElementById('thumbPlusDetailsOptions');
    const tpFavButton = document.createElement("div");
    tpFavButton.setAttribute('class', 'thumbPlusDetailsButton');
    tpFavButton.setAttribute('tooltip', 'Add to Favorites');
    tpFavButton.setAttribute('style', 'display: none;');
    tpFavButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m 22.051576,3.5701033 c -1.236895,-1.3415351 -2.934095,-2.080391 -4.77932,-2.080391 -1.379271,0 -2.642417,0.4360581 -3.754439,1.2959602 C 12.956703,3.2197252 12.448272,3.7507609 12,4.370576 11.55191,3.7509435 11.043297,3.2197252 10.482,2.7856725 9.3701616,1.9257704 8.1070149,1.4897123 6.7277442,1.4897123 c -1.8452255,0 -3.542607,0.7388559 -4.7795026,2.080391 -1.22212933,1.3258569 -1.89535776,3.137175 -1.89535776,5.1005301 0,2.0207786 0.7530753,3.8705626 2.36988086,5.8215216 1.4463566,1.745143 3.5251068,3.516721 5.9323587,5.568125 0.821984,0.700574 1.7537116,1.494666 2.7211706,2.340531 0.255581,0.223863 0.583537,0.347096 0.923706,0.347096 0.339987,0 0.668125,-0.123233 0.923342,-0.34673 0.967458,-0.846049 1.899733,-1.640506 2.722081,-2.341443 2.406888,-2.051041 4.485638,-3.822436 5.931994,-5.567762 1.616806,-1.950776 2.369699,-3.80056 2.369699,-5.8215206 0,-1.9631731 -0.673228,-3.7744912 -1.89554,-5.1003481 z m 0,0"></path></svg>'
    tpDetails.firstElementChild.appendChild(tpFavButton);

    const targetNode = document.getElementById('thumbPlusPreviewLink');
    const config = { attributeFilter: [ 'href' ] };

    const callback = function(mutationsList, observer) {
        let postID = String(targetNode.getAttribute('href')).replace(/index\.php.+id=/, '');
        tpFavButton.setAttribute('style', 'display: inline-block;');
        tpFavButton.setAttribute('onclick', 'post_vote(\''+ postID +'\', \'up\'); addFav(\''+ postID +'\'); $(this).setAttribute("style", "display: none;"); return false;');
    }

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

setTimeout(() => {
    if ($('#thumbPlusPreviewContainer').length) {
        IBEButton();
    } else {
        $('.thumb').each(function() {
            var postLink = $(this).children('a').first();
            var postID = $(this).attr('id').substring(1);
            postLink.after('<br /><div><b class="galFavBtn" onclick="post_vote(\''+ postID +'\', \'up\'); addFav(\''+ postID +'\'); $(this).parentElement.hide(); return false;">Add to Favorites</b></div>');
        });
    }
}, 200);