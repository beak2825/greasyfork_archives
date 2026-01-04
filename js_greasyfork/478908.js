// ==UserScript==
// @name         RalphScript
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Ralph 私人自用脚本
// @author       Ralph
// @match        https://fsm.name/Torrents*
// @match        https://fsm.name/Torrents/new##autoFill
// @match        https://et8.org/upload.php*
// @match        https://www.yangshipin.cn/video/home*
// @match        https://www.hifini.com/thread-*
// @match        https://hifini.lanzn.com/*
// @match        https://hifini.lanzouv.com/*
// @match        https://www.subtitlecat.com/subs*
// @match        https://www.subtitlecat.com/index.php?search=*
// @match        https://lemonhd.club/upload.php*
// @match        https://115.com/*password*
// @match        https://anxia.com/*password*
// @match        https://hhanclub.top/details.php*
// @match        https://pterclub.com/usercp.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunxuetang.cn
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/478908/RalphScript.user.js
// @updateURL https://update.greasyfork.org/scripts/478908/RalphScript.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var url = window.location.href //网页url
    // fsm增加发布按钮
    if (url.includes('https://fsm.name/Torrents')){
        fsmTorrentList()
    }
    // tccf发布种子
    if (url.includes('https://et8.org/upload.php')){
        var urlArr = url.split('#')
        if (urlArr.length > 1){
            tccfScript(urlArr[1])
        }else{
            console.log('无参数，跳过')
        }
    }
    // 央视频增加豆瓣搜索与tccf搜索功能
    if (url.includes('yangshipin.cn/video')){
        yangshipingScript()
    }
    // qb种子筛选
    if (url.includes("http://192.168.1.105:8890")){
        addBtn();
    }
    // 音乐论坛-自动回复
    if (url.includes("www.hifini.com/thread")){
        autoReply();
    }
    // 音乐论坛-网盘自动填充密码
    if (url.includes("hifini.lanzn.com") || url.includes("hifini.lanzouv.com")){
        lanznAutoFull(url.split("##")[1]);
    }
    // 字幕下载
    if (url.includes("https://www.subtitlecat.com/index.php?search=")){
        subtitle(url.split("search=")[1]);
    }
    // 字幕下载2
    if (url.includes("www.subtitlecat.com/subs")){
        subtitle2(url.split("##")[1]);
    }
    // 15分享链接
    if ((url.startsWith('https://115.com') || url.startsWith('https://anxia.com')) && url.includes("password")){
        setInterval(function() {
            let topImg = document.getElementById("js_common_sharing_banner2")
            let topImg1 = document.getElementById("js_common_sharing_banner")
            let bottomFlow = document.getElementsByClassName("bottom-vflow")[2]
            let bottomFlow1 = document.getElementsByClassName("bottom-vflow")[1]
            if (topImg != undefined){
                topImg.remove()
                bottomFlow.remove()
            }
            if (topImg1 != undefined){
                topImg1.remove()
                bottomFlow1.remove()
            }
        }, 1000);
    }
    // HH to 柠檬
    if (url.startsWith('https://hhanclub.top/details.php')){
        hhToLen()
    }
    // PTGen
    if (url.startsWith('https://pterclub.com/usercp.php?action=personal#ptgen')){
        ptGen()
    }
})();

function ptGen(){
    checkElement("#go_ptgen").then(function(button) {
        button.click()
        // 复制按钮
        var newButton = button.cloneNode(true);
        newButton.id = 'newButton';
        newButton.innerText = '复制';
        newButton.value = '复制'

        // 修改样式，使新按钮位于原按钮右边
        newButton.style.marginLeft = '10px';

        newButton.addEventListener('click', function() {
            var contentToCopy = document.getElementsByName('douban_info')[0].value;
            console.log(contentToCopy)
            var tempInput = document.createElement('textarea');
            tempInput.value = contentToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('内容已复制到粘贴板!')
            window.close();
        });

        // 将新按钮添加到原按钮的父元素中，放置在原按钮右边
        button.parentNode.insertBefore(newButton, button.nextSibling);
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

function hhToLen(){
// 创建按钮
    var button = document.createElement('button');
    button.innerText = '转载柠檬';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    // 添加按钮点击事件
    button.addEventListener('click', function() {
        document.querySelector('#ptgen').click()
        document.querySelector('#LemonHD').click()
        window.close();
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
}

function fsmTorrentList(){
    checkElement("button.el-button.el-button--primary").then(function(button) {
        let newButton = button.cloneNode(true)
        newButton.innerHTML ="自动填充";
        newButton.addEventListener("click",function(){
            window.open("https://fsm.name/Torrents/new##autoFill")
        });
        button.parentNode.insertBefore(newButton, button.nextSibling);
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

function subtitle2(code){
    checkElement("#download_zh-CN").then(function(download) {
        var suffix = download.href.substring(download.href.lastIndexOf("."));
        download.setAttribute('download',code + suffix);
        download.click();
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

function subtitle(code){
    checkElement("#search").then(function(search) {
        let trList = document.getElementsByClassName("table sub-table")[0].getElementsByTagName("tr");
        for (let i = 0; i < trList.length; i++){
            let item = trList[i]
            if (item.innerText.includes(code) || item.innerText.includes(code.toLowerCase())){
                console.log(item)
                let jumpUrl = item.getElementsByTagName("a")[0].href + '##' + code;
                window.location.href = jumpUrl;
                break;
            }
        }
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

// 音乐论坛-网盘自动填充密码
function lanznAutoFull(fullCode){
    console.log(fullCode)
    checkElement("#pwd").then(function(input) {
        input.value = fullCode
        return checkElement(".passwddiv-btn")
    }).then(function(messageElement) {
        messageElement.click()
    }).catch(function(error) {
        console.error('An error occurred:', error);
    });
}

// 音乐论坛-自动回复
function autoReply(){
    checkElement(".alert.alert-warning").then(function(hideElement) {
        var sourceButton = document.getElementsByClassName("post_reply btn btn-outline-secondary")[0]
        var myButton = sourceButton.cloneNode(true);
        myButton.innerHTML ="回复";
        myButton.disabled = false;
        myButton.addEventListener("click",function(){
            if (hideElement.textContent.includes("本帖含有隐藏内容")){
                checkElement("#message").then(function(messageElement) {
                    messageElement.value = "感谢分享"
                    return checkElement("#submit");
                }).then(function(submitElement){
                    submitElement.click()
                }).catch(function(error) {
                    console.error('An error occurred:', error);
                });
            }
        });
        sourceButton.parentNode.insertBefore(myButton, sourceButton.nextSibling);
    })
    checkElement(".alert.alert-success").then(function(hideElement) {
        var sourceButton = document.getElementsByClassName("post_reply btn btn-outline-secondary")[0]
        var myButton = sourceButton.cloneNode(true);
        myButton.innerHTML ="跳转";
        myButton.disabled = false;
        myButton.addEventListener("click",function(){
            let listDocument = document.getElementsByClassName("alert alert-success")
            if (listDocument.length>1){
                let target = listDocument[1]
                let tempStr = ""
                for (let i =0; i < target.getElementsByTagName("span").length; i++){
                    let tempTag = target.getElementsByTagName("span")[i]
                    let tagStype = window.getComputedStyle(tempTag).getPropertyValue('display')
                    if (tagStype == "inline"){
                        tempStr+=tempTag.textContent
                    }
                }
                let jumpUrl = target.getElementsByTagName("a")[0].href
                jumpUrl += "##"+ tempStr
                window.open(jumpUrl)
            }
        });
        sourceButton.parentNode.insertBefore(myButton, sourceButton.nextSibling);
    })
}

// qb添加按钮
function addBtn(){
    var intervalId = setInterval(() => {
        var btnDiv = document.getElementById('mochaToolbar')
        if (btnDiv){
            clearInterval(intervalId);
            var myButton = document.createElement("button");
            myButton.innerHTML ="查找";
            myButton.disabled = false;
            myButton.addEventListener("click",function(){
                qbFilter()
            });
            btnDiv.appendChild(myButton);
        }
    })
}

// qb筛选
function qbFilter(){
    var intervalId = setInterval(() => {
        var rows = document.getElementsByClassName("torrentsTableContextMenuTarget")
        if (rows.length>0){
            clearInterval(intervalId);
            var contentCounts = {}; // 用于跟踪内容出现次数的对象
            for (var i = 0; i < rows.length; i++) {
                var tdTag = rows[i].getElementsByTagName("td")[2].innerText
                // 如果内容已经存在于 contentCounts 中，则增加计数
                if (contentCounts[tdTag]) {
                    contentCounts[tdTag]++;
                } else {
                    // 如果内容不存在，则添加到 contentCounts 并初始化为 1
                    contentCounts[tdTag] = 1;
                }
            }
            // 再次遍历所有行，这次是为了修改背景色
            for (var j = 0; j < rows.length; j++) {
                var tdTag1 = rows[j].getElementsByTagName("td")[2]
                var tdTagStr = tdTag1.innerText
                // 如果内容只出现一次，则修改背景色为蓝色
                if (contentCounts[tdTagStr] === 1) {
                    tdTag1.style.backgroundColor = '#C8D4B1'; // 修改背景色为蓝色
                }
            }
        }
    })
}

// 央视频脚本
function yangshipingScript(){
    var intervalId = setInterval(() => {
        var videoNameTag = document.getElementsByClassName("video-main-l-title")[0]
        if (videoNameTag){
            var videoName = videoNameTag.innerText
            videoName = videoName.replace('（4K）','')
            // 豆瓣查询按钮
            var myButton = document.createElement("button");
            myButton.innerHTML ="豆瓣 ";
            myButton.disabled = false;
            myButton.style.cssText = "background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;margin-left:10px";
            myButton.addEventListener("click",function(){
                window.open('https://search.douban.com/movie/subject_search?search_text=' + videoName);
            });
            videoNameTag.appendChild(myButton);
            // tccf查询按钮
            var myButton1 = document.createElement("button");
            myButton1.innerHTML =" TCCF";
            myButton1.disabled = false;
            myButton1.style.cssText = "background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;margin-left:10px";
            myButton1.addEventListener("click",function(){
                window.open("https://et8.org/torrents.php?incldead=1&spstate=0&inclbookmarked=0&search_area=0&search_mode=0&search=" + videoName);
            });
            videoNameTag.appendChild(myButton1);
            // 复制基本信息
            var myButton2 = document.createElement("button");
            myButton2.innerHTML =" COPY";
            myButton2.disabled = false;
            myButton2.style.cssText = "background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;margin-left:10px";
            myButton2.addEventListener("click",function(){
                let tempUrl = window.location.href //网页url
                // 使用 URLSearchParams 解析 URL 查询参数
                const urlSearchParams = new URLSearchParams(tempUrl.split('?')[1]);
                // 获取 cid 的值
                const cid = urlSearchParams.get('cid');
                let resStr = "cid = '" + cid + "'\nmain_name = '" + videoName + "'"
                copyText(resStr,videoNameTag);
                console.log(resStr)
            });
            videoNameTag.appendChild(myButton2);
            clearInterval(intervalId);
        }
    }, 1000);
}

function copyText(text,videoNameTag) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    videoNameTag.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    videoNameTag.removeChild(textArea);
}

// tccf脚本
function tccfScript(urlArr){
    // 使用atob()函数解码Base64字符串
    var decodedBytes = atob(urlArr);
    // 将解码后的字节转换为字符串（UTF-8编码）
    // 注意：这里我们使用了一个简单的方法将bytes转换为字符串，它可能不适用于所有情况。
    // 对于更复杂的场景，你可能需要编写一个更健壮的函数来处理字节转换。
    var decodedString = String.fromCharCode.apply(null, decodedBytes.split('').map(function(c) {
        return c.charCodeAt(0);
    }));
    // 解析JSON字符串以获取原始对象
    var tccfJson = JSON.parse(decodedString);
    console.log("输入的json：" + tccfJson)
    // 主标题
    document.getElementById('name').value = tccfJson.mainTitle
    // 副标题
    document.getElementsByName('small_descr')[0].value = tccfJson.secTitle
    // imdb链接
    document.getElementsByName('url')[0].value = tccfJson.imdbUrl
    // 先选中bbcode
    document.querySelector("#compose > table > tbody > tr:nth-child(7) > td.rowfollow > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > div.wysibb-toolbar > div.wysibb-toolbar-container.modeSwitch > div").click()
    // 简介
    document.querySelector("#descr").value = tccfJson.description
    // imdb链接
    document.getElementsByName('url')[0].value = tccfJson.imdbUrl
    // 类型
    document.getElementById('browsecat').value = tccfJson.type
    // 次类型
    document.getElementsByName('source_sel')[0].value = tccfJson.secType
    // 媒介
    document.getElementsByName('medium_sel')[0].value = tccfJson.media
    // 编码
    document.getElementsByName('codec_sel')[0].value = tccfJson.encode
    // 音频编码
    document.getElementsByName('audiocodec_sel')[0].value = tccfJson.audioEncode
    // 分辨率
    document.getElementsByName('standard_sel')[0].value = tccfJson.standardSel
    // 制作组
    document.getElementsByName('team_sel')[0].value = tccfJson.teamSel
    // 匿名
    document.getElementsByName('uplver')[0].checked = true
}

// 定义一个检查元素存在的函数
function checkElement(selector) {
    return new Promise(function(resolve, reject) {
        var interval = setInterval(function() {
            if (document.querySelector(selector)) {
                clearInterval(interval); // 如果找到了元素，清除定时器
                GM_log("成功找到元素" + selector)
                resolve(document.querySelector(selector)); // 返回找到的元素
            }
        }, 500); // 每500ms检查一次
    });
}