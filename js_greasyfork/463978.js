// ==UserScript==
// @name        ZX downloader
// @include     https://www.zoox*8.com/*
// @description Porn
// @author      blurry
// @version     4
// @namespace https://greasyfork.org/users/1060024
// @downloadURL https://update.greasyfork.org/scripts/463978/ZX%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/463978/ZX%20downloader.meta.js
// ==/UserScript==

/*
    Warning:
    ZX hosts some abuse content. This is against the rules, but it doesn't seem like they care to stop it.

    Installation:
    Requires Violentmonkey extension (or Greasemonkey/Tampermonkey). Adblocker is highly recommended.

    Usage:
    Once installed, public and private vids will automatically display in your browser's built in video player. To
    download a video, right click on it and select "save video as".

    As of version 4, private albums can also be downloaded.
*/

// https://stackoverflow.com/a/60467595
function md5(inputString) {
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}

if (document.URL.startsWith("https://www.zoox" + "18.com/video/")) {
  var id = Number(document.URL.split("/")[4]);
  var quality = "sd";
  if (id >= 30370) {
    quality = "475";
  }
  var hash = md5(String(id)).substring(11, 31);
  var timestamp = String(Date.now());
  var url = 'https://www.zoox' + `18.com/vsrc/${timestamp}/${quality}/${hash}`;

  var newVideoDiv = `<div><video src="${url}" controls></video></div>`;
  var video = document.querySelector("#vjsplayer");
  if (video) {
    // normal video page
    var videoDiv = video.parentNode.parentNode.parentNode;
    videoDiv.insertAdjacentHTML("beforebegin", newVideoDiv);
    videoDiv.remove();
  }
  else {
    // private video page
    var text = document.querySelector("span.text-danger");
    text.insertAdjacentHTML("afterend", "<br><br>" + newVideoDiv);
  }
}

// algorithm for finding private photo IDs:
// 1: loop: decrement private album ID by 1 until the nearest public album is found (keeping track of encountered albums).
// 2: extract photo ID from public album page.
// 3: increment public photo ID by the number of photos from the albums in the path from step 1.
// 4: loop: check if the private ID was found. if not, increment by 1 until it is. (this step accounts for deleted albums or albums for which the number of photos is unknown.)

if (document.URL.startsWith("https://www.zoox" + "18.com/album/")) {
  var text = document.querySelector("div.text-danger");
  var parser = new DOMParser();

  function log(string) {
    text.innerText += string + "\n";
  }

  // find the nearest public album and return the path to it as a list of album info (IDs and names)
  function fetchAlbums(startID, albumPath=[]) {
    log(`Trying album ${startID}...`);
    return fetch("https://www.zoox" + `18.com/album/${startID}`, {mode: "same-origin"}).then(function(response){
      if (!response.ok) { return null; }
      return response.text();
    }).then(function(responseText){
      if (responseText) {
        var doc = parser.parseFromString(responseText, "text/html");
        var albumName = doc.querySelector(".col-md-8 .panel-heading .pull-left").innerText.trim();
        var imgs = doc.querySelectorAll('img[id^="album_photo"]');
        if (imgs.length > 0) {
          // public album
          albumPath.push({
            id: startID,
            name: albumName,
            lastPhotoID: Number(imgs[imgs.length - 1].id.split("_")[2])
          });
          return albumPath;
        }
        else {
          // private album
          albumPath.push({
            id: startID,
            name: albumName
          });
        }
      }
      return fetchAlbums(startID - 1, albumPath);
    });
  }

  // try to get the number of images in each album through search
  function fetchAlbumInfo(albumPath, i=0, photoCount=0) {
    if (albumPath.length === 0) { return Promise.resolve(0); }
    var album = albumPath[i];
    log(`Trying to get info for ${album.id}...`);
    var albumName = encodeURIComponent(album.name);
    var albumID = album.id;
    return fetch("https://www.zoox" + `18.com/search/photos?search_query=${albumName}`, {mode: "same-origin"}).then(function(response){
      if (!response.ok) { return null; }
      return response.text();
    }).then(function(responseText){
      if (responseText) {
        var doc = parser.parseFromString(responseText, "text/html");
        var imgs = doc.querySelectorAll('img[src^="/media/albums"]');
        for (var img of imgs) {
          var id = Number(img.src.split("/")[5].split(".")[0]);
          if (id === albumID) {
            photoCount += Number(img.parentNode.parentNode.parentNode.querySelector(".video-views").innerText.trim().split(" ")[0]);
            break;
          }
        }
      }
      if (i !== albumPath.length - 1) {
        return fetchAlbumInfo(albumPath, i + 1, photoCount);
      }
      else {
        return photoCount;
      }
    });
  }

  function findPrivatePhoto(closestPhotoID, privateAlbumName) {
    log(`Trying photo ${closestPhotoID}...`);
    return fetch("https://www.zoox" + `18.com/photo/${closestPhotoID}`, {mode: "same-origin"}).then(function(response){
      if (!response.ok) { return null; }
      return response.text();
    }).then(function(responseText){
      if (responseText) {
        var doc = parser.parseFromString(responseText, "text/html");
        var albumTitleDiv = doc.querySelector(".col-md-8 .panel-heading .pull-left");
        var thisAlbumName = albumTitleDiv.innerText.trim().substring(13);
        if (thisAlbumName === privateAlbumName) { return closestPhotoID; }
      }
      return findPrivatePhoto(closestPhotoID + 1, privateAlbumName);
    });
  }

  function displayPhotos(startID, photoCount) {
    var panelBody = text.parentNode;
    text.remove();
    var html = '<div class="row">';
    for (var i = 0; i < photoCount; i++) {
      var id = startID + i;
      html += `
        <div class="col-sm-4 m-t-15">
          <a href="/media/photos/${id}.jpg">
            <div> <img src="/media/photos/tmb/${id}.jpg" class="img-responsive"> </div>
          </a>
        </div>
      `;
    }
    html += "</div>";
    panelBody.insertAdjacentHTML("afterbegin", html);
  }

  if (text) {
    if (confirm("Get private images from this album? It can take a minute.")) {
      text.innerText = "";
      var albumID = Number(document.URL.split("/")[4]);
      var albumName = document.querySelector(".col-md-8 .panel-heading .pull-left").innerText.trim();
      fetchAlbums(albumID - 1).then(function(albumPath){
        // this is the ID of the last photo of the nearest public album
        var closestPhotoID = albumPath[albumPath.length - 1].lastPhotoID;
        closestPhotoID++;
        // the photo count of the public album has already been accounted for
        albumPath.pop();
        return fetchAlbumInfo(albumPath).then(function(photoCount){
          closestPhotoID += photoCount;
          return findPrivatePhoto(closestPhotoID, albumName).then(function(privatePhotoID){
            log("Got private ID, displaying photos...");
            var thisAlbum = [{id: albumID, name: albumName}];
            return fetchAlbumInfo(thisAlbum).then(function(photoCount){
              if (!photoCount) { photoCount = 21; }
              displayPhotos(privatePhotoID, photoCount);
            });
          });
        });
      }).catch(function(error){
        console.log(error);
        log("Error!");
      });
    }
  }
}

// remove blur on private images

var privateVidImgs = document.querySelectorAll(".img-private");
for (var img of privateVidImgs) {
  img.classList.remove("img-private");
}