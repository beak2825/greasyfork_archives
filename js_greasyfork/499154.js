// ==UserScript==
// @name         内容管理平台
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  仅适用于学习
// @author       xxx
// @match        http://eco.cms.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @license  GPL
// @downloadURL https://update.greasyfork.org/scripts/499154/%E5%86%85%E5%AE%B9%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/499154/%E5%86%85%E5%AE%B9%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    // 创建一个正方形按钮,显示“开”或者“关”
    function createButton() {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top='0';
        button.style.left='0';
        button.style.width = '20px';
        button.style.height = '20px';
        button.style.backgroundColor = 'transparent';
        button.style.color = '#ccc';
        button.style.border = '1px solid #ccc';
        button.style.cursor = 'move';
        button.style.float = 'right';
        button.innerText = '关';
        return button;}

    // 按钮右键自由拖动
    function makeDraggable(element) {
        let offsetX, offsetY;
        element.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 将按钮添加到页面中
    const button = createButton();
    document.body.appendChild(button);
    makeDraggable(button);

    // 点击按钮触发开关，并且下次打开浏览器保持最后选择的状态
    button.addEventListener('click', () => {
        if (button.innerText === '关') {
            button.innerText = '开';
        } else {
            button.innerText = '关';
        }
        localStorage.setItem('buttonState', button.innerText);
    });

    // 初始化按钮状态
    const savedState = localStorage.getItem('buttonState');
    if (savedState) {
        button.innerText = savedState;
    }

    //添加一个输入框
    function createInputField() {
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.top = '0';
    input.style.left='10px';
    input.style.width = '80px';
    input.style.height = '20px';
    input.style.backgroundColor = '#fff';
    input.style.color = '#000';
    input.style.border = '1px solid #ccc';
    input.style.marginLeft = '10px';
    input.style.outline = 'none';
    input.style.padding = '1px';
    input.style.fontSize = '14px';
    input.style.float = 'right';
    return input;
}

    // 将输入框添加到页面中
const input = createInputField();
document.body.appendChild(input);

    //点击输入框清空值
input.addEventListener('click', function() {
    this.value = '';
});
    // 监听输入框的回车事件
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const newId = input.value; // 获取输入框中的值
        //const parts = newId.split('tId=');
        //const ids = parts[1].split('&')[0];tId到&
        const url = 'http://eco.cms.jd.com/#/auditDetailsNew?operateType=B&id=' + newId + '&subPosition=143&style=11';
        window.location.href = url;
        location.reload(true);
        ;
    }
});
    //判断开关状态
    if (button.innerText === '开') {
    setTimeout(function() {
        const newId = window.location.href;
        const parts = newId.split('id=');
        input.value = parts[1].split('&')[0];
    //寻找带有已上线的span标签
        //获取指定的span
        var element1 = document.querySelector('div h2 span');
        var element2 = document.querySelector('div h2 h6');
        //获取id等于app的div
        var otherDiv = document.querySelector('#app');
        otherDiv.style.float = 'right';
        otherDiv.style.padding = '0px';
        //判断是否有h6标签
        if (element2 && otherDiv) {
            element2.style.margin.right = '40px';
            otherDiv.parentNode.insertBefore(element2, otherDiv.firstChid);
        }
        otherDiv.insertBefore(element1, otherDiv.firstChild);
        //寻找带有已上线的span标签
    // 获取所有span标签
        var spans = document.querySelectorAll('span.el-tag.el-tag--light');

    //创建关键词数组
    const fields = [
    "低质","通过","优质","低俗类","负向体感",
    "无营销感","弱营销感","强营销感","封面完整度低","封面匹配度低",
    "封面图有底色","封面出现水印","封面美观度低","合成图","封面饱和过高-机",
    "机-封面有黑花边","机-封面模糊","机-封面字幕有遮挡","机-封面亮度昏暗","视频字幕截断",
    "音画不同步","字幕被遮挡","字幕重叠","解说问题","片头5S无效",
    "广告","视频拼接","疑似洗稿","机-语速无声","机-视频有黑屏","机-视频模糊",
    "机-视频有黑花边","机-语速太慢"
];
    // 遍历所有符合条件的span标签
    for (let i = 0; i < spans.length; i++) {
    for (let j = 0; j < fields.length; j++) {
        if (spans[i].innerText.includes(fields[j])) {
            spans[i].style.backgroundColor = 'transparent';
            spans[i].style.color = 'black';
            spans[i].style.border = 'none';
            spans[i].style.float = 'right';
            spans[i].style.padding = '5px';
            
            otherDiv.parentNode.insertBefore(spans[i], otherDiv);
            break;
        }
    }
}
        var element5 = document.querySelector('.main');
        element5.style.display = 'none';
  }, 500);
}
})();
