// ==UserScript==
// @name         YouTube Video Downloader 0.1
// @namespace    http://www.youtube.com/
// @version      1.1
// @description  Descarga videos de YouTube en la mejor calidad disponible
// @match        *://www.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527974/YouTube%20Video%20Downloader%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/527974/YouTube%20Video%20Downloader%2001.meta.js
// ==/UserScript==

const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Ingrese la URL del video de YouTube: ", function(url) {
    rl.question("Ingrese la ruta de salida (presione Enter para usar la carpeta actual): ", function(rutaSalida) {
        rutaSalida = rutaSalida || ".";
        const video = ytdl(url, { quality: 'highestvideo' });
        const salida = `${rutaSalida}/video.mp4`;

        console.log(`Descargando: ${url} ...`);
        video.pipe(fs.createWriteStream(salida));

        video.on('end', () => {
            console.log("Descarga completada!");
            rl.close();
        });

        video.on('error', (err) => {
            console.error(`Error: ${err.message}`);
            rl.close();
        });
    });
});
