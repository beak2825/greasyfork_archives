// ==UserScript==
// @name         AutoArs
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       jeff polar
// @match        http://ars.sng.local/arsphp/*
// @match        http://jb.oa.com/dist/test
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36013/AutoArs.user.js
// @updateURL https://update.greasyfork.org/scripts/36013/AutoArs.meta.js
// ==/UserScript==

/**
 * ars自动发布脚本
 * 帮助自动化从测试环境=>预发布环境=>正式环境，不需要人工参与
 */
jQuery(function() {
    // 只在ars下面生效
    if (window.location.href.indexOf('ars.sng.local') === -1) return
    jQuery.noConflict()

    const ARS_PUBLISH_PATH = 'http://ars.sng.local/arsphp/index.php/release'
    const STATUS = {
        test: 3,
        pre: 4,
        idc: 5,
        close: 6
    }

    var STATUS_MAP = {
        3: 'test',
        4: 'pre',
        5: 'idc',
        6: 'close'
    }

    var ENV_ID = 3
    // 模块ID，在页面上是隐藏input
    var moduleId = +$id('hdModuleId').value
    // 产品ID，在页面上是隐藏input
    var productId = +$id('hdProductId').value
    // 当前处理人                            // todo:提单人和当前处理人有什么区别？
    var operator = $id('ds1_curruser').innerText.trim()
    // 当前状态
    var status = g_currentstatus_id
    // 提单人
    var builder = window.builder
    // 发布来源 0：编译机 1：svn
    var codeOrigin = window.codeOrigin//|| jQuery('#codeOrigin').val()
    // 请求类型 0-文件发布测试请求 1-文件发布请求
    var requestType = window.requestType//|| jQuery('#requestType').val()
    // 关注列表
    // 关注列表有两种不同的id，需要兼容一下................
    var $ccs = $id('ccs_TextBox') || $id('ccs_TextBoxValue')
    var ccs = $ccs.value.trim().replace(/\(.*?\)/g, "")
    // 文件列表，后续会异步拉取
    var fileList = []

    var isAutoArs = getQuery('autoArs')
    var publishStage = getQuery('publishStage')
    var orderId = getQuery('tag')

    var isArs = location.href.indexOf(ARS_PUBLISH_PATH) === 0 && orderId
    var isAutoArsTest = isArs && isAutoArs && publishStage === 'test'
    var isAutoArsPre = isArs && isAutoArs && publishStage === 'pre'
    var isAutoArsProduction = isArs && isAutoArs && publishStage === 'idc'
    // isAutoArsProduction = true

    var $MessageInfo = jQuery('#MessageInfo')

    function getQuery(key) {
        var m = window.location.search.match(new RegExp('(\\?|&)'+ key + '=([^&]*)(#|&|$)'));
        return !m ? "":decodeURIComponent(m[2]);
    }

    function $id (id) {
        return document.getElementById(id)
    }

    // 文件对比
    function fileCheck(options, callback) {
        $MessageInfo.addClass('MessageInfoStyle_Doing alert alert-info').text('正在检查是否有其它发布单中包含相同文件...')

        jQuery.ajax('arsphp/index.php/release/filecheck',{
            dataType: 'json',
            type: 'POST',
            data: options
        }).done(function(res) {
            // 0.6版本以后，这个接口改为了返回json数据
            var ret = res.result
            if ( ret === 'true' ) {
                callback()
            } else if (ret === 'false') {
                var url = res.url

                $MessageInfo.removeClass('MessageInfoStyle_Doing').text('文件冲突，自动发布终止')

                if (window.confirm('本次发布与其他发布存在冲突' + url)) {
                    window.open(url)
                } else {
                    console.log(url)
                }
            } else {
                alert('文件对比错误')
            }
        })
    }

    /**
     * 根据输入判断当前发布状态
     * @param res
     * @return 1 发布中 2 已发布 3 发布失败
     */
    function getReleaseStatus(res) {
        var Rows = res.Rows

        if (Rows.length) {
            // 如果存在不是发布中也不是已发布，则发布失败
            for (var i = 0; i < Rows.length; i++) {
                if (Rows[i].Status !== 2 && Rows[i].Status !== 1) {
                    return 3
                }
            }

            // 如果存在发布中，则为发布中
            for (var i = 0; i< Rows.length; i++) {
                if (Rows[i].Status === 1) {
                    return 1
                }
            }

            // 否则为已发布
            return 2
        } else {
            // 没有发布信息，发布中
            return 1
        }
    }

    /**
     * 获取部署状态
     * @param param.taskid
     * @param param.isbatrelease
     * @param callback
     */
    function getReleaseLog(param, callback) {
        jQuery.ajax('arsphp/index.php/release/getReleaseLog', {
            dataType: 'json',
            type: 'GET',
            data: {
                // model: 'getReleaseLog',
                taskid: param.taskid,
                isbatrelease: param.isbatrelease
            }
        }).done(function(res) {
            if (getReleaseStatus(res) === 1) {
                setTimeout(function() {
                    getReleaseLog(param, callback)
                }, 3000)
            }

            if (getReleaseStatus(res) === 2) {
                callback()
            }

            if (getReleaseStatus(res) === 3) {
                var logUrl = 'http://ars.sng.local/Rel_ShowLogs.htm?orderid='+ orderId +'&taskid=' + param.taskid
                if (window.confirm('发布失败，查看log' + logUrl)) {
                    window.open(logUrl)
                } else {
                    console.log(logUrl)
                }
            }
        })
    }

    // 测试环境部署
    function testRelease(callback, failCallback) {
        var params = {
            sessionid: new Date().getTime(),
            // 订单ID
            orderid: orderId,
            // 产品id
            product_id: productId,
            // 模块id
            module_id: moduleId,
            // 添加上一步处理人
            lastOperator: $id('ds1_lastuser').innerText,
            // 发布来源，ars源码中定义了
            codeOrigin: codeOrigin,
            builder: builder,
            requestType: requestType,
            // 添加当前状态
            // currstatus: $id('ds1_currstep').innerText,
            ccs: ccs,
            // 是否需要显示cgi覆盖率的选择项（c++才会需要）
            isCgiCov: 0,
            // 部署原因（多次部署才会需要）
            reason: '',
            // 用户填写的基线修订号（c++才需要）
            compRevision: 0,
            // 回滚类型
            rollbacktype: 0,
            // 部署类型，是否全部文件 0-全量,1-部分
            releasetype: 0,
            // 是否灰度发布（选择部分ip）
            istestrelease: 0,
            // 是否关闭文件对比操作
            fileDiffSwitch: 0
        }

        jQuery.ajax('arsphp/index.php/release/testRelease', {
            dataType: 'xml',
            type: 'GET',
            data: params
        }).done(function(resXML) {
            var results = jQuery(resXML).find('results')
            var taskid = results.find('taskid').eq(0).text()
            var isbatrelease = results.find('isbatrelease').eq(0).text()
            var result = results.find('result').eq(0).text()
            var notes = results.find('notes').text()

            if (result === 'true') {
                callback({
                    taskid: taskid,
                    isbatrelease: isbatrelease
                })
            } else {
                if (window.confirm('测试发布失败: ' + notes)) {
                    // 某些错误（例如状态转换出错，不返回taskid）
                    if (taskid) {
                        window.open('http://ars.sng.local/Rel_ShowLogs.htm?type=1&taskid=' + taskid + '&orderid=' + orderId)
                    }
                }
            }
        })
    }

    /**
     * 更改订单状态
     * @param currentstatus 当前状态 3：测试 4：预发 5：正式
     * @param nextstatus
     * @param callback
     */
    function changeOrderStatus(currentstatus, nextstatus, callback) {
        // var $operator = $id('ds1_curruser')
        // var $nextoperator = $id('nextOperator_TextBoxValue') || $operator
        var params = {
            // 订单ID
            orderid: orderId,
            // 测试通过
            ispass: 1,
            // 当前状态
            currentstatus: currentstatus,
            // 当前处理人
            operator: operator,
            // 下一步处理人
            nextoperator: operator,
            // 下一个状态
            nextstatus: nextstatus
        }

        jQuery.ajax('arsphp/index.php/release/changeOrderStatus', {
            dataType: 'xml',
            type: 'GET',
            data: params
        }).done(function(resXml) {
            var ret = jQuery(resXml).find('results>result').eq(0).text()
            // todo,这里有cdata？
            if ( ret === 'true' ) {
                // 发送rtx消息
                jQuery.ajax('arsphp/index.php/release/changeOrderStatus', {
                    dataType: 'xml',
                    type: 'GET',
                    data: {
                        operator: operator,
                        orderId: orderId,
                        buildperson: operator,
                        sendtype: 'rtx',
                        defaulturl: 'Default.htm',
                        acttype: STATUS_MAP[currentstatus],
                        actresult: 'succ'
                    }
                })
                callback()
            } else {
                alert('提交下一流程失败 - '+ jQuery(resXml).find('results>notes').eq(0).text())
                //location.reload()
            }
        })
    }

    /**
     * @desc 根据fileFilter来提取文件列表
     * @param files
     * @param fileFilter
     * @returns {string}
     */
    function extractFiles(files, fileFilter) {
        var extracted = []
        files.forEach(function (file, index) {
            if (!fileFilter) {
                extracted.push(file.id)
            }

            if (fileFilter === 'html' && file.name.match(/\.html$/)) {
                extracted.push(file.id)
            }

            if (fileFilter === '!html' && !file.name.match(/\.html$/)) {
                extracted.push(file.id)
            }
        })

        return extracted.join(',')
    }

    /**
     * @desc 如果没加载过，只能callback返回数据，如果已经加载过，则可以同步也可以异步返回数据
     * @param fileFilter html !html
     * @param callback
     */
    function getFileListRemote(fileFilter, callback) {
        if (fileList && fileList.length) {
            callback && callback(extractFiles(fileList, fileFilter))
            return extractFiles(fileList, fileFilter)
        } else {
            jQuery.ajax('arsphp/index.php/release/getReleaseFilelist', {
                dataType: 'json',
                type: 'get',
                data: {
                    orderid: orderId,
                    PageSize: 10000000,
                    PageNo: 0,
                    statusid: status,
                    codeOrigin: codeOrigin,
                    requestType: requestType
                }
            }).done(function (res) {
                var files = res.file

                // 挂载全局
                fileList = files

                callback && callback(extractFiles(fileList, fileFilter))
            }).always(function(res) {debugger})
        }
    }

    // 预发布环境部署
    function preRelease(callback) {
        var params = {
            sessionid: 0,
            // 订单ID
            orderid: orderId,
            // 发布文件列表
            fileslist: getFileListRemote(),
            // 产品id
            product_id: productId,
            // 模块id
            module_id: moduleId,
            // 添加上一步处理人
            lastoperator: $id('ds1_lastuser').innerText,
            codeOrigin: codeOrigin,
            requestType: requestType,
            // 部署类型 3-免测，自动化流程只能在免测情况可用
            testType: 3,
            ccs: ccs,
            // 部署原因
            reason: '',
            builder: builder,
            // 部署类型，是否全部文件 0-全量,1-部分
            releasetype: 0,
            // 是否灰度发布（选择部分ip）
            istestrelease: 0,
        }

        jQuery.ajax('arsphp/index.php/release/preRelease', {
            dataType: 'xml',
            type: 'GET',
            data: params
        }).done(function(resXml) {
            var results = jQuery(resXml).find('results')
            var taskid = results.find('taskid').eq(0).text()
            var isbatrelease = results.find('isbatrelease').eq(0).text()
            var result = results.find('result').eq(0).text()
            var notes = results.find('notes').text()

            if (result === 'true') {
                callback({
                    taskid: taskid,
                    isbatrelease: isbatrelease
                })
            } else {
                alert('预发布环境部署失败: ' + notes)
            }
        })
    }

    // 文件映射关系检查
    function fileAndMapCheck(fileFilter, callback) {
        $MessageInfo.addClass('MessageInfoStyle_Doing alert alert-info').text('正在检查是否有其它发布单中包含相同文件...')

        var fileList = getFileListRemote(fileFilter)
        // 如果没有命中文件，则直接返回
        if (!fileList) {
            return callback()
        }
        var params = {
            // 单号
            orderid: orderId,
            rollbacktype: 1,
            versionType: $id("ds2_versionType").innerText,      // 免测、文件
            contentType: '',
            currentPerson: operator,
            fileslist: fileList,
            releasetype: 0,                         // 0为全部  1 为部分
            serverslist: ''                         // ?
        }

        jQuery.ajax('arsphp/index.php/release/fileAndMapcheck', {
            dataType: 'json',
            type: 'POST',
            data: params
        }).done(function(res) {
            if ( res[1] && res[1].result === 'true' ) {
                callback()
            } else {
                $MessageInfo.removeClass('MessageInfoStyle_Doing').text('发布失败，自动发布终止')
                var conflictUrl = res[1].tasks.current_dest_crash[0].taskUrl
                if (window.confirm('autoArs终止，与发布单发生冲突：' + conflictUrl)) {
                    window.open(conflictUrl)
                }
            }
        })
    }

    // 全量外发
    function idcRelease(fileFilter, callback) {
        var params = {
            sessionid: new Date().getTime(),
            orderid: orderId,
            fileslist: getFileListRemote(fileFilter),
            product_id: productId,
            module_id: moduleId,
            // 添加上一步处理人
            lastoperator: $id('ds1_lastuser').innerText,
            builder: operator,
            // 部署原因
            reason: '',
            // 部署类型，是否全部文件 0-全量,1-部分
            releasetype: 1,
            // 是否灰度发布（选择部分ip）
            istestrelease: 0,

            isdeletefiles: $id("isdeletefiles").checked ? 'yes' : 'no',
            // 是否定时发布
            // isschedule: 'no',
            // 定时
            schtime: '',
            // 失败重发
            retrytimes: 0,
            // 成功提示
            successmess: 'mail',
            // 失败提示
            failsmess: 'both',
            // 开启成功提醒功能必须设定对应的提醒的目标人员
            successuser: '',
            // 开启成功提醒功能必须设定对应的提醒的目标人员
            failsuser: '',
            // 类型 1-发布 2-回滚
            rollbacktype: 1,
            // 灰度发布需要选择目标IP，全量不需要
            serverslist: ''
        }

        jQuery.ajax('arsphp/index.php/release/idcRelease', {
            dataType: 'xml',
            type: 'POST',
            data: params
        }).done(function(resXml) {
            var results = jQuery(resXml).find('results')
            var taskid = results.find('taskid').eq(0).text()
            var isbatrelease = results.find('isbatrelease').eq(0).text()
            var result = results.find('result').eq(0).text()
            var notes = results.find('notes').eq(0).text()

            if (result === 'true') {
                callback({
                    taskid: taskid,
                    isbatrelease: isbatrelease
                })
            } else {
                window.confirm(notes)
            }
        })
    }

    // ars 测试环境发布
    function doAutoArsTest() {
        fileCheck({
            orderid: orderId,
            product_id: productId,
            envid: ENV_ID,
            // 部署类型，是否全部文件 0-全量,1-部分
            releasetype: 0,
            // 是否灰度发布（选择部分ip）
            istestrelease: 0,
            status: STATUS.test,
            //fileslist: ''
        }, function() {
            $MessageInfo.text('正在将发布相关设置信息发往服务器...')
            // 测试环境部署
            testRelease(function(data) {
                // 部署进度
                getReleaseLog({
                    taskid: data.taskid,
                    isbatrelease: data.isbatrelease
                }, function() {
                    $MessageInfo.text('测试环境部署成功, 正在将测试单提交到预发布...')

                    // 需要等一会儿，等生效再进行下一步
                    setTimeout(function () {
                        changeOrderStatus(STATUS.test, STATUS.pre, function(X) {
                            location.href = ARS_PUBLISH_PATH + '?tag=' + orderId + '&autoArs=' + 1 + '&publishStage=pre'
                        })
                    }, 3000)
                })
            })
        })
    }

    // ars 预发环境发布
    function doAutoArsPre() {
        getFileListRemote(null, function () {
            fileCheck({
                orderid: orderId,
                // 部署类型，是否全部文件 0-全量,1-部分
                releasetype: 0,
                // 是否灰度发布（选择部分ip）
                istestrelease: 0,
                status: STATUS.pre,
            }, function() {
                $MessageInfo.text('正在将发布相关设置信息发往服务器...')
                preRelease(function(data) {
                    // 部署进度
                    getReleaseLog({
                        taskid: data.taskid,
                        isbatrelease: data.isbatrelease
                    }, function() {
                        $MessageInfo.text('预发布环境部署成功，正在提交到发布。')

                        // 需要等一会儿，等生效再进行下一步
                        setTimeout(function () {
                            changeOrderStatus(STATUS.pre, STATUS.idc,function() {
                                location.href = ARS_PUBLISH_PATH + '?tag=' + orderId + '&autoArs=' + 1 + '&publishStage=idc'
                            })
                        }, 3000)
                    })
                })
            })
        })
    }

    // ars 正式发布
    function doAutoArsIdc(fileFilter, callback) {
        // 先加载要发布的文件
        getFileListRemote(fileFilter, function (files) {
            if (!files) {
                if (window.confirm('当前发布列表没有' + fileFilter + '文件，是否继续发布')) {
                    callback && callback()
                }
            } else {
                fileAndMapCheck(fileFilter, function() {
                    $MessageInfo.text('正在将发布相关设置信息发往服务器...')
                    idcRelease(fileFilter, function(data) {
                        // 外发进度
                        getReleaseLog({
                            taskid: data.taskid,
                            isbatrelease: data.isbatrelease
                        }, function() {
                            callback && callback()
                        })
                    })
                })
            }
        })
    }

    function init() {
        // 在ars环境，加上手动操作按钮
        if (isArs) {
            var confirmTpl = '<button style="position:absolute; top: 0; left: 50%;font-size: 25px;z-index: 100000;border-radius: 10px;border: 1px solid white;color: #fff;background: lightgreen">点击使用Ars自动发布！</button>'
            var $confirm = jQuery(confirmTpl)

            $confirm.appendTo(document.body)
            $confirm.on('click', function(){
                doAutoArsTest()
            })
        }

        // autoArs 测试环境
        if (isAutoArsTest) {
            doAutoArsTest()
        }

        // 预发布环境部署
        if (isAutoArsPre) {
            doAutoArsPre()
        }
        // 全量发布
        if (isAutoArsProduction) {
            jQuery("#backuprelease").attr('disabled', 'disabled').val('发布中...')
            jQuery("#rollbackbtn").removeAttr('disabled')

            doAutoArsIdc('!html', function() {
                // 需要等js文件部署成功再部署html，时间不定，暂定20s可以通过请求某个文件，看能否加载成功来确定是否发成功
                setTimeout(function () {
                    doAutoArsIdc('html', function() {
                        $MessageInfo.removeClass('MessageInfoStyle_Doing alert alert-info').text('')

                        if (window.confirm("发布已成功，是否关单？")) {
                            changeOrderStatus(STATUS.idc, STATUS.close, function() {
                                location.href = 'http://ars.sng.local/'
                            })
                        } else {
                            location.href = 'http://ars.sng.local/arsphp/index.php/release?tag=' + orderId
                        }
                    })
                }, 30 * 1000)
            })
        }
    }

    init()
})

/**
 * jb2ars自动发布脚本
 * 帮助自动从jb发布到ars，不需要人工参与。
 * 需要先选中要发布的单号，再点自动发布
 */
jQuery(function () {
    // 只在jb.oa.com下生效
    if (window.location.href.indexOf('jb.oa.com') === -1) return

    var $autoPublishArs = $('<button id="autoPublishArs" style="position:absolute; top: 2px; left: 60%;font-size: 20px;z-index: 100000;border-radius: 10px;border: 1px solid white;color: #fff;background: lightgreen;cursor:pointer;"">publishJb2Ars</button>')
    $autoPublishArs.appendTo(document.body)

    $autoPublishArs.on('click', function() {
        $('#btnPro')[0].click()
        setTimeout(function(){
            $('.x-btn-default-small-noicon:contains("预编译")').click()

            var $compilingTip = $('.x-window-blue-window-closable.x-window-active')

            // 持续检查是否编译完成
            var compilationDetectionKey = setInterval(function() {
                if (!$compilingTip.hasClass('x-window-active')) {
                    clearInterval(compilationDetectionKey)

                    var jbId = $('#textfield-1048-inputEl').val()
                    var svn = $('#textfield-1049-inputEl').val()

                    $.ajax('//jb.oa.com/dist/test/ars', {
                        type: 'post',
                        data: {
                            id: jbId,
                            svn: svn
                        },
                        dataType: 'json'
                    }).done(function(res) {
                        if (res.code) {
                            alert(JSON.stringify(res.msg))
                        }
                        var msgs = res.msg

                        msgs.forEach(function(innerRes) {
                            var innerResMsg = JSON.parse(innerRes.msg)
                            if (innerRes.code !== 0) {
                                alert(JSON.stringify(innerResMsg))
                            }
                        })

                        var releaseTags = msgs.filter(function (item) {
                            return item.code === 0
                        }).map(function (item) {
                            var msg = JSON.parse(item.msg)
                            return msg.releasetag
                        })
                        if (releaseTags.length === 1) {
                            window.open('http://ars.sng.local/arsphp/index.php/release?tag=' + releaseTags[0] + '&autoArs=1&publishStage=test', 'alloy_auto_ars')
                        } else if (releaseTags.length > 1) {
                            var msg = releaseTags.reduce(function (preventValue, item) {
                                return preventValue + '<br><a href="http://ars.sng.local/arsphp/index.php/release?tag=' + item + '" target="_blank">' + item + '</a>'
                            }, '生成了多个ars单')
                            alert(msg)
                        }
                    })
                }
            }, 1000)
        })
    })
})