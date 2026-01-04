// ==UserScript==
// @name         AnimeGoHelper[Mikan快速订阅]
// @namespace    https://github.com/deqxj00/AnimeGoHelper
// @version      0.60
// @description  AnimeGo的WebAPI调用插件,能快速添加下载项目,配置筛选规则。！！没有适配mikan的高级订阅模式，请关闭后使用。！！
// @author       DeQxJ00,Wetor
// @match        https://mikanani.me/*
// @match        https://mikanime.tv/*
// @icon         https://mikanime.tv/favicon.ico
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/@yaireo/tagify@4.16.4/dist/tagify.min.js
// @require      https://cdn.jsdelivr.net/npm/@yaireo/tagify@4.16.4/dist/tagify.polyfills.min.js
// @resource     tagifycss https://cdn.jsdelivr.net/npm/@yaireo/tagify@4.16.4/dist/tagify.css
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449596/AnimeGoHelper%5BMikan%E5%BF%AB%E9%80%9F%E8%AE%A2%E9%98%85%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/449596/AnimeGoHelper%5BMikan%E5%BF%AB%E9%80%9F%E8%AE%A2%E9%98%85%5D.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const samplepath = 'http://youraddress.local/api';
    const taglist = ["h264", "mp4", "mkv", "h265", "x264", "720p", "1280x720", "hevc", "简体", "繁体", "简中", "繁中", "特别篇", "典藏版", "简繁日", "简日", "繁日"];
    GM_addStyle(GM_getResourceText("tagifycss"));
    //snackbar src https://www.w3schools.com/howto/howto_js_snackbar.asp
    GM_addStyle(`
/* The snackbar - position it at the bottom and in the middle of the screen */
#snackbar {
  visibility: hidden; /* Hidden by default. Visible on click */
  min-width: 250px; /* Set a default minimum width */
  /*margin-left: -125px;  Divide value of min-width by 2 */
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  left: 50%; /* Center the snackbar */
  bottom: 30px; /* 30px from the bottom */
  transform: translate(-50%, 0);
}

/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
  visibility: visible; /* Show the snackbar */
  /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 43px;
  height: 17px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 17px;
}

.slider.round:before {
  border-radius: 50%;
}

/* input api url config */
#inputurldiv,#filterdiv{
opacity: 75;
position: fixed;
left: 35%;
top: 10%;
z-index: 100;
width: 400px;
}

#inputurldiv_inner,#filterdiv_inner{
background-color:#fff;
-webkit-box-shadow: #666 0px 0px 10px;
-moz-box-shadow: #666 0px 0px 10px;
box-shadow: #666 0px 0px 10px;
}

#inputurlbox,#inputurlbox2,#inputurlbox3{
width: 200px;
border-radius: 25px;
padding-right: 7px;
margin-top: 5px;
margin-bottom: 5px;
}

.btn-setting{
color:#fff;
float:right;
margin:5px;
background-color:#61ccd1;
}
.btn-setting2{
color:#fff;
float:right;
margin:5px;
background-color:#00b8ee;
}


/* input tag whitelist blacklist */
.tags-look .tagify__dropdown__item{
  display: inline-block;
  vertical-align: middle;
  border-radius: 3px;
  padding: .3em .5em;
  border: 1px solid #CCC;
  background: #F3F3F3;
  margin: .2em;
  font-size: .85em;
  color: black;
  transition: 0s;
}

.tags-look .tagify__dropdown__item--active{
  color: black;
}

.tags-look .tagify__dropdown__item:hover{
  background: lightyellow;
  border-color: gold;
}

.tags-look .tagify__dropdown__item--hidden {
    max-width: 0;
    max-height: initial;
    padding: .3em 0;
    margin: .2em 0;
    white-space: nowrap;
    text-indent: -20px;
    border: 0;
}


`);


    // 过滤匹配类型详细设定
    // ==============================================
    // 1，2，3 都需要先请求一次/Home/Episode/xxxxxxx的页面
    // 0，4 不需要
    // ==============================================
    // 0.全局关键词过滤
    // 1.BangumiId+SubGroupId(匹配这部动画BangumiId+这个字幕组SubId的关键词过滤)
    // 2.BangumiId(匹配这部动画的BangumiId,然后进行关键词过滤)
    // 3.SubGroupId(匹配这个字幕组SubId,然后进行关键词过滤)
    // 4.SubGroupName(匹配这个字幕组名称,然后进行关键词过滤)
    // =============================================
    //黑白名单同时开启时 先处理白名单 再处理黑名单
    class ListFiliterInner {
        constructor() {
            this.is_enable_whitelist = false;
            this.whitelist = new Array();
            this.is_enable_blacklist = false;
            this.blacklist = new Array();
        }
    }

    class ListFiliters {
        constructor() {
            this.Filiter0 = new Object();
            this.Filiter1 = new Object();
            this.Filiter2 = new Object();
            this.Filiter3 = new Object();
            this.Filiter4 = new Object();
        }
    };
    var myFiliters = new ListFiliters();

    function InitListFiliters() {
        let tmp = GM_getValue('myFiliters');
        if (tmp != null) {
            myFiliters = JSON.parse(tmp);
        } else {
            //sample
            //let defaultlist = new ListFiliterInner();
            //defaultlist.is_enable_blacklist = true;
            //defaultlist.blacklist.push("720p","1080x720");
            //myFiliters.Filiter0.set("0",defaultlist);
            //GM_setValue('myFiliters',JSON.stringify(myFiliters,replacer));
        }
        //newValue = JSON.parse(str, reviver);
    }

    async function digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    InitListFiliters();

    var apipath = samplepath;
    var token = '';
    var tokensha256 = '';
    //提醒信息div
    document.body.insertAdjacentHTML('afterend', '<div id="snackbar">Error</div>');
    var x = document.getElementById("snackbar");
    //设置按钮
    var loginbox = document.getElementsByClassName("w-other-c text-right");
    if (loginbox.length > 0) {
        //已登入
        loginbox[0].insertAdjacentHTML('afterbegin', '<a style="color: #47c1c5;" onclick="showSetting()">AnimeGo设置</a><br>');
    } else {
        //未登入
        loginbox = document.getElementsByClassName("pull-right");
        if (loginbox.length > 0) {
            loginbox[0].insertAdjacentHTML('afterbegin', '<a style="color: #47c1c5;" onclick="showSetting()">AnimeGo设置</a><br>');
        }
    }
    //api地址输入框设定

    var content0 = '<div id="inputurldiv" style="display:none"><div id="inputurldiv_inner"><div class="popover-header popover-title"><span style="color:#3bc0c3">AnimeGo设置</span><button type="button" class="close" onclick="closeSetting()" data-dismiss="popover-x" aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></button></div>'
        + '<div class="popover-body popover-content">'
        + '<span>请修改api地址:</span><input id="inputurlbox" type="text" class="form-control input-sm" placeholder="' + samplepath + '" ><br>'
        + '<span>AccessKey:</span><input id="inputurlbox2" type="password" class="form-control input-sm"><br>'
        + '<span>PluginName:</span><input id="inputurlbox3" type="text" value="filter/mikan_tool.py" class="form-control input-sm"><br>'
        + '<span>备份/导入/清除过滤配置<br>指的是浏览器端插件的</span><br><br>'
        + '<span>上传/获取过滤配置<br>通过AnimeGO的WebAPI同步后端和浏览器插件的过滤配置</span><br><br>'
        + '<input type="file" accept=".json" id="upload" style="visibility:hidden">'
        + '</div>'
        + '<div class="popover-footer"><div style="margin-right: 12px;height:75px">'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting"  onclick="window.confirmurl()">确定</button>'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting"  onclick="window.exportjson()">备份过滤配置</button>'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting"  onclick="window.importjson()">导入过滤配置</button>'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting"  onclick="window.clearjson()">清除过滤配置</button>'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting2" onclick="window.uploadjson()">上传过滤配置</button>'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting2" onclick="window.downloadjson()">获取过滤配置</button>'
        + '<button type="button" class="btn btn-sm btn-submit btn-setting2" onclick="window.testapi()">测试WEB API</button>'
        + '</div></div></div></div>'
    document.body.insertAdjacentHTML('afterend', content0);

    const input = document.querySelector("#upload");
    const fr = new FileReader();
    fr.onload = async function () {
        const blob = new Blob([fr.result])
        var tmpValue;
        try {
            tmpValue = JSON.parse(await blob.text());
        } catch (error) {
            toast('JSON转换错误:' + error);
        }
        if (tmpValue !== null && tmpValue !== undefined && tmpValue !== 'undefined' && tmpValue !== '') {
            myFiliters = tmpValue;
            await GM_setValue('myFiliters', JSON.stringify(myFiliters));
            toast('JSON导入成功');
        }
    }
    input.addEventListener('change', function () {
        const files = this.files;
        if (files.length > 0) {
            console.log(files[0]);
            fr.readAsArrayBuffer(files[0])
        }
    }, false);

    //过滤器设定
    var content = 'AnimeName:<input type="text" id="AnimeName"  disabled ><br>BangumiId:<input type="text" id="BangumiId"  disabled ><br>SubgroupId:<input type="text" id="SubgroupId"  disabled ><br>GroupName:<input type="text" id="GroupName"  disabled ><br><br>';
    content += '请选择一个黑白名单的匹配key<br>后端会根据这个key对应的黑白名单，来决定对应的动画是否下载<br>黑白名单同时开启的情况下先适配白名单再黑名单<br>白名单定义:必须包含其中任意一个词<br>黑名单定义:不能包含其中任意一个词<br><br><select id="myselect"><option value="0">0.全局关键词过滤</option><option value="1" selected="selected">1.BangumiId+SubGroupId</option><option value="2" >2.BangumiId</option><option value="3">3.SubGroupId</option><option value="4">4.SubGroupName</option></select>&nbsp;&nbsp;&nbsp;KEY:<input type="text" id="selectkey" ><br><br>';
    content += '<div style="border-style:dotted;border-width:1px;">筛选说明:<br>0.全局规则适用于所有页面的订阅<br>1.规则适用于这个动画中的这个订阅字幕组<br>2.规则适用于这个动画所有的组<br>3.规则适用于这个订阅字幕组<br>1，2，3 后端都会先请求一次/Home/Episode/xxxxxxx的页面,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用来获取BangumiId，SubGroupId<br>(如果不想后端多发一次请求 请不要添加任何一条1，2，3的规则即可)<br>0，4  &nbsp;&nbsp;&nbsp;&nbsp;不需要上面的请求 是根据rss信息重的标题进行过滤<br>举例:https://mikanani.me/Home/Bangumi/228#562 <br>这个228就是BangumiId 562就是SubGroupId</div><br>';
    content += '<span style="margin-right:5px;">开启白名单</span><label class="switch" id="switchWhitelist"><span>&nbsp;</span><input type="checkbox"><span class="slider round"></span></label><br>';
    content += '<input name="input-custom-dropdown-whitelist" type="text" placeholder="输入白名单过滤关键词后按回车" ><br><br>';
    content += '<span style="margin-right:5px;">开启黑名单</span><label class="switch" id="switchBlacklist"><span>&nbsp;</span><input type="checkbox"><span class="slider round"></span></label><br>';
    content += '<input name="input-custom-dropdown-balcklist" type="text" placeholder="输入黑名单过滤关键词后按回车" >';
    document.body.insertAdjacentHTML('afterend', '<div id="filterdiv" style="display:none"><div id="filterdiv_inner"><div class="popover-header popover-title"><span id="filtertitle" style="color:#3bc0c3">高级过滤设置</span><button type="button" class="close" onclick="closeSettingSubGroup()" data-dismiss="popover-x" aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></button></div><div class="popover-body popover-content">' + content + '</div><div class="popover-footer"><div style="margin-right: 12px;height:30px"><button type="button" id="inputurlspan" class="btn btn-sm btn-submit" style="background-color:#61ccd1" onclick="window.confirmfilter()">确定</button></div></div></div></div>');

    const switchWhitelist = document.getElementById('switchWhitelist');
    const switchBlacklist = document.getElementById('switchBlacklist');
    const selectkey = document.getElementById("selectkey");
    const myselect = document.getElementById("myselect");

    const textAnimeName = document.getElementById("AnimeName");
    const textBangumiId = document.getElementById("BangumiId");
    const textSubgroupId = document.getElementById("SubgroupId");
    const textGroupName = document.getElementById("GroupName");

    const inputurldiv = document.getElementById("inputurldiv");
    const inputurlbox = document.getElementById("inputurlbox");
    const inputurlbox2 = document.getElementById("inputurlbox2");
    const inputurlbox3 = document.getElementById("inputurlbox3");
    const inputurlspan = document.getElementById("inputurlspan");

    const filterdiv = document.getElementById("filterdiv");

    //读取存储的地址
    var tmppath = GM_getValue('apipath');
    var tmp2path = GM_getValue('token');
    if (tmp2path !== null && tmp2path !== undefined && tmp2path !== 'undefined' && tmp2path !== '') {
        inputurlbox2.value = tmp2path;
        token = tmp2path;
        //toast("已读取access key:"+tmp2path);
        digestMessage(tmp2path).then(
            (digestHex) => {
                tokensha256 = digestHex;
            }
        );
    }


    if (tmppath !== null && tmppath !== undefined && tmppath !== 'undefined' && tmppath !== samplepath) {
        apipath = tmppath;
        inputurlbox.value = tmppath;
        inputurldiv.style.display = 'none';
    } else {
        inputurldiv.style.display = '';
    }

    //debug
    if (GM_getValue('debug') == true) {
        //inputurldiv.style.display = 'block';
    }
    unsafeWindow.clearjson = async function () {
        myFiliters.Filiter0 = new Object();
        myFiliters.Filiter1 = new Object();
        myFiliters.Filiter2 = new Object();
        myFiliters.Filiter3 = new Object();
        myFiliters.Filiter4 = new Object();
        await GM_deleteValue('myFiliters');
        InitListFiliters();
        toast('过滤设置已经重置');
    }
    unsafeWindow.importjson = function () {
        input.click();
    }
    unsafeWindow.exportjson = function () {
        var json = JSON.stringify(myFiliters);
        let blob = new Blob([json], {type: 'text;charset=utf-8;'});
        let encodedUrl = URL.createObjectURL(blob);
        let url = document.createElement("a");
        url.setAttribute("href", encodedUrl);
        url.setAttribute("download", "export.json");
        document.body.appendChild(url);
        url.click();
    }

    function urlcheck(link) {
        var isOk = true;
        if (!link.includes("http://") && !link.includes("https://")) {
            toast(link + ',需要包含http://或者https://');
            isOk = false;
        }
        if (!link.includes("/api")) {
            toast(link + ',需要包含/api');
            isOk = false;
        }
        return isOk;
    }

    unsafeWindow.uploadjson = function () {
        const link = inputurlbox.value;
        const name = inputurlbox3.value;
        if (!urlcheck(link)) {
            return
        }
        var json = JSON.stringify(myFiliters);
        var _data = JSON.stringify({"name": name, "data": Base64.encode(json)});
        GM_xmlhttpRequest({
            method: 'POST',
            url: apipath + "/plugin/config",
            data: _data,
            headers: {
                'Access-Key': tokensha256,
                'Content-Type': 'application/json'
            },
            onerror: response => {
                console.log('onerror');
                toast('[api地址不正确] error')
            },
            ontimeout: response => {
                toast('[http]请求超时')
            },
            onloadend: response => {
            },
            onload: response => {
                if (response.status == 200) {
                    var resp = JSON.parse(response.responseText);
                    if (resp === null || resp === undefined || resp === 'undefined') {
                        toast(name + ',[resp is null or undefined]');
                    } else {
                        var code = resp.code;
                        if (code === 200 || code === '200') {
                            toast(resp.msg);
                        } else {
                            toast(name + ',[json code error] code:' + resp.code + ',msg:' + resp.msg);
                        }
                    }
                } else {
                    toast(name + ', [http request error] ' + response.status)
                }
            }
        });
    }
    unsafeWindow.downloadjson = function () {
        const link = inputurlbox.value;
        const name = inputurlbox3.value;
        if (!urlcheck(link)) {
            return
        }
        if (name == '') {
            toast('PluginName不能为空')
            return
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: apipath + "/plugin/config?name=" + name,
            headers: {
                'Access-Key': tokensha256,
            },
            onerror: response => {
                console.log('onerror');
                toast('[api地址不正确] error')
            },
            ontimeout: response => {
                toast('[http]请求超时')
            },
            onloadend: response => {
            },
            onload: response => {
                if (response.status == 200) {
                    var resp = JSON.parse(response.responseText);
                    if (resp === null || resp === undefined || resp === 'undefined') {
                        toast(name + ',[resp is null or undefined]');
                    } else {
                        var code = resp.code;
                        if (code === 200 || code === '200') {
                            var tmpValue;
                            try {
                                const jsonstr = Base64.decode(resp.data.data);
                                tmpValue = JSON.parse(jsonstr);
                                myFiliters = tmpValue;
                                toast(resp.msg);
                                GM_setValue('myFiliters', JSON.stringify(myFiliters));
                            } catch (error) {
                                toast('JSON转换错误:' + error);
                            }
                        } else {
                            toast(name + ',[json code error] code:' + resp.code + ',msg:' + resp.msg);
                        }
                    }
                } else {
                    toast(name + ', [http request error] ' + response.status)
                }
            }
        });
    }
    unsafeWindow.testapi = function () {
        var link = inputurlbox.value;
        if (!urlcheck(link)) {
            return
        }
        link = link.replace("/api", "/ping");
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            headers: {'Accept': 'application/rss+xml'},
            onerror: response => {
                toast(link + ',测试错误,error')
            },
            ontimeout: response => {
                toast(link + ',测试错误,timeout');
            },
            onloadend: response => {
                console.log(link + ',loadend');
            },
            onload: response => {
                //console.log(response.status);
                if (response.status == 200) {
                    var resp = response.responseText;
                    toast('测试成功: ' + resp)
                } else {
                    toast('[http response error] ' + response.status)
                }
            }
        });
    }
    unsafeWindow.showSetting = function () {
        inputurldiv.style.display = 'block';
    }
    unsafeWindow.closeSetting = function () {
        inputurldiv.style.display = 'none';
    }

    //myselect.selectedIndex
    var inputwhitelist = document.querySelector('input[name="input-custom-dropdown-whitelist"]');
    var inputbalcklist = document.querySelector('input[name="input-custom-dropdown-balcklist"]');
    // init Tagify script on the above inputs
    var tagifyWhitelist = new Tagify(inputwhitelist, {
        whitelist: taglist,
        maxTags: 10,
        dropdown: {
            maxItems: 20,
            classname: "tags-look",
            enabled: 0,
            closeOnSelect: true
        }
    });
    var tagifyBlacklist = new Tagify(inputbalcklist, {
        whitelist: taglist,
        maxTags: 10,
        dropdown: {
            maxItems: 20,
            classname: "tags-look",
            enabled: 0,
            closeOnSelect: true
        }
    });

    function myselectonchange() {
        var myFiliter = null;
        switchWhitelist.children[1].checked = false;
        switchBlacklist.children[1].checked = false;
        tagifyWhitelist.removeAllTags();
        tagifyBlacklist.removeAllTags();
        if (myselect.selectedIndex == 0) {
            selectkey.value = '0';
            myFiliter = myFiliters.Filiter0[selectkey.value];
        } else if (myselect.selectedIndex == 1) {
            selectkey.value = 'key_' + BangumiId.value + '_' + SubgroupId.value;
            myFiliter = myFiliters.Filiter1[selectkey.value];
        } else if (myselect.selectedIndex == 2) {
            selectkey.value = BangumiId.value;
            myFiliter = myFiliters.Filiter2[selectkey.value];
        } else if (myselect.selectedIndex == 3) {
            selectkey.value = SubgroupId.value;
            myFiliter = myFiliters.Filiter3[selectkey.value];
        } else if (myselect.selectedIndex == 4) {
            selectkey.value = GroupName.value;
            myFiliter = myFiliters.Filiter4[selectkey.value];
        }
        if (myFiliter !== null && myFiliter !== undefined && myFiliter !== 'undefined') {
            switchWhitelist.children[1].checked = myFiliter.is_enable_whitelist;
            switchBlacklist.children[1].checked = myFiliter.is_enable_blacklist;
            tagifyWhitelist.addTags(myFiliter.whitelist);
            tagifyBlacklist.addTags(myFiliter.blacklist);
        }
    }

    myselect.addEventListener('change', (event) => {
        myselectonchange();
    });
    unsafeWindow.showSettingSubGroup = function (n, animename, groupname, subgroupid, bangumiid) {
        toast("showSettingSubGroup:animename" + animename + ",groupname:" + groupname + ",subgroupid:" + subgroupid + ",bangumiid:" + bangumiid);
        textAnimeName.value = animename;
        textGroupName.value = groupname;
        textBangumiId.value = bangumiid;
        textSubgroupId.value = subgroupid;
        myselectonchange();
        filterdiv.style.display = 'block';
    }
    unsafeWindow.closeSettingSubGroup = function () {
        filterdiv.style.display = 'none';
    }
    unsafeWindow.confirmfilter = function () {
        if (selectkey.value !== null && selectkey.value !== undefined && selectkey.value !== 'undefined' && selectkey.value !== '') {

            let defaultlist = new ListFiliterInner();
            defaultlist.is_enable_whitelist = switchWhitelist.children[1].checked;
            defaultlist.is_enable_blacklist = switchBlacklist.children[1].checked;
            defaultlist.whitelist = []
            tagifyWhitelist.getCleanValue().forEach((obj) => {
                defaultlist.whitelist.push(obj.value)
            });
            defaultlist.blacklist = []
            tagifyBlacklist.getCleanValue().forEach((obj) => {
                defaultlist.blacklist.push(obj.value)
            });
            if (myselect.selectedIndex == 0) {
                myFiliters.Filiter0[selectkey.value] = defaultlist;
            } else if (myselect.selectedIndex == 1) {
                myFiliters.Filiter1[selectkey.value] = defaultlist;
            } else if (myselect.selectedIndex == 2) {
                myFiliters.Filiter2[selectkey.value] = defaultlist;
            } else if (myselect.selectedIndex == 3) {
                myFiliters.Filiter3[selectkey.value] = defaultlist;
            } else if (myselect.selectedIndex == 4) {
                myFiliters.Filiter4[selectkey.value] = defaultlist;
            }
            GM_setValue('myFiliters', JSON.stringify(myFiliters));
            filterdiv.style.display = 'none';
            toast(`确认保存设定:${myselect.selectedIndex},${selectkey.value}`);
        } else {
            toast(`数据为空 不能保存`);
        }
    }
    unsafeWindow.confirmurl = function () {
        var tmp = inputurlbox.value;
        var tmp2 = inputurlbox2.value;
        if (tmp2 !== null && tmp2 !== undefined && tmp2 !== 'undefined') {
            GM_setValue('token', tmp2);
            toast("已保存access key:" + tmp2);
            token = tmp2;
            digestMessage(tmp2).then(
                (digestHex) => {
                    if (tmp2 !== '') {
                        tokensha256 = digestHex;
                    }
                }
            );
        }
        GM_setValue('apipath', tmp);
        apipath = tmp;
        inputurldiv.style.display = 'none';
        toast("保存url:" + tmp);
    }
    unsafeWindow.postApiAllEpisode = function (n, type_name, anime_name, subgroupid, bangumiid) {
        unsafeWindow.postApiBase(n, type_name, anime_name, subgroupid, bangumiid, false, '', false, null);
    }
    unsafeWindow.postApiSingleEpisode = function (n, type_name, anime_name, link, torrent=null) {
        if (n.classList.contains("running")) {
            return;
        }
        var name = anime_name + "," + type_name;
        var u = Ladda.create(n);
        if (type_name != "updateHomeEpisode") {
            u.start();
            n.classList.add('running');
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            headers: {'Accept': 'application/rss+xml'},
            onerror: response => {
                toast(link + ',onerror')
            },
            ontimeout: response => {
                toast(link + ',ontimeout');
            },
            onloadend: response => {
                console.log(link + ',onloadend');
                //u.stop();
                n.classList.remove('running');
            },
            onload: response => {
                //console.log(response.status);
                if (response.status == 200) {
                    var resp = response.responseText;
                    if (resp === null || resp === undefined || resp === 'undefined') {
                        toast(name + '[response is null or undefined]');
                    } else {
                        var parser = new DOMParser();
                        var htmlDoc = parser.parseFromString(resp, "text/html");
                        var rssels = htmlDoc.getElementsByClassName('mikan-rss');
                        if (rssels.length > 0 && rssels[0].hasAttribute('href')) {
                            var bangumiId = getParameterByName('bangumiId', rssels[0].href);
                            var subgroupid = getParameterByName('subgroupid', rssels[0].href);
                            n.classList.remove('running');
                            //u.stop();
                            if(torrent!=null && torrent!='null'){
                                unsafeWindow.postNewApiBase(n, type_name, anime_name, torrent, link, true, u);
                            }else{
                                unsafeWindow.postApiBase(n, type_name, anime_name, subgroupid, bangumiId, true, link, true, u);
                            }
                        } else {
                            toast(name + ', 网页信息缺失 请稍后再试 ' + response.status);
                            n.classList.remove('running');
                            u.stop();
                        }

                    }
                } else {
                    toast(name + ', [http request error] ' + response.status)
                }
            }
        });
    }

    unsafeWindow.postNewApiBase = function (n, type_name, anime_name, torrent_url, mikan_url, is_already_loading, u) {
        if (n.classList.contains("running")) {
            return;
        }
        console.log(`typr_name: ${type_name}, animename: ${anime_name}, torrent: ${torrent_url}, mikan: ${mikan_url}`)
        if (!apipath.includes("http://") && !apipath.includes("https://")) {
            toast('[api地址 需要包含http://或者https:// ]');
        }
        if (!AdvancedSubscriptionEnabled) {
            if (n.classList.contains('running')) {
            } else {
                var _data = JSON.stringify({
                    "source": "mikan",
                    "data": [{
                        "torrent": torrent_url,
                        "info": {
                            "name": anime_name,
                            "url": mikan_url
                        }
                    }]
                });
                console.log(_data);
                n.classList.add('running');
                if (!is_already_loading) {
                    u = Ladda.create(n);
                    u.start();
                }
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apipath + "/download/manager",
                    data: _data,
                    headers: {
                        'Access-Key': tokensha256,
                        'Content-Type': 'application/json'
                    },
                    onerror: response => {
                        console.log('onerror');
                        toast('[api地址不正确] error')
                    },
                    ontimeout: response => {
                        console.log('ontimeout');
                    },
                    onloadend: response => {
                        console.log('onloadend');
                        u.stop();
                        n.classList.remove('running');
                    },
                    onload: response => {
                        //console.log(response.status);
                        if (response.status == 200) {
                            var resp = JSON.parse(response.responseText);
                            if (resp === null || resp === undefined || resp === 'undefined') {
                                toast(anime_name + '[resp is null or undefined]');
                            } else {
                                var code = resp.code;
                                if (code === 200 || code === '200') {
                                    toast(resp.msg);
                                } else {
                                    toast(name + '[json code error] code:' + resp.code + ',msg:' + resp.msg);
                                }
                            }
                        } else {
                            toast(name + ', [http request error] ' + response.status)
                        }
                    }
                });
            }
        } else {
            toast('高级订阅模式未进行适配');
        }
    };

    unsafeWindow.postApiBase = function (n, type_name, anime_name, subgroupid, bangumiid, is_select_ep, ep_link, is_already_loading, u) {
        if (n.classList.contains("running")) {
            return;
        }
        console.log('type_name:' + type_name + ',animename:' + anime_name + ',subgroupid:' + subgroupid + ',bangumiid:' + bangumiid + ',is_select_ep:' + is_select_ep + ',link:' + ep_link);
        var name = anime_name + "," + type_name;
        var rssurl = `https://mikanani.me/RSS/Bangumi?bangumiid=${bangumiid}&subgroupid=${subgroupid}`;
        if (!apipath.includes("http://") && !apipath.includes("https://")) {
            toast('[api地址 需要包含http://或者https:// ]');
        }
        if (!AdvancedSubscriptionEnabled) {
            if (n.classList.contains('running')) {
            } else {
                var _data = JSON.stringify({
                    "source": "mikan",
                    "rss": {"url": rssurl},
                    "is_select_ep": is_select_ep,
                    "ep_links": [ep_link]
                });
                console.log(_data);
                n.classList.add('running');
                if (!is_already_loading) {
                    u = Ladda.create(n);
                    u.start();
                }
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apipath + "/rss",
                    data: _data,
                    headers: {
                        'Access-Key': tokensha256,
                        'Content-Type': 'application/json'
                    },
                    onerror: response => {
                        console.log('onerror');
                        toast('[api地址不正确] error')
                    },
                    ontimeout: response => {
                        console.log('ontimeout');
                    },
                    onloadend: response => {
                        console.log('onloadend');
                        u.stop();
                        n.classList.remove('running');
                    },
                    onload: response => {
                        //console.log(response.status);
                        if (response.status == 200) {
                            var resp = JSON.parse(response.responseText);
                            if (resp === null || resp === undefined || resp === 'undefined') {
                                toast(anime_name + '[resp is null or undefined]');
                            } else {
                                var code = resp.code;
                                if (code === 200 || code === '200') {
                                    toast(resp.msg);
                                } else {
                                    toast(name + '[json code error] code:' + resp.code + ',msg:' + resp.msg);
                                }
                            }
                        } else {
                            toast(name + ', [http request error] ' + response.status)
                        }
                    }
                });
            }
        } else {
            toast('高级订阅模式未进行适配');
        }
    };

    function toast(msg) {
        x.innerText = msg;
        x.className = "show";
        setTimeout(function () {
            x.className = x.className.replace("show", "");
        }, 2000);
    }

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function getId(element) {
        var groupname = '';
        var animename = '';
        var div = element.getElementsByClassName('btn-primary')[0];
        var div2 = element.getElementsByClassName('sk-col tag-res-new');
        var div3 = element.getElementsByClassName('sk-col tag-res-name');
        var div4 = element.parentElement.parentElement.getElementsByClassName('sk-col res-ul-title-text w-other-nh');
        if (div2.length == 1) {
            div2[0].style.margin = '0 0 0 -41px';
        }
        if (div3.length == 1) {
            groupname = div3[0].innerText;
        }
        var subtitlegroupid = div.getAttribute('data-subtitlegroupid');
        var bangumiid = div.getAttribute('data-bangumiid');
        if (div4.length == 1) {
            animename = div4[0].innerText;
            var els = document.getElementsByTagName('a');
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (el.href !== null && el.href !== undefined && el.href !== 'undefined' && el.href.includes('Home/Bangumi/' + bangumiid)) {
                    animename = el.innerText + " , " + animename;
                    //console.log(el.href+","+animename);
                    break;
                }
            }
        }

        animename = animename.replaceAll("'","#39;");
        //btn-primary ladda-button sk-col tag-sub js-subscribe_bangumi
        div.insertAdjacentHTML('afterend', '<div class="ladda-button sk-col tag-sub" onclick="window.showSettingSubGroup(this,\'' + animename + '\',\'' + groupname + '\',' + subtitlegroupid + ',' + bangumiid + ')" style="background-color: #47c1c5;float:right;margin-right:5px;margin-top:-17px;" data-style="zoom-in">设</div>');
        div.insertAdjacentHTML('afterend', '<div class="ladda-button sk-col tag-sub" onclick="window.postApiAllEpisode(this,\'' + animename + '\',\'' + groupname + '\',' + subtitlegroupid + ',' + bangumiid + ')" style="background-color: #5467d8;float:right;margin-right:5px;" data-style="zoom-in">全</div>');
    }

    var bangumidiv = document.querySelector('#sk-body');
    var searchdiv = document.querySelector('#sk-container');
    var anlistdiv = document.querySelector('#an-list');

    const config = {attributes: false, childList: true, subtree: true};
    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //console.log(mutation);
                if (mutation.target.id === 'an-episode-updates') {
                    updateMyBangumiAnlist(mutation.target);
                }
                if (mutation.target.classList.contains('central-container')) {
                    updateMagnetlinkwrap(mutation.target);
                }
                if (mutation.target.classList.length == 2) {
                    updateMagnetlinkwrap(mutation.target);
                    if (mutation.target.classList.contains('row') && mutation.target.classList.contains('an-res-row-frame')) {
                        //js-expand_bangumi-subgroup js-subscribed active
                        var ul = mutation.target.querySelector('ul.list-unstyled.res-ul');
                        if (ul !== null && ul !== undefined && ul !== 'undefined') {
                            var lis = ul.getElementsByTagName('li');
                            for (var k = 0, length = lis.length; k < length; k++) {
                                getId(lis[k]);
                            }
                            if (lis.length > 0) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    function buildSingleButton(type, anime_name, link, torrent){
        return `<div class="ladda-button sk-col tag-sub"
        onclick="window.postApiSingleEpisode(this, \`${type}\`, \`${anime_name}\`, \`${link}\`, \`${torrent}\`)"
        style="background-color: #5467d8;color:white;padding:0px 2px 0px 2px;margin:0px 2px 0px 2px;" data-style="zoom-in">单</div>`
    }

    function getAnimeTorrentLink(li){
        var torrent = null
        var as = li.getElementsByTagName('a')
        Array.prototype.forEach.call(as, function (el) {
            if (el.href !== null && el.href !== undefined && el.href !== 'undefined' && el.href.includes('/Download') && el.href.includes('.torrent')) {
                torrent = el.href
                return
            }
        });
        if(torrent != null){
            return torrent
        }
        console.log('未找到torrent下载链接')
        return null
    }

    function updateMagnetlinkwrap(mainel) {
        var els = mainel.getElementsByClassName('magnet-link-wrap');
        Array.prototype.forEach.call(els, function (el) {
            if (el.href !== null && el.href !== undefined && el.href !== 'undefined' && el.href.includes('Home/Episode') && !el.classList.contains('anigoadded')) {
                var name = el.innerHTML;
                el.classList.add('anigoadded');
                name = name.replaceAll("'","#39;");
                var torrent = getAnimeTorrentLink(el.parentNode.parentNode)
                var button = buildSingleButton('updateMagnetlinkwrap', name, el.href, torrent)
                el.insertAdjacentHTML('afterend', button);
            }
        });
    }

    function updateMyBangumiAnlist(mainel) {
        var els = mainel.getElementsByClassName('w-other-c rss-episode-name');
        Array.prototype.forEach.call(els, function (el) {
            if (el.href !== null && el.href !== undefined && el.href !== 'undefined' && el.href.includes('Home/Episode') && !el.classList.contains('anigoadded')) {
                var name = el.previousElementSibling.previousElementSibling.innerText;
                el.classList.add('anigoadded');
                name = name.replaceAll("'","#39;");
                var torrent = getAnimeTorrentLink(el.parentNode.parentNode)
                var button = buildSingleButton('updateMyBangumiAnlist', name, el.href, torrent)
                el.insertAdjacentHTML('afterend', button);
            }
        });
    }

    const observer = new MutationObserver(callback);
    var path = window.location.pathname;
    if (path.includes('/Home/Bangumi/') || path.includes('/Home/Search') || path.includes('/Home/Classic')) {
        var animename = '';
        var title = document.getElementsByClassName('bangumi-title');
        if (title.length == 1) {
            animename = title[0].innerText;
        }
        var els = document.getElementsByClassName('mikan-rss');
        Array.prototype.forEach.call(els, function (el) {
            if (el.href !== null && el.href !== undefined && el.href !== 'undefined' && el.href.includes('bangumiId') && el.href.includes('subgroupid')) {
                var bangumiId = getParameterByName('bangumiId', el.href);
                var subgroupid = getParameterByName('subgroupid', el.href);
                var groupname = '';

                if (el.previousElementSibling !== null) {
                    groupname = el.previousElementSibling.innerHTML;
                    if (groupname == '&nbsp;') {
                        groupname = el.previousElementSibling.previousElementSibling.children[0].children[0].innerHTML;
                    }
                }
                animename = animename.replace("'","#39;");
                el.insertAdjacentHTML('afterend', '<div class="ladda-button sk-col tag-sub" onclick="window.showSettingSubGroup(this,\'' + animename + '\',\'' + groupname + '\',' + subgroupid + ',' + bangumiId + ')" style="background-color: #47c1c5;color:white;padding:0px 2px 0px 2px;margin:0px 2px 0px 2px;" data-style="zoom-in">设</div>');
                el.insertAdjacentHTML('afterend', '<div class="ladda-button sk-col tag-sub" onclick="window.postApiAllEpisode(this,\'' + animename + '\',\'' + groupname + '\',' + subgroupid + ',' + bangumiId + ')" style="background-color: #5467d8;color:white;padding:0px 2px 0px 2px;margin:0px 2px 0px 2px;" data-style="zoom-in">全</div>');
            }
        });
        //适配 https://mikanani.me/Home/Episode/xxxxxxxxxxxxxxxxxxxxxxx
        updateMagnetlinkwrap(document);
        observer.observe(searchdiv, config);
    }

    if (path.includes('/Home/MyBangumi') || path === '/Home' || path === '/') {
        updateMyBangumiAnlist(document);
        observer.observe(bangumidiv, config);
        observer.observe(anlistdiv, config);
    }

    if (path.includes('/Home/Episode/')) {
        var title1 = document.getElementsByClassName('episode-title')[0].innerText;
        var btn = document.getElementsByClassName('btn episode-btn')[0];
        var name = title1;
        var link = window.location.href;
        //mikan-rss
        var rssels = document.getElementsByClassName('mikan-rss');
        if (rssels.length > 0 && rssels[0].hasAttribute('href')) {
            var bangumiId = getParameterByName('bangumiId', rssels[0].href);
            var subgroupid = getParameterByName('subgroupid', rssels[0].href);
            var magnetspan = document.getElementsByClassName('magnet-link-wrap')[0];
            var groupname = '';
            if (magnetspan.children.length == 0) {
                groupname = '[' + magnetspan.innerText + '] ';
            } else {
                groupname = '[' + magnetspan.children[0].innerText + '] ';
            }
            name = name.replaceAll("'","#39;");
            console.log(magnetspan)
            var torrent = getAnimeTorrentLink(el.parentNode.parentNode)
            var button = buildSingleButton('updateHomeEpisode', name, link, torrent)
            btn.insertAdjacentHTML('afterend', button);
            groupname += document.getElementsByClassName('bangumi-title')[0].children[0].innerText;
            btn.insertAdjacentHTML('afterend', '<div class="btn episode-btn" onclick="window.postApiAllEpisode(this,\'' + groupname + '\',' + subgroupid + ',' + bangumiId + ')" style="" data-style="zoom-in">添加全集到AnimeGo</div>');
            // btn.insertAdjacentHTML('afterend', '<div class="btn episode-btn" onclick="window.postApiSingleEpisode(this,\'updateHomeEpisode\',\'' + name + '\',\'' + link + '\')" style="" data-style="zoom-in">添加单集到AnimeGo</div>');
        }
    }

    //observer.disconnect();
})();
