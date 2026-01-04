// ==UserScript==
// @name Aternos Ad & Warning Remove
// @namespace AternosAd
// @include https://aternos.org/*
// @grant none
// @description Remove all ads and the warning popup in Aternos Panel.
// @version 0.0.1.20210210085247
// @downloadURL https://update.greasyfork.org/scripts/416022/Aternos%20Ad%20%20Warning%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/416022/Aternos%20Ad%20%20Warning%20Remove.meta.js
// ==/UserScript==


$("head").append(`
<style>
    .ad, .ad-replacement, .header-ad-link{
        display: none !important;
        position: fixed !important;
        right: 1000% !important;
        bottom: 9999% !important;
        margin-top: -93069% !important;
        margin-left: 123945% !important;
        height: 0% !important;
        width: 0% !important;
    }
}
</style>
`);

$(".ad").remove()
$(".ad-replacement").remove();
$(".header-ad-link").remove();


Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};




function checkPrevent(f){
  var fs = (f).toString();
  var isPrevent = fs.includes("lastUserAction") || fs.includes("none") || fs.includes("reportDetection") || fs.includes("r.event.add(this,b,e,d,c)")
  //console.log(fs, isPrevent);
  return isPrevent;
}


var setTimeout = window.setTimeout.clone();
window.setTimeout = function(f, t){
  if(checkPrevent(f)){
    f();
    return;
  }
  setTimeout(f, t);
};


var setInterval = window.setInterval.clone();
window.setInterval = function(f, t){
  if(checkPrevent(f)){
    return;
  }
  setInterval(f, t);
};


var realEach = $.each.clone();
$.each = function(obj, f){
  if(checkPrevent(f)){
    return;
  }
  realEach(obj, f);
};
$(".header, .body, header, body").show();

var appendTo = "appendTo" + Math.floor(Math.random() * 92736036576);
console.log(appendTo);

$.fn[appendTo] = $.fn.appendTo.clone();
$.fn.appendTo = function(to){
  if($(this).parent(".page-content").length > 0 || $(this).parent(".content").length > 0 || $(this).parent(".body").length > 0 || $(this).parent(".header").length > 0){
    return;
  }
  console.log($(this), $(this).parent());
  eval(`this.${appendTo}(to)`);
};

$(document).ready(function(){
  $("div[style]").each((index, each) => {
    if($(each).css("background-color") == "rgb(246, 36, 81)"){
      console.log($(each));
      $(each).remove();
    }
  });
});

