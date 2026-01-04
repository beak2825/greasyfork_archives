// ==UserScript==
// @name        GCPDot with Timestamps
// @namespace   Violentmonkey Scripts
// @match       https://gcpdot.com/gcpchart.php
// @grant       none
// @version     1.1
// @author      -
// @license     MIT
// @description 9/16/2024, 11:40:41 AM
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/gh/odyniec/MonkeyConfig@51456c3a36b9b6febe61d1351de16466c90695d2/monkeyconfig.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/508743/GCPDot%20with%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/508743/GCPDot%20with%20Timestamps.meta.js
// ==/UserScript==

// configuration menu
const cfg = new MonkeyConfig({
  title: 'GCPDot Timestamps',
  menuCommand: true,
  params: {
    timezone: {
      type: 'select',
      choices: ['Auto'].concat(Intl.supportedValuesOf('timeZone')),
      default: 'Auto'
    },
    doubleBugFix: {
      type: 'checkbox',
      default: false,
    }
  }
});

// patch things
let retrievedTimestamp
let graph
// data is 24hr wide
const dataSpan = 1440 * 60 * 1000

// the data is 10min behind
const dataLag = 10 * 60 * 1000

function gcpchart_initialize_patched(id) {
	var chart = {
		element: null,
		dataSource: 'https://global-mind.org/gcpdot/gcpgraph.php',
		dataLoaderTimeout: null,
		canvas: null,
		lastCanvasWidth: -1,


		graphics: {
			dotSize: 15,
			shadowOffset: 10,
			gscalar: 1,
			bscalar: 1,
			element: null,
			canvas: null,
			context: null,
			canvasShadow: null,
			contextShadow: null,
			lineDiv: null,
			dataDiv: null,
			lastData: null,

			bgImage: null,
			imgBuffer: null,

			initialize: function (element) {
				this.element = element;

				this.lineDiv = document.createElement('div');
				this.lineDiv.style.position = 'absolute';
				this.lineDiv.style.top = '20px';
				this.lineDiv.style.left = '0px';
				this.lineDiv.style.width = '1px';
				this.lineDiv.style.zIndex = 1010;
				this.lineDiv.style.borderLeft = '1px solid rgba(255, 255, 255, 1)';
				this.lineDiv.style.display = 'none';
				element.appendChild(this.lineDiv);

				this.dataDiv = document.createElement('div');
				this.dataDiv.style.position = 'absolute';
				this.dataDiv.style.top = '20px';
				this.dataDiv.style.left = '0px';
				this.dataDiv.style.width = '100';
				this.dataDiv.style.zIndex = 1011;
				this.dataDiv.style.border = '1px solid rgba(255, 255, 255, 0.93)';
				this.dataDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.50)';
				this.dataDiv.style.boxShadow = '4px 4px 8px rgba(0,0,0,0.73)';
				this.dataDiv.style.display = 'none';
				element.appendChild(this.dataDiv);


				//Shadow canvas must be instanced first to render properly
				this.canvasShadow = document.createElement('canvas');
				this.canvasShadow.id = 'gcpChartShadow';
				this.canvasShadow.style.position = 'absolute';
				this.canvasShadow.style.zIndex = 1000;
				element.appendChild(this.canvasShadow);

				//the chart canvas must be instanced second to be on top of the shadow canvas
				this.canvas = document.createElement('canvas');
				this.canvas.id = 'gcpChart';
				this.canvas.style.position = 'absolute';
				this.canvas.style.zIndex = 1001;  //zIndex has no effect, only order of createElement on these canvas-i
				element.appendChild(this.canvas);
				element.appendChild(this.lineDiv);
				this.resetCanvasSize();
				this.makeImages();

				var self = this;
				this.element.addEventListener("mousemove", function (event) {
					if (!self.lastData)
						return;
					if (self.lineDiv.style.display == 'none') {
						self.lineDiv.style.display = '';
						self.dataDiv.style.display = '';
					}
					if (!self.lastData[event.pageX * self.gscalar / self.bscalar]) {
						self.lineDiv.style.display = 'none';
						self.dataDiv.style.display = 'none';
						return;
					}
					var d = self.lastData[event.pageX * self.gscalar / self.bscalar];

					// set up the text on the inner box
					// figure out what minute, roughly, the mouse is at
					// the data is 10 min behind
					// the graph ends at a certain pixel though so don't bother above that
					if (event.pageX < graph.length) {
						let xPct = event.pageX / graph.length;
            if( cfg.get('doubleBugFix') ) {
              xPct *= 2;
            }

						const millisOffset = (1 - xPct) * (dataSpan - dataLag);
						const mouseMillis = retrievedTimestamp - dataLag - millisOffset;
						const dateObj = new Date(0);
						dateObj.setUTCMilliseconds(mouseMillis);
            const intlOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' };

            // Timezone compensation for browsers with resistFingerprinting
            const selectedTimezone = cfg.get('timezone');
            if( selectedTimezone != 'Auto' ) {
              intlOptions.timeZone = selectedTimezone;
            }

						const timeStamp = Intl.DateTimeFormat("en-US", intlOptions).format(dateObj);
						// retrievedTimestamp

						var correlationPct = Math.min(100, Math.round(d.average * 10000) / 100);
						self.dataDiv.innerHTML = `${correlationPct}%: ${timeStamp}`;
					}

					if (event.pageX < self.element.offsetWidth - self.dataDiv.offsetWidth) {
						self.lineDiv.style.left = event.pageX + 'px';
						self.dataDiv.style.left = (event.pageX + 3) + 'px';
					} else {
						self.lineDiv.style.left = event.pageX + 'px';
						self.dataDiv.style.left = (event.pageX - 3 - self.dataDiv.offsetWidth) + 'px';
					}
					self.dataDiv.style.top =
						Math.floor(d.average * self.canvas.offsetHeight - self.dataDiv.offsetHeight / 2 +
							self.canvas.offsetTop) + 'px';
				});
				this.element.addEventListener("mouseout", function () {
					self.lineDiv.style.display = 'none';
					self.dataDiv.style.display = 'none';
				});

				return this.canvas;
			},
			resetCanvasSize: function () {
				var w = this.element.offsetWidth, h = this.element.offsetHeight - 40;
				this.gscalar = window.devicePixelRatio || 1;
				this.canvas.width = w;
				this.canvas.height = h;
				this.canvasShadow.width = w;
				this.canvasShadow.height = h;
				this.lineDiv.style.height = h + 'px';

				this.context = this.canvas.getContext('2d');
				this.contextShadow = this.canvasShadow.getContext('2d');
				this.bscalar = this.context.webkitBackingStorePixelRatio ||
					this.context.mozBackingStorePixelRatio ||
					this.context.msBackingStorePixelRatio ||
					this.context.oBackingStorePixelRatio ||
					this.context.backingStorePixelRatio || 1;

				if (this.gscalar != this.bscalar) {	//This is adjusting the canvas for High Definition Displays like Apple Retina
					var ratio = this.gscalar / this.bscalar;
					this.canvas.style.width = w + 'px';
					this.canvas.style.height = h + 'px';
					this.canvas.width = w * ratio;
					this.canvas.height = h * ratio;
					this.context.scale(ratio, ratio);

					this.canvasShadow.style.width = w + 'px';
					this.canvasShadow.style.height = h + 'px';
					this.canvasShadow.width = w * ratio;
					this.canvasShadow.height = h * ratio;
					this.contextShadow.scale(ratio, ratio);
				}
				this.lastCanvasWidth = this.canvas.offsetWidth;
			},
			makeImages: function () {
				if (this.bgImage && this.bgImage.width == this.canvas.width)
					return;
				if (this.bgImage)
					delete this.bgImage;

				var self = this;
				var svg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid meet' width='"
					+ this.canvas.width + "' height='" + this.canvas.height + "' version='1.1'><defs><linearGradient id='g' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' style='stop-color:#FF00FF;stop-opacity:1' /><stop offset='1%' style='stop-color:#FF0000;stop-opacity:1' /><stop offset='3.5%' style='stop-color:#FF4000;stop-opacity:1' /><stop offset='6%' style='stop-color:#FF7500;stop-opacity:1' /><stop offset='11%' style='stop-color:#FFB000;stop-opacity:1' /><stop offset='22%' style='stop-color:#FFFF00;stop-opacity:1' /><stop offset='50%' style='stop-color:#00df00;stop-opacity:1' /><stop offset='90%' style='stop-color:#00df00;stop-opacity:1' /><stop offset='94%' style='stop-color:#00EEFF;stop-opacity:1' /><stop offset='99%' style='stop-color:#0034F4;stop-opacity:1' /><stop offset='100%' style='stop-color:#440088;stop-opacity:1' /></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)' /></svg>";
				this.bgImage = new Image();

				this.bgImage.width = this.canvas.width - this.dotSize / 2 * this.gscalar / this.bscalar;
				this.bgImage.height = this.canvas.height;
				this.bgImage.src = "data:image/svg+xml;base64," + btoa(svg);
				this.bgImage.addEventListener('load', function () {
					self.context.drawImage(self.bgImage, 0, 0, self.bgImage.width, self.bgImage.height,
						0, 0, self.canvas.offsetWidth, self.canvas.offsetHeight);
					if (self.imgBuffer)
						delete self.imgBuffer;
					self.imgBuffer = self.context.getImageData(0, 0, self.bgImage.width, self.bgImage.height);
					for (y = 0; y < self.bgImage.height; y++)
						for (x = 0; x < self.bgImage.width; x++)
							self.imgBuffer.data[(y * self.bgImage.width + x) * 4 + 3] = 0;
					self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
				});
				this.bgImage.addEventListener('error', function (e) {
					console.info("error loading Rainbow Image - " + svg);
					console.info(self.bgImage.width + ' ' + self.bgImage.height);
					console.info(self.bgImage.naturalWidth + ' ' + self.bgImage.naturalHeight);
				});
			},
			renderChart: function (data) {
				this.lastData = data;
				var w = this.canvas.offsetWidth, h = this.canvas.offsetHeight, ch = this.canvas.height;
				var inv_ch = 1.0 / ch;

				var imgShadowBuffer = this.contextShadow.createImageData(this.bgImage.width, this.bgImage.height);

				//Set the alpha for just the graph pixels
				for (i = 0; i < data.length; i++) {
					if (!data[i])
						continue;
					if ((data[i].bottom - data[i].top) < inv_ch)
						if (data[i].top > 0.5)
							data[i].top -= inv_ch;
					for (y = Math.floor(data[i].top * ch); y < data[i].bottom * ch; y++) {
						var ys = y / ch;
						var a = 0;
						if (ys > data[i].q1 && ys <= data[i].q3 || (data[i].bottom - data[i].top) < inv_ch * 1.5)
							a = 1;
						else if (ys > data[i].top && ys <= data[i].q1)
							a = (ys - data[i].top) / (data[i].q1 - data[i].top);
						else if (ys > data[i].q3 && ys <= data[i].bottom)
							a = (data[i].bottom - ys) / (data[i].bottom - data[i].q3);
						if (this.imgBuffer)
							this.imgBuffer.data[(i + y * this.bgImage.width) * 4 + 3] = 255 * a;
						imgShadowBuffer.data[(i + y * this.bgImage.width) * 4 + 3] = Math.pow(a, 0.75) * 255;
					}
				}
				//blur the shadow
				stackBlurCanvasAlpha(imgShadowBuffer.data, this.bgImage.width, this.bgImage.height, 6);

				this.contextShadow.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.contextShadow.globalAlpha = 1.0;
				this.contextShadow.putImageData(imgShadowBuffer, this.shadowOffset, this.shadowOffset);

				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.context.globalAlpha = 1.0;
				if (this.imgBuffer)
					this.context.putImageData(this.imgBuffer, 0, 0);

				//reset the alpha for just the graph pixels back to transparent
				for (i = 0; i < data.length; i++)
					if (data[i] && this.imgBuffer)
						for (y = Math.floor(data[i].top * ch); y < data[i].bottom * ch; y++)
							this.imgBuffer.data[i * 4 + y * this.bgImage.width * 4 + 3] = 0;

				delete imgShadowBuffer;
			}
		},

		initialize: function (id, clickUrl) {
			var self = this;

			this.element = document.getElementById(id);
			dotscript = document.createElement('script');
			dotscript.type = 'text/javascript';
			dotscript.src = 'gcpdot.js';
			dotscript.onload = function () {
				dot = document.createElement('div');
				dot.id = 'gcpdot' + Math.floor(Math.random() * 1000000);
				dot.style.position = 'absolute';
				dot.style.top = (self.canvas.offsetHeight + self.canvas.offsetTop + 2) + 'px';
				dot.style.right = (self.canvas.offsetWidth + self.graphics.dotSize) / 2 + 'px';
				dot.style.width = self.graphics.dotSize + 'px';
				dot.style.height = self.graphics.dotSize + 'px';
				dot.style.zIndex = 10000;
				dot.style.opacity = 1;
				self.element.appendChild(dot);
				gcpdot = gcpdot_initialize(dot.id);
				gcpdot.setColorFunc = function (scale) {
					if (scale < 0) {
						dot.style.top = (self.canvas.offsetHeight + self.canvas.offsetTop + 2) + 'px';
						dot.style.right = (self.canvas.offsetWidth + self.graphics.dotSize) / 2 + 'px';
						return;
					}
					dot.style.top = (self.canvas.offsetTop + self.graphics.canvas.offsetHeight * scale - self.graphics.dotSize / 2 + 1) + 'px';
					dot.style.right = '0px';
				}
			};
			this.element.appendChild(dotscript);
			this.element.appendChild(header = document.createElement('div'));
			header.style.position = 'absolute';
			header.style.textAlign = 'center';
			header.style.height = '20px';
			header.style.width = '100%';
			header.style.top = '0px';
			header.style.backgroundColor = 'rgba(250, 250, 250, 0.9)';
			header.appendChild(link = document.createElement('a'));
			link.innerHTML = '24 Hour GCP Graph';
			link.href = clickUrl;
			link.style.fontFamily = 'Arial';
			link.style.fontWeight = 'bold';
			link.style.textDecoration = 'none';
			link.style.color = 'black';

			this.canvas = canvas = this.graphics.initialize(this.element);
			canvas.style.backgroundColor = 'rgba(0, 0, 0, 0)';
			canvas.style.top = '20px';
			canvas.style.left = '0px';
			this.graphics.canvasShadow.style.backgroundColor = 'rgba(64, 64, 64, .9)';
			this.graphics.canvasShadow.style.top = '20px';
			this.graphics.canvasShadow.style.left = '0px';
			this.graphics.canvasShadow.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';
			this.lastCanvasWidth = canvas.offsetWidth;

			this.element.appendChild(footer = document.createElement('div'));
			footer.style.position = 'absolute';
			footer.style.height = '20px';
			footer.style.width = '100%';
			footer.style.bottom = '0px';
			footer.appendChild(span = document.createElement('span'));
			span.innerHTML = '&nbsp;24 Hours Ago';
			span.style.float = 'left';
			span.style.fontFamily = 'Arial';
			span.style.fontSize = '90%';
			footer.appendChild(span = document.createElement('span'));
			span.innerHTML = 'Now&nbsp;';
			span.style.float = 'right';
			span.style.fontFamily = 'Arial';
			span.style.fontSize = '90%';

			window.addEventListener('resize', function () {
				if (self.element.offsetWidth != self.lastCanvasWidth) {
					self.graphics.resetCanvasSize();
					//console.log('refresh width: ' + self.canvas.offsetWidth + ' px');
					self.lastCanvasWidth = self.element.offsetWidth;
					if (self.dataLoaderTimeout)
						clearTimeout(self.dataLoaderTimeout);
					self.dataLoaderTimeout = setTimeout(function () {
						self.dataLoaderTimeout = null;
						self.graphics.makeImages();
						self.getData();
					}, 3000);
				}
			});
			this.getData();
		},
		Xhr: function () {
			try { return new XMLHttpRequest(); } catch (e) { }
			try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e) { }
			try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) { }
			try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) { }
			try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) { }
			try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { }
			return null;
		},
		getData: function () {
			var xhr = this.Xhr(), self = this;
			if (!xhr) return;


			var url = this.dataSource + '?pixels=' + (this.canvas.width - this.graphics.dotSize) + '&seconds=-86400' //+ '&starting=0'
				+ '&nonce=' + Math.round(Math.random() * 10000000);
			xhr.open("GET", url, true);
			xhr.setRequestHeader('Content-Type', 'text/plain');
			xhr.ontimeout = function () {
				self.dataLoaderTimeout = setTimeout(function () {
					self.dataLoaderTimeout = null;
					self.getData();
				}, Math.random() * 2000 * Math.sqrt(self.errorTime));
				self.errorTime *= 1.5;
				if (self.errorTime > 300)
					self.errorTime = 300;
				return;
			};
			xhr.onerror = function () {
				self.dataLoaderTimeout = setTimeout(function () {
					self.dataLoaderTimeout = null;
					self.getData();
				}, self.errorTime * 1000);
				self.errorTime *= 1.5;
				if (self.errorTime > 300)
					self.errorTime = 300;
			};
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (!xhr.responseText)
						return xhr.onerror();
					self.errorTime = self.defaultBaseErrorTime;

					retrievedTimestamp = Date.now();
					console.log("retrieved new data", retrievedTimestamp);

					var p = /<p(?=.+?(?!\/>)i=["']([\d]+))(?=.+?(?!\/>)a=["']([\.\d]+))(?=.+?(?!\/>)t=["']([\.\d]+))(?=.+?(?!\/>)q1=["']([\.\d]+))(?=.+?(?!\/>)q3=["']([\.\d]+))(?=.+?(?!\/>)b=["']([\.\d]+))/img, r;

					graph = []; // is now global
					do {
						if (r = p.exec(xhr.responseText)) {
							graph[r[1]] = {
								i: r[1],
								top: r[3],
								q1: r[4],
								average: r[2],
								q3: r[5],
								bottom: r[6],
							};
						}
					} while (r);

					self.dataLoaderTimeout = setTimeout(function () {
						self.dataLoaderTimeout = null;
						self.getData();
					}, (60 - (((new Date()).getMilliseconds() / 1000 - 6.0) % 60) + Math.random() * 30) * 1000);
					self.graphics.renderChart(graph);
				}
			};
			xhr.send();
		}
	};
	chart.initialize(id, 'https://global-mind.org/gcpdot/');
	return chart;
}

document.addEventListener("DOMContentLoaded", () => {
  gcpchart_initialize_patched('chartdiv')
})

const findBodyScript = /^\s*gcpchart_initialize/

window.addEventListener('beforescriptexecute', (event) => {
  const originalScript = event.target;

  // The original initializer is in the body. If this is that, then block it.
  if( findBodyScript.test(originalScript.text) ) {
    console.log("blocking script from startup:", originalScript)
    event.preventDefault()
  }
});


