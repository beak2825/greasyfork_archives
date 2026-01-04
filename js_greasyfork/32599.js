// ==UserScript==
// @name        ZhihuZhuangbilityExterminator
// @namespace   nein
// @author      ddOs
// @description turn every fuckin' Zhihu-style right quote into normal quote
// @include     http://*.zhihu.com/*
// @include     https://*.zhihu.com/*
// @version     2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32599/ZhihuZhuangbilityExterminator.user.js
// @updateURL https://update.greasyfork.org/scripts/32599/ZhihuZhuangbilityExterminator.meta.js
// ==/UserScript==

// references: 
// https://greasyfork.org/en/scripts/25776-coincidence-detector for replacing method
// https://stackoverflow.com/questions/6480082/add-a-javascript-button-using-greasemonkey-or-tampermonkey for button

//====================================
var zNode = document.createElement('div');
zNode.innerHTML = '<button id="myButton" type="button">'+ 'Fuck 果乎/逼乎/绿乎/whatever乎<br /> right in the pussy!</button>'
;
zNode.setAttribute('id', 'myContainer');
document.body.appendChild(zNode);

//--- Activate the newly added button.
document.getElementById('myButton').addEventListener('click', ButtonClickAction, false
);
function ButtonClickAction(zEvent) {
  (function () {
    function walk(node) {
      // I stole this function from here:
      // http://is.gd/mwZp7E
      var child,
      next;
      switch (node.nodeType)
        {
        case 1:
        case 9:
        case 11:
          child = node.firstChild;
          while (child)
          {
            next = child.nextSibling;
            walk(child);
            child = next;
          }
          break;
        case 3:
          handleText(node);
          break;
      }
    }
    function handleText(textNode) {
      //textNode.nodeValue = textNode.nodeValue.replace('“', '\n <b>“</b>\n');
      //textNode.nodeValue = textNode.nodeValue.replace('”', '\n<b>”</b> \n');
      //textNode.nodeValue = textNode.nodeValue.replace('「', '\n <b>“</b>\n');
      //textNode.nodeValue = textNode.nodeValue.replace('」', '\n<b>”</b> \n');
      //textNode.nodeValue = textNode.nodeValue.replace('“', '\n <b>“</b>\n');
      //textNode.nodeValue = textNode.nodeValue.replace('”', '\n<b>”</b> \n');
      textNode.nodeValue = textNode.nodeValue.replace('「', '“');
      textNode.nodeValue = textNode.nodeValue.replace('」', '”');
      textNode.nodeValue = textNode.nodeValue.replace('『', '‘');
      textNode.nodeValue = textNode.nodeValue.replace('』', '’');
    }
    walk(document.body);
  }) ();
}

//--- Style our newly added elements using CSS.
GM_addStyle(multilineStr(function () { /*!
    #myContainer {
        position:               fixed;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
*/
}));
//====================================

//====================================
var zNode2 = document.createElement('div');
zNode2.innerHTML = '<button id="myButton2" type="button">'+ 'Have some fun</button>'
;
zNode2.setAttribute('id', 'myContainer2');
document.body.appendChild(zNode2);

//--- Activate the newly added button.
document.getElementById('myButton2').addEventListener('click', ButtonClickAction2, false
);
function ButtonClickAction2(zEvent) {
  (function () {
    function walk(node) {
      // I stole this function from here:
      // http://is.gd/mwZp7E
      var child,
      next;
      switch (node.nodeType)
        {
        case 1:
        case 9:
        case 11:
          child = node.firstChild;
          while (child)
          {
            next = child.nextSibling;
            walk(child);
            child = next;
          }
          break;
        case 3:
          handleText(node);
          break;
      }
    }
    function handleText(textNode) {
      //var words = {'逼乎', '果乎', '绿乎', '日乎'}
      //textNode.nodeValue = textNode.nodeValue.replace('知乎', words[Math.floor(Math.random()*4)]);
      textNode.nodeValue = textNode.nodeValue.replace('知乎', '逼乎');
    }
    walk(document.body);
  }) ();
}

//--- Style our newly added elements using CSS.
GM_addStyle(multilineStr(function () { /*!
    #myContainer2 {
        position:               fixed;
        top:                    0;
        right:                  0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton2 {
        cursor:                 pointer;
    }
    #myContainer2 p {
        color:                  red;
        background:             white;
    }
*/
}));
//====================================

function multilineStr(dummyFunc) {
  var str = dummyFunc.toString();
  str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function () { /*!
  .replace(/\s*\*\/\s*\}\s*$/, '') // Strip */ }
  .replace(/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
  ;
  return str;
}
