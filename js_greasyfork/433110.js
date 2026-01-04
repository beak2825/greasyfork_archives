// ==UserScript==
// @name        MinecraftMaps.com Tagger
// @namespace   Violentmonkey Scripts
// @match       https://www.minecraftmaps.com/*-maps
// @grant       none
// @version     1.0.1
// @author      lempamo
// @description Tag maps from MinecraftMaps.com
// @license     CC0
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/433110/MinecraftMapscom%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/433110/MinecraftMapscom%20Tagger.meta.js
// ==/UserScript==

var db = JSON.parse(localStorage.getItem("MMaps") || '{}');
var mapList = [];

class Map {
  constructor(element, index) {
    this.element = $(element);
    this.header = $($('.jd-item-page > table')[index])
    this.url = $(".map_title a", this.header).attr("href");
    
    db[this.url] ??= {notes: "", state: 0};
    
    $('.stats_data tbody', element).append(`
    <tr>
      <td colspan='4'>
        <a href="javascript:;" style="color: #ccffcc; font-size: 12px; text-decoration: underline" class="mmaps-like">Like</a>
        <a href="javascript:;" style="color: #ffcccc; font-size: 12px; text-decoration: underline" class="mmaps-dislike">Dislike</a>
        <a href="javascript:;" style="color: #ffddcc; font-size: 12px; text-decoration: underline" class="mmaps-meh">Meh</a>
        <a href="javascript:;" style="color: #cccccc; font-size: 12px; text-decoration: underline" class="mmaps-clear">Clear</a>
      </td>
    </tr>
    `);
    
    $(".mmaps-like", element).on("click", this, function(e){
      e.data.initDB();
      db[e.data.url]["state"] = 1;
      e.data.setBG();
      if (db["MMaps"]["hideLikes"]) {
        e.data.element.hide(500);
        e.data.header.hide(500);
      }
      e.data.save();
    });
    
    $(".mmaps-dislike", element).on("click", this, function(e){
      e.data.initDB();
      db[e.data.url]["state"] = 2;
      e.data.setBG();
      if (db["MMaps"]["hideDislikes"]) {
        e.data.element.hide(500);
        e.data.header.hide(500);
      }
      e.data.save();
    });
    
    $(".mmaps-meh", element).on("click", this, function(e){
      e.data.initDB();
      db[e.data.url]["state"] = 3;
      e.data.setBG();
      if (db["MMaps"]["hideMehs"]) {
        e.data.element.hide(500);
        e.data.header.hide(500);
      }
      e.data.save();
    });
    
    $(".mmaps-clear", element).on("click", this, function(e){
      e.data.initDB();
      db[e.data.url]["state"] = 0;
      e.data.setBG().save();
    });
    
    this.setBG();
  }
  
  initDB() {
    db[this.url] ??= {notes: "", state: 0};
  }
  
  save() {
    $.each(db, (k, v) => {
      if (v.notes == "" && v.state == 0) delete db[k];
    });
    
    localStorage.setItem("MMaps", JSON.stringify(db));
    db[this.url] ??= {notes: "", state: 0};
  }
  
  setBG() {
    this.element.css("background-color", (db[this.url]["state"] == 1) ? "#ccffcc"
                                       : (db[this.url]["state"] == 2) ? "#ffcccc"
                                       : (db[this.url]["state"] == 3) ? "#ffeecc"
                                       : "#ffffff");
    return this;
  }
}

db["MMaps"] ??= {hideLikes: false, hideDislikes: false, hideMehs: false};

if ($('.jd_page_nav').length) {
  $('#s5_component_wrap #s5_component_wrap').each(function(i){
    mapList.push(new Map(this, i));
  });
}

$($('.jd-item-page > .module_round_box')[2]).append(`
  <div id="mmaps-config">
    <a href="javascript:;" id="mmaps-hideLike">Hide Likes</a>
    |
    <a href="javascript:;" id="mmaps-hideDislike">Hide Dislikes</a>
    |
    <a href="javascript:;" id="mmaps-hideMeh">Hide Mehs</a>
  </div>
`);

$("#mmaps-hideLike").click(function(){
  $(this).text(db["MMaps"]["hideLikes"] ? "Hide Likes" : "Show Likes");
  
  db["MMaps"]["hideLikes"] = !db["MMaps"]["hideLikes"];
  
  mapList.forEach((g) => {
    if (db[g.url] && db[g.url]["state"] == 1) { 
      g.element.toggle();
      g.header.toggle();
    }
  });
  
  localStorage.setItem("MMaps", JSON.stringify(db));
});

$("#mmaps-hideDislike").click(function(){
  $(this).text(db["MMaps"]["hideDislikes"] ? "Hide Dislikes" : "Show Dislikes");
  
  db["MMaps"]["hideDislikes"] = !db["MMaps"]["hideDislikes"];
  
  mapList.forEach((g) => {
    if (db[g.url] && db[g.url]["state"] == 2) { 
      g.element.toggle();
      g.header.toggle();
    }
  });
  
  localStorage.setItem("MMaps", JSON.stringify(db));
});

$("#mmaps-hideMeh").click(function(){
  $(this).text(db["MMaps"]["hideMehs"] ? "Hide Mehs" : "Show Mehs");
  
  db["MMaps"]["hideMehs"] = !db["MMaps"]["hideMehs"];
  
  mapList.forEach((g) => {
    if (db[g.url] && db[g.url]["state"] == 3) { 
      g.element.toggle();
      g.header.toggle();
    }
  });
  
  localStorage.setItem("MMaps", JSON.stringify(db));
});

if (db["MMaps"]["hideLikes"]) {
  db["MMaps"]["hideLikes"] = false;
  $("#mmaps-hideLike").click();
}

if (db["MMaps"]["hideDislikes"]) {
  db["MMaps"]["hideDislikes"] = false;
  $("#mmaps-hideDislike").click();
}

if (db["MMaps"]["hideMehs"]) {
  db["MMaps"]["hideMehs"] = false;
  $("#mmaps-hideMeh").click();
}