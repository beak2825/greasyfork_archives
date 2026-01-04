// ==UserScript==
// @name         动漫之家解除屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除漫画屏蔽
// @match        *://manhua.dmzj.com/*
// @match        *://i.dmzj.com/subscribe
// @resource     elementPlusCss    https://unpkg.com/element-plus/dist/index.css
// @require      https://cdn.jsdelivr.net/npm/protobufjs@7.X.X/dist/protobuf.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/466729/%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%A7%A3%E9%99%A4%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466729/%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%A7%A3%E9%99%A4%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==


(async function() {
    GM_addStyle(GM_getResourceText('elementPlusCss'))
    const css=`.isGrey .dy_content_li_new{opacity:.35}.isGrey .dy_content_li_new:hover{opacity:1}.config-container{position:fixed;right:20px;top:12px}.config-container .el-row{display:flex;justify-content:flex-end;margin-bottom:10px}.config-container .el-row .number-input{width:100px}.config-container .el-row .number-input2{width:160px}.config-container .el-row .text{pointer-events:none}#read_id{position:relative}.progress-container{position:absolute;left:165px;top:50%;transform:translateY(-50%)}.progress-container .row1 .el-progress{width:150px}.progress-container .row2{display:flex;align-items:center;font-size:12px}.progress-container .row2 .row-tips{width:65px}.progress-container .row2 .el-progress{width:150px}`;
    GM_addStyle(css);

    /*! For license information please see jsencrypt.min.js.LICENSE.txt */
    !function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.JSEncrypt=e():t.JSEncrypt=e()}(window,(()=>(()=>{var t={155:t=>{var e,i,r=t.exports={};function n(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function o(t){if(e===setTimeout)return setTimeout(t,0);if((e===n||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(i){try{return e.call(null,t,0)}catch(i){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:n}catch(t){e=n}try{i="function"==typeof clearTimeout?clearTimeout:s}catch(t){i=s}}();var h,a=[],u=!1,c=-1;function f(){u&&h&&(u=!1,h.length?a=h.concat(a):c=-1,a.length&&l())}function l(){if(!u){var t=o(f);u=!0;for(var e=a.length;e;){for(h=a,a=[];++c<e;)h&&h[c].run();c=-1,e=a.length}h=null,u=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===s||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(t)}}function p(t,e){this.fun=t,this.array=e}function g(){}r.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)e[i-1]=arguments[i];a.push(new p(t,e)),1!==a.length||u||o(l)},p.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=g,r.addListener=g,r.once=g,r.off=g,r.removeListener=g,r.removeAllListeners=g,r.emit=g,r.prependListener=g,r.prependOnceListener=g,r.listeners=function(t){return[]},r.binding=function(t){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(t){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}}},e={};function i(r){var n=e[r];if(void 0!==n)return n.exports;var s=e[r]={exports:{}};return t[r](s,s.exports,i),s.exports}i.d=(t,e)=>{for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var r={};return(()=>{"use strict";function t(t){return"0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)}function e(t,e){return t&e}function n(t,e){return t|e}function s(t,e){return t^e}function o(t,e){return t&~e}function h(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function a(t){for(var e=0;0!=t;)t&=t-1,++e;return e}i.d(r,{default:()=>ot});var u,c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function f(t){var e,i,r="";for(e=0;e+3<=t.length;e+=3)i=parseInt(t.substring(e,e+3),16),r+=c.charAt(i>>6)+c.charAt(63&i);for(e+1==t.length?(i=parseInt(t.substring(e,e+1),16),r+=c.charAt(i<<2)):e+2==t.length&&(i=parseInt(t.substring(e,e+2),16),r+=c.charAt(i>>2)+c.charAt((3&i)<<4));(3&r.length)>0;)r+="=";return r}function l(e){var i,r="",n=0,s=0;for(i=0;i<e.length&&"="!=e.charAt(i);++i){var o=c.indexOf(e.charAt(i));o<0||(0==n?(r+=t(o>>2),s=3&o,n=1):1==n?(r+=t(s<<2|o>>4),s=15&o,n=2):2==n?(r+=t(s),r+=t(o>>2),s=3&o,n=3):(r+=t(s<<2|o>>4),r+=t(15&o),n=0))}return 1==n&&(r+=t(s<<2)),r}var p,g={decode:function(t){var e;if(void 0===p){var i="= \f\n\r\t \u2028\u2029";for(p=Object.create(null),e=0;e<64;++e)p["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)]=e;for(p["-"]=62,p._=63,e=0;e<i.length;++e)p[i.charAt(e)]=-1}var r=[],n=0,s=0;for(e=0;e<t.length;++e){var o=t.charAt(e);if("="==o)break;if(-1!=(o=p[o])){if(void 0===o)throw new Error("Illegal character at offset "+e);n|=o,++s>=4?(r[r.length]=n>>16,r[r.length]=n>>8&255,r[r.length]=255&n,n=0,s=0):n<<=6}}switch(s){case 1:throw new Error("Base64 encoding incomplete: at least 2 bits missing");case 2:r[r.length]=n>>10;break;case 3:r[r.length]=n>>16,r[r.length]=n>>8&255}return r},re:/-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,unarmor:function(t){var e=g.re.exec(t);if(e)if(e[1])t=e[1];else{if(!e[2])throw new Error("RegExp out of sync");t=e[2]}return g.decode(t)}},d=1e13,v=function(){function t(t){this.buf=[+t||0]}return t.prototype.mulAdd=function(t,e){var i,r,n=this.buf,s=n.length;for(i=0;i<s;++i)(r=n[i]*t+e)<d?e=0:r-=(e=0|r/d)*d,n[i]=r;e>0&&(n[i]=e)},t.prototype.sub=function(t){var e,i,r=this.buf,n=r.length;for(e=0;e<n;++e)(i=r[e]-t)<0?(i+=d,t=1):t=0,r[e]=i;for(;0===r[r.length-1];)r.pop()},t.prototype.toString=function(t){if(10!=(t||10))throw new Error("only base 10 is supported");for(var e=this.buf,i=e[e.length-1].toString(),r=e.length-2;r>=0;--r)i+=(d+e[r]).toString().substring(1);return i},t.prototype.valueOf=function(){for(var t=this.buf,e=0,i=t.length-1;i>=0;--i)e=e*d+t[i];return e},t.prototype.simplify=function(){var t=this.buf;return 1==t.length?t[0]:this},t}(),m=/^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,y=/^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;function b(t,e){return t.length>e&&(t=t.substring(0,e)+"…"),t}var T,S=function(){function t(e,i){this.hexDigits="0123456789ABCDEF",e instanceof t?(this.enc=e.enc,this.pos=e.pos):(this.enc=e,this.pos=i)}return t.prototype.get=function(t){if(void 0===t&&(t=this.pos++),t>=this.enc.length)throw new Error("Requesting byte offset ".concat(t," on a stream of length ").concat(this.enc.length));return"string"==typeof this.enc?this.enc.charCodeAt(t):this.enc[t]},t.prototype.hexByte=function(t){return this.hexDigits.charAt(t>>4&15)+this.hexDigits.charAt(15&t)},t.prototype.hexDump=function(t,e,i){for(var r="",n=t;n<e;++n)if(r+=this.hexByte(this.get(n)),!0!==i)switch(15&n){case 7:r+="  ";break;case 15:r+="\n";break;default:r+=" "}return r},t.prototype.isASCII=function(t,e){for(var i=t;i<e;++i){var r=this.get(i);if(r<32||r>176)return!1}return!0},t.prototype.parseStringISO=function(t,e){for(var i="",r=t;r<e;++r)i+=String.fromCharCode(this.get(r));return i},t.prototype.parseStringUTF=function(t,e){for(var i="",r=t;r<e;){var n=this.get(r++);i+=n<128?String.fromCharCode(n):n>191&&n<224?String.fromCharCode((31&n)<<6|63&this.get(r++)):String.fromCharCode((15&n)<<12|(63&this.get(r++))<<6|63&this.get(r++))}return i},t.prototype.parseStringBMP=function(t,e){for(var i,r,n="",s=t;s<e;)i=this.get(s++),r=this.get(s++),n+=String.fromCharCode(i<<8|r);return n},t.prototype.parseTime=function(t,e,i){var r=this.parseStringISO(t,e),n=(i?m:y).exec(r);return n?(i&&(n[1]=+n[1],n[1]+=+n[1]<70?2e3:1900),r=n[1]+"-"+n[2]+"-"+n[3]+" "+n[4],n[5]&&(r+=":"+n[5],n[6]&&(r+=":"+n[6],n[7]&&(r+="."+n[7]))),n[8]&&(r+=" UTC","Z"!=n[8]&&(r+=n[8],n[9]&&(r+=":"+n[9]))),r):"Unrecognized time: "+r},t.prototype.parseInteger=function(t,e){for(var i,r=this.get(t),n=r>127,s=n?255:0,o="";r==s&&++t<e;)r=this.get(t);if(0==(i=e-t))return n?-1:0;if(i>4){for(o=r,i<<=3;0==(128&(+o^s));)o=+o<<1,--i;o="("+i+" bit)\n"}n&&(r-=256);for(var h=new v(r),a=t+1;a<e;++a)h.mulAdd(256,this.get(a));return o+h.toString()},t.prototype.parseBitString=function(t,e,i){for(var r=this.get(t),n="("+((e-t-1<<3)-r)+" bit)\n",s="",o=t+1;o<e;++o){for(var h=this.get(o),a=o==e-1?r:0,u=7;u>=a;--u)s+=h>>u&1?"1":"0";if(s.length>i)return n+b(s,i)}return n+s},t.prototype.parseOctetString=function(t,e,i){if(this.isASCII(t,e))return b(this.parseStringISO(t,e),i);var r=e-t,n="("+r+" byte)\n";r>(i/=2)&&(e=t+i);for(var s=t;s<e;++s)n+=this.hexByte(this.get(s));return r>i&&(n+="…"),n},t.prototype.parseOID=function(t,e,i){for(var r="",n=new v,s=0,o=t;o<e;++o){var h=this.get(o);if(n.mulAdd(128,127&h),s+=7,!(128&h)){if(""===r)if((n=n.simplify())instanceof v)n.sub(80),r="2."+n.toString();else{var a=n<80?n<40?0:1:2;r=a+"."+(n-40*a)}else r+="."+n.toString();if(r.length>i)return b(r,i);n=new v,s=0}}return s>0&&(r+=".incomplete"),r},t}(),E=function(){function t(t,e,i,r,n){if(!(r instanceof w))throw new Error("Invalid tag value.");this.stream=t,this.header=e,this.length=i,this.tag=r,this.sub=n}return t.prototype.typeName=function(){switch(this.tag.tagClass){case 0:switch(this.tag.tagNumber){case 0:return"EOC";case 1:return"BOOLEAN";case 2:return"INTEGER";case 3:return"BIT_STRING";case 4:return"OCTET_STRING";case 5:return"NULL";case 6:return"OBJECT_IDENTIFIER";case 7:return"ObjectDescriptor";case 8:return"EXTERNAL";case 9:return"REAL";case 10:return"ENUMERATED";case 11:return"EMBEDDED_PDV";case 12:return"UTF8String";case 16:return"SEQUENCE";case 17:return"SET";case 18:return"NumericString";case 19:return"PrintableString";case 20:return"TeletexString";case 21:return"VideotexString";case 22:return"IA5String";case 23:return"UTCTime";case 24:return"GeneralizedTime";case 25:return"GraphicString";case 26:return"VisibleString";case 27:return"GeneralString";case 28:return"UniversalString";case 30:return"BMPString"}return"Universal_"+this.tag.tagNumber.toString();case 1:return"Application_"+this.tag.tagNumber.toString();case 2:return"["+this.tag.tagNumber.toString()+"]";case 3:return"Private_"+this.tag.tagNumber.toString()}},t.prototype.content=function(t){if(void 0===this.tag)return null;void 0===t&&(t=1/0);var e=this.posContent(),i=Math.abs(this.length);if(!this.tag.isUniversal())return null!==this.sub?"("+this.sub.length+" elem)":this.stream.parseOctetString(e,e+i,t);switch(this.tag.tagNumber){case 1:return 0===this.stream.get(e)?"false":"true";case 2:return this.stream.parseInteger(e,e+i);case 3:return this.sub?"("+this.sub.length+" elem)":this.stream.parseBitString(e,e+i,t);case 4:return this.sub?"("+this.sub.length+" elem)":this.stream.parseOctetString(e,e+i,t);case 6:return this.stream.parseOID(e,e+i,t);case 16:case 17:return null!==this.sub?"("+this.sub.length+" elem)":"(no elem)";case 12:return b(this.stream.parseStringUTF(e,e+i),t);case 18:case 19:case 20:case 21:case 22:case 26:return b(this.stream.parseStringISO(e,e+i),t);case 30:return b(this.stream.parseStringBMP(e,e+i),t);case 23:case 24:return this.stream.parseTime(e,e+i,23==this.tag.tagNumber)}return null},t.prototype.toString=function(){return this.typeName()+"@"+this.stream.pos+"[header:"+this.header+",length:"+this.length+",sub:"+(null===this.sub?"null":this.sub.length)+"]"},t.prototype.toPrettyString=function(t){void 0===t&&(t="");var e=t+this.typeName()+" @"+this.stream.pos;if(this.length>=0&&(e+="+"),e+=this.length,this.tag.tagConstructed?e+=" (constructed)":!this.tag.isUniversal()||3!=this.tag.tagNumber&&4!=this.tag.tagNumber||null===this.sub||(e+=" (encapsulates)"),e+="\n",null!==this.sub){t+="  ";for(var i=0,r=this.sub.length;i<r;++i)e+=this.sub[i].toPrettyString(t)}return e},t.prototype.posStart=function(){return this.stream.pos},t.prototype.posContent=function(){return this.stream.pos+this.header},t.prototype.posEnd=function(){return this.stream.pos+this.header+Math.abs(this.length)},t.prototype.toHexString=function(){return this.stream.hexDump(this.posStart(),this.posEnd(),!0)},t.decodeLength=function(t){var e=t.get(),i=127&e;if(i==e)return i;if(i>6)throw new Error("Length over 48 bits not supported at position "+(t.pos-1));if(0===i)return null;e=0;for(var r=0;r<i;++r)e=256*e+t.get();return e},t.prototype.getHexStringValue=function(){var t=this.toHexString(),e=2*this.header,i=2*this.length;return t.substr(e,i)},t.decode=function(e){var i;i=e instanceof S?e:new S(e,0);var r=new S(i),n=new w(i),s=t.decodeLength(i),o=i.pos,h=o-r.pos,a=null,u=function(){var e=[];if(null!==s){for(var r=o+s;i.pos<r;)e[e.length]=t.decode(i);if(i.pos!=r)throw new Error("Content size is not correct for container starting at offset "+o)}else try{for(;;){var n=t.decode(i);if(n.tag.isEOC())break;e[e.length]=n}s=o-i.pos}catch(t){throw new Error("Exception while decoding undefined length content: "+t)}return e};if(n.tagConstructed)a=u();else if(n.isUniversal()&&(3==n.tagNumber||4==n.tagNumber))try{if(3==n.tagNumber&&0!=i.get())throw new Error("BIT STRINGs with unused bits cannot encapsulate.");a=u();for(var c=0;c<a.length;++c)if(a[c].tag.isEOC())throw new Error("EOC is not supposed to be actual content.")}catch(t){a=null}if(null===a){if(null===s)throw new Error("We can't skip over an invalid tag with undefined length at offset "+o);i.pos=o+Math.abs(s)}return new t(r,h,s,n,a)},t}(),w=function(){function t(t){var e=t.get();if(this.tagClass=e>>6,this.tagConstructed=0!=(32&e),this.tagNumber=31&e,31==this.tagNumber){var i=new v;do{e=t.get(),i.mulAdd(128,127&e)}while(128&e);this.tagNumber=i.simplify()}}return t.prototype.isUniversal=function(){return 0===this.tagClass},t.prototype.isEOC=function(){return 0===this.tagClass&&0===this.tagNumber},t}(),D=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],x=(1<<26)/D[D.length-1],R=function(){function i(t,e,i){null!=t&&("number"==typeof t?this.fromNumber(t,e,i):null==e&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,e))}return i.prototype.toString=function(e){if(this.s<0)return"-"+this.negate().toString(e);var i;if(16==e)i=4;else if(8==e)i=3;else if(2==e)i=1;else if(32==e)i=5;else{if(4!=e)return this.toRadix(e);i=2}var r,n=(1<<i)-1,s=!1,o="",h=this.t,a=this.DB-h*this.DB%i;if(h-- >0)for(a<this.DB&&(r=this[h]>>a)>0&&(s=!0,o=t(r));h>=0;)a<i?(r=(this[h]&(1<<a)-1)<<i-a,r|=this[--h]>>(a+=this.DB-i)):(r=this[h]>>(a-=i)&n,a<=0&&(a+=this.DB,--h)),r>0&&(s=!0),s&&(o+=t(r));return s?o:"0"},i.prototype.negate=function(){var t=I();return i.ZERO.subTo(this,t),t},i.prototype.abs=function(){return this.s<0?this.negate():this},i.prototype.compareTo=function(t){var e=this.s-t.s;if(0!=e)return e;var i=this.t;if(0!=(e=i-t.t))return this.s<0?-e:e;for(;--i>=0;)if(0!=(e=this[i]-t[i]))return e;return 0},i.prototype.bitLength=function(){return this.t<=0?0:this.DB*(this.t-1)+C(this[this.t-1]^this.s&this.DM)},i.prototype.mod=function(t){var e=I();return this.abs().divRemTo(t,null,e),this.s<0&&e.compareTo(i.ZERO)>0&&t.subTo(e,e),e},i.prototype.modPowInt=function(t,e){var i;return i=t<256||e.isEven()?new O(e):new A(e),this.exp(t,i)},i.prototype.clone=function(){var t=I();return this.copyTo(t),t},i.prototype.intValue=function(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]},i.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24},i.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16},i.prototype.signum=function(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1},i.prototype.toByteArray=function(){var t=this.t,e=[];e[0]=this.s;var i,r=this.DB-t*this.DB%8,n=0;if(t-- >0)for(r<this.DB&&(i=this[t]>>r)!=(this.s&this.DM)>>r&&(e[n++]=i|this.s<<this.DB-r);t>=0;)r<8?(i=(this[t]&(1<<r)-1)<<8-r,i|=this[--t]>>(r+=this.DB-8)):(i=this[t]>>(r-=8)&255,r<=0&&(r+=this.DB,--t)),0!=(128&i)&&(i|=-256),0==n&&(128&this.s)!=(128&i)&&++n,(n>0||i!=this.s)&&(e[n++]=i);return e},i.prototype.equals=function(t){return 0==this.compareTo(t)},i.prototype.min=function(t){return this.compareTo(t)<0?this:t},i.prototype.max=function(t){return this.compareTo(t)>0?this:t},i.prototype.and=function(t){var i=I();return this.bitwiseTo(t,e,i),i},i.prototype.or=function(t){var e=I();return this.bitwiseTo(t,n,e),e},i.prototype.xor=function(t){var e=I();return this.bitwiseTo(t,s,e),e},i.prototype.andNot=function(t){var e=I();return this.bitwiseTo(t,o,e),e},i.prototype.not=function(){for(var t=I(),e=0;e<this.t;++e)t[e]=this.DM&~this[e];return t.t=this.t,t.s=~this.s,t},i.prototype.shiftLeft=function(t){var e=I();return t<0?this.rShiftTo(-t,e):this.lShiftTo(t,e),e},i.prototype.shiftRight=function(t){var e=I();return t<0?this.lShiftTo(-t,e):this.rShiftTo(t,e),e},i.prototype.getLowestSetBit=function(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+h(this[t]);return this.s<0?this.t*this.DB:-1},i.prototype.bitCount=function(){for(var t=0,e=this.s&this.DM,i=0;i<this.t;++i)t+=a(this[i]^e);return t},i.prototype.testBit=function(t){var e=Math.floor(t/this.DB);return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)},i.prototype.setBit=function(t){return this.changeBit(t,n)},i.prototype.clearBit=function(t){return this.changeBit(t,o)},i.prototype.flipBit=function(t){return this.changeBit(t,s)},i.prototype.add=function(t){var e=I();return this.addTo(t,e),e},i.prototype.subtract=function(t){var e=I();return this.subTo(t,e),e},i.prototype.multiply=function(t){var e=I();return this.multiplyTo(t,e),e},i.prototype.divide=function(t){var e=I();return this.divRemTo(t,e,null),e},i.prototype.remainder=function(t){var e=I();return this.divRemTo(t,null,e),e},i.prototype.divideAndRemainder=function(t){var e=I(),i=I();return this.divRemTo(t,e,i),[e,i]},i.prototype.modPow=function(t,e){var i,r,n=t.bitLength(),s=H(1);if(n<=0)return s;i=n<18?1:n<48?3:n<144?4:n<768?5:6,r=n<8?new O(e):e.isEven()?new V(e):new A(e);var o=[],h=3,a=i-1,u=(1<<i)-1;if(o[1]=r.convert(this),i>1){var c=I();for(r.sqrTo(o[1],c);h<=u;)o[h]=I(),r.mulTo(c,o[h-2],o[h]),h+=2}var f,l,p=t.t-1,g=!0,d=I();for(n=C(t[p])-1;p>=0;){for(n>=a?f=t[p]>>n-a&u:(f=(t[p]&(1<<n+1)-1)<<a-n,p>0&&(f|=t[p-1]>>this.DB+n-a)),h=i;0==(1&f);)f>>=1,--h;if((n-=h)<0&&(n+=this.DB,--p),g)o[f].copyTo(s),g=!1;else{for(;h>1;)r.sqrTo(s,d),r.sqrTo(d,s),h-=2;h>0?r.sqrTo(s,d):(l=s,s=d,d=l),r.mulTo(d,o[f],s)}for(;p>=0&&0==(t[p]&1<<n);)r.sqrTo(s,d),l=s,s=d,d=l,--n<0&&(n=this.DB-1,--p)}return r.revert(s)},i.prototype.modInverse=function(t){var e=t.isEven();if(this.isEven()&&e||0==t.signum())return i.ZERO;for(var r=t.clone(),n=this.clone(),s=H(1),o=H(0),h=H(0),a=H(1);0!=r.signum();){for(;r.isEven();)r.rShiftTo(1,r),e?(s.isEven()&&o.isEven()||(s.addTo(this,s),o.subTo(t,o)),s.rShiftTo(1,s)):o.isEven()||o.subTo(t,o),o.rShiftTo(1,o);for(;n.isEven();)n.rShiftTo(1,n),e?(h.isEven()&&a.isEven()||(h.addTo(this,h),a.subTo(t,a)),h.rShiftTo(1,h)):a.isEven()||a.subTo(t,a),a.rShiftTo(1,a);r.compareTo(n)>=0?(r.subTo(n,r),e&&s.subTo(h,s),o.subTo(a,o)):(n.subTo(r,n),e&&h.subTo(s,h),a.subTo(o,a))}return 0!=n.compareTo(i.ONE)?i.ZERO:a.compareTo(t)>=0?a.subtract(t):a.signum()<0?(a.addTo(t,a),a.signum()<0?a.add(t):a):a},i.prototype.pow=function(t){return this.exp(t,new B)},i.prototype.gcd=function(t){var e=this.s<0?this.negate():this.clone(),i=t.s<0?t.negate():t.clone();if(e.compareTo(i)<0){var r=e;e=i,i=r}var n=e.getLowestSetBit(),s=i.getLowestSetBit();if(s<0)return e;for(n<s&&(s=n),s>0&&(e.rShiftTo(s,e),i.rShiftTo(s,i));e.signum()>0;)(n=e.getLowestSetBit())>0&&e.rShiftTo(n,e),(n=i.getLowestSetBit())>0&&i.rShiftTo(n,i),e.compareTo(i)>=0?(e.subTo(i,e),e.rShiftTo(1,e)):(i.subTo(e,i),i.rShiftTo(1,i));return s>0&&i.lShiftTo(s,i),i},i.prototype.isProbablePrime=function(t){var e,i=this.abs();if(1==i.t&&i[0]<=D[D.length-1]){for(e=0;e<D.length;++e)if(i[0]==D[e])return!0;return!1}if(i.isEven())return!1;for(e=1;e<D.length;){for(var r=D[e],n=e+1;n<D.length&&r<x;)r*=D[n++];for(r=i.modInt(r);e<n;)if(r%D[e++]==0)return!1}return i.millerRabin(t)},i.prototype.copyTo=function(t){for(var e=this.t-1;e>=0;--e)t[e]=this[e];t.t=this.t,t.s=this.s},i.prototype.fromInt=function(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0},i.prototype.fromString=function(t,e){var r;if(16==e)r=4;else if(8==e)r=3;else if(256==e)r=8;else if(2==e)r=1;else if(32==e)r=5;else{if(4!=e)return void this.fromRadix(t,e);r=2}this.t=0,this.s=0;for(var n=t.length,s=!1,o=0;--n>=0;){var h=8==r?255&+t[n]:q(t,n);h<0?"-"==t.charAt(n)&&(s=!0):(s=!1,0==o?this[this.t++]=h:o+r>this.DB?(this[this.t-1]|=(h&(1<<this.DB-o)-1)<<o,this[this.t++]=h>>this.DB-o):this[this.t-1]|=h<<o,(o+=r)>=this.DB&&(o-=this.DB))}8==r&&0!=(128&+t[0])&&(this.s=-1,o>0&&(this[this.t-1]|=(1<<this.DB-o)-1<<o)),this.clamp(),s&&i.ZERO.subTo(this,this)},i.prototype.clamp=function(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t},i.prototype.dlShiftTo=function(t,e){var i;for(i=this.t-1;i>=0;--i)e[i+t]=this[i];for(i=t-1;i>=0;--i)e[i]=0;e.t=this.t+t,e.s=this.s},i.prototype.drShiftTo=function(t,e){for(var i=t;i<this.t;++i)e[i-t]=this[i];e.t=Math.max(this.t-t,0),e.s=this.s},i.prototype.lShiftTo=function(t,e){for(var i=t%this.DB,r=this.DB-i,n=(1<<r)-1,s=Math.floor(t/this.DB),o=this.s<<i&this.DM,h=this.t-1;h>=0;--h)e[h+s+1]=this[h]>>r|o,o=(this[h]&n)<<i;for(h=s-1;h>=0;--h)e[h]=0;e[s]=o,e.t=this.t+s+1,e.s=this.s,e.clamp()},i.prototype.rShiftTo=function(t,e){e.s=this.s;var i=Math.floor(t/this.DB);if(i>=this.t)e.t=0;else{var r=t%this.DB,n=this.DB-r,s=(1<<r)-1;e[0]=this[i]>>r;for(var o=i+1;o<this.t;++o)e[o-i-1]|=(this[o]&s)<<n,e[o-i]=this[o]>>r;r>0&&(e[this.t-i-1]|=(this.s&s)<<n),e.t=this.t-i,e.clamp()}},i.prototype.subTo=function(t,e){for(var i=0,r=0,n=Math.min(t.t,this.t);i<n;)r+=this[i]-t[i],e[i++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r-=t.s;i<this.t;)r+=this[i],e[i++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;i<t.t;)r-=t[i],e[i++]=r&this.DM,r>>=this.DB;r-=t.s}e.s=r<0?-1:0,r<-1?e[i++]=this.DV+r:r>0&&(e[i++]=r),e.t=i,e.clamp()},i.prototype.multiplyTo=function(t,e){var r=this.abs(),n=t.abs(),s=r.t;for(e.t=s+n.t;--s>=0;)e[s]=0;for(s=0;s<n.t;++s)e[s+r.t]=r.am(0,n[s],e,s,0,r.t);e.s=0,e.clamp(),this.s!=t.s&&i.ZERO.subTo(e,e)},i.prototype.squareTo=function(t){for(var e=this.abs(),i=t.t=2*e.t;--i>=0;)t[i]=0;for(i=0;i<e.t-1;++i){var r=e.am(i,e[i],t,2*i,0,1);(t[i+e.t]+=e.am(i+1,2*e[i],t,2*i+1,r,e.t-i-1))>=e.DV&&(t[i+e.t]-=e.DV,t[i+e.t+1]=1)}t.t>0&&(t[t.t-1]+=e.am(i,e[i],t,2*i,0,1)),t.s=0,t.clamp()},i.prototype.divRemTo=function(t,e,r){var n=t.abs();if(!(n.t<=0)){var s=this.abs();if(s.t<n.t)return null!=e&&e.fromInt(0),void(null!=r&&this.copyTo(r));null==r&&(r=I());var o=I(),h=this.s,a=t.s,u=this.DB-C(n[n.t-1]);u>0?(n.lShiftTo(u,o),s.lShiftTo(u,r)):(n.copyTo(o),s.copyTo(r));var c=o.t,f=o[c-1];if(0!=f){var l=f*(1<<this.F1)+(c>1?o[c-2]>>this.F2:0),p=this.FV/l,g=(1<<this.F1)/l,d=1<<this.F2,v=r.t,m=v-c,y=null==e?I():e;for(o.dlShiftTo(m,y),r.compareTo(y)>=0&&(r[r.t++]=1,r.subTo(y,r)),i.ONE.dlShiftTo(c,y),y.subTo(o,o);o.t<c;)o[o.t++]=0;for(;--m>=0;){var b=r[--v]==f?this.DM:Math.floor(r[v]*p+(r[v-1]+d)*g);if((r[v]+=o.am(0,b,r,m,0,c))<b)for(o.dlShiftTo(m,y),r.subTo(y,r);r[v]<--b;)r.subTo(y,r)}null!=e&&(r.drShiftTo(c,e),h!=a&&i.ZERO.subTo(e,e)),r.t=c,r.clamp(),u>0&&r.rShiftTo(u,r),h<0&&i.ZERO.subTo(r,r)}}},i.prototype.invDigit=function(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var e=3&t;return(e=(e=(e=(e=e*(2-(15&t)*e)&15)*(2-(255&t)*e)&255)*(2-((65535&t)*e&65535))&65535)*(2-t*e%this.DV)%this.DV)>0?this.DV-e:-e},i.prototype.isEven=function(){return 0==(this.t>0?1&this[0]:this.s)},i.prototype.exp=function(t,e){if(t>4294967295||t<1)return i.ONE;var r=I(),n=I(),s=e.convert(this),o=C(t)-1;for(s.copyTo(r);--o>=0;)if(e.sqrTo(r,n),(t&1<<o)>0)e.mulTo(n,s,r);else{var h=r;r=n,n=h}return e.revert(r)},i.prototype.chunkSize=function(t){return Math.floor(Math.LN2*this.DB/Math.log(t))},i.prototype.toRadix=function(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0";var e=this.chunkSize(t),i=Math.pow(t,e),r=H(i),n=I(),s=I(),o="";for(this.divRemTo(r,n,s);n.signum()>0;)o=(i+s.intValue()).toString(t).substr(1)+o,n.divRemTo(r,n,s);return s.intValue().toString(t)+o},i.prototype.fromRadix=function(t,e){this.fromInt(0),null==e&&(e=10);for(var r=this.chunkSize(e),n=Math.pow(e,r),s=!1,o=0,h=0,a=0;a<t.length;++a){var u=q(t,a);u<0?"-"==t.charAt(a)&&0==this.signum()&&(s=!0):(h=e*h+u,++o>=r&&(this.dMultiply(n),this.dAddOffset(h,0),o=0,h=0))}o>0&&(this.dMultiply(Math.pow(e,o)),this.dAddOffset(h,0)),s&&i.ZERO.subTo(this,this)},i.prototype.fromNumber=function(t,e,r){if("number"==typeof e)if(t<2)this.fromInt(1);else for(this.fromNumber(t,r),this.testBit(t-1)||this.bitwiseTo(i.ONE.shiftLeft(t-1),n,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(e);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(i.ONE.shiftLeft(t-1),this);else{var s=[],o=7&t;s.length=1+(t>>3),e.nextBytes(s),o>0?s[0]&=(1<<o)-1:s[0]=0,this.fromString(s,256)}},i.prototype.bitwiseTo=function(t,e,i){var r,n,s=Math.min(t.t,this.t);for(r=0;r<s;++r)i[r]=e(this[r],t[r]);if(t.t<this.t){for(n=t.s&this.DM,r=s;r<this.t;++r)i[r]=e(this[r],n);i.t=this.t}else{for(n=this.s&this.DM,r=s;r<t.t;++r)i[r]=e(n,t[r]);i.t=t.t}i.s=e(this.s,t.s),i.clamp()},i.prototype.changeBit=function(t,e){var r=i.ONE.shiftLeft(t);return this.bitwiseTo(r,e,r),r},i.prototype.addTo=function(t,e){for(var i=0,r=0,n=Math.min(t.t,this.t);i<n;)r+=this[i]+t[i],e[i++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r+=t.s;i<this.t;)r+=this[i],e[i++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;i<t.t;)r+=t[i],e[i++]=r&this.DM,r>>=this.DB;r+=t.s}e.s=r<0?-1:0,r>0?e[i++]=r:r<-1&&(e[i++]=this.DV+r),e.t=i,e.clamp()},i.prototype.dMultiply=function(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()},i.prototype.dAddOffset=function(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0;for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}},i.prototype.multiplyLowerTo=function(t,e,i){var r=Math.min(this.t+t.t,e);for(i.s=0,i.t=r;r>0;)i[--r]=0;for(var n=i.t-this.t;r<n;++r)i[r+this.t]=this.am(0,t[r],i,r,0,this.t);for(n=Math.min(t.t,e);r<n;++r)this.am(0,t[r],i,r,0,e-r);i.clamp()},i.prototype.multiplyUpperTo=function(t,e,i){--e;var r=i.t=this.t+t.t-e;for(i.s=0;--r>=0;)i[r]=0;for(r=Math.max(e-this.t,0);r<t.t;++r)i[this.t+r-e]=this.am(e-r,t[r],i,0,0,this.t+r-e);i.clamp(),i.drShiftTo(1,i)},i.prototype.modInt=function(t){if(t<=0)return 0;var e=this.DV%t,i=this.s<0?t-1:0;if(this.t>0)if(0==e)i=this[0]%t;else for(var r=this.t-1;r>=0;--r)i=(e*i+this[r])%t;return i},i.prototype.millerRabin=function(t){var e=this.subtract(i.ONE),r=e.getLowestSetBit();if(r<=0)return!1;var n=e.shiftRight(r);(t=t+1>>1)>D.length&&(t=D.length);for(var s=I(),o=0;o<t;++o){s.fromInt(D[Math.floor(Math.random()*D.length)]);var h=s.modPow(n,this);if(0!=h.compareTo(i.ONE)&&0!=h.compareTo(e)){for(var a=1;a++<r&&0!=h.compareTo(e);)if(0==(h=h.modPowInt(2,this)).compareTo(i.ONE))return!1;if(0!=h.compareTo(e))return!1}}return!0},i.prototype.square=function(){var t=I();return this.squareTo(t),t},i.prototype.gcda=function(t,e){var i=this.s<0?this.negate():this.clone(),r=t.s<0?t.negate():t.clone();if(i.compareTo(r)<0){var n=i;i=r,r=n}var s=i.getLowestSetBit(),o=r.getLowestSetBit();if(o<0)e(i);else{s<o&&(o=s),o>0&&(i.rShiftTo(o,i),r.rShiftTo(o,r));var h=function(){(s=i.getLowestSetBit())>0&&i.rShiftTo(s,i),(s=r.getLowestSetBit())>0&&r.rShiftTo(s,r),i.compareTo(r)>=0?(i.subTo(r,i),i.rShiftTo(1,i)):(r.subTo(i,r),r.rShiftTo(1,r)),i.signum()>0?setTimeout(h,0):(o>0&&r.lShiftTo(o,r),setTimeout((function(){e(r)}),0))};setTimeout(h,10)}},i.prototype.fromNumberAsync=function(t,e,r,s){if("number"==typeof e)if(t<2)this.fromInt(1);else{this.fromNumber(t,r),this.testBit(t-1)||this.bitwiseTo(i.ONE.shiftLeft(t-1),n,this),this.isEven()&&this.dAddOffset(1,0);var o=this,h=function(){o.dAddOffset(2,0),o.bitLength()>t&&o.subTo(i.ONE.shiftLeft(t-1),o),o.isProbablePrime(e)?setTimeout((function(){s()}),0):setTimeout(h,0)};setTimeout(h,0)}else{var a=[],u=7&t;a.length=1+(t>>3),e.nextBytes(a),u>0?a[0]&=(1<<u)-1:a[0]=0,this.fromString(a,256)}},i}(),B=function(){function t(){}return t.prototype.convert=function(t){return t},t.prototype.revert=function(t){return t},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i)},t.prototype.sqrTo=function(t,e){t.squareTo(e)},t}(),O=function(){function t(t){this.m=t}return t.prototype.convert=function(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t},t.prototype.revert=function(t){return t},t.prototype.reduce=function(t){t.divRemTo(this.m,null,t)},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i),this.reduce(i)},t.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},t}(),A=function(){function t(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}return t.prototype.convert=function(t){var e=I();return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&e.compareTo(R.ZERO)>0&&this.m.subTo(e,e),e},t.prototype.revert=function(t){var e=I();return t.copyTo(e),this.reduce(e),e},t.prototype.reduce=function(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var e=0;e<this.m.t;++e){var i=32767&t[e],r=i*this.mpl+((i*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[i=e+this.m.t]+=this.m.am(0,r,t,e,0,this.m.t);t[i]>=t.DV;)t[i]-=t.DV,t[++i]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i),this.reduce(i)},t.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},t}(),V=function(){function t(t){this.m=t,this.r2=I(),this.q3=I(),R.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t)}return t.prototype.convert=function(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var e=I();return t.copyTo(e),this.reduce(e),e},t.prototype.revert=function(t){return t},t.prototype.reduce=function(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)},t.prototype.mulTo=function(t,e,i){t.multiplyTo(e,i),this.reduce(i)},t.prototype.sqrTo=function(t,e){t.squareTo(e),this.reduce(e)},t}();function I(){return new R(null)}function N(t,e){return new R(t,e)}var P="undefined"!=typeof navigator;P&&"Microsoft Internet Explorer"==navigator.appName?(R.prototype.am=function(t,e,i,r,n,s){for(var o=32767&e,h=e>>15;--s>=0;){var a=32767&this[t],u=this[t++]>>15,c=h*a+u*o;n=((a=o*a+((32767&c)<<15)+i[r]+(1073741823&n))>>>30)+(c>>>15)+h*u+(n>>>30),i[r++]=1073741823&a}return n},T=30):P&&"Netscape"!=navigator.appName?(R.prototype.am=function(t,e,i,r,n,s){for(;--s>=0;){var o=e*this[t++]+i[r]+n;n=Math.floor(o/67108864),i[r++]=67108863&o}return n},T=26):(R.prototype.am=function(t,e,i,r,n,s){for(var o=16383&e,h=e>>14;--s>=0;){var a=16383&this[t],u=this[t++]>>14,c=h*a+u*o;n=((a=o*a+((16383&c)<<14)+i[r]+n)>>28)+(c>>14)+h*u,i[r++]=268435455&a}return n},T=28),R.prototype.DB=T,R.prototype.DM=(1<<T)-1,R.prototype.DV=1<<T,R.prototype.FV=Math.pow(2,52),R.prototype.F1=52-T,R.prototype.F2=2*T-52;var M,L,j=[];for(M="0".charCodeAt(0),L=0;L<=9;++L)j[M++]=L;for(M="a".charCodeAt(0),L=10;L<36;++L)j[M++]=L;for(M="A".charCodeAt(0),L=10;L<36;++L)j[M++]=L;function q(t,e){var i=j[t.charCodeAt(e)];return null==i?-1:i}function H(t){var e=I();return e.fromInt(t),e}function C(t){var e,i=1;return 0!=(e=t>>>16)&&(t=e,i+=16),0!=(e=t>>8)&&(t=e,i+=8),0!=(e=t>>4)&&(t=e,i+=4),0!=(e=t>>2)&&(t=e,i+=2),0!=(e=t>>1)&&(t=e,i+=1),i}R.ZERO=H(0),R.ONE=H(1);var F,U,K=function(){function t(){this.i=0,this.j=0,this.S=[]}return t.prototype.init=function(t){var e,i,r;for(e=0;e<256;++e)this.S[e]=e;for(i=0,e=0;e<256;++e)i=i+this.S[e]+t[e%t.length]&255,r=this.S[e],this.S[e]=this.S[i],this.S[i]=r;this.i=0,this.j=0},t.prototype.next=function(){var t;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,t=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=t,this.S[t+this.S[this.i]&255]},t}(),k=null;if(null==k){k=[],U=0;var _=void 0;if("undefined"!=typeof window&&window.crypto&&window.crypto.getRandomValues){var z=new Uint32Array(256);for(window.crypto.getRandomValues(z),_=0;_<z.length;++_)k[U++]=255&z[_]}var Z=0,G=function(t){if((Z=Z||0)>=256||U>=256)window.removeEventListener?window.removeEventListener("mousemove",G,!1):window.detachEvent&&window.detachEvent("onmousemove",G);else try{var e=t.x+t.y;k[U++]=255&e,Z+=1}catch(t){}};"undefined"!=typeof window&&(window.addEventListener?window.addEventListener("mousemove",G,!1):window.attachEvent&&window.attachEvent("onmousemove",G))}function $(){if(null==F){for(F=new K;U<256;){var t=Math.floor(65536*Math.random());k[U++]=255&t}for(F.init(k),U=0;U<k.length;++U)k[U]=0;U=0}return F.next()}var Y=function(){function t(){}return t.prototype.nextBytes=function(t){for(var e=0;e<t.length;++e)t[e]=$()},t}(),J=function(){function t(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}return t.prototype.doPublic=function(t){return t.modPowInt(this.e,this.n)},t.prototype.doPrivate=function(t){if(null==this.p||null==this.q)return t.modPow(this.d,this.n);for(var e=t.mod(this.p).modPow(this.dmp1,this.p),i=t.mod(this.q).modPow(this.dmq1,this.q);e.compareTo(i)<0;)e=e.add(this.p);return e.subtract(i).multiply(this.coeff).mod(this.p).multiply(this.q).add(i)},t.prototype.setPublic=function(t,e){null!=t&&null!=e&&t.length>0&&e.length>0?(this.n=N(t,16),this.e=parseInt(e,16)):console.error("Invalid RSA public key")},t.prototype.encrypt=function(t){var e=this.n.bitLength()+7>>3,i=function(t,e){if(e<t.length+11)return console.error("Message too long for RSA"),null;for(var i=[],r=t.length-1;r>=0&&e>0;){var n=t.charCodeAt(r--);n<128?i[--e]=n:n>127&&n<2048?(i[--e]=63&n|128,i[--e]=n>>6|192):(i[--e]=63&n|128,i[--e]=n>>6&63|128,i[--e]=n>>12|224)}i[--e]=0;for(var s=new Y,o=[];e>2;){for(o[0]=0;0==o[0];)s.nextBytes(o);i[--e]=o[0]}return i[--e]=2,i[--e]=0,new R(i)}(t,e);if(null==i)return null;var r=this.doPublic(i);if(null==r)return null;for(var n=r.toString(16),s=n.length,o=0;o<2*e-s;o++)n="0"+n;return n},t.prototype.setPrivate=function(t,e,i){null!=t&&null!=e&&t.length>0&&e.length>0?(this.n=N(t,16),this.e=parseInt(e,16),this.d=N(i,16)):console.error("Invalid RSA private key")},t.prototype.setPrivateEx=function(t,e,i,r,n,s,o,h){null!=t&&null!=e&&t.length>0&&e.length>0?(this.n=N(t,16),this.e=parseInt(e,16),this.d=N(i,16),this.p=N(r,16),this.q=N(n,16),this.dmp1=N(s,16),this.dmq1=N(o,16),this.coeff=N(h,16)):console.error("Invalid RSA private key")},t.prototype.generate=function(t,e){var i=new Y,r=t>>1;this.e=parseInt(e,16);for(var n=new R(e,16);;){for(;this.p=new R(t-r,1,i),0!=this.p.subtract(R.ONE).gcd(n).compareTo(R.ONE)||!this.p.isProbablePrime(10););for(;this.q=new R(r,1,i),0!=this.q.subtract(R.ONE).gcd(n).compareTo(R.ONE)||!this.q.isProbablePrime(10););if(this.p.compareTo(this.q)<=0){var s=this.p;this.p=this.q,this.q=s}var o=this.p.subtract(R.ONE),h=this.q.subtract(R.ONE),a=o.multiply(h);if(0==a.gcd(n).compareTo(R.ONE)){this.n=this.p.multiply(this.q),this.d=n.modInverse(a),this.dmp1=this.d.mod(o),this.dmq1=this.d.mod(h),this.coeff=this.q.modInverse(this.p);break}}},t.prototype.decrypt=function(t){var e=N(t,16),i=this.doPrivate(e);return null==i?null:function(t,e){for(var i=t.toByteArray(),r=0;r<i.length&&0==i[r];)++r;if(i.length-r!=e-1||2!=i[r])return null;for(++r;0!=i[r];)if(++r>=i.length)return null;var bytes=[];for(var n="";++r<i.length;){bytes.push(i[r]);var s=255&i[r];s<128?n+=String.fromCharCode(s):s>191&&s<224?(n+=String.fromCharCode((31&s)<<6|63&i[r+1])):(n+=String.fromCharCode((15&s)<<12|(63&i[r+1])<<6|63&i[r+2]))};return bytes}(i,this.n.bitLength()+7>>3)},t.prototype.generateAsync=function(t,e,i){var r=new Y,n=t>>1;this.e=parseInt(e,16);var s=new R(e,16),o=this,h=function(){var e=function(){if(o.p.compareTo(o.q)<=0){var t=o.p;o.p=o.q,o.q=t}var e=o.p.subtract(R.ONE),r=o.q.subtract(R.ONE),n=e.multiply(r);0==n.gcd(s).compareTo(R.ONE)?(o.n=o.p.multiply(o.q),o.d=s.modInverse(n),o.dmp1=o.d.mod(e),o.dmq1=o.d.mod(r),o.coeff=o.q.modInverse(o.p),setTimeout((function(){i()}),0)):setTimeout(h,0)},a=function(){o.q=I(),o.q.fromNumberAsync(n,1,r,(function(){o.q.subtract(R.ONE).gcda(s,(function(t){0==t.compareTo(R.ONE)&&o.q.isProbablePrime(10)?setTimeout(e,0):setTimeout(a,0)}))}))},u=function(){o.p=I(),o.p.fromNumberAsync(t-n,1,r,(function(){o.p.subtract(R.ONE).gcda(s,(function(t){0==t.compareTo(R.ONE)&&o.p.isProbablePrime(10)?setTimeout(a,0):setTimeout(u,0)}))}))};setTimeout(u,0)};setTimeout(h,0)},t.prototype.sign=function(t,e,i){var r=function(t,e){if(e<t.length+22)return console.error("Message too long for RSA"),null;for(var i=e-t.length-6,r="",n=0;n<i;n+=2)r+="ff";return N("0001"+r+"00"+t,16)}((X[i]||"")+e(t).toString(),this.n.bitLength()/4);if(null==r)return null;var n=this.doPrivate(r);if(null==n)return null;var s=n.toString(16);return 0==(1&s.length)?s:"0"+s},t.prototype.verify=function(t,e,i){var r=N(e,16),n=this.doPublic(r);return null==n?null:function(t){for(var e in X)if(X.hasOwnProperty(e)){var i=X[e],r=i.length;if(t.substr(0,r)==i)return t.substr(r)}return t}(n.toString(16).replace(/^1f+00/,""))==i(t).toString()},t}(),X={md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",ripemd160:"3021300906052b2403020105000414"},Q={};Q.lang={extend:function(t,e,i){if(!e||!t)throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");var r=function(){};if(r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t,t.superclass=e.prototype,e.prototype.constructor==Object.prototype.constructor&&(e.prototype.constructor=e),i){var n;for(n in i)t.prototype[n]=i[n];var s=function(){},o=["toString","valueOf"];try{/MSIE/.test(navigator.userAgent)&&(s=function(t,e){for(n=0;n<o.length;n+=1){var i=o[n],r=e[i];"function"==typeof r&&r!=Object.prototype[i]&&(t[i]=r)}})}catch(t){}s(t.prototype,i)}}};var W={};void 0!==W.asn1&&W.asn1||(W.asn1={}),W.asn1.ASN1Util=new function(){this.integerToByteHex=function(t){var e=t.toString(16);return e.length%2==1&&(e="0"+e),e},this.bigIntToMinTwosComplementsHex=function(t){var e=t.toString(16);if("-"!=e.substr(0,1))e.length%2==1?e="0"+e:e.match(/^[0-7]/)||(e="00"+e);else{var i=e.substr(1).length;i%2==1?i+=1:e.match(/^[0-7]/)||(i+=2);for(var r="",n=0;n<i;n++)r+="f";e=new R(r,16).xor(t).add(R.ONE).toString(16).replace(/^-/,"")}return e},this.getPEMStringFromHex=function(t,e){return hextopem(t,e)},this.newObject=function(t){var e=W.asn1,i=e.DERBoolean,r=e.DERInteger,n=e.DERBitString,s=e.DEROctetString,o=e.DERNull,h=e.DERObjectIdentifier,a=e.DEREnumerated,u=e.DERUTF8String,c=e.DERNumericString,f=e.DERPrintableString,l=e.DERTeletexString,p=e.DERIA5String,g=e.DERUTCTime,d=e.DERGeneralizedTime,v=e.DERSequence,m=e.DERSet,y=e.DERTaggedObject,b=e.ASN1Util.newObject,T=Object.keys(t);if(1!=T.length)throw"key of param shall be only one.";var S=T[0];if(-1==":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":"+S+":"))throw"undefined key: "+S;if("bool"==S)return new i(t[S]);if("int"==S)return new r(t[S]);if("bitstr"==S)return new n(t[S]);if("octstr"==S)return new s(t[S]);if("null"==S)return new o(t[S]);if("oid"==S)return new h(t[S]);if("enum"==S)return new a(t[S]);if("utf8str"==S)return new u(t[S]);if("numstr"==S)return new c(t[S]);if("prnstr"==S)return new f(t[S]);if("telstr"==S)return new l(t[S]);if("ia5str"==S)return new p(t[S]);if("utctime"==S)return new g(t[S]);if("gentime"==S)return new d(t[S]);if("seq"==S){for(var E=t[S],w=[],D=0;D<E.length;D++){var x=b(E[D]);w.push(x)}return new v({array:w})}if("set"==S){for(E=t[S],w=[],D=0;D<E.length;D++)x=b(E[D]),w.push(x);return new m({array:w})}if("tag"==S){var R=t[S];if("[object Array]"===Object.prototype.toString.call(R)&&3==R.length){var B=b(R[2]);return new y({tag:R[0],explicit:R[1],obj:B})}var O={};if(void 0!==R.explicit&&(O.explicit=R.explicit),void 0!==R.tag&&(O.tag=R.tag),void 0===R.obj)throw"obj shall be specified for 'tag'.";return O.obj=b(R.obj),new y(O)}},this.jsonToASN1HEX=function(t){return this.newObject(t).getEncodedHex()}},W.asn1.ASN1Util.oidHexToInt=function(t){for(var e="",i=parseInt(t.substr(0,2),16),r=(e=Math.floor(i/40)+"."+i%40,""),n=2;n<t.length;n+=2){var s=("00000000"+parseInt(t.substr(n,2),16).toString(2)).slice(-8);r+=s.substr(1,7),"0"==s.substr(0,1)&&(e=e+"."+new R(r,2).toString(10),r="")}return e},W.asn1.ASN1Util.oidIntToHex=function(t){var e=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},i=function(t){var i="",r=new R(t,10).toString(2),n=7-r.length%7;7==n&&(n=0);for(var s="",o=0;o<n;o++)s+="0";for(r=s+r,o=0;o<r.length-1;o+=7){var h=r.substr(o,7);o!=r.length-7&&(h="1"+h),i+=e(parseInt(h,2))}return i};if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var r="",n=t.split("."),s=40*parseInt(n[0])+parseInt(n[1]);r+=e(s),n.splice(0,2);for(var o=0;o<n.length;o++)r+=i(n[o]);return r},W.asn1.ASN1Object=function(){this.getLengthHexFromValue=function(){if(void 0===this.hV||null==this.hV)throw"this.hV is null or undefined.";if(this.hV.length%2==1)throw"value hex must be even length: n="+"".length+",v="+this.hV;var t=this.hV.length/2,e=t.toString(16);if(e.length%2==1&&(e="0"+e),t<128)return e;var i=e.length/2;if(i>15)throw"ASN.1 length too long to represent by 8x: n = "+t.toString(16);return(128+i).toString(16)+e},this.getEncodedHex=function(){return(null==this.hTLV||this.isModified)&&(this.hV=this.getFreshValueHex(),this.hL=this.getLengthHexFromValue(),this.hTLV=this.hT+this.hL+this.hV,this.isModified=!1),this.hTLV},this.getValueHex=function(){return this.getEncodedHex(),this.hV},this.getFreshValueHex=function(){return""}},W.asn1.DERAbstractString=function(t){W.asn1.DERAbstractString.superclass.constructor.call(this),this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=stohex(this.s)},this.setStringHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t?this.setString(t):void 0!==t.str?this.setString(t.str):void 0!==t.hex&&this.setStringHex(t.hex))},Q.lang.extend(W.asn1.DERAbstractString,W.asn1.ASN1Object),W.asn1.DERAbstractTime=function(t){W.asn1.DERAbstractTime.superclass.constructor.call(this),this.localDateToUTC=function(t){return utc=t.getTime()+6e4*t.getTimezoneOffset(),new Date(utc)},this.formatDate=function(t,e,i){var r=this.zeroPadding,n=this.localDateToUTC(t),s=String(n.getFullYear());"utc"==e&&(s=s.substr(2,2));var o=s+r(String(n.getMonth()+1),2)+r(String(n.getDate()),2)+r(String(n.getHours()),2)+r(String(n.getMinutes()),2)+r(String(n.getSeconds()),2);if(!0===i){var h=n.getMilliseconds();if(0!=h){var a=r(String(h),3);o=o+"."+(a=a.replace(/[0]+$/,""))}}return o+"Z"},this.zeroPadding=function(t,e){return t.length>=e?t:new Array(e-t.length+1).join("0")+t},this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=stohex(t)},this.setByDateValue=function(t,e,i,r,n,s){var o=new Date(Date.UTC(t,e-1,i,r,n,s,0));this.setByDate(o)},this.getFreshValueHex=function(){return this.hV}},Q.lang.extend(W.asn1.DERAbstractTime,W.asn1.ASN1Object),W.asn1.DERAbstractStructured=function(t){W.asn1.DERAbstractString.superclass.constructor.call(this),this.setByASN1ObjectArray=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array=t},this.appendASN1Object=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array.push(t)},this.asn1Array=new Array,void 0!==t&&void 0!==t.array&&(this.asn1Array=t.array)},Q.lang.extend(W.asn1.DERAbstractStructured,W.asn1.ASN1Object),W.asn1.DERBoolean=function(){W.asn1.DERBoolean.superclass.constructor.call(this),this.hT="01",this.hTLV="0101ff"},Q.lang.extend(W.asn1.DERBoolean,W.asn1.ASN1Object),W.asn1.DERInteger=function(t){W.asn1.DERInteger.superclass.constructor.call(this),this.hT="02",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=W.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new R(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.bigint?this.setByBigInteger(t.bigint):void 0!==t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))},Q.lang.extend(W.asn1.DERInteger,W.asn1.ASN1Object),W.asn1.DERBitString=function(t){if(void 0!==t&&void 0!==t.obj){var e=W.asn1.ASN1Util.newObject(t.obj);t.hex="00"+e.getEncodedHex()}W.asn1.DERBitString.superclass.constructor.call(this),this.hT="03",this.setHexValueIncludingUnusedBits=function(t){this.hTLV=null,this.isModified=!0,this.hV=t},this.setUnusedBitsAndHexValue=function(t,e){if(t<0||7<t)throw"unused bits shall be from 0 to 7: u = "+t;var i="0"+t;this.hTLV=null,this.isModified=!0,this.hV=i+e},this.setByBinaryString=function(t){var e=8-(t=t.replace(/0+$/,"")).length%8;8==e&&(e=0);for(var i=0;i<=e;i++)t+="0";var r="";for(i=0;i<t.length-1;i+=8){var n=t.substr(i,8),s=parseInt(n,2).toString(16);1==s.length&&(s="0"+s),r+=s}this.hTLV=null,this.isModified=!0,this.hV="0"+e+r},this.setByBooleanArray=function(t){for(var e="",i=0;i<t.length;i++)1==t[i]?e+="1":e+="0";this.setByBinaryString(e)},this.newFalseArray=function(t){for(var e=new Array(t),i=0;i<t;i++)e[i]=!1;return e},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t&&t.toLowerCase().match(/^[0-9a-f]+$/)?this.setHexValueIncludingUnusedBits(t):void 0!==t.hex?this.setHexValueIncludingUnusedBits(t.hex):void 0!==t.bin?this.setByBinaryString(t.bin):void 0!==t.array&&this.setByBooleanArray(t.array))},Q.lang.extend(W.asn1.DERBitString,W.asn1.ASN1Object),W.asn1.DEROctetString=function(t){if(void 0!==t&&void 0!==t.obj){var e=W.asn1.ASN1Util.newObject(t.obj);t.hex=e.getEncodedHex()}W.asn1.DEROctetString.superclass.constructor.call(this,t),this.hT="04"},Q.lang.extend(W.asn1.DEROctetString,W.asn1.DERAbstractString),W.asn1.DERNull=function(){W.asn1.DERNull.superclass.constructor.call(this),this.hT="05",this.hTLV="0500"},Q.lang.extend(W.asn1.DERNull,W.asn1.ASN1Object),W.asn1.DERObjectIdentifier=function(t){var e=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},i=function(t){var i="",r=new R(t,10).toString(2),n=7-r.length%7;7==n&&(n=0);for(var s="",o=0;o<n;o++)s+="0";for(r=s+r,o=0;o<r.length-1;o+=7){var h=r.substr(o,7);o!=r.length-7&&(h="1"+h),i+=e(parseInt(h,2))}return i};W.asn1.DERObjectIdentifier.superclass.constructor.call(this),this.hT="06",this.setValueHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.setValueOidString=function(t){if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var r="",n=t.split("."),s=40*parseInt(n[0])+parseInt(n[1]);r+=e(s),n.splice(0,2);for(var o=0;o<n.length;o++)r+=i(n[o]);this.hTLV=null,this.isModified=!0,this.s=null,this.hV=r},this.setValueName=function(t){var e=W.asn1.x509.OID.name2oid(t);if(""===e)throw"DERObjectIdentifier oidName undefined: "+t;this.setValueOidString(e)},this.getFreshValueHex=function(){return this.hV},void 0!==t&&("string"==typeof t?t.match(/^[0-2].[0-9.]+$/)?this.setValueOidString(t):this.setValueName(t):void 0!==t.oid?this.setValueOidString(t.oid):void 0!==t.hex?this.setValueHex(t.hex):void 0!==t.name&&this.setValueName(t.name))},Q.lang.extend(W.asn1.DERObjectIdentifier,W.asn1.ASN1Object),W.asn1.DEREnumerated=function(t){W.asn1.DEREnumerated.superclass.constructor.call(this),this.hT="0a",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=W.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new R(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):void 0!==t.hex&&this.setValueHex(t.hex))},Q.lang.extend(W.asn1.DEREnumerated,W.asn1.ASN1Object),W.asn1.DERUTF8String=function(t){W.asn1.DERUTF8String.superclass.constructor.call(this,t),this.hT="0c"},Q.lang.extend(W.asn1.DERUTF8String,W.asn1.DERAbstractString),W.asn1.DERNumericString=function(t){W.asn1.DERNumericString.superclass.constructor.call(this,t),this.hT="12"},Q.lang.extend(W.asn1.DERNumericString,W.asn1.DERAbstractString),W.asn1.DERPrintableString=function(t){W.asn1.DERPrintableString.superclass.constructor.call(this,t),this.hT="13"},Q.lang.extend(W.asn1.DERPrintableString,W.asn1.DERAbstractString),W.asn1.DERTeletexString=function(t){W.asn1.DERTeletexString.superclass.constructor.call(this,t),this.hT="14"},Q.lang.extend(W.asn1.DERTeletexString,W.asn1.DERAbstractString),W.asn1.DERIA5String=function(t){W.asn1.DERIA5String.superclass.constructor.call(this,t),this.hT="16"},Q.lang.extend(W.asn1.DERIA5String,W.asn1.DERAbstractString),W.asn1.DERUTCTime=function(t){W.asn1.DERUTCTime.superclass.constructor.call(this,t),this.hT="17",this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"utc"),this.hV=stohex(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"utc"),this.hV=stohex(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{12}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date))},Q.lang.extend(W.asn1.DERUTCTime,W.asn1.DERAbstractTime),W.asn1.DERGeneralizedTime=function(t){W.asn1.DERGeneralizedTime.superclass.constructor.call(this,t),this.hT="18",this.withMillis=!1,this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=stohex(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=stohex(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{14}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date),!0===t.millis&&(this.withMillis=!0))},Q.lang.extend(W.asn1.DERGeneralizedTime,W.asn1.DERAbstractTime),W.asn1.DERSequence=function(t){W.asn1.DERSequence.superclass.constructor.call(this,t),this.hT="30",this.getFreshValueHex=function(){for(var t="",e=0;e<this.asn1Array.length;e++)t+=this.asn1Array[e].getEncodedHex();return this.hV=t,this.hV}},Q.lang.extend(W.asn1.DERSequence,W.asn1.DERAbstractStructured),W.asn1.DERSet=function(t){W.asn1.DERSet.superclass.constructor.call(this,t),this.hT="31",this.sortFlag=!0,this.getFreshValueHex=function(){for(var t=new Array,e=0;e<this.asn1Array.length;e++){var i=this.asn1Array[e];t.push(i.getEncodedHex())}return 1==this.sortFlag&&t.sort(),this.hV=t.join(""),this.hV},void 0!==t&&void 0!==t.sortflag&&0==t.sortflag&&(this.sortFlag=!1)},Q.lang.extend(W.asn1.DERSet,W.asn1.DERAbstractStructured),W.asn1.DERTaggedObject=function(t){W.asn1.DERTaggedObject.superclass.constructor.call(this),this.hT="a0",this.hV="",this.isExplicit=!0,this.asn1Object=null,this.setASN1Object=function(t,e,i){this.hT=e,this.isExplicit=t,this.asn1Object=i,this.isExplicit?(this.hV=this.asn1Object.getEncodedHex(),this.hTLV=null,this.isModified=!0):(this.hV=null,this.hTLV=i.getEncodedHex(),this.hTLV=this.hTLV.replace(/^../,e),this.isModified=!1)},this.getFreshValueHex=function(){return this.hV},void 0!==t&&(void 0!==t.tag&&(this.hT=t.tag),void 0!==t.explicit&&(this.isExplicit=t.explicit),void 0!==t.obj&&(this.asn1Object=t.obj,this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)))},Q.lang.extend(W.asn1.DERTaggedObject,W.asn1.ASN1Object);var tt,et,it=(tt=function(t,e){return tt=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])},tt(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function i(){this.constructor=t}tt(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),rt=function(t){function e(i){var r=t.call(this)||this;return i&&("string"==typeof i?r.parseKey(i):(e.hasPrivateKeyProperty(i)||e.hasPublicKeyProperty(i))&&r.parsePropertiesFrom(i)),r}return it(e,t),e.prototype.parseKey=function(t){try{var e=0,i=0,r=/^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(t)?function(t){var e;if(void 0===u){var i="0123456789ABCDEF",r=" \f\n\r\t \u2028\u2029";for(u={},e=0;e<16;++e)u[i.charAt(e)]=e;for(i=i.toLowerCase(),e=10;e<16;++e)u[i.charAt(e)]=e;for(e=0;e<r.length;++e)u[r.charAt(e)]=-1}var n=[],s=0,o=0;for(e=0;e<t.length;++e){var h=t.charAt(e);if("="==h)break;if(-1!=(h=u[h])){if(void 0===h)throw new Error("Illegal character at offset "+e);s|=h,++o>=2?(n[n.length]=s,s=0,o=0):s<<=4}}if(o)throw new Error("Hex encoding incomplete: 4 bits missing");return n}(t):g.unarmor(t),n=E.decode(r);if(3===n.sub.length&&(n=n.sub[2].sub[0]),9===n.sub.length){e=n.sub[1].getHexStringValue(),this.n=N(e,16),i=n.sub[2].getHexStringValue(),this.e=parseInt(i,16);var s=n.sub[3].getHexStringValue();this.d=N(s,16);var o=n.sub[4].getHexStringValue();this.p=N(o,16);var h=n.sub[5].getHexStringValue();this.q=N(h,16);var a=n.sub[6].getHexStringValue();this.dmp1=N(a,16);var c=n.sub[7].getHexStringValue();this.dmq1=N(c,16);var f=n.sub[8].getHexStringValue();this.coeff=N(f,16)}else{if(2!==n.sub.length)return!1;if(n.sub[0].sub){var l=n.sub[1].sub[0];e=l.sub[0].getHexStringValue(),this.n=N(e,16),i=l.sub[1].getHexStringValue(),this.e=parseInt(i,16)}else e=n.sub[0].getHexStringValue(),this.n=N(e,16),i=n.sub[1].getHexStringValue(),this.e=parseInt(i,16)}return!0}catch(t){return!1}},e.prototype.getPrivateBaseKey=function(){var t={array:[new W.asn1.DERInteger({int:0}),new W.asn1.DERInteger({bigint:this.n}),new W.asn1.DERInteger({int:this.e}),new W.asn1.DERInteger({bigint:this.d}),new W.asn1.DERInteger({bigint:this.p}),new W.asn1.DERInteger({bigint:this.q}),new W.asn1.DERInteger({bigint:this.dmp1}),new W.asn1.DERInteger({bigint:this.dmq1}),new W.asn1.DERInteger({bigint:this.coeff})]};return new W.asn1.DERSequence(t).getEncodedHex()},e.prototype.getPrivateBaseKeyB64=function(){return f(this.getPrivateBaseKey())},e.prototype.getPublicBaseKey=function(){var t=new W.asn1.DERSequence({array:[new W.asn1.DERObjectIdentifier({oid:"1.2.840.113549.1.1.1"}),new W.asn1.DERNull]}),e=new W.asn1.DERSequence({array:[new W.asn1.DERInteger({bigint:this.n}),new W.asn1.DERInteger({int:this.e})]}),i=new W.asn1.DERBitString({hex:"00"+e.getEncodedHex()});return new W.asn1.DERSequence({array:[t,i]}).getEncodedHex()},e.prototype.getPublicBaseKeyB64=function(){return f(this.getPublicBaseKey())},e.wordwrap=function(t,e){if(!t)return t;var i="(.{1,"+(e=e||64)+"})( +|$\n?)|(.{1,"+e+"})";return t.match(RegExp(i,"g")).join("\n")},e.prototype.getPrivateKey=function(){var t="-----BEGIN RSA PRIVATE KEY-----\n";return(t+=e.wordwrap(this.getPrivateBaseKeyB64())+"\n")+"-----END RSA PRIVATE KEY-----"},e.prototype.getPublicKey=function(){var t="-----BEGIN PUBLIC KEY-----\n";return(t+=e.wordwrap(this.getPublicBaseKeyB64())+"\n")+"-----END PUBLIC KEY-----"},e.hasPublicKeyProperty=function(t){return(t=t||{}).hasOwnProperty("n")&&t.hasOwnProperty("e")},e.hasPrivateKeyProperty=function(t){return(t=t||{}).hasOwnProperty("n")&&t.hasOwnProperty("e")&&t.hasOwnProperty("d")&&t.hasOwnProperty("p")&&t.hasOwnProperty("q")&&t.hasOwnProperty("dmp1")&&t.hasOwnProperty("dmq1")&&t.hasOwnProperty("coeff")},e.prototype.parsePropertiesFrom=function(t){this.n=t.n,this.e=t.e,t.hasOwnProperty("d")&&(this.d=t.d,this.p=t.p,this.q=t.q,this.dmp1=t.dmp1,this.dmq1=t.dmq1,this.coeff=t.coeff)},e}(J),nt=i(155),st=void 0!==nt?null===(et=nt.env)||void 0===et?void 0:"3.3.1":void 0;const ot=function(){function t(t){void 0===t&&(t={}),t=t||{},this.default_key_size=t.default_key_size?parseInt(t.default_key_size,10):1024,this.default_public_exponent=t.default_public_exponent||"010001",this.log=t.log||!1,this.key=null}return t.prototype.setKey=function(t){this.log&&this.key&&console.warn("A key was already set, overriding existing."),this.key=new rt(t)},t.prototype.setPrivateKey=function(t){this.setKey(t)},t.prototype.setPublicKey=function(t){this.setKey(t)},t.prototype.decrypt=function(t){try{return this.getKey().decrypt(l(t))}catch(t){return!1}},t.prototype.encrypt=function(t){try{return f(this.getKey().encrypt(t))}catch(t){return!1}},t.prototype.sign=function(t,e,i){try{return f(this.getKey().sign(t,e,i))}catch(t){return!1}},t.prototype.verify=function(t,e,i){try{return this.getKey().verify(t,l(e),i)}catch(t){return!1}},t.prototype.getKey=function(t){if(!this.key){if(this.key=new rt,t&&"[object Function]"==={}.toString.call(t))return void this.key.generateAsync(this.default_key_size,this.default_public_exponent,t);this.key.generate(this.default_key_size,this.default_public_exponent)}return this.key},t.prototype.getPrivateKey=function(){return this.getKey().getPrivateKey()},t.prototype.getPrivateKeyB64=function(){return this.getKey().getPrivateBaseKeyB64()},t.prototype.getPublicKey=function(){return this.getKey().getPublicKey()},t.prototype.getPublicKeyB64=function(){return this.getKey().getPublicBaseKeyB64()},t.version=st,t}()})(),r.default})()));

    const loadScript=async()=>{
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = "https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js";
        document.head.appendChild(script);
        await new Promise((resolve,reject)=>{script.onload=()=>{resolve()}})
        let elScript = document.createElement('script');
        elScript.setAttribute('type', 'text/javascript');
        elScript.src = "https://unpkg.com/element-plus@2.3.4/dist/index.full.js";
        document.head.appendChild(elScript);
        await new Promise((resolve,reject)=>{elScript.onload=()=>{resolve()}});
    }
    const loadScript2=async()=>{
        let pinYinScript = document.createElement('script');
        pinYinScript.setAttribute('type', 'text/javascript');
        pinYinScript.src = "https://cdn.jsdelivr.net/gh/zh-lx/pinyin-pro@latest/dist/pinyin-pro.js";
        document.head.appendChild(pinYinScript);
        await new Promise((resolve,reject)=>{pinYinScript.onload=()=>{resolve()}})
    }
    await Promise.all([loadScript(),loadScript2()]);


/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("cd49");


/***/ }),

/***/ "00ee":
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "0366":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("4625");
var aCallable = __webpack_require__("59ed");
var NATIVE_BIND = __webpack_require__("40d5");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "04f8":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__("2d00");
var fails = __webpack_require__("d039");
var global = __webpack_require__("da84");

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "06cf":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var call = __webpack_require__("c65b");
var propertyIsEnumerableModule = __webpack_require__("d1e7");
var createPropertyDescriptor = __webpack_require__("5c6c");
var toIndexedObject = __webpack_require__("fc6a");
var toPropertyKey = __webpack_require__("a04b");
var hasOwn = __webpack_require__("1a2d");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "07fa":
/***/ (function(module, exports, __webpack_require__) {

var toLength = __webpack_require__("50c4");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "0cfb":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");
var createElement = __webpack_require__("cc12");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "0d26":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ "0d51":
/***/ (function(module, exports) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "13d2":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var fails = __webpack_require__("d039");
var isCallable = __webpack_require__("1626");
var hasOwn = __webpack_require__("1a2d");
var DESCRIPTORS = __webpack_require__("83ab");
var CONFIGURABLE_FUNCTION_NAME = __webpack_require__("5e77").CONFIGURABLE;
var inspectSource = __webpack_require__("8925");
var InternalStateModule = __webpack_require__("69f3");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "14d9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var toObject = __webpack_require__("7b0b");
var lengthOfArrayLike = __webpack_require__("07fa");
var setArrayLength = __webpack_require__("3a34");
var doesNotExceedSafeInteger = __webpack_require__("3511");
var fails = __webpack_require__("d039");

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ "1626":
/***/ (function(module, exports, __webpack_require__) {

var $documentAll = __webpack_require__("8ea1");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "182d":
/***/ (function(module, exports, __webpack_require__) {

var toPositiveInteger = __webpack_require__("f8cd");

var $RangeError = RangeError;

module.exports = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw $RangeError('Wrong offset');
  return offset;
};


/***/ }),

/***/ "19aa":
/***/ (function(module, exports, __webpack_require__) {

var isPrototypeOf = __webpack_require__("3a9b");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
};


/***/ }),

/***/ "1a2d":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var toObject = __webpack_require__("7b0b");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "1b3b":
/***/ (function(module, exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__("6ce5");


/***/ }),

/***/ "1d02":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var $findLastIndex = __webpack_require__("a258").findLastIndex;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "1d80":
/***/ (function(module, exports, __webpack_require__) {

var isNullOrUndefined = __webpack_require__("7234");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "23cb":
/***/ (function(module, exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__("5926");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "23e7":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
var createNonEnumerableProperty = __webpack_require__("9112");
var defineBuiltIn = __webpack_require__("cb2d");
var defineGlobalProperty = __webpack_require__("6374");
var copyConstructorProperties = __webpack_require__("e893");
var isForced = __webpack_require__("94ca");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "241c":
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__("ca84");
var enumBugKeys = __webpack_require__("7839");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "2834":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var uncurryThis = __webpack_require__("e330");
var aCallable = __webpack_require__("59ed");
var arrayFromConstructorAndList = __webpack_require__("dfb9");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var sort = uncurryThis(ArrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
exportTypedArrayMethod('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor(O), O);
  return sort(A, compareFn);
});


/***/ }),

/***/ "2d00":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var userAgent = __webpack_require__("342f");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "342f":
/***/ (function(module, exports) {

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "3511":
/***/ (function(module, exports) {

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ "3a34":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__("83ab");
var isArray = __webpack_require__("e8b5");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ "3a9b":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "3bbe":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "3c5d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("da84");
var call = __webpack_require__("c65b");
var ArrayBufferViewCore = __webpack_require__("ebb5");
var lengthOfArrayLike = __webpack_require__("07fa");
var toOffset = __webpack_require__("182d");
var toIndexedObject = __webpack_require__("7b0b");
var fails = __webpack_require__("d039");

var RangeError = global.RangeError;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  call($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod('set', function set(arrayLike /* , offset */) {
  aTypedArray(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toIndexedObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS) return call($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GENERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);


/***/ }),

/***/ "3d71":
/***/ (function(module, exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__("2834");


/***/ }),

/***/ "40d5":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "4382":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "44ad":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var fails = __webpack_require__("d039");
var classof = __webpack_require__("c6b6");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "4625":
/***/ (function(module, exports, __webpack_require__) {

var classofRaw = __webpack_require__("c6b6");
var uncurryThis = __webpack_require__("e330");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "485a":
/***/ (function(module, exports, __webpack_require__) {

var call = __webpack_require__("c65b");
var isCallable = __webpack_require__("1626");
var isObject = __webpack_require__("861d");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "4b11":
/***/ (function(module, exports) {

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ "4d64":
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__("fc6a");
var toAbsoluteIndex = __webpack_require__("23cb");
var lengthOfArrayLike = __webpack_require__("07fa");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "4ea1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arrayWith = __webpack_require__("d429");
var ArrayBufferViewCore = __webpack_require__("ebb5");
var isBigIntArray = __webpack_require__("bcbf");
var toIntegerOrInfinity = __webpack_require__("5926");
var toBigInt = __webpack_require__("f495");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays, es/no-array-prototype-with -- required for testing
    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', { 'with': function (index, value) {
  var O = aTypedArray(this);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
} }['with'], !PROPER_ORDER);


/***/ }),

/***/ "50c4":
/***/ (function(module, exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__("5926");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "5692":
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__("c430");
var store = __webpack_require__("c6cd");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.30.2',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.30.2/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "56ef":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");
var uncurryThis = __webpack_require__("e330");
var getOwnPropertyNamesModule = __webpack_require__("241c");
var getOwnPropertySymbolsModule = __webpack_require__("7418");
var anObject = __webpack_require__("825a");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "577e":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("f5df");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "5926":
/***/ (function(module, exports, __webpack_require__) {

var trunc = __webpack_require__("b42e");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "59ed":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var tryToString = __webpack_require__("0d51");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "5c6c":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "5e77":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var hasOwn = __webpack_require__("1a2d");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "6374":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "69f3":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__("cdce");
var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");
var createNonEnumerableProperty = __webpack_require__("9112");
var hasOwn = __webpack_require__("1a2d");
var shared = __webpack_require__("c6cd");
var sharedKey = __webpack_require__("f772");
var hiddenKeys = __webpack_require__("d012");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "6ce5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arrayToReversed = __webpack_require__("df7e");
var ArrayBufferViewCore = __webpack_require__("ebb5");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
exportTypedArrayMethod('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray(this), getTypedArrayConstructor(this));
});


/***/ }),

/***/ "7156":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var isObject = __webpack_require__("861d");
var setPrototypeOf = __webpack_require__("d2bb");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "7234":
/***/ (function(module, exports) {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "7282":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var aCallable = __webpack_require__("59ed");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "7418":
/***/ (function(module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "7839":
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "7b0b":
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__("1d80");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "825a":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("861d");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "83ab":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "861d":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var $documentAll = __webpack_require__("8ea1");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "8925":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var isCallable = __webpack_require__("1626");
var store = __webpack_require__("c6cd");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),

/***/ "8ea1":
/***/ (function(module, exports) {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ "907a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var lengthOfArrayLike = __webpack_require__("07fa");
var toIntegerOrInfinity = __webpack_require__("5926");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod('at', function at(index) {
  var O = aTypedArray(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});


/***/ }),

/***/ "90e3":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "9112":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var definePropertyModule = __webpack_require__("9bf2");
var createPropertyDescriptor = __webpack_require__("5c6c");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "94ca":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");
var isCallable = __webpack_require__("1626");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "986a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__("ebb5");
var $findLast = __webpack_require__("a258").findLast;

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});


/***/ }),

/***/ "9bf2":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var IE8_DOM_DEFINE = __webpack_require__("0cfb");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__("aed9");
var anObject = __webpack_require__("825a");
var toPropertyKey = __webpack_require__("a04b");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "a04b":
/***/ (function(module, exports, __webpack_require__) {

var toPrimitive = __webpack_require__("c04e");
var isSymbol = __webpack_require__("d9b5");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "a258":
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__("0366");
var IndexedObject = __webpack_require__("44ad");
var toObject = __webpack_require__("7b0b");
var lengthOfArrayLike = __webpack_require__("07fa");

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_FIND_LAST_INDEX = TYPE == 1;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var index = lengthOfArrayLike(self);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0: return value; // findLast
        case 1: return index; // findLastIndex
      }
    }
    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};

module.exports = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod(1)
};


/***/ }),

/***/ "aed9":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("83ab");
var fails = __webpack_require__("d039");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "b42e":
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "b622":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var shared = __webpack_require__("5692");
var hasOwn = __webpack_require__("1a2d");
var uid = __webpack_require__("90e3");
var NATIVE_SYMBOL = __webpack_require__("04f8");
var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "b7ef":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__("23e7");
var global = __webpack_require__("da84");
var getBuiltIn = __webpack_require__("d066");
var createPropertyDescriptor = __webpack_require__("5c6c");
var defineProperty = __webpack_require__("9bf2").f;
var hasOwn = __webpack_require__("1a2d");
var anInstance = __webpack_require__("19aa");
var inheritIfRequired = __webpack_require__("7156");
var normalizeStringArgument = __webpack_require__("e391");
var DOMExceptionConstants = __webpack_require__("cf98");
var clearErrorStack = __webpack_require__("0d26");
var DESCRIPTORS = __webpack_require__("83ab");
var IS_PURE = __webpack_require__("c430");

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, constructor: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ }),

/***/ "bcbf":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("f5df");

module.exports = function (it) {
  var klass = classof(it);
  return klass == 'BigInt64Array' || klass == 'BigUint64Array';
};


/***/ }),

/***/ "be66":
/***/ (function(module, exports) {

module.exports = ElementPlus;

/***/ }),

/***/ "c04e":
/***/ (function(module, exports, __webpack_require__) {

var call = __webpack_require__("c65b");
var isObject = __webpack_require__("861d");
var isSymbol = __webpack_require__("d9b5");
var getMethod = __webpack_require__("dc4a");
var ordinaryToPrimitive = __webpack_require__("485a");
var wellKnownSymbol = __webpack_require__("b622");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "c430":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "c65b":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__("40d5");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "c6b6":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "c6cd":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var defineGlobalProperty = __webpack_require__("6374");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "c6e3":
/***/ (function(module, exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__("4ea1");


/***/ }),

/***/ "c8ba":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "ca84":
/***/ (function(module, exports, __webpack_require__) {

var uncurryThis = __webpack_require__("e330");
var hasOwn = __webpack_require__("1a2d");
var toIndexedObject = __webpack_require__("fc6a");
var indexOf = __webpack_require__("4d64").indexOf;
var hiddenKeys = __webpack_require__("d012");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "cb2d":
/***/ (function(module, exports, __webpack_require__) {

var isCallable = __webpack_require__("1626");
var definePropertyModule = __webpack_require__("9bf2");
var makeBuiltIn = __webpack_require__("13d2");
var defineGlobalProperty = __webpack_require__("6374");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "cc12":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isObject = __webpack_require__("861d");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "cd49":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__("8bbf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__("14d9");

// EXTERNAL MODULE: external "ElementPlus"
var external_ElementPlus_ = __webpack_require__("be66");
var external_ElementPlus_default = /*#__PURE__*/__webpack_require__.n(external_ElementPlus_);

// CONCATENATED MODULE: ./src/store/index.ts
const store_rd = '4GS9GhMK';
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAK8nNR1lTnIfIes6oRWJNj3mB6OssDGx0uGMpgpbVCpf6+VwnuI2stmhZNoQcM417Iz7WqlPzbUmu9R4dEKmLGEEqOhOdVaeh9Xk2IPPjqIu5TbkLZRxkY3dJM1htbz57d/roesJLkZXqssfG5EJauNc+RcABTfLb4IiFjSMlTsnAgMBAAECgYEAiz/pi2hKOJKlvcTL4jpHJGjn8+lL3wZX+LeAHkXDoTjHa47g0knYYQteCbv+YwMeAGupBWiLy5RyyhXFoGNKbbnvftMYK56hH+iqxjtDLnjSDKWnhcB7089sNKaEM9Ilil6uxWMrMMBH9v2PLdYsqMBHqPutKu/SigeGPeiB7VECQQDizVlNv67go99QAIv2n/ga4e0wLizVuaNBXE88AdOnaZ0LOTeniVEqvPtgUk63zbjl0P/pzQzyjitwe6HoCAIpAkEAxbOtnCm1uKEp5HsNaXEJTwE7WQf7PrLD4+BpGtNKkgja6f6F4ld4QZ2TQ6qvsCizSGJrjOpNdjVGJ7bgYMcczwJBALvJWPLmDi7ToFfGTB0EsNHZVKE66kZ/8Stx+ezueke4S556XplqOflQBjbnj2PigwBN/0afT+QZUOBOjWzoDJkCQClzo+oDQMvGVs9GEajS/32mJ3hiWQZrWvEzgzYRqSf3XVcEe7PaXSd8z3y3lACeeACsShqQoc8wGlaHXIJOHTcCQQCZw5127ZGs8ZDTSrogrH73Kw/HvX55wGAeirKYcv28eauveCG7iyFR0PFB/P/EDZnyb+ifvyEFlucPUI0+Y87F
-----END RSA PRIVATE KEY-----
`;
// 漫画信息
const store_dmzjProto = {
  "nested": {
    "proto": {
      "fields": {
        "comicInfo": {
          "type": "ComicInfo",
          "id": 3
        }
      }
    },
    "ComicInfo": {
      "fields": {
        "id": {
          "type": "int64",
          "id": 1
        },
        "title": {
          "type": "string",
          "id": 2
        },
        "direction": {
          "type": "int64",
          "id": 3
        },
        "islong": {
          "type": "int64",
          "id": 4
        },
        "cover": {
          "type": "string",
          "id": 6
        },
        "description": {
          "type": "string",
          "id": 7
        },
        "last_updatetime": {
          "type": "int64",
          "id": 8
        },
        "last_update_chapter_name": {
          "type": "string",
          "id": 9
        },
        "first_letter": {
          "type": "string",
          "id": 11
        },
        "comic_py": {
          "type": "string",
          "id": 12
        },
        "hidden": {
          "type": "int64",
          "id": 13
        },
        "hot_num": {
          "type": "int64",
          "id": 14
        },
        "hit_num": {
          "type": "int64",
          "id": 15
        },
        "last_update_chapter_id": {
          "type": "int64",
          "id": 18
        },
        "types": {
          "type": "Types",
          "id": 19,
          "rule": "repeated"
        },
        "status": {
          "type": "Status",
          "id": 20
        },
        "authors": {
          "type": "Authors",
          "id": 21,
          "rule": "repeated"
        },
        "subscribe_num": {
          "type": "int64",
          "id": 22
        },
        "chapters": {
          "type": "Chapters",
          "id": 23,
          "rule": "repeated"
        },
        "is_need_login": {
          "type": "int64",
          "id": 24
        },
        "dh_url_links": {
          "type": "DhUrlLink",
          "id": 27,
          "rule": "repeated"
        }
      }
    },
    "Types": {
      "fields": {
        "tag_id": {
          "type": "int64",
          "id": 1
        },
        "tag_name": {
          "type": "string",
          "id": 2
        }
      }
    },
    "Status": {
      "fields": {
        "tag_id": {
          "type": "int64",
          "id": 1
        },
        "tag_name": {
          "type": "string",
          "id": 2
        }
      }
    },
    "Authors": {
      "fields": {
        "tag_id": {
          "type": "int64",
          "id": 1
        },
        "tag_name": {
          "type": "string",
          "id": 2
        }
      }
    },
    "Data": {
      "fields": {
        "chapter_id": {
          "type": "int64",
          "id": 1
        },
        "chapter_title": {
          "type": "string",
          "id": 2
        },
        "updatetime": {
          "type": "int64",
          "id": 3
        },
        "filesize": {
          "type": "int64",
          "id": 4
        },
        "chapter_order": {
          "type": "int64",
          "id": 5
        }
      }
    },
    "Chapters": {
      "fields": {
        "title": {
          "type": "string",
          "id": 1
        },
        "data": {
          "type": "Data",
          "id": 2,
          "rule": "repeated"
        }
      }
    },
    "DhUrlLink": {
      "fields": {
        "title": {
          "type": "string",
          "id": 1
        }
      }
    }
  }
};
// 章节信息
const store_dmzjProto2 = {
  "nested": {
    "proto": {
      "fields": {
        "chapter": {
          "type": "Chapter",
          "id": 3
        }
      }
    },
    "Chapter": {
      "fields": {
        "chapter_id": {
          "type": "int64",
          "id": 1
        },
        "comic_id": {
          "type": "int64",
          "id": 2
        },
        "title": {
          "type": "string",
          "id": 3
        },
        "chapter_order": {
          "type": "int64",
          "id": 4
        },
        "direction": {
          "type": "int64",
          "id": 5
        },
        "page_url": {
          "type": "string",
          "id": 6,
          "rule": "repeated"
        }
      }
    }
  }
};
/* harmony default export */ var store = ({
  rd: store_rd,
  privateKey,
  dmzjProto: store_dmzjProto,
  dmzjProto2: store_dmzjProto2
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.at.js
var es_typed_array_at = __webpack_require__("907a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-last.js
var es_typed_array_find_last = __webpack_require__("986a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.find-last-index.js
var es_typed_array_find_last_index = __webpack_require__("1d02");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.typed-array.set.js
var es_typed_array_set = __webpack_require__("3c5d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-reversed.js
var esnext_typed_array_to_reversed = __webpack_require__("1b3b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-sorted.js
var esnext_typed_array_to_sorted = __webpack_require__("3d71");

// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.with.js
var esnext_typed_array_with = __webpack_require__("c6e3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__("b7ef");

// CONCATENATED MODULE: ./src/utils/index.ts











const decrypt = new JSEncrypt();
const {
  rd: utils_rd,
  privateKey: utils_privateKey
} = store;
decrypt.setPrivateKey(utils_privateKey);
const utils_request = function () {
  let isRequesting = false;
  function doRequest({
    method,
    url,
    headers,
    data,
    timeout,
    sync = false
  }) {
    if (sync && isRequesting) return;
    isRequesting = true;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data,
        timeout,
        onload(xhr) {
          isRequesting = false;
          // //console.log(xhr.responseText)
          resolve(xhr.responseText);
        },
        onerror(e) {
          isRequesting = false;
          reject(`[请求失败] ${e.message}`);
        },
        ontimeout() {
          isRequesting = false;
          reject('[请求超时]');
        }
      });
    });
  }
  return doRequest;
}();
// const storageJsonTemplate = {
//     isAutoUpdate: false,
//     isGrey: true,
//     comicNum: 0,
//     comicList: [{
//         id: '',
//         hidden: true,
//         isSubscribe: false,
//         banList: [],
//         banList2: [],
//         name: '',
//         lastUpdateChapterName: '',
//         cover: '',
//         lastUpdatetime: '',
//         namePinyin: '',
//         lastUpdateChapterId: ''
//     }]
// }
const storageJsonTemplate = {
  isAutoUpdate: false,
  isGrey: true,
  comicNum: 0,
  comicList: []
};
const utils_initStorage = comicId => {
  comicId = comicId.toString();
  if (isNaN(comicId)) {
    //console.log('[comicId不是数字]', comicId);
    return;
  }
  let storageJson = getStorage();
  let {
    comicList
  } = storageJson;
  let comic = comicList.find(item => item.id == comicId);
  if (!comic) {
    comic = {
      id: comicId,
      banList: [],
      banList2: []
    };
    comicList.push(comic);
    storageJson.comicList = comicList;
    setStorage(storageJson);
  } else {
    utils_syncStorage();
  }
};
const getStorage = () => {
  let storageStr = localStorage.getItem(utils_rd);
  let storageJson = null;
  if (!storageStr) {
    storageJson = storageJsonTemplate;
  } else {
    let res = utils_isConfig(storageStr);
    if (!res) {
      //console.log('[数据格式错误]')
      Object(external_ElementPlus_["ElMessage"])({
        message: '数据格式错误',
        type: 'warning'
      });
      return;
    } else {
      storageJson = JSON.parse(storageStr);
    }
  }
  return storageJson;
};
const setStorage = (storageJson, sync = true) => {
  localStorage.setItem(utils_rd, JSON.stringify(storageJson));
  if (sync) utils_syncStorage();
};
const utils_getStorageItem = key => {
  let storageJson = getStorage();
  if (typeof storageJson[key] == 'undefined') {
    switch (key) {
      case 'isAutoUpdate':
        storageJson[key] = false;
        break;
      case 'isGrey':
        storageJson[key] = true;
        break;
      case 'comicNum':
        storageJson[key] = 0;
        break;
      default:
        break;
    }
  }
  return storageJson[key];
};
const utils_setStorageItem = (key, value, sync = true) => {
  let storageJson = getStorage();
  storageJson[key] = value;
  localStorage.setItem(utils_rd, JSON.stringify(storageJson));
  if (sync) utils_syncStorage();
};
const utils_reg = new RegExp(`https?://manhua.i?dmzj.com/[A-Za-z0-9]+/*$`);
const utils_reg2 = new RegExp(`https?://manhua.i?dmzj.com/[A-Za-z0-9]+/[0-9]+\.shtml\\?comic_id=[0-9]+#@?page=[0-9]*$`);
const utils_reg3 = new RegExp(`https?://manhua.i?dmzj.com/[A-Za-z0-9]+/[0-9]+\.shtml#@?page=[0-9]*$`);
const utils_reg4 = new RegExp(`https?://i.dmzj.com/subscribe`);
const utils_reg5 = new RegExp(`https?://manhua.i?dmzj.com`);
const utils_initSyncStorage = () => {
  if (utils_reg5.test(location.href) || utils_reg4.test(location.href)) {
    if (self != top) {
      var _top;
      let messageEvt = e => {
        let data = e.data;
        if (e.origin != location.origin) {
          //console.log(`[${location.origin}接收数据]`, data)
          if (utils_isConfig(data)) {
            setStorage(data);
            e.source.postMessage('[同步结束]', e.origin);
          }
        }
      };
      window.addEventListener('message', messageEvt);
      (_top = top) === null || _top === void 0 ? void 0 : _top.window.postMessage('[初始化结束]', '*');
    } else {
      let targetUrl = '';
      if (utils_reg5.test(location.href)) {
        targetUrl = 'https://i.dmzj.com/subscribe';
      } else if (utils_reg4.test(location.href)) {
        targetUrl = 'https://manhua.dmzj.com/';
      }
      let iframe = document.querySelector('#storage-iframe');
      if (!iframe) {
        let div = document.createElement('div');
        div.innerHTML = `<iframe id="storage-iframe" src="${targetUrl}" style="display:none"></iframe>`;
        iframe = div.firstElementChild;
        document.body.appendChild(iframe);
      }
      let messageEvt = e => {
        let data = e.data;
        if (e.origin != location.origin) {
          //console.log(`[${location.origin}接收数据]`, data)
          if (data == '[初始化结束]') {
            utils_syncStorage('initEnd');
          } else if (data == '[同步结束]') {
            utils_syncStorage('syncEnd');
          }
        }
      };
      window.addEventListener('message', messageEvt);
    }
  }
};
const utils_syncStorage = (() => {
  let isInitSyncStorageEnd = false;
  let isSyncStoraging = false;
  const preSyncStorage = async status => {
    // 等待iframe的message事件监听结束
    if (!isInitSyncStorageEnd) {
      if (status == 'initEnd') {
        isInitSyncStorageEnd = true;
        return;
      }
      await new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (isInitSyncStorageEnd) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    }
    // 已经在同步中则忽略本次同步请求
    if (status == 'syncEnd') {
      isSyncStoraging = false;
      return;
    }
    if (isSyncStoraging) return;
    if (self != top) return;
    if (utils_reg.test(location.href) || utils_reg2.test(location.href) || utils_reg3.test(location.href)) {
      isSyncStoraging = true;
      doSyncStorage('https://i.dmzj.com/subscribe', 'https://i.dmzj.com/');
    } else if (utils_reg4.test(location.href)) {
      isSyncStoraging = true;
      doSyncStorage('https://manhua.dmzj.com/', 'https://manhua.dmzj.com/');
    }
  };
  const doSyncStorage = async (targetUrl, targetOrigin) => {
    var _iframe$contentWindow;
    let iframe = document.querySelector('#storage-iframe');
    //console.log(`[从${location.origin}发送数据]`, getStorage())
    (_iframe$contentWindow = iframe.contentWindow) === null || _iframe$contentWindow === void 0 ? void 0 : _iframe$contentWindow.postMessage(getStorage(), targetOrigin);
  };
  return preSyncStorage;
})();
const utils_isConfig = data => {
  try {
    if (!utils_isJson(data)) return false;
    let obj = {};
    if (typeof data == 'object') {
      obj = data;
    } else {
      obj = JSON.parse(data);
    }
    let {
      comicList
    } = obj;
    if (!utils_isJson(comicList)) return false;
    let template = {
      id: '',
      banList: [],
      banList2: []
    };
    for (let item of comicList) {
      if (!utils_isJson(item)) return false;
      for (let key in template) {
        if (!item[key]) {
          return false;
        }
      }
      let {
        banList,
        banList2
      } = item;
      let template2 = {
        commentId: ''
      };
      for (let item2 of banList) {
        if (!utils_isJson(item2)) return false;
        for (let key in template2) {
          if (!item2[key]) {
            return false;
          }
        }
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};
const utils_isJson = data => {
  try {
    if (typeof data == 'object' && data) {
      return true;
    } else {
      let obj = JSON.parse(data);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    return false;
  }
};
const utils_getUserInfo = () => {
  let userInfo = null;
  let cookie_my = getCookie("my");
  if (cookie_my) {
    let cookie_arr = cookie_my.split("|");
    let userId = cookie_arr[0];
    let userName = decodeURI(cookie_arr[1]);
    let isLogin = true;
    let token = cookie_arr.slice(-1).toString();
    userInfo = {
      cookie_my,
      userId,
      userName,
      isLogin,
      token
    };
  }
  return userInfo;
};
const getCookie = cookie_name => {
  let allcookies = document.cookie;
  let cookie_pos = allcookies.indexOf(cookie_name);
  let value = '';
  if (cookie_pos != -1) {
    cookie_pos += cookie_name.length + 1;
    let cookie_end = allcookies.indexOf(";", cookie_pos);
    if (cookie_end == -1) {
      cookie_end = allcookies.length;
    }
    value = unescape(allcookies.substring(cookie_pos, cookie_end));
  }
  return value;
};
const utils_dmzjDecrypt = str => {
  let decode = base64ToArrayBuffer(str);
  let length = decode.length;
  let i10 = 0;
  let i11 = 0;
  let bytes = [];
  while (true) {
    let i12 = length - i10;
    if (i12 > 0) {
      bytes = bytes.concat(decrypt.decrypt(arrayBufferToBase64(decode.slice(i10, i10 + 128))));
      i11++;
      i10 = i11 * 128;
    } else {
      break;
    }
  }
  return Uint8Array.from(bytes);
};
const base64ToArrayBuffer = str => {
  let binaryString = atob(str);
  let bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
const arrayBufferToBase64 = buffer => {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
const utils_createElementFromHtml = html => {
  let div = document.createElement('div');
  div.innerHTML = html;
  if (div.children.length > 1) {
    let eles = [];
    for (let ele of div.children) {
      eles.push(ele);
    }
    return eles;
  } else {
    return div.firstElementChild;
  }
};
const utils_formatDateYYYYMMDD = date => {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return year + '-' + (month + 1).toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
};
const utils_addScript = async (script, sync = false) => {
  let scriptEle = document.createElement('script');
  scriptEle.setAttribute('type', 'text/javascript');
  if (new RegExp('^(http|https)').test(script)) {
    scriptEle.src = script;
  } else {
    scriptEle.innerText = script;
  }
  document.head.appendChild(scriptEle);
  if (sync === true) {
    await new Promise(resolve => scriptEle.onload = () => resolve());
  }
};
const utils_addCss = async css => {
  let cssEle = null;
  if (new RegExp('^(http|https)').test(css)) {
    cssEle = document.createElement('link');
    cssEle.setAttribute('rel', 'stylesheet');
    cssEle.href = css;
  } else {
    cssEle = document.createElement('style');
    cssEle.innerText = css;
  }
  document.head.appendChild(cssEle);
};
const utils_getUrlParam = param => {
  var query = location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == param) {
      return pair[1];
    }
  }
  return false;
};
/* harmony default export */ var utils = ({
  request: utils_request,
  initStorage: utils_initStorage,
  syncStorage: utils_syncStorage,
  initSyncStorage: utils_initSyncStorage,
  isJson: utils_isJson,
  getUserInfo: utils_getUserInfo,
  dmzjDecrypt: utils_dmzjDecrypt,
  createElementFromHtml: utils_createElementFromHtml,
  formatDateYYYYMMDD: utils_formatDateYYYYMMDD,
  addScript: utils_addScript,
  addCss: utils_addCss,
  getUrlParam: utils_getUrlParam,
  getStorageItem: utils_getStorageItem,
  setStorageItem: utils_setStorageItem,
  isConfig: utils_isConfig
});
// CONCATENATED MODULE: ./src/assets/page1/text.ts


const {
  pinyin: text_pinyin
} = pinyinPro;
const {
  rd: text_rd
} = store;
const {
  formatDateYYYYMMDD: text_formatDateYYYYMMDD
} = utils;
const cssHTML = `
.search_b_box {
    width: 288px !important;
}

.anim_intro_ptext {
    position: relative;
}

.svg-container {
    display: none;
    position: absolute;
    width: 150px;
    height: 200px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.3);
}

.svg-container>svg{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50%;
    height: auto;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
}

.anim_intro_ptext:hover>.svg-container {
    display: block;
}

.cartoon_online_button.margin_top_10px {
    height: 0;
}

.cartoon_online_button.margin_top_10px .b1{
    display: none;
}

.ads-manhua {
    display: none;
}

.anim_grade {
    display: none;
}

#type_comics {
    display: none;
}

#type_comics+a {
    display: none !important;
}

.middleright_mr:nth-child(1) .h2_title2 {
    margin-bottom: 0;
}

.line_height_content {
    white-space: pre-line;
}

.comment_con_li:last-child {
    border-bottom: none !important;
}

.removeBan {
    display: none;
    position: absolute;
    right: 20px;
    top: 0;
}

.comment_tab {
    position: relative;
}

.showBan {
    position: absolute;
    right: 0;
    top: 0;
}

.isBan {
    display: none;
}

.comment_con_li:hover>.removeBan {
    display: block;
}

.footer {
    display: none;
}
`;
const cssHTML2 = `
.anim_intro_ptext {
	position: relative;
}

.svg-container {
	display: none;
	position: absolute;
	width: 150px;
	height: 200px;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(0, 0, 0, 0.3);
}

.svg-container>svg {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 50%;
	height: auto;
	transform: translate(-50%, -50%);
	color: rgba(255, 255, 255, 0.9);
	cursor: pointer;
}

.anim_intro_ptext:hover>.svg-container {
	display: block;
}

.cartoon_online_border {
	border: 1px dashed #0187c5;
}

.el-popup-parent--hidden {
	width: initial !important;
}
`;
const tagMap = [{
  tagId: 4,
  tagName: '冒险',
  tagNamePinyin: 'maoxian'
}, {
  tagId: 5,
  tagName: '欢乐向',
  tagNamePinyin: 'huanle'
}, {
  tagId: 6,
  tagName: '格斗',
  tagNamePinyin: 'gedou'
}, {
  tagId: 7,
  tagName: '科幻',
  tagNamePinyin: 'kehuan'
}, {
  tagId: 8,
  tagName: '爱情',
  tagNamePinyin: 'aiqing'
}, {
  tagId: 9,
  tagName: '侦探',
  tagNamePinyin: 'zhentan'
}, {
  tagId: 10,
  tagName: '竞技',
  tagNamePinyin: 'jingji'
}, {
  tagId: 11,
  tagName: '魔法',
  tagNamePinyin: 'mofa'
}, {
  tagId: 12,
  tagName: '神鬼',
  tagNamePinyin: 'shengui'
}, {
  tagId: 13,
  tagName: '校园',
  tagNamePinyin: 'xiaoyuan'
}, {
  tagId: 14,
  tagName: '惊悚',
  tagNamePinyin: 'kongbu'
}, {
  tagId: 16,
  tagName: '其他',
  tagNamePinyin: 'qita'
}, {
  tagId: 17,
  tagName: '四格',
  tagNamePinyin: 'sige'
}, {
  tagId: 3242,
  tagName: '生活',
  tagNamePinyin: 'shenghuo'
}, {
  tagId: 3243,
  tagName: 'ゆり',
  tagNamePinyin: 'baihe'
}, {
  tagId: 3244,
  tagName: '秀吉',
  tagNamePinyin: 'weiniang'
}, {
  tagId: 3245,
  tagName: '悬疑',
  tagNamePinyin: 'xuanyi'
}, {
  tagId: 3246,
  tagName: '纯爱',
  tagNamePinyin: 'chunai'
}, {
  tagId: 3248,
  tagName: '热血',
  tagNamePinyin: 'rexue'
}, {
  tagId: 3249,
  tagName: '泛爱',
  tagNamePinyin: 'hougong'
}, {
  tagId: 3250,
  tagName: '历史',
  tagNamePinyin: 'lishi'
}, {
  tagId: 3251,
  tagName: '战争',
  tagNamePinyin: 'zhanzheng'
}, {
  tagId: 3252,
  tagName: '萌系',
  tagNamePinyin: 'mengxi'
}, {
  tagId: 3253,
  tagName: '宅系',
  tagNamePinyin: 'zhaixi'
}, {
  tagId: 3254,
  tagName: '治愈',
  tagNamePinyin: 'zhiyu'
}, {
  tagId: 3255,
  tagName: '励志',
  tagNamePinyin: 'lizhi'
}, {
  tagId: 3324,
  tagName: '武侠',
  tagNamePinyin: 'wuxia'
}, {
  tagId: 3325,
  tagName: '机战',
  tagNamePinyin: 'jizhan'
}, {
  tagId: 3326,
  tagName: '音乐舞蹈',
  tagNamePinyin: 'yinyue'
}, {
  tagId: 3327,
  tagName: '美食',
  tagNamePinyin: 'meishi'
}, {
  tagId: 3328,
  tagName: '职场',
  tagNamePinyin: 'zhichang'
}, {
  tagId: 3365,
  tagName: '西方魔幻',
  tagNamePinyin: 'mohuan'
}, {
  tagId: 4459,
  tagName: '高清单行',
  tagNamePinyin: 'gaoqing'
}, {
  tagId: 4518,
  tagName: 'TS',
  tagNamePinyin: 'xingzhuanhuan'
}, {
  tagId: 5077,
  tagName: '东方',
  tagNamePinyin: 'touhou'
}, {
  tagId: 5806,
  tagName: '魔幻',
  tagNamePinyin: 'mhuan'
}, {
  tagId: 5848,
  tagName: '奇幻',
  tagNamePinyin: 'qihuan'
}, {
  tagId: 6219,
  tagName: '节操',
  tagNamePinyin: 'jiecao'
}, {
  tagId: 6316,
  tagName: '轻小说',
  tagNamePinyin: 'qingxiaoshuo'
}, {
  tagId: 6437,
  tagName: '颜艺',
  tagNamePinyin: 'yanyi'
}, {
  tagId: 7568,
  tagName: '搞笑',
  tagNamePinyin: 'gaoxiao'
}, {
  tagId: 7900,
  tagName: '仙侠',
  tagNamePinyin: 'lianzaizhong'
}, {
  tagId: 13627,
  tagName: '舰娘',
  tagNamePinyin: 'jianniang'
}, {
  tagId: 17192,
  tagName: '动画',
  tagNamePinyin: 'donghua'
}, {
  tagId: 18522,
  tagName: 'AA',
  tagNamePinyin: 'aamanhua'
}, {
  tagId: 23323,
  tagName: '福瑞',
  tagNamePinyin: 'furui'
}, {
  tagId: 23388,
  tagName: '生存',
  tagNamePinyin: 'shengcun'
}, {
  tagId: 23399,
  tagName: '2021大赛',
  tagNamePinyin: 'lianzaizhong'
}, {
  tagId: 25011,
  tagName: '未来漫画家',
  tagNamePinyin: 'lianzaizhong'
}];
const replyBoxHTML = `
<div class="reply_box">
    <div class="textareaDiv"><textarea name="textfield" class="textare" placeholder=""></textarea></div>
    <div class="func_area">
        <div class="ficon_img" style="margin-top: 16px;"></div>
        <a class="SubmitBtn">发表</a>
        <a class="CancelBtn">取消</a>
        <p class="num_S_txt">您还可以输入<span>1000</span>字</p>
    </div>
</div>
`;
const popboxHTML = name => {
  return `
    <div class="window_show"></div>
    <div class="point_wrap" id="scribe_window" style="display: block;">
        <div class="close_scri" onclick="close_window_s()"></div>
        <div class="point_wrap_head">
            <p>提示信息</p>
        </div>
        <div class="point_wrap_con point_succes">
            <p class="dy_success">您已经成功订阅了"<a href="javascript:;" class="c">${name}</a>"</p>
            <p class="noti">如果该作品更新，系统将及时通知您。</p>
            <p class="manag"><a href="https://i.dmzj.com/subscribe" target="_blank"><i>管理你的订阅</i></a></p><a
                href="javascript:;" class="su_btn_scri" onclick="close_window_s()">确定</a>
        </div>
    </div>
    `;
};
const popboxHTML2 = name => {
  return `
    <div class="window_show"></div>
    <div class="point_wrap" id="scribe_window" style="display: block;">
        <div class="close_scri" onclick="close_window_s()"></div>
        <div class="point_wrap_head">
            <p>提示信息</p>
        </div>
        <div class="point_wrap_con point_succes">
            <p class="dy_success" style="margin-bottom: 20px;">取消订阅成功！</p>
            <p class="manag"><a href="https://i.dmzj.com/subscribe" target="_blank"><i>管理你的订阅</i></a></p><a
                href="javascript:;" class="su_btn_scri" onclick="close_window_s()">确定</a>
        </div>
    </div>
    `;
};
const tbodyHTML = ({
  alias,
  authors,
  area,
  serialStatus,
  heatNum,
  tags,
  lastUpdatetime,
  lastUpdateChapterId,
  lastUpdateChapterName,
  namePinyin,
  id
}) => {
  let authorsHTML = '';
  for (let author of authors) {
    authorsHTML += `<a target="_blank" href="../author/1829.shtml">${author.tag_name} </a><br>`;
  }
  let areaHTML = area ? `<a target="_blank" href="../tags/${text_pinyin(area, {
    toneType: 'none'
  }).replace(/\s*/g, '')}.shtml" alt="${area}">${area}</a>` : '';
  let serialStatusHTML = serialStatus.tag_name == '连载中' ? 'lianzaizhong' : 'yiwanjie';
  let tagHTML = '';
  for (let tag of tags) {
    var _tagMap$find;
    let tagNamePinyin = (_tagMap$find = tagMap.find(item => item.tagId == tag.tag_id)) === null || _tagMap$find === void 0 ? void 0 : _tagMap$find.tagNamePinyin;
    tagHTML += `<a target="_blank" href="../tags/${tagNamePinyin}.shtml">${tag.tag_name}</a>&nbsp;`;
  }
  let last_updatetime2 = text_formatDateYYYYMMDD(new Date(lastUpdatetime * 1000));
  return `
    <tr style="display:${alias ? '' : 'none'}">
        <th>别名：</th>
        <td>${alias}</td>
    </tr>
    <!-- <tr>
        <th>原名：</th>
        <td></td>
    </tr> -->
    <tr style="display:${authorsHTML ? '' : 'none'}">
        <th>作者：</th>
        <td>${authorsHTML}</td>
    </tr>
    <tr style="display:${areaHTML ? '' : 'none'}">
        <th>地域：</th>
        <td>${areaHTML}</td>
    </tr>
    <tr>
        <th>状态：</th>
        <td><a target="_blank" href="../tags/${serialStatusHTML}.shtml" alt="${serialStatus.tag_name}">${serialStatus.tag_name}</a></td>
    </tr>
    <tr>
        <th>人气：</th>
        <td id="hot_hits">${heatNum}</td>
    </tr>
    <tr>
        <th>题材：</th>
        <td>${tagHTML}</td>
    </tr>
    <!-- <tr>
        <th>分类：</th>
        <td><a title="" href=""></a></td>
    </tr> -->
    <tr>
        <th>最新收录：</th>
        <td><a target="_blank" href="${location.origin}/${namePinyin}/${lastUpdateChapterId}.shtml?comic_id=${id}#@page=1">${lastUpdateChapterName}</a>&nbsp;<br><span class="update2">${last_updatetime2}</span></td>
    </tr>
    `;
};
const chapterListHTML = (comicInfo, hasMore = false) => {
  let html = '';
  for (let chapter of comicInfo.chapterList) {
    let {
      id,
      chapter_name,
      updatetime
    } = chapter;
    let isUpdateDay = text_formatDateYYYYMMDD(new Date(updatetime * 1000)) == text_formatDateYYYYMMDD(new Date(comicInfo.lastUpdatetime * 1000));
    if (isUpdateDay) {
      html += `<li><a class="color_red" target="_blank" title="${comicInfo.name}-${chapter_name}" href="${location.origin}/${comicInfo.namePinyin}/${id}.shtml?comic_id=${comicInfo.id}#@page=1">${chapter_name}</a></li>`;
    } else {
      html += `<li><a target="_blank" title="${comicInfo.name}-${chapter_name}" href="${location.origin}/${comicInfo.namePinyin}/${id}.shtml?comic_id=${comicInfo.id}#@page=1">${chapter_name}</a></li>`;
    }
  }
  let html2 = '';
  if (hasMore === true) html2 = '<li id="load-all-btn" style="cursor:pointer;color:#0187c5;text-decoration:underline">加载全部</li>';
  return `<ul>${html}${html2}</ul><div class="clearfix"></div>`;
};
const scriptHTML = comicId => {
  return `
    var commment_type = '4';
    var is_Original='0';
    var obj_id = "${comicId}";
    var authoruid = "";
    `;
};
const scriptHTML2 = (comicId, token) => {
  return `
    comment_news.getAllComment=(cur_page=1)=>{
        comment_news.click_type=0;
        $('#commentAll').html('');
        var url='https://v3comment.idmzj.com/v1/4/latest/${comicId}?page_index='+cur_page+'&limit=30';
        var data='page_index='+cur_page;
        var callback = function(json){
            comment_news.commentTotal = json.total;
            $(".comment_num em").html(json.total);
            var commentIds = json.commentIds;
            var comments = json.comments;
            $(".loading").hide();
            if (commentIds.length == 0){
                $("#commentAll").html("暂无评论");
                return false;
            }
            for (var i = 0; i < commentIds.length; i++){
                var dataArr = commentIds[i].split(',');
                var data0 = dataArr[0];
                allComment_Html(comments[data0], 'commentAll', cur_page, i);
                if (dataArr.length > 1){
                    var newData = dataArr.slice(1);
                    newData.reverse();
                    child_html_n(newData, comments, data0);
                }
            }
            publicClass.setPage(page_new, comment_news.commentTotal, cur_page, comment_news.getAllComment, 30);
            comment_news.currPage = cur_page;
            comment_news.hide_gg(cur_page);
            comment_news.toCommentTop();
        };
        comment_news.get_json(url, data, callback, "comment_list_s");
    };
    comment_news.add=(obj, to_uid, to_comment_id, origin_comment_id)=>{
        comment_news.click_type = 1;
        var centent = encodeURIComponent($.trim($(obj).parent().siblings(".textareaDiv").find(".textare").val()));
        var clickFunc = $(obj).attr('onclick');
        var clickText = $(obj).html();
        if (!comment_news.is_login) {
            alert('您必须登录后才能评论');
            return false;
        };
        if (centent == "") {
            alert("评论不能为空");
            return false;
        };
        $(obj).attr('onclick', '').addClass('SubBtn_load').html('发表中..');
        var _to_uid = (to_uid == 0) ? 0 : to_uid;
        var _to_comment_id = (to_comment_id == 0) ? 0 : to_comment_id;
        var _origin_comment_id = (to_uid == 0) ? 0 : origin_comment_id;
        var img_src = $("#hiddenInput").val();
        var url='https://v3comment.idmzj.com/v1/4/new/add/app?';
        var data = 'to_comment_id='+_to_comment_id+'&obj_id=${comicId}&sender_terminal=1&origin_comment_id='+_origin_comment_id+'&uid='+comment_news.user_id+'&to_uid='+_to_uid+'&content='+centent+'&dmzj_token=${token}&img='+img_src;
        console.log(0,url);
		console.log(0,data);
        url+=data;
        console.log(0,url);
        $.ajax({
            type: 'get',
            url: url,
            cache: true,
            timeout: 30000,
            success: function (json) {
                $(obj).attr('onclick', clickFunc).removeClass('SubBtn_load').html(clickText);
                var code, result;
                if (!(typeof(json.code) == 'undefined')) {
                    code = json.code
                }
                if (!(typeof(json.result) == 'undefined')) {
                    result = json.result
                }
                console.log(json);
                console.log(code);
                console.log(result);
                if (code == 0 || result == 1000) {
                    var data = json.data;
                    console.log(data);
                    alert(json.msg);
                    if (comment_news.currPage == 1 && comment_news.parentName == 'new') {
                        comment_news.getAllComment(1);
                    }
                    $(obj).parent().siblings(".textareaDiv").find(".textare").val("");
                    $(obj).siblings(".num_S_txt").html("您还可以输入<span>1000</span>个字");
                    upload_pic.reset();
                    addComicHot(obj);
                    comment_news.replyClose($("#reply_box_" + to_comment_id));
                } else if (json.result == 2001) {
                    $("body").append(telZc);
                    boxzctel();
                } else {
                    alert(json.msg);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }
    `;
};
const banBtnHTML = commentId => {
  return `
    <a class="handl good banBtn" data-commentid="${commentId}">屏蔽</a>
    `;
};
const cssHTML3 = `
.comment_tab{
    position: relative;
}
.comment_tab #toggle-show-ban-btn{
    position: absolute;
    height:0;
    right: 0;
    top: 0;
    cursor: pointer;
    text-decoration: underline;
    color: #1790e6;
}
#commentAll .handl.good.banBtn{
    display: none !important;
}
#commentAll>.comment_con_li.autoHeight>.text.ban{
    display: none;
    position: relative;
}
#commentAll>.comment_con_li.autoHeight>.text.ban .remove-ban{
    position: absolute;
    right: 0;
    top: -1px;
}
#commentAll>.comment_con_li.autoHeight:hover>.content_r.autoHeight>.btm_bar>.handl.good.banBtn{
    display: block !important;
}
#commentAll .reply_content .comment_con_li.autoHeight .text.ban{
    display: none;
    color: #ff0000;
}
#commentAll .reply_content .comment_con_li.autoHeight .text.ban .remove-ban{
    display: none;
    position: absolute;
    right: 20px;
    top: -3px;
    font-size: 12px;
    color: #0187c5;
    margin-top: 0;
}
#commentAll .reply_content .comment_con_li.autoHeight:hover .btm_bar>.handl.good.banBtn{
    display: block !important;
}
#commentAll .reply_content .comment_con_li.autoHeight:hover .text.ban .remove-ban{
    display: block;
}
`;
const banCommentHTML = (floor, commentid) => {
  return `
    <p class="text ban"><span class="textCon">此评论已被屏蔽<a class="remove-ban" data-commentid="${commentid}">解除屏蔽</a><span class="floor">${floor}</span></span></p>
    `;
};
/* harmony default export */ var page1_text = ({
  cssHTML,
  cssHTML2,
  tagMap,
  replyBoxHTML,
  popboxHTML,
  popboxHTML2,
  tbodyHTML,
  chapterListHTML,
  scriptHTML,
  scriptHTML2,
  banBtnHTML,
  cssHTML3,
  banCommentHTML
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page1/comic.vue?vue&type=script&setup=true&lang=js


const _hoisted_1 = ["innerHTML"];



/* harmony default export */ var comicvue_type_script_setup_true_lang_js = ({
  __name: 'comic',
  props: ['condition', 'comicUrl'],
  emits: ['updateComicId', 'updateUserInfo', 'updatePageLoadStatus'],
  setup(__props, {
    emit
  }) {
    const {
      condition,
      comicUrl
    } = __props;
    const {
      pinyin
    } = pinyinPro;
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils,
      $store
    } = proxy;
    const {
      request,
      initStorage,
      dmzjDecrypt,
      createElementFromHtml,
      isJson,
      getStorageItem,
      setStorageItem
    } = $utils;
    const {
      rd,
      dmzjProto
    } = $store;
    const userInfo = {
      cookie_my: '',
      userId: '',
      userName: '',
      isLogin: '',
      token: ''
    };
    let html = Object(external_Vue_["ref"])('');
    const comicInfo = Object(external_Vue_["reactive"])({
      id: '',
      name: '',
      namePinyin: '',
      alias: '',
      firstLetter: '',
      authors: '',
      cover: '',
      subscribeNum: '',
      serialStatus: '',
      heatNum: '',
      tags: '',
      lastUpdateChapterId: '',
      lastUpdateChapterName: '',
      lastUpdatetime: '',
      description: '',
      area: '',
      chapterList: []
    });
    Object(external_Vue_["watch"])(() => [comicInfo.name, html], async ([comicId, html]) => {
      switch (condition) {
        case 3:
          if (comicId && html.value) {
            await Object(external_Vue_["nextTick"])();
            emit('updatePageLoadStatus', 'loadEnd');
            fillPage();
          }
          break;
        default:
          break;
      }
    });
    Object(external_Vue_["onMounted"])(async () => {
      Object.assign(userInfo, $utils.getUserInfo());
      //console.log('[用户信息]', userInfo)
      emit('updateUserInfo', userInfo);
      switch (condition) {
        case 1:
          comicInfo.id = g_comic_id;
          break;
        case 2:
          addCss2();
          comicInfo.id = g_comic_id;
          break;
        case 3:
          // 避免清除自身以及用于跨域数据同步的iframe
          let doms = document.querySelectorAll(`body>*:not(#app_${rd}):not(#storage-iframe):not(.mainNav):not(.book_wrap)`);
          for (let dom of doms) dom.remove();
          addCss();
          initPage();
          comicInfo.id = (await getComicId()) || '';
          break;
        default:
          break;
      }
      //console.log('[漫画id]', comicInfo.id)
      if (!comicInfo.id) return;
      emit('updateComicId', comicInfo.id);
      initStorage(comicInfo.id);
      await getComicInfo();
      switch (condition) {
        case 2:
          subscribeNew();
          break;
        default:
          break;
      }
      switch (condition) {
        case 2:
        case 3:
          unblockChapters();
          try {
            comicInfo.lastUpdateChapterId = comicInfo.lastUpdateChapterId || g_last_chapter_id;
          } catch (error) {
            //console.log('[异常]', error)
          }
          if (!comicInfo.lastUpdateChapterId) return;
          if (comicInfo.chapterList.length == 0) {
            await getChapterOneByOne();
          } else {
            await getChapterOneByOne2();
          }
          break;
        default:
          break;
      }
      //console.log('[执行脚本结束]');
    });

    const addCss = () => {
      $utils.addCss(page1_text.cssHTML);
    };
    const addCss2 = () => {
      $utils.addCss(page1_text.cssHTML2);
    };
    const initPage = async () => {
      let pageTemplate = null;
      try {
        pageTemplate = await getPageTemplate();
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!pageTemplate) return;
      html.value = pageTemplate;
      await Object(external_Vue_["nextTick"])();
      formatPage();
    };
    const getPageTemplate = () => {
      return request({
        method: 'get',
        url: 'https://manhua.dmzj.com/kanonair'
      });
    };
    const formatPage = () => {
      document.querySelector('.path_lv3').innerHTML = '<span class="icon20"></span><a href="../">在线漫画 </a> &gt;&gt;<a href="../tags/riben.shtml">日本漫画</a>&nbsp;<a href="../tags/.shtml">首字母</a> &gt;&gt; ';
      document.querySelector('.anim_intro_ptext>a').href = location.href;
      document.querySelector('#cover_pic').alt = '';
      document.querySelector('#cover_pic').src = '';
      document.querySelector('#subscribe_num').innerHTML = '';
      document.querySelector('#subscribe_id').removeAttribute('onclick');
      document.querySelector('.anim-main_list tbody').innerHTML = '<tr> <th>别名：</th> <td></td> </tr> <tr> <th>原名：</th> <td></td> </tr> <tr> <th>作者：</th> <td><a href=""></a><br></td> </tr> <tr> <th>地域：</th> <td><a href="" alt=""></a></td> </tr> <tr> <th>状态：</th> <td><a href="" alt=""></a></td> </tr> <tr> <th>人气：</th> <td id="hot_hits"></td> </tr> <tr> <th>题材：</th> <td><a href=""></a>&nbsp;</td> </tr> <tr> <th>分类：</th> <td><a title="" href=""></a></td> </tr> <tr> <th>最新收录：</th> <td> <a target="_blank" href=""></a>&nbsp;<br> <span class="update2"></span> </td> </tr>';
      document.querySelector('.cartoon_online_border').innerHTML = '';
      document.querySelector('.odd_anim_title_m').innerHTML = '<span class="anim_title_text"><a href=""><h1></h1></a></span> &nbsp;(&nbsp;最新收录：<a target="_blank" href="//.shtml?comic_id=#@page=1" id="newest_chapter"></a>) <span class="update"></span>';
      document.querySelector('.middleright_mr>.photo_part>.h2_title2').innerHTML = '<span class="msg"> </span> <span class="h2_icon h2_icon22"></span> <h2> 在线漫画全集</h2>';
      document.querySelector('.middleright_mr.margin_top_10px>.photo_part>.h2_title2>h2').innerText = ' 详细介绍';
      document.querySelector('.line_height_content').innerHTML = '';
      document.querySelector('.impunity').innerHTML = '本页漫画内容均来自互联网，动漫之家漫画网与内容的出处无关，如有违反您的权益，或您发现有任何不良内容或图片错误，【<a href="http://i.178.com/~sms.index.view_send_form/reciever/長瀬湊/uid/2600003" target="_blank">请与我们联系</a>】，我们将修正该漫画图片';
    };
    const getComicId = async () => {
      let nameList = await Promise.all([getComicNameFromUrl(), getComicNameFromUrl2(), getComicNameFromUrl3()]);
      let comicName = nameList.find(item => item);
      if (!comicName) {
        Object(external_ElementPlus_["ElMessage"])({
          message: '未匹配到漫画名，可以刷新一下试试',
          type: 'warning'
        });
        return;
      }
      let comicList = [];
      try {
        let res = await request({
          method: 'get',
          url: `https://sacg.dmzj.com/comicsum/search.php?s=${comicName}`
        });
        let strStart = 'var g_search_data =';
        let indexStart = res.indexOf(strStart);
        comicList = JSON.parse(res.slice(indexStart + strStart.length, res.length - 1));
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (comicList.length == 0) {
        Object(external_ElementPlus_["ElMessage"])({
          message: '未搜索到相关漫画',
          type: 'warning'
        });
        return;
      }
      let comic = comicList.find(item => {
        return item.comic_name == comicName || item.comic_name.indexOf(comicName) > -1 || comicName.indexOf(item.comic_name) > -1;
      });
      if (!comic) {
        Object(external_ElementPlus_["ElMessage"])({
          message: '未搜索到相关漫画',
          type: 'warning'
        });
        return;
      }
      return comic.id;
    };
    const getComicNameFromUrl = async () => {
      let nameList = [];
      try {
        let res = await request({
          method: 'post',
          url: 'https://manga.bilibili.com/twirp/comic.v1.Comic/SearchSug',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: JSON.stringify({
            'term': comicUrl,
            'num': 20
          }),
          timeout: 3000
        });
        nameList = JSON.parse(res).data;
      } catch (e) {
        return;
      }
      return matchComicName(nameList);
    };
    const getComicNameFromUrl2 = async () => {
      let nameList = [];
      try {
        let res = await request({
          method: 'get',
          url: `https://api.soman.com/soman.ashx?action=getsomankeywordmatch&pageindex=1&pagesize=6&keyword=${comicUrl}`,
          headers: {
            'Referer': 'application/json;charset=UTF-8'
          },
          timeout: 3000
        });
        nameList = JSON.parse(res);
      } catch (e) {
        return;
      }
      return matchComicName(nameList);
    };
    const getComicNameFromUrl3 = async () => {
      let nameList = [];
      try {
        let res = await request({
          method: 'get',
          url: `https://www.1kkk.com/search.ashx?d=${new Date().getTime()}&t=${comicUrl}&language=1`,
          timeout: 3000
        });
        let div = document.createElement('div');
        div.innerHTML = res;
        let list = div.querySelectorAll('.left');
        for (let item of list) {
          if (item.innerText) {
            nameList.push(item.innerText);
          }
        }
      } catch (e) {
        return;
      }
      return matchComicName(nameList);
    };
    const matchComicName = nameList => {
      let comicName = nameList.find(item => {
        let comicNamePinyin = pinyin(item, {
          toneType: 'none'
        }).replace(/\s*/g, '').toLowerCase();
        return comicNamePinyin == comicUrl || comicNamePinyin.indexOf(comicUrl) > -1 || comicUrl.indexOf(comicNamePinyin) > -1;
      });
      return comicName;
    };
    const getComicInfo = async () => {
      let tempComicInfo = null;
      try {
        let str = await request({
          method: 'get',
          url: `https://v4api.idmzj.com/comic/detail/${comicInfo.id}?uid=2665531&disable_level=1`
        });
        let bytes = dmzjDecrypt(str);
        let root = protobuf.Root.fromJSON(dmzjProto);
        let message = root.lookupType('proto');
        let data = message.decode(bytes);
        tempComicInfo = data.comicInfo;
      } catch (error) {
        //console.log('[异常]', error)
      }
      let chapterList = [];
      let data = null;
      try {
        let res = await request({
          method: 'get',
          url: `https://api.dmzj.com/dynamic/comicinfo/${comicInfo.id}.json`
        });
        data = JSON.parse(res);
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (data && data.result == 1) {
        let info = data.data.info;
        for (let key in info) {
          if (!tempComicInfo[key]) {
            tempComicInfo[key] = info[key];
          }
        }
        chapterList = data.data.list;
        let alone = data.data.alone;
        if (alone) {
          chapterList = chapterList.concat(alone);
        }
      }
      for (let chapter of tempComicInfo.chapters) {
        for (let item of chapter.data) {
          if (!chapterList.find(item2 => item2.id == item.chapter_id)) {
            chapterList.push({
              ...item,
              id: item.chapter_id,
              chapter_name: item.chapter_title
            });
          }
        }
      }
      chapterList.sort((a, b) => {
        return a.chapter_order - b.chapter_order;
      });
      const tempComicInfo2 = {
        name: tempComicInfo.title,
        namePinyin: tempComicInfo.comic_py,
        alias: tempComicInfo.subtitle,
        firstLetter: tempComicInfo.first_letter,
        authors: tempComicInfo.authors,
        cover: tempComicInfo.cover,
        subscribeNum: tempComicInfo.subscribe_num,
        serialStatus: tempComicInfo.status,
        heatNum: tempComicInfo.hot_num,
        tags: tempComicInfo.types,
        lastUpdateChapterId: tempComicInfo.last_update_chapter_id,
        lastUpdateChapterName: tempComicInfo.last_update_chapter_name,
        lastUpdatetime: tempComicInfo.last_updatetime,
        description: tempComicInfo.description,
        area: tempComicInfo.zone,
        chapterList: chapterList
      };
      Object.assign(comicInfo, tempComicInfo2);
      //console.log('[漫画信息]', comicInfo)
      //console.log('[章节列表]', comicInfo.chapterList)
      document.querySelector('head>title').innerText = `${comicInfo.name}-${comicInfo.name}漫画-${comicInfo.name}在线漫画-动漫之家漫画网`;
    };
    const subscribeNew = () => {
      let addBtn = document.querySelector('#subscribe_id');
      let evt = addBtn.getAttribute('onclick');
      if (evt) {
        let subscribeEvt = e => {
          let evt = e.target.getAttribute('onclick');
          if (evt.indexOf('other_subscribe') > -1) {
            addSubscribeNew();
          } else if (evt.indexOf('subscribe_remove') > -1) {
            cancelSubscribeNew();
          }
        };
        addBtn.addEventListener('click', subscribeEvt);
      }
    };
    const unblockChapters = () => {
      if (comicInfo.chapterList.length == 0) return;
      document.querySelector('.cartoon_online_border').innerHTML = page1_text.chapterListHTML(comicInfo);
    };
    const fillPage = () => {
      let {
        id,
        name,
        namePinyin,
        alias,
        firstLetter,
        authors,
        cover,
        subscribeNum,
        serialStatus,
        heatNum,
        tags,
        lastUpdateChapterId,
        lastUpdateChapterName,
        lastUpdatetime,
        description,
        area,
        chapterList
      } = comicInfo;
      document.querySelector('.path_lv3').innerHTML = `
	<span class="icon20"></span><a href="../">在线漫画 </a> &gt;&gt;<a href="../tags/riben.shtml">日本漫画</a>&nbsp;<a href="../tags/${firstLetter}.shtml">首字母${firstLetter.toUpperCase()}</a> &gt;&gt; ${name}
	`;
      document.querySelector('.anim_intro_ptext>a').href = `${location.origin}/${namePinyin}`;
      document.querySelector('#cover_pic').src = cover;
      document.querySelector('#subscribe_num').innerHTML = subscribeNum;
      document.querySelector('.anim-main_list tbody').innerHTML = page1_text.tbodyHTML({
        alias,
        authors,
        area,
        serialStatus,
        heatNum,
        tags,
        lastUpdatetime,
        lastUpdateChapterId,
        lastUpdateChapterName,
        namePinyin,
        id
      });
      let str = chapterList.length > 0 ? `，总收录${chapterList.length}话` : '';
      document.querySelector('.odd_anim_title_m').innerHTML = `
	<span class="anim_title_text"><a href="${location.origin}/${namePinyin}"><h1>${name}</h1></a></span>
	${serialStatus.tag_name}&nbsp;(&nbsp;最新收录：<a target="_blank" href="${location.origin}/${namePinyin}/${lastUpdateChapterId}.shtml?comic_id=${id}#@page=1" id="newest_chapter">${lastUpdateChapterName}</a>${str})
	<span class="update"></span>
	`;
      document.querySelector('.middleright_mr>.photo_part>.h2_title2').innerHTML = `
	<span class="msg"></span>
	<span class="h2_icon h2_icon22"></span>
	<h2>${name} 在线漫画全集</h2>
	`;
      document.querySelector('.middleright_mr.margin_top_10px>.photo_part>.h2_title2>h2').innerText = `${name} 详细介绍`;
      document.querySelector('.impunity').innerHTML = '本页漫画内容均来自互联网，动漫之家漫画网与内容的出处无关，如有违反您的权益，或您发现有任何不良内容或图片错误，【<a href="http://i.178.com/~sms.index.view_send_form/reciever/長瀬湊/uid/2600003" target="_blank">请与我们联系</a>】，我们将修正该漫画图片';
      checkSubscribe();
    };
    const checkSubscribe = async () => {
      if (!userInfo.isLogin) return;
      let data = null;
      try {
        let res = await request({
          method: 'get',
          url: `https://interface.dmzj.com/api/subscribe/checkSubscribe?sub_id=${comicInfo.id}&uid=${userInfo.userId}&sub_type=0`,
          timeout: 3000
        });
        data = JSON.parse(res);
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!data) return;
      let subscribeBtn = document.querySelector('#subscribe_id');
      if (data.data == 1) {
        subscribeBtn.value = '已订阅';
        subscribeBtn.onmouseover = () => subscribeBtn.value = '取消订阅';
        subscribeBtn.onmouseout = () => subscribeBtn.value = '已订阅';
        subscribeBtn.onclick = () => cancelSubscribeAll();
      } else {
        subscribeBtn.onclick = () => addSubscribeAll();
      }
    };
    const addSubscribeAll = () => {
      addSubscribe();
      addSubscribeNew();
    };
    const addSubscribe = async () => {
      if (!userInfo.isLogin) {
        alert('请登录');
        return;
      }
      let data = null;
      try {
        let str = location.host.indexOf('dmzj1.com') > -1 ? '//interface.dmzj1.com/api/subscribe/add' : '//interface.dmzj.com/api/subscribe/add';
        let res = await request({
          method: 'get',
          url: `https:${str}?sub_id=${comicInfo.id}&uid=${userInfo.userId}&sub_type=0`
        });
        data = JSON.parse(res);
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!data) return;
      let subscribeBtn = document.querySelector('#subscribe_id');
      if (data.result == 1000) {
        subscribeBtn.value = '已订阅';
        subscribeBtn.onmouseover = () => subscribeBtn.value = '取消订阅';
        subscribeBtn.onmouseout = () => subscribeBtn.value = '已订阅';
        subscribeBtn.onclick = () => cancelSubscribeAll();
        let eles = createElementFromHtml(page1_text.popboxHTML(comicInfo.name));
        for (let ele of eles) {
          document.body.appendChild(ele);
        }
        document.querySelector('.su_btn_scri').onclick = e => {
          document.querySelector('.window_show').remove();
          document.querySelector('#scribe_window').remove();
        };
        document.querySelector('.close_scri').onclick = e => {
          document.querySelector('.window_show').remove();
          document.querySelector('#scribe_window').remove();
        };
      }
    };
    const addSubscribeNew = () => {
      let {
        id
      } = comicInfo;
      //console.log(comicInfo);
      let comicList = getStorageItem('comicList');
      let index = comicList.findIndex(item => item.id == id);
      if (index > -1) {
        let comic = comicList[index];
        let tempComic = {
          hidden: true,
          isSubscribe: true,
          name: comicInfo.name,
          lastUpdateChapterName: comicInfo.lastUpdateChapterName,
          cover: comicInfo.cover,
          lastUpdatetime: comicInfo.lastUpdatetime,
          namePinyin: comicInfo.namePinyin,
          lastUpdateChapterId: comicInfo.lastUpdateChapterId
        };
        Object.assign(comic, tempComic);
        comicList.splice(index, 1, comic);
        setStorageItem('comicList', comicList);
        //console.log('[添加]', getStorageItem('comicList'));
      }
    };

    const cancelSubscribeAll = () => {
      cancelSubscribe();
      cancelSubscribeNew();
    };
    const cancelSubscribe = async () => {
      if (!userInfo.isLogin) {
        alert('请登录');
        return;
      }
      let data = null;
      try {
        let str = location.host.indexOf('dmzj1.com') > -1 ? '//interface.dmzj1.com/api/subscribe/del' : '//interface.dmzj.com/api/subscribe/del';
        let res = await request({
          method: 'get',
          url: `https:${str}?sub_id=${comicInfo.id}&uid=${userInfo.userId}&sub_type=0`
        });
        data = JSON.parse(res);
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!data) return;
      let subscribeBtn = document.querySelector('#subscribe_id');
      if (data.result == 1000) {
        subscribeBtn.value = '添加订阅';
        subscribeBtn.onmouseover = null;
        subscribeBtn.onmouseout = null;
        subscribeBtn.onclick = () => addSubscribeAll();
        let eles = createElementFromHtml(page1_text.popboxHTML2(comicInfo.name));
        for (let ele of eles) {
          document.body.appendChild(ele);
        }
        document.querySelector('.su_btn_scri').onclick = e => {
          document.querySelector('.window_show').remove();
          document.querySelector('#scribe_window').remove();
        };
        document.querySelector('.close_scri').onclick = e => {
          document.querySelector('.window_show').remove();
          document.querySelector('#scribe_window').remove();
        };
      }
    };
    const cancelSubscribeNew = () => {
      let {
        id
      } = comicInfo;
      let comicList = getStorageItem('comicList');
      let index = comicList.findIndex(item => item.id == id);
      if (index > -1) {
        let comic = comicList[index];
        comic.isSubscribe = false;
        comicList.splice(index, 1, comic);
        setStorageItem('comicList', comicList);
        //console.log('[取消]', getStorageItem('comicList'));
      }
    };

    const getChapterOneByOne = async (limit = true) => {
      let chapterListDom = document.querySelector('.cartoon_online_border');
      let chapterList = [];
      let prevChapterList = [];
      let nextChapterList = [];
      let result = null;
      let chapter = null;
      try {
        result = await getChapter(comicInfo.lastUpdateChapterId);
        chapter = JSON.parse(result);
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!chapter) return;
      chapterList.push(chapter);
      let prev_chap_id = chapter.prev_chap_id;
      let next_chap_id = chapter.next_chap_id;
      let count = 1;
      chapterListDom.innerHTML = '加载中';
      while (prev_chap_id || next_chap_id) {
        if (count > 200) break;
        if (limit && count > 9) {
          break;
        }
        if (prev_chap_id) {
          count++;
          result = await getChapter(prev_chap_id);
          chapter = JSON.parse(result);
          prevChapterList.push(chapter);
          prev_chap_id = chapter.prev_chap_id;
          chapterListDom.innerHTML = `加载中(${chapter.chapter_name})`;
          // //console.log(chapter)
        }

        if (next_chap_id) {
          count++;
          result = await getChapter(next_chap_id);
          chapter = JSON.parse(result);
          nextChapterList.push(chapter);
          next_chap_id = chapter.next_chap_id;
          chapterListDom.innerHTML = `加载中(${chapter.chapter_name})`;
          // //console.log(chapter)
        }
      }

      chapterListDom.innerHTML = '';
      chapterList = prevChapterList.concat(chapterList).concat(nextChapterList);
      let chapterListAll = [...comicInfo.chapterList];
      for (let chapter of chapterList) {
        if (!comicInfo.chapterList.find(item => item.id == chapter.id)) {
          chapterListAll.push(chapter);
        }
      }
      chapterListAll.sort((a, b) => {
        return a.chapter_order - b.chapter_order;
      });
      comicInfo.chapterList = chapterListAll;
      //console.log('[章节列表2]', comicInfo.chapterList)

      if (comicInfo.chapterList.length == 0) return;
      let hasMore = false;
      if (comicInfo.chapterList[0].prev_chap_id || comicInfo.chapterList[comicInfo.chapterList.length - 1].next_chap_id) hasMore = true;
      chapterListDom.innerHTML = page1_text.chapterListHTML(comicInfo, hasMore);
      if (hasMore) document.querySelector('#load-all-btn').onclick = () => {
        getChapterOneByOne(false);
      };
    };
    const getChapter = chapterId => {
      return request({
        method: 'get',
        url: `https://m.dmzj.com/chapinfo/${comicInfo.id}/${chapterId}.html`
      });
    };
    const getChapterOneByOne2 = async () => {
      let chapterListDom = document.querySelector('.cartoon_online_border');
      let chapterList = [];
      let prevChapterList = [];
      let nextChapterList = [];
      let result = null;
      let chapter = null;
      try {
        result = await getChapter(comicInfo.lastUpdateChapterId);
        chapter = JSON.parse(result);
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!chapter) return;
      chapterList.push(chapter);
      let prev_chap_id = chapter.prev_chap_id;
      let next_chap_id = chapter.next_chap_id;
      let tips = createElementFromHtml('<li style="width:auto;cursor:text;color:#0187c5;text-decoration:underline"></li>');
      chapterListDom.querySelector('ul').appendChild(tips);
      while (prev_chap_id) {
        result = await getChapter(prev_chap_id);
        chapter = JSON.parse(result);
        prev_chap_id = chapter.prev_chap_id;
        if (!comicInfo.chapterList.find(item => item.id == chapter.id)) {
          prevChapterList.push(chapter);
          tips.innerText = `加载中(${chapter.chapter_name})`;
          //console.log(chapter)
        } else {
          break;
        }
      }
      while (next_chap_id) {
        result = await getChapter(next_chap_id);
        chapter = JSON.parse(result);
        next_chap_id = chapter.next_chap_id;
        if (!comicInfo.chapterList.find(item => item.id == chapter.id)) {
          nextChapterList.push(chapter);
          tips.innerText = `加载中(${chapter.chapter_name})`;
          //console.log(chapter)
        } else {
          break;
        }
      }
      tips.innerText = '';
      chapterList = prevChapterList.concat(chapterList).concat(nextChapterList);
      //console.log(chapterList)
      let chapterListAll = [...comicInfo.chapterList];
      for (let chapter of chapterList) {
        if (!comicInfo.chapterList.find(item => item.id == chapter.id)) {
          chapterListAll.push(chapter);
        }
      }
      chapterListAll.sort((a, b) => {
        return a.chapter_order - b.chapter_order;
      });
      comicInfo.chapterList = chapterListAll;
      //console.log('[章节列表2]', comicInfo.chapterList)
      chapterListDom.innerHTML = page1_text.chapterListHTML(comicInfo);
    };
    return (_ctx, _cache) => {
      return Object(external_Vue_["openBlock"])(), Object(external_Vue_["createElementBlock"])("div", {
        innerHTML: Object(external_Vue_["unref"])(html)
      }, null, 8, _hoisted_1);
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page1/comic.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page1/comic.vue



const __exports__ = comicvue_type_script_setup_true_lang_js;

/* harmony default export */ var page1_comic = (__exports__);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page1/comment.vue?vue&type=script&setup=true&lang=js




/* harmony default export */ var commentvue_type_script_setup_true_lang_js = ({
  __name: 'comment',
  props: ['condition', 'comicId', 'userInfo', 'basicScriptLoadStatus', 'pageLoadStatus'],
  setup(__props) {
    const props = __props;
    const {
      comicId,
      userInfo,
      basicScriptLoadStatus,
      pageLoadStatus
    } = Object(external_Vue_["toRefs"])(props);
    const {
      condition
    } = props;
    const {
      pinyin
    } = pinyinPro;
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils,
      $store
    } = proxy;
    const {
      request,
      createElementFromHtml,
      getStorageItem,
      setStorageItem
    } = $utils;
    const {
      rd
    } = $store;
    let isToggleShowBanBtnShow = false;
    Object(external_Vue_["watch"])(() => [comicId.value, basicScriptLoadStatus.value, pageLoadStatus.value], async ([comicId, status, status2]) => {
      //console.log('[监听到参数变化]', comicId, status, status2);
      if (!comicId) return;
      switch (condition) {
        case 1:
          scriptEnhance();
          break;
        case 2:
          scriptEnhance();
          break;
        case 3:
          if (status == 'loadEnd' && status2 == 'loadEnd') {
            await addScript();
            scriptEnhance();
          }
          break;
        default:
          break;
      }
    });
    Object(external_Vue_["onMounted"])(async () => {
      //console.log('[当前类型]', condition);
      switch (condition) {
        case 2:
          break;
        case 3:
          break;
        default:
          break;
      }
    });
    // [增强脚本]css
    const addCss = () => {
      $utils.addCss(page1_text.cssHTML3);
    };
    // 评论模块脚本
    const addScript = async () => {
      $utils.addScript(page1_text.scriptHTML(comicId.value));
      await $utils.addScript('https://static.dmzj.com/module/js/dmzjComment-16.02.js', true);
    };
    // [增强脚本]获取评论和发表评论替换为社区版接口
    const addScript2 = async () => {
      $utils.addScript(page1_text.scriptHTML2(comicId.value, userInfo.value.token));
    };
    const scriptEnhance = async () => {
      addCss();
      addScript2();
      enhanceComment();
    };
    const enhanceComment = async () => {
      addToggleShowBanBtn();
      loadComment();
      await new Promise((resolve, reject) => {
        let timer = setInterval(() => {
          if (document.querySelector('#commentAll>.comment_con_li.autoHeight')) {
            clearInterval(timer);
            resolve();
          }
        }, 500);
      });
      layoutCommentList();
      let oldFirstCommentDom = null;
      let targetObserver = new MutationObserver((mutations, observer) => {
        let newFirstCommentDom = document.querySelector('#commentAll>.comment_con_li.autoHeight');
        if (newFirstCommentDom && newFirstCommentDom != oldFirstCommentDom) {
          oldFirstCommentDom = newFirstCommentDom;
          //console.log('[评论列表布局更新]');
          layoutCommentList();
        }
      });
      targetObserver.observe(document.querySelector('#commentAll'), {
        childList: true
      });
    };
    const addToggleShowBanBtn = () => {
      document.querySelector('.comment_tab').appendChild(createElementFromHtml('<div id="toggle-show-ban-btn">显示屏蔽楼层</div>'));
      let btn = document.querySelector('#toggle-show-ban-btn');
      btn.onclick = () => {
        if (isToggleShowBanBtnShow) {
          btn.innerText = '显示屏蔽楼层';
        } else {
          btn.innerText = '隐藏屏蔽楼层';
        }
        isToggleShowBanBtnShow = !isToggleShowBanBtnShow;
        addOrUpdateHiddenComment('update');
      };
    };
    const loadComment = () => {
      let loadCommentEvt = e => {
        if (document.querySelector('#commentAll>.comment_con_li.autoHeight')) {
          window.removeEventListener('scroll', loadCommentEvt);
        } else {
          let scrollHeight = document.documentElement.scrollHeight;
          let scrollTop = document.documentElement.scrollTop;
          let clientHeight = document.documentElement.clientHeight;
          if (scrollHeight - scrollTop <= clientHeight) {
            window.removeEventListener('scroll', loadCommentEvt);
            if (scrollType == 1) {
              //console.log('%c[手动加载评论]', 'color:red;font-weight:bold;');
              comment_news.getAllComment();
            }
          }
        }
      };
      window.addEventListener('scroll', loadCommentEvt);
    };
    const layoutCommentList = () => {
      addOrUpdateHiddenComment('add');
      addBanBtn();
    };
    const addOrUpdateHiddenComment = type => {
      let comicList = getStorageItem('comicList');
      let comic = comicList.find(item => item.id == comicId.value);
      let doms = document.querySelectorAll('#commentAll>.comment_con_li.autoHeight');
      for (let dom of doms) {
        let commentId = dom.querySelector('a').getAttribute('name').split('_')[2];
        let floor = dom.querySelector('.floor').innerText;
        if (type == 'add') {
          createHiddenComment(dom, floor, commentId);
        }
        if (comic.banList.find(item => item.commentId == commentId)) {
          toggleBanState(dom, false);
        } else {
          toggleBanState(dom, true);
        }
      }
      let doms2 = document.querySelectorAll('.reply_content .comment_con_li.autoHeight');
      for (let dom of doms2) {
        let commentId = dom.id.split('_')[0];
        let floor = dom.querySelector('.floor').innerText;
        if (type == 'add') {
          createHiddenComment(dom, floor, commentId);
        }
        if (comic.banList.find(item => item.commentId == commentId)) {
          toggleBanState(dom, false, 'reply');
        } else {
          toggleBanState(dom, true, 'reply');
        }
      }
    };
    const createHiddenComment = (dom, floor, commentId) => {
      dom.appendChild(createElementFromHtml(page1_text.banCommentHTML(floor, commentId)));
      dom.querySelector('.remove-ban').onclick = e => {
        let commentId = e.target.dataset.commentid;
        let comicList = getStorageItem('comicList');
        let comic = comicList.find(item => item.id == comicId.value);
        let index = comic.banList.findIndex(item => item.commentId == commentId);
        if (index > -1) {
          comic.banList.splice(index, 1);
          setStorageItem('comicList', comicList);
          //console.log(getStorageItem('comicList'));
          addOrUpdateHiddenComment('update');
        }
      };
    };
    const addBanBtn = () => {
      let doms = document.querySelectorAll('#commentAll>.comment_con_li.autoHeight');
      for (let dom of doms) {
        let commentId = dom.querySelector('a').getAttribute('name').split('_')[2];
        let banBtn = createBanBtn(commentId);
        dom.querySelector('.content_r.autoHeight>.btm_bar').appendChild(banBtn);
      }
      let doms2 = document.querySelectorAll('.reply_content .comment_con_li.autoHeight');
      for (let dom of doms2) {
        let commentId = dom.id.split('_')[0];
        let banBtn = createBanBtn(commentId);
        let bottomBar = dom.querySelector('.btm_bar');
        bottomBar && bottomBar.appendChild(banBtn);
      }
    };
    const createBanBtn = commentId => {
      let banBtn = createElementFromHtml(page1_text.banBtnHTML(commentId));
      banBtn.onclick = e => {
        let commentId = e.target.dataset.commentid;
        let comicList = getStorageItem('comicList');
        let comic = comicList.find(item => item.id == comicId.value);
        if (!comic.banList.find(item => item.commentId == commentId)) {
          comic.banList.push({
            commentId: commentId
          });
          setStorageItem('comicList', comicList);
          //console.log(getStorageItem('comicList'));
          addOrUpdateHiddenComment('update');
        }
      };
      return banBtn;
    };
    const toggleBanState = (dom, state, type) => {
      if (state === true) {
        dom.style.display = 'block';
        for (let childDom of dom.children) {
          if (childDom.className != 'text ban') {
            childDom.style.display = 'block';
          } else {
            childDom.style.display = 'none';
          }
        }
      } else if (state === false) {
        if (type == 'reply') {
          for (let childDom of dom.children) {
            if (childDom.className == 'text ban') {
              childDom.style.display = 'block';
            } else {
              childDom.style.display = 'none';
            }
          }
        } else {
          if (isToggleShowBanBtnShow) {
            dom.style.display = 'block';
            for (let childDom of dom.children) {
              if (childDom.className == 'text ban') {
                childDom.style.display = 'block';
              } else {
                childDom.style.display = 'none';
              }
            }
          } else {
            dom.style.display = 'none';
          }
        }
      }
    };
    return (_ctx, _cache) => {
      return null;
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page1/comment.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page1/comment.vue



const comment_exports_ = commentvue_type_script_setup_true_lang_js;

/* harmony default export */ var comment = (comment_exports_);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page1.vue?vue&type=script&setup=true&lang=js




/* harmony default export */ var page1vue_type_script_setup_true_lang_js = ({
  __name: 'page1',
  setup(__props) {
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils
    } = proxy;
    const {
      initSyncStorage
    } = $utils;
    let isShow = Object(external_Vue_["ref"])(false);
    // 1-正常页面,2-章节不显示,3-页面404
    let condition = Object(external_Vue_["ref"])(1);
    const comicUrl = Object(external_Vue_["ref"])(location.pathname.split('/')[1].toLowerCase());
    let comicId = Object(external_Vue_["ref"])('');
    let userInfo = Object(external_Vue_["reactive"])({
      cookie_my: '',
      userId: '',
      userName: '',
      isLogin: '',
      token: ''
    });
    let basicScriptLoadStatus = Object(external_Vue_["ref"])('');
    let pageLoadStatus = Object(external_Vue_["ref"])('');
    const updateComicId = value => {
      comicId.value = value;
    };
    const updateUserInfo = value => {
      Object.assign(userInfo, value);
    };
    const updatePageLoadStatus = value => {
      pageLoadStatus.value = value;
    };
    Object(external_Vue_["onMounted"])(async () => {
      initSyncStorage();
      if (self != top) return;

      //console.log('[执行脚本开始]')
      let dom = document.querySelector('h1');
      if (dom && dom.innerText == '404 Not Found') {
        addCss();
        addScript();
        condition.value = 3;
      } else if (!document.querySelector('.cartoon_online_border ul')) {
        condition.value = 2;
      }
      isShow.value = true;
    });
    const addCss = () => {
      let cssList = ['https://static.dmzj.com/public/css/scribe_layer.css', 'https://static.dmzj.com/public/css/global_nav.css'];
      for (let css of cssList) {
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.href = css;
        document.head.appendChild(link);
      }
    };
    // 页面基础脚本
    const addScript = async () => {
      await $utils.addScript('https://static.dmzj.com/public/js/jquery-1.8.2.min.js', true);
      await $utils.addScript('https://static.dmzj.com/public/js/jquery.cookie.js', true);
      $utils.addScript('https://static.dmzj.com/public/js/globalNav.js?2015604');
      $utils.addScript('https://static.dmzj.com/public/js/dmzj-land-2015.6.js?20156030');
      $utils.addScript('https://static.dmzj.com/public/js/fenye.js');
      basicScriptLoadStatus.value = 'loadEnd';
    };
    return (_ctx, _cache) => {
      return Object(external_Vue_["openBlock"])(), Object(external_Vue_["createElementBlock"])(external_Vue_["Fragment"], null, [Object(external_Vue_["unref"])(isShow) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page1_comic, {
        key: 0,
        condition: Object(external_Vue_["unref"])(condition),
        comicUrl: comicUrl.value,
        onUpdateComicId: updateComicId,
        onUpdateUserInfo: updateUserInfo,
        onUpdatePageLoadStatus: updatePageLoadStatus
      }, null, 8, ["condition", "comicUrl"])) : Object(external_Vue_["createCommentVNode"])("", true), Object(external_Vue_["unref"])(isShow) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(comment, {
        key: 1,
        condition: Object(external_Vue_["unref"])(condition),
        comicId: Object(external_Vue_["unref"])(comicId),
        userInfo: Object(external_Vue_["unref"])(userInfo),
        basicScriptLoadStatus: Object(external_Vue_["unref"])(basicScriptLoadStatus),
        pageLoadStatus: Object(external_Vue_["unref"])(pageLoadStatus)
      }, null, 8, ["condition", "comicId", "userInfo", "basicScriptLoadStatus", "pageLoadStatus"])) : Object(external_Vue_["createCommentVNode"])("", true)], 64);
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page1.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page1.vue



const page1_exports_ = page1vue_type_script_setup_true_lang_js;

/* harmony default export */ var page1 = (page1_exports_);
// CONCATENATED MODULE: ./src/assets/page2/text.ts

const {
  rd: page2_text_rd
} = store;
const text_cssHTML = `
.ads-manhua{
    display:none;
}
.display_graybg.funcdiv{
    display:block!important;
}
#center_box{
    position:relative;
}
#center_box_img{
    max-width:95%;
}
.inner_img{
    margin-top:40px;
}
.inner_img>a{
    cursor:pointer;
}
.inner_img>a>img{
    max-width:95%;
    border: 1px solid rgb(204, 204, 204);
    padding: 1px;
    display: inline;
}
.comic_gd_li>li{
    position:relative;
}
.banBtn{
    display:none;
    position:absolute;
    left:0;
    bottom:100%;
    background-color:white;
    border: 1px solid #e6e6e6;
    text-align:center;
    padding:4px 6px;
    cursor:pointer;
}
.comic_gd_li>li:hover>.banBtn{
    display:block;
}
#internal_div{
    position:fixed!important;
    left:50%;
    top:150px;
    transform: translateX(-50%);
    margin-top:0!important;
}
`;
const text_scriptHTML = (comicInfo, chapterInfo) => {
  let {
    id,
    comic_py
  } = comicInfo;
  let {
    page_url
  } = chapterInfo;
  let chapterId = chapterInfo.id;
  let sns_sys_id = `${id}_${chapterId}`;
  let arr_pages = page_url.map(item => item.replace('https://images.dmzj.com/', ''));
  let str = `[`;
  for (let item of arr_pages) str += `'${item}',`;
  str = str.slice(0, str.length - 1) + `]`;
  // console.log(str);
  return `
    var arr_pages = ${str};
    var g_comic_id = res_id = '${id}';
    var sns_sys_id = '${sns_sys_id}';
    var g_chapter_id = chapter_id = '${chapterId}';
    var g_max_pic_count = ${arr_pages.length};
    var final_page_url = "/${comic_py}";
    function filterImg(is_c) {
    if (is_c < 1) {
        $("#center_box").addClass("filterimg");
        $("#center_box img").addClass("filterimg");
        $("#filter_chk").attr("checked", true);
    } else {
        if ($("#filter_chk").attr("checked")) {
            $("#center_box").addClass("filterimg");
            $("#center_box img").addClass("filterimg");
            $.cookie("img_filter", 1);
        } else {
            $("#center_box").removeClass("filterimg");
            $("#center_box img").removeClass("filterimg");
            $.cookie("img_filter", 0);
        };
    };
};
    `;
};
const prevChapterBtnHTML = (comicId, chapterId) => {
  return `<a class="btm_chapter_btn fl" href="${chapterId}.shtml?comic_id=${comicId}#@page=1">上一章节</a>`;
};
const nextChapterBtnHTML = (comicId, chapterId) => {
  return `<a class="btm_chapter_btn fr" href="${chapterId}.shtml?comic_id=${comicId}#@page=1">下一章节</a>`;
};
const text_scriptHTML2 = (comicId, chapterId) => {
  return `
    var type = '0';
    var comic_id = ${comicId};
    var chapter_id = '${chapterId}';
    myLogin();
    if (chapter_id != "") {
        getPoint();
    };
    `;
};
const text_banBtnHTML = commentId => {
  return `
    <div class="ban-btn" data-commentid="${commentId}">屏蔽</div>
    `;
};
const text_cssHTML2 = `
    .comic_gd_li>li{
        position: relative;
    }
    .ban-btn{
        display:none;
        position:absolute;
        left:0;
        bottom:100%;
        background-color:white;
        border: 1px solid #e6e6e6;
        text-align:center;
        padding:4px 6px;
        cursor:pointer;
    }
    .comic_gd_li>li:hover>.ban-btn{
        display:block;
    }
`;
const scriptHTML3 = () => {
  return `
    prev_img = (obj) => {
        var obj_img_src = $("#center_box").find("img").attr("src");
        for (var i = 0; i < arr_pages.length; i++) {
            var img_src = arr_pages[i];
            if (obj_img_src == img_src) {
                if (arr_pages[i - 1]) {
                    var imgStr = '<img src="' + arr_pages[i - 1] + '"/>';
                    $("#center_box").find("img").remove();
                    $("#center_box").append(imgStr);
                    curr_page = parseInt(i);
                    historyCookie(g_comic_id, sns_sys_id.split("_")[1], curr_page);
                    if ($('.zoompic_chk').is(':checked')) {
                        imgload_size();
                    };
                    $("#center_box").find("img").attr("name", "page_" + (i - 1));
                    $(".turnPage").html(parseInt(i) + "/" + g_max_pic_count);
                    $("#page_select option").eq(i - 1).attr("selected", "selected");
                    document.location.hash = '@page=' + (i);
                    $("html,body").animate({
                        "scrollTop": $("#center_box").offset().top
                    }, 0);
                } else {
                    if ($("#prev_chapter").size() > 0) {
                        if (confirm("已经是此章节第1页了，要打开上一个章节吗？") == true) {
                            location.href = $("#prev_chapter").attr("href");
                        };
                    } else {
                        alert("已经是第一个章节了！");
                    };
                }
                break;
            };
        };
    };
    next_img = (obj) => {
        var obj_img_src = $("#center_box").find("img").attr("src");
        for (var i = 0; i < arr_pages.length; i++) {
            var img_src = arr_pages[i];
            if (obj_img_src == img_src) {
                if (arr_pages[i + 1]) {
                    var imgStr = '<img src="' + arr_pages[i + 1] + '"/>';
                    $("#center_box").find("img").remove();
                    $("#center_box").append(imgStr);
                    curr_page = parseInt(i) + 2;
                    historyCookie(g_comic_id, sns_sys_id.split("_")[1], curr_page);
                    if ($('.zoompic_chk').is(':checked')) {
                        imgload_size();
                    };
                    $(".turnPage").html(parseInt(i + 2) + "/" + g_max_pic_count);
                    $("#page_select option").eq(i + 1).attr("selected", "selected");
                    $("#center_box").find("img").attr("name", "page_" + (i + 2));
                    if (arr_pages[i + 2] != "//images.dmzj1.com/undefined") {
                        img1.src = arr_pages[i + 2];
                    };
                    document.location.hash = '@page=' + (i + 2);
                    $("html,body").animate({
                        "scrollTop": $("#center_box").offset().top
                    }, 0);
                } else {
                    if ($('#next_chapter').size() > 0) {
                        nextChapterMsgBox();
                    } else {
                        window.location.href = final_page_url;
                        $(".btmBtnBox").css("width", "256px");
                    };
                };
                break;
            };
        };
    };
    window.onhashchange = function () {
        var his_img = document.location.hash.split("=")[1];
        $("#center_box").find("img").attr("src", arr_pages[his_img - 1]);
        $("#page_select option").eq(his_img - 1).attr("selected", "selected");
    };
    `;
};
const text_innerImgHTML = (index, pages) => {
  return `
    <div class="inner_img" style="margin-top:40px">
		<a style="cursor:pointer" name="page=${index + 1}" index="${index + 1}"><img id="img_${index + 1}" style="border: 1px solid rgb(204, 204, 204); padding: 1px; display: inline;" data-original="${pages[index]}"></a>
		<p class="curr_page">${index + 1}/${pages.length}</p>
	</div>
    `;
};
const scriptHTML4 = totalPage => {
  return `
    g_max_pic_count=${totalPage};
    $(".inner_img a").click(function () {
        var _index = $(this).attr("index");
        if (_index < g_max_pic_count) {
            window.location.href = "#page=" + (parseInt(_index) + parseInt(1));
        } else {
            if ($('#next_chapter').size() > 0) {
                nextChapterMsgBox();
            } else {
                window.location.href = final_page_url;
            };
        };
    });
    $("#center_box img").load(function () {
        setWidth();
    }).lazyload({
        placeholder: 'https://static.dmzj.com/ocomic/images/mh-last/lazyload.gif',
        effect: "fadeIn",
        threshold: 2000
    });
    `;
};
/* harmony default export */ var page2_text = ({
  cssHTML: text_cssHTML,
  scriptHTML: text_scriptHTML,
  prevChapterBtnHTML,
  nextChapterBtnHTML,
  scriptHTML2: text_scriptHTML2,
  banBtnHTML: text_banBtnHTML,
  cssHTML2: text_cssHTML2,
  scriptHTML3,
  innerImgHTML: text_innerImgHTML,
  scriptHTML4
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page2/comic.vue?vue&type=script&setup=true&lang=js

const comicvue_type_script_setup_true_lang_js_hoisted_1 = ["innerHTML"];


/* harmony default export */ var page2_comicvue_type_script_setup_true_lang_js = ({
  __name: 'comic',
  props: ['condition', 'comicId', 'basicScriptLoadStatus'],
  emits: ['updatePageLoadStatus'],
  setup(__props, {
    emit
  }) {
    const props = __props;
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils,
      $store
    } = proxy;
    const {
      request,
      dmzjDecrypt,
      initStorage,
      createElementFromHtml
    } = $utils;
    const {
      rd,
      dmzjProto,
      dmzjProto2
    } = $store;
    const {
      condition,
      comicId
    } = props;
    const {
      basicScriptLoadStatus
    } = Object(external_Vue_["toRefs"])(props);
    let html = Object(external_Vue_["ref"])('');
    const chapterId = location.pathname.split('/')[2].split('.')[0];
    const chapterInfo = Object(external_Vue_["reactive"])({
      id: ''
    });
    const comicInfo = Object(external_Vue_["reactive"])({
      id: ''
    });
    const unwatch = Object(external_Vue_["watch"])(() => [html.value, chapterInfo.id, comicInfo.id], async ([html, chapterId, comicId]) => {
      switch (condition) {
        case 1:
          unwatch();
          break;
        case 2:
          if (html && chapterId && comicId) {
            await Object(external_Vue_["nextTick"])();
            emit('updatePageLoadStatus', 'loadEnd');
            fillPage();
            unwatch();
          }
          break;
        default:
          unwatch();
          break;
      }
    });
    const unwatch2 = Object(external_Vue_["watch"])(() => [chapterInfo.id, basicScriptLoadStatus.value], async ([chapterId, status]) => {
      switch (condition) {
        case 1:
          unwatch2();
          break;
        case 2:
          if (chapterId && status == 'loadEnd') {
            await addScript();
            fillPage2();
            unwatch2();
          }
          break;
        default:
          unwatch2();
          break;
      }
    });
    Object(external_Vue_["onMounted"])(async () => {
      //console.log('[漫画id]', comicId);
      initStorage(comicId);
      switch (condition) {
        case 1:
          //console.log('[执行脚本结束]');
          break;
        case 2:
          // 避免清除自身以及用于跨域数据同步的iframe
          let doms = document.querySelectorAll(`body>*:not(#app_${rd}):not(#storage-iframe):not(.mainNav):not(.book_wrap)`);
          for (let dom of doms) dom.remove();
          initPage();
          getComicInfo();
          let tempChapterInfo = await getChapterInfo();
          //console.log('[章节信息]', tempChapterInfo)
          Object.assign(chapterInfo, tempChapterInfo);
          break;
        default:
          break;
      }
    });
    const initPage = async () => {
      let pageTemplate = null;
      try {
        pageTemplate = await getPageTemplate();
      } catch (error) {
        //console.log('[异常]', error)
      }
      if (!pageTemplate) return;
      html.value = pageTemplate;
      await Object(external_Vue_["nextTick"])();
      formatPage();
    };
    const getPageTemplate = () => {
      return request({
        method: 'get',
        url: 'https://manhua.dmzj.com/kanonair/721.shtml'
      });
    };
    const formatPage = () => {
      let ids = ['.header-box>.user>a', '.header-box>.user>.right>.r2>a', '.header-box>.user>.right>.r3>a', '.display_graybg.funcdiv'];
      for (let id of ids) {
        let doms = document.querySelectorAll(id);
        for (let dom of doms) dom.style.display = 'none';
      }
      document.querySelector('.header-box .btn2').href = '';
      document.querySelector('.display_left').innerHTML = '';
      document.querySelector('.hotrmtexth1').innerHTML = `<a href="" class="redhotl"></a>`;
      document.querySelector('.display_right').innerHTML = '';
      document.querySelector('.display_middle>.redhotl').innerHTML = `<span class="redhotl"></span>`;
    };
    const getChapterInfo = async targetChapterId => {
      targetChapterId = targetChapterId || chapterId;
      let tempChapterInfo = null;
      try {
        let res = await request({
          method: 'get',
          url: `https://m.dmzj.com/chapinfo/${comicId}/${targetChapterId}.html`
        });
        tempChapterInfo = JSON.parse(res);
      } catch (error) {
        //console.log('[异常]', error);
      }
      if (tempChapterInfo.id) {
        return tempChapterInfo;
      }
    };
    const getComicInfo = async () => {
      try {
        let str = await request({
          method: 'get',
          url: `https://v4api.idmzj.com/comic/detail/${comicId}?uid=2665531&disable_level=1`
        });
        let bytes = dmzjDecrypt(str);
        let root = protobuf.Root.fromJSON(dmzjProto);
        let message = root.lookupType('proto');
        let data = message.decode(bytes);
        Object.assign(comicInfo, data.comicInfo);
      } catch (error) {
        //console.log('[异常]', error)
      }
      //console.log('[漫画信息]', comicInfo);
    };

    const fillPage = async () => {
      let {
        id,
        title,
        comic_py
      } = comicInfo;
      let {
        chapter_name,
        prev_chap_id,
        next_chap_id
      } = chapterInfo;
      document.querySelector('head>title').innerText = `${title}${chapter_name}-${title}漫画-动漫之家漫画网`;
      document.querySelector('.header-box .btn2').href = `/${comic_py}/`;
      document.querySelector('.hotrmtexth1').innerHTML = `<a href="/${comic_py}/" title="${title}" class="redhotl">${title}</a>`;
      document.querySelector('.display_middle>.redhotl').innerHTML = `<span class="redhotl">${chapter_name}</span>`;
      if (prev_chap_id) {
        let tempChapterInfo = await getChapterInfo(prev_chap_id);
        if (tempChapterInfo) document.querySelector('.display_left').innerHTML = `上一话：<a id="prev_chapter" href="${prev_chap_id}.shtml?comic_id=${id}#@page=1">${tempChapterInfo.chapter_name}</a>`;
      }
      if (next_chap_id) {
        let tempChapterInfo = await getChapterInfo(next_chap_id);
        if (tempChapterInfo) document.querySelector('.display_right').innerHTML = `下一话：<a id="next_chapter" href="${next_chap_id}.shtml?comic_id=${id}#@page=1">${tempChapterInfo.chapter_name}</a>`;
      }
    };
    const addScript = async () => {
      // 额外脚本
      $utils.addScript(page2_text.scriptHTML(comicInfo, chapterInfo));
      await $utils.addScript('https://manhua.dmzj.com/js/pp2016_load.js?tt=20160127', true);
      // 图片加载失败时使用备用图源
      if ($.cookie('display_mode') == null || $.cookie('display_mode') == 0) {
        let targetImg = document.querySelector('#center_box>img');
        let errorEvt = async () => {
          targetImg.removeEventListener('error', errorEvt);
          arr_pages = await getChapterInfo2();
          var curr_page = document.location.hash.split("=")[1];
          let optionHTML = '';
          for (let i = 0; i < arr_pages.length; i++) optionHTML += `<option value="${arr_pages[i]}">第${i + 1}页</option>`;
          document.querySelector('#page_select').innerHTML = optionHTML;
          targetImg.src = arr_pages[curr_page - 1];
          $utils.addScript(page2_text.scriptHTML3());
        };
        targetImg.addEventListener('error', errorEvt);
      } else {
        let tempImg = new Image();
        tempImg.src = img_prefix + arr_pages[0];
        let errorEvt = async () => {
          tempImg.removeEventListener('error', errorEvt);
          arr_pages = await getChapterInfo2();
          let innerImgHTML = '';
          for (let i = 0; i < arr_pages.length; i++) {
            innerImgHTML += page2_text.innerImgHTML(i, arr_pages);
          }
          document.querySelector('#center_box').innerHTML = innerImgHTML;
          $utils.addScript(page2_text.scriptHTML4(arr_pages.length));
        };
        tempImg.addEventListener('error', errorEvt);
      }
    };
    const getChapterInfo2 = async () => {
      try {
        let str = await request({
          method: 'get',
          url: `https://v4api.idmzj.com/comic/chapter/${comicId}/${chapterId}`
        });
        let bytes = dmzjDecrypt(str);
        let root = protobuf.Root.fromJSON(dmzjProto2);
        let message = root.lookupType('proto');
        let data = message.decode(bytes);
        //console.log(data.chapter);
        return data.chapter.page_url;
      } catch (error) {
        //console.log('[异常]', error);
      }
    };
    const fillPage2 = () => {
      let {
        comic_id,
        prev_chap_id,
        next_chap_id
      } = chapterInfo;
      let prevChapterBtn = document.querySelector('.btm_chapter_btn.fl');
      if (prevChapterBtn) prevChapterBtn.remove();
      let nextChapterBtn = document.querySelector('.btm_chapter_btn.fr');
      if (nextChapterBtn) nextChapterBtn.remove();
      let pageSelect = document.querySelector('#page_select');
      if (pageSelect) {
        if (prev_chap_id) pageSelect.before(createElementFromHtml(page2_text.prevChapterBtnHTML(comic_id, prev_chap_id)));
        if (next_chap_id) pageSelect.after(createElementFromHtml(page2_text.nextChapterBtnHTML(comic_id, next_chap_id)));
      } else {
        let bottomBox = document.querySelector('.btmBtnBox');
        bottomBox.innerHTML = '';
        if (prev_chap_id) bottomBox.appendChild(createElementFromHtml(page2_text.prevChapterBtnHTML(comic_id, prev_chap_id)));
        if (next_chap_id) bottomBox.appendChild(createElementFromHtml(page2_text.nextChapterBtnHTML(comic_id, next_chap_id)));
      }
      if (prev_chap_id && next_chap_id) document.querySelector('.btmBtnBox').style.width = '326px';

      //console.log('[执行脚本结束]');
    };

    return (_ctx, _cache) => {
      return Object(external_Vue_["openBlock"])(), Object(external_Vue_["createElementBlock"])("div", {
        innerHTML: Object(external_Vue_["unref"])(html)
      }, null, 8, comicvue_type_script_setup_true_lang_js_hoisted_1);
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page2/comic.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page2/comic.vue



const comic_exports_ = page2_comicvue_type_script_setup_true_lang_js;

/* harmony default export */ var page2_comic = (comic_exports_);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page2/comment.vue?vue&type=script&setup=true&lang=js



/* harmony default export */ var page2_commentvue_type_script_setup_true_lang_js = ({
  __name: 'comment',
  props: ['condition', 'basicScriptLoadStatus', 'comicId', 'pageLoadStatus'],
  setup(__props) {
    const props = __props;
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils
    } = proxy;
    const {
      basicScriptLoadStatus,
      pageLoadStatus
    } = Object(external_Vue_["toRefs"])(props);
    const {
      condition,
      comicId
    } = props;
    const {
      createElementFromHtml,
      getStorageItem,
      setStorageItem
    } = $utils;
    const chapterId = location.pathname.split('/')[2].split('.')[0];
    const unwatch = Object(external_Vue_["watch"])(() => [basicScriptLoadStatus.value, pageLoadStatus.value], async ([status, status2]) => {
      switch (condition) {
        case 1:
          unwatch();
          break;
        case 2:
          if (status == 'loadEnd' && status2 == 'loadEnd') {
            unwatch();
            await addScript();
            scriptEnhance();
          }
          break;
        default:
          unwatch();
          break;
      }
    });
    Object(external_Vue_["onMounted"])(() => {
      switch (condition) {
        case 1:
          scriptEnhance();
          break;
        case 2:
          break;
        default:
          break;
      }
    });
    const addCss = () => {
      $utils.addCss(page2_text.cssHTML2);
    };
    const addScript = async () => {
      // 加载评论
      await $utils.addScript('https://static.dmzj.com/module/js/dmzjpointView.js', true);
      $utils.addScript(page2_text.scriptHTML2(comicId, chapterId));
    };
    const scriptEnhance = async () => {
      addCss();
      enhanceComment();
    };
    const enhanceComment = async () => {
      // await new Promise((resolve, reject) => {
      //     let count = 0
      //     let timer = setInterval(() => {
      //         count++
      //         if (count > 20) {
      //             clearInterval(timer)
      //             //console.log('[评论加载失败]');
      //             reject()
      //         }
      //         if (document.querySelector('.comic_gd_li>li')) {
      //             clearInterval(timer)
      //             resolve()
      //         }
      //     }, 500);
      // })

      updateHiddenComment();
      addBanBtn();
      let targetObserver = new MutationObserver((mutations, observer) => {
        if (document.querySelector('.comic_gd_li>li')) {
          updateHiddenComment();
          addBanBtn();
        }
      });
      targetObserver.observe(document.querySelector('.comic_gd_li'), {
        childList: true
      });
    };
    const updateHiddenComment = () => {
      let comicList = getStorageItem('comicList');
      let comic = comicList.find(item => item.id == comicId);
      let doms = document.querySelectorAll('.comic_gd_li>li');
      for (let dom of doms) {
        let a = dom.querySelector('a');
        if (a) {
          let commentId = a.getAttribute('vote_id');
          if (comic.banList2.find(item => item.commentId == commentId)) {
            dom.style.display = 'none';
          }
        }
      }
    };
    const addBanBtn = () => {
      let doms = document.querySelectorAll('.comic_gd_li>li');
      for (let dom of doms) {
        let a = dom.querySelector('a');
        if (a && !dom.querySelector('.ban-btn')) {
          let commentId = a.getAttribute('vote_id');
          createBanBtn(dom, commentId);
        }
      }
    };
    const createBanBtn = (dom, commentId) => {
      dom.appendChild(createElementFromHtml(page2_text.banBtnHTML(commentId)));
      let banEvt = e => {
        let commentId = e.target.dataset.commentid;
        let comicList = getStorageItem('comicList');
        let comic = comicList.find(item => item.id == comicId);
        if (!comic.banList2.find(item => item.commentId == commentId)) {
          comic.banList2.push({
            commentId: commentId
          });
          setStorageItem('comicList', comicList);
          updateHiddenComment();
        }
      };
      dom.addEventListener('click', banEvt);
    };
    return (_ctx, _cache) => {
      return null;
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page2/comment.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page2/comment.vue



const page2_comment_exports_ = page2_commentvue_type_script_setup_true_lang_js;

/* harmony default export */ var page2_comment = (page2_comment_exports_);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page2.vue?vue&type=script&setup=true&lang=js





/* harmony default export */ var page2vue_type_script_setup_true_lang_js = ({
  __name: 'page2',
  setup(__props) {
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils,
      $store
    } = proxy;
    const {
      getUrlParam,
      initSyncStorage
    } = $utils;
    let isShow = Object(external_Vue_["ref"])(false);
    // 1-正常页面,2-404页面或提示页面不见
    let condition = Object(external_Vue_["ref"])(1);
    const comicId = getUrlParam('comic_id') || g_comic_id;
    let basicScriptLoadStatus = Object(external_Vue_["ref"])('');
    let pageLoadStatus = Object(external_Vue_["ref"])('');
    const updatePageLoadStatus = value => {
      pageLoadStatus.value = value;
    };
    Object(external_Vue_["onMounted"])(() => {
      if (self == top) {
        let dom = document.querySelector('title');
        let dom2 = document.querySelector('meta[http-equiv=refresh]');
        if (dom && dom.innerText == '404 Not Found' || dom2) {
          window.stop();
          addCss();
          addScript();
          condition.value = 2;
        }
        initSyncStorage();
        //console.log('[执行脚本开始]')
        isShow.value = true;
      } else {
        initSyncStorage();
      }
    });
    const addCss = () => {
      $utils.addCss(page2_text.cssHTML);
      $utils.addCss('https://static.dmzj.com/public/css/global_nav.css');
      $utils.addCss('https://manhua.dmzj.com/css/uploadstyle.css');
    };
    const addScript = async () => {
      // 页面基础脚本
      await $utils.addScript('https://static.dmzj.com/public/js/jquery-1.8.2.min.js', true);
      await $utils.addScript('https://static.dmzj.com/public/js/jquery.cookie.js', true);
      await $utils.addScript('https://static.dmzj.com/public/js/jquery.lazyload.min.js', true);
      await $utils.addScript('https://static.dmzj.com/public/js/globalNav.js?2015609', true);
      await $utils.addScript('https://static.dmzj.com/public/js/dmzj-land-2015.6.js?20156030', true);
      basicScriptLoadStatus.value = 'loadEnd';
    };
    return (_ctx, _cache) => {
      return Object(external_Vue_["openBlock"])(), Object(external_Vue_["createElementBlock"])(external_Vue_["Fragment"], null, [Object(external_Vue_["unref"])(isShow) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page2_comic, {
        key: 0,
        condition: Object(external_Vue_["unref"])(condition),
        comicId: Object(external_Vue_["unref"])(comicId),
        basicScriptLoadStatus: Object(external_Vue_["unref"])(basicScriptLoadStatus),
        onUpdatePageLoadStatus: updatePageLoadStatus
      }, null, 8, ["condition", "comicId", "basicScriptLoadStatus"])) : Object(external_Vue_["createCommentVNode"])("", true), Object(external_Vue_["unref"])(isShow) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page2_comment, {
        key: 1,
        condition: Object(external_Vue_["unref"])(condition),
        basicScriptLoadStatus: Object(external_Vue_["unref"])(basicScriptLoadStatus),
        comicId: Object(external_Vue_["unref"])(comicId),
        pageLoadStatus: Object(external_Vue_["unref"])(pageLoadStatus)
      }, null, 8, ["condition", "basicScriptLoadStatus", "comicId", "pageLoadStatus"])) : Object(external_Vue_["createCommentVNode"])("", true)], 64);
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page2.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page2.vue



const page2_exports_ = page2vue_type_script_setup_true_lang_js;

/* harmony default export */ var page2 = (page2_exports_);
// CONCATENATED MODULE: ./src/assets/page3/text.ts

const {
  formatDateYYYYMMDD: page3_text_formatDateYYYYMMDD
} = utils;
const comicHTML = comic => {
  let {
    id,
    name,
    lastUpdateChapterName,
    cover,
    lastUpdatetime,
    namePinyin,
    lastUpdateChapterId
  } = comic;
  // if (lastUpdatetime) {
  //     lastUpdatetime = formatDateYYYYMMDD(new Date(Number(lastUpdatetime.toString().padEnd(13, '0'))))
  // } else {
  //     lastUpdatetime = ''
  // }
  let lastUpdatetime2 = '';
  if (lastUpdatetime) {
    lastUpdatetime = Number(lastUpdatetime.toString().padEnd(13, '0'));
    lastUpdatetime2 = page3_text_formatDateYYYYMMDD(new Date(lastUpdatetime));
    let diff = new Date().getTime() - lastUpdatetime;
    if (diff > 0 && diff < 3600 * 1000) {
      lastUpdatetime2 = Math.floor(diff / (60 * 1000)) + '分钟前';
    } else if (diff >= 3600 * 1000 && diff < 3600 * 1000 * 24) {
      lastUpdatetime2 = Math.floor(diff / (3600 * 1000)) + '小时前';
    } else if (diff >= 3600 * 1000 * 24 && diff < 3600 * 1000 * 24 * 3) {
      lastUpdatetime2 = Math.floor(diff / (3600 * 1000 * 24)) + '天前';
    }
  }
  return `
    <div class="dy_content_li dy_content_li_new" data-comicid="${id}">
        <div class="dy_img"><a href="https://manhua.dmzj.com/${namePinyin}" target="_blank"><img src="${cover}" alt="" width="88" height="118"></a></div>
        <div class="dy_r">
            <h3><a href="https://manhua.dmzj.com/${namePinyin}" target="_blank">${name}</a></h3>
            <p>更新内容：<em class="co_1 c_space"><a href="https://manhua.dmzj.com/${namePinyin}/${lastUpdateChapterId}.shtml?comic_id=${id}#@page=1" target="_blank" onclick="reader.update_read_status(${id});">${lastUpdateChapterName}</a></em></p>
            <p>更新时间：<em class="co_1">${lastUpdatetime2}</em></p>
            <a href="https://manhua.dmzj.com/${namePinyin}" target="_blank" class="begin">开始阅读</a>
            <a href="javascript:;" class="qx qx_new" value="${id}" onclick="reader.ajax_del_subscribe(${id})">取消订阅</a>
        </div>
    </div>
    `;
};
/* harmony default export */ var page3_text = ({
  comicHTML
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page3/comic.vue?vue&type=script&setup=true&lang=js









const page3_comicvue_type_script_setup_true_lang_js_hoisted_1 = {
  class: "config-container"
};
const _hoisted_2 = {
  class: "progress-container"
};
const _hoisted_3 = {
  class: "row1"
};
const _hoisted_4 = {
  class: "row2"
};
const _hoisted_5 = /*#__PURE__*/Object(external_Vue_["createElementVNode"])("div", {
  class: "row-tips"
}, "检查更新中", -1);



/* harmony default export */ var page3_comicvue_type_script_setup_true_lang_js = ({
  __name: 'comic',
  setup(__props) {
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils,
      $store
    } = proxy;
    const {
      createElementFromHtml,
      getStorageItem,
      getUserInfo,
      isConfig,
      setStorageItem,
      request,
      dmzjDecrypt,
      formatDateYYYYMMDD,
      syncStorage
    } = $utils;
    const {
      rd,
      dmzjProto
    } = $store;
    const {
      pinyin
    } = pinyinPro;
    let isConfigShow = Object(external_Vue_["ref"])(false);
    const userInfo = Object(external_Vue_["reactive"])({
      cookie_my: '',
      userId: '',
      userName: '',
      isLogin: '',
      token: ''
    });
    let duration = Object(external_Vue_["ref"])(180);
    let importProgress = Object(external_Vue_["ref"])(0);
    let updateProgress = Object(external_Vue_["ref"])(0);
    let isAutoUpdate = Object(external_Vue_["ref"])(false);
    let isGrey = Object(external_Vue_["ref"])(true);
    Object(external_Vue_["onMounted"])(() => {
      GM_registerMenuCommand('配置', showConfig);
      Object.assign(userInfo, getUserInfo());
      //console.log('[用户信息]', userInfo)
      initState();
      checkNewComic();
      layout();
      syncStorage();
    });
    const showConfig = () => {
      isConfigShow.value = true;
    };
    const closeConfig = () => {
      isConfigShow.value = false;
    };
    const initState = () => {
      isAutoUpdate.value = getStorageItem('isAutoUpdate');
      isGrey.value = getStorageItem('isGrey');
      if (isGrey.value) {
        document.body.classList.add('isGrey');
      } else {
        document.body.classList.remove('isGrey');
      }
    };
    const toggleAutoUpdateState = () => {
      isAutoUpdate.value = !isAutoUpdate.value;
      setStorageItem('isAutoUpdate', isAutoUpdate.value, false);
    };
    const toggleGreyState = () => {
      isGrey.value = !isGrey.value;
      setStorageItem('isGrey', isGrey.value, false);
      if (isGrey.value) {
        document.body.classList.add('isGrey');
      } else {
        document.body.classList.remove('isGrey');
      }
    };
    const checkNewComic = () => {
      let comicNum = getStorageItem('comicNum');
      let comicList = getStorageItem('comicList');
      let tempComicList = comicList.filter(item => item.hidden && item.isSubscribe);
      if (tempComicList.length > comicNum) {
        let diff = tempComicList.length - comicNum;
        Object(external_ElementPlus_["ElMessage"])({
          showClose: true,
          message: `本次新增${diff}部漫画`,
          type: 'success'
        });
      }
      setStorageItem('comicNum', tempComicList.length, false);
    };
    const layout = () => {
      let progressBar = document.querySelector('.progress-container');
      document.querySelector('#read_id').appendChild(progressBar);
      let hasInitUpdate = false;
      let newComicObserver = new MutationObserver(async (mutations, observer) => {
        let dom = document.querySelector('#my_subscribe_id>.dy_content_li_new');
        if (dom) {
          newComicObserver.disconnect();
          if (isAutoUpdate.value) await updateHiddenComicSync();
          hasInitUpdate = true;
        }
      });
      newComicObserver.observe(document.querySelector('#my_subscribe_id'), {
        childList: true
      });
      showHiddenComic();
      let isLayoutEnd = true;
      let comicObserver = new MutationObserver(async (mutations, observer) => {
        if (isLayoutEnd && hasInitUpdate) {
          isLayoutEnd = false;
          //console.log('[漫画列表布局更新]');
          isLayoutEnd = await showHiddenComic();
          //console.log('[重新生成布局结束]');
        }
      });

      comicObserver.observe(document.querySelector('#my_subscribe_id'), {
        childList: true
      });
    };
    const showHiddenComic = async () => {
      let doms = document.querySelectorAll('.dy_content_li_new');
      for (let dom of doms) {
        dom.remove();
      }
      let comicList = getStorageItem('comicList');
      let comicContainer = document.querySelector('#my_subscribe_id');
      let tempComicList = comicList.filter(item => item.hidden && item.isSubscribe);
      for (let comic of tempComicList) {
        let comicEle = createElementFromHtml(page3_text.comicHTML(comic));
        comicContainer.appendChild(comicEle);
      }
      sortComic();
      let doms2 = document.querySelectorAll('.dy_content_li_new');
      for (let dom of doms2) {
        let cancelBtn = dom.querySelector('.qx_new');
        let comicId = dom.dataset.comicid;
        cancelBtn.addEventListener('click', () => {
          cancelSubscribe(comicId);
        });
      }
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
      return true;
    };

    // const updateHiddenComic = async () => {
    //     let comicList = getStorageItem('comicList')
    //     //console.log('[更新开始]');
    //     let time = new Date().getTime()
    //     for (let comic of comicList) {
    //         if (!comic.hidden || !comic.isSubscribe) continue
    //         let comicInfo = await doGetComicInfo(comic.id)
    //         let tempComicInfo = {
    //             name: comicInfo.title,
    //             lastUpdateChapterName: comicInfo.last_update_chapter_name,
    //             cover: comicInfo.cover,
    //             lastUpdatetime: comicInfo.last_updatetime,
    //             namePinyin: comicInfo.comic_py,
    //             lastUpdateChapterId: comicInfo.last_update_chapter_id
    //         }
    //         Object.assign(comic, tempComicInfo)
    //     }
    //     setStorageItem('comicList', comicList)
    //     //console.log('[更新结束]', getStorageItem('comicList'));
    //     //console.log((new Date().getTime() - time) / 1000);
    //     showHiddenComic()
    // }

    let isUpdating = Object(external_Vue_["ref"])(false);
    const updateHiddenComicSync = async () => {
      if (isUpdating.value) return;
      isUpdating.value = true;
      let comicList = getStorageItem('comicList');
      let promiseList = [];
      //console.log('[更新开始]');
      let time = new Date().getTime();
      updateNowNum = 0;
      for (let comic of comicList) {
        if (!comic.hidden || !comic.isSubscribe) continue;
        promiseList.push(doGetComicInfoCount(comic.id));
      }
      let tempComicList = await Promise.all(promiseList);
      for (let comic of tempComicList) {
        let comic2 = comicList.find(item => item.id == comic.id);
        if (comic2) {
          let comicInfo = {
            name: comic.title,
            lastUpdateChapterName: comic.last_update_chapter_name,
            cover: comic.cover,
            lastUpdatetime: comic.last_updatetime,
            namePinyin: comic.comic_py,
            lastUpdateChapterId: comic.last_update_chapter_id
          };
          Object.assign(comic2, comicInfo);
        }
      }
      isUpdating.value = false;
      //console.log(`[更新结束,耗时${(new Date().getTime() - time) / 1000}]`, tempComicList);
      setStorageItem('comicList', comicList);
      showHiddenComic();
    };
    // 漫画按更新时间重新排序
    const sortComic = () => {
      //console.log('[重新排序]');
      let doms = Array.from(document.querySelectorAll('.dy_content_li'));
      for (let dom of doms) {
        let timeStr = dom.querySelector('.co_1:not(.c_space)').innerText;
        let time = formatDateTime(timeStr);
      }
      doms.sort((a, b) => {
        return formatDateTime(b.querySelector('.co_1:not(.c_space)').innerText) - formatDateTime(a.querySelector('.co_1:not(.c_space)').innerText);
      });
      let val = document.querySelector('.sub_potion .optioned').getAttribute('value');
      let val2 = document.querySelector('.letter_id.cur').getAttribute('value');
      let html = '';
      for (let dom of doms) {
        if (Array.from(dom.classList).indexOf('dy_content_li_new') > -1) {
          if (val == 1) {
            let isDomShow = filterComic(dom, val2);
            if (isDomShow) {
              dom.style.display = 'inline-block';
            } else {
              dom.style.display = 'none';
            }
          } else {
            dom.style.display = 'none';
          }
        }
        html += dom.outerHTML;
      }
      document.querySelector('#my_subscribe_id').innerHTML = html;
    };
    const filterComic = (dom, letter) => {
      let text = dom.querySelector('h3>a').innerText;
      let namePinyin = pinyin(text, {
        toneType: 'none'
      }).replace(/\s*/g, '').toLowerCase();
      switch (letter) {
        case '0':
          return true;
          break;
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'b':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
          if (namePinyin[0] == letter) {
            return true;
          } else {
            return false;
          }
          break;
        case '9':
          if (!new RegExp('^[a-zA-Z]*$').test(namePinyin[0])) {
            return true;
          } else {
            return false;
          }
          break;
        default:
          return false;
          break;
      }
    };
    const formatDateTime = timeStr => {
      if (!isNaN(new Date(timeStr).getTime())) {
        return new Date(timeStr).getTime();
      } else {
        if (timeStr.indexOf('天') > -1) {
          let num = Number(timeStr.split('天')[0]);
          return new Date().getTime() - 1000 * 60 * 60 * 24 * num;
        } else if (timeStr.indexOf('小时') > -1) {
          let num = Number(timeStr.split('小时')[0]);
          return new Date().getTime() - 1000 * 60 * 60 * num;
        } else if (timeStr.indexOf('分') > -1) {
          let num = Number(timeStr.split('分')[0]);
          return new Date().getTime() - 1000 * 60 * num;
        }
      }
    };
    const cancelSubscribe = comicId => {
      let comicList = getStorageItem('comicList');
      let index = comicList.findIndex(item => item.id == comicId);
      if (index > -1) {
        let comic = comicList[index];
        comic.isSubscribe = false;
        comicList.splice(index, 1, comic);
        setStorageItem('comicList', comicList, false);
        let tempComicList = comicList.filter(item => item.hidden && item.isSubscribe);
        setStorageItem('comicNum', tempComicList.length, false);
        syncStorage();
        //console.log('[取消]', getStorageItem('comicList'));
      }
    };

    const exportComic = () => {
      let comicList = getStorageItem('comicList');
      let storageJson = {
        comicList: comicList
      };
      let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storageJson));
      let downloadElement = document.createElement('a');
      downloadElement.setAttribute('href', dataStr);
      downloadElement.setAttribute('download', `config_${rd}.json`);
      downloadElement.click();
    };
    const importComic = () => {
      let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '.json');
      input.setAttribute('id', 'load-config-input');
      input.click();
      input.onchange = () => {
        let file = input.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = event => {
          let res = event.target.result;
          if (!isConfig(res)) {
            Object(external_ElementPlus_["ElMessage"])({
              showClose: true,
              message: '数据格式错误！',
              type: 'error'
            });
            return;
          }
          let prevComicList = getStorageItem('comicList');
          let importComicList = JSON.parse(res).comicList;
          let comicListAll = [...prevComicList];
          for (let comic of importComicList) {
            if (!prevComicList.find(item => item.id == comic.id)) {
              comicListAll.push(comic);
            } else {
              let comic2 = comicListAll.find(item => item.id == comic.id);
              // 屏蔽列表合并
              let banListAll = [...comic.banList];
              for (let banItem of comic2.banList) {
                if (banListAll.find(item => item.commentId == banItem.commentId)) continue;
                banListAll.push(banItem);
              }
              comic2.banList = banListAll;
              let banListAll2 = [...comic.banList2];
              for (let banItem of comic2.banList2) {
                if (banListAll2.find(item => item.commentId == banItem.commentId)) continue;
                banListAll2.push(banItem);
              }
              comic2.banList2 = banListAll2;
              if (comic.isSubscribe) {
                comic2.isSubscribe = true;
              }
            }
          }
          setStorageItem('comicList', comicListAll);
          //console.log(getStorageItem('comicList'));
          window.location.reload();
        };
      };
    };
    const clearComic = () => {
      external_ElementPlus_["ElMessageBox"].confirm('将删除所有通过此脚本添加的漫画，不影响本地数据，是否确认？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setStorageItem('comicList', []);
        setStorageItem('comicNum', 0);
        window.location.reload();
      }).catch(() => {});
    };
    let totalPage = 1;
    let isEnd = false;
    let comicIdList = [];
    let isImporting = Object(external_Vue_["ref"])(false);
    const importComicFromSubscribe = async () => {
      if (isUpdating.value) {
        external_ElementPlus_["ElMessage"].error('正在检查漫画更新，请稍后再试');
        return;
      }
      if (isImporting.value) return;
      closeConfig();
      Object(external_ElementPlus_["ElMessage"])({
        showClose: true,
        message: '开始导入数据',
        type: 'info'
      });
      isImporting.value = true;
      totalPage = 1;
      isEnd = false;
      let lis = Array.from(document.querySelectorAll('.qx'));
      comicIdList = lis.map(item => item.getAttribute('value'));
      let otherSubscribeComicList = [];
      for (let i = 0; i < totalPage; i++) {
        if (isEnd) break;
        let html = '';
        try {
          html = await getComicHtml(i + 1);
        } catch (error) {
          //console.log('[异常]', error);
        }
        if (!html) continue;
        let dls = getComicDls(html);
        for (let j = 0; j < dls.length; j++) {
          let dl = dls[j];
          importProgress.value = Number(((i * 18 + j + 1) / totalNum.value * 100).toFixed(2));
          let comicInfo = null;
          try {
            comicInfo = await getComicInfo(dl);
          } catch (error) {
            //console.log('[异常]', error);
          }
          if (!comicInfo) continue;
          let {
            id,
            hidden,
            title,
            last_update_chapter_name,
            cover,
            last_updatetime,
            comic_py,
            last_update_chapter_id
          } = comicInfo;
          if (comicInfo.hidden != 1) continue;
          let comic = {
            id: id,
            banList: [],
            banList2: [],
            hidden: true,
            isSubscribe: true,
            name: title,
            lastUpdateChapterName: last_update_chapter_name,
            cover: cover,
            lastUpdatetime: last_updatetime,
            namePinyin: comic_py,
            lastUpdateChapterId: last_update_chapter_id
          };
          //console.log('[添加漫画]', id, title, comicInfo)
          otherSubscribeComicList.push(comic);
        }
      }
      let comicListOld = getStorageItem('comicList');
      let comicListAll = [...comicListOld];
      for (let comic of otherSubscribeComicList) {
        if (!comicListOld.find(item => item.id == comic.id)) {
          comicListAll.push(comic);
        } else {
          let comic2 = comicListAll.find(item => item.id == comic.id);
          comic2.isSubscribe = true;
        }
      }
      setStorageItem('comicList', comicListAll);
      //console.log('[新增漫画列表]', otherSubscribeComicList);
      isImporting.value = false;
      window.location.reload();
    };
    const getComicHtml = async currentPage => {
      let html = await request({
        method: 'post',
        url: 'https://i.dmzj.com/otherCenter/ajaxGetHisSubscribe',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify({
          'page': currentPage,
          'type_id': 1,
          'letter_id': 0,
          'hisUid': userInfo.userId,
          'rightFlag': 1
        })
      });
      return html;
    };
    let totalNum = Object(external_Vue_["ref"])(0);
    const getComicDls = html => {
      let startStr = 'var all_num =';
      let startIndex = html.indexOf(startStr);
      let sliceStr = html.slice(startIndex + startStr.length);
      let endIndex = sliceStr.indexOf(';');
      totalNum.value = Number(sliceStr.slice(0, endIndex));
      totalPage = Math.ceil(totalNum.value / 18);
      let div = document.createElement('div');
      div.innerHTML = html;
      let dls = Array.from(div.querySelectorAll('dl'));
      return dls;
    };
    const getComicInfo = async dl => {
      // 漫画id存在则不添加
      let value = dl.querySelector('.addSubBtn.dread_btn').getAttribute('onclick');
      let startStr = 'other_subscribe(';
      let startIndex = value.indexOf(startStr);
      if (startIndex == -1) {
        startStr = 'subscribe_remove(';
        startIndex = value.indexOf(startStr);
      }
      let endIndex = value.indexOf(',');
      let comicId = value.slice(startIndex + startStr.length, endIndex);
      if (comicIdList.indexOf(comicId) > -1) return;
      // 最近一次更新距今超过duration天的不添加,并结束查询
      let lastUpdatetime = dl.querySelectorAll('dd>p')[1].innerText.split('：')[1];
      if (!isNaN(new Date(lastUpdatetime).getTime())) {
        lastUpdatetime = new Date(lastUpdatetime).getTime();
      } else {
        lastUpdatetime = new Date().getTime();
      }
      if (new Date().getTime() - lastUpdatetime > 3600 * 1000 * 24 * duration.value) {
        isEnd = true;
        return;
      }
      let comicInfo = await doGetComicInfo(comicId);
      return comicInfo;
    };
    const doGetComicInfo = async comicId => {
      let str = '';
      try {
        str = await requestComicInfo(comicId);
      } catch (error) {
        //console.log('[异常]', error);
      }
      if (!str) return;
      return decryptComicInfo(str);
    };
    let updateTotalNum = getStorageItem('comicList').length;
    let updateNowNum = 0;
    const doGetComicInfoCount = async comicId => {
      let res = await doGetComicInfo(comicId);
      updateNowNum++;
      updateProgress.value = Number((updateNowNum / updateTotalNum * 100).toFixed(2));
      return res;
    };
    const requestComicInfo = comicId => {
      return request({
        method: 'get',
        url: `https://v4api.idmzj.com/comic/detail/${comicId}?uid=2665531&disable_level=1`
      });
    };
    const decryptComicInfo = str => {
      let comicInfo = null;
      try {
        let bytes = dmzjDecrypt(str);
        let root = protobuf.Root.fromJSON(dmzjProto);
        let message = root.lookupType("proto");
        let data = message.decode(Uint8Array.from(bytes));
        comicInfo = data.comicInfo;
      } catch (error) {
        //console.log('[异常]', error);
      }
      return comicInfo;
    };
    return (_ctx, _cache) => {
      const _component_el_button = Object(external_Vue_["resolveComponent"])("el-button");
      const _component_el_row = Object(external_Vue_["resolveComponent"])("el-row");
      const _component_el_input_number = Object(external_Vue_["resolveComponent"])("el-input-number");
      const _component_el_progress = Object(external_Vue_["resolveComponent"])("el-progress");
      return Object(external_Vue_["openBlock"])(), Object(external_Vue_["createElementBlock"])(external_Vue_["Fragment"], null, [Object(external_Vue_["withDirectives"])(Object(external_Vue_["createElementVNode"])("div", page3_comicvue_type_script_setup_true_lang_js_hoisted_1, [Object(external_Vue_["createVNode"])(_component_el_row, null, {
        default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createVNode"])(_component_el_button, {
          onClick: importComic
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("导入漫画")]),
          _: 1
        }), Object(external_Vue_["createVNode"])(_component_el_button, {
          onClick: exportComic
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("导出漫画")]),
          _: 1
        }), Object(external_Vue_["createVNode"])(_component_el_button, {
          onClick: clearComic
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("清空漫画")]),
          _: 1
        }), Object(external_Vue_["createVNode"])(_component_el_button, {
          onClick: closeConfig
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("关闭")]),
          _: 1
        })]),
        _: 1
      }), Object(external_Vue_["createVNode"])(_component_el_row, null, {
        default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createVNode"])(_component_el_input_number, {
          class: "number-input",
          modelValue: Object(external_Vue_["unref"])(duration),
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => Object(external_Vue_["isRef"])(duration) ? duration.value = $event : duration = $event),
          min: 1,
          controls: false,
          precision: 0
        }, null, 8, ["modelValue"]), Object(external_Vue_["createVNode"])(_component_el_button, {
          class: "text"
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("天以内")]),
          _: 1
        }), Object(external_Vue_["createVNode"])(_component_el_input_number, {
          class: "number-input2",
          modelValue: userInfo.userId,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => userInfo.userId = $event),
          min: 1,
          controls: false,
          precision: 0
        }, null, 8, ["modelValue"]), Object(external_Vue_["createVNode"])(_component_el_button, {
          onClick: importComicFromSubscribe
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("从订阅导入")]),
          _: 1
        })]),
        _: 1
      }), Object(external_Vue_["createVNode"])(_component_el_row, null, {
        default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createVNode"])(_component_el_button, {
          type: Object(external_Vue_["unref"])(isGrey) ? 'success' : 'info',
          onClick: toggleGreyState
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("置灰")]),
          _: 1
        }, 8, ["type"]), Object(external_Vue_["createVNode"])(_component_el_button, {
          type: Object(external_Vue_["unref"])(isAutoUpdate) ? 'success' : 'info',
          onClick: toggleAutoUpdateState
        }, {
          default: Object(external_Vue_["withCtx"])(() => [Object(external_Vue_["createTextVNode"])("自动检查更新")]),
          _: 1
        }, 8, ["type"])]),
        _: 1
      })], 512), [[external_Vue_["vShow"], Object(external_Vue_["unref"])(isConfigShow)]]), Object(external_Vue_["createElementVNode"])("div", _hoisted_2, [Object(external_Vue_["createElementVNode"])("div", _hoisted_3, [Object(external_Vue_["withDirectives"])(Object(external_Vue_["createVNode"])(_component_el_progress, {
        percentage: Object(external_Vue_["unref"])(importProgress)
      }, null, 8, ["percentage"]), [[external_Vue_["vShow"], Object(external_Vue_["unref"])(isImporting)]])]), Object(external_Vue_["withDirectives"])(Object(external_Vue_["createElementVNode"])("div", _hoisted_4, [_hoisted_5, Object(external_Vue_["createVNode"])(_component_el_progress, {
        percentage: Object(external_Vue_["unref"])(updateProgress)
      }, null, 8, ["percentage"])], 512), [[external_Vue_["vShow"], Object(external_Vue_["unref"])(isUpdating)]])])], 64);
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page3/comic.vue?vue&type=script&setup=true&lang=js

// EXTERNAL MODULE: ./src/pages/page3/comic.vue?vue&type=style&index=0&id=5d56fe23&lang=scss
var comicvue_type_style_index_0_id_5d56fe23_lang_scss = __webpack_require__("d4ba");

// CONCATENATED MODULE: ./src/pages/page3/comic.vue





const page3_comic_exports_ = page3_comicvue_type_script_setup_true_lang_js;

/* harmony default export */ var page3_comic = (page3_comic_exports_);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/pages/page3.vue?vue&type=script&setup=true&lang=js



/* harmony default export */ var page3vue_type_script_setup_true_lang_js = ({
  __name: 'page3',
  setup(__props) {
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils
    } = proxy;
    const {
      initSyncStorage
    } = $utils;
    let isShow = Object(external_Vue_["ref"])(false);
    Object(external_Vue_["onMounted"])(() => {
      initSyncStorage();
      if (self != top) return;

      //console.log('[执行脚本开始]')
      isShow.value = true;
    });
    return (_ctx, _cache) => {
      return Object(external_Vue_["unref"])(isShow) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page3_comic, {
        key: 0
      })) : Object(external_Vue_["createCommentVNode"])("", true);
    };
  }
});
// CONCATENATED MODULE: ./src/pages/page3.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/pages/page3.vue



const page3_exports_ = page3vue_type_script_setup_true_lang_js;

/* harmony default export */ var page3 = (page3_exports_);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader-v16/dist??ref--1-1!./src/App.vue?vue&type=script&setup=true&lang=js


// 漫画详情页

// 漫画阅读页

// 我的订阅页面

/* harmony default export */ var Appvue_type_script_setup_true_lang_js = ({
  __name: 'App',
  setup(__props) {
    const {
      proxy
    } = Object(external_Vue_["getCurrentInstance"])();
    const {
      $utils
    } = proxy;
    const {
      initSyncStorage
    } = $utils;
    let isPageShow = Object(external_Vue_["ref"])(false);
    let isPageShow2 = Object(external_Vue_["ref"])(false);
    let isPageShow3 = Object(external_Vue_["ref"])(false);
    const reg = new RegExp(`https?://manhua.i?dmzj.com/[A-Za-z0-9]+/*$`);
    const reg2 = new RegExp(`https?://manhua.i?dmzj.com/[A-Za-z0-9]+/[0-9]+\.shtml\\?comic_id=[0-9]+#@?page=[0-9]*$`);
    const reg3 = new RegExp(`https?://manhua.i?dmzj.com/[A-Za-z0-9]+/[0-9]+\.shtml#@?page=[0-9]*$`);
    const reg4 = new RegExp(`https?://i.dmzj.com/subscribe`);
    const reg5 = new RegExp(`https?://manhua.i?dmzj.com/?$`);
    Object(external_Vue_["onMounted"])(async () => {
      if (reg.test(location.href)) {
        redirect();
        isPageShow.value = true;
      } else if (reg2.test(location.href) || reg3.test(location.href)) {
        redirect();
        isPageShow2.value = true;
      } else if (reg4.test(location.href)) {
        redirect();
        isPageShow3.value = true;
      } else if (reg5.test(location.href)) {
        initSyncStorage();
      }
    });
    const redirect = () => {
      if (location.protocol == 'http:') {
        location.href = location.href.replace('http:', 'https:');
      }
    };
    return (_ctx, _cache) => {
      return Object(external_Vue_["openBlock"])(), Object(external_Vue_["createElementBlock"])(external_Vue_["Fragment"], null, [Object(external_Vue_["unref"])(isPageShow) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page1, {
        key: 0
      })) : Object(external_Vue_["createCommentVNode"])("", true), Object(external_Vue_["unref"])(isPageShow2) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page2, {
        key: 1
      })) : Object(external_Vue_["createCommentVNode"])("", true), Object(external_Vue_["unref"])(isPageShow3) ? (Object(external_Vue_["openBlock"])(), Object(external_Vue_["createBlock"])(page3, {
        key: 2
      })) : Object(external_Vue_["createCommentVNode"])("", true)], 64);
    };
  }
});
// CONCATENATED MODULE: ./src/App.vue?vue&type=script&setup=true&lang=js

// CONCATENATED MODULE: ./src/App.vue



const App_exports_ = Appvue_type_script_setup_true_lang_js;

/* harmony default export */ var App = (App_exports_);
// CONCATENATED MODULE: ./src/main.ts





const root = document.createElement('div');
root.id = `app_${store.rd}`;
document.body.appendChild(root);
const app = Object(external_Vue_["createApp"])(App);
app.config.globalProperties.$store = store;
app.config.globalProperties.$utils = utils;
app.use(external_ElementPlus_default.a).mount(`#app_${store.rd}`);

/***/ }),

/***/ "cdce":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isCallable = __webpack_require__("1626");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "cf98":
/***/ (function(module, exports) {

module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
};


/***/ }),

/***/ "d012":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "d039":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "d066":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("da84");
var isCallable = __webpack_require__("1626");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "d1e7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "d2bb":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__("7282");
var anObject = __webpack_require__("825a");
var aPossiblePrototype = __webpack_require__("3bbe");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "d429":
/***/ (function(module, exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__("07fa");
var toIntegerOrInfinity = __webpack_require__("5926");

var $RangeError = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
module.exports = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw $RangeError('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};


/***/ }),

/***/ "d4ba":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_v16_dist_index_js_ref_1_1_comic_vue_vue_type_style_index_0_id_5d56fe23_lang_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4382");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_v16_dist_index_js_ref_1_1_comic_vue_vue_type_style_index_0_id_5d56fe23_lang_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_vue_loader_v16_dist_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_9_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_v16_dist_index_js_ref_1_1_comic_vue_vue_type_style_index_0_id_5d56fe23_lang_scss__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "d9b5":
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__("d066");
var isCallable = __webpack_require__("1626");
var isPrototypeOf = __webpack_require__("3a9b");
var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "da84":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || this || Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("c8ba")))

/***/ }),

/***/ "dc4a":
/***/ (function(module, exports, __webpack_require__) {

var aCallable = __webpack_require__("59ed");
var isNullOrUndefined = __webpack_require__("7234");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "df7e":
/***/ (function(module, exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__("07fa");

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
module.exports = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};


/***/ }),

/***/ "dfb9":
/***/ (function(module, exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__("07fa");

module.exports = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};


/***/ }),

/***/ "e163":
/***/ (function(module, exports, __webpack_require__) {

var hasOwn = __webpack_require__("1a2d");
var isCallable = __webpack_require__("1626");
var toObject = __webpack_require__("7b0b");
var sharedKey = __webpack_require__("f772");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "e177":
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__("d039");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "e330":
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__("40d5");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "e391":
/***/ (function(module, exports, __webpack_require__) {

var toString = __webpack_require__("577e");

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ "e893":
/***/ (function(module, exports, __webpack_require__) {

var hasOwn = __webpack_require__("1a2d");
var ownKeys = __webpack_require__("56ef");
var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
var definePropertyModule = __webpack_require__("9bf2");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "e8b5":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("c6b6");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ "ebb5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__("4b11");
var DESCRIPTORS = __webpack_require__("83ab");
var global = __webpack_require__("da84");
var isCallable = __webpack_require__("1626");
var isObject = __webpack_require__("861d");
var hasOwn = __webpack_require__("1a2d");
var classof = __webpack_require__("f5df");
var tryToString = __webpack_require__("0d51");
var createNonEnumerableProperty = __webpack_require__("9112");
var defineBuiltIn = __webpack_require__("cb2d");
var defineBuiltInAccessor = __webpack_require__("edd0");
var isPrototypeOf = __webpack_require__("3a9b");
var getPrototypeOf = __webpack_require__("e163");
var setPrototypeOf = __webpack_require__("d2bb");
var wellKnownSymbol = __webpack_require__("b622");
var uid = __webpack_require__("90e3");
var InternalStateModule = __webpack_require__("69f3");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ "edd0":
/***/ (function(module, exports, __webpack_require__) {

var makeBuiltIn = __webpack_require__("13d2");
var defineProperty = __webpack_require__("9bf2");

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ "f495":
/***/ (function(module, exports, __webpack_require__) {

var toPrimitive = __webpack_require__("c04e");

var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
};


/***/ }),

/***/ "f5df":
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
var isCallable = __webpack_require__("1626");
var classofRaw = __webpack_require__("c6b6");
var wellKnownSymbol = __webpack_require__("b622");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "f772":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5692");
var uid = __webpack_require__("90e3");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "f8cd":
/***/ (function(module, exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__("5926");

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ "fc6a":
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__("44ad");
var requireObjectCoercible = __webpack_require__("1d80");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "fdbf":
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__("04f8");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ })

/******/ });
//# sourceMappingURL=app.bbd88323.js.map


})();
