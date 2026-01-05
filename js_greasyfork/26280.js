// ==UserScript==
// @name         bcy(半次元)打包原图
// @version       1.2.1
// @description   先安装"Zip格式支持"，原图包可从详细页或图片封面下载。
// @author       opentdoor
// @match        http://bcy.net/*
// @match        https://bcy.net/*
// @grant        none
// @namespace https://greasyfork.org/users/92069
// @downloadURL https://update.greasyfork.org/scripts/26280/bcy%28%E5%8D%8A%E6%AC%A1%E5%85%83%29%E6%89%93%E5%8C%85%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/26280/bcy%28%E5%8D%8A%E6%AC%A1%E5%85%83%29%E6%89%93%E5%8C%85%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==
var gl = {
};
 function GetOPath(url)
    {
        if(window.__ssr_data)
        {
            var dic=window.__ssr_data.detail.post_data.multi;
            if(dic){
                let rs=dic.filter((v,i)=>v.path==url);
                if(rs&&rs.length>0){
                 return rs[0].original_path
                }
            }
        }
        return url

    }
(function () {
    'use strict';
   
    function DownLoad(url, progress, callback) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function (e) {
                if (this.readyState == 4) {
                    callback(this.response, this.status);
                }
            };
            xhr.responseType = 'blob';
            xhr.onprogress = function (e) {
                progress(e);
            };
            xhr.send(null);
        } catch (ex) {
            callback(null, 500);
        }
    }
    function urlsToZip(urlFiles, zipName, av) {
        var zipWriter,
            index = 0;
        var writer = new zip.BlobWriter();
        function onError() {
            console.log(arguments);
        }
        function downloadProgress(e) {
            if (e.lengthComputable) {
                av.innerHTML = '正在打包第' + (index + 1) + '个:' + (e.loaded / e.total * 80).toFixed(0) + '%';
            }
        }
        function zipProgress(current, total) {
            av.innerHTML = '正在打包第' + (index) + '个:' + (80 + 20 * current / total).toFixed(0) + '%';
        }
        function zipEnd() {
            zipWriter.close(function (blob) {
                saveFile(blob, zipName);
            });
            av.isdown = false;
            av.innerHTML = '打包带走';
        }
        zip.createWriter(writer, function (wr) {
            zipWriter = wr;
        }, onError);
        function saveFile(blob, filename) {
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var a = document.createElement('a');
                var url = URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                var evt = document.createEvent('MouseEvents');
                evt.initEvent('click', true, true);
                a.dispatchEvent(evt);
                URL.revokeObjectURL(url);
            }
        }
        function nextFile() {
            var file = urlFiles[index];
            DownLoad(file.url, downloadProgress, function (blob, status) {
                index++;
                if (status == 200) {
                    zipWriter.add(file.name, new zip.BlobReader(blob), function () {
                        if (index < urlFiles.length)
                            nextFile();
                        else
                            zipEnd();
                    }, zipProgress);
                } else {
                    file.tryTime = (file.tryTime || 0) + 1;
                    if (file.tryTime < 4) index--;
                    if (!av.oldclick) {
                        av.oldclick = av.onclick;
                    }
                    av.onclick = function () {
                        av.onclick = av.oldclick;
                        if (index < urlFiles.length)
                            nextFile();
                        else
                            zipEnd();
                    };
                    setTimeout(function () {
                        var ff = urlFiles[index];
                        av.innerHTML = '第' + (index + 1) + '个下载失败，点击重试(' + (ff.tryTime || 0) + '次)！';
                    }, 60);
                }
            });
        }
        setTimeout(nextFile, 250);
        ;
    }
    gl.urlsToZip = urlsToZip;
})();
(function () {
    'use strict';
    window.addEventListener('load', function () { //增加firefox支持
        var p = document.querySelectorAll('.img-wrap');
        var title = document.title.replace(/\|.*$/i, '').replace(/(^\s*|\s*$)/gi, '');
        var cn = document.querySelector('.detail-user-info .cut').innerHTML;
        if (cn) title += '-cn_' + cn;
        title = title.replace(/[\\\/\?\<\>\|\*"]/gi, '_');
        var urls = [
        ];
        var imgs = document.querySelectorAll('.img-wrap img');
        var i = 1;
        imgs.forEach(function (v, i) {
            var $this = v;
            var url = GetOPath(v.src)//.replace(/p\d{1,2}\-bcy\.byteimg\.com\/img\/banciyuan/ig, 'img-bcy-qn.pstatp.com').replace('~tplv-banciyuan-w650.image', '');
            var ex = /\.\w+$/i.exec(url);
            var name = title + (i > 9 ? i : '0' + i) + (ex && ex.length ? ex[0]=='.image'?'.jpg':ex[0] : '.jpg');
            urls.push({
                name: name,
                url: url
            });
            i++;
        });
        if (p.length && urls.length) {
            var av = document.createElement('a');
            av.href = 'javascript:;';
            av.innerHTML = '打包带走';
            av.style.width = '250px';
            var appdownload = document.querySelector("article .dm-popover .app-download");
            appdownload.innerHTML = '';
            appdownload.appendChild(av);
            av.onclick = function (e) {
                if (!this.isdown) {
                    this.isdown = true;
                    gl.urlsToZip(urls, title + '.zip', this);
                }
            };
        }
    });
})();
