// ==UserScript==
// @name         碧蓝幻想计算器gbf.xzz.jp汉化
// @namespace    https://game.granbluefantasy.jp/
// @version      0.2
// @description  简单汉化计算器gbf.xzz.jp
// @author       丘某
// @match        http://gbf.xzz.jp/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380910/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E8%AE%A1%E7%AE%97%E5%99%A8gbfxzzjp%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/380910/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E8%AE%A1%E7%AE%97%E5%99%A8gbfxzzjp%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const i18n = new Map([
      ['ホーム', 'Home'],
      ['JOBボーナス、ゼニス「攻撃力」を合計した数値。|JOBボーナスは編成画面のボーナスから確認可能|攻撃力+○%のデータはジョブ補正に入力', 'JOB加成和天顶“攻击力”的总和。 |JOB加成可以从作文屏幕奖励确认|攻击力+○％的数据输入到JOB更正'],
      ['ジョブ', 'JOB'],
      ['マグナ','方阵'],
      ['ゼウス', '宙斯'],
      ['キャラ', 'Character'],
      ['ダメージ', '伤害'],
      ['バハ', '紫巴'],
      ['オメガ', 'U巴'],
      ['コスモス', '宇宙武（大公）'],
      ['上書', '覆盖'],
      ['フレ召喚石', '朋友的召唤石'],
      ['コピー', '复制'],
      ['スキル設定', '技能设置'],
      ['レベル', '等级'],
      ['グラブル装備シミュレータ', '碧蓝幻想装备模拟器'],
      ['データ移行', '数据迁移'],
      ['移行データ出力', '数据导出'],
      ['移行データ入力', '数据输入'],
      ['攻撃入力', '属性输入'],
      ['一時領域', '临时区域'],
      ['新規', '保存'],
      ['読込', '读取'],
      ['削除', '删除'],

    ])

    replaceText(document.body)
//   |
//  ₘₙⁿ
// ▏n
// █▏　､⺍             所以，不要停下來啊（指加入词条
// █▏ ⺰ʷʷｨ
// █◣▄██◣
// ◥██████▋
// 　◥████ █▎
// 　　███▉ █▎
// 　◢████◣⌠ₘ℩
// 　　██◥█◣\≫
// 　　██　◥█◣
// 　　█▉　　█▊
// 　　█▊　　█▊
// 　　█▊　　█▋
// 　　 █▏　　█▙
// 　　 █ ​
    const bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })

    function replaceText(node) {
      nodeForEach(node).forEach(htmlnode => {
        i18n.forEach((value, index) => {
          // includes可直接使用 === 以提高匹配精度
          const textReg = new RegExp(index, 'g')
          if (htmlnode instanceof Text && htmlnode.nodeValue.includes(index))
            htmlnode.nodeValue = htmlnode.nodeValue.replace(textReg, value)
          else if (htmlnode instanceof HTMLInputElement && htmlnode.value.includes(index))
            htmlnode.value = htmlnode.value.replace(textReg, value)
        })
      })
    }

    function nodeForEach(node) {
      const list = []
      if (node.childNodes.length === 0) list.push(node)
      else {
        node.childNodes.forEach(child => {
          if (child.childNodes.length === 0) list.push(child)
          else list.push(...nodeForEach(child))
        })
      }
      return list
    }
})();