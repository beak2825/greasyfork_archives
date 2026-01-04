// ==UserScript==
// @name         蒙天致远OA辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  辅助脚本
// @author       empyrealtear
// @match        *://oa.mengtiandairy.com:7070/seeyon/main.do*
// @match        *://oa.mengtiandairy.com:7070/seeyon/collaboration/collaboration.do*
// @match        *://oa.mengtiandairy.com:7070/seeyon/common/cap4/template/display/pc/form/dist/index.html*
// @match        *://oa.mengtiandairy.com:7070/seeyon/common/print/captPrintForm.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mengtiandairy.com
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/nanobar/0.4.2/nanobar.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/475241/%E8%92%99%E5%A4%A9%E8%87%B4%E8%BF%9COA%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/475241/%E8%92%99%E5%A4%A9%E8%87%B4%E8%BF%9COA%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict'
    const utils = {
        getValue: (key) => GM_getValue(key),
        setValue: (key, val) => GM_setValue(key, val),
        loadScript: (url, callback) => {
            var script = document.createElement("script")
            script.type = "text/javascript"
            if (typeof (callback) != "undefined")
                if (script.readyState)
                    script.onreadystatechange = () => {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null
                            callback()
                        }
                    }
                else
                    script.onload = () => callback()
            script.src = url
            document.body.appendChild(script)
        },
        fetchBlob: async (fetchUrl, method = "POST", body = null, header = null) => {
            const response = await window.fetch(fetchUrl, {
                method,
                body: body ? JSON.stringify(body) : null,
                headers: header ? header : {},
            })
            const blob = await response.blob()
            return blob
        },
        downloadFile: (blob, fileName) => {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = window.URL.createObjectURL(blob)
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        },
        generateZip: async (files, name = null) => {
            const zip = new JSZip()
            files.forEach((item) => zip.file(item.name, item.blob, { binary: true }))
            const content = await zip.generateAsync({ type: "blob" })
            const currentDate = new Date().getTime()
            const fileName = name ? name : `zipped-${currentDate}.zip`
            return utils.downloadFile(content, fileName)
        },
        asyncPool: async (arr, delegate, start = (v) => v, end = (v) => v, poolLimit = 5) => {
            const ret = []
            const executing = new Set()
            let arr_res = new Array(arr.length)
            let completeCount = 0

            var nanobar = new Nanobar({ id: 'nanobar', target: document.body })
            jQuery("#nanobar").css('background', '#BEE7E9')
            jQuery("#nanobar .bar").css('background', '#F4606C')

            arr = start(arr)
            for (let [index, item] of arr.entries()) {
                const p = Promise.resolve().then(async () => {
                    try {
                        var res = await delegate(item, arr)
                        arr_res[index] = res
                    } catch (err) {
                        console.warn(err)
                        arr_res[index] = err
                    }
                    return
                }).finally(() => {
                    nanobar.go((++completeCount) / arr.length * 100)
                })
                ret.push(p)
                executing.add(p)
                const clean = () => executing.delete(p)
                p.then(clean).catch(clean)
                if (executing.size >= poolLimit) {
                    await Promise.race(executing)
                }
            }
            return Promise.all(ret).then(() => {
                jQuery("#nanobar").remove()
                console.log(arr_res)
                console.log(completeCount)
                return end(arr_res)
            })
        }
    }
    //unsafeWindow.fetchBlob = utils.fetchBlob
    //unsafeWindow.downloadFile = utils.downloadFile
    const options = {
        menus: {
            tabSwitch: {
                toStr: (x) => '关联模式：' + (x ? '新页签' : '新窗口（原模式）'),
                register: () => {
                    let isNewTab = utils.getValue('isNewTab')
                    options.menus.tabSwitch[!isNewTab ? '_newTab' : '_newWindow'] = GM_registerMenuCommand(options.menus.tabSwitch.toStr(isNewTab), () => {
                        utils.setValue('isNewTab', !isNewTab)
                        options.menus.tabSwitch.register()
                    })
                    GM_unregisterMenuCommand(options.menus.tabSwitch[isNewTab ? '_newTab' : '_newWindow'])
                },
                _newTab: null,
                _newWindow: null
            },
            removeEmptyRowsSwitch: {
                toStr: (x) => '打印模式：' + (x ? '移除空行' : '保留空行（原模式）'),
                register: () => {
                    let isRemoveEmptyRow = utils.getValue('isRemoveEmptyRow')
                    options.menus.removeEmptyRowsSwitch[!isRemoveEmptyRow ? '_new' : '_old'] = GM_registerMenuCommand(options.menus.removeEmptyRowsSwitch.toStr(isRemoveEmptyRow), () => {
                        utils.setValue('isRemoveEmptyRow', !isRemoveEmptyRow)
                        options.menus.removeEmptyRowsSwitch.register()
                    })
                    GM_unregisterMenuCommand(options.menus.removeEmptyRowsSwitch[isRemoveEmptyRow ? '_new' : '_old'])
                },
                _new: null,
                _old: null
            },
            exchangeTitleSwitch: {
                toStr: (x) => '打印模式：' + (x ? '标题在下' : '标题在上（原模式）'),
                register: () => {
                    let isExchangeTitle = utils.getValue('isExchangeTitle')
                    options.menus.exchangeTitleSwitch[!isExchangeTitle ? '_new' : '_old'] = GM_registerMenuCommand(options.menus.exchangeTitleSwitch.toStr(isExchangeTitle), () => {
                        utils.setValue('isExchangeTitle', !isExchangeTitle)
                        options.menus.exchangeTitleSwitch.register()
                    })
                    GM_unregisterMenuCommand(options.menus.exchangeTitleSwitch[isExchangeTitle ? '_new' : '_old'])
                },
                _new: null,
                _old: null
            },
            reconfirmSwitch: {
                toStr: (x) => '同意模式：' + (x ? '二次审批' : '直接审批（原模式）'),
                register: () => {
                    let reconfirm = utils.getValue('reconfirm')
                    options.menus.reconfirmSwitch[!reconfirm ? '_new' : '_old'] = GM_registerMenuCommand(options.menus.reconfirmSwitch.toStr(reconfirm), () => {
                        utils.setValue('reconfirm', !reconfirm)
                        options.menus.reconfirmSwitch.register()
                    })
                    GM_unregisterMenuCommand(options.menus.reconfirmSwitch[reconfirm ? '_new' : '_old'])
                },
                _new: null,
                _old: null
            }
        },
        register: () => {
            options.menus.tabSwitch.register()
            options.menus.removeEmptyRowsSwitch.register()
            options.menus.exchangeTitleSwitch.register()
            options.menus.reconfirmSwitch.register()
        }
    }

    options.register()
    // 1、新页面模式
    const _openCtpWindow_old = unsafeWindow.openCtpWindow
    unsafeWindow.openCtpWindow = (...args) => {
        if (utils.getValue('isNewTab'))
            unsafeWindow.open(window.location.origin + args[0]['url'])
        else
            _openCtpWindow_old(...args)
    }

    // 2、优化打印
    if (window.location.pathname.match(/common\/print\/captPrintForm\.jsp/g)) {
        const _printAll_old = unsafeWindow.printAll
        const _printMain_old = unsafeWindow.printMain
        var _formtype_old = ""
        const _betterPrint = () => {
            // 2.1、隐藏按钮开关
            if ($('#hidebutton').length == 0) {
                var hidebutton = $('<label for="dataNameBox0" class="margin_r_10 hand"><input class="radio_com" type="checkbox" checked name="dataNameBoxes" id="hidebutton"><font style="font-size:12px" color="black">隐藏按钮</font></label>')
                hidebutton.find('input').click((event) => $('a[name=replay_delete]').attr('style', $(event.target).is(':checked') ? 'display:none' : ''))
                $('#checkOption').append(hidebutton)
            }

            // 2.2、删除多余空行
            if (utils.getValue('isRemoveEmptyRow')) {
                $("[data-key^=line-]").remove()
                $("[data-record-id][data-key^=recordId-]").each((i, ele) => { if (/费用名称\s+用途\s+金额\s+备注/g.test(ele.textContent)) ele.remove() })
            }

            // 2.3、标题互换
            if (utils.getValue('isExchangeTitle')) {
                if (_formtype_old.length == 0)
                    _formtype_old = $("#auxiliaryformmain_0line0col4_id").text()
                var tdict = {}
                var tlist = unsafeWindow.getParentWindow().plist
                for (let i = 0; i < tlist.size(); i++)
                    tdict[tlist.get(i)["dataName"]] = tlist.get(i)["dataHtml"]
                $("#auxiliaryformmain_0line0col4_id").html(tdict["标题"])
                $("#__pageTitle center span").text(_formtype_old)
            }
            // 2.4、添加审批意见删除按钮
            $("[class=content] [id^=replay_c_]").each((i, v) => {
                var del = $('<a class="color_blue  margin_r_10 right font_normal" name="replay_delete" style="display:none">删除</a>')
                del.click((event) => $(event.target).parents('[id^=replay_c_]').remove())
                $(v).find('div.right').append(del)
            })
            $("[id^=ulcomContent] div").each((i, v) => {
                if ($(v).text().length > 0) {
                    var del = $('<a class="color_blue margin_r_10 right font_normal" name="replay_delete" style="display:none">删除</a>')
                    del.click((event) => $(event.target).parents('[id^=ulcomContent]').remove())
                    $(v).append(del)
                }
            })
        }
        unsafeWindow.printAll = (target) => {
            _printAll_old(target)
            _betterPrint()
        }
        unsafeWindow.printMain = (target) => {
            _printMain_old(target)
            _betterPrint()
        }
    }

    // 3、补充功能函数
    if (!('PermissionDataHandler' in window) && false) {
        $([
            '/seeyon/apps_res/permission/js/permissionDataHandler.js?V=V8_0SP1_201101_29550',
            '/seeyon/apps_res/collaboration/js/deal.js?V=V8_0SP1_201101_29550'
        ]).each((i, v) => {
            if ($(`script[src="${v}"]`).length == 0)
                utils.loadScript(v, function () {
                    console.log(`Load ${v} successfully!`)
                })
        })
        unsafeWindow.inInSpecialSB = ''
        unsafeWindow.state = '3'
    }

    // 4、替换原批量下载功能
    if (/findAttachmentListBuSummaryId/.test(location.search)) {
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase())
        $("#batchDownload").show()
        $("#batchDownload").parent().show()
    }
    unsafeWindow.doloadFileFun = async (userId, $obj) => {
        var ipUrl = window.location.href
        var startUrl = ipUrl.substring(0, ipUrl.indexOf(_ctxPath)) + _ctxPath
        var size = 0
        var pigCount = 0
        var hasFolder = false
        var files = []
        var fileurls = []
        for (var i = 0; i < $obj.size(); i++) {
            size += 1;
            var id = $obj[i].value;
            var downloadFrName = $($obj[i]).attr("frName") + "." + $($obj[i]).attr("frType")
            var vForDocDownload = $($obj[i]).attr("frVStr")
            var url
            downloadFrName = downloadFrName.replace(/ /g, "")
            url = startUrl + "/fileDownload.do?method=doDownload&fileId=" + id + "&v=" + vForDocDownload + "&filename=" + downloadFrName
            fileurls.push({ url: url, name: downloadFrName})
        }

        await utils.asyncPool(fileurls, async (item, arr) => {
            var blob = await utils.fetchBlob(item['url'], 'GET')
            files.push({ name: item['name'], url: item['url'], blob: blob })
            return item
        }, (v) => v, (v) => {
            utils.generateZip(files, subject.trim().replace(/[:/]/, "_").replaceAll("&nbsp;", " ") + ".zip")
            return v
        }, 10)
    }

    // 5、知会可用按钮补充
    if ($("#uploadRelDocDealID").length == 0 && $("#uploadAttachmentDealID").length > 0) {
        $("#uploadAttachmentDealID").after($('<li id="uploadRelDocDealID" style="float:left;"><span class="syIcon sy-associated_document" style="color:#1F85EC;margin: 0 11px;font-size: 18px;"></span><span style="vertical-align: top;">关联文档</span></li>'))
        $('#uploadRelDocDealID').click(() => quoteDocument(commentId))
    }
    if (unsafeWindow.nodePolicy == "inform") {
        var jsonArrCommon_pre = JSON.parse(unsafeWindow.jsonArrCommon)
        unsafeWindow.jsonArrCommon = JSON.stringify(jsonArrCommon_pre.concat([
            {
                "codes": ["AddNode"],
                "img": "syIcon sy-signature",
                "color": "#1f85ec",
                "imagePorlet": false,
                "label": "加签",
                "type": "0",
                "click": "",
                "isSystem": true,
                "hasProcessChange": false,
                "packageOperation": false,
                "isSpecifiesReturnToMe": false,
                "id": "AddNode",
                "hasSubmit": false
            }, {
                "codes": ["JointSign"],
                "img": "syIcon sy-current_countersigned",
                "color": "#1f85ec",
                "imagePorlet": false,
                "label": "当前会签",
                "type": "0",
                "click": "",
                "isSystem": true,
                "hasProcessChange": false,
                "packageOperation": false,
                "isSpecifiesReturnToMe": false,
                "id": "JointSign",
                "hasSubmit": false
            }, {
                "codes": ["RemoveNode"],
                "img": "syIcon sy-signafalse",
                "color": "#1f85ec",
                "imagePorlet": false,
                "label": "减签",
                "type": "0",
                "click": "",
                "isSystem": true,
                "hasProcessChange": false,
                "packageOperation": false,
                "isSpecifiesReturnToMe": false,
                "id": "RemoveNode",
                "hasSubmit": false
            }, {
                "codes": ["allowUpdateAttachment"],
                "img": "syIcon sy-modify_attachment",
                "color": "#1f85ec",
                "imagePorlet": false,
                "label": "修改附件",
                "type": "4",
                "click": "",
                "isSystem": true,
                "hasProcessChange": false,
                "packageOperation": false,
                "isSpecifiesReturnToMe": false,
                "id": "allowUpdateAttachment",
                "hasSubmit": false
            }, {
                "codes": ["Transfer"],
                "img": "syIcon sy-transfer",
                "color": "#1f85ec",
                "imagePorlet": false,
                "label": "移交",
                "type": "2",
                "click": "",
                "isSystem": true,
                "hasProcessChange": false,
                "packageOperation": false,
                "isSpecifiesReturnToMe": false,
                "id": "Transfer",
                "hasSubmit": false
            }
        ]))
        $("#toolb").empty()
        unsafeWindow._initPageBtns()
    }

    // 6、审批同意两步触发
    if (window.location.href.match(/collaboration\/collaboration\.do\?.*openFrom=listPending/g) && utils.getValue('reconfirm')) {
        var submitClickFunc_old = unsafeWindow.submitClickFunc
        unsafeWindow.submitClickFunc = () => {
            var msg = confirm('确认同意审批吗？')
            if (msg)
                submitClickFunc_old()
        }
    }
})();