// ==UserScript==
// @name         任务完成提醒
// @namespace    http://tampermonkey.net/
// @version      1.4.7
// @description  提高效率
// @author       wz
// @match        http://*.138:9002/*
// @match        http://*.22:9002/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_notification
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie@1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/481761/%E4%BB%BB%E5%8A%A1%E5%AE%8C%E6%88%90%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/481761/%E4%BB%BB%E5%8A%A1%E5%AE%8C%E6%88%90%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("my script, start");

    const DOWNLOAD_FOLDERS= "download_folders";

    var newFlag = false;
    var bodyText = document.body.textContent || document.body.innerText;
    if(bodyText.includes("Byzer")){
        newFlag = true;
        fetchFolderInfo();
    }else{
        oldFetchFolderInfo();
    }

    var localFolderList = showDownloadFolder(newFlag);

    //  展示所有目录
    function showDownloadFolder(newFlag){
        var folderKey = newFlag ? "folder" : "oldFolder";
        var folderList = JSON.parse(localStorage.getItem(folderKey));
        var itemList = document.createElement("ul");

        let downloadMap = new Map();

        if(folderList !== null && folderList !== undefined){
            console.log(folderList);
            for(var i=0; i<folderList.length; i++){
                var folderName=folderList[i].name;
                var folderId=folderList[i].id;
                console.log("name:"+name);

                var li = document.createElement("li");
                li.textContent = folderId+": 《"+folderName+"》";

                li.classList.add("download-dir");

                itemList.appendChild(li);

                downloadMap.set(folderId, folderName);
            }
        }
        localStorage.setItem(DOWNLOAD_FOLDERS, JSON.stringify([...downloadMap]));
        return itemList;
    }

    // 点击下载指定目录下所有文件
    $(document).on("click", ".download-dir", function () {
        var text=$(this).text();
        var folderId = text.split(":")[0];
        console.log(folderId);
        saveDirAll(newFlag, folderId);

    });

    // 获取各文件夹内信息列表
    function oldFetchFolderInfo(){
        $.ajax({
            type: "GET",
            url: "/api_v1/script_file",
            data: null,
            beforeSend:function (request) {
            },
            success: function (result) {
                var fileList = JSON.parse(JSON.stringify(result));
                var folderArray=[];
                for(var i=0; i<fileList.length; i++){
                    var file=fileList[i];
                    if(file.isDir===true && file.parentId!==0){
                        var folderId = file.id;
                        var idList = [];
                        for(var j=0; j<fileList.length; j++){
                            if(fileList[j].parentId===folderId){
                                idList.push(fileList[j].id);
                            }
                        }
                        var folderJson={"name": file.label, "id": folderId, "list": idList};
                        folderArray.push(folderJson);
                    }
                }
                localStorage.setItem("oldFolder", JSON.stringify(folderArray));
            },
            error: function (e) {
                console.log("fail");;
            }
        });
    }

    // 获取各文件夹内信息列表
    function fetchFolderInfo(){
        $.ajax({
            type: "GET",
            url: "/api/files",
            data: null,
            beforeSend:function (request) {
            },
            success: function (result) {
                var json = JSON.parse(JSON.stringify(result));
                var data=json.data;
                var dirList= data.list;
                var folderArray=[];
                for(var i=0; i<dirList.length; i++){
                    var folder=dirList[i];
                    var folderId = folder.folder_id;
                    var isDemo = folder.is_demo;

                    if(folderId==="0" || folderId === undefined || folderId===null  || isDemo===true){
                        continue;
                    }
                    var folderName = folder.name;
                    var scriptList=folder.list;
                    var idList=[];
                    if(scriptList!==null && scriptList!==undefined){
                        for(var k=0; k<scriptList.length; k++){
                            idList.push(scriptList[k].id);
                        }
                    }
                    var folderJson={"name":folderName, "id": folderId, "list": idList};
                    folderArray.push(folderJson);
                }
                localStorage.setItem("folder", JSON.stringify(folderArray));
            },
            error: function (e) {
                console.log("fail");;
            }
        });
    }

    //  保存所有文件
    function saveAll(newFlag){
        var folderKey = newFlag ? "folder" : "oldFolder";
        var folderList = JSON.parse(localStorage.getItem(folderKey));
        if(folderList !== null && folderList !== undefined){
            console.log(folderList);
            var timeCount=0;
            for(var i=0; i<folderList.length; i++){
                var name=folderList[i].name;
                var itemList=folderList[i].list;
                for(var j=0; j<itemList.length; j++){
                    if(timeCount<300){
                        setTimeout(getAndSave, 1000*timeCount, itemList[j], name, newFlag);
                        timeCount++;
                    }
                }
            }
        }
    }

    //  保存指定目录下所有文件
    function saveDirAll(newFlag, dirId){
        var folderKey = newFlag ? "folder" : "oldFolder";
        var folderList = JSON.parse(localStorage.getItem(folderKey));
        if(folderList !== null && folderList !== undefined){
            console.log(folderList);
            var timeCount=0;
            for(var i=0; i<folderList.length; i++){
                var cacheDirId=String(folderList[i].id);
                var name=folderList[i].name;
                if(dirId===cacheDirId.toString()){
                    var itemList=folderList[i].list;
                    for(var j=0; j<itemList.length; j++){
                        setTimeout(getAndSave, 1000*timeCount, itemList[j], name, newFlag);
                        timeCount++;
                    }
                    break;
                }
            }
        }
    }

    // 保存单个文件
    function getAndSave(tabId, prefix, newFlag){
        var urlPath = newFlag ? "/api/notebook/" : "/api_v1/script_file/get?id=";
        $.ajax({
            type: "GET",
            url: urlPath + tabId,
            data: null,
            beforeSend:function (request) {
            },
            success: function (result) {
                var json = JSON.parse(JSON.stringify(result));
                var content, fileName;
                if(newFlag){
                    var data=json.data;
                    content= data.cell_list[0].content;
                    fileName= data.name+".sql";
                }else{
                    content= json.content;
                    fileName = json.label;
                }

                if(prefix!==null){
                    fileName="【"+prefix+"】__"+fileName;
                }
                saveFile(fileName, content);
            },
            error: function (e) {
                console.log("fail");;
            }
        });
    }


    localStorage.setItem("click", "0");
    var showMode = localStorage.getItem("show-mode");

    var interval=5000;
    var orange="#ec7258";

    const NO_NOTICE_MAP = "noNoticeMap";
    const TAB_COUNT = 4;
    const NOTICE_COUNT_STR="notice-count";
    const NOTICE_DURATION_STR="notice-duration";
    const NOTICE_INTERVAL_STR="notice-interval";

    var btnHeight="2rem";
    var boxHeight="8rem";
    var clsBtnMargin="5px"

    function addCustomStyles() {
        var css = `
        ul, li{
            margin: 0;
            padding: 0;
        }
        li{
            list-style: none;
        }
        .tool-box {
            position: absolute         !important;
            bottom: 12rem                  !important;
            left: 100%                 !important;
            transform: translate(-100%, 0%)       !important;
            width: 15.6rem               !important;
        }
        .tool-button {
            position: absolute                   !important;
            left: 50%                            !important;
            transform: translate(-50%, 0%)       !important;
            color: white                         !important;
            background-color: #654bff            !important;
            border: none            !important;
            border-radius: 16px     !important;
            //padding: 8px 12px      !important;
            height: 2rem            !important;
            width: 5.2rem             !important;
        }
        .tool-button-save {
            position: absolute                   !important;
            left: 50%                            !important;
            transform: translate(0%, 100%)       !important;
            color: white                         !important;
            background-color: #0875da            !important;
            border: none            !important;
            border-radius: 16px     !important;
            height: 2rem            !important;
            width: 8rem             !important;
        }
        .tool-tabList {
            margin-top: 2rem          !important;
        }
        .tab {
            display: inline-block      !important;
            background-color: white    !important;
            color: #ec7258             !important;
            border: 1px solid #ec7258  !important;
            text-align: center         !important;
            width: 5.2rem                !important;
            line-height: 2rem          !important;
        }
        .tab-on {
            background-color: #ec7258  !important;
            color: white               !important;
        }
        .tool-page-list {
            position: absolute         !important;
            background-color: #ffffff  !important;
            border: 1px solid #aaa     !important;
            //border-radius: 16px      !important;
            padding: 10px           !important;
            line-height: 1.3        !important;
            min-height: 4.5rem      !important;
            width: 15.6rem            !important;
        }
        .tool-page {
            //position: absolute    !important;
            //z-index: 999            !important;
            background-color: white !important;
            min-height: 4.5rem      !important;
        }
        .radio-group {
            display: flex    !important;
            flex-wrap: wrap  !important;
            gap: 3px         !important;
            margin-top: 5px  !important;
        }

        .radio-group label {
            margin-right: 5px !important;
        }
    `;
        GM_addStyle(css);
    }
    addCustomStyles();

    //    按钮
    function getButton(){
        var button = document.createElement("button");
        button.textContent = "设置面板";
        button.classList.add("tool-button");
        return button;
    }

    // 控制按钮下面的面板
    function getPanel(tabs, pageContainer){
        var div = document.createElement("div");
        div.style.backgroundColor = "#ffffff";
        if(showMode==="隐藏"){
            div.style.display="none";
        }
        div.appendChild(tabs);
        div.appendChild(pageContainer);
        return div;
    }

    //    整体
    function getBox(button, panel){
        var box = document.createElement("div");
        box.appendChild(button);
        box.appendChild(panel);
        box.classList.add("tool-box");
        return box;
    }

    //    选项卡
    function getTabs(){
        var tabs = document.createElement("ul");
        var liContent=[ "保存文件", "不通知列表", "通知模式", "显示模式"];
        for(var i=0; i<TAB_COUNT; i++){
            var li = document.createElement("li");
            li.className="tab";
            li.textContent = liContent[i];
            if(i===0){
                li.classList.add("tab-on");
            }
            tabs.appendChild(li);
        }
        tabs.classList.add("tool-tabList");
        return tabs;
    }

    var pages = document.createElement("div");
    pages.classList.add("tool-page-list");

    //    页面容器
    function getPageContainer(){
        for(var i=0; i<TAB_COUNT; i++){
            var page = document.createElement("div");
            page.id = "tool-page-"+(i+1);
            page.className="tool-page";
            page.style.display = "none";
            i===0 ? page.style.display = "block":"";
            pages.appendChild(page);
        }
        return pages;
    }

    var button=getButton();
    var pageContainer=getPageContainer();
    var tabs=getTabs();

    var panel = getPanel(tabs, pageContainer);
    var box=getBox(button, panel);
    document.body.appendChild(box);

    /**
     * 设置各面板具体选项内容
     */
    pageContainer.childNodes[0].display="block";

    var saveButton = document.createElement("button");
    saveButton.textContent = "一键下载所有目录";
    saveButton.className="tool-button-save";
    pageContainer.childNodes[0].innerHTML="<span style='color: #ec7258'>单击指定目录，则只下载该目录下所有文件</span>";
    pageContainer.childNodes[0].appendChild(saveButton);
    pageContainer.childNodes[0].appendChild(localFolderList);

    saveButton.addEventListener('click', function(event) {
        console.log("clicked");
        saveAll(newFlag);
    });

    pageContainer.childNodes[1].innerHTML="<span style='color: #ec7258'>添加方式：双击已打开文件的文件名</span>";

    const options1 = ['1', '2', '3'];
    const options2 = ['5', '10', '20'];
    const options3 = ['1', '2', '4'];

    var radioGroup2 = getRadios(options2, "单次持续（秒）：", NOTICE_DURATION_STR, 10);
    var radioGroup1 = getRadios(options1, "重复次数（次）：", NOTICE_COUNT_STR, 1);
    var radioGroup3 = getRadios(options3, "重复间隔（分）：", NOTICE_INTERVAL_STR, 1);

    pageContainer.childNodes[2].appendChild(radioGroup2);
    pageContainer.childNodes[2].appendChild(radioGroup1);
    pageContainer.childNodes[2].appendChild(radioGroup3);

    const showOptions = ['显示', '隐藏'];
    var showRadioGroup = getRadios(showOptions, "设置面板默认：", "show-mode", "显示");
    pageContainer.childNodes[3].appendChild(showRadioGroup);

    /**
     * 通知次数
     */
    function getRadios(options, titleStr, keyStr, defaultValue){
        const radioGroup = document.createElement('div');
        radioGroup.className = 'radio-group';

        const titleSpan = document.createElement('span');
        titleSpan.innerHTML=titleStr;
        radioGroup.appendChild(titleSpan);

        var noticeAttribute=localStorage.getItem(keyStr);
        if(noticeAttribute === null || noticeAttribute === undefined){
            localStorage.setItem(keyStr, defaultValue);
            noticeAttribute = defaultValue;
        }

        let currentValue;
        options.forEach((option, index) => {
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = `${keyStr}-${index}`;
            radioButton.name = keyStr; // 设置相同的name属性以便形成单选组
            radioButton.value = option;

            if(String(noticeAttribute) === option){
                radioButton.checked=true;
            }

            const label = document.createElement('label');
            label.textContent = option;

            // 添加点击事件监听器
            radioButton.addEventListener('change', (event) => {
                if (event.target.checked) {
                    console.log(event.target.value);
                    currentValue = event.target.value;
                    localStorage.setItem(keyStr, currentValue);
                }
            });

            // 将单选框和标签添加到新的div元素中
            radioGroup.appendChild(radioButton);
            radioGroup.appendChild(label);
        });
        return radioGroup;
    }

    /**
     * tab切换
     */
    var noNoticeList = document.createElement("ul");
    noNoticeList.id = "myList";

    var tabList=document.querySelectorAll(".tool-tabList li");
    for(let t=0; t<tabList.length; t++){
        tabList[t].addEventListener("click", function(){
            // 同级其他元素淡化
            let siblings = Array.from(this.parentNode.children).filter((element) => element !== this);
            siblings.forEach(function(sib) {
                sib.classList.remove("tab-on");
            });
            // 当前元素高亮
            this.style.backgroundColor=orange;
            this.style.color="white";
            this.classList.add("tab-on");

            var liParent = this.parentElement;
            var tabChildren = Array.from(liParent.children);
            var index = tabChildren.indexOf(this);
            console.log("index: "+index);

            // 下挂元素的显示/隐藏
            var toolPages = document.querySelectorAll(".tool-page-list > div");
            toolPages.forEach(function(page) {
                page.style.display="none";
            });
            toolPages[index].style.display="block";
        });
    }


    // 加载展示各条目
    let myMap = getIdMap(NO_NOTICE_MAP);
    if(myMap.size>0){
        myMap.forEach((value, key) => {
            var li = document.createElement("li");
            li.textContent = key+": "+value;

            var clsBtn = document.createElement("button");
            clsBtn.innerHTML = "×";
            clsBtn.classList.add("remove-button");
            clsBtn.style.margin=clsBtnMargin;

            li.appendChild(clsBtn);
            noNoticeList.appendChild(li);
        });
    }
    pageContainer.childNodes[1].appendChild(noNoticeList);

    // 当用户点击按钮时，显示或隐藏控制面板
    button.addEventListener("click", function() {
        if (panel.style.display === "none") {
            panel.style.display = "block";
        } else {
            panel.style.display = "none";
        }
    });

    // 点击删除事件
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("remove-button")) {
            var item=event.target.parentElement;
            var tabId=item.textContent.split(":")[0];
            item.remove(); // 移除父级li元素

            let myMap = getIdMap(NO_NOTICE_MAP);
            console.log(myMap);
            console.log(tabId);

            if(myMap.get(tabId)!==undefined){
                myMap.delete(tabId);
            }
            localStorage.setItem(NO_NOTICE_MAP, JSON.stringify([...myMap]));

        }
    });

    // 1、给 addedNode 的运行按钮绑定单击事件，
    // 2、给 addedNode 本身绑定双击事件
    function bindClick(addedNode) {
        var tabId = addedNode.id;
        var paneNode = document.querySelector("#"+tabId.replace("tab", "pane"));

        var playButton =paneNode.querySelector("div > div > div.cellListPage-header > div > div:nth-child(5) > i");

        if(playButton!==null){
            playButton.addEventListener('click', function(event) {
                console.log(tabId);
                sessionStorage.setItem(tabId, "2");
            });
        }

        addedNode.addEventListener('dblclick', function(event) {
            console.log("enter");

            var itemId=tabId.split("_")[1];
            var tabContent=addedNode.textContent;

            var li = document.createElement("li");

            let myMap = getIdMap(NO_NOTICE_MAP);

            // 如果目标元素不存在
            if(myMap.get(itemId)===undefined){
                li.textContent = itemId+": "+tabContent;

                var clsBtn = document.createElement("button");
                clsBtn.innerHTML = "×";
                clsBtn.classList.add("remove-button");
                clsBtn.style.margin=clsBtnMargin;

                li.appendChild(clsBtn);
                noNoticeList.appendChild(li);

                myMap.set(itemId, tabContent);
                localStorage.setItem(NO_NOTICE_MAP, JSON.stringify([...myMap]));
            }

        });
    }

    function isEmpty(item){
        if(item===null || item===undefined || item.length===0){
            return true;
        }else{
            return false;
        }
    }

    // 监听元素变化
    const observer = new MutationObserver((mutationsList, observer) => {
        // 遍历每个变化
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {

                if (mutation.addedNodes.length > 0) {
                    for (const addedNode of mutation.addedNodes) {
                        if(!newFlag){
//                             ## 旧平台
                             const runBtn = document.querySelector('#rc-tabs-1-panel-newTab1 > div > div.mslql-editor-buttons > button:nth-child(1)');
                            if(!runBtn){
                                return;
                            }
                            let isPageRunning=runBtn.classList.contains("ant-btn-loading");
      //                         如果本来没运行，现在运行中，设置标记
                            let sessionRunning=sessionStorage.getItem("running");
                            if(isEmpty(sessionRunning) && isPageRunning){
                                console.log("h1");
                                sessionStorage.setItem("running", "1");
                            }
     //                         如果本来运行中，此刻运行结束，则发通知，移除标记
                            if(!isEmpty(sessionRunning) && !isPageRunning){
                                console.log("h2");
                                notify("统计完成", "0");
                                sessionStorage.removeItem("running");
                            }
                        }else{
//                             ## 新平台
                            // 出现的notebook，绑定点击事件
                            if(addedNode!==null && addedNode.id!==undefined && typeof(addedNode.id)==="string" && addedNode.id.startsWith("tab-notebook")){
                                try{
                                    setTimeout(bindClick, 300, addedNode);
                                }catch(err){
                                    console.log("执行错误");
                                }
                            }

                            if(addedNode.textContent.startsWith("Total") || addedNode.textContent==="No Data"){
                                // 最多遍历30层，找到就停
                                var parents = getParentNode(addedNode, 30);

                                console.log(parents);

                                var paneId = parents.id;
                                var tabId = paneId.replace("pane", "tab");
                                var jobTitle = document.getElementById(tabId).textContent.replace(".bznb", "")
                                console.log(jobTitle);

                                var status=sessionStorage.getItem(tabId);

                                console.log(tabId+": "+status);

                                if(status==="2"){
                                    var noticeFlag = true;

                                    let myMap = getIdMap(NO_NOTICE_MAP);
                                    if(myMap.get(paneId.split("_")[1])){
                                        noticeFlag = false;
                                        break;
                                    }
                                    console.log("finished");
                                    sessionStorage.setItem(tabId, 0);
                                    console.log(sessionStorage.getItem(tabId));

                                    if(noticeFlag){
                                        const taskid = Math.round(new Date());
                                        sessionStorage.setItem(taskid, "0");
                                        var nCount = localStorage.getItem(NOTICE_COUNT_STR);
                                        if(nCount === null || nCount === undefined){
                                            nCount = 1;
                                        }
                                        sendNotify(jobTitle, nCount, taskid);
                                    }
                                }

                            }

                        }

                    }
                }
            }
        }
    });

    // 开始观察指定的元素及其子元素的变化
    observer.observe(document.body, {
        childList: true, // 监听子元素的变化
        subtree: true, // 监听后代元素的变化
        characterData: true // 监听字符数据的变化
    });

    function getIdMap(mapKey){
        let myMap = new Map();
        let localMap = localStorage.getItem(mapKey);
        if(localMap!==null){
            myMap = new Map(JSON.parse(localMap));
        }
        return myMap;
    }

    // 向上n级，查找父元素中含指定id的元素
    function getParentNode(element, level) {
        if (level === 0 || element.parentNode === null || (typeof(element.id)==="string" && element.id.startsWith("pane-notebook"))) {
            console.log("notebook id: "+element.id);
            return element;
        } else {
            // 递归地调用自身，将层级数减1，并将父元素作为新的起始点
            return getParentNode(element.parentNode, level - 1);
        }
    }

    // 发送通知
    function sendNotify(message, nCount, taskid){
        nCount--;
        var clicked=sessionStorage.getItem(taskid);
        var noticeInterval = localStorage.getItem(NOTICE_INTERVAL_STR);

        console.log(clicked, nCount);
        if(clicked==="0" && nCount>=0){
            notify(message, taskid);
            setTimeout(sendNotify, noticeInterval*60000, message, nCount, taskid);
        }
    }

    // 真正通知
    function notify(message, taskid) {
        console.log("start notify");
        var noticeDuration = localStorage.getItem(NOTICE_DURATION_STR)*1000;
        console.log("start "+noticeDuration);

        GM_notification({
            title: "脚本：《"+message+"》",
            text: "Finished",
            image: 'https://mall-006.oss-cn-shanghai.aliyuncs.com/favicon.png',
            timeout: noticeDuration,
            silent: true,
            ondone: ()=>{
                sessionStorage.setItem(taskid, "1");
                console.log("ondone");
            },
            onclick: ()=>{
                sessionStorage.setItem(taskid, "1");
                console.log("click");
            }
        })
    }


    // 下载文件API
    function saveFile(fileName, content){
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);
    }

})();