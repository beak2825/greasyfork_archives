// ==UserScript==
// @name            Yandex Radio Equalizer
// @namespace       Bobsans@Scripts
// @description     Yandex Radio Equaliser
// @grant           GM_xmlhttpRequest 
// @match           *://radio.yandex.ru/*
// @version 0.0.1.20170208173349
// @downloadURL https://update.greasyfork.org/scripts/27185/Yandex%20Radio%20Equalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/27185/Yandex%20Radio%20Equalizer.meta.js
// ==/UserScript==

function VisualizerSample() {
  this.context = new AudioContext();
  
  this.options = {
    SMOOTHING: 0.85,
    FFT_SIZE: 1024
  };
  
  this.canvas = document.createElement('canvas');
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;
  this.canvas.style.position = 'absolute';
  this.canvas.style.left = this.canvas.style.top = 0;
  this.ctx = this.canvas.getContext('2d');
  
  var back = document.querySelector('.background');
  back.style.background = '#666666';
  
  back.appendChild(this.canvas);
  
  document.querySelector('.page-root').style.overflowY = 'auto';
}

VisualizerSample.prototype.start = function(loadtrack) {
  //loadSounds(this, {buffer: Mu.Flow._current._$e_});
  //this.source = this.context.createBufferSource();

  this.source = this.context.createBufferSource();
  var self = this;

  var request = new XMLHttpRequest();
  request.open('GET', Mu.Flow._current._$e_, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    self.context.decodeAudioData(request.response, function(buffer) {
      self.source.buffer = buffer;

      self.analyser = self.context.createAnalyser();
      self.analyser.minDecibels = -140;
      self.analyser.maxDecibels = 0;
      self.analyser.smoothingTimeConstant = self.options.SMOOTHING;
      self.analyser.fftSize = self.options.FFT_SIZE;

      self.gain = self.context.createGain();
      self.gain.gain.value = 0;

      self.source.connect(self.analyser);
      self.source.connect(self.gain);
      self.gain.connect(self.context.destination);

      self.freqs = new Uint8Array(self.analyser.frequencyBinCount);
      self.times = new Uint8Array(self.analyser.frequencyBinCount);

      self.source.start(self.context.currentTime, Mu.Flow.getPosition() + 0.02);
      self.source.plating = true;
      self.playing = true;

      requestAnimationFrame(self.draw.bind(self));
    }, function(error) {
      console.error('decodeAudioData error', error);
    });
  };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

VisualizerSample.prototype.stop = function() {
  this.playing = false;
  if(this.source && this.source.playing)
    this.source.stop();
};

VisualizerSample.prototype.draw = function() {
  var i = 0;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
  this.analyser.getByteFrequencyData(this.freqs);
  this.analyser.getByteTimeDomainData(this.times);

  this.ctx.shadowBlur = 0;

  for (i = 0; i < this.analyser.frequencyBinCount; i++) {
    var value = this.freqs[i];
    var percent = value / 256;
    var height = this.canvas.height * percent;
    var width = this.canvas.width / this.analyser.frequencyBinCount;
    var offset = this.canvas.height - (this.canvas.height * percent) - 1;
    var hue = i / this.analyser.frequencyBinCount * 360;
    this.ctx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    this.ctx.fillRect(i * (width + 0.5), offset, width, height);
  }
  
  this.ctx.beginPath();
  this.ctx.strokeStyle = '#FFF';
  this.ctx.globlAlpha = 0.5;
  this.ctx.lineWidth = 4;
  
  this.ctx.shadowColor = '#FFF';
  this.ctx.shadowOffsetX = 0;
  this.ctx.shadowOffsetY = 0;
  this.ctx.shadowBlur = 10;
  
  for (i = 0; i < this.analyser.frequencyBinCount; i++) 
    this.ctx.lineTo(i * this.canvas.width / this.analyser.frequencyBinCount, this.canvas.height - (this.canvas.height * (this.times[i] / 256)) - 1);

  this.ctx.stroke();

  if(this.playing)
  	requestAnimationFrame(this.draw.bind(this));
};

VisualizerSample.prototype.getFrequencyValue = function(freq) {
  var nyquist = this.context.sampleRate / 2;
  var index = Math.round(freq / nyquist * this.freqs.length);
  return this.freqs[index];
};

window.onload = function () {
  eq = new VisualizerSample();
  
  window.onresize = function() {
    eq.canvas.width = window.innerWidth;
    eq.canvas.height = window.innerHeight;
    eq.ctx = eq.canvas.getContext('2d');
  };

  Mu.Flow.on('changeCurrent', function() {
    eq.stop();

    setTimeout(function() {
      eq.start(true);
    }, 1000);
  });
  
  Mu.Flow.on('state', function() {
    if(eq.playing)
      eq.stop();
    else
      eq.start();
  });
};