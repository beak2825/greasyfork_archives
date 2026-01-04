// ==UserScript==
// @name Copy google translation result to camel case and copy it to clipboard
// @description google翻訳結果をキャメルケースに変換してクリップボードにコピー
// @version  2.01
// @grant    none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @include https://translate.google.co.jp/*
// @namespace https://greasyfork.org/users/184902
// @downloadURL https://update.greasyfork.org/scripts/367731/Copy%20google%20translation%20result%20to%20camel%20case%20and%20copy%20it%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/367731/Copy%20google%20translation%20result%20to%20camel%20case%20and%20copy%20it%20to%20clipboard.meta.js
// ==/UserScript==

(function ($) {
  
  var active = true;

	var $btnDiv = $("<div>");
  var $translationResult = $('#result_box');
  
  $btnDiv.css("background-color",active ? "lightgreen":"transparent").
				  css("width","14px").
  				css("height","14px").
  				css("margin","4px").
  				css("border","dotted 2px gray").
  				css("border-radius","10px").
  				css("float","left");
  
  $("#gt-res-tools-l").append($btnDiv); 
 

	$btnDiv.click(function(){
    active = !active;
    $btnDiv.css("background-color", active ? "lightblue":"transparent");
  })
  
    var getResult = function(){
      	  return toCamelcase($translationResult.text())
  }
 
  var setClipboard = function(str){

    var ta = document.createElement("textarea")
    ta.value = str
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    ta.parentElement.removeChild(ta)
    
    $btnDiv.css("background-color","lightgreen")

}

var toCamelcase = function(str) {
    if (!str) return str;
     var strs = str.split(/ /),
     len = strs.length;
     if (len <= 1) return str;

     str = strs[0].toLowerCase();
 
    for (var i = 1; i < len; i++) {
        str += strs[i].toLowerCase().replace(/^[a-z]/, function(value) {
            return value.toUpperCase();
        });
    }
 
    return str
};
  
 	const target = document.getElementById("result_box");
	const observer = new MutationObserver((mutations) => {
    if(active)setClipboard(getResult());
  });
  const config = { attributes: true, childList: true, characterData: true };
	observer.observe(target, config);
  
})(jQuery);
