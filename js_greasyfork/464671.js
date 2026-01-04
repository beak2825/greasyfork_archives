// ==UserScript==
// @name         Firebase批量创建表单
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  通过创建excel批量上传表单
// @author       zjl
// @match        https://console.firebase.google.com/project/*
// @icon         https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/favicon.ic
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464671/Firebase%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/464671/Firebase%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==

; (async function () {
    'use strict'
    // Your code here...
    var goLink
    var result
    var count = 0
    var rate = 600
    var url = window.location.href
    var index = 0
    var len = 0
    var diy
    var user_choice
    if (/index=(\d+)/.exec(url)) {
      index = /index=(\d+)/.exec(url)[1]
    }
    let results = await GM.getValue('excel', [])
    len = results.length
    result = results[index]
    goLink = await GM.getValue('goLink', '')
    diy = await GM.getValue('diy', [])
    user_choice = await GM.getValue('user_choice', [])
    if (
      RegExp(
        /https:\/\/console\.firebase\.google\.com\/project\/[\w-]+\/messaging/
      ).test(url)
    ) {
      checkObj('.filter-chips-row', function (obj) {
        const regex = /\/project\/(.+?)\//
        const match = url.match(regex)
        const projectId = match[1]
        goLink = `https://console.firebase.google.com/project/${projectId}/notification/compose`
        addExcel()
      })
    } else if (
      RegExp(
        /https:\/\/console\.firebase\.google\.com\/project\/[\w-]+\/notification\/compose/
      ).test(url)
    ) {
      if (/campaignId=(\d+)/.exec(url)) {
        return
      } else {
        //执行函数
        checkObj('.banner-content', function (obj) {
          Do()
        })
      }
    }
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
    async function checkObj(selection, fn) {
      while (true) {
        // 每隔一段时间刷新页面
        await sleep(1500)
        let obj = $(selection).eq(0) //声明要查询的对象
        // 判断Target2列表是不是加载失败
        if(selection==`option-title:contains('App')`&& $(`.error:contains(' There was an error loading targeting options. ')`).eq(0).length>0){
            window.location.reload()
            break
        }
        if (obj && obj.length > 0) {
          $('.mat-drawer-backdrop.mat-drawer-shown.ng-star-inserted').click()
          //判断对象是否存在，存在则开始设置值
          fn(obj)
          break
        }
      }
    }
  
    function padding(fn) {
      count += 1
      var timer = setTimeout(() => {
        fn()
        clearTimeout(timer)
      }, count * rate)
    }
    function formatDate(serial, format) {
      var utc_days = Math.floor(serial - 25569)
      var utc_value = utc_days * 86400
      var date_info = new Date(utc_value * 1000)
      var fractional_day = serial - Math.floor(serial) + 0.0000001
      var total_seconds = Math.floor(86400 * fractional_day)
      var seconds = total_seconds % 60
      total_seconds -= seconds
      var hours = Math.floor(total_seconds / (60 * 60))
      var minutes = Math.floor(total_seconds / 60) % 60
      var daytime = new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      )
      var returnDate = date_info.getFullYear()
      returnDate +=
        format +
        (date_info.getMonth() < 9
          ? '0' + (date_info.getMonth() + 1)
          : date_info.getMonth() + 1)
      returnDate += format + date_info.getDate()
      returnDate +=
        ' ' +
        (daytime.getHours() < 10 ? '0' + daytime.getHours() : daytime.getHours())
      returnDate +=
        ':' +
        (daytime.getMinutes() < 10
          ? '0' + daytime.getMinutes()
          : daytime.getMinutes())
      return returnDate
    }
    function step1() {
      return new Promise((resolve) => {
        padding(() => {
          $('.message-title').focus()
          document.execCommand('inserttext', false, result['推送标题'])
        })
        padding(() => {
          $('.message-text').focus()
          document.execCommand('inserttext', false, result['推送文案'])
        })
        padding(() => {
          if (result['推送资源名称']) {
            $('.message-label').focus()
            document.execCommand('inserttext', false, result['推送资源名称'])
          }
        })
        padding(() => {
          $('.notification-image-input').focus()
          document.execCommand('inserttext', false, result['图片链接'])
        })
        padding(() => {
          Array.from(document.querySelectorAll('span')).filter((e) => { if (e.textContent.trim() == 'Next') { return true } return false })[0].click()
        })
        resolve()
      })
    }
    function step2() {
      return new Promise((resolve) => {
        checkObj(`option-title:contains('App')`, () => {
          padding(() => {
            $('.mat-mdc-select-value').eq(0).click()
          })
          padding(() => {
            $(`.mat-mdc-option:contains(${result['定向应用']})`).eq(0).click()
          })
          let value_index = 1
          let input_index = 0
          for (let i = 0; i < user_choice.length; i += 3) {
            let index = i / 3
            if (result[user_choice[i]]) {
              let data1 = result[user_choice[i]]
              let data2 = result[user_choice[i + 1]]
              let data3 = result[user_choice[i + 2]]
              padding(() => {
                document.querySelectorAll('[aria-label="Add additional targeting criteria"]')[index].click()
              })
              padding(() => {
                document.querySelectorAll('[aria-label="Select condition type"]')[index + 1].click()
                $(`option-title:contains(${data1})`).click()
              })
              padding(() => {
                $('.mat-mdc-select-value').eq(value_index).click()
                value_index += 1
                $(`.mat-mdc-option.mdc-list-item:contains(${data2})`).click()
              })
              if (data1 == 'First open' || data1 == 'Last app engagement') {
                if (data2 == 'Between') {
                  padding(() => {
                    let inputElement = data3.split('/')
                    $('.ng-star-inserted input.compact').eq(input_index).focus()
                    document.execCommand('inserttext', false, inputElement[0])
                    $('.ng-star-inserted input.compact')
                      .eq(input_index + 1)
                      .focus()
                    document.execCommand('inserttext', false, inputElement[1])
                    input_index += 2
                  })
                } else {
                  padding(() => {
                    $('.ng-star-inserted input.compact').eq(input_index).focus()
                    document.execCommand('inserttext', false, data3)
                    input_index += 1
                  })
                }
              } else {
                padding(() => {
                  $('.mat-mdc-select-value').eq(value_index).click()
                  value_index += 1
                })
                padding(() => {
                  let clickElement = data3.split('/')
                  for (let i = 0; i < clickElement.length; i++) {
                    if (clickElement[i] == 'Select all') {
                      $('.mat-checkbox-layout').eq(0).click()
                    } else {
                      $(`enumerated-option:contains(${clickElement[i]})`).click()
                    }
                  }
                })
              }
              padding(() => {
                $('.cdk-overlay-backdrop-showing').eq(0).click()
              })
            }
          }
          padding(() => {
            $('.cdk-overlay-backdrop-showing').eq(0).click()
          })
          padding(() => {
            Array.from(document.querySelectorAll('span')).filter((e) => { if (e.textContent.trim() == 'Next') { return true } return false })[1].click()
          })
          resolve()
        })
      })
    }
    function step3() {
      var monthEnglish = new Map()
      monthEnglish.set('01', 'JAN')
      monthEnglish.set('02', 'FEB')
      monthEnglish.set('03', 'MAR')
      monthEnglish.set('04', 'APR')
      monthEnglish.set('05', 'MAY')
      monthEnglish.set('06', 'JUN')
      monthEnglish.set('07', 'JUL')
      monthEnglish.set('08', 'AUG')
      monthEnglish.set('09', 'SEP')
      monthEnglish.set('10', 'OCT')
      monthEnglish.set('11', 'NOV')
      monthEnglish.set('12', 'DEC')
      let PushDateTime = formatDate(
        result['推送日期'] - 0 + (result['推送时间'] - 0),
        '/'
      )
      let PushDate = PushDateTime.split(' ')[0]
      let PushTime = PushDateTime.split(' ')[1]
      var nowDay = PushDate.split('/')[2]
      var nowMonth = PushDate.split('/')[1]
      var nowMonthFlag = monthEnglish.get(`${nowMonth + ''}`)
      var excelDataTime = new Date(`${PushDate} ${PushTime}`)
      var nowTime = new Date()
      return new Promise((resolve) => {
        if (excelDataTime < nowTime) {
          padding(() => {
            alert('表格时间小于当前时间')
          })
        } else {
          padding(() => {
            $("input.mat-mdc-menu-trigger.can-recur").click()
          })
          padding(() => {
            $('.mat-mdc-menu-item.mat-focus-indicator.mat-mdc-menu-trigger.mat-mdc-menu-item-submenu-trigger').click()
          })
          padding(() => {
            for (let i = 1; i <= 12; i++) {
              if ($(`tr:contains(${nowMonthFlag})`).length > 0) {
                break
              } else {
                $('.mat-calendar-next-button').eq(0).click()
              }
            }
            $(
              `.mat-calendar-body-cell-content.mat-focus-indicator:contains(${nowDay})`
            )
              .eq(0)
              .click()
          })
          padding(() => {
            $('.c5e-input-container.dense.ng-star-inserted')
              .eq(0)
              .children(':first-child')
              .attr('type', 'text')
            $('.c5e-input-container.dense.ng-star-inserted')
              .eq(0)
              .children(':first-child')
              .val('')
            $('.c5e-input-container.dense.ng-star-inserted')
              .eq(0)
              .children(':first-child')
              .focus()
            document.execCommand('inserttext', false, PushTime + '')
            if (result['时区']) {
              $('fcm-timezonepicker[defaultvalue="Recipient time zone"]')
                .children(':first-child')
                .children(':first-child')
                .click()
              $(`button:contains(\"${result['时区']}"\)`).eq(0).click()
            }
            if (document.querySelector(".mat-mdc-menu-trigger.can-recur").value !== "Now") {
              Array.from(document.querySelectorAll('span')).filter((e) => { if (e.textContent.trim() == 'Next') { return true } return false })[2].click()
            } else {
              alert('选择时间错误！')
            }
          })
          resolve()
        }
      })
    }
    function step4() {
      return new Promise((resolve) => {
        padding(() => {
          $('.c5e-input-element.trigger-btn').eq(0).click()
        })
        padding(() => {
          $(`button:contains(${result['转化事件']})`).eq(0).click()
          if (document.querySelector(".mat-mdc-menu-trigger.can-recur").value !== "Now") {
            Array.from(document.querySelectorAll('span')).filter((e) => { if (e.textContent.trim() == 'Next') { return true } return false })[3].click()
          }
        })
        resolve()
      })
    }
    function step5() {
      return new Promise((resolve) => {
        padding(() => {
          let index = 0
          for (let i = 0; i < diy.length; i += 2) {
            if (result[diy[i + 1]] || result[diy[i + 1]] == '0') {
              //$('.cdk-overlay-backdrop').remove()
              //$('.cdk-overlay-connected-position-bounding-box').remove()
              document
                .querySelectorAll(
                  '.c5e-input-container.gcm-high-density-container.key'
                )
              [index].childNodes[0].focus()
              document.execCommand('inserttext', false, result[diy[i]])
              document
                .querySelectorAll(
                  '.c5e-input-container.gcm-high-density-container.value'
                )
              [index].childNodes[0].focus()
              document.execCommand('inserttext', false, result[diy[i + 1]])
              index += 1
            }
          }
        })
        padding(() => {
  
          // $("div[cdk-overlay-origin]").remove()
  
          //$('.cdk-overlay-backdrop').remove()
          //$('.cdk-overlay-connected-position-bounding-box').remove()
          //$('label:contains(Sound)')
          //    .next('mat-select')
          //    .find('.mat-select-min-line')
          //    .click()
          $("label:contains(Sound)").next().children().click()
          // $('.mat-mdc-select-trigger')[0].click()
          $(`.mat-mdc-option:contains(${result['声音']})`).eq(0).click()
          $('.mat-vertical-stepper-content').eq(4).click()
  
  
  
  
          let expires_time = result['过期时间1']
          //$('label:contains(Expires)')
          //    .next('div')
          //    .find('.mat-select-trigger')
          //    .eq(0)
          //    .click()
          $("label:contains(Expires)").next().find("div[cdk-overlay-origin]").eq(0).click()
          // $('.mat-mdc-select-trigger')[$('label:contains(Apple badge)').length > 0 ? 2 : 1].click()
          $(`.mdc-list-item__primary-text:contains(${expires_time})`).click()
          // $('.mat-mdc-option')
          //     .filter(`span:contains(${expires_time})`)
          //     .eq(0)
          //     .click()
          $('.mat-vertical-stepper-content').eq(4).click()
  
  
          let expires_day = result['过期时间2']
          //$('label:contains(Expires)')
          //    .next('div')
          //    .find('.mat-select-trigger')
          //    .eq(1)
          //    .click()
          // $('.mat-mdc-select-trigger')[$('label:contains(Apple badge)').length > 0 ? 3 : 2].click()
          if (expires_day == "Days" || expires_day == "days") {
            $("label:contains(Expires)").next().find("div[cdk-overlay-origin]").eq(1).click()
            $(`.mdc-list-item__primary-text:contains(days)`).click()
            document.querySelector('.cdk-overlay-backdrop').click()
            $("label:contains(Expires)").next().find("div[cdk-overlay-origin]").eq(1).click()
            $(`.mdc-list-item__primary-text:contains(Days)`).click()
            document.querySelector('.cdk-overlay-backdrop').click()
          } else {
            $("label:contains(Expires)").next().find("div[cdk-overlay-origin]").eq(1).click()
            $(`.mdc-list-item__primary-text:contains(${expires_day})`).click()
          }
  
          // $('.mat-mdc-option')
          //     .filter(`span:contains(${expires_day})`)
          //     .eq(0)
          //     .click()
        })
        resolve()
      })
    }
    function setp5_5() {
      return new Promise((resolve) => {
        padding(() => {
          if ($('label:contains(Apple badge)').length > 0) {
            if (result['Apple Badge']) {
              console.log('enter')
              $('.cdk-overlay-backdrop').remove()
              $('.cdk-overlay-connected-position-bounding-box').remove()
              // $('label:contains(Apple badge)')
              //     .next('mat-select')
              //     .find('.mat-select-min-line')
              //     .click()
              $('label:contains(Apple badge)').next().find("div[cdk-overlay-origin]").eq(0).click()
              $(`.mat-mdc-option:contains(${result['Apple Badge']})`).eq(0).click()
              // $('.mat-mdc-select-trigger')[1].click()
  
  
              if (result['Apple Badge'] === 'Enabled') {
                $('label:contains(Badge Count)').next().val('');
                $('label:contains(Badge Count)').next().focus()
                document.execCommand('inserttext', false, result['Badge Count'])
              }
  
            }
          }
        })
        resolve()
      })
    }
    function check5() {
      return new Promise((resolve) => {
        padding(() => {
          if (document.querySelector(".mat-mdc-menu-trigger.can-recur").value == "Now") {
            console.log('选择时间错误！')
          } else if ($("label:contains(Sound)").next().children().find("span:contains(Enabled)").length <= 0) {
            alert("声音没选！")
          } else if ($('label:contains(Apple badge)').length > 0 && ($('label:contains(Apple badge)').next().find("span:contains(Enabled)").length <= 0 || +$('label:contains(Badge Count)').next().val() <= 0)) {
            alert("Apple badge 或者 Badge Count 选项填写错误！")
          } else if ($("label:contains(Expires)").next().find("span:contains(4)").length > 0 && ($("label:contains(Expires)").next().find("span:contains(Weeks)").length > 0 || $("label:contains(Expires)").next().find("span:contains(weeks)").length > 0)) {
            alert("过期时间选项填写错误！")
          } else {
            resolve()
          }
        })
  
      })
    }
    function step6() {
      return new Promise((resolve) => {
        setTimeout(() => {
          $('button:contains(Review)').eq(0).click()
          checkObj('button:contains(Publish)', function () {
            $('button:contains(Publish)').eq(0).click()
            if (parseInt(index) < len - 1) {
              openTab(parseInt(index) + 1)
            }
          })
          resolve()
        }, 3000)
      })
    }
    async function Do() {
      await step1()
      await step2()
      await step3()
      await step4()
      await step5()
      await setp5_5()
      await check5()
      await step6()
    }
    function getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        // let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) {
          let hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
      }
      return headers
    }
    function openTab(index) {
      GM_openInTab(`${goLink}?index=${index}`, { active: true })
    }
    function getExcelData(rawFile) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const header = getHeaderRow(worksheet)
        const results = XLSX.utils.sheet_to_json(worksheet)
        console.log(header, results)
        let diy = header.filter((e) => {
          return e.indexOf('自定义') != -1
        })
        let user_choice = header.filter((e) => {
          return e.indexOf('用户选择') != -1
        })
        await GM.setValue('excel', results)
        await GM.setValue('goLink', goLink)
        await GM.setValue('diy', diy)
        await GM.setValue('user_choice', user_choice)
        if (results.length > 0) {
          openTab(0)
        }
      }
      reader.readAsArrayBuffer(rawFile)
    }
    function addExcel() {
      if ($('#upExcel')) {
        $('#upExcel').remove()
        $('#upExcelLabel').remove()
      }
      var button = document.createElement('input')
      button.setAttribute('type', 'file')
      button.setAttribute('id', 'upExcel')
      button.style.display = 'none'
      button.textContent = '上传excel'
      button.addEventListener('change', (event) => {
        getExcelData(event.target.files[0])
      })
      var label = document.createElement('label')
      label.setAttribute('for', 'upExcel')
      label.setAttribute('id', 'upExcelLabel')
      var conten = document.createElement('div')
      conten.setAttribute('id', 'uploadContent')
      conten.textContent = '上传Excel'
      label.append(conten)
      $('.ng-star-inserted').eq(0).prepend(label)
      $('.ng-star-inserted').eq(0).prepend(button)
      $('#uploadContent').css({
        width: '80px',
        'background-color': 'orange',
        'text-align': 'center',
        'font-size': '12px',
        'border-radius': '5px',
        padding: '5px 10px'
      })
    }
  })()