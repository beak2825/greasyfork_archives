// ==UserScript==
// @name         WME Resaltador de Comentario
// @namespace    https://greasyfork.org/es/users/1362250-gwm
// @version      1.1
// @description  Resalta áreas y puntos en Waze Map Editor con colores personalizados
// @author       GWM_
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/529839/WME%20Resaltador%20de%20Comentario.user.js
// @updateURL https://update.greasyfork.org/scripts/529839/WME%20Resaltador%20de%20Comentario.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const scriptId = "wme-comment-highlighter";

    async function loadReact() {
        if (!window.React || !window.ReactDOM) {
            const react = document.createElement('script');
            react.src = 'https://unpkg.com/react@18/umd/react.development.js';
            document.head.appendChild(react);

            const reactDom = document.createElement('script');
            reactDom.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
            document.head.appendChild(reactDom);

            await new Promise(resolve => reactDom.onload = resolve);
        }
    }

    async function waitForW() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (window.W && W.userscripts?.registerSidebarTab) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    await loadReact();
    await waitForW();

    const { createElement, useState, useEffect } = React;
    const { createRoot } = ReactDOM;

    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(scriptId);
    tabLabel.innerText = 'RC 💬';
    tabLabel.title = 'Resaltador de Comentarios';

    function App() {
        const [color, setColor] = useState(localStorage.getItem('wazeHighlightColor') || '#ff0000');
        const [enabled, setEnabled] = useState(localStorage.getItem('wazeHighlightCheckboxState') === 'true');

        useEffect(() => {
            localStorage.setItem('wazeHighlightColor', color);
        }, [color]);

        useEffect(() => {
            localStorage.setItem('wazeHighlightCheckboxState', enabled);
            if (enabled) {
                highlightArea();
                const interval = setInterval(highlightArea, 1000);
                return () => clearInterval(interval);
            } else {
                disableHighlight();
            }
        }, [enabled, color]);

        useEffect(() => {
            const observer = new MutationObserver(() => {
                if (enabled) highlightArea();
            });
            const mapContainer = document.querySelector('div[role="main"]');
            if (mapContainer) {
                observer.observe(mapContainer, { childList: true, subtree: true });
            }
            return () => observer.disconnect();
        }, [enabled]);

        function highlightArea() {
            const paths = document.querySelectorAll('path');
            const circles = document.querySelectorAll('circle');

            paths.forEach(path => {
                if (path.getAttribute('fill-opacity') === '0.3' && path.getAttribute('stroke-dasharray') === '8,8') {
                    path.setAttribute('fill', color);
                    path.setAttribute('stroke', color);
                }
            });

            circles.forEach(circle => {
                if (
                    circle.getAttribute('fill-opacity') === '1' &&
                    circle.getAttribute('stroke-dasharray') === 'none' &&
                    !circle.querySelector('image')
                ) {
                    circle.setAttribute('fill', color);
                    circle.setAttribute('stroke', color);
                }
            });
        }

        function disableHighlight() {
            const paths = document.querySelectorAll('path');
            const circles = document.querySelectorAll('circle');

            paths.forEach(path => {
                if (path.getAttribute('fill-opacity') === '0.3' && path.getAttribute('stroke-dasharray') === '8,8') {
                    path.setAttribute('fill', '#00ece3');
                    path.setAttribute('stroke', '#00ece3');
                }
            });

            circles.forEach(circle => {
                if (
                    circle.getAttribute('fill-opacity') === '1' &&
                    circle.getAttribute('stroke-dasharray') === 'none' &&
                    !circle.querySelector('image')
                ) {
                    circle.setAttribute('fill', '#ffffff');
                    circle.setAttribute('stroke', '#ffffff');
                }
            });
        }

        return createElement('div', { style: { padding: 'auto' } },
            createElement('p', { style: { margin: '0 0 8px 0', fontWeight: 'bold' } }, 'INSTRUCCIONES:'),
            createElement('p', { style: { margin: '0 0 5px 0' } }, '1. Elige un color con el selector'),
            createElement('p', { style: { margin: '0 0 5px 0' } }, '2. Activa el resaltado con el checkbox'),
            createElement('p', { style: { margin: '0' } }, '3. Las áreas y puntos se resaltarán automáticamente'),
            createElement('br'),
            createElement('label', { htmlFor: 'colorPicker' }, 'Elige un color:'),
            createElement('br'),
            createElement('input', {
                type: 'color',
                id: 'colorPicker',
                value: color,
                onChange: e => setColor(e.target.value)
            }),
            createElement('br'),
            createElement('br'),
            createElement('label', null,
                createElement('input', {
                    type: 'checkbox',
                    checked: enabled,
                    onChange: e => setEnabled(e.target.checked)
                }),
                ' Resaltar Comentario'
            )
        );
    }

    await W.userscripts.waitForElementConnected(tabPane);
    const root = ReactDOM.createRoot(tabPane);
    root.render(React.createElement(App));
})();