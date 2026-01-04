// ==UserScript==
// @name         多邻国选词快捷键
// @namespace    http://tampermonkey.net/
// @version      2024-09-27
// @description  使用快捷键刷多邻国. 在主页面使用回车键或l键快速开始学习;在学习页使用ctrl键播放语音, 使用回车键为选词添加序号,退格键删除选词,删除键删除全部选词. 如果官方和脚本的快捷键无法正常使用, 需要在`vimium-c`等快捷键相关插件中排除多邻国网站. 如果发生无法输入文字的情况可以尝试在网页限制解除/文本选中复制相关脚本中排除多邻国网站
// @author       v, popozhu
// @match        https://www.duolingo.cn/*
// @match        https://www.duolingo.com/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493966/%E5%A4%9A%E9%82%BB%E5%9B%BD%E9%80%89%E8%AF%8D%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/493966/%E5%A4%9A%E9%82%BB%E5%9B%BD%E9%80%89%E8%AF%8D%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

if (typeof GM_addStyle == 'undefined') {
  function GM_addStyle(aCss) {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}

// 序号样式
GM_addStyle(`.p_item_tip {
color: dodgerblue;
display: flex; justify-content: center; align-items: center;
margin-left: 12px;
border: 1px solid rgb(var(--color-swan));
border-radius: 8px;
color: rgb(var(--color-hare));
font-weight: 700; font-size: 15px;
height: 30px; width: 30px;
}`)

; (function () {
  'use strict'
  // 选词键顺序
  var chars = 'abcdefghijklnopqrstuvxyz1234567890-=[],./'
  // 题目区元素相关数据对象
  // type -1: 无效 0: 选择题(自带[数字]快捷键)
  // 1: 从英文翻译组句题 1.1: 翻译到英文组句题 1.2 翻译到英文手写题
  // 2: 配对题(自带[数字]快捷键)
  // 3: 填空题(自带[首字母]快捷键) 4: 听写题(不需要处理) 5: 听写填空题(不需要处理)
  // 6: 小故事 7: 补全题(自带[首字母]快捷键) 8: 口语题
  // el: 主要题目区元素
  // el2: 次要题目区元素
  var question = { type: -1 }
  // 始初化题目数据对象方法
  var init_question = function () {
    if (question.type > -1) {
      return question
    }

    // 未知题型
    question.type = -1

    // 口语题
    question.el = document.querySelector(
      'div[data-test="challenge challenge-speak"], div[data-test="challenge challenge-listenSpeak"]'
    )
    if (question.el) {
      question.type = 8
      return
    }
    // 补全题(不需要处理)
    question.el = document.querySelector(
      'div[data-test="challenge challenge-tapCloze"]'
    )
    if (question.el) {
      question.type = 7
      return
    }
    // 小故事
    question.el = document.getElementsByClassName('kbjat')
    if (question.el.length) {
      question.el = question.el[0].children
      question.type = 6
      // 每段数据所在属性名
      question.prop_field = Object.keys(question.el[0]).find(p =>
        p.startsWith('__reactFiber')
      )

      // 小屏幕设备最后连连看会显示不全, 把顶部白色背景去掉
      var el = document.querySelector(".mAxZF")
      if (el) {
        el.style.backgroundColor = "transparent"
      }
      return
    }
    // 听写填空题(不需要处理)
    question.el = document.querySelector(
      'div[data-test="challenge challenge-listenComplete"]'
    )
    if (question.el) {
      question.type = 5
      return
    }
    // 听写题(不需要处理)
    question.el = document.querySelector(
      'div[data-test="challenge challenge-listenTap"]'
    )
    if (question.el) {
      question.type = 4
      return
    }
    // 填空题(自带,不需要处理)
    question.el = document.querySelector(
      'div[data-test="challenge challenge-tapComplete"]'
    )
    if (question.el) {
      question.type = 3
      return
    }
    // 配对题(自带,不需要处理)
    question.el = document.querySelector(
      'div[data-test="challenge challenge-listenMatch"]'
    )
    if (question.el) {
      question.el = question.el.children[0].children[1].children[0]
      question.type = 2
      return
    }
    // 翻译题: 从英文翻译组句题; 翻译到英文组句题; 翻译到英文手写题
    // 只需要处理从英文翻译组句题, 其它忽略
    question.el = document.querySelector('div[data-test="challenge challenge-translate"]')
    if (question.el) {
      // 组句题
      var el = question.el.querySelector('div[data-test="word-bank"]')
      if (el) {
        var word = el.querySelector('button')
        if (!word) { return }
        // 字/词语言是英文, 翻译到英文组句题
        if (word.lang == 'en') {
          question.type = 1.1
          return
        } else {
          // 从英文翻译组句题
          question.el = el
          question.type = 1
          question.el2 = question.el.parentElement.previousElementSibling.children[0].children[0].children[1]
          return
        }
      }
      // 翻译到英文手写题
      el = question.el.querySelector('textarea[data-test="challenge-translate-input"]')
      if (el) {
        question.type = 1.2
        return
      }
      return
    }
    // 选择题(自带,不需要处理)
    question.el = document.querySelector('div[aria-label="choice"]')
    if (question.el) {
      question.type = 0
      return
    }
    // 未知题型
    question.type = -1
  }

  // 防抖方法
  function debounce(func, delay) {
    let timeout
    return function () {
      const _this = this
      const args = [...arguments]
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        func.apply(_this, args)
      }, delay)
    }
  }

  // 为单词/短语添加序号方法
  var process_order = function () {
    var play_btn = document.querySelector('button[data-test="player-next"]')
    if (!play_btn) {
      //  || play_btn.getAttribute('aria-disabled') != 'true'
      return
    }
    init_question()
    if (question.type == 1) {
      for (var i = 0; i < question.el.children.length; i++) {
        var item = question.el.children[i]
        var btn = item.querySelector('button');
        // 修改按钮padding, 加宽以防止序号覆盖文字
        btn.setAttribute('style', '--web-ui_button-padding: 8px 12px;')

        // 是否已经添加过了
        if (btn.querySelectorAll('span.p_item_tip').length > 0) {
            break;
        }

        // 添加序号
        var last_span = btn.childNodes.length > 0 ? btn.childNodes[btn.childNodes.length-1] : null;
        if (last_span) {
          let new_el = document.createElement('span')
          new_el.textContent = chars.charAt(i);
          new_el.className = 'p_item_tip';

          // 在文本后面添加序号
          last_span.appendChild(new_el);
          // 在文本前面添加序号
          // last_span.insertAfter(new_el, last_span.querySelector('[data-test="challenge-tap-token-text"]'))
        }
      }
    }
  }
  // 为单词/短语添加序号方法(防抖)
  var process_order_debounce = debounce(process_order, 500)

  // 按键事件监听
  document.addEventListener('keyup', function (event) {
    // GM_log('按键:' + event.key)
    // 当前页
    var page_name = window.location.pathname
    // 在主页
    if (page_name == '/learn') {
      // 按l键直接学习(跳转/lesson页)
      if (event.key == 'l') {
        window.location.href = '/lesson'
      }

      // 按回车键直接学习(跳转/lesson页)
      if (event.key == 'Enter') {
        // 不在当前部分时点击"前往当前部分"按钮
        var el = document.querySelector('button[aria-label="前往当前部分"], button[aria-label="Go to current unit"]')
        if (el) {
          el.click()
          return
        }

        setTimeout(function () {
          var el = document.querySelector('a[href="/lesson"], a[href="/lesson?mode=LISTEN"]')
          if (el) {
            el.click()
          }
        }, 150)
        return
      }
      if (event.key == 'z') {
        // 连胜激动不谢谢按钮
        var el = document.querySelector('button[data-test="notification-drawer-no-thanks-button"]')
        if (el) {
          el.click()
        }
        return
      }
      return
    }

    // 在学习页
    if (page_name.startsWith('/lesson') || page_name.startsWith('/practice')) {
      // 初始化题目区数据
      init_question()
      // 回车键: 延时为下一题单词/短语添加序号
      if (event.key == 'Enter') {
        question.type = -1

        process_order_debounce()
        return
      }
      // 退格键, 删除最后一个选词
      if (event.key == 'Backspace') {
        if (question.el2) {
          var selects = question.el2.children
          var cnt = selects.length
          var last_select = selects[cnt - 1]
          last_select.querySelector('button').click()
        }
        return
      }
      // 删除键, 删除所有选词
      if (event.key == 'Delete') {
        if (question.el2) {
          var selects = question.el2.children
          for (var i = selects.length; i > 0; i--) {
            var select = selects[i - 1]
            select.querySelector('button').click()
          }
        }
        return
      }
      // 没有题目区时, 按z键时如果页面有"不,谢谢"按钮, 就点击它
      if (event.key == 'z') {
        // 没有题时
        if (question.type == -1) {
          // 跳过按钮
          var skip_el = document.querySelector(
            'button[data-test="plus-no-thanks"], button[data-test="practice-hub-ad-no-thanks-button"]'
          )
          if (skip_el) {
            skip_el.click()
            return
          }
          // 挑战传奇按钮
          var legendary_el = document.querySelector(
            'a[data-test="legendary-start-button"]'
          )
          if (legendary_el) {
            // 找到"继续"按钮并点击
            legendary_el.parentElement.nextElementSibling.children[0].children[1].click()
          }
          return
        }
        // 口语题时
        if (question.type == 8) {
          // 跳过按钮
          var skip_el = document.querySelector('button[data-test="player-skip"]')
          if (skip_el) {
            skip_el.click()
          }
          return
        }
      }

      // Control键, 点击扬声器按钮播放语音
      if (event.key == 'Control') {
        if (question.type == 6) {
          // 小故事, 找最后一个已读的音频
          var last_listen
          for (var i = 0; i < question.el.length; i++) {
            // 当前遍历的元素
            var el = question.el[i]
            // 当前遍历的元素包含的类列表
            var class_list = Array.from(el.classList)
            // 当前元素的音频是否已听过
            var flag = el[question.prop_field].flags
            // 只有一个类, 答题区, 忽略
            if (class_list.length == 1) {
              continue
            }
            // 有两个类
            if (class_list.length == 2) {
              // flag>0时已经听过, flag=0时为标题, 设为最后听过的音频元素
              last_listen = el
              continue
            }
            // 有三个类
            if (class_list.length == 3) {
              if (flag == 0) {
                // 没有听过, 结束循环
                break
              } else {
                // 有三个类但flag>0的情况, 第三个类不同于常规音频,
                // 表明该元素非音频, 属于有四个类(听力组句题)的在答情况
                continue
              }
            }
            // 有四个类, 听力组句题, flag=0时未答, flag>0时已答
            if (class_list.length == 4) {
              continue
            }
          }
          if (last_listen) {
            last_listen.querySelector('div[data-test="audio-button"]').click()
          }
        } else {
          // 常规题, 找第一个播放按钮
          var els = document.getElementsByClassName('fs-exclude')
          if (els) {
            els[0].click()
          }
        }

        return
      }

      // 到这里已经处理完特殊按键事件
      // 剩下按字母/数字键的情况
      // 将按键转为序号, 未找到时不处理
      var idx = chars.indexOf(event.key)
      if (idx < 0) {
        return
      }

      // 小故事
      if (question.type == 6) {
        for (var i = 0; i < question.el.length; i++) {
          var el = question.el[i]
          var class_list = Array.from(el.classList)
          if (
            class_list.length == 1 &&
            el.children.length > 0 &&
            i < question.el.length - 1
          ) {
            // 当前处于答题状态
            // 除了最后的配对题和选项是汉字的选择题外其余题几乎都是可以首字母匹配的
            // 因此除了最后的配对题不做处理外其余添加使用数字作选择
            var btn_list = el.querySelectorAll('button')
            var no = Number(event.key)
            if (!isNaN(no) && no <= btn_list.length) {
              btn_list[no - 1].click()
            }
            break
          }
        }
        return
      }

      // 选择题
      if (question.type == 0) {
        if (question.el.children.length >= idx) {
          question.el.children[idx].click()
        }
        return
      }

      // 组句题
      if (question.type == 1) {
        if (question.el.children.length >= idx) {
          var el = question.el.children[idx]
          var item = el.children[0].children[0]
          if (item.getAttribute('aria-disabled') != 'true') {
            item.click()
            return
          }
          var text = item.querySelector(
            'span[data-test="challenge-tap-token-text"'
          ).innerHTML
          var selects = question.el2.querySelectorAll(
            'span[data-test="challenge-tap-token-text"]'
          )
          for (var i = 0; i < selects.length; i++) {
            var select = selects[i]
            if (select.innerHTML == text) {
              select.parentElement.parentElement.click()
              return
            }
          }
        }
      }

      // 配对题(自带,不需要处理)
      // if (question.type == 2) {
      //    var no = Number(event.key)
      //   if (!isNaN(no)) {
      //       idx = no - 1
      //       var length = question.el.children.length
      //     if (idx >=0 && idx < length) {
      //          var el = question.el.children[idx].getElementsByClassName('fs-exclude')
      //         if (el) {
      //           el.click()
      //             return
      //        }
      //        el = question.el.children[idx].querySelector('button').click()
      //    }
      //  }
      //  return
      //    }
    }
  })

  // 由于页面加载时间不确定, 并且document.load事件迟的离谱, 对于第一题就是组句题的情况不好处理
  // 如果碰到了可以手动回车一下添加序号
})()
