// ==UserScript==
// @name                LOLICON Hentai Enhancer
// @name:zh-CN          LOLICON Hentai 增强器
// @name:zh-TW          LOLICON Hentai 增強器
// @name:ja             LOLICON Hentai 強化版
// @name:ko             LOLICON Hentai 향상기
// @name:ru             LOLICON Hentai Улучшатель
// @namespace           https://greasyfork.org/scripts/516145
// @version             2025.12.24
// @description         E-Hentai/ExHentai Auto Window Adaptation, Adjustable Thumbnails (size/margin), Quick Favorite, Infinite Scroll, Load More Thumbnails, Quick Tag & Search Enhancer
// @description:zh-CN   E-Hentai/ExHentai 自动适配窗口尺寸、缩略图调整（大小/间距）、快捷收藏、无限滚动、加载更多缩略图、快捷标签 & 搜索增强
// @description:zh-TW   E-Hentai/ExHentai 自動適配視窗尺寸、縮圖調整（大小/間距）、快捷收藏、無限滾動、加載更多縮圖、快捷標籤 & 搜尋增強
// @description:ja      E-Hentai/ExHentai ウィンドウ自動適応、サムネイルサイズ・間隔調整、クイックお気に入り、無限スクロール、サムネイル追加読み込み、クイックタグ & 検索強化
// @description:ko      E-Hentai/ExHentai 자동 창 크기 조절, 썸네일 크기/간격 조절, 빠른 즐겨찾기, 무한 스크롤, 썸네일 더보기, 빠른 태그 & 검색 강화
// @description:ru      E-Hentai/ExHentai Автоматическая подгонка окна, Настройка миниатюр (размер/отступ), Быстрое добавление в избранное, Бесконечная прокрутка, Загрузка дополнительных миниатюр, Быстрые теги & поиск улучшены
// @icon                https://e-hentai.org/favicon.ico
// @match               *://e-hentai.org/*
// @match               *://exhentai.org/*
// @match               *://exhentai55ld2wyap5juskbm67czulomrouspdacjamjeloj7ugjbsad.onion/*
// @match               *://*.e-hentai.org/*
// @match               *://*.exhentai.org/*
// @match               *://*.exhentai55ld2wyap5juskbm67czulomrouspdacjamjeloj7ugjbsad.onion/*
// @run-at              document-end
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_deleteValue
// @grant               GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/516145/LOLICON%20Hentai%20%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/516145/LOLICON%20Hentai%20%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 根据 id 获取对应的 DOM 元素 */
    const $i = (id) => document.getElementById(id);
    /** 根据类名获取 DOM 集合 (HTMLCollection) */
    const $c = (name) => document.getElementsByClassName(name);
    /** querySelector 单个元素 */
    const $ = (sel) => document.querySelector(sel);
    /** querySelectorAll 多个元素 (NodeList) */
    const $$ = (sel) => document.querySelectorAll(sel);
    /** 创建元素 */
    const $el = (tag) => document.createElement(tag);

    /** 获取当前设备的设备像素比（DPR）*/
    const devicePixelRatio = window.devicePixelRatio || 1;

    /** 用于存储布局相关的动态数据 */
    const layout = {};

    /** 页面项目信息 */
    let pageItemsData = [];

    /** 页面项目序号 */
    let pageItemsIndex = 0;

    /** 配置项 */
    const config = {
        zoomFactorS: { def: 1, step: 0.01, min: 0.5, max: 10 },
        zoomFactorG: { def: 1, step: 0.01, min: 0.5, max: 10 },
        margin: { def: 10, step: 1, min: 0, max: 100 },
        spacing: { def: 15, step: 1, min: 0, max: 100 },
        pageMargin: { def: 10, step: 1, min: 0, max: 1000 },
        pagePadding: { def: 10, step: 1, min: 0, max: 1000 },
        fullScreenMode: { def: false },
        squareMode: { def: false },
        showIndex: { def: false },
        liveURLUpdate: { def: false },
        quickTag: { def: true },
        quickFavorite: { def: true },
        infiniteScroll: { def: false },
        maxPagesS: { def: 0, step: 1, min: 0, max: 1000 },
        moreThumbnail: { def: false },
        maxPagesG: { def: 0, step: 1, min: 0, max: 1000 },
        toggleEH: { def: true }
    };

    /** 用于存储脚本的用户配置 */
    const cfg = {};

    /** cfg 从 GM_getValue 读取或写入默认值 */
    Object.entries(config).forEach(([key, conf]) => {
        let val = GM_getValue(key, conf.def);
        if (val === undefined) {
            GM_setValue(key, conf.def);
            val = conf.def;
        }
        cfg[key] = val;
    });

    /** 当前网页信息 */
    const pageInfo = {
        originalUrl: window.location.href, // 当前 URL
        isEhentai: window.location.hostname.endsWith('e-hentai.org'), // 判断是否是 e变态
        isExhentai: window.location.hostname.endsWith('exhentai.org'), // 判断是否是 ex变态
        isTor: window.location.hostname.endsWith('exhentai55ld2wyap5juskbm67czulomrouspdacjamjeloj7ugjbsad.onion'), // 判断是否是 Tor

        isHomePage: window.location.pathname === '/', // 首页&搜索页面
        isWatchedPage: window.location.pathname.startsWith('/watched'), // 订阅页面
        isPopularPage: window.location.pathname.startsWith('/popular'), // 热门页面
        isTorrentsPage: window.location.pathname.startsWith('/torrents.php'), // 种子页面
        isFavoritesPage: window.location.pathname.startsWith('/favorites.php'), // 收藏夹页面
        isUconfigPage: window.location.pathname.startsWith('/uconfig.php'), // 设置页面
        isMytagsPage: window.location.pathname.startsWith('/mytags'), // 我的标签页面
        isGalleryPage: window.location.pathname.startsWith('/g/'), // 画廊页面
        isImagePage: window.location.pathname.startsWith('/s/'), // 图片页面
        isGalleryPopupsPage: window.location.pathname.startsWith('/gallerypopups.php'), // 画廊弹出窗口

        listDisplayMode: $('.searchnav div:last-child select')?.value // 列表显示模式（m/p/l/e/t）
    };

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /** 定义语言包 */
    const _translations = {
        'zoomFactorS': {
            'en': 'Thumbnail Zoom',
            'zh-CN': '缩略图缩放',
            'zh-TW': '縮圖縮放',
            'ja': 'サムネイルズーム',
            'ko': '썸네일 확대 비율',
            'ru': 'Масштаб миниатюры'
        },
        'zoomFactorG': {
            'en': 'Gallery Thumbnail Zoom',
            'zh-CN': '画廊缩略图缩放',
            'zh-TW': '畫廊縮圖縮放',
            'ja': 'ギャラリーサムネイルズーム',
            'ko': '갤러리 썸네일 확대 비율',
            'ru': 'Масштаб миниатюр галереи'
        },
        'margin': {
            'en': 'Thumbnail Margin',
            'zh-CN': '缩略图边距',
            'zh-TW': '縮圖邊距',
            'ja': 'サムネイルマージン',
            'ko': '썸네일 여백',
            'ru': 'Отступы миниатюры'
        },
        'spacing': {
            'en': 'Thumbnail Spacing',
            'zh-CN': '缩略图间距',
            'zh-TW': '縮圖間距',
            'ja': 'サムネイル間隔',
            'ko': '썸네일 간격',
            'ru': 'Интервал миниатюр'
        },
        'pageMargin': {
            'en': 'Page Margin',
            'zh-CN': '页面外边距',
            'zh-TW': '頁面外邊距',
            'ja': 'ページマージン',
            'ko': '페이지 외부 여백',
            'ru': 'Внешний отступ страницы'
        },
        'pagePadding': {
            'en': 'Page Padding',
            'zh-CN': '页面内边距',
            'zh-TW': '頁面內邊距',
            'ja': 'ページパディング',
            'ko': '페이지 내부 여백',
            'ru': 'Внутренний отступ страницы'
        },
        'fullScreenMode': {
            'en': 'Full Screen Mode',
            'zh-CN': '全屏模式',
            'zh-TW': '全螢幕模式',
            'ja': 'フルスクリーンモード',
            'ko': '전체 화면 모드',
            'ru': 'Режим полного экрана'
        },
        'squareMode': {
            'en': 'Square Thumbnail',
            'zh-CN': '方形缩略图',
            'zh-TW': '方形縮圖',
            'ja': 'スクエアサムネイル',
            'ko': '정사각형 썸네일',
            'ru': 'Квадратная миниатюра'
        },
        'showIndex': {
            'en': 'Show Index',
            'zh-CN': '显示序号',
            'zh-TW': '顯示序號',
            'ja': 'インデックスを表示',
            'ko': '인덱스 표시',
            'ru': 'Показать индекс',
        },
        'liveURLUpdate': {
            'en': 'Live URL Update',
            'zh-CN': '实时更新网址',
            'zh-TW': '實時更新網址',
            'ja': 'URLのライブ更新',
            'ko': '실시간 URL 업데이트',
            'ru': 'Живое обновление URL',
        },
        'quickTag': {
            'en': 'Quick Tag',
            'zh-CN': '快捷标签',
            'zh-TW': '快捷標籤',
            'ja': 'クイックタグ',
            'ko': '빠른 태그',
            'ru': 'Быстрые теги'
        },
        'quickFavorite': {
            'en': 'Quick Favorite',
            'zh-CN': '快捷收藏',
            'zh-TW': '快捷收藏',
            'ja': 'クイックお気に入り',
            'ko': '빠른 즐겨찾기',
            'ru': 'Быстрое избранное'
        },
        'infiniteScroll': {
            'en': 'Infinite Scroll',
            'zh-CN': '无限滚动',
            'zh-TW': '無限滾動',
            'ja': '無限スクロール',
            'ko': '무한 스크롤',
            'ru': 'Бесконечная прокрутка',
        },
        'maxPagesS': {
            'en': 'Max Pages [0 = Unlimited]',
            'zh-CN': '最大页数 [0 = 无限]',
            'zh-TW': '最大頁數 [0 = 無限]',
            'ja': '最大ページ数 [0 = 無制限]',
            'ko': '최대 페이지 [0 = 무한]',
            'ru': 'Макс. страниц [0 = Бесконечно]'
        },
        'moreThumbnail': {
            'en': 'More Thumbnail',
            'zh-CN': '更多缩略图',
            'zh-TW': '更多縮圖',
            'ja': 'もっとサムネイル',
            'ko': '썸네일 더보기',
            'ru': 'Ещё миниатюры'
        },
        'maxPagesG': {
            'en': 'Max Pages [0 = Unlimited]',
            'zh-CN': '最大页数 [0 = 无限]',
            'zh-TW': '最大頁數 [0 = 無限]',
            'ja': '最大ページ数 [0 = 無制限]',
            'ko': '최대 페이지 [0 = 무한]',
            'ru': 'Макс. страниц [0 = Бесконечно]'
        },
        'toggleEH': {
            'en': 'EH/ExH Switch Button',
            'zh-CN': 'EH/ExH 切换按钮',
            'zh-TW': 'EH/ExH 切換按鈕',
            'ja': 'EH/ExH 切替ボタン',
            'ko': 'EH/ExH 전환 버튼',
            'ru': 'Кнопка EH/ExH'
        },
        'settings': {
            'en': 'Settings',
            'zh-CN': '设置',
            'zh-TW': '設置',
            'ja': '設定',
            'ko': '설정',
            'ru': 'Настройки'
        },
        'settingsPanel': {
            'en': 'Settings Panel',
            'zh-CN': '设置面板',
            'zh-TW': '設定面板',
            'ja': '設定画面',
            'ko': '설정 패널',
            'ru': 'Панель настроек'
        },
        'save': {
            'en': 'Save',
            'zh-CN': '保存',
            'zh-TW': '儲存',
            'ja': '保存',
            'ko': '저장',
            'ru': 'Сохранить'
        },
        'cancel': {
            'en': 'Cancel',
            'zh-CN': '取消',
            'zh-TW': '取消',
            'ja': 'キャンセル',
            'ko': '취소',
            'ru': 'Отменить'
        },
        'invalidPage': {
            'en': 'Unsupported page',
            'zh-CN': '不支持此页面',
            'zh-TW': '不支援此頁面',
            'ja': 'このページはサポートされていません',
            'ko': '이 페이지는 지원되지 않습니다',
            'ru': 'Эта страница не поддерживается'
        },
        'manageCustomTags': {
            'en': 'Manage Custom Tags',
            'zh-CN': '管理自定义标签',
            'zh-TW': '管理自訂標籤',
            'ja': 'カスタムタグを管理',
            'ko': '사용자 지정 태그 관리',
            'ru': 'Управление пользовательскими тегами'
        },
        'openSearchInNewTab': {
            'en': 'Right-click or Ctrl+Left-click to search in a new tab',
            'zh-CN': '右键 或 Ctrl+左键 在新标签页搜索',
            'zh-TW': '右鍵 或 Ctrl+左鍵 在新標籤頁搜尋',
            'ja': '右クリックまたはCtrl+左クリックで新しいタブで検索',
            'ko': '새 탭에서 검색하려면 마우스 오른쪽 버튼 클릭 또는 Ctrl+왼쪽 클릭',
            'ru': 'Щелкните правой кнопкой мыши или Ctrl+ЛКМ, чтобы искать в новой вкладке'
        },
        'invalidInput': {
            'en': 'Invalid input\n\nUse [tag] or [name @ tag] or [name @ tag tag] format\nExample:\nLOLI @ f:lolicon$\n\nError line:\n',
            'zh-CN': '无效输入\n\n请使用 [tag] 或 [name @ tag] 或 [name @ tag tag] 格式\n示例:\nLOLI @ f:lolicon$\n\n错误行:\n',
            'zh-TW': '無效輸入\n\n請使用 [tag] 或 [name @ tag] 或 [name @ tag tag] 格式\n範例:\nLOLI @ f:lolicon$\n\n錯誤行:\n',
            'ja': '無効な入力です\n\n[tag] または [name @ tag] または [name @ tag tag] 形式を使用してください\n例:\nLOLI @ f:lolicon$\n\nエラー行:\n',
            'ko': '잘못된 입력\n\n[tag] 또는 [name @ tag] 또는 [name @ tag tag] 형식을 사용하세요\n예시:\nLOLI @ f:lolicon$\n\n오류 줄:\n',
            'ru': 'Неверный ввод\n\nИспользуйте формат [tag] или [name @ tag] или [name @ tag tag]\nПример:\nLOLI @ f:lolicon$\n\nСтрока с ошибкой:\n'
        },
        'unmatchedQuotes': {
            'en': 'Unmatched quotes\n\nEnsure quotes in tag names and tags are paired\n\nError line:\n',
            'zh-CN': '引号未成对\n\n请确保标签名称和标签中的引号成对出现\n\n错误行:\n',
            'zh-TW': '引號未成對\n\n請確保標籤名稱和標籤中的引號成對出現\n\n錯誤行:\n',
            'ja': '引用符が正しく閉じられていません\n\nタグ名とタグ内の引用符が対になっていることを確認してください\n\nエラー行:\n',
            'ko': '인용 부호 불일치\n\n태그 이름과 태그 내 인용 부호가 짝을 이루도록 하세요\n\n오류 줄:\n',
            'ru': 'Непарные кавычки\n\nУбедитесь, что кавычки в имени тега и в теге парные\n\nСтрока с ошибкой:\n'
        },
        'duplicateName': {
            'en': 'Duplicate name\n\nEnsure each tag name is unique\n\nDuplicate name:\n',
            'zh-CN': '名称重复\n\n请确保每个标签名称都是唯一的\n\n重复名称:\n',
            'zh-TW': '名稱重複\n\n請確保每個標籤名稱都是唯一的\n\n重複名稱:\n',
            'ja': '名前が重複しています\n\n各タグ名が一意であることを確認してください\n\n重複した名前:\n',
            'ko': '중복 이름\n\n각 태그 이름이 고유한지 확인하세요\n\n중복 이름:\n',
            'ru': 'Дублирующее имя\n\nУбедитесь, что каждое имя тега уникально\n\nДублирующее имя:\n'
        }
    };

    /** 输入报错模板 */
    const rangeTemplates = {
        'en': `Invalid {{label}}! Please enter a value between {{min}} and {{max}}. Default {{default}}.`,
        'zh-CN': `{{label}} 无效！请输入介于 {{min}} 和 {{max}} 之间的值。默认值为 {{default}}。`,
        'zh-TW': `{{label}} 無效！請輸入介於 {{min}} 和 {{max}} 之間的值。預設值為 {{default}}。`,
        'ja': `{{label}} が無効です！{{min}}から{{max}}までの値を入力してください。デフォルトは{{default}}です。`,
        'ko': `잘못된 {{label}}! {{min}} 에서 {{max}} 사이의 값을 입력하세요. 기본값 {{default}}`,
        'ru': `Неверный {{label}}! Пожалуйста, введите значение от {{min}} до {{max}}. По умолчанию {{default}}`
    };

    /** 模板替换函数 */
    function interpolate(template, values) {
        return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] ?? '');
    }

    /** 包装 Proxy */
    const translations = new Proxy(_translations, {
        get(target, prop) {
            // 如果访问的是 xxxRange
            const match = prop.match(/^(.+)Range$/);
            if (match) {
                const baseKey = match[1];
                const labelEntry = target[baseKey];
                if (!labelEntry || !config[baseKey]) return undefined;

                const output = {};
                for (const lang of Object.keys(rangeTemplates)) {
                    output[lang] = interpolate(rangeTemplates[lang], {
                        label: labelEntry[lang],
                        min: config[baseKey].min,
                        max: config[baseKey].max,
                        default: config[baseKey].def
                    });
                }
                return output;
            }

            // 普通字段直接返回
            return target[prop];
        }
    });

    /** 根据用户语言选择对应的文本 */
    const translate = (key) => {
        const userLang = navigator.language || navigator.userLanguage;
        const lang = userLang.substring(0, 2);
        const map = {
            zh: userLang.startsWith('zh-TW') ? 'zh-TW' : 'zh-CN',
            ja: 'ja',
            ko: 'ko',
            ru: 'ru'
        };
        const tKey = translations[key];
        if (!tKey) return '';

        return tKey[map[lang]] || tKey.en || key;
    };

    /** 创建控件 HTML */
    function createControlHTML(type, name, value, options = {}) {
        if (type === 'input') {
            const { step, min, max } = config[name];
            return `<div style='margin-bottom: 10px; display: flex; align-items: center;'>
            <label for='${name}Input' style='font-weight: bold; margin-right: 10px;'>${translate(name)} </label>
            <input type='number' id='${name}Input' value='${value}' step='${step}' min='${min}' max='${max}' style='width: 46px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; margin-left: auto;'>
        </div>`;
        } else if (type === 'checkbox') {
            return `<div style='margin-bottom: 10px; display: flex; align-items: center;'>
            <label for='${name}Input' style='font-weight: bold; margin-right: 10px;'>${translate(name)} </label>
            <input type='checkbox' id='${name}Input' style='width: 20px; height: 20px; cursor: pointer; margin-left: auto;' ${value ? 'checked' : ''}>
        </div>`;
        } else if (type === 'buttons') {
            return `<div style='display: flex; justify-content: space-between;'>
            <button id='saveSettingsBtn' style='padding: 8px 12px; background-color: #00AAFF; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;'>${translate('save')}</button>
            <button id='cancelSettingsBtn' style='padding: 8px 12px; background-color: #FF2222; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;'>${translate('cancel')}</button>
        </div>`;
        } else if (type === 'message') {
            return `<div style='margin-top: 20px; margin-bottom: 20px; font-size: 16px; line-height: 2; font-weight: bold; text-align: center;'>${translate(name)}</div>`;
        }
    }

    /** 获取面板内容 */
    function getPanelContent() {
        let controlNames = [];

        if (pageInfo.listDisplayMode === 't') {
            controlNames = [
                'zoomFactorS', 'margin', 'pageMargin', 'pagePadding',
                'fullScreenMode', 'squareMode', 'showIndex',
                'infiniteScroll',
                'quickTag', 'quickFavorite',
                'liveURLUpdate'
            ];
        } else if (pageInfo.listDisplayMode) {
            controlNames = [
                'pageMargin', 'pagePadding',
                'fullScreenMode', 'showIndex',
                'infiniteScroll',
                'quickTag', 'quickFavorite',
                'liveURLUpdate'
            ];
        } else if ($i('searchbox') || pageInfo.isFavoritesPage) {
            controlNames = [
                'pageMargin', 'pagePadding',
                'fullScreenMode',
                'quickTag'
            ];
        } else if (pageInfo.isGalleryPage) {
            controlNames = [
                'zoomFactorG', 'spacing', 'pageMargin',
                'fullScreenMode',
                'moreThumbnail',
                'quickFavorite'
            ];
        } else if (!toggleEHInfo.allowed) {
            return createControlHTML('message', 'invalidPage');
        }

        if (toggleEHInfo.allowed) {
            controlNames.push('toggleEH');
        }

        const htmlPieces = [];
        controlNames.forEach(name => {
            const type = typeof config[name].def === 'boolean' ? 'checkbox' : 'input';
            htmlPieces.push(createControlHTML(type, name, cfg[name]));

            if (name === 'infiniteScroll' && cfg.infiniteScroll) {
                const maxPagesHTML = createControlHTML('input', 'maxPagesS', cfg.maxPagesS);
                htmlPieces.push(maxPagesHTML.replace("style='", "style='margin-left: 24px; color: #666; "));
            } else if (name === 'moreThumbnail' && cfg.moreThumbnail) {
                const maxPagesHTML = createControlHTML('input', 'maxPagesG', cfg.maxPagesG);
                htmlPieces.push(maxPagesHTML.replace("style='", "style='margin-left: 24px; color: #666; "));
            }
        });

        return htmlPieces.join('');
    }

    /** 创建和显示设置面板 */
    function showSettingsPanel() {
        if ($i('settings-panel')) return;
        const panel = $el('div');
        panel.id = 'settings-panel';
        panel.style = 'position: fixed; top: 24px; right: 24px; padding: 12px; background-color: rgba(255,255,255,0.9); border: 2px solid #00AAFF; border-radius: 9px; box-shadow: 0 0 12px rgba(0,0,0,0.24); z-index: 999999; font-size: 14px; color: #222; min-width: 180px;';
        panel.innerHTML = `
            <style>
            #settings-panel input[type=number]::-webkit-outer-spin-button,
            #settings-panel input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
            #settings-panel input[type=number]{-moz-appearance:textfield;}
            </style>
            <h3 style='margin: 0; margin-bottom: 10px; font-size: 18px; color: #00AAFF; text-align: center;'>${translate('settingsPanel')}</h3>
            <div id='settings-controls'>${getPanelContent()}</div>
            ${createControlHTML('buttons')}
        `;

        document.body.appendChild(panel);

        // 面板整体的行为与按钮绑定
        panel.addEventListener('wheel', e => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
        panel.addEventListener('input', e => {
            if (e.target.type === 'number') handleInputChange(e);
            if (e.target.type === 'checkbox') handleCheckboxChange(e);
        });
        panel.addEventListener('wheel', handleWheelChange, { passive: false });

        panel.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseover', () => { btn.style.opacity = '0.8'; });
            btn.addEventListener('mouseout', () => { btn.style.opacity = '1'; });
        });

        const saveBtn = $i('saveSettingsBtn'), cancelBtn = $i('cancelSettingsBtn');
        if (pageInfo.listDisplayMode || $i('searchbox') || pageInfo.isGalleryPage) {
            saveBtn?.addEventListener('click', () => saveSettings(panel));
            cancelBtn?.addEventListener('click', () => cancelSettings(panel));
        } else {
            saveBtn?.addEventListener('click', () => panel.remove());
            cancelBtn?.addEventListener('click', () => panel.remove());
        }

        // 暴露局部刷新函数，方便外部调用
        panel.refreshControls = () => refreshSettingsControls(panel);
    }

    // ---- 局部刷新（只替换 #settings-controls 的 innerHTML，保留容器和已绑定的委托事件） ----
    function refreshSettingsControls(panel) {
        const container = panel.querySelector('#settings-controls');
        if (!container) return;
        container.innerHTML = getPanelContent();
        // 不需要重新绑定事件，因为事件委托绑定在 container 元素上并不会被替换
    }

    /** 通用输入赋值函数 */
    function setCfgByInput(id, value) {
        const key = id.replace(/Input$/, '');
        cfg[key] = value;
    }

    /** 输入框变化事件 */
    function handleInputChange(event) {
        const { id, value } = event.target;
        const numValue = parseFloat(value);
        const key = id.replace(/Input$/, '');
        if (
            config[key] &&
            numValue >= config[key].min &&
            numValue <= config[key].max
        ) {
            setCfgByInput(id, numValue);
            applyChanges();
        }
    }

    /** 复选框变化事件 */
    function handleCheckboxChange(event) {
        const { id, checked } = event.target;
        setCfgByInput(id, checked);
        applyChanges();

        // 如果这个复选框和展示逻辑有关（例如 infiniteScroll），局部刷新控件
        if (id === 'infiniteScrollInput' || id === 'moreThumbnailInput') {
            const panel = document.getElementById('settings-panel');
            if (panel && typeof panel.refreshControls === 'function') {
                panel.refreshControls();
            }
        }
    }

    /** 滚轮事件处理 */
    function handleWheelChange(event) {
        if (event.target.type !== 'number') return;
        event.preventDefault();
        const input = event.target;
        let value = parseFloat(input.value);
        const step = parseFloat(input.step);
        value = Math.min(parseFloat(input.max), Math.max(parseFloat(input.min), value + (event.deltaY < 0 ? step : -step)));
        input.value = step < 1 ? value.toFixed(2) : value;
        input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }

    /** 保存设置 */
    function saveSettings(panel) {
        let errors = [];
        panel.querySelectorAll('input[type="number"]').forEach(input => {
            const key = input.id.replace('Input', '');
            const value = parseFloat(input.value);
            if (isNaN(value) || value < config[key].min || value > config[key].max) {
                errors.push(translate(key + 'Range'));
            }
        });
        if (errors.length > 0) {
            alert(errors.join('\n\n'));
            return;
        }
        // 无错误时保存所有设置
        Object.keys(config).forEach(key => GM_setValue(key, cfg[key]));
        panel.remove();
    }

    /** 取消设置 */
    function cancelSettings(panel) {
        Object.keys(config).forEach(key => {
            cfg[key] = GM_getValue(key)
        });
        applyChanges();
        panel.remove();
    }

    /** 应用更改 */
    function applyChanges() {
        calculateDimensions();
        if (pageInfo.listDisplayMode) {
            throttledAdjustColumnsS();
            if (pageInfo.listDisplayMode === 't') modifyThumbnailSizeS();
            updateGlinkIndex();
            quickTagPanel();
            cfg.quickFavorite ? replaceFavClickS() : restoreElements();
        } else if ($i('searchbox') || pageInfo.isFavoritesPage) {
            throttledAdjustColumnsS();
            quickTagPanel();
        } else if (pageInfo.isGalleryPage) {
            throttledAdjustColumnsG();
            modifyThumbnailSizeG();
            cfg.quickFavorite ? replaceFavClickG() : restoreElements();
        }
        if (toggleEHInfo.allowed) {
            toggleEHButton();
        }
    }

    /** 初始化设置 如果为空 先保存初始值 */
    function initialize() {
        if (GM_getValue('zoomFactor') !== undefined && GM_getValue('zoomFactorS') === undefined) {
            GM_setValue('zoomFactorS', GM_getValue('zoomFactor'));
            GM_deleteValue('zoomFactor');
        }

        for (const [key, cfgItem] of Object.entries(config)) {
            let val = GM_getValue(key);
            if (val === undefined) {
                GM_setValue(key, cfgItem.def);
                val = cfgItem.def;
            }
            cfg[key] = val;
        }
    }

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /** 计算尺寸 */
    function calculateDimensions() {
        layout.columnWidthS = 250 * cfg.zoomFactorS + cfg.margin * 2; // 每列的宽度 250-400 270
        layout.columnWidthSb = layout.columnWidthS + (2 / devicePixelRatio); // 加上缩略图边框，边框宽度受设备像素比影响
        layout.columnWidthG = 100 * cfg.zoomFactorG + cfg.spacing; // 画廊每列的宽度(100X) spacing:15  + (2 / devicePixelRatio)
        layout.marginAdjustmentS = 14 + cfg.pageMargin * 2; // 页面边距调整值 body-padding:2 ido-padding:5
        layout.marginAdjustmentG = 34 + cfg.pageMargin * 2; // 画廊页面边距调整值 body-padding:2 gdt-padding:15
        layout.paddingAdjustmentS = cfg.pagePadding * 2; // 页面内边距调整值
    }

    /** 搜索类别行td */
    let initialRowTDs = null;

    /** 根据页面宽度动态调整列数 画廊列表页面 */
    function adjustColumnsS() {
        console.log('LOLICON 画廊列表页面调整');

        const width = document.documentElement.clientWidth; // window.innerWidth
        const minWidthNumber = parseFloat(getComputedStyle($c('ido')[0]).minWidth);

        let clientWidthS_itg = Math.max(width - layout.marginAdjustmentS - layout.paddingAdjustmentS, minWidthNumber); // 计算宽度
        layout.columnsS = Math.max(Math.floor(clientWidthS_itg / layout.columnWidthSb), 1); // 计算列数
        const baseWidth = (pageInfo.listDisplayMode === 't') ? layout.columnsS * layout.columnWidthSb : Math.min(720 + 670 + 14, clientWidthS_itg);
        clientWidthS_itg = Math.max(baseWidth, cfg.fullScreenMode ? clientWidthS_itg : minWidthNumber); // 根据全屏模式调整

        let clientWidthS_ido = Math.min(clientWidthS_itg + layout.paddingAdjustmentS, width);
        $c('ido')[0].style.maxWidth = clientWidthS_ido + 'px'; // 设置最大宽度 1370
        if (pageInfo.listDisplayMode === 't' && $c('itg gld')[0]) {
            $c('itg gld')[0].style.gridTemplateColumns = 'repeat(' + layout.columnsS + ', 1fr)'; // 设置列数
            $c('itg gld')[0].style.width = clientWidthS_itg + 'px'; // 设置边距 '99%'
        } else if ($c('itg')[0]) {
            $c('itg')[0].style.maxWidth = clientWidthS_itg + 'px';
            $c('itg')[0].style.width = clientWidthS_itg + 'px';
        }

        const searchnavEls = $c('searchnav');
        const paddingValue = (width - layout.marginAdjustmentS - layout.paddingAdjustmentS >= minWidthNumber)
            ? cfg.pagePadding
            : (width - minWidthNumber - layout.marginAdjustmentS) / 2;
        for (let i = 0; i < 2; i++) {
            const el = searchnavEls[i];
            if (!el) continue;
            el.children[0].style.padding = '0 0 0 ' + + paddingValue + 'px';
            el.children[6].style.padding = '0 ' + paddingValue + 'px 0 0';
        }

        const isLargerWidth = clientWidthS_ido >= 720 + 670 + 14 + layout.paddingAdjustmentS; //1460

        const searchbox = $i('searchbox'); // 搜索盒子
        if (searchbox) {
            const tbody = searchbox.querySelector('tbody');
            if (tbody) {
                if (!initialRowTDs) {
                    const rows = Array.from(tbody.children);
                    initialRowTDs = rows.map(row => Array.from(row.children)); // 保存每行 td 节点引用
                }

                if (isLargerWidth) {
                    // 合并行
                    const rows = Array.from(tbody.children);
                    if (rows.length >= 2) {
                        const firstRow = rows[0];
                        const secondRow = rows[1];
                        Array.from(secondRow.children).forEach(td => firstRow.appendChild(td));
                        secondRow.remove();
                    }
                } else {
                    // 拆分回原始两行
                    tbody.innerHTML = ''; // 清空 tbody

                    initialRowTDs.forEach(tdArray => {
                        const tr = document.createElement('tr');
                        tdArray.forEach(td => tr.appendChild(td)); // 移动原 td 节点
                        tbody.appendChild(tr);
                    });
                }
            }

            // 调整搜索盒子大小
            if ($c('idi')[0]) { $c('idi')[0].style.width = (isLargerWidth ? 720 + 670 : 720) + 'px'; }
            if ($c('idi')[1]) { $c('idi')[1].style.width = (isLargerWidth ? 720 + 670 : 720) + 'px'; }
            if ($i('f_search')) { $i('f_search').style.width = (isLargerWidth ? 560 + 670 : 560) + 'px'; }
        }

        // 调整更窄的收藏页面，和首页保持一致
        if (pageInfo.isFavoritesPage && clientWidthS_ido < (930 + layout.paddingAdjustmentS)) {
            const noselWidth = Math.max(735, Math.min(825, clientWidthS_ido));
            if ($c('nosel')[1]) { $c('nosel')[1].style.width = noselWidth + 'px'; }
            const fpElements = $$('div.fp');
            const fpWidth = Math.max(142, Math.min(160, (clientWidthS_ido - 16) / 5 - 1)) + 'px';
            for (let i = 0; i < Math.min(10, fpElements.length); i++) {
                fpElements[i].style.width = fpWidth;
            }
            const idoTarget3 = $('.ido > div:nth-child(3)');
            if (idoTarget3) {
                idoTarget3.style.width = noselWidth + 'px';
                const inputTarget = idoTarget3.querySelector('form:nth-child(1) > div:nth-child(2) > input:nth-child(1)');
                if (inputTarget) {
                    inputTarget.setAttribute('size', Math.max(84, Math.min(90, 84 + (noselWidth - 735) / 15)));
                }
            }
        } else if (pageInfo.isFavoritesPage) {
            if ($c('nosel')[1]) { $c('nosel')[1].style.width = '825px'; }
            const fpElements = $$('div.fp');
            for (let i = 0; i < Math.min(10, fpElements.length); i++) {
                fpElements[i].style.width = '160px';
            }
            const idoTarget3 = $('.ido > div:nth-child(3)');
            if (idoTarget3) {
                idoTarget3.style.width = (isLargerWidth ? 720 + 670 : 825) + 'px';
                const inputTarget = idoTarget3.querySelector('form:nth-child(1) > div:nth-child(2) > input:nth-child(1)');
                if (inputTarget) {
                    inputTarget.setAttribute('size', '90');
                }
            }
            $('.ido > div:nth-child(3) > form:nth-child(1) > div:nth-child(2) > input:nth-child(1)').style.width = (isLargerWidth ? '1230px' : '');
        }

        if (layout.columnsS != layout.OLDcolumnsS && cfg.liveURLUpdate && !pageInfo.isPopularPage && !pageInfo.isFavoritesPage) {
            throttledGetRowInfo();
            layout.OLDcolumnsS = layout.columnsS;
        }
    }

    /** 根据页面宽度动态调整列数 画廊页面 */
    function adjustColumnsG() {
        console.log('LOLICON 画廊页面调整');

        const gdt = $i('gdt');
        if (gdt) {

            const width = window.innerWidth;
            const isGT200 = gdt.classList.contains('gt200');
            const pixelCorrection = 2 / devicePixelRatio;

            const spacingCorrection = isGT200 ? cfg.spacing * 2 : cfg.spacing;
            const columnWidthGL = isGT200 ? layout.columnWidthG * 2 + pixelCorrection : layout.columnWidthG + pixelCorrection;

            const clientWidthGL = Math.max(700, width - layout.marginAdjustmentG) + spacingCorrection;
            const columnsG = Math.floor(clientWidthGL / columnWidthGL);
            const clientWidthG_gdt = cfg.fullScreenMode ? Math.max(700, width - layout.marginAdjustmentG) : Math.max(700, columnsG * columnWidthGL - spacingCorrection);

            if ($c('gm')[0]) { $c('gm')[0].style.maxWidth = clientWidthG_gdt + 20 + 'px'; } // 设置最详情大宽度 720 960 1200
            if ($c('gm')[1]) { $c('gm')[1].style.maxWidth = clientWidthG_gdt + 20 + 'px'; } // 设置最评论区大宽度 720 960 1200
            if ($i('gdo')) { $i('gdo').style.maxWidth = clientWidthG_gdt + 20 + 'px'; } // 设置缩略图设置栏最大宽度 720 960 1200

            let clientWidthG_gdt_gd2 = clientWidthG_gdt - 255; // 设置标题栏宽度 710 925
            let clientWidthG_gdt_gmid = clientWidthG_gdt - 250; // 设置标签栏宽度 710 930
            let clientWidthG_gdt_gd4 = clientWidthG_gdt - 600; // 设置标签栏宽度 360 580

            if (width <= 1230) {
                clientWidthG_gdt_gd2 = clientWidthG_gdt_gd2 + 255;
                clientWidthG_gdt_gmid = clientWidthG_gdt_gmid + 255;
                clientWidthG_gdt_gd4 = clientWidthG_gdt_gd4 + 255;
            }

            if ($i('gd2')) { $i('gd2').style.width = clientWidthG_gdt_gd2 + 'px'; }
            if ($i('gmid')) { $i('gmid').style.width = clientWidthG_gdt_gmid + 'px'; }
            if ($i('gd4')) { $i('gd4').style.width = clientWidthG_gdt_gd4 + 'px'; }


            gdt.style.maxWidth = clientWidthG_gdt + 'px'; // 设置最大宽度 700 940 1180
            gdt.style.gridTemplateColumns = 'repeat(' + columnsG + ', 1fr)';
            gdt.style.gap = cfg.spacing + 'px';
        }
    }

    /** 收集画廊列表页面信息 */
    function collectDataS() {
        const strategies = {
            m: 'td:nth-child(4) > a:nth-child(1)',
            p: 'td:nth-child(4) > a:nth-child(1)',
            l: 'td:nth-child(3) > a:nth-child(1)',
            e: 'td:nth-child(1) > div:nth-child(1) > a:nth-child(1)',
            t: 'a:nth-child(1)'
        };
        if (pageInfo.listDisplayMode === 't') {
            const gElements = $$('.gl1t');
            gElements.forEach((el, index) => {
                if (index === pageItemsIndex) {
                    pageItemsIndex++;

                    const gl3t = el.querySelector('.gl3t');
                    const gl4t = el.querySelector('.gl4t');
                    const gl5t = el.querySelector('.gl5t');
                    const gl6t = el.querySelector('.gl6t');
                    const glink = el.querySelector('.glink');
                    const gl5tFirstChildDiv = gl5t?.querySelector('div:nth-child(1)');
                    const img = gl3t?.querySelector('img');

                    const urlElement = el.querySelector(strategies[pageInfo.listDisplayMode]);
                    const match = urlElement?.href.match(/\/g\/(\d+)\//);
                    const gid = match ? Number(match[1]) : null;

                    pageItemsData.push({
                        el,
                        gl3t,
                        gl4t,
                        gl5t,
                        gl6t,
                        glink,
                        gl5tFirstChildDiv,
                        img,
                        gid,
                        originalWidth: gl3t?.clientWidth,
                        originalHeight: gl3t?.clientHeight,
                        originalImgWidth: img?.clientWidth,
                        originalImgHeight: img?.clientHeight,
                    });
                }
            });
        } else {
            const gElements = $$('.itg > tbody > tr');
            gElements.forEach((el, index) => {
                if (index === pageItemsIndex) {
                    pageItemsIndex++;

                    if (el.querySelector('td.itd')) return; // 跳过广告行
                    const glink = el.querySelector('.glink');

                    const urlElement = el.querySelector(strategies[pageInfo.listDisplayMode]);
                    const match = urlElement?.href.match(/\/g\/(\d+)\//);
                    const gid = match ? Number(match[1]) : null;

                    pageItemsData.push({
                        el,
                        glink,
                        gid,
                    });
                }
            });
        }
    }

    /** 收集画廊页面信息 */
    function collectDataG() {
        const gdt = $i('gdt');
        const gdtThumbsSingle = gdt.querySelectorAll('a > div:nth-child(1)');
        const gdtThumbsDouble = gdt.querySelectorAll('a > div:nth-child(1) > div:nth-child(1)');
        const gdtThumbs = gdtThumbsDouble.length ? gdtThumbsDouble : gdtThumbsSingle;
        const gdtThumbPages = gdt.querySelectorAll('a > div:nth-child(1) > div:nth-child(2)');

        const spriteCountMap = new Map(); // 记录每张背景图出现次数

        gdtThumbs.forEach((el, index) => {
            if (index === pageItemsIndex) {
                pageItemsIndex++;

                const style = getComputedStyle(el);
                const backgroundPosition = style.backgroundPosition;
                const backgroundImage = style.backgroundImage;

                const spriteIndex = (spriteCountMap.get(backgroundImage) || 0) + 1;
                spriteCountMap.set(backgroundImage, spriteIndex);

                const width = el.clientWidth;
                const height = el.clientHeight;
                const itemWidth = (width === 200 || height === 300) ? 200 : 100;

                const pageEl = gdtThumbPages[index] ?? null;

                pageItemsData.push({
                    el,
                    backgroundPosition,
                    backgroundImage,
                    spriteIndex,
                    itemsPerSprite: null,
                    width,
                    height,
                    itemWidth,
                    pageEl,
                });
            }
        });

        pageItemsData.forEach(data => {
            if (data.itemsPerSprite == null) {
                data.itemsPerSprite = spriteCountMap.get(data.backgroundImage) || 1;
            }
        });
    }

    /** 修改画廊列表缩略图大小 */
    function modifyThumbnailSizeS() {
        console.log('LOLICON 修改缩略图大小');

        const minWidthNumber = parseFloat(getComputedStyle($c('ido')[0]).minWidth);
        let columnWidthSbm = Math.max(layout.columnWidthSb, minWidthNumber / Math.floor(Math.max(minWidthNumber / layout.columnWidthSb, 1)));

        if (cfg.fullScreenMode) {
            columnWidthSbm = layout.columnWidthS * 2;
        }

        pageItemsData.forEach((data, index) => {
            const {
                el,
                gl3t,
                gl4t,
                gl5t,
                gl6t,
                glink,
                gl5tFirstChildDiv,
                img,
                gid,
                originalWidth,
                originalHeight,
                originalImgWidth,
                originalImgHeight
            } = data;

            let zoomFactorL = cfg.zoomFactorS;

            if (cfg.squareMode && originalWidth < 250) {
                zoomFactorL = cfg.zoomFactorS * 250 / originalWidth;
            }

            // 设置 gl1t 的宽度
            el.style.minWidth = layout.columnWidthS + 'px';
            el.style.maxWidth = columnWidthSbm + 'px';

            // 调整 gl3t 的宽高
            if (gl3t) {
                const newWidth = originalWidth * zoomFactorL;
                const newHeight = originalHeight * zoomFactorL;
                gl3t.style.width = newWidth + 'px';
                gl3t.style.height = (cfg.squareMode ? newWidth : newHeight) + 'px';
            }

            // 小列宽时处理 gl5t 换行逻辑
            if (gl5t) {
                const isSmallWidth = layout.columnWidthS <= 199;
                gl5t.style.flexWrap = isSmallWidth ? 'wrap' : '';
                gl5t.style.height = isSmallWidth ? '92px' : '';

                if (gl5tFirstChildDiv) { gl5tFirstChildDiv.style.left = isSmallWidth ? '4.5px' : ''; }
            }

            // 调整图片的宽高
            if (img) {
                const newImgWidth = originalImgWidth * zoomFactorL;
                const newImgHeight = originalImgHeight * zoomFactorL;
                let width = newImgWidth;
                let height = newImgHeight;
                let top = '';
                let left = '';

                if (cfg.squareMode) {
                    if (newImgWidth <= newImgHeight) {
                        top = ((originalWidth * zoomFactorL) - newImgHeight) / 2 + 'px';
                    } else {
                        left = ((originalWidth * zoomFactorL) - (newImgWidth * newImgWidth / newImgHeight)) / 2 + 'px';
                        width = newImgWidth * newImgWidth / newImgHeight;
                        height = newImgWidth;
                    }
                } else {
                    top = ((originalHeight * zoomFactorL) - newImgHeight) / 2 + 'px';
                }

                img.style.width = width + 'px';
                img.style.height = height + 'px';
                img.style.top = top;
                img.style.left = left;
            }
        });
    }

    /** 调整 glink 的标题序号 */
    function updateGlinkIndex() {
        console.log('LOLICON 调整 glink 的标题序号');

        pageItemsData.forEach((data, index) => {
            const { glink } = data;

            if (glink) {
                const glinkSpan = glink.querySelector('span[data-LOLICON-index="true"]');

                if (cfg.showIndex) {
                    if (!glinkSpan) {
                        const span = $el('span');
                        span.setAttribute('data-LOLICON-index', 'true');
                        if (pageInfo.listDisplayMode === 't' || pageInfo.listDisplayMode === 'e') {
                            span.textContent = `【${index + 1}】 `;
                        } else {
                            span.textContent = `【${index}】 `;
                        }
                        glink.insertBefore(span, glink.firstChild);
                    }
                } else if (glinkSpan) {
                    glinkSpan.remove();
                }
            }
        });
    }

    /** 修改画廊缩略图大小 */
    function modifyThumbnailSizeG() {
        console.log('LOLICON 修改画廊缩略图大小');

        const isSprite = pageItemsData[0].itemsPerSprite !== 1 && pageItemsData.length > 1;

        pageItemsData.forEach((data, index) => {
            const {
                el,
                backgroundPosition,
                backgroundImage,
                spriteIndex,
                itemsPerSprite,
                width,
                height,
                itemWidth,
                pageEl
            } = data;

            // 设置缩略图尺寸
            el.style.width = width * cfg.zoomFactorG + 'px';
            el.style.height = height * cfg.zoomFactorG + 'px';

            // 背景图位置缩放
            const [x] = backgroundPosition.split(' ').map(parseFloat);
            el.style.backgroundPosition = x * cfg.zoomFactorG + 'px 0px';

            // 设置page最大宽度（便于居中）
            if (pageEl) {
                pageEl.style.maxWidth = itemWidth * cfg.zoomFactorG + 'px';
            }

            // 处理雪碧图尺寸
            if (isSprite) {
                el.style.backgroundSize = itemWidth * itemsPerSprite * cfg.zoomFactorG + 'px auto';
            } else {
                // 非雪碧图直接缩放原图
                el.style.backgroundSize = width * cfg.zoomFactorG + 'px auto';
            }
        });
    }

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /** 用于在 GM 存储中保存搜索标签数据的键名。 */
    const STORAGE_KEY = 'custom_tag';

    /** 搜索框相关对象 */
    const searchBox = {
        tags: loadTags(),           // 当前所有自定义标签，如 { "按钮名": "搜索语句" }
        permaBound: false,          // 是否已完成一次性事件绑定（避免重复绑定）
        container: null,            // 面板容器 DOM
        input: null,                // 搜索框 DOM
        searchBtn: null,            // “搜索”按钮 DOM
        clearBtn: null              // “清空”按钮 DOM
    }

    /** 加载已存储标签（若不存在则写入默认初始值） */
    function loadTags() {
        let data = GM_getValue(STORAGE_KEY, {});
        if (Object.keys(data).length === 0) {
            data = { 'LOLI': 'f:lolicon$', 'LOLI-AI': 'f:lolicon$ -o:"ai generated$"', 'LOLI|SB+NP': '~f:lolicon$ ~f:"small breasts$" o:"no penetration$"' };
            GM_setValue(STORAGE_KEY, data);
        }
        return data;
    }

    /** 将搜索字符串分割成独立的 token（标签） */
    function tokenize(str) {
        return new Set(str.match(/[^"\s]*"[^"]*"|[^\s"]+/g) || []);
    }

    /** 计算字符串在等宽字体下的视觉宽度 */
    function visualWidth(str) {
        return Array.from(str).reduce((w, ch) =>
            w + (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch) ? 2 : 1)
            , 0);
    }

    /** 快捷标签面板 */
    function quickTagPanel() {
        const panel = $i('tag-panel');
        if (pageInfo.isFavoritesPage) {
            searchBox.input = $('.ido > div:nth-child(3) > form:nth-child(1) > div:nth-child(2) > input:nth-child(1)');
        } else {
            searchBox.input = $i('f_search');
        }
        if (!searchBox.input) return;
        searchBox.container = searchBox.input?.parentNode;
        searchBox.searchBtn = searchBox.input?.nextElementSibling;
        searchBox.clearBtn = searchBox.searchBtn?.nextElementSibling;
        if (!searchBox.permaBound) {
            bindPermanentEvents();
            searchBox.permaBound = true;
        }
        if (cfg.quickTag) {
            if (!$i('tag-style')) injectCSS();
            buildPanel();
            bindToggleableEvents();
        } else {
            if (panel) panel.remove();

            if (searchBox.input && searchBox.input._quickTagListeners) {
                const { refresh, dblclick } = searchBox.input._quickTagListeners;
                searchBox.input.removeEventListener('input', refresh);
                searchBox.input.removeEventListener('focus', refresh);
                searchBox.input.removeEventListener('click', refresh);
                searchBox.input.removeEventListener('dblclick', dblclick);
                delete searchBox.input._quickTagListeners;
            }
            if (searchBox.clearBtn && searchBox.clearBtn._quickTagListener) {
                searchBox.clearBtn.removeEventListener('click', searchBox.clearBtn._quickBtnListener, { capture: true });
                delete searchBox.clearBtn._quickTagListener;
            }
        }
    }

    /** 向页面注入脚本所需的 CSS 样式 */
    function injectCSS() {
        const style = $el('style');
        style.id = 'tag-style';
        style.textContent = `
            #tag-panel { padding-top: 6px; }
            #tag-panel > input[type="button"] { margin: 2px; }
            input[type="button"].tag-active,
            input[type="button"].tag-active:hover {
                border: 2px solid currentColor !important;
            }
            #manage-panel {
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                background: inherit;
                padding: 12px 12px 6px 12px;
                border-radius: 8px;
                box-shadow: 0 0 12px rgba(0,0,0,0.8);
                z-index: 1000;
            }
            #manage-textarea {
                min-width: 240px; min-height: 240px;
                width: 360px; height: 360px;
                padding: 6px 12px;
                font-family: monospace; 
                line-height: 1.2;
                white-space: pre; 
            }
            #manage-footer {
                display: flex;
                justify-content: flex-end;
            }
            #manage-save, #manage-cancel { margin: 6px; }
        `;
        document.head.append(style);
    }

    /** 构建搜索标签按钮面板并将其插入到页面中 */
    function buildPanel() {
        let panel = $i('tag-panel');
        if (panel) panel.remove(); // 如果面板已存在，先移除，用于刷新

        panel = $el('div');
        panel.id = 'tag-panel';

        // 遍历搜索标签对象，为每个条目创建一个按钮
        for (const [name, tag] of Object.entries(searchBox.tags)) {
            const btn = $el('input');
            btn.type = 'button';
            btn.value = name;  // 按钮上显示的文本
            btn.title = tag;   // 鼠标悬停时显示的完整标签
            if (isActive(tag)) btn.classList.add('tag-active');
            btn.addEventListener('click', () => toggleTag(tag));      // 左键点击：切换标签
            btn.addEventListener('contextmenu', (e) => removeTag(e, name)); // 右键点击：修改标签
            panel.append(btn);
        }

        // 创建“管理”按钮
        const addBtn = $el('input');
        addBtn.type = 'button';
        addBtn.value = '+';
        addBtn.title = translate('manageCustomTags');
        addBtn.addEventListener('click', showManagePanel);
        addBtn.addEventListener('contextmenu', (e) => removeTag(e)); // 右键点击：修改标签
        panel.append(addBtn);

        searchBox.container.append(panel);
        enableDragSort(panel);
    }

    /** 绑定可开关的事件：input 和 clearBtn 为页面上的相关元素绑定事件监听器 */
    function bindToggleableEvents() {
        if (searchBox.input && !searchBox.input._quickTagListeners) {
            const refresh = () => updateActiveStyles();
            searchBox.input.addEventListener('input', refresh);
            searchBox.input.addEventListener('focus', refresh);
            searchBox.input.addEventListener('click', refresh);
            searchBox.input.addEventListener('dblclick', selectTokenByDoubleClick);

            searchBox.input._quickTagListeners = { refresh, dblclick: selectTokenByDoubleClick };
        }

        if (searchBox.clearBtn && !searchBox.clearBtn._quickTagListener) {
            const listener = (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                searchBox.input.value = '';
                searchBox.input.dispatchEvent(new Event('input', { bubbles: true }));
                searchBox.input.focus();
            };
            searchBox.clearBtn.addEventListener('click', listener, { capture: true });
            searchBox.clearBtn._quickTagListener = listener;
        }
    }

    /** 绑定永久事件：searchBtn  为页面上的相关元素绑定事件监听器 */
    function bindPermanentEvents() {
        if (searchBox.searchBtn) {
            searchBox.searchBtn.title = translate('openSearchInNewTab');
            searchBox.searchBtn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                openInNewTab();
            });
            searchBox.searchBtn.addEventListener('click', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    openInNewTab();
                }
            });
        }
        // 先获取所有分类元素
        const categories = document.querySelectorAll('table.itc div.cs[id^="cat_"]');
        if (categories.length > 0) {
            // 给每个元素绑定右键事件
            categories.forEach(el => {
                el.addEventListener('contextmenu', function (e) {
                    e.preventDefault(); // 阻止默认右键菜单

                    categories.forEach(other => {
                        if (other !== el && !other.getAttribute('data-disabled')) {
                            other.onclick();
                        }
                    });

                    if (el.getAttribute('data-disabled')) {
                        el.onclick();
                    }
                });
            });
        }
    }

    /** 检查指定的标签当前是否在搜索框中 */
    function isActive(tag) {
        if (!searchBox.input) return false;

        const btnTokens = tokenize(tag); // 按钮上的标签集合
        const inputTokens = tokenize(searchBox.input.value); // 输入框中的标签集合

        // 如果输入框中包含按钮的所有标签，则激活
        for (const t of btnTokens) {
            if (!inputTokens.has(t)) return false;
        }
        return true;
    }

    /** 根据当前搜索框的内容，更新所有搜索标签按钮的 'tag-active' 类 */
    function updateActiveStyles() {
        const panel = $i('tag-panel');
        if (!panel || !searchBox.input) return;

        // 遍历所有按钮（除了“+”按钮）
        panel.querySelectorAll('input[type="button"]').forEach(btn => {
            if (btn.value === '+') return;
            btn.classList.toggle('tag-active', isActive(btn.title));
        });
    }

    /** 处理搜索标签按钮的点击事件，在搜索框中添加或移除对应的标签 */
    function toggleTag(tag) {
        if (!searchBox.input) return;

        const btnTokens = tokenize(tag); // 按钮对应的标签集合
        const inputTokens = tokenize(searchBox.input.value); // 输入框现有标签

        // 判断是否所有标签都存在
        const allExist = [...btnTokens].every(t => inputTokens.has(t));

        if (allExist) {
            btnTokens.forEach(t => inputTokens.delete(t)); // 删除标签
        } else {
            btnTokens.forEach(t => inputTokens.add(t));    // 添加标签
        }

        searchBox.input.value = [...inputTokens].join(' ').trim(); // 更新输入框
        // 触发 input 事件以通知其他监听器（包括 updateActiveStyles）
        searchBox.input.dispatchEvent(new Event('input', { bubbles: true }));
        searchBox.input.focus();
    }

    /** 处理搜索标签按钮的右键点击事件，用于编辑搜索标签 */
    function removeTag(e, key) {
        e.preventDefault();
        showManagePanel(key);
    }

    /** 显示用于编辑所有搜索标签的管理面板（模态框） */
    function showManagePanel(targetKey) {
        $i('manage-panel')?.remove();

        const panel = $el('div');
        panel.id = 'manage-panel';

        const ta = $el('textarea');
        ta.id = 'manage-textarea';

        // 计算最长的按钮名视觉宽度，用于对齐
        const keys = Object.keys(searchBox.tags);
        const maxW = Math.max(...keys.map(visualWidth), 0);
        // 将 tags 对象格式化为易于编辑的文本
        const lines = Object.entries(searchBox.tags).map(([key, value]) => {
            const padding = ' '.repeat(maxW - visualWidth(key));
            return `${key}${padding}  @  ${value}`;
        });
        ta.value = lines.join('\n') + '\n';

        // 创建包含“保存”和“取消”按钮的工具栏
        const bar = $el('div');
        bar.id = 'manage-footer';

        const btnSave = $el('input');
        btnSave.type = 'button';
        btnSave.value = translate('save');
        btnSave.id = 'manage-save';
        btnSave.addEventListener('click', saveTags);

        const btnCancel = $el('input');
        btnCancel.type = 'button';
        btnCancel.value = translate('cancel');
        btnCancel.id = 'manage-cancel';
        btnCancel.addEventListener('click', () => panel.remove()); // 取消按钮直接移除面板

        bar.append(btnSave, btnCancel);
        panel.append(ta, bar);
        document.body.append(panel);

        // 如果传入 targetKey，则定位到对应行并选中
        if (targetKey) {
            const idx = keys.indexOf(String(targetKey));
            if (idx >= 0) {
                const startPos = idx > 0 ? lines.slice(0, idx).join('\n').length + 1 : 0;
                const lineText = lines[idx];

                ta.focus();
                ta.setSelectionRange(startPos, startPos + lineText.length);

                const lineHeight = parseInt(window.getComputedStyle(ta).lineHeight) || 18;
                ta.scrollTop = Math.max(0, idx * lineHeight - (ta.clientHeight - lineHeight) / 2);
                return;
            }
        }

        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
        ta.scrollTop = ta.scrollHeight;
    }

    /** 解析管理面板文本框中的内容，并保存新的搜索标签配置 */
    function saveTags() {
        const ta = $i('manage-textarea');
        if (!ta) return;

        const lines = ta.value.split('\n').filter(s => s.trim()); // 按行分割并忽略空行
        const nextTags = {}; // 用于存储解析后的新配置

        for (const line of lines) {
            const parts = line.split('@').map(s => s.trim());
            const key = parts[0];
            const val = (parts[1] || parts[0]).replace(/\s+/g, ' '); // 如果没有 '@'，则显示名称和标签相同

            if (!key || !val || parts.length > 2) {
                alert(translate('invalidInput') + line);
                return;
            }
            if (((key.split('"').length - 1) % 2) || ((val.split('"').length - 1) % 2)) {
                alert(translate('unmatchedQuotes') + line);
                return;
            }
            if (nextTags.hasOwnProperty(key)) {
                alert(translate('duplicateName') + key);
                return;
            }

            nextTags[key] = val;
        }

        searchBox.tags = nextTags;
        GM_setValue(STORAGE_KEY, searchBox.tags);
        $i('manage-panel')?.remove();
        buildPanel();
    }

    /** 启用标签按钮拖拽排序 */
    function enableDragSort(panel) {
        let dragging = null;

        panel.querySelectorAll('input[type="button"]').forEach(btn => {
            if (btn.value === '+') return; // "+" 不参与排序

            btn.draggable = true;

            btn.addEventListener('dragstart', e => {
                dragging = btn;
                e.dataTransfer.effectAllowed = 'move';
                btn.classList.add('dragging');
            });

            btn.addEventListener('dragend', () => {
                dragging = null;
                btn.classList.remove('dragging');
                saveOrderFromPanel(panel);
            });

            btn.addEventListener('dragover', e => {
                e.preventDefault();
                if (!dragging || dragging === btn) return;

                const rect = btn.getBoundingClientRect();
                const before = (e.clientX - rect.left) < rect.width / 2;

                if (before) {
                    panel.insertBefore(dragging, btn);
                } else {
                    panel.insertBefore(dragging, btn.nextSibling);
                }
            });
        });
    }

    /** 从排序后的 panel 元素重新生成 tags 并保存 */
    function saveOrderFromPanel(panel) {
        const newTags = {};
        panel.querySelectorAll('input[type="button"]').forEach(btn => {
            if (btn.value === '+') return;
            const key = btn.value;
            const val = searchBox.tags[key];
            if (val !== undefined) newTags[key] = val;
        });

        searchBox.tags = newTags;
        GM_setValue(STORAGE_KEY, searchBox.tags);

        buildPanel(); // 刷新 UI
    }

    /** 处理搜索框的双击事件，选中光标所在位置的完整 token */
    function selectTokenByDoubleClick(e) {
        const input = e.target;
        const value = input.value;
        const cursor = input.selectionStart ?? 0; // 获取当前光标位置
        const items = tokenize(value);

        let pos = 0; // 记录当前检查的 token 在字符串中的起始位置
        for (const item of items) {
            const start = pos;
            const end = pos + item.length;
            // 判断光标是否在该 token 的范围内
            if (cursor >= start && cursor <= end) {
                input.setSelectionRange(start, end); // 选中该 token
                break;
            }
            pos = end + 1; // 移动到下一个 token 的起始位置（跳过一个空格）
        }
    }

    /** 根据当前表单内容构建 URL，并在新标签页中打开 */
    function openInNewTab() {
        // 找到输入框所在的表单，如果找不到则使用页面上的第一个表单
        const form = searchBox.input?.form || document.forms[0];
        if (!form) return;

        // 使用表单的 action 属性和当前页面地址来构建一个完整的 URL
        const url = new URL(form.action, window.location.origin);

        // 遍历表单中的所有元素，将它们的值添加到 URL 的查询参数中
        Array.from(form.elements).forEach(el => {
            // 忽略没有 name、被禁用、值为空或为0的元素
            if (!el.name || el.disabled) return;
            const v = el.value;
            if (v == null || v === '' || v === '0') return;
            // 对于复选框和单选框，只添加被选中的
            if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;

            url.searchParams.set(el.name, v);
        });

        window.open(url, '_blank');
    }

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /** 颜色映射表，用于给不同收藏夹分配颜色 */
    const COLOR_MAP = {
        0: '#cccccc', 1: '#ff8080', 2: '#ffaa55', 3: '#ffff00', 4: '#80ff80',
        5: '#aaff55', 6: '#00ffff', 7: '#aaaaff', 8: '#cc80ff', 9: '#ff80cc'
    };

    const COLOR_MAP_B = {
        0: 'rgb(0, 0, 0)', 1: 'rgb(255, 0, 0)', 2: 'rgb(255, 170, 0)', 3: 'rgb(221, 221, 0)', 4: 'rgb(0, 136, 0)',
        5: 'rgb(153, 255, 68)', 6: 'rgb(68, 187, 255)', 7: 'rgb(0, 0, 255)', 8: 'rgb(85, 0, 136)', 9: 'rgb(238, 136, 238)'
    };

    /** 异步获取收藏夹目录列表 */
    const getFavcatList = async () => {
        let names = [];
        try {
            if (pageInfo.isFavoritesPage) {
                const icons = document.querySelectorAll('.nosel .fp .i');
                names = [...icons].map(div => div.title.trim());
            }
            else if (pageInfo.isUconfigPage) {
                names = [...document.querySelectorAll('input[name^="favorite_"][type="text"]')].map(input => input.value.trim());
            }
            else if (pageInfo.isGalleryPopupsPage) {
                const nosel = $('.nosel');
                if (nosel) {
                    names = [...nosel.querySelectorAll('div[style*="cursor:pointer"]')]
                        .map(div => {
                            const textDiv = div.querySelector('div[style*="padding-top"]');
                            return textDiv ? textDiv.textContent.trim() : null; // 找不到就返回 null (从收藏中移除 按钮)
                        })
                        .filter(Boolean); // 去掉 null
                }
            } else {
                // 其他页面用 fetch 请求
                const res = await fetch(window.location.origin + '/uconfig.php');
                const html = await res.text();
                names = [...html.matchAll(/input type="text" name="favorite_\d" value="(.*?)"/g)].map(m => m[1]);
            }
        } catch (error) {
            console.error('LOLICON 获取收藏夹目录列表时发生错误：', error);
        }
        return names;
    };

    /** 收藏夹目录 */
    let favcat = [];

    /** 异步函数：更新收藏夹目录 */
    async function updateFavcat() {
        favcat = await getFavcatList();
        localStorage.favcat = JSON.stringify(favcat);
        console.log('LOLICON 更新收藏夹目录', favcat);
    }

    /** 异步函数：初始化收藏夹列表 */
    async function initFavcat() {
        if (!localStorage.favcat || localStorage.favcat === '') {
            await updateFavcat();
        } else {
            favcat = JSON.parse(localStorage.favcat);
        }
    }

    /** 异步函数：发送收藏或取消收藏请求 // url: 请求地址 // add: true为收藏，false为取消收藏 // favIndex: 收藏夹编号 */
    const fetchFav = async (url, add, favIndex) => {
        try {
            // 发送POST请求，提交收藏/取消收藏参数
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: add
                    ? `favcat=${favIndex}&favnote=&apply=Add+to+Favorites&update=1`
                    : 'favcat=favdel&favnote=&update=1', // 取消收藏请求体
                credentials: 'same-origin' // 同源策略，携带cookie
            });

            const html = await res.text();
            // 从返回HTML中提取<script>代码（用于更新父窗口）
            const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
            if (scripts.length > 1) {
                let updateCode = scripts[1][1];
                // 去除window.opener调用和窗口关闭代码，防止影响当前页面
                updateCode = updateCode
                    .replace(/window\.opener\./g, '')
                    .replace(/window\.close\(\);?/g, '');
                new Function(updateCode)(); // 执行提取的JS代码
            }
        } catch (error) {
            console.error('LOLICON 发送收藏或取消收藏请求时发生错误：', error);
        }
    };

    /** 显示收藏菜单 // anchorEl: 触发菜单的锚元素，用于定位菜单位置 // favUrl: 收藏请求URL */
    function showFavMenu(anchorEl, favUrl) {
        // 移除已有的收藏菜单，避免重复显示
        const existingMenu = $('.fav_popup_menu');
        if (existingMenu) existingMenu.remove();

        // 判断是否显示“取消收藏”菜单项
        const shouldShowRemoveItem = () => {
            if (anchorEl.id === 'gdf') {
                if (anchorEl.querySelector('div.i') === null) return false;
            } else {
                if (!anchorEl.hasAttribute('title')) return false;
            }
            return true;
        };

        // 创建菜单容器并设置基础样式
        const menu = $el('div');
        menu.className = 'fav_popup_menu';
        menu.style.position = 'absolute';
        menu.style.background = 'rgba(0, 0, 0, 0.8)';
        // menu.style.border = '1px solid #000';
        // menu.style.borderRadius = '6px';
        menu.style.boxShadow = '0 0 6px rgba(0,0,0,0.8)';
        menu.style.padding = '2px';
        menu.style.zIndex = 9999;
        menu.style.color = '#fff';
        menu.style.minWidth = '166px';
        menu.style.fontSize = '10pt';
        menu.style.fontWeight = 'bold';
        menu.style.textShadow = '0 0 1.2px #000, 0 0 2.4px #000, 0 0 3.6px #000';


        // 创建菜单项的辅助函数
        function createMenuItem(text, color, onClick, options = {}) {
            const item = $el('div');
            item.textContent = text;
            item.style.padding = '6px';
            item.style.cursor = 'pointer';
            item.style.color = color;
            item.style.userSelect = 'none';
            item.style.minHeight = '18px';
            item.style.lineHeight = '18px';
            // item.style.transition = 'background 0.1s';

            if (options.isAction) {
                item.style.flex = '1';
                item.style.textAlign = 'center';
                item.style.fontSize = (options.fontSize || 10) + 'pt';
            }

            item.addEventListener('mouseenter', () => {
                item.style.color = '#fff';
                item.style.background = color;
            });
            item.addEventListener('mouseleave', () => {
                item.style.color = color;
                item.style.background = 'transparent';
            });
            item.addEventListener('click', onClick);

            return item;
        }

        // 添加收藏夹菜单项
        favcat.forEach((name, idx) => {
            const item = createMenuItem(name, COLOR_MAP[idx] || '#fff', () => {
                fetchFav(favUrl, true, idx).then(() => {
                    const iconDiv = anchorEl.querySelector('div#fav div.i');
                    if (iconDiv) {
                        iconDiv.style.marginLeft = '0';
                    }
                });
                menu.remove();
            });
            menu.appendChild(item);
        });

        // 添加“取消收藏”和“收藏弹窗”同一行按钮
        const actionRow = $el('div');
        actionRow.style.display = 'flex';

        // 左侧：收藏弹窗
        const popupItem = createMenuItem('⭐', '#fff', () => {
            window.open(favUrl, '_blank', 'width=675,height=415');
            menu.remove();
        }, { isAction: true, fontSize: 12 });
        actionRow.appendChild(popupItem);

        // 右侧：取消收藏
        if (shouldShowRemoveItem()) {
            const removeItem = createMenuItem('❌', '#f22', () => {
                fetchFav(favUrl, false, 0);
                menu.remove();
            }, { isAction: true, fontSize: 12 });
            actionRow.appendChild(removeItem);
        }

        menu.appendChild(actionRow);

        // 插入页面并定位
        document.body.appendChild(menu);
        const rect = anchorEl.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        let left = window.scrollX + rect.left;
        const scrollY = window.scrollY;
        let top = scrollY + rect.top - menuHeight;
        if (top < scrollY) {
            top = scrollY + rect.bottom;
        }

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';

        // 关闭菜单的函数
        const closeMenu = () => {
            if (menu.parentNode) {
                menu.remove();
            }
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('contextmenu', handler);
            window.removeEventListener('resize', handler);
        };

        const handler = e => {
            if (e.type === 'mousedown') {
                if (!menu.contains(e.target) && e.target !== anchorEl) {
                    closeMenu();
                }
            } else if (e.type === 'contextmenu' || e.type === 'resize') {
                closeMenu();
            }
        };

        // 绑定事件
        document.addEventListener('mousedown', handler);
        document.addEventListener('contextmenu', handler);
        window.addEventListener('resize', handler);
    }

    /** 用 Map 存储元素对应的原始状态，支持遍历批量操作 */
    const originalStates = new Map();

    /** 替换元素原onclick事件，绑定自定义点击事件显示收藏菜单 */
    const replaceOnClick = (el, favUrl) => {
        if (!Array.isArray(favcat) || favcat.length !== 10) return;

        // 先保存原始状态
        const originalOnClick = el.getAttribute('onclick');
        const originalCursor = el.style.cursor;

        // 自定义点击事件回调
        const clickHandler = e => {
            e.stopPropagation();
            showFavMenu(el, favUrl);
        };

        // 移除原onclick属性，防止冲突
        el.removeAttribute('onclick');

        // 设置鼠标样式为指针
        el.style.cursor = 'pointer';

        // 添加自定义事件监听
        el.addEventListener('click', clickHandler);

        // 保存状态以备恢复
        const oldState = originalStates.get(el) || {};
        originalStates.set(el, {
            ...oldState,
            originalOnClick,
            originalCursor,
            clickHandler,
        });
    };

    /** 恢复元素原onclick事件、鼠标样式、取消自定义点击事件 */
    function restoreElements() {
        // 先把所有保存的元素缓存到数组，避免边遍历边修改 Map 导致的问题
        const elements = Array.from(originalStates.keys());

        for (const el of elements) {
            const state = originalStates.get(el);
            if (!state) continue;

            const { originalOnClick, originalCursor, clickHandler, onMouseEnter, onMouseLeave, iconMarginLeft } = state;

            el.style.cursor = originalCursor || '';

            // 移除鼠标悬停事件监听
            el.removeEventListener('mouseenter', onMouseEnter);
            el.removeEventListener('mouseleave', onMouseLeave);

            if (pageInfo.listDisplayMode) {

            } else if (pageInfo.isGalleryPage) {
                el.removeAttribute('style');
                // 设置 gdf 内部 div#fav div.i 的 margin-left 为 0
                const iconDiv = el.querySelector('div#fav div.i');
                if (iconDiv) {
                    iconDiv.style.marginLeft = iconMarginLeft;
                }
            }

            // 恢复 onclick 属性
            if (originalOnClick) {
                el.setAttribute('onclick', originalOnClick);
            }

            // 解绑自定义点击事件
            el.removeEventListener('click', clickHandler);

            // 从缓存中移除，防止内存泄漏
            originalStates.delete(el);
        }
    }

    /** 给元素绑定鼠标悬停事件 */
    function bindHoverEffect(el) {
        function onMouseEnter() {
            let color = '#000000';
            if (pageInfo.isExhentai || pageInfo.isTor) { color = '#ffffff'; }
            if (pageInfo.listDisplayMode) {
                if (el.style.backgroundColor) return;
                el.style.borderColor = color;
            } else if (pageInfo.isGalleryPage) {
                el.style.backgroundColor = color + '24';
                el.style.boxShadow = 'inset 0 0 0 2px' + color + '12';
            }
        }
        function onMouseLeave() {
            if (pageInfo.listDisplayMode) {
                if (el.style.backgroundColor) return;
                el.style.borderColor = '';
            } else if (pageInfo.isGalleryPage) {
                el.style.backgroundColor = '';
                el.style.boxShadow = '';
            }
        }

        // 保存状态以备恢复
        const oldState = originalStates.get(el) || {};
        originalStates.set(el, {
            ...oldState,
            onMouseEnter,
            onMouseLeave,
        });

        // 绑定事件
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
    }

    /** 给列表页中的元素替换点击事件，启用收藏菜单 */
    async function replaceFavClickS() {
        if (!pageInfo.listDisplayMode) return;

        await initFavcat(); // 等待 favcat 数据就绪

        // 不同显示模式对应的选择器，选出需要绑定收藏功能的元素
        const strategies = {
            m: '.glthumb + div',
            p: '.glthumb + div',
            l: '.glthumb + div > :first-child',
            e: '.gl3e>:nth-child(2)',
            t: '.gl5t>:first-child>:nth-child(2)'
        };

        // 遍历所有匹配元素
        $$(strategies[pageInfo.listDisplayMode]).forEach(el => {
            if (!el.onclick) return; // 无onclick则跳过

            bindHoverEffect(el);

            const favUrl = el.onclick.toString().match(/https.*addfav/)[0]; // 从onclick字符串提取收藏URL
            replaceOnClick(el, favUrl); // 替换点击事件绑定收藏弹窗
        });
    }

    /** 给画廊元素替换点击事件，启用收藏菜单 */
    async function replaceFavClickG() {
        await initFavcat(); // 等待 favcat 数据就绪

        // 从URL路径解析画廊ID和类型
        const matchGallery = window.location.pathname.match(/\/g\/(\d+)\/(\w+)/);
        if (!matchGallery) return;

        // 拼接收藏请求地址
        const favUrl = `${window.location.origin}/gallerypopups.php?gid=${matchGallery[1]}&t=${matchGallery[2]}&act=addfav`;

        // 获取画廊按钮容器元素
        const gdf = $i('gdf');

        // 调整按钮容器样式，使内容居中且无左边距，设定固定高度和半透明背景
        gdf.style.paddingTop = '0';
        gdf.style.paddingLeft = '0';
        gdf.style.height = '36px';
        gdf.style.display = 'flex';
        gdf.style.justifyContent = 'center';
        gdf.style.alignItems = 'center';
        gdf.style.marginTop = '6px';

        bindHoverEffect(gdf);

        // 设置 gdf 内部 div#fav div.i 的 margin-left 为 0
        const iconDiv = gdf.querySelector('div#fav div.i');
        if (iconDiv) {
            // 保存状态以备恢复
            const oldState = originalStates.get(gdf) || {};
            originalStates.set(gdf, {
                ...oldState,
                iconMarginLeft: iconDiv.style.marginLeft,
            });
            iconDiv.style.marginLeft = '0';
        }

        replaceOnClick(gdf, favUrl); // 替换点击事件绑定收藏弹窗
    }

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /** 加载下一页的状态 */
    const nextPage = {
        isLoading: false,
        nextPageLink: null,
        loadedCount: 1
    }

    /** 获取下一页链接 */
    function getNextPageLink(doc) {
        if (pageInfo.listDisplayMode) {
            nextPage.nextPageLink = doc.querySelector('#dnext')?.href;
            if (nextPage.nextPageLink) {
                $i('unext').href = nextPage.nextPageLink;
                $i('dnext').href = nextPage.nextPageLink;
            }
        } else if (pageInfo.isGalleryPage) {
            nextPage.nextPageLink = doc.querySelector('.ptb tr:first-child td:last-child a')?.href;
            if (nextPage.nextPageLink) {
                $('.ptt tr:first-child td:last-child a').href = nextPage.nextPageLink;
                $('.ptb tr:first-child td:last-child a').href = nextPage.nextPageLink;
            }
        }
    }

    /** 无限滚动加载下一页 */
    async function loadNextPage() {
        if (nextPage.isLoading || !nextPage.nextPageLink) return;

        nextPage.isLoading = true;
        try {
            console.log('LOLICON 加载下一页：', nextPage.nextPageLink);
            const response = await fetch(nextPage.nextPageLink);
            const html = await response.text();
            const parser = new DOMParser();
            const fetchedDoc = parser.parseFromString(html, 'text/html');
            let nextContent;
            if (pageInfo.listDisplayMode === 't') {
                nextContent = fetchedDoc.querySelectorAll('.gl1t');
            } else if (pageInfo.listDisplayMode) {
                nextContent = fetchedDoc.querySelectorAll('.itg > tbody > tr');
            } else if (pageInfo.isGalleryPage) {
                nextContent = fetchedDoc.querySelectorAll('#gdt > a');
            }

            if (nextContent.length > 0) {
                const fragment = document.createDocumentFragment();
                nextContent.forEach((item, index) => {
                    if (pageInfo.listDisplayMode === 't' || pageInfo.listDisplayMode === 'e' || pageInfo.isGalleryPage || index > 0) {
                        fragment.appendChild(item);
                    }
                });

                if (pageInfo.listDisplayMode === 't') {
                    $c('itg gld')[0].appendChild(fragment);
                } else if (pageInfo.listDisplayMode) {
                    $('.itg > tbody').appendChild(fragment);
                } else if (pageInfo.isGalleryPage) {
                    $i('gdt').appendChild(fragment);
                }

                nextPage.loadedCount++;
                console.log('LOLICON 下一页内容已成功加载。');
                if (pageInfo.listDisplayMode) {
                    collectDataS();
                    if (pageInfo.listDisplayMode === 't') modifyThumbnailSizeS();
                    updateGlinkIndex();
                    if (cfg.quickFavorite) replaceFavClickS();
                    if (cfg.liveURLUpdate && !pageInfo.isPopularPage && !pageInfo.isFavoritesPage) {
                        throttledGetRowInfo();
                    }
                } else if (pageInfo.isGalleryPage) {
                    collectDataG();
                    modifyThumbnailSizeG();
                    throttledAdjustColumnsG();
                }

            } else {
                console.log('LOLICON 未找到下一页的内容，停止加载。');
            }

            getNextPageLink(fetchedDoc);

            if (nextPage.nextPageLink) {
                console.log('LOLICON 下一页链接已更新为：', nextPage.nextPageLink);
            } else {
                console.log('LOLICON 已是最后一页');
            }

        } catch (error) {
            console.error('LOLICON 加载下一页时发生错误：', error);
        } finally {
            nextPage.isLoading = false;
        }

        if (pageInfo.listDisplayMode && document.body.offsetHeight <= window.innerHeight) {
            throttledLoadNextPage();
        } else if (pageInfo.isGalleryPage && $i('gdt').getBoundingClientRect().bottom <= window.innerHeight) {
            throttledLoadNextPage();
        }
    }

    /** 元素位置 */
    let elementPositions = [];

    /** 获取行信息 */
    function getRowInfo() {
        elementPositions = [];
        const scrollY = window.scrollY;
        const startIndex = (pageInfo.listDisplayMode === 't' || pageInfo.listDisplayMode === 'e') ? 0 : 1;
        const step = (pageInfo.listDisplayMode === 't') ? layout.columnsS : 1;

        for (let i = startIndex; i < pageItemsData.length; i += step) {
            const el = pageItemsData[i].el;
            elementPositions.push({
                bottom: el.getBoundingClientRect().bottom + scrollY,
                url: pageItemsData[i].gid + 1,
            });
        }

        updateURLOnScroll();
    }

    /** 最顶部元素的 URL */
    let topMostElementURL;

    /** 更新地址栏 */
    function updateURLOnScroll() {
        let newTopMostElementURL;
        const scrollY = window.scrollY;

        for (let i = 0; i < elementPositions.length; i++) {
            const { bottom, url } = elementPositions[i];
            if (bottom >= scrollY) {
                newTopMostElementURL = url;
                break;
            }
        }

        if (newTopMostElementURL != topMostElementURL) {
            let urlObj = new URL(pageInfo.originalUrl);
            urlObj.searchParams.delete('jump');
            urlObj.searchParams.delete('seek');
            urlObj.searchParams.set('next', newTopMostElementURL);
            window.history.replaceState(null, '', urlObj.toString());
            topMostElementURL = newTopMostElementURL;
        }
    }

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    /** EH/ExH 页面切换信息 */
    const toggleEHInfo = {
        allowed: false, // 是否可切换
        currentHost: null, // 当前 host
        targetHost: null // 切换目标 host
    };

    /** 获取 EH/ExH 页面切换信息 */
    function getToggleEHInfo() {
        let allowPathReplace =
            pageInfo.isHomePage ||
            pageInfo.isGalleryPage ||
            pageInfo.isWatchedPage ||
            pageInfo.isPopularPage ||
            pageInfo.isTorrentsPage ||
            pageInfo.isFavoritesPage ||
            pageInfo.isUconfigPage ||
            pageInfo.isMytagsPage;

        if (window.location.hostname === 'upload.e-hentai.org') {
            toggleEHInfo.currentHost = 'upload.e-hentai.org';
            toggleEHInfo.targetHost = 'upld.exhentai.org/upld';
            allowPathReplace = true;
        } else if (window.location.hostname === 'upld.exhentai.org' && window.location.pathname.startsWith('/upld')) {
            toggleEHInfo.currentHost = 'upld.exhentai.org/upld';
            toggleEHInfo.targetHost = 'upload.e-hentai.org';
            allowPathReplace = true;
        } else if (pageInfo.isEhentai) {
            toggleEHInfo.currentHost = 'e-hentai.org';
            toggleEHInfo.targetHost = 'exhentai.org';
        } else if (pageInfo.isExhentai) {
            toggleEHInfo.currentHost = 'exhentai.org';
            toggleEHInfo.targetHost = 'e-hentai.org';
        }

        toggleEHInfo.allowed = !pageInfo.isTor && $i('nb') && allowPathReplace;
    }

    /** 切换 EH/ExH 按钮*/
    function toggleEHButton() {
        if (cfg.toggleEH && !$i('toggleEH')) {
            const div = $el('div');
            const btn = $el('a');

            btn.textContent = pageInfo.isEhentai ? 'ExH' : 'EH';
            btn.href = pageInfo.originalUrl.replace(toggleEHInfo.currentHost, toggleEHInfo.targetHost);

            div.id = 'toggleEH';
            div.appendChild(btn);
            $i('nb').appendChild(div);
        } else if (!cfg.toggleEH && $i('toggleEH')) {
            $i('toggleEH').remove();
        }
    }

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

    /** 防抖函数 */
    function debounce(func, wait) {
        let timeout;

        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    /** 节流函数 */
    function throttle(func, wait) {
        let lastTime = 0;
        let timeout = null;

        return function (...args) {
            const now = Date.now();
            const remaining = wait - (now - lastTime);

            if (remaining <= 0) {
                lastTime = now;
                func(...args);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    lastTime = Date.now();
                    timeout = null;
                    func(...args);
                }, remaining);
            }
        };
    }

    /** 更新画廊列表页宽-节流 */
    const throttledAdjustColumnsS = throttle(adjustColumnsS, 60);
    /** 更新画廊页宽-节流 */
    const throttledAdjustColumnsG = throttle(adjustColumnsG, 60);
    /** 更新地址栏-节流 */
    const throttledUpdateURLOnScroll = throttle(updateURLOnScroll, 60);
    /** 获取行信息-节流 */
    const throttledGetRowInfo = throttle(getRowInfo, 240);
    /** 加载下一页-节流 */
    const throttledLoadNextPage = throttle(loadNextPage, 600);

    /** 监控无限滚动 */
    function monitorInfiniteScroll() {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && cfg.infiniteScroll) {
                if (cfg.maxPagesS != 0 && nextPage.loadedCount >= cfg.maxPagesS) {
                    console.log('LOLICON 已达到最大页数限制: ', nextPage.loadedCount, ' >= ', cfg.maxPagesS);
                    return
                }
                throttledLoadNextPage();
            }
        });

        const bottomElement = $el('div');
        bottomElement.classList.add('LOLICON-infinite-scroll-trigger');
        document.body.appendChild(bottomElement);

        observer.observe(bottomElement);
    }

    /** 监控更缩略图 */
    function monitorMoreThumbnail() {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && cfg.moreThumbnail) {
                if (cfg.maxPagesG != 0 && nextPage.loadedCount >= cfg.maxPagesG) {
                    console.log('LOLICON 已达到最大页数限制: ', nextPage.loadedCount, ' >= ', cfg.maxPagesG);
                    return
                }
                throttledLoadNextPage();
            }
        });

        const trigger = $el('div');
        trigger.id = 'LOLICON-more-thumbnail-trigger';
        $i('gdt').after(trigger);

        observer.observe(trigger);
    }

    console.log('LOLICON 开始');

    // 设置菜单
    GM_registerMenuCommand(translate('settings'), showSettingsPanel);

    // 初始化基础
    initialize();
    calculateDimensions();

    // 收藏页面修改
    if (pageInfo.isFavoritesPage) {
        $c('ido')[0].style.minWidth = '740px';
    }

    // 更新收藏夹目录
    if (pageInfo.isFavoritesPage || pageInfo.isUconfigPage || pageInfo.isGalleryPopupsPage) {
        updateFavcat();
    }

    // EH/ExH 切换按钮
    getToggleEHInfo();
    if (toggleEHInfo.allowed) {
        toggleEHButton();
    }

    if (pageInfo.listDisplayMode) {
        collectDataS();

        if (pageInfo.listDisplayMode === 't') {
            modifyThumbnailSizeS();
        }
        adjustColumnsS();
        updateGlinkIndex();

        getNextPageLink(document);
        monitorInfiniteScroll();
        quickTagPanel();
        if (cfg.quickFavorite) {
            replaceFavClickS();
        }
        window.addEventListener('resize', throttledAdjustColumnsS);
        window.addEventListener('scroll', () => {
            if (cfg.liveURLUpdate && !pageInfo.isPopularPage && !pageInfo.isFavoritesPage) {
                throttledUpdateURLOnScroll();
            }
        });
    } else if ($i('searchbox') || pageInfo.isFavoritesPage) {
        adjustColumnsS();
        quickTagPanel();
        window.addEventListener('resize', throttledAdjustColumnsS);
    } else if (pageInfo.isGalleryPage) {
        collectDataG();
        modifyThumbnailSizeG();
        adjustColumnsG();

        getNextPageLink(document);
        monitorMoreThumbnail()

        if (cfg.quickFavorite) {
            replaceFavClickG();
        }
        window.addEventListener('resize', throttledAdjustColumnsG);
    }

})();