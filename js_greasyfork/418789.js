// ==UserScript==
// @name         【tapd】一键查询所有项目中的wiki
// @namespace    https://github.com/kiccer/tapd-search-wiki
// @version      3.7.2
// @description  为了方便在tapd的wiki中查找接口而开发
// @author       kiccer<1072907338@qq.com>
// @copyright    2020, kiccer (https://github.com/kiccer)
// @license      MIT
// @iconURL      https://www.google.com/s2/favicons?domain=www.tapd.cn
// @include      /^https:\/\/www\.tapd\.cn\/\d+\/markdown_wikis\/(show\/|search\?.*)$/
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.0/axios.js
// @require      https://cdn.bootcdn.net/ajax/libs/tween.js/18.6.4/tween.umd.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Sortable/1.9.0/Sortable.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @noframes     这个千万别删掉！会出现死循环的！
// @nocompat     Chrome
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418789/%E3%80%90tapd%E3%80%91%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E6%89%80%E6%9C%89%E9%A1%B9%E7%9B%AE%E4%B8%AD%E7%9A%84wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/418789/%E3%80%90tapd%E3%80%91%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E6%89%80%E6%9C%89%E9%A1%B9%E7%9B%AE%E4%B8%AD%E7%9A%84wiki.meta.js
// ==/UserScript==

/* global Vue axios TWEEN takePartInWorkspaces $ Sortable ClipboardJS */
// https://www.tampermonkey.net/documentation.php
// https://element.eleme.cn/#/zh-CN/component/button

(() => {
    'use strict'

    // 当前是否是 show 页面
    const IN_SHOW_PAGE = /^https:\/\/www\.tapd\.cn\/\d+\/markdown_wikis\/show\/.*$/.test(location.href)
    // 当前是否是 search 页面
    const IN_SEARCH_PAGE = /^https:\/\/www\.tapd\.cn\/\d+\/markdown_wikis\/search\?.*$/.test(location.href)
    // 当前项目id
    const CURR_PROJECT_ID = location.href.match(/(?<=https:\/\/www.tapd.cn\/)\d+(?=\/markdown_wikis\/)/g)[0] || ''
    // 随机字符串
    const GM_ADD_STYLE_HASH = `GM_addStyle_${parseInt(Math.random() * Date.now())}`
    // 从 session 中获取缓存的搜索词
    const SEARCH_WORD = sessionStorage.getItem('tapd-search-wiki/search_word') || ''
    // 页面 query 参数
    const URL_QUERY = (() => {
        const queryStr = location.href.split('?')[1]
        if (queryStr) {
            const res = {}
            queryStr.split('&').forEach(n => {
                const [key, val] = n.split('=')
                res[key] = val
            })
            return res
        } else {
            return {}
        }
    })()

    // GM_addStyle 方法
    function GM_addStyle (css, dom = document.head, id = GM_ADD_STYLE_HASH) {
        const style = document.getElementById(id) || (() => {
            const style = document.createElement('style')
            style.type = 'text/css'
            style.id = id
            dom.appendChild(style)
            return style
        })()
        const sheet = style.sheet
        // sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length)
        css.split('\n\n').forEach(n => sheet.insertRule(n, (sheet.rules || sheet.cssRules || []).length))
    }

    // 自写 Promise.all 方法
    function PromiseAll (arr = []) {
        return new Promise((resolve, reject) => {
            const resVal = Array(arr.length).fill()

            arr.forEach((func, index) => {
                func().then(res => {
                    resVal[index] = res
                    if (resVal.every(n => n)) resolve(resVal)
                }).catch(err => {
                    reject(err)
                })
            })
        })
    }

    // 加载 element-ui script
    function elementScript () {
        return new Promise((resolve, reject) => {
            const vueListener = setInterval(() => {
                // 注册全局 Vue
                window.Vue || (window.Vue = Vue)
                if (window.Vue) {
                    clearInterval(vueListener)
                    const elScript = document.createElement('script')
                    elScript.setAttribute('src', 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.14.1/index.min.js')
                    document.head.appendChild(elScript)
                    elScript.addEventListener('load', resolve)
                    elScript.addEventListener('error', reject)
                }
            }, 100)
        })
    }

    // 加载 element-ui css
    function elementStyle () {
        return new Promise((resolve, reject) => {
            const elStyle = document.createElement('link')
            elStyle.setAttribute('href', 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.14.1/theme-chalk/index.min.css')
            elStyle.setAttribute('rel', 'stylesheet')
            document.head.appendChild(elStyle)
            elStyle.addEventListener('load', resolve)
            elStyle.addEventListener('error', reject)
        })
    }

    // 等待所有依赖项加载完毕后再执行
    PromiseAll([
        elementScript,
        elementStyle
    ]).then(() => {
        init()
    }).catch(err => {
        console.log(222, err)
    })

    // vue 组件 (搜索框)
    Vue.component('search-input', {
        name: 'search-input',

        template: `
            <div>
                <el-input
                    placeholder="在你所有项目的wiki中搜索..."
                    size="medium"
                    v-model="keyword"
                    @keydown.enter.native="search"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        :loading="loading"
                        @click="search"
                    />
                </el-input>
            </div>
        `,

        props: {
            enter: Function,
            loading: Boolean
        },

        data () {
            return {
                keyword: ''
            }
        },

        created () {
            if (IN_SEARCH_PAGE) {
                this.keyword = SEARCH_WORD || decodeURIComponent(URL_QUERY.search) || ''
            }
        },

        methods: {
            search () {
                if (this.loading) return

                // 去除前后空格
                this.keyword = this.keyword.replace(/^\s+|\s+$/g, '')

                // 保存搜索词
                sessionStorage.setItem('tapd-search-wiki/search_word', this.keyword)

                // 如果绑定了 enter 方法，那就支持无刷新更新数据
                if (this.enter) {
                    this.enter(this.keyword)
                } else {
                    location.href = `https://www.tapd.cn/${CURR_PROJECT_ID}/markdown_wikis/search?search=${encodeURIComponent(this.keyword.replace(/\*/g, ' '))}`
                }
            }
        }
    })

    // 初始化
    function init () {
        // 添加 vue 容器
        const headerBar = document.getElementById('hd')
        const app = document.createElement('div')
        const mainSearchArea = document.querySelector('.main-search-area')
        headerBar.appendChild(app)
        mainSearchArea && headerBar.removeChild(mainSearchArea)

        new Vue({
            el: app,

            name: 'kiccer-tampermonkey-tapd-wiki-search',

            template: `
                <div class="kiccer-tampermonkey-tapd-wiki-search">
                    <search-input />
                </div>
            `
        })

        // 如果是 search 页面则添加搜索结果列表容器
        if (IN_SEARCH_PAGE) {
            const searchResultContainer = document.querySelector('.search-result')

            new Vue({
                el: searchResultContainer,

                name: 'kiccer-tampermonkey-tapd-wiki-result',

                template: `
                    <div class="search-result">
                        <!-- 左侧搜索结果列表 -->
                        <div class="wiki-list">
                            <search-input
                                :loading="!allLoaded"
                                :enter="onSearchInputEnter"
                            />

                            <el-alert
                                title="支持匹配符号：* (任意个数任意字符)"
                                type="info"
                            />

                            <iframe
                                class="hide-iframe"
                                v-for="(n, i) in projects"
                                :key="n.id"
                                :src="iframeSrc(n)"
                                @load="e => iframeLoaded(e, i)"
                            />

                            <el-tabs
                                type="card"
                                v-model="activeTab"
                                v-if="projectsInTab.length"
                            >
                                <el-tab-pane
                                    v-for="(n, i) in projectsInTab"
                                    :key="n.id"
                                    :label="n.project_name"
                                    :name="n.pretty_name"
                                >
                                    <div
                                        class="tab-label"
                                        slot="label"
                                        v-html="tabLabelHtml(n.index)"
                                    />

                                    <transition name="fade">
                                        <div v-if="n.pretty_name === activeTab">
                                            <!-- <div v-html="wikiHTMLList[n.index]" /> -->
                                            <component
                                                :is="wikiHtmlComp(wikiHTMLList[n.index])"
                                                @open-preview="openPreview"
                                            />

                                            <el-pagination
                                                layout="prev, pager, next"
                                                :current-page.sync="n.pageInfo.current"
                                                :page-count="n.pageInfo.total"
                                                v-if="n.pageInfo.total > 1"
                                            />
                                        </div>
                                    </transition>
                                </el-tab-pane>
                            </el-tabs>

                            <div v-else>{{ allLoaded ? '啥也没找到' : '正在搜索中' }}...</div>

                            <transition name="fade">
                                <div
                                    class="back-top"
                                    v-show="toggle.showBackTop"
                                    @click="backTop"
                                >
                                    <i class="el-icon-arrow-up" />
                                </div>
                            </transition>
                        </div>
                        
                        <!-- 右侧预览页面 -->
                        <div
                            class="wiki-preview"
                            v-show="previewFrames.length"
                        >
                            <el-tabs
                                editable
                                type="card"
                                v-sortable="{
                                    list: previewFrames,
                                    container: '.el-tabs__nav',
                                    draggable: '.el-tabs__item'
                                }"
                                v-model="activePreviewTab"
                                @tab-remove="removeWikiPreviewIframe"
                                @tab-add="addWikiPreviewIframe"
                            >
                                <el-tab-pane
                                    v-loading="n.loading"
                                    v-for="(n, i) in previewFrames"
                                    :key="n.url"
                                    :name="n.url"
                                >
                                    <el-tooltip
                                        slot="label"
                                        effect="light"
                                        placement="bottom"
                                        :open-delay="500"
                                    >
                                        <div slot="content" style="line-height: 1.5;">
                                            <h3>{{ n.name }}</h3>
                                            <p><a :href="n.url" target="_blank">{{ n.url }}</a></p>
                                            <template v-if="n.keywordList && n.keywordList.length > 1">
                                                <p>关键词：(点击关键词触发滚动预测)</p>
                                                <p
                                                    v-for="keyword in n.keywordList"
                                                    :key="keyword"
                                                >
                                                    <el-button
                                                        type="text"
                                                        icon="el-icon-close"
                                                        style="padding: 0px; margin-right: 10px;"
                                                        @click="removeKeywordItem(n, keyword)"
                                                    />

                                                    <a
                                                        :class="{
                                                            red: keyword === n.wd
                                                        }"
                                                        @click="scrollForecastItem(n, keyword)"
                                                    >{{ keyword }}</a>
                                                </p>
                                            </template>
                                            <p>(注：双击标题可以激活滚动预测功能)</p>
                                        </div>

                                        <span
                                            class="ellipsis"
                                            @dblclick="scrollForecast(n)"
                                        >{{ n.name || n.url }}</span>
                                    </el-tooltip>

                                    <transition name="fade">
                                        <iframe
                                            class="wiki-preview-iframe"
                                            v-show="n.url === activePreviewTab"
                                            :src="n.url"
                                            @load="e => previewIframeLoaded(e, n)"
                                        />
                                    </transition>
                                </el-tab-pane>
                            </el-tabs>
                        </div>

                        <!-- 增加预览页面弹窗 -->
                        <el-dialog
                            title="增加预览页面"
                            width="30%"
                            :visible.sync="toggle.addPreviewPopup"
                            @closed="addPreviewPopupClosed"
                        >
                            <el-input
                                autosize
                                type="textarea"
                                placeholder="请输入网址"
                                v-model="addPreviewPopupData.url"
                                @keydown.enter.native="addPreviewFrame"
                            />

                            <span slot="footer" class="dialog-footer">
                                <el-button
                                    @click="toggle.addPreviewPopup = false"
                                >取 消</el-button>

                                <el-button
                                    type="primary"
                                    @click="addPreviewFrame"
                                >确 定</el-button>
                            </span>
                        </el-dialog>
                    </div>
                `,

                data () {
                    return {
                        toggle: {
                            showBackTop: window.scrollY >= 200,
                            addPreviewPopup: false
                        },
                        projects: [],
                        wd: '',
                        wikiHTMLList: [],
                        loaded: [],
                        scroll: { x: 0, y: 0 },
                        activeTab: '',
                        previewFrames: [],
                        activePreviewTab: sessionStorage.getItem('tapd-search-wiki/active_preview_tab') || '',
                        addPreviewPopupData: {
                            url: ''
                        }
                    }
                },

                computed: {
                    allLoaded () {
                        return !(this.loaded || []).includes(false)
                    },

                    projectsInTab () {
                        return this.projects.filter((n, i) => this.wikiHTMLList[i])
                    }
                },

                watch: {
                    allLoaded (val, old) {
                        if (val) {
                            const firstTab = this.projectsInTab[0]
                            this.activeTab = firstTab ? firstTab.pretty_name : ''
                        }
                    },

                    previewFrames: {
                        handler (val, old) {
                            // console.log(111, val)
                            sessionStorage.setItem('tapd-search-wiki/preview_frames', JSON.stringify(val))
                        },
                        deep: true
                    },

                    activePreviewTab (val, old) {
                        sessionStorage.setItem('tapd-search-wiki/active_preview_tab', val)
                    }
                },

                created () {
                    this.wd = SEARCH_WORD || decodeURIComponent(URL_QUERY.search) || ''
                    this.previewFrames = JSON.parse(sessionStorage.getItem('tapd-search-wiki/preview_frames')).map(n => ({
                        ...n,
                        loading: true
                    })) || []
                },

                mounted () {
                    // 设置返回顶部按钮
                    this.setBackTopBtn()

                    // 获取所有项目 id
                    axios({
                        url: 'https://www.tapd.cn/company/my_take_part_in_projects_list?project_id=' + CURR_PROJECT_ID
                    }).then(res => {
                        // console.log(res.data)
                        this.projects = takePartInWorkspaces.map((n, i) => ({
                            ...n,
                            index: i,
                            pageInfo: {
                                current: 1,
                                total: 1
                            },
                            switches: JSON.parse(n.switches)
                        }))
                        this.wikiHTMLList = Array(this.projects.length).fill().map(_ => '')
                        this.loaded = Array(this.projects.length).fill().map(_ => false)
                    })
                },

                methods: {
                    iframeLoaded (e, i) {
                        const frameBody = e.path[0].contentDocument.body
                        const list = frameBody.querySelector('.wiki-list')
                        const page = frameBody.querySelector('.simple-pager .current-page')
                        const [current, total] = page ? page.innerText.split('/').map(n => +n) : [1, 1]
                        // console.log([current, total])
                        this.$set(this.wikiHTMLList, i, list ? list.innerHTML : '')
                        this.$set(this.loaded, i, true)
                        this.$set(this.projects[i].pageInfo, 'current', current)
                        this.$set(this.projects[i].pageInfo, 'total', total)
                    },

                    onSearchInputEnter (val) {
                        if (val === this.wd) return
                        this.wd = val
                        this.loaded = Array(this.projects.length).fill().map(_ => false)
                        this.projects.forEach((n, i) => {
                            this.$set(this.projects[i].pageInfo, 'current', 1)
                        })
                    },

                    setBackTopBtn () {
                        function animate (time) {
                            requestAnimationFrame(animate)
                            TWEEN.update(time)
                        }
                        requestAnimationFrame(animate)
                        window.addEventListener('scroll', e => {
                            // console.log(e)
                            this.toggle.showBackTop = window.scrollY >= 200
                        })
                    },

                    backTop () {
                        this.scroll = {
                            x: window.scrollX,
                            y: window.scrollY
                        }

                        new TWEEN.Tween(this.scroll) // Create a new tween that modifies 'coords'.
                            .to({ x: 0, y: 0 }, 500) // Move to (300, 200) in 1 second.
                            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                            .onUpdate(() => {
                                // Called after tween.js updates 'coords'.
                                // Move 'box' to the position described by 'coords' with a CSS translation.
                                window.scrollTo(this.scroll.x, this.scroll.y)
                            })
                            .start() // Start the tween immediately.
                    },

                    // 搜索结果列表标签结构
                    tabLabelHtml (index) {
                        const projectInfo = this.projects[index]
                        const logo = projectInfo.logo_src
                            ? `<img class="project-logo" src="${projectInfo.logo_src}" />`
                            : `<i class="project-logo project-logo-${projectInfo.logoId}">${projectInfo.project_name[0]}</i>`

                        return `
                            <div class="current-project">
                                ${logo}
                                <span class="project-name">${projectInfo.project_name}</span>
                            </div>
                        `
                    },

                    iframeSrc (n) {
                        return `https://www.tapd.cn/${n.id}/markdown_wikis/search?search=${encodeURIComponent(this.wd.replace(/\*/g, ' '))}&page=${n.pageInfo.current}`
                    },

                    // wiki搜索结果列表组件 (为了让右侧打开按钮绑定事件)
                    wikiHtmlComp (html) {
                        const urls = html.match(/(?<=<a target="_blank" href=").+?(?=">)/g)
                        const names = html.match(/(?<=<div class="one-wiki-title" title=").+(?=">)/g)
                        let index = -1

                        html = html.replace(/(?<=<div class="one-wiki-title" title=".+">)[\s\n]+?(?=<a target="_blank" href=")/g, _ => {
                            index++
                            return `
                                <el-button
                                    type="text"
                                    icon=""
                                    @click="$emit('open-preview', {
                                        url: '${urls[index]}',
                                        name: '${names[index]}'
                                    })"
                                >
                                    在右侧打开预览
                                    <i class="el-icon-d-arrow-right el-icon--right" />
                                </el-button>
                            `
                        })

                        return {
                            name: 'wiki-html-comp',
                            template: `
                                <div>
                                    ${html}
                                </div>
                            `
                        }
                    },

                    // 打开预览页面
                    openPreview ({ url, name }) {
                        // console.log(url, name)
                        this.activePreviewTab = url

                        if (this.previewFrames.every(n => n.url !== url)) {
                            this.previewFrames.push({
                                url,
                                name,
                                wd: this.wd,
                                keywordList: [this.wd],
                                loading: true
                            })
                        } else {
                            const frameInfo = this.previewFrames.find(n => n.url === url)
                            if (frameInfo) {
                                frameInfo.keywordList = [...new Set([
                                    ...(frameInfo.keywordList || []),
                                    this.wd
                                ])]
                                this.$set(frameInfo, 'wd', this.wd)
                                // 滚动预测
                                this.scrollForecast(frameInfo)
                            }
                        }
                    },

                    // 关闭预览页面
                    removeWikiPreviewIframe (url) {
                        const lastUrl = (this.previewFrames.slice(-1)[0] || {}).url || ''
                        let prevUrl = ''

                        this.previewFrames = this.previewFrames.filter((n, i) => {
                            const isRemove = n.url === url

                            if (this.activePreviewTab === n.url && isRemove) {
                                this.activePreviewTab = prevUrl || lastUrl || ''
                            }

                            prevUrl = n.url

                            return n.url !== url
                        })
                    },

                    // 增加预览页面
                    addWikiPreviewIframe () {
                        this.toggle.addPreviewPopup = true
                    },

                    // 当预览页面加载完毕时
                    previewIframeLoaded (e, frameInfo) {
                        // 保存 document
                        this.$set(frameInfo, 'loading', false)
                        this.$set(frameInfo, 'document', e.path[0].contentDocument)

                        // 如果没有标题就设置标题
                        if (!frameInfo.name) {
                            const timer = setInterval(() => {
                                const dom = frameInfo.document.querySelector('#wikiName')
                                if (dom) {
                                    this.$set(frameInfo, 'name', dom.innerText)
                                    clearInterval(timer)
                                }
                            }, 100)
                        }

                        // 滚动预测
                        this.scrollForecast(frameInfo)
                        // 增加锚点链接复制按钮
                        this.addAnchorLinkCopyButton(frameInfo)

                        // 样式覆盖
                        GM_addStyle(`
                            #display_headers,
                            #headers_block,
                            #left-tree,
                            #wiki_tag,
                            #wiki_attachment,
                            #wiki_comment,
                            .wiki-nav,
                            .nav-main-wrap,
                            .main-search-area,
                            .cloud-guide-switch,
                            .toolbar,
                            .wiki-option-warp,
                            .attachment-upload-wrap,
                            .wiki-nav-small {
                                display: none !important;
                            }

                            .project-nav {
                                left: 0;
                                min-width: auto;
                            }

                            .frame-main {
                                min-width: auto !important;
                            }

                            .wiki-main {
                                padding: 20px !important;
                                margin-left: 0 !important;
                                max-width: 100%;
                            }

                            #page-content, #page-wrapper {
                                margin-left: 0 !important;
                            }

                            .tui-skin-lego #page-content {
                                min-width: auto;
                            }

                            .wiki-tag-wrapper {
                                margin-right: 0;
                            }

                            .wiki-wrap {
                                margin-top: 15px !important;
                            }

                            .cherry-markdown .cherry-table-container .cherry-table td {
                                min-width: auto;
                            }
                        `, frameInfo.document.head, 'wiki-preview-iframe-css')
                    },

                    // 点击 tooltips 中的关键词进行滚动
                    scrollForecastItem (frameInfo, keyword) {
                        frameInfo.wd = keyword
                        this.scrollForecast(frameInfo)
                    },

                    // 移除关键字
                    removeKeywordItem (frameInfo, keyword) {
                        frameInfo.keywordList = frameInfo.keywordList.filter(n => n !== keyword)
                        if (keyword === frameInfo.wd) {
                            frameInfo.wd = frameInfo.keywordList[0] || ''
                        }
                    },

                    // 滚动预测
                    scrollForecast (frameInfo) {
                        setTimeout(() => {
                            const {
                                // url,
                                // name,
                                wd = '',
                                document
                            } = frameInfo

                            if (!(wd && document)) return

                            let isFind = false // 只滚动至第一个找到的元素位置

                            ;[
                                $(document).find('#searchable > *'),
                                $(document).find('#wiki_right .wiki-body .wiki-info + * > *')
                            ].forEach(queryDoms => {
                                queryDoms.each((i, n) => {
                                    if (isFind) return
                                    if (new RegExp(wd.split(' ').join('|').replace(/\*/g, '.*?'), 'ig').test($(n).text())) {
                                        const wikiRight = document.querySelector('#wiki_right')
                                        const tweenData = {
                                            x: wikiRight.scrollLeft,
                                            y: wikiRight.scrollTop
                                        }

                                        if (n.offsetTop + 100 !== wikiRight.scrollTop) {
                                            new TWEEN.Tween(tweenData) // Create a new tween that modifies 'coords'.
                                                .to({ x: 0, y: n.offsetTop + 100 }, 500) // Move to (300, 200) in 1 second.
                                                .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                                                .onUpdate(() => {
                                                    // Called after tween.js updates 'coords'.
                                                    // Move 'box' to the position described by 'coords' with a CSS translation.
                                                    wikiRight.scrollTo(tweenData.x, tweenData.y)
                                                })
                                                .start() // Start the tween immediately.
                                        }

                                        isFind = true
                                    }
                                })
                            })
                        })
                    },

                    // 增加锚点链接复制按钮
                    addAnchorLinkCopyButton (frameInfo) {
                        setTimeout(() => {
                            const {
                                url,
                                // name,
                                // wd = '',
                                document
                            } = frameInfo

                            ;[
                                $(document).find('#searchable > *'),
                                $(document).find('#wiki_right .wiki-body .wiki-info + * > *')
                            ].forEach(queryDoms => {
                                queryDoms.each((i, n) => {
                                    const anchorDiv = $(n).find('.anchor-div')[0]

                                    if (anchorDiv) {
                                        // 复制按钮
                                        const copyBtn = $(`
                                            <div
                                                title="点击复制锚点链接"
                                                class="anchor-div font-public font font-copy"
                                                style="position: relative; height: 20px; width: 22px;"
                                                data-clipboard-text="${url}@${$(anchorDiv).attr('data-head')}"
                                            ></div>
                                        `).appendTo(n)

                                        // 复制代码
                                        const clipboard = new ClipboardJS(copyBtn[0])

                                        clipboard.on('success', e => {
                                            this.$message.success('已复制锚点链接到剪贴板 ٩(๑>◡<๑)۶ ')
                                        })

                                        clipboard.on('error', e => {
                                            this.$message.error('复制失败！请重试！ (；´д｀)ゞ')
                                        })
                                    }
                                })
                            })
                        }, 1000)
                    },

                    // 在增加预览页面弹窗关闭之后
                    addPreviewPopupClosed () {
                        this.addPreviewPopupData.url = ''
                    },

                    // 增加预览页面（弹窗点击确定）
                    addPreviewFrame () {
                        const url = this.addPreviewPopupData.url

                        if (!url) {
                            this.$message.error('请输入网址')
                            return
                        }

                        if (!/^https:\/\/www\.tapd\.cn\/\d+\/markdown_wikis\/show\/#\d+/.test(url)) {
                            this.$message.error('只能输入wiki结果页地址 ')
                            return
                        }

                        const item = this.previewFrames.find(n => n.url === url)

                        this.activePreviewTab = url

                        if (!item) {
                            this.previewFrames.push({ url })
                        }

                        this.toggle.addPreviewPopup = false
                    }
                },

                directives: {
                    sortable (el, binding, vnode, oldVnode) {
                        // console.log({ el, binding, vnode, oldVnode })
                        const {
                            container,
                            draggable,
                            list = []
                        } = (binding.value || {})

                        el.sortable = new Sortable(el.querySelector(container), {
                            draggable,
                            animation: 150,
                            easing: 'cubic-bezier(1, 0, 0, 1)',
                            onEnd: (evt) => {
                                // console.log(evt)
                                const {
                                    newIndex,
                                    oldIndex
                                } = evt

                                const _list = list.map(n => n.url)
                                const item = _list.splice(oldIndex)[0]
                                _list.splice(newIndex, 0, item)
                                list.sort((n, m) => _list.indexOf(n.url) - _list.indexOf(m.url))
                            }
                        })
                    }
                }
            })
        }
    }

    // 公共样式
    GM_addStyle(`
        * {
            outline: none;
        }

        .kiccer-tampermonkey-tapd-wiki-search {
            float: right;
            height: 100%;
            display: flex;
            align-items: center;
            margin-right: 15px;
        }

        .kiccer-tampermonkey-tapd-wiki-search .el-input input {
            width: 200px;
        }

        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s;
        }

        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }
    `)

    // 搜索页样式
    if (IN_SEARCH_PAGE) {
        GM_addStyle(`
            .search-result {
                min-height: calc(100vh - 184px) !important;
            }

            .el-tabs__item {
                padding: 0 10px !important;
                user-select: none;
            }

            .wiki-list-wrapper {
                padding: 20px;
                margin-bottom: 20px;
                border-radius: 4px;
                // box-shadow: 0 0 10px rgba(128,145,165,0.2);
                border: 1px solid #dcdfe6;
            }

            .wiki-list .el-alert {
                margin-bottom: 20px;
            }

            .wiki-list .el-tabs__item {
                padding: 0 10px !important;
            }

            .wiki-list .el-tabs__item.is-active .project-name {
                font-weight: bold;
            }

            .wiki-list .el-tabs__header {
                margin-bottom: 0;
            }

            .wiki-list .el-tabs__content {
                border: 1px solid #e4e7ed;
                border-top: none;
                border-radius: 0 0 4px 4px;
                padding: 15px;
            }

            .wiki-list .el-pagination {
                text-align: right;
            }

            .wiki-list .tab-label {
                display: inline-flex;
                align-items: center;
                width: auto;
                height: 100%;
            }

            .wiki-list .current-project {
                display: inline-block;
                width: auto;
                min-width: auto;
                margin: 0 !important;
                height: 24px;
                line-height: 24px;
            }

            .wiki-list .el-input {
                margin-bottom: 20px;
            }

            .wiki-list .el-input input {
                width: 100%;
            }

            .wiki-list .back-top {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                background-color: #f5f7fa;
                position: fixed;
                left: 790px;
                bottom: 61px;
                border: 1px solid rgb(220, 223, 230);
                font-size: 20px;
                border-radius: 4px;
                cursor: pointer;
            }

            .wiki-list .one-wiki-title .el-button {
                padding: 0;
                float: right;
                line-height: 21px;
            }

            .hide-iframe {
                display: none;
            }

            .wiki-preview {
                position: fixed;
                top: 124px;
                right: 60px;
                bottom: 60px;
                left: 860px;
            }

            .wiki-preview .wiki-preview-iframe {
                width: 100%;
                height: 100%;
                border-radius: 4px;
                border: none;
            }

            .wiki-preview .el-tabs {
                height: 100%;
            }

            .wiki-preview .el-tabs .el-tabs__header {
                margin-bottom: 0;
            }

            .wiki-preview .el-tabs .el-tabs__content {
                height: calc(100% - 41px);
                border: 1px solid #e4e7ed;
                border-top: none;
                border-radius: 0 0 4px 4px;
            }

            .wiki-preview .el-tabs .el-tabs__content .el-tab-pane {
                height: 100%;
            }

            .wiki-preview .el-tabs__new-tab:focus {
                outline: none;
            }

            .wiki-preview .el-tabs__item .ellipsis {
                display: inline-block;
                line-height: 1;
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: -2px;
            }

            a.red:hover {
                color: red;
            }
        `)
    }

    // 展示页样式
    if (IN_SHOW_PAGE) {
        // GM_addStyle(``)
    }
})()
