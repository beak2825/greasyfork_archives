// ==UserScript==
// @name         Download_Pytorch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Help you to download the pytorch.
// @author       YuhangTian
// @match        https://pytorch.org/get-started/previous-versions/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pytorch.org
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478006/Download_Pytorch.user.js
// @updateURL https://update.greasyfork.org/scripts/478006/Download_Pytorch.meta.js
// ==/UserScript==

(async() => {
    'use strict';
    console.log("test damn");
    // Your code here...
    var all_text;


    //console.log(all_text);
    function fetchTextFromURL(url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            callback(response.responseText);
        }
    });
}
    fetchTextFromURL("https://download.pytorch.org/whl/torch_stable.html", function(all_text) {

   // 查找所有具有以 "wheel" 开头的ID的元素
    var wheelElements = document.querySelectorAll('[id^="wheel"]');

    // 遍历每个匹配的 "wheel" 元素
    wheelElements.forEach(function(targetElement) {
        // 创建按钮元素
        var downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";

        // 将按钮添加到页面（放在目标元素的后面）
        targetElement.parentNode.insertBefore(downloadButton, targetElement.nextSibling);

        // 添加按钮的点击事件监听器
        downloadButton.addEventListener("click", function() {
            var linuxAndWindowsElement = targetElement.nextElementSibling;

            // 查找该元素后面的第一个具有 "class" 为 "language-plaintext highlighter-rouge" 的文本块
            var codeBlock = findCodeBlock(linuxAndWindowsElement);
            //console.log(codeBlock.textContent);
            if (codeBlock) {
                // 提取文本块中的文本
                var text = codeBlock.textContent;
                var textSegments = text.split("#");
                var pattern = /(\btorch|torchvision|torchaudio)==([^ ]+)/g;
                var versions = {};

                // 使用正则表达式匹配并提取版本信息

                for (var i = 1; i < textSegments.length; i++) {
                    console.log(textSegments[i]);
                    var segment = textSegments[i];
                    var matches;
                    while ((matches = pattern.exec(segment)) !== null) {
                        if (matches) {
                            if (!versions[i]) {
                                versions[i] = {};
                            }
                            versions[i][matches[1]] = matches[2];
                        }
                    }

                }

                var links=[];
                for(var j=1;j<textSegments.length;j++)
                {
                    if(versions[j]['torch'].includes("+"))
                    {
                        //console.log(1);
                        var cuda_version=versions[j]['torch'].split('+')[1];
                        var torch_version=versions[j]['torch'].split('+')[0];
                    }
                    else
                    {

                        torch_version=versions[j]['torch'];
                        cuda_version=textSegments[j].split('\n')[0];
                        if(cuda_version.includes("ROCM"))
                        {
                            cuda_version=cuda_version.replace(/[^a-zA-Z0-9.]+/g, '').toLowerCase();
                            var regex = /rocm\d+\.\d+\.\d+/i;
                            const match=cuda_version.match(regex);
                            cuda_version=match[0];
                        }
                        else if(cuda_version.includes("CUDA"))
                        {
                            const regex = /CUDA (\d+\.\d+)/;
                            const match = cuda_version.match(regex);
                            cuda_version = "cu" + match[1].replace('.', '');
                        }
                        else
                        {
                            cuda_version="cpu";
                        }
                    }
                    //console.log(cuda_version);
                    var pattern1 = new RegExp(`href="${cuda_version}/torch-${torch_version}.*`, 'g');
                    var foundSections = [];
                    links.push("cuda_version:"+cuda_version+"\n");
                    links.push("torch:\n");
                    while ((matches = pattern1.exec(all_text)) !== null) {
                        var pattern_ = /href="([^"]*)"/g;
                        var link = pattern_.exec(matches[0]);
                        link="https://download.pytorch.org/whl/"+link[1];
                        links.push(link);
                    }
                    links.push("\n");
                    links.push("torchaudio:\n");
                    var torchaudio_version=versions[j]['torchaudio'];
                    pattern1 = new RegExp(`href="${cuda_version}/torchaudio-${torchaudio_version}.*`, 'g');
                    while ((matches = pattern1.exec(all_text)) !== null) {
                        pattern_ = /href="([^"]*)"/g;
                        link = pattern_.exec(matches[0]);
                        link="https://download.pytorch.org/whl/"+link[1];
                        links.push(link);
                    }
                    links.push("\n");
                    links.push("torchvision:\n");
                    var torchvision_version=versions[j]['torchvision'].split('+')[0];
                    pattern1 = new RegExp(`href="${cuda_version}/torchvision-${torchvision_version}.*`, 'g');
                    while ((matches = pattern1.exec(all_text)) !== null) {
                        pattern_ = /href="([^"]*)"/g;
                        link = pattern_.exec(matches[0]);
                        link="https://download.pytorch.org/whl/"+link[1];
                        links.push(link);
                    }
                    links.push("\n");
                }
                console.log(links);
                var textarea = document.createElement("textarea");
                textarea.rows = 20; // 设置文本框的行数
                textarea.cols = 100; // 设置文本框的列数

                // 将检索到的链接信息填充到文本框中

                textarea.value = links.join("\n");

                // 创建一个模态框（弹出框）来显示文本框
                var modal = document.createElement("div");
                modal.style.position = "fixed";
                modal.style.top = "0";
                modal.style.left = "0";
                modal.style.width = "100%";
                modal.style.height = "100%";
                modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                modal.style.display = "flex";
                modal.style.justifyContent = "center";
                modal.style.alignItems = "center";

                // 将文本框添加到模态框中
                modal.appendChild(textarea);

                // 添加模态框到页面
                document.body.appendChild(modal);

                // 添加关闭按钮以关闭模态框
                var closeButton = document.createElement("button");
                closeButton.textContent = "Close";
                closeButton.addEventListener("click", function() {
                    document.body.removeChild(modal);
                });
                modal.appendChild(closeButton);

            } else {
                console.log("Could not find code block with the specified class.");
            }
        });
    });

    // 查找指定元素后面的第二个具有指定 class 的文本块
    function findCodeBlock(startingElement) {
        var currentElement = startingElement.nextElementSibling;
        var count = 0;
        while (currentElement) {
            if (currentElement.classList.contains("language-plaintext") && currentElement.classList.contains("highlighter-rouge")) {
                count++;
            if (count === 2) {
                return currentElement;
            }
        }

            currentElement = currentElement.nextElementSibling;
        }

    return null; // 未找到匹配的文本块
}

});

})();