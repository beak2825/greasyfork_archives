// ==UserScript==
// @name        USPTO Goods Tweaker
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @description Distinguish phrases on TSDR and TESS for quicker reading (2016-06-12)
// @include     http*://tsdr.uspto.gov/*
// @include     http*://tess2.uspto.gov/*
// @include     http*://tmsearch.uspto.gov/*
// @version     0.6
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/20421/USPTO%20Goods%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/20421/USPTO%20Goods%20Tweaker.meta.js
// ==/UserScript==

// Get/set preferences
var gsstyle = GM_getValue("gsstyle", "P"); // P=Plain, S=Striped, L=List
// Check for/set style rule
updateCSS(gsstyle);

// Fix print width - POSSIBLE FUTURE FEATURE
/*
var printcss = document.getElementById("tblcss");
if (!printcss){
  printcss = document.createElement("style");
  printcss.setAttribute("id", "tblcss");
  printcss.appendChild(document.createTextNode("@media print{div{table-layout:auto!important;}}"))
  document.body.appendChild(printcss);
}
*/

if (window.location.hostname.indexOf('tsdr') > -1){ //TSDR
  // Initial check
  var elgs = document.querySelectorAll('span[data-sectiontitle="Goods and Services"]');
  if (elgs.length > 0) { //TSDR
    for (j=0; j<elgs.length; j++) do_tsdr(elgs[j]);
  }
  // Watch for changes that could be new instant or AJAX search results
  var MutOb, chgMon, i, elgs, elser, j, opts, phrasecss, r;
  var MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (MutOb){
    chgMon = new MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            elgs = mutation.addedNodes[i].querySelectorAll('span[data-sectiontitle="Goods and Services"]');
            if (elgs.length > 0) for (j=0; j<elgs.length; j++) do_tsdr(elgs[j]);
          }
        }
      });
    });
    // attach chgMon to document.body
    opts = {childList: true, subtree: true};
    chgMon.observe(document.body, opts);
  }
}

if (window.location.hostname.indexOf('tess') > -1 || window.location.hostname.indexOf('tmsearch') > -1){  //TESS
  var elgs = document.querySelectorAll('body > table');
  for (k=0; k<elgs.length; k++){
    if (elgs[k].textContent.indexOf("Goods and Services") > -1) {
      do_tess(elgs[k]);
      break;
    }
  }
}

function do_tsdr(elGSTitle){
  elGSTitle.parentNode.parentNode.setAttribute("gsdiv", "gsdiv");
  if (document.querySelector('[gsdiv] #goodstoggle')) return;
  // Insert toggle buttons
	var btndest = document.querySelector('[gsdiv] .sectionContainer .note');
	btndest.innerHTML = '<button id="gsbtncopy" style="float:right;margin-top:6px">Copyable List</button> <p id="goodstoggle"><label><input type="radio" name="gstog" prefcode="P"/>Plain</label><label><input type="radio" name="gstog" prefcode="S"/>Stripe</label>' +
    '<label><input type="radio" name="gstog" prefcode="L"/>List</label></p><style type="text/css">#goodstoggle{float:right;margin:4px;line-height:2em;} ' +
    '#goodstoggle label{padding:0 6px;text-align:center;color:#000;background-color:#ccc;border:1px solid #888;border-right-color:#ccc;border-radius:0;display:inline-block;} ' +
    '#goodstoggle label:first-child{border-radius: 8px 0px 0px 8px;padding-left:9px;} #goodstoggle label:last-child{border-radius: 0px 8px 8px 0px;padding-right:9px;border-right-color:#888 !important;} ' +
    '#goodstoggle label:hover{background:#ffc;border-right-color:#ffc;} #goodstoggle label.checked{background:#ff5;border-right-color:#ff5;} #goodstoggle label:not(.checked){cursor:pointer;} ' +
    '#goodstoggle input{display:none;} @media print{#goodstoggle{display:none;}}</style>' + btndest.innerHTML;
	document.getElementById("goodstoggle").addEventListener("change", gstogupdate, false);
      document.getElementById("gsbtncopy").addEventListener("click", gsmakelist, false);
  // Set checked
  gstogsetchecked(gsstyle);
  // Set up phrase tags
  var keys = document.querySelectorAll('[gsdiv] .key');
  for (var j=0; j<keys.length; j++){
    if (keys[j].textContent.indexOf("For:") == 0){
      var gs = keys[j].nextElementSibling;
      var phrases = gs.querySelectorAll("phrase0, phrase1");
      if (phrases.length == 0){
        var gsphrases = gs.textContent.split("; ");
        var newval = "";
        for (k=0; k<gsphrases.length; k++){
          if (k==gsphrases.length-1){
            newval += "<phrase" + (k%2) + ">" + gsphrases[k] + "</phrase" + (k%2) + ">";
          } else {
            newval += "<phrase" + (k%2) + ">" + gsphrases[k] + ";</phrase" + (k%2) + "> ";
          }
        }
        gs.innerHTML = newval;
      }
      if (!gs.hasAttribute("gsic")){
        if (keys[j+1].textContent.indexOf("International Class") > -1){
          gs.setAttribute("gsic", keys[j+1].nextElementSibling.textContent.replace(/\n/g,"").substr(0,3));
        }
      }
    }
  }
}

function do_tess(elTable){
  if (elTable.querySelector('#goodstoggle')) return;
  var rows = elTable.rows;
  var btnrow = 999;
  for (var j=0; j<rows.length; j++){
    if (j == btnrow){ // Insert toggle buttons
      var btndest = rows[j].cells[1];
      btndest.innerHTML += '<button id="gsbtncopy" style="float:right;margin-top:6px">Copyable List</button> <p id="goodstoggle"><label><input type="radio" name="gstog" prefcode="P"/>Plain</label><label><input type="radio" name="gstog" prefcode="S"/>Stripe</label>' +
        '<label><input type="radio" name="gstog" prefcode="L"/>List</label></p><style type="text/css">#goodstoggle{float:right;margin:4px;line-height:2em;} ' +
        '#goodstoggle label{padding:0 6px;text-align:center;color:#000;background-color:#ccc;border:1px solid #888;border-right-color:#ccc;border-radius:0;display:inline-block;} ' +
        '#goodstoggle label:first-child{border-radius: 8px 0px 0px 8px;padding-left:9px;} #goodstoggle label:last-child{border-radius: 0px 8px 8px 0px;padding-right:9px;border-right-color:#888 !important;} ' +
        '#goodstoggle label:hover{background:#ffc;border-right-color:#ffc;} #goodstoggle label.checked{background:#ff5;border-right-color:#ff5;} #goodstoggle label:not(.checked){cursor:pointer;} ' +
        '#goodstoggle input{display:none;} @media print{#goodstoggle{display:none;}}</style>';
      document.getElementById("goodstoggle").addEventListener("change", gstogupdate, false);
      document.getElementById("gsbtncopy").addEventListener("click", gsmakelist, false);
      // Set checked
      gstogsetchecked(gsstyle);
    }
    if (rows[j].cells[0].textContent.indexOf("Goods and Services") > -1){ // Set up phrase tags
      btnrow = j + 1;
      var gs = rows[j].cells[1];
      var phrases = gs.querySelectorAll("phrase0, phrase1");
      if (phrases.length == 0){
        if (gs.getElementsByTagName("p").length == 0){
          gs.innerHTML = '<p style="margin-top:0">' + gs.innerHTML + '</p>';
        } else {
          var ppos = gs.innerHTML.toLowerCase().indexOf("<p>");
          gs.innerHTML = '<p style="margin-top:0">' + gs.innerHTML.substr(0, ppos) + '</p>' + gs.innerHTML.substr(ppos);
        }
        var pels = gs.getElementsByTagName("p");
        for (i=0; i<pels.length; i++){
          pels[i].innerHTML = pels[i].innerHTML.replace(/\s+/g," ").replace(/&amp;/g, "@@@@");
          var gsphrases = pels[i].innerHTML.split("; ");
          var newval = "";
          for (k=0; k<gsphrases.length; k++){
            if (k==0) {
              var tesspos = gsphrases[k].indexOf("G @@@@ S:");
              if (tesspos > -1) newval = gsphrases[k].substr(0, tesspos + 10) + "<phrase" + (k%2) + ">" + gsphrases[k].substr(tesspos + 10);
              else newval = "<phrase" + (k%2) + ">" + gsphrases[k];
              if (k==gsphrases.length-1){
                tesspos = newval.indexOf(".  FIRST USE:");
                if (tesspos > -1) newval = newval.substr(0, tesspos + 1) + "</phrase" + (k%2) + ">" + newval.substr(tesspos + 1);
                else newval += "</phrase" + (k%2) + ">";
              } else {
                newval += ";</phrase" + (k%2) + "> ";
              }
            } else {
              if (k==gsphrases.length-1){
                tesspos = gsphrases[k].indexOf(".  FIRST USE:");
                if (tesspos > -1) newval += "<phrase" + (k%2) + ">" + gsphrases[k].substr(0, tesspos + 1) + "</phrase" + (k%2) + ">" + gsphrases[k].substr(tesspos + 1);
                else newval += "<phrase" + (k%2) + ">" + gsphrases[k] + "</phrase" + (k%2) + ">";
              } else {
                newval += "<phrase" + (k%2) + ">" + gsphrases[k] + ";</phrase" + (k%2) + "> ";
              }
            }
          }
          pels[i].innerHTML = newval.replace(/@@@@/g, "&amp;");
        }
      }
      if (!gs.hasAttribute("gsic")){
        gs.setAttribute("gsic", "TESS");
      }
    }
  }
}

function updateCSS(stypref){
  var phrasecss = document.getElementById("gscss");
  if (!phrasecss){
    phrasecss = document.createElement("style");
    phrasecss.setAttribute("id", "gscss");
    document.body.appendChild(phrasecss);
  } else {
    if (phrasecss.firstChild) phrasecss.firstChild.remove();
  }
  switch (stypref){
    case "S":
      var r = "@media screen{phrase0{background:#cff;line-height:1.5em}phrase1{background:#fcf;line-height:1.5em}}";
      phrasecss.appendChild(document.createTextNode(r));
      break;
    case "L":
      var r = "@media screen{phrase0,phrase1{display:list-item;list-style:disc outside none;margin:0.5em 0 0.5em 12px}}";
      phrasecss.appendChild(document.createTextNode(r));
      break;
    default:
      // for Plain, don't insert any rule
  }
}

function gstogupdate(e){
	var btns = document.querySelectorAll("#goodstoggle label");
	for (var i=0; i<btns.length; i++){
		if (btns[i].firstChild.checked){
			btns[i].className = "checked";
      gsstyle = btns[i].firstChild.getAttribute("prefcode");
      GM_setValue("gsstyle", gsstyle); // Save new style as default
			updateCSS(gsstyle); // Apply new style
		}
		else btns[i].className = "";
	}
}

function gstogsetchecked(stypref){
	var btns = document.querySelectorAll("#goodstoggle label");
	for (var i=0; i<btns.length; i++){
		if (btns[i].firstChild.getAttribute("prefcode") == stypref){
			btns[i].className = "checked";
      btns[i].firstChild.setAttribute("checked", "checked");
      btns[i].firstChild.checked = true;
		} else {
      btns[i].className = "";
      if (btns[i].firstChild.checked) {
        btns[i].firstChild.removeAttribute("checked");
        btns[i].firstChild.checked = false;
      }
    }
	}
}

function gsmakelist(e){
  // remove old list
  var listdiv = document.getElementById("gslistdiv");
  if (listdiv) listdiv.remove();
  // create list(s)
  var gsels = document.querySelectorAll('[gsic]');
  var lists = "";
  for (var i=0; i<gsels.length; i++){
    if (gsels[i].getAttribute("gsic") == "TESS"){ // need to parse paragraphs
      var pels = gsels[i].getElementsByTagName("p");
      for (var j=0; j<pels.length; j++){
        var tmp = "<p>International Class " + pels[j].textContent.replace(/\s+/g," ").substr(3,3) + ":</p>\n<ul>\n";
        var litems = pels[j].querySelectorAll('phrase0, phrase1');
        for (var k=0; k<litems.length; k++){
          tmp += "<li>" + litems[k].textContent.replace(/\s+/g," ") + "</li>\n";
        }
        lists += tmp + "</ul>\n";
      }
    } else {
      var tmp = "<p>International Class " + gsels[i].getAttribute("gsic") + ":</p>\n<ul>\n";
      var litems = gsels[i].querySelectorAll('phrase0, phrase1');
      for (var k=0; k<litems.length; k++){
        tmp += "<li>" + litems[k].textContent.replace(/\n/g,"") + "</li>\n";
      }
      lists += tmp + "</ul>\n";
    }
  }
  // create and display list div
  listdiv = document.createElement("div");
  listdiv.id = "gslistdiv";
  listdiv.setAttribute("style", "position:fixed; top:0; left:5%; width:90%; height:90%; padding:0 1em; overflow:scroll; border:6px solid #000; background:#fff; font-family:serif; font-size:16px;");
  listdiv.innerHTML = '<p>Goods and Services:</p><hr>\n' + lists + '\n<hr>';
  var btnClose = document.createElement("button");
  btnClose.textContent = "X";
  btnClose.setAttribute("style", "position:absolute; top:4px; right:4px; font-weight:bold; color:#fff; background:red;");
  listdiv.appendChild(btnClose);
  btnClose.setAttribute("onclick", "this.parentNode.style.display='none';");
  document.body.appendChild(listdiv);
}