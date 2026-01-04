// ==UserScript==
// @name         wb_哔哩哔哩_收藏夹
// @version      2024-08-16
// @description  这是一条介绍吗
// @author       这是什么东西
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @namespace https://greasyfork.org/users/1346256
// @downloadURL https://update.greasyfork.org/scripts/502751/wb_%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9_%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/502751/wb_%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9_%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==
//
//收藏夹页最上方头部 导航条自定义功能 点击排序
//哔哩哔哩评论区 设置评论的上下间距
/**搜索栏筛选自定义最新发布最多弹幕最多收藏综合排序全部时长10-30分钟30*/
//设置动态壁纸的适配
//切换渲染动态/静态壁纸

//自定义打开搜索的界面
//获取头部搜索框的 热门/猜你喜欢视频

//锤子手机 多板块视图快速启动应用

//BewlyBewl
//视频进行封面预览 可拖动进度条 可播放声音
//设置背景壁纸 可上传网络壁纸
//可过滤 用户输入的播放量下的视频
//高亮搜索关键词

//bilibili-app-recommend
//Document Picture-in-Picture API 根据该api进行画中画 实现多视图快速切换页面

//视频封面 可添加画中画api,复制bvid,封面图片,复制链接地址,查询该up个人空间
//悬浮查看空间个人信息 iframe //Document Picture-in-Picture API  获取画中画内容 进行增删

//  =======================
//  =              . 小窗 =
//  =....................=
//  =              .个人  =
//  =              .空间  =
//  =======================


var WB_BILIBILI_MAIN_START = function(){
    //播放视频界面美化
    var wb_video_style = function(){
        //设置视频页面样式 根据不同视频类型的页面
        if(document.domain=='www.bilibili.com'){
            console.log('视频界面    开始执行');
            //设置推荐视频_文字
            var recommend_video_fontsize = function () {
                if(document.querySelectorAll("#reco_list > div.rec-list > div")){
                    document.querySelectorAll("#reco_list > div.rec-list > div").forEach((e) => {
                        if(e.className=='video-page-card-small'){
                            e.querySelector("div > div.info").style.fontSize = "12px";
                            e.querySelector("div > div.info").style.marginLeft = "3px";
                            e.querySelector("div > div.info > a > p").style.fontSize = "13px";
                        }else{
                            console.log('我是第一个推荐视频上方的广告_已删除',e.remove());
                        }
                    });
                }
            };
            //设置 拥有封面的合集视频 样式
            var set_has_cover_style = function(){
                //推荐视频标题的文字
                recommend_video_fontsize()
                //合集封面的属性 
                document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.video-sections-v1 > div.video-sections-content-list.has-margin").marginTop="0px"
                document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.video-sections-v1 > div.video-sections-content-list.has-margin").overflowY="scroll"
                //合集封面的属性_字体的宽度
                document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.video-sections-v1 > div.video-sections-content-list.has-margin > div").width="347px"
                //合集视频标题文字
                var collection_fontSize = document.querySelectorAll("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.video-sections-v1 > div.video-sections-content-list.has-margin >div >div >div")
                collection_fontSize.forEach(e=>{
                    e.querySelector('div.video-episode-card__info > p.video-episode-card__info-title').style.width='230px'
                    e.querySelector('div.video-episode-card__info > p.video-episode-card__info-title').style.fontSize='14px'
                    e.querySelector('div.video-episode-card__info > p.video-episode-card__info__number').style.fontSize='11px'
                })
            }
            //设置 没有封面的合集视频 样式
            var set_noHas_cover_style= function(){
                //有合集_没图片 推荐视频字体没设置
                recommend_video_fontsize()
                //设置有合集_无封面_首个推荐视频的字体样式
                if(document.querySelector(".base-video-sections-v1")){
                    document.querySelector("#reco_list > div.rec-list > div.video-page-operator-card-small > div > div.info").style.fontSize='12px'
                    document.querySelector("#reco_list > div.rec-list > div.video-page-operator-card-small > div > div.info").style.marginLeft='3px'
                    document.querySelector("#reco_list > div.rec-list > div.video-page-operator-card-small > div > div.info > a > p").style.fontSize='13px'
                    document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.base-video-sections-v1 > div.video-sections-content-list").style.height="238px"
                    document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.base-video-sections-v1 > div.video-sections-content-list").style.maxHeight="238px"
                    document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.base-video-sections-v1").style.marginTop='-21px'
                }
            }
            //设置 合集都没有的普通视频 样式
            var set_base_video_style= function(){
                //普通没合集的视频 推荐视频字体没设置
                recommend_video_fontsize()
                // 设置普通_没合集_首个推荐视频的字体样式
                if(document.querySelector("#reco_list > div.next-play > div.video-page-card-small > div > div.info")){
                    document.querySelector("#reco_list > div.next-play > div.video-page-card-small > div > div.info").style.fontSize='12px'
                    document.querySelector("#reco_list > div.next-play > div.video-page-card-small > div > div.info").style.marginLeft='3px'
                    document.querySelector("#reco_list > div.next-play > div.video-page-card-small > div > div.info > a > p").style.fontSize='13px'
                }
            }
            //评论区右侧加载后的视频文字不受样式变化 点击展开添加重设style
            if(document.querySelector('#reco_list > div.rec-footer')){
                document.querySelector("#reco_list > div.rec-footer").addEventListener('click',e=>{
                    if(document.querySelector(".base-video-sections-v1")){
                        //不具有封面_合集视频
                        set_noHas_cover_style()
                    }else if(document.querySelector(".has-margin")){
                        //带有封面的_合集视频
                        set_has_cover_style()
                    }
                    //有坑 待修
                    set_base_video_style()
                })
            }
            document.querySelector("#v_tag").style.borderBottomColor = "transparent";
            document.querySelector("#arc_toolbar_report").style.borderBottomColor = "transparent";
            // 调用after函数交换评论区和侧边栏
            var comment = document.querySelector("#comment")
            var broadside = document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab")
            broadside.after(comment);
            //标题和发布时间
            document.querySelector("#viewbox_report").style.marginBotton="-17px"//无法设置
            //视频标题
            document.querySelector("#viewbox_report").style.paddingTop="1px"
            document.querySelector("#viewbox_report").style.height="49px"
            //发布时间
            document.querySelector("#viewbox_report > div.video-info-meta").style.marginTop="-7px"
            //三连
            document.querySelector("#arc_toolbar_report").style.paddingTop="6px"
            document.querySelector("#arc_toolbar_report").style.height="24px"
            //简介
            document.querySelector("#v_desc").style.margin="0px 0px"
            //标签栏
            document.querySelector("#v_tag").style.margin="0px"
            document.querySelector("#v_tag").style.paddingBottom="0px"
            //视频右侧整体容器
            document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab").style.marginLeft="3px"
            document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab").style.width="370px"
            if(document.querySelector(".base-video-sections-v1")){
                //不具有封面_合集
                set_noHas_cover_style()
            }else if(document.querySelector(".has-margin")){
                //有封面_合集
                set_has_cover_style()
            }else if(document.querySelector('.next-play')){
                //无合集 普通视频
                set_base_video_style()
            }else{
                console.log('好像没有匹配到任何类型的视频');
            }
            console.log('视频界面   执行完毕');
        }
    }
    //顶部右侧触摸栏_收藏
    var TopHeadCallback = function(){
        console.log('顶部_菜单栏    开始执行');
        let hasStyles = false; //标志变量，检查是否应用了样式
        //getComputedStyle可以获取元素的所有样式
        //哔哩哔哩头部 添加触摸监听
        let head = document.querySelector("#biliMainHeader")
        try {
            head.addEventListener('mouseover',e=>{
                if(!hasStyles){
                    //动态
                    var targetElement = document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4) > div > div > div > div > div.header-content-panel > div.dynamic-all").querySelectorAll('a')
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4) > div > div > div > div").style.maxHeight='3387px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4) > div > div > div").style.width='680px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4) > div").style.left='148%'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4) > div").style.paddingTop='0px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(4) > div").style.marginLeft='-80px'
                    for (var i = 0; i < targetElement.length; i++) {
                        let tmp = targetElement[i].children
                        if(tmp.length>0){
                            if(tmp[0].className=='header-dynamic-list-item'){
                                tmp[0].querySelector('.header-dynamic__box--center').style.width="560px"
                                tmp[0].querySelector('.dynamic-info-content').style.maxWidth="500px"
                            }
                        }
                    }
                    //收藏夹
                    document.querySelectorAll('.v-popover').forEach(e => { e.style.transition='0s'})
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div > div > div > div.favorite-panel-popover__content").style.height='1387px'
                    document.querySelector("#favorite-content-scroll").style.height='1387px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div > div > div > div.favorite-panel-popover__nav").style.height='1387px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div > div > div").style.width='680px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div").style.left='40%'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div").style.paddingTop='0px'
                    document.querySelector("#biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div").style.marginLeft='-80px'
                    hasStyles = true; // 标记为已应用样式
                } })
        } catch (error) {
            console.log(error);
        }
          console.log('顶部_菜单栏    执行完毕');
    }
    //初始化基础空间
    var wb_space = function (){
        if(document.domain=='space.bilibili.com'){
            console.log('个人空间    开始执行');
            //空间头部壁纸
            document.querySelector('.h-inner').style.height='0px'
            document.querySelector('.h-user').style.top='-95px'
            document.querySelector('#app').style.position='absolute'
            document.querySelector('.h-inner').style.width='100%'
            document.querySelector('.h-inner').style.flot='left'
            document.querySelector('.h-inner').style.backgroundImage = 'url("https://c.pxhere.com/photos/fe/da/girl_person_human_female_face_eyes_freckles_portrait-834632.jpg!d")';
            //设置收藏夹侧边栏的最大高度 设置为没有限制
            document.querySelector("#fav-createdList-container").style.maxHeight='9999px'
            document.querySelector("#fav-list-container").style.maxHeight='9999px'
            //设置收藏夹列表行高
            document.querySelectorAll("#page-fav .fav-sidenav .text").forEach(e => {
                e.style.lineHeight='30px'
            });
            //设置侧边栏ico大小
            document.querySelectorAll("#page-fav .fav-sidenav .fav-item .iconfont ").forEach(e => {
                e.style.fontSize='19px'
            });
            //设置侧边栏文字溢出
            document.querySelectorAll("#page-fav .fav-sidenav .text").forEach(e => {
                e.style.textOverflow='clip'
            });
            // 创建一个新的 span 元素 升降壁纸
            var newSpan = document.createElement("span");
            newSpan.style.height = "48px";
            newSpan.style.color = "rgb(129, 206, 266)";
            newSpan.style.backgroundColor = "transparent"; // 注意：不要在这里使用 !important
            newSpan.style.fontSize = "22px";
            newSpan.style.lineHeight = "110%";
            newSpan.id = "girl";
            newSpan.textContent = "切换升降"; // 设置文本内容
            newSpan.style.position= 'relative';
            // 获取目标父节点和参照节点（如果有的话）
            var targetParent = document.querySelector("#app > div.h > div.wrapper > div.h-inner");
            var referenceNode = document.querySelector("#app > div.h > div.wrapper > div.h-inner > div.be-dropdown.h-version");
            // 注意：通常我们不会在同一个父节点内将一个节点插入到它自己的前面
            // 如果您的意图是将新 span 插入到 div.be-dropdown.h-version 前面，您需要确保它们有共同的父节点
            if (targetParent && referenceNode) {
                targetParent.insertBefore(newSpan, referenceNode);
            } else {
                console.error("未找到父节点或参照节点！");
            }
            //下面是插入视频
            // 创建<input type="file">元素
            var videoInput = document.createElement('input');
            videoInput.type = 'file';
            videoInput.id = 'videoInput';
            videoInput.accept = 'video/*';
            document.querySelector("#app > div.h > div.wrapper").insertBefore(videoInput,null)
            // 创建<video>元素
            var videoPlayer = document.createElement('video');
            videoPlayer.id = 'videoPlayer';
            videoPlayer.controls = true;
            document.querySelector("#app > div.h > div.wrapper").insertBefore(videoPlayer,null)
            document
                .getElementById("videoInput")
                .addEventListener("change", function (event) {
                var file = event.target.files[0]; // 获取用户选择的文件
                if (file) {
                    var videoURL = URL.createObjectURL(file); // 创建一个指向文件的URL
                    var videoPlayer = document.getElementById("videoPlayer");
                    videoPlayer.src = videoURL; // 将视频的URL设置为<video>元素的src
                }
            });
            //设置<video>标签
            document.querySelector("#videoPlayer").style.height='auto'
            document.querySelector("#videoPlayer").style.width='1283px'
            //升降壁纸的按钮样式
            document.querySelector("#girl").style.top='-140px'
            document.querySelector("#girl").style.left='1127px'
            document.querySelector("#girl").style.zIndex='11'
            document.querySelector("#girl").style.cursor='pointer'
            document.querySelector("#girl").style.userSelect='none'
            //头部静态壁纸升降按钮逻辑
            document.querySelector('#girl').addEventListener('click',e=>{
                document.querySelector('.h-inner').style.height!='500px'?document.querySelector('.h-inner').style.height = '500px':document.querySelector('.h-inner').style.height = '0px'
            })
            let sidenav = document.querySelector('.fav-sidenav');
            let main = document.querySelector('.fav-main');
            main.after(sidenav)
            console.log('个人空间   执行完毕');
        }
    }
    function init(){
        //顶部右侧触摸栏_收藏
        TopHeadCallback()
        //初始化个人空间
        wb_space()
        //播放视频界面美化
        setTimeout(wb_video_style,1500);
    }
    init()
    observer.disconnect()
}
//定时执行
setInterval(() => {
    //切换视频 标题的top值总是重置
    if(document.querySelector("#viewbox_report")){
        document.querySelector("#viewbox_report").style.paddingTop = "1px";
        document.querySelector("#viewbox_report").style.height = "49px";
    }
    //去除评论区广告和推荐的直播
    if(document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.pop-live-small-mode.part-1")){
        document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.pop-live-small-mode.part-1").remove();
    }else if(document.querySelector("#activity_vote")){
        document.querySelector("#activity_vote").remove();
    }else if(document.querySelector("#right-bottom-banner")){
        document.querySelector("#right-bottom-banner").remove();
    }
}, 1000);
var observer = new MutationObserver(WB_BILIBILI_MAIN_START);
var config = { childList: true, subtree: true };
observer.observe(document.body,config)
/**
//------------------------------失败品---------------------------------
//------------------------------失败品---------------------------------
//------------------------------失败品---------------------------------
//🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲
//   傻逼 什么逼玩意
//   var sb = function () {
     console.log("当前url", window.location.pathname);
    function setHeightTo49px(elementId) {
      const element = document.querySelector(elementId);
      if (!element) {
        console.log("元素不存在");
        return;
      }
      let currentHeight = element.style.height;
      if (!currentHeight || currentHeight !== "49px") {
        console.log(`当前高度是 ${currentHeight || "未设置"}, 准备设置为 49px`);
        element.style.paddingTop = "1px";
        element.style.height = "49px";
        setHeightTo49px(elementId);
      } else {
        console.log("设置完毕，当前高度是 49px");
      }
    }
   setHeightTo49px("#viewbox_report")
  }
    document.addEventListener("mousemove", sb);
//🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲
//这里创建了一个"获取你想看的"按钮,点击后插入一个iframe标签
var newPageBut = document.createElement("div");
    newPageBut.style.height = "48px";
    newPageBut.style.width = "135px";
    newPageBut.style.fontSize = "22px";
    newPageBut.style.color = "rgb(129, 206, 266)";
    newPageBut.style.backgroundColor = "transparent";
    newPageBut.style.zIndex = "111";
    newPageBut.style.position = "relative";
    newPageBut.style.top = "81px";
    newPageBut.style.left = "1121px";
    newPageBut.textContent="获取你想看的"
    newPageBut.style.cursor='pointer'
    newPageBut.style.userSelect='none'
    newPageBut.id="newPageButId"
    let parentElement = document.querySelector("#app");
    parentElement ? document.body.insertBefore(newPageBut, parentElement) : document.body.appendChild(newPageBut);
    newPageBut.addEventListener('click',e=> addNewPage())
    function addNewPage() {
        // 创建一个用于包含iframe的div
        var NewPageFramework = document.createElement("div");
        NewPageFramework.style.height = "400px"; // 调整高度以匹配iframe
        NewPageFramework.style.width = "618px"; // 调整宽度以匹配iframe
        NewPageFramework.style.border = "1px solid black"; // 可选：添加边框以便于观察
        NewPageFramework.style.backgroundColor = "transparent";
        NewPageFramework.style.position = "relative";
        NewPageFramework.style.left = "1282px";
        NewPageFramework.id = "newpageID"
        NewPageFramework.style.zIndex = "111";
        let parentElement = document.querySelector("#newPageButId");//获取按钮 插入到按钮元素后面
        parentElement && document.body.insertBefore(NewPageFramework, parentElement) || document.body.appendChild(NewPageFramework);

        var iframe = document.createElement("iframe");
        iframe.src ="https://message.bilibili.com/?spm_id_from=333.999.0.0#/whisper/mid103742061";
        //iframe.sta ="https://www.bilibili.com/video/BV14h411573L/?spm_id_from=333.999.0.0"
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.id ="iframeID";
    // iframe.allowfullscreen = "true";
    // iframe.webkitallowfullscreen = "true";
    // iframe.mozallowfullscreen = "true";
    // iframe.setAttribute(
    //   "sandbox",
    //   "allow-top-navigation allow-same-origin allow-forms allow-scripts"
    // );
        NewPageFramework.appendChild(iframe); // 将iframe添加到NewPageFramework容器中 并填满框架

        // 给document添加一个点击事件监听器，但只在需要时检查点击位置
        let newpageElement = document.querySelector('#newpageID')
        let iframeElement = document.querySelector('#iframeID')
        document.addEventListener("click", function (event) {
            var BUT = document.querySelector("#newPageButId");
            if ( event.target !== BUT) {
                newpageElement.remove();
                iframeElement.remove();
            }
        });
// space.bilibili.com访问www.bilibili.com 视频必定会跳转 不知道怎么解决
// space.bilibili.com访问search.bilibili.com 也是正常
// www.bilibili.com访问www.bilibili.com 不会跳转 一切正常
    }
        //document.querySelectorAll("html").style.zoom="0.54"

//🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲
//HTML5 video 标签属性、API 方法、事件、自定义样式详解与实用示例
// poster
// 定义：指定视频加载时显示的封面图片 URL。
//  autoplay
// 定义：如果设置，视频将在页面加载后自动开始播放。
//controls = true;  //浏览器会显示内置的播放控制（如播放/暂停按钮、音量控制、全屏切换等）。
//loop
// 定义：当设置时，视频会在播放结束后自动重头开始。
// muted
// 定义：设置视频初始为静音状态。
// preload
// 定义：指示浏览器如何预先加载视频数据。可选值有：
// auto：尽可能多地预加载视频内容。
// none：不预加载视频数据。
// metadata：仅预加载视频元数据（如时长、尺寸）。
// 示例：
// <video src="my_video.mp4" preload="metadata"></video>
// 10. controlslist
// HTML5 的 <video> 标签提供了丰富的媒体播放功能，其中 controlslist 属性允许开发者精细控制浏览器提供的默认视频控件中显示或隐藏的特定组件，以适应不同的用户体验需求或设计要求。以下是关于 controlslist 属性的详细说明：
// controlslist 属性可以直接应用于 <video> 元素。要启用它，只需在 HTML 代码中的 <video> 标签中添加 controlslist 属性，并设置其值为一个空格分隔的控件列表。例如：
// <video src="my_video.mp4" controls controlslist="nodownload noplaybackrate">
// 10.1. 可用值
// controlslist 支持以下值，这些值可单独使用或组合使用：
// nodownload：阻止显示下载按钮，防止用户直接下载视频文件。这有助于保护视频内容的版权或限制离线访问。
// nofullscreen：禁止全屏模式按钮的显示，防止用户将视频切换到全屏观看。
// noremoteplayback（或 disableremoteplayback）：禁用远程播放选项，如在连接到同一网络的其他设备（如智能电视）上投射或播放视频。
// noplaybackrate：移除播放速度控制器，用户将不能调整视频的播放速率（如快进、慢放或倒带）。
// nokeyboard（实验性，非标准）：在某些浏览器中，可能用于隐藏键盘快捷键提示或禁止通过键盘操作视频控件。
// 请注意，不是所有浏览器都完全支持所有的 controlslist 值，尤其是在 nokeyboard 这种较新或实验性的特性上。对于广泛支持的值（如 nodownload、nofullscreen、noremoteplayback 和 noplaybackrate），现代浏览器通常会遵循这些指示。
// 10.2. 默认行为与覆盖
// 默认情况下，如果仅使用 controls 属性而未指定 controlslist，浏览器将显示一组完整的标准控件，包括播放/暂停按钮、进度条、音量控制、全屏按钮、下载按钮（如果支持），以及可能的播放速度控制器。
// 当指定了 controlslist 并包含否定属性（如 nodownload），浏览器会相应地隐藏或禁用指定的控件。例如，如果希望仅显示基本的播放/暂停、进度条和音量控制，同时禁止下载、全屏和播放速度调整，可以这样设置：
// <video src="my_video.mp4" controls controlslist="nodownload nofullscreen noplaybackrate">
// 10.3. 浏览器兼容性
// 虽然 controlslist 是 HTML5 规范的一部分，但实际支持情况可能因浏览器版本不同而有所差异。一些较新的或实验性的功能（如 nokeyboard）可能只有在特定浏览器或特定版本中才能使用。在实际应用时，建议查阅最新的浏览器兼容性数据，确保所使用的 controlslist 值在目标用户群体的主流浏览器中得到良好支持。
// 10.4. 替代方案
// 对于不被所有浏览器广泛支持的 controlslist 值，或者为了实现更定制化的视频播放器外观与功能，开发者可以选择使用第三方 JavaScript 库或自定义 CSS/JavaScript 来创建完全自定义的视频控件界面。这种情况下，可以移除 controls 属性并自行编写交互逻辑，从而实现对视频播放器的完全控制。
// 总结来说，HTML5 <video> 标签的 controlslist 属性提供了一种简便的方法来定制浏览器默认视频控件的显示内容，允许开发者根据项目需求隐藏特定功能以增强内容保护或优化用户界面。在使用时应注意浏览器兼容性，并在必要时结合自定义代码实现更复杂的播放器定制。
// 原文链接：https://blog.csdn.net/u012347650/article/details/137863919
//🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲
//setProperty的使用可以设置important属性 这里定义了一个简化setProperty的函数
// 定义一个函数来设置元素的背景颜色
// function setBackground(selector, bgColor, important = false) {
//     const element = document.querySelector(selector);
//     if (element) {
//         if (important) {
//             element.style.setProperty('background', bgColor, 'important');
//         } else {
//             element.style.background = bgColor;
//         }
//     }
// }
// // 设置 body 的背景颜色，使用 !important
// setBackground('body', 'rgb(13,14,14)', true);
// // 设置其他元素的背景颜色
// setBackground('#biliMainHeader', 'rgb(13,14,14)');
// setBackground('#page-fav .fav-main .search-input input', 'rgb(13,14,14)');
// setBackground('.bili-header .center-search-container .center-search__bar #nav-searchform', 'rgb(13, 14, 14)');
//🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲🈲
/** 鼠标事件的应用
click                          当用户点击某个对象时调用的事件句柄
contextmenu            在用户点击鼠标右键打开上下文菜单时触发
dblclick                     当用户双击某个对象时调用的事件句柄
mousedown              鼠标按钮被按下
mouseenter              当鼠标指针移动到元素上时触发
mouseleave              当鼠标指针移出元素时触发
mousemove                鼠标被移动
mouseover                 鼠标移到某元素之上
mouseout                  鼠标从某元素移开
mouseup                   鼠标按键被松开

键盘事件
keydown                     某个键盘按键被按下
keypress                     某个键盘按键被按下并松开
keyup                          某个键盘按键被松开

框架/对象（Frame/Object）事件
abort                                图像的加载被中断
beforeunload                  该事件在即将离开页面（刷新或关闭）时触发
error                                 在加载文档或图像时发生错误
hashchange                    该事件在当前 URL 的锚部分发生修改时触发
load                                  一张页面或一幅图像完成加载
pageshow                        该事件在用户访问页面时触发
pagehide                          该事件在用户离开当前网页跳转到另外一个页面时触发
resize                                窗口或框架被重新调整大小
scroll                                 当文档被滚动时发生的事件
unload                               用户退出页面

表单事件
blur                     元素失去焦点时触发
change               该事件在表单元素的内容改变时触发
focus                  元素获取焦点时触发
focusin               元素即将获取焦点是触发
focusout             元素即将失去焦点是触发
input                   元素获取用户输入是触发
reset                   表单重置时触发
search                 用户向搜索域输入文本时触发

剪贴板事件
copy                    该事件在用户拷贝元素内容时触发
cut                       该事件在用户剪切元素内容时触发
paste                   该事件在用户粘贴元素内容时触发

打印事件
afterprint                 该事件在页面已经开始打印，或者打印窗口已经关闭时触发
beforeprint              该事件在页面即将开始打印时触发

多媒体（Media）事件
abort                            事件在视频/音频（audio/video）终止加载时触发
canplay                        事件在用户可以开始播放视频/音频（audio/video）时触发
canplaythrough          事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发
durationchange          事件在视频/音频（audio/video）的时长发生变化时触发
emptied                       当前播放列表为空时候触发
ended                          事件在视频/音频（audio/video）播放结束时触发
error                            事件在视频/音频（audio/video）数据加载期间发生错误时触发
loadeddata                  事件在浏览器加载视频/音频（audio/video）当前帧时触发触发
loadedmetadata         事件在指定视频/音频（audio/video）的元数据加载后触发
loadstart                     事件在浏览器开始寻找指定视频/音频（audio/video）触发
pause                          事件在视频/音频（audio/video）暂停时触发
play                             事件在视频/音频（audio/video）开始播放时触发
playing                       事件在视频/音频（audio/video）暂停或者在缓冲后准备重新开始播放时触发
progress                    事件在浏览器下载指定的视频/音频（audio/video）时触发
ratechange                事件在视频/音频（audio/video）的播放速度发送改变时触发
seeked                       事件在用户重新定位视频/音频（audio/video）的播放位置后触发
seeking                      事件在用户开始重新定位视频/音频（audio/video）时触发
stalled                        事件在浏览器获取媒体数据，但媒体数据不可用时触发
suspend                     事件在浏览器读取媒体数据中止时触发
timeupdate                事件在当前的播放位置发送改变时触发
volumechange          事件在音量发生改变时触发
waiting                       事件在视频由于要播放下一帧而需要缓冲时触发

动画事件
animationend                 该事件在 CSS 动画结束播放时触发
animationiteration         该事件在 CSS 动画重复播放时触发
animationstart                该事件在 CSS 动画开始播放时触发

过渡事件
 transitionend                 该事件在 CSS 完成过渡后触发

其他事件
message                    该事件通过或者从对象(WebSocket, Web Worker, Event Source 或者子 frame 或父窗口)接收到消息时触发
online                         该事件在浏览器开始在线工作时触发。
offline                         该事件在浏览器开始离线工作时触发。
popstate                     该事件在窗口的浏览历史（history 对象）发生改变时触发。
show                           该事件在窗口显示时触发（onshow方法也仅仅在fireFox浏览器支持）

元素在上下文菜单显示时触发
 storage                  该事件在 Web Storage(HTML 5 Web 存储)更新时触发（仅限于在控制台里修改、新增和删除，代码里修改是监听不到的）
 toggle                    该事件在用户打开或关闭 元素时触发
 wheel                     该事件在鼠标滚轮在元素上下滚动时触发
————————————————

                            版权声明：本文为博主原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。

原文链接：https://blog.csdn.net/HYHhmbb/article/details/127049968 */
//收起 */