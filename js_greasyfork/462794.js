// ==UserScript==
// @name         网页挡板
// @namespace    Zhangsq37
// @version      0.1
// @description  通过【Alt+单击】在网页唤出一个（多个）自由移动和调整大小的挡板，遮住不想露出的内容，或是直播中挡住游戏广告/黄色广告
// @author       Zhangsq37
// @match        https://*/*
// @match        http://*/*
// @match        *//*/*
// @icon         data:image/png;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462794/%E7%BD%91%E9%A1%B5%E6%8C%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/462794/%E7%BD%91%E9%A1%B5%E6%8C%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let close_png = "data:image/png;base64,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";
    let move_png = "data:image/png;base64,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";

    let styles = document.createElement('style');
    document.body.appendChild(styles);
    styles.innerText = `
    div.mask{
        position: absolute;
        background-color: rgb(255, 255, 255);
        min-width: 100px;
        min-height: 66px;
        resize: both;
        overflow: scroll;
        z-index: 10000000;
    }

    img.mask{
        width:20px;
        height:20px;
        padding:10px;
        background-color: white;
    }

    img.mask:hover{
        background-color: black;
    }
    `;

    const dragToMove = (dragNode, moveNode) => {//（被拖动的Part,被移动的整体）
        dragNode.ondragstart = (event) => { event.preventDefault(); };

        dragNode.onmousedown = function (event) {
            event = event || window.event
            //获取鼠标按下时的坐标
            let x = event.clientX
            let y = event.clientY
            //获取鼠标按下时距离div边框的距离
            let ol = x - moveNode.offsetLeft
            let ot = y - moveNode.offsetTop
            //使用document的原因:防止用户拖拽速度过快导致元素的onmousemove事件失效，所以把onmousemove事件绑定在document上就能避免失效
            document.onmousemove = function (event) {
                event = event || window.event
                moveNode.style.left = event.clientX - ol + 'px'
                moveNode.style.top = event.clientY - ot + 'px'
            }
            //取消onmousemove事件和onmouseup事件
            document.onmouseup = function () {
                document.onmousemove = 'null'
                document.onmouseup = 'null'
            }
        }
    };

    document.addEventListener('mousedown', (mouseEvent) => {
        if (mouseEvent.altKey) {

            let mask = document.createElement('div');
            mask.className = 'mask';

            let movebtn = document.createElement('img');
            movebtn.className = 'mask movebtn';
            movebtn.src = move_png;
            movebtn.style.cursor = "move";


            let closebtn = document.createElement('img');
            closebtn.className = 'mask closebtn';
            closebtn.src = close_png;
            closebtn.style.cursor = 'pointer';

            mask.appendChild(movebtn);
            mask.appendChild(closebtn);
            closebtn.addEventListener('click', () => { document.body.removeChild(mask); });
            document.body.appendChild(mask);

            mask.style.left = '' + mouseEvent.clientX + 'px';
            mask.style.top = '' + mouseEvent.clientY + 'px';

            dragToMove(movebtn, mask);
        }
    });


})();