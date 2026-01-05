// ==UserScript==
// @name       ResponsivePage
// @namespace  http://lifia.unlp.edu.ar
// @version    0.7
// @description  Web responsive. Through a given configuration from a desktop pc or notebook.
// @match      https://*/*
// @match      http://*/*
// @require    http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/12643/ResponsivePage.user.js
// @updateURL https://update.greasyfork.org/scripts/12643/ResponsivePage.meta.js
// ==/UserScript==

if (window.jQuery){
  $('head script[src*="js"]').remove();
    
}

GM_registerMenuCommand('runSingle', runSingle);
GM_registerMenuCommand('runDropdownMenu', runDropdownMenu);
GM_registerMenuCommand('import JSON', importJson);

function runSingle(buttomMenu){
  runWeb(false);
}

function runDropdownMenu(){
  runWeb(true);
}

function runWeb(buttomMenu){
  var obj = getLocal();
  var objectParent = constructObject(obj);
  runPage(objectParent, buttomMenu);    
}

function importJson() {
    var importData = prompt("Import configuration. Add JSON");
    if(importData.length >= 218){
      dataJson = JSON.parse(importData);
      saveLocal();
      alert("Successful import!");
    } else {
      alert("Wrong format. Please try again")
    }
}

function saveLocal(){
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("obj", JSON.stringify(dataJson));
  } else {
    alert("Sorry, your browser does not support Web Storage...");
  }
}

function getLocal(){
  if (typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem("obj"));
  } else {
    alert("Sorry, your browser does not support Web Storage...");
  }
}
  
function getElements(xpath){
  // Recive algo como obj[0].headerLeft
  var node = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null ).singleNodeValue;
  return node;
}

function concatElement(element){
  var stringElements = "";
  var getElement;
  $.each( element, function( key, value ) {
    if (value != "none"){
      getElement = getElements(value);
      if(getElement !== null){
        stringElements += "<div>"+getElement.innerHTML+"</div>";
      }
      else
        stringElements = null;
    }
    else
      stringElements = "none";
  });
  return stringElements;
}

function constructObject(obj){
  var object = {};
  var error = false;
  $.each( obj, function( key, value ) {
    if (concatElement(value) === null){
      error = true
      messagge = "Error xpath. Not load an element in "+key;
      return true;
    }
    if (concatElement(value) == "none"){
      object[key] = "";
    }
    else
      object[key] = concatElement(value);
  });  
  if (error === true){
    alert(messagge);
    return null;
  }
  else
    return object;
}

function importElement(source, destination){
  $(destination).append(source);
}

function insertZoneMenu(element){
  dwrap = document.createElement("div");
  $(dwrap).html(element);
  var links = $(dwrap).find("a"); 
  $("#menu").append("<nav class='navbar navbar-default' role='navigation'> <div class='navbar-header'> <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1'> <span class='sr-only'>Toggle navigation</span><span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span></button> </div>  <div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'> <ul id='menu-nav' class='nav navbar-nav'>  </ul> </div>  </nav> "); 
  $.each($(links), function(i, e){
      var newLinks = document.createElement("li");
      $(newLinks).append($(e));
      $("#menu-nav").append($(newLinks));
  });
}

function runPage(objectParent, buttomMenu){
  $("head").append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
  $("head").append("<script src='https://code.jquery.com/jquery-2.1.4.min.js'></script>");
  $("head").append("<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js'></script>");
  $("head").append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css'>");
  $("head").append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css'>");
  $("head").append("<style>*{min-width: 0px !important;}</style>");
  $("head").append("<style>*{max-width: 100% !important;}</style>");

  if (objectParent !== null){
    $("body").html("");
    $("body").append("<div class='container-fluid'> <div class='row'> <div id='header-left' class='col-md-4'> </div> <div id='header-center' class='col-md-4'> </div> <div id='header-right' class='col-md-4'> </div> </div> <div class='row'> <div id='menu' class='col-md-12'> </div> </div> <div class='row'> <div id='main-left' class='col-md-4'> </div> <div id='main-center' class='col-md-4'> </div> <div id='main-right' class='col-md-4'> </div> </div> <div class='row'> <div id='footer-left' class='col-md-4'> </div> <div id='footer-center' class='col-md-4'> </div> <div id='footer-right' class='col-md-4'> </div> </div> </div>");
  
    importElement(objectParent.headerLeft,"#header-left");
    importElement(objectParent.headerCenter,"#header-center");
    importElement(objectParent.headerRight,"#header-right");
    if (buttomMenu === true){
        insertZoneMenu(objectParent.menu);
    }
    else
      importElement(objectParent.menu,"#menu");
    importElement(objectParent.mainLeft,"#main-left");
    importElement(objectParent.mainCenter,"#main-center");
    importElement(objectParent.mainRight,"#main-right");
    importElement(objectParent.footerLeft,"#footer-left");  
    importElement(objectParent.footerCenter,"#footer-center"); 
    importElement(objectParent.footerRight,"#footer-right"); 
  }
}