// ==UserScript==
// @name 		Evolve-Scab-Worker
// @namespace		solistus.xyz
// @description 	Overrides the default game speed and improves reliability of mid and long tick fire rates
// @match 		https://pmotschmann.github.io/Evolve*
// @version 		0.2.1
// @inject-into 	page
// @license		MIT
// @run-at 		document-start
// @downloadURL https://update.greasyfork.org/scripts/510364/Evolve-Scab-Worker.user.js
// @updateURL https://update.greasyfork.org/scripts/510364/Evolve-Scab-Worker.meta.js
// ==/UserScript==

// TO DO: 
		// (for 1.0) add UI to allow tick speed to be set without using console commands
		// (for 1.0) clean up debug output and implement debugging flag to toggle on/off easily
			// (for 1.1?) add option to use vanilla worker messages to set the baseDelay to match vanilla speeds more accurately
			// (maybe?) add support for a message to alter Ticker ratios, and/or to allow a separate interval to be toggled for just one message type 
			// (maybe?) test other options for the scab script body e.g. a separate included file [mainly for maintainability as editing code stored in a string literal can be a hassle]

let baseDelay = 190,
		scabScript =
  `let debug = console.debug.bind(console); //replace with ()=>{} to turn off debug output, or e.g. an array's push method to redirect output elsewhere
debug('scab worker started')
function
/* Generator for messages to send from worker to page for game ticks
 * default params for standard ratios of fast/mid/long. 1 long, (midratio) mids, (midratio*fastratio) fasts per cycle (1/5/20 default).
 */
* Ticker(fastratio=4, midratio=5) {
	while(true) {
	yield "long";
	let a = midratio; while(a--){ let b = fastratio; yield "mid"; while(b--) yield "fast"; }
 }}
function pause() {
	clearInterval(self.messenger); self.messenger = null;
	debug("worker paused ticks.")
}
function resume() {
	clearInterval(self.messenger);
	self.messenger = setInterval(()=>{self.postMessage(self.ticker.next().value)}, self.delay);
  debug('worker is now sending ticks.');
}
function setDelay(del) {
	self.delay = del;
	if(self.messenger) self.resume();
	debug('worker delay set to ' + self.delay + (self.messenger ? "ms." : "ms. (game is paused)"));
	}
	self.delay 	=  ${baseDelay},
	self.ticker	= Ticker(),
	self.messenger = 0; resume();

self.addEventListener('message', ((e)=>{
let loop = e.data.loop ?? e.data, period = Number.parseInt(e.data.period) ?? 0;
switch(loop){
  case 'clear':
	case 'pause':
      pause();
      break;
  case 'short':
	case 'resume':
  case 'unpause':
  case 'play':
      resume();
      break;
  case 'delay':
      if(period)
					setDelay(period);
			else
					console.log("worker delay is " + self.delay + (self.messenger?"ms.":"ms (PAUSED).")); 
	    break;
	case 'mid':
	case 'long':
			break;
  default:
			if(typeof loop == 'number' || loop == Number.parseInt(loop)) 
				setDelay(Number.parseInt(loop));
			else {
	      try { debug("worker received unsupported message: ", JSON.stringify(e.data)); }
				catch { debug("worker received unsupported message, string conversion failed: ", e.data)}
			}
}
}));`,
	scabURL = URL.createObjectURL(new Blob([scabScript], {type:'application/javascript'}));


window._Worker = window.Worker;
window.scab = {
	delay: baseDelay,
	help: function(){
		console.info('Supported message contents for scab.worker.postMessage(contents): ');
		console.info('Vanilla game messages: {loop: <string>, period: <number>}, except loop: mid and loop: long (all three loops are controlled together on loop: short; mid and long messages are ignored). Period is ignored for all vanilla messages; use delay messages (see below) or this.speed() to alter tickrate.');
		console.info('String messages (can also send as {loop: <str>}): clear/pause to pause game, short/resume/play to resume, delay to check current delay.');
		console.info('Delay setters: {loop: "delay", period: <new delay>}, or simply send the delay as a string/number e.g. scab.worker.postMessage(50). Or, use scab.speed()');
	},
	speed: function(spd, asmult = true) { if(asmult) spd = Math.ceil(this.delay/spd); window.scab?.worker?.postMessage(spd); }
};
window.Worker = class Worker extends window._Worker {
  constructor(...args) {
    let isScab = false;
    if (args[0] == 'evolve/evolve.js') { args[0] = scabURL; isScab = true;}
		super(...args);
		if(isScab) window.scab.worker = this;
		console.debug('Worker(): ', args, this);
    }
};
console.info('Scab worker injected. Access worker at window.scab.worker, set speed with window.scab.speed(delay), or set to a multiple of default rate with *.speed(mult, true)');
console.debug('To see all supported messages for manual sending, call window.scab.help().');