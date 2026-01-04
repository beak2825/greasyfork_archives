// ==UserScript==
// @name         蓝湖
// @namespace    http://tampermonkey.net/
// @version      0.2.45
// @description  try to take over the world!
// @author       HolmesZhao
// @include        *://lanhuapp.com/web*
// @include        *://lanhu.zuoyebang.cc/web*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/405064/%E8%93%9D%E6%B9%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405064/%E8%93%9D%E6%B9%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onbeforeunload = function(e) {
        let pid = getQueryVariable("pid")
        console.log(pid)
        if (pid != '' && pid != null) {
            window.localStorage.setItem('lanhu_current_pid', pid)
        }
        return;
    };

    var authorization = ""
    function listen() {
        var origin = {
            setRequestHeader: XMLHttpRequest.prototype.setRequestHeader
        }

        XMLHttpRequest.prototype.setRequestHeader = function (a, b) {
            if (arguments[0] == 'Authorization') {
                authorization = arguments[1]
            }
            origin.setRequestHeader.apply(this, arguments)
        }
    }
    listen()

    function getQueryVariable(variable) {
        let len = window.location.href.indexOf('?')
        if (len <= 0) { return false; }
        var query = window.location.href.substring(len + 1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function saveUrl() {
        let pid = getQueryVariable("pid")
        let url = $('.mminput')[0].value
        if (url == '' || url == null) {
            alert('请填写 URL')
            return
        }
        let urls = JSON.parse(window.localStorage.getItem('lanhu_old_urls'))
        if (urls == null) { urls = {} }
        urls[pid] = url
        window.localStorage.setItem('lanhu_old_urls', JSON.stringify(urls))
    }

    function clearUrls() {
        window.localStorage.removeItem('lanhu_old_urls')
    }

    function copyUrl() {
        let urls = JSON.parse(window.localStorage.getItem('lanhu_old_urls'))
        let pid = getQueryVariable("pid")
        if (pid == '' || pid == null) {
            pid = window.localStorage.getItem('lanhu_current_pid')
        }
        if (urls == null) {
            alert('请填写 URL 并保存')
            return;
        }
        if (pid == '' || pid == null) {
            alert('pid 不存在')
            return;
        }
        let url = urls[pid];
        let btn = document.getElementsByClassName('mmbutton')[0];
        let btnText = btn.innerText;
        let textarea = "<textarea id=\"copyFont\" style=\"opacity: 0;\">" + url + "</textarea>";
        btn.innerHTML = textarea;
        var element = document.getElementById("copyFont");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        btn.innerText = btnText
    }

    function loadUrl() {
        let urls = JSON.parse(window.localStorage.getItem('lanhu_old_urls'))
        let pid = getQueryVariable("pid")
        if (pid == '' || pid == null) {
            pid = window.localStorage.getItem('lanhu_current_pid')
        }
        if (urls == null) {
            alert('请填写 URL 并保存')
            return;
        }
        if (pid == '' || pid == null) {
            alert('pid 不存在')
            return;
        }
        window.location.href = urls[pid]
    }

    function login() {
        let login_url = "http://lanhu.zuoyebang.cc/api/account/login_url"
        let toast = document.getElementsByClassName("lan-toast")
        var needLogin = false
        for (let i = 0; i < toast.length; ++i) {
            let text = toast[i].textContent
            if (text.length > 0) {
                needLogin = true
                break
            }
        }

        if (needLogin) {
            window.localStorage.setItem('lanhu_needAuth', true)
            window.location.href = login_url
            return;
        }

        if (window.localStorage.getItem('lanhu_needAuth') == "true") {
            window.localStorage.setItem('lanhu_needAuth', false)
            loadUrl()
        }
    }

    setTimeout(login, 1000);

    // Your code here...
    var colorJson = {}
    var colorMMJJson = {
        "Background": "F8F7F7",
        "Separator": "F0F0F0",
        "NavigationBarBackground": "FFFFFE",
        "MainTitle": "141414",
        "MainTint": "FEE791",
        "AccessoryTitle": "666666",
        "AccessoryText": "A3A3A3",
        "Disable": "CCCCCC",
        "PureWhite": "FFFFFF",
        "PureBlack": "000000",
        "LinkText": "5373B2",
        "Tip_Strong": "FFA317",
        "Tip_Failure": "FE5347",
        "Tip_Weak": "FFF6D4",
        "Tip_Success": "10C772",
        "TextButtonMain": "FCCE00",
        "ButtonDisabled": "E3E5E8",
        "LabelNormal": "F8F8F7",
        "LabelSelected": "FFF5D6",
        "Accessory1": "57E3D0",
        "Accessory2": "FCCE00",
        "Accessory3": "FF9EA8",
        "Accessory4": "8EC2FF",
        "Accessory5": "56EOCE",
    }
    // 错题 app 的颜色
    var colorStudyJson = {
        "BackgroundTitle": "FFFFFF",
        "Tip_Strong": "FFA317",
        "Disable": "B8BBC2",
        "LinkText": "3777FF",
        "Tip_Success": "07C16A",
        "NavigationBarBackground": "FAFCFF",
        "AccessoryTitle": "8F9396",
        "MainTitle": "292F3D",
        "Tip_Failure": "F8554F",
        "Tip_Weak": "FFF6D4",
        "Background": "F5F7FA",
        "Separator": "EDEEF0",
        "Accessory1": "FF7631",
        "Accessory2": "FFBF27",
        "TextButtonMain": "0687FF",
        "VIPFont": "994D12",
        "LabelSelected": "E9F6FF",
        "LabelNormal": "F7F9FC",
    }
    // 国际版 app 的颜色
    var colorInternationalJson = {
        "BackgroundTitle": "FFFFFF",
        "Tip_Strong": "FE7600",
        "Disable": "B8BBC2",
        "LinkText": "0687FF",
        "Tip_Success": "2BD8A6",
        "NavigationBarBackground": "FFFFFE",
        "AccessoryTitle": "9A9EA4",
        "MainTitle": "17191C",
        "Tip_Failure": "F8554F",
        "Tip_Weak": "0687FE",
        "Background": "F4F4F4",
        "Separator": "F0F0F0",
        "Accessory1": "FF7631",
        "Accessory2": "FFBF27",
        "TextButtonMain": "F9E667",
        "LabelSelected": "E9F6FF",
        "LabelNormal": "F7F9FC",
    }

    var fontJson = {
        "MMRegularFontName": "苹方-简 常规体",
        "MMMediumFontName": "苹方-简 中黑体",
        "MMSemiboldFontName": "苹方-简 中粗体",
        "MMMnumbersFontName": "Mnumbers Regular",
        "MMBiaopan01FontName": "Biaopan01 Regular"
    }
    // 需要将 fontJson 中的 key 去掉 FontName 字符
    // normalFonts 没有提供快捷创建的方式, 比如: .regularFont(with: .Mark)
    // normalFonts 中标记的是特殊字体, 使用如下: .font(with: .Mnumbers, size: .Content)
    var normalFonts = [
        "MMMnumbers",
        "MMBiaopan01"
    ]

    var fontSizeJson = {}
    var fontSizeOldJson = {
        "MMSpecialBigFontSize": "34pt",
        "MMSpecialMiddleFontSize": "24pt",
        "MMSpecialSmallFontSize": "21",
        "MMTitleFontSize": "18pt",
        "MMTitleTabSelectFontSize": "16pt",
        "MMTitleTabNormalFontSize": "15pt",
        "MMContentFontSize": "14pt",
        "MMAccessoryFontSize": "13pt",
        "MMDescriptionFontSize": "12pt",
        "MMLabelFontSize": "11pt",
        "MMMarkFontSize": "10pt",
        "MMProgressFontSize": "8pt",
    }

    var fontSizeNewJson = {
        "MMSpecialBigFontSize": "36pt",
        "MMSpecialMiddleFontSize": "28pt",
        "MMSpecialSmallFontSize": "20pt",
        "MMTitleFontSize": "18pt",
        "MMSubTitleFontSize": "16pt",
        "MMTitleTabSelectFontSize": "16.1pt",
        "MMTitleTabNormalFontSize": "15pt",
        "MMContentFontSize": "14pt",
        "MMAccessoryFontSize": "13pt",
        "MMDescriptionFontSize": "12pt",
        "MMLabelFontSize": "11pt",
        "MMMarkFontSize": "10pt",
        "MMProgressFontSize": "8pt",
    }

    var color = '';
    var font = '';
    var fontSize = '';
    var fontSizeValue = '';
    var app = 'mmj';

    function changeColorText() {
        var copy_texts = document.getElementsByClassName('copy_text');
        for (let index = 0; index < copy_texts.length; index++) {
            const element = copy_texts[index];

            for (const key in colorJson) {
                if (colorJson.hasOwnProperty(key)) {
                    const value = colorJson[key];
                    if (element.innerText.indexOf(value) != -1 ||
                        element.innerText.indexOf(value.toLowerCase()) != -1) {
                        element.innerText = key;
                        color = key;
                        return;
                    }
                }
            }

        }
    }

    function changeFontText() {
        var layer_names = document.getElementsByClassName('layer_name');
        for (let index = 0; index < layer_names.length; index++) {
            const element = layer_names[index];
            for (const key in fontJson) {
                if (fontJson.hasOwnProperty(key)) {
                    const value = fontJson[key];
                    if (element.innerText.indexOf(value) != -1) {
                        element.innerText = key;
                        font = key;
                        return;
                    }
                }
            }
        }
    }

    function changeFontSizeText() {
        var item_titles = document.getElementsByClassName('item_title');
        for (let index = 0; index < item_titles.length; index++) {
            const element = item_titles[index];
            if (element.innerText.indexOf('字号') != -1) {
                let sizeDom = element.parentElement.getElementsByClassName('two')[0];
                let hasChanged = false;
                for (const key in fontSizeJson) {
                    if (fontSizeJson.hasOwnProperty(key)) {
                        const value = fontSizeJson[key];
                        if (sizeDom.innerText.indexOf(value) != -1) {
                            sizeDom.innerText = key;
                            fontSize = key;
                            hasChanged = true;
                            fontSizeValue = parseInt(sizeDom.innerText).toString();
                            return;
                        }
                    }
                }
                if ((hasChanged == false) && (isNaN(parseInt(sizeDom.innerText)) == false)) {
                     fontSize = parseInt(sizeDom.innerText).toString();
                }
            }
        }
    }

    function changeText(params) {
        changeColorText();
        changeFontText();
        changeFontSizeText();
    }

    function addButton(name, marginLeft, top, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement('button');
        btn.className = 'mmbutton';
        btn.style = "z-index: 9999; font-size: large; position: fixed; top: " + top +"px; left: " + (marginLeft) + "px;border:1px solid black; padding: 0 10px;";
        btn.onclick = fun;
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth + btn.offsetLeft;
    };

    function addTextField(name, marginLeft, top) {
        $('head').append($(`
            <style type="text/css">
            .mminput:active {
                 border:1px solid black;
                 border-color:#58ACFA;
                 -webkit-transition:border linear .2s,-webkit-box-shadow linear .5s;
                 -webkit-box-shadow:0 0 5px #58ACFA;
                 -moz-box-shadow: 0 0 5px #58ACFA;
                 box-shadow:0 0 5px #58ACFA;
            }
            .mminput:focus {
                border:1px solid black;
                border-color:#58ACFA;
                -webkit-transition:border linear .2s,-webkit-box-shadow linear .5s;
                -webkit-box-shadow:0 0 5px #58ACFA;
                -moz-box-shadow: 0 0 5px #58ACFA;
                box-shadow:0 0 5px #58ACFA;
            }
            </style>
        `));
        var input = document.createElement('input');
        input.className = 'mminput';
        input.style = "z-index: 9999; font-size: large; position: fixed; top: "+ top +"px; left: " + (marginLeft) + "px; border:1px solid gray;";
        input.placeholder = name;
        let urls = JSON.parse(window.localStorage.getItem('lanhu_old_urls'));
        let pid = window.localStorage.getItem('lanhu_current_pid');
        if (urls != null && urls[pid]) {
            input.value = urls[pid].split('zuoyebang.cc')[1];
        }
        document.body.appendChild(input);
    }

    function remove() {
        let style = document.getElementsByClassName('mu-paper mu-drawer mu-paper-round mu-paper-2 open right')[0].getAttribute('style');
        if (style.indexOf('display') == -1) {
            drawerStyle = style;
            document.getElementsByClassName('mu-paper mu-drawer mu-paper-round mu-paper-2 open right')[0].setAttribute('style', 'display: none;');
        } else {
            document.getElementsByClassName('mu-paper mu-drawer mu-paper-round mu-paper-2 open right')[0].setAttribute('style', drawerStyle);
        }
    };

    function getFont() {
        font = font.split('Font')[0];
        let fontCode = ""
        if (normalFonts.indexOf(font) != -1) {
            font = "OCFontName" + font.slice(2);
            // .font(with: .Mnumbers, size: .Content)
            fontCode = "[UIFont MM_FontWith:" + font + " size:" + fontSize + "]";
        } else {
            if (fontSize.slice(2, -8) == "") {
                font = "OCFontName" + font.slice(2);
                // .font(with: .Mnumbers, size: .Content)
                fontCode = "[UIFont MM_FontWith:" + font + " size:" + fontSize + "]";
            } else {
                // [UIFont MMMediumFontWithFontSize:MMTitleFontSize]
                fontCode = "[UIFont " + font + "FontWithFontSize:"+ fontSize +"]";
            }
        }
        let btn = document.getElementsByClassName('mmbutton')[3];
        let btnText = btn.innerText;
        let textarea = "<textarea id=\"copyFont\" style=\"opacity: 0;\">" + fontCode + "</textarea>";
        btn.innerHTML = textarea;
        var element = document.getElementById("copyFont");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        btn.innerText = btnText
    };
    function getSwiftFont() {
        font = font.split('Font')[0];
        let fontCode = ""
        if (normalFonts.indexOf(font) != -1) {
            // .font(with: .Mnumbers, size: .Content)
            fontCode = "." +
                "font(with: ." +
                font.slice(2) +
                ", size:" +
                (fontSize.slice(2, -8) == '' ? fontSize : ("." + fontSize.slice(2, -8))) +
                ")"
        } else {
            if (fontSize.slice(2, -8) == "") {
                // .font(with: .Mnumbers, size: 36)
                fontCode = "." +
                    "font(with: ." +
                    font.slice(2) +
                    ", size:" +
                    fontSize +
                    ")"
            } else {
                // .mediumFont(with: .Content)
                fontCode = "." +
                    font.charAt(2).toLowerCase() +
                    font.slice(3) +
                    "Font(with: ." +
                    fontSize.slice(2, -8) + ")"
            }
        }
        let btn = document.getElementsByClassName('mmbutton')[5];
        let btnText = btn.innerText;
        let textarea = "<textarea id=\"copyFont\" style=\"opacity: 0;\">" + fontCode + "</textarea>";
        btn.innerHTML = textarea;
        var element = document.getElementById("copyFont");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        btn.innerText = btnText
    };

    function getColor() {
        color = color.split('_').join('');
        color = color.charAt(0).toLowerCase() + color.slice(1);
        // UIColor.mm_mainTitleColor
        let colorCode = "UIColor.mm_" + color + "Color";
        let btn = document.getElementsByClassName('mmbutton')[4];
        let btnText = btn.innerText;
        let textarea = "<textarea id=\"copyColor\" style=\"opacity: 0;\">" + colorCode + "</textarea>";
        btn.innerHTML = textarea;
        var element = document.getElementById("copyColor");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        btn.innerText = btnText
    }
    function getSwiftColor() {
        color = color.split('_').join('');
        color = color.charAt(0).toLowerCase() + color.slice(1);
        // .mm_mainTitle()
        let colorCode = "UIColor.mt." + color;
        let btn = document.getElementsByClassName('mmbutton')[6];
        let btnText = btn.innerText;
        let textarea = "<textarea id=\"copyColor\" style=\"opacity: 0;\">" + colorCode + "</textarea>";
        btn.innerHTML = textarea;
        var element = document.getElementById("copyColor");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        btn.innerText = btnText
    }

    function changeApp() {
        let btn = document.getElementsByClassName('mmbutton')[0];
        let key = 'mbkj'
        app = localStorage.getItem(key)
        if (app == '' || app == null) {
            app = 'mmj'
        }
        switch (app) {
            case 'mmj':
                btn.innerText = '错题APP'
                colorJson = colorStudyJson
                fontSizeJson = fontSizeOldJson
                localStorage.setItem(key, 'study');
                break;
            case 'study':
                btn.innerText = '国际版'
                colorJson = colorMMJJson
                fontSizeJson = fontSizeOldJson
                localStorage.setItem(key, 'international');
                break;
            case 'international':
                btn.innerText = '喵喵机'
                colorJson = colorMMJJson
                fontSizeJson = fontSizeNewJson
                localStorage.setItem(key, 'mmj');
                break;
            default:
                break;
        }
    }

    function appName() {
        let key = 'mbkj'
        app = localStorage.getItem(key)
        if (app == '' || app == null) {
            app = 'mmj'
        }
        switch (app) {
            case 'mmj':
                colorJson = colorMMJJson
                fontSizeJson = fontSizeNewJson
                return '喵喵机'
            case 'study':
                colorJson = colorStudyJson
                fontSizeJson = fontSizeOldJson
                return '错题APP'
            case 'international':
                colorJson = colorInternationalJson
                fontSizeJson = fontSizeOldJson
                return '国际版'
            default:
                return ""
        }
    }

    async function request(urlString) {
        return new Promise(function (resolve, reject) {
            // js发送http请求 利用相应的代码片段-->
            var xhr = new XMLHttpRequest(); // 初始化js中的内置对象XMLHttpRequest-->
            //定义 事件绑定中的函数，定义在xhr实例化之后，因为函数中需要xhr
            function success() {
                console.log("完成请求-响应啦！！！！！！！") //请求响应成功后再打印
                // console.log(xhr.responseText) //拿到 响应的响应体信息,响应正文
                console.log(xhr.status) //拿到请求的响应状态码
                if (xhr.status != 200) {
                    //alert('请求 image 错误')
                    reject(xhr.status)
                    return
                }
                const data = JSON.parse(xhr.responseText) //把响应正文转换为json对象
                resolve(data)
            }
            xhr.onload = success; //当请求响应完成后，去执行success函数
            xhr.open("get", urlString); // 提供HTTP请求的 方法和url-->
            xhr.setRequestHeader("Authorization", authorization);
            xhr.send(); // 发起真正的请求-->
        });
    }

    // 展示切图, 目前没用
    function imageHandle(json) {
        var images = json.info
        images = images.filter(image => image.image != null);
        // console.log(images);

        var results = []
        var logs = []
        images.forEach(element => {
            const imageUrl = element.image.imageUrl
            if (results.indexOf(imageUrl) !== -1) {
                return
            }
            results.push(imageUrl)
            const log = {};
            log.name = element.name
            log.imageUrl = imageUrl
            log.id = imageUrl.split('/').pop()
            logs.push(log)
        });
        console.log(logs);
        return logs;
        /*
        results.forEach(element => {
            var div = document.createElement("div");
            div.style.display = "flex";
            div.style.alignItems = "center";
            div.style.justifyContent = "center";
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.margin = "10px";
            div.className = "image";
            div.innerHTML = `<img src="${element}" style="width: -webkit-fill-available; height: -webkit-fill-available;">`;
            document.getElementById('app').appendChild(div);
        })
        */
    }

    async function copyImagesJSON() {
        let href = window.location.href;
        let image_id = href
            .split('&')
            .filter(e => e.indexOf('image_id') !== -1)
            .map (e => { return e.split('=')[1] })[0]

        if (image_id == null) {
            console.log("没有找到 image_id")
            return
        }

        let imageSearch = await request("http://lanhu.zuoyebang.cc/api/project/image?image_id=" + image_id);
        let sketchurl = imageSearch.result.versions[0].json_url
        if (sketchurl == null) {
            alert('切图下载失败, 没有找到 json')
            return
        }
        let jsonString = await request(sketchurl).then(imageHandle)

        let btn = document.getElementsByClassName('mmbutton')[8];
        let btnText = btn.innerText;
        let textarea = "<textarea id=\"copyImagesJSON\" style=\"opacity: 0;\">" + JSON.stringify(jsonString) + "</textarea>";
        btn.innerHTML = textarea;
        var element = document.getElementById("copyImagesJSON");
        element.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        btn.innerText = btnText
        const title = document.getElementsByClassName('current_name name_only')[0].innerText
        const url = 'http://mb.nps.zwyxxd.press:2061/lanhu_handle.html?images=' + window.btoa(window.encodeURIComponent(JSON.stringify(jsonString))) + '&url=' + window.encodeURIComponent(window.location.href) + '&name=' + title
        window.open(url)
    }

    var drawerStyle = '';
    var btnLeft = screen.width/5;
    var marginLeft = 30;
    btnLeft += marginLeft;
    btnLeft = addButton(appName(), btnLeft, 0, changeApp);
    btnLeft += marginLeft;
    addTextField("输入网址", btnLeft, 40);
    btnLeft = addButton('点击开关抽屉', btnLeft, 0, remove);
    btnLeft += marginLeft;
    addButton('SaveUrl', btnLeft + 50, 40, saveUrl);
    btnLeft = addButton('点击更换文字', btnLeft, 0, changeText);
    btnLeft += marginLeft;
    addButton('LoadUrl', btnLeft, 40, loadUrl);
    btnLeft = addButton('OC 字体', btnLeft, 0, getFont);
    btnLeft += marginLeft;
    addButton('CopyUrl', btnLeft, 40, copyUrl);
    btnLeft = addButton('OC 颜色', btnLeft, 0, getColor);
    btnLeft += marginLeft;
    addButton('切图JSON', btnLeft, 40, copyImagesJSON);
    btnLeft = addButton('Swift 字体', btnLeft, 0, getSwiftFont);
    btnLeft += marginLeft;
    btnLeft = addButton('Swift 颜色', btnLeft, 0, getSwiftColor);
})();
