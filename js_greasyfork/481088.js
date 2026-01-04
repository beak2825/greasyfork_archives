// ==UserScript==
// @name         Everynoise Enhancement Script
// @namespace    http://tampermonkey.net/
// @version      0.4.9
// @description  A script to slightly enhance everynoise's user experience
// @author       NeroYuki
// @match        https://everynoise.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://everynoise.com/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481088/Everynoise%20Enhancement%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/481088/Everynoise%20Enhancement%20Script.meta.js
// ==/UserScript==

/**
function highlight(which) {
    if (gdivs.length == 0) {
        gdivs = document.getElementsByClassName('genre');
    }
    for (i=0; i<gdivs.length; i++) {
        thisdiv = gdivs[i];
        thistext = thisdiv.firstChild.textContent;
        if (thisdiv.className.indexOf('scanme') > -1) {
            basename = 'genre scanme';
        } else {
            basename = 'genre';
        }
        if (which.length > 0 && which.trim() == thistext.trim().replace('"', '')) {
            thisdiv.className = basename + ' current';
            if(typeof thisdiv.scrollIntoViewIfNeeded == 'function') {
                thisdiv.scrollIntoViewIfNeeded();
            } else {
                thisdiv.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            }
        } else {
            thisdiv.className = basename;
        }
    }
}
**/

(function() {
    'use strict';

    // Your code here...
    var head = document.getElementsByTagName('head')[0];
    var thisScript = document.scripts[0]
    var cloneScript= document.createElement('script');
    if (thisScript) {
        // remove var scandur = 6000
        cloneScript.textContent = thisScript.textContent.replace('var scandur = 6000;', '');
        cloneScript.textContent = cloneScript.textContent.replace('function playx(key, genre, me) {', 'async function playx(key, genre, me) {');
        cloneScript.textContent = cloneScript.textContent.replace('highlight(genre);', 'highlight(genre, sample_title);');
        cloneScript.textContent = cloneScript.textContent.replace('function highlight(which)', 'function highlight(which, sample_title = "")');
        cloneScript.textContent = cloneScript.textContent.replace('me.setAttribute(\'played\', clicknumber++);', '');
        cloneScript.textContent = cloneScript.textContent.replace('async function playx(key, genre, me) {', 'async function playx(key, genre, me, loop = false) {');
        cloneScript.textContent = cloneScript.textContent.replace('function scan(e, state) {' , 'function scan(e, state, scan_duration = 29000) { if (!scan_duration || scan_duration < 0) {scan_duration = 29000}');
        cloneScript.textContent = cloneScript.textContent.replace('scan("continue")', 'scan("continue", document.getElementById("scan_length").value * 1000)');
        cloneScript.textContent = cloneScript.textContent.replace('scan("stop")', 'scan("stop", document.getElementById("scan_length").value * 1000)');
        cloneScript.textContent = cloneScript.textContent.replace('scandur = 6000', 'scandur = scan_duration');
        cloneScript.textContent = cloneScript.textContent.replace('if (nowplaying == genre) {', 'if (nowplaying == genre && !loop) {');
        cloneScript.textContent = cloneScript.textContent.replace('window.clearTimeout(nowpending);', 'if (!loop) { window.clearTimeout(nowpending); }');
        cloneScript.textContent = cloneScript.textContent.replace('picked.onclick();', 'if (!isLooping) { window.clearTimeout(nowpending); picked.onclick(); } else { window.clearTimeout(nowpending); }');
        cloneScript.textContent = cloneScript.textContent.replace('thisdiv.scrollIntoViewIfNeeded(false);', 'thisdiv.scrollIntoViewIfNeeded(true);');
        var cloneScriptLines = cloneScript.textContent.split('\n');
        var dataInsertLine = 0
        cloneScriptLines.splice(dataInsertLine, 0, `
var genreData = [];
fetch('https://raw.githubusercontent.com/NeroYuki/everynoise_enhancement_script/master/spotify_genres.json')
    .then(async (response) => {
        genreData = await response.json();
        
        // if current path starts with engenremap, dont append genres
        if (window.location.pathname.startsWith('/engenremap')) {
            return;
        }
        // iterate genreData, if item have is_append, attempt to add it to html 
        const appendGenres = genreData.filter(val => val.is_append).sort((a, b) => b.organic_index - a.organic_index);
        let id = 20000;

        // get the position of all genre divs 
        const elements = document.getElementsByClassName('genre');

        const positions = [];

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const rect = element.getBoundingClientRect();
            const position = {
                top: parseInt(element.style.top.replace('px', '')),
                left: parseInt(element.style.left.replace('px', '')),
                width: rect.width,
                height: rect.height,
                id: element.id
            };
            positions.push(position);
        }

        // sort the positions by top ascending
        positions.sort((a, b) => a.top - b.top);

        console.log(positions);

        for (const genre of appendGenres) {
            // select div class canvas and append the genre follow this template
            // <div id=item8 preview_url="https://p.scdn.co/mp3-preview/3c1278cf0eb6aba0f72552a3aa469dfed37d8e75" class="genre scanme" scan=true style="color: #c18f02; top: 3064px; left: 1170px; font-size: 130%" role=button tabindex=0 onKeyDown="kb(event);" onclick="playx(&quot;0AAl3LtvIhEilWXZmYHeh5&quot;, &quot;reggaeton&quot;, this);" title="e.g. Zion &quot;More&quot;">reggaeton<a class=navlink href="engenremap-reggaeton.html" role=button tabindex=0 onKeyDown="kb(event);" onclick="event.stopPropagation();" >&raquo;</a> </div>
            const canvas = document.querySelector('.canvas');
            const genreDiv = document.createElement('div');
            genreDiv.className = 'genre scanme';
            genreDiv.id = "item" + id++;
            genreDiv.setAttribute('scan', true);
            // color is array of hsv, use css hsl to set color
            genreDiv.style.color = \`hsl(\${genre.color[0]}, \${genre.color[1] * 100}%, \${genre.color[2] * 100}%)\`;
            // top should use the organic_index * canvas height, must not overlap with other elements
            const initialTop = genre.organic_index * canvas.clientHeight;
            genreDiv.style.top = \`\${genre.organic_index * canvas.clientHeight}px\`;
            // left should use the atmospheric_index * canvas width
            const initialLeft = genre.atmospheric_index * canvas.clientWidth;
            genreDiv.style.left = \`\${genre.atmospheric_index * canvas.clientWidth}px\`;
            // font-size should use popularity level
            genreDiv.style.fontSize = \`100%\`;
            genreDiv.setAttribute('role', 'button');
            genreDiv.setAttribute('tabindex', 0);
            genreDiv.setAttribute('onKeyDown', 'kb(event);');
            //let spotify_playlist_id = genre.spotify_playlist.replace('https://embed.spotify.com/?uri=spotify:playlist:', '');
            genreDiv.setAttribute('onclick', \`playx("\${genre.track_id}", "\${genre.genre}", this);\`);
            genreDiv.setAttribute('title', \`e.g. \${genre.sample_song}\`);
            genreDiv.textContent = genre.genre;
            canvas.appendChild(genreDiv);

            // iterate from the the element with the same top position and check if it overlaps
            const rect = genreDiv.getBoundingClientRect();
            let overlapCheckStartIndex = positions.findIndex(val => val.top + rect.height >= initialTop);
            // start checking from overlapCheckStartIndex, if any of it overlaps with the current element
            if (overlapCheckStartIndex !== -1) {
                let overlap = false;
                let adjustment_y = 0;
                for (let i = overlapCheckStartIndex; i < positions.length; i++) {
                    const position = positions[i];
                    if ((position.top + position.height >= initialTop && position.top <= initialTop + rect.height) && (position.left + position.width >= initialLeft && position.left <= initialLeft + rect.width)) {
                        overlap = true;
                        adjustment_y = Math.max(adjustment_y, rect.height - (position.top - initialTop));
                        //console.log('overlap found, adjustment:', adjustment_y);
                    }
                    if (overlap) {
                        // shift every element below the current element by the adjustment_y
                        position.top += adjustment_y;
                    }
                    // in case position.top > top + 20, it is guaranteed that the rest of the elements will not overlap, break the loop
                    else if (position.top > initialTop + rect.height) {
                        break;
                    }
                }
            }

            // add the new element itself to the positions array
            positions.push({
                top: initialTop,
                left: initialLeft,
                width: rect.width,
                height: rect.height,
                id: genreDiv.id
            });

            // sort the positions array again
            positions.sort((a, b) => a.top - b.top);
        }

        console.log(positions);

        // re-position the elements with the positions array
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            const element = document.getElementById(position.id);
            element.style.top = position.top + 'px';
        }

        // adjust canvas size to fit all elements
        const lastPosition = positions[positions.length - 1];
        const canvasDiv = document.querySelector('.canvas');

        canvasDiv.style.height = lastPosition.top + lastPosition.height + 'px';
    });

var isLooping = false;

const dbName = "everynoise_ext";
let db = null;

const request = indexedDB.open(dbName, 3);

request.onerror = (event) => {
    alert('error, please disable the userscript');
};

request.onsuccess = (event) => {
    db = event.target.result;

    db.transaction("genres")
        .objectStore("genres").get("pop").onsuccess = (event) => {
            const res = event.target.result
            if (!res) {
                console.log('adding data');
                fetch('https://raw.githubusercontent.com/NeroYuki/everynoise_enhancement_script/master/spotify_genres_artists_map.json')
                    .then(async (response) => {
                        console.log('fetched artists genre mapping');
                        genreArtist = await response.json();
                        for (const genre of genreArtist) {
                            db
                                .transaction("genres", "readwrite")
                                .objectStore("genres")
                                .add(genre);
                        }
                    });
            }
        }
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    // delete the existing object store
    if (db.objectStoreNames.contains("genres")) {
        db.deleteObjectStore("genres");
    }

    const objectStore = db.createObjectStore("genres", { keyPath: "genre" });

    // Use transaction oncomplete to make sure the objectStore creation is
    // finished before adding data into it.
    objectStore.transaction.oncomplete = (event) => {
        console.log('creation done')
    };
};

function getData(dataStore, key) {
    return new Promise((resolve, reject) => {
        const dataFetch = db.transaction(dataStore)
            .objectStore(dataStore).get(key);
        dataFetch.onsuccess = (event) => {
            const res = event.target.result
            resolve(res);
        }
        dataFetch.onerror = (event) => {
            reject(event);
        }

    })
}
        `);
        var insertLoopLine = cloneScriptLines.findIndex(val => val.includes('var spotifyplayer = document.getElementById(\'spotifyplayer\');')) + 1;
        cloneScriptLines.splice(insertLoopLine, 0, `
        console.log(genre, key);
        spotifyplayer.onended = () => {
            console.log('ended')
            playx(key, genre, me, true);
        };
        `);
        var insertSelectionLine = cloneScriptLines.findIndex(val => val.includes('previewurl = me.getAttribute(\'preview_url\')')) + 1;
        cloneScriptLines.splice(insertSelectionLine, 0, `
        let sample_title = me.getAttribute('title').replace('e.g. ', '');
        const res = await getData('genres', genre)
        var selectionIndex = res?.artists ? Math.floor(Math.random() * res.artists.length + 1) : 0;
        if (selectionIndex > 1) {
            previewurl = res.artists[selectionIndex - 1].preview_url;
            sample_title = res.artists[selectionIndex - 1].sample_song;
        }
        `);

        var insertStartResetStateLine = cloneScriptLines.findIndex(val => val.includes('if (state == \'stop\') {')) - 1;
        cloneScriptLines.splice(insertStartResetStateLine, 0, `
        if (state == 'start') {
            isLooping = false;
        }
        `);

        var insertLine = cloneScriptLines.findIndex(val => val.includes('thisdiv.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});')) + 2;
        cloneScriptLines.splice(insertLine, 0, `
            var label = document.getElementById('genre_label');
            if (!label) {
                label = document.createElement('div');
                document.body.appendChild(label);
            }
            var title_label = document.getElementById('title_label');
            if (!title_label) {
                title_label = document.createElement('div');
                document.body.appendChild(title_label);
            }
            var loop_label = document.getElementById('loop_label');
            if (!loop_label) {
                loop_label = document.createElement('div');
                document.body.appendChild(loop_label);
            }
            let genreInfo = genreData.find(val => val.genre === which.trim())
            label.id = 'genre_label';
            title_label.id = 'title_label';
            loop_label.id = 'loop_label';
            label.style.position = title_label.style.position = loop_label.style.position = 'absolute';
            label.style.color = title_label.style.color = loop_label.style.color = 'black';
            label.style.backgroundColor = title_label.style.backgroundColor = 'white';
            loop_label.style.backgroundColor = isLooping ? 'green' : 'white';
            label.style.padding = title_label.style.padding = loop_label.style.padding = '5px';
            label.style.display = title_label.style.display = loop_label.style.display = 'none';
            label.textContent = genreInfo ? genreInfo.desc : "No description";
            title_label.textContent = '▶  ' + (sample_title ? sample_title : "Unknown title");
            loop_label.textContent = '↻'
            // set the label position to be above the highlighted div
            var rect = thisdiv.getBoundingClientRect();

            label.style.left = Math.max(10, (parseInt(thisdiv.style.left) - 100)) + 'px';
            label.style.width = '300px'
            label.style.top = (parseInt(thisdiv.style.top) + 136) + 'px';
            label.style.border = 'solid 1px black';
            // show the label
            label.style.display = 'block';

            title_label.style.left = Math.max(10, (parseInt(thisdiv.style.left) - 100)) + 'px';
            title_label.style.top = (parseInt(thisdiv.style.top) + 76) + 'px';
            title_label.style.border = 'solid 1px black';
            // show the label
            title_label.style.display = sample_title ? 'block' : 'none';

            loop_label.style.left = Math.max(10, (parseInt(thisdiv.style.left) - 124)) + 'px';
            loop_label.style.top = (parseInt(thisdiv.style.top) + 76) + 'px';
            loop_label.style.border = 'solid 1px black';
            // show the label
            loop_label.style.display = 'block';

            loop_label.onclick = () => {
                isLooping = !isLooping;
                loop_label.style.backgroundColor = isLooping ? 'green' : 'white';
            }

            if(typeof label.scrollIntoViewIfNeeded == 'function') {
                label.scrollIntoViewIfNeeded();
            }
        `);
        cloneScript.textContent = cloneScriptLines.join('\n');
        head.appendChild(cloneScript);
        thisScript.remove();
    }

    // find element with id "scan" and append a text input next to it
    var scanElement = document.getElementById('scan');
    if (scanElement) {
        var inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.id = 'scan_length';
        inputElement.placeholder = 'scan length';
        inputElement.style.marginLeft = '10px';
        inputElement.style.width = '80px';
        scanElement.parentNode.insertBefore(inputElement, scanElement.nextSibling);
    }
    // change scan element's onclick property string to replace scan(event, 'start') and scan(event, 'stop') to scan(event, 'start', <scan_length>) and scan(event, 'stop', <scan_length>)
    if (scanElement) {
        scanElement.removeAttribute('onclick');

        // add event listener to scan element
        // if (this.innerText == 'scan') {scan(event, 'start');this.innerHTML = 'stop';} else {scan(event, 'stop');this.innerHTML = 'scan';}
        scanElement.addEventListener('click', function() {
            if (this.innerText == 'scan') {
                scan(event, 'start', document.getElementById('scan_length').value * 1000);
                this.innerHTML = 'stop';
            } else {
                scan(event, 'stop', document.getElementById('scan_length').value * 1000);
                this.innerHTML = 'scan';
            }
        });
    }
})();


