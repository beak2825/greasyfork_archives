// ==UserScript==
// @name         [LIBRARY] InjectorLib
// @namespace    http://thebone.ml/tampermonkey
// @version      1.0
// @updateURL    http://thebone.ml/tampermonkey/ressource
// @downloadURL  http://thebone.ml/tampermonkey/
// @description  Contains several functions for injecting html/js/css
// @author       TheBone
// ==/UserScript==

function inject_srcjs(link) {
  $('<script type="text/javascript" src="' + link + '"/>').appendTo($('head'));
}
function inject_rawjs(jsstring) {
  $('<script type="text/javascript">' + jsstring + '</string>').appendTo($('head'));
}
function inject_headhtml(htmlstring) {
  $(htmlstring).appendTo($('head'));
}
function inject_bodyhtml(htmlstring) {
  $(htmlstring).appendTo($('body'));
}
function inject_customhtml(htmlstring, appendto) {
  $(htmlstring).appendTo($(appendto));
}
function inject_globalcss(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}