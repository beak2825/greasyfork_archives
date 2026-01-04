// ==UserScript==
// @name         Anti-410-v2
// @version      0.3
// @description  Script pour crypter des messages.
// @author       IngenieurJVC
// @match        http://www.jeuxvideo.com/forums/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @grant        GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/470078
// @downloadURL https://update.greasyfork.org/scripts/398816/Anti-410-v2.user.js
// @updateURL https://update.greasyfork.org/scripts/398816/Anti-410-v2.meta.js
// ==/UserScript==

function printMsg(Message_){
    console.log("[Anti 410 v2] " + Message_);
}

function uploadString(String_){
  
  $.ajax({
      url:"https://api.myjson.com/bins",
      type:"POST",
      data:'{"message":"' + String_ + '"}',
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: function(data, textStatus, jqXHR){
        printMsg("Message envoyé à l'api avec succes !")
        var url = data.uri.split("/")[4];
        printMsg(url);
        
        $("#message_topic").val($("#message_topic").val() + url);
      }
  }); 
  
}

function pSet(Elem_, Code_){
      $.getJSON("https://api.myjson.com/bins/" + Code_, function(data){
        var Message = data.message;
        if(Message){
          
          printMsg("Texte décode avec succès : " + Message);
          
          Elem_.innerHTML = Elem_.innerHTML.replace(Code_, "<b style='color: red'>" + Message + "</b>");
        }
      });
}

(function() {
  
/*
                 _   _        _  _  __  ___         ___  
     /\         | | (_)      | || |/_ |/ _ \       |__ \ 
    /  \   _ __ | |_ _ ______| || |_| | | | | __   __ ) |
   / /\ \ | '_ \| __| |______|__   _| | | | | \ \ / // / 
  / ____ \| | | | |_| |         | | | | |_| |  \ V // /_ 
 /_/    \_\_| |_|\__|_|         |_| |_|\___/    \_/|____|
 By IngenieurJVC - 2020
*/

  
  //----- Création de l'UI -----//

  var bloc = document.getElementsByClassName("col-md-12 bloc-editor-forum")[0];
  
  if(bloc){
    var btn_crypt = document.createElement("input");
    btn_crypt.type = "BUTTON";
    btn_crypt.value = "Ajouter un texte crypté";
    btn_crypt.className = "btn btn-poster-msg datalayer-push js-post-message";
    btn_crypt.onclick = function(){
      var r = window.prompt("Que voulez vous ajouter ?", "");
      if(r){
        uploadString(r);
      }
    }
    bloc.appendChild(btn_crypt);
  }
  
  //----- Decryptage des posts -----//
  var posts = document.getElementsByClassName("txt-msg  text-enrichi-forum ");
  for(var i = 0; i < posts.length; ++i){
    var PE = posts[i];
    if(posts[i].getElementsByTagName("p").length > 0){
      var Post_S = posts[i].innerText.replace(/\n/g, " ");

      var S = Post_S.split(" ");
      
      for(var k = 0; k < S.length; k++){

        if(S[k].length > 4 && S[k].length < 7){
          pSet(PE, S[k]);
        }

      }
    }
 
    
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
})();