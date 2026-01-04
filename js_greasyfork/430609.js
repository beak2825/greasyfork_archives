// ==UserScript==
// @name        Zophar Music Tagger
// @namespace   Violentmonkey Scripts
// @match       https://*.zophar.net/music/*
// @grant       none
// @version     1.1.1
// @author      lempamo
// @description Tag and take notes on soundtracks available from Zophar's Music Domain.
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/430609/Zophar%20Music%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/430609/Zophar%20Music%20Tagger.meta.js
// ==/UserScript==

var db = JSON.parse(localStorage.getItem("ZopharMT") || '{}');
var gameList = [];

class Game {
  element = {};
  url = "";
  bg = "#1f1f1f";
  odd = 0;
  
  constructor(element, odd){
    this.element = $(element);
    this.url = $(".name a", element).attr("href");
    this.odd = odd;
    
    db[this.url] ??= {notes: "", state: 0};
    
    this.setBG();
    
    $(element).css("border-bottom", "1px solid black");
    
    $(".name", element).css("padding", "10px 15px").append(`
      <br/><br/>
      <a href="javascript:;" style="color: #ccffcc; font-size: 12px; text-decoration: underline" class="zmt-like">Like</a>
      <a href="javascript:;" style="color: #ffcccc; font-size: 12px; text-decoration: underline" class="zmt-dislike">Dislike</a>
      <a href="javascript:;" style="color: #ffddcc; font-size: 12px; text-decoration: underline" class="zmt-meh">Meh</a>
      <a href="javascript:;" style="color: #cccccc; font-size: 12px; text-decoration: underline" class="zmt-clear">Clear</a>
      <br/>
      <textarea rows=2 class="zmt-notes" placeholder="Notes..." style="resize: none; width: 100%; margin-top: 0.5em"></textarea>
    `);
    
    $("textarea", element).val(db[this.url]["notes"]).on("change keyup", this, function(e){
      db[e.data.url]["notes"] = $(this).val();
      e.data.save();
    });
    
    $(".zmt-like", element).on("click", this, function(e){
      db[e.data.url]["state"] = 1;
      e.data.setBG();
      $(this).mouseleave();
      if (db["ZMT"]["hideLikes"]) $(this).hide(500);
      e.data.save();
    });
    
    $(".zmt-dislike", element).on("click", this, function(e){
      db[e.data.url]["state"] = 2;
      e.data.setBG();
      $(this).mouseleave();
      if (db["ZMT"]["hideDislikes"]) $(this).hide(500);
      e.data.save();
    });
    
    $(".zmt-meh", element).on("click", this, function(e){
      db[e.data.url]["state"] = 3;
      e.data.setBG();
      $(this).mouseleave();
      if (db["ZMT"]["hideMehs"]) $(this).hide(500);
      e.data.save();
    });
    
    $(".zmt-clear", element).on("click", this, function(e){
      db[e.data.url]["state"] = 0;
      e.data.setBG().save();
    });
    
    $(element).mouseenter(function(){ 
      $(this).css("background-color", "#606060"); 
    }).on("mouseleave", this, function(e){ 
      $(this).css("background-color", e.data.bg); 
    }).mouseleave();
  }
  
  save() {
    $.each(db, (k, v) => {
      if (v.notes == "" && v.state == 0) delete db[k];
    });
    
    localStorage.setItem("ZopharMT", JSON.stringify(db));
    db[this.url] ??= {notes: "", state: 0};
  }
  
  setBG() {
    this.bg = (db[this.url]["state"] == 1) ? "#2a3f2a"
            : (db[this.url]["state"] == 2) ? "#3f2a2a"
            : (db[this.url]["state"] == 3) ? "#3f352a"
            : this.odd ? "#2a2a2a" : "#1f1f1f";
    return this;
  }
}

$("#gamelist tr:not(.headerrow)").each(function(i){
  gameList.push(new Game(this, (i % 2 != 0)));
});

db["ZMT"] ??= {hideLikes: false, hideDislikes: false, hideMehs: false};

$(".found_stats").after(`
  <div id="zmt-config" style="background: #444466; padding: 10px; border: 1px solid #111133; margin-bottom: 5px">
    <a href="javascript:;" style="color: #aaa; text-decoration: underline" id="zmt-hideLike">Hide Likes</a>
    |
    <a href="javascript:;" style="color: #aaa; text-decoration: underline" id="zmt-hideDislike">Hide Dislikes</a>
    |
    <a href="javascript:;" style="color: #aaa; text-decoration: underline" id="zmt-hideMeh">Hide Mehs</a>
    |
    <a href="javascript:;" style="color: #aaa; text-decoration: underline" id="zmt-export">Export Tag Data</a>
    |
    <a href="javascript:;" style="color: #aaa; text-decoration: underline" id="zmt-import">Import Tag Data</a>
  </div>
`);

$("#zmt-hideLike").click(function(){
  $(this).text(db["ZMT"]["hideLikes"] ? "Hide Likes" : "Show Likes");
  
  db["ZMT"]["hideLikes"] = !db["ZMT"]["hideLikes"];
  
  gameList.forEach((g) => {
    if (db[g.url] && db[g.url]["state"] == 1) g.element.toggle();
  });
  
  localStorage.setItem("ZopharMT", JSON.stringify(db));
});

$("#zmt-hideDislike").click(function(){
  $(this).text(db["ZMT"]["hideDislikes"] ? "Hide Dislikes" : "Show Dislikes");
  
  db["ZMT"]["hideDislikes"] = !db["ZMT"]["hideDislikes"];
  
  gameList.forEach((g) => {
    if (db[g.url] && db[g.url]["state"] == 2) g.element.toggle();
  });
  
  localStorage.setItem("ZopharMT", JSON.stringify(db));
});

$("#zmt-hideMeh").click(function(){
  $(this).text(db["ZMT"]["hideMehs"] ? "Hide Mehs" : "Show Mehs");
  
  db["ZMT"]["hideMehs"] = !db["ZMT"]["hideMehs"];
  
  gameList.forEach((g) => {
    if (db[g.url] && db[g.url]["state"] == 3) g.element.toggle();
  });
  
  localStorage.setItem("ZopharMT", JSON.stringify(db));
});

if (db["ZMT"]["hideLikes"]) {
  db["ZMT"]["hideLikes"] = false;
  $("#zmt-hideLike").click();
}

if (db["ZMT"]["hideDislikes"]) {
  db["ZMT"]["hideDislikes"] = false;
  $("#zmt-hideDislike").click();
}

if (db["ZMT"]["hideMehs"]) {
  db["ZMT"]["hideMehs"] = false;
  $("#zmt-hideMeh").click();
}

$("#zmt-export").click(function(){
  navigator.clipboard.writeText(JSON.stringify(db));
  alert("Tag data has been copied to your clipboard.");
});

$("#zmt-import").click(function(){
  //var n = prompt("Paste the JSON string containing tag data below.");
  
  alert("not implemented yet...")
});