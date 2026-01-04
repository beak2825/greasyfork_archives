// ==UserScript==
// @name         超星网课建课助手 local
// @namespace    http://nect.tampermonkey.net/
// @version      0.7.5
// @description  帮助老师快捷建超星网课的小工具
// @author       wanchor
// @match        *://*.chaoxing.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/jstree/3.3.9/jstree.min.js
// @require      https://cdn.bootcss.com/draggabilly/2.2.0/draggabilly.pkgd.min.js
// @require      https://cdn.bootcss.com/layer/2.3/layer.js
// @license      GPL License
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @connect      yw.zxxk.com
// @connect      sx.zxxk.com
// @connect      yy.zxxk.com
// @connect      wl.zxxk.com
// @connect      hx.zxxk.com
// @connect      sw.zxxk.com
// @connect      zz.zxxk.com
// @connect      wl.zxxk.com
// @connect      dl.zxxk.com
// @connect      ls.zxxk.com
// @connect      xx.zxxk.com
// @connect      yinyue.zxxk.com
// @connect      ms.zxxk.com
// @connect      ty.zxxk.com
// @connect      tyjs.zxxk.com
// @connect      lj.zxxk.com
// @connect      tz.zxxk.com
// @connect      lsysh.zxxk.com
// @connect      kx.zxxk.com
// @connect      www.xuekeedu.com
// @connect      mooc1-1.chaoxing.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/396319/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%BB%BA%E8%AF%BE%E5%8A%A9%E6%89%8B%20local.user.js
// @updateURL https://update.greasyfork.org/scripts/396319/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%BB%BA%E8%AF%BE%E5%8A%A9%E6%89%8B%20local.meta.js
// ==/UserScript==
var _self = unsafeWindow, _url = location.pathname, _host = location.origin, top = _self;
var setting = {courseid:'',classid:'', que: 0, IN_DEBUG:false};
var vUrls =[
    {"name":"小学", "subjects":[
        {"name":"小学语文", "url":"http://www.xuekeedu.com/books/channel1"},
        {"name":"小学数学", "url":"http://www.xuekeedu.com/books/channel2"},
        {"name":"小学英语", "url":"http://www.xuekeedu.com/books/channel3"},
        {"name":"小学道德与法治", "url":"http://www.xuekeedu.com/books/channel7"},
        {"name":"小学科学", "url":"http://www.xuekeedu.com/books/channel10"},
        {"name":"小学信息技术", "url":"http://www.xuekeedu.com/books/channel12"},
        {"name":"小学音乐", "url":"http://www.xuekeedu.com/books/channel13"},
        {"name":"小学美术", "url":"http://www.xuekeedu.com/books/channel14"},
        {"name":"小学综合实践活动", "url":"http://www.xuekeedu.com/books/channel20"},
        {"name":"小学心里健康", "url":"http://www.xuekeedu.com/books/channel19"}
    ]},
    {"name":"初中", "subjects":[
        {"name":"语文", "url":"http://yw.zxxk.com/m/books/"},
        {"name":"数学", "url":"http://sx.zxxk.com/m/books/"},
        {"name":"英语", "url":"http://yy.zxxk.com/m/books/"},
        {"name":"物理", "url":"http://wl.zxxk.com/m/books/"},
        {"name":"化学", "url":"http://hx.zxxk.com/m/books/"},
        {"name":"历史", "url":"http://ls.zxxk.com/m/books/"},
        {"name":"地理", "url":"http://dl.zxxk.com/m/books/"},
        {"name":"生物", "url":"http://sw.zxxk.com/m/books/"},
        {"name":"政治", "url":"http://zz.zxxk.com/m/books/"},
        {"name":"科学", "url":"http://kx.zxxk.com/m/books/"},
        {"name":"历史与社会", "url":"http://lsysh.zxxk.com/m/books/"},
        {"name":"信息技术", "url":"http://xx.zxxk.com/m/books/"},
        {"name":"音乐", "url":"http://yinyue.zxxk.com/m/books/"},
        {"name":"美术", "url":"http://ms.zxxk.com/m/books/"},
        {"name":"体育与健康", "url":"http://ty.zxxk.com/m/books/"},
        {"name":"劳与技术", "url":"http://lj.zxxk.com/m/books/"},
        {"name":"拓展", "url":"http://tz.zxxk.com/m/books/"}
    ]},
    {"name":"高中", "subjects":[
        {"name":"语文", "url":"http://yw.zxxk.com/h/books/"},
        {"name":"数学", "url":"http://sx.zxxk.com/h/books/"},
        {"name":"英语", "url":"http://yy.zxxk.com/h/books/"},
        {"name":"物理", "url":"http://wl.zxxk.com/h/books/"},
        {"name":"化学", "url":"http://hx.zxxk.com/h/books/"},
        {"name":"历史", "url":"http://ls.zxxk.com/h/books/"},
        {"name":"地理", "url":"http://dl.zxxk.com/h/books/"},
        {"name":"生物", "url":"http://sw.zxxk.com/h/books/"},
        {"name":"政治", "url":"http://zz.zxxk.com/h/books/"},
        {"name":"信息技术", "url":"http://xx.zxxk.com/h/books/"},
        {"name":"音乐", "url":"http://yinyue.zxxk.com/h/books/"},
        {"name":"美术", "url":"http://ms.zxxk.com/h/books/"},
        {"name":"通用技术", "url":"http://tyjs.zxxk.com/h/books/"},
        {"name":"体育与健康", "url":"http://ty.zxxk.com/h/books/"},
        {"name":"劳与技术", "url":"http://lj.zxxk.com/h/books/"},
        {"name":"拓展", "url":"http://tz.zxxk.com/h/books/"}
    ]}
];
var vcp = [];//获取到的章节信息,2维数组

(function() {
    'use strict';
    var SF_URL = "http://www.chaoxing.com";
    GM_addStyle("select {width:130px;height:20px;}");
    GM_addStyle("#MainMenu {position:absolute; top:2px; left:300px;text-align:center;font-size:12pt;color:#fff;z-index:1000;}");
    GM_addStyle("#MainMenu .btns{float:left;background-color:#28a745;color:#fff;font-size:12pt;text-align:center;margin:3px;border-radius: 25px;padding:0 10px 0 10px;}");
    GM_addStyle("#MainMenu #menu {position:absolute;border:1px solid #28a745;width:300px;margin-top:25px;padding: 10px;line-height: 30px;background-color: #53ee7d;overflow-y: scroll;max-height:420px;}");
    GM_addStyle("#addCustomVCP {background-color:#28a745;color:#fff;font-size:14pt;border-radius:25px;tet-align:center;padding:0 10px 0 10px;}");
    GM_addStyle("#BatDiv {z-index: 1000;position: absolute;right: 40px;top: 114px;font-size: 12pt;background-color:#8cb833;width: 315px;padding:10px;color: #fff;}");
    GM_addStyle("#MainMenu button {font-size:12pt;padding:0 10px 0 10px;}");
    GM_addStyle("#MainMenu input {width:70px;margin-right:5px;}");
    GM_addStyle("#MainMenu input.upmsg {width:120px;}");

    GM_addStyle("#ntree {position:fixed;left:0;top:5px;overflow-y: scroll;width:200px;}");
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }
    String.prototype.getBetween=function(startString,endString){
        var d = this;
        var i = this.indexOf(startString);
        if(i < 0){
            return "";
        }
        d = d.substr(i+startString.length);
        i = d.indexOf(endString);
        if(i < 0){
            return "";
        }
        d = d.substr(0,i);
        return d;
    }
    String.prototype.endWith=function(s){
        if(s==null||s==""||this.length==0||s.length>this.length)
            return false;
        if(this.substring(this.length-s.length)==s)
            return true;
        else
            return false;
        return true;
    }
    String.prototype.startWith=function(s){
        if(s==null||s==""||this.length==0||s.length>this.length)
            return false;
        if(this.substr(0,s.length)==s)
            return true;
        else
            return false;
        return true;
    }
    //获取cookie
    function getCookie(name) {
        var strCookies = document.cookie;
        var array = strCookies.split('; ');
        for (var i = 0; i < array.length; i++) {
            var item = array[i].split("=");
            if (item[0] == name) {
                return item[1];
            }
        }
        return null;
    }
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    function createMenu(data){
        $("#menu").empty();
        var menu = $('<div id="menu"><div>学段：<select id="stage"><option value="">-=请选择=-</option><option>小学</option><option>初中</option><option>高中</option>'+
                     '</select></div><div>学科：<select id="subject"><option value="">-=请选择=-</option></select></div><div>教材：<select id="version"><option value="">-=请选择=-</option></select></div>'+
                     '<div>书册：<select id="book"><option value="">-=请选择=-</option></select></div><div style="text-align:center"><button id="btn_add">添加</button>&nbsp;<button id="btn_close">关闭</button></div></div>');
        $('#MainMenu').append(menu);
        $("#btn_add").on('click',function(){
            var url = $("#book").val();
            if(url.length>0){
                getUrl(url, function(responseText){
                    getData(responseText);
                });
            }else{
                alert("请选择正确的【学段】-【学科】-【教材】-【书册】");
            }
        });
        $("#btn_close").on('click',function(){
            $("#menu").remove();
        });
        $("#stage").on('change', function(){
            var stage = $(this).val();
            $.each(vUrls, function(idx, item){
                if(item.name==stage){
                    addOption(item.subjects, "subject");
                }
            });
        });
        $("#subject").on('change', function(){
            var url = $(this).val();
            getUrl($(this).val(), function(responseText){
                var versions = getVersion(responseText, getHostFromUrl(url));
                addOption(versions, "version");
            });
        });
        $("#version").on("change", function(){
            var url = $(this).val();
            getUrl(url, function(responseText){
                var books = getVersion(responseText, getHostFromUrl(url));
                addOption(books, "book");
            });
        });
    }
    function getHostFromUrl(url){
        var ret = "";
        var arr1 = url.split("//");
        if(arr1.length==2){
            ret = arr1[0] + "//" + arr1[1].split("/")[0];
        }
        return ret;
    }
    function addOption(arr, optid){
        var opt = $("#" + optid);
        opt.empty();
        opt.append("<option value=''>-=请选择=-</option>");
        arr.forEach(function(item, idx){
            opt.append('<option value="'+item.url+'">'+item.name+'</option>');
        });
    }
    function getData(zxxkContent){
        vcp.splice(0);
        var e = $(zxxkContent);
        $(".tree1[data-type=class] ul:first", e).children("li").each(function(idx, el){
            showLog("获取【章】信息：" + $("div:first a.tree-node" ,$(this)).attr("title"), 5);
            var v1 = {};
            v1.name = $("div:first a.tree-node" ,$(this)).attr("title");
            if(v1.name){
                v1.added = false;
                var v2 = [];
                $("ul:first" ,$(this)).children("li").each(function(idx, el){
                    showLog("获取【节】信息：" + $("div:first a.tree-node", $(this)).attr("title"), 5);
                    var v = {};
                    v.name = $("div:first a.tree-node", $(this)).attr("title");
                    v.added = false;
                    var v3 = [];
                    if(v.name){
                        $("ul:first" ,$(this)).children("li").each(function(idx, el){
                            showLog("获取【子节】信息:" + $("div:first a.tree-node", $(this)).attr("title"), 5);
                            var vv = {};
                            vv.name = $("div:first a.tree-node", $(this)).attr("title");
                            vv.added = false;
                            v3.push(vv);
                        });
                    }
                    v.data = v3;
                    v2.push(v);
                });
                v1.data = v2;
                vcp.push(v1);
            }
        });
        addVCP(setting.courseid, 0, vcp, 1);
    }
    function parseCustomVCP(contentString){
        var lines = contentString.split("\n");
        var vcp = [];//清空待添加数据数组
        var vcpIdx = -1;
        lines.forEach(function(item, idx){
            if(item.indexOf("++")==0){
                if(vcpIdx >= 0){
                    vcp[vcpIdx].data.push({"name":item});
                }
            }else if(item.indexOf("+")==0){
                var v1 = {};
                v1.name = item;
                v1.data = [];
                vcp.push(v1);
                vcpIdx++;
            }
        });
        return vcp;
    }
    function addVCP(courseid, pid, nodeInfo, level){
        nodeInfo.forEach(function(item, idx){
            addVname(courseid, pid, item, level);
        });
    }
    function showLog(msg, second){
        console.log(msg);
        $("#msg").html(msg).show();
        second = Number(second) || 5;
        window.setTimeout(function(){
            $("#msg").hide();
        }, second * 1000);
    }
    function delVCP(courseid, nodeid){
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://mooc1-2.chaoxing.com/edit/deletechapter?courseid='+courseid+"&nodeid=" + nodeid,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(xhr){
                showLog('删除成功 ==》' + nodeid + "; 结果：" + xhr.responseText);
            },
            onerror: function(xhr){
                showLog('删除【失败】 ==》' + nodeid + "; 结果：" + xhr.responseText);
            }
        });
    }
    //nodeInfo:节点信息，包括name和data数组（表示自章节信息）
    function addVname(courseid, pNodeid, nodeInfo, level){
        GM_xmlhttpRequest({
            method: 'POST',
            url: '/edit/createchapter?name='+nodeInfo.name+'&courseid=' +courseid+ '&parentid='+pNodeid+'&layer='+level,
            headers: {
                //"Content-Type": "application/json"
            },
            onload: function(xhr){
                var pid = eval('(' + xhr.responseText + ')').id;
                showLog('添加成功 ==》新章节名称：' + nodeInfo.name + "; 章节id：" + pid);
                if(nodeInfo.data && nodeInfo.data.length > 0 ){//有子节点
                    addVCP(courseid, pid, nodeInfo.data, level+1);
                }
            },
            onerror:function(xhr){
                showLog('添加失败 ==》' + newNodeName + "; 结果：" + xhr.responseText);
            }
        });
    }
    function webCopy(str){
        try {
            var txtEl = document.createElement('textarea');
            txtEl.value = str;
            document.body.appendChild(txtEl);
            txtEl.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            txtEl.remove();
            return true;
        } catch(err) {
            return false;
        }
    }

    function UploadWordImg_uploadImg(imgbase64, wordImg, tipbtn, fn){
        showLog("正在上传图片，请稍后", 20);
        if(imgbase64.split("base64,").length>=2){
            imgbase64=imgbase64.split("base64,")[1];
        }
        var opt = {imgbase64:imgbase64,
                   wordImg:wordImg,
                   tipbtn:tipbtn,
                   fn:fn
                  };
        if(setting.IN_DEBUG){debugger;};
        function doPost(opt, que){
            showLog("que = " + que + " @ " + new Date().format("yyyy-MM-dd hh:mm:ss"));
            $.ajax({
                type:"POST",
                url:"/Application/uploadByUEditor",
                data: "Filename=word图片&pictitle=word图片&base64img=" + opt.imgbase64 + "&t=" + new Date().getTime(),
                success: function(ret){
                    if(setting.IN_DEBUG){debugger;};
                    showLog("上传图片成功。");
                    //成功返回：{"original":"截图","url":"https://p.ananas.chaoxing.com/star3/origin/7c975edeb20b100610a75ca522f35b43.png","title":"截图","state":"SUCCESS","msg":"上传文件成功"}
                    ret = JSON.parse(ret);
                    if(ret.state == "SUCCESS"){
                        fn && fn(true, opt.wordImg, opt.tipbtn, ret.url);
                    }else{
                        fn && fn(false);
                    }
                },
                error:function(){
                    if(setting.IN_DEBUG){debugger;};
                    showLog("上传图片成功。");
                    fn && fn(false);
                }
            });
        }
        window.setTimeout(function(){doPost(opt, setting.que);},1000 * setting.que++);
    }
    function getUrl(url, fn){
        showLog("正在抓取信息，请稍后", 20);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                //"Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                fn && fn(response.responseText);
            },
            onerror: function(){
                showLog("抓取信息失败，请重试");
            }
        });
    }
    function getVersion(webContent, host){
        var ret = [];
        var e = $(webContent);
        $(".tree1[data-type=class] ul:first", e).children("li").each(function(idx, el){
            showLog("获取【第一层目录】信息：" + $("div:first a.tree-node" ,$(this)).attr("title"), 5);
            //console.log($("ul a.tree-node" ,this));
            var v1 = {};
            v1.name = $("div:first a.tree-node" ,$(this)).attr("title");
            if(v1.name){
                v1.url = $("div:first a.tree-node" ,$(this)).attr("href");
                if(v1.url.indexOf(host)<0){//非完整url
                    v1.url = host + v1.url;
                }
                v1.added = false;
                ret.push(v1);
            }
        });
        return ret;
    }
    function addWordImgBtnByEditor(editorName){
        var customMenu = "";
        var content = '';
        var editor;
        if(editorName =='MOOC'){//课程编辑器的editor
            editor = EditorMgr.getActivatedEditor().getUEditor();
            content = editor.getContent();
        }else{
            editor = UE.getEditor(editorName);
            content = editor.getContent();
        }
        var imgs = $("img[word_img]", content);
        if(imgs.length>0){
            imgs.each(function(idx, item){
                customMenu += "<div id='files'><input type='button' value='复制文件' class='copypath ' word_img='"+$(item).attr("word_img")+"' editor='" +editorName+ "'/>"
                    +"<input type='file' class='wordfile' word_img='"+$(item).attr("word_img")+"' editor='" +editorName+ "'>"
                    +"<input type='button' value='上传状态' class='upmsg' /></div>";
            });
        }
        $('#MainMenu #menu').append(customMenu);
    }
    function getWordImgByEditor(editorName){
        var editor;
        if(editorName =='MOOC'){//课程编辑器的editor
            editor = EditorMgr.getActivatedEditor().getUEditor();
        }else{
            editor = UE.getEditor(editorName);
        }
        var content = (editor == null ? "" : editor.getContent());
        var ret = [];
        $("img[word_img]", content).each(function(idx, item){
            var img = {};
            img.editorName = editorName;
            img.wordImg = item;
            ret.push(img);
        });
        return ret;
    }
    function getEditorNames(pgtype){
        var editors = [];
        switch(pgtype){
            case 1://课程编辑页面
                editors.push("MOOC");
                break;
            case 2://作业页面
                $(".edui-editor").each(function(idx, item){
                    var txtarea = $(item).parent().parent().find("textarea");
                    if(txtarea.length>0){
                        var editorname = $(txtarea[0]).attr("id");
                        var editor = UE.getEditor(editorname);
                        if(editor != null){editors.push(editorname);}
                    }
                });
                break;
        }
        return editors;
    }
    function replaceImgPath(result, wordImg, tipbtn, remoteImgSrc){
        if(result){
            var content = wordImg.editor.getContent();
            var imgs = $("img[word_img]", content);
            content = content.replace(/"/g, "#1#").replace(/'/g, "#2#");
            imgs.each(function(idx, item){
                var localimg = $(item).attr("word_img");
                var oldimg = $(wordImg.wordImg).attr("word_img");
                if(localimg==oldimg){
                    var oldImgStr = item.outerHTML.replace(/"/g, "#1#").replace(/'/g, "#2#");
                    oldImgStr = oldImgStr.substr(0, oldImgStr.length-1);

                    $(item).attr("src", remoteImgSrc).removeAttr("word_img").css({"background":""});
                    var newImgStr = item.outerHTML.replace(/"/g, "#1#").replace(/'/g, "#2#");
                    newImgStr = newImgStr.substr(0, newImgStr.length-1);

                    content = content.replace(oldImgStr, newImgStr);
                }
            });
            wordImg.editor.setContent(content.replace(/#1#/g, "\"").replace(/#2#/g, "'"));
            setting.process[0]++;//ok++
        }else{
            setting.process[1]++;//err++
        }
        tipbtn.val(setting.process.join("/"));
    }
    function addWordImgBtn(pgtype){//pgtype==1:编辑器;2:考试
        $('body').append('<div id="MainMenu"></div>');
        //一键上传word图片
        $('#MainMenu').append('<div class="btns" id="uploadWordImg">一键转存word图片</div>');

        $("#uploadWordImg").unbind().on('click', function(){
            if(setting.IN_DEBUG){debugger;};
            $("#menu").remove();
            $('#MainMenu').prepend('<div id="menu"><div>word图片转存</div></div>');

            //遍历所有editor,获取需要处理的wordimg
            var wordImgs = [];
            setting.editorNames = getEditorNames(pgtype);
            setting.editorNames.forEach(function(editorName, idx){
                //为每个editor的img[word_img]添加file
                wordImgs = wordImgs.concat(getWordImgByEditor(editorName));
            });

            setting.que = 0;//排队post的数量
            setting.process = [0,0,0,0,0];//ok,err,skip,done,all

            var customMenu;
            if(wordImgs.length <= 0){
                $('#MainMenu #menu').append('<div style="text-align:center">没有找到需要转存的word图片。</div><button id="btn_close">关闭</button>');
            }else{
                customMenu = "<div id='files'><div style='text-align:center'>当前需要转存的word图片："+wordImgs.length+"个</div><input type='button' value='复制路径' class='copypath'/>"
                    +"<input type='file' class='wordfiles' multiple='multiple'>"
                    +"<input type='button' value='上传状态' class='upmsg' /></div><div><hr/></div>";
                $('#MainMenu #menu').append(customMenu);

                var tipbtn = $(this).parent().find("input.upmsg");
                var batPath = $(wordImgs[0].wordImg).attr("word_img").replace(/\\/g, '/').split("/");
                batPath.pop();
                $("#MainMenu #menu input.copypath").attr("word_img", batPath.join("/"));
                $("#MainMenu #menu").append('<button id="btn_close">关闭</button>');
                $("#MainMenu input.wordfiles").on('change', function(){
                    if(setting.IN_DEBUG){debugger;};
                    var uploadbtn = $(this);
                    //遍历所有选中的文件，判断是否需要上传
                    var files = this.files;
                    setting.process =[0,0,0,0, files.length];//ok,err,skip,done,select = 0
                    for(var i=0;i<files.length;i++){
                        setting.process[3]=i+1;//done++
                        tipbtn.val(setting.process.join("/"));
                        var file = files[i];
                        if(!/image\/\w+/.test(file.type)){
                            //alert("请确保文件为图像类型");
                            setting.process[2]++;
                            continue;
                        }
                        var wordimg;
                        var checkname = false;
                        for(var item of wordImgs){
                            var imgsrc = $(item.wordImg).attr("word_img");
                            if(imgsrc.endWith(file.name)){
                                wordimg = item;
                                if(wordimg.editorName == "MOOC"){//课程编辑器editor
                                    wordimg.editor = EditorMgr.getActivatedEditor().getUEditor();
                                }else{//考试编辑器
                                    wordimg.editor = UE.getEditor(wordimg.editorName);
                                }
                                checkname = true;
                                break;
                            }
                        }
                        if(!checkname){setting.process[2]++;continue;}//alert("所选文件不在wordimg中。");

                        //开始处理一个wordimg
                        var reader = new FileReader();
                        reader.wordImg = wordimg;
                        reader.tipbtn = tipbtn;
                        reader.onload = function(e) {
                            var base64 = e.target.result;//转换后的文件数据存储在e.target.result中
                            base64 = base64.replace(/\+/g, "%2b");//转码+号
                            UploadWordImg_uploadImg(base64, e.target.wordImg, e.target.tipbtn, replaceImgPath);
                        }
                        reader.readAsDataURL(file);//转化成base64数据类型
                    }
                });
                $("#MainMenu input.copypath").unbind().on('click', function(){
                    $(this).css({"background-color":"#fff", 'color':'#000'});
                    window.setTimeout((function(obj){
                        if(webCopy(obj.attr("word_img"))){
                            obj.css({"background-color":"green","color":"#fff"});
                        }else{
                            obj.css({"background-color":"red","color":"#fff"});
                        }
                    })($(this)), 500);
                });
            }
            $("#btn_close").on('click',function(){
                $("#menu").remove();
            });
            this.value = '';//清空选择
        });
    }
    function addAutoVCPBtn(){
        //自动添加章节按钮
        $('#MainMenu').append('<div class="btns" id="addVCP">自动添加章节</div>');
        $('#addVCP').on('click', function () {
            $("#menu").remove();
            createMenu(vUrls);
        });
    }
    function addManuVCPBtn(){
        //自定义章节添加按钮
        $('#MainMenu').append('<div class="btns" id="addCustomVCP">自定义添加章节</div>');
        $('#addCustomVCP').on('click', function () {
            $("#menu").remove();
            var customMenu = $("<div id='menu'>"+
                               "<div>自定义章节内容<br/>（每行一个，+标示章，++表示节）</div>"+
                               "<div><textarea id='customVCP' style='width:250px;height:300px'></textarea></div>"+
                               '<div style="text-align:center"><button id="btn_add">添加</button>&nbsp;<button id="btn_close">关闭</button></div>'+
                               "</div>"
                              );
            $('#MainMenu').append(customMenu);
            $("#customVCP").val("+第一章\n"+
                                "++第一章第一节\n"+
                                "++第一章第二节\n"+
                                "+第二章\n"+
                                "++第二章第一节");
            $("#btn_add").on('click',function(){
                $(this).text("添加中，请稍后").attr("disabled", "disabled");
                var cVCP = $("#customVCP").val();
                vcp = parseCustomVCP(cVCP);
                addVCP(setting.courseid, 0, vcp, 1);
            });
            $("#btn_close").on('click',function(){
                $("#menu").remove();
            });
        });
    }
    function addDelVCPBtn(){
        //删除所有章节按钮
        if(setting.fid!="1385"){return;}
        $('#MainMenu').append('<div class="btns" id="delVCP">删除所有章节</div>');
        $('#delVCP').on('click', function () {
            if(confirm("删除所有章节，将清空本课程所有内容。\n操作无法回复，确认删除？")){
                if(confirm("真的要删除课程【全部内容】吗？")){
                    $("table#treeview-1085-table tr.lib-chapter-1").each(function(idx, item){
                        var nodeid = $(item).attr("data-recordid");
                        delVCP(setting.courseid, nodeid);
                    });
                }
            }
        });
    }
    function addBatFolderBtn(folderType, inNodeSelector){
        $('<a href="javascript:void(0)" class="New fr Btn_blue_1 batNew" style="margin-left:10px;">批量添加文件夹</a>').prependTo($(inNodeSelector)).on('click', function(){
            (function addBatDiv(){
                $("#BatDiv").remove();
                var customMenu = $("<div id='BatDiv'>"+
                                   "<div>批量添加文件夹（每行一个文件夹名称）</div>"+
                                   "<div><textarea id='customVCP' style='width:300px;height:200px;font-size:12pt;margin:10px 0 10px 0'></textarea></div>"+
                                   '<div style="text-align:center"><button id="btn_add">添加</button>&nbsp;<button id="btn_close">关闭</button></div>'+
                                   '<div id="msg"></div>'+
                                   "</div>"
                                  );
                $(inNodeSelector).append(customMenu);
                if(folderType=='zlnew'){
                    $("#BatDiv button#btn_add").parent().append("<button onclick='window.location.reload();'>刷新</button>");
                }
                $("#BatDiv button#btn_add").on('click', function(){
                    var lines = $("#BatDiv #customVCP").val().split("\n");
                    lines.forEach(function(item, idx){
                        if(item.length>0){
                            var rootid = $("#contents a:last-child").attr("id") || '0';
                            var url = "", data = "", method = "GET";
                            switch(folderType){
                                case "kczl":
                                    method = "GET";
                                    url = "/coursedata/addFolder?dataName="+item
                                        +"&courseId="+setting.courseid
                                        +"&classId="+setting.classid+"&courseName=&rootId="+rootid+"&dataType=afolder&source=1&isOpen=0&parent=&cpi=";
                                    break;
                                case "zlnew":
                                    method = "GET";
                                    url = "/coursedata/add-folder?dataName="+item
                                        +"&courseId="+setting.courseid
                                        +"&classId="+setting.classid+"&courseName=&rootId="+rootid+"&dataType=afolder&source=1&isOpen=0&parent=&cpi=";
                                    break;
                                case "tk":
                                    method = "POST";
                                    url = "/exam/insertDir";
                                    data = "dirName=" +item.replace(/<\/?[^>]+>/g,"")+"&courseId="+$("#courseId").val()+"&pid=" +$("#pid").val()+ "&cpi=" + ($('#cpi').val() || '');
                                    break;
                                case "tknew":
                                    method = "POST";
                                    url = "/qbank/insertdir";
                                    data = "dirName=" +item.replace(/<\/?[^>]+>/g,"")+"&courseid="+$("#courseIds").val()+"&pid=" +$("#dirId").val()+ "&cpi=" + ($('#cpi').val() || '');
                                    break;
                                case "zyk":
                                    method = "POST";
                                    url = "/work/insertDir";
                                    data = "dirName="+item.replace(/<\/?[^>]+>/g,"")+"&courseId="+$("#courseId").val() + "&pid=" + $("#pid").val();
                                    break;
                                case "sjk":
                                    method = "POST";
                                    url = "/exam/insertdir";
                                    data = "dirName="+item.replace(/<\/?[^>]+>/g,"")+"&courseId="+$("#courseId").val() + "&pid=" + $("#pid").val() + "&cpi=" + $("#cpi").val();
                                    break;
                            }
                            GM_xmlhttpRequest({
                                method: method,
                                url: url,
                                data: data,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                onload: function(xhr) {
                                    if(folderType == "zlnew"){
                                        if(xhr.status == 200){
                                            showLog("添加成功");
                                        }
                                    }else{
                                        var j = JSON.parse(xhr.responseText);
                                        if(j.status){
                                            showLog("添加成功");
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
                $("#BatDiv button#btn_close").on('click', function(){
                    $("#BatDiv").remove();
                });
            })();
        });
    }
    function addButtons() {
        addAutoVCPBtn();
        addManuVCPBtn();
        addDelVCPBtn();
        //log消息
        $('#MainMenu').append('<div class="btns" id="msg"></div>');
    }
    //判卷页面
    function addPMbtn(){
        $("<label style='cursor:pointer;' id='hidestdanswer'><input type='checkbox'> 隐藏标准答案</label>").on('click',function(){
            var isCheckedHide = $(this).find('input[type="checkbox"]').prop('checked');
            $(".TiMu").each(function(idx, item){
                isCheckedHide ? $(".Py_tk:first", item).hide() : $(".Py_tk:first", item).show();
            });
        }).appendTo($(".CyTop1 div.fr:last").css("margin-right","6px"));
        $('<p class="Reback beauty fr"><a href="javascript:void(0)" class="RebackA "><input type="checkbox">❀一键美化</a></p>').css("padding-right","10px").on('click', function(e){
            var checkbox = $("input", this);
            $(e.target).prop("tagName") == "INPUT" ? "" : (checkbox.prop("checked", !checkbox.get(0).checked));
            if(checkbox.get(0).checked){
                $(".scrolllist .pdfr.fl.selectSItem").remove();
                $(".scrolllist").css("position","fixed").css({"cursor":"move","margin":"0","height":"400px","width":"190px","border-radius":"20px","background-color":"#7b9e318c"}).show().draggabilly({containment:'body'});
                $(".scrolllist .imglist_w").css("height","400px");
                $(".Py_addpy_New").width("85%");
                $(".makescore").width("15%");
                $(".Listcon").width("140px");
                $(".TiMu .Cy_TItle .clearfix").hide();$(".Cy_ulTop").hide();
                $(".TiMu .Yj_score").css("background-color","#8cb833bd");
                $(".TiMu").each(function(idx, item){
                    $(".Py_tk:first", item).hide();
                    $(item).find(".Py_tk").eq(1).css("background-color","rgba(51, 153, 255, 0.61)");
                });
                $("#hidestdanswer").find('input[type="checkbox"]').prop('checked', true);
            }else{
                $(".scrolllist .pdfr.fl.selectSItem").remove();
                $(".scrolllist").css("position","fixed").css({"cursor":"move","margin":"0","height":"400px","width":"190px","border-radius":"20px","background-color":"#7b9e318c"}).hide().draggabilly({containment:'body'});
                $(".scrolllist .imglist_w").css("height","400px");
                $(".Py_addpy_New").width("85%");
                $(".makescore").width("15%");
                $(".Listcon").width("140px");
                $(".TiMu .Cy_TItle .clearfix").show();$(".Cy_ulTop").show();
                $(".TiMu .Yj_score").css("background-color","#8cb833bd");
                $(".TiMu").each(function(idx, item){
                    $(".Py_tk:first", item).show();
                });
                $("#hidestdanswer").find('input[type="checkbox"]').prop('checked', true);
            }
        }).appendTo($(".CyTop")).click();
    }
    //笔记树
    function addNoteTree(){
        var head = document.getElementsByTagName('head')[0],
            cssURL = 'https://cdn.bootcss.com/jstree/3.3.9/themes/default/style.min.css',
            linkTag = document.createElement('link');
        linkTag.id = 'dynamic-style';
        linkTag.href = cssURL;
        linkTag.setAttribute('rel','stylesheet');
        linkTag.setAttribute('media','all');
        linkTag.setAttribute('type','text/css');
        head.appendChild(linkTag);
        $('body').append("<div id='ntree'></div>");

        $.jstree.defaults.core.themes.variant = "small";
        $.jstree.defaults.core.themes.responsive = true;
        $("#ntree").css("height",document.documentElement.clientHeight + "px").jstree({
            'core' : {
                'theme' :{ "default" : true },
                "plugins": ["sort", "state"], //依次为排序、状态组件
                "sort": function (a, b) {
                    return a['index'] - b['index'];
                },
                'data' : function(obj, callback){
                    var jsonArray = [];
                    var root = {
                        "id":"0",
                        "cid":"",
                        "parent": "#",
                        "text": "<==笔记所有目录",
                        "index": 0
                    };
                    jsonArray.push(root);
                    var p=window.location.href.split("/").length > 6 ? window.location.href.split("/")[6] : "root";
                    var url = "https://noteyd.chaoxing.com/pc/note_notebook/getNotebooksLatest?notebookCid="+p+"&kw=&offsetValue=&top=1&pageSize=100&_t=9&_="+new Date().getTime();
                    showLog(url);
                    $.ajax({
                        type: "GET",
                        url: url,
                        dataType: "json",
                        success: function (res){
                            var arrays = res.msg.list;
                            for (var i = 0; i < arrays.length; i++) {
                                var arr = {
                                    "id": arrays[i].id,
                                    "cid": arrays[i].cid,
                                    "parent": "#",
                                    "text": '[置顶]'+arrays[i].name,
                                    "state": {opened: false},
                                    "index": arrays[i].sort //数据库中的数据排序字段
                                }
                                jsonArray.push(arr);
                            }
                            url = "/pc/note_notebook/getNotebooksLatest?notebookCid="+p+"&kw=&offsetValue=&top=0&pageSize=100&_t=&_="+new Date().getTime();
                            showLog(url);
                            $.ajax({
                                type: "GET",
                                url: url,
                                dataType: "json",
                                success: function (res) {
                                    var arrays = res.msg.list;
                                    for (var i = 0; i < arrays.length; i++) {
                                        var arr = {
                                            "id": arrays[i].id,
                                            "cid": arrays[i].cid,
                                            "parent": "#",
                                            "text": arrays[i].name,
                                            "state": {opened: false},
                                            "index": arrays[i].sort //数据库中的数据排序字段
                                        }
                                        jsonArray.push(arr);
                                    }
                                    callback.call(this, jsonArray);
                                }
                            });
                        }
                    });

                }
            }
        }).bind("select_node.jstree", function (event, data) {
            var instant = data.instance;
            var selectedNode = instant.get_node(data.selected);
            window.location.href = "https://noteyd.chaoxing.com/pc/note_notebook/myNotebooksLatest/" + selectedNode.original.cid;
        });
    }
    //试卷详情
    function addExamDetailBtn(){
        $("<span class='staticticDetail' style='padding-right:10px'><input type='checkbox'>❀一键美化</span>").prependTo($(".CyTop .fr .staticticDetail").parent()).on('click', function(e){
            $("a.showhideQ").remove();//清空之前添加的按钮
            var checkbox = $("input", this);
            $(e.target).prop("tagName") == "INPUT" ? "" : (checkbox.prop("checked", !checkbox.get(0).checked));
            if(checkbox.get(0).checked){
                $(".Cy_TItle_p").hide().find("img").css("max-width","900px");
                $(".Cy_ulTop").hide().find("img").css("max-width","900px");
                $(".Py_tk").each(function(idx,item){
                    $(">div:first", $(item)).hide().find("img").css("max-width","900px");
                });
                $(".TiMu .staticticDetail").each(function(idx, item){
                    $('<a style="text-decoration: none;cursor: pointer;padding-right:10px" class="staticticDetail showhideQ">显示原题</a>').off('click').on('click',function(){
                        if($(this).text()=="显示原题"){
                            $(this).parents(".Py_tk").parent().find(".Cy_TItle_p").show();
                            $(this).parents(".Py_tk").parent().find(".Cy_ulTop").show();
                            $(this).parents(".Py_tk").parent().find(".Py_tk>div:first").show();
                            $(this).parents(".Py_answer").parent().find(".Cy_TItle_p").show();
                            $(this).parents(".Py_answer").parent().find(".Cy_ulTop").show();
                            $(this).parents(".Py_answer").parent().find(".Py_tk>div:first").show();
                            $(this).text("隐藏原题");
                        }else{
                            $(this).parents(".Py_tk").parent().find(".Cy_TItle_p").hide();
                            $(this).parents(".Py_tk").parent().find(".Cy_ulTop").hide();
                            $(this).parents(".Py_tk").parent().find(".Py_tk>div:first").hide();
                            $(this).parents(".Py_answer").parent().find(".Cy_TItle_p").hide();
                            $(this).parents(".Py_answer").parent().find(".Cy_ulTop").hide();
                            $(this).parents(".Py_answer").parent().find(".Py_tk>div:first").hide();
                            $(this).text("显示原题");
                        }
                    }).prependTo($(item).parent());
                });

            }else{
                $(".Cy_TItle_p").show();
                $(".Cy_ulTop").show();
                $(".Py_tk").each(function(idx,item){
                    $(">div:first", $(item)).show();
                });
            }
        });
    }
    top.doexport = function(obj){
        GM_openInTab($(obj).attr("examdetailurl"));
    }

    function addExamBtn(){
        var head = document.getElementsByTagName('head')[0],
            cssURL = 'https://cdn.bootcss.com/layer/2.3/skin/layer.css',
            linkTag = document.createElement('link');
        linkTag.id = 'layer-style';
        linkTag.href = cssURL;
        linkTag.setAttribute('rel','stylesheet');
        linkTag.setAttribute('media','all');
        linkTag.setAttribute('type','text/css');
        head.appendChild(linkTag);
        $("div.ulDiv li:not([class=zm_red])").each(function(idx,item){//开始处理每个试卷
            var paperid = $(".titTxt p a", this)[0].outerHTML.getBetween("paperId=","&");
            var papertitle =$(".titTxt p a", this).attr("title");
            var courseid = $("#courseId").val();
            //var downbtn = $('<a class="Btn_blue_1 fl" style="margin:0 10px;" href="javascript:void(0)"><span>成绩</span></a>').prependTo($(".titOper p", this));
            var newbtn = $('<a class="Btn_blue_1 fl" style="margin:0 10px;" href="javascript:void(0)"><span>查看其他班本卷</span></a>').prependTo($(".titOper p", this));
            newbtn.on('click',function(){
                var arrClassid=(function(){
                    var ret = [];
                    $("#options li a").each(function(idx,item){
                        var cls = {};
                        debugger;
                        cls.id = this.outerHTML.getBetween("selectClass(this,'", "'");
                        cls.name = $(this).attr("title");
                        ret.push(cls);
                    });
                    return ret;
                })();
                layer.open({
                    title: '试卷名称:' + papertitle + "("+paperid+")"
                    ,btn: ['关闭']
                    ,area: "500px"
                    ,btn2: function(){
                        $(".h_boxcontent .h_exportscore_examid").click();
                    }
                    ,content:  (function(){
                        var ret = $("<div class='h_boxcontent'></div>");
                        arrClassid.forEach(function(item,idx){//处理每个班
                            var examUrl = _host + "/exam/test?classId=" +item.id+"&courseId="+courseid+"&ut=t&enc=&cpi=&openc=";
                            $("<div id='h_classid_"+item.id+"'>"+item.name+"("+item.id+")：<span id='h_cid_"+item.id+"' style='float:right'>获取中...</span></div>").css({"height":"30px","border-bottom":"1px solid #2e8ded"}).appendTo(ret);
                            getUrl(examUrl, function(data){//获取不同班级的考试列表
                                var cid=$("#cid", $("<div></div>").html(data)).val();//获取页面内的classid
                                //找到对应的试卷id，并获取考试id
                                var bfindid = false;
                                $("div.ulDiv li:not([class=zm_red])", $("<div></div>").html(data)).each(function(idx,item){
                                    var mpid = $(".titTxt p a", $(this))[0].outerHTML.getBetween("paperId=", "&");
                                    if(mpid==paperid){
                                        bfindid = true;
                                        var examid = this.outerHTML.getBetween("deletePaperNewVersion(", ")");
                                        var examdetailurl = _host + "/exam/test/paperMarkList?classId="+cid+"&courseId="+courseid+"&id="+examid+"&ut=t&examsystem=0&cpi=&openc=";
                                        $("#h_cid_"+cid).html("<a target='_blank' href='"+ examdetailurl+ "'>打开详情</a>&nbsp;<a target='_blank' class='h_exportscore_examid' id='h_exportscore_"+examid+"' examdetailurl='"+examdetailurl+ "&helpercmd=doexport' style='cursor:pointer' onclick='return doexport(this);'>导出成绩</a>");
                                    }
                                });
                                if(!bfindid){
                                    $("#h_classid_"+cid).remove();
                                }
                            });
                        });
                        return ret[0].outerHTML;
                    })(arrClassid)
                });
            });
        });
    }

    window.setTimeout(function(){
        setting.fid = getCookie("fid");
        if(window.location.href.indexOf(".chaoxing.com/edit/chapters") > 0){//课程编辑
            setting.courseid = window.location.href.split("/")[5];
            addWordImgBtn(1);//1=课程编辑页面
            addButtons();
        }else if(window.location.href.indexOf("mooc1.chaoxing.com/coursedata") > 0
                 || window.location.href.indexOf("mooc1-1.chaoxing.com/coursedata") > 0
                 || window.location.href.indexOf("mooc1-2.chaoxing.com/coursedata") > 0){//老版资料
            setting.classid = getQueryString("classId");
            setting.courseid = getQueryString("courseId");
            addBatFolderBtn('kczl', '.ZIYuan_Sj .DySearch');
        }else if(window.location.href.indexOf("mooc2-ans.chaoxing.com/coursedata") >0 ){//新版参考资料
            setting.classid = getQueryString("clazzid");
            setting.courseid = getQueryString("courseid");
            addBatFolderBtn('zlnew', '.CourseDataContent .bnt_group');
        }else if(window.location.href.indexOf(".chaoxing.com/exam/search") > 0){//老版题库
            setting.classid = getQueryString("classId");
            setting.courseid = getQueryString("courseId");
            addBatFolderBtn('tk', '.ZIYuan_Sj div.fr[style]');
        }else if(window.location.href.indexOf(".chaoxing.com/qbank/questionlist") > 0){//新版题库
            setting.classid = getQueryString("clazzid");
            setting.courseid = getQueryString("courseid");
            addBatFolderBtn('tknew', '.question-list .operate-row');
        }else if(window.location.href.indexOf(".chaoxing.com/work/library") > 0){
            setting.classid = getQueryString("classId");
            setting.courseid = getQueryString("courseId");
            addBatFolderBtn('zyk', '.DySearch');
        }else if(window.location.href.indexOf(".chaoxing.com/exam/reVerSionPaperList") > 0){
            setting.classid = getQueryString("classId");
            setting.courseid = getQueryString("courseId");
            addBatFolderBtn('sjk', '.ZIYuan_Sj .DySearch');
        }else if(window.location.href.indexOf(".chaoxing.com/exam/createExamPaperV2") > 0 || //考试管理
                 window.location.href.indexOf(".chaoxing.com/work/goToWorkEditor") > 0 ||//作业管理
                 window.location.href.indexOf(".chaoxing.com/exam/toEditQuestion") > 0){//编辑试题
            setting.classid = getQueryString("classId");
            setting.courseid = getQueryString("courseId");
            addWordImgBtn(2);//考试页面
        }else if(window.location.href.indexOf(".chaoxing.com/exam/test/reVersionPaperMarkContentNew") > 0){//（教师）判卷页面
            addPMbtn();
        }else if(window.location.href.indexOf(".chaoxing.com/pc/note_notebook/myNotebooksLatest") > 0){//笔记页面
            addNoteTree();
        }else if(window.location.href.indexOf(".chaoxing.com/exam/test/stuPaperAnswerTailStatistic") > 0){//考试详情统计
            addExamDetailBtn();
        }else if(window.location.href.endWith(".chaoxing.com/exam/test") || window.location.href.indexOf(".chaoxing.com/exam/test?") > 0){//考试列表
            addExamBtn();
        }else if(window.location.href.indexOf(".chaoxing.com/exam/test/paperMarkList") > 0 ){//（教师）查看判卷结果详情页面
            var hcmd = getQueryString("helpercmd") || "";
            if(hcmd == "doexport"){
                $(".Btn_blue_1").each(function(idx, item){
                    $(item).text() == "导出成绩" ? $(item).click() : "";
                    setTimeout(function(){top.close();}, 2000);
                });
            }
        }
    }, 1 * 1000);
})();