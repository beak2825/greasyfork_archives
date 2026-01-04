// ==UserScript==
// @name         获取网盘链接
// @namespace    http://tampermonkey.net/
// @version      0.93
// @description  讯牛、rose、77file
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @match        *://*.xunniufile.com/*
// @match        *://*.rosefile.net/*
// @match        *://*.77file.com/*
// @match        *://*.xywp1.com/*
// @match        *://*.xunniu-pan.com/*
// @connect      127.0.0.1
// @connect      192.168.1.38
// @connect      localhost
// @connect      http://www.xingyaopan.com/*
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/469542/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/469542/%E8%8E%B7%E5%8F%96%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let _global = {
        _referer:'',
        _durl: null,
        _filename: '',
        _aria_url: 'http://192.168.1.38:6800/jsonrpc', //这里是Aria推送地址，本地默认不需要更改
        _aria_token: 'doub.io', //这里是Aria推送token，默认不需要设置
        _idm_url: 'http://127.0.0.1:7178/select', //这是IDM推送地址，禁止更改
    }
    var xunniu_domain = 'xunniu-pan'

    function subStringMulti(text, begin, end) {
        var regex;
        //console.log('run')
        if (end == '\\n'){regex = new RegExp(begin + '(.+)', "g");}
        else
        {regex = new RegExp(begin + '([\\s\\S]+?)' + end, "g");}

        try {
            var result;
            var blocks = [];
            while ((result = regex.exec(text)) != null) {
                blocks.push(result[1].trim());
            }
            return blocks;
            // return text.match(regex);
        } catch (err) {
            return null;
        }
    };


    function get_xunniulink(){
        //----------------------------------------------

        let header = {
            "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36",
            "referer":document.location.href
        }
        let post_header = {
            "referer":document.location.href,
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "www.xunniufile.com",
            "Origin": "http://www.xunniufile.com",
            "Proxy-Connection": "keep-alive",
            "X-Requested-With": "XMLHttpRequest",
            "cookie":"PHPSESSID=7bsmmtlj2mss19t1tqdnigaio4"

        }

        let url = document.location.href
        let filename
        let fmdown
        let filesize
        let file_id
        let durl
        //-----------------
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            data: '',
            headers: header,
            onload: function (res) {
                let this_response = res.response
                //console.log(this_response)

                filename = subStringMulti(this_response,"<h1>","</h1>").toString()
                filesize = subStringMulti(this_response,'文件大小：">','，').toString()
                file_id = subStringMulti(this_response,"action=dolike&file_id=","'")
                if(file_id == ''){
                    alert('解析失败1')
                    return
                }
                //console.log(file_id)
                console.log('成功1')
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'http://www.'+xunniu_domain+'.com/ajax.php',
                    data: 'action=load_down_addr1&file_id='+file_id,
                    headers: post_header,
                    onload: function (res) {
                        //console.log(res)
                        durl = subStringMulti(res.response,'</span></a><a href=\"h','\"').toString()
                        durl = 'h'+durl
                        if(durl == ''){
                            alert('解析失败2')
                            return
                        }
                        console.log(durl)
                        _global._durl = durl
                        _global._filename = filename
                        _global.referer = document.location.href
                        btn_get_durl.innerHTML = '成功';
                        return
                    }
                });
            }
        });
    }
    function get_roselink(){
        //----------------------------------------------

        let header = {
            "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "referer":document.location.href
        }

        let url = document.location.href
        let filename
        let fmdown
        let filesize
        let file_id
        let durl
        //-----------------
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            data: '',
            headers: header,
            onload: function (res) {
                let this_response = res.response
                //console.log(this_response)

                filename = subStringMulti(this_response,"            <h3>","</h3>").toString()
                filesize = subStringMulti(this_response,'            <span class="h4">','</span>').toString()
                file_id = subStringMulti(this_response,"// is open ref count\nadd_ref(",");").toString().replace("(","").replace(")","")
                if(file_id == ''){
                    alert('解析失败1')
                    return
                }
                //console.log(file_id)
                console.log('成功1')
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'https://rosefile.net/ajax.php',
                    data: 'action=load_down_addr1&file_id='+file_id,
                    headers: header,
                    onload: function (res) {
                        console.log(res.response)
                        durl = subStringMulti(res.response,'<a href=\"','\"').toString()
                        if(durl == ''){
                            alert('解析失败2')
                            return
                        }
                        console.log(durl)
                        _global._durl = durl
                        _global._filename = filename
                        _global.referer = document.location.href
                        btn_get_durl.innerHTML = '成功';
                        return
                    }
                });
            }
        });
    }
    function get_77filelink(){
        //----------------------------------------------

        let header = {
            "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "referer":document.location.href
        }

        let url = document.location.href
        let filename
        let fmdown
        let filesize
        let file_id
        let durl
        //-----------------
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            data: '',
            headers: header,
            onload: function (res) {
                let this_response = res.response
                //console.log(this_response)

                filename = subStringMulti(this_response,"border='0' />","</h4>").toString()
                filesize = subStringMulti(this_response,'id="file_size">','</span>').toString()
                file_id = subStringMulti(this_response,"dolike&file_id=","'").toString()
                if(file_id == ''){
                    alert('解析失败1')
                    return
                }
                //console.log(file_id)
                console.log('成功1')
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'https://www.77file.com/ajax.php',
                    data: 'action=load_down_addr1&file_id='+file_id,
                    headers: header,
                    onload: function (res) {
                        console.log(res.response)
                        durl = subStringMulti(res.response,'<a href=\"','\"').toString()
                        if(durl == ''){
                            alert('解析失败2')
                            return
                        }
                        console.log(durl)
                        _global._durl = durl
                        _global._filename = filename
                        _global.referer = document.location.href
                        btn_get_durl.innerHTML = '成功';
                        return
                    }
                });
            }
        });
    }
    function get_xingyaolink(){
        //----------------------------------------------

        let header = {
            "user-agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "referer":document.location.href
        }

        let url = document.location.href
        let filename
        let fmdown
        let filesize
        let file_id
        let durl
        //-----------------
        GM_xmlhttpRequest({
            method: "get",
            url: url,
            data: '',
            headers: header,
            onload: function (res) {
                let this_response = res.response
                //console.log(this_response)

                filename = subStringMulti(this_response,"                                    文件下载 : ","</h3>").toString()
                filesize = subStringMulti(this_response,"不支持获取该盘地址,不影响正常下载").toString()
                file_id = subStringMulti(this_response,"\nadd_ref(","\);\n").toString().replace("(","").replace(")","")
                if(file_id == ''){
                    alert('解析失败1')
                    return
                }
                //console.log(file_id)
                console.log('成功1')
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'http://www.xywp1.com/ajax.php',
                    data: 'action=load_down_addr5&file_id='+file_id,
                    headers: header,
                    onload: function (res) {
                        console.log(res.response)
                        durl = subStringMulti(res.response,'<a href=\"','\"')[1].toString()
                        if(durl == ''){
                            alert('解析失败2')
                            return
                        }
                        console.log(durl)
                        _global._durl = durl
                        _global._filename = filename
                        _global.referer = document.location.href
                        btn_get_durl.innerHTML = '成功';
                        return
                    }
                });
            }
        });
    }
    function downloadFile(url, filename) {
        getBlob(url, function(blob) {
            saveAs(blob, filename);
        });
    };
    function getBlob(url,cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (xhr.status === 200) {
                cb(xhr.response);
                //DownTipModel()
            }
        };
        xhr.send();
    }

    /**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
    function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement('a');
            var body = document.querySelector('body');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            // fix Firefox
            link.style.display = 'none';
            body.appendChild(link);

            link.click();
            body.removeChild(link);

            window.URL.revokeObjectURL(link.href);
        };
    }
    function chrome_down(val) {
        if (!val) {
            alert('请先获取下载地址！');
            return;
        } else {
            let fileName = document.querySelector(".fileName")
            if(fileName && fileName.outerText && fileName.outerText.match(/\.rar|\.zip|\.txt|\.7z|\.psd|\.jpg/i)){
                downloadFile(val,fileName.outerText)
            }else{
                window.open(val);
            }
        }
    }
    function idm_down(val1, val2, val3) {
        if (!val1) {
            alert('请先获取下载地址！');
            btn_get_idm_down.innerHTML = 'IDM下载';
            return;
        }
        GM_xmlhttpRequest({
            method: "post",
            url: _global._idm_url,
            data: JSON.stringify({ url: val1, ref: val3, name: val2 }),
            onload: function (res) {
                if (res.response == '1') {
                    alert('发送IDM任务成功~');
                } else if (res.response == '0') {
                    alert('发送IDM任务失败，请重试！')
                } else {
                    alert('未知错误');
                }
                btn_get_idm_down.innerHTML = 'IDM下载';
            },
            onerror: function (err) {
                alert('请检查是否启动IDMSERVER，若未启动，请先启动。');
                btn_get_idm_down.innerHTML = 'IDM下载';

            }
        });

    }
    function aria_down(val1, val2, val3) {//url,filename,referer
        var acookie = document.cookie.split("; ");
        function getck(sname) {//获取单个cookies
            for (var i = 0; i < acookie.length; i++) {
                var arr = acookie[i].split("=");
                if (sname == arr[0]) {
                    if (arr.length > 1){return unescape(arr[1]);}

                    else{return "";}
                }
            }
            return "";
        }
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        var ftoken = "token:"+_global._aria_token;//========================
        var fheader = "Cookie:PHPSESSID="+getck("PHPSESSID");//document.Cookie;//=========================
        if (!val1) {
            alert('请先获取下载地址！');
            btn_get_aria_down.innerHTML = 'Aria下载';
            return;
            //Referer: http://www.xunniupan.com/down-2797735.html
            //Cookie: PHPSESSID=fkt05hn9ggql7i7ntp520phaq4; path=/,view_stat=1; expires=Sun, 02-Oct-2022 18:11:14 GMT; path=/
        }
        GM_xmlhttpRequest({
            method: "post",
            url: _global._aria_url,
            data: JSON.stringify({ "jsonrpc": "2.0", "method": "aria2.addUri", "id": "QXJpYU5nXzE2NjEwNzQzNTBfMC44OTUwMDYzNDAzOTE3MDE3", "params": [ftoken ,[val1], { "out": val2,"referer": val3 ,"header":fheader}] }),
            headers: { "Content-Type": "application/json" },
            onload: function (res) {
                if (res.status === 200) {
                    alert('Aria已经开始下载了~');
                } else if (res.error.code != undefined) {
                    alert('错误，请重试！')
                } else {
                    alert(res.error.message);
                }
                btn_get_aria_down.innerHTML = 'Aria下载';
            },
            onerror: function (err) {
                alert('请检查Aria是否启动！');
                btn_get_aria_down.innerHTML = 'Aria下载';
            }
        });

    }

    //-------------------------


    let switch_wd = document.createElement('div');
    switch_wd.style.width = '140px';
    switch_wd.style.height = '200px';
    switch_wd.style.position = 'fixed';
    switch_wd.style.right = '0';
    switch_wd.style.top = '150px';
    switch_wd.style.borderRadius = '3%';
    switch_wd.style.backgroundColor = 'red';
    switch_wd.style.cursor = 'pointer';
    switch_wd.onclick = function () {
        //wd.style.display = wd.style.display == 'none' ? 'block' : 'none';
    }

    let btn_get_durl = document.createElement('span');
    btn_get_durl.innerHTML = '获取下载地址';
    btn_get_durl.id = 'btn_get';
    btn_get_durl.style.top = '10px';
    btn_get_durl.onclick = function () {
        btn_get_durl.innerHTML = '获取中....';
        var pan_name = window.location.host;
        console.log(pan_name)
        if (pan_name.indexOf('xunniu')>=0)
        {
            get_xunniulink();
        }
        else if (pan_name.indexOf('rose')>=0)
        {
            get_roselink();
        }
        else if (pan_name.indexOf('77file')>=0)
        {
            get_77filelink();
        }
        else if (pan_name.indexOf('xingyaopan')>=0 || pan_name.indexOf('xywp1')>=0)
        {
            get_xingyaolink();
        }
        else 
        {
            alert('域名错误');
        }
    //     switch(pan_name)
    // {
    //     case 'xunniufile.com':
    //         get_xunniulink();
    //         break;
    //     case 'rosefile.net':
    //         get_roselink();
    //         break;
    //     case 'www.77file.com':
    //         get_77filelink();
    //         break;
    //     default:
    //         alert('域名错误');
    // }
        
    }

    let btn_get_chrome_down = document.createElement('span');
    btn_get_chrome_down.innerHTML = '浏览器下载';
    btn_get_chrome_down.id = 'btn_get';
    btn_get_chrome_down.style.top = '55px';
    btn_get_chrome_down.onclick = function () {
        btn_get_chrome_down.innerHTML = '已开始下载';
        chrome_down(_global._durl);
    }

    let btn_get_aria_down = document.createElement('span');
    btn_get_aria_down.innerHTML = 'Aria下载';
    btn_get_aria_down.id = 'btn_get';
    btn_get_aria_down.style.top = '100px';
    btn_get_aria_down.onclick = function () {
        btn_get_aria_down.innerHTML = '发送中....';
        aria_down(_global._durl,_global._filename,_global.referer)
    }

    let btn_get_idm_down = document.createElement('span');
    btn_get_idm_down.innerHTML = 'IDM下载';
    btn_get_idm_down.id = 'btn_get';
    btn_get_idm_down.style.top = '145px';
    btn_get_idm_down.onclick = function () {
        btn_get_idm_down.innerHTML = '发送中....';
        idm_down(_global._durl,_global._filename,_global.referer)
    }

    GM_addStyle(`
        #btn_get {
            color:white;
            width:147px;
            height:39px;
            border:1px solid #ed7246;
            align-items:center;
            font-size:16px;
            font-weight:450;
            border-radius:20px;
            justify-content:center;
            background-color:#ed7246;
            position:absolute;
            left:5px;
            display:flex;
            cursor: pointer;
        }
    `);



    let nc = document.createElement('div');
    nc.id = "nc_kcl"

    nc.style.position = 'fixed';
    nc.style.top = '330px';
    nc.style.left = '43%';
    // nc.style.display = 'none'

    document.body.append(nc)
    document.body.append(switch_wd);
    switch_wd.append(btn_get_durl);
    switch_wd.append(btn_get_chrome_down);
    switch_wd.append(btn_get_aria_down);
    switch_wd.append(btn_get_idm_down);
    //document.body.append(wd);
    //     wd.append(title);
    //     wd.append(btn_get_durl);
    //     wd.append(btn_get_chrome_down);
    //     wd.append(btn_get_aria_down);
    //     wd.append(btn_get_idm_down);
    //     wd.append(right_div);
    //     right_div.append(FAQ);
    //     right_div.append(Q1);
    //     right_div.append(A1);
    //     right_div.append(Q2);
    //     right_div.append(A2);
    //     right_div.append(Q3);
    //     right_div.append(A3);
    //     switch_wd.append(ico);
    //     switch_wd.append(u);


    // Your code here...
})();


