// ==UserScript==
// @name 语音合成实例
// @description 引用腾讯优图的语音合成接口。
// @namespace https://greasyfork.org/users/420865
// @match *
// @version 0.0.1.20200330111833
// @downloadURL https://update.greasyfork.org/scripts/395372/%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90%E5%AE%9E%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/395372/%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90%E5%AE%9E%E4%BE%8B.meta.js
// ==/UserScript==

//  向当前页面导入jQuery、JsonExportExcel、CryptoJS，立即执行
(function install_jQuery_JsonExportExcel() {
    //	判断页面是否引入"jquery"、"JsonExportExcel"、"CryptoJS"，如果已经引入，则直接执行主程序，否则执行引入程序
    var srcArr = [  "https://code.jquery.com/jquery-3.4.1.min.js", 
                    "https://cuikangjie.github.io/JsonExportExcel/dist/JsonExportExcel.min.js", 
                    "https://greasyfork.org/scripts/395371-js%E5%B0%8F%E5%B7%A5%E5%85%B7/code/JS%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js"];
    var srcName = ["jquery", "JsonExportExcel", "CryptoJS"];
    if (document.head.innerHTML.indexOf("jquery") != -1 && document.head.innerHTML.indexOf("JsonExportExcel") != -1) {
        return;
    } else {
        for (var i = 0; i < srcArr.length; i++) {
            install(srcArr[i], i);
        }
        return;
    }
    function install(srcStr, index) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = srcStr;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = (function() {
            //	js加载完成执行方法，必须写成立即执行的格式。否则，后面的语句都执行完了才开始执行这句。这是因为连接外部链接默认为异步执行。
            console.log(srcName[index] + ' 加载完成');
        }())
    }
}())

var html_downloader = {
    getSignature: function(oStr, secretKey) {
        let originalStrWordArray = CryptoJS.enc.Utf8.parse(oStr);
        // 将源签名串解析成 wordArray 类型
        let signWordArray = CryptoJS.HmacSHA1(oStr, secretKey);
        let concatWordArray = signWordArray.concat(originalStrWordArray);
        // 通过 wordArray concat 将两个数据进行拼接合并
        let authorization = CryptoJS.enc.Base64.stringify(concatWordArray);
        // 最终进行 Base64 编码，成功生成签名串
        return authorization;
    },
    download: function(urlStr) {
        let tempResult;
        if (typeof urlStr == "undefined" || urlStr === null || urlStr === "") {
            alert("请输入正确的链接！")
            return;
        } else {
            /*	
					特别注意，ajax默认异步执行，在抓取到数据之前就执行下一步动作了。
					所以ajax中要设置一个选项 async: false ，同步执行。
					仅仅如此还不够，要将ajax纳入到一个“立即执行函数”中去。
					正确写法：(function($.ajax({async: false,});){}())
				*/
            (function() {
                let tTime = parseInt(new Date().getTime() / 1000);
                let eTime = tempTime + 10000;
                let orignalStr = "u=3158952687&a=10177259&k=AKID42EBtNhXCbopitwpNkKCvhOx16xYdxpT&e=" + eTime + "&t=" + tTime + "&r=270494647&f=";
                let SecretKey = "YptiGYZNvDLGvKSKzNXVszpQlsjJhvxi";
                let signStr = html_downloader.getSignature(orignalStr, SecretKey);
                $.ajax({
                    type: 'POST',
                    url: urlStr,
                    async: false,
                    contentType: 'application/json',
                    beforeSend: function(request) {
                        request.setRequestHeader("Host", "api.youtu.qq.com");
                        request.setRequestHeader("Authorization", signStr);
                    },
                    data: {
                        "app_id": "10177259",
                        "text": "腾讯优图，让未来在你身边",
                        "session_id": "1000000111111",
                        "model_type": 0,
                        "speed": 0
                    },
                    success: function(result) {
                        tempResult = result;
                    },
                    error: function(message) {
                        console.log('抓取页面失败！');
                        console.log(message.statusText);
                        return;
                    }
                });
            }())

            return tempResult;
        }
    }
}

uStr = 'http://api.youtu.qq.com/youtu/ttsapi/text_to_audio';
html_downloader.download(uStr);
