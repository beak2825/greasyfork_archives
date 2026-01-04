// ==UserScript==
// @name         smapp extend
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  try to take over the world!
// @author       You
// @match        http://192.168.10.2:5100/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38359/smapp%20extend.user.js
// @updateURL https://update.greasyfork.org/scripts/38359/smapp%20extend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onDocClick(self) {
       return function(e) {
           if (e.target === self || self.contains(e.target)) {

           } else {
                          self.hide();
                          document.body.removeEventListener('click', self.$event);
           }
       };
    }

    const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

class ContextMenu extends HTMLElement {
   constructor() {
       super();
   }
    connectedCallback() {
        var self = this;
    this.style.position = "absolute";
       this.textContent = "context menu";
        this.style.left = 0;
        this.style.top = 0;
        this.style.display = "none";
        this.style.zIndex = 1000;
        this.style.backgroundColor = "#000";
        this.style.color = "#fff";
        this.style.padding = "10px";
        this.addEventListener('click', function() {
               copyToClipboard(self.textContent);
        });
    }
    showAtPos(left, top) {
        var self = this;
        this.style.display = "flex";
        this.style.left = left;
        this.style.top = top;
        this.$event = onDocClick(self);
        document.body.addEventListener('click', self.$event);
    }
    hide() {
        this.style.display = "none";
    }
}

customElements.define('context-menu', ContextMenu);

var contextMenu = document.createElement('context-menu');
document.getElementById('screen').appendChild(contextMenu);

    function createDetectInspector() {
var contentNodes = {};
// Select the node that will be observed for mutations
var targetNode = document.getElementById('inspector');

// Options for the observer (which mutations to observe)
var config = { attributes: true, childList: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            contentNodes = mutation.addedNodes;
        }
        else if (mutation.type == 'attributes') {

        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

        var ret = {};
        ret.getContentNodes = function() {
        return contentNodes;
        };
        return ret;

}

    function getInspectorFontinfo(contentNodes) {
    var ret = {  };
    if (contentNodes.length > 2) {
      var section = contentNodes[2];
      Array.prototype.slice.call(section.querySelectorAll('input')).map(ele=> {
return {
  type: ele.id ? ele.id : 'color',
  value: ele.value
};
}).forEach(v=> {
          if (v.type === 'color') {
           v.value = v.value.replace(/[^ ]+%/g, '').trim();
          }
          ret[v.type] = v.value;
});
    }
return ret;
}

    let inspectorDetector = createDetectInspector();

  document.addEventListener('contextmenu', function(e) {
     e.preventDefault();
      let fontInfo = getInspectorFontinfo(inspectorDetector.getContentNodes());
      let { offsetLeft, offsetTop, clientWidth, clientHeight, style } = e.target;
      contextMenu.innerHTML = fontInfo.color;
      contextMenu.showAtPos((offsetLeft + clientWidth) + "px", (offsetTop + 10) + "px");
  });
})();