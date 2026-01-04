// ==UserScript==
// @name         KrunkerCheats Wallhack
// @namespace    https://krunker.io
// @version      1.6.7
// @description  ESP V1.6.7
// @author       KrunkerCheats
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390141/KrunkerCheats%20Wallhack.user.js
// @updateURL https://update.greasyfork.org/scripts/390141/KrunkerCheats%20Wallhack.meta.js
// ==/UserScript==

function patchDocument(html) {
    html = html.replace(/(<script src=\"js\/game\.*\.js\?build=*")(><\/script>)/, '$1 type="application/json" $2');
    html = html.replace(`<script src="https://www.paypalobjects.com/api/checkout.js"></script>`, ``);
    return html;
}


function get(url) {
    return new Promise(resolve => {
        fetch(url).then(res => res.text()).then(res => {
            return resolve(res);
        });
    });
}

(async function () {

    const html = await get(document.location.href);
    const build = html.match(/(?<=build=)[^"]+/)[0];
    const script = await get(`/js/game.${build}.js?build=${build}`);

    document.open();
    document.write(patchDocument(html));
    document.close();
    try {
        eval(script.replace(/if\(!tmpObj\['inView']\)continue;/, ``));
    } catch (err) {
        location.reload();

    }

})();