// ==UserScript==
// @include     /^https?://music\.apple\.com/\w\w/album/.+/.+$/
// @description Add a link to url of album cover image
// @name        itunes_cover_grabber.js
// @run-at      document-idle
// @version     0.0.7
// @namespace https://greasyfork.org/users/237261
// @downloadURL https://update.greasyfork.org/scripts/376321/itunes_cover_grabberjs.user.js
// @updateURL https://update.greasyfork.org/scripts/376321/itunes_cover_grabberjs.meta.js
// ==/UserScript==

/**
 * author: jay.somedon@outlook.com
 *
 * urls to album covers on itunes are structured like this:
 * <picture>
 *   <source media="smaller_width">
 *   <source media="smaller_width">
 *   <source media="max_width"
 *     srcset="
 *             url1 1x,     <--- low resolution
 *             url2 2x,     <--- low resolution
 *             urlmax maxx  <--- max resolution, we want this!
 *     ">
 * this script will parse that urlmax out
 * then add a button on bottom-left of the page
 * so when you click that button it shows you the album cover image with max resolution
 */

const picture = () =>
    document.querySelectorAll("picture.we-artwork.product-artwork--captioned")[0];

const sources = (picture) =>
    Array.from(picture.children).filter(elem => elem.tagName == "SOURCE").filter(elem => elem.hasAttribute("media"));

const width = (source) =>
    parseInt(source.media.match(/\d+/));

const wider = (acc, cur) =>
    (width(acc) > width(cur)) ? acc : cur;

const widest_source = (sources) =>
    sources.reduce(wider);

const greater_url_zoom_pair = (acc, cur) =>
    acc[1] > cur[1] ? acc : cur;

const cover_url = (source) =>
    source.srcset.split(',').map(urlzoomstr => urlzoomstr.split(' ')).reduce(greater_url_zoom_pair)[0];

const button_to_url = (url) => {
    const button = document.createElement("button");
    button.onclick = () =>
        window.open(url);
    return button;
};

const style_button = (button) => {
    button.textContent = "click for cover";
    button.style.cssText = "position: fixed; margin: 3px; bottom: 0; left: 0; z-index: 99999; background-color: darkcyan; color: lightyellow; width: 100px; height: 100px; border-radius: 50px; font-size: 20px; text-align: center;";
    button.onmouseover = (e) =>
        e.target.style.background = "salmon";
    button.onmouseout = (e) =>
        e.target.style.background = "darkcyan";
    return button;
};

const render = (button) => document.body.appendChild(button);

const main = () =>
    Promise.resolve()
        .then(picture)
        .then(sources)
        .then(widest_source)
        .then(cover_url)
        .then(button_to_url)
        .then(style_button)
        .then(render);

main();
