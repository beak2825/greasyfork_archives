// ==UserScript==
// @match       https://www.npmjs.com/package/*
// @match       https://js.stripe.com/v3/controller-3d240f15c7d33335abc8bc509e1f19ad.html*
// @name        Free NPM Explore
// @description Allow exploring NPM packages for free
// @grant       GM.addElement
// @version     0.1.0
// @author      KaKi87
// @license     GPL-3.0-or-later
// @namespace   https://git.kaki87.net/KaKi87/userscripts/src/branch/master/FreeNpmExplore
// @downloadURL https://update.greasyfork.org/scripts/436271/Free%20NPM%20Explore.user.js
// @updateURL https://update.greasyfork.org/scripts/436271/Free%20NPM%20Explore.meta.js
// ==/UserScript==

if(window.location.href.startsWith('https://www.npmjs.com/package/')){

    let iframe;

    document.querySelector('#package-tab-explore').addEventListener('click', async event => {
        await new Promise(resolve => {
            const _ = () => {
                const el = document.querySelector('#tabpanel-explore div');
                if(el)
                    resolve(el.setAttribute('style', 'display: none;'));
                else
                    window.requestAnimationFrame(_);
            };
            _();
        });
        if(iframe)
            iframe.style.display = 'block';
        else {
            const [, package, version] = window.location.href.match(/^https:\/\/www\.npmjs\.com\/package\/(.+?)(?:\/v\/(.+))?$/);
            iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://js.stripe.com/v3/controller-3d240f15c7d33335abc8bc509e1f19ad.html?${new URLSearchParams({ package, version })}`);
            iframe.setAttribute('style', 'border: none; width: 100%; height: 40rem');
        }
        if(!document.body.contains(iframe))
            document.querySelector('#tabpanel-explore').appendChild(iframe);
    });

    document.querySelectorAll('[id^="package-tab"]:not(#package-tab-explore)').forEach(el => el.addEventListener('click', () => {
        if(iframe)
            iframe.style.display = 'none';
    }));

}

else if(window.location.href.startsWith('https://js.stripe.com/v3/controller-3d240f15c7d33335abc8bc509e1f19ad.html')){

    if(window.self !== window.top){
        const
            sharedCss = 'position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;',
            splash = document.createElement('div');
        splash.setAttribute('style', sharedCss + 'z-index: 1; background-color: black; display: flex; justify-content: center; align-items: center; font-size: 2.5rem');
        splash.innerText = 'Loading UNPKG...';
        document.body.appendChild(splash);
        const
            {
                package,
                version
            } = Object.fromEntries(new URL(window.location.href).searchParams.entries()),
            iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://unpkg.com/browse/${package}${version === 'undefined' ? '' : `@${version}`}/`);
        iframe.setAttribute('style', sharedCss + 'border: none; z-index: 2');
        document.body.appendChild(iframe);
    }

}