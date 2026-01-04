// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/scripts/400848
// @name         今年一定島 圖片log(使用indexedDB)(未完成)
// @description  汲汲營營大報社
// @author       稻米
// @version      2020.04.15.0030.build16299
// @grant        none

// @include      *://*.komica.org/00/*
// @exclude      *://*.komica.org/00/src/*
// @exclude      *://*.komica.org/00/thumb/*
// @exclude      *.jpg
// @exclude      *.png
// @exclude      *.webm

// @downloadURL https://update.greasyfork.org/scripts/400848/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%9C%96%E7%89%87log%28%E4%BD%BF%E7%94%A8indexedDB%29%28%E6%9C%AA%E5%AE%8C%E6%88%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400848/%E4%BB%8A%E5%B9%B4%E4%B8%80%E5%AE%9A%E5%B3%B6%20%E5%9C%96%E7%89%87log%28%E4%BD%BF%E7%94%A8indexedDB%29%28%E6%9C%AA%E5%AE%8C%E6%88%90%29.meta.js
// ==/UserScript==


try{}
catch(err){}
finally{}
//

$(document).ready(function(){
    window.FFF='';
    var aa=$("div.thread");
    //console.log( aa );
    if( aa.length == 1 ){
        poi(); //回文模式才執行
    }
});

function poi(){
    window.gg200414=[];

    //產生按鈕
    $(".thread").before('<poi><button type="reset">圖片log</button></poi>');
    $("poi >button:contains('圖片log')").click(function(){
        //console.log('按鈕');
        poi200406a();//產生右上角的區塊
    });
    //poi200406_testsave();//使用window.localStorage
    poi200406_testsave2();//使用window.indexedDB
    poi200406b();
}

function poi200406(){}
function poi200406a(){
    //產生右上角的區塊
    var div;
    div = $("<div>").html("html").attr({
        'id':'id_poi200413_box01',
        'class':'cls_poi200413_box01',
    });
    $("#threads").after(div);//

    $("#id_poi200413_box01").css({
        "background-color":"rgba(255,255,0,0.5)",
        //"background-color":"yellow",
        "border": "1px solid blue",
        "display":"block",
        "width":"200",
        "height":"200",
        "position":"fixed",
        "top":"0",
        "right":"0",
        "overflow":"scroll",
    });

}
function poi200406b(){
    //var bb=$(".post");
    var bb= document.querySelectorAll(".post");
    //querySelectorAll()：返回靜態NodeList物件集合
    //console.log( bb );


    var json='{"var":200414,"data":[1,2,3]}';
    json = JSON.parse( json );
    console.log( json );


    $.each(bb,function(index,item){
        //console.log( index,item,this );
        //let bb2=$(item).find('.file-text');
        //let bb2=item.querySelectorAll(".file-text");
        let bb2=item.querySelector(".file-text");
        //console.log( bb2 );
        if(bb2){
            let bb3=bb2.querySelector("a");
            //console.log( bb3 );
            let str=bb3.href;
            let bb4='';
            //bb4=str.indexOf("/"); //=5
            //console.log( bb4 );
            bb4=str.lastIndexOf("/"); //=29
            //console.log( bb4 );
            bb4=str.slice(bb4+1);
            //console.log( bb4 );//1586847346537.jpg
            str=bb4;
            bb4=str.split('.');
            //console.log( bb4 );//["1586847346537", "jpg"]
            //
            var thread_num=$('.post.threadpost').attr('data-no'); //首篇編號
            var feed = {
                filename: bb4[0],
                fileext: bb4[1],
                thread: thread_num,
                };
            json.data.push(feed);
            console.log( json );


        }
    });
}

function poi200406_testsave(){
    var aa=window.localStorage;
    //console.log(aa);
    if(!aa){
        //console.log('不支援localStorage');
        $("poi >button:contains('圖片log')").css({
            'background-color':'red',
        });

        return;
    }
    window.localStorage.setItem('poi200413', 'poi200413');
    var aa2=window.localStorage.poi200413;
    if(aa2){}
    //console.log( 'localStorage.poi200413',aa2 );

}
function poi200406_testsave2(){
    if (!('indexedDB' in window)) {
        console.warn('不支援indexedDB');
        return;
    }
    var bb=window.indexedDB;
    console.log(bb);
    var 版本號=200413;
    //indexedDB.open(name, version)
    var idb_OpenDBRequest = window.indexedDB.open("db200413", 版本號);
    console.log( idb_OpenDBRequest );//IDBOpenDBRequest

    var bb3=window.indexedDB.deleteDatabase("db200413");
    console.log( bb3 );//IDBOpenDBRequest

    //var bb4 = bb2.transaction();
    //var idb_Database=idb_OpenDBRequest.result;//Failed to read the 'result' property from 'IDBRequest': The request has not finished.
    //console.log( 'idb_Database',idb_Database );
    var idb_Database;


    //錯誤
    idb_OpenDBRequest.onerror = function(event){
        //console.log('onerror',event);
        var FFF = '['+event.type+'] error: '+event.target.error;
        console.log( FFF );
        //console.log( event.target.error );//錯誤訊息
        //DOMException: Version change transaction was aborted in upgradeneeded event handler.
    };
    //成功
    idb_OpenDBRequest.onsuccess = function(event){
        //console.log('onsuccess',event);
        let FFF = '['+event.type+'] readyState: '+event.target.readyState;
        console.log( FFF );
        idb_Database = event.target.result;//IDBDatabase //資料庫
        console.log( idb_Database );
        if( event.target.result == idb_OpenDBRequest.result ){
            //console.log( '相同' );
        }
        if( event.target.result === idb_OpenDBRequest.result ){
            //console.log( '相同' );
        }



        var storeName='測試';
        var idb_Transaction=idb_Database.transaction(storeName,'readwrite');//readonly(預設), readwrite
        console.log( 'idb_Transaction',idb_Transaction );//IDBTransaction
        var idb_ObjectStore=idb_Transaction.objectStore(storeName);//IDBObjectStore
        console.log( idb_ObjectStore );
        var idb_Request;
        idb_Request =idb_ObjectStore.add({'nn':'nnnn'});//IDBRequest
        //console.log( idb_Request );
        idb_Request =idb_ObjectStore.add({'nn':'哈哈'});//IDBRequest
        //console.log( idb_Request );
        idb_Request =idb_ObjectStore.get(1);//IDBRequest //nmsl //初始化時寫入的數據
        //console.log( idb_Request );
        idb_Request =idb_ObjectStore.get(2);//IDBRequest //nnnn //上面幾行新增的數據
        //console.log( idb_Request );

        idb_Request.onerror=function(event){
            console.log( '失敗' );
            //console.log( 'idb_Request.onerror',event );//
        };
        idb_Request.onsuccess=function(event){
            console.log( '成功' );
            //console.log( 'idb_Request.onsuccess',event );//
            var aa=event.target.result;//多個request只會印出id最小的那筆資料
            console.log( aa,aa.id,aa.nn );

        };
        //console.log( 'FFF',FFF );

        idb_Request=idb_ObjectStore.openCursor();//IDBRequest
        console.log( idb_Request );
        //console.log( 'FFF',FFF );
        idb_Request.onerror=function(event){
            console.log( '失敗' );
            //console.log( 'idb_Request.onerror',event );//
        };
        var datas = [];
        idb_Request.onsuccess=function(event){
            console.log( '成功' );
            //console.log( 'idb_Request.onsuccess',event );//
            var cursor = event.target.result;
            if(cursor){
                console.log('c',cursor.value);
                cursor.continue();
            }else{
                //
            }

        };



    };
    //更新
    idb_OpenDBRequest.onupgradeneeded = function(event){
        //建立資料庫結構或更新資料庫版本
        //console.log('onupgradeneeded',event);//IDBVersionChangeEvent
        let FFF = '['+event.type+'] version: '+event.oldVersion+'=>'+event.newVersion;
        console.log( FFF );

        //console.log( event.target.result );//IDBDatabase
        //create a new database
        idb_Database = event.target.result;//IDBDatabase
        //console.log( db );//IDBDatabase

        let idb_ObjectStore = idb_Database.createObjectStore("時間", { unique: true });//IDBObjectStore
        //var objectStore2 = idb_Database.createObjectStore("時間", { unique: true });//An object store with the specified name already exists.
        var storeName='測試';
        if(!idb_Database.objectStoreNames.contains(storeName)){
            let idb_ObjectStore = idb_Database.createObjectStore(storeName, { unique: true, keyPath: 'id' ,autoIncrement: true});//
            //console.log( 'idb_ObjectStore',idb_ObjectStore );//IDBObjectStore
            // 创建一个索引，便于快速查找数据
            idb_ObjectStore.createIndex("這是indexName", "nn", { unique: false });
            //console.log( 'idb_ObjectStore',idb_ObjectStore );//IDBObjectStore
            let idb_Request = idb_ObjectStore.put({"nn":"nmsl"});//IDBRequest //放置初始化数据
            //console.log( idb_Request );//
            idb_Request.onerror=function(event){
                //console.log( '失敗' );
                //console.log( 'idb_Request.onerror',event );//
            };
            idb_Request.onsuccess=function(event){
                //console.log( '成功' );
                //console.log( 'idb_Request.onsuccess',event );//
            };


        }

        //console.log( event.target.result );
        //console.log( idb_Database );


    };


}

/*
indexeddb的瀏覽器支援度
https://caniuse.com/#feat=indexeddb

https://developer.mozilla.org/zh-TW/docs/Web/API/IndexedDB_API/Using_IndexedDB
IndexedDB 操作時不會鎖死瀏覽器，用戶依然可以進行其他操作，這與 LocalStorage 形成對比，後者的操作是同步的。
異步設計是為了防止大量數據的讀寫，拖慢網頁的表現。

網頁只能訪問自身域名下的資料庫，而不能訪問跨域的資料庫。

儲存空間比 LocalStorage 大得多，一般來說不少於 250MB

IndexedDB 不僅可以儲存字符串，還可以儲存二進位數據（ArrayBuffer 對象和 Blob 對象）。


https://zhuanlan.zhihu.com/p/76393853

*/