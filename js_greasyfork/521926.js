// ==UserScript==
// @name         bilibili按关注分组分类显示动态
// @description  按关注分组分类显示动态
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @author       GZ2000COM
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*/fans/follow*
// @icon         https://www.bilibili.com//favicon.ico
// @connect      api.bilibili.com
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521926/bilibili%E6%8C%89%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%88%86%E7%B1%BB%E6%98%BE%E7%A4%BA%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/521926/bilibili%E6%8C%89%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%88%86%E7%B1%BB%E6%98%BE%E7%A4%BA%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 判断当前页面是否是https://t.bilibili.com/*页面
    if (window.location.href.startsWith('https://t.bilibili.com/')) {
        // 等待页面加载完成
        window.addEventListener('load', function () {
            // 查找并移除一些页面初始元素（根据实际需求调整选择器）
            var element1 = document.querySelector('.left');
            var element2 = document.querySelector('.right');
            var element3 = document.querySelector('.bili-dyn-sidebar');
            var element4 = document.querySelector('.bili-dyn-home--member main section:first-of-type');

            if (element1) {
                element1.parentNode.removeChild(element1);
            }

            if (element2) {
                element2.parentNode.removeChild(element2);
            }

            if (element3) {
                element3.parentNode.removeChild(element3);
            }

            if (element4) {
                element4.parentNode.removeChild(element4);
            }

            // 选择要修改宽度的元素
            var mainElement = document.getElementsByTagName('main')[0];
            if (mainElement) {
                // 修改元素宽度
                mainElement.style.width = '60%';
            }

            // 获取所有具有.link-class类名的元素（here assume the class name is correct, may need to adjust in reality)
            var elements = document.querySelectorAll('.header-entry-mini');
            var uid;
            if (elements.length > 0) {
                var href = elements[0].getAttribute('href');
                if (href && href.startsWith('//space.bilibili.com/')) {
                    uid = href.split('/')[3];
                }
            }

            // 构造要请求的URL，使用获取到的用户UID
            var targetUrl = 'https://space.bilibili.com/' + uid + '/fans/follow';
                        // 创建新元素（例如用div作为示例，可根据实际需求调整元素类型）
            var newElement = document.createElement('div');
            newElement.classList.add('bili-dyn-list-tabs'); // 添加和已有元素类似的类名，尝试获取相似样式
            // 初始设置元素隐藏滚动条样式，后续通过JavaScript控制显示
            newElement.style.overflowX = 'hidden';
            newElement.style.whiteSpace = 'nowrap';
            newElement.style.margin = '10px 0';
            // 添加鼠标进入和离开事件监听器来控制滚动条的显示和隐藏
            newElement.addEventListener('mouseenter', function () {
                this.style.overflowX = 'scroll';
            });
            newElement.addEventListener('mouseleave', function () {
                this.style.overflowX = 'hidden';
            });

            // 创建第一个子元素div（类名为bili-dyn-list-tabs__list）
            var listDiv = document.createElement('div');
            listDiv.classList.add('bili-dyn-list-tabs__list');

            // 创建用于分组名的子元素（以div包裹span为例，结构更清晰，方便后续样式及交互设置）
            var groupAllDiv = document.createElement('div');
            groupAllDiv.classList.add('bili-dyn-list-tabs__item', 'fs-medium');
            groupAllDiv.textContent = '全部关注';
            groupAllDiv.addEventListener('click', function () {
                // 先移除所有同类元素的active类名
                var items = document.querySelectorAll('.bili-dyn-list-tabs__item.fs-medium');
                items.forEach(function (item) {
                    item.classList.remove('active');
                });
                // 给当前点击元素添加active类名
                this.classList.add('active');
                // 显示全部相关元素（class为bili-dyn-list-tabs的div和所有section）
                var main = document.getElementsByTagName('main')[0];
                var biliDynListTabs = main.querySelector('.bili-dyn-list-tabs');
                var sections = main.querySelectorAll('section');
                biliDynListTabs.style.display = 'block';
            });

            // 后续创建分组元素相关逻辑移动到函数中方便复用
            function createGroupDiv(title, listDiv) {
                var groupDiv = document.createElement('div');
                groupDiv.classList.add('bili-dyn-list-tabs__item', 'fs-medium');
                groupDiv.textContent = title;
                groupDiv.addEventListener('click', function () {
                    var items = document.querySelectorAll('.bili-dyn-list-tabs__item.fs-medium');
                    items.forEach(function (item) {
                        item.classList.remove('active');
                    });
                    this.classList.add('active');
                    // 隐藏除了对应tagid的section之外的其他section元素
                    var main = document.getElementsByTagName('main')[0];
                    var sections = main.querySelectorAll('section');
                    sections.forEach(function (section) {
                        if (section.getAttribute('tagid')!== title) {
                            section.style.display = 'none';
                        } else {
                            section.style.display = 'block';
                        }
                    });
                });
                listDiv.appendChild(groupDiv);
                return groupDiv;
            }

            // 创建分组元素，先默认添加全部关注、特别关注、默认分组三个基本分组元素
            var groupSpecialDiv = createGroupDiv('特别关注', listDiv);
            var groupDefaultDiv = createGroupDiv('默认分组', listDiv);
                        // 创建粘贴结果按钮的点击事件逻辑修改，用于更新分组元素
            var pasteButton = document.createElement('button');
            pasteButton.textContent = '粘贴结果';
            pasteButton.style.marginTop = '20px';
            pasteButton.style.padding = '10px 20px';
            pasteButton.style.backgroundColor = '#4CAF50';
            pasteButton.style.color = '#ffffff';
            pasteButton.style.border = 'none';
            pasteButton.style.borderRadius = '6px';
            pasteButton.style.cursor = 'pointer';
            pasteButton.style.fontFamily = '华文楷体';
            pasteButton.style.fontSize = '18px';
            pasteButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
            pasteButton.addEventListener('click', function () {
                navigator.clipboard.readText().then(function (text) {
                    if (text) {
                        let newLines = text.split('\n');
                        let newTitles = [];
                        newLines.forEach(line => {
                            let parts = line.split(', ');
                            if (parts.length >= 2) {
                                let title = parts[1].split(': ')[1];
                                newTitles.push(title);
                            }
                        });
                        if (newTitles.length > 0) {
                            // 替换现有分组文本内容（先移除旧的分组元素）
                            listDiv.innerHTML = '';
                            groupAllDiv = createGroupDiv('全部关注', listDiv);
                            groupSpecialDiv = createGroupDiv(newTitles[0], listDiv);
                            groupDefaultDiv = createGroupDiv(newTitles[1], listDiv);
                            for (let i = 2; i < newTitles.length; i++) {
                                createGroupDiv(newTitles[i], listDiv);
                            }
                            groupAllDiv.classList.add('active');

                            // 在main元素中根据分组名创建对应的section元素，并设置tagid属性
                            var main = document.getElementsByTagName('main')[0];
                            newTitles.forEach(title => {
                                if (title!== '全部关注') {  // 除了"全部关注"分组外创建section元素
                                    var section = document.createElement('section');
                                    section.classList.add('bili-dyn-list__items');
                                    section.setAttribute('tagid', title);
                                    main.appendChild(section);
                                }
                            });
                        } else {
                            console.error('解析到的分组标题列表为空，无法更新分组元素');
                        }
                    } else {
                        console.error('从剪贴板读取的内容为空');
                    }
                }).catch(function (err) {
                    console.error('读取剪贴板内容出错：', err);
                });
            });

            // 继续添加其他基本分组元素到listDiv
            listDiv.appendChild(groupAllDiv);
            listDiv.appendChild(groupSpecialDiv);
            listDiv.appendChild(groupDefaultDiv);

            // 默认让第一个分组名元素（全部关注）添加active类名
            groupAllDiv.classList.add('active');

            // 将两个子元素添加到新Element中
            newElement.appendChild(listDiv);
                        // 找到目标父元素（.bili-dyn-home--member main）
            var targetParent = document.querySelector('.bili-dyn-home--member main');
            if (targetParent) {
                // 获取目标父元素的第一个子元素（如果有的话）
                var firstChild = targetParent.firstChild;
                // 将新Element插入到目标父元素的第一个位置
                targetParent.insertBefore(newElement, firstChild);
            }

            // 以下是新增代码，用于添加tagid属性
        var targetMain = document.querySelector('.bili-dyn-home--member main');
        if (targetMain) {
            var sections = targetMain.querySelectorAll('section');
            for (var i = 0; i < Math.min(2, sections.length); i++) {
                sections[i].setAttribute('tagid', '全部关注');
            }
        }

            // 创建提示框元素
            var tooltipDiv = document.createElement('div');
            tooltipDiv.style.position = 'fixed';
            tooltipDiv.style.top = '50%';
            tooltipDiv.style.left = '50%';
            tooltipDiv.style.transform = 'translate(-50%, -50%)';
            tooltipDiv.style.backgroundColor = '#ffffff';
            tooltipDiv.style.border = '1px solid #e0e0e0';
            tooltipDiv.style.padding = '20px';
            tooltipDiv.style.zIndex = '9999';
            tooltipDiv.style.width = '360px';
            tooltipDiv.style.borderRadius = '10px';
            tooltipDiv.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            tooltipDiv.style.textAlign = 'center';
            tooltipDiv.style.fontFamily = '微软雅黑';
            tooltipDiv.style.fontSize = '16px';
            tooltipDiv.style.display = 'flex';
            tooltipDiv.style.flexDirection = 'column';
            tooltipDiv.style.alignItems = 'center';

            // 创建提示内容段落元素
            var tooltipContent = document.createElement('p');
            tooltipContent.textContent = '为了更好地为您分类显示动态，脚本需要跳转到您的关注页，获取您在B站的关注分组等关键信息，请放心，该操作不会涉及任何隐私泄露或其他风险';
            tooltipContent.style.textAlign = 'justify';
            tooltipContent.style.fontFamily = '微软雅黑';
            tooltipContent.style.fontSize = '18px';
            tooltipContent.style.margin = '0 0 25px 0';
            tooltipContent.style.paddingTop = '15px';
            tooltipContent.style.color = '#555555';
            tooltipDiv.appendChild(tooltipContent);

            // 创建关闭按钮元素并设置样式使其为红色X并位于右上角
            var closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '4px';
            closeButton.style.right = '18px';
            closeButton.style.color = '#ff5252';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontFamily = '微软雅黑';
            closeButton.style.fontSize = '24px';
            closeButton.style.transition = 'color 0.2s ease, transform 0.2s ease';
            closeButton.addEventListener('click', function () {
                tooltipDiv.parentNode.removeChild(tooltipDiv);
            });
            closeButton.onmouseover = function () {
                this.style.color = '#ff3b3b';
                this.style.transform = 'scale(1.1)';
            };
            closeButton.onmouseout = function () {
                this.style.color = '#ff5252';
                this.style.transform = 'scale(1)';
            };
            tooltipDiv.appendChild(closeButton);

            // 创建按钮容器，用于放置按钮，方便用 flex 布局管理间距
            var buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.width = '100%';

            // 创建打开关注页按钮元素并设置样式和链接地址
            var openButton = document.createElement('button');
            openButton.href = targetUrl;
            openButton.textContent = '打开关注页';
            openButton.style.marginTop = '20px';
            openButton.style.padding = '10px 20px';
            openButton.style.backgroundColor = '#3498db';
            openButton.style.color = '#ffffff';
            openButton.style.border = 'none';
            openButton.style.borderRadius = '6px';
            openButton.style.cursor = 'pointer';
            openButton.style.fontFamily = '华文楷体';
            openButton.style.fontSize = '18px';
            openButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
            openButton.addEventListener('click', function () {
                window.open(targetUrl, '_blank');
            });
            buttonContainer.appendChild(openButton);

            // 创建空白占位元素，模拟四个字的间距
            var spacer = document.createElement('span');
            spacer.style.width = '0px';
            buttonContainer.appendChild(spacer);

            // 将粘贴结果按钮添加到按钮容器
            buttonContainer.appendChild(pasteButton);

            // 将按钮容器添加到提示框中
            tooltipDiv.appendChild(buttonContainer);

            // 将提示框添加到页面主体元素中
            document.body.appendChild(tooltipDiv);

            // 将targetUrl输出到控制台
            console.log('用户关注页URL:', targetUrl);
             });


                } else if (window.location.href.startsWith('https://space.bilibili.com/')) {
        window.addEventListener('load', function () {
            console.log('页面已触发load事件，开始执行后续脚本逻辑');

            // 创建提示框元素
            var tooltipDiv = document.createElement('div');
            tooltipDiv.style.position = 'fixed';
            tooltipDiv.style.top = '50%';
            tooltipDiv.style.left = '50%';
            tooltipDiv.style.transform = 'translate(-50%, -50%)';
            tooltipDiv.style.backgroundColor = '#ffffff';
            tooltipDiv.style.border = '1px solid #e0e0e0';
            tooltipDiv.style.padding = '20px';
            tooltipDiv.style.zIndex = '9999';
            tooltipDiv.style.width = '360px';
            tooltipDiv.style.borderRadius = '10px';
            tooltipDiv.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            tooltipDiv.style.textAlign = 'center';
            tooltipDiv.style.fontFamily = '微软雅黑';

            // 创建提示内容段落元素
            var tooltipContent = document.createElement('p');
            tooltipContent.textContent = '已获取到关注分组等相关信息，点击复制结果，返回动态页点击粘贴结果便成功执行动态分组显示脚本';
            tooltipContent.style.textAlign = 'justify';
            tooltipContent.style.fontFamily = '微软雅黑';
            tooltipContent.style.fontSize = '18px';
            tooltipContent.style.margin = '0 0 25px 0';
            tooltipContent.style.paddingTop = '15px';
            tooltipContent.style.color = '#555555';
            tooltipDiv.appendChild(tooltipContent);

            // 创建关闭按钮元素并设置样式使其为红色X并位于右上角
            var closeButton = document.createElement('span');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '4px';
            closeButton.style.right = '18px';
            closeButton.style.color = '#ff5252';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontFamily = '微软雅黑';
            closeButton.style.fontSize = '24px';
            closeButton.style.transition = 'color 0.2s ease, transform 0.2s ease';
            closeButton.addEventListener('click', function () {
                tooltipDiv.parentNode.removeChild(tooltipDiv);
            });
            closeButton.onmouseover = function () {
                this.style.color = '#ff3b3b';
                this.style.transform = 'scale(1.1)';
            };
            closeButton.onmouseout = function () {
                this.style.color = '#ff5252';
                this.style.transform = 'scale(1)';
            };
            tooltipDiv.appendChild(closeButton);

            // 创建复制结果按钮元素并设置样式
            var copyButton = document.createElement('button');
            copyButton.textContent = '复制结果';
            copyButton.style.marginTop = '20px';
            copyButton.style.padding = '10px 20px';
            copyButton.style.backgroundColor = '#4CAF50';
            copyButton.style.color = '#ffffff';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '6px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.fontFamily = '华文楷体';
            copyButton.style.fontSize = '18px';
            copyButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
            copyButton.addEventListener('click', function () {
                var result = "";
                var liElements = document.querySelectorAll('li.follow-item');
                for (var i = 0; i < liElements.length; i++) {
                    var tagid = liElements[i].getAttribute('tagid');
                    var aElement = liElements[i].querySelector('a');
                    var title = aElement? aElement.title : null;
                    if (tagid && title) {
                        result += "tagid: " + tagid + ", title: " + title + "\n";
                    }
                }
                // 创建临时文本区域元素用于复制内容到剪贴板
                var textarea = document.createElement('textarea');
                textarea.value = result;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                console.log('已复制结果到剪贴板');
            });
            tooltipDiv.appendChild(copyButton);

            // 将提示框添加到页面主体元素中
            document.body.appendChild(tooltipDiv);

            setTimeout(function () {
                var liElements = document.querySelectorAll('li.follow-item');
                console.log('获取到的li元素数量：', liElements.length);
                for (var i = 0; i < liElements.length; i++) {
                    var tagid = liElements[i].getAttribute('tagid');
                    var aElement = liElements[i].querySelector('a');
                    var title = aElement? aElement.title : null;
                    if (tagid && title) {
                        console.log('tagid:', tagid, 'title:', title);
                    }
                }
            }, 3000);
        });
    }
})();