// ==UserScript==
// @name         雪球助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  愉快地在雪球、理性仁等网站之间玩耍（跳转）
// @author       小紫baby
// @include      /^https:\/\/(xueqiu|www\.lixinger)+\.com.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36582/%E9%9B%AA%E7%90%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/36582/%E9%9B%AA%E7%90%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*eslint-disable*/
;(function () {
  'use strict'

  // GM_xmlhttpRequest({
  //   url: 'https://www.lixinger.com/api/open/a/fundamental-info',
  //   method: 'POST',
  //   data: JSON.stringify({
  //       token: 'e050cb27-4338-404c-99db-40c16deade27',
  //       date: '2017-12-26',
  //       stockCodes:  ['01918', '01317'],
  //       metrics: ['market_value', 'pe_ttm', 'pb', 'dividend_r']
  //   }),
  //   headers: {'Content-Type': 'application/json'},
  //   onload: function(res) {
  //       console.log(res.responseText)
  //   }
  // })

  // https://www.lixinger.com/analytics/company/sz/002572/2572/detail/fundamental/value/primary
  // https://www.lixinger.com/analytics/company/sz/300012/300012/detail/fundamental/value/primary
  // https://www.lixinger.com/analytics/company/sh/600009/600009/detail/fundamental/value/primary
  // https://www.lixinger.com/analytics/company/hk/00842/842/detail/fundamental/value/primary
  // https://www.lixinger.com/analytics/indice/sh/000016/16/detail/value
  var hkStockTemplateUrl = 'https://www.lixinger.com/analytics/company/hk/{0}/{0}/detail/fundamental/value/primary'
  var szStockTemplateUrl = 'https://www.lixinger.com/analytics/company/sz/{0}/{0}/detail/fundamental/value/primary'
  var szFundTemplateUrl = 'https://www.lixinger.com/analytics/fund/sz/{0}/{0}/detail'
  var szIndiceTemplateUrl = 'https://www.lixinger.com/analytics/indice/sz/{0}/{0}/detail/value'
  var shStockTemplateUrl = 'https://www.lixinger.com/analytics/company/sh/{0}/{0}/detail/fundamental/value/primary'
  var shFundTemplateUrl = 'https://www.lixinger.com/analytics/fund/sh/{0}/{0}/detail'
  var shIndiceTemplateUrl = 'https://www.lixinger.com/analytics/indice/sh/{0}/{0}/detail/value'

  var stockRegList = [
    // 港股证券
    /^\d{5}$/,
    // 深市证券
    /^SZ(00|01|02|20|30)\d{4}$/,
    // 沪市证券
    /^SH(600|601|900)\d{3}$/
  ]
  var regList = [
    // 深市基金
    /^SZ(15|16)\d{4}$/,
    // 深市指数
    // 深证综指，理性仁深圳A股
    /^SZ399106$/,
    /^SZ39\d{4}$/,
    // 沪市基金
    /^SH(510|512)\d{3}$/,
    // 沪市指数
    // 上证指数，理性仁上海A股
    /^SH000001$/,
    /^SH000\d{3}$/
  ]
  var urlList = [
    hkStockTemplateUrl,
    szStockTemplateUrl,
    shStockTemplateUrl,
    szFundTemplateUrl,
    'https://www.lixinger.com/analytics/indice/lxr/1000003/1000003/detail/value',
    szIndiceTemplateUrl,
    shFundTemplateUrl,
    'https://www.lixinger.com/analytics/indice/lxr/1000004/1000004/detail/value',
    shIndiceTemplateUrl
  ]

  function normalizeCode(code) {
    return code && code.replace(/[a-z]+/gi, '')
  }

  function isStockCode(code) {
    for (var i = 0; i < stockRegList.length; i += 1) {
      if (stockRegList[i].test(code)) {
        return true
      }
    }

    return false
  }

  function getLixingrenStockPageUrl(code) {
    var stockCode = normalizeCode(code)
    // 美股不支持
    if (!stockCode) return ''

    var matchList = stockRegList.concat(regList)
    for (var i = 0; i < matchList.length; i += 1) {
      if (matchList[i].test(code)) {
        return urlList[i].replace(/\{0\}/g, stockCode)
      }
    }

    return ''
  }

  function setHrefAttribute (el, code) {
    var url = getLixingrenStockPageUrl(code)
    if (!url) {
      console.log('不支持的证券代码：' + code)
      return
    }
    el.attr('href', url)
  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  if (location.host === 'xueqiu.com') {
    /**
     * 主页自选股跳转到理性仁
     */
    var linkSelector = '#optional tr.sortable a.code'
    $(document.body).on('click', linkSelector, function(e) {
        var href = $(this).attr('href')
        if (href.indexOf('www.lixinger.com') > -1) {
          return
        }

        var code = href.replace('/S/', '')
        setHrefAttribute($(this), code)
    })

    /**
     * 兼容旧版主页
     */
    var oldTitleSelector = 'tr[data-symbol] span.title'
    var oldSymbolSelector = 'tr[data-symbol] span.subtitle'
    $(document.body).on('mouseenter', oldTitleSelector, function(e) {
      var code = $(this).parents('tr[data-symbol]').attr('data-symbol')
      $(this).parent().attr('href', '/S/' + code)
    })
    $(document.body).on('mouseenter', oldSymbolSelector, function(e) {
      var code = $(this).parents('tr[data-symbol]').attr('data-symbol')
      setHrefAttribute($(this).parent(), code)
    })

    /**
     * 股票页跳转到理性仁
     */
    var titleSelector = '#app .stock-name'
    $(titleSelector).eq(0).after('<div style="float: left;margin: 0 20px">' +
      '<a class="lxr-icon" target="_blank"><img style="width: 20px;height: 20px;vertical-align: middle" ' +
      ' src="https://www.lixinger.com/static/img/logo50x50.png" style="vertical-align: middle;" /></a></div>')
    $('.lxr-icon').one('mouseenter', function() {
      var code = location.pathname.replace('/S/', '')
      setHrefAttribute($(this), code)
    })

    /**
     * 个股主页跳转到同花顺F10
     */
    var xqCode = location.pathname.replace('/S/', '')
    if (isStockCode(xqCode)) {
      var links = $('#app .stock-links')
      var code = xqCode.replace(/SH|SZ/, '')
      var stockName = $('.stock-name').text().split('(')[0]
      var configList = [
        {
          title: '同花顺F10',
          list: [["最新动态","http://basic.10jqka.com.cn/{0}/"],["公司资料","http://basic.10jqka.com.cn/{0}/company.html"],["股东研究","http://basic.10jqka.com.cn/{0}/holder.html"],[" 经营分析","http://basic.10jqka.com.cn/{0}/operate.html"],["股本结构","http://basic.10jqka.com.cn/{0}/equity.html"],[" 资本运作","http://basic.10jqka.com.cn/{0}/capital.html"],["盈利预测","http://basic.10jqka.com.cn/{0}/worth.html"],["新闻公告","http://basic.10jqka.com.cn/{0}/news.html"],["概念题材","http://basic.10jqka.com.cn/{0}/concept.html"],["主力持仓","http://basic.10jqka.com.cn/{0}/position.html"],[" 财务概况","http://basic.10jqka.com.cn/{0}/finance.html"],["分红融资","http://basic.10jqka.com.cn/{0}/bonus.html"],["公司大事","http://basic.10jqka.com.cn/{0}/event.html"],["行业对比","http://basic.10jqka.com.cn/{0}/field.html"]]
        }
      ]
      if (xqCode.length === 5) {
        code = xqCode.replace(/^0/, '')
        configList = [
          {
            title: '智通财经',
            list: [['个股中心', 'http://stock.zhitongcaijing.com/hqstock/index.html?secucode=' + xqCode], ['相关文章', 'https://www.zhitongcaijing.com/content/search.html?keywords=' + stockName]]
          },
          {
            title: '同花顺F10',
            list: [["最新动态","http://basic.10jqka.com.cn/HK{0}/"],["公司概况","http://basic.10jqka.com.cn/HK{0}/company.html"],["股本结构","http://basic.10jqka.com.cn/HK{0}/equity.html"],["分红派息","http://basic.10jqka.com.cn/HK{0}/bonus.html"],["行业对比","http://basic.10jqka.com.cn/HK{0}/field.html"],["公司新闻","http://basic.10jqka.com.cn/HK{0}/news.html"],["财务分析","http://basic.10jqka.com.cn/HK{0}/finance.html"],["股东持股","http://basic.10jqka.com.cn/HK{0}/holder.html"],["经营分析","http://basic.10jqka.com.cn/HK{0}/operate.html"],]
          }
        ]
      }
      configList.unshift({
        title: '股票报告',
        list: [['研报查询', 'http://www.nxny.com/search.aspx?si=17&ft=0&fb=1&keyword=' + escape(stockName)]]
      })
      var html = ''
      configList.forEach(function(config) {
        var lis = config.list.map(function(item) {
          return '<li><a target="_blank" href="' + item[1].replace('{0}', code) + '">' + item[0].trim() + '</a></li>'
        }).join('')
        html += '<strong>' + config.title + '</strong><ul>' + lis + '</ul>'
      })
      links.html('<div style="position: fixed; top: 88px;">' + html + '</div>')
    }

    return
  }

  /*
   * 理性仁相关功能
   */
  var lxrStockUrlReg = /\/analytics\/company\/(\w+)\/(\d+)\/detail\/fundamental/
  if (lxrStockUrlReg.test(location.pathname)) {
    var timer = setInterval(function() {
      var nameNode = document.querySelector('.alert.alert-info .stockName')
      if (!nameNode) {
        return
      }
      clearInterval(timer)
      var stockInfo = location.pathname.match(lxrStockUrlReg)
      var market = stockInfo[1] === 'hk' ? '' : stockInfo[1].toUpperCase()
      var code = stockInfo[2]
      var xueqiuUrl = 'https://xueqiu.com/S/' + market + code
      var a = document.createElement('a')
      a.style.cssText = 'margin-left: 14px; margin-right: 0;'
      a.innerHTML = '<img src="https://assets.imedao.com/images/favicon.png" ' +
      ' style="width: 26px;height: 26px;display: inline-block;margin-top: -5px;" />'
      a.setAttribute('href', xueqiuUrl)
      a.setAttribute('target', '_blank')
      insertAfter(a, nameNode)
    }, 1000)
  }
})()
