// ==UserScript==
// @name         Window Size PX
// @namespace    http://webketje.com/
// @version      0.1
// @description  A simple window dimensions indicator (in px) that appears on window resize in the top-right corner for browsers other than Chrome/Chromium. Useful for designers, developers, functional/ technical analysts, UX'ers etc.
// @author       Kevin Van Lierde
// @include http://*
// @include https://*
// @include *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37836/Window%20Size%20PX.user.js
// @updateURL https://update.greasyfork.org/scripts/37836/Window%20Size%20PX.meta.js
// ==/UserScript==

(function(window) {

  var styles = {
    root: 'position: fixed; z-index: 3000; top: 0; right: 0; background-color: rgba(238,238,238,0.8); opacity: 0; -webkit-transition: 0.3s; -moz-transition: 0.3s; transition: opacity 0.3s; color: black; padding: 3px 5px 5px; line-height: 14px; font-size: 14px;'
  };
  styles.root = styles.root.split(';').map(function(rule) { return rule + ' !important'; }).join(';');

  var windowSize = {
    id: '_ff_window-size',

    timer: null,

    elem: function() {
      var root = document.createElement('div'),
          xsize = document.createElement('span'),
          ysize = document.createElement('span');

      xsize.id = this.id + 'x';
      xsize.style = 'margin-right: 5px;';
      ysize.id = this.id + 'y';
      ysize.style = 'margin-left: 5px;';
      root.id = this.id;
      root.style = styles.root;

      root.appendChild(xsize);
      root.appendChild(document.createTextNode('×'));
      root.appendChild(ysize);

      return root;
    },

    onResize: function() {
      document.getElementById(this.id).style.opacity = 1;
      var id = this.id,
          xsize = document.getElementById(id + 'x'),
          ysize = document.getElementById(id + 'y');
      if (xsize) { xsize.textContent = Math.round(window.innerWidth); }
      if (ysize) { ysize.textContent = Math.round(window.innerHeight); }

      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        document.getElementById(id).style.opacity = 0;
      }, 1000);
    },

    init: function() {
      var ext = document.getElementById(this.id);
      if (!ext) {
        document.body.appendChild(this.elem());
        window.addEventListener('resize', this.onResize.bind(this));
      }
    }
  };

  windowSize.init();

}(window));