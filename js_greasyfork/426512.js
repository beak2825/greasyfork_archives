// ==UserScript==
// @name         YAPI Helper
// @namespace    https://greasyfork.org/zh-CN/scripts/426512
// @version      0.4
// @description  将YAPI的接口返回数据结构复制为typescript的interface类型
// @author       zhenhappy<q505507538@gmail.com>
// @include      http://*
// @include      https://*
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @require      https://unpkg.com/clipboard/dist/clipboard.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426512/YAPI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/426512/YAPI%20Helper.meta.js
// ==/UserScript==

(function() {
    if (!$('#yapi').html()) return
    var title = null
    var table = null
    var url = ''
    var clipboard = null
    init()
    function init () {
        setInterval(function () {
            if (url !== window.location.href) {
                url = window.location.href
                title = null
                table = null
                var t = setInterval(function () {
                    try {
                        // 查找"返回数据"节点
                        if ($('.interface-title') && $('.interface-title').length > 0) {
                            $.each($('.interface-title'), function () {
                                if ($(this).text().search('返回数据') > -1) {
                                    $(this).html('返回数据')
                                    title = $(this)
                                    table = $(this).next().find('table')
                                    expandAll(copy)
                                }
                            })
                        } else {
                            throw(Error('未找到元素'))
                        }
                        clearInterval(t)
                    } catch (e) {
                        if ((e.message !== '未找到元素')) console.error(e)
                    }
                }, 100)
            }
        }, 500)
    }
    function addCopyBtn (text) {
        var copy = document.createElement('a')
        copy.id = 'copy'
        $(copy).attr('id', 'copy')
        $(copy).attr('href', '#')
        $(copy).attr('data-clipboard-text', text)
        $(copy).text('复制数据结构')
        title.append('&nbsp;&nbsp;').append($(copy));
        if (clipboard) clipboard.destroy()
        clipboard = new ClipboardJS(copy)
    }
    function copy () {
        var obj = {}
        var parent = obj
        var parentLevel = 0
        try {
            $.each(table.find('.ant-table-row'), function () {
                var key = $(this).find('td').eq(0).text()
                var type = $(this).find('td').eq(1).text()
                var level = parseInt($(this).attr('class').replace('ant-table-row  ant-table-row-level-', ''))

                if (level < parentLevel) parent = obj

                parent[key] = typeTranslate(type)
                if (typeof parent[key] !== 'string') {
                    parent = parent[key]
                }
                parentLevel = level
            })
        } catch (e) {
            console.error(e)
        }
        addCopyBtn(JSON.stringify(obj, replacer).replace(/"/g, '').replace(/,/g, ';'))
    }
    function expandAll (cb) {
        if (table.find('.ant-table-row-collapsed') && table.find('.ant-table-row-collapsed').length > 0) {
            $.each(table.find('.ant-table-row-collapsed'), function () {$(this).trigger('click')})
            expandAll(cb)
        } else {
            cb()
        }
    }
    function typeTranslate (type) {
        switch (type) {
            case 'integer': return 'number'
            case 'object []': return {}
            default: return type
        }
    }
    function replacer (key, value) {
        if (key !== '' && typeof value === 'object') return 'Array<' + JSON.stringify(value, replacer).replace(/"/g, '').replace(/,/g, ';') + '>'
        else return value
    }
})();