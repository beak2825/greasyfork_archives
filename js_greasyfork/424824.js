// ==UserScript==
// @name        custom profile page rule34.xxx
// @namespace   Violentmonkey Scripts
// @match       https://rule34.xxx/index.php
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.1
// @author      usnkw
// @description 10.4.2021, 17:52:31
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/424824/custom%20profile%20page%20rule34xxx.user.js
// @updateURL https://update.greasyfork.org/scripts/424824/custom%20profile%20page%20rule34xxx.meta.js
// ==/UserScript==


var threadUrl = "https://rule34.xxx/index.php?page=forum&s=view&id=12998&pid=";
var dir = GM_getValue('dir');

$("document").ready(async function() {
  var li = document.createElement("li");
  li.style.cursor = "pointer";
  var a = document.createElement("a");
  a.innerHTML = "Refresh Database";
  a.onclick = updateDb;
  li.appendChild(a);
  document.getElementsByClassName("flat-list")[0].appendChild(li);
  
  if(window.location.href.includes("profil")){
    addView(document.getElementsByTagName("h2")[1].innerText);
  }
});
function addView(userName){
  var div = document.createElement("div");
  for(var i = 0; i < dir.length; i++){
    if(dir[i][0] == userName){
        var text = encodeHTML(dir[i][1]);
        console.log(dir[i][1]);
        var matches = text.match(/(?<=\[).+?(?=\])/g);
        if(matches != null){
        for(var i = 0; i < matches.length; i++){
          var type = matches[i].match(/([a-z]*):(.*)/)[1];
          switch(type){
            case "img":
              var elm = "<img src=\"" + encodeHTML(matches[i].match(/([a-z]*):(.*)/)[2]) +"\" style='height:150px'>"
              text = text.replace("["+matches[i]+"]", elm);
              break;
            case "link":
              var t = encodeHTML(matches[i].match(/([a-z]*):(.*)/)[2]);
              var elm = "<a href=\"" + t +"\">"+t+"</a>"
              text = text.replace("["+matches[i]+"]", elm);
              break;
            case "br":
              var elm = "<br>"
              text = text.replace("["+matches[i]+"]", elm);
              break;
          }
        }
      }
      div.innerHTML = text;
      document.getElementById("content").prepend(div);
      break;
    }
  }
}
async function updateDb(){
  console.log("Fetching!");
  var postCount = await getPostCount();
  for(var i = 0; i <= postCount; i+=15){
    dir = (await fetchPosts(threadUrl + i));
  }
  console.log(dir);
  GM_setValue('dir', dir);
}
async function fetchPosts(url){
  return new Promise(function(resolve, reject) {  
    var ifream = document.createElement("iframe");
    ifream.src = url;
    ifream.onload = function() {
            var author = $("iframe").contents().find(".author a[href]");
            var links = $("iframe").contents().find(".body").find("a[rel='nofollow']");
            for(var i = 0; i < links.length; i++){
              links[i].outerText = links[i].href;
            }   
            var post = $("iframe").contents().find(".body");
            
            var out = [];
            for(var i = 0; i < author.length; i++){
                out.push([author[i].innerHTML, post[i].innerText]);
                ifream.parentNode.removeChild(ifream);
            } 
            resolve(out);
        }
    document.body.appendChild(ifream);
  });
}
async function getPostCount(){
  return new Promise(function(resolve, reject) {  
      var ifream = document.createElement("iframe");
      ifream.src = threadUrl;
      ifream.onload = function() {
            var elm = $("iframe").contents().find("a[alt='last page']")[0];
            if(elm != null){
              resolve(parseInt(/pid=([0-9]*)/gm.exec($("iframe").contents().find("a[alt='last page']")[0].href)[1]));
            }
            resolve(0);
            ifream.parentNode.removeChild(ifream);
        }
      document.body.appendChild(ifream);
  });
}
function encodeHTML(s) { 
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}