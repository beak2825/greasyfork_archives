// ==UserScript==
// @name         中信网新闻发布
// @namespace    chinaxinge
// @version      0.1.4
// @description  发布信息过滤域名
// @author       chinaxinge
// @include      *://gdgp.chinaxinge.com/*
// @icon         https://www.google.com/s2/favicons?domain=chinaxinge.com
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/444118/%E4%B8%AD%E4%BF%A1%E7%BD%91%E6%96%B0%E9%97%BB%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/444118/%E4%B8%AD%E4%BF%A1%E7%BD%91%E6%96%B0%E9%97%BB%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    var curMan = window.location.pathname
    curMan = curMan.toLowerCase()
    var urlBanks = ['/d_gdgp/input_v1.asp','/d_gdgp/edit.asp', '/d_gdgp/input_j_v1.asp']
    if (urlBanks.indexOf(curMan) !== -1) {
        console.log(curMan, window.checkdata)
        window.onload = function () {
            if (window.checkdata) {
                window.checkdata = function () {
                    var iCheck = 0
                    if (document.form1.tp.value == '0') {
                        alert('请选择栏目！')
                        document.form1.tp.focus()
                        return
                    }
                    var title = document.form1.title.value.trim()
                    if (title.length == '') {
                        alert('文章标题不能为空！')
                        document.form1.title.focus()
                        iCheck++
                        return
                    }

                    if (title.length > 100) {
                        alert('文章标题太长了，请将标题改短些！')
                        document.form1.title.focus()
                        return
                    }

                    var strc = title
                    var charstr = '〓;★;▲;▼;◆;●;■;◎;☆;□;◇;○;▽;△;⊙;█;【;】'
                    var arr = charstr.split(';')
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (strc.indexOf(arr[i]) >= 0) {
                            alert('为保持页面整洁，标题中不能包含"' + arr[i] + '" 等特殊符号！')
                            document.form1.title.focus()
                            return false
                            break
                        }
                    }
                    var vauthor = document.form1.vauthor.value.trim()
                    if (vauthor.length == '') {
                        alert('作者不能为空！')
                        document.form1.vauthor.focus()
                        iCheck++
                        return
                    }

                    if (document.form1.point[3].checked) {
                        if (document.form1.i_pic.value == '') {
                            alert('焦点推荐图片不能为空！')
                            document.form1.i_pic.focus()
                            return
                        }
                    }

                    var econtent = document.getElementById('eWebEditor1').contentWindow
                    econtent.setHTML(econtent.getHTML().replace('allowScriptAccess="always"', ''))
                    var content = document.getElementById('eWebEditor1').contentWindow.getHTML()
                    if (content.split('<img').length - 1 > 30) {
                        alert(
                            '单篇文章您上传插入图片数量不能超过30张，如需上传更多图片可分篇发布！'
                        )
                        return false
                    }

                    if (content.length > 500000) {
                        iCheck++
                        alert(
                            '您所发布的单篇文章的内容代码已大于50万个字符，现已超出允许发布的极限，如需保存，请在编辑框下方把编辑器由设计状态转换为文本状态，对文档中的格式代码进行清理后，再切换为设计状态保存。或请采用数据上传的方式进行发布！'
                        )
                        iCheck++
                        return
                    }

                    //console.log(document.form1)
                    //document.form1.action.value = 'http://gdgp.chinaxinge.com/D_gdgp/save_input.asp'
                    //document.form1.action.value='../D_gdgp/save_input.asp';
                    document.form1.submit()
                }
            }
        }
    }
})()
