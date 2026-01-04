// ==UserScript==
// @name         115转存助手ui优化版v2.2
// @name:zh      115转存助手ui优化版v2.2
// @author       Never4Ever
// @namespace    Fake115Upload@Never4Ever
// @version      1.4.3.20210422.0
// @description  115文件转存（(based on Fake115Upload 1.4.3 @T3rry)）
// @match        https://115.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @connect      proapi.115.com
// @connect      webapi.115.com
// @connect      115.com
// @require      https://cdn.bootcss.com/jsSHA/2.3.1/sha1.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require      https://cdn.jsdelivr.net/npm/underscore@1.12.0/underscore-min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@8
// @require      https://cdn.jsdelivr.net/npm/node-forge@0.10.0/dist/forge.min.js
// @downloadURL https://update.greasyfork.org/scripts/429708/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8Bui%E4%BC%98%E5%8C%96%E7%89%88v22.user.js
// @updateURL https://update.greasyfork.org/scripts/429708/115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8Bui%E4%BC%98%E5%8C%96%E7%89%88v22.meta.js
// ==/UserScript==


/*********************************************
请从以下获取最新版，或者遇到问题去此反馈，感谢
https://greasyfork.org/zh-CN/scripts/422619-115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8Bui%E4%BC%98%E5%8C%96%E7%89%88v2-2

有bug反馈会及时更新。如果遇到115接口问题，得等大佬们解决，我只是拾人牙慧，做点微小的工作

在2021.04.17 时在chrome与115pc（v24）上，转存与提取测试皆正常


### 主要功能：
* 提取的时候带目录，本脚本目录用“|”分割
* 支持带目录转存，包括支持 用“|”或者论坛里用“#”分割的，支持json格式（格式为{"dir_name":"","files":[],"dirs":[]}）
* 支持转存时选择不自动创建目录
* 支持搜索页面的提取
* 重新分析了@T3rry大佬的代码，填了以前提取超大量文件存在的坑
* 优化了操作进度提示
* 支持直接选择导入sha1链接文件（符合格式的.txt和.json）


### 注意：
* 提取时遇到不能下载的文件获取到sha1链接（本脚本用40个0替换）是暂时有效的，等文件能下载了就会失效
* 转存时未过滤空目录，或者由于转存失败会导致空目录存在
* 使用时，不要最小化浏览器和切换tab页面，即：需要保持操作页面始终可见
* 适用于chrome或者<del>v23版本的</del>（新版已经支持v24）115，以及导入的文件需要为utf-8编码
* 如果转存失败，请检查链接或者在chrome上进行尝试，115pc端偶尔抽风；或者可能与其他脚本冲突，导致显示元素不完整
* 遇到问题，反馈时请描述你使用的【浏览器】，【浏览器版本】，【什么操作】，【链接】，【错误提示】，要不然无法进行错误复现。

### 最近更新日志：
* 1.4.3.20210422.0
优化提示次数：每天1次；优化大小为0的文件提取
* 1.4.3.20210415.0
不能下载的文件提供暂时的转存链接，40个0结尾，注意：文件能下载时，该链接就会不匹配！
修复多重目录转存时可能存在结构错位的问题
* 1.4.3.20210307.1
“转存”处增加“要不要创建目录”的选择项
搜索处增加了单个文件已经单个目录的sha1提取（鼠标悬停时的tooltip上）
搜索处增加对本页所有和选中的文件的提取（排除目录，因为这样可能会重复提取文件；并且只是当前页）
* 1.4.3.20210305.0
修复115pc版v24版（v24.0.2.2）提取的支持
* 1.4.3.20210304.2
修复转存时遇到&导致的问题，包括文件名截断以及目录创建失败
修复未刷新网页的情况下可能在未选择文件的情况下，重复使用上次文件的情况
* 1.4.3.20210304.1
解决由于“异常文件，无法下载”导致提取卡住的bug
优化转存出错时的提醒
* 1.4.3.20210303.1
屏蔽esc减导致进度条弹窗退出
优化平衡速度
* 1.4.3.20210302
支持直接导入sha1链接文件（符合格式的.txt和.json）
优化提取策略，大于1200数量，慢速
* 1.4.3.20210301
修复同一目录下存在相同文件导致提取死循环的bug
* 1.4.3.20210227
计数bug修改，修改代码适配115浏览器
* 1.4.3.20210209
优化代码，增加目录
* ......
**********************************************/


(function () {
    'use strict';

    //init setting
    waitForKeyElements("div.file-opr", AddShareSHA1Btn);
    waitForKeyElements("div.dialog-bottom", AddDownloadSha1Btn);
    waitForKeyElements("div.lstc-search",AddShareButtonForSearchItem);

    var p_zhuancun = '<a href="javascript:;"  class="button btn-line btn-upload" menu="offline_task"><i class="icon-operate ifo-linktask"></i><span>链接任务</span><em style="display:none;" class="num-dot"></em></a>';
    $(".left-tvf").eq(0).append(p_zhuancun);

    window.cookie = document.cookie

    var workingNumbers = 4;

    const userAgent="Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36 115Browser/23.9.3.6";
    const thisVersion="1.4.3.20210422.0";

    //#region 20201230新的提取api相关
    var pub_key = '-----BEGIN PUBLIC KEY-----\
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDR3rWmeYnRClwLBB0Rq0dlm8Mr\
    PmWpL5I23SzCFAoNpJX6Dn74dfb6y02YH15eO6XmeBHdc7ekEFJUIi+swganTokR\
    IVRRr/z16/3oh7ya22dcAqg191y+d6YDr4IGg/Q5587UKJMj35yQVXaeFXmLlFPo\
    kFiz4uPxhrB7BGqZbQIDAQAB\
    -----END PUBLIC KEY-----'
    var private_key = '-----BEGIN RSA PRIVATE KEY-----\
    MIICXAIBAAKBgQCMgUJLwWb0kYdW6feyLvqgNHmwgeYYlocst8UckQ1+waTOKHFC\
    TVyRSb1eCKJZWaGa08mB5lEu/asruNo/HjFcKUvRF6n7nYzo5jO0li4IfGKdxso6\
    FJIUtAke8rA2PLOubH7nAjd/BV7TzZP2w0IlanZVS76n8gNDe75l8tonQQIDAQAB\
    AoGANwTasA2Awl5GT/t4WhbZX2iNClgjgRdYwWMI1aHbVfqADZZ6m0rt55qng63/\
    3NsjVByAuNQ2kB8XKxzMoZCyJNvnd78YuW3Zowqs6HgDUHk6T5CmRad0fvaVYi6t\
    viOkxtiPIuh4QrQ7NUhsLRtbH6d9s1KLCRDKhO23pGr9vtECQQDpjKYssF+kq9iy\
    A9WvXRjbY9+ca27YfarD9WVzWS2rFg8MsCbvCo9ebXcmju44QhCghQFIVXuebQ7Q\
    pydvqF0lAkEAmgLnib1XonYOxjVJM2jqy5zEGe6vzg8aSwKCYec14iiJKmEYcP4z\
    DSRms43hnQsp8M2ynjnsYCjyiegg+AZ87QJANuwwmAnSNDOFfjeQpPDLy6wtBeft\
    5VOIORUYiovKRZWmbGFwhn6BQL+VaafrNaezqUweBRi1PYiAF2l3yLZbUQJAf/nN\
    4Hz/pzYmzLlWnGugP5WCtnHKkJWoKZBqO2RfOBCq+hY4sxvn3BHVbXqGcXLnZPvo\
    YuaK7tTXxZSoYLEzeQJBAL8Mt3AkF1Gci5HOug6jT4s4Z+qDDrUXo9BlTwSWP90v\
    wlHF+mkTJpKd5Wacef0vV+xumqNorvLpIXWKwxNaoHM=\
    -----END RSA PRIVATE KEY-----'

    const priv = forge.pki.privateKeyFromPem(private_key);
    const pub = forge.pki.publicKeyFromPem(pub_key);
    const g_key_l = [0x42, 0xda, 0x13, 0xba, 0x78, 0x76, 0x8d, 0x37, 0xe8, 0xee, 0x04, 0x91]
    const g_key_s = [0x29, 0x23, 0x21, 0x5e]
    const g_kts = [0xf0, 0xe5, 0x69, 0xae, 0xbf, 0xdc, 0xbf, 0x5a, 0x1a, 0x45, 0xe8, 0xbe, 0x7d, 0xa6, 0x73, 0x88, 0xde, 0x8f, 0xe7, 0xc4, 0x45, 0xda, 0x86, 0x94, 0x9b, 0x69, 0x92, 0x0b, 0x6a, 0xb8, 0xf1, 0x7a, 0x38, 0x06, 0x3c, 0x95, 0x26, 0x6d, 0x2c, 0x56, 0x00, 0x70, 0x56, 0x9c, 0x36, 0x38, 0x62, 0x76, 0x2f, 0x9b, 0x5f, 0x0f, 0xf2, 0xfe, 0xfd, 0x2d, 0x70, 0x9c, 0x86, 0x44, 0x8f, 0x3d, 0x14, 0x27, 0x71, 0x93, 0x8a, 0xe4, 0x0e, 0xc1, 0x48, 0xae, 0xdc, 0x34, 0x7f, 0xcf, 0xfe, 0xb2, 0x7f, 0xf6, 0x55, 0x9a, 0x46, 0xc8, 0xeb, 0x37, 0x77, 0xa4, 0xe0, 0x6b, 0x72, 0x93, 0x7e, 0x51, 0xcb, 0xf1, 0x37, 0xef, 0xad, 0x2a, 0xde, 0xee, 0xf9, 0xc9, 0x39, 0x6b, 0x32, 0xa1, 0xba, 0x35, 0xb1, 0xb8, 0xbe, 0xda, 0x78, 0x73, 0xf8, 0x20, 0xd5, 0x27, 0x04, 0x5a, 0x6f, 0xfd, 0x5e, 0x72, 0x39, 0xcf, 0x3b, 0x9c, 0x2b, 0x57, 0x5c, 0xf9, 0x7c, 0x4b, 0x7b, 0xd2, 0x12, 0x66, 0xcc, 0x77, 0x09, 0xa6]
    var m115_l_rnd_key = genRandom(16)
    var m115_s_rnd_key = []
    var key_s = []
    var key_l = []
    function intToByte(i) {
        var b = i & 0xFF;
        var c = 0;
        if (b >= 256) {
            c = b % 256;
            c = -1 * (256 - c);
        } else {
            c = b;
        }
        return c
    }
    function stringToArray(s) {
        var map = Array.prototype.map
        var array = map.call(s, function (x) {
            return x.charCodeAt(0);
        })
        return array
    }
    function arrayTostring(array) {
        var result = "";
        for (var i = 0; i < array.length; ++i) {
            result += (String.fromCharCode(array[i]));
        }
        return result;
    }
    function m115_init() {
        key_s = []
        key_l = []
    }
    function m115_setkey(randkey, sk_len) {
        var length = sk_len * (sk_len - 1)
        var index = 0
        var xorkey = ''
        if (randkey) {
            for (var i = 0; i < sk_len; i++) {
                var x = intToByte((randkey[i]) + (g_kts[index]))
                xorkey += String.fromCharCode(g_kts[length] ^ x)
                length -= sk_len
                index += sk_len
            }
            if (sk_len == 4) {
                key_s = stringToArray(xorkey)
            }
            else if (sk_len == 12) {
                key_l = stringToArray(xorkey)
            }
        }
    }
    function xor115_enc(src, key) {
        var lkey = key.length
        var secret = []
        var num = 0
        var pad = (src.length) % 4
        if (pad > 0) {
            for (var i = 0; i < pad; i++) {
                secret.push((src[i]) ^ key[i])
            }
            src = src.slice(pad)
        }
        for (var j = 0; j < src.length; j++) {
            if (num >= lkey) {
                num = num % lkey
            }
            secret.push((src[j] ^ key[num]))
            num += 1
        }
        return secret

    }
    function genRandom(len) {
        var keys = []
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789';
        var maxPos = chars.length;
        for (var i = 0; i < len; i++) {
            keys.push(chars.charAt(Math.floor(Math.random() * maxPos)).charCodeAt(0));
        }
        return keys;
    }
    function m115_encode(plaintext) {
        console.log('m115_encode:')
        m115_init()
        key_l = g_key_l
        m115_setkey(m115_l_rnd_key, 4)
        var tmp = xor115_enc(stringToArray(plaintext), key_s).reverse()
        var xortext = xor115_enc(tmp, key_l)
        var text = arrayTostring(m115_l_rnd_key) + arrayTostring(xortext)
        var ciphertext = pub.encrypt(text)
        ciphertext = encodeURIComponent(forge.util.encode64(ciphertext))
        return ciphertext
    }
    function m115_decode(ciphertext) {
        console.log('m115_decode:')
        var bciphertext = forge.util.decode64(ciphertext)
        var block = bciphertext.length / (128)
        var plaintext = ''
        var index = 0
        for (var i = 1; i <= block; ++i) {
            plaintext += priv.decrypt(bciphertext.slice(index, i * 128))
            index += 128
        }
        m115_s_rnd_key = stringToArray(plaintext.slice(0, 16))
        plaintext = plaintext.slice(16);
        m115_setkey(m115_l_rnd_key, 4)
        m115_setkey(m115_s_rnd_key, 12)
        var tmp = xor115_enc(stringToArray(plaintext), key_l).reverse()
        plaintext = xor115_enc(tmp, key_s)
        return arrayTostring(plaintext)
    }

    function PostData(dict) {
        var k, tmp, v;
        tmp = [];
        for (k in dict) {
            v = dict[k];
            tmp.push(k + "=" + v);
        }
        return tmp.join('&');
    };

    function UrlData(dict) {
        var k, tmp, v;
        tmp = [];
        for (k in dict) {
            v = dict[k];
            tmp.push((encodeURIComponent(k)) + "=" + (encodeURIComponent(v)));
        }
        return tmp.join('&');
    };

    function GetSig(userid, fileid, target, userkey) {
        var sha1, tmp;
        sha1 = new jsSHA('SHA-1', 'TEXT');
        sha1.update("" + userid + fileid + fileid + target + "0");
        tmp = sha1.getHash('HEX');
        sha1 = new jsSHA('SHA-1', 'TEXT');
        sha1.update("" + userkey + tmp + "000000");
        return sha1.getHash('HEX', {
            outputUpper: true
        });
    }



    function download(filename, content, contentType) {
        if (!contentType) contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([content], { 'type': contentType });
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    function RenewCookie() {
        var arryCookie = window.cookie.split(';');
        arryCookie.forEach(function (kv) {
            document.cookie = kv + ";expires=Thu, 01 Jan 2100 00:00:00 UTC;;domain=.115.com"
        }
        )
    }

    function DeleteCookie(resp) {
        try {
            var reg = /set-cookie: .+;/g;
            var setcookie = reg.exec(resp)[0].split(';');
            var filecookie = setcookie[0].slice(11) + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + setcookie[3] + ";domain=.115.com";
            document.cookie = filecookie;
            RenewCookie()
            return filecookie;
        }
        catch (err) {
            return null;
        }
    }




    //#endregion

    function hereDoc(f) {
        return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
    }

    const MessageType = {
        BEGIN: 0,
        PROCESSING: 1,
        END: 2,
        ERROR: 3,
        CLOSE: 4,
    };

    function createMessage(messageType, msg) {
        return { messageType: messageType, msg: msg }
    }

    String.prototype.format = function () {
        if (arguments.length == 0) {
            return this;
        }
        for (var s = this, i = 0; i < arguments.length; i++) {
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        }
        return s;
    };

    var getTamplateLines = function () {
        /*
            <div style="height:180px;">
                <div class="itemContent" style="color: red;text-align: left;margin: 10px 0;">
                </div>
                <hr />
                <div style="height:140px;overflow-x: hidden;overflow-y: auto;">
                    <ul class="errorList"  style="font-size: small;text-align: left;font-style: italic; "></ul>
                </div>
            </div>
        */
    };


    //post from iframe
    function postSha1Messgae(message) {
        var postData = {
            eventID: "115sha1",
            data: message
        };

        var text = JSON.stringify(postData);
        window.parent.postMessage(text, "https://115.com/");
    }

    function updateTip()
    {
        var version= GM_getValue("version");
        var date=GM_getValue("date")
        var myDate= new Date();

        if(date!=myDate.toLocaleDateString())
        {
            Swal.fire({
                title: '版本({0})提示'.format(thisVersion),
                html: `<div style="color: red;">！！上万小文件请打压缩包分享，否则可能会被封号！！</div>`+
                `<hr>fixed：优化提示次数：每天1次；优化大小为0的文件提取`+
                `<hr>更新或反馈，点击-> <a style="color: red;" href="https://greasyfork.org/zh-CN/scripts/422619-115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8Bui%E4%BC%98%E5%8C%96%E7%89%88v2-2" target="_blank">115转存助手ui优化版v2.2</a>`,
                allowOutsideClick: false,
                allowEscapeKey : false,
            })

            GM_setValue("date",myDate.toLocaleDateString());
            //GM_setValue("version",thisVersion);
        }
    }


    //解决提取时的alert不能全屏的问题
    if (window.top === window.self) {
        $(function () {

            updateTip();

            var $itemContent = null;
            var $errorList = null;
            var getTamplate = hereDoc(getTamplateLines);

            $(window).on("message", function (e) {
                var dataInfo = JSON.parse(e.originalEvent.data);
                if (dataInfo.eventID != "115sha1" || e.originalEvent.origin != "https://115.com") return;
                var message = dataInfo.data;

                //ui:
                if (message.messageType == MessageType.BEGIN) {
                    Swal.fire({
                        title: '正在操作中，请勿切换该页面以防脚本休眠...',
                        html: getTamplate,
                        allowOutsideClick: false,
                        allowEscapeKey : false,
                        onBeforeOpen: function () {
                            Swal.showLoading();
                            var $swalContent1 = $(Swal.getContent());
                            $errorList = $swalContent1.find(".errorList");
                            $itemContent = $swalContent1.find(".itemContent");
                        }

                    })
                }
                else if (message.messageType == MessageType.PROCESSING) {
                    $itemContent.html(message.msg);
                }
                else if (message.messageType == MessageType.ERROR) {
                    $errorList.append('<li><div display: flex;"><p>' + message.msg + '</p><p style="font-style: italic;"><\p><\div><\li><li><hr/></li>');
                }
                else if (message.messageType == MessageType.END) {
                    $itemContent.html(message.msg);
                    Swal.getTitle().textContent = "操作完成！";
                    Swal.hideLoading();

                }
                else if (message.messageType == MessageType.CLOSE) {
                    Swal.close();
                }





            })
        });
    }




    function delay(ms) {

        if (ms == 0) {
            ms = 1000 * (Math.floor(Math.random() * (11 - 4)) + 4);
        }
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    //#region 115 api
    //get   UploadInfo
    //return {state:false,user_id:0,userkey:'0',error:''}
    async function getUploadInfo() {
        const r = await $.ajax({
            url: 'https://proapi.115.com/app/uploadinfo',
            dataType: 'json',
            xhrFields: { withCredentials: true }
        });
        return r;
    }

    //add a folder
    //return {state: false, error: "该目录名称已存在。", errno: 20004, errtype: "war"}
    //return {state: true, error: "", errno: "", aid: 1, cid: "2020455078010511975", …}
    async function addFolder(pid, folderName) {
        const postData = PostData({
            pid: pid,
            cname: encodeURIComponent(folderName)
        });

        const r = await $.ajax({
            type: 'POST',
            url: 'https://webapi.115.com/files/add',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            xhrFields: { withCredentials: true },
            dataType: 'json',
            data: postData
        });

        return r;
    }


    //return {data: Array(30), count: 53, data_source: "DB", sys_count: 0, offset: 0, page_size:115, …}
    //return Array type:
    //      [folder]:{cid: "", aid: "1", pid: "", n: "", m: 0, …}
    //      [file]:  {fid: "", uid: 1447812, aid: 1, cid: "", n: "",pc:"",sha:"",s:0,t:"" …}
    async function getDirectChildItemsByOffset(cid, offset) {
        var tUrl = 'https://webapi.115.com/files?aid=1&cid='+cid+'&o=file_name&asc=1&offset='+offset+'&show_dir=1&limit=1150&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json&fc_mix=&type=&star=&is_share=&suffix=&custom_order=';
       // var tUrl = "https://aps.115.com/natsort/files.php?aid=1&cid=" + cid + "&o=file_name&asc=1&offset=" + offset + "&show_dir=1&limit=1150&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json&fc_mix=0&type=&star=&is_share=&suffix=&custom_order=";
        const result = await $.ajax({
            type: 'GET',
            url: tUrl,
            dataType: "json",
            xhrFields: { withCredentials: true }
        });
        return result;
    }

    //直接子项目少于1200
    async function getDirectChildItemsByOffsetlt1200(cid, offset) {
        //var tUrl = 'https://webapi.115.com/files?aid=1&cid='+cid+'&o=file_name&asc=1&offset='+offset+'&show_dir=1&limit=1150&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json&fc_mix=&type=&star=&is_share=&suffix=&custom_order=';
        var tUrl = "https://aps.115.com/natsort/files.php?aid=1&cid=" + cid + "&o=file_name&asc=1&offset=" + offset + "&show_dir=1&limit=1150&code=&scid=&snap=0&natsort=1&record_open_time=1&source=&format=json&fc_mix=0&type=&star=&is_share=&suffix=&custom_order=";
        const result = await $.ajax({
            type: 'GET',
            url: tUrl,
            dataType: "json",
            xhrFields: { withCredentials: true }
        });
        return result;
    }

    //return AllDirect items :{id:"",parentID:cid,isFolder:false,name:"",size:0,pc:"",sha:"",paths[] };
    async function getAllDirectItems(cid, folderProcessCallback) {
        var items = new Array();
        var index = 0;
        var flag = true;
        var pageIndex = 1;
        var first=true;
        var isLT1200=false;

        while (flag) {
            folderProcessCallback(pageIndex);
            var result=null;
            //1200数量，不同的api；这么写减少发包
            if(first){
                result = await getDirectChildItemsByOffset(cid, index);
                console.log("first >1200 :{0},{1}".format(result.state,result.count));
                if(!result.state) {
                    result=await getDirectChildItemsByOffsetlt1200(cid,index);
                    console.log("first <1200 :{0},{1}".format(result.state,result.count));
                    isLT1200=true;
                }
                first=false;
            }
            else{
                if(isLT1200) result=await getDirectChildItemsByOffsetlt1200(cid,index);
                else result = await getDirectChildItemsByOffset(cid, index);
            }

            var totalCount=parseInt(result.count);
            if (totalCount >= 1) {
                result.data.forEach(function (item) {
                    var pItem = {
                        id: "",
                        parentID: cid,
                        isFolder: false,
                        name: "",
                        size: "",
                        pickCode: "",
                        sha1: "",
                        paths: new Array(),
                        preid: "",
                        needToRemoved:false
                    };

                    if (item.fid)//文件 fid,cid
                    {
                        pItem.isFolder = false;
                        pItem.id = item.fid;
                        pItem.name = item.n;
                        pItem.pickCode = item.pc;
                        pItem.sha1 = item.sha;
                        pItem.size = item.s;
                    }
                    else //目录 cid,pid
                    {
                        pItem.isFolder = true;
                        pItem.id = item.cid;
                        pItem.name = item.n;
                        pItem.pickCode = item.pc;
                    }


                    var itemIndex=items.findIndex(q=>q.name==pItem.name&&q.pickCode==pItem.pickCode&&q.sha1==pItem.sha1&&(_.isEqual(q.paths,pItem.paths)));
                    if(itemIndex==-1) items.push(pItem);
                    else{
                        //可能存在同一个目录下，两个文件一模一样,
                        //相同文件处理：不然循环条件退不出
                        //fix:pickcode不一样,先保存着吧
                        pItem.needToRemoved=true;
                        items.push(pItem)
                    }
                })
            }

            console.log("_______________totalCount "+totalCount);
            console.log(items.length)
            //当获取到比pagesize小时，获取结束,1200时有个坑。。。
            if (totalCount <= items.length) {
                break;
            }
            else {
                await delay(500);
                index = items.length;
                pageIndex = pageIndex + 1;
            }
        }

        console.log("cid: {0}, count: {1}".format(cid, items.length));

        var noNullItems=items.filter(q=>!q.needToRemoved);
        console.log("cid: {0}, 除去完全重复count: {1}".format(cid, noNullItems.length));

        return noNullItems;
    }

    //return {file_name:"",pick_code:"",sha1:"",count:"",size:"",folder_count:"",paths:[]}
    //return paths:[]层级目录
    async function getFolderInfo(cid) {
        var pUrl = "https://webapi.115.com/category/get?aid=1&cid=" + cid;
        const result = await $.ajax({
            type: 'GET',
            url: pUrl,
            dataType: "json",
            xhrFields: { withCredentials: true }
        });
        console.log(result);
        var pItem = {
            fileCount: parseInt(result.count),
            folderCount: parseInt(result.folder_count),
            id: cid,
            parentID: "",
            isFolder: true,
            name: result.file_name,
            size: result.size,
            pickCode: result.pick_code,
            sha1: "",
            paths: result.paths,
            preid: ""
        };

        return pItem;
    }

    // get fileArray:{id:"",parentID:cid,isFolder:false,name:"",size:0,pc:"",sha:"",paths[] };
    async function getAllFiles(cid, fileArray, topCid, folderProcessCallback) {
        var thisFolder = await getFolderInfo(cid);
        folderProcessCallback(thisFolder.name,0);
        //空目录，跳过遍历
        if (thisFolder.fileCount == 0) return;
        folderProcessCallback(thisFolder.name)
        var directItems = await getAllDirectItems(thisFolder.id, pageIndex => {
            folderProcessCallback(thisFolder.name,pageIndex);
        });
        //空目录，跳过遍历
        if (directItems.length == 0) return;
        var files = directItems.filter(t => !t.isFolder);
        files.forEach(f => {
            var index = thisFolder.paths.findIndex(q => q.file_id.toString() == topCid);
            var paths = new Array();
            if (index != -1) {
                paths = thisFolder.paths.slice(index).map(q => q.file_name);
            }
            paths.push(thisFolder.name);
            f.paths = paths.slice(1);
            fileArray.push(f);
        });

        var folders = directItems.filter(t => t.isFolder);
        for (var folder of folders) {
             await getAllFiles(folder.id, fileArray, topCid, folderProcessCallback);
             await delay(200);
        }

    }

    //获取生成sha1需要preid
    //return: {state:,error:,fileItem:}
    function getFileItemPreid(fileItem) {
        //console.log(fileItem);
        const f = fileItem;
        if(f.size==0||f.size=="0"){
            return new Promise((resolve,reject)=>
            {
                const errorMsg="{0} 文件大小为0，已经跳过！".format(f.filename);
                console.error("errorMsg");
                resolve({ state: false, error: "文件大小为0，已经跳过！", fileItem: fileItem });
            });
        }

        const r = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://proapi.115.com/app/chrome/downurl',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36 115Browser/23.9.3.6' },
                responseType: 'json',
                data: PostData({ data: m115_encode('{"pickcode":"' + fileItem.pickCode + '"}') }),
                onload: function (r) {
                    if (r.status == 200) {
                        var download_info = r.response;

                        //console.log(download_info);
                        if(download_info.state&&download_info.data){
                            try {
                                var json = m115_decode(download_info.data);

                            var url = JSON.parse(json)[fileItem.id]['url']['url'];
                            var resp = r.responseHeaders
                            var setCookie = DeleteCookie(resp)
                            var fileCookie = null;
                            if (setCookie) {
                                fileCookie = setCookie;
                            }

                            GM_xmlhttpRequest({
                                method: "GET",
                                url: url,
                                headers: {
                                    "Range": "bytes=0-154112",
                                    "Cookie": fileCookie,
                                    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36 115Browser/23.9.3.6'
                                },
                                responseType: 'arraybuffer',
                                onload: function (response) {
                                    if (response.status === 206) {
                                        var pre_buff = response.response;
                                        var data = new Uint8Array(pre_buff);
                                        var sha1 = new jsSHA('SHA-1', 'ARRAYBUFFER');
                                        sha1.update(data.slice(0, 128 * 1024));
                                        var preid = sha1.getHash('HEX', {
                                            outputUpper: true
                                        });
                                        fileItem.preid = preid;
                                        resolve({ state: true, error: "", fileItem: fileItem });
                                    }
                                    else if (response.status === 403){
                                        console.error("Forbidden, 已经用40个0代替");
                                        fileItem.preid = "0000000000000000000000000000000000000000";
                                        resolve({ state: true, error: "", fileItem: fileItem });
                                    }
                                }
                            });
                            } catch (error) {
                                console.error(error);
                                resolve({ state: false, error: "在提取中发生错误...", fileItem: fileItem });
                            }
                        }
                        else{
                            console.log(download_info);
                            resolve({ state: false, error: download_info.msg, fileItem: fileItem });
                        }

                    }
                    else {
                        console.error(response.response);
                        resolve({ state: false, error: "在提取中发生错误...", fileItem: fileItem });
                    }
                }
            });
        });
        return r;
    }

    //格式化sha1 链接
    //return type: {state:succeed,msg:""}
    // false:msg->出错信息
    //true: msg->sha1链接 ，带目录
    function convertToSha1Link(fileItem) {
        var succeed = false;
        var msg = "格式生成失败!";
        if (fileItem.name && fileItem.size && fileItem.sha1 && fileItem.preid) {
            var sha1Link = "115://" + fileItem.name + "|" + fileItem.size + "|" + fileItem.sha1 + "|" + fileItem.preid;

            if (fileItem.paths.length > 0) {
                console.log(fileItem.paths);

                var paths = fileItem.paths.join('|');
                msg = sha1Link + '|' + paths;
            }
            else {
                msg = sha1Link
            }

            succeed = true;
        }

        return { state: succeed, msg: msg };
    }

    // 从sha1link 转换为 FileItem
    //return type:{state:succeed,fileItem:{}}
    //true: fileItem, false:null
    function convertFromSha1Link(sha1Link) {
        var succeed = false;
        var item = {};
        if (sha1Link) {
            if (sha1Link.startsWith("115://")) {
                sha1Link = sha1Link.substring(6);
            }

            var infos = sha1Link.split('|');
            if (infos.length >= 4) {
                item.name = infos[0];
                item.size = infos[1];
                item.sha1 = infos[2];
                item.preid = infos[3];
                item.parentID = "";
                item.paths = new Array();
                if (infos.length > 4) {
                    if (infos.length == 5 && infos[4].includes('#')) {
                        //兼容 #字符分割
                        item.paths = infos[4].split('#');
                    }
                    else {
                        item.paths = infos.slice(4);
                    }
                }
                succeed = true;
            }
        }

        return { state: succeed, fileItem: item };
    }


    function createUploadFile(urlData, postData) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://uplb.115.com/3.0/initupload.php?' + urlData,
                data: postData,
                responseType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                onload: function (response) {
                    var data = { state: false, error: "" };
                    if (response.status === 200 && response.response.status === 2) {
                        data.state = true;
                    }
                    else {
                        var error=response.response.statusmsg?" "+response.response.statusmsg:" 或许sha1链接不匹配?";
                        data.error = error;
                        console.error(error);
                    }
                    resolve(data);
                }
            })

        });
    }

    //return:{state:false,error:"",fileItem:};
    function uploadFile(targetFolder, fileItem, uploadInfo) {

        var fCid = 'U_1_{0}'.format(targetFolder);
        var appVersion = "25.2.0";

        var urlData = UrlData({
            isp: 0,
            appid: 0,
            appversion: appVersion,
            format: 'json',
            sig: GetSig(uploadInfo.user_id, fileItem.sha1, fCid, uploadInfo.userkey)
        });


        var postData = PostData({
            preid: fileItem.preid,
            fileid: fileItem.sha1,
            quickid: fileItem.sha1,
            app_ver: appVersion,
            filename: encodeURIComponent(fileItem.name),
            filesize: fileItem.size,
            exif: '',
            target: fCid,
            userid: uploadInfo.user_id

        });

        const r = createUploadFile(urlData, postData);

        const x = r.then(t => {
            return new Promise((resole, reject) => {
                fileItem.state = t.state;
                resole({ state: t.state, error: t.error, fileItem: fileItem });
            })
        });

        return x;
    }

    function setListView() {
        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://115.com/?ct=user_setting&ac=set',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: PostData({
                setting: '{"view_file":"list"}'
            }),
            responseType: 'json',
            onload: function (response) {
                if (response.status === 200) {
                }
            }
        });
    }

    //#endregion



    async function updateParentID(cid, cname, thisLevel, maxLevel, items, createFolderCallback) {
        if (thisLevel == maxLevel) return;
        var files = new Array();
        if (thisLevel == 0) {
            files = items;
        }
        else {
            files = items.filter(f => f.paths[thisLevel - 1] == cname);
        }

        var childFiles = files.filter(q => q.paths.length == thisLevel);
        var childFolderNames = files.map(q => q.paths[thisLevel]).filter(q => q).filter((x, i, a) => a.indexOf(x) == i)

        //upload file:
        for (var file of childFiles) {
            file.parentID = cid;
        }

        //create folder:
        for (var folderName of childFolderNames) {
            var r = await addFolder(cid, folderName);
            console.log(r);
            var t = { state: r.state, folderName: folderName ,error:r.error};
            createFolderCallback(t);
            if (r.state) {
                await updateParentID(r.cid, folderName, thisLevel + 1, maxLevel, files, createFolderCallback);
            }
            else {//ui 目录创建失败  todo:
                console.error("目录 {0} 创建失败".format(folderName));
            }
            await delay(200);
        }

    }

    function internelFormat(folder, files, folderParents) {
        var paths = folderParents.slice(0);
        paths.push(folder.dir_name);

        for (var file of folder.files) {

            var link = file + '|' + paths.slice(1).join('|');
            files.push(link);
        }

        for (var childFolder of folder.dirs) {

            internelFormat(childFolder, files, paths)
        }
    }

    //{state:true,error:"",text:""}
    function formatJsonToCommon(text) {

        try {
            var root = JSON.parse(text);
            console.log(root);
            var files = new Array();
            var paths = new Array();
            internelFormat(root, files, paths);
            return { state: true, error: "", text: files.join('\r\n') };
        }
        catch (error) {
            return { state: false, error: error, text: "" };
        }

    }


    async function ByCommonFotmat(folderCid, text,needToCreateParentFolder) {

        //js 奇怪的\r\n分割...
        var lines = text.split(/\r?\n/);

        var files = new Array();
        var msg = "";
        postSha1Messgae(createMessage(MessageType.PROCESSING, "正在解析链接..."));
        for (var line of lines) {
            var fLine = line.trim();
            if (!line) continue;

            var r = convertFromSha1Link(line.trim())
            if (r.state) {
                files.push(r.fileItem);
            }
            else {
                postSha1Messgae(createMessage(MessageType.ERROR, "{0} 格式错误?".format(fLine)));
            }
        }

        msg="获取到链接个数：{0}".format(files.length);
        postSha1Messgae(createMessage(MessageType.PROCESSING, msg));
        await delay(200);

        var root = { name: "", items: new Array() };
        //最大的层次
        var maxLevel = Math.max.apply(Math, files.map(e => e.length));
        var level = 0;
        var uploadInfo = await getUploadInfo();
        //cid获取

        if(needToCreateParentFolder){
            await updateParentID(folderCid, "", level, maxLevel, files, t => {
                var st = t.state ? "成功." : "失败！！！ "+t.error;
                msg = "创建目录 <b>{0}</b> {1}".format(t.folderName, st);
                postSha1Messgae(createMessage(MessageType.PROCESSING, msg));
                if(!t.state) postSha1Messgae(createMessage(MessageType.ERROR, msg));
            });
        }

        var index = 1;
        var completed = 1;
        var promisArray = new Array();
        postSha1Messgae(createMessage(MessageType.PROCESSING, "开始转存..."));
        for (var file of files) {
            var cid = file.parentID ? file.parentID : folderCid;
            var r = uploadFile(cid, file, uploadInfo);
            r.then(t => {
                if (t.state) {
                    msg = '<div align="right"><b>{0}</b> | <b>{1}</b></div><hr>【 <b>{2}</b> 】上传成功.'.format(completed, files.length, t.fileItem.name);
                }
                else {
                    var ferror="【 <b>{0}</b> 】上传失败!!! {1}".format(t.fileItem.name, t.error);
                    postSha1Messgae(createMessage(MessageType.ERROR, ferror));
                    msg = '<div align="right"><b>{0}</b> | <b>{1}</b></div><hr>{2}'.format(completed, files.length,ferror);
                }
                postSha1Messgae(createMessage(MessageType.PROCESSING, msg));
                completed = completed + 1;
            });

            promisArray.push(r);
            // if (index % workingNumbers == 0) {
            //     await Promise.all(promisArray);
            //     await delay(500);
            //     promisArray = new Array();
            // }
            // else { await delay(100); }
            if (index % workingNumbers == 0){
                await delay(500);
            }

            index = index + 1;

        }

        await delay(500);
        await Promise.all(promisArray);

        var fails = files.filter(q => !q.state);
        var failText = fails.map(function (p) {
            var r = convertToSha1Link(p);
            return r.msg;
        }).join("\r\n");

        if (failText) GM_setClipboard(failText);


        msg = '完成上传！成功 <b>{0}</b> ，失败 <b>{1}</b> ，如果有失败，已将失败sha1链接复制到剪贴板！如果转存失败，请检查sha1链接格式或者在 chrome 上尝试转存。获取最新版，或者遇到问题去此反馈，感谢 !点击-> <a href="https://greasyfork.org/zh-CN/scripts/422619-115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8Bui%E4%BC%98%E5%8C%96%E7%89%88v2-2" target="_blank">115转存助手ui优化版v2.2</a>'.format(files.length - fails.length, fails.length);
        postSha1Messgae(createMessage(MessageType.END, msg));
    }

    async function NewDownloadFileFromSha1Links(folderCid, text,needToCreateParentFolder) {
        if (!text) return;

        postSha1Messgae(createMessage(MessageType.BEGIN, "正在解析sha1链接..."));
        //json格式
        if (text.startsWith('{') && text.endsWith('}')) {
            console.log("JSON");
            postSha1Messgae(createMessage(MessageType.PROCESSING, "正在转换json格式..."));
            var r = formatJsonToCommon(text);
            if (r.state) {
                await ByCommonFotmat(folderCid, r.text,needToCreateParentFolder);
            }
            else {
                postSha1Messgae(createMessage(MessageType.END, "Json 格式解析出错！"));
            }
        }
        else {
            //普通格式
            console.log("COMMON");
            await ByCommonFotmat(folderCid, text,needToCreateParentFolder);
        }



    }





    function GetFileItemByliNode(liNode) {

        var pItem = {
            id: "",
            parentID: "",
            isFolder: false,
            name: "",
            size: 0,
            pickCode: "",
            sha1: "",
            paths: [],
            preid: "",
            selected:false

        };

        var type = liNode.getAttribute("file_type");
        pItem.name = liNode.getAttribute('title');
        pItem.parentID = liNode.getAttribute('p_id');

        var isSelected=liNode.getAttribute('class');
        if(isSelected=="selected")  pItem.selected=true;

        if (type == "0") {
            pItem.id = liNode.getAttribute('cate_id');
            pItem.isFolder = true;
        }
        else {
            pItem.size = liNode.getAttribute('file_size');
            pItem.sha1 = liNode.getAttribute('sha1');
            pItem.pickCode = liNode.getAttribute('pick_code');
            pItem.id = liNode.getAttribute('file_id');
        }

        return pItem;
    }

    async function InnerCreateSha1Links(files,txtName){
        var msg="";
        var index = 1;
        var completedIndex = 1;
        var promisArray = new Array();

        var gt1200files=files.length>=1200;
        console.log(">=1200: {0}".format(gt1200files));

        for (var file of files) {
            const f = file;
            const r = getFileItemPreid(f);
            r.then((t) => {
                if (t.state) {
                    msg = '<div align="right"><b>{0}</b> | <b>{1}</b></div><hr>获取【 <b>{2}</b> 】的sha1链接成功'.format(completedIndex, files.length, t.fileItem.name);
                    postSha1Messgae(createMessage(MessageType.PROCESSING, msg))
                }
                else {
                    msg = '<div align="right"><b>{0}</b> | <b>{1}</b></div><hr>获取【 <b>{2}</b> 】的sha1链接失败！{3}'.format(completedIndex, files.length, t.fileItem.name,t.error);
                    postSha1Messgae(createMessage(MessageType.PROCESSING, msg))
                    var filePath = t.fileItem.paths.join(" > ");
                    console.log(filePath);
                    if(filePath) msg="{0},原因：{1},路径：{2}".format(t.fileItem.name, t.error,filePath);
                    else msg="{0},原因：{1}".format(t.fileItem.name, t.error);

                    postSha1Messgae(createMessage(MessageType.ERROR,msg));
                }
                completedIndex = completedIndex + 1;
            });

            promisArray.push(r);

            //自己改代码吧，怎么弄提取逻辑。。太慢，耗时长；太快，115容易没反应
            if(gt1200files){
                 if (index % workingNumbers == 0) {
                await Promise.all(promisArray);
                await delay(1000);
                promisArray = new Array();
            }}
            else{
                if (index % workingNumbers == 0){
                    await delay(1500);
            }}

            //
            index = index + 1;
        }

        await Promise.all(promisArray);

        var succeedArray = files.filter(q => q.preid);
        if (succeedArray.length == 1) {
            var result = convertToSha1Link(succeedArray[0]);
            postSha1Messgae(createMessage(MessageType.CLOSE, ""));

            setTimeout(s => {
                prompt("复制分享链接到剪贴板", s);
            }, 100, result.msg);

        }
        else {
            var text = succeedArray.map(function (p) {
                var r = convertToSha1Link(p);
                return r.msg;
            }).join("\r\n");

            if (succeedArray.length > 1) {
                var file_name = txtName + "_sha1.txt";
                download(file_name, text);
            }

            msg = '完成【 <b>{0}</b> 】提取！成功 <b>{1}</b> ，失败 <b>{2}</b> .获取最新版，或者遇到问题去此反馈，感谢 !点击-> <a href="https://greasyfork.org/zh-CN/scripts/422619-115%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8Bui%E4%BC%98%E5%8C%96%E7%89%88v2-2" target="_blank">115转存助手ui优化版v2.2</a>'.format(txtName, succeedArray.length, files.length - succeedArray.length);
            console.log(msg);
            postSha1Messgae(createMessage(MessageType.END, msg));
        }
    }

    async function CreateSha1Links(item) {
        //ui: 获取文件中...
        var msg = "正在获取文件...";
        postSha1Messgae(createMessage(MessageType.BEGIN, msg));
        var files = new Array();

        if (!item.isFolder) {
            files.push(item);
        }
        else {
            msg = "正在获取 {0} 下的内容...".format(item.name);
            postSha1Messgae(createMessage(MessageType.PROCESSING, msg));

            await getAllFiles(item.id, files, item.id, (fname,pIndex) => {
                if(pIndex>1){
                    msg = "正在获取 【{0}】 下第 {1} 页的内容...".format(fname,pIndex);
                }
                else{
                    msg = "正在获取 【{0}】 下的内容...".format(fname);
                }
                postSha1Messgae(createMessage(MessageType.PROCESSING, msg));
            });

            if (!files || files.length == 0) {
                postSha1Messgae(createMessage(MessageType.END, "【<b>{0}</b> 】空目录???".format(item.name)));
                return;
            }
        }

        postSha1Messgae(createMessage(MessageType.PROCESSING, "获取到 【<b>{0}</b>】 的内容 {1} 项".format(item.name, files.length)));
        await delay(200);
        InnerCreateSha1Links(files,item.name);

    }


    function AddDownloadSha1Btn(jNode) {
        var file="";

        if (document.getElementById('downsha1file') == null) {
            var div= document.getElementsByClassName('dialog-input input-offline');

            console.log(div);
            var $fileInput = $('<div style="margin-top: 10px;"><a>或者导入sha1链接文件（txt/json）</a><input class="btn-stroke" type="file" id="downsha1file" accept=".txt,.json"></input></div>');
            var $needPath=$('<div style="margin-top: 10px;"><a>sha1转存时不要给我创建目录：</a><div class="option-switch" style="top:10px"><input type="checkbox" id="downsha1needpath"><label for=""><i>开启</i><s>关闭</s><b>切换</b></label></div>');
            div[0].style.display='grid';
            div[0].appendChild($fileInput[0]);
            div[0].appendChild($needPath[0]);
            $fileInput[0].addEventListener('change', e => {
                console.log(e.target.files);
                if(e.target.files){
                     file=e.target.files[0];}
                else{
                    file="";}
            });
        }
        else
        {
            document.getElementById('downsha1file').value="";
            file="";
            document.getElementById('downsha1needpath').checked=false;

        }


        if (document.getElementById('downsha1') == null) {

            var $btn = $('<div class="con" id="downsha1"><a class="button" href="javascript:;">sha1链接转存</a></div>');
            jNode[0].appendChild($btn[0]);
            $btn[0].addEventListener('click', e => {

                var cid = $("em[rel=offlint_path_text]").attr("cid");
                if (cid == "") {
                    //目录不存在，比如把 “云下载” 目录删除
                    cid = '0';
                }
                var links = document.getElementById('js_offline_new_add').value;

                var needToCreateParentFolder=!document.getElementById('downsha1needpath').checked;
                console.log("needToCreateParentFolder:{0}".format(needToCreateParentFolder));
                if(file){
                    console.log(file);
                    var reader = new FileReader();
                    reader.addEventListener('load', function (t) {
                        file="";
                        //console.log(t.target.result)
                        NewDownloadFileFromSha1Links(cid, t.target.result,needToCreateParentFolder);
                      });
                      reader.readAsText(file);
                }
                else
                {
                    NewDownloadFileFromSha1Links(cid, links,needToCreateParentFolder);
                }

                (document.getElementsByClassName('close')[2].click());
            });
        }

    }


    function AddShareSHA1Btn(jNode) {
        var parentNode = jNode[0].parentNode;
        var pItem = GetFileItemByliNode(parentNode);
        var $btn = $('<a><i></i><span>SHA1</span></a>');
        $btn.appendTo(jNode[0]);
        $btn[0].addEventListener('click', e => {
            console.log(pItem);
            //生成sha1
            CreateSha1Links(pItem);
        })


    }

    async function GetSearchList(isOnlySelected){
        var msg = "正在获取文件...";
        postSha1Messgae(createMessage(MessageType.BEGIN, msg));

        var doc=document.getElementsByClassName('search-iframe')[0];
        if(!doc) doc=document;
        var lis=doc.querySelectorAll('.list-cell.lstc-search > .list-contents > ul > li');
        if(!lis) return;
        console.log(lis);
        var files=new Array();
        for(var li of lis){
           var fileItem= GetFileItemByliNode(li);
           files.push(fileItem);
        }
        console.log("0: search items{0}".format(files.length));
        if(isOnlySelected) {
            console.log("search items onlySelected")
            files=files.filter(q=>q.selected);
        }

        console.log("1: search items{0}".format(files.length));

        console.log(document.URL);
        var url = new URL(document.URL);
        var key = url.searchParams.get("search_value");
        key=key?key:"搜索结果";
        files=files.filter(q=>!q.isFolder);
        msg = "获取到符合搜索的文件数：{0}".format(files.length);
        postSha1Messgae(createMessage(MessageType.PROCESSING, msg));
        await delay(200);
        await InnerCreateSha1Links(files,key)

    }




    function AddShareButtonForSearchItem(node){

        //每一项
        var lis= node[0].getElementsByTagName('li');
        for (var li of lis){
            var pItem = GetFileItemByliNode(li);
            var $btn = $('<div class="file-opr" style="left:200px"></div>');
            $btn.appendTo(li);
        }

        //针对当前页面
        $(".left-tvf > a.btn-upload").css("top","10px");
        if(document.getElementById('btn_selected_sha1')==null){
            var $btn_selected = $(`<a href="javascript:;" id="btn_selected_sha1" class="button btn-line" style="top:10px">
            <i class="icon-operate ifo-share"></i>
            <span>提取本页选中文件（不包括文件夹）</span>
            <em style="display:none;" class="num-dot"></em>
            </a>`);
            $(".left-tvf").eq(0).append($btn_selected);

            $btn_selected[0].addEventListener('click',e=>{
                GetSearchList(true);
            });
        }

        if(document.getElementById('btn_all_sha1')==null){
            var $btn_all = $(`<a href="javascript:;" id="btn_all_sha1" class="button btn-line" style="top:10px">
            <i class="icon-operate ifo-share"></i>
            <span>提取本页所有文件（不包括文件夹）</span>
            <em style="display:none;" class="num-dot"></em>
            </a>`);
            $(".left-tvf").eq(0).append($btn_all);

            $btn_all[0].addEventListener('click',e=>{
                GetSearchList(false);
            });
        }


    }



})();
