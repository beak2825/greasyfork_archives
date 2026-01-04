// ==UserScript==
// @name         App Inventer 2 block helper
// @version      0.7.8
// @namespace    App Inventer 2 block helper
// @description  An easy way to operate blocks at MIT App Inventor 2.
// @author       wangsk789@163.com
// @match        https://*.appinventor.mit.edu/*
// @match        http://localhost/*
// @match        http://192.168.*.*/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/463114/App%20Inventer%202%20block%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463114/App%20Inventer%202%20block%20helper.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    setTimeout(() => {
		var lastBlock;
		var types=["component_event","global_declaration","procedures_defreturn","procedures_defnoreturn"];

		function genHelperPalette(){

			var box = document.createElement('div');
			document.querySelector(".ode-WorkColumns").appendChild(box);

			box.outerHTML='<div class="ode-Box" aria-hidden="true" style="width: 220px; display: none;" id="helperPalette"><div class="ode-Box-content" ><table cellspacing="0" cellpadding="0" class="ode-Box-header" style="width: 100%;"><tbody><tr><td align="left" width="" height="" rowspan="1" style="vertical-align: top;"><div style="width: 100%;"><div class="ode-Box-header-caption" style="white-space: nowrap;">AI2HELPER </div></div></td></tr></tbody></table><div style="margin:3px"><input type="text" id="keyword" ></div><div tabindex="0" class="ode-TextButton" id="searchkeyword" style="margin:3px">search keyword</div><div tabindex="0" class="ode-TextButton" id="removeallcomments" style="margin:3px">remove all comments</div><div tabindex="0" class="ode-TextButton" id="downloadPNGIgnoreOrphan"  style="margin:3px">download all as png</div><div tabindex="0" class="ode-TextButton" id="updateoutline"  style="margin:3px">update outline</div><div   id="helperOutline"></div></div></div>';
		}

        var isHelperOpen = false;
		function switchHelper(){
			var helper = document.querySelector("#helperPalette");
			if(helper.style.display == "none"){
				helper.style.display = "block"
				updateoutline();
                isHelperOpen = true;
			}else{
				helper.style.display = "none"
                 isHelperOpen = false;
			}
		}


		function updateoutline(){

			let blocks = Blockly.getMainWorkspace().getTopBlocks().filter((block) => types.indexOf(block.type)>-1);
			blocks.sort((a,b) => a.toString().localeCompare(b.toString()));

			var helperOutline = document.querySelector("#helperOutline");
			helperOutline.innerHTML="";
			blocks.forEach((block) =>{
					let div = document.createElement('DIV');
					helperOutline.appendChild(div);
					//div.outerHTML='<div class="gwt-TreeItem" style="white-space: nowrap; padding:3px; overflow:hidden;" id="id'+block.id+'" onclick="btnonclick(this);">'+ simpleString(block)+'</div>';
					//div.className = "gwt-TreeItem";
					div.style = "white-space: nowrap; padding:3px; overflow:hidden;";
					div.id = "id"+block.id;
					div.addEventListener("click",() => {
						btnonclick(div);
					})
					div.innerHTML =  simpleString(block);

				})
		}


		function btnonclick(obj){
            if(lastBlock) {lastBlock.setHighlighted(false);}
            var block =Blockly.getMainWorkspace().getBlockById(obj.id.substr(2));
            if(block == lastBlock){
                lastBlock = null;
            }else{
                Blockly.getMainWorkspace().centerOnBlock(block.id);
                block.select();
                block.setHighlighted(true);
                lastBlock = block;
            }
		}


		function simpleString(block) {
				var text = '';
				for (var i = 0, input;
					 (input = block.inputList[i]); i++) {
					if (input.name == Blockly.BlockSvg.COLLAPSED_INPUT_NAME) {
						continue;
					}
					for (var j = 0, field;
						 (field = input.fieldRow[j]); j++) {
						text += field.getText() + ' ';
					}
				}
				text = goog.string.trim(text) || '???';
				return text;
			}

		function removeallcomments(){
			if(confirm("Are you sure to remove all comments?")){
				Blockly.getMainWorkspace().getAllBlocks().forEach(b=>{b.setCommentText(null)});
			}

		}

		function searchkeyword(){
			var input = document.querySelector("#keyword");
			if(input.value){
				findBlock(input.value);
			}
		}

		var lastIndex = -1;

		function findBlock(keyword){
			var blocks = Blockly.getMainWorkspace().getAllBlocks().filter(block=>simpleString(block).toLowerCase().includes(keyword.toLowerCase()));
			if(lastIndex > -1){
				blocks[lastIndex].setHighlighted(false);
			}
			lastIndex++;
			if(lastIndex<blocks.length){
				expand(blocks[lastIndex]);
				Blockly.getMainWorkspace().cleanUp()
				Blockly.getMainWorkspace().centerOnBlock(blocks[lastIndex].id);
				blocks[lastIndex].select();
				blocks[lastIndex].setHighlighted(true);
			}else{
				lastIndex = -1;
			}
		}

		function expand(block){
			block.setCollapsed(false);
			let parent = block.getParent();
			if(parent){
				expand(parent);
			}
		}

		function downloadPNGIgnoreOrphan(){
			var topblocks=Blockly.getMainWorkspace().getTopBlocks();
			var blocks=topblocks.filter((block)=>{
				return types.indexOf(block.type)>=0
			});
			if(confirm("Are you sure to download all " + blocks.length + " blocks?")){

				var i=0;
				var timer=setTimeout(function(){
					if(i<blocks.length){
						exportBlockAsPng(blocks[i]);
						i++;
						timer=setTimeout(arguments.callee,1000)
					}
				},1000);
			}
		}

		function genHelperButton(){
			let btnHelper = document.createElement('div');
            let allRight = document.querySelectorAll(".right");
			var container = allRight[allRight.length-1];

			container.appendChild(btnHelper);
			btnHelper.outerHTML='<div tabindex="0" class="ode-TextButton" id="helperButton">AI2HELPER</div>';


		}



		genHelperButton();
		genHelperPalette();
		document.querySelector("#removeallcomments").addEventListener("click",() => {
			removeallcomments();
		})
		document.querySelector("#helperButton").addEventListener("click",() => {
			switchHelper();
		})


		document.querySelector("#searchkeyword").addEventListener("click",() => {
			searchkeyword();
		})
		document.querySelector("#downloadPNGIgnoreOrphan").addEventListener("click",() => {
			downloadPNGIgnoreOrphan();
		})
		document.querySelector("#updateoutline").addEventListener("click",() => {
			updateoutline();
		})


        //set designer panel scroll seperately
        //document.querySelector(".ode-ProjectListView").childNodes[1].style.overflow = "auto";
        //document.querySelector(".ode-ProjectListView").childNodes[1].style.height="100%";
        //document.querySelector(".ode-TutorialWrapper").style.overflowY="hidden";
        //document.querySelector(".ode-WorkColumns").childNodes.forEach(node => {node.style.height = "calc(100% - 38px)"; node.style.overflow = "auto"});

		///////////////////////////////////////////////////////////////
		///////below codes from MIT App Inventer source code///////////
		///////////////////////////////////////////////////////////////

		var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

			function isExternal(url) {
				return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1
			}

			function styles(el, selectorRemap) {
				var css = "";
				var sheets = document.styleSheets;
				for (var i = 0; i < sheets.length; i++) {
					if (isExternal(sheets[i].href)) {
						console.warn("Cannot include styles from other hosts: " + sheets[i].href);
						continue
					}
					var rules = null;
					try {
						rules = sheets[i].cssRules
					} catch (e) {
						console.warn('Skipping a potentially injected stylesheet', e);
						continue
					}
					if (rules != null) {
						for (var j = 0; j < rules.length; j++) {
							var rule = rules[j];
							if (typeof(rule.style) != "undefined") {
								var match = null;
								try {
									match = el.querySelector(rule.selectorText)
								} catch (err) {
									console.warn('Invalid CSS selector "' + rule.selectorText + '"', err)
								}
								if (match && rule.selectorText.indexOf("blocklySelected") == -1) {
									var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
									css += selector + " { " + rule.style.cssText + " }"
								} else if (rule.cssText.match(/^@font-face/)) {
									css += rule.cssText + ''
								}
							}
						}
					}
				}
				return css
			}
			function svgAsDataUri(el, optmetrics, options, cb) {
				options = options || {};
				options.scale = options.scale || 1;
				var xmlns = "http://www.w3.org/2000/xmlns/";
				var outer = document.createElement("div");
				var textAreas = document.getElementsByTagName("textarea");
				for (var i = 0; i < textAreas.length; i++) {
					textAreas[i].innerHTML = textAreas[i].value
				}
				var clone = el.cloneNode(true);
				var width, height;
				if (el.tagName == 'svg') {
					var box = el.getBoundingClientRect();
					width = box.width || parseInt(clone.getAttribute('width') || clone.style.width || window.getComputedStyle(el).getPropertyValue('width'));
					height = box.height || parseInt(clone.getAttribute('height') || clone.style.height || window.getComputedStyle(el).getPropertyValue('height'));
					var left = (parseFloat(optmetrics.contentLeft) - parseFloat(optmetrics.viewLeft)).toString();
					var top = (parseFloat(optmetrics.contentTop) - parseFloat(optmetrics.viewTop)).toString();
					var right = (parseFloat(optmetrics.contentWidth)).toString();
					var bottom = (parseFloat(optmetrics.contentHeight)).toString();
					clone.setAttribute("viewBox", left + " " + top + " " + right + " " + bottom)
				} else {
					var matrix = el.getScreenCTM();
					//clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, '').replace(/scale\(.*?\)/, '').trim());
					clone.setAttribute('transform', "");
					var box = el.getBBox();
					width = box.width;
					height = box.height;
					var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					svg.appendChild(clone);
					clone = svg;
					clone.setAttribute('viewBox', box.x + " " + box.y + " " + width + " " + height)
				}
				clone.setAttribute("version", "1.1");
				clone.setAttribute("width", width);
				clone.setAttribute("height", height);
				clone.setAttribute("style", 'background-color: rgba(255, 255, 255, 0);');
				outer.appendChild(clone);
				var css = styles(el, options.selectorRemap);
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.innerHTML = "<![CDATA[" + css + "]]>";
				var defs = document.createElement('defs');
				defs.appendChild(s);
				clone.insertBefore(defs, clone.firstChild);
				var toHide = clone.getElementsByClassName("blocklyScrollbarHandle");
				for (var i = 0; i < toHide.length; i++) {
					toHide[i].setAttribute("visibility", "hidden")
				}
				toHide = clone.getElementsByClassName("blocklyScrollbarBackground");
				for (var i = 0; i < toHide.length; i++) {
					toHide[i].setAttribute("visibility", "hidden")
				}
				toHide = clone.querySelectorAll('image');
				for (var i = 0; i < toHide.length; i++) {
					toHide[i].setAttribute("visibility", "hidden")
				}
				toHide = clone.querySelectorAll('.blocklyMainBackground');
				for (var i = 0; i < toHide.length; i++) {
					toHide[i].parentElement.removeChild(toHide[i])
				}
				var zelement = clone.getElementById("rectCorner");
				if (zelement) {
					zelement.setAttribute("visibility", "hidden")
				}
				zelement = clone.getElementById("indicatorWarning");
				if (zelement) {
					zelement.setAttribute("visibility", "hidden")
				}
				var svg = doctype + outer.innerHTML;
				svg = svg.replace(/&nbsp/g, '&#160');
				svg = svg.replace(/sans-serif/g, 'Arial, Verdana, "Nimbus Sans L", Helvetica');
				var uri = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg)));
				if (cb) {
					cb(uri)
				}
			}

			function makeCRCTable() {
				var c;
				var crcTable = [];
				for (var n = 0; n < 256; n++) {
					c = n;
					for (var k = 0; k < 8; k++) {
						c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
					}
					crcTable[n] = c
				}
				return crcTable
			}

			function crc32(data) {
				var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
				var crc = 0 ^ (-1);
				for (var i = 0; i < data.length; i++) {
					crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF]
				}
				return (crc ^ (-1)) >>> 0
			}
			var CODE_PNG_CHUNK = 'coDe';

			function PNG() {
				this.chunks = null
			}
			PNG.HEADER = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
			var pHY_data = [0x00, 0x00, 0x16, 0x25, 0x00, 0x00, 0x16, 0x25, 0x01];
			PNG.Chunk = function(length, type, data, crc) {
				this.length = length;
				this.type = type;
				this.data = data;
				this.crc = crc
			};
			PNG.prototype.readFromBlob = function(blob, callback) {
				var reader = new FileReader();
				var png = this;
				reader.addEventListener('loadend', function() {
					png.processData_(new Uint8Array(reader.result));
					if (callback instanceof Function) callback(png)
				});
				reader.readAsArrayBuffer(blob)
			};
			PNG.prototype.getCodeChunk = function() {
				if (!this.chunks) return null;
				for (var i = 0; i < this.chunks.length; i++) {
					if (this.chunks[i].type === CODE_PNG_CHUNK) {
						return this.chunks[i]
					}
				}
				return null
			};
			PNG.prototype.processData_ = function(data) {
				var chunkStart = PNG.HEADER.length;

				function decode4() {
					var num;
					num = data[chunkStart++];
					num = num * 256 + data[chunkStart++];
					num = num * 256 + data[chunkStart++];
					num = num * 256 + data[chunkStart++];
					return num
				}

				function read4() {
					var str = '';
					for (var i = 0; i < 4; i++, chunkStart++) {
						str += String.fromCharCode(data[chunkStart])
					}
					return str
				}

				function readData(length) {
					return data.slice(chunkStart, chunkStart + length)
				}
				this.chunks = [];
				while (chunkStart < data.length) {
					var length = decode4();
					var type = read4();
					var chunkData = readData(length);
					chunkStart += length;
					var crc = decode4();
					this.chunks.push(new PNG.Chunk(length, type, chunkData, crc))
				}
			};
			PNG.prototype.setCodeChunk = function(code) {
				var text = new TextEncoder().encode(CODE_PNG_CHUNK + code);
				var length = text.length - 4;
				var crc = crc32(text);
				text = text.slice(4);
				for (var i = 0, chunk;
					 (chunk = this.chunks[i]); i++) {
					if (chunk.type === CODE_PNG_CHUNK) {
						chunk.length = length;
						chunk.data = text;
						chunk.crc = crc;
						return
					}
				}
				chunk = new PNG.Chunk(length, CODE_PNG_CHUNK, text, crc);
				this.chunks.splice(this.chunks.length - 1, 0, chunk)
			};
			PNG.prototype.toBlob = function() {
				var length = PNG.HEADER.length;
				this.chunks.forEach(function(chunk) {
					length += chunk.length + 12
				});
				var buffer = new Uint8Array(length);
				var index = 0;

				function write4(value) {
					if (typeof value === 'string') {
						var text = new TextEncoder().encode(value);
						buffer.set(text, index);
						index += text.length
					} else {
						buffer[index + 3] = value & 0xFF;
						value >>= 8;
						buffer[index + 2] = value & 0xFF;
						value >>= 8;
						buffer[index + 1] = value & 0xFF;
						value >>= 8;
						buffer[index] = value & 0xFF;
						index += 4
					}
				}

				function writeData(data) {
					buffer.set(data, index);
					index += data.length
				}
				writeData(PNG.HEADER);
				this.chunks.forEach(function(chunk) {
					write4(chunk.length);
					write4(chunk.type);
					writeData(chunk.data);
					write4(chunk.crc)
				});
				return new Blob([buffer], {
					'type': 'image/png'
				})
			};
			function exportBlockAsPng(block) {
				var xml = document.createElement('xml');
				xml.appendChild(Blockly.Xml.blockToDom(block, true));
				var code = Blockly.Xml.domToText(xml);
				svgAsDataUri(block.svgGroup_, block.workspace.getMetrics(), null, function(uri) {
					var img = new Image();
					img.src = uri;
					img.onload = function() {
						var canvas = document.createElement('canvas');
						canvas.width = 2 * img.width;
						canvas.height = 2 * img.height;
						var context = canvas.getContext('2d');
						context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

						function download(png) {
							png.setCodeChunk(code);
							for (var i = 0; i < png.chunks.length; i++) {
								var phy = [112, 72, 89, 115];
								if (png.chunks[i].type == 'pHYs') {
									png.chunks.splice(i, 1, new PNG.Chunk(9, 'pHYs', pHY_data, crc32(phy.concat(pHY_data))));
									break
								} else if (png.chunks[i].type == 'IDAT') {
									png.chunks.splice(i, 0, new PNG.Chunk(9, 'pHYs', pHY_data, crc32(phy.concat(pHY_data))));
									break
								}
							}
							var blob = png.toBlob();
							var a = document.createElement('a');
							a.download = simpleString(block) + '.png';
							a.target = '_self';
							a.href = URL.createObjectURL(blob);
							document.body.appendChild(a);
							a.addEventListener("click", function(e) {
								a.parentNode.removeChild(a)
							});
							a.click()
						}
						if (canvas.toBlob === undefined) {
							var src = canvas.toDataURL('image/png');
							var base64img = src.split(',')[1];
							var decoded = window.atob(base64img);
							var rawLength = decoded.length;
							var buffer = new Uint8Array(new ArrayBuffer(rawLength));
							for (var i = 0; i < rawLength; i++) {
								buffer[i] = decoded.charCodeAt(i)
							}
							var blob = new Blob([buffer], {
								'type': 'image/png'
							});
							new PNG().readFromBlob(blob, download)
						} else {
							canvas.toBlob(function(blob) {
								new PNG().readFromBlob(blob, download)
							})
						}
					}
				})
			};

    }, 20000);

})();