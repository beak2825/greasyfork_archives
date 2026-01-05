// ==UserScript==
// @name          为mp4ba等下载站添加豆瓣打分及链接
// @namespace     http://xubeisi.ddns.net/wordpress
// @description   为mp4ba.com,迅播影院,圣城家园,天天美剧添加相关豆瓣电影链接
// @run-at        document-end
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @include       http://www.mp4ba.com/show.php?*
// @include       http://www.mp4ba.com/index.php?*
// @include       http://www.mp4ba.com
// @include       http://cn163.net/*
// @include       http://www.xiamp4.com/Html/*
// @include       http://www.cnscg.org/*
// @exclude       http://diveintogreasemonkey.org/*
// @exclude       http://www.diveintogreasemonkey.org/*
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/20032/%E4%B8%BAmp4ba%E7%AD%89%E4%B8%8B%E8%BD%BD%E7%AB%99%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E6%89%93%E5%88%86%E5%8F%8A%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/20032/%E4%B8%BAmp4ba%E7%AD%89%E4%B8%8B%E8%BD%BD%E7%AB%99%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E6%89%93%E5%88%86%E5%8F%8A%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
var href = window.location.host;
console.log(href);

var xhr = function (url, cb) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: function (result) {
            var json = eval('('+result.responseText+')');
            var url = json.subjects[0].alt;
            var average = json.subjects[0].rating.average;
            cb(url,average);
        },
        onerror: function (e) {
            console.log(e);
        }
    });  
};

var xhri = function (url, iw, cb) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
        },
        onload: function (result) {
            var json = eval('('+result.responseText+')');
            var url = json.subjects[0].alt;
            var average = json.subjects[0].rating.average;
            var iiw = iw;
            cb(url,average,iiw);
        },
        onerror: function (e) {
            console.log(e);
        }
    });  
};

function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


var mpba = "www.mp4ba.com";
var tucc = "www.xiamp4.com";
var cnscg = "www.cnscg.org";
var mv163 = "cn163.net";

var dbapi = "http://api.douban.com/v2/movie/search?q=";

function getone(href){

    if (href==mpba) {
        console.log("mp4ba");
        var title = document.title;
        console.log(title);
        var arr = new Array();
        arr = title.split(".");
        console.log(arr[0]);
        var name = arr[0];
        var fullurl = dbapi + name;
        console.log(fullurl);
        xhr(fullurl, function (url, average) {
            console.log(url);
            console.log(average);
            var target, newElement;
            target = document.getElementById('magnet').parentNode;
            newElement = document.createElement('p');
            newElement.className = 'douban';
            newElement.innerHTML = '<img src="http://img3.douban.com/favicon.ico" style="width:16px;height:16px;"/><a target="_blank" href="'+url+'">豆瓣详情 '+average+'分</a>';
            target.parentNode.insertBefore(newElement,target.nextSibling);
        });

        addStyle('.douban a{margin-left: 6px;font-size:13px;text-decoration:underline;}.douban img{line-height:16px;margin-bottom: -4px;}');
    };


    if (href==mv163) {
        var title = document.title;
        console.log(title);
        var arr = new Array();
        arr = title.split("/");
        console.log(arr[0]);
        var name = arr[0];
        var fullurl = dbapi + name;
        console.log(fullurl);
        xhr(fullurl, function (url, average) {
            console.log(url);
            console.log(average);
            var filmStar, newElement;
            filmStar = document.getElementById('map');
            newElement = document.createElement('li');
            newElement.innerHTML = '<span>豆瓣：</span><a target="_blank" href="'+url+'">豆瓣详情 '+average+'分</a>';
            filmStar.parentNode.insertBefore(newElement, filmStar);
        });
    };

    if (href==tucc) {
        var title = document.title;
        console.log(title);
        var arr = new Array();
        arr = title.split("在线观看");
        console.log(arr[0]);
        var name = arr[0];
        var fullurl = dbapi + name;
        console.log(fullurl);
        xhr(fullurl, function (url, average) {
            console.log(url);
            console.log(average);
            var filmStar, newElement;
            filmStar = document.getElementById('filmStar').parentNode.parentNode.previousSibling.previousSibling.firstChild;
            newElement = document.createElement('li');
            newElement.innerHTML = '<span>豆瓣：</span><a target="_blank" href="'+url+'">豆瓣详情 '+average+'分</a>';
            filmStar.parentNode.insertBefore(newElement, filmStar);
        });
    };

    if (href==cnscg) {
        console.log("圣城家园");
        var title = document.title;
        console.log(title);
        var arr = new Array();
        arr = title.split("]");
        name = arr[0].replace("[","");
        console.log(name);
        var fullurl = dbapi + name;
        console.log(fullurl);
        console.log(fullurl);
        xhr(fullurl, function (url, average) {
            console.log(url);
            console.log(average);
            var target, newElement;
            target = document.getElementById('magnet').parentNode;
            newElement = document.createElement('p');
            newElement.className = 'douban';
            newElement.innerHTML = '<img src="http://img3.douban.com/favicon.ico" style="width:16px;height:16px;"/><a target="_blank" href="'+url+'">豆瓣详情 '+average+'分</a>';
            target.parentNode.insertBefore(newElement,target.nextSibling);
        });

        addStyle('.douban a{margin-left: 6px;font-size:13px;text-decoration:underline;}.douban img{line-height:16px;margin-bottom: -4px;}');


    };
};

function keepclosure(els,fullurl,i){
    var j=i;
    xhri(fullurl, j, function (url, average,iw) {
        console.log(url + ' ' + iw);
        console.log(average);
        var filmStar, newElement;
        filmStar = iw;
        newElement = document.createElement('li');
        newElement.innerHTML = '<a target="_blank" href="'+url+'">    豆瓣 '+average+'分</a>';
        filmStar.parentNode.appendChild(newElement);
        //                filmStar.parentNode.insertBefore(newElement, filmStar);
    });
}

function getall(href){
    var els = document.getElementsByTagName("a");
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (/show.php/.test(el.href)) {
            var arr = el.text.split('.')[0].trim();
            console.log(arr);
            var name = arr;
            var fullurl = dbapi + name;
            console.log(fullurl + ' ' + i);
            keepclosure(els,fullurl,el);

        }
    }
}

if(href==mpba && !(/show.php/.test(window.location.pathname))) {
    getall(href);
}
else{
    getone(href);
}