// ==UserScript==
// @name Cpasbien filtre pour les recherches
// @namespace http://tampermonkey.net/
// @version 3.0
// @description Filtre les recherches en affichant uniquement les fims de qualité 1080p et 4k. Ajout de l'affiche du film et du lien de téléchargement directement sur la page de recherche.
// @author MaleZoR
// @license MaleZoR
// @match https://cpasbien2022.fr/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462880/Cpasbien%20filtre%20pour%20les%20recherches.user.js
// @updateURL https://update.greasyfork.org/scripts/462880/Cpasbien%20filtre%20pour%20les%20recherches.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divDroite = document.getElementById("droite");
    if(divDroite) {
        divDroite.style.display = "none";
    }
})();

var imgRequest = new Promise(function(resolve, reject) {
    var rows = document.getElementsByTagName("tr");
    var imgUrls = [];
    var torrentUrls = [];

    for (var i = 0; i < rows.length; i++) {
        var url = rows[i].getElementsByTagName("a")[0].href;
        imgUrls.push(url);
    }

    for (var j = 0; j < rows.length; j++) {
        var torrent = rows[j].getElementsByTagName("a")[0].href;
        torrentUrls.push(torrent);
    }

    var promises = imgUrls.map(function(url) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                    var imgUrl = null;
                    if (response.finalUrl.endsWith(".jpg") || response.finalUrl.endsWith(".png")) {
                        imgUrl = response.finalUrl;
                    } else {
                        var imgEl = htmlDoc.querySelector("#bigcover img");
                        if (imgEl) {
                            imgUrl = imgEl.src;
                        }
                    }
                   // console.log(imgUrl);
                    resolve(imgUrl);
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    });

Promise.all(promises).then(function(urls) {
    for (var i = 0; i < rows.length; i++) {
        if (((rows[i].innerHTML.indexOf("1080p") !== -1 || rows[i].innerHTML.indexOf("4K") !== -1) && rows[i].innerHTML.indexOf("HDCAM") === -1 && rows[i].innerHTML.indexOf("LD") === -1 && rows[i].innerHTML.indexOf("VOSTFR") === -1 && rows[i].innerHTML.indexOf("MD") === -1)) {
            rows[i].style.display = "";
            rows[i].innerHTML = rows[i].innerHTML.replace(/(WEBRIP|HDLight|BluRay|4KLight ULTRA HD|HDTV|4K ULTRA HD)/g, "<span style='color:blue;'>$1</span>");
            rows[i].innerHTML = rows[i].innerHTML.replace(/(1080p|4K|4KLight)/g, "<span style='color:red;'>$1</span>");
            rows[i].innerHTML = rows[i].innerHTML.replace(/(FRENCH|TRUE)/g, "<span style='display:none;'>$1</span>");

            (function(i) {
                var title = rows[i].getElementsByTagName("a")[0].innerHTML;
                var BIGTitle = title.match(/^(.*?)\s*<span/)[1].trim();

                GM_xmlhttpRequest({
                    method: "GET",
                    url: rows[i].getElementsByTagName("a")[0].href,
                    onload: function(response) {
                        var parser = new DOMParser();
                        var htmlDoc = parser.parseFromString(response.responseText, "text/html");
                        var imgUrl = null;
                        if (response.finalUrl.endsWith(".jpg") || response.finalUrl.endsWith(".png")) {
                            imgUrl = response.finalUrl;
                        } else {
                            var imgEl = htmlDoc.querySelector("#bigcover img");
                            if (imgEl) {
                                imgUrl = imgEl.src;
                            }
                        }
                        resolve(imgUrl);
                        var img = new Image();
                        img.src = imgUrl;
                       // img.style.display = "flex";
                        img.style.width = "100%";

                        var bigTitleEl = document.createElement("div"); // Add a new element
                        bigTitleEl.style.width = "100%";
                        bigTitleEl.style.textAlign = "center";
                        bigTitleEl.style.marginTop = "20px";
                        bigTitleEl.innerHTML = "<h3>" + BIGTitle + "</h3>"; // Set the innerHTML to BIGTitle
                        rows[i].appendChild(bigTitleEl); // Add the new element before the image

                        rows[i].appendChild(img);
                        var downloadLink = htmlDoc.querySelector("a[href^='magnet']");
                        var downloadUrl = downloadLink ? downloadLink.getAttribute("href") : null;
                        var downloadBtn = document.createElement("button");
                        downloadBtn.innerText = "Copier l'url du Torrent";
                        downloadBtn.style.width = "100%";
                        downloadBtn.style.margin = "0px";
                        downloadBtn.style.backgroundColor = "#d1181f";
                        downloadBtn.style.color = "#fff";
                        downloadBtn.style.borderRadius = "0px";
                        downloadBtn.style.fontSize = "1.1em";
                        downloadBtn.style.display = "flex";
                        downloadBtn.style.alignItems = "center";
                        downloadBtn.style.justifyContent = "center";
                        downloadBtn.style.outline = "none";
                        downloadBtn.onclick = function() {
                            navigator.clipboard.writeText(downloadUrl).then(function() {
                                console.log("Download URL copied to clipboard!");
                            }, function(err) {
                                console.error("Failed to copy download URL: ", err);
                            });
                        };
                        rows[i].appendChild(downloadBtn); // Ajouter le bouton en dessous de l'image
                        resolve();
                    },
                    onerror: function(err) {
                        reject(err);
                    }
                });
            })(i);
        } else {
            rows[i].style.display = "none";
        }
    }
    resolve();
}).catch(function(err) {
    console.error("Error fetching image:", err);
    reject(err);
});
});