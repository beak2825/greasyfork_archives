// ==UserScript==
// @name         UCAS 小助
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       3hex
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateCourse/*
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateTeacher/*
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/evaluateTeacher/*
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/evaluateCourse/*
// @match        https://v.ucas.ac.cn/course/getplaytitle.do?menuCode=*
// @match        http://iclass.ucas.edu.cn*/ve/back/rp/common/rpIndex.shtml*
// @icon         https://www.cas.cn/zj/yk/201410/W020141017344514407759.jpg
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/479167/UCAS%20%E5%B0%8F%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/479167/UCAS%20%E5%B0%8F%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const regex0 = /^https:\/\/xkcts\.ucas\.ac\.cn:8443\/evaluate\/.*?/;
    const regex1 = /^https:\/\/jwxk\.ucas\.ac\.cn\/evaluate\/.*?/;
    const regex2 = /^https:\/\/v\.ucas\.ac\.cn\/course\/getplaytitle\.do\?menuCode=.*?/;
    const regex3 = /^http:\/\/iclass\.ucas\.edu\.cn*\/ve\/back\/rp\/common\/rpIndex\.shtm*/;
    document.addEventListener("DOMContentLoaded", function() {
        var video = document.getElementById('my_video_1_html5_api');
        if (video) {
            video.addEventListener('loadeddata', function() {
                var duration = this.duration; // 视频的总时长（秒）
                console.log('视频时长：' + duration + '秒');
            });
        } else {
            console.error('无法找到视频元素。');
        }
    });

    // sep自动填写评价

    if (regex0.test(currentUrl)) {
        console.log('自动评价 new');
        document.querySelectorAll('input[type="radio"].required[value="5"]').forEach((el) => el.checked = true);
        Array.from(document.querySelectorAll('textarea')).forEach(el => { el.value = ' 无'; el.removeAttribute('minlength'); });
        document.querySelector('.required.radio').checked = true;document.querySelector('.required.checkbox').checked = true;
    }
    // 老 sep自动填写评价
    else if (regex1.test(currentUrl)) {
        console.log('自动评价');
        document.querySelectorAll('input[type="radio"].required[value="5"]').forEach((el) => el.checked = true);
        Array.from(document.querySelectorAll('textarea')).forEach(el => { el.value = ' 无'; el.removeAttribute('minlength'); });
        document.querySelector('.required.radio').checked = true;document.querySelector('.required.checkbox').checked = true;
    }
    // 老的实景课堂
    else if (regex2.test(currentUrl)) {
        console.log('实景课堂');

        var courseListDiv = document.querySelector('.b-courselist.m-coursebox');
        if (courseListDiv) {
            var ulElements = courseListDiv.querySelectorAll('ul');
            var hrefArray = [];

            ulElements.forEach(function(ulElement) {
                var liElements = ulElement.querySelectorAll('li:not([class])');
                liElements.forEach(function(liElement) {
                    var linkElement = liElement.querySelector('a');
                    if (linkElement && linkElement.href) {
                        hrefArray.push(linkElement.href);

                        if(linkElement.href == currentUrl || linkElement.href+"#link_href" == currentUrl)
                        {
                            liElement.style.backgroundColor = "yellow";
                            liElement.style.color = "black";
                        }
                    }
                });
            });

            // 获取当前 URL 在数组中前一个和后一个 URL
            var currentIndex = hrefArray.indexOf(currentUrl);
            var previousUrl = currentIndex < hrefArray.length - 1 ? hrefArray[currentIndex + 1] : null;
            var nextUrl = currentIndex > 0 ? hrefArray[currentIndex - 1] : null;

        } else {
            console.log('Course list div not found.');
        }

        var div = document.querySelector('.bc-play');
        if (div) {
            // 创建第一个a标签
            var link1 = document.createElement('a');
            if(previousUrl == null)
            {
                link1.href = '#';
                link1.style.color = 'red';   // 修改文字颜色为红色
                link1.textContent = ':)';
                link1.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止默认行为
                });
            }else
            {
                link1.href = previousUrl;
                link1.textContent = '上一个';
            }
            link1.style.padding = '10px'; // 添加内边距，使边框与文字之间有一定距离

            // 创建第二个a标签
            var link2 = document.createElement('a');
            if(nextUrl == null)
            {
                link2.href = '#';
                link2.textContent = ':)';
                link2.style.color = 'red';   // 修改文字颜色为红色
                link2.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止默认行为
                });
            }else
            {
                link2.href = nextUrl;
                link2.textContent = '下一个';
            }
            link2.style.padding = '10px'; // 添加内边距，使边框与文字之间有一定距离

            var link3 = document.createElement('a');
            link3.textContent = '居中 '+ (hrefArray.length-currentIndex) + "/" + hrefArray.length;
            link3.href = '#link_href';
            link3.style.padding = '10px'; // 添加内边距，使边框与文字之间有一定距离

            var regex = /code=([^&]+)/;
            var match = regex.exec(currentUrl);
            if (match) {
                var codeValue = match[1];
                console.log("code的属性值为：" + codeValue);
                var link4 = document.createElement('a');
                link4.textContent = '返回简介';
                link4.href = 'https://v.ucas.ac.cn/course/CourseIndex.do?menuCode=2&courseid='+codeValue;
                link4.style.padding = '10px'; // 添加内边距，使边框与文字之间有一定距离
            } else {
                console.log("未找到匹配的code属性值。");
            }

            // 在div的右边添加a标签
            var container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'flex-end';
            container.style.position = 'absolute';
            container.style.top = '70%';
            container.style.right = '18%';
            container.style.transform = 'translateY(-50%)';
            container.appendChild(link4);
            container.appendChild(link3);
            container.appendChild(link1);
            container.appendChild(link2);

            div.appendChild(container);
        }
    }
    // 教学云平台，添加下载按钮
    else if (regex3.test(currentUrl))
    {console.log('局部加载发生了');
        (function(open) {
            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                this.addEventListener("readystatechange", function() {
                    if( this.readyState === 4) { // 当请求已完成
                        try {
                            var data = JSON.parse(this.responseText);
                            // 在这里处理返回的 JSON 数据
                        } catch(e) {}
                    }
                }, false);
                open.call(this, method, url, async, user, password);
            };
        })(XMLHttpRequest.prototype.open);
    }

   /* var loadCounter = 0;
    function onPartialLoad() {
        console.log('局部加载发生了');

        loadCounter++;

        if (loadCounter === 2) {
            console.log('两次局部加载已经完成');
             // 设定延迟时间为500毫秒（500ms）
            setTimeout(function() {
                console.log("教学云平台");
                var titleList = document.querySelectorAll('ul.re-title.re-wtlist.clearfloat');
                var promises = [];  // 保存 Promise 的数组
                var elements = [];  // 保存 liElement 的数组
                var valList = [];  // 保存 liElement 的数组

                for (var i = 0; i < titleList.length; i++) {
                    var items = titleList[i].querySelectorAll('li.re-in input');

                    for (var j = 0; j < items.length; j++){
                        var val = items[j].getAttribute('value');
                        var liElement = titleList[i].querySelector('li.re-cz.re-licz');
                        elements.push(liElement); // 保存 liElement

                        var promise = fetch('http://iclass.ucas.edu.cn:88/ve/back/course/courseInfo.shtml?method=getStreamUrlByRpId', {
                            method: 'POST',
                            headers: {
                                'Accept-Encoding': 'gzip, deflate',
                                'Accept-Language': 'zh-CN,zh;q=0.9',
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'Host': 'iclass.ucas.edu.cn:88',
                                'Origin': 'http://iclass.ucas.edu.cn:88',
                                'Referer': 'http://iclass.ucas.edu.cn:88/ve/back/rp/common/rpIndex.shtml?method=rpCourseVideo&contentWay=3&dataSource=3&videoType=3&rpId='+ val +'&type=3&downloadType=2',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: 'rpId=' + val + '&uLevel=2&noClick=1' // 你需要替换到你实际的数据
                        }).then(response => response.json());
                        promises.push(promise); // 保存 Promise
                    }
                }

                // 等待所有 Promise 完成
                Promise.all(promises).then(results => {
                    // 遍历结果，为每个 liElement 创建并添加 a 元素
                    results.forEach((data, index) => {
                        var openPath = data.result.openPath;
                        var a = document.createElement('a');
                        a.href = openPath;
                        a.innerText = '下载';
                        elements[index].appendChild(a);  // 将新建的 a 标签添加到对应的 liElement 中
                    });
                }).catch((error) => {
                    console.error('Error:', error);
                });

            }, 200); // 延迟500ms执行
            loadCounter = 0;
        }
    } */


    window.scrollTo(0, 230);

    var titleDiv = document.querySelector('.bc-h');
    if(titleDiv)
    {
        var link_href = document.createElement('a');
        link_href.name = 'link_href';
        titleDiv.appendChild(link_href);
    }


})();