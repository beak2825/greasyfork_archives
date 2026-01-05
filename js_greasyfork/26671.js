// ==UserScript==
// @name         skytree-holiday
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  resoure dispatch style adaptor
// @author       You
// @match        http://skytree.alif2e.com/table/8/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26671/skytree-holiday.user.js
// @updateURL https://update.greasyfork.org/scripts/26671/skytree-holiday.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
@font-face {font-family: "dayicon";
  src: url('data:application/font-woff;charset=utf-8;base64,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') format('woff')
}

.dayicon {
  font-family:"dayicon" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dayicon-shuangxiu:before { content: "\\\e67d"; }

.dayicon-car:before { content: "\\\e608"; }

.dayicon-springfestival:before { content: "\\\e636"; }

.dayicon-baby:before { content: "\\\e62c"; }

.dayicon-oval88:before { content: "\\\e620"; }

.dayicon-keyboard:before { content: "\\\e603"; }

.dayicon.dayicon-shuangxiu{
  color: #00A3D7;
}

.dayicon.dayicon-car{
  color: #FFB760;
}

.dayicon.dayicon-springfestival{
  color: #FC7257;
}

.dayicon.dayicon-baby{
  color: #FFB760;
}

.dayicon.dayicon-oval88{
  color: #FFB760;
}

.dayicon.dayicon-keyboard{
  color: #409F10;
}

tbody td {
  position: relative;
}

tbody td span[contenteditable="plaintext-only"] {
  display:block;
  position: relative;
  padding: 0.7em 0;
  margin: 0 0.2em;
}

tbody td span.dayicon {
  display: block;
  position: absolute;
  width: calc(100% - 1px);
  text-align: center;
  line-height: 1.7em;
  font-size: 2em;
  z-index: 2;
  pointer-events: none;
}

tbody td span.daytext {
  color: #f3f3f3;
  z-index: 1;
}

tbody td span.daytext[contenteditable="plaintext-only"]:focus {
  background-color:white;
  color: black;
  z-index: 3;
}

`);
    // Your code here...
    
    (function(){

  var valMap = [
    {
      'text': '路途假',
      'style': 'car'
    },
    {
      'text': '年假',
      'style': 'oval88'
    },
    {
      'text': '春节假期',
      'style': 'springfestival'
    },
    {
      'text': '周末假期',
      'style': 'shuangxiu'
    },
    {
      'text': '陪产假',
      'style': 'baby'
    },
    {
      'text': '产假',
      'style': 'baby'
    },
    {
      'text': '【班】',
      'style': 'keyboard'
    }
  ];

  var $ = document.querySelector.bind(document);

  function $XPath (xpath, context) {
    var doc = (context && context.ownerDocument) || window.document;
    var result = doc.evaluate(xpath, context || doc, null, XPathResult.ANY_TYPE, null);
    switch (result.resultType) {
    case XPathResult.NUMBER_TYPE:
      return result.numberValue;
    case XPathResult.STRING_TYPE:
      return result.stringValue;
    case XPathResult.BOOLEAN_TYPE:
      return result.booleanValue;
    default:
      var nodes = [];
      var node;
      while (node = result.iterateNext())
        nodes.push(node);
      return nodes;
    }
  }

  function update(target) {
    var content = target.textContent;
    var classes = getClasses(content);
    target.className = classes.text;
    target.parentNode.querySelector('.icon').className = classes.icon;
  }

  function getClasses(text) {
    var iconClasses = 'icon';
    var textClasses = '';

    for (var i=0,len=valMap.length; i<len; i++) {
      if (valMap[i].text == text) {
        iconClasses += ' dayicon';
        iconClasses += ' dayicon-' + valMap[i].style;
        textClasses += 'daytext';
        break;
      }
    }

    return {
      icon: iconClasses,
      text: textClasses
    };
  }

  function prepare() {
    var nodes = $XPath("//td[@contenteditable='plaintext-only']");
    if(nodes.length) {
      nodes.forEach(function(node){
        node.removeAttribute('contenteditable');
        var content = node.textContent;
        var classes = getClasses(content);
        var iconClasses = classes.icon;
        var textClasses = classes.text;

        node.innerHTML = `<span class="${iconClasses}"></span><span class="${textClasses}" contenteditable="plaintext-only">${content}</span>`;
      });
    }
  }

  prepare();

  //scan();

  $('#container').addEventListener('blur', function (e) {
    console.log('111');
		if (e.target.contentEditable === 'plaintext-only') {
      update(e.target);
    }
  }, true);

})();
    
    
    
})();