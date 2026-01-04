// ==UserScript==
// @name         百度翻译生成多种翻译格式
// @namespace    npm/vite-plugin-monkey
// @version      1.2.0
// @author       何明暄
// @description  在百度翻译的界面会出现三种格式的英文翻译的结果供你选择,方便程序员命名(小驼峰、class类名)
// @icon         https://fanyi.baidu.com/favicon.ico
// @match        https://fanyi.baidu.com/
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.prod.js
// @downloadURL https://update.greasyfork.org/scripts/460003/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%94%9F%E6%88%90%E5%A4%9A%E7%A7%8D%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460003/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%94%9F%E6%88%90%E5%A4%9A%E7%A7%8D%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

;((t) => {
    const e = document.createElement('style')
    ;(e.dataset.source = 'vite-plugin-monkey'), (e.innerText = t), document.head.appendChild(e)
})(
    '.translation-format-box[data-v-546ab7ac]{width:1200px;margin:20px auto auto;z-index:99;box-sizing:border-box;border:2px solid transparent;border-radius:16px;background-clip:padding-box,border-box;background-origin:padding-box,border-box;background-image:linear-gradient(0deg,rgba(225,235,255,.3),rgba(225,235,255,.3)),linear-gradient(113.58deg,#fff 16.99%,#e6eeff 94.11%)}.translation-format-content-bg[data-v-546ab7ac]{width:100%;min-height:180px;border-radius:14px;background:linear-gradient(0deg,#f4f7ff,#f4f7ff),linear-gradient(94.84deg,#fff 3.78%,#fcfdff 9.75%,#e6eeff 102.09%),linear-gradient(126.58deg,#fff -18.12%,hsla(0,0%,100%,0) 26.77%);display:flex;position:relative}.translation-format-content[data-v-546ab7ac]{padding:20px;width:33.33%;overflow-wrap:anywhere;box-sizing:border-box;font-size:24px;border:none;outline:none;resize:none;background:transparent;cursor:pointer;position:relative}.copy-prompt-box[data-v-546ab7ac]{width:80px;padding:10px 20px;font-size:14px;box-shadow:0 2px 12px #0000001a;border-radius:4px;border:1px solid #ebeef5;background-color:#fff;position:absolute;top:-30px;left:50%;user-select:none;transform:translate(-50%);transition:.3s;opacity:0;text-align:center}.copy-prompt-box-show[data-v-546ab7ac]{opacity:1}.line[data-v-546ab7ac]{height:auto;margin-top:20px;margin-bottom:20px;border-right-width:1px;border-right-style:dashed;border-color:#c8c9cc}.author-information[data-v-546ab7ac]{font-size:22px;font-weight:600;color:#e4e4e4;position:absolute;right:10px;bottom:10px;user-select:none}.click-copy[data-v-546ab7ac]{font-size:12px;color:#000;position:absolute;left:50%;transform:translate(-50%);bottom:-30px;user-select:none}html[data-v-52d3de27]{box-sizing:border-box;font-size:62.5%;overflow-y:scroll;@media screen and (min-width: 900px){font-size:75%}}.mask[data-v-52d3de27]{width:100%;height:65vh;background:#edf1f9;position:absolute;z-index:9;left:0;top:306px;background-color:#ffffffb3;backdrop-filter:blur(10px)}.show-hide-switch[data-v-52d3de27]{background-color:#f9f9f9;position:absolute;top:600px;left:50%;transform:translate(-50%);z-index:99;border-radius:3rem;box-shadow:.8rem .8rem 1.4rem #c8d0e7,-.2rem -.2rem 1.8rem #f9f9f9;box-sizing:inherit;user-select:none}.show-hide-switch svg[data-v-52d3de27]{width:30px;height:30px;position:absolute;bottom:-40px;left:50%;transform:translate(-50%)}.show-hide-switch .icondowm[data-v-52d3de27]{bottom:-42px}.switch__1[data-v-52d3de27]{width:6rem}.switch__1 label[data-v-52d3de27]{display:flex;align-items:center;width:100%;height:3rem;box-shadow:.3rem .3rem .6rem #c8d0e7,-.2rem -.2rem .5rem #fff;background:rgba(255,255,255,0);position:relative;cursor:pointer;border-radius:1.6rem}.switch__1 label[data-v-52d3de27]:after{content:"";position:absolute;left:.4rem;width:2.1rem;height:2.1rem;border-radius:50%;background:#9baacf;transition:all .4s ease}.switch__1 .open-switch[data-v-52d3de27]:after{left:57%;background:#e4ebf5}.switch__1 label[data-v-52d3de27]:before{content:"";width:100%;height:100%;border-radius:inherit;background:linear-gradient(330deg,#5b0eeb 0%,#6d5dfc 50%,#8abdff 100%);opacity:0;transition:all .4s ease}.switch__1 .open-switch[data-v-52d3de27]:before{opacity:1}'
)

;(function (vue) {
    'use strict'
    const style = ''
    const translationFormat_vue_vue_type_style_index_0_scoped_546ab7ac_lang = ''
    const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc
        for (const [key, val] of props) {
            target[key] = val
        }
        return target
    }
    const _withScopeId$1 = (n) => (
        vue.pushScopeId('data-v-546ab7ac'), (n = n()), vue.popScopeId(), n
    )
    const _hoisted_1$1 = { class: 'translation-format-box' }
    const _hoisted_2$1 = { class: 'translation-format-content-bg' }
    const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() =>
        /* @__PURE__ */ vue.createElementVNode('div', { class: 'line' }, null, -1)
    )
    const _hoisted_4$1 = /* @__PURE__ */ _withScopeId$1(() =>
        /* @__PURE__ */ vue.createElementVNode('div', { class: 'line' }, null, -1)
    )
    const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$1(() =>
        /* @__PURE__ */ vue.createElementVNode(
            'div',
            { class: 'author-information' },
            'by: hemingxuan',
            -1
        )
    )
    const _hoisted_6$1 = /* @__PURE__ */ _withScopeId$1(() =>
        /* @__PURE__ */ vue.createElementVNode('div', { class: 'click-copy' }, '点击即可复制', -1)
    )
    const _sfc_main$1 = {
        __name: 'translation-format',
        setup(__props) {
            const state = vue.reactive({
                lowercaseLetter: '',
                // 小驼峰
                strikethrough: '',
                // 中划线分割
                capital: '',
                timeer: null,
                copyPromptBoxShow: 0
            })
            const addEventListenerInput = () => {
                if (state.timeer) {
                    state.timeer = null
                    clearTimeout(state.timeer)
                }
                state.timeer = setTimeout(() => {
                    var _a, _b, _c
                    let innerHTML =
                        ((_a = document.querySelector('.ordinary-output.target-output span')) ==
                        null
                            ? void 0
                            : _a.innerHTML) ||
                        ((_b = document.querySelector('.ordinary-output.target-output')) == null
                            ? void 0
                            : _b.innerHTML) ||
                        ((_c = document.querySelector('.target-output')) == null
                            ? void 0
                            : _c.innerHTML)
                    innerHTML = innerHTML.trim()
                    if (innerHTML) {
                        state.lowercaseLetter = convertStringToCamelCase(innerHTML)
                        state.strikethrough = convertStringToStrikethrough(innerHTML)
                        state.capital = convertStringToUpperCase(innerHTML)
                    }
                }, 1200)
            }
            addEventListenerInput()
            function convertStringToCamelCase(sentence) {
                return sentence.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (camelCaseMatch, i) {
                    if (+camelCaseMatch === 0) return ''
                    return i === 0 ? camelCaseMatch.toLowerCase() : camelCaseMatch.toUpperCase()
                })
            }
            function convertStringToStrikethrough(sentence) {
                return sentence.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')
            }
            function convertStringToUpperCase(sentence) {
                return sentence.toUpperCase().replace(/\s+/g, '_').replace(/,/g, '')
            }
            let timers = null
            const selectCopy = async (select, index) => {
                if (select == '') return
                await navigator.clipboard.writeText(select)
                state.copyPromptBoxShow = index
                clearTimeout(timers)
                timers = null
                timers = setTimeout(() => {
                    state.copyPromptBoxShow = 0
                }, 1500)
            }
            let translateHTML = document.querySelector('#baidu_translate_input')
            translateHTML.addEventListener('input', addEventListenerInput)
            setInterval(() => {
                addEventListenerInput()
            }, 2e3)
            return (_ctx, _cache) => {
                return (
                    vue.openBlock(),
                    vue.createElementBlock('div', _hoisted_1$1, [
                        vue.createElementVNode('div', _hoisted_2$1, [
                            vue.createElementVNode(
                                'div',
                                {
                                    class: 'translation-format-content',
                                    onClick:
                                        _cache[0] ||
                                        (_cache[0] = ($event) =>
                                            selectCopy(state.lowercaseLetter, 1))
                                },
                                [
                                    vue.createTextVNode(
                                        vue.toDisplayString(state.lowercaseLetter) + ' ',
                                        1
                                    ),
                                    vue.createElementVNode(
                                        'div',
                                        {
                                            class: vue.normalizeClass([
                                                'copy-prompt-box',
                                                {
                                                    'copy-prompt-box-show':
                                                        state.copyPromptBoxShow == 1
                                                }
                                            ])
                                        },
                                        ' 复制成功 ',
                                        2
                                    )
                                ]
                            ),
                            _hoisted_3$1,
                            vue.createElementVNode(
                                'div',
                                {
                                    class: 'translation-format-content',
                                    onClick:
                                        _cache[1] ||
                                        (_cache[1] = ($event) => selectCopy(state.strikethrough, 2))
                                },
                                [
                                    vue.createTextVNode(
                                        vue.toDisplayString(state.strikethrough) + ' ',
                                        1
                                    ),
                                    vue.createElementVNode(
                                        'div',
                                        {
                                            class: vue.normalizeClass([
                                                'copy-prompt-box',
                                                {
                                                    'copy-prompt-box-show':
                                                        state.copyPromptBoxShow == 2
                                                }
                                            ])
                                        },
                                        ' 复制成功 ',
                                        2
                                    )
                                ]
                            ),
                            _hoisted_4$1,
                            vue.createElementVNode(
                                'div',
                                {
                                    class: 'translation-format-content',
                                    onClick:
                                        _cache[2] ||
                                        (_cache[2] = ($event) => selectCopy(state.capital, 3))
                                },
                                [
                                    vue.createTextVNode(
                                        vue.toDisplayString(state.capital) + ' ',
                                        1
                                    ),
                                    vue.createElementVNode(
                                        'div',
                                        {
                                            class: vue.normalizeClass([
                                                'copy-prompt-box',
                                                {
                                                    'copy-prompt-box-show':
                                                        state.copyPromptBoxShow == 3
                                                }
                                            ])
                                        },
                                        ' 复制成功 ',
                                        2
                                    )
                                ]
                            ),
                            _hoisted_5$1,
                            _hoisted_6$1
                        ])
                    ])
                )
            }
        }
    }
    const TranslationFormat = /* @__PURE__ */ _export_sfc(_sfc_main$1, [
        ['__scopeId', 'data-v-546ab7ac']
    ])
    const App_vue_vue_type_style_index_0_scoped_52d3de27_lang = ''
    const _withScopeId = (n) => (vue.pushScopeId('data-v-52d3de27'), (n = n()), vue.popScopeId(), n)
    const _hoisted_1 = {
        key: 0,
        class: 'mask'
    }
    const _hoisted_2 = {
        key: 0,
        t: '1675332946531',
        class: 'icon icondowm',
        viewBox: '0 0 1024 1024',
        version: '1.1',
        xmlns: 'http://www.w3.org/2000/svg',
        'p-id': '3976',
        width: '200',
        height: '200'
    }
    const _hoisted_3 = /* @__PURE__ */ _withScopeId(() =>
        /* @__PURE__ */ vue.createElementVNode(
            'path',
            {
                d: 'M1018.737778 480.711111s-4.266667-12.8-8.533334-17.066667l-21.333333-42.666666c-21.333333-34.133333-51.2-76.8-93.866667-123.733334C813.937778 207.644444 685.937778 113.777778 511.004444 113.777778s-302.933333 93.866667-384 183.466666c-42.666667 46.933333-72.533333 89.6-93.866666 123.733334-8.533333 17.066667-17.066667 29.866667-21.333334 42.666666-4.266667 4.266667-8.533333 17.066667-8.533333 17.066667-4.266667 12.8-4.266667 25.6 0 34.133333 0 0 4.266667 12.8 8.533333 17.066667l21.333334 42.666667c21.333333 34.133333 51.2 76.8 93.866666 123.733333 81.066667 89.6 209.066667 183.466667 384 183.466667s302.933333-93.866667 384-183.466667c42.666667-46.933333 72.533333-89.6 93.866667-123.733333 8.533333-17.066667 17.066667-29.866667 21.333333-42.666667 4.266667-4.266667 8.533333-17.066667 8.533334-17.066667 4.266667-12.8 4.266667-21.333333 0-34.133333z m-102.4 46.933333c-17.066667 29.866667-46.933333 72.533333-81.066667 110.933334-76.8 81.066667-183.466667 157.866667-324.266667 157.866666s-247.466667-76.8-324.266666-157.866666c-38.4-38.4-64-81.066667-81.066667-110.933334-8.533333-12.8-12.8-21.333333-17.066667-29.866666 4.266667-8.533333 8.533333-17.066667 17.066667-29.866667 21.333333-29.866667 46.933333-72.533333 81.066667-110.933333C263.537778 275.911111 370.204444 199.111111 511.004444 199.111111s247.466667 76.8 324.266667 157.866667c38.4 38.4 64 81.066667 81.066667 110.933333 8.533333 12.8 12.8 21.333333 17.066666 29.866667-4.266667 8.533333-12.8 17.066667-17.066666 29.866666z',
                fill: '#707070',
                'p-id': '3977'
            },
            null,
            -1
        )
    )
    const _hoisted_4 = /* @__PURE__ */ _withScopeId(() =>
        /* @__PURE__ */ vue.createElementVNode(
            'path',
            {
                d: 'M511.004444 344.177778c-76.8 0-145.066667 68.266667-145.066666 153.6 0 85.333333 68.266667 153.6 145.066666 153.6 76.8 0 145.066667-68.266667 145.066667-153.6 0-85.333333-68.266667-153.6-145.066667-153.6z m-230.4 153.6c0-128 102.4-238.933333 230.4-238.933334s230.4 110.933333 230.4 238.933334-102.4 238.933333-230.4 238.933333-230.4-110.933333-230.4-238.933333z',
                fill: '#707070',
                'p-id': '3978'
            },
            null,
            -1
        )
    )
    const _hoisted_5 = [_hoisted_3, _hoisted_4]
    const _hoisted_6 = {
        key: 1,
        t: '1675390937990',
        class: 'icon',
        viewBox: '0 0 1024 1024',
        version: '1.1',
        xmlns: 'http://www.w3.org/2000/svg',
        'p-id': '4756',
        width: '200',
        height: '200'
    }
    const _hoisted_7 = /* @__PURE__ */ _withScopeId(() =>
        /* @__PURE__ */ vue.createElementVNode(
            'path',
            {
                d: 'M512 266.723556c-19.996444 0-39.196444 1.422222-57.628444 4.124444-23.324444 3.356444-45.056-12.088889-48.554667-34.531556-3.527111-22.442667 12.515556-43.377778 35.84-46.734222 22.613333-3.299556 46.08-5.034667 70.343111-5.034666 175.388444 0 303.36 91.022222 385.308444 177.777777a761.059556 761.059556 0 0 1 114.858667 159.175111c2.56 4.864 5.063111 9.756444 7.480889 14.705778l0.426667 0.938667 0.170666 0.341333v0.085334l0.028445 0.028444-38.968889 16.725333 39.025778 16.725334-0.085334 0.113777-0.085333 0.227556-0.341333 0.739556a624.355556 624.355556 0 0 1-22.613334 41.642666 770.389333 770.389333 0 0 1-67.84 96.227556 43.804444 43.804444 0 0 1-59.591111 6.144 40.078222 40.078222 0 0 1-7.196444-57.287111 686.478222 686.478222 0 0 0 71.168-104.533334 678.968889 678.968889 0 0 0-99.555556-136.675555C760.945778 340.053333 654.165333 266.723556 512 266.723556z m469.333333 287.601777l38.968889 16.725334a39.822222 39.822222 0 0 0 0-33.450667l-38.968889 16.725333zM186.965333 359.594667c8.391111 7.338667 13.368889 17.578667 13.909334 28.444444 0.512 10.894222-3.470222 21.532444-11.093334 29.582222a679.168 679.168 0 0 0-99.555555 136.704 679.367111 679.367111 0 0 0 99.555555 136.704C263.111111 768.568889 369.834667 841.927111 512 841.927111a394.808889 394.808889 0 0 0 134.4-23.239111c21.902222-7.395556 45.909333 3.470222 54.044444 24.405333 8.106667 20.935111-2.616889 44.259556-24.177777 52.536889A483.185778 483.185778 0 0 1 512 924.103111c-175.388444 0-303.36-91.022222-385.308444-177.777778a760.917333 760.917333 0 0 1-114.858667-159.175111c-2.56-4.835556-5.063111-9.756444-7.480889-14.705778l-0.426667-0.938666-0.170666-0.341334-0.028445-0.056888v-0.056889l38.968889-16.725334L3.640889 537.6l0.056889-0.028444 0.028444-0.085334 0.142222-0.341333 0.426667-0.938667 1.621333-3.185778c8.817778-17.464889 18.488889-34.531556 28.842667-51.171555a763.505778 763.505778 0 0 1 91.875556-119.523556 43.349333 43.349333 0 0 1 29.582222-13.368889c11.292444-0.540444 22.357333 3.299556 30.72 10.638223zM42.666667 554.325333L3.697778 537.6a39.822222 39.822222 0 0 0 0 33.450667l38.968889-16.725334z',
                fill: '#707070',
                'p-id': '4757'
            },
            null,
            -1
        )
    )
    const _hoisted_8 = /* @__PURE__ */ _withScopeId(() =>
        /* @__PURE__ */ vue.createElementVNode(
            'path',
            {
                d: 'M469.816889 364.544c0-22.784 19.000889-41.272889 42.439111-41.272889 128.113778 0 229.233778 104.391111 229.233778 229.916445 0 14.734222-8.106667 28.359111-21.219556 35.754666a43.52 43.52 0 0 1-42.467555 0 41.073778 41.073778 0 0 1-21.219556-35.754666c0-82.915556-66.133333-147.370667-144.327111-147.370667-23.438222 0-42.439111-18.488889-42.439111-41.272889z m-130.929778 107.008c22.926222 4.807111 37.489778 26.737778 32.568889 49.038222a151.04 151.04 0 0 0-3.527111 32.597334c0 82.915556 66.133333 147.370667 144.327111 147.370666 11.207111 0 22.072889-1.28 32.483556-3.697778 22.755556-5.376 45.710222 8.248889 51.2 30.407112 5.546667 22.158222-8.476444 44.458667-31.260445 49.806222a229.063111 229.063111 0 0 1-52.423111 5.973333c-128.113778 0-229.233778-104.391111-229.233778-229.916444 0-17.066667 1.877333-33.848889 5.432889-49.92 2.360889-10.695111 9.016889-20.053333 18.488889-25.998223 9.443556-5.973333 20.935111-7.992889 31.943111-5.688888v0.028444zM100.209778 111.303111a43.320889 43.320889 0 0 1 60.017778 0L924.302222 854.186667c16.099556 16.213333 15.872 41.955556-0.512 57.856a43.320889 43.320889 0 0 1-59.505778 0.512L100.209778 169.671111a40.476444 40.476444 0 0 1 0-58.368z',
                fill: '#707070',
                'p-id': '4758'
            },
            null,
            -1
        )
    )
    const _hoisted_9 = [_hoisted_7, _hoisted_8]
    const _hoisted_10 = { class: 'switch__1' }
    const _sfc_main = {
        __name: 'App',
        setup(__props) {
            const showHideSwitch = vue.ref(true)
            return (_ctx, _cache) => {
                return (
                    vue.openBlock(),
                    vue.createElementBlock(
                        vue.Fragment,
                        null,
                        [
                            showHideSwitch.value
                                ? (vue.openBlock(),
                                  vue.createElementBlock('div', _hoisted_1, [
                                      showHideSwitch.value
                                          ? (vue.openBlock(),
                                            vue.createBlock(TranslationFormat, { key: 0 }))
                                          : vue.createCommentVNode('', true)
                                  ]))
                                : vue.createCommentVNode('', true),
                            vue.createElementVNode(
                                'div',
                                {
                                    class: 'show-hide-switch click-copy',
                                    onClick:
                                        _cache[0] ||
                                        (_cache[0] = ($event) =>
                                            (showHideSwitch.value = !showHideSwitch.value))
                                },
                                [
                                    showHideSwitch.value
                                        ? (vue.openBlock(),
                                          vue.createElementBlock('svg', _hoisted_2, _hoisted_5))
                                        : (vue.openBlock(),
                                          vue.createElementBlock('svg', _hoisted_6, _hoisted_9)),
                                    vue.createElementVNode('div', _hoisted_10, [
                                        vue.createElementVNode(
                                            'label',
                                            {
                                                for: 'switch-1',
                                                class: vue.normalizeClass({
                                                    'open-switch': showHideSwitch.value
                                                })
                                            },
                                            null,
                                            2
                                        )
                                    ])
                                ]
                            )
                        ],
                        64
                    )
                )
            }
        }
    }
    const App = /* @__PURE__ */ _export_sfc(_sfc_main, [['__scopeId', 'data-v-52d3de27']])
    vue.createApp(App).mount(
        (() => {
            const app = document.createElement('div')
            document.body.append(app)
            return app
        })()
    )
})(Vue)
