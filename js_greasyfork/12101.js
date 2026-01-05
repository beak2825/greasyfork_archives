// ==UserScript==
// @name        mrcurl
// @namespace   Mrcomputer1
// @description Short links for Scratch
// @include     https://scratch.mit.edu/*
// @include     http://scratch.mit.edu/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12101/mrcurl.user.js
// @updateURL https://update.greasyfork.org/scripts/12101/mrcurl.meta.js
// ==/UserScript==
$(document).ready(function(){
  var path = document.location.pathname.split("/");
  //alert(path[1] + path[2]);
  if(path[1] == "discuss" && path[2] == "topic"){
    $(".postfootright").each(function(){
      var postlink = $(this).parent().parent().find(".box-head").find("a").attr("href");
      var postid = postlink.split("/")[3];
      var topicid = path[3];
      //alert(postlink + postid);
      postid = postid.replace(/\//g, "");
      $(this).find("ul").append("<li class='postquote'> | <a href='#' id='sharebtn" + postid + "'>Share</a>" +
                                "<div id='share" + postid + "' style='display:none;position:absolute;bottom:5px;background-color:lightgrey;color:black;right:0px'><h1>Short Link</h1><br>Link to this post<br><input type='text' class='short' value='http://mrcurl.cf/?p=" + postid + "' readonly><br>Link to this topic<br><input type='text' class='short' value='http://mrcurl.cf/?t=" + topicid + "' readonly><br><a href='#' id='close" + postid + "'>Close</a></div></a>" +
                                "</li>");
      $("#sharebtn" + postid).click(function(){
        $("#share" + postid).show();
      });
      $("#close" + postid).click(function(){
        $("#share" + postid).hide();
      });
    });
    $(".short").focus(function() { $(this).select(); } );
  }else if(path[1] == "studios"){
    var studioid = path[2];
    $("#tabs").append("<li><a href='#' id='share'>Share<div id='sharedialog' style='display:none;position:absolutel;bottom:5px;background-color:lightgrey;color:black;right:0px'><h1>Short Link</h1><br>Link to this studio<br><input type='text' class='short' value='http://mrcurl.cf/?s=" + studioid + "' readonly><br><a href='#' id='close'>Close</a></div></a></li>");
    $(".short").focus(function() { $(this).select(); } );
    $("#share").click(function(){ 
      $("#sharedialog").show(); 
    });
    $("#close").click(function(){ 
      $("#sharedialog").hide(); 
    });
  }else if(path[1] == "projects"){
    var projectid = path[2];
    $("#link-textarea").val("http://mrcurl.cf/?pr=" + projectid);
    $("#link-textarea").attr("class", "short");
    $(".short").focus(function() { $(this).select(); } );
  }else if(path[1] == "users"){
    var userid = path[2];
    $(".header-text").find("h2").html($(".header-text").find("h2").html() + "<a href='#' id='share'>[Share]<div id='sharedialog' style='display:none;position:absolute;bottom:5px;background-color:lightgrey;color:black;right:0px'><h1>Short Link</h1><br>Link to this user<br><input type='text' class='short' value='http://mrcurl.cf/?u=" + userid + "' readonly><br><a href='#' id='close'>Close</a></div></a>");
    $(".short").focus(function() { $(this).select(); } );
    $("#share").click(function(){ 
      $("#sharedialog").show(); 
    });
    $("#close").click(function(){ 
      $("#sharedialog").hide(); 
    });
  }

});
