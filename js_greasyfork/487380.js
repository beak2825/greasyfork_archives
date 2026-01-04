// ==UserScript==
// @name         网赚盘下载助手
// @namespace    https://greasyfork.org
// @version      1.74
// @description  支持快速下载网赚盘
// @author       Hoooooo
// @match        *://www.kufile.net/*
// @match        *://www.xywp1.com/*
// @match        *://www.567yun.cn/*
// @match        *://www.567file.com/*
// @match        *://www.rarclouds.com/*
// @match        *://www.rarwp.com/*
// @match        *://www.expfile.com/*

// @match        *://*.77file.com/*
// @match        *://*.xunniufile.com/*
// @match        *://*.xueqiupan.com/*
// @match        *://*.xfpan.cc/*
// @match        *://ownfile.net/*
// @match        *://*.dudujb.com/*
// @match        *://*.1988wp.com/*
// @match        *://rosefile.net/*
// @match        *://*.kufile.net/*
// @match        *://*.520-vip.com/*

// @match        *://*.711pan.com/shareLink*
// @match        *://*.ayunpan.com/*


// @connect      api.77drive.com

// @run-at       document_start

// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow



// @downloadURL https://update.greasyfork.org/scripts/487380/%E7%BD%91%E8%B5%9A%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/487380/%E7%BD%91%E8%B5%9A%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // @run-at默认是document-idle，而弹窗代码在body里，所以运行时期要在渲染body之前
    //    if (window.location.hostname === "www.xingyaopan.com" || window.location.hostname === "www.rarclouds.com") {
    sessionStorage.setItem("hassession", 1);//这个是网赚盘判断是否弹窗的关键代码，hassession=1表示已经弹窗过了
    //    }
    // document-idle实在DOMContentLoaded事件之后1毫秒
    //实现document-idle
    let is = true;
    const fun = () => {
        if (is) {
            is = false;
            setTimeout(idle, 1);
        }
    };
    window.addEventListener('DOMContentLoaded', fun, { capture: true, once: true });
    document.readyState !== 'loading' && fun();
})();

function idle() {
    var dlURL;
    var fid;
    var downurl;
    var getdown;


    var apiurl = "https://pandown.onrender.com"

    function getUrlParams(url) {
        // 检查是否有 '?'
        if (!url.includes('?')) {
            return {};
        }
        // 通过 ? 分割获取后面的参数字符串
        let urlStr = url.split('?')[1]
        // 创建空对象存储参数
        let obj = {};
        // 再通过 & 将每一个参数单独分割出来
        let paramsArr = urlStr.split('&')
        for (let i = 0, len = paramsArr.length; i < len; i++) {
            // 再通过 = 将每一个参数分割为 key:value 的形式
            let arr = paramsArr[i].split('=')
            obj[arr[0]] = arr[1];
        }
        return obj
    }
    var api = getUrlParams(window.location.href).api
    if (api) {
        apiurl = "https://pandown.vercel.app"
    }

//    tishi("为了防止线路失效 准备两条线路 切换只需要在url后添加api=true即可 例如 https://a.com?api=true")


    var originopen = window.open
    window.unsafeWindow.open = function (a, b) {
        if (a.split("/")[3].indexOf("vip.php") != 0) {
            originopen(a, b)
        }
    }


    //下载
    function Download(content) {
        var eleLink = document.createElement("a");
        eleLink.style.display = "none";
        eleLink.href = content;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }

    //提示
    function tishi(content, id) {
        if (localStorage.getItem(id) == null) {
            alert(content)
            localStorage.setItem(id, "1")
        }
    }

    //复制
    function copyText(text) {
        let tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("已复制");
    }



    //等待元素加载完毕
    function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
        if (typeof waitOnce === "undefined") {
            waitOnce = true;
        }
        if (typeof interval === "undefined") {
            interval = 300;
        }
        if (typeof maxIntervals === "undefined") {
            maxIntervals = -1;
        }
        var targetNodes =
            typeof selectorOrFunction === "function" ? selectorOrFunction() : document.querySelectorAll(selectorOrFunction);

        var targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function (targetNode) {
                var attrAlreadyFound = "data-userscript-alreadyFound";
                var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    var cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    } else {
                        targetNode.setAttribute(attrAlreadyFound, true);
                    }
                }
            });
        }

        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function () {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }


    //判断网盘 并执行相应事件
    if (window.location.host == "www.kufile.net") {
        if (window.location.pathname.split("/")[1].indexOf("vip.php") == 0) {
            document.querySelector("html")
                .innerHTML = "<head></head><body><p><font size=\"24\"><font color=\"#FF0000\">本人技术有限 无法屏蔽弹出页面 弹出本页面属于正常现象 请手动关闭</font> </font></p><br><br><p></p></body>";
        } else {
            document.getElementsByClassName("adc_bottom")[0].style.display = "none";
            document.getElementsByClassName("cright")[0].style.display = "none";
            document.getElementsByClassName("downs")[0].style.display = "none";
            document.getElementsByClassName("u3")[0].innerHTML = "";

            fid = document.documentElement.outerHTML.match(/down_process\('(\S*)'\)/)[1];
            getdown = new XMLHttpRequest();
            getdown.onreadystatechange = function () {
                if (getdown.readyState == 4) {
                    if (getdown.status == 200) {
                        dlURL = getdown.responseText
                        document.getElementsByClassName("u3")[0].innerHTML = dlURL;
                    } else {
                        alert("请求失败 可能当前脚本不是最新版本或接口在维护");
                    }
                }
            };
            downurl = apiurl + "/api/kufile?file=" + fid
            getdown.open("get", downurl);
            getdown.send(null);
        }
        return;
    }

    //判断网盘 并执行相应事件
    if (window.location.host == "www.xywp1.com") {
        if (window.location.pathname.split("/")[1].indexOf("vip.php") == 0) {
            document.querySelector("html")
                .innerHTML = "<head></head><body><p><font size=\"24\"><font color=\"#FF0000\">本人技术有限 无法屏蔽弹出页面 弹出本页面属于正常现象 请手动关闭</font> </font></p><br><br><p></p></body>";
        } else {
            document.getElementsByClassName("package-contrast-wap visible-xs")[0].style.display = "none";
            document.getElementsByClassName("col-lg-4 col-md-4 col-sm-6 col-xs-6")[0].style.display = "none";
            document.getElementsByClassName("col-lg-4 col-md-4 col-sm-6 col-xs-6")[1].style.display = "none";
            document.getElementsByClassName("package-contrast-wap visible-xs")[0].innerHTML = "";
            document.getElementsByClassName("package-intr-title")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会显示下载按钮";
            document.getElementsByClassName("package-pays")[0].style.display = "none";
            document.getElementsByClassName("package-contrast")[0].innerHTML = "";

            fid = document.documentElement.outerHTML.match(/add_ref\((\S*)\);/)[1];
            getdown = new XMLHttpRequest();
            getdown.onreadystatechange = function () {
                if (getdown.readyState == 4) {
                    if (getdown.status == 200) {
                        dlURL = getdown.responseText
                        document.getElementsByClassName("package-pays")[0].style.display = "";
                        document.getElementsByClassName("package-intr-title")[0].innerText = "加载完成 请点击右侧黄色按钮下载";
                        document.getElementsByClassName("package-pays")[0].innerHTML = '<a href="' + dlURL + '"  target="_blank"><span>&nbsp;VIP下载路线</span></a>';
                    } else {
                        document.getElementsByClassName("package-intr-title")[0].innerText = "下载链接加载失败 请刷新网页重试";
                    }
                }
            };
            downurl = apiurl + "/api/starpan?file=" + fid
            getdown.open("get", downurl);
            getdown.send(null);
        }
        return;
    }
    //判断网盘 并执行相应事件
    if (window.location.host == "www.rarclouds.com" || window.location.host == "www.rarwp.com") {
        if (window.location.pathname.split("/")[1].indexOf("vip.php") == 0) {
            document.querySelector("html")
                .innerHTML = "<head></head><body><p><font size=\"24\"><font color=\"#FF0000\">本人技术有限 无法屏蔽弹出页面 弹出本页面属于正常现象 请手动关闭</font> </font></p><br><br><p></p></body>";
        } else {
            document.getElementsByClassName("col-lg-4 col-md-4 col-sm-6 col-xs-6")[0].style.display = "none";
            document.getElementsByClassName("col-lg-4 col-md-4 col-sm-6 col-xs-6")[1].style.display = "none";
            document.getElementsByClassName("package-contrast-wap visible-xs")[0].innerHTML = "";
            document.getElementsByClassName("package-intr-title")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会显示下载按钮";
            document.getElementsByClassName("package-pays")[0].innerHTML = "";
            document.getElementsByClassName("package-contrast")[0].innerHTML = "";

            fid = document.documentElement.outerHTML.match(/add_ref\((\S*)\);/)[1];
            getdown = new XMLHttpRequest();
            getdown.onreadystatechange = function () {
                if (getdown.readyState == 4) {
                    if (getdown.status == 200) {
                        dlURL = getdown.responseText
                        document.getElementsByClassName("package-intr-title")[0].innerText = "加载完成 请点击右侧黄色按钮下载";
                        document.getElementsByClassName("package-pays")[0].innerHTML = dlURL;
                    } else {
                        document.getElementsByClassName("package-intr-title")[0].innerText = "下载链接加载失败 请刷新网页重试";
                    }
                }
            };
            downurl = apiurl + "/api/rardisk?file=" + fid
            getdown.open("get", downurl);
            getdown.send(null);
        }
        return;
    }
    //判断网盘 并执行相应事件
    if (window.location.host == "www.567yun.cn" || window.location.host == "www.567file.com") {
        if (document.getElementsByClassName("pull-right")[3]) {
            document.getElementsByClassName("pull-right")[3].innerHTML = ""
        } else {
            document.getElementsByClassName("pull-right")[2].innerHTML = ""
        }
        document.getElementsByClassName("row-fluid")[1].childNodes[3]
            .innerHTML = ""
        document.getElementsByClassName("btn btn-danger btn-block")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会提示 加载较慢 请稍等";
        fid = window.location.href.match(/file-(\S*).html/)[1];
        getdown = new XMLHttpRequest();
        getdown.onreadystatechange = function () {
            if (getdown.readyState == 4) {
                if (getdown.status == 200) {
                    dlURL = getdown.responseText
                    document.getElementsByClassName("btn btn-danger btn-block")[0].innerText = "加载完成 点我下载";
                    document.getElementsByClassName("btn btn-danger btn-block")[0].href = dlURL
                } else {
                    document.getElementsByClassName("btn btn-danger btn-block")[0].innerText = "加载失败 请刷新页面重试";
                }
            }
        }
        downurl = apiurl + "/api/567pan?file=" + fid
        getdown.open("get", downurl);
        getdown.send(null);
        return;
    }
    //判断网盘 并执行相应事件
    if (window.location.host == "www.expfile.com") {
        document.getElementsByClassName("module-line")[0].innerText = "请等待片刻 当前下载链接加载中 加载完成会显示下载按钮"
        document.getElementsByClassName("module-privilege")[0].innerHTML = ""
        fid = document.documentElement.outerHTML.match(/load_down_addr1\('(\S*)'\)/)[1];
        getdown = new XMLHttpRequest();
        getdown.onreadystatechange = function () {
            if (getdown.readyState == 4) {
                if (getdown.status == 200) {
                    dlURL = getdown.responseText
                    if (typeof document.getElementsByClassName("down_btn btn btn-success")[1] === "undefined") {
                        document.getElementsByClassName("module-line")[0].innerText = "加载完成 请点击按钮下载";
                        let expdownload = document.createElement("a");
                        expdownload.innerText = "点击下载 每个按钮下载链接都一样 这样只是提醒你下载点这里";
                        expdownload.className = "down_btn btn btn-success";
                        expdownload.onclick = function () {
                            Download(dlURL)
                        };
                        document.getElementsByClassName("module-privilege")[0].append(expdownload);
                        document.getElementsByClassName("module-privilege")[0].append(expdownload);
                    }
                } else {
                    document.getElementsByClassName("module-line")[0].innerText = "下载链接加载失败 请刷新网页重试";
                }
            }
        };
        downurl = apiurl + "/api/expfile?file=" + fid
        getdown.open("get", downurl);
        getdown.send(null);
        return;
    }


    tishi("本功能修改于https://github.com/sayokey/link-helper/", "kaiyuantip")

    // 创建一个面板用来展示解析结果
    const htmlDivElement = document.createElement('div');
    htmlDivElement.id = 'link_helper_download'
    htmlDivElement.style.position = 'fixed'
    htmlDivElement.style.top = '50%'
    htmlDivElement.style.left = '50%'
    htmlDivElement.style.transform = 'translate(-50%, 100px)'
    // 使用transform属性来调整面板的位置
    htmlDivElement.style.width = '350px'
    htmlDivElement.style.height = '150px'
    htmlDivElement.style.display = 'none'
    htmlDivElement.style.border = '1px solid red'
    htmlDivElement.style.borderRadius = '20px'
    htmlDivElement.style.backgroundColor = 'white'
    htmlDivElement.style.textAlign = 'center'
    htmlDivElement.style.borderRadius = '3%';
    htmlDivElement.style.zIndex = '999';




    // 创建一个按钮以开始解析
    const htmlButtonElement = document.createElement('div');
    htmlButtonElement.id = 'btn'
    htmlButtonElement.innerText = '[LINK-HELPER]获取下载地址'
    // htmlButtonElement.style.position = 'absolute' // 不需要使用绝对定位
    // htmlButtonElement.style.top = '150px' // 不需要设置top和left
    // htmlButtonElement.style.left = '70vw'
    htmlButtonElement.style.borderRadius = '3%';
    htmlButtonElement.onclick = function () {
        htmlButtonElement.innerText = '[LINK-HELPER]努力解析中'
        getDurl(function (result) {
            if (window.location.hostname == "www.520-vip.com") {
                if (result.match(/pt1/)) {
                    result = result.replace(/pt1/, 'sc');
                }
            }
            result = result.replace(/color='#FFFFFF'/, '');
            htmlDivElement.style.display = 'block'
            htmlDivElement.innerHTML = result + '<div style="color: red">解析完成!</div>'
            htmlButtonElement.innerText = '[LINK-HELPER]获取下载地址'
        });
    }


    const htmlIssuesElement = document.createElement('div');
    htmlIssuesElement.id = 'btn'
    htmlIssuesElement.innerText = '有问题?点我提交反馈'
    // htmlIssuesElement.style.position = 'absolute' // 不需要使用绝对定位
    // htmlIssuesElement.style.top = '200px' // 不需要设置top和left
    // htmlIssuesElement.style.left = '70vw'
    htmlIssuesElement.style.borderRadius = '3%';
    htmlIssuesElement.style.margin = '60px auto'
    htmlIssuesElement.onclick = function () {
        window.open('https://greasyfork.org/scripts/448486/feedback')
    }


    document.body.appendChild(document.createElement('style'))
        .textContent = `
    #btn {
        color:white;
        width:200px;
        height:39px;
        border:1px solid #ed7246;
        align-items:center;
        font-weight:450;
        border-radius:20px;
        justify-content:center;
        background-color:#ed7246;
        display:flex;
        cursor: pointer;
        position: fixed;
        left: 50%;
        top: 20%;
        transform: translate(-50%, 100px);
    }
`;


    // 请求路径
    const send_uri = '/ajax.php'

    // action id json,这个id需要抓包获取,我们会提供脚本支持的网盘id,如果你需要增加适配网盘且你不会或者这个id,你可以在github中提交一个issues并说明，我们会协助你。
    // 格式为 key:value key:window.location.hostname,value:action id
    const action_id = {
        'www.xingyaopan.com': 'load_down_addr5',
        'www.77file.com': 'load_down_addr1',
        'www.xunniufile.com': 'load_down_addr1',
        'www.567file.com': 'load_down_addr10',
        'www.expfile.com': 'load_down_addr1',
        'xueqiupan.com': 'load_down_addr1',
        'xfpan.cc': 'load_down_addr1',
        'ownfile.net': 'load_down_addr1',
        'www.dudujb.com': 'load_down_addr1',
        'www.1988wp.com': 'load_down_addr1',
        'rosefile.net': 'load_down_addr1',
        'kufile.net': 'load_down_file_user',
        //		"www.eos-53.com": "load_down_addr1",
        "www.520-vip.com": "load_down_addr1",
        "www.711pan.com": "www.711pan.com",
        "www.ayunpan.com": "load_down_addr1"
    }

    // 获取完整请求路径
    function getURL() {
        return document.location.origin + send_uri;
    }

    // 获取action 在action_id中找不到会返回undefined
    function getAction() {
        return action_id[window.location.hostname]
    }

    // 获取fileid
    function getFileId() {
        if (/add_ref\((.*?)\);/.test(document.documentElement.outerHTML)) {
            return document.documentElement.outerHTML.match(/add_ref\((.*?)\);/)[1]
        } else if (/down-(\S*).html/.test(document.documentElement.outerHTML)) {
            return document.documentElement.outerHTML.match(/down-(\S*).html/)[1]
        } else if (/file-(\S*).html/.test(window.location.href)) {
            return window.location.href.match(/file-(\S*).html/)[1];
        } else if (/fileId=/.test(window.location.href)) {
            return window.location.href.match(/fileId=(\S*)/)[1];
        } else {
            alert("获取文件id失败 请联系作者修复")
            return null;
        }
    }

    function guid() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getguid(text) {
        if (typeof text == "string") {
            return text;
        }
        if (localStorage.getItem("guiddata") == null) {
            localStorage.setItem("guiddata", guid())
        }
        return localStorage.getItem("guiddata")
    }

    function moqiqi(fileid) {
        tishi("当前使用模拟客户端解析下载 推荐在416行和418行插入自己账号数据", "downtip")
        var downkey = MD5(fileid + "downvawsvnopwqv")
        //App端登录时抓包获取
        var UID = "982148"
        //密码 更改时将MD5括号双引号中数据替换
        var pass = MD5("ejqooaxk")
        //修改getguid中数值来自定义agent(此字段也可通过抓包获取 也可通过本脚本随机生成)
        var agent = MD5(getguid())
        console.log('fileid=' + fileid + '&down_key=' + downkey + '&passwd=' + pass + '&uid=' + UID + '&agent=' + agent)
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://api.77drive.com/api/apidown.php',
            data: 'fileid=' + fileid + '&down_key=' + downkey + '&passwd=' + pass + '&uid=' + UID + '&agent=' + agent,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "user-agent": "okhttp/3.12.3"
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功')
                    var dllink = JSON.parse(res.responseText)[0].link
                    console.log('解析链接为' + dllink)
                    Download(dllink)
                } else {
                    console.log('失败')
                    console.log(res)
                }
            },
            onerror: function (err) {
                console.log('error')
                console.log(err)
            }
        });
        return;
    }

    // 提交解析
    function getDurl(callback) {
        const url = getURL();
        const action = getAction();
        const fileid = getFileId();

        if (fileid == null) {
            return null;
        }

        let result = null;

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(xhr.responseText)
                    //return xhr.responseText;
                } else {
                    htmlButtonElement.innerText = '[LINK-HELPER]获取下载地址'
                    alert("请求失败 可能当前脚本不是最新版本或接口在维护");
                }
            }
        };
        xhr.open("post", url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`action=${action}&file_id=${fileid}`);
    }

    if (typeof (getAction()) != "undefined") {
        if (/www.77file.com\/wap.php/.test(window.location.href)) {
            document.getElementsByClassName("dump")[2].innerText = "立即下载"
            const onclickstr = document.getElementsByClassName("dump")[2].onclick.toString()
            const fileid = onclickstr.match(/fileid=(\S*)&key=/)[1]
            document.getElementsByClassName("dump")[2].onclick = function () {
                moqiqi(fileid)
            }
            document.getElementsByClassName("dump")[3].innerText = "有问题?点我提交issues"
            document.getElementsByClassName("dump")[3].onclick = function () {
                window.open('https://greasyfork.org/scripts/448486/feedback')
            }
            document.getElementsByClassName("btns")[4].style.display = "none";
            document.getElementsByClassName("btns")[5].style.display = "none";
            return;
        }
        document.body.appendChild(htmlButtonElement)
        document.body.appendChild(htmlIssuesElement)
        document.body.appendChild(htmlDivElement)
        if (/www.77file.com\/s/.test(window.location.href)) {
            tishi("新增切换为模拟客户端登录解析 请执行document.setMode() 切换 切换后下载速度较之前大幅提高 只要该方法可用 你就可在控制台内看到这个提示 切换后再次切换或刷新页面会变为原模式", "qietip0")
            console.log("新增切换为模拟客户端登录解析 请执行document.setMode() 切换 切换后下载速度较之前大幅提高 只要该方法可用 你就可在控制台内看到这个提示 切换后再次切换或刷新页面会变为原模式")
            document.originMode = htmlButtonElement.onclick
            document.Mode = 0
            document.setMode = function () {
                if (document.Mode == 1) {
                    document.Mode == 0
                    console.log("切换为原模式")
                    htmlButtonElement.onclick = function () {
                        document.originMode()
                    }
                    return
                }
                console.log("切换为模拟客户端登录模式")
                const fileid = getFileId()
                htmlButtonElement.onclick = function () {
                    moqiqi(fileid)
                }
                document.Mode = 1
            }
        } else if (/www.711pan.com/.test(window.location.href)) {
            htmlButtonElement.onclick = function () {
                htmlButtonElement.innerText = '[LINK-HELPER]努力解析中'
                const action = getAction();
                const fileid = getFileId();

                if (fileid == null) {
                    return null;
                }

                const url = "https://api.711pan.net/WSApi/common/downloadLink/" + fileid;

                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {

                            var result = JSON.parse(xhr.responseText).result
                            //https://dmu7s.711pan.net/file/文件名称?token=返回的token
                            var downloadDomain = result.downloadDomain
                            var token = result.token
                            var filename = document.querySelectorAll(".flex-col")[0].innerText
                            var downurl = downloadDomain + "/file/" + filename + "?token=" + token

                            htmlDivElement.style.display = 'block'
                            htmlDivElement.innerHTML = '<a href="' + downurl + '">点击下载</a><div id="copyurl">点击复制链接 </div><div style="color: red">解析完成!</div>'
                            document.getElementById("copyurl").addEventListener("click", function () {
                                copyText(downurl)
                            });
                            htmlButtonElement.innerText = '[LINK-HELPER]获取下载地址'
                        } else {
                            alert("请求失败 可能当前脚本不是最新版本或接口在维护");
                        }
                    }
                };
                xhr.open("post", url);
                xhr.setRequestHeader('Content-Type', 'application/json, text/plain, */*');
                xhr.send(``);
            }

        }
    }

    function MD5(instring) {
        var hexcase = 0;
        /* hex output format. 0 - lowercase; 1 - uppercase        */
        var b64pad = "";
        /* base-64 pad character. "=" for strict RFC compliance   */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_md5(s) {
            return rstr2hex(rstr_md5(str2rstr_utf8(s)));
        }

        function b64_md5(s) {
            return rstr2b64(rstr_md5(str2rstr_utf8(s)));
        }

        function any_md5(s, e) {
            return rstr2any(rstr_md5(str2rstr_utf8(s)), e);
        }

        function hex_hmac_md5(k, d) {
            return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
        }

        function b64_hmac_md5(k, d) {
            return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)));
        }

        function any_hmac_md5(k, d, e) {
            return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e);
        }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function md5_vm_test() {
            return hex_md5("abc")
                .toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
        }

        /*
         * Calculate the MD5 of a raw string
         */
        function rstr_md5(s) {
            return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        function rstr_hmac_md5(key, data) {
            var bkey = rstr2binl(key);
            if (bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
            return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
        }

        /*
         * Convert a raw string to a hex string
         */
        function rstr2hex(input) {
            try {
                hexcase
            } catch (e) {
                hexcase = 0;
            }
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F) +
                    hex_tab.charAt(x & 0x0F);
            }
            return output;
        }

        /*
         * Convert a raw string to a base-64 string
         */
        function rstr2b64(input) {
            try {
                b64pad
            } catch (e) {
                b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) |
                    (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
                    (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8) output += b64pad;
                    else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        }

        /*
         * Convert a raw string to an arbitrary string encoding
         */
        function rstr2any(input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;

            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }

            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0) {
                        quotient[quotient.length] = q;
                    }
                }
                remainders[j] = x;
                dividend = quotient;
            }

            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--) {
                output += encoding.charAt(remainders[i]);
            }

            return output;
        }

        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        function str2rstr_utf8(input) {
            var output = "";
            var i = -1;
            var x, y;

            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }

                /* Encode output as utf-8 */
                if (x <= 0x7F) {
                    output += String.fromCharCode(x);
                } else if (x <= 0x7FF) {
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                        0x80 | (x & 0x3F));
                } else if (x <= 0xFFFF) {
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
                } else if (x <= 0x1FFFFF) {
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                        0x80 | ((x >>> 12) & 0x3F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
                }
            }
            return output;
        }

        /*
         * Encode a string as utf-16
         */
        function str2rstr_utf16le(input) {
            var output = "";
            for (var i = 0; i < input.length; i++) {
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF,
                    (input.charCodeAt(i) >>> 8) & 0xFF);
            }
            return output;
        }

        function str2rstr_utf16be(input) {
            var output = "";
            for (var i = 0; i < input.length; i++) {
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                    input.charCodeAt(i) & 0xFF);
            }
            return output;
        }

        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binl(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++) {
                output[i] = 0;
            }
            for (var k = 0; k < input.length * 8; k += 8) {
                output[k >> 5] |= (input.charCodeAt(k / 8) & 0xFF) << (k % 32);
            }
            return output;
        }

        /*
         * Convert an array of little-endian words to a string
         */
        function binl2rstr(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8) {
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            }
            return output;
        }

        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        function binl_md5(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        return hex_md5(instring);
    }

}