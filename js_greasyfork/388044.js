// ==UserScript==
// @name         掘金插件
// @namespace    https://github.com/zhukunpenglinyutong/Juejin-Plugin
// @version      1.0
// @description  掘金插件 - 赞文章分类功能
// @author       朱昆鹏
// @match        *://juejin.im/user/*
// @require https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388044/%E6%8E%98%E9%87%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/388044/%E6%8E%98%E9%87%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

let globalData = null; // 全局数据

// 实现一个简单的路由监听（监听跳转是否是主页）
window.addEventListener('load', function (e) {
    var reg = /https:\/\/juejin.im\/user/;
    if (reg.test(e.target.URL)) init(); // 如果进入主页，触发
})


// ============================================================================================
// ===================== 初始化部分：创建 点赞文章分类，等待点击事件触发 ==============================
// ============================================================================================

function init() {
    //（异步是因为有时候掘金网站加载太慢）
    setTimeout(() => {
        createMoreItem(); // 创建 点赞文章分类 div
        eventBus(); // 点击事件监听（并执行拿取数据 和 创建展示DOM的方法）
    }, 500)
}

// 创建 点赞文章分类 div
function createMoreItem() {
    let selectItems = document.querySelectorAll('.nav-item.not-in-scroll-mode .more-panel .more-item')
    let newA = selectItems[1].cloneNode() // 赋值节点
    newA.attributes.removeNamedItem('href') // 删除掉href跳转，因为就当个触发器使用
    newA.id = 'jSort'
    newA.innerText = '文章分类'
    selectItems[1].parentNode.appendChild(newA)
}

// 管理事件的函数
function eventBus() {
    let jSort = document.getElementById('jSort')
    jSort.addEventListener('click', async event => {
        let dialogId = document.getElementById('dialogId')

        if (dialogId) { // 已经点击过分类查看了，只是隐藏到了，这里避免重复拿取，浪费性能
          dialogId.style.display = 'inline';
        } else {
          let dataReq = new DataReq()
          let userId = location.pathname.match(/\w{24}/)[0]
          let res = await dataReq.getData(userId) // 获取数据
          createDOM(res) // 创建展示数据的DOM层
        }

    })
}



// ============================================================================================
// =================== 数据处理部分：逻辑处理部分（请求数据 && 处理数据） =============================
// ============================================================================================

// axios配置
let instance = axios.create({
    baseURL: 'https://user-like-wrapper-ms.juejin.im/v1/user/',
    timeout: 30000,
    headers: { "X-Juejin-Src": "web" }
});

// 数据请求类
class DataReq {

    constructor () {
    }

    /**
     * 请求数据（对外开放）
     * @param {String} userId
     */
    getData(userId) {

        console.log('userID', userId)

        return new Promise (async (resolve, reject) => {
            // 因为现成的掘金接口，一次只能拿到30个数据，如果点赞很多文章的话，我们需要拼接很多次请求才行
            // 思考一：等一个请求返回后，再把page的值增加，直到返回数组为空，不再进行请求，这样是个串行的
            // ✅ 思考二：在发送请求之前，先发送一个 page=0&pageSize=0 这时会返回你有多少点赞的文章数量，根据数量这个就能获取到需要发送的次数，这个是并行的

            let that = this

            // 根据返回的数组，建立对应数量的axios请求
            let totalArr = await this.getTotal(userId)
            let aixosArr = totalArr.map(item => instance.get(item))


            axios.all(aixosArr)
                .then(axios.spread( function () {
                let arr = []
                for (let i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i].data.d.entryList)
                }
                let resData = that.dataHandle(arr.flat())
                resolve(resData) // 经过处理类处理后的数据
            }));
        })

    }


    /**
     * 请求page=0&pageSize=0 结果用于生成多次axios请求（原因是掘金接口一次拿不到全部点赞数据，上限是30）
     * （内部使用）
     * @param { String } 用户ID
     * @return { Array } ['请求地址一', '', ...]
     */
    getTotal(userId) {
        return new Promise((resolve, reject) => {

            instance.get(`${userId}/like/entry?page=0&pageSize=0`)
                .then(res => {

                let len = Math.ceil(res.data.d.total/30),
                    arr = [];

                for (let i = 0; i < len; i++) {
                    arr.push(`${userId}/like/entry?page=${i}&pageSize=30`)
                }

                resolve(arr)
            })
                .catch(e => {
                reject(e)
            })

        })
    }


    /**
     * 数据处理函数（内部使用）(此处代码写的不好qwq)
     */
    dataHandle (data) {
        let countedNames = data
        .map( item => item.tags.map(jtem => jtem.title ) )
        .flat(Infinity)
        .reduce((allNames, name) => {
            if (name in allNames) {
                allNames[name]++;
            } else {
                allNames[name] = 1;
            }
            return allNames;
        }, {})
        // ['Vue.js', 'Vue.js', '...', ...] ===> [ { name: 'Vue.js', num: 6}, {'Jquery': 4}, {} ]

        let resArr = []
        for (let prop in countedNames) {
            resArr.push({
                name: prop,
                num: countedNames[prop],
                data: []
            })
        }

        resArr.sort((a, b) =>  b.num - a.num); // 按照数量排序

        // 第二部分：
        // 获取 所有值
        let aaa = data.map( item => {
            return {
                title: item.title,
                originalUrl: item.originalUrl,
                username: item.user.username,
                objectId: `https://juejin.im/user/${item.user.objectId}`,
                tags: item.tags.map( j => j.title )
            }
        })


        // 整成想要的格式
        resArr.forEach( item => {
            aaa.forEach( jtem => {
                jtem.tags.some( j => j === item.name) ? item.data.push(jtem) : ''
            })
        })

        return resArr
    }

}



// ============================================================================================
// ========================= DOM生成层，根据数据生成对应的弹出层和交互  =============================
// ============================================================================================

const createDOM = (res) => {
    globalData = res

    // 响应式监听属性，响应点击标签时候的视图切换
    let observeData = {
        select: '' // 当前选中的分类名称
    }

    renderBasic() // 渲染弹出框基本结构
    defineReactive(observeData, 'select', observeData.select) // 监听响应式
    observeData.select = res[0].name // 初始化，渲染第一个分类中的数据
    createDOMEventBus(observeData) // 启动事件监听
}

// 渲染弹出框基本结构
function renderBasic() {

    let dialogMianItem = '' // 根据数据，生成底部导航栏结构
    globalData.forEach( item => {
      dialogMianItem += `<div class="dialog-mian-item" style="position: relative;margin-right: 25px;">
                <button class="dialogBtn" style="padding: 9px 15px;font-size: 12px;border-radius: 3px;min-width: 100px;">${item.name}</button>
                <sup style="position: absolute;top: 0;right: 10px;transform: translateY(-50%) translateX(100%);background-color: #f56c6c;border-radius: 10px;color: #fff;display: inline-block;font-size: 12px;height: 18px;line-height: 18px;padding: 0 6px;text-align: center;white-space: nowrap;">
                  ${item.num}
                </sup>
              </div>`
    })


    // 创建弹出层
    let div = document.createElement('div')
    div.id = 'dialogId'
    // 模板中展示的内容
    div.innerHTML = `
      <div class="dialog"
        style="margin: 15vh auto 50px;width: 60vw;height: 600px;background: #fff;opacity: 1;border-radius: 2px;box-shadow: 0 1px 3px rgba(0,0,0,.3);box-sizing: border-box;">
        <div class="dialog-header" style="padding: 20px 20px 10px;line-height: 24px;font-size: 18px;color: #303133;margin-bottom: 15px;display: flex;justify-content: space-between;">
          <div>文章分类 <input style="margin-left: 10px;" disabled value="搜索功能8.1日开放" /> </div>
          <div id="dialog-close" style="cursor: pointer;">X</div>
        </div>
        <div class="dialog-mian">
          <div class="dialog-mian" style="padding: 0 22px;">
            <div class="dialog-mian-lang" style="display: flex;justify-content: space-between;padding-top: 12px;overflow-y: auto;">${dialogMianItem}</div>
            <div class="dialog-content" style="margin-top: 10px;height: 430px;overflow-y: auto;">

            </div>
          </div>
        </div>
      </div>
    `
    let body = document.querySelector('body')
    div.style = `position: fixed;height: 100vh;width: 100vw;top: 0;left: 0;z-index: 1000;`
    body.appendChild(div)
}

// 生成详细文章列表
function createDialogContent(selectName) {

  let randerData = globalData.filter( item => item.name === selectName)[0].data
  let dialogContent = document.querySelector('.dialog-content')

  let dialogContentText = ''; // 具体一行行内容
  // 当前点击展示的内容
  randerData.forEach(item => {
      let aStr = ''
      item.tags.forEach( tag => {
        aStr += `<a href="javascript:;">${tag} · </a>`
      })
      dialogContentText += `
                <div class="dialog-content_item" style="margin: 18px 0px;border-bottom: 1px solid rgba(178,186,194,.15);">
                   <div class="meta-row">
                      <a href="${item.objectId}">${item.username}</a> · ${aStr}
                   </div>
                   <div class="title" style="margin-top: 6px;"><a href="${item.originalUrl}" style="font-size: 16px;color: #2E3135;">${item.title}</a></div>
                </div>`
  })

  dialogContent.innerHTML = dialogContentText
}

// 事件总线
function createDOMEventBus (observeData) {
    // 点击切换事件（采用事件冒泡，进行捕获）
    let btns = document.querySelector('.dialog-mian-lang')
    btns.addEventListener('click', function (e) {
      console.log(e)
      if (e.target.nodeName === 'BUTTON') observeData.select = e.target.textContent;
    })

    // 点击关闭按钮
    let dialogClose = document.getElementById('dialog-close')
    let dialogId = document.getElementById('dialogId')
    dialogClose.addEventListener('click', function () {
        console.log('触发')
       dialogId.style.display = 'none'
    })
}


// ============================================================================================
// ========================== 实现简单数据监听，用来简化DOM操作（朱昆鹏）  ===========================
// ============================================================================================

// 数据劫持
function defineReactive (obj, key, value) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,

        get () {
           return value
        },

        set (newValue) {
           value = newValue
           createDialogContent(value) // 更新视图 (生成详细文章列表)
        }
    })
}

































