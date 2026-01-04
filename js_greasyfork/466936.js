// ==UserScript==
// @name         Bangumi动画推荐
// @namespace    https://bgm.tv/group/topic/382147
// @version      1.3
// @description  在页面上添加动画推荐
// @author       klion
// @match        https://bgm.tv
// @match        https://bangumi.tv
// @match        https://chii.in
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466936/Bangumi%E5%8A%A8%E7%94%BB%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/466936/Bangumi%E5%8A%A8%E7%94%BB%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var div2 = document.getElementById('home_tml');  
        var containerDiv = document.createElement('div');  // 创建一个容器div

        // 设置容器div的样式
        containerDiv.style.border = '1px solid #ccc';  // 设置边框
        containerDiv.style.borderRadius = '10px';  // 设置边框圆角
        containerDiv.style.padding = '10px';  // 添加内边距
        containerDiv.style.marginBottom = '20px';  // 在div2和containerDiv之间添加一些空间

        // 在containerDiv的左上角添加文本"推荐动漫"
        var headerDiv = document.createElement('div');
        headerDiv.style.fontWeight = 'bold';  // 设置字体为粗体
        headerDiv.style.marginBottom = '10px';  // 在headerDiv和categoryDiv之间添加一些空间
        headerDiv.textContent = '推荐动漫';
        containerDiv.appendChild(headerDiv);  // 将headerDiv添加到containerDiv中

        div2.insertAdjacentElement('afterend', containerDiv);  

        var imgElement = document.querySelector('a.avatar span.ll');
        var style = imgElement.getAttribute('style');

        // 使用正则表达式匹配用户数字ID
        var regex = /\/(\d+)\.jpg/;
        var match = style.match(regex);
        var userId;

        if (match) {
            userId = match[1];  
        }

        var apiUrl = `https://bgmrec.top/api/rec/${userId}/`;
        var token = "qjUW7T2CxPOC8AN8PjHR40zukQv0NYObZgUBKHur";

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                for (var category in data) {
                    var subjects = data[category];  // 获取该类别的所有subjects

                    var categoryDiv = document.createElement('div');  // 创建一个新的div来展示该类别的subjects
                    categoryDiv.id = category;  // 给这个div设置一个唯一的id
                    categoryDiv.style.display = 'flex';
                    categoryDiv.style.overflowX = 'auto';

                    subjects.forEach(subjectId => {
                    fetch(`https://api.bgm.tv/v0/subjects/${subjectId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }).then(response => response.json())
                            .then(data => {
                                var name = data.name;  // 动漫的名字
                                var image = data.images.large;  // 动漫的图片URL

                                var subjectDiv = document.createElement('div');  // 创建一个新的div来展示这个subject
                                subjectDiv.style.flex = '0 0 auto';
                                subjectDiv.style.width = '100px';
                                subjectDiv.style.marginRight = '5px';
                                subjectDiv.style.border = '1px solid #ccc';  // 设置边框
                                subjectDiv.style.borderRadius = '10px';  // 设置边框圆角

                                subjectDiv.innerHTML = `
                                    <div style="text-align: center">
                                        <a href="https://bgm.tv/subject/${subjectId}">
                                            <img src="${image}" alt="${name}" style="width: 100%; border-radius: 10px;">
                                        </a>
                                    </div>
                                `;

                                categoryDiv.appendChild(subjectDiv);  // 将这个subject添加到该类别的div中
                            });
                    });

                    containerDiv.appendChild(categoryDiv);  // 将这个类别的div添加到容器div中
                }
            });
    });
})();
