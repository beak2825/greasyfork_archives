// ==UserScript==
// @name           Memrise Preview Word
// @description    Allows to Preview one specific Word
// @match          http://*.memrise.com/course/*
// @match          https://*.memrise.com/course/*
// @run-at         document-end
// @version        1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/372467/Memrise%20Preview%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/372467/Memrise%20Preview%20Word.meta.js
// ==/UserScript==

if(typeof unsafeWindow == "undefined") {
  unsafeWindow = window;
}

// Inside a level: add links to preview
if(typeof unsafeWindow.MEMRISE.garden == "undefined") {
  if(document.body.classList.contains('level-view')) {
  	window.addEventListener('load', onLoad, false);
  }

  function onLoad() {

    // Display link in black when not hovering
    const css = document.createElement('style');
    css.textContent = `
    .col_a a {
			color: inherit;
    }
    .col_a a:hover {
			color:#0c618f
    }`;
    document.head.appendChild(css);

    // Add links to column a
    var url_preview = window.location.pathname + 'garden/preview/';

    document.body.querySelectorAll('.col_a').forEach(function(node){
    	var a  = document.createElement('a'),
          id = node.parentNode.getAttribute('data-learnable-id');

      node.appendChild(a);
      a.setAttribute('href', url_preview + '?learnable_id=' + id);
      a.appendChild(node.firstElementChild);
    });
  }

// Preview a specific word (by intercepting AJAX response)
} else if(window.location.search.startsWith('?learnable_id=')) {

  // Change close preview link (toward level instead of home)
  var url_course = window.location.pathname.replace("/garden/preview/", "/"),
      exit       = document.querySelector('a.session-exit');

  if(exit) {
    exit.setAttribute('href', url_course);
    exit.addEventListener('click', function(){
    	window.onbeforeunload = null;
      window.location.href  = this.getAttribute('href');
    });
  }

  // Inject JS directly in page to prevent limitations of access
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = `
  var _oldAjax = $.ajax;
  $.ajax = function(options) {

    if(options.url == "/ajax/session/") {
      var _oldSuccess = options.success;

      _oldSuccess && $.extend(options, {
        success: function(data) {
          var learnable_id = window.location.search.substr(14);

          // Replace list of words with list of a single word
					if(typeof data.screens[learnable_id] != "undefined") {
            data.boxes = [{
              learnable_id: learnable_id,
              template: "presentation"
            }];
            data.session.num_items = 1;
					}
          _oldSuccess(data);
        }
      });
    }
    return _oldAjax(options);
  };
  `;
  document.body.appendChild(script);
}