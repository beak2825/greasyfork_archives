// ==UserScript==
// @name         GitHub Commit Labels
// @namespace    https://github.com/nazdridoy
// @version      1.6.2
// @description  Enhances GitHub commits with beautiful labels for conventional commit types (feat, fix, docs, etc.)
// @author       nazdridoy
// @license      MIT
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @homepageURL  https://github.com/nazdridoy/github-commit-labels
// @supportURL   https://github.com/nazdridoy/github-commit-labels/issues
// @downloadURL https://update.greasyfork.org/scripts/526153/GitHub%20Commit%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/526153/GitHub%20Commit%20Labels.meta.js
// ==/UserScript==

/* 
MIT License

Copyright (c) 2025 nazDridoy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Detect GitHub theme (dark, light, or dark dimmed)
    function detectTheme() {
        const html = document.documentElement;
        const colorMode = html.getAttribute('data-color-mode');
        
        // Handle sync with system (auto) setting
        if (colorMode === 'auto') {
            // Get the system preference
            const darkThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            const isDarkMode = darkThemeMedia.matches;
            
            if (isDarkMode) {
                // System is in dark mode, but we need to check what's set for "Night theme"
                const darkThemeSetting = html.getAttribute('data-dark-theme');
                
                // If a light theme variant is set for "Night theme"
                if (darkThemeSetting && darkThemeSetting.startsWith('light')) {
                    return darkThemeSetting; // Return the specific light theme variant
                }
                
                // Otherwise return the dark theme variant
                return darkThemeSetting === 'dark_dimmed' ? 'dark_dimmed' : 'dark';
            } else {
                // System is in light mode, check what's set for "Day theme"
                const lightThemeSetting = html.getAttribute('data-light-theme');
                
                // If a dark theme variant is set for "Day theme"
                if (lightThemeSetting && lightThemeSetting.startsWith('dark')) {
                    return lightThemeSetting; // Return the specific dark theme variant
                }
                
                return 'light'; // Default to light theme
            }
        }
        
        // Direct theme setting (not auto)
        if (colorMode === 'dark') {
            const darkTheme = html.getAttribute('data-dark-theme');
            return darkTheme === 'dark_dimmed' ? 'dark_dimmed' : 'dark';
        } else {
            const lightTheme = html.getAttribute('data-light-theme');
            // If a specific light theme variant is set
            if (lightTheme && lightTheme !== 'light') {
                return lightTheme;
            }
            return 'light';
        }
    }

    // Helper function to determine if a theme is a dark variant
    function isDarkTheme(theme) {
        return theme && (theme === 'dark' || theme === 'dark_dimmed' || 
               theme === 'dark_high_contrast' || theme === 'dark_colorblind' || 
               theme === 'dark_tritanopia');
    }

    // Get current theme
    let currentTheme = detectTheme();
    
    // Watch for system color scheme changes
    const darkThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    darkThemeMedia.addEventListener('change', () => {
        if (document.documentElement.getAttribute('data-color-mode') === 'auto') {
            updateThemeColors();
        }
    });
    
    // Color definitions based on theme
    const THEME_COLORS = {
        light: {
            'green': { bg: 'rgba(35, 134, 54, 0.1)', text: '#1a7f37' },
            'purple': { bg: 'rgba(163, 113, 247, 0.1)', text: '#8250df' },
            'blue': { bg: 'rgba(47, 129, 247, 0.1)', text: '#0969da' },
            'light-blue': { bg: 'rgba(31, 111, 235, 0.1)', text: '#0550ae' },
            'yellow': { bg: 'rgba(210, 153, 34, 0.1)', text: '#9e6a03' },
            'orange': { bg: 'rgba(219, 109, 40, 0.1)', text: '#bc4c00' },
            'gray': { bg: 'rgba(139, 148, 158, 0.1)', text: '#57606a' },
            'light-green': { bg: 'rgba(57, 211, 83, 0.1)', text: '#1a7f37' },
            'red': { bg: 'rgba(248, 81, 73, 0.1)', text: '#cf222e' },
            'dark-yellow': { bg: 'rgba(187, 128, 9, 0.1)', text: '#9e6a03' }
        },
        dark: {
            'green': { bg: 'rgba(35, 134, 54, 0.2)', text: '#7ee787' },
            'purple': { bg: 'rgba(163, 113, 247, 0.2)', text: '#d2a8ff' },
            'blue': { bg: 'rgba(47, 129, 247, 0.2)', text: '#79c0ff' },
            'light-blue': { bg: 'rgba(31, 111, 235, 0.2)', text: '#58a6ff' },
            'yellow': { bg: 'rgba(210, 153, 34, 0.2)', text: '#e3b341' },
            'orange': { bg: 'rgba(219, 109, 40, 0.2)', text: '#ffa657' },
            'gray': { bg: 'rgba(139, 148, 158, 0.2)', text: '#8b949e' },
            'light-green': { bg: 'rgba(57, 211, 83, 0.2)', text: '#56d364' },
            'red': { bg: 'rgba(248, 81, 73, 0.2)', text: '#ff7b72' },
            'dark-yellow': { bg: 'rgba(187, 128, 9, 0.2)', text: '#bb8009' }
        },
        dark_dimmed: {
            'green': { bg: 'rgba(35, 134, 54, 0.15)', text: '#6bc46d' },
            'purple': { bg: 'rgba(163, 113, 247, 0.15)', text: '#c297ff' },
            'blue': { bg: 'rgba(47, 129, 247, 0.15)', text: '#6cb6ff' },
            'light-blue': { bg: 'rgba(31, 111, 235, 0.15)', text: '#539bf5' },
            'yellow': { bg: 'rgba(210, 153, 34, 0.15)', text: '#daaa3f' },
            'orange': { bg: 'rgba(219, 109, 40, 0.15)', text: '#f0883e' },
            'gray': { bg: 'rgba(139, 148, 158, 0.15)', text: '#909dab' },
            'light-green': { bg: 'rgba(57, 211, 83, 0.15)', text: '#6bc46d' },
            'red': { bg: 'rgba(248, 81, 73, 0.15)', text: '#e5534b' },
            'dark-yellow': { bg: 'rgba(187, 128, 9, 0.15)', text: '#daaa3f' }
        }
    };

    // Get colors for current theme
    let COLORS = THEME_COLORS[currentTheme];

    // Define default configuration
    const DEFAULT_CONFIG = {
        removePrefix: true,
        enableTooltips: true,
        labelsVisible: true,
        showScope: false,
        debugMode: false,  // Add debug mode setting
        labelStyle: {
            fontSize: '14px',
            fontWeight: '500',
            height: '24px',
            padding: '0 10px',
            marginRight: '8px',
            borderRadius: '20px',
            minWidth: 'auto',
            textAlign: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(240, 246, 252, 0.1)', // Subtle border
            color: '#ffffff'
        },
        commitTypes: {
            // Features
            feat: { emoji: '✨', label: 'Feature', color: 'green', description: 'New user features (not for new files without user features)' },
            feature: { emoji: '✨', label: 'Feature', color: 'green', description: 'New user features (not for new files without user features)' },

            // Added
            added: { emoji: '📝', label: 'Added', color: 'green', description: 'New files/resources with no user-facing features' },
            add: { emoji: '📝', label: 'Added', color: 'green', description: 'New files/resources with no user-facing features' },

            // Updated
            update: { emoji: '♻️', label: 'Updated', color: 'blue', description: 'Changes to existing functionality' },
            updated: { emoji: '♻️', label: 'Updated', color: 'blue', description: 'Changes to existing functionality' },

            // Removed
            removed: { emoji: '🗑️', label: 'Removed', color: 'red', description: 'Removing files/code' },
            remove: { emoji: '🗑️', label: 'Removed', color: 'red', description: 'Removing files/code' },
            delete: { emoji: '🗑️', label: 'Removed', color: 'red', description: 'Removing files/code' },
            del: { emoji: '🗑️', label: 'Removed', color: 'red', description: 'Removing files/code' },

            // Fixes
            fix: { emoji: '🐛', label: 'Fix', color: 'purple', description: 'Bug fixes/corrections to errors' },
            bugfix: { emoji: '🐛', label: 'Fix', color: 'purple', description: 'Bug fixes/corrections to errors' },
            fixed: { emoji: '🐛', label: 'Fix', color: 'purple', description: 'Bug fixes/corrections to errors' },
            hotfix: { emoji: '🚨', label: 'Hot Fix', color: 'red', description: 'Critical bug fixes requiring immediate attention' },

            // Documentation
            docs: { emoji: '📚', label: 'Docs', color: 'blue', description: 'Documentation only changes' },
            doc: { emoji: '📚', label: 'Docs', color: 'blue', description: 'Documentation only changes' },
            documentation: { emoji: '📚', label: 'Docs', color: 'blue', description: 'Documentation only changes' },

            // Styling
            style: { emoji: '💎', label: 'Style', color: 'light-green', description: 'Formatting/whitespace changes (no code change)' },
            ui: { emoji: '🎨', label: 'UI', color: 'light-green', description: 'User interface changes' },
            css: { emoji: '💎', label: 'Style', color: 'light-green', description: 'CSS/styling changes' },

            // Code Changes
            refactor: { emoji: '📦', label: 'Refactor', color: 'light-blue', description: 'Restructured code (no behavior change)' },
            perf: { emoji: '🚀', label: 'Performance', color: 'purple', description: 'Performance improvements' },
            performance: { emoji: '🚀', label: 'Performance', color: 'purple', description: 'Performance improvements' },
            optimize: { emoji: '⚡', label: 'Optimize', color: 'purple', description: 'Code optimization without functional changes' },

            // Testing
            test: { emoji: '🧪', label: 'Test', color: 'yellow', description: 'Test-related changes' },
            tests: { emoji: '🧪', label: 'Test', color: 'yellow', description: 'Test-related changes' },
            testing: { emoji: '🧪', label: 'Test', color: 'yellow', description: 'Test-related changes' },

            // Build & Deploy
            build: { emoji: '🛠', label: 'Build', color: 'orange', description: 'Build system changes' },
            ci: { emoji: '⚙️', label: 'CI', color: 'gray', description: 'CI pipeline changes' },
            cd: { emoji: '🚀', label: 'CD', color: 'gray', description: 'Continuous deployment changes' },
            deploy: { emoji: '📦', label: 'Deploy', color: 'orange', description: 'Deployment related changes' },
            release: { emoji: '🚀', label: 'Deploy', color: 'orange', description: 'Production releases' },

            // Maintenance
            chore: { emoji: '♻️', label: 'Chore', color: 'light-green', description: 'Routine maintenance tasks' },
            deps: { emoji: '📦', label: 'Dependencies', color: 'light-green', description: 'Dependency updates or changes' },
            dep: { emoji: '📦', label: 'Dependencies', color: 'light-green', description: 'Dependency updates or changes' },
            dependencies: { emoji: '📦', label: 'Dependencies', color: 'light-green', description: 'Dependency updates or changes' },
            revert: { emoji: '🗑', label: 'Revert', color: 'red', description: 'Reverting previous changes' },
            wip: { emoji: '🚧', label: 'WIP', color: 'dark-yellow', description: 'Work in progress' },

            // Security
            security: { emoji: '🔒', label: 'Security', color: 'red', description: 'Security-related changes' },
            
            // Internationalization
            i18n: { emoji: '🌐', label: 'i18n', color: 'blue', description: 'Internationalization and localization' },
            
            // Accessibility
            a11y: { emoji: '♿', label: 'Accessibility', color: 'purple', description: 'Accessibility improvements' },
            
            // API changes
            api: { emoji: '🔌', label: 'API', color: 'light-blue', description: 'API-related changes' },
            
            // Database changes
            data: { emoji: '🗃️', label: 'Database', color: 'orange', description: 'Database schema or data changes' },
            
            // Configuration changes
            config: { emoji: '⚙️', label: 'Config', color: 'gray', description: 'Configuration changes' },
            
            // Initial setup
            init: { emoji: '🎬', label: 'Init', color: 'green', description: 'Initial commit/project setup' }
        }
    };

    // Get saved configuration or use default
    const USER_CONFIG = GM_getValue('commitLabelsConfig', DEFAULT_CONFIG);
    
    // Ensure backward compatibility with older versions
    if (USER_CONFIG.enableTooltips === undefined) {
        USER_CONFIG.enableTooltips = true;
        GM_setValue('commitLabelsConfig', USER_CONFIG);
    }
    
    // Ensure labelsVisible exists in config (for backward compatibility)
    if (USER_CONFIG.labelsVisible === undefined) {
        USER_CONFIG.labelsVisible = true;
        GM_setValue('commitLabelsConfig', USER_CONFIG);
    }
    
    // Make sure all commit types have descriptions (for backward compatibility)
    let configUpdated = false;
    Object.entries(USER_CONFIG.commitTypes).forEach(([type, config]) => {
        if (!config.description && DEFAULT_CONFIG.commitTypes[type]) {
            USER_CONFIG.commitTypes[type].description = DEFAULT_CONFIG.commitTypes[type].description;
            configUpdated = true;
        }
    });
    if (configUpdated) {
        GM_setValue('commitLabelsConfig', USER_CONFIG);
    }

    // Create floating toggle button for labels
    function createLabelToggle() {
        // Only create if we're on a commit page
        if (!isCommitPage()) return;
        
        // Check if toggle already exists
        if (document.getElementById('commit-labels-toggle')) return;
        
        // Create a container for both buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'commit-labels-buttons';
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 8px;
            z-index: 9999;
        `;
        
        // Label toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'commit-labels-toggle';
        toggleBtn.textContent = USER_CONFIG.labelsVisible ? '🏷️' : '🏷️';
        toggleBtn.title = USER_CONFIG.labelsVisible ? 'Hide commit labels' : 'Show commit labels';
        toggleBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background: rgba(31, 35, 40, 0.6);
            color: #adbac7;
            border: 1px solid rgba(205, 217, 229, 0.1);
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            opacity: 0.5;
            transition: opacity 0.2s, transform 0.2s, background-color 0.2s;
            backdrop-filter: blur(4px);
        `;
        
        // Config toggle button
        const configBtn = document.createElement('button');
        configBtn.id = 'commit-labels-config-toggle';
        configBtn.textContent = '⚙️';
        configBtn.title = 'Open configuration';
        configBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background: rgba(31, 35, 40, 0.6);
            color: #adbac7;
            border: 1px solid rgba(205, 217, 229, 0.1);
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            opacity: 0.5;
            transition: opacity 0.2s, transform 0.2s, background-color 0.2s;
            backdrop-filter: blur(4px);
        `;
        
        // Add hover effect for label toggle
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.opacity = '1';
            toggleBtn.style.background = currentTheme === 'light' ? 
                'rgba(246, 248, 250, 0.8)' : 'rgba(22, 27, 34, 0.8)';
            toggleBtn.style.color = currentTheme === 'light' ? '#24292f' : '#e6edf3';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.opacity = '0.5';
            toggleBtn.style.background = 'rgba(31, 35, 40, 0.6)';
            toggleBtn.style.color = '#adbac7';
        });
        
        // Add hover effect for config button
        configBtn.addEventListener('mouseenter', () => {
            configBtn.style.opacity = '1';
            configBtn.style.background = currentTheme === 'light' ? 
                'rgba(246, 248, 250, 0.8)' : 'rgba(22, 27, 34, 0.8)';
            configBtn.style.color = currentTheme === 'light' ? '#24292f' : '#e6edf3';
        });
        
        configBtn.addEventListener('mouseleave', () => {
            configBtn.style.opacity = '0.5';
            configBtn.style.background = 'rgba(31, 35, 40, 0.6)';
            configBtn.style.color = '#adbac7';
        });
        
        // Toggle labels on click
        toggleBtn.addEventListener('click', () => {
            USER_CONFIG.labelsVisible = !USER_CONFIG.labelsVisible;
            GM_setValue('commitLabelsConfig', USER_CONFIG);
            
            // Update button
            toggleBtn.textContent = USER_CONFIG.labelsVisible ? '🏷️' : '🏷️';
            toggleBtn.style.textDecoration = USER_CONFIG.labelsVisible ? 'none' : 'line-through';
            toggleBtn.title = USER_CONFIG.labelsVisible ? 'Hide commit labels' : 'Show commit labels';
            
            // Toggle label visibility
            document.querySelectorAll('.commit-label').forEach(label => {
                label.style.display = USER_CONFIG.labelsVisible ? 'inline-flex' : 'none';
            });
        });
        
        // Open config window on click
        configBtn.addEventListener('click', () => {
            createConfigWindow();
        });
        
        // Add buttons to container
        buttonContainer.appendChild(toggleBtn);
        buttonContainer.appendChild(configBtn);
        document.body.appendChild(buttonContainer);
        
        // Set initial state
        toggleBtn.style.textDecoration = USER_CONFIG.labelsVisible ? 'none' : 'line-through';
    }

    // Create configuration window
    function createConfigWindow() {
        // Get current theme colors for the config window
        const isDark = isDarkTheme(currentTheme);
        
        const configStyles = {
            window: {
                background: isDark ? '#0d1117' : '#ffffff',
                border: isDark ? '1px solid #30363d' : '1px solid #d0d7de',
                color: isDark ? '#c9d1d9' : '#24292f',
                boxShadow: isDark ? '0 0 10px rgba(0,0,0,0.5)' : '0 0 10px rgba(0,0,0,0.2)'
            },
            button: {
                primary: {
                    background: '#238636',
                    color: '#ffffff',
                    border: 'none'
                },
                secondary: {
                    background: isDark ? '#21262d' : '#f6f8fa',
                    color: isDark ? '#c9d1d9' : '#24292f',
                    border: isDark ? '1px solid #30363d' : '1px solid #d0d7de'
                },
                danger: {
                    background: isDark ? '#21262d' : '#f6f8fa',
                    color: '#f85149',
                    border: isDark ? '1px solid #30363d' : '1px solid #d0d7de'
                }
            },
            input: {
                background: isDark ? '#161b22' : '#f6f8fa',
                color: isDark ? '#c9d1d9' : '#24292f',
                border: isDark ? '1px solid #30363d' : '1px solid #d0d7de'
            },
            text: {
                dim: isDark ? '#8b949e' : '#6e7781',
                link: isDark ? '#58a6ff' : '#0969da'
            }
        };
        
        const configWindow = document.createElement('div');
        configWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${configStyles.window.background};
            border: ${configStyles.window.border};
            border-radius: 6px;
            padding: 20px;
            z-index: 9999;
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: ${configStyles.window.color};
            box-shadow: ${configStyles.window.boxShadow};
        `;

        // Header with title and repo link
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.marginBottom = '20px';

        const title = document.createElement('h2');
        title.textContent = 'Commit Labels Configuration';
        title.style.margin = '0';

        // Repository link container with profile pic
        const repoContainer = document.createElement('div');
        repoContainer.style.display = 'flex';
        repoContainer.style.alignItems = 'center';
        repoContainer.style.gap = '8px';
        
        // Owner profile picture
        const profilePic = document.createElement('img');
        profilePic.src = 'https://raw.githubusercontent.com/nazdridoy/nazhome/main/public/favicons/nazhome.svg';
        profilePic.alt = 'Owner';
        profilePic.style.cssText = `
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: ${isDark ? '#30363d' : '#eaeef2'};
            padding: 3px;
            vertical-align: middle;
        `;
        
        const repoLink = document.createElement('a');
        repoLink.href = 'https://github.com/nazdridoy/github-commit-labels';
        repoLink.target = '_blank';
        repoLink.textContent = 'GitHub Repository';
        repoLink.style.cssText = `
            color: ${configStyles.text.link};
            text-decoration: none;
            font-size: 15px;
            vertical-align: middle;
        `;
        repoLink.addEventListener('mouseenter', () => {
            repoLink.style.textDecoration = 'underline';
        });
        repoLink.addEventListener('mouseleave', () => {
            repoLink.style.textDecoration = 'none';
        });

        repoContainer.appendChild(profilePic);
        repoContainer.appendChild(repoLink);
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(repoContainer);
        configWindow.appendChild(titleContainer);

        // Add tip about nGPT for commit generation
        const ngptTip = document.createElement('div');
        ngptTip.style.cssText = `
            margin: 0 0 20px 0;
            padding: 10px;
            background: ${isDark ? 'rgba(56, 139, 253, 0.1)' : 'rgba(56, 139, 253, 0.1)'};
            border-left: 4px solid ${isDark ? '#58a6ff' : '#0969da'};
            border-radius: 4px;
            font-size: 13px;
            color: ${configStyles.window.color};
        `;
        
        ngptTip.innerHTML = `
            <strong>Pro Tip:</strong> Generate perfect conventional commit messages automatically with 
            <a href="https://github.com/nazdridoy/ngpt" target="_blank" style="color: ${configStyles.text.link}; text-decoration: none;">nGPT</a>. 
            Use the <code style="background: ${isDark ? '#161b22' : '#f6f8fa'}; padding: 2px 4px; border-radius: 3px;">ngpt -g</code> 
            command to analyze your changes and create formatted commit messages that work beautifully with this userscript.
        `;
        
        // Add hover effect for the link
        ngptTip.querySelector('a').addEventListener('mouseenter', (e) => {
            e.target.style.textDecoration = 'underline';
        });
        
        ngptTip.querySelector('a').addEventListener('mouseleave', (e) => {
            e.target.style.textDecoration = 'none';
        });
        
        configWindow.appendChild(ngptTip);

        // Remove Prefix Option
        const prefixDiv = document.createElement('div');
        prefixDiv.style.marginBottom = '20px';
        const prefixCheckbox = document.createElement('input');
        prefixCheckbox.type = 'checkbox';
        prefixCheckbox.checked = USER_CONFIG.removePrefix;
        prefixCheckbox.id = 'remove-prefix';
        prefixCheckbox.style.marginRight = '5px';
        const prefixLabel = document.createElement('label');
        prefixLabel.htmlFor = 'remove-prefix';
        prefixLabel.textContent = 'Remove commit type prefix from message';
        prefixDiv.appendChild(prefixCheckbox);
        prefixDiv.appendChild(prefixLabel);
        configWindow.appendChild(prefixDiv);

        // Add toggle for tooltips with preview
        const tooltipDiv = document.createElement('div');
        tooltipDiv.style.marginBottom = '20px';
        
        const tooltipHeader = document.createElement('div');
        tooltipHeader.style.display = 'flex';
        tooltipHeader.style.alignItems = 'center';
        tooltipHeader.style.marginBottom = '5px';
        
        const tooltipCheckbox = document.createElement('input');
        tooltipCheckbox.type = 'checkbox';
        tooltipCheckbox.checked = USER_CONFIG.enableTooltips;
        tooltipCheckbox.id = 'enable-tooltips';
        tooltipCheckbox.style.marginRight = '5px';
        
        const tooltipLabel = document.createElement('label');
        tooltipLabel.htmlFor = 'enable-tooltips';
        tooltipLabel.textContent = 'Enable tooltips with extended descriptions';
        tooltipLabel.style.marginRight = '15px';
        
        // Add tooltip preview
        const previewLabel = document.createElement('span');
        previewLabel.textContent = 'Preview: ';
        previewLabel.style.marginRight = '5px';
        
        const previewExample = document.createElement('span');
        previewExample.className = 'tooltip-preview-label';
        previewExample.innerHTML = '✨ <span>Feature</span>';
        previewExample.dataset.description = 'New user features (not for new files without user features)';
        previewExample.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            padding: 0 10px;
            border-radius: 20px;
            background: ${isDark ? 'rgba(35, 134, 54, 0.2)' : 'rgba(31, 136, 61, 0.1)'};
            color: ${isDark ? '#7ee787' : '#1a7f37'};
            cursor: help;
        `;
        
        tooltipHeader.appendChild(tooltipCheckbox);
        tooltipHeader.appendChild(tooltipLabel);
        tooltipHeader.appendChild(previewLabel);
        tooltipHeader.appendChild(previewExample);
        
        // Create custom preview tooltip
        previewExample.addEventListener('mouseenter', (e) => {
            if (!tooltipCheckbox.checked) return;
            
            const tooltipPreview = document.createElement('div');
            tooltipPreview.className = 'tooltip-preview';
            tooltipPreview.textContent = previewExample.dataset.description;
            
            const rect = e.target.getBoundingClientRect();
            
            tooltipPreview.style.cssText = `
                position: fixed;
                top: ${rect.bottom + 5}px;
                left: ${rect.left}px;
                max-width: 300px;
                padding: 8px 12px;
                color: ${isDark ? '#e6edf3' : '#ffffff'};
                text-align: center;
                background-color: ${isDark ? '#161b22' : '#24292f'};
                border-radius: 6px;
                border: ${isDark ? '1px solid #30363d' : '1px solid #d0d7de'};
                box-shadow: 0 3px 12px rgba(0,0,0,0.4);
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltipPreview);
        });
        
        previewExample.addEventListener('mouseleave', () => {
            const tooltipPreview = document.querySelector('.tooltip-preview');
            if (tooltipPreview) {
                document.body.removeChild(tooltipPreview);
            }
        });
        
        tooltipDiv.appendChild(tooltipHeader);
        
        // Add explanation text
        const tooltipExplanation = document.createElement('div');
        tooltipExplanation.textContent = 'Tooltips show detailed descriptions when hovering over commit labels.';
        tooltipExplanation.style.color = configStyles.text.dim;
        tooltipExplanation.style.fontSize = '12px';
        tooltipExplanation.style.marginTop = '5px';
        
        tooltipDiv.appendChild(tooltipExplanation);
        configWindow.insertBefore(tooltipDiv, prefixDiv.nextSibling);

        // After prefixDiv and tooltipDiv, add a toggle for showing the floating button
        const floatingBtnDiv = document.createElement('div');
        floatingBtnDiv.style.marginBottom = '20px';
        
        // Add showFloatingButton to USER_CONFIG if it doesn't exist
        if (USER_CONFIG.showFloatingButton === undefined) {
            USER_CONFIG.showFloatingButton = true;
            GM_setValue('commitLabelsConfig', USER_CONFIG);
        }
        
        const floatingBtnCheckbox = document.createElement('input');
        floatingBtnCheckbox.type = 'checkbox';
        floatingBtnCheckbox.checked = USER_CONFIG.showFloatingButton;
        floatingBtnCheckbox.id = 'show-floating-btn';
        floatingBtnCheckbox.style.marginRight = '5px';
        
        const floatingBtnLabel = document.createElement('label');
        floatingBtnLabel.htmlFor = 'show-floating-btn';
        floatingBtnLabel.textContent = 'Show floating toggle button';
        
        floatingBtnDiv.appendChild(floatingBtnCheckbox);
        floatingBtnDiv.appendChild(floatingBtnLabel);
        
        configWindow.insertBefore(floatingBtnDiv, tooltipDiv.nextSibling);

        // After the tooltipDiv and before the floatingBtnDiv in the createConfigWindow function:
        const scopeDiv = document.createElement('div');
        scopeDiv.style.marginBottom = '20px';
        const scopeCheckbox = document.createElement('input');
        scopeCheckbox.type = 'checkbox';
        scopeCheckbox.checked = USER_CONFIG.showScope;
        scopeCheckbox.id = 'show-scope';
        scopeCheckbox.style.marginRight = '5px';
        const scopeLabel = document.createElement('label');
        scopeLabel.htmlFor = 'show-scope';
        scopeLabel.textContent = 'Show commit scope in labels (e.g., "feat(api): message" shows "api" in label)';
        scopeDiv.appendChild(scopeCheckbox);
        scopeDiv.appendChild(scopeLabel);
        configWindow.insertBefore(scopeDiv, floatingBtnDiv.nextSibling);

        // Add debug mode toggle
        const debugDiv = document.createElement('div');
        debugDiv.style.marginBottom = '20px';
        const debugCheckbox = document.createElement('input');
        debugCheckbox.type = 'checkbox';
        debugCheckbox.checked = USER_CONFIG.debugMode;
        debugCheckbox.id = 'debug-mode';
        debugCheckbox.style.marginRight = '5px';
        const debugLabel = document.createElement('label');
        debugLabel.htmlFor = 'debug-mode';
        debugLabel.textContent = 'Enable debug mode (shows detailed logs in console)';
        debugDiv.appendChild(debugCheckbox);
        debugDiv.appendChild(debugLabel);
        configWindow.insertBefore(debugDiv, prefixDiv.nextSibling);

        // Commit Types Configuration
        const typesContainer = document.createElement('div');
        typesContainer.style.marginBottom = '20px';

        // Group commit types by their label
        const groupedTypes = {};
        Object.entries(USER_CONFIG.commitTypes).forEach(([type, config]) => {
            const key = config.label;
            if (!groupedTypes[key]) {
                groupedTypes[key] = {
                    types: [],
                    config: config
                };
            }
            groupedTypes[key].types.push(type);
        });

        // Create rows for grouped types
        Object.entries(groupedTypes).forEach(([label, { types, config }]) => {
            const typeDiv = document.createElement('div');
            typeDiv.style.marginBottom = '10px';
            typeDiv.style.display = 'flex';
            typeDiv.style.alignItems = 'center';
            typeDiv.style.gap = '10px';

            // Type names (with aliases) and edit button container
            const typeContainer = document.createElement('div');
            typeContainer.style.display = 'flex';
            typeContainer.style.width = '150px';
            typeContainer.style.alignItems = 'center';
            typeContainer.style.gap = '4px';

            const typeSpan = document.createElement('span');
            typeSpan.style.color = configStyles.text.dim;
            typeSpan.style.flex = '1';
            typeSpan.textContent = types.join(', ') + ':';

            const editAliasButton = document.createElement('button');
            editAliasButton.textContent = '✏️';
            editAliasButton.title = 'Edit Aliases';
            editAliasButton.style.cssText = `
                padding: 2px 4px;
                background: ${configStyles.button.secondary.background};
                color: ${isDark ? '#58a6ff' : '#0969da'};
                border: ${configStyles.button.secondary.border};
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
            `;

            editAliasButton.onclick = () => {
                const currentAliases = types.join(', ');
                const newAliases = prompt('Edit aliases (separate with commas):', currentAliases);

                if (newAliases && newAliases.trim()) {
                    const newTypes = newAliases.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

                    // Check if any new aliases conflict with other types
                    const conflictingType = newTypes.find(type =>
                        USER_CONFIG.commitTypes[type] && !types.includes(type)
                    );

                    if (conflictingType) {
                        alert(`The alias "${conflictingType}" already exists in another group!`);
                        return;
                    }

                    // Remove old types
                    types.forEach(type => delete USER_CONFIG.commitTypes[type]);

                    // Add new types with same config
                    newTypes.forEach(type => {
                        USER_CONFIG.commitTypes[type] = { ...config };
                    });

                    // Update the display
                    typeSpan.textContent = newTypes.join(', ') + ':';

                    // Update dataset for inputs
                    const inputs = typeDiv.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.dataset.types = newTypes.join(',');
                    });
                }
            };

            typeContainer.appendChild(typeSpan);
            typeContainer.appendChild(editAliasButton);
            typeDiv.appendChild(typeContainer);

            // Emoji input
            const emojiInput = document.createElement('input');
            emojiInput.type = 'text';
            emojiInput.value = config.emoji;
            emojiInput.style.width = '40px';
            emojiInput.style.background = configStyles.input.background;
            emojiInput.style.color = configStyles.input.color;
            emojiInput.style.border = configStyles.input.border;
            emojiInput.style.borderRadius = '4px';
            emojiInput.style.padding = '4px';
            emojiInput.dataset.types = types.join(',');
            emojiInput.dataset.field = 'emoji';
            typeDiv.appendChild(emojiInput);

            // Label input
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.value = config.label;
            labelInput.style.width = '120px';
            labelInput.style.background = configStyles.input.background;
            labelInput.style.color = configStyles.input.color;
            labelInput.style.border = configStyles.input.border;
            labelInput.style.borderRadius = '4px';
            labelInput.style.padding = '4px';
            labelInput.dataset.types = types.join(',');
            labelInput.dataset.field = 'label';
            typeDiv.appendChild(labelInput);

            // Color select
            const colorSelect = document.createElement('select');
            Object.keys(COLORS).forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                if (config.color === color) option.selected = true;
                colorSelect.appendChild(option);
            });
            colorSelect.style.background = configStyles.input.background;
            colorSelect.style.color = configStyles.input.color;
            colorSelect.style.border = configStyles.input.border;
            colorSelect.style.borderRadius = '4px';
            colorSelect.style.padding = '4px';
            colorSelect.dataset.types = types.join(',');
            colorSelect.dataset.field = 'color';
            typeDiv.appendChild(colorSelect);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.style.cssText = `
                padding: 2px 8px;
                background: ${configStyles.button.danger.background};
                color: ${configStyles.button.danger.color};
                border: ${configStyles.button.danger.border};
                border-radius: 4px;
                cursor: pointer;
            `;
            deleteButton.onclick = () => {
                if (confirm(`Delete commit types "${types.join(', ')}"?`)) {
                    typeDiv.remove();
                    types.forEach(type => delete USER_CONFIG.commitTypes[type]);
                }
            };
            typeDiv.appendChild(deleteButton);

            typesContainer.appendChild(typeDiv);
        });

        // Add "Add New Type" button
        const addNewButton = document.createElement('button');
        addNewButton.textContent = '+ Add New Type';
        addNewButton.style.cssText = `
            margin-bottom: 15px;
            padding: 5px 16px;
            background: ${configStyles.button.primary.background};
            color: ${configStyles.button.primary.color};
            border: ${configStyles.button.primary.border};
            border-radius: 6px;
            cursor: pointer;
        `;

        addNewButton.onclick = () => {
            const typeInput = prompt('Enter the commit type and aliases (separated by commas, e.g., "added, add"):', '');
            if (typeInput && typeInput.trim()) {
                const types = typeInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

                // Check if any of the types already exist
                const existingType = types.find(type => USER_CONFIG.commitTypes[type]);
                if (existingType) {
                    alert(`The commit type "${existingType}" already exists!`);
                    return;
                }

                // Create base config for all aliases
                const baseConfig = {
                    emoji: '🔄',
                    label: types[0].charAt(0).toUpperCase() + types[0].slice(1),
                    color: 'blue',
                    description: 'Custom commit type'
                };

                // Add all types to config with the same settings
                types.forEach(type => {
                    USER_CONFIG.commitTypes[type] = { ...baseConfig };
                });

                // Create and add new type row
                const typeDiv = document.createElement('div');
                typeDiv.style.marginBottom = '10px';
                typeDiv.style.display = 'flex';
                typeDiv.style.alignItems = 'center';
                typeDiv.style.gap = '10px';

                // Type names (with aliases)
                const typeSpan = document.createElement('span');
                typeSpan.style.width = '150px';
                typeSpan.style.color = configStyles.text.dim;
                typeSpan.textContent = types.join(', ') + ':';
                typeDiv.appendChild(typeSpan);

                // Emoji input
                const emojiInput = document.createElement('input');
                emojiInput.type = 'text';
                emojiInput.value = baseConfig.emoji;
                emojiInput.style.width = '40px';
                emojiInput.style.background = configStyles.input.background;
                emojiInput.style.color = configStyles.input.color;
                emojiInput.style.border = configStyles.input.border;
                emojiInput.style.borderRadius = '4px';
                emojiInput.style.padding = '4px';
                emojiInput.dataset.types = types.join(',');
                emojiInput.dataset.field = 'emoji';
                typeDiv.appendChild(emojiInput);

                // Label input
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.value = baseConfig.label;
                labelInput.style.width = '120px';
                labelInput.style.background = configStyles.input.background;
                labelInput.style.color = configStyles.input.color;
                labelInput.style.border = configStyles.input.border;
                labelInput.style.borderRadius = '4px';
                labelInput.style.padding = '4px';
                labelInput.dataset.types = types.join(',');
                labelInput.dataset.field = 'label';
                typeDiv.appendChild(labelInput);

                // Color select
                const colorSelect = document.createElement('select');
                Object.keys(COLORS).forEach(color => {
                    const option = document.createElement('option');
                    option.value = color;
                    option.textContent = color;
                    if (color === 'blue') option.selected = true;
                    colorSelect.appendChild(option);
                });
                colorSelect.style.background = configStyles.input.background;
                colorSelect.style.color = configStyles.input.color;
                colorSelect.style.border = configStyles.input.border;
                colorSelect.style.borderRadius = '4px';
                colorSelect.style.padding = '4px';
                colorSelect.dataset.types = types.join(',');
                colorSelect.dataset.field = 'color';
                typeDiv.appendChild(colorSelect);

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '🗑️';
                deleteButton.style.cssText = `
                    padding: 2px 8px;
                    background: ${configStyles.button.danger.background};
                    color: ${configStyles.button.danger.color};
                    border: ${configStyles.button.danger.border};
                    border-radius: 4px;
                    cursor: pointer;
                `;
                deleteButton.onclick = () => {
                    if (confirm(`Delete commit types "${types.join(', ')}"?`)) {
                        typeDiv.remove();
                        types.forEach(type => delete USER_CONFIG.commitTypes[type]);
                    }
                };
                typeDiv.appendChild(deleteButton);

                typesContainer.appendChild(typeDiv);
            }
        };

        configWindow.appendChild(addNewButton);
        configWindow.appendChild(typesContainer);

        // Save and Close buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
            padding: 5px 16px;
            background: ${configStyles.button.primary.background};
            color: ${configStyles.button.primary.color};
            border: ${configStyles.button.primary.border};
            border-radius: 6px;
            cursor: pointer;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: 5px 16px;
            background: ${configStyles.button.secondary.background};
            color: ${configStyles.button.secondary.color};
            border: ${configStyles.button.secondary.border};
            border-radius: 6px;
            cursor: pointer;
        `;

        // Add Reset button next to Save and Close
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Default';
        resetButton.style.cssText = `
            padding: 5px 16px;
            background: ${configStyles.button.danger.background};
            color: ${configStyles.button.danger.color};
            border: ${configStyles.button.danger.border};
            border-radius: 6px;
            cursor: pointer;
            margin-right: auto;  // This pushes Save/Close to the right
        `;

        resetButton.onclick = () => {
            if (confirm('Are you sure you want to reset all settings to default? This will remove all custom types and settings.')) {
                GM_setValue('commitLabelsConfig', DEFAULT_CONFIG);
                location.reload();
            }
        };

        saveButton.onclick = () => {
            const newConfig = { ...USER_CONFIG };
            newConfig.removePrefix = prefixCheckbox.checked;
            newConfig.enableTooltips = tooltipCheckbox.checked;
            newConfig.showFloatingButton = floatingBtnCheckbox.checked;
            newConfig.showScope = scopeCheckbox.checked;
            newConfig.debugMode = debugCheckbox.checked;  // Add debug mode
            newConfig.commitTypes = {};

            typesContainer.querySelectorAll('input, select').forEach(input => {
                const types = input.dataset.types.split(',');
                const field = input.dataset.field;

                types.forEach(type => {
                    if (!newConfig.commitTypes[type]) {
                        newConfig.commitTypes[type] = {};
                    }
                    newConfig.commitTypes[type][field] = input.value;
                });
            });

            GM_setValue('commitLabelsConfig', newConfig);
            location.reload();
        };

        closeButton.onclick = () => {
            document.body.removeChild(configWindow);
        };

        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(saveButton);
        configWindow.appendChild(buttonContainer);

        document.body.appendChild(configWindow);
    }

    // Create export/import dialog
    function createExportImportDialog() {
        // Check if dialog already exists
        if (document.getElementById('config-export-import')) {
            document.getElementById('config-export-import').remove();
        }
        
        const dialog = document.createElement('div');
        dialog.id = 'config-export-import';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 20px;
            z-index: 9999;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            color: #c9d1d9;
            box-shadow: 0 0 20px rgba(0,0,0,0.7);
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Export/Import Configuration';
        title.style.marginBottom = '15px';
        
        const exportSection = document.createElement('div');
        exportSection.style.marginBottom = '20px';
        
        const exportTitle = document.createElement('h3');
        exportTitle.textContent = 'Export Configuration';
        exportTitle.style.marginBottom = '10px';
        
        const configOutput = document.createElement('textarea');
        configOutput.readOnly = true;
        configOutput.value = JSON.stringify(USER_CONFIG, null, 2);
        configOutput.style.cssText = `
            width: 100%;
            height: 150px;
            background: #161b22;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 10px;
            font-family: monospace;
            resize: vertical;
            margin-bottom: 10px;
        `;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.cssText = `
            padding: 6px 16px;
            background: #238636;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
        `;
        
        copyButton.onclick = () => {
            configOutput.select();
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy to Clipboard';
            }, 2000);
        };
        
        exportSection.appendChild(exportTitle);
        exportSection.appendChild(configOutput);
        exportSection.appendChild(copyButton);
        
        const importSection = document.createElement('div');
        importSection.style.marginBottom = '20px';
        
        const importTitle = document.createElement('h3');
        importTitle.textContent = 'Import Configuration';
        importTitle.style.marginBottom = '10px';
        
        const configInput = document.createElement('textarea');
        configInput.placeholder = 'Paste configuration JSON here...';
        configInput.style.cssText = `
            width: 100%;
            height: 150px;
            background: #161b22;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 10px;
            font-family: monospace;
            resize: vertical;
            margin-bottom: 10px;
        `;
        
        const importButton = document.createElement('button');
        importButton.textContent = 'Import';
        importButton.style.cssText = `
            padding: 6px 16px;
            background: #238636;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
        `;
        
        importButton.onclick = () => {
            try {
                const newConfig = JSON.parse(configInput.value);
                
                // Validate basic structure
                if (!newConfig.commitTypes) {
                    throw new Error('Invalid configuration: missing commitTypes object');
                }
                
                if (confirm('Are you sure you want to import this configuration? This will overwrite your current settings.')) {
                    GM_setValue('commitLabelsConfig', newConfig);
                    alert('Configuration imported successfully! Page will reload to apply changes.');
                    location.reload();
                }
            } catch (error) {
                alert('Error importing configuration: ' + error.message);
            }
        };
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: 6px 16px;
            background: #21262d;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            cursor: pointer;
        `;
        
        closeButton.onclick = () => {
            document.body.removeChild(dialog);
        };
        
        importSection.appendChild(importTitle);
        importSection.appendChild(configInput);
        importSection.appendChild(importButton);
        
        dialog.appendChild(title);
        dialog.appendChild(exportSection);
        dialog.appendChild(importSection);
        dialog.appendChild(closeButton);
        
        document.body.appendChild(dialog);
    }

    // Register configuration menu command
    GM_registerMenuCommand('Configure Commit Labels', createConfigWindow);
    GM_registerMenuCommand('Toggle Labels', () => {
        USER_CONFIG.labelsVisible = !USER_CONFIG.labelsVisible;
        GM_setValue('commitLabelsConfig', USER_CONFIG);
        
        // Toggle label visibility
        document.querySelectorAll('.commit-label').forEach(label => {
            label.style.display = USER_CONFIG.labelsVisible ? 'inline-flex' : 'none';
        });
        
        // Update toggle button if it exists
        const toggleBtn = document.getElementById('commit-labels-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = USER_CONFIG.labelsVisible ? '🏷️' : '🏷️';
            toggleBtn.style.textDecoration = USER_CONFIG.labelsVisible ? 'none' : 'line-through';
            toggleBtn.title = USER_CONFIG.labelsVisible ? 'Hide commit labels' : 'Show commit labels';
        }
    });
    GM_registerMenuCommand('Export/Import Config', createExportImportDialog);

    // Check if we're on a commit page
    function isCommitPage() {
        return window.location.pathname.includes('/commits') ||
               window.location.pathname.includes('/commit/');
    }

    // Update colors when theme changes
    function updateThemeColors() {
        const newTheme = detectTheme();
        if (newTheme !== currentTheme) {
            currentTheme = newTheme;
            
            // Map theme variants to our base themes for colors
            let baseTheme = newTheme;
            if (newTheme.startsWith('light_')) {
                baseTheme = 'light';
            } else if (newTheme.startsWith('dark_') && newTheme !== 'dark_dimmed') {
                baseTheme = 'dark';
            }
            
            COLORS = THEME_COLORS[baseTheme] || THEME_COLORS.light;
            
            // Update existing labels
            document.querySelectorAll('.commit-label').forEach(label => {
                const type = label.dataset.commitType;
                if (type && USER_CONFIG.commitTypes[type]) {
                    const color = COLORS[USER_CONFIG.commitTypes[type].color];
                    if (color) {
                        label.style.backgroundColor = color.bg;
                        label.style.color = color.text;
                    }
                }
            });
        }
    }

    // Debug logging function
    function debugLog(message, data = null) {
        if (USER_CONFIG.debugMode) {
            const timestamp = new Date().toISOString();
            const logMessage = `[GitHub Commit Labels Debug] [${timestamp}] ${message}`;
            console.log(logMessage);
            if (data) {
                console.log('Data:', data);
            }
        }
    }

    // Helper function to safely query elements
    function safeQuerySelector(selector) {
        try {
            const elements = document.querySelectorAll(selector);
            debugLog(`Query selector "${selector}" found ${elements.length} elements`);
            return elements;
        } catch (error) {
            debugLog(`Selector error for "${selector}":`, error);
            return [];
        }
    }

    // Debounce function to limit how often a function can be called
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Main function to add labels to commits
    function addCommitLabels() {
        debugLog('Starting addCommitLabels');
        
        // Only proceed if we're on a commit page
        if (!isCommitPage()) {
            debugLog('Not on a commit page, exiting');
            return;
        }

        debugLog('Updating theme colors');
        updateThemeColors();
        
        // Create toggle button if it doesn't exist and is enabled
        if (USER_CONFIG.showFloatingButton !== false) {
            debugLog('Creating label toggle button');
            createLabelToggle();
        }

        // Try multiple selectors in order of reliability
        const selectors = [
            'li[data-testid="commit-row-item"] h4 a[data-pjax="true"]', // Most reliable
            '.Title-module__heading--upUxW a[data-pjax="true"]',        // Backup
            '.markdown-title a[data-pjax="true"]'                       // Legacy
        ];

        debugLog('Trying selectors:', selectors);
        let commitMessages = [];
        for (const selector of selectors) {
            commitMessages = safeQuerySelector(selector);
            if (commitMessages.length > 0) {
                debugLog(`Using selector: ${selector}`);
                break;
            }
        }

        debugLog(`Found ${commitMessages.length} commit messages to process`);

        // Debounce and batch process for performance improvement
        let processedCount = 0;
        const batchSize = 20;
        const commitMessagesArray = Array.from(commitMessages);
        
        const processCommitBatch = (startIndex) => {
            debugLog(`Processing batch starting at index ${startIndex}`);
            const endIndex = Math.min(startIndex + batchSize, commitMessagesArray.length);
            
            for (let i = startIndex; i < endIndex; i++) {
                try {
                    const message = commitMessagesArray[i];
                    const text = message.textContent.trim();
                    debugLog(`Processing commit message: ${text}`);
                    
                    // Skip if this commit already has a label
                    if (message.parentElement.querySelector('.commit-label')) {
                        debugLog('Commit already has a label, skipping');
                        continue;
                    }

                    // Step 1: Basic parse - Capture type, middle part, and message
                    const basicMatch = text.match(/^(\w+)(.*?):\s*(.*)$/);
                    debugLog('Basic commit message match result:', basicMatch);

                    if (basicMatch) {
                        const type = basicMatch[1].toLowerCase();
                        const middlePart = basicMatch[2].trim();
                        const restOfMessage = basicMatch[3];

                        let scope = '';
                        let isBreaking = false;
                        let scopePart = middlePart; // Start with the full middle part

                        // Step 2: Check for breaking change indicator anywhere in the middle part
                        if (middlePart.includes('!')) {
                            isBreaking = true;
                            scopePart = middlePart.replace('!', '').trim(); // Remove ! for scope extraction
                        }
                        
                        // Step 3: Check if the remaining part is a scope
                        if (scopePart.startsWith('(') && scopePart.endsWith(')')) {
                            scope = scopePart.slice(1, -1); // Extract scope content
                        }

                        debugLog(`Extracted: type=${type}, scope=${scope}, isBreaking=${isBreaking}, message=${restOfMessage}`);

                        if (USER_CONFIG.commitTypes[type]) {
                            debugLog(`Found matching commit type: ${type}`);
                            // Only add label if it hasn't been added yet
                            if (!message.parentElement.querySelector('.commit-label')) {
                                debugLog('Creating new label');
                                const label = document.createElement('span');
                                label.className = 'commit-label';
                                label.dataset.commitType = type;
                                label.dataset.commitScope = scope;
                                if (isBreaking) {
                                    label.dataset.isBreaking = 'true';
                                }
                                
                                const color = COLORS[USER_CONFIG.commitTypes[type].color];
                                
                                // Apply styles
                                const styles = {
                                    ...USER_CONFIG.labelStyle,
                                    backgroundColor: color.bg,
                                    color: color.text,
                                    display: USER_CONFIG.labelsVisible ? 'inline-flex' : 'none'
                                };

                                if (isBreaking) {
                                    styles.border = '2px solid #d73a49';
                                    styles.fontWeight = 'bold';
                                }

                                label.style.cssText = Object.entries(styles)
                                    .map(([key, value]) => `${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value}`)
                                    .join(';');

                                // Enhanced tooltip
                                if (USER_CONFIG.enableTooltips && USER_CONFIG.commitTypes[type].description) {
                                    // Store description in data attribute instead of title to avoid double tooltips
                                    const description = USER_CONFIG.commitTypes[type].description;
                                    const tooltipText = scope ? 
                                        `${description} (Scope: ${scope})` : 
                                        description;
                                    label.dataset.description = tooltipText;
                                    label.setAttribute('aria-label', tooltipText);
                                    
                                    // Add tooltip indicator
                                    label.style.cursor = 'help';
                                    
                                    // For better accessibility
                                    label.setAttribute('role', 'tooltip');
                                    
                                    // Create a custom tooltip implementation if needed
                                    label.addEventListener('mouseenter', (e) => {
                                        // Check if we already have a custom tooltip showing
                                        if (document.querySelector('.commit-label-tooltip')) {
                                            return;
                                        }
                                        
                                        label.style.transform = 'translateY(-1px)';
                                        label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                                        
                                        // Force show tooltip by creating a custom one
                                        if (label.dataset.description) {
                                            const tooltip = document.createElement('div');
                                            tooltip.className = 'commit-label-tooltip';
                                            tooltip.textContent = label.dataset.description;
                                            
                                            // Calculate position relative to viewport
                                            const rect = e.target.getBoundingClientRect();
                                            const top = rect.bottom + 5;
                                            const left = rect.left;
                                            
                                            tooltip.style.cssText = `
                                                position: fixed;
                                                top: ${top}px;
                                                left: ${left}px;
                                                max-width: 300px;
                                                padding: 8px 12px;
                                                color: #e6edf3;
                                                text-align: center;
                                                background-color: #161b22;
                                                border-radius: 6px;
                                                border: 1px solid #30363d;
                                                box-shadow: 0 3px 12px rgba(0,0,0,0.4);
                                                font-size: 12px;
                                                z-index: 1000;
                                                pointer-events: none;
                                            `;
                                            document.body.appendChild(tooltip);
                                            
                                            // Adjust position if tooltip goes off-screen
                                            const tooltipRect = tooltip.getBoundingClientRect();
                                            if (tooltipRect.right > window.innerWidth) {
                                                tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
                                            }
                                        }
                                    });

                                    label.addEventListener('mouseleave', () => {
                                        label.style.transform = 'translateY(0)';
                                        label.style.boxShadow = styles.boxShadow;
                                        
                                        // Remove custom tooltip if it exists
                                        const tooltip = document.querySelector('.commit-label-tooltip');
                                        if (tooltip) {
                                            document.body.removeChild(tooltip);
                                        }
                                    });
                                } else {
                                    // Normal hover effect if tooltips are disabled
                                    if (USER_CONFIG.commitTypes[type].description) {
                                        label.title = USER_CONFIG.commitTypes[type].description;
                                    }
                                    
                                    label.addEventListener('mouseenter', () => {
                                        label.style.transform = 'translateY(-1px)';
                                        label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                                    });

                                    label.addEventListener('mouseleave', () => {
                                        label.style.transform = 'translateY(0)';
                                        label.style.boxShadow = styles.boxShadow;
                                    });
                                }

                                const emoji = document.createElement('span');
                                emoji.style.marginRight = '4px';
                                emoji.style.fontSize = '14px';
                                emoji.style.lineHeight = '1';
                                emoji.textContent = USER_CONFIG.commitTypes[type].emoji;

                                const labelText = document.createElement('span');
                                labelText.textContent = USER_CONFIG.commitTypes[type].label;
                                if (isBreaking) {
                                    labelText.textContent += ' ⚠️';
                                }

                                label.appendChild(emoji);
                                label.appendChild(labelText);
                                message.parentElement.insertBefore(label, message);

                                // Update the commit message text to remove the type prefix if enabled
                                if (USER_CONFIG.removePrefix) {
                                    message.textContent = restOfMessage;
                                }

                                // Optionally display scope in the label
                                if (scope && USER_CONFIG.showScope) {
                                    const scopeSpan = document.createElement('span');
                                    scopeSpan.className = 'commit-scope';
                                    scopeSpan.textContent = `(${scope})`;
                                    scopeSpan.style.marginLeft = '2px';
                                    scopeSpan.style.opacity = '0.8';
                                    scopeSpan.style.fontSize = '12px';
                                    labelText.appendChild(scopeSpan);
                                }
                            } else {
                                debugLog('Label already exists, skipping');
                            }
                        } else {
                            debugLog(`No matching commit type found for: ${type}`);
                        }
                    } else {
                        // Only log non-conventional commits if they don't have a label
                        if (!message.parentElement.querySelector('.commit-label')) {
                            debugLog('Commit message does not match conventional commit format and has no label');
                        } else {
                            debugLog('Skipping already processed commit');
                        }
                    }
                } catch (error) {
                    debugLog('Error processing commit:', error);
                }
            }
            
            // Process next batch if needed
            processedCount += (endIndex - startIndex);
            debugLog(`Processed ${processedCount} of ${commitMessagesArray.length} commits`);
            
            if (processedCount < commitMessagesArray.length) {
                debugLog('Scheduling next batch');
                setTimeout(() => processCommitBatch(endIndex), 0);
            } else {
                debugLog('Finished processing all commits');
            }
        };
        
        // Start processing first batch
        if (commitMessagesArray.length > 0) {
            debugLog('Starting first batch processing');
            processCommitBatch(0);
        } else {
            debugLog('No commit messages found to process');
        }
    }

    // Set up MutationObserver to watch for DOM changes
    function setupMutationObserver() {
        debugLog('Setting up MutationObserver');
        const observer = new MutationObserver(debounce((mutations) => {
            debugLog('DOM changes detected:', mutations);
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    debugLog('New nodes added, triggering addCommitLabels');
                    addCommitLabels();
                }
            }
        }, 100));

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        debugLog('MutationObserver setup complete');
        return observer;
    }

    // Initialize the script
    function initialize() {
        debugLog('Initializing GitHub Commit Labels');
        // Initial run
        addCommitLabels();

        // Set up mutation observer
        const observer = setupMutationObserver();

        // Clean up on page unload
        window.addEventListener('unload', () => {
            debugLog('Cleaning up on page unload');
            observer.disconnect();
        });
    }

    // Initialize on page load
    initialize();

    // Handle GitHub's client-side navigation
    const navigationObserver = new MutationObserver(debounce((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Check if we're on a commit page after navigation
                if (isCommitPage()) {
                    // Small delay to ensure GitHub has finished rendering
                    setTimeout(addCommitLabels, 100);
                }
            }
        }
    }, 100));

    // Observe changes to the main content area
    navigationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for popstate events (browser back/forward navigation)
    window.addEventListener('popstate', debounce(() => {
        if (isCommitPage()) {
            setTimeout(addCommitLabels, 100);
        }
    }, 100));

    // Listen for GitHub's custom navigation event
    document.addEventListener('turbo:render', debounce(() => {
        if (isCommitPage()) {
            setTimeout(addCommitLabels, 100);
        }
    }, 100));
})();
