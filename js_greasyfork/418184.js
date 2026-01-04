// ==UserScript==
// @name         PornAide Rebuild
// @namespace    spacename
// @version      1.00
// @description  Rakentaa koko PornAiden uusiksi ysärilookkiin. Muutetaan ulkoiset linkit google-hakulinkeiksi.
// @author       Me
// @match        https://pornaide.com/*
// @match        https://*.pornaide.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418184/PornAide%20Rebuild.user.js
// @updateURL https://update.greasyfork.org/scripts/418184/PornAide%20Rebuild.meta.js
// ==/UserScript==

(function () {

    'use strict';

    //
    // Skriptin asetukset
    //
    let mySettings = {

        // Sallitaanko alkuperäiset linkit vai siivotaanko niitä? true tai false
        allowOriginalLinks: true

    };
    //
    // Ei muita asetuksia toistaiseksi
    //


    // Poistetaan mahdollisesti linkkejä sotkevat inline-elementit
    let randomPoops = document.querySelectorAll('img, i, span');
    if (randomPoops) {
        randomPoops.forEach(function (randomPoop) {
            randomPoop.remove();
        });
    }

    // Nämä linkit oletetaan navigointilinkeiksi
    let internalHref = ['pornaide.com', 'www.pornaide.com'];

    // Nämä linkit poistetaan, ysärillä ei ollut twitteriä
    let blockedHref = ['twitter.com', 'www.twitter.com'];

    let externalLinks = [];
    let internalLinks = [];

    // Haetaan sivuston linkit.
    let pageLinks = document.querySelectorAll('a');
    if (pageLinks) {

        pageLinks.forEach(function (pageLink) {

            // Linkin teksti talteen
            let linkText = pageLink.text.trim();
            if (linkText === '') {
                return;
            }

            try {

                // Yritetään tehdä URL-objekti.
                let urlObject = new URL(pageLink.href);

                // Objekti onnistui, katsotaan, onko linkin domain sisäinen tai blokattu

                if (blockedHref.includes(urlObject.hostname)) {
                    // Blokattu domain, ei kerätä talteen, jatketaan looppia
                    return;
                }

                if (internalHref.includes(urlObject.hostname)) {

                    if (mySettings.allowOriginalLinks === true) {
                        // Sisäinen linkki, kerätään talteen
                        internalLinks.push(`<a rel="noreferrer" href="${pageLink.href}">${linkText}</a>`);
                        return;
                    }

                    // Sisäinen linkki, kerätään talteen, poistetaan mahdolliset parametrit urlista.
                    internalLinks.push(`<a rel="noreferrer" href="${urlObject.protocol}//${urlObject.hostname}${urlObject.pathname}">${linkText}</a>`);
                    return;

                }

                if (mySettings.allowOriginalLinks === true) {
                    // Ulkoinen linkki, kerätään talteen
                    externalLinks.push(`<a rel="noreferrer" href="${pageLink.href}">${linkText}</a>`);
                    return;
                }

                // Ulkoinen linkki, kerätään talteen, mutta muutetaan google-hauksi
                externalLinks.push(`<a rel="noreferrer" href="https://www.google.com/search?q=${encodeURIComponent(linkText)}">Haku Googlesta &raquo; ${linkText}</a>`);

            } catch (error) {

                // URL-objektin muodostaminen epäonnistui. Ulistaan logiin ja kerätään talteen ulkoisena linkkinä
                console.log(`Epäkelpo URL sivulla, korvataan google-linkillä: ${linkText}`);
                externalLinks.push(`<a rel="noreferrer" href="https://www.google.com/search?q=${encodeURIComponent(linkText)}">Haku Googlesta &raquo; ${linkText}</a>`);

            }
        });
    }

    // Korvataan koko body-tagin (sivun) sisältö
    document.body.innerHTML = '<h1>Pr0nAide ysärilook</h1>';

    // Jätetään vanhat tyylitiedostot huvikseen paikalle. Ne antaa vain vähän linkeille ja fonteille tyyliä
    // Kommentoi alla oleva koodi toimintaan, jos haluat ne pois ja vielä ysärimmäksi.

    // let styleSheets = document.querySelectorAll('link[rel=stylesheet]');
    // if (styleSheets) {
    //     styleSheets.forEach(function (styleSheet) {
    //         styleSheet.remove();
    //     });
    // }

    // Poistetaan kuitenkin nykyiset taustakuvat ja korvataan upealla harmaalla.
    document.body.removeAttribute('style');
    document.body.style.cssText = 'padding: 1em; background: #ccc; font-family: sans-serif';

    // Rakennellaan uusi sivu.
    let newHTMLContent = '';

    if (internalLinks.length > 0) {
        newHTMLContent += `<nav>${internalLinks.join(' - ')}</nav><hr>`;
    }

    if (externalLinks.length > 0) {
        newHTMLContent += `<ol><li>${externalLinks.join('</li><li>')}</li></ol>`;
    } else {
        newHTMLContent += '<p>Tällä sivulla ei oo pornosivustojen hakulinkkejä. Turha sivu.</p>';
    }

    let iranianCounter = new Intl.NumberFormat('fi-FI').format(Math.floor(Math.random() * (2125827 - 1184) + 1184));

    newHTMLContent += `<hr><footer><strong>KÄVIJÄLASKURI: ${iranianCounter} iranilaista kävijää!</strong><br>Netscape paras! IE huonoin!</footer>`;

    document.querySelector('h1').insertAdjacentHTML('afterend', newHTMLContent);

})();
