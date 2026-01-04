// ==UserScript==
// @name         b站排行榜过滤 哔哩哔哩 bilibili B站 排行榜
// @version      1.4
// @description  过滤已阅视频和黑名单up主的视频
// @author       wd16811
// @include      *https://www.bilibili.com/v/popular/rank*
// @namespace     168116060@qq.com
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/433683/b%E7%AB%99%E6%8E%92%E8%A1%8C%E6%A6%9C%E8%BF%87%E6%BB%A4%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20bilibili%20B%E7%AB%99%20%E6%8E%92%E8%A1%8C%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/433683/b%E7%AB%99%E6%8E%92%E8%A1%8C%E6%A6%9C%E8%BF%87%E6%BB%A4%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20bilibili%20B%E7%AB%99%20%E6%8E%92%E8%A1%8C%E6%A6%9C.meta.js
// ==/UserScript==
setTimeout(() => {var dbrequest= window.indexedDB.open("wd16811",3);
var db;
var allName;
var allTitle;
var ul = document.getElementsByClassName("rank-list")[0];
var lis = ul.getElementsByTagName("li");
var removeNum;
var watchedNum;
var timestamp = Date.parse(new Date());
var seconds = 60*60*24*3;



dbrequest.onerror = function (event) {
  console.log('数据库打开报错');
};


dbrequest.onsuccess = function (event) {
  db = dbrequest.result;
  console.log('数据库打开成功');
    readAllName();
};

dbrequest.onupgradeneeded = function(event) {
  db = event.target.result;
  db.createObjectStore('upName', { keyPath: 'id' });
  db.createObjectStore('videoTitle', { keyPath: 'id' });
}


function add(name){
    var innsert = db.transaction(['upName'], 'readwrite')
    .objectStore('upName')
    .add({ id: name});

    innsert.onsuccess = function (event) {
    console.log('数据写入成功');
     };

    innsert.onerror = function (event) {
        console.log('数据写入失败');
    }
}

function addTitle(title){
    var innsert = db.transaction(['videoTitle'], 'readwrite')
    .objectStore('videoTitle')
    .add({ id: title,time:timestamp});

    innsert.onsuccess = function (event) {
    console.log('数据写入成功');
     };

    innsert.onerror = function (event) {
        console.log('数据写入失败');
    }
}

function readAllName() {
  var objectStore = db.transaction('upName').objectStore('upName');

   var allRecords = objectStore.getAll();
    allRecords.onsuccess = function() {
        allName = allRecords.result;
        console.log(allRecords.result);
        readAllTitle()

    };
}

function readAllTitle() {
  var objectStore = db.transaction('videoTitle').objectStore('videoTitle');

   var allRecords = objectStore.getAll();
    allRecords.onsuccess = function() {
        allTitle = allRecords.result;
        console.log(allRecords.result);
        removeLi();

    };
}

function removeLi(){
    var len = lis.length;
    var nameLen = allName.length;
    for(let i=0;i<len;){
        let flag = false;
        let upname = " "+lis[i].getElementsByClassName("data-box up-name")[0].innerText;

        for(let j=0;j<nameLen;j++){
            //console.log(upname+allName[j].id);
            if(allName[j].id==upname){

                lis[i].remove();
                len--;
                flag = true
                break;
            }
        }

        if(flag)continue;
        lis[i].getElementsByClassName("num")[0].onclick=function(){
            let name = " "+this.parentNode.parentNode.getElementsByClassName("data-box up-name")[0].innerText;
            console.log(name);
            add(name);
            this.parentNode.parentNode.parentNode.remove();
        };

        lis[i].getElementsByClassName("info")[0].onclick=function(){
            let name = this.getElementsByTagName("a")[0].innerText;
            console.log(name);
            addTitle(name);

        };

        lis[i].getElementsByClassName("info")[0].getElementsByTagName("a")[0].onclick=function(){
            let name = this.innerText;
            console.log(name);
            addTitle(name);

        };
        i++;
    }

    removeNum = 100-len;

    len = lis.length;
    var titleLen = allTitle.length;



    for(let j=0;j<titleLen;j++){
        let title = allTitle[j].id;
        let flag = false;
        for(let i=0;i<len;i++){

            let a = lis[i].getElementsByTagName("a")[1].innerText;

            if(a==title){
                console.log(flag+','+title);
                lis[i].remove();
                len--;
                flag = true;

                break;
            }
        }

        if(!flag&&timestamp-allTitle[j].time>seconds){
            console.log(flag+','+title);
            db.transaction(['videoTitle'], 'readwrite')
            .objectStore('videoTitle')
            .delete(title);
        }
    }

    watchedNum = 100-removeNum-len;

    document.getElementsByClassName("mask-tips-step")[0].getElementsByTagName("span")[0].innerText +="    已阅"+watchedNum+",屏蔽"+removeNum;
    console.log(watchedNum+","+removeNum);
}}, 300);



