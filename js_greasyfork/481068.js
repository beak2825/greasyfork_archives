// ==UserScript==
// @name         CopyExecl
// @name:zh-CN   网页表格复制器
// @namespace    http://tampermonkey.net/
// @version      1.231214.4
// @description  网页表格复制脚本
// @author       N-cat
// @match        *://*/*
// @icon         data:image/png;base64,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
// @homepageURL  https://greasyfork.org/zh-CN/scripts/481068-copyexecl
// @supportURL   https://gitee.com/z2322739526/copyexecl
// @downloadURL https://update.greasyfork.org/scripts/481068/CopyExecl.user.js
// @updateURL https://update.greasyfork.org/scripts/481068/CopyExecl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 全局变量默认值
    let startX = 9999; // 按下坐标
    let startY = 9999;
    let endX = 9999; // 鼠标坐标
    let endY = 9999;
    var tds = ""; // 所有td，th标签
    var tables = "";
    // 样式添加
    const style = `<style>
    .get{
        position:fixed;
        right:80px;
        bottom:150px;
        background-color:#00a1d6;
        color:white;
        height:50px;
        width:50px;
        border-radius: 10px;
        font-size:15px;
        border:solid 3px #FA5A57;
        cursor:pointer;
        outline: none;
        z-index: 9999;
    }
    .get:hover {
        background-color:#33b4de;
    }
    .display{
        position:fixed;
        right:80px;
        bottom:80px;
        background-color:#00a1d6;
        color:white;
        height:50px;
        width:50px;
        border-radius: 10px;
        font-size:15px;
        border:solid 3px #FA5A57;
        cursor:pointer;
        outline: none;
        z-index: 9999;
    }
    .display:hover {
        background-color:#33b4de;
    }
    .CEinfo{
        position:fixed;
        right:80px;
        top: unset !important; /* 取消设置 */
        bottom:30px !important;
        background-color:#00a1d6;
        width: 100px;
        color:white !important;
        border-radius: 10px;
        height: 30px;
        border:solid 3px #FA5A57;
        outline: none;
        cursor:default;
        display: inline-flex; /* 使其成为一个弹性盒子 */
        justify-content: center; /* 垂直居中 */
        align-items: center; /* 水平居中 */
        text-decoration: none !important; /* 取消下滑线 */
        cursor: pointer; /* 鼠标变为手势 */
        font-size: 12px;
        z-index: 9999;
    }
    .CEinfo:hover {
        color:white; /* 悬浮时也不变色 */
        background-color:#33b4de;
    }
    .alertMessage{
        position: fixed;
		top: 30px;
		left: 40%;
		right: 40%;
		padding: 20px 30px;
		background: rgba(0, 0, 0, 0.8);
		color: #ffffff;
		font-size: 20px;
		text-align: center;
		z-index: 9999;
		display: none;
        border-radius:5px;
    }
    </style>`;
    let div = document.createElement("div");
    div.innerHTML += style;
    document.body.append(div);
    // 提示框
    var alertMessage = document.createElement("div");
    alertMessage.classList.add('alertMessage');
    document.body.append(alertMessage);
    function alertmess(mess) {
		alertMessage.innerHTML = mess; // 填入要显示的文字
		alertMessage.style.display = "inline"; // 显示弹框
		setTimeout(function () { // 倒计时
			alertMessage.innerHTML = ''; // 清空文本
			alertMessage.style.display = "none" // 隐藏弹框
		}, 3000); // 3秒
	}
    // 鼠标悬浮在td上时提示
    function tdmm(){
        this.style.backgroundColor = 'black';
        this.style.color = 'white';
    }
    function tdmo(){
        this.style.removeProperty("background-color");
        this.style.removeProperty("color");
    }
    // 框选变色,抬起复制
    function wmd(e){
        startX = e.clientX;
        startY = e.clientY;
        // console.log(e.target);
        var wmdtd = e.target; // 是object对象而非HTMLTableCellElement
        if (wmdtd instanceof HTMLTableCellElement) {
            while (wmdtd && !wmdtd.matches("td, th")) { // css选择器
                wmdtd = wmdtd.parentNode;
            }
            wmdtd.style.backgroundColor = 'black';
            wmdtd.style.color = 'white';
            wmdtd.style.borderColor = "white";
            wmdtd.setAttribute("data-copycell", "copycell");
            wmdtd.dataset.copycell = "copycell";
        } else {
            console.log("点击内容如下，非表格对象\n", wmdtd);
        }
    }
    function wmm(e){
        // 点击判断
        if(startX !== 9999) {
            endX = e.clientX;
            endY = e.clientY;
            for(let i of tds){
                // 获取tr元素的左上角坐标和宽度、高度
                var rect = i.getBoundingClientRect();
                var tdleft = rect.left;
                var tdtop = rect.top;
                var tdwidth = rect.width;
                var tdheight = rect.height;
                // console.log("起止坐标", startX, endX, startY, endY);
                // console.log("td坐标", tdleft, tdtop);
                // 伪代码 if (X->((E<右 && 左<S) || (S<右 && 左<E)) && Y->((E<下 && 上<S) || (S<下 && 上<E))){}
                if (((endX <= tdleft + tdwidth && tdleft <= startX) || (startX <= tdleft + tdwidth && tdleft <= endX)) && ((endY <= tdtop + tdheight && tdtop <= startY) || (startY <= tdtop + tdheight && tdtop <= endY))) {
                    //if (startX <= tdleft + tdwidth && startY <= tdtop + tdheight && endX >= tdleft && endY >= tdtop) { /////////目前只能从左上角框选到右下角，待更新
                    // 将tr元素的背景色设置为黑色（或其他你想要的颜色）
                    i.style.backgroundColor = 'black';
                    i.style.color = 'white';
                    i.style.borderColor = "white";
                    i.setAttribute("data-copycell", "copycell");
                    i.dataset.copycell = "copycell";
                } else {
                    i.style.removeProperty("background-color");
                    i.style.removeProperty("color");
                    i.style.removeProperty("border-color");
                    i.dataset.copycell = "";
                }
            }
        }
    }
    function wmu(e){
        startX = 9999; // 按下坐标
        startY = 9999;
        endX = 9999; // 鼠标坐标
        endY = 9999;
        var copyexecl = "";
        var oldtr = "";
        for(let i of tds){
            // 输出选中范围内信息
            if(i.dataset.copycell === "copycell"){
                // console.log(i.innerText);
                var itr = i;
                while (itr && !itr.matches("tr")) { // css选择器
                    itr = itr.parentNode;
                }
                if(itr === oldtr || oldtr === ""){
                    copyexecl += '\"\'' + i.innerText + '\"\t';
                } else {
                    copyexecl = copyexecl.slice(0,-1) + '\n\"\'' + i.innerText + '\"\t';
                }
                oldtr = itr;
            }
            // 重置
            i.style.removeProperty("background-color");
            i.style.removeProperty("color");
            i.style.removeProperty("border-color");
            i.dataset.copycell = "";
        }
        // 当前框仍然为鼠标悬浮变色
        if (e.target instanceof HTMLTableCellElement){
            e.target.style.backgroundColor = 'black';
            e.target.style.color = 'white';
        }
        console.log(copyexecl);
        // 内容复制到剪切板
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.innerHTML = copyexecl;
        textarea.select(); // 选取文本域的内容
        if (document.execCommand('copy') && copyexecl !== "") {
            document.execCommand('copy');
            alertmess("框选区域已复制到剪切板");
        }
        document.body.removeChild(textarea);
    }
    /*
    // 点击复制全部execl（基础适配）
    function tabmd(){
        var execl = []
        var trs = this.getElementsByTagName("tr");
        for(let j of trs){
            var row = []
            var tds = j.getElementsByTagName("td");
            for(let k of tds){
                if(k.style.display !== "none"){
                    row.push(k.innerText);
                }
            }
            execl.push(row);
        }
        console.log(execl);
        var csv = ""
        for(let i of execl){
            for(let j of i){
                csv += '\"\'' + j + '\"\t';
            }
            csv = csv.slice(0,-1) + "\n";
        }
        console.log(csv);
        // 复制视频名称到剪切板
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.innerHTML = csv;
        textarea.select(); // 选取文本域的内容
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            alertmess("网页表格已复制到剪切板");
        }
        document.body.removeChild(textarea);
    }
    */
    // 获取包括iframe内的td和th
    function getAllTags(node, tags){
        var Tags = [];
        var taglist = tags.replace(/\s*/g, "").split(',');
        taglist.forEach(item => {
            item = item.toLowerCase(); // 将每个元素转换为小写字母
        });
        for (let i of node.childNodes) {
            // 如果子节点是td标签，则将其添加到结果数组中
            if (i.tagName && taglist.includes(i.tagName.toLowerCase())) {
                Tags.push(i);
            }
            // 如果子节点是iframe或者为Node.ELEMENT_NODE，则递归遍历其子节点
            if (i.tagName && i.tagName.toLowerCase() === "iframe") {
                Tags = Tags.concat(getAllTags(i.contentWindow.document, tags));
            } else if (i.nodeType === Node.ELEMENT_NODE) {
                console.log(i.nodeType);
                Tags = Tags.concat(getAllTags(i, tags));
            }
        }
        return Tags;
    }
    // 获取按钮 //////////main////////////
    var getnum = 0 // 0：未（取消）触发 1：已触发
    var get = document.createElement("input");
    get.setAttribute("type", "button");
    get.setAttribute("value", "开启");
    get.classList.add('get');
    document.body.append(get);
    get.onclick = function(){
        // tds = getAllTags(document, 'td, th'); // 获取包括iframe内的td和th
        tds = document.querySelectorAll('td, th'); // css选择器
        console.log(tds);
        if(getnum === 0){ // 开启
            getnum = 1;
            get.setAttribute("value", "关闭");
            for(let i of tds){
                // 文本设置无法选中
                i.style.userSelect = "none";
                // 鼠标悬浮在td上时提示
                i.addEventListener("mousemove", tdmm);
                i.addEventListener("mouseout", tdmo);
            }
            // 框选变色（还未添加复制功能）
            window.addEventListener("mousedown", wmd);
            window.addEventListener("mousemove", wmm);
            window.addEventListener("mouseup", wmu);
            /*
            // 点击复制全部execl（基础适配）
            tables = document.getElementsByTagName("table");
            for(let i of tables){
                i.addEventListener("mousedown", tabmd);
            }
            */
            alertmess("网页表格复制器-已开启");
        } else {
            getnum = 0;
            get.setAttribute("value", "开启");
            for(let i of tds){
                i.style.removeProperty("user-select");
                i.removeEventListener('mousemove', tdmm);
                i.removeEventListener('mouseout', tdmo);
            }
            window.removeEventListener('mousedown', wmd);
            window.removeEventListener('mousemove', wmm);
            window.removeEventListener("mouseup", wmu);
            tables = document.getElementsByTagName("table");
            /*
            for(let i of tables){
                i.removeEventListener("mousedown", tabmd);
            }
            */
            alertmess("网页表格复制器-已关闭");
        }
    }
    // 程序CEinfo
    var CEinfo = document.createElement("a");
    CEinfo.classList.add('CEinfo');
    CEinfo.innerHTML = "网页表格复制器";
    CEinfo.setAttribute("href", "https://greasyfork.org/zh-CN/scripts/481068-copyexecl");
    CEinfo.setAttribute("target", "_blank");
    document.body.append(CEinfo);
    // 单次隐藏按钮
    var display = document.createElement("input");
    display.setAttribute("type", "button");
    display.setAttribute("value", "隐藏");
    display.classList.add('display');
    document.body.append(display);
    display.onclick = function(){
        get.style.display = "none";
        display.style.display = "none";
        CEinfo.style.display = "none";
        // 关闭
        for(let i of tds){
            i.style.removeProperty("user-select");
            i.removeEventListener('mousemove', tdmm);
            i.removeEventListener('mouseout', tdmo);
        }
        window.removeEventListener('mousedown', wmd);
        window.removeEventListener('mousemove', wmm);
        window.removeEventListener("mouseup", wmu);
        tables = document.getElementsByTagName("table");
        /*
        for(let i of tables){
            i.removeEventListener("mousedown", tabmd);
        }
        */
        alertmess("网页表格复制器-已隐藏");
    }
})();