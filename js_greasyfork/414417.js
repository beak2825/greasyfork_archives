// ==UserScript==
// @name        百度百科内链助手
// @namespace   Violentmonkey Scripts
// @match       https://baike.baidu.com/editor/*
// @grant       none
// @version     1.2.1
// @author      lincong1987
// @description 内链一键去重、内链列表检查、空链检查
// @inject-into page
// @require https://unpkg.com/jquery@3.5.1/dist/jquery.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414417/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%86%85%E9%93%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/414417/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%86%85%E9%93%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function ($) {

  var isReady = false
  var neilians = []
  var neiliansMap = {}
  var neilianTree = []
  var checkEditorLoadIndex = 0
  var $us_neilian_toolbar__body__header
  var $onekeyUnique
  var $refresh
  var $us_neilian_list
  var $us_neilian_toolbar_tooltip
  var $us_neilian_toolbar_tooltip__inner
  var $auto_refresh
  var autoRefreshKey = 'xxoo-xxoo-auto-refresh'
  var autoRefresh = localStorage.getItem(autoRefreshKey)
  var $us_neilian_toolbar_toast
  var $us_neilian_toolbar_preview
  var $us_neilian_toolbar_preview__inner

  var showNeilianPreviewTimer
  var us_neilian_toolbar_preview_show = false

  var removeNeilianTasks = []

  if (typeof autoRefresh === 'undefined') {
    autoRefresh = 'false'
    localStorage.setItem(autoRefreshKey, 'false')
  }

  var $neilianToolbar = `

    <div class='us_neilian_toolbar' id='us_neilian_toolbar'>


      <div class='us_neilian_toolbar__header' ti="内链助手">
        内链助手

        <span class="us_neilian_toolbar__header-onekey-unique">
          一键去重 <i class="icon baike_icon_picall baike_icon_picall-icon_shanchu"></i></span>
        <span class="us_neilian_toolbar__header-auto-refresh">
            <input type="checkbox" id="us_neilian_toolbar__header-auto-refresh" >
        </span>
        <span class="us_neilian_toolbar__header-refresh">
          <i class="icon baike_icon_picall baike_icon_picall-icon_youzhuan"></i></span>

      </div>


      <div class="us_neilian_toolbar__body">
        <div class="us_neilian_toolbar__body__header">共 <em class="total">0</em> 条内链， 内有重复内链 <em class="unique">0</em> 条</div>
        <div class="us_neilian_toolbar__body__body">

          <div class="us_neilian_toolbar__body__body__thead">
            <span  class="us_neilian_toolbar__body__body__thead__status">状态</span>
            <span  class="us_neilian_toolbar__body__body__thead__name">名称</span>
            <span   class="us_neilian_toolbar__body__body__thead__action">操作</span>
          </div>
          <ul class="us_neilian_toolbar__body__list" id='us_neilian_list'>

        
          

          </ul>
        </div>
      </div>

      <div class="us_neilian_toolbar__helpme">遇到问题请联系QQ群 1002104421 </div>


    </div>
        `

  function appendStyle () {
    $('head').append(`<style>


/*!
* xxx.css
* (c) 2020 lincong1987
*/.us_neilian_toolbar_preview{position:fixed;z-index:999999999999;top:-210px;left:50%;transition:all,1s;width:500px;height:200px;background:#fff;border-radius:4px;font-size:13px;color:#0284fe;box-shadow:0 2px 4px 2px rgba(0,0,0,0.5);margin-left:-250px}.us_neilian_toolbar_preview__close{position:absolute;top:0;right:0;width:25px;height:25px;line-height:25px;font-size:18px;box-sizing:border-box;color:#999;cursor:pointer;text-align:center}.us_neilian_toolbar_preview__close:hover{color:#666}.us_neilian_toolbar_preview__inner{position:absolute;top:0;right:0;width:500px;height:200px;font-size:12px;padding:12px;box-sizing:border-box}.us_neilian_toolbar_preview--hide{top:-100px}.us_neilian_toolbar_preview--show{top:100px;opacity:1}.us_neilian_toolbar_preview__container{color:#333;font-size:14px}.us_neilian_toolbar_preview__container__title{height:30px;line-height:30px;font-size:18px;margin-bottom:8px}.us_neilian_toolbar_preview__container__title a{font-size:18px;color:#222;text-decoration:underline}.us_neilian_toolbar_preview__container__select{margin-bottom:8px}.us_neilian_toolbar_preview__container__content{margin-bottom:8px;overflow:hidden;height:78px;clear:both}.us_neilian_toolbar_preview__container__content__img{float:left;margin-right:10px;position:relative;width:78px;height:78px;background-position:50%;background-size:contain;background-repeat:no-repeat;cursor:pointer}.us_neilian_toolbar_preview__container__content__desc{float:left;color:#666;font-size:12px;width:380px}.us_neilian_toolbar_preview__container__action{text-align:center}.us_neilian_toolbar_preview__container__action .change,.us_neilian_toolbar_preview__container__action .cancel{text-align:center;width:50px;height:22px;font-size:12px;border:1px solid #459df5;color:#459df5;border-radius:3px;transition:all,.4s;display:inline-block;margin-right:4px}.us_neilian_toolbar_preview__container__action .change:hover,.us_neilian_toolbar_preview__container__action .cancel:hover{color:#fff;background:#459df5;border:1px solid #459df5;text-shadow:0 1px 3px #6c6c6c;transform:scale(1.1)}.us_neilian_toolbar_preview__container__action .change i,.us_neilian_toolbar_preview__container__action .cancel i{font-size:12px}.us_neilian_toolbar_preview__container__action .cancel{color:#459df5;border:1px solid transparent;text-decoration:underline}.us_neilian_toolbar_preview__container__action .cancel:hover{color:#459df5;background:transparent;border:1px solid transparent;text-shadow:none}.us_neilian_toolbar_toast{position:fixed;z-index:9999999999;top:-100px;left:50%;transition:all,1s;width:300px;height:40px;line-height:40px;background:#e6f7ff;border-radius:4px;font-size:13px;color:#0284fe;text-align:center;box-shadow:0 2px 2px 0 rgba(0,0,0,0.5);margin-left:-150px;opacity:0}.us_neilian_toolbar_toast--hide{top:-100px;opacity:0}.us_neilian_toolbar_toast--show{top:100px;opacity:1}.us_neilian_toolbar_tooltip{position:absolute;z-index:9999999999;height:24px;top:-10px;left:-30px;transition:all,1s}.us_neilian_toolbar_tooltip .icon{color:#fb544e;display:block;font-size:12px;position:absolute;right:-94px;top:-28px;cursor:pointer}.us_neilian_toolbar_tooltip__inner{position:absolute;top:-32px;left:-10px;height:24px;width:100px;background:transparent;border-radius:4px;box-shadow:0 2px 2px 0 rgba(0,0,0,0.5);font-size:12px;line-height:24px;padding:0 8px}.us_neilian_toolbar_tooltip__inner:after{position:absolute;display:block;content:"";width:0;height:0;top:23px;left:10px;border:7px solid transparent;border-bottom-color:transparent;border-left-color:transparent;border-right-color:transparent}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--ok{opacity:1}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--ok .icon{color:#fff;right:-78px;top:-25px}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--ok .us_neilian_toolbar_tooltip__inner{background:#0284fe;color:#fff;width:80px}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--ok .us_neilian_toolbar_tooltip__inner:after{border-top-color:#0284fe}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--warn{opacity:1}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--warn .icon{color:#fb544e;right:-60px;top:-25px}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--warn .us_neilian_toolbar_tooltip__inner{color:#fb544e;background:#fef2f1;width:60px}.us_neilian_toolbar_tooltip.us_neilian_toolbar_tooltip--warn .us_neilian_toolbar_tooltip__inner:after{border-top-color:#fef2f1}.us_neilian_toolbar{box-sizing:border-box;height:600px;background:#fff;margin-bottom:10px;box-shadow:0 2px 2px 0 rgba(0,0,0,0.05)}.us_neilian_toolbar *{box-sizing:border-box}.us_neilian_toolbar__helpme{font-size:12px;padding:4px 0 4px 12px;color:#9f9f9f}.us_neilian_toolbar__header{font-size:16px;color:#333;font-weight:bolder;position:relative;padding-left:22px;height:50px;line-height:50px;border-bottom:1px solid #e0e0e0}.us_neilian_toolbar__header-onekey-unique,.us_neilian_toolbar__header-auto-refresh,.us_neilian_toolbar__header-refresh{top:10px;right:80px;font-size:12px;position:absolute;font-weight:400;cursor:pointer;height:27px;line-height:27px;padding:0 8px;border-radius:4px;border:1px solid #e0e0e0;transition:all,.4s}.us_neilian_toolbar__header-onekey-unique .icon.baike_icon_picall,.us_neilian_toolbar__header-auto-refresh .icon.baike_icon_picall,.us_neilian_toolbar__header-refresh .icon.baike_icon_picall{font-size:12px}.us_neilian_toolbar__header-onekey-unique:hover,.us_neilian_toolbar__header-auto-refresh:hover,.us_neilian_toolbar__header-refresh:hover{color:#fff;background:#459df5;border:1px solid #459df5;transition:background,.4s;text-shadow:0 1px 3px #6c6c6c;top:11px}.us_neilian_toolbar__header-auto-refresh{right:46px}.us_neilian_toolbar__header-refresh{right:12px}.us_neilian_toolbar__header-refresh .icon.baike_icon_picall{font-size:12px}.us_neilian_toolbar__body__header{font-size:12px;color:#3f3f3f;line-height:1;padding:12px 0 12px 12px}.us_neilian_toolbar__body__header em{color:#459df5;font-weight:bold;font-style:normal}.us_neilian_toolbar__body__header em.unique{color:#ffa500}.us_neilian_toolbar__body__body__thead{display:table;width:100%;height:30px;line-height:30px}.us_neilian_toolbar__body__body__thead span{display:table-cell;text-align:center;font-size:12px}.us_neilian_toolbar__body__body__thead__status{width:42px}.us_neilian_toolbar__body__body__thead__action{width:94px;text-align:left !important;padding-left:22px !important}.us_neilian_toolbar__body__list{overflow:auto;height:458px;position:relative}.us_neilian_toolbar__body__list__item{font-size:14px;color:#333;cursor:pointer;position:relative;clear:both;border-bottom:1px dashed #69b1f7 4a;padding:6px 0;transition:background,.4s;font-size:12px;display:table}.us_neilian_toolbar__body__list__item:nth-of-type(2n-1){background:rgba(105,177,247,0.05)}.us_neilian_toolbar__body__list__item:hover{background:rgba(105,177,247,0.5)}.us_neilian_toolbar__body__list__item__index{display:table-cell;width:30px;text-align:center;vertical-align:top}.us_neilian_toolbar__body__list__item__status{display:table-cell;height:30px;text-align:left;vertical-align:top}.us_neilian_toolbar__body__list__item__status i{font-size:12px}.us_neilian_toolbar__body__list__item__status.ok{color:#51c400}.us_neilian_toolbar__body__list__item__status.warn{color:#fb544e}.us_neilian_toolbar__body__list__item__status.error{color:#fb544e}.us_neilian_toolbar__body__list__item__name{display:table-cell;width:124px;text-align:left;padding:0 6px;color:#338de6;cursor:pointer;vertical-align:top}.us_neilian_toolbar__body__list__item__action{display:table-cell;width:72px;vertical-align:top}.us_neilian_toolbar__body__list__item__action__container{clear:both;position:relative}.us_neilian_toolbar__body__list__item__action__container .check,.us_neilian_toolbar__body__list__item__action__container .open,.us_neilian_toolbar__body__list__item__action__container .dis-link{text-align:center;width:32px;font-size:12px;border:1px solid #459df5;color:#459df5;border-radius:3px;transition:all,.4s;display:inline-block;float:left;margin-bottom:5px;margin-right:4px}.us_neilian_toolbar__body__list__item__action__container .check:hover,.us_neilian_toolbar__body__list__item__action__container .open:hover,.us_neilian_toolbar__body__list__item__action__container .dis-link:hover{color:#fff;background:#459df5;border:1px solid #459df5;text-shadow:0 1px 3px #6c6c6c;transform:scale(1.1)}.us_neilian_toolbar__body__list__item__action__container .check i,.us_neilian_toolbar__body__list__item__action__container .open i,.us_neilian_toolbar__body__list__item__action__container .dis-link i{font-size:12px}.us_neilian_toolbar__body__list__item__action__container .dis-link{color:#fb544e;border:1px solid #fb544e}.us_neilian_toolbar__body__list__item__action__container .dis-link:hover{color:#fff;background:#fb544e;border:1px solid #fb544e;text-shadow:0 1px 3px #6c6c6c}.us_neilian_toolbar__body__list__item__action__container .check{color:#51c400;border:1px solid #51c400}.us_neilian_toolbar__body__list__item__action__container .check:hover{color:#fff;background:#51c400;border:1px solid #51c400;text-shadow:0 1px 3px #6c6c6c}/*# sourceMappingURL=xxx.css.map */
    
    
    
    
    
      </style>`)
  }

  function getAllNeilians () {

    neilians = []
    neiliansMap = {}
    neilianTree = []

    // <a href="#" data-lemmaid="210064">湖北省</a>
    var neilianOrder = 0
    $('#J-center-container a').each(function (i, n) {
      var $a = $(this)

      if ($a.closest('.reference-list').length > 0) {
        return
      }

      var $el = $(n)
      var name = $el.text()
      var id = $el.data('lemmaid')

      if (neiliansMap[name]) {
        neiliansMap[name].index += 1

      } else {

        neiliansMap[name] = {
          index: 1,
          name: name,
          neilians: [],
          order: neilianOrder++,
        }

      }

      var neilain = {
        id: id,
        name: name,

        index: neiliansMap[name].index,
        globalIndex: i,

        $el: $el,
      }

      // neiliansMap[name].neilians.push(neilain)

      neilians.push(neilain)

    })

    hideTooltip()
    setHeader()
    renderNeilianList()

    if (autoRefresh === 'true') {
      setTimeout(function () {
        getAllNeilians()
      }, 10 * 1000)
    }

  }

  function renderNeilianList () {

    var $neilians = []

    $.each(neilians, function (i, n) {
      $neilians.push(` 
      
      <li class="us_neilian_toolbar__body__list__item" data-index="${n.globalIndex}">
              <span class="us_neilian_toolbar__body__list__item__index">${n.globalIndex +
      1}</span>
              
              
              <span class="us_neilian_toolbar__body__list__item__status ${n.index >
      1 ? 'warn' : 'ok'}">
                <i class="icon baike_icon_picall 
                ${n.index > 1
        ? 'baike_icon_picall-gantanhao'
        : 'baike_icon_picall-icon_tupianxuanzhong-copy'}
                "></i>
              </span>
              
              
              <div class="us_neilian_toolbar__body__list__item__name"  >${n.index} - ${n.name}</div>


              <div class="us_neilian_toolbar__body__list__item__action">
                <div class="us_neilian_toolbar__body__list__item__action__container">
       
                  <a href="javascript:;" class="check" data-index="${n.globalIndex}" >
                    检测
                  </a>
                  <a href="javascript:;" class="dis-link" data-index="${n.globalIndex}" >
                    取消
                  </a>
                  <a  class="open" href="https://baike.baidu.com/item/${n.name}${n.id
        ? ('/' + n.id)
        : ''}"
                      target="_blank">
                    打开
                  </a>
                </div>
              </div>
            </li>
      `)
    })

    $us_neilian_list.html($neilians.join('\n'))

    //showToast(`内链助手工具初始化成功`)
  }

  function checkEditorLoad () {

    if (isReady === true) {
      return
    }

    if (checkEditorLoadIndex > 60) {
      alert('内链助手工具初始化 E1 失败，请刷新页面！')
      return
    }

    if ($('#J-lemma-main-content').length > 0) {

      setTimeout(function () {

        if ($('#us_neilian_toolbar').length === 0) {

          $('body').append(`
            <div id="us_neilian_toolbar_preview" class="us_neilian_toolbar_preview">
                <div class='us_neilian_toolbar_preview__inner' id="us_neilian_toolbar_preview__inner"></div>
                <i class="us_neilian_toolbar_preview__close  baike_icon_ins-module baike_icon_ins-module-zhuanhuanguanbitubiao"></i>
            </div>
            <div id="us_neilian_toolbar_toast" class="us_neilian_toolbar_toast">内链助手: 已更新</div>
            <div id='us_neilian_toolbar_tooltip' class='us_neilian_toolbar_tooltip'>
                <div class='us_neilian_toolbar_tooltip__inner' id="us_neilian_toolbar_tooltip__inner"></div>
                <i class="icon baike_icon_picall baike_icon_picall-icon_guanbi"></i>
            </div>
            `)

          $us_neilian_toolbar_tooltip = $('#us_neilian_toolbar_tooltip')

          $us_neilian_toolbar_tooltip__inner =
            $('#us_neilian_toolbar_tooltip__inner')
          $('.right-content').prepend($neilianToolbar)

          $us_neilian_toolbar__body__header =
            $('.us_neilian_toolbar__body__header')

          $onekeyUnique = $('.us_neilian_toolbar__header-onekey-unique')
          $refresh = $('.us_neilian_toolbar__header-refresh')
          $us_neilian_list = $('#us_neilian_list')

          $us_neilian_toolbar_toast = $('#us_neilian_toolbar_toast')

          $auto_refresh = $('#us_neilian_toolbar__header-auto-refresh')

          $auto_refresh.prop('checked', autoRefresh === 'true')

          $us_neilian_toolbar_preview = $('#us_neilian_toolbar_preview')
          $us_neilian_toolbar_preview__inner =
            $('#us_neilian_toolbar_preview__inner')

          bindEvent()

          getAllNeilians()

          showToast(`内链助手 初始化成功`)

          runRemoveNeilianTask()

        }

        isReady = true
      }, 0)

    }

    checkEditorLoadIndex++

    setTimeout(function () {
      checkEditorLoad()
    }, 1000)
  }

  function setHeader () {

    var unique = 0
    for (var key in neiliansMap) {
      if (neiliansMap[key].index > 1) {
        unique += 1
      }
    }

    $us_neilian_toolbar__body__header.html(
      `共 <em class="total">${neilians.length}</em> 条内链， 内有重复内链 <em class="unique">${unique}</em> 条`)
  }

  function bindEvent () {

    $onekeyUnique.on('click', function (e) {
      var $target = $(e.target)

      var num = 0
      $.each(neilians, function (i, neilian) {
        if (neilian.index > 1) {
          num += 1
          removeNeilian(neilian)
        }

      })

      showToast(`共删除 ${num} 个内链`)

      getAllNeilians()

    })

    $refresh.on('click', function (e) {
      var $target = $(e.target)

      showToast(`刷新内链`)
      getAllNeilians()
    })

    $auto_refresh.on('click', function (e) {

      setTimeout(function () {
        var checked = $auto_refresh.prop('checked')

        autoRefresh = 'true'
        localStorage.setItem(autoRefreshKey, 'true')

        if (checked) {
          getAllNeilians()
        }
      }, 160)

    })

    $us_neilian_list.on('mouseleave', '.us_neilian_toolbar__body__list__item',
      function (e) {
        //console.log(e.target)

        //hideNeilianPreview()
      }).
      on('click', '.us_neilian_toolbar__body__list__item__name', function (e) {
        var $target = $(e.target).
          closest('.us_neilian_toolbar__body__list__item')

        var index = $target.data('index')

        if (neilians[index].index > 1) {
          $us_neilian_toolbar_tooltip.removeClass(
            'us_neilian_toolbar_tooltip--ok').
            addClass('us_neilian_toolbar_tooltip--warn')
          $us_neilian_toolbar_tooltip__inner.html(
            `第 ${neilians[index].index} 个`)
        } else {
          $us_neilian_toolbar_tooltip.removeClass(
            'us_neilian_toolbar_tooltip--warn').
            addClass('us_neilian_toolbar_tooltip--ok')
          $us_neilian_toolbar_tooltip__inner.html(`很有精神！`)
        }

        var offset = neilians[index].$el.offset()

        $us_neilian_toolbar_tooltip.css(offset).css({ opacity: 1 })

        $('html').scrollTop(offset.top - 200)
      }).

      on('scroll', function () {

        // if ($us_neilian_toolbar_preview.data('css') && us_neilian_toolbar_preview_show === true) {
        //   var top = $us_neilian_toolbar_preview.data('css').top -
        //     $(this).scrollTop()
        //   if (top < 0) {
        //
        //     //hideNeilianPreview()
        //     $us_neilian_toolbar_preview.css('top',
        //       -200)
        //   } else {
        //     $us_neilian_toolbar_preview.css({
        //       'top': top,
        //       opacity: 1,
        //     })
        //   }
        // }

      }).

      on('click', '.check', function (e) {
        var $target = $(e.target)

        var $target = $target.hasClass('us_neilian_toolbar__body__list__item')
          ? $target
          : $(e.target).
            closest('.us_neilian_toolbar__body__list__item')

        var index = $target.data('index')

        if (neilians[index]) {

          var offset = $target.parent().offset()

          var position = $target.position()

          //console.log("asdadsd", $target.offset().top, $target.parent().scrollTop())

          var css = {
            top: 180, //offset.top - 35 + position.top,
            // left: offset.left - 500,
            opacity: 1,
          }

          $us_neilian_toolbar_preview.data('css', css).css(css)

          $us_neilian_toolbar_preview__inner.html('加载中...')

          clearTimeout(showNeilianPreviewTimer)
          showNeilianPreviewTimer = setTimeout(function () {

            us_neilian_toolbar_preview_show = true
            showNeilianPreview(neilians[index])
          }, 500)
        }

      }).on('click', '.dis-link', function (e) {
      var $target = $(e.target)

      var index = $target.data('index')

      removeNeilian(neilians[index])

      showToast(`已删除第 ${neilians[index].index} 个 [${neilians[index].name}]`)

      getAllNeilians()
    })

    $us_neilian_toolbar_tooltip.on('click', function () {
      hideTooltip()
    })

    $us_neilian_toolbar_preview.on('click', '.change', function (e) {

      var $target = $(e.target)

      var index = $target.data('index')

      var neilian = neilians[index]

      var id = $us_neilian_toolbar_preview__inner.find('select').val()

      if (id != neilian.id) {
        applyLinkChange(neilian, id)
      } else {
        showToast('内链未更改')
      }

    }).on('click', '.cancel', function () {
      hideNeilianPreview()
    }).on('click', '.us_neilian_toolbar_preview__close', function () {
      hideNeilianPreview()
    })

    // $us_neilian_list.on('mousemove', function (e) {
    //
    //   var $target = $(e.target);
    //   if($target.)
    //
    // })

  }

  function hideTooltip () {
    $us_neilian_toolbar_tooltip.css({
      top: -30,
      opacity: 0,
    })
  }

  function showToast (msg) {
    $us_neilian_toolbar_toast.text(msg).
      addClass('us_neilian_toolbar_toast--show')
    setTimeout(function () {
      $us_neilian_toolbar_toast.removeClass('us_neilian_toolbar_toast--show')
    }, 3000)
  }

  function runRemoveNeilianTask () {

    console.log(removeNeilianTasks)

    if (removeNeilianTasks.length > 0) {

      var needRemoveNeilian = removeNeilianTasks[0]

      var range = document.createRange()
      range.selectNodeContents(needRemoveNeilian.$el.get(0))
      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)

      setTimeout(function () {
        var $icon = $('#J-editor-top-bar').
          find('.baike_icon_word-lianjie')
        var $button = $icon.closest('button')
        if ($button.hasClass('active')) {
          $button.trigger('click')
          showToast(`一键去重 ${needRemoveNeilian.name}`)
        }

        removeNeilianTasks.shift()

      }, 300)
    }

    setTimeout(function () {
      runRemoveNeilianTask()
    }, 500)

  }

  function removeNeilian (neilian) {

    removeNeilianTasks.push(neilian)

    // neilian.$el.after(neilian.name).remove()

  }

  function getNeilianInfoById (id) {

    return $.ajax({
      url: '/editor/helper/getlemmainfo',
      type: 'GET',
      cache: !1,
      dataType: 'json',
      data: {
        lemmaId: id,
        tk: window._tplData.tk,
      },
    })
  }

  function getNeilianInfoByKeyword (name) {

    return $.ajax({
      url: '/editor/helper/getlemmas',
      type: 'GET',
      cache: !1,
      dataType: 'json',
      data: {
        keywords: name,
        tk: window._tplData.tk,
      },
    })

  }

  function showNeilianPreview (neilian) {

    getNeilianInfoByKeyword(neilian.name).done(function (json) {

      var json1 = {
        'errno': 0,
        'errmsg': '',
        'data': [
          {
            'lemmaId': 9960411,
            'lemmaDesc': '\u548c\u897f\u90e8\u76f8\u5bf9\u5e94\u7684\u5730\u65b9',
            'lemmaTitle': '\u4e1c\u90e8',
          },
        ],
      }

      if (json.errno !== 0) {
        console.log(neilian.name + ' is 空链')
        $us_neilian_toolbar_preview__inner.
          html(`该词条（${neilian.name}）为空链'`)
        return
      }

      var neilianPreview = {
        noOtherMean: typeof neilian.id !== 'undefined',
        id: neilian.id,
        name: neilian.name,
        globalIndex: neilian.globalIndex,
        $el: neilian.$el,
        desc: '',
        content: '',
        info: null,
        others: [],
      }

      if (json.data.length > 0) {

        neilianPreview.info = json.data[0]
        neilianPreview.others = json.data
        neilianPreview.id = neilianPreview.info.lemmaId
        neilianPreview.desc = neilianPreview.info.lemmaDesc

        renderNeilianPreview(neilianPreview)

      } else {
        $us_neilian_toolbar_preview__inner.
          html(`该词条（${neilian.name}）为空链'`)
      }

      // else {
      //
      //   getNeilianInfoById(json.id).done(function (json) {
      //
      //   })
      //
      // }

    }).catch(function () {
      $us_neilian_toolbar_preview__inner.
        html(`该词条（${neilian.name}）为空链'`)
    })

  }

  function hideNeilianPreview () {
    us_neilian_toolbar_preview_show = false
    $us_neilian_toolbar_preview.css({
      opacity: 0,
      top: -210,
    })

  }

  function renderNeilianPreview (neilianPreview) {

    $us_neilian_toolbar_preview__inner.html(`
    
    
    
    <div class="us_neilian_toolbar_preview__container">
        <div class="us_neilian_toolbar_preview__container__title">
                词条名：<a  class="open" href="https://baike.baidu.com/item/${neilianPreview.name}${neilianPreview.id
      ? ('/' + neilianPreview.id)
      : ''}" target="_blank">${neilianPreview.name} [${neilianPreview.id}]</a>
        </div>
    <div class="us_neilian_toolbar_preview__container__select">
        义项名 [${neilianPreview.others.length}项]： 
        <select>
            ${getNeilianPreviewSelect(neilianPreview)}        
        </select>
    </div>
    
    <div class="us_neilian_toolbar_preview__container__content">
        
    </div>
       
    <div class="us_neilian_toolbar_preview__container__action">
        
        <button type="button" data-index="${neilianPreview.globalIndex}" class="cancel">取消</button>     
        <button type="button" data-index="${neilianPreview.globalIndex}" class="change">切换</button>
        
    </div>
        
       
        

    </div>
    `)

    $us_neilian_toolbar_preview__inner.find('select').
      val(neilianPreview.id).
      on('change', function () {
        var id = $(this).val()

        $('.us_neilian_toolbar_preview__container__content').
          html('加载中...')

        getNeilianInfoById(id).done(function (json) {
          renderNeilianPreviewContent(json)
        }).catch(function () {
          $('.us_neilian_toolbar_preview__container__content').
            html('义项内容加载失败或没有数据')
        })

      })

    $('.us_neilian_toolbar_preview__container__content').
      html('加载中...')

    getNeilianInfoById(neilianPreview.id).done(function (json) {
      renderNeilianPreviewContent(json)
    }).catch(function () {
      $('.us_neilian_toolbar_preview__container__content').
        html('义项内容加载失败或没有数据')
    })

  }

  function getNeilianPreviewSelect (neilianPreview) {

    var selects = neilianPreview.others.map(function (neilian, i) {

      return `<option value="${neilian.lemmaId}">${i +
      1}、${neilian.lemmaDesc}[${neilian.lemmaId}]</option>`

    })

    // selects.unshift(`<option value="" selected>请选择</option>`)

    return selects.join('')

  }

  function renderNeilianPreviewContent (json) {

    var json1 = {
      'errno': 0,
      'errmsg': '',
      'data': {
        'summary': '\u4eba\u53e3\u662f\u4e00\u4e2a\u5185\u5bb9\u590d\u6742\u3001\u7efc\u5408\u591a\u79cd\u793e\u4f1a\u5173\u7cfb\u7684\u793e\u4f1a\u5b9e\u4f53\uff0c\u5177\u6709\u6027\u522b\u548c\u5e74\u9f84\u53ca\u81ea\u7136\u6784\u6210\uff0c\u591a\u79cd\u793e\u4f1a\u6784\u6210\u548c\u793e\u4f1a\u5173\u7cfb\u3001\u7ecf\u6d4e\u6784\u6210\u548c\u7ecf\u6d4e\u5173\u7cfb\u3002\u662f\u4e00\u5b9a\u6570\u91cf\u4e2a\u4eba\u7684\u7efc\u5408\uff0c\u5f3a\u8c03\u89c4\u6a21\u3002\u4eba\u53e3\u7684\u51fa\u751f\u3001\u6b7b\u4ea1\u3001\u5a5a\u914d\uff0c\u5904\u4e8e\u5bb6\u5ead\u5173\u7cfb\u3001\u7ecf\u6d4e\u5173\u7cfb\u3001\u653f...',
        'coverImage': 'https:\/\/bkimg.cdn.bcebos.com\/pic\/77c6a7efce1b9d165dce49bffbdeb48f8d5464e7',
      },
    }
    //

    $('.us_neilian_toolbar_preview__container__content').
      html(`
   
    
  <div class="us_neilian_toolbar_preview__container__content__img"  style="${json.data.coverImage ==
      '' ? 'margin-right: 0; width:0;' : 'background-image: url(\'' +
        json.data.coverImage + '\')'};"
  onclick="window.open('${json.data.coverImage}')"
  ></div>
  <div class="us_neilian_toolbar_preview__container__content__desc">${json.data.summary}</div>
        
       
    `).
      on('click', '.us_neilian_toolbar_preview__container__content__img',
        function (e) {

        })
  }

  function applyLinkChange (neilian, id) {
    // e.setAttribute("data-lemmaid", t),
    //   e.setAttribute("href", "#")
    neilian.$el.attr({
      'data-lemmaid': id,
      href: '#',
    })

    window.__contextEditor.triggleContentChange(function () {},
      'TriggleContentChangeType_toggleLink')

    showToast('内链已更改')

    setTimeout(function () {
      hideNeilianPreview()

      getAllNeilians()
    }, 500)
  }

  $(function () {

    // $(".right-content").append($neilianToolbar);

    appendStyle()
    checkEditorLoad()

    //renderNeilianList()

  })

})($.noConflict(true))


