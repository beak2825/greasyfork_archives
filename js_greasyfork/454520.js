// ==UserScript==
// @name         雨课堂课件导出为pdf（无后端版本）
// @namespace    http://tampermonkey.net/
// @version      2
// @description 雨课堂课件ppt导出为pdf,详见https://github.com/ShevonKuan/yuektang_ppt2pdf
// @author       shevon
// @match        https://changjiang.yuketang.cn/web/print
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.debug.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454520/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%BE%E4%BB%B6%E5%AF%BC%E5%87%BA%E4%B8%BApdf%EF%BC%88%E6%97%A0%E5%90%8E%E7%AB%AF%E7%89%88%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/454520/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%BE%E4%BB%B6%E5%AF%BC%E5%87%BA%E4%B8%BApdf%EF%BC%88%E6%97%A0%E5%90%8E%E7%AB%AF%E7%89%88%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";
    setTimeout(function () {
        console.log("开始执行");
    }, 3000);
    $(".controls-btns").append(
        '<p class="print fuckyuketang2" title="打印">导出课件</p>'
    );
    // loadImage
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            var data;
            img.setAttribute("crossOrigin", "Anonymous");
            img.src = url;
            img.onError = function () {
                throw new Error('Cannot load image: "' + url + '"');
            };
            img.onload = function () {
                var canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                // Grab the image as a jpeg encoded in base64, but only the data
                data = canvas
                    .toDataURL("image/jpeg")
                    .slice("data:image/jpeg;base64,".length);
                // Convert the data to binary form
                data = atob(data);

                document.body.removeChild(canvas);
                resolve(data);
            };
        });
    }
    async function download() {
        var imgData = new Array();
        var imgList = new Array();
        $(".fuckyuketang2").html("正在获取图片信息");
        $.each($("img.pptimg"), function () {
            imgList.push($(this).attr("src"));
        });
        for (var i = 0; i < imgList.length; i++) {
            var link = imgList[i];
            $(".fuckyuketang2").html("获取第" + i + "张图片");
            await loadImage(link).then((data) => {
                imgData.push(data);
            });
        }

        var height = $("img.pptimg")[0].height;
        var width = $("img.pptimg")[0].width;

        $(".fuckyuketang2").html("创建pdf");
        var doc = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [width, height],
        });

        const output = $(document).attr("title") + ".pdf";
        let idx = 0;
        imgData.forEach((e) => {
            idx++;
            $(".fuckyuketang2").html("合并第" + idx + "张图片");
            doc.addImage(e, "JPG", 0, 0, width, height);
            if (idx < imgData.length) {
                doc.addPage();
            }
        });
        $(".fuckyuketang2").html("导出课件");
        doc.save(output);
        // };
    }
    $(".fuckyuketang2").on("click", function () {
        download();
    });
})();
