// ==UserScript==
// @name         gb688下载
// @namespace    https://github.com/lzghzr/TampermonkeyJS
// @version      2.0.0
// @author       lzghzr, chorar, chengliang4810
// @description  下载gb688.cn上的国标文件
// @require     https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require     https://cdn.bootcss.com/jspdf/1.3.4/jspdf.debug.js
// @require     https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @match        *://*.gb688.cn/bzgk/gb/showGb*
// @match        *://*.samr.gov.cn/bzgk/gb/showGb*
// @connect     c.gb688.cn
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456172/gb688%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456172/gb688%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';

    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">`)

    setTimeout(function (){
        layer.msg('下载前请将网页滑动到最后（加载所有PDF内容），点击下载按钮开始下载', {
            time: 0 //不自动关闭
            ,offset: 'r'
            ,btn: ['下载', '关闭']
            ,yes: function(index){
                exportPdf()
            }
        });
    }, 1000);


//导出pdf
    function exportPdf() {
        //克隆节点，默认为false，不复制方法属性，为true是所有复制。
        var height = $("#viewer").height();
        var width = $("#viewer").width();
        var cloneDom = $("#viewer").clone(true);
        console.log("height", height);
        console.log("width", width);

        //设置克隆节点的css属性，由于以前的层级为0，咱们只须要比被克隆的节点层级低便可。

        cloneDom.css({
            "background-color": "white",
            "opacity": "0",
            "z-index": "-9999",
            "height": height,
            "width": width
        });

        //将克隆节点动态追加到body后面。

        $("body").append(cloneDom);
        html2canvas(
            document.getElementsByClassName("pdfViewer")[1],
            {
                dpi: 172,//导出pdf清晰度
                useCORS:true,
                allowTaint: true,
                taintTest: false,
                //height:document.getElementById("detailData").scrollHeight,
                //windowHeight:document.getElementById("detailData").scrollHeight,
                //width:document.getElementById("detailData").scrollWidth,
                //背景设为白色（默认为黑色）
                background: "#FFFFFF",
                onrendered: function (canvas) {

                    console.log("开始生成PDF");

                    var contentHeight = canvas.height;
                    var contentWidth = canvas.width;


                    //一页pdf显示html页面生成的canvas高度;
                    var pageHeight = contentWidth / 595.28 * 841.89;
                    //未生成pdf的html页面高度
                    var leftHeight = contentHeight;
                    //pdf页面偏移
                    var position = 0;
                    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    var imgWidth = 595.28;
                    var imgHeight = 595.28/contentWidth * contentHeight;

                    var pageData = canvas.toDataURL();
                    console.log(pageData);

                    var pdf = new jsPDF('', 'pt', 'a4');
                    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                    //当内容未超过pdf一页显示的范围，无需分页
                    if (leftHeight < pageHeight) {
                        pdf.addImage(pageData, 'JPEG', 30, 0, imgWidth, imgHeight );
                    } else {
                        while(leftHeight > 0) {
                            pdf.addImage(pageData, 'JPEG', 30, position, imgWidth, imgHeight)
                            leftHeight -= pageHeight;
                            position -= 841.89;
                            //避免添加空白页
                            if(leftHeight > 0) {
                                pdf.addPage();
                            }
                        }
                    }
                    var d = new Date();
                    var month = d.getMonth();
                    month = month+1 >12 ? 1:month+1;
                    var time = ""+d.getFullYear()+(("0"+month).slice(-2))+d.getDate()+(("0"+d.getHours()).slice(-2))+(("0"+d.getMinutes()).slice(-2))+(("0"+d.getSeconds()).slice(-2));
                    pdf.save(time+'.pdf');
                }
            }
        )
    }


})();
