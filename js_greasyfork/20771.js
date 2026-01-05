// ==UserScript==
// @name        Stig's Art Grabr
// @namespace   dk.rockland.userscript.misc.artgrab
// @description Grabbing big high resolution album cover-art from various sites
// @version     2025.04.17.0
// @author      Stig Nygaard, https://www.rockland.dk
// @homepageURL https://www.rockland.dk/userscript/misc/artgrab/
// @supportURL  https://www.rockland.dk/userscript/misc/artgrab/
// @match       *://*.allmusic.com/*
// @match       *://*.bandcamp.com/*
// @match       *://*.music.apple.com/*
// @match       *://*.itunes.apple.com/*
// @match       *://*.musicdiner.com/*
// @match       *://*.fnd.io/*
// @match       *://labs.stephenou.com/itunes/*
// @match       *://*.last.fm/*
// @match       *://*.lastfm.de/*
// @match       *://*.lastfm.es/*
// @match       *://*.lastfm.fr/*
// @match       *://*.lastfm.it/*
// @match       *://*.lastfm.ja/*
// @match       *://*.lastfm.pl/*
// @match       *://*.lastfm.pt/*
// @match       *://*.lastfm.ru/*
// @match       *://*.lastfm.sv/*
// @match       *://*.lastfm.tr/*
// @match       *://*.lastfm.zh/*
// @match       *://*.musicbrainz.org/*
// @match       *://*.soundcloud.com/*
// @match       *://play.google.com/*
// @match       *://*.deezer.com/*
// @match       *://*.qobuz.com/*
// @match       *://*.trackitdown.net/*
// @match       *://*.45cat.com/*
// @match       *://*.amazon.com/*
// @match       *://*.amazon.co.uk/*
// @match       *://*.amazon.ca/*
// @match       *://*.amazon.co.jp/*
// @match       *://*.amazon.com.au/*
// @match       *://*.amazon.com.br/*
// @match       *://*.amazon.com.mx/*
// @match       *://*.amazon.com.sa/*
// @match       *://*.amazon.cn/*
// @match       *://*.amazon.de/*
// @match       *://*.amazon.es/*
// @match       *://*.amazon.fr/*
// @match       *://*.amazon.in/*
// @match       *://*.amazon.it/*
// @match       *://*.amazon.nl/*
// @match       *://*.amazon.pk/*
// @match       *://*.cdbaby.com/*
// @match       *://*.jamendo.com/*
// @match       *://*.magnatune.com/*
// @match       *://open.spotify.com/*
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
// @require     https://greasyfork.org/scripts/34527/code/GMCommonAPI.js?version=237846
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20771/Stig%27s%20Art%20Grabr.user.js
// @updateURL https://update.greasyfork.org/scripts/20771/Stig%27s%20Art%20Grabr.meta.js
// ==/UserScript==


/*
 *      Stig's Art Grabr is an userscript and/or bookmarklet for grabbing big high resolution
 *      album cover-art from various sites.
 *
 *      https://greasyfork.org/scripts/20771-stig-s-art-grabr
 *      https://github.com/StigNygaard/Stigs_Art_Grabr
 *
 *      Partly based on tips at http://wiki.musicbrainz.org/User:Nikki/CAA and on itunes tip
 *      from MusicBrainz/GitHub/GreasyFork user jesus2099 who has made a lot of userscripts
 *      (especially for MusicBrainz users): https://greasyfork.org/users/2206-jesus2099
 *
 *      To run this script as a bookmarklet (running latest GreasyFork hosted version), use:
 *      javascript:(function(){document.body.appendChild(document.createElement("script")).src="https://greasyfork.org/scripts/20771/code/StigsArtGrabr.js?t="+Date.now();}())
 *
 *      NOTICE: On Apple Music (iTunes), with most browsers Stig's Art Grabr will only work when
 *      used as a userscript, and NOT when used as a bookmarklet (CSP restriction).
 */

// CHANGELOG - The most important updates/versions:
let changelog = [
    {version: '2025.04.17.0', description: 'Bigger artwork sizes from open.spotify.com. Thanks kopytko95.'},
    {version: '2024.01.07.0', description: 'Fix for yesterdays updated apple music support - now handling more original image formats.'},
    {version: '2024.01.06.0', description: 'Should get the actual original upload now on Apple Music/iTunes? Thanks for the help and insisting at https://github.com/StigNygaard/Stigs_Art_Grabr/issues/9 ;-)'},
    {version: '2021.05.09.0', description: 'Generally substitute found ".webp" files with similar named ".jpg" files (assumed available as "fallback"). This currently affects and works for Apple Music/iTunes and Last.FM.'},
    {version: '2021.01.29.0', description: 'Support for the new native menus (GM.registerMenuCommand) in Greasemonkey 4.11.'},
    {version: '2020.12.28.0', description: 'Yet another iTunes/Apple Music fix. Musicbrainz changelog appended to pages fix.'},
    {version: '2020.07.02.0', description: 'Another iTunes/Apple Music fix.'},
    {version: '2020.05.30.1', description: 'Adding partial support for open.spotify.com. On album-pages (might not work on all playlists) it can typically replace 232X232 or 464x464 with 640x640pixels cover art. Thanks to kopytko95 for tip making this possible.'},
    {version: '2020.04.25.0', description: 'iTunes / Apple Music fix for updated site.'},
    {version: '2019.11.03.0', description: 'Last.FM fix. Mouseover should work again now.'},
    {version: '2019.10.26.0', description: 'Last.FM partial fix. Now again able to find fullsize images. But mouseover with dimensions might not show and sometimes image is "protected" behind a layer.'},
    {version: '2018.02.10.0', description: 'Adding support for Deezer, Qobuz and Trackitdown (All tested on public pages only). Big thanks to Anton Fedorov for tips making this possible.'},
    {version: '2016.06.20.0', description: '1st official release version.'}
];

function runGrabr() {
    let DEBUG = false;
    let log = function(s) {
        if (DEBUG && window.console) {
            window.console.log(s);
        }
    };
    // [ page pattern, search for img patterns, replace this, with this ]
    let a = [[/45cat\./, /-s\.jpg/i, /-s\.jpg/gi, ".jpg"],
        [/45cat\./, /-s\.png/i, /-s\.png/gi, ".png"],
        [/allmusic\./, /\/JPG_\d{3}\//i, /\/JPG_\d{3}\//gi, "/JPG_1080/"],
        [/amazon\./, /\._[A-Z]{2}\d{3}_[\w_,-]*\.jpg/i, /\._[A-Z]{2}\d{3}_[\w_,-]*\.jpg/gi, ".jpg"],
        [/amazon\./, /\._[A-Z]{2}\d{3}_[\w_,-]*\.png/i, /\._[A-Z]{2}\d{3}_[\w_,-]*\.png/gi, ".png"],
        [/bandcamp\./, /_\d{1,2}\.jpg/i, /_\d{1,2}\.jpg/gi, "_0.jpg"],
        [/bandcamp\./, /_\d{1,2}\.png/i, /_\d{1,2}\.png/gi, "_0.png"],
        [/cdbaby\./, /cdbaby\.name\/.*_small\.[jpgn]{3}/i, /_small\./gi, "."],
        [/cdbaby\./, /cdbaby\.name\/.*\.jpg/i, /\.jpg/gi, "_large.jpg"],
        [/cdbaby\./, /cdbaby\.name\/.*\.png/i, /\.png/gi, "_large.png"],
        [/deezer\./, /images\/\w{5,9}\/.*\.[jpng]{3}/i, /\/\d{2,3}x\d{2,3}-0{6}-\d{1,2}-0-0\.[jpng]{3}/gi, "/1400x1400-000000-0-0-0.png"],
        [/fnd\.io/, /\/\d{2,}x\d{2,}bb/i, /\/\d{2,}x\d{2,}bb/gi, "/999999x999999bb-100"],
        [/(music|itunes)\.apple\./, /^https:\/\/[a-z0-9/.-]+\/image\/thumb\/[a-z0-9/.-]+\.(jpg|jpeg|webp|png|avif|jxl|heif|heic)\/[a-z0-9-]+\.[jpegwbavifxl]{3,4}$/i, /^https:\/\/[a-z0-9/.-]+\/image\/thumb\/([a-z0-9/.-]+\.[jpgwebnavifxlhc]{3,4})\/[a-z0-9-]+\.[jpegwbavifxl]{3,4}$/gi, "https://a1.mzstatic.com/us/r1000/0/$1"],  // fix 2024
        [/jamendo\./, /1\.\d00\.jpg/i, /1\.\d00\.jpg/gi, "1.0.jpg"],
        [/jamendo\./, /1\.\d00\.png/i, /1\.\d00\.png/gi, "1.0.png"],
        [/labs\.stephenou\.com/, /\/\d{2,3}x\d{2,3}bb/i, /\/\d{2,3}x\d{2,3}bb/gi, "/999999x999999bb-100"],
        [/last(fm)?\.[a-z]{2,3}/, /\.net\/i\/u\/[a-zA-Z]*\d{2,}\w*\//i, /\.net\/i\/u\/[a-z]*\d{2,}\w*\//gi, ".net/i/u/"], // fix 2019-10-26
        [/magnatune\./, /cover_\d{2,3}\./i, /cover_\d{2,3}\./gi, "cover."],
        [/musicbrainz\.org/, /_thumb\d{3}\./i, /_thumb\d{3}\./gi, "."],
        [/musicbrainz\.org/, /-\d{3}\.jpg/i, /-\d{3}\.jpg/gi, ".jpg"],
        [/musicbrainz\.org/, /-\d{3}\.png/i, /-\d{3}\.png/gi, ".png"],
        [/musicdiner\./, /\/\d{2,3}x\d{2,3}bb/i, /\/\d{2,3}x\d{2,3}bb/gi, "/999999x999999bb-100"],
        [/play\.google\.com/, /googleusercontent\.com.*\=w\d{3}/i, /\=w\d{3}$/gi, "=w1200"],
        [/qobuz\.com/, /static\.qobuz\.com\/images\/covers\//i, /_\d{2,3}\.jpg/gi, "_max.jpg"],
        [/trackitdown\.net/, /\.cloudfront.net\/graphics\//i, /__\w+\.png/gi, "_original.jpg"],
        [/soundcloud\./, /t\d\d0x\d\d0\./i, /t\d\d0x\d\d0\./gi, "original."],
        [/open\.spotify\.com/, /i\.scdn\.co\/image\/ab67616d0000/i, /ab67616d00001e02/gi, "ab67616d000082c1"]];
    /* https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/ */
    let aEv = function(e,ev,f,c) {
        c = c || false;
        if (e.addEventListener) {
            e.addEventListener(ev, f, c);
        } else if (e.attachEvent) {
            e.attachEvent("on" + ev, f);
        } else {
            e["on" + ev] = f;
        }
    };
    let w = null, n = 0, m = 20, d = document, i = 0;

    // General preburner
    let pictures = document.querySelectorAll("picture");
    const PURL = /^[^\s,]+/im;
    pictures.forEach(
        function(picture, idx) {
            let img = picture.querySelector("img");
            let source = picture.querySelector("source");
            if (img) {
                // img.removeAttribute("loading");
                let currentSrc = img.currentSrc;
                if (source?.srcset) {
                    if (!currentSrc || currentSrc.endsWith("1x1.gif") || currentSrc.endsWith("MissingArtworkMusic.svg")) {
                        let url = source.srcset.match(PURL);
                        if (url) {
                            currentSrc = url[0];
                        }
                    }
                }
                picture.replaceWith(img);
                if (currentSrc && !(currentSrc.endsWith("1x1.gif") || currentSrc.endsWith("MissingArtworkMusic.svg"))) {
                    img.src = currentSrc;
                    img.removeAttribute("loading"); // I don't really understand, but removing loading-attribut at this point seems to work better than doing it earlier?
                }
            }
        }
    );

    // soundcloud pre-burner
    if (d.location.hostname.search(/soundcloud\./) > -1) {
        let spans = document.querySelectorAll("span[style*=background-image]");
        for (const span of spans) {
            if (span.style.backgroundImage) {
                let imgsrc = span.style.backgroundImage.match(/url[\(\"\u0027]+([^\"\u0027\)]*)[\)\"\u0027]+/)[1];
                if ((span.getElementsByTagName("img").length === 0) && (imgsrc.match(/t[\d]{3}x[\d]{3}\./) !== null)) {
                    span.innerHTML = "<img src=\u0027" + imgsrc + "\u0027 alt=\u0027\u0027 style=\u0027width:200px;height:200px;border:none\u0027 />";
                }
            }
        }
    }
    // itunes/apple music pre-burner
    if (d.location.hostname.search(/\.apple\./) > -1) {
        let overlays = document.querySelectorAll(".artwork-overlay, .lockup__controls, .lockup__contextual-menu-trigger");
        for (const overlay of overlays) {
            overlay.parentNode.removeChild(overlay);
        }
    }
    // deezer pre-burner
    if (d.location.hostname.search(/deezer\.com/) > -1) {
        let pics = document.querySelectorAll("figure.thumbnail>div.picture");
        for (const pic of pics) {
            pic.classList.remove('picture');
        }
    }
    // last.fm pre-burner
    if (d.location.hostname.search(/last(fm)?\.[a-z]{2,3}/) > -1) {
        let elms = document.querySelectorAll(('.album-overview-cover-art-actions'));
        for (const elm of elms) {
            elm.parentNode.removeChild(elm);
        }
        let imgs = document.querySelectorAll(('a.cover-art img, a.image-list-item img'));
        for (const img of imgs) {
            img.style.maxWidth = "370px";
            img.style.maxHeight = "370px";
            img.parentNode.parentNode.replaceChild(img, img.parentNode); // (newchild, oldchild)
        }
    }

    log('Activated while on ' + d.location.hostname);
    o:
        for (const patterns of a) {
            if (d.location.hostname.search(patterns[0]) > -1) {
                log('Running on ' + d.location.hostname);
                w = patterns;
                let l = d.getElementsByTagName("img");
                if (l) {
                    log('Found ' + l.length + ' image tags');
                    for (const e of l) {
                        // log(' - ' + e.currentSrc + ' . Includes ' + w[1] + '?: ' + ((e.currentSrc).search(w[1]) > -1) );
                        if ((e.currentSrc).search(w[1]) > -1) {
                            e.style.border = "1px #FB0 solid";
                            if (e.naturalWidth) {
                                // e.title = "just testing"; // adding dimemsions later on onload image?
                                // e.parentNode.title = "just testing parent"; // adding dimemsions later on onload image?
                                e.onmouseover = function () { // onmouseover via w3 metode. Eller på niveauet over og tage dimension på første img child???
                                    this.setAttribute("title", String(this.naturalWidth) + "x" + this.naturalHeight);
                                    this.setAttribute("data-title", String(this.naturalWidth) + "x" + this.naturalHeight);
                                    this.setAttribute("data-tooltip", String(this.naturalWidth) + "x" + this.naturalHeight);
                                };
                            }
                            aEv(e, "load", function () {
                                if (this.style) {
                                    this.style.borderColor = "#F00";
                                    if (this.naturalWidth && this.naturalWidth > 999) {
                                        this.style.borderWidth = "2px";
                                    }
                                }
                                // Sæt titles HER istedet !!!
                                // this.title = "Done loading: " + String(this.naturalWidth) + "x" + this.naturalHeight;
                                // this.parentNode.title = "Done loading: " + String(this.naturalWidth) + "x" + this.naturalHeight;
                            });
                            aEv(e, "click", function () {
                                if (this.currentSrc) {
                                    window.location = this.currentSrc;
                                }
                            });
                            // Lets take the chance and do a general substitution of .webp for .jpg on all sites supported!
                            e.src = e.currentSrc.replace(w[2], w[3]).replace(/\.webp$/i, ".jpg");
                            if (e.srcset) {
                                e.removeAttribute('srcset')
                            }
                            n++;
                            if (n === m) {
                                if (confirm(String(n) + " images requested. Continue?")) {
                                    m = m + 20;
                                } else {
                                    break o;
                                }
                            }
                        }
                    }
                }
            }
        }
    if (w === null) {
        log('No page pattern hits found...');
    }
    return void(0);
}

function createRichElement(tagName, attributes, ...content) {
    let element = document.createElement(tagName);
    if (attributes) {
        for (const [attr, value] of Object.entries(attributes)) {
            element.setAttribute(attr, value);
        }
    }
    if (content?.length) {
        element.append(...content);
    }
    return element;
}

function showGrabrLog() {
    document.getElementById('grabrlog').style.display = 'block';
}

if (typeof GM_info === 'object' || (typeof GM === 'object' && typeof GM.info === 'object')) {
    // Running as a userscript - setting up menu items...
    if (!document.getElementById('grabrlog')) {
        let gmwe = createRichElement("div", {id: "grabrlog"}, createRichElement("b", {}, "Stig's Art Grabr changelog"), document.createElement("ul"));
        gmwe.style.position = "fixed";
        gmwe.style.left = "0";
        gmwe.style.right = "0";
        gmwe.style.top = "10em";
        gmwe.style.zIndex = "3000009";
        gmwe.style.marginLeft = "auto";
        gmwe.style.marginRight = "auto";
        gmwe.style.minHeight = "8em";
        gmwe.style.width = "50%";
        gmwe.style.backgroundColor = "#eee";
        gmwe.style.color = "#111";
        gmwe.style.borderRadius = "5px";
        gmwe.style.display = "none";
        gmwe.style.padding = "1em";
        document.body.insertAdjacentElement("beforeend", gmwe);
        document.getElementById('grabrlog').addEventListener('click', function() {
            this.style.display = 'none';
            return false;
        }, false);
        let list = document.querySelector('div#grabrlog ul');
        let lcontent = '';
        for (let i = 0; i < Math.min(8, changelog.length); i++) {
            lcontent += '<li><i>' + changelog[i].version + '</i> - ' + changelog[i].description + '</li>';
        }
        list.insertAdjacentHTML('beforeend', lcontent);
    }
    GMC.registerMenuCommand("Search big size cover art", runGrabr, "a");
    GMC.registerMenuCommand("Changelog", showGrabrLog, "l");
} else {
    // Started from bookmarklet!
    runGrabr();
}
