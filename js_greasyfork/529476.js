// ==UserScript==
// @name         BIT 新版物理实验选课系统增强
// @namespace    http://tampermonkey.net/
// @version      2025-03-11
// @description  史山破破烂烂，小猫缝缝补补
// @author       Charlie
// @match        https://xk.bit.edu.cn/*
// @match        https://webvpn.bit.edu.cn/https/*/xsxkapp/sys/xsxkapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bit.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529476/BIT%20%E6%96%B0%E7%89%88%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/529476/BIT%20%E6%96%B0%E7%89%88%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

const style = document.createElement('style')
document.head.appendChild(style)
style.textContent = `
.cv-public-course .cv-list>.cv-body>.cv-row>.cv-setting-col { width: unset; }
`

// 持久化
sessionStorage.token = localStorage.token
sessionStorage.getItem = key => localStorage.getItem(key)
sessionStorage.removeItem = key => localStorage.removeItem(key)
sessionStorage.setItem = (key, value) => {
  localStorage.setItem(key, value)
  sessionStorage.token = localStorage.token
}

const ob = new MutationObserver(() => {
  // Polyfill
  async function initCourseprogramGroup($row, callBack) {
    const packagetype = $row.attr('packagetype')
    const studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'))
    const param = {
      courseCode: $row.attr('coursenumber'),
      studentCode: studentInfo.code,
      batchCode: studentInfo.electiveBatch.code,
      programCode: '',
    }
    if (packagetype == '02' || packagetype == '05') {
      param.programCode = $row
        .find('.program-item.cv-active')
        .attr('programCode')
    }
    return queryCourseprogramGroup(param).done(res => {
      let html = $('#tpl-expcourse-group-list').html()
      const rowhtml = $('#tpl-expcourse-group-list-row').html()
      let bodyHtml = ''
      if (res.dataList && res.dataList.length > 0) {
        const uuid = getUuid()
        let display = ''
        const distinctList = []
        $.each(res.dataList, function (index, obj) {
          let cfflag = false
          $.each(distinctList, function (index1, obj1) {
            if (obj.expGroupCode == obj1.expGroupCode) {
              cfflag = true
            }
          })
          if (!cfflag) {
            distinctList.push(obj)
          }
        })
        $.each(distinctList, function (index, obj) {
          obj = dealEmptyData(obj)
          if (obj.canSelect == '0') {
            display = 'cv-hide'
          } else {
            display = ''
          }
          bodyHtml += rowhtml
            .replace(/@uuid/g, uuid)
            .replace(/@expGroupCode/g, obj.expGroupCode)
            .replace(/@expGroupName/g, obj.expGroupName)
            .replace(/@display/g, display)
            .replace(/@programCode/g, obj.programCode)
            .replace(/@programPackageCode/g, obj.programPackageCode)
            .replace(/@programName/g, obj.programName)
            .replace(/@beginSection/g, obj.beginSection)
            .replace(/@dayOfWeek/g, obj.dayOfWeek)
            .replace(/@claimsName/g, obj.claimsName)
            .replace(/@timePlace/g, obj.timePlace ? obj.timePlace : '')
            .replace(/@teacherName/g, obj.teacherName ? obj.teacherName : '')
            .replace(
              /@noChooseReason/g,
              obj.noChooseReason ? obj.noChooseReason : ''
            )
            .replace(/@teachingClassCapacity/g, obj.teachingClassCapacity)
        })
        $row.find('.detail-buttons').show()
      } else {
        bodyHtml = '<div class="group-item nodata">暂无小组</div>'
        if (
          $row.find('.group-item-selected').length > '0' &&
          (packagetype == '02' || packagetype == '05')
        ) {
          $row.find('.detail-buttons').show()
        } else {
          $row.find('.detail-buttons').hide()
        }
      }
      html = html.replace(/@body/g, bodyHtml)
      $row.find('.detail-group-list').html(html)
      if (packagetype == '02' || packagetype == '05') {
        $.each($row.find('.group-item-selected'), function (index, dom) {
          const expgroupcode = $(dom)
            .find('.cv-delete-group')
            .attr('expgroupcode')
          $('.cv-group-radio[expgroupcode="' + expgroupcode + '"]').html('选中')
          $('.cv-group-radio[expgroupcode="' + expgroupcode + '"]').addClass(
            'selectGroup'
          )
        })
      }
      if (callBack) {
        callBack()
      }
    })
  }

  $('.program-item')
    .off('click')
    .on('click', evt => {
      const $dom = $(evt.currentTarget)
      const $item = $dom.closest('.cv-row')
      $dom.addClass('cv-active').siblings('.cv-active').removeClass('cv-active')
      initCourseprogramGroup($item)
    })
})

document.addEventListener('DOMContentLoaded', () => {
  ob.observe(document.body, { childList: true })

  window.queryCourseprogramGroup = param => {
    $.bhTip({ content: 'queryCourseprogramGroup', state: 'success' })
    return BH_UTILS.doAjax(
      BaseUrl + '/sys/xsxkapp/expElective/expCourseProgramGroup.do',
      param,
      'post',
      {},
      {
        token: sessionStorage.token,
        language: sessionStorage.getItem('language'),
      }
    ).then(res => {
      res.dataList = res.dataList.sort((a, b) => {
        const capA = a.teachingClassCapacity
        const capB = b.teachingClassCapacity

        if (a.canSelect !== b.canSelect) return a.canSelect === null ? -1 : 1

        if (capA !== capB && (capA < 10 || capB < 10)) {
          // 容量降序排列
          return capB - capA
        } else {
          // 周数升序排列
          const weekA = parseInt(a.timePlace.split(' ')[0])
          const weekB = parseInt(b.timePlace.split(' ')[0])

          return weekA - weekB
        }
      })
      return res
    })
  }

  window.queryExpElctiveGroup = param => {
    $.bhTip({ content: 'queryExpElctiveGroup', state: 'success' })
    return BH_UTILS.doAjax(
      BaseUrl + '/sys/xsxkapp/expElective/queryExpElctiveGroup.do',
      param,
      'post',
      {},
      {
        token: sessionStorage.token,
        language: sessionStorage.getItem('language'),
      }
    ).then(res => {
      res.dataList.forEach(item => (item.majorFlag = item.teacherName)) // hack
      return res
    })
  }

  $('#tpl-expselected-group-list-row').text(`
<div class="cv-group-row cv-clearfix" coursenumber="@courseNumber" programCode="@programCode"
        programPackageCode="@programPackageCode" expGroupCode="@expGroupCode">
    <div class="cv-pull-left" style="width: 15%">@expGroupName</div>
    <div class="cv-pull-left" style="width: 30%">@programName</div>
    <div class="cv-pull-left" style="width: 10%">@majorFlag</div>
    <div class="cv-pull-left" style="width: 30%">@timePlace</div>
    <div class="cv-pull-left" style="width: 15%">@operate</div>
</div>
`)
  $('#tpl-expselected-group-list').text(`
<div class="cv-group-list selected-group-list">
    <div class="cv-head cv-clearfix">
        <div class="cv-pull-left" style="width: 15%">小组名称</div>
        <div class="cv-pull-left" style="width: 30%">项目名称</div>
        <div class="cv-pull-left" style="width: 10%">教师名称</div>
        <div class="cv-pull-left" style="width: 30%">实验时间地点</div>
        <div class="cv-pull-left" style="width: 15%">操作</div>
    </div>
    <div class="cv-body" id="recommendBody">
        @body
    </div>
</div>
`)
})
