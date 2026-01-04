// ==UserScript==
// @name         sable d'israel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sable
// @author       You
// @match        https://onche.org/forum/1/blabla-general
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onche.org
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477211/sable%20d%27israel.user.js
// @updateURL https://update.greasyfork.org/scripts/477211/sable%20d%27israel.meta.js
// ==/UserScript==

// Fonction pour extraire l'ID de la vidéo YouTube à partir de l'URL
function extractVideoId(url) {
    var videoId = 'JKAlhsZTtzM';
    var regex = /[?&]v=([^&]+)/;
    var match = url.match(regex);
    if (match) {
        videoId = match[1];
    } else {
        // Gestion d'un lien youtu.be
        var shortLinkRegex = /youtu\.be\/([^?]+)/;
        var shortLinkMatch = url.match(shortLinkRegex);
        if (shortLinkMatch) {
            videoId = shortLinkMatch[1];
        }
    }
    return videoId;
}

// Fonction pour ajouter la miniature d'une vidéo YouTube aux liens
function addYouTubeThumbnailsToLinks() {
    var allLinks = document.getElementsByTagName('a');

    for (var i = 0; i < allLinks.length; i++) {
        var link = allLinks[i];
        var href = link.href;
        var videoId = extractVideoId(href);

        if (videoId !== '') {
            var thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/0.jpg';
            var thumbnailImage = document.createElement('img');
            thumbnailImage.src = thumbnailUrl;
            thumbnailImage.alt = 'Miniature de la vidéo';

            // Créer un lien pour ouvrir la vidéo YouTube
            var videoLink = document.createElement('a');
            videoLink.href = 'https://youtu.be/' + videoId;
            videoLink.target = '_blank'; // Ouvrir dans un nouvel onglet

            // Ajouter la miniature à ce lien
            videoLink.appendChild(thumbnailImage);

            // Remplacer le lien initial par le lien avec la miniature
            link.parentNode.replaceChild(videoLink, link);
        }
    }
}

// Appeler la fonction pour ajouter les miniatures aux liens
addYouTubeThumbnailsToLinks();
