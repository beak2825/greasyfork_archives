// ==UserScript==
// @name         NGA 猛干语录
// @namespace    https://greasyfork.org/zh-CN/scripts/490833
// @version      0.0.2
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 猛干语录 加入到表情列表中
// @author       猛干
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/490833/NGA%20%E7%8C%9B%E5%B9%B2%E8%AF%AD%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490833/NGA%20%E7%8C%9B%E5%B9%B2%E8%AF%AD%E5%BD%95.meta.js
// ==/UserScript==

//原作者发布地址：https://bbs.nga.cn/read.php?tid=30739380
// 猛干语录地址: https://hoyo.life/limengan/

;(function () {
  function init($) {
    let gayShit = (commonui.mengan = {
      data: [
        '谁叫你这么猛，这么猛，这么猛',
        '这事很重要吗？也就你这样的希儿厨觉得这事儿重要吧',
        '笑死了，没有你这些司马货去婊，人家会改吗',
        '他最近怎么了，被哪个op夺舍了这是……',
        '是，说了，怎么滴吧，要不你报警吧，他们公司就在徐汇，跑不了',
        '好个讨饭帖',
        '鸱鸮怪叫，终不能掩鹓鶵清音。',
        '激动死了，说个悲惨的故事，笔在别人手里。',
        '只会在游戏里埋梗，是卖梗的电商吗',
        '一个不受太多制约的编剧真是最快乐的职业呼哈哈哈。',
        '成为这辉煌的注脚，不幸福吗？',
        '嗐，这楼，简直是邓宁克鲁格效应的范例展示',
      ],
      addText: function (biu) {
        let ngademo = $(biu.target),
          bodyTom = ngademo.parent().next().children(),
          textContainer = bodyTom.eq(ngademo.index() - 1)
        if (!textContainer.children()[0])
          // 遍历数据，向对应位置插入
          $.each(gayShit.data, function (i, text) {
            textContainer.append(
              '<button onclick="postfunc.addText(\'检索......输出：' +
                text +
                '\');postfunc.selectSmilesw._.hide()">' +
                text +
                '</button>' + '<br />'
            )
          })
        // 控制显示哪个帖子内容
        $.each(bodyTom, function (i, thisK) {
          if (i == ngademo.index() - 1) {
            thisK.style.display = ''
          } else {
            thisK.style.display = 'none'
          }
        })
        // 清空按钮区域
        ngademo.parent().children().eq(0).html('')
      },
      // 添加按钮到NGA论坛的帖子编辑器中
      addBtn: function () {
        $('[title="插入表情"]:not([ac-GayShit])')
          .attr('ac-GayShit', 1)
          .bind('click.menganAddBtn', function () {
            setTimeout(function () {
              // 找到并添加猛干语录按钮，并绑定点击事件
              $(
                '.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("猛干语录")))'
              )
                .append('<button class="block_txt_big">猛干语录</button>')
                .find(':contains("猛干语录")')
                .bind('click.menganBtn', gayShit.addText)
                .end()
                .next()
                .append('<div />')
            }, 100)
          })
      },
      // 创建MutationObserver对象，监视页面DOM树的变化
      putInBtn: new MutationObserver(function () {
        gayShit.addBtn()
      }),
    })

    // 添加按钮到页面
    gayShit.addBtn()

    // 监视页面DOM树的变化，以便在需要时重新添加按钮
    gayShit.putInBtn.observe($('body')[0], {
      subtree: true,
      childList: true,
    })
  }

  // 检查是否加载了需要的库，一旦加载完成，就调用init函数进行初始化
  ;(function check() {
    try {
      init(commonui.userScriptLoader.$)
    } catch (e) {
      setTimeout(check, 50)
    }
  })()
})()
