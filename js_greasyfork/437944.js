// ==UserScript==
// @name        Font replacer
// @name:zh-CN  字体替换 (Font replacer)
// @name:zh-TW  字型替換 (Font replacer)
// @namespace   font-replacer
// @grant       GM_addStyle
// @version     1.0
// @author      Coxxs
// @description Replace fonts hard coded by websites
// @description:zh-cn 替换网站硬编码在 CSS 中的字体
// @description:zh-tw 替換網站寫死在 CSS 中的字型
// @include     *
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/437944/Font%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/437944/Font%20replacer.meta.js
// ==/UserScript==
 
class Replacer {
  constructor() {
    this.css = []
  }
  add(from, to) {
    for (const font of to) {
      let extra = ''
      if (font.weight) {
        extra += `font-weight:${font.weight};`
      }
      this.css.push(`@font-face{font-family:"${from}";${extra}src:local("${font.name}")}`)}
    }
  toString() {
    return this.css.join('')
  }
}
 
let replacer = new Replacer()
 
/**** Replace rules START *****/

const SourceHanSansSC = [{ name: 'Source Han Sans SC' }]
const SourceHanSansTC = [{ name: 'Source Han Sans TC' }]

const HarmonyOSSansSC = [{ name: 'HarmonyOS Sans SC' }]
const HarmonyOSSansTC = [{ name: 'HarmonyOS Sans TC' }]

const MiSans = [
  { name: 'MiSans Thin', weight: 100 },
  { name: 'MiSans ExtraLight', weight: 200 },
  { name: 'MiSans Light', weight: 300 },
  { name: 'MiSans Regular', weight: 400 },
  { name: 'MiSans Medium', weight: 500 },
  { name: 'MiSans Demibold', weight: 600 },
  { name: 'MiSans Bold', weight: 700 },
  { name: 'MiSans Heavy', weight: 900 },
]

// Simpified Chinese
const FontSC = SourceHanSansSC
replacer.add("宋体", FontSC)
replacer.add("SimSun", FontSC)
replacer.add("新宋体", FontSC)
replacer.add("NSimSun", FontSC)
replacer.add("微软雅黑", FontSC)
replacer.add("Microsoft YaHei", FontSC)
replacer.add("Microsoft YaHei UI", FontSC)
replacer.add("黑体", FontSC)
replacer.add("SimHei", FontSC)
// replacer.add("华文中宋", FontSC)
// replacer.add("STZhongsong", FontSC)
// replacer.add("华文细黑", FontSC)
// replacer.add("STXihei", FontSC)
// replacer.add("STHeiTi", FontSC)
// replacer.add("幼圆", FontSC)

// Traditional Chinese
const FontTC = SourceHanSansTC
replacer.add("微軟正黑體", FontTC)
replacer.add("Microsoft JhengHei", FontTC)
replacer.add("Microsoft JhengHei UI", FontTC)
replacer.add("新細明體", FontTC)
replacer.add("PMingLiU", FontTC)
replacer.add("細明體", FontTC)
replacer.add("MingLiU", FontTC)


/**** Replace rules END *****/
 
GM_addStyle(replacer.toString())
