// ==UserScript==
// @name         吾爱开心插件
// @namespace    https://greasyfork.org/zh-CN/scripts/528041-%E5%90%BE%E7%88%B1%E5%BC%80%E5%BF%83%E6%8F%92%E4%BB%B6
// @version      0.2.1
// @description  做人一定要开心
// @author       冰冻大西瓜
// @match        https://www.52pojie.cn/*
// @license      GPL-3.0-or-later
// @run-at       document-end
// @note         2025年2月26日 修复了鼠标移动到勋章上不显示信息的BUG(未完全修复且没有头绪), 部分图标鼠标移上去就是不显示信息,可能是不开心吧!
// @note         2025年2月26日 自动获取用户名,移除了硬编码,修复了帖子区域多个自己的回复中用户组显示异常的问题
// @note         2025年2月25日 更新了@namespace和@license LGPL-3.0-or-later
// @note         2025年2月25日 第一个版本,实现了网站右上角用户组开心,帖子中等级开心,勋章开心
// @todo         自动获取用户名并对自身的回帖进行开心化
// @downloadURL https://update.greasyfork.org/scripts/528041/%E5%90%BE%E7%88%B1%E5%BC%80%E5%BF%83%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/528041/%E5%90%BE%E7%88%B1%E5%BC%80%E5%BF%83%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

// 在此处键入代码……
let medalsList = `
<img id="md_xxxxx_51" src="https://static.52pojie.cn/static/image/common/5yeas.gif" alt="五年荣誉奖章" onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_51_menu', 'pos':'12!'})" title  >
<img id="md_xxxxx_50" src="https://static.52pojie.cn/static/image/common/10yeas.gif" alt="十年荣誉奖章" onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_50_menu', 'pos':'12!'})" title  >
<img id="md_xxxxx_56" src="https://static.52pojie.cn/static/image/common/15yeas.gif" alt="十五年荣誉奖章"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_56_menu', 'pos':'12!'})" title >
<img id="md_xxxxx_10" src="https://static.52pojie.cn/static/image/common/cf.gif" alt="论坛一级财富奖章" onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_10_menu', 'pos':'12!'})" title  >
<img id="md_xxxxx_13" src="https://static.52pojie.cn/static/image/common/xc.gif" alt="宣传大使奖" onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_13_menu', 'pos':'12!'})" title  >
<img id="md_xxxxx_18" src="https://static.52pojie.cn/static/image/common/7.gif" alt="活跃会员奖"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_18_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_11" src="https://static.52pojie.cn/static/image/common/zs.gif" alt="终身成就奖"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_11_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_14" src="https://static.52pojie.cn/static/image/common/4.gif" alt="特殊贡献奖"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_14_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_12" src="https://static.52pojie.cn/static/image/common/2.gif" alt="优秀斑竹奖" onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_12_menu', 'pos':'12!'})" title >
<img id="md_xxxxx_21" src="https://static.52pojie.cn/static/image/common/16304370.gif" alt="[LCG]成员勋章"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_21_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_54" src="https://static.52pojie.cn/static/image/common/jd.gif" alt="缉毒先锋勋章"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_54_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_49" src="https://static.52pojie.cn/static/image/common/bkqs.gif" alt="百科全书奖章"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_49_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_22" src="https://static.52pojie.cn/static/image/common/t5.gif" alt="吾爱热心会员" onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_22_menu', 'pos':'12!'})" title  >
<img id="md_xxxxx_19" src="https://static.52pojie.cn/static/image/common/8.gif" alt="新人进步奖"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_19_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_15" src="https://static.52pojie.cn/static/image/common/jdz.gif" alt="金点子奖"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_15_menu', 'pos':'12!'})" title>
<img id="md_xxxxx_16" src="https://static.52pojie.cn/static/image/common/t75.gif" alt="原创精英奖"  onmouseover="showMenu({'ctrlid':this.id, 'menuid':'md_16_menu', 'pos':'12!'})" title>
`
const grade = `<img src="https://static.52pojie.cn/static/image/common/fanyinwen.gif" alt="Rank: 6"><img src="https://static.52pojie.cn/static/image/common/fanyinwen.gif" alt="Rank: 6"><img src="https://static.52pojie.cn/static/image/common/fanyinwen.gif" alt="Rank: 6">`

const TARGET = '站长'
const getUserName = document.querySelector('.vwmy a')
const userGroup1 = document.querySelector('#g_upmine>font')
userGroup1.innerText = TARGET
const getUserNameList = document.querySelectorAll('.pls .authi a.xw1')

getUserNameList.forEach(e => {
  if (e.innerText === getUserName.innerText) {
    const userGroup2 = e.closest('.pls.cl.favatar').querySelector('.side-group font')
    const medalsElement = e.closest('.pls.cl.favatar').querySelector('.md_ctrl>a')
    const userStar = e.closest('.pls.cl.favatar').querySelector('.side-star span')
    const tableID = e.closest('.pls.cl.favatar').getAttribute('id').match(/\d+/)[0]
    const medals = medalsList.replaceAll('xxxxx', tableID)

    if (userGroup2) {
      userGroup2.innerText = TARGET
    }

    medalsElement.innerHTML = medals
    userStar.innerHTML = grade
  }
})
