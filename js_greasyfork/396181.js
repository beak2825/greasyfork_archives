// ==UserScript==
// @name         Humble Choice Get Key
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  HB月包选择游戏(只选不刮),刮开游戏，刮开dlc
// @author       ku mi
// @include      /https:\/\/www\.humblebundle\.com\/membership\/.*?/
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/html2canvas/0.5.0-beta4/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/396181/Humble%20Choice%20Get%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/396181/Humble%20Choice%20Get%20Key.meta.js
// ==/UserScript==
//https:\/\/www\.(indiegala|humblebundle)\.com\/(subscription\/|gift-bundle\/|gift\?gift_id=).*?
///https:\/\/www\.indiegala\.com\/(gift-bundle\/|gift\?gift_id=).*?/
(() => {
const countryMap = {
  AD: '安道尔',
  AE: '阿拉伯联合酋长国',
  AF: '阿富汗',
  AG: '安提瓜和巴布达',
  AI: '安圭拉',
  AL: '阿尔巴尼亚',
  AM: '亚美尼亚',
  AO: '安哥拉',
  AQ: '南极洲',
  AR: '阿根廷',
  AS: '美属萨摩亚',
  AT: '奥地利',
  AU: '澳大利亚',
  AW: '阿鲁巴',
  AX: '奥兰群岛',
  AZ: '阿塞拜疆',
  BA: '波斯尼亚和黑塞哥维那',
  BB: '巴巴多斯',
  BD: '孟加拉',
  BE: '比利时',
  BF: '布基纳法索',
  BG: '保加利亚',
  BH: '巴林',
  BI: '布隆迪',
  BJ: '贝宁',
  BL: '圣巴托洛缪岛',
  BM: '百慕大',
  BN: '文莱',
  BO: '玻利维亚',
  BQ: '博奈尔',
  BR: '巴西',
  BS: '巴哈马',
  BT: '不丹',
  BU: '缅甸',
  BV: '布韦岛',
  BW: '博兹瓦纳',
  BY: '白俄罗斯',
  BZ: '伯利兹',
  CA: '加拿大',
  CC: '科科斯（基林）群岛',
  CD: '刚果（金）',
  CF: '中非共和国',
  CG: '刚果（布）',
  CH: '瑞士',
  CI: '科特迪瓦',
  CK: '库克群岛',
  CL: '智利',
  CM: '喀麦隆',
  CN: '中国',
  CO: '哥伦比亚',
  CR: '哥斯达黎加',
  CS: '塞尔维亚和黑山',
  CU: '古巴',
  CV: '佛得角',
  CW: '库拉索',
  CX: '圣诞岛',
  CY: '塞浦路斯',
  CZ: '捷克',
  DE: '德国',
  DJ: '吉布提',
  DK: '丹麦',
  DM: '多米尼克',
  DO: '多米尼加',
  DZ: '阿尔及利亚',
  EC: '厄瓜多尔',
  EE: '爱沙尼亚',
  EG: '埃及',
  EH: '西撒哈拉',
  ER: '厄立特里亚',
  ES: '西班牙',
  ET: '埃塞俄比亚',
  FI: '芬兰',
  FJ: '斐济',
  FK: '福克兰群岛',
  FM: '密克罗尼西亚',
  FO: '法罗群岛',
  FR: '法国',
  GA: '加蓬',
  GB: '英国',
  GD: '格林纳达',
  GE: '格鲁吉亚',
  GF: '法属圭亚那',
  GG: '根西',
  GH: '加纳',
  GI: '直布罗陀',
  GL: '格陵兰',
  GM: '冈比亚',
  GN: '几内亚',
  GP: '瓜德鲁普',
  GQ: '赤道几内亚',
  GR: '希腊',
  GS: '南乔治亚岛和南桑威奇群岛',
  GT: '危地马拉',
  GU: '关岛',
  GW: '几内亚比绍',
  GY: '圭亚那',
  HK: '香港',
  HM: '赫德岛和麦克唐纳群岛',
  HN: '洪都拉斯',
  HR: '克罗地亚',
  HT: '海地',
  HU: '匈牙利',
  ID: '印尼',
  IE: '爱尔兰',
  IL: '以色列',
  IM: '马恩岛',
  IN: '印度',
  IO: '英属印度洋领地',
  IQ: '伊拉克',
  IR: '伊朗',
  IS: '冰岛',
  IT: '意大利',
  JE: '泽西岛',
  JM: '牙买加',
  JO: '约旦',
  JP: '日本',
  KE: '肯尼亚',
  KG: '吉尔吉斯',
  KH: '柬埔寨',
  KI: '基里巴斯',
  KM: '科摩罗',
  KN: '圣基茨和尼维斯',
  KP: '朝鲜',
  KR: '韩国',
  KW: '科威特',
  KY: '开曼群岛',
  KZ: '哈萨克斯坦',
  LA: '老挝',
  LB: '黎巴嫩',
  LC: '圣卢西亚',
  LI: '列支敦士登',
  LK: '斯里兰卡',
  LR: '利比里亚',
  LS: '莱索托',
  LT: '立陶宛',
  LU: '卢森堡',
  LV: '拉脱维亚',
  LY: '利比亚',
  MA: '摩洛哥',
  MC: '摩纳哥',
  MD: '摩尔多瓦',
  ME: '黑山',
  MF: '法属圣马丁',
  MG: '马达加斯加',
  MH: '马绍尔群岛',
  MK: '马其顿',
  ML: '马里',
  MM: '缅甸',
  MN: '蒙古',
  MO: '澳门',
  MP: '北马里亚纳群岛',
  MQ: '马提尼克',
  MR: '毛里塔尼亚',
  MS: '蒙塞拉特',
  MT: '马耳他',
  MU: '毛里求斯',
  MV: '马尔代夫',
  MW: '马拉维',
  MX: '墨西哥',
  MY: '马来西亚',
  MZ: '莫桑比克',
  NA: '纳米比亚',
  NC: '新喀里多尼亚',
  NE: '尼日尔',
  NF: '诺福克岛',
  NG: '尼日利',
  NI: '尼加拉瓜',
  NL: '荷兰',
  NO: '挪威',
  NP: '尼泊尔',
  NR: '瑙鲁',
  NU: '纽埃',
  NZ: '新西兰',
  OM: '阿曼',
  PA: '巴拿马',
  PE: '秘鲁',
  PF: '法属波利尼西亚a',
  PG: '巴布亚新几内亚',
  PH: '菲律宾',
  PK: '巴基斯坦',
  PL: '波兰',
  PM: '圣皮埃尔和密克隆',
  PN: '皮特凯恩群岛',
  PR: '波多黎各',
  PS: '巴勒斯坦',
  PT: '葡萄牙',
  PW: '帕劳',
  PY: '巴拉圭',
  QA: '卡塔尔',
  RE: '留尼旺島',
  RO: '罗马尼亚',
  RS: '塞尔维亚',
  RU: '俄罗斯',
  RW: '卢旺达',
  SA: '沙特阿拉伯',
  SB: '所罗门群岛',
  SC: '塞舌尔',
  SD: '苏丹',
  SE: '瑞典',
  SG: '新加坡',
  SH: '圣赫勒拿、阿森松与特斯坦达库尼亚',
  SI: '斯洛文尼',
  SJ: '斯瓦尔巴群岛和扬马延岛',
  SK: '斯洛伐克',
  SL: '塞拉利昂',
  SM: '圣马力诺',
  SN: '塞内加尔',
  SO: '索马里',
  SR: '苏里南',
  SS: '南苏丹',
  ST: '圣多美和普林西比',
  SV: '萨尔瓦多',
  SX: '荷属圣马丁',
  SY: '叙利亚',
  SZ: '斯威士兰',
  TC: '特克斯和凯科斯群岛',
  TD: '乍得',
  TF: '法属南部领土',
  TG: '多哥',
  TH: '泰国',
  TJ: '塔吉克斯坦',
  TK: '托克劳',
  TL: '东帝汶',
  TM: '土库曼斯坦',
  TN: '突尼斯',
  TO: '汤加',
  TR: '土耳其',
  TT: '特立尼达和多巴哥',
  TV: '图瓦卢',
  TW: '台湾',
  TZ: '坦桑尼亚',
  UA: '乌克兰',
  UG: '乌干达',
  UM: '美国本土外小岛屿',
  US: '美国',
  UY: '乌拉圭',
  UZ: '乌兹别克斯坦',
  VA: '圣座',
  VC: '圣文森特和格林纳丁斯',
  VE: '委内瑞拉',
  VG: '英属维尔京群岛',
  VI: '美属维尔京群岛',
  VN: '越南',
  VU: '瓦努阿图',
  WF: '瓦利斯和富图纳群岛',
  WS: '萨摩亚',
  XK: '科索沃',
  YE: '也门',
  YT: '马约特',
  ZA: '南非',
  ZM: '赞比亚',
  ZW: '津巴布韦'
}

class HBundle {
  constructor() {
    this.allGame = []
    this.selecedGame = []
    this.csrfToken = ''
    this.gamekey = ''
    this.hasDLc = false
    this.maskEle = null
    this.alertMessage = {
      kfail: `刮开失败！๐·°(৹˃̵﹏˂̵৹)°·๐`,
      sfail: `选择失败！๐·°(৹˃̵﹏˂̵৹)°·๐`,
      sok: `已经选好了！(๑˃́ꇴ˂̀๑)`,
      sre: `已经选过了！ヽ(#\`Д´)ﾉ`,
      kok: `已经刮好了！(๑˃́ꇴ˂̀๑)`,
      load: `正在请求...！(,,•́ . •̀,,)`,
      screen: `正在截图...！(,,•́ . •̀,,)`,
      screenOk: `已经截好了！(๑˃́ꇴ˂̀๑)`,
    }
  }
  async init() {
    this.initData(new DOMParser().parseFromString(await this.request({ url: location.href }, true), 'text/html'))

  }
  serialize(game, index, tpsds = [], name = '', childEditon = '') {
    const { machine_name, human_name: title, exclusive_countries: exclusive, disallowed_countries: disallowed, redeemed_key_val: key = '', steam_app_id: appid = '' } = game
    return {
      machine_name,
      title,
      exclusive,
      disallowed,
      appid,
      name,
      key,
      index,
      child_identifier: childEditon,
      children: tpsds.map((item, idx) => this.serialize(item, idx))
    }
  }
  getZhName(arr) {
    return arr.map(item => /中国|香港|台湾|澳门/.test(countryMap[item]) ? `<span class="_cn_lock_">${countryMap[item]}</span>` : countryMap[item]).join('、')
  }
  getLock(game) {
    if (game.exclusive.length) return `<span class="_only_lock_c_"><span class="_lock_c_text_">只能在</span>以下激活：${this.getZhName(game.exclusive)}</span>`
    if (game.disallowed.length) return `<span class="_not_only_lock_"><span class="_lock_c_text_">不能在</span>以下地区激活：${this.getZhName(game.disallowed)}<span>`
    return `<span class="_not_restrict_">无限制激活</span>`
  }
  ininView() {
    let selectNum = [], selectLi = []
    document.querySelectorAll('.js-content-choices .choice-image-container').forEach((item, index) => {
      const div = document.createElement('div')
      div.setAttribute('class', '_game_num_')
      div.innerText = index + 1
      item.appendChild(div)
    })
    this.allGame.forEach((item, index) => {
      selectNum.push(`<button>${index + 1}、${item.title}</button>`)
      selectLi.push(
        `
          <li>
            <div>
              <a class="_game_url_" href="https://store.steampowered.com/app/${item.appid}" target="_blank">${item.title}</a>
              <button class="_getkey_btn_${item.key ? ' current">已' : '">未'}刮开</button>
              <button class="_select_btn_${this.selecedGame.includes(item.name) ? ' current">已' : '">未'}选择</button>
              <input type="text" disabled ${item.key || 'hidden'} class="_click_key_" value="${item.key}" />
              <p class="_game_lock_c">${this.getLock(item)}</p>
            </div>
            ${item.children.reduce((a, b) =>
        (
          `${a}<div>
                  <a class="_game_url_" href="https://store.steampowered.com/app/${b.appid}" target="_blank">${b.title}</a>
                  <button class="_getkey_btn_${b.key ? ' current">已' : '">未'}刮开</button>
                  <button style="visibility: hidden"></button>
                  <input type="text" disabled ${b.key ? '' : 'hidden'} class="_click_key_" value="${b.key}" />
                  <p class="_game_lock_c">${this.getLock(b)}</p>
                </div>`
        )
          , '')}
          </li>
        `)
    })
    const allView = document.querySelector('.content-choices-view')
    const nextList = document.querySelector(".content-choice-tiles.js-content-choice-tiles")
    this.gameBox = document.createElement('div')
    this.gameBox.innerHTML = `
          <div>
            <div class="_option_ul_">
                <button>选择游戏(只选不刮)</button><button>刮开/提取</button><button>全选高亮</button><button>取消高亮</button><button>多选高亮截图</button>
            </div>
            <div class="_select_ul_">${selectNum.join('')}</div>
            <div class="_value_option_">
              <textarea disabled class="_key_value_"></textarea>
              <div><button class="_copy_">复制</button><button class="_clear_">清空</button></div>
            </div>
          </div>
          <div class="_mask_" hidden><div class="_alert_"></div></div>
          <div class="_sh_box_">
            <button class="_sh_hd_ current">隐藏锁区信息</button><span>注: 锁区信息仅供参考，以激活后的SUB为准！</span><a class="_down_page_" target="_blank" href="/downloads?key=${this.gamekey}">Download页面</a>
          </div>

          <ul class="_self_view_">
            ${selectLi.join('')}
          </ul>
        `
    allView.insertBefore(this.gameBox, nextList)
  }
  setTextValue(value) {
    this.textarea.value = value && (this.textarea.value + value)
  }
  alertFun(message, close = false) {
    const child = this.maskEle.firstElementChild
    child.innerHTML = message
    this.maskEle.hidden = false
    child.classList.add('_bunceIn_')
    if (close) return
    const time = setTimeout(() => {
      this.maskEle.hidden = true
      child.classList.remove('_bunceIn_')
      clearTimeout(time)
    }, 1200)
  }
  async handleSelect(btn, game, flag = true) {
    this.alertFun(this.alertMessage.load, true)
    const selectResult = await this.selectRequest([game])
    if (selectResult.force_refresh) {
      btn.classList.add('current')
      btn.innerHTML = '已选择'
    }
    flag && this.setTextValue(`${game.title}：选择${selectResult.force_refresh ? '成功' : '失败'}\n`)

    return selectResult
  }
  async handleGetKey(btn, game) {
    this.alertFun(this.alertMessage.load, true)
    const key = await this.getKeyRequest(game)
    if (key) {
      btn.classList.add('current')
      btn.innerHTML = '已刮开'
      const input = btn.nextElementSibling.nextElementSibling
      input.value = key
      input.hidden = false
      game.key = key
      this.setTextValue(`${game.title}\t${game.key}\n`)
    }
    this.alertFun(this.alertMessage[key ? 'kok' : 'kfail'])
  }
  initEvent() {
    const [selectKey, getKey, allLight, noLight, screenShot] = this.gameBox.querySelectorAll('._option_ul_ > button')
    const selectUl = this.gameBox.querySelector('._select_ul_')
    const [copyButton, clearButton] = this.gameBox.querySelectorAll('._value_option_ > div > button')
    const showButton = this.gameBox.querySelector('._sh_box_ ._sh_hd_')
    const listBox = this.gameBox.querySelector('._self_view_')
    const selectBtnList = listBox.querySelectorAll('._select_btn_')
    const getkeyBtnList = listBox.querySelectorAll('._getkey_btn_')
    this.maskEle = this.gameBox.querySelector('._mask_')
    const numButtonList = selectUl.querySelectorAll('button')
    let newAllGame = []

    this.hasDLc ? this.allGame.forEach(game => newAllGame.push(game) && game.children.forEach(childGame => newAllGame.push(childGame))) : (newAllGame = this.allGame)

    this.textarea = this.gameBox.querySelector('._value_option_ ._key_value_')

    selectBtnList.forEach((btn, index) => btn.addEventListener('click', async () => {
      if (btn.classList.contains('current')) return
      const game = this.allGame[index]
      const selectResult = await this.handleSelect(btn, game)
      this.alertFun(this.alertMessage[selectResult.force_refresh ? 'sok' : 'sfail'])
    }))
    getkeyBtnList.forEach((btn, index) => btn.addEventListener('click', async () => {
      if (btn.classList.contains('current')) return
      const game = newAllGame[index]
      if (game.name && !this.selecedGame.includes(game.name)) {
        const selectResult = await this.handleSelect(btn.nextElementSibling, game, false)
        if (!selectResult.force_refresh) return this.alertFun(this.alertMessage.kfail)
      }
      this.handleGetKey(btn, game)
    }))
    selectUl.addEventListener('click', (e) => e.target.nodeName === 'BUTTON' && e.target.classList.toggle('current'))
    allLight.addEventListener('click', () => numButtonList.forEach(item => item.classList.add('current')))
    noLight.addEventListener('click', () => numButtonList.forEach(item => item.classList.remove('current')))
    clearButton.addEventListener('click', () => this.setTextValue(''))
    getKey.addEventListener('click', async () => {
      this.setTextValue('')
      const needSelect = []
      const selectIndexList = []
      const needGetKey = []
      const dlcList = []
      numButtonList.forEach((item, index) => item.classList.contains('current') && selectIndexList.push(index))
      if (!selectIndexList.length) return
      selectIndexList.forEach(index => {
        const game = this.allGame[index]
        if (this.selecedGame.includes(game.name)) {
          game.key || needGetKey.push(game)
        } else {
          needSelect.push(game)
        }
        game.children.forEach(childGame => {
          if (!childGame.key) {
            dlcList.push(childGame)
            needGetKey.includes(game) || needGetKey.push(game)
          }
        })
      })
      if (needSelect.length || needGetKey.length || dlcList.length) this.alertFun(this.alertMessage.load, true)
      if (needSelect.length) {
        const selectResult = await this.selectRequest(needSelect)
        if (!selectResult.force_refresh) {
          this.setTextValue(needSelect.reduce((a, b) => `${a}${b.title}：选择失败\n`, ''))
          return this.alertFun(this.alertMessage.kfail)
        }
        needGetKey.push(...needSelect)
      }
      if (needGetKey.length || dlcList.length) {
        const result = await Promise.all(needGetKey.map(game => this.getKeyRequest(game)).concat(dlcList.map(childGame => this.getKeyRequest(childGame))))
        this.alertFun(this.alertMessage[result.every(key => key) ? 'kok' : 'kfail'])
      }
      this.setTextValue(selectIndexList.reduce((value, index) => {
        const game = this.allGame[index]
        return (value += `${game.title}\t${game.key || '请求失败'}\n${game.children.reduce((val, childGame) => `${val}${childGame.title}\t${childGame.key}\n`, '')}`)
      }, ''))
      needGetKey.forEach(game => {
        let keys = [game.key, ...game.children.map(childGame => childGame.key)]
        listBox.children[game.index].querySelectorAll('input').forEach((input, idx) => {
          const selectBtn = input.previousElementSibling
          const getKeyBtn = selectBtn.previousElementSibling
          getKeyBtn.innerHTML = '已刮开'
          getKeyBtn.classList.add('current')
          input.value = keys[idx]
          input.hidden = false
          if (idx) return
          selectBtn.innerHTML = '已选择'
          selectBtn.classList.add('current')
        })
      })
      selectIndexList.forEach(item => numButtonList[item].classList.remove('current'))
    })
    selectKey.addEventListener('click', async () => {
      this.setTextValue('')
      const needSelect = []
      const selectIndexList = []
      numButtonList.forEach((item, index) => item.classList.contains('current') && selectIndexList.push(index))
      selectIndexList.forEach(index => {
        const game = this.allGame[index]
        this.selecedGame.includes(game.name) || needSelect.push(game)
      })
      if (!needSelect.length) return this.alertFun(this.alertMessage.sre)

      this.alertFun(this.alertMessage.load)
      const selectResult = await this.selectRequest(needSelect)
      this.alertFun(this.alertMessage[selectResult.force_refresh ? 'sok' : 'sfail'], true)
      if (selectResult.force_refresh) {
        this.setTextValue(needSelect.reduce((value, game) => {
          const selectBtn = listBox.children[game.index].querySelector('._select_btn_')
          selectBtn.innerHTML = '已选择'
          selectBtn.classList.add('current')
          return `${value}${game.title}：选择成功\n`
        }, ''))
      } else {
        this.setTextValue(needSelect.reduce((a, b) => `${a}${b.title}：选择失败\n`, ''))
      }
      selectIndexList.forEach(item => numButtonList[item].classList.remove('current'))
    })
    copyButton.addEventListener('click', () => {
      if (!this.textarea.value.length) return
      this.textarea.disabled = false
      this.textarea.select()
      document.execCommand('copy')
      this.textarea.disabled = true

    })
    showButton.addEventListener('click', function () {
      const flag = this.classList.contains('current')
      listBox.classList.remove(flag ? '_slide_down_' : '_slide_up_')
      listBox.classList.add(flag ? '_slide_up_' : '_slide_down_')
      this.innerText = flag ? '显示锁区信息' : '隐藏锁区信息'
      this.classList.toggle('current')
    })

    screenShot.addEventListener('click', () => {
      const sAlert = this.maskEle.firstElementChild
      this.alertFun(this.alertMessage.screen, true)
      showButton.classList.contains('current') || showButton.click()
      const noSelectList = [], selectIndexList = []
      numButtonList.forEach((item, index) => {
        const flag = item.classList.contains('current');
        (flag && this.selecedGame.includes(this.allGame[index].name)) || noSelectList.push(index)
        if (!flag) return
        selectIndexList.push(index)
      })
      !selectIndexList.length || noSelectList.forEach(index => (listBox.children[index].hidden = true))
      html2canvas(listBox).then((canvas) => {
        sAlert.classList.add('_add_image_')
        this.alertFun(`<span>${this.alertMessage.screenOk}</span><img src=${canvas.toDataURL()}><span class="_white_">右键复制👆或者另存为</span>`, true)
        this.maskEle.onclick = () => {
          noSelectList.forEach(index => (listBox.children[index].hidden = false))
          this.maskEle.hidden = true
          sAlert.classList.remove('_add_image_')
          this.maskEle.onclick = null
          selectIndexList.forEach(item => numButtonList[item].classList.remove('current'))
        }
      })
    })
  }
  async initData(docHtml) {
    const script = docHtml.getElementById('webpack-monthly-product-data') || docHtml.getElementById('webpack-subscriber-hub-data')
    if (!script) return
    console.log(JSON.parse(script.innerText.trim()).contentChoiceOptions)
    const { contentChoiceOptions: { contentChoiceData, gamekey, contentChoicesMade, downloadPageUrl }, csrfTokenInput } = JSON.parse(script.innerText.trim())
    if (!gamekey) return
    const initialName = Object.keys(contentChoiceData).find(item => item !== 'extras' && item.includes('initial') && !item !== 'initial-without-order') || 'initial'
    let { content_choices, game_data, display_order, total_choices } = contentChoiceData[initialName] || contentChoiceData
    if(game_data) content_choices = game_data
    this.selecedGame = contentChoicesMade ? contentChoicesMade[initialName].choices_made : []
    //this.selecedGame = []
    this.gamekey = gamekey
    this.downloadPageUrl = downloadPageUrl
    this.csrfToken = (csrfTokenInput.match(/value=['"]([\w-_]+)['"]/) || []).pop()
    this.allGame = display_order.map((name, index) => {
      let obj = {}
      let tpsds = content_choices[name].tpkds ? content_choices[name].tpkds : content_choices[name].nested_choice_tpkds
      if (!Array.isArray(tpsds)) {
        const steamEdition = Object.keys(tpsds).find(item => item.includes('steam'))
        if (!steamEdition) return alert(`${name}数据有问题, 脚本不可用！๐·°(৹˃̵﹏˂̵৹)°·๐`)
        tpsds = tpsds[steamEdition]
        obj = this.serialize(tpsds.shift(), index, tpsds, name, steamEdition)
      } else {
        obj = this.serialize(tpsds.shift(), index, tpsds, name)
      }
      tpsds.length && (this.hasDLc = true)
      return obj
    })
    this.ininView()
    this.initEvent()
  }
  async selectRequest(gameList, parent_identifier) {
    const anotherEdition = []
    const formData = gameList.reduce((url, game) => {
      game.child_identifier && anotherEdition.push({ parent_identifier: game.name, name: game.child_identifier })
      return (url += `&chosen_identifiers[]=${game.name}`)
    }, '')
    const selectResult = await this.request(
      {
        method: 'POST',
        url: 'https://www.humblebundle.com/humbler/choosecontent',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'csrf-prevention-token': this.csrfToken,
          'x-requested-with': 'XMLHttpRequest'
        },
        body: `gamekey=${this.gamekey}&parent_identifier=${parent_identifier || 'initial'}${formData}`,
      })
    if (selectResult.force_refresh) {
      parent_identifier || gameList.forEach(game => this.selecedGame.includes(game.name) || this.selecedGame.push(game.name))
      for (const form of anotherEdition) {
        await this.selectRequest([form], form.parent_identifier)
      }
    }
    return selectResult
  }
  async getKeyRequest(game) {
    if (game.key) return game.key
    const { key } = await this.request({
      url: 'https://www.humblebundle.com/humbler/redeemkey',
      body: `keytype=${game.machine_name}&key=${this.gamekey}&keyindex=0`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      method: 'POST'
    })
    game.key = key || ''
    // getChild || await Promise.all(game.children.map(childGame => childGame.key || this.getKeyRequest(childGame, true)))
    return key
  }
  async request({ url, method, body, headers }, flag = false) {
    const res = await fetch(url, {
      method: method || 'GET',
      body: body || null,
      headers
    })
    if (res.status !== 200) return {}
    return await flag ? res.text() : res.json()
  }
}
new HBundle().init()
GM_addStyle(`._click_key_{border-radius:4px;outline:0;border:0;background-color:#454c5e;width:250px;padding:5px 0;text-align:center;float:right}._mask_{position:fixed;left:0;top:0;bottom:0;right:0;background-color:rgba(0,0,0,.3);z-index:999}._alert_{background-color:#c93756;border-radius:8px;box-shadow:0 0 15px #c93756;font-size:1.5em;position:absolute;text-align:center;left:50%;top:8vh;padding:0 30px;line-height:3em;transform:translateX(-50%)}._add_image_{background-color:#494f5c}._alert_ img{display:block;width:400px}._alert_ span{color:#c93756}._alert_ ._white_{color:#eaeaea}._bunceIn_{animation:bunceIn .3s forwards}._sh_box_>span{margin-left:20px;font-size:20px;color:#c93756}._sh_hd_{border:0;outline:0;color:#a4d7f5;background-image:linear-gradient(to bottom,rgba(47,137,188,1) 5%,rgba(23,67,92,1) 95%);margin:20px 0 0 20px;border-radius:5px;line-height:50px;padding:0 20px}._slide_down_{animation:slideDown .3s forwards}._slide_up_{animation:slideUp .3s forwards}@keyframes bunceIn{0%{transform:translateX(-50%) scale(0)}80%{transform:translateX(-50%) scale(1.2)}100%{transform:translateX(-50%) scale(1)}}@keyframes slideUp{0%{max-height:2000px}100%{max-height:0}}@keyframes slideDown{0%{max-height:0}100%{max-height:2000px}}._down_page_{float:right;padding:0 20px;border-radius:5px;height:50px;margin:20px 20px 0 0;line-height:50px;background:linear-gradient(to bottom,rgba(47,137,188,1) 5%,rgba(23,67,92,1) 95%);color:#a4d7f5;text-decoration:none}._key_value_{margin:20px 0 0 20px;width:650px;height:200px;resize:none;font-size:18px;color:#fff;outline:0;background-color:#454c5e;border:0}._option_ul_,._select_ul_{margin:0 0 0 20px;line-height:50px}._option_ul_>button,._select_ul_>button{border:0;outline:0;padding:0 20px;margin:20px 20px 0 0;border-radius:5px;font-size:16px;background-image:linear-gradient(to bottom,rgba(47,137,188,1) 5%,rgba(23,67,92,1) 95%)}._select_ul_>button{background:#454c5e}._select_ul_>button.current{background-image:linear-gradient(to top,#0c3483 0,#a2b6df 100%,#6b8cce 100%,#a2b6df 100%)}._value_option_{display:flex}._game_num_{width:100%;height:100%;position:absolute;left:0;top:0;z-index:1;background-color:rgba(0,0,0,.3);text-align:center;font-size:100px}._sh_hd_.current{background-image:linear-gradient(to top,#c71d6f 0,#d09693 100%);color:#fff}._self_view_{max-height:2000px;list-style:none;margin:20px 0 0 0;padding:0;overflow:hidden;background-color:#363c49}._self_view_>li ._only_lock_c_{color:#c69}._self_view_>li ._not_restrict_{color:#279b61}._self_view_>li ._not_only_lock_{color:#b0e2ff}._self_view_>li ._lock_c_text_{color:#c93756;font-size:20px}._self_view_>li ._game_lock_c{margin:15px 15px 15px 0}._self_view_>li ._cn_lock_{color:#c93756;font-size:20px}._self_view_>li ._game_url_{text-decoration:none;color:#169fe3}._self_view_>li{font-size:16px;padding:20px 0 0 20px;border-bottom:10px solid #454c5e}._self_view_>li button{border:0;outline:0;background-image:linear-gradient(to bottom,rgba(47,137,188,1) 5%,rgba(23,67,92,1) 95%);color:#a4d7f5;margin:0 10px;font-size:16px;border-radius:.8em;padding:5px 15px;width:100px;float:right}._copy_,._clear_{background:linear-gradient(to bottom,rgba(47,137,188,1) 5%,rgba(23,67,92,1) 95%);color:#a4d7f5;border-radius:5px;border:0;outline:0;font-size:16px;line-height:50px;text-align:center;margin:170px 0 0 20px;width:70px}._self_view_>li .current{opacity:.45}._self_view_>li:last-child{border:0}`)
})()