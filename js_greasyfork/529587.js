// ==UserScript==
// @name         豆瓣首页悬浮导航
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  豆瓣首页悬浮导航，面板在右侧上方显示且会显示当前位置
// @author       dfnfbf
// @match        *://www.douban.com/*
// @grant        none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/529587/%E8%B1%86%E7%93%A3%E9%A6%96%E9%A1%B5%E6%82%AC%E6%B5%AE%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/529587/%E8%B1%86%E7%93%A3%E9%A6%96%E9%A1%B5%E6%82%AC%E6%B5%AE%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    const navContainer = document.createElement('div');
    navContainer.id = 'custom-floating-nav';
    navContainer.style.position = 'fixed';
    navContainer.style.top = '25%';
    navContainer.style.right = '5%';
    navContainer.style.transform = 'translateY(-50%)';
    navContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    navContainer.style.padding = '10px';
    navContainer.style.borderRadius = '5px 0 0 5px';
    navContainer.style.zIndex = '9999';

    const aElements = document.querySelectorAll('h2.section-title > a');
    const navItems = [];

    Array.from(aElements).forEach((a, index) => {
        let id = a.id;
        if (!id) {
            id = `section-title-a-${index}`;
            a.id = id;
        }

        const linkElement = document.createElement('a');
        linkElement.href = `#${id}`;
        linkElement.textContent = a.textContent;
        linkElement.style.display = 'block';
        linkElement.style.marginBottom = '5px';
        linkElement.style.textDecoration = 'none';
        linkElement.style.color = '#000';
        linkElement.style.fontWeight = 'bold';
        linkElement.style.padding = '5px';
        linkElement.style.borderRadius = '5px';

        linkElement.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });

        navItems.push({ element: linkElement, a: a });

        navContainer.appendChild(linkElement);
    });

    
    document.body.appendChild(navContainer);

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        navItems.forEach(({ element, a }) => {
            const rect = a.getBoundingClientRect();
            const elementTop = rect.top + currentScrollTop;
            const elementBottom = elementTop + rect.height;

            if (currentScrollTop >= elementTop - 100 && currentScrollTop < elementBottom) {
                element.style.backgroundColor = '#ff9900';
                element.style.color = '#fff';
            } else {
                element.style.backgroundColor = '';
                element.style.color = '#000';
            }
        });
    });

})();