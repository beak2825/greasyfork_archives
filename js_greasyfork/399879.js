// ==UserScript==
// @name         弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0.0.2
// @match        http://*/*
// @description  在当前页面展示一个弹窗
// @author       YiJie
// ==/UserScript==

(function() {
	'use strict';
	const $ = {};
    function cssToObj(css) {
        var regex = /([\w-]*)\s*:\s*([^;]*)/g;
        var match, properties={};
        while(match=regex.exec(css)) properties[match[1]] = match[2].trim();
        return properties;
    }
	$.css = function(nodes, propertyName, propertyValue) {
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if (typeof(propertyValue) === "undefined") {
				if(typeof(propertyName) === "String")
					return node.style.getPropertyValue(propertyName);
				else{
					const dictX = propertyName;
					for (let index0 in dictX) {
						node.style.setProperty(index0, dictX[index0]);
					}
				}
			} else {
				node.style.setProperty(propertyName, propertyValue);
			}
		}
	}
	$.create = function(htmlStr) {
		let tempNode = document.createElement('div');
		htmlStr = htmlStr.replace(/\t/g, "").replace(/\r/g, "").replace(/\n/g, "");
		tempNode.innerHTML = htmlStr;
		return tempNode.firstChild;
	}
	class Show {
		constructor() {

		}
		generateWrapperMask(maskColor) {
			const mask = $.create('<div pw-class="WrapperMask"></div>');
			$.css([mask],cssToObj("\
			z-index:1000;\
			position:fixed;\
			top: 0;left: 0;\
			width: 100%;height: 100%;\
			background-color: rgba(255,255,255,0);\
			transition: 1s;\
			"));
			setTimeout(function() {
				$.css([mask],cssToObj("background-color: "+maskColor+";"));
			}, 100);
			document.body.appendChild(mask);
			return mask;
		}
		prompt(message, callback) {}
		alert(message, callback) {}
		message(message, callback) {}
		Content(message, callback) {}
		initHtmlFrame(options){
			const defaultOptions = {
				"maskColor": "rgba(0,0,0,.2)",
				"width": 800,
				"height": 600,
				"backgroundColor": "rgb(250,250,250)",
			};
			this.HtmlFrameOptions = Object.assign(
				defaultOptions,
				options,
				{},
			);
			return this.HtmlFrameOptions;
		}
		HtmlFrame(htmlNode, options, callback) {
			options = this.initHtmlFrame(options);
			const mask = this.generateWrapperMask(options.maskColor);
			const HtmlFrameContent = $.create('\
			<div pw-class="HtmlFrameContent">\
				<svg id="HtmlFrameContent-delete" width="48" height="48" t="1586302120721" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2132">\
					<path p-id="2133" fill="#ff5500" d="M572.16 512l183.466667-183.04a42.666667 42.666667 0 1 0-60.586667-60.586667L512 451.84l-183.04-183.466667a42.666667 42.666667 0 0 0-60.586667 60.586667l183.466667 183.04-183.466667 183.04a42.666667 42.666667 0 0 0 0 60.586667 42.666667 42.666667 0 0 0 60.586667 0l183.04-183.466667 183.04 183.466667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z">\
					</path>\
				</svg>\
			</div>');
			$.css([HtmlFrameContent],cssToObj("\
				position: absolute;\
				top: -2000px;left: calc(50% - "+options.width/2+"px);\
				width: "+options.width+"px;height: "+options.height+"px;\
				border-radius: 20px;\
				box-shadow: 0 0 24px gray;\
				background-color: "+options.backgroundColor+";\
				transition: 1s;\
			"));
			$.css([HtmlFrameContent.querySelector('#HtmlFrameContent-delete')],cssToObj("\
				z-index: 1000;\
				position: absolute;\
				top: 0;right: 0;\
			"));
			setTimeout(function() {
				$.css([HtmlFrameContent],cssToObj("top: calc(50% - "+options.height/2+"px);"));
			}, 100);
			HtmlFrameContent.querySelector('#HtmlFrameContent-delete').onclick = function(){
				if(typeof(callback)==="function") callback();
				$.css([HtmlFrameContent],cssToObj("top: -2000px;"));
				$.css([mask],cssToObj("background-color: rgba(255, 255, 255, 0);"));
				setTimeout(function() {
					mask.remove();
				}, 1000);
			};
			if(htmlNode) HtmlFrameContent.appendChild(htmlNode);
			mask.appendChild(HtmlFrameContent);
		}
	}
	class PopupWindow {
		constructor() {
			this.__Init();
		}
		Init(options) {
			this.__Init(options);
		}
		__Init(options) {
			const defaultOptions = {

			};
			this.options = options || defaultOptions;
			this.Show = new Show();
		}
	}
	window.PopupWindow = new PopupWindow();
})();
