// ==UserScript==
// @name E621 helper v3.0 (2021.12)
// @namespace Violentmonkey Scripts
// @match https://e621.net/posts/*
// @grant none
// @description:en Script to help navigating e621 (created in 2021.12)
// @version 0.0.1.20191009221730
// @description Script to help navigating e621 (created in 2021.12)
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/436564/E621%20helper%20v30%20%28202112%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436564/E621%20helper%20v30%20%28202112%29.meta.js
// ==/UserScript==


var prev_pool = null;
var prev_search = null;

var next_pool = null;
var next_search = null;

var download = null;

var image = null;

function keyPress(kk){
  //Left Arrow
  if(kk == 37){
    if(prev_search){
      prev_search.click();
    }else if(prev_pool){
      prev_pool.click();
    }
  //Right Arrow
  } else if(kk == 39 || kk == 32){
    if(next_search){
      next_search.click();
    }
    else if(next_pool){
      next_pool.click(); 
    }
  //Numeric 1
  } else if(kk == 97 && prev_pool){
    prev_pool.click();
  //Numeric 3
  } else if(kk == 99 && next_pool){
     next_pool.click();
  //Enter
  } else if(kk == 13 && download){
    download.click();
  }
}

window.addEventListener("load", function(){
  image = document.getElementById("image");
  start();
});

function start(){
  window.addEventListener("keydown", function(e){
    e = e || window.event;
    if(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 96 || e.keyCode == 97 || e.keyCode == 99 || e.keyCode == 32){
      keyPress(e.keyCode);
    }
  });
  
  image.addEventListener("click", function(e){
    if(next_search){
      next_search.click();
    }
    else if(next_pool){
      next_pool.click(); 
    }
  });
  
  var search_nav = document.getElementsByClassName("search-seq-nav")[0];  
  var pool_nav = document.getElementsByClassName("pool-nav")[0];

  if(search_nav){
    prev_search = search_nav.children[0].children[0].children[0];
    next_search = search_nav.children[0].children[0].children[2];
  }
  else if(pool_nav){
    prev_pool = pool_nav.children[0].children[0].children[1];
    next_pool = pool_nav.children[0].children[0].children[3];
  }
  
  download = document.getElementById("image-download-link").children[0];
  
  sidebar = document.getElementsByClassName("sidebar")[0];
  img = document.getElementById("image");
  
  console.log("E621 helper loaded :)\r\n=================================\r\nKey layout:\r\n" + 
              "\tLeft arrow: Previous search result OR Previous image in pool.\r\n" + 
              "\tRight arrow: Next search result OR Next image in pool.\r\n" + 
              "\tSpace bar: Next search result OR Next image in pool.\r\n" + 
              "\tClicking the image: Next search result OR Next image in pool.\r\n" + 
              "\tNUM 1: Previous image in pool.*\r\n" + 
              "\tNum 3: Next image in pool.*\r\n" + 
              "\tEnter: Download image.\r\n\t\r\n" + 
              "\t*Even if there are other search results\r\n=================================\r\n" + 
              "\t\r\nHave fun~\r\n\t\t-WolfyD");
}