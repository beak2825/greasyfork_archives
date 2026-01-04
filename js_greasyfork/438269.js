// ==UserScript==
// @name        better search rule34
// @namespace   Violentmonkey Scripts
// @match       https://rule34.xxx/index.php
// @grant       none
// @version     1.0
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @author      -
// @description 08.01.2022, 13:40:04
// @downloadURL https://update.greasyfork.org/scripts/438269/better%20search%20rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/438269/better%20search%20rule34.meta.js
// ==/UserScript==

async function main(){
    console.log("better search rule34");
    
  
    var tags = $("input[name='tags']").val().split(' ');
    
    for(var i = 0; i < tags.length; i++){
      
      if(tags[i].split("||").length > 1){
        $("div.image-list").empty()
        
        console.log(tags[i].split("||"));
        
        var normalTags = "";
        for(var j = 0; j < tags.length; j++){
          if(tags[j].includes("||")){
            continue;
          }
          normalTags += tags[j] + " ";
        }
        console.log(normalTags);
        
        for(var x = 0; x < tags[i].split("||").length; x++){
          var tag = normalTags + tags[i].split("||")[x];
          var postCount = await getPostCount(tag);
          console.log("POST COUNT: " + tag, postCount);
          
          var div = document.createElement("div");
          var content = document.createElement("div");
          content.id = tag;
            
          var header = document.createElement("h3");
          header.innerHTML = tag + " >> " + postCount;
          header.style.backgroundColor = "#e74c3c";
          header.onclick = function(){
            if(this.nextSibling.style.display != "none"){this.nextSibling.style.display = "none"}else{this.nextSibling.style.display = "block";}
          };
          
          div.appendChild(header);
          div.appendChild(content);
          document.getElementsByClassName("content")[0].appendChild(div);
          
          var imgDir = [];
          for(var k = 0; k <= postCount; k += 42){
            //addImagesFromUrl("https://rule34.xxx/index.php?page=post&s=list&tags=" + tag + "&pid=" + k, content);
            imgDir.push(getImagesFromUrl("https://rule34.xxx/index.php?page=post&s=list&tags=" + tag + "&pid=" + k));
            header.innerHTML = tag + " >> " + k + " loading...";
          }
          const result = await Promise.all(imgDir);
          console.log(result);
          header.innerHTML = tag + " >> " + k + " Done";
          for(var k = 0; k < result.length; k++){
            for(var j = 0; j < result[k].images.length; j++){
              content.appendChild(result[k].images[j]);
            }
          }
        }
        
      }
    }
   
    /*
    for(var i = 0; i < tags.length; i++){
      console.log(tags[i]);
      console.log(tags);
      
      var postCount = await getPostCount(tags[i]);
      console.log(postCount);
      for(var j = 0; j <= postCount; j += 42){
        console.log("requesting: ", "https://rule34.xxx/index.php?page=post&s=list&tags=" + tags[i] + "&pid=" + j);
        addImagesFromUrl("https://rule34.xxx/index.php?page=post&s=list&tags=" + tags[i] + "&pid=" + j);
        await sleep(10000);
      }
    }*/
};

async function getPostCount(tags){
    var postCount = 0;
    var iframe = document.createElement("iframe");
    iframe.id = "ifream";
    iframe.src = "https://rule34.xxx/index.php?page=post&s=list&tags=" + tags;
    iframe.onload = function() {
      postCount = $("#ifream").contents().find('a[alt="last page"]')[0].href.split("pid=")[1];
      iframe.parentNode.removeChild(iframe);
    }
    
    document.body.appendChild(iframe);
  
    while(postCount == 0){
      await sleep(100);
    }
    return postCount;
}
function addImagesFromUrl(url, element = null){
    if(element == null){element = document.getElementsByClassName("content")[0]};
    var ifream = document.createElement("iframe");
    ifream.src = url;
    ifream.onload = function() {
        var images = ifream.contentWindow.document.getElementsByTagName("img");
        var header = document.createElement("h6");
        header.innerHTML = url;
        element.appendChild(header, document.getElementById("paginator"));
      
        /*for(i = images.length-1; i >= 0; i--){
            if(images[i].parentNode.parentNode.tagName == "SPAN"){
              document.getElementById("paginator").parentNode.insertBefore(images[i].parentNode.parentNode, document.getElementById("paginator"));
            }
        }*/
      
       for(i = 0; i < images.length; i++){
            if(images[i].parentNode.parentNode.tagName == "SPAN"){
              element.appendChild(images[i].parentNode.parentNode.cloneNode(true), document.getElementById("paginator"));
            }
        }
        ifream.parentNode.removeChild(ifream);
    }
    document.body.appendChild(ifream);
}
async function getImagesFromUrl(url){
  var outimages = [];
  var done = false;
  var ifream = document.createElement("iframe");
    ifream.src = url;
    ifream.onload = function() {
        var images = ifream.contentWindow.document.getElementsByTagName("img");
      
       for(i = 0; i < images.length; i++){
            if(images[i].parentNode.parentNode.tagName == "SPAN"){
              outimages.push(images[i].parentNode.parentNode.cloneNode(true));
            }
        }
        done = true;
        ifream.parentNode.removeChild(ifream);
    }
    document.body.appendChild(ifream);
    while(done == false){
        await sleep(100);
    }
    return {pid : url.split('&pid=')[1], 
            images : outimages};
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
$( document ).ready(function() {
  if ( window.location == window.parent.location ){  main(); }
});



