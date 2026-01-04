// ==UserScript==
// @name        BeatStars Downloader
// @namespace   BeatStarsDL
// @match       *://www.beatstars.com/*/tracks
// @match       *://beatstars.com/*/tracks
// @grant       none
// @version     1.0
// @author      OliverP
// @description Used for automatically downloading BeatStars content
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/433124/BeatStars%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/433124/BeatStars%20Downloader.meta.js
// ==/UserScript==

/*
-----------------------How to use-----------------------
1. Go into the tracks page of the user you want to download the tracks from
2. Click on "Load tracks" to load all available tracks of the user (the script is scrolling down automatically to do that)
3. Click on Download and wait until it completes
4. A modal will pop-up and allow you to copy the track names and the URLs (in a 2 line per track txt format)
5, Copy it into your downloader of choice or into the provided Python script
--------------------------------------------------------
*/

var my_css = '.modal{display:none;position:fixed;z-index:100000;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,0.4)}.modal-content{position:fixed;bottom:0;background-color:#fefefe;width:100%;-webkit-animation-name:slideIn;-webkit-animation-duration:.4s;animation-name:slideIn;animation-duration:.4s}.close{color:#fff;float:right;font-size:28px;font-weight:700}.close:hover,.close:focus{color:#000;text-decoration:none;cursor:pointer}.modal-header{padding:2px 16px;background-color:#5cb85c;color:#fff}.modal-body{padding:2px 16px}';
var new_sty = document.createElement("style");
new_sty.setAttribute("type", "text/css");
new_sty.appendChild(document.createTextNode(my_css));
document.body.appendChild(new_sty);
document.body.innerHTML += '<div id="myModal" class="modal"><div class="modal-content"><div class="modal-header"><span class="close">&times;</span><h2>Download complete</h2></div><div class="modal-body"><p>Links:</p><textarea id="urllinks_dl" style="font-size: 9px;"></textarea><button id="copydl">Copy</button><span id="copyreport" style="color: green;"></span></div></div></div>';

const checkElement = async selector => {
  while ( document.querySelector(selector) === null) {
    await new Promise( resolve =>  requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector); 
};

function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
}

function copyText(){ //For the URL copying
  var copyText = document.getElementById("urllinks_dl");
  var copyReport = document.getElementById("copyreport");

  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(copyText.value);

  copyReport.innerHTML = "Successfully copied";
}

function download(fileName, fileType, text) {
  var blob = new Blob([text], { type: fileType });

  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}

function preload(){ //Preloads tracks by scrolling until no more load
    (function scroll() {
      if(window.scrollY != window.scrollMaxY){
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        setTimeout(scroll, 1000);
      }else{
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    })();
}

function dlCheck(){ //Starts download
    checkElement('.btn-download').then((selector) => {
      var dlbtn_el = document.getElementsByClassName('btn-download');
      timer = 0;
      (function next() {
        if(dlbtn_el.length-1>timer) { //Until there are downloadable tracks
            console.log((timer+1)+"/"+(dlbtn_el.length-1))
            var musiccnt = document.getElementsByClassName("number ng-star-inserted"); var count = musiccnt.length; for(var i = 0; i < count; i++){ if(musiccnt[i].innerHTML.includes(timer)){ music = musiccnt[i]; } }
            list += "\n"+music.parentNode.parentNode.childNodes[2].children[0].children[0].innerHTML;
            do_download(dlbtn_el[timer], (timer+1), (dlbtn_el.length-1));
            list += "\n";
            timer += 1;
            setTimeout(next, 1000);
        }else{
          if(dlbtn_el.length-1 == timer){ //When the download is finished
            console.log(list);
            document.getElementById("urllinks_dl").innerHTML = list.trim();
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
          }
        }
      })();
  });
}

async function do_download(item, timer, full_length){
    return new Promise((resolve,reject)=>{
      item.click();
      download(timer, full_length)
      resolve();
    });

}

list="" //This list will contain the download links
async function download(timer, full_length){
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 1000));
    var downloadbtn = document.getElementsByClassName("mat-button-wrapper"); var count = downloadbtn.length; for(var i = 0; i < count; i++){ if(downloadbtn[i].innerHTML.includes("Download")){ btn = downloadbtn[i]; } }
    list+=btn.closest('a').href; //Add download link to the list
    var closebtn = document.getElementsByClassName("mat-dialog-title"); var count = closebtn.length; for(var i = 0; i < count; i++){ if(closebtn[i].innerHTML.includes("Free Download")){ closebtn[i].innerHTML += " "+timer+"/"+full_length; btn1 = closebtn[i]; } }
    btn1.parentNode.childNodes[1].click();
    await new Promise(r => setTimeout(r, 3000));

}

window.addEventListener("DOMContentLoaded", function(event) { //Adds the buttons to the site
  checkElement('.title').then((selector) => {
    selector.innerHTML += "<button id='prlbtn'>Load tracks</button><button id='dlbtn'>Download</button>";
    var dlbtn = document.getElementById("dlbtn");
    dlbtn.onclick = function() {
      dlCheck();
    }
    var prlbtn = document.getElementById("prlbtn");
    prlbtn.onclick = function() {
      preload();
    }
    var copydl = document.getElementById("copydl");
    copydl.onclick = function() {
      copyText();
    }
  });
});

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the close button, close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
