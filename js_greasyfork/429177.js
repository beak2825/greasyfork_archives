// ==UserScript==
// @name         天猫商品详情抓取
// @namespace    http://leironghua.com/
// @version      1.4.3
// @description  天猫商品详情抓取，
// @license      MIT
// @author       雷荣华
// @run-at       document-end
// @match        *detail.tmall.com/item.htm*
// @icon         https://www.pinduoduo.com/homeFavicon.ico
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.17.0/dist/xlsx.full.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/filesaver.js@1.3.4/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/429177/%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429177/%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var theme = 'classic' // 只能使用classic和gray主题，其他主题会影响正常的页面文字大小
  var extjsHost = 'https://cdn.jsdelivr.net/gh/tremez/extjs-gpl' // https://cdn.jsdelivr.net/gh/bjornharrtell/extjs@6.2.0

  GM_addElement('link', {
    type: 'text/css',
    rel: 'stylesheet',
    href:extjsHost + '/build/classic/theme-' + theme + '/resources/theme-' + theme + '-all.css'
  });
  GM_addElement('link', {
    type: 'text/css',
    rel: 'stylesheet',
    href: extjsHost +'/build/packages/ux/classic/' + theme + '/resources/ux-all.css'
  });
  GM_addElement('link', {
    type: 'text/css',
    rel: 'stylesheet',
    href: extjsHost +'/build/packages/font-awesome/resources/font-awesome-all.css'
  });
  var urls = [extjsHost +'/build/ext-all.js',
    extjsHost +'/build/classic/theme-' + theme + '/theme-' + theme + '.js',
    extjsHost +'/build/packages/ux/classic/ux.js',
    extjsHost +'/build/classic/locale/locale-zh_CN.js'
  ]

  var urlsIndex = 0;

  var recursiveCallback = function () {
    if (++urlsIndex < urls.length) {
      loadScript(urls[urlsIndex], recursiveCallback)
    } else {
      window._lrhInterval = window.setInterval(function () {
        if (jQuery('.rate-filter').length == 0) {
          return;
        }
        // 去掉定时器的方法，已经加载完成
        window.clearInterval(window._lrhInterval);
        Ext.onReady(function () {
          Ext.tip.QuickTipManager.init();
          unsafeWindow.Ext = Ext
          unsafeWindow.jQuery = jQuery
          jQuery('#site-nav').css('z-index', 10000)
          jQuery('.rate-filter').append('<a id="_lrh_btn_img" class="sn-register" href="javascript:void(0);" >【提取商品图片】</a>');
          $('#_lrh_btn_img').click(function (event) {
            event.stopImmediatePropagation();
            if (jQuery('.j_UserNick').length === 0) {
              Ext.Msg.show({
                title: '操作警告',
                msg: '您还未登录，请先登录后，再操作此功能！',
                buttons: Ext.Msg.OK,
                scope: this,
                fn: function () {
                  jQuery('.sn-login')[0].click()
                },
                icon: Ext.Msg.WARNING
              }).focus()
              return;
            }
            onBtnLrhImgClick()
          })
        })
      }, 1000);
    }
  }

  loadScript(urls[0], recursiveCallback);

  function loadScript (url, callback) {
    var script = document.createElement('script')
    script.type = 'text/javascript';

    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' ||
          script.readyState == 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { // Others
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function onBtnLrhImgClick () {
    var wins = Ext.ComponentQuery.query('window#mainWindow')
    if (wins.length > 0) {
      wins[0].show()
      return;
    }
    Ext.create('Ext.window.Window', {
      title: '商品信息列表',
      height: '90%',
      width: '90%',
      layout: 'fit',
      itemId: 'mainWindow',
      modal: true,
      // maximizable: true, // 不能启用最大化，跟滚动条事件效果冲突
      iconCls: 'x-fa fa-tasks',
      viewModel: {
        data: {
          pause: false, // 是否暂停
          next: false, // 下一步
          stop: false, // 停止，并开始下载
          ziping: false, // 正在压缩中
          finish: false // 脚本完成
        }
      },
      tbar: [{
        text: '脚本控制',
        bind: {
          iconCls: '{(pause || finish) ? "x-fa fa-cog" : "x-fa fa-cog fa-spin"}',
          disabled: '{ziping || finish}'
        },
        menu: [{
          text: '暂停拉取数据',
          action: 'pause',
          iconCls: 'x-fa fa-pause',
          handler: 'onStepClick',
          bind: {
            disabled: '{pause}'
          }
        }, {
          text: '继续拉取数据',
          action: 'continue',
          iconCls: 'x-fa fa-play-circle',
          handler: 'onStepClick',
          bind: {
            disabled: '{!pause}'
          }
        }, '-', {
          text: '跳过拉取并开始下一步',
          action: 'next',
          iconCls: 'x-fa fa-step-forward',
          handler: 'onStepClick',
          bind: {
            disabled: '{pause}'
          }
        }, {
          text: '结束拉取并开始下载',
          iconCls: 'x-fa fa-stop',
          action: 'stop',
          handler: 'onStepClick',
          bind: {
            disabled: '{pause}'
          }
        }, '-', {
          text: '重新开始',
          iconCls: 'x-fa fa-mail-reply-all',
          handler: 'onStepClick'
        }]
      }, {
        xtype: 'progressbar',
        reference: 'progressbar',
        flex: 1
      }, {
        text: '下载文件',
        iconCls: 'x-fa fa-download',
        handler: 'downloadZip'
      }],
      // maximizable:true,
      closeAction: 'hide',
      defaultListenerScope: true,
      referenceHolder: true,
      listeners: {
        show: 'onWinShow'
      },
      zipObj: new JSZip(),
      onStepClick: function (btn) {
        var text = btn.text
        var action = btn.action;
        if (Ext.isEmpty(action)) {
          Ext.toast('【' + text + '】正在开发中，敬请期待。', '脚本提示')
          return
        }
        var viewModel = this.getViewModel()
        if (action === 'pause') {
          viewModel.set('pause', true)
        } else if (action === 'continue') {
          var content = this.lookup('progressbar').getText();
          this.addLog({
            level: 'INFO',
            content: content.replace('手动暂停', '手动恢复')
          })
          viewModel.set('pause', false)
        } else if (action === 'next') {
          viewModel.set('next', true)
        } else if (action === 'stop') {
          viewModel.set('stop', true)
        }
        Ext.toast('【' + text + '】操作成功。', '脚本提示')
      },
      scrollTo: function () {
        // 最初的y
        var y = this.initialXY[1];
        var scrollY = jQuery(window).scrollTop()
        this.setY(y + scrollY)
      },
      onWinShow: function () {
        var me = this
        // 获取最初的XY
        this.initialXY = this.getXY()
        this.scrollTo();
        // 如果已经有数据，则证明已经有抓取过了。重复打开不再抓取
        if (this.lookup('mainImage').getStore().getCount() > 0) {
          return
        }

        // 监听滚动事件
        jQuery(window).scroll(this.scrollTo.bind(this));

        var mainImageData = []
        var mainImageIndex = 0;
        var filePath = this.lookup('mainImage').getTitle()
        jQuery('#J_DetailMeta video source').each(function () {
          var url = jQuery(this).attr('src')
          if (url) {
            var suffix = url.split('.').pop().toLowerCase()
            mainImageData.push({
              fileName: (++mainImageIndex) + '.' + suffix,
              fileUrl: url.split(suffix)[0] + suffix,
              filePath: filePath
            })
          }
        })
        jQuery('#J_UlThumb img').each(function () {
          var url = jQuery(this).attr('src')
          if (url) {
            var suffix = url.split('.').pop().toLowerCase()
            mainImageData.push({
              fileName: (++mainImageIndex) + '.' + url.split('.').pop().toLowerCase(),
              fileUrl: url.split(suffix)[0] + suffix,
              filePath: filePath
            })
          }
        })
        this.lookup('mainImage').getStore().loadRawData(mainImageData)

        var typeImageData = []
        var typeImageImdex = 0;
        filePath = this.lookup('typeImage').getTitle()
        jQuery('.J_TSaleProp a').each(function () {
          var item = jQuery(this)
          var fileName = jQuery.trim(item.text())
          fileName = me.fileNameReplace(fileName) // 替换文件名关键字
          var url = item.css('background-image').split('"')[1]
          if (url) {
            var suffix = url.split('.').pop().toLowerCase()
            typeImageData.push({
              fileName: (++typeImageImdex) + '-' + fileName + '.' + suffix,
              fileUrl: url.split(suffix)[0] + suffix,
              filePath: filePath
            })
          } else { // 部分商品分类没有图片，只有文字
            typeImageData.push({
              fileName: (++typeImageImdex) + '-' + fileName,
              fileUrl: null,
              filePath: null
            })
          }
        })
        this.lookup('typeImage').getStore().loadRawData(typeImageData)

        var task = {
          scope: this,
          run: function () {
            // 商品详情请求地址 店铺对象.api.descUrl https://itemcdn.tmall.com/desc/icoss256988825a43d0afb0017eb8f?var=desc
            if (Ext.isEmpty(unsafeWindow.desc)) {
              return
            }
            Ext.TaskManager.stop(task, true);
            var detailImageData = []
            var detailImageImdex = 0;
            var filePath = this.lookup('detailImage').getTitle()
            jQuery('#item-flash video source').each(function () {
              var url = jQuery(this).attr('src')
              if (url) {
                var suffix = url.split('.').pop().toLowerCase()
                detailImageData.push({
                  fileName: (++detailImageImdex) + '.' + suffix,
                  fileUrl: url.split(suffix)[0] + suffix,
                  filePath: filePath
                })
              }
            })

            jQuery('#description img').each(function () {
              var item = jQuery(this)
              var url = item.data('ks-lazyload') || item.attr('src')
              if (url) {
                var suffix = url.split('.').pop().toLowerCase()
                detailImageData.push({
                  fileName: (++detailImageImdex) + '.' + suffix,
                  fileUrl: url.split(suffix)[0] + suffix,
                  filePath: filePath
                })
              }
            })
            this.lookup('detailImage').getStore().loadRawData(detailImageData)
          },
          interval: 2000
        }
        Ext.TaskManager.start(task);

        // 初始化对象
        this.initTShopSetupObj();

        // 开始加载评价数据
        this.toLoadAssess()
      },
      toLoadAssess: function () {
        var assessTextGrid = this.lookup('assessText')
        assessTextGrid.setIconCls('x-fa fa-spinner fa-pulse fa-spin') // 使用 fa-pulse 让它以 8 步旋转
        this.loadAssess(1, 1, function () {
          assessTextGrid.setIconCls(assessTextGrid.initialConfig.iconCls)
          this.loadAssessCallback()
        }, this)
      },
      fileNameReplace: function (fileName) {
        if (Ext.isEmpty(fileName)) {
          return fileName;
        }
        // 替换 \/:*?"<>| windows文件命名不能出现的所有特殊字符
        var reg = /\\|\/|\?|\*|\"|\<|\>|\:|\|/g;
        // var reg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
        fileName = fileName.replace(reg, '_');
        return fileName;
      },
      checkMm: function (config) {
        var task = {
          run: function () {
            var mask = jQuery('.mui-dialog-hasmask');
            if (mask.length === 0) { // 不存在弹出窗对象
              return;
            }
            if (mask.css('visibility') === 'hidden') {
              Ext.TaskManager.stop(task, true);
              config.success.bind(config.scope)()
              return
            }

            if (mask.css('visibility') !== 'hidden') {
              mask.css('z-index', 99999)
              jQuery('.sufei-tb-dialog-close').unbind('click').click(function () {
                Ext.TaskManager.stop(task, true);
                config.close.bind(config.scope)()
              })
            }
          },
          interval: 2000
        }
        Ext.TaskManager.start(task);
      },
      loadFile: function (param) {
        var grid = param.grid;
        var store = grid.getStore();
        var scope = param.scope;
        var callback = param.callback;
        var ignoreSuffix = param.ignoreSuffix
        var count = store.getCount()
        var model;
        var successCount = 0
        store.each(function (r) {
          var fileStatus = r.get('fileStatus')
          if (Ext.isEmpty(r.get('fileUrl'))) {
            if (Ext.isEmpty(fileStatus)) {
              r.set('fileStatus', 'jump')
              r.commit()
            }
            return
          }

          if (fileStatus === 'success' || fileStatus === 'ignore') {
            successCount++
            return
          }
          // 加载失败并且加载次数小于等于3次
          if (fileStatus !== 'success' && fileStatus !== 'ignore' && (r.get('loadCount') || 0) <= 3) {
            model = r
            return false; // 找打需要处理的记录，跳出当前循环
          }
        }, this, {
          filtered: true
        })

        if (successCount > count || !model) {
          callback.bind(scope)();
          return
        }

        successCount = successCount + 1
        var fileUrl = model.get('fileUrl');
        var fileName = model.get('fileName');
        var loadCount = model.get('loadCount') || 0
        var filePath = model.get('filePath')
        var suffix = fileUrl.split('.').pop().toLowerCase()
        if (ignoreSuffix && ignoreSuffix.indexOf(suffix) != -1) {
          this.addLog({
            level: 'INFO',
            content: fileName + '拉取跳过：' + fileUrl
          })
          model.set('fileStatus', 'ignore')
          model.commit();
          this.loadFile(param)
          return
        }

        var progress = this.lookup('progressbar');
        var viewModel = this.getViewModel()
        var progressText = progress.getText()
        if (viewModel.get('pause') === true) {
          var pauseInfo = '手动暂停：'
          if (progressText.indexOf(pauseInfo) === -1) {
            progressText = pauseInfo + progressText
            progress.updateText(progressText)
            this.addLog({
              level: 'INFO',
              content: progressText
            })
          }
          Ext.Function.defer(this.loadFile, 2000, this, [param])
          return
        }

        if (viewModel.get('next') === true) {
          this.addLog({
            level: 'INFO',
            content: '手动跳过：' + progressText
          })
          viewModel.set('next', false) // 设置下一步不跳过
          callback.bind(scope)();
          return
        }

        if (viewModel.get('stop') === true) {
          this.addLog({
            level: 'INFO',
            content: '手动结束：' + progressText
          })
          viewModel.set('stop', false)
          this.doZipFile();
          return
        }

        // 进度条更新
        var percent = successCount / count
        progressText = loadCount > 0 ? '重试' + loadCount + '次拉取' : '正在拉取'
        progress.updateProgress(percent, progressText + grid.getTitle() + ' ' + successCount + '/' + count + ' 当前进度：' + (percent * 100).toFixed(2) + '%', true)

        var me = this;
        jQuery.ajax({
          url: fileUrl,
          type: 'GET',
          xhrFields: {
            responseType: 'arraybuffer'
          },
          dataType: 'binary',
          success: function (result) {
            me.zipObj.file((filePath + '/' + fileName), result);
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            me.addLog({
              level: 'ERROR',
              content: fileName + '拉取失败：' + fileUrl + '，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
            })
          },
          complete: function (XMLHttpRequest, textStatus) {
            model.set('fileStatus', textStatus)
            model.set('loadCount', (model.get('loadCount') || 0) + 1)
            model.commit()
            me.loadFile(param) // 直接开始拉取下一个文件
            // var millis = Random(500, 1000) // 随机延迟毫秒，避免请求频率过高
            // Ext.Function.defer(me.loadFile, millis, me, [param])
          }
        })
      },
      doZipFile: function () {
        // 还原GridPanel的图标样式
        var grids = this.lookup('tabpanel').query('gridpanel[iconCls="x-fa fa-spinner fa-pulse fa-spin"]')
        Ext.each(grids, function (g) {
          g.setIconCls(g.initialConfig.iconCls)
        })

        var assessData = [];
        var assessTextGrid = this.lookup('assessText');
        // var title = assessTextGrid.getTitle()
        assessTextGrid.getStore().each(function (r) {
          assessData.push(r.getData())
          // assessData.push({
          //   图片数: r.get('图片数'),
          //   型号: r.get('型号'),
          //   文件命名: r.get('文件命名'),
          //   视频数: r.get('视频数'),
          //   追评内容: r.get('追评内容'),
          //   追评时间: r.get('追评时间'),
          //   首评内容: r.get('首评内容'),
          //   首评时间: r.get('首评时间')
          // })
        })
        var mySheet = XLSX.utils.json_to_sheet(assessData); // 中间对象
        var workBook = {
          SheetNames: ['mySheet'], // 此处数组名称必须要跟mySheet变量名称一直
          Sheets: {
            mySheet
          },
          Props: {}
        };
        // writeFile 方法可直接保存
        var wbout = XLSX.write(workBook, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'binary'
        });
        this.zipObj.file('评价内容.xlsx', wbout, {
          binary: true
        });

        var logFileName = '运行日志';
        var logTxt = ''
        this.lookup('logGrid').getStore().each(function (r) {
          if (r.get('level') == 'ERROR' && logFileName.indexOf('-存在错误-请查阅') == -1) {
            logFileName += '-存在错误-请查阅'
          }
          logTxt += Ext.Date.format(r.get('time'), 'Y-m-d H:i:s') + ' ' + r.get('level') + ' ' + r.get('content') + '\n'
        })
        logFileName += '.txt'
        this.zipObj.file(logFileName, logTxt)

        var progress = this.lookup('progressbar');
        progress.wait({
          interval: 500, // bar will move fast!
          // duration: 50000,
          increment: 15,
          text: '正在打包压缩文件……'
          // scope: this,
          // fn: function () {
          //   p.updateText('Done!');
          // }
        });
        this.getViewModel().set('ziping', true)
        var me = this
        me.zipObj.generateAsync({
          type: 'blob'
          // compression: "DEFLATE",
          // compressionOptions: {
          //   level: 1
          // }
        }).then(function (content) {
          progress.reset()
          progress.updateText('打包压缩文件已完成，正在下载')
          me.zipContent = content;
          me.downloadZip();
          progress.updateText('下载完成，请留意浏览器的文件保存提示')
          me.getViewModel().set('finish', true) // 标记为已完成
        });
      },
      loadAssessCallback: function (index) {
        if (Ext.isEmpty(index)) {
          index = 0
        }
        var array = ['mainImage', 'typeImage', 'detailImage', 'assessImage', 'assessVideo']
        if (index >= array.length) {
          // 处理zip文件
          this.doZipFile()
          return
        }

        var grid = this.lookup(array[index]);
        grid.setIconCls('x-fa fa-spinner fa-pulse fa-spin') // 设置正在加载图标样式
        this.addLog({
          level: 'INFO',
          content: '开始拉取' + grid.getTitle()
        })
        var ignoreSuffix = []
        // 评价忽略视频文件
        if (array[index] == 'assessVideo') {
          ignoreSuffix.push('mp4')
        }
        var startTime = new Date()
        this.loadFile({
          grid: grid,
          scope: this,
          ignoreSuffix: ignoreSuffix,
          callback: function () {
            grid.setIconCls(grid.initialConfig.iconCls) // 还原样式图标
            var endTime = new Date()
            var mi = Ext.Date.diff(startTime, endTime, Ext.Date.MINUTE);
            var s = Ext.Date.diff(startTime, endTime, Ext.Date.SECOND)
            this.addLog({
              level: 'INFO',
              content: '拉取' + grid.getTitle() + '，已完成。用时' + mi + '分' + s + '秒'
            })
            index++
            this.loadAssessCallback(index)
          }
        })
      },
      downloadZip: function () {
        if (!this.zipContent) {
          Ext.toast('文件尚未准备好，请稍后再试。', '脚本提示')
          return
        }
        this.addLog({
          level: 'INFO',
          content: '打包压缩文件已完成，正在下载'
        })
        var fileName = this.TShopSetupObj.itemDO.itemId + ' ' + this.TShopSetupObj.itemDO.title + '.zip'
        saveAs(this.zipContent, fileName);
        this.addLog({
          level: 'INFO',
          content: '下载完成，请留意浏览器的文件保存提示'
        })
      },
      initTShopSetupObj: function () {
        if (!this.TShopSetupObj) {
          var tShopSetuptext = ''
          jQuery('#J_DetailMeta script').each(function () {
            if (this.text.indexOf('TShop.Setup(') != -1) {
              tShopSetuptext = this.text
              return false;
            }
          });

          var match = tShopSetuptext.match(/\{\"valItemInfo\"(.+?)\}\n/gmi)
          if (match) {
            this.TShopSetupObj = JSON.parse(match[0])
            this.setTitle(this.TShopSetupObj.itemDO.itemId + ' ' + this.TShopSetupObj.itemDO.title)
            this.lookup('TShopSetupObj').setValue(JSON.stringify(this.TShopSetupObj, null, 2))
          }
        }
        return this.TShopSetupObj
      },
      loadMm: function (param) {
        (new Image()).src = '//gm.mmstat.com/tmallrate.' + param
      },
      parseAssess: function (obj, currentPage) {
        var me = this
        var assessTextData = []
        var assessImageData = []
        var assessVideoData = []
        var rateDate = ''; // 评价风控要求的字符串
        var gridTitle = this.lookup('assessImage').getTitle();
        obj.rateDetail.rateList.forEach(function (item, itemIndex) {
          rateDate += item.id + '_' + item.rateDate + ';'
          var typeName = item.auctionSku || '默认型号'
          typeName = me.fileNameReplace(typeName) // 因为要把型号作为文件夹名称，需要去特殊字符
          var imageIndex = 0
          var filePath = gridTitle + '/' + typeName
          var assessObj = {
            型号: typeName,
            首评内容: item.rateContent,
            首评时间: item.rateDate,
            追评内容: '',
            追评时间: '',
            文件命名: 'pag' + currentPage + '-inx' + (itemIndex + 1),
            图片数: 0,
            视频数: 0
          }

          var fileName = assessObj.文件命名
          // 存在图片
          if (Ext.isArray(item.pics)) {
            assessObj.图片数 += item.pics.length
            item.pics.forEach(function (imgSrc) {
              assessImageData.push({
                typeName: typeName,
                fileName: fileName + '-pic' + (++imageIndex) + '.' + imgSrc.split('.').pop().toLowerCase(),
                fileUrl: imgSrc,
                filePath: filePath
              })
            })
          }
          // 存在视频
          if (Ext.isArray(item.videoList)) {
            assessObj.视频数 += item.videoList.length
            item.videoList.forEach(function (videoObj) {
              assessVideoData.push({
                typeName: typeName,
                fileName: fileName + '-vio' + (++imageIndex) + '.' + videoObj.cloudVideoUrl.split('.').pop().toLowerCase(),
                fileUrl: videoObj.cloudVideoUrl,
                filePath: filePath
              })
            })
          }

          // 有追评记录
          if (Ext.isObject(item.appendComment)) {
            assessObj.追评内容 = item.appendComment.content
            assessObj.追评时间 = item.appendComment.commentTime
            // 存在图片
            if (Ext.isArray(item.appendComment.content.pics)) {
              assessObj.图片数 += item.appendComment.content.pics
              item.appendComment.content.pics.forEach(function (imgSrc) {
                assessImageData.push({
                  typeName: typeName,
                  fileName: fileName + '-pic' + (++imageIndex) + '-append.' + imgSrc.split('.').pop().toLowerCase(),
                  fileUrl: imgSrc,
                  filePath: filePath
                })
              })
            }
            // 存在视频
            if (Ext.isArray(item.appendComment.content.videoList)) {
              assessObj.视频数 += item.appendComment.content.videoList
              item.appendComment.content.videoList.forEach(function (videoObj) {
                assessVideoData.push({
                  typeName: typeName,
                  fileName: fileName + '-vio' + (++imageIndex) + '-append.' + videoObj.cloudVideoUrl.split('.').pop().toLowerCase(),
                  fileUrl: videoObj.cloudVideoUrl,
                  filePath: filePath
                })
              })
            }
          }
          assessTextData.push(assessObj)
        })
        this.loadMm('1.5.5?rateDate=' + rateDate)
        this.lookup('assessText').getStore().loadData(assessTextData, true)
        this.lookup('assessImage').getStore().loadData(assessImageData, true)
        this.lookup('assessVideo').getStore().loadData(assessVideoData, true)
        return {
          textData: assessTextData,
          imageData: assessImageData,
          videoData: assessVideoData
        }
      },
      loadAssess: function (currentPage, totalPage, callback, scope) {
        totalPage = totalPage || 1
        if (currentPage > totalPage) {
          callback.bind(scope)()
          return;
        }
        var spuId = ''
        if (this.TShopSetupObj) {
          spuId = this.TShopSetupObj.itemDO.spuId
        }

        if (Ext.isEmpty(spuId)) {
          this.addLog({
            level: 'ERROR',
            content: '无法获取到店铺Id，请确认TShopSetupObj对象是否为空'
          })
          callback.bind(scope)()
          return;
        }

        var pageSize = 20;

        var progress = this.lookup('progressbar');
        if (Ext.isEmpty(progress.getText())) {
          progress.updateText('开始拉取评价……')
        }

        var viewModel = this.getViewModel();
        var progressText = progress.getText()
        if (viewModel.get('pause') === true) {
          var pauseInfo = '手动暂停：'
          if (progressText.indexOf(pauseInfo) === -1) {
            progressText = pauseInfo + progressText
            progress.updateText(progressText)
            this.addLog({
              level: 'INFO',
              content: progressText
            })
          }
          Ext.Function.defer(this.loadAssess, 2000, this, [currentPage, totalPage, callback, scope])
          return
        }

        if (viewModel.get('next') === true) {
          this.addLog({
            level: 'INFO',
            content: '手动跳过：' + progressText
          })
          viewModel.set('next', false) // 设置下一步不跳过
          callback.bind(scope)()
          return
        }

        if (viewModel.get('stop') === true) {
          this.addLog({
            level: 'INFO',
            content: '手动结束：' + progressText
          })
          viewModel.set('stop', false)
          this.doZipFile();
          return
        }

        // 加载一次，对应https://g.alicdn.com/mui/detail-review/3.0.14/??listmz.js?t=1_2013072520131122.js:formatted文件第1127行 e.mm("6.2.5");
        this.loadMm('6.2.5')

        // var me = this;
        unsafeWindow.KISSY.io({
          type: 'get',
          url: '//rate.tmall.com/list_detail_rate.htm',
          context: this,
          dataType: 'jsonp',
          crossDomain: true,
          cache: false,
          data: {
            itemId: unsafeWindow.KISSY.Config.itemId || getUrlParam('id'), // 商品ID
            spuId: spuId, // 店铺ID
            sellerId: unsafeWindow.KISSY.Config.sellerId, // 卖家ID
            order: 3, // 排序
            currentPage: currentPage,
            append: 0, // 追评
            content: 1, // 有内容
            needFold: 0,
            groupId: '',
            picture: '',
            posi: '',
            tagId: '',
            itemPropertyId: '',
            itemPropertyIndex: '',
            userPropertyId: '',
            userPropertyIndex: '',
            location: '',
            rateQuery: '',
            // _ksTS: unsafeWindow.KISSY.now() + '_' + unsafeWindow.KISSY.guid(),
            ua: unsafeWindow.getUA.apply(unsafeWindow, [])
          },
          success: function (obj, textStatus, io) { },
          error: function (obj, textStatus, io) {
            debugger
          },
          complete: function (obj, textStatus, io) {
            var me = this
            me.lookup('lastAssess').setValue(JSON.stringify(obj, null, 2))
            if (!Ext.isEmpty(obj.url)) {
              var logMsg = '第' + currentPage + '/' + totalPage + '页触发风控，需要用户操作'
              progress.updateText(logMsg)
              this.addLog({
                level: 'WARN',
                content: logMsg + '：' + JSON.stringify(obj)
              })
              // callback.bind(scope)()
              this.userConfirm = true
              // 先不弹出，先让程序继续下一步
              unsafeWindow.KISSY.use('sd/data_sufei/index,sd/data_sufei/css/taobao.css', function (e, a) {
                new a({
                  data: obj,
                  ioConfig: io.config,
                  dialogConfig: {
                    prefixCls: 'sufei-tb-',
                    headerContent: '\u8bbf\u95ee\u9a8c\u8bc1'
                  },
                  style: 'tmall'
                })

                // 处理滑动校验
                me.checkMm({
                  scope: scope,
                  success: function () {
                    var logObj = {
                      level: 'INFO',
                      content: '第' + currentPage + '/' + totalPage + '页风控校验成功，开始继续拉取评价'
                    }
                    Ext.toast(logObj.content, '脚本提示')
                    this.addLog(logObj)
                    me.loadAssess(currentPage, totalPage, callback, scope)
                  },
                  close: function () {
                    var logObj = {
                      level: 'ERROR',
                      content: '第' + currentPage + '/' + totalPage + '页风控校验失败，直接进入下一步'
                    }
                    Ext.toast(logObj.content, '脚本提示')
                    this.addLog(logObj)
                    callback.bind(scope)()
                  }
                })
              });

              return
            }

            this.userConfirm = false
            // 如果当前的评价数量小于的分页数，则证明数据已经被拉完。直接进入下一步操作
            if (obj.rateDetail && obj.rateDetail.rateList && obj.rateDetail.rateList.length == 0) {
              this.addLog({
                level: 'WARN',
                content: '第' + currentPage + '/' + totalPage + '页的评价数据为0条，评价拉取完成，进入下一步'
              })
              callback.bind(scope)()
              return
            }

            var totalCount = obj.rateDetail.rateCount.total // 总条数， picNum 图片总数、 used 追评数
            totalPage = parseInt((totalCount + pageSize - 1) / pageSize);
            var parseObj = this.parseAssess(obj, currentPage)

            var configObj = this.lookup('configFrom').getForm().getFieldValues()
            var minSecond = 5;
            var maxSecond = 20
            if (Ext.isArray(configObj.assessLoadInterval)) {
              minSecond = Ext.Array.min(configObj.assessLoadInterval)
              maxSecond = Ext.Array.max(configObj.assessLoadInterval)
            }

            var waitSecond = Random(minSecond, maxSecond) // 随机延迟秒，避免请求频率过高
            // 进度条更新
            var percent = currentPage / totalPage
            var content = '第' + currentPage + '/' + totalPage + '页评价拉取完成，评价：' + parseObj.textData.length + '条，图片：' +
              parseObj.imageData.length + '张，视频：' +
              parseObj.videoData.length + '个，当前进度' +
              (percent * 100).toFixed(2) + '% 休息' + waitSecond + '秒再拉取下一页'
            progress.updateProgress(percent, content, true);
            this.addLog({
              level: 'INFO',
              content: content
            })
            currentPage++
            var task = {
              run: function () {
                waitSecond--
                if (waitSecond <= 0 || viewModel.get('pause') || viewModel.get('next') || viewModel.get('stop')) {
                  Ext.TaskManager.stop(task, true)
                  me.loadAssess(currentPage, totalPage, callback, scope)
                  return
                }
                var text = progress.getText()
                text = text.replace(/休息(\d*)秒/, '休息' + waitSecond + '秒')
                progress.updateText(text)
              },
              interval: 1000
            }
            Ext.TaskManager.start(task);
          }
        })
      },
      addLog: function (log) {
        log.time = new Date()
        var grid = this.lookup('logGrid');
        grid.getStore().add(log)
        grid.getView().refreshView() // 刷新视图，避免日志的rownumber显示不正确。一直都是1
      },
      items: {
        xtype: 'tabpanel',
        reference: 'tabpanel',
        border: true,
        defaults: {
          scrollable: true,
          border: true,
          viewConfig: {
            loadMask: true,
            stripeRows: true, // 在表格中显示斑马线
            enableTextSelection: true
          }
        },
        items: [{
          xtype: 'gridpanel',
          title: '评价内容',
          reference: 'assessText',
          iconCls: 'x-fa fa-comments',
          store: {
            data: []
          },
          columns: [{
            xtype: 'rownumberer',
            width: 50
          }, {
            text: '型号',
            dataIndex: '型号',
            width: 200
          }, {
            text: '首评内容',
            width: 700,
            dataIndex: '首评内容',
            listeners: {
              dblclick: function (view, row) {
                var focused = view.getLastFocused()
                if (!Ext.isObject(focused)) {
                  return
                }
                var r = focused.record
                Ext.MessageBox.show({
                  title: '查看首评',
                  message: '【' + r.get('型号') + '】',
                  multiline: true,
                  modal: false,
                  width: 800,
                  defaultTextHeight: 150,
                  value: r.get('首评内容'),
                  buttons: Ext.Msg.OK
                }).focus(false, true)
              }
            }
            // renderer: function (value, metaData, record, rowIndex, colIndex) { // 因为存在滚动条的事件，会导致tip显示错位
            //   if (Ext.isEmpty(value)) {
            //     return value
            //   }
            //   // 处理提示内容中的特殊符号
            //   metaData.tdAttr = ' data-qtitle="首评" data-hide="false" data-qwidth="800" data-qtip="' + Ext.String.htmlEncode(value) + '"'
            //   return value
            // }
          }, {
            text: '首评时间',
            dataIndex: '首评时间',
            width: 125
          }, {
            text: '追评内容',
            width: 300,
            dataIndex: '追评内容',
            listeners: {
              dblclick: function (view, row) {
                var focused = view.getLastFocused()
                if (!Ext.isObject(focused)) {
                  return
                }
                var r = focused.record
                Ext.MessageBox.show({
                  title: '查看追评',
                  message: '【' + r.get('型号') + '】',
                  multiline: true,
                  modal: false,
                  width: 800,
                  defaultTextHeight: 150,
                  value: r.get('追评内容'),
                  buttons: Ext.Msg.OK
                }).focus(false, true)
              }
            }
            // renderer: function (value, metaData, record, rowIndex, colIndex) { // 因为存在滚动条的事件，会导致tip显示错位
            //   if (Ext.isEmpty(value)) {
            //     return value
            //   }
            //   // 处理提示内容中的特殊符号
            //   metaData.tdAttr = ' data-qtitle="追评" data-hide="false" data-qwidth="800" data-qtip="' + Ext.String.htmlEncode(value) + '"'
            //   return value
            // }
          }, {
            text: '追评时间',
            dataIndex: '追评时间',
            width: 125
          }, {
            text: '文件命名',
            dataIndex: '文件命名',
            width: 80
          }, {
            text: '图片数',
            dataIndex: '图片数',
            width: 60
          }, {
            text: '视频数',
            dataIndex: '视频数',
            width: 60
          }]
        }, {
          xtype: 'gridpanel',
          reference: 'mainImage',
          title: '商品主图',
          iconCls: 'x-fa fa-picture-o',
          store: {
            data: []
          },
          columns: [{
            xtype: 'rownumberer'
          }, {
            text: '文件名称',
            dataIndex: 'fileName',
            width: 200
          }, {
            text: '文件地址',
            flex: 1,
            dataIndex: 'fileUrl',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
              return '<a target="_blank" href="' + value + '">' + value + '</a>'
            }
          }, {
            text: '文件状态',
            dataIndex: 'fileStatus'
          }]
        }, {
          xtype: 'gridpanel',
          reference: 'typeImage',
          title: '分类图片',
          iconCls: 'x-fa fa-picture-o',
          store: {
            data: []
          },
          columns: [{
            xtype: 'rownumberer'
          }, {
            text: '文件名称',
            dataIndex: 'fileName',
            width: 200
          }, {
            text: '文件地址',
            flex: 1,
            dataIndex: 'fileUrl',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
              if (Ext.isEmpty(value)) {
                return value
              }
              return '<a target="_blank" href="' + value + '">' + value + '</a>'
            }
          }, {
            text: '文件状态',
            dataIndex: 'fileStatus'
          }]
        }, {
          xtype: 'gridpanel',
          reference: 'detailImage',
          title: '商品详图',
          iconCls: 'x-fa fa-picture-o',
          store: {
            data: []
          },
          columns: [{
            xtype: 'rownumberer'
          }, {
            text: '文件名称',
            dataIndex: 'fileName',
            width: 200
          }, {
            text: '文件地址',
            flex: 1,
            dataIndex: 'fileUrl',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
              return '<a target="_blank" href="' + value + '">' + value + '</a>'
            }
          }, {
            text: '文件状态',
            dataIndex: 'fileStatus'
          }]
        }, {
          xtype: 'gridpanel',
          title: '评价图片',
          reference: 'assessImage',
          iconCls: 'x-fa fa-picture-o',
          store: {
            data: []
          },
          columns: [{
            xtype: 'rownumberer',
            width: 50
          }, {
            text: '型号',
            dataIndex: 'typeName',
            width: 200
          }, {
            text: '文件名称',
            dataIndex: 'fileName',
            width: 150
          }, {
            text: '文件地址',
            flex: 1,
            dataIndex: 'fileUrl',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
              return '<a target="_blank" href="' + value + '">' + value + '</a>'
            }
          }, {
            text: '文件状态',
            dataIndex: 'fileStatus'
          }]
        }, {
          xtype: 'gridpanel',
          title: '评价视频',
          reference: 'assessVideo',
          iconCls: 'x-fa fa-video-camera',
          store: {
            data: []
          },
          columns: [{
            xtype: 'rownumberer',
            width: 50
          }, {
            text: '型号',
            dataIndex: 'typeName',
            width: 200
          }, {
            text: '文件名称',
            dataIndex: 'fileName',
            width: 150
          }, {
            text: '文件地址',
            flex: 1,
            dataIndex: 'fileUrl',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
              return '<a target="_blank" href="' + value + '">' + value + '</a>'
            }
          }, {
            text: '文件状态',
            dataIndex: 'fileStatus'
          }]
        }, {
          xtype: 'gridpanel',
          title: '脚本日志',
          reference: 'logGrid',
          iconCls: 'x-fa fa-list',
          store: {
            sorters: [{
              property: 'time',
              direction: 'DESC'
            }],
            data: []
          },
          columns: [{
            xtype: 'rownumberer'
          }, {
            text: '时间',
            dataIndex: 'time',
            widht: 80,
            xtype: 'datecolumn',
            format: 'H:i:s'
          }, {
            text: '等级',
            dataIndex: 'level',
            widht: 80
          }, {
            text: '内容',
            flex: 1,
            dataIndex: 'content'
          }]
        }, {
          xtype: 'panel',
          title: '店铺设置对象',
          layout: 'fit',
          iconCls: 'x-fa fa-shopping-cart',
          items: [{
            xtype: 'textareafield',
            reference: 'TShopSetupObj',
            flex: 1,
            readOnly: true
          }]
        }, {
          xtype: 'panel',
          title: '最后评价对象',
          layout: 'fit',
          iconCls: 'x-fa fa-comments-o',
          items: [{
            xtype: 'textareafield',
            reference: 'lastAssess',
            flex: 1,
            readOnly: true
          }]
        }, {
          xtype: 'form',
          title: '脚本设置',
          iconCls: 'x-fa fa-sliders',
          frame: true,
          reference: 'configFrom',
          bodyPadding: 10,
          defaults: {
            anchor: '100%',
            labelWidth: 120
          },
          items: [{
            xtype: 'multislider',
            fieldLabel: '评价拉取间隔',
            name: 'assessLoadInterval',
            values: [5, 20],
            increment: 1,
            minValue: 1,
            maxValue: 30,
            constrainThumbs: true
          }]
        }]
      }
    }).show();
  }

  function getUrlParam (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  function Random (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }
})();
