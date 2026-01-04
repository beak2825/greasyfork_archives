// ==UserScript==
// @name         My知乎目录
// @namespace    https://github.com/kongkongye/zh-category
// @version      1.1.0
// @description  知乎长文目录，方便阅读。
// @author       空空叶
// @match        https://www.zhihu.com/*
// @license      Apache
// @require http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386722/My%E7%9F%A5%E4%B9%8E%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/386722/My%E7%9F%A5%E4%B9%8E%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 文章列表
     */
    let articles = []
    let articlesMap = {}
    /**
     * 当前文章，可以没有
     */
    let currentArticle
    /**
     * 标题条
     */
    let titleBar
    /**
     * 最顶端那条的高度
     */
    let appHeaderHeight = 0;

    (() => {
        Array.prototype.removeIf = function(callback) {
            let i = 0;
            while (i < this.length) {
                if (callback(this[i], i)) {
                    this.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
        };
    })()

    /**
     * 常量
     */
    let Consts = {
        textColorSel: '#76839b',//文字选中颜色
        textColorUnSel: '#8590a6',//文字未选中颜色
    }

    /**
     * 实用类
     */
    let Utils = {
        // Generate four random hex digits.
        S4: () => (((1+Math.random())*0x10000)|0).toString(16).substring(1),
        // Generate a pseudo-GUID by concatenating random hexadecimal.
        guid: () => (Utils.S4()+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+"-"+Utils.S4()+Utils.S4()+Utils.S4()),

        //获取属性
        getAttr: (ele, key) => $(ele).attr(key),
        //设置属性
        setAttr: (ele, key, value) => $(ele).attr(key, value),

        //滚动
        goToByScroll: ele => {
            $('html,body').animate({
                scrollTop: $(ele).offset().top - appHeaderHeight
            }, 'slow');
        },
        goToEndByScroll: ele => {
            $('html,body').animate({
                scrollTop: $(ele).offset().top + $(ele).height() - $(window).height()
            }, 'slow');
        },
    };

    /**
     * 不同页面适配器
     */
    let Wrappers = {
        /**
         * 得到打开的问题列表
         */
        getArticleRoots: () => {
            let result

            let path = window.location.pathname
            if (path === '/' || path === '/follow') {//首页&关注
                result = $('.TopstoryItem')
            }else if (path === '/search') {//搜索页
                result = $('.SearchResult-Card')
            }else if (path.startsWith("/question")) {
                if (path.indexOf("answer") !== -1) {//问题的指定回答
                    //指定回答&更多回答
                    result = $('.AnswerCard,.List-item')
                }else {//问题的所有回答
                    result = $('.List-item')
                }
            }else if (path === '/topic' || path === '/explore') {//话题
                result = $('.feed-item').filter((index, ele) => {
                    let RichText = $('.zm-item-rich-text', ele)
                    if (RichText && RichText.length > 0) {
                        let children = RichText.children()
                        if (children
                            && children.length > 0
                            && children[0].nodeName.toLowerCase() === 'div'
                            && $(children[0]).css('display') !== 'none') {
                            return true
                        }
                    }
                    return false
                })
                return result
            }else {
                console.debug('[此页面无法解析]', path)
            }

            if (result) {
                result = result.filter((index, ele) => {
                    let RichContent = $('.RichContent', ele)
                    return RichContent && RichContent.length > 0 && !RichContent.hasClass('is-collapsed')
                })
            }

            return result
        },
        /**
         * 尝试解析文章数据
         * @param $root 文章根元素
         * @return Article,解析不出返回null
         */
        parseArticle: $root => {
            let id = Utils.guid()
            let title //文章标题

            //解析
            let path = window.location.pathname
            if (path === '/' || path === '/follow') {//首页&关注
                let $ContentItem = $('.ContentItem', $root)
                let data = JSON.parse($ContentItem.attr('data-zop'))
                title = data.title
            }else if (path === '/search') {//搜索页
                let $ContentItemTitle = $('.ContentItem-title', $root)
                let $nameMeta = $('meta[itemprop="name"]', $ContentItemTitle)
                title = $nameMeta.attr('content')
            }else if (path.startsWith("/question")) {
                //不需要显示标题
            }else if (path === '/topic' || path === '/explore') {//话题&发现（旧）
                let $questionLink = $('.question_link', $root)
                title = $questionLink.text()
            }else {
                console.debug('[此页面无法解析]', path)
                return null
            }

            return new Article({
                id,
                title,
                $root,
            })
        },
        /**
         * 获取头部条
         */
        getHeader: () => {
            let path = window.location.pathname
            if (path === '/topic' || path === '/explore') {//话题&发现（旧）
                return $('.zu-top')
            }else {//其他(新)
                return $('.AppHeader')
            }
        },
        /**
         * 获取侧边栏
         */
        getSideBar: () => {
            let path = window.location.pathname
            if (path === '/' || path === '/follow') {//首页&关注
                return $('.GlobalSideBar')
            }else if (path === '/search') {//搜索页
                return $('.SearchSideBar')
            }else if (path.startsWith("/question")) {
                return $('.Question-sideColumn')
            }else if (path === '/topic' || path === '/explore') {//话题&发现（旧）
                return $('.zu-main-sidebar')
            }else {
                console.debug('[此页面无法解析]', path)
            }
        },
        /**
         * 获取文本容器
         */
        getTextWrapper: $root => {
            let path = window.location.pathname
            if (path === '/topic' || path === '/explore') {//话题&发现（旧）
                return $('.zm-item-rich-text', $root)
            }else {//其他(新)
                return $('.RichText', $root)
            }
        }
    }

    /**
     * 文章类
     */
    let Article = function({id, title, $root}) {
        this.id = id
        this.title = title //可以为null
        this.$root = $root

        this.titles = []
        this.titlesMap = {}

        $root.on('mousemove', () => toggleCurrentArticle(this))

        let $TextWrapper = Wrappers.getTextWrapper($root)
        $('h1,h2,h3,h4,h5,h6', $TextWrapper).each((index, $title) => {
            $title = $($title)
            let id = Utils.guid()
            let titleEle = {
                id: id,
                ele: $title,
                content: $title.text()
            }
            this.titles.push(titleEle)
            this.titlesMap[id] = titleEle
        })
        console.debug(this.titles)
    }

    /**
     * 切换当前的文章
     * @param article 可为null
     */
    let toggleCurrentArticle = article => {
        if (currentArticle === article) {
            return
        }
        console.debug('[切换当前文章]', article)
        currentArticle = article
        refreshTitleBar()
    }

    /**
     * 刷新标题条（根据当前文章）
     */
    let refreshTitleBar = () => {
        //当前没有文章
        if (!currentArticle) {
            titleBar.hide()
            return
        }

        //有标题
        let titleBarContent = $('<div style="padding: 5px 10px;display: flex;flex-direction: column;"></div>')
        //标题
        if (currentArticle.title) {
            let titleLine = $('<div style="align-self: center;text-align: center;">'+currentArticle.title+'</div>')
            titleLine.css('color', Consts.textColorSel)
            titleBarContent.append(titleLine)
        }
        //到顶部
        let toTop = $('<a href="javascript: void(0)" style="align-self: center;margin-top: 5px;color: '+Consts.textColorUnSel+';">↑到顶部↑</a>')
        toTop.on('click', () => Utils.goToByScroll(currentArticle.$root))
        toTop.hover(() => toTop.css('color', Consts.textColorSel), () => toTop.css('color', Consts.textColorUnSel))
        titleBarContent.append(toTop)
        //中间标题
        currentArticle.titles.forEach(item => {
            let titleEle = $('<a href="javascript: void(0)" ' +
                'style="border-radius: 5px;border: solid 1px lightgrey;padding: 5px 10px;margin-top: 5px;color: '+Consts.textColorUnSel+';"' +
                '>'+item.content+'</a>')
            titleEle.hover(() => {
                titleEle.css('border-style', 'inset')
                titleEle.css('color', Consts.textColorSel)
            }, () => {
                titleEle.css('border-style', 'solid')
                titleEle.css('color', Consts.textColorUnSel)
            })
            titleEle.on('click', () => Utils.goToByScroll(item.ele))
            titleBarContent.append(titleEle)
        })
        //到底部
        let toBottom = $('<a href="javascript: void(0)" style="align-self: center;margin-top: 5px;margin-bottom: 5px;color: '+Consts.textColorUnSel+';">↓到底部↓</a>')
        toBottom.on('click', () => Utils.goToEndByScroll(currentArticle.$root))
        toBottom.hover(() => toBottom.css('color', Consts.textColorSel), () => toBottom.css('color', Consts.textColorUnSel))
        titleBarContent.append(toBottom)

        //更新标题内容
        titleBar.children().remove()
        titleBar.append(titleBarContent)
        titleBar.show()
    }

    /**
     * 刷新
     */
    let refresh = () => {
        console.debug('[刷新]')
        //得到打开的问题列表
        let openedArticleRoots = Wrappers.getArticleRoots()

        //全部初始化
        let activeIds = {}
        if (openedArticleRoots) {
            openedArticleRoots.each((index, ele) => {
                let id = init($(ele))
                if (id) {
                    activeIds[id] = true
                }
            })
        }
        articles.removeIf(e => {
            if (!activeIds[e.id]) {
                //注销事件
                e.$root.off()
                return true
            }
        })
        articlesMap = {}
        articles.forEach(article => articlesMap[article.id] = article)
        //检测刷新当前文章
        if (currentArticle && !articlesMap[currentArticle.id]) {
            toggleCurrentArticle(null)
        }
        //日志
        console.debug('[打开的文章]', articles)
    }

    /**
     * 初始化
     * @param $root 打开的项
     * @return id
     */
    let init = $root => {
        let id = $root.attr('id')
        //已经有id了
        if (id) {
            if (articlesMap[id]) {//缓存有效
                console.debug('[已经有缓存了]', id)
                return id
            }else {
                //缓存失效了
            }
        }

        let article = Wrappers.parseArticle($root)
        if (article) {
            let id = article.id
            //设置id
            $root.attr('id', id)
            //添加缓存
            articles.push(article)
            articlesMap[id] = article
            //日志
            console.info('[初始化]', id, article, $root)
            return id
        }
    }

    /**
     * 获取有指定类名的父类
     * @param element 当前元素
     * @param className 类名
     * @return 未找到返回null(如果本身就有此类名，则返回本身)
     */
    let _getParent = (element, className) => {
        //元素为null
        if (!element || $(element).length === 0) {
            return null
        }

        //本身
        if ($(element).hasClass(className)) {
            return $(element)
        }

        //父
        return _getParent($(element).parent(), className)
    }

    $(document).click(({target}) => {
        console.debug('[点击]', target)
        setTimeout(refresh)
    })

    //ready时运行
    $(() => {
        //计算头部高度
        appHeaderHeight = Wrappers.getHeader().height()

        //初始化标题条
        let $SideBar = Wrappers.getSideBar()
        if ($SideBar) {
            let topBottomMargin = appHeaderHeight+30;
            titleBar = $('<div id="tagsTitleBar" style="position: fixed;top: '+topBottomMargin+'px;bottom: '+topBottomMargin+'px;background-color: rgba(255, 255, 255, 0.95);z-index: 180;opacity: 0.5;border-radius: 5px;overflow-y: auto;box-shadow: rgba(152, 152, 152, 0.5) 0px 1px 3px;word-break: break-word;"></div>')
            titleBar.css('color', Consts.textColorUnSel)
            titleBar.width($SideBar.width())
            titleBar.hover(() => {
                titleBar.css('opacity', '1')
            }, () => {
                titleBar.css('opacity', '0.5')

            })
            titleBar.hide()
            $SideBar.append(titleBar)
        }

        //初始刷新
        refresh()
        //定时刷新
        setInterval(refresh, 3000)
    })
})();