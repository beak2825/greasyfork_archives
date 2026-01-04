// ==UserScript==
// @name        💖 VIP视频解析
// @namespace   https://greasyfork.org/zh-CN/users/1409010-i-breathe
// @version     5.2.0
// @description 自用视频解析、多源切换、简洁易用、UI美观（支持"爱优腾芒"等多平台多解析源切换）
// @author      I-Breathe
// @include     *
// @include     *iqiyi*
// @include     *qq*
// @include     *youku*
// @include     *bilibili*
// @include     *mgtv*
// @include     *sohu*
// @include     *pptv*
// @include     *le*
// @include     *1905*
// @include     *acfun*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/528675/%F0%9F%92%96%20VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/528675/%F0%9F%92%96%20VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const CONFIG = {
        buttonSize: 50,
        buttonRight: '25px',
        buttonBottom: '35px',
        imageUrl: GM_getValue('imageUrl', 'https://img13.360buyimg.com/ddimg/jfs/t1/121241/11/19612/181715/5fbac680E636138b5/267dd280e727aff4.jpg'),
        opacity: 1,
        buttonRadius: '50%',
        listBlur: '10px',
        listBgColor: 'rgba(20,20,20,0.5)',
        listColor: '#00000099',
        listFontSize: '14px',
        itemHoverBg: 'rgba(255,255,255,0.2)',
        selectedColor: '#FFFFFA',
        breatheColors: ['#FF00FF95', '#00FAFF95', '#FFFF0095', '#00FFFF95', '#00FF0095'],
        breatheDuration: 8,
        glowSize: 7,
        parseUrl: GM_getValue('selectedParseUrl', 'https://bd.jx.cn/?url='),
        parseUrls: GM_getValue('storedParseUrls', [
            ["https://bd.jx.cn/?url=", "冰豆弹幕"],
            ["https://am1907.top/?jx=", "1907解析"],
            ["https://jx.xmflv.cc/?url=", "虾米解析"],
            ["https://jx.xymp4.cc/?url=", "咸鱼解析"],
            ["https://www.yemu.xyz/?url=", "夜幕解析"],
            ["https://jx.77flv.cc/?url=", "77云解析"],
            ["https://www.8090g.cn/jiexi/?url=", "8090g"],
            ["https://jx.playerjy.com/?url=", "PlayerJy"],
            ["https://www.ckplayer.vip/jiexi/?url=", "CkPlay"],
            ["https://www.pangujiexi.com/jiexi/?url=", "盘古解析"],
            ["https://jx.hls.one/?url=", "hls解析"],
            ["https://jx.973973.xyz/?url=", "973播放"],
            ["https://jx.nnxv.cn/tv.php?url=", "七哥解析"],
            ["https://jx.2s0.cn/player/?url=", "极速高清"],
            ["https://rdfplayer.mrgaocloud.com/player/?url=", "红狐解析"],
            ["https://jx.m3u8.tv/jiexi/?url=", "M3U8"],
            ["https://www.pouyun.com/?url=", "剖云解析"],
            ["https://www.playm3u8.cn/jiexi.php?url=", "playm3u8"],
            ["https://yparse.ik9.cc/?url=", "ik9云解析"],
            ["https://xiaoapi.cn/API/jx_txsp.php?url=", "腾讯API解析"],
            ["https://xiaoapi.cn/API/jx_yk.php?url=", "优酷API解析"],
            ["https://xiaoapi.cn/API/zs_ewm.php?msg=", "网页二维码生成"],
            ["https://jx.2s0.cn/player/?url=", "播放失败请更换接口"],
            ["#", "+"],
            ["set", "• • •"]
        ])
    };

    let floatingButton, clickTimer, idleTimer;

    const createStyle = (id, content) => {
        const style = document.createElement('style');
        if (id) style.id = id;
        style.textContent = content;
        document.head.appendChild(style);
    };

    createStyle('base-style', `.floating-button{position:fixed;z-index:999999;cursor:pointer;transition:all 0.3s ease;box-shadow:0 0 ${CONFIG.glowSize}px ${CONFIG.glowSize}px ${CONFIG.breatheColors[0]}}.source-list{position:fixed;border-radius:16px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 2px 10px rgba(0,0,0,0.2);z-index:999999;padding:1px;min-width:150px;font-family:"Microsoft YaHei",sans-serif}.source-item{padding:4px 20px;border-radius:50px;cursor:pointer;white-space:nowrap;transition:all 0.2s;text-align:center}@keyframes breathe{0%{box-shadow:0 0 ${CONFIG.glowSize}px ${CONFIG.glowSize}px ${CONFIG.breatheColors[0]}}25%{box-shadow:0 0 ${CONFIG.glowSize}px ${CONFIG.glowSize}px ${CONFIG.breatheColors[1]}}50%{box-shadow:0 0 ${CONFIG.glowSize}px ${CONFIG.glowSize}px ${CONFIG.breatheColors[2]}}75%{box-shadow:0 0 ${CONFIG.glowSize}px ${CONFIG.glowSize}px ${CONFIG.breatheColors[1]}}100%{box-shadow:0 0 ${CONFIG.glowSize}px ${CONFIG.glowSize}px ${CONFIG.breatheColors[0]}}}`);

    const updateStyles = () => createStyle('dynamic-styles', `.floating-button{border-radius:${GM_getValue('buttonRadius',CONFIG.buttonRadius)}}.source-list{backdrop-filter:blur(${GM_getValue('listBlur',CONFIG.listBlur)});background:${GM_getValue('listBgColor',CONFIG.listBgColor)};color:${GM_getValue('listColor',CONFIG.listColor)};font-size:${GM_getValue('listFontSize',CONFIG.listFontSize)}}.source-item:hover{background:${GM_getValue('itemHoverBg',CONFIG.itemHoverBg)};color:#FFFFFA;font-weight:bold}.selected{color:${GM_getValue('selectedColor',CONFIG.selectedColor)}!important;font-weight:bold}`);
    updateStyles();

    const createElement = (tag, props) => {
        const el = document.createElement(tag);
        Object.entries(props).forEach(([k, v]) => el[k] = v);
        return el;
    };

    const createFloatingButton = () => {
        return createElement('img', {
            className: 'floating-button',
            src: GM_getValue('imageUrl', CONFIG.imageUrl),
            style: `right:${GM_getValue('buttonRight',CONFIG.buttonRight)};bottom:${GM_getValue('buttonBottom',CONFIG.buttonBottom)};width:${GM_getValue('buttonSize',CONFIG.buttonSize)}px;height:${GM_getValue('buttonSize',CONFIG.buttonSize)}px;opacity:${GM_getValue('opacity',CONFIG.opacity)};animation:breathe ${GM_getValue('breatheDuration',CONFIG.breatheDuration)}s infinite`
        });
    };

    const createListItem = ([url, name], isSetting) => {
        const item = createElement('div', {
            className: `source-item${url === CONFIG.parseUrl && !isSetting ? ' selected' : ''}`,
            textContent: name
        });

        if (url === 'set') {
            let clickTimer;
            // 单击设置项显示设置面板
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                showSettingsPanel();
            });

            // 双击设置项添加解析源
            item.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    const input = prompt('输入格式：名称,URL丨示例：解析1,https://jx.hls.one/?url=');
                    if (input) {
                        const [n, u] = input.split(',').map(s => s.trim());
                        if (n && u) {
                            CONFIG.parseUrls.splice(-2, 0, [u, n]);
                            GM_setValue('storedParseUrls', CONFIG.parseUrls);
                        }
                    }
                }, 200);
            });
            return item;
        }

        if (!isSetting && url !== 'help') {
            item.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                if (confirm(`确认删除 ${name} 解析源？`)) {
                    CONFIG.parseUrls = CONFIG.parseUrls.filter(v => v[0] !== url);
                    GM_setValue('storedParseUrls', CONFIG.parseUrls);
                    item.remove();
                }
            });
        }

        item.addEventListener('click', (e) => {
            if (item.dataset.func) return;
            e.stopPropagation();
            if (!isSetting) {
                document.querySelectorAll('.source-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                GM_setValue('selectedParseUrl', CONFIG.parseUrl = url);
            }
            document.getElementById('parse-source-list')?.remove();
        });

        return item;
    };

    const showSettingsPanel = () => {
        document.querySelectorAll('#parse-source-list').forEach(p => p.remove());
        const panel = createElement('div', {
            id: 'parse-source-list',
            className: 'source-list',
            style: `right:${CONFIG.buttonRight};bottom:calc(${CONFIG.buttonBottom} + ${CONFIG.buttonSize + 10}px)`
        });

        const settings = [
            ['parseList', '解析列表'],
            ['listBgColor', '背景颜色'],
            ['listBlur', '模糊强度'],
            ['listFontSize', '字体大小'],
            ['listColor', '字体颜色'],
            ['selectedColor', '选中颜色'],
            ['itemHoverBg', '悬停背景'],
            ['imageUrl', '更换图标'],
            ['buttonRadius', '图标圆角'],
            ['reset', '恢复默认']
        ];

        settings.forEach(([key, label]) => {
            const item = createListItem([key, label], true);
            item.addEventListener('click', () => {
                if (key === 'reset') {
                    if (confirm('即将清除所有配置！确认重置吗？')) {
                        GM_deleteValue('storedParseUrls');
                        GM_deleteValue('selectedParseUrl');
                        Object.keys(CONFIG).forEach(k => GM_deleteValue(k));
                        location.reload(true);
                    }
                    return;
                }

                if (key === 'parseList') {
                    showParseListPanel();
                    return;
                }

                const val = prompt(`设置${key} (当前:${GM_getValue(key, CONFIG[key])})`, GM_getValue(key, CONFIG[key]));
                if (val !== null) {
                    GM_setValue(key, val);
                    updateStyles();
                    if (key === 'imageUrl') floatingButton.src = val;
                }
                panel.remove();
            });
            panel.appendChild(item);
        });

        const closeHandler = (e) => {
            if (!panel.contains(e.target) && e.target !== floatingButton) {
                panel.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        document.addEventListener('click', closeHandler);
        document.body.appendChild(panel);
    };

    const showParseListPanel = () => {
        document.querySelectorAll('#parse-source-list').forEach(p => p.remove());

        const panel = createElement('div', {
            id: 'parse-source-list',
            className: 'source-list',
            style: `
                right: ${CONFIG.buttonRight};
                bottom: calc(${CONFIG.buttonBottom} + ${CONFIG.buttonSize + 10}px);
                max-width: 366px;
                max-height: 60vh;
                overflow-y: auto;
            `
        });

        const title = createElement('div', {
            className: 'source-item',
            textContent: '当前解析源（双击删除）',
            style: 'font-weight:bold;color: #000;'
        });
        panel.appendChild(title);

        CONFIG.parseUrls
            .filter(([url]) => url !== 'set')
            .forEach(([url, name]) => {
                const item = createElement('div', {
                    className: 'source-item',
                    textContent: `${name} : ${url}`,
                    title: '双击删除此解析源'
                });

                item.addEventListener('dblclick', () => {
                    CONFIG.parseUrls = CONFIG.parseUrls.filter(([u]) => u !== url);
                    GM_setValue('storedParseUrls', CONFIG.parseUrls);
                    item.remove();
                    showParseListPanel();
                });

                panel.appendChild(item);
            });

        const addForm = createElement('div', {
            className: 'source-item',
            style: 'display:flex;gap:5px;padding:1px 8px;'
        });

        const input = createElement('input', {
            type: 'text',
            placeholder: '格式：名称,URL',
            style: 'flex:1;text-align:center;border-radius:18px;border:none;'
        });

        const addBtn = createElement('button', {
            textContent: '＋ 添加',
            style: 'text-align:center;padding:2px 6px;border-radius:12px;background:#2196F3;color:white;border:none;',
            onclick: () => {
                const [name, url] = input.value.split(',').map(s => s.trim());
                if (name && url) {
                    CONFIG.parseUrls.unshift([url, name]);
                    GM_setValue('storedParseUrls', CONFIG.parseUrls);
                    input.value = '';
                    showParseListPanel();
                }
            }
        });

        addForm.appendChild(input);
        addForm.appendChild(addBtn);
        panel.appendChild(addForm);

        const closeHandler = (e) => {
            if (!panel.contains(e.target) && e.target !== floatingButton) {
                panel.remove();
                document.removeEventListener('click', closeHandler);
            }
        };

        document.addEventListener('click', closeHandler);
        document.body.appendChild(panel);
    };

    const initButtonEvents = () => {
        floatingButton.addEventListener('mouseenter', () => {
            floatingButton.style.opacity = '1';
            floatingButton.style.transform = 'scale(1.1)';
        });

        floatingButton.addEventListener('mouseleave', () => {
            floatingButton.style.opacity = GM_getValue('opacity', CONFIG.opacity);
            floatingButton.style.transform = 'none';
        });

        floatingButton.addEventListener('click', () => {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => window.open(GM_getValue('parseUrl', CONFIG.parseUrl) + location.href), 250);
        });

        floatingButton.addEventListener('dblclick', () => {
            clearTimeout(clickTimer);
            document.querySelectorAll('#parse-source-list').forEach(p => p.remove());

            const list = createElement('div', {
                id: 'parse-source-list',
                className: 'source-list',
                style: `
                    right: ${CONFIG.buttonRight};
                    bottom: calc(${CONFIG.buttonBottom} + ${CONFIG.buttonSize + 10}px);
                `
            });

            CONFIG.parseUrls.forEach(item => list.appendChild(createListItem(item)));

            const closeHandler = (e) => {
                if (!list.contains(e.target) && e.target !== floatingButton) {
                    list.remove();
                    document.removeEventListener('click', closeHandler);
                }
            };

            document.addEventListener('click', closeHandler);
            document.body.appendChild(list);
        });

        const initIdleMode = () => {
            const enterIdle = () => {
                floatingButton.style.opacity = '0.8';
                floatingButton.style.animationPlayState = 'paused';
            };

            const exitIdle = () => {
                floatingButton.style.opacity = GM_getValue('opacity', CONFIG.opacity);
                floatingButton.style.animationPlayState = 'running';
            };

            const resetTimer = () => {
                clearTimeout(idleTimer);
                exitIdle();
                idleTimer = setTimeout(enterIdle, 10000);
            };

            ['mouseenter', 'click', 'dblclick'].forEach(evt =>
                floatingButton.addEventListener(evt, resetTimer)
            );

            resetTimer();
        };

        initIdleMode();
    };

    const init = () => {
        floatingButton = createFloatingButton();
        document.body.appendChild(floatingButton);
        initButtonEvents();
    };

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
