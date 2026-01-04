// ==UserScript==
// @name panciAutoLoad
// @namespace Violentmonkey Scripts
// @match http://www.gssy.cc/*
// @grant none
// @description www.gssy.cc 动漫自动加载当前章节
// @version 0.0.1.20190214055623
// @downloadURL https://update.greasyfork.org/scripts/377738/panciAutoLoad.user.js
// @updateURL https://update.greasyfork.org/scripts/377738/panciAutoLoad.meta.js
// ==/UserScript==

var baseUrl = document.location.toString().match(/http:\/\/www.gssy.cc\/[0-9]+/);
var maxPage = 0;
var currentPage = 0;

var re = new RegExp("<img.+/>","g");

$(function(){
    console.log("ready");
	pageNumbers = $(".page-numbers");
	maxPage  = parseInt(pageNumbers[pageNumbers.length - 2].innerHTML);
	currentPage = parseInt($(".current")[0].innerText);
    getNextPage();
});

function insertImage(data){
  //console.log(data);
  plist = data.match(re);
  appstr = '';
  for(index = 2;index < plist.length; index++){
    appstr = appstr + plist[index];
  }
  $("#image_div>p:last").append("<p>当前加载 第" + currentPage + "页内容</p>");
  $("#image_div>p:last").append("<p>" + appstr + "</p>");
  $("#image_div>p:last").append("<p>完成加载 第" + currentPage + "页内容</p>");
  getNextPage();
}

function getNextPage(){
  currentPage++;
  if(currentPage > maxPage) {
    $("#image_div>p:last").append("<p>完成全部加载内容</p>");
    return;
  }
  targetUrl = baseUrl + '/' + currentPage;
  console.log("loading "+ targetUrl);
  $.ajax({
      url: targetUrl,
      data: {
      },
      type: 'GET',
      success: insertImage,
  });
}