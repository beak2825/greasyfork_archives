// ==UserScript==
// @name          tradingview text highlighter
// @author        @danalec
// @namespace     @danalec
// @version       20201015
// @description   highlights text user-defined text based on J.Scher's work
// @include       *://*.tradingview.com/*
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM.setValue
// @grant         GM_getValue
// @grant         GM.getValue
// @grant         GM_getResourceURL
// @grant         GM.getResourceUrl
// @copyright     @danalec
// @downloadURL https://update.greasyfork.org/scripts/405031/tradingview%20text%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/405031/tradingview%20text%20highlighter.meta.js
// ==/UserScript==

var script_about = "https://keybase.io/danalec";

var hlframe, hlobjDefault, kwhieditstyle, hljson, hlobj, hlkeys, kwold, hlold, hlbtnvis, hlprecode, hlnextset, hbtndisp;
var GM4 = (typeof GM_getValue === "undefined") ? true : false;

async function THS_init(){
  if (!GM4){
    hlframe = GM_getValue("hlframe", ""); // get iframe pref
  } else {
    hlframe = await GM.getValue("hlframe", "");
  }
  if (hlframe == ""){
    hlframe = "none";
    if (!GM4){
      GM_setValue("hlframe", hlframe);
    } else {
      await GM.setValue("hlframe", hlframe);
    }
  }
  
  if ((window.self !== window.top) && (hlframe != "any")) { // framed page
    if (hlframe == "none") return; 
    if (hlframe == "same") {
      console.log(window.self.location.hostname + " vs " + window.top.location.hostname);
    }
  }

  // sample keyword+style object to get started
  hlobjDefault = {
    "set100" : {
      keywords : "^\\bXLV\\b|\^\\bXLK\\b|\^\\bXLY\\b|\^\\bXLI\\b|\^\\bIYR\\b|\^\\bXLE\\b|\^\\bBLK\\b|\^\\bQQQ\\b|\^\\bSPY\\b|\^\\bXLU\\b|\^\\bXLP\\b|\^\\bXLF\\b|\^\\bEEM\\b|\^\\bEWJ\\b|\^\\bEWZ\\b|\^\\bGDX\\b|\^\\bHYG\\b|\^\\bIJR\\b|^\\bACN\\b|\^\\bADBE\\b|\^\\bBIDU\\b|\^\\bDOCU\\b|\^\\bEBAY\\b|\^\\bETSY\\b|\^\\bFB\\b|\^\\bGOOG\\b|\^\\bIBM\\b|\^\\bORCL\\b|\^\\bSMAR\\b|\^\\bTWTR\\b|\^\\bUBER\\b|\^\\bZM\\b|\^\\bMSFT\\b|^\\bWMT\\b|\^\\bLOW\\b|\^\\bBBY\\b|\^\\bCOST\\b|\^\\bBYND\\b|\^\\bDG\\b|\^\\bAMZN\\b|\^\\bBABA\\b|\^\\bUPS\\b|\^\\bUNP\\b|\^\\bPG\\b|\^\\bPEP\\b|\^\\bNKE\\b|\^\\bHD\\b|\^\\bKO\\b|^\\bBA\\b|\^\\bAAPL\\b|\^\\bAMD\\b|\^\\bCAT\\b|\^\\bRTX\\b|\^\\bLMT\\b|\^\\bNVDA\\b|\^\\bMMM\\b|\^\\bTXN\\b|\^\\bTSLA\\b|\^\\bF\\b|\^\\bGE\\b|\^\\bGM\\b|\^\\bHOG\\b|\^\\bHON\\b|\^\\bINTC\\b|^\\bBAC\\b|\^\\bC\\b|\^\\bCB\\b|\^\\bV\\b|\^\\bXOM\\b|\^\\bPYPL\\b|\^\\bGS\\b|\^\\bJPM\\b|\^\\bMA\\b|^\\bABT\\b|\^\\bUNH\\b|\^\\bPFE\\b|\^\\bMRK\\b|\^\\bGILD\\b|\^\\bJNJ\\b|\^\\bLLY\\b|\^\\bBMY\\b|\^\\bCVS\\b|\^\\bWBA\\b|^\\bROKU\\b|\^\\bWYNN\\b|\^\\bDIS\\b|\^\\bSBUX\\b|\^\\bMGM\\b|\^\\bCMCSA\\b|\^\\bEXPE\\b|\^\\bVZ\\b|\^\\bNFLX\\b|\^\\bMCD\\b|\^\\bMAR\\b|\//ig",
      type : "regex",
      hlpat : "",
      textcolor : "rgb(0,0,0)",
      backcolor : "rgb(0,255,123)",
      fontweight : "inherit",
      custom : "Old",
      enabled : "false",
      visible : "true",
      updated : ""
    },
    "set99" : {
      keywords : "^\\bAAL\\b|^\\bAAPL\\b|^\\bABBV\\b|^\\bABT\\b|^\\bACN\\b|^\\bADBE\\b|^\\bADP\\b|^\\bAIG\\b|^\\bALK\\b|^\\bALXN\\b|^\\bAMD\\b|^\\bAMGN\\b|^\\bAMT\\b|^\\bAMZN\\b|^\\bANTM\\b|^\\bAVGO\\b|^\\bAXP\\b|^\\bBA\\b|^\\bBAC\\b|^\\bBB\\b|^\\bBBY\\b|^\\bBDX\\b|^\\bBIDU\\b|^\\bBIIB\\b|^\\bBKNG\\b|^\\bBLK\\b|^\\bBMY\\b|^\\bBNS\\b|^\\bBRKB\\b|^\\bC\\b|^\\bCAT\\b|^\\bCB\\b|^\\bCM\\b|^\\bCMCSA\\b|^\\bCME\\b|^\\bCOG\\b|^\\bCOP\\b|^\\bCOST\\b|^\\bCRM\\b|^\\bCSCO\\b|^\\bCTXS\\b|^\\bCVS\\b|^\\bCVX\\b|^\\bCWH\\b|^\\bCXO\\b|^\\bD\\b|^\\bDAL\\b|^\\bDD\\b|^\\bDDOG\\b|^\\bDHR\\b|^\\bDIS\\b|^\\bDUK\\b|^\\bDXCM\\b|^\\bEA\\b|^\\bEBAY\\b|^\\bECL\\b|^\\bENB\\b|^\\bEVBG\\b|^\\bF\\b|^\\bFB\\b|^\\bFDX\\b|^\\bFDX\\b|^\\bFDX\\b|^\\bFSLY\\b|^\\bFTI\\b|^\\bFVRR\\b|^\\bGE\\b|^\\bGILD\\b|^\\bGM\\b|^\\bGOOG\\b|^\\bGRMN\\b|^\\bGS\\b|^\\bHD\\b|^\\bHLT\\b|^\\bHOG\\b|^\\bHON\\b|^\\bIBM\\b|^\\bINO\\b|^\\bINTC\\b|^\\bINTU\\b|^\\bJNJ\\b|^\\bJPM\\b|^\\bKO\\b|^\\bLIN\\b|^\\bLLY\\b|^\\bLMT\\b|^\\bLOW\\b|^\\bLRCX\\b|^\\bLRN\\b|^\\bLUV\\b|^\\bLVGO\\b|^\\bMA\\b|^\\bMAR\\b|^\\bMASI\\b|^\\bMCD\\b|^\\bMDLZ\\b|^\\bMDT\\b|^\\bMMM\\b|^\\bMNST\\b|^\\bMO\\b|^\\bMRK\\b|^\\bMRNA\\b|^\\bMS\\b|^\\bMSCI\\b|^\\bMSFT\\b|^\\bMYL\\b|^\\bNEE\\b|^\\bNFLX\\b|^\\bNKE\\b|^\\bNVAX\\b|^\\bNVDA\\b|^\\bORCL\\b|^\\bPEP\\b|^\\bPFE\\b|^\\bPG\\b|^\\bPM\\b|^\\bPNR\\b|^\\bPYPL\\b|^\\bQCOM\\b|^\\bRDFN\\b|^\\bSBAC\\b|^\\bSBUX\\b|^\\bSE\\b|^\\bSRNE\\b|^\\bSYK\\b|^\\bT\\b|^\\bTJX\\b|^\\bTMO\\b|^\\bTRV\\b|^\\bTSLA\\b|^\\bTSN\\b|^\\bTWTR\\b|^\\bTXN\\b|^\\bUBER\\b|^\\bUNH\\b|^\\bUNP\\b|^\\bUPS\\b|^\\bUSB\\b|^\\bRTX\\b|^\\bV\\b|^\\bVIAC\\b|^\\bVZ\\b|^\\bWBA\\b|^\\bWFC\\b|^\\bWHR\\b|^\\bWLTW\\b|^\\bWMT\\b|^\\bWYNN\\b|^\\bXEL\\b|^\\bXOM\\b|^\\bXP\\b|^\\bZM\\b|\//ig",
      type : "regex",
      hlpat : "",
      textcolor : "rgb(0,0,0)",
      backcolor : "rgb(0,255,123)",
      fontweight : "inherit",
      custom : "ActivTrades US Stocks",
      enabled : "true",
      visible : "true",
      updated : ""
    },
    "set98" : {
      keywords : "^\\bACWI\\b|^\\bDIA\\b|^\\bDUST\\b|^\\bDRV\\b|^\\bEEM\\b|^\\bEFA\\b|^\\bERY\\b|^\\bESGU\\b|^\\bEWJ\\b|^\\bEWZ\\b|^\\bFAS\\b|^\\bGLD\\b|^\\bGUSH\\b|^\\bHYG\\b|^\\bIBB\\b|^\\bIJR\\b|^\\bIYR\\b|^\\bJETS\\b|^\\bLABD\\b|^\\bLABU\\b|^\\bMUB\\b|^\\bNUGT\\b|^\\bQQQ\\b|^\\bSDS\\b|^\\bSOXL\\b|^\\bSOXS\\b|^\\bSPHB\\b|^\\bSPY\\b|^\\bSPXL\\b|^\\bSPXU\\b|^\\bTIP\\b|^\\bTLT\\b|^\\bTNA\\b|^\\bTQQQ\\b|^\\bTZA\\b|^\\bXBI\\b|^\\bXLE\\b|^\\bXLF\\b|^\\bXLI\\b|^\\bXLK\\b|^\\bXLP\\b|^\\bXLU\\b|^\\bXLV\\b|^\\bXLY\\b|^\\bGDX\\b|^\\bVT\\b|\//ig",
      type : "regex",
      hlpat : "",
      textcolor : "rgb(0,0,0)",
      backcolor : "rgb(0,255,123)",
      fontweight : "inherit",
      custom : "ActivTrades US ETF",
      enabled : "true",
      visible : "true",
      updated : ""
    }
  };
  kwhieditstyle = ["rgb(0,0,255)","rgb(255,255,0)","inherit",""];

  // read pref storage: keyword-style sets
  if (!GM4){
    hljson = GM_getValue("kwstyles");
  } else {
    hljson = await GM.getValue("kwstyles");
  }
  if (!hljson || hljson.length == 0){
    hlobj = hlobjDefault;
    // check for legacy preferences
    if (!GM4){
      kwold = GM_getValue("keywords");
    } else {
      kwold = await GM.getValue("keywords");
    }
    if (kwold) if(kwold.length > 0) {
      hlobj.set100.keywords = kwold.split(',').join('|');
    }
    if (!GM4){
      hlold = GM_getValue("highlightStyle");
    } else {
      hlold = await GM.getValue("highlightStyle");
    }
    if (hlold) if(hlold.length > 0) {
      // really should try to parse this, but for now...
      hlobj.set100.custom = hlold;
    }
    // save starting values
    hljson = JSON.stringify(hlobj);
    if (!GM4){
      GM_setValue("kwstyles", hljson);
    } else {
      await GM.setValue("kwstyles", hljson);
    }
  } else {
    hlobj = JSON.parse(hljson);
  }
  // global keys array
  hlkeys = Object.keys(hlobj);

  // read/set other prefs
  if (!GM4){
    hlbtnvis = GM_getValue("hlbtnvis", "");
  } else {
    hlbtnvis = await GM.getValue("hlbtnvis", "");
  }
  if (hlbtnvis == ""){
    hlbtnvis = "on";
    if (!GM4){
      GM_setValue("hlbtnvis", hlbtnvis);
    } else {
      await GM.setValue("hlbtnvis", hlbtnvis);
    }    
  }

  if (!GM4){
    hlprecode = GM_getValue("hlprecode", "");
  } else {
    hlprecode = await GM.getValue("hlprecode", "");
  }
  if (hlprecode == ""){
    hlprecode = true;
    if (!GM4){
      GM_setValue("hlprecode", hlprecode);
    } else {
      await GM.setValue("hlprecode", hlprecode);
    }    
  }

  if (!GM4){
    hlnextset = GM_getValue("hlnextset", "");
  } else {
    hlnextset = await GM.getValue("hlnextset", "");
  }
  if (hlnextset == ""){
    hlnextset = 101;
    if (!GM4){
      GM_setValue("hlnextset", hlnextset);
    } else {
      await GM.setValue("hlnextset", hlnextset);
    }    
  }
  
  // Inject CSS
  insertCSS(hlkeys);
  // first run
  THmo_doHighlight(document.body,null);

  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb){
    var THmo_chgMon = new THmo_MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight(mutation.addedNodes[i],null);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts = {childList: true, subtree: true};
    THmo_chgMon.observe(document.body, opts);
  }

  // Set up top highlight/seek bar
  var kwhibar = document.createElement("div");
  kwhibar.id = "thdtopbar";
  if (hlbtnvis == "on") var btnchk = " checked=\"checked\"";
  else var btnchk = "";
  if (hlprecode) var btnprecode = " checked=\"checked\"";
  else var btnprecode = "";
  kwhibar.innerHTML = "<form id=\"thdtopform\" onsubmit=\"return false\"><p id=\"thdtopbarhome\"><a href=\"" + script_about + "\" target=\"_blank\" title=\"Go to script install page\">JS</a></p>" +
    "<div id=\"thdtopcurrent\"><p id=\"thdtopkeywords\" title=\"Click to View, Edit, Seek, or Add Keywords\">Click to manage keyword/highlight sets &bull; <em>Add New Set</em></p>" +
    "<div id=\"thdtopdrop\" style=\"display:none;\"><div id=\"thdtable\"><table cellspacing=\"0\"><tbody id=\"kwhitbod\"></tbody></table></div><p><button id=\"btnkwhiadd\">Add New Set</button>" +
    "<span style=\"float:right\"><button id=\"btnkwhiexport\">Export Sets</button> <button id=\"btnkwhiimport\">Import Sets</button> <button id=\"thdtopdropclose\">X</button></span></p></div></div>" +
    "<div id=\"thdtopfindbuttons\"><button title=\"First match\" thdaction=\"f\"><b>l</b>&#x25c0;</button> <button title=\"Previous match\" thdaction=\"p\">&#x25c0;</button> <span id=\"thdseekdesc\">Seek</span> <button title=\"Next match\" thdaction=\"n\">&#x25b6;</button> <button title=\"Last match\" thdaction=\"l\">&#x25b6;<b>l</b></button><div id=\"thdseekfail\"></div></div>" +
    "<div id=\"thdtopoptions\"><div>Options</div><ul><li><label title=\"Float a button in the upper right corner of the document to quickly access this panel\"><input type=\"checkbox\" id=\"chkhbtn\"" + btnchk +
    "> Show H button</label></li><li><label title=\"Highlight matches in &lt;pre&gt; and &lt;code&gt; tags\"><input type=\"checkbox\" id=\"chkprecode\"" + btnprecode +
    "> Match in pre/code</label></li><li><label style=\"padding-left:4px\">Framed pages:</label><br><select id=\"hlframeselect\" size=\"3\"><option value=\"none\">No highlighting</option><option value=\"same\">Same site only</option>" +
    "<option value=\"any\">Any site</option></select></li><li><button id=\"btnthsreread\" title=\"Update from and apply stored settings\" disabled>Re-Read Saved Prefs</button></li></ul></div>" +
    "<button class=\"btnkwhiclose\" onclick=\"document.getElementById('thdtopbar').style.display='none';document.getElementById('thdtopspacer').style.display='none';return false;\" style=\"float:right\">X</button></form>" +
    "<style type=\"text/css\">#thdtopbar{position:fixed;top:0;left:0;height:26px;width:100%;padding:0;color:#024;background:#ddd;font-family:sans-serif;font-size:16px;line-height:16px;border-bottom:1px solid #024;z-index:2500;display:none} " +
    "#thdtopbar,#thdtopbar *{box-sizing:content-box;} #thdtopform{display:block;position:relative;float:left;width:100%;margin:0;border:none;} " +
    "#thdtopbarhome,#thdtopcurrent,#thdtopfindbuttons,#thdtopoptions{float:left;top:0;left:0;margin:0;padding:5px 8px 4px;border-right:1px solid #fff;font-size:16px;} " +
    "#thdtopbarhome{width:22px;text-align:center;overflow:hidden;} #thdtopbarhome a{display:block;} #thdtopbarhome a img{display:block;border:none;border-radius:3px;padding:3px;margin:-3px 0 -4px 0;background-color:#fff} " +
    "#thdtopfindbuttons{padding-bottom:1px;position:relative} #thdtopfindbuttons button{margin:-5px 0 -2px 0;width:28px;height:18px;color:#024;background:#f0f0f0;border:1px solid #024;border-radius:4px;padding:1px 3px;} " +
    "#thdtopfindbuttons button:hover{background:#ffa;} #thdseekdesc{cursor:pointer} #thdtopkeywords{margin:0;width:500px;cursor:pointer;} #thdtopkeywords em{padding: 0 2px;} #thdtopkeywords em:hover{background:#ffa;}" +
    "#thdseekfail{display:none;position:absolute;top:30px;left:15px;z-index:2001;width:200px;color:#f8f8f8;background:#b00;border-radius:6px;text-align:center;font-size:12px;padding:3px}" +
    "#thdtopkeywords span{display:inline-block;width:100%;overflow:hidden;text-overflow:ellipsis;} #thdtable{max-height:600px;overflow-y:auto;overflow-x:hidden} " +
    "#thdtopdrop{position:absolute;top:26px;left:38px;width:500px;margin:0 -1px 0 -1px;padding:0 8px 8px 8px;background:#ddd;border:1px solid #024;border-top:none;border-radius:0 0 6px 6px;} " +
    "#thdtopdrop table{width:100%;background:#fff;border-top:1px solid #000;border-left:1px solid #000;table-layout:fixed} " +
    "#thdtopdrop td{padding:4px 4px; vertical-align:top;border-right:1px solid #000;border-bottom:1px solid #000;} #thdtopdrop td div{word-wrap:break-word} #thdtopdrop p{margin-top:8px;margin-bottom:0;} " +
    "#thdtopoptions{position:relative;width:160px;height:26px;padding:0 8px;} #thdtopoptions > div{padding:5px 0 4px;} " +
    "#thdtopoptions ul{position:absolute;top:26px;left:0;width:160px;margin:0 -1px 0 -1px;padding:0 8px 8px 8px;background:#ddd;border:1px solid #024;border-top:none;border-radius:0 0 6px 6px;list-style:none;} " +
    "#thdtopoptions li{width:100%;float:left;padding:2px 0;} #thdtopoptions ul{display:none;} #thdtopoptions:hover ul{display: block;border:1px solid #024;border-top:none;} #thdtopoptions li:hover{background:#eee;}" +
    ".btnkwhiclose{float:right;font-size:11px;margin-top:2px;} .thdtype{color:#ccc;float:right;font-size:12px;padding-top:8px;} #thdtopbar label{font-weight:normal;display:inline;margin:0} #hlframeselect{margin:3px 0 3px 4px;border-radius:4px}</style>";
  document.body.appendChild(kwhibar);
  // Attach event handlers
  document.getElementById("thdtopkeywords").addEventListener("click",thddroptoggle,false);
  document.getElementById("kwhitbod").addEventListener("click",kwhiformevent,false);
  document.getElementById("kwhitbod").addEventListener("dblclick",kwhiformevent,false);
  document.getElementById("btnkwhiadd").addEventListener("click",kwhinewset,false);
  document.getElementById("btnkwhiexport").addEventListener("click",kwhiexport,false);
  document.getElementById("btnkwhiimport").addEventListener("click",kwhiimport,false);
  document.getElementById("thdtopfindbuttons").addEventListener("click",thdseek,false);
  document.getElementById("chkhbtn").addEventListener("click",kwhihbtn,false);
  document.getElementById("chkprecode").addEventListener("click",kwhiprecode,false);
  document.getElementById("btnthsreread").addEventListener("click",thsreread,false);
  document.getElementById("thdtopdropclose").addEventListener("click",kwhitopdropclose,false);
  // frame options
  document.getElementById("hlframeselect").addEventListener("change",thsframeselect,false);
  setthsframeopts();
  // Add spacer at top of body
  var divsp = document.createElement("div");
  divsp.id = "thdtopspacer";
  divsp.setAttribute("style","clear:both;display:none");
  divsp.style.height = parseInt(27 - parseInt(window.getComputedStyle(document.body,null).getPropertyValue("margin-top"))) + "px";
  document.body.insertBefore(divsp, document.body.childNodes[0]);
  // Switch JS text to icon
  var JSBTN = document.createElement("img");
  if (!GM4){
    JSBTN.src = GM_getResourceURL("mycon");
  } else { /* asynchronous*/
    JSBTN.src = await GM.getResourceUrl("mycon");
  }
  document.querySelector("#thdtopbar a").textContent = "";
  document.querySelector("#thdtopbar a").appendChild(JSBTN);
  // Add menu item
  if (!GM4) GM_registerMenuCommand("Show Text Highlight and Seek Bar - View, Edit, Add Keywords and Styles", editKW);
  // Inject H button
  if (hlbtnvis == "off") hbtndisp = ' style="display:none"';
  else hbtndisp = '';
  var dNew = document.createElement("div");
  dNew.innerHTML = '<button id="btnshowkwhi"' + hbtndisp + '>H</button><style type="text/css">#btnshowkwhi{position:fixed;top:4px;right:4px;opacity:0.2;' +
    'color:#000;background-color:#ffa;font-weight:bold;font-size:12px;border:1px solid #ccc;border-radius:4px;padding:2px 3px;z-index:1999;min-width:22px;min-height:22px}' +
    '#btnshowkwhi:hover{opacity:0.8}@media print{#btnshowkwhi{display:none;}}</style>';
  document.body.appendChild(dNew);
  document.getElementById("btnshowkwhi").addEventListener("click",editKW,false);

  // Set up add/edit form
  var kwhied = document.createElement("div");
  kwhied.id = "kwhiedit";
  kwhied.innerHTML = "<form onsubmit=\"return false;\"><p style=\"margin-top:0\"><b>Edit/Add Keywords/Highlighting</b>" +
    "<span class=\"btnkwhiclose\"><button id=\"btnkwhimax\" title=\"Maximize dialog size\">^</button>&nbsp;&nbsp;" +
    "<button onclick=\"document.getElementById('kwhiedit').style.display='none'; return false;\" title=\"Close dialog\">X</button></span>" +
    "</p><p>List longer forms of a word first to match both in full. Example: \"children|child\" will highlight both, but \"child|children\" " +
    "will only highlight child, it won't expand the selection to children.</p>" +
    "<table cellspacing=\"0\" style=\"table-layout:fixed\"><tbody><tr kwhiset=\"new\"><td style=\"width:calc(100% - 464px)\">" +
    "<p contenteditable=\"true\" style=\"border:1px dotted #000;word-wrap:break-word;display:block!important\" class=\"\">placeholder</p>" +
    "<p style=\"margin-top:2em\">Match type: <select id=\"kwhipattype\"><option value=\"string\" selected>Anywhere in a word</option>" +
    "<option value=\"word\">\"Whole\" words only</option><option value=\"regex\">Regular Expression (advanced)</option></select></p></td>" +
    "<td style=\"width:416px\" id=\"stylecontrols\"><p><span>Text color:</span> <input id=\"txtcolorinput\" type=\"color\" value=\"#000000\" title=\"Pop up color picker\"> " +
    "R:<input id=\"txtr\" type=\"number\" min=\"0\" max=\"255\" step=\"1\" style=\"width:3.25em\" value=\"0\"> " +
    "G:<input id=\"txtg\" type=\"number\" min=\"0\" max=\"255\" step=\"1\" style=\"width:3.25em\" value=\"0\"> " +
    "B:<input id=\"txtb\" type=\"number\" min=\"0\" max=\"255\" step=\"1\" style=\"width:3.25em\" value=\"0\"> " +
    "<button id=\"btntxtreset\">Reset</button></p>" +
    "<p><span>Background:</span> <input id=\"bkgcolorinput\" type=\"color\" value=\"#ffff80\" title=\"Pop up color picker\"> " +
    "R:<input id=\"bkgr\" type=\"number\" min=\"0\" max=\"255\" step=\"1\" style=\"width:3.25em\" value=\"255\"> " +
    "G:<input id=\"bkgg\" type=\"number\" min=\"0\" max=\"255\" step=\"1\" style=\"width:3.25em\" value=\"255\"> " +
    "B:<input id=\"bkgb\" type=\"number\" min=\"0\" max=\"255\" step=\"1\" style=\"width:3.25em\" value=\"128\"> <button id=\"btnbkgreset\">Reset</button></p>" +
    "<p><span>Font-weight:</span> <select id=\"fwsel\"><option value=\"inherit\" selected>inherit</option>" +
    "<option value=\"bold\"><b>bold</b></option><option value=\"normal\">not bold</option></select></p><p><span>Custom:</span> <input type=\"text\" " +
    "id=\"kwhicustom\" style=\"width:55%\"> <button id=\"kwhicustomapply\">Apply</button></p></td></tr></tbody></table>" +
    "<p><button id=\"btnkwhisave\">Save Changes</button> <button id=\"btnkwhicancel\">Discard Changes</button> " +
    "<button id=\"btnkwhiremove\">Hide Set</button> <button id=\"btnkwhirevert\" disabled>Revert Last Keyword Edit</button></p></form><style type=\"text/css\">" +
    "#kwhiedit{position:fixed;top:1px;left:150px;width:800px;height:400px;border:1px solid #000;border-radius:6px;padding:1em;color:#000;" +
    "background:#fafafa;z-index:2501;display:none} #kwhiedit table{width:100%;background:#fff;border-top:1px solid #000;" +
    "border-left:1px solid #000;} #kwhiedit td{padding:0 12px; vertical-align:top;border-right:1px solid #000;border-bottom:1px solid #000;}" +
    "#kwhiedit td p{margin-top:12px;} #stylecontrols>p>span{display:inline-block;width:6.5em;} " +
    "#stylecontrols input[type=\"color\"]{padding:0; width:24px; height:1.25em; border:none;}</style><style type=\"text/css\" id=\"kwhiedittemp\"></style></div>";
  document.body.appendChild(kwhied);
  // Attach event handlers
  document.getElementById("btnkwhisave").addEventListener("click",kwhisavechg,false);
  document.getElementById("btnkwhicancel").addEventListener("click",kwhicancel,false);
  document.getElementById("btnkwhiremove").addEventListener("click",kwhiremove,false);
  document.getElementById("btnkwhirevert").addEventListener("click",kwhirevert,false);
  document.getElementById("stylecontrols").addEventListener("input",updatestyle,false);
  document.getElementById("stylecontrols").addEventListener("change",updatecolor,false);
  document.getElementById("btntxtreset").addEventListener("click",kwhicolorreset,false);
  document.getElementById("btnbkgreset").addEventListener("click",kwhicolorreset,false);
  document.getElementById("fwsel").addEventListener("change",kwhifwchg,false);
  document.getElementById("kwhicustomapply").addEventListener("click",kwhicustom,false);
  document.getElementById("btnkwhimax").addEventListener("click",kwhimaxrestore,false);

  // Context menu options -- do not replace any existing menu!
  if (!document.body.hasAttribute("contextmenu") && "contextMenu" in document.documentElement){
    var cmenu = document.createElement("menu");
    cmenu.id = "THDcontext";
    cmenu.setAttribute("type", "context");
    cmenu.innerHTML = '<menu label="Text Highlight and Seek">' +
      '<menuitem id="THDshowbar" label="Show bar"></menuitem>' +
      '<menuitem id="THDenableset" label="Enable matching set"></menuitem>' +
      '<menuitem id="THDdisableset" label="Disable this set"></menuitem>' +
      '<menuitem id="THDnewset" label="Add new set"></menuitem>' +
      '</menu>';
    document.body.appendChild(cmenu);
    document.getElementById("THDshowbar").addEventListener("click",editKW,false);
    document.getElementById("THDenableset").addEventListener("click",cmenuEnable,false);
    document.getElementById("THDdisableset").addEventListener("click",cmenuDisable,false);
    document.getElementById("THDnewset").addEventListener("click",cmenuNewset,false);
    // attach menu and create event for filtering
    document.body.setAttribute("contextmenu", "THDcontext");
    document.body.addEventListener("contextmenu",cmenuFilter,false);
  }

  if (!GM4) GM_registerMenuCommand("TEST ONLY - flush keyword sets for Text Highlight and Seek", flushData);
}
THS_init();

// Main workhorse routine
function THmo_doHighlight(el,subset){
  if (subset) var keyset = subset;
  else var keyset = hlkeys;
  for (var j = 0; j < keyset.length; ++j) {
    var hlset = keyset[j];
    if (hlobj[hlset].visible == "true" && hlobj[hlset].enabled == "true"){
      var hlkeywords = hlobj[hlset].keywords;
      if (hlkeywords.length > 0) {
        if (hlobj[hlset].type != "regex"){
          var rQuantifiers = /[-\/\\^$*+?.()[\]{}]/g;
          hlkeywords = hlkeywords.replace(rQuantifiers, '\\$&');
          if (hlobj[hlset].type == "word"){
            hlkeywords = "\\b" + hlkeywords.replace(/\|/g, "\\b|\\b") + "\\b";
          }
        }
        //console.log("hlset:"+hlset+"\nhlkeywords:"+hlkeywords);
        var pat = new RegExp('(' + hlkeywords + ')', 'gi');
        var span = document.createElement('thdfrag');
        span.setAttribute("thdcontain","true");
        // getting all text nodes with a few exceptions
        if (hlprecode){
          var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::div[@id="thdtopbar"]) ' +
            'and not(ancestor::div[@id="kwhiedit"]) ' +
            'and not(parent::thdfrag[@txhidy15])]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        } else {
          var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::pre) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::div[@id="thdtopbar"]) ' +
            'and not(ancestor::div[@id="kwhiedit"]) ' +
            'and not(parent::thdfrag[@txhidy15])]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        }

        if (!snapElements.snapshotItem(0)) { break; }

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
          var node = snapElements.snapshotItem(i);
          // check if it contains the keywords
          if (pat.test(node.nodeValue)) {
            // create an element, replace the text node with an element
            var sp = span.cloneNode(true);
            sp.innerHTML = node.nodeValue.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(pat, '<thdfrag class="THmo '+hlset+'" txhidy15="'+hlset+'">$1</thdfrag>');
            node.parentNode.replaceChild(sp, node);
            // try to un-nest containers
            if (sp.parentNode.hasAttribute("thdcontain")) sp.outerHTML = sp.innerHTML;
          }
        }
      }
    }
  }
}
function insertCSS(setkeys){
  for (var j = 0; j < setkeys.length; ++j){
    var hlset = setkeys[j];
    if (hlobj[hlset].visible == "true"){
      var rule = "."+hlset+"{display:inline!important;";
      if (hlobj[hlset].textcolor.length > 0) rule += "color:"+hlobj[hlset].textcolor+";";
      if (hlobj[hlset].backcolor.length > 0) rule += "background-color:"+hlobj[hlset].backcolor+";";
      if (hlobj[hlset].fontweight.length > 0) rule += "font-weight:"+hlobj[hlset].fontweight+";";
      if (hlobj[hlset].custom.length > 0) rule += hlobj[hlset].custom+";";
      rule += "}";
      var setrule = document.querySelector('style[hlset="' + hlset +'"]');
      if (!setrule){
        var s = document.createElement("style");
        s.type = "text/css";
        s.setAttribute("hlset", hlset);
        s.appendChild(document.createTextNode(rule));
        document.body.appendChild(s);
      } else {
        setrule.innerHTML = rule;
      }
    }
  }
}
function editKW(e){
  refreshSetList();
  // show form
  document.getElementById("thdtopbar").style.display = "block";
  document.getElementById("thdtopspacer").style.display = "block";
}
function thdDropSetList(e){
  refreshSetList();
  document.getElementById("thdtopdrop").style.display = "block";
}
function thddroptoggle(e){
  if (document.getElementById("thdtopdrop").style.display == "none"){
    thdDropSetList();
    if (e.target.nodeName == "EM") kwhinewset();
  } else if (e.target.nodeName == "EM"){
    kwhinewset();
  } else {
    document.getElementById("thdtopdrop").style.display = "none";
  }
}
function refreshSetList(e){
  // clear old rows from form
  document.getElementById("kwhitbod").innerHTML = "";
  // populate data - hlobj is global
  for (var j = 0; j < hlkeys.length; ++j){
    var hlset = hlkeys[j];
    if (hlobj[hlset].visible == "true"){
      if (hlobj[hlset].enabled == "true") var strchk = ' checked=\"checked\"';
      else var strchk = '';
      var newrow = document.createElement("tr");
      var thdtypenote = '';
      newrow.setAttribute("kwhiset", hlset);
      if(hlobj[hlset].type != "string"){
        thdtypenote = '<span class="thdtype">' + hlobj[hlset].type + '</span>';
      } 
      if (j == 0){
        newrow.innerHTML = '<td style=\"width:286px\"><div class=\"' + hlset + '\">' + hlobj[hlset].keywords + '</div>' + thdtypenote + '</td>' +
          '<td style=\"width:195px\"><button kwhiset=\"' + hlset + '\" title=\"Bring matches into view\">Seek</button> ' +
          '<button kwhiset=\"' + hlset + '\">Edit</button> <label><input type=\"checkbox\" kwhiset=\"' + hlset + 
          '\"' + strchk + '"> Enabled </label></td>';
      } else {
        newrow.innerHTML = '<td><div class=\"' + hlset + '\">' + hlobj[hlset].keywords + '</div>' + thdtypenote + '</td>' +
          '<td><button kwhiset=\"' + hlset + '\" title=\"Bring matches into view\">Seek</button> ' +
          '<button kwhiset=\"' + hlset + '\">Edit</button> <label><input type=\"checkbox\" kwhiset=\"' + hlset + 
          '\"' + strchk + '"> Enabled </label></td>';
      }
      document.getElementById("kwhitbod").appendChild(newrow);
    }
  }
}
async function kwhiformevent(e){
  if (e.target.nodeName == "INPUT"){ // Enabled checkbox
    var hlsetnum = e.target.getAttribute("kwhiset");
    kwhienabledisable(hlsetnum, e.target.checked);
  } 
  if (e.target.nodeName == "BUTTON"){ // Call up edit form or find bar
    var hlset = e.target.getAttribute('kwhiset');
    if (e.target.textContent == "Edit"){
      // need to cancel in-place editor if it's open
      kwhicancelipe(hlset);
      // set set number attribute
      document.querySelector('#kwhiedit tr').setAttribute('kwhiset', hlset);
      // set class for keywords
      document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').className = hlset;
      // enter placeholder text & type
      document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').textContent = hlobj[hlset].keywords;
      document.getElementById("kwhipattype").selectedIndex = 0;
      if (hlobj[hlset].type == "word") document.getElementById("kwhipattype").selectedIndex = 1;
      if (hlobj[hlset].type == "regex") document.getElementById("kwhipattype").selectedIndex = 2;
      // set style editing to default and override with set rules
      kwhieditstyle = ["rgb(0,0,255)","rgb(255,255,0)","inherit",""]; // defaults
      if (hlobj[hlset].textcolor.length > 0) kwhieditstyle[0] = hlobj[hlset].textcolor;
      if (hlobj[hlset].backcolor.length > 0) kwhieditstyle[1] = hlobj[hlset].backcolor;
      if (hlobj[hlset].fontweight.length > 0) kwhieditstyle[2] = hlobj[hlset].fontweight;
      if (hlobj[hlset].custom.length > 0) kwhieditstyle[3] = hlobj[hlset].custom;
      kwhiShowEditForm();
    }
    if (e.target.textContent == "Seek"){
      // need to cancel in-place editor if it's open
      kwhicancelipe(hlset);
      // Enable set if not currently enabled (2.3.5)
      var chkbx = e.target.parentNode.querySelector('input[type="checkbox"]');
      if (!chkbx.checked) chkbx.click();
      // Populate current seek set to #thdtopkeywords
      var divDataTD = e.target.parentNode.previousElementSibling;
      document.getElementById("thdtopkeywords").innerHTML = "<i>Seeking:</i> " + divDataTD.firstChild.outerHTML;
      // Store set to seek in #thdtopfindbuttons
      document.getElementById("thdtopfindbuttons").setAttribute("thdseek", hlset);
      // Close Keyword Sets form
      document.getElementById('thdtopdrop').style.display='none';
      // Send click event to the "seek first" button
      document.getElementById('thdtopfindbuttons').children[0].click();
    }
    if (e.target.textContent == "Save"){ // Check and save in-place keyword edit
      // get set number attribute
      var hlset = e.target.getAttribute("kwhiset");
      var kwtext = document.querySelector('div.'+hlset+' p.'+hlset).textContent;
      if (kwtext == hlobj[hlset].keywords){ // Nothing to save, cancel the edit
        kwhicancelipe(hlset);
        return;
      }
      // Save keyword changes WITHOUT user confirmation
      hlobj[hlset].prevkeyw = hlobj[hlset].keywords;
      hlobj[hlset].prevtype = hlobj[hlset].type;
      if (hlobj[hlset].type != "regex") hlobj[hlset].keywords = kwtext;
      else{
        hlobj[hlset].keywords = kwtext.replace(/\\/g, "\\");
        hlobj[hlset].hlpat = ""; //TODOLATER
      }
      // Set updated date/time
      hlobj[hlset].updated = (new Date()).toJSON();
      // Persist the object
      hljson = JSON.stringify(hlobj);
      if (!GM4){
        GM_setValue("kwstyles", hljson);
      } else {
        await GM.setValue("kwstyles", hljson);
      }
      // Update CSS rule and parent form
      insertCSS([hlset]);
      refreshSetList();
      // Unhighlight, re-highlight, close in-place editor
      unhighlight(hlset);
      THmo_doHighlight(document.body,[hlset]);
      kwhicancelipe(hlset);
    }
    if (e.target.textContent == "Cancel"){ // Revert in-place editor
      // get set number attribute
      var hlset = e.target.getAttribute("kwhiset");
      kwhicancelipe(hlset);
    }
    if (e.target.textContent == "Revert"){ // Restore previous keywords
      // get set number attribute
      var hlset = e.target.getAttribute("kwhiset");
      // gray the button
      document.getElementById('thsrevert' + hlset).setAttribute('disabled', 'disabled');
      // get the previous keywords (if any)
      if (hlobj[hlset].prevkeyw && hlobj[hlset].prevkeyw != '') var kwtext = hlobj[hlset].prevkeyw;
      if (!kwtext || kwtext == ''){ // uh-oh
        alert('Unable to undo, sorry!');
        document.getElementById('thsrevert' + hlset).setAttribute('disabled', 'disabled');
        return;
      }
      // Save keyword changes WITHOUT user confirmation
      hlobj[hlset].keywords = kwtext;
      hlobj[hlset].type = hlobj[hlset].prevtype;
      hlobj[hlset].prevkeyw = '';
      hlobj[hlset].prevtype = '';
      // Set updated date/time
      hlobj[hlset].updated = (new Date()).toJSON();
      // Persist the object
      hljson = JSON.stringify(hlobj);
      if (!GM4){
        GM_setValue("kwstyles", hljson);
      } else {
        await GM.setValue("kwstyles", hljson);
      }
      // Update CSS rule and parent form
      insertCSS([hlset]);
      refreshSetList();
      // Unhighlight, re-highlight
      unhighlight(hlset);
      THmo_doHighlight(document.body,[hlset]);
    }
  }
  if (e.type == "dblclick" && e.target.nodeName == "DIV"){ // Set up in-place quick editor
    if (e.target.children.length == 0) { // Ignore the double-click if the editor was already set up
      var hlset = e.target.className;
      e.target.innerHTML = '<p class="' + hlset +'" contenteditable="true" style="border:1px dotted #000">' + e.target.textContent + '</p>' +
        '<p style="background-color:#fff;font-size:0.8em"><button kwhiset="' + hlset + '" title="Update keywords for this set" style="font-size:0.8em">' +
        'Save</button> <button kwhiset="' + hlset + '" title="Keep saved keywords" style="font-size:0.8em">Cancel</button> <button kwhiset="' + 
        hlset + '" id="thsrevert' + hlset + '" title="Revert last edit" style="font-size:0.8em" disabled>Revert</button></p>';
      var rng = document.createRange();
      rng.selectNodeContents(e.target.children[0]);
      var sel = window.getSelection();        
      sel.removeAllRanges();
      sel.addRange(rng);
      if (hlobj[hlset].prevkeyw && hlobj[hlset].prevkeyw != '') {
        document.getElementById('thsrevert' + hlset).removeAttribute('disabled');
        document.getElementById('thsrevert' + hlset).setAttribute('title','Revert to "' + hlobj[hlset].prevkeyw + '"');
      }
    }
  } 
}
async function kwhienabledisable(hlsetnum,enable){
  if (enable == false) {
    // Update object and persist to GM storage
    hlobj[hlsetnum].enabled = "false";
    hljson = JSON.stringify(hlobj);
    if (!GM4){
      GM_setValue("kwstyles", hljson);
    } else {
      await GM.setValue("kwstyles", hljson);
    }
    // Unhighlight
    unhighlight(hlsetnum);
    // Clear seek info from bar if this set is there
    var seekset = document.getElementById("thdtopfindbuttons").getAttribute("thdseek");
    if (seekset){
      if(seekset.indexOf("|") > -1) seekset = seekset.split("|")[0];
      if (hlsetnum == seekset){
        document.getElementById("thdtopfindbuttons").setAttribute("thdseek","");
        document.getElementById("thdseekdesc").textContent = "Seek";
        document.getElementById("thdtopkeywords").innerHTML = "Click to manage keyword/highlight sets &bull; <em>Add New Set</em>";
      }
    } 
  } else {
    // Update object and persist to GM storage
    hlobj[hlsetnum].enabled = "true";
    hljson = JSON.stringify(hlobj);
    if (!GM4){
      GM_setValue("kwstyles", hljson);
    } else {
      await GM.setValue("kwstyles", hljson);
    }
    // Highlight
    THmo_doHighlight(document.body,[hlsetnum]);
  }
}
function kwhinewset(e,kwtext){ // call up new set form
  // set set number attribute
  document.querySelector('#kwhiedit tr').setAttribute('kwhiset', 'new');
  // clear class for keywords
  document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').className = "";
  // enter placeholder text & default type
  if (kwtext) document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').textContent = kwtext;
  else document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').textContent = "larry|moe|curly";
  document.getElementById("kwhipattype").selectedIndex = 0;
  // set style editing to defaults
  kwhieditstyle = ["rgb(0,0,255)","rgb(255,255,0)","inherit",""];
  kwhiShowEditForm();
}
function kwhiShowEditForm(){
  var rule = "#stylecontrols>p>span{";
  if (kwhieditstyle[0].length > 0) rule += "color:"+kwhieditstyle[0]+";";
  if (kwhieditstyle[1].length > 0) rule += "background-color:"+kwhieditstyle[1]+";";
  if (kwhieditstyle[2].length > 0) rule += "font-weight:"+kwhieditstyle[2]+";";
  if (kwhieditstyle[3].length > 0) rule += kwhieditstyle[3]+";";
  document.getElementById("kwhiedittemp").innerHTML = rule + "}";
  populateRGB("txt",kwhieditstyle[0]);
  populateRGB("bkg",kwhieditstyle[1]);
  document.getElementById("fwsel").value = kwhieditstyle[2];
  document.getElementById("kwhicustom").value = kwhieditstyle[3];
  updateColorInputs();
  // default the reversion button to disabled
  var rbtn = document.getElementById("btnkwhirevert");
  rbtn.setAttribute('disabled','disabled');
  if (rbtn.hasAttribute('kwhiset')) rbtn.removeAttribute('kwhiset');
  rbtn.setAttribute('title','');
  // show form
  document.getElementById("kwhiedit").style.display = "block";
  // check for possible reversion option
  var hlset = document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').className;
  if (hlset != "" && hlobj[hlset].prevkeyw && hlobj[hlset].prevkeyw != '') {
    rbtn.removeAttribute('disabled');
    rbtn.setAttribute('kwhiset',hlset);
    rbtn.setAttribute('title','Revert to "' + hlobj[hlset].prevkeyw + '"');
  }
}
function kwhiexport(e){
  prompt("JSON data\nPress Ctrl+c or right-click to copy\n ", JSON.stringify(hlobj));
}
async function kwhiimport(e){
  var txtImport = prompt("Paste in the exported data and click OK to start parsing", "");
  try{
    var objImport = JSON.parse(txtImport);
  } catch(err){
    alert("Sorry, data does not appear to be in the proper format. Here's the error according to Firefox: \n\n"+err+"\n\nHopefully you can resolve that!");
    return;
  }
  var keysImport = Object.keys(objImport);
  // Compare for duplicate set numbers
  var keysString = "|" + hlkeys.join("|") + "|";
  var counter = 0;
  for (var j = 0; j < keysImport.length; ++j){
    if(keysString.indexOf("|"+keysImport[j]+"|") > -1) counter++;
  }
  if (counter > 0){
    var arc = prompt("Detected "+counter+" of "+keysImport.length+" set numbers to be imported already exist. Do you want to:\nAdd these sets [A]\nReplace existing sets [R]\nTotally replace all existing sets [T]\nCancel the import [C]?","A");
    if (!arc) return;
    if (arc.length == 0) return;
    if (arc.toLowerCase() == "c") return;
    if (arc.toLowerCase() == "t"){
      if(!confirm("Total replacement has no error checking. Click OK to confirm total replacement, or click Cancel to only Replace matching sets.")) arc = "R";
    }
  } else {
    var arc = "A";
  }
  if (arc.toLowerCase() == "t"){ // Total replacement
    hlobj = JSON.parse(txtImport);
    // Update the global key array
    hlkeys = Object.keys(hlobj);
    // Persist the object
    hljson = JSON.stringify(hlobj);
    if (!GM4){
      GM_setValue("kwstyles", hljson);
    } else {
      await GM.setValue("kwstyles", hljson);
    }
    // Apply to page (see below)
  } else {
    for (var j = 0; j < keysImport.length; ++j){ // Add/replace individual sets
      var impset = keysImport[j];
      if(keysString.indexOf("|"+impset+"|") > -1 && arc.toLowerCase() == "r"){ // replace
        var hlset = impset;
        hlobj[hlset].keywords = objImport[impset].keywords || "keywords|not|found";
        hlobj[hlset].type = objImport[impset].type || "string";
        hlobj[hlset].hlpat = objImport[impset].hlpat || "";
        hlobj[hlset].textcolor = objImport[impset].textcolor || "rgb(0,0,255)";
        hlobj[hlset].backcolor = objImport[impset].backcolor || "rgb(255,255,0)";
        hlobj[hlset].fontweight = objImport[impset].fontweight || "inherit";
        hlobj[hlset].custom = objImport[impset].custom || "";
        hlobj[hlset].enabled = objImport[impset].enabled || "true";
        hlobj[hlset].visible = objImport[impset].visible || "true";
        hlobj[hlset].updated = (new Date()).toJSON();
      } else { // add
        if(keysString.indexOf("|"+impset+"|") > -1 && arc.toLowerCase() == "a"){
          // create a new set number instead
          var hlset = "set" + hlnextset;
          hlnextset += 1;
          if (!GM4){
            GM_setValue("hlnextset",hlnextset);
          } else {
            await GM.setValue("hlnextset",hlnextset);
          }
        } else {
          var hlset = impset;
        }
        // add the set
        hlobj[hlset] = {
          keywords : objImport[impset].keywords || "keywords|not|found",
          type: objImport[impset].type || "string",
          hlpat : objImport[impset].hlpat || "",
          textcolor : objImport[impset].textcolor || "rgb(0,0,255)",
          backcolor : objImport[impset].backcolor || "rgb(255,255,0)",
          fontweight : objImport[impset].fontweight || "inherit",
          custom : objImport[impset].custom || "",
          enabled : objImport[impset].enabled || "true",
          visible : objImport[impset].visible || "true",
          updated : objImport[impset].updated || ""
        }
      }
      // Update the global key array
      hlkeys = Object.keys(hlobj);
      // Persist the object
      hljson = JSON.stringify(hlobj);
      if (!GM4){
        GM_setValue("kwstyles", hljson);
      } else {
        await GM.setValue("kwstyles", hljson);
      }
    }
  }
  // TODO: Could an error  prevent reaching this point, for example, if the import object is missing properties due to bad editing?
  // Update CSS rule and command bar list
  insertCSS(hlkeys);
  refreshSetList();
  // Unhighlight all, re-highlight all, close dialog
  unhighlight(null);
  THmo_doHighlight(document.body);
}
async function kwhihbtn(e){
  if (e.target.checked == false){
    hlbtnvis = "off";
    if (!GM4){
      GM_setValue("hlbtnvis",hlbtnvis);
    } else {
      await GM.setValue("hlbtnvis",hlbtnvis);
    }
    document.getElementById("btnshowkwhi").style.display = "none";
  } else {
    hlbtnvis = "on";
    if (!GM4){
      GM_setValue("hlbtnvis",hlbtnvis);
    } else {
      await GM.setValue("hlbtnvis",hlbtnvis);
    }
    document.getElementById("btnshowkwhi").style.display = "";
  }
}
async function kwhiprecode(e){
  if (e.target.checked == false){
    // Update var, persist the preference, unhighlight, rehighlight
    hlprecode = false;
    if (!GM4){
      GM_setValue("hlprecode",hlprecode);
    } else {
      await GM.setValue("hlprecode",hlprecode);
    }
    unhighlight(null);
    THmo_doHighlight(document.body);
  } else {
    // Update var, persist the preference, rehighlight
    hlprecode = true;
    if (!GM4){
      GM_setValue("hlprecode",hlprecode);
    } else {
      await GM.setValue("hlprecode",hlprecode);
    }
    THmo_doHighlight(document.body);
  }
}
function kwhicancelipe(setno){
  // clean up in-place editor(s)
  if (setno && setno != ''){
    var kwdiv = document.querySelector('#kwhitbod .'+setno);
    if (kwdiv){
      kwdiv.innerHTML = hlobj[setno].keywords;
      return;
    }
  } else { // Check 'em all
    var divs = document.querySelector('#kwhitbod div');
    for (var n=0; n<divs.length; n++){
      if (divs[n].children.length > 0 && divs[n].className != '') kwhicancelipe(divs[n].className);
    }
  }
}
function kwhitopdropclose(e){
  kwhicancelipe('');
  document.getElementById('thdtopdrop').style.display='none';
}
function thsreread(e){
  //TODO
}
async function thsframeselect(e){
  var selopt = e.target.options[e.target.selectedIndex].value;
  if (hlframe != selopt) {
    hlframe = selopt;
    if (!GM4){
      GM_setValue("hlframe",hlframe);
    } else {
      await GM.setValue("hlframe",hlframe);
    }
    setthsframeopts();
  }
}
function setthsframeopts(){
  var sel = document.getElementById("hlframeselect");
  if (hlframe == "none"){
    sel.options[0].selected = true;
    sel.options[0].setAttribute("selected","selected");
  } else {
    sel.options[0].selected = false;
    if (sel.options[0].hasAttribute("selected")) sel.options[0].removeAttribute("selected");
  }
  if (hlframe == "same"){
    sel.options[1].selected = true;
    sel.options[1].setAttribute("selected","selected");
  } else {
    sel.options[1].selected = false;
    if (sel.options[1].hasAttribute("selected")) sel.options[1].removeAttribute("selected");
  }
  if (hlframe == "any"){
    sel.options[2].selected = true;
    sel.options[2].setAttribute("selected","selected");
  } else {
    sel.options[2].selected = false;
    if (sel.options[2].hasAttribute("selected")) sel.options[2].removeAttribute("selected");
  }
}
function thdseek(e){
  if (e.target.nodeName == "DIV") return; // ignore background clicks
  var seekset = e.currentTarget.getAttribute("thdseek");
  if (!seekset){ // user needs to select a set to seek in
    thdDropSetList();
  } else {
    var seekparams = seekset.split("|");
    var seekmatches = document.querySelectorAll('thdfrag[txhidy15="'+seekparams[0]+'"]');
    // Update or add total size of set; FIGURE OUT LATER: what if this changed??
    seekparams[1] = seekmatches.length;
    if (seekmatches.length > 0){
      if (e.target.nodeName == "SPAN"){ // re-scroll to the current reference
        thdshow(seekmatches[parseInt(seekparams[2])]);
      } else { // BUTTON
        var seekaction = e.target.getAttribute("thdaction");
        if (!seekaction) seekaction = "f";
        if (seekparams.length == 3){ // User has seeked in this set
          switch (seekaction){
            case "f":
              seekparams[2] = 0;
              var rtn = thdshow(seekmatches[parseInt(seekparams[2])]);
              if (rtn == false) seekagain("n");
              break;
            case "p":
              if (parseInt(seekparams[2]) > 0) {
                seekparams[2] = parseInt(seekparams[2]) - 1;
                var rtn = thdshow(seekmatches[parseInt(seekparams[2])]);
                if (rtn == false){
                  if (parseInt(seekparams[2]) > 0) seekagain("p");
                  else seekfailnotc("No previous match visible");
                } 
              } else {
                seekfailnotc("Already reached first match");
              }
              break;
            case "n":
              if (parseInt(seekparams[2]) < (seekmatches.length-1)) {
                seekparams[2] = parseInt(seekparams[2]) + 1;
                var rtn = thdshow(seekmatches[parseInt(seekparams[2])]);
                if (rtn == false){
                  if (parseInt(seekparams[2]) < (seekmatches.length-1)) seekagain("n");
                  else seekfailnotc("No later match visible");
                } 
              } else {
                seekparams[2] = (seekmatches.length-1); // in case it's too high, fix that here
                seekfailnotc("Already reached last match");
              }
              break;
            case "l":
              seekparams[2] = (seekmatches.length-1);
              var rtn = thdshow(seekmatches[parseInt(seekparams[2])]);
              if (rtn == false) seekagain("p");
              break;
          }
        } else {
          seekparams[2] = 0;
          thdshow(seekmatches[parseInt(seekparams[2])]);
        }
        document.getElementById("thdtopfindbuttons").setAttribute("thdseek", seekparams.join("|"));
        document.getElementById("thdseekdesc").textContent = (parseInt(seekparams[2])+1) + " of " + seekparams[1];
      }
    } else {
      document.getElementById("thdseekdesc").textContent = "0 of 0";
    }
  }
}
function thdshow(elt){ // this could be much prettier with animation! TODO: outline/box?
  elt.scrollIntoView();
  var rect = elt.getClientRects()[0];
  if (rect){ // scroll down one inch to avoid many fixed headers
    if (rect.top < 96) window.scroll(0, window.scrollY-96);
    return true;
  } else { // match is not visible
    return false;
  }
}
function seekagain(dir){
  switch (dir){
    case "p":
      seekfailnotc("Hidden, trying previous match...");
      window.setTimeout(function(){document.querySelector('button[thdaction="p"]').click();},250);
      break;
    case "n":
      seekfailnotc("Hidden, trying next match...");
      window.setTimeout(function(){document.querySelector('button[thdaction="n"]').click();},250);
      break;
  }
}
var evttimer;
function seekfailnotc(txt){
  var sfdiv = document.getElementById("thdseekfail");
  sfdiv.textContent = txt;
  sfdiv.style.display = "block";
  if (evttimer) window.clearTimeout(evttimer);
  evttimer = window.setTimeout(function(){document.getElementById("thdseekfail").style.display="none";}, 800);
}
function unhighlight(setnum){
  if (setnum) var tgts = document.querySelectorAll('thdfrag[txhidy15="' + setnum + '"]');
  else var tgts = document.querySelectorAll('thdfrag[txhidy15]'); // remove ALL
  for (var i=0; i<tgts.length; i++){
    // Check for co-extant parent(s) to remove potentially stranded <span>s
    var parnode = tgts[i].parentNode, parpar = parnode.parentNode, tgtspan;
    if (parnode.hasAttribute("thdcontain") && parnode.innerHTML == tgts[i].outerHTML){
      parnode.outerHTML = tgts[i].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      tgtspan = parpar;
    } else {
      tgts[i].outerHTML = tgts[i].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      tgtspan = parnode;
    }
    tgtspan.normalize();
    if (tgtspan.hasAttribute("thdcontain")){
      parnode = tgtspan.parentNode;
      if (parnode){
        if (parnode.hasAttribute("thdcontain") && parnode.innerHTML == tgtspan.outerHTML && tgtspan.querySelectorAll('thdfrag[txhidy15]').length == 0){
          parnode.outerHTML = tgtspan.innerHTML;
        } else if (parnode.innerHTML == tgtspan.outerHTML && tgtspan.querySelectorAll('thdfrag[txhidy15]').length == 0) {
          parnode.innerHTML = tgtspan.innerHTML;
        }
      }
    }
  }
}

async function kwhisavechg(e){
  // Update object, regenerate CSS if applicable, apply to document
  var hlset = document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').className;
  var kwtext = document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').textContent;
  if (hlset == ""){ 
    // create a new set number
    var hlset = "set" + hlnextset;
    hlnextset += 1;
    if (!GM4){
      GM_setValue("hlnextset",hlnextset);
    } else {
      await GM.setValue("hlnextset",hlnextset);
    }
    // add the set
    if (document.getElementById("kwhipattype").value == "regex"){
      kwtext = kwtext.replace(/\\/g, "\\");
      var hlpattxt = ""; //TODOLATER
    } else {
      var hlpattxt = "";
    }
    hlobj[hlset] = {
      keywords : kwtext,
      type : document.getElementById("kwhipattype").value,
      hlpat : hlpattxt,
      textcolor : kwhieditstyle[0],
      backcolor : kwhieditstyle[1],
      fontweight : kwhieditstyle[2],
      custom : kwhieditstyle[3],
      enabled : "true",
      visible : "true",
      updated : ""
    }
    // Update the global key array
    hlkeys = Object.keys(hlobj);
  } else {
    var oldtype = hlobj[hlset].type;
    hlobj[hlset].type = document.getElementById("kwhipattype").value;
    // Save keyword changes after user confirmation
    if (kwtext != hlobj[hlset].keywords){
      if (confirm("Save updated keywords (and other changes)?")){
        hlobj[hlset].prevkeyw = hlobj[hlset].keywords;
        hlobj[hlset].prevtype = oldtype;
        if (hlobj[hlset].type != "regex"){
          hlobj[hlset].keywords = kwtext;
        } else {
          hlobj[hlset].keywords = kwtext.replace(/\\/g, "\\");
          hlobj[hlset].hlpat = ""; //TODOLATER
        }
      } else return;
    }
    // Save style changes without confirmation
    hlobj[hlset].textcolor = kwhieditstyle[0];
    hlobj[hlset].backcolor = kwhieditstyle[1];
    hlobj[hlset].fontweight = kwhieditstyle[2];
    hlobj[hlset].custom = kwhieditstyle[3];
    // Set updated date/time
    hlobj[hlset].updated = (new Date()).toJSON();
  }
  // Persist the object
  hljson = JSON.stringify(hlobj);
  if (!GM4){
    GM_setValue("kwstyles", hljson);
  } else {
    await GM.setValue("kwstyles", hljson);
  }
  // Update CSS rule and parent form
  insertCSS([hlset]);
  refreshSetList();
  // Unhighlight, re-highlight, close dialog
  unhighlight(hlset);
  THmo_doHighlight(document.body,[hlset])
  document.getElementById('kwhiedit').style.display='none';
}
function kwhicancel(e){
  // Close dialog (fields will be refresh if it is opened again)
  document.getElementById('kwhiedit').style.display='none';
}
async function kwhiremove(e){
  var hlset = document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').className;
  if (hlset == ""){
    alert("This set has not been saved and therefore does not need to be hidden, you can just close the dialog to discard it.");
  } else {
    if (confirm("Are you sure you want to hide this set instead of editing it to your own liking?")){
      hlobj[hlset].visible = "false";
      hlobj[hlset].updated = (new Date()).toJSON();
      // Persist the object
      hljson = JSON.stringify(hlobj);
      if (!GM4){
        GM_setValue("kwstyles", hljson);
      } else {
        await GM.setValue("kwstyles", hljson);
      }
      // Update set list, remove highlighting, close form
      refreshSetList();
      unhighlight(hlset);
      document.getElementById('kwhiedit').style.display='none';
    }
  }
}
async function kwhirevert(e){
  // get set number attribute
  var hlset = e.target.getAttribute("kwhiset");
  // gray the button
  e.target.setAttribute('disabled', 'disabled');
  // get the previous keywords (if any)
  if (hlobj[hlset].prevkeyw && hlobj[hlset].prevkeyw != '') var kwtext = hlobj[hlset].prevkeyw;
  if (!kwtext || kwtext == ''){ // uh-oh
    alert('Unable to undo, sorry!');
    return;
  }
  // Save keyword changes WITHOUT user confirmation
  hlobj[hlset].keywords = kwtext;
  hlobj[hlset].type = hlobj[hlset].prevtype;
  hlobj[hlset].prevkeyw = '';
  hlobj[hlset].prevtype = '';
  // Set updated date/time
  hlobj[hlset].updated = (new Date()).toJSON();
  // Persist the object
  hljson = JSON.stringify(hlobj);
  if (!GM4){
    GM_setValue("kwstyles", hljson);
  } else {
    await GM.setValue("kwstyles", hljson);
  }
  // Update CSS rule and parent form
  insertCSS([hlset]);
  refreshSetList();
  // Unhighlight, re-highlight
  unhighlight(hlset);
  THmo_doHighlight(document.body,[hlset]);
  // Refresh the keywords and type
  document.querySelector('#kwhiedit td:nth-of-type(1) p:nth-of-type(1)').textContent = hlobj[hlset].keywords;
  document.getElementById("kwhipattype").selectedIndex = 0;
  if (hlobj[hlset].type == "word") document.getElementById("kwhipattype").selectedIndex = 1;
  if (hlobj[hlset].type == "regex") document.getElementById("kwhipattype").selectedIndex = 2;
}
function kwhicolorreset(e){
  // what set is this?
  var set = document.querySelector('#kwhiedit tr').getAttribute('kwhiset');
  // check which button, reset the RGB
  if (e.target.id == "btntxtreset"){
    if (set == "new"){
      kwhieditstyle[0] = "rgb(0,0,255)";
    } else {
      kwhieditstyle[0] = hlobj[set].textcolor;
    }
    populateRGB("txt",kwhieditstyle[0]);
    setdivstyle(["txt"]);
  }
  if (e.target.id == "btnbkgreset"){
    if (set == "new"){
      kwhieditstyle[1] = "rgb(255,255,0)";        
    } else {
      kwhieditstyle[1] = hlobj[set].backcolor;
    }
    populateRGB("bkg",kwhieditstyle[1]);
    setdivstyle(["bkg"]);
  }
  e.target.blur();
}
function populateRGB(prop,stylestring){
  var rgbvals = stylestring.substr(stylestring.indexOf("(")+1);
  rgbvals = rgbvals.substr(0,rgbvals.length-1).split(",");
  document.getElementById(prop+"r").value = parseInt(rgbvals[0]);
  document.getElementById(prop+"g").value = parseInt(rgbvals[1]);
  document.getElementById(prop+"b").value = parseInt(rgbvals[2]);
}
async function updatestyle(e){
  // validate value and apply change
  var tgt;
  if (e.id != undefined) tgt = e;
  else tgt = e.target;
  if (tgt.id.indexOf("colorinput") > -1){
    // let's wait for the change event to fire before updating
  } else if (tgt.id.indexOf("txt") == 0 || tgt.id.indexOf("bkg") == 0){
    if (isNaN(tgt.value)){
      alert("Please only use values between 0 and 255");
      return;
    }
    if (parseInt(tgt.value) != tgt.value){
      tgt.value = parseInt(tgt.value);
    }
    if (tgt.value < 0){
      tgt.value = 0;
    }
    if (tgt.value > 255){
      tgt.value = 255;
    }
    if (tgt.id.indexOf("txt") == 0) setdivstyle(["txt"]);
    if (tgt.id.indexOf("bkg") == 0) setdivstyle(["bkg"]);
  } else {
    if (tgt.id == "kwhicustom") return;
    console.log("updatestyle on "+tgt.id);
  }
}
function setdivstyle(props){
  for (var i=0; i<props.length; i++){
    switch (props[i]){
      case "txt":
        kwhieditstyle[0] = "rgb(" + document.getElementById("txtr").value + "," +
          document.getElementById("txtg").value + "," + document.getElementById("txtb").value + ")";
        break;
      case "bkg":
        kwhieditstyle[1] = "rgb(" + document.getElementById("bkgr").value + "," +
          document.getElementById("bkgg").value + "," + document.getElementById("bkgb").value + ")";
        break;
      default:
        console.log("default?");
    }
  }
  var rule = "#stylecontrols>p>span{";
  if (kwhieditstyle[0].length > 0) rule += "color:"+kwhieditstyle[0]+";";
  if (kwhieditstyle[1].length > 0) rule += "background-color:"+kwhieditstyle[1]+";";
  if (kwhieditstyle[2].length > 0) rule += "font-weight:"+kwhieditstyle[2]+";";
  if (kwhieditstyle[3].length > 0) rule += kwhieditstyle[3]+";";
  document.getElementById("kwhiedittemp").innerHTML = rule + "}";
  updateColorInputs();
}
async function updateColorInputs(){
  document.getElementById('txtcolorinput').value = '#' + ('0' + parseInt(document.getElementById("txtr").value).toString(16)).slice(-2) + 
    ('0' + parseInt(document.getElementById("txtg").value).toString(16)).slice(-2) +
    ('0' + parseInt(document.getElementById("txtb").value).toString(16)).slice(-2);
  document.getElementById('bkgcolorinput').value = '#' + ('0' + parseInt(document.getElementById("bkgr").value).toString(16)).slice(-2) + 
    ('0' + parseInt(document.getElementById("bkgg").value).toString(16)).slice(-2) +
    ('0' + parseInt(document.getElementById("bkgb").value).toString(16)).slice(-2);
}
async function updatecolor(e){
  // duplicate colors to RBG input boxes
  if (e.target.id.indexOf("colorinput") > -1){
    var hexcolor = e.target.value;
    var prefix = e.target.id.slice(0,3);
    document.getElementById(prefix + 'r').value = parseInt(hexcolor.slice(1,3), 16);
    document.getElementById(prefix + 'g').value = parseInt(hexcolor.slice(3,5), 16);
    document.getElementById(prefix + 'b').value = parseInt(hexcolor.slice(5,7), 16);
    updatestyle(document.getElementById(prefix + 'r'));
  }
}
function kwhifwchg(e){
  kwhieditstyle[2] = e.target.value;
  setdivstyle([]);
}
function kwhicustom(e){
  kwhieditstyle[3] = document.getElementById("kwhicustom").value;
  setdivstyle([]);
}
async function kwhimaxrestore(e){
  var el = document.getElementById('kwhiedit');
  if (e.target.textContent == '^'){
    e.target.textContent = '_';
    e.target.setAttribute('title', 'Restore normal dialog size');
    el.style.left = '1px';
    el.style.width = 'calc(100% - 3px - 2em)';
    el.style.height = 'calc(100% - 4px - 2em)';
  } else {
  	e.target.textContent = '^';
    e.target.setAttribute('title', 'Maximize dialog size');
    el.style.left = '';
    el.style.width = '';
    el.style.height = '';
  }
}
function cmenuFilter(e){
  document.getElementById("THDenableset").setAttribute("disabled","disabled");
  document.getElementById("THDenableset").setAttribute("THDtext","");
  document.getElementById("THDdisableset").setAttribute("disabled","disabled");
  document.getElementById("THDdisableset").setAttribute("THDset","");
  var s = window.getSelection();
  if (s.isCollapsed) document.getElementById("THDnewset").setAttribute("THDtext","");
  else document.getElementById("THDnewset").setAttribute("THDtext",s.getRangeAt(0).toString().trim());
  if (e.target.hasAttribute('txhidy15')){
    document.getElementById("THDdisableset").removeAttribute("disabled");
    document.getElementById("THDdisableset").setAttribute("THDset",e.target.getAttribute('txhidy15'));
  } else {
    document.getElementById("THDdisableset").setAttribute("disabled","disabled");
    if (!s.isCollapsed){
      document.getElementById("THDenableset").removeAttribute("disabled");
      document.getElementById("THDenableset").setAttribute("THDtext",s.getRangeAt(0).toString().trim());
    }
  }
}
function cmenuEnable(e){
  var kw = e.target.getAttribute("THDtext").toLowerCase();
  var toggled = false;
  for (var j = 0; j < hlkeys.length; ++j){
    var hlset = hlkeys[j];
    var kwlist = "|" + hlobj[hlset].keywords.toLowerCase() + "|";
    if(kwlist.indexOf("|" + kw + "|") > -1){
      if (hlobj[hlset].enabled == "true") break; // already enabled
      kwhienabledisable(hlset,true);
      refreshSetList();
      toggled = true;
      break;
    }
  }
  if (toggled == false){
    if (document.getElementById("thdtopbar").style.display != "block") editKW();
    if (document.getElementById("thdtopdrop").style.display != "block") thdDropSetList();
  }
}
function cmenuDisable(e){
  kwhienabledisable(e.target.getAttribute("THDset"),false);
  refreshSetList();
}
function cmenuNewset(e){
  //TODO - if there's a selection, get it into the form
  kwhinewset(e,e.target.getAttribute("THDtext"));
}

// TESTING ONLY
async function flushData(){
  if (!GM4){
    GM_setValue("kwstyles", "");
  } else {
    await GM.setValue("kwstyles", "");
  }
}