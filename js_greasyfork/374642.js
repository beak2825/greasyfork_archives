// ==UserScript==
// @name            DuckDuckG+
// @description     boooo 
// @namespace       uBrowser
// @icon            https://sagarhani.files.wordpress.com/2015/07/duck_duck_go.png
// @include         *://duckduckgo.com/?q=*
// @require         //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @version         1.024
// @downloadURL https://update.greasyfork.org/scripts/374642/DuckDuckG%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/374642/DuckDuckG%2B.meta.js
// ==/UserScript==
//Styles

function addGlobalStyle(css) {
  var head,
  style;
  head = document.getElementsByTagName('head') [0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
//Main Menu Style
addGlobalStyle('.ddgm { background-color: #24272A; height: auto; display: inline-block;width: 100%; }');
//Button Style
addGlobalStyle('.ddgmbtn { background-color: #24272A; height: 25px; width: auto; text-align: center; display: inline-block; vertical-align: middle;padding-top: 6px;padding-bottom: 6px; font-family: inherit; font-size: 1.2em; font-weight: 600; color: white; border-width: 3px; border-bottom-width: 0px; border-color:  #24272A; padding-left: 4px; padding-right: 4px; border-style: solid;}');
addGlobalStyle('.ddgmbtn:hover { background-color:  #5A6269; color: white; text-decoration:none;}');
addGlobalStyle('.ddgmbtn:visited {color: white;}');
//Custom Engine Style
addGlobalStyle('.cddgmbtn { background-color: #24272A;}');
//Engine Add Style
addGlobalStyle('.addengine { float: right;}');
addGlobalStyle('.addengine:hover { background-color:  #5A6269; color: white; text-decoration:none;}');
addGlobalStyle('.addengine:visited {color: white;}');
//Edit Menu Style
addGlobalStyle('.enginedit { float: right;}');
addGlobalStyle('.enginedit:hover { background-color:  #5A6269; color: white; text-decoration:none;}');
addGlobalStyle('.enginedit:visited {color: white;}');
addGlobalStyle('.removex { color: red;font-family: inherit; font-weight: bold; position:relative; top:-5px;}');
addGlobalStyle('.removex:visited {color: red;}')
addGlobalStyle('.removex:hover { color: white; text-decoration:none;}');
addGlobalStyle('.ddgem { background-color: #24272A; height: 20px; }');
addGlobalStyle('.ddgembtn { float: right; background-color: #24272A; height: 14px; width: auto; text-align: center; display: inline-block; vertical-align: middle;padding-top: 3px;padding-bottom: 3px; font-family: inherit; font-size: 0.8em; font-weight: 600; color: white; border-width: 3px; border-bottom-width: 0px;border-top-width: 0px; border-color:  #24272A; padding-left: 4px; padding-right: 4px; border-style: solid;position:relative; top:-2px;}');
addGlobalStyle('.ddgembtn:hover { background-color:  #5A6269; color: white; text-decoration:none;}');
addGlobalStyle('.ddgembtn:visited {color: white;}');

//News Style
addGlobalStyle('.ddgmnews {color: white; background-color: #DE5833;text-align: center;-o-text-overflow: ellipsis;text-overflow: ellipsis;width: auto;height: auto; padding: 5px;margin: 0;overflow: visible;display: block;float: none;z-index: auto;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;position: static;opacity: 1;cursor: default;border: none;-webkit-border-radius: 0 0 20px 20px;border-radius: 0 0 20px 20px;}');

//-DDG-//
function ddm() {
  //Create Menu
  var searchVal = $('#search_form_input').val();
  $('<div>').addClass('ddgm').prependTo('body');
  console.log('##Search term is ' + searchVal);
  console.log('#Created the Menu');
  //Load default Engines
  function LoadDefault() {
    var gname = GM_getValue('ddgmDisEngines', 'empty');
    var dname;
    var durl;
    for (var i = 0; i < 7; i++) {
      switch (i) {
        case 0:
          dname = 'FaselHD';
          durl = 'https://www.faselhd.co/?s=';
          break;
        case 1:
          dname = 'EgyBest';
          durl = 'https://egy.best/explore/?q=';
          break;
        case 2:
          dname = 'CimaClub';
          durl = 'http://cimaclub.com/?s=';
          break;
        case 3:
          dname = 'Dotrani';
          durl = 'https://www.dotrani.com/search?q=';
          break;
        case 4:
          dname = 'Motrajam+';
          durl = 'https://duckduckgo.com/?q=%D9%85%D8%AA%D8%B1%D8%AC%D9%85 ';
          break;
        case 5:
          dname = 'Trailer';
          durl = 'https://www.invidio.us/search?q=trailer+';
          break;
        case 6:
          dname = 'Subtitle';
          durl = 'https://subscene.com/subtitles/title?q=';
          break;
        default:
          alert('Error');
      }
      if (gname.indexOf(dname) < 0)
      {
        btncreate(dname, durl, searchVal);
    }
  }
  console.log('#Loaded Default Engines');
}

//Load Custom Engines
function LoadCustom() {
  var _CEngineName = [undefined];
  var _CEngineURL = [undefined];
  var arrayLength;
  for (var i = 0; i < 15; i++) {
    _CEngineName[i] = GM_getValue('CEngineName' + i, 'empty');
    _CEngineURL[i] = GM_getValue('CEngineUrl' + i, 'empty');
    if (_CEngineName[i] != 'empty') {
      cbtncreate(_CEngineName[i], _CEngineURL[i], searchVal);
    }
  }
}
  
LoadDefault();
LoadCustom();
  
//Create Settings Menu  
$('<a>').addClass('enginedit').addClass('ddgmbtn').text('*').attr('href', '#').appendTo('.ddgm');

/*


Logic


*/
  
//Default Engine Creator
function btncreate(name, searchEngine, _searchVal) {
  if (name != undefined & searchEngine != undefined) {
    $('<a>').addClass('ddgmbtn').addClass('engine').hide().text(name).attr('href', searchEngine + _searchVal).appendTo('.ddgm').fadeIn(100);
    console.log('##Added Button with ' + name);
  }
};
//Custom Engine Creator
function cbtncreate(name, searchEngine, _searchVal) {
  if (name != undefined & searchEngine != undefined) {
    searchEngine = searchEngine.replace('{searchTerms}', _searchVal);
    $('<a>').addClass('ddgmbtn').addClass('engine').addClass('cddgmbtn').hide().text(name).attr('href', searchEngine).prependTo('.ddgm').fadeIn(100);
    console.log('##Added Button first with ' + name);
  }
};
//Edit Engines
$('.enginedit').click(function () {
  if ($('#restoredengines').length) {
    //if removex exists remove edit menu
    $('.removex').fadeOut(200, function () {
      $(this).remove();
    });
    $('.ddgem').slideUp(300, function () {
      $(this).remove();
    });
  } 
  else {
    //if removex doesn't exist add menu
    $('<a>').text(' x').addClass('removex').hide().attr('href', '#').appendTo('.engine').fadeIn(300);
    $('<div>').addClass('ddgem').slideDown(300).insertAfter('.ddgm');
    $('<a>').addClass('ddgembtn').attr('id', 'addmengine').text('Add new Engine (Manual)').attr('href', '#').appendTo('.ddgem');
    $('<a>').addClass('ddgembtn').attr('id', 'restoredengines').text('Restore default Engines').attr('href', '#').appendTo('.ddgem');
  }
});
//Add Engines Manually
$(document).on('click', '#addmengine', function () {
  var cName = prompt('Engine Name', 'Display Name');
  if (name.length < 25) {
    console.log('Called Search Engine Prompt');
    var cSearchEngine = prompt('Engine URL (Example:http://www.google.com/search?q={searchTerms})', 'URL');
    cbtncreate(cName, cSearchEngine, searchVal);
    //Save Custom engine           
    var cEnginesave = [undefined];
    for (var i = 0; i < 15; i++) {
      cEnginesave[i] = GM_getValue('CEngineName' + i, 'empty');
      if (cEnginesave[i] == 'empty') {
        GM_setValue('CEngineName' + i, cName);
        GM_setValue('CEngineUrl' + i, cSearchEngine);
        break;
      }
    }
  } 
  else
  {
    alert('Your title is too long');
  }
});
//Restore Default Engines
$(document).on('click', '#restoredengines', function () {
  GM_setValue('ddgmDisEngines', 'empty');
  location.reload();
});
//Remove Engine
$(document).on('click', '.removex', function () {
  var comparedel = $(this).parent('.engine').clone().children().remove().end().text();
  $(this).closest('.engine').remove();
  console.log('#Removed Engine ' + comparedel);
  var cEnginedel = [undefined];
  for (var i = 0; i < 15; i++) {
    cEnginedel[i] = GM_getValue('CEngineName' + i, 'empty');
    if (cEnginedel[i] == comparedel) {
      GM_setValue('CEngineName' + i, 'empty');
      GM_setValue('CEngineUrl' + i, 'empty');
      break;
    }
  }
  var disabledengines = GM_getValue('ddgmDisEngines', 'empty');
  GM_setValue('ddgmDisEngines', disabledengines + ' ' + comparedel);
  disabledengines = GM_getValue('ddgmDisEngines', 'empty');
  console.log('#Disabled Engines ' + disabledengines)
});
}
//Function Calling
ddm();
