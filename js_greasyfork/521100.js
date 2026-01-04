// ==UserScript==
// @name         助手S2↓
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @description  保存文档，在页面右侧底部添加下载标签，显示下载地址及文件名称，并实现下载
// @author       for419
// @icon         https://www.picc.com/images/favicon.ico
// @match        *://192.168.11.*/*
// @match        *://127.0.0.1/*/*cs*/*.htm*
// @match        *://127.0.0.1/*/*2/*.htm*22
// @match        *://10.2.10.29/1*1
// @match        *://10.2.10.29:7001/1*1

// @exclude      *://10.2.10.29/oa/frames/1*1
// @exclude      *://127.0.0.1:800/*/index.htm*


// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521100/%E5%8A%A9%E6%89%8BS2%E2%86%93.user.js
// @updateURL https://update.greasyfork.org/scripts/521100/%E5%8A%A9%E6%89%8BS2%E2%86%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

// @match        *://127.0.0.1/*/*111
// @match        *://127.0.0.1/*/*gz*/*
// @match        *://127.0.0.1/*/1100/*
// @match        *://127.0.0.1/*/*nd*/*
// @match        *://127.0.0.1/*/*gz*/1*.htm*

// ------------------------------------
    // 设置数组范围
    var portRange = ["9104", "7001"]; //, "305000", "800"

    // 获取当前页面的URL
    var currentUrl = window.location.href;
    var parser = document.createElement('a');
    parser.href = currentUrl;

    // 初始化变量m1
    var m1 = "";

  // ------------------------------------str
    if (document.URL.includes('192.168.11.110')) {
     // -----2.1-------------------------------
    // 遍历数组，检查URL路径中是否包含数组值
      for (var i = 0; i < portRange.length; i++) {
        var segment = portRange[i];
        if (currentUrl.includes("/" + segment + "/")) {
            m1 = ":" + segment + "";
            break; // 找到匹配项后退出循环
        }
      //  alert('192.匹配端口:' + segment);
      }
   // -----2.2-------------------------------
    } else if (document.URL.includes('10.2.10.29')) {
        alert('10.2.10.29');
   // -----2.3-------------------------------
    } else if (document.URL.includes('10.8.20.38')) {
        alert('10.8.20.38');
   // -----2.9-------------------------------
    } else {
    // 获取当前页面端口
    var port = window.location.port; // 端口可能是字符串，如"8080"，或者null（如果协议默认端口）

    // 检查当前网页端口是否在数组范围内
    if (port && portRange.includes(port)) {
        m1 = ":" + port;
    }
    }
  // ------------------------------------end
    // 设置变量m2
    // 注意：这里我们假设你想要保留原始URL的协议、主机名和路径，只是添加或修改端口部分
    // 如果你需要不同的行为，请相应地调整这段代码
    //  var protocol = parser.protocol;  //当前 URL 的协议部分，包括最后的冒号（:），如https:
    //  var hostname = parser.hostname;  //当前 URL 的主机名部分，不包括端口号，如www.example.com
    //  var pathname = parser.pathname;  //当前 URL 的路径部分，从主机名之后的第一个斜杠（/）开始，直到查询字符串（如果有的话）之前，如/path/to/page
    //  var search = parser.search;      //当前 URL 的查询字符串部分，包括开头的问号（?），如对于 URL https://www.example.com/path?param1=value1，值会是 "?param1=value1"。
    var protocol = 'http:';
    var hostname = '10.2.10.29';

    // 形成新的链接地址m2
    // 注意：如果原始URL中没有端口，m1将是一个空字符串，因此m2将只是原始URL
    // 如果m1包含端口，它将替换原始URL中的端口部分
    //  m2 = protocol + "//" + hostname + m1 + pathname + search;
    var m2 = protocol + "//" + hostname + m1;

    // alert('链接端口 ' + m1);
    // alert('链接前段 ' + m2);


    // 获取所有符合条件的文件信息
    function getFilesInfo() {
        var filesInfo = [];
        var sections = document.querySelectorAll('#ZHENGWEN, #FUJIAN');
        var fileExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.ppt', '.pptx', '.zip', '.xls', '.gd', '.wp', '.et', '.rar', '.7z'];
        sections.forEach(function(section) {
            fileExtensions.forEach(function(extension) {
                var fileBars = section.querySelectorAll('div.fileBarCon[id$="' + extension + '"]');
                fileBars.forEach(function(fileBar) {
                    var fileNameElement = fileBar.querySelector('div.file-line-left > span#filename');
                    if (fileNameElement) {
                        var fileName = fileNameElement.getAttribute('title');
                        var fileId = fileBar.id;
                        //                        var downloadUrl = window.location.origin + '/file/' + fileId;
                        // http://10.2.10.29:9104 安徽

    // 获取当前网址
    //const currentURL = window.location.href;
    //const hostname = window.location.hostname;
    //const port = window.location.port;

                        //var downloadUrl = 'http://10.2.10.29/file/' + fileId;
                        // var downloadUrla = 9104
                        // var downloadUrl = 'http://10.2.10.29:' + downloadUrla + '/file/' + fileId;

                        const portt1 = document.querySelector('.main_wenh')?.textContent || '';
                        if (portt1.includes('协作任务') || portt1.includes('失效')) {
                           var portfile = ':7001/file/';
                           } else {
                           var portfile = '/file/';
                        }
                        var downloadUrl = m2 + portfile + fileId;
                        //var downloadUrl = m2 + '/file/' + fileId;
                        filesInfo.push({fileName: fileName, downloadUrl: downloadUrl, extension: extension});
                    }
                });
            });
        });
        return filesInfo;
    }

    // 创建下载按钮并添加到页面
    function createDownloadButton(fileInfo) {
        var downloadButton = document.createElement('a');
        downloadButton.style.cssText = 'display: block; width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 5px 10px; background-color: lightblue; color: black; text-decoration: none; margin-top: 5px;';
        downloadButton.textContent = fileInfo.fileName + fileInfo.extension;
        downloadButton.href = fileInfo.downloadUrl;
        downloadButton.download = fileInfo.fileName + fileInfo.extension; // 设置下载文件名，包含后缀

        // 鼠标悬停时显示信息
        downloadButton.onmouseover = function() {
            this.title = '下载: ' + this.download;
        };

        // 鼠标移开时隐藏信息
        downloadButton.onmouseout = function() {
            this.title = '';
        };

        return downloadButton;
    }

    // 创建下载按钮容器并添加到页面
    function createDownloadButtonsContainer() {
        var container = document.createElement('div');
        container.style.cssText = 'position: fixed; bottom:10%; right: 0; width: 160px; background-color: lightcoral; padding: 10px; box-sizing: border-box; z-index: 9999; user-select: none;';

   //----------------  隐藏 str
    // 监听鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        var rightEdge = window.innerWidth - container.offsetWidth - 10; // 减去标签宽度和一点边距
        if (e.clientX > rightEdge) {
            container.style.right = '0px';
        } else if (e.clientX < parseInt(container.style.right) + container.offsetWidth) {
            // 鼠标在标签上方时，不执行隐藏操作
        } else {
            container.style.right = '0px';
            //
            container.style.right = '-160px'; //-100px 这里不直接隐藏，而是通过CSS过渡效果缓慢隐藏
        }
    });
   //----------------  隐藏 end
        document.body.appendChild(container);
        return container;
    }


    // 主函数
    function main() {
        var filesInfo = getFilesInfo();
        var container = createDownloadButtonsContainer();
        filesInfo.forEach(function(fileInfo) {
            var downloadButton = createDownloadButton(fileInfo);
            container.appendChild(downloadButton);
        });
    }

    // 执行主函数
    main();
})();