// ==UserScript==
// @name Tool
// @namespace  toolproject
// @description Toolsammlung
// @include http://*.escaria.com/world/client*
// @require http://code.jquery.com/jquery-1.10.2.js
// @require http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @resource http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/13975/Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/13975/Tool.meta.js
// ==/UserScript==


initialized = false;

Release = '';
Browser = '';
World = '';

////////////////////////////// Images //////////////////////////////////////////

var IMG_Tc = 'data:image/png;base64,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';
//var imgPreload = initImages();
////////////////////////////////////////////////////////////////////////////////
var GLOBAL_Server = window.location.href.match(/http:\/\/(.+).escaria.com.+/)[1];
var GLOBAL_Username = '';
var GLOBAL_Tribe = '';
var GLOBAL_IslandId = '';

///////////////////////////// Allgemeine Funktionen ////////////////////////////

function getEl(Wert, parent){
    return document.evaluate(
        Wert,
        parent ? parent : document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
}

function gid(Wert){
    return document.getElementById(Wert);
}

function appendElement(eT, eP, attr, style){
    var e=document.createElement(eT), i;
    var css = '';
    for (var i in style)
        css += i + ':' + style[i] + ";";
    if(css)
        e.style.cssText=css;
    if(attr)
        for(i in attr)
            e[i] = attr[i];
    if(eP)
        eP.appendChild(e);
    return e;
}

function insertElementBefore(eT, eP, attr, style){
    var e = document.createElement(eT);
    var css = '';
    for (var i in style)
        css += i + ':' + style[i] + ";";
    if (css)
        e.style.cssText = css;
    if (attr)
        for (var i in attr)
            e[i] = attr[i];
    if (eP)
        eP.parentNode.insertBefore(e, eP);
    return e;
}

function removeElement(e){
    if (e) e.parentNode.removeChild(e);
}

function arrayIsEmpty(array)
{
    for (var element in array) {
        return false;
    }

    return true;
}

function blockElement(el){
  if(el){
    el.style.display = '';
  }
}

function noneElement(el){
  if(el){
    el.style.display = 'none';
  }
}
function _log(txt,obj){
  console.log(txt);
  console.log(obj);
}

function addDialogPanelButton(eT, attr, style){
    var Els = getEl("//div[@id='dialogPanel']//div[@class='additionalContent']");
    var div = appendElement(eT, Els.snapshotItem(0), attr, style);

    return div;
}

function addResourcePanelButton(eT, attr, style){ //*[@id="gwt-uid-93"]
//    var Els = getEl("//div[@id='resourcePanel']//div[@class='resourcePanelWrapper']");
    var div = appendElement(eT, Els.snapshotItem(0), attr, style);

    return div;
}

function clickElement(element){
    simulateMouseEvent(element, 'mousedown');
    simulateMouseEvent(element, 'click');
    simulateMouseEvent(element, 'mouseup');
}

function simulateMouseEvent(element, event){
    var pos = findPos(element, null, true);

    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(event, true, true, window, 1, pos.left, pos.top, pos.left, pos.top, false, false, false, false, 0, null);
    element.dispatchEvent(evt);
}

function findPos(obj, relativeObj, center)
{
    var curleft = curtop = 0;
    var obj1 = obj;

    do {
        if (obj1.style.position == 'absolute') {
            curleft += stringToInt(obj1.style.left);
            curtop += stringToInt(obj1.style.top);
            obj1 = obj1.parentNode;
        } else {
            curleft += obj1.offsetLeft;
            curtop += obj1.offsetTop;
            obj1 = obj1.offsetParent;
        }

        if (obj1 == relativeObj) {
            break;
        }
    } while (obj1);

    if (center) {
        if (obj.style.width != "") {
            curleft += stringToInt(obj.style.width) / 2;
        } else {
            curleft += obj.offsetWidth / 2;
        }
        if (obj.style.height != "") {
            curtop += stringToInt(obj.style.height) / 2;
        } else {
            curtop += obj.offsetHeight / 2;
        }
    }

    return { top: curtop, left: curleft };
}

function stringToInt(s, positive){
    if (typeof(s) == 'number') {
        return s;
    }

    if (typeof(s) != 'string') {
        return 0;
    }

    // Geschachtelte regulÃ¤re AusdrÃ¼cke?
//    var num = parseInt(s.replace(/^[\s0]+/,""), 10); // Bug in parseInt: "08" -> 0, "09" -> 0
    var s1 = s;
    while (s1 != '' && (s1[0] == ' ' || s1[0] == '0')) {
        s1 = s1.substr(1);
    }
    var num = parseInt(s1, 10); // Bug in parseInt: "08" -> 0, "09" -> 0

    if (isNaN(num)) {
        return 0;
    }

    if (positive == true && num < 0) {
        return 0;
    }

    return num;
}

function hasClass(ele,cls){
//    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

    

/////////////////////////// ext. CSS & Script //////////////////////////////////
function InitJsCssFile(filename, filetype){
  if (filetype=="js"){ //if filename is a external JavaScript file
    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", filename);
  }
  else if (filetype=="css"){ //if filename is an external CSS file
    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }
  if (typeof fileref!="undefined"){
    document.getElementsByTagName("head")[0].appendChild(fileref);
  }
}


function addGlobalStyle(css){
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//////////////////////////GLOBAL STYLES/////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////

if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 || navigator.userAgent.toLowerCase().indexOf('opera')!=-1)
{
    move = appendElement('div', document.body, {id:'TC_moveVars'}, 'display:none'),
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("TC_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["clientAssetsBasePath"];'});
    Release = gid('TC_moveVars').textContent;
    document.body.removeChild(script);
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("TC_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["worldUsername"];'});
    GLOBAL_Username = gid('TC_moveVars').textContent;
    document.body.removeChild(script);
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("TC_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["tribe"];'});
    GLOBAL_Tribe = gid('TC_moveVars').textContent;
    document.body.removeChild(script);
    script = appendElement('script', document.body, {type:'application/javascript', textContent:'document.getElementById("TC_moveVars").textContent=___stdlib_fastcall____startupConfiguration___["islandId"];'});
    GLOBAL_IslandId = gid('TC_moveVars').textContent;
    document.body.removeChild(script);
    
    document.body.removeChild(move);

    if(navigator.userAgent.toLowerCase().indexOf('opera')>-1) {
        Browser = 'opera';
    } else {
        Browser = 'chrome';
    }
}
else
{
    Browser = 'ff';
    Release = unsafeWindow.___stdlib_fastcall____startupConfiguration___.clientAssetsBasePath;
    GLOBAL_Username = unsafeWindow.___stdlib_fastcall____startupConfiguration___.worldUsername;
    GLOBAL_Tribe = unsafeWindow.___stdlib_fastcall____startupConfiguration___.tribe;
    GLOBAL_IslandId = unsafeWindow.___stdlib_fastcall____startupConfiguration___.islandId;
}

////////////////////////////////////////////////////////////////////////////////
var firstRun = false;

waitingId01 = setInterval(function (){
if (firstRun == true){
  if ($('#logbook') != null && $('#island') != null){
    if(gid('game')){
      if (initialized == false){
        clearInterval(waitingId01);

        var worldRegExp = /http:\/\/static.(\w+).escaria.com\//;
            worldRegExp.exec(Release);
            World = RegExp.$1;

        console.log('INIT: TC');
        
        InitJsCssFile('http://www.gpunktprojekt.de/escaria/tool/new/main_panel.css', 'css');
        
        InitJsCssFile('http://code.jquery.com/jquery-1.10.2.js', 'js');
        InitJsCssFile('http://code.jquery.com/ui/1.11.4/jquery-ui.js', 'js');
        InitJsCssFile('http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css', 'css');
        
        
        /////TC///////////////////////
        initToolButtonAtDialogPanel();
        ///////IMAIN PANEL Container//////
        var win_h = $(window).height();
        var win_w = $(window).width();
        appendElement('div', gid('game'), {'id':'tc_main_panel_wrapper', 'className':'tc_main_panel_wrapper'}, {'width':win_w+'px', 'height':win_h+'px', 'display':'none'});
        //////////PRELOAD IMAGES////////////////
        preloadImage = IMAGES.preload();
        
        /////////////////////////////
        window.addEventListener('hashchange', hashChanged, false);
        
        window.addEventListener("resize", resizeWindow, false);
//
//        window.addEventListener("resize", function(){
//          console.log(e);
//          var user = getUserData();
////          user.buttonid = 'btn_logout';
//
//          UserLogin(user);
//        }, false);
//
//  //      window.setTimeout(function(){
//          console.log('Login at startup');
//          var data = getUserData(null);
//          requestLogin(data);
//  //      }, 2000);

        


        initialized == true;

      }
    }
  }  

}

    firstRun = true;
}, 2000);

////////////////////////////////////////////////////////////////////////////////
function hashChanged(){
  if(gid('game').className === 'seamap' || gid('game').className === 'island'){
    initToolButtonAtDialogPanel();
  }

}


function resizeWindow(){
  var w = gid('game').offsetWidth;
  var h = gid('game').offsetHeight;
  
  gid('tc_main_panel_wrapper').style.width = w + 'px';
  gid('tc_main_panel_wrapper').style.height = h + 'px';
}
/////////////////////////////DRAG n DROP////////////////////////////////////////
function makeMeDraggable(element){
  $(element).draggable({
    snap: true,
    snapMode: 'outer',
    snapTolerance: 30,
    cursor: 'move',
    containment: '#tc_main_panel_wrapper',
    scroll: false
  });
}


////////////////////////////////////////////////////////////////////////////////
function initToolButtonAtDialogPanel(){
    
    if(!gid('tc_Button')){
      var btn = addDialogPanelButton('div', {
        'className': 'tc clickable',
        'id': 'tc_Button',
        'title': 'TC - Tool Collection'
      }, {
        'position': 'relative',
        'background-image': 'url('+IMG_Tc+')',
        'width': '50px',
        'height': '54px',
        'margin-bottom':'7px',
        'display': 'block'
      });

      btn.addEventListener('click', function(){
        console.log('tc_Button clicked');
        if(gid('tc_main_panel_wrapper').style.display === 'none'){
          blockElement(gid('tc_main_panel_wrapper'));
          
          var user = getUserData();
              user.buttonid = this.id;
          UserLogin(user);
        }else{
          closeMainPanel();
        }
      }, false);
    }
  
}


function UserLogin(user){
  console.log('UserLogin(user)->');
  console.log(user);
  
  if(gid('mainPanel')){
    var html = '';
    
    removeElement(gid('mainPanel_wrapper').firstChild);
    var div = appendElement('div', gid('mainPanel_wrapper'), {}, {});
    var content = appendElement('div', div, {'id':'content_preload_s', 'className':'content_preload'}, {});
    appendElement('img', content, {'src': preloadImage[3].src}, {});
    
    var preload = new CenterInContainer ( gid('mainPanel_wrapper'), gid('content_preload_s'), 0, 0 );
    preload.center();
    
    console.log('preload');    
    console.log(preload);
  }else{
    var div = appendElement('div', gid('tc_main_panel_wrapper'), {'id':'content_preload_xl','className':'content_preload'}, {'z-index':'9000'});
              appendElement('img', div, { 'src': preloadImage[2].src }, {});
    var preload = new CenterInContainer ( gid('tc_main_panel_wrapper'), gid('content_preload_xl'), -50, 0 );
        preload.center();
    
    console.log('preload');    
    console.log(preload);
  }
  
  
  
//  var url = 'http://www.gpunktprojekt.de/escaria/tool/login.php';
  var url = 'http://www.gpunktprojekt.de/escaria/tool/new/login2.php';
  
  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    data: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(response) {
      console.log('response.responseText->');
      console.log(response.responseText);
      var data = JSON.parse(response.responseText);
      
      console.log(data);
      setPanel(data);
      
      
    }
  });
}

function setPanel(data){
//  console.log(data.mainpanel);
  
  if(!gid('mainPanel')){ // nicht neu erzeugen, wenn vorhanden //
    removeElement(gid('tc_main_panel_wrapper').firstChild);
    var panel = appendElement('div', gid('tc_main_panel_wrapper'), {'id':'mainPanel', 'className':'mainPanel'}, {'display':'block'});
//          panel.innerHTML = data.mainpanel;
          
  }
  
  if(!gid('mainPanel_titlebar')){
    var titlebar = appendElement('div', gid('mainPanel'), {'id':'mainPanel_titlebar', 'className':'mainPanel_titlebar'}, {'display':'block'});
    var div = appendElement('div', titlebar, {}, {});
        div.innerHTML = data.titlebar;
  }else{
    removeElement(gid('mainPanel_titlebar').firstChild);
    var div = appendElement('div', gid('mainPanel_titlebar'), {}, {});
        div.innerHTML = data.titlebar;
  }
  
  if(!gid('mainPanel_menubar')){
    var menubar = appendElement('div', gid('mainPanel'), {'id':'mainPanel_menubar', 'className':'mainPanel_menubar'}, {'display':'block'});
    var div = appendElement('div', menubar, {}, {});
        div.innerHTML = data.menubar;
  }else{
    removeElement(gid('mainPanel_menubar').firstChild);
    var div = appendElement('div', gid('mainPanel_menubar'), {}, {});
        div.innerHTML = data.menubar;
  }
  
  if(!gid('mainPanel_wrapper')){
    var wrapper = appendElement('div', gid('mainPanel'), {'id':'mainPanel_wrapper', 'className':'mainPanel_wrapper'}, {'display':'block'});
    var div = appendElement('div', wrapper, {}, {});
        div.innerHTML = data.wrapper;
  }else{
    removeElement(gid('mainPanel_wrapper').firstChild);
    var div = appendElement('div', gid('mainPanel_wrapper'), {}, {});
        div.innerHTML = data.wrapper;
  }
  
  if(!gid('mainPanel_statusbar')){
    var statusbar = appendElement('div', gid('mainPanel'), {'id':'mainPanel_statusbar', 'className':'mainPanel_statusbar'}, {'display':'block'});
    var div = appendElement('div', statusbar, {}, {});
        div.innerHTML = data.statusbar;
  }else{
    removeElement(gid('mainPanel_statusbar').firstChild);
    var div = appendElement('div', gid('mainPanel_statusbar'), {}, {});
        div.innerHTML = data.statusbar;
  }
  
///////////////////////////////FOCUS PASSWORD BOX///////////////////////////////////
  if(gid('password')){
    gid('password').focus();
  }
  

//////////////////RESIZABLE MAIN PANEL//////////////////////////////////////////
   if(gid('mainPanel')){
    $(function() {
      $( '#mainPanel' ).resizable({// mainPanel_wrapper
        alsoResize: "#mainPanel_wrapper",
        maxHeight: 500,
        maxWidth: 1000,
        minHeight: 250,
        minWidth: 414
      });
    });
  }
  //////////////CENTER MAIN PANEL////////////
  var MainPanel = new CenterInContainer ( gid('tc_main_panel_wrapper'), gid('mainPanel'), -50, 0 );
      MainPanel.center();
   
  /////////////////////SIZE ADJUST MAIN PANEL///////////////////////////////////
  var Panel = new ResizeElement ( gid('mainPanel') );
      Panel.dependenceResize();
  ////////////////////////MAKE DRAGGABLE////////////////////////////////////////   
  makeMeDraggable('#mainPanel');

  ////////////CONTENT TAB PANEL//////////////////////
  if(gid('tabs')){
    $(function() {
      var tabs = $( "#tabs" ).tabs();
      tabs.find( ".ui-tabs-nav" ).sortable({
        axis: "x",
        stop: function() {
          tabs.tabs( "refresh" );
        }
      });
    });
  }
      
  /////////SET LISTENERS FOR MAIN PANEL/////////////
  if(gid('btn_close')){
    gid('btn_close').addEventListener('click', closeMainPanel, false);
  }
  
  if(gid('btn_minimize')){
    gid('btn_minimize').addEventListener('click', function(){
      if(gid('mainPanel_wrapper').style.display !== 'none'){
        gid('mainPanel_wrapper').style.display = 'none';
        $( "#mainPanel" ).resizable( "disable" );
        var Panel = new ResizeElement ( gid('mainPanel') );
            Panel.dependenceResize();
      }else{
        gid('mainPanel_wrapper').style.display = 'block';
        $( "#mainPanel" ).resizable( "enable" );
        var Panel = new ResizeElement ( gid('mainPanel') );
            Panel.dependenceResize();
      }
      
    }, false);
  }
  
  
  if(gid('btn_logout')){
    gid('btn_logout').addEventListener('click', function(){
      var user = getUserData();
          user.buttonid = this.id;

      UserLogin(user);
    }, false);
  }
  
  if(gid('btn_register')){
    gid('btn_register').addEventListener('click', function(){
      var user = getUserData();
          user.buttonid = this.id;
          user.pass = $('#password').val();

      UserLogin(user);
    }, false);
  }
  
  if(gid('btn_login')){
    gid('btn_login').addEventListener('click', function(){
      var user = getUserData();
          user.buttonid = this.id;
          user.pass = $('#password').val();

      UserLogin(user);
    }, false);
  }
  
  
}


function setPanelContent(data){
  removeElement(gid('mainPanel_wrapper').firstChild);
  
  var content = appendElement('div', gid('mainPanel_wrapper'), {}, {'display':'block'});
      content.innerHTML = data.element;
}



function closeMainPanel(){
  removeElement(gid('tc_main_panel_wrapper').firstChild);
  noneElement(gid('tc_main_panel_wrapper'));
}

function getUserData() {
  var user = {};
      user.name = GLOBAL_Username;
      user.tribe = GLOBAL_Tribe;
      user.islandid = GLOBAL_IslandId.replace("island://", "");
      user.world = World;
      
//      console.log('getUserData->');
//      console.log(user);
      
      return user;
  }
////////////////////////////////////Tab Panel///////////////////////////////////

//////////////////////////////////D n D/////////////////////////////////////////

//////////////////////////////Klassen Funktionen////////////////////////////////

function ResizeElement(container){
  this.container = container;
}

ResizeElement.prototype.dependenceResize = function () {
  var newHeight = this.getSize_height_elements();
                this.container.style.height = newHeight + 'px';
        
  
};

ResizeElement.prototype.getSize_height_elements = function () {
  var h = 0; var w = 0;
  
  console.log( this.container.id );
  console.log( $('#'+ this.container.id).children() );
  $('#'+ this.container.id).children().each(function () {
    
    if(this.style.display === 'block'){
      console.log(this);
      console.log(this.offsetHeight);
      h += this.offsetHeight;
//      w += this.offsetWidth;
      
      
    }
  });
//  this.h = h;
//  this.w = w;
  console.log('Höhe:');
  console.log(h);
  return h;
};




function CenterInContainer(container, element, offset_top, offset_left){
  this.container = container;
  this.element = element;
  this.offset_top = offset_top;
  this.offset_left = offset_left;
  
//  console.log('Constructor:');
//  console.log(this);
}

CenterInContainer.prototype.center = function(){
  var pos = this.getCenterPosition();
  this.element.style.top = pos.top + 'px';
  this.element.style.left = pos.left + 'px';
  
//  console.log('prototype.center:');
//  console.log(pos.element);
//  console.log(pos);
};

CenterInContainer.prototype.getCenterPosition = function(){
  this.left = ((this.container.offsetWidth / 2) - (this.element.offsetWidth / 2))  + this.offset_left;
  this.top = ((this.container.offsetHeight / 2) - (this.element.offsetHeight / 2)) + this.offset_top;
    
//  console.log('prototype.getCenterPosition:');
//  console.log(this);
  
  return this;
};
  

////////////////////////////////////////////////////////////////////////////////





var IMAGES = {
    
    preload : function () {
      var lib = [
          'http://gpunktprojekt.de/escaria/tool/new/images/loading_spinner_xs.gif',
          'http://www.gpunktprojekt.de/escaria/tool/new/images/icon_login.png',
          'http://www.gpunktprojekt.de/escaria/tool/new/images/custom_loader.GIF',
          'http://www.gpunktprojekt.de/escaria/tool/new/images/custom_preloader1.GIF'
        ]
          

      var img = new Array();

      for (var i = 0; i < lib.length; i++){
        img[i] = new Image();
        img[i].src = lib[i];
      }

      return img;
        
    }
};

