// ==UserScript==
// @name        Directly download image from zerochan.net
// @namespace   https://myanimelist.net/profile/kyoyatempest
// @match       https://www.zerochan.net/*
// @version     2.0
// @author      kyoyacchi
// @description Downloads image when you click to download icon on zerochan.net.
// @license     none
// @icon        https://www.zerochan.net/favicon.ico
// @supportURL  https://github.com/kyoyacchi/zerochan-downloader/issues
// @downloadURL https://update.greasyfork.org/scripts/454049/Directly%20download%20image%20from%20zerochannet.user.js
// @updateURL https://update.greasyfork.org/scripts/454049/Directly%20download%20image%20from%20zerochannet.meta.js
// ==/UserScript==

let urlcik = window.location.href.split("/")[3]
let nan = isNaN(urlcik) ? false : true
window.onload = function (){
/////
	function  toDataURL(url) {
    return fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            return URL.createObjectURL(blob);
        });
  }

  async function downloadImage(url,isimcik) {
        const a = document.createElement("a");
        a.href = await toDataURL(url);
        a.download = isimcik
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  }
/////




  function crumb () {
    let kirinti = document.querySelector(".breadcrumb")
    if (kirinti) {
    kirinti.remove();
      console.log("Removed left top corner button")
    } else {
      return
    }
  }

  crumb();//bonus

  let static = window.location.href.split("/")[2]
    if (static == "www.zerochan.net") {


var buton = document.getElementsByClassName("download-button")[0]



let link = buton.href
let yedek = []
yedek.push(link)
  let name = link.split("/")[3] || "zerochan.png"

  yedek.push(name)


buton.addEventListener("click", function(e) {

  e.preventDefault();
downloadImage(yedek[0],yedek[1])
  console.log(`downloaded image: ${yedek[1]||"??"}`)
  let titl = []
  titl.push(document.title)

  setTimeout(() => {
  document.title = "Image downloaded."
    console.log("I changed title of page,it will be reverted in 10 scs.")
  },500)
  setTimeout(() => {
    document.title = titl[0] || "Refresh page to see original title"
    console.log("I've reverted the page title.")
  },10000)
//console.log("Someone clicked to download button")
}, false);


}
function setLikeCount() {
  var like_count = 0;
  try {
 var  get_count = document.getElementById("favorites").getElementsByClassName("user").length

 } catch(e) {
   like_count = 0
 }
  like_count = get_count || 0
document.querySelector("p:nth-of-type(2)").style.color = "#FFFFFF"

let tmp = []
let boyutvs = document.querySelector("p:nth-of-type(2)").childNodes[0].textContent

tmp.push(boyutvs)

  setTimeout(() => {
    document.querySelector("p:nth-of-type(2)").childNodes[0].textContent = tmp[0] + ` (${like_count} ${like_count > 1? "likes":"like"})`
  },500)



document.querySelector(".fav-button").addEventListener("click",function(e) {
let exists = document.querySelector(".active.fav-button")
if (!exists){
document.querySelector("p:nth-of-type(2)").childNodes[0].textContent = tmp[0] + ` (${like_count+1} ${like_count+1>1?"likes" : "like"})`
} else {
  document.querySelector("p:nth-of-type(2)").childNodes[0].textContent = tmp[0] + ` (${like_count - 1 == "-1" ? 0 : like_count} ${like_count -1 > 1? "likes" :"like"})`
}
})
}
  setLikeCount();
}

