// ==UserScript==
// @name         SMLWiki - Expanded Episodes
// @namespace    https://greasyfork.org/en/users/1434767
// @version      2.0
// @description  Adds the rest of the SML Movies to /movie/. Also adds ykcul curdosy of smlwiki fan.
// @author       BoyOHBoy
// @match        https://smlwiki.com/movie/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526822/SMLWiki%20-%20Expanded%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/526822/SMLWiki%20-%20Expanded%20Episodes.meta.js
// ==/UserScript==

// Background and ykcul
(function() {
    'use strict';

    document.getElementById('frame').style.width="1104px";
    document.getElementById('wall').style.width="90%";

    document.querySelectorAll('img[src="01.webp"]').forEach(img => {
        const anchorElement = document.createElement('a');
        anchorElement.href = 'https://smlwiki.com/movie/';
        anchorElement.className = 'clickable';

        const imgElement = document.createElement('img');
        imgElement.src = 'https://files.boyohboy.xyz/episodes/01.jpeg';
        imgElement.style.rotate = '11deg';
        imgElement.style.right = '0px';

        anchorElement.appendChild(imgElement);

        const container = document.querySelector('#wall') || document.body;
        container.appendChild(anchorElement);

        img.style.display = 'none';
    });

})();

// Sandme Heffouy Felix Big Big Or Ale J!
(function() {
    'use strict';

    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://smlwiki.com/characters/shrek'; // Update the href to the full URL
    anchorElement.className = 'clickable';

    const imgElement = document.createElement('img');
    imgElement.src = 'https://files.boyohboy.xyz/episodes/t-sandme.jpeg';
    imgElement.style.rotate = '11deg';
    imgElement.style.left = '365px';
    imgElement.style.bottom = '30px';

    anchorElement.appendChild(imgElement);

    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);

})();

// The Collab!
(function() {
    'use strict';

    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://smlwiki.com/page/collab';
    anchorElement.className = 'clickable';

    const imgElement = document.createElement('img');
    imgElement.src = 'https://files.boyohboy.xyz/episodes/t-collab.jpg';
    imgElement.style.rotate = '10deg';
    imgElement.style.left = '250px';

    anchorElement.appendChild(imgElement);

    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);
})();

// Happyryleeman Aka Battle of The Ballad of Henry Guy
(function() {
    'use strict';

    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://youtu.be/ROnC0JFt1kU';
    anchorElement.className = 'clickable';

    const imgElement = document.createElement('img');
    imgElement.src = 'https://files.boyohboy.xyz/episodes/t-happy.jpeg';
    imgElement.style.rotate = '2deg';
    imgElement.style.left = '450px';

    anchorElement.appendChild(imgElement);

    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);

})();

// Mario Movies Meeted The Cast On Mario Show Me The Cast Let See Those Cast!
(function() {
    'use strict';

    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://youtu.be/TAfLcHfjKoo';
    anchorElement.className = 'clickable';

    const imgElement = document.createElement('img');
    imgElement.src = 'https://files.boyohboy.xyz/episodes/t-casts.jpeg';
    imgElement.style.rotate = '-7deg';
    imgElement.style.right = '300px';
    imgElement.style.bottom = '30%';

    anchorElement.appendChild(imgElement);

    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);

})();

// Futon Cindy go kicking Congo ugly!
(function() {
    'use strict';

    const anchorElement = document.createElement('a');
    anchorElement.href = 'https://youtu.be/y0MyKKe_qJQ';
    anchorElement.className = 'clickable';

    const imgElement = document.createElement('img');
    imgElement.src = 'https://files.boyohboy.xyz/episodes/t-congo.jpeg';
    imgElement.style.rotate = '6deg';
    imgElement.style.right = '200px';

    anchorElement.appendChild(imgElement);

    const container = document.querySelector('#wall') || document.body;
    container.appendChild(anchorElement);

})();