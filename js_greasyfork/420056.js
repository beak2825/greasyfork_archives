// ==UserScript==
// @name         女神看图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  绅士专用
// @author       tomcat
// @match        https://www.nvshens.org/g/*/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420056/%E5%A5%B3%E7%A5%9E%E7%9C%8B%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/420056/%E5%A5%B3%E7%A5%9E%E7%9C%8B%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
var totalPage = 0
var num = 0
const baseUrl = document.domain
var url = document.URL
var baseImagUrl = "";
var imagAlt = ""

getImageUrl();
getImageList();


function getImageList() {
  //获取所有总的分页
  const totalImg = $("#dinfo").children("span").text()
  num = parseInt(totalImg);
  totalPage = num / 3;
  //获取当前的域名

  var urls = new Array()
  var pageArray = $("#pages").children("a")
  var pageMap = new Map()
  for (let i = 1; i < pageArray.length - 1; i++) {
    const element = pageArray[i];
    pageMap.set(parseInt(element.text), element.href)
  }

  var list = url.split("/")
  for (let i = 1; i <= totalPage; i++) {
    urls[i - 1] = "https://" + baseUrl + "/" + list[3] + "/" + list[4] + "/" + i + ".html"
  }
  //ajax
  var t = ajaxGet(urls[0])
  // imageUrl()

}

function ajaxGet(url) {
  console.log(url)
  $("#hgallery > img").remove()
  $("#pages").hide()
  $("#hgallery").append(imageUrl)
  imagebox()
  // $.get(url, function (result) {

  //
  // });
}


function imageUrl() {
  var urls = ""
  var url = ""
  for (let i = 0; i < num; i++) {
    if (i == 0) {
      console.log(baseImagUrl)
      url = baseImagUrl + i + ".jpg"
    } else {
      url = baseImagUrl + ("000" + i).slice(-3) + ".jpg"
    }
    urls += '<div class=imagebox >  <span class="text-size"> ' + url + ' </span> <br/> <img src="' + url + '" alt="' + imagAlt + "_" + i + '" loading="lazy"> </div>'

  }
  return urls
}

function copyHtmlLink(e) {
  var id = e.getAttribute("value")
  console.log(id)
}


function imagebox() {
  $(".gallery_wrapper").css({
    "margin-top": "50px",
  })
  $(".text-size").css({
    "font-size": 20,
    "color": "#3a2f2f",
  })
  $(".yalayi_box").hide()
  $(".footer_bottom").hide()

  $(".suggestWrapper.clearfix").css({
    "margin-top": 200
  })
}



function getImageUrl() {
  var imgArray = $(".gallery_wrapper").children("ul").find("img")
  imagAlt = imgArray[1].alt.split("_")[0];
  var tmp = imgArray[1].src.split("/")
  for (let i = 0; i < tmp.length - 1; i++) {
    const element = tmp[i];
    baseImagUrl += element + "/"
  }
}

})();