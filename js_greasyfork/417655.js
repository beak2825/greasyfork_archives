// ==UserScript==
// @name         UI中国原图下载
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  UI中国,UI中国原图下载（ui.cn）
// @icon         https://www.ui.cn/Public/img/favicon.ico
// @author       sertraline
// @match       *://www.ui.cn/detail/*
// @downloadURL https://update.greasyfork.org/scripts/417655/UI%E4%B8%AD%E5%9B%BD%E5%8E%9F%E5%9B%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/417655/UI%E4%B8%AD%E5%9B%BD%E5%8E%9F%E5%9B%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict'
  console.log('\n'.concat(' %c UI中国原图下载').concat(' %c @sertraline ', '\n', '\n'), 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');
  var downloadBtnPic = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACGElEQVRYR+2YPW4VMRSFv1OygDQgIYoIFgALIGWAQEUaCmgACfq0hJoaJKCBgoZUEEhLFgALAFEgpKTJAigPcvQm8pt4Ys8knveKZ2mK8c+933iu7esj5rxozvlIAtq+AVwAzo/0AfvAnqSdtr9jgLa/A1dHAmu7+SHpWlw5BWj7I3B3RnCN2y1J683LEaDtW8D2jOEa92uSvoSXGPAJ8HJOAJ9KetUGfAZsJgAfA78qgV8GXidsb0p6XgK4LmmrEtyhWdsh5kPsx6UYcEXSbmXA68C3qoC2l4F7LScfJP3OfZztUQCdApGUPamqA3Y4aHizIbIAXMxgEyy2Uxv10BhaxGDnDNi+AtwBzkVbS+qIDM1x/T/gk6Sf8ZZUZRUPTMum0qgotOps1D0hk3CTs7gO4MR4SYLbCVcdsADyRLhRAE+AzMKNBpiALII7C8BtSbdzKVO0Ig8Tz/jSkxtr+zOwNjQfDOP+TJ7Gxo6kFznHqXbbG8Bq1HYJCE+7FGfUXRxHBkpBO1L7rP34Vtd1aUoZ2ZW0Ugo3ibWQ1oc9r6ScegYXgKXXzq7fsS8piEvFxfZeDzHq1L84gL0D3hcS3gceFPYN3ZKAD4E3PYzU7PpI0tvgIF7FQRP8WtNrD9s3G62wLb/NUhts+Kc0wpSAWZJC9ZiMXl2PneFdEnDQCi8CS73MD+98APxtNMHYTFaaGO7zbEbOPeB/nsCEOGzbyK8AAAAASUVORK5CYII=" />`
  var imgList = $('#work_img_list a')
  $('head').append($(`<style>
                     .work_img_list>a:hover .work_img_download_btn{
                        display:block
                     }
                     .work_img_download_btn{
                        display:none;
                        position: absolute;
                        right: -${$('.work_img_list').css('marginRight')};
                        bottom: 0;
                        height: 50px;
                        width: 50px!important;
                        background: rgba(0,0,0,.5);;
                        text-align: center;
                     }
                     .work_img_download_btn:hover img{
                        opacity:0.5;
                     }
                     .work_img_download_btn img{
                        height:24px!important;
                        margin:0!important;
                        padding:0!important;
                        position: absolute!important;
                        left:50%!important;
                        top:50%!important;
                        transform:translate(-50%,-50%)!important
                     }
                     .download-all{
                        color:rgb(255, 85, 66)!important;
                        border-color:rgb(255, 85, 66)!important
                     }
                     </style>`))
    function getFileExtendingName(filename) {
        var reg = /\.[^\.]+$/
        var matches = reg.exec(filename)
        if (matches) {
            return matches[0]
        }
        return ''
    }
    function downloadImg(url, name) {
        name = name || `ui_cn_${new Date().getTime()}${getFileExtendingName(url)}`
        var img = new Image()
        img.onload = function() {
            var canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            var ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            canvas.toBlob((blob) => {
                var blobUrl = window.URL.createObjectURL(blob)
                var a = document.createElement('a')
                a.href = blobUrl
                a.download =name
                a.click()
            })
        }
        img.src = url
        img.setAttribute('crossOrigin', 'Anonymous')
    }
    var imgArr=[];
    for (var i = 0; i < imgList.length; ++i) {
        var _itemDom = imgList[i]
        var imgUrl = $(_itemDom).children().attr('src').split('?')[0]
        imgArr.push(imgUrl)
        var _itemDownloadDom=$(`<div class="work_img_download_btn" data-url="${imgUrl}">${downloadBtnPic}</div>`)
        $(_itemDom).append(_itemDownloadDom)
        _itemDownloadDom.on('click',function(e){
            e.stopPropagation();
            var _url=$(this).data('url')
            downloadImg(_url)
        })
    }
    console.log(`已检测到：${imgArr.length}张图片可下载`)
    var downloadAllDom=$(`<a  href="javascript:;" class="more download-all">下载所有</a>`)
    $('.list_self').append(downloadAllDom)
    downloadAllDom.on('click',function(e){
        imgArr.forEach(item=>downloadImg(item))
    })
})()
