// ==UserScript==
// @name         网页数据清除与管理
// @namespace    http://tampermonkey.net/
// @version      114514
// @description  可清理网页Cookie、本地存储等数据，支持自定义菜单与多语言，清理过程透明可查
// @author       Chaos
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544740/%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%B8%85%E9%99%A4%E4%B8%8E%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/544740/%E7%BD%91%E9%A1%B5%E6%95%B0%E6%8D%AE%E6%B8%85%E9%99%A4%E4%B8%8E%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2023 Chaos

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

    // 所有可用功能列表（用于配置）
    const ALL_FEATURES = {
        clearAllDetailed: { nameKey: 'clearAllDetailed', defaultInMain: true },
        clearCookies: { nameKey: 'clearCookies', defaultInMain: true },
        clearSessionStorage: { nameKey: 'clearSessionStorage', defaultInMain: true },
        clearLocalStorage: { nameKey: 'clearLocalStorage', defaultInMain: false },
        clearIndexedDB: { nameKey: 'clearIndexedDB', defaultInMain: false },
        clearCacheStorage: { nameKey: 'clearCacheStorage', defaultInMain: false },
        clearServiceWorkers: { nameKey: 'clearServiceWorkers', defaultInMain: false },
        clearFrameStorage: { nameKey: 'clearFrameStorage', defaultInMain: false },
        copyCookies: { nameKey: 'copyCookies', defaultInMain: false },
        clearGuide: { nameKey: 'clearGuide', defaultInMain: false },
        switchLang: { nameKey: 'switchLang', defaultInMain: false },
        menuSettings: { nameKey: 'menuSettings', defaultInMain: false }
    };

    // 多语言包
    const translations = {
        'zh-CN': {
            // 功能名称
            clearAllDetailed: '清除 %s 所有数据（详细）',
            clearCookies: '清除 %s Cookie（包括子域名）',
            clearLocalStorage: '清除 %s 本地存储',
            clearSessionStorage: '清除 %s 会话存储',
            clearIndexedDB: '清除 %s IndexedDB数据库',
            clearCacheStorage: '清除 %s 缓存存储',
            clearServiceWorkers: '注销 %s Service Worker',
            clearFrameStorage: '清除 %s 同域框架存储',
            copyCookies: '复制当前Cookie',
            clearGuide: '数据清理指南',
            switchLang: '切换语言',
            menuSettings: '菜单设置',
            moreOptions: '更多选项 ▶',
            moreOptionsCollapsed: '更多选项 ▼',

            // 语言选项
            selectLang: '选择语言',
            langZhCN: '简体中文',
            langZhTW: '繁体中文',
            langEn: '英语',
            langJa: '日语',
            langRu: '俄语',
            cancel: '取消',

            // 菜单设置
            menuSettingsTitle: '自定义菜单设置',
            selectMainMenu: '选择显示在主菜单的功能：',
            saveSettings: '保存设置',
            settingsSaved: '菜单设置已保存！请刷新页面生效',

            // 清理结果提示
            allClearedDetailed: '已清除 %s 的所有数据：\n%s\n\n注意：部分受保护数据（如HttpOnly Cookie）可能无法清除。如需彻底清理，建议使用浏览器的"清除网站数据"功能。',
            cookieCleared: '已清除 %s 的Cookie：\n- 总清除：%d 个\n- 剩余：%d 个（可能受保护）',
            localStorageCleared: '已清除 %s 的本地存储：\n- 共清除 %d 项数据',
            sessionStorageCleared: '已清除 %s 的会话存储：\n- 共清除 %d 项数据',
            indexedDBCleared: '已清除 %s 的IndexedDB数据库：\n- 共清除 %d 个数据库',
            cacheStorageCleared: '已清除 %s 的缓存存储：\n- 共清除 %d 个缓存',
            serviceWorkersCleared: '已注销 %s 的Service Worker：\n- 共注销 %d 个',
            frameStorageCleared: '已清除 %s 的同域框架存储：\n- 共清理 %d 个框架\n- 清除数据项：%d 个',

            noCookies: '未检测到 %s 的Cookie可清除',
            noLocalStorage: '未检测到 %s 的本地存储数据',
            noSessionStorage: '未检测到 %s 的会话存储数据',
            noIndexedDB: '未检测到 %s 的IndexedDB数据库',
            noCacheStorage: '未检测到 %s 的缓存存储',
            noServiceWorkers: '未检测到 %s 的Service Worker',
            noFrames: '未检测到 %s 的同域框架',
            nothingCleared: '未清除到 %s 的任何数据',

            cookiesCopied: '已复制Cookie到剪贴板',
            noCookiesToCopy: '无Cookie可复制',

            guide: `网页数据清理完全指南：
1. 客户端脚本可清理的数据类型：
   - Cookie（非HttpOnly类型）
   - 本地存储（LocalStorage）
   - 会话存储（SessionStorage）
   - IndexedDB数据库
   - 缓存存储（Cache Storage）
   - Service Worker
   - 同域框架内存储

2. 需要手动清理的数据类型：
   - HttpOnly Cookie（受浏览器保护）
   - 跨域关联数据（如第三方登录信息）
   - 浏览器级缓存（如DNS缓存）

3. 手动清理步骤：
   - 打开浏览器设置 → 隐私与安全
   - 找到"清除浏览数据"或类似选项
   - 勾选"Cookie和网站数据"及"缓存的图片和文件"
   - 选择合适的时间范围（建议"所有时间"）
   - 点击"清除数据"完成操作

4. 强制刷新页面（清理后推荐）：
   - 长按刷新按钮 → 选择"强制刷新"
   - 或使用快捷键：Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)`
        },

        'zh-TW': {
            clearAllDetailed: '清除 %s 所有數據（詳細）',
            clearCookies: '清除 %s Cookie（包括子域名）',
            clearLocalStorage: '清除 %s 本地存儲',
            clearSessionStorage: '清除 %s 會話存儲',
            clearIndexedDB: '清除 %s IndexedDB數據庫',
            clearCacheStorage: '清除 %s 緩存存儲',
            clearServiceWorkers: '註銷 %s Service Worker',
            clearFrameStorage: '清除 %s 同域框架存儲',
            copyCookies: '復制當前Cookie',
            clearGuide: '數據清理指南',
            switchLang: '切換語言',
            menuSettings: '菜單設置',
            moreOptions: '更多選項 ▶',
            moreOptionsCollapsed: '更多選項 ▼',

            selectLang: '選擇語言',
            langZhCN: '簡體中文',
            langZhTW: '繁體中文',
            langEn: '英語',
            langJa: '日語',
            langRu: '俄語',
            cancel: '取消',

            menuSettingsTitle: '自定義菜單設置',
            selectMainMenu: '選擇顯示在主菜單的功能：',
            saveSettings: '保存設置',
            settingsSaved: '菜單設置已保存！請刷新頁面生效',

            allClearedDetailed: '已清除 %s 的所有數據：\n%s\n\n注意：部分受保護數據（如HttpOnly Cookie）可能無法清除。如需徹底清理，建議使用瀏覽器的"清除網站數據"功能。',
            cookieCleared: '已清除 %s 的Cookie：\n- 總清除：%d 個\n- 剩餘：%d 個（可能受保護）',
            localStorageCleared: '已清除 %s 的本地存儲：\n- 共清除 %d 項數據',
            sessionStorageCleared: '已清除 %s 的會話存儲：\n- 共清除 %d 項數據',
            indexedDBCleared: '已清除 %s 的IndexedDB數據庫：\n- 共清除 %d 個數據庫',
            cacheStorageCleared: '已清除 %s 的緩存存儲：\n- 共清除 %d 個緩存',
            serviceWorkersCleared: '已註銷 %s 的Service Worker：\n- 共註銷 %d 個',
            frameStorageCleared: '已清除 %s 的同域框架存儲：\n- 共清理 %d 個框架\n- 清除數據項：%d 個',

            noCookies: '未檢測到 %s 的Cookie可清除',
            noLocalStorage: '未檢測到 %s 的本地存儲數據',
            noSessionStorage: '未檢測到 %s 的會話存儲數據',
            noIndexedDB: '未檢測到 %s 的IndexedDB數據庫',
            noCacheStorage: '未檢測到 %s 的緩存存儲',
            noServiceWorkers: '未檢測到 %s 的Service Worker',
            noFrames: '未檢測到 %s 的同域框架',
            nothingCleared: '未清除到 %s 的任何數據',

            cookiesCopied: '已復制Cookie到剪貼簿',
            noCookiesToCopy: '無Cookie可復制',

            guide: `網頁數據清理完全指南：
1. 客戶端腳本可清理的數據類型：
   - Cookie（非HttpOnly類型）
   - 本地存儲（LocalStorage）
   - 會話存儲（SessionStorage）
   - IndexedDB數據庫
   - 緩存存儲（Cache Storage）
   - Service Worker
   - 同域框架內存儲

2. 需要手動清理的數據類型：
   - HttpOnly Cookie（受瀏覽器保護）
   - 跨域關聯數據（如第三方登錄信息）
   - 瀏覽器級緩存（如DNS緩存）

3. 手動清理步驟：
   - 打開瀏覽器設置 → 隱私與安全
   - 找到"清除瀏覽數據"或類似選項
   - 勾選"Cookie和網站數據"及"緩存的圖片和文件"
   - 選擇合適的時間範圍（建議"所有時間"）
   - 點擊"清除數據"完成操作

4. 強制刷新頁面（清理後推薦）：
   - 長按刷新按鈕 → 選擇"強制刷新"
   - 或使用快捷鍵：Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)`
        },

        'en': {
            clearAllDetailed: 'Clear %s all data (detailed)',
            clearCookies: 'Clear %s Cookies (including subdomains)',
            clearLocalStorage: 'Clear %s Local Storage',
            clearSessionStorage: 'Clear %s Session Storage',
            clearIndexedDB: 'Clear %s IndexedDB Databases',
            clearCacheStorage: 'Clear %s Cache Storage',
            clearServiceWorkers: 'Unregister %s Service Workers',
            clearFrameStorage: 'Clear %s Same-Domain Frame Storage',
            copyCookies: 'Copy Current Cookies',
            clearGuide: 'Data Clearing Guide',
            switchLang: 'Switch Language',
            menuSettings: 'Menu Settings',
            moreOptions: 'More Options ▶',
            moreOptionsCollapsed: 'More Options ▼',

            selectLang: 'Select Language',
            langZhCN: 'Simplified Chinese',
            langZhTW: 'Traditional Chinese',
            langEn: 'English',
            langJa: 'Japanese',
            langRu: 'Russian',
            cancel: 'Cancel',

            menuSettingsTitle: 'Custom Menu Settings',
            selectMainMenu: 'Select features to show in main menu:',
            saveSettings: 'Save Settings',
            settingsSaved: 'Menu settings saved! Please refresh the page to apply',

            allClearedDetailed: 'All data cleared for %s:\n%s\n\nNote: Some protected data (like HttpOnly Cookies) may not be cleared. For complete clearing, use your browser\'s "Clear site data" function.',
            cookieCleared: 'Cookies cleared for %s:\n- Total cleared: %d\n- Remaining: %d (may be protected)',
            localStorageCleared: 'Local Storage cleared for %s:\n- Total items cleared: %d',
            sessionStorageCleared: 'Session Storage cleared for %s:\n- Total items cleared: %d',
            indexedDBCleared: 'IndexedDB databases cleared for %s:\n- Total databases cleared: %d',
            cacheStorageCleared: 'Cache Storage cleared for %s:\n- Total caches cleared: %d',
            serviceWorkersCleared: 'Service Workers unregistered for %s:\n- Total unregistered: %d',
            frameStorageCleared: 'Same-domain frame storage cleared for %s:\n- Frames processed: %d\n- Items cleared: %d',

            noCookies: 'No cookies detected for %s',
            noLocalStorage: 'No Local Storage data detected for %s',
            noSessionStorage: 'No Session Storage data detected for %s',
            noIndexedDB: 'No IndexedDB databases detected for %s',
            noCacheStorage: 'No Cache Storage detected for %s',
            noServiceWorkers: 'No Service Workers detected for %s',
            noFrames: 'No same-domain frames detected for %s',
            nothingCleared: 'No data cleared for %s',

            cookiesCopied: 'Cookies copied to clipboard',
            noCookiesToCopy: 'No cookies to copy',

            guide: `Complete Web Data Clearing Guide:
1. Data types that can be cleared by client scripts:
   - Cookies (non-HttpOnly types)
   - Local Storage
   - Session Storage
   - IndexedDB databases
   - Cache Storage
   - Service Workers
   - Storage within same-domain frames

2. Data types requiring manual clearing:
   - HttpOnly Cookies (protected by browser)
   - Cross-domain related data (e.g., third-party login info)
   - Browser-level cache (e.g., DNS cache)

3. Manual clearing steps:
   - Open browser settings → Privacy & Security
   - Find "Clear browsing data" or similar option
   - Check "Cookies and site data" and "Cached images and files"
   - Select appropriate time range (recommend "All time")
   - Click "Clear data" to complete

4. Force refresh page (recommended after clearing):
   - Long press refresh button → Select "Force refresh"
   - Or use shortcut: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)`
        },

        'ja': {
            clearAllDetailed: '%s のすべてのデータを消去（詳細）',
            clearCookies: '%s のCookieを消去（サブドメインを含む）',
            clearLocalStorage: '%s のローカルストレージを消去',
            clearSessionStorage: '%s のセッションストレージを消去',
            clearIndexedDB: '%s のIndexedDBデータベースを消去',
            clearCacheStorage: '%s のキャッシュストレージを消去',
            clearServiceWorkers: '%s のService Workerを登録解除',
            clearFrameStorage: '%s の同ドメインフレームストレージを消去',
            copyCookies: '現在のCookieをコピー',
            clearGuide: 'データ消去ガイド',
            switchLang: '言語を切り替え',
            menuSettings: 'メニュー設定',
            moreOptions: 'その他のオプション ▶',
            moreOptionsCollapsed: 'その他のオプション ▼',

            selectLang: '言語を選択',
            langZhCN: '簡体字中国語',
            langZhTW: '繁体字中国語',
            langEn: '英語',
            langJa: '日本語',
            langRu: 'ロシア語',
            cancel: 'キャンセル',

            menuSettingsTitle: 'カスタムメニュー設定',
            selectMainMenu: 'メインメニューに表示する機能を選択：',
            saveSettings: '設定を保存',
            settingsSaved: 'メニュー設定が保存されました！適用するにはページを更新してください',

            allClearedDetailed: '%s のすべてのデータを消去しました：\n%s\n\n注：一部の保護されたデータ（HttpOnly Cookieなど）は消去できない場合があります。完全に消去するには、ブラウザの「サイトデータを消去」機能を使用してください。',
            cookieCleared: '%s のCookieを消去しました：\n- 総消去数：%d 個\n- 残り：%d 個（保護されている可能性があります）',
            localStorageCleared: '%s のローカルストレージを消去しました：\n- 総消去項目：%d 個',
            sessionStorageCleared: '%s のセッションストレージを消去しました：\n- 総消去項目：%d 個',
            indexedDBCleared: '%s のIndexedDBデータベースを消去しました：\n- 総消去データベース：%d 個',
            cacheStorageCleared: '%s のキャッシュストレージを消去しました：\n- 総消去キャッシュ：%d 個',
            serviceWorkersCleared: '%s のService Workerを登録解除しました：\n- 総登録解除数：%d 個',
            frameStorageCleared: '%s の同ドメインフレームストレージを消去しました：\n- 処理されたフレーム：%d 個\n- 消去された項目：%d 個',

            noCookies: '%s のCookieは検出されませんでした',
            noLocalStorage: '%s のローカルストレージデータは検出されませんでした',
            noSessionStorage: '%s のセッションストレージデータは検出されませんでした',
            noIndexedDB: '%s のIndexedDBデータベースは検出されませんでした',
            noCacheStorage: '%s のキャッシュストレージは検出されませんでした',
            noServiceWorkers: '%s のService Workerは検出されませんでした',
            noFrames: '%s の同ドメインフレームは検出されませんでした',
            nothingCleared: '%s のデータは消去されませんでした',

            cookiesCopied: 'Cookieがクリップボードにコピーされました',
            noCookiesToCopy: 'コピーするCookieがありません',

            guide: `Webデータ消去完全ガイド：
1. クライアントスクリプトで消去できるデータタイプ：
   - Cookie（HttpOnlyタイプを除く）
   - ローカルストレージ
   - セッションストレージ
   - IndexedDBデータベース
   - キャッシュストレージ
   - Service Worker
   - 同ドメインフレーム内のストレージ

2. 手動で消去する必要があるデータタイプ：
   - HttpOnly Cookie（ブラウザによって保護されています）
   - クロスドメイン関連データ（サードパーティのログイン情報など）
   - ブラウザレベルのキャッシュ（DNSキャッシュなど）

3. 手動消去手順：
   - ブラウザ設定を開く → プライバシーとセキュリティ
   - 「閲覧データを消去」または類似のオプションを探す
   - 「Cookieとサイトデータ」と「キャッシュされた画像とファイル」にチェックを入れる
   - 適切な時間範囲を選択（「すべての期間」を推奨）
   - 「データを消去」をクリックして完了

4. ページを強制リロード（消去後に推奨）：
   - リロードボタンを長押し → 「強制リロード」を選択
   - またはショートカットを使用：Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)`
        },

        'ru': {
            clearAllDetailed: 'Очистить %s все данные (подробно)',
            clearCookies: 'Очистить %s Cookies (включая поддомены)',
            clearLocalStorage: 'Очистить %s локальное хранилище',
            clearSessionStorage: 'Очистить %s сеансовое хранилище',
            clearIndexedDB: 'Очистить %s базы данных IndexedDB',
            clearCacheStorage: 'Очистить %s кэш хранилища',
            clearServiceWorkers: 'Отменить регистрацию %s Service Workers',
            clearFrameStorage: 'Очистить %s хранилище фреймов того же домена',
            copyCookies: 'Скопировать текущие Cookies',
            clearGuide: 'Руководство по очистке данных',
            switchLang: 'Сменить язык',
            menuSettings: 'Настройки меню',
            moreOptions: 'Больше опций ▶',
            moreOptionsCollapsed: 'Больше опций ▼',

            selectLang: 'Выберите язык',
            langZhCN: 'Упрощенный китайский',
            langZhTW: 'Традиционный китайский',
            langEn: 'Английский',
            langJa: 'Японский',
            langRu: 'Русский',
            cancel: 'Отмена',

            menuSettingsTitle: 'Настройки пользовательского меню',
            selectMainMenu: 'Выберите функции для отображения в основном меню:',
            saveSettings: 'Сохранить настройки',
            settingsSaved: 'Настройки меню сохранены! Обновите страницу для применения',

            allClearedDetailed: 'Все данные очищены для %s:\n%s\n\nПримечание: Некоторые защищенные данные (например, HttpOnly Cookies) могут не очищаться. Для полной очистки используйте функцию браузера "Очистить данные сайта".',
            cookieCleared: 'Cookies очищены для %s:\n- Всего очищено: %d\n- Осталось: %d (могут быть защищены)',
            localStorageCleared: 'Локальное хранилище очищено для %s:\n- Всего очищено элементов: %d',
            sessionStorageCleared: 'Сеансовое хранилище очищено для %s:\n- Всего очищено элементов: %d',
            indexedDBCleared: 'Базы данных IndexedDB очищены для %s:\n- Всего очищено баз: %d',
            cacheStorageCleared: 'Кэш хранилища очищен для %s:\n- Всего очищено кэшей: %d',
            serviceWorkersCleared: 'Service Workers отменены для %s:\n- Всего отменено: %d',
            frameStorageCleared: 'Хранилище фреймов того же домена очищено для %s:\n- Обработанных фреймов: %d\n- Очищенных элементов: %d',

            noCookies: 'Cookies для %s не обнаружены',
            noLocalStorage: 'Локальные данные для %s не обнаружены',
            noSessionStorage: 'Сеансовые данные для %s не обнаружены',
            noIndexedDB: 'Базы данных IndexedDB для %s не обнаружены',
            noCacheStorage: 'Кэш хранилища для %s не обнаружен',
            noServiceWorkers: 'Service Workers для %s не обнаружены',
            noFrames: 'Фреймы того же домена для %s не обнаружены',
            nothingCleared: 'Данные для %s не очищены',

            cookiesCopied: 'Cookies скопированы в буфер обмена',
            noCookiesToCopy: 'Нет cookies для копирования',

            guide: `Полное руководство по очистке веб-данных：
1. Типы данных, которые можно очистить клиентскими скриптами:
   - Cookies (не HttpOnly типы)
   - Локальное хранилище
   - Сеансовое хранилище
   - Базы данных IndexedDB
   - Кэш хранилища
   - Service Workers
   - Хранилище в рамках того же домена

2. Типы данных, требующие ручной очистки:
   - HttpOnly Cookies (защищены браузером)
   - Кросс-доменные связанные данные (например, данные сторонних входов)
   - Браузерный кэш (например, DNS кэш)

3. Шаги ручной очистки:
   - Откройте настройки браузера → Конфиденциальность и безопасность
   - Найдите "Очистить данные браузера" или аналогичную опцию
   - Отметьте "Cookies и данные сайтов" и "Кэшированные изображения и файлы"
   - Выберите подходящий временной диапазон (рекомендуется "За все время")
   - Нажмите "Очистить данные" для завершения

4. Принудительная перезагрузка страницы (рекомендуется после очистки):
   - Долгое нажатие кнопки перезагрузки → Выберите "Принудительная перезагрузка"
   - Или используйте сочетание клавиш: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)`
        }
    };

    // 核心状态管理
    let state = {
        domain: window.location.hostname,
        subdomains: getAllPossibleSubdomains(window.location.hostname),
        currentLang: getInitialLanguage(),
        menuSettings: getMenuSettings(),
        mainMenuIds: {},
        subMenuIds: null,
        subMenuExpanded: false
    };

    /**
     * 获取菜单设置（带默认值）
     */
    function getMenuSettings() {
        const saved = GM_getValue('menu_settings', null);
        if (saved) {
            return saved;
        }

        // 默认设置（按要求调整主菜单默认项）
        const defaultSettings = {};
        Object.keys(ALL_FEATURES).forEach(key => {
            defaultSettings[key] = ALL_FEATURES[key].defaultInMain;
        });
        return defaultSettings;
    }

    /**
     * 保存菜单设置
     */
    function saveMenuSettings(settings) {
        GM_setValue('menu_settings', settings);
        state.menuSettings = settings;
    }

    /**
     * 获取初始语言（带记忆功能）
     */
    function getInitialLanguage() {
        const savedLang = GM_getValue('preferred_language', null);
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-SG')) return 'zh-CN';
        if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) return 'zh-TW';
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('ja')) return 'ja';
        if (browserLang.startsWith('ru')) return 'ru';

        return 'en';
    }

    // 翻译函数
    function t(key, ...args) {
        const translation = translations[state.currentLang]?.[key] || translations['en'][key];
        return translation ? sprintf(translation, ...args) : key;
    }

    // 字符串格式化
    function sprintf(str, ...args) {
        return str.replace(/%s|%d/g, match => {
            return args.length > 0 ? args.shift() : match;
        });
    }

    /**
     * 生成所有可能的子域名组合
     */
    function getAllPossibleSubdomains(hostname) {
        const parts = hostname.split('.');
        const subdomains = new Set();

        // 添加基础域名
        subdomains.add(hostname);
        subdomains.add(hostname.replace(/^www\./i, ''));
        subdomains.add('.' + hostname);

        // 生成所有可能的子域名组合
        for (let i = 0; i < parts.length; i++) {
            for (let j = i; j < parts.length; j++) {
                const sub = parts.slice(i, j + 1).join('.');
                if (sub) {
                    subdomains.add(sub);
                    subdomains.add('.' + sub);
                }
            }
        }

        return Array.from(subdomains);
    }

    /**
     * 创建菜单设置对话框
     */
    function createMenuSettingsDialog() {
        // 移除已存在的对话框
        const existingDialog = document.querySelector('#menu-settings-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        const existingOverlay = document.querySelector('#menu-settings-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'menu-settings-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999998;
        `;

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.id = 'menu-settings-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.3);
            z-index: 999999;
            min-width: 300px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // 标题
        const title = document.createElement('h3');
        title.textContent = t('menuSettingsTitle');
        title.style.margin = '0 0 15px 0';
        title.style.textAlign = 'center';
        dialog.appendChild(title);

        // 说明文字
        const description = document.createElement('p');
        description.textContent = t('selectMainMenu');
        description.style.margin = '0 0 15px 0';
        dialog.appendChild(description);

        // 选项容器
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexDirection = 'column';
        optionsContainer.style.gap = '10px';
        dialog.appendChild(optionsContainer);

        // 添加所有功能选项
        Object.keys(ALL_FEATURES).forEach(key => {
            if (key === 'menuSettings') return; // 菜单设置本身可在次级菜单找到

            const feature = ALL_FEATURES[key];
            const optionDiv = document.createElement('div');
            optionDiv.style.display = 'flex';
            optionDiv.style.alignItems = 'center';
            optionDiv.style.gap = '8px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `feature-${key}`;
            checkbox.checked = state.menuSettings[key] || false;

            const label = document.createElement('label');
            label.htmlFor = `feature-${key}`;
            label.textContent = t(feature.nameKey, state.domain);

            optionDiv.appendChild(checkbox);
            optionDiv.appendChild(label);
            optionsContainer.appendChild(optionDiv);
        });

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '20px';
        dialog.appendChild(buttonContainer);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = t('saveSettings');
        saveButton.style.cssText = `
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveButton.addEventListener('click', () => {
            const newSettings = { ...state.menuSettings };

            // 收集所有选项
            Object.keys(ALL_FEATURES).forEach(key => {
                if (key === 'menuSettings') return;

                const checkbox = document.getElementById(`feature-${key}`);
                if (checkbox) {
                    newSettings[key] = checkbox.checked;
                }
            });

            // 保存设置
            saveMenuSettings(newSettings);
            alert(t('settingsSaved'));

            // 关闭对话框
            dialog.remove();
            overlay.remove();
        });
        buttonContainer.appendChild(saveButton);

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = t('cancel');
        cancelButton.style.cssText = `
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        cancelButton.addEventListener('click', () => {
            dialog.remove();
            overlay.remove();
        });
        buttonContainer.appendChild(cancelButton);

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    /**
     * 语言选择弹窗
     */
    function createLanguageDialog() {
        if (document.querySelector('#lang-dialog')) return;

        const dialog = document.createElement('div');
        dialog.id = 'lang-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.3);
            z-index: 999999;
            min-width: 280px;
        `;

        const title = document.createElement('h3');
        title.textContent = t('selectLang');
        title.style.margin = '0 0 15px 0';
        title.style.textAlign = 'center';
        title.style.fontFamily = 'Arial, sans-serif';
        dialog.appendChild(title);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '8px';
        dialog.appendChild(buttonContainer);

        const languageButtons = [
            { code: 'zh-CN', labelKey: 'langZhCN' },
            { code: 'zh-TW', labelKey: 'langZhTW' },
            { code: 'en', labelKey: 'langEn' },
            { code: 'ja', labelKey: 'langJa' },
            { code: 'ru', labelKey: 'langRu' }
        ];

        languageButtons.forEach(lang => {
            const btn = document.createElement('button');
            btn.textContent = t(lang.labelKey);
            btn.style.cssText = `
                padding: 10px;
                cursor: pointer;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: ${state.currentLang === lang.code ? '#f0f7ff' : 'white'};
                text-align: left;
                transition: all 0.2s;
            `;
            btn.addEventListener('mouseover', () => btn.style.background = '#f5f5f5');
            btn.addEventListener('mouseout', () => {
                if (state.currentLang !== lang.code) {
                    btn.style.background = 'white';
                }
            });
            btn.addEventListener('click', () => {
                switchLanguage(lang.code);
                document.body.removeChild(dialog);
                document.body.removeChild(overlay);
            });
            buttonContainer.appendChild(btn);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = t('cancel');
        cancelBtn.style.cssText = `
            padding: 10px;
            cursor: pointer;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
            margin-top: 8px;
            transition: all 0.2s;
        `;
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });
        buttonContainer.appendChild(cancelBtn);

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999998;
        `;
        overlay.addEventListener('click', () => {
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    /**
     * 切换语言并保存
     */
    function switchLanguage(lang) {
        if (translations[lang] && lang !== state.currentLang) {
            state.currentLang = lang;
            GM_setValue('preferred_language', lang);
            unregisterAllMenus();
            registerMainMenu();
        }
    }

    /**
     * 显示清理指南
     */
    function showCacheStorageGuide() {
        alert(t('guide'));
    }

    // 详细清理功能实现（按存储类型划分）
    const DetailedCleaner = {
        /**
         * 清理Cookie（包括所有子域名）
         */
        clearCookies() {
            const initialCookies = document.cookie ? document.cookie.split('; ').filter(c => c).length : 0;
            if (initialCookies === 0) {
                return { cleared: 0, remaining: 0 };
            }

            // 常见路径列表
            const paths = ['/', '/login', '/account', '/auth', '/user', '/api', '/service', '/admin'];

            // 清除当前页面的所有Cookie
            document.cookie.split('; ').forEach(cookie => {
                const name = cookie.split('=')[0];
                paths.forEach(path => {
                    // 尝试所有可能的子域名组合
                    state.subdomains.forEach(domain => {
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain};`;
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain};`;
                    });
                });
            });

            // 计算剩余Cookie数量
            const remainingCookies = document.cookie ? document.cookie.split('; ').filter(c => c).length : 0;

            return {
                cleared: initialCookies - remainingCookies,
                remaining: remainingCookies
            };
        },

        /**
         * 清理LocalStorage
         */
        clearLocalStorage() {
            const initialCount = localStorage.length;
            if (initialCount > 0) {
                localStorage.clear();
            }
            return initialCount;
        },

        /**
         * 清理SessionStorage
         */
        clearSessionStorage() {
            const initialCount = sessionStorage.length;
            if (initialCount > 0) {
                sessionStorage.clear();
            }
            return initialCount;
        },

        /**
         * 清理IndexedDB数据库
         */
        clearIndexedDB() {
            return new Promise(resolve => {
                let clearedCount = 0;

                if (!window.indexedDB) {
                    resolve(0);
                    return;
                }

                // 尝试获取并删除所有可检测的IndexedDB数据库
                indexedDB.databases().then(databases => {
                    const totalDbs = databases.length;
                    if (totalDbs === 0) {
                        resolve(0);
                        return;
                    }

                    databases.forEach((db, index) => {
                        if (db.name) {
                            const request = indexedDB.deleteDatabase(db.name);
                            request.onsuccess = () => {
                                clearedCount++;
                                if (index === totalDbs - 1) {
                                    resolve(clearedCount);
                                }
                            };
                            request.onerror = () => {
                                if (index === totalDbs - 1) {
                                    resolve(clearedCount);
                                }
                            };
                        } else if (index === totalDbs - 1) {
                            resolve(clearedCount);
                        }
                    });
                }).catch(() => {
                    resolve(0);
                });
            });
        },

        /**
         * 清理Cache Storage
         */
        clearCacheStorage() {
            return new Promise(resolve => {
                if (!('caches' in window)) {
                    resolve(0);
                    return;
                }

                caches.keys().then(cacheNames => {
                    const totalCaches = cacheNames.length;
                    if (totalCaches === 0) {
                        resolve(0);
                        return;
                    }

                    let clearedCount = 0;
                    cacheNames.forEach((cacheName, index) => {
                        // 只清除与当前域名相关的缓存
                        if (cacheName.includes(state.domain) ||
                            cacheName.includes(state.domain.replace(/^www\./, ''))) {
                            caches.delete(cacheName).then(success => {
                                if (success) clearedCount++;
                                if (index === totalCaches - 1) {
                                    resolve(clearedCount);
                                }
                            });
                        } else if (index === totalCaches - 1) {
                            resolve(clearedCount);
                        }
                    });
                }).catch(() => {
                    resolve(0);
                });
            });
        },

        /**
         * 注销Service Worker
         */
        clearServiceWorkers() {
            return new Promise(resolve => {
                if (!('serviceWorker' in navigator)) {
                    resolve(0);
                    return;
                }

                navigator.serviceWorker.getRegistrations().then(registrations => {
                    const totalWorkers = registrations.length;
                    if (totalWorkers === 0) {
                        resolve(0);
                        return;
                    }

                    let unregisteredCount = 0;
                    registrations.forEach((registration, index) => {
                        // 只注销与当前域名相关的Service Worker
                        if (registration.scope.includes(state.domain)) {
                            registration.unregister().then(success => {
                                if (success) unregisteredCount++;
                                if (index === totalWorkers - 1) {
                                    resolve(unregisteredCount);
                                }
                            });
                        } else if (index === totalWorkers - 1) {
                            resolve(unregisteredCount);
                        }
                    });
                }).catch(() => {
                    resolve(0);
                });
            });
        },

        /**
         * 清理同域框架内的存储
         */
        clearFrameStorage() {
            let frameCount = 0;
            let itemCount = 0;

            // 查找所有框架元素
            const frames = document.querySelectorAll('iframe, frame, embed, object');
            frames.forEach(frame => {
                try {
                    // 检查是否为同域框架
                    if (frame.contentWindow &&
                        frame.contentWindow.location.hostname &&
                        (state.subdomains.includes(frame.contentWindow.location.hostname) ||
                         frame.contentWindow.location.hostname.includes(state.domain))) {

                        frameCount++;

                        // 清理框架内的localStorage
                        const frameLocal = frame.contentWindow.localStorage.length;
                        if (frameLocal > 0) {
                            frame.contentWindow.localStorage.clear();
                            itemCount += frameLocal;
                        }

                        // 清理框架内的sessionStorage
                        const frameSession = frame.contentWindow.sessionStorage.length;
                        if (frameSession > 0) {
                            frame.contentWindow.sessionStorage.clear();
                            itemCount += frameSession;
                        }
                    }
                } catch (e) {
                    // 跨域框架无法访问，忽略
                }
            });

            return {
                frameCount,
                itemCount
            };
        }
    };

    /**
     * 处理各类清理操作的结果展示
     */
    const ResultHandler = {
        handleCookies() {
            const result = DetailedCleaner.clearCookies();
            if (result.cleared > 0) {
                alert(t('cookieCleared', state.domain, result.cleared, result.remaining));
                location.reload();
            } else {
                alert(t('noCookies', state.domain));
            }
        },

        handleLocalStorage() {
            const count = DetailedCleaner.clearLocalStorage();
            if (count > 0) {
                alert(t('localStorageCleared', state.domain, count));
                location.reload();
            } else {
                alert(t('noLocalStorage', state.domain));
            }
        },

        handleSessionStorage() {
            const count = DetailedCleaner.clearSessionStorage();
            if (count > 0) {
                alert(t('sessionStorageCleared', state.domain, count));
                location.reload();
            } else {
                alert(t('noSessionStorage', state.domain));
            }
        },

        async handleIndexedDB() {
            const count = await DetailedCleaner.clearIndexedDB();
            if (count > 0) {
                alert(t('indexedDBCleared', state.domain, count));
                location.reload();
            } else {
                alert(t('noIndexedDB', state.domain));
            }
        },

        async handleCacheStorage() {
            const count = await DetailedCleaner.clearCacheStorage();
            if (count > 0) {
                alert(t('cacheStorageCleared', state.domain, count));
                location.reload();
            } else {
                alert(t('noCacheStorage', state.domain));
            }
        },

        async handleServiceWorkers() {
            const count = await DetailedCleaner.clearServiceWorkers();
            if (count > 0) {
                alert(t('serviceWorkersCleared', state.domain, count));
                location.reload();
            } else {
                alert(t('noServiceWorkers', state.domain));
            }
        },

        handleFrameStorage() {
            const result = DetailedCleaner.clearFrameStorage();
            if (result.frameCount > 0 && result.itemCount > 0) {
                alert(t('frameStorageCleared', state.domain, result.frameCount, result.itemCount));
                location.reload();
            } else {
                alert(t('noFrames', state.domain));
            }
        },

        async handleClearAll() {
            // 依次清理所有类型的数据
            const cookieResult = DetailedCleaner.clearCookies();
            const localStorageCount = DetailedCleaner.clearLocalStorage();
            const sessionStorageCount = DetailedCleaner.clearSessionStorage();
            const indexedDBCount = await DetailedCleaner.clearIndexedDB();
            const cacheStorageCount = await DetailedCleaner.clearCacheStorage();
            const serviceWorkersCount = await DetailedCleaner.clearServiceWorkers();
            const frameResult = DetailedCleaner.clearFrameStorage();

            // 汇总清理结果
            const results = [];
            if (cookieResult.cleared > 0) {
                results.push(`- Cookie：${cookieResult.cleared} 个（剩余 ${cookieResult.remaining} 个）`);
            }
            if (localStorageCount > 0) {
                results.push(`- 本地存储：${localStorageCount} 项`);
            }
            if (sessionStorageCount > 0) {
                results.push(`- 会话存储：${sessionStorageCount} 项`);
            }
            if (indexedDBCount > 0) {
                results.push(`- IndexedDB：${indexedDBCount} 个数据库`);
            }
            if (cacheStorageCount > 0) {
                results.push(`- 缓存存储：${cacheStorageCount} 个`);
            }
            if (serviceWorkersCount > 0) {
                results.push(`- Service Worker：${serviceWorkersCount} 个`);
            }
            if (frameResult.itemCount > 0) {
                results.push(`- 同域框架：${frameResult.itemCount} 项（${frameResult.frameCount} 个框架）`);
            }

            // 显示结果
            if (results.length > 0) {
                alert(t('allClearedDetailed', state.domain, results.join('\n')));
                location.reload();
            } else {
                alert(t('nothingCleared', state.domain));
            }
        }
    };

    /**
     * 注册次级菜单
     */
    function registerSubMenu() {
        // 先注销已存在的次级菜单
        if (state.subMenuIds) {
            Object.values(state.subMenuIds).forEach(id => {
                if (id) GM_unregisterMenuCommand(id);
            });
        }

        state.subMenuIds = {};
        state.subMenuExpanded = true;

        // 先更新"更多选项"的显示文本（切换箭头方向）
        unregisterMainMenu();
        registerMainMenu();

        // 添加次级菜单选项（所有不在主菜单中的功能）
        const subMenuOrder = [
            'clearLocalStorage',
            'clearIndexedDB',
            'clearCacheStorage',
            'clearServiceWorkers',
            'clearFrameStorage',
            'copyCookies',
            'clearGuide',
            'switchLang',
            'menuSettings'
        ];

        subMenuOrder.forEach(key => {
            // 跳过主菜单中已有的功能
            if (state.menuSettings[key]) {
                return;
            }

            // 对于清理相关功能，菜单项显示时包含域名
            const label = ['copyCookies', 'clearGuide', 'switchLang', 'menuSettings'].includes(key)
                ? t(ALL_FEATURES[key].nameKey)
                : t(ALL_FEATURES[key].nameKey, state.domain);

            switch (key) {
                case 'clearLocalStorage':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        ResultHandler.handleLocalStorage
                    );
                    break;
                case 'clearSessionStorage':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        ResultHandler.handleSessionStorage
                    );
                    break;
                case 'clearIndexedDB':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        ResultHandler.handleIndexedDB
                    );
                    break;
                case 'clearCacheStorage':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        ResultHandler.handleCacheStorage
                    );
                    break;
                case 'clearServiceWorkers':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        ResultHandler.handleServiceWorkers
                    );
                    break;
                case 'clearFrameStorage':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        ResultHandler.handleFrameStorage
                    );
                    break;
                case 'copyCookies':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        () => {
                            const cookies = document.cookie;
                            if (cookies) {
                                GM_setClipboard(cookies);
                                alert(t('cookiesCopied'));
                            } else {
                                alert(t('noCookiesToCopy'));
                            }
                        }
                    );
                    break;
                case 'clearGuide':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        showCacheStorageGuide
                    );
                    break;
                case 'switchLang':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        createLanguageDialog
                    );
                    break;
                case 'menuSettings':
                    state.subMenuIds[key] = GM_registerMenuCommand(
                        label,
                        createMenuSettingsDialog
                    );
                    break;
            }
        });
    }

    /**
     * 注销次级菜单
     */
    function unregisterSubMenu() {
        if (state.subMenuIds) {
            Object.values(state.subMenuIds).forEach(id => {
                if (id) GM_unregisterMenuCommand(id);
            });
            state.subMenuIds = null;
            state.subMenuExpanded = false;

            // 更新"更多选项"的显示文本
            unregisterMainMenu();
            registerMainMenu();
        }
    }

    /**
     * 注销主菜单
     */
    function unregisterMainMenu() {
        Object.values(state.mainMenuIds).forEach(id => {
            if (id) GM_unregisterMenuCommand(id);
        });
        state.mainMenuIds = {};
    }

    /**
     * 注册主菜单（按指定顺序）
     */
    function registerMainMenu() {
        // 先注销已存在的主菜单
        unregisterMainMenu();

        // 主菜单固定顺序
        const mainMenuOrder = [
            'clearAllDetailed',
            'clearCookies',
            'clearSessionStorage',
            'moreOptions'
        ];

        mainMenuOrder.forEach(key => {
            if (key === 'moreOptions') {
                // "更多选项"带可视开关（箭头指示展开/收起状态）
                const label = state.subMenuExpanded ? t('moreOptionsCollapsed') : t('moreOptions');
                state.mainMenuIds.moreOptions = GM_registerMenuCommand(
                    label,
                    () => {
                        if (state.subMenuExpanded) {
                            unregisterSubMenu();
                        } else {
                            registerSubMenu();
                        }
                    }
                );
            } else if (state.menuSettings[key]) {
                // 其他主菜单选项，包含域名
                const label = t(ALL_FEATURES[key].nameKey, state.domain);
                switch (key) {
                    case 'clearAllDetailed':
                        state.mainMenuIds[key] = GM_registerMenuCommand(
                            label,
                            ResultHandler.handleClearAll
                        );
                        break;
                    case 'clearCookies':
                        state.mainMenuIds[key] = GM_registerMenuCommand(
                            label,
                            ResultHandler.handleCookies
                        );
                        break;
                    case 'clearSessionStorage':
                        state.mainMenuIds[key] = GM_registerMenuCommand(
                            label,
                            ResultHandler.handleSessionStorage
                        );
                        break;
                }
            }
        });
    }

    /**
     * 注销所有菜单
     */
    function unregisterAllMenus() {
        unregisterMainMenu();
        unregisterSubMenu();
    }

    // 初始化主菜单
    registerMainMenu();

})();