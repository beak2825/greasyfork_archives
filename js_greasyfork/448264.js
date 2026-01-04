// ==UserScript==
// @name        douban for calibre
// @namespace   Violentmonkey Scripts
// @match       https://192.168.0.20:10003/admin/book/*
// @match       http://192.168.0.20:20003/admin/book/*
// @match       https://ds918plus.local:10003/admin/book/*
// @match       http://ds918plus.local:20003/admin/book/*
// @match       http://192.168.0.30:20003/admin/book/*
// @match       http://omv.local/admin/book/*
// @match       https://book.douban.com/subject/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     0.4.1
// @author      chopong
// @description 2022/7/22 11:20:58
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448264/douban%20for%20calibre.user.js
// @updateURL https://update.greasyfork.org/scripts/448264/douban%20for%20calibre.meta.js
// ==/UserScript==


// document.body.querySelector('h1').append(div);

cpcollect=function(){
  bookinfo={
    booktitle:'',
    bookauthor:'',
    abstract:'',
    isbn:'',
    booktags:'',
    bookseries:'',
    indexseries:'0',
    bookrate:'',
    toppage:'',
    pubdate:'',
    pubpress:'',
    lang:'中文',
    read:'0',
    version:'1',
    note:''
  };
  
  if(document.body.querySelector('h1')){
    bookinfo.booktitle=document.body.querySelector('h1').innerText.trim();
  }
  if(document.body.querySelector("#info")){
    infotext=document.body.querySelector("#info").innerText.split("\n");
    for(var ii in infotext){
      item=infotext[ii].split(":",1);
      if (item=="作者"){
        bookinfo.bookauthor=infotext[ii].substr(3).replaceAll("/","&").trim();
      } else if(item=="译者"){
        bookinfo.bookauthor=bookinfo.bookauthor+"&"+infotext[ii].substr(3).replaceAll("/","&").trim();
      } else if(item=="出版社"){
        bookinfo.pubpress=infotext[ii].substr(4).trim();
      } else if(item=="副标题"){
        bookinfo.booktitle=bookinfo.booktitle+": "+infotext[ii].substr(4).trim();
      } else if(item=="原作名"){
        bookinfo.booktitle=bookinfo.booktitle+" "+infotext[ii].substr(4).trim();
      } else if(item=="出版年"){
        rawpubdate=infotext[ii].substr(4).trim().split(/-|\/|年|月|日/);
        if(rawpubdate[rawpubdate.length-1]==""){
          rawpubdate.pop();
        }
        if(rawpubdate.length==1){
          rawpubdate[1] = "1";
          rawpubdate[2] = "1";
        }else if(rawpubdate.length==2){
          rawpubdate[2] = "1";
        }else{
          rawdate=rawpubdate
        }
        rawdate = new Date(rawpubdate)
        bookinfo.pubdate=rawdate.toLocaleDateString().replaceAll("/","-");
      } else if(item=="ISBN"){
        bookinfo.isbn=infotext[ii].substr(5).trim();
      } else if(item=="丛书"){
        bookinfo.bookseries=infotext[ii].substr(3).trim();
      }
    }
  }
  if(document.body.querySelector(".intro")){
    if(document.body.querySelector(".all.hidden>div>.intro")){
      bookinfo.abstract=document.body.querySelector(".all.hidden>div>.intro").innerHTML.trim(); 
    }else{
      bookinfo.abstract=document.body.querySelector(".intro").innerHTML.trim(); 
    }
  }
//  let doubanid = document.baseURI.split("/")[4];
//  if(document.body.querySelector("#dir_"+doubanid+"_full")){
//    bookinfo.abstract=bookinfo.abstract+"目录"+document.body.querySelector("#dir_"+doubanid+"_full").innerHTML.trim();
//  };
  if(document.body.querySelector(".rating_self>strong")){
    bookinfo.bookrate=document.body.querySelector(".rating_self>strong").innerText.trim();
  }
  if(document.body.querySelector(".nbg")){
    bookinfo.toppage=document.body.querySelector(".nbg").href
  }
  return bookinfo;
};

cpsend=function(bookinfo){
  if(bookinfo.booktitle){
    document.body.querySelector("#book_title").value=bookinfo.booktitle;    
  }
  if(bookinfo.bookauthor){
    document.body.querySelector("#bookAuthor").value=bookinfo.bookauthor;  
  }
  if(bookinfo.isbn && document.querySelector('#identifier-table').querySelectorAll("input").length == 0){
    document.body.querySelector("#add-identifier-line").click();
    document.body.querySelector('input[placeholder="书号类型"]').value="ISBN";
    document.body.querySelector('input[placeholder="书号编号"]').value=bookinfo.isbn;
  }
  if(bookinfo.booktags){
    document.body.querySelector("#tags").value=bookinfo.booktags;    
  }
  if(bookinfo.bookseries){
    document.body.querySelector("#series").value=bookinfo.bookseries;    
  }
  if(bookinfo.indexseries){
    document.body.querySelector("#series_index").value=bookinfo.indexseries;    
  }
  if(bookinfo.bookrate){
    document.body.querySelector("#rating").value=(Number(bookinfo.bookrate)/2).toFixed(0);    
  }
  if(bookinfo.toppage){
    document.body.querySelector("#cover_url").value=bookinfo.toppage;    
  }
  if(bookinfo.pubdate){
    document.body.querySelector("#pubdate").value=bookinfo.pubdate;    
  }
  if(bookinfo.pubpress){
    document.body.querySelector("#publisher").value=bookinfo.pubpress;    
  }
  if(bookinfo.lang && document.body.querySelector("#languages").value == ""){
    document.body.querySelector("#languages").value=bookinfo.lang;  
  }
  if(bookinfo.read && document.body.querySelector("#custom_column_1")){
    document.body.querySelector("#custom_column_1").value=bookinfo.read;
  }
  if(bookinfo.version && document.body.querySelector("#custom_column_2")){
    document.body.querySelector("#custom_column_2").value=bookinfo.version;
  }
  if(bookinfo.abstract){
    document.body.querySelector('#description_ifr').contentDocument.body.innerHTML=bookinfo.abstract;    
  }
  // document.body.querySelector("#bookAuthor").value=bookinfo.note;
}

cpsearch=function(item){
  window.open("https://search.douban.com/book/subject_search?search_text="+item);
}

window.onload=function(){
  let div=document.createElement("div");
  if(document.domain != "book.douban.com"){
    div.innerHTML='<div style="z-index:auto;position:fixed;top:50px;left:600px;color:black;"><button id="cpsearch">搜索</button><button id="cpsend">发送</button></div>';  
  } else {
    div.innerHTML='<div style="z-index:auto;position:fixed;top:50px;left:600px;color:black;"><button id="cpcollect">采集</button><button id="cpsend">发送</button></div>';
  }
  document.body.append(div);
  div.onclick=function(event){
    if(event.target.id=="cpcollect"){
      bookinfo=cpcollect();
      GM_setValue('bookinfo', bookinfo);
      bookinfojson=JSON.stringify(bookinfo);
      //navigator.clipboard.writeText(bookinfojson);
      alert(bookinfojson);
    }else if(event.target.id=="cpsend"){
      //bookinfojson=navigator.clipboard.writeText();
      //https://www.jianshu.com/p/fa3d5b2574a2
      bookinfo=GM_getValue("bookinfo");
      cpsend(bookinfo);
      bookinfojson=JSON.stringify(bookinfo);
      alert(bookinfojson)
    }else if(event.target.id=="cpsearch"){
      cpsearch(document.body.querySelector("#book_title").value);
    }
  };  
};
