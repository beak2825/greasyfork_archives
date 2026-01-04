// ==UserScript==
// @name         Direct Link
// @name:zh-CN   重定向链接转直链
// @description  Replace redirect links with direct links
// @description:zh-CN  将页面内所有重定向式的链接替换为直链
// @namespace    https://github.com/cilxe/JavaScriptProjects
// @version      0.2.4
// @author       cilxe
// @match        *://*.youtube.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.steampowered.com/*
// @match        *://*.steamcommunity.com/*
// @match        *://*.pixiv.net/*
// @match        *://*.vk.com/*
// @match        *://*.hoyolab.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.juejin.cn/*
// @match        *://*.epicgames.com/*
// @match        *://*.mozilla.org/*
// @match        *://*.firefox.com/*
// @match        *://*.leetcode.cn/*
// @match        *://*.oschina.net/*
// @match        *://*.gitee.com/*
// @match        *://*.xda-developers.com/*
// @match        *://*.sspai.com/*
// @match        *://*.gcores.com/*
// @match        *://*.deviantart.com/*
// @match        *://union-click.jd.com/*
// @match        *://*.tmall.com/*
// @match        *://s.click.taobao.com/*
// @match        *://s.click.tmall.com/*
// @match        *://wiki.biligame.com/*
// @match        *://*.linkstars.com/*
// @match        *://tieba.baidu.com/*
// @match        *://ala.baidu.com/*
// @match        *://*.linkedin.com/*
// @match        *://*.theverge.com/*
// @match        *://*.douban.com/*
// @match        *://sourceforge.net/*
// @icon         data:image/png;base64,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
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @sandbox      JavaScript
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463408/Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/463408/Direct%20Link.meta.js
// ==/UserScript==

/*
## Main features
- Replace redirect links with direct links
- Clean SourceForge tracking links
- Additional features via script menu

## Currently supported sites
- youtube.com
- epicgames.com
- mozilla.org / firefox.com (adjust.com)
- hoyolab.com (adjust.com)
- juejin.cn
- leetcode.cn
- oschina.net
- gitee.com
- xda-developers.com
- sspai.com
- gcores.com
- zhihu.com
- Steam (Store, Hub)
- pixiv.net
- vk.com
- deviantart.com
- tmall.com (goto)
- linkstars.com (Prevent redirection)
- union-click.jd.com (Prevent redirection)
- s.click.(tmall|taobao).com (Prevent redirection)
- wiki.biligame.com
- tieba.baidu.com
- linkedin.com
- sourceforge.net
*/

(() => {
    const DELAY_TIME = { fast: 600, normal: 1000, slow: 2500 };
    let topScroll = 0;
    const INDEX_TARGET = ['target'];
    const INDEX_ADJUST = ['redirect', 'fallback'];
    const INDEX_URL = ['url'];
    const INDEX_TO = ['to'];
    const INDEX_Q = ['q'];
    const INDEX_GOTO = ['goto'];
    const regStr = '(youtube|steamcommunity|zhihu|jianshu|juejin|leetcode|'
        + 'oschina|gitee|sspai|gcores|alipay|epicgames|linkedin|vk|adjust|'
        + 'game.bilibili|douban|sourceforge).(com|net|cn|hk)$';
    let hostRegex = new RegExp(regStr);
    const pageHost = window.location.hostname;
    const pageParams = window.location.search;
    const doc = document;

    // SourceForge link cleaning function
    function cleanSourceForgeLink(originalLink) {
        try {
            const url = new URL(originalLink);
            const oaparams = new URLSearchParams(url.search).get('oaparams');
            if (!oaparams) return originalLink;
            
            const oaComponents = oaparams.split('__');
            const oadestComponent = oaComponents.find(comp => comp.startsWith('oadest='));
            if (!oadestComponent) return originalLink;
            
            const destUrlEncoded = oadestComponent.split('oadest=')[1];
            const destUrl = decodeURIComponent(destUrlEncoded);
            const finalUrl = new URL(destUrl);
            
            return finalUrl.origin + finalUrl.pathname.replace(/\/$/, '');
        } catch (e) {
            console.error('Error cleaning SourceForge URL:', e);
            return originalLink;
        }
    }

    let linkDirect;
    switch (true) {
        case /(pixiv.net|deviantart.com)$/.test(pageHost):
            hostRegex = /(pixiv.net|deviantart.com)$/;
            linkDirect = (directURLParams, delayTime) => {
                const timeoutID = setTimeout(() => {
                    const links = doc.getElementsByTagName('a');
                    for (let i = 0; i < links.length; i++) {
                        if (hostRegex.test(links[i].hostname)) {
                            const params = new URLSearchParams(links[i].search);
                            directURLParams.forEach((k) => {
                                if (params.has(k) && links[i].href !== decodeURIComponent(params.get(k))) {
                                    links[i].href = decodeURIComponent(params.get(k));
                                }
                            });
                            if (/jump.php|outgoing/.test(links[i].pathname)) {
                                if (links[i].href !== decodeURIComponent(links[i].search.substring(1, links[i].href.length))) {
                                    links[i].href = decodeURIComponent(links[i].search.substring(1, links[i].href.length));
                                }
                            }
                        }
                    }
                    clearTimeout(timeoutID);
                }, delayTime);
            };
            break;
        case /xda-developers.com$/.test(pageHost):
            hostRegex = /(xda-developers.com|shop-links.co|anrdoezrs.net|a9yw.net|pxf.io|viglink.com|awin1.com)$/;
            linkDirect = (directURLParams, delayTime) => {
                const timeoutID = setTimeout(() => {
                    const links = doc.getElementsByTagName('a');
                    for (let i = 0; i < links.length; i++) {
                        if (hostRegex.test(links[i].hostname)) {
                            const params = new URLSearchParams(links[i].search);
                            directURLParams.forEach((k) => {
                                if (params.has(k) && links[i].href !== decodeURIComponent(params.get(k))) {
                                    links[i].href = decodeURIComponent(params.get(k));
                                }
                            });
                            let realLink = links[i].href;
                            if (/https?/.test(links[i].search)) {
                                realLink = links[i].search.substring(1, links[i].href.length);
                            } else if (/https?/.test(links[i].pathname)) {
                                realLink = links[i].pathname.substring(links[i].pathname.lastIndexOf('http'), links[i].href.length);
                            }
                            if (links[i].href !== decodeURIComponent(realLink)) {
                                links[i].href = decodeURIComponent(realLink);
                            }
                        }
                    }
                    clearTimeout(timeoutID);
                }, delayTime);
            };
            break;
        case /^(tieba|ala).baidu.com$/.test(pageHost):
            linkDirect = (directURLParams, delayTime) => {
                const timeoutID = setTimeout(() => {
                    const links = doc.getElementsByClassName('j-no-opener-url');
                    for (let i = 0; i < links.length; i++) {
                        if (/^jump2?.bdimg.com$/.test(links[i].hostname) && links[i].innerText.startsWith('http')) {
                            links[i].href = links[i].innerText;
                        }
                    }
                    clearTimeout(timeoutID);
                }, delayTime);
            };
            break;
        case /sourceforge.net$/.test(pageHost):
            linkDirect = (directURLParams, delayTime) => {
                const timeoutID = setTimeout(() => {
                    const links = doc.getElementsByTagName('a');
                    for (let i = 0; i < links.length; i++) {
                        if (/sourceforge.net$/.test(links[i].hostname)) {
                            const cleanedLink = cleanSourceForgeLink(links[i].href);
                            if (links[i].href !== cleanedLink) {
                                links[i].href = cleanedLink;
                            }
                        }
                    }
                    clearTimeout(timeoutID);
                }, delayTime);
            };
            break;
        default:
            linkDirect = (directURLParams, delayTime) => {
                const timeoutID = setTimeout(() => {
                    const links = doc.getElementsByTagName('a');
                    for (let i = 0; i < links.length; i++) {
                        if (hostRegex.test(links[i].hostname)) {
                            const params = new URLSearchParams(links[i].search);
                            directURLParams.forEach((k) => {
                                if (params.has(k) && links[i].href !== params.get(k)) {
                                    links[i].href = params.get(k);
                                }
                            });
                        }
                    }
                    clearTimeout(timeoutID);
                }, delayTime);
            };
            break;
    }

    // Youtube additional steps
    function youtubeDirect() {
        function run(delayTime) {
            linkDirect(INDEX_Q, DELAY_TIME.fast);
            linkDirect(INDEX_Q, DELAY_TIME.normal * 2);
            const timeoutID = setTimeout(() => {
                linkDirect(INDEX_Q, 0);
                document.addEventListener('click', () => {
                    linkDirect(INDEX_Q, DELAY_TIME.fast);
                });
                clearTimeout(timeoutID);
            }, delayTime);
        }
        run(2000);
        doc.addEventListener('DOMContentLoaded', () => {
            run(1000);
        });
        doc.onvisibilitychange = () => {
            run(1500);
        };
    }

    // Main function
    (() => {
        let indexParam;
        let MenuTitle;
        switch (navigator.language) {
            case 'zh-CN' || 'zh-SG':
                MenuTitle = '手动重新替换';
                break;
            case 'zh-TW' || 'zh-HK':
                MenuTitle = '手動再次替換';
                break;
            default:
                MenuTitle = 'Retry link replacing.';
                break;
        }

        const adjust = /(hoyolab|mozilla|firefox)\.(com|org)$/.test(pageHost);
        const usingTarget = /(juejin|leetcode|gitee|sspai|gcores|zhihu)\.(com|cn)$/.test(pageHost);
        const isSourceForge = /sourceforge.net$/.test(pageHost);
        const urlParam = new URLSearchParams(pageParams);
        switch (true) {
            case usingTarget:
                indexParam = INDEX_TARGET;
                break;
            case adjust:
                indexParam = INDEX_ADJUST;
                linkDirect(indexParam, DELAY_TIME.normal * 2);
                break;
            case pageHost.endsWith('youtube.com'):
                indexParam = INDEX_Q;
                youtubeDirect();
                break;
            case /(s.click.taobao.com|tmall.com)$/.test(pageHost):
                indexParam = INDEX_GOTO;
                if (/^s.click.(tmall|taobao).com$/.test(window.location.hostname)
                    && new URLSearchParams(pageParams).has('tar')) {
                    window.stop();
                    const targetLink = decodeURIComponent(new URLSearchParams(window.location.search).get('tar'));
                    if (/^https?:\/\//.test(targetLink)) {
                        window.location.replace(targetLink);
                    }
                }
                break;
            case isSourceForge:
                linkDirect([], DELAY_TIME.normal);
                break;
            case /(steampowered|steamcommunity|wiki.biligame|linkedin|douban).com$|pixiv.net$/.test(pageHost):
                indexParam = INDEX_URL;
                break;
            case /(vk|jianshu).com$/.test(pageHost):
                indexParam = INDEX_TO;
                break;
            case pageHost.endsWith('epicgames.com'):
                indexParam = ['redirectTo'];
                break;
            case pageHost.endsWith('oschina.net'):
                INDEX_URL.push('goto_page');
                indexParam = INDEX_URL;
                break;
            case pageHost.endsWith('xda-developers.com'):
                INDEX_URL.push('u', 'ued', 'referer');
                indexParam = INDEX_URL;
                break;
            case /(union-click.jd.com|www.linkstars.com)$/.test(pageHost):
                indexParam = INDEX_TO;
                if (urlParam.has(indexParam) && /^https?/.test(urlParam.get(indexParam))) {
                    window.stop();
                    window.location.href = decodeURIComponent(urlParam.get(indexParam));
                }
                break;
            case /(theverge.com|7tiv.net)$/.test(pageHost):
                hostRegex = /sjv.io$/;
                INDEX_URL.push('u');
                indexParam = INDEX_URL;
                if (pageHost.endsWith('7tiv.net')
                    && new URLSearchParams(pageParams).has(indexParam)) {
                    window.stop();
                    window.location.href = decodeURIComponent(
                        new URLSearchParams(pageParams).get(indexParam)
                    );
                }
                break;
            default:
                indexParam = [''];
                break;
        }

        doc.addEventListener('DOMContentLoaded', () => {
            linkDirect(indexParam, DELAY_TIME.normal);
        });

        GM_registerMenuCommand(
            MenuTitle,
            () => { linkDirect(indexParam, 0); },
            'D'
        );

        window.onscroll = () => {
            const scrolls = doc.documentElement.scrollTop;
            if (scrolls <= 200) {
                linkDirect(indexParam, 0);
                topScroll = scrolls;
            }
            if (scrolls - topScroll > 100 && scrolls > 200) {
                linkDirect(indexParam, 0);
                topScroll = scrolls;
            }
        };
    })();
})();

/*
v0.2.5 2025.06.01
- Added theverge.com|7tiv.net|douban.com|sourceForge.net.
- Optimized performance and error handling.
- Maintained all existing features with DS.

v0.2.3 2023.08.15
- Add a alternate host `ala.baidu.com`, same as `tieba.baidu.com`.
- Fix an error when decoding the URLs on the Chinese pages of youtube.com.

v0.2.2 2023.07.02
- Performance improvements and issue fixes.

v0.2.1 2023.06.07  
- Fix an issue where the replacements weren't active on `deviantart.com`, which is missing on `siteRegex`.
- Fix most timeout issues.
- Minor issue fixes and optimisations .

v0.2.0  2023.06.02  
- Improve replacing efficiency on youtube.
- Replacing more links on xda (a9yw.net|pxf.io), tieba.baidu.com (jump.baidu.com), linkedin.com.
- Prevent redirection on `s.click.tmall.com` (beta).
- Code reduction and other improvements.

v0.1.9 2023.05.24  
- Directing for wiki.biligame.com, www.linkstars.com.
- Performance optimisation and bug fixes.

v0.1.8 2023.05.18  
- Directing for JD.com, Tmall.com.
- Improve replacing efficiency on youtube.

v0.1.7 2023.05.15  
- Replace more redirecting links for xda-developers(vglink.com anrdoezrs.net).
- Add a index param for shop-links.co.
- Direc links for `Steam store and hub`, `Pixiv.net`.
- Optimise regexps matching.

v0.1.6.1 2023.05.10  
- Fix an issue where has an undefined function, which may cause some functions to fail to execute.

v0.1.6 2023.05.10  
- Add support for sspai|gcores|zhihu.com (target).
- Add another redirecting index param for oschina.net.
- Remove landiannews.com for its low usage.

v0.1.5 2023.05.05  
- Errors fixes and code reduction.
- Replacing the shop-links with direct links on **xda-developers.com**.

v0.1.4 2023.04.28  
- Expand effecting area.
- Several optimisation.
- More url index for adjust.

v0.1.3 2023.04.18  
- Improve effecting stability.
- Apply direct link for mozilla.org, firefox.com (Adjust.com - redirect),
- Apply direct link for leetcode.cn, oschina.net, gitee.com (target).
- Add a script submenu to the tampermonky menu, which for the function of manually replacing with direct links.

v0.1.2 2023.04.15  
- Optimised link directing on youtube.com.
- Performance optimisation.

v0.1.1 2023.04.06  
- Spelling correction.

v0.1.0 2023.04.06  
- Script optimisation.
- Fix youtube matching.

v0.0.6  2023.03.27  
Replace direct url on Epicgames.com.

v0.0.5  
- Remove [Youtube.com] event redirection.

v0.0.4 2023.02.24  
- Added [Juejin.cn] redirecting.

v0.0.3 2023.01.25  
- Added [Jianshu.com] redirecting.

v0.0.2 2023.01.06  
- Clean Hoyolab [app.adjust.com] tracking urls.

v0.0.1 2022.12.27  
- Initial release, direct link for landiannews.com.
*/