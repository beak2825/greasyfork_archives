// ==UserScript==
// @name         石墨文档快捷格式插件
// @namespace    QQ421566927
// @version      0.5
// @description  石墨文档快捷键格式应用,石墨文档格式刷,点击左下角小窗口来使用
// @resource     layuiCss https://www.layuicdn.com/layui-v2.5.7/css/layui.css
// @resource     layDate https://cdn.bootcdn.net/ajax/libs/layui/2.5.7/css/modules/laydate/default/laydate.css?v=5.0.9
// @resource     layerCss https://cdn.bootcdn.net/ajax/libs/layui/2.5.7/css/modules/layer/default/layer.css?v=3.1.1
// @resource     codeCss https://cdn.bootcdn.net/ajax/libs/layui/2.5.7/css/modules/code.css
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layui/2.5.7/layui.all.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/mousetrap/1.6.5/mousetrap.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/mousetrap/1.6.5/plugins/record/mousetrap-record.min.js
// @require      https://cdn.bootcss.com/store.js/1.3.20/store.min.js
// @match        https://shimo.im/docs/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/421434/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%E5%BF%AB%E6%8D%B7%E6%A0%BC%E5%BC%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/421434/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%E5%BF%AB%E6%8D%B7%E6%A0%BC%E5%BC%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
  'use strict';

  var defaultData = [
    {
      "key": "shimo_format_1",
      "value": {
        "name": "默认黑字",
        "content":"",
        "format": "<span class=\"ql-author-45317226\" style=\"color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);color: #000000;\">预览</span>",
        "hotkey": "ctrl+0",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_2",
      "value": {
        "name": "红字删除线",
        "content":"",
        "format": "<s style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</s>",
        "hotkey": "ctrl+1",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_3",
      "value": {
        "name": "蓝字加粗",
        "content":"",
        "format": "<strong style=\"color: rgb(25, 67, 156);color: #19439c;\">预览</strong>",
        "hotkey": "ctrl+2",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_4",
      "value": {
        "name": "绿字加粗",
        "content":"",
        "format": "<strong style=\"color: rgb(28, 114, 49);color: #1c7231;\">预览</strong>",
        "hotkey": "ctrl+3",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_5",
      "value": {
        "name": "①",
        "content":"①",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+1",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_6",
      "value": {
        "name": "②",
        "content":"②",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+2",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_7",
      "value": {
        "name": "③",
        "content":"③",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+3",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_8",
      "value": {
        "name": "④",
        "content":"④",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+4",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_9",
      "value": {
        "name": "⑤",
        "content":"⑤",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+5",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_10",
      "value": {
        "name": "⑥",
        "content":"⑥",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+6",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_11",
      "value": {
        "name": "⑦",
        "content":"⑦",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+7",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_12",
      "value": {
        "name": "⑧",
        "content":"⑧",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+8",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_13",
      "value": {
        "name": "⑨",
        "content":"⑨",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+9",
        "isDefault": true
      }
    },
    {
      "key": "shimo_format_14",
      "value": {
        "name": "⑩",
        "content":"⑩",
        "format": "<strong style=\"color: rgb(255, 0, 0);color: #ff0000;\">预览</strong>",
        "hotkey": "alt+0",
        "isDefault": true
      }
    }
  ]

  var layuiCss_CssSrc = GM_getResourceText ("layuiCss");
  var layDate_CssSrc = GM_getResourceText ("layDate");
  var layerCss_CssSrc = GM_getResourceText ("layerCss");
  var codeCss_CssSrc = GM_getResourceText ("codeCss");
  GM_addStyle (layuiCss_CssSrc);
  GM_addStyle (layDate_CssSrc);
  GM_addStyle (layerCss_CssSrc);
  GM_addStyle (codeCss_CssSrc);

  var style = document.createElement("style");
  style.type = "text/css";
  var text = document.createTextNode(".layui-layer-ico{background: url('https://cdn.bootcdn.net/ajax/libs/layui/2.5.7/css/modules/layer/default/icon.png') no-repeat;}@font-face {font-family: layui-icon;src: url('https://www.layuicdn.com/layui-v2.5.7/font/iconfont.eot?v=256');src: url('https://www.layuicdn.com/layui-v2.5.7/font/iconfont.eot?v=256#iefix') format('embedded-opentype'),url('https://www.layuicdn.com/layui-v2.5.7/font/iconfont.woff2?v=256') format('woff2'),url('https://www.layuicdn.com/layui-v2.5.7/font/iconfont.woff?v=256') format('woff'),url('https://www.layuicdn.com/layui-v2.5.7/font/iconfont.ttf?v=256')format('truetype'),url('https://www.layuicdn.com/layui-v2.5.7/font/iconfont.svg?v=256#layui-icon') format('svg')}");
  style.appendChild(text);
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);

  //全局变量
  var canCopy = false
  var tempNumber = 0
  var isRecord = false
  var hotKeyList = []
  var keyPrefix = 'shimo_format_'
  var isPaste = false


  var getRecordData = function () {
    var formatData = []

    if(!store.get(keyPrefix+'1')){
      defaultData.forEach(function (item) {
        store.set(item.key, item.value)
      })
    }

    store.forEach(function(key, val) {
      if(key.indexOf(keyPrefix) != -1){
        val.number = key.split('_')[2]
        formatData[val.number] = val
        if(val.hotkey != ''){
          hotKeyList[val.hotkey] = val
        }
      }
    })
    return formatData
  }

  var setRecordData = function (number,name,content,format,hotkey,isDefault) {
    var formatData = {
      name:name,
      content:content,
      format:format,
      hotkey:hotkey,
      isDefault:isDefault
    }
    store.set(keyPrefix+number, formatData)
  }

  var getInsertNumber = function () {
    var numberList = []

    store.forEach(function(key, val) {
      if(key.indexOf(keyPrefix) != -1){
        var splitRes = key.split('_')
        if(splitRes.length == 3){
          numberList.push(splitRes[2])
        }
      }
    })

    if(numberList.length > 0){
      var n = Math.max.apply(null, numberList);
      return n + 1
    }else{
      return 1
    }
  }

  var getBaseRowData = function (item) {
    var row =  '<div name="p_data_row_'+item.number+'" isdefault="'+item.isDefault+'" class="layui-row" style="font-size: 16px;margin-left:-160px;padding-left: 50px;">\n' +
        '    <div class="layui-col-sm2">\n' +
        '     &nbsp;'  +
        '    </div>\n' +
        '    <div class="layui-col-sm1" style="text-align: right;">\n' +
        '     名称:'  +
        '    </div>\n' +
        '    <div class="layui-col-sm2">\n' +
        '       <input type="text" style="width: 90px;" value="'+item.name+'" name="p_data_name" autocomplete="off" placeholder="请输入名称" class="layui-input-inline">\n' +
        '    </div>\n' +
        '    <div class="layui-col-sm1" style="text-align: center;margin-left:-30px;">\n' +
        '        <a name="p_data_record" href="javascript:void(0)"><i class="layui-icon layui-icon-radio" style="font-size: 19px; color: #1E9FFF;padding-top: 3px"></i></a>\n' +
        '    </div>\n' +
        '    <div class="layui-col-sm1">\n' +
        '        <span name="p_data_preview">'+item.format+'</span>\n' +
        '    </div>\n' +
        '    <div class="layui-col-sm2">\n' +
        '       <input type="text" style="width: 90px;" value="'+item.content+'" name="p_data_content" autocomplete="off" placeholder="替换文字" class="layui-input-inline">\n' +
        '    </div>\n' +
        '    <div class="layui-col-sm2" name="p_data_quike" style="padding-top: 2px;">\n' +
        '        <input  style="width: 130px;font-size: 16px;" value="'+item.hotkey+'"  type="text" name="title" lay-verify="title" autocomplete="off" placeholder="录制快捷键" class="layui-input-inline" disabled>\n' +
        '    </div>\n' +
        '    <div class="layui-col-sm1" style="padding-left: 20px;">\n' +
        '        <a name="p_data_brush" href="javascript:void(0)"><i class="layui-icon layui-icon-fonts-clear" style="font-size: 19px; color: #1E9FFF;padding-top: 3px"></i></a>\n' +
        '        <a name="p_data_del" href="javascript:void(0)"><i class="layui-icon layui-icon-delete" style="font-size: 19px; color: #1E9FFF;padding-top: 3px"></i></a>\n' +
        '    </div>\n' +
        '</div>'

    return row

  }

  var render = function () {
    var htmlStr = ''
    var addDataButton = '<div class="layui-col-md12" style="text-align: center;margin-top: 4%"><button name="p_data_add_button" type="button" style="background-color: #5c5c5c;" class="layui-btn"><i class="layui-icon">&#xe608;</i> 添加</button></div>'
    var dataRes = getRecordData()

    dataRes.forEach(function (item) {
      var tempHtml = getBaseRowData(item)
      htmlStr += tempHtml
    })
    htmlStr += addDataButton
    return htmlStr
  }

  var getRowNum = function(el){
    var prent = $(el).parents('div[name^="p_data_row_"]')
    var num = prent.attr('name').split('_')[3]
    return num
  }

  //记忆窗口
  var setWindow = function(layero,type){
    var top = $(layero).css('top').replace('px','')
    var left = $(layero).css('left').replace('px','')
    var height = $(layero).css('height').replace('px','')
    var width = $(layero).css('width').replace('px','')

    if(type == 'moveWindow'){
      store.set('layer_window_top',parseInt(top) == 0 ? 1 : parseInt(top))
      store.set('layer_window_left',parseInt(left) == 0 ? 1 : parseInt(left))
    }

    if(type == 'reSize'){
      store.set('layer_window_height',height)
      store.set('layer_window_width',width)
    }
  }

  var replaceSelection = function(replaceText) {
    if (window.getSelection) {
      var selecter = window.getSelection();
      var range = selecter.getRangeAt(0);
      let textEl = document.createRange().createContextualFragment(replaceText).children;
      console.log(textEl)
      selecter.removeAllRanges()
      selecter.empty();
      range.deleteContents()
      range.insertNode(textEl[0]);
    } else if (document.selection) {//ie
      var selecter = document.selection.createRange();
      selecter.select();
      selecter.pasteHTML(replaceText);
    }
  }


  layui.use('layer', function(){
    var $ = layui.jquery
    var active = {
      setTop: function(firstOpen = false){
        var that = this;
        //多窗口模式，层叠置顶
        var top = store.get('layer_window_top')  ?  store.get('layer_window_top') : '280'
        var left = store.get('layer_window_left')  ?  store.get('layer_window_left') : '900'
        var width = store.get('layer_window_width') ? store.get('layer_window_width')+'px' : '700px'
        var height = store.get('layer_window_height') ? store.get('layer_window_height')+'px' : '530px'
        layer.open({
          id:'p_data_all'
          ,type: 1 //此处以iframe举例
          ,title: '快捷格式插件'
          ,area: [ width,height]
          ,shade: 0
          ,maxmin: true
          ,closeBtn: false
          ,offset: [
            top
            ,left
          ]
          ,content: render()
          ,yes: function(){
            $(that).click();
          }
          ,btn2: function(){
            layer.closeAll();
          }
          ,zIndex: layer.zIndex
          ,success: function(layero){
            layer.setTop(layero);
            if(firstOpen){
              setTimeout(function () {
                $('.layui-layer-min').click()
              },1000)
            }
          },
          moveEnd: function(layero){
            setWindow(layero,'moveWindow')
          },
          resizing: function(layero){
            setWindow(layero,'reSize');
          },
        });
      },
      msg:function (msg) {
        layer.msg(msg)
      }
    };
    active.setTop(true)

    //监听部分
    //添加按钮
    $(document).on('click',':button[name="p_data_add_button"]',function () {
      var number =  getInsertNumber()
      setRecordData(number,'','','预览','',false)
      $('#p_data_all').html(render())
    })

    //名称输入框监听
    $(document).on('blur',':input[name="p_data_name"]',function () {
      var input_name = $(this).val()
      var num = getRowNum(this)
      var cur = store.get(keyPrefix+num)
      setRecordData(num,input_name,cur.content,cur.format,cur.hotkey,cur.isDefault)
      layer.msg('保存成功',{zIndex:layer.zIndex})
    })

    //内容输入框监听
    $(document).on('blur',':input[name="p_data_content"]',function () {
      var input_content = $(this).val()
      var num = getRowNum(this)
      var cur = store.get(keyPrefix+num)
      setRecordData(num,cur.name,input_content,cur.format,cur.hotkey,cur.isDefault)
      layer.msg('保存成功',{zIndex:layer.zIndex})
    })

    //录制
    $(document).on('click','a[name="p_data_record"]',function () {
      canCopy = true
      tempNumber  = getRowNum(this)
      layer.msg('请选中文本格式后使用 Ctrl+C 录入格式',{zIndex:layer.zIndex})
    })

    //快捷键
    $(document).on('click','div[name="p_data_quike"]',function () {
      isRecord = true
      layer.msg('请输入快捷键',{zIndex:layer.zIndex})
      tempNumber = getRowNum(this)
    })

    //删除
    $(document).on('click','a[name="p_data_del"]',function () {
      var prent = $(this).parents('div[name^="p_data_row_"]')
      if($(prent).attr('isdefault') == 'true'){
        layer.msg('默认配置不可删除!',{zIndex:layer.zIndex})
        return false;
      }
      var num = prent.attr('name').split('_')[3]
      store.remove(keyPrefix+num)
      $('#p_data_all').html(render())
      layer.msg('删除成功',{zIndex:layer.zIndex})
    })


    //单机刷子
    $(document).on('click','a[name="p_data_brush"]',function () {
      let allData = getRecordData()
      var itemEl = $(this).parent().parent()
      var elIndex = ($('#p_data_all div').index(itemEl)/9)+1
      console.log(elIndex)
      layer.msg('请选中需要应用的文字',{zIndex:layer.zIndex})
      var brushOver = false
      //$textElem是指编辑器可编辑区域（详情请查看源码）
      $('div.ql-editor.notranslate').on('mouseup', e => {
        if(brushOver == false){
          brushOver = true
          // document.querySelector('.ql-clean.ql-toolbar-widget').click()
          var selection = window.getSelection() || document.getSelection() || document.selection.createRange();
          console.log(selection)
          console.log(selection.text)
          var item = allData[elIndex]
          if(item.content == ""){
            var selectionStr = window.getSelection().toString()
          }else{
            var strLen = window.getSelection().toString().length
            var selectionStr = ""
            for (var i=0;i<strLen;i++){
              selectionStr += item.content
            }
          }
          var copyStr = item.format.replace('>预览</','>'+selectionStr+'</')
          replaceSelection(copyStr)
        }
      })
    })

  });

  document.addEventListener('paste', function (event) {
    if(isPaste){
      isPaste = false
      layer.msg('应用成功!',{zIndex:layer.zIndex})
    }
  })

  document.addEventListener('copy', function (event) {
    if(canCopy){
      var clipboardData = event.clipboardData || window.clipboardData;
      var res =  clipboardData.getData('text/html');
      canCopy = false
      var el = $($(res).children()[0])
      var elHtml = el.prop('innerHTML')
      if($(elHtml).length >1){
        elHtml = $($(elHtml)[0]).prop('outerHTML')
        elText = $($(elHtml)[0]).text()
      }else{
        var elText = $($(res).children()[0]).text()
      }

      var resHtml = elHtml.replace('>'+elText+'</','>预览</')

      if(elText == elHtml){
        resHtml = "<span class=\"ql-author-45317226\">预览</span>"
      }

      var cur = store.get(keyPrefix+tempNumber)
      setRecordData(tempNumber,cur.name,cur.content,resHtml,cur.hotkey,cur.isDefault)
      $('#p_data_all').html(render())
      layer.msg('格式录制成功!',{zIndex:layer.zIndex})
    }
  });


  $(document).keydown(function(event){
    Mousetrap.record(function(sequence) {
      var keyStr = sequence.join(' ')

      if(keyStr == 'ctrl+shift+m'){
        store.remove('layer_window_top')
        store.remove('layer_window_left')
        store.remove('layer_window_height')
        store.remove('layer_window_width')
        layer.msg('重置窗口成功,请刷新页面',{zIndex:layer.zIndex})
      }

      if(isRecord){
        isRecord = false
        var num = tempNumber
        var cur = store.get(keyPrefix+num)
        let allData = getRecordData()
        let isRepeat = false;
        allData.forEach(function (item) {
          if(item.number != num && item.hotkey == keyStr){
            isRepeat = true
          }
        })

        if(isRepeat){
          layer.msg('错误!!快捷键已经存在!!! 快捷键:'+keyStr,{zIndex:layer.zIndex})
          return false;
        }

        setRecordData(num,cur.name,cur.content,cur.format,keyStr,cur.isDefault)
        $('#p_data_all').html(render())
        layer.msg('录制成功:'+keyStr,{zIndex:layer.zIndex})
      }else{
        if(hotKeyList[keyStr] != undefined){
          var item = hotKeyList[keyStr]
          var selection = window.getSelection() || document.getSelection() || document.selection.createRange();
          var selectionStr = selection.toString()
          if(item.content != ''){
            selectionStr = item.content
          }else if(selectionStr == ''){
            selectionStr = '&#65279;'
          }

          if(item.format == '预览'){
            // var copyStr = selectionStr
            layer.msg(item.hotkey+' 还没有录制格式呢！',{zIndex:layer.zIndex})
            return false
          }else{
            var copyStr = item.format.replace('>预览</','>'+selectionStr+'</')
          }

          if (selection.rangeCount > 0) {
              var originRange = selection.getRangeAt(0);
          }else{
              var originRange = false;
          }
          

          var beforeLast = $('body').children().last()
          var text = $(copyStr).appendTo('body')
          console.log(text)
          if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
          } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(text[0]);
            selection.removeAllRanges();
            selection.addRange(range);
          }

          document.execCommand('Copy','false',null);

          $(beforeLast).nextAll().remove()

          selection.removeAllRanges();
          if(originRange){
             selection.addRange(originRange)
          }
          isPaste = true
          // var tempStr = item.content != '' ? "内容:'"+item.content+"' 已复制" : '格式:'+item.name+'已处理完成'
          // layer.msg(tempStr+',使用 Ctrl+V 应用',{zIndex:layer.zIndex})

          // document.querySelector('.ql-clean.ql-toolbar-widget').click()
          if(item.content == ""){
            var selectionStr = window.getSelection().toString()
          }else{
            var strLen = window.getSelection().toString().length
            var selectionStr = ""
            if(strLen == 0){
              strLen = 1
            }
            for (var i=0;i<strLen;i++){
              selectionStr += item.content
            }
          }
          var copyStr = item.format.replace('>预览</','>'+selectionStr+'</')
          console.log(copyStr)
          if(originRange){
              replaceSelection(copyStr)
          }
          layer.msg(item.name+' 快捷键格式应用成功!',{zIndex:layer.zIndex})

          //
          // if (selectStr.trim() != "") {
          //
          // }else{
          //   var tempStr = item.content != '' ? "内容:'"+item.content+"' 已复制" : '格式:'+item.name+'已处理完成'
          //   layer.msg(tempStr+',使用 Ctrl+V 应用',{zIndex:layer.zIndex})
          // }

        }

      }
    });
  });
})();
