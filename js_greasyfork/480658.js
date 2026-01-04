// ==UserScript==
// @name        让我看看你说了啥 - drrr.com
// @namespace   Violentmonkey Scripts
// @match       https://drrr.com/room/
// @grant       none
// @version     1.0
// @author      -
// @description 2023/11/23 15:03:33
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480658/%E8%AE%A9%E6%88%91%E7%9C%8B%E7%9C%8B%E4%BD%A0%E8%AF%B4%E4%BA%86%E5%95%A5%20-%20drrrcom.user.js
// @updateURL https://update.greasyfork.org/scripts/480658/%E8%AE%A9%E6%88%91%E7%9C%8B%E7%9C%8B%E4%BD%A0%E8%AF%B4%E4%BA%86%E5%95%A5%20-%20drrrcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取页面中的人名、文本和时间
    function extractConversations(queryName) {
        var talkNodes = document.querySelectorAll('dl.talk,div.talk.me');

        var conversations = [];
        for (var talkNode of talkNodes) {
            // 处理匹配的元素节点
            var nameNode = talkNode.querySelector('dt div.name span.select-text');
            var textNode = talkNode.querySelector('dd div.bubble p.select-text');
            var text = ''
            var name = ''
            if(!nameNode || !textNode) {
                name = talkNode.querySelector('span.name').textContent;
                text = talkNode.textContent;
            } else {
                name = nameNode.textContent;
                text = textNode.textContent;
            }
              console.log(name, text)
            if (queryName === name) {
              conversations.push({
                  name: name,
                  text: text
              });
            }

        }
        return conversations.reverse();
    }

    // 创建弹窗并显示人名对话内容
    function showConversations(name) {

        var content = '';
        var conversations = extractConversations(name)
        conversations.forEach(function(conversation) {
            content += conversation.text + '\n';
        });

        alert(content)

    }

    // 创建圆形图标并添加点击触发弹窗事件
    function createIcon() {
        var icon = document.createElement('div');
        icon.id = 'conversations-icon';
        icon.style.position = 'fixed';
        icon.style.bottom = '20px';
        icon.style.right = '20px';
        icon.style.width = '50px';
        icon.style.height = '50px';
        icon.style.borderRadius = '50%';
        icon.style.backgroundColor = '#000000';
        icon.style.color = '#ffffff';
        icon.style.textAlign = 'center';
        icon.style.lineHeight = '50px';
        icon.style.cursor = 'pointer';
        icon.textContent = 'info';

        icon.addEventListener('click', function() {
            var name = prompt('请输入人名');
            if (name) {
                showConversations(name);
            }
        });


        document.body.appendChild(icon);
    }


    // 初始化插件
    function init() {
        createIcon();

    }

    init();
})();