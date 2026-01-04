/*!
 * Tinycon - A small library for manipulating the Favicon
 * Tom Moor, http://tommoor.com
 * Copyright (c) 2015 Tom Moor
 * @license MIT Licensed
 + @special modifed for lorify-ng extension by OpenA
 */

(function(){

  var Tinycon = {};
  var currentFavicon = null;
  var originalFavicon = null;
  var faviconImage = null;
  var canvas = null;
  var options = {};
  // Chrome browsers with nonstandard zoom report fractional devicePixelRatio.
  var r = Math.ceil(window.devicePixelRatio) || 1;
  var size = 16 * r;
  var options = {
    width: 7,
    height: 9,
    font: 10 * r + 'px arial',
    color: '#ffffff',
    background: '#F03D25',
    fallback: true,
    crossOrigin: true,
    abbreviate: true
  };

  var ua = (function () {
    var agent = navigator.userAgent.toLowerCase();
    // New function has access to 'agent' via closure
    return function (browser) {
      return agent.indexOf(browser) !== -1;
    };
  }());

  var browser = {
    ie: ua('trident'),
    chrome: ua('chrome'),
    webkit: ua('chrome') || ua('safari'),
    safari: ua('safari') && !ua('chrome'),
    mozilla: ua('mozilla') && !ua('chrome') && !ua('safari')
  };

  // private methods
  var getFaviconTag = function(){

    var links = document.getElementsByTagName('link');

    for(var i=0, len=links.length; i < len; i++) {
      if ((links[i].getAttribute('rel') || '').match(/\bicon\b/i)) {
        return links[i];
      }
    }

    return false;
  };

  var removeFaviconTag = function(){

    var links = document.getElementsByTagName('link');

    for(var i=0, len=links.length; i < len; i++) {
      var exists = (typeof(links[i]) !== 'undefined');
      if (exists && (links[i].getAttribute('rel') || '').match(/\bicon\b/i)) {
        links[i].parentNode.removeChild(links[i]);
      }
    }
  };

  var getCurrentFavicon = function(){

    if (!originalFavicon || !currentFavicon) {
      var tag = getFaviconTag();
      currentFavicon = tag ? tag.getAttribute('href') : '/favicon.ico';
      if (!originalFavicon) {
        originalFavicon = currentFavicon;
      }
    }

    return currentFavicon;
  };

  var getCanvas = function (){

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
    }

    return canvas;
  };

  var setFaviconTag = function(url){
    if(url){
      removeFaviconTag();

      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  };

  var log = function(message){
    if (window.console) window.console.log(message);
  };

  var drawFavicon = function(label, color) {

    // fallback to updating the browser title if unsupported
    if (!getCanvas().getContext || browser.ie || browser.safari || options.fallback === 'force') {
      return updateTitle(label);
    }

    var context = getCanvas().getContext("2d");
    var color = color || '#000000';
    var src = getCurrentFavicon();

    faviconImage = document.createElement('img');
    faviconImage.onload = function() {

      // clear canvas
      context.clearRect(0, 0, size, size);

      // draw the favicon
      context.drawImage(faviconImage, 0, 0, faviconImage.width, faviconImage.height, 0, 0, size, size);

      // draw bubble over the top
      if ((label + '').length > 0) drawBubble(context, label, color);

      // refresh tag in page
      refreshFavicon();
    };

    // allow cross origin resource requests if the image is not a data:uri
    // as detailed here: https://github.com/mrdoob/three.js/issues/1305
    if (!src.match(/^data/) && options.crossOrigin) {
      faviconImage.crossOrigin = 'anonymous';
    }

    faviconImage.src = src;
  };

  var updateTitle = function(label) {

    if (options.fallback) {
      // Grab the current title that we can prefix with the label
      var originalTitle = document.title;

      // Strip out the old label if there is one
      if (originalTitle[0] === '(') {
        originalTitle = originalTitle.slice(originalTitle.indexOf(' '));
      }

      if ((label + '').length > 0) {
        document.title = '(' + label + ') ' + originalTitle;
      } else {
        document.title = originalTitle;
      }
    }
  };

  var drawBubble = function(context, label, color) {

    // automatic abbreviation for long (>2 digits) numbers
    if (typeof label == 'number' && label > 99 && options.abbreviate) {
      label = abbreviateNumber(label);
    }

    var radius = canvas.width / 100 * 38,
       centerX = canvas.width - radius,
       centerY = radius,
       fontPix = radius * 1.5;
	
    // webkit seems to render fonts lighter than firefox
    context.font = 'bold '+ fontPix +'px arial';
    context.fillStyle = '#48de3d';
    context.strokeStyle = 'rgba(0,0,0,0.2)';
	
    // bubble
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
	
    // label
    context.fillStyle = '#fff';
    context.textAlign = "center";
    context.fillText(label, centerX, fontPix);
  };

  var refreshFavicon = function(){
    // check support
    if (!getCanvas().getContext) return;

    setFaviconTag(getCanvas().toDataURL());
  };

  var abbreviateNumber = function(label) {
    var metricPrefixes = [
      ['G', 1000000000],
      ['M',    1000000],
      ['k',       1000]
    ];

    for(var i = 0; i < metricPrefixes.length; ++i) {
      if (label >= metricPrefixes[i][1]) {
        label = round(label / metricPrefixes[i][1]) + metricPrefixes[i][0];
        break;
      }
    }

    return label;
  };

  var round = function (value, precision) {
    var number = new Number(value);
    return number.toFixed(precision);
  };

  Tinycon.setImage = function(url){
    currentFavicon = url;
    refreshFavicon();
    return this;
  };

  Tinycon.setBubble = function(label, color) {
    label = label || '';
    drawFavicon(label, color);
    return this;
  };

  Tinycon.reset = function(){
    currentFavicon = originalFavicon;
    setFaviconTag(originalFavicon);
  };

  if(typeof define === 'function' && define.amd) {
    define(Tinycon);
  } else if (typeof module !== 'undefined') {
    module.exports = Tinycon;
  } else {
    window.Tinycon = Tinycon;
  }

})();