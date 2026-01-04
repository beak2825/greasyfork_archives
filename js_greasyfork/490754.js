// ==UserScript==
// @name         b站批量收藏视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  个人自用批量收藏含BV号文本
// @author       You
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490754/b%E7%AB%99%E6%89%B9%E9%87%8F%E6%94%B6%E8%97%8F%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/490754/b%E7%AB%99%E6%89%B9%E9%87%8F%E6%94%B6%E8%97%8F%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
var Folder ="";
var bvCodesArray=[];
var follow_value=0;
(function() {
    'use strict';
    //window.location.href = "https://www.bilibili.com/";
// 创建 GUI 元素




let follow=localStorage.getItem('follow');
if(follow==1)
{
follow_value=1;
}
    else if(follow==0 || follow==null)
    {
    follow_value=0;
    }






    var guiContainer = document.createElement('div');
    guiContainer.style.position = 'fixed';
    guiContainer.style.top = '100px';
    guiContainer.style.left = '0px';
    guiContainer.style.width = '200px';  // 指定宽度
    guiContainer.style.height = '350px'; // 指定高度
    guiContainer.style.background = '#ffffff';
    guiContainer.style.border = '1px solid #000000';
    guiContainer.style.padding = '10px';
    guiContainer.style.zIndex = '1000';
    guiContainer.style.resize = 'both'; // 启用调整大小

    // 创建提示文本
    var promptText = document.createElement('div');
    promptText.innerHTML = '请输入文本';
    promptText.style.marginBottom = '10px';

    // 创建多行文本输入框
    var inputField = document.createElement('textarea');
    inputField.style.width = '90%';
    inputField.style.height = '100px'; // 设置高度
    inputField.style.marginBottom = '10px';
    inputField.style.backgroundColor = '#f2f2f2'; // 设置背景颜色



    // 创建提示文本
    var promptText2 = document.createElement('div');
    var jiaData = localStorage.getItem('Folder');
    promptText2.innerHTML =`请输入收藏夹名称(${jiaData})`;
    promptText2.style.marginBottom = '10px';

    var inputField1 = document.createElement('input');
    inputField1.setAttribute('type', 'text');
    inputField1.style.width = '90%';
    inputField1.style.marginBottom = '10px';
    inputField1.style.backgroundColor = '#f2f2f2';

    //清除按钮
    var buttondelet =document.createElement('button');
    buttondelet.innerHTML = '清除bv号';
    buttondelet.style.padding = '10px';
    buttondelet.style.backgroundColor = '#38B0DE';
    buttondelet.addEventListener('click', function()
                                 {
     localStorage.setItem('bvCodes', '');
inputField.value = '';

    })

    //关注按钮
    var follow_buttondelet =document.createElement('button');
    let string = follow_value==1?'自动关注up（开）':'自动关注up（关）'
    follow_buttondelet.innerHTML = string;
    follow_buttondelet.style.padding = '10px';
    follow_buttondelet.style.backgroundColor = '#38B0DE';
   follow_buttondelet.addEventListener('click', function()
                                 {
       if(follow_value==1)
       {
           follow_value=0;
           follow_buttondelet.innerHTML = '自动关注up（关）';
           localStorage.setItem('follow', '0');
       }
       else if(follow_value==0 || follow==null)
       {
           follow_buttondelet.innerHTML = '自动关注up（开）';
       follow_value=1;
           localStorage.setItem('follow', '1');
       }
    })


    //保存收藏夹按钮
    var buttonjia =document.createElement('button');
    buttonjia.innerHTML = '保存收藏夹';
    buttonjia.style.padding = '10px';
    buttonjia.style.backgroundColor = '#38B0DE';
    buttonjia.addEventListener('click', function()
                                 {
     Folder =inputField1.value;
     localStorage.setItem('Folder', Folder);
     promptText2.innerHTML =`请输入收藏夹名称(${Folder})`;

    })
    // 创建执行按钮
    var button = document.createElement('button');
    button.innerHTML = '执行';
    button.style.backgroundColor = '#38B0DE';
    button.style.padding = '10px';
    // 获取输入文本的数据
    button.addEventListener('click', function() {
    var inputData = inputField.value;

    // 提取BV开头的数据
    var lines = inputData.split('\n');
    var bvCodes = [];
    lines.forEach(function(line) {
        var bvCode = line.match(/BV\w{10}/);
        if (bvCode) {
            bvCodes.push(bvCode[0]);
        }
    });
        //存储bv
         localStorage.setItem('bvCodes', bvCodes);

        if(bvCodes.length>=1)

        {
            var firstBVUrl = 'https://www.bilibili.com/video/' + bvCodes[0];
            // 使用 window.open() 方法打开新网页
            window.open(firstBVUrl, '_blank');
        }

        
});

    //页面加载完后执行
    window.addEventListener('load', function() {
        loadData();
    });

    
// 将元素添加到 GUI 中
    buttondelet.style.marginRight = '10px';
    // 在清除按钮右侧添加间距


buttonjia.style.marginRight = '10px';
    // 在保存收藏夹按钮右侧添加间距


button.style.marginRight = '10px';
    // 在执行按钮右侧添加间距

    buttondelet.style.marginBottom = '10px';
    // 在清除按钮下方添加间距
buttonjia.style.marginBottom = '10px';
    // 在保存收藏夹按钮下方添加间距
button.style.marginBottom = '10px';
    // 在执行按钮下方添加间距


    guiContainer.appendChild(promptText);
    guiContainer.appendChild(inputField);
    guiContainer.appendChild(promptText2);
    guiContainer.appendChild(inputField1);
    guiContainer.appendChild(button);
    guiContainer.appendChild(buttonjia);
    guiContainer.appendChild(buttondelet);
    guiContainer.appendChild(follow_buttondelet);
    // 将 GUI 添加到页面上
    document.body.appendChild(guiContainer);

    // 实现拖动功能
 //   var isDragging = false;
  //  var offsetX, offsetY;
//
  //  guiContainer.addEventListener('mousedown', function(e) {
  //      isDragging = true;
  //      offsetX = e.clientX - guiContainer.getBoundingClientRect().left;
  //      offsetY = e.clientY - guiContainer.getBoundingClientRect().top;
 //   });

  //  document.addEventListener('mousemove', function(e) {
  //      if (isDragging) {
 //           guiContainer.style.left = (e.clientX - offsetX) + 'px';
 //           guiContainer.style.top = (e.clientY - offsetY) + 'px';
        }
//    });

   // document.addEventListener('mouseup', function() {
   //     isDragging = false;
  //  });

   // //setTimeout(triggerClickEvent_Shoucang, 3000);

    // Your code here...

//}
)();

function loadData()

{
// 定义一个标志变量来跟踪函数是否已经执行过
    // 判断是否在顶层窗口执行
    if (window === window.top) {
    // 在顶级窗口执行的逻辑
    var isFunctionExecuted = false;
    // 从 localStorage 获取存储的数据并转换为数组
        var storedData = localStorage.getItem('bvCodes');
        if(storedData)
            {
                bvCodesArray = storedData.split(',');
            }

    if(bvCodesArray.length>=1 && bvCodesArray)
    {
        setTimeout(()=>{GetForsetURL(bvCodesArray[0]);}, 1000);

    }
    } else {
    // 在 iframe 中不执行的逻辑
    console.log('Skipping script execution in iframe.');
    }
}



//点击确认
function triggerClickEvent_Queren(bv) {
  let divElement = document.querySelector('button.btn.submit-move');
  if (divElement) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    divElement.dispatchEvent(clickEvent);
    setTimeout(()=>{openNew(bv)}, 1000);
  } else {
    console.log("未找到指定的元素");
  }

}

//收藏完成后或已收藏打开新网页

function openNew(bv)
{
    let storedDatacopy = bvCodesArray;
    let bvToRemove=bv;
    console.log("即将删除第一个bv",storedDatacopy);
    // 使用 filter 方法删除指定的 BV 开头的数据
    var updatedBVCodesArray = storedDatacopy.filter(function(bvCode) {
    return bvCode !== bvToRemove;
});
    if(updatedBVCodesArray.length==0)
    {
        console.log("全部收藏完成",storedDatacopy);
        localStorage.setItem('bvCodes','');
        // 关闭当前网页
        window.close();
    }
    else
    {
        // 将更新后的数组重新存储到 localStorage 中
        localStorage.setItem('bvCodes', updatedBVCodesArray.join(','));
        let firstBVUrl2 = 'https://www.bilibili.com/video/' + updatedBVCodesArray[0];
        // 使用 window.open() 方法打开新网页
        window.location.href = firstBVUrl2;

}
}
function GetForsetURL(bv)
{

         // 获取当前网页的完整链接
        var fullUrl = window.location.href;
        // 提取当前网页的 URL 部分（即去掉协议、主机名等）
        var currentUrl = new URL(fullUrl).pathname;
        // 使用正则表达式匹配以BV开头的数据
        let CurrBV = currentUrl.match(/BV\w{10}/);

        if (CurrBV) {
            //获取成功后判断
            UrlMatch(CurrBV[0],bv);

        } else {
            console.log('No BV code found in the path.');
        }




}
//关注
function follow_cli()
{

     let divElement = document.querySelector('.default-btn.follow-btn.b-gz.not-follow > .follow-btn-inner');
    if(divElement)
    {
        console.log("找到指定的元素，没关注");
           let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    divElement.dispatchEvent(clickEvent);
    }
     else
     {
        console.log("未找到指定的元素，已经关注");
    }

}





//打开新网页后判断URL是否与存储空间第一个相同
function UrlMatch(CurrBV,bv)
{
            if(bv===CurrBV)
            {
                //开始执行收藏函数
                 if(follow_value==1)
                {
console.log("执行关注函数");
                    setTimeout(()=>{follow_cli();}, 1000);
                }
                console.log("执行收藏函数");



                setTimeout(()=>{triggerClickEvent_Shoucang(bv);}, 4000);
            }
    else{
    console.log("bv不匹配");
        console.log("当前的bv:",CurrBV);
        console.log("目前第一个的bv:",bv);
         let firstBVUrl2 = 'https://www.bilibili.com/video/'+bv;
            // 使用 window.open() 方法打开新网页
        setTimeout(()=>{ window.open(firstBVUrl2, '_blank');}, 3000);

    }

}
//选择收藏文件夹
function triggerClickEvent_Jia(bv) {
    let divElement=null;
    let Folder=localStorage.getItem('Folder');
    if(Folder===null)
    {
        
    }
    else
    {
        divElement = document.querySelector(`span[title='${Folder}']`);
        if(!divElement)
        {
            divElement = document.querySelector('span[title="默认收藏夹"]');
        }
    }
  
  if (divElement) {
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    divElement.dispatchEvent(clickEvent);
    setTimeout(()=>{triggerClickEvent_Queren(bv)}, 3000);
  } else {
    console.log("未找到指定的元素");
    openNew(bv);
  }

}
//点击收藏按钮
function triggerClickEvent_Shoucang(bv) {


    // 获取具有类名 "video-fav video-toolbar-left-item" 的元素
let divElement = document.querySelector('.video-fav.video-toolbar-left-item');

// 检查元素是否含有类名 "on"
if (divElement.classList.contains('on')) {
    console.log('当前状态是开启状态');
        console.log("已收藏，跳转下一个");
        setTimeout(()=>{openNew(bv)}, 2000);

} else {
    console.log('当前状态是关闭状态');
     let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    divElement.dispatchEvent(clickEvent);
      setTimeout(()=>{triggerClickEvent_Jia(bv)}, 3000);
}


}