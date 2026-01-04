// ==UserScript==
// @name         yupoo图片批量下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yupoo图片批量下载!
// @author       LaYa
// @match        https://x.yupoo.com/photos/hanchao666/albums/*
// @icon         https://www.google.com/s2/favicons?domain=yupoo.com
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT LICENSE
// @downloadURL https://update.greasyfork.org/scripts/469611/yupoo%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/469611/yupoo%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('.showalbumheader__download').text("啊军批量下载").attr('href', "javascript:#").click(function() {
        beginDownloadImg()
    })

    function beginDownloadImg() {
        var packName = $('.showalbumheader__gallerydec').find('h2').find('span').eq(0).attr('data-name');
        if (packName) {
            packName = packName.split(" ");
            packName = packName[0] + packName[1] + packName[2];
        }
        var len = $('.image__imagewrap').length;
        if (len > 0) {
            var zip = new JSZip();
            var img = zip.folder(packName);
            $('.image__imagewrap').each((index, item) => {
                if ($(item).find('img').length > 0) {
                    var imgUrl = $(item).find('img').eq(0).attr("data-path");
                    console.log("https://photo.yupoo.com" + imgUrl);

                    GM_xmlhttpRequest({
                        method: "GET",
                        url:"https://photo.yupoo.com" + imgUrl,
                        headers: {
                            referer: 'https://x.yupoo.com/'
                        },
                        responseType: "blob",
                        onload: function(response){
                            console.log("请求成功");
                            var blob=new Blob();
                            blob=response.response;
                            blobToDataURI(blob, function(data) {
                                var filename = imgUrl.substr(imgUrl.lastIndexOf("/") + 1);
                                img.file(filename, data.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), {base64: true});
                            })
                        },
                        onerror: function(response){
                            console.log("请求失败");
                        }
                    });

                    /*$.ajax({
                    headers: {
                        referer: 'https://x.yupoo.com/'
                    },
                    url : "https://photo.yupoo.com" + imgUrl,
                    type : "get",
                    data:{
                    },
                    success : function(data){
                        img.file("smile.gif", data, {base64: true});
                    }
                });*/

                    //zip.file("Hello.txt", "Hello World\n");
                }
            })
            setTimeout(() => {
                downloadImgZip(zip, img, len, packName);
            }, 500);
        } else {

        }
    }



/**
 *
 * blob二进制 to base64
 **/
function blobToDataURI(blob, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    }
    reader.readAsDataURL(blob);
}
    function arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }
    function downloadImgZip(zip, img, num, packName) {
        setTimeout(() => {
            var imgCount = Object.getOwnPropertyNames(img.files).length || 0;
            if (num == imgCount - 1) {
                zip.generateAsync({type:"blob"})
                    .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, packName + ".zip");
                });
            } else {
                console.log("等待图片下载完毕");
                downloadImgZip(zip, img, num, packName);
            }

        }, 500)
    }
})();