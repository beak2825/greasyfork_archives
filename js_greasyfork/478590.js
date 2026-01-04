// ==UserScript==
// @name         💯🥇🥇柠檬文才-批量课程助手💯🥇🥇
// @namespace    http://www.xxx.com
// @version      1.0
// @description  柠檬文才-批量课程助手
// @author       Your Name
// @match        *.wencaischool.net/*
// @grant        GM_addStyle
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @run-at     				document-start
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @connect    				enncy.cn
// @connect    				icodef.com
// @connect    				ocsjs.com
// @connect    				localhost
// @antifeature				payment
// @downloadURL https://update.greasyfork.org/scripts/478590/%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87%E6%9F%A0%E6%AA%AC%E6%96%87%E6%89%8D-%E6%89%B9%E9%87%8F%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478590/%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87%E6%9F%A0%E6%AA%AC%E6%96%87%E6%89%8D-%E6%89%B9%E9%87%8F%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B%F0%9F%92%AF%F0%9F%A5%87%F0%9F%A5%87.meta.js
// ==/UserScript==

// Create the float box element
const floatBox = document.createElement('div');
floatBox.id = 'float-box';
floatBox.innerHTML = `
    <div style="background-color: rgba(255, 255, 0, 0.8); padding: 10px;">
        <p style="font-weight: bold; font-size: 18px;">float box for 柠檬文才</p>
        <br>
        <p><input type="checkbox">第一学期</p>
        <p><input type="checkbox">第二学期</p>
        <p><input type="checkbox">第三学期</p>
        <p><input type="checkbox">第四学期</p>
        <p><input type="checkbox">第五学期</p>
        <p><input type="checkbox">第六学期</p>
        <br>
        <p><input type="checkbox">课件</p>
        <p><input type="checkbox">作业</p>
        <br>
        <button id="start-btn">启动挂机</button>
        <br>
        <p>当前题库共：796189道</p>
        <br>
        <p><a href="https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235" style="color: blue;">查看批量教程</a></p>
    </div>
`;

// Add the float box to the page
document.body.appendChild(floatBox);

// Add styles to the float box
GM_addStyle(`
    #float-box {
        position: fixed;
        top: 50px;
        left: 50px;
        z-index: 9999;
        cursor: move;
    }
`);

// Make the float box draggable
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

floatBox.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.pageX - floatBox.offsetLeft;
    dragOffsetY = e.pageY - floatBox.offsetTop;
});

floatBox.addEventListener('mouseup', () => {
    isDragging = false;
});

floatBox.addEventListener('mousemove', (e) => {
    if (isDragging) {
        floatBox.style.left = `${e.pageX - dragOffsetX}px`;
        floatBox.style.top = `${e.pageY - dragOffsetY}px`;
    }
});

// Add event listener to the start button
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
    alert('启动失败需要更新');
});
  WorkerJSPlus({
        name: "柠檬文才（考试）",
        match: () => {
            const pathMatch = location.pathname.includes("/separation/exam/");
            const matchHostArr = [ "learning.wuxuejiaoyu.cn", "learning.wencaischool.net", "learning.zk211.com" ];
            return pathMatch && matchHostArr.includes(location.host);
        },
        intv: () => {
            return $("#paperExam").css("display") != "none";
        },
        root: ".paperWrapper .tmList",
        elements: {
            question: ".tmTitleTxt",
            options: ".ansbox .opCont",
            $options: ".ansbox input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            if (obj.options.length === 0) {
                obj.type = 2;
            }
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "柠檬文才（作业）",
        match: () => {
            const matchHostArr = [ "learning.wuxuejiaoyu.cn", "learning.wencaischool.net", "learning.zk211.com" ];
            return location.pathname.includes("/xbsflearning/exam/") && matchHostArr.includes(location.host);
        },
        intv: () => {
            return $("#paperExam").css("display") !== "none";
        },
        root: "#_block_content_exam #tblDataList>tbody>tr",
        elements: {
            question: "tbody:first>tr>td:last table",
            options: ".ansbox .opCont",
            $options: ".ansbox input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = $("#_block_content_exam #tblDataList>tbody>tr>td").find(" tbody:first>tr>td:last table:first").eq(GLOBAL.index - 1).find("tr:first").text();
            obj.options = [];
            $("#_block_content_exam #tblDataList>tbody>tr>td").find(" tbody:first>tr>td:last table:first").eq(GLOBAL.index - 1).find("tr:first").next().find("label").map((i, y) => {
                obj.options.push($(y).text());
            });
            obj.$options = [];
            $("#_block_content_exam #tblDataList>tbody>tr>td").find(" tbody:first>tr>td:last table:first").eq(GLOBAL.index - 1).find("tr:first").next().find("input").map((i, y) => {
                obj.$options.push(y);
            });
            obj.type = 0;
            console.log(obj);
        }
    });