// ==UserScript==
// @name         Cyou Mm
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        http://meeting.baidu.com/*
// @match        http://meeting.baidu.com/index.html/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382064/Cyou%20Mm.user.js
// @updateURL https://update.greasyfork.org/scripts/382064/Cyou%20Mm.meta.js
// ==/UserScript==

function safeGet(obj, path) {
    let r = obj
    const p = path.split('.')
    while (p.length) {
        r = r[p.shift()]
        if (r === null || r === void 0) {
            break
        }
    }
    return r
}

function getTimestamp(month, day, hour, minute) {
    let date = new Date()
    date.setMonth(month === void 0 ? date.getMonth() : month)
    date.setDate(day === void 0 ? date.getDate() : day)
    date.setHours(hour)
    date.setMinutes(minute)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.valueOf()
}

const bookTimestamp = getTimestamp(void 0, void 0, 10, 30)

function createDom(type, props, style) {
    const dom = document.createElement(type)
    Object.assign(dom, props)
    Object.assign(dom.style, style)
    return dom
}

class XHRExtends {
    static hookAjax(proxy) {
        window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
        XMLHttpRequest = function () {
            var xhr = new window._ahrealxhr
            Object.defineProperty(this, 'xhr', {
                value: xhr
            })
        }

        var prototype = window._ahrealxhr.prototype
        for (var attr in prototype) {
            var type = ""
            try {
                type = typeof prototype[attr]
            } catch (e) {
            }
            if (type === "function") {
                XMLHttpRequest.prototype[attr] = hookfun(attr)
            } else {
                Object.defineProperty(XMLHttpRequest.prototype, attr, {
                    get: getFactory(attr),
                    set: setFactory(attr),
                    enumerable: true
                })
            }
        }

        function getFactory(attr) {
            return function () {
                var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr]
                var attrGetterHook = (proxy[attr] || {})["getter"]
                return attrGetterHook && attrGetterHook(v, this) || v
            }
        }

        function setFactory(attr) {
            return function (v) {
                var xhr = this.xhr
                var that = this
                var hook = proxy[attr]
                if (typeof hook === "function") {
                    xhr[attr] = function () {
                        proxy[attr](that) || v.apply(xhr, arguments)
                    }
                } else {
                    //If the attribute isn't writeable, generate proxy attribute
                    var attrSetterHook = (hook || {})["setter"]
                    v = attrSetterHook && attrSetterHook(v, that) || v
                    try {
                        xhr[attr] = v
                    } catch (e) {
                        this[attr + "_"] = v
                    }
                }
            }
        }

        function hookfun(fun) {
            return function () {
                var args = [].slice.call(arguments)
                if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {
                    return
                }
                return this.xhr[fun].apply(this.xhr, args)
            }
        }

        return window._ahrealxhr
    }

    static unHookAjax() {
        if (window._ahrealxhr) XMLHttpRequest = window._ahrealxhr
        window._ahrealxhr = undefined
    }
}

class PostBook {
    constructor(data) {
        let resolve
        this.promise = new Promise(a => (resolve = a))
        // 0: 还未开始预订, 其他: 接口返回, -1: 其他异常
        this.status = ' '
        this.data = PostBook.transformData(data)
        this.xhr = new window._ahrealxhr()
        this.xhr.open('POST', '/h5/book', true)
        //设置发送数据的请求格式
        this.xhr.setRequestHeader('content-type', 'application/json')
        this.xhr.onerror = function () {
            console.log('error')
        }
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState == 4) {
                //根据服务器的响应内容格式处理响应结果
                var result = JSON.parse(this.xhr.responseText)
                //根据返回结果判断验证码是否正确
                if (result.code === 200 && result.status === 1) {
                    this.status = result.data.message
                } else {
                    this.status = '异常'
                }
                resolve(true)
            }
        }
    }

    async send() {
        await this.xhr.send(JSON.stringify(this.data))
        await this.promise
        return this.status
    }

    static transformData(data) {
        let month = +data.dateString.split('/')[0] - 1
        let day = +data.dateString.split('/')[1]
        // TODO: 跨年可能出现 bug, 暂时不考虑
        let hour = +data.startTime.split(':')[0]
        return {
            startTime: getTimestamp(month, day, hour, 0),
            endTime: getTimestamp(month, day, hour + 1, 0),
            peopleNum: data.room.capacity,
            roomKey: data.room.id,
            t: bookTimestamp,
            description: '薄荷会议 VIP 用户在使用会议室'
        }
    }
}

class UI {
    constructor() {
        // 所有查看过的会议室
        this.roomList = []
        // todo: 如何使 bookList 与 dom 实现双向绑定
        this.bookList = []
        // 当前活跃的选中会议室
        this.tmpActiveRoom = null
        // 计时器
        this.taskId = null
        // 是否已经执行预订了
        this.isBooked = false

        // 根 dom
        this.rootDom = null
        // 已选中的列表 dom
        this.listDom = null
        // 操作按钮容器 Dom
        this.opsDom = null
        // 右键菜单 dom
        this.contextMenuDom = null
        // 倒计时 dom
        this.countDownDom = null
    }

    init() {
        this.buildInjectUI()
    }

    startCountDown() {
        // 时间超了, 不倒计时了
        if (bookTimestamp - new Date().valueOf() < 0) {
            // return
        }
        this.taskId = setInterval(
            () => {
                if (this.isBooked) {
                    this.countDownDom = null
                    return
                }
                const now = new Date()
                const gap = bookTimestamp - now.valueOf()
                !!this.countDownDom && (this.countDownDom.textContent = '剩余时间(单位: 秒): ' + (gap > 0 ? gap / 1000 : 0))
                if (gap < 1) {// 10ms 以内, gap 小于 1ms , 直接开抢
                    this.doBooking()
                }
            },
            10
        )
    }

    stopCountDown() {
        clearInterval(this.taskId)
        this.taskId = null
    }

    async doBooking() {
        this.isBooked = true
        const bookResult = await Promise.all(
            this.bookList.map(book => new PostBook(book).send())
        )
        this.bookList.forEach((item, idx) => (item.status = bookResult[idx]))
        this.stopCountDown()
        this.renderDynamicElements()
    }

    buildInjectUI() {
        // 样式
        this.styleClearance()
        // 根元素
        this.createRootDom()
        // 动态数据
        this.renderDynamicElements()
        // 自定义右键菜单
        this.createCustomContextMenu()
        // 绑定右键菜单事件
        this.bindOriginDomEvent()
    }

    updateRoomList(queryApiResponse) {
        const newRooms = safeGet(queryApiResponse, 'data.entity.roomList') || []
        const filterRooms = this.roomList.filter(room => newRooms.every(r => r.id !== room.id))
        this.roomList = newRooms.concat(filterRooms)
    }

    bindOriginDomEvent() {
        document.oncontextmenu = e => {
            let shouldShowMenu = e.target.classList.contains('time-list')
            let target = e.target
            while (!shouldShowMenu && target) {
                target = target.parentNode
                shouldShowMenu = target.classList.contains('time-list')
            }

            if (shouldShowMenu) {
                //屏蔽掉浏览器本身的右键菜单
                e.preventDefault && e.preventDefault()
                e.returnValue = false
                if (target.innerText.indexOf('联系') >= 0) {
                    alert('视频会议室要联系会服')
                    return
                }
                if (target.innerText.indexOf('详情') >= 0) {
                    alert('别人的会议室')
                    return
                }
                this.tmpActiveRoom = target
                //设置右键菜单的位置以及显示出来
                var menu = this.contextMenuDom
                menu.style.left = event.clientX + "px"
                menu.style.top = event.clientY + "px"
                menu.style.visibility = "visible"
            }
        }
        document.onclick = e => {
            this.contextMenuDom.style.visibility = 'hidden'
        }
    }

    createCustomContextMenu() {
        const menuDom = createDom('div', {
            id: 'cyou-mm-context-menu',
            className: 'cyou-mm-context-menu'
        }, {
            visibility: 'hidden',
            position: 'fixed',
            zIndex: 1000
        })
        const addToBookListBtnDom = createDom('div', {
            className: 'cyou-mm-context-menu-item',
            textContent: 'VIP 预订',
            onclick: () => this.handleVIPBookClick()
        })
        menuDom.append(addToBookListBtnDom)
        this.rootDom.append(menuDom)
        this.contextMenuDom = menuDom
    }

    styleClearance() {
        let ret = `.cyou-mm {
position: fixed;
bottom: 60px;
left: 10px;
padding: 12px;
border-radius: 5px;
z-index: 100;
background-color: #fff;
box-shadow: 0 3px 27px -2px #18c984;
min-width: 250px;
}

.cyou-mm .cyou-mm-vip-title {
display: inline-block;
height: 25px;
line-height: 25px;
padding-left: 50px;
margin-bottom: 10px;
color: #ccc;
background: url(http://pik.internal.baidu.com/2019/04/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%AF%BC%E5%87%BA-20190421-0314.png) left top no-repeat;
background-size: auto 25px;
}

.cyou-mm ul {
list-style: none;
}

.cyou-mm li {
position: relative;
display: inline-block;
padding: 10px 40px 10px 10px;
border: 1px solid #ababab;
margin-left: -1px;
color: #ababab;
}

.cyou-mm li:hover {
border-color: #18c984;
z-index: 5;
color: #18c984;
}

.cyou-mm .cyou-mm-item-name {
font-size: 14px;
font-weight: bold;
margin-bottom: 5px;
}

.cyou-mm .cyou-mm-count-down-text{
margin-bottom: 10px;
}

.cyou-mm .cyou-mm-item-close {
position: absolute;
top: 15px;
right: 5px;
width: 30px;
height: 30px;
cursor: pointer;
}

.cyou-mm .ops-ctn {
margin-top: 12px;
}

.cyou-mm button + button {
margin-left: 12px;
}

.cyou-mm button {
height: 26px;
min-width: 60px;
text-align: center;
line-height: 24px;
background: none;
border: 1px solid #ccc;
border-radius: 13px;
}

.cyou-mm button:hover {
border-color: #18c984;
}

.cyou-mm .cyou-mm-context-menu {
padding: 10px;
background-color: rgba(0, 0, 0, .5);
text-align: center;
}

.cyou-mm .cyou-mm-context-menu-item{
color: #fff;
cursor: pointer;
}
.cyou-mm .cyou-mm-context-menu-item:hover{
font-weight: bold;
}
`
        const style = createDom('style', {
            type: 'text/css'
        })
        style.textContent = ret
        document.head.append(style)
    }

    createRootDom() {
        const root = createDom('div', {
            className: 'cyou-mm'
        })
        const title = createDom('div', {
            className: 'cyou-mm-vip-title',
            textContent: '右键点击会议室'
        })
        const list = createDom('ul', {
            className: 'cyou-mm-list'
        })
        const ops = createDom('div', {
            className: 'ops-ctn'
        })
        root.append(title, list, ops)
        this.rootDom = root
        this.listDom = list
        this.opsDom = ops
        document.body.append(root)
    }

    renderDynamicElements() {
        this.renderListItems()
        this.renderOpsBtns()
    }

    renderListItems() {
        while (this.listDom.firstChild) {
            this.listDom.removeChild(this.listDom.firstChild)
        }
        this.bookList.forEach(room => {
            this.listDom.appendChild(this.renderListItem(room))
        })

    }

    renderOpsBtns() {
        while (this.opsDom.firstChild) {
            this.opsDom.removeChild(this.opsDom.firstChild)
        }
        const opsEnable = this.bookList.length > 0
        // 没有选中会议室 or 已经预订完毕了, 都不显示操作按钮
        if (!opsEnable) {
            return
        }
        // 开启任务的时候
        if (!this.taskId && !this.isBooked) {
            const submitBtn = createDom('button', {
                textContent: '提交',
                onclick: () => this.handleSubmitClick()
            })
            const clearBtn = createDom('button', {
                textContent: '清空',
                disabled: !opsEnable,
                onclick: () => this.handleClearClick()
            })
            while (this.opsDom.firstChild) {
                this.opsDom.removeChild(this.opsDom.firstChild)
            }
            this.opsDom.append(submitBtn, clearBtn)
        } else if (!this.isBooked) {// 没有开启任务的时候
            // 渲染 mask 内容
            this.countDownDom = createDom('div', {className: 'cyou-mm-count-down-text'})
            const cancelBtnDom = createDom('button', {
                textContent: '停止预订',
                onclick: () => this.cancelBooking()
            })
            this.opsDom.append(this.countDownDom, cancelBtnDom)
        } else if(this.isBooked){// 任务执行结束
            // 渲染刷新页面按钮
            const freshBtnDom = createDom('button', {
                textContent: '点击刷新',
                onclick: () => document.location.reload()
            })
            this.opsDom.append(freshBtnDom)
        }
    }

    renderListItem(room) {
        const itemDom = createDom('li', {className: 'cyou-mm-item'})
        const nameDom = createDom('div', {className: 'cyou-mm-item-name', textContent: room.roomName})
        const timeDom = createDom('div', {className: 'cyou-mm-item-time', textContent: room.timeString})
        itemDom.append(nameDom, timeDom)
        if (!this.taskId && !this.isBooked) {
            const closeBtnDom = createDom('span', {
                className: 'cyou-mm-item-close icon iconfont-cancel-remind',
                title: '取消预订',
                onclick: () => this.removeBookList(room)
            })
            itemDom.append(closeBtnDom)
        }
        if (this.isBooked) {
            const statusDom = createDom('div', {className: 'cyou-mm-item-status', textContent: room.status})
            itemDom.append(statusDom)
        }
        return itemDom
    }

    startBooking() {
        // 开启倒计时任务
        this.startCountDown()
        this.renderDynamicElements()
    }

    cancelBooking() {
        // 停止倒计时任务
        this.stopCountDown()
        this.renderDynamicElements()
    }

    addBookList(room) {
        if (this.bookList.length >= 3) {
            alert('Cheap VIP 用户没有资格预订 3 个以上的会议室')
            return
        }
        if (this.bookList.some(r => (r.roomName === room.roomName && r.startTime === room.startTime))) {
            alert('room is in booking list')
        } else {
            this.bookList.push(room)
            this.renderDynamicElements()
        }
    }

    removeBookList(room) {
        this.bookList = this.bookList.filter(r => (r.roomName !== room.roomName || r.startTime !== room.startTime))
        this.renderDynamicElements()
    }

    handleVIPBookClick() {
        // 拿到被点击的会议室, 找到所有需要的预订信息,  日期, 时间, 会议室名称, 会议室 ID
        let bookObj = {
            room: null,
            startTime: '',
            timeString: '',
            dateString: '',
            roomName: ''
        }
        // 时间
        let timeDom = this.tmpActiveRoom.querySelector('.use .no-hover')
        let time = !!timeDom ? timeDom.textContent : ''
        bookObj.startTime = time
        timeDom = this.tmpActiveRoom.querySelector('.use .hover')
        time = !!timeDom ? timeDom.textContent : ''
        bookObj.timeString = time
        // 日期
        const dateDom = document.querySelector('.time-bar .header-bar .active span:first-child')
        let dateString = !!dateDom ? dateDom.textContent : ''
        dateString = dateString.split(' ')[0]
        bookObj.dateString = dateString
        // 会议室名称
        let roomDom = null
        let roomParentDom = this.tmpActiveRoom.parentNode
        while (!roomDom && !!roomParentDom) {
            roomDom = roomParentDom.querySelector('.meeting-list-item .info .title')
            roomParentDom = roomParentDom.parentNode
        }
        let roomName = !!roomDom ? roomDom.textContent.trim() : ''
        roomName = roomName.split(' ')[0].trim()
        // bookObj.description = "VIP 在" + roomName + "的会议室"
        bookObj.roomName = roomName
        // 会议室
        bookObj.room = this.roomList.find(r => (r.roomName === roomName))

        this.addBookList(bookObj)
    }

    handleSubmitClick() {
        this.startBooking()
    }

    handleClearClick() {
        this.bookList = []
        this.renderDynamicElements()
    }
}

class Mm {
    construct() {

    }

    static outdatedEngineClearance() {
        if (typeof Promise != 'function' || typeof MutationObserver != 'function') {
            alert('这个浏览器实在太老了，脚本决定罢工。')
            throw 'BiliTwin: browser outdated: Promise or MutationObserver unsupported'
        }
    }

    static async domContentLoadedThen(func) {
        if (document.readyState == 'loading') {
            return new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', () => resolve(func()), {once: true})
            })
        } else {
            return func()
        }
    }

    static infectXHR(ui) {
        XHRExtends.hookAjax({
            //拦截回调
            onreadystatechange: function (xhr) {
                if (xhr.readyState === 4 && /h5\/room\/query/.test(xhr.responseURL)) {
                    ui.updateRoomList(JSON.parse(xhr.response))
                }
            }
        })
    }

    static init() {
        if (!document.body) return
        Mm.outdatedEngineClearance()
        const ui = new UI()
        Mm.infectXHR(ui)
        ui.init()
    }
}

Mm.domContentLoadedThen(Mm.init)
