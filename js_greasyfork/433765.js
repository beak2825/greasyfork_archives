// ==UserScript==
// @name         NoteCard
// @namespace    https://r.izyx.xyz/#NoteCard
// @version      1.3.1
// @description  Generate note for current page
// @author       You
// @match        http://*/*
// @match        https://*/*
// @icon         https://i.v2ex.co/r7SSpP92s.png
// @require      https://greasyfork.org/scripts/434834-mouseui/code/MouseUI.js?version=984836
// @require      https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @noframes
// @contributionURL https://r.izyx.xyz/?ref=noteCardScript#script
// @contributionAmount 6.66
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/433765/NoteCard.user.js
// @updateURL https://update.greasyfork.org/scripts/433765/NoteCard.meta.js
// ==/UserScript==

(function(){
  'use strict';
  const version = 'V1.2.0'  // 版本号，修改时要注意同时修改生成命令中的版本号
  const bookmarkletUrl = 'https://r.izyx.xyz/#note'  // 脚本发布页面
  const footQRSize = 65
  const urlQRSize = 177
  const cardData = {  // 笔记卡片的数据对象以及一些配置参数
    width: 720
  }
  const daysName = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.']
  let title = document.title
  let url = window.location.href

  // 创建画布对象
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  // 创建笔记输入界面
  const noteArea = document.createElement('div')
  const noteShadow = noteArea.attachShadow({mode: 'open'})
  /**
   * 数字两位化
   *
   * @param {number} num 0~99 的整数
   */
  const dbNum = num => num>9 ? num : '0'+num
  const getNowDate = (formatString, now=new Date()) => {
    const t = {
      YYYY : now.getFullYear(),
      MM: dbNum(now.getMonth()+1),
      DD: dbNum(now.getDate()),
      hh: dbNum(now.getHours()),
      mm: dbNum(now.getMinutes()),
      ss: dbNum(now.getSeconds()),
      EE: daysName[now.getDay()]
    }
    // 如果没有参数输入就返回当前的时间戳
    if(!formatString) return +now
    for(const k in t){
      const reg = new RegExp(k, 'g')
      formatString = formatString.replace(reg, t[k])
    }
    return formatString
  }
  /**
   * 画布文字逐行分割
   *
   * @param {object} ctx 画布上下文对象
   * @param {string} text 要写入的文字内容
   * @param {number} width 文字内容在画布中占据的宽度
   * @param {number} [indent=0] 段首缩进的宽度
   * @return {array} 二维数组，第1层是段落，第2层是段落中的每一行
   */
  const canvasTextSplit = (ctx, text, width, indent=0) => {
    if(text.replace(/\s/g, '').length === 0) return []
    const result = []
    // 先进行段落的分割
    const paragraphArray = text.replace(/(\r?\n\s*)+/g, '\n').split(/\s*\r?\n\s*/g)
    for(const p of paragraphArray){
      const linesInparagraph = []
      let nowLetter = 0
      for (let i = 0; i <= p.length; i++) {
        const thisLineWidth = linesInparagraph.length ? width : width-indent
        if (ctx.measureText(p.substring(nowLetter, i)).width > thisLineWidth) {
          linesInparagraph.push(p.substring(nowLetter, i-1))
          nowLetter = i-1
        }else if(i === p.length){
          linesInparagraph.push(p.substring(nowLetter, i))
        }
      }
      result.push(linesInparagraph)
    }
    return result
  }
  /**
   * 将段落数组中的文字绘制到画布
   *
   * @param {object} ctx 画布上下文对象
   * @param {array} paragraphs 二维数组，第1层是段落，第2层是段落中的每一行
   * @param {number} startX 起始的横坐标
   * @param {number} startY 起始的纵坐标
   * @param {number} lineHeight 行高
   * @param {number} [paragraphsMarginBottom=0] 段落底部的外部空间
   * @param {number} [indent=0] 段落首行的缩进
   * @return {number} 结束位置的纵坐标
   */
  const drawText = async(ctx, paragraphs, startX, startY, lineHeight, paragraphsMarginBottom=0, indent=0) => {
    let thisLineY = startY
    paragraphs.forEach((p, pIndex) => {
      p.forEach((line, lIndex)=>{
        const thisLineX = lIndex ? startX : startX + indent
        thisLineY += lineHeight
        ctx.fillText(line, thisLineX, thisLineY)
      })
      thisLineY += paragraphsMarginBottom
    })
    return thisLineY
  }
  /**
   * 计算绘制文字所需要占据的高度
   *
   * @param {array} paragraphs 二维数组，第1层是段落，第2层是段落中的每一行
   * @param {number} lineHeight 行高
   * @param {number} [paragraphsMarginBottom=0] 段落底部的外部空间
   * @return {number} 文字内容所占据的高度
   */
  const textNeedHeight = (paragraphs, lineHeight, paragraphsMarginBottom=0)=>{
    return (paragraphs.length-1) * paragraphsMarginBottom
          + paragraphs.flat().length * lineHeight
  }
  /**
   * 将 base64 格式的图片转换为 Blob 格式数据
   *
   * @param {string} dataUrl base64 格式的数据地址
   * @return {object} Blob 格式的图片数据
   */
  const dataURLtoBlob = dataUrl=>{
    const dataArr = dataUrl.split(',');
    const mime = dataArr[0].match(/:(.*?);/)[1];
    const bStr = atob(dataArr[1]);
    let n = bStr.length;
    const uint8Arr = new Uint8Array(n);
    while(n--){
        uint8Arr[n] = bStr.charCodeAt(n);
    }
    return new Blob([uint8Arr], {type:mime});
  }
  /**
   * 将画布保存为图片并自动进行下载
   *
   * @param {object} canvas 画布对象
   * @param {string} name 保存的文件名
   * @param {string} [type="png"] 文件图片的格式: png、jpeg、gif
   */
  const downloadImgFromCanvas = (canvas, name, type="png")=>{
    if(type==='jpg') type = 'jpeg'
    const imgDataUrl = canvas.toDataURL('image/'+type)
    // const imgData = canvas.toDataURL({format: 'png', quality:1, width:20000, height:4000})
    const blob = dataURLtoBlob(imgDataUrl)
    const blobUrl = URL.createObjectURL(blob)

    const imgDownloadLink = document.createElement('a')
    imgDownloadLink.download = name+'.'+(type==='jpeg' ? 'jpg' : type)
    imgDownloadLink.href = blobUrl
    imgDownloadLink.click();
  }
  /**
   * 重置画布对象
   *
   * @param {number} height 画布的高度
   * @param {string} fillColor 画布填充的背景颜色
   */
  const canvasRest =(height, fillColor)=>{
    canvas.width = cardData.width
    canvas.height = height
    ctx.fillStyle = fillColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  /**
   * 绘制双引号图标
   *对象
   * @param {number} width 符号的宽度,高度会自动按比例计算
   * @param {string} color 符号填充的颜色
   * @param {number} [isRightQuotes=0] 是否是右侧引号,默认为左侧引号
   * @return {object} 返回对象中包含画布中的图像数据和画布的高度
   */
  const drawQuotationMark = (canvas, ctx, width, color, isRightQuotes=0)=>{
    canvasRest(width*0.7, '#FFFFFF')

    const markIndex = [0, 1]
    markIndex.forEach(e => {
      const baseX = (0.25+e*0.5)*width
      const baseR = 0.22*width
      const baseY = isRightQuotes ? 0.25*width : canvas.height-0.25*width
      ctx.beginPath()
      if(isRightQuotes){
        ctx.arc(baseX-baseR*0.8, baseY, baseR*1.8, 0, Math.PI/2, false)
        ctx.arc(baseX-baseR*2.6, baseY, baseR*1.8*Math.sqrt(2), Math.PI*0.25, 0, true)
      }else{
        ctx.arc(baseX+baseR*0.8, baseY, baseR*1.8, Math.PI, -Math.PI/2, false)
        ctx.arc(baseX+baseR*2.6, baseY, baseR*1.8*Math.sqrt(2), -Math.PI*0.75, Math.PI, true)
      }
      ctx.fillStyle = color
      ctx.fill()
      ctx.beginPath()
      ctx.arc(baseX, baseY, baseR, 0, Math.PI*2, true)
      ctx.fillStyle = color
      ctx.fill()
    })
    return {
      canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      height: canvas.height
    }
  }
  /**
   * 复制文本内容
   *
   * @param {string} text 文本内容，可以是多行文本
   */
  const copyText = text => {
    const textArea = document.createElement('textarea')
    textArea.setAttribute('readonly', 'readonly')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
  /**
   * 生成日历部分
   *
   * @return {object} 画布片段对象，包含画布内容信息和画布高度
   */
  const calendarGenerator = async () => {
    const dayIndexInWeek = cardData.now.getDay()
    const weekStart = cardData.now - 8.64e7 * dayIndexInWeek
    const weekDays = new Array(7).fill().map((day, index)=>{
      return new Date(weekStart + 8.64e7 * index).getDate()
    })
    const baseLength = cardData.width/16
    const dateTextFontSize = cardData.width/12  // 720/36 = 20
    const dateTextY = dateTextFontSize*2
    const weekDaysFontSize = cardData.width/18  // 720/18 = 40
    const weekDaysY = dateTextY + weekDaysFontSize*2.5
    const weekDaysMarkCenterY = dateTextY + weekDaysFontSize*2

    canvasRest(weekDaysY + weekDaysFontSize + dateTextFontSize/2, '#FFFFFF')

    ctx.font = '900 '+dateTextFontSize+'px "Microsoft YaHei"'
    ctx.textAlign = "right"
    ctx.fillStyle = "#99999F"
    ctx.fillText(getNowDate('YYYY-MM', cardData.now), canvas.width/2-dateTextFontSize/2, dateTextY)
    ctx.font = '200 '+dateTextFontSize+'px "Microsoft YaHei"'
    ctx.textAlign = "left"
    ctx.fillStyle = "#99999F"
    ctx.fillText(getNowDate('hh:mm:ss', cardData.now), canvas.width/2+dateTextFontSize/2, dateTextY)

    ctx.textAlign = "center"
    weekDays.forEach((day, index)=>{
      const dayX = (index+1)*2*baseLength
      if(index === dayIndexInWeek){
        ctx.beginPath()
        ctx.arc(dayX, weekDaysMarkCenterY, baseLength*1.1, 0, Math.PI*2, true)
        ctx.fillStyle = "#E0626B"
        ctx.fill()
        ctx.fillStyle = '#FFFFFF'
      }else{
        ctx.fillStyle = "#333338"
      }
      ctx.font = '400 '+weekDaysFontSize+'px "Microsoft YaHei"'
      ctx.fillText(day, dayX, weekDaysY)
      if(!index || dayIndexInWeek===index){
        ctx.font = '200 '+(weekDaysFontSize*0.6)+'px "Microsoft YaHei"'
        ctx.fillText(daysName[index], dayX, weekDaysY-weekDaysFontSize)
      }
    })
    return {
      canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      height: canvas.height
    }
  }
  const urlQRgenerator = async()=>{
    const QREl = document.createElement('div')
    new QRCode(QREl, {
      text: url,
      width: urlQRSize,
      height: urlQRSize,
      colorDark : "#D6D6DE",
      colorLight : "#FFFFFF",
      correctLevel : QRCode.CorrectLevel.H
    })
    return {
      canvasData: QREl.querySelector('canvas').getContext('2d').getImageData(0, 0, urlQRSize, urlQRSize),
      height: urlQRSize
    }
  }
  /**
   * 生成引用来源
   *
   * @return {object} 画布片段对象，包含画布内容信息和画布高度
   */
  const quoteFromGenerator = async()=>{
    title = document.title
    url = window.location.href
    const fontSizeBase = cardData.width/40
    const lineHeight = fontSizeBase*1.2
    const paragraphsMarginBottom = fontSizeBase*0.4

    ctx.font = '200 '+fontSizeBase+'px "Microsoft YaHei"'
    const textAreaWidth = cardData.width*0.8-fontSizeBase*2 - (QRCode ? urlQRSize*1.2 : 0)
    const titleArr = canvasTextSplit(ctx, '——《'+title+'》', textAreaWidth,  -fontSizeBase*2)
    const urlArr = canvasTextSplit(ctx, url, textAreaWidth, 0)

    let height = cardData.width/10
                  + textNeedHeight(titleArr, lineHeight, 0)
                  + textNeedHeight(urlArr, lineHeight, 0)
                  + paragraphsMarginBottom
    if(QRCode && height<urlQRSize) height=urlQRSize
    canvasRest(height, '#FFFFFF')

    ctx.textAlign = "right"
    ctx.fillStyle = "#66666C"
    ctx.font = '200 '+fontSizeBase+'px "Microsoft YaHei"'
    await drawText(ctx, titleArr, cardData.width*0.9, 0-(lineHeight-fontSizeBase), lineHeight, paragraphsMarginBottom)
    await drawText(ctx, urlArr, cardData.width*0.9, 0-(lineHeight-fontSizeBase)+textNeedHeight(titleArr, lineHeight, 0)+paragraphsMarginBottom, lineHeight, paragraphsMarginBottom)

    return {
      canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      height: canvas.height
    }
  }
  /**
   * 生成引用部分
   *
   * @return {object} 画布片段对象，包含画布内容信息和画布高度
   */
  const quotesGenerator = async()=>{
    const fontSizeBase = cardData.width/24
    const lineHeight = fontSizeBase*1.6
    const paragraphsMarginBottom = fontSizeBase*0.8

    const quotesMarkWidth = fontSizeBase*8
    const quotesLeft = drawQuotationMark(canvas, ctx, quotesMarkWidth, '#F3F3F6', 0)
    const quotesRight = drawQuotationMark(canvas, ctx, quotesMarkWidth, '#F3F3F6', 1)

    ctx.font = '400 '+fontSizeBase+'px "Microsoft YaHei"'
    const quotesArr = canvasTextSplit(ctx, cardData.selection, cardData.width*0.8,  fontSizeBase*2)

    const quoteFrom = await quoteFromGenerator()
    const quoteHeight = textNeedHeight(quotesArr, lineHeight, paragraphsMarginBottom)+cardData.width/5

    canvasRest(quoteHeight+quoteFrom.height, '#FFFFFF')

    ctx.putImageData(quotesLeft.canvasData, 0, 0)
    ctx.putImageData(quotesRight.canvasData, canvas.width-quotesMarkWidth, quoteHeight-quotesRight.height)

    ctx.textAlign = "left"
    ctx.fillStyle = "#333338"
    ctx.font = '400 '+fontSizeBase+'px "Microsoft YaHei"'
    await drawText(ctx, quotesArr, cardData.width/10, cardData.width/10-(lineHeight-fontSizeBase), lineHeight, paragraphsMarginBottom, fontSizeBase*2)

    ctx.putImageData(quoteFrom.canvasData, 0, quoteHeight)

    if(QRCode){
      const urlQR = await urlQRgenerator()
      const borderWidth = 10
      const fromY = quoteFrom.height >= urlQRSize+cardData.width/20
                    ? quoteHeight
                    : quoteHeight + quoteFrom.height - urlQRSize - cardData.width/20
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cardData.width*0.1-borderWidth, fromY-borderWidth, urlQRSize+borderWidth, urlQRSize+borderWidth);
      ctx.putImageData(urlQR.canvasData, cardData.width*0.1, fromY)
    }
    return {
      canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      height: canvas.height
    }
  }
  /**
   * 生成笔记部分
   *
   * @return {object} 画布片段对象，包含画布内容信息和画布高度
   */
  const noteGenerator = async()=>{
    const fontSizeBase = cardData.width/24
    const lineHeight = fontSizeBase*1.6
    const paragraphsMarginBottom = fontSizeBase*0.8

    ctx.font = '400 '+fontSizeBase+'px "Microsoft YaHei"'
    const noteArr = canvasTextSplit(ctx, cardData.note, cardData.width*0.8,  fontSizeBase*2)

    canvasRest(textNeedHeight(noteArr, lineHeight, paragraphsMarginBottom)+cardData.width/10, '#FFFFFF')

    ctx.textAlign = "left"
    ctx.fillStyle = "#333338"
    ctx.font = '400 '+fontSizeBase+'px "Microsoft YaHei"'
    await drawText(ctx, noteArr, cardData.width/10, 0-(lineHeight-fontSizeBase), lineHeight, paragraphsMarginBottom, fontSizeBase*2)
    return {
      canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      height: canvas.height
    }
  }
  const footerQRgenerator = async()=>{
    const QREl = document.createElement('div')
    new QRCode(QREl, {
      text: bookmarkletUrl,
      width: footQRSize,
      height: footQRSize,
      colorDark : "#99999C",
      colorLight : "#F3F3F9",
      correctLevel : QRCode.CorrectLevel.H
    })
    return {
      canvasData: QREl.querySelector('canvas').getContext('2d').getImageData(0, 0, footQRSize, footQRSize),
      height: footQRSize
    }
  }
  /**
   * 生成页脚部分
   *
   * @return {object} 画布片段对象，包含画布内容信息和画布高度
   */
  const footerGenerator = async()=>{
    const fontSizeBase = cardData.width/48
    const canvasHeight = fontSizeBase+cardData.width/10 + (QRCode ? footQRSize+fontSizeBase/2 : 0)
    canvasRest(canvasHeight, '#F3F3F9')

    ctx.textAlign = "center"
    ctx.fillStyle = "#99999C"
    ctx.font = '400 '+fontSizeBase+'px "Microsoft YaHei"'
    ctx.fillText('网页笔记卡片生成器 '+version+'   '+bookmarkletUrl, cardData.width/2, cardData.width/20+fontSizeBase)
    if(QRCode){
      const QR = await footerQRgenerator()
      ctx.putImageData(QR.canvasData, (cardData.width-footQRSize)/2, cardData.width/20+fontSizeBase*2)
    }
    return {
      canvasData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      height: canvas.height
    }
  }
  /**
   * 笔记卡片生成方法
   *
   */
  const drawNoteCard = async () => {
    cardData.now = new Date()
    cardData.note = noteShadow.querySelector('textarea#quick-note').value.trim()
    // 生成日历部分
    const calendar = await calendarGenerator()
    const fragmentOfCard = [calendar]
    // 如果有选中的内容生成引用部分
    if(cardData.selection && cardData.selection.length){
      const quotes = await quotesGenerator()
      fragmentOfCard.push(quotes)
      // const quoteFrom = await quoteFromGenerator()
      // fragmentOfCard.push(quoteFrom)
    }
    // 如果有笔记内容，生成笔记部分
    if(cardData.note && cardData.note.length){
      const note = await noteGenerator()
      fragmentOfCard.push(note)
    }
    // 生成页尾部分
    const footer = await footerGenerator()
    fragmentOfCard.push(footer)
    // 将各部分片段拼接在一起
    canvas.width = cardData.width
    const totalHeight = fragmentOfCard.reduce((height, fragment)=>{
      return height+fragment.height
    }, 0)
    canvasRest(totalHeight, '#FFFFFF')

    let nowY = 0
    for(const fragment of fragmentOfCard){
      ctx.putImageData(fragment.canvasData, 0, nowY)
      nowY += fragment.height
    }
    // 下载图片
    downloadImgFromCanvas(canvas, getNowDate('YYYY_MM_DD_hh_mm_ss', cardData.now)+'_'+String(getNowDate(false, cardData.now)).substring(10), 'png')
  }
  /**
   * Markdown 代码生成
   *
   */
  const mdCodeGenerator = () => {
    let code = getNowDate('**YYYY-MM-DD** hh:mm:ss')+'\n\n'
    if(cardData.selection){
      code += '> '+cardData.selection.replace(/(\s*\r?\n\s*)+/g, '\n> \n> ') + '\n>\n'
      code += '> ——['+ title + ']('+url+')\n\n'
    }
    const note = noteShadow.querySelector('textarea#quick-note').value.trim()
    if(note){
      code += note.replace(/(\s*\r?\n\s*)+/g, '\n\n')
    }
    copyText(code)
  }
  /**
   * 退出脚本
   *
   */
  const exitScript = ()=>{
    noteShadow.querySelector('button#generate-note-card').removeEventListener('click', drawNoteCard)
    noteShadow.querySelector('button#generate-note-markdown').removeEventListener('click', mdCodeGenerator)
    noteShadow.querySelector('button#close').removeEventListener('click', exitScript)
    document.querySelector('html').removeChild(noteArea)
  }
  // 创建笔记输入框
  const showUI = ()=>{
    cardData.selection = window.getSelection().toString().trim()
    title = document.title
    url = window.location.href
    const style = (new MouseUI()).toString()
    noteShadow.innerHTML = `
    <style>`
      +style+`
      #note-card {
        height: 640px;
        max-height: 90vh;
        top: 10px;
        background-color: rgba(233, 233, 233, .8);
        backdrop-filter: blur(12px);
      }
      #quick-note {
        font-size: 24px;
      }
      #footer-tip {
        color: var(--Gray_2)
      }
      </style>
      <div
        id="note-card"
        class="mouse-root panel card mini-content-area fixed-center flex-area flex-ver"
      >
      <textarea
        id="quick-note"
        class="mini-content-area"
        placeholder="请在这里输入你的笔记……"
      ></textarea>
      <div id="button-area" class="button-group">
        <button class="note-card-button" id="generate-note-card">Card</button>
        <button class="note-card-button" id="generate-note-markdown">Markdown</button>
        <button class="note-card-button" id="close">Close</button>
      </div>
      <div id="footer-tip" class="text-center text-small">
        网页笔记卡片生成器 `+version+` <a href="`+bookmarkletUrl+`" target="_blank">`+bookmarkletUrl+`</a>
      </div>
    </div>
    `
    document.querySelector('html').appendChild(noteArea)
    noteShadow.querySelector('button#generate-note-card').addEventListener('click', drawNoteCard)
    noteShadow.querySelector('button#generate-note-markdown').addEventListener('click', mdCodeGenerator)
    noteShadow.querySelector('button#close').addEventListener('click', exitScript)
  }
  if(GM_registerMenuCommand){
    GM_registerMenuCommand('创建笔记卡片', showUI)

    GM_registerMenuCommand(
      '查看更多脚本',
      ()=>{
        window.open('https://r.izyx.xyz/?ref=noteCardScript#script', '_blank');
      })
  }
})()