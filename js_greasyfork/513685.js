// ==UserScript==
// @name         Iul create
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unlock iul
// @match        https://fortewidget.xlsmeta.ru/iul
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513685/Iul%20create.user.js
// @updateURL https://update.greasyfork.org/scripts/513685/Iul%20create.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Простая функция перехвата и замены
    function patchScript() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            if (script.src && script.src.includes('main.') && script.src.endsWith('.js')) {
                console.log('Найден скрипт:', script.src);

                fetch(script.src)
                    .then(response => response.text())
                    .then(code => {
                        // Минимальные замены
                        code = code.replace(/e\.demo\s*\?\s*".*?"\s*:\s*void\s*0/g, 'void 0');
                        code = code.replace(/return\s*e\.md5\s*=\s*""\.concat\(\s*t\s*,\s*"<<demoversion>>"\)\.concat\(\s*n\s*\),\s*e\.crc32\s*=\s*""\.concat\(\s*r\s*,\s*"demo"\)\.concat\(\s*o\s*\),/g, '');
                        code = code.replace(/pdf-lib\s+\(https:\/\/github\.com\/Hopding\/pdf-lib\)/g, '');

                        const newScript = document.createElement('script');
                        newScript.textContent = code;
                        document.head.appendChild(newScript);

                        script.remove(); // Удаляем оригинальный скрипт
                        console.log('Скрипт успешно заменен');
                    })
                    .catch(error => {
                        console.error('Ошибка загрузки скрипта:', error);
                    });

                break;
            }
        }
    }

    // Пытаемся перехватить на разных этапах загрузки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchScript);
    } else {
        patchScript();
    }
})();