// ==UserScript==
// @name         VanishIt
// @namespace    https://greasyfork.org/en/users/1451802
// @version      2.0
// @description  Make any page element disappear effortlessly using a quick Alt+Right-click.
// @description:de   Lassen Sie jedes Element der Seite mühelos verschwinden – mit einem schnellen Alt+Rechtsklick.
// @description:es   Haz desaparecer cualquier elemento de la página sin esfuerzo con un rápido Alt+Clic derecho.
// @description:fr   Faites disparaître n'importe quel élément de la page en un clin d'œil grâce à un rapide Alt+Clic droit.
// @description:it   Fai sparire qualsiasi elemento della pagina senza sforzo usando un rapido Alt+Clic destro.
// @description:ru   С легкостью заставьте любой элемент страницы исчезнуть с помощью быстрого Alt+правого клика.
// @description:zh-CN   通过快速 Alt+右键操作，让任何页面元素轻松消失。
// @description:zh-TW   透過快速 Alt+右鍵操作，輕鬆讓任何頁面元素消失。
// @description:ja   Alt+右クリックを使って、どんなページ要素も簡単に消し去ります。
// @description:ko   빠른 Alt+우클릭으로 페이지의 모든 요소를 손쉽게 제거합니다.
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @match        *://*/*
// @grant        none
// @icon         https://www.svgrepo.com/show/253495/erase-clean.svg
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      brave
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531535/VanishIt.user.js
// @updateURL https://update.greasyfork.org/scripts/531535/VanishIt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const customMenu = document.createElement('div');
    customMenu.style.position = 'fixed';
    customMenu.style.zIndex = 2147483647;
    customMenu.style.pointerEvents = 'auto';
    customMenu.style.padding = '8px 16px';
    customMenu.style.borderRadius = '8px';
    customMenu.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)';
    customMenu.style.fontFamily = 'Arial, sans-serif';
    customMenu.style.fontSize = '14px';
    customMenu.style.cursor = 'pointer';
    customMenu.style.display = 'none';
    customMenu.style.transition = 'all 0.2s ease';
    customMenu.style.userSelect = 'none';
    customMenu.textContent = 'Destroy';

    function applyTheme() {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (darkMode) {
            customMenu.style.backgroundColor = '#222';
            customMenu.style.color = '#eee';
            customMenu.style.border = '1px solid #555';
            customMenu.addEventListener('mouseover', () => {
                customMenu.style.backgroundColor = '#333';
                customMenu.style.transform = 'scale(1.02)';
            });
            customMenu.addEventListener('mouseout', () => {
                customMenu.style.backgroundColor = '#222';
                customMenu.style.transform = 'scale(1)';
            });
        } else {
            customMenu.style.backgroundColor = '#fff';
            customMenu.style.color = '#000';
            customMenu.style.border = '1px solid #ccc';
            customMenu.addEventListener('mouseover', () => {
                customMenu.style.backgroundColor = '#eee';
                customMenu.style.transform = 'scale(1.02)';
            });
            customMenu.addEventListener('mouseout', () => {
                customMenu.style.backgroundColor = '#fff';
                customMenu.style.transform = 'scale(1)';
            });
        }
    }

    applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    document.documentElement.appendChild(customMenu);
    let targetElement = null;
    function highlightTarget(element) {
        if (!element) return;

        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        element.style.outline = darkMode ? '2px solid #ff6b6b' : '2px solid #e63946';
        element.style.outlineOffset = '2px';
        element.style.transition = 'outline 0.2s ease, opacity 0.3s ease, transform 0.3s ease';
    }

    function removeHighlight(element) {
        if (!element) return;
        element.style.outline = '';
        element.style.outlineOffset = '';
    }

    document.addEventListener('contextmenu', (e) => {
        if (e.altKey) {
            e.preventDefault();
            e.stopPropagation();

            if (targetElement) {
                removeHighlight(targetElement);
            }

            targetElement = e.target;
            highlightTarget(targetElement);
            customMenu.style.top = `${e.clientY}px`;
            customMenu.style.left = `${e.clientX}px`;
            customMenu.style.display = 'block';
            customMenu.style.opacity = '0';
            customMenu.style.transform = 'scale(0.9)';
            setTimeout(() => {
                customMenu.style.opacity = '1';
                customMenu.style.transform = 'scale(1)';
            }, 10);
        } else {
            customMenu.style.display = 'none';
            if (targetElement) {
                removeHighlight(targetElement);
            }
        }
    }, true);

    document.addEventListener('click', () => {
        customMenu.style.opacity = '0';
        customMenu.style.transform = 'scale(0.9)';
        setTimeout(() => {
            customMenu.style.display = 'none';
        }, 200);

        if (targetElement) {
            removeHighlight(targetElement);
        }
    }, true);

    customMenu.addEventListener('click', (e) => {
        if (targetElement && targetElement.parentNode) {
            // Animation de suppression smooth
            targetElement.style.opacity = '0';
            targetElement.style.transform = 'scale(0.8)';

            setTimeout(() => {
                if (targetElement && targetElement.parentNode) {
                    targetElement.parentNode.removeChild(targetElement);
                }
            }, 300);
        }

        customMenu.style.opacity = '0';
        customMenu.style.transform = 'scale(0.9)';
        setTimeout(() => {
            customMenu.style.display = 'none';
        }, 200);

        e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            customMenu.style.opacity = '0';
            customMenu.style.transform = 'scale(0.9)';
            setTimeout(() => {
                customMenu.style.display = 'none';
            }, 200);

            if (targetElement) {
                removeHighlight(targetElement);
            }
        }
    }, true);
})();
