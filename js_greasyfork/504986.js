// ==UserScript==
// @name         b站播放列表
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description 1.将b站视频添加到播放列表，实现列表顺序播放、随机播放、单集循环播放（需点击播放列表里面的视频进行播放才会生效），播放列表支持移除视频、拖动排序、多选拖动排序、全选、反选、移除选中。2.本地记忆播放列表信息。3.播放完一个视频后若无法继续播放下一个视频，一般是浏览器设置问题，需要打开浏览器设置里面搜索关键词‘’‘自动播放’，设置为允许媒体自动播放
// @author       繁星1678
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504986/b%E7%AB%99%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504986/b%E7%AB%99%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==
// 正式可用
(function() {
    'use strict';
    let listContainer;
    let videoList = [];//存储videoDict
    let allVideoList = []; //存储videoDict的全部item
    let playMode = 0; // 0:顺序播放 1:随机播放 2:单集循环
    // let myList = []; // 存储用户添加的视频
    let i =1 //点击图标添加的索引
    let j =1//全部添加索引
    let currentPlayVideoTitle
    let playItemIndex = -1;
    let isDarkMode = true;
    let isPanelShow = false;
    let videoPlayList = []
    let randomIndex
    let videoListButton
    let initTitle=null
    let initPlayUrl=null
    let initPlayUrlPath=null
    class videoInfo {
        constructor(playId,firstSpanText, secondSpanText, title, playUrl) {
            this.playId = playId; // 播放ID,在b站视频合集中对应视频的索引，在合集中不变
            this.firstSpanText = firstSpanText; // 视频名称中的序号，如：P1
            this.secondSpanText = secondSpanText; // 标题，如：你好吗
            this.title = title; // 名称如：P4 你好吗
            this.playUrl = playUrl; // 视频播放链接如：https://www.bilibili.com/video/BV1Ys4y1r7Dj/
        }
    }
    
    // 获取当前页面的 URL
    let currentUrl = window.location.href;

    // 根据不同的 URL 执行不同的代码
    if (currentUrl.includes('/video/')) {
        setPlayList()
        resetPlayPanelItemShow()
        setPlayListBtn()
       
    } else if(currentUrl.includes('/www.bilibili.com/')||currentUrl.includes('/video/')){
        if(currentUrl.includes('/www.bilibili.com/')){
            let openPlayUrl=true
            createPLaylistPanel(openPlayUrl)
            resetPlayPanelItemShow()
            setPlayListBtn()
        }else{
            createPLaylistPanel()
            resetPlayPanelItemShow()
            setPlayListBtn() 
        }
        
    }
    ///////////////////////////////////
    // 提示框
    function dialog(message,x=false,y=false,second=false){

        second?second=second*1000:second=3500
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        tooltip.style.color = '#ff9a00';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '1000';
        tooltip.style.fontSize = '20px';
        tooltip.style.fontWeight = 'bold';
        tooltip.style.textAlign = 'center'; // 居中对齐
        tooltip.style.lineHeight = '1'; // 设置行高为1，使文字垂直居中
        tooltip.style.transform = 'translate(-50%, -50%)'; // 居中显示
        tooltip.style.transition = 'opacity 0.5s ease-in-out'; // 设置过渡效果
        // tooltip.style.opacity = '0'; // 初始状态为透明
        tooltip.style.pointerEvents = 'none'; // 防止点击穿透
         // 设置默认位置
        tooltip.style.top = x ? `${x}px` : '180px';
        tooltip.style.left = y ? `${y}px` : '1150px';
        // tooltip.style.top = `${x}px` 
        // tooltip.style.left = `${y}px`
        // tooltip.style.top = x.toString()+'px'
        // tooltip.style.left = y.toString()+'px'
        document.body.appendChild(tooltip);

        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, second);
    }
    // 创建笔记列表按钮并添加监听事件
    function setPlayListBtn(){

        let playListsBtn = document.querySelector('.playListsBtn');
            // 如果存在就设置监听,不存在就创造一个并设置监听
            if (playListsBtn) {
                return
                // setNoteListsBtnListener(noteListsBtn);
                // alert('noteListsBtn存在:',noteListsBtn)
            }else{
                // alert('noteListsBtn不存在')
                function createNoteListBtnAndInsertDocument(){
                   
                    if(currentUrl.includes('/video/')){
                        if(initTitle===null&&initPlayUrl===null){
                            initTitle = document.querySelector('.video-title.special-text-indent').getAttribute('data-title')
                            // initTitle=initTitle.split(' ')[1]
                            // videoEl.muted = true;//静音
                            initPlayUrl = window.location.href.trim()
                            initPlayUrlPath = window.location.pathname.trim()

                            console.log('125 innitTitle:'+initTitle)
                            console.log('125 initPlayUrl:'+initPlayUrl)
                            console.log('125 initPlayUrlPath:'+initPlayUrlPath)
                        }
                        
                    }
                    
                    let avatar_wrap = document.querySelector('.header-avatar-wrap');
                    if (avatar_wrap) {
                        // 创建 playListsBtn 元素
                        let playListsBtn = document.createElement('div');
                        playListsBtn.style.display = 'flex'; // 使用 flex 布局
                        playListsBtn.style.flexDirection = 'column'; // 设置垂直布局
                        playListsBtn.style.alignItems = 'center'; // 水平居中对齐
                        playListsBtn.style.gap = '4px'; // 设置图标和文本之间的间距
                        playListsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));"><path fill="#7a08fa" d="M7 9V7h14v2zm0 4v-2h14v2zm0 4v-2h14v2zM4 9q-.425 0-.712-.288T3 8t.288-.712T4 7t.713.288T5 8t-.288.713T4 9m0 4q-.425 0-.712-.288T3 12t.288-.712T4 11t.713.288T5 12t-.288.713T4 13m0 4q-.425 0-.712-.288T3 16t.288-.712T4 15t.713.288T5 16t-.288.713T4 17"/></svg><span style="color: #7a08fa; font-size: 13px; text-shadow: 0.1px 0.1px 0.3px rgba(0, 0, 0, 0.6);">播放列表</span>`;
                        playListsBtn.style.cursor = 'pointer';
                        playListsBtn.className = 'playListsBtn';

                        // let avatar_wrap = document.querySelector('.header-avatar-wrap');
                        // 获取 avatar_wrap 的父节点
                        let parentNode = avatar_wrap.parentNode;

                        // 获取 avatar_wrap 的父节点的第一个子节点
                        let firstChild = parentNode.firstChild;

                        // 使用 insertBefore 方法将 playListsBtn 插入到第一个子节点的下一个兄弟节点之前
                        parentNode.insertBefore(playListsBtn, firstChild.nextSibling)||parentNode.insertBefore(playListsBtn, firstChild);

                        observer.disconnect();
                        // setNoteListsBtnListener(noteListsBtn)
                        playListsBtn.addEventListener('click', function (e) {
                            
                            let playlistPanel = document.querySelector('.container.mt-5.draggable');
                            if (playlistPanel&&playlistPanel.style.display === 'none') {
                                // let isPanelShow = localStorage.getItem('isPanelShow');
                                localStorage.setItem('isPanelShow', 'true');
                                playlistPanel.style.display = 'block';
                                resetPlayPanelItemShow()
                                playItemIndex = localStorage.getItem('playItemIndex')
                                setCurrentItemBackgroundAndPlayingGifVisible()
                                videoListButton = document.querySelector('.video-list-btn')
                                // listContainer.style.display = isPanelShow
                                if (videoListButton) {
                                    videoListButton.textContent = '关闭列表'
                                }

                            }
                            
                           

                        })
                        

                    }

                }
                let observer = new MutationObserver(createNoteListBtnAndInsertDocument)
                let config = {childList: true, subtree: true}
                observer.observe(document.body, config)

            }
        }


   
    
    // let videoItem = document.querySelector('div.clickitem')||document.querySelector('divvideo-episode-card__info-title');

    function setPlayList(){
        playItemIndex = localStorage.getItem('playItemIndex')
        videoList = JSON.parse(localStorage.getItem('videoList')) || [];
        createPLaylistPanel()
        resetPlayPanelItemShow()
        setCurrentItemBackgroundAndPlayingGifVisible()
        scrollPlayItemIntoView()
        let targetNode = document.body;
        let hasExecuted = false;
        
        setTimeout(() => {
            let videoEl = document.querySelector("div.bpx-player-video-wrap > video");
            console.log('播放索引:'+playItemIndex)
            setCurrentItemBackgroundAndPlayingGifVisible()
                if(videoEl){
                    videoEl.addEventListener('ended', (event) => {
                        // console.log('视频播放结束,播放索引:'+playItemIndex);
                        event.stopImmediatePropagation();
                        playNext()
                        // setCurrentItemBackgroundAndPlayingGifVisible()
    
                    });
                }else{
                    console.log('1755 点击添加图标 未找到播放器videoEl')
                }
        }, 5000);

        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    let videoItem = document.querySelector('div.clickitem') ||
                        document.querySelector('div.video-episode-card__info-title.video-episode-card__info-title_indent')||
                        document.querySelector('.video-episode-card__info-title');
                    let listHead = document.querySelector("#multi_page > div.head-con") ||
                        document.querySelector(".video-sections-head_first-line");
                    // videoEl = document.querySelector("div.bpx-player-video-wrap > video");

                    if (listHead && videoItem && !hasExecuted) {
                        hasExecuted = true;
                        createVideoListButton()
                        // createPLaylistPanel()
                        createAddBtnForVideoItem()
                        observer.disconnect();
                        break;
                        
                    }

                }
            }
        });

        let config = { childList: true, subtree: true };

        
        setTimeout(() => {
            observer.observe(targetNode, config);
        }, 2500);

            }




    // 播放下一曲
  // 播放下一曲
    function playNext() {
        let lis1
        videoList = JSON.parse(localStorage.getItem('videoList'))
        playItemIndex = localStorage.getItem('playItemIndex')
        
        if(playItemIndex<=-1){return}
        let videoPlayListLength = videoList.length
        if(videoPlayListLength<=0){
            console.log('播放列表为空,无法播放下一曲')
            return
        }
        switch (playMode) {
            case 0: // 顺序播放
                restorePreviousPlayItemBackgroundPlayingGifVisible()
                // playItemIndex = (playItemIndex + 1) % videoPlayListLength;
                if(videoPlayListLength===1){
                    // const ul = document.querySelector('ul.list-box');
                    // let lis = ul.querySelectorAll('li');
                    // lis = Array.from(lis);
                    let ul = null;
                    let lis = [];
                    try {
                        ul = document.querySelector('ul.list-box');
                        if (ul) {
                            lis = ul.querySelectorAll('li');
                        }
                        lis = Array.from(lis);
                    } catch (error) {
                        console.error('捕获到异常:', error);
                    }

                    ///////////////////
                    let ul1 = null;
                    let lis1 = [];
                    try {
                        ul1 = document.querySelector('.video-section-list.section-0');
                        if (ul1) {
                            lis1 = ul1.querySelectorAll('.video-episode-card');
                        }
                        lis1 = Array.from(lis1);
                    } catch (error) {
                        console.error('捕获到异常:', error);
                    }
                    ///////////////////

                    if(lis.length>0){
                        if(lis[lis.length-1].secondSpanText != videoList[playItemIndex].title){
                            lis[lis.length-1].click();
                            clickLiEl(playItemIndex);
                        }else{
                            lis[lis.length-2].click();
                            clickLiEl(playItemIndex);
                        }
                    }else if(lis1.length>0){
                        let liTitle = lis1[lis1.length-1].querySelector('div.video-episode-card__info-title').getAttribute('title');
                        if(liTitle != videoList[playItemIndex].title){
                            lis1[lis1.length-1].click();
                            clickLiEl(playItemIndex);
                        }else{
                            lis1[lis1.length-2].click();
                            clickLiEl(playItemIndex);
                        }
                    }
                }else{
                    let preTitle = videoList[playItemIndex].title
                    
                    playItemIndex++
                    if(playItemIndex > videoPlayListLength-1) {
                        playItemIndex = 0;
                        clickLiEl(playItemIndex);
                        break;
                    }else if(preTitle===videoList[playItemIndex].title){
                        if(preTitle!==videoList[0].title){
                            clickLiEl(0)
                            clickLiEl(playItemIndex); 
                        }else{
                            clickLiEl(1);
                            clickLiEl(playItemIndex);
                        }
                        break;
                    }
                    clickLiEl(playItemIndex);
                    break;
                    
                }

               
                console.log('326顺序播放,播放索引是:'+playItemIndex);
                
            case 1: // 随机播放
                restorePreviousPlayItemBackgroundPlayingGifVisible()
                randomIndex = Math.floor(Math.random() * videoPlayListLength);
                if(randomIndex>videoListButton){
                    randomIndex = 0
                }
                if(randomIndex === playItemIndex){
                    if(randomIndex < videoPlayListLength-1) {
                        clickLiEl(randomIndex + 1);
                        clickLiEl(randomIndex);
                    }else{
                        clickLiEl(0);
                        clickLiEl(randomIndex);
                    }
                }else{
                    clickLiEl(randomIndex);
                    playItemIndex = randomIndex;

                }
                
                console.log('330随机播放,播放索引是:'+playItemIndex);
                // clickLiEl(playItemIndex);
                break;
            case 2: // 单集循环
                console.log('333单集循环播放索引是:'+playItemIndex);
                clickLiEl(playItemIndex);
                // 单集循环模式下，playItemIndex 不需要更新
                break;
            
        }
        localStorage.setItem('playItemIndex', playItemIndex);
        console.log('393 playnext播放索引是:'+playItemIndex);
        // clickLiEl(playItemIndex);
        let videoEl = document.querySelector("div.bpx-player-video-wrap > video");
        
        videoEl.currentTime = 0;
        // localStorage.setItem('playId', videoList[playItemIndex].playId?videoList[playItemIndex].playId:0);
        videoEl.play();
        scrollPlayItemIntoView();
        setCurrentItemBackgroundAndPlayingGifVisible()
    }

    function clickLiEl(playItemIndex){
        if(playItemIndex<=-1){return}
        localStorage.setItem('playItemIndex', playItemIndex);
        // setCurrentItemBackgroundAndPlayingGifVisible()
        videoList = JSON.parse(localStorage.getItem('videoList'));
        let videoEl = document.querySelector("div.bpx-player-video-wrap > video");
        videoEl.currentTime = 0;
        if(playItemIndex >= videoList.length){
            playItemIndex=0
        }
        
        let ul = null;
        let lis = [];

        // 获取分p列表
        try {
            ul = document.querySelector('ul.list-box');
            if (ul) {
                lis = ul.querySelectorAll('li');
            }
            lis = Array.from(lis);
        } catch (error) {
            console.error('捕获到异常:', error);
        }


        let ul1 = null;
        let lis1 = [];

    //    获取非分p列表
        try {
            ul1 = document.querySelector('.video-section-list.section-0');
            if (ul1) {
                lis1 = ul1.querySelectorAll('.video-episode-card');
            }
            lis1 = Array.from(lis1);
        } catch (error) {
            console.error('捕获到异常:', error);
        }

        // 如果分p列表不存在，跳转到对应视频播放
        if(lis.length<=0 && lis1.length<=0||!videoEl){
            window.location.href = videoList[playItemIndex].playUrl;
            videoEl.currentTime = 0;
            // videoList[playItemIndex].playId? localStorage.setItem('playId', videoList[playItemIndex].playId) : null;
            videoEl.play()
            return
        }
        // 如果分p列表存在，则点击分p列表的对应项
        if(lis.length>0){
            for(let i=0;i<lis.length;i++){
                let liTitle = lis[i].querySelector('span.part').textContent;
                if(videoList[playItemIndex].secondSpanText === liTitle){
                    lis[i].querySelector('div.clickitem').click()
                    videoEl.play()
                    console.log('点击列表项lis[i].textContent:' + lis[i].textContent);
                    return
                }
            }
        }else if(lis1.length>0){
            for(let i=0;i<lis1.length;i++){

                // const videoTitle = item.getAttribute('title');
                // querySelectorAll('div.video-episode-card__info-title').forEach(item =>

                let liTitle = lis1[i].querySelector('.video-episode-card__info-title').getAttribute('title');
                // console.log('clickLiEl liTitle:'+liTitle)
                if(videoList[playItemIndex].title === liTitle){
                    lis1[i].click()
                    videoEl.play()
                    console.log('点击列表项lis[i].textContent:' + liTitle);
                    // localStorage.setItem('playText', liTitle);
                    return
                }
            }

            
        }
        
        // videoPlayList[playItemIndex].videoElement.click()
        // localStorage.setItem('playId', videoList[playItemIndex].playId);
        // window.location.replace(videoList[playItemIndex].playUrl);
        window.location.href = videoList[playItemIndex].playUrl;
        
        videoEl.play()

        // videoEl = document.querySelector("div.bpx-player-video-wrap > video")
        // videoEl.play()
    }


    // 显示列表面板
    function showPLaylistPanel() {
        let pLaylistPanel = document.querySelector('.container.mt-5.draggable');
        isPanelShow=localStorage.getItem('isPanelShow')
        isPanelShow?pLaylistPanel.style.display='block':pLaylistPanel.style.display='none'
        console.log('showPLaylistPanel获取到的 isPanelShow:'+isPanelShow)

        let videoListButton = document.querySelector('.video-list-btn');

        if(pLaylistPanel.style.display==='block'){
            isListVisible = true;
            videoListButton.textContent = '关闭列表';
        }
    }
   
    // 更新播放列表项item显示

    function resetPlayPanelItemShow(){
        videoList = JSON.parse(localStorage.getItem('videoList')) || [];        
        if(videoList.length>0){
            // if(isAddItem){
            //     return
            // }
             // // 获取ul元素
             
             let ulElement = document.getElementById('myList');

             // 移除ul中的所有li元素
             while (ulElement.firstChild) {
                 ulElement.removeChild(ulElement.firstChild);
             }

            for (let i = 0; i < videoList.length; i++) {
                addItemToPLaylistPanel(videoList[i].title);
                console.log(i+': '+videoList[i].videoElementHtml);
            }
            // isAddItem = true;
        }
    }



    function getCrruentPlayVideoTitle(){
        if(playItemIndex>-1){
            currentPlayVideoTitle = videoList[playItemIndex].title;
            if(currentPlayVideoTitle){
                return currentPlayVideoTitle
            }else{return null}

        }else{
            return null
        }
    }

    // 创建播放列表按钮,点击弹出播放列表面板,再点击关闭播放列表面板
    function createVideoListButton() {
        let btnText
        let isPanelShow=localStorage.getItem('isPanelShow')
        if(isPanelShow==='none'){
            btnText = '播放列表';
        }else{
            btnText = '关闭列表';
        }
        

        // 创建播放列表按钮
        // const videoListButton = document.createElement('button');
        videoListButton = document.createElement('button');
        videoListButton.textContent = btnText;
        videoListButton.className = 'video-list-btn';

        // 添加按钮样式
        const style = document.createElement('style');
        style.textContent = `
            .video-list-btn {
                background-color: #3e4149;
                color: #defcf9;
                border: none;
                border-radius: 4px;
                text-align: center;
                font-size: 15px;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
                transition: background-color 0.3s;
            }

            .video-list-btn:hover {
                background-color: #521262;
            }

            .video-list-btn:active {
                background-color: #6639a6;
            }

            .draggable {
                cursor: move;
            }
        `;
        document.head.appendChild(style);
        getListHead()

        // 播放列表按钮点击事件
        videoListButton.addEventListener('click', () => {
            let isPanelShow = localStorage.getItem('isPanelShow');
            if(isPanelShow==='none'){
                isPanelShow = 'block';
                resetPlayPanelItemShow()
                setCurrentItemBackgroundAndPlayingGifVisible()
            }else{
                isPanelShow = 'none';
            }
            listContainer.style.display = isPanelShow
            videoListButton.textContent = isPanelShow==='block' ? '关闭列表' : '播放列表';
            localStorage.setItem('isPanelShow',isPanelShow)
           
        });

        function getListHead() {
            let listHead = document.querySelector("#multi_page > div.head-con") ||
            document.querySelector(".first-line-left")
            if (listHead) {
                listHead.style.position = 'relative';
                listHead.insertBefore(videoListButton, listHead.firstChild);

            }
            // let avatar_wrap = document.querySelector('.header-avatar-wrap');

            // let parentNode = avatar_wrap.parentNode;

            // // 获取 avatar_wrap 的父节点的第一个子节点
            // let firstChild = parentNode.firstChild;

            // // 使用 insertBefore 方法将 playListsBtn 插入到第一个子节点的下一个兄弟节点之前
            // parentNode.insertBefore(playListsBtn, firstChild.nextSibling)||parentNode.insertBefore(playListsBtn, firstChild);
        }

    }


    // 停止播放
    function stopVideo(){
        let videoEl = document.querySelector("div.bpx-player-video-wrap > video") // 获取视频元素
        videoEl.pause();
        videoEl.currentTime = 0;
    }

    // 如果列表项有选中状态的项就返回true,否则返回false
    function hasCheckedCheckbox() {
        const checkboxes = document.querySelectorAll('li.list-item input[type="checkbox"]');
        for (let checkbox of checkboxes) {
            if (checkbox.checked) {
                return true;
            }
        }
        return false;
    }


    // 将上一个播放项的背景色还原为透明浅蓝色，并将playing-gif隐藏
    function restorePreviousPlayItemBackgroundPlayingGifVisible(){
        if(playItemIndex<=-1){
            return
        }
        let myList = document.getElementById('myList');
        let listItems = myList.getElementsByTagName('li');
        if(listItems.length===0){return}
        let previousPlayItem = listItems[playItemIndex]
        if(isDarkMode){
            previousPlayItem?previousPlayItem.style.color='#ba52ed':console.log("没有找到播放项");
        }else{
            previousPlayItem?previousPlayItem.style.color='#311d3f':console.log("没有找到播放项");
        }

        previousPlayItem?previousPlayItem.querySelector('.playing-gif').style.display = 'none':console.log("没有上一个播放项");

    }

     // 设置当前播放项动图playing-gif为显示状态 设置item背景色
     function setCurrentItemBackgroundAndPlayingGifVisible() {
        // playItemIndex = localStorage.getItem('playItemIndex')
        if(playItemIndex<=-1){
            return
        }
        let myList = document.getElementById('myList');
        let listItems = myList.getElementsByTagName('li');
        let CurrentPlayItem = listItems[playItemIndex]


        CurrentPlayItem?CurrentPlayItem.style.color='#ff9a00':console.log("没有找到播放项");
        CurrentPlayItem?CurrentPlayItem.querySelector('.playing-gif').style.display = 'inline':console.log("没有找到播放项");

    }

    // 将播放项滚动到视图中
    function scrollPlayItemIntoView() {
        if(playItemIndex<=-1){
            return
        }
        let myList = document.getElementById('myList');
        let listItems = myList.getElementsByTagName('li');
        if(listItems.length>0){
            let CurrentPlayItem = listItems[playItemIndex]
            if(CurrentPlayItem){
                CurrentPlayItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }else{console.log("CurrentPlayItem")}
        }

    }

// 创建播放列表,添加列表项,相关按钮,播放列表项点击事件,播放列表项拖拽排序事件


    // 获取选中的列表项,将其文本组成一个数组,将其文本组成一个数组

    function getCheckedItemsTextAndIndex() {
        // 获取所有被勾选的 checkbox
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

        // 获取所有 li 元素
        const listItems = document.getElementById('myList').getElementsByTagName('li');

        // 创建两个数组来存储文本和索引
        let texts = [];
        let indices = [];

        // 遍历被勾选的 checkbox，获取对应的 li 元素的文本和索引
        checkboxes.forEach(checkbox => {
            const parentLi = checkbox.closest('li');
            if (parentLi) {
                const index = Array.from(listItems).indexOf(parentLi);
                texts.push(parentLi.textContent.trim());
                indices.push(index);
            }
        });

        // 根据索引从小到大排序
        indices.sort((a, b) => a - b);
        texts.sort((a, b) => indices[texts.indexOf(a)] - indices[texts.indexOf(b)]);

        // console.log('文本数组:', texts);
        // console.log('索引数组:', indices);
        return {texts, indices};


    }



    // 切换主题
    function toggleTheme() {
        const elements = document.querySelectorAll('.list-item');


        // 遍历所有找到的元素
        if (isDarkMode) {
            // 替换类名 "dark-mode-list-group-item" 为 "list-group-item"
            elements.forEach((element, index) => {
                element.classList.replace('dark-mode-list-group-item', 'list-group-item');
                // if (playItemIndex > -1 && playItemIndex === index) {
                //     element.style.color = '#a3de83';
                // }
            });
            event.target.textContent = "透明";

        } else {
            // 替换类名 "list-group-item" 为 "dark-mode-list-group-item"
            elements.forEach((element, index) => {
                element.classList.replace('list-group-item', 'dark-mode-list-group-item');
                // if (playItemIndex > -1 && playItemIndex === index) {
                //     element.style.color = '#005691';
                // }
            });
            event.target.textContent = "暗黑";
        }

    }

      // 点击+向播放列表面板添加列表项,同时提取所有li的视频名称 索引号 li元素存放在数组中
      function addItemToPLaylistPanel(itemText) {

        // <img src="//i0.hdslb.com/bfs/static/jinkela/video/asserts/playing.gif" style=""></img>

         // 创建播放动图<img> 元素并设置其属性
        const imgElement = document.createElement('img');
        imgElement.src = "//i0.hdslb.com/bfs/static/jinkela/video/asserts/playing.gif";
        imgElement.className = 'playing-gif';
        imgElement.style.cssText = "color:#ff7c38;display: none; height: 17px; width: 17px; margin-right: 7px; vertical-align: middle;";

        const newItem = document.createElement('li');
        newItem.classList.add('list-item','dark-mode-list-group-item');
        // newItem.className = 'dark-mode-list-group-item';
        newItem.draggable = true;
        // newItem.textContent = `${itemText}`;
        // newItem.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
        newItem.title = '点击播放,拖动排序,多选拖动排序';
        // newItem.style.color = '#ba52ed'

         // 创建一个文本节点
        const textNode = document.createTextNode(itemText);
        // const numNode = document.createTextNode(itemText);
    //    document.querySelector('.video-num')
        // numNode.className = 'video-num';
        // numNode.textContent=`${itemNum}`
        // textNode.className = 'video-name';
        textNode.textContent = `${itemText}`
        // 将 img 元素和文本节点添加到 newItem 中
        // newItem.appendChild(numNode);
        newItem.appendChild(imgElement);
        
        newItem.appendChild(textNode);

        // 创建一个包含 SVG 图标和多选框的容器
        const iconContainer = document.createElement('span');
        iconContainer.style.float = 'right'; // 将容器浮动到右边
        // iconContainer.style.display = 'inline-block';
        iconContainer.style.alignItems = 'center'; // 垂直居中对齐

        // 创建 SVG 图标,移除播放列表条目
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('width', '24');
        svgIcon.setAttribute('height', '24');
        svgIcon.setAttribute('viewBox', '0 0 12 12');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', '#ba52ed');
        path.setAttribute('d', 'M5 3h2a1 1 0 0 0-2 0M4 3a2 2 0 1 1 4 0h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A2 2 0 0 1 7.623 11H4.377a2 2 0 0 1-1.993-1.83L1.941 4H1.5a.5.5 0 0 1 0-1zm3.5 3a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0zM5 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M3.38 9.085a1 1 0 0 0 .997.915h3.246a1 1 0 0 0 .996-.915L9.055 4h-6.11z');
        svgIcon.appendChild(path);

        // 设置 SVG 图标的点击事件监听器
        svgIcon.addEventListener('click', () => {
            // 获取 SVG 图标的父元素（即包含它的 <li> 元素）
            const parentLi = svgIcon.closest('li');
            if (parentLi) {
                // 获取被移除的 <li> 元素的索引
                const listItems = document.getElementById('myList').getElementsByTagName('li');
                // 被删列表项索引
                const index = Array.from(listItems).indexOf(parentLi);

                // console.log(`被移除的 <li> 元素的索引: ${index}`);

                // 从 DOM 中移除 <li> 元素
                parentLi.remove();

                videoList.splice(index, 1);


                // videoPlayList.splice(index, 1)
                // liElList.splice(index,1)
                // 当删除播放列表面板列表项时需要更新playItemIndex,才能正确播放对应列表项
                // saveVideoList()


                if (index < playItemIndex) {
                    playItemIndex--;
                } else if (index === playItemIndex) {
                    // 如果当前播放的列表项被删除，则停止播放
                    playItemIndex = -1;
                    stopVideo();
                }
                localStorage.setItem('playItemIndex', playItemIndex);
                let count=0
                if(videoList.length>0){
                    count=videoList.length
                }
                count=count>0?'总计:'+count:'点击视频左边+号添加'
                let tip = document.querySelector('.text-tip')
                if(tip){
                    tip.textContent=count
                }

            }
            
            // saveVideoListToLocalStorage(videoList)
            localStorage.setItem('videoList', JSON.stringify(videoList));
            // updateVideoPlayList()
            // localStorage.setItem('playItemIndex', playItemIndex);
            // saveVideoList(); // 保存数据到本地
            // saveVideoListToLocalStorage(videoList)
            // saveLiElListToLocalStorage()
            let selectAllItemBtn = document.querySelector("#selectAllItem");
            hasCheckedCheckbox()?selectAllItemBtn.textContent="反选":selectAllItemBtn.textContent="全选"

        });

        // 创建多选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.height = "20px";
        checkbox.style.width = "18px";
        checkbox.style.color = '#f5c7f7';
        checkbox.style.marginLeft = '8px'; // 添加一些间距

        // 将 SVG 图标和多选框添加到容器中
        iconContainer.appendChild(svgIcon);
        iconContainer.appendChild(checkbox);


        // 添加 change 事件监听器
        checkbox.addEventListener('change', (event) => {

            let selectAllItemBtn = document.querySelector("#selectAllItem");
            hasCheckedCheckbox()?selectAllItemBtn.textContent="反选":selectAllItemBtn.textContent="全选"

            // console.log('复选框状态发生变化:', event.target.checked);
        });

        // 添加 click 事件监听器
        checkbox.addEventListener('click', (event) => {

            let selectAllItemBtn = document.querySelector("#selectAllItem");
            hasCheckedCheckbox()?selectAllItemBtn.textContent="反选":selectAllItemBtn.textContent="全选"
            // console.log('复选框被点击:', event.target.checked);
        });

        // 将容器添加到 <li> 元素中
        newItem.appendChild(iconContainer);

        // let myList = document.getElementById('myList').appendChild(newItem);
        let myList = document.getElementById('myList')
        if(myList){
            myList.appendChild(newItem);
        }else{console.log("770没有找到播放列表")}

        let count=0
        if(videoList.length>0){
            count=videoList.length
        }
        count=count>0?'总计:'+count:'点击视频左边+号添加'
        let tip = document.querySelector('.text-tip')
        if(tip){
            tip.textContent=count
        }

    }
    // 创建播放列表面板
    function createPLaylistPanel(openPlayUrl=false) {
        let count=0
        videoList = JSON.parse(localStorage.getItem('videoList'));
        if(videoList.length>0){
            count=videoList.length
        }
        count=count>0?'总计:'+count:'点击视频左边+号添加'
        let isPanelShow = localStorage.getItem('isPanelShow') || 'block';
        
        let playModeBtnText;
        try {
            playModeBtnText = localStorage.getItem('playModeBtnText') || '顺序播放';
            if (playModeBtnText === '顺序播放') {
                playMode = 0;
            } else if (playModeBtnText === '随机播放') {
                playMode = 1;
            } else if (playModeBtnText === '单集循环') {
                playMode = 2;
            } else {
                playMode = 0;
            }
        } catch (error) {
            console.error('Error while setting play mode:', error);
            playMode = 0; // 默认设置为顺序播放
        }
        
        // 创建一个带有样式的列表容器
        listContainer = document.createElement('div');
        // listContainer.style.width = '500px';
        // listContainer.style.minWidth = '470px';
        listContainer.style.width = 'fit-content';

        listContainer.style.height = '600px';
        listContainer.style.left = '700px';
        listContainer.style.top = '200px';
        listContainer.style.zIndex = '999999';
        listContainer.style.overflowY = 'scroll';
        // listContainer.style.overflowX = 'hidden';
        listContainer.style.alignItems = 'center';
        listContainer.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        listContainer.style.borderRadius = '6px';
        listContainer.style.display = isPanelShow; // 隐藏或显示
        listContainer.style.position = 'fixed'; // 自适应固定在可见位置
        // listContainer.style.flexDirection = 'column';
        listContainer.style.boxShadow = '0 8px 5px rgba(0, 0, 0, 0.5)'; // 添加边框阴影
        listContainer.className = 'container mt-5 draggable'; // 添加容器类和可拖动类
        listContainer.innerHTML = `
        <div style="position: sticky; top: 0; background-color: rgba(0, 0, 0, 0);margin-bottom: 10px;justify-content: space-between;align-items: center;">
            <button type="button" class="btn btn-primary" id="closePlaylist">关闭列表</button>
            <button type="button" class="btn btn-primary" id="playMode">${playModeBtnText}</button>
            <button type="button" class="btn btn-primary" id="removeItem">移除选中</button>
            <button type="button" class="btn btn-primary" id="selectAllItem">全选</button>
            <button type="button" class="btn btn-primary" id="addAllItem">全部添加</button>
            <button type="button" class="btn btn-primary" id="toggleStyleBtn">暗黑</button>
            <svg class="btn btn-svg" id="addVideoBtn" xmlns="http://www.w3.org/2000/svg" width="45" height="24" viewBox="0 0 24 24" style="margin-right: 10px;" title="添加到播放列表"><path fill="#000000" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
            <span class="text-tip">${count}</span>
        </div>
        <ul class="list-group myList" id="myList">
        </ul>
        `;

         // 添加 CSS 样式
         const style = document.createElement('style');
         style.textContent = `
             .list-group myList{
                 margin-top: 10px;
             }
              .text-tip {
                 margin-right: 8px;
                 font-size: 18px;
                 color: #7e6bc4;
                 font-weight: bold;
                 vertical-align: middle;
             }
             .btn.btn-primary{
                 cursor: pointer; /* 设置鼠标指针为小手 */
                 border-radius: 5px;
                 margin-right: 6px;
                 height: 30px;
                 text-align: center;
                 font-size: 14px;
                 color: #c5e3f6; /* 设置字体颜色 */
                 background-color: #48466d; /* 设置背景颜色 */
             }
             .btn-svg {
                cursor: pointer;
                background-color: #11999e;
                border: 1px solid #007bff;
                border-radius: 0.25rem;
                vertical-align: middle;
                
            }
            .btn-svg:hover {
                background-color: #3f72af;
                border-color: #004085;
            }
                  /* 基本样式 */
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                .list-group-item {
                    cursor: pointer; /* 设置鼠标指针为小手 */
                    margin-bottom: 6px; /* 设置li的行距 */
                    background-color: rgba(186, 82, 237, 0.26);
                    font-size: 16px; /* 设置字体大小 */
                    border-radius: 6px; /* 圆角边框 */
                    border: 1.4px solid #a82ffc;
                    color:#311d3f;
                    padding: 5px;
                    margin: 5px;
                    transition: box-shadow 0.3s ease;
                }
                .dark-mode-list-group-item {
                    background-color: rgba(0, 0, 0, 0.75);
                    cursor: pointer; /* 设置鼠标指针为小手 */
                    margin-bottom: 6px; /* 设置li的行距 */
                    font-size: 16px; /* 设置字体大小 */
                    border-radius: 6px; /* 圆角边框 */
                    border: 1.4px solid #a82ffc;
                    color: #ba52ed; /* 设置字体颜色 */
                    padding: 5px;
                    margin: 5px;
                    transition: box-shadow 0.3s ease;
                }
                /* 鼠标悬停时的阴影效果 */
                .list-item:hover {
                    box-shadow: 5px 5px 10px rgba(255, 201, 60, 0.68);
                }
         `;
         document.head.appendChild(style);



        let currentSelectedItem = null; // 用于跟踪当前被选中的 <li> 元素
        let isSelctedAll = false; // 用于跟踪是否全选


        // 为item创建拖动排序
        //////////////////////////////////
        // 在 listContainer 上添加拖动事件监听器
        let isDraggingListContainer = false;
        let offsetX = 0;
        let offsetY = 0;

        // 在 listContainer 上添加拖动事件监听器
        listContainer.addEventListener('dragstart', dragStart);
        listContainer.addEventListener('dragover', dragOver);
        listContainer.addEventListener('drop', drop);
        listContainer.addEventListener('dragenter', dragEnter);
        listContainer.addEventListener('dragleave', dragLeave);
        listContainer.addEventListener('dragend', dragEnd);

        let dragSrcEl;
        let LiTextsList
        let LiIndexList
        let checkedItemNum

        let dropIndex
        let dropText
        let ul
        let moveItemList
        let moveItem

        function dragStart(e) {
            if (e.target.tagName === 'LI') {
                dragSrcEl = []; // 将 dragSrcEl 改为数组
                LiTextsList = [];
                LiIndexList = [];

                checkedItemNum = 0;
                const result = getCheckedItemsTextAndIndex();
                LiTextsList = result.texts;
                LiIndexList = result.indices;
                checkedItemNum = LiTextsList.length;
                // console.log('被拖动的项目数量' + checkedItemNum);
                // console.log('被拖动的项目索引' + LiIndexList);

                if (checkedItemNum) {
                    let combinedHtml = '';
                    for (let i = 0; i < checkedItemNum; i++) {
                        let videoListIndex = LiIndexList[i];
                        let selectedLi = document.querySelector(`#myList li:nth-child(${videoListIndex})`);
                        // selectedLi.style.backgroundColor = '#87ceeb'; // 修改背景色
                        dragSrcEl.push(selectedLi); // 将选中的 li 元素添加到 dragSrcEl 数组中
                        combinedHtml += selectedLi.outerHTML; // 将每个选中的 li 元素的 HTML 内容添加到 combinedHtml 中
                    }
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', combinedHtml); // 将合并后的 HTML 内容设置为数据传输对象的数据
                    dragSrcEl.forEach(element => {
                        element.style.opacity = '1';
                    });
                }else{
                    dragSrcEl = e.target;
                    dragSrcEl.style.opacity = '1';



                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', e.target.innerHTML);
                }





            }

        }

        function dragEnter(e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.add('over');
            }
        }

        function dragLeave(e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
            }
        }

        function dragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            return false;
        }


        function drop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // if (dragSrcEl !== e.target && e.target.tagName === 'LI') {
                // 获取 ul 元素

                ul = e.target.parentNode;
                // 获取所有的 li 元素
                const listItems = ul.getElementsByTagName('li');
                // 找到拖动元素和目标元素的索引
                const dragIndex = Array.from(listItems).indexOf(dragSrcEl);
                // console.log("拖动元素的索引: " + dragIndex);

                    // ul = e.target.parentNode;
                    // 获取所有的 li 元素
                    // const listItems = ul.getElementsByTagName('li');
                dropIndex = Array.from(listItems).indexOf(e.target);
                    // console.log("目标元素的索引: " + dropIndex);
                // console.log("目标元素的索引: " + dropIndex);
                dropText = videoList[dropIndex].title;// 获取目标元素的文本
                // console.log('目标元素文本: ' + dropText);

                ul.innerHTML = '';
                // // 交换 videoList 中的元素位置



                     moveItemList = []
                    let moveItem = null;
                    // let moveLiList = []
                    // let moveLi = null;
                // // ///////////////////
                if(checkedItemNum>0){
                    currentPlayVideoTitle = getCrruentPlayVideoTitle()
                    for(let i=0;i<checkedItemNum;i++){
                        let videoListIndex = LiIndexList[i]
                        // console.log('被拖动的项目索引'+videoListIndex)
                        // let moveItem = videoList.splice(videoListIndex,1)[0]
                        moveItem = videoList[videoListIndex];

                        // moveLi = liElList[videoListIndex];
                        // videoList.splice(videoListIndex, 1);
                        // console.log('被拖动的项目'+moveItem)
                        // console.log('被拖动的项目标题'+moveItem.title)
                        moveItemList.push(moveItem)

                        // moveLiList.push(moveLi)
                    }
                    LiIndexList.sort((a, b) => b - a);//数组元素从大到小排序
                //     /*目标项目的位置在原来数组中的索引是dropIndex,判断被拖动的项目在原数组最小索引的元素是否在目标元素之前，
                // 如果是，是从上往下拖，会删除拖动的元素，删除后索引号会减1，拖到目标项目之后，则拖动后的位置是新数组中目标元素索引+1处即insertIndex+1，
                // 如果被拖动项目在原数组中的索引大于目标项目在原数组中的索引，即被拖动元素在目标元素之后，是从下往上拖，
                // ，拖动目标项目之前，则拖动后的位置是目标元素在新数组中的索引是insertIndex

                // 原数组目标项目索引：dropIndex
                // 原数组拖动项目最小索引：LiIndexList[LiIndexList.length-1]
                // */
                //     // console.log('被拖动的项目索引列表中最大值: ' + LiIndexList[0])
                //     // console.log('被拖动的项目索引列表中最小值: ' + LiIndexList[LiIndexList.length-1])
                    LiIndexList.forEach((index) => {
                        videoList.splice(index, 1);

                        // liElList.splice(index, 1);
                    })



                //     // 根据目标元素文本求出其在被删减后的videoList中的索引,再根据索引进行插入
                //     // 从上往下拖，是插入到insertIndex+1位置，从下往上拖，是插入到insertIndex位置
                setTimeout(() => {
                    let insertIndex = videoList.findIndex(video => video.title === dropText);
                    // console.log('新数组目标项目索引是:'+insertIndex)
                    if (LiIndexList[LiIndexList.length-1] < dropIndex) {
                        // 从上往下拖动，是插入到insertIndex+1位置
                        insertIndex=insertIndex+1
                        videoList.splice(insertIndex, 0, ...moveItemList);

                        // liElList.splice(insertIndex, 0, ...moveLiList);


                    }else if(LiIndexList[LiIndexList.length-1] > dropIndex){
                        // 从下往上拖动，是插入到insertIndex-1位置
                        videoList.splice(insertIndex, 0, ...moveItemList);

                        // liElList.splice(insertIndex, 0, ...moveLiList);
                    }

                    videoList.forEach((item) => {
                        addItemToPLaylistPanel(item.title);
                    })
                    playItemIndex = videoList.findIndex(item => item.title === currentPlayVideoTitle);
                    if(playItemIndex>-1){
                        setCurrentItemBackgroundAndPlayingGifVisible()
                    }else{console.log('没有播放视频')}
                    // localStorage.setItem('playItemIndex', playItemIndex);
                    saveVideoListToLocalStorage(videoList)
                    // updateVideoPlayList()
                    // playItemIndex?setCurrentItemBackgroundAndPlayingGifVisible():console.log('没有播放视频');
                    // setCurrentItemBackgroundAndPlayingGifVisible()
                    // console.log('拖动结束后的videoList.length: ', videoList.length);

                    // saveVideoList()
                    // saveVideoListToLocalStorage(videoList)
                    // saveLiElListToLocalStorage()
                    // localStorage.setItem('playItemIndex', playItemIndex);
                },5)

        }else{

            currentPlayVideoTitle = getCrruentPlayVideoTitle()
            let dragItem = videoList.splice(dragIndex, 1)[0];//将拖动项从列表中删除
            // let dragLi = liElList.splice(dragIndex, 1)[0];//将拖动项从列表中删除
            if(dragIndex<dropIndex){
                let insertIndex = videoList.findIndex(video => video.title === dropText)+1;

                // let insertIndex = videoList.findIndex(video => video.title === dropText);
                videoList.splice(insertIndex, 0, dragItem);//将拖动项添加到目标位置，对应的是播放面板上面拖到的位置
                // console.log('从上往下拖动目标元素索引dropIndex是dragIndex:'+dropIndex);
                // console.log('从上往下拖动目标元素索引dropIndex是:'+dropIndex);
                //////////////////
                // liElList.splice(dropIndex, 0, dragLi);//将拖动项添加到目标位置，对应的是播放面板上面拖到的位置
                //////////////////
            }else if(dragIndex>dropIndex){
                // let dragItem = videoList.splice(dragIndex, 1)[0];//将拖动项从列表中删除
                console.log('从下往上拖动目标元素的索引dropIndex是:'+dropIndex);
                let insertIndex = videoList.findIndex(video => video.title === dropText);

                videoList.splice(insertIndex, 0, dragItem);//将拖动项添加到目标位置，对应的是播放面板上面拖到的位置
                ////////////
                // liElList.splice(insertIndex, 0, dragLi);//将拖动项添加到目标位置，对应的是播放面板上面拖到的位置
                ////////////
            }

             videoList.forEach((item) => {
                    addItemToPLaylistPanel(item.title);
                })
            if(currentPlayVideoTitle){
                playItemIndex = videoList.findIndex(item => item.title === currentPlayVideoTitle);
                // playItemIndex?setCurrentItemBackgroundAndPlayingGifVisible():console.log('没有播放视频');
                if(playItemIndex>-1){
                    setCurrentItemBackgroundAndPlayingGifVisible()
                }else{console.log('没有播放视频')}
            }
            // saveVideoList()
            // saveVideoListToLocalStorage(videoList)
            // saveLiElListToLocalStorage()
            localStorage.setItem('playItemIndex', playItemIndex);

            saveVideoListToLocalStorage(videoList)
            // updateVideoPlayList()

        }

            return false;
     }

        function dragEnd(e) {
            if (e.target.tagName === 'LI') {
                e.target.classList.remove('over');
            }

        }


        // 拖动 listContainer 的事件处理
        listContainer.addEventListener('mousedown', (event) => {
            if (!event.target.matches('li')) {
                isDraggingListContainer = true;
                offsetX = event.clientX - listContainer.offsetLeft;
                offsetY = event.clientY - listContainer.offsetTop;
            }
        });

        document.addEventListener('mousemove', (event) => {
            if (isDraggingListContainer) {
                listContainer.style.left = `${event.clientX - offsetX}px`;
                listContainer.style.top = `${event.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDraggingListContainer = false;
        });


        // 为列表项添加点击事件监听器，点击歌曲条目播放
        listContainer.addEventListener('click', (event) => {
            
            // 如果点击播放列表项
            if (event.target.matches('.list-item')) {
                // let clickedIndex

                restorePreviousPlayItemBackgroundPlayingGifVisible()
                currentSelectedItem = event.target; // 记录当前被选中的 <li> 元素

                console.log('点击的列表项:', currentSelectedItem);
                // alert('点击的列表项:', currentSelectedItem);
                // const ul = document.querySelector('ul.list-box');
                // let lis = ul.querySelectorAll('li');
                // lis = Array.from(lis);


                // currentSelectedItem.style.backgroundColor = 'skyblue'; // 设置被选中元素的背景颜色

                // // 获取 ul 元素
                let myList = document.getElementById('myList');

                // // 获取所有的 li 元素
                let listItems = myList.getElementsByTagName('li');

                 // 获取被点击的 li 元素的索引
                // let clickedIndex = Array.from(listItems).indexOf(event.target);
                let clickedIndex = Array.from(listItems).indexOf(currentSelectedItem);

                console.log('点击的 li 元素的索引:', clickedIndex);
                // alert('点击的 li 元素的索引:', clickedIndex);

                // 点击列表项时提取 PNumber
                let textContent = currentSelectedItem.textContent;
                // 点击列表项时获取列表项的索引作为播放列表项索引
                // playItemIndex = Number(textContent.split('.')[0]) - 1;
                playItemIndex = clickedIndex;
                // setCurrentItemBackgroundAndPlayingGifVisible()
                
                if(openPlayUrl){
                    
                    window.open(videoList[playItemIndex].playUrl)
                }else{
                    clickLiEl(playItemIndex)

                }
                // clickLiEl(playItemIndex)

                
                localStorage.setItem('playItemIndex', playItemIndex);

                setCurrentItemBackgroundAndPlayingGifVisible()
                // alert(`点击了: ${textContent},播放索引: ${playItemIndex}`);
                // alert(`videoPlayList歌曲数量: ${videoPlayList.length}`)
                // 保存变量到localStorage
                // isPanelShow = true; // 显示播放列表面板
                // localStorage.setItem('isPanelShow', true);



                // console.log('点击列表项playItemIndex:' + playItemIndex);
                // let match = textContent.match(/P(\d+)/);
                // videoPlayList[playItemIndex].videoElement.click();

                // console.log('点击的videoPlayList[playItemIndex].videoElement:' + videoPlayList[playItemIndex].videoElement);
                // liElList[playItemIndex].click()  //哪里弄错了，另外上传者视频无法播放
                // clickLiEl()

                // liElList[playItemIndex].click()
                // for(let i=0;i<lis.length;i++){
                //     let liTitle = lis[i].querySelector('span.part').textContent;
                //     if(videoList[playItemIndex].secondSpanText === liTitle){
                //         lis[i].querySelector('div.clickitem').click()
                //         console.log('点击列表项lis[i].textContent:' + lis[i].textContent);
                //         videoEl = document.querySelector("div.bpx-player-video-wrap > video")
                //         videoEl.play()

                //     }
                // }
                // console.log('点击列表项videoList[playItemIndex].title:' + videoList[playItemIndex].title);
                
                // videoEl.play()
                // setTimeout(() => {
                //     videoEl.play()
                //     setCurrentItemBackgroundAndPlayingGifVisible()
                // }, 4000);

                // 如果点击了关闭播放列表按钮.video-list-btn
            } else if (event.target.matches('#closePlaylist')) {
                // let videoListButton = document.querySelector('.video-list-btn')

                let isPanelShow = localStorage.getItem('isPanelShow');
                if(isPanelShow==='none'){
                    isPanelShow = 'block';
                }else{
                    isPanelShow = 'none';
                }
                videoListButton = document.querySelector('.video-list-btn')
                // listContainer.style.display = isPanelShow
                if (videoListButton) {
                    videoListButton.textContent = isPanelShow==='block' ? '关闭列表' : '播放列表';
                }
                // localStorage.setItem('isPanelShow',isPanelShow)

                let playlistPanel = document.querySelector('.container.mt-5.draggable');
                playlistPanel.style.display = 'none';
                
                localStorage.setItem('isPanelShow', 'none');
                

                // 如果点击了播放模式按钮
            } else if (event.target.matches('#playMode')) {
                playMode = (playMode + 1) % 3;
                // playMode++

                // if(playMode>2){playMode=0}
                // console.log("播放模式按钮被点击,当前playMode是:"+playMode);
                if (playMode === 0) {
                    event.target.textContent = "顺序播放";
                    playModeBtnText='顺序播放'
                    localStorage.setItem('playMode', 0);

                    // alert("已开启顺序播放,playMode: "+playMode);
                } else if (playMode === 1) {
                    event.target.textContent = "随机播放";
                    playModeBtnText='随机播放'
                    localStorage.setItem('playMode', 1);

                    // alert("已开启随机播放,playMode: "+playMode);
                } else if (playMode === 2) {
                    event.target.textContent = "单集循环";
                    localStorage.setItem('playMode', 2);

                    playModeBtnText='单集循环'

                    // alert("已开启单集循环,playMode: "+playMode);
                }
                // alert(`点击了: ${event.target.textContent}`);
                localStorage.setItem('playModeBtnText', playModeBtnText);

                console.log("1388播放模式按钮被点击,当前playMode是:"+localStorage.getItem('playMode'));
                // 如果点击了全选按钮

                // 如果点击了全选按钮
            } else if (event.target.matches('#selectAllItem')) {

                isSelctedAll = !isSelctedAll;

                const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');

                checkboxes.forEach(checkbox => {
                    checkbox.checked = !checkbox.checked; // 反转多选框的选中状态
                });
                let selectAllItemBtn = document.querySelector("#selectAllItem");
                hasCheckedCheckbox()?selectAllItemBtn.textContent="反选":selectAllItemBtn.textContent="全选"


                // 如果点击移除选中按钮
            } else if (event.target.matches('#removeItem')) {

                // videoList.length=0
                  // 清空videoList数组


                // 保存清空后的状态到localStorage
                // localStorage.setItem('videoList', JSON.stringify(videoList));
                // liElList.length=0
                // saveLiElListToLocalStorage()
                // saveVideoList()
                // selectAllItemBtn.textContent="全选"

                // 移除所有选中状态的多选框对应的 <li> 元素
                const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]:checked');
                const listItems = document.getElementById('myList').getElementsByTagName('li');
                const indicesToRemove = [];

                checkboxes.forEach(checkbox => {
                    const parentLi = checkbox.closest('li');
                    if (parentLi) {
                        // 获取被移除的 <li> 元素的索引
                        const index = Array.from(listItems).indexOf(parentLi);
                        indicesToRemove.push(index);
                    }
                });

                // 按索引从大到小排序，确保移除时索引不会变化
                indicesToRemove.sort((a, b) => b - a);

                for (let index of indicesToRemove) {
                    videoList.splice(index, 1);
                    // liElList.splice(index, 1); // 删除liElList中对应的元素
                     // 当删除播放列表面板列表项时需要更新playItemIndex,才能正确播放对应列表项
                    if (index < playItemIndex) {
                        playItemIndex--;
                    } else if (index === playItemIndex) {
                        // 如果当前播放的列表项被删除，则停止播放
                        playItemIndex=-1
                        stopVideo();
                    }
                }


                indicesToRemove.forEach(index => {
                    // console.log(`被移除的 <li> 元素的索引: ${index}`);
                    listItems[index].remove();



                });
                let count=0
                if(videoList.length>0){
                    count=videoList.length
                }
                count=count>0?'总计:'+count:'点击视频左边+号添加'
                let tip = document.querySelector('.text-tip')
                if(tip){
                    tip.textContent=count
                }
                localStorage.setItem('videoList', JSON.stringify(videoList));
                localStorage.setItem('playItemIndex', playItemIndex);
                // saveLiElListToLocalStorage()
                saveVideoListToLocalStorage(videoList)
                // updateVideoPlayList()
                // saveVideoList()
                let selectAllItemBtn = document.querySelector("#selectAllItem");
                hasCheckedCheckbox()?selectAllItemBtn.textContent="反选":selectAllItemBtn.textContent="全选"

                // 如果点击全部添加按钮
            }else if(event.target.matches('#addAllItem')){
                console.log('1347allVideoList长度:'+allVideoList.length)
                // let deleteAll = true
                let selectAllItemBtn = document.querySelector("#selectAllItem");
                selectAllItemBtn.textContent="全选"
                let videoEl = document.querySelector("div.bpx-player-video-wrap > video")
                videoEl.pause();
                videoEl.currentTime = 0;
                if(allVideoList.length>0){
                    // // 获取ul元素
                    let ulElement = document.getElementById('myList');

                    // 移除ul中的所有li元素
                    while (ulElement.firstChild) {
                        ulElement.removeChild(ulElement.firstChild);
                    }




                    // 清空数组
                    videoList.length = 0;
                    // 将allVideoList中的元素添加到videoList中
                    videoList.push(...allVideoList);

                    // for(let i=0;i<allVideoList.length;i++){
                    //     addItemToPLaylistPanel(allVideoList[i].title)
                    // }


                }
                saveVideoListToLocalStorage(videoList)
                // updateVideoPlayList()
                for(let i=0;i<videoPlayList.length;i++){
                    addItemToPLaylistPanel(videoPlayList[i].title)
                }
                // 如果点击切换style按钮
            }else if (event.target.matches('#toggleStyleBtn')) {
               console.log('1384切换style按钮被点击,allvideoList长度:'+allVideoList.length)
                toggleTheme()
                isDarkMode = !isDarkMode;

                // 如果点击了svg添加按钮
            }else if(event.target.matches('#addVideoBtn')){
                let videoItem = document.querySelector('div.clickitem') ||
                    document.querySelector('div.video-episode-card__info-title.video-episode-card__info-title_indent')||
                    document.querySelector('.video-episode-card__info-title');
                let listHead = document.querySelector("#multi_page > div.head-con") ||
                    document.querySelector(".video-sections-head_first-line");
                if(videoItem||listHead){
                    // dialog(message,x=false,y=false,second=false)
                    // x默认1150px，y默认100px，second默认3秒
                    console.log('调用 dialog 函数:', '仅用于添加非合集视频,请点击合集里面视频左边的+添加', 1000, 180, 4);
                    // dialog('仅用于添加非合集视频,请点击合集里面视频左边的+添加',1000,180,4)
                    dialog('仅用于添加非合集视频,请点击合集里面视频左边的+添加')
                    return
                }
                
                console.log('1613添加按钮被点击')
                let stitle = document.querySelector('.video-title.special-text-indent').getAttribute('data-title')
                let splayUrl = window.location.href
                console.log('stitle:',stitle)
                console.log('splayUrl:',splayUrl)
                if(stitle&&splayUrl.includes('/video/')){
                    // console.log('stitle:',stitle)
                    // console.log('splayUrl:',splayUrl)
                    videoList=JSON.parse(localStorage.getItem('videoList'))||[]
                    const svideoInfoInstance = new videoInfo('null', 'null', 'null', stitle, splayUrl);
                    // console.log('正在添加的stitle:', stitle);
                    // console.log('添加splayUrl:', splayUrl);
                    dialog(`已添加<<${stitle}>>到播放列表`)
                    videoList.push(svideoInfoInstance);
                    localStorage.setItem('videoList', JSON.stringify(videoList));
                    addItemToPLaylistPanel(stitle);
                }else{
                    console.log('添加失败')
                    dialog('视频信息加载中,请等稍后重试')
                }
                
                // if(videoList.length>0){
                //     count=videoList.length
                // }
                // count=count>0?count:'点击视频左边+号添加'
                // let tip = document.querySelector('.text-tip')
                // if(tip){
                //     tip.textContent=count
                // }


            }

        });

        // 将列表容器插入到 document.body 中
        document.body.appendChild(listContainer);

    }




///////////////////////////////////////
        function saveVideoListToLocalStorage(videoList) {
            const videoListData = videoList.map(videoInfo => {
                // if (!videoInfo.videoElementHtml || !videoInfo.liHtml) {
                //     console.error('videoInfo 缺少 videoElementHtml 或 liHtml:', videoInfo);
                //     return null;
                // }
                return {
                    
                    firstSpanText: videoInfo.firstSpanText,
                    secondSpanText: videoInfo.secondSpanText,
                    title: videoInfo.title,
                    playUrl: videoInfo.playUrl,
                };
            }).filter(item => item !== null); // 过滤掉缺少 videoElementHtml 或 liHtml 的项

            localStorage.setItem('videoList', JSON.stringify(videoListData));
        }

    /////////////////////////////
    function getVideoListFromLocalStorage() {
        const videoListData = JSON.parse(localStorage.getItem('videoList'));
        if (videoListData) {
            return videoListData.map(videoInfoData => {
                return new videoInfo(
                    videoInfoData.firstSpanText,
                    videoInfoData.secondSpanText,
                    videoInfoData.title,
                    videoInfoData.playUrl
                );
            });
        }
        return [];
    }

    /////////////////////////////






    // 为视频前面添加+号，点击后可以添加到播放列表
    function createAddBtnForVideoItem() {
        // class vedioInfo {
        //     constructor(firstSpanText, secondSpanText, title, playUrl) {
        //         
        //         this.firstSpanText = firstSpanText; // 视频序号，如：P1
        //         this.secondSpanText = secondSpanText; // 视频标题，如：你好吗
        //         this.title = title; // 名称如：P4 你好吗
        //         this.playUrl = playUrl; // 视频播放链接，如https://www.bilibili.com/video/BV1Ys4y1r7Dj/
        //     }
        // }
        // 分P视频ul
        const ul = document.querySelector('ul.list-box');
        // 其他合集ul
        const ulo = document.querySelector('.video-section-list.section-0');
        if (ul) {
            // 定义SVG图标按钮
            const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="margin-right: 10px;" title="添加到播放列表"><path fill="#000000" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>`;
            
            let j = 0
            allVideoList=[]
            ul.querySelectorAll('li').forEach(li => {
                
                const spans = li.querySelectorAll('span');
                let firstSpanText = spans[0].textContent ? spans[0].textContent : 'P';
                let secondSpanText = spans[1].textContent ? spans[1].textContent : '未匹配标题';
                firstSpanText=firstSpanText.trim();
                secondSpanText=secondSpanText.trim();
                let videoTitle = firstSpanText + ' ' + secondSpanText;
                // let allVideoInfo = new vedioInfo(j, videoTitle, videoElement);
                let playUrl = li.querySelector('a').href;
                let mAllvideoInfo = new videoInfo(j,firstSpanText,secondSpanText, videoTitle, playUrl);
                // let mAllvedioInfo = new vedioInfo(index,firstSpanText,secondSpanText, videoTitle, playUrl);
                allVideoList.push(mAllvideoInfo);
                const img = li.querySelector('img');
                if (img) {
                    img.insertAdjacentHTML('beforebegin', svgIcon);
                    const newSvg = img.previousElementSibling;

                    newSvg.addEventListener('click', (event) => {
                        // liElList = getLiElListFromLocalStorage();
                        event.preventDefault();
                        event.stopPropagation();
                        dialog(`已添加<<${videoTitle}>>到播放列表`);

                        // liElList.push(li);
                        let mvideoInfo = new videoInfo(j,firstSpanText,secondSpanText,videoTitle, playUrl);
                        // let mvedioInfo = new vedioInfo(index,firstSpanText,secondSpanText,videoTitle, playUrl);
                        // console.log('正在添加的数量i:'+i)
                        console.log('正在添加的videoTitle:'+ videoTitle);
                        console.log('添加playUrl:'+playUrl);
                        // videoList=[]
                        videoList.push(mvideoInfo);
                        console.log('添加videoList长度:'+videoList.length);
                        
                        // saveVideoListToLocalStorage(videoList);
                        localStorage.setItem('videoList', JSON.stringify(videoList));
                        // updateVideoPlayList()
                        i++;

                        addItemToPLaylistPanel(videoTitle);
                       
                        // if(videoList.length>0){
                        //     count=videoList.length
                        // }
                        // count=count>0?count:'点击视频左边+号添加'
                        // let tip = document.querySelector('.text-tip')
                        // if(tip){
                        //     tip.textContent=count
                        // }

                    });
                }
                j++;
            });
        }else if(ulo){
            // let videoItem = document.querySelector('div.video-episode-card__info-title.video-episode-card__info-title_indent');
            // 定义SVG图标按钮
            let itemList=[]
            let videoEl = document.querySelector("div.bpx-player-video-wrap > video")
            // let playId1
            //     if(videoList.length>0){
            //         playId1 = localStorage.getItem('playId')||0;
            //     }else{
            //         playId1=0
            //     }
            // let playId1 = videoList.length > 0 ? localStorage.getItem('playId') || 0 : 0;
            videoEl.muted = true;//静音
            const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="margin-right: 10px;" title="添加到播放列表"><path fill="#000000" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>`;
            let tempPlayIndex=-1;
            let videot=[]
            let videou=[]
            let videotu=[]
            let playitem
            
            let isLastItem = false
            let j = 0;
            let i = 0; // 定义 i 变量
            let allVideoList = [];
            let videoLists = []; // 定义 videoLists 变量
            let playUrl
            // let videoTitle
            // localStorage.setItem('playText', liTitle);
            let playText = localStorage.getItem('playText');
            // let playIndex = 0
            let playItem = null

            // let itemList=[]
            
            let playIndex = null
           // 定义一个异步函数来处理每个 item
            async function processItem(item, index) {
                let playId = index;
                itemList.push(item)

                
                // 使用闭包保存当前 item 的 videoTitle 和 playUrl
                const addSvgElement = (item, svgIcon) => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = svgIcon;
                    const svgElement = tempDiv.firstChild;
                    try {
                        item.insertAdjacentElement('beforebegin', svgElement);
                    } catch (error) {
                        console.error('Failed to insert element:', error);
                    }
                };

                const handleClick = (item, playId, videoTitle, playUrl) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // showTooltip(`已添加${videoTitle}到播放列表`);
                    dialog(`已添加<<${videoTitle}>>到播放列表`)
                    // 获取videoTitle在videot中的索引
                    // let index = videot.indexOf(videoTitle);
                    // if(playUrl!=videou[index]){
                    //     playUrl='https://www.bilibili.com'+initPlayUrlPath;
                    // }

                    const index1 = videot.indexOf(initTitle);
                    const index2 = videou.indexOf(initPlayUrlPath);
                    // tempPlayIndex = index1 >= 0 ? index1 : index2;
                    if(index2===-1&&index1!=-1){
                        playUrl='https://www.bilibili.com'+initPlayUrlPath;
                    }else if(index1===-1&&index2===-1){
                        let lastIndex = -1;
                        videou.forEach((item, index) => {
                            if (index < videou.length - 1 && item === videou[index + 1]) {
                              lastIndex = index + 1;
                            }
                          });
                        if(lastIndex>=0){
                            tempPlayIndex=lastIndex
                            playUrl='https://www.bilibili.com'+initPlayUrlPath;
                            videou[lastIndex]=initPlayUrlPath;
                        }
                    }



                    const videoInfoInstance = new videoInfo(playId, 'null', 'null', videoTitle, playUrl);
                    console.log('正在添加的videoTitle:', videoTitle);
                    console.log('添加playUrl:', playUrl);
                    videoList.push(videoInfoInstance);
                    localStorage.setItem('videoList', JSON.stringify(videoList));

                    i++;
                    addItemToPLaylistPanel(videoTitle);
                    
                   
                };

                
                
                addSvgElement(item, svgIcon);

                const newSvg = item.previousElementSibling;
                item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                const videoTitle = item.getAttribute('title').trim();
                // const playUrl = window.location.href.split('?')[0];
                playUrl = window.location.href;
                // let playUrlPath=playUrl.pathname;
                let playUrlPath=window.location.pathname
                const videoInfoInstance = new videoInfo(playId, videoTitle, videoTitle, videoTitle, playUrl);
                videotu[index]=[videoTitle,playUrlPath]
                videot[index]=videoTitle.trim()
                videou[index]=playUrlPath.trim()




                
                // console.log('1962 playUrl:', playUrl);
                // console.log('1965 tempPlayIndex:', tempPlayIndex);
                // console.log('1963 videoTitle:', videoTitle);
                // console.log('1964 innitTitle:', initTitle);
                // console.log('1965 initPlayUrlPath:', initPlayUrlPath);
                // console.log('1966 playUrl.pathname:', playUrlPath);
                
                allVideoList.push(videoInfoInstance);
                // if (playId1 === index) {
                //     playitem = item;
                // }

                
                newSvg.addEventListener('click', (event) => {
                    handleClick(item, playId, videoTitle, playUrl);
                });

                j++;

                // if(initTitle === videoTitle||initPlayUrlPath===playUrlPath){
                //     console.log('1995 找到临时播放索引:'+index)
                //     tempPlayIndex = index;
                    
                // }
                // 模拟异步操作，等待 1 秒
                await new Promise(resolve => setTimeout(resolve, 1000));

            }

            // 获取所有元素并依次处理
            const items = document.querySelectorAll('div.video-episode-card__info-title');
            

            // 依次处理每个 item
            items.forEach(async (item, index) => {
                await processItem(item, index);
            });

        // let playid = localStorage.getItem('playId')||0;
        // console.log('2036 playid:'+playid);
        console.log('2036 playItemIndex:'+playItemIndex);
        
        /*判断点击的视频是否为本地存储播放列表中的视频，若是则点击列表项播放，
        否则按当前点击的b站页面的视频播放*/
        let isListItem = false;
        
        if(playItemIndex!=-1){
            if(typeof videoList[playItemIndex] !== 'undefined'){
                videot.indexOf(videoList[playItemIndex].title)>=0?isListItem=true:isListItem=false;
            }else{
                isListItem=false
                console.log('2098 videoList[playItemIndex].title 未定义:')}
            
            console.log('2090 isListItem:'+isListItem);
            if(isListItem){
                setTimeout(() => {
                    videoEl.muted = false;//取消静音
                    clickLiEl(playItemIndex)
                }, 6000);
                setCurrentItemBackgroundAndPlayingGifVisible()
                scrollPlayItemIntoView()
           }else{
                playItemIndex=-1;
                
                setTimeout(() => {
                    const index1 = videot.indexOf(initTitle);
                    const index2 = videou.indexOf(initPlayUrlPath);
                    tempPlayIndex = index1 >= 0 ? index1 : index2;
                    if(index2===-1&&index1!=-1){
                        playUrl='https://www.bilibili.com'+initPlayUrlPath;
                    }else if(tempPlayIndex===-1){
                        let lastIndex = -1;
                        videou.forEach((item, index) => {
                            if (index < videou.length - 1 && item === videou[index + 1]) {
                              lastIndex = index + 1;
                            }
                          });
                        if(lastIndex>=0){
                            tempPlayIndex=lastIndex
                            playUrl='https://www.bilibili.com'+initPlayUrlPath;
                            videou[lastIndex]=initPlayUrlPath;
                        }
                    }
                    console.log('tempPlayIndex:'+tempPlayIndex);
                    console.log('playItemIndex:'+playItemIndex);
                    console.log('videot:'+videot)
                    console.log('videou:'+videou)
                    videoEl.muted = false;//取消静音
                    itemList[tempPlayIndex].click()
                }, itemList.length*600>=11000?11000:itemList.length*600);
                
                localStorage.setItem('playItemIndex', playItemIndex);
                
            }//else的括号
        }else{
            setTimeout(() => {
                videoEl.muted = false;//取消静音
                const index1 = videot.indexOf(initTitle);
                const index2 = videou.indexOf(initPlayUrlPath);
                tempPlayIndex = index1 >= 0 ? index1 : index2;
                if(index2===-1&&index1!=-1){
                    playUrl='https://www.bilibili.com'+initPlayUrlPath;
                }else if(tempPlayIndex===-1){
                    let lastIndex = -1;
                    videou.forEach((item, index) => {
                        if (index < videou.length - 1 && item === videou[index + 1]) {
                          lastIndex = index + 1;
                        }
                      });
                    if(lastIndex>=0){
                        tempPlayIndex=lastIndex
                        playUrl='https://www.bilibili.com'+initPlayUrlPath;
                        videou[lastIndex]=initPlayUrlPath;
                    }
                }
                console.log('2158 tempPlayIndex:'+tempPlayIndex);
                // console.log('2159 playItemIndex:'+playItemIndex);
                console.log('2160 videot:'+videot)
                console.log('2161 videou:'+videou)
                itemList[tempPlayIndex].click()
            },itemList.length*600>11000?11000:itemList.length*600)  
        }
      
        
     }//最近的else if(ulo)的括号


    }//function createAddBtnForVideoItem的括号
    /////////////////////////////////
    // Your code here...
})();