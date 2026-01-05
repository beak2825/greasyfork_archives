// ==UserScript==
// @name            DuckDuckMenu
// @description     Extends DuckDuckGo by adding a customizable list of additional search engines for making fast searches from other engines.
// @namespace       greasyfork.org/users/3926-jguer
// @homepage        https://github.com/Jguer/DuckduckGo-Mextended
// @icon            https://raw.githubusercontent.com/Jguer/DuckduckGo-Mextended/master/resources/large.png
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=joaogg3@hotmail.com&item_name=Kickass+24+donation
// @include         *://duckduckgo.com/?q=*
// @match           http://mycroftproject.com/*
// @require         //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @license         MIT
// @version         3.0.1 Build 292
// @author          Jguer
// @downloadURL https://update.greasyfork.org/scripts/3658/DuckDuckMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/3658/DuckDuckMenu.meta.js
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
          dname = 'Google';
          durl = 'http://www.google.com/search?q=';
          break;
        case 1:
          dname = 'Youtube';
          durl = 'http://www.youtube.com/results?search_query=';
          break;
        case 2:
          dname = 'Wikipedia';
          durl = 'http://en.wikipedia.org/w/index.php?title=Special%3ASearch&profile=default&search=';
          break;
        case 3:
          dname = 'Github';
          durl = 'https://github.com/search?q=';
          break;
        case 4:
          dname = 'Kickass.to';
          durl = 'https://kickass.to/usearch/';
          break;
        case 5:
          dname = 'The Pirate Bay';
          durl = 'https://thepiratebay.se/search/';
          break;
        case 6:
          dname = 'Subtitle Seeker';
          durl = 'http://subtitleseeker.ee/search/request.php?q=';
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
$('<a>').addClass('enginedit').addClass('ddgmbtn').text('Edit Menu').attr('href', '#').appendTo('.ddgm');

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
//-MyCroft-//

var mycroft = {
plugins: null,
addLinks: function (p) {
  if (p) {
    this.plugins = document.evaluate('//a[@href="/jsreq.html"]', p, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var reviews = document.evaluate('//a[.="[Review]"]', p, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var addLink = document.createElement('a');
    addLink.setAttribute('href', 'javascript:void(0)');
    addLink.setAttribute('style', 'margin-left:5px; color:#000099');
    addLink.innerHTML = '[Add to DDM]';
    for (var i = 0, tmp; i < reviews.snapshotLength; i++) {
      tmp = addLink.cloneNode(true);
      tmp.setAttribute('data-ind', i);
      tmp.addEventListener('click', this.addNewEngine, false);
      reviews.snapshotItem(i).parentNode.insertBefore(tmp, reviews.snapshotItem(i).nextSibling);
    }
  }
},
addNewEngine: function () {
  var i = this.getAttribute('data-ind');
  var name = mycroft.plugins.snapshotItem(i).innerHTML.split(' (') [0].split(' -') [0];
  var newEngine = mycroft.plugins.snapshotItem(i).getAttribute('onClick').split('\'') [1];
  var newName = prompt('This engine will be added to DDG Extended.\nGive a name or cancel.', name);
  if (newName && newName.length > 0) {
    this.innerHTML = '[Added]';
    this.removeEventListener('click', this.addNewEngine, false);
    this.style.color = '#009900';
    this.removeAttribute('href');
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://mycroftproject.com/externalos.php/' + newEngine + '.xml',
      onload: function (response) {
        var responseXML = null;
        // Inject responseXML into existing Object (only appropriate for XML content).
        if (!response.responseXML) {
          responseXML = new DOMParser().parseFromString(response.responseText, 'text/xml');
        }
        var engine = responseXML.getElementsByTagName('Url');
        if (engine.length > 0 && engine[0].getAttribute('template')) {
          var cEnginesave = [undefined];
          for (var f = 0; f < 15; f++) {
            cEnginesave[f] = GM_getValue('CEngineName' + f, 'empty');
            if (cEnginesave[f] == 'empty') {
              GM_setValue('CEngineName' + f, newName);
              GM_setValue('CEngineUrl' + f, engine[0].getAttribute('template'));
              console.log('Added engine with name: ' + newName + ' and URL: ' + engine[0].getAttribute('template'));
              break;
            }
          }
        }
      }
    });
  }
}
};

function News() {
  var Displaynews = GM_getValue('DDMv301b282', "1");
  
  if(Displaynews == "1"){
    $('<div>').addClass('ddgmnews').text("New: Did you know? If you go to mycroftproject.com you can add add engines just by searching their name. This type of message will only appear once after updates.").insertAfter($("#header_wrapper"));
};
  GM_setValue('DDMv301b282', "0");
  }
  
//Function Calling
if (window.location.href.indexOf('http://mycroftproject.com/') !== - 1) {
mycroft.addLinks(document.getElementById('plugins'));
} else {
ddm();
News();
}
