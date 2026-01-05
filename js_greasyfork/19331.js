// ==UserScript==
// @name        Instant-Cquotes
// @name:it     Instant-Cquotes
// @license     public domain
// @version     0.39
// @date        2016-05-20
// @description Automatically converts selected FlightGear mailing list and forum quotes into post-processed MediaWiki markup (i.e. cquotes).
// @description:it Converte automaticamente citazioni dalla mailing list e dal forum di FlightGear in marcatori MediaWiki (cquote).
// @author      Hooray, bigstones, Philosopher, Red Leader & Elgaton (2013-2016)
// @supportURL  http://wiki.flightgear.org/FlightGear_wiki:Instant-Cquotes
// @icon        http://wiki.flightgear.org/images/2/25/Quotes-logo-200x200.png
// @match       https://sourceforge.net/p/flightgear/mailman/*
// @match       http://sourceforge.net/p/flightgear/mailman/*
// @match       https://forum.flightgear.org/*
// @match       http://wiki.flightgear.org/*
// @namespace   http://wiki.flightgear.org/FlightGear_wiki:Instant-Cquotes
// @run-at      document-start
// @require     https://code.jquery.com/jquery-1.10.2.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.js
// @require     https://cdn.jsdelivr.net/genetic.js/0.1.14/genetic.js
// @require     https://cdn.jsdelivr.net/synaptic/1.0.4/synaptic.min.js
// @resource    jQUI_CSS https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @resource    myLogo http://wiki.flightgear.org/images/2/25/Quotes-logo-200x200.png
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/19331/Instant-Cquotes.user.js
// @updateURL https://update.greasyfork.org/scripts/19331/Instant-Cquotes.meta.js
// ==/UserScript==
//
// This work has been released into the public domain by their authors. This
// applies worldwide.
// In some countries this may not be legally possible; if so:
// The authors grant anyone the right to use this work for any purpose, without
// any conditions, unless such conditions are required by law.
//
// This script has a number of dependencies that are implicitly satisfied when run as a user script 
// via GreaseMonkey/TamperMonkey; however, these need to be explicitly handled when using a different mode (e.g. firefox/android):
// 
// - jQuery - user interface (REQUIRED)
// - genetic-js - genetic programming (OPTIONAL/EXPERIMENTAL)
// - synaptic - neural networks (OPTIONAL/EXPERIMENTAL)
// 
// 

/* Here are some TODOs
 * - support RSS feeds http://dir.gmane.org/gmane.games.flightgear.devel/
 * - move event handling/processing to the CONFIG hash
 * - use try/catch more widely
 * - wrap function calls in try/call for better debugging/diagnostics
 * - add helpers for [].forEach.call, map, apply and call
 * - replace for/in, for/of, let statements for better compatibility (dont require ES6)
 * - for the same reason, replace use of functions with default params 
 * - isolate UI (e.g. JQUERY) code in UserInterface hash
 * - expose regex/transformations via the UI
 *
 */

'use strict';


// TODO: move to GreaseMonkey/UI host
// prevent conflicts with jQuery used on webpages: https://wiki.greasespot.net/Third-Party_Libraries#jQuery
// http://stackoverflow.com/a/5014220
this.$ = this.jQuery = jQuery.noConflict(true);

// this hash is just intended to help isolate UI specifics
// so that we don't need to maintain/port tons of code 

var UserInterface = {
  get: function() {
    return UserInterface.DEFAULT;
  },
  
 CONSOLE: {
   
 }, // CONSOLE (shell, mainly useful for testing)
  
 DEFAULT: {
  alert: function(msg) {return window.alert(msg);     },
  prompt: function(msg) {return window.prompt(msg);  }, 
  confirm: function(msg) {return window.confirm(msg); },
  dialog: null,
  selection: null,
  populateWatchlist: function() {
    
  },
  populateEditSections: function() {
    
  }
 
 }, // default UI mapping (Browser/User script)
  
  JQUERY: {
    
  } // JQUERY 
  
}; // UserInterface

var UI = UserInterface.get(); // DEFAULT for now


// This hash is intended to help encapsulate platform specifics (browser/scripting host)
// Ideally, all APIs that are platform specific should be kept here
// This should make it much easier to update/port and maintain the script in the future
var Environment = {
  getHost: function(xpi=false) {
 
     if(xpi) {
       Environment.scriptEngine = 'firefox addon';
       console.log('in firefox xpi/addon mode');
       return Environment.FirefoxAddon; // HACK for testing the xpi mode (firefox addon)
     }
    
    // This will determine the script engine in use: http://stackoverflow.com/questions/27487828/how-to-detect-if-a-userscript-is-installed-from-the-chrome-store
    if (typeof(GM_info) === 'undefined') {
    Environment.scriptEngine = "plain Chrome (Or Opera, or scriptish, or Safari, or rarer)";
    // See http://stackoverflow.com/a/2401861/331508 for optional browser sniffing code.
   }
   else {
    Environment.scriptEngine = GM_info.scriptHandler  ||  "Greasemonkey";
    }
   console.log ('Instant cquotes is running on ' + Environment.scriptEngine + '.');
    
   //console.log("not in firefox addon mode...");
    // See also: https://wiki.greasespot.net/Cross-browser_userscripting
    return Environment.GreaseMonkey; // return the only/default host (for now)
  },
  
  validate: function(host) {
    if (host.get_persistent('startup.disable_validation',false)) return;
    
    if(Environment.scriptEngine !== "Greasemonkey") 
      console.log("NOTE: This script has not been tested with script engines other than GreaseMonkey recently!");
    
    var dependencies = [
      {name:'jQuery', test: function() {} },
      {name:'genetic.js', test: function() {} },
      {name:'synaptic', test: function() {} },
    ];
    
    [].forEach.call(dependencies, function(dep) {
      console.log("Checking for dependency:"+dep.name);
      var status=false;
      try {
      dep.test.call(undefined);
      status=true;
      }
      catch(e) {
      status=false;       
      }
      finally {
        var success = (status)?'==> success':'==> failed';
        console.log(success);
        return status;
      }
    });
  }, // validate
  
  // this contains unit tests for checking crucial APIs that must work for the script to work correctly
  // for the time being, most of these are stubs waiting to be filled in
  // for a working example, refer to the JSON test at the end
  // TODO: add jQuery tests
  APITests: [
     {name:'download', test: function(recipient) {recipient(true);}  },
     {name:'make_doc', test: function(recipient) { recipient(true);}   },
     {name:'eval_xpath', test: function(recipient) { recipient(true);} },
     {name:'JSON de/serialization', test: function(recipient) {
       //console.log("running json test");
       var identifier = 'unit_tests.json_serialization';
       var hash1 = {x:1,y:2,z:3};
       Host.set_persistent(identifier, hash1, true);
       var hash2 = Host.get_persistent(identifier,null,true);
       
       recipient(JSON.stringify(hash1) === JSON.stringify(hash2));
     } // callback 
     },
    
    // downloads a posting and tries to transform it to 3rd person speech ...
    // TODO: add another test to check forum postings
    {name:'text/speech transformation', test: function(recipient) {
    
    // the posting we want to download
    var url='https://sourceforge.net/p/flightgear/mailman/message/35066974/';
    Host.downloadPosting(url, function (result) {
      
    // only process the first sentence by using comma/dot as delimiter
    var firstSentence = result.content.substring(result.content.indexOf(',')+1, result.content.indexOf('.'));
      
    var transformed = transformSpeech(firstSentence, result.author, null, speechTransformations );
    console.log("3rd person speech transformation:\n"+transformed);   
    
    recipient(true);
    }); // downloadPosting() 
        
  }// test()
    }, // end of speech transform test
    {
      name:"download $FG_ROOT/options.xml", test: function(recipient) {
        downloadOptionsXML();
        recipient(true);
      } // test
    }
    
  ], // end of APITests
  
  runAPITests: function(host, recipient) {
    console.log("Running API tests");
    for(let test of Environment.APITests ) {
      //var test = Environment.APITests[t];
      // invoke the callback passed, with the hash containing the test specs, so that the console/log or a div can be updated showing the test results
      
      recipient.call(undefined, test);
      
    } // foreach test
  }, // runAPITests
  
  /*
   * ===================================================================================================================================================
   *
   */
  
  // NOTE: This mode/environment is WIP and highly experimental ...
  // To see this working, you need to package up the whole file as a firefox xpi using "jpm xpi"
  // and then start the whole thing via "jpm run", to do that, you also need a matching package.json (i.e. via jpm init) 
  // ALSO: you will have to explicitly install any dependencies using jpm
  FirefoxAddon: {
  	init: function() {
		console.log("Firefox addon mode ...");
  	},
	getScriptVersion: function() {
		return '0.36'; // FIXME
	},
	dbLog: function(msg) {
		console.log(msg);
	},
	addEventListener: function(ev, cb) {

	require("sdk/tabs").on("ready", logURL);
 	function logURL(tab) {
  		console.log("URL loaded:" + tab.url);
	}	
	},
    
	registerConfigurationOption: function(name, callback, hook) {
	// https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Add_a_Context_Menu_Item
		console.log("config menu support n/a in firefox mode");
 // https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Using_third-party_modules_%28jpm%29  
 var menuitems = require("menuitem");
 var menuitem = menuitems.Menuitem({
  id: "clickme",
  menuid: "menu_ToolsPopup",
  label: name,
  onCommand: function() {
    console.log("menuitem clicked:");
    callback();
  },
  insertbefore: "menu_pageInfo"
});
	},
    
	registerTrigger: function() {
		// https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Add_a_Context_Menu_Item
		// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/context-menu#Item%28options%29
		var contextMenu = require("sdk/context-menu");
		var menuItem = contextMenu.Item({
  		label: "Instant Cquote",
  		context: contextMenu.SelectionContext(),
      // https://developer.mozilla.org/en/Add-ons/SDK/Guides/Two_Types_of_Scripts
      // https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Content_Scripts
  		contentScript: 'self.on("click", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  		onMessage: function (selectionText) {
    		console.log(selectionText);
        instantCquote(selectionText);
  		}
	});
  
    // for selection handling stuff, see: https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/selection
    
    function myListener() {
  console.log("A selection has been made.");
}
var selection = require("sdk/selection");
selection.on('select', myListener);
    
	}, //registerTrigger
    
	get_persistent: function(key, default_value) {
    // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
    var ss = require("sdk/simple-storage");
    
    console.log("firefox mode does not yet have persistence support");
    return default_value;},
	set_persistent: function(key, value) {
		console.log("firefox persistence stubs not yet filled in !");
	},
    
  
	set_clipboard: function(content) {
	// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/clipboard
    
	//console.log('clipboard stub not yet filled in ...');
    var clipboard = require("sdk/clipboard");
    clipboard.set(content);
	} //set_cliipboard
    
  }, // end of FireFox addon config
  
  // placeholder for now ...
  Android: {
    // NOP
  }, // Android

  
  ///////////////////////////////////////
  // supported  script engines:
  ///////////////////////////////////////
  
  GreaseMonkey: {
  // TODO: move environment specific initialization code here  
  init: function() {
  // Check if Greasemonkey/Tampermonkey is available
  try {
  // TODO: add version check for clipboard API and check for TamperMonkey/Scriptish equivalents ?
  GM_addStyle(GM_getResourceText('jQUI_CSS'));
  } // try
  catch (error) {
  console.log('Could not add style or determine script version');
  } // catch

  var commands = [
  {name:'Setup quotes',callback:setupDialog, hook:'S' },
  {name:'Check quotes',callback:selfCheckDialog, hook:'C' }
  ];
      
  for (let c of commands ) {
   this.registerConfigurationOption(c.name, c.callback, c.hook);
  }  
     
  }, // init()
    
  getScriptVersion: function() {
  return GM_info.script.version;  
  },
    
  dbLog: function (message) {
  if (Boolean(DEBUG)) {
    console.log('Instant cquotes:' + message);
  }
  }, // dbLog()
    
  registerConfigurationOption: function(name,callback,hook) {
  // https://wiki.greasespot.net/GM_registerMenuCommand
  // https://wiki.greasespot.net/Greasemonkey_Manual:Monkey_Menu#The_Menu
    GM_registerMenuCommand(name, callback, hook);
  }, //registerMenuCommand()
    
  registerTrigger: function() {
    
    // TODO: we can use the following callback non-interactively, i.e. to trigger background tasks
// http://javascript.info/tutorial/onload-ondomcontentloaded
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Instant Cquotes: DOM fully loaded and parsed");
});

window.addEventListener('load', init); // page fully loaded
Host.dbLog('Instant Cquotes: page load handler registered');

    
    // Initialize (matching page loaded)
function init() {
  console.log('Instant Cquotes: page load handler invoked');
  var profile = getProfile();
  
  Host.dbLog("Profile type is:"+profile.type);
  
  // Dispatch to correct event handler (depending on website/URL)
  // TODO: this stuff could/should be moved into the config hash itself
  
  if (profile.type=='wiki') {
    profile.event_handler(); // just for testing
    return;
  }
   
    Host.dbLog('using default mode');
    document.onmouseup = instantCquote;
    // HACK: preparations for moving the the event/handler logic also into the profile hash, so that the wiki (edit mode) can be handled equally
    //eval(profile.event+"=instantCquote");
     
} // init()


    
  }, // registerTrigger

    
   download: function (url, callback, method='GET') {
  // http://wiki.greasespot.net/GM_xmlhttpRequest
     try {
  GM_xmlhttpRequest({
    method: method,
    url: url,
    onload: callback
  });
     }catch(e) {
       console.log("download did not work");
     }
  }, // download()
    
    // is only intended to work with archives supported by the  hash
    downloadPosting: function (url, EventHandler) {
      
    Host.download(url, function (response) {
    var profile = getProfile(url);
    var blob = response.responseText;
    var doc = Host.make_doc(blob,'text/html'); 
    var result = {}; // hash to be returned
    
    [].forEach.call(['author','date','title','content'], function(field) {
      var xpath_query = '//' + profile[field].xpath;
      try {
       var value = Host.eval_xpath(doc, xpath_query).stringValue; 
       //UI.alert("extracted field value:"+value);
        
        // now apply all transformations, if any
       value = applyTransformations(value, profile[field].transform );
        
       result[field]=value; // store the extracted/transormed value in the hash that we pass on
      } // try
      catch(e) {
        UI.alert("downloadPosting failed:\n"+ e.message);
      } // catch
    }); // forEach field
    
    EventHandler(result); // pass the result to the handler
    }); // call to Host.download() 
      
    }, // downloadPosting()
    
    // TODO: add makeAJAXCall, and makeWikiCall here

  
    // turn a string/text blob into a DOM tree that can be queried (e.g. for xpath expressions)
    // FIXME: this is browser specific not GM specific ...
    make_doc: function(text, type='text/html') {
      // to support other browsers, see: https://developer.mozilla.org/en/docs/Web/API/DOMParser
      return new DOMParser().parseFromString(text,type);
    }, // make DOM document
    
    // xpath handling may be handled separately depending on browser/platform, so better encapsulate this
    // FIXME: this is browser specific not GM specific ...
    eval_xpath: function(doc, xpath, type=XPathResult.STRING_TYPE) {
      return doc.evaluate(xpath, doc, null, type, null);
    }, // eval_xpath
    
    set_persistent: function(key, value, json=false) 
    {
      // transparently stringify to json
      if(json) {
        // http://stackoverflow.com/questions/16682150/store-a-persistent-list-between-sessions
        value = JSON.stringify (value);
      }
      
      // https://wiki.greasespot.net/GM_setValue
      GM_setValue(key, value);
      //UI.alert('Saved value for key\n'+key+':'+value);
    }, // set_persistent
    
    get_persistent: function(key, default_value, json=false) {
     // https://wiki.greasespot.net/GM_getValue
    
      var value=GM_getValue(key, default_value);
      // transparently support JSON: http://stackoverflow.com/questions/16682150/store-a-persistent-list-between-sessions
      if(json) {
        value = JSON.parse (value)  ||  {};
      }
      return value;
    }, // get_persistent

   setClipboard: function(msg) {
   // this being a greasemonkey user-script, we are not 
   // subject to usual browser restrictions
   // http://wiki.greasespot.net/GM_setClipboard
   GM_setClipboard(msg);
  }, // setClipboard()
    
    getTemplate: function() {
    
    // hard-coded default template
    var template = '$CONTENT<ref>{{cite web\n' +
  '  |url    =  $URL \n' +
  '  |title  =  <nowiki> $TITLE </nowiki> \n' +
  '  |author =  <nowiki> $AUTHOR </nowiki> \n' +
  '  |date   =  $DATE \n' +
  '  |added  =  $ADDED \n' +
  '  |script_version = $SCRIPT_VERSION \n' +
  '  }}</ref>\n';
     
    // return a saved template if found, fall back to hard-coded one above otherwise
    return Host.get_persistent('default_template', template);
    
  } // getTemplate

    
  } // end of GreaseMonkey environment, add other environments below
  
}; // Environment hash - intended to help encapsulate host specific stuff (APIs)


// the first thing we need to do is to determine what APIs are available
// and store everything in a Host hash, which is subsequently used for API lookups
// the Host hash contains all platform/browser-specific APIs
var Host = Environment.getHost();
Environment.validate(Host); // this checks the obtained host to see if all required dependencies are available
Host.init(); // run environment specific initialization code (e.g. logic for GreaseMonkey setup)


// move DEBUG handling to a persistent configuration flag so that we can configure this using a jQuery dialog (defaulted to false)
// TODO: move DEBUG variable to Environment hash / init() routine
var DEBUG = Host.get_persistent('debug_mode_enabled', false);
Host.dbLog("Debug mode is:"+DEBUG);
function DEBUG_mode() {
  // reset script invocation counter for testing purposes
  Host.dbLog('Resetting script invocation counter');
  Host.set_persistent(GM_info.script.version, 0);
}


if (DEBUG)
DEBUG_mode();

// hash with supported websites/URLs,  includes xpath and regex expressions to extract certain fields, and a vector with optional transformations for post-processing each field

var CONFIG = {
  // WIP: the first entry is special, i.e. it's not an actual list archive (source), but only added here so that the same script can be used
  // for editing the FlightGear wiki
  
  'FlightGear.wiki': {
    type: 'wiki',
    enabled: false,
    event: 'document.onmouseup', // when to invoke the event handler
    // TODO: move downloadWatchlist() etc here
    event_handler: function () {
      console.log('FlightGear wiki handler active (waiting to be populated)');
      // this is where the logic for a wiki mode can be added over time (for now, it's a NOP)
    
    //for each supported mode, invoke the trigger and call the corresponding handler
    [].forEach.call(CONFIG['FlightGear.wiki'].modes, function(mode) {
      //dbLog("Checking trigger:"+mode.name);
      if(mode.trigger() ) {
        mode.handler();
      }
    });
      
    }, // the event handler to be invoked
    url_reg: '^(http|https)://wiki.flightgear.org', // ignore for now: not currently used by the wiki mode
    
    modes: [
      { name:'process-editSections',
        trigger: function() {return true;}, // match URL regex - return true for always match
       
        // the code implementing the mode
        handler: function() {
                
    var editSections = document.getElementsByClassName('mw-editsection');
    console.log('FlightGear wiki article, number of edit sections: '+editSections.length);
   
    // for now, just rewrite edit sections and add a note to them
   
     [].forEach.call(editSections, function (sec) {
       sec.appendChild(
         document.createTextNode(' (instant-cquotes is lurking) ')
       );
     }); //forEach section
        } // handler
       
       
      } // process-editSections
      // TODO: add other wiki modes below 
      
    ] // modes
    
  }, // end of wiki profile
  
  'Sourceforge Mailing list': {
    enabled: true,
    type: 'archive',
    event: 'document.onmouseup', // when to invoke the event handler
    event_handler: instantCquote, // the event handler to be invoked
    url_reg: '^(http|https)://sourceforge.net/p/flightgear/mailman/.*/',
    content: {
      xpath: 'tbody/tr[2]/td/pre/text()', // NOTE this is only used by the downloadPosting  helper to retrieve the posting without having a selection (TODO:add content xpath to forum hash)
      selection: getSelectedText,
      idStyle: /msg[0-9]{8}/,
      parentTag: [
        'tagName',
        'PRE'
      ],
      transform: [],
    }, // content recipe
    // vector with tests to be executed for sanity checks (unit testing)
    tests: [
      {
        url: 'https://sourceforge.net/p/flightgear/mailman/message/35059454/',
        author: 'Erik Hofman',
        date: 'May 3rd, 2016', // NOTE: using the transformed date here 
        title: 'Re: [Flightgear-devel] Auto altimeter setting at startup (?)'
      },
      {
        url: 'https://sourceforge.net/p/flightgear/mailman/message/35059961/',
        author: 'Ludovic Brenta',
        date: 'May 3rd, 2016',
        title: 'Re: [Flightgear-devel] dual-control-tools and the limit on packet size'
      },
      {
        url: 'https://sourceforge.net/p/flightgear/mailman/message/20014126/',
        author: 'Tim Moore',
        date: 'Aug 4th, 2008',
        title: 'Re: [Flightgear-devel] Cockpit displays (rendering, modelling)'
      },
      {
        url: 'https://sourceforge.net/p/flightgear/mailman/message/23518343/',
        author: 'Tim Moore',
        date: 'Sep 10th, 2009',
        title: '[Flightgear-devel] Atmosphere patch from John Denker'
      } // add other tests below

    ], // end of vector with self-tests
    // regex/xpath and transformations for extracting various required fields
    author: {
      xpath: 'tbody/tr[1]/td/div/small/text()',
      transform: [extract(/From: (.*) <.*@.*>/)]
    },
    title: {
      xpath: 'tbody/tr[1]/td/div/div[1]/b/a/text()',
      transform:[]
    },
    date: {
      xpath: 'tbody/tr[1]/td/div/small/text()',
      transform: [extract(/- (.*-.*-.*) /)]
    },
    url: {
      xpath: 'tbody/tr[1]/td/div/div[1]/b/a/@href',
      transform: [prepend('https://sourceforge.net')]
    }
  }, // end of mailing list profile
  // next website/URL (forum)
  'FlightGear forum': {
    enabled: true,
    type: 'archive',
    event: 'document.onmouseup', // when to invoke the event handler (not used atm)
    event_handler: null, // the event handler to be invoked (not used atm)
    url_reg: /https:\/\/forum\.flightgear\.org\/.*/,
    content: {
      xpath: '', //TODO: this must be added for downloadPosting() to work, or it cannot extract contents
      selection: getSelectedHtml,
      idStyle: /p[0-9]{6}/,
      parentTag: [
        'className',
        'content',
        'postbody'
      ],
      transform: [
        removeComments,
        forum_quote2cquote,
        forum_smilies2text,
        forum_fontstyle2wikistyle,
        forum_code2syntaxhighlight,
        img2link,
        a2wikilink,
        vid2wiki,
        list2wiki,
        forum_br2newline
      ]
    },
    // vector with tests to be executed for sanity checks (unit testing)
    // postings will be downloaded using the URL specified, and then the author/title 
    // fields extracted using the outer regex and matched against what is expected
    // NOTE: forum postings can be edited, so that these tests would fail - thus, it makes sense to pick locked topics/postings for such tests
    tests: [
      {
        url: 'https://forum.flightgear.org/viewtopic.php?f=18&p=284108#p284108',
        author: 'mickybadia',
        date: 'May 3rd, 2016',
        title: 'OSM still PNG maps'
      },
      {
        url: 'https://forum.flightgear.org/viewtopic.php?f=19&p=284120#p284120',
        author: 'Thorsten',
        date: 'May 3rd, 2016',
        title: 'Re: FlightGear\'s Screenshot Of The Month MAY 2016'
      },
       {
        url: 'https://forum.flightgear.org/viewtopic.php?f=71&t=29279&p=283455#p283446',
        author: 'Hooray',
         date: 'Apr 25th, 2016',
        title: 'Re: Best way to learn Canvas?'
      },
      {
        url: 'https://forum.flightgear.org/viewtopic.php?f=4&t=1460&p=283994#p283994',
        author: 'bugman',
        date: 'May 2nd, 2016',
        title: 'Re: eurofighter typhoon'
      } // add other tests below

    ], // end of vector with self-tests
    author: {
      xpath: 'div/div[1]/p/strong/a/text()',
      transform: [] // no transformations applied
    },
    title: {
      xpath: 'div/div[1]/h3/a/text()',
      transform: [] // no transformations applied
    },
    date: {
      xpath: 'div/div[1]/p/text()[2]',
      transform: [extract(/» (.*?[0-9]{4})/)]
    },
    url: {
      xpath: 'div/div[1]/p/a/@href',
      transform: [
        extract(/\.(.*)/),
        prepend('https://forum.flightgear.org')
      ] // transform vector
    } // url
  } // forum 
}; // CONFIG has

// hash to map URLs (wiki article, issue tracker, sourceforge link, forum thread etc) to existing wiki templates
var MatchURL2Templates = [
  // placeholder for now
 {
   name: 'rewrite sourceforge code links',
   url_reg: '',
   handler: function() {
   
 } // handler
  
 } // add other templates below
  
]; // MatchURL2Templates




// output methods (alert and jQuery for now)
var OUTPUT = {
  // Shows a window.prompt() message box
  msgbox: function (msg) {
    UI.prompt('Copy to clipboard ' + Host.getScriptVersion(), msg);
    Host.setClipboard(msg);
  }, // msgbox
  
  // this is currently work-in-progress, and will need to be refactored sooner or later
  // for now, functionality matters more than elegant design/code :)
  jQueryTabbed: function(msg, original) {
  // FIXME: using backtics here makes the whole thing require ES6  ....
  var markup = $(`<div id="tabs">
  <ul>
    <li><a href="#selection">Selection</a></li>
    <li><a href="#articles">Articles</a></li>
    <li><a href="#templates">Templates</a></li>
    <li><a href="#development">Development</a></li>
    <li><a href="#settings">Settings</a></li>
    <li><a href="#help">Help</a></li>
    <li><a href="#about">About</a></li>
  </ul>
  <div id="selection">This tab contains your extracted and post-processed selection, converted to proper wikimedia markup, including proper attribution.
  <div id="content">

    <label for="template_select">Select a template</label>
    <select name="template_select" id="template_select">
    <option>default</option>
    <option>cquote</option>
    </select>

  </div>
  <div id="options">
    <b>Note this is work-in-progress, i.e. not yet fully functional</b><br/>
    <label for="article_select">Select an article to update</label>
    <select name="article_select" id="article_select">
     <optgroup id="news" label="News"/>
     <optgroup id="support" label="Support"/>
     <optgroup id="release" label="Release"/>
     <optgroup id="develop" label="Development"/>
     <optgroup id="watchlist" label="Watchlist"/>
    </select>
    <p/>
    <label for="section_select">Select section:</label>
    <select name="section_select" id="section_select">
    </select>
  </div>
  </div>
  <div id="articles">This tab contains articles that you can directly access/edit using the mediawiki API<br/>
  Note: The watchlist is retrieved dynamically, so does not need to be edited here<br/>
    <label for="article_select">Select an article</label>
    <select name="article_select" id="article_select">
     <optgroup id="news" label="News"/>
     <optgroup id="support" label="Support"/>
     <optgroup id="develop" label="Development"/>
     <optgroup id="release" label="Release"/>
    <!-- the watchlist is retrieved dynamically, so omit it here 
     <optgroup id="watchlist" label="Watchlist"/>
    -->
    </select>

   <button id="article_new">New</button>
   <button id="article_remove">Remove</button>

  <div id="edit_article">
    <label for="article_name">Article</label>
    <input type="text" id="article_name" name="article_name"><br/>

    <label for="article_url">Link</label>
    <input type="text" id="article_url" name="article_url"><br/>

    <button id="article_save">Save</button>
  </div>

  </div>
  <div id="templates">This tab contains templates for different types of articles (newsletter, changelog, release plan etc)<p/>
  For now, this is WIP - in the future, there will be a dropdown menu added and all templates will be editable.<p/>
  <div id="template_header">

    <label for="template_select">Select a template</label>
    <select name="template_select" id="template_select">
    <option>default</option>
    <option>cquote</option>
    </select>

  </div>
  <div id="template_area"/>
  <div id="template_controls">
    <button id="template_save">Save</button>
  </div>
  </div>
  <div id="development">This tab is a placeholder for features currently under development<p/>
  <button id="evolve_regex">Evolve regex</button><p/>
  <button id="test_perceptron">Test Perceptron</button><p/>
  <div id="output">

<table id="results">
<thead>
  <tr>
     <th>Generation</th>
     <th>Fitness</th>
     <th>Expression</th>
     <th>Result</th>
  </tr>
  </thead>
  <tbody>
  </tbody>
</table> 

   <!--
   <textarea id="devel_output" lines="10"></textarea><p/>
  -->
  </div>
  </div>

  <div id="settings">This tab will contain script specific settings
  </div>
  <div id="help">One day, this tab may contain help....<p/><button id="helpButton">Instant Cquotes</button>
  </div>
  <div id="about">show some  script related information here
  </div>
</div>`); // tabs div
    
   var evolve_regex = $('div#development button#evolve_regex', markup);
   evolve_regex.click(function() {
     //alert("Evolve regex");
     evolve_expression_test();
   });
    
   var test_perceptron = $('div#development button#test_perceptron', markup);
   test_perceptron.click(function() {
     alert("Test perceptron");
   });
   
    
    // add dynamic elements to each tab
    
   // NOTE: this affects all template selectors, on all tabs
   $('select#template_select', markup).change(function() {
     UI.alert("Sorry, templates are not yet fully implemented (WIP)");
   });
    
   var help = $('#helpButton', markup);
   help.button();
   help.click(function() {
     window.open("http://wiki.flightgear.org/FlightGear_wiki:Instant-Cquotes");
   });
    
   // rows="10"cols="80" style=" width: 420px; height: 350px"
   var textarea = $('<textarea id="quotedtext" rows="20" cols="70"/>');
   textarea.val(msg);
   $('#selection #content', markup).append(textarea);
  
   var templateArea = $('<textarea id="template-edit" rows="20" cols="70"/>');
   templateArea.val( Host.getTemplate() );
   $('div#templates div#template_area', markup).append(templateArea);
   
   //$('#templates', markup).append($('<button>'));
    $('div#templates div#template_controls button#template_save',markup).button().click(function() {
      //UI.alert("Saving template:\n"+templateArea.val() );
      
      Host.set_persistent('default_template',templateArea.val() );
    }); // save template
    
  // TODO: Currently, this is hard-coded, but should be made customizable via the "articles" tab at some point ...
  var articles = [
    // NOTE: category must match an existing <optgroup> above, title must match an existing wiki article
    {category:'support', name:'Frequently asked questions', url:''},
    {category:'support', name:'Asking for help', url:''},
    {category:'news', name:'Next newsletter', url:''},
    {category:'news', name:'Next changelog', url:''},
    {category:'release', name:'Release plan/Lessons learned', url:''}, // TODO: use wikimedia template
    {category:'develop', name:'Nasal library', url:''},
    {category:'develop', name:'Canvas Snippets', url:''},
    
  ];
    
    // TODO: this should be moved elsewhere
    function updateArticleList(selector) {
    $.each(articles, function (i, article) {
    $(selector+ ' optgroup#'+article.category, markup).append($('<option>', { 
        value: article.name, // FIXME: just a placeholder for now
        text : article.name 
    })); //append option
   }); // foreach
    } // updateArticleList
    
    // add the article list to the corresponding dropdown menus
    updateArticleList('select#article_select');
        
    // populate watchlist (prototype for now)
    // TODO: generalize & refactor: url, format
      
    // https://www.mediawiki.org/wiki/API:Watchlist
    // http://wiki.flightgear.org/api.php?action=query&list=watchlist
      var watchlist_url = 'http://wiki.flightgear.org/api.php?action=query&list=watchlist&format=json';
      Host.download(watchlist_url, function(response) {
        try {
       var watchlist = JSON.parse(response.responseText);
            
       //$('div#options select#section_select', markup).empty(); // delete all sections
      
      $.each(watchlist.query.watchlist, function (i, article) {
      $('div#options select#article_select optgroup#watchlist', markup).append($('<option>', { 
        value: article.title, //FIXME just a placeholder for now
        text : article.title 
    }));
   }); //foreach section

        }
        catch (e) {
          UI.alert(e.message);
        }
      }); // download & populate watchlist
      
    
    // register an event handler for the main tab, so that article specific sections can be retrieved
    $('div#options select#article_select', markup).change(function() {
      var article = this.value;
      
    // HACK: try to get a login token (actually not needed just for reading ...)
    Host.download('http://wiki.flightgear.org/api.php?action=query&prop=info|revisions&intoken=edit&rvprop=timestamp&titles=Main%20Page', function (response) {
    var message = 'FlightGear wiki login status (AJAX):';
    var status = response.statusText;
    
    // populate dropdown menu with article sections
    if (status === 'OK') {
    
      // Resolve redirects: https://www.mediawiki.org/wiki/API:Query#Resolving_redirects
      var section_url = 'http://wiki.flightgear.org/api.php?action=parse&page='+encodeURIComponent(article)+'&prop=sections&format=json&redirects';
      Host.download(section_url, function(response) {
        try {
       var sections = JSON.parse(response.responseText);
            
       $('div#options select#section_select', markup).empty(); // delete all sections
      
      $.each(sections.parse.sections, function (i, section) {
      $('div#options select#section_select', markup).append($('<option>', { 
        value: section.line, //FIXME just a placeholder for now
        text : section.line 
    }));
   }); //foreach section

        }
        catch (e) {
          UI.alert(e.message);
        }
             
      }); //download sections
     
      
      
    } // login status is OK

      
  }); // Host.download() call, i.e. we have a login token
      
    }); // on select change
    
  // init the tab stuff
  markup.tabs();
  
  var diagParam = {
      title: 'Instant Cquotes ' + Host.getScriptVersion(),
      modal: true,
      width: 700,
      buttons: [
        {
          text:'reported speech',
          click: function() {
            textarea.val(createCquote(original,true));
          }
        },
        
        {
          text: 'Copy',
          click: function () {
            Host.setClipboard(msg);
            $(this).dialog('close');
          }
        }
        
      ]
  };
    
  // actually show our tabbed dialog using the params above
  markup.dialog(diagParam);
    
    
  } // jQueryTabbed() 
  
}; // output methods

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO: we can use an online API to  help with some of this: http://www.eslnow.org/reported-speech-converter/
// See also: http://blog.mashape.com/list-of-25-natural-language-processing-apis/
// http://text-processing.com/docs/phrases.html
// http://www.alchemyapi.com/
// https://words.bighugelabs.com/api.php
// https://www.wordsapi.com/
// http://www.dictionaryapi.com/
// https://www.textrazor.com/
// http://www.programmableweb.com/news/how-5-natural-language-processing-apis-stack/analysis/2014/07/28

var speechTransformations = [
// TODO: support aliasing using vectors: would/should 
// ordering is crucial here (most specific first, least specific/most generic last)
 
// first, we start off  by expanding short forms: http://www.learnenglish.de/grammar/shortforms.html
// http://www.macmillandictionary.com/thesaurus-category/british/short-forms
 
  {query:/couldn\'t/gi, replacement:'could not'},
  {query:/I could not/gi, replacement:'$author could not'},
  
  {query:/I\'m/gi, replacement:'I am'},
  {query:/I am/gi, replacement:'$author is'},
  
  {query:/I\'ve/, replacement:'I have'},
  {query:/I have had/, replacement:'$author had'},
  
  
  {query:/can(\'|\’)t/gi, replacement:'cannot'},
  
  {query:/I(\'|\’)ll/gi, replacement:'$author will'},
  {query:/I(\'|\’)d/gi, replacement:'$author would'},
  
  {query:/I have done/gi, replacement:'$author has done'},
  {query:/I\'ve done/gi, replacement:'$author has done'}, //FIXME. queries should really be vectors ...
  
  {query:/I believe/gi, replacement:'$author suggested'},
  {query:/I think/gi, replacement:'$author suggested'},
  {query:/I guess/gi, replacement:'$author believes'},
  
  {query:/I can see that/gi, replacement:'$author suggested that'},
  
  
  {query:/I have got/gi, replacement:'$author has got'},
  {query:/I\'ve got/gi, replacement:'$author has got'},
  
  {query:/I\'d suggest/gi, replacement:'$author would suggest'},
  
  {query:/I\’m prototyping/gi, replacement:'$author is prototyping'},
  
  {query:/I myself/gi, replacement:'$author himself'},
  {query:/I am/gi, replacement:' $author is'},
  
  {query:/I can see/gi, replacement:'$author can see'},
  {query:/I can/gi, replacement:'$author can'},
  {query:/I have/gi, replacement:'$author has'},
  {query:/I should/g, replacement:'$author should'},
  {query:/I shall/gi, replacement:'$author shall'},
  {query:/I may/gi, replacement:'$author may'},
  {query:/I will/gi, replacement:'$author will'},
  {query:/I would/gi, replacement:'$author would'},
  {query:/by myself/gi, replacement:'by $author'},
  {query:/and I/gi, replacement:'and $author'},
  {query:/and me/gi, replacement:'and $author'},
  {query:/and myself/gi, replacement:'and $author'}
  
  
  // least specific stuff last (broad/generic stuff is kept as is, with author clarification added in parentheses)
  /*
  {query:/I/, replacement:'I ($author)'},
  
  {query:/me/, replacement:'me ($author)'},
  {query:/my/, replacement:'my ($author)'},
  {query:/myself/, replacement:'myself ($author)'},
  {query:/mine/, replacement:'$author'}
  */
];

// try to assist in transforming speech using the transformation vector passed in
// still needs to be exposed via the UI
function transformSpeech(text, author, gender, transformations) {
  // WIP: foreach transformation in vector, replace the search pattern with the matched string (replacing author/gender as applicable)
  //alert("text to be transformed:\n"+text);
  for(var i=0;i< transformations.length; i++) {
    var token = transformations[i];
    // patch the replacement string using the correct author name 
    var replacement = token.replacement.replace(/\$author/gi, author);
    text = text.replace(token.query, replacement);
  } // end of token transformation
  console.log("transformed text is:"+text);
  return text;
} // transformSpeech

// run a self-test

(function() {
var author ="John Doe";
var transformed = transformSpeech("I have decided to commit a new feature", author, null, speechTransformations );
if (transformed !== author+" has decided to commit a new feature")
  Host.dbLog("FIXME: Speech transformations are not working correctly");
}) ();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
// Conversion for forum emoticons
var EMOTICONS = [
  [/:shock:/g,
  'O_O'],
  [
    /:lol:/g,
    '(lol)'
  ],
  [
    /:oops:/g,
    ':$'
  ],
  [
    /:cry:/g,
    ';('
  ],
  [
    /:evil:/g,
    '>:)'
  ],
  [
    /:twisted:/g,
    '3:)'
  ],
  [
    /:roll:/g,
    '(eye roll)'
  ],
  [
    /:wink:/g,
    ';)'
  ],
  [
    /:!:/g,
    '(!)'
  ],
  [
    /:\?:/g,
    '(?)'
  ],
  [
    /:idea:/g,
    '(idea)'
  ],
  [
    /:arrow:/g,
    '(->)'
  ],
  [
    /:mrgreen:/g,
    'xD'
  ]
];
// ##################
// # Main functions #
// ##################


// the required trigger is host specific (userscript vs. addon vs. android etc)
// for now, this merely wraps window.load mapping to the instantCquotoe callback below
Host.registerTrigger();


// FIXME: function is currently referenced in CONFIG hash - event_handler, so cannot be easily moved across
// The main function
// TODO: split up, so that we can reuse the code elsewhere
function instantCquote(sel) {
  var profile = getProfile();
  
  // TODO: use config hash here
  var selection =  document.getSelection(),
  post_id=0;
  
  try {
    post_id = getPostId(selection, profile);
  } 
  catch (error) {
    Host.dbLog('Failed extracting post id\nProfile:' + profile);
    return;
  }
  if (selection.toString() === '') {
    Host.dbLog('No text is selected, aborting function');
    return;
  }
  if (!checkValid(selection, profile)) {
    Host.dbLog('Selection is not valid, aborting function');
    return;
  }
  try {
    transformationLoop(profile, post_id);
  }
  catch(e) {
    UI.alert("Transformation loop:\n"+e.message);
  }
} // instantCquote

  // TODO: this needs to be refactored so that it can be also reused by the async/AJAX mode
  // to extract fields in the background (i.e. move to a separate function)
function transformationLoop(profile, post_id) {
  var output = {}, field;
  Host.dbLog("Starting extraction/transformation loop");
  for (field in profile) {
    if (field === 'name') continue;
    if (field ==='type' || field === 'event' || field === 'event_handler') continue; // skip fields that don't contain xpath expressions
    Host.dbLog("Extracting field using field id:"+post_id);
    var fieldData = extractFieldInfo(profile, post_id, field);
    var transform = profile[field].transform;
    if (transform !== undefined) {
      Host.dbLog('Field \'' + field + '\' before transformation:\n\'' + fieldData + '\'');
      fieldData = applyTransformations(fieldData, transform);
      Host.dbLog('Field \'' + field + '\' after transformation:\n\'' + fieldData + '\'');
    }
    output[field] = fieldData;
  } // extract and transform all fields for the current profile (website)
  Host.dbLog("extraction and transformation loop finished");
  output.content = stripWhitespace(output.content);
  
  var outputPlain = createCquote(output);
  outputText(outputPlain, output);
} // transformationLoop()



/// #############

function runProfileTests() {
  
  for (var profile in CONFIG) {
    if (CONFIG[profile].type != 'archive' || !CONFIG[profile].enabled ) continue; // skip the wiki entry, because it's not an actual archive that we need to test
    // should be really moved to downloadPostign
    if (CONFIG[profile].content.xpath === '') console.log("xpath for content extraction is empty, cannot procedurally extract contents");
    for (var test in CONFIG[profile].tests) {
      var required_data = CONFIG[profile].tests[test];
      var title = required_data.title;
      //dbLog('Running test for posting titled:' + title);
      // fetch posting via getPostingDataAJAX() and compare to the fields we are looking for (author, title, date)
      //getPostingDataAJAX(profile, required_data.url);
      //alert("required title:"+title);
    } // foreach test

  } // foreach profile (website)
  
} //runProfileTests

function selfCheckDialog() {
  var sections = '<h3>Important APIs:</h3><div id="api_checks"></div>';


  try {
   runProfileTests.call(undefined); // check website profiles
  }
  catch (e) {
      UI.alert(e.message);
  }
  
  for (var profile in CONFIG) {
    // TODO: also check if enabled or not
    if (CONFIG[profile].type != 'archive') continue; // skip the wiki entry, because it's not an actual archive that we need to test
    var test_results = '';
    for (var test in CONFIG[profile].tests) {
      // var fieldData = extractFieldInfo(profile, post_id, 'author');
      test_results += CONFIG[profile].tests[test].title + '<p/>';
    }
    sections +='<h3>' + profile + ':<font color="blue">'+ CONFIG[profile].url_reg+'</font></h3><div><p>' + test_results + '</p></div>\n';
  }  // https://jqueryui.com/accordion/
  
 
  var checkDlg = $('<div id="selfCheck" title="Self Check dialog"><p><div id="accordion">' + sections + '</div></p></div>');
  
   // run all API tests, invoke the callback to obtain the status
  Environment.runAPITests(Host, function(meta) {
  
  //console.log('Running API test '+meta.name);
    
  meta.test(function(result) {
   var status = (result)?'success':'fail';
   var test = $("<p></p>").text('Running API test '+meta.name+':'+status); 
   $('#api_checks', checkDlg).append(test);
  }); // update tests results
    
  }); // runAPITests
  
  
  
  /*
  [].forEach.call(CONFIG, function(profile) {
    alert("profile is:"+profile);
  [].forEach.call(CONFIG[profile].tests, function(test) {
    
    //UI.alert(test.url);
    Host.downloadPosting(test.url, function(downloaded) {
      alert("downloaded:");
      //if (test.title == downloaded.title) alert("titles match:"+test.title);
    }); //downloadPosting
  }); //forEach test
  }); //forEach profile
  */
  
  //$('#accordion',checkDlg).accordion();
  checkDlg.dialog({
    width: 700,
    height: 500,
    open: function () {
      // http://stackoverflow.com/questions/2929487/putting-a-jquery-ui-accordion-in-a-jquery-ui-dialog
      $('#accordion').accordion({
        autoHeight: true
      });
    }
  }); // show dialog
} // selfCheckDialog


// show a simple configuration dialog (WIP)
function setupDialog() {
  //alert("configuration dialog is not yet implemented");
  var checked = (Host.get_persistent('debug_mode_enabled', false) === true) ? 'checked' : '';
  //dbLog("value is:"+get_persistent("debug_mode_enabled"));
  //dbLog("persistent debug flag is:"+checked);
  var setupDiv = $('<div id="setupDialog" title="Setup dialog">NOTE: this configuration dialog is still work-in-progress</p><label><input id="debugcb" type="checkbox"' + checked + '>Enable Debug mode</label><p/><div id="progressbar"></div></div>');
  setupDiv.click(function () {
    //alert("changing persistent debug state");
    Host.set_persistent('debug_mode_enabled', $('#debugcb').is(':checked'));
  });
  //MediaWiki editing stub, based on: https://www.mediawiki.org/wiki/API:Edit#Editing_via_Ajax
  //only added here to show some status info in the setup dialog
  Host.download('http://wiki.flightgear.org/api.php?action=query&prop=info|revisions&intoken=edit&rvprop=timestamp&titles=Main%20Page', function (response) {
    var message = 'FlightGear wiki login status (AJAX):';
    var status = response.statusText;
    var color = (status == 'OK') ? 'green' : 'red';
    Host.dbLog(message + status);
    var statusDiv = $('<p>' + message + status + '</p>').css('color', color);
    setupDiv.append(statusDiv);
  });
  setupDiv.dialog();
} // setupDialog


// this  can be used to download/cache $FG_ROOT/options.xml so that fgfs CLI arguments can be recognized and post-processed automatically
// which can help transforming postings correctly
function downloadOptionsXML() {

  // download $FG_ROOT/options.xml
          Host.download("https://sourceforge.net/p/flightgear/fgdata/ci/next/tree/options.xml?format=raw", function(response) {
            var xml = response.responseText;
            var doc = Host.make_doc(xml, 'text/xml');
            // https://developer.mozilla.org/en-US/docs/Web/API/XPathResult
            var options = Host.eval_xpath(doc, '//*/option', XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            
            // http://help.dottoro.com/ljgnejkp.php
            Host.dbLog("Number of options found in options.xml:"+options.snapshotLength);
            
            // http://help.dottoro.com/ljtfvvpx.php
            
              // https://sourceforge.net/p/flightgear/fgdata/ci/next/tree/options.xml
              
            
          }); // end of options.xml download

  
} // downloadOptionsXML

function getProfile(url=undefined) {
  
  if(url === undefined) 
    url=window.location.href;
  else
    url=url;
  
  Host.dbLog("getProfile call URL is:"+url);
  
  for (var profile in CONFIG) {
    if (url.match(CONFIG[profile].url_reg) !== null) {
      Host.dbLog('Matching website profile found');
      var invocations = Host.get_persistent(Host.getScriptVersion(), 0);
      Host.dbLog('Number of script invocations for version ' + Host.getScriptVersion() + ' is:' + invocations);

      // determine if we want to show a config dialog
      if (invocations === 0) {
        Host.dbLog("ask for config dialog to be shown");
        var response = UI.confirm('This is your first time running version ' + Host.getScriptVersion() + '\nConfigure now?');
        if (response) {
                  
          // show configuration dialog (jQuery)
          setupDialog();
        } 
        else {
        } // don't configure

      }      
      
      // increment number of invocations, use the script's version number as the key, to prevent the config dialog from showing up again (except for updated scripts)
      // FIXME: this is triggered/incremented by each click ...
      Host.dbLog("increment number of script invocations");
      Host.set_persistent(Host.getScriptVersion(), invocations + 1);
      return CONFIG[profile];
    } // matched website profile
    Host.dbLog('Could not find matching URL in getProfile() call!');
  } // for each profile
}// Get the HTML code that is selected

function getSelectedHtml() {
  // From http://stackoverflow.com/a/6668159
  var html = '',
  selection = document.getSelection();
  if (selection.rangeCount) {
    var container = document.createElement('div');
    for (var i = 0; i < selection.rangeCount; i++) {
      container.appendChild(selection.getRangeAt(i).cloneContents());
    }
    html = container.innerHTML;
  }
  Host.dbLog('instantCquote(): Unprocessed HTML\n\'' + html + '\'');
  return html;
}// Gets the selected text

function getSelectedText() {
  return document.getSelection().toString();
}// Get the ID of the post
// (this needs some work so that it can be used by the AJAX mode, without an actual selection)

function getPostId(selection, profile, focus) {
  if (focus !== undefined) {
    Host.dbLog("Trying to get PostId with defined focus");
    selection = selection.focusNode.parentNode;
  } else {
    Host.dbLog("Trying to get PostId with undefined focus");
    selection = selection.anchorNode.parentNode;
  }
  while (selection.id.match(profile.content.idStyle) === null) {
    selection = selection.parentNode;
  }
  Host.dbLog("Selection id is:"+selection.id);
  return selection.id;
}

// Checks that the selection is valid
function checkValid(selection, profile) {
  var ret = true,
  selection_cp = {
  },
  tags = profile.content.parentTag;
  for (var n = 0; n < 2; n++) {
    if (n === 0) {
      selection_cp = selection.anchorNode.parentNode;
    } else {
      selection_cp = selection.focusNode.parentNode;
    }
    while (true) {
      if (selection_cp.tagName === 'BODY') {
        ret = false;
        break;
      } else {
        var cont = false;
        for (var i = 0; i < tags.length; i++) {
          if (selection_cp[tags[0]] === tags[i]) {
            cont = true;
            break;
          }
        }
        if (cont) {
          break;
        } else {
          selection_cp = selection_cp.parentNode;
        }
      }
    }
  }
  ret = ret && (getPostId(selection, profile) === getPostId(selection, profile, 1));
  return ret;
}// Extracts the raw text from a certain place, using an XPath

function extractFieldInfo(profile, id, field) {
  
  if (field === 'content') {
    Host.dbLog("Returning content (selection)");
    return profile[field].selection();
  } else {
    Host.dbLog("Extracting field via xpath:"+field);
    var xpath = '//*[@id="' + id + '"]/' + profile[field].xpath;
    return Host.eval_xpath(document, xpath).stringValue; // document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null).stringValue;
  }
}// Change the text using specified transformations

function applyTransformations(fieldInfo, trans) { 
    for (var i = 0; i < trans.length; i++) {
      fieldInfo = trans[i](fieldInfo);
      Host.dbLog('applyTransformations(): Multiple transformation, transformation after loop #' + (i + 1) + ':\n\'' + fieldInfo + '\'');
    }
    return fieldInfo;
  
} //applyTransformations

// Formats the quote

function createCquote(data, indirect_speech=false) {
 if(!indirect_speech)
   return nonQuotedRef(data); // conventional/verbatim selection
  else { 
    // pattern match the content using a vector of regexes
    data.content = transformSpeech(data.content, data.author, null, speechTransformations );
    return nonQuotedRef(data);
  }
}

function nonQuotedRef(data) { //TODO: rename 
  var template = Host.getTemplate();
  
  var substituted = template
  .replace('$CONTENT', data.content)
  .replace('$URL',data.url)
  .replace('$TITLE',data.title)  
  .replace('$AUTHOR',data.author)
  .replace('$DATE',datef(data.date))
  .replace('$ADDED',datef(data.date))
  .replace('$SCRIPT_VERSION', Host.getScriptVersion() );
  
  return substituted; 
}// 

// Output the text.
// Tries the jQuery dialog, and falls back to window.prompt()

function outputText(msg, original) {
  try {
    OUTPUT.jQueryTabbed(msg, original); 
  } 
  catch (err) {
    msg = msg.replace(/&lt;\/syntaxhighligh(.)>/g, '</syntaxhighligh$1');
    OUTPUT.msgbox(msg);
  }
}

// #############
// # Utilities #
// #############

function extract(regex) {
  return function (text) {
    return text.match(regex) [1];
  };
}
function prepend(prefix) {
  return function (text) {
    return prefix + text;
  };
}
function removeComments(html) {
  return html.replace(/<!--.*?-->/g, '');
}// Not currently used (as of June 2015), but kept just in case


// currently unused
function escapePipes(html) {
  html = html.replace(/\|\|/g, '{{!!}n}');
  html = html.replace(/\|\-/g, '{{!-}}');
  return html.replace(/\|/g, '{{!}}');
}// Converts HTML <a href="...">...</a> tags to wiki links, internal if possible.

function a2wikilink(html) {
  // Links to wiki images, because
  // they need special treatment, or else they get displayed.
  html = html.replace(/<a.*?href="http:\/\/wiki\.flightgear\.org\/File:(.*?)".*?>(.*?)<\/a>/g, '[[Media:$1|$2]]');
  // Wiki links without custom text.
  html = html.replace(/<a.*?href="http:\/\/wiki\.flightgear\.org\/(.*?)".*?>http:\/\/wiki\.flightgear\.org\/.*?<\/a>/g, '[[$1]]');
  // Links to the wiki with custom text
  html = html.replace(/<a.*?href="http:\/\/wiki\.flightgear\.org\/(.*?)".*?>(.*?)<\/a>/g, '[[$1|$2]]');
  // Remove underscores from all wiki links
  var list = html.match(/\[\[.*?\]\]/g);
  if (list !== null) {
    for (var i = 0; i < list.length; i++) {
      html = html.replace(list[i], underscore2Space(list[i]));
    }
  }  // Convert non-wiki links
  // TODO: identify forum/devel list links, and use the AJAX/Host.download helper to get a title/subject for unnamed links (using the existing xpath/regex helpers for that)

  html = html.replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$1 $2]');
  // Remove triple dots from external links.
  // Replace with raw URL (MediaWiki converts it to a link).
  list = html.match(/\[.*?(\.\.\.).*?\]/g);
  if (list !== null) {
    for (var i = 0; i < list.length; i++) {
      html = html.replace(list[i], list[i].match(/\[(.*?) .*?\]/) [1]);
    }
  }
  return html;
}// Converts images, including images in <a> links

function img2link(html) {
  html = html.replace(/<a[^<]*?href="([^<]*?)"[^<]*?><img.*?src="http:\/\/wiki\.flightgear\.org\/images\/.*?\/.*?\/(.*?)".*?><\/a>/g, '[[File:$2|250px|link=$1]]');
  html = html.replace(/<img.*?src="http:\/\/wiki\.flightgear\.org\/images\/.*?\/.*?\/(.*?)".*?>/g, '[[File:$1|250px]]');
  html = html.replace(/<a[^<]*?href="([^<]*?)"[^<]*?><img.*?src="(.*?)".*?><\/a>/g, '(see [$2 image], links to [$1 here])');
  return html.replace(/<img.*?src="(.*?)".*?>/g, '(see the [$1 linked image])');
}// Converts smilies

function forum_smilies2text(html) {
  html = html.replace(/<img src="\.\/images\/smilies\/icon_.*?\.gif" alt="(.*?)".*?>/g, '$1');
  for (var i = 0; i < EMOTICONS.length; i++) {
    html = html.replace(EMOTICONS[i][0], EMOTICONS[i][1]);
  }
  return html;
}// Converts font formatting

function forum_fontstyle2wikistyle(html) {
  html = html.replace(/<span style="font-weight: bold">(.*?)<\/span>/g, '\'\'\'$1\'\'\'');
  html = html.replace(/<span style="text-decoration: underline">(.*?)<\/span>/g, '<u>$1</u>');
  html = html.replace(/<span style="font-style: italic">(.*?)<\/span>/g, '\'\'$1\'\'');
  return html.replace(/<span class="posthilit">(.*?)<\/span>/g, '$1');
}// Converts code blocks

function forum_code2syntaxhighlight(html) {
  var list = html.match(/<dl class="codebox">.*?<code>(.*?)<\/code>.*?<\/dl>/g),
  data = [
  ];
  if (list === null) return html;
  for (var n = 0; n < list.length; n++) {
    data = html.match(/<dl class="codebox">.*?<code>(.*?)<\/code>.*?<\/dl>/);
    html = html.replace(data[0], processCode(data));
  }
  return html;
}// Strips any whitespace from the beginning and end of a string

function stripWhitespace(html) {
  html = html.replace(/^\s*?(\S)/, '$1');
  return html.replace(/(\S)\s*?\z/, '$1');
}// Process code, including basic detection of language

function processCode(data) {
  var lang = '',
  code = data[1];
  code = code.replace(/&nbsp;/g, ' ');
  if (code.match(/=?.*?\(?.*?\)?;/) !== null) lang = 'nasal';
  if (code.match(/&lt;.*?&gt;.*?&lt;\/.*?&gt;/) !== null || code.match(/&lt;!--.*?--&gt;/) !== null) lang = 'xml';
  code = code.replace(/<br\/?>/g, '\n');
  return '<syntaxhighlight lang="' + lang + '" enclose="div">\n' + code + '\n&lt;/syntaxhighlight>';
}// Converts quote blocks to Cquotes

function forum_quote2cquote(html) {
  html = html.replace(/<blockquote class="uncited"><div>(.*?)<\/div><\/blockquote>/g, '{{cquote|$1}}');
  if (html.match(/<blockquote>/g) === null) return html;
  var numQuotes = html.match(/<blockquote>/g).length;
  for (var n = 0; n < numQuotes; n++) {
    html = html.replace(/<blockquote><div><cite>(.*?) wrote.*?:<\/cite>(.*?)<\/div><\/blockquote>/, '{{cquote|$2|$1}}');
  }
  return html;
}// Converts videos to wiki style

function vid2wiki(html) {
  // YouTube
  html = html.replace(/<div class="video-wrapper">\s.*?<div class="video-container">\s*?<iframe class="youtube-player".*?width="(.*?)" height="(.*?)" src="http:\/\/www\.youtube\.com\/embed\/(.*?)".*?><\/iframe>\s*?<\/div>\s*?<\/div>/g, '{{#ev:youtube|$3|$1x$2}}');
  // Vimeo
  html = html.replace(/<iframe src="http:\/\/player\.vimeo\.com\/video\/(.*?)\?.*?" width="(.*?)" height="(.*?)".*?>.*?<\/iframe>/g, '{{#ev:vimeo|$1|$2x$3}}');
  return html.replace(/\[.*? Watch on Vimeo\]/g, '');
}// Not currently used (as of June 2015), but kept just in case

// currently unused
function escapeEquals(html) {
  return html.replace(/=/g, '{{=}}');
}// <br> to newline.

function forum_br2newline(html) {
  html = html.replace(/<br\/?><br\/?>/g, '\n');
  return html.replace(/<br\/?>/g, '\n\n');
}// Forum list to wiki style

function list2wiki(html) {
  var list = html.match(/<ul>(.*?)<\/ul>/g);
  if (list !== null) {
    for (var i = 0; i < list.length; i++) {
      html = html.replace(/<li>(.*?)<\/li>/g, '* $1\n');
    }
  }
  list = html.match(/<ol.*?>(.*?)<\/ol>/g);
  if (list !== null) {
    for (var i = 0; i < list.length; i++) {
      html = html.replace(/<li>(.*?)<\/li>/g, '# $1\n');
    }
  }
  html = html.replace(/<\/?[uo]l>/g, '');
  return html;
}
function nowiki(text) {
  return '<nowiki>' + text + '</nowiki>';
}// Returns the correct ordinal adjective

function ordAdj(date) {
  date = date.toString();
  if (date == '11' || date == '12' || date == '13') {
    return 'th';
  } else if (date.substr(1) == '1' || date == '1') {
    return 'st';
  } else if (date.substr(1) == '2' || date == '2') {
    return 'nd';
  } else if (date.substr(1) == '3' || date == '3') {
    return 'rd';
  } else {
    return 'th';
  }
}

// Formats the date to this format: Apr 26th, 2015
function datef(text) {
  var date = new Date(text);
  return MONTHS[date.getMonth()] + ' ' + date.getDate() + ordAdj(date.getDate()) + ', ' + date.getFullYear();
}
function underscore2Space(str) {
  return str.replace(/_/g, ' ');
}

// IGNORE EVERYTHING THAT FOLLOWS: 
// This is an experiment to use GA/GP (genetic programming) to help procedurally evolve xpath and regex expressions if/when the underlying websites change
// so that we don't have to manually update/edit the script accordingly (this would also work for mobile themes etc)
// For now, this is heavily based on the genetic.js framework/examples: http://subprotocol.com/system/genetic-hello-world.html
// The idea is to evolve the xpath/regex expression by evaluating its return value against the expected/desired value
// the most important thing here is having a suitable fitness function
// 



function evolve_expression_test() {
  
try {  
var genetic = Genetic.create();

// TODO: use minimizer: redundant_bytes + duration_msec + xpath.length
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;
 
   
genetic.seed = function() {

    function randomString(len) {
        var text = "";
        var charset = "\\abcdefghijklmnopqrstuvwxyz0123456789[] ()<>*.,";
        for(var i=0;i<len;i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        
        return text;
    }
    
    // create random strings that are equal in length to solution
    return randomString( this.userData["solution"].length);
};
  

genetic.mutate = function(entity) {
    
    function replaceAt(str, index, character) {
        return str.substr(0, index) + character + str.substr(index+character.length);
    }
    
    // chromosomal drift
    var i = Math.floor(Math.random()*entity.length);
    return replaceAt(entity, i, String.fromCharCode(entity.charCodeAt(i) + (Math.floor(Math.random()*2) ? 1 : -1)));
};

genetic.crossover = function(mother, father) {

    // two-point crossover
    var len = mother.length;
    var ca = Math.floor(Math.random()*len);
    var cb = Math.floor(Math.random()*len);     
    if (ca > cb) {
        var tmp = cb;
        cb = ca;
        ca = tmp;
    }
        
    var son = father.substr(0,ca) + mother.substr(ca, cb-ca) + father.substr(cb);
    var daughter = mother.substr(0,ca) + father.substr(ca, cb-ca) + mother.substr(cb);
    
    return [son, daughter];
};
    
genetic.determineExcessBytes = function (text, needle) {
    return text.length - needle.length;
};
    
genetic.containsText = function (text, needle) {
    return text.search(needle);
};
  
genetic.isValid = function(exp) {

};
    
/* myFitness:
 * - must be a valid xpath/regex expression (try/call)
 * - must containsText the needle
 * - low relative offset in text (begin/end)
 * - excessBytes
 * - short expression  (expression length)
 * - expression footprint (runtime)
 */ 

// TODO: the fitness function should validate each xpath/regex first
    
    
genetic.fitness = function(entity) {
    var fitness = 0;
    var result;
    var validExp = 0.1;
    var hasToken = 0.1;
   
  
    var t = this.userData.tests[0].haystack;
    //var regex = new RegExp(this.userData.solution);
    //var output = t.match( new RegExp("From: (.*) <.*@.*>"))[1];  
    // TODO: use search & match for improving the fitness
  
    if (0)  
    try {
    var regex = new RegExp(entity);
    var output = t.search( regex);
    validExp = 10;
    }
    catch(e) {
    validExp = 2;    
    }
  
   
    
    var i;
    for (i=0;i<entity.length;++i) {
        // increase fitness for each character that matches
        if (entity[i] == this.userData["solution"][i])
            fitness += 1;
        
        // award fractions of a point as we get warmer
        fitness += (127-Math.abs(entity.charCodeAt(i) - this.userData["solution"].charCodeAt(i)))/50;
    }

 
    return fitness; // + (1*validExp + 1* hasToken);
};

genetic.generation = function(pop, generation, stats) {
    // stop running once we've reached the solution
    return pop[0].entity != this.userData["solution"];
};

genetic.notification = function(pop, generation, stats, isFinished) {

    function lerp(a, b, p) {
        return a + (b-a)*p;
    }
    
    var value = pop[0].entity;
    this.last = this.last||value;
    
    if (pop != 0 && value == this.last)
        return;
    
    
    var solution = [];
    var i;
    for (i=0;i<value.length;++i) {
        var diff = value.charCodeAt(i) - this.last.charCodeAt(i);
        var style = "background: transparent;";
        if (diff > 0) {
            style = "background: rgb(0,200,50); color: #fff;";
        } else if (diff < 0) {
            style = "background: rgb(0,100,50); color: #fff;";
        }

        solution.push("<span style=\"" + style + "\">" + value[i] + "</span>");
    }
  
    var t = this.userData.tests[0].haystack;
    //console.log("haystack is:"+t);
    // "From: John Doe <John@do...> - 2020-07-02 17:36:03", needle: "John Doe"}, /From: (.*) <.*@.*>/
    var regex = new RegExp(this.userData.solution);
    //var output = t.match( new RegExp("From: (.*) <.*@.*>"))[1];  
    // TODO: use search & match for improving the fitness
    var output = t.search( new RegExp(value));
    
    
    var buf = "";
    buf += "<tr>";
    buf += "<td>" + generation + "</td>";
    buf += "<td>" + pop[0].fitness.toPrecision(5) + "</td>";
    buf += "<td>" + solution.join("") + "</td>";
    buf += "<td>" + output + "</td>";
    buf += "</tr>";
    $("#results tbody").prepend(buf);
    
    this.last = value;
};
  
  
  /*
genetic.notification2 = function(pop, generation, stats, isFinished) {

    function lerp(a, b, p) {
        return a + (b-a)*p;
    }
    
    var value = pop[0].entity;
    this.last = this.last||value;
    
    if (pop != 0 && value == this.last)
        return;

    
    var solution = [];
    var i;
    for (i=0;i<value.length;++i) {
    
    solution.push(value[i]);
 } 
    console.log("Generation:"+ generation + " Fitness:" + pop[0].fitness.toPrecision(5) + " Solution:" + solution.join(""));
  
    this.last = value;
};
  */
    
      
var config = {
            "iterations": 4000
            , "size": 250
            , "crossover": 0.3
            , "mutation": 0.4
            , "skip": 30 // notifications
            //, "webWorkers": false
        };


/*
var profile = CONFIG['Sourceforge Mailing list'];
var posting = profile.tests[0];
var author_xpath = profile.title.xpath;
*/

var regexTests = [
  {haystack: "From: John Doe <John@do...> - 2020-07-02 17:36:03", needle: "John Doe"}, 
  {haystack: "From: Marc Twain <Marc@ta...> - 2010-01-03 07:36:03", needle: "Marc Twain"},
  {haystack: "From: George W. Bush <GWB@wh...> - 2055-11-11 17:33:13", needle: "George W. Bush"}
];
  
// the regex we want to evolve
var solution = "From: (.*) <.*@.*>";

// let's assume, we'd like to evolve a regex expression like this one
var userData = {
            solution: solution,
            tests: regexTests                         
};    
    
genetic.evolve(config, userData);

    
//console.log("genetic.js is loaded and working, but disabled for now");    
    
  
} // try
catch (e) {
  console.log("genetic.js error:\n" +e.message);
} // catch
  
} // evolveExpression_test()


if(0) //TODO: expose via development tab
try {
  // https://github.com/cazala/synaptic
  var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
  
  function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new Layer(input);
    var hiddenLayer = new Layer(hidden);
    var outputLayer = new Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;
  
var myPerceptron = new Perceptron(2,3,1);
var myTrainer = new Trainer(myPerceptron);

myTrainer.XOR(); // { error: 0.004998819355993572, iterations: 21871, time: 356 }

myPerceptron.activate([0,0]); // 0.0268581547421616
myPerceptron.activate([1,0]); // 0.9829673642853368
myPerceptron.activate([0,1]); // 0.9831714267395621
myPerceptron.activate([1,1]); // 0.02128894618097928
  
   
console.log("Syntaptic loaded");
} catch(e) {
  UI.alert(e.message);
}
