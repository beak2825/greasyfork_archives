// ==UserScript==
// @name         贵州干部网络学院刷课脚本
// @version      0.3
// @description  一个用于贵州干部网络学院刷课 的脚本。
// @author       兔子贵州分兔
// @include      https://gzwy.gov.cn/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/311624
// @downloadURL https://update.greasyfork.org/scripts/478283/%E8%B4%B5%E5%B7%9E%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478283/%E8%B4%B5%E5%B7%9E%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



window.onload = function() {
    var shuake_anniu = document.createElement("div");
    shuake_anniu.style = "line-height: 21px; padding-right: 10px; font-size: 21px; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; background-color: transparent; border: none;";
    shuake_anniu.innerHTML = "<a style='color: #ffffff; text-decoration: none;'>开始刷课</a>";
    var headTitles = document.getElementById("HeadTitles");
    headTitles.appendChild(shuake_anniu);

    shuake_anniu.onclick = shuake;
    var autoShuake = false

    function shuake() {
        var info_div = document.createElement("div");
        info_div.style = "position: fixed;top: 60%;left: 50%;transform: translate(-50%, -50%);background-color: #ffffff;padding: 20px;border: 1px solid #000000;border-radius: 4px;box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);transition: opacity 0.3s ease-in-out;";
        info_div.innerHTML = "<div>开始刷课1</div>";
        var error_div = document.createElement("div");
        error_div.style = "position: fixed;top: 70%;left: 50%;transform: translate(-50%, -50%);background-color: #ffffff;padding: 20px;border: 1px solid #000000;border-radius: 4px;box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);transition: opacity 0.3s ease-in-out;";
        error_div.innerHTML = "<div>错误</div>";
        error_div.style.display = "none";
        var playerDiv = document.getElementById("PlayerInner")

        playerDiv.appendChild(info_div);
        playerDiv.appendChild(error_div)

        alertInfo(info_div,"开始刷课");

        // 获取必修课程列表
        function getCourses()
        {
            var h3Elements = document.querySelectorAll('h3[data-pidx]');
            var courses = [];
            for (var i = 0; i < h3Elements.length; i++) {
                var h3Element = h3Elements[i];
                var hasRequiredText = Array.from(h3Element.childNodes).some(function(node) {
                    return node.textContent.includes('必修');
                });

                if (hasRequiredText) {
                    var nb = h3Element.nextElementSibling
                    if(nb!==null){
                        var siblingElements = Array.from(nb.querySelectorAll('li.kcAllow'));
                        courses = courses.concat(siblingElements);
                    }
                }
            }
            return courses
        }
        var courses = getCourses();
        console.log(courses)
        autoShuake = true;
        var i = 0;

        // 获取当前选择的课程
        function getSelectItem(){
            var liElements = getCourses(); // 获取所有具有 "kcAllow" 类的 <li> 元素
            var selectedIndex = -1; // 初始化选中索引为 -1

            for (var i = 0; i < liElements.length; i++) {
                if (liElements[i].classList.contains('selConListItem')) {
                    selectedIndex = i; // 找到具有 "selConListItem" 类的元素，更新选中索引
                    break; // 找到后终止循环
                }
            }
            return selectedIndex
        }

        //开始看课程
        function processCourse() {
            console.log('查看课程',i);
            var progress = courses[i].querySelector("canvas.com-canvas").getAttribute("data-percent");
            // 只要进度不是100，那就继续开始看它
            if (progress !== "100") {
                clickCourse()
                setTimeout(checkProgress, 2000);
            } else {
                i++;
                if (i < courses.length) {
                    processCourse()
                }
                else{
                    autoShuake = false
                    alert("必修课已经刷完了！");
                }
            }
        }
        function alertInfo(the_div,info){
            console.log(the_div)
            the_div.textContent = info
            // 显示弹窗
            the_div.style.display = "block";

            // 设置定时器，在3秒后隐藏弹窗
            setTimeout(function() {
                the_div.style.display = "none";
            }, 3000);
        }

        //点击课程，如果点击失败10s后自动点击下一次
        function clickCourse(){
            var spanNode = courses[i].querySelector('span');
            console.log(spanNode)
            console.log(courses[i])
            // 检查 span 节点是否存在，并获取其文本内容
            if (spanNode) {
                var title = spanNode.title;
                console.log(title)
                alertInfo(info_div,"点击第"+i+"课:"+title);
            }
            courses[i].querySelector("span").click();
            if(getSelectItem()!==i){
                alertInfo(error_div,"没有点击成功,10s后自动点击一次");
                setTimeout(clickCourse, 10000);
            }
        }
        // 检查课程是否看完，如果课程进度100%则继续下一节课
        function checkProgress() {
            var progress = courses[i].querySelector("canvas.com-canvas").getAttribute("data-percent");
            console.log('检查课程:',i);
            if(getSelectItem()!==i){
                console.log(i,"没有点击成功,自动点击一次")
                courses[i].querySelector("span").click();
            }
            if(parseInt(progress)%10===0){
                console.log('课程进度:',progress)
            }
            if (progress !== "100") {
                setTimeout(checkProgress, 30000);
            } else {
                i++;
                if (i < courses.length) {
                    processCourse();
                }
            }
        }

        processCourse();
    }


    //自动点击 继续学习
    setInterval(function () {
        if (autoShuake===true){
            var dPause = document.getElementById("dPause");
            if (dPause && window.getComputedStyle(dPause).display !== "none") {
                console.log('课程暂停自动点击开始');
                dPause.click();
            }
        }
    }, 1000)
}


