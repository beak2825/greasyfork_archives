// ==UserScript==
// @name         Font Downloader
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Панель шрифтов, вызываемая клавишей F. Скачивание, предпросмотр, конвертация. Без кнопки на экране.
// @author       Olha
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537445/Font%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/537445/Font%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let panel = null;

    function getFontFaceRules() {
        const fontData = [];

        for (let sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules;
                if (!rules) continue;

                for (let rule of rules) {
                    if (rule.type === CSSRule.FONT_FACE_RULE) {
                        const style = rule.style;
                        const fontFamily = style.getPropertyValue('font-family')?.replace(/['"]/g, '')?.trim();
                        const fontWeight = style.getPropertyValue('font-weight') || 'normal';
                        const fontStyle = style.getPropertyValue('font-style') || 'normal';
                        const src = style.getPropertyValue('src');
                        const match = /url\(["']?([^"')]+)["']?\)/.exec(src);
                        if (match && fontFamily) {
                            fontData.push({
                                name: `${fontFamily} ${fontStyle} ${fontWeight}`.trim(),
                                family: fontFamily,
                                weight: fontWeight,
                                style: fontStyle,
                                url: match[1]
                            });
                        }
                    }
                }
            } catch (e) {
                continue;
            }
        }

        return fontData;
    }

    function createDownloadUI(fonts) {
        panel = document.createElement('div');
        panel.id = 'font-downloader-panel';
        panel.style.position = 'fixed';
        panel.style.top = '60px';
        panel.style.right = '20px';
        panel.style.zIndex = '99999';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        panel.style.maxHeight = '400px';
        panel.style.overflowY = 'auto';
        panel.style.width = '320px';
        panel.style.fontSize = '16px';
        panel.style.userSelect = 'none';

        const title = document.createElement('div');
        title.textContent = 'Шрифты на этой странице:';
        title.style.marginBottom = '8px';
        title.style.fontWeight = 'bold';
        panel.appendChild(title);

        if (fonts.length === 0) {
            const msg = document.createElement('div');
            msg.textContent = 'Шрифты не найдены.';
            panel.appendChild(msg);
        } else {
            fonts.forEach(font => {
                const ext = font.url.split('.').pop().split('?')[0];
                const fileName = `${font.name}.${ext}`;

                const link = document.createElement('a');
                link.href = font.url;
                link.textContent = font.name;
                link.style.display = 'block';
                link.style.color = '#007bff';
                link.style.textDecoration = 'none';
                link.style.cursor = 'pointer';
                link.style.fontFamily = `'${font.family}', sans-serif`;
                link.style.fontWeight = font.weight;
                link.style.fontStyle = font.style;
                link.style.marginBottom = '8px';

                link.onclick = async (e) => {
                    e.preventDefault();

                    const response = await fetch(font.url);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);

                    window.open('https://cloudconvert.com/woff2-to-ttf', '_blank');
                };

                panel.appendChild(link);
            });
        }

        document.body.appendChild(panel);
    }

    function togglePanel() {
        if (panel) {
            panel.remove();
            panel = null;
        } else {
            const fonts = getFontFaceRules();
            createDownloadUI(fonts);
        }
    }

document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const isInput = active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.isContentEditable
    );
    if (!isInput && e.code === 'KeyF') {
        togglePanel();
    }
});

})();