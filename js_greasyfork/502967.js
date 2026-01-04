// ==UserScript==
// @name         视频倍速播放(百度、华为)
// @description  简单的倍速播放脚本，基于 (https://github.com/vikiboss) 开发
// @version      1.6.6
// @author       qiphon (https://github.com/qiphon)
// @create       2020/6/15
// @lastmodified 2024/9/12
// @feedback-url https://github.com/Vikiboss/baidupan-playspeed-control/issues
// @icon         https://i.loli.net/2020/06/19/eWDyG1RhCBkTINl.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/502967-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE
// @github       https://github.com/vikiboss/baidupan-playspeed-control
// @namespace    baidupan-playspeed-control
// @license      MIT
// @run-at       document-end
// @grant        none
// @include      *://pan.baidu.com/s*
// @include      *://pan.baidu.com/p*
// @include      *://yun.baidu.com/s*
// @include      *://pan.baidu.com/m*
// @include      *://pan.baidu.com/play*
// @include      *://pan.baidu.com/disk/home*
// @include      *://yun.baidu.com/disk/home*
// @include      https://www.bitget.fit/zh-CN/academy/video/*
// @include      https://developer.huawei.com/consumer/cn/training/course/slightMooc/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert@2.1.2/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/502967/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%28%E7%99%BE%E5%BA%A6%E3%80%81%E5%8D%8E%E4%B8%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502967/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%28%E7%99%BE%E5%BA%A6%E3%80%81%E5%8D%8E%E4%B8%BA%29.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // === 随窗口加载后调用本方法 ===
  window.onload = function () {
    // === 按钮集 ===
    let options = [
      { str: 'x0.5', rate: 0.5 },
      { str: 'x1.0', rate: 1.0 },
      { str: 'x1.5', rate: 1.5 },
      { str: 'x1.8', rate: 1.8 },
      { str: 'x2.0', rate: 2.0 },
      { str: '加速' },
      { str: '减速' },
      { str: '自定义' },
      { str: '设置' },
      { str: '关于' },
    ]
    let player // 播放区节点
    let label // 显示倍速label
    let vip_div // svip提示框
    let btn_div // 按钮容器
    let settings = {
      preRate: 1.0,
      curRate: 1.0,
      saveRate: true,
      showAlert: true,
    } // 默认全局配置
    let cur_version = '1.6.2'
    let last_updated = '2021/3/9'

    // === 声明读取配置的函数 ===
    let getSettings = () => {
      settings.preRate = Number(
        localStorage.getItem('preRate') ? localStorage.getItem('preRate') : 1.0,
      ).toFixed(1)
      settings.curRate = Number(
        localStorage.getItem('curRate') ? localStorage.getItem('curRate') : 1.0,
      ).toFixed(1)
      settings.showAlert = JSON.parse(
        localStorage.getItem('showAlert')
          ? localStorage.getItem('showAlert')
          : true,
      )
      settings.saveRate = JSON.parse(localStorage.getItem('saveRate'))
    }

    // === 页面加载完后读取配置 ===
    if (!localStorage.hasOwnProperty('saveRate')) {
      settings.saveRate = true
      localStorage.setItem('saveRate', settings.saveRate)
    }
    getSettings()
    if (settings.saveRate) {
      settings.curRate = settings.preRate
      localStorage.setItem('curRate', settings.preRate)
    } else {
      settings.curRate = 1.0
    }

    // === 判断倍速是否为有效倍速的函数 ===
    let checkRate = rate => {
      if (rate === '' || rate === null) return false
      rate = Number(rate)
      return rate <= 0 || rate > 5 || isNaN(rate) ? false : true
    }

    // === 定义修改播放倍速的函数 ===
    let setRate = (rate, player) => {
      if (settings.saveRate) {
        settings.preRate = rate
        localStorage.setItem('preRate', settings.preRate)
      }
      let curRate = player.playbackRate
      rate = Number(rate || curRate)
      if (!checkRate(rate)) return false
      label.innerText = `当前: ${Number(rate).toFixed(1)}${
        Number(settings.curRate) > 2 ? '(>2容易卡顿)' : ''
      }`
      player.playbackRate = rate
      settings.curRate = rate
      localStorage.setItem('curRate', settings.curRate)
      localStorage.setItem('showAlert', settings.showAlert)
      return true
    }

    // === 定时器，定期检查倍速 ===  // 别问我为什么这么写，问就是我太菜了QAQ
    const check = () => {
      if (
        location.href.includes(
          'https://developer.huawei.com/consumer/cn/training/course/slightMooc',
        )
      ) {
        // for huawei video
        const videoEl = document.querySelector('video.vjs-tech')
        if (videoEl) {
          player = videoEl
        }
      } else {
        const videoEl = document.querySelector('video.vjs-tech')
        if (videoEl) {
          player = videoEl
        }
      }
      if (player) {
        setRate(settings.curRate, player)
      }
    }
    setInterval(check, 1000)

    // === 定义生成"倍速按钮"的函数 ===
    let generateBtn = (rateStr, rate) => {
      let btn = $(`<a class="g-button" title=${rateStr}></a>`)[0]
      rate = rate || 1.0
      btn.onclick = () => {
        if (rateStr === '关于') {
          // "关于"弹窗
          let about = $(`<div>
                <a target="_blank" href="https://greasyfork.org/zh-CN/scripts/502967-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE">检查更新🔨</a> <br />
                <a target="_blank" href="https://greasyfork.org/zh-CN/scripts/502967-%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE-%E7%99%BE%E5%BA%A6-%E5%8D%8E%E4%B8%BA/feedback#post-discussion">去GreasyFork反馈🔗</a><br />
                <a target="_blank" href="https://qiphon.blog.csdn.net/">作者博客</a> 
              </div>
              `)[0]
          swal({
            title: '关于',
            text: `当前版本:  ${cur_version}\n更新时间:  ${last_updated}\n脚本作者:  Viki`,
            content: about,
          })
          return
        }
        if (!player) {
          swal({
            text: '视频控件还未初始化完成哦👀',
            icon: 'error',
            buttons: false,
            timer: 1000,
          })
          return
        }
        let curRate = player.playbackRate

        // 判断options提供的字符串并对rate进行相应操作
        if (rateStr === '设置') {
          // "设置"弹窗
          let set = $(
            `<div>
              <input id="saveRate" type="checkbox" ${
                settings.saveRate ? 'checked' : ''
              }><span> 记忆历史播放倍速</span><br />
              <input id="showAlert" type="checkbox" ${
                settings.showAlert ? 'checked' : ''
              }><span> 显示倍速提示弹窗</span>
              </div>`,
          )[0]
          swal({
            title: '设置 - 倍速播放',
            content: set,
            buttons: {
              cancel: '取消',
              save: { text: '保存', value: 'save' },
            },
          }).then(btn => {
            if (btn === 'save') {
              settings.saveRate = $('#saveRate')[0].checked
              settings.showAlert = $('#showAlert')[0].checked
              localStorage.setItem('saveRate', $('#saveRate')[0].checked)
              localStorage.setItem('showAlert', $('#showAlert')[0].checked)
              settings.preRate = 1.0
              localStorage.setItem('preRate', 1.0)
              swal({
                text: '保存成功',
                icon: 'success',
                buttons: false,
                timer: 1000,
              })
            }
          })
          return
        } else if (rateStr === '自定义') {
          // "自定义"弹窗
          swal({
            title: '提示',
            content: {
              element: 'input',
              attributes: {
                placeholder: '选择一个自定义(0-5)的播放倍速叭(～￣▽￣)～',
                type: 'text',
              },
            },
            buttons: ['取消', '确认'],
          }).then(new_rate => {
            if (checkRate(new_rate)) {
              settings.curRate = new_rate || curRate
              localStorage.setItem('curRate', settings.curRate)
              const extraMsg =
                '\n由于网络原因等，大于两倍速可能会出现明显卡顿哦！'
              if (settings.showAlert) {
                swal({
                  text: `成功设置播放速度为${Number(new_rate).toFixed(1)}${
                    new_rate > 2 ? extraMsg : ''
                  }`,
                  icon: 'success',
                  buttons: false,
                  timer: new_rate > 2 ? 3000 : 1000,
                })
              }
            } else {
              if (new_rate === null) return
              swal({
                text: `${
                  new_rate || '你输入的'
                }不是一个指定范围内的有效数字哦＞﹏＜`,
                icon: 'error',
                buttons: false,
                timer: 1000,
              })
            }
          })
        } else if (rateStr === '加速') {
          settings.curRate = curRate + 0.1
          check()
        } else if (rateStr === '减速') {
          settings.curRate = curRate - 0.1
          check()
        } else {
          settings.curRate = rate
          if (settings.showAlert) {
            swal({
              text: `成功设置播放速度为${Number(rate).toFixed(1)}`,
              icon: 'success',
              buttons: false,
              timer: 1000,
            })
          }
        }
      }

      // === 补充按钮内部文本与样式 ===
      let btnInnerHtml = `<span class="g-button-right">
                <em class="icon icon-speed"></em>
                <span class="text" style="width: auto;">${rateStr}</span>
              </span>`
      btn.innerHTML = btnInnerHtml
      btn.style.userSelect = 'none'
      return btn
    }

    const container = document.createElement('div')
    container.className = 'qiphon_playrate'
    document.body.append(container)
    // === 插入倍速按钮集 ===
    if ($('.video-toolbar-buttonbox')[0]) {
      btn_div = $('.video-toolbar-buttonbox')[0]
    } else {
      btn_div = container
      btn_div.innerHTML = ''
      btn_div.setAttribute(
        'style',
        `
          position: fixed;
          top: 0;
          right:0;
          background: #fff;
          font-size: 14px;
          min-width: 400px;
          padding: 8px;
          z-index: 99999999;
          overflow: visible;
          opacity: 0.8;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 8px;
          transition: all 0s cubic-bezier(0, 0, 0, 1.46) .5s;
        `,
      )
    }
    let btns = options.map(option => generateBtn(option.str, option.rate))
    btn_div.append(...btns)

    // === 加入倍速显示 ===
    if (!settings.saveRate) settings.curRate = 1
    label = $(
      `<span>当前: ${Number(settings.curRate).toFixed(1)}${
        Number(settings.curRate) > 2 ? '(>2容易卡顿)' : ''
      }</span>`,
    )[0]
    $(label).css({
      color: '#09aaff',
      'font-size': '18px',
      display: 'inline-block',
      margin: '5px',
      cursor: 'pointer',
    })

    $(label).attr('title', '点击收起')

    $(label).click(function () {
      const stateCls = 'min_size'
      if (!$('.qiphon_playrate').hasClass(stateCls)) {
        $('.qiphon_playrate').css({
          'min-width': '70px',
          width: '70px',
          height: '70px',
          overflow: 'hidden',
        })
        $('.g-button').hide()
      } else {
        $('.g-button').show()
        $('.qiphon_playrate').css({
          'min-width': '400px',
          height: 'auto',
          overflow: 'visible',
        })
      }
      $('.qiphon_playrate').toggleClass(stateCls)
    })

    btn_div.append(label)

    // === 去除多余元素 调整布局 ===
    let other_div
    if ($('.video-other-video')[0]) {
      other_div = $('.video-other-video')[0]
      other_div.style.paddingTop = '50px'
      vip_div = $('.privilege-box')[0]
      vip_div.parentNode.removeChild(vip_div)
      btn_div.removeChild(btn_div.childNodes[1])
      btn_div.removeChild(btn_div.childNodes[1])
      btn_div.removeChild(btn_div.childNodes[1])
    }
  }
})()
