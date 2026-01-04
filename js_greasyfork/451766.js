// ==UserScript==
// @name          指定网站PDF下载
// @description   保存网站内容图片转换成PDF。
// @version       1.0.0
// @namespace     指定网站PDF下载
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//ow365.cn/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @license       MIT
// @rewritten_script_code javascript
// @downloadURL https://update.greasyfork.org/scripts/451766/%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/451766/%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$(function () {
        init();
	});
})();

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function getBase64Image(img, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
}

function getCanvasBase64(img, name) {
    var image = new Image();
    //至关重要
    image.crossOrigin = '';
    image.src = img;
    image.name = name;
    //至关重要
    var deferred = $.Deferred();
    if (img) {
        image.onload = function () {
            deferred.resolve(getBase64Image(image));//将base64传给done上传处理
            // document.getElementById("container").appendChild(image);

            // console.log(image.name);
        }
        return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
    }
}

function init() {
	var append_html = '<style>'+
        '.pdfbtn {'+
        '	right: 30px;'+
        '	bottom: 30px;'+
        '	width: 80px;'+
        '	line-height: 80px;'+
        '	font-size: 18px;'+
        '	text-align: center;'+
        '	-moz-border-radius: 80px;'+
        '	-webkit-border-radius: 80px;'+
        '	border-radius: 80px;'+
        '	color: #FFF;'+
        '	background: #4E4E4E;'+
        '	position: fixed;'+
        '}'+
        '</style>'+
        '<div class="pdflist" id="container"></div>'+
        '<a href="javascript:void(0);" class="pdfbtn">保存</a>';
    $('body').append(append_html);

    $('.pdfbtn').click(function(){
        var imglist = {
            data:new Array(),
        };

        $('#ctn > div').each(function(index, el) {
            var obj = $(this);
            var src = obj.find('img').attr('src');

            imglist.data[index] = {
                src:src,
                name:index,
            }
            // console.log(index);
        });

        var json = imglist.data;
        var load = 0;

        $('.pdflist').html('');
        $('body').html('');
        $('body').attr('ondragstart', 'return true;');
        $('body').attr('onselectstart', 'return true;');
        $('body').attr('oncontextmenu', 'return true;');
        $('body').attr('style', '');

        $.each(json, function(index, item){
            var src = item.src;
            var name = item.name;
            var imglist = new Array();

            getCanvasBase64(src, name) .then(function (base64) {
                // console.log("方式二》》》》》》》》》",base64);
//                 console.log('base64');
                json[index].base64 = base64;
                load++;

                if(load == json.length) {
                    $.each(json, function(index, item){
                        console.log(item.base64);

                        var base64 = item.base64;
                        var name = item.name;

                        var _img = $('<p><img src="'+ base64 +'" alt="'+ name +'" /></p>');
                        $('body').append(_img);
                    });
                }

                var image = new Image();
                // 解决跨域 Canvas 污染问题
                image.setAttribute("crossOrigin", "anonymous");
                image.src = base64;
                image.name = name;
                image.onload = function () {
                    // 输出图片信息 比如可以获取图片宽高
                    console.log(image.width)
                    console.log(image.height)
                    console.log(image.name);

                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, image.width, image.height);

                    var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据'
                    var a = document.createElement("a"); // 生成一个a元素
                    var event = new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }); // 创建一个单击事件
                    a.download = image.name || "photo"; // 设置图片名称
                    a.href = url; // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
                    sleep(100);
                }
            }, function (err) {
                console.log(err);
            });
        });
    });

    var data = {
        f : '',
        img : '',
        isMobile : '',
        vid : '',
        dk : '',
        ver : '',
        sn : '',
    };

    // data.f = getQueryVariable("furl");
    var getFun = setInterval(function(){
        var count = parseInt($id("PageCount").innerHTML);
        var nowIdx = parseInt($id("PageIndex").innerHTML) - 1;
        var toIdx = nowIdx + 5;

        if($id("PageCount").innerHTML == '') {
            return false;
        }else {
            clearInterval(getFun);
        }

        for (var i = toIdx; i < count; i++) {
            var findEle = $id("p" + i);
            if (findEle == null) {
                var preEle = $id("p" + (i - 1));
                if (preEle != null) {
                    if (isOver(preEle)) {
                        break;
                    }
                }
                var pre = $id("p" + (i - 1));
                var pageData="";
                if (pre != null) {
                    pageData = pre.getAttribute("data-page");
                }
                getHtml(pageData, i, false, false);
            } else {
                if (isOver(findEle)) {
                    break;
                }
            }
        }
    },1000);
}