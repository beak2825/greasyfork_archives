// ==UserScript==
// @name         Web Inspector
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Allows you to inspect web pages
// @author       https://greasyfork.org/en/users/85040-d-a-n
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520807/Web%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/520807/Web%20Inspector.meta.js
// ==/UserScript==

// MIT License

// Copyright(c) 2024-2025 Dan

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
// 	in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// This userscript defines a function on the web page you visit
// For the function to do anything, use this bookmarklet:
// javascript:(function(){WEB_INSPECTOR();})();
// A bookmarklet is essentially a regular browser bookmark/favorite but with a JavaScript url

// jshint esnext: false, esversion: 8

(() => {
	function debugAlert(str) {
		const debug = false;

		if (debug) {
			alert(str);
		}
	}

	function el(tagName, className) {
		const ret = document.createElement(tagName);

		if (className) {
			ret.className = className;
		}

		return ret;
	}

	function spanNode(className, innerTextOrText) {
		const span = el('span', className);

		if (typeof innerTextOrText !== 'undefined') {
			if (typeof innerTextOrText === 'string') {
				innerTextOrText = textNode(innerTextOrText);
			}

			if (typeof innerTextOrText === 'object' && isFinite(innerTextOrText.nodeType) && innerTextOrText.nodeType === Node.TEXT_NODE) {
				// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
				// using instanceof doesnt always work

				append(span, innerTextOrText);
			}
			else {
				throw new Error('spanNode(className, innerTextOrText) innerTextOrText is ' + innerTextOrText);
			}
		}

		return span;
	}

	function brNode() {
		return el('br');
	}

	function textNode(txt) {
		return document.createTextNode(txt);
	}

	function append(parent, nodes) {
		// enables much better minimising

		if (!Array.isArray(nodes)) {
			nodes = [nodes];
		}

		nodes.forEach((node) => {
			parent.appendChild(node);
		});
	}

	function htmlSymbol(symbol) {
		return spanNode('html-symbol', symbol);
	}

	function createTagNameNode(tagName) {
		return spanNode('tag-name', tagName);
	}

	function createTagAttributeValueNode(attribute) {
		const isLink = ['href', 'src'].includes(attribute.name);
		const isStyle = attribute.name === 'style';
		const span = spanNode('tag-attribute-value');

		if (isLink) {
			append(span, [textNode('"'), createLink(attribute.value, attribute.value), textNode('"')]);
		}
		else if (isStyle) {
			append(span, [textNode('"'), parseStyle(attribute.ownerElement.style), textNode('"')]);
		}
		else {
			append(span, textNode(JSON.stringify(attribute.value)));
		}

		return span;
	}

	function createPlainTextNode(node) {
		// TODO html entities highlighting

		return spanNode('text', textNode(applyHTMLWhitespaceRules(node.textContent)));
	}

	function elementDoesNotNeedToBeClosed(tagName) {
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element

		return ['base', 'link', 'meta', 'hr', 'br', 'wbr', 'area', 'img', 'track', 'embed', 'source', 'input'].includes(tagName);
	}

	function applyHTMLWhitespaceRules(text) {
		// https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace

		return text
			.replace(/^[\t ]+/mg, '')
			.replace(/[\t\r\n]/g, ' ')
			.replace(/ {2,}/g, ' ');
	}

	function createSpacer(spacing) {
		const spacer = el('pre', 'spacer');

		spacer.innerHTML = spacing;

		return spacer;
	}

	function createIndentSpacer(indentLevel) {
		const space = '\t';
		let spacing = '';

		while (indentLevel > 0) {
			spacing += space;
			indentLevel--;
		}

		const spacer = createSpacer(spacing);

		spacer.className += ' indentation';

		return spacer;
	}

	function createLink(url, displayText) {
		const link = el('a');

		link.href = url;
		link.target = '_blank';

		append(link, textNode(displayText));

		return link;
	}

	function createExpandCollapseBtn(element) {
		// https://www.amp-what.com &#9660

		const btn = el('button', 'expand-collapse-button');

		btn.innerHTML = '&#9660;';

		return btn;
	}

	function setupExpandCollapseBtns(output) {
		// outerHTML doesnt pass event handlers, so add them all after finished generating the content

		const btns = output.querySelectorAll('button.expand-collapse-button');

		for (let i = 0; i < btns.length; i++) {
			btns[i].onclick = function(e) {
				const btn = e.target;
				let element;

				if (btn.parentNode.className.match(/^html-line\b/)) {
					element = btn.parentNode.querySelector('.tag-inner');
				}
				else if (btn.parentNode.className.match(/^[a-z\-]+-rule\b/)) {
					element = btn.parentNode.querySelector('.css-brace-content');
				}
				else {
					console.error('btn', btn);

					throw new Error('setupExpandCollapseBtns(output) btns[i].onclick showing/collapsing button does not correctly control html or css');
				}

				if (element.className.match(/ collapsed /)) {
					element.className = element.className.replace(/ collapsed /, '');
				}
				else {
					element.className += ' collapsed ';
				}
			};
		}
	}

	function getUrlOrigin(link) {
		debugAlert('getUrlOrigin(link) link = ' + link);

		if (typeof URL !== 'function') {
			throw new Error('Your browser does not support the URL constructor');
		}

		let url;

		try {
			url = new URL(link);
		}
		catch(error) {
			throw new Error('getUrlOrigin(link) link is not a valid url. link = ' + link);
		}
		finally {
			if (url && !url.origin) {
				throw new Error('getUrlOrigin(link) link when turned into a URL does not have an origin. link = ' + link);
			}

			if (url.origin === 'null') {
				// some urls like about:blank have a 'null' origin
				return null;
			}

			return url.origin;
		}
	}

	async function getIframeContent(node, tagNode, indentLevel) {
		const iframeSrcOrigin = getUrlOrigin(node.src);
		const tagInnerNode = spanNode('tag-inner collapsed ');
		let _resolve;

		function appendIframeOuterHTML(iframeOuterHTML) {
			try {
				window.removeEventListener('message', receiveParseHTMLOutputMessage);
				tagInnerNode.insertAdjacentHTML('beforeend', iframeOuterHTML);
				append(tagNode, tagInnerNode);
				_resolve();
			}
			catch(error) {
				throw error;
			}
		}

		function receiveParseHTMLOutputMessage(event) {
			// security does not matter as much for receiving the messages
			// at worst its the incorrect html

			try {
				if (event.origin !== iframeSrcOrigin) {
					return;
				}

				if (!(event.data && event.data.WEB_INSPECTOR && event.data.WEB_INSPECTOR.parseHTMLOutput)) {
					return;
				}

				appendIframeOuterHTML(event.data.WEB_INSPECTOR.parseHTMLOutput);
			}
			catch(error) {
				throw error;
			}
		}

		return await new Promise((resolve) => {
			_resolve = resolve;

			if (!iframeSrcOrigin) {
				appendIframeOuterHTML(spanNode('userscript-error', 'Error: unable to get iframe content because iframe src has a "null" origin. postMessage does not allow "null" origins to be used to communicate between windows.').outerHTML);
				return;
			}

			window.addEventListener('message', receiveParseHTMLOutputMessage);
			node.contentWindow.postMessage({WEB_INSPECTOR: {parseHTML: indentLevel + 1}}, iframeSrcOrigin);
		});
	}

	function parseHTML_addNewLineSpacing(parent, indentLevel) {
		append(parent, brNode());

		if (indentLevel > 0) {
			append(parent, createIndentSpacer(indentLevel));
		}

		const spacing = createSpacer('  ');

		append(parent, spacing);

		return spacing;
	}

	function parseHTML_parseElementAttributes(tagNode, node) {
		const nodeAttributes = node.attributes;

		if (nodeAttributes.length) {
			const tagAttributesNode = spanNode('tag-attributes');

			for (const attribute of nodeAttributes) {
				append(tagAttributesNode, [htmlSymbol(' '), spanNode('tag-attribute-name', attribute.name), htmlSymbol('='), createTagAttributeValueNode(attribute)]);
			}

			append(tagNode, tagAttributesNode);
		}
	}

	function parseHTML_parseElementCloseTag(indentLevel, line, tagNode, tagName) {
		if (tagNode.querySelectorAll('.tag, .css, .script').length > 0) {
			append(tagNode, brNode());

			if (indentLevel > 0) {
				append(tagNode, createIndentSpacer(indentLevel));
			}

			const spacing = parseHTML_addNewLineSpacing(line, indentLevel);
			const expandCollapseBtn = createExpandCollapseBtn(tagNode.querySelector('.tag-inner'));

			spacing.insertAdjacentElement('afterend', expandCollapseBtn);
			expandCollapseBtn.insertAdjacentHTML('afterend', '<pre class="spacer"> </pre>');
			append(tagNode, spacing);
		}

		append(tagNode, [htmlSymbol('</'), createTagNameNode(tagName), htmlSymbol('>')]);
	}
	
	async function parseHTML(node, parent, indentLevel) {
		// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
		// using instanceof doesnt always work

		const isElement = node.nodeType === Node.ELEMENT_NODE;
		const isText = node.nodeType === Node.TEXT_NODE;
		const isComment = node.nodeType === Node.COMMENT_NODE;
		const isDoctype = node.nodeType === Node.DOCUMENT_TYPE_NODE;

		const line = spanNode('html-line');

		if (isElement) {
			const tagNode = spanNode('tag');
			const tagName = node.tagName.toLowerCase();
			const elementIsSelfClosing = elementDoesNotNeedToBeClosed(tagName);
			const style = getComputedStyle(node);

			// FIXME isHidden detection isn't fully correct https://developer.mozilla.org/en-US/docs/Web/CSS/visibility
			const isHidden = style.display === 'none' || style.visibility !== 'visible';

			if (isHidden) {
				tagNode.className += ' hidden-tag';
			}

			append(tagNode, [htmlSymbol('<'), createTagNameNode(tagName)]);
			parseHTML_parseElementAttributes(tagNode, node);
			append(tagNode, htmlSymbol((elementIsSelfClosing ? ' /' : '') + '>'));

			if (tagName === 'iframe') {
				if (node.srcdoc && node.src === 'about:srcdoc') {
					// TODO support doctype declaration
					const tagInnerNode = spanNode('tag-inner collapsed ');
					const tmp = el('html');

					tmp.innerHTML = node.srcdoc;

					for (const child of tmp.childNodes) {
						await parseHTML(child, tagInnerNode, indentLevel + 1).then(() => {}, (error) => {
							debugAlert('in parseHTML iframe.srcdoc .then error');
							throw error;
						});
					}

					append(tagNode, tagInnerNode);
				}
				else if (node.src) {
					await getIframeContent(node, tagNode, indentLevel).then(() => {}, (error) => {
						debugAlert('in parseHTML getIframeContent.then error');
						throw error;
					});
				}
			}
			else if (node.childNodes.length > 0) {
				const tagInnerNode = spanNode('tag-inner');

				if (isHidden || node.childNodes.length > 1) {
					// initialise to collapsed, dont make it collapse again unless done so by user
					tagInnerNode.className += ' collapsed ';
				}

				switch(tagName) {
					case 'style': {
						append(tagInnerNode, parseStyle(node.sheet, 0));
						break;
					}
					case 'script': {
						append(tagInnerNode, parseScript(node));
						break;
					}
					default: {
						for (const child of node.childNodes) {
							await parseHTML(child, tagInnerNode, indentLevel + 1).then(() => {}, (error) => {
								debugAlert('in parseHTML parseHTML.then error');
								throw error;
							});
						}
					}
				}

				append(tagNode, tagInnerNode);
			}

			if (!elementIsSelfClosing) {
				parseHTML_parseElementCloseTag(indentLevel, line, tagNode, tagName);
			}

			append(line, tagNode);
		}
		else if (isText) {
			append(line, createPlainTextNode(node));
		}
		else if (isComment) {
			parseHTML_addNewLineSpacing(line, indentLevel);

			append(line, spanNode('comment', '<!-- ' + node.textContent + '-->'));
		}
		else if (isDoctype) {
			parseHTML_addNewLineSpacing(line, indentLevel);

			append(line, spanNode('document-type', '<!DOCTYPE ' + node.nodeName + '>'));
		}
		else {
			debugAlert('unexpected node');

			console.log('isElement', isElement);
			window._node = node;
			console.error(node);
			throw new Error('parseHTML(node, parent, indentLevel) unexpected node');
		}

		append(parent, line);
	}

	function validateIndentLevel(indentLevel) {
		if (indentLevel === undefined || isNaN(indentLevel)) {
			// any of these + 1 gives NaN
			return true;
		}

		if (typeof indentLevel === 'number' && isFinite(indentLevel) && indentLevel >= 0) {
			return true;
		}

		throw new Error('validateIndentLevel(indentLevel) indentLevel must be a number >= 0, undefined or NaN');
	}

	function cssSymbol(symbol) {
		return spanNode('css-symbol', symbol);
	}

	function atRuleNameNode(name) {
		return spanNode('css-at-rule-name', name);
	}

	function cssSelectorText(selectorText) {
		// parsing selector text is very complex
		// so just leave it as it is for now
		// https://www.npmjs.com/package/css-selector-parser
		// https://github.com/mdevils/css-selector-parser/blob/master/src/parser.ts

		return spanNode('css-full-selector', selectorText);
	}

	function previewCSSColorNode(property, value) {
		if (!property.match(/(^|-)color$/)) {
			// properties with a color as a value are either 'color' or end with '-color'
			return;
		}

		if (property.match(/^-/)) {
			// could be a css varable which might not be a color value
			return;
		}

		if (value.match(/^(-|var\()/i)) {
			// cant easily preview variable colors
			return;
		}

		if (value.match(/^(currentcolor|inherit|initial|revert|revert-layer|unset)$/i)) {
			// cant easily preview global colors
			return;
		}

		// the outline adds contrast 
		// getComputedStyle(preview) gives empty string so use the very new css invert function
		// https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert

		const span = spanNode('css-color-preview-container');
		const preview = spanNode('css-color-preview');
		const previewInner = spanNode();

		preview.style.outlineColor = value;
		previewInner.style.backgroundColor = value;

		append(preview, previewInner);
		append(span, [createSpacer(' '), preview]);

		return span;
	}

	function parseStyle(cssStyleDeclaration, indentLevel) {
		validateIndentLevel(indentLevel);

		// https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model
		// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting#nested_declarations_rule
		// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule

		const style = spanNode('css');

		function addNewLineSpacing(parent, indentLevel, spacer) {
			if (!isFinite(indentLevel)) {
				return;
			}

			append(parent, [brNode(), createIndentSpacer(indentLevel), spacer ? spacer : createSpacer('  ')]);
		}

		function parseDeclaration(property, value, indentLevel, isLastDeclaration) {
			validateIndentLevel(indentLevel);

			const decNode = spanNode('css-declaration');
			const propNode = spanNode('css-declaration-property', property);
			const valNode = spanNode('css-declaration-value', value);
			const colorPreviewNode = previewCSSColorNode(property, value);

			addNewLineSpacing(decNode, indentLevel);

			append(decNode, [propNode, cssSymbol(': ')]);

			if (colorPreviewNode) {
				append(valNode, colorPreviewNode);
			}

			append(decNode, [valNode, cssSymbol(';')]);

			if (!isFinite(indentLevel) && !isLastDeclaration) {
				append(decNode, cssSymbol(' '));
			}

			return decNode;
		}

		function parseRuleCSSRules(rule, indentLevel) {
			if (!rule.cssRules.length) {
				return textNode('');
			}

			const ruleRulesNode = spanNode();

			for (const ruleRule of rule.cssRules) {
				parseRule(ruleRulesNode, ruleRule, indentLevel + 1);
			}

			return ruleRulesNode;
		}

		function parseRule(parentElement, rule, indentLevel) {
			validateIndentLevel(indentLevel);

			const ruleNode = spanNode();
			const braceLeadingNode = spanNode('css-brace-leading');
			const braceContentNode = spanNode('css-brace-content');
			const spacer = createSpacer('  ');

			function insertExpandCollapseBtn() {
				spacer.insertAdjacentElement('beforebegin', createExpandCollapseBtn(braceContentNode));
				spacer.innerHTML = ' ';
			}

			addNewLineSpacing(ruleNode, indentLevel, spacer);

			switch (rule.constructor.name) {
				case 'CSSStyleRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'style-rule';

					append(braceLeadingNode, cssSelectorText(rule.selectorText));
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, [parseRuleCSSRules(rule, indentLevel), parseStyle(rule.style, indentLevel)]);
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSImportRule': {
					ruleNode.className = 'import-rule';

					const url = spanNode();
					const layer = spanNode(0, rule.layerName === null ? '' : (' ' + (rule.layerName ? `layer(${rule.layerName})` : rule.layerName)));
					const supports = spanNode(0, rule.supportsText === null ? '' : ` supports(${rule.supportsText})`);

					append(url, [textNode('url("'), createLink(rule.styleSheet.href, rule.href), textNode('")')]);
					append(ruleNode, [atRuleNameNode('@import '), url, layer, supports, spanNode(0, rule.media.mediaText)]);

					break;
				}
				case 'CSSMediaRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'media-rule';

					append(braceLeadingNode, [atRuleNameNode('@media '), textNode(rule.conditionText)]);
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, parseRuleCSSRules(rule, indentLevel));
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSFontFaceRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'font-face-rule';

					append(braceLeadingNode, atRuleNameNode('@font-face'));
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, parseStyle(rule.style, indentLevel + 1));
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSPageRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'page-rule';

					append(braceLeadingNode, atRuleNameNode('@page'));

					if (rule.selectorText) {
						append(braceLeadingNode, [cssSymbol(' '), cssSelectorText(rule.selectorText)]);
					}

					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, [parseRuleCSSRules(rule, indentLevel), parseStyle(rule.style, indentLevel + 1)]);
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSNamespaceRule': {
					ruleNode.className = 'namespace-rule';

					append(ruleNode, atRuleNameNode('@namespace '));

					if (rule.prefix) {
						append(ruleNode, rule.prefix + ' ');
					}

					append(rule, [textNode('url("'), createLink(rule.namespaceURI, rule.namespaceURI), textNode('")')]);

					break;
				}
				case 'CSSKeyframesRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'keyframes-rule';

					append(braceLeadingNode, [atRuleNameNode('@keyframes '), textNode(rule.name)]);
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, parseRuleCSSRules(rule, indentLevel + 1));
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSKeyframeRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'keyframe-rule';

					append(braceLeadingNode, textNode(rule.keyText));
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, parseStyle(rule.style, indentLevel + 1));
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSCounterStyleRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'counter-style-rule';

					append(braceLeadingNode, [atRuleNameNode('@counter-style '), textNode(rule.name)]);
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					[
						['system', rule.system],
						['symbols', rule.symbols],
						['additiveSymbols', rule.additiveSymbols],
						['negative', rule.negative],
						['prefix', rule.prefix],
						['suffix', rule.suffix],
						['range', rule.range],
						['pad', rule.pad],
						['speak-as', rule.speakAs],
						['fallback', rule.fallback]
					].forEach((declaration) => {
						if (declaration[1]) {
							append(braceContentNode, parseDeclaration(declaration[0], declaration[1], indentLevel + 1));
						}
					});
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSSupportsRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'supports-rule';

					append(braceLeadingNode, [atRuleNameNode('@supports '), textNode(rule.conditionText)]);
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, parseRuleCSSRules(rule, indentLevel + 1));
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSFontFeatureValuesRule': {
					ruleNode.className = 'font-feature-values-rule';

					// TODO test this in a browser that supports CSSFontFeatureValuesRule
					// not supported in librewolf 133.0-1 on linux

					// https://developer.mozilla.org/en-US/docs/Web/API/CSSFontFeatureValuesRule
					// https://developer.mozilla.org/en-US/docs/Web/CSS/@font-feature-values
					// https://developer.mozilla.org/en-US/docs/Web/CSS/@font-feature-values/font-display

					console.warn(rule);
					console.warn('unclear how to parse CSSFontFeatureValuesRule, using unformatted');

					append(ruleNode, textNode(rule.cssText));

					// ruleNode.appendChild(textNode('@font-feature-values '));
					// ruleNode.appendChild(rule.fontFamily);
					// ruleNode.appendChild(cssSymbol(' {'));

					// who knows

					// ruleNode.appendChild(cssSymbol('}'));

					break;
				}
				case 'CSSFontPaletteValuesRule': {
					ruleNode.className = 'font-palette-values-rule';

					// TODO test this in a browser that supports CSSFontPaletteValuesRule
					// not supported in librewolf 133.0-1 on linux

					console.warn(rule);
					console.warn('unclear how to parse CSSFontFeatureValuesRule, using unformatted');

					append(ruleNode, textNode(rule.cssText));

					// ruleNode.appendChild(textNode('@font-palette-values '));
					// ruleNode.appendChild(rule.name);
					// ruleNode.appendChild(cssSymbol(' {'));

					// ruleNode.appendChild(parseDeclaration('font-family', rule.fontFamily, indentLevel + 1));
					// ruleNode.appendChild(parseDeclaration('base-palette', rule.basePalette, indentLevel + 1));

					// no idea how this will behave
					// https://developer.mozilla.org/en-US/docs/Web/API/CSSFontPaletteValuesRule
					// https://developer.mozilla.org/en-US/docs/Web/API/CSSFontPaletteValuesRule/overrideColors
					// may need special treatment for formatting
					// ruleNode.appendChild(parseDeclaration('override-colors', rule.overrideColors, indentLevel + 1, true))

					// ruleNode.appendChild(cssSymbol('}'));

					break;
				}
				case 'CSSLayerBlockRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'layer-block-rule';

					append(braceLeadingNode, [atRuleNameNode('@layer '), textNode(rule.name)]);
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, parseRuleCSSRules(rule, indentLevel + 1));
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				case 'CSSLayerBlockRule': {
					ruleNode.className = 'layer-block-rule';

					append(ruleNode, atRuleNameNode('@layer '));

					rule.nameList.forEach((name, i) => {
						append(ruleNode, textNode(name));

						if (i + 1 < this.length) {
							append(ruleNode, cssSymbol(', '));
						}
					});

					append(ruleNode, cssSymbol(';'));

					break;
				}
				case 'CSSPropertyRule': {
					insertExpandCollapseBtn();

					ruleNode.className = 'property-rule';

					append(braceLeadingNode, [atRuleNameNode('@property '), textNode(rule.name)]);
					append(ruleNode, [braceLeadingNode, cssSymbol(' {')]);
					append(braceContentNode, [parseDeclaration('syntax', rule.syntax, indentLevel + 1), parseDeclaration('inherits', '' + rule.inherits, indentLevel + 1), parseDeclaration('initial-value', rule.initialValue, indentLevel + 1, true)]);
					addNewLineSpacing(braceContentNode, indentLevel);
					append(ruleNode, [braceContentNode, cssSymbol('}')]);

					break;
				}
				default: {
					ruleNode.className = 'unexpected-rule';

					// should not need to explicitly handle CSSGroupingRule because other rule types inherit from it
					// should not need to explicitly handle CSSNestedDeclarations because other rules pass a cssStyleDeclaration

					console.warn(rule);
					console.warn('unexpected css rule type, using unformatted');

					append(ruleNode, textNode(rule.cssText));

					break;
				}
			}

			parentElement.appendChild(ruleNode);
		}

		if (cssStyleDeclaration instanceof CSSStyleSheet) {
			const ruleRulesNode = spanNode();

			for (const rule of cssStyleDeclaration.cssRules) {
				parseRule(ruleRulesNode, rule, indentLevel);
			}

			append(style, ruleRulesNode);
		}
		else {
			// previously use a for of before to filter out all style declarations
			// need to know if there is a next declaration for formatting purposes
			// element.style has numbered indexes for styles actually declared on the element

			for (let i = 0; ; ) {
				const prop = cssStyleDeclaration[i];

				if (!prop) {
					break;
				}

				i++;

				const hasNext = !!cssStyleDeclaration[i];

				append(style, parseDeclaration(prop, cssStyleDeclaration.getPropertyValue(prop), indentLevel + 1, !hasNext));
			}
		}

		return style;
	}

	function parseScript(node) {
		// TODO formatting, highlighting

		return spanNode('script', node.textContent.trim());
	}

	function hideCollapsed() {
		let a = '.collapsed';
		let b = a;

		['br', '.spacer', '.spacer'].forEach((c) => {
			b += ' + ' + c;
			a += ', ' + b;
		});

		return a + ' {\n\tdisplay: none;\n}';
	}

	function color(selector, color) {
		return `${selector} {\n\tcolor: ${color};\n}`;
	}

	function getStyle() {
		return `body {
	margin: 1em;
	padding: 0;
	display: block;
	font-family: monospace;
	font-size: 1em;
	line-height: 1.2em;
	tab-size: 2;
	color: #cbcbc7;
	background: #232327;
	word-break: break-word;
}

.spacer {
	margin: 0;
	padding: 0;
	border: 0;
	outline: 0;
	display: inline-block;
}

${hideCollapsed()}

.expand-collapse-button {
	margin: 0;
	padding: 0;
	border: 0;
	width: fit-content;
	cursor: pointer;
	background: inherit;
	color: #88888a;
}

.expand-collapse-button:has(+ .spacer + .tag > .collapsed), .expand-collapse-button:has(+ .spacer + .css-brace-leading + .css-symbol + .css-brace-content.collapsed) {
	rotate: 270deg;
}

${color('.userscript-error', '#ff0000')}

.document-type {
	font-style: italic;
}

${color('.html-symbol', '#7c7c7e')}

${color('.document-type', '#72baf9')}

${color('.comment', '#90EE90')}

${color('.tag-name', '#72baf9')}

${color('.tag-attribute-name', '#fb7be5')}

${color('.tag-attribute-value', '#9b79d4')}

.tag-attribute-value a {
	color: inherit;
	text-decoration: underline;
}

${color('.tag.hidden-tag .html-symbol', '#6e6e6e')}

${color('.tag.hidden-tag .tag-name', '#929294')}

${color('.tag.hidden-tag .tag-attribute-name', '#676768')}

${color('.tag.hidden-tag .tag-attribute-value', '#939394')}

${color('.css-symbol', '#7c7c7e')}

${color('.css-at-rule-name', '#72baf9')}

${color('.css-declaration-property', '#80d36f')}

${color('.css-declaration-value', '#fb7be5')}

.css-color-preview {
	display: inline-block;
	width: 1em;
	height: 1em;
	outline-width: 2px;
	outline-style: solid;
	filter: invert(100%);
}`;
	}

	async function main(outputWindow) {
		const meta1 = el('meta');
		const meta2 = el('meta');
		const title = el('title');
		const style = el('style');
		const expand = el('div');
		const expandBtn = el('input');
		const output = el('div');

		meta1.setAttribute('charset', 'utf-8');

		meta2.setAttribute('name', 'viewport');
		meta2.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1');

		title.innerHTML = 'Web Inspector - ' + document.title;

		style.innerHTML = getStyle();

		for (const node of document.childNodes) {
			await parseHTML(node, output, 0).then(() => {}, (error) => {
				debugAlert('in main parseHTML.then error');
				throw error;
			});
		}

		if (output.firstElementChild.tagName === 'BR') {
			// remove unnecessary spacing at top
			output.firstElementChild.remove();
		}

		setupExpandCollapseBtns(output);

		expandBtn.type = 'button';
		expandBtn.value = 'Expand all visible elements';
		expandBtn.onclick = () => {
			const btns = output.querySelectorAll('button.expand-collapse-button');

			for (const btn of btns) {
				if (btn.parentNode.className.match(/^html-line\b/)) {
					const element = btn.parentNode.querySelector('.tag-inner');

					if (element.className.match(/ collapsed /) && !element.parentNode.className.split(' ').includes('hidden-tag')) {
						btn.click();
					}
				}
			}
		};
		append(expand, expandBtn);

		outputWindow.document.write('<!DOCTYPE html><html><head></head><body></body></html>');

		append(outputWindow.document.head, meta1);
		append(outputWindow.document.head, meta2);
		append(outputWindow.document.head, title);
		append(outputWindow.document.head, style);
		append(outputWindow.document.body, [expand, output]);
	}

	async function receiveParseHTMLMessage(event) {
		try {
			// unable to access iframe content, so wait for a message from the top window
			// then pass the output element

			if (event.source !== top) {
				// this check should reduce security issues
				return;
			}

			if (!(event.data && event.data.WEB_INSPECTOR && event.data.WEB_INSPECTOR.parseHTML)) {
				// make sure the instruction exists
				return;
			}

			const indentLevel = parseInt(event.data.WEB_INSPECTOR.parseHTML);

			if (!(isFinite(indentLevel) && indentLevel > 0)) {
				return;
			}

			window.removeEventListener('message', receiveParseHTMLMessage);

			const output = spanNode();

			for (const node of document.childNodes) {
				await parseHTML(node, output, indentLevel).then(() => {}, (error) => {
					debugAlert('in receiveParseHTMLMessage parseHTML error');
					throw error;
				});
			}

			event.source.postMessage({WEB_INSPECTOR: {parseHTMLOutput: output.outerHTML}}, event.origin);
		}
		catch(err) {
			throw err;
		}
	}

	function isDefined(variable) {
		return typeof variable !== 'undefined';
	}

	function extractErrorInfo(error) {
		let str = error.name + ': ' + error.message;

		if (isDefined(error.fileName) && isDefined(error.lineNumber) && isDefined(error.columnNumber)) {
			str += ' in ' + error.fileName + ' ' + error.lineNumber + ':' + error.columnNumber;
		}

		if (isDefined(error.stack)) {
			str += '\n' + error.stack;
		}

		return str;
	}

	function errorDetected(error) {
		return prompt('Error while using Web Inspector:', extractErrorInfo(error));
	}

	if (self !== top) {
		window.addEventListener('message', receiveParseHTMLMessage);

		return;
	}

	window.WEB_INSPECTOR = function() {
		// try to open in a new window
		// if popups are blocked, replace the current webpage with the web inspector

		const outputWindow = open('about:blank') || window;

		main(outputWindow).then(() => {}, (error) => {
			debugAlert('in window.WEB_INSPECTOR main error');
			errorDetected(error);
		});

		outputWindow.onload = function() {
			main(outputWindow).then(() => {}, (error) => {
				debugAlert('in window.WEB_INSPECTOR outputWindow main error');
				errorDetected(error);
			});
		};
	};
})();