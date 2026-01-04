// ==UserScript==
// @name         海角社区VLC
// @namespace    http://tampermonkey.net/
// @version      9.35.14
// @description  目前可以用，可以查看金币钻石视频,需要手动注册登录
// @author       xsephiroth
// @license      MIT
// @match       https://tools.thatwind.com/tool*
// @match        https://*/post/details*
// @icon         https://hjbc30.top/images/common/project/favicon.ico
// @run-at      document-start
// @grant       unsafeWindow
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/494201/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BAVLC.user.js
// @updateURL https://update.greasyfork.org/scripts/494201/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BAVLC.meta.js
// ==/UserScript==


function pwd() {
    let word = ''
    let a = '48/46/116/115'
    let b = a.split('/')
    for (let c in b) {
        let d = parseInt(b[c])
        let e = String.fromCharCode(d)
        word = word + e
    }
    return word
}

function clearContainer(container) {
    if (container.hasChildNodes()) {
        container.innerHTML = "";
        container.style.border = "";
    }
}
function getContainer() {
    const existContainer = document.querySelector(".big-img-container-c");
    if (!existContainer) {
        const container = document.createElement("div");
        container.className = "big-img-container-c";
        container.style.position = "fixed";
        container.style.top = 0;
        container.style.left = 0;
        container.style.zIndex = 999999;
        container.onclick = function () {
            clearContainer(container);
        };
        document.querySelector("html").appendChild(container);
        return container;
    }
    return existContainer;
}




(function () {
    'use strict';


    /*
    
        if (location.host === "tools.thatwind.com" || location.host === "localhost:3000") {
            alert("sdfdsf")
        }
    */


    let newurl = ""
    let downloadurl = ""
    let fasongtext = ""
    let pidtext = ""
    let posttext=""
    let video_time_length=""
    let isphone = IsPhone()
    let isfirst=true
    if (isphone) {
        $("body").append(" <div id='myDiv'; style='right: 3px;width: 40px;height: 40px;font-size: 12px;border-radius:50%; bottom: 120px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>打赏脚本</div>");
        $("body").append(" <div id='dmyDiv'; style='right: 3px;width: 40px;height: 40px;font-size: 12px;border-radius:50%; bottom: 160px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>下载</div>");
        $("body").append(" <div id='jxmyDiv'; style='right: 3px;width: 40px;height: 40px;font-size: 12px;border-radius:50%; bottom: 200px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>等待解析</div>");
        $("body").append(" <div id='jxspmyDiv'; style='right: 3px;width: 40px;height: 40px;font-size: 12px;border-radius:50%; bottom: 240px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>准备中</div>");
    }
    else {
        $("body").append(" <div id='myDiv'; style='right: 3px;width: 50px;height: 50px;font-size: 16px;border-radius:50%; bottom: 120px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>打赏脚本</div>");
        $("body").append(" <div id='dmyDiv'; style='right: 3px;width: 50px;height: 50px;font-size: 16px;border-radius:50%; bottom: 170px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>下载</div>");
        $("body").append(" <div id='jxmyDiv'; style='right: 3px;width: 50px;height: 50px;font-size: 16px;border-radius:50%; bottom: 220px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>等待解析</div>");
        $("body").append(" <div id='jxspmyDiv'; style='right: 3px;width: 50px;height: 50px;font-size: 16px;border-radius:50%; bottom: 270px;background: #FF6666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;'>准备中</div>");
    }

    var jxspmyDiv = document.getElementById("jxspmyDiv"); // 获取到id为"myDiv"的div元素
    jxspmyDiv.addEventListener('click', function (e) {
        if (fasongtext.indexOf("IV=") === -1 || fasongtext.indexOf("包含") === -1 || fasongtext.indexOf("[--秒]") > -1) {
            jxspmyDiv.innerHTML = "解析失败"
            alert("解析失败，请刷新重试")
            return
        }

        
        jxspmyDiv.innerHTML = "解析中"
        


        fasong(fasongtext+ "----" +posttext+ "----" +video_time_length)

    });


    var jxmyDiv = document.getElementById("jxmyDiv"); // 获取到id为"myDiv"的div元素
    jxmyDiv.addEventListener('click', function (e) {
        const textarea = document.createElement('textarea');
        textarea.value = downloadurl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log("downloadurl=" + downloadurl);
        alert("复制下载链接成功");
        //jxmyDiv.innerHTML = "fff"


    });


    var dmyDiv = document.getElementById("dmyDiv"); // 获取到id为"myDiv"的div元素
    dmyDiv.addEventListener('click', function (e) {
        //alert("你点击了DIV！"); // 当点击该div时会触发此函数并显示提示信息
        var currentUrl = window.location.href;
        // 输出当前网址

        let url = "https://tools.thatwind.com/tool/m3u8downloader#m3u8="
        let url2 = "&referer=" + currentUrl + "&filename=%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA"
        let url3 = url + newurl + url2
        GM_openInTab(url3, { active: true });
        console.log(url3);
        //window.location.href = url;
        //window.open(url, "_blank");


    });




    var myDiv = document.getElementById("myDiv"); // 获取到id为"myDiv"的div元素
    myDiv.addEventListener('click', function (e) {
        //alert("你点击了DIV！"); // 当点击该div时会触发此函数并显示提示信息
        const container = getContainer();
        const halfWidth = window.innerWidth / 2;
        const halfHeight = window.innerHeight / 2;
        clearContainer(container);


        if (isphone) {
            const containerX = halfWidth - 160;
            const containerY = halfHeight - 140;
            container.style.left = `${containerX}px`;
            container.style.top = `${containerY}px`;
            container.style.border = "1px solid #000";
            const bigImg = e.target.cloneNode();
            container.appendChild(bigImg);
            // 创建img标签并设置src属性为要显示的图片链接
            var img = document.createElement('img');
            img.setAttribute("src", "https://pic.imgdb.cn/item/661fc80f0ea9cb140391c2cb.png");
        }
        else {
            const containerX = halfWidth - 200;
            const containerY = halfHeight - 140;
            container.style.left = `${containerX}px`;
            container.style.top = `${containerY}px`;
            container.style.border = "1px solid #000";
            const bigImg = e.target.cloneNode();
            container.appendChild(bigImg);
            // 创建img标签并设置src属性为要显示的图片链接
            var img = document.createElement('img');
            img.setAttribute("src", "https://pic.imgdb.cn/item/661fc6920ea9cb14038177db.png");

        }


        var bodyElement = document.getElementsByClassName('big-img-container-c')[0];
        bodyElement.appendChild(img);


    });
    function decode(s) {
        return atob(atob(atob(s)));
    }

    function encode(s) {
        return btoa(btoa(btoa(s)));
    }

    function jencode(s) {
        return encode(JSON.stringify(s, `utf-8`));
    }

    function get_real_m3u8_path(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
            console.log(`解析失败!`);
            return url;
        }
        let ts_path = request.responseText.split('\n')[6];
        let id = ts_path.match(/([\w_]+_?)[\d]+.ts/)[1];
        let rurl = url.replace(/([\w_]+).m3u8/, `${id}.m3u8`);
        return rurl;
    }
    function runAsync(url, send_type, data_ry) {
        console.log("请求开始");
        var p = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: send_type,
                url: url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                data: data_ry,
                onload: function (response) {
                    console.log("请求成功");
                    //console.log(response.responseText);
                    resolve(response.responseText);
                },
                onerror: function (response) {
                    console.log("请求失败");
                    jxspmyDiv.innerHTML = "刷新重试"
                    alert("解析失败，检查脚本是否有更新")
                    reject("请求失败");

                }
            });
        })
        //console.log("p="+p);
        return p;
    }
    function get_user_dict(host, id) {
        var url = `https://${host}.com/api/topic/node/topics?page=1&userId=${id}&type=0`;
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
            console.log(`用户信息解析失败!`);
            return {};
        }
        let p = JSON.parse(request.responseText, `utf-8`).data;
        p = JSON.parse(decode(p), `utf-8`);
        let total = p.page.total;
        let uid = `[banned]`;
        if (`results` in p) {
            uid = p.results[0].user.nickname + ` ` + uid;
        }
        return {
            'isFavorite': false,
            'likeCount': 12,
            'user': {
                'id': parseInt(id),
                'nickname': uid,
                'avatar': '29',
                'description': `hj community`,
                'topicCount': total,
                'videoCount': 0,
                'commentCount': 303,
                'fansCount': 57,
                'favoriteCount': 39,
                'status': 0,
                'sex': 1,
                'vip': 0,
                'vipExpiresTime': '0001-01-01 00:00:00',
                'certified': false,
                'certVideo': false,
                'certProfessor': false,
                'famous': false,
                'forbidden': false,
                'tags': null,
                'role': 0,
                'popularity': 10,
                'diamondConsume': 0,
                'title': { 'id': 0, 'name': '', 'consume': 0, 'consumeEnd': 0, 'icon': '' },
                'friendStatus': false,
                'voiceStatus': false,
                'videoStatus': false,
                'voiceMoneyType': 0,
                'voiceAmount': 0,
                'videoMoneyType': 0,
                'videoAmount': 0,
                'depositMoney': 0
            }
        }
    }

    function destory() {
        document.getElementsByClassName('preview-title')[0].remove()
    }



    function remove_vip(body) {
        body.node.vipLimit = 0;
        let attachments = body.attachments;
        let image_urls = [];
        let video_urls = ``;
        let has_video = -1;
        for (var i = 0; i < attachments.length; i++) {
            var atta = attachments[i];
            if (atta.category === 'images') {
                image_urls.push(`<img src="${atta.remoteUrl}" data-id="${atta.id}"/>`)
            }
            if (atta.category === 'video') {
                has_video = i;
            }
        }
        let images = image_urls.join();
        if (has_video >= 0) {
            let [nbody, v] = replace_m3u8(body, has_video);
            body = nbody;
            video_urls = `<video src="${v.remoteUrl}" data-id="${v.id}"/></video>`
        }
        let content = body.content.replace(/\[[图片视频]+\]?/, ``);
        content = body.content.replace(/此处内容售价.*?您还没有购买，请购买后查看！/, ``);
        content = '<html><head></head><body>' + content + '<br/>' + images + '<br/>' + video_urls + '<br/></body></html>';
        body.content = content;
        return body;
    }
    async function play(url) {
        console.log("url=" + url)
        let isphone = IsPhone()
        let playpos = ''
        if (isphone) {
            //document.querySelector('.sell-btn').remove()
            playpos = '.sell-btn'
            let videoInfo = document.querySelector(playpos)
            videoInfo.innerHTML = '<video id="video" controls autoplay width="100%"></video>'
            var video = document.getElementById('video');
            var hls = new Hls();
            // bind them together
            console.log("11");
            hls.attachMedia(video);
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                console.log("video and hls.js are now bound together !");

                hls.loadSource(url);
                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    console.log("manifest loaded, found " + data.levels.length + " quality level");
                });
            });
        }
        else {
            playpos = '.sell-btn'
            window.dp = new DPlayer({
                element: document.querySelector(playpos),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                lang: 'zh',
                screenshot: true,
                hotkey: true,
                preload: 'auto',
                video: {
                    url: url,
                    type: 'hls'
                }
            })
        }
    }




    function hasClass(element, className) {
        return element.classList.contains(className);
    }

    function 文本_取右边(str, char) {
        const index = str.indexOf(char);
        if (index != -1) {
          return str.substring(index + char.length, index + str.length);
        }
        return ""; // 如果字符不存在，返回原字符串
      
      }
    async function replace_m3u8(body, has_video) {
        jxspmyDiv.innerHTML = "准备中"
        jxmyDiv.innerHTML = " 等待解析"
        let attachments = body.attachments;
        let vidx = has_video;
        if (vidx < 0) {
            return [body, undefined];
        }
        if (body.sale === null || body.sale.money_type == 0) {
            return [body, attachments[vidx]];
        }
        let url = attachments[vidx].remoteUrl;
        //console.log("url", url)

        var currentUrl = window.location.href;
        //console.log("url=", currentUrl)
        video_time_length = attachments[vidx].video_time_length;
        let index = currentUrl.indexOf("/post/details"); // 找到逗号的索引
        let leftPart = currentUrl.substring(0, index); // 截取左边的字符串
        console.log(leftPart); // 输出: Hello
        index = currentUrl.indexOf("pid="); // 找到逗号的索引
        pidtext = currentUrl.substring(index+4,currentUrl.length); // 截取左边的字符串


        console.log("pidtext=", pidtext)

        let res = await fetch(leftPart + url, {
            method: 'get',
        })
        let m3u8Text = await res.text()
        var textsent = m3u8Text
        let isphone = IsPhone()
        if (isphone) {
            var div = document.getElementsByClassName("nologin")[0]; // 获取第一个符合条件的元素
            console.log('div=', div);
            if (typeof div === 'undefined') {
                // do something

            } else {
                alert("请先登录-m")
                return
            }

            var i = 1;
            var intervalId = setInterval(function () {
                // 获取需要判断的元素
                let infolist = document.getElementsByClassName('html-box ishide')[0]
                infolist.className = 'html-box';
                let infophone = document.getElementsByClassName('preview-btn')[0]

                if (infophone) {

                    textsent = infophone.innerText + "----" + textsent
                    //console.log(textsent);
                    if (textsent.indexOf("IV=") === -1 || textsent.indexOf("包含") === -1 || textsent.indexOf("[--秒]") > -1) {
                        jxspmyDiv.innerHTML = "解析失败"
                        alert("准备失败，请刷新重试")
                        return
                    }



                    fasongtext = textsent
                    jxspmyDiv.innerHTML = "点击解析"
                    //fasong(textsent)
                    // 如果元素存在则执行相应的命令
                    console.log("元素已经存在！");
                    clearInterval(intervalId); // 清除定时器
                    // 这里写入你想要执行的命令或者其他操作判断
                    fasongtext=fasongtext+"hhhjjj"
                    // 这里写入你想要执行的命令或者其他操作
                } else {
                    console.log("元素还不存在...");
                }
                i++
                if (i > 20) {
                    jxspmyDiv.innerHTML = "解析失败"
                    alert("准备失败，请刷新重试")
                }
            }, 1000);
        }
        else {

            var div = document.getElementsByClassName("navigation_button")[0]; // 获取第一个符合条件的元素

            if (div != null) {
                // 元素存在
            } else {
                alert("请先登录-p")
                return
            }

            var intervalId = setInterval(function () {
                // 获取需要判断的元素
                let info = document.getElementsByClassName('preview-title')[0]
                let videoInfo = info.getElementsByClassName('video-div')[0]


                if (videoInfo) {
                    textsent = info.innerText + "----" + textsent
                    //console.log(textsent);
                    if (textsent.indexOf("IV=") === -1 || textsent.indexOf("包含") === -1 || textsent.indexOf("[--秒]") > -1) {
                        jxspmyDiv.innerHTML = "解析失败"
                        alert("准备失败，请刷新重试")
                        return
                    }
                    fasongtext = textsent
                    jxspmyDiv.innerHTML = "点击解析"
                    //fasong(textsent)
                    // 如果元素存在则执行相应的命令
                    console.log("元素已经存在！");
                    clearInterval(intervalId); // 清除定时器
                    // 这里写入你想要执行的命令或者其他操作
                    fasongtext=fasongtext+"hhhjjj"
                    // 这里写入你想要执行的命令或者其他操作判断
                } else {
                    console.log("元素还不存在...");
                }
                i++
                if (i > 20) {
                    jxspmyDiv.innerHTML = "解析失败"
                    alert("准备失败，请刷新重试")
                }
            }, 1000);




        }

        
    }

    class BaseClass {

        constructor() {

            if (GM_getValue('iconPositionSetPage') != 0) {
                /*cookie存储
                iconVipTop = this.getCookie('iconTop')?this.getCookie('iconTop'):iconVipTop;
    
                iconVipPosition = this.getCookie('iconPosition')?this.getCookie('iconPosition'):iconVipPosition;
    
                selectedLeft = iconVipPosition=='left'?'selected':'';
    
                selectedRight = iconVipPosition=='right'?'selected':'';
    
                iconVipWidth = this.getCookie('iconWidth')?this.getCookie('iconWidth'):iconVipWidth;
                */

                iconVipTop = GM_getValue('iconTop') || GM_getValue('iconTop') == 0 ? GM_getValue('iconTop') : iconVipTop;

                iconVipPosition = GM_getValue('iconPosition') ? GM_getValue('iconPosition') : iconVipPosition;

                selectedLeft = iconVipPosition == 'left' ? 'selected' : '';

                selectedRight = iconVipPosition == 'right' ? 'selected' : '';

                iconVipWidth = GM_getValue('iconWidth') ? GM_getValue('iconWidth') : iconVipWidth;

                iconWaitTime = GM_getValue('iconWaitTime') ? GM_getValue('iconWaitTime') * 1000 : iconWaitTime;

                iconVipOpacity = GM_getValue('iconOpacity') || GM_getValue('iconOpacity') == 0 ? GM_getValue('iconOpacity') : iconVipOpacity;

            }

            GM_registerMenuCommand("设置", () => this.menuSet());

            this.setStyle();
        }

        setStyle() {
            let menuSetStyle = `
                    .zhmMask{
                        z-index:999999999;
                        background-color:#000;
                        position: fixed;top: 0;right: 0;bottom: 0;left: 0;
                        opacity:0.8;
                    }
                    .wrap-box{
                        z-index:1000000000;
                        position:fixed;;top: 50%;left: 50%;transform: translate(-50%, -200px);
                        width: 300px;
                        color: #555;
                        background-color: #fff;
                        border-radius: 5px;
                        overflow:hidden;
                        font:16px numFont,PingFangSC-Regular,Tahoma,Microsoft Yahei,sans-serif !important;
                        font-weight:400 !important;
                    }
                    .setWrapHead{
                        background-color:#f24443;height:40px;color:#fff;text-align:center;line-height:40px;
                    }
                    .setWrapLi{
                        margin:0px;padding:0px;
                    }
                    .setWrapLi li{
                        background-color: #fff;
                        border-bottom:1px solid #eee;
                        margin:0px !important;
                        padding:12px 20px;
                        display: flex;
                        justify-content: space-between;align-items: center;
                        list-style: none;
                    }
    
                    .setWrapLiContent{
                        display: flex;justify-content: space-between;align-items: center;
                    }
                    .setWrapSave{
                        position:absolute;top:-2px;right:10px;font-size:24px;cursor:pointer
                    }
                    .iconSetFoot{
                        position:absolute;bottom:0px;padding:10px 20px;width:100%;
                    z-index:1000000009;background:#fef9ef;
                    }
                    .iconSetFootLi{
                        margin:0px;padding:0px;
                    }
    
                    .iconSetFootLi li{
                        display: inline-flex;
                        padding:0px 2px;
                        justify-content: space-between;align-items: center;
                        font-size: 12px;
                    }
                    .iconSetFootLi li a{
                        color:#555;
                    }
                    .iconSetFootLi a:hover {
                        color:#fe6d73;
                    }
                    .iconSetPage{
                        z-index:1000000001;
                        position:absolute;top:0px;left:300px;
                        background:#fff;
                        width:300px;
                        height:100%;
                    }
                    .iconSetUlHead{
                    padding:0px;
                    margin:0px;
                    }
                    .iconSetPageHead{
                        border-bottom:1px solid #ccc;
                        height:40px;
                        line-height:40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background-color:#fe6d73;
                        color:#fff;
                        font-size: 15px;
                    }
                    .iconSetPageLi{
                        margin:0px;padding:0px;
                    }
                    .iconSetPageLi li{
                        list-style: none;
                        padding:8px 20px;
                        border-bottom:1px solid #eee;
                    }
                    .zhihuSetPage{
                        z-index:1000000002;position:absolute;top:0px;left:300px;background:#fff;width:300px;height:100%;
                    }
                    .iconSetPageInput{
                        display: flex !important;justify-content: space-between;align-items: center;
                    }
                    .zhihuSetPageLi{
                        margin:0px;padding:0px;
                        height:258px;
                        overflow-y: scroll;
                    }
    
                    .zhihuSetPageContent{
                        display: flex !important;justify-content: space-between;align-items: center;
                    }
    
                    .zhm_circular{
                        width: 40px;height: 20px;border-radius: 16px;transition: .3s;cursor: pointer;box-shadow: 0 0 3px #999 inset;
                    }
                    .round-button{
                        width: 20px;height: 20px;;border-radius: 50%;box-shadow: 0 1px 5px rgba(0,0,0,.5);transition: .3s;position: relative;
                    }
                    .zhm_back{
                        border: solid #FFF; border-width: 0 3px 3px 0; display: inline-block; padding: 3px;transform: rotate(135deg);  -webkit-transform: rotate(135deg);margin-left:10px;cursor:pointer;
                    }
                    .to-right{
                        margin-left:20px; display: inline-block; padding: 3px;transform: rotate(-45deg); -webkit-transform: rotate(-45deg);cursor:pointer;
    
                    }
                    .iconSetSave{
                        font-size:24px;cursor:pointer;margin-right:5px;margin-bottom:4px;color:#FFF;
                    }
                    .zhm_set_page{
                        z-index:1000000003;
                        position:absolute;
                        top:0px;left:300px;
                        background:#fff;
                        width:300px;
                        height:100%;
                    }
                    .zhm_set_page_header{
                        border-bottom:1px solid #ccc;
                        height:40px;
                        line-height:40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background-color:#fe6d73;
                        color:#fff;
                        font-size: 15px;
                    }
                    .zhm_set_page_content{
                        display: flex !important;justify-content: space-between;align-items: center;
                    }
                    .zhm_set_page_list{
                        margin:0px;padding:0px;
                        height: 220px;
                        overflow-y: scroll;
                    }
    
                    .zhm_set_page_list::-webkit-scrollbar {
                        /*滚动条整体样式*/
                        width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                        height: 1px;
                    }
                    .zhm_set_page_list::-webkit-scrollbar-thumb {
                        /*滚动条里面小方块*/
                        border-radius   : 2px;
                        background-color: #fe6d73;
                    }
                    .zhm_set_page_list::-webkit-scrollbar-track {
                        /*滚动条里面轨道*/
                        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                        background   : #ededed;
                        border-radius: 10px;
                    }
                    .zhm_set_page_list li{
                        /*border-bottom:1px solid #ccc;*/
                        padding:12px 20px;
                        display:block;
                        border-bottom:1px solid #eee;
                    }
                    li:last-child{
                        border-bottom:none;
                    }
                    .zhm_scroll{
                    overflow-y: scroll !important;
                    }
                    .zhm_scroll::-webkit-scrollbar {
                        /*滚动条整体样式*/
                        width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                        height: 1px;
                    }
                    .zhm_scroll::-webkit-scrollbar-thumb {
                        /*滚动条里面小方块*/
                        border-radius   : 2px;
                        background-color: #fe6d73;
                    }
                    .zhm_scroll::-webkit-scrollbar-track {
                        /*滚动条里面轨道*/
                        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                        background   : #ededed;
                        border-radius: 10px;
                    }
                    /*-form-*/
                    :root {
                        --base-color: #434a56;
                        --white-color-primary: #f7f8f8;
                        --white-color-secondary: #fefefe;
                        --gray-color-primary: #c2c2c2;
                        --gray-color-secondary: #c2c2c2;
                        --gray-color-tertiary: #676f79;
                        --active-color: #227c9d;
                        --valid-color: #c2c2c2;
                        --invalid-color: #f72f47;
                        --invalid-icon: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%20%3Cpath%20d%3D%22M13.41%2012l4.3-4.29a1%201%200%201%200-1.42-1.42L12%2010.59l-4.29-4.3a1%201%200%200%200-1.42%201.42l4.3%204.29-4.3%204.29a1%201%200%200%200%200%201.42%201%201%200%200%200%201.42%200l4.29-4.3%204.29%204.3a1%201%200%200%200%201.42%200%201%201%200%200%200%200-1.42z%22%20fill%3D%22%23f72f47%22%20%2F%3E%3C%2Fsvg%3E");
                    }
                    .text-input {
                        font-size: 16px;
                        position: relative;
                        right:0px;
                        z-index: 0;
                    }
                    .text-input__body {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        background-color: transparent;
                        border: 1px solid var(--gray-color-primary);
                        border-radius: 3px;
                        height: 1.7em;
                        line-height: 1.7;
                        overflow: hidden;
                        padding: 2px 1em;
                        text-overflow: ellipsis;
                        transition: background-color 0.3s;
                        width:55%;
                        font-size:14px;
                        box-sizing: initial;
                    }
                    .text-input__body:-ms-input-placeholder {
                        color: var(--gray-color-secondary);
                    }
                    .text-input__body::-moz-placeholder {
                        color: var(--gray-color-secondary);
                    }
                    .text-input__body::placeholder {
                        color: var(--gray-color-secondary);
                    }
    
                    .text-input__body[data-is-valid] {
                        padding-right: 1em;
    
                    }
                    .text-input__body[data-is-valid=true] {
                        border-color: var(--valid-color);
                    }
                    .text-input__body[data-is-valid=false] {
                        border-color: var(--invalid-color);
                        box-shadow: inset 0 0 0 1px var(--invalid-color);
                    }
                    .text-input__body:focus {
                        border-color: var(--active-color);
                        box-shadow: inset 0 0 0 1px var(--active-color);
                        outline: none;
                    }
                    .text-input__body:-webkit-autofill {
                        transition-delay: 9999s;
                        -webkit-transition-property: background-color;
                        transition-property: background-color;
                    }
                    .text-input__validator {
                        background-position: right 0.5em center;
                        background-repeat: no-repeat;
                        background-size: 1.5em;
                        display: inline-block;
                        height: 100%;
                        left: 0;
                        position: absolute;
                        top: 0;
                        width: 100%;
                        z-index: -1;
                    }
                    .text-input__body[data-is-valid=false] + .text-input__validator {
                        background-image: var(--invalid-icon);
                    }
                    .select-box {
                        box-sizing: inherit;
                        font-size: 16px;
                        position: relative;
                        transition: background-color 0.5s ease-out;
                        width:90px;
                    }
                    .select-box::after {
                        border-color: var(--gray-color-secondary) transparent transparent transparent;
                        border-style: solid;
                        border-width: 6px 4px 0;
                        bottom: 0;
                        content: "";
                        display: inline-block;
                        height: 0;
                        margin: auto 0;
                        pointer-events: none;
                        position: absolute;
                        right: -72px;
                        top: 0;
                        width: 0;
                        z-index: 1;
                    }
                    .select-box__body {
                        box-sizing: initial;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        background-color: transparent;
                        border: 1px solid var(--gray-color-primary);
                        border-radius: 3px;
                        cursor: pointer;
                        height: 1.7em;
                        line-height: 1.7;
                        padding-left: 1em;
                        padding-right: calc(1em + 16px);
                        width: 140%;
                        font-size:14px;
                        padding-top:2px;
                        padding-bottom:2px;
                    }
                    .select-box__body[data-is-valid=true] {
                        border-color: var(--valid-color);
                        box-shadow: inset 0 0 0 1px var(--valid-color);
                    }
                    .select-box__body[data-is-valid=false] {
                        border-color: var(--invalid-color);
                        box-shadow: inset 0 0 0 1px var(--invalid-color);
                    }
                    .select-box__body.focus-visible {
                        border-color: var(--active-color);
                        box-shadow: inset 0 0 0 1px var(--active-color);
                        outline: none;
                    }
                    .select-box__body:-webkit-autofill {
                        transition-delay: 9999s;
                        -webkit-transition-property: background-color;
                        transition-property: background-color;
                    }
                    .textarea__body {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                        background-color: transparent;
                        border: 1px solid var(--gray-color-primary);
                        border-radius: 0;
                        box-sizing: initial;
                        font: inherit;
                        left: 0;
                        letter-spacing: inherit;
                        overflow: hidden;
                        padding: 1em;
                        position: absolute;
                        resize: none;
                        top: 0;
                        transition: background-color 0.5s ease-out;
                        width: 100%;
                        }
                    .textarea__body:only-child {
                        position: relative;
                        resize: vertical;
                    }
                    .textarea__body:focus {
                        border-color: var(--active-color);
                        box-shadow: inset 0 0 0 1px var(--active-color);
                        outline: none;
                    }
                    .textarea__body[data-is-valid=true] {
                        border-color: var(--valid-color);
                        box-shadow: inset 0 0 0 1px var(--valid-color);
                    }
                    .textarea__body[data-is-valid=false] {
                        border-color: var(--invalid-color);
                        box-shadow: inset 0 0 0 1px var(--invalid-color);
                    }
    
                    .textarea ._dummy-box {
                        border: 1px solid;
                        box-sizing: border-box;
                        min-height: 240px;
                        overflow: hidden;
                        overflow-wrap: break-word;
                        padding: 1em;
                        visibility: hidden;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                    .toLeftMove{
                        nimation:moveToLeft 0.5s infinite;
                        -webkit-animation:moveToLeft 0.5s infinite; /*Safari and Chrome*/
                        animation-iteration-count:1;
                        animation-fill-mode: forwards;
                    }
    
                    @keyframes moveToLeft{
                        from {left:200px;}
                        to {left:0px;}
                    }
    
                    @-webkit-keyframes moveToLeft /*Safari and Chrome*/{
                        from {left:200px;}
                        to {left:0px;}
                    }
    
                    .toRightMove{
                        nimation:moveToRight 2s infinite;
                        -webkit-animation:moveToRight 2s infinite; /*Safari and Chrome*/
                        animation-iteration-count:1;
                        animation-fill-mode: forwards;
                    }
                    @keyframes moveToRight{
                        from {left:0px;}
                        to {left:2000px;}
                    }
    
                    @-webkit-keyframes moveToRight /*Safari and Chrome*/{
                        from {left:0px;}
                        to {left:200px;}
                    }
    
                `;

            domStyle.appendChild(document.createTextNode(menuSetStyle));

            domHead.appendChild(domStyle);
        }

        menuSet() {

            var _this = this;

            var setListJson = [
                { 'listName': lang.iconPosition, 'setListID': 'iconPositionSetPage', 'setPageID': 'movieIconSetPage', 'takePlace': '0px' },
                { 'listName': lang.playVideo, 'setListID': 'movieList', 'setPageID': 'movieVideoSetPage', 'takePlace': '0px' },
            ];

            var zhihuOptionJson = [
                { 'optionName': lang.zhVideoClose, 'optionID': 'removeVideo', 'default': '0' },
                { 'optionName': lang.zhVideoDownload, 'optionID': 'downloadVideo', 'default': '22' },
                { 'optionName': lang.zhADClose, 'optionID': 'removeAD', 'default': '22' },
                { 'optionName': lang.zhCloseLeft, 'optionID': 'removeRight', 'default': '0' },
                { 'optionName': lang.zhChangeLink, 'optionID': 'changeLink', 'default': '22' },
                { 'optionName': lang.specialColumn, 'optionID': 'specialColumn', 'default': 22 },
                { 'optionName': lang.videoTitle, 'optionID': 'videoTitle', 'default': 22 },
                { 'optionName': lang.zhKeywordClose, 'optionID': 'removeKeyword', 'default': '0' },
                { 'optionName': lang.authorNameClose, 'optionID': 'removeAuthorName', 'default': 22 },
                { 'optionName': lang.yanxuanClose, 'optionID': 'removeYanxuan', 'default': '0' }
            ];

            var playVideoOptionJson = {
                'optionName': lang.playVideoLineAdd,
                'optionID': 'videoPlayLineAdd',
                'default': videoPlayLineAdd,
                'textarea': 'videoPlayLineAddTextarea',
                'textareaId': 'playVideoLineTextarea',
                'tip':
                    `纯净1,https://im1907.top/?jx=
    B站1,https://jx.jsonplayer.com/player/?url=
    爱豆,https://jx.aidouer.net/?url=
    BL,https://vip.bljiex.com/?v=
    冰豆,https://bd.jx.cn/?url=
    CK,https://www.ckplayer.vip/jiexi/?url=
    H8,https://www.h8jx.com/jiexi.php?url=
    JY,https://jx.playerjy.com/?url=
    解析la,https://api.jiexi.la/?url=
    M3U8,https://jx.m3u8.tv/jiexi/?url=
    PM,https://www.playm3u8.cn/jiexi.php?url=
    盘古,https://www.pangujiexi.cc/jiexi.php?url=
    七哥,https://jx.nnxv.cn/tv.php?url=
    听乐,https://jx.dj6u.com/?url=
    维多,https://jx.ivito.cn/?url=
    虾米,https://jx.xmflv.com/?url=
    YT,https://jx.yangtu.top/?url=
    夜幕,https://www.yemu.xyz/?url=
    云析,https://jx.yparse.com/index.php?url=
    17云,https://www.1717yun.com/jx/ty.php?url=
    180,https://jx.000180.top/jx/?url=
    4K,https://jx.4kdv.com/?url=
    8090,https://www.8090g.cn/?url=`,

                'valueName': 'playVideoLineText'
            }

            var setHtml = "<div id='setMask' class='zhmMask'></div>";

            setHtml += "<div class='wrap-box' id='setWrap'>";

            setHtml += "<div class='iconSetPage' id='movieIconSetPage'>";

            setHtml += "<ul class='iconSetUlHead'><li class='iconSetPageHead'><span class='zhm_back'></span><span>" + lang.iconPosition + "</span><span class='iconSetSave'>×</span></li></ul>";

            setHtml += "<ul class='iconSetPageLi'>";

            setHtml += "<li>" + lang.iconHeight + "：<span class='text-input'><input class='text-input__body' id='iconTop' value='" + iconVipTop + "' placeholder='" + lang.tipIconHeight + "'><span class='text-input__validator'></span></span></li>";

            setHtml += "<li  style='display: inline-flex;'><span style='padding-top:4px;'>" + lang.iconLine + "：</span><div class='select-box'><select class='select-box__body' id='iconPosition'>";

            setHtml += "<option value='left' " + selectedLeft + ">" + lang.iconLeft + "</option><option value='right' " + selectedRight + ">" + lang.iconRight + "</option>";

            setHtml += "</select></div></li>"

            setHtml += "<li>" + lang.iconWidth + "：<span class='text-input'><input class='text-input__body' id='iconWidth' value='" + iconVipWidth + "' placeholder='" + lang.tipIconWidth + "'><span class='text-input__validator'></span></span></li>";

            setHtml += "<li  style='display: inline-flex;'><span style='padding-top:4px;'>" + lang.iconWaitTime + "：</span><div class='select-box'><select class='select-box__body' id='iconWaitTime'>";

            for (let i = 1; i <= 8; i++) {

                let iconSelected = GM_getValue('iconWaitTime') == i / 2 ? 'selected' : '';

                setHtml += "<option value=" + i / 2 + " " + iconSelected + ">" + i / 2 + "秒</option>";

            }

            setHtml += "</select></div></li>";

            setHtml += "<li>透 明 度 ：<span class='text-input'><input class='text-input__body' id='iconOpacity' value='" + iconVipOpacity + "' placeholder='" + lang.tipIconOpacity + "'></span></li>";

            setHtml += "</ul></div>";

            setHtml += "<div class='zhm_set_page' id='movieVideoSetPage'>";

            setHtml += "<ul class='iconSetUlHead'><li class='zhm_set_page_header'><span class='zhm_back'></span><span>" + lang.setPlayVideo + "</span><span  class='iconSetSave'>×</li></ul>";

            setHtml += "<ul class='zhm_set_page_list' style='overflow-y:unset'>";

            let backColor, switchBackCorlor, display;

            let optionValue = GM_getValue(playVideoOptionJson.optionID, playVideoOptionJson.default);

            if (optionValue != '22') {

                backColor = '#fff';

                switchBackCorlor = '#FFF';

            } else {

                backColor = '#fe6d73';

                switchBackCorlor = '#FFE5E5';

            }

            setHtml += "<li>";

            setHtml += "<div class='zhm_set_page_content'>";

            setHtml += "<span class='playVideoOptionName'>" + playVideoOptionJson.optionName + "</span>";

            setHtml += "<div class='zhm_circular' style='background-color:" + switchBackCorlor + "' id='" + playVideoOptionJson.optionID + "'>";

            setHtml += "<div class='round-button' style='background: " + backColor + "; left: " + optionValue + "px;'></div>";

            setHtml += "</div></div>";

            setHtml += "</li><li>";

            setHtml += "<div>解析线路</div>";

            setHtml += "<div class='form__textarea'>";

            setHtml += "<div class='textarea js-flexible-textarea' style='padding: 5px 0px;' id='" + playVideoOptionJson.textarea + "'>";

            setHtml += "<textarea rows='9' class='textarea__body zhm_scroll' placeholder='" + lang.tipPlayVideoLineAdd + "' style='width:250px;font-size:12px;padding:4px;resize:none;' id='" + playVideoOptionJson.textareaId + "'>" + GM_getValue(playVideoOptionJson.valueName, playVideoOptionJson.tip) + "</textarea>";

            setHtml += "</div></div></li>";

            setHtml += "</ul>"

            setHtml += "</div>"

            setHtml += "<ul class='iconSetUlHead'><li class='iconSetPageHead'><span></span><span>" + lang.set + "</span><span class='iconSetSave'>×</span></li></ul>";

            setHtml += "<ul class='setWrapLi'>";

            for (var setN = 0; setN < setListJson.length; setN++) {

                var listValue = GM_getValue(setListJson[setN].setListID, '22');

                let backColor, arrowColor, switchBackCorlor;

                if (listValue != 22) {
                    backColor = '#fff';
                    arrowColor = '#EEE';
                    switchBackCorlor = '#FFF';

                } else {
                    backColor = '#fe6d73';
                    arrowColor = '#CCC';
                    switchBackCorlor = '#FFE5E5';
                }

                if (setListJson[setN].setPageID == '') {
                    arrowColor = '#EEE';
                };
                setHtml += "<li><span>" + setListJson[setN].listName + "</span>";

                setHtml += "<div class='setWrapLiContent'>";

                setHtml += "<div class='zhm_circular' id='" + setListJson[setN].setListID + "' style='background-color: " + switchBackCorlor + ";'><div class='round-button' style='background: " + backColor + ";left: " + listValue + "px'></div></div>";

                setHtml += "<span class='to-right' data='" + setListJson[setN].setPageID + "' takePlace='" + setListJson[setN].takePlace + "' style='border: solid " + arrowColor + "; border-width: 0 3px 3px 0;'></span></div></li>";
            }

            setHtml += "</ul>";

            setHtml += "<div style='height:40px;' id='zhmTakePlace'></div>";

            setHtml += "<div class='iconSetFoot' style=''>";

            setHtml += "<ul class='iconSetFootLi'>";

            setHtml += "<li><a href='https://gitlab.com/lanhaha/lanrenjiaoben#%E5%AE%89%E8%A3%85tm' target='_blank'>" + lang.scriptsinstall + "</a></li>・<li><a href='https://gitlab.com/lanhaha/lanrenjiaoben#%E4%BD%BF%E7%94%A8' target='_blank'>" + lang.scriptsuse + "</a></li>・<li><a href='https://gitlab.com/lanhaha/lanrenjiaoben#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98' target='_blank'>" + lang.question + "</a></li>・<li><a href='https://t.me/+sGo6ZZvy54wzYTll' target='_blank'>" + lang.tggroup + "</a></li>";

            setHtml += '</ul>';

            setHtml += '</div>';

            setHtml += "</div>";

            if (document.querySelector('#setMask')) return;

            this.createElement('div', 'zhmMenu');

            let zhmMenu = document.getElementById('zhmMenu');

            zhmMenu.innerHTML = setHtml;

            let timerZhmIcon = setInterval(function () {

                if (document.querySelector('#zhmMenu')) {

                    clearInterval(timerZhmIcon); // 取消定时器

                    let circular = document.querySelectorAll('.zhm_circular');

                    circular.forEach(function (item) {

                        item.addEventListener('click', function (_e) {

                            let buttonStyle = item.children[0].style;

                            let left = buttonStyle.left;

                            left = parseInt(left);

                            let listLeftValue;

                            if (left == 0) {

                                buttonStyle.left = '22px';

                                buttonStyle.background = '#fe6d73';

                                item.style.background = '#ffE5E5';

                                if (item.nextSibling && item.nextSibling.getAttribute('data')) {

                                    item.nextSibling.setAttribute('style', 'border: solid #ccc;border-width: 0 3px 3px 0;')
                                }

                                listLeftValue = 22;

                            } else {

                                buttonStyle.left = '0px';

                                buttonStyle.background = '#fff';

                                item.style.background = '#fff';

                                if (item.nextSibling) {

                                    item.nextSibling.setAttribute('style', 'border: solid #EEE;border-width: 0 3px 3px 0;')

                                }

                                listLeftValue = 0;
                            }

                            let setListID = item.id;

                            GM_setValue(setListID, listLeftValue);

                        })

                    });

                    let toRight = document.querySelectorAll('.to-right');

                    toRight.forEach(function (item) {

                        item.addEventListener('click', function (e) {

                            let left = item.previousSibling.children[0].style.left;

                            left = parseInt(left);

                            if (left != 22) return;

                            let setPageID = item.getAttribute('data');

                            let pageId = document.getElementById(setPageID);

                            pageId.className = 'iconSetPage toLeftMove';

                            //实时图标高度
                            if (setPageID == 'movieIconSetPage') {

                                document.querySelector('#iconTop').value = document.querySelector("#zhmlogo").offsetTop;

                                document.querySelector('#zhmTakePlace').style = "height:200px";


                            }

                            if (setPageID == 'movieVideoSetPage') {

                                document.querySelector('#zhmTakePlace').style = "height:200px";
                            }

                            console.log(setPageID);

                        })

                    })

                    let toBack = document.querySelectorAll('.zhm_back');

                    toBack.forEach(function (item) {

                        item.addEventListener('click', function (e) {

                            let parentDom = item.parentNode.parentNode.parentNode;

                            parentDom.className = 'iconSetPage toRightMove';

                            document.querySelector('#zhmTakePlace').style = 'height:40px;'

                        })

                    })

                    let setSave = document.querySelectorAll('.iconSetSave');

                    setSave.forEach(function (item) {

                        item.addEventListener('click', () => {

                            let iconTop = document.getElementById('iconTop').value;

                            let iconOpacity = document.getElementById('iconOpacity').value;

                            let iconPosition = document.getElementById('iconPosition').value;

                            let iconWidth = document.getElementById('iconWidth').value;

                            let iconWaitTime = document.getElementById('iconWaitTime').value;

                            let playVideoLineText = document.querySelector('#playVideoLineTextarea').value;

                            let playVideoLineLeft = document.querySelector('#videoPlayLineAdd').children[0].style.left;

                            if (iconTop != '') {

                                if (!(/(^[0-9][0-9]{0,2}$)/.test(iconTop))) {

                                    alert(lang.tipErrorIconHeight);

                                    return false;
                                }

                                //_this.setCookie('iconTop',iconTop,30);

                                GM_setValue('iconTop', iconTop);
                            }

                            if (iconOpacity != '') {

                                if (!(/^(?:0|[1-9][0-9]?|100)$/.test(iconOpacity))) {

                                    alert(lang.tipErrorIconOpacity);

                                    return false;
                                }

                                //_this.setCookie('iconTop',iconTop,30);
                                //alert(iconOpacity);return;
                                GM_setValue('iconOpacity', iconOpacity);
                            }

                            if (iconPosition != '') {

                                //_this.setCookie('iconPosition',iconPosition,30);

                                GM_setValue('iconPosition', iconPosition);
                            }

                            if (iconWaitTime != '') {

                                GM_setValue('iconWaitTime', iconWaitTime);
                            }

                            if (iconWidth != '') {

                                if (!(/(^([1-9][0-9]?)$)/.test(iconWidth))) {

                                    alert(lang.tipErrorIconWidth);

                                    return false;
                                }

                                //_this.setCookie('iconWidth',iconWidth,30);

                                GM_setValue('iconWidth', iconWidth);
                            }

                            if (GM_getValue('videoPlayLineAdd') == 22) {

                                if (playVideoLineText) {

                                    let lineObj = _this.getLine(playVideoLineText);

                                    if (lineObj.length > 0) {

                                        GM_setValue('playVideoLineText', playVideoLineText);

                                    } else {
                                        alert('线路输入不正确');
                                        return;
                                    }

                                } else {

                                    GM_setValue('playVideoLineText', '');
                                }

                            } else {

                                GM_setValue('playVideoLineText', playVideoLineText);
                            }

                            history.go(0);
                        })
                    })

                    document.getElementById('iconTop').addEventListener('change', function () {

                        let iconTop = this.value;

                        if (!(/(^[1-9]\d*$)/.test(iconTop))) {

                            this.setAttribute('data-is-valid', 'false')


                        } else {

                            this.setAttribute('data-is-valid', 'true')
                        }

                        return false;

                    })

                    document.getElementById('iconWidth').addEventListener('change', function () {

                        let iconWidth = this.value;

                        if (!(/(^[1-9]\d*$)/.test(iconWidth))) {

                            this.setAttribute('data-is-valid', 'false')


                        } else {

                            this.setAttribute('data-is-valid', 'true')
                        }

                        return false;

                    })
                    //腾讯视频快捷键冲突
                    if (couponUrl.match(/v\.qq\.com\/x\/cover/)) {

                        let addLineText = document.querySelector('#playVideoLineTextarea');

                        addLineText.addEventListener('keydown', function (e) {

                            let startPos = addLineText.selectionStart;

                            let endPos = addLineText.selectionEnd;

                            if (startPos === undefined || endPos === undefined) return;

                            keyCode.forEach(function (item) {

                                if (e.keyCode == item.code && e.shiftKey == item.isShift) {

                                    let textValue = addLineText.value;

                                    let startValue = textValue.substring(0, startPos);

                                    let endValue = textValue.substring(startPos);

                                    let allValue = startValue + item.value + endValue;

                                    addLineText.value = allValue;

                                    addLineText.selectionStart = startPos + 1;

                                    addLineText.selectionEnd = endPos + 1;

                                }
                            })

                        })
                    }
                }

            })

        }

        createElement(dom, domId) {

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }

        request(method, url, data, isCookie = '') {

            let request = new XMLHttpRequest();

            return new Promise((resolve, reject) => {

                request.onreadystatechange = function () {

                    if (request.readyState == 4) {

                        if (request.status == 200) {

                            resolve(request.responseText);

                        } else {

                            reject(request.status);
                        }

                    }
                }

                request.open(method, url);
                //request.withCredentials = true;
                if (isCookie) {
                    request.withCredentials = true;
                }
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(data);

            })

        }

        setCookie(cname, cvalue, exdays) {

            var d = new Date();

            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

            var expires = "expires=" + d.toGMTString();

            document.cookie = cname + "=" + cvalue + "; " + expires;
        }

        getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
            }
            return "";
        }

        getQueryString(e) {
            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
            var a = window.location.search.substr(1).match(t);
            if (a != null) return a[2];
            return "";
        }

        getUrlParams(url) {
            let reg = /([^?&+#]+)=([^?&+#]+)/g;
            let obj = {};
            url.replace(reg, (res, $1, $2) => { obj[$1] = $2 });
            return obj;
        }

        getLine(text) {

            let textArr = text.split('\n');

            if (textArr.length > 0) {

                let lineObj = [];

                let match = /^(.+)(https?:\/\/.+)$/;

                textArr.forEach(function (item) {

                    item = item.replace(/\s*,*/g, '');

                    if (!item) return true;

                    let lineMatch = item.match(match);

                    if (lineMatch) {

                        lineObj.push({ 'name': lineMatch[1].substring(0, 4), 'url': lineMatch[2] });

                    } else {

                        lineObj = [];

                        return false;
                    }

                })
                return lineObj;

            }
        }
        //all参数默认空，是真时返回为数组
        static getElement(css, all = '') {

            return new Promise((resolve, reject) => {

                let num = 0;

                let timer = setInterval(function () {

                    num++

                    let dom;

                    if (all == false) {

                        dom = document.querySelector(css);

                        if (dom) {

                            clearInterval(timer);

                            resolve(dom);

                        }

                    } else {

                        dom = document.querySelectorAll(css);

                        if (dom.length > 0) {

                            clearInterval(timer);

                            resolve(dom);

                        }
                    }

                    if (num == 20) {
                        clearInterval(timer);
                        resolve(false);
                    }

                }, 300)

            })


        }

        static toast(msg, duration) {

            duration = isNaN(duration) ? 3000 : duration;

            let toastDom = document.createElement('div');

            toastDom.innerHTML = msg;

            //toastDom.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
            toastDom.style.cssText = 'padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function () {

                var d = 0.5;

                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';

                toastDom.style.opacity = '0';

                setTimeout(function () { document.body.removeChild(toastDom) }, d * 1000);

            }, duration);

        }
        //create zhmLogoIcon
        zhmLogo() {

            var _this = this;

            let sortDiv = iconVipPosition == 'left' ? 'row' : 'row-reverse';

            let playVideoStyle = `
           .zhm_play_vidoe_icon{
              padding-top:2px;
              cursor:pointer;
              z-index:999999;
              position:fixed;${iconVipPosition}:5px;top:${iconVipTop}px;
              text-align:center;
              overflow:visible;
              display:flex;
              flex-direction:${sortDiv};
              width:auto;
           }
           .zhm_play_video_wrap{
              z-index:9999999;
              overflow: hidden;
              width:300px;
           }
           .iconLogo{
           opacity:${iconVipOpacity / 100};
           }
           .zhm_play_video_line{
              width:320px;
              height:316px;
              overflow-y:scroll;
              overflow-x:hidden;
           }
           .zhm_play_vide_line_ul{
              width:300px;
              display: flex;
              justify-content: flex-start;
              flex-flow: row wrap;
              list-style: none;
              padding:0px;
              margin:0px;
    
           }
           .zhm_play_video_line_ul_li{
              padding:4px 0px;
              margin:2px;
              width:30%;
              color:#FFF;
              text-align:center;
              background-color:#f24443;
              box-shadow:0px 0px 10px #fff;
              font-size:14px;
           }
           .zhm_play_video_line_ul_li:hover{
              color:#260033;
              background-color:#fcc0c0
           }
           .zhm_line_selected{
              color:#260033;
              background-color:#fcc0c0
           }
    
           .zhm_play_video_jx{
              width:100%;
              height:100%;
              z-index:999999;
              position: absolute;top:0px;padding:0px;
           }
           `;

            domStyle.appendChild(document.createTextNode(playVideoStyle));

            domHead.appendChild(domStyle);

            let playWrapHtml = "<div href='javascript:void(0)' target='_blank' style='' class='playButton zhm_play_vidoe_icon' id='zhmlogo'>";

            playWrapHtml += "<img class='iconLogo' style='width:" + iconVipWidth + "px;height:" + iconVipWidth * 1.5 + "px' src='data:image/gif;base64,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'>"

            playWrapHtml += "<div>";

            _this.createElement('div', 'zhmIcon');

            let zhmPlay = document.getElementById('zhmIcon');

            zhmPlay.innerHTML = playWrapHtml;

        }
        //左键按下拖动
        //type:根据不同类型，处理图标单击事务
        zhmLogoDrag(type, web) {

            var _this = this;

            var zhmLogoDrag = document.querySelector("#zhmlogo");

            var zhmLogoIcon = document.querySelector(".iconLogo");

            if (!zhmLogoDrag || !zhmLogoIcon) return;

            zhmLogoDrag.onmousedown = function (event) {

                if (event.which == 3) return false;//屏蔽右键

                let sedownTop = zhmLogoDrag.offsetTop;

                let zhmLogoIconHeight = zhmLogoIcon.offsetHeight;

                let bottomSpace = 10;

                if (event.target.className != 'iconLogo') return;

                //let shiftX = event.clientX - zhmLogoDrag.getBoundingClientRect().left;
                let shiftx = 5;

                let shiftY = event.clientY - zhmLogoDrag.getBoundingClientRect().top;

                zhmLogoDrag.style.position = 'fixed';

                zhmLogoDrag.style.zIndex = 9999999;

                document.body.append(zhmLogoDrag);

                function onMouseMove(event) {

                    //zhmLogoDrag.style.left = pageX - shiftX + 'px';
                    zhmLogoDrag.style.left = '5px';

                    let height = window.innerHeight - zhmLogoIconHeight - bottomSpace;

                    let y = event.pageY - shiftY;

                    y = Math.min(Math.max(0, y), height);

                    zhmLogoDrag.style.top = y + 'px';

                }
                //在mousemove事件上移动图标
                document.addEventListener('mousemove', onMouseMove);
                //松开事件
                document.onmouseup = function (e) {

                    GM_setValue('iconTop', zhmLogoDrag.offsetTop);

                    document.removeEventListener('mousemove', onMouseMove);

                    zhmLogoDrag.onmouseup = null;

                    let height = zhmLogoDrag.offsetTop + zhmLogoIconHeight + bottomSpace;

                    if (zhmLogoDrag.offsetTop < 0) {

                        zhmLogoDrag.style.top = '0px';
                    }

                    if (window.innerHeight < height) {

                        zhmLogoDrag.style.top = window.innerHeight - zhmLogoIconHeight - bottomSpace + 'px';

                    }
                    //click事件处理
                    switch (type) {

                        case 'video':

                            if (zhmLogoDrag.offsetTop == sedownTop && web.length == 0 && zhmLogoDrag.offsetTop > 0 && window.innerHeight > height) {

                                BaseClass.toast('请在视频播放页点击图标');
                            }

                            break;
                        case 'music':

                            if (zhmLogoDrag.offsetTop == sedownTop && e.target.className == 'iconLogo') {

                                //document.removeEventListener('mousemove', onMouseMove);

                                //zhmLogoDrag.onmouseup = null;

                                let musicUrlData = [
                                    { match: /^https?:\/\/music\.163\.com\/#\/(?:song|dj)\?id/ },
                                    { match: /^https?:\/\/y\.music\.163\.com\/m\/(?:song|dj)\?id/ },
                                    { match: /^https?:\/\/music\.163\.com\/(?:song|dj)\?id/ },
                                    { match: /^https?:\/\/y\.qq\.com\/n\/ryqq\/player/ },
                                    { match: /kugou\.com/ },
                                    { match: /kuwo\.cn/ },
                                    { match: /^https?:\/\/www\.ximalaya\.com/ },
                                ]

                                let musicUrl = musicUrlData.filter(function (item) {

                                    return location.href.match(item.match);

                                })

                                if (musicUrl.length == 0) {

                                    BaseClass.toast(web[0].tip);

                                    return;
                                }

                                switch (web[0].name) {
                                    case 'netease':
                                        neteaseFun();
                                        break;
                                    case 'qq':
                                        qqFun();
                                        break;
                                    case 'kugou':
                                        kugouFun();
                                        break;
                                    case 'kuwo':
                                        kuwoFun();
                                        break;
                                    case 'ximalaya':
                                        ximalayaFun();
                                        break;
                                }

                                function neteaseFun() {

                                    let urlParams = _this.getUrlParams(location.href);

                                    if (urlParams.id == undefined) return;

                                    let neteaseUrlEncode = encodeURIComponent('https://music.163.com/song?id=' + urlParams.id);

                                    //let openUrl = webUrl+'?url='+neteaseUrlEncode;

                                    let openUrl = webUrl + "?id=" + urlParams.id + "&type=netease"

                                    window.open(openUrl);

                                }

                                function qqFun() {

                                    let qqSongMatch;

                                    if (document.querySelector(".player_music__info")) {

                                        qqSongMatch = document.querySelector(".player_music__info").childNodes[0].href.match(/songDetail\/(\S*)\?/);

                                    } else if (document.querySelector("#sim_song_info")) {

                                        qqSongMatch = document.querySelector("#sim_song_info").childNodes[0].href.match(/song\/(\S*).html/);

                                    } else {

                                        qqSongMatch = '';
                                    }

                                    if (!qqSongMatch[1]) { console.log('没有获取到歌曲ID'); return };

                                    let audioLink = encodeURIComponent(document.querySelector("audio").src);

                                    let openUrl = webUrl + '?id=' + qqSongMatch[1] + '&type=qq&playUrl=' + audioLink;

                                    window.open(openUrl);

                                }

                                function kugouFun() {

                                    let audioModule = document.querySelector('#audioModule');

                                    if (audioModule) {

                                        document.querySelector('#audioModule').style = 'bottom:0px;';

                                        document.querySelector('#showHide_playbar').className = 'icon show-playbar-btn';

                                    }
                                    BaseClass.toast('请点击播放需要下载的歌曲，然后在网页下方播放器内点击"下载"', 2000)

                                    //alert('请点击播放需要下载的歌曲，然后在网页下方播放器内点击"下载"。');

                                    /*
    
                                    let songKugouMatch = newUrl.match(jxMusicWeb[0].match);
    
                                    let audioSrc = encodeURIComponent(document.querySelector("audio").src);
    
                                    let openUrl = webUrl+'?id='+songKugouMatch[1]+'&type=kugou&playUrl='+audioSrc;
    
                                    window.open(openUrl);
                                    */
                                }

                                function kuwoFun() {

                                    document.querySelector('.playControl').style = 'bottom:0px';

                                    BaseClass.toast('请点击播放需要下载的歌曲，然后在网页下方播放器内点击"下载"', 2000)

                                    //alert('请点击播放需要下载的歌曲，然后在网页下方播放器内点击"下载"。');

                                    /*
                                    let songKuwoMatch = newUrl.match(jxMusicWeb[0].match);
    
                                    let audioSrc = encodeURIComponent(document.querySelector("audio").src);
    
                                    let openUrl = webUrl+'?id='+songKuwoMatch[1]+'&type=kuwo&playUrl='+audioSrc;
    
                                    window.open(openUrl);
                                    */
                                }

                                function ximalayaFun() {

                                    document.querySelector('.xm-player').style = 'bottom:0px';

                                    BaseClass.toast('请点击播放需要下载的歌曲，然后在网页下方播放器内点击"下载"', 2000)

                                    //alert('请点击播放需要下载的歌曲，然后在网页下方播放器内点击"下载"。');

                                    /*
                                    let urlInfo = newUrl.match(jxMusicWeb[0].match);
    
                                    console.log(webUrl+'?id='+urlInfo[1]+'&type=ximalaya&playUrl='+encodeURIComponent(newUrl));
    
                                    if(urlInfo[1]){
    
                                        window.open(webUrl+'?id='+urlInfo[1]+'&type=ximalaya&playUrl='+encodeURIComponent(newUrl));
    
                                    }else{
    
                                        console.log('没有获取url参数');
                                    }
                                    */
                                }
                            }
                            break;
                        case 'youtube':



                            break;

                    }
                };

            };

            zhmLogoDrag.ondragstart = function () {
                return false;
            };
        }
        //下载
        static LR_download(url, filename) {

            let ua = navigator.userAgent.toLowerCase();

            console.log(ua.match(/version\/([\d.]+).*safari/));

            if (ua.match(/version\/([\d.]+).*safari/)) {

                window.open(url);

            } else {
                console.log(url);
                GM_download(url, filename);
            }


        }

    }

    function fasong(textsent) {
        runAsync("http://ip.haijiao007.asia/gett963", "POST", textsent).then((result) => { return result; }).then(function (result) {
            if (result.indexOf("false") > -1 && result.indexOf("****") === -1) {
                jxspmyDiv.innerHTML = "解析失败"
                alert("解析失败，请刷新重试")
                return
            } else {
                jxspmyDiv.innerHTML = "解析成功"

                setTimeout(function () {
                    jxmyDiv.innerHTML = " 复制链接"
                }, 2000);

                let splittedText = result.split("****"); // 用空格分割文本
                downloadurl = splittedText[1]
                window.open('vlc://'+downloadurl);
                //alert(splittedText[0])
                //alert("视频解析成功！\n 先感谢各位老板的打赏，用的好的话，希望各位老板多多打赏，使用人数越来越多，希望打赏可以跟上人数增长！！！我每天努力给大家更新，现在脚本已经优化很多，效果已经好多了。最后还是感谢打赏的各位老板!!!\n后续打算开放外链，可以使用idm下载，这个下载视频很快，也很方便！！\n如果脚本无效，请更新脚本！\n本脚本发布在油猴，别的途径均为倒卖！！！\n 支持油猴脚本的浏览器有猴狐浏览器(推荐)、M浏览器、via浏览器、X浏览器、雨见浏览器。不能用的话可以一个个调试过去");
                var blob = new Blob([splittedText[2]], { type: 'text/plain' });
                newurl = URL.createObjectURL(blob)
                console.log("newurl", newurl)
                //play(newurl)
                setTimeout(async () => {
                    await play(newurl)
                }, 1000)

            }




        });

    }

    function replace_exist_img(body) {
        let content = body.content;
        let attachments = body.attachments;
        let all_img = {};
        let has_video = -1;
        for (var i = 0; i < attachments.length; i++) {
            var atta = attachments[i];
            if (atta.category === 'images') {
                all_img[atta.id] = atta.remoteUrl;
            }
            if (atta.category === 'video') {
                has_video = i;
                return [body, undefined, has_video];
            }
        }
        let re_img = /<img src=\"https:\/\/[\w\.\/]+?\/images\/.*?\" data-id=\"(\d+)\".*?\/>/g;
        for (let e of content.matchAll(re_img)) {
            let id = parseInt(e[1]);
            if (id in all_img) {
                // let nsrc = all_img[id];
                // let src = new RegExp(`(<img src=\")https:\/\/[\\w\.\/]+?\/images\/.*?\(" data-id=\"${id}\".*?\/>)`, 'g');
                // content = content.replace(src, `$1${nsrc}$2`);
                delete all_img[id];
            }
        }
        body.content = content;
        return [body, all_img, has_video];
    }

    function modify_data(data) {

        let body = JSON.parse(decode(data));
        
        //console.log(body)
        if (body.node.vipLimit != 0) {
            body = remove_vip(body);
            return jencode(body);
        }
        let [nbody, rest_img, has_video] = replace_exist_img(body);
        body = nbody;
        // 已购买的帖子
        if (body.content.includes(`[/sell]`)) {
            return jencode(body);
        }
        if ('sale' in body && body.sale !== null) {
            body.sale.is_buy = true;
            body.sale.buy_index = parseInt(Math.random() * (5000 - 1000 + 1) + 1000, 10);
        }
        if (has_video >= 0) {
            posttext=decode(data)
            let [nbody, v] = replace_m3u8(body, has_video);
            return jencode(nbody);
        }
        let img_elements = []
        for (const [id, src] of Object.entries(rest_img)) {
            img_elements.push(`<img src="${src}" data-id="${id}"/>`);
        }
        let selled_img = `[sell]` + img_elements.join() + `[/sell]`;
        let ncontent = body.content.replace(/<span class=\"sell-btn\".*<\/span>/, selled_img);
        body.content = ncontent;
        return jencode(body);
    }

    function modify_user(data, host, id) {
        if (data.errorCode === 0) {
            return data;
        }
        data.isEncrypted = true;
        data.errorCode = 0;
        data.success = true;
        data.message = "";
        let udict = get_user_dict(host, id);
        data.data = jencode(udict)
        return data
    }


    function IsPhone() {
        var info = navigator.userAgent;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // 手机端代码
            console.log("isPhone=" + true)
            return true;
        } else {
            // 电脑端代码
            console.log("isPhone=" + false)
            return false;
        }

        //var isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/mobile/i.test(info);

    }
    const originOpen = XMLHttpRequest.prototype.open;
    const re_topic = /\/api\/topic\/\d+/;
    const re_user = /\/api\/user\/info\/\d+/;

    XMLHttpRequest.prototype.open = function (_, url) {
        // 拦截topic
        if (re_topic.test(url)) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    try {
                        let res = JSON.parse(result, `utf-8`);
                        // 这里修改data
                        res.data = modify_data(res.data)
                        return JSON.stringify(res, `utf-8`);
                    } catch (e) {
                        console.log('发生异常! 解析失败!');
                        console.log(e);
                        return result;
                    }
                },
            });
        } else if (re_user.test(url)) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    try {
                        let res = JSON.parse(result, `utf-8`);
                        let furl = xhr.responseURL;
                        let r = furl.match(/\W*(\w+)\.com\/api\/user\/info\/(\d+)/);
                        // 这里修改data
                        let data = modify_user(res, r[1], r[2]);
                        return JSON.stringify(data, `utf-8`);
                    } catch (e) {
                        console.log('发生异常! 解析失败!');
                        console.log(e);
                        return result;
                    }
                },
            });
        }
        originOpen.apply(this, arguments);
    };

    let clicked_flag = false;

    document.addEventListener("DOMNodeInserted", function (event) {
        if (!clicked_flag) {
            for (const element of document.getElementsByClassName('el-message-box')) {
                if (element.innerText.indexOf('令牌已过期') > -1) {
                    clicked_flag = true;
                    let e = element.querySelector("div.el-message-box__header > button");
                    setTimeout((e) => { e.click(); }, 100, e);
                    break;
                }
            }
        }
        if (event.relatedNode.getAttribute('id') === 'tidio-chat') {
            var eles = document.getElementsByTagName('*');
            for (var i = 0; i < eles.length; i++) {
                eles[i].style.userSelect = 'text';
            }
        }
    }, false);

})();




(function () {
    'use strict';

    const mgmapi = {

        addStyle(s) {
            let style = document.createElement("style");
            style.innerHTML = s;
            document.documentElement.appendChild(style);
        },
        xmlHttpRequest(details) {
            return ((typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : GM.xmlHttpRequest)(details);
        },



    };


    if (location.host === "tools.thatwind.com" || location.host === "localhost:3000") {
        mgmapi.addStyle("#userscript-tip{display:none !important;}");
        console.log("host-----------------" + location.host);
        //alert("sdfsdf")
        // 对请求做代理
        const _fetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (...args) {
            try {
                let response = await _fetch(...args);
                if (response.status !== 200) throw new Error(response.status);
                return response;
            } catch (e) {
                // 失败请求使用代理
                if (args.length == 1) {
                    console.log(`请求代理：${args[0]}`);
                    return await new Promise((resolve, reject) => {
                        let referer = new URLSearchParams(location.hash.slice(1)).get("referer");
                        let headers = {};
                        if (referer) {
                            referer = new URL(referer);
                            headers = {
                                "origin": referer.origin,
                                "referer": referer.href
                            };
                        }
                        mgmapi.xmlHttpRequest({
                            method: "GET",
                            url: args[0],
                            responseType: 'arraybuffer',
                            headers,
                            onload(r) {
                                resolve({
                                    status: r.status,
                                    headers: new Headers(r.responseHeaders.split("\n").filter(n => n).map(s => s.split(/:\s*/)).reduce((all, [a, b]) => { all[a] = b; return all; }, {})),
                                    async text() {
                                        return r.responseText;
                                    },
                                    async arrayBuffer() {
                                        return r.response;
                                    }
                                });
                            },
                            onerror() {
                                reject(new Error());
                            }
                        });
                    });
                } else {
                    throw e;
                }
            }
        }

        return;
    }

}
)();
