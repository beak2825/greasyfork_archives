// ==UserScript==
// @name         Save Page Automatically Every Minute
// @namespace    https://greasyfork.org/en/users/1291009
// @version      1.3
// @description  Download the current page as a single HTML file every minute
// @author       BadOrBest
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_addStyle
// @icon         https://ih1.redbubble.net/image.852830766.3011/st,extra_large,507x507-pad,600x600,f8f8f8.u3.webp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520754/Save%20Page%20Automatically%20Every%20Minute.user.js
// @updateURL https://update.greasyfork.org/scripts/520754/Save%20Page%20Automatically%20Every%20Minute.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const settings = JSON.parse(localStorage.getItem('savePageAsHTMLSettings')) || {
        autoSaveEnabled: false,
        intervalTime: 60000,
        notificationColor: '#00FF00',
    };

    const saveSettings = () => localStorage.setItem('savePageAsHTMLSettings', JSON.stringify(settings));

    const showNotification = (title, message, color = settings.notificationColor) => {
        const notification = document.createElement('div');
        notification.innerHTML = `<strong>${title}</strong><br>${message}`;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.background = `linear-gradient(135deg, ${color}, #444)`;
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '8px';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        notification.style.transform = 'translateY(-20px)';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 50);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    };

    const fetchResource = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
            const contentType = response.headers.get('Content-Type');
            const isBinary = contentType && /image|font/.test(contentType);
            const data = isBinary ? await response.blob() : await response.text();
            return { data, isBinary, contentType };
        } catch (error) {
            console.error(`Error fetching resource: ${url}`, error);
            return null;
        }
    };

    const toBase64 = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const downloadPageAsHTML = async () => {
        try {
            const originalHtml = document.documentElement.outerHTML;
            const parser = new DOMParser();
            const doc = parser.parseFromString(originalHtml, 'text/html');

            const promises = [];

            doc.querySelectorAll('img').forEach((img) => {
                const src = img.src;
                if (src) {
                    promises.push(
                        fetchResource(src).then(async (res) => {
                            if (res && res.isBinary) {
                                const base64 = await toBase64(res.data);
                                img.src = base64;
                            }
                        })
                    );
                }
            });

            doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
                const href = link.href;
                if (href) {
                    promises.push(
                        fetchResource(href).then((res) => {
                            if (res && !res.isBinary) {
                                const style = document.createElement('style');
                                style.textContent = res.data;
                                link.replaceWith(style);
                            }
                        })
                    );
                }
            });

            doc.querySelectorAll('script[src]').forEach((script) => {
                const src = script.src;
                if (src) {
                    promises.push(
                        fetchResource(src).then((res) => {
                            if (res && !res.isBinary) {
                                const inlineScript = document.createElement('script');
                                inlineScript.textContent = res.data;
                                script.replaceWith(inlineScript);
                            }
                        })
                    );
                }
            });

            await Promise.all(promises);

            const updatedHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
            const blob = new Blob([updatedHtml], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const sanitizedTitle = document.title.replace(/[/\\?%*:|"<>]/g, '_');
            link.download = `${sanitizedTitle || 'page'}.html`;
            link.click();
            URL.revokeObjectURL(link.href);

            console.log('Page saved as a single HTML file!');
        } catch (error) {
            console.error('Error during download:', error);
        }
    };

    let autoSaveInterval;
    const startAutoSave = () => {
        if (autoSaveInterval) clearInterval(autoSaveInterval);
        autoSaveInterval = setInterval(() => {
            downloadPageAsHTML();
        }, settings.intervalTime);
        showNotification('Auto-save enabled', 'The page will be saved every minute.');
    };

    const stopAutoSave = () => {
        if (autoSaveInterval) clearInterval(autoSaveInterval);
        showNotification('Auto-save disabled', 'The automatic save has been stopped.', 'red');
    };

    const toggleAutoSave = () => {
        settings.autoSaveEnabled = !settings.autoSaveEnabled;
        saveSettings();
        if (settings.autoSaveEnabled) {
            startAutoSave();
        } else {
            stopAutoSave();
        }
    };

    const setNotificationColor = () => {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.position = 'fixed';
        colorPicker.style.top = '10px';
        colorPicker.style.right = '10px';
        colorPicker.style.zIndex = '10000';
        colorPicker.value = settings.notificationColor;

        document.body.appendChild(colorPicker);

        colorPicker.addEventListener('input', () => {
            settings.notificationColor = colorPicker.value;
        });

        colorPicker.addEventListener('change', () => {
            saveSettings();
            showNotification('Color Updated', `Notification color set to ${settings.notificationColor}`);
            colorPicker.remove();
        });
    };

    const setAutoSaveInterval = () => {
        const interval = prompt('Enter auto-save interval in seconds:', settings.intervalTime / 1000);
        if (interval && !isNaN(interval) && interval > 0) {
            settings.intervalTime = interval * 1000;
            saveSettings();
            if (settings.autoSaveEnabled) {
                stopAutoSave();
                startAutoSave();
            }
            showNotification(`Auto-save interval set to ${interval} seconds`);
        } else {
            showNotification('Invalid interval entered', 'red');
        }
    };

    GM_registerMenuCommand('Toggle Auto-Save', toggleAutoSave);
    GM_registerMenuCommand('Set Notification Color', setNotificationColor);
    GM_registerMenuCommand('Set Auto-Save Interval', setAutoSaveInterval);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'h') {
            e.preventDefault();
            downloadPageAsHTML();
            showNotification('Manual Save', 'Page saved manually.');
        }
    });

    if (settings.autoSaveEnabled) {
        startAutoSave();
    }
})();
