// ==UserScript==
// @name Corgi
// @description Corgis Trumps.
// @author lshapz
// @include  *
// @version 0.2
// @match *
// @license MIT License
// @run-at document-end
// @namespace https://greasyfork.org/users/79378
// @downloadURL https://update.greasyfork.org/scripts/24757/Corgi.user.js
// @updateURL https://update.greasyfork.org/scripts/24757/Corgi.meta.js
// ==/UserScript==

if(window.addEventListener()){

    window.addEventListener("onload",load);


 }else{

    window.addEventListener("load",load,true);

 }

 function load(){
     corgi();
 }

function corgi(){
const corgis = ["http://wallpapercave.com/wp/mcMZBGt.jpg", "https://a.dilcdn.com/bl/wp-content/uploads/sites/8/2013/09/Gibson.jpg", "https://s-media-cache-ak0.pinimg.com/564x/ed/0e/68/ed0e68d1f8a0a1f4b5582ed180cce761.jpg", "https://s-media-cache-ak0.pinimg.com/236x/0f/a4/e8/0fa4e804e183c7882db427a52f25b400.jpg", "https://i.ytimg.com/vi/To8oesttqc4/hqdefault.jpg", "https://s-media-cache-ak0.pinimg.com/originals/4b/91/56/4b915650cbe4befa0b575399cc2fd64b.jpg", "https://img.buzzfeed.com/buzzfeed-static/static/2014-02/enhanced/webdr06/27/11/enhanced-23386-1393518486-11.jpg", "https://s-media-cache-ak0.pinimg.com/564x/c6/61/4d/c6614dea2526c9b1f2376776920302df.jpg", "http://www.pupsor.com/wp-content/uploads/2016/03/corgi-puppy-adoption.jpg", "https://a.dilcdn.com/bl/wp-content/uploads/sites/8/2013/09/Gibson.jpg"];

var array = Array.from(document.getElementsByTagName('img'));
array.forEach(img=>{
if (img.src.search('election') === true || img.src.search("Trump") === true)
  { img.setAttribute = ("max-height", "200px;");
      img.src = corgis[Math.floor(Math.random()*corgis.length)];
  }
    else if (img.parentElement.innerHTML.includes("Trump"))
  {img.setAttribute = ("max-height", "200px;");
      img.src = corgis[Math.floor(Math.random()*corgis.length)];
  }

    console.log("corgi");
});}
