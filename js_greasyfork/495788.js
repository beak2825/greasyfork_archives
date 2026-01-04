// ==UserScript==
// @name         欣师网校视频权限获取
// @namespace    https://greasyfork.org/zh-CN/scripts/495788-%E6%AC%A3%E5%B8%88%E7%BD%91%E6%A0%A1%E8%A7%86%E9%A2%91%E6%9D%83%E9%99%90%E8%8E%B7%E5%8F%96
// @version      0.8
// @description  获取欣师网校播放权限
// @author       山里有只老虎
// @match        https://www.xs507.com/package/show/id/*
// @match        https://www.xs507.com/package/views/id/*
// @match        https://www.xs507.com/Home/package/show/id/*
// @match        https://www.xs507.com/Home/package/views/id/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/495788/%E6%AC%A3%E5%B8%88%E7%BD%91%E6%A0%A1%E8%A7%86%E9%A2%91%E6%9D%83%E9%99%90%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/495788/%E6%AC%A3%E5%B8%88%E7%BD%91%E6%A0%A1%E8%A7%86%E9%A2%91%E6%9D%83%E9%99%90%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置键值对的存储
    let videokeyValuePairs = {};
    let filekeyValuePairs = {};
    // 从URL中提取ID
    function getIdFromUrl() {
        const url = window.location.href;
        const idMatch = url.match(/\/id\/(\d+)/);
        return idMatch ? idMatch[1] : null;
    }

    const id = getIdFromUrl();

    if (id) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.xinxuejy.com/api/course/detail?classId=all&id=${id}&type=package`,
            onload: function(response) {
                if (response.status === 200) {
                    // 解析json数据
                    let jsonData = JSON.parse(response.responseText);
                    // 获取classes的长度
                    let classes = jsonData.data.classes;
                    for (let i = 0; i < classes.length; i++) {
                        let clazzArray = classes[i].clazz;
                        for (let j = 0; j < clazzArray.length; j++) {
                            let lessons = clazzArray[j].lessons;
                            let jiangyi=clazzArray[j].jiangyi;
                            //获取视频的键值对
                            for (let t = 0; t < lessons.length; t++) {
                                let lessonId = lessons[t].id;
                                let videoid = lessons[t].high_video;
                                videokeyValuePairs[lessonId] = videoid;
                            }
                            //获取讲义文件的键值对
                           for (let t = 0; t < jiangyi.length; t++) {
                                let filename = jiangyi[t].name;
                                let file_url = jiangyi[t].file_url;
                                filekeyValuePairs[filename] = file_url;
                            }
                        }
                    }
                    // 修改页面值
                    modifyLessonItems();
                } else {
                    alert('Failed to fetch data: ' + response.statusText);
                }
            },
            onerror: function() {
                alert('Error occurred while making the request.');
            }
        });
    } else {
        alert('Could not extract ID from URL.');
    }

    // Function to modify lesson items
    function modifyLessonItems() {
        //替换所有的视频的值
        let lessonItems = document.querySelectorAll('li.lesson_item');
        lessonItems.forEach(function(item) {
            let anchor = item.querySelector('a[data-free][data-id]');
            if (anchor) {
                anchor.setAttribute('data-free', '1');
                let dataId = anchor.getAttribute('data-id');
                if (dataId && videokeyValuePairs[dataId] && !anchor.hasAttribute('data-video')) {
                    anchor.setAttribute('data-video', videokeyValuePairs[dataId]);
                }
            }
        });
//替换所有的讲义的值
    // 选择所有的目标<a>标签
    const menuItems = document.querySelectorAll('.menu-big.menu_all.tabBox > li > a, .menu-big.menu_all.tabBox .menu-sub.Chapter li a');
    // 遍历所有选中的<a>标签
    menuItems.forEach((item) => {
        // 获取<a>标签的文本内容
        const textContent = item.textContent;

        // 如果文本内容在字典中，则替换它的href属性
        if (textContent in filekeyValuePairs) {
            item.href = filekeyValuePairs[textContent];
            item.target = '_blank';
        }
    });




    }

    // Use MutationObserver to monitor DOM changes and dynamically modify new content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                modifyLessonItems();
            }
        });
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });
})();
