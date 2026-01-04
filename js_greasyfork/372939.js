// ==UserScript==
// @name         Copy Tool
// @namespace    https://greasyfork.org
// @version      0.1
// @description  TODO
// @author       pot-code
// @include      *://www.mfcclub.com/app/sharev2/sell.do?task=doForm
// @include      *://www.mfcclub.com/app/sharev2/buy.do?task=doHome
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372939/Copy%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/372939/Copy%20Tool.meta.js
// ==/UserScript==

(function() {
	function getStyleValue(styleName, element) {
		if (!(styleName in element.style)) throw new ReferenceError(`style name '${styleName}' not exists`);

		var inlineValue = element.style[styleName];
		return inlineValue && inlineValue || getComputedStyle(element)[styleName];
	}

	function debounce(fn, delay) {
		var id = null;
		return function (args) {
			clearTimeout(id);
			id = setTimeout(fn, delay, args);
		}
	}

	// function offset_to_body(type, element) {
	// 	if (!(type in element)) throw new ReferenceError(`offset type '${type}' not exists`);
	// 	var offset = 0;
	// 	while (element !== document.body) {
	// 		offset += element[type];
	// 		element = element.offsetParent;
	// 	}
	// 	return offset;
	// }

	function offset_to_positioned_ancestor(type, element){
		if (!(type in element)) throw new ReferenceError(`offset type '${type}' not exists`);
		var offset = 0;
		while (getStyleValue('position', element) === 'static') {
			offset += element[type];
			element = element.offsetParent;
		}
		return offset;
	}

	function CopyComponent() {
		if(!(this instanceof CopyComponent)) return new CopyComponent();
		// initialize elements
		var rootElement=document.createElement('div');
		var contentElement=document.createElement('div');
		var copyTextElement = document.createElement('span');
		var inputElement = document.createElement('input');

		// set style
		rootElement.style.cssText = 'position: absolute; padding-top:5px;';
		contentElement.style.cssText = 'padding: 5px 8px; border: 1px solid gray; border-radius: 4px; cursor: pointer; user-select: none; background-color:white; display: none; background-color: rgb(220, 221, 222);'
		copyTextElement.style.cssText = 'margin-right: 5px';
		copyTextElement.innerHTML = '复制';
		inputElement.type = 'text';

		// establish logical relationship
		copyTextElement.addEventListener("click", function (e) {
			inputElement.select();
			document.execCommand("copy");

			copyTextElement.innerHTML = '已复制!';
			setTimeout(function () {
				copyTextElement.innerHTML = '复制';
			}, 1000);
		});

		// link element
		contentElement.appendChild(copyTextElement);
		contentElement.appendChild(inputElement);
		rootElement.appendChild(contentElement);

		this._rootElement = rootElement;
		this._cellArray = [];
		this._cellContainer = null;
		this._dataSelector = e => e;
		this._inputElement = inputElement;
		this._contentElement = contentElement;
		// avoid being detected by hidding logic
		this._whiteList = [rootElement, contentElement, inputElement, copyTextElement];
	}

	CopyComponent.prototype.set_container_element=function(element){
		this._cellContainer = element;
		return this;
	}

	CopyComponent.prototype.set_data_selector = function (fn) {
		this._dataSelector = fn;
		return this;
	}

	CopyComponent.prototype.add_cell_element = function (element) {
		if (this._cellArray.indexOf(element) === -1) this._cellArray.push(element);
		return this;
	}

	CopyComponent.prototype.inject_component = function(){
		var self = this;

		if (!self._cellContainer) throw new Error('Lacking of cell container');
		document.body.addEventListener("mouseover", debounce(function (e) {
			var target = e.target;
			if (self._cellArray.some(function (cell) {
				return cell === target;
			})) {
				// 显示组件
				self._contentElement.style.display = 'inline-block';
				// 将组件正确定位，放置在要复制元素正下方
				self._rootElement.style.top = `${offset_to_positioned_ancestor('offsetTop', target) + target.offsetHeight}px`;
				self._rootElement.style.left = `${offset_to_positioned_ancestor('offsetLeft', target)}px`;
				// 被复制元素内容填充到输入框
				self._inputElement.value = self._dataSelector(target);
			} else if (!self._whiteList.some(function (e) {// hidding logic
				return e === target;
			})) {
				self._contentElement.style.display = 'none';
			}
		}, 300));
		self._cellContainer.appendChild(self._rootElement);
	}

	// main entry
	var cellContainer = document.querySelector('table.styled.footable.no-paging.footable-loaded');
	var floatPointElement = document.querySelector('tbody .footable-visible.footable-first-column');
	var copyComponent = new CopyComponent();

	copyComponent
		.set_container_element(cellContainer)
		.set_data_selector(e => e.innerHTML.match(/[0-9,]+/)[0])
		.add_cell_element(floatPointElement)
		.add_cell_element(floatPointElement.nextElementSibling)
		.add_cell_element(floatPointElement.nextElementSibling.nextElementSibling)
		.inject_component();
})();