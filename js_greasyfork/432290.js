/* eslint-disable no-unused-vars */
/* eslint-disable no-extra-semi */
/* eslint-disable no-console */
// ==UserScript==
// @name         新浪微博(新版)一键删除、清空助手
// @namespace    https://greasyfork.org/zh-CN/users/812943
// @version      0.0.7
// @description  一键批量删除微博、取消关注、删除粉丝、删除点赞记录
// @author       gafish
// @match        https://weibo.com/*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432290/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%28%E6%96%B0%E7%89%88%29%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E3%80%81%E6%B8%85%E7%A9%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/432290/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%28%E6%96%B0%E7%89%88%29%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E3%80%81%E6%B8%85%E7%A9%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const jq = window.jQuery

  const HELPER_NAME = '微博一键清空助手'
  const TOKEN = jq.cookie('XSRF-TOKEN')
  const WB_CONFIG = window.$CONFIG
  const UID = WB_CONFIG.uid
  const USER = WB_CONFIG.user

  const showNewWeoboTip = () => {
    const newWeiboEntry = jq('a[action-type="changeversion"]')

    if (!newWeiboEntry[0]) {
      return setTimeout(showNewWeoboTip, 500)
    }

    const tip = jq('<div />')

    tip
      .css({
        position: 'fixed',
        top: 70,
        left: 10,
        width: 200,
        height: 30,
        color: '#f00',
        background: '#fff',
        border: '1px solid #f00',
        lineHeight: '30px',
        textAlign: 'center',
        cursor: 'pointer',
      })
      .text('当前是旧版，是否切换到新版？')
      .click(() => {
        if (newWeiboEntry[0]) {
          newWeiboEntry[0].click()
        }
      })

    jq('#plc_frame').append(tip)
  }

  if (!USER) {
    return showNewWeoboTip()
  }

  const STATUSES_COUNT = USER.statuses_count
  const FRIENDS_COUNT = USER.friends_count
  const FOLLOWERS_COUNT = USER.followers_count
  const URL_PREFIX = 'https://weibo.com/u'
  const c_app = jq('#app')
  const c_menu = jq('<div />')
  const c_notice = jq('<div />')
  const c_btn = jq('<div />')

  if (!UID) return

  // 当前删除页码
  let deletePage
  // 已删除数
  let deletedCount
  // 停止清空
  let stop
  // 折叠菜单
  let fold

  const utils = {
    // alert fail
    alertFail: (jqXHR, textStatus, errorThrown) => {
      var error = '状态码:' + jqXHR.status + ',异常:' + errorThrown
      alert('读取数据失败,请稍后重试\n' + error)
    },

    // 检查是否在当前页
    checkURL: (url, title) => {
      const isCurrent = window.location.href.indexOf(url) !== -1

      if (!isCurrent) {
        const r = confirm('当前操作需要前往 ' + title + ' 页面，是否跳转？')

        if (r === true) {
          window.location.href = url
        }
      }

      return isCurrent
    },

    // 输出提示信息
    showNotice: html => {
      c_notice.show().html(`
        <div style="padding: 5px;">
          ${html}
        </div>
      `)
    },

    // 显示删除进度
    showDeleteNotice: (count, no) => {
      if (count === null) {
        utils.showNotice(`
          <div>
            <div>正在删除第 ${deletePage} 页，第 ${no} 条</div>
          </div>
        `)
      } else {
        // 剩余数
        const remain = count - deletedCount

        utils.showNotice(`
          <div>
            <div>总共 ${count} 条</div>
            <div style="border-bottom 1px solid #000;">剩余 ${remain} 条</div>
            <div>正在删除第 ${deletePage} 页，第 ${no} 条</div>
          </div>
        `)
      }
    },

    // log
    log: (...args) => {
      console.log(`${HELPER_NAME}:`, ...args)
    },

    // 串行Promise
    serialPromise: (promises, callback) => {
      let i = 0

      const next = () => {
        if (i < promises.length) {
          promises[i++]().then(next)
        } else {
          callback()
        }
      }

      next()
    },
  }

  utils.log('微博 token = ', TOKEN)
  utils.log('window.$CONFIG =', WB_CONFIG)
  utils.log('uid = ' + UID)

  // 重置
  const reset = () => {
    deletePage = 0
    deletedCount = 0
    stop = false
    fold = false
  }

  // 结束
  const end = () => {
    utils.log('删除完成')
    utils.showNotice('删除完成')
    c_btn.hide()

    setTimeout(() => {
      const r = confirm('已清空，是否刷新页面？')

      if (r === true) {
        location.reload()
      }
    }, 100)
  }

  /** ===== 清空微博 ===== */

  // 清空微博
  const cleanWeibo = () => {
    if (!utils.checkURL(URL_PREFIX + '/' + UID, '我的主页')) return

    const r = confirm('想清楚了吗？这是要清空所有微博哦，确定吗？')

    if (r === true) {
      reset()

      c_btn.show()
      utils.showNotice('马上开始删除微博')

      getWeiboList()
    }
  }

  // 获取微博列表
  const getWeiboList = (page = 1) => {
    if (stop) return

    jq.ajax({
      url: '/ajax/statuses/mymblog?uid=' + UID + '&page=' + page + '&feature=0',
      type: 'GET',
      dataType: 'json',
    })
      .done(function (res) {
        utils.log('获取微博分页', res)
        if (res && res.data && res.data.list) {
          if (res.data.list.length === 0) {
            // 如果第2页也没有，则结束
            if (page === 2) {
              end()
            } else {
              // 第1页没有微博，有可能是微博bug，去第2页看看
              getWeiboList(2)
            }

            return
          }

          deletePage++

          utils.log('第 ', deletePage, ' 页')

          // 循环promise
          const promisesTask = res.data.list.map((item, index) => {
            return () =>
              new Promise(resolve => {
                const oriMid = item.ori_mid
                const id = item.id
                const no = index + 1

                if (stop) return

                utils.log('待删除微博', no, id)
                utils.showDeleteNotice(STATUSES_COUNT, no)

                if (oriMid) {
                  // 删除快转
                  deleteWeibo(oriMid).done(resolve)
                } else {
                  // 正常删除
                  deleteWeibo(id).done(resolve)
                }
              })
          })

          utils.serialPromise(promisesTask, () => {
            setTimeout(() => {
              getWeiboList()
            }, 2000)
          })
        }
      })
      .fail(utils.alertFail)
  }

  // 删除微博
  const deleteWeibo = id => {
    const postData = { id: id }

    return jq
      .ajax({
        url: '/ajax/statuses/destroy',
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        dataType: 'json',
        headers: {
          'x-xsrf-token': TOKEN,
        },
        data: JSON.stringify(postData),
      })
      .done(function (res) {
        deletedCount++
        utils.log('已删除微博', id, res)
      })
      .fail(utils.alertFail)
  }

  /** ===== 清空关注列表 ===== */

  // 清空关注列表
  const cleanFollow = () => {
    if (!utils.checkURL(URL_PREFIX + '/page/follow/' + UID, '我的关注')) return

    const r = confirm('想清楚了吗？这是要清空所有关注的人哦，确定吗？')

    if (r === true) {
      reset()

      c_btn.show()
      utils.showNotice('马上开始删除关注用户')

      getFollowList()
    }
  }

  // 获取微博关注列表
  const getFollowList = () => {
    if (stop) return

    jq.ajax({
      url: '/ajax/friendships/friends?uid=' + UID + '&page=1',
      type: 'GET',
      dataType: 'json',
    })
      .done(function (res) {
        utils.log('获取微博关注分页', res)
        if (res && res.users) {
          if (res.users.length === 0) {
            return end()
          }

          deletePage++

          utils.log('第 ', deletePage, ' 页')

          // 循环promise
          const promisesTask = res.users.map((item, index) => {
            return () =>
              new Promise(resolve => {
                setTimeout(() => {
                  const id = item.id
                  const no = index + 1

                  if (stop) return

                  utils.log('待删除关注用户', no, id)
                  utils.showDeleteNotice(FRIENDS_COUNT, no)
                  deleteFollow(id).done(resolve)
                }, Math.random() * 500 + 500)
              })
          })

          utils.serialPromise(promisesTask, () => {
            setTimeout(() => {
              getFollowList()
            }, 1000)
          })
        }
      })
      .fail(utils.alertFail)
  }

  // 取消关注
  const deleteFollow = id => {
    const postData = { uid: id }

    return jq
      .ajax({
        // 注：微博接口单词拼写错误，应该是 destroy
        url: '/ajax/friendships/destory',
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        dataType: 'json',
        headers: {
          'x-xsrf-token': TOKEN,
        },
        data: JSON.stringify(postData),
      })
      .done(function (res) {
        deletedCount++
        utils.log('已取消关注', id, res)
      })
      .fail(utils.alertFail)
  }

  /** ===== 清空粉丝列表 ===== */

  // 清空粉丝列表
  const cleanFans = () => {
    const url = URL_PREFIX + '/page/follow/' + UID + '?relate=fans'

    if (!utils.checkURL(url, '我的粉丝')) return

    const r = confirm('想清楚了吗？这是要清空所有关注的人哦，确定吗？')

    if (r === true) {
      reset()

      c_btn.show()
      utils.showNotice('马上开始移除粉丝')

      getFansList()
    }
  }

  // 获取微博粉丝列表
  const getFansList = () => {
    if (stop) return

    jq.ajax({
      url: '/ajax/friendships/friends?uid=' + UID + '&relate=fans&page=1',
      type: 'GET',
      dataType: 'json',
    })
      .done(function (res) {
        utils.log('获取微博粉丝分页', res)
        if (res && res.users) {
          if (res.users.length === 0) {
            return end()
          }

          deletePage++

          utils.log('第 ', deletePage, ' 页')

          // 循环promise
          const promisesTask = res.users.map((item, index) => {
            return () =>
              new Promise(resolve => {
                setTimeout(() => {
                  const id = item.id
                  const no = index + 1

                  if (stop) return

                  utils.log('待删除粉丝', no, id)
                  utils.showDeleteNotice(FOLLOWERS_COUNT, no)
                  deleteFans(id).done(resolve)
                }, Math.random() * 500 + 500)
              })
          })

          utils.serialPromise(promisesTask, () => {
            setTimeout(() => {
              getFansList()
            }, 1000)
          })
        }
      })
      .fail(utils.alertFail)
  }

  // 移除粉丝
  const deleteFans = id => {
    const postData = { uid: id }

    return jq
      .ajax({
        url: '/ajax/profile/destroyFollowers',
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        dataType: 'json',
        headers: {
          'x-xsrf-token': TOKEN,
        },
        data: JSON.stringify(postData),
      })
      .done(function (res) {
        deletedCount++
        utils.log('已删除粉丝', id, res)
      })
      .fail(utils.alertFail)
  }

  /** ===== 清空赞列表 ===== */

  // 清空赞列表
  const cleanLike = () => {
    const url = URL_PREFIX + '/page/like/' + UID

    if (!utils.checkURL(url, '我的赞')) return

    const r = confirm('想清楚了吗？这是要清空所有的赞哦，确定吗？')

    if (r === true) {
      reset()

      c_btn.show()
      utils.showNotice('马上开始移除赞')

      getLikeList()
    }
  }

  // 获取微博赞列表
  const getLikeList = () => {
    if (stop) return

    // 微博好像有bug，第1页的赞被删除后，后面的列表就无法显示，所以暂时不删除第1页数据
    if (deletePage === 0) {
      deletePage = 1
    }

    jq.ajax({
      url: '/ajax/statuses/likelist?uid=' + UID + '&relate=fans&page=1',
      type: 'GET',
      dataType: 'json',
    })
      .done(function (res) {
        utils.log('获取微博赞分页', res)
        if (res && res.data && res.data.list) {
          if (res.data.list.length === 0) {
            return end()
          }

          deletePage++

          utils.log('第 ', deletePage, ' 页')

          // 循环promise
          const promisesTask = res.data.list.map((item, index) => {
            return () =>
              new Promise(resolve => {
                setTimeout(() => {
                  const id = item.id
                  const no = index + 1

                  if (stop) return

                  utils.log('待删除赞', no, id)
                  utils.showDeleteNotice(null, no)
                  deleteLike(id).done(resolve)
                }, Math.random() * 500 + 500)
              })
          })

          utils.serialPromise(promisesTask, () => {
            setTimeout(() => {
              getLikeList()
            }, 1000)
          })
        }
      })
      .fail(utils.alertFail)
  }

  // 移除赞
  const deleteLike = id => {
    const postData = { id: String(id) }

    return jq
      .ajax({
        url: '/ajax/statuses/cancelLike',
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        dataType: 'json',
        headers: {
          'x-xsrf-token': TOKEN,
        },
        data: JSON.stringify(postData),
      })
      .done(function (res) {
        deletedCount++
        utils.log('已删除赞', id, res)
      })
      .fail(utils.alertFail)
  }

  /** ===== 清空收藏列表 ===== */

  // 清空收藏列表
  const cleanFav = () => {
    const url = URL_PREFIX + '/page/fav/' + UID

    if (!utils.checkURL(url, '我的收藏')) return

    const r = confirm('想清楚了吗？这是要清空所有的 收藏 哦，确定吗？')

    if (r === true) {
      reset()

      c_btn.show()
      utils.showNotice('马上开始移除收藏')

      getFavList()
    }
  }

  // 获取微博收藏列表
  const getFavList = () => {
    if (stop) return

    jq.ajax({
      url: '/ajax/favorites/all_fav?uid=' + UID + '&page=1',
      type: 'GET',
      dataType: 'json',
    })
      .done(function (res) {
        utils.log('获取微博收藏分页', res)
        if (res && res.data) {
          if (res.data.length === 0) {
            return end()
          }

          deletePage++

          utils.log('第 ', deletePage, ' 页')

          // 循环promise
          const promisesTask = res.data.map((item, index) => {
            return () =>
              new Promise(resolve => {
                setTimeout(() => {
                  const id = item.id
                  const no = index + 1

                  if (stop) return

                  utils.log('待删除收藏', no, id)
                  utils.showDeleteNotice(null, no)
                  deleteFav(id).done(resolve)
                }, Math.random() * 500 + 500)
              })
          })

          utils.serialPromise(promisesTask, () => {
            setTimeout(() => {
              getFavList()
            }, 1000)
          })
        }
      })
      .fail(utils.alertFail)
  }

  // 移除收藏
  const deleteFav = id => {
    const postData = { id: String(id) }

    return jq
      .ajax({
        url: '/ajax/statuses/destoryFavorites',
        contentType: 'application/json;charset=UTF-8',
        type: 'POST',
        dataType: 'json',
        headers: {
          'x-xsrf-token': TOKEN,
        },
        data: JSON.stringify(postData),
      })
      .done(function (res) {
        deletedCount++
        utils.log('已删除收藏', id, res)
      })
      .fail(utils.alertFail)
  }

  /** ===== 初始化 ===== */

  // 初始化菜单
  const initMenu = () => {
    // 菜单列表
    const menuList = [
      {
        text: '清空微博',
        onClick: cleanWeibo,
      },
      {
        text: '清空关注',
        onClick: cleanFollow,
      },
      {
        text: '清空粉丝',
        onClick: cleanFans,
      },
      {
        text: '清空收藏',
        onClick: cleanFav,
      },
      {
        text: '清空赞',
        onClick: cleanLike,
      },
    ]
    // 生成菜单
    c_menu.css({
      position: 'fixed',
      top: 80,
      left: 10,
    })

    const hideBtn = jq('<div>')

    hideBtn
      .css({
        width: 40,
        height: 20,
        background: '#fff',
        border: '1px solid #f00',
        cursor: 'pointer',
        lineHeight: '20px',
        textAlign: 'center',
        fontSize: 12,
      })
      .text('收起')
      .click(() => {
        fold = !fold

        if (fold) {
          hideBtn.text('展开')
          container.hide()
        } else {
          hideBtn.text('收起')
          container.show()
        }
      })

    const container = jq('<div>')

    container.css({
      width: 140,
      border: '3px solid #f00',
      background: '#fff',
      zIndex: 9999,
      fontSize: 14,
      textAlign: 'center',
    })

    menuList.forEach((item, index) => {
      const div = jq(`<div>${item.text}</div>`)

      div.css({
        cursor: 'pointer',
        padding: '5px 10px',
        borderTop: index === 0 ? '' : '1px solid #f00',
      })

      div.click(() => {
        if (item.onClick) item.onClick()
      })

      container.append(div)
    })

    c_menu.append(hideBtn)
    c_menu.append(container)
    c_app.append(c_menu)
  }

  // 初始化按钮
  const initBtn = () => {
    // 生成按钮
    c_btn.css({
      display: 'none',
      position: 'fixed',
      top: 70,
      right: 10,
      width: 140,
      height: 25,
      border: '1px solid #0f0',
      background: '#fff',
      zIndex: 9999,
      fontSize: 14,
      textAlign: 'center',
      cursor: 'pointer',
    })

    c_btn.text('停止').click(() => {
      stop = true
      c_btn.hide()
      c_notice.hide()
      utils.log('已停止操作')
    })

    c_app.append(c_btn)
  }

  // 初始化提示框
  const initNotice = () => {
    // 生成提示框
    c_notice.css({
      display: 'none',
      position: 'fixed',
      top: 100,
      right: 10,
      width: 140,
      border: '1px solid #00f',
      background: '#fff',
      zIndex: 9999,
      fontSize: 14,
      textAlign: 'center',
    })

    c_app.append(c_notice)
  }

  // 初始化
  const init = () => {
    reset()
    initMenu()
    initBtn()
    initNotice()
  }

  init()
})()
