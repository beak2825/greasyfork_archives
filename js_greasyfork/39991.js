// ==UserScript==
// @name        Поле имени
// @description ololo
// @namespace   sosach
// @include     http*://2ch.hk/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39991/%D0%9F%D0%BE%D0%BB%D0%B5%20%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/39991/%D0%9F%D0%BE%D0%BB%D0%B5%20%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8.meta.js
// ==/UserScript==
 
$(function(){
  var appendInfo = [
    {$form : $("#postform"), appendFunc: appendNameBlockToPostform},
    {$form : $("#qr-postform"), appendFunc: appendNameBlockToQrPostform}
  ];
 
  appendInfo.forEach(function(info){
    if(info.$form.length === 0){
      return;
    }    
    var $name = info.$form.find("[name=name]");
    var isNameInputExists = ($name.length > 0);
    if(!isNameInputExists){
      if($.isFunction(info.appendFunc)){
        info.appendFunc(info.$form);
        $name = info.$form.find("[name=name]");
      }            
    }
    configureNameInput($name);
  });  
 
  //******************************************************
 
  function appendNameBlockToPostform($form){
    var nameHtml = "<tr class='name'><td class='label desktop'><label for='name'>Имя</label></td><td><input value='' id='name' name='name' size='30' placeholder='Имя' type='text'></td></tr>";    
    $form.find("tr.mail").after(nameHtml);     
  }
 
  function appendNameBlockToQrPostform($form){
    var nameHtml = "<div class='qr-mail'><input name='name' id='qr-name' placeholder='Имя' class='qmail' type='text'></div>";    
    $form.find("div.qr-mail").before(nameHtml);  
  }
 
  //******************************************************
 
  function configureNameInput($name){
      var key = "2ch_name";
      $name.on("input", function(){
        var value = $name.val();
        localStorage.setItem(key, value);
      });
 
      var restoredValue = localStorage.getItem(key);  
      if(restoredValue){
        $name.val(restoredValue);      
      }
  }
 
});