// ==UserScript==
// @name         Skribbl Theme Switcher
// @version      1.0.1
// @description  Enables skribbl.io theme switching with a clean, modern GUI.
// @author       alluding
// @match        https://skribbl.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/1325279
// @downloadURL https://update.greasyfork.org/scripts/501613/Skribbl%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/501613/Skribbl%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ThemeSwitcher {
        constructor() {
            this.themes = {
                base: {
                    background: '#ffffff',
                    color: '#000000',
                },
                dark: {
                    background: '#1e1e1e',
                    color: '#cfcfcf',
                },
            };
            this.currentTheme = localStorage.getItem('theme') || 'base';
            this.init();
        }

        init() {
            this.createUI();
            this.applyTheme();
            this.addEventListeners();
        }

        createUI() {
            this.panel = document.createElement('div');
            this.panel.className = 'theme-switcher-panel';
            this.panel.innerHTML = `
                <div class="theme-switcher-header">
                    <span>Theme Switcher</span>
                    <button class="close-btn">✖</button>
                </div>
                <div class="theme-switcher-body">
                    ${Object.keys(this.themes).map(theme => `<button class="theme-btn" data-theme="${theme}">${theme}</button>`).join('')}
                </div>
                <div class="theme-switcher-footer">
                    <button class="toggle-btn">Ctrl + M</button>
                </div>
            `;
            document.body.appendChild(this.panel);
            this.panel.style.display = 'none';
            this.addStyle();
        }

        addStyle() {
            const style = document.createElement('style');
            style.textContent = `
                .theme-switcher-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 150px;
                    background: #2c2c2c;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    color: #fff;
                    font-family: Arial, sans-serif;
                    z-index: 9999;
                    user-select: none;
                    overflow: hidden;
                }
                .theme-switcher-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: #1e1e1e;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .theme-switcher-body {
                    display: flex;
                    flex-direction: column;
                    padding: 10px;
                }
                .theme-btn {
                    background: #444;
                    border: none;
                    color: #fff;
                    padding: 10px;
                    margin-bottom: 5px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background 0.3s;
                }
                .theme-btn:hover {
                    background: #555;
                }
                .theme-switcher-footer {
                    text-align: center;
                    padding: 5px;
                    background: #1e1e1e;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                .toggle-btn, .close-btn {
                    background: #555;
                    border: none;
                    color: #fff;
                    padding: 5px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background 0.3s;
                }
                .toggle-btn:hover, .close-btn:hover {
                    background: #666;
                }
            `;
            document.head.appendChild(style);
        }

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
        }

        addEventListeners() {
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentTheme = e.target.dataset.theme;
                    localStorage.setItem('theme', this.currentTheme);
                    this.applyTheme();
                });
            });

            document.querySelector('.close-btn').addEventListener('click', () => {
                this.panel.style.display = 'none';
            });

            document.querySelector('.toggle-btn').addEventListener('click', () => {
                this.panel.style.display = this.panel.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'm') {
                    this.panel.style.display = this.panel.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    }

    new ThemeSwitcher();
})();
