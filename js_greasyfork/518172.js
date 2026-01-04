// ==UserScript==
// @name        Image Search Script
// @name:zh-TW  Image Search Script
// @name:zh-CN  Image Search Script
// @namespace   https://github.com/Pixmi/image-search-script
// @version     1.1.9
// @description Long-pressing the right mouse button brings up the image search menu, offering a smooth and concise user experience.
// @description:zh-TW 長按滑鼠右鍵呼叫圖片搜尋選單，提供流暢且簡潔的使用體驗。
// @description:zh-CN 长按滑鼠右键呼叫图片搜寻选单，提供流畅且简洁的使用体验。
// @author      Pixmi
// @homepage    https://github.com/Pixmi/image-search-script
// @supportURL  https://github.com/Pixmi/image-search-script/issues
// @icon        https://github.com/Pixmi/image-search-script/raw/main/icon.svg
// @match       *://*/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_notification
// @connect     ascii2d.net
// @license     GPL-3.0
// @run-at      document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/518172/Image%20Search%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/518172/Image%20Search%20Script.meta.js
// ==/UserScript==

GM_addStyle(`
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
@keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
#image-search-menu {
    animation: fadeOut 200ms ease-in-out forwards;
    background-color: rgba(0, 0, 0, .75);
    color: rgb(255, 255, 255);
    display: none;
    flex-direction: column;
    font-size: 16px;
    width: unset;
    min-width: 150px;
    height: unset;
    min-height: unset;
    position: fixed;
    top: unset;
    left: unset;
    z-index: 9999;
}
#image-search-menu.show {
    animation: fadeIn 200ms ease-in-out forwards;
    display: flex;
}
.image-search-option {
    cursor: pointer;
    display: block;
    padding: 5px 10px;
}
.image-search-option + .image-search-option {
    border-top: 1px solid rgba(255, 255, 255, .5);
}
.image-search-option:hover {
    background-color: rgba(255, 255, 255, .3);
}
iframe#image-search-setting {
    width: 350px !important;
    height: 500px !important;
}
`);

const searchOptions = new Map([
    {
        label: 'Google Lens',
        key: 'GOOGLE_LENS',
        url: 'https://lens.google.com/uploadbyurl?url=%s'
    }, {
        label: 'SauceNAO',
        key: 'SAUCENAO',
        url: 'https://saucenao.com/search.php?url=%s'
    }, {
        label: 'Ascii2D',
        key: 'ASCII2D',
        url: ''
    }, {
        label: 'IQDB',
        key: 'IQDB',
        url: 'https://iqdb.org/?url=%s'
    }, {
        label: 'TinEye',
        key: 'TINEYE',
        url: 'https://www.tineye.com/search?url=%s'
    }, {
        label: 'Baidu',
        key: 'BAIDU',
        url: 'https://image.baidu.com/n/pc_search?queryImageUrl=%s'
    }, {
        label: 'Bing',
        key: 'BING',
        url: 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s'
    }
].map(item => [item.key, item]));

(function () {
    'use strict';

    const hoverOpen = {
        enabled: GM_getValue('HOVER_OPEN', false),
        minWidth: GM_getValue('HOVER_OPEN_MIN_WIDTH', 100),
        minHeight: GM_getValue('HOVER_OPEN_MIN_HEIGHT', 100)
    };

    const hoverCheck = (event) => {
        const { target, relatedTarget } = event;
        if (target.className == 'image-search-option' && relatedTarget == searchMenu.image) {
            return true;
        }
        if (target.tagName === 'IMG' && target.width >= hoverOpen.minWidth && target.height >= hoverOpen.minHeight) {
            return true;
        }
        return false;
    };

    const notey = (text) => {
        GM_notification(text, false, 'https://github.com/Pixmi/image-search-script/raw/main/icon.svg');
    };

    document.addEventListener('mouseover', (event) => {
        if (hoverOpen.enabled) {
            if (hoverCheck(event)) {
                searchMenu.image = event.relatedTarget;
                searchMenu.open(event.target);
            } else {
                searchMenu.clear();
            }
        }
    });

    document.addEventListener('mousedown', (event) => {
        searchMenu.holding = false;
        if (event.button === 2 && event.target.nodeName === 'IMG') {
            searchMenu.timer = setTimeout(() => {
                searchMenu.holding = true;
                searchMenu.open(event.target);
            }, 200);
        } else {
            if (event.target !== searchMenu.pane && !event.target.classList.contains('image-search-option')) {
                searchMenu.clear();
            }
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 2) {
            clearTimeout(searchMenu.timer);
            if (searchMenu.holding) {
                event.preventDefault();
            }
        }
    });

    document.addEventListener('contextmenu', (event) => {
        if (searchMenu.holding) {
            event.preventDefault();
        } else {
            searchMenu.clear();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            searchMenu.update();
        }
    });

    document.addEventListener('scroll', () => { searchMenu.update(); });
    window.addEventListener('resize', () => { searchMenu.update(); });

    class searchMenuController {
        constructor() {
            this.panel = null;
            this.image = null;
            this.holding = false;
            this.timer = null;
            this.init();
        }

        init() {
            this.panel = document.createElement('div');
            this.panel.id = 'image-search-menu';
            this.panel.addEventListener('click', (event) => {
                const action = event.target.dataset.action || false;
                if (action) {
                    switch (action) {
                        case 'ASCII2D':
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: 'https://ascii2d.net/imagesearch/search/',
                                data: JSON.stringify({ uri: this.image.src }),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                timeout: 10000,
                                onload: function(response) {
                                    if (response.status == 200) {
                                        GM_openInTab(response.finalUrl, true);
                                    } else {
                                        notey('Ascii2D Response Error');
                                    }
                                },
                                onerror: function(error) {
                                    notey('Ascii2D Request Error');
                                },
                                ontimeout: function(error) {
                                    notey('Ascii2D Request Timeout');
                                }
                            });
                            break;
                        default: {
                            const option = searchOptions.get(action) || false;
                            if (!option) break;
                            const url = option.url.replace('%s', encodeURIComponent(this.image.src));
                            GM_openInTab(url, true);
                            break;
                        }
                    }
                }
                this.clear();
            });
            document.body.append(this.panel);
        }

        open(target) {
            if (target.nodeName === 'IMG') {
                while (this.panel.hasChildNodes()) { this.panel.lastChild.remove(); }
                for (const [key, option] of searchOptions) {
                    if (!GM_getValue(key, true)) continue;
                    const item = document.createElement('div');
                    item.className = 'image-search-option';
                    item.textContent = option.label;
                    item.dataset.action = key;
                    this.panel.append((item));
                }
                this.image = target;
                this.update();
                this.panel.classList.add('show');
            }
        }

        update() {
            if (this.image) {
                const status = {
                    width: this.image.width,
                    left: this.image.x,
                    top: this.image.y
                };
                for (const key of Object.keys(status)) {
                    this.panel.style[key] = `${status[key]}px`;
                }
            }
        }

        clear() {
            this.image = null;
            this.panel.classList.remove('show');
            this.panel.style.width = 0;
            this.panel.style.left = 0;
            this.panel.style.top = 0;
        }
    }

    const searchMenu = new searchMenuController();

    GM_registerMenuCommand('Setting', () => config.open());

    const config = new GM_config({
        'id': 'image-search-setting',
        'css': `
            #image-search-setting * {
                box-sizing: border-box;
            }
            #image-search-setting {
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding: 10px;
                margin: 0;
            }
            #image-search-setting_wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            #image-search-setting_buttons_holder {
                text-align: center;
                margin-top: auto;
            }
            .config_var {
                margin: 5px 0 !important;
            }
            .field_label {
                font-size: 14px !important;
            }
        `,
        'title': 'Image Search Setting',
        'fields': {
            'GOOGLE_LENS': {
                'type': 'checkbox',
                'label': 'Google Lens',
                'section': ['Search Options'],
                'default': true,
            },
            'SAUCENAO': {
                'type': 'checkbox',
                'label': 'SauceNAO',
                'default': true,
            },
            'ASCII2D': {
                'type': 'checkbox',
                'label': 'Ascii2D',
                'default': true,
            },
            'IQDB': {
                'type': 'checkbox',
                'label': 'IQDB',
                'default': true,
            },
            'TINEYE': {
                'type': 'checkbox',
                'label': 'TinEye',
                'default': true,
            },
            'BAIDU': {
                'type': 'checkbox',
                'label': 'Baidu',
                'default': true,
            },
            'BING': {
                'type': 'checkbox',
                'label': 'Bing',
                'default': true,
            },
            'HOVER_OPEN': {
                'type': 'checkbox',
                'label': 'Enabled hover open',
                'section': ['Hover images to open menu'],
                'default': false,
            },
            'HOVER_OPEN_MIN_WIDTH': {
                'label': 'Image min width (px)',
                'type': 'int',
                'default': 100,
            },
            'HOVER_OPEN_MIN_HEIGHT': {
                'label': 'Image min height (px)',
                'type': 'int',
                'default': 100,
            }
        },
        'events': {
            'init': () => {
                for (const [key] of searchOptions) { config.set(key, GM_getValue(key, true)); }
                config.set('HOVER_OPEN', GM_getValue('HOVER_OPEN', false));
                config.set('HOVER_OPEN_MIN_WIDTH', GM_getValue('HOVER_OPEN_MIN_WIDTH', 100));
                config.set('HOVER_OPEN_MIN_HEIGHT', GM_getValue('HOVER_OPEN_MIN_HEIGHT', 100));
            },
            'save': () => {
                for (const [key] of searchOptions) { GM_setValue(key, config.get(key)); }
                GM_setValue('HOVER_OPEN', config.get('HOVER_OPEN'));
                GM_setValue('HOVER_OPEN_MIN_WIDTH', config.get('HOVER_OPEN_MIN_WIDTH'));
                GM_setValue('HOVER_OPEN_MIN_HEIGHT', config.get('HOVER_OPEN_MIN_HEIGHT'));
                hoverOpen.enabled = config.get('HOVER_OPEN');
                hoverOpen.minWidth = config.get('HOVER_OPEN_MIN_WIDTH');
                hoverOpen.minHeight = config.get('HOVER_OPEN_MIN_HEIGHT');
                config.close();
            }
        }
    });
})();
