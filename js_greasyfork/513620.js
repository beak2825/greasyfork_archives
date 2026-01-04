// ==UserScript==
// @name         AO3增强
// @namespace    http://tampermonkey.net/
// @version      2024-10-23
// @description  通过浏览器拓展增加可以给ao3文章标记阅读情况和评价的辅助功能，利用indexdb将数据储存在本地缓存。
// @author       Tianguang
// @license MIT
// @match        https://archiveofourown.org/works?*
// @match        https://archiveofourown.org/tags/*
// @match        https://archiveofourown.org/works/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513620/AO3%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/513620/AO3%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var read2yuedu={
        0:'阅读中',
        1:'不要看',
        2:'放弃了',
        3:'已读完',
        4:'待更新',
    }
    prepareCSS()

    if(document.URL.match('https://archiveofourown.org/works/[0-9]*')){
        console.log('work')
        let request=checkDB();
        let db;
        var item={}
        //文章固有属性
        item.articleID=window.location.href.match("(?<=/works/)[^/]*")[0];
        item.title=document.querySelector("h2.title").innerHTML;
        item.author=document.querySelector("a[rel='author']").text;
        console.log('>>',item.articleID)

        request.onsuccess = function(event) {
            console.log('成功打开表格')
            db = event.target.result;

            //查找文章是否有记录行
            var objectStore=db.transaction(["article"],'readwrite').objectStore('article')
            var request2=objectStore.get(item.articleID)
            request2.onsuccess=function(event){
                if(request2.result){
                    console.log("存在记录")

                    //修改内存、页面显示
                    item.read=request2.result.read
                    item.like=request2.result.like
                    item.comm=request2.result.comm

                    afterGetArticleRecord()

                }else{
                    console.log("新增记录")
                    var addRequest=objectStore.add({
                        articleID: item.articleID,author: item.author,
                        read:0,like:0
                    });
                    addRequest.onsuccess=function(){
                        var newRequest=objectStore.get(item.articleID)
                        newRequest.onsuccess = function() {
                            item.read=0;
                            item.like=0;
                            afterGetArticleRecord();
                        }
                    };
                }
            }

        }


        function afterGetArticleRecord(){

            console.log('afterGetArticleRecord',item.read,item.like)

            function changeRead(readButton){
                //更改内存数据
                item.read=(1+item.read)%5

                //更改数据库数据
                console.log('现在开始修改数据库数据-已读');
                var objectStore=db.transaction(["article"],'readwrite').objectStore('article')
                var changeRequest = objectStore.put(item);
                changeRequest.onsuccess=function(){
                    console.log(`修改成功，已读属性为${item.read}`)


                    var newRequest=objectStore.get(item.articleID)
                    newRequest.onsuccess = function() {
                        console.log('修改记录后查询成功');
                        console.log('existResult',newRequest.result);
                    }
                }

                //更改页面显示
                console.log('更改页面显示',read2yuedu[item.read],item.read)
                readButton.innerHTML=read2yuedu[item.read]
            }


            function changeComment(comm){
                item.comm=comm

                console.log('现在开始修改数据库数据-评论');
                var objectStore=db.transaction(["article"],'readwrite').objectStore('article')
                var changeRequest = objectStore.put(item);
                changeRequest.onsuccess=function(){
                    console.log('修改成功')

                    var newRequest=objectStore.get(item.articleID)
                    newRequest.onsuccess = function() {
                        console.log('修改记录后查询成功');
                    }
                }
            }

            function changeLike(likeString){
                item.like=(1+item.like)%6

                //更改数据库数据
                console.log('现在开始修改数据库数据-喜爱');
                var objectStore=db.transaction(["article"],'readwrite').objectStore('article')
                var changeRequest = objectStore.put(item);
                changeRequest.onsuccess=function(){
                    console.log(`修改成功，喜爱属性为${item.like}`)

                    var newRequest=objectStore.get(item.articleID)
                    newRequest.onsuccess = function() {
                        console.log('修改记录后查询成功');
                        console.log('existResult',newRequest.result);
                    }
                }

                //更改页面显示
                console.log('更改页面显示',item.like)
                likeString.innerHTML="★".repeat(item.like)+"☆".repeat(5 - item.like)
            }

            prepareUI()
            //增加的UI



            function prepareUI(){
                // 创建窗口的 HTML 结构

                const container = document.createElement('div');
                container.id = 'floatingWindow';

                var likeStr="★".repeat(item.like)+"☆".repeat(5 - item.like)
                container.innerHTML+=`

            <button id="toggleButton"><</button>
            <div id="windowContent">
                <button id="readButton"></button>
                <span id="likeStr" class="no-select">${likeStr}</span>
                <textarea id="commentTextarea" placeholder="请输入您的感想..."></textarea><br>
            </div>`



                document.body.appendChild(container);


                const toggleButton = document.getElementById('toggleButton');
                const likeString = document.getElementById('likeStr');
                const commentArea = document.getElementById('commentTextarea');
                const readButton = document.getElementById('readButton');
                const content = document.getElementById('windowContent');
                content.style.display = 'block'

                // 给按钮添加监听事件
                toggleButton.addEventListener('click', function(){
                    if (content.style.display == 'none') {
                        content.style.display = 'block'; // 展开
                        toggleButton.textContent = '>';
                    } else {
                        content.style.display = 'none'; // 收起
                        toggleButton.textContent = '<';
                    }

                });
                likeString.addEventListener('click', function(){
                    changeLike(likeString)
                })
                // 给评论修改添加监听事件
                commentArea.addEventListener('change', function(){
                    commentArea.style.height = commentArea.scrollHeight + 'px';
                    var comment=document.getElementById('commentTextarea').value;
                    changeComment(comment)
                });



                readButton.addEventListener('click', function() {
                    changeRead(readButton)

                })


                //初始化UI
                readButton.innerHTML=read2yuedu[item.read]
                if(item.comm){
                    commentArea.value=item.comm
                    commentArea.style.height = commentArea.scrollHeight + 'px';
                }


                setTimeout(function(){
                    toggleButton.click();
                }, 3000);



                //最近在研究智能家居所以下面是一个不在跳出来的窗口活动10秒后自动隐藏的功能
                var timeoutId;
                var timeoutDuration = 10000; // 10秒

                // 用于触发超时后执行的函数
                function onInactivity() {
                    if(content.style.display = 'block'){toggleButton.click();}
                    console.log("超过10秒没有交互，执行函数");
                    // 在这里调用你需要唤起的函数
                }

                // 开始计时
                function startTimer() {
                    clearTimeout(timeoutId); // 确保计时器是唯一的
                    timeoutId = setTimeout(onInactivity, timeoutDuration);
                }

                // 停止计时
                function stopTimer() {
                    clearTimeout(timeoutId);

                }

                // 监听鼠标进入事件，停止计时
                container.addEventListener('mouseenter', stopTimer);

                // 监听鼠标离开事件，开始计时
                container.addEventListener('mouseleave', startTimer);

                // 监听焦点进入 textarea，停止计时
                commentArea.addEventListener('focus', stopTimer);

                // 监听焦点离开 textarea，开始计时
                commentArea.addEventListener('blur', startTimer);

                // 初次加载页面时开始计时
                startTimer();


            }
        }


    }else if(document.URL.match('https://archiveofourown.org/tags/*')){
        console.log('tag')
        let request=checkDB()
        request.onsuccess = function(event) {
            console.log('article表格 打开成功')
            startPoint(event.target.result)
        }

        function startPoint(db){
            var workList=document.querySelector('ol.work.index.group').querySelectorAll(":scope > li")

            for(var i=0;i<workList.length;i++){
                var block=workList[i]

                var comment=document.createElement('p');
                comment.id="comment";
                block.insertBefore(comment,block.firstChild);

                var articleID=block.id.match(/\d+/)[0]
                var res=queryAriticle(articleID,db,comment)

                }
        }

        function queryAriticle(articleID,db,comment){
            //查找文章是否有记录
            var objectStore=db.transaction(["article"],'readwrite').objectStore('article')
            var request2=objectStore.get(articleID)
            request2.onsuccess=function(event){
                if(request2.result){
                    console.log("存在记录")
                    var likeStr="★".repeat(request2.result.like)+"☆".repeat(5 - request2.result.like)

                    var read=read2yuedu[request2.result.read]
                    comment.innerHTML=`${read}    ${likeStr}`
                    comment.setAttribute('data-state',read)
                    return 1
                }else{
                    console.log("不存在记录")
                    return 0
                }

            }
        }
    }





    function prepareCSS(){

        var style = document.createElement('style');
        style.innerHTML = `
#floatingWindow {
    position: fixed;
    top: 20%;
    right: 0px;
    z-index: 9999;
}

#windowContent {
    float:right;
    width: 200px;
    background-color: #ffffff;
    display: none;
    color:black;
    padding:15px

}

#toggleButton {
    float:right;
    width: 20px;
    padding: 5px;
    background-color: #000000;
    box-shadow: none;
    color: white;
    border: none;
    cursor: pointer;
}

#commentTextarea{
    width: 194px;        /* 固定宽度 */
    height: auto;
    min-height: 30px;   /* 最小高度 */
    resize: vertical;   /* 只允许垂直方向的调整 */
    margin-top: 15px;
}

#likeStr{
    cursor: pointer;
    margin-left:10px

}
.no-select{
    user-select: none; /* 禁止文本选择 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    }


    #comment{
        background-color:#4499aa;
        text-align: center;
        line-height: 3;
    }

    #comment[data-state="阅读中"]{
        background-color:#6fd454;
    }

    #comment[data-state="不要看"]{
        background-color:#77222b;
    }

    #comment[data-state="放弃了"]{
        background-color:#a957ae;
    }

    #comment[data-state="已读完"]{
        background-color:#4499aa;
    }

    #comment[data-state="待更新"]{
        background-color:#4499aa;
    }

    `

        document.head.appendChild(style);




    }

    function checkDB(){
        //打开数据库
        var request = window.indexedDB.open('ao3Extension',1);
        console.log('start')

        //打开article表格
        var db;
        request.onupgradeneeded = function (event) {

            console.log('article表格 打开')
            db = event.target.result;
            var objectStore;
            if (!db.objectStoreNames.contains('article')) {
                //如果不存在表格,创建表格
                objectStore = db.createObjectStore('article', { keyPath: 'id' });
                objectStore.createIndex('title', 'title', { unique: false });
                objectStore.createIndex('author', 'author', { unique: false });

                objectStore.createIndex('read', 'read', { unique: false });
                objectStore.createIndex('like', 'like', { unique: false });
            }
        }

        request.onerror = function(event) {
            console.log('article表格 打开失败')
        }
        //打开article表格成功
        request.onsuccess = function(event) {
        }
        return request
    }

})();