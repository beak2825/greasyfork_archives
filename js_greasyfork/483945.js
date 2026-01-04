// ==UserScript==
// @name              北师硕博论文下载| 北师大毕业论文下载
// @icon              https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMlh6QVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5acce17eb597998f3d1072d536fcdba41a0e8fde/%E5%9B%BE%E7%89%872.png
// @version           1.1.6
// @namespace         https://bnu.edu.cn
// @description       本程序仅因北师大在线pdf文档无法在线标记而制作，严格禁止下载文件外传，请务必配合
// @author            None 佚名
// @antifeature       需要登录图书馆论文版权系统才能导出PDF
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.debug.js
// @require           https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @match             *://etdlib.bnu.edu.cn/read/*
// @license           Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/483945/%E5%8C%97%E5%B8%88%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%7C%20%E5%8C%97%E5%B8%88%E5%A4%A7%E6%AF%95%E4%B8%9A%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483945/%E5%8C%97%E5%B8%88%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%7C%20%E5%8C%97%E5%B8%88%E5%A4%A7%E6%AF%95%E4%B8%9A%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    console.log('Thesis helper loaded');
    'use strict';
    $(function () {
        console.log('Thesis helper loaded');
        function addbutton() {
            // 页面增加下载按钮
            var topElement = document.querySelector('.pdf-top-con');
            // 添加toolif
            var newGroup = document.createElement('div');
            newGroup.setAttribute('class', 'toolbar-lf');
            // 添加分隔符
            var fgElement = document.createElement('div');
            fgElement.setAttribute('class', 'toolbar-separator');
            // 添加下载button
            var newAnchorElement = document.createElement('a');
            newAnchorElement.setAttribute('class', 'downloadbutton');
            newAnchorElement.setAttribute('onclick', 'download();');
            var newParagraphElement = document.createElement('p');
            newParagraphElement.innerHTML = '📩 下载PDF';
            newAnchorElement.appendChild(newParagraphElement);
            topElement.appendChild(newGroup);
            newGroup.appendChild(fgElement);
            newGroup.appendChild(newAnchorElement);
            topElement.appendChild(newGroup);
        }

        // 显示提示的功能
        function showtoast(msg, duration = 3000) {
            var m = document.createElement('div');
            m.innerHTML = msg;
            m.setAttribute('id', 'msg');
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(() => {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(document.querySelector("#msg")) }, d * 1000);
            }, duration);
        }

        const Controllerdocs = {
            // PDF 合并功能进度展示代码
            addStyle: function (data, id = null) {
                var addStyle = document.createElement('style');
                addStyle.textContent = data;
                addStyle.type = 'text/css';
                addStyle.id = id;
                var doc = document.head || document.documentElement;
                doc.appendChild(addStyle);
            }
        }
        // 下载PDF按钮的UI设计
        var css = `
        .downloadbutton {color: black;transition: color 0.3s ease;}
        .downloadbutton:hover {color: orange;rgb(255,122,0)}`;
        const addButtonStyle = Controllerdocs.addStyle(css);
        // 合并pdf过程中的UI
        async function addProgressBar() {
            return new Promise((resolve) => {
                var DownloadElement = document.querySelector('.toolbar-lf:last-child');
                var newDiv = document.createElement('div');
                newDiv.setAttribute('class', 'progress_show');
                var newProgress = document.createElement('progress');
                newProgress.setAttribute('max', '100');
                newProgress.setAttribute('value', '0');
                newProgress.setAttribute('id', 'pg');
                newDiv.appendChild(newProgress);
                DownloadElement.appendChild(newDiv);
                var css_progress = `#pg {width:78px;height:16px}`
                Controllerdocs.addStyle(css_progress, "pg_style");
                resolve('进度条加载成功');
            })
        }
        function removeProgressBar() {
            var progressDiv = document.querySelector('.progress_show');
            if (progressDiv) {
                progressDiv.parentNode.removeChild(progressDiv);
            } else {
                pass;
            }
        }

        function add_img_url() {
            // 加载页面图片的所有链接
            return new Promise((resolve) => {
                showtoast('正在获取数据中，请勿操作', 500)
                document.getElementById('btnfirst').click(); // 返回首页
                let checkImages = () => {
                    var img_database = document.querySelectorAll('[id^="ViewContainer_BG_"]');
                    var TotalPage = parseInt((document.getElementById('totalPages').innerText).match(/\d+/)[0]);
                    // console.log('Number of images:', img_database.length);
                    // img_url 空值检查
                    var imgList = Array();
                    for (let i = 0; i < img_database.length; i++) {
                        imgList[i] = img_database[i].currentSrc;
                    }
                    if (img_database.length !== TotalPage || imgList.includes('')) {
                        setTimeout(() => {
                            showtoast('正在获取数据中，请勿操作', 500);
                            document.getElementById('btnnext').click();
                            checkImages();
                        }, 500); // 间隔0.5秒翻页
                    } else {
                        document.getElementById('btnnext').click();
                        // console.log('准备制作PDF的IMG储备完毕');
                        // console.log(imgList);
                        resolve('图片链接加载成功');
                    }
                };

                checkImages();
            });
        }


        function loadImage(url) {
            // 图片加载转换为图像二进制文件
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
            // 加载img_url
            if (document.querySelectorAll('[id^="ViewContainer_BG_"]').length != parseInt((document.getElementById('totalPages').innerText).match(/\d+/)[0])) {
                await add_img_url();
            }
            await addProgressBar();
            showtoast('图像信息处理中，您可以正常浏览该论文页面，我正在努力合并成PDF中，请稍后~', 5000)
            // pdf 图片下载
            var imgList = Array();
            var img_database = document.querySelectorAll('[id^="ViewContainer_BG_"]');
            for (let i = 0; i < img_database.length; i++) {
                imgList[i] = img_database[i].currentSrc;
            }
            var imgData = new Array();
            for (var i = 0; i < imgList.length; i++) {
                var link = imgList[i];
                // console.log("获取第" + (i+1) + "张图片");
                var pg = document.getElementById('pg');
                pg.value = (i + 1) / imgList.length * 100;
                await loadImage(link).then((data) => {
                    imgData.push(data);
                });
            }
            // pdf 图片合并为pdf
            // console.log("正在合并图片为PDF");
            var contentWidth = parseFloat(document.getElementById('PageContainer_0').style.width.replace('px', ''))
            var contentHeight = parseFloat(document.getElementById('PageContainer_0').style.height.replace('px', ''))
            const orientation = contentWidth > contentHeight ? 'l' : 'p';
            var doc = new jsPDF({
                orientation: orientation,
                unit: "px",
                format: [contentWidth, contentHeight],
            });
            const namepdf = document.getElementById('infoname').value
            const output = namepdf + ".pdf";
            let idx = 0;
            imgData.forEach((e) => {
                idx++;
                doc.addImage(e, "JPG", 0, 0, contentWidth, contentHeight);
                if (idx < imgData.length) {
                    doc.addPage();
                }
            });
            doc.save(output);
            removeProgressBar();
        }

        // 绑定下载按钮
        $(document).ready(function () {
            $(".downloadbutton").on("click", function () {
                download();
            });
        });

        addbutton();

    })
})()

