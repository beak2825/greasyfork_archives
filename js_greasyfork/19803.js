// ==UserScript==
// @name Sbazar galerie ala super
// @description Udela na sbazaru galerku ala super
// @author tkafka
// @version 0.0.9
// @date 2016-03-19
// @namespace galerie-super.sbazar.seznam.tomaskafka.com
// @include http://www.sbazar.cz/*
// @include https://www.sbazar.cz/*
// @match http://www.sbazar.cz/*
// @match https://www.sbazar.cz/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/19803/Sbazar%20galerie%20ala%20super.user.js
// @updateURL https://update.greasyfork.org/scripts/19803/Sbazar%20galerie%20ala%20super.meta.js
// ==/UserScript==


(function(document) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    var target = document.querySelector('#body-wrap');
    addGallery(target);

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        addGallery(target);
    });


    // pass in the target node, as well as the observer options
    observer.observe(target, { 
        // characterData: true,
        // attributes: true, 
        childList: true, 
        subtree: true
    });

    // later, you can stop observing
    // observer.disconnect();

    function addGallery(target) {
        console.log('adding gallery ...', target);
        if (!window.location.pathname.match(/\/detail\/?/)) { return; }

        var egg = target.querySelector('#mrEgg');
        if (!egg) { console.log('no egg in detail'); return; }

        var placeBox = egg.querySelector('#statusMessagePlaceBox');
        if (placeBox.querySelector('.thumbnails')) { console.log('there already is a gallery'); return; }

        // style modifications
        var priceLine = egg.querySelector('#priceLine');
        priceLine.style.margin = '0 5px 1em 0';

        var description = egg.querySelector('.description');
        description.style.margin = '2em 0';

        var seller = egg.querySelector('div[itemprop="seller"]');
        seller.style.margin = '2em 0';

        var title = egg.querySelector('.description h1');
        if (title) {
            title.style.display = 'block';
            title.style.margin = '0 0 1em 0';
            title.style.fontWeight = 'bold';
        }

        var btns = egg.querySelector('.btns');
        if (btns) {
            btns.style.float = 'left';
        }
        var reportWrap = egg.querySelector('#reportWrap');
        if (reportWrap) {
            reportWrap.style.float = 'right';
            reportWrap.style.top = '6px';
        }
        egg.style.padding = '50px 50px 40px 50px';
        
        var otherAdsTitle = document.querySelector('#page > h2');
        if (otherAdsTitle) {
            otherAdsTitle.style.margin = '2.5em 0 0 0.5em';
        }

        // photos
        var contentPhotosContainer = egg.querySelector('.fotky');
        if (!contentPhotosContainer) { console.log('No contentPhotosContainer'); return; }

        var contentPhotos = contentPhotosContainer.querySelectorAll('.fotka img');
        console.log('target/placeBox/contentPhotos:', target, placeBox, contentPhotos);
        if (contentPhotos.length === 0) { console.log('Zero content photos'); return; }

        var clear = placeBox.querySelector('.clear');

        var photoWrapper = document.createElement('div');
        photoWrapper.classList.add('photoWrapper');
        placeBox.insertBefore(photoWrapper, clear); // place before clear

        var thumbnails = document.createElement('div');
        thumbnails.classList.add('thumbnails');
        thumbnails.style.margin = '2em -20px 1em 0';
        photoWrapper.appendChild(thumbnails);

        var photos = document.createElement('div');
        photos.style.display='none';
        photos.classList.add('photos');
        photos.style.margin = '0 -50px 2em -50px';
        photoWrapper.appendChild(photos);

        var showGallery = function() {
            thumbnails.style.display='none';
            photos.style.display='block';
        };

        Array.prototype.forEach.call(contentPhotos, function(contentPhoto, i) {
            console.log('contentPhoto', contentPhoto);
            var photoUrl = contentPhoto.getAttribute('src');
            console.log(photoUrl);

            var thumbnail = document.createElement('a');
            thumbnail.setAttribute('href', photoUrl);
            thumbnail.classList.add('thumbnail');
            thumbnail.style.width='80px';
            thumbnail.style.height='80px';
            thumbnail.style.margin = '0 1em 1em 0';

            thumbnail.style.width='90px';
            thumbnail.style.height='90px';
            thumbnail.style.margin = '0 20px 20px 0';

            thumbnail.style.display = 'inline-block';
            thumbnail.style.background='url(\''+photoUrl+'\')';
            thumbnail.style.backgroundSize='cover';
            thumbnails.appendChild(thumbnail);

            thumbnail.addEventListener(
                'click', 
                function(event){ 
                    showGallery();             
                    event.preventDefault();
                }, 
                false);

            var fotka = document.createElement('div');
            fotka.classList.add('fotka');
            photos.appendChild(fotka);

            var fotkaImg = document.createElement('img');
            fotkaImg.setAttribute('src', photoUrl);
            fotkaImg.style.width = '100%';
            fotkaImg.style.maxWidth = '';
            fotka.appendChild(fotkaImg);

        });

        // remove big photos
        while (contentPhotosContainer.firstChild) {
            contentPhotosContainer.removeChild(contentPhotosContainer.firstChild);
        }
    }
})(document);


