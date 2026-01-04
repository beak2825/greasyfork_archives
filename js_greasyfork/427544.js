// ==UserScript==
// @name        follow page
// @namespace   Violentmonkey Scripts
// @match       *://rule34.xxx/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.8
// @author      usnkw
// @description 10.4.2021, 17:52:31
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/427544/follow%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/427544/follow%20page.meta.js
// ==/UserScript==

var followList = [];
var newList = [];
var a = null;
var auto = false;

$("document").ready(async function() {
  if ( window.location == window.parent.location ) {
    var tags = /tags=(.*)/gm.exec(document.location.href) == null ? null : /tags=(.*)/gm.exec(document.location.href)[1];
    if(tags == null) return;
    if(GM_getValue('followList') == undefined){ GM_setValue('followList', []);}
    if(GM_getValue('newList') == undefined){ GM_setValue('newList', []);}
    a = document.createElement("a");
    followList = GM_getValue('followList');
    newList = GM_getValue('newList');
    tags = tags.replace('+', ' ');
    tags = tags.replace('%20', ' ');
    for(var i = 0; i < tags.length; i++){
      if(followList.some( e => e['tagName'].trim() == tags.trim())){
          a.style.color = "red";
      }
        console.log('je');console.log(newList);console.log(tags);
      if(newList.some( e => e['tagName'].trim() == tags.trim())){
        newList = newList.filter( el => el.tagName.trim() != tags.trim());
        followList = followList.filter( el => el.tagName.trim() != tags.trim());
        followTag(); // remove the last saved post and refollow to refresh the post that is compared to
        GM_setValue('newList', newList);
        console.log('newList', newList);
      }
    }
    a.innerHTML = " <3 ";
    a.style.cursor = "pointer";
    a.onclick = followTag;
    document.getElementsByClassName("awesomplete")[0].appendChild(a);

    var re = document.createElement("a");
    re.innerHTML = " look for news ";
    re.style.cursor = "pointer";
    re.onclick = checkForNewPosts;
    document.getElementsByClassName("awesomplete")[0].appendChild(re);

    re = document.createElement("a");
    re.innerHTML = "<br >exprot ";
    re.style.cursor = "pointer";
    re.onclick = exportFav;
    document.getElementsByClassName("awesomplete")[0].appendChild(re);

    re = document.createElement("a");
    re.innerHTML = "<br> import ";
    re.style.cursor = "pointer";
    re.onclick = importFav;
    document.getElementsByClassName("awesomplete")[0].appendChild(re);

    re = document.createElement("a");
    re.innerHTML = "next";
    re.style.cursor = "pointer";
    re.onclick = next;
    document.getElementsByClassName("awesomplete")[0].appendChild(re);

    re = document.createElement("a");
    re.innerHTML = "<br> random Tag";
    re.style.cursor = "pointer";
    re.onclick = random;
    document.getElementsByClassName("awesomplete")[0].appendChild(re);

    re = document.createElement("a");
    re.innerHTML = "<br> search for all Tags";
    re.style.cursor = "pointer";
    re.onclick = searchForAll;
    document.getElementsByClassName("awesomplete")[0].appendChild(re);

    refreshSidebar();

    if(auto){
      checkForNewPosts();
      setInterval(() => { checkForNewPosts(); refreshSidebar();}, 600000);
    }
  }
});
function exportFav(){
    download(JSON.stringify(followList), 'followList', '.txt')
}
function importFav(){
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
       var file = e.target.files[0];
       var reader = new FileReader();
       reader.readAsText(file,'UTF-8');
       reader.onload = readerEvent => {
          var content = readerEvent.target.result;
          followList = JSON.parse(content);
          GM_setValue('followList', followList);
          refreshSidebar();
       }
    }

    input.click();
}
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
async function refreshSidebar(){
  var sideElm = document.getElementsByClassName("sidebarRight")[0] == undefined? document.getElementsByClassName("content")[0] : document.getElementsByClassName("sidebarRight")[0];
  sideElm.innerHTML = "";
  followList.sort(function(a, b){
      var nameA=a.tagName.toLowerCase(), nameB=b.tagName.toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
  })

  for(var i = 0; i < followList.length; i++){
    var tag = document.createElement("a");
    tag.innerHTML = followList[i].tagName + "<br>";
    tag.style.displayStyle = "inline";
    tag.style.padding = ".3em 1em .3em 1em";
    tag.style.lineHeight = "3";
    tag.style.cursor = "pointer";
    tag.style.backgroundColor = "#f55c51"
    tag.style.width = "100%";
    tag.style.borderRadius = "10px";
    tag.href = "https://rule34.xxx/index.php?page=post&s=list&tags=" + followList[i]["tagName"];
    if(newList.some( e => e['tagName'] == followList[i]["tagName"])){
       tag.style.backgroundColor = "#b6eb1a";
       tag.style.color = "#000000";
    }
    sideElm.appendChild(tag);
  }
}
async function checkForNewPosts(){
  for(var i = 0; i < followList.length; i++){
    a.innerHTML = "<3" + " checking: " + followList[i]["tagName"] + "<br>";
    var postId = await getFirstPostId("https://rule34.xxx/index.php?page=post&s=list&tags=" + followList[i]["tagName"]);
    console.log(followList[i]["tagName"] + "  : ", postId, followList[i]["postId"]);
    if(postId != followList[i]["postId"] && !(newList.some(e => e['tagName'] == followList[i]['tagName']))){
      newList.push({"tagName": followList[i]["tagName"], "postId":postId});
      GM_setValue('newList', newList);
      console.log('newList', newList);
    }
  }
  a.innerHTML = "<3";
  refreshSidebar();
}
async function followTag(){
  var tagname = document.getElementsByName("tags")[0].value;
  var festPostId = document.getElementsByClassName("thumb")[0] == undefined ? 0 : document.getElementsByClassName("thumb")[0].id;

  if(!followList.some( e => e['tagName'].trim() == tagname.trim())){
    followList.push({"tagName":tagname, "postId":festPostId});
    GM_setValue('followList', followList);
  }else{
    followList = followList.filter( el => el.tagName.trim() != tagname.trim());
    GM_setValue('followList', followList);
  }
  a.style.color = a.style.color == "red" ? "#ffffff" : "red";
  refreshSidebar();
}
async function getFirstPostId(url){
  return new Promise(function(resolve, reject) {
      var ifream = document.createElement("iframe");
      ifream.src = url;
      ifream.onload = function() {
          var elm = $("iframe").contents().find("span[class='thumb']")[0];
          resolve(elm ==  undefined ? 0 : elm.id);
          ifream.parentNode.removeChild(ifream);
      }
      document.body.appendChild(ifream);
  });
}
async function next(){
    console.log(newList[0]);
    location.href = 'https://rule34.xxx/index.php?page=post&s=list&tags=' + newList[0].tagName;
}
async function random(){
    location.href = 'https://rule34.xxx/index.php?page=post&s=list&tags=' + followList[Math.floor(Math.random() * followList.length)].tagName;
}
async function searchForAll(){
    var allTags = "( " + followList.reduce( (x,i) => x += i.tagName.replace(" ", " ~ ") + " ~ " , "") + " )";
    console.log(allTags);
    location.href = 'https://rule34.xxx/index.php?page=post&s=list&tags=' + allTags;
}