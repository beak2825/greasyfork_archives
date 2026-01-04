// ==UserScript==
// @name         导出订单
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  导出抖店订单
// @author       大头肥猫
// @match        https://fxg.jinritemai.com/ffa/morder/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @require      https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/481352/%E5%AF%BC%E5%87%BA%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/481352/%E5%AF%BC%E5%87%BA%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  // Your code here...

  waitForElementToAppear('.auxo-table-tbody', () => {
    console.log('.auxo-table-tbody')
    if ($('.export-order').length == 0) {
      addButton('.index_batchOpWrap__paous')
    }
    
    if ($('.copy-img').length == 0) {
      addImageBtn()
    }

  }, 2000)
  
})()

const start = () => {
  findElement()
  // export2Excel()
}

const addImageBtn = () => {
  const listItem = Array.from($('.auxo-table-row-level-1'))

  for (let i = 0; i < listItem.length; i++) {
    const btnImageOutput = $('<button class="copy-img">复制图片</button>')
    $(listItem[i]).find('.auxo-table-selection-column').append(btnImageOutput)
  }

  $('.auxo-table-tbody').on('click', 'button', (e) => {
    const imgUrl = $($(e.target).parent().parent().find('img')[0]).attr('src')
    copyImage(imgUrl)
  })
}

const findElement = () => {
  const dataArr = []
  const orderList = Array.from($('.auxo-table-row-level-0'))
  const listItem = Array.from($('.auxo-table-row-level-1'))

  for (let i = 0; i < orderList.length; i++) {
    const orderId = $(orderList[i]).attr('data-row-key')
    let buyerInfo,
      name,
      phone,
      address = ''

    for (let j = 0; j < listItem.length; j++) {
      const orderItem = $(listItem.shift())

      if (j == 0) {
        name = orderItem.find('span.index_infoItem__ESU0o').eq(0).text()
        phone = orderItem.find('span.index_infoItem__ESU0o').eq(1).text()
        address = orderItem.find('span.index_infoItem__ESU0o').eq(2).text()
        buyerInfo = [name, phone, address].toString()
      }

      const orderSpec = orderItem.find('.style_desc__1MaH9').text()
      const orderTitle = orderItem.find('.style_name__3ChB9').text()
      const storeName = $('.index_userName__16Isl').text()
      const strs = orderSpec.split('x')
      const orderNum = strs[strs.length - 1]
      const orderPrice = orderItem.find('.table_yuan__3Govr').parent().text().slice(1, -2) * orderNum

      const dataObj = {
        订单ID: orderId,
        姓名: storeName,
        产品标题: orderTitle,
        图片: '',
        规格: orderSpec,
        价格: orderPrice,
        采购价: '',
        空行: '',
        地址: '张乐超18266967615 浙江省义乌市江东街道大元村马坊院7栋2单元地下室（张乐超）' + orderId,
      }
      //价格不为0且有地址时才push
       if (dataObj.价格 != 0) {
         dataArr.push(dataObj)
       }

      if (orderItem.attr('class').indexOf('auxo-pair-group-row-last') != -1) {
        break
      }
    }
  }
  // 创建工作簿
  const workbook = XLSX.utils.book_new()
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(dataArr)
  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  // 导出 Excel 文件
  XLSX.writeFile(workbook, `${Date.now()}_orderList.xlsx`)

  console.log(dataArr)
}

const export2Excel = async () => {
  const wb = new ExcelJS.Workbook()
  const worksheet = wb.addWorksheet('sheet1')

  const dataUrl = await url2Base64Async(
    '//p3-aio.ecombdimg.com/ecom-shop-material/PmrbjfLV_m_61fcd9da317266fb87573729a904881f_sx_293526_www800-800~tplv-qzsgku4lz6-fxg-image:480:q75.image'
  )
  const imageId = wb.addImage({ base64: dataUrl, extension: 'png' })
  worksheet.addImage(imageId, `${String.fromCharCode(65 + 0 * 6)}1:${String.fromCharCode(
    70 + 0 * 6
)}16`)
  wb.xlsx
    .writeBuffer()
    .then(buffer => saveAs(new Blob([buffer]), `${Date.now()}_feedback.xlsx`))
    .catch(err => console.log('Error writing excel export', err))
}

const img2Base64 = image => {
  let canvas = document.createElement('canvas')
  let width = image.width
  let height = image.height

  canvas.width = width
  canvas.height = height
  let context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/png')
}

const url2Base64 = (url, callback) => {
  let image = new Image()

  image.setAttribute('crossOrigin', 'Anonymous')
  image.src = url + '?v=' + Math.random()
  image.onload = function () {
    let dataURL = img2Base64(image)
    if (callback) {
      callback(dataURL)
    }
  }
}

const url2Base64Async = url => {
  return new Promise((resolve, reject) => {
    url2Base64(url, data => {
      resolve(data)
    })
  })
}

function copyImage(url) {
  // var imgSrc = 'https://p3-aio.ecombdimg.com/ecom-shop-material/ybrkWYBe_m_41539adae41be9823d1f358de7a76cc9_sx_420177_www800-800~tplv-qzsgku4lz6-fxg-image:480:q75.image'
  let imgSrc = url

  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var img = new Image()
  img.setAttribute("crossOrigin",'Anonymous')

  img.onload = function () {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)

    canvas.toBlob(blob => {
      let data = [new ClipboardItem({ [blob.type]: blob })]
      navigator.clipboard.write(data).then(
        () => {
          console.log('success')
        },
        err => {
          console.error(err)
          alert('复制失败:' + err)
        },
      );

    })

  }

  img.src = imgSrc
}

const addButton = parent => {
  const attrElement = $(parent)
  const btn = $('<button class="export-order">导出订单</button>')

  attrElement.append(btn)
  
  btn.css('margin-left', '10px')


  btn.click(async event => {
    event.stopPropagation()
    event.preventDefault()
    start()
  })
}

// 检查某个元素是否出现
function waitForElementToAppear(elementSelector, callback, intervalMs) {
  var checkInterval = setInterval(function () {
    var element = $(elementSelector)
    if (element.length > 0) {
      callback(element)
      // clearInterval(checkInterval)
    }
  }, intervalMs)
}
