// ==UserScript==
// @name              哔哩哔哩(B站|Bilibili)收藏夹Fix (跳转第三方网站)
// @name:zh-CN        哔哩哔哩(B站|Bilibili)收藏夹Fix (跳转第三方网站)
// @name:zh-TW        哔哩哔哩(B站|Bilibili)收藏夹Fix (跳转第三方网站)
// @namespace         http://tampermonkey.net/
// @version           1.2.4
// @description       跳转至BiliPlus, 贝贝工具站, 唧唧, 备份或查看某个视频的信息
// @description:zh-CN 跳转至BiliPlus, 贝贝工具站, 唧唧, 备份或查看某个视频的信息
// @description:zh-TW 跳转至BiliPlus, 贝贝工具站, 唧唧, 备份或查看某个视频的信息
// @author            YTB0710
// @match             https://space.bilibili.com/*
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/506785/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28B%E7%AB%99%7CBilibili%29%E6%94%B6%E8%97%8F%E5%A4%B9Fix%20%28%E8%B7%B3%E8%BD%AC%E7%AC%AC%E4%B8%89%E6%96%B9%E7%BD%91%E7%AB%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506785/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28B%E7%AB%99%7CBilibili%29%E6%94%B6%E8%97%8F%E5%A4%B9Fix%20%28%E8%B7%B3%E8%BD%AC%E7%AC%AC%E4%B8%89%E6%96%B9%E7%BD%91%E7%AB%99%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const favlistURLRegex = /https:\/\/space\.bilibili\.com\/\d+\/favlist.*/;
    const getBVFromURLRegex = /video\/(\w+)/;
    const getCoverFromURLRegex = /\/\/([^@]*)@/;

    let onFavlistPage = false;

    const favlistObserver = new MutationObserver((_mutations, observer) => {
        if (document.querySelector('div.favlist-main')) {
            observer.disconnect();
            addMessage(true);
            biliCardDropdownPopperObserver.observe(document.body, { childList: true, attributes: false, characterData: false });
            return;
        }
        if (document.querySelector('div.fav-content.section')) {
            observer.disconnect();
            addMessage(false);
            favContentSectionObserver.observe(document.querySelector('div.fav-content.section'), { characterData: false, attributeFilter: ['class'] });
            return;
        }
    });

    const biliCardDropdownPopperObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === 1 && addedNode.classList.contains('bili-card-dropdown-popper')) {
                    mainNewFreshSpace(addedNode);
                    return;
                }
            }
        }
    });

    const favContentSectionObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (!mutation.target.classList.contains('loading')) {
                main();
                return;
            }
        }
    });

    checkURL();

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        checkURL();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        checkURL();
    };

    window.addEventListener('popstate', checkURL);

    function checkURL() {
        if (favlistURLRegex.test(location.href)) {
            if (!onFavlistPage) {
                onFavlistPage = true;
                favlistObserver.observe(document.body, { subtree: true, childList: true, attributes: false, characterData: false });
            }
        } else {
            if (onFavlistPage) {
                onFavlistPage = false;
                favlistObserver.disconnect();
                biliCardDropdownPopperObserver.disconnect();
                favContentSectionObserver.disconnect();
            }
        }
    }

    function mainNewFreshSpace(divDropdownPopper) {
        const divDropdowns = document.querySelectorAll('div.bili-card-dropdown--visible');
        if (divDropdowns.length !== 1) {
            return;
        }

        let divTargetVideo;
        try {
            divTargetVideo = document.querySelector('div.items__item:has(.bili-card-dropdown--visible)');
        } catch {
            const items = document.querySelectorAll('div.items__item');
            for (const item of items) {
                if (item.contains(divDropdowns[0])) {
                    divTargetVideo = item;
                    break;
                }
            }
        }
        if (!divTargetVideo) {
            return;
        }

        if (divTargetVideo.querySelector('div.bili-cover-card__tags')) {
            return;
        }

        let disabled = false;
        if (!divTargetVideo.querySelector('div.bili-cover-card__stats')) {
            disabled = true;
        }

        const BV = divDropdowns[0].parentNode.querySelector('a').getAttribute('href').match(getBVFromURLRegex)[1];

        const dropdownJump = document.createElement('div');
        dropdownJump.classList.add('bili-card-dropdown-popper__item');
        dropdownJump.textContent = '跳转至BXJ';
        dropdownJump.addEventListener('click', () => {
            divDropdownPopper.classList.remove('visible');
            GM_openInTab(`https://www.biliplus.com/video/${BV}`, { active: disabled, insert: false, setParent: true });
            GM_openInTab(`https://xbeibeix.com/video/${BV}`, { insert: false, setParent: true });
            GM_openInTab(`https://www.jijidown.com/video/${BV}`, { insert: false, setParent: true });
        });
        divDropdownPopper.appendChild(dropdownJump);

        if (!disabled) {
            const dropdownCover = document.createElement('div');
            dropdownCover.classList.add('bili-card-dropdown-popper__item');
            dropdownCover.textContent = '封面原图';
            dropdownCover.addEventListener('click', () => {
                divDropdownPopper.classList.remove('visible');
                GM_openInTab(`https://${divTargetVideo.querySelector('img').getAttribute('src').match(getCoverFromURLRegex)[1]}`, { active: true, insert: true, setParent: true });
            });
            divDropdownPopper.appendChild(dropdownCover);
        }
    }

    function main() {
        for (const li of document.querySelectorAll('li.small-item')) {
            if (li.querySelector('div.ogv-corner-tag')) {
                continue;
            }

            const ul = li.querySelector('ul.be-dropdown-menu');
            if (!ul) {
                continue;
            }

            if (!ul.lastElementChild.classList.contains('added')) {
                ul.lastElementChild.classList.add('be-dropdown-item-delimiter');

                let disabled = false;
                if (li.classList.contains('disabled')) {
                    disabled = true;
                }

                const BV = li.getAttribute('data-aid');

                const dropdownJump = document.createElement('li');
                dropdownJump.classList.add('be-dropdown-item', 'added');
                dropdownJump.textContent = '跳转至BXJ';
                dropdownJump.addEventListener('click', () => {
                    GM_openInTab(`https://www.biliplus.com/video/${BV}`, { active: disabled, insert: false, setParent: true });
                    GM_openInTab(`https://xbeibeix.com/video/${BV}`, { insert: false, setParent: true });
                    GM_openInTab(`https://www.jijidown.com/video/${BV}`, { insert: false, setParent: true });
                });
                ul.appendChild(dropdownJump);

                if (!disabled) {
                    const dropdownCover = document.createElement('li');
                    dropdownCover.classList.add('be-dropdown-item', 'added');
                    dropdownCover.textContent = '封面原图';
                    dropdownCover.addEventListener('click', () => {
                        GM_openInTab(`https://${li.querySelector('img').getAttribute('src').match(getCoverFromURLRegex)[1]}`, { active: true, insert: true, setParent: true });
                    });
                    ul.appendChild(dropdownCover);
                }
            }
        }
    }

    function addMessage(newFreshSpace) {
        const p = document.createElement('p');
        p.innerHTML = '<a href="https://greasyfork.org/scripts/506785" target="_blank" style="text-decoration-line: underline;">哔哩哔哩(B站|Bilibili)收藏夹Fix (跳转第三方网站)</a> 的功能' +
            '已经整合进 <a href="https://greasyfork.org/scripts/521668" target="_blank" style="text-decoration-line: underline;">哔哩哔哩(B站|Bilibili)收藏夹Fix (备份视频信息)</a>。';
        p.style.padding = newFreshSpace ? '2px 0' : '2px';
        p.style.fontSize = newFreshSpace ? '13px' : '12px';
        p.style.lineHeight = '1.5';
        document.querySelector(newFreshSpace ? 'div.favlist-aside' : 'div.fav-sidenav').appendChild(p);
    }
})();