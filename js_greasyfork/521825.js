// ==UserScript==
// @name         百度搜索增强
// @name:zh-CN   百度搜索增强
// @name:zh-TW   百度搜索增强
// @name:en      baidu enhancement
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为百度搜索添加Bing、Yandex、Bilibili、知乎和360搜索快捷搜索按钮
// @description:zh-cn  为百度搜索添加Bing、Yandex、Bilibili、知乎和360搜索快捷搜索按钮
// @description:zh-tw  為百度搜索添加Bing、 Yandex、Bilibili、 知乎和360蒐索快捷蒐索按鈕
// @description:en  Add Bing to Baidu search Yandex、Bilibili、 Zhihu and 360 Search Quick Search Button
// @author       来一打香菜
// @match        https://www.baidu.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @icon         https://www.baidu.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/521825/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521825/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

GM_addStyle(`
    .search-settings-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
    }
    .search-settings-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    }
    .search-settings-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .search-settings-option {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }
    .search-settings-option label {
        margin-left: 10px;
        cursor: pointer;
    }
    .search-settings-buttons {
        margin-top: 20px;
        text-align: right;
    }
    .search-settings-buttons button {
        padding: 6px 12px;
        margin-left: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .search-settings-save {
        background: #4e6ef2;
        color: white;
    }
    .search-settings-cancel {
        background: #f5f5f5;
    }

    #head_wrapper .s_form {
        width: auto !important;
        height: 100%;
        margin: 0 auto;
        text-align: center;
        z-index: 100;
    }
    #head_wrapper .s_btn_wr {
        width: auto !important;
        height: 44px;
        position: relative;
        z-index: 2;
    }
    .wrapper_new .s_btn_wr {
        width: auto;
        position: relative;
        z-index: 2;
        zoom: 1;
        border: 0;
    }

    #head_wrapper {
        width: auto !important;
        min-width: 850px !important;
        padding: 0 !important;
        display: flex;

    }

    #head_wrapper .s_form_wrapper {
        position: relative;
        text-align: center;
    }

    #head_wrapper .s_btn_wr {
        display: inline-block;
        vertical-align: top;
    }

    #head_wrapper .s_form .s_tools {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    .s_btn_wr input,
    .search-enhance-google,
    .search-enhance-bing,
    .search-enhance-yandex,
    .search-enhance-bilibili,
    .search-enhance-zhihu,
    .search-enhance-360 {
        vertical-align: top !important;
    }

    #head_wrapper #form .bdsug-new {
    width: 544px;
    top: 35px;
    border-radius: 0 0 10px 10px;
    border: 2px solid #4E6EF2!important;
    border-top: 0!important;
    box-shadow: none;
    font-family: Arial,sans-serif;
    z-index: 1;
    text-align: left;
}
    .wrapper_new .fm {
    margin: 15px 0 0px 16px;
}
`);

(function () {
    'use strict';

    const getSettings = () => {
        return {
            baidu: GM_getValue('showBaidu', true),
            google: GM_getValue('showGoogle', false),
            bing: GM_getValue('showBing', true),
            so360: GM_getValue('show360', false),
            yandex: GM_getValue('showYandex', false),
            bilibili: GM_getValue('showBilibili', false),
            zhihu: GM_getValue('showZhihu', true)
        };
    };

    const saveSettings = (settings) => {
        GM_setValue('showBaidu', settings.baidu);
        GM_setValue('showGoogle', settings.google);
        GM_setValue('showBing', settings.bing);
        GM_setValue('show360', settings.so360);
        GM_setValue('showYandex', settings.yandex);
        GM_setValue('showBilibili', settings.bilibili);
        GM_setValue('showZhihu', settings.zhihu);
    };

    const getCheckedCount = (settings) => {
        return Object.values(settings).filter(value => value).length;
    };

    const getFirstChecked = (settings) => {
        return Object.keys(settings).find(key => settings[key]);
    };

    const createSettingsDialog = () => {
        const settings = getSettings();

        const overlay = document.createElement('div');
        overlay.className = 'search-settings-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'search-settings-dialog';

        dialog.innerHTML = `
            <div class="search-settings-title">搜索设置</div>
            <div class="search-settings-option">
                <input type="checkbox" id="baidu-option" ${settings.baidu ? 'checked' : ''}>
                <label for="baidu-option">启用百度搜索</label>
            </div>
            <div class="search-settings-option">
                <input type="checkbox" id="google-option" ${settings.google ? 'checked' : ''}>
                <label for="google-option">启用 Google 搜索</label>
            </div>
            <div class="search-settings-option">
                <input type="checkbox" id="bing-option" ${settings.bing ? 'checked' : ''}>
                <label for="bing-option">启用 Bing 搜索</label>
            </div>
            <div class="search-settings-option">
                <input type="checkbox" id="360-option" ${settings.so360 ? 'checked' : ''}>
                <label for="360-option">启用 360 搜索</label>
            </div>
            <div class="search-settings-option">
                <input type="checkbox" id="yandex-option" ${settings.yandex ? 'checked' : ''}>
                <label for="yandex-option">启用 Yandex 搜索</label>
            </div>
            <div class="search-settings-option">
                <input type="checkbox" id="bilibili-option" ${settings.bilibili ? 'checked' : ''}>
                <label for="bilibili-option">启用 Bilibili 搜索</label>
            </div>
            <div class="search-settings-option">
                <input type="checkbox" id="zhihu-option" ${settings.zhihu ? 'checked' : ''}>
                <label for="zhihu-option">启用知乎搜索</label>
            </div>
            <div class="search-settings-buttons">
                <button class="search-settings-cancel">取消</button>
                <button class="search-settings-save">保存</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        const closeDialog = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };

        overlay.addEventListener('click', closeDialog);
        dialog.querySelector('.search-settings-cancel').addEventListener('click', closeDialog);

        dialog.querySelector('.search-settings-save').addEventListener('click', () => {
            const newSettings = {
                baidu: document.getElementById('baidu-option').checked,
                google: document.getElementById('google-option').checked,
                bing: document.getElementById('bing-option').checked,
                so360: document.getElementById('360-option').checked,
                yandex: document.getElementById('yandex-option').checked,
                bilibili: document.getElementById('bilibili-option').checked,
                zhihu: document.getElementById('zhihu-option').checked
            };
            saveSettings(newSettings);
            updateButtonsVisibility(newSettings);
            closeDialog();
        });

        const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
            });
        });
    };

    GM_registerMenuCommand('搜索设置', createSettingsDialog);

    const updateButtonsVisibility = (settings) => {
        const baiduButton = document.getElementById('su');
        const googleButton = document.querySelector('.search-enhance-google');
        const bingButton = document.querySelector('.search-enhance-bing');
        const so360Button = document.querySelector('.search-enhance-360');
        const yandexButton = document.querySelector('.search-enhance-yandex');
        const bilibiliButton = document.querySelector('.search-enhance-bilibili');
        const zhihuButton = document.querySelector('.search-enhance-zhihu');

        if (baiduButton) {
            baiduButton.style.display = settings.baidu ? 'inline-block' : 'none';
        }

        if (googleButton) googleButton.style.display = settings.google ? 'inline-block' : 'none';
        if (bingButton) bingButton.style.display = settings.bing ? 'inline-block' : 'none';
        if (so360Button) so360Button.style.display = settings.so360 ? 'inline-block' : 'none';
        if (yandexButton) yandexButton.style.display = settings.yandex ? 'inline-block' : 'none';
        if (bilibiliButton) bilibiliButton.style.display = settings.bilibili ? 'inline-block' : 'none';
        if (zhihuButton) zhihuButton.style.display = settings.zhihu ? 'inline-block' : 'none';
    };

    window.addEventListener('load', function () {
        const originalButton = document.getElementById('su');
        if (!originalButton) return;

        const getBaiduButtonHeight = () => window.getComputedStyle(originalButton).height;
        let baiduButtonHeight = getBaiduButtonHeight();
        const buttonsWrapper = document.createElement('div');
        const updateButtonsSizes = () => {
            const newHeight = getBaiduButtonHeight();
            if (newHeight !== baiduButtonHeight) {
                baiduButtonHeight = newHeight;


                buttonsWrapper.style.height = baiduButtonHeight;


                const searchButtons = buttonsWrapper.getElementsByTagName('button');
                for (let button of searchButtons) {
                    button.style.width = baiduButtonHeight;
                    button.style.height = baiduButtonHeight;
                    button.style.backgroundSize = `calc(${baiduButtonHeight} / 2.2)`;
                }
            }
        };
        window.addEventListener('scroll', updateButtonsSizes);
        window.addEventListener('resize', updateButtonsSizes);
        buttonsWrapper.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: ${baiduButtonHeight};
            margin-left: 6px;
            vertical-align: top;
        `;

        const s_btn_wr = document.querySelector('.s_btn_wr');
        if (s_btn_wr) {
            s_btn_wr.parentNode.insertBefore(buttonsWrapper, s_btn_wr.nextSibling);
        }

        originalButton.style.cssText = originalButton.style.cssText;

        const createSearchButton = (className, bgColor, iconUrl) => {
            const button = document.createElement('button');
            button.className = className;
            button.style.cssText = `
                width: ${baiduButtonHeight};
                height: ${baiduButtonHeight};
                border: none;
                border-radius: 4px;
                cursor: pointer;
                background: ${bgColor} url('${iconUrl}') center center no-repeat;
                background-size: calc(${baiduButtonHeight} / 2.2);
                opacity: 0.9;
                padding: 0;
                margin: 0;
                flex-shrink: 0;
                vertical-align: top;
            `;

            return button;
        };

        const zhihuButton = createSearchButton(
            'search-enhance-zhihu',
            '#0066FF',
            'https://static.zhihu.com/heifetz/favicon.ico'
        );

        const bilibiliButton = createSearchButton(
            'search-enhance-bilibili',
            '#fb7299',
            'https://www.bilibili.com/favicon.ico'
        );

        const googleButton = createSearchButton(
            'search-enhance-google',
            '#4285f4',
            'https://www.google.com/favicon.ico'
        );

        const bingButton = createSearchButton(
            'search-enhance-bing',
            '#008373',
            'https://www.bing.com/favicon.ico'
        );

        const yandexButton = createSearchButton(
            'search-enhance-yandex',
            '#ff0000',
            'https://yandex.com/favicon.ico'
        );

        const so360Button = createSearchButton(
            'search-enhance-360',
            '#00A86B',
            'https://www.so.com/favicon.ico'
        );

        buttonsWrapper.appendChild(googleButton);
        buttonsWrapper.appendChild(bingButton);
        buttonsWrapper.appendChild(yandexButton);
        buttonsWrapper.appendChild(bilibiliButton);
        buttonsWrapper.appendChild(zhihuButton);
        buttonsWrapper.appendChild(so360Button);

        googleButton.addEventListener('click', function () {
            const keyword = document.getElementById('kw').value;
            if (keyword) {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, '_blank');
            }
        });

        bingButton.addEventListener('click', function () {
            const keyword = document.getElementById('kw').value;
            if (keyword) {
                window.open(`https://www.bing.com/search?q=${encodeURIComponent(keyword)}`, '_blank');
            }
        });

        yandexButton.addEventListener('click', function () {
            const keyword = document.getElementById('kw').value;
            if (keyword) {
                window.open(`https://yandex.com/search/?text=${encodeURIComponent(keyword)}`, '_blank');
            }
        });

        bilibiliButton.addEventListener('click', function () {
            const keyword = document.getElementById('kw').value;
            if (keyword) {
                window.open(`https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`, '_blank');
            }
        });

        zhihuButton.addEventListener('click', function () {
            const keyword = document.getElementById('kw').value;
            if (keyword) {
                window.open(`https://www.zhihu.com/search?q=${encodeURIComponent(keyword)}`, '_blank');
            }
        });

        so360Button.addEventListener('click', function () {
            const keyword = document.getElementById('kw').value;
            if (keyword) {
                window.open(`https://www.so.com/s?q=${encodeURIComponent(keyword)}`, '_blank');
            }
        });

        googleButton.addEventListener('mouseover', () => googleButton.style.opacity = '1');
        googleButton.addEventListener('mouseout', () => googleButton.style.opacity = '0.9');
        bingButton.addEventListener('mouseover', () => bingButton.style.opacity = '1');
        bingButton.addEventListener('mouseout', () => bingButton.style.opacity = '0.9');
        yandexButton.addEventListener('mouseover', () => yandexButton.style.opacity = '1');
        yandexButton.addEventListener('mouseout', () => yandexButton.style.opacity = '0.9');
        bilibiliButton.addEventListener('mouseover', () => bilibiliButton.style.opacity = '1');
        bilibiliButton.addEventListener('mouseout', () => bilibiliButton.style.opacity = '0.9');
        zhihuButton.addEventListener('mouseover', () => zhihuButton.style.opacity = '1');
        zhihuButton.addEventListener('mouseout', () => zhihuButton.style.opacity = '0.9');
        so360Button.addEventListener('mouseover', () => so360Button.style.opacity = '1');
        so360Button.addEventListener('mouseout', () => so360Button.style.opacity = '0.9');

        googleButton.className = 'search-enhance-google';
        bingButton.className = 'search-enhance-bing';
        yandexButton.className = 'search-enhance-yandex';
        bilibiliButton.className = 'search-enhance-bilibili';
        zhihuButton.className = 'search-enhance-zhihu';
        so360Button.className = 'search-enhance-360';

        updateButtonsVisibility(getSettings());

    });
})();
