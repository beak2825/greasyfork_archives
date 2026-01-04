// ==UserScript==
// @name         zhihutime - 知乎时间跨度
// @version      0.7
// @description  展示回答或者文章的发表时间距今的时间跨度
// @author       lucienlugeek@gmail.com
// @match        https://www.zhihu.com/
// @match        https://zhuanlan.zhihu.com/*
// @match        https://*.zhihu.com/column/*
// @match        https://*.zhihu.com/question/*
// @match        https://*.zhihu.com/follow
// @match        https://*.zhihu.com/people/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/909394
// @downloadURL https://update.greasyfork.org/scripts/444342/zhihutime%20-%20%E7%9F%A5%E4%B9%8E%E6%97%B6%E9%97%B4%E8%B7%A8%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/444342/zhihutime%20-%20%E7%9F%A5%E4%B9%8E%E6%97%B6%E9%97%B4%E8%B7%A8%E5%BA%A6.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    // 问题与答案，并且可以点击【查看所有答案】的页面
    //const PAGE_Q_A_FEW = /^https:\/\/www.zhihu.com\/question\/\d{1,}\/answer\/\d{1,}$/

    // 纯粹查看所有答案的页面
    //const PAGE_Q_A_ALL = /^https:\/\/www.zhihu.com\/question\/\d{1,}$/

    // 知乎专栏页面 - 单篇文章
    const PAGE_Z_P = /^https:\/\/zhuanlan.zhihu.com\/p\/.*$/

    // 知乎专栏页面 - 列表
    //const PAGE_Z_COLUMN = /^https:\/\/zhihu.com\/column\/.*$/

    // 知乎首页-推荐页面（每次访问该页面，都会请求最新数据）
    //const PAGE_RECOMMEND = /^https:\/\/www.zhihu.com\/$/ // https://www.zhihu.com/

    // 关注
    //const PAGE_FOLLOW = /^https:\/\/www.zhihu.com\/follow$/ // https://www.zhihu.com/follow

    // 个人主页
    //const PAGE_PEOPLE = /^https:\/\/www.zhihu.com\/people\/.*$/ // https://www.zhihu.com/people/lucienlugeek

    const style = `
	    .warning-date {
		-webkit-text-size-adjust: 100%;
		word-break: normal;
		font-size: 1rem;
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		-webkit-box-align: center;
		align-items: center;
		padding: 5px 10px;
		background-color: #fcf0bf;
		color: rgba(0, 0, 0, 0.57);
		line-height: 1.5;
		font-weight: 600;
		border-radius: 3px;
	    }

	    .warning-date-year, .warning-date-month {
		background-color: #fcf0bf;
	    }
	    .warning-date-day, .warning-date-hour {
		background-color: #e5efff;
	    }
	    `

  GM_addStyle(style)

    /**render time warning info by given date and node */
    const render_dom = function (date, answerNode, type) {
        const duration = moment.duration(moment().diff(moment(date)))
        const node = document.createElement('div')
        // year
        const y = duration.get('year')
        // month
        const m = duration.get('month')
        // day
        const d = duration.get('day')
        // hour
        const h = duration.get('hour')

        node.classList.add('warning-date')

        if (y !== 0) {
            // years ago
            node.classList.add('warning-date-year')
            node.innerHTML = `⚠️ 回答于${y}年前`
    } else if (m !== 0) {
        // months ago
        node.classList.add('warning-date-month')
        node.innerHTML = `⚠️ 回答于${m}个月前`
    } else if (d !== 0) {
        // some days ago
        node.classList.add('warning-date-day')
        node.innerHTML = `✍️&nbsp;&nbsp;回答于${d}天前`
    } else if (h !== 0) {
        // just some hours ago
        node.classList.add('warning-date-hour')
        node.innerHTML = `✍️&nbsp;&nbsp;回答于${h}小时前`
    } else {
        node.classList.add('warning-date-hour')
        node.innerHTML = `✍️&nbsp;&nbsp;回答于1小时以内`
    }

        // insert date warning before the main content.
        const first = answerNode.firstChild
        const richContent = answerNode.querySelector('.RichContent')
        const old = answerNode.querySelector('.warning-date')
        if (old === null) {
            // zhuanlan page is different from other pages.
            if (type !== 'z' && richContent !== null) {
                answerNode.insertBefore(node, richContent)
            } else {
                answerNode.insertBefore(node, first)
            }
        }
    }

    /**render datetime warning before the main content */
    const render = function () {
        // todo: some content does not contain meta
        const answerItems = Array.from(document.querySelectorAll('.ContentItem')) // todo: AnswerItem?
        answerItems.map((answer) => {
            const meta = answer.querySelector(`meta[itemprop='dateModified']`)
            if (meta === null) {
                return
            }
            const date_modified = meta.getAttribute('content')
            render_dom(date_modified, answer)
        })
    }

    // 知乎专栏页面
    if (PAGE_Z_P.test(document.URL)) {
        const t = document.querySelector('.ContentItem-time').innerText
        const first_space_index = t.indexOf(' ')
        const date = t.slice(first_space_index + 1, 14)
        render_dom(date, document.querySelector('.RichText'), 'z')
        return
    }

    // 关注，推荐，问题与答案等页面，都是采用瀑布流（延迟加载）的方式更新内容，所以需要对DOM进行观察
    // NOTE: 无法通过document.URL或者location.href等方式获取到当前地址栏中的URL，所以不采用对URL的观察
    //       根据不同页面中元素class的不同，来判断当前的页面类型！！！

    let observer = null

    // execute render after 1000ms delay.
    const delay = function () {
        setTimeout(function () {
            if (observer) {
                // 停止观察
                observer.disconnect()
            }
            render()
            createObserver()
        }, 1000)
    }

    const createObserver = function () {
        const ALL_ANSWER = document.querySelector(`.AnswersNavWrapper [role='list']`)
        const FEW_ANSWER = document.querySelector(`.Question-mainColumn`)
        const TOP_STORY = document.querySelector(`.Topstory-content`)
        const PEOPLE = document.querySelector(`.Profile-mainColumn`)
        const COLUMN = document.querySelector(`.ColumnPageHeader-Wrapper ~ div.Card ~ div.Card`)

        let targetNode = null

        if (ALL_ANSWER !== null) {
            // 所有答案
            targetNode = ALL_ANSWER
        } else if (FEW_ANSWER !== null) {
            // 问题与少部分答案
            targetNode = FEW_ANSWER

            // 点击【查看所有答案】按钮时，触发render()方法
            const viewAllEle = Array.from(document.querySelectorAll('.ViewAll-QuestionMainAction'))
            viewAllEle.map((m) => {
                m.removeEventListener('click', delay)
                m.addEventListener('click', delay)
            })
        } else if (TOP_STORY !== null) {
            // 推荐，关注
            targetNode = TOP_STORY
        } else if (PEOPLE !== null) {
            // 个人主页
            targetNode = PEOPLE
        } else if (COLUMN !== null) {
            // 专栏列表页
            targetNode = COLUMN
        } else {
            // 其他情况暂不考虑
            return
        }

        if (targetNode === null) {
            return
        }

        // 观察器的配置（需要观察什么变动）
        const config = { attributes: false, childList: true, subtree: true }

        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    render()
                }
            }
        }

        // 创建一个观察器实例并传入回调函数
        observer = new MutationObserver(callback)

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config)
    }

    // 跳转到不同文档会触发
    document.addEventListener('readystatechange', () => {
        if (/interactive|complete/.test(document.readyState)) {
            render();
            createObserver();
        }
    })

    // 监听浏览器的返回上一页事件，只在相同文档之间跳转才会触发
    window.addEventListener('popstate', function () {
        if (observer) {
            // 停止观察
            observer.disconnect()
        }
        render()
        createObserver();
    })
})()
