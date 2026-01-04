// ==UserScript==
// @name           qbwriter companion
// @description    debug tools that go with the qbwriter project
// @author         VillainsRule
// @namespace      https://github.com/VillainsRule/qbwriter

// @version        7
// @icon           https://i.imgur.com/vMdZ2C3.png

// @match          *://*.qbreader.org/multiplayer/*
// @exclude        *://*.qbreader.org/multiplayer/*.*
// @exclude        *://*.qbreader.org/multiplayer/

// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/524774/qbwriter%20companion.user.js
// @updateURL https://update.greasyfork.org/scripts/524774/qbwriter%20companion.meta.js
// ==/UserScript==

let intercepted = false;

let patches = [{
    match: /([;,])([a-zA-Z_]+)=(".*?"|'.*?'|\[[^\]]*\]|[^;,=]+)(?=[;,]|$)/g,
    replace: (_, ...x) => `;window.${x[1]}=${x[2]};`
}, {
    match: /(async\s+)?function ([a-zA-Z]+)\((.*?)\)\{/g,
    replace: (_, ...x) => `;window.${x[1]}=${x[0] ? ' ' + x[0] : ''}(${x[2]})=>{`
}, {
    match: /(?<!\{)(?:const|let|var)\s+([a-zA-Z_]+)\s*=(["'\[\]a-zA-Z0-9\{\}\!]+)/g,
    replace: (_, ...x) => `window.${x[0]}=${x[1]}`
}, {
    find: ';,',
    replace: ';'
}, {
    find: '}',
    replace: '}\n'
}, {
    find: '))}\n));',
    replace: '))}\n));window.onScriptLoad&&window.onScriptLoad();'
}];

const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(async (node) => {
                if (node.tagName === 'SCRIPT' && node.src.includes('/multiplayer/room.min.js')) {
                    console.log('mutation intercepted: ', node.src.split('/').pop());
                    intercepted = true;

                    let src = node.src;
                    node.removeAttribute('src');

                    let ft = await fetch(src);
                    let js = await ft.text();

                    patches.forEach((patch) => {
                        let oldJS = js;

                        if (patch.find) js = js.replaceAll(patch.find, patch.replace);
                        else if (patch.match) js = js.replace(patch.match, patch.replace);
                        else return;

                        if (js == oldJS) console.log('patch failed', patch);
                    });

                    const blob = new Blob([js], {
                        type: 'text/javascript'
                    });
                    const blobUrl = URL.createObjectURL(blob);

                    console.log('blob url created, adding');
                    console.log(blobUrl);

                    const script = document.createElement('script');
                    script.type = 'module';
                    script.textContent = js;

                    document.body.appendChild(script);
                }
            });
        }
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
});

setTimeout(() => !intercepted && location.reload(), 1500);