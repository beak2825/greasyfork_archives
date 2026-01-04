// ==UserScript==
// @name         米游社刷新提醒工具
// @namespace    https://greasyfork.org/users/1345081
// @version      0.2.2
// @description  用于米游社电脑网页的甲板、候车室、酒馆、咖啡馆、律所、学园、大别野等模块的最新发帖页面自动页内刷新的工具，可以检索关键词并发声提醒你，在最新发帖页刷新页面即可启用脚本，用于获得最新一手的消息进行回复或处理。可以设置正则表达式检索和刷新时间间隔,正则表达式检索到结果后，可以进行一键复制。
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAD/2FkI/9hZSv/YV5P/3W+19cOaxvzv6NX////g///+6v///vL///74///+/P/////////+///+6v///Yn//vkT/9hZfP/YWe7/2Ff//tx7//XFpv/++vj////////////////////////////////////////////////6///9kP/YWej/2Fn//9lY//zXiP/2zrf///////zw6f/649b////////////////////////////////////////+/e3/2Fn9/9hZ///ZWv/6043/99PB///////2zLT/99C5/////////////////////////////////////v/42Mb+/9hZ///YWf//2Fj//NiJ//XIrv///f3//fPt//759v////////////328f/52sn///79///////76d7/87yY///YWf3/2Fn//9lb//7ikf/3zbD/+NfE///9/P/////////////////53c3/9MOn///////++/r/9cOl//vXkf3/2Fn7/9hX//7cdP/1w5z/9cWm//XIrf/2zLX//PDq/////v///////vn2//749f//////+d3P//fGkf//3Wn6/9hZ9//YWP/82IP/9suu//vWo//1w6H/+daq//XCmf/2y7P/+uHT//zv6P/99fH/++zk//TBoP/92n7//9hX9f/YWfL/2Vn/+9OK//jSt///7Lz/9cWk//3bfv//3G//+9iZ//XEp//0wqb/9cen//bEmv/7147//9pe///YWe//2Fnr/9pb//nPiv/52sf//vLa//XFof/+23L//9lX//vVjv/1wqH/9cKY//jSrv//4H///9lb///YWP//2Fnn/9hZ4//aW//5zon/+dzN//739P/2xZz//9tr///aX//4y5T/+t7C//7nuP/1xKP//tt4///YV///2Fn//9hZ3f/YWdb/2Fj//NaB//XIrf/76eH/9sSZ///baP//22P/98iX//zkyv/+7Mb/9sen//7cdf//2Ff//9hZ///YWdD/2Fm4/9hY///aY//60oz/9L2Z//fIlP//22P//9tk//fImP/87eP//vfv//bHo///3HH//9hX///YWf//2Fm+/9hZaf/YWff/2Fj//9pe//7bdf/+23D//9hZ///bYf/3ypb/++ng//759v/1xqH//9xx///YV///2Fn//9hZof/YWQz/2Fl5/9hZ1v/YWfH/2Ff8/9hY///YWf//2Vr/+9WM//XIr//76N7/9cOd///ccv//2Ff//9hZ8//YWVv/2FkA/9hZAv/YWRz/2FlD/9hZav/YWY3/2Fmr/9hYxf/ca9n50prp9L+f9ffJnf3/3Gn9/9hY5f/YWXz/2FkKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAA==
// @author       zhangqiang
// @license      MIT
// @match        https://www.miyoushe.com/ys/home/26?type=2
// @match        https://www.miyoushe.com/bh2/home/30?type=2
// @match        https://www.miyoushe.com/bh3/home/1?type=2
// @match        https://www.miyoushe.com/sr/home/52?type=2
// @match        https://www.miyoushe.com/wd/home/37?type=2
// @match        https://www.miyoushe.com/zzz/home/57?type=2
// @match        https://www.miyoushe.com/dby/home/54?type=2
// @match        https://www.miyoushe.com/dby/home/35?type=2
// @match        https://www.miyoushe.com/dby/home/34?type=2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502734/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%88%B7%E6%96%B0%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/502734/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%88%B7%E6%96%B0%E6%8F%90%E9%86%92%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 音效URL
    const soundUrl = "https://uploadstatic.mihoyo.com/ys-obc/2022/05/12/8797197/429281fded26a537aa7c33319fa6e388_172369884487879995.mp3";

    // 创建设置表单的容器
    const settingsContainer = document.createElement('div');
    settingsContainer.style.position = 'fixed';
    settingsContainer.style.right = '20px';
    settingsContainer.style.bottom = '50px';
    settingsContainer.style.backgroundColor = 'white';
    settingsContainer.style.padding = '10px';
    settingsContainer.style.borderRadius = '5px';
    settingsContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    settingsContainer.style.zIndex = '9999'; // 确保表单在顶层
    settingsContainer.style.width = '200px'; // 调整容器宽度
    document.body.appendChild(settingsContainer);

    // 创建表单
    const settingsForm = document.createElement('form');
    settingsForm.style.display = 'flex'; // 使用Flexbox布局
    settingsForm.style.flexDirection = 'column'; // 垂直排列子元素
    settingsContainer.appendChild(settingsForm);

    // 创建关键词输入框
    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.placeholder = '输入关键词，用逗号分隔';
    keywordInput.style.width = '100%'; // 使输入框宽度适应容器
    keywordInput.style.marginBottom = '10px';
    settingsForm.appendChild(keywordInput);

    // 创建时间间隔输入框
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.placeholder = '10 second';
    intervalInput.style.width = '90px';
    intervalInput.style.marginBottom = '10px';
    settingsForm.appendChild(intervalInput);

    // 创建正则表达式勾选框和标签
    const regexContainer = document.createElement('div');
    regexContainer.style.display = 'flex';
    regexContainer.style.alignItems = 'center';

    const regexCheckbox = document.createElement('input');
    regexCheckbox.type = 'checkbox';
    regexCheckbox.id = 'regexCheckbox';
    regexCheckbox.style.marginRight = '5px';

    const regexLabel = document.createElement('label');
    regexLabel.htmlFor = 'regexCheckbox';
    regexLabel.textContent = '使用正则表达式';

    regexContainer.appendChild(regexCheckbox);
    regexContainer.appendChild(regexLabel);
    settingsForm.appendChild(regexContainer); // 将整个容器添加到表单中

    // 创建复制到剪贴板勾选框和标签
    const copyContainer = document.createElement('div');
    copyContainer.style.display = 'flex';
    copyContainer.style.alignItems = 'center';
    copyContainer.style.marginTop = '10px'; // 稍微留点空间

    const copyCheckbox = document.createElement('input');
    copyCheckbox.type = 'checkbox';
    copyCheckbox.id = 'copyCheckbox';
    copyCheckbox.style.marginRight = '5px';

    const copyLabel = document.createElement('label');
    copyLabel.htmlFor = 'copyCheckbox';
    copyLabel.textContent = '启用复制到剪贴板';


    copyContainer.appendChild(copyCheckbox);
    copyContainer.appendChild(copyLabel);
    settingsForm.appendChild(copyContainer); // 将整个容器添加到表单中

    let enableCopyToClipboard = false; // 默认不启用复制到剪贴板

    // 创建关键词高亮勾选框和标签
    const highlightContainer = document.createElement('div');
    highlightContainer.style.display = 'flex';
    highlightContainer.style.alignItems = 'center';
    highlightContainer.style.marginTop = '10px';

    const highlightCheckbox = document.createElement('input');
    highlightCheckbox.type = 'checkbox';
    highlightCheckbox.id = 'highlightCheckbox';
    highlightCheckbox.style.marginRight = '5px';

    const highlightLabel = document.createElement('label');
    highlightLabel.htmlFor = 'highlightCheckbox';
    highlightLabel.textContent = '启用关键词高亮';

    highlightContainer.appendChild(highlightCheckbox);
    highlightContainer.appendChild(highlightLabel);
    settingsForm.appendChild(highlightContainer); // 将整个容器添加到表单中

    let enableHighlight = false; // 默认不启用关键词高亮


    // 添加一个用于高亮文本的函数
    const highlightText = (bodyText, keywords, useRegex) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = bodyText;
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let currentNode;
        while ((currentNode = walker.nextNode())) {
            let text = currentNode.textContent;
            for (const keyword of keywords) {
                let regexPattern = useRegex ? new RegExp(keyword.trim(), 'gi') : new RegExp(keyword.trim(), 'gi');
                let match;
                while ((match = regexPattern.exec(text)) !== null) {
                    let matchText = match[0];
                    let span = document.createElement('span');
                    span.style.backgroundColor = 'yellow'; // 设置为黄色高亮
                    span.textContent = matchText;

                    // 使用range和surroundContents替换文本节点
                    let range = document.createRange();
                    range.setStart(currentNode, match.index);
                    range.setEnd(currentNode, match.index + matchText.length);
                    let frag = range.extractContents();
                    span.appendChild(frag);
                    range.insertNode(span);

                    // 由于已经修改了DOM，需要更新text和index
                    text = currentNode.textContent;
                    regexPattern.lastIndex = 0; // 重置lastIndex
                }
            }
        }

        // 将修改后的HTML内容设置回body（这里可能需要更复杂的逻辑来处理实际页面结构）
        // 这里为了简化，我们假设可以直接替换body的innerHTML（实际使用时可能需要更精细的控制）
        document.body.innerHTML = tempDiv.innerHTML;
    };


    // 创建删除footer勾选框和标签
    const removeFooterContainer = document.createElement('div');
    removeFooterContainer.style.display = 'flex';
    removeFooterContainer.style.alignItems = 'center';
    removeFooterContainer.style.marginTop = '10px';

    const removeFooterCheckbox = document.createElement('input');
    removeFooterCheckbox.type = 'checkbox';
    removeFooterCheckbox.id = 'removeFooterCheckbox';
    removeFooterCheckbox.style.marginRight = '5px';

    const removeFooterLabel = document.createElement('label');
    removeFooterLabel.htmlFor = 'removeFooterCheckbox';
    removeFooterLabel.textContent = '隐藏页面底部（footer）';

    removeFooterContainer.appendChild(removeFooterCheckbox);
    removeFooterContainer.appendChild(removeFooterLabel);
    settingsForm.appendChild(removeFooterContainer); // 将整个容器添加到表单中

    let removeFooter = false; // 默认不删除footer


    // 监听复选框的变化
    removeFooterCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // 删除footer
            const footerElements = document.querySelectorAll('.footer');
            footerElements.forEach(footer => {
                footer.remove();
            });

            // 如果需要，在这里添加代码来隐藏或删除复选框和标签
            // 例如，隐藏整个容器
            removeFooterContainer.style.display = 'none';

            // 或者从DOM中移除整个容器
            // settingsForm.removeChild(removeFooterContainer);
        }

    });

    // 创建复制关键词到剪贴板的按钮
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = '复制关键词';
    copyButton.style.width = '100%';
    copyButton.style.backgroundColor = '#28a745';
    copyButton.style.color = 'white';
    copyButton.style.padding = '10px';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.display = 'none'; // 默认不显示
    copyButton.id = 'copyButton'; // 设置ID
    copyButton.classList.add('copy-button'); // 设置类名
    settingsForm.appendChild(copyButton); // 将按钮添加到表单中

    // 自动点击复制关键词按钮的函数
    function autoClickCopyButton() {
      // 使用延迟执行，确保DOM元素已经加载完成
      setTimeout(function() {
        const button = document.getElementById('copyButton');
        if (button) {
          button.click(); // 触发点击事件
        }
      }, 1000); // 等待1秒后执行点击
    }


    // 监听复制到剪贴板勾选框的变化
    copyCheckbox.addEventListener('change', function() {
        if (this.checked) {
            copyButton.style.display = 'block'; // 勾选时显示按钮
        } else {
            copyButton.style.display = 'none'; // 未勾选时隐藏按钮
        }
    });

    // 复制按钮的点击事件
    copyButton.addEventListener('click', function() {
        // 假设我们有一个全局变量或方法来获取当前页面中的文本
        // 这里为了示例，我们直接使用document.body.textContent
        // 在实际应用中，你可能需要更精确地定位到包含关键词的文本部分
        const bodyText = document.body.textContent;
        const copied = checkKeywords(bodyText); // 调用checkKeywords函数并尝试复制

    });


    // 创建开始按钮
    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.textContent = '开始自动刷新';
    startButton.style.width = '100%';
    startButton.style.backgroundColor = '#007bff';
    startButton.style.color = 'white';
    startButton.style.padding = '10px';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.id = 'startButton';
    settingsForm.appendChild(startButton);

    // 检查startButton的文字，并更改样式
    function checkStartButtonTextChange() {
      const startButton = document.getElementById('startButton');
      if (startButton.textContent.trim() === '开始自动刷新') {
        startButton.style.backgroundColor = '#007bff'; // 更改背景颜色为蓝色
        //autoClickCopyButton();
      } else if (startButton.textContent.trim() === '停止自动刷新') {
        startButton.style.backgroundColor = 'red'; // 更改背景颜色为红色
      }
    }

    // 定义一个定时器来定期检查startButton的文字
    //let buttonTextCheckInterval = setInterval(checkStartButtonTextChange, 1000); // 每秒检查一次


    let intervalId = null;
    let isRunning = false;
    let keywords = [];
    let intervalTime = 10000; // 默认时间间隔为10秒
    let useRegex = false; // 默认不使用正则表达式

    // 更新设置
    const updateSettings = () => {
        keywords = keywordInput.value.split(',');
        intervalTime = parseInt(intervalInput.value, 10) * 1000 || 10000;
        useRegex = regexCheckbox.checked;
        enableCopyToClipboard = copyCheckbox.checked; // 更新是否启用复制到剪贴板
    };



    // 检查关键词是否存在（根据是否使用正则表达式）
    const checkKeywords = (bodyText) => {
      for (const keyword of keywords) {
        let matchText = '';
        if (useRegex) {
          const regexPattern = new RegExp(keyword.trim(), 'gi');
          let match;
          while ((match = regexPattern.exec(bodyText)) !== null) {
            matchText = match[0];
            break;
          }
          if (matchText) {
            // 找到了关键词，返回 true 表示需要停止刷新
            return { stop: true, keyword: matchText };
          }
        } else {
          if (bodyText.includes(keyword.trim())) {
            // 找到了关键词，返回 true 表示需要停止刷新
            return { stop: true, keyword: keyword.trim() };
          }
        }
      }
      return { stop: false, keyword: '' };
    };



    // 复制文本到剪贴板
    const copyToClipboard = (text) => {
      if (!enableCopyToClipboard) return; // 如果未启用复制到剪贴板，则直接返回

      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        console.log('关键词已复制到剪贴板！');
      } catch (err) {
        console.error('无法复制文本: ', err);
      }

      document.body.removeChild(textarea);
    };

    // 复制按钮的点击事件
    copyButton.addEventListener('click', function() {
      // 获取当前页面中的文本
      const bodyText = document.body.textContent;

      // 调用checkKeywords函数并尝试复制
      const { stop, keyword } = checkKeywords(bodyText);

      if (stop) {
        copyToClipboard(keyword); // 直接调用复制函数
      } else {
        copyToClipboard(keyword);
      }
    });


    // 确保页面加载完成后再检查关键词
    const waitForPageLoadAndCheckKeywords = () => {
        setTimeout(() => {
            const bodyText = document.body.textContent;
            const { stop, keyword } = checkKeywords(bodyText);
            if (stop) {
                clearInterval(intervalId);
                isRunning = false;
                startButton.textContent = '开始自动刷新';

                // 播放音效
                const audio = new Audio(soundUrl);
                audio.play();

                // 复制关键词到剪贴板
                autoClickCopyButton();
                copyToClipboard(keyword);
            }
        }, 500); // 假设页面加载需要最多3秒
    };

    startButton.addEventListener('click', function() {
        updateSettings();

        if (isRunning) {
            clearInterval(intervalId);
            startButton.textContent = '开始自动刷新';
            isRunning = false;
        } else {
            intervalId = setInterval(() => {
                const latestPostButton = document.querySelector('.mhy-tab__label');
                if (latestPostButton && latestPostButton.textContent === '最新发帖') {
                    latestPostButton.click();
                    waitForPageLoadAndCheckKeywords(); // 页面加载完成后检查关键词
                }
            }, intervalTime);
            startButton.textContent = '停止自动刷新';
            isRunning = true;
        }
    });
})();