// ==UserScript==
// @name         再见灌水回复
// @author       T子大大
// @description  Block unwanted replies
// @description:zh-CN 在使用各大论坛时出现的一些已知的无用信息回复例如:沙发,大佬厉害,6666等..。将会被屏蔽显示在最下面，可以再论坛最顶层看到推荐及有用信息的回复减少问题的重复性
// @namespace    https://greasyfork.org/zh-CN/users/1031190-t%E5%AD%90
// @match        http*://*/*
// @version      0.3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460705/%E5%86%8D%E8%A7%81%E7%81%8C%E6%B0%B4%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/460705/%E5%86%8D%E8%A7%81%E7%81%8C%E6%B0%B4%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("欢迎使用-T子制作")
    const regexArray = [/0000/,/1111/,/2222/,/3333/,/4444/,/5555/,/6666/,/7777/,/8888/,/9999/,
                        /试试看/,/好东西/,/看起来/,
                        /很赞同/,/顶一下/,/学习了/,/我看看/,/沙发/,/来看看/,
                        /这个牛/,/很奈斯/,/牛牛牛/,/冇/,/冇/,/冇/,
                        /感谢分享/,/感谢无私/,/谢谢提供/,/谢谢技术/,/冇/,/冇/,
                        /感谢大大/,/感谢更新/,/冇/,/冇/,/冇/,/冇/,
                        /DDDD/,/SSSS/,/冇/,/冇/,/冇/,/冇/,
                        /感恩楼主/,/感恩大佬/,/感恩老板/,/感恩感恩/,/感恩分享/,/感恩老师/,/感恩楼组/,/感恩楼楼/,/感恩大神/,/冇/,/冇/,/冇/,
                        /感谢楼主/,/感谢大佬/,/感谢老板/,/感谢感谢/,/感谢分享/,/感谢老师/,/感谢楼组/,/感谢楼楼/,/感谢大神/,/冇/,/冇/,/冇/,
                        /多谢楼主/,/多谢大佬/,/多谢老板/,/多谢多谢/,/多谢分享/,/多谢老师/,/多谢楼组/,/多谢楼楼/,/多谢大神/,/冇/,/冇/,/冇/,

                        /谢谢楼主/,/谢谢大佬/,/谢谢老板/,/谢谢分享/,/谢谢老师/,/谢谢楼组/,/谢谢楼楼/,/谢谢大神/,/冇/,/冇/,/冇/,

                        /大佬真强/,/大佬牛逼/,/大佬真牛/,/大佬厉害/,/大佬无敌/,/冇/,

                        /楼主无私/,/楼主辛苦/,/楼主好人/,/冇/,/冇/,/冇/,
                        /作者辛苦/,/冇/,/冇/,/冇/,/冇/,/冇/,
                        /退币退币/,/冇/,/冇/,/冇/,/冇/,/冇/,

                        /学习一下/,/支持一下/,/测试一下/,/冇/,/冇/,/冇/,
                        /终于更新/,/威武霸气/,/兄弟分享/,
                        /就是大佬/,/必须支持/,/必须点赞/,
                        /太感谢了/,/多谢分享/,/晚点试试/,/非常感谢/,/非常NICE/,
                        /真的厉害/,/点赞楼主/,
                        /YYDS/,/必须学习/,/正好需要/,/我正需要/,/冇/,/冇/,
                        /下来看看/,/下来试试/,/下载看看/,/下载试试/,/下载备用/,/冇/,
                        /啊啊啊啊/,/顶顶顶顶/,/学习学习/,/好好学习/,/养好习惯/,/冇/,
                        /研究研究/,/牛逼牛逼/,/支持支持/,/冇/,/冇/,/冇/,

                        /地表最强/,/万分感谢/,/支持开源/,/岂能不顶/,/岂能不赞/,/冇/,
                        /看看隐藏/,/看看大佬/,/冇/,/冇/,/冇/,/冇/,
                        /额额额额/,/鹅鹅鹅鹅/,/看看看看/,/谢谢谢谢/,/冇/,/冇/,/冇/,
                        /百度网盘/,/吾爱破解论坛/,
                        /谢谢你楼主/,/楼主太给力/,/本帖隐藏内容/,/冇/,/冇/,/冇/,
                        /看看好不好/,/看看是不是/,/看看不说话/,/冇/,/冇/,/冇/,
                        /。。。。/,/！！！！/,/，，，，/,/冇/,/冇/,/冇/,
                       ]; // 要匹配的正则表达式数组


    let postlist = document.querySelector("#postlist");// 获取 #postlist 元素
    if(!postlist){
        return;
    }
    let postDivs = postlist.querySelectorAll("#postlist > div"); // 获取 postlist 内部的所有 div 元素

    const wp = document.querySelector("#wp"); // 找到 #wp 元素
    const newElement = document.createElement("div"); // 新建一个 div 元素
    let UselesString = "",UsefulString = "";// 无用评论 and 正常评论

    let textLength = 40; // 过滤文本的小于长度
    let UselesNum = 0,UsefulNum = 0; // 无用次数 and 有用次数

    // 遍历所有的 div 元素
    postDivs.forEach((postDiv) => {
        // 获取当前 div 元素内部的 td 元素
        let tdElement = postDiv.querySelector("tbody > tr:nth-child(1) > td.plc > div.pct > div.pcb > div.t_fsz > table > tbody > tr > td");// 获取评论

        // 如果 td 元素存在
        if (tdElement) {
            let textContent = tdElement.textContent.replace(/ /g, '').toLocaleUpperCase();// 过滤掉空格

            // 判断文本长度是否小于设定长度才进入过滤
            // 使用 Array.some() 方法检查 div 的文本内容是否与任一项匹配
            // 判断文本长度小于6直接进入过滤
            if (textContent.length <= textLength && regexArray.some(regex => textContent.match(regex)) ||textContent.length <= 6) {
                UselesString = UselesString+"<p>第"+ ++UselesNum +"条 的评论"+ textContent + "</p>";
                postDiv.remove(); // 如果匹配，则删除该 div 元素
            }else{
                UsefulString = UsefulString + "<p><a href='#" + tdElement.id + "' style='color: blue;'>第" + ++UsefulNum + "条</a> 的评论" + textContent + "</p>";
            }

        }
    });
    // 在新元素中添加内容
    newElement.innerHTML = "<p>T子 为您推荐" + UsefulNum + "条评论</p><hr>" + UsefulString;
    newElement.innerHTML = newElement.innerHTML + "<hr><p>T子 为您一共过滤掉了" + UselesNum + "条无用评论</p>" + UselesString + "</br>";
    const firstChild = wp.firstChild; // 找到第一个子元素
    wp.insertBefore(newElement, firstChild); // 将新元素插入到第一个子元素之前


    // 添加事件监听器
    document.addEventListener('click', function(event) {
        const target = event.target;
        // 如果点击的是链接
        if (target.tagName === 'A') {
            const href = target.getAttribute('href');
            // 如果链接的 href 属性以 # 开头
            if (href && href[0] === '#') {
                const id = href.slice(1);
                const targetElement = document.getElementById(id);
                // 如果目标元素存在，则滚动到该元素
                if (targetElement) {
                    event.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

})();
