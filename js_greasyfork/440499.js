// ==UserScript==
// @name         Youdao Fanyi's Friend
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  有道翻译免费导出
// @author       Zzn
// @match        *://c.youdao.com/dict_document_web/#/*
// @match        *://c.youdao.com/dict_document_web/*
// @match        *://c.youdao.com/*
// @match        *://pdf.youdao.com/docview.html/*
// @match        *://pdf.youdao.com/docview.html?key=*
// @icon         http://shared.ydstatic.com/images/favicon.ico
// @grant        none
// @require https://cdn.jsdelivr.net/npm/jspdf@2.4.0/dist/jspdf.umd.min.js
// @require https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require https://unpkg.com/pdf-lib/dist/pdf-lib.min.js
// @downloadURL https://update.greasyfork.org/scripts/440499/Youdao%20Fanyi%27s%20Friend.user.js
// @updateURL https://update.greasyfork.org/scripts/440499/Youdao%20Fanyi%27s%20Friend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //public SakiProgress
    var SakiProgress = {
        isLoaded: false,
        progres: false,
        pgDiv: false,
        textSpan: false,
        first: false,
        alertMode: false,
        init: function (color) {
            if (!this.isLoaded) {
                this.isLoaded = true;
                console.info("SakiProgress Initializing!\nVersion:1.0.3\nQinlili Tech:Github@qinlili23333");
                this.pgDiv = document.createElement("div");
                this.pgDiv.id = "pgdiv";
                this.pgDiv.style = "z-index:9999;position:fixed;background-color:white;min-height:32px;width:auto;height:32px;left:0px;right:0px;top:0px;box-shadow:0px 2px 2px 1px rgba(0, 0, 0, 0.5);transition:opacity 0.5s;display:none;";
                this.pgDiv.style.opacity = 0;
                this.first = document.body.firstElementChild;
                document.body.insertBefore(this.pgDiv, this.first);
                this.first.style.transition = "margin-top 0.5s"
                this.progress = document.createElement("div");
                this.progress.id = "dlprogress"
                this.progress.style = "position: absolute;top: 0;bottom: 0;left: 0;background-color: #F17C67;z-index: -1;width:0%;transition: width 0.25s ease-in-out,opacity 0.25s,background-color 1s;"
                if (color) {
                    this.setColor(color);
                }
                this.pgDiv.appendChild(this.progress);
                this.textSpan = document.createElement("span");
                this.textSpan.style = "padding-left:4px;font-size:24px;";
                this.textSpan.style.display = "inline-block"
                this.pgDiv.appendChild(this.textSpan);
                var css = ".barBtn:hover{ background-color: #cccccc }.barBtn:active{ background-color: #999999 }";
                var style = document.createElement('style');
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                document.getElementsByTagName('head')[0].appendChild(style);
                console.info("SakiProgress Initialized!");
            } else {
                console.error("Multi Instance Error-SakiProgress Already Loaded!");
            }
        },
        destroy: function () {
            if (this.pgDiv) {
                document.body.removeChild(this.pgDiv);
                this.isLoaded = false;
                this.progres = false;
                this.pgDiv = false;
                this.textSpan = false;
                this.first = false;
                console.info("SakiProgress Destroyed!You Can Reload Later!");
            }
        },
        setPercent: function (percent) {
            if (this.progress) {
                this.progress.style.width = percent + "%";
            } else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        clearProgress: function () {
            if (this.progress) {
                this.progress.style.opacity = 0;
                setTimeout(function () { SakiProgress.progress.style.width = "0%"; }, 500);
                setTimeout(function () { SakiProgress.progress.style.opacity = 1; }, 750);
            } else {
                console.error("Not Initialized Error-Please Call `init` First!")
            }
        },
        hideDiv: function () {
            if (this.pgDiv) {
                if (this.alertMode) {
                    setTimeout(function () {
                        SakiProgress.pgDiv.style.opacity = 0;
                        SakiProgress.first.style.marginTop = "";
                        setTimeout(function () {
                            SakiProgress.pgDiv.style.display = "none";
                        }, 500);
                    }, 3000);
                } else {
                    this.pgDiv.style.opacity = 0;
                    this.first.style.marginTop = "";
                    setTimeout(function () {
                        SakiProgress.pgDiv.style.display = "none";
                    }, 500);
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        showDiv: function () {
            if (this.pgDiv) {
                this.pgDiv.style.display = "";
                setTimeout(function () { SakiProgress.pgDiv.style.opacity = 1; }, 10);
                this.first.style.marginTop = (this.pgDiv.clientHeight + 8) + "px";
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setText: function (text) {
            if (this.textSpan) {
                if (this.alertMode) {
                    setTimeout(function () {
                        if (!SakiProgress.alertMode) {
                            SakiProgress.textSpan.innerText = text;
                        }
                    }, 3000);
                } else {
                    this.textSpan.innerText = text;
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setTextAlert: function (text) {
            if (this.textSpan) {
                this.textSpan.innerText = text;
                this.alertMode = true;
                setTimeout(function () { this.alertMode = false; }, 3000);
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        setColor: function (color) {
            if (this.progress) {
                this.progress.style.backgroundColor = color;
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        addBtn: function (img) {
            if (this.pgDiv) {
                var btn = document.createElement("img");
                btn.style = "display: inline-block;right:0px;float:right;height:32px;width:32px;transition:background-color 0.2s;"
                btn.className = "barBtn"
                btn.src = img;
                this.pgDiv.appendChild(btn);
                return btn;
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        },
        removeBtn: function (btn) {
            if (this.pgDiv) {
                if (btn) {
                    this.pgDiv.removeChild(btn);
                }
            }
            else {
                console.error("Not Initialized Error-Please Call `init` First!");
            }
        }
    }


    // Your code here...
    SakiProgress.init();
    console.log("Initializing ZnDownloader...");
    var jsPDF = null;
    try{
        jsPDF=jspdf.jsPDF;
        console.log("jsPDF Ready!")
    }catch{
        console.error("jsPDF Not Ready!")
    }

    //init param
    var pageTotal = 0;
    var PDFfile=false;
    var currentTime = 0;
    var imgList=[];
    var imgDataList=[];
    var imgEle=document.createElement("img");
    document.body.appendChild(imgEle);


    //多线程快速下载
    function downloadPicList(list) {
        var donePage = 0;
        for(var j=0;j<list.length;j++){
            toDataURL(list[j],j,function(data,page){
                imgDataList[page]=data;
                donePage++
                SakiProgress.setPercent(donePage/pageTotal*90)
                SakiProgress.setText("已下载"+donePage+"页...")
                if(donePage==pageTotal){
                    SakiProgress.setText("准备生成PDF...")
                    makePDF();
                }
            })
        }

        //读取图片并转base64
        function toDataURL(url,page, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onloadend = function() {
                    callback(reader.result,page);
                }
                reader.readAsDataURL(xhr.response);//to base64
                //console.log(j + "---" + xhr.response)
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.setRequestHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST');
            xhr.setRequestHeader('Access-Control-Allow-Headers','x-requested-with');
            xhr.setRequestHeader('Access-Control-Max-Age','86400');

            xhr.setRequestHeader('Access-Control-Allow-Credentials','true');
            xhr.withCredentials = true;
            xhr.send();
        }

    }


    //制作PDF
    function makePDF(){
        console.log('make pdf...')
        //console.log(imgDataList)

        for(var k=0;imgDataList[k];k++){
            //imgEle.src=imgDataList[k];
            PDFfile.addImage(imgDataList[k],"JPEG",0,0,imgEle.naturalWidth,imgEle.naturalHeight,"Page"+(k+1),"SLOW")
            PDFfile.addPage();
            SakiProgress.setText("已生成"+k+"页...")
        }
        PDFfile.deletePage(imgDataList.length + 1);//delete the end blank page
        SakiProgress.setText("正在制作PDF...")
        PDFfile.save(getPdfName(),{returnPromise:true}).then(finish => {
            SakiProgress.clearProgress;
            SakiProgress.hideDiv();
        });
    }

    //批量下载
    function batchDownload() {
        SakiProgress.showDiv()
        SakiProgress.setText("正在读取页面信息...")
        console.log("Initializing image list...")

        //  https://doctrans-service.youdao.com/trandoc/doc/getFullOriginModeImg?docKey=64EBF13E1D134669B72DF4C694089EF5&pageName=tran-0.jpeg&src=new-fanyiweb&isCheckTermUpdate=false&isUseTerm=false

        $("#docTranslationImg").children().each(function(i,el){
            imgList[i]=$(this).children("img").attr("data-src")
        });
        //get docKey
        var docKey = getDocKey(imgList[0]);
        //calculate total page
        getTotalPage(docKey);
        for(var i=0;i<pageTotal;i++){
            imgList[i]=getImgUrl(docKey,i);
        }

        SakiProgress.setText("正在读取参数并建立PDF...")
        imgEle.onload=function(){
            var ori
            if(imgEle.naturalWidth>imgEle.naturalHeight){ori="l"}else{ori="p"}
            PDFfile=new jsPDF({
                orientation: ori,
                unit: 'px',
                format: [imgEle.naturalWidth,imgEle.naturalHeight],
                putOnlyUsedFonts:true,
            });
            SakiProgress.setText("正在准备下载页面...")
            downloadPicList(imgList,imgDataList)
        }
        imgEle.src=imgList[0]
    }

    //获取文件名
    function getPdfName(){
        // return $(".original-doc-name").first().html() + ".pdf";
        return "（" + $('#filenameInput').html() + "）.pdf";
        // return "（" + $('.docName-text').children().html() + "）.pdf";
    }

    function getTotalPage(docKey){
        var viewPage = 1;
        var isEnd = false;
        pageTotal = 0;
        var s = genSign(docKey);
        getTotalPage0()
        SakiProgress.setText("加载完成，共"+pageTotal+"页，等待下载...")
        function getTotalPage0(){
            var url = "https://doctrans-service.youdao.com/trandoc/doc/viewFullOriginModeJSON?docKey=" + docKey + "&viewPage=" + viewPage + "&src=new-fanyiweb";

            //调用url之前先调用其他两个url，
            SakiProgress.setText('viewPage: ' + viewPage + ' 正在加载')
            console.log('viewPage: ' + viewPage + ' 正在加载')
            var isGoOn = getFullOrign(docKey,s.sign,s.salt,viewPage)
            if(isGoOn != 205){//是否继续获取未加载页面
                //console.log('viewPage: ' + viewPage + ' 正在获取')
                var jsonStr = getUrlJson(url + "&_=" + getTimestamp());//同步获取json
                //console.log('viewPage: ' + viewPage + ' 正在判定')
                var recvJson = JSON.parse(jsonStr);
                isEnd = recvJson['data']
                //若isEnd不存在，可能真的不存在，也可能还未加载出来，但是既然能isGoOn，isEnd肯定是存在的，所以不需要其他判断
                if(isEnd != undefined){
                    var tranLength = recvJson['data']['tran'].length
                    //console.log(recvJson['data']['tran']);
                    pageTotal += (recvJson['data']['tran'][tranLength-1].pageOrder - recvJson['data']['tran'][0].pageOrder + 1); //TODO
                    //console.log('viewPage: ' + viewPage + ' 当前页数: ' + pageTotal)
                    SakiProgress.setText("正在加载翻译，已翻译"+pageTotal+"页")
                    if(!(isEnd=recvJson['data']['isEnd'])){
                        console.log('viewPage: ' + viewPage + ' 后面还有，继续')
                        viewPage++;
                        getTotalPage0();
                    }
                }else{//用于解决youdaofanyi后台反应不过来的问题
                    SakiProgress.setText("youdao太慢，正在重新访问链接...")
                    sleep(5000)
                    getTotalPage0()
                }
            }
        }
    }
    function sleep(delay) {
        for(var t = Date.now(); Date.now() - t <= delay;);
    }
    function getFullOrign(docKey,sign,salt,page){
        var url = "https://doctrans-service.youdao.com/trandoc/doc/genFullOriginPage?docKey=" + docKey + "&viewPage=" + page + "&isCheckTermUpdate=false&isUseTerm=false&imei=&sign=" + sign + "&salt=" + salt + "&src=new-fanyiweb"
        var url2 = "https://doctrans-service.youdao.com/trandoc/doc/originFullProgress?key=" + docKey + "&imei=&viewPage=" + page + "&src=new-fanyiweb"

        var jsonStr = getUrlJson(url + "&_=" + getTimestamp());//同步获取json
        var recvJson = JSON.parse(jsonStr);
        var errorcode = recvJson['errorcode']
        var docname = recvJson['docname']
        $('#filenameInput').html(docname)
        if(errorcode != 205){
            var jsonStr2 = getUrlJson(url2 + "&_=" + getTimestamp());//激活未加载的页面（此操作后可获取出未加载的页面）
            //return true;
        }//else{
        //    return false;
        //}
        return errorcode
    }

    function getDocKey(imgUrl){
    	// 通过当前页url获取docKey，而不是imgUrl
        return getQueryString(window.location.href, 'docKey')
        //TODO 兼容老版本
        //return getQueryString(window.location.href, 'key')
    }

    function getQueryString(url, name) {
        var arrObj = url.split("?");
        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;
            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");

                if (arr != null && arr[0] == name) {
                    return arr[1];
                }
            }
            return "";
        }
        else {
            return "";
        }
    }

    //获取json
    function getUrlJson(url) {
        var xhr = new XMLHttpRequest();
        //         xhr.onload = function() {//异步
        //             callback(xhr.response);
        //         };
        xhr.open('GET', url, false);
        //xhr.responseType = 'json';//同步不能设置该项
        xhr.setRequestHeader('Access-Control-Allow-Origin','*');
        xhr.setRequestHeader('Access-Control-Allow-Methods','OPTIONS, GET, POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers','x-requested-with');
        xhr.setRequestHeader('Access-Control-Max-Age','86400');
        xhr.setRequestHeader('Access-Control-Allow-Credentials','true');
        xhr.withCredentials = true;
        xhr.send(null);
        if (xhr.status === 200) {//同步
            return xhr.response
        }
    }

    //根据下标获取拼接好的图片url
    function getImgUrl(docKey, idx){
        return 'https://doctrans-service.youdao.com/trandoc/doc/getFullOriginModeImg?docKey=' + docKey + '&pageName=tran-' + idx + '.jpeg&src=new-fanyiweb&isCheckTermUpdate=false&isUseTerm=false'

    }

    //获取sign和salt
    function genSign(docKey) {
        var t = "new-fanyiweb"
        var n = "ydsecret://newfanyiweb.doctran/sign/0j9n2{3mLSN-$Lg]K4o0N2}"
        , o = (new Date).getTime();
        return {
            salt: o,
            sign: getSign_r(t + o + n + docKey)
        }
    }

    function getTimestamp(){
        currentTime++
        return currentTime;
    }

    //private
    function getSign_r(e,t){
        if(null==e)
            throw new Error("Illegal argument "+e);
        //r
        var r = {
            rotl: function(e, t) {
                return e << t | e >>> 32 - t
            },
            rotr: function(e, t) {
                return e << 32 - t | e >>> t
            },
            endian: function(e) {
                if (e.constructor == Number)
                    return 16711935 & r.rotl(e, 8) | 4278255360 & r.rotl(e, 24);
                for (var t = 0; t < e.length; t++)
                    e[t] = r.endian(e[t]);
                return e
            },
            randomBytes: function(e) {
                for (var t = []; e > 0; e--)
                    t.push(Math.floor(256 * Math.random()));
                return t
            },
            bytesToWords: function(e) {
                for (var t = [], n = 0, r = 0; n < e.length; n++,
                     r += 8)
                    t[r >>> 5] |= e[n] << 24 - r % 32;
                return t
            },
            wordsToBytes: function(e) {
                for (var t = [], n = 0; n < 32 * e.length; n += 8)
                    t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
                return t
            },
            bytesToHex: function(e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push((e[n] >>> 4).toString(16)),
                        t.push((15 & e[n]).toString(16));
                return t.join("")
            },
            hexToBytes: function(e) {
                for (var t = [], n = 0; n < e.length; n += 2)
                    t.push(parseInt(e.substr(n, 2), 16));
                return t
            },
            bytesToBase64: function(e) {
                for (var t = [], r = 0; r < e.length; r += 3)
                    for (var o = e[r] << 16 | e[r + 1] << 8 | e[r + 2], i = 0; i < 4; i++)
                        8 * r + 6 * i <= 8 * e.length ? t.push(n.charAt(o >>> 6 * (3 - i) & 63)) : t.push("=");
                return t.join("")
            },
            base64ToBytes: function(e) {
                e = e.replace(/[^A-Z0-9+\/]/gi, "");
                for (var t = [], r = 0, o = 0; r < e.length; o = ++r % 4)
                    0 != o && t.push((n.indexOf(e.charAt(r - 1)) & Math.pow(2, -2 * o + 8) - 1) << 2 * o | n.indexOf(e.charAt(r)) >>> 6 - 2 * o);
                return t
            },
            stringToBytes: function(e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push(255 & e.charCodeAt(n));
                return t
            },
            bytesToString: function(e) {
                for (var t = [], n = 0; n < e.length; n++)
                    t.push(String.fromCharCode(e[n]));
                return t.join("")
            }
        }

        //function u
        var u = function(e, t) {
            e.constructor == String ? e = t && "binary" === t.encoding ? r.stringToBytes(e) : r.stringToBytes(e) : i(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || e.constructor === Uint8Array || (e = e.toString());
            for (var n = r.bytesToWords(e), s = 8 * e.length, c = 1732584193, l = -271733879, f = -1732584194, p = 271733878, d = 0; d < n.length; d++)
                n[d] = 16711935 & (n[d] << 8 | n[d] >>> 24) | 4278255360 & (n[d] << 24 | n[d] >>> 8);
            n[s >>> 5] |= 128 << s % 32,
                n[14 + (s + 64 >>> 9 << 4)] = s;
            var h = u._ff
            , y = u._gg
            , v = u._hh
            , g = u._ii;
            for (d = 0; d < n.length; d += 16) {
                var m = c
                , b = l
                , x = f
                , w = p;
                c = h(c, l, f, p, n[d + 0], 7, -680876936),
                    p = h(p, c, l, f, n[d + 1], 12, -389564586),
                    f = h(f, p, c, l, n[d + 2], 17, 606105819),
                    l = h(l, f, p, c, n[d + 3], 22, -1044525330),
                    c = h(c, l, f, p, n[d + 4], 7, -176418897),
                    p = h(p, c, l, f, n[d + 5], 12, 1200080426),
                    f = h(f, p, c, l, n[d + 6], 17, -1473231341),
                    l = h(l, f, p, c, n[d + 7], 22, -45705983),
                    c = h(c, l, f, p, n[d + 8], 7, 1770035416),
                    p = h(p, c, l, f, n[d + 9], 12, -1958414417),
                    f = h(f, p, c, l, n[d + 10], 17, -42063),
                    l = h(l, f, p, c, n[d + 11], 22, -1990404162),
                    c = h(c, l, f, p, n[d + 12], 7, 1804603682),
                    p = h(p, c, l, f, n[d + 13], 12, -40341101),
                    f = h(f, p, c, l, n[d + 14], 17, -1502002290),
                    c = y(c, l = h(l, f, p, c, n[d + 15], 22, 1236535329), f, p, n[d + 1], 5, -165796510),
                    p = y(p, c, l, f, n[d + 6], 9, -1069501632),
                    f = y(f, p, c, l, n[d + 11], 14, 643717713),
                    l = y(l, f, p, c, n[d + 0], 20, -373897302),
                    c = y(c, l, f, p, n[d + 5], 5, -701558691),
                    p = y(p, c, l, f, n[d + 10], 9, 38016083),
                    f = y(f, p, c, l, n[d + 15], 14, -660478335),
                    l = y(l, f, p, c, n[d + 4], 20, -405537848),
                    c = y(c, l, f, p, n[d + 9], 5, 568446438),
                    p = y(p, c, l, f, n[d + 14], 9, -1019803690),
                    f = y(f, p, c, l, n[d + 3], 14, -187363961),
                    l = y(l, f, p, c, n[d + 8], 20, 1163531501),
                    c = y(c, l, f, p, n[d + 13], 5, -1444681467),
                    p = y(p, c, l, f, n[d + 2], 9, -51403784),
                    f = y(f, p, c, l, n[d + 7], 14, 1735328473),
                    c = v(c, l = y(l, f, p, c, n[d + 12], 20, -1926607734), f, p, n[d + 5], 4, -378558),
                    p = v(p, c, l, f, n[d + 8], 11, -2022574463),
                    f = v(f, p, c, l, n[d + 11], 16, 1839030562),
                    l = v(l, f, p, c, n[d + 14], 23, -35309556),
                    c = v(c, l, f, p, n[d + 1], 4, -1530992060),
                    p = v(p, c, l, f, n[d + 4], 11, 1272893353),
                    f = v(f, p, c, l, n[d + 7], 16, -155497632),
                    l = v(l, f, p, c, n[d + 10], 23, -1094730640),
                    c = v(c, l, f, p, n[d + 13], 4, 681279174),
                    p = v(p, c, l, f, n[d + 0], 11, -358537222),
                    f = v(f, p, c, l, n[d + 3], 16, -722521979),
                    l = v(l, f, p, c, n[d + 6], 23, 76029189),
                    c = v(c, l, f, p, n[d + 9], 4, -640364487),
                    p = v(p, c, l, f, n[d + 12], 11, -421815835),
                    f = v(f, p, c, l, n[d + 15], 16, 530742520),
                    c = g(c, l = v(l, f, p, c, n[d + 2], 23, -995338651), f, p, n[d + 0], 6, -198630844),
                    p = g(p, c, l, f, n[d + 7], 10, 1126891415),
                    f = g(f, p, c, l, n[d + 14], 15, -1416354905),
                    l = g(l, f, p, c, n[d + 5], 21, -57434055),
                    c = g(c, l, f, p, n[d + 12], 6, 1700485571),
                    p = g(p, c, l, f, n[d + 3], 10, -1894986606),
                    f = g(f, p, c, l, n[d + 10], 15, -1051523),
                    l = g(l, f, p, c, n[d + 1], 21, -2054922799),
                    c = g(c, l, f, p, n[d + 8], 6, 1873313359),
                    p = g(p, c, l, f, n[d + 15], 10, -30611744),
                    f = g(f, p, c, l, n[d + 6], 15, -1560198380),
                    l = g(l, f, p, c, n[d + 13], 21, 1309151649),
                    c = g(c, l, f, p, n[d + 4], 6, -145523070),
                    p = g(p, c, l, f, n[d + 11], 10, -1120210379),
                    f = g(f, p, c, l, n[d + 2], 15, 718787259),
                    l = g(l, f, p, c, n[d + 9], 21, -343485551),
                    c = c + m >>> 0,
                    l = l + b >>> 0,
                    f = f + x >>> 0,
                    p = p + w >>> 0
            }
            return r.endian([c, l, f, p])
        }
        u._ff = function(e, t, n, r, o, i, a) {
            var u = e + (t & n | ~t & r) + (o >>> 0) + a;
            return (u << i | u >>> 32 - i) + t
        },u._gg = function(e, t, n, r, o, i, a) {
            var u = e + (t & r | n & ~r) + (o >>> 0) + a;
            return (u << i | u >>> 32 - i) + t
        },u._hh = function(e, t, n, r, o, i, a) {
            var u = e + (t ^ n ^ r) + (o >>> 0) + a;
            return (u << i | u >>> 32 - i) + t
        },u._ii = function(e, t, n, r, o, i, a) {
            var u = e + (n ^ (t | ~r)) + (o >>> 0) + a;
            return (u << i | u >>> 32 - i) + t
        },u._blocksize = 16,u._digestsize = 16

        var n=r.wordsToBytes(u(e,t));
        return t&&t.asBytes?n:t&&t.asString?r.bytesToString(n):r.bytesToHex(n)
    }

    //创建下载按钮
    var downloadBtn=$("<a id='exportDoc2' href='javascript:;'>导出文档</a>");
    var filenameInput = $("<span id='filenameInput'></span>");
    $("#app").prepend(filenameInput);
    $("#app").prepend(downloadBtn);
    // $("#exportDoc").parent().prepend(downloadBtn);
    // $("#exportDoc").remove();
    //TODO 兼容老版本
    $("#exportDoc").parent().prepend(downloadBtn);
    $("#exportDoc").remove();

    downloadBtn.bind("contextmenu",function(){
         return false;
    })
    downloadBtn.mousedown(function(e) {
        SakiProgress.showDiv()
        SakiProgress.setText("正在加载翻译，信息量大，请勿关闭页面...")
        currentTime = Date.now()
        setTimeout(function(){//是为了让进度条先显示出来
            batchDownload()
        },100)
    })
    // downloadBtn.click(function() {
    //     SakiProgress.showDiv()
    //     SakiProgress.setText("正在加载翻译，信息量大，请勿关闭页面...")
    //     currentTime = Date.now()
    //     setTimeout(function(){//是为了让进度条先显示出来
    //         batchDownload()
    //     },100)
    // });



})();