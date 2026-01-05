// ==UserScript==
// @name         OneDrive Show long file name
// @namespace    http://github.com/segabito
// @version      0.1.2
// @description  長いファイル名をポップアップで表示
// @author       segabito
// @match        https://onedrive.live.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11977/OneDrive%20Show%20long%20file%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/11977/OneDrive%20Show%20long%20file%20name.meta.js
// ==/UserScript==

(function() {

var __css__ = (function() {/*

.FileNamePopup {
  position: fixed;
  top: 7px;
  left: 210px;
  background-color: #ffc;
  z-index: 1000;
  padding: 2px 24px;
  font-weight: bolder;
  border: solid 1px #888;
  border-radius: 8px;
  box-shadow: 2px 2px 4px #333;
  opacity: 0.8;
  pointer-events: none;
}

.FileNamePopup:empty {
  display: none;
}

.DetailsRow-cell.displayName:hover::after {
  content: attr(aria-label);
  position: fixed;
  top: 7px;
  left: 210px;
  background-color: #fff;
  z-index: 10000001;
  padding: 2px 24px;
  font-weight: bolder;
  border: solid 1px #888;
  border-radius: 8px;
}


*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
    
    var addStyle = function(styles, targetWindow) {
      if (!targetWindow) { targetWindow = self; }
      var elm = targetWindow.document.createElement('style');
      elm.type = 'text/css';

      var text = styles.toString();
      text = targetWindow.document.createTextNode(text);
      elm.appendChild(text);
      var head = targetWindow.document.getElementsByTagName('head');
      head = head[0];
      head.appendChild(elm);
      return elm;
    };

    var $popup;
    
    var adjustPopup = function(x, y) {
        //var offset = $popup.offset();
        var $window = $(window);
        var screenWidth = $window.innerWidth();
        var screenHeight = $window.innerHeight();
        var height = $popup.outerHeight();
        var top = Math.max(0, Math.min(y + 50, screenHeight - height));
        var width = $popup.outerWidth();
        var left = Math.max(0, Math.min(x - width / 3, screenWidth - width));
        //console.log('adjustPopup: %s, %s -> %s, %s', x, y, top, left);
        $popup.css({
            'top': top,
            'left': left
        });
    };
    
    var hidePopup = function() {
        $popup.text('');
    };
    
    var onListCellMouseover = function(e) {
        var $target = $(e.target).closest('.ItemTile');
        var $name = $target.find('.ItemTile-name');
        var name = $name.text();
        //console.log('%cfilename: %s', 'background: cyan; ', name);// $target[0], $name[0]);
        if (name) {
            $target.attr('title', name); 
            $popup.text(name);
            adjustPopup(e.clientX, e.clientY);
        }
    };

    var onDetailsRowMouseover = function(e) {
        var $target = $(e.target).closest('.DetailsRow');
        var $name = $target.find('.displayName');
        var name = $name.text();
        //console.log('%cfilename: %s', 'background: cyan; ', name, e);
        if (name) {
            $target.attr('title', name); 
            $popup.text(name);
            adjustPopup(e.clientX, e.clientY);
        }
    };
    
    var onItemTileMouseover = function(e) {
        var $target = $(e.target).closest('.c-SetItemTile');
        var $name = $target.find('.titleArea');
        var name = $name.text();
        //console.log('%cfilename: %s', 'background: cyan; ', name, e);
        if (name) {
            $target.attr('title', name); 
            $popup.text(name);
            adjustPopup(e.clientX, e.clientY);
        }
    };
    
    var initialize = function() {
        addStyle(__css__);
        $popup = $('<div class="FileNamePopup"></div>');
        $body = $('body');
        $body.append($popup);
        $body.on('mouseover', '.List-cell .ItemTile',     onListCellMouseover);
        $body.on('mouseover', '.DetailsRow .displayName', onDetailsRowMouseover);
        $body.on('mouseover', '.child .c-SetItemTile',    onItemTileMouseover);
        $body.on('mousedown', hidePopup);
        $('.od-SuiteNav').on('mouseover', hidePopup);
    };

    var initTimer = window.setInterval(function() {
      if (window.$) {
        window.clearInterval(initTimer);
        window.setTimeout(initialize, 500);
      }
    }, 500);
 
})();
