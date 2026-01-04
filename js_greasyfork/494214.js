// ==UserScript==
// @name         TKBaseSDK
// @namespace    https://github.com/RANSAA
// @version      0.0.2
// @description  一些通用方法基础组件库
// @author       sayaDev
// @license      MIT License
// @match        *://*/*
// @grant        none
// ==/UserScript==





// -------------------------------将函数添加到window全局变量上-------------------------------
/**
 * 功能：减函数添加到window全局变量中
 * 使用方法：
 * 1. 先引入本库：
 * 2. 然后直接在脚本中使用TKBaseSDK.XXXX方式调用指定方法
 **/
window.TKBaseSDK = {
    locationURL: window.location.href,       //当前网页地址
    locationTitle: document.title,           //当前网页title标题
    addButtonStyle: addButtonStyle,          //添加button css样式
    createSVGElement: createSVGElement,      //创建SVG
    createItemButton: createItemButton,      //创建包裹SVG的button
    createListItemButton: createListItemButton, //创建包裹SVG的button，用于listitem
    initToast: initToast,                    //初始化toast
    showToast: showToast,                    //显示toast
    showToastWtihTime: showToastWtihTime,    //显示toast，并附加样式，时间
    copyToClipBoard: copyToClipBoard,        //将指定文本拷贝到剪切板
};
// -------------------------------将函数添加到window全局变量上-------------------------------





// -------------------------------Style CSS-------------------------------
/**
 * 添加一个Button CSS
 **/ 
function addButtonStyle(){
    const style = `
    .TKButtonStyle{
        background: #1ca7ee;
        background-color:  #1ca7ee; 
        color: #ffffff;

        /* top: 100px; */
        height: 44px;
        width:  120px;
        right:  20px;
        position: fixed;
        z-index: 999999;

        border: none;
        cursor: pointer;
        padding: 0; 

        border: 1px solid;
        border-color: #1ca7ee;
        box-shadow: 0px 0px 8px #1ca7ee;  
        transition: all 0.15s ease;      
    }
    .TKButtonStyle:active,  
    .TKButtonStyle:hover {  
        border-radius: 50%;
        box-shadow: 0 0 10px #1ca7ee;  
    }

    .TKButtonListStyle {
        position: fixed;
        z-index: 999999;
        width: 128px;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        top: 80px;
        right: 20px;
        display: flex;
        flex-direction: column; /* 垂直排列按钮 */
        font-size: 14px;
    }

    .TKButtonListItemStyle {
        background-color: #1ca7ee;
        color: #ffffff;
        text-align: center;
        font-size: 14px;
        height: 44px;

        cursor: pointer;
        border: none; /* 移除边框 */
        box-shadow: 0 0 10px #1ca7ee;
        transition: all 0.15s ease;

        margin: 0; /* 确保没有外边距 */
        padding: 0; /* 确保没有内边距 */
        lineHeight: 1; /* 确保行高不影响布局 */
        outline: none; /* 移除可能的外部边框 */
        display: 'block'; /* 设置为块级元素 */
    }
    .TKButtonListItemStyle:active,
    .TKButtonListItemStyle:hover {
        border-radius: 50%;
        box-shadow: 0 0 10px #1ca7ee;
    }

    `;

    var styleId = "TKButtonStyle";
    // 首先查询页面上是否存在具有给定ID的<style>元素
    var existingStyle = document.getElementById(styleId);
    //如果存在则跳过
    if (existingStyle) {
        return;
    }

    var myStyle = document.createElement("style")
    myStyle.type="text/css";
    myStyle.id = styleId;
    myStyle.innerHTML = style;
    document.head.appendChild(myStyle)
}


// -------------------------------Style CSS-------------------------------




// -------------------------------SVG Element-------------------------------

/**
 * 使用文字创建SVG Element元素
 * text：SVG显示的文字
 **/ 
function createSVGElement(text){
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "128");
    svgElement.setAttribute("height", "44");
    // svgElement.setAttribute("style", "background-color: transparent"); // 设置透明背景色

    // // 创建一个<circle>元素
    // var circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // circleElement.setAttribute("cx", "22");
    // circleElement.setAttribute("cy", "22");
    // circleElement.setAttribute("r", "20");
    // circleElement.setAttribute("fill", "#1ca7ee");

    // 创建一个<text>元素并设置其属性和样式
    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    // textElement.setAttribute("width", "128");
    // textElement.setAttribute("height", "44");

    textElement.setAttribute("x", "50%"); // 居中对齐
    textElement.setAttribute("y", "50%");
    textElement.setAttribute("text-anchor", "middle"); // 文本居中对齐
    textElement.setAttribute("dominant-baseline", "middle"); // 文本垂直居中对齐
    textElement.setAttribute("fill", "white");
    textElement.setAttribute("font-size", "14px");
    textElement.setAttribute("font-weight", "700"); // 设置字体粗细
    textElement.style.fontFamily = "Arial"; // 设置字体样式，如果需要的话
    // textElement.textContent = "Send URL";
    textElement.textContent = text; //设置显示文字

    // 将<circle>和<text>元素添加到<svg>元素中
    // svgElement.appendChild(circleElement);

    svgElement.appendChild(textElement);
    return svgElement;
}



/**
 * 创建一个自定义的Button，Button的内部是一个SVG，并且需要指定它的top值。
 * text： 显示的文字
 * top：距离顶部的距离
 * return：返回svg部分
 **/ 
function createItemButton(text,top){
    //根据文字创建SVG
    let itemSVG = createSVGElement(text);
    itemSVG.setAttribute("class","TKButtonStyle");
    //修正，重新设置top的值
    itemSVG.style.top = top;

    // 创建一个包含按钮的DIV元素
    let itemButton = document.createElement("TKButtonItem");
    itemButton.setAttribute("class","TKButtonStyle");
    //修正，重新设置top的值
    itemButton.style.top = top;

    // 将itemSVG添加到itemButton中
    itemButton.appendChild(itemSVG);

    return itemButton
}



/**
 * 创建一个自定义的Button，Button的内部是一个SVG。
 * text： 显示的文字
 * return：返回svg部分
 **/ 
function createListItemButton(text){
    // 根据文字创建SVG
    let itemSVG = createSVGElement(text);
    itemSVG.setAttribute("class", "TKButtonListItemStyle");

    // 创建一个包含按钮的DIV元素
    let itemButton = document.createElement("TKButtonItem");
    itemButton.setAttribute("class", "TKButtonListItemStyle");

    // 将itemSVG添加到itemButton中
    itemButton.appendChild(itemSVG);

    return itemButton
}

// -------------------------------SVG Element-------------------------------







// -------------------------------Toast-------------------------------

/**
 * 初始化Toast组件
 **/ 
function initToast(){
    // 首先查询页面上是否存在TKToast元素
    let existingToast = document.querySelector('TKToast');
    if (existingToast) {
        console.log("TKToast元素存在，跳过本次创建。");
        return;
    }


    var snackbarStyleText = `
    #tktoast-tips-snackbar {
        visibility: hidden;
        background-color: #777;
        color: #fff;
        text-align: center;
        font-size: 20px;
        min-width: 250px;
        padding: 26px;
        border-radius: 12px;
        border-width: 0px;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display:block;
        position:fixed;
        z-index:999999;
    }

    /* 绿色背景 */
    #tktoast-tips-snackbar.success {
        visibility: visible;
        background-color: #147F1C;
    }

    /* 红色背景 */
    #tktoast-tips-snackbar.error {
        visibility: visible;
        background-color: #D53617;
    }

    /* 灰色背景 */
    #tktoast-tips-snackbar.show {
        visibility: visible;
        background-color: #777;
    }
    `;


    // 创建一个<style>元素
    const styleElement = document.createElement('style');
    styleElement.type="text/css";
    styleElement.id = "TKToast-Tips-Snackbar";
    // 创建要添加的CSS规则
    let cssNode = document.createTextNode(snackbarStyleText);
    // 将CSS规则添加到<style>元素中
    styleElement.appendChild(cssNode);
    // 将<style>元素添加到<head>中
    document.head.appendChild(styleElement);

    //创建Toast标签节点
    var snackbar = document.createElement("snackbar")
    snackbar.id = "tktoast-tips-snackbar";

    let toast = document.createElement("TKToast")
    toast.appendChild(snackbar);
    document.body.appendChild(toast);
}


/**
 * 显示Toast,并在1.5秒后消失
 * msg：需要显示的提示信息
 * type：Toast显示的样式：0：错误(红色) 1：成功(绿色) 2：常规(灰色)；与指定toast-tips-snackbar的类型相匹配如：success，fail，show
 **/ 
function showToast(msg,type){
    showToastWtihTime(msg,type,2000);
}


/**
 * 显示Toast
 * msg: 需要显示的提示文字
 * type：Toast显示的样式：0：错误(红色) 1：成功(绿色) 2：常规(灰色)；与指定toast-tips-snackbar的类型相匹配如：success，fail，show
 * time: 显示时长
 **/
function showToastWtihTime(msg,type,time){
    //指定toast-tips-snackbar的样式类型如：success，fail，show
    var style = "show";
    if (type == 0) {
        style = "error";
    }else if (type == 1) {
        style = "success";
    }

    var x = document.getElementById("tktoast-tips-snackbar")
    //例如type=success，表示设定样式为toast-tips-snackbar.success
    x.className = style;
    x.innerText = msg;
    setTimeout(function(){ 
        //1.5秒后将样式恢复为：toast-tips-snackbar
        x.className = x.className.replace(style, "");
    }, time);
}
// -------------------------------Toast-------------------------------





// -------------------------------Tool-------------------------------
/**
 * 将文本拷贝到剪切板
 **/
function copyToClipBoard(text){
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('拷贝到剪切板成功! value：',text);
        }).catch(function(err) {
            // 在这里处理复制失败的情况
            console.error('拷贝到剪切板失败! value：', text, 'Error:', err);
        });
    }else{
        let transfer = document.createElement('input');
        document.body.appendChild(transfer);
        transfer.value = text;
        //transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('拷贝到剪切板成功! value：',text);
        }else{
            console.log('拷贝到剪切板失败! value：',text);
        }
        transfer.blur();
        document.body.removeChild(transfer);
    }
}

// -------------------------------T00l-------------------------------

