// ==UserScript==
// @name         liblib助手
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  liblib助手，下载作者例图、返图、生成信息
// @author       kaiery
// @match        https://www.liblib.ai/modelinfo/*
// @match        https://www.liblib.art/modelinfo/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/487166/liblib%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/487166/liblib%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // 定义全局变量
    var modelDir;
    var textDesc, uuid, buildId, webid, modelId, modelName, modelVersionId, downloadUrl;
    var page = 1;
    var pageSize = 16;
    var sortType = 0;
    const default_download_pic_num = 100;

    // ---------------------------------------------------------------
    // demo
    // ---------------------------------------------------------------
    async function createDirectory() {
        // open directory picker
        const dirHandle = await window.showDirectoryPicker({mode:"readwrite"});
        // create a new directory named 'newDir'
        const newDirHandle = await dirHandle.getDirectoryHandle('newDir', {create: true});
        console.log(newDirHandle);
    }


    // ---------------------------------------------------------------
    // html转文本
    // ---------------------------------------------------------------
    function htmlToText(html) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        var text = '';
        for (var i = 0; i < tempDiv.childNodes.length; i++) {
            if (tempDiv.childNodes[i].nodeName === 'P') {
                text += tempDiv.childNodes[i].textContent + '\n';
            }
        }
        return text;
    }
    // ---------------------------------------------------------------
    // 保存作者图片信息
    // ---------------------------------------------------------------
    async function saveAuthImagesInfo() {
        var modelType = 1; // 1:CheckPoint 2:embedding；3：HYPERNETWORK ；4：AESTHETIC GRADIENT; 5：Lora；6：LyCORIS;  9:WILDCARDS
        var hasTriggerWord = false;

        // open directory picker
        const dirHandle = await window.showDirectoryPicker({mode:"readwrite"});

        // 根据选项卡获取模型版本id
        const div = document.querySelector('.ant-tabs-tab.ant-tabs-tab-active');
        const modelVersionId = parseInt(div.getAttribute('data-node-key'));
        const modelVer = div.innerText.replace(/ /g, "").replace(/[/\\?%*:|"<>]/g, '');

        var allElements = document.querySelectorAll('div');
        allElements.forEach(function(element) {
            var classNames = element.className.split(/\s+/);
            for (var i = 0; i < classNames.length; i++) {
                if (classNames[i].startsWith('ModelDescription_desc')) {
                    textDesc = htmlToText(element.innerHTML);
                    textDesc = textDesc.replace(/\\n/g, '\n');
                    break;
                }
            }
        });
        if(textDesc){
            // Get the content of the script element
            var scriptContent = document.getElementById('__NEXT_DATA__').textContent;
            var scriptJson = JSON.parse(scriptContent);

            // Extract uuid, buildId, and webid
            uuid = scriptJson.query.uuid;
            buildId = scriptJson.buildId;
            webid = scriptJson.props.webid;
            //------------
            // 预请求地址
            var url_acceptor = "https://liblib-api.vibrou.com/api/www/log/acceptor/f";
            // 模型信息地址
            var url_model = "https://liblib-api.vibrou.com/api/www/model/getByUuid/" + uuid;


           // 发送预请求-------------------------------------------------------
            const resp_acc = await fetch(url_acceptor, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({timestamp: Date.now()})
            })

            // 发送模型信息
            const resp = await fetch(url_model, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({timestamp: Date.now()})
            })

            const model_data = await resp.json();
            // console.log("----------模型信息-----------");
            // console.log(model_data);

            if(model_data.code!==0){ return;}

            modelId = model_data.data.id
            modelName = model_data.data.name.replace(/ /g, "").replace(/[/\\?%*:|"<>]/g, '');
            modelDir = modelName;
            modelName = modelDir+"_"+modelVer;
            if(modelName.slice(-1)==='.'){
                modelName = modelName.substring(0, modelName.length -1);
            }
            modelType = model_data.data.modelType // 1:CheckPoint 2:embedding；3：HYPERNETWORK ；4：AESTHETIC GRADIENT; 5：Lora；6：LyCORIS;  9:WILDCARDS

            var modelTypeName = '未分类'
            switch (modelType){
                case 1:
                    modelTypeName = 'CheckPoint'
                    hasTriggerWord = false
                    break;
                case 2:
                    modelTypeName = 'embedding'
                    hasTriggerWord = true
                    break;
                case 3:
                    modelTypeName = 'HYPERNETWORK'
                    hasTriggerWord = true
                    break;
                case 4:
                    modelTypeName = 'AESTHETIC GRADIENT'
                    hasTriggerWord = true
                    break;
                case 5:
                    modelTypeName = 'Lora'
                    hasTriggerWord = true
                    break;
                case 6:
                    modelTypeName = 'LyCORIS'
                    hasTriggerWord = true
                    break;
                case 9:
                    modelTypeName = 'WILDCARDS'
                    hasTriggerWord = true
                    break;
            }

            // console.log(modelDir+"/"+modelName);

            const versions = model_data.data.versions;
            for (const verItem of versions){
                // 匹配版本号
                if(verItem.id === modelVersionId){

                    // 模型信息json信息
                    var modelInfoJson = {
                        modelType:modelTypeName,
                        description: textDesc,
                        uuid: uuid,
                        buildId: buildId,
                        webid: webid
                    };

                    var triggerWord = '无';
                    if(hasTriggerWord){
                        if('triggerWord' in verItem && verItem.triggerWord){
                           triggerWord = verItem.triggerWord
                           modelInfoJson.triggerWord = triggerWord
                        }
                    }


                    // 创建模型目录
                    const modelDirHandle = await dirHandle.getDirectoryHandle(modelDir, {create: true});
                    // 创建模型版本目录
                    const modelVerDirHandle = await modelDirHandle.getDirectoryHandle(modelName, {create: true});
                    // 获取文件句柄
                    const savejsonHandle = await modelDirHandle.getFileHandle(modelName+".json", { create: true });
                    // 写入模型信息json文件
                    const writablejson = await savejsonHandle.createWritable();
                    await writablejson.write(JSON.stringify(modelInfoJson));
                    await writablejson.close();


                    const authImages = verItem.imageGroup.images;
                    let isCover = false;
                    const numberInput1 = document.getElementById('numberInput1');
                    numberInput1.setAttribute('value', authImages.length);
                    numberInput1.dispatchEvent(new Event('change'));

                    var count = 0;
                    for(const authImage of authImages){
                        const authImageUrl = authImage.imageUrl;
                        var authimageName = authImage.id;
                        var authimageExt = authImageUrl.split("/").pop().split(".").pop();
                        var tmp = authimageExt.indexOf("?");
                        if (tmp>0){
                            authimageExt = authimageExt.substring(0,tmp);
                        }

                        const authImageUuid = authImage.uuid;

                        if(!isCover){
                            // 下载封面图片
                            isCover = true;
                            // 下载图片
                            const resp_download = await fetch(authImageUrl);
                            const blob = await resp_download.blob();
                            // 获取文件句柄
                            const picHandle = await modelDirHandle.getFileHandle(modelName+"."+authimageExt, { create: true });
                            // 写入图片
                            const writable = await picHandle.createWritable();
                            await writable.write(blob);
                            await writable.close();
                        }



                        // 下载图片
                        const resp_download = await fetch(authImageUrl);
                        const blob = await resp_download.blob();
                        // 获取文件句柄
                        const picHandle = await modelVerDirHandle.getFileHandle(authimageName+"."+authimageExt, { create: true });
                        // 写入图片
                        const writable = await picHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();

                        // 查看图片生成信息地址
                        var url_img_generate = "https://liblib-api.vibrou.com/api/www/img/generate/"+authImageUuid+"?timestamp="+Date.now();
                        // 请求图片生成信息
                        const response_img_gen = await fetch(url_img_generate, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        const data_img_gen = await response_img_gen.json();
                        if(data_img_gen.code===0){
                            var metainformation = data_img_gen.data.metainformation;
                            if(!metainformation){
                                metainformation = 'prompt:'+data_img_gen.data.prompt +"\n";
                                metainformation = metainformation + 'negativePrompt:'+data_img_gen.data.negativePrompt +"\n";
                                metainformation = metainformation + 'modelNames:'+data_img_gen.data.modelNames +"\n";
                                metainformation = metainformation + 'seed:'+data_img_gen.data.seed +"\n";
                                metainformation = metainformation + 'samplingMethod:'+data_img_gen.data.samplingMethod +"\n";
                                metainformation = metainformation + 'samplingStep:'+data_img_gen.data.samplingStep +"\n";
                                metainformation = metainformation + 'cfgScale:'+data_img_gen.data.cfgScale +"\n";
                            }
                            // console.log(metainformation);
                            // 获取文件句柄
                            const savefileHandle = await modelVerDirHandle.getFileHandle(authimageName+".json", { create: true });
                            // 写入文件
                            const writablefile = await savefileHandle.createWritable();
                            await writablefile.write(metainformation);
                            await writablefile.close();
                        }
                        count++;
                        const numberInput1 = document.getElementById('numberInput1');
                        numberInput1.setAttribute('value', authImages.length-count);
                        numberInput1.dispatchEvent(new Event('change'));
                    }
                }
            }
        }
        alert("作者图例信息下载完成");
    }

    // ---------------------------------------------------------------
    // 保存返图信息
    // ---------------------------------------------------------------
    async function saveReturnImagesInfo() {
        // open directory picker
        const dirHandle = await window.showDirectoryPicker({mode:"readwrite"});

        // 根据选项卡获取模型版本id
        const div = document.querySelector('.ant-tabs-tab.ant-tabs-tab-active');
        const modelVersionId = parseInt(div.getAttribute('data-node-key'));
        const modelVer = div.innerText.replace(/ /g, "").replace(/[/\\?%*:|"<>]/g, '');

        // Get the content of the script element
        var scriptContent = document.getElementById('__NEXT_DATA__').textContent;
        var scriptJson = JSON.parse(scriptContent);

        // Extract uuid, buildId, and webid
        uuid = scriptJson.query.uuid;
        //------------
        // 预请求地址
        var url_acceptor = "https://liblib-api.vibrou.com/api/www/log/acceptor/f";
        // 模型信息地址
        var url_model = "https://liblib-api.vibrou.com/api/www/model/getByUuid/" + uuid;
        // 评论列表地址
        var url_community = "https://liblib-api.vibrou.com/api/www/community/returnPicList?timestamp="+Date.now();

        // 发送预请求-------------------------------------------------------
        const resp_acc = await fetch(url_acceptor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({timestamp: Date.now()})
        })

        // 发送模型信息
        const resp = await fetch(url_model, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({timestamp: Date.now()})
        })

        const model_data = await resp.json();
        // console.log("----------模型信息-----------");
        // console.log(model_data);

        if(model_data.code!==0){ return;}

        modelId = model_data.data.id
        modelName = model_data.data.name.replace(/ /g, "").replace(/[/\\?%*:|"<>]/g, '');
        // modelName = modelName+"_返图";
        modelDir = modelName;
        modelName = modelDir+"_"+modelVer;
        if(modelName.slice(-1)==='.'){
                modelName = modelName.substring(0, modelName.length -1);
        }

        // 创建模型目录
        const modelDirHandle = await dirHandle.getDirectoryHandle(modelDir, {create: true});
        // 创建一个返图目录
        const newDirHandle = await modelDirHandle.getDirectoryHandle(modelName, {create: true});

        let count = 0;
        var number = 0;
        const numberInput2 = document.getElementById('numberInput2');
        number = parseInt(numberInput2.value);
        if(number> returnNum){
            number = returnNum;
        }

        while (true) {
            // 请求回图列表
            const response = await fetch(url_community, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: page,
                    pageSize: pageSize,
                    sortType: sortType,
                    uuid: uuid
                })
            });

            // 解析JSON数据
            const data = await response.json();
            // console.log(data);
            if(data.code===0){
                var datalist = data.data.dataList;
                var returnNum = data.data.returnNum;
                for(var i=0;i<datalist.length;i++){
                    var commItem = datalist[i];
                    var pics = commItem.pics;
                    for(var j=0;j<pics.length;j++){
                        var picItem = pics[j];
                        var picUuid = picItem.uuid;
                        var imageUrl = picItem.imageUrl;
                        var imageName = picItem.id;
                        var imageExt = imageUrl.split("/").pop().split(".").pop();
                        var tmp = imageExt.indexOf("?");
                        if (tmp>0){
                            imageExt = imageExt.substring(0,tmp);
                        }
                        // 下载图片
                        const resp_download = await fetch(imageUrl);
                        const blob = await resp_download.blob();
                        // 获取文件句柄
                        // console.log(imageName+"."+imageExt);
                        const picHandle = await newDirHandle.getFileHandle(imageName+"."+imageExt, { create: true });
                        // 写入文件
                        const writable = await picHandle.createWritable();
                        await writable.write(blob);
                        await writable.close();

                        // 查看图片生成信息地址
                        var url_img_generate = "https://liblib-api.vibrou.com/api/www/img/generate/"+picUuid+"?timestamp="+Date.now();
                        // 请求图片生成信息
                        const response_img_gen = await fetch(url_img_generate, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        const data_img_gen = await response_img_gen.json();
                        if(data_img_gen.code===0){
                            var metainformation = data_img_gen.data.metainformation;
                            if(!metainformation){
                                metainformation = 'prompt:'+data_img_gen.data.prompt +"\n";
                                metainformation = metainformation + 'negativePrompt:'+data_img_gen.data.negativePrompt +"\n";
                                metainformation = metainformation + 'modelNames:'+data_img_gen.data.modelNames +"\n";
                                metainformation = metainformation + 'seed:'+data_img_gen.data.seed +"\n";
                                metainformation = metainformation + 'samplingMethod:'+data_img_gen.data.samplingMethod +"\n";
                                metainformation = metainformation + 'samplingStep:'+data_img_gen.data.samplingStep +"\n";
                                metainformation = metainformation + 'cfgScale:'+data_img_gen.data.cfgScale +"\n";
                            }
                            // console.log(metainformation);
                            // 获取文件句柄
                            const savefileHandle = await newDirHandle.getFileHandle(imageName+".json", { create: true });
                            // 写入文件
                            const writablefile = await savefileHandle.createWritable();
                            await writablefile.write(metainformation);
                            await writablefile.close();
                        }

                        count ++;

                        const numberInput2 = document.getElementById('numberInput2');
                        numberInput2.setAttribute('value', number-count);
                        numberInput2.dispatchEvent(new Event('change'));

                        // 如果已经获取了所有数据，就跳出循环
                        if (count >= number) {
                            alert("返图信息下载完成");
                            const numberInput2 = document.getElementById('numberInput2');
                            numberInput2.setAttribute('value', default_download_pic_num);
                            numberInput2.dispatchEvent(new Event('change'));
                            return;
                        }
                    }
                }
            }
            // 增加page以获取下一页的数据
            page++;
        }
    }

    // 定义元素------------------------------------
    var div1 = document.createElement('div');
    div1.style.display = 'flex';
    div1.style.justifyContent="space-between";
    div1.style.alignItems = "center";

    var button1 = document.createElement('button');
    button1.textContent = '下载作者图例+生成信息';
    button1.onclick = saveAuthImagesInfo;
    button1.style.padding = '10px';
    button1.style.width = "200px";
    button1.style.backgroundColor = 'red';
    button1.style.color = 'white';
    button1.style.display = 'none';
    button1.style.flex = "1";

    const span1 = document.createElement('span');
    span1.textContent = '数量：';
    span1.style.marginLeft = "8px";

    const numberInput1 = document.createElement('input');
    numberInput1.setAttribute('type', 'number');
    numberInput1.setAttribute('id', 'numberInput1');
    numberInput1.setAttribute('value', 0);
    numberInput1.style.display = 'none';
    numberInput1.style.border = "1px solid";
    numberInput1.style.textAlign = "center";
    numberInput1.style.width = "80px";
    numberInput1.style.height = "38px";
    numberInput1.disabled = true;

    div1.appendChild(button1);
    div1.appendChild(span1);
    div1.appendChild(numberInput1);

    //----------------------------------------------
    var div2 = document.createElement('div');
    div2.style.display = 'flex';
    div2.style.justifyContent="space-between";
    div2.style.alignItems = "center";
    div2.style.margin = "2px 0";

    var button2 = document.createElement('button');
    button2.textContent = '下载返图图片+生成信息';
    button2.onclick = saveReturnImagesInfo;
    button2.style.padding = '10px';
    button2.style.width = "200px";
    button2.style.backgroundColor = 'blue';
    button2.style.color = 'white';
    button2.style.display = 'none';
    button2.style.flex = "1";

    const span2 = document.createElement('span');
    span2.textContent = '数量：';
    span2.style.marginLeft = "8px";

    const numberInput2 = document.createElement('input');
    numberInput2.setAttribute('type', 'number');
    numberInput2.setAttribute('id', 'numberInput2');
    numberInput2.setAttribute('value', default_download_pic_num);
    numberInput2.style.display = 'none';
    numberInput2.style.border = "1px solid";
    numberInput2.style.textAlign = "center";
    numberInput2.style.width = "80px";
    numberInput2.style.height = "38px";

    div2.appendChild(button2);
    div2.appendChild(span2);
    div2.appendChild(numberInput2);

    // 监听
    var observer = new MutationObserver(function(mutations) {
        var found = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && !found) {
                var allElements = document.querySelectorAll('div');
                allElements.forEach(function(element) {
                    var classNames = element.className.split(/\s+/);
                    for (var i = 0; i < classNames.length; i++) {
                        if (classNames[i].startsWith('ModelDescription_desc')) {
                            found = true;
                            observer.disconnect(); // 停止观察
                            var actionCard = document.querySelector('[class^="ModelActionCard_modelActionCard"]');
                            if (actionCard) {
                                actionCard.parentNode.insertBefore(div2, actionCard);
                                actionCard.parentNode.insertBefore(div1, div2);

                                button1.style.display = 'block';
                                numberInput1.style.display = 'block';
                                button2.style.display = 'block';
                                numberInput2.style.display = 'block';
                            }
                            break;
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();