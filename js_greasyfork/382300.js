// ==UserScript==
// @name           MDN Live Sample Preview
// @description    Displays live samples during preview
// @match          https://developer.mozilla.org/*/docs/preview-wiki-content
// @run-at         document-end
// @version        1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/382300/MDN%20Live%20Sample%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/382300/MDN%20Live%20Sample%20Preview.meta.js
// ==/UserScript==


function main() {

  // Add class text-content to have the proper styles
  document.getElementById('content').classList.add('text-content');

  // Update header's ID
  var headers = document.querySelectorAll('h1,h2,h3,h4,h5,h6');

  for(var i=0; i<headers.length; i++) {
  	var h  = headers[i],
        id = h.getAttribute('name');

    if(!id) {
      id = h.firstChild.textContent.trim();
      id = id.replace(/:/g, ' ');
      id = id.replace(/\xa0/g, ' '); // &nbsp;
      id = id.replace(/[ _]+/g, '_');
    }
    h.setAttribute('id', id);
  }

  // Lets you preview the live samples during preview
  var iframes = document.querySelectorAll('iframe');

  for(var j=0; j<iframes.length; j++) {
    var iframe  = iframes[j];
    if(!iframe.id) {
      continue;
    }

    var id      = iframe.id.replace(/^frame_/, ''),
        section = document.getElementById(id);
		if(!section) {
      console.error("Element \"" + id + "\" doesn't exist");
    	continue;
    }

    var blocks  = {};

    // Div
    if(section.nodeName == 'DIV') {
        var pres = section.querySelectorAll('pre');

        for(var i=0; i<pres.length; i++) {
          getPre(blocks, pres[i]);
        }

    // h1,h2,h3,h4,h5,h6
    } else {
      while(section) {
        if(section.nodeName == "PRE") {
          getPre(blocks, section);

        } else {
          var pres = section.querySelectorAll('pre');

          for(var i=0; i<pres.length; i++) {
            getPre(blocks, pres[i]);
          }
        }
        section = section.nextElementSibling;

        if(!section || section.classList.contains("sample-code-table") || section.querySelector("iframe")) {
          break;
        }
      }
    }
    if(Object.keys(blocks)) {
      var html = '';

      if(blocks.html) {
        for(var i=0; i<blocks.html.length; i++) {
           html += blocks.html[i].replace(/href="\/files\//g, 'href="https://developer.mozilla.org/files/');
        }
      }

      html += '\n<style>';
      html += `body { margin: 0; }
   .playable-code {
      background-color: #f4f7f8;
      border: none;
      border-left: 6px solid #558abb;
      border-width: medium medium medium 6px;
      color: #4d4e53;
      height: 100px;
      width: 90%;
      padding: 10px 10px 0;
  } .playable-buttons {
      text-align: right;
      width: 90%;
      padding: 5px 10px 5px 26px;
  }`;
      html += '</style>';
      if(blocks.css) {
        // put each CSS block in a new tag, to make @namespace work
        for(var i=0; i<blocks.css.length; i++) {
           html += '<style>\n' + blocks.css[i] + '</style>';
        }
      }

      if(blocks.js) {
        html += '\n<script>';
        for(var i=0; i<blocks.js.length; i++) {
           html += '\n' + blocks.js[i];
        }
        html += '</script>';
      }

      iframe.src = 'data:text/html;charset=utf-8,' + escape(html);
    }
  }

  function getPre(blocks, pre) {
    var type = pre.className.match(/brush: *(html|js|css)/);

    if(!type) {
      return;
    }
    type = type[1];

    if(!blocks[type]){
      blocks[type] = [];
    }
    blocks[type].push(pre.innerText);
  }
}

window.onload = main();