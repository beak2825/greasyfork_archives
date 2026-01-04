// ==UserScript==
// @name         IMDB bigger thumbnails/images/poster on chart pages
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.3.3
// @description  edits image url to get the full size picture and increases poster size
// @author       Alistair1231
// @match        https://www.imdb.com/chart*
// @icon         https://www.google.com/s2/favicons?domain=imdb.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428201/IMDB%20bigger%20thumbnailsimagesposter%20on%20chart%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/428201/IMDB%20bigger%20thumbnailsimagesposter%20on%20chart%20pages.meta.js
// ==/UserScript==
function makeMods(x, late) {
    if (x.flag == null)
        x.flag = 0;
    if (late == false) {
        if (x.flag != 2) {
            try {
                // let path = window.location.pathname.split('/');
                // // if on search page
                // if(path[1]=="find")

                let scale = 140 / x.width;
                x.width *= scale;
                x.height *= scale;
                if (x.height >= 208)
                    x.height = 208;
                // crop instead of stretch
                x.setAttribute("style", "object-fit: cover;");
                let match = x.src.match(/https:\/\/m\.media-amazon\.com\/images\/[MS]\/[^\.]+\._V\d_/);
                if (match != null)
                    x.src = match[0] + ".jpg";
                // x.src = x.src.match(/https:\/\/m\.media-amazon\.com\/images\/[MS]\/[^\.]+/)[0] + ".UY220_CR160,220_AL_.jpg";
                x.flag++;

            } catch (e) { }
        }
    }
    else if (late == true) {
        try {
            let scale = 80 / x.width;
            x.width *= scale;
            x.height *= scale;
            // crop instead of stretch
            x.setAttribute("style", "object-fit: cover;");
            let match = x.src.match(/https:\/\/m\.media-amazon\.com\/images\/[MS]\/[^\.]+\._V\d_/);
            if (match != null)
                x.src = match[0] + ".jpg";
        } catch (e) { }
    }
}
function run() {

    // for sites like popular movies
    // https://www.imdb.com/chart/moviemeter/
    Array.from(document.querySelectorAll(".posterColumn a img")).map(x => makeMods(x, false));
    // for sites like search
    // https://www.imdb.com/find?q=invin
    Array.from(document.querySelectorAll(".primary_photo a img")).map(x => makeMods(x, false));
    // actor images
    Array.from(document.querySelectorAll(".loadlate")).map(x => makeMods(x, true));
    setTimeout(run, 2000);
}


(function () {
    run();
})();
