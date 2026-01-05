// ==UserScript==
// @name Sbazar galerie inline toggle
// @description Udela na sbazaru galerku ala bazos - prepinani na hover nebo klik
// @author tkafka
// @version 0.0.2
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
// @downloadURL https://update.greasyfork.org/scripts/19805/Sbazar%20galerie%20inline%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/19805/Sbazar%20galerie%20inline%20toggle.meta.js
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

        var contentPhotosContainer = egg.querySelector('.fotky');
        if (!contentPhotosContainer) { console.log('No contentPhotosContainer'); return; }

        var contentPhotos = contentPhotosContainer.querySelectorAll('.fotka img');
        console.log('target/placeBox/contentPhotos:', target, placeBox, contentPhotos);
        if (contentPhotos.length === 0) { console.log('Zero content photos'); return; }

        var mainPhoto = target.querySelector('#mainPhoto img');
        
        var clear = placeBox.querySelector('.clear');

        var photoWrapper = document.createElement('div');
        photoWrapper.classList.add('photoWrapper');
        placeBox.insertBefore(photoWrapper, clear); // place before clear

        var thumbnails = document.createElement('div');
        thumbnails.classList.add('thumbnails');
        thumbnails.style.margin = '1em 0 0 0';
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

        var thumbnailData = [ mainPhoto.getAttribute('src') ];
        
        Array.prototype.forEach.call(contentPhotos, function(contentPhoto, i) {
            console.log('contentPhoto', contentPhoto);
            var photoUrl = contentPhoto.getAttribute('src');
            thumbnailData.push(photoUrl);
        });
        
        thumbnailData.forEach(function(photoUrl) {
            console.log(photoUrl);

            var thumbnail = document.createElement('a');
            thumbnail.setAttribute('href', photoUrl);
            thumbnail.classList.add('thumbnail');
            thumbnail.style.width='80px';
            thumbnail.style.height='80px';
            thumbnail.style.margin = '0 1em 1em 0';
            thumbnail.style.display = 'inline-block';
            thumbnail.style.background='url(\''+photoUrl+'\')';
            thumbnail.style.backgroundSize='cover';
            thumbnails.appendChild(thumbnail);

            thumbnail.addEventListener(
                'click', 
                function(event){ 
                    mainPhoto.setAttribute('src', photoUrl);
                    event.preventDefault();
                }, 
                false);

            /*
            var fotka = document.createElement('div');
            fotka.classList.add('fotka');
            photos.appendChild(fotka);

            var fotkaImg = document.createElement('img');
            fotkaImg.setAttribute('src', photoUrl);
            fotkaImg.style.width = '100%';
            fotkaImg.style.maxWidth = '';
            fotka.appendChild(fotkaImg);
            */
        });
        

        // remove big photos
        while (contentPhotosContainer.firstChild) {
            contentPhotosContainer.removeChild(contentPhotosContainer.firstChild);
        }
    }
})(document);
