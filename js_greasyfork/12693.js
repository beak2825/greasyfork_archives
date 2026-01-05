// ==UserScript==
// @name         Timp ramas
// @namespace    http://your.homepage/
// @version      0.1
// @description  cît timp a rămas păn la scoaterea postbanului
// @author       You
// @match        http://www.torrentsmd.com/userdetails.php
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12693/Timp%20ramas.user.js
// @updateURL https://update.greasyfork.org/scripts/12693/Timp%20ramas.meta.js
// ==/UserScript==
////////////////////////////////////////////
(function(){!function(n){return n.countdown=function(t,e){var r,o=this;return this.el=t,this.$el=n(t),this.$el.data("countdown",this),this.init=function(){return o.options=n.extend({},n.countdown.defaultOptions,e),o.options.refresh&&(o.interval=setInterval(function(){return o.render()},o.options.refresh)),o.render(),o},r=function(t){var e,r;return t=Date.parse(n.isPlainObject(o.options.date)?o.options.date:new Date(o.options.date)),r=(t-Date.parse(new Date))/1e3,0>=r&&(r=0,o.interval&&o.stop(),o.options.onEnd.apply(o)),e={years:0,days:0,hours:0,min:0,sec:0,millisec:0},r>=31557600&&(e.years=Math.floor(r/31557600),r-=365.25*e.years*86400),r>=86400&&(e.days=Math.floor(r/86400),r-=86400*e.days),r>=3600&&(e.hours=Math.floor(r/3600),r-=3600*e.hours),r>=60&&(e.min=Math.floor(r/60),r-=60*e.min),e.sec=r,e},this.leadingZeros=function(n,t){for(null==t&&(t=2),n=String(n);n.length<t;)n="0"+n;return n},this.update=function(n){return o.options.date=n,o},this.render=function(){return o.options.render.apply(o,[r(o.options.date)]),o},this.stop=function(){return o.interval&&clearInterval(o.interval),o.interval=null,o},this.start=function(t){return null==t&&(t=o.options.refresh||n.countdown.defaultOptions.refresh),o.interval&&clearInterval(o.interval),o.render(),o.options.refresh=t,o.interval=setInterval(function(){return o.render()},o.options.refresh),o},this.init()},n.countdown.defaultOptions={date:"June 7, 2087 15:03:25",refresh:1e3,onEnd:n.noop,render:function(t){return n(this.el).html(""+t.days+" zile, "+this.leadingZeros(t.hours)+" ore, "+this.leadingZeros(t.min)+" min şi "+this.leadingZeros(t.sec)+" sec")}},void(n.fn.countdown=function(t){return n.each(this,function(e,r){var o;return o=n(r),o.data("countdown")?void 0:o.data("countdown",new n.countdown(r,t))})})}(jQuery)}).call(this);
///////////////////////////////////////////
var newDiv = $('<div></div>');
newDiv.attr("id","myNewDiv").appendTo("h1");

$(function() {
        $('#myNewDiv').countdown({
        date: "October 1, 2015 23:53:22"
    });
});

/////////////////////////////////////////////////
(function() {var css = ["#myNewDiv {",
"    font-family: Consolas;",
"    color: #FFF;",
"    font-size: 30px;",
"    text-shadow: 0 1px 0 #ccc,",
"               0 2px 0 #c9c9c9,",
"               0 3px 0 #bbb,",
"               0 4px 0 #b9b9b9,",
"               0 5px 0 #aaa,",
"               0 6px 1px rgba(0,0,0,.1),",
"               0 0 5px rgba(0,0,0,.1),",
"               0 1px 3px rgba(0,0,0,.3),",
"               0 3px 5px rgba(0,0,0,.2),",
"               0 5px 10px rgba(0,0,0,.25),",
"               0 10px 10px rgba(0,0,0,.2),",
"               0 20px 20px rgba(0,0,0,.15);",
"}"
].join("\n");
if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever
 document.documentElement.appendChild(node);
 }
}})();
////////////////////////////////////////////////////////