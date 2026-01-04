// ==UserScript==
// @name         积木盒子页面错误提示
// @version      0.3
// @namespace    ocms-error-prompt-plugin
// @description  为通过积木盒子搭建的页面中产生的常见错误进行提示并给出解决方案
// @author       木康
// @encoding     utf-8
// @include      *://ocms.alibaba-inc.com/preview/*
// @include      *://ocms.alibaba-inc.com/designer/*
// @include      *://ocms.alibaba-inc.com/en-US/designer/builder/*
// @match        *://ocms.alibaba-inc.com/preview/*
// @match        *://ocms.alibaba-inc.com/designer/*
// @match        *://ocms.alibaba-inc.com/en-US/designer/builder/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-url/2.5.3/url.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/371338/%E7%A7%AF%E6%9C%A8%E7%9B%92%E5%AD%90%E9%A1%B5%E9%9D%A2%E9%94%99%E8%AF%AF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371338/%E7%A7%AF%E6%9C%A8%E7%9B%92%E5%AD%90%E9%A1%B5%E9%9D%A2%E9%94%99%E8%AF%AF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

$(function () {
  'use strict'

  /* 可配置选项 */
  const option = {
    isOpenAnchorList: false,
  }

  /* 对工具库重命名 */
  const lodash  = _

  /* 页面的主要内容是否存在于 iframe 中 */
  const isContentInIframe = !!(
    document.querySelector('iframe#page') ||
    document.querySelector('iframe.device-simulator__content')
  )

  /* 如果页面的主要内容存在于 iframe 中，则直接返回，等到代码在 iframe 中执行的时候再执行 */
  if (isContentInIframe) {
    $(`
      <style type="text/css">
        #tab-editor-data .json-form-fdset [jpath] input:disabled {
          opacity: 0.4;
        }
        #tab-editor-data .json-form-fdset [jpath] select:disabled {
          opacity: 0.4;
        }
      </style>
    `)
    .appendTo($('head'))

    return
  }

  /* 计数器 1 */
  let counter1 = 0

  /* 引入 Font Awesome */
  $('head').append(`<link rel="stylesheet" href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css">`)

  /* 对于 NCMS 搭建的页面，禁用商品与商家配置器的可配置能力 */
  $(`
    <style type="text/css">
      #ncmsLayout [component-name="@ali/rax-ocms-bw-comp-product"] div.ocms-handle-header {
        display: none !important;
      }
      #ncmsLayout [component-name="@ali/rax-ocms-bw-biz-seller"] div.ocms-handle-header {
        display: none !important;
      }
      #tab-editor-data .json-form-fdset [jpath] input:disabled {
        opacity: 0.4;
      }
      #tab-editor-data .json-form-fdset [jpath] select:disabled {
        opacity: 0.4;
      }
    </style>
  `)
  .appendTo($('head'))

  /* 获取不同的指定颜色 */
  const getColor = (function () {
    const colors = [
      'FF0000',
      'ffc800',
      'FF764D',
      '00E7FF',
      '007EFF',
      'CC00FF',
      '941A1F',
    ]
    let i = 0

    return function () {
      return colors[i++ % 7]
    }
  })()

  /* 是否处于无线预览页面 */
  const isWap = (function () {
    let isWap = false
    let isHasRuned = false

    return function () {
      if (isHasRuned) {
        return isWap
      } else {
        isHasRuned = true

        try {
          /* 无线积木盒子搭建页面的配置项在标签中而不在 RAXCOMPONENTSLIST 中，需要按照 */
          /* PC 端搭建与预览页面进行判别筛选，所以将无线积木盒子搭建页面判别为 PC 端判别 */
          /* 逻辑，无线积木盒子预览页面的配置项在 RAXCOMPONENTSLIST 中，所以判别为无线 */
          /* 部分逻辑 */
          isWap = typeof window.RAXCOMPONENTSLIST !== 'undefined' && !window.top.location.href.includes('ocms.alibaba-inc.com/designer')
        } catch (error) {}

        return isWap
      }
    }
  })()

  /* 定时检测当前页面锚点 */
  $((function () {
    if (!option.isOpenAnchorList) {
      return
    }

    let prevAnchorIdList = []
    let nextAnchorIdList = []

    function processAnchor() {
      nextAnchorIdList = []

      if (isWap() && Array.isArray(window.RAXCOMPONENTSLIST)) {
        window.RAXCOMPONENTSLIST.forEach((setting) => {
          const anchorId = lodash.get(setting, 'data.id')
          if (anchorId) {
            nextAnchorIdList.push(anchorId)
            const $component = $(`[data-spm=${lodash.get(setting, 'data.spmC')}]`)
            if ($component.length && !$component.children('.ocms-error-prompt-plugin-anchorId-container').length) {
              $component
                .attr('id', anchorId)
                .prepend($(`
                  <div class="ocms-error-prompt-plugin-anchorId-container" style="position: relative; z-index: 999">
                    <div style="position: absolute; top: 5px; left: 5px; font-size: 16px; font-weight: 600; color: #FFF; background-color: blue; text-align: center; border-radius: 3px; padding: 5px">
                      <div>楼层锚点</div>
                      <div>${anchorId}</div>
                    </div>
                  </div>
                `))
            }
          }
        })
      } else {
        $('[slot=main]').each(function () {
          const $component = $(this)
          const anchorId = $component.attr('id')
          if (anchorId) {
            nextAnchorIdList.push(anchorId)
            if (!$component.children('.ocms-error-prompt-plugin-anchorId-container').length) {
              $component
                .prepend($(`
                  <div class="ocms-error-prompt-plugin-anchorId-container" style="position: relative; z-index: 999">
                    <div style="position: absolute; top: 5px; left: 5px; font-size: 16px; font-weight: 600; color: #FFF; background-color: blue; text-align: center; border-radius: 3px; padding: 5px">
                      <div>楼层锚点</div>
                      <div>${anchorId}</div>
                    </div>
                  </div>
                `))
            }
          }
        })
      }

      if (!lodash.isEqual(prevAnchorIdList, nextAnchorIdList)) {
        $(document.body)
          .children('.ocms-error-prompt-plugin-anchorId-list-container')
          .remove()
          .end()
          .prepend($(`
            <div class="ocms-error-prompt-plugin-anchorId-list-container" style="position: relative; z-index: 999;">
              <div style="position: absolute; top: 5px; right: 5px; font-size: 16px; font-weight: 600; color: #FFF; background-color: blue; text-align: center; border-radius: 3px; padding: 5px">
                <div style="color: #FFF31A">楼层锚点目录</div>
                ${nextAnchorIdList.map((anchorId) => `<div><a href="#${anchorId}" style="color: #FFF; text-decoration: underline;">楼层锚点:${anchorId}</a></div>`).join('')}
              </div>
            </div>
          `))

        prevAnchorIdList = nextAnchorIdList
      }
    }

    return function () {
      setTimeout(function F() {
        processAnchor()

        setTimeout(F, 2000)
      }, 1000)
    }
  })())

  /* Promise 化油猴脚本提供的 XMLHttpRequest 请求方式 */
  function promisedGM_xmlhttpRequest(config) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: config.method,
        url: config.url,
        onload: resolve,
        onerror: reject,
      })
    }).then((response) => {
      response.json = () => JSON.parse(response.responseText.replace(/^\w+\(/, '').replace(/\)$/, ''))
      return response
    })
  }

  /* 错误提示弹窗 */
  function renderDialogForError(content, color, $component) {
    /* 如果没有传入颜色，说明没有找到对应的组件，直接返回 */
    if (!color) {
      return
    }

    /* 只显示第一个提示消息 */
    if ($component.children('.ocms-error-prompt-plugin-dialog').length) {
      return
    }

    $(`
      <div class="ocms-error-prompt-plugin-dialog" style="position: relative; z-index: 999">
        <div style="position: absolute; top: 5px; right: 5px; width: 250px; opacity: 0; color: #FFF; background-color: #${color}; border-radius: 3px;">
          <div style="width: 100%; padding: 15px; box-sizing: border-box; font-size: 14px; display: flex;">
            <div style="width: 50px; flex: none;">
              <i class="fa fa-times-circle-o fa-3x" aria-hidden="true"></i>
            </div>
            <div style="width: auto; flex: auto; display: flex; flex-direction: column;">
              <div style="font-size: 16px; margin-bottom: 6px;">数据异常</div>
              <div style="font-size: 14px;">${content}</div>
            </div>
          </div>
          <div class="closeButton" style="position: absolute; top: 5px; right: 5px;">
            <button style="border: none; outline: none; background-color: transparent; cursor: pointer; color: #FFF;">
              <i class="fa fa-times fa-2x" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    `)
    .prependTo($component)
    .children()
    .children('.closeButton')
    .children('button')
    .on('click', function () {
      $(this)
        .parent()
        .parent()
        .animate({ opacity: 0 }, 100, function () {
          $(this)
            .parent()
            .remove()
        })
    })
    .parent()
    .parent()
    .animate({ opacity: 1 }, 500)
  }

  /* 消息提示弹窗 */
  function renderDialogForInfo(content, color, $component) {
    /* 如果没有传入颜色，说明没有找到对应的组件，直接返回 */
    if (!color) {
      return
    }

    /* 只显示第一个提示消息 */
    if ($component.children('.ocms-error-prompt-plugin-dialog').length) {
      return
    }

    $(`
      <div class="ocms-error-prompt-plugin-dialog" style="position: relative; z-index: 999">
        <div style="position: absolute; top: 5px; right: 5px; width: 250px; opacity: 0; color: #FFF; background-color: #${color}; border-radius: 3px;">
          <div style="width: 100%; padding: 15px; box-sizing: border-box; font-size: 14px; display: flex;">
            <div style="width: 50px; flex: none;">
              <i class="fa fa-check-circle-o fa-3x" aria-hidden="true"></i>
            </div>
            <div style="width: auto; flex: auto; display: flex; flex-direction: column;">
              <div style="font-size: 16px; margin-bottom: 6px;">数据正常</div>
              <div style="font-size: 14px;">${content}</div>
            </div>
          </div>
        </div>
      </div>
    `)
    .prependTo($component)
    .children()
    .animate({ opacity: 1 }, 500, function () {
      setTimeout(() => {
        $(this).animate({ opacity: 0 }, 500, function () {
          $(this)
            .parent()
            .remove()
        })
      }, 2000)
    })
  }

  /* 标记对应的积木盒子组件 */
  function markRelativeComponent(querys, option, color) {
    let componentColor = color

    let $component

    if (isWap() && Array.isArray(window.RAXCOMPONENTSLIST)) {
      const componentSetting = window.RAXCOMPONENTSLIST.find((setting) => (
        lodash.includes(setting.data, querys.resourceId)
      ))

      if (componentSetting) {
        const spmC = componentSetting.data.spmC

        $component = $(`[data-spm=${spmC}]`)
      }
    } else {
      const ocmsComponents = $('[slot=main]')
      const componentCount = ocmsComponents.length

      for (let i = 0; i < componentCount; i++) {
        const _component = ocmsComponents[i]

        const setting = _component.getAttribute('data-default-data')

        if (setting && lodash.includes(JSON.parse(setting), querys.resourceId)) {
          $component = $(_component)
          break
        }
      }
    }

    if ($component && $component.length) {
      if (option === 'mark') {
        if (!$component.data('color')) {
          $component.data('color', componentColor)
          /* 延迟一段时间再标记，防止某些情况下标记太早导致React重新渲染以后覆盖组件的样式 */
          setTimeout(() => {
            $component[0].style.border = `dashed 15px #${componentColor}`
          }, 1000)
        } else {
          componentColor = $component.data('color')
        }
      } else if (option === 'clear') {
        $component.data('color', undefined)
        /* 延迟一段时间再标记，防止某些情况下标记太早导致React重新渲染以后覆盖组件的样式 */
        setTimeout(() => {
          $component[0].style.border = 'none'
        }, 1000)
      }
    } else {
      return {}
    }

    return {
      color: componentColor,
      $component,
    }
  }

  /* 处理响应 */
  function processRespones(querys = {}, response = {}) {
    const {
      content: {
        data,
        page: {
          pageNo,
          pageSize,
          totalNum,
        } = {},
      } = {},
      errors: [
        error,
      ] = [],
      success,
    } = response

    const {
      callback,
      dataId,
      originUrl,
      resourceId,
    } = querys

    /* 测试偏好设置参数替换，切换纯品或商加品的偏好设置参数 */
    const testPreferenceTypeReplaceMap = {
      '&dataId=198': '&dataId=288&algType=3&resourceType=1',
      '&dataId=288': '&dataId=198',
      '&dataId=215': '&dataId=289&algType=3&resourceType=1',
      '&dataId=289': '&dataId=215',
    }

    /* 测试纯品和商加品设置参数替换，切换纯品与商加品的类型，另外，如果由纯品切换到商加品类 */
    /* 型，则追加 childCombineId 参数保证请求的正确 */
    const testProductOrSupplierProductTypeReplaceMap = {
      '&dataId=198': '&dataId=215&childCombineId=216',
      '&dataId=288': '&dataId=289&childCombineId=290',
      '&dataId=215': '&dataId=198',
      '&dataId=289': '&dataId=288',
    }

    /* 测试偏好设置 URL */
    const testPreferenceTypeUrl = originUrl
      .replace(/(&dataId=\d+)(&algType=\d*)?(&resourceType=\d*)?/, (value, subString) => testPreferenceTypeReplaceMap[subString])

    /* 测试纯品和商加品设置 URL */
    const testProductOrSupplierProductTypeUrl = originUrl
      .replace(/(&dataId=\d+)(&childCombineId=\d*)?/, (value, subString) => testProductOrSupplierProductTypeReplaceMap[subString])

    /* 只要接口返回数据不正常，则 success 即为 false，但是存在两种导致数据不正常的原因， */
    /* 第一种是接口配置错误，比如是否开启千人千面，这种情况下返回的响应中有一个 errors 参 */
    /* 数；第二种是数据读取错误，比如要取的数据量大于商品池中的总数，商加品数据与纯品数据混 */
    /* 乱，这种情况下返回的响应中没有 errors 参数，所以可以通过这个条件来判断具体是哪一种 */
    /* 错误 */
    if (!success) {
      let $component
      /* 获取本次错误提示的特定颜色 */
      let color = getColor()

      let result = markRelativeComponent(querys, 'mark', color)

      color = result.color
      $component = result.$component

      /* 自动尝试新的设置，并预留出后续可能要添加的其他自送尝试设置 */
      Promise
        .all([
          promisedGM_xmlhttpRequest({ method: 'GET', url: testPreferenceTypeUrl }).then((response) => response.json()),
          promisedGM_xmlhttpRequest({ method: 'GET', url: testProductOrSupplierProductTypeUrl }).then((response) => response.json()),
        ])
        .then(([
          { success: successForTestPreferenceType },
          { success: successForTestProductOrSupplierProductType },
        ]) => {
          switch (true) {
            case successForTestPreferenceType:
              renderDialogForError(`<b>投放池ID: ${resourceId}</b><br>用户偏好计算（千人千面）设置错误，请<b>${(dataId == 198 || dataId == 215) ? '开启' : '关闭'}</b>千人千面`, color, $component)
              break

            case successForTestProductOrSupplierProductType:
              renderDialogForError(`<b>投放池ID: ${resourceId}</b><br>纯品与商加品数据混乱，商品池中的数据类型为<b>${(dataId == 198 || dataId == 288) ? '商加品' : '纯品'}</b>，但当前组件是以<b>${(dataId == 198 || dataId == 288) ? '纯品' : '商加品'}</b>的形式展示的`, color, $component)
              break

            /* 所填写的投放数量超过了投放池中的总数，但在此之前肯定做出了投放数量超过了 */
            /* 投放池中的总数的错误提示，所以在这里不再显示错误提示 */
            case (totalNum === -1):
              renderDialogForError(`<b>投放池ID: ${resourceId}</b><br>所填写的投放数量超过了投放池中的总数`, color, $component)
              break

            default:
              renderDialogForError(`<b>投放池ID: ${resourceId}</b><br>组件出现了未知错误，可能是组件的多个配置项同时配置错误，请切换其中一两个配置项重新尝试`, color, $component)
          }
        })
    } else {
      let $component
      /* 获取本次错误提示的特定颜色 */
      let color = getColor()

      let result

      /* 当投放池中的商品总数大于 300 时，取品接口返回的商品总数有问题，最大不会超过 300， */
      /* 因此暂时做一下兼容 */
      switch (true) {
        case (pageNo * pageSize > totalNum && totalNum !== 300):
          result = markRelativeComponent(querys, 'mark', color)
          color = result.color
          $component = result.$component
          renderDialogForError(`<b>投放池ID: ${resourceId}</b><br>所填写的投放数量可能超过了投放池中的总数<b>${totalNum}</b>，如果没有超过，请忽略本提示消息`, color, $component)
          break

        /* 清除组件之前的标记 */
        default:
          markRelativeComponent(querys, 'clear')
      }
    }
  }

  function processComponentSetting(querys = {}) {
    const {
      resourceId,
    } = querys

    let component = $('#ncmsLayout').find(`[component-data=${resourceId}]`)

    if (component.length) {
      /* 重置计数器 1 */
      counter1 = 0

      const matchRegExp = /\.(resourceId|blockId|preferenceType|supplierRow\d+|offerRow\d+|assignAnchor|list\[\d+\].blockIds|resId|tabId|dataIdType|type|prodItemKey|busItemKey|tabConfig\.useRecommand|tabList\[\d+\].id)/

      setTimeout(function F() {
        const settingItems = window.top.document.querySelectorAll('#tab-editor-data .json-form-fdset > div, #tab-editor-data .json-form-fdset > table td > div')

        if (!lodash.isEmpty(settingItems)) {
          lodash
            .chain(settingItems)
            .filter((element) => matchRegExp.test(element.getAttribute('jpath')))
            .forEach((element) => element.querySelector('input, select').setAttribute('disabled', 'disabled'))
            .value()
        } else if (counter1++ < 5) {
          setTimeout(F, 1000)
        }
      }, 300)
    }
  }

  /* 处理拦截到的 Jsonp 请求 */
  function processIntercept(element) {
    if (
      element &&
      element.nodeName &&
      element.nodeName.toUpperCase() === 'SCRIPT' &&
      element.src &&
      (
        element.src.includes('dcms.alibaba.com/open/query.json') ||
        element.src.includes('icbumaya.alibaba-inc.com/uds/jdataRpc/getData.jsonp') ||
        element.src.includes('icbumaya.alibaba-inc.com/uds/lockRpc/unLock.jsonp')
      )
    ) {
      const requestUrl = element.src

      /* 解析 URL 参数 */
      const querys = $.url('?', requestUrl)

      /* 保存原请求的 URL */
      querys.originUrl = requestUrl

      if (requestUrl.includes('dcms.alibaba.com/open/query.json')) {
        /* 积木盒子组件获取商品数据接口 */
        promisedGM_xmlhttpRequest({
          method: 'GET',
          url: requestUrl,
        }).then((response) => {
          processRespones(querys, response.json())
        })
      } else if (requestUrl.includes('icbumaya.alibaba-inc.com/uds/jdataRpc/getData.jsonp')) {
        /* 积木盒子组件 jData 配置数据接口 */
        processComponentSetting(querys)
      } else {
        /* 关闭配置页面时，将计数器的值设置一个较大值，防止因为获取组件 jData 配置数据失败 */
        /* 不断重发而不终止的问题 */
        counter1 = 100
      }
    }
  }

  /* 拦截 document.head 的 appendChild 方法，从而劫持 Jsonp 请求 */
  const originDocumentHeadAppendChildFunction = document.head.appendChild

  /* 拦截 document.head 的 insertBefore 方法，从而劫持 Jsonp 请求，因为 jData 数据 */
  /* 获取是在顶层页面中获取的，所以需要在顶层页面中劫持该请求 */
  const originDocumentHeadInsertBeforeFunction = window.top.document.head.insertBefore

  document.head.appendChild = function (element, ...others) {
    /* 处理拦截到的 Jsonp 请求 */
    processIntercept(element)

    /* 继续执行原本的函数 */
    return originDocumentHeadAppendChildFunction.apply(this, [element, ...others])
  }

  window.top.document.head.insertBefore = function (element, ...others) {
    /* 处理拦截到的 Jsonp 请求 */
    processIntercept(element)

    /* 继续执行原本的函数 */
    return originDocumentHeadInsertBeforeFunction.apply(this, [element, ...others])
  }
})
