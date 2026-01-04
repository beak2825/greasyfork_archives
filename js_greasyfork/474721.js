// ==UserScript==
// @name         logoExportScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Find the svg tag in your website and add an export button！
// @author       Hubery
// @match        *://www.logosc.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/canvasjs/1.7.0/canvasjs.min.js
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474721/logoExportScript.user.js
// @updateURL https://update.greasyfork.org/scripts/474721/logoExportScript.meta.js
// ==/UserScript==

// 导出SVG为文件
function exportSVG(svgContent, fileName) {
  var blob = new Blob([svgContent], { type: 'image/svg+xml' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
// 导出为png
function exportSVGToPNG(svgElement, scaleFactor=2) {
    var width = svgElement.clientWidth * scaleFactor;
    var height = svgElement.clientHeight * scaleFactor;
    // 绘制 SVG 到画布
    var svgData = new XMLSerializer().serializeToString(svgElement);
    // 创建一个新的Image对象
    var image = new Image();
    image.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    // 当图像加载完成时
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');

        // 在画布上绘制图像
        context.drawImage(image, 0, 0);

        // 导出画布为PNG并下载
        GM_download(canvas.toDataURL('image/png'), 'export.png');
    };

}

function identifyDivs($) {
  $('.card.azoomIn').each(function() {
    var $div = $(this);
    if (!$div.attr('selected')) {
      // 做一些你想要的操作，例如添加selected属性后的样式修改
      $div.attr('selected', 'true');
     // 添加按钮
      var $svgButton = $('<button>').text('下载svg');
      $svgButton.css({
        color: 'white',
        backgroundColor: '#1677ff',
        fontSize: '14px',
        height: '32px',
        padding: '4px 15px',
        borderRadius: '6px',
        border: 'none',
        'margin-left': '10px',
      });

      // 添加点击事件处理程序
      $svgButton.click(function() {
        console.log($(this).text()); // 打印当前按钮的内容
        var $svg = $div.find('.svg-card svg');
        if ($svg.length > 0) {
          var svgContent = $svg[0].outerHTML
          exportSVG(svgContent, 'svg_file.svg');
        }
      });
      $div.prepend($svgButton);


      var $pngButton = $('<button>').text('下载png');
      $pngButton.css({
        color: 'white',
        backgroundColor: '#48ce15',
        fontSize: '14px',
        height: '32px',
        padding: '4px 15px',
        borderRadius: '6px',
        border: 'none'
      });
         // 添加点击事件处理程序
      $pngButton.click(function() {
        var $svg = $div.find('.svg-card svg');
        if ($svg.length > 0) {
          // var svgContent = $svg[0].outerHTML
           var svgElement = $svg[0]
           var scaleFactor = $("#scaleFactor").val()
           exportSVGToPNG(svgElement, scaleFactor);
        }
      });
       $div.prepend($pngButton);
    }
  });
}

function showDownloadButton($){
     var button = $('<button>显示下载</button>');
    // 设置按钮的 CSS 样式
    button.css({
        color: 'white',
        backgroundColor: '#16baaa',
        fontSize: '14px',
        position: 'fixed',
        top: '55%',
        left: '10px',
        height: '32px',
        borderRadius: '6px',
        border: 'none',
        padding: '4px 15px',
        'transform': 'translateY(-50%)',
    });
     button.click(function(){
          identifyDivs($)
     })
     $('body').append(button);
     //添加png比例
    var inputDiv =$('<div class="InputBox"><label for="factor">png倍数：</label><input type="number" value=1 id="scaleFactor" style="height: 22px;width: 55px; line-height: 1.3rem; line-height: 22px; border-width: 1px; border-style: solid; background-color: #fff; color: rgba(0,0,0,.85); border-radius: 2px;" step="0.1"></div>')
    inputDiv.css({
        fontSize: '14px',
        position: 'fixed',
        top: '60%',
        left: '10px'
    })
     // 将按钮添加到 body 元素中
    $('body').append(inputDiv);
}

function removeWatermarklayer($) {
     // 创建按钮元素
    var button = $('<button>去水印</button>');

    // 设置按钮的 CSS 样式
    button.css({
        color: 'white',
        backgroundColor: '#16baaa',
        fontSize: '14px',
        position: 'fixed',
        top: '50%',
        left: '10px',
        height: '32px',
        borderRadius: '6px',
        border: 'none',
        padding: '4px 15px',
        'transform': 'translateY(-50%)',
    });
    button.click(function(){
       $(".watermarklayer").remove()
    })
    // 将按钮添加到 body 元素中
    $('body').append(button);
}

(function($) {
    'use strict';
    removeWatermarklayer($);
    showDownloadButton($);
    // setInterval(function() {identifyDivs(jQuery);}, 2000);
    // Your code here...
})(jQuery);