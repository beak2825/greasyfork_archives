// ==UserScript==
// @name         CC chat launcher
// @namespace    http://tampermonkey.net/
// @homepage     https://gist.github.com/whh4git/b2ab24441a2329e1569e806a3aca9704
// @version      0.4
// @description  爬取CC直播的聊天内容并将其转换成弹幕
// @author       You
// @match        http://cc.163.com/*
// @match        https://cc.163.com/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD4c8MeHItUmL2ynHSWAj5098V7L4Q+FqafdadPq4Gj2c4WSG41KF4o542GQyFgAwwR0PQitL4f+EtOmhkvr+3ltzawtO1xGjI4VQWPUc8Doa+44/BfxF8UR/DWDTdJ0+6s9Ms4bS6muoQGjijhEb+W2ODuC859fpXHh6yqScqb2Pn8vxFLHSnOm2uXRrpqfEXxE+EU114N8R6z4Zgj1zTNOaOO71DTwPKty7KoBbPJJdeBnGea+WNW8Pp4fZhP81w33v8ACv1r1v4U+MvidP4otLPXofDun28d5pNzoM1xE0tzdRbJIZdqMcgFNwBwxU9BjNfm18UPhxcafeC6uLiGeWUb2jeQDYT1Uj1B4/CvpqV8dKXPNQ82/wAj23KMLRk7I674By6x8UvEy6NoluzLFC11cFrhkJRCBjcTjlivHfpX2ddfF/40fCnw7DZ6y95Z6HIgWJtY05HtWDHIH2iMKcnsPMDV4R/wTt8NrpOn+MtQl5uj9iiO0ZeKHdKXC8H5iBnp1Va/Q3S/GHjfUtEig0qxl1Dw/LG1vb3UtiC5jRAMspGCS4K/dxtzxnmvl6eHjGP7t2OjK5YbAU3CFKM4yd3ff79z42+HnjjxlpHjHUZfCFpp8HifxHKYhJpentJctuYuyIZ5ZQik5ZjgcDJOAMfG/wC0N8PvEfgTxrqVjqvzXfmG4KrKWyshLAhiBnksCfVT6V+w3hTwdrHhPxFe6ronhC10maRniE1vpcMUjx+acgEABMr5Z6AE5JHHHwb+2cBrGleFtf1C1C3dxNe2c20gk7ZAUAYAZAxJjgfePHar5ZU4uUnc9LGYmjipJUqSivvf3vp5H//Z
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453585/CC%20chat%20launcher.user.js
// @updateURL https://update.greasyfork.org/scripts/453585/CC%20chat%20launcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let LAUNCH_SPEED = GM_getValue('LAUNCH_SPEED', 10000) // 弹幕速度（通过屏幕时间）
    let TEXT_COLOR = GM_getValue('TEXT_COLOR', '#FFFFFF') // 字体颜色
    let TEXT_OPACITY = GM_getValue('TEXT_OPACITY', 0.9) // 字体不透明度
    let TEXT_SIZE = GM_getValue('TEXT_SIZE', 22) // 字体大小
    let TEXT_WEIGHT = GM_getValue('TEXT_WEIGHT', 700) // 字体加粗
    let TEXT_AREA = parseInt(GM_getValue('TEXT_AREA', 4)) // 显示区域
    let TEXT_LAYOUT = parseInt(GM_getValue('TEXT_LAYOUT', 1)) // 弹幕布局
    let TEXT_FAMILY = GM_getValue('TEXT_FAMILY', 'inherit') // 字体族,目前只能手动设置
    let MAX_TEXT_REPEAT_NUM = parseInt(GM_getValue('MAX_TEXT_REPEAT_NUM', Number.MAX_SAFE_INTEGER)) // 最大重复弹幕数

    const areaText = {
        1: '1/4屏',
        2: '1/2屏',
        3: '3/4屏',
        4: '全屏',
    }

    const layoutText = {
        1: '顶部优先',
        2: '均匀排布',
        3: '中部优先',
        4: '竖向文字',
    }

    const orbit_queue = [0]
    const text_repeat_map = {}
    let orbit_mapper = get_orbit_mapper(TEXT_LAYOUT)
    let text_screen_num = 0
    let orbit_next = 0;
    let containerHeight = 1 // 容器高度

    // 轮询等待元素出现
    function waitElement(selector, callback, timeout = 5000) {
        const POLLING_CYCLE = 500

        if (!selector || !callback) {
            return
        }
        let once = 0
        let timerId = setInterval(() => {
            once += POLLING_CYCLE;

            let target = document.querySelector(selector)
            if (target) {
                clearInterval(timerId)
                callback(target)
            }
            if (once > timeout) {
                clearInterval(timerId)
            }
        }, POLLING_CYCLE)
    }

    // 随机ID
    function randomID() {
        return 'id' + parseInt(Math.random() * Number.MAX_SAFE_INTEGER).toString();
    }

    function get_orbit_mapper(tag) {
        switch (layoutText[tag]) {
            case '均匀排布':// 均匀排布
                return function (i, orbit_num, orbit_begin) {
                    return (i + orbit_begin) % orbit_num
                }
            case '中部优先':// 中部优先
                return function (i, orbit_num) {
                    if (i % 2 == 0) {
                        return parseInt(orbit_num / 2) - parseInt(i / 2)
                    } else {
                        return parseInt(orbit_num / 2) + parseInt(i / 2) + 1
                    }
                }

            default:// 顶部优先
                return function (i) {
                    return i
                }
        }
    }

    // 计算弹道，尽量实现不覆盖
    // 长弹幕和短弹幕速度不一致，只算了结尾没算开头，还是有可能覆盖
    function orbit_calc(wrapWidth, textWidth) {
        let orbit_heigt = TEXT_SIZE * (1 + 1 / (2 + parseInt(text_screen_num / 22)))
        let orbit_num = parseInt((containerHeight / orbit_heigt) * (TEXT_AREA / 4));
        let now = new Date().getTime();
        let head_over = now + ((wrapWidth - textWidth) / wrapWidth) * LAUNCH_SPEED;
        let tail_over = now + LAUNCH_SPEED + (TEXT_SIZE * 2 * LAUNCH_SPEED / wrapWidth)

        let orbit_selected = orbit_mapper(0, orbit_next, orbit_num);
        for (let i = 0; i < orbit_num; i++) {
            let orbit_i = orbit_mapper(i, orbit_num, orbit_next)

            if (!orbit_queue[orbit_i] || orbit_queue[orbit_i] <= head_over) {
                orbit_selected = orbit_i;
                break;
            }
            if (orbit_queue[orbit_i] < orbit_queue[orbit_selected]) {
                orbit_selected = orbit_i;
            }
        }
        orbit_next = (orbit_selected + 1);
        orbit_queue[orbit_selected] = tail_over;

        return `${orbit_selected * orbit_heigt}px`
    }

    // 发射！
    function launcher(container, chat_text) {
        if ((text_repeat_map[chat_text] || 0) < MAX_TEXT_REPEAT_NUM) {
            let text = document.createElement('span');
            let wrap = document.createElement('div');

            text.innerText = chat_text

            Object.assign(text.style, {
                'margin-top': '1px',
                'white-space': 'nowrap',
                'user-select': 'none',
                'color': TEXT_COLOR,
                'opacity': TEXT_OPACITY,
                'font-size': `${TEXT_SIZE}px`,
                'font-weight': TEXT_WEIGHT,
                'font-family': TEXT_FAMILY,
                'text-shadow': '-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000',
            })

            Object.assign(wrap.style, {
                'position': 'absolute',
                'padding-left': '100%',
                'transition': `all ${(LAUNCH_SPEED / 1000)}s linear`,
            })

            wrap.append(text)
            container.append(wrap)

            Object.assign(wrap.style, {
                'top': orbit_calc(wrap.clientWidth, text.clientWidth),
                'transform': 'translateX(-100%)',
            })

            // 计数
            if (text_repeat_map[chat_text]) {
                text_repeat_map[chat_text]++
            } else {
                text_repeat_map[chat_text] = 1
            }

            text_screen_num++
            setTimeout(() => {
                container.removeChild(wrap)

                // 计数
                text_repeat_map[chat_text]--
                if (!text_repeat_map[chat_text]) {
                    delete text_repeat_map[chat_text]
                }

                text_screen_num--
            }, LAUNCH_SPEED)
        }
    }

    // 设置聊天消息加载器
    function loader(container) {
        new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type == 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        let chat_text = node.querySelector('.screen-msg-wrap li.chat_item>div>span');
                        if (chat_text) {
                            launcher(container, chat_text.innerText)
                        }
                    })
                }
            });
        }).observe(document.querySelector('.chat-list-wrap #js-chat-list-ul'), { childList: true })
    }

    // 创建弹幕容器
    function create_container() {
        let container = document.createElement('div')

        Object.assign(container.style, {
            'position': 'absolute',
            'top': '0px',
            'left': '0px',
            'width': '100%',
            'height': '100%',
        })

        waitElement("#js-chat-list-ul", () => {
            loader(container)
        }, 5000)

        return container;
    }

    // 创建弹幕控制器
    function create_controls() {
        let ids = {
            speed: { show: randomID(), value: randomID() },
            color: { show: randomID(), value: randomID() },
            opacity: { show: randomID(), value: randomID() },
            size: { show: randomID(), value: randomID() },
            weight: { show: randomID(), value: randomID() },
            area: { show: randomID(), value: randomID() },
            layout: { show: randomID(), value: randomID() },
            repeat_num: { show: randomID(), value: randomID() },
        }

        let controls = document.createElement('div');
        controls.className = 'video-player-control-item video-player-vbrs'
        Object.assign(controls.style, { display: 'block' })

        let controls_html = `
            <style type="text/css">
                div.video-player-control-item.video-player-vbrs:hover
                div.video-player-vbr-list.player-comment-panel-wrapper{display: initial;}
            </style>
            <div>
                <div class="video-player-vbr-current">弹幕设置</div>
            </div>
            <div class="video-player-vbr-list player-comment-panel-wrapper" style="width: max-content;">
                <div style="display: table;">
                    <div style="display: table-cell;">
                        <div>
                            <p>弹幕颜色&nbsp;&nbsp;<span id="${ids.color.show}">${TEXT_COLOR}</span></p>
                            <input id="${ids.color.value}" type="color" value="${TEXT_COLOR}">
                        </div>
                        <div>
                            <p>不透明度&nbsp;&nbsp;<span id="${ids.opacity.show}">${TEXT_OPACITY * 100}%</span></p>
                            <input id="${ids.opacity.value}" type="range" max="1.0" min="0.1" step="0.1" value="${TEXT_OPACITY}">
                        </div>
                        <div>
                            <p>弹幕字号&nbsp;&nbsp;<span id="${ids.size.show}">${TEXT_SIZE}</span>px</p>
                            <input id="${ids.size.value}" type="range" max="72" min="12" step="1" value="${TEXT_SIZE}">
                        </div>
                        <div>
                            <p>字体加粗&nbsp;&nbsp;<span id="${ids.weight.show}">${TEXT_WEIGHT}</span></p>
                            <input id="${ids.weight.value}" type="range" max="1000" min="100" step="100" value="${TEXT_WEIGHT}">
                        </div>
                    </div>
                    <div style="display: table-cell;width: 32px;"></div>
                    <div style="display: table-cell;">
                        <div>
                            <p>弹幕速度&nbsp;&nbsp;<span id="${ids.speed.show}">${LAUNCH_SPEED / 1000}</span>s</p>
                            <input id="${ids.speed.value}" type="range" max="20000" min="5000" step="1000" value="${LAUNCH_SPEED}">
                        </div>
                        <div>
                            <p>显示区域&nbsp;&nbsp;<span id="${ids.area.show}">${areaText[TEXT_AREA]}</span></p>
                            <input id="${ids.area.value}" type="range" max="4" min="1" step="1" value="${TEXT_AREA}">
                        </div>
                        <div>
                            <p>弹幕布局&nbsp;&nbsp;<span id="${ids.layout.show}">${layoutText[TEXT_LAYOUT]}</span></p>
                            <input id="${ids.layout.value}" type="range" max="3" min="1" step="1" value="${TEXT_LAYOUT}">
                        </div>
                        <div>
                            <p>重复弹幕数&nbsp;&nbsp;
                                <span id="${ids.repeat_num.show}">${(MAX_TEXT_REPEAT_NUM < 9) ? MAX_TEXT_REPEAT_NUM : '无限'}</span>
                            </p>
                            <input id="${ids.repeat_num.value}" type="range" max="10" min="1" step="1" value="${MAX_TEXT_REPEAT_NUM}">
                        </div>
                    </div>
                </div>
            </div>`
        controls.innerHTML = controls_html

        controls.querySelector(`#${ids.speed.value}`).addEventListener('input', (event) => {
            LAUNCH_SPEED = event.target.valueAsNumber;
            GM_setValue('LAUNCH_SPEED', LAUNCH_SPEED)

            controls.querySelector(`#${ids.speed.show}`).innerText = LAUNCH_SPEED / 1000;
        });

        controls.querySelector(`#${ids.color.value}`).addEventListener('input', (event) => {
            TEXT_COLOR = event.target.value;
            GM_setValue('TEXT_COLOR', TEXT_COLOR)

            controls.querySelector(`#${ids.color.show}`).innerText = TEXT_COLOR;
            controls.querySelector(`#${ids.color.show}`).style.color = TEXT_COLOR
        });

        controls.querySelector(`#${ids.opacity.value}`).addEventListener('input', (event) => {
            TEXT_OPACITY = event.target.valueAsNumber;
            GM_setValue('TEXT_OPACITY', TEXT_OPACITY)

            controls.querySelector(`#${ids.opacity.show}`).innerText = TEXT_OPACITY * 100 + '%';
            controls.querySelector(`#${ids.opacity.show}`).style.opacity = TEXT_OPACITY
        });

        controls.querySelector(`#${ids.size.value}`).addEventListener('input', (event) => {
            TEXT_SIZE = event.target.valueAsNumber;
            GM_setValue('TEXT_SIZE', TEXT_SIZE)

            controls.querySelector(`#${ids.size.show}`).innerText = TEXT_SIZE;
        });

        controls.querySelector(`#${ids.weight.value}`).addEventListener('input', (event) => {
            TEXT_WEIGHT = event.target.valueAsNumber;
            GM_setValue('TEXT_WEIGHT', TEXT_WEIGHT)

            controls.querySelector(`#${ids.weight.show}`).innerText = TEXT_WEIGHT;
        });

        controls.querySelector(`#${ids.area.value}`).addEventListener('input', (event) => {
            TEXT_AREA = parseInt(event.target.value);
            GM_setValue('TEXT_AREA', TEXT_AREA)

            controls.querySelector(`#${ids.area.show}`).innerText = areaText[TEXT_AREA];
        });

        controls.querySelector(`#${ids.layout.value}`).addEventListener('input', (event) => {
            TEXT_LAYOUT = parseInt(event.target.value);
            GM_setValue('TEXT_LAYOUT', TEXT_LAYOUT)
            orbit_mapper = get_orbit_mapper(TEXT_LAYOUT)
            controls.querySelector(`#${ids.layout.show}`).innerText = layoutText[TEXT_LAYOUT];
        });

        controls.querySelector(`#${ids.repeat_num.value}`).addEventListener('input', (event) => {
            let value = parseInt(event.target.value);
            MAX_TEXT_REPEAT_NUM = (value < 10) ? value : Number.MAX_SAFE_INTEGER;
            GM_setValue('MAX_TEXT_REPEAT_NUM', MAX_TEXT_REPEAT_NUM)

            controls.querySelector(`#${ids.repeat_num.show}`).innerText = (value < 10) ? value : '无限';
        });

        return controls;
    }

    // 等待播放器加载
    waitElement(".cc-h5player-container", (playerContainer) => {
        let container = create_container()
        playerContainer.append(container)

        containerHeight = container.clientHeight;

        // 监听窗口大小变化
        new MutationObserver((mutationList) => {
            containerHeight = container.clientHeight;
            console.log(containerHeight)
        }).observe(document.querySelector('div.comment-canvas'), { attributes: true, attributeFilter: ['class', 'style'] })
    }, 5000)

    // 等待控制器加载
    waitElement("div.video-player-controls-main", (controls) => {
        controls.append(create_controls())
    }, 5000)

    // 去广告
    let ad_list = [
        '.video-watermark', '#pic-in-pic-btn > img', '#pic-in-pic-btn > span',
        '#float-plugin-container-43751-4', '#live_left_bottom_box_wrap',
        '#gift-bubbles', '#gift-banner', '.gift-banner', '.gift-simp-banner',
        '#player-banner', '#new-player-banner',
        '#mounts_mp4_player', '#mounts_player', '#mounts_banner', '#mounts_player_png'
    ]
    let ad_style = document.createElement('style')
    ad_style.setAttribute('type', 'text/css')
    ad_style.innerText = `${ad_list.join(',')}{display:none!important;}`.replace("\n", '')
    document.body.append(ad_style)

})();