// ==UserScript==
// @name        ZhihuOneKeyReport-JavaScript
// @namespace   Violentmonkey Scripts
// @match       https://www.zhihu.com/people/*
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant       window.open
// @grant       window.focus
// @version     1.1
// @author      尼尼尼@知乎
// @author      备份公众号：尼尼尼不打拳
// @description 2022/9/3 15:00:00
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/452026/ZhihuOneKeyReport-JavaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/452026/ZhihuOneKeyReport-JavaScript.meta.js
// ==/UserScript==


// 用于举报“不友善内容”时简化操作步骤的Javascript脚本。
// 请勿滥用

// 简要操作说明：
// 1.在浏览器扩展商店中搜索“暴力猴“、”油猴“之类扩展插件，安装并启用。下面以”暴力猴“为例。
// 2.在暴力猴插件中点击”+“号，新建JS脚本，将此脚本内容全部复制粘贴进去并保存。
// 3.进入知乎主页，登录知乎账户。在暴力猴插件控制台中启用上面保存的脚本。注意不能与单页回答检查脚本同时启用。
// 4.刷新页面，右侧滚动条旁边会出多一个蓝色按钮（备用按钮，不是必须点击）
// 5.进入要举报内容的个人主页, 点击回答、文章、想法等模块后，注意需要手工刷新一次页面。
//   在每条内容后就会多出一个“一键举报”按钮。
// 6.知乎的文章、回答等模块是部分动态加载的，所以有时候出现只有一半内容加上按钮的情况，
//   这时点击一下右侧的蓝色按钮手工添加即可。


(function () {
        'use strict';

        // 开始对Modal窗口的变化监视，及提交处理。
        function handleModalSubmit(target){
            // Firefox和Chrome早期版本中带有前缀
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            // 创建Modal窗口的观察者对象
            var modalObserver = new MutationObserver(function (mutations) {
                try {
                    mutations.forEach(function (mutation) {
                        switch (mutation.type) {
                            case 'childList':
                                quickReport(modalObserver);
                                throw new Error("模态窗口变化已检测到，抛出异常中止。")
                        }
                    });
                }catch (e){
                    console.log(e);
                }
            });
            // 配置观察选项
            var config = {
                childList: true  //观察目标子节点的变化，添加或者删除
            }
            // 传入目标节点和观察选项
            modalObserver.observe(target, config);
        }

        function handlePopMenuObserver(observer) {
            // 终止对pop menu的observer监控
            observer.disconnect();

            // 开始处理Modal窗口的提交
            var target = document.querySelector('div[class="Modal-content"]');
            handleModalSubmit(target)

        }

        function handleNormalReport(reportBtn){
            var originalReportBtn = reportBtn.previousElementSibling;
            if(originalReportBtn === null ){
                console.log('错误: 未查找到原始举报按钮');
            }

            originalReportBtn.click();
            var target = document.querySelector('div[class="Modal-content"]');
            handleModalSubmit(target);
        }

        function handlePopMenuReport(reportBtn) {
            // 先点击pop menu，这里要注意选择button元素，才能click。不要选到外层的div.
            console.log('点击pop menu');
            var popMenu = reportBtn.previousElementSibling.firstChild;

            // 使用mutation observer监视点击pop menu后生成的原始举报按钮
            var docBody = document.querySelector('body');
            // Firefox和Chrome早期版本中带有前缀
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            var btn = null;
            // 创建pop menu的观察者对象
            var popMenuObserver = new MutationObserver(function (mutations) {
                try{
                    mutations.forEach(function (mutation) {
                        switch (mutation.type) {
                            case 'childList':
                                var selfMenu = document.querySelector('div[class="Menu AnswerItem-selfMenu"]');
                                var nsl = selfMenu.childNodes;
                                // console.log(nsl);
                                for(let n of nsl){
                                    if(n.innerHTML === '举报'){
                                        btn = n;
                                        // console.log(btn);
                                    }
                                }
                                btn.click();
                                handlePopMenuObserver(popMenuObserver);
                                throw new Error("回答模块按钮栏的pop menu变化已检测到，抛出异常中止。")
                        }
                    });
                }
                catch(e) {
                    console.log(e);
                }
            });

            var config = {
                childList: true //观察目标子节点的变化，添加或者删除
            }
            // 传入目标节点和观察选项
            popMenuObserver.observe(docBody, config);

            // 建立观察者后再点击下拉菜单
            popMenu.click();
        }

        function quickReport(observer) {
            var spanList = document.querySelectorAll('div[class="Modal-content"] span');
            // console.log(spanList);
            var reason = null;

            for (let i = 0; i < spanList.length; ++i) {
                let span = spanList[i]
                if (span.innerHTML === '辱骂、人身攻击等不友善行为') {
                    reason = span.parentElement;
                }
            }

            // 终止对Modal窗口的变化监控
            observer.disconnect();
            reason.click();

            var dialog = document.querySelector('textarea[class="Input"]');
            dialog.innerHTML = '不友善，引发情绪对立';

            var btnArea = document.querySelector('textarea[class="Input"]').parentElement.nextSibling;
            var btnList = btnArea.childNodes;

            var btnOnDialog = null;

            for (let i = 0; i < btnList.length; ++i) {
                //console.log(btnList[i]);
                if (btnList[i].innerHTML === "举报") {
                    btnOnDialog = btnList[i];
                    break;
                }
            }
            console.log('准备点击');
            btnOnDialog.click();
        }

        // 一键举报按钮的关联事件
        function watchReasonLoad(e) {
            var reportBtn = e.target;
            //对于带弹出菜单和不带菜单的页面，需要作分别处理。
            var url = window.location.href;
            if(url.includes('answers')){
                console.log('回答页面有pop菜单，需要单独处理');
                handlePopMenuReport(reportBtn);
            }else{
                console.log('回答以外的页面通用处理');
                handleNormalReport(reportBtn);
            }
        }

        // 监听“回答”模块的内容框架中的加载情况。即等待回答的内容动态加载完成。
        function monitorAnswerTab() {
            // var answerBody = document.querySelector('div[class="ListShortcut"]');
            var answerBody = document.getElementById('Profile-answers');

            // Firefox和Chrome早期版本中带有前缀
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

            var answerObserver = new MutationObserver(function (mutations) {
                try {
                    mutations.forEach(function (mutation) {
                        switch (mutation.type) {
                            case 'childList':
                                console.log("进到这里说明内容是异步加载的，已加载完成")
                                handlerContentObserver(answerObserver);
                                // 这里有多个ChildList的变动，所以这里执行一次之后，要跳出foreach。
                                // 不然会将堆栈中记录的所有变化遍历一次，重复执行。
                                throw new Error('内容模块已加载，抛出异常中止多余的遍历');
                        }
                    });
                }catch(e){
                    console.log(e);
                }
            });

            var config = {
                childList: true,
                subtree: true
            }
            // 传入目标节点和观察选项
            answerObserver.observe(answerBody, config);
        }

        // 处理回答的obeserver的回调函数
        function handlerContentObserver(answerObserver) {
            //终止监视
            answerObserver.disconnect();
            // 内容加载后，执行初始化
            console.log("内容加载后，执行初始化")
            init();
        }

        // 在每个"举报"按钮后添加"一键举报"按钮。
        // 想法和文章模块，是一部分随请求返回，另一部分异步加载。不保证每次都能全部添加上。
        function addReportButton() {

            var btnBarList = document.querySelectorAll('div[class="ContentItem-actions"]');
            //btnBarList = document.getElementsByClassName('ContentItem-actions');

            console.log("开始添加按钮")

            // 如果该Tab下一条内容都没有，直接return
            if (btnBarList.length === 0 ) {
                console.log("发生错误: 内容尚未加载，需手动点击右侧按钮注入");
                return;
            }

            for (let item of btnBarList) {

                // 视频模块的内容操作栏的结果与其它不同，多套了两层div, 需要单独处理。
                var url = window.location.href;
                if(url.includes('/zvideos')){
                    let newItem = item.firstChild.firstChild;
                    // console.log(newItem);
                    newItem.insertAdjacentHTML('beforeend', '<button id="OneKeyReport" type="button" class="one-key-report" style="color:blue">   【一键举报】</button>');
                }else{
                    // 其它模块正常处理
                    //$(item).append('<button id="OneKeyReport" type="button" class="one-key-report"> 【一键举报】</button>');
                    item.insertAdjacentHTML('beforeend', '<button id="OneKeyReport" type="button" class="one-key-report" style="color:blue">  【一键举报】</button>');
                }
            }

            // 遍历，给所有新增按钮注册事件
            var oneKeyReportList = document.querySelectorAll('button[class="one-key-report"]');

            for (let item of oneKeyReportList) {
                item.addEventListener("click", watchReasonLoad, false);
            }
            console.log('添加新按钮完毕');
        }

        // 在每个翻页按钮中绑定刷新页面的event listener
        function addPageBtnEvent() {
            var pageBtnList = document.querySelectorAll('div[class="Pagination"] > button');
            //console.log(pageBtnList);
            //如果没有翻页栏，直接return
            if(pageBtnList === null){
                return;
            }
            for (let item of pageBtnList) {
                //item.addEventListener("click", addReportButton, false);
                item.addEventListener("click", refreshPage, false);
            }
            console.log('翻页按钮添加事件完成');
        }

        // 翻页后一次刷新，保证显示新增按钮
        function refreshPage(e){
            console.log(e.target)
            console.log("自动刷新页面");
            e.target.click();
            window.location.reload();
        }

        // 监视翻页栏的的翻页变化, 发布变化时则执行添加按钮和刷新的操作
        // function observePageBar() {
        //     // Firefox和Chrome早期版本中带有前缀
        //     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        //
        //     // 创建翻页栏的观察者对象
        //     var targetPageBar = document.querySelector('div[class="Pagination"]');
        //     console.log("找翻页栏");
        //     console.log(targetPageBar);
        //     //如果当前Tab没有翻页栏，直接return,不用监视了
        //     if(targetPageBar === null){
        //         console.log("本页没有翻页栏");
        //         return;
        //     }
        //     var pageObserver = new MutationObserver(function (mutations) {
        //         mutations.forEach(function (mutation) {
        //             switch (mutation.type) {
        //                 case 'childList':
        //                     console.log(mutation);
        //                     console.log("发生翻页了===========");
        //                     addReportButton();
        //                     addPageBtnEvent();  // 因为页码元素会发生变化，所以每次都重新绑定
        //                     break;
        //             }
        //         });
        //     });
        //     // 配置观察选项，翻页栏监听子元素的变化
        //     var config = {
        //         childList: true,
        //         subtree: true,
        //         attributes:true
        //     }
        //     // 传入目标节点和观察选项
        //     pageObserver.observe(targetPageBar, config);
        // }

        function init(){
            // 先开始监听个人主页中回答模块内容的动态加载。
            // 知乎的回答模块的内容全部是动态加载, 还好办。
            // 想法和文章模块，则是一部分内容随请求返回，另一部分又是异步加载，这种处理起来很麻烦，靠手动按钮弥补。
            var url = window.location.href;
            if(url.includes('/answers')){
                console.log("当前为回答模块, 单独处理");
                // 如果目标内容没有加载，则开始监听；如果已经加载，则直接在下面作普通初始化
                var answerContent = document.querySelectorAll('div[class="ContentItem-actions"]');
                if(answerContent.length === 0){
                    console.log("回答模块的内容还没有加载，开始监听");
                    monitorAnswerTab();
                }
            }

            //回答之外的模块作普通初始化处理
            // 添加一键举报按钮
            addReportButton();
            // 在每个翻页按钮中绑定 listener
            addPageBtnEvent();

            // 取消监视翻页栏的的翻页变化, 通过每次翻页时重新加载页面，来重新绑定事件，不然容易循环调用。
            // observePageBar();
        }

        // 添加手动插入举报按钮
        function addFloatButton() {
            $('body').append('<div id="FloatButton">点<br>击<br>添<br>加<br>一<br>键<br>举<br>报</div>')
            $('#FloatButton').css('width', '20px')
            $('#FloatButton').css('position', 'fixed')
            $('#FloatButton').css('top', '150px')
            $('#FloatButton').css('right', '3px')
            $('#FloatButton').css('background-color', '#2F4F4F')
            $('#FloatButton').css('color', 'white')
            $('#FloatButton').css('font-size', 'small')
            $('#FloatButton').css('z-index', 100)
            $('#FloatButton').css('border-radius', '25px')
            $('#FloatButton').css('text-align', 'center')
            $('#FloatButton').css('cursor', 'default')
            $('#FloatButton').click(function () {
                init();
            });
        }

        document.onreadystatechange = function () {
            if (document.readyState === "complete") {

                console.log('添加手动插入举报按钮');
                addFloatButton();

                // 进行初始化
                init();
            }
        }
    }

)();