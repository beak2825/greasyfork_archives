// ==UserScript==
// @name           Memrise Multimedia Preview
// @description    Preview Markdown during edition
// @match          http://*.memrise.com/*/*/edit*
// @match          https://*.memrise.com/*/*/edit*
// @run-at         document-end
// @version        1.0.0
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/387803/Memrise%20Multimedia%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/387803/Memrise%20Multimedia%20Preview.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function main() {
  var Preview = {
    init() {
      this.togglePreview = this.togglePreview.bind(this);
      this.addCSS();
      this.watchNetwork();

      // Multimedia level that loaded before our event listener
      setTimeout(function(){

        $('.multimedia-edit').each(function(i, node){
          this.initLvl($(node));
        }.bind(this));

      }.bind(this), 100);
    },

    addCSS() {
      var css = `
      .multimedia-edit nav {
          border: 1px solid #d1d5da;
          border-radius: 3px 3px 0 0;
      }
      .multimedia-edit textarea {
          border-radius: 0 0 6.2px 6.2px;
      }
      .preview__tabs {
          margin: 0;
          margin-bottom: -1px;
          padding: 6px 10px 0;
          background: #f6f8fa;
          border-radius: 3px 3px 0 0;
      }
      .preview__tab {
          display: inline-block;
          padding: 8px 12px;
          border: 1px solid transparent;
          border-bottom: 0;
          border-radius: 3px 3px 0 0;
          color: #24292e;
          cursor: pointer;
      }
      .preview__tab.active {
          background-color: #fff;
          border-color: #d1d5da;
					pointer-events: none;
      }
      .preview__tab:hover,
      .preview__tab:focus {
          color: black;
      }
			.preview__content {
			  	border: 1px solid #d1d5da;
					padding: 8px;
					padding-top: 18px;
			}
			.multimedia-wrapper {
          width: 558px;
      }
			`;

      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = css;
      document.head.appendChild(styleSheet);
    },

    watchNetwork() {
      $(document).ajaxSend(function (e, xhr, settings) {
        var get_lvl = settings.url.match(/^\/ajax\/level\/editing_html\/\?level_id=(\d+)/);

        if(!get_lvl) {
          return;
        }
        xhr.always(function() {
          this.addPreview('l_' + get_lvl[1]);
        }.bind(this));
      }.bind(this));
    },

    addPreview(idLvl) {
      if(document.getElementById(idLvl).getAttribute('data-pool-id')) {
        return;
      }

      setTimeout(function(){
        this.initLvl($('.multimedia-edit', '#' + idLvl));
      }.bind(this), 300);
    },

    initLvl($container) {
      $container.prepend(`<nav><ul class="preview__tabs">
          <li class="preview__tab preview__tab--edit active">Edit</li>
          <li class="preview__tab preview__tab--preview">Preview</li>
        </ul></nav><div class="preview__content hide"><div class="multimedia-wrapper"></div></div>`)
     	.on('click', 'li', this.togglePreview);
    },

    togglePreview(e) {

      // Toggle current tab
    	var $btn       = $(e.target),
          isPreview  = $btn.hasClass('preview__tab--preview');

      $btn.addClass('active')
        	.siblings().removeClass('active');

      // Show/hide preview
      var $container = $btn.closest('.multimedia-edit'),
          $textarea  = $('textarea', $container),
          $preview   = $('.preview__content', $container);

      if(isPreview) {
        var html = this.markdownToHTML($textarea.val());

        $preview.children(":first").html(html);
        $preview.removeClass('hide');
        $textarea.addClass('hide');
      } else {
        $preview.addClass('hide');
        $textarea.removeClass('hide');
      }
    },

    markdownToHTML(markdown) {
      // https://github.com/evilstreak/markdown-js
      return MEMRISE.renderer.rich_format(""+markdown);
  	}
  };

  window.addEventListener('load', function(){
    Preview.init();
  }, false);
}

// Inject JS directly in page to prevent limitations of access
var script = document.createElement('script');

script.setAttribute("type", "application/javascript");
script.appendChild(document.createTextNode('('+ main +')();'));
document.body.appendChild(script);