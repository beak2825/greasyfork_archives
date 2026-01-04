// ==UserScript==
// @name        [J]UGG浏览增强
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  简化文章列表页，简化回复区内容，简化文章详情页，文章列表极速预览文章图片
// @author       Jeffc
// @match      https://www.uu-gg.one/forum.php*
// @match      https://www.uu-gg.one/*
// @icon         data:image/png;base64,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
// @grant        none
// @license  
// @downloadURL https://update.greasyfork.org/scripts/492175/%5BJ%5DUGG%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/492175/%5BJ%5DUGG%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==





// 存储图片的索引
let currentImageIndex = 0;
// 存储图片的数组
let imagesArray = [];
// 轮播的图片
let carouseImg;
// 文章列表的预览弹出层Dom对象
let popupElement;
// 定义一个变量来保存定时器
let timer;
let url = document.URL;
// 设置弹出层的位置，稍微偏移一些
const offsetX = 250; // 在X轴上的偏移
const offsetY = 0; // 在Y轴上的偏移
// var mouseX = 0,mouseY = 0;
const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

(function() {
    'use strict';
    document.body.style.background = "#fff";
    CompelPostTitle();
    RemoveSubmitMsgTips();
    // 浏览文章详情页
    if(url.indexOf("viewthread")>-1){
        SimplifyPostDetail();
        RecordViewHistory();
    }
    // 浏览文章列表页
    if(url.indexOf("forumdisplay")>-1){
        // 创建预览窗口的弹出层
        CreatePrePopBox();
        // 简化文章列表的显示，并为每个文章添加快速预览操作
        SimplifyPostList();
        // 添加自定义样式
        AddCustomStyle();
        // 解析历史记录
        AnalyzeRecordHistory();
    }
})();

// 将网页标题强制改成文章的标题
function CompelPostTitle(){
    var realTitle = document.title;

    var task = setInterval(function(){

        if(document.title="别灌水会封号！看发贴框上面")
        {
            window.addEventListener("visibilitychange", function(event) {
                event.stopImmediatePropagation();
            }, true);

            window.addEventListener("webkitvisibilitychange", function(event) {
                event.stopImmediatePropagation();
            }, true);

            window.addEventListener("blur", function(event) {
                event.stopImmediatePropagation();
            }, true);

            document.title = realTitle;

            clearInterval(task);

            console.log("已禁用Title修改");
        }
    },500);
}

// 移除提交评论框上的各种花里胡哨的提示语
function RemoveSubmitMsgTips(){
    document.querySelector(".a_ugg_mu")?.remove();
    document.querySelector(".bml .pbn")?.remove();
    document.querySelector("#wolfcodepostwarn_div")?.remove();
}

// 创建预览窗口的弹出层
function CreatePrePopBox(){
    popupElement = document.createElement("div");
    popupElement.id="popup";
    popupElement.style="position: fixed;display: none;background-color: #f1f1f1;width: 350px;padding: 10px;border: 1px solid #ccc;top: 50%; left: 50%;transform: translate(-50%, -50%);";
    document.body.appendChild(popupElement);
    // 添加鼠标移动事件监听器
    document.addEventListener('mousemove',(e) => {
        // mouseX = e.clientX;
        // mouseY = e.clientY;
        popupElement.style.left = e.clientX + offsetX + 'px';
        popupElement.style.top = e.clientY + offsetY + 'px';
    });
}

// 在弹出层中显示预览图片
function displayImagesInPopup(images) {

    console.log("获取到的图片：",images);
    // 清空弹出层的内容
    popupElement.innerHTML = "";

    // 遍历找到的<img>元素并将它们添加到弹出层中
    imagesArray = Array.from(images).map(img => {

        img.style.display = 'none';
        // 调整图片大小
        img.style.width = '100%'; // 设置宽度
        //img.style.height = '100%'; // 设置高度

        // 隐藏旧图片
        if (imagesArray[currentImageIndex]) {
            imagesArray[currentImageIndex].style.display = 'none';
        }



        // 将新的<img>元素添加到弹出层的父元素
        popupElement.appendChild(img);

        return img;

    });

    popupElement.style.display = 'block';


    // 显示第一张图片，如果存在的话
    if (imagesArray.length > 0) {
        if(imagesArray[currentImageIndex]){
            imagesArray[currentImageIndex].style.display = 'block';
        }
        // 启动轮播
        startImageCarousel();
    }
}

// 开始图片轮播
function startImageCarousel() {
    if(carouseImg)
    {
        clearInterval(carouseImg);
    }
    carouseImg = setInterval(() => {
        if(imagesArray.length ==  1){
            imagesArray[currentImageIndex].style.display = 'block';
        }
        else
        {
            if (imagesArray.length > 1) {
                if(imagesArray[currentImageIndex]){
                    imagesArray[currentImageIndex].style.display = 'none';
                    currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
                    imagesArray[currentImageIndex].style.display = 'block';
                }

            }
        }
    }, 2000); // 3秒切换一次图片
}

// 文章预览图片
function PreviewPostImg(fixDom,link){

    popupElement.innerHTML="加载中";

    console.log("加载图片完成");
    // var img1 = document.createElement('img');
    // img1.src = 'https://fd2024-img-ugg.imgooo.top/forum/202311/16/ca177cb176519.jpg';
    // var img2 = document.createElement('img');
    // img2.src = 'https://fd2024-img-ugg.imgooo.top/forum/202311/16/2c409fda897f4.jpg';
    // displayImagesInPopup([img1,img2]);
    fetch(link)
        .then(response => response.text())
        .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const imgElements = doc.querySelectorAll('img[class="zoom"]');
        displayImagesInPopup(imgElements);
    })
        .catch(error => {
        console.error('请求出错：', error);
    });

}

// 为文章列表添加图片快速预览
function AddMouseEventListenerToPostItem(targetElement){

    let targetItem = targetElement.querySelector("a");
    if(!targetItem)
    {
        console.log("# null object #");
        return;
    }

    // 在这里执行你的事件
    let link = targetItem.href;
    targetElement.addEventListener('click',()=>{
        // 解析 URL 中的参数
        const urlSearchParams = new URLSearchParams(link);
        const params = Object.fromEntries(urlSearchParams.entries());
        // 找到所有以 "normalthread_" 开头的元素
        const element = document.querySelector('#normalthread_'+params.tid);
        var code = document.createElement("span");
        code.classList.add("view_read");
        code.innerHTML="已读";
        element.querySelector("em").appendChild(code);
    });
    // 添加鼠标移入事件监听器
    targetElement.addEventListener('mouseenter', () => {
        if(timer){
            clearTimeout(timer);
        }
        currentImageIndex=0;
        // 在鼠标移入后500毫秒执行的事件
        timer = setTimeout(() => {
            PreviewPostImg(targetElement,link);
        }, 1000);
    });

    // 添加鼠标移出事件监听器，以便在移出时清除定时器
    targetElement.addEventListener('mouseleave', () => {
        clearTimeout(timer);
        popupElement.style.display = 'none';
        imagesArray[currentImageIndex].style.display = 'none';
        clearInterval(carouseImg);
    });
}

// 简化文章列表的显示，并为每个文章添加快速预览操作
function SimplifyPostList(){

    document.querySelector(".bm_h.cl")?.remove();
    document.querySelector(".bm.bml.pbn")?.remove();
    document.querySelector(".fl.bm")?.remove();
    document.querySelector(".bm.bmw")?.remove();
    document.querySelector("#pgt")?.remove();
    document.querySelector("#toptable")?.remove();
    document.querySelector("#nv")?.remove();
    document.querySelector("#diy1").parentNode.remove()
    document.querySelector("#laba")?.remove();
    document.querySelector(".scbar_btn_td").remove()
    document.querySelector(".scbar_icon_td").remove()
    document.querySelector(".scbar_txt_td").style.background="#fff";
    document.querySelector(".scbar_type_td").style.background="#fff";
    document.querySelector("#scbar").style.border="0";
    document.querySelector(".hdc.cl").style.minHeight="0";
    document.querySelector(".hdc.cl").querySelector("h2").remove()
    document.querySelector(".avt.y").remove()
    document.querySelector("#toptb").remove()
    document.querySelector("#um").setAttribute("style","display: flex;flex-direction: row;justify-content: space-evenly;")

    var ctm_icon = `<svg t="1701837516163" class="icon" viewBox="0 0 1042 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7114" width="20" height="20"><path d="M801.387329 219.156917H112.394258V102.57553c0-7.167488 5.905864-12.98193 13.237911-12.98193H788.149418c7.313763 0 13.237912 5.814442 13.237911 12.98193v116.581387z" fill="#3353B6" p-id="7115"></path><path d="M551.366331 179.260339a15.852582 15.852582 0 0 1-11.73859-5.668167 21.447611 21.447611 0 0 1-4.900222-13.676737c0-4.918506 1.846725-9.837012 4.900222-13.530462a15.340619 15.340619 0 0 1 23.385758 0c3.035212 3.69345 4.735662 8.611956 4.735662 13.530462 0 5.064781-1.70045 10.111278-4.753946 13.676737a15.834298 15.834298 0 0 1-11.6106 5.668167m69.22477-19.344904c0-10.440397 7.405185-19.052353 16.510821-19.052354 9.251911 0 16.510821 8.593672 16.51082 19.052354 0 10.732948-7.25891 19.344904-16.51082 19.344904-9.105635 0-16.510821-8.593672-16.510821-19.344904m102.392686 19.344904c-9.142204-0.127991-16.455967-8.758232-16.51082-19.344904 0-5.064781 1.846725-10.001571 4.881937-13.530462a15.523463 15.523463 0 0 1 23.385758 0c3.053496 3.528891 4.753946 8.465681 4.753946 13.530462 0 5.211056-1.70045 10.111278-4.753946 13.676737a16.090279 16.090279 0 0 1-11.756875 5.668167" fill="#E39C26" p-id="7116"></path><path d="M112.357689 896.009142h691.150632V230.456682H112.357689z" fill="#7598D9" p-id="7117"></path><path d="M803.508321 896.009142H112.357689v38.397258c0 7.057782 5.960717 12.799086 13.292765 12.799085h664.565102a13.055067 13.055067 0 0 0 13.292765-12.799085v-38.397258z" fill="#3353B6" p-id="7118"></path><path d="M969.896436 307.251196H227.549461v481.72102h119.269195V896.009142l159.074352-107.036926h463.966859z" fill="#B1CDFC" p-id="7119"></path><path d="M660.707092 630.885222h-141.466466a10.074709 10.074709 0 0 1-10.111278-10.056424c0-5.540176 4.516249-10.056425 10.111278-10.056425h141.448182a10.074709 10.074709 0 0 1 0 20.112849m222.301836 0h-168.399401a10.092993 10.092993 0 0 1-10.129562-10.056424c0-5.540176 4.534533-10.056425 10.111278-10.056425h168.3994a10.074709 10.074709 0 0 1 0 20.112849m-289.661595 60.338548h-74.070138a10.092993 10.092993 0 0 1-10.111278-10.056425c0-5.540176 4.516249-10.056425 10.111278-10.056424h74.070138c5.576745 0 10.111278 4.516249 10.111277 10.056424 0 5.540176-4.534533 10.056425-10.111277 10.056425m168.3994 0h-114.496965a10.092993 10.092993 0 0 1-10.111278-10.056425c0-5.540176 4.534533-10.056425 10.111278-10.056424h114.515249c5.595029 0 10.111278 4.516249 10.111278 10.056424 0 5.540176-4.516249 10.056425-10.111278 10.056425M701.115635 429.756732h-181.875009a10.074709 10.074709 0 0 1 0-20.112849H701.115635a10.074709 10.074709 0 1 1 0 20.112849m181.875009 0h-127.990858a10.074709 10.074709 0 0 1 0-20.112849h127.990858a10.074709 10.074709 0 1 1 0 20.112849m-276.185987 60.338547h-87.582316a10.074709 10.074709 0 0 1-10.092993-10.056425c0-5.55846 4.516249-10.056425 10.111278-10.056424h87.564031c5.55846 0 10.092993 4.497964 10.092993 10.056424 0 5.540176-4.534533 10.056425-10.092993 10.056425m208.807942 0H660.707092a10.074709 10.074709 0 0 1-10.111277-10.056425c0-5.55846 4.516249-10.056425 10.111277-10.056424h154.923792c5.576745 0 10.129562 4.497964 10.129562 10.056424 0 5.540176-4.552818 10.056425-10.129562 10.056425" fill="#3353B6" p-id="7120"></path><path d="M393.937576 512.036569h-63.995429a25.616456 25.616456 0 0 1-25.598172-25.598172v-63.995429a25.598172 25.598172 0 0 1 25.598172-25.598171h63.995429a25.561603 25.561603 0 0 1 25.598171 25.598171v63.995429a25.561603 25.561603 0 0 1-25.598171 25.598172" fill="#EBF3FD" p-id="7121"></path><path d="M377.243911 486.438397a9.672452 9.672452 0 0 1-6.838369-2.815799l-37.501321-37.20877a9.635883 9.635883 0 0 1 4.278552-16.236555 9.74559 9.74559 0 0 1 9.434754 2.61467l30.626384 30.406971 77.178487-76.575101a9.763874 9.763874 0 0 1 13.475609 0.237697c3.675166 3.656882 3.784873 9.562746 0.237698 13.384187l-84.053425 83.376901a9.635883 9.635883 0 0 1-6.838369 2.815799" fill="#1D3285" p-id="7122"></path><path d="M393.937576 704.022856h-63.995429a25.561603 25.561603 0 0 1-25.598172-25.598172v-63.995429a25.616456 25.616456 0 0 1 25.598172-25.598172h63.995429a25.616456 25.616456 0 0 1 25.598171 25.598172v63.995429a25.598172 25.598172 0 0 1-25.598171 25.598172" fill="#EBF3FD" p-id="7123"></path><path d="M918.700093 89.666738l12.250553 25.598172-12.250553 25.598171 25.598171-12.232269 25.598172 12.232269-12.250554-25.598171 12.250554-25.598172-25.598172 12.232269z" fill="#DF751B" p-id="7124"></path><path d="M841.905578 217.657596l12.232269 25.598171-12.232269 25.598172 25.598172-12.232269 25.598171 12.232269-12.250553-25.598172 12.250553-25.598171-25.598171 12.250553z" fill="#DD4A11" p-id="7125"></path><path d="M880.302836 844.812799l12.232269 25.598172L880.302836 896.009142l25.598171-12.232269 25.598172 12.232269-12.250554-25.598171 12.250554-25.598172-25.598172 12.232269z" fill="#E39C26" p-id="7126"></path></svg>`;


    var icons = document.querySelectorAll(".icn a");
    icons.forEach((el)=>{
        el.innerHTML = ctm_icon;
    });

    // 个人信息展示和搜索框
    // document.querySelector(".wp")?.remove();
    // document.querySelector("#thread_types")?.classList.remove("bm")

    let form = document.querySelector("#scbar_form");
    if(form){
        form.style.background="#fff";
        form.style.border="0px";
    }

    let doms = document.querySelectorAll("a[title='隐藏置顶帖']")
    let removeCount = doms.length-1;
    let removeIdx = 0;

    doms.forEach((e)=>{
        if(removeIdx<removeCount){
            e.parentNode.parentNode.parentNode.remove();
            removeIdx++;
        } else {return;}
    });

    document.querySelectorAll("#threadlisttableid tbody").forEach(x=>AddMouseEventListenerToPostItem(x));
}

// 简化文章详情页的内容
function SimplifyPostDetail(){
    document.querySelector(".bm_h.cl")?.remove();
    document.querySelector(".bm.bml.pbn")?.remove();
    document.querySelector(".fl.bm")?.remove();
    document.querySelector(".bm.bmw")?.remove();
    document.querySelector("#pgt")?.remove();
    document.querySelector("#toptable")?.remove();
    document.querySelector("#nv")?.remove();
    document.querySelector("#diy1").parentNode.remove()
    document.querySelector("#laba")?.remove();
    document.querySelector(".scbar_btn_td").remove()
    document.querySelector(".scbar_icon_td").remove()
    document.querySelector(".scbar_txt_td").style.background="#fff";
    document.querySelector(".scbar_type_td").style.background="#fff";
    document.querySelector("#scbar").style.border="0";
    document.querySelector(".hdc.cl").style.minHeight="0";
    document.querySelector(".hdc.cl").querySelector("h2").remove()
    document.querySelector(".avt.y").remove()
    document.querySelector("#toptb").remove()
    document.querySelector("#um").setAttribute("style","display: flex;flex-direction: row;justify-content: space-evenly;")


    let replyfastFlag = false,replyFlag = false;
    let listenerTask = setInterval(function(){
        if(!replyfastFlag){
            let aDom = document.querySelector("a[class='replyfast']");
            if(aDom){
                aDom.addEventListener("click",ListenerReplyEvent)
                replyfastFlag = true;
            }
        }
        if(!replyFlag){
            let aDom = document.querySelectorAll("a[class='fastre']");
            if(aDom.length>0){
                aDom.forEach((e)=>e.addEventListener("click",ListenerReplyEvent));
                replyFlag = true;
            }
        }
        if(replyfastFlag && replyFlag ){clearInterval(listenerTask);}
    },200);
    document.querySelectorAll(".avatar img").forEach(e=>{
        e.style.width="-4px";
        e.style.borderRadius="15px";
    });
    document.querySelectorAll(".avatar~p , .avatar~div , .pls.cl.favatar>p,.pls.cl.favatar>dl,.pls.cl.favatar ul").forEach(x=>x.remove())
}

// 监听回复事件
function ListenerReplyEvent(){
    let task = setInterval(function(){
        let targetDom = document.querySelector("#wolfcodepostwarn_div");
        if(targetDom){
            targetDom.remove();
            AddReplyCheckToPopBox();
            clearInterval(task);
        }

    },200);
}

// 添加回复检测页面到快速回复的弹出框中
function AddReplyCheckToPopBox(){
    let target = document.querySelector("td[fwin='reply']");
    target.setAttribute("style","display: flex; flex-wrap: wrap;justify-content: space-evenly;")
    var domframe = document.createElement("iframe");
    domframe.id="postMsgCheck";
    domframe.src="https://www.uu-gg.one/trash.php";
    domframe.style.width="500px";
    domframe.onload=function(){
        let containerDom,textareaDom;
        let getAreaDom = setInterval(function(){
            let iframeDom = document.querySelector("#postMsgCheck");
            let currDom = iframeDom.contentDocument;
            currDom.body.style.margin="0";
            containerDom = currDom.querySelector(".container");
            if(containerDom){
                textareaDom = containerDom.querySelector("textarea");
                if(textareaDom){
                    //修改样式
                    textareaDom.setAttribute("style","width:300px;height:80px;");
                    containerDom.querySelector("h1")?.remove();
                    containerDom.querySelectorAll("br")?.forEach((e)=>e.remove());
                    containerDom.querySelectorAll("h3")?.forEach((e)=>e.remove());
                    containerDom.style.padding="0px";
                    containerDom.querySelector("form").style.marginBottom="0";
                    let btnBox = containerDom.querySelector(".btn-container");
                    btnBox.style.scale="0.5";
                    btnBox.style.marginTop="0";
                    clearInterval(getAreaDom);
                }
            }

        },200);
    }
    target.appendChild(domframe);
}

// 记录浏览历史
function RecordViewHistory(){
    // 获取当前页面 URL
    const currentURL = window.location.href;

    // 解析 URL 中的参数
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if(params.tid){
        var postTitle = document.querySelector(".ts");
        if(postTitle.innerText.indexOf("[讨论]") > 0 || postTitle.innerText.indexOf("[活动]") > 0  || postTitle.innerText.indexOf("[新闻]") > 0 || postTitle.innerText.indexOf("[晒妹]") > 0)
        {
            localStorage.setItem(params.tid,0);
        }
        else
        {
            if(document.body.innerHTML.indexOf("购买主题") == -1 && document.body.innerHTML.indexOf("如果您要查看本帖隐藏内容请")== -1)
            {

                localStorage.setItem(params.tid,1);
            }
            else{
                localStorage.setItem(params.tid,0);
            }
        }

    }
}

function AddCustomStyle(){

    // 创建 style 元素
    const styleElement = document.createElement("style");

    // 设置样式内容
    styleElement.textContent = `
  .view_pay {
       background: green;
    color: #fff;
    padding: 3px 8px;
    border-radius: 8px;
    margin: 0 0 0 6px;
  }
  .view_read {
       background: red;
    color: #fff;
    padding: 3px 8px;
    border-radius: 8px;
    margin: 0 0 0 6px;
  }
  .view_flag {
       background:#ff6a00 ;
    color: #fff;
    padding: 3px 8px;
    border-radius: 8px;
    margin: 0 0 0 6px;
  }
`;

    // 将 style 元素插入到 head 中
    document.head.appendChild(styleElement);

}

// 文章列表页分析已读的帖子
function AnalyzeRecordHistory(){
    // 找到所有以 "normalthread_" 开头的元素
    const elements = document.querySelectorAll('[id^="normalthread_"]');
    // 遍历元素并进行操作
    elements.forEach(element => {
        var tid = element.id.split("_")[1];
        var record = localStorage.getItem(tid);
        if(record){
            var code = document.createElement("span");
            var tipMsg,tipClass;
            if(record == 0)
            {
                tipMsg = "已读";
                tipClass="view_read";
            }
            else if(record == 1)
            {
                tipMsg="已购";
                tipClass="view_pay";

            }else
            {
                tipMsg="已标记";
                tipClass="view_flag";
            }
            code.classList.add(tipClass);
            code.innerHTML=tipMsg;
            element.querySelector("em").appendChild(code);
        }
    });
}





















