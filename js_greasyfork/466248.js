// ==UserScript==
// @name         PRY Markdown生成
// @namespace    https://www.wenjiachen.cn/
// @version      0.2
// @description  用于根据文件生成Markdown 放置于IDE中查看做题（如CLion）
// @author       WenjiaChen
// @match        https://pry.jsu.edu.cn/problems
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pry.jsu.edu.cn
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/466248/PRY%20Markdown%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/466248/PRY%20Markdown%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

// 本代码根据GPL协议开源，本代码不涉及逆向工程。使用本代码需遵守开源许可证。
(function () {
    'use strict';
    var timer2 = setInterval(function () {
        // 如果页面不是https://pry.jsu.edu.cn/problems，停止加载
        if (window.location.href != "https://pry.jsu.edu.cn/problems") {
            clearInterval(timer2);
        }
        if (document.querySelector('.n-page-header')) {
            // 获取当前路径
            var url = window.location.href;

            clearInterval(timer2);
            // 执行脚本
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
        }
    }, 1000);


}
)();
