// ==UserScript==
// @name         北京题库拓展
// @namespace    none
// @version      3.0
// @description  下载“北京题库”的试题
// @author       Mornwind
// @match        *://www.jingshibang.com/*
// @icon         data:image/png;base64,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
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463037/%E5%8C%97%E4%BA%AC%E9%A2%98%E5%BA%93%E6%8B%93%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/463037/%E5%8C%97%E4%BA%AC%E9%A2%98%E5%BA%93%E6%8B%93%E5%B1%95.meta.js
// ==/UserScript==
function downloadPdf(url,name) {
    let list = {
        url,
        name: name,
        type: 'pdf'
    }
    downloadFile(list)
}


function downloadFile(data) {
    fetchDownloadFile(data)
}

function fetchDownloadFile(data) {
    fetch(data.url, {
        method: "get",
        mode: "cors",
    })
        .then((response) => response.blob())
        .then((res) => {
        const downloadUrl = window.URL.createObjectURL(
            //new Blob() 对后端返回文件流类型处理
            new Blob([res], {
                type: data.type == "pdf" ? "application/pdf" : data.type == "word" ?
                "application/msword" : data.type == "xlsx" ? "application/vnd.ms-excel" : ""
            })
        );
        //word文档为msword,pdf文档为pdf
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", data.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }).catch((error) => {
        window.open(data.url);
    });
};
function downloadTxt(fileName, content) {
    let a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + content
    a.download = fileName
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function split_id(url){
    let a=url.split("&").slice(0)[0];
    let b=a.split("=").slice(-1)[0];
    return b;
}
function baidu_download(data){
    let name=data.data.storeInfo.store_name;
    let url=data.data.storeInfo.baidu_url
    let password=data.data.storeInfo.baidu_pw
    let text="第三方文档：\n"+name+"\n百度网盘链接："+url+"\n提取码："+password;
    downloadTxt(name,text);
    window.open(url+"?pwd="+password)
}
function pdf_download(data){
    let name=data.data.storeInfo.store_name;
    let url="http://www.jingshibang.com"+data.data.storeInfo.pdf_answer;
    downloadPdf(url,name)
}
function word_download(data){
    let name=data.data.storeInfo.store_name;
    let url="http://www.jingshibang.com"+data.data.storeInfo.word_answer;
    window.open(url);
}
function get_file(id){
    var url="http://www.jingshibang.com/api/product/detailpc/"+id;
    GM_xmlhttpRequest({
        method:"get",
        url:url,
        onload: function(res){
            let data=JSON.parse(res.responseText);
            if(data.data.storeInfo.baidu_url!=""){
                try{baidu_download(data)}catch(e){}
            }
            if(data.data.storeInfo.pdf_answer!=""){
                try{pdf_download(data)}catch(e){}
            }
            if(data.data.storeInfo.word_answer!=""){
                try{word_download(data)}catch(e){}
            }
        }
    })
}
function find(name){
    if(name!=""){
        var id
        var url="http://www.jingshibang.com/api/products?page=1&limit=99&keyword="+name
        GM_xmlhttpRequest({
            method:"get",
            url:url,
            //headers:header,
            onload: function(response){
                const data=JSON.parse(response.responseText).data;
                var pro;
                for(var i=0;i<=data.length;i++){
                    pro=data.slice(i)[0]
                    if(pro.store_name==name){
                        id=pro.id;
                        window.open("http://www.jingshibang.com/home/detailPaper/?id="+id)
                    }
                }
            }
        })
    }
}
function open(e){
    try{
        let name=e.target.innerText
        find(name)
    }
    catch(ep){
        console.log(ep)
    }
}
function removeElementsByClass(className) {
  const elements = document.querySelectorAll('.' + className);
  elements.forEach(function(element) {
    element.parentNode.removeChild(element);
  });
}
(function() {
        removeElementsByClass("bg");
        removeElementsByClass("loginDiv");
    document.onclick = function (e) {
        if (e.ctrlKey && e.shiftKey){
            if(window.location.href.indexOf("id")==-1){
                var name=prompt("请输入要打开的文档全名：")
                find(name)
            }else{get_file(split_id(window.location.href))}
        }
        else if(window.location.href.indexOf("id")==-1){
            open(e)
        }
        removeElementsByClass("bg");
        removeElementsByClass("loginDiv");
    }
})();