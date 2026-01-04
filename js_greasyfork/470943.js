// ==UserScript==
// @name         天津*滑动拼图验证23.8.29(图腾API版)*第四次优化版
// @namespace    none
// @version      23.8.29
// @description  none
// @author       You
// @match        https://jy.tjtobacco.cn/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470943/%E5%A4%A9%E6%B4%A5%2A%E6%BB%91%E5%8A%A8%E6%8B%BC%E5%9B%BE%E9%AA%8C%E8%AF%8123829%28%E5%9B%BE%E8%85%BEAPI%E7%89%88%29%2A%E7%AC%AC%E5%9B%9B%E6%AC%A1%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470943/%E5%A4%A9%E6%B4%A5%2A%E6%BB%91%E5%8A%A8%E6%8B%BC%E5%9B%BE%E9%AA%8C%E8%AF%8123829%28%E5%9B%BE%E8%85%BEAPI%E7%89%88%29%2A%E7%AC%AC%E5%9B%9B%E6%AC%A1%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

//天津当检测到弹出验证码识别窗口立即运行验证码识别

if (window.location.href === 'https://jy.tjtobacco.cn/wdk?action=ecw.page&method=display&site_id=web&inclient=&page_id=page_buy') {

    let backImgSrc; // 定义一个变量来存储 .backImg 元素的 src 属性值
    let timer = setInterval(function() { // 设置一个定时器，每隔 10 毫秒执行一次
        let code2Div = document.querySelector('#code2-div'); // 获取 #code2-div 元素
        if (code2Div && code2Div.style.display !== 'none') { // 如果 #code2-div 元素存在且不是隐藏的
            let backImg = code2Div.querySelector('.backImg'); // 获取 .backImg 元素
            if (backImg) { // 如果 .backImg 元素存在
                backImgSrc = backImg.src; // 获取 .backImg 元素的 src 属性值并存储在 backImgSrc 变量中
            }
            clearInterval(timer); // 清除定时器
            let count = 0; // 设置循环计数器
            function loopFunc() { // 定义一个函数来控制循环执行
                tianjinhkyzmsb(); // 调用 tianjinhkyzmsb 函数(滑块验证识别函数)
                let innerTimer = setInterval(function() { // 设置一个内部定时器，每隔 9 毫秒执行一次
                    let code2Div = document.querySelector('#code2-div'); // 再次获取 #code2-div 元素
                    if (code2Div && code2Div.textContent.includes('验证失败')) { // 如果 #code2-div 元素存在且文本内容包含“验证失败”
                        let backImg = code2Div.querySelector('.backImg'); // 再次获取 .backImg 元素
                        if (backImg && backImg.src !== backImgSrc) { // 如果 .backImg 元素存在且 src 属性值与 backImgSrc 变量不同
                            clearInterval(innerTimer); // 清除内部定时器
                            count++; // 循环计数器加 1
                            if (count < 8) { // 如果循环计数器小于 8 次
                                backImgSrc = backImg.src; // 更新 backImgSrc 变量的值
                                loopFunc(); // 继续调用 loopFunc 函数执行下一次循环
                            }
                        }
                    }
                }, 9);
            }
            loopFunc(); // 调用 loopFunc 函数开始循环执行
        }
    }, 20);


}//只在天津订购页运行


//天津滑块验证识别的函数
function tianjinhkyzmsb() {
    // 记录开始时间
    let startTime = new Date().getTime();

    console.log('获取图片数据');
    var image = $('.backImg').attr('src').replace('data:image/png;base64,', '');
    var title = $('.bock-backImg').attr('src').replace('data:image/png;base64,', '');

    //console.log('大图 src:', $('.backImg').attr('src'));
    //console.log('小图 src:', $('.bock-backImg').attr('src'));

    console.log('发送 Ajax 请求');
    $.ajax({
        url: 'https://www.tutengocr.com/api/hk/ty01?key=knM41zoSgF0tWsBy5EklHOVD19',
        data: JSON.stringify({
            image: image,
            title: title
        }),
        type: 'POST',
        contentType: 'application/json;charset:utf-8;',
        dataType: 'json',
        success: function(data) {
            console.log('请求成功');//('请求成功，返回结果：', data);
            var distance = parseInt(data.data, 10); // 将字符串转换为数字
            // 获取滑块需要移动的距离
            console.log('滑块需要移动的距离：', distance);

            // 计算缩放比例
            var scale = 320 / 310;
            // 根据缩放比例重新计算滑块需要移动的距离
            distance = distance * scale;

            console.log('获取滑块元素');
            var slider = document.querySelector('.verify-move-block'); // 获取滑块元素
            var rect = slider.getBoundingClientRect(); // 获取滑块元素的位置和尺寸
            var x = rect.left + rect.width / 2; // 计算滑块中心点的 x 坐标
            var y = rect.top + rect.height / 2; // 计算滑块中心点的 y 坐标

            console.log('触发鼠标按下事件');
            // 创建鼠标按下事件
            var mousedownEvent = new MouseEvent('mousedown', {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true
            });
            slider.dispatchEvent(mousedownEvent); // 触发鼠标按下事件

            console.log('触发鼠标移动事件');
            // 创建鼠标移动事件
            var mousemoveEvent = new MouseEvent('mousemove', {
                clientX: x + distance, // 将鼠标向右移动 distance 像素
                clientY: y,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(mousemoveEvent); // 触发鼠标移动事件

            console.log('触发鼠标抬起事件');
            // 创建鼠标抬起事件
            var mouseupEvent = new MouseEvent('mouseup', {
                clientX: x + distance,
                clientY: y,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(mouseupEvent); // 触发鼠标抬起事件

            // 记录结束时间
            let endTime = new Date().getTime();
            // 计算耗时并在控制台输出
            console.log(`tianjinhkyzmsb 函数运行耗时：${endTime - startTime} 毫秒`);
        },
        timeout: 3000,
        error: function(data) {
            console.log('请求失败');

            // 记录结束时间
            let endTime = new Date().getTime();
            // 计算耗时并在控制台输出
            console.log(`tianjinhkyzmsb 函数运行耗时：${endTime - startTime} 毫秒`);
        }
    });

}
