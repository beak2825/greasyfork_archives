// ==UserScript==
// @name         最简洁的划线翻译
// @namespace    http://tampermonkey.net/
// @version      2025-4-8
// @description  网页不认识的单词，划线点击按钮，立马得到结果
// @author       aipinky
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530103/%E6%9C%80%E7%AE%80%E6%B4%81%E7%9A%84%E5%88%92%E7%BA%BF%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/530103/%E6%9C%80%E7%AE%80%E6%B4%81%E7%9A%84%E5%88%92%E7%BA%BF%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 插入 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
       .ptext {
            position: fixed;
            width: 250px;
            background-color: hwb(0 97% 2%);
            border-radius: 10px;
            display: none;
            padding-left: 10px;
            border: 2px solid #cecbcb;
        }

       #lp .pfixed,
       #lp .pdel {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 0;
        }

        #lp a {
            float: left;
        }

        #lp {
            height:20px;
            width:100%;
            display: flex;
            align-items: center;
            margin-top:5px;
        }

       #lp .pdel {
            font-size: 13px;
            color: #fff;
            margin-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: red;
            right:40px
        }

       #lp .pfixed {
            margin-right: 40px;
            background-color: greenyellow;
            right:-10px;
        }

        .pdata {
            margin-top: 5px;
            margin-bottom: 10px;
            width: 90%;
            padding: 10px;
            line-height: 1.5;
            font-size: 15px;
            overflow: hidden;
            background-color: #fff;
        }

        .pimg {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background-color: red;
            background: url(https://i.postimg.cc/3xcgdvXs/lovetranslate-resized.png) no-repeat center/cover;
            border: 0;
            display: none;
            position: fixed;
        }

        * {
        user-select: auto !important;
    }
    `;
    document.head.appendChild(style);


    // 动态加载 axios
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/axios/dist/axios.min.js';
    script.onload = function() {
        initScript(); // axios 加载完成后初始化脚本
    };
    document.head.appendChild(script);

    function initScript() {
        // 创建 HTML 结构
        const html = `
            <div class="ptext">
                <p id="lp"><a href="#">API(有道)</span>
                    <a href="#" class="pfixed"></a>
                    <a href="#" class="pdel">X</a>
                     <div class="clearfix"></div>
                </p>
                <div name="textarea" id="" class="pdata"></div>
            </div>
            <a href="#" onclick="return false;" class="pimg"></a>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        // 获取元素
        const text = document.querySelector('.ptext');
        const dataText = document.querySelector('.pdata');
        const delBtn = document.querySelector('#lp .pdel');
        const fixed = document.querySelector('#lp .pfixed');
        const imgBtn = document.querySelector('.pimg');

        // 关闭按钮，关闭窗口
        delBtn.addEventListener('click', () => {
            ['click', 'mousedown', 'mouseup', 'mousemove', 'contextmenu'].forEach(eventType => {
                text.addEventListener(eventType,preEvent)});
            dataText.innerHTML = '';
            text.style.display = 'none';
            flag = false;
            fixed.style.backgroundColor = 'greenyellow';
            text.style.cursor = '';
        });

        // 点击固定按钮，任意拖拽位置
        let isDragging = false; // 是否正在拖拽
        let offsetX, offsetY; // 鼠标相对于盒子左上角的偏移量
        let flag = false;
        function preEvent(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        fixed.addEventListener('click', () => {
            // 定义事件处理函数
            // 禁用所有鼠标事件
            ['click', 'mousedown', 'mouseup', 'mousemove', 'contextmenu'].forEach(eventType => {
                text.addEventListener(eventType,preEvent)});

            if (flag === false) {
                flag = true;
                fixed.style.backgroundColor = 'pink';
                text.style.cursor = 'move';
            } else {
                flag = false;
                fixed.style.backgroundColor = 'greenyellow';
                text.style.cursor = '';
            }
        });

        // 鼠标按下时开始拖拽
        text.addEventListener('mousedown', function(event) {
            isDragging = true;

            // 计算鼠标相对于盒子左上角的偏移量
            offsetX = event.clientX - text.offsetLeft;
            offsetY = event.clientY - text.offsetTop;

            // 改变鼠标样式
            if(fixed.style.backgroundColor === 'pink'){
                ['click', 'mousedown', 'mouseup', 'mousemove', 'contextmenu'].forEach(eventType => {
                    text.removeEventListener(eventType, preEvent);
                });
                text.style.cursor = 'grabbing';
            }

        });

        // 鼠标移动时更新盒子位置
        document.addEventListener('mousemove', function(event) {
            if (isDragging && fixed.style.backgroundColor === 'pink') {
                // 计算盒子的新位置
                const newLeft = event.clientX - offsetX;
                const newTop = event.clientY - offsetY;

                // 更新盒子的位置
                text.style.left = `${newLeft}px`;
                text.style.top = `${newTop}px`;
            }
        });
        let selection;
        let mouseX, mouseY;
        // 鼠标松开时停止拖拽
        document.addEventListener('mouseup', function(event) {
            isDragging = false;
            // 恢复鼠标样式
            if(fixed.style.backgroundColor === 'pink'){
                text.style.cursor = 'move';
            }else{
                text.style.cursor = '';
            }


            // 检查是否有选中的文本
            if (selection && !text.contains(event.target) && text.style.display === 'none') {
                const mous1 = event.clientY;
                const mous2 = event.clientX;
                imgBtn.style.top = `${mous1}px`;
                imgBtn.style.left = `${mous2}px`;
                imgBtn.style.display = 'block';
            } else {
                console.log('没有选中文本');
            }

        });


        // 监听 selectionchange 事件
        document.addEventListener('selectionchange', function() {
            // 获取当前选中的文本
            if(!text.contains(event.target)){
                selection = window.getSelection().toString();
            }
        });

        // 点击图片按钮，显示文本框
        imgBtn.addEventListener('click', () => {
            getWhere();
            text.style.display = 'block';
            getText(selection)
                .then(data => {
                dataText.innerHTML = data;
            })
                .catch(error => {
                dataText.innerHTML = error;
            });
            imgBtn.style.display = 'none';
        });

        function getWhere() {
            document.addEventListener('mouseup', function() {
                const selection = window.getSelection();

                // 检查是否有选中的文本
                if (selection.toString().length > 0 && !text.contains(event.target) && text.style.display === 'none') {
                    // 获取选中的范围
                    const range = selection.getRangeAt(0);

                    // 获取选中文本的长度
                    const textLength = selection.toString().length;

                    // 计算中间位置的索引
                    const middleIndex = Math.floor(textLength / 2);

                    // 创建一个新的 Range，用于定位中间位置
                    const middleRange = document.createRange();
                    middleRange.setStart(range.startContainer, range.startOffset + middleIndex);
                    middleRange.setEnd(range.startContainer, range.startOffset + middleIndex + 1);

                    // 获取中间位置的边界框
                    const middleRect = middleRange.getBoundingClientRect();

                    // 计算中间位置的坐标
                    const middleX = middleRect.left + middleRect.width / 2;
                    //const middleY = middleRect.top + middleRect.height / 2;
                    //const mouseY = event.clientY;
                    const mouseY = middleRect.top + middleRect.height / 2;


                    // 获取窗口的高度和宽度
                    const windowHeight = window.innerHeight;
                    const windowWidth = window.innerWidth;

                    // 计算鼠标距离窗口底部的距离
                    let fromBottom = windowHeight - mouseY;
                    let formLeft = windowWidth - middleX;
                    if (middleX > 150 && middleX < windowWidth - 150) {
                        text.style.left = `${middleX - 150}px`;
                        if (fromBottom > 100) {
                            text.style.top = `${mouseY + 18}px`;
                        } else {
                            text.style.bottom = `${fromBottom + 18}px`;
                        }
                    } else if (middleX >= windowWidth - 150) {
                        text.style.left = `${windowWidth - 350}px`;
                        if (fromBottom > 100) {
                            text.style.top = `${mouseY + 18}px`;
                        } else {
                            text.style.bottom = `${fromBottom + 18}px`;
                        }
                    } else {
                        if (fromBottom > 100) {
                            let newMiddleX = 150 - middleX;
                            text.style.top = `${mouseY + 18}px`;
                            text.style.left = `${middleX - 140 + newMiddleX}px`;
                        } else {
                            let newMiddleX = 150 - middleX;
                            text.style.bottom = `${fromBottom + 18}px`;
                            text.style.left = `${middleX - 140 + newMiddleX}px`;
                        }
                    }
                }
            });
        }

        //!text.contains(event.target) || getWhere();
        getWhere()
        // 监听 document 上的 mousedown 事件
        document.addEventListener('mousedown', function(event) {
            if (!imgBtn.contains(event.target)) {
                imgBtn.style.display = 'none';
            }

            // 检查点击的目标是否是盒子或其子元素
            if (!text.contains(event.target)) {
                text.style.display = 'none';
                flag = false;
                fixed.style.backgroundColor = 'greenyellow';
                text.style.cursor = '';
            } 
        });

        // 请求函数
        function getText(param) {
            return axios({
                url: 'https://v.api.aa1.cn/api/api-fanyi-yd/index.php',
                method: 'get',
                params: {
                    msg: param,
                    type: 3
                }
            })
                .then(re => {
                // 使用正则表达式匹配 {} 里面的内容
                const matches = re.data.match(/\{([^}]+)\}/g);

                if (matches) {
                    // 提取内容并去掉 {}
                    const results = matches.map(match => match.replace(/[{}]/g, ''));
                    // 原始字符串
                    const str = results[1];
                    // 修复字符串格式
                    const fixedStr = `{${str.replace(/）/g, ')')}}`; // 将中文括号替换为英文括号，并添加外层 {}

                    // 转换为对象
                    const obj = JSON.parse(fixedStr);
                    return obj.text;
                } else {
                    return '没有找到 {} 里面的内容';
                }
            })
                .catch(err => {
                console.log(err.data);
                throw err.data;
            });
        }
    }
    document.body.style.userSelect = 'text';
    document.body.style.webkitUserSelect = 'text';
    document.body.style.mozUserSelect = 'text';
    document.body.style.msUserSelect = 'text';
})();