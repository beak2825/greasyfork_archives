// ==UserScript==
// @name         一键下载[求字体]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Happy
// @author       Y
// @match        https://www.qiuziti.com/search.html?*
// @match        https://www.qiuziti.com/download?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424930/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%5B%E6%B1%82%E5%AD%97%E4%BD%93%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/424930/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%5B%E6%B1%82%E5%AD%97%E4%BD%93%5D.meta.js
// ==/UserScript==

/*
特性介绍：
1.在搜索页面添加一键下载按钮
2.可选8082/8084端口下载
    8082：客户端用端口，下载速度<=50Kb，但可以一键直接开始下载
    8084：网页端默认端口，下载速度较快，但可能要多次刷新才能下载
3.在下载页面添加8082端口下载按钮

V1.0 - 210413
    1.创建初始版本
*/

window.createXHR = () => {
    var XHR = [//兼容不同浏览器和版本得创建函数数组
        function () { return new XMLHttpRequest () },
        function () { return new ActiveXObject ("Msxml2.XMLHTTP") },
        function () { return new ActiveXObject ("Msxml3.XMLHTTP") },
        function () { return new ActiveXObject ("Microsoft.XMLHTTP") }
    ];
    var xhr = null;
    //尝试调用函数，如果成功则返回XMLHttpRequest对象，否则继续尝试
    for (var i = 0; i < XHR.length; i ++) {
        try {
            xhr = XHR[i]();
        } catch(e) {
            continue//如果发生异常，则继续下一个函数调用
        }
        break;//如果成功，则中止循环
    }
    return xhr;//返回对象实例
}

var xhr = createXHR();

window.getRdl = (link,port,link2) => {//下载字体
    if (link2 != null) {//link2为下载页传入
        window.open('http://f01.lianty.cn:' + port + '/qztDownload?url=' + link2 ,'_self');
        return;
    }
    var recv = '';
    xhr.open("GET", "https://www.qiuziti.com/" + link, false);//建立连接，要求同步响应
    xhr.setRequestHeader ('Content-type', 'application/x-www-form-urlencoded');//设置为表单方式提交
    xhr.send(null);//发送请求
    recv = xhr.responseText;//接收数据
    //var recv = document.querySelector("body").outerHTML
    recv = recv.match(/<a data-url="(.*?)" id="ptDownload">/);//取出文件链接
    if (recv === null) {//取出失败会输出null
        alert ('qztDownload链接获取失败，请反馈更新。');
        return;
    }
    recv = encodeURIComponent(recv[1]);//输出URIencode
    if (port = '8084') {
        window.open('http://f01.lianty.cn:' + port + '/qztDownload?url=' + recv ,'_blank');
    } else {
        window.open('http://f01.lianty.cn:' + port + '/qztDownload?url=' + recv ,'_self');
    }


}

window.createSth = (selector,type,value,style,onclick,extradata) => {//通用添加，selector,type为必须，其他选填，不填不添加

    var MyDiv = selector;//创建元素和设置属性
    var sth = document.createElement("input");
    sth.setAttribute("type", type);
    if (value != undefined) {
        sth.setAttribute("value", value);
    }
    if (style != undefined) {
        sth.setAttribute("style", style);
    }
    if (onclick != undefined) {
        sth.setAttribute("onclick", onclick);
    }
    if (extradata != undefined) {
        sth.setAttribute("exdata", extradata);
    }
    MyDiv.appendChild(sth);

}

window.addBtnornot = () =>{

    let mainDiv = document.querySelector('#search-item-0 > div > div.font-btn');
    if (mainDiv != null) {//判断是否有字体，无字体不进行任何操作
        let tLink = mainDiv.outerHTML.match(/href="(.*?)" target/);//取出文件链接
        if (tLink === null) {//取出失败会输出null
            alert ('herf链接获取失败，请反馈更新。');
            return;
        }

        if (document.querySelector("#search-item-0 > div > div.font-btn > input[type=button]:nth-child(3)") != null) {//若不为空值则表示按钮已生成，返回
            return;
        }

        var font_num = document.querySelectorAll("a.font-down").length;//取font-down数量

        for( var i = 0 ; i != font_num; i++){//循环添加按钮

            mainDiv = document.querySelector('#search-item-'+ i +' > div > div.font-btn');
            var codeLink = mainDiv.outerHTML.match(/href="(.*?)" target/)[1];//取出文件链接
            createSth(mainDiv,'button','82下载','width: 60px;border: 1px solid #e1e1e1;border-radius: 2px;text-align: center;display: inline-block;line-height: 24px;background: #fff;font-size: 12px;color: #666;vertical-align: middle;margin-left: 8px;margin-right: 8px;','getRdl("' + codeLink + '","8082")');
            createSth(mainDiv,'button','84下载','width: 60px;border: 1px solid #e1e1e1;border-radius: 2px;text-align: center;display: inline-block;line-height: 24px;background: #fff;font-size: 12px;color: #666;vertical-align: middle;','getRdl("' + codeLink + '","8084")');

        }
    }
}

function addexBtn () {
    if (document.querySelector("#ptDownload") != null){//存在普通下载按钮

        let mainDiv = document.querySelector("#content > div > div > div.download > div.download-handle");
        let codeLink = mainDiv.outerHTML.match(/data-url="(.*?)" id/);
        if (codeLink != null){//确认可取出链接
            codeLink = codeLink[1];//取出文件链接
            createSth(mainDiv,'button','8082端口下载','width: 118px;line-height: 34px;border: 1px solid #e1e1e1;color: #666;display: inline-block;text-align: center;background-color: #ffffff;font-size: 14px;margin-left: 8px','getRdl("","8082","' + codeLink + '")');
        } else {
            let tnote = document.createElement('li');
            tnote.style='font-size: 20px';
            tnote.textContent='下载链接获取失败，脚本 “一键下载[求字体]” 已经失效，请反馈更新';
            document.querySelector("#content > div > div > div.download").appendChild(tnote);
        }

    } else {//不存在或失效显示文本
        let tnote = document.createElement('li');
        tnote.style='font-size: 20px';
        tnote.textContent='若您无法看到 "8082端口下载"的按钮 则脚本 “一键下载[求字体]” 可能已经失效，请反馈更新';
        document.querySelector("#content > div > div > div.download").appendChild(tnote);
    }
}

// 检测是否刷新搜索框用 -START
function checkNode () {
// 选择将观察突变的节点
    var targetNode = document.querySelector("#content > div > div > div.search > div.font-result > div.font-content > div > div.font-main");

    // 观察者的选项(要观察哪些突变)
    var config = { childList: true, subtree: true };

    // 当观察到突变时执行的回调函数
    var callback = function(mutationsList) {
    mutationsList.forEach(function(item,index){
        if (item.type == 'childList') {
            //console.log('有节点发生改变，发生改变的节点是：');
            //console.log(item.target);
            if (item.target === document.querySelector("#content > div > div > div.search > div.font-result > div.font-content > div > div.font-main")) {
              //console.log('font-main更新');
                addBtnornot();
            }
        }
    });
};

// 创建一个链接到回调函数的观察者实例
var observer = new MutationObserver(callback);

// 开始观察已配置突变的目标节点
observer.observe(targetNode, config);
}
// 检测是否刷新搜索框用 - END

//窗口加载完毕确认存在字体后需要判断样式有无变化，有变化则停止加载

window.onload = function(){
    console.log('脚本 “一键下载[求字体]” 已启用');
    if (document.URL.indexOf('qiuziti.com/download?id') != -1) {//下载页面
        addexBtn();
    };
    if (document.URL.indexOf('qiuziti.com/search.html') != -1) {//搜索页面
        checkNode ();
        addBtnornot();
    };


}

