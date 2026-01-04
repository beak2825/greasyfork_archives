// ==UserScript==
// @name         Convert Comick Sidebar to Rows
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Converts sidebar sections to rows.
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543968/Convert%20Comick%20Sidebar%20to%20Rows.user.js
// @updateURL https://update.greasyfork.org/scripts/543968/Convert%20Comick%20Sidebar%20to%20Rows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectGlobalCss() {
        const styleId = 'comick-sidebar-fix';
        if (document.getElementById(styleId)) return;

        const css = `
            body > #__next > div > div.float-right {
                display: none !important;
            }
            main[id="main"].md\\:w-8\\/12 {
                width: 100% !important;
                max-width: none !important;
                float: none !important;
            }
            main[id="main"] > div {
                width: 100% !important;
                max-width: none !important;
            }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    async function convertSidebarContent() {
        const mainElement = document.querySelector('main[id="main"]');
        const sidebarDiv = document.querySelector('div.float-right.w-4\\/12.xl\\:w-3\\/12');
        if (!mainElement || !sidebarDiv) return;

        const animeSection = findAnimeSectionContainer();
        if (!animeSection) return;

        const seeMoreButtons = Array.from(sidebarDiv.querySelectorAll('div')).filter(div => {
            const textElement = div.querySelector('.flex-grow.font-semibold');
            return textElement && textElement.textContent.trim() === 'See More' && !div.closest('a[href]');
        });

        seeMoreButtons.forEach(button => button.click());
        await new Promise(resolve => setTimeout(resolve, 500));

        let convertedSections = [];
        const sidebarSections = sidebarDiv.querySelectorAll('#ranking');
        for (let sectionIndex = 0; sectionIndex < sidebarSections.length; sectionIndex++) {
            const section = sidebarSections[sectionIndex];
            const header = section.querySelector('.flex.items-center.justify-between');
            const content = section.querySelector('.space-y-2.pb-5.mt-4');
            if (!header || !content) continue;

            const titleElements = header.querySelectorAll('h2');
            if (titleElements.length > 1) {
                const recentlyAddedItems = content.querySelectorAll('a[href^="/comic/"]:not(.hidden)');
                if (recentlyAddedItems.length > 0) {
                    convertedSections.push(createRowSection('Recently Added', recentlyAddedItems, convertedSections.length, false, '/search'));
                }

                const completeSeriesButton = Array.from(titleElements).find(el => el.textContent.trim() === 'Complete Series');
                if (completeSeriesButton) {
                    completeSeriesButton.click();
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const completeSeriesItems = content.querySelectorAll('a[href^="/comic/"]:not(.hidden)');
                    if (completeSeriesItems.length > 0) {
                        convertedSections.push(createRowSection('Complete Series', completeSeriesItems, convertedSections.length, false, '/search?status=2'));
                    }
                    const recentlyAddedButton = Array.from(titleElements).find(el => el.textContent.trim() === 'Recently Added');
                    if (recentlyAddedButton) recentlyAddedButton.click();
                }
            }
        }

        if (convertedSections.length === 0) return;

        let insertAfter = animeSection;
        convertedSections.forEach(section => {
            insertAfter.insertAdjacentElement('afterend', section);
            insertAfter = section;
        });
        sidebarDiv.remove();
    }

    function findAnimeSectionContainer() {
        const animeHeaders = Array.from(document.querySelectorAll('h2')).filter(h2 => h2.textContent.trim() === 'Adapted to Anime');
        if (animeHeaders.length === 0) return null;
        let container = animeHeaders[0];
        while (container && container.parentElement) {
            if (container.classList.contains('mt-3') || container.parentElement === document.querySelector('main[id="main"]')) break;
            container = container.parentElement;
        }
        return container;
    }

    function createRowSection(title, items, sectionIndex, includeRankings = false, viewAllUrl = '/search') {
        const section = document.createElement('div');
        section.className = 'mt-8';
        section.setAttribute('data-section-title', title);
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center flex-nowrap mb-4 md:mb-6';
        const headerLeft = document.createElement('div');
        headerLeft.className = 'flex items-center';
        const titleElement = document.createElement('h2');
        const gradients = [{ light: 'rgb(209, 138, 255)', dark: 'rgb(128, 45, 217)' }, { light: 'rgb(146, 195, 255)', dark: 'rgb(56, 125, 220)' }, { light: 'rgb(74, 227, 134)', dark: 'rgb(14, 157, 64)' }, { light: 'rgb(253, 186, 100)', dark: 'rgb(221, 116, 30)' }];
        const gradient = gradients[sectionIndex % gradients.length];
        titleElement.className = 'md:font-bold line-clamp-1';
        titleElement.textContent = title;
        titleElement.style.background = `linear-gradient(to right, ${gradient.light}, ${gradient.dark})`;
        titleElement.style.webkitBackgroundClip = 'text';
        titleElement.style.backgroundClip = 'text';
        titleElement.style.color = 'transparent';
        headerLeft.appendChild(titleElement);
        const headerRight = document.createElement('div');
        headerRight.className = 'flex items-center';
        const viewAllLink = document.createElement('a');
        viewAllLink.href = viewAllUrl;
        viewAllLink.className = 'hover:cursor-pointer rounded-full text-xs mr-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:underline';
        viewAllLink.textContent = 'View all';
        headerRight.appendChild(viewAllLink);
        headerRight.appendChild(createMenuContainer(section, title));
        header.appendChild(headerLeft);
        header.appendChild(headerRight);
        section.appendChild(header);
        section.appendChild(createSectionContent(items, includeRankings));
        return section;
    }

    function createMenuContainer(section, title) {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'hover:cursor-pointer rounded-full';
        const menuButton = document.createElement('div');
        menuButton.className = 'relative inline-block text-left top-0.5';
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-haspopup', 'menu');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-gray-500 hover:dark:text-gray-400 hover:text-gray-600 z-10 stroke-2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"></path></svg>`;
        const menu = document.createElement('div');
        menu.className = 'absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-750 dark:text-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none shadow-gray-500 dark:shadow-gray-900 hidden';
        menu.innerHTML = `<div role="none"><span class="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">Minimize</span></div>`;
        let menuOpen = false;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            menuOpen = !menuOpen;
            menu.classList.toggle('hidden', !menuOpen);
            button.setAttribute('aria-expanded', menuOpen.toString());
        });
        document.addEventListener('click', () => {
            if (menuOpen) {
                menu.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
                menuOpen = false;
            }
        });
        menu.querySelector('span[role="menuitem"]').addEventListener('click', () => {
            minimizeSection(section, title);
            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            menuOpen = false;
        });
        menuButton.appendChild(button);
        menuButton.appendChild(menu);
        menuContainer.appendChild(menuButton);
        return menuContainer;
    }

    function createSectionContent(items, includeRankings) {
        const navigationWrapper = document.createElement('div');
        navigationWrapper.className = 'navigation-wrapper relative';
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'flex overflow-x-scroll hide-scroll-bar h-32 md:h-36 lg:h-48 xl:h-56';
        const innerContainer = document.createElement('div');
        innerContainer.style.width = `${Math.min(items.length * 184, 18400)}px`;
        innerContainer.style.height = '100%';
        innerContainer.style.position = 'relative';
        Array.from(items).slice(0, 100).forEach((item, itemIndex) => {
            innerContainer.appendChild(createHorizontalCard(item, itemIndex, includeRankings));
        });
        scrollContainer.appendChild(innerContainer);
        const leftArrow = document.createElement('div');
        leftArrow.className = 'absolute top-0 left-0 z-10 bg-opacity-80 h-full w-8 lg:w-10 xl:w-14 rounded arrow arrow--left select-none dark:hover:bg-gray-500/30 hover:bg-gray-100/30 bg-opacity-60 cursor-pointer hidden';
        leftArrow.innerHTML = `<div class="top-1/2 -translate-y-1/2 absolute left-1 dark:bg-gray-600 bg-white dark:hover:bg-gray-500 hover:bg-gray-100 rounded-full p-2 md:p-3 flex items-center opacity-80"><svg class=" w-3 h-3 lg:w-4 lg:h-4 fill-current text-gray-500 dark:text-gray-200 bg-opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"></path></svg></div>`;
        const rightArrow = document.createElement('div');
        rightArrow.className = 'absolute top-0 right-0 z-10 bg-opacity-80 h-full w-8 lg:w-10 xl:w-14 rounded arrow select-none arrow--right dark:hover:bg-gray-500/30 hover:bg-gray-100/30 bg-opacity-60 cursor-pointer';
        rightArrow.innerHTML = `<div class="top-1/2 -translate-y-1/2 absolute right-1 dark:bg-gray-600 bg-white dark:hover:bg-gray-500 hover:bg-gray-100 rounded-full flex items-center opacity-80 p-2 md:p-3"><svg class="w-3 h-3 lg:w-4 lg:h-4 fill-current text-gray-500 dark:text-gray-200 hover:brightness-125 bg-opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"></path></svg></div>`;
        leftArrow.addEventListener('click', () => scrollContainer.scrollBy({ left: -920, behavior: 'smooth' }));
        rightArrow.addEventListener('click', () => scrollContainer.scrollBy({ left: 920, behavior: 'smooth' }));
        scrollContainer.addEventListener('scroll', () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
            leftArrow.classList.toggle('hidden', scrollLeft <= 0);
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;
            rightArrow.style.opacity = atEnd ? '0.5' : '1';
            rightArrow.style.pointerEvents = atEnd ? 'none' : 'auto';
        });
        navigationWrapper.appendChild(scrollContainer);
        navigationWrapper.appendChild(leftArrow);
        navigationWrapper.appendChild(rightArrow);
        return navigationWrapper;
    }

    function minimizeSection(section, title) {
        const content = section.querySelector('.navigation-wrapper');
        const header = section.querySelector('.flex.justify-between');
        if (!content || !header) return;
        content.style.display = 'none';
        header.style.display = 'none';
        const minimizedView = document.createElement('div');
        minimizedView.className = 'relative mb-4';
        minimizedView.innerHTML = `<div class="absolute inset-0 flex items-center" aria-hidden="true"><div class="w-full border-t border-gray-300 dark:border-gray-600"></div></div><div class="relative flex justify-center"><button type="button" class="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:bg-gray-700"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"><path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"></path></svg>${title}</button></div>`;
        minimizedView.querySelector('button').addEventListener('click', () => {
            content.style.display = '';
            header.style.display = '';
            minimizedView.remove();
        });
        section.appendChild(minimizedView);
    }

    function createHorizontalCard(originalItem, index, includeRankings = false) {
        const card = document.createElement('div');
        card.className = 'w-24 h-32 md:w-28 md:h-36 lg:w-36 lg:h-48 xl:w-44 xl:h-56 overflow-hidden';
        card.style.cssText = `position: absolute; top: 0px; left: 0px; height: 100%; width: 184px; transform: translateX(${index * 184}px);`;
        const link = document.createElement('a');
        link.href = originalItem.href;
        link.title = originalItem.title || '';
        link.style.overflow = 'visible';
        const cardInner = document.createElement('div');
        cardInner.className = 'relative w-24 h-32 md:w-28 md:h-36 lg:w-36 lg:h-48 xl:w-44 xl:h-56 overflow-hidden';
        const originalImg = originalItem.querySelector('img');
        if (originalImg) {
            const img = originalImg.cloneNode(true);
            img.className = 'select-none rounded object-cover object-top w-24 md:w-28 lg:w-36 xl:w-44 h-32 md:h-36 lg:h-48 xl:h-56 active:brightness-75';
            cardInner.appendChild(img);
        }
        const titleText = originalItem.querySelector('.text-ellipsis')?.textContent?.trim() || link.title;
        if (titleText) {
            const overlay = document.createElement('div');
            overlay.className = 'h-12 bottom-0 absolute overlay font-semibold text-gray-200 w-full text-xs md:text-xs lg:text-sm px-1 md:px-2 pt-5 text-center truncate';
            overlay.textContent = titleText;
            cardInner.appendChild(overlay);
        }
        if (includeRankings) {
            const ranking = document.createElement('div');
            const rankingColors = ['bg-red-500/90', 'bg-orange-500/90', 'bg-yellow-500/90'];
            ranking.className = `absolute top-0 left-0 flex items-center justify-center text-xl md:text-2xl font-semibold z-10 text-white w-6 h-6 md:w-8 md:h-8 rounded-tl rounded-br ${index < 3 ? rankingColors[index] : 'bg-gray-500/90'}`;
            ranking.textContent = (index + 1).toString();
            cardInner.appendChild(ranking);
        }
        link.appendChild(cardInner);
        card.appendChild(link);
        return card;
    }

    let isRunning = false;
    async function runConversion() {
        if (isRunning || document.querySelector('[data-section-title]')) {
            return;
        }
        isRunning = true;

        try {
            const sidebar = document.querySelector('div.float-right.w-4\\/12.xl\\:w-3\\/12');
            if (sidebar) {
                await convertSidebarContent();
            }
        } finally {
            isRunning = false;
        }
    }

    const handlePageChange = () => {
        injectGlobalCss();
        runConversion();
    };

    const observer = new MutationObserver(handlePageChange);

    handlePageChange();

    observer.observe(document.body, { childList: true, subtree: true });

})();