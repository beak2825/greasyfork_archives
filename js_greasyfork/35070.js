// ==UserScript==
// @namespace   https://greasyfork.org/en/users/131965-levinit
// @author      levinit
// @name        Bing Image Download Button
// @name:zh-CN  必应图片下载按钮
// @name:zh-TW  必應圖片下載按鈕
// @name:ko     Bing 이미지 다운로드 버튼
// @name:fr     Bouton de téléchargement d'image Bing
// @name:ja     Bing画像ダウンロードボタン
// @description Add an image download button on Bing's home page.
// @description:zh-CN  在必应首页添加一个图片下载按钮。
// @description:zh-TW  在必應首頁添加一个圖片下載按鈕。
// @description:ko    빙 홈페이지에 이미지 다운로드 버튼 추가
// @description:fr    Ajouter le bouton de téléchargement d'image à la page d'accueil Bing.
// @description:ja    Bingホームページに画像ダウンロードボタンを追加する。
// @match     *://cn.bing.com/*
// @match     *://www.bing.com/*
// @run-at      document-end
// @version     1.3.12
// @homepageURL   https://github.com/levinit/bing-image-download-button
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35070/Bing%20Image%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/35070/Bing%20Image%20Download%20Button.meta.js
// ==/UserScript==

const VERSION = '1.3.12'

const bingDownloadBtnConfig = {
  //下载按钮css样式
  btnStyles: {
    'color': '',
    'font-size': '1.5em',
    'padding': '0.25em',
    'border-radius': '0.25em',
    'box-shadow': '0 0 3 px rgba(125, 125, 125, 0.25)',
    'right': '20%',
    'top': '12.5%',
    'background': '#c3d1cf94',
    'position': 'fixed',
    'z-index': 9999
  },
  //下载按钮上的文字
  btnText() {
    let text = 'Download Today Bing Picture' //lang en
    switch (navigator.language.toLowerCase()) {
      case 'zh':
      case 'zh-cn':
      case 'zh-sg':
        text = '下载今日必应图片'
        break;
      case 'zh-tw':
      case 'zh-hk':
        text = '下載今日必應圖片'
        break;
      case 'ko':
      case 'ko_kr':
        text = '오늘의 빙 이미지 다운로드'
        break;
      case 'ja':
      case 'ja_jp':
        text = '今日のBing画像をダウンロードする'
        break
      case 'fr':
      case 'fr_be':
      case 'fr_ca':
      case 'fr_ch':
      case 'fr_fr':
      case 'fr_lu':
        text = 'Téléchargez les image de bing aujourd’hui'
        break
      default:
        break;
    }
    return text
  },
  //当前要下载的bing图片的信息
  imgInfo: {
    url: '',
    name: '',
    'name-rule': { //图片默认命名规则，true项的内容将写入到图片名中
      //图片名字信息来自于图片的url 一般形如 flower_12345_1920x1080 形式
      'baseName': true, //基础名字
      'imgNO': false, //数字编号
      'imgResolution': false, //分辨率
      'dateInfo': true, //日期信息（从浏览器中获取的操作系统日期信息）
      'description': true, //描述信息（bing首页右下角获取）
      'copyright': false //图片版权信息（同上）
    },
    //bing提供的图片分辨率 不设置则使用默认 默认分辨率一般和当前系统设置、显示器分辨率有关
    resolution: 'UHD', //1366x768 1280x720 1920x1080
    separator: '_', // 默认连接符
  },
  //设置菜单
  menuInfo: {
    menuWrapStyles: {
      'position': 'fixed',
      'z-index': '9',
      'right': '1%',
      'top': '5%',
      'font-size': '1.25em',
      'display': 'none'
    },
    //设置菜单相关标签的id值
    menuWrapId: 'bing-download-settings',
    resetBtnId: 'reset-menu-settings',
    closeBtnClass: 'close-settings-menu',
    saveBtnId: 'save-menu-settings'
  },
  //本项目信息
  about: {
    github: 'https://github.com/levinit/bing-image-download-button',
    greasyfork: 'https://greasyfork.org/zh-TW/scripts/35070-bing-image-download-button',
    version: VERSION
  },
  //本地存储使用的key 用于存储菜单中设置的信息
  localStoreKey: 'bingImgDownload'
}

//当前日期偏移量 本日为0 bing可以查看前7天图片 0-7

let dateOffset = 0

//从本地存储中取得设置的信息写入到bingDownloadBtn相关项中
function getSavedSettings(info) {
  if (localStorage.getItem(info.localStoreKey)) {
    //本地存储的设置信息
    const savedSettings = JSON.parse(localStorage.getItem(info.localStoreKey))
    const setSettings = function (settingsObj, savedSettingsObj) {
      //遍历本地存储的设置信息，写入到bingDownloadBtn设置菜单的各个项中
      for (const item in savedSettingsObj) {
        if (settingsObj.hasOwnProperty(item)) {
          settingsObj[item] = savedSettingsObj[item]
        }
      }
    }

    //向设置菜单中写入已经保存的图片设置项的信息（图片命名规则和分辨率)
    setSettings(info.imgInfo, savedSettings.imgInfo)

    //绑定点击上一个/下一个图片时更新日期信息的事件
    getDateOffset()
  }
}

let navEventBound = false
function getDateOffset() {
  if (navEventBound) return
  navEventBound = true
  const leftNav = document.getElementById("leftNav")
  const rightNav = document.getElementById("rightNav")
  if (leftNav) {
    leftNav.addEventListener('click', function (e) {
      e.preventDefault()
      dateOffset = dateOffset === -7 ? -7 : dateOffset - 1
    })
  }
  if (rightNav) {
    rightNav.addEventListener('click', function (e) {
      e.preventDefault()
      dateOffset = dateOffset === 0 ? 0 : dateOffset + 1
    })
  }
}

//-----获取图片信息(根据设置规则修改）
function getImgInfo(imgInfo) {
  const link = document.querySelector('a.downloadLink')
  if (!link) return
  let url = link.href.split('&rf')[0]
  //图片地址  根据分辨率设置修改图片地址 分辨率如1920x1080 如果未设置分辨率将使用默认分辨率
  url = imgInfo.resolution ? url.replace(/\d{4}x\d{3,4}/, imgInfo.resolution) : url
  console.log("img url is: ", url)
  /*图片名字  根据图片地址生成图片原始名字
  原始示例 AberystwythSeafront_ZH-CN9542789062_1920x1080.jpg
  原始名字分成三部分 baseName imgNO resolution
  */
  //原始名字去掉前面的OHR.字样 使用_分割
  const match = /id=.+?\.(jpg|png)/.exec(url)
  if (!match) {
    console.warn('图片URL格式异常，无法提取图片名')
    return
  }
  const nameInfo = match[0].replace('id=', '').replace(/^OHR\./, '').split('_')

  //图片格式
  const imgFormat = nameInfo[nameInfo.length - 1].split('.')[1]

  //初始化图片命名相关的项
  let [baseName, imgNO, resolution, description, copyright, dateInfo] = ['', '', '', '', '', '']

  //根据名字生成规则修改图片名字
  for (const rule in imgInfo['name-rule']) {
    const ruleValue = imgInfo['name-rule'][rule]
    if (ruleValue === true) {
      switch (rule) {
        case 'baseName':
          baseName = `${nameInfo[0]}`
          break;
        case 'imgNO':
          imgNO = nameInfo[1] ? nameInfo[1] : ''
          break;
        case 'imgResolution':
          resolution = nameInfo[2] ? nameInfo[2].split('.')[0] : ''
          break;
        case 'dateInfo':
          //日期 先从描述信息的日期中获取，如果没有则使用系统时间
          try {
            dateInfo = document.querySelector('.musCardCont a.title').href.match(/Date:%\d+_/)[0].slice(-9, -1)
          } catch (error) {
            console.log(error)
          } finally {
            if (dateInfo === '' || dateInfo === undefined) {
              const now = new Date()
              const imgDate = new Date(now.getTime() + dateOffset * (24 * 60 * 60 * 1000))
              dateInfo = `${imgDate.getFullYear()}-${imgDate.getMonth() + 1}-${imgDate.getDate()}`
            }
          }
          break;
        //图片描述
        case 'description':
          try {
            description = document.querySelector('.musCardCont a.title').textContent || ''
          } catch (e) {
            description = ''
          }
          break;
        //图片版权
        case 'copyright':
          try {
            copyright = document.querySelector('.musCardCont div.copyright').textContent || ''
          } catch (e) {
            copyright = ''
          }
          break;
        default:
          break;
      }
    }
  }
  // 使用自定义连接符拼接
  const separator = imgInfo.separator || '_'
  let nameArr = [baseName, imgNO, resolution, description, copyright, dateInfo].filter(Boolean)
  let name = nameArr.join(separator)
  // 清理多余连接符
  const sepReg = new RegExp(`[${separator === ' ' ? '\s' : separator}]{2,}`, 'g')
  name = name.replace(sepReg, separator).replace(new RegExp(`^[${separator === ' ' ? '\s' : separator}]+|[${separator === ' ' ? '\s' : separator}]+$`, 'g'), '')
  //如果图片没有名字只有后缀 强行给图片加上名字
  if (name === `.${imgFormat}`) {
    name = `${nameInfo[0]}.${imgFormat}`
  } else {
    name = `${name}.${imgFormat}`
  }

  //存储图片url及名字
  bingDownloadBtnConfig.imgInfo.url = url
  bingDownloadBtnConfig.imgInfo.name = name
}

//-------添加下载按钮
function addBtn(info) {
  const btn = document.createElement('a')
  btn.appendChild(document.createTextNode(info.btnText()))


  btn.style.cssText = (function (styles) {
    let btnCssText = ''
    for (let style in styles) {
      btnCssText += `${style}: ${styles[style]}; `
    }
    return btnCssText
  })(info.btnStyles)

  btn.href = info.imgInfo.url
  btn.download = info.imgInfo.name
  btn.title = `img name: ${info.imgInfo.name}
          右键打开设置菜单 | Right Click this button to open settings menu`
  document.body.appendChild(btn)

  //当光标移动到下载按钮上时立即更新图片下载信息
  btn.onmouseover = function () {
    // 注意：点击了前一天或后一天按钮后 需要刷新图片的下载地址
    getImgInfo(info.imgInfo)
    //将处理后的图片的url和name写入到下载按钮的属性中
    this.href = info.imgInfo.url
    this.download = info.imgInfo.name
  }

  //在下载按钮上右键可打开设置菜单
  btn.oncontextmenu = function (e) {
    e.preventDefault()
    document.getElementById(info.menuInfo.menuWrapId).style.display = 'block'
  }
}

//-----添加设置菜单
function addMenu(info) {
  const menuInfo = info.menuInfo
  // 如果菜单已存在则不再插入
  if (document.getElementById(menuInfo.menuWrapId)) return

  //先前已经存储的图像分辨率设置信息
  const savedImgResolution = info.imgInfo.resolution
  //先前已经存储的图像规则信息
  const savedImgNameRule = info.imgInfo['name-rule']

  const menuContent = `
  <fieldset id="btn-settings">
    <legend>settings</legend>
    <div class="settings-content">
      <ul class="img-infos">
        <header>
          Image Info
        </header>
        <li>
          <header>
            Image Name contains:
          </header>
          <div>
            <label>Base Name</label>
            <input class="img-info" type="checkbox" name="name-rule" checked data-img-name-rule="baseName" />
          </div>
          <div>
            <label>NO.</label>
            <input class="img-info" type="checkbox" name="name-rule" data-img-name-rule="imgNO"
              ${savedImgNameRule.imgNO ? 'checked' : ''} />
          </div>
          <div>
            <label>Resolution</label>
            <input class="img-info" type="checkbox" name="name-rule" data-img-name-rule="imgResolution"
              ${savedImgNameRule.imgResolution ? 'checked' : ''} />
          </div>
          <div>
            <label>Description</label>
            <input class="img-info" type="checkbox" name="name-rule" data-img-name-rule="description"
              ${savedImgNameRule.description ? 'checked' : ''} />
          </div>
          <div>
            <label>CopyRight</label>
            <input class="img-info" type="checkbox" name="name-rule" data-img-name-rule="copyright"
              ${savedImgNameRule.copyright ? 'checked' : ''} />
          </div>
          <div>
            <label>Date Info</label>
            <input class="img-info" type="checkbox" name="name-rule" data-img-name-rule="dateInfo"
              ${savedImgNameRule.dateInfo ? 'checked' : ''} />
          </div>
          <div style="display: flex; align-items: center; gap: 0.5em;">
            <label for="separator-select">Separator</label>
            <select id="separator-select" class="img-info" name="separator">
            <option value="_" ${info.imgInfo.separator === '_' ? 'selected' : ''}>_</option>
            <option value="-" ${info.imgInfo.separator === '-' ? 'selected' : ''}>-</option>
              <option value="," ${info.imgInfo.separator === ',' ? 'selected' : ''}>,</option>
              <option value=" " ${info.imgInfo.separator === ' ' ? 'selected' : ''}>Space</option>
              <option value="." ${info.imgInfo.separator === '.' ? 'selected' : ''}>.</option>
            </select>
          </div>
        </li>
        <li>
          <header>
            Image Resolution
          </header>
          <div>
            <label>UHD</label>
            <input class="img-info" type="radio" name="resolution" data-img-resolution="UHD"
              ${savedImgResolution === 'UHD' ? 'checked' : ''} />
          </div>
          <div>
            <label>1920x1080</label>
            <input class="img-info" type="radio" name="resolution" data-img-resolution="1920x1080"
              ${savedImgResolution === '1920x1080' ? 'checked' : ''} />
          </div>
          <div>
            <label>1366x768</label>
            <input class="img-info" type="radio" name="resolution" data-img-resolution="1366x768"
              ${savedImgResolution === '1366x768' ? 'checked' : ''} />
          </div>
          <div>
            <label>1280x720</label>
            <input class="img-info" type="radio" name="resolution" data-img-resolution="1280x720"
              ${savedImgResolution === '1280x720' ? 'checked' : ''} />
          </div>
          <div>
            <label>Default</label>
            <input class="img-info" type="radio" name="resolution" data-img-resolution="" ${savedImgResolution === ''
      ? 'checked' : ''} />
          </div>
        </li>
      </ul>
      <div class="about">
        <small>V${info.about.version}</small>
        <a href="${info.about.github}">GitHub</a>
        <a href="${info.about.greasyfork}">GreasyFork</a>
      </div>
    </div>
    <footer>
      <button id="${menuInfo.resetBtnId}" class="reset-btn">reset</button>
      <button id="${menuInfo.saveBtnId}" class="${menuInfo.closeBtnClass}">save</button>
      <button class="${menuInfo.closeBtnClass}">cancel</button>
    </footer>
  </fieldset>
  <style>
    #btn-settings {
      width: 300px;
      border: 1px dashed gainsboro;
      border-radius: 8px;
      box-shadow: 0 0 10px gainsboro;
      background-color: aliceblue;
    }

    #btn-settings legend {
      font-weight: bold;
      text-shadow: 0 0 2px gray;
      color: steelblue;
    }

    #btn-settings ul {
      padding: 0;
    }

    #btn-settings ul>header {
      width: 100%;
      border-bottom: 3px groove gainsboro;
      font-weight: bold;
      color: slategrey;
      text-shadow: 0 0 5px gainsboro;
      margin-bottom: 0.5em;
    }

    #btn-settings li {
      list-style-type: none;
      border-bottom: 1px dashed gainsboro;
      padding-bottom: 0.5em;
    }

    .img-infos li header {
      color: sienna;
      margin-bottom: 0.25em;
    }

    .img-infos li label {
      width: 80%;
      display: inline-block;
    }

    .img-infos .img-info {
      vertical-align:middle;
    }

    #btn-settings .about {
      text-align: right;
      margin-bottom: 1em;
    }

    #btn-settings .about a {
      margin-right: 1em;
      text-decoration: underline;
    }

    #btn-settings footer {
      text-align: right;
    }

    #btn-settings footer button {
      width: 88px;
      cursor: pointer;
      font-size: 1.2em;
      font-weight: bold;
      line-height: 1.25;
      text-align: center;
      padding: 0;
      color: teal;
    }

    #btn-settings footer .reset-btn {
      margin-right: 25px;
      color: tomato;
    }
  </style>
          `

  const menu = document.createElement('div')
  menu.innerHTML = menuContent
  menu.id = menuInfo.menuWrapId
  let cssText = ''
  for (const style in menuInfo.menuWrapStyles) {
    cssText += `${style}: ${menuInfo.menuWrapStyles[style]}; `
  }
  menu.style.cssText = cssText
  document.body.appendChild(menu)

  // 菜单事件绑定只绑定一次
  menu.onclick = function (e) {
    if (e.target.classList.contains(menuInfo.closeBtnClass)) {
      menu.style.display = 'none'
      if (e.target.id === menuInfo.saveBtnId) {
        localStorage.setItem(info.localStoreKey, JSON.stringify(getUserSettings(info)))
        getSavedSettings(info)
        getImgInfo(info.imgInfo)
      }
    }
    if (e.target.id === menuInfo.resetBtnId) {
      localStorage.removeItem(info.localStoreKey)
      getSavedSettings(info)
      getImgInfo(info.imgInfo)
    }
  }
}

//从本地存储获取已经保存的设置信息
function getUserSettings() {
  //btn-styles
  const btnStyles = {}

  for (const item of document.querySelectorAll('.btn-style')) {
    let value = item.value
    //未设置的属性 以及position设置中未选择的属性 忽略
    if (item.value === "" || item.previousElementSibling.type === 'radio' && item.previousElementSibling.checked === false) {
      continue
    }
    const property = item.getAttribute('data-property')
    btnStyles[property] = value
  }


  //img-info
  const imgInfo = {
    'name-rule': {}
  }

  for (const item of document.querySelectorAll('.img-info')) {
    switch (item.name) {
      //图片命名规则
      case 'name-rule':
        imgInfo['name-rule'][item.getAttribute('data-img-name-rule')] = item.checked
        break
      //分辨率
      case 'resolution':
        if (item.checked) {
          imgInfo.resolution = item.getAttribute('data-img-resolution')
        }
        break
      //文件名连接符
      case 'separator':
        imgInfo.separator = item.value
        break
      default:
        break
    }
  }
  return { btnStyles, imgInfo }
}


//+++++++++ 打开页面后的初始化 +++++++++
//从本地存储读取设置信息
getSavedSettings(bingDownloadBtnConfig)
//设置图片信息
getImgInfo(bingDownloadBtnConfig.imgInfo)
//添加下载按钮
addBtn(bingDownloadBtnConfig)
//添加设置菜单
addMenu(bingDownloadBtnConfig)

