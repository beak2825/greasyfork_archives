// ==UserScript==
// @id             okey-import-inventory@atis
// @name           IITC plugin: OKEY Import + Inventory
// @author         atis
// @category       Keys
// @version        2.1.1.3
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @description    Import of various formats for OKEY
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/421572/IITC%20plugin%3A%20OKEY%20Import%20%2B%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/421572/IITC%20plugin%3A%20OKEY%20Import%20%2B%20Inventory.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

///////////////////////////////////////////////////////////
// PLUGIN START

// use own namespace for plugin
window.plugin.okeyImport = function() {};

window.plugin.okeyImport.load_externals = function() {
/* JQuery-CSV */
RegExp.escape=function(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');};(function($){'use stric\t'
$.csv={defaults:{separator:',',delimiter:'"',headers:true},hooks:{castToScalar:function(value,state){var hasDot=/\./;if(isNaN(value)){return value;}else{if(hasDot.test(value)){return parseFloat(value);}else{var integer=parseInt(value);if(isNaN(integer)){return null;}else{return integer;}}}}},parsers:{parse:function(csv,options){var separator=options.separator;var delimiter=options.delimiter;if(!options.state.rowNum){options.state.rowNum=1;}
if(!options.state.colNum){options.state.colNum=1;}
var data=[];var entry=[];var state=0;var value=''
var exit=false;function endOfEntry(){state=0;value='';if(options.start&&options.state.rowNum<options.start){entry=[];options.state.rowNum++;options.state.colNum=1;return;}
if(options.onParseEntry===undefined){data.push(entry);}else{var hookVal=options.onParseEntry(entry,options.state);if(hookVal!==false){data.push(hookVal);}}
entry=[];if(options.end&&options.state.rowNum>=options.end){exit=true;}
options.state.rowNum++;options.state.colNum=1;}
function endOfValue(){if(options.onParseValue===undefined){entry.push(value);}else{var hook=options.onParseValue(value,options.state);if(hook!==false){entry.push(hook);}}
value='';state=0;options.state.colNum++;}
var escSeparator=RegExp.escape(separator);var escDelimiter=RegExp.escape(delimiter);var match=/(D|S|\n|\r|[^DS\r\n]+)/;var matchSrc=match.source;matchSrc=matchSrc.replace(/S/g,escSeparator);matchSrc=matchSrc.replace(/D/g,escDelimiter);match=RegExp(matchSrc,'gm');csv.replace(match,function(m0){if(exit){return;}
switch(state){case 0:if(m0===separator){value+='';endOfValue();break;}
if(m0===delimiter){state=1;break;}
if(m0==='\n'){endOfValue();endOfEntry();break;}
if(/^\r$/.test(m0)){break;}
value+=m0;state=3;break;case 1:if(m0===delimiter){state=2;break;}
value+=m0;state=1;break;case 2:if(m0===delimiter){value+=m0;state=1;break;}
if(m0===separator){endOfValue();break;}
if(m0==='\n'){endOfValue();endOfEntry();break;}
if(/^\r$/.test(m0)){break;}
throw new Error('CSVDataError: Illegal State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');case 3:if(m0===separator){endOfValue();break;}
if(m0==='\n'){endOfValue();endOfEntry();break;}
if(/^\r$/.test(m0)){break;}
if(m0===delimiter){throw new Error('CSVDataError: Illegal Quote [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}
throw new Error('CSVDataError: Illegal Data [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');default:throw new Error('CSVDataError: Unknown State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}});if(entry.length!==0){endOfValue();endOfEntry();}
return data;},splitLines:function(csv,options){var separator=options.separator;var delimiter=options.delimiter;if(!options.state.rowNum){options.state.rowNum=1;}
var entries=[];var state=0;var entry='';var exit=false;function endOfLine(){state=0;if(options.start&&options.state.rowNum<options.start){entry='';options.state.rowNum++;return;}
if(options.onParseEntry===undefined){entries.push(entry);}else{var hookVal=options.onParseEntry(entry,options.state);if(hookVal!==false){entries.push(hookVal);}}
entry='';if(options.end&&options.state.rowNum>=options.end){exit=true;}
options.state.rowNum++;}
var escSeparator=RegExp.escape(separator);var escDelimiter=RegExp.escape(delimiter);var match=/(D|S|\n|\r|[^DS\r\n]+)/;var matchSrc=match.source;matchSrc=matchSrc.replace(/S/g,escSeparator);matchSrc=matchSrc.replace(/D/g,escDelimiter);match=RegExp(matchSrc,'gm');csv.replace(match,function(m0){if(exit){return;}
switch(state){case 0:if(m0===separator){entry+=m0;state=0;break;}
if(m0===delimiter){entry+=m0;state=1;break;}
if(m0==='\n'){endOfLine();break;}
if(/^\r$/.test(m0)){break;}
entry+=m0;state=3;break;case 1:if(m0===delimiter){entry+=m0;state=2;break;}
entry+=m0;state=1;break;case 2:var prevChar=entry.substr(entry.length-1);if(m0===delimiter&&prevChar===delimiter){entry+=m0;state=1;break;}
if(m0===separator){entry+=m0;state=0;break;}
if(m0==='\n'){endOfLine();break;}
if(m0==='\r'){break;}
throw new Error('CSVDataError: Illegal state [Row:'+options.state.rowNum+']');case 3:if(m0===separator){entry+=m0;state=0;break;}
if(m0==='\n'){endOfLine();break;}
if(m0==='\r'){break;}
if(m0===delimiter){throw new Error('CSVDataError: Illegal quote [Row:'+options.state.rowNum+']');}
throw new Error('CSVDataError: Illegal state [Row:'+options.state.rowNum+']');default:throw new Error('CSVDataError: Unknown state [Row:'+options.state.rowNum+']');}});if(entry!==''){endOfLine();}
return entries;},parseEntry:function(csv,options){var separator=options.separator;var delimiter=options.delimiter;if(!options.state.rowNum){options.state.rowNum=1;}
if(!options.state.colNum){options.state.colNum=1;}
var entry=[];var state=0;var value='';function endOfValue(){if(options.onParseValue===undefined){entry.push(value);}else{var hook=options.onParseValue(value,options.state);if(hook!==false){entry.push(hook);}}
value='';state=0;options.state.colNum++;}
if(!options.match){var escSeparator=RegExp.escape(separator);var escDelimiter=RegExp.escape(delimiter);var match=/(D|S|\n|\r|[^DS\r\n]+)/;var matchSrc=match.source;matchSrc=matchSrc.replace(/S/g,escSeparator);matchSrc=matchSrc.replace(/D/g,escDelimiter);options.match=RegExp(matchSrc,'gm');}
csv.replace(options.match,function(m0){switch(state){case 0:if(m0===separator){value+='';endOfValue();break;}
if(m0===delimiter){state=1;break;}
if(m0==='\n'||m0==='\r'){break;}
value+=m0;state=3;break;case 1:if(m0===delimiter){state=2;break;}
value+=m0;state=1;break;case 2:if(m0===delimiter){value+=m0;state=1;break;}
if(m0===separator){endOfValue();break;}
if(m0==='\n'||m0==='\r'){break;}
throw new Error('CSVDataError: Illegal State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');case 3:if(m0===separator){endOfValue();break;}
if(m0==='\n'||m0==='\r'){break;}
if(m0===delimiter){throw new Error('CSVDataError: Illegal Quote [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}
throw new Error('CSVDataError: Illegal Data [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');default:throw new Error('CSVDataError: Unknown State [Row:'+options.state.rowNum+'][Col:'+options.state.colNum+']');}});endOfValue();return entry;}},toArray:function(csv,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;var state=(options.state!==undefined?options.state:{});var options={delimiter:config.delimiter,separator:config.separator,onParseEntry:options.onParseEntry,onParseValue:options.onParseValue,state:state}
var entry=$.csv.parsers.parseEntry(csv,options);if(!config.callback){return entry;}else{config.callback('',entry);}},toArrays:function(csv,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;var data=[];var options={delimiter:config.delimiter,separator:config.separator,onParseEntry:options.onParseEntry,onParseValue:options.onParseValue,start:options.start,end:options.end,state:{rowNum:1,colNum:1}};data=$.csv.parsers.parse(csv,options);if(!config.callback){return data;}else{config.callback('',data);}},toObjects:function(csv,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;config.headers='headers'in options?options.headers:$.csv.defaults.headers;options.start='start'in options?options.start:1;if(config.headers){options.start++;}
if(options.end&&config.headers){options.end++;}
var lines=[];var data=[];var options={delimiter:config.delimiter,separator:config.separator,onParseEntry:options.onParseEntry,onParseValue:options.onParseValue,start:options.start,end:options.end,state:{rowNum:1,colNum:1},match:false};var headerOptions={delimiter:config.delimiter,separator:config.separator,start:1,end:1,state:{rowNum:1,colNum:1}}
var headerLine=$.csv.parsers.splitLines(csv,headerOptions);var headers=$.csv.toArray(headerLine[0],options);var lines=$.csv.parsers.splitLines(csv,options);options.state.colNum=1;if(headers){options.state.rowNum=2;}else{options.state.rowNum=1;}
for(var i=0,len=lines.length;i<len;i++){var entry=$.csv.toArray(lines[i],options);var object={};for(var j in headers){object[headers[j]]=entry[j];}
data.push(object);options.state.rowNum++;}
if(!config.callback){return data;}else{config.callback('',data);}},fromArrays:function(arrays,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;config.escaper='escaper'in options?options.escaper:$.csv.defaults.escaper;config.experimental='experimental'in options?options.experimental:false;if(!config.experimental){throw new Error('not implemented');}
var output=[];for(i in arrays){output.push(arrays[i]);}
if(!config.callback){return output;}else{config.callback('',output);}},fromObjects2CSV:function(objects,options,callback){var options=(options!==undefined?options:{});var config={};config.callback=((callback!==undefined&&typeof(callback)==='function')?callback:false);config.separator='separator'in options?options.separator:$.csv.defaults.separator;config.delimiter='delimiter'in options?options.delimiter:$.csv.defaults.delimiter;config.experimental='experimental'in options?options.experimental:false;if(!config.experimental){throw new Error('not implemented');}
var output=[];for(i in objects){output.push(arrays[i]);}
if(!config.callback){return output;}else{config.callback('',output);}}};$.csvEntry2Array=$.csv.toArray;$.csv2Array=$.csv.toArrays;$.csv2Dictionary=$.csv.toObjects;})(jQuery);
/* Underscore.js */
 //
/* pako 0.2.7 nodeca/pako */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.pako=e()}}(function(){return function e(t,i,n){function a(o,s){if(!i[o]){if(!t[o]){var f="function"==typeof require&&require;if(!s&&f)return f(o,!0);if(r)return r(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var d=i[o]={exports:{}};t[o][0].call(d.exports,function(e){var i=t[o][1][e];return a(i?i:e)},d,d.exports,e,t,i,n)}return i[o].exports}for(var r="function"==typeof require&&require,o=0;o<n.length;o++)a(n[o]);return a}({1:[function(e,t,i){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;i.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var i=t.shift();if(i){if("object"!=typeof i)throw new TypeError(i+"must be non-object");for(var n in i)i.hasOwnProperty(n)&&(e[n]=i[n])}}return e},i.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var a={arraySet:function(e,t,i,n,a){if(t.subarray&&e.subarray)return void e.set(t.subarray(i,i+n),a);for(var r=0;n>r;r++)e[a+r]=t[i+r]},flattenChunks:function(e){var t,i,n,a,r,o;for(n=0,t=0,i=e.length;i>t;t++)n+=e[t].length;for(o=new Uint8Array(n),a=0,t=0,i=e.length;i>t;t++)r=e[t],o.set(r,a),a+=r.length;return o}},r={arraySet:function(e,t,i,n,a){for(var r=0;n>r;r++)e[a+r]=t[i+r]},flattenChunks:function(e){return[].concat.apply([],e)}};i.setTyped=function(e){e?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,a)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,r))},i.setTyped(n)},{}],2:[function(e,t,i){"use strict";function n(e,t){if(65537>t&&(e.subarray&&o||!e.subarray&&r))return String.fromCharCode.apply(null,a.shrinkBuf(e,t));for(var i="",n=0;t>n;n++)i+=String.fromCharCode(e[n]);return i}var a=e("./common"),r=!0,o=!0;try{String.fromCharCode.apply(null,[0])}catch(s){r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(s){o=!1}for(var f=new a.Buf8(256),l=0;256>l;l++)f[l]=l>=252?6:l>=248?5:l>=240?4:l>=224?3:l>=192?2:1;f[254]=f[254]=1,i.string2buf=function(e){var t,i,n,r,o,s=e.length,f=0;for(r=0;s>r;r++)i=e.charCodeAt(r),55296===(64512&i)&&s>r+1&&(n=e.charCodeAt(r+1),56320===(64512&n)&&(i=65536+(i-55296<<10)+(n-56320),r++)),f+=128>i?1:2048>i?2:65536>i?3:4;for(t=new a.Buf8(f),o=0,r=0;f>o;r++)i=e.charCodeAt(r),55296===(64512&i)&&s>r+1&&(n=e.charCodeAt(r+1),56320===(64512&n)&&(i=65536+(i-55296<<10)+(n-56320),r++)),128>i?t[o++]=i:2048>i?(t[o++]=192|i>>>6,t[o++]=128|63&i):65536>i?(t[o++]=224|i>>>12,t[o++]=128|i>>>6&63,t[o++]=128|63&i):(t[o++]=240|i>>>18,t[o++]=128|i>>>12&63,t[o++]=128|i>>>6&63,t[o++]=128|63&i);return t},i.buf2binstring=function(e){return n(e,e.length)},i.binstring2buf=function(e){for(var t=new a.Buf8(e.length),i=0,n=t.length;n>i;i++)t[i]=e.charCodeAt(i);return t},i.buf2string=function(e,t){var i,a,r,o,s=t||e.length,l=new Array(2*s);for(a=0,i=0;s>i;)if(r=e[i++],128>r)l[a++]=r;else if(o=f[r],o>4)l[a++]=65533,i+=o-1;else{for(r&=2===o?31:3===o?15:7;o>1&&s>i;)r=r<<6|63&e[i++],o--;o>1?l[a++]=65533:65536>r?l[a++]=r:(r-=65536,l[a++]=55296|r>>10&1023,l[a++]=56320|1023&r)}return n(l,a)},i.utf8border=function(e,t){var i;for(t=t||e.length,t>e.length&&(t=e.length),i=t-1;i>=0&&128===(192&e[i]);)i--;return 0>i?t:0===i?t:i+f[e[i]]>t?i:t}},{"./common":1}],3:[function(e,t,i){"use strict";function n(e,t,i,n){for(var a=65535&e|0,r=e>>>16&65535|0,o=0;0!==i;){o=i>2e3?2e3:i,i-=o;do a=a+t[n++]|0,r=r+a|0;while(--o);a%=65521,r%=65521}return a|r<<16|0}t.exports=n},{}],4:[function(e,t,i){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],5:[function(e,t,i){"use strict";function n(){for(var e,t=[],i=0;256>i;i++){e=i;for(var n=0;8>n;n++)e=1&e?3988292384^e>>>1:e>>>1;t[i]=e}return t}function a(e,t,i,n){var a=r,o=n+i;e=-1^e;for(var s=n;o>s;s++)e=e>>>8^a[255&(e^t[s])];return-1^e}var r=n();t.exports=a},{}],6:[function(e,t,i){"use strict";function n(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}t.exports=n},{}],7:[function(e,t,i){"use strict";var n=30,a=12;t.exports=function(e,t){var i,r,o,s,f,l,d,u,h,c,b,w,m,k,_,g,v,p,x,y,S,E,B,Z,A;i=e.state,r=e.next_in,Z=e.input,o=r+(e.avail_in-5),s=e.next_out,A=e.output,f=s-(t-e.avail_out),l=s+(e.avail_out-257),d=i.dmax,u=i.wsize,h=i.whave,c=i.wnext,b=i.window,w=i.hold,m=i.bits,k=i.lencode,_=i.distcode,g=(1<<i.lenbits)-1,v=(1<<i.distbits)-1;e:do{15>m&&(w+=Z[r++]<<m,m+=8,w+=Z[r++]<<m,m+=8),p=k[w&g];t:for(;;){if(x=p>>>24,w>>>=x,m-=x,x=p>>>16&255,0===x)A[s++]=65535&p;else{if(!(16&x)){if(0===(64&x)){p=k[(65535&p)+(w&(1<<x)-1)];continue t}if(32&x){i.mode=a;break e}e.msg="invalid literal/length code",i.mode=n;break e}y=65535&p,x&=15,x&&(x>m&&(w+=Z[r++]<<m,m+=8),y+=w&(1<<x)-1,w>>>=x,m-=x),15>m&&(w+=Z[r++]<<m,m+=8,w+=Z[r++]<<m,m+=8),p=_[w&v];i:for(;;){if(x=p>>>24,w>>>=x,m-=x,x=p>>>16&255,!(16&x)){if(0===(64&x)){p=_[(65535&p)+(w&(1<<x)-1)];continue i}e.msg="invalid distance code",i.mode=n;break e}if(S=65535&p,x&=15,x>m&&(w+=Z[r++]<<m,m+=8,x>m&&(w+=Z[r++]<<m,m+=8)),S+=w&(1<<x)-1,S>d){e.msg="invalid distance too far back",i.mode=n;break e}if(w>>>=x,m-=x,x=s-f,S>x){if(x=S-x,x>h&&i.sane){e.msg="invalid distance too far back",i.mode=n;break e}if(E=0,B=b,0===c){if(E+=u-x,y>x){y-=x;do A[s++]=b[E++];while(--x);E=s-S,B=A}}else if(x>c){if(E+=u+c-x,x-=c,y>x){y-=x;do A[s++]=b[E++];while(--x);if(E=0,y>c){x=c,y-=x;do A[s++]=b[E++];while(--x);E=s-S,B=A}}}else if(E+=c-x,y>x){y-=x;do A[s++]=b[E++];while(--x);E=s-S,B=A}for(;y>2;)A[s++]=B[E++],A[s++]=B[E++],A[s++]=B[E++],y-=3;y&&(A[s++]=B[E++],y>1&&(A[s++]=B[E++]))}else{E=s-S;do A[s++]=A[E++],A[s++]=A[E++],A[s++]=A[E++],y-=3;while(y>2);y&&(A[s++]=A[E++],y>1&&(A[s++]=A[E++]))}break}}break}}while(o>r&&l>s);y=m>>3,r-=y,m-=y<<3,w&=(1<<m)-1,e.next_in=r,e.next_out=s,e.avail_in=o>r?5+(o-r):5-(r-o),e.avail_out=l>s?257+(l-s):257-(s-l),i.hold=w,i.bits=m}},{}],8:[function(e,t,i){"use strict";function n(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function a(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new k.Buf16(320),this.work=new k.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function r(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=F,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new k.Buf32(be),t.distcode=t.distdyn=new k.Buf32(we),t.sane=1,t.back=-1,A):R}function o(e){var t;return e&&e.state?(t=e.state,t.wsize=0,t.whave=0,t.wnext=0,r(e)):R}function s(e,t){var i,n;return e&&e.state?(n=e.state,0>t?(i=0,t=-t):(i=(t>>4)+1,48>t&&(t&=15)),t&&(8>t||t>15)?R:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=i,n.wbits=t,o(e))):R}function f(e,t){var i,n;return e?(n=new a,e.state=n,n.window=null,i=s(e,t),i!==A&&(e.state=null),i):R}function l(e){return f(e,ke)}function d(e){if(_e){var t;for(w=new k.Buf32(512),m=new k.Buf32(32),t=0;144>t;)e.lens[t++]=8;for(;256>t;)e.lens[t++]=9;for(;280>t;)e.lens[t++]=7;for(;288>t;)e.lens[t++]=8;for(p(y,e.lens,0,288,w,0,e.work,{bits:9}),t=0;32>t;)e.lens[t++]=5;p(S,e.lens,0,32,m,0,e.work,{bits:5}),_e=!1}e.lencode=w,e.lenbits=9,e.distcode=m,e.distbits=5}function u(e,t,i,n){var a,r=e.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new k.Buf8(r.wsize)),n>=r.wsize?(k.arraySet(r.window,t,i-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(a=r.wsize-r.wnext,a>n&&(a=n),k.arraySet(r.window,t,i-n,a,r.wnext),n-=a,n?(k.arraySet(r.window,t,i-n,n,0),r.wnext=n,r.whave=r.wsize):(r.wnext+=a,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=a))),0}function h(e,t){var i,a,r,o,s,f,l,h,c,b,w,m,be,we,me,ke,_e,ge,ve,pe,xe,ye,Se,Ee,Be=0,Ze=new k.Buf8(4),Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return R;i=e.state,i.mode===G&&(i.mode=X),s=e.next_out,r=e.output,l=e.avail_out,o=e.next_in,a=e.input,f=e.avail_in,h=i.hold,c=i.bits,b=f,w=l,ye=A;e:for(;;)switch(i.mode){case F:if(0===i.wrap){i.mode=X;break}for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(2&i.wrap&&35615===h){i.check=0,Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0),h=0,c=0,i.mode=U;break}if(i.flags=0,i.head&&(i.head.done=!1),!(1&i.wrap)||(((255&h)<<8)+(h>>8))%31){e.msg="incorrect header check",i.mode=ue;break}if((15&h)!==T){e.msg="unknown compression method",i.mode=ue;break}if(h>>>=4,c-=4,xe=(15&h)+8,0===i.wbits)i.wbits=xe;else if(xe>i.wbits){e.msg="invalid window size",i.mode=ue;break}i.dmax=1<<xe,e.adler=i.check=1,i.mode=512&h?Y:G,h=0,c=0;break;case U:for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(i.flags=h,(255&i.flags)!==T){e.msg="unknown compression method",i.mode=ue;break}if(57344&i.flags){e.msg="unknown header flags set",i.mode=ue;break}i.head&&(i.head.text=h>>8&1),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0)),h=0,c=0,i.mode=D;case D:for(;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.head&&(i.head.time=h),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,Ze[2]=h>>>16&255,Ze[3]=h>>>24&255,i.check=g(i.check,Ze,4,0)),h=0,c=0,i.mode=L;case L:for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.head&&(i.head.xflags=255&h,i.head.os=h>>8),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0)),h=0,c=0,i.mode=H;case H:if(1024&i.flags){for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.length=h,i.head&&(i.head.extra_len=h),512&i.flags&&(Ze[0]=255&h,Ze[1]=h>>>8&255,i.check=g(i.check,Ze,2,0)),h=0,c=0}else i.head&&(i.head.extra=null);i.mode=j;case j:if(1024&i.flags&&(m=i.length,m>f&&(m=f),m&&(i.head&&(xe=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),k.arraySet(i.head.extra,a,o,m,xe)),512&i.flags&&(i.check=g(i.check,a,m,o)),f-=m,o+=m,i.length-=m),i.length))break e;i.length=0,i.mode=M;case M:if(2048&i.flags){if(0===f)break e;m=0;do xe=a[o+m++],i.head&&xe&&i.length<65536&&(i.head.name+=String.fromCharCode(xe));while(xe&&f>m);if(512&i.flags&&(i.check=g(i.check,a,m,o)),f-=m,o+=m,xe)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=K;case K:if(4096&i.flags){if(0===f)break e;m=0;do xe=a[o+m++],i.head&&xe&&i.length<65536&&(i.head.comment+=String.fromCharCode(xe));while(xe&&f>m);if(512&i.flags&&(i.check=g(i.check,a,m,o)),f-=m,o+=m,xe)break e}else i.head&&(i.head.comment=null);i.mode=P;case P:if(512&i.flags){for(;16>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(h!==(65535&i.check)){e.msg="header crc mismatch",i.mode=ue;break}h=0,c=0}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),e.adler=i.check=0,i.mode=G;break;case Y:for(;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}e.adler=i.check=n(h),h=0,c=0,i.mode=q;case q:if(0===i.havedict)return e.next_out=s,e.avail_out=l,e.next_in=o,e.avail_in=f,i.hold=h,i.bits=c,N;e.adler=i.check=1,i.mode=G;case G:if(t===B||t===Z)break e;case X:if(i.last){h>>>=7&c,c-=7&c,i.mode=fe;break}for(;3>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}switch(i.last=1&h,h>>>=1,c-=1,3&h){case 0:i.mode=W;break;case 1:if(d(i),i.mode=te,t===Z){h>>>=2,c-=2;break e}break;case 2:i.mode=V;break;case 3:e.msg="invalid block type",i.mode=ue}h>>>=2,c-=2;break;case W:for(h>>>=7&c,c-=7&c;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if((65535&h)!==(h>>>16^65535)){e.msg="invalid stored block lengths",i.mode=ue;break}if(i.length=65535&h,h=0,c=0,i.mode=J,t===Z)break e;case J:i.mode=Q;case Q:if(m=i.length){if(m>f&&(m=f),m>l&&(m=l),0===m)break e;k.arraySet(r,a,o,m,s),f-=m,o+=m,l-=m,s+=m,i.length-=m;break}i.mode=G;break;case V:for(;14>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(i.nlen=(31&h)+257,h>>>=5,c-=5,i.ndist=(31&h)+1,h>>>=5,c-=5,i.ncode=(15&h)+4,h>>>=4,c-=4,i.nlen>286||i.ndist>30){e.msg="too many length or distance symbols",i.mode=ue;break}i.have=0,i.mode=$;case $:for(;i.have<i.ncode;){for(;3>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.lens[Ae[i.have++]]=7&h,h>>>=3,c-=3}for(;i.have<19;)i.lens[Ae[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,Se={bits:i.lenbits},ye=p(x,i.lens,0,19,i.lencode,0,i.work,Se),i.lenbits=Se.bits,ye){e.msg="invalid code lengths set",i.mode=ue;break}i.have=0,i.mode=ee;case ee:for(;i.have<i.nlen+i.ndist;){for(;Be=i.lencode[h&(1<<i.lenbits)-1],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(16>_e)h>>>=me,c-=me,i.lens[i.have++]=_e;else{if(16===_e){for(Ee=me+2;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(h>>>=me,c-=me,0===i.have){e.msg="invalid bit length repeat",i.mode=ue;break}xe=i.lens[i.have-1],m=3+(3&h),h>>>=2,c-=2}else if(17===_e){for(Ee=me+3;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=me,c-=me,xe=0,m=3+(7&h),h>>>=3,c-=3}else{for(Ee=me+7;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=me,c-=me,xe=0,m=11+(127&h),h>>>=7,c-=7}if(i.have+m>i.nlen+i.ndist){e.msg="invalid bit length repeat",i.mode=ue;break}for(;m--;)i.lens[i.have++]=xe}}if(i.mode===ue)break;if(0===i.lens[256]){e.msg="invalid code -- missing end-of-block",i.mode=ue;break}if(i.lenbits=9,Se={bits:i.lenbits},ye=p(y,i.lens,0,i.nlen,i.lencode,0,i.work,Se),i.lenbits=Se.bits,ye){e.msg="invalid literal/lengths set",i.mode=ue;break}if(i.distbits=6,i.distcode=i.distdyn,Se={bits:i.distbits},ye=p(S,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,Se),i.distbits=Se.bits,ye){e.msg="invalid distances set",i.mode=ue;break}if(i.mode=te,t===Z)break e;case te:i.mode=ie;case ie:if(f>=6&&l>=258){e.next_out=s,e.avail_out=l,e.next_in=o,e.avail_in=f,i.hold=h,i.bits=c,v(e,w),s=e.next_out,r=e.output,l=e.avail_out,o=e.next_in,a=e.input,f=e.avail_in,h=i.hold,c=i.bits,i.mode===G&&(i.back=-1);break}for(i.back=0;Be=i.lencode[h&(1<<i.lenbits)-1],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(ke&&0===(240&ke)){for(ge=me,ve=ke,pe=_e;Be=i.lencode[pe+((h&(1<<ge+ve)-1)>>ge)],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=ge+me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=ge,c-=ge,i.back+=ge}if(h>>>=me,c-=me,i.back+=me,i.length=_e,0===ke){i.mode=se;break}if(32&ke){i.back=-1,i.mode=G;break}if(64&ke){e.msg="invalid literal/length code",i.mode=ue;break}i.extra=15&ke,i.mode=ne;case ne:if(i.extra){for(Ee=i.extra;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.length+=h&(1<<i.extra)-1,h>>>=i.extra,c-=i.extra,i.back+=i.extra}i.was=i.length,i.mode=ae;case ae:for(;Be=i.distcode[h&(1<<i.distbits)-1],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(0===(240&ke)){for(ge=me,ve=ke,pe=_e;Be=i.distcode[pe+((h&(1<<ge+ve)-1)>>ge)],me=Be>>>24,ke=Be>>>16&255,_e=65535&Be,!(c>=ge+me);){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}h>>>=ge,c-=ge,i.back+=ge}if(h>>>=me,c-=me,i.back+=me,64&ke){e.msg="invalid distance code",i.mode=ue;break}i.offset=_e,i.extra=15&ke,i.mode=re;case re:if(i.extra){for(Ee=i.extra;Ee>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}i.offset+=h&(1<<i.extra)-1,h>>>=i.extra,c-=i.extra,i.back+=i.extra}if(i.offset>i.dmax){e.msg="invalid distance too far back",i.mode=ue;break}i.mode=oe;case oe:if(0===l)break e;if(m=w-l,i.offset>m){if(m=i.offset-m,m>i.whave&&i.sane){e.msg="invalid distance too far back",i.mode=ue;break}m>i.wnext?(m-=i.wnext,be=i.wsize-m):be=i.wnext-m,m>i.length&&(m=i.length),we=i.window}else we=r,be=s-i.offset,m=i.length;m>l&&(m=l),l-=m,i.length-=m;do r[s++]=we[be++];while(--m);0===i.length&&(i.mode=ie);break;case se:if(0===l)break e;r[s++]=i.length,l--,i.mode=ie;break;case fe:if(i.wrap){for(;32>c;){if(0===f)break e;f--,h|=a[o++]<<c,c+=8}if(w-=l,e.total_out+=w,i.total+=w,w&&(e.adler=i.check=i.flags?g(i.check,r,w,s-w):_(i.check,r,w,s-w)),w=l,(i.flags?h:n(h))!==i.check){e.msg="incorrect data check",i.mode=ue;break}h=0,c=0}i.mode=le;case le:if(i.wrap&&i.flags){for(;32>c;){if(0===f)break e;f--,h+=a[o++]<<c,c+=8}if(h!==(4294967295&i.total)){e.msg="incorrect length check",i.mode=ue;break}h=0,c=0}i.mode=de;case de:ye=z;break e;case ue:ye=C;break e;case he:return O;case ce:default:return R}return e.next_out=s,e.avail_out=l,e.next_in=o,e.avail_in=f,i.hold=h,i.bits=c,(i.wsize||w!==e.avail_out&&i.mode<ue&&(i.mode<fe||t!==E))&&u(e,e.output,e.next_out,w-e.avail_out)?(i.mode=he,O):(b-=e.avail_in,w-=e.avail_out,e.total_in+=b,e.total_out+=w,i.total+=w,i.wrap&&w&&(e.adler=i.check=i.flags?g(i.check,r,w,e.next_out-w):_(i.check,r,w,e.next_out-w)),e.data_type=i.bits+(i.last?64:0)+(i.mode===G?128:0)+(i.mode===te||i.mode===J?256:0),(0===b&&0===w||t===E)&&ye===A&&(ye=I),ye)}function c(e){if(!e||!e.state)return R;var t=e.state;return t.window&&(t.window=null),e.state=null,A}function b(e,t){var i;return e&&e.state?(i=e.state,0===(2&i.wrap)?R:(i.head=t,t.done=!1,A)):R}var w,m,k=e("../utils/common"),_=e("./adler32"),g=e("./crc32"),v=e("./inffast"),p=e("./inftrees"),x=0,y=1,S=2,E=4,B=5,Z=6,A=0,z=1,N=2,R=-2,C=-3,O=-4,I=-5,T=8,F=1,U=2,D=3,L=4,H=5,j=6,M=7,K=8,P=9,Y=10,q=11,G=12,X=13,W=14,J=15,Q=16,V=17,$=18,ee=19,te=20,ie=21,ne=22,ae=23,re=24,oe=25,se=26,fe=27,le=28,de=29,ue=30,he=31,ce=32,be=852,we=592,me=15,ke=me,_e=!0;i.inflateReset=o,i.inflateReset2=s,i.inflateResetKeep=r,i.inflateInit=l,i.inflateInit2=f,i.inflate=h,i.inflateEnd=c,i.inflateGetHeader=b,i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(e,t,i){"use strict";var n=e("../utils/common"),a=15,r=852,o=592,s=0,f=1,l=2,d=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],u=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],h=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],c=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,i,b,w,m,k,_){var g,v,p,x,y,S,E,B,Z,A=_.bits,z=0,N=0,R=0,C=0,O=0,I=0,T=0,F=0,U=0,D=0,L=null,H=0,j=new n.Buf16(a+1),M=new n.Buf16(a+1),K=null,P=0;for(z=0;a>=z;z++)j[z]=0;for(N=0;b>N;N++)j[t[i+N]]++;for(O=A,C=a;C>=1&&0===j[C];C--);if(O>C&&(O=C),0===C)return w[m++]=20971520,w[m++]=20971520,_.bits=1,0;for(R=1;C>R&&0===j[R];R++);for(R>O&&(O=R),F=1,z=1;a>=z;z++)if(F<<=1,F-=j[z],0>F)return-1;if(F>0&&(e===s||1!==C))return-1;for(M[1]=0,z=1;a>z;z++)M[z+1]=M[z]+j[z];for(N=0;b>N;N++)0!==t[i+N]&&(k[M[t[i+N]]++]=N);if(e===s?(L=K=k,S=19):e===f?(L=d,H-=257,K=u,P-=257,S=256):(L=h,K=c,S=-1),D=0,N=0,z=R,y=m,I=O,T=0,p=-1,U=1<<O,x=U-1,e===f&&U>r||e===l&&U>o)return 1;for(var Y=0;;){Y++,E=z-T,k[N]<S?(B=0,Z=k[N]):k[N]>S?(B=K[P+k[N]],Z=L[H+k[N]]):(B=96,Z=0),g=1<<z-T,v=1<<I,R=v;do v-=g,w[y+(D>>T)+v]=E<<24|B<<16|Z|0;while(0!==v);for(g=1<<z-1;D&g;)g>>=1;if(0!==g?(D&=g-1,D+=g):D=0,N++,0===--j[z]){if(z===C)break;z=t[i+k[N]]}if(z>O&&(D&x)!==p){for(0===T&&(T=O),y+=R,I=z-T,F=1<<I;C>I+T&&(F-=j[I+T],!(0>=F));)I++,F<<=1;if(U+=1<<I,e===f&&U>r||e===l&&U>o)return 1;p=D&x,w[p]=O<<24|I<<16|y-m|0}}return 0!==D&&(w[y+D]=z-T<<24|64<<16|0),_.bits=O,0}},{"../utils/common":1}],10:[function(e,t,i){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],11:[function(e,t,i){"use strict";function n(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}t.exports=n},{}],"/lib/inflate.js":[function(e,t,i){"use strict";function n(e,t){var i=new c(t);if(i.push(e,!0),i.err)throw i.msg;return i.result}function a(e,t){return t=t||{},t.raw=!0,n(e,t)}var r=e("./zlib/inflate.js"),o=e("./utils/common"),s=e("./utils/strings"),f=e("./zlib/constants"),l=e("./zlib/messages"),d=e("./zlib/zstream"),u=e("./zlib/gzheader"),h=Object.prototype.toString,c=function(e){this.options=o.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0===(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var i=r.inflateInit2(this.strm,t.windowBits);if(i!==f.Z_OK)throw new Error(l[i]);this.header=new u,r.inflateGetHeader(this.strm,this.header)};c.prototype.push=function(e,t){var i,n,a,l,d,u=this.strm,c=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:t===!0?f.Z_FINISH:f.Z_NO_FLUSH,"string"==typeof e?u.input=s.binstring2buf(e):"[object ArrayBuffer]"===h.call(e)?u.input=new Uint8Array(e):u.input=e,u.next_in=0,u.avail_in=u.input.length;do{if(0===u.avail_out&&(u.output=new o.Buf8(c),u.next_out=0,u.avail_out=c),i=r.inflate(u,f.Z_NO_FLUSH),i!==f.Z_STREAM_END&&i!==f.Z_OK)return this.onEnd(i),this.ended=!0,!1;u.next_out&&(0===u.avail_out||i===f.Z_STREAM_END||0===u.avail_in&&(n===f.Z_FINISH||n===f.Z_SYNC_FLUSH))&&("string"===this.options.to?(a=s.utf8border(u.output,u.next_out),l=u.next_out-a,d=s.buf2string(u.output,a),u.next_out=l,u.avail_out=c-l,l&&o.arraySet(u.output,u.output,a,l,0),this.onData(d)):this.onData(o.shrinkBuf(u.output,u.next_out)))}while(u.avail_in>0&&i!==f.Z_STREAM_END);return i===f.Z_STREAM_END&&(n=f.Z_FINISH),n===f.Z_FINISH?(i=r.inflateEnd(this.strm),this.onEnd(i),this.ended=!0,i===f.Z_OK):n===f.Z_SYNC_FLUSH?(this.onEnd(f.Z_OK),u.avail_out=0,!0):!0},c.prototype.onData=function(e){this.chunks.push(e)},c.prototype.onEnd=function(e){e===f.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},i.Inflate=c,i.inflate=n,i.inflateRaw=a,i.ungzip=n},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate.js":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")});
};

window.plugin.okeyImport.goodData = {};
window.plugin.okeyImport.addData = {};
window.plugin.okeyImport.addKeychainId = {};
window.plugin.okeyImport.addCount = 0;
window.plugin.okeyImport.add_current = 0;
window.plugin.okeyImport.portalClicked = {};
window.plugin.okeyImport.main_menu = function(id) {
	if(!window.plugin.okey.tokenv2) {
		window.plugin.okey.login();
	} else if (!window.plugin.okey.user || !window.plugin.okey.user.role < 0) {
		window.plugin.okey.login_invalid();
	} else {
		window.plugin.okeyImport.show_import();
	}
};

window.plugin.okeyImport.optAlert = function(message, timeout) {
	if (typeof(timeout)=='undefined') timeout = 4500;
    $('.ui-dialog-buttonset').prepend('<p class="okey-import-alert" style="float:left;margin-top:4px;color:red;">'+message+'</p>');
    if (timeout) $('.okey-import-alert').delay(timeout).fadeOut();
};

window.plugin.okeyImport.csv_keys = function(arr, keychain, next_count, prev_key) {
	var separators = [",",";","\t"];
	var delimiters = ['"', "'"];
	var data;
	var goodData = [];
	var success = {};
	var success_cnt = 0;
	var max_success = 0;
	var bestData;

	$.each(separators, function(k, sep) {
		$.each(delimiters, function(kk, del) {
			success_cnt = 0;
			try {
				data = $.csv.toObjects(arr, {'separator': sep, 'delimiter': del});

				$.each(data, function(kkk, vvv) {
					row = {'count': 1};
					if (vvv.name) row.name = vvv.name;
					if (vvv.title) row.name = vvv.title;
					if (vvv.portal) row.name = vvv.portal;

					if (vvv.guid && vvv.guid.match(/^[0-9a-f]{32}.[0-9a-f]{2}$/)) row.guid = vvv.guid;
					if (vvv.Guid && vvv.Guid.match(/^[0-9a-f]{32}.[0-9a-f]{2}$/)) row.guid = vvv.Guid;
					if (vvv.GUID && vvv.GUID.match(/^[0-9a-f]{32}.[0-9a-f]{2}$/)) row.guid = vvv.GUID;

					if (vvv.lat && vvv.lat.match(/^-*[0-9]+.[0-9]*$/)) row.lat = vvv.lat;
					if (vvv.lattitude && vvv.lattitude.match(/^-*[0-9]+.[0-9]*$/)) row.lat= vvv.lattitude;

					if (vvv.lng && vvv.lng.match(/^-?[0-9]+.[0-9]*$/)) row.lng = vvv.lng;
					if (vvv.lon && vvv.lon.match(/^-?[0-9]+.[0-9]*$/)) row.lng = vvv.lon;
					if (vvv.longitude && vvv.longitude.match(/^-?[0-9]+.[0-9]*$/)) row.lng= vvv.longitude;

					if (vvv.url || vvv.intel || vvv.link) {
						var d;
						if (vvv.url) d=vvv.url.match(/ingress.com.*pll=([0-9\.\-]*),([0-9\.\-]*)/);
						if (vvv.intel) d=vvv.intel.match(/ingress.com.*pll=([0-9\.\-]*),([0-9\.\-]*)/);
						if (vvv.link) d=vvv.link.match(/ingress.com.*pll=([0-9\.\-]*),([0-9\.\-]*)/);
						if (d) {
							row.lat=d[1];
							row.lng=d[2];
						}
					}

					if (vvv.count && vvv.count.match(/^[0-9]+$/)) row.count = vvv.count;
					if (vvv.keys && vvv.keys.match(/^[0-9]+$/)) row.count = vvv.keys;

					if (vvv.keychain && vvv.keychain.match(/^[0-9a-zA-Z \-+_]+$/)) row.capsule = vvv.keychain;
					if (vvv.id_keychain && vvv.id_keychain.match(/^[0-9a-zA-Z \-+_]+$/)) row.capsule = vvv.id_keychain;
					if (vvv.group && vvv.group.match(/^[0-9a-zA-Z \-+_]+$/)) row.capsule = vvv.group;
					if (vvv.capsule && vvv.capsule.match(/^[0-9a-zA-Z \-+_]+$/)) row.capsule = vvv.capsule;

//					console.info(row);
					if (!row.name || !row.lat || !row.lng) {
						parse_fail = true;
					} else {
						if (!row.capsule) {
							row.capsule = keychain;
						}
						if (!goodData[k]) goodData[k] = {};
						if (!goodData[k][kk]) {
							goodData[k][kk] = {};
							goodData[k][kk].length = 1;
						} else {
							goodData[k][kk].length++;
						}
						if (!goodData[k][kk][row.capsule]) {
							goodData[k][kk][row.capsule] = {};
							goodData[k][kk][row.capsule].length = 1;
							if (row.capsule) goodData[k][kk][row.capsule].capsule = row.capsule;
						} else {
							goodData[k][kk][row.capsule].length++;
						}
						var uniqueid=row.guid;
						if (!uniqueid) uniqueid=parseFloat(goodData[k][kk][row.capsule].length+Math.random());
						console.info(uniqueid);
						row.uniqueid=uniqueid;
						goodData[k][kk][row.capsule][uniqueid] = row;
						console.info(goodData);
						success_cnt++;
						goodData[k][kk][row.capsule][uniqueid].length = success_cnt;
					}
				});

			} catch(e) {
				console.info('Failed CSV'+e);
			}
			if (!success[k]) success[k] = {};
			if (!success[k][kk]) success[k][kk] = {};
			success[k][kk] = success_cnt;
			if (success_cnt>max_success) max_success = success_cnt;
		});
	});

	$.each(success, function(k, v) {
		$.each(v, function(kk, vv) {
			//if (bestData) return;
			if (vv==max_success) {
				bestData = goodData[k][kk];
				return;
			}
		});
	});

	return bestData;
};

window.plugin.okeyImport.show_import = function() {
	var example = '';
	var html;
	try {
		if (window.plugin.okeyImportTests.tests && window.plugin.okeyImportTests.default_test) example=window.plugin.okeyImportTests.tests[window.plugin.okeyImportTests.default_test];
	} catch (e) {
		// No tests
	}
	try {
		html = '<div id="okey-import-text">'+window.plugin.okeyImportTests.html+'<textarea rows="10" cols="80" id="okey-import-data">'+example+'</textarea></div>' +
			'<div id="okey-import-file"><input type="file" id="okey-import-upload" /> <button id="okey-import-read-inventory">Read inventory</button> </div>';
 	} catch (e) {
 		// No tests
		html = '<div id="okey-import-text"><textarea rows="10" cols="80" id="okey-import-data"></textarea></div>' +
			'<div id="okey-import-file"><input type="file" id="okey-import-upload" /> <button id="okey-import-read-inventory">Read inventory</button> </div>';
 	}

	window.plugin.okeyImport.dialog_parse = dialog({
		html: html,
		id: 'plugin-okey-import',
		title: 'OKEY Import',
		width: '724px',
		modal: false,
//		closeCallback: window.plugin.okeyImport.run_cancel,
		buttons: {
			'PROCESS':  window.plugin.okeyImport.run_parse,
//			'PARSE':  window.plugin.okeyImport.run_parse,
//			'IMPORT': window.plugin.okeyImport.run_import,
//			'PARSE':  function() { window.plugin.okeyImport.run_parse()},
//			'IMPORT': function() { window.plugin.okeyImport.run_import()},
		}
	});

	$("#okey-import-upload").change(function() {
		//var file = fileInput.files[0];
		var binreader = new FileReader();
		var filename = this.files[0];
		binreader.onload = function (e) {
			var char1 = binreader.result.charCodeAt(0);
			var char2 = binreader.result.charCodeAt(1);
			console.info(char1, char2);
			var result = binreader.result;
			if (char1==0x1F && char2==0x8B) {
				result = pako.inflate(result, {'to': 'string'});
				$('#okey-import-data').val(result);
			} else {
				var txtreader = new FileReader();
				txtreader.onload = function (e) {
					$('#okey-import-data').val(txtreader.result);
				};
				txtreader.readAsText(filename);
			}
		};
		binreader.readAsBinaryString(filename);
		//reader.readAsText(filename);
	});

    $("#okey-import-read-inventory").click(function() {
        postAjax("getInventory", {
            lastQueryTimestamp: 0
        }, function (data) {
            if (!data || !data.result || !data.result.length) {
                alert("Import required inventory access, granted by C.O.R.E. subscription");
                return;
            }
            $('#okey-import-data').val(JSON.stringify(data));

        }, function() {
            alert("Import error. Do you have C.O.R.E. subscription?");
            return;
        });
    });

};

window.plugin.okeyImport.run_cancel = function() {
	console.info('[OKEY Import] - Removing parse dialogue');
	try {
		if (window.plugin.okeyImport.dialog_parse && typeof(window.plugin.okeyImport.dialog_parse.dialog)=='function') {
			window.plugin.okeyImport.dialog_parse.dialog('destroy');
			window.plugin.okeyImport.dialog_parse = false;
		}
	} catch(e) {
	}
	try {
		if (window.plugin.okeyImport.dialog_select && typeof(window.plugin.okeyImport.dialog_select.dialog)=='function') {
			window.plugin.okeyImport.dialog_select.dialog('destroy');
			window.plugin.okeyImport.dialog_select = false;
		}
	} catch(e) {
	}
};

window.plugin.okeyImport.run_parse = function() {
	var data, goodData, message;
	data = $('#okey-import-data').val();
	console.info(data);
	try {
		data = JSON.parse(data);
		console.info(data);
		goodData = window.plugin.okeyImport.json_keys(data, 'Ungrouped');
		console.info(goodData);
		if (!goodData) {
			message = 'No keys found in JSON';
		}
	} catch(e) {
		message = 'Not valid JSON: '+e;
		console.warn('OKEY Import: failed to import JSON data: ' + e);
	}
	if (!goodData) goodData = {};

	if (!goodData.length) {
		try {
			goodData = window.plugin.okeyImport.csv_keys(data, 'Ungrouped');
		} catch(e) {
			try {
				goodData = window.plugin.okeyImport.csv_keys("name,lat,lng,count,capsule,address\n"+data, 'Ungrouped');
			} catch(e) {
				message += ' | Not valid CSV: '+e;
			}
		}
		if (!goodData) {
			message = 'No keys found in CSV';
		}
	}
	if (!goodData) goodData = {};
	console.info('JSON+CSV Good data: ');
	console.info(goodData);

	if (goodData.length) {
		window.plugin.okeyImport.run_cancel();
		window.plugin.okeyImport.goodData = goodData;
		window.plugin.okeyImport.show_select(goodData);
	} else {
		window.plugin.okeyImport.optAlert(message);
	}
};

window.plugin.okeyImport.updateKeychainSelects = function() {
	console.info('Updating keychain selects...');
	$('.okey_import_keychain_select').each(function(k, dropdown) {
		console.info(dropdown);
		var num=dropdown.attributes.getNamedItem('num').value;
		var selected = $('[num="'+num+'"].okey_import_keychain_name').val();
		var select = window.plugin.okeyImport.getKeychainSelects(selected);
		dropdown.innerHTML = select;
	});
};

window.plugin.okeyImport.getKeychainSelects = function(selected_text) {
	var select = '';
	var default_found = false;
	$.each(window.plugin.okey.keychains.keychains, function(index, keychain) {
		select += '<option value="'+keychain.id+'"';
		if (selected_text==keychain.label) {
			select += ' selected';
			default_found = true;
		}
		select +='>'+keychain.label+'</option>';
	});

	if (!default_found) {
		select = '<option selected disabled>&gt; select keychain</option>'+select;
	} else {
		select = '<option disabled>&gt; select keychain</option>'+select;
	}

	return select;
};

window.plugin.okeyImport.show_select = function(goodData) {
	console.info('[OKEY Import] - Showing import dialogue');
	var html = '<div id="okey-import-select" class="okey_overflow">';
	var i, j;

	html +=
		'<table class="okey_table_border tablesorter" style="width:100%">' +
			'<thead>' +
				'<tr>' +
					'<th style="width:60%">' +
						'Name' +
					'</th>' +
					'<th style="width:5%">' +
						'Keys' +
					'</th>' +
					'<th style="width:45%">' +
						'Keychain' +
					'</th>' +
				'</tr>' +
			'</thead>' +
			'<tbody>';
	i = 0;


	$.each(goodData, function(chain, val) {
		if (typeof(val)!='object') return;
		i++;
		j=0;

		if (typeof(val.capsule_id)=='undefined') val.capsule_id='';
		var lngth = val.length;
		console.info(val);
		console.info(val.length);
		var select = window.plugin.okeyImport.getKeychainSelects(chain);
		window.plugin.okeyImport.portalClicked = {};
		html +=
			'<tr>' +
				'<td class="okey_td_left">'+
					'<input type="checkbox" id="chain_'+i+'" group="keychain" onclick="javascript: window.plugin.okeyImport.checkbox_tree(event, \'chain_'+i+'\');">'+
					'<input type="edit" class="okey_import_keychain_name" id="create_chain_'+i+'" value="'+chain+'"  num="'+i+'"/>&nbsp;<input type="button" value="Create KeyChain" onclick="javascript: window.plugin.okeyImport.createKeychain(event, '+i+', \''+val.capsule_id+'\');"/></td>' +
				'<td>'+val.capsule_id+'</td>' +
				'<td rowspan="'+(lngth+1)+'">' +
				'<select class="okey_import_keychain_select" id="okey_import_keychain_'+i+'" num="'+i+'">' + select + '</select><br/>' +
				'<input disabled type="button" id="okey_import_upate_'+i+'" value="Update counts" onclick="javascript: window.plugin.okeyImport.addKeys(event, '+i+',\''+chain+'\', \'update\');"/><br/>' +
				'<input type="button" id="okey_import_add_'+i+'" value="Add/Update" onclick="javascript: window.plugin.okeyImport.addKeys(event, '+i+',\''+chain+'\', \'add\');"/><br/>' +
				'<input disabled type="button" id="okey_import_replace_'+i+'" value="Replace" onclick="javascript: window.plugin.okeyImport.addKeys(event, '+i+',\''+chain+'\', \'replace\');"/><br/>' +
				'</td>' +
			'</tr>';
		console.info(val);
		console.info(val.length);

		$.each(val, function(guid, key) {
			if (typeof(key)!='object') return;
			j++;
			html +=
			'<tr>' +
				window.plugin.okeyImport.keyHtml(key, i, j, chain, guid) +
				'<td class="okey_td_center"><input type="edit" id="key_count_'+i+'_'+j+'" value="'+key.count+'" size="2" maxlength="4"></td>' +
			'</tr>';
		});
	});

	html += '</tbody></table>';

	html += '</div>';

	window.plugin.okeyImport.dialog_select = dialog({
		html: html,
		id: 'plugin-okey-import',
		title: 'OKEY Import',
		width: '724px',
		modal: false,
		closeCallback: window.plugin.okeyImport.run_import,
		buttons: {
			'CANCEL':  window.plugin.okeyImport.run_cancel,
		}
	});
	console.info('[OKEY Import] - Import dialogue shown');
};

window.plugin.okeyImport.keyHtml = function(key, i, j, chain, guid) {
	console.info(key);
	var html = '<td class="okey_td_left" id="portal_'+i+'_'+j+'">&nbsp;&nbsp;&nbsp;<input type="checkbox" id="chain_'+i+'_'+j+'" group="chain_'+i+'" num="'+j+'" uniqueid="'+key.uniqueid+'" onclick="javascript: window.plugin.okeyImport.checkbox_toggle(event);" guid="'+key.guid+'">'+
		'<a onclick="window.plugin.okeyImport.selectKeyPortal('+key.lat+','+key.lng+', '+i+','+j+',\''+chain+'\',\''+guid+'\');" customid="'+guid+'">'+key.name+'</a>';
	if (!key.guid || !key.name) {
		html += '<div align="right">[Missing data, click to load]</div>';
	}
	html += '</td>';
	return html;
};

window.plugin.okeyImport.selectKeyPortal = function(lat, lng, i, j, chain, guid) {
	window.plugin.okeyImport.portalClicked.i=i;
	window.plugin.okeyImport.portalClicked.j=j;
	window.plugin.okeyImport.portalClicked.chain = chain;
	window.plugin.okeyImport.portalClicked.guid = guid;
	window.selectPortalByLatLng(lat, lng);
};

window.plugin.okeyImport.portalSelected = function(data) {
	var td, key;
	console.info(window.plugin.okeyImport.portalClicked);
	if (window.plugin.okeyImport.portalClicked.i && window.plugin.okeyImport.portalClicked.j && data.portalData) {
		td = $('#portal_'+window.plugin.okeyImport.portalClicked.i+'_'+window.plugin.okeyImport.portalClicked.j);
		console.info(td);
		console.info(data);
		//key.name = '!!!!!';
		key = window.plugin.okeyImport.goodData[window.plugin.okeyImport.portalClicked.chain][window.plugin.okeyImport.portalClicked.guid];
		if (data.portalData.title) {
			key.name = data.portalData.title;
		}
		if (data.portalData.latE6) {
			key.lat = data.portalData.latE6/1000000;
		}
		if (data.portalData.lngE6) {
			key.lng = data.portalData.lngE6/1000000;
		}
		if (data.portalData.guid) {
			key.guid = data.portalData.guid;
		}
		if (data.guid) {
			key.guid = data.guid;
		}
		window.plugin.okeyImport.goodData[window.plugin.okeyImport.portalClicked.chain][window.plugin.okeyImport.portalClicked.guid] = key;
		console.info(key);
		td.replaceWith(window.plugin.okeyImport.keyHtml(key, window.plugin.okeyImport.portalClicked.i, window.plugin.okeyImport.portalClicked.j, window.plugin.okeyImport.portalClicked.chain, window.plugin.okeyImport.portalClicked.guid));
	}
	console.info(data);
};

window.plugin.okeyImport.createKeychain = function(event, chain_id, capsule_id) {
	var name = $('#create_chain_'+chain_id).val();
	window.plugin.okey.server_post_keychain(name, capsule_id, window.plugin.okeyImport.updateKeychainSelects);
};


window.plugin.okeyImport.addKeys = function(event, id, groupid, mode) {
	var add_data = [];
	var add_cnt = 0;
	var do_restore = false;
	var data = {};

	$('[group="chain_'+id+'"]:checked').each(function(k, checkbox) {
		if (checkbox.attributes.getNamedItem("guid")) {
			console.info(checkbox);
			console.info(groupid);
			console.info(checkbox.attributes.getNamedItem("guid").value);

			data = window.plugin.okeyImport.goodData[groupid][checkbox.attributes.getNamedItem("guid").value];
			console.info(data);
		}
		if (checkbox.attributes.getNamedItem("uniqueid") && checkbox.attributes.getNamedItem("uniqueid").value!="undefined") {
			console.info(checkbox);
			console.info(groupid);
			console.info(checkbox.attributes.getNamedItem("uniqueid").value);

			data = window.plugin.okeyImport.goodData[groupid][checkbox.attributes.getNamedItem("uniqueid").value];
			console.info(data);
		}
		if (checkbox.attributes.getNamedItem("num")) {
			var key_count = $('#key_count_'+id+'_'+checkbox.attributes.getNamedItem("num").value).val();
			data.count = key_count;
		}
		add_data.push(data);
		add_cnt++;
	});

	if (add_cnt==0) {
		alert('No keys selected');
		return false;
	}

	//	var keychain_id=$('#okey_import_keychain_'+id).val();
	window.plugin.okeyImport.addData = add_data;
	window.plugin.okeyImport.addCount = add_cnt;
	window.plugin.okeyImport.add_current = 0;
	window.plugin.okeyImport.addKeychainId = $('#okey_import_keychain_'+id).val();
	console.info(window.plugin.okeyImport.addKeychainId);
	if (!window.plugin.okeyImport.addKeychainId) {
		alert ('No keychain selected');
		return false;
	}

	console.info('Adding keys to keychain #'+window.plugin.okeyImport.addKeychainId);
	console.info(window.plugin.okeyImport.addData);

	if (window.plugin.okey.preferences && !window.plugin.okey.preferences[window.plugin.okey.user.ign].show_errors_only) {
		window.plugin.okey.preferences[window.plugin.okey.user.ign].show_errors_only = true;
		do_restore = true;
	}

	window.plugin.okeyImport.optAlert('Importing, please wait...', 0);
	window.plugin.okeyImport.addKeySingle();
};

window.plugin.okeyImport.addKeySingle = function(response) {
	window.plugin.okeyImport.add_current++;

	var key = window.plugin.okeyImport.addData.shift();
	if (typeof(key)=='undefined') {
		$('.okey-import-alert')[0].style.display='inline';
		$('.okey-import-alert')[0].innerHTML = 'Importing done';
		$('.okey-import-alert').delay(5000).fadeOut();
		return;
	}
	console.info(window.plugin.okeyImport.addData);
	$('.okey-import-alert')[0].style.display='inline';
	$('.okey-import-alert')[0].innerHTML = 'Importing key '+window.plugin.okeyImport.add_current+'/'+window.plugin.okeyImport.addCount;
	window.plugin.okey.server_post_keys(window.plugin.okeyImport.addKeychainId, key.count, key.guid, key.name, key.lat, key.lng, window.plugin.okeyImport.addKeySingle);
}

window.plugin.okeyImport.restorePopups = function(msg) {
	window.plugin.okey.preferences[window.plugin.okey.user.ign].show_errors_only = false;
	alert(msg);
};


window.plugin.okeyImport.checkbox_previous = false;
window.plugin.okeyImport.checkbox_previous_group = false;
window.plugin.okeyImport.checkbox_toggle = function(event) {
	if (!event) event = window.event;
	var set_checked = 0;
	var a = false, b = false;
	var checkbox_status_to_set, inputs, checkbox_group, i, current_group_to_check;
	if (window.plugin.okeyImport.checkbox_previous) {
		a = event.target.checked;
		if (document.getElementById(window.plugin.okeyImport.checkbox_previous)) b = document.getElementById(window.plugin.okeyImport.checkbox_previous).checked;
	}
	if (event.shiftKey==1 && window.plugin.okeyImport.checkbox_previous && a==b)  {
		checkbox_status_to_set = event.target.checked;
		inputs = document.getElementsByTagName('input');
		checkbox_group = '';
		if (event.target.attributes.getNamedItem("group")) checkbox_group =  event.target.attributes.getNamedItem("group").value;
		for (i in inputs) {
			if (typeof(inputs[i])=='function') continue;
			if (inputs[i].type!='checkbox') continue;
			if (inputs[i].disabled) continue;
			if (window.plugin.okeyImport.checkbox_previous == event.target.id) continue;
			if (checkbox_group != window.plugin.okeyImport.checkbox_previous_group) continue;
			current_group_to_check = '';
			if (inputs[i].attributes.getNamedItem("group")) current_group_to_check = inputs[i].attributes.getNamedItem("group").value;
			if (current_group_to_check != window.plugin.okeyImport.checkbox_previous_group) continue;
			if (set_checked == 1 || inputs[i].id == window.plugin.okeyImport.checkbox_previous) {
				inputs[i].checked = checkbox_status_to_set;
				if (inputs[i].id != window.plugin.okeyImport.checkbox_previous && inputs[i].id != event.target.id) {
					var fireOnThis = document.getElementById(inputs[i].id);
					var evObj = document.createEvent('HTMLEvents');
					evObj.initEvent( 'change', true, true );
					fireOnThis.dispatchEvent(evObj);
				}
			}
			if (inputs[i].id == window.plugin.okeyImport.checkbox_previous || inputs[i].id == event.target.id) {
				if (set_checked == 1) {
					break;
				} else {
					set_checked = 1;
				}
			}
		}
	}
	window.plugin.okeyImport.checkbox_previous = event.target.id;
	window.plugin.okeyImport.checkbox_previous_group = '';
	if (event.target.attributes.getNamedItem("group")) window.plugin.okeyImport.checkbox_previous_group = event.target.attributes.getNamedItem("group").value;
};

window.plugin.okeyImport.checkbox_tree = function(event, group) {
	if (!event) event = window.event;
	var i;
	var checkbox_status_to_set = event.target.checked;
	var inputs = document.getElementsByTagName('input');
	for (i in inputs) {
		if (typeof(inputs[i])=='function') continue;
		if (inputs[i].type!='checkbox') continue;
		if (inputs[i].disabled) continue;
		if (group) {
			if (!inputs[i].attributes.getNamedItem("group")) continue;
			if (inputs[i].attributes.getNamedItem("group").value!=group) continue;
		}

		inputs[i].checked = checkbox_status_to_set;
		var fireOnThis = document.getElementById(inputs[i].id);
		var evObj = document.createEvent('HTMLEvents');
		evObj.initEvent( 'change', true, true );
		fireOnThis.dispatchEvent(evObj);
	}
};

window.plugin.okeyImport.json_keys = function(arr, keychain, next_count, prev_key) {
	var result = {'length': 0};
	var foundKey;
	var tmp;
	var next_capsule = false;
	var capsule_id = false;
	if (!next_count) next_count=1;

	if (arr.exampleGameEntity && arr.itemGuids) {
		console.info(arr.itemGuids);
		console.info(arr.exampleGameEntity);
		next_count = arr.itemGuids.length;
		console.info('Next count: '+next_count+' keys');
	}

	$.each(arr, function(key, val) {
		if (key=="moniker" && val.differentiator) {
			next_capsule = 'Capsule '+val.differentiator;
			capsule_id = val.differentiator;
			return result;
		}
		if (val.bkmrk && val.label) {
			next_capsule = 'Capsule '+val.label;
		}
		if (val.cluster && val.codename) {
			next_capsule = 'Cluster '+val.cluster;
		}
		if (val.moniker && val.moniker.differentiator) {
			next_capsule = 'Capsule '+val.moniker.differentiator;
		}

		if (typeof(val)=='object') {
			if (next_capsule) {
				foundKey = window.plugin.okeyImport.json_keys(val, next_capsule, next_count, key);
			} else {
				foundKey = window.plugin.okeyImport.json_keys(val, keychain, next_count, key);
			}
			if (foundKey.length) {
				//console.info('Found '+foundKey.length+' keys in '+key+' adding to '+keychain);
				$.each(foundKey, function(chain,keys) {
					if (typeof(keys)!='object') return;
					if (!result[chain]) {
						result[chain] = keys;
						result.length++;
					} else {
						if (keys.length) {
							$.each(keys, function(guid, data) {
								if (result[chain][guid]) {
									result[chain][guid].count += data.count;
								} else {
									result[chain][guid] = data;
									result[chain].length++;
								}
							});
						}
					}
					if (capsule_id) {
						result[chain].capsule_id = capsule_id;
					}
				});
			}
		} else {
			if (key=='portalAddress') {
				result.address = val;
				result.length++;
			} else if (key=='portalTitle' || key=='label' || key=='name' || key=='nodeName') {
				result.name = val;
				result.length++;
			} else if (key=='portalLocation' || key=='latlng') {
				result.location = val;
				result.length++;
			} else if (key=='lat' || key=='latE6' || key=='portal1Lat') {
				result.lat = val;
				result.length++;
			} else if (key=='lng' || key=='lngE6' || key=='lon' || key=='lonE6' || key=='portal1Lng') {
				result.lng = val;
				result.length++;
			} else if (key=='portalGuid' || key=='guid' || key=='portal1Guid') {
				result.guid = val;
				result.length++;
			} else if (key=='keysFarmed' || key=='keysShared' || key=='count') {
				result.count = val;
				result.length++;
			} else if (key=='type' && val.match(/^(group[a-z]|main)$/g)) {
				keychain = val;
			}
		}
	});

	if (!result.guid && (arr.cluster || arr.codename)) {
		result.guid=prev_key;
	}

	if (!result.lat && !result.lng && result.location) {
		var latlng = result.location.split(',');
		result.lat = latlng[0];
		result.lng = latlng[1];
	}
	if (result.lat && result.lat.match(/^[0-9a-f]{8}$/g)) {
		result.lat = parseInt(result.lat, 16);
		if (result.lat > 0x80000000) result.lat = result.lat - 0x100000000;
		result.lat = result.lat/1000000
		result.location = '';
	}
	if (result.lng && result.lng.match(/^[0-9a-f]{8}$/g)) {
		result.lng = parseInt(result.lng, 16);
		if (result.lng > 0x80000000) result.lng = result.lng - 0x100000000;
		result.lng = result.lng/1000000
		result.location = '';
	}

	if (!result.location && result.lat && result.lng) {
		result.location=result.lat+','+result.lng;
	}
	if (result.guid && result.location) {
		// && result.name
//		if (!result.name) {
//			result.name = 'Unknown';
//			result.length++;
//		}
		tmp = {'length': 1};
		tmp[keychain] = {'length': 1};
		if (!result.count) {
			if (next_count) {
				result.count = next_count;
			} else {
				result.count = 1;
			}
			result.length++;
		}
		//console.info('Returning key: ',result);
		tmp[keychain][result.guid] = result;
		return tmp;
	} else if (result.length) {
		return result;
	} else {
		result = {'length': 0};
		return result;
	}
};

window.plugin.okeyImport.run_import = function() {

};



var setup = function() {
	$('#okey_toolbox_logged')
		.append('&nbsp;&nbsp; <a onclick="window.plugin.okeyImport.main_menu();" title="Import">Import</a>');
	console.log('[OKEY Import] - Loaded');
	// Load externals
	window.setTimeout(window.plugin.okeyImport.load_externals, 1000);

	window.addHook('portalSelected', function(data) {
		window.plugin.okeyImport.portalSelected(data);
	});
	window.addHook('portalDetailsUpdated', function(data) {
		window.plugin.okeyImport.portalSelected(data);
	});

	$('head')
		.append('<style>' + '.okey_table_border tr, .okey_table_border td {border:1px solid #20a8b1;}')
		.append('<style>' + '.okey_overflow {overflow: auto; max-height: 300px;"}')
	;

};

///////////////////////////////////////////////////////////
// PLUGIN END
setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
