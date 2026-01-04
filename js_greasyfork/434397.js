// ==UserScript==
// @name            ASIAN SISTER写真下载
// @name:en         ASIAN-SISTER-Downloader
// @namespace       https://blog.grayzhao.tk/
// @supportURL      https://github.com/zhy201810576/ASIAN-SISTER-Download
// @version         0.0.1-alpha
// @license         Apache License 2.0
// @description     在ASIAN SISTER写真网站下载福利姬的图片
// @description:en  Download the photo on the ASIAN SISTER website
// @author          GrayZhao
// @match           https://asiansister.com/*
// @icon            https://www.google.com/s2/favicons?domain=asiansister.com
// @require         https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/434397/ASIAN%20SISTER%E5%86%99%E7%9C%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/434397/ASIAN%20SISTER%E5%86%99%E7%9C%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDLButton(){// 在页面添加下载按钮
        $(".second_contant").append("<div id='downloadDiv' style='margin-left: 5px'><button id='downloadBtn' type='button'>下载</button></div>");
        $('#downloadBtn').css({
            'color': '#EDEDED',
            'font-size': '20px',
            'outline': 'none',
            'border': 'none',
            'background-color': '#656565',
            'line-height': '1.5',
            'cursor': 'pointer',
            'height': '38px',
            'width': '68px',
            'text-align': 'center',
            'border-radius': '12px',
            'box-shadow': '#404040 0px 6px 0px',
            'margin-top': '0px',
            'transition': 'color 0.6s, box-shadow 0.6s, margin-top 0.6s',
        });
        $('#downloadBtn').hover(function(){
            $('#downloadBtn').css('color', '#ff0066');
            $('#downloadBtn').css('margin-top', '3px');
            $('#downloadBtn').css('box-shadow', '#404040 0px 3px 0px');
        },function(){
            $('#downloadBtn').css('color', '#EDEDED');
            $('#downloadBtn').css('margin-top', '0px');
            $('#downloadBtn').css('box-shadow', '#404040 0px 6px 0px');
        });
    }

    function getImgInfo(){
        /**
         * 获取页面中图片的真实链接
         * @return {dict} 存放压缩包文件名和图片真实链接列表的字典容器
         */
        var imageArr = new Array();
        var title = $(".second_contant h1").text();
        $(".showMiniImage").each(function(i){
            var originURL = $(this).attr("dataurl");
            var imageURL = window.location.protocol + "//" + window.location.host + "/" + originURL.replace("imageimages", "images");
            imageArr.push(imageURL);
        });
        var dict = {"title": title, "imageArr": imageArr};
        return dict;
    }

    function len(arr){// 获取列表长度
        var num = 0;
        for(let val in arr){
            num++;
        };
        return num;
    }

    function imageOfBase64(image, callback){
        /**
         * 将图片转换成Base64格式
         * @param {image} 图片的真实链接
         * @param {callback} 回调函数
         */
        var canvas = document.createElement("canvas");
        var img = new Image();
        // 先设置图片跨域属性
        img.setAttribute("crossOrigin",'anonymous')
        // 再给image赋值src属性，先后顺序不能颠倒
        img.src = image;
        img.onload = function(){
            // 设置canvas宽高等于图片实际宽高
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.getContext("2d").drawImage(img,0,0);
            var dataURL=canvas.toDataURL();// 使用canvas获取图片的base64数据
            callback?callback(dataURL):null; // 调用回调函数
        };
    }

    function zipImage(fileName, Data){
        /**
         * 打包图片到zip
         * @param {fileName} 压缩包的文件名
         * @param {Data} 存放图片真实链接的列表容器
         */
        var zip = new JSZip();// *****创建实例，zip是对象实例
        var file_name = fileName + ".zip";
        var imageArr = Data;
        // 显示进度
        $("#downloadDiv").text("正在搜集图片...");
        for(let i=0; i<imageArr.length; i++){
            imageOfBase64(imageArr[i], function(dataURL){
                //对获取的图片base64数据进行处理
                var img_arr = dataURL.split(',');
                zip.file(String(i+1)+'.jpg',img_arr[1],{base64: true});// 根据base64数据在压缩包中生成jpg数据
				var ziplength = len(zip.files);
				if(ziplength == imageArr.length){// 当所有图片都已经生成打包并保存zip
                    // 显示进度
                    $("#downloadDiv").text("正在打包图片...");
					zip.generateAsync({type:"blob"}).then(function(content){
                        // 显示进度
                        $("#downloadDiv").text("图片打包完成...");
						saveAs(content, file_name);
					})
				}
            });
        };
    }

    $(document).ready(function(){
        addDLButton();
        $('#downloadBtn').on("click", function(){
            var dict = getImgInfo();
            zipImage(dict.title, dict.imageArr);
        })
    })
})();