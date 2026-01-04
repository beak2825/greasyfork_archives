// ==UserScript==
// @name         雨课堂试题与试卷下载器（python学霸）3.0
// @namespace    雨课堂内容与试卷下载器（python学霸）3.0
// @version      3.0
// @description  获取雨课堂考试试卷和试题内容
// @author       python学霸
// @match        https://www.yuketang.cn/*
// @match        https://examination.xuetangx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481848/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%95%E9%A2%98%E4%B8%8E%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88python%E5%AD%A6%E9%9C%B8%EF%BC%8930.user.js
// @updateURL https://update.greasyfork.org/scripts/481848/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%95%E9%A2%98%E4%B8%8E%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88python%E5%AD%A6%E9%9C%B8%EF%BC%8930.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 下载内容的函数
   function downloadContent(content, filename) {
    var blob = new Blob([content], {type: 'text/plain'});
    var url = URL.createObjectURL(blob);
    var downloadButton = document.createElement('a');
    downloadButton.href = url;
    downloadButton.download = filename;
    downloadButton.textContent = 'Fuck雨课堂';
    downloadButton.style.display = 'inline-block'; // 使用inline-block以便更好地控制按钮尺寸
    downloadButton.style.margin = '10px auto';
    downloadButton.style.padding = '10px 20px'; // 增加padding以使按钮看起来更大更易点击
    downloadButton.style.backgroundColor = '#FFD700'; // 设置按钮背景为金黄色
    downloadButton.style.color = 'white';
    downloadButton.style.textDecoration = 'none';
    downloadButton.style.border = '1px solid #FFA500'; // 可以添加边框并给边框一个橙色调以增强视觉效果
    downloadButton.style.borderRadius = '5px'; // 设置边框圆角为5px，根据喜好适当调整
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.fontSize = '16px'; // 增加字体大小以提高可读性
    downloadButton.style.fontWeight = 'bold'; // 字体加粗
    downloadButton.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'; // 添加阴影效果增强立体感

    var container = document.querySelector('.text-right') || document.body;
    if (container) {
        container.insertBefore(downloadButton, container.nextChild);
    }
}

    // 下载雨课堂内容的函数
    function downloadYuketangContent() {
        setTimeout(function() {
            var content = '';
            var slideLayers = document.querySelectorAll('.shape__text span');

            slideLayers.forEach(function(slideLayer) {
                var textContent = slideLayer.innerText;
                content += textContent + "\n\n";
            });

            if (content.trim().length > 0) {
                downloadContent(content, '雨课堂内容.txt');
            } else {
                console.error('没有找到.slide_layer元素或者内容为空');
            }
        }, 6000);
    }

    // 下载试卷的函数
    function downloadExaminationPaper() {
        var examIdRegex = /\/exam\/(\d+)|\/cover\/(\d+)/;
        var matches = window.location.href.match(examIdRegex);
        var examId = matches[1] || matches[2];
        var accessToken = document.cookie.match(/x_access_token=([^;]+)/)[1];
        var url = "https://examination.xuetangx.com/exam_room/show_paper?exam_id=" + examId;

        fetch(url, {
            credentials: 'include',
            headers: {
                'Cookie': 'x_access_token=' + accessToken
            }
        })
        .then(response => response.json())
        .then(data => {
            var problems = data.data.problems;
            var content = '';

            for (var i = 0; i < problems.length; i++) {
                var problem = problems[i];
                content += problem.TypeText + "\n";
                content += problem.Body.replace(/<[^>]*>/g, '').replace(/\n/g, '') + "\n";

                if (problem.Options) {
                    for (var j = 0; j < problem.Options.length; j++) {
                        var option = problem.Options[j];
                        var key = option.key;
                        var value = option.value.replace(/<[^>]*>/g, '').replace(/\n/g, '');
                        content += key + ". " + value + "\n";
                    }
                }

                content += "+".repeat(10) + "\n";
            }

            downloadContent(content, "试卷_" + examId + ".txt");
        })
        .catch(error => console.log(error));
    }

    // 根据当前页面URL决定执行哪个函数
    if (window.location.href.includes("www.yuketang.cn/cards/cards_info") || window.location.href.includes("www.yuketang.cn/web/")) {
        downloadYuketangContent();
    } else if (window.location.href.includes("/exam/") || window.location.href.includes("examination.xuetangx.com/cover/")) {
        downloadExaminationPaper();
    }
})();