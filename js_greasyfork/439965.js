// ==UserScript==
// @name         edusrc粘贴上传
// @namespace    http://l.mo60.cn/
// @version      0.1.2
// @description  edusrc粘贴图片上传
// @author       http://l.mo60.cn/
// @match        https://src.sjtu.edu.cn/add/
// @icon         https://www.google.com/s2/favicons?domain=sjtu.edu.cn
// @run-at document-end
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439965/edusrc%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/439965/edusrc%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

window.onload = function () {
    console.log('author blog http://l.mo60.cn/');
}
$(document).ready(function () {
      var uploadUrl = 'https://src.sjtu.edu.cn/upload-images/';
        var textarea = document.getElementById("id_content");
        var editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: {
            name: 'markdown',
            underscoresBreakWords: false
        },
        theme: "neat",
        indentUnit: 4,
        lineWrapping: true
    });
/*原上传按钮，从原网页复制来的*/
      var PluploadHandler = function( $, plupload ) {
        var self = this;
        this.plupload = plupload;
        this.uploader = new plupload.Uploader({
            runtimes : 'html5,flash',
            browse_button : document.getElementById('upbtn'),
            url : "/upload-images/",
            flash_swf_url : "https://cdnjs.cloudflare.com/ajax/libs/plupload/2.1.9/Moxie.swf",
            filters : {
                max_file_size : '5mb',
                mime_types: [
                    {title : "Image files", extensions : "jpg,jpeg,gif,png,bmp"}
                ]
            },
            headers: {
                'X-CSRFToken': $.AMUI.utils.cookie.get('csrftoken')
            },
            init: {
                Error: function(up, err) {
                    console.log("\nError #" + err.code + ": " + err.message);
                }
            }
        });
        this.uploader.init();
        this.uploader.bind("FilesAdded", function (up, files) {
            console.log("+ handlePluploadFilesAdded");
            up.start();
        });
        this.uploader.bind("FileUploaded", function (up, file, res) {
            var f = JSON.parse(res.response);
            if(f.status == 'success') {
                var filename = f.name.replace(/\]/g, '_');
                var img = "\n![" + filename + "](" + f.url + ")\n";
                editor.replaceSelection(img)
            }
        });
    };
    var pluploadHandler = new PluploadHandler(jQuery, plupload);

    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for(var i = 0; i < arrCookie.length; i++){
            var arr = arrCookie[i].split("=");
            if(cookieName == arr[0]){
                return arr[1];
            }
        }
        return "";
    }
    /*结束*/

        function uploadFile(file) {
        var index = Math.random().toString(10).substr(2, 5) + '-' + Math.random().toString(36).substr(2);
        var fileName = index + '.png';
        var formData = new FormData();
        formData.append('name', fileName);
        formData.append('file', file, fileName);
        $.ajax({
            method: 'post',
            url: uploadUrl,
            data: formData,
            contentType: false,
            processData: false,
            beforeSend:  function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("x-csrftoken", getCookie('csrftoken'));
                },
            success: function (data) {
                if(data['status'] == 'success') {
                    //alert('上传成功!');
                    var file_name=data['name'];
                    var file_path=data['url'];
                     var img = "\n![" + file_name + "](" + file_path + ")\n";
                    editor.replaceSelection(img)
                }
            },
            error: function (error) {
               alert('上传失败');
            }
        });
    }

   document.addEventListener('paste', function (e) {
      var clipboardData = e.clipboardData;
      var items = clipboardData.items;
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          e.preventDefault();
          uploadFile(items[i].getAsFile());
          break;
        }
      }
    });
})
