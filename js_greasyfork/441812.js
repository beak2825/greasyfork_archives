// ==UserScript==
// @name         喜马拉雅Album下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download musics in album from Ximalaya website
// @author       J. Chen
// @match        https://www.ximalaya.com/album/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ximalaya.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441812/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85Album%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/441812/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85Album%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
//=============================

//添加axios的js
var axios_src = document.createElement("script");
axios_src.src = "https://unpkg.com/axios/dist/axios.min.js";
document.body.append(axios_src);

//必须写在最前面
var callback = function(){
 // 在 DOM 完全加载完后执行
    //console.log("********* 00 ***************");
    //console.log(document.readyState);
    pageListener();
    main();
};

//当document文档正在加载时,返回"loading"。
//当文档结束渲染但在加载内嵌资源时，返回"interactive"，并引发DOMContentLoaded事件。
//当文档加载完成时,返回"complete"，并引发load事件。
if(document.readyState === "complete"){
    console.log("********* 0 ***************");
    pageListener();
    main();
}
else{
    console.log("********* 1 ***************");
    document.addEventListener('readystatechange', callback,false);
    console.log("********* 2 ***************");
    //window.addEventListener('load', callback, false);
}

//监测页面变化函数
function pageListener(){
    var pagesNode = document.getElementsByClassName("pagination-page N_t")[0];

    var ulNode = document.getElementsByClassName("sound-list  H_g")[0].children[0];
    var liNodes = ulNode.querySelectorAll("li");
    var oldTitle = ulNode.children[0].getElementsByClassName("text _nO")[0].children[0].title;
    var newTitle = oldTitle;
    var changeTimes = 0;
    //text _nO
    var targetNode = pagesNode;

    // 观察者的选项(要观察哪些突变)
    var config = { attributes: true, childList: true, subtree: true };
    //var config = { attributes: true};

    // 当观察到页数变时执行的回调函数
    var callback = function(mutationsList) {
        mutationsList.forEach(function(item,index){

            if (item.type == 'childList') {
                console.log('子节点发生改变');
            } else if (item.type == 'attributes') {
                changeTimes += 1;
                console.log('修改了'+item.attributeName+'属性');

                var refreshPage = setInterval(checkPage,1000); //翻页后页面可能没及时刷新，用此函数不停地刷新
                var ulNode = document.getElementsByClassName("sound-list  H_g")[0].children[0];
                //var oldTitle = ulNode.children[0].getElementsByClassName("text _nO")[0].children[0].title;
                newTitle = ulNode.children[0].getElementsByClassName("text _nO")[0].children[0].title;
                var i = 0;
                function checkPage(){
                    ulNode = document.getElementsByClassName("sound-list  H_g")[0].children[0];
                    newTitle = ulNode.children[0].getElementsByClassName("text _nO")[0].children[0].title;
                    //console.log(i);
                    i += 1;
                    if(oldTitle != newTitle){
                        oldTitle = newTitle;
                        clearInterval(refreshPage);//停止调用timeinterval
                        //console.log("old title: " + oldTitle);
                        //console.log("new title: " + newTitle);
                        console.log("页面已刷新");
                        //oldTitle = newTitle;
                        main();
                    }

                }
            } else if (item.type == 'subtree'){
                console.log('subtree changed');
            }
            else {
                console.log('others');
            }

        });
    };

    // 创建一个链接到回调函数的观察者实例
    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(targetNode, config);

    // 停止观察
    //observer.disconnect();
}

//在页面添加下载按钮和功能
function main(){
    var url_base = "https://www.ximalaya.com/revision/play/v1/audio?id="
    var ulNode = document.getElementsByClassName("sound-list  H_g")[0].children[0];
    var liNodes = ulNode.querySelectorAll("li");
    var buttons = [];

    for(var i=0; i< liNodes.length; i++){
        //添加下载button
        buttons.push ( document.createElement("input") );
        buttons[i].setAttribute("type", "button");
        buttons[i].setAttribute("value", "下载");
        //绑定点击事件
        buttons[i].onclick = function () {
            var textLiNode = this.parentNode.getElementsByClassName("text _nO")[0].children[0];
            var title = textLiNode.title;
            var href = textLiNode.href;
            console.log(title);
            console.log(href);

            var id = href.split("/").pop();
            var url = url_base + id + "&ptype=1"

            //console.log(url);
            var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
            httpRequest.open('GET', url, true);//第二步：打开连接
            httpRequest.send();//第三步：发送请求  将请求参数写在URL中
            /**
        * 获取数据后的处理程序
        */
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    var json = httpRequest.responseText;//获取到json字符串，还需解析
                    var obj = JSON.parse(json);
                    var src = obj.data["src"]; //url of m4a file

                    var filename = title +".m4a";
                    console.log("***" + i + "***");
                    console.log(src);
                    console.log(filename);

                    //添加下载功能
                    download(src, filename);
                }
            };
            //添加下载功能
        };

        liNodes[i].insertBefore(buttons[i], liNodes[i].childNodes[0]);

    }
}

//音频文件下载函数
function download (downUrl, fileName) {
      axios({
        method: 'get',
        url: downUrl,
        responseType: 'blob',
        headers: {'content-type': 'audio/mpeg'}
        // headers: {'content-length': '4066786', 'content-type': 'audio/mpeg'}
      }).then((res) => {
        // eslint-disable-next-line no-unused-vars
        let blobType = 'application/force-download' // 设置blob请求头
        // eslint-disable-next-line no-unused-vars
        let blob = new Blob([res.data], {type: res.data.type}) // 创建blob 设置blob文件类型 data 设置为后端返回的文件(例如mp3,jpeg) type:这里设置后端返回的类型 为 mp3
        let downa = document.createElement('a') // 创建A标签
        // eslint-disable-next-line no-unused-vars
        let href = window.URL.createObjectURL(blob) // 创建下载的链接
        downa.href = href // 下载地址
        downa.download = fileName // 下载文件名
        document.body.appendChild(downa)
        downa.click() // 模拟点击A标签
        document.body.removeChild(downa) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放blob对象
      }).catch(function (error) {
        console.log(error)
      })
    }

