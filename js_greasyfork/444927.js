// ==UserScript==
// @name         问卷星题库
// @namespace    https://ks.wjx.top/vm/YbwYHkw.aspx
// @version      1.0
// @description  问卷星题库收集
// @author       Hauk
// @license      GPLv3
// @match        https://ks.wjx.top/vm/*
// @match        http://ks.wjx.top/vm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444927/%E9%97%AE%E5%8D%B7%E6%98%9F%E9%A2%98%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/444927/%E9%97%AE%E5%8D%B7%E6%98%9F%E9%A2%98%E5%BA%93.meta.js
// ==/UserScript==

function fakeClick(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
}

function download(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
}

function controls(){
    let mask = document.createElement("div");
    mask.style.position="fixed";
    mask.style.top="0";
    mask.style.right="0";
    mask.style.background="rgba(255,255,255,1)";
    mask.style.zIndex="999";
    mask.style.display="flex";
    mask.style.flexDirection="row";
    let text = document.createElement("div");
    text.innerText = 0;
    var btn = document.createElement("button");
    btn.innerText = "下载";
    btn.style.textAlign="center";
    btn.onclick=()=>{
        let storage=window.localStorage;
        let dataSto = storage.getItem("data");
        let dataName = window.prompt("请输入题库文件名", "安全员题库");
        if (dataName == null || dataName == "") {
            return;
        } else {
            download(dataName+".json", dataSto);
        }
        let dataJson = JSON.parse(dataSto) || [];
        let imgData = [];
        for(let i=0;i<dataJson.length;i++){
            if(dataJson[i].hasOwnProperty("images")){
                for(let n=0;n<dataJson[i].images.length;n++){
                    //let ext = dataJson[i].images[n].substr(dataJson[i].images[n].lastIndexOf("."));
                    //let fileName = "img"+dataJson[i].topic+"_"+n+ext;
                    //savePicture(dataJson[i].images[n], fileName);
                    imgData.push({topic:dataJson[i].topic,imgIndex:n,url:dataJson[i].images[n]});
                    /*urlToBase64(dataJson[i].images[n], (res)=>{
                        console.log(res)
                    })*/
                }
            }
        }
        let imgArr = [];
        for(let i=0;i<imgData.length;i++){
            let index = imgArr.indexOf(imgData[i].url);
            if(index>-1){
                imgData[i].base64Index = index;
                console.log("重复图片：",i)
            }else{
                imgData[i].base64Index = imgArr.length;
                imgArr.push(imgData[i].url)
            }
        }
        //console.log(imgData)
        //console.log(imgData.length)
        //console.log(imgArr.length)
        let base64Arr = [];
        function saveImg(x){
            urlToBase64(imgArr[x], (res)=>{
                //console.log(res)
                base64Arr.push(res);
                x++;
                if(x<imgArr.length){
                    saveImg(x);
                }else{
                    let imageJson = {info:imgData,base64:base64Arr}
                    //console.log(base64Arr.length)
                    //console.log(base64Arr)
                    let imgName = window.prompt("请输入图片文件名", "安全员题库图片");
                    if (imgName == null || imgName == "") {
                        return;
                    } else {
                        download(imgName+".json", JSON.stringify(imageJson));
                    }
                }
            })
        }
        let x = 0;
        if(x<imgArr.length){
            saveImg(x);
        }
    }
    btn.onmouseenter=()=>{
        btn.style.background="rgba(0,0,255,1)";
        btn.style.color="#FFFFFF";
    }
    btn.onmouseleave=()=>{
        btn.style.background="rgba(255,255,255,0.5)";
        btn.style.color="#000000";
    }
    var btn2 = document.createElement("button");
    btn2.innerText = "清除";
    btn2.style.textAlign="center";
    btn2.onclick=()=>{
        let r = confirm("确认删除题库吗？");
        if (r == true) {
            let storage=window.localStorage;
            storage.removeItem("data");
            text.innerText = 0;
        }
    }
    btn2.onmouseenter=()=>{
        btn2.style.background="rgba(255,0,0,1)";
        btn2.style.color="#FFFFFF";
    }
    btn2.onmouseleave=()=>{
        btn2.style.background="rgba(255,255,255,0.5)";
        btn2.style.color="#000000";
    }
    var btn3 = document.createElement("button");
    btn3.innerText = "检查";
    btn3.style.textAlign="center";
    btn3.onclick=()=>{
        let storage=window.localStorage;
        let dataSto = JSON.parse(storage.getItem("data")) || [];
        let obj = {};
        for(let i=0;i<dataSto.length;i++){
            obj[dataSto[i].topic] = dataSto[i];
        }
        let nohas = [];
        for(let i=0;i<dataSto.length;i++){
            if(!obj.hasOwnProperty((i+2).toString())){
                nohas.push((i+2));
            }
        }
        if(nohas.length>0){
            alert("缺少："+nohas.toString())
        }else{
            alert("完整")
        }
    }
    btn3.onmouseenter=()=>{
        btn3.style.background="rgba(255,165,0,1)";
        btn3.style.color="#FFFFFF";
    }
    btn3.onmouseleave=()=>{
        btn3.style.background="rgba(255,255,255,0.5)";
        btn3.style.color="#000000";
    }
    var btn4 = document.createElement("button");
    btn4.innerText = "自动刷新";
    btn4.style.textAlign="center";
    let storage=window.localStorage;
    let ref = storage.getItem("refresh") || "";
    if(ref == "true"){
        btn4.style.background="rgba(135,206,235,1)";
        btn4.style.color="#FFFFFF";
    }else{
        btn4.style.background="rgba(255,255,255,0.5)";
        btn4.style.color="#000000";
    }
    btn4.onclick=()=>{
        ref = storage.getItem("refresh") || "";
        if(ref == "true"){
            storage.setItem("refresh","");
            btn4.style.background="rgba(255,255,255,0.5)";
            btn4.style.color="#000000";
        }else{
            storage.setItem("refresh","true");
            btn4.style.background="rgba(135,206,235,1)";
            btn4.style.color="#FFFFFF";
            refresh();
        }
    }
    mask.appendChild(text);
    mask.appendChild(btn4);
    mask.appendChild(btn3);
    mask.appendChild(btn);
    mask.appendChild(btn2);
    document.body.appendChild(mask);
    return {mask,text,btn,btn2,btn3};
}

function refresh(){
    const minTime = 10000;
    const maxTime = 15000;
    const refTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    console.log("刷新时间：",refTime,"ms");
    setTimeout(()=>{
        location.reload();
    },refTime);
}

function downloadIamge(imgSrc, fileName) { // imgSrc 为图片链接路径
    // 必须同源才能下载
    var alink = document.createElement("a");
    alink.href = imgSrc;
    alink.download = fileName; //fileName保存提示中用作预先填写的文件名
    alink.click();
}

function downloadIamge2(imgSrc, fileName) { //图片地址和图片默认名称
    let image = new Image();
    image.src = imgSrc;
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "Anonymous"); // 支持跨域
    image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = fileName || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    }
}

function downloadFile(fileUrl, fileName){
    const a = document.createElement('a')
    //   let url = baseUrl + binding.value // 若是不完整的url则需要拼接baseURL
    const url = fileUrl // 完整的url则直接使用
    // 这里是将url转成blob地址，
    fetch(url)// 跨域时会报错
        .then(res => res.blob())
        .then(blob => { // 将链接地址字符内容转变成blob地址
        a.href = URL.createObjectURL(blob)
        console.log(a.href)
        a.download = fileName // 下载文件的名字
        // a.download = url.split('/')[url.split('/').length -1] //  // 下载文件的名字
        document.body.appendChild(a)
        a.click()
        //在资源下载完成后 清除 占用的缓存资源
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    })
}

function savePicture(url, fileName){
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob' ; //arraybuffer也可以
    xhr.ontimeout = ()=>{};
    xhr.onreadystatechange=()=>{
        if(xhr.readyState=== XMLHttpRequest.DONE) { // 4 DONE 下载操作已完成
            if(xhr.status =200) {//status 200 代表一个成功的请求
            };
        };
    }
    xhr.onprogress = function () {
        console.log('LOADING', xhr.status);
    };
    xhr.onload = function () {
        console.log('DONE', xhr.status);
        let blob = xhr.response;// response 属性返回响应的正文，取决于 responseType 属性。
        // 下载完成，创建一个a标签用于下载
        let a = document.createElement("a");
        a.download = fileName;//保存提示中用作预先填写的文件名
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        // let e = document.createEvent('MouseEvents');
        // e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a.dispatchEvent(e);
        // 在资源下载完成后 清除占用的缓存资源
        setTimeout(function(){
            URL.revokeObjectURL(blob);
            document.body.removeChild(a);
        }, 200)
    };
    xhr.send(null); //XMLHttpRequest.send() 方法接受一个可选的参数，其作为请求主体；如果请求方法是 GET 或者 HEAD，则应将请求主体设置为 null
}

function urlToBase64(url, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob' ; //arraybuffer也可以
    xhr.ontimeout = ()=>{};
    xhr.onreadystatechange=()=>{
        if(xhr.readyState=== XMLHttpRequest.DONE) { // 4 DONE 下载操作已完成
            if(xhr.status =200) {//status 200 代表一个成功的请求
            };
        };
    }
    xhr.onprogress = function () {
        console.log('LOADING', xhr.status);
    };
    xhr.onload = function () {
        console.log('DONE', xhr.status);
        let blob = xhr.response;// response 属性返回响应的正文，取决于 responseType 属性。
        // 下载完成，创建一个a标签用于下载
        blobToBase64(blob).then((res)=>{
            //console.log(res)
            typeof callback == "function" && callback(res);
        })
    };
    xhr.send(null); //XMLHttpRequest.send() 方法接受一个可选的参数，其作为请求主体；如果请求方法是 GET 或者 HEAD，则应将请求主体设置为 null
}

function blobToBase64(blob){
    return new Promise((resolve, reject)=>{
        const fileReader =new FileReader();
        fileReader.onload=(e)=>{
            resolve(e.target.result);
        };
        fileReader.readAsDataURL(blob);
        fileReader.onerror=()=>{
            reject(new Error('blobToBase64 error'));
        };
    });
}

(function() {
    'use strict';
    // Your code here...
    /*Donate();
    var subjectType = router();
    subjectType.init();
    var WL = new wrongList();
    WL.show();
    var qNum = document.querySelector(".question-num",".ng-binding");
    let config = { attributes: true, childList: true, subtree: true };
    let observer = new MutationObserver(mutations => {
        subjectType.init();
    })
    observer.observe(qNum, config);*/

    var storage=window.localStorage;
    var box = document.getElementsByClassName("field ui-field-contain lxhide");
    var dataArr = [];
    for(let i=0;i<box.length;i++){
        let options = box[i].getElementsByClassName("label");
        if(options.length>0){
            let question = box[i].getElementsByClassName("field-label");
            let topic = box[i].getAttribute("topic");
            let type = box[i].getAttribute("type");
            //console.log(question,options);
            /*if(question[0].childElementCount>0){
                console.log(question);
                console.log(question[0].getElementsByTagName("img"));
            }*/
            //console.log(question[0].getElementsByTagName("img"));
            //console.log(box[i]);
            //console.log(options);
            let data = {};
            data.question = question[0].innerText;
            let images = question[0].getElementsByTagName("img");
            if(images.length>0){
                data.images = [];
                for(let q=0;q<images.length;q++){
                    data.images.push(images[q].currentSrc);
                    /*let ext = images[q].currentSrc.substr(images[q].currentSrc.lastIndexOf("."));
                    let fileName = topic+"_"+q+ext;
                    urlToBase64(images[q].currentSrc, (res)=>{
                        console.log(res)
                    })*/
                }
            }
            data.topic = topic;
            //console.log(data);
            let answer = "";
            data.type = Number(type);
            if(type!="3"&&type!="4"){
                alert(i.toString()+":出现新的题型请适配！");
                return;
            }
            let anserCode = ["A","B","C","D","E"];
            data.options = [];
            if(type == 4){
                answer = [];
            }
            for(let oi=0;oi<options.length;oi++){
                data.options.push(options[oi].innerText);
                if(type=="3"&&options.length>2){
                    answer += options[oi].parentNode.getAttribute("ans")=="1" ? anserCode[oi] : "";
                }else if(type=="4"){
                    options[oi].parentNode.getAttribute("ans")=="1" ? answer.push(anserCode[oi]) : "";
                }else{
                    answer += options[oi].parentNode.getAttribute("ans")=="1" ? options[oi].innerText : "";
                }
            }
            data.answer = answer;
            console.log(data);
            dataArr.push(data);
        }
    }
    let dataSto = JSON.parse(storage.getItem("data")) || [];
    for(let x=0;x<dataArr.length;x++){
        let hasTopic = false;
        for(let n=0;n<dataSto.length;n++){
            if(dataArr[x].topic == dataSto[n].topic){
                hasTopic = true;
                break;
            }
        }
        if(!hasTopic){
            dataSto.push(dataArr[x]);
        }
    }
    let control = controls();
    control.text.innerText = dataSto.length;
    storage.setItem("data",JSON.stringify(dataSto));
    let ref = storage.getItem("refresh");
    if(ref=="true"){
        refresh();
    }
    //console.log(dataSto);
})();