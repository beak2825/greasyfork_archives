// ==UserScript==
// @name        EnstylerJS USI Testcases
// @namespace   EnstylerAndroid
// @description MyDealz Enstyler Frontend and enhanced features
// @include     https://greasyfork.org/de/scripts/24440-enstylerjs-android
// @include     https://userstyles.org/styles/128262/*
// @include     https://www.mydealz.de/*
// @version     3.03.124
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @require     http://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/24440/EnstylerJS%20USI%20Testcases.user.js
// @updateURL https://update.greasyfork.org/scripts/24440/EnstylerJS%20USI%20Testcases.meta.js
// ==/UserScript==
// Testcases USI against GM and TM
console.error('START Userscript test ...');
console.error('Browser User Agent: '+navigator.userAgent);

const enLocParser=location;
const enInternationalSite=enLocParser.hostname.replace('www\.','');

const DEBUG=true;
// DEBUG Infos from enstyler script
if (DEBUG) {
    var  enInitTime = performance.now();
    console.error('DEBUG activated');
    console.error('International Site: '+enInternationalSite);
    // output location, remove * to activate
    console.error('URL : '+enLocParser.toString());     // http://example.com:300/pathname?search=test#hash
    //console.error('protocol : '+enLocParser.protocol); // => "http:"
    console.error('hostname : '+enLocParser.hostname);   // => "example.com"
    //console.error('    port : '+enLocParser.port);     // => "3000"
    //console.error('host+port: '+enLocParser.host);     // => "example.com:3000"
    //console.error('pathname : '+enLocParser.pathname); // => "/pathname/"
    //console.error('  search : '+enLocParser.search);   // => "?search=test"
    //console.error('    hash : '+enLocParser.hash);     // => "#hash"
    //console.log(GM_getValue('Enstyler2_CSS'));
    /**/
    // set update check to x minutes
    enUpdateInterval=1;
}


//check if info.scriptHandler is availible
console.error('Check for Scripthandler ...');
  if(typeof GM_info.scriptHandler === "string"){
        console.error('USERSCRIPT TEST: GM_info.scriptHandler:'+GM_info.scriptHandler);
        //check for string USI
        if (GM_info.scriptHandler.match(/usi/i)) {
               console.error('USERSCRIPT TEST: USI detected:'+GM_info.scriptHandler);
        }
  } else { 
       // GM and older USI has no info.scriptHandler
       console.error('USERSCRIPT TEST: NO GM_info.scriptHandler, Seems to be Greasemonkey or older USI Version: ' + GM_info.version);
       if ( GM_info.version.startsWith('0.')) {
               console.error('USERSCRIPT TEST: possible USI Version detected:' + GM_info.version);
       }
  }

    // alternative to react on USI behavior (USI runs on page loaded, GM on interactive)
    if (document.readyState == 'loading' || document.readyState == 'interactive'){
        // Greasemonkey and Tampermonky -> runs script on DOM ready -> wait for load
        console.error('USERSCRIPT TEST: Run on DOM ready');
   } 
    
    else { // USI script run on page loaded
         console.error('USERSCRIPT TEST: Run on Document loaded (USI behavior)');
    }

// Does USI set GM_info.scriptWillUpdate?
console.error('Check Auto Update ...');
if (GM_info.scriptWillUpdate) console.error('USERSCRIPT TEST: GM_info.scriptWillUpdate is true');
else console.error('USERSCRIPT TEST: GM_info.scriptWillUpdate is set to false');


// test for redirect and ca load updates =================
/* disabled
//enXHTTPtest();

function enXHTTPtest() {
// XMLhttp test, double redirect from mydealz to amazon mobile page
console.error('USERSCRIPT TEST: MyDealz double redirect Test started');
   GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.mydealz.de/visit/comment/11686954/7306274',
            // here we get the final URL from redirect
            onload: function (response) {
                   //alert('GM-xml onload!');
                   // process final URL
                   console.error('USERSCRIPT TEST: double redirect '+response.finalUrl + ' -> should be: https://www.amazon.de/gp/aw/d/B00CTV13Z4/');
                   }    
   }); //  - END GM_xmlhttpRequest

  // Enstyler2 update test
  // get last known Verion of CSS
   console.error('USERSCRIPT TEST: ENstylerJS Test started');
   GM_xmlhttpRequest({
        method: "GET",
        url: "https://userstyles.org/styles/128262",
    
        onload: function(response) {
          //alert('EsyterJS onload!');
          var myResponse=response.responseText;
          myResponse=myResponse.replace(/\r?\n|\r| |\t/g,'');
          myResponse=myResponse.replace(/^.*additional-info-text.*Version:|\<br\>.*./gi,'');
 
          console.error('USERSCRIPT TEST: '+'CSS Version found: '+ myResponse);
        }
   });
}
/**/

// check if USI can use cross site variables ================================
const enCssOpt='EnstylerCssOpt';
const enUpdateUrl = 'https://userstyles.org/styles/128262/enstyler2-style-your-mydealz.css'; // production version

var input = document.createElement('input');
    input.type = 'button';
    //input.setAttribute(enID, EnstylerButton);
    input.onclick = enSaveOpt;
    input.value = 'klick to save Options';

// inject userstyle directly (experimental)
addStyleString('#setting-456412 {color: red; font-weight: bold;}'+ GM_getValue('Enstyler2_CSS',''), 'url(https://userstyles.org');

if (enInternationalSite == 'userstyles.org') {
    if (DEBUG) console.error('On Userstyle ...')
      
    // START Enstyler 2 Homepage
    EnstylerHomeButton();
    // if enabled
    addStyleString('.install-status { display: none; }'); 
} else {
    // inject userstyle directly (experimental)
    if (DEBUG) console.error('On MyDealz ...')
    enUpdateCSS()
}



// support functions copied from enstyler, not really needed here but no need to rewrite
function enUpdateCSS() {
    enCacheExternalResource( enUpdateUrl + enComposeUpdateOpt(), 'Enstyler2_CSS');
}


function enComposeUpdateOpt() {
    // get saved options, remove newlines and split to settings array
    var myOptions=GM_getValue(enCssOpt, '');

    // abort if no options found
    if (myOptions=='' || !myOptions.startsWith('#')) {return "";}

    myOptions=myOptions.replace(/\n/g,'');
    var mySettings = myOptions.split(';');

    // start composing options
    myOptions='';
    for (var i=0; i< mySettings.length; i++) {
           //if(DEBUG) console.error('process:' + mySettings[i]);
           if(mySettings[i]=='') continue;
        
           // each Setting has 3 fields seperated by :
           var myField=mySettings[i].split(':');
           // add &setting=value
           myOptions += '&' +myField[1].slice(0, -1) + '=' + myField[1];
        }
    
     // replace first & by ? and returns string
     myOptions = '?'+myOptions.slice(1);
    
     if(DEBUG) console.log(myOptions);
     return myOptions;
} 
// support for EnStyler2 export / import 


function EnstylerHomeButton() {
        input.setAttribute('style', 'font-size: 1.1em; padding: 0.8em;');  
        $('#style-settings').after(input);
    }

function enSaveOpt() {
        var myOptions='', myID, myValue, myText;
        $('#style-settings select').each(function() {
            myID = $(this).attr('id');
            myValue = $(this).val();
            myText  = $('option[value='+ myValue +']').text();     
            myOptions +='#' + myID + ':' + myValue +':' + myText +';\n';
        });
        $('#style-settings input:checked').each(function() {
            myID = $(this).attr('id');
            myValue = $(this).val();
            myText  = $('label[for='+ myID +']').text();     
            myOptions +='#' + myID + ':' + myValue +':' + myText +';\n';
        });
       GM_setValue(enCssOpt, myOptions);
       // Update and apply CSS
       enUpdateCSS()
    }
    

function addStyleString(str, host) {
    if (typeof host === 'undefined') host='';
    // add style string to document
    if(DEBUG) {
        console.error('applyed style length: ' + (str.length));
        //console.log(str.slice(myStart));
        }
    
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

/* get external file and store to GM_variable */
/* curreently we assume its a CSS or JS File, so we strip comments and @namespace @moz-document... */

const enStripComments = /\/\*.*?\*\/|   *|\t/g
const enFixCSS   = /1111.11%/g


function enCacheExternalResource(stylesheet_uri, GM_variable) {
    GM_xmlhttpRequest({
        method: "GET",
        url: stylesheet_uri,
        onload: function(response) {
            //we get the file!, remove linebreaks and strip simple /*comments */
            var myResponse=response.responseText.replace(/\r\n/g, ' ').replace(enStripComments, '').replace(enFixCSS, "100%");

if (DEBUG) console.error([
      response.status,
      response.statusText,
      response.readyState,
      response.finalUrl,
      stylesheet_uri,
      GM_getValue(enCssOpt, ''),
      response.responseHeaders
    ].join("\n")+'\n'+ myResponse.replace(/.*?(btn--mode-special[^}]*).*/, '$1}'));
            GM_setValue(GM_variable, '');
            GM_setValue(GM_variable, myResponse);
            addStyleString(myResponse);
        }
   });
}


// Anything else?