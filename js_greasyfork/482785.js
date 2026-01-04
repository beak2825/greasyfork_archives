// ==UserScript==
// @name         弹窗
// @namespace    DMWNamespace
// @version      0.1.0
// @description  test!
// @match        http*://*/*
// @author       大魔王
// @downloadURL https://update.greasyfork.org/scripts/482785/%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/482785/%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var myVariable = 1;
    var button = document.createElement("input");
    button.id = 'popup-button';
    button.type = "button";
    button.value = "打开";
    button.onclick = function() {
        openPopup();
    };
    document.body.appendChild(button);

    // 为按钮添加样式
    var css = `
  #popup-button {
    background-color: #4CAF50; /* 绿色背景 */
    border: none; /* 无边框 */
    color: white; /* 白色文本 */
    padding: 15px 32px; /* 内边距 */
    text-align: center; /* 文本居中 */
    text-decoration: none; /* 无下划线 */
    display: inline-block; /* 内容块级元素 */
    font-size: 16px; /* 字体大小 */
    transition-duration: 0.4s; /* 过渡效果时长 */
    cursor: pointer; /* 鼠标指针变为手形 */
    top: 50%;
    left: 91%;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
    //border-radius: 25px;
    position: fixed;//
    z-index: 1000; //确保置于顶层
    
  }

  /* 按钮鼠标悬停时的样式 */
  #popup-button:hover {
    border-radius: 10px;
    background-color: #45a049; /* 悬停时变为深绿色 */
  }

  /* 按钮点击时的样式 */
  #popup-button:active {
    background-color: #45a049; /* 点击时变为更深的绿色 */
    transform: translateY(4px); /* 点击时向下移动4像素 */
    border-radius: 25px;
    transition-duration: 0.1s; /* 过渡效果时长 */
  }

/* 添加样式到弹窗元素*/
  #popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
    transition: opacity 0.3s ease;
    opacity: 0;
  }
`;

    // 将CSS样式添加到页面头部
    var style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);

    // 创建弹窗元素
    var popup = document.createElement("div");
    popup.id = "popup";
    popup.innerHTML =`
      <h2>动态弹窗</h2>  
        <p>这是一个通过JavaScript动态生成的弹窗。</p>  
        <p>这是一个通过JavaScript动态生成的弹窗。</p> 
        <p>这是一个通过JavaScript动态生成的弹窗。</p> 
        <p>这是一个通过JavaScript动态生成的弹窗。</p> 
        <p>这是一个通过JavaScript动态生成的弹窗。</p> 
        <!-- 关闭按钮 -->  
        <button id="popup-close-button" style="position: absolute; right: 10px; top: 10px;">X</button>  
    `;
    popup.style.display = "none"; // 默认隐藏弹窗
    document.body.appendChild(popup);




    // 显示弹窗的函数
    function showPopup() {
        //console.log(popup);
        popup.style.display = "block"; // 显示弹窗
        popup.style.opacity = "1"; // 设置透明度为1，即完全不透明，可根据需要调整透明度值和动画时长以实现淡入淡出效果等。在CSS中，使用opacity属性实现动画效果通常比较简单。
    }

    // 隐藏弹窗的函数
    function hidePopup() {
        
        //console.log(popup);
        popup.style.display = "none"; // 隐藏弹窗
        popup.style.opacity = "0"; // 设置透明度为0，即完全透明，可根据需要调整透明度值和动画时长以实现淡入淡出效果等。在CSS中，使用opacity属性实现动画效果通常比较简单。
    }

    // 打开弹窗的函数
    function openPopup() {
        
        if (popup.style.display == "none") { // 检查弹窗元素是否已存在
            showPopup(); // 显示弹窗
        } else {
            hidePopup(); // 隐藏弹窗
        }
    }
    // 拖动弹窗的函数  
    var drag = false; // 用于判断是否正在拖动弹窗  
    var offsetX, offsetY; // 用于保存弹窗的初始位置和鼠标的初始位置  
    var twidth = 0; // 用于限制弹窗不变形  
    var theight = 0; // 用于限制弹窗不变形 
    function handleMouseDown(event) {  
        drag = true; // 标记开始拖动弹窗  
        //console.log(this);
        //offsetX = event.clientX - this.getBoundingClientRect().left; // 计算鼠标和弹窗左边界的偏移量  
        //offsetY = event.clientY - this.getBoundingClientRect().top; // 计算鼠标和弹窗上边界的偏移量
        offsetX = event.clientX - (this.getBoundingClientRect().left+(this.getBoundingClientRect().width/2)); // 计算鼠标和弹窗中心点的偏移量  
        offsetY = event.clientY - (this.getBoundingClientRect().top+(this.getBoundingClientRect().height/2)); // 计算鼠标和弹窗中心点的偏移量
        twidth = popup.getBoundingClientRect().width;
        theight = popup.getBoundingClientRect().height;
        //console.log(`x,y(${event.clientX},${event.clientY})\ntwidth:${twidth},theight:${theight}`);
        //console.log('弹窗边界左，上：(',this.getBoundingClientRect().left,',',this.getBoundingClientRect().top,')');
        //console.log('弹窗中心点位置：',this.getBoundingClientRect().left+(this.getBoundingClientRect().width/2),this.getBoundingClientRect().top+(this.getBoundingClientRect().height/2)); 
        //console.log('偏移量：',offsetX,offsetY);  

    }  
    function handleMouseMove(event) {  
        
        if (drag) { // 如果正在拖动弹窗，则更新弹窗的位置  
        
            var popupRect = popup.getBoundingClientRect(); // 获取弹窗的边界信息  
            var newX = event.clientX - offsetX; // 根据鼠标位置计算弹窗新的中心点X/左边界位置  
            var newY = event.clientY - offsetY; // 根据鼠标位置计算弹窗新的中心点Y/上边界位置 
            //console.log('弹窗左边界位置，新的鼠标到位置',popupRect.left,'(',event.clientX,',',event.clientY,')');
            //通过鼠标当前位置与弹窗边界计算是否越界
            let rX = parseInt(event.clientX - popupRect.left);
            let rY = parseInt(event.clientY - popupRect.top);
            //console.log('通过鼠标当前位置与弹窗边界计算是否越界',rX,event.clientX,event.clientX-rX);

            //重新计算鼠标与中心点偏移量，若变大说明离开做边界
            let newOffsetX = parseInt(event.clientX - (popupRect.left+(popupRect.width/2)));

            //console.log(event.clientX-rX , 0);
            // 检查新的位置是否越界，并进行相应调整  
            if (parseInt(event.clientX) < rX) { // 如果新的左边界位置越界，则调整为最左边的边界位置                               
                //console.log(`新的偏移量X:${newOffsetX},旧的${offsetX}`);
                if(newOffsetX < offsetX){//新偏移量变小，左移；变大，右移
                    newX = popupRect.width/2-1;
                }else{
                    newX = popupRect.width/2;
                }
                
                
            }else if ( popupRect.width +popupRect.left > window.innerWidth) { // 如果新的右边界位置越界，则调整为最右边的边界位置  
                 //console.log(event.clientX +(popupRect.width - (event.clientX - popupRect.left)) ,window.innerWidth);
                //console.log('右边界了',newX + popupRect.width); 
                if(newOffsetX < offsetX){
                    newX = window.innerWidth - (popupRect.width/2); 
                }else{
                    newX = window.innerWidth - (popupRect.width/2-1); 
                }
                              
                
                 
            }else{
                //console.log(`宽${popupRect.width},左边距离${popupRect.left},窗口宽度${window.innerWidth}`);
                //防止右边界时候的弹窗变形
                //console.log(`nwidth:${twidth},height:${theight}`);
                popup.style.width = `${twidth}px`;
                popup.style.height = `${theight}px`;
            }
            let newOffsetY = parseInt(event.clientY - (popupRect.top+(popupRect.height/2)));
            if (parseInt(event.clientY) < rY) { // 如果新的上边界位置越界，则调整为最上边的边界位置  
                //重新计算鼠标与中心点偏移量，若变大说明离开做边界
                //let newOffsetY = event.clientY - (popupRect.top+(popupRect.height/2));
                //console.log(`新的偏移量Y:${newOffsetY},旧的${offsetY}`);
                if(newOffsetY > offsetY){
                    //console.log(`鼠标向下边界偏移`);
                    newY = popupRect.height/2;
                }else{
                    //console.log(`鼠标偏移`);
                    newY = popupRect.height/2-1 ;
                }
            } else if (popupRect.height +  popupRect.top > window.innerHeight) { // 如果新的下边界位置越界，则调整为最下边的边界位置
                
                //console.log(`下边界 新的偏移量Y:${newOffsetY},旧的${offsetY}`);
                if(newOffsetY < offsetY){
                    newY = window.innerHeight - popupRect.height/2;  
                }else{
                    newY = window.innerHeight - popupRect.height/2+1;  
                }
                
            }  

                popup.style.left = parseInt(newX) + "px"; // 更新弹窗的位置样式属性，实现水平方向上的拖动效果  
                popup.style.top = parseInt(newY) + "px"; // 更新弹窗的位置样式属性，实现垂直方向上的拖动效果  
                //console.log('更新弹窗位置：',newX,newY); 
        }  
    }  
    function handleMouseUp(event) {  
        drag = false; // 标记停止拖动弹窗  
    }  
    // 将事件处理函数绑定到button按钮上，并添加到页面中  
     
    popup.addEventListener("mousedown", handleMouseDown); // 绑定mousedown事件处理函数到button按钮上，实现拖动开始时的初始位置记录和状态标记设置  
    //document.getElementById("popup-button").addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", function(event) {  
        handleMouseMove(event)
        }); // 绑定mousemove事件处理函数到整个页面上，实现拖动过程中的位置更新操作，并控制只有当button按钮被按下时才会响应鼠标移动事件，避免其他页面元素被误操作拖动问题发生  
    document.addEventListener("mouseup", handleMouseUp); // 绑定mouseup事件处理函数到整个页面上，实现拖动结束时的状态标记设置，避免重复触发鼠标移动事件导致弹窗被错误地拖动问题发生
    // 添加关闭弹窗的按钮点击事件处理函数  
    var closeButton = document.getElementById("popup-close-button");  
        closeButton.addEventListener("click", function() {  
        popup.style.display = "none"; // 隐藏弹窗  
    });
})();