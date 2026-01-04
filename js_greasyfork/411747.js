// ==UserScript==
// @name         超星PPT功能增强
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  PPT在线阅览增强，允许下载原文件
// @author       Priate
// @match        *://*.chaoxing.com/mycourse/studentstudy?*
// @match        *://*.chaoxing.com/knowledge/cards?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/411747/%E8%B6%85%E6%98%9FPPT%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411747/%E8%B6%85%E6%98%9FPPT%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var get_lazy_element = function(selector, func){
        var interval_temp = setInterval(function() {
            if (document.querySelectorAll(selector).length != 0) {
                clearInterval(interval_temp)
                func()
            }
        }, 500)
        }

    if (window.location.pathname.match(/.*mycourse\/studentstudy.*/)) {
        get_lazy_element('.goback', function(){
            $($('.goback').get(0)).append('<button id="play_ppt" style="cursor: pointer">播放PPT</button><button id="download" style="background-color: pink;cursor: pointer">直接下载</button>')
            $('#play_ppt').click(function(){
                $('.documentImg').each(function(index, value){console.log(value)})
                var iframe = document.getElementsByTagName('iframe')[0];
                console.log(iframe.contentWindow.location.href)
                open(iframe.contentWindow.location.href)
            })
            $('#download').click(function(){
                var iframe = document.getElementsByTagName('iframe')[0];
                var iframe_document = iframe.contentWindow.document
                var file_id = iframe_document.getElementsByTagName('iframe')[0].getAttribute('objectid')
                var download_herf = 'http://d0.ananas.chaoxing.com/download/' + file_id
                window.open(download_herf)
            })
        })
    }

    if (window.location.pathname.match(/.*knowledge\/cards.*/) && self == top) {
        document.querySelector('.wrap').setAttribute('style', 'width: 80%')
        var iframe = document.getElementsByTagName('iframe')[0];
        iframe.setAttribute('style', 'width: 100%')
        var interval_temp = setInterval(function() {
            var iframe_doc = iframe.contentWindow.document
            var imgs = iframe_doc.querySelectorAll('.documentImg')
            if (imgs.length != 0) {
                document.querySelector('.wrap').innerHTML = document.querySelector('.wrap').innerHTML + '<button id="get_link">获取图片链接</button><button id="show_pic">显示所有图片</button><button id="set_shell">wget下载</button><button id="set_python">python下载</button><div id="show"></div>'
                document.querySelector('#show_pic').onclick = function(){
                    var all = parseInt(iframe_doc.querySelector('.all').innerText)
                    var img_href = imgs[0].src.match(/(.*)\/(.*)/)[1] + '/'
                    document.querySelector('#show').innerHTML = ""
                    for(var temp = 1; temp <= all; temp ++){
                        document.querySelector('#show').innerHTML = document.querySelector('#show').innerHTML +
                            '<img class="" index="1" src="' + img_href + temp + '.png" style="width: 100%;">'
                    }
                }
                document.querySelector('#get_link').onclick = function(){
                    var all = parseInt(iframe_doc.querySelector('.all').innerText)
                    var img_href = imgs[0].src.match(/(.*)\/(.*)/)[1] + '/'
                    document.querySelector('#show').innerHTML = ""
                    for(var temp = 1; temp <= all; temp ++){
                        document.querySelector('#show').innerHTML = document.querySelector('#show').innerHTML +
                            img_href + temp + '.png' + '<br>'
                    }
                }

                document.querySelector('#set_shell').onclick = function(){
                    var all = parseInt(iframe_doc.querySelector('.all').innerText)
                    var img_href = imgs[0].src.match(/(.*)\/(.*)/)[1] + '/'
                    document.querySelector('#show').innerHTML = `
                    <br><br><br>
                    <code>
                    for i in {1..`+ all + `}<br>
					do<br>
					&nbsp&nbsp&nbsp&nbspwget "` + img_href + `$i.png"<br>
					done<br>
					</code><br><br><br>
					此脚本将会下载所有图片，下载完成后可用PDF工具将图片转为PDF方便阅读
					<br><br><br>
                    `
                }
                document.querySelector('#set_python').onclick = function(){
                    var all = parseInt(iframe_doc.querySelector('.all').innerText)
                    var pdf_name = JSON.parse(iframe.getAttribute('data')).name.match(/(.*)\.(.*)/)[1]
                    var img_href = imgs[0].src.match(/(.*)\/(.*)/)[1] + '/'
                    document.querySelector('#show').innerHTML = `
                    <br><br><br>
                    <code>
                    <br>from PIL import Image
					<br>from io import BytesIO
					<br>import requests,os
					<br>
					<br>imgHref = '` + img_href + `'
					<br>pdfFilePath = "` + pdf_name + `.pdf"
					<br>imgList = []
					<br>for page in range(1, ` + (all + 1) +`):
					<br>&nbsp&nbsp&nbsp&nbspprint('正在进行下载第' + str(page) + '页，共` + all +`页')
					<br>&nbsp&nbsp&nbsp&nbspresponse = requests.get(imgHref + str(page) + '.png').content
					<br>&nbsp&nbsp&nbsp&nbspBytesIOObj = BytesIO()
					<br>&nbsp&nbsp&nbsp&nbspBytesIOObj.write(response)
					<br>&nbsp&nbsp&nbsp&nbspimg = Image.open(BytesIOObj).convert( "RGB" )
					<br>&nbsp&nbsp&nbsp&nbspimgList.append(img)
					<br>imgList[0].save(pdfFilePath, "pdf", save_all=True, append_images=imgList[1:])
					</code><br><br><br>
					运行前请先安装好必要的库，可以直接生成一个pdf文件，文件将保存至运行命令的文件夹下
					<br><br><br>
                    `
                }
                clearInterval(interval_temp)
            }
        }, 500)
        }
})();