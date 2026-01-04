// ==UserScript==
// @icon                https://www.google.cn/favicon.ico
// @name                复制衔接性描述
// @namespace           [url=mailto:wanglu@uniqueway.com]wanglu@uniqueway.com[/url]
// @author              deerw
// @description         获取线路，生成衔接性描述，并保存在粘贴板
// @match               *://www.google.com/maps/dir/*
// @match               *://www.google.cn/maps/dir/*
// @match               *://www.google.com/maps/dir/*/am=t/*
// @match               *://www.google.cn/maps/dir/*/am=t/*
// @require             http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant               GM_setClipboard
// @grant               GM_xmlhttpRequest
// @version             0.0.23
// @downloadURL https://update.greasyfork.org/scripts/388336/%E5%A4%8D%E5%88%B6%E8%A1%94%E6%8E%A5%E6%80%A7%E6%8F%8F%E8%BF%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/388336/%E5%A4%8D%E5%88%B6%E8%A1%94%E6%8E%A5%E6%80%A7%E6%8F%8F%E8%BF%B0.meta.js
// ==/UserScript==
(function () {
  'use strict'

  GM_xmlhttpRequest({url: 'https://api-smile.uniqueway.com'})

  let route_details = []
  class Dep {                  // 订阅池
    constructor(name){
      this.id = new Date()  // 这里简单的运用时间戳做订阅池的ID
      this.subs = []        // 该事件下被订阅对象的集合
    }
    defined(){              // 添加订阅者
      Dep.watch.add(this)
    }
    notify() {              // 通知订阅者有变化
      this.subs.forEach((e, i) => {
        if(typeof e.update === 'function'){
          try {
            e.update.apply(e) // 触发订阅者更新函数
          } catch(err){
            console.warr(err)
          }
        }
      })
    }
  }
  Dep.watch = null

  class Watch {
    constructor(name, fn){
      this.name = name       // 订阅消息的名称
      this.id = new Date()   // 这里简单的运用时间戳做订阅者的ID
      this.callBack = fn     // 订阅消息发送改变时->订阅者执行的回调函数
    }
    add(dep) {               // 将订阅者放入dep订阅池
      dep.subs.push(this)
    }
    update() {               // 将订阅者更新方法
      var cb = this.callBack // 赋值为了不改变函数内调用的this
      cb(this.name)
    }
  }
  var addHistoryMethod = (function(){
    var historyDep = new Dep()
    return function(name) {
      if(name === 'historychange'){
        return function(name, fn){
          var event = new Watch(name, fn)
          Dep.watch = event
          historyDep.defined()
          Dep.watch = null      // 置空供下一个订阅者使用
        }
      } else if(name === 'pushState' || name === 'replaceState') {
          var method = history[name]
          return function () {
            method.apply(history, arguments)
            historyDep.notify()
          }
      }
    }
  }())

  window.addHistoryListener = addHistoryMethod('historychange');
  history.pushState =  addHistoryMethod('pushState');
  history.replaceState =  addHistoryMethod('replaceState');

  function stat_log(params) {
    let departure_place = ''
    let arrival_place = ''
    let coordinate = ''
    const pathname_arr = location.pathname.split('/@')
    const place_arr = pathname_arr[0].split('/')
    const coordinate_str = pathname_arr[1].split('/')[0]

    if(place_arr && place_arr.length) {
      departure_place = window.decodeURI(place_arr[3])
      arrival_place = window.decodeURI(place_arr[4])
    }

    if(coordinate_str) {
      const coordinate_arr = coordinate_str.split(',')
      coordinate = coordinate_arr[0] + ',' + coordinate_arr[1]
    }
    const summary_title = $('div.section-trip-summary-header').find('h1.section-trip-summary-title')
    const departure_time = $(summary_title).children().eq(1).children().eq(0).text()
    let data = {
        from: 'restructure_new_guidebook',
        departure_place,
        arrival_place,
        coordinate,
        route_details,
        departure_time,
        url: location.href,
        duration: '',
        distance: '',
        fare_value: '',
        fare_currency: ''
    }
    if (params) data = Object.assign(data, params)
    console.log('埋点数据：', data)
    GM_xmlhttpRequest({
      url: 'https://api-smile.uniqueway.com/api/stats/guidebook',
      method: 'POST',
      body: JSON.stringify({data, event: 'click_transportation_googlemap'}),
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({data, log_name: 'click_transportation_googlemap'}),
      onload: function(response) {
        let data = JSON.parse(response.responseText)
        if(data && data.data && data.data.id) {
           console.log('埋点成功!')
        }
      },
      onerror: function(error) {
        console.log('埋点出错了', error)
      }
    })

  }
  // 复制衔接性描述按钮的html代码
  var coty_btn_html = '<div id="copy-btn-box"><div class="copy-btn">复制衔接性描述</div></div>'

  // 需要将线路名称转化为JR的图片s
  var JR_arr = [
    '/jp-tokyo-jr/jp-tokyo-jrwest.png',
    '/jp-tokyo-jr/jp-tokyo-jreast.png',
    '/jp-tokyo-jr/jp-tokyo-jrhokkaido.png',
    '/jp-tokyo-jr/jp-tokyo-jrkyushu.png',
    '/jp2ltr/JO.png',
    '/jp2ltr/JE.png',
    '/jp2ltr/JC.png',
    '/jp2ltr/JY.png',
    '/jp2ltr/JU.png',
    '/jp2ltr/JK.png',
    '/jp2ltr/JB.png'
  ]
  // 判断是否包含JR图片
  function is_JR (transit_img) {
    const filter_JR_arr = JR_arr.filter(item => {
      return transit_img.indexOf(item) > -1
    })
    return filter_JR_arr && filter_JR_arr.length
  }

  // 衔接性描述按钮样式
  function add_style () {
    var copy_btn_box_css = {
      'position': 'relative',
      'top': '10px',
      'height': '24px'
    }
    var copy_btn_css = {
      'position': 'absolute',
      'bottom': '0;',
      'right': '0',
      'cursor': 'pointer',
      'color': '#4285F4',
      'border': '1px solid #4285F4',
      'width': '100px',
      'height': '24px',
      'font-size': '13px',
      'line-height': '24px',
      'text-align': 'center',
      'border-radius': '4px'
    }
    $('#copy-btn-box').css(copy_btn_box_css)
    $('.copy-btn').css(copy_btn_css)
  }
  // 删除换行空格
  function remover_s (str) {
    return str && str.replace(/\s+/g, '') || ''
  }
  // 转译
  function trans_str (str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    return str && str.replace(re, function(matched){
      return mapObj[matched] || matched
    })
  }
  function replace_unit (str) {
    const mapObj = {
      '&amp;': '&',
      'hours': '小时',
      'hour': '小时',
      'mins': '分钟',
      'min': '分钟',
      'days': '天',
      'day': '天',
      'km': '公里',
      'm': '米'
    }
    return trans_str(str, mapObj)
  }
  function replace_stop (str) {
    const mapObj = {
      '&amp;': '&'
    }
    return trans_str(str, mapObj)
  }
  function replace_method (str) {
    const mapObj = {
      '&amp;': '&',
      '地下鉄': '地铁',
      '徒歩約': '步行约',
      'バス': '巴士',
      'Train': '火车',
      'Bus': '巴士',
      'Commuter train': '城郊列车',
      'Subway': '地铁',
      'Underground': '地铁',
      'Metro rail': '地铁',
      'Metro': '地铁',
      'Ferry': '轮渡',
      'Tram': '有轨电车',
      'Funicular': '缆车',
      'Light rail': '轻轨'
    }
    return trans_str(str, mapObj)
  }

  function split_desc (list) {
    let desc = ''
    const transits = []
    for (let index = 0; index < list.length; index++) {
      if ($(list[index]).children('[style!="display:none"]').length > 1) transits.push(list[index])
    }
    let transit_count = 0
    let prep_stop = ''

    let same_stop = false

    let pre_stop_num = 0
    for (let i = 0; i < list.length; i++) {
      const element = list[i]
      if ($(element).children('[style!="display:none"]').length > 1) {
        let element_children = $(element).children()
        // j 0为出发站，2为到达站
        for (let j = 0; j < element_children.length; j++) {
          const transit_element = element_children[j]
          if(list.length === 1 && $(transit_element).attr('class') === 'ending-transit-stop transit-stop') {
            const end_stop = replace_stop($(transit_element).find('.transit-stop-name')[0].innerHTML)
            desc += ' [' + end_stop + '] 站下。 '
          }
          if ($(transit_element).attr('class') === 'transit-stop') {
            const start_stop = replace_stop($(transit_element).find('.transit-stop-name')[0].innerHTML)
            same_stop = prep_stop && prep_stop === start_stop
            if (transits.length > 1 && transit_count === 0) {
                desc += ''
            } else if (j === 0) {
                if(transits.length > 1 && transit_count > 0) {
                    if (same_stop) desc += '根据指示牌换乘'
                    else if(pre_stop_num === 1) desc += '[' + start_stop + '], 再'
                    else desc += '再到 [' + start_stop + '] 站'
                } else desc += ' [' + start_stop + '] 站，'
            } else if (j === 2) {
                desc += ' [' + start_stop + '] 站下，'
            }
            prep_stop = start_stop
          } else if ($(transit_element).attr('class') === 'transit-logical-step-row') {
            transit_count++
            let transit_number = $(transit_element).find('.noprint').find('span.renderable-component-text-box-content')[1].innerHTML
            let transit_method = replace_method($(transit_element).find('.noprint').find('span.renderable-component').children('img').attr('alt'))
            let transit_img = $(transit_element).find('.noprint').find('span.renderable-component').children('img').attr('src')
            if(transit_number === '山陰本線') transit_number = '嵯峨野線'
            if(['電車', '火车'].indexOf(transit_method) > -1 && is_JR(transit_img)) transit_method = 'JR'
            let step_desc = ''
            if (transits.length > 1 && transit_count === 1) {
                step_desc = '乘坐 [' + transit_method + '][' + transit_number + '] ' + '到达'
            } else if(transits.length > 1 && transit_count > 1) {
                if (same_stop) step_desc = ' [' + transit_method + '][' + transit_number + '] ' + '抵达'
                else step_desc = '乘坐 [' + transit_method + '][' + transit_number + '] ' + '抵达'
            } else step_desc = '乘坐 [' + transit_method + '][' + transit_number + '] ' + '到达'
            if (i + 1 === list.length && !(list.length === 1 && transits.length === 1)) step_desc += '。'
            desc += step_desc
            route_details.push(transit_method + ' ' + transit_number)
          }
        }
        pre_stop_num = element_children.find('.transit-stop-name').length
      } else if ($(element)[0].innerText) {
        let walking_text = replace_method(remover_s($(element)[0].innerText))
        let walking_arr = walking_text.match(/\d+(\,\d+)?(\.\d+)?/g)
        let distance = replace_unit(walking_text.split(',')[1])
        if(transits.length > 1){
          if (i > 0 && i + 1 === list.length) {
            desc += '随后步行约 [' + remover_s(distance) + '] 可到'
          } else {
            desc += ''
          }
        } else if (transits.length > 1 && i === 0) desc += ''
        else if (i + 1 === list.length) desc += '随后步行约 [' + distance + '] 可到'
        else desc += '步行约 [' + walking_arr[0] + '分钟] 前往'
        if(i + 1 === list.length) desc += '。'
        route_details.push('WALKING')
      }

    }
    return desc
  }
  function add_button() {

    if($('div#copy-btn-box').length) return
    var section_directions_trip = $('div.section-trip-summary')
    // 将以上拼接的html代码插入到网页里的标签中
    section_directions_trip.append(coty_btn_html)

    add_style()
    $('.copy-btn').click(function (e) {
      let link_desc = ''
      route_details = []

      // title 部分
      var summary_header = $('div.section-trip-summary-header')

      var summary_title = summary_header.find('h1.section-trip-summary-title')

      let duration
      let cost
      let distance

      // 只有步行，即一段步行就可以到达的情况
      var directions_mode_body = $('div.directions-mode-body')
      let cost_text = ''
      if (directions_mode_body && directions_mode_body.length) {
          console.log('如果只有步行，我就会出现')
          // 时间和距离
          duration = summary_title.children().children('span:first-child').text()
          distance = summary_title.children().children().children().text()

          link_desc = `请参考导航步行到达，参考时长约为${duration}，距离约为${distance}。`
      } else {
        var summary_subtitle = summary_header.find('span.section-trip-summary-subtitle')
        // 时间和费用
        duration = summary_subtitle.children('span').text()
        cost_text = $('div.directions-mode-transit-trip-cost').children('span.value').text()
        const cost_arr = cost_text.match(/\d+(\,\d+)?(\.\d+)?/g)
        if(cost_arr && cost_arr.length) {
          cost = cost_arr[0]
          if(cost_text.indexOf('JP¥') > -1 || cost_text.indexOf('円') > -1) cost = '[' + cost + '日元]'
          else if( cost_text ) cost = '[' + cost_text + ']'
        } else {
          cost = cost_text ? '[' + cost_text + ']' : ''
        }

        var transit_mode_body = $('div.transit-mode-body')

        link_desc = '参考导航，'

        var list = transit_mode_body.find('span[id^="transit_group_"]')

        // 拼接中间部分的线路描述
        link_desc += split_desc(list)
        if (duration) link_desc += '全程约 [' + replace_unit(remover_s(duration)) + ']'
        if (cost) link_desc += '，费用' + cost
        link_desc += '。'
      }

      console.log('衔接性描述:', link_desc)

      GM_setClipboard(link_desc, 'link_desc')
      const params = {
        duration: duration,
        distance: distance,
        fare_value: cost,
        fare_currency: (cost_text.indexOf('JP¥') > -1 || cost_text.indexOf('円') > -1) ? 'JP¥' : ''
      }
      stat_log(params)

      if(window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
          var n = new Notification('复制成功', { body: '已将衔接性描述复制到剪贴板！' })
        })
      } else {
        alert('已将衔接性描述复制到剪贴板！')
      }
    })
  }
  $(function () {
    window.addHistoryListener('history',function(){
      add_button()
    })
  })
})()