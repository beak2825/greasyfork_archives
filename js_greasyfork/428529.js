// ==UserScript==
// @name         拼多多商品详情抓取
// @namespace    http://leironghua.com/
// @version      1.1.8
// @description  拼多多商品详情抓取,
// @license      MIT
// @author       雷荣华
// @run-at       document-end
// @match        *mobile.yangkeduo.com/goods2.html*
// @match        *mobile.yangkeduo.com/goods.html*
// @match        *mobile.yangkeduo.com/goods1.html*
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
// @downloadURL https://update.greasyfork.org/scripts/428529/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/428529/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function (doc) {
    'use strict';

    GM_addElement('link', {
        type: 'text/css',
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/bjornharrtell/extjs@6.2.0/build/modern/theme-neptune/resources/theme-neptune-all.css'
    });
    var urls = ['https://cdn.jsdelivr.net/gh/bjornharrtell/extjs@6.2.0/build/ext-modern-all.js']

    var urlsIndex = 0;

    var recursiveCallback = function () {
        if (++urlsIndex < urls.length) {
            loadScript(urls[urlsIndex], recursiveCallback)
        } else {
            unsafeWindow.Ext = Ext
            window._lrhInterval = window.setInterval(function () {
                if ($('.pdd-go-to-app').length == 0) {
                    return;
                }
                //去掉定时器的方法，已经加载完成
                window.clearInterval(window._lrhInterval);
                $('.pdd-go-to-app').click(onClick).html("开始导出<span class=\"icon pdd-go-to-app-icon\"></span>")
            }, 500);
        }
    }

    loadScript(urls[0], recursiveCallback);


    function loadScript(url, callback) {

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }




    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function Random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function goLogin(msg) {
        Ext.Msg.alert('操作提示', msg, function () {
            unsafeWindow.location.href = "https://mobile.yangkeduo.com/login.html?from=" + encodeURIComponent(unsafeWindow.location.href)
            return;
        });
        var ms = msg.match(/[1-9][0-9]*/g)[0];
        window._lrhInterval = window.setInterval(function () {
            var html = Ext.Msg._message.getHtml()
            html = html.replace(ms, ms - 1)
            ms = ms - 1
            if (ms <= 0) {
                unsafeWindow.location.href = "https://mobile.yangkeduo.com/login.html?from=" + encodeURIComponent(unsafeWindow.location.href)
                return
            }
            Ext.Msg._message.setHtml(html)
        }, 1000);


        return;
    }

    // 评价查询
    function doCommentQuery(page, callback) {
        var totalPage = 25
        if (page > totalPage) {
            callback()
            return;
        }
        if (page == 1) {
            addLog({
                等级: 'INFO',
                内容: '开始拉取评价'
            })
        }
        var pdd_user_id = $.cookie('pdd_user_id'); // 获取当前用户id
        var accessToken = localStorage.getItem('AccessToken')
        if (!pdd_user_id || !accessToken) {
            goLogin('您还未登录，3秒后将自动前往登录。')
            return;
        }
        $.ajax({
            type: "get",
            url: "/proxy/api/api/engels/reviews/sku/review/list",
            headers: {
                accesstoken: accessToken
            },
            data: {
                pdduid: pdd_user_id,
                is_back: 1,
                goods_id: window._lrhResult.商品Id,
                label_id: 100000000, // 100000000有图、700000000最新、600000000视频、200000000追加、400000000回头客、0全部
                page: page,
                size: 20,
                sku_id: 0
            },
            success: function (result) {



            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var json = XMLHttpRequest.responseJSON

                },
            complete: function (XMLHttpRequest, textStatus) {
                var result = XMLHttpRequest.responseJSON
                if (result && result.error_msg && result.error_msg.indexOf('登录') != -1) {
                    addLog({
                        等级: 'ERROR',
                        内容: '评价数据第' + page + '页拉取失败，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
                    })
                    goLogin('评价拉取失败，' + result.error_msg + '3秒后将跳转登录')
                    return;
                }

                if(result && result.data &&  result.data.length == 0) {
                    callback();
                    return;
                }

                addLog({
                    等级: 'INFO',
                    内容: '评价数据第' + page + '页拉取成功，返回' + result.data.length + '条记录'
                })

                window._lrhResult.commentData.push.apply(window._lrhResult.commentData, result.data);

                page = page + 1;
                var percent = (page / totalPage) % 1
                Ext.Viewport.down('progress').setText('正在拉取评价 ' + (percent * 100).toFixed(2) + '%')
                Ext.Viewport.down('progress').setValue(percent)
                // 延迟500-2000毫秒，避免请求频率过高
                var random = Random(500, 2000)
                setTimeout(function () {
                    doCommentQuery(page, callback)
                }, random)
            }
        });

    }

    // 数据处理
    function dataHand() {
        addLog({
            等级: 'INFO',
            内容: '开始处理评价数据共' + window._lrhResult.commentData.length + '条'
        })
        window._lrhResult.commentData.forEach(function (item, itemIndex, array) {
            try {
                var fileName, itemNo = itemIndex + 1,
                    imgNo = 0
                var temp = {
                    客户: item.name,
                    型号: '默认颜色分类',
                    评价: item.comment,
                    追评: "",
                    追评时间: ""
                }
                if (item.specs) {
                    var spec = JSON.parse(item.specs)[0]
                    if (spec && spec.spec_value) {
                        temp.型号 = spec.spec_value
                    }
                }

                if (item.pictures) {
                    item.pictures.forEach(function (img, imgIndex) {
                        imgNo++
                        fileName = temp.型号 + '/' + itemNo + '-' + imgNo + '.' + img.url.split('.').pop().toLowerCase()
                        window._lrhResult.评价图片.push({
                            fileName: fileName,
                            url: img.url
                        })
                    })
                }
                // 存在视频
                if (item.video) {
                    fileName = temp.型号 + '/' + itemNo + '-' + imgNo + '.' + item.video.url.split('.').pop().toLowerCase()
                    window._lrhResult.评价图片.push({
                        fileName: fileName,
                        url: item.video.url
                    })
                }
                if (item.append) {
                    temp.追评 = item.append.comment
                    temp.追评时间 = item.append_time_text
                    if (item.append.pictures) {
                        item.append.pictures.forEach(function (img, imgIndex) {
                            imgNo++
                            fileName = temp.型号 + '/' + itemNo + '-' + imgNo + '.' + img.url.split('.').pop().toLowerCase()
                            window._lrhResult.评价图片.push({
                                fileName: fileName,
                                url: img.url
                            })
                        })
                    }
                    // 存在视频
                    if (item.append.video) {
                        fileName = temp.型号 + '/' + itemNo + '-' + imgNo + '.' + item.append.video.url.split('.').pop().toLowerCase()
                        window._lrhResult.评价图片.push({
                            fileName: fileName,
                            url: item.append.video.url
                        })
                    }
                }
                window._lrhResult.评价数据.push(temp)
            } catch (e) {
                console.error(item)
                console.error(e)
                addLog({
                    等级: 'ERROR',
                    内容: '处理评价数据第' + itemIndex + '出错：' + e
                })
            }
        });
        Ext.Viewport.down('#appraiseText').tab.setBadgeText(window._lrhResult.评价数据.length)
        Ext.Viewport.down('#appraiseText').getStore().loadRawData(window._lrhResult.评价数据)
        var mySheet = XLSX.utils.json_to_sheet(window._lrhResult.评价数据); //中间对象
        var workBook = {
            SheetNames: ['mySheet'],
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
        var zip = new JSZip();

        var zipRoot = zip.folder(window._lrhResult.商品名称)
        zipRoot.file("5-评价内容.xlsx", wbout, {
            binary: true
        });
        addLog({
            等级: 'INFO',
            内容: '开始拉取主图'
        })
        downloadMainImags(zipRoot, 0, function () {
            addLog({
                等级: 'INFO',
                内容: '开始拉取颜色分类'
            })
            downloadTypeImags(zipRoot, 0, function () {
                addLog({
                    等级: 'INFO',
                    内容: '开始拉取详情图片'
                })
                downloadDetailImags(zipRoot, 0, function () {
                    addLog({
                        等级: 'INFO',
                        内容: '开始拉取评价图片'
                    })
                    downloadAppraiseImags(zipRoot, 0, function () {
                        addLog({
                            等级: 'INFO',
                            内容: '开始打包压缩文件'
                        })
                        var logTxt = '';
                        var logFileName = '6-运行日志'
                        Ext.Viewport.down('#log').getStore().each(function (r) {
                            if (r.get('等级') == 'ERROR' && logFileName.indexOf('-存在错误-请查阅') == -1) {
                                logFileName += '-存在错误-请查阅'
                            }
                            logTxt += Ext.Date.format(r.get('时间'), 'Y-m-d H:i:s') + ' ' + r.get('等级') + ' ' + r.get('内容') + '\n'
                        })
                        logFileName += '.txt'
                        zipRoot.file(logFileName, logTxt)
                        Ext.Viewport.down('progress').setText('正在打包压缩文件')
                        window._lrhInterval = window.setInterval(function () {
                            Ext.Viewport.down('progress').barEl.animate(Ext.apply({
                                from: {
                                    width: (0 * 100) + '%'
                                },
                                to: {
                                    width: (1 * 100) + '%'
                                }
                            }, true))
                        }, 1000);
                        zip.generateAsync({
                            type: "blob"
                            // compression: "DEFLATE",
                            // compressionOptions: {
                            //   level: 1
                            // }
                        }).then(function (content) {
                            addLog({
                                等级: 'INFO',
                                内容: '打包压缩完成'
                            })
                            window._lrhResult.zipContent = content;
                            //去掉定时器的方法，已经加载完成
                            window.clearInterval(window._lrhInterval);
                            Ext.Viewport.down('progress').setText('打包压缩完成，正在下载')
                            Ext.Viewport.down('progress').setValue(0);
                            downloadZip();
                            Ext.Viewport.down('progress').setText('下载完成，请留意浏览器的文件保存提示')
                        });
                    })
                })
            })
        });
    }

    function downloadZip() {
        addLog({
            等级: 'INFO',
            内容: '开始下载中'
        })
        // see FileSaver.js
        saveAs(window._lrhResult.zipContent, window._lrhResult.商品Id + ' ' + window._lrhResult.商品名称);
        addLog({
            等级: 'INFO',
            内容: '下载完成，请查阅浏览器的文件保存提示'
        })
    }

    function downloadError(zipRoot, index, callback) {
        var length = window._lrhResult.加载失败.length
        if (index >= length) {
            callback()
            return;
        }
        var item = window._lrhResult.加载失败[index]
        var fileName = item.fileName
        var url = item.url
        item.count = item.count || 2

        $.ajax({
            url: url,
            type: 'GET',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            dataType: 'binary',
            success: function (result) {
                zipRoot.file(fileName, result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                addLog({
                    等级: 'ERROR',
                    内容: fileName + item.count + '次拉取失败：' + url + '，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
                })
                item.count++
            },
            complete: function (XMLHttpRequest, textStatus) {
                if (textStatus == 'success' || item.count > 4) {
                    index = index + 1
                }
                var percent = (index / length) % 1
                Ext.Viewport.down('progress').setText('正在加载' + index + '/' + length + '商品主图 ' + (percent * 100).toFixed(2) + '%')
                Ext.Viewport.down('progress').setValue(percent)
                downloadError(zipRoot, index, callback)
            }
        })

    }

    function downloadMainImags(zipRoot, index, callback) {
        var length = window._lrhResult.商品主图.length
        if (index >= length) {
            callback()
            return;
        }
        var url = window._lrhResult.商品主图[index].replace(/^https?\:/i, "") // 替换http 或者 https前缀，使其get请求使用相对协议避免出现 https无法加载http的资源
        var fileName = "1-商品主图/" + (index + 1).toString() + '.' + url.split('.').pop().toLowerCase()

        $.ajax({
            url: url,
            type: 'GET',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            dataType: 'binary',
            success: function (result) {
                zipRoot.file(fileName, result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                addLog({
                    等级: 'ERROR',
                    内容: fileName + '拉取失败：' + url + '，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
                })
                window._lrhResult.加载失败.push({
                    fileName: fileName,
                    url: url
                })
            },
            complete: function (XMLHttpRequest, textStatus) {
                index = index + 1
                var percent = (index / length) % 1
                Ext.Viewport.down('progress').setText('正在加载' + index + '/' + length + '商品主图 ' + (percent * 100).toFixed(2) + '%')
                Ext.Viewport.down('progress').setValue(percent)
                Ext.Viewport.down('#mainImage').getStore().add({
                    fileName: fileName,
                    fileUrl: url,
                    textStatus: textStatus
                })

                Ext.Viewport.down('#mainImage').tab.setBadgeText(Ext.Viewport.down('#mainImage').getStore().getCount())
                downloadMainImags(zipRoot, index, callback)
            }
        })

    }

    function downloadTypeImags(zipRoot, index, callback) {
        var length = window._lrhResult.颜色分类.length
        if (index >= length) {
            callback()
            return;
        }
        var item = window._lrhResult.颜色分类[index]
        var url = item.thumbUrl.replace(/^https?\:/i, "") // 替换http 或者 https前缀，使其get请求使用相对协议避免出现 https无法加载http的资源
        var fileName = "2-颜色分类/" + (item.specs && item.specs[0] ? item.specs[0].spec_value : '默认颜色分类') + '.' + url.split('.').pop().toLowerCase()

        $.ajax({
            url: url,
            type: 'GET',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            dataType: 'binary',
            success: function (result) {
                zipRoot.file(fileName, result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                addLog({
                    等级: 'ERROR',
                    内容: fileName + '拉取失败：' + url + '，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
                })
                window._lrhResult.加载失败.push({
                    fileName: fileName,
                    url: url
                })
            },
            complete: function (XMLHttpRequest, textStatus) {
                index = index + 1
                var percent = (index / length) % 1
                Ext.Viewport.down('progress').setText('正在加载' + index + '/' + length + '颜色分类 ' + (percent * 100).toFixed(2) + '%')
                Ext.Viewport.down('progress').setValue(percent)
                Ext.Viewport.down('#typeImage').getStore().add({
                    fileName: fileName,
                    fileUrl: url,
                    textStatus: textStatus
                })
                Ext.Viewport.down('#typeImage').tab.setBadgeText(Ext.Viewport.down('#typeImage').getStore().getCount())
                downloadTypeImags(zipRoot, index, callback)
            }
        })

    }


    function downloadDetailImags(zipRoot, index, callback) {
        var length = window._lrhResult.商品详图.length
        if (index >= length) {
            callback()
            return;
        }
        var url = window._lrhResult.商品详图[index].url.replace(/^https?\:/i, "") // 替换http 或者 https前缀，使其get请求使用相对协议避免出现 https无法加载http的资源
        var fileName = "3-商品详图/" + (index + 1).toString() + '.' + url.split('.').pop().toLowerCase()

        $.ajax({
            url: url,
            type: 'GET',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            dataType: 'binary',
            success: function (result) {
                zipRoot.file(fileName, result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                addLog({
                    等级: 'ERROR',
                    内容: fileName + '拉取失败：' + url + '，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
                })
                window._lrhResult.加载失败.push({
                    fileName: fileName,
                    url: url
                })
            },
            complete: function (XMLHttpRequest, textStatus) {
                index = index + 1
                var percent = (index / length) % 1
                Ext.Viewport.down('progress').setText('正在加载' + index + '/' + length + '商品详图 ' + (percent * 100).toFixed(2) + '%')
                Ext.Viewport.down('progress').setValue(percent)
                Ext.Viewport.down('#detailImage').getStore().add({
                    fileName: fileName,
                    fileUrl: url,
                    textStatus: textStatus
                })
                Ext.Viewport.down('#detailImage').tab.setBadgeText(Ext.Viewport.down('#detailImage').getStore().getCount())
                downloadDetailImags(zipRoot, index, callback)
            }
        })
    }

    function downloadAppraiseImags(zipRoot, index, callback) {
        var length = window._lrhResult.评价图片.length
        if (index >= length) {
            callback()
            return;
        }
        var item = window._lrhResult.评价图片[index]
        var url = item.url.replace(/^https?\:/i, "") // 替换http 或者 https前缀，使其get请求使用相对协议避免出现 https无法加载http的资源
        var fileName = "4-评价图片/" + item.fileName
        if (fileName.indexOf('.mp4') !== -1) {
            addLog({
                等级: 'INFO',
                内容: fileName + '为视频文件，跳过：' + url
            })
            index = index + 1
            downloadAppraiseImags(zipRoot, index, callback)
            return;
        }
        $.ajax({
            url: url,
            type: 'GET',
            xhrFields: {
                responseType: 'arraybuffer'
            },
            dataType: 'binary',
            success: function (result) {
                zipRoot.file(fileName, result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window._lrhResult.加载失败.push({
                    fileName: fileName,
                    url: url
                })
                addLog({
                    等级: 'ERROR',
                    内容: fileName + '拉取失败：' + url + '，' + XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + '：' + XMLHttpRequest.responseText + errorThrown
                })
            },
            complete: function (XMLHttpRequest, textStatus) {
                index = index + 1
                var percent = (index / length) % 1
                Ext.Viewport.down('progress').setText('正在加载' + index + '/' + length + '评价图片 ' + (percent * 100).toFixed(2) + '%')
                Ext.Viewport.down('progress').setValue(percent)
                Ext.Viewport.down('#appraiseImage').getStore().add({
                    fileName: fileName,
                    fileUrl: url,
                    textStatus: textStatus
                })
                Ext.Viewport.down('#appraiseImage').tab.setBadgeText(Ext.Viewport.down('#appraiseImage').getStore().getCount())
                downloadAppraiseImags(zipRoot, index, callback)
            }
        })
    }

    function addLog(obj) {
        obj.时间 = new Date()
        Ext.Viewport.down('#log').getStore().add(obj)
    }

    function onClick(event) {
        event.stopPropagation();
        if (!Ext.Viewport) {
            Ext.application({
                name: 'MyApp',
                viewport: {
                    title: '手机端测试',
                    layout: 'vbox'
                },
                launch: function () {
                    Ext.Viewport.on({
                        beforeshow: function () {
                            $('#main').hide()
                            $('html').css('font-size', '12px')
                        },
                        hide: function () {
                            $('#main').show()
                            $('html').css('font-size', '110.4px')
                        },
                        scope: this // Important. Ensure "this" is correct during handler execution
                    })
                    Ext.Viewport.add({
                        xtype: 'tabpanel',
                        viewModel: {
                            data: {
                                progress: 0
                            }
                        },
                        shadow: true,
                        activeTab: 0,
                        tabBar: {
                            layout: {
                                pack: 'center',
                                align: 'center'
                            },
                            docked: 'bottom',
                            defaults: {
                                iconAlign: 'top'
                            }
                        },
                        defaults: {
                            scrollable: true
                        },
                        items: [{
                            title: '商品主图',
                            cls: 'card',
                            iconCls: 'x-fa fa-info-circle',
                            xtype: 'grid',
                            itemId: 'mainImage',
                            store: {
                                data: []
                            },
                            columns: [{
                                xtype: 'rownumberer'
                            }, {
                                text: '文件名',
                                dataIndex: 'fileName',
                                flex: 1,
                                renderer: function (value, record) {
                                    return '<a target="_blank" href="' + record.get('fileUrl') + '">' + value + '</a>'
                                }
                            }, {
                                text: '状态',
                                dataIndex: 'textStatus',
                                width: 100
                            }]
                        },
                                {
                                    title: '颜色分类',
                                    cls: 'card',
                                    iconCls: 'x-fa fa-star',
                                    badgeText: '',
                                    xtype: 'grid',
                                    itemId: 'typeImage',
                                    store: {
                                        data: []
                                    },
                                    columns: [{
                                        xtype: 'rownumberer'
                                    }, {
                                        text: '文件名',
                                        dataIndex: 'fileName',
                                        flex: 1,
                                        renderer: function (value, record) {
                                            return '<a target="_blank" href="' + record.get('fileUrl') + '">' + value + '</a>'
                                        }
                                    }, {
                                        text: '状态',
                                        dataIndex: 'textStatus',
                                        width: 100
                                    }]
                                },
                                {
                                    title: '商品详图',
                                    id: 'tab3',
                                    badgeText: '',
                                    cls: 'card',
                                    iconCls: 'x-fa fa-download',
                                    xtype: 'grid',
                                    itemId: 'detailImage',
                                    store: {
                                        data: []
                                    },
                                    columns: [{
                                        xtype: 'rownumberer'
                                    }, {
                                        text: '文件名',
                                        dataIndex: 'fileName',
                                        flex: 1,
                                        renderer: function (value, record) {
                                            return '<a target="_blank" href="' + record.get('fileUrl') + '">' + value + '</a>'
                                        }
                                    }, {
                                        text: '状态',
                                        dataIndex: 'textStatus',
                                        width: 100
                                    }]
                                },
                                {
                                    title: '评价图片',
                                    cls: 'card',
                                    iconCls: 'x-fa fa-gear',
                                    xtype: 'grid',
                                    itemId: 'appraiseImage',
                                    store: {
                                        data: []
                                    },
                                    columns: [{
                                        xtype: 'rownumberer'
                                    }, {
                                        text: '文件名',
                                        dataIndex: 'fileName',
                                        flex: 1,
                                        renderer: function (value, record) {
                                            return '<a target="_blank" href="' + record.get('fileUrl') + '">' + value + '</a>'
                                        }
                                    }, {
                                        text: '状态',
                                        dataIndex: 'textStatus',
                                        width: 100
                                    }]
                                },
                                {
                                    title: '评价内容',
                                    cls: 'card',
                                    xtype: 'grid',
                                    iconCls: 'x-fa fa-users',
                                    itemId: 'appraiseText',
                                    store: {
                                        data: []
                                    },
                                    // plugins: [{
                                    //   type: 'pagingtoolbar'
                                    // }],
                                    columns: [{
                                        xtype: 'rownumberer'
                                    }, {
                                        text: '型号',
                                        dataIndex: '型号'
                                    }, {
                                        text: '评价',
                                        dataIndex: '评价',
                                        flex: 1
                                    }]
                                }, {
                                    title: '运行日志',
                                    // cls: 'card',
                                    xtype: 'grid',
                                    itemId: 'log',
                                    iconCls: 'fa fa-th-list',
                                    store: {
                                        data: []
                                    },
                                    columns: [{
                                        text: '时间',
                                        dataIndex: '时间',
                                        width: 70,
                                        xtype: 'datecolumn',
                                        format: 'H:i:s'
                                    }, {
                                        text: '等级',
                                        dataIndex: '等级',
                                        width: 50
                                    }, {
                                        text: '内容',
                                        dataIndex: '内容',
                                        flex: 1
                                    }]
                                },
                                {
                                    xtype: 'toolbar',
                                    ui: 'neutral',
                                    docked: 'top',
                                    scrollable: null,
                                    defaults: {
                                        ui: 'plain toolbar'
                                    },
                                    items: [{
                                        iconCls: 'x-fa fa-reply',
                                        handler: function () {
                                            Ext.Viewport.hide()
                                        }
                                    },
                                            {
                                                xtype: 'progress',
                                                flex: 1,
                                                bind: {
                                                    value: '{progress}'
                                                }
                                            },
                                            {
                                                iconCls: 'x-fa fa-download',
                                                handler: function () {
                                                    if (window._lrhResult.zipContent) {
                                                        downloadZip();
                                                        return;
                                                    }
                                                    Ext.toast('文件尚未准备好，请稍后！');
                                                }
                                            }
                                           ]
                                }
                               ]

                    });
                }
            });
            window._lrhResult.店铺名称 = rawData.store.initDataObj.mall.mallName
            window._lrhResult.商品Id = getUrlParam('goods_id')
            window._lrhResult.商品名称 = rawData.store.initDataObj.goods.goodsName;
            window._lrhResult.颜色分类 = rawData.store.initDataObj.goods.skus;
            window._lrhResult.商品主图 = rawData.store.initDataObj.goods.viewImageData
            // 如果存在视频，则把视频评价在主图后面
            if (rawData.store.initDataObj.goods.videoGallery && rawData.store.initDataObj.goods.videoGallery.length > 0) {
                rawData.store.initDataObj.goods.videoGallery.forEach(function (v) {
                    window._lrhResult.商品主图.push(v.url)
                })
            }
            window._lrhResult.商品详图 = rawData.store.initDataObj.goods.detailGallery
            doCommentQuery(1, dataHand);
        }
        Ext.Viewport.show()
    }



    window._lrhResult = {
        commentData: [],
        店铺名称: '',
        商品名称: '',
        颜色分类: [],
        商品主图: [],
        商品详图: [],
        评价数据: [],
        评价图片: [],
        加载失败: []
    }

})(document);