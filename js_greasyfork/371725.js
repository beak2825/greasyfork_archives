// ==UserScript==
// @name         HVForum Incidentenswitch
// @namespace    http://hulpverleningsforum.nl/
// @version      0.1
// @description  Mogelijkheid om de incidententopics op het Hulpverleningsforum te verbergen
// @author       Dion
// @match        https://www.hulpverleningsforum.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371725/HVForum%20Incidentenswitch.user.js
// @updateURL https://update.greasyfork.org/scripts/371725/HVForum%20Incidentenswitch.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var disabledBoards = [
    'https://www.hulpverleningsforum.nl/index.php/board,54.0.html',
    'https://www.hulpverleningsforum.nl/index.php/board,238.0.html',
    'https://www.hulpverleningsforum.nl/index.php/board,219.0.html',
  ];

  var hide_incidents = localStorage.getItem('hide_incidents'); // false
  var links = document.getElementsByTagName('a');
  var is_index = document.getElementById('boardindex_table');
  var toggle_wrapper = document.getElementsByClassName('nav-pills')[0];
  var toggle_el_show = '<li class="active"><a class="button_strip_markread buttonlist" id="showIncidentsButton"><i class="fa fa-markread fa-fw"></i> <span class="hidden-xs">Toon incidenten</span></a></li>';
  var toggle_el_hide = '<li class="active"><a class="button_strip_markread buttonlist" id="hideIncidentsButton"><i class="fa fa-markread fa-fw"></i> <span class="hidden-xs">Verberg incidenten</span></a></li>';

  var getClosest = function (elem, selector) {

    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // Get the closest matching element
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( elem.matches( selector ) ) return elem;
    }
    return null;

  };

  function showIncidents() {
    localStorage.setItem('hide_incidents', false); // false
    if(!is_index) {
      for(var i = 0; i < links.length; i++) {
        if(disabledBoards.indexOf(links[i].href) !== -1) {
          var el = getClosest(links[i], 'tr');
          el.style.display = 'table-row';
        }
      }
    }
  }

  function hideIncidents() {
    localStorage.setItem('hide_incidents', true);
    if(!is_index) {
      for(var i = 0; i < links.length; i++) {
        if(disabledBoards.indexOf(links[i].href) !== -1) {
          var el = getClosest(links[i], 'tr');
          el.style.display = 'none';
        }
      }
    }
  }

  toggle_wrapper.insertAdjacentHTML('afterbegin', toggle_el_show);
  toggle_wrapper.insertAdjacentHTML('afterbegin', toggle_el_hide);

  var showbtn = document.getElementById('showIncidentsButton');
  var hidebtn = document.getElementById('hideIncidentsButton');

  showbtn.addEventListener('click', function() {
    showIncidents();
    showbtn.style.display = 'none';
    hidebtn.style.display = 'block';
  });

  hidebtn.addEventListener('click', function() {
    hideIncidents();
    hidebtn.style.display = 'none';
    showbtn.style.display = 'block';
  });

  if(hide_incidents === 'true') { // false
    hideIncidents();
    hidebtn.style.display = 'none';
  } else {
    showIncidents();
    showbtn.style.display = 'none';
  }

})();
