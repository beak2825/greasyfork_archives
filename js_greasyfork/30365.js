// ==UserScript==
// @name         bv7_btc-e_helper_b
// @namespace    bv7
// @version      0.3
// @description  say 'up-down-up-down...' then I will help you
// @author       bv7
// @include      https://btc-e.com/api/3/ticker/btc_usd
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/30365/bv7_btc-e_helper_b.user.js
// @updateURL https://update.greasyfork.org/scripts/30365/bv7_btc-e_helper_b.meta.js
// ==/UserScript==


(function() {
	'use strict';

	class Canvas {
		constructor() {
			this.node = document.createElement('canvas');
			this.context = this.node.getContext('2d');
		}
	}

	const GRAPH_MAX_BARS = 128;
	class Graph {
		constructor(ticker, timeInterval) {
			this.ticker = ticker;
			this.timeInterval = timeInterval;
			this.canvas = new Canvas();
			this.bars = [];
			this.timeShift;
		}
		update() {
			let barTimeStart = parseInt(this.ticker.request.response.updated / timeInterval) * timeInterval;
			if(this.bars.length && barTimeStart == this.bars[0].timeStart) {
				this.bar[0].high = Math.max(this.bar[0].high, this.ticker.request.response.buy);
				this.bar[0].low = Math.min(this.bar[0].low, this.ticker.request.response.buy);
				this.bar[0].close = this.ticker.request.response.buy;
			} else {
				for (let i = Math.min(this.bars.length, GRAPH_MAX_BARS - 1); i > 0; i--) this.bars[i] = this.bars[i - 1];
				this.bars[0] = {
					timeStart: barTimeStart,
					open: this.ticker.request.response.buy,
					high: this.ticker.request.response.buy,
					low: this.ticker.request.response.buy,
					close: this.ticker.request.response.buy
				};
				this.canvas.shift(-pixelsPerTimeInterval);
			}
		}
	}

	class Graph1h extends Graph {
		constructor(ticker) {
			super(ticker, 60 * 60);
		}
		update() {

		}
	}

	class Tool {
		constructor() {
			this.node = document.createElement('div');
			this.node.style = 'background-color:green;padding:5px;border-radius:15px';
			
		}
	}
	
	class Ticker {
		constructor() {
			this.request = new XMLHttpRequest();
			this.request.responseType = 'json';
			this.request.addEventListener('load', function(me) {
				return function(event) {
					me.onLoad(event);
				};
			}(this));
			this.graph1h = new Graph1h(this);
			this.canvas = new Canvas();
		}
		onLoad(event) {
			//console.log('this.request.responseType = ', this.request.responseType)
			//console.log('this.request.response = ', this.request.response);
/*			if (this.prevRequestResponce) {
				if (this.prevRequestResponce.)
			}
*///				this.canvas.shift();
/*
			var shiftContext = function(ctx, w, h, dx, dy) {
  var clamp = function(high, value) { return Math.max(0, Math.min(high, value)); };
  var imageData = ctx.getImageData(clamp(w, -dx), clamp(h, -dy), clamp(w, w-dx), clamp(h, h-dy));
  ctx.clearRect(0, 0, w, h);
  ctx.putImageData(imageData, 0, 0);
};
*/
			event.preventDefault();
		}
		load() {
			this.request.open('GET', 'https://btc-e.com/api/3/ticker/btc_usd');
			this.request.send();
		}
		show() {
			
		}
	}
	class Bv7btc_e_helper {
		constructor() {
			this.ticker = new Ticker();
			addEventListener('load', function(me) {
				return function(event) {
					me.onLoad(event);
				};
			}(this));
			this.tool = new Tool();
			
			setInterval(function(me) {
				return function() {
					me.ticker.load();
				};
			}(this), 5000);
		}
		/*
			onLoad(event) {
				console.log('Bv7btc_e_helper.onLoad');
				event.preventDefault();
				setInterval(function(me) {
					return function() {
						me.ticker.load();
					};
				}(this), 5000);
			}
		*/
		
	};
	
	var bv7btc_e_helper = new Bv7btc_e_helper();
	
})();