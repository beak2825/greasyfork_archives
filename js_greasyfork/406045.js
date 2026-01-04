// ==UserScript==
// @name        mod github layout
// @name:zh-CN  调整github新布局
// @version     0.0.3
// @namespace   https://github.com/Ahaochan/Tampermonkey
// @match       *://*.github.com/*/*
// @description Temporarily improve github project layout
// @description:zh-CN 该插件用于临时改善github新版本布局
// @downloadURL https://update.greasyfork.org/scripts/406045/mod%20github%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/406045/mod%20github%20layout.meta.js
// ==/UserScript==
((document)=>{
    const menuSelector = 'nav.js-repo-nav';
    let menu = document.querySelector(menuSelector).parentNode;
    let progressBar = document.querySelector('.progress-pjax-loader > span');
    if(menu && initoPlugin()) {
        tickLoaded = true;
        console.log('插件初始化完成，此插件临时改善新版github布局\n2020-06-24\n-by-灰铁炼成樱花');
        let lastMesh = document.location.href;
        setInterval(async () => {
            const newMesh = document.location.href;
            if(lastMesh !== newMesh) {
                lastMesh = newMesh;
                await isLoaded();
                initoPlugin();
            }
        }, 100);
    }

    function initoPlugin() {
        const removeColorClass = 'bg-gray-light';
        menu.classList.add('container-xl');
        menu.classList.remove(removeColorClass);
        menu.childNodes.forEach((node) => {
            node.nodeType === 1 && node.classList.remove(removeColorClass);
        });
        const content = document.querySelector('.gutter-condensed > div:nth-child(2)');
        if(content) {
            TabfindPubLinks(content);
            return true;
        }
    }

    function TabfindPubLinks(content) {
        let pubLinks = content.querySelectorAll('a.text-small');
        for (let i = 0, l = pubLinks.length; i < l; i++) {
            let el = pubLinks[i];
            let text = el.innerText;
            let match = text.match(/\d+.*releases/);
            if(match) {
                const link = el.getAttribute('href');
                let pubNum = parseInt(text.match(/\d+/)[0]);
                if(pubNum > 0) {
                    pubNum += 1;
                }
                const insertTmp = 
                `
                <li class='d-flex'>
                    <a class="js-selected-navigation-item UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item" data-tab-item="insights-tab" data-ga-click="Repository, Navigation click, Insights tab" href="${link}">
                        <svg height="16" class="octicon octicon-play UnderlineNav-octicon d-none d-sm-inline mt="1" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                        <span>Release</span>
                        <span class="Counter">${pubNum.toString()}</span>
                    </a>
                </li>
                `;
                const beforeTab = menu.querySelector('.UnderlineNav > ul');
                beforeTab && beforeTab.insertAdjacentHTML('beforeend', insertTmp);
                break;
            }
        }
    }

    async function isLoaded() {
        let checkTimer = 0;
        return new Promise((resolve) => {
            checkTimer = setInterval(() => {
                menu = document.querySelector(menuSelector).parentNode;
                if(progressBar.offsetWidth >= document.body.clientWidth) {
                    resolve();
                    clearInterval(checkTimer);
                }
            }, 100);
        })
    }
})(document);