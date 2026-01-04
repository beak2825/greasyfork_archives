// ==UserScript==
// @name        hatebuNews Daily Formatting
// @description hatebuNews Daily Formatting script
// @namespace   localhost
// @include     http://labs.ceek.jp/hbnews/daily.cgi?d=*
// @require     http://code.jquery.com/jquery-1.9.1.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368068/hatebuNews%20Daily%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/368068/hatebuNews%20Daily%20Formatting.meta.js
// ==/UserScript==
console.log("!!!!");

(function ($) {
    
  
  var defaultSizes=[];
  var invertSizes=[];
  
  var ascendings=[];
    
  $("span[style^='font-size']").each(function(){
    var stl = $(this).attr("style").match(/(\d+\.\d+)/)[0];
    if(defaultSizes.indexOf(stl) === -1)defaultSizes.push(stl);
  })
  
  defaultSizes.sort();
  invertSizes = defaultSizes.concat();
  invertSizes.sort(function(a,b){
        if( a > b ) return -1;
        if( a < b ) return 1;
        return 0;
});
  
  for(var i in defaultSizes){
    ascendings[i]=$("span[style^='font-size:"+defaultSizes[i]+"']");
  }
  
  console.log(ascendings)
 var len = ascendings.length
 for(var i in ascendings){
    var weight = Math.floor(parseInt((1-Math.abs((i/len-.5)*2)) * 500)/100)*100+100;
//     console.log(i+":"+weight+":"+parseInt(invertSizes[i]))
//   var size = defaultSizes[i] * (2 - (i/len)*1.2) *.8
   var size = invertSizes[i] - (invertSizes[i] - 20 < 0 ? 0:(invertSizes[i] - 20)/5);
    
    var attrValue = "";
//    attrValue +="font-size:"+invertSizes[i]+"px;"
//     attrValue +="font-size:"+defaultSizes[i]+"px;"
    attrValue +="font-size:"+size+"px;"
//    attrValue +="font-weight:"+weight+";";
    attrValue +="text-align:left;"
    attrValue +="height:1em;"
    attrValue +="white-space:nowrap;"
    attrValue +="overflow:hidden;"
    attrValue +="margin:0px .5em 0px 10px;"
    attrValue +="line-height:1.2em;"
    attrValue +="font-family: 'Yu Mincho',YuMincho,sans-serif !important;"
    attrValue +="font-feature-settings: 'palt';"


    attrValue += "transform:scale("+(1-.2 * (i<len/3))+", 1);"
    ascendings[i].attr("style",attrValue);
    ascendings[i].after("<br>");
   
   
    
//       console.log(ascendings[i])
  }
//   console.log(ascendings)
  
//   console.log(defaultSizes);
//   console.log(invertSizes);
    

//     $(window).bind('AutoPagerize_DOMNodeInserted', function(event) {
//         regreg(event.target);
//     });
    

    

})(jQuery);