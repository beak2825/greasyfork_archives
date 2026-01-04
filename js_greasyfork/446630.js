// ==UserScript==
// @name         MAL Shared Anime Graph
// @namespace    https://greasyfork.org/en/users/926650-squashbucklr
// @version      1.5
// @description  Adds a canvas graph to shared anime pages on MyAnimeList
// @author       Squashbucklr
// @license      GNU GPLv3
// @match        https://myanimelist.net/shared.php*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446630/MAL%20Shared%20Anime%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/446630/MAL%20Shared%20Anime%20Graph.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlParams = new URLSearchParams(window.location.search);
    let u1 = urlParams.get('u1');
    let u2 = urlParams.get('u2');

    let xscores = [];
    let yscores = [];

    let rows = Array.from(document.getElementById('content').children[2].children[0].children);
    let orientation = rows[0].children[1].children[0].textContent == u1 + '\'s Score';
    console.log(orientation);
    let getx = orientation ? 1 : 2;
    let gety = orientation ? 2 : 1;
    for (let i = 1; i < rows.length - 2; i++) {
        let row = rows[i];
        let xscore = row.children[getx].children[0].textContent;
        let yscore = row.children[gety].children[0].textContent;

        if (xscore == '-' || yscore == '-') continue;
        xscores.push(parseInt(xscore));
        yscores.push(parseInt(yscore));
    }

    // calculate affinity
    // from https://github.com/purplepinapples/mal-affinity/

    // console.log(xscores, yscores);

    let xmean = xscores.reduce((a, b) => a + b, 0) / xscores.length;
    let ymean = yscores.reduce((a, b) => a + b, 0) / yscores.length;

    // console.log(xmean, ymean);

    let xmdiffs = [];
    let ymdiffs = [];

    xscores.forEach(xscore => {
        xmdiffs.push(xscore - xmean);
    });
    yscores.forEach(yscore => {
        ymdiffs.push(yscore - ymean);
    });

    // console.log(xmdiffs, ymdiffs);

    let xmdsquares = [];
    let ymdsquares = [];

    xmdiffs.forEach(xmdiff => {
        xmdsquares.push(xmdiff * xmdiff);
    });
    ymdiffs.forEach(ymdiff => {
        ymdsquares.push(ymdiff * ymdiff);
    });

    // console.log(xmdsquares, ymdsquares);

    let numerator = 0;
    for (let i = 0; i < xmdiffs.length; i++) {
        numerator += xmdiffs[i] * ymdiffs[i];
    }

    // console.log(numerator);

    let denominator = Math.sqrt(xmdsquares.reduce((a, b) => a + b, 0) * ymdsquares.reduce((a, b) => a + b, 0));

    // console.log(denominator);

    let affinityValue = numerator / denominator;
    let affinity = denominator == 0 ? 'unknown' : (affinityValue >= 0 ? '+' : '') + ((100 * affinityValue).toFixed(1) + '%');

    console.log('Affinity:', affinity);

    let points = new Array(10).fill(0).map(x => new Array(10).fill(0));
    let maxpoint = 0;

    for (let i = 0; i < xscores.length; i++) {
        maxpoint = Math.max(maxpoint, ++points[xscores[i] - 1][yscores[i] - 1]);
    }

    // console.log(maxpoint, points);

    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '375px');
    canvas.setAttribute('height', '400px');
    let ctx = canvas.getContext('2d');

    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // draw grid

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FEFEFE'
    ctx.moveTo(40.5, 360.5);
    ctx.lineTo(360.5, 40.5);
    ctx.stroke();

    for (let i = -1; i < 10; i++) {
        let x = 50.5 + ((1 + i) * 30);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#E5E5E5'
        ctx.moveTo(x, 40.5);
        ctx.lineTo(x, 360.5);
        ctx.stroke();

        if (i >= 0) {
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(i + 1, x, 372);
        }
    }
    for (let i = -1; i < 10; i++) {
        let y = 350.5 - ((1 + i) * 30);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#E5E5E5'
        ctx.moveTo(40.5, y);
        ctx.lineTo(360.5, y);
        ctx.stroke();

        if (i >= 0) {
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(i + 1, 30, y + 3);
        }
    }

    // draw names
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(u1, 200, 390);
    ctx.save();
    ctx.translate(15, 200);
    ctx.rotate(-Math.PI/2);
    ctx.textAlign = "center";
    ctx.fillText(u2, 0, 0);
    ctx.restore();
    ctx.fillText('Affinity: ' + affinity, 200, 30);

    // draw dots
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points[0].length; j++) {
            if (points[i][j] == 0) continue;
            let amount = points[i][j] / maxpoint;
            // let colornum = 255 - Math.floor(255 * (amount));

            // MAL Blue: 2e51a2
            let r = parseInt("23", 16);
            let g = parseInt("51", 16);
            let b = parseInt("a2", 16);

            let rscale = 255 - Math.floor((255 - r) * amount);
            let gscale = 255 - Math.floor((255 - g) * amount);
            let bscale = 255 - Math.floor((255 - b) * amount);

            let size = 8 * amount + 2;
            let x = 50.5 + ((1 + i) * 30);
            let y = 350.5 - ((1 + j) * 30);

            let rhex = rscale.toString(16);
            if (rhex.length == 1) rhex = '0' + rhex;
            let ghex = gscale.toString(16);
            if (ghex.length == 1) ghex = '0' + ghex;
            let bhex = bscale.toString(16);
            if (bhex.length == 1) bhex = '0' + bhex;

            // console.log(hex);

            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI, true);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000000'
            ctx.stroke();
            ctx.fillStyle = '#' + rhex + ghex + bhex;
            ctx.fill();
        }
    }

    document.getElementById('content').insertBefore(canvas, document.getElementById('content').children[2])
})();