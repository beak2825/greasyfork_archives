// ==UserScript==
// @name         TeslaFi Fixer
// @version      0.4
// @description  To make TeslaFi look better and use labels
// @author       /u/Flames5123
// @match        https://teslafi.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js 
// @grant        none
// @namespace https://greasyfork.org/users/314927
// @downloadURL https://update.greasyfork.org/scripts/387613/TeslaFi%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/387613/TeslaFi%20Fixer.meta.js
// ==/UserScript==
(function() {
    main();
})();

// the guts of this userscript
function main() {
	function trim (s, c) {
		return s.replace(new RegExp(
			"[" + c + "]+$", "g"
		), "");
	}
	
	function MakeLabel(Text, ForCheckbox, isSmall) {
		var ThisLabel = document.createElement('label');
		ThisLabel.setAttribute('for', ForCheckbox);
		$(ThisLabel).text(Text);
		if (isSmall) {
			ThisLabel.className = 'CheckboxLabel CheckboxLabelSmall';
		} else {
			ThisLabel.className = 'CheckboxLabel';
		}
		return ThisLabel;
	}
	
	function TranformTextToLabelWithCheckbox(node, includeWhitespaceNodes, isBefore, isPerferencePage) {
		var textNodes = [], nonWhitespaceMatcher = /\S/;

		function FormatTextNodes(node) {
			if (!(node == undefined)){
				if (node.nodeType == 3) {
					if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
						var isSmall = false;
						var ThisCheckbox = $(node.previousSibling);
						if (!isBefore) {
							ThisCheckbox = $(node.nextSibling);
						}
						
						//for the small elements
						if (ThisCheckbox.length == 0 && node.parentElement.tagName == "SMALL") {
							isSmall = true;
							node = node.parentElement;
							ThisCheckbox = $(node.previousSibling);
							if (!isBefore) {
								ThisCheckbox = $(node.nextSibling);
							}
						}
						
						if (ThisCheckbox.attr('type') == 'checkbox') {
							if (ThisCheckbox.attr('id') === undefined) {
								ThisCheckbox.attr('id', ThisCheckbox.attr('name') );
							}
							var NewLabel = MakeLabel(trim($(node).text().trim(), ':'), ThisCheckbox.attr('id'), isSmall);
							
							if (isSmall) {
								var ThisSmall = document.createElement('small');
								$(ThisSmall).append(ThisCheckbox);
								$(ThisSmall).append(NewLabel);
								node.parentNode.insertBefore(ThisSmall, node);
							} else {
								if (!isPerferencePage) {
                                    node.parentNode.insertBefore(NewLabel, node);

									if (!isBefore) {
                                        $(NewLabel).before(ThisCheckbox);
                                    }
								} else {
									$(NewLabel).insertAfter(ThisCheckbox);
								}
							}
							
							node.remove();
						}
					}
				} else {
					for (var i = 0, len = node.childNodes.length; i < len; ++i) {
						FormatTextNodes(node.childNodes[i]);
					}
				}
			}
		}
		FormatTextNodes(node);
	}
	
	if (~window.location.href.indexOf('index.php') || ~window.location.href.indexOf('?sleeps')) {
		TranformTextToLabelWithCheckbox(document.getElementById('myFormID'), false, true, false);
	} else if (~window.location.href.indexOf('userlogin.php')){
		TranformTextToLabelWithCheckbox($('input:checkbox').parent()[0], false, true, false);
	} else if ($('input:checkbox').length > 0) {
		$('input:checkbox').each(function() {
			if ($(this).is(':only-child')) {
				if ($(this).attr('id') === undefined) {
					$(this).attr('id', $(this).attr('name') + $(this).attr('value'));
				}
				var NewLabel = MakeLabel(" ", $(this).attr('id'));
				$(this).context.parentNode.appendChild(NewLabel);
				
			} else {
				if (~window.location.href.indexOf('preferences.php')) {
					TranformTextToLabelWithCheckbox($(this).parent()[0], false, false, true);
				} else {
                    if ($(this).attr('name') == 'versionEmail') {
						var TextNode = document.createTextNode("Get Email");
						$(TextNode).insertBefore(this);
					}
					TranformTextToLabelWithCheckbox($(this).parent()[0], false, false, false);
				}
			}
		});
	}
  }