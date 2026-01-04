// ==UserScript==
// @name         Flight Rising: Dressing Room Previewer
// @description  Hover items to preview on current model (dragon or scry).
// @namespace    https://greasyfork.org/en/users/547396
// @author       https://greasyfork.org/en/users/547396
// @match        *://*.flightrising.com/dressing/*
// @grant        none
// @version      0.3
// @downloadURL https://update.greasyfork.org/scripts/422124/Flight%20Rising%3A%20Dressing%20Room%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/422124/Flight%20Rising%3A%20Dressing%20Room%20Previewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const morphBtn = document.getElementById('search-morphologies'),
          dragonBtn = document.getElementById('search-dragons'),
          outfitBox = document.getElementById('dr-apparel-selected'),
          outfitTitle = outfitBox.getElementsByClassName('dr-apparel-widget-title')[0],
          searchReturn = document.getElementById('dr-apparel-search-results'),
          timeDelay = 2000,
          previewBox = document.createElement('div'),
          previewImg = document.createElement('img');

    let imgType;
    let dragonID;

    outfitTitle.appendChild(previewBox);
    previewBox.appendChild(previewImg);
    previewImg.setAttribute('width','198');
    previewBox.style.border = '1px solid #ccc';
    previewBox.style.margin = '5px 0 0 5px';
    previewBox.style.width = '198px';
    previewBox.style.height = '198px';

    // event listeners
    morphBtn.addEventListener('click', init);
    dragonBtn.addEventListener('click', init);

    // lets gooo
    init();

    function init() {
        previewImg.src = ''; // reset

        setTimeout(function(){
            getCurrDragon();
            preparePreview();
        }, 2000);
    }

    function getCurrDragon() {
        let dragonBox = document.getElementById('dragon-image-box');
        let dragonImage = dragonBox.getElementsByTagName('img')[0].src;

        let urlString = dragonImage.toString();
        let url = new URL(urlString);

        dragonID = url.searchParams.get('did') || url.searchParams.get('sdid');
        imgType = (urlString.includes('scry')) ? 'scry' : 'dragon';

        previewImg.src = buildUrl( imgType, dragonID );
    }

    function updatePreview( itemID ) {
        let newSrc = buildUrl(imgType, dragonID, itemID);

        if (previewImg.src !== newSrc) {
            previewImg.src = newSrc;
        }
    }

    function buildUrl( type, id, apparel ) {
        let sord = ( type == 'dragon' ) ? 'd' : 'sd';
        let returnUrl = `https://www1.flightrising.com/dgen/dressing-room/${type}?${sord}id=${id}&skin=0&apparel=${apparel}&xt=dressing.png`;

        return returnUrl;
    }

    function preparePreview() {
        let items = searchReturn.querySelector('.items');

        items.addEventListener('mouseover', function( event ) {
            let item = event.target;

            if ( item.classList.contains('fayt-search-result-item') ) {
                let itemid = item.getAttribute('data-itemid');

                setTimeout(function(){
                    updatePreview(itemid);
                }, 500);
            }
        }, false);
    }
})();