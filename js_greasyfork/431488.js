// ==UserScript==

// @icon        https://github.com/favicon.ico
// @name        【自用】YoutubeTools
// @namespace   Violentmonkey Scripts
// @match *://*.youtube.com/*
// @grant       none
// @version     2024.06.02-01（with LYD v0.9.55）
// @author      heckles
// @description 1.恢复页面布局，2.增加按钮，方便IDM下载（配合IDM使用）【需配合Local YouTube Downloader使用】,3.增加按钮，一键重绘下载png格式的cover，4.增加按钮生成合并命令行，5.用clipboard,火狐v99之后抽风
// @Homepage URL https://greasyfork.org/zh-CN/scripts/431488-%E8%87%AA%E7%94%A8-youtubetools
// @downloadURL https://update.greasyfork.org/scripts/431488/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91YoutubeTools.user.js
// @updateURL https://update.greasyfork.org/scripts/431488/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91YoutubeTools.meta.js
// ==/UserScript==
//找这里const shadowHost = $el('div')，然后加一句  shadowHost.setAttribute("id","hahahazijijiade");
// 找这里const shadow = shadowHost.attachShadow ? shadowHost.attachShadow({ mode: 'closed' })

//1.设定加载条件
if (document.getElementById("browser-app") || document.getElementById("masthead")) { //这两个元素，有一个是true，就往下执行
    var sx = setInterval(function () { //间隔执行
        //console.log(">>>>>>>>>>>               【YoutubeTools】      interval开始          <<<<<<<<<<<");
        if (window.location.href.indexOf("watch?v=") < 0) { //如果网址不匹配
            return false; //就不执行         【这里只能匹配域名，然后筛，直接用watch的网址，从首页点进去会不触发】
        } else {
            if (document.getElementById("meta-contents") && document.getElementById("punisher") === null) { //网址匹配的话，punisher没有被添加
                StartJS(); //就执行函数，添加punisher
                console.log(">>>>>>>>>>>               【YoutubeTools】      已加载          <<<<<<<<<<<");
            }
        }
    }, 3000); //间隔时间,毫秒
    //return;
}

//2.条件触发后加载
function StartJS() {
    //2.1新增按钮的样式
    const spancss = `
  justify-content:left;
  display:flex;
  width:100%;
  margintop:3px;
  padding:1px 0;
`
    const btncss = `
  color: #F97D00;
  font-weight: bold;
  /*text-transform: uppercase;*/
  font-size:14px;
  padding: 0px 8px;
  background-color: transparent;
  border-color: transparent;
  font-family: sans-serif !important;//这个得加，要不字体不一样
`
    //2.2开始添加按钮
    var buttonDiv = document.createElement("span");
    buttonDiv.id = "punisher";
    buttonDiv.style.cssText = spancss;
    var [addButtonV, addButtonV720,addButtonA, addButtonM] = [document.createElement("button"), document.createElement("button"), document.createElement("button"), document.createElement("button")];
    var [aCover, aTitle, apName, aSrt] = [document.createElement("a"), document.createElement("a"), document.createElement("a"), document.createElement("a")];
    addButtonV.appendChild(document.createTextNode("V1080p"));
    addButtonV720.appendChild(document.createTextNode("V720p"));
    addButtonA.appendChild(document.createTextNode("Acode"));
    addButtonM.appendChild(document.createTextNode("Merge"));
    aCover.appendChild(document.createTextNode("Cover"));
    aTitle.appendChild(document.createTextNode("F-name"));
    apName.appendChild(document.createTextNode("Path&Name"));
    aSrt.appendChild(document.createTextNode("Srt"));
    addButtonV.style.cssText = btncss;
    addButtonV720.style.cssText = btncss;
    addButtonA.style.cssText = btncss;
    addButtonM.style.cssText = btncss;
    aCover.style.cssText = btncss;
    aTitle.style.cssText = btncss;
    apName.style.cssText = btncss;
    apName.style.cssText = btncss;
    aSrt.style.cssText = btncss;
    buttonDiv.appendChild(addButtonV);
    buttonDiv.appendChild(addButtonV720);
    buttonDiv.appendChild(addButtonA);
    buttonDiv.appendChild(addButtonM);
    buttonDiv.appendChild(aCover);
    buttonDiv.appendChild(aTitle);
    buttonDiv.appendChild(apName);
    buttonDiv.appendChild(aSrt);


    var targetElement = document.querySelectorAll("[id='title']"); //youtube故意的，很多元素id重复，这里够绝，直接全选中，然后按class筛，再加
    if (targetElement) {
        for (var i = 0; i < targetElement.length; i++) {
            if (targetElement[i].className.indexOf("style-scope ytd-watch-metadata") > -1) {
                targetElement[i].appendChild(buttonDiv);
            }
        }
    }

    //3.创建一个input，但是不显示（通过移位），作为复制的中介
    var nMInput = document.createElement('input');
    nMInput.style.cssText = "position:absolute; top:-200px;"; //火狐实测隐藏的话不能选，oInput.style.display='none';
    document.body.appendChild(nMInput);


    //4.生成文件名
    var refreshvar = function () {//设置全局变量，随时准备刷新
        nMo = document.querySelector("#container h1 yt-formatted-string").innerText;//获取视频名称，下面再把不能作为文件名的符号替换
        /*油管应该是禁了，cmd方式调用IDM下载会报错，这里就没必要筛选韩文了
        if(nMo.match(/[\uac00-\ud7ff]/gi)){
          nMo = "【名称包含韩文，根据视频编号自行修改】" +window.location.href.split("watch?v=")[1];
        }
        */
        nM = nMo.replace(/[|\\|\/|\:|\*|\?|\"|\<|\>|\|]/g, function (a) {//每一个符号前面都加|\,/[]/g表示全文匹配
            switch (a) {//就是换成全角的标点，全角标点是用输入法找出来的
                case '\\':
                    return '＼';
                case '/':
                    return '／';
                case ':':
                    return '：';
                case '*':
                    return '·';
                case '?':
                    return ' ？';
                case '\"':
                    return '＂';
                case '<':
                    return '〈';
                case '>':
                    return '〉';
                case '|':
                    return '｜';
            }
        });
        nM_V = '"' + nM + ' - DASH_V' + '"' + '.mp4';
        nM_A = '"' + nM + ' - DASH_A' + '"' + '.m4a';
        //5.生成封面图的地址和名称
        src_J = document.querySelector("#container div.ytp-cued-thumbnail-overlay-image").style.cssText.slice(23, -3);
        nM_J = document.querySelector("#container h1 yt-formatted-string").innerText + src_J.split("default")[1];
        if (document.querySelector("div#info-strings #dot").nextSibling.innerText.split(" ")[1]) {
            nM_dateXX = document.querySelector("div#info-strings #dot").nextSibling.innerText.split(" ")[1];//避免出现“首播开始于”
        } else {
            nM_dateXX = document.querySelector("div#info-strings #dot").nextSibling.innerText;
        }
        nM_date = nM_dateXX.split("年")[0] + "-" + nM_dateXX.split("月")[0].split("年")[1].padStart(2, '0') + "-" + nM_dateXX.split("日")[0].split("月")[1].padStart(2, '0');
    }
    aCover.target = "_blank";
    //6.IDM下载命令行所需
    const ds1 = `"E:\\Programs\\Internet Download Manager"\\idman.exe / n / d "`
    const ds2 = `"/p "E:\\下载\\IDM\\00.合并油管" /f `
    const mg1 = `"E:\\Programs\\视频编辑\\YouTube 音视频分离合并\\64 位\\ffmpeg" -i "E:\\下载\\IDM\\00.合并油管\\`
    const mg2 = ` - DASH_A".m4a  -i "E:\\下载\\IDM\\00.合并油管\\`
    const mg3 = ` - DASH_V".mp4 -acodec copy -vcodec copy "E:\\下载\\IDM\\00.合并油管\\`
    const mg4 = `".mp4`

    //7.1视频
    addButtonV.onclick = function () { //按钮加event //shadowroot的mode必须是open，否则没有ShadowDOM
        refreshvar(); //刷新全局变量
        nMInput.value = "E:\\下载\\IDM\\00.合并油管\\" + nM_date + '\ ' + nM + ' - DASH_V' + '.mp4';
        nMInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令,火狐里面这个command只能是用户触发，不能自动
        //只能先复制，要不打开新窗口容易失去焦点，然后没法复制，V99开始
        var xroot = document.getElementById("hahahazijijiade"); //找这里const shadowHost = $el('div')，然后加一句  shadowHost.setAttribute("id","hahahazijijiade");                   <<<<<<<<<<<<<<<<<<<<<<<<<
        var linkss = xroot.shadowRoot.children[0].children[2].children[1].children[1];
        var ku = linkss.querySelectorAll("a");

        if (ku) {
            for (var i = 0; i < ku.length; i++) {
                if (linkss.innerHTML.indexOf("1080p") > -1) { //先看看1080p有没有，不能用linkss.children[i].innerText.indexOf("1080p") > -1作为条件判断
                    if (linkss.children[i].innerText.indexOf("1080p") > -1 && linkss.children[i].innerText.indexOf("video/mp4") > -1 && linkss.children[i].innerText.indexOf("avc1.") > -1) { //用=0就不行，用>-1就行...，如果没有，就是-1，
                        //nMInput.value = ds1 + linkss.children[i].href + ds2 + nM_V;
                        var downlink = linkss.children[i].href;
                        console.log('下面是1080p的链接');
                        console.log(downlink);
                    }
                } else if (linkss.children[i].innerText.indexOf("720p") > -1 && linkss.children[i].innerText.indexOf("video/mp4") > -1 && linkss.children[i].innerText.indexOf("avc1.") > -1) { //用=0就不行，用>-1就行...，如果没有，就是-1，没有再下720p
                    //nMInput.value = ds1 + linkss.children[i].href + ds2 + nM_V;
                    var downlink = linkss.children[i].href;
                    console.log('下面是720p的链接');
                    console.log(downlink);
                }
            }
        }

        window.open(downlink, "_blank");
    };

    addButtonV720.onclick = function () { //按钮加event //shadowroot的mode必须是open，否则没有ShadowDOM
        refreshvar(); //刷新全局变量
        nMInput.value = "E:\\下载\\IDM\\00.合并油管\\" + nM_date + '\ ' + nM + ' - DASH_V' + '.mp4';
        nMInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令,火狐里面这个command只能是用户触发，不能自动
        //只能先复制，要不打开新窗口容易失去焦点，然后没法复制，V99开始
        var xroot = document.getElementById("hahahazijijiade"); //找这里const shadowHost = $el('div')，然后加一句  shadowHost.setAttribute("id","hahahazijijiade");                   <<<<<<<<<<<<<<<<<<<<<<<<<
        var linkss = xroot.shadowRoot.children[0].children[2].children[1].children[1];
        var ku = linkss.querySelectorAll("a");

        if (ku) {
            for (var i = 0; i < ku.length; i++) {
                if (linkss.innerHTML.indexOf("720p") > -1) { //先看看1080p有没有，不能用linkss.children[i].innerText.indexOf("1080p") > -1作为条件判断
                    if (linkss.children[i].innerText.indexOf("720p") > -1 && linkss.children[i].innerText.indexOf("video/mp4") > -1 && linkss.children[i].innerText.indexOf("avc1.") > -1) { //用=0就不行，用>-1就行...，如果没有，就是-1，
                        //nMInput.value = ds1 + linkss.children[i].href + ds2 + nM_V;
                        var downlink = linkss.children[i].href;
                        console.log('下面是720p的链接');
                        console.log(downlink);
                    }
                }
            }
        }
        window.open(downlink, "_blank");
    };

    //7.2音频
    addButtonA.onclick = function () {//按钮加event //shadowroot的mode必须是open，否则没有ShadowDOM // 找这里const shadow = shadowHost.attachShadow ? shadowHost.attachShadow({ mode: 'closed' })       <<<<<<<<<<<<<<<<<<<<<<<<<
        refreshvar();//刷新全局变量
        nMInput.value = "E:\\下载\\IDM\\00.合并油管\\" + nM_date + '\ ' + nM + ' - DASH_A' + '.m4a';
        nMInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令,火狐里面这个command只能是用户触发，不能自动
        //只能先复制，要不打开新窗口容易失去焦点，然后没法复制，V99开始
        var xroot = document.getElementById("hahahazijijiade");
        var linkss = xroot.shadowRoot.children[0].children[2].children[1].children[1];
        var ku = linkss.querySelectorAll("a");
        if (ku) {
            for (var i = 0; i < ku.length; i++) {
              //alert(linkss.children[5].innerText.indexOf("audio"));
                if (ku[i].innerText.indexOf("audio/mp4")> -1) { //用=0就不行，用>-1就行...，如果没有，就是-1
                    var downlink = ku[i].href;//用linkss.children[i]会出问题，具体情况是audio只有一个元素时
                    console.log(downlink);
                }
            }
        }
        window.open(downlink, "_blank");

    };
    //7.3合并
    addButtonM.onclick = function () {//按钮加event //shadowroot的mode必须是open，否则没有ShadowDOM
        refreshvar();//刷新全局变量
        nMInput.value = mg1 + nM_date + '\ ' + nM + mg2 + nM_date + '\ ' + nM + mg3 + nM_date + '\ ' + nM + mg4;
        nMInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令,火狐里面这个command只能是用户触发，不能自动
    };
    //7.4封面
    //网上找的点击下载图片的，原理是canvas重绘
    aCover.onclick = function () {
        refreshvar();//刷新全局变量
        function dIamge(xhref, name) {
            var image = new Image();
            image.setAttribute('crossOrigin', 'anonymous'); // 解决跨域 Canvas 污染问题
            image.src = xhref;
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, image.width, image.height);
                var url = canvas.toDataURL('image/png');
                var a = document.createElement('a'); // 生成一个a元素
                var event = new MouseEvent('click'); // 创建一个单击事件
                a.download = name || '下载图片名称'; // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            }
        };
        nMInput.value = nM_date + '\ ' + document.querySelector("#container h1 yt-formatted-string").innerText.replace(/[|\\|\/|\:|\*|\?|\"|\<|\>|\|]/g, function (a) {//每一个符号前面都加|\,/[]/g表示全文匹配
            switch (a) {
                case '\\':
                    return ' ';
                case '/':
                    return ' ';
                case ':':
                    return '：';
                case '*':
                    return '·';
                case '?':
                    return ' ？';
                case '\"':
                    return '\'';
                case '<':
                    return '《';
                case '>':
                    return '》';
                case '|':
                    return '-';
            }
        });;
        //dIamge(src_J, nM);
        var thumbJ = nMInput.value + '-thumb';
        //alert(thumbJ);
        dIamge(src_J, thumbJ);
    };
    //7.5名称
    aTitle.onclick = function () {//按钮加event //shadowroot的mode必须是open，否则没有ShadowDOM
        refreshvar();//刷新全局变量
        nMInput.value = nM_date + '\ ' + document.querySelector("#container h1 yt-formatted-string").innerText.replace(/[|\\|\/|\:|\*|\?|\"|\<|\>|\|]/g, function (a) {//每一个符号前面都加|\,/[]/g表示全文匹配
            switch (a) {
                case '\\':
                    return ' ';
                case '/':
                    return ' ';
                case ':':
                    return '：';
                case '*':
                    return '·';
                case '?':
                    return ' ？';
                case '\"':
                    return '\'';
                case '<':
                    return '《';
                case '>':
                    return '》';
                case '|':
                    return '-';
            }
        });;
        nMInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令,火狐里面这个command只能是用户触发，不能自动
    };
    apName.onclick = function () {//按钮加event //shadowroot的mode必须是open，否则没有ShadowDOM
        refreshvar();//刷新全局变量
        nMInput.value = "E:\\下载\\IDM\\00.合并油管\\" + nM_date + '\ ' + document.querySelector("#container h1 yt-formatted-string").innerText.replace(/[|\\|\/|\:|\*|\?|\"|\<|\>|\|]/g, function (a) {//每一个符号前面都加|\,/[]/g表示全文匹配
            switch (a) {
                case '\\':
                    return ' ';
                case '/':
                    return ' ';
                case ':':
                    return '：';
                case '*':
                    return '·';
                case '?':
                    return ' ？';
                case '\"':
                    return '\'';
                case '<':
                    return '《';
                case '>':
                    return '》';
                case '|':
                    return '-';
            }
        });;
        nMInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令,火狐里面这个command只能是用户触发，不能自动
    };
    //7.6字幕
    /*
    aSrt.href = window.location.href.split("www.")[0]+"www.subtitle.to/" + window.location.href.split("www.")[1];  //这样会有下划线
    aSrt.target = "_blank";
    */
    aSrt.onclick = function () {
        window.open(window.location.href.split("www.")[0] + "www.subtitle.to/" + window.location.href.split("www.")[1], "_blank");
    };


    if (!document.getElementById("hahahazijijiade")) {
        addButtonV.prepend(document.createTextNode(">>需更新<<    "));
    }
}
