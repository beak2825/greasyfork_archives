// ==UserScript==
// @name         FVToolkit-Sidebar
// @namespace    CuteHornyUnicorn
// @version      0.1a4
// @description  scrollable sidebar with all villagers
// @author       CuteHornyUnicorn
// @include      http://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22088/FVToolkit-Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/22088/FVToolkit-Sidebar.meta.js
// ==/UserScript==
/*jshint multistr: true */


var sidebar = document.createElement('div');
sidebar.setAttribute('class', 'FVTK-rsidebar');
sidebar.style = 'position: fixed;\
    right: -20px;\
    top: -20px;\
    overflow:scroll;\
    height: 108%;\
    width: 230px;\
    visibility: hidden;\
';

sidebar.innerHTML = '\
    <div class="widget">\
         <div class="widget-content" style="visibility: visible;">\
         </div>\
    </div>\
';

document.body.appendChild(sidebar);


var getPage = function(url, callback) {
    var req = new XMLHttpRequest();
    req.onload = function() {
        if ( callback && typeof(callback) === 'function' ) {
            callback( this.responseXML );
        }
    };
    req.open( 'GET', url );
    req.responseType = 'document';
    req.send();
};

getPage( '/profile', function(response) {
    var sidebarWidget = document.querySelector( '.FVTK-rsidebar > .widget' );
    var sidebarWidgetContent = sidebarWidget.querySelector('.widget-content');
    var listVillagers = response.querySelector( '.villagers-list' );
    var ulStore = listVillagers.querySelectorAll('ul > li');
   for (var liContent of ulStore) {
              var VilCareer = liContent.querySelector('.villager-info');
       if (VilCareer !== null) {
              VilCareer = VilCareer.textContent.trim().toLowerCase();
              if (VilCareer == 'animal husbandry') {
                  VilCareer = 'breeder';
              }
                     if (VilCareer == 'construction worker') {
                  VilCareer = 'carpenter';
              }

       var replaceLinks = liContent.innerHTML;
       replaceLinks = replaceLinks.replace('villager/','career/'+VilCareer+'/');
       liContent.innerHTML = replaceLinks;
          }

var villager = document.createElement('div');
villager.setAttribute('class', 'text-center');
sidebarWidgetContent.appendChild(villager);
villager.innerHTML = liContent.innerHTML;
   }
});


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

	addGlobalStyle("\
\
.FVTK-rsidebar .text-center {\
text-align: left;\
height: 80px;\
}\
.FVTK-rsidebar .text-center .villager-avatar {\
width:75px;\
border-radius: 0px !important;\
}\
\
.FVTK-rsidebar .text-center p {\
text-align: left;\
font-size: 10px;\
width: 60%;\
position: relative;\
top: -80px;\
margin-left: 80px;\
margin-bottom: 0px;\
}\
\
.FVTK-rsidebar .text-center p a {\
}\
\
.adsbygoogle {\
display: none !important;\
}\
");