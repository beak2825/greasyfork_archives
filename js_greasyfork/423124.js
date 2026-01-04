// ==UserScript==
// @name        Userscript Sidebar for Google Search
// @author      ras5566
// @version     1.0
// @description Userscript Sidebar for Google.com. You easy edit this script for himself.Example: change lang_ru to lang_tr if your want turkey languadge.
// @include     https://stackoverflow.com/questions/14722302/*
// @include     https://www.google.com/search?*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_addStyle
/* global $ */
// @namespace https://greasyfork.org/users/746376
// @downloadURL https://update.greasyfork.org/scripts/423124/Userscript%20Sidebar%20for%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/423124/Userscript%20Sidebar%20for%20Google%20Search.meta.js
// ==/UserScript==

$("body").append ( '                                                \
    <div id="gmRightSideBar">                                       \
        <p>F9 toggles visibility</p>                                \
        <ul>                                                        \
            <li><input id="yearrr" type="button" value="2Year!"></li>    \
            <li><input id="hourss" type="button" value="4Year!"></li>    \
            <li><input id="alltimee" type="button" value="alltime"></li>    \
            <li><input id="langruu" type="button" value="lang_ru"></li>    \
            <li><input id="langenn" type="button" value="lang_en!"></li>    \
            <li><input id="allintitlee" type="button" value="allintitle!"></li>    \
            <li><input id="filetypedocc" type="button" value="filetype DOC!"></li>    \
            <li><input id="githubb" type="button" value="github.com"></li>    \
            <li><input id="habrrr" type="button" value="habr.com"></li>    \
            <li><input id="youtubee" type="button" value="youtube.com"></li>    \
            <li><input id="durvideoo" type="button" value="DurVideo_M"></li>    \
        </ul>                                                        \
    </div>                                                          \
' );


  var currentLocation = window.location;
  var currentsearchhh = window.location.search;
  var currenturl= document.URL
   filetypedocc.onclick = function() {
         var namme=document.getElementsByName('q')[0].value;
           // document.location.href = currenturl+namme+"&q=filetype:DOC";
        document.location.href = currentLocation+"&q=filetype:DOC";
      alert(namme);
  };

  durvideoo.onclick = function() {
     // var classnameee=document.getElementsByClassName('gLFyf gsfi')[0].value;
     //  var namme=document.getElementsByName('q')[0].value;
  // var selectoree=document.querySelector('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb.lsbb > div.SDkEP > div.a4bIc > input').value;
      document.location.href = currentLocation+"&&tbs=dur:m";
  };

////////////////
  hourss.onclick = function() {
     // var classnameee=document.getElementsByClassName('gLFyf gsfi')[0].value;
     //  var namme=document.getElementsByName('q')[0].value;
  // var selectoree=document.querySelector('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb.lsbb > div.SDkEP > div.a4bIc > input').value;
      document.location.href = currentLocation+"&&tbs=qdr:y4";
  };

////////////////
alltimee.onclick = function(){
  //var classnameee=document.getElementsByClassName('znKVS tnhqA')[0].value;
    //document.getElementsByClassName("znKVS tnhqA")[0].click();
    //var currentLocation = window.location;
 //document.location.href = currentLocation+classnameee+"&lr=lang_ru";
     document.location.href = currentLocation+"&&tbs=qdr:all";
};
////////////
allintitlee.onclick = function(){
    document.location.href = currentLocation+"&as_occt=title";
      //alert(window.location.href);
};
////////////

langruu.onclick = function(){
    document.location.href = currentLocation+"&lr=lang_ru";
   };
////////////
langenn.onclick = function(){
    document.location.href = currentLocation+"&lr=lang_en";
   };
////////////

yearrr.onclick = function(){
     //var gg =window.location.search
   document.location.href = currentLocation+"&&tbs=qdr:m24";
//alert(document.querySelector("#tsf").value);
};

////////////////
  githubb.onclick = function() {
      var namme=document.getElementsByName('q')[0].value;
      document.location.href = currentLocation+"&&as_sitesearch=github.com";
      alert(namme);
  };
////////////////
  youtubee.onclick = function() {
    //  var namme=document.getElementsByName('q')[0].value;
      document.location.href = currentLocation+"&as_sitesearch=youtube.com";
    //  alert(namme);
  };
////////////////
  habrrr.onclick = function() {
    //  var namme=document.getElementsByName('q')[0].value;
      document.location.href = currentLocation+"&as_sitesearch=habr.com";
    //  alert(namme);
  };


//youtube.onclick = function(){
     //var gg =window.location.search
//     var classnameee=document.getElementsByClassName('gsfi ytd-searchbox')[0].value;
   //  document.location.href = "http://www.youtube.com/results?"+classnameee+"&sp=CAM%253D";
  //   alert(classnameee);

//alert(document.querySelector("#tsf").value);
//};

//<li><button id="goto">Empty</button></li>                \
 //document.getElementById("goto").addEventListener("click", goTo);
  //function goTo() {
  //    alert(window.find("better"))
 //    window.find("better")
  //  var result = document.getElementById("searchbar").value;
 //   window.location.href = '/user/'+result;
 // }

//-- Fade panel when not in use
var kbShortcutFired = false;
var rightSideBar = $('#gmRightSideBar');
rightSideBar.hover (
    function () {
        $(this).stop (true, false).fadeTo (80, 1 );
        kbShortcutFired = false;
    },
    function () {
        if ( ! kbShortcutFired ) {
            $(this).stop (true, false).fadeTo (900, 2.1);
        }
        kbShortcutFired = false;
    }
);
rightSideBar.fadeTo (2900, 1.1);//off fade

//-- Keyboard shortcut to show/hide our sidebar
$(window).keydown (keyboardShortcutHandler);

function keyboardShortcutHandler (zEvent) {
    //--- On F9, Toggle our panel's visibility
    if (zEvent.which == 120) { // F9
        kbShortcutFired = true;

        if (rightSideBar.is (":visible") ) {
            rightSideBar.stop (true, false).hide ();
        }
        else {
            //-- Reappear opaque to start
            rightSideBar.stop (true, false).show ();
            rightSideBar.fadeTo (1, 1);
            rightSideBar.fadeTo (290, 0.1);
        }

        zEvent.preventDefault ();
        zEvent.stopPropagation ();
        return false;
    }
}

GM_addStyle ( "                                                     \
    #gmRightSideBar {                                               \
        position:               fixed;                              \
        top:                    135px;                                \
        left:                   0;                                  \
        margin:                 1ex;                                \
        padding:                1em;                                \
        background:             orange;                             \
        width:                  130px;                              \
        z-index:                6666;                               \
        opacity:                1.9;                                \
    }                                                               \
    #gmRightSideBar p {                                             \
        font-size:              80%;                                \
    }                                                               \
    #gmRightSideBar ul {                                            \
        margin:                 0ex;                                \
    }                                                               \
    #gmRightSideBar a {                                             \
        color:                  blue;                               \
    }                                                               \
" );
