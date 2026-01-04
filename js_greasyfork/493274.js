// ==UserScript==
// @name         yongcunCSS美化脚本 OSMCC(Open Source Misguided Css Changer)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  change yongcun.cc's css
// @author       Lingyunmo
// @match        http://41.h.yongcun.cc:800/*
// @match        http://code.bzlom.cn:800/*
// @icon         http://41.h.yongcun.cc:800/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493274/yongcunCSS%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC%20OSMCC%28Open%20Source%20Misguided%20Css%20Changer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493274/yongcunCSS%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC%20OSMCC%28Open%20Source%20Misguided%20Css%20Changer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var customStyles = `
        body {
            background-color: #add8e6;
            font-family: Arial, sans-serif;
        }
        h1#csharp-text {
            color: blue;
            text-align: center;
        }
        a {
            color: #800080;
            text-decoration: none;
        }
        table {
            border-collapse: separate;
            border-spacing: 0 10px;
            border-radius: 10px;
            overflow: hidden;
        }
        td, th {
            padding: 10px;
            border: 1px solid #dddddd;
            text-align: center;
            background-color: #add8e6;
        }
        th {
            background-color: #add8e6;
        }
        div.content {
            margin-top: 20px;
        }
        div.content p {
            margin-bottom: 10px;
        }
        div.footer {
            text-align: center;
            margin-top: 20px;
        }
        .footer p {
            display: inline-block;
            margin: 10px;
        }
    `;

    var appStyles = `
        #app {
            text-align: center;
            margin: auto;
            width: 80%;
            background-color: #add8e6;
        }
        #app table {
            border-collapse: collapse;
            width: 100%;
            border: 5px solid #A7EFD0;
            background-color: #A7EFD0;
        }
        #app th, #app td {
            padding: 8px;
            text-align: left;
            background-color: #add8e6;
        }
        #app th {
            width: 85px;
        }
        #app td:first-child {
            width: 85px;
            white-space: nowrap;
        }
        #app pre {
            white-space: pre-wrap;
            margin: 0;
            font-size: 20px;
            font-weight: bold;
            color: darkblue;
        }
        #app input[type="text"] {
            width: 100%;
            box-sizing: border-box;
        }
    `;

    var styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);

    var cSharpText = "<h1 id='csharp-text'>C#与.net Framework程序设计 编程小站（修改版by凌云陌） code.bzlom.cn</h1>";
    document.body.insertAdjacentHTML('afterbegin', cSharpText);

    var paragraphsToRemove = document.querySelectorAll('p[style="color: #FF3300; background-color: #FFFF66"]');
    paragraphsToRemove.forEach(function(paragraph) {
        paragraph.parentNode.removeChild(paragraph);
    });

    if (window.location.href === "http://41.h.yongcun.cc:800/Default.aspx" || window.location.href === "http://41.h.yongcun.cc:800/" || window.location.href === "http://code.bzlom.cn:800/" || window.location.href === "http://code.bzlom.cn:800/Default.aspx") {
        var secondTable = document.querySelectorAll('table')[1];
        if (secondTable) {
            var secondTableSecondColumn = secondTable.querySelector('tr td:nth-child(2)');
            if (secondTableSecondColumn) {
                secondTableSecondColumn.parentNode.removeChild(secondTableSecondColumn);
            }
        }

        var newContent = `
            <div class="content">
                <p><strong>平时成绩占50%，期末考试占50%。请时刻注意自己已得分数。</strong></p>
                <p><strong>相关资料到百度网盘下载，作业、设计过程及内容要求在作业栏目提交。</strong></p>
                <p><strong>新注册学生请先选择课程，才能进入作业。</strong></p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', newContent);

         var button = document.createElement("button");
        button.textContent = "直接进入作业页面";
        button.style.fontSize = "16px";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#D8BFD8";
        button.style.color = "red";
        button.style.fontWeight = "bold";
        button.style.display = "block";
        button.style.margin = "0 auto";
        button.addEventListener("click", function() {
            window.location.href = "http://41.h.yongcun.cc:800/student/Work.aspx";
        });
        document.body.appendChild(button);
    }

    var elementsToRemove = document.querySelectorAll('hr, p[style="text-align: center"]');
    elementsToRemove.forEach(function(element) {
        element.parentNode.removeChild(element);
    });

    var footerContent = `
        <hr />
        <div class="footer">
            <p>友情链接：
                <a id="HyperLink4" href="http://itdev.yongcun.cc">创新创业开发团队</a>
                &nbsp;<a id="HyperLink6" href="http://shuiwen.yongcun.cc">水文大数据</a>
            </p>
            <p>
                <a id="HyperLink5" href="http://www.miitbeian.gov.cn/">鲁ICP备16005192号</a>
                &nbsp;<a id="HyperLink7" href="https://github.com/lingyunmo">凌云陌的GitHub</a>
            </p>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', footerContent);

    var btnSubmit = document.getElementById('btnSubmit');
    if (btnSubmit) {
        btnSubmit.parentNode.removeChild(btnSubmit);
    }

    var appStyleElement = document.createElement('style');
    appStyleElement.innerHTML = appStyles;
    document.head.appendChild(appStyleElement);

    var appDiv = document.getElementById('app');

    function submitForm() {
        console.log('Form submitted!');
    }

    if (window.location.href.indexOf("http://41.h.yongcun.cc:800/student/WorkDo.aspx") !== -1 || window.location.href.indexOf("http://code.bzlom.cn:800/student/WorkDo.aspx") !== -1) {
    var apiSubmitButton = appDiv.querySelector('#btnSubmit');
    if (apiSubmitButton) {
        apiSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            submitForm();
        });
    }
    var buttonAns = document.getElementById('ContentPlaceHolder1_btnLookAnswer');
    buttonAns.removeAttribute('disabled');
    }

    if (window.location.href === "http://41.h.yongcun.cc:800/Default.aspx" || window.location.href === "http://41.h.yongcun.cc:800/" || window.location.href === "http://code.bzlom.cn:800/" || window.location.href === "http://code.bzlom.cn:800/Default.aspx") {
        window.addEventListener('load', function() {
            var otherTds = document.querySelectorAll('table td:not(:first-child)');
            otherTds.forEach(function(td) {
                td.removeAttribute('style');
            });
        });
    }
    if (window.location.href.indexOf("http://41.h.yongcun.cc:800/student/WorkDo.aspx") !== -1 || window.location.href.indexOf("http://code.bzlom.cn:800/student/WorkDo.aspx") !== -1) {
        window.addEventListener('load', function() {
            var otherTds = document.querySelectorAll('table td:nth-child(-n+8)');
            otherTds.forEach(function(td) {
                td.removeAttribute('style');
            });
        });
    }

})();
