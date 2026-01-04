// ==UserScript==
// @name         InstaIMG
// @namespace    https://greasyfork.org/en/users/141529-wogt
// @version      1.31
// @description  _
// @author       wogt
// @match        *://img.yt/*
// @match        *://imgcandy.net/*
// @match        *://imgstudio.org/*
// @match        *://damimage.com/*
// @match        *://fapat.me/*
// @match        *://gogoimage.org/*
// @match        *://acidimg.cc/*
// @match        *://ima.gy/*
// @match        *://imgaws.com/*
// @match        *://imgspot.org/*
// @match        *://imgmaid.net/*
// @match        *://myimg.club/*
// @match        *://coreimg.net/*
// @match        *://imgclick.net/*
// @match        *://chronos.to/*
// @match        *://cuteimg.cc/*
// @match        *://imgtrex.com/*
// @match        *://pic-maniac.com/*
// @match        *://imagetwist.com/*/*.*
// @match        *://imgchili.net/show/*
// @match        *://pixhost.to/show/*
// @match        *://imgbox.com/*
// @match        *://www.imgflare.com/*
// @match        *://www.imgbabes.com/*
// @match        *://*.imagevenue.com/*
// @match        *://www.imgspice.com/*
// @match        *://imgspice.com/*
// @match        *://www.imagebam.com/*
// @match        *://www.picpig.org/*
// @match        *://picpig.org/*
// @match        *://imx.to/*
// @match        *://imagezilla.net/*
// @match        *://jerking.empornium.ph/*
// @match        *://abload.de/*
// @match        *://www.abload.de/*
// @match        *://pixxxels.cc/*
// @match        *://vipr.im/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31634/InstaIMG.user.js
// @updateURL https://update.greasyfork.org/scripts/31634/InstaIMG.meta.js
// ==/UserScript==

/**
 * img.yt, imgcandy.net, imgstudio.org, damimage.com, fapat.me, gogoimage.org, imgspot.org, ima.gy, imgaws.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/img\.yt\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/imgcandy\.net\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/imgstudio\.org\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/damimage\.com\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/fapat\.me\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/gogoimage\.org\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/acidimg\.cc\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/imgspot\.org\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/ima\.gy\/i\/[a-z0-9]+(?:\?.*)?/i) &&
        !window.location.href.match(/^https?:\/\/imgaws\.com\/img-[a-z0-9]+.html(?:\?.*)?$/i) &&
       true) { return; }

    let nodes;

    nodes = document.querySelectorAll('[name="imgContinue"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        node.click();
    }

    nodes = document.querySelectorAll('img[src*="/upload/big/"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imx.to
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/imx\.to\/i\/[a-z0-9]+(?:\?.*)?/i) &&
        !window.location.href.match(/^https?:\/\/imx\.to\/img-[a-z0-9]+(?:\?.*)?/i) &&
       true) { return; }

    let nodes;

    nodes = document.querySelectorAll('[name="imgContinue"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        node.click();
    }

    nodes = document.querySelectorAll('img[src*="/i/"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imgmaid.net, myimg.club, coreimg.net, imgclick.net, chronos.to, cuteimg.cc, imgtrex.com, pic-maniac.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/imgmaid\.net\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/myimg\.club\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/coreimg\.net\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/imgclick\.net\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/chronos\.to\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/cuteimg\.cc\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/imgtrex\.com\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
        !window.location.href.match(/^https?:\/\/pic-maniac\.com\/[a-z0-9]+(\/[^\/]+)?(?:\?.*)?$/i) &&
       true) { return; }

    let nodes;

    nodes = document.querySelectorAll('input[name="next"]');
    if (nodes.length >= 1 && nodes.length <= 2) {
        let node = nodes[0];
        node.click();
    }

    nodes = document.querySelectorAll('.pic');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imagezilla.net
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^.*:\/\/imagezilla\.net\/show\/[a-z0-9]+-[^\/]+\.[^\/]+(?:\?.*)?$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('img[src*="/images/"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imagetwist.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^.*:\/\/imagetwist\.com\/[a-z0-9]+\/[^\/]+\.[^\/]+(?:\?.*)?$/i) &&
       true) { return; }

    try { closeOverlay(); } catch(e) { }

    let nodes = document.querySelectorAll('img[src*="/i/"]');
    if (nodes.length === 1) {
        let node = nodes[0];

        // Workaround because imagetwist.com does not send the correct mime type.
        var img = document.createElement('img');
        img.src = node.src;
        document.body.innerHTML = '';
        document.body.appendChild(img);
    }
})();

/**
 * imgchili.net, pixhost.to
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^.*:\/\/pixhost\.to\/show\/[0-9]+\/[^\/]+\.[^\/]+(?:\?.*)?$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('#show_image');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * pixhost.to, abload.de
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^.*:\/\/pixhost\.to\/show\/[0-9]+\/[^\/]+\.[^\/]+(?:\?.*)?$/i) &&
        !window.location.href.match(/^.*:\/\/(?:www\.)?abload\.de\/image\.php\?img=/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('#image');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * pixxxels.cc
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^.*:\/\/pixxxels\.cc\/[a-zA-Z0-9]{8}(?:\?.*)?$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('#main-image');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imgbox.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^.*:\/\/imgbox\.com\/[a-z0-9]+(?:\?.*)?$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('#img');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imgflare.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/www\.imgflare\.com\/[^\/]+\/[^\/]+\.html(?:\?.*)?/i) &&
        !window.location.href.match(/^https?:\/\/www\.imgbabes\.com\/[^\/]+\/[^\/]+\.html(?:\?.*)?/i) &&
       true) { return; }

    try { Decode(); } catch(e) { }

    let nodes = document.querySelectorAll('img[src*="/files/"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imagevenue.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/img[0-9]+\.imagevenue\.com\/img\.php\?.*/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('#thepic');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imgspice.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/(?:www\.)?imgspice\.com\/[a-z0-9]+\/[^\/\?]+\.html(?:\?.*)?/i) &&
       true) { return; }

    try { viewholder.closeit(); } catch(e) { }

    let nodes = document.querySelectorAll('img[src*="/i/"]');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * imagebam.com
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/www\.imagebam\.com\/image\/[a-z0-9]+(?:\?.*)?$/i) &&
       true) { return; }

  	let nodes;

    nodes = document.querySelectorAll('#continue a');
    if (nodes.length === 1) {
        let node = nodes[0];
        node.click();
    }

    nodes = document.querySelectorAll('.main-content .main-image');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();

/**
 * picpig.org
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/(?:www\.)?picpig\.org\/image\/[a-z0-9]+(?:\?.*)?$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('#image-viewer img[src*="/images/"]');
    if (nodes.length === 2) { // We get the element twice, don't know why (yet).
        let node = nodes[0];
        window.location = node.src.replace(/\.md\.([a-z0-9]+)$/i, '.$1');
    }
})();


/**
 * jerking.empornium.ph
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/jerking\.empornium\.ph\/image\/[a-z0-9]+(?:\?.*)?$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('a[href$="?agree-consent"]');
    if (nodes.length === 1) {
        nodes[0].click();
    }

    nodes = document.querySelectorAll('#image-viewer img[src*="/images/"]');
    if (nodes.length === 2) {
        window.location = nodes[1].src;
    }
})();

/**
 * vipr.im
 */
(function() {
    'use strict';

    if (!window.location.href.match(/^https?:\/\/vipr\.im\/[a-z0-9]{12}$/i) &&
       true) { return; }

    let nodes = document.querySelectorAll('.pic');
    if (nodes.length === 1) {
        let node = nodes[0];
        window.location = node.src;
    }
})();