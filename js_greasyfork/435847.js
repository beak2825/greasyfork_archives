// ==UserScript==
// @name         搜同网插件
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  搜同爬图片小说!
// @author       Aelous
// @match        soutong.men/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setClipboard
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @require     https://cdn.bootcss.com/jszip/3.1.4/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/435847/%E6%90%9C%E5%90%8C%E7%BD%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435847/%E6%90%9C%E5%90%8C%E7%BD%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    (function () {
        let mod = ''
        var type = $('#pt .z a')
        for (let index = 0; index < type.length; index++) {
            if($('#pt .z a:eq(' + (index + 1) + ')').text().indexOf('小说') > -1){
                console.log('小说区')
                mod = 'text'
            }
            else if($('#pt .z a:eq(' + (index + 1) + ')').text().indexOf('图') > -1 ){
                console.log('图片区')
                mod = 'pic'
            }
            
        }

        if( mod === 'pic'){
            var num = document.getElementsByTagName('ignore_js_op').length
            console.log('总共'+ num + '条')
            console.log($('.ts a').text() + $('.ts #thread_subject').text() )
            if(num <= 10){
                $('#thread_subject').after('<button id="pic_download" style="margin-left: 10px;background: #f5d4d4;border-radius: 5px;">下载图片</button>')
            } else {
                var page = parseInt(num / 10) + 1;
                for (let index = page - 1 ; index >= 0 ; index--) {
                    $('#thread_subject').after('<button id="pic_downloads" class = "pic_'+ index +'" style="margin-left: 10px;background: #545151;border-radius: 5px;color: white;">下载图片'+ index +'</button>')
                }
            }
        }else if ( mod === 'text'){
            var innerdiv = '<div class = "myDash" ' + 
            'style="background-color: #E8EFF5;width: 70%;height: 20%;position:fixed;text-align: center;margin-left: 18%;border-radius: 6px;' + 
            '">' + 
            '<textarea id="texts" rows="5" cols="121" style = "width: 98%;overflow: auto;word-break: break-all;" placeholder="点击帖子内容获取小说信息"></textarea>' + 
            '<button id="textDownload" style="margin-left: 10px;border-radius: 5px;position: relative;bottom: -16px;">下载小说</button>' + 
            '<button id="clearCache" style="margin-left: 10px;border-radius: 5px;position: relative;bottom: -16px;">清理缓存</button>' + 
            '</div>'
            $('#nv').hide()
            $('#toptb').before(innerdiv)
            $('.t_f').prepend('<button id="add" style="margin-left: 10px;">选择添加该节点</button>')
        }
    })();

    (function () {  
        var hasText = localStorage.getItem('texts')
        $('#texts').text(hasText)
        var hight = $('#texts')[0].scrollHeight
        console.log(hight);
        $('#texts').scrollTop(hight);
    })();

    $('body').on('click', '#add', function () {
        $(this).parent().children('span').remove()
        $(this).parent().children('font').remove()
        var hasText = $('#texts').text()
        var text = $(this).parent().text()
        text = text.replace('选择添加该节点','')
        hasText = hasText + text
        $('#texts').text(hasText)
        localStorage.setItem('texts',hasText)
    });

    $('body').on('click', '#clearCache', function () {
        localStorage.clear()
        var hasText = localStorage.getItem('texts')
        $('#texts').text(hasText)
    });

    $('body').on('click', '#textDownload', function () {
        var title = $('.ts').text().replace(/[\r\n]/g,"")
        console.log(title);
        var text = $('#texts').text()
        if(text =='' || text ==null){
            alert('未下载任何东西 请重新选择')
        } else {
            exportRaw(title,text)
            localStorage.clear()
            var hasText = localStorage.getItem('texts')
            $('#texts').text(hasText)
        }
    });

    $('body').on('click', '#pic_download', function () {
        down(0,0)
    });

    $('body').on('click', '#pic_downloads', function () {
        var className = $(this).attr("class")
        className = className.replace('pic_','')
        console.log(className);
        down(className * 10 - 1,className * 10 + 10)
    });

    $('body').on('click', '#thread_subject', function () {
        copyToClipboard($('.ts a').text() + $('.ts #thread_subject').text())
    });

    function down(n,m){
        var imgs = document.images;
        var num = 1;
        for (var i = 0; i < imgs.length;i++){
            var id = imgs[i].id
            if(id.indexOf("aimg_") != -1){
                var src = imgs[i].src
                if(src!=''){
                  let xhr = new XMLHttpRequest()
                  let fileName = num + '.jpg' // 文件名称 
                  xhr.open('GET', src, true)
                  xhr.responseType = 'arraybuffer'
                  xhr.onload = function() {
                    if (this.status === 200) {
                      let type = xhr.getResponseHeader('Content-Type')
    
                      let blob = new Blob([this.response], {type: type})
                      if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        /*
                         * IE workaround for "HTML7007: One or more blob URLs were revoked by closing
                         * the blob for which they were created. These URLs will no longer resolve as 
                         * the data backing the URL has been freed." 
                         */
                        window.navigator.msSaveBlob(blob, fileName)
                      } else {
                        let URL = window.URL || window.webkitURL
                        let objectUrl = URL.createObjectURL(blob)
                        if (fileName) {
                          var a = document.createElement('a')
                          // safari doesn't support this yet
                          if (typeof a.download === 'undefined') {
                            window.location = objectUrl
                          } else {
                            a.href = objectUrl
                            a.download = fileName
                            document.body.appendChild(a)
                            a.click()
                            a.remove()
                          }
                        } else {
                          window.location = objectUrl
                        }
                      }
                    }
                  }
                  if( n == 0 && m == 0){
                    xhr.send()
                  }
                  if(m != 0 && m >num && n < num){
                      xhr.send()
                  }
                  if( n!=0 && n < num && m == 0) {
                     xhr.send()
                  }
                  num = num + 1
                }
            }
        }
    }

    function fakeClick(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", false, false);
        obj.dispatchEvent(ev);
      }

      function exportRaw(name, data) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fakeClick(save_link);
      } 

    function copyToClipboard(s){
        if(window.clipboardData){
            window.clipboardData.setData('text',s);
        }else{
            (function(s){
                document.oncopy=function(e){
                    e.clipboardData.setData('text',s);
                    e.preventDefault();
                    document.oncopy=null;
                }
            })(s);
            document.execCommand('Copy');
        }
    }
})();