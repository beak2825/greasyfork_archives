// ==UserScript==
// @name            I hate reading ! and .
// @author          Nick
// @namespace       http://www.example.url/to/your-web-site/
// @description     Put a good description in here
// @license         Creative Commons Attribution License
// @version	        0.99993
// @include         *
// @released        2006-04-17
// @updated         2006-04-19
// @compatible      Greasemonkey
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411142/I%20hate%20reading%20%21%20and%20.user.js
// @updateURL https://update.greasyfork.org/scripts/411142/I%20hate%20reading%20%21%20and%20.meta.js
// ==/UserScript==
 
/* 
 * This file is a Greasemonkey user script. To install it, you need 
 * the Firefox plugin "Greasemonkey" (URL: http://greasemonkey.mozdev.org/)
 * After you installed the extension, restart Firefox and revisit 
 * this script. Now you will see a new menu item "Install User Script"
 * in your tools menu.
 * 
 * To uninstall this script, go to your "Tools" menu and select 
 * "Manage User Scripts", then select this script from the list
 * and click uninstall :-)
 *
 * Creative Commons Attribution License (--> or Public Domain)
 * http://creativecommons.org/licenses/by/2.5/
*/
 
(function () {
  'use strict';
  var words = {

//'!': '.',
' \.': '.',
'Read The Tutorial Is Too Hard first on lightnovelbastion\.com (If you’re reading this elsewhere, it has been stolen!)': '',
'Read Tutorial Is Too Hard first on lightnovelbastion\.com (If you’re reading this elsewhere, it has been stolen!)': '',
'\\"': '"',
'Read latest Chapters at WuxiaWorld.Site Only': '',
'Find authorized novels in Webnovel，faster updates, better experience，Please click www.webnovel.com for visiting.': '',
'Read latest Chapters at Wuxia World.Site Only': '',
'Find authorized novels in Webnovel，faster updates, better experience，Please click www.webnovel.com for visiting. ': '',
      'read this novel at AERIALRAIN.COM for fastest update and extra chapters!!!': '',
      'read this novel at aerialrain(dot)com for fastest update and extra chapters!!!': '',

'Read this novel at aerialrain(dot)com for fastest update and extra chapters, plus other interesting novels!!!': '',
      'Artefacts': 'Artifacts',
      'Artefact': 'Artifact',
      'artefact': 'artifact',
      'artefacts': 'artifacts',
      'a Roused': 'an Awoken',
      'A roused': 'an Awoken',
      'a roused': 'an Awoken',
      'A roused': 'an Awoken',
      'Roused': 'Awoken',
      'roused': 'Awoken',
      'Read latest Chapters at W u xiaWorld.Site Only': '',


///////////////////////////////////////////////////////





    '': ''
  };
  for (i = 0; i < 26; i++) {
  var letter = (i+10).toString(36);
  //words['\.' + letter] = letter;

  }
  ///////////////////////////////////////////////////////////////////////////////
  var regexs = [
  ],
  replacements = [
  ],
  tagsWhitelist = [
    'PRE',
    'BLOCKQUOTE',
    'CODE',
    'INPUT',
    'BUTTON',
    'TEXTAREA'
  ],
  rIsRegexp = /^\/(.+)\/([gim]+)?$/,
  word,
  text,
  texts,
  i,
  userRegexp;
  // prepareRegex by JoeSimmons
  // used to take a string and ready it for use in new RegExp()
  function prepareRegex(string) {
    return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
  }
  // function to decide whether a parent tag will have its text replaced or not

  function isTagOk(tag) {
    return tagsWhitelist.indexOf(tag) === - 1;
  }
  delete words['']; // so the user can add each entry ending with a comma,
  // I put an extra empty key/value pair in the object.
  // so we need to remove it before continuing
  // convert the 'words' JSON object to an Array
  for (word in words) {
    if (typeof word === 'string' && words.hasOwnProperty(word)) {
      userRegexp = word.match(rIsRegexp);
      // add the search/needle/query
      if (userRegexp) {
        regexs.push(new RegExp(userRegexp[1], 'g')
        );
      } else {
        regexs.push(new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
          return fullMatch === '\\*' ? '*' : '[^ ]*';
        }), 'gi')
        );
      }
      // add the replacement

      replacements.push(words[word]);
    }
  }
  // do the replacement

  texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
  for (i = 0; text = texts.snapshotItem(i); i += 1) {
    if (isTagOk(text.parentNode.tagName)) {
      regexs.forEach(function (value, index) {
        text.data = text.data.replace(value, replacements[index]);
      });
    }
  }
  function GM_addStyle(css) {
      const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
      })();
      const sheet = style.sheet;
      sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }
    
    GM_addStyle("div.entry-content, div.entry-content p, p, div#chapter-container { font-size: 26px !important;margin-bottom: .5em !important;margin-top:0 !important;line-height: 1.375 !important;font-family: 'Roboto'; text-align: left !important;}");
    GM_addStyle("main#main { padding-left:5px !important; padding-right:5px !important; }");

    GM_addStyle('span[style="color:#fff"] { color: #8e8e8e !important; }');

    jQuery('p span[style*="color: rgb(255, 255, 255);"]').closest('p').hide()
    let html = jQuery('.reading-content').html().replace(/\(.*?\)/g, '');
    jQuery('.reading-content').html(html)
}());
