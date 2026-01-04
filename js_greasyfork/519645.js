// ==UserScript==
// @name         AO3增强test
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
// @downloadURL https://update.greasyfork.org/scripts/519645/AO3%E5%A2%9E%E5%BC%BAtest.user.js
// @updateURL https://update.greasyfork.org/scripts/519645/AO3%E5%A2%9E%E5%BC%BAtest.meta.js
// ==/UserScript==


(function () {
    'use strict';


    // Your code here...
    var read2yuedu = {
        0: '阅读中',
        1: '不要看',
        2: '暂停了',
        3: '已读完',
        4: '待更新',
        5: 'fan art',
    }
    var hate2taoyan = {
        0: '不隐藏',
        1: '不是我cp',
        2: '有雷点',
        3: '看不下去',
        4: '无关crossover',
    }
    prepareCSS()
    let request = checkDB();
    if (document.URL.match('https://archiveofourown.org/works/[0-9]*')) {
        console.log('work')
        // let request=checkDB();
        let db;
        var item = {}
        //文章固有属性
        item.articleID = window.location.href.match("(?<=/works/)[0-9]*")[0];
        item.title = document.querySelector("h2.title").innerHTML;
        item.author = document.querySelector("a[rel='author']").text;
        console.log('>>', item.articleID)

        request.onsuccess = function (event) {
            console.log('成功打开表格')
            db = event.target.result;

            //查找文章是否有记录行
            var objectStore = db.transaction(["article"], 'readwrite').objectStore('article')
            var request2 = objectStore.get(item.articleID)
            request2.onsuccess = function (event) {
                if (request2.result) {
                    console.log("存在记录")

                    //修改内存、页面显示
                    item.read = request2.result.read
                    item.like = request2.result.like
                    item.comm = request2.result.comm

                    afterGetArticleRecord()

                } else {
                    console.log("新增记录")
                    var addRequest = objectStore.add({
                        articleID: item.articleID, author: item.author,
                        read: 0, like: 0
                    });
                    addRequest.onsuccess = function () {
                        var newRequest = objectStore.get(item.articleID)
                        newRequest.onsuccess = function () {
                            item.read = 0;
                            item.like = 0;
                            afterGetArticleRecord();
                        }
                    };
                }
            }
        }


        function afterGetArticleRecord() {
            console.log('afterGetArticleRecord', item.read, item.like)

            function changeRead(readButton) {
                var length = Object.getOwnPropertyNames(read2yuedu).length;
                console.log(length, Object.keys(read2yuedu).length)
                //更改内存数据
                item.read = (1 + item.read) % length

                //更改数据库数据
                alterArticle(db, item, '<<')

                //更改页面显示
                console.log('更改页面显示', read2yuedu[item.read], item.read)
                readButton.innerHTML = read2yuedu[item.read]
            }
            function changeComment(comm) {
                item.comm = comm

                //更改数据库数据
                alterArticle(db, item)
            }
            function changeLike(likeString) {
                item.like = (1 + item.like) % 6

                //更改数据库数据
                alterArticle(db, item)

                //更改页面显示
                console.log('更改页面显示', item.like)
                likeString.innerHTML = "★".repeat(item.like) + "☆".repeat(5 - item.like)
            }

            prepareUI()
            //增加的UI



            function prepareUI() {
                // 创建窗口的 HTML 结构

                const container = document.createElement('div');
                container.id = 'floatingWindow';

                var likeStr = "★".repeat(item.like) + "☆".repeat(5 - item.like)
                container.innerHTML += `
                    <button id="toggleButton"><</button>
                    <div id="windowContent">
                        <button id="readButton"></button>
                        <span id="likeStr" class="no-select">${likeStr}</span>
                        <textarea id="commentTextarea" placeholder="请输入您的感想..."></textarea><br>
                        <button id="sync">更新</button>
                        <button id="backup">备份</button>
                        <button id="fetch">回来</button>
                    </div>
                `

                document.body.appendChild(container);


                const toggleButton = document.getElementById('toggleButton');
                const likeString = document.getElementById('likeStr');
                const commentArea = document.getElementById('commentTextarea');
                const readButton = document.getElementById('readButton');
                const content = document.getElementById('windowContent');
                content.style.display = 'block'

                document.getElementById('sync').addEventListener('click', function () {
                    console.log('sync start')

                    const data = {
                        message: "Hello from another Node.js app",
                        number: 42
                    };

                    axios.post('https://app.tianguang.fun:3000/data', data)
                        .then(response => {
                            console.log('Response:', response.data);
                        })
                        .catch(error => {
                            console.error('Error:', error.message);
                        });
                })

                document.getElementById('backup').addEventListener('click', function () {
                    console.log('backup start')

                    var transaction = db.transaction("article", 'readonly');
                    var objectStore = transaction.objectStore("article");
                    var getAllRequest = objectStore.getAll(); // 获取所有数据

                    getAllRequest.onsuccess = function (event) {
                        var data = event.target.result; // 获取到的数据
                        console.log(data)
                        console.log('-----------data-------------')


                        // 将数据转换为 JSON 格式
                        var jsonData = JSON.stringify(data, null, 2);

                        // 创建 Blob 对象
                        var blob = new Blob([jsonData], { type: 'application/json' });
                        var url = URL.createObjectURL(blob); // 创建下载链接

                        // 创建一个下载链接
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = 'data.json'; // 设置下载文件名
                        document.body.appendChild(a);
                        a.click(); // 触发下载
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url); // 释放 URL 对象


                        console.log('备份开始')

                        axios.post('https://app.tianguang.fun:3000/data', data)
                            .then(response => {
                                console.log('Response:', response.data);

                                const newWindow = window.open();

                                // 将服务器返回的 HTML 写入新标签页
                                newWindow.document.write(response.data); // 这里是渲染后的 HTML 内容
                                newWindow.history.pushState('选择记录')
                                newWindow.document.close(); // 完成加载

                            })
                            .catch(error => {
                                console.error('Error:', error.message);
                            });

                        console.log('备份中')
                    };

                    getAllRequest.onerror = function (event) { console.log('获取本地数据失败') }

                })

                document.getElementById('fetch').addEventListener('click', function () {

                    console.log('fetch start')
                    axios.post('https://app.tianguang.fun:3000/fetchAll')
                        .then(response => {
                            const remoteData = response.data.success;
                            const transaction = db.transaction(['article'], 'readwrite'); // 启动事务
                            const objectStore = transaction.objectStore('article'); // 获取对象存储

                            const clearRequest = objectStore.clear(); // 清空所有记录
                            console.log('response.data start')
                            console.log(response.data.success)
                            console.log('response.data start')
                            remoteData.forEach(item => {                            // 将 JSON 数据字段映射到对象存储字段
                                const article = {
                                    articleID: item.articleID,          // 映射 JSON 的 'id' 到 'articleID'
                                    title: item.title,           // 保持一致
                                    author: item.author,     // 映射 'authorName' 到 'author'
                                    read: item.read_count,      // 映射 'views' 到 'read_count'
                                    like: item.like_count,
                                    hate: item.hate,
                                    comm: item.comm,
                                    version: item.version
                                };
                                const request = objectStore.add(article); // 使用 add() 方法插入数据
                                request.onerror = function () {
                                    console.error("数据插入失败", item);
                                };
                                request.onsuccess = function () {
                                    console.log("数据成功插入", item);
                                };
                            });
                        })
                        .catch((error) => {
                            console.error('Error:', error.message);
                        })
                })
                // 给按钮添加监听事件
                toggleButton.addEventListener('click', function () {
                    if (content.style.display == 'none') {
                        content.style.display = 'block'; // 展开
                        toggleButton.textContent = '>';
                        startTimer()
                    } else {
                        content.style.display = 'none'; // 收起
                        toggleButton.textContent = '<';
                    }

                });
                likeString.addEventListener('click', function () {
                    changeLike(likeString)
                })
                // 给评论修改添加监听事件
                commentArea.addEventListener('change', function () {
                    commentArea.style.height = commentArea.scrollHeight + 'px';
                    var comment = document.getElementById('commentTextarea').value;
                    changeComment(comment)
                });



                readButton.addEventListener('click', function () {
                    changeRead(readButton)

                })


                //初始化UI
                readButton.innerHTML = read2yuedu[item.read]
                if (item.comm) {
                    commentArea.value = item.comm
                    commentArea.style.height = commentArea.scrollHeight + 'px';
                }


                setTimeout(function () {
                    toggleButton.click();
                }, 3000);



                //最近在研究智能家居所以下面是一个不在跳出来的窗口活动10秒后自动隐藏的功能
                var timeoutId;
                var timeoutDuration = 10000; // 10秒

                // 用于触发超时后执行的函数
                function onInactivity() {
                    if (content.style.display = 'block') { toggleButton.click(); }
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


                window.addEventListener('scroll', function () {
                    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                        console.log("已滚动到页面底部");
                        if (content.style.display = 'none') { toggleButton.click(); }
                    }
                });


            }
        }




        //tag页
    } else if (document.URL.match('https://archiveofourown.org/tags/*') || document.URL.match('https://archiveofourown.org/works*')) {
        console.log('tag')
        // let request=checkDB()
        request.onsuccess = function (event) {
            console.log('article表格 打开成功')
            checkDBUpdate(event.target.result)
            startPoint(event.target.result)
        }
        var items = {};

        async function startPoint(db) {
            var workList = document.querySelector('ol.work.index.group').querySelectorAll(":scope > li")

            for (var i = 0; i < workList.length; i++) {
                var block = workList[i]

                var comment = document.createElement('p');
                comment.id = "comment";
                block.insertBefore(comment, block.firstChild);

                var articleID = block.id.match(/\d+/)[0]
                items[i] = await queryAriticle(articleID, db, comment)
                hiddenAttribute(block, db, i)

            }
        }

        async function queryAriticle(articleID, db, comment) {
            return new Promise(result => {
                //查找文章是否有记录
                var objectStore = db.transaction(["article"], 'readwrite').objectStore('article')
                var request2 = objectStore.get(articleID)
                request2.onsuccess = function (event) {
                    if (request2.result) {
                        console.log("存在记录")
                        var likeStr = "★".repeat(request2.result.like) + "☆".repeat(5 - request2.result.like)

                        var read = read2yuedu[request2.result.read]
                        var comm = read2yuedu[request2.result.comm]
                        var hate = read2yuedu[request2.result.hate]
                        var str = `${read}    ${likeStr}`
                        if (comm) { str += `<br/>${comm}` }
                        comment.innerHTML = str

                        comment.setAttribute('data-state', read)
                    } else {
                        console.log("不存在记录")
                    }

                    console.log("request2.res", articleID)

                    result(request2.result);
                }


            })
        }

        function hiddenAttribute(block, db, i) {
            console.log("hiddenAttribute", i)
            //初始化ui
            var hiddenButton = document.createElement('div');
            hiddenButton.style.position = 'relative'
            var hateValue;


            //如果文章不在表格中，初始化先不添加新记录，到有交互再添加
            if (items[i] == undefined || items[i].hate == undefined) {
                hateValue = 0
            } else {
                hateValue = items[i].hate
            }
            hiddenButton.innerHTML = `
            <button id='hide'>${hate2taoyan[hateValue] || 0}</button>

                <hate>
                    <button class='hate' data='0'>${hate2taoyan[0]}</button>
                    <button class='hate' data='1'>${hate2taoyan[1]}</button>
                    <button class='hate' data='2'>${hate2taoyan[2]}</button>
                    <button class='hate' data='3'>${hate2taoyan[3]}</button>
                    <button class='hate' data='4'>${hate2taoyan[4]}</button>
                </hate>`
            block.appendChild(hiddenButton);
            var hateDiv = block.querySelector("hate");
            hateDiv.style.display = 'none';
            whetherHide(i)

            //次级按钮是否出现
            block.querySelector('#hide').addEventListener('click', function () {
                if (hateDiv.style.display == 'block') {
                    hateDiv.style.display = 'none';
                } else {
                    hateDiv.style.display = 'block';
                }
            });

            function whetherHide(i) {
                console.log(items[i])


                if (items[i] != undefined && items[i].hate) {
                    for (let i = 2; i <= 6; i++) { block.children[i].style.display = 'none'; }
                } else {
                    for (let i = 2; i <= 6; i++) { block.children[i].style.display = 'block'; }
                }
            }
            //次级按钮按下后的反应
            block.querySelectorAll('.hate').forEach(function (element) {
                element.addEventListener('click', function () {
                    hateDiv.style.display = 'none';
                    block.querySelector('#hide').innerHTML = element.innerText

                    var hateValue = Number(element.getAttribute('data'))

                    if (items[i] == undefined) {
                        //文章不在记录中
                        //且不隐藏，则不操作。否则加入记录。
                        if (hateValue == 0) return
                        var intrinsicItem;

                        //获取固有属性
                        items[i] = {}
                        items[i].articleID = block.id.match(/(?<=work_)\d+/)[0]
                        items[i].title = block.querySelector("h4").firstChild.innerHTML;
                        items[i].author = block.querySelector("a[rel='author']").text;
                        console.log(items[i], '固有')
                        addAlteredRecord(db, items[i], 'hate', hateValue)
                    } else {

                    }
                    items[i].hate = hateValue
                    if (hateValue) items[i].read = 1
                    alterArticle(db, items[i])
                    whetherHide(i)



                })
            })




        }
    }




    function prepareCSS() {

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

            #comment[data-state="暂停了"]{
                background-color:#845187;
            }

            #comment[data-state="已读完"]{
                background-color:#4499aa;
            }

            #comment[data-state="待更新"]{
                background-color:#4499aa;
            }

            #comment[data-state="fan art"]{
                background-color:#ff9898;
            }

            hate{
                position:absolute;
                left:80px;
                top:-50px;
                z-index:10;
                background-color:white;
            }

            hate button{
                display:block;
                margin:5px;
            }
        `

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js'

        document.head.appendChild(style);
        document.head.appendChild(script);
    }

    function checkDB() {
        //打开数据库
        var request = window.indexedDB.open('ao3Extension', 1);
        console.log('start')

        //打开article表格
        var db;
        request.onupgradeneeded = function (event) {

            console.log('article表格 打开')
            db = event.target.result;
            if (!db.objectStoreNames.contains('article')) {
                //如果不存在表格,创建表格
                var objectStore = db.createObjectStore('article', { keyPath: 'articleID' });
                objectStore.createIndex('title', 'title', { unique: false });
                objectStore.createIndex('author', 'author', { unique: false });

                objectStore.createIndex('read', 'read', { unique: false });
                objectStore.createIndex('like', 'like', { unique: false });
                objectStore.createIndex('hate', 'hate', { unique: false });
            }
        }

        request.onerror = function (event) {
            console.log('article表格 打开失败')
        }
        //打开article表格成功
        request.onsuccess = function (event) {
        }
        return request
    }

    function checkDBUpdate(db) {
        // 定义字段升级策略
        var upgradeMap = {
            1: ['hate', 'version'],              // 从版本1升级到2，添加newField1
            2: ['newField2'],              // 从版本2升级到3，添加newField2
            3: ['newField3', 'newField4']  // 从版本3升级到4，添加newField3和newField4
        };
        var newVersion = 2

        var objectStore = db.transaction(["article"], 'readwrite').objectStore('article')
        // 获取所有记录以检查版本
        var getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = function (event) {
            var records = event.target.result;

            records.forEach(function (record) {
                var currentVersion = record.version || 1; // 默认版本为1
                var fieldsToAdd = [];

                // 根据当前版本查找需要添加的字段
                for (var version = currentVersion; version < newVersion; version++) {
                    if (upgradeMap[version]) {
                        fieldsToAdd = fieldsToAdd.concat(upgradeMap[version]);
                    }
                }

                // 添加新字段
                fieldsToAdd.forEach(function (field) {
                    record[field] = null; // 或者设置为默认值
                });
                record.version = newVersion; // 更新版本号

                // 更新记录
                var updateRequest = objectStore.put(record);
                updateRequest.onsuccess = function () {
                    if (newVersion != currentVersion) { console.log(`Record upgraded:${currentVersion}->${newVersion}`, record); }
                }
            })
        }

    }

    function alterArticle(db, item) {
        //已有文章的item，更改数据库数据
        var objectStore = db.transaction(["article"], 'readwrite').objectStore('article')
        var changeRequest = objectStore.put(item);
        changeRequest.onsuccess = function () {
            var newRequest = objectStore.get(item.articleID)
            newRequest.onsuccess = function () {
                console.log('修改记录后查询成功');
                console.log('existResult', newRequest.result);
            }
        }
    }

    function addAlteredRecord(db, intrinsicItem, column, value) {
        var objectStore = db.transaction(["article"], 'readwrite').objectStore('article')
        var newItem = intrinsicItem;
        //用户属性初始值
        newItem.read = 0;
        newItem.like = 0;
        newItem.hate = 0;
        newItem.comm = '';

        //替换值
        newItem[column] = value
        console.log('修改', column, value, newItem[column])
        var addRequest = objectStore.add(newItem);
        addRequest.onsuccess = function () {
            console.log(`成功添加记录,articleID=${intrinsicItem.articleID}`)
        }
    }

})();