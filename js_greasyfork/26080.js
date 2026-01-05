// ==UserScript==
// @name        tower
// @namespace   sbw@sbw.so
// @description 方便的把任务指给参与讨论的某个人
// @include     https://tower.im/*
// @version     1.1
// @grant       unsafeWindow
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26080/tower.user.js
// @updateURL https://update.greasyfork.org/scripts/26080/tower.meta.js
// ==/UserScript==

// var $ = unsafeWindow.$;
var members = unsafeWindow.members = {};
var assignee = unsafeWindow.assignee = "";

(function() {
  
  function contains(name)
  {
    return members[name] !== undefined;
  }
  
  function listUsers()
  {
    $("a[class='author']").each(function() {
      var name = $(this).html();
      
      if (!contains(name)) {
        var url = $(this).attr("href");
        var uid = url.match(/members\/(\w+)/)[1];
      
        members[name] = uid;
      }
    });
    
    for (v in members) {
      console.log(v);
      if (v !== assignee)
        createButton(v, members[v]);
    }
  }
  
  function createButton(name, uid)
  {
    var button = document.createElement("button");
    button.innerText = name;
    button.onclick = assignUser;
    $(button).attr("uid", uid);
    $(button).css({
      "padding" : "0 10px",
      "margin" : "0 5px 0 5px",
      "color" : "#666",
      "background-color" : "#eee",
      "border" : "none",
      "border-radius" : "20px",
      "height" : "20px",
      "line-height" : "1.6",
      "vertical-align" : "baseline",
      "cursor" : "pointer",
      "font-size" : "100%"
    });
    
    $(".todo-wrap").append(button);
  }
  
  function csrfToken()
  {
    return $("meta[name='csrf-token']").attr("content");
  }
  
  function connGuid()
  {
    return $("input[id='conn-guid']").val();
  }
  
  function test()
  {
    console.log("aaa", connGuid());
  }
  
  function assignUser()
  {
    var uid = $(this).attr("uid");
    
    $.ajax({
      url : location.href + "edit",
      type : "post",
      headers : {
        "X-Requested-With" : "XMLHttpRequest",
        "X-CSRF-Token" : csrfToken()
      },
      data : 
      {
        "conn_guid" : connGuid(),
        "assignee_guid" : uid
      },
      dataType : "json",
      success : function(data) {
//         console.log(data);
        location.reload();
      }
    });
  }
  
  function findAssignee()
  {
    assignee = $.trim($(".assignee").html());
  }
  
  function init()
  {
    var button = document.createElement("button");
    button.innerText = "✓";
    button.onclick = test;
    
    $(button).css({
      "height" : "30px",
      "color" : "black",
      "padding" : "0"
    });
    
    $(".todo-wrap").append(button);
  }
  
//   document.addEventListener('hashchange', function() {
//   }, false);
  
//   unsafeWindow.history.pushState = function() {
//     alert(/x/);
//   }
  
//   unsafeWindow.$(document).on("pjax:end", exportFunction(function() {
// 	console.log('test @grant GM_* 1');
// }, unsafeWindow));
//   unsafeWindow.$(window).on('pushstate', function() {
// 	console.log('test @grant none 2');
// });
  
  
//   (function (old) {
//     unsafeWindow.history.pushState = function () {
//         old.apply(unsafeWindow.history, arguments);
//         alert(unsafeWindow.location.href);
//     }
// })(unsafeWindow.history.pushState);
  
//   function hackPushState(a, b, c) {
//     alert(a + b + c);
//     alert(unsafeWindow.history.pushStateHacked);
//     unsafeWindow.history.pushStateHacked(a, b, c);
//   }
  
//   unsafeWindow.history.pushStateHacked = unsafeWindow.history.pushState;
//   unsafeWindow.history.pushState = exportFunction(hackPushState, unsafeWindow);
  
//   waitForKeyElements('div#page-todo', function() {alert(/cc/);});
  
//   document.addEventListener('DOMContentLoaded', function() {
//     init();
  
  $(document).on('DOMNodeInserted', function(e) {
//     alert($(e.target).hasClass('assignee'));
    
//     console.log(e.toSource());
    
    if (!$(".todo-wrap > button").length)
    {
        //alert(/x/);
        members = {};
        findAssignee();
        listUsers();
    }
  });
    
//     unsafeWindow.onpopstate = function(e) {
//       alert(e.state);
//       alert(location.href);
//     }
  
//   $(unsafeWindow).on('popstate', function() {
//     console.log(document.href);
//     alert(/x/);
//   });
//     alert(/a/);
//   }, false);
//     alert(location.href);
})();