// ==UserScript==
// @name         Autolog hours
// @namespace    http://digizent.com/
// @version      0.6
// @description  Autolog ahour after comment
// @author       Digex
// @match        none
// @grant        none
// @include https://app.asana.com/*
// @include https://dashboard.digizent.com/*
// @downloadURL https://update.greasyfork.org/scripts/40223/Autolog%20hours.user.js
// @updateURL https://update.greasyfork.org/scripts/40223/Autolog%20hours.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var body = document.addEventListener("click", addClickEvent, false);
    var task = getUrlParameter('task');

    //IF IS THE DASHBOARD
    if(task){
        var input_task = document.getElementById("taskUrl");
        input_task.setAttribute("value", task);

        setTimeout(function(){
          var logtime_button = document.getElementById("openUrlTask");
          logtime_button.click();
        }, 1000);
    }

    function redirect(){
      var url = "https://dashboard.digizent.com/asana?task="+window.location.href + "/f";
      window.open(url);
    }

    function addClickEvent(event){

      var pos_editor = event.target.className.indexOf('CommentComposerEditor--isFocused');
      var pos_description = event.target.className.indexOf('ql-editor');

      //IF IS ASANA
      if( (pos_editor >= 0) || (pos_description >= 0) ){
        var submit_hour = document.getElementsByClassName('CommentComposerEditor-submitButton');
        submit_hour[0].addEventListener("click", redirect, false);
    }
   }


    function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

})();
