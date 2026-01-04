// ==UserScript==
// @name         Fanbox图片下载器
// @name:en      Fanbox Downloader
// @namespace    http://tampermonkey.net/
// @namespace    https://github.com/709924470/pixiv_fanbox_downloader
// @version      1.0.0
// @description  Download Pixiv Fanbox Images.
// @description:en  Download Pixiv Fanbox Images.
// @author       rec_000@126.com
// @include      /^https?:\/\/(.+?\.)?fanbox\.cc\/(@.+\/)?posts\/\d+/
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/380615/Fanbox%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/380615/Fanbox%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dlList = [];
    var guardObserver = new MutationObserver(guardingObserver);
    var guardState = true;
    var scriptState = false;
    var observer = new MutationObserver(rootObserver);
    function guardingObserver(mu){
        mu.forEach((m) => {
            try{
                observer.observe(document.getElementById("root"), { childList: true });
            }catch(err){}
        });
    };
    guardObserver.observe(document.body, {childList:true,subtree:true});
    setTimeout(() => mainFunc(null), 5000);
    window.forceAddbutton = mainFunc;
    var observeFlag = false;
    var lastLoc = window.location.href;
    var enableZip = true, enableSingle = true, nameformat = "$title-", auto = false;
    var count = 0, downloaded = 0;
    var zip;
    var timeoutBackup;
    var addFile = (name, content) => zip.file(name, content);
    var generateName = (name, url) => name + ( "_" + count++ ) + "." + url.split(".")[url.split(".").length - 1];
    function rootObserver(mutations) {
        guardState = false;
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++){
                if (window.location.href !== lastLoc){
                    console.log("[Fanbox Downloader.js] Page refresh detected.");
                    lastLoc = window.location.href;
                    if (lastLoc.match(/https?:\/\/(www\.)?fanbox\.cc\/\@.+?\/posts\/\d+/) === null){
                        console.log("[Fanbox Downloader.js] Not post page.");
                        return;
                    }
                    observeFlag = false;
                    timeoutBackup = setInterval(function(){
                        if(!observeFlag){
                            [...document.querySelectorAll("button")].forEach(
                                function(e){
                                    if(e.innerHTML.includes("svg")){
                                        observeFlag = mainFunc(e);
                                        if(observeFlag){
                                            console.log("[Fanbox Downloader.js] Backup function working...");
                                            clearInterval(timeoutBackup);
                                        }
                                    }
                                }
                            );
                        }else{
                            clearInterval(timeoutBackup);
                        }
                    }, 1000);
                }
                if(!observeFlag){
                    observeFlag = mainFunc(null);
                    observer.observe(mutation.addedNodes[i],
                        {
                            childList: true,
                            characterData: true, 
                            subtree: true
                        });
                }else{
                    break;
                }
            }
        });
    }
    function checkIsSub(){
        return document.evaluate("//article//a[contains(@href, 'plans')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength == 0;
    }
    function mainFunc(btn){
        initSettings();
        if (scriptState){
            return;
        }
        zip = new JSZip();
        count = 0;
        var button = null;
        for (var c = 0; c < 10 && button === null; c++){
            button = document.evaluate('//*[@id="root"]/div[5]/div[1]/div/div[3]/div/div/div[1]/div/div[' + c + ']/div/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            button = button.singleNodeValue;
        }
        if(!checkIsSub()){
            console.error("[Fanbox Downloader.js] Cannot add download button! REASON=\"NOT_IN_FAN_PLAN\"");
            return false;
        }
        if ((button === null && btn === null)){
            console.error("[Fanbox Downloader.js] Cannot add download button! Attempting to use backup function.");
            var svgs = document.getElementsByTagName("svg");
            [...svgs].forEach((item) => {
                var parentNode = item.parentNode;
                while (parentNode.tagName.toLowerCase() != "button"){
                    if(parentNode.tagName.toLowerCase() == "body"){
                        return;
                    }
                    parentNode = parentNode.parentNode;
                }
                button = parentNode;
            });
            if(button === null){
                console.error("[Fanbox Downloader.js] Cannot add download button!");
            }
        }else if(button !== null || btn !== null){
            button = button ? button : btn;
        }
        if(getAllImageUrl().length == 0){
            console.warn("[Fanbox Downloader.js] No image found, not adding buttons.");
            return false;
        }
        scriptState = true;
        if(auto){
            if(enableZip){
                downloadImages_ZIP(...getAllImageUrl());
            }else{
                downloadImages(...getAllImageUrl());
            }
        }
        console.log("[Fanbox Downloader.js] Successfully added the button.");

        var p = document.createElement("p");

        var newButton = document.createElement("button");
        button.classList.forEach(function(item){
            newButton.classList.add(item);
        });
        newButton.id = "dl_images";
        newButton.innerText = "下载图片\nDirect download";
        newButton.onclick = function(){
            downloadImages(...getAllImageUrl());
        };
        p.appendChild(newButton);
        p.appendChild(document.createElement("br"));
        var zipButton = document.createElement("button");
        button.classList.forEach(function(item){
            zipButton.classList.add(item);
        });
        zipButton.id = "dl_zip";
        zipButton.innerText = "打包下载\nDownload as Zip";
        zipButton.onclick = function(){
            var content = document.evaluate('//*[@id="root"]/div[5]/div[1]/div/div[3]/div/div[1]/div/article', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            content = content?.singleNodeValue || document.createElement("article");
            addFile("description.txt", content?.innerText || "");
            downloadImages_ZIP(...getAllImageUrl());
        };
        p.appendChild(zipButton);
        p.oncontextmenu = function(e){
            createSettingsPopup();
            e.preventDefault();
        };
        button.parentNode.appendChild(p);
        return true;
    }
    function downloadImages(...urls){
        if(!checkIsSub()){
            alert("t5RIf eB1rsCBus Ot D3En UOy");
            return "Why are you even thinking about download files for free???";
        }
        var name = formatName();
        urls.forEach(function(url){
            forceDownload(url,generateName(name, url),false);
        });
        return undefined;
    }
    function downloadImages_ZIP(...urls){
        if(!checkIsSub()){
            alert("t5RIf eB1rsCBus Ot D3En UOy");
            return "Why are you even thinking about download these files free???";
        }
        var i = 0, name = formatName();
        urls.forEach(function(url){
            if(url === undefined){
                console.warn("undefined url! > [" + i + "]" , urls);
                i++;
                return;
            }
            forceDownload(url,generateName(name, url),true);
            i++;
        });
        return undefined;
    }

    function formatName(){
        var scripts = document.getElementsByTagName("SCRIPT");
        var data = undefined;
        [...scripts].forEach((v, i) => {
            if(v.type.indexOf("json") != -1){
                data = eval(v.innerText)[0];
            }
        });
        var dict = {
            "$title": document.title.split("｜")[0],
            "$author": document.title.split("｜")[1],
            "$userid": location.href.split("/")[location.href.split("/").length - 3],
            "$createdate": data === undefined ? new Date().getTime() : data["datePublished"],
            "$editdata": data === undefined ? new Date().getTime() : data["dateModified"],
        };
        var result = nameformat;
        for(var i in dict){
            if(nameformat.indexOf(i) != -1){
                result = result.replace(i, dict[i]);
            }
        }
        return result.replace("/", "_");
    }

    function initSettings(){
        enableZip = GM_getValue("ZIP", true);
        enableSingle = GM_getValue("Single", true);
        nameformat = GM_getValue("NameFormat", nameformat);
        auto = GM_getValue("Auto", false);

        GM_setValue("ZIP", enableZip);
        GM_setValue("Single", enableSingle);
        GM_setValue("NameFormat", nameformat);
        GM_setValue("Auto", auto);
    }

    function createSettingsPopup(){
        if (document.getElementById("settings-style") !== null){
            var panel = document.getElementById("settings");
            panel.style.display = "block";
            return;
        }

        var style = document.createElement("style");
        style.id = "settings-style";
        style.innerHTML = `.settings {
            display: none;
            position: fixed;
            z-index: 1;
            padding-top: 100px;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
          }
          .settings-content {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            border-radius: 5px;
            width: 60%;
          }
          .close {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }
          .close:hover,
          .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
          }`;
        document.body.appendChild(style);

        var panel = document.createElement("div");
        panel.className = "settings";
        panel.id = "settings";
        panel.style.display = "block";

        window.onclick = (e) => {
            if (e.target.id == "settings"){
                document.getElementById("settings").style.display = "none";
            }
        };

        var content = document.createElement("div");
        content.className = "settings-content";
        panel.appendChild(content);

        var close = document.createElement("span");
        close.className = "close";
        close.innerHTML = "&times;";
        close.onclick = (e) => {document.getElementById("settings").style.display = "none";};
        content.appendChild(close);

        content.innerHTML += `<p><h2>Fanbox downloader settings 设置</h2></p>
        <p><input type="checkbox" id="auto" unchecked>
        <label for="auto">自动下载 / Auto download</label></p>
        <p style="padding-left: 2em;"><input type="radio" id="auto-single" value="single" disabled>
        <label for="auto-single">自动单张下载 / Automatically download as single Images</label></p>
        <p style="padding-left: 2em;"><input type="radio" id="auto-zip" value="zip" disabled checked>
        <label for="auto-zip">自动打包下载 / Automatically download as packed Zip file</label></p>
        <p><br><label for="format">命名格式 / File name format</label>
        <input type="text" id="format">
        <br><br> "$title" = 标题&nbsp;&nbsp;&nbsp;&nbsp;"$author" = 作者名&nbsp;&nbsp;&nbsp;&nbsp;"$userid" = 用户ID
        <br><br> "$createdate" = 创建日期&nbsp;&nbsp;&nbsp;&nbsp;"$editdata" = 修改日期</p><p></p>`;

        var save = document.createElement("button");
        save.innerText = "Save 保存设置";
        
        content.appendChild(save);
        document.body.appendChild(panel);

        document.getElementById("format").value = nameformat;

        save.onclick = (e) => {
            auto = document.getElementById("auto").checked;
            enableZip = document.getElementById("auto-zip").checked;
            enableSingle = document.getElementById("auto-single").checked;
            nameformat = document.getElementById("format").value;
            GM_setValue("ZIP", enableZip);
            GM_setValue("Single", enableSingle);
            GM_setValue("NameFormat", nameformat);
            GM_setValue("Auto", auto);
            alert("设置成功\nSaved.");
            document.getElementById("settings").style.display = "none";
        };

        document.getElementById("auto").onchange = (e) => {
            if(e.target.checked){
                document.getElementById("auto-single").disabled = false;
                document.getElementById("auto-zip").disabled = false;
            }else{
                document.getElementById("auto-single").disabled = true;
                document.getElementById("auto-zip").disabled = true;
            }
        }
    }

    function getAllImageUrl(){
        var elements = document.querySelectorAll("a[rel] > div > img");
        var result = [];
        for(var i = 0; i < elements.length; i++){
            result.push(elements[i].parentNode.parentNode.getAttribute("href"));
        }
        return result;
    }
    function forceDownload(url, fileName,zipFlag){
        if(dlList.includes(fileName)){
            return;
        }
        dlList.push(fileName);
        console.log("[Fanbox Downloader.js] Downloading " + fileName);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            binary: true,
            responseType: "blob",
            onload: function(response) {
                console.log("[Fanbox Downloader.js] Downloaded " + fileName);
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(response.response);
                if(!zipFlag){
                    var tag = document.createElement('a');
                    tag.href = imageUrl;
                    tag.download = fileName;
                    document.body.appendChild(tag);
                    tag.click();
                    document.body.removeChild(tag);
                    return;
                }
                addFile(fileName,response.response);
                downloaded++;
                if(dlList.length == downloaded){
                    zip.generateAsync({type:'blob'}).then(function(blob){
                        var imageUrl = urlCreator.createObjectURL(blob);
                        var tag = document.createElement('a');
                        tag.href = imageUrl;
                        tag.download = formatName() + ".zip";
                        document.body.appendChild(tag);
                        tag.click();
                        document.body.removeChild(tag);
                    });
                }
            },
            onprogress: function (e) {
                if(e.callengthComputable){
                    var ratio = Math.floor((e.loaded / e.total) * 100) + '%';
                    console.log("[Fanbox Downloader.js] " + fileName + " > " + ratio);
                    return;
                }
                console.log("[Fanbox Downloader.js] " + fileName + " downloaded " + (e.loaded / 1024).toFixed(3) + "kB (No total length found)");
            },
            onerror: function(e){
                console.error("[Fanbox Downloader.js] Failed downloading file " + fileName);
            },
        });
    }
})();
