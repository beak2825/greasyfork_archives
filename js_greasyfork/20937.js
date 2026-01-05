// ==UserScript==
// @name        Red Read Line
// @namespace   http://q-garden.de/greases
// @description shows you how far you scrolled
// @include     http://*
// @include     https://*
// @include     ftp://*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20937/Red%20Read%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/20937/Red%20Read%20Line.meta.js
// ==/UserScript==

// load and execute from http://stackoverflow.com/q/6834930
var load,
execute,
loadAndExecute;
load = function (a, b, c) {
  var d;
  d = document.createElement('script'),
  d.setAttribute('src', a),
  b != null && d.addEventListener('load', b),
  c != null && d.addEventListener('error', c),
  document.body.appendChild(d);
  return d
},
execute = function (a) {
  var b,
  c;
  typeof a == 'function' ? b = '(' + a + ')();' : b = a,
  c = document.createElement('script'),
  c.textContent = b,
  document.body.appendChild(c);
  return c
},
loadAndExecute = function (a, b) {
  return load(a, function () {
    return execute(b)
  })
};
loadAndExecute('//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js', function () {
  $('body').append('<div id=\'redreadline\'></div>');
  
  var update;
  var scrollpos = 0;
  


  $(window).scroll(function () {
    $('#redreadline').css({"top":scrollpos, "opacity":"1"}).stop().clearQueue().fadeIn(0).fadeOut(500);
    clearTimeout(update);
    update = setTimeout(resetScroll, 300);
  });
  
  function resetScroll(){
    scrollpos = document.documentElement.scrollTop;
    //$('#redreadline').css({"top":scrollpos});
  }
  
  function addGlobalStyle(css) {
    var head,
    style;
    head = document.getElementsByTagName('head') [0]; 
    if (!head) {
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  };
  addGlobalStyle('#redreadline{position: absolute; left:0; right:0; height:'+window.innerHeight+'px; width:100vw; margin:-3px; pointer-events:none; box-shadow: 0px 0px 15px 0px rgba(255, 0, 0, 1);opacity:0;}');
});
