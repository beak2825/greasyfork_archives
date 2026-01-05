// ==UserScript==
// @name           Barrett values
// @namespace      XcomeX
// @description	   Automatické vyplnění osobních hodnot
// @version        1.11
// @author         XcomeX
// @include        https://survey.valuescentre.com/*
// @grant          GM_addStyle
// @require https://code.jquery.com/jquery-1.12.4.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/21709/Barrett%20values.user.js
// @updateURL https://update.greasyfork.org/scripts/21709/Barrett%20values.meta.js
// ==/UserScript==

/*!
 * JavaScript Cookie v2.1.2
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
!function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(s){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],u=/(%[0-9A-Z]{2})+/g,d=0;d<p.length;d++){var f=p[d].split("="),l=f.slice(1).join("=");'"'===l.charAt(0)&&(l=l.slice(1,-1));try{var m=f[0].replace(u,decodeURIComponent);if(l=t.read?t.read(l,m):t(l,m)||l.replace(u,decodeURIComponent),this.json)try{l=JSON.parse(l)}catch(s){}if(n===m){c=l;break}n||(c[m]=l)}catch(s){}}return c}}return o.set=o,o.get=function(e){return o(e)},o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});


/*! 
 * APPLICATION
 */
$(document).ready(function() {
  
  if($(".ctTitle:first").html() == "Vítejte v průzkumu firemní kultury")
  { // Page 0 - start, clear
    deleteAllCookies();
  }    
  else if($("label:first").html() == "Zadejte své jméno, prosím")
  { // Page 1 - name, email
    $actualIndex = Cookies.get('barrettData_actual');
    $maxIndex = Cookies.get('barrettData_max');
    if($actualIndex != null)  
    {
     if($actualIndex <= $maxIndex) {
      fillUpPage1(); 
     }
     else {
      deleteAllCookies();      
      alert("Vše hotovo.");
      setCookiesByDialog();
     }
    }
    else {
      setCookiesByDialog();
    }
  }  
  else if($('#displayPickNum').val())
  { // Page 2 - values
    $actualIndex = Cookies.get('barrettData_actual');
    $cookieData = Cookies.get('barrettData_'+$actualIndex).split(/\t+/);
    $(".value:contains("+$cookieData[2]+")").trigger("click");
    $(".value:contains("+$cookieData[3]+")").trigger("click");
    $(".value:contains("+$cookieData[4]+")").trigger("click");
    $(".value:contains("+$cookieData[5]+")").trigger("click");
    $(".value:contains("+$cookieData[6]+")").trigger("click");
    $(".value:contains("+$cookieData[7]+")").trigger("click");
    $(".value:contains("+$cookieData[8]+")").trigger("click");
    $(".value:contains("+$cookieData[9]+")").trigger("click");
    $(".value:contains("+$cookieData[10]+")").trigger("click");
    $(".value:contains("+$cookieData[11]+")").trigger("click");

    $sum = $('#displayPickNum').val();
    if ($sum == 10) {
      $(".button").trigger("click");         
    }
    else 
    {
      alert ("Vyberte, prosím, 10 položek.");
    }
  }      
  else
  { // Page 3 - thanks         
    $actualIndex = Cookies.get('barrettData_actual');

    Cookies.remove('barrettData_'+$actualIndex);
    Cookies.set('barrettData_actual', parseInt($actualIndex)+1);                             
    window.location.href = "https://survey.valuescentre.com/survey.html?id=5l1OmCPgJO4wjXkOxpi3RA";      
  }
  
});



function deleteAllCookies(){
var cookies = document.cookie.split(";");
for(var i=0; i < cookies.length; i++) {
    var equals = cookies[i].indexOf("=");
    var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
}

function fillUpPage1() {
  $actualIndex = Cookies.get('barrettData_actual');
  $cookieData = Cookies.get('barrettData_'+$actualIndex).split(/\t+/);
  $('#questionForms0\\.response').val($cookieData[0]);
  $('#questionForms1\\.response').val($cookieData[1]);
  $(".button").trigger("click");                
}

function setCookiesByDialog() {
      /*! 
       * jQuery-UI CSS 
       */
      $("head").append (
          '<link '
        + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/start/jquery-ui.min.css" '
        + 'rel="stylesheet" type="text/css">'
      );


      //--- Add our custom dialog using jQuery.
      $("body").append ('<div id="dialog-form"><form><textarea rows="15" cols="4" name="name" id="txt2" class="text ui-widget-content ui-corner-all"  style="white-space: pre;  overflow: auto;"></textarea></form></div>');

      //--- Activate the dialog.
      $("#dialog-form").dialog ( {
          modal:      false,
          title:      "Zadejte vyplněné hodnoty",
          open: function(event, ui) {
              $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
          },  
          position:   {
                 my: "top",
                 at: "top",
                 of: document
                 , collision: "none"
          },
          minWidth:   480,
          minHeight:  200,  
          zIndex:     3666,
          buttons: {
            "Ok": function() {
              var text2 = $("#txt2");
              //Do your code here
              $rows = text2.val().split(/\n+/);
              Cookies.set('barrettData_max', $rows.length-1);
              Cookies.set('barrettData_actual', 0);
              $.each( $rows, function( key, value ) {
               Cookies.set('barrettData_'+key, value);
              });     
              
              fillUpPage1();
              
              $(this).dialog("close");
            },
            "Cancel": function() {
              $(this).dialog("close");
            }
          }  
      } )
      .dialog ("widget").draggable ("option", "containment", "none");

      //-- Fix crazy bug in FF! ...
      $("#gmOverlayDialog").parent ().css ( {
          position:   "fixed",
          top:        0,
          left:       "4em",
          width:      "75ex"
      } );      
}