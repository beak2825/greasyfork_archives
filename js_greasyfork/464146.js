// ==UserScript==
// @name         网页便签
// @namespace    ikun
// @version      2023.7.7
// @description  想在那个网页展示  就在@match填哪个网页，不同网站数据不互通（可以写多个@match）
// @author       仰晨
// @license      MIT
// @match        https://www.jianfast.com/
// @match        *
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464146/%E7%BD%91%E9%A1%B5%E4%BE%BF%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464146/%E7%BD%91%E9%A1%B5%E4%BE%BF%E7%AD%BE.meta.js
// ==/UserScript==




const LOCAL_STORAGE_KEY = 'note';

// 获取本地存储的便签数据
function getNoteData() {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return {
        x: 0,
        y: 0,
        width: 260,
        height: 260,
        content: 'hello ikun'
    };
}

// 保存便签数据到本地存储
function saveNoteData(noteData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(noteData));
}

// 创建便签
function createNote() {
    const noteData = getNoteData();

    // 创建 box
    const box = document.createElement('div');
    box.classList.add('box');
    box.style.width = `${noteData.width}px`;
    box.style.height = `${noteData.height}px`;
    box.style.left = `${noteData.x}px`;
    box.style.top = `${noteData.y}px`;
    document.body.appendChild(box);

    // 创建 xiao
    const xiao = document.createElement('div');
    xiao.innerHTML="🗗";
    xiao.classList.add('xiao');
    box.appendChild(xiao);

    // 创建 yuan
    const yuan = document.createElement('div');
    yuan.classList.add('yuan');
    yuan.style.left = `${noteData.x}px`;
    yuan.style.top = `${noteData.y}px`;
    document.body.appendChild(yuan);

    // 创建 yi
    const yi = document.createElement('div');
    yi.classList.add('yi');
    box.appendChild(yi);

    // 创建 textarea
    const textarea = document.createElement('textarea');
    textarea.classList.add('textarea');
    textarea.value = noteData.content;
    box.appendChild(textarea);

    // 创建 resize
    const resize = document.createElement('div');
    resize.classList.add('resize');
    resize.innerHTML="🞖";
    box.appendChild(resize);

    var ikun = "ikun";
    // 事件监听
    xiao.addEventListener('click', () => {
        box.style.display = 'none';
        xiao.style.display = 'none';
        yuan.style.display = 'block';
    });

    yuan.addEventListener('click', () => {
        console.log(ikun);
        if(ikun=='你干嘛 哎呦'){
            box.style.display = 'block';
            xiao.style.display = 'block';
            yuan.style.display = 'none';
        }
    });
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    yuan.addEventListener('mousedown', (e) => {
        const offsetX = e.clientX - yuan.offsetLeft;
        const offsetY = e.clientY - yuan.offsetTop;

        function move(e) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            box.style.left = `${x}px`;
            box.style.top = `${y}px`;
            xiao.style.right = `${-x}px`;
            xiao.style.top = `${y}px`;
            yuan.style.left = `${x}px`;
            yuan.style.top = `${y}px`;

            noteData.x = x;
            noteData.y = y;
            saveNoteData(noteData);
        }

        function stop() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', stop);
        }

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);

        ikun = '你干嘛 哎呦';
        setTimeout(() => { ikun = 'ikun';}, 200);
    });
    //---------------------------------------------------
    yi.addEventListener('mousedown', (e) => {
        const offsetX = e.clientX - box.offsetLeft;
        const offsetY = e.clientY - box.offsetTop;

        function move(e) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            box.style.left = `${x}px`;
            box.style.top = `${y}px`;
            xiao.style.right = `${-x}px`;
            xiao.style.top = `${y}px`;
            yuan.style.left = `${x}px`;
            yuan.style.top = `${y}px`;

            noteData.x = x;
            noteData.y = y;
            saveNoteData(noteData);
        }

        function stop() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', stop);
        }

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);
    });

    //-----------------------------------------------------------

    textarea.addEventListener('input', () => {
        noteData.content = textarea.value;
        saveNoteData(noteData);
    });

    resize.addEventListener('mousedown', (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(box.style.width, 10);
        const startHeight = parseInt(box.style.height, 10);

        function resize(e) {
            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);
            box.style.width = `${width}px`;
            box.style.height = `${height}px`;

            noteData.width = width;
            noteData.height = height;
            saveNoteData(noteData);
        }

        function stop() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stop);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stop);
    });

    // 初始化显示
    box.style.display = 'block';
    xiao.style.display = 'block';
    yuan.style.display = 'none';
}

createNote();



var styleElement = document.createElement("style");
styleElement.innerHTML = `
    .box {    /*盒子本身*/
        position: absolute;
        border: 1px solid #0000004d;
        background-color: #fff;
        overflow: hidden;
			border-radius: 10px;
			box-shadow:  3px 3px 6px #e3e3e3,-3px -3px 6px #ffffff;
    }
    .xiao {
            opacity: 0.5;   /*透明度*/
            text-align: center;
			border-radius: 50px;
			background: #e0e0e0;
            float: right;
            width: 20px;
            height: 20px;

        cursor: pointer;
    }
    .yuan {  /*变小的圆*/
        position: absolute;
        width: 50px;
        height: 50px;
        background-color: #f3d9a9;
        border-radius: 50%;
        cursor: move;

			box-shadow:  6px 6px 6px #dddc9763, -2px -2px 5px #fff28c;
    }
    .yi {   /*移动条*/
        height: 20px;
        cursor: move;
		background: linear-gradient(90deg, #EAF9DB 0%, #F7CFCF 46%, #fff 100%);
    }
    .textarea {
        width: 100%;
        height: calc(100% - 10px);
        border: none;
        resize: none;
        outline: none;
    }
    .resize {/*  右下角大小拖动按钮 */
            text-align: center;
			border-radius: 33px;
			background: #64565600;
			box-shadow:  3px 3px 3px #725f5f4d,-3px -3px 3px #d6d0d09e;
            opacity: 0.5;   /*透明度*/
        position: absolute;
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;

        cursor: se-resize;
    }`;
document.head.appendChild(styleElement);

