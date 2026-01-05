// ==UserScript==
// @name        afs formserver development menu
// @namespace   com.aforms2web.ds.ujs
// @description add the development menu to formservers
// @include     *afs_*.do*
// @include     *vav_*.do*
// @include     *formserver*.do*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19990/afs%20formserver%20development%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/19990/afs%20formserver%20development%20menu.meta.js
// ==/UserScript==

var js_forceTimeoutOverlay = "showTimeoutWarning('<h2>Timeout Warnung</h2><p>Ihre Session wird in 1 Minute ablaufen!</p>','Ok');";
var elem = document.createElement("div");
elem.id = 'xMy_menu';
elem.innerHTML = '<strong title="my development options">µ ⚒ ⌥</strong>' //[my dev menu]
	+ '<span class="xMy_tool" title="Add Toggler to all Blocks" style="position: relative; top: -1px; left: 1px;" onclick="xMy_add_blocktoggler();">◈</span>'
	+ '<span class="xMy_tool" title="Toggle all BlockContent visibilities" style="transform: rotate(-90deg);" onclick="xMy_toggle_allBlocks();">➠</span>'
	+ '<span class="xMy_tool" title="Remove Toggler from all Blocks" style="font-size: 12px; margin-top:0px;" onclick="xMy_removeAllToggler();">♻</span>'
	+ '<span class="xMy_sep">|</span>'
	+ '<span class="xMy_tool" title="Click \'previous\' button" onclick="document.getElementById(\'previous\').click();">⤺</span>'
	+ '<span class="xMy_tool" title="Click \'next\' button" onclick="document.getElementById(\'next\').click();">⤳</span>'
	+ '<span class="xMy_tool" title="Jump to Navigationbar" style="transform: rotate(180deg);" onclick="document.getElementById(\'control_bar\').scrollIntoView();">↸</span>'
	+ '<ul>'
	+ '<li><span onclick="xMy_add_blocktoggler()" >Add Toggler to all Blocks</span></li>'
	+ '<li><span onclick="xMy_toggle_allBlocks()" >Toggle all BlockContent visibilities</span></li>'
	+ '<li><span onclick="xMy_removeAllToggler()" >Remove Toggler from all Blocks</span></li>'
	+ '<li><span onclick="document.getElementById(\'next\').click();" >Click \'next\' button</span></li>'
	+ '<li><span onclick="document.getElementById(\'previous\').click();" >Click \'previous\' button</span></li>'
	+ '<li><span onclick="document.getElementById(\'control_bar\').scrollIntoView();" >jump to Navigationbar</span></li>'
	+ '<li><span onclick="' + js_forceTimeoutOverlay + '" >force timeout overlay</span></li>'
	+ '<li><span onclick="xMy_bodyPaddingRight(80)" >body padding-right:80% / redo</span></li>'
	+ '</ul>';
document.body.appendChild(elem);

var script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.innerHTML = 'var xMy_bodyPaddingRightOrig = "notSet";'
	+ 'function xMy_bodyPaddingRight(size){'
	+ '  var bdy = document.getElementsByTagName("body")[0];'
	+ '  if(xMy_bodyPaddingRightOrig == "notSet"){ xMy_bodyPaddingRightOrig = bdy.style.paddingRight; bdy.style.paddingRight = size + "%"; }'
	+ '  else{ bdy.style.paddingRight = xMy_bodyPaddingRightOrig; xMy_bodyPaddingRightOrig = "notSet"; }'
	+ '}';
document.head.appendChild(script);

var style = document.createElement("style");
style.setAttribute("type", "text/css");
style.innerHTML = '#xMy_menu { position: fixed; top: -1px; text-align: center; width:20em; left: 50%; margin-left: -10em; font-size:66%; border: 1px dotted rgba(77,77,144,0.66); border-radius: 0 0 0.66em 0.66em; background-color: rgba(222,222,222,0.75); color: #999999; z-index: 99999; } '
	+ '#xMy_menu:hover { background-color: rgba(222,222,222,0.90); border-color: #339933; box-shadow: 2px 2px 5px 1px #339933; color: #333333; } '
	+ '#xMy_menu ul { display: none; margin: 0.25em 0.25em 0.25em 1em; text-align: left; border-top: 1px dashed rgba(77,77,144,0.66); padding: 0.33em; } #xMy_menu:hover ul { display: block; } '
	+ '#xMy_menu strong { font-weight: normal; font-style: italic; color: #339933; } '
	+ '#xMy_menu strong:after { content: " ]"; color: #999999; } '
	+ '#xMy_menu strong:before { content: "[ "; color: #999999; } '
	+ '#xMy_menu span { cursor: pointer; } '
	+ '#xMy_menu span:hover { text-decoration: underline; color: #339933;  } '
	+ '#xMy_menu span.xMy_sep { float: left; margin: -3px 1px; color: #999999; font-size: 14px; cursor: default; } '
	+ '#xMy_menu span.xMy_tool:hover { text-decoration: none; } '
	+ '#xMy_menu span.xMy_tool { float: left; font-size: 16px; margin: -3px 1px; } ';
document.head.appendChild(style);

// new part

	var xMy_css = new Array();

	function xMy_writeStyle(css) {
	    var style = document.createElement('style');
	    style.type = 'text/css';
	    if (document.getElementsByTagName) {
		document.getElementsByTagName('head')[0].appendChild(style);
		if (style.sheet && style.sheet.insertRule) {
		    for (var i = 0; i < xMy_css.length; i++) {
		        style.sheet.insertRule(xMy_css[i], 0);
		    }
		}
	    }
	}

	function xMy_addStyle(style) {
	    xMy_css[xMy_css.length] = style;
	}

	// Define your CSS here

	xMy_addStyle(".xMy_blockListToggle{"
	 + "  margin: 0 7px 0 -7px !important;"
	 + "  color: #333333;"
	 + "  cursor: pointer;"
	 + "  position: relative;"
	 + "  top: -2px;"
	 + "  font-size: 16px;"
	 + "}");
	xMy_addStyle(".xMy_blockListToggle:hover{"
	 + "  color: #339933;"
	 + "  text-shadow: 1.75px 1.25px 1px #333333;"
	 + "}");

	// Writes CSS to the document
	xMy_writeStyle(xMy_css);

	var newScript = document.createElement("script");
	var typeNode = document.createAttribute("type");
	typeNode.nodeValue = "text/javascript";
	newScript.setAttributeNode(typeNode);

	newScript.appendChild(document.createTextNode(""
	 + "function xMy_toggle_blockList(elem, forceShow) {\n"
	 + "  var blockHeaderNode = elem.parentNode.parentNode.parentNode.parentNode.parentNode;\n"
	 + "  var blockContentNode = blockHeaderNode;\n"
	 + "  do {\n"
	 + "    blockContentNode = blockContentNode.nextSibling;\n"
	 + "  } while(blockContentNode.tagName == null || !(blockContentNode.tagName === 'DIV' || blockContentNode.tagName === 'div'));\n"
	 + "  if(forceShow || blockContentNode.style.display != 'block')  {\n"
	 + "    blockContentNode.style.display = 'block';\n"
	 + "    elem.childNodes[0].nodeValue = '▲';\n" // ▲△
	 + "  } else {\n"
	 + "    blockContentNode.style.display = 'none';\n"
	 + "    elem.childNodes[0].nodeValue = '▼';\n" // ▼▽
	 + "  }\n"
	 + "}\n"
	 + "function xMy_toggle_allBlocks() {\n"
	 + "  if(!xMy_hasToggler()){\n"
	 + "    xMy_add_blocktoggler();\n"
	 + "  }\n"
	 + "  var elemList = document.getElementsByClassName('xMy_blockListToggle');\n"
	 + "  if(elemList != null && elemList.length > 0){\n"
	 + "    for(idx = elemList.length - 1; idx >= 0; idx--)  {\n"
	 + "      xMy_toggle_blockList(elemList[idx]);\n"
	 + "    }\n"
	 + "  }\n"
	 + "}\n"
	 + "function xMy_removeAllToggler() {\n"
	 + "  var elemList = document.getElementsByClassName('xMy_blockListToggle');\n"
	 + "  if(elemList != null && elemList.length > 0){\n"
	 + "    for(idx = elemList.length - 1; idx >= 0; idx--) {\n"
	 + "      var elem = elemList[idx];\n"
	 + "      if(elem.tagName != null && (elem.tagName === 'SPAN' || elem.tagName === 'span')){\n"
	 + "        xMy_toggle_blockList(elem, true);\n"
	 + "        elem.parentNode.removeChild(elem);\n"
	 + "      }\n"
	 + "    }\n"
	 + "  }\n"
	 + "}\n"
	 + "function xMy_hasToggler() {\n"
	 + "  var elemList = document.getElementsByClassName('xMy_blockListToggle');\n"
	 + "  return elemList != null && elemList.length > 0;\n"
	 + "}\n"
	 + "function xMy_add_blocktoggler() {\n"
	 + "  if(!xMy_hasToggler()){\n"
	 + "    var blockList = document.getElementsByClassName('block');  \n"
	 + "    if(blockList != null && blockList.length > 0){\n"
		// ### Generate Toggle Link
	 + "      for(idx = blockList.length - 1; idx >= 0; idx--){\n"
	 + "        var block = blockList[idx];\n"
	 + "        if(block.tagName != null && (block.tagName === 'DIV' || block.tagName === 'div')){\n"
	 + "          var blockHeader = block.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1];\n"
	 + "          var newSpan = document.createElement('span');\n"
	 + "          var attrNode = document.createAttribute('class');\n"
	 + "          attrNode.nodeValue = 'xMy_blockListToggle';\n"
	 + "          newSpan.setAttributeNode(attrNode);\n"
	 + "          var titleNode = document.createAttribute('title');\n"
	 + "          titleNode.nodeValue = 'Toggle BlockContent visibility';\n"
	 + "          newSpan.setAttributeNode(titleNode);\n"
	 + "          var onclickNode = document.createAttribute('onclick');\n"
	 + "          onclickNode.nodeValue = 'xMy_toggle_blockList(this);';\n"
	 + "          newSpan.setAttributeNode(onclickNode);\n"
	 + "          newSpan.appendChild(document.createTextNode('▲'));\n"
	 + "          blockHeader.insertBefore(newSpan, blockHeader.childNodes[1]);\n"
	 + "        }\n"
	 + "      }\n"
	 + "    }\n"
	 + "  }\n"
	 + "} "));
	document.getElementsByTagName('head')[0].appendChild(newScript);


