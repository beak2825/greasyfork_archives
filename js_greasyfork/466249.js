// ==UserScript==
// @name         PRY Markdown生成
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  感觉不如PTA
// @author       田杰 Solo Jie
// @match        https://pry.jsu.edu.cn/problems
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pry.jsu.edu.cn
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/466249/PRY%20Markdown%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/466249/PRY%20Markdown%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

// 本代码根据GPL协议开源，本代码不涉及逆向工程。使用本代码需遵守开源许可证。
(function () {
    'use strict';
    //等待页面加载完成后，执行脚本
    // 等待能找到n-page-header的元素，才执行脚本
    var loadingLogo = document.querySelector("#appLoading > div > img")
    var loadingText = document.querySelector("#appLoading > div > h2")
    var pintiaImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAABACAYAAADGfAkDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTExLTEzVDE3OjUxOjU5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNS0yNFQxNTowNDowNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNS0yNFQxNTowNDowNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NTZmN2I3Zi0zNmQ0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'

    // 检查Loading页面是否出现
    var timer = setInterval(function () {
        if (loadingLogo) {
            // 如果出现了Loading页面，就继续等待
            clearInterval(timer);
            loadingText.innerText = "现在是 幻想时间"
            loadingLogo.setAttribute("src", pintiaImage);
        }
    }, 10);

    var timer2 = setInterval(function () {
        // 如果页面不是https://pry.jsu.edu.cn/problems，停止加载
        if (window.location.href != "https://pry.jsu.edu.cn/problems") {
            clearInterval(timer2);
        }
        if (document.querySelector('.n-page-header')) {
            // 获取当前路径
            var url = window.location.href;

            clearInterval(timer2);
            clearInterval(timer);
            // 执行脚本
            var pintiaImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAABACAYAAADGfAkDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTExLTEzVDE3OjUxOjU5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNS0yNFQxNTowNDowNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNS0yNFQxNTowNDowNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NTZmN2I3Zi0zNmQ0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'
            var image = document.createElement('img');
            image.src = pintiaImage
            image.style = 'width: 300px;height: 40px;';

            var btn = document.createElement('button');
            btn.innerHTML = '生成Markdown文件';
            btn.onclick = function () {
                var ap = document.evaluate('//*[@id="problem"]/main/div/div[1]/div/aside/div/div/div[2]/div[2]/div[1]/div/div/div[1]/div[1]/div[1]/div/div', document,
                    null,
                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                    null)
                var titles = ap.snapshotItem(0).innerText;
                var topic = document.querySelector('.markdown-body');
                // 其中 : .topic-describe内的h3为二级标题，.topic-describe内的a标签为内容，.topic-describe内的pre标签为代码块

                // 其中 : .topic-describe内的h3为二级标题，.topic-describe内的a标签为内容，.topic-describe内的pre标签为代码块
                // .topic-describe 下有多个h3标签、a标签、pre标签

                // 获取topic的所有子元素
                var children = topic.children;
                children = Array.prototype.slice.call(children);
                // 遍历所有子元素
                var title = '';
                var content = '';
                content += '# ' + titles + '\n';
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    // 如果是h3标签，则为标题
                    if (child.tagName === 'H3') {
                        title = child.innerText;
                        content += '\n## ' + title + '\n';
                    }
                    // 如果是a标签，则为内容
                    if (child.tagName === 'P') {
                        content += child.innerText + '\n';
                    }
                    if (child.tagName === 'STRONG') {
                        content += "**" + child.innerText + '**';
                    }
                    if (child.tagName === 'CODE') {
                        content += "`" + child.innerText + '`';
                    }
                    if (child.tagName === 'BUTTON') {
                        continue;
                    }
                    // 如果是pre标签，则为代码块
                    if (child.tagName === 'PRE') {
                        content += '```' + '\n';
                        content += child.innerText + '\n';
                        content += '```' + '\n';
                    }
                    if (child.tagName === 'IMG') {
                        content += '![Images](' + child.src + ')' + '\n';
                    }
                    if (child.tagName === 'A') {
                        // 检查其是否为图片
                        // 判断child.href的文件类型
                        var fileType = child.href.split('.').pop();
                        if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
                            content += '![Images](' + child.href + ')' + '\n';
                        } else if (child.href.indexOf('http') === 0) {
                            content += '[' + child.innerText + '](' + child.href + ')' + '\n';
                        } else {
                            content += child.innerText + '\n';
                        }
                    }
                    // 检查该标签有无子元素，如果有，插入到children数组的当前下标之后
                    if (child.children.length > 0) {
                        for (var j = child.children.length - 1; j >= 0; j--) {
                            if (child.children[j].tagName === 'BUTTON') {
                                continue;
                            }
                            if (child.children[j].tagName === 'CODE' && child.tagName === 'PRE') {
                                continue;
                            }
                            console.log(child.children[j]);
                            children.splice(i + 1, 0, child.children[j]);
                        }
                    }

                };

                var md = content;
                console.log(md);
                var blob = new Blob([md], { type: 'text/plain' });
                var a = document.createElement('a');
                a.download = titles + '.md';
                a.href = URL.createObjectURL(blob);
                a.click();
                // }
                btn.innerHTML = '正在生成，请稍后...';
                btn.disabled = true;
                var btnTimer = setInterval(function () {
                    btn.innerHTML = '生成Markdown文件';
                    btn.disabled = false;
                    clearInterval(btnTimer);
                }, 100);
            }
            document.querySelector('.n-page-header').appendChild(btn);
            document.querySelector('.n-page-header').appendChild(image);

        }
    }, 1000);


}
)();
