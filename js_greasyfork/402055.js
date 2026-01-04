// ==UserScript==
// @name         VIP会员视频在线解析大集合
// @namespace    https://greasyfork.org/zh-CN/users/505018
// @iconURL      https://v.qq.com/favicon.ico
// @version      1.0.6
// @description  [腾讯|爱奇艺|优酷|乐视|芒果|AB站|音悦台]等VIP或会员视频，在线解析接口插件
// @author       DreamFly
// @noframes
// @match        http*://v.qq.com/x/cover/*
// @match        http*://*.iqiyi.com/v*
// @match        http*://v.youku.com/v_show/*
// @match        http*://*.le.com/*
// @match        http*://*.letv.com/*
// @match        http*://*.tudou.com/*
// @match        http*://*.mgtv.com/*
// @match        http*://film.sohu.com/*
// @match        http*://tv.sohu.com/*
// @match        http*://*.acfun.cn/v/*
// @match        http*://*.bilibili.com/*
// @match        http*://vip.1905.com/play/*
// @match        http*://*.pptv.com/*
// @match        http*://v.yinyuetai.com/video/*
// @match        http*://v.yinyuetai.com/playlist/*
// @match        http*://*.fun.tv/vplay/*
// @match        http*://*.wasu.cn/Play/show/*
// @match        http*://*.56.com/*
// @exclude      http*://*.bilibili.com/blackboard/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/402055/VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%E5%A4%A7%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/402055/VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%E5%A4%A7%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VQQIcon = '<svg height="1.2em" width="1.2em" viewbox="0 0 185 170"><defs><path id="vQQ" d="M7 20 Q14 -10 55 7 Q100 23 145 60 Q170 80 145 102 Q108 138 47 165 Q15 175 4 146 Q-5 80 7 20"></path></defs><use style="fill:#44B9FD;" transform="translate(27,0)" xlink:href="#vQQ"></use><use style="fill:#FF9F01;" transform="translate(0,18),scale(0.8,0.75)" xlink:href="#vQQ"></use><use style="fill:#97E61B;" transform="translate(23,18),scale(0.80.75)" xlink:href="#vQQ"></use><use style="fill:#fff;" transform="translate(50,45),scale(0.4)" xlink:href="#vQQ"></use></svg>';
    const IQiyiIcon = '<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="12" height="12"><image width="12" height="12" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMEAYAAAAG5YCkAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0T///////8JWPfcAAAA B3RJTUUH4wgJFC0QN86G4AAAA8FJREFUOMsFwX1MlHUAwPHv73meu5PjnWMSkSZYDHRuzj8UEbXN CudEQXQunAOzWnO1+V5BC5i6U7NcqPmW4cK0mSaWIYWJQbrKNSCiVGwnKHpyceDD2z33PPf8+nyE c/judTh3jQamQ2GZ7KALVJ/soxtA5tEDwBkeA6ARBqCIWABxjWcBRCI5AGI2z0NkKkX4of6kcMZ3 u8FUtZep13Zplme9OsPjh8Sl6s7EnyC6Rfkz5mlwbRVB5+dANhGRAeF+OdlogZG37byRKTDksvcN HYSBYqtt4DqEe8gyf7Y0kZx150psh5Tlucn5H3wI6XOV/Rn7QLetXL0XzDq5x/wM7DRZZieCXMYd uQTUcXFTBVwlSvuEzRC9RPW4C+DhXftgXwvsXDhQUd0JWmoueWmLIcFt3UisgOOr9DnHciA1yrE9 tQru9Zu7fT/AvQ7zG58B7iPKafdfoFVxWTsB+opIly5g2rDz9PTbULgvzrviCDzj4/CkvaCJ3Eir 2A4PDhiLHpyD/A1x8xaXQ/JsdifnQ/ze+OL4m9CxJxRoL4CYI+LNGBU8L2plHjfoL8iA/hqELlsF 4W0Q9bX6vdsBCRPF/oRaUBw75B5HMyQsUI2EcYhtZU7MGugtNk/dbwe73z4kN0L0CZke7YbRj6zV YzXwz9nR0VvLYEV03L8rl8B1j36q9SJMaBFRrpdAO2Ab2gNQ3CVybfS3MMXrqkyfBsph2a02AXX2 PO4DvfIWIcBvzweQbfKCXQu/TNNLW9PAVzxe6/NB++8jt9s6QZkrtyk5QE9kHYAS2RDZFCmHcZ/V O74Y+meFegOX4Lkapzb1PrjWYjjjYKzQzBkvhHC7NSncBU8qTNdQJvStNi48fAfGqqzvxtJhNGJO HTsKps9Ktx6Bps8xFj3JgsH1xuygA85/2b/1bBdMXCMcKQZk/u1uzUyCplf0vh+/AP1Xe7peDEPL ZdLgVdj1ru+r6hhwNyp/uL3wX6PRF6iB4KdGVrASNH9BKOzXwVpgLYy8Du95J22pOAPB49beoBfC Jfal8ElIb499I6MH5HzxvqwCx0bqHevAuVJsdh6FxAa1JakDAtmhmYFK8BeFmh/FgtDym7PBdDob I1tcqZrx1BQlLSUFkoJaadJGiKlVumN7wHVD2eTSgIWYzIJwtX0gvBqG6+yS4VIYfMs6HRwEf5P9 yeMGMPJVbyhoOYUj7aoK5yfLHXIAlsfJj6kBtdP+TW4DIA8vgDzGFQAkQQBRwioAmigHUGaKQwCi mlchMkMcFh64OPI/QLSjdm0wihoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDgtMTBUMDM6NDU6 MTYtMDc6MDBV2/HBAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA4LTEwVDAzOjQ1OjE2LTA3OjAw JIZJfQAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII="/></svg>';
    const YoukuIcon = '<svg width="1.2em" height="1.2em" viewbox="0 0 72 72"><defs><circle id="youkuC1" r="5.5" style="stroke:none;;fill:#0B9BFF;"></circle><path id="youkuArow" d="m0,10 a5,5 0,0,1 0,-10 h20 a5,5 0,0,1 0,10z" style="fill:#FF4242;"></path></defs><circle cx="36" cy="36" r="30.5" style="stroke:#30B4FF;stroke-width:11;fill:none;"></circle><use x="10.5" y="19" xlink:href="#youkuC1"/><use x="61.5" y="53" xlink:href="#youkuC1"/><use x="39" y="1" transform="rotate(30)" xlink:href="#youkuArow"/><use x="-1" y="52" transform="rotate(-35)" xlink:href="#youkuArow"/></svg>';
    var websites = [/qq.com/i, /iqiyi.com/i, /youku.com/i]
    var webIcons = [VQQIcon, IQiyiIcon, YoukuIcon]
    var icon = '';

    for (let i in websites) {
        if (websites[i].test(location.href)) {
            icon = webIcons[i];
        }
    }

    var defaultApi = {
        title: "618G,失效请更换接口",
        url: "http://jx.618g.com/?url="
    };

    //fixedApis name:显示的文字  url:接口  title:提示文字  embed:是否适合内嵌(true:内嵌 false:站外)
    var fixedApis = [
        { name: "618G", url: "http://jx.618g.com/?url=", title: "618G", embed: false },
        { name: "玩的嗨", url: "http://tv.wandhi.com/go.html?url=", title: "综合接口", embed: false },
        { name: "搜你妹", url: "http://www.sonimei.cn/?url=", title: "综合接口", embed: false },
        { name: "TIMERD", url: "https://timerd.me/static/cv.html?zwx=", title: "不稳定，广告过滤软件可能有影响", embed: false },
        { name: "小小解析", url: "https://vip.parwix.com:4433/player/?url=", title: "手动点播放", embed: false },
        { name: "乐乐云", url: "https://660e.com/?url=", title: "乐乐云，未知效果", embed: false },
        { name: "全民解析", url: "https://z1.m1907.cn/?jx=", title: "全民解析", embed: false },
        { name: "牛逼VIP", url: "https://www.5igen.com/dmplayer/player/?url=", title: "牛逼VIP", embed: false },
        { name: "云2解析", url: "https://jx.yparse.com/index.php?url=", title: "综合，多线路", embed: false },
        { name: "盘古视频解析", url: "https://www.pangujiexi.com/jiexi/?url=", title: "解析接口", embed: false },
        { name: "诺讯智能解析", url: "https://www.nxflv.com/?url=", title: "解析接口", embed: false },
        { name: "云解析", url: "https://jx.mw0.cc/?url=", title: "解析接口", embed: false },
        { name: "1717云解析", url: "https://www.1717yun.com/jx/ty.php?url=", title: "解析接口", embed: false },
        { name: "116看解析", url: "https://jx.116kan.com/?url=", title: "解析接口", embed: false },
        { name: "云网解析", url: "https://www.41478.net/?url=", title: "云网解析", embed: false }
    ];

    var cssStyle = `
#TMDF-VideoContainer1 {
    z-index: 2147483647;
    position: fixed;
    top: 7em;
    left: 5em;
    width: 75%;
    height: 800px;
    background: rgba(0, 0, 0, .7);
    box-shadow: 2px 2px 5px 5px rgba(125, 125, 250, .8);
}

#TMDF-VideoContainer2 {
    #width:100%;
    #height:100%;
    z-index:2147483647;
}

#TMDF-ClosePlayer {
    float: right;
    border: 0;
    padding: 0;
    margin-top: 0px;
    margin-right: 6px;
    cursor: pointer;
    visibility: hidden;
    font-size: 3em;
    color: rgba(125, 125, 250, 0.8);
    background: transparent;
}

#TMDF-ClosePlayer:hover {
    color: #ffffffff;
}

#TMDF-VideoContainer1:hover button {
    visibility: visible;
}

#TMDF-iframe-player {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
    margin: auto;
    overflow: auto;
}

#TMDF-CustomApi li {
    margin: 5px;
    width: 100%;
    list-style-type: none;
}

#TMDF-ul {
    position: fixed;
    top: 5em;
    left: 1em;
    padding: 0;
    z-index: 999999;
}

#TMDF-ul li {
    list-style: none;
}

.TMDF-ul1 {
    position: absolute;
    top: 0;
    left: 2.5em;
    display: none;
    border-radius: .3em;
    margin: 0;
    padding: 0;
}

.TMDF-ul1 svg {
    float: right;
}

.TMDF-ul1 li {
    float: none;
    width: 8em;
    margin: 0;
    font-size: 1.2em;
    padding: .15em 1em;
    cursor: pointer;
    color: #3a3a3a!important;
    background: rgba(125, 125, 250, 0.8);
}

.TMDF-ul1 li:hover {
    color: white!important;
    background: rgba(0, 0, 0, .8);
}

.TMDF-ul1 li:first-child {
    border-radius: .35em .35em 0 0;
}

.TMDF-ul1 li:last-child {
    border-radius: 0 0 .35em .35em;
}

.TMDF-li1 {
    opacity: 0.5;
    position: relative;
    padding-right: .5em;
    width: 2.5em;
    cursor: pointer;
    text-align: center;
}

.TMDF-li1:hover {
    opacity: 1;
}

.TMDF-li1 span {
    display: block;
    border-radius: 3.5em;
    background-color: rgba(125, 125, 250, 1.0);
    border: 0;
    font: bold 1em "微软雅黑"!important;
    color: #3a3a3a;
    margin: 0;
    padding: 1em .3em;
}

.TMDF-li1:hover .TMDF-ul1 {
    display: block;
}

.TMDF-li2 {
 text-align: center;
}

.TMDF-p {
    position: fixed;
    top: 20%;
    left: 20%;
    z-index: 999999;
    background: rgba(125, 125, 250, 0.9);
    padding: 30px 20px 10px 20px;
    border-radius: 10px;
    text-align: left;
}

.TMDF-p * {
    font-size: 16px;
    font-family: '微软雅黑';
    color: #3a3a3a;
}

.TMDF-p fieldset {
    margin: 0;
    padding: 10px;
}

.TMDF-p legend {
    padding: 0 10px;
    text-align: center;
}

.TMDF-p label {
    display: inline-block;
}

.TMDF-p input[type=text] {
    border-radius: 5px !important;
    border: 1px solid #3a3a3a;
    margin: 2px 10px 2px 5px;
    padding: 2px 5px;
}

.TMDF-p button {
    border: 1px solid #3a3a3a;
    border-radius: 5px;
    cursor: pointer;
    padding: 2px 10px;
    margin: 10px 20px 0 20px;
}

.TMDF-p button:hover {
    background: #3a3a3a;
    color: yellow;
}

.TMDF-text1 {
    width: 350px;
}

.TMDF-Close {
    position: absolute;
    top: 3px;
    left: 3px;
    margin: 0!important;
}

.TMDF-span80 {
    display: inline-block;
    text-align: right;
    width: 100px;
}

.TMDF-HName,
.TMDF-Name {
    text-align: left;
    width:25%;
}

.TMDF-HLink {
    text-align: center;
    width: 45%;
}
.TMDF-Link {
    text-align: left;
    width: 45%;
}

.TMDF-HEmbed, .TMDF-Embed {
    text-align: center;
    width: 15%;
}

.TMDF-HDelete, .TMDF-Delete{
    text-align: center;
    width: 15%;
}
.TMDF-Delete {
    color: red;
    cursor: pointer;
}


input[type=checkbox] {
   -webkit-appearance: checkbox;
}

li:hover .TMDF-Name,
li:hover .TMDF-Link,
li:hover .TMDF-Embed,
li:hover .TMDF-Delete {
    background: rgba(73,163,230,0.62);
}
`;
    /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
     * 为了兼容GreasyMonkey 4.0 获取结构化数据,比如 json Array 等,
     * 应当先将字符串还原为对象,再执行后续操作
     * GMgetValue(name,defaultValue)
     */
    function GMgetValue(name, defaultValue) {
        if (typeof GM_getValue === 'function') {
            return GM_getValue(name, defaultValue);
        } else {
            return GM.getValue(name, defaultValue);
        }
    }

    /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
     * 为了兼容GreasyMonkey 4.0 储存结构化数据,比如 json Array 等,
     * 应当先将对象字符串化,
     * GMsetValue(name, JSON.stringify(defaultValue))
     */
    function GMsetValue(name, defaultValue) {
        if (typeof GM_setValue === 'function') {
            GM_setValue(name, defaultValue);
        } else {
            GM.setValue(name, defaultValue);
        }
    }

    /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+ */
    function GMopenInTab(url, background) {
        if(typeof GM_openInTab === "function"){
            GM_openInTab(url, background);
        }else{
            GM.openInTab(url, background);
        }
    }
    /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+ */
    function GMxmlhttpRequest(obj) {
        if (GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest(obj);
        } else {
            GM.xmlhttpRequest(obj);
        }
    }

    /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+ */
    function GMaddStyle(cssText) {
        let doc = document.head || document.documentElement;
        let tag = document.createElement('style');
        tag.textContent = cssText;
        doc.appendChild(tag);
    }

    //开启全屏的element调用,找到支持的方法
    function launchFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    //创建视频播放窗口
    function createVideoPlayer(parent) {
        //如果页面有播放窗口,只需更新播放窗口的 src, 如果没有播放窗口,读取播放窗口位置信息,新建一个播放窗
        let iframeTag = document.querySelector('#TMDF-iframe-player');
        if (iframeTag === null) {
            let divTag = document.createElement('div');
            if (parent == undefined) {
                divTag.id = 'TMDF-VideoContainer1';
                divTag.innerHTML = `<button id="TMDF-ClosePlayer" title="关闭">&#9746;</button>`;
                divTag.innerHTML +=`<iframe id='TMDF-iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe>`
                document.body.appendChild(divTag);

                document.querySelector('#TMDF-ClosePlayer').addEventListener('click', () => {
                    document.body.removeChild(document.querySelector('#TMDF-VideoContainer1'));
                    return true;
                }, false);
            } else {
                divTag.id = 'TMDF-VideoContainer2';
                divTag.innerHTML =`<iframe id='TMDF-iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe>`
                parent.appendChild(divTag);
            }
        }
    }

    //打开视频解析
    function openVideoResolve(url, embed, func) {
        if (embed === true) {
            //创建页内播放窗口
            if (typeof func === 'function'){
                func();
            }
             //内嵌页内播放
            document.querySelector('#TMDF-iframe-player').setAttribute('src', url + location.href);
        } else {
            //不适合页内播放的,打开新标签
            GMopenInTab(url + location.href);
        }
    }

    /*  保存按钮执行函数:获取值并 await GM.setValue()  */
    function getCustomUserApis() {
        let name = document.querySelector('#TMDF-name').value;
        let url = document.querySelector('#TMDF-url').value;
        let embed = document.querySelector('#TMDF-embed').checked ? 1 : 0;
        let customUserApis = [];

        if (name && url) {
            customUserApis.push({ name: name, url: url, embed: embed });
        }

        let userApis = document.querySelectorAll('.TMDF-Link');
        for (let i = 0; i < userApis.length; i++) {
            name = userApis[i].previousSibling.innerText;
            url = userApis[i].innerText;
            embed = userApis[i].nextSibling.nextSibling.checked ? '1' : '0';
            customUserApis.push({ name: name, url: url, embed: embed });
        }

        return customUserApis;
    }

    //添加自定义接口
    function addCustomUserApi() {
        if (document.querySelector('#TMDF-name').value == '') {
            alert('添加解析接口名称不能为空');
            return true
        }

        if (document.querySelector('#TMDF-url').value == '' || document.querySelector('#TMDF-url').value.indexOf('http') != 0) {
            alert('添加解析接口地址不能为空,必须以http或https开头,且符合url规范');
            return true
        }

        let headHtml = `<li>`+
            `<label class="TMDF-HName">接口名称</label>` +
            `<label class="TMDF-HLink">接口地址</label>` +
            `<label class="TMDF-HEmbed">内嵌本页</label>` +
            `<label class="TMDF-HDelete">操作</label></li>`;

        let checked = document.querySelector("#TMDF-embed").checked ? "checked" : "";
        let liTag = document.createElement('li');
        liTag.innerHTML =
            `<label class="TMDF-Name">${document.querySelector('#TMDF-name').value}</label>` +
            `<label class="TMDF-Link">${document.querySelector('#TMDF-url').value}</label>` +
            `<label class="TMDF-Embed"><input type="checkbox" ${checked}>内嵌</label>` +
            `<label class="TMDF-Delete" title="删除" onclick="document.getElementById('TMDF-CustomApi').removeChild(this.parentNode)">✘</label>`;

        if (document.querySelector('label[class=TMDF-Name]') === null) {
            let liTag1 = document.createElement('li');
            liTag1.innerHTML = headHtml;
            document.querySelector('#TMDF-CustomApi').appendChild(liTag1);
            document.querySelector('#TMDF-CustomApi').appendChild(liTag);
        } else {
            document.querySelector('#TMDF-CustomApi').insertBefore(liTag, document.querySelector('label[class=TMDF-Name]').parentNode);
        }

        document.querySelector('#TMDF-name').value = '';
        document.querySelector('#TMDF-url').value = '';
    }

    /*  显示自定义接口面板  */
    function showCustomApiPanel() {
        let innerHtml =
            `<button class="TMDF-Close" onclick="document.querySelector('#TMDF-CustomApi').style.display='none';">&#9746;</button>` +
            `<legend>自定义解析接口</legend>` +
            `<li><span class="TMDF-span80">接口名称:</span><input type="text" id="TMDF-name" class="TMDF-text1" placeholder="显示的名称"></li>` +
            `<li><span class="TMDF-span80">接口地址:</span><input type="text" id="TMDF-url" class="TMDF-text1" placeholder="接口需要包含 http 或者 https 开头"></li>` +
            `<li><span class="TMDF-span80">内嵌本页:</span><label for="TMDF-embed" style=" margin-left: 1em;"><input type="checkbox" id="TMDF-embed"/>内嵌</label></li>` +
            `<li class="TMDF-li2">` +
            `<button id="TMDF-Test">测试</button>` +
            `<button id="TMDF-Add">增加</button>` +
            `<button id="TMDF-Save">保存</button>` +
            `</li>`;

        let headHtml = `<li>`+
            `<label class="TMDF-HName">接口名称</label>` +
            `<label class="TMDF-HLink">接口地址</label>` +
            `<label class="TMDF-HEmbed">内嵌本页</label>` +
            `<label class="TMDF-HDelete">操作</label></li>`;

        try {
            let customUserApis = JSON.parse(GMgetValue('customUserApis', "[{}]"));
            if (customUserApis.length > 0 && customUserApis[0].name !== undefined) {
                innerHtml += headHtml;
                for (let i = 0; i < customUserApis.length; i++) {
                    let checked = (customUserApis[i].embed === "1") ? 'checked' : '';
                    let html = `<li>` +
                        `<label class="TMDF-Name">${customUserApis[i].name}</label>` +
                        `<label class="TMDF-Link">${customUserApis[i].url}</label>` +
                        `<label class="TMDF-Embed"><input type="checkbox" ${checked} >内嵌</label>` +
                        `<label class="TMDF-Delete" title="删除" onclick="document.getElementById('TMDF-CustomApi').removeChild(this.parentNode)">✘</label>` +
                        `</li>`;
                    innerHtml += html
                }
            }
        } catch (e) {}

        let divTag = document.createElement('div');
        divTag.id = 'TMDF-CustomApi';
        divTag.setAttribute('class', 'TMDF-p');
        divTag.innerHTML = innerHtml;
        document.body.appendChild(divTag);

        /*事件绑定*/
        document.querySelector('#TMDF-Test').addEventListener('click', function() {
            let apiUrl = document.querySelector('#TMDF-url').value;
            if (apiUrl && apiUrl.match('^http')){
                window.open(apiUrl + location.href);
            }
            else{
                alert('测试无效，请先添加解析接口地址');
            }
        }, false);

        //添加
        document.querySelector('#TMDF-Add').addEventListener('click', function() {
            addCustomUserApi();
            return true;
        }, false);

        //保存
        document.querySelector('#TMDF-Save').addEventListener('click', function() {
            var customUserApis = getCustomUserApis();
            GMsetValue('customUserApis', JSON.stringify(customUserApis));
            console.log(customUserApis);
            alert('解析接口列表已保存');
        }, false);
    }

    //查找播放窗口节点
    function SearchPlayerNode(){
        let match_nodes = [ { url:/v.qq.com/i, node:"#mod_player"}, { url:/www.iqiyi.com/i, node:"#flashbox" }]
        let player_node;

        for(let i in match_nodes) {
            if (match_nodes[i].url.test(location.href)) {
                let node = document.querySelector(match_nodes[i].node);
                if (node) {
                    player_node = node;
                    break;
                }
            }
        }

        return player_node
    }

    /*  显示解析界面 */
    function showResolveApiPanel() {
        /*提供的接口列表*/
        let apis = [...fixedApis];

        //自定义接口列表
        let customUserApis = JSON.parse(GMgetValue('customUserApis', "[{}]"));
        for (let i in customUserApis) {
            try {
                if (customUserApis[i].url !== null) {
                    apis.push(customUserApis[i]);
                }
            } catch (e) { /*console.log(e);*/ }
        }
        
        let apisText = '';
        for (let i in apis) {
            apisText += `<li data-order=${i} data-url="${apis[i].url}" data-embed=${apis[i].embed} title="${apis[i].title}">${apis[i].name + icon}</li>`;
        }

        let innerHtml =
            `<ul id="TMDF-ul">` +
            `<li class="TMDF-li1"><span id="TMDF-List" title="${defaultApi.title}" onclick="window.open(\'${defaultApi.url}\'+window.location.href)">解析</span>` +
            `<ul class="TMDF-ul1">${apisText}</ul></li>` +
            `<li class="TMDF-li1"><span id="TMDF-Setting" title="自定义解析设置">设置</span></li>` +
            `</ul>`;

        let divTag = document.createElement("div");
        divTag.id = "TMDF-ResolveApi";
        divTag.innerHTML = innerHtml;
        document.body.appendChild(divTag);

        //事件绑定
        let apiList = document.querySelectorAll('.TMDF-ul1 li');
        for (let x = 0; x < apiList.length; x++) {
            apiList[x].addEventListener('click', function(evt) {
                openVideoResolve(evt.target.dataset.url, JSON.parse(evt.target.dataset.embed), function(){
                    let player_node = SearchPlayerNode();
                    if (player_node) {
                        player_node.innerHTML = '';
                    }
                    createVideoPlayer(player_node);
                });
                return true;
            }, false);
        }

        //设置自定义接口
        document.querySelector("#TMDF-Setting").addEventListener('click', function(evt){
            let apiPanel = document.querySelector('#TMDF-CustomApi');
            if (apiPanel) {
                apiPanel.style.display = "block";
            }else {
                showCustomApiPanel();
            }
            return true;
        }, false);
    }

    /*  执行  */
    function execute() {
        //添加css
        GMaddStyle(cssStyle);

        //显示界面
        showResolveApiPanel();
    }

    //调用执行
    execute();
})();