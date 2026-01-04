// ==UserScript==
// @name        改名self
// @version      0.3.0
// @description  百度网盘一键批量修改后缀，默认修改为MP4；批量替换文件名。【说明：批量改后缀强制改所有后缀，批量替换文件名可以替换一些垃圾版权信息】
// @author       ding(AT)gong.si
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/170181
// @downloadURL https://update.greasyfork.org/scripts/38340/%E6%94%B9%E5%90%8Dself.user.js
// @updateURL https://update.greasyfork.org/scripts/38340/%E6%94%B9%E5%90%8Dself.meta.js
// ==/UserScript==

//日志函数
var debug = false;
var log_count = 1;
function slog(c1,c2,c3){
    c1 = c1?c1:'';
    c2 = c2?c2:'';
    c3 = c3?c3:'';
    if(debug) console.log('#'+ log_count++ +'-ScriptLog:',c1,c2,c3);
}

var yunData,timestamp,bdstoken,logid;
var fileList=[];
var panAPIUrl = location.protocol + "//" + location.host + "/api/";
var restAPIUrl = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
var clientAPIUrl = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";
var theext = 'mp4';

//获取当前目录
function getPath(){
    var hash = location.hash;
    var regx = /(^|&|\/)path=([^&]*)(&|$)/i;
    var result = hash.match(regx);
    return decodeURIComponent(result[2]);
}

String.prototype.endWith = function(str){  
     if(str==null || str=="" || this.length == 0 ||str.length > this.length){      
       return false;  
     }  
     if(this.substring(this.length - str.length)){  
         return true;  
     }else{  
         return false;  
     }  
     return true;  
};  
function getCookie(e) {
    var o, t;
    var n = document,c=decodeURI;
    return n.cookie.length > 0 && (o = n.cookie.indexOf(e + "="),-1 != o) ? (o = o + e.length + 1,t = n.cookie.indexOf(";", o),-1 == t && (t = 

n.cookie.length),c(n.cookie.substring(o, t))) : "";
}

function getLogID(){
    var name = "BAIDUID";
    var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&";
    var d = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var f = String.fromCharCode;
    function l(e){
        var n;
        if (e.length < 2) {
            n = e.charCodeAt(0);
            return 128 > n ? e : 2048 > n ? f(192 | n >>> 6) + f(128 | 63 & n) : f(224 | n >>> 12 & 15) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
        }
        n = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
        return f(240 | n >>> 18 & 7) + f(128 | n >>> 12 & 63) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
    }
    function g(e){
        return (e + "" + Math.random()).replace(d, l);
    }
    function m(e){
        var n = [0, 2, 1][e.length % 3];
        var t = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
        var o = [u.charAt(t >>> 18), u.charAt(t >>> 12 & 63), n >= 2 ? "=" : u.charAt(t >>> 6 & 63), n >= 1 ? "=" : u.charAt(63 & t)];
        return o.join("");
    }
    function h(e){
        return e.replace(/[\s\S]{1,3}/g, m);
    }
    function p(){
        return h(g((new Date()).getTime()));
    }
    function w(e,n){
        return n ? p(String(e)).replace(/[+\/]/g, function(e) {
            return "+" == e ? "-" : "_";
        }).replace(/=/g, "") : p(String(e));
    }
    return w(getCookie(name));
}

function getTimestamp(){
    return yunData.timestamp;
}

function getBDStoken(){
    return yunData.MYBDSTOKEN;
}

function getFileList(){
    var filelist = [];
    var listUrl = panAPIUrl + "list";
    var path = getPath();
    bdstoken = getBDStoken();
    slog('path:',path);
    logid = getLogID();
    var params = {
        dir:path,
        bdstoken:bdstoken,
        logid:logid,
        order:'size',
        desc:0,
        clienttype:0,
        showempty:0,
        web:1,
        channel:'chunlei',
        appid:250528
    };
    $.ajax({
        url:listUrl,
        async:false,
        method:'GET',
        data:params,
        success:function(response){
            filelist = 0===response.errno ? response.list : [];
        }
    });
    return filelist;
}

function rename(filelist){
    url = panAPIUrl + 'filemanager?opera=rename&async=2&channel=chunlei&web=1&app_id=250528&bdstoken='+ bdstoken +'&logid='+ logid +'&clienttype=0';
    var params = {
        filelist:JSON.stringify(filelist),
    };
    $.ajax({
        url:url,
        method:'POST',
        async:false,
        data:params,
        success:function(response){
            slog('response :',response);
            if(response.errno == 0){
                alert('恭喜修改成功，共修改成功 ' + filelist.length + ' 个文件，刷新页面即可看到改变');
                window.location.reload(true);
            }else{
                alert('修改失败，请重新登录再试。如果持续失败，可能是百度接口发生改变。');
            }
        }
    });
}

function do_rename(){
    var name = prompt("请输入要改成的后缀", "mp4");
    if (name){
        theext = name.split(".").pop();
    }else{
        return true;
    }
    if(fileList.length === 0){
        fileList = getFileList();
    }
    slog('fileList:',fileList);
    slog('fileList_Length:',fileList.length);
    if(fileList.length > 0){
        var toRename = [];
        $(fileList).each(function (i){
            slog('fileList '+ i +':',this.path);
            if(this.isdir == 1) return true; //跳过目录 2017-3-4 22:34:34
            fileNameArray = this.path.split(".");
            fileext = fileNameArray.pop();
            if(fileext == theext) return true;
            slog('FileExt :',fileext);
            fileNameArray.push(theext);
            newPath = fileNameArray.join('.');
            slog('newPath :',newPath);
            newName = newPath.split('/').pop();
            slog('newName :',newName);
            toRename.push({"path":this.path,"newname":newName});
        });
        slog('toRename :',toRename);
        if(toRename.length > 0){
            rename(toRename);
        }else{
            alert('好像你的后缀无需更改');
        }
    }else{
        alert('这个目录文件列表为空');
    }
}

function do_replacename(){
    var str_to_find ;//= prompt("输入要替换的字符串（不能为空）", "");
    //if (!str_to_find){
    //    return true;
    //}
    var str_to_replace ;//= prompt("替换成什么？（可以为空）", "");
    if(fileList.length === 0){
        fileList = getFileList();
    }
    slog('fileList:',fileList);
    slog('fileList_Length:',fileList.length);
    if(fileList.length > 0){
        var toRename = [];
        $(fileList).each(function (i){
            slog('fileList '+ i +':',this.path);
            if(this.isdir == 1) return true; //跳过目录 2017-3-4 22:34:34
            pathArray = this.path.split("/");
            fileName = pathArray.pop();

if(fileName.toUpperCase().endWith("RMVB")||fileName.toUpperCase().endWith("RM")||fileName.toUpperCase().endWith("MP4")||fileName.toUpperCase().endWith("AVI")||fileName.toUpperCase().endWith("MKV")||fileName.toUpperCase().endWith("FLV")||fileName.toUpperCase().endWith("WMV"))
{

var suff=fileName.substr(fileName.lastIndexOf('.'));

newName = fileName.replace(suff, '[公众号：小鸡娃的家]'+suff);

                slog('newName :',newName);
                toRename.push({"path":this.path,"newname":newName});
}
            //var pattern=new RegExp(str_to_find);

//            if(pattern.test(fileName)){
  //              newName = fileName.replace(str_to_find, str_to_replace);
    //            slog('newName :',newName);
      //          toRename.push({"path":this.path,"newname":newName});
      //      }
        });
        slog('toRename :',toRename);
        if(toRename.length > 0){
            rename(toRename);
        }else{
            alert('好像没有替换');
        }
    }else{
        alert('这个目录文件列表为空');
    }
}

//入口函数
(function (){
    //获取云盘数据
    yunData = unsafeWindow.yunData;
    slog('yunData:',yunData);
    if(yunData === undefined){
        slog('页面未正常加载，或者百度已经更新！');
        return;
    }
  var q_sel = document.querySelectorAll('.icon-newfolder')[0].parentNode.parentNode.parentNode;
  var ele_to_add = document.createElement('a');
  ele_to_add.className = "g-button";
  ele_to_add.onclick = do_rename;
    $(ele_to_add).html('<span class="g-button-right"><em class="icon icon-edit" title="一键批量改后缀"></em><span class="text" style="width: auto;">一键批量改后缀</span></span>');
  q_sel.appendChild(ele_to_add);
    var ele_to_add2 = document.createElement('a');
  ele_to_add2.className = "g-button";
  ele_to_add2.onclick = do_replacename;
    $(ele_to_add2).html('<span class="g-button-right"><em class="icon icon-edit" title="小鸡娃标记"></em><span class="text" style="width: auto;">小鸡娃标记</span></span>');
  q_sel.appendChild(ele_to_add2);
})();