// ==UserScript==
// @name         NGA手综表情包
// @namespace    https://greasyfork.org/zh-CN/scripts/490837
// @version      0.0.2
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 手综流行的表情包 加入到表情列表中
// @author       有男不玩
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/490837/NGA%E6%89%8B%E7%BB%BC%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/490837/NGA%E6%89%8B%E7%BB%BC%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

//原作者发布地址：https://bbs.nga.cn/read.php?tid=30739380

;(function () {
  function init($) {
    let demoNGAYNBW = (commonui.acYNBWNGA = {
      data: [
        'https://img.nga.178.com/attachments/mon_202403/25/bwQqqp-fhesK1aToS6k-6k.gif', //都是手综干的
        'https://img.nga.178.com/attachments/mon_202403/25/bwQr4y-l439X16ZbnT3cShs-c0.gif', //有男不玩
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs7x3-aknmZuT3cSwd-ji.jpg', //蓝色星原
        'https://img.nga.178.com/attachments/mon_202403/25/bwQ6s0-7iimZdT3cSk0-9r.jpg', //蓝色星原
        'https://img.nga.178.com/attachments/mon_202403/25/7nQs800-co5vKlT1kSe6-da.jpg', //猛干
        'https://img.nga.178.com/attachments/mon_202403/25/7nQs800-j3rxK2hT3cSwh-k0.jpg', //瘤
        'https://img.nga.178.com/attachments/mon_202403/25/bwQ4ocj-7qjfK1iT3cSic-fw.jpg', //不等式
        'https://img.nga.178.com/attachments/mon_202403/25/7nQs800-b5qbK1mT3cSk0-de.jpg', //典
        'https://img.nga.178.com/attachments/mon_202403/25/7nQs800-gq35K10T3cSk0-ex.jpg', //典
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs803-h5teK1aT1kShs-hs.jpg', //兔女郎
        'https://img.nga.178.com/attachments/mon_202403/25/bwQqx5-hbqyK1vT3cSk0-ds.jpeg.medium.jpg', // gayshit
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs803-jdrmK18T1kSfs-fd.jpg', //萎
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs803-3nyiK17T3cSjs-dz.jpg', //萎
        'https://img.nga.178.com/attachments/mon_202403/25/bwQ4ocy-44y0ZdT3cSsg-p0.jpeg', //萎
        'https://img.nga.178.com/attachments/mon_202403/25/bwQshl-fg9aXrZ7mT3cSd6-d7.gif', //别说了
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs803-83uuX14ZazT3cSqj-ha.gif', //龟
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs803-ev92K2sT3cSsg-cx.jpg', //沪f4
        'https://img.nga.178.com/attachments/mon_202403/25/bwQs803-ih59K1sT3cSp0-go.jpeg', // 神父
        'https://img.nga.178.com/attachments/mon_202403/25/bwQ4oci-49psZ1gT3cSy4-u4.jpeg.medium.jpg', //品德
        'https://img.nga.178.com/attachments/mon_202403/25/bwQsh5-4slvK2mT1kShs-dy.jpg', // 习中中
      ],
      addPic: function (biu) {
        let ngademo = $(biu.target),
          bodyTom = ngademo.parent().next().children(),
          imgs = bodyTom.eq(ngademo.index() - 1)
        if (!imgs.children()[0])
          $.each(demoNGAYNBW.data, function (i, picURL) {
            imgs.append(
              '<img style="object-fit: cover;" width:"125px" height="125px" src="' +
                picURL +
                '" onclick="postfunc.addText(\'[img]' +
                picURL +
                '[/img]\');postfunc.selectSmilesw._.hide()" /> &nbsp;'
            )
          })
        $.each(bodyTom, function (i, thisK) {
          if (i == ngademo.index() - 1) thisK.style.display = ''
          else thisK.style.display = 'none'
        })
        ngademo.parent().children().eq(0).html('')
      },
      addBtn: function () {
        $('[title="插入表情"]:not([ac-YNBW])')
          .attr('ac-YNBW', 1)
          .bind('click.acYNBWNGAAddBtn', function () {
            setTimeout(function () {
              $(
                '.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("有男不玩")))'
              )
                .append('<button class="block_txt_big">有男不玩</button>')
                .find(':contains("有男不玩")')
                .bind('click.acYNBWNGABtn', demoNGAYNBW.addPic)
                .end()
                .next()
                .append('<div />')
            }, 100)
          })
      },
      putInBtn: new MutationObserver(function () {
        demoNGAYNBW.addBtn()
      }),
    })

    demoNGAYNBW.addBtn()

    demoNGAYNBW.putInBtn.observe($('body')[0], {
      subtree: true,
      childList: true,
    })
  }

  ;(function check() {
    try {
      init(commonui.userScriptLoader.$)
    } catch (e) {
      setTimeout(check, 50)
    }
  })()
})()
