// ==UserScript==
// @name         open163_download
// @namespace    zt
// @version      0.1
// @description  download subtitle and video in netease open163
// @author       zt
// @include      http://*.163.com/movie/*
// @include      http://*.163.com/special/*
// @downloadURL https://update.greasyfork.org/scripts/11044/open163_download.user.js
// @updateURL https://update.greasyfork.org/scripts/11044/open163_download.meta.js
// ==/UserScript==
var debug = true;

var xbug = debug ? console.debug.bind(console) : function(){},
    xlog = debug ? console.log.bind(console) : function(){};


function insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置 
    var parent = targetElement.parentNode; // 找到指定元素的父节点 
    if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法 
        parent.appendChild( newElement, targetElement ); 
    }else{ 
        parent.insertBefore( newElement, targetElement.nextSibling ); 
    }
}

//获得视频，字幕链接
function geturl(url,doc,callback){
    //var lc = location,url = location.href,doc = document;
    var piece_url = url.split('/');
    //xbug(doc);
    var scripts = doc.getElementsByTagName("script");
    //xbug(scripts);
    var curmovieappsrc = null;
    for(var i=0;i<scripts.length;i++){
        if(scripts[i].textContent == ""){
            continue;
        }
        var re= /(http:\/\/mov\.bn\.netease\.com\/open\-movie\/nos+[^']*)/i;
        temp = re.exec(scripts[i].textContent);
        //xbug(temp);
        if(temp != null)
            curmovieappsrc = temp[0];
    }
    //xbug(curmovieappsrc);
    //var curmovie = openCourse.getCurrentMovie();
    //var curmovieappsrc = curmovie.appsrc;
    var curmovieflv = "";
    curmovieflv = curmovieappsrc.replace(".m3u8",".flv").replace("mp4","flv");
    var lenofpurl = piece_url.length;
    piece_url[lenofpurl-1] = "2_" + piece_url[lenofpurl-1].split(".")[0] + ".xml";
    var xml_url = "http://live.ws.126.net/movie/" + piece_url.slice(lenofpurl-3).join("/");
    //xbug(curmovieflv);
    //xbug(xml_url);
    var zh_srt = "";
    var en_srt = "";
    GM_xmlhttpRequest({
        method: 'GET',
        url: xml_url,
        onload: function(res){
            var xmldoc = "";
            if(res.status==200){
                // For Firefox
                xmldoc = new DOMParser().parseFromString(res.responseText, 'text/html');
                // For Chrome
                if(xmldoc == undefined){
                    xmldoc = doc.implementation.createHTMLDocument("");
                    xmldoc.querySelector('html').innerHTML = res.responseText;
                }
                //xbug(xmldoc);
                var all = xmldoc.getElementsByTagName("all")[0];
                //xbug(all);
                var subs = all.getElementsByTagName("subs")[0].childNodes;
                //xbug(subs);
                for(var i=0;i<subs.length;i++){
                    var name = subs[i].getElementsByTagName("name")[0].textContent;
                    if(name == "中文")
                        zh_srt = subs[i].getElementsByTagName("url")[0].textContent;
                    if(name == "英文")
                        en_srt = subs[i].getElementsByTagName("url")[0].textContent;
                }
                //xbug(curmovieflv);
                callback(curmovieflv,zh_srt,en_srt);
            }
        }
    });
}
//获得单独视频页面
function getmovpage(movurlt,doc,callback){
    //xbug(movurlt);
    GM_xmlhttpRequest({
        method: 'GET',
        url: movurlt,
        onload: function(res){
            if(res.status==200){
                // For Firefox
                var movdoc = new DOMParser().parseFromString(res.responseText, 'text/html');
                // For Chrome
                if(movdoc == undefined){
                    movdoc = doc.implementation.createHTMLDocument("");
                    movdoc.querySelector('html').innerHTML = res.responseText;
                }
                //xbug(movdoc);
                callback(movdoc);
            }
        }
    });
}
//在课程的页面插入
function insert2(curmovieflv,zh_srt,en_srt,insertplace,doc){
    if(en_srt != ""){
        var ensrt = doc.createElement("a");
        ensrt.innerHTML = '<a href="' + en_srt + '"><em class="f-cgreen"> 英文</em></a>';
        insertAfter(ensrt, insertplace.nextSibling);
    }
    if(zh_srt != ""){
        var zhsrt = doc.createElement("a");
        zhsrt.innerHTML = '<a href="' + zh_srt + '"><em class="f-cgreen"> 中文</em></a>';
        insertAfter(zhsrt, insertplace.nextSibling);
    }
    if(curmovieflv != ""){
        c = count+1;
        var flv = doc.createElement("a");
        flv.innerHTML = '<a href="' + curmovieflv + '"><em class="f-cgreen"> 视频'+'</em></a>';
        insertAfter(flv, insertplace.nextSibling);
    }
}
//在单独的视频页面插入
function insert(curmovieflv,zh_srt,en_srt,insertplace,doc){
    if(en_srt != ""){
        var ensrt = doc.createElement("span");
        ensrt.className = "f-fl intro f-pr";
        ensrt.innerHTML = '<a href="' + en_srt + '"><em class="f-cgreen"> 英文</em></a>';
        insertAfter(ensrt, insertplace.nextSibling);
    }
    if(zh_srt != ""){
        var zhsrt = doc.createElement("span");
        zhsrt.className = "f-fl intro f-pr";
        zhsrt.innerHTML = '<a href="' + zh_srt + '"><em class="f-cgreen"> 中文</em></a>';
        insertAfter(zhsrt, insertplace.nextSibling);
    }
    if(curmovieflv != ""){
        var flv = doc.createElement("span");
        flv.className = "f-fl intro f-pr";
        flv.innerHTML = '<a href="' + curmovieflv + '"><em class="f-cgreen"> 视频</em></a>';
        xbug(curmovieflv);
        insertAfter(flv, insertplace.nextSibling);
    }
}

var count = 0;
var ahref = new Array();
var movurl = new Array();
var timer = null;
//请求单独视频页面，得到视频字幕链接，然后插入
function sentMsg(){
    if(count < movurl.length){
        
        //xbug("c",count,"c");
        getmovpage(movurl[count],document,function(movdoc){
                //xbug("h",count,"h");
                //xbug(movurl[count]);
                geturl(movurl[count],movdoc,function(curmovieflv,zh_srt,en_srt){
                    //xbug(movdoc);
                    insert2(curmovieflv,zh_srt,en_srt,ahref[count],document);
                    count++;
                });
            });
        //sleep(5000);

    }else {
        clearInterval(timer);

    }

}

function sleep(n) {
    var start = new Date().getTime();
    while(true)  if(new Date().getTime()-start > n) break;
}
//处理课程页面
function processspecialpage(url,doc){
    var list1 = doc.getElementById("list1");
    var list2 = doc.getElementById("list2");
    var list1tr = list1.getElementsByTagName("tr");
    var list2tr = list2.getElementsByTagName("tr");
    var listtr = new Array();
    var i;
    for(i = 0;i<list1tr.length;i++){
        listtr[i] = list1tr[i]; 
    }
    for(;i<list1tr.length+list2tr.length;i++){
        listtr[i]=list2tr[i-list1tr.length];
    }
    var j = 0;
    for(i=0;i<listtr.length;i++){
        if(listtr[i].getAttribute("class") == null)
            continue;
        //xbug(i);
        if(listtr[i].getAttribute("class")=="u-even" || listtr[i].getAttribute("class")=="u-odd"){
            ahref[j] = listtr[i].getElementsByTagName("a")[0];
            //xbug(ahref);
            movurl[j] = ahref[j].getAttribute("href");
            j++;
            //xbug(movurl[i]);
            //xbug("hi",i,"hi");
        }
    }
    //xbug(movurl);
    count = 0;
    timer = setInterval(sentMsg,3000);
}
//处理单独视频页面
function processmoviepage(url,doc){
    geturl(url,doc,function(curmovieflv,zh_srt,en_srt){
        //xbug(flvandsrt);
        var spantags = doc.getElementsByTagName("span");    
        //xbug(spantags);
        var intro = null;
        for(i=0;i<spantags.length;i++){
            if(spantags[i].getAttribute("class") == null)
                continue;
            //xbug(spantags[i].getAttribute("class"));
            if (spantags[i].getAttribute("class") == "f-fl intro f-c6 f-pr j-hoverdown") {
                intro=spantags[i];
                break;
            }
        }
        //xbug(intro);
        if(intro == null)
            return;
        insert(curmovieflv,zh_srt,en_srt,intro,doc);
    });
}


function open163(){
    var lc = location,url = location.href,doc = document;
    if(url.indexOf("special/") >= 0){
        processspecialpage(url,doc);
    }
    else{
        processmoviepage(url,doc);
    }
}
open163();