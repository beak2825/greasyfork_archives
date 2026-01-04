// ==UserScript==
// @name         自动下载来漫画的漫画到电脑V2
// @namespace    http://ynotme.club/
// @version      1.1
// @description  自动下载来漫画的漫画V2
// @author       zhangtao103239
// @match        https://www.laimanhua.com/kanmanhua/*/
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/379912/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E6%9D%A5%E6%BC%AB%E7%94%BB%E7%9A%84%E6%BC%AB%E7%94%BB%E5%88%B0%E7%94%B5%E8%84%91V2.user.js
// @updateURL https://update.greasyfork.org/scripts/379912/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E6%9D%A5%E6%BC%AB%E7%94%BB%E7%9A%84%E6%BC%AB%E7%94%BB%E5%88%B0%E7%94%B5%E8%84%91V2.meta.js
// ==/UserScript==

(function() {
    function utf8_decode ( str_data ) {
        var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
        str_data += '';
        while ( i < str_data.length ) {
            c1 = str_data.charCodeAt(i);
            if (c1 < 128) {
                tmp_arr[ac++] = String.fromCharCode(c1);
                i++;
            } else if ((c1 > 191) && (c1 < 224)) {
                c2 = str_data.charCodeAt(i+1);
                tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = str_data.charCodeAt(i+1);
                c3 = str_data.charCodeAt(i+2);
                tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return tmp_arr.join('');
    }
    function base64_decode (data) {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
        if (!data) {return data;}
        data += '';
        do {
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));
            bits = h1<<18 | h2<<12 | h3<<6 | h4;
            o1 = bits>>16 & 0xff;
            o2 = bits>>8 & 0xff;
            o3 = bits & 0xff;
            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);
        dec = tmp_arr.join('');
        dec = utf8_decode(dec);
        return dec;
    }
    function ithmsh(nummhstr){
        var x, num_out,num_in,str_out,realstr;
        x=nummhstr.replaceAll1("JLmh160","");
        realstr=x;
        var PicUrlArr1=x.split("$qingtiandy$");
        for(var k = 0; k < PicUrlArr1.length; k++) {
           str_out="";
           num_out = PicUrlArr1[k];
           for(var i = 0; i < num_out.length; i += 2) {
              num_in = parseInt(num_out.substr(i,[2])) + 23;
              num_in = unescape('%' + num_in.toString(16));
              str_out += num_in;
           }
           realstr=realstr.replaceAll1(num_out,unescape(str_out));
        }
        return realstr;
    }
    function jsff(str, pwd) {
        if (str == "") return "";
        if (!pwd || pwd == "") { pwd = "1234"; }
        pwd = escape(pwd);
        if (str == null || str.length < 8) {
            alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
            return;
        }
        if (pwd == null || pwd.length <= 0) {
            alert("Please enter a password with which to decrypt the message.");
            return;
        }
        var prand = "";
        for (var I = 0; I < pwd.length; I++) {
            prand += pwd.charCodeAt(I).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        var incr = Math.round(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        var salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while (prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for (I = 0; I < str.length; I += 2) {
            enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
            enc_str += String.fromCharCode(enc_chr);
            prand = (mult * prand + incr) % modu;
        }
        return unescape(enc_str);
    }
    function itwrnm(nummhstr){
        var x, text,realstr;
        x=nummhstr.replaceAll1("TWmh160","");
        realstr=x;
        var PicUrlArr1=x.split("$qingtiandy$");
        for(var k = 0; k < PicUrlArr1.length; k++) {
           var last="";
           text = PicUrlArr1[k];
           last=jsff(text,z$)
           realstr=realstr.replaceAll1(text,last);
        }
        return realstr;
    }

    function getpicdamin(responseText)  {
        var cid = /cid = "([0-9]+)"/g.exec(responseText)[1];
        var pid = /currentChapterid = '([0-9]+)'/g.exec(responseText)[1];
        if (parseInt(cid)>10000){
            yuming="https://mhpic6.szsjcd.cn";
        }else{
            yuming="https://mhpic7.szsjcd.cn";
        }
        if (parseInt(pid)>542724){
            yuming="https://mhpic5.szsjcd.cn";
        }
        return yuming;
    }

    function startDownload() {
        var comieList = [];
        // 获取漫画列表
        $("#play_0 li >a").each((i, e) => {
            comieList.push([e.title, e.href]);
        });
        var title = $("h1").text();
        var chStr=prompt("目前发现了"+comieList.length+"话漫画，请输入要下载的部分","1-"+comieList.length)
        if(/^[0-9]+-[0-9]+$/.test(chStr)){
            var st = chStr.split("-");
            var start = parseInt(st[0])
            var end = parseInt(st[1])
            comieList.splice(end)
            comieList.splice(0,start-1)
        }
        var start = confirm("即将从"+comieList[0][0]+"下载到"+comieList[comieList.length-1][0])
        if(!start)
        return
        $("#downloadComic").text("下载中……");
        //$("#downloadComic").unbind("click");
        var zip = new JSZip();
        var i = 0;
        function download () {
             if (i < comieList.length) {
                var curChaptZip = zip.folder(comieList[i][0]);
                var curChaptButton = $("a[title='"+comieList[i][0]+"']")
                curChaptButton.text("下载中……");
                curChaptButton.css("color","#2505ff");
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: comieList[i][1],
                    context: comieList[i][0],
                    onload: function (resp) {
                        var re = /picTree ='(.*?)';/g;
                        var picResult = re.exec(resp.responseText);
                        if (picResult && picResult.length > 0) {
                            var picTree = picResult[1];
                            var PicUrls = picTree;
                            if (PicUrls.indexOf("mh160tuku") == -1)
                                PicUrls = base64_decode(picTree);
                            if (PicUrls.indexOf("JLmh160") != -1) {
                                PicUrls = ithmsh(PicUrls);
                            }
                            else if (PicUrls.indexOf("TWmh160") != -1) {
                                PicUrls = itwrnm(PicUrls);
                            }
                            var PicUrlArr = PicUrls.split("$qingtiandy$");
                            console.log(PicUrlArr);

                            var baseImgUrl = getpicdamin(resp.responseText);
                            var j = 0;
                            var downloadInterval = setInterval(function () {
                                if (j < PicUrlArr.length) {
                                    var v = PicUrlArr[j];
                                    GM_xmlhttpRequest({
                                        method:'GET',
                                        url: baseImgUrl + v,
                                        headers: {
                                            "referer": resp.finalUrl
                                        },
                                        responseType:'blob',
                                        anonymous:false,
                                        onload :function(resp){
                                            console.log(resp.response);
                                            curChaptZip.file(v.split('/').pop(),resp.response)
                                        },
                                        onerror:function(e){
                                            console.log("error occur ",e);
                                        }
                                    })
                                }
                                else {
                                    curChaptButton.css("color","red");
                                    curChaptButton.text(resp.context+" ok");
                                    clearInterval(downloadInterval);
                                }
                                j += 1;
                            }, 300);
                        }
                        else {
                            GM_log(resp.responseText);
                        }
                    },
                    onerror :function(e){
                        alert("获取漫画信息失败！\n");
                        console.log(e);
                    }
                });
                i += 1;
            }
            else {
                clearInterval(openInterval);
                //console.log(zip)
                zip.generateAsync({type:"blob"})
                .then(function (blob) {
                    saveAs(blob, title+".zip");
                });
            }
            return download;
        }
        var openInterval = setInterval(function () {download()}, 20000);
    }
    $(".anchors >ul").append("<li i='2'><a href='#play_0' style='color:#fffa00' id='downloadComic'>下载漫画</a></li>");
    $("#downloadComic").click(startDownload);
    $("#asc_0").click();
})();
