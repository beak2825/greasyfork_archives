// ==UserScript==
// @name         PT Helper
// @namespace    https://rix.li/
// @version      0.15
// @description  Private trakers goodies.
// @author       Rix
// @match        *://hdbits.org/*
// @match        *://sdbits.org/*
// @match        *://chdbits.co/*
// @match        *://tp.m-team.cc/*
// @match        *://u2.dmhy.org/*
// @match        *://hdsky.me/*
// @match        *://hdhome.org/*
// @match        *://asiandvdclub.org/*
// @match        *://open.cd/*
// @match        *://jpopsuki.eu/*
// @match        *://www.criterion.com/*
// @match        *://ourbits.club/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/31974/PT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/31974/PT%20Helper.meta.js
// ==/UserScript==

/*! URI.js v1.19.0 http://medialize.github.io/URI.js/ */
/* build contains: IPv6.js, punycode.js, SecondLevelDomains.js, URI.js, URITemplate.js */
(function(f,n){"object"===typeof module&&module.exports?module.exports=n():"function"===typeof define&&define.amd?define(n):f.IPv6=n(f)})(this,function(f){var n=f&&f.IPv6;return{best:function(h){h=h.toLowerCase().split(":");var k=h.length,b=8;""===h[0]&&""===h[1]&&""===h[2]?(h.shift(),h.shift()):""===h[0]&&""===h[1]?h.shift():""===h[k-1]&&""===h[k-2]&&h.pop();k=h.length;-1!==h[k-1].indexOf(".")&&(b=7);var q;for(q=0;q<k&&""!==h[q];q++);if(q<b)for(h.splice(q,1,"0000");h.length<b;)h.splice(q,0,"0000");
for(q=0;q<b;q++){k=h[q].split("");for(var f=0;3>f;f++)if("0"===k[0]&&1<k.length)k.splice(0,1);else break;h[q]=k.join("")}k=-1;var n=f=0,g=-1,p=!1;for(q=0;q<b;q++)p?"0"===h[q]?n+=1:(p=!1,n>f&&(k=g,f=n)):"0"===h[q]&&(p=!0,g=q,n=1);n>f&&(k=g,f=n);1<f&&h.splice(k,f,"");k=h.length;b="";""===h[0]&&(b=":");for(q=0;q<k;q++){b+=h[q];if(q===k-1)break;b+=":"}""===h[k-1]&&(b+=":");return b},noConflict:function(){f.IPv6===this&&(f.IPv6=n);return this}}});
(function(f){function n(b){throw new RangeError(w[b]);}function h(b,e){for(var g=b.length,h=[];g--;)h[g]=e(b[g]);return h}function k(b,e){var g=b.split("@"),f="";1<g.length&&(f=g[0]+"@",b=g[1]);b=b.replace(C,".");g=b.split(".");g=h(g,e).join(".");return f+g}function b(b){for(var e=[],g=0,h=b.length,f,a;g<h;)f=b.charCodeAt(g++),55296<=f&&56319>=f&&g<h?(a=b.charCodeAt(g++),56320==(a&64512)?e.push(((f&1023)<<10)+(a&1023)+65536):(e.push(f),g--)):e.push(f);return e}function q(b){return h(b,function(b){var e=
"";65535<b&&(b-=65536,e+=t(b>>>10&1023|55296),b=56320|b&1023);return e+=t(b)}).join("")}function z(b,e){return b+22+75*(26>b)-((0!=e)<<5)}function u(b,g,h){var f=0;b=h?e(b/700):b>>1;for(b+=e(b/g);455<b;f+=36)b=e(b/35);return e(f+36*b/(b+38))}function g(b){var g=[],h=b.length,f=0,k=128,a=72,c,d;var l=b.lastIndexOf("-");0>l&&(l=0);for(c=0;c<l;++c)128<=b.charCodeAt(c)&&n("not-basic"),g.push(b.charCodeAt(c));for(l=0<l?l+1:0;l<h;){c=f;var m=1;for(d=36;;d+=36){l>=h&&n("invalid-input");var x=b.charCodeAt(l++);
x=10>x-48?x-22:26>x-65?x-65:26>x-97?x-97:36;(36<=x||x>e((2147483647-f)/m))&&n("overflow");f+=x*m;var p=d<=a?1:d>=a+26?26:d-a;if(x<p)break;x=36-p;m>e(2147483647/x)&&n("overflow");m*=x}m=g.length+1;a=u(f-c,m,0==c);e(f/m)>2147483647-k&&n("overflow");k+=e(f/m);f%=m;g.splice(f++,0,k)}return q(g)}function p(g){var h,f,k,p=[];g=b(g);var a=g.length;var c=128;var d=0;var l=72;for(k=0;k<a;++k){var m=g[k];128>m&&p.push(t(m))}for((h=f=p.length)&&p.push("-");h<a;){var x=2147483647;for(k=0;k<a;++k)m=g[k],m>=c&&
m<x&&(x=m);var q=h+1;x-c>e((2147483647-d)/q)&&n("overflow");d+=(x-c)*q;c=x;for(k=0;k<a;++k)if(m=g[k],m<c&&2147483647<++d&&n("overflow"),m==c){var r=d;for(x=36;;x+=36){m=x<=l?1:x>=l+26?26:x-l;if(r<m)break;var A=r-m;r=36-m;p.push(t(z(m+A%r,0)));r=e(A/r)}p.push(t(z(r,0)));l=u(d,q,h==f);d=0;++h}++d;++c}return p.join("")}var D="object"==typeof exports&&exports&&!exports.nodeType&&exports,A="object"==typeof module&&module&&!module.nodeType&&module,B="object"==typeof global&&global;if(B.global===B||B.window===
B||B.self===B)f=B;var E=/^xn--/,r=/[^\x20-\x7E]/,C=/[\x2E\u3002\uFF0E\uFF61]/g,w={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},e=Math.floor,t=String.fromCharCode,y;var v={version:"1.3.2",ucs2:{decode:b,encode:q},decode:g,encode:p,toASCII:function(b){return k(b,function(b){return r.test(b)?"xn--"+p(b):b})},toUnicode:function(b){return k(b,function(b){return E.test(b)?g(b.slice(4).toLowerCase()):
b})}};if("function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return v});else if(D&&A)if(module.exports==D)A.exports=v;else for(y in v)v.hasOwnProperty(y)&&(D[y]=v[y]);else f.punycode=v})(this);
(function(f,n){"object"===typeof module&&module.exports?module.exports=n():"function"===typeof define&&define.amd?define(n):f.SecondLevelDomains=n(f)})(this,function(f){var n=f&&f.SecondLevelDomains,h={list:{ac:" com gov mil net org ",ae:" ac co gov mil name net org pro sch ",af:" com edu gov net org ",al:" com edu gov mil net org ",ao:" co ed gv it og pb ",ar:" com edu gob gov int mil net org tur ",at:" ac co gv or ",au:" asn com csiro edu gov id net org ",ba:" co com edu gov mil net org rs unbi unmo unsa untz unze ",
bb:" biz co com edu gov info net org store tv ",bh:" biz cc com edu gov info net org ",bn:" com edu gov net org ",bo:" com edu gob gov int mil net org tv ",br:" adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",bs:" com edu gov net org ",bz:" du et om ov rg ",ca:" ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
ck:" biz co edu gen gov info net org ",cn:" ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",co:" com edu gov mil net nom org ",cr:" ac c co ed fi go or sa ",cy:" ac biz com ekloges gov ltd name net org parliament press pro tm ","do":" art com edu gob gov mil net org sld web ",dz:" art asso com edu gov net org pol ",ec:" com edu fin gov info med mil net org pro ",eg:" com edu eun gov mil name net org sci ",er:" com edu gov ind mil net org rochest w ",
es:" com edu gob nom org ",et:" biz com edu gov info name net org ",fj:" ac biz com info mil name net org pro ",fk:" ac co gov net nom org ",fr:" asso com f gouv nom prd presse tm ",gg:" co net org ",gh:" com edu gov mil org ",gn:" ac com gov net org ",gr:" com edu gov mil net org ",gt:" com edu gob ind mil net org ",gu:" com edu gov net org ",hk:" com edu gov idv net org ",hu:" 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
id:" ac co go mil net or sch web ",il:" ac co gov idf k12 muni net org ","in":" ac co edu ernet firm gen gov i ind mil net nic org res ",iq:" com edu gov i mil net org ",ir:" ac co dnssec gov i id net org sch ",it:" edu gov ",je:" co net org ",jo:" com edu gov mil name net org sch ",jp:" ac ad co ed go gr lg ne or ",ke:" ac co go info me mobi ne or sc ",kh:" com edu gov mil net org per ",ki:" biz com de edu gov info mob net org tel ",km:" asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
kn:" edu gov net org ",kr:" ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",kw:" com edu gov net org ",ky:" com edu gov net org ",kz:" com edu gov mil net org ",lb:" com edu gov net org ",lk:" assn com edu gov grp hotel int ltd net ngo org sch soc web ",lr:" com edu gov net org ",lv:" asn com conf edu gov id mil net org ",ly:" com edu gov id med net org plc sch ",ma:" ac co gov m net org press ",
mc:" asso tm ",me:" ac co edu gov its net org priv ",mg:" com edu gov mil nom org prd tm ",mk:" com edu gov inf name net org pro ",ml:" com edu gov net org presse ",mn:" edu gov org ",mo:" com edu gov net org ",mt:" com edu gov net org ",mv:" aero biz com coop edu gov info int mil museum name net org pro ",mw:" ac co com coop edu gov int museum net org ",mx:" com edu gob net org ",my:" com edu gov mil name net org sch ",nf:" arts com firm info net other per rec store web ",ng:" biz com edu gov mil mobi name net org sch ",
ni:" ac co com edu gob mil net nom org ",np:" com edu gov mil net org ",nr:" biz com edu gov info net org ",om:" ac biz co com edu gov med mil museum net org pro sch ",pe:" com edu gob mil net nom org sld ",ph:" com edu gov i mil net ngo org ",pk:" biz com edu fam gob gok gon gop gos gov net org web ",pl:" art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",pr:" ac biz com edu est gov info isla name net org pro prof ",
ps:" com edu gov net org plo sec ",pw:" belau co ed go ne or ",ro:" arts com firm info nom nt org rec store tm www ",rs:" ac co edu gov in org ",sb:" com edu gov net org ",sc:" com edu gov net org ",sh:" co com edu gov net nom org ",sl:" com edu gov net org ",st:" co com consulado edu embaixada gov mil net org principe saotome store ",sv:" com edu gob org red ",sz:" ac co org ",tr:" av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",tt:" aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
tw:" club com ebiz edu game gov idv mil net org ",mu:" ac co com gov net or org ",mz:" ac co edu gov org ",na:" co com ",nz:" ac co cri geek gen govt health iwi maori mil net org parliament school ",pa:" abo ac com edu gob ing med net nom org sld ",pt:" com edu gov int net nome org publ ",py:" com edu gov mil net org ",qa:" com edu gov mil net org ",re:" asso com nom ",ru:" ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
rw:" ac co com edu gouv gov int mil net ",sa:" com edu gov med net org pub sch ",sd:" com edu gov info med net org tv ",se:" a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",sg:" com edu gov idn net org per ",sn:" art com edu gouv org perso univ ",sy:" com edu gov mil net news org ",th:" ac co go in mi net or ",tj:" ac biz co com edu go gov info int mil name net nic org test web ",tn:" agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
tz:" ac co go ne or ",ua:" biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",ug:" ac co go ne or org sc ",uk:" ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
us:" dni fed isa kids nsn ",uy:" com edu gub mil net org ",ve:" co com edu gob info mil net org web ",vi:" co com k12 net org ",vn:" ac biz com edu gov health info int name net org pro ",ye:" co com gov ltd me net org plc ",yu:" ac co edu gov org ",za:" ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",zm:" ac co com edu gov net org sch ",com:"ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ",net:"gb jp se uk ",
org:"ae",de:"com "},has:function(f){var b=f.lastIndexOf(".");if(0>=b||b>=f.length-1)return!1;var k=f.lastIndexOf(".",b-1);if(0>=k||k>=b-1)return!1;var n=h.list[f.slice(b+1)];return n?0<=n.indexOf(" "+f.slice(k+1,b)+" "):!1},is:function(f){var b=f.lastIndexOf(".");if(0>=b||b>=f.length-1||0<=f.lastIndexOf(".",b-1))return!1;var k=h.list[f.slice(b+1)];return k?0<=k.indexOf(" "+f.slice(0,b)+" "):!1},get:function(f){var b=f.lastIndexOf(".");if(0>=b||b>=f.length-1)return null;var k=f.lastIndexOf(".",b-1);
if(0>=k||k>=b-1)return null;var n=h.list[f.slice(b+1)];return!n||0>n.indexOf(" "+f.slice(k+1,b)+" ")?null:f.slice(k+1)},noConflict:function(){f.SecondLevelDomains===this&&(f.SecondLevelDomains=n);return this}};return h});
(function(f,n){"object"===typeof module&&module.exports?module.exports=n(require("./punycode"),require("./IPv6"),require("./SecondLevelDomains")):"function"===typeof define&&define.amd?define(["./punycode","./IPv6","./SecondLevelDomains"],n):f.URI=n(f.punycode,f.IPv6,f.SecondLevelDomains,f)})(this,function(f,n,h,k){function b(a,c){var d=1<=arguments.length,l=2<=arguments.length;if(!(this instanceof b))return d?l?new b(a,c):new b(a):new b;if(void 0===a){if(d)throw new TypeError("undefined is not a valid argument for URI");
a="undefined"!==typeof location?location.href+"":""}if(null===a&&d)throw new TypeError("null is not a valid argument for URI");this.href(a);return void 0!==c?this.absoluteTo(c):this}function q(a){return a.replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")}function z(a){return void 0===a?"Undefined":String(Object.prototype.toString.call(a)).slice(8,-1)}function u(a){return"Array"===z(a)}function g(a,c){var d={},b;if("RegExp"===z(c))d=null;else if(u(c)){var m=0;for(b=c.length;m<b;m++)d[c[m]]=!0}else d[c]=
!0;m=0;for(b=a.length;m<b;m++)if(d&&void 0!==d[a[m]]||!d&&c.test(a[m]))a.splice(m,1),b--,m--;return a}function p(a,c){var d;if(u(c)){var b=0;for(d=c.length;b<d;b++)if(!p(a,c[b]))return!1;return!0}var m=z(c);b=0;for(d=a.length;b<d;b++)if("RegExp"===m){if("string"===typeof a[b]&&a[b].match(c))return!0}else if(a[b]===c)return!0;return!1}function D(a,c){if(!u(a)||!u(c)||a.length!==c.length)return!1;a.sort();c.sort();for(var d=0,b=a.length;d<b;d++)if(a[d]!==c[d])return!1;return!0}function A(a){return a.replace(/^\/+|\/+$/g,
"")}function B(a){return escape(a)}function E(a){return encodeURIComponent(a).replace(/[!'()*]/g,B).replace(/\*/g,"%2A")}function r(a){return function(c,d){if(void 0===c)return this._parts[a]||"";this._parts[a]=c||null;this.build(!d);return this}}function C(a,c){return function(d,b){if(void 0===d)return this._parts[a]||"";null!==d&&(d+="",d.charAt(0)===c&&(d=d.substring(1)));this._parts[a]=d;this.build(!b);return this}}var w=k&&k.URI;b.version="1.19.0";var e=b.prototype,t=Object.prototype.hasOwnProperty;
b._parts=function(){return{protocol:null,username:null,password:null,hostname:null,urn:null,port:null,path:null,query:null,fragment:null,preventInvalidHostname:b.preventInvalidHostname,duplicateQueryParameters:b.duplicateQueryParameters,escapeQuerySpace:b.escapeQuerySpace}};b.preventInvalidHostname=!1;b.duplicateQueryParameters=!1;b.escapeQuerySpace=!0;b.protocol_expression=/^[a-z][a-z0-9.+-]*$/i;b.idn_expression=/[^a-z0-9\._-]/i;b.punycode_expression=/(xn--)/i;b.ip4_expression=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
b.ip6_expression=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
b.find_uri_expression=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/ig;b.findUri={start:/\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,end:/[\s\r\n]|$/,trim:/[`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]+$/,parens:/(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g};b.defaultPorts={http:"80",https:"443",ftp:"21",
gopher:"70",ws:"80",wss:"443"};b.hostProtocols=["http","https"];b.invalid_hostname_characters=/[^a-zA-Z0-9\.\-:_]/;b.domAttributes={a:"href",blockquote:"cite",link:"href",base:"href",script:"src",form:"action",img:"src",area:"href",iframe:"src",embed:"src",source:"src",track:"src",input:"src",audio:"src",video:"src"};b.getDomAttribute=function(a){if(a&&a.nodeName){var c=a.nodeName.toLowerCase();if("input"!==c||"image"===a.type)return b.domAttributes[c]}};b.encode=E;b.decode=decodeURIComponent;b.iso8859=
function(){b.encode=escape;b.decode=unescape};b.unicode=function(){b.encode=E;b.decode=decodeURIComponent};b.characters={pathname:{encode:{expression:/%(24|26|2B|2C|3B|3D|3A|40)/ig,map:{"%24":"$","%26":"&","%2B":"+","%2C":",","%3B":";","%3D":"=","%3A":":","%40":"@"}},decode:{expression:/[\/\?#]/g,map:{"/":"%2F","?":"%3F","#":"%23"}}},reserved:{encode:{expression:/%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,map:{"%3A":":","%2F":"/","%3F":"?","%23":"#","%5B":"[","%5D":"]","%40":"@",
"%21":"!","%24":"$","%26":"&","%27":"'","%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"="}}},urnpath:{encode:{expression:/%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,map:{"%21":"!","%24":"$","%27":"'","%28":"(","%29":")","%2A":"*","%2B":"+","%2C":",","%3B":";","%3D":"=","%40":"@"}},decode:{expression:/[\/\?#:]/g,map:{"/":"%2F","?":"%3F","#":"%23",":":"%3A"}}}};b.encodeQuery=function(a,c){var d=b.encode(a+"");void 0===c&&(c=b.escapeQuerySpace);return c?d.replace(/%20/g,"+"):d};b.decodeQuery=
function(a,c){a+="";void 0===c&&(c=b.escapeQuerySpace);try{return b.decode(c?a.replace(/\+/g,"%20"):a)}catch(d){return a}};var y={encode:"encode",decode:"decode"},v,F=function(a,c){return function(d){try{return b[c](d+"").replace(b.characters[a][c].expression,function(d){return b.characters[a][c].map[d]})}catch(l){return d}}};for(v in y)b[v+"PathSegment"]=F("pathname",y[v]),b[v+"UrnPathSegment"]=F("urnpath",y[v]);y=function(a,c,d){return function(l){var m=d?function(a){return b[c](b[d](a))}:b[c];
l=(l+"").split(a);for(var e=0,g=l.length;e<g;e++)l[e]=m(l[e]);return l.join(a)}};b.decodePath=y("/","decodePathSegment");b.decodeUrnPath=y(":","decodeUrnPathSegment");b.recodePath=y("/","encodePathSegment","decode");b.recodeUrnPath=y(":","encodeUrnPathSegment","decode");b.encodeReserved=F("reserved","encode");b.parse=function(a,c){c||(c={preventInvalidHostname:b.preventInvalidHostname});var d=a.indexOf("#");-1<d&&(c.fragment=a.substring(d+1)||null,a=a.substring(0,d));d=a.indexOf("?");-1<d&&(c.query=
a.substring(d+1)||null,a=a.substring(0,d));"//"===a.substring(0,2)?(c.protocol=null,a=a.substring(2),a=b.parseAuthority(a,c)):(d=a.indexOf(":"),-1<d&&(c.protocol=a.substring(0,d)||null,c.protocol&&!c.protocol.match(b.protocol_expression)?c.protocol=void 0:"//"===a.substring(d+1,d+3)?(a=a.substring(d+3),a=b.parseAuthority(a,c)):(a=a.substring(d+1),c.urn=!0)));c.path=a;return c};b.parseHost=function(a,c){a||(a="");a=a.replace(/\\/g,"/");var d=a.indexOf("/");-1===d&&(d=a.length);if("["===a.charAt(0)){var l=
a.indexOf("]");c.hostname=a.substring(1,l)||null;c.port=a.substring(l+2,d)||null;"/"===c.port&&(c.port=null)}else{var m=a.indexOf(":");l=a.indexOf("/");m=a.indexOf(":",m+1);-1!==m&&(-1===l||m<l)?(c.hostname=a.substring(0,d)||null,c.port=null):(l=a.substring(0,d).split(":"),c.hostname=l[0]||null,c.port=l[1]||null)}c.hostname&&"/"!==a.substring(d).charAt(0)&&(d++,a="/"+a);c.preventInvalidHostname&&b.ensureValidHostname(c.hostname,c.protocol);c.port&&b.ensureValidPort(c.port);return a.substring(d)||
"/"};b.parseAuthority=function(a,c){a=b.parseUserinfo(a,c);return b.parseHost(a,c)};b.parseUserinfo=function(a,c){var d=a.indexOf("/"),l=a.lastIndexOf("@",-1<d?d:a.length-1);-1<l&&(-1===d||l<d)?(d=a.substring(0,l).split(":"),c.username=d[0]?b.decode(d[0]):null,d.shift(),c.password=d[0]?b.decode(d.join(":")):null,a=a.substring(l+1)):(c.username=null,c.password=null);return a};b.parseQuery=function(a,c){if(!a)return{};a=a.replace(/&+/g,"&").replace(/^\?*&*|&+$/g,"");if(!a)return{};for(var d={},l=a.split("&"),
m=l.length,e,g,f=0;f<m;f++)if(e=l[f].split("="),g=b.decodeQuery(e.shift(),c),e=e.length?b.decodeQuery(e.join("="),c):null,t.call(d,g)){if("string"===typeof d[g]||null===d[g])d[g]=[d[g]];d[g].push(e)}else d[g]=e;return d};b.build=function(a){var c="";a.protocol&&(c+=a.protocol+":");a.urn||!c&&!a.hostname||(c+="//");c+=b.buildAuthority(a)||"";"string"===typeof a.path&&("/"!==a.path.charAt(0)&&"string"===typeof a.hostname&&(c+="/"),c+=a.path);"string"===typeof a.query&&a.query&&(c+="?"+a.query);"string"===
typeof a.fragment&&a.fragment&&(c+="#"+a.fragment);return c};b.buildHost=function(a){var c="";if(a.hostname)c=b.ip6_expression.test(a.hostname)?c+("["+a.hostname+"]"):c+a.hostname;else return"";a.port&&(c+=":"+a.port);return c};b.buildAuthority=function(a){return b.buildUserinfo(a)+b.buildHost(a)};b.buildUserinfo=function(a){var c="";a.username&&(c+=b.encode(a.username));a.password&&(c+=":"+b.encode(a.password));c&&(c+="@");return c};b.buildQuery=function(a,c,d){var l="",m,e;for(m in a)if(t.call(a,
m)&&m)if(u(a[m])){var g={};var f=0;for(e=a[m].length;f<e;f++)void 0!==a[m][f]&&void 0===g[a[m][f]+""]&&(l+="&"+b.buildQueryParameter(m,a[m][f],d),!0!==c&&(g[a[m][f]+""]=!0))}else void 0!==a[m]&&(l+="&"+b.buildQueryParameter(m,a[m],d));return l.substring(1)};b.buildQueryParameter=function(a,c,d){return b.encodeQuery(a,d)+(null!==c?"="+b.encodeQuery(c,d):"")};b.addQuery=function(a,c,d){if("object"===typeof c)for(var l in c)t.call(c,l)&&b.addQuery(a,l,c[l]);else if("string"===typeof c)void 0===a[c]?
a[c]=d:("string"===typeof a[c]&&(a[c]=[a[c]]),u(d)||(d=[d]),a[c]=(a[c]||[]).concat(d));else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");};b.setQuery=function(a,c,d){if("object"===typeof c)for(var l in c)t.call(c,l)&&b.setQuery(a,l,c[l]);else if("string"===typeof c)a[c]=void 0===d?null:d;else throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");};b.removeQuery=function(a,c,d){var l;if(u(c))for(d=0,l=c.length;d<l;d++)a[c[d]]=
void 0;else if("RegExp"===z(c))for(l in a)c.test(l)&&(a[l]=void 0);else if("object"===typeof c)for(l in c)t.call(c,l)&&b.removeQuery(a,l,c[l]);else if("string"===typeof c)void 0!==d?"RegExp"===z(d)?!u(a[c])&&d.test(a[c])?a[c]=void 0:a[c]=g(a[c],d):a[c]!==String(d)||u(d)&&1!==d.length?u(a[c])&&(a[c]=g(a[c],d)):a[c]=void 0:a[c]=void 0;else throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");};b.hasQuery=function(a,c,d,l){switch(z(c)){case "String":break;
case "RegExp":for(var m in a)if(t.call(a,m)&&c.test(m)&&(void 0===d||b.hasQuery(a,m,d)))return!0;return!1;case "Object":for(var e in c)if(t.call(c,e)&&!b.hasQuery(a,e,c[e]))return!1;return!0;default:throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");}switch(z(d)){case "Undefined":return c in a;case "Boolean":return a=!(u(a[c])?!a[c].length:!a[c]),d===a;case "Function":return!!d(a[c],c,a);case "Array":return u(a[c])?(l?p:D)(a[c],d):!1;case "RegExp":return u(a[c])?
l?p(a[c],d):!1:!(!a[c]||!a[c].match(d));case "Number":d=String(d);case "String":return u(a[c])?l?p(a[c],d):!1:a[c]===d;default:throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");}};b.joinPaths=function(){for(var a=[],c=[],d=0,l=0;l<arguments.length;l++){var m=new b(arguments[l]);a.push(m);m=m.segment();for(var e=0;e<m.length;e++)"string"===typeof m[e]&&c.push(m[e]),m[e]&&d++}if(!c.length||!d)return new b("");c=(new b("")).segment(c);
""!==a[0].path()&&"/"!==a[0].path().slice(0,1)||c.path("/"+c.path());return c.normalize()};b.commonPath=function(a,c){var d=Math.min(a.length,c.length),b;for(b=0;b<d;b++)if(a.charAt(b)!==c.charAt(b)){b--;break}if(1>b)return a.charAt(0)===c.charAt(0)&&"/"===a.charAt(0)?"/":"";if("/"!==a.charAt(b)||"/"!==c.charAt(b))b=a.substring(0,b).lastIndexOf("/");return a.substring(0,b+1)};b.withinString=function(a,c,d){d||(d={});var l=d.start||b.findUri.start,m=d.end||b.findUri.end,e=d.trim||b.findUri.trim,g=
d.parens||b.findUri.parens,f=/[a-z0-9-]=["']?$/i;for(l.lastIndex=0;;){var h=l.exec(a);if(!h)break;var k=h.index;if(d.ignoreHtml){var p=a.slice(Math.max(k-3,0),k);if(p&&f.test(p))continue}var n=k+a.slice(k).search(m);p=a.slice(k,n);for(n=-1;;){var r=g.exec(p);if(!r)break;n=Math.max(n,r.index+r[0].length)}p=-1<n?p.slice(0,n)+p.slice(n).replace(e,""):p.replace(e,"");p.length<=h[0].length||d.ignore&&d.ignore.test(p)||(n=k+p.length,h=c(p,k,n,a),void 0===h?l.lastIndex=n:(h=String(h),a=a.slice(0,k)+h+a.slice(n),
l.lastIndex=k+h.length))}l.lastIndex=0;return a};b.ensureValidHostname=function(a,c){var d=!!a,l=!1;c&&(l=p(b.hostProtocols,c));if(l&&!d)throw new TypeError("Hostname cannot be empty, if protocol is "+c);if(a&&a.match(b.invalid_hostname_characters)){if(!f)throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');if(f.toASCII(a).match(b.invalid_hostname_characters))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-:_]');
}};b.ensureValidPort=function(a){if(a){var c=Number(a);if(!(/^[0-9]+$/.test(c)&&0<c&&65536>c))throw new TypeError('Port "'+a+'" is not a valid port');}};b.noConflict=function(a){if(a)return a={URI:this.noConflict()},k.URITemplate&&"function"===typeof k.URITemplate.noConflict&&(a.URITemplate=k.URITemplate.noConflict()),k.IPv6&&"function"===typeof k.IPv6.noConflict&&(a.IPv6=k.IPv6.noConflict()),k.SecondLevelDomains&&"function"===typeof k.SecondLevelDomains.noConflict&&(a.SecondLevelDomains=k.SecondLevelDomains.noConflict()),
a;k.URI===this&&(k.URI=w);return this};e.build=function(a){if(!0===a)this._deferred_build=!0;else if(void 0===a||this._deferred_build)this._string=b.build(this._parts),this._deferred_build=!1;return this};e.clone=function(){return new b(this)};e.valueOf=e.toString=function(){return this.build(!1)._string};e.protocol=r("protocol");e.username=r("username");e.password=r("password");e.hostname=r("hostname");e.port=r("port");e.query=C("query","?");e.fragment=C("fragment","#");e.search=function(a,c){var b=
this.query(a,c);return"string"===typeof b&&b.length?"?"+b:b};e.hash=function(a,c){var b=this.fragment(a,c);return"string"===typeof b&&b.length?"#"+b:b};e.pathname=function(a,c){if(void 0===a||!0===a){var d=this._parts.path||(this._parts.hostname?"/":"");return a?(this._parts.urn?b.decodeUrnPath:b.decodePath)(d):d}this._parts.path=this._parts.urn?a?b.recodeUrnPath(a):"":a?b.recodePath(a):"/";this.build(!c);return this};e.path=e.pathname;e.href=function(a,c){var d;if(void 0===a)return this.toString();
this._string="";this._parts=b._parts();var l=a instanceof b,e="object"===typeof a&&(a.hostname||a.path||a.pathname);a.nodeName&&(e=b.getDomAttribute(a),a=a[e]||"",e=!1);!l&&e&&void 0!==a.pathname&&(a=a.toString());if("string"===typeof a||a instanceof String)this._parts=b.parse(String(a),this._parts);else if(l||e)for(d in l=l?a._parts:a,l)t.call(this._parts,d)&&(this._parts[d]=l[d]);else throw new TypeError("invalid input");this.build(!c);return this};e.is=function(a){var c=!1,d=!1,e=!1,m=!1,g=!1,
f=!1,k=!1,p=!this._parts.urn;this._parts.hostname&&(p=!1,d=b.ip4_expression.test(this._parts.hostname),e=b.ip6_expression.test(this._parts.hostname),c=d||e,g=(m=!c)&&h&&h.has(this._parts.hostname),f=m&&b.idn_expression.test(this._parts.hostname),k=m&&b.punycode_expression.test(this._parts.hostname));switch(a.toLowerCase()){case "relative":return p;case "absolute":return!p;case "domain":case "name":return m;case "sld":return g;case "ip":return c;case "ip4":case "ipv4":case "inet4":return d;case "ip6":case "ipv6":case "inet6":return e;
case "idn":return f;case "url":return!this._parts.urn;case "urn":return!!this._parts.urn;case "punycode":return k}return null};var G=e.protocol,H=e.port,I=e.hostname;e.protocol=function(a,c){if(a&&(a=a.replace(/:(\/\/)?$/,""),!a.match(b.protocol_expression)))throw new TypeError('Protocol "'+a+"\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");return G.call(this,a,c)};e.scheme=e.protocol;e.port=function(a,c){if(this._parts.urn)return void 0===a?"":this;void 0!==a&&(0===a&&
(a=null),a&&(a+="",":"===a.charAt(0)&&(a=a.substring(1)),b.ensureValidPort(a)));return H.call(this,a,c)};e.hostname=function(a,c){if(this._parts.urn)return void 0===a?"":this;if(void 0!==a){var d={preventInvalidHostname:this._parts.preventInvalidHostname};if("/"!==b.parseHost(a,d))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-]');a=d.hostname;this._parts.preventInvalidHostname&&b.ensureValidHostname(a,this._parts.protocol)}return I.call(this,a,c)};e.origin=function(a,
c){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){var d=this.protocol();return this.authority()?(d?d+"://":"")+this.authority():""}d=b(a);this.protocol(d.protocol()).authority(d.authority()).build(!c);return this};e.host=function(a,c){if(this._parts.urn)return void 0===a?"":this;if(void 0===a)return this._parts.hostname?b.buildHost(this._parts):"";if("/"!==b.parseHost(a,this._parts))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-]');this.build(!c);return this};
e.authority=function(a,c){if(this._parts.urn)return void 0===a?"":this;if(void 0===a)return this._parts.hostname?b.buildAuthority(this._parts):"";if("/"!==b.parseAuthority(a,this._parts))throw new TypeError('Hostname "'+a+'" contains characters other than [A-Z0-9.-]');this.build(!c);return this};e.userinfo=function(a,c){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){var d=b.buildUserinfo(this._parts);return d?d.substring(0,d.length-1):d}"@"!==a[a.length-1]&&(a+="@");b.parseUserinfo(a,
this._parts);this.build(!c);return this};e.resource=function(a,c){if(void 0===a)return this.path()+this.search()+this.hash();var d=b.parse(a);this._parts.path=d.path;this._parts.query=d.query;this._parts.fragment=d.fragment;this.build(!c);return this};e.subdomain=function(a,c){if(this._parts.urn)return void 0===a?"":this;if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var d=this._parts.hostname.length-this.domain().length-1;return this._parts.hostname.substring(0,d)||""}d=this._parts.hostname.length-
this.domain().length;d=this._parts.hostname.substring(0,d);d=new RegExp("^"+q(d));a&&"."!==a.charAt(a.length-1)&&(a+=".");if(-1!==a.indexOf(":"))throw new TypeError("Domains cannot contain colons");a&&b.ensureValidHostname(a,this._parts.protocol);this._parts.hostname=this._parts.hostname.replace(d,a);this.build(!c);return this};e.domain=function(a,c){if(this._parts.urn)return void 0===a?"":this;"boolean"===typeof a&&(c=a,a=void 0);if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var d=
this._parts.hostname.match(/\./g);if(d&&2>d.length)return this._parts.hostname;d=this._parts.hostname.length-this.tld(c).length-1;d=this._parts.hostname.lastIndexOf(".",d-1)+1;return this._parts.hostname.substring(d)||""}if(!a)throw new TypeError("cannot set domain empty");if(-1!==a.indexOf(":"))throw new TypeError("Domains cannot contain colons");b.ensureValidHostname(a,this._parts.protocol);!this._parts.hostname||this.is("IP")?this._parts.hostname=a:(d=new RegExp(q(this.domain())+"$"),this._parts.hostname=
this._parts.hostname.replace(d,a));this.build(!c);return this};e.tld=function(a,c){if(this._parts.urn)return void 0===a?"":this;"boolean"===typeof a&&(c=a,a=void 0);if(void 0===a){if(!this._parts.hostname||this.is("IP"))return"";var b=this._parts.hostname.lastIndexOf(".");b=this._parts.hostname.substring(b+1);return!0!==c&&h&&h.list[b.toLowerCase()]?h.get(this._parts.hostname)||b:b}if(a)if(a.match(/[^a-zA-Z0-9-]/))if(h&&h.is(a))b=new RegExp(q(this.tld())+"$"),this._parts.hostname=this._parts.hostname.replace(b,
a);else throw new TypeError('TLD "'+a+'" contains characters other than [A-Z0-9]');else{if(!this._parts.hostname||this.is("IP"))throw new ReferenceError("cannot set TLD on non-domain host");b=new RegExp(q(this.tld())+"$");this._parts.hostname=this._parts.hostname.replace(b,a)}else throw new TypeError("cannot set TLD empty");this.build(!c);return this};e.directory=function(a,c){if(this._parts.urn)return void 0===a?"":this;if(void 0===a||!0===a){if(!this._parts.path&&!this._parts.hostname)return"";
if("/"===this._parts.path)return"/";var d=this._parts.path.length-this.filename().length-1;d=this._parts.path.substring(0,d)||(this._parts.hostname?"/":"");return a?b.decodePath(d):d}d=this._parts.path.length-this.filename().length;d=this._parts.path.substring(0,d);d=new RegExp("^"+q(d));this.is("relative")||(a||(a="/"),"/"!==a.charAt(0)&&(a="/"+a));a&&"/"!==a.charAt(a.length-1)&&(a+="/");a=b.recodePath(a);this._parts.path=this._parts.path.replace(d,a);this.build(!c);return this};e.filename=function(a,
c){if(this._parts.urn)return void 0===a?"":this;if("string"!==typeof a){if(!this._parts.path||"/"===this._parts.path)return"";var d=this._parts.path.lastIndexOf("/");d=this._parts.path.substring(d+1);return a?b.decodePathSegment(d):d}d=!1;"/"===a.charAt(0)&&(a=a.substring(1));a.match(/\.?\//)&&(d=!0);var e=new RegExp(q(this.filename())+"$");a=b.recodePath(a);this._parts.path=this._parts.path.replace(e,a);d?this.normalizePath(c):this.build(!c);return this};e.suffix=function(a,c){if(this._parts.urn)return void 0===
a?"":this;if(void 0===a||!0===a){if(!this._parts.path||"/"===this._parts.path)return"";var d=this.filename(),e=d.lastIndexOf(".");if(-1===e)return"";d=d.substring(e+1);d=/^[a-z0-9%]+$/i.test(d)?d:"";return a?b.decodePathSegment(d):d}"."===a.charAt(0)&&(a=a.substring(1));if(d=this.suffix())e=a?new RegExp(q(d)+"$"):new RegExp(q("."+d)+"$");else{if(!a)return this;this._parts.path+="."+b.recodePath(a)}e&&(a=b.recodePath(a),this._parts.path=this._parts.path.replace(e,a));this.build(!c);return this};e.segment=
function(a,c,b){var d=this._parts.urn?":":"/",e=this.path(),g="/"===e.substring(0,1);e=e.split(d);void 0!==a&&"number"!==typeof a&&(b=c,c=a,a=void 0);if(void 0!==a&&"number"!==typeof a)throw Error('Bad segment "'+a+'", must be 0-based integer');g&&e.shift();0>a&&(a=Math.max(e.length+a,0));if(void 0===c)return void 0===a?e:e[a];if(null===a||void 0===e[a])if(u(c)){e=[];a=0;for(var f=c.length;a<f;a++)if(c[a].length||e.length&&e[e.length-1].length)e.length&&!e[e.length-1].length&&e.pop(),e.push(A(c[a]))}else{if(c||
"string"===typeof c)c=A(c),""===e[e.length-1]?e[e.length-1]=c:e.push(c)}else c?e[a]=A(c):e.splice(a,1);g&&e.unshift("");return this.path(e.join(d),b)};e.segmentCoded=function(a,c,d){var e;"number"!==typeof a&&(d=c,c=a,a=void 0);if(void 0===c){a=this.segment(a,c,d);if(u(a)){var g=0;for(e=a.length;g<e;g++)a[g]=b.decode(a[g])}else a=void 0!==a?b.decode(a):void 0;return a}if(u(c))for(g=0,e=c.length;g<e;g++)c[g]=b.encode(c[g]);else c="string"===typeof c||c instanceof String?b.encode(c):c;return this.segment(a,
c,d)};var J=e.query;e.query=function(a,c){if(!0===a)return b.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("function"===typeof a){var d=b.parseQuery(this._parts.query,this._parts.escapeQuerySpace),e=a.call(this,d);this._parts.query=b.buildQuery(e||d,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);this.build(!c);return this}return void 0!==a&&"string"!==typeof a?(this._parts.query=b.buildQuery(a,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace),this.build(!c),
this):J.call(this,a,c)};e.setQuery=function(a,c,d){var e=b.parseQuery(this._parts.query,this._parts.escapeQuerySpace);if("string"===typeof a||a instanceof String)e[a]=void 0!==c?c:null;else if("object"===typeof a)for(var g in a)t.call(a,g)&&(e[g]=a[g]);else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");this._parts.query=b.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(d=c);this.build(!d);return this};e.addQuery=
function(a,c,d){var e=b.parseQuery(this._parts.query,this._parts.escapeQuerySpace);b.addQuery(e,a,void 0===c?null:c);this._parts.query=b.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==typeof a&&(d=c);this.build(!d);return this};e.removeQuery=function(a,c,d){var e=b.parseQuery(this._parts.query,this._parts.escapeQuerySpace);b.removeQuery(e,a,c);this._parts.query=b.buildQuery(e,this._parts.duplicateQueryParameters,this._parts.escapeQuerySpace);"string"!==
typeof a&&(d=c);this.build(!d);return this};e.hasQuery=function(a,c,d){var e=b.parseQuery(this._parts.query,this._parts.escapeQuerySpace);return b.hasQuery(e,a,c,d)};e.setSearch=e.setQuery;e.addSearch=e.addQuery;e.removeSearch=e.removeQuery;e.hasSearch=e.hasQuery;e.normalize=function(){return this._parts.urn?this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build():this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()};
e.normalizeProtocol=function(a){"string"===typeof this._parts.protocol&&(this._parts.protocol=this._parts.protocol.toLowerCase(),this.build(!a));return this};e.normalizeHostname=function(a){this._parts.hostname&&(this.is("IDN")&&f?this._parts.hostname=f.toASCII(this._parts.hostname):this.is("IPv6")&&n&&(this._parts.hostname=n.best(this._parts.hostname)),this._parts.hostname=this._parts.hostname.toLowerCase(),this.build(!a));return this};e.normalizePort=function(a){"string"===typeof this._parts.protocol&&
this._parts.port===b.defaultPorts[this._parts.protocol]&&(this._parts.port=null,this.build(!a));return this};e.normalizePath=function(a){var c=this._parts.path;if(!c)return this;if(this._parts.urn)return this._parts.path=b.recodeUrnPath(this._parts.path),this.build(!a),this;if("/"===this._parts.path)return this;c=b.recodePath(c);var d="";if("/"!==c.charAt(0)){var e=!0;c="/"+c}if("/.."===c.slice(-3)||"/."===c.slice(-2))c+="/";c=c.replace(/(\/(\.\/)+)|(\/\.$)/g,"/").replace(/\/{2,}/g,"/");e&&(d=c.substring(1).match(/^(\.\.\/)+/)||
"")&&(d=d[0]);for(;;){var g=c.search(/\/\.\.(\/|$)/);if(-1===g)break;else if(0===g){c=c.substring(3);continue}var f=c.substring(0,g).lastIndexOf("/");-1===f&&(f=g);c=c.substring(0,f)+c.substring(g+3)}e&&this.is("relative")&&(c=d+c.substring(1));this._parts.path=c;this.build(!a);return this};e.normalizePathname=e.normalizePath;e.normalizeQuery=function(a){"string"===typeof this._parts.query&&(this._parts.query.length?this.query(b.parseQuery(this._parts.query,this._parts.escapeQuerySpace)):this._parts.query=
null,this.build(!a));return this};e.normalizeFragment=function(a){this._parts.fragment||(this._parts.fragment=null,this.build(!a));return this};e.normalizeSearch=e.normalizeQuery;e.normalizeHash=e.normalizeFragment;e.iso8859=function(){var a=b.encode,c=b.decode;b.encode=escape;b.decode=decodeURIComponent;try{this.normalize()}finally{b.encode=a,b.decode=c}return this};e.unicode=function(){var a=b.encode,c=b.decode;b.encode=E;b.decode=unescape;try{this.normalize()}finally{b.encode=a,b.decode=c}return this};
e.readable=function(){var a=this.clone();a.username("").password("").normalize();var c="";a._parts.protocol&&(c+=a._parts.protocol+"://");a._parts.hostname&&(a.is("punycode")&&f?(c+=f.toUnicode(a._parts.hostname),a._parts.port&&(c+=":"+a._parts.port)):c+=a.host());a._parts.hostname&&a._parts.path&&"/"!==a._parts.path.charAt(0)&&(c+="/");c+=a.path(!0);if(a._parts.query){for(var d="",e=0,g=a._parts.query.split("&"),h=g.length;e<h;e++){var k=(g[e]||"").split("=");d+="&"+b.decodeQuery(k[0],this._parts.escapeQuerySpace).replace(/&/g,
"%26");void 0!==k[1]&&(d+="="+b.decodeQuery(k[1],this._parts.escapeQuerySpace).replace(/&/g,"%26"))}c+="?"+d.substring(1)}return c+=b.decodeQuery(a.hash(),!0)};e.absoluteTo=function(a){var c=this.clone(),d=["protocol","username","password","hostname","port"],e,g;if(this._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");a instanceof b||(a=new b(a));if(c._parts.protocol)return c;c._parts.protocol=a._parts.protocol;if(this._parts.hostname)return c;for(e=0;g=d[e];e++)c._parts[g]=
a._parts[g];c._parts.path?(".."===c._parts.path.substring(-2)&&(c._parts.path+="/"),"/"!==c.path().charAt(0)&&(d=(d=a.directory())?d:0===a.path().indexOf("/")?"/":"",c._parts.path=(d?d+"/":"")+c._parts.path,c.normalizePath())):(c._parts.path=a._parts.path,c._parts.query||(c._parts.query=a._parts.query));c.build();return c};e.relativeTo=function(a){var c=this.clone().normalize();if(c._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");a=(new b(a)).normalize();var d=
c._parts;var e=a._parts;var g=c.path();a=a.path();if("/"!==g.charAt(0))throw Error("URI is already relative");if("/"!==a.charAt(0))throw Error("Cannot calculate a URI relative to another relative URI");d.protocol===e.protocol&&(d.protocol=null);if(d.username===e.username&&d.password===e.password&&null===d.protocol&&null===d.username&&null===d.password&&d.hostname===e.hostname&&d.port===e.port)d.hostname=null,d.port=null;else return c.build();if(g===a)return d.path="",c.build();g=b.commonPath(g,a);
if(!g)return c.build();e=e.path.substring(g.length).replace(/[^\/]*$/,"").replace(/.*?\//g,"../");d.path=e+d.path.substring(g.length)||"./";return c.build()};e.equals=function(a){var c=this.clone(),d=new b(a);a={};var e;c.normalize();d.normalize();if(c.toString()===d.toString())return!0;var g=c.query();var f=d.query();c.query("");d.query("");if(c.toString()!==d.toString()||g.length!==f.length)return!1;c=b.parseQuery(g,this._parts.escapeQuerySpace);f=b.parseQuery(f,this._parts.escapeQuerySpace);for(e in c)if(t.call(c,
e)){if(!u(c[e])){if(c[e]!==f[e])return!1}else if(!D(c[e],f[e]))return!1;a[e]=!0}for(e in f)if(t.call(f,e)&&!a[e])return!1;return!0};e.preventInvalidHostname=function(a){this._parts.preventInvalidHostname=!!a;return this};e.duplicateQueryParameters=function(a){this._parts.duplicateQueryParameters=!!a;return this};e.escapeQuerySpace=function(a){this._parts.escapeQuerySpace=!!a;return this};return b});
(function(f,n){"object"===typeof module&&module.exports?module.exports=n(require("./URI")):"function"===typeof define&&define.amd?define(["./URI"],n):f.URITemplate=n(f.URI,f)})(this,function(f,n){function h(b){if(h._cache[b])return h._cache[b];if(!(this instanceof h))return new h(b);this.expression=b;h._cache[b]=this;return this}function k(b){this.data=b;this.cache={}}var b=n&&n.URITemplate,q=Object.prototype.hasOwnProperty,z=h.prototype,u={"":{prefix:"",separator:",",named:!1,empty_name_separator:!1,
encode:"encode"},"+":{prefix:"",separator:",",named:!1,empty_name_separator:!1,encode:"encodeReserved"},"#":{prefix:"#",separator:",",named:!1,empty_name_separator:!1,encode:"encodeReserved"},".":{prefix:".",separator:".",named:!1,empty_name_separator:!1,encode:"encode"},"/":{prefix:"/",separator:"/",named:!1,empty_name_separator:!1,encode:"encode"},";":{prefix:";",separator:";",named:!0,empty_name_separator:!1,encode:"encode"},"?":{prefix:"?",separator:"&",named:!0,empty_name_separator:!0,encode:"encode"},
"&":{prefix:"&",separator:"&",named:!0,empty_name_separator:!0,encode:"encode"}};h._cache={};h.EXPRESSION_PATTERN=/\{([^a-zA-Z0-9%_]?)([^\}]+)(\}|$)/g;h.VARIABLE_PATTERN=/^([^*:.](?:\.?[^*:.])*)((\*)|:(\d+))?$/;h.VARIABLE_NAME_PATTERN=/[^a-zA-Z0-9%_.]/;h.LITERAL_PATTERN=/[<>{}"`^| \\]/;h.expand=function(b,f,k){var g=u[b.operator],p=g.named?"Named":"Unnamed";b=b.variables;var n=[],r,q;for(q=0;r=b[q];q++){var w=f.get(r.name);if(0===w.type&&k&&k.strict)throw Error('Missing expansion value for variable "'+
r.name+'"');if(w.val.length){if(1<w.type&&r.maxlength)throw Error('Invalid expression: Prefix modifier not applicable to variable "'+r.name+'"');n.push(h["expand"+p](w,g,r.explode,r.explode&&g.separator||",",r.maxlength,r.name))}else w.type&&n.push("")}return n.length?g.prefix+n.join(g.separator):""};h.expandNamed=function(b,h,k,n,q,u){var g="",p=h.encode;h=h.empty_name_separator;var A=!b[p].length,e=2===b.type?"":f[p](u),t;var y=0;for(t=b.val.length;y<t;y++){if(q){var v=f[p](b.val[y][1].substring(0,
q));2===b.type&&(e=f[p](b.val[y][0].substring(0,q)))}else A?(v=f[p](b.val[y][1]),2===b.type?(e=f[p](b.val[y][0]),b[p].push([e,v])):b[p].push([void 0,v])):(v=b[p][y][1],2===b.type&&(e=b[p][y][0]));g&&(g+=n);k?g+=e+(h||v?"=":"")+v:(y||(g+=f[p](u)+(h||v?"=":"")),2===b.type&&(g+=e+","),g+=v)}return g};h.expandUnnamed=function(b,h,k,n,q){var g="",p=h.encode;h=h.empty_name_separator;var A=!b[p].length,w;var e=0;for(w=b.val.length;e<w;e++){if(q)var t=f[p](b.val[e][1].substring(0,q));else A?(t=f[p](b.val[e][1]),
b[p].push([2===b.type?f[p](b.val[e][0]):void 0,t])):t=b[p][e][1];g&&(g+=n);if(2===b.type){var u=q?f[p](b.val[e][0].substring(0,q)):b[p][e][0];g+=u;g=k?g+(h||t?"=":""):g+","}g+=t}return g};h.noConflict=function(){n.URITemplate===h&&(n.URITemplate=b);return h};z.expand=function(b,f){var g="";this.parts&&this.parts.length||this.parse();b instanceof k||(b=new k(b));for(var p=0,n=this.parts.length;p<n;p++)g+="string"===typeof this.parts[p]?this.parts[p]:h.expand(this.parts[p],b,f);return g};z.parse=function(){var b=
this.expression,f=h.EXPRESSION_PATTERN,k=h.VARIABLE_PATTERN,n=h.VARIABLE_NAME_PATTERN,q=h.LITERAL_PATTERN,z=[],r=0,C=function(b){if(b.match(q))throw Error('Invalid Literal "'+b+'"');return b};for(f.lastIndex=0;;){var w=f.exec(b);if(null===w){z.push(C(b.substring(r)));break}else z.push(C(b.substring(r,w.index))),r=w.index+w[0].length;if(!u[w[1]])throw Error('Unknown Operator "'+w[1]+'" in "'+w[0]+'"');if(!w[3])throw Error('Unclosed Expression "'+w[0]+'"');var e=w[2].split(",");for(var t=0,y=e.length;t<
y;t++){var v=e[t].match(k);if(null===v)throw Error('Invalid Variable "'+e[t]+'" in "'+w[0]+'"');if(v[1].match(n))throw Error('Invalid Variable Name "'+v[1]+'" in "'+w[0]+'"');e[t]={name:v[1],explode:!!v[3],maxlength:v[4]&&parseInt(v[4],10)}}if(!e.length)throw Error('Expression Missing Variable(s) "'+w[0]+'"');z.push({expression:w[0],operator:w[1],variables:e})}z.length||z.push(C(b));this.parts=z;return this};k.prototype.get=function(b){var f=this.data,g={type:0,val:[],encode:[],encodeReserved:[]};
if(void 0!==this.cache[b])return this.cache[b];this.cache[b]=g;f="[object Function]"===String(Object.prototype.toString.call(f))?f(b):"[object Function]"===String(Object.prototype.toString.call(f[b]))?f[b](b):f[b];if(void 0!==f&&null!==f)if("[object Array]"===String(Object.prototype.toString.call(f))){var h=0;for(b=f.length;h<b;h++)void 0!==f[h]&&null!==f[h]&&g.val.push([void 0,String(f[h])]);g.val.length&&(g.type=3)}else if("[object Object]"===String(Object.prototype.toString.call(f))){for(h in f)q.call(f,
h)&&void 0!==f[h]&&null!==f[h]&&g.val.push([h,String(f[h])]);g.val.length&&(g.type=2)}else g.type=1,g.val.push([void 0,String(f)]);return g};f.expand=function(b,k){var g=(new h(b)).expand(k);return new f(g)};return h});

/* mousetrap v1.6.1 craig.is/killing/mice */
(function(r,v,f){function w(a,b,g){a.addEventListener?a.addEventListener(b,g,!1):a.attachEvent("on"+b,g)}function A(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return p[a.which]?p[a.which]:t[a.which]?t[a.which]:String.fromCharCode(a.which).toLowerCase()}function F(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function x(a){return"shift"==a||"ctrl"==a||"alt"==a||
"meta"==a}function B(a,b){var g,c,d,f=[];g=a;"+"===g?g=["+"]:(g=g.replace(/\+{2}/g,"+plus"),g=g.split("+"));for(d=0;d<g.length;++d)c=g[d],C[c]&&(c=C[c]),b&&"keypress"!=b&&D[c]&&(c=D[c],f.push("shift")),x(c)&&f.push(c);g=c;d=b;if(!d){if(!n){n={};for(var q in p)95<q&&112>q||p.hasOwnProperty(q)&&(n[p[q]]=q)}d=n[g]?"keydown":"keypress"}"keypress"==d&&f.length&&(d="keydown");return{key:c,modifiers:f,action:d}}function E(a,b){return null===a||a===v?!1:a===b?!0:E(a.parentNode,b)}function c(a){function b(a){a=
a||{};var b=!1,l;for(l in n)a[l]?b=!0:n[l]=0;b||(y=!1)}function g(a,b,u,e,c,g){var l,m,k=[],f=u.type;if(!h._callbacks[a])return[];"keyup"==f&&x(a)&&(b=[a]);for(l=0;l<h._callbacks[a].length;++l)if(m=h._callbacks[a][l],(e||!m.seq||n[m.seq]==m.level)&&f==m.action){var d;(d="keypress"==f&&!u.metaKey&&!u.ctrlKey)||(d=m.modifiers,d=b.sort().join(",")===d.sort().join(","));d&&(d=e&&m.seq==e&&m.level==g,(!e&&m.combo==c||d)&&h._callbacks[a].splice(l,1),k.push(m))}return k}function f(a,b,c,e){h.stopCallback(b,
b.target||b.srcElement,c,e)||!1!==a(b,c)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?b.stopPropagation():b.cancelBubble=!0)}function d(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=A(a);b&&("keyup"==a.type&&z===b?z=!1:h.handleKey(b,F(a),a))}function p(a,c,u,e){function l(c){return function(){y=c;++n[a];clearTimeout(r);r=setTimeout(b,1E3)}}function g(c){f(u,c,a);"keyup"!==e&&(z=A(c));setTimeout(b,10)}for(var d=n[a]=0;d<c.length;++d){var m=d+1===c.length?g:l(e||
B(c[d+1]).action);q(c[d],m,e,a,d)}}function q(a,b,c,e,d){h._directMap[a+":"+c]=b;a=a.replace(/\s+/g," ");var f=a.split(" ");1<f.length?p(a,f,b,c):(c=B(a,c),h._callbacks[c.key]=h._callbacks[c.key]||[],g(c.key,c.modifiers,{type:c.action},e,a,d),h._callbacks[c.key][e?"unshift":"push"]({callback:b,modifiers:c.modifiers,action:c.action,seq:e,level:d,combo:a}))}var h=this;a=a||v;if(!(h instanceof c))return new c(a);h.target=a;h._callbacks={};h._directMap={};var n={},r,z=!1,t=!1,y=!1;h._handleKey=function(a,
c,d){var e=g(a,c,d),k;c={};var h=0,l=!1;for(k=0;k<e.length;++k)e[k].seq&&(h=Math.max(h,e[k].level));for(k=0;k<e.length;++k)e[k].seq?e[k].level==h&&(l=!0,c[e[k].seq]=1,f(e[k].callback,d,e[k].combo,e[k].seq)):l||f(e[k].callback,d,e[k].combo);e="keypress"==d.type&&t;d.type!=y||x(a)||e||b(c);t=l&&"keydown"==d.type};h._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)q(a[d],b,c)};w(a,"keypress",d);w(a,"keydown",d);w(a,"keyup",d)}if(r){var p={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",
18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},t={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},D={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},C={option:"alt",command:"meta","return":"enter",
escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},n;for(f=1;20>f;++f)p[111+f]="f"+f;for(f=0;9>=f;++f)p[f+96]=f.toString();c.prototype.bind=function(a,b,c){a=a instanceof Array?a:[a];this._bindMultiple.call(this,a,b,c);return this};c.prototype.unbind=function(a,b){return this.bind.call(this,a,function(){},b)};c.prototype.trigger=function(a,b){if(this._directMap[a+":"+b])this._directMap[a+":"+b]({},a);return this};c.prototype.reset=function(){this._callbacks={};
this._directMap={};return this};c.prototype.stopCallback=function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")||E(b,this.target)?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable};c.prototype.handleKey=function(){return this._handleKey.apply(this,arguments)};c.addKeycodes=function(a){for(var b in a)a.hasOwnProperty(b)&&(p[b]=a[b]);n=null};c.init=function(){var a=c(v),b;for(b in a)"_"!==b.charAt(0)&&(c[b]=function(b){return function(){return a[b].apply(a,
arguments)}}(b))};c.init();r.Mousetrap=c;"undefined"!==typeof module&&module.exports&&(module.exports=c);"function"===typeof define&&define.amd&&define(function(){return c})}})("undefined"!==typeof window?window:null,"undefined"!==typeof window?document:null);

// https://unpkg.com/human-format@0.8/dist/human-format.js
!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{var g;g="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,g.humanFormat=f()}}(function(){var define;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){!function(root,factory){"function"==typeof define&&define.amd?define([],factory):"object"==typeof exports?module.exports=factory():root.humanFormat=factory()}(this,function(){"use strict";function assignBase(dst,src){var prop;for(prop in src)has(src,prop)&&(dst[prop]=src[prop])}function assign(dst,src){var i,n;for(i=0,n=arguments.length;i<n;++i)src=arguments[i],src&&assignBase(dst,src);return dst}function compareLongestFirst(a,b){return b.length-a.length}function compareSmallestFactorFirst(a,b){return a.factor-b.factor}function escapeRegexp(str){return str.replace(/([.*+?=^!:${}()|[\]\/\\])/g,"\\$1")}function forEach(arr,iterator){var i,n;for(i=0,n=arr.length;i<n;++i)iterator(arr[i],i)}function forOwn(obj,iterator){var prop;for(prop in obj)has(obj,prop)&&iterator(obj[prop],prop)}function isDefined(val){return null!=val}function resolve(container,entry){for(;isString(entry);)entry=container[entry];return entry}function round(f,n){if(!n)return Math.round(f);var p=Math.pow(10,n);return Math.round(f*p)/p}function Scale(prefixes){this._prefixes=prefixes;var escapedPrefixes=[],list=[];forOwn(prefixes,function(factor,prefix){escapedPrefixes.push(escapeRegexp(prefix)),list.push({factor:factor,prefix:prefix})});var lcPrefixes=this._lcPrefixes={};forOwn(prefixes,function(factor,prefix){var lcPrefix=prefix.toLowerCase();has(prefixes,lcPrefix)||(lcPrefixes[lcPrefix]=prefix)}),list.sort(compareSmallestFactorFirst),this._list=list,escapedPrefixes.sort(compareLongestFirst),this._regexp=new RegExp("^\\s*(\\d+(?:\\.\\d+)?)\\s*("+escapedPrefixes.join("|")+")\\s*(.*)\\s*?$","i")}function humanFormat(value,opts){opts=assign({},defaults,opts);var info=humanFormat$raw(value,opts),suffix=info.prefix+opts.unit;return round(info.value,opts.decimals)+(suffix?opts.separator+suffix:"")}function humanFormat$parse(str,opts){var info=humanFormat$parse$raw(str,opts);return info.value*info.factor}function humanFormat$parse$raw(str,opts){if(!isString(str))throw new TypeError("str must be a string");opts=assign({},defaults,opts);var scale=resolve(scales,opts.scale);if(!scale)throw new Error("missing scale");var info=scale.parse(str,opts.strict);if(!info)throw new Error("cannot parse str");return info}function humanFormat$raw(value,opts){if(0===value)return{value:0,prefix:""};if(!isNumber(value))throw new TypeError("value must be a number");opts=assign({},defaults,opts);var scale=resolve(scales,opts.scale);if(!scale)throw new Error("missing scale");var factor,prefix=opts.prefix;if(isDefined(prefix)){if(!has(scale._prefixes,prefix))throw new Error("invalid prefix");factor=scale._prefixes[prefix]}else{var _ref=scale.findPrefix(value);prefix=_ref.prefix,factor=_ref.factor}return value/=factor,{prefix:prefix,value:value}}var has=function(hasOwnProperty){return function(obj,prop){return obj&&hasOwnProperty.call(obj,prop)}}(Object.prototype.hasOwnProperty),toString=function(toString_){return function(val){return toString_.call(val)}}(Object.prototype.toString),isNumber=function(tag){return function(value){return value===value&&toString(value)===tag}}(toString(0)),isString=function(tag){return function(value){return toString(value)===tag}}(toString(""));Scale.create=function(prefixesList,base,initExp){var prefixes={};return forEach(prefixesList,function(prefix,i){prefixes[prefix]=Math.pow(base,i+(initExp||0))}),new Scale(prefixes)},Scale.prototype.findPrefix=function(value){for(var mid,current,list=this._list,low=0,high=list.length-1;low!==high;)mid=low+high+1>>1,current=list[mid].factor,current>value?high=mid-1:low=mid;return list[low]},Scale.prototype.parse=function(str,strict){var matches=str.match(this._regexp);if(!matches)return null;var factor,prefix=matches[2];if(has(this._prefixes,prefix))factor=this._prefixes[prefix];else{if(strict||(prefix=prefix.toLowerCase(),!has(this._lcPrefixes,prefix)))return null;prefix=this._lcPrefixes[prefix],factor=this._prefixes[prefix]}return{factor:factor,prefix:prefix,unit:matches[3],value:+matches[1]}};var scales={binary:Scale.create(",ki,Mi,Gi,Ti,Pi,Ei,Zi,Yi".split(","),1024),SI:Scale.create("y,z,a,f,p,n,µ,m,,k,M,G,T,P,E,Z,Y".split(","),1e3,-8)},defaults={scale:"SI",strict:!1,unit:"",decimals:2,separator:" "};return humanFormat.parse=humanFormat$parse,humanFormat$parse.raw=humanFormat$parse$raw,humanFormat.raw=humanFormat$raw,humanFormat.Scale=Scale,humanFormat})},{}]},{},[1])(1)});

const IMG_CLIP = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdp' +
      'ZHRoPSI4OTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgP' +
      'HBhdGggZD0iTTEyOCA3NjhoMjU2djY0SDEyOHYtNjR6IG0zMjAtMzg0SDEyOHY2NG' +
      'gzMjB2LTY0eiBtMTI4IDE5MlY0NDhMMzg0IDY0MGwxOTIgMTkyVjcwNGgzMjBWNTc' +
      '2SDU3NnogbS0yODgtNjRIMTI4djY0aDE2MHYtNjR6TTEyOCA3MDRoMTYwdi02NEgx' +
      'Mjh2NjR6IG01NzYgNjRoNjR2MTI4Yy0xIDE4LTcgMzMtMTkgNDVzLTI3IDE4LTQ1I' +
      'DE5SDY0Yy0zNSAwLTY0LTI5LTY0LTY0VjE5MmMwLTM1IDI5LTY0IDY0LTY0aDE5Mk' +
      'MyNTYgNTcgMzEzIDAgMzg0IDBzMTI4IDU3IDEyOCAxMjhoMTkyYzM1IDAgNjQgMjk' +
      'gNjQgNjR2MzIwaC02NFYzMjBINjR2NTc2aDY0MFY3Njh6TTEyOCAyNTZoNTEyYzAt' +
      'MzUtMjktNjQtNjQtNjRoLTY0Yy0zNSAwLTY0LTI5LTY0LTY0cy0yOS02NC02NC02N' +
      'C02NCAyOS02NCA2NC0yOSA2NC02NCA2NGgtNjRjLTM1IDAtNjQgMjktNjQgNjR6Ii' +
      'AvPgo8L3N2Zz4K';

function setStyles(dom, styles) {
    Object.keys(styles).forEach(function(key) {
        dom.style[key] = styles[key];
    });
}

function setAttrs(dom, attrs) {
    Object.keys(attrs).forEach(function(key) {
        dom.setAttribute(key, attrs[key]);
    });
}

function normalizeFileName(fname) {
    const mappings = [
        ['\\\\', '⧹'],
        ['/', '⧸'],
        [':', '꞉'],
        ['\\*', '＊'],
        ['\\?', '︖'],
        ['"', '＂'],
        ['<', '＜'],
        ['>', '＞'],
        ['\\|', '￨']
    ];
    let res = fname;
    mappings.forEach(function(mapping) {
        let pat = mapping[0];
        let sub = mapping[1];
        res = res.replace(new RegExp(pat, 'g'), sub);
    });
    return res;
}

function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = '';
    var tempArray = url.split('?');
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    let temp = '';
    if (additionalURL) {
        let tmpAnchor = additionalURL.split('#');
        let TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if(TheAnchor) {
            additionalURL = TheParams;
        }
        tempArray = additionalURL.split('&');
        for (var i=0; i<tempArray.length; i++) {
            if(tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = '&';
            }
        }
    } else {
        let tmpAnchor = baseURL.split('#');
        let TheParams = tmpAnchor[0];
        TheAnchor  = tmpAnchor[1];
        if(TheParams) {
            baseURL = TheParams;
        }
    }
    if(TheAnchor) {
        paramVal += '#' + TheAnchor;
    }
    const rows_txt = temp + param + '=' + paramVal;
    return baseURL + '?' + newAdditionalURL + rows_txt;
}

function clearTooltip(e) {
    e.currentTarget.classList.remove('pt-helper-tooltipped');
    e.currentTarget.classList.remove('pt-helper-tooltipped-s');
    e.currentTarget.removeAttribute('aria-label');
}

function showTooltip(e, msg) {
    e.classList.add('pt-helper-tooltipped');
    e.classList.add('pt-helper-tooltipped-s');
    e.setAttribute('aria-label', msg);
}

function getCopyBtn(args) {
    const img = document.createElement('img');
    setAttrs(img, {src: IMG_CLIP, width: '13'});
    img.classList.add('pt-helper-btn-icon');
    const btn = document.createElement('button');
    btn.classList.add('pt-helper-btn');
    if (args.text !== undefined) {
        const text = document.createElement('span');
        text.innerText = args.text;
        text.classList.add('pt-helper-btn-text');
        btn.appendChild(text);
    }
    btn.appendChild(img);
    btn.addEventListener('click', function() {
        if (typeof args.data === 'string') {
            GM_setClipboard(args.data);
        }
        showTooltip(btn, 'Copied!');
    });
    btn.addEventListener('blur', clearTooltip);
    btn.addEventListener('mouseleave', clearTooltip);
    return btn;
}

function getTextCopyBtn(args) {
    const btn = document.createElement('a');
    btn.textContent = args.text;
    btn.setAttribute('href', 'javascript:void(0)');
    btn.addEventListener('click', function() {
        if (typeof args.data === 'string') {
            GM_setClipboard(args.data);
        }
        showTooltip(btn, 'Copied!');
    });
    btn.addEventListener('blur', clearTooltip);
    btn.addEventListener('mouseleave', clearTooltip);
    return btn;
}

function getQuery() {
    let query = {};
    const qs = window.location.search.substring(1);
    const kvpairs = qs.split('&');
    kvpairs.forEach(function(kvpair) {
        const [k, v] = kvpair.split('=');
        query[k] = v;
    });
    return query;
}

function insertBefore(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

HTMLElement.prototype.prependChild = function(childNode){
    if(this.firstChild)this.insertBefore(childNode,this.firstChild);
    else this.appendChild(childNode);
};

const _URI = new URI();
const QUERY = _URI.query(true);

GM_addStyle(`
.pt-helper-btn {
padding: 6px 12px;
position: relative;
display: inline-block;
font-size: 13px;
font-weight: bold;
line-height: 20px;
color: rgb(51, 51, 51);
white-space: nowrap;
cursor: pointer;
background-color: rgb(238, 238, 238);
background-image: linear-gradient(rgb(252, 252, 252), rgb(238, 238, 238));
border: 1px solid rgb(213, 213, 213);
border-radius: 3px;
user-select: none;
-webkit-appearance: none;
text-transform: none;
}
.pt-helper-btn:hover {
text-decoration: none;
background-color: #ddd;
background-image: linear-gradient(#eee,#ddd);
border-color: #ccc;
}
.pt-helper-btn:active {
background-color: #dcdcdc;
background-image: none;
border-color: #b5b5b5;
box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
}
.pt-helper-btn:focus {
text-decoration: none;
border-color: #51a7e8;
outline: none;
box-shadow: 0 0 5px rgba(81,167,232,0.5);
}
.pt-helper-btn-icon {
top: 2px;
border: 0px;
margin-top: -3px;
position: relative;
display: inline-block;
}
.pt-helper-btn-text {
margin-right: 5px;
display: inline-block;
}
.pt-helper-tooltipped {
position: relative
}
.pt-helper-tooltipped:after {
position: absolute;
z-index: 1000000;
display: none;
padding: 5px 8px;
font: normal normal 11px/1.5 Helvetica,arial,nimbussansl,liberationsans,freesans,clean,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";
color: #fff;
text-align: center;
text-decoration: none;
text-shadow: none;
text-transform: none;
letter-spacing: normal;
word-wrap: break-word;
white-space: pre;
pointer-events: none;
content: attr(aria-label);
background: rgba(0,0,0,0.8);
border-radius: 3px;
-webkit-font-smoothing: subpixel-antialiased
}
.pt-helper-tooltipped:before {
position: absolute;
z-index: 1000001;
display: none;
width: 0;
height: 0;
color: rgba(0,0,0,0.8);
pointer-events: none;
content: "";
border: 5px solid transparent
}
.pt-helper-tooltipped:hover:before,.pt-helper-tooltipped:hover:after,.pt-helper-tooltipped:active:before,.pt-helper-tooltipped:active:after,.pt-helper-tooltipped:focus:before,.pt-helper-tooltipped:focus:after {
display: inline-block;
text-decoration: none
}
.pt-helper-tooltipped-multiline:hover:after,.pt-helper-tooltipped-multiline:active:after,.pt-helper-tooltipped-multiline:focus:after {
display: table-cell
}
.pt-helper-tooltipped-s:after,.pt-helper-tooltipped-se:after,.pt-helper-tooltipped-sw:after {
top: 100%;
right: 50%;
margin-top: 5px
}
.pt-helper-tooltipped-s:before,.pt-helper-tooltipped-se:before,.pt-helper-tooltipped-sw:before {
top: auto;
right: 50%;
bottom: -5px;
margin-right: -5px;
border-bottom-color: rgba(0,0,0,0.8)
}
.pt-helper-tooltipped-se:after {
right: auto;
left: 50%;
margin-left: -15px
}
.pt-helper-tooltipped-sw:after {
margin-right: -15px
}
.pt-helper-tooltipped-n:after,.pt-helper-tooltipped-ne:after,.pt-helper-tooltipped-nw:after {
right: 50%;
bottom: 100%;
margin-bottom: 5px
}
.pt-helper-tooltipped-n:before,.pt-helper-tooltipped-ne:before,.pt-helper-tooltipped-nw:before {
top: -5px;
right: 50%;
bottom: auto;
margin-right: -5px;
border-top-color: rgba(0,0,0,0.8)
}
.pt-helper-tooltipped-ne:after {
right: auto;
left: 50%;
margin-left: -15px
}
.pt-helper-tooltipped-nw:after {
margin-right: -15px
}
.pt-helper-tooltipped-s:after,.pt-helper-tooltipped-n:after {
-webkit-transform: translateX(50%);
-ms-transform: translateX(50%);
transform: translateX(50%)
}
.pt-helper-tooltipped-w:after {
right: 100%;
bottom: 50%;
margin-right: 5px;
-webkit-transform: translateY(50%);
-ms-transform: translateY(50%);
transform: translateY(50%)
}
.pt-helper-tooltipped-w:before {
top: 50%;
bottom: 50%;
left: -5px;
margin-top: -5px;
border-left-color: rgba(0,0,0,0.8)
}
.pt-helper-tooltipped-e:after {
bottom: 50%;
left: 100%;
margin-left: 5px;
-webkit-transform: translateY(50%);
-ms-transform: translateY(50%);
transform: translateY(50%)
}
.pt-helper-tooltipped-e:before {
top: 50%;
right: -5px;
bottom: 50%;
margin-top: -5px;
border-right-color: rgba(0,0,0,0.8)
}
.pt-helper-tooltipped-multiline:after {
width: -webkit-max-content;
width: -moz-max-content;
width: max-content;
max-width: 250px;
word-break: break-word;
word-wrap: normal;
white-space: pre-line;
border-collapse: separate
}
.pt-helper-tooltipped-multiline.pt-helper-tooltipped-s:after,.pt-helper-tooltipped-multiline.pt-helper-tooltipped-n:after {
right: auto;
left: 50%;
-webkit-transform: translateX(-50%);
-ms-transform: translateX(-50%);
transform: translateX(-50%)
}
.pt-helper-tooltipped-multiline.pt-helper-tooltipped-w:after,.pt-helper-tooltipped-multiline.pt-helper-tooltipped-e:after {
right: 100%
}
@media screen and (min-width: 0\0) {
.pt-helper-tooltipped-multiline:after {
width:250px
}
}
.pt-helper-tooltipped-sticky:before,.pt-helper-tooltipped-sticky:after {
display: inline-block
}
.pt-helper-tooltipped-sticky.pt-helper-tooltipped-multiline:after {
display: table-cell
}
.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped:after {
color: #000;
background: rgba(255,255,255,0.8)
}
.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped .pt-helper-tooltipped-s:before,.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped .pt-helper-tooltipped-se:before,.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped .pt-helper-tooltipped-sw:before {
border-bottom-color: rgba(255,255,255,0.8)
}
.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped.pt-helper-tooltipped-n:before,.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped.pt-helper-tooltipped-ne:before,.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped.pt-helper-tooltipped-nw:before {
border-top-color: rgba(255,255,255,0.8)
}
.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped.pt-helper-tooltipped-e:before {
border-right-color: rgba(255,255,255,0.8)
}
.fullscreen-overlay-enabled.dark-theme .pt-helper-tooltipped.pt-helper-tooltipped-w:before {
border-left-color: rgba(255,255,255,0.8)
}
`);

if (window.location.host === 'hdbits.org') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(HDB#'+id+')';
        // Insert copy title button
        let title = document.querySelector('.main .bottom[align=center] > h1').textContent.trim();
        title += ' ' + idTag;
        title = normalizeFileName(title);
        Array.from(document.querySelectorAll('#details tr:nth-child(1) td:nth-child(1) > *')).forEach(node => {
            setStyles(node, { margin: '5px 0' });
        });
        const ref = document.querySelector('#details tr:nth-child(1) td:nth-child(1) > *:last-child > *:first-child');
        setStyles(ref, {
            margin: '5px 0 5px 5px',
            fontWeight: 'bold'
        });
        const copyTitleBtn = getTextCopyBtn({
            text: 'Copy Title',
            data: title
        });
        setStyles(copyTitleBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        insertBefore(copyTitleBtn, ref);
        // Insert copy ID tag button
        const copyIdTagBtn = getTextCopyBtn({
            text: 'Copy Tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        insertBefore(copyIdTagBtn, ref);
        // Insert copy torrent url button
        const link = document.querySelector('#details a.index.js-download');
        const url = link.href;
        const copyUrlBtn = getTextCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        insertBefore(copyUrlBtn, ref);
        // Insert copy torrent folder name button
        const folderName = link.textContent.replace(/\.torrent$/, '').trim();
        const copyFolderNameBtn = getTextCopyBtn({
            text: 'Copy Folder',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        insertBefore(copyFolderNameBtn, ref);
    }
    else if (window.location.pathname === '/browse.php') {
        const searchBox = document.querySelector('#search');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
    else if (window.location.pathname === '/browse2.php') {
        const searchBox = document.querySelector('#tv_searchtext');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'sdbits.org') {
    if (window.location.pathname === '/details.php') {
        debugger;
        const id = QUERY.id;
        const idTag = '(SDB#'+id+')';
        // Insert copy title button
        let title = document.querySelector('.main .bottom[align=center] > h1').textContent.trim();
        title += ' ' + idTag;
        title = normalizeFileName(title);
        Array.from(document.querySelectorAll('#details tr:nth-child(1) td:nth-child(1) > *')).forEach(node => {
            setStyles(node, { margin: '5px 0' });
        });
        const details = document.querySelector('body > table.menu > tbody > tr:nth-child(3) > td > table.main > tbody > tr > td:nth-child(2) > table > tbody');
        const ref = details.querySelector('tr:nth-child(1) > td:last-child');
        const copyTitleBtn = getTextCopyBtn({
            text: 'Copy Title',
            data: title
        });
        setStyles(copyTitleBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        ref.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getTextCopyBtn({
            text: 'Copy Tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        ref.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const link = ref.querySelector('a:first-child');
        const url = link.href;
        const copyUrlBtn = getTextCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        ref.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = link.textContent.replace(/\.torrent$/, '').trim();
        const copyFolderNameBtn = getTextCopyBtn({
            text: 'Copy Folder',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            margin: '5px',
            fontWeight: 'bold'
        });
        ref.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/browse.php') {
        const searchBox = document.querySelector('#search');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'chdbits.co') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(CHD#'+id+')';
        // Insert copy title button
        let title = document.querySelector('input[name=torrent_name]').value.trim();
        let shortTitle = document.querySelector('table.details > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)').textContent.trim();
        if (shortTitle) {
            title += ' - ' + shortTitle;
        }
        title += ' ' + idTag;
        title = normalizeFileName(title);
        const copyTitleRef = document.querySelector('#top');
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(document.createElement('br'));
        copyTitleRef.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const copyUrlRef = document.querySelector('table.details > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)');
        const url = copyUrlRef.querySelector('a').href;
        const copyUrlBtn = getCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            marginTop: '5px'
        });
        copyUrlRef.appendChild(document.createElement('br'));
        copyUrlRef.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('a.index').textContent.replace(/^\[CHDBits\]\./, '').replace(/\.torrent$/, '');
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyUrlRef.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'u2.dmhy.org') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(U2#'+id+')';
        // Insert copy title button
        const title = normalizeFileName(document.querySelector('td#outer > h1').innerText.trim()+idTag);
        const copyTitleRef = document.querySelector('td#outer > h3');
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px'
        });
        copyTitleRef.appendChild(document.createElement('br'));
        copyTitleRef.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const copyUrlRef = document.querySelector('td#outer td:nth-child(2)');
        const url = copyUrlRef.querySelector('a:nth-child(2)').href;
        const copyUrlBtn = getCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            marginTop: '5px'
        });
        copyUrlRef.appendChild(document.createElement('br'));
        copyUrlRef.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('a.index').textContent.replace(/^\[U2\]\./, '').replace(/\.torrent$/, '');
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyUrlRef.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
        const addSearchControl = (() => {
            const extraSearchControlsParent = document.querySelector('#ksearchboxmain > tr:nth-child(1) > td:nth-child(1) > table:nth-child(2) > tbody');
            const extraSearchControls = document.createElement('tr');
            extraSearchControlsParent.appendChild(extraSearchControls);
            return (children) => {
                const column = document.createElement('td');
                column.classList.add('bottom');
                setStyles(column, {
                    padding: '5px'
                });
                children.forEach(n => column.appendChild(n));
                extraSearchControls.appendChild(column);
            };
        })();
        let countdownOnly = QUERY.countdownonly === '1';
        const countdownOnlyBox = document.createElement('input');
        setAttrs(countdownOnlyBox, {
            type: 'checkbox',
            id: 'countdownonly',
            name: 'countdownonly',
            value: '1'
        });
        countdownOnlyBox.checked = countdownOnly;
        const countdownOnlyLink = document.createElement('a');
        countdownOnlyLink.textContent = '只显示限时优惠的种子';
        setAttrs(countdownOnlyLink, {
            title: countdownOnlyLink.textContent,
            href: _URI.clone().setQuery({countdownonly: '1'}).toString()
        });
        addSearchControl([countdownOnlyBox, countdownOnlyLink]);
        let countdownHighlight = QUERY.countdownhighlight === '1';
        const countdownHighlightBox = document.createElement('input');
        setAttrs(countdownHighlightBox, {
            type: 'checkbox',
            id: 'countdownhighlight',
            name: 'countdownhighlight',
            value: '1'
        });
        countdownHighlightBox.checked = countdownHighlight;
        const countdownHighlightLink = document.createElement('a');
        countdownHighlightLink.textContent = '高亮显示限时优惠的种子';
        setAttrs(countdownHighlightLink, {
            title: countdownHighlightLink.textContent,
            href: _URI.clone().setQuery({countdownhighlight: '1'}).toString()
        });
        addSearchControl([countdownHighlightBox, countdownHighlightLink]);
        const applyControlSettings = () => {
            Array.from(document.querySelectorAll('.torrents > tbody > tr:not(:first-child)')).forEach((row) => {
                const description = row.querySelector('td:nth-child(2) > table.torrentname > tbody > tr:nth-child(2) > td:nth-child(1)').textContent;
                if(description.match(/\[[^\]]*剩余[^\]]*\]/)) {
                    const title = row.querySelector('td:nth-child(2) > table.torrentname > tbody > tr:nth-child(1) > td:nth-child(1) > a');
                    setStyles(title, { color: countdownHighlight ? '#8a05ff' : 'inherit'});
                } else {
                    setStyles(row, { display: countdownOnly ? 'none' : 'table-row'});
                }
            });
            Array.from(document.querySelectorAll('#outer .main a')).forEach((a) => {
                const uri = new URI(a);
                if (uri.path() === '/torrents.php') {
                    a.href = uri.setQuery({
                        countdownonly: countdownOnly ? '1' : undefined,
                        countdownhighlight: countdownHighlight ? '1' : undefined
                    });
                }
            });
        };
        countdownOnlyBox.addEventListener('change', () => {
            countdownOnly = countdownOnlyBox.checked;
            applyControlSettings();
        });
        countdownHighlightBox.addEventListener('change', () => {
            countdownHighlight = countdownHighlightBox.checked;
            applyControlSettings();
        });
        applyControlSettings();
    }
}

if (window.location.host === 'tp.m-team.cc') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(MT#'+id+')';
        // Insert copy title button
        let title = document.querySelector('input[name=torrent_name]').value.trim();
        let shortTitle = document.querySelector('#outer > table tr:nth-child(2) > td:nth-child(2)').textContent.trim();
        if (shortTitle) {
            title += ' - ' + shortTitle;
        }
        title += ' ' + idTag;
        title = normalizeFileName(title);
        const copyTitleRef = document.querySelector('#top');
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(document.createElement('br'));
        copyTitleRef.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const copyUrlRef = document.querySelector('#outer > table tr:nth-child(1) > td:nth-child(2)');
        const url = Array.from(document.querySelectorAll('#outer > table tr')).find(tr => {
            return tr.querySelector('td:nth-child(1)').textContent.trim() === '種子鏈接';
        }).querySelector('td:nth-child(2) b:nth-child(2) a').href;
        const copyUrlBtn = getCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            marginTop: '5px'
        });
        copyUrlRef.appendChild(document.createElement('br'));
        copyUrlRef.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('a.index').textContent.replace(/^\[M-TEAM\]\./, '').replace(/\.torrent$/, '');
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyUrlRef.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'hdsky.me') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(HDS#'+id+')';
        // Insert copy title button
        let title = document.querySelector('input[name=torrent_name]').value.trim();
        let shortTitle = document.querySelector('#outer > table tr:nth-child(3) > td:nth-child(2)').textContent.trim();
        if (shortTitle) {
            title += ' - ' + shortTitle;
        }
        title += ' ' + idTag;
        title = normalizeFileName(title);
        const copyTitleRef = document.querySelector('#top');
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(document.createElement('br'));
        copyTitleRef.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const copyUrlRef = document.querySelector('#outer > table tr:nth-child(2) > td:nth-child(2)');
        const url = copyUrlRef.querySelector('a').href;
        const copyUrlBtn = getCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            marginTop: '5px'
        });
        copyUrlRef.appendChild(document.createElement('br'));
        copyUrlRef.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('form.index input').value.replace(/^\[HDSky\]\./, '').replace(/\.torrent$/, '');
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyUrlRef.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'hdhome.org') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(HDH#'+id+')';
        // Insert copy title button
        let title = document.querySelector('input[name=torrent_name]').value.trim();
        let shortTitle = document.querySelector('#outer > table tr:nth-child(2) > td:nth-child(2)').textContent.trim();
        if (shortTitle) {
            title += ' - ' + shortTitle;
        }
        title += ' ' + idTag;
        title = normalizeFileName(title);
        const copyTitleRef = document.querySelector('#top');
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(document.createElement('br'));
        copyTitleRef.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const copyUrlRef = document.querySelector('#outer > table tr:nth-child(2) > td:nth-child(2)');
        const url = document.querySelector('#outer > table tr:nth-child(6) > td:nth-child(2) b').textContent;
        const copyUrlBtn = getCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            marginTop: '5px'
        });
        copyUrlRef.appendChild(document.createElement('br'));
        copyUrlRef.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('a.index').textContent.replace(/^\[HDHome\]\./, '').replace(/\.torrent$/, '');
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyUrlRef.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'asiandvdclub.org') {
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(ADC#'+id+')';
        // Insert copy title button
        let title = Array.from(document.querySelector('.outer > .main > h1').childNodes).find(n => n.nodeType === document.TEXT_NODE).data.trim();
        title += ' ' + idTag;
        title = normalizeFileName(title);
        const anchor = document.querySelector('.outer > .main > h1');
        const controls = document.createElement('div');
        insertAfter(controls, anchor);
        insertAfter(document.createElement('br'), controls);
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        controls.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        controls.appendChild(copyIdTagBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('.description tbody tr:nth-child(1) td:nth-child(2) a').textContent.replace(/\.torrent$/, '').trim();
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        controls.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/browse.php') {
        const searchBox = document.querySelector('#search');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'open.cd') {
    if (window.location.pathname === '/userdetails.php') {
        const userid = QUERY.id;
        const hrBtn = document.querySelector('#outer > table.main tr:last-of-type > td:nth-child(2) > a:nth-child(1)');
        hrBtn.setAttribute('href', 'javascript: void(0);');
        hrBtn.addEventListener('click', () => {
            const target = document.getElementById('ka5');
            if (target.innerHTML == "") {
                let seeding = new Set();
                getusertorrentlistajax(userid, 'completed', 'ka3');
                getusertorrentlistajax(userid, 'seeding', 'ka1');
                const seedingTable = document.querySelector('#ka1 > table');
                if (seedingTable) {
                    Array.from(seedingTable.querySelectorAll('tr:not(:first-of-type) > td:nth-child(2) > a:nth-child(1)')).forEach(a => seeding.add(a.href.match(/\?id\=(\d+)/)[1]));
                }
                let length = 0;
                let hrTable = null;
                const compTable = document.querySelector('#ka3 > table');
                if (compTable) {
                    hrTable = compTable.cloneNode(true);
                    Array.from(hrTable.querySelectorAll('tr:not(:first-of-type)')).forEach(r => {
                        const [_, days, hours, minutes, seconds] = r.querySelector('td:nth-child(7)').textContent.match(/^(?:(\d+)天)?(?:(\d+):)?(\d+):(\d+)$/);
                        const seedTime = parseInt(seconds) + (60 * parseInt(minutes)) + (60 * 60 * parseInt(hours)) + (60 * 60 * 24 * parseInt(days));
                        if (seedTime > 129600) {
                            return void r.remove();
                        }
                        const id = r.querySelector('td:nth-child(2) > a:nth-child(1)').href.match(/\?id\=(\d+)/)[1];
                        if (seeding.has(id)) {
                            return void r.remove();
                        }
                    });
                }
                if (hrTable) {
                    length = hrTable.querySelectorAll('tr:not(:first-of-type)').length;
                }
                if (length === 0) {
                    target.textContent = '沒有記錄';
                } else {
                    target.innerHTML = `<b>${length}</b>條記錄<br>`;
                    target.appendChild(hrTable);
                }
            }
            klappe_news('a5');
        });
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'jpopsuki.eu') {
    if (window.location.pathname === '/artist.php') {
        const artistID = QUERY.id;
        const tables = Array.from(document.querySelectorAll('table.torrent_table'));
        tables.forEach(table => {
            const selectAllTarget = table.querySelector('tr:nth-child(1) > td:nth-child(1)');
            const selectAllBtn = document.createElement('input');
            selectAllBtn.setAttribute('type', 'checkbox');
            selectAllBtn.addEventListener('change', () => {
                Array.from(table.querySelectorAll('tr.group_torrent > td:nth-child(1) > input[type=checkbox]')).forEach(box => {
                    box.checked = selectAllBtn.checked;
                });
            });
            selectAllTarget.appendChild(selectAllBtn);
        });
        const selectAllDisplayedTorrentsLabel = document.createElement('label');
        selectAllDisplayedTorrentsLabel.textContent = ' Select all';
        selectAllDisplayedTorrentsLabel.setAttribute('for', 'select_all_displayed_torrents');
        const selectAllDisplayedTorrentsBtn = document.createElement('input');
        selectAllDisplayedTorrentsBtn.setAttribute('type', 'checkbox');
        selectAllDisplayedTorrentsBtn.addEventListener('change', () => {
            tables.forEach(table => {
                Array.from(table.querySelectorAll('tr:nth-child(1) > td:nth-child(1) > input[type=checkbox]')).forEach(box => {
                    box.checked = selectAllDisplayedTorrentsBtn.checked;
                    box.dispatchEvent(new Event('change'));
                });
            });
        });
        const target = document.querySelector('.artist_filter');
        target.prependChild(selectAllDisplayedTorrentsLabel);
        target.prependChild(selectAllDisplayedTorrentsBtn);
    }
    else if (window.location.pathname === '/torrents.php') {
        document.querySelector('#swapSearch').style.display = 'none';
        document.querySelector('#search_box').classList.remove('hide');
        const searchBox = document.querySelector('input.inputtext[name="searchstr"]');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

if (window.location.host === 'www.criterion.com') {
    if (window.location.pathname.match(/^\/films\//)) {
        let spine = null;
        const infos = document.querySelectorAll('.film_info .tab.tab_1 .left_column ul li');
        for (let info of infos) {
            const m = info.textContent.match(/Spine\s#(\d+)/);
            if (m) {
                spine = parseInt(m[1]);
                break;
            }
        }
        if (spine != null) {
            const copyTagBtn = getCopyBtn({
                text: 'Copy CC Tag',
                data: `(CC#${spine})`
            });
            let ref;
            const candidates = document.querySelector('.moviedesc').childNodes;
            for (let node of candidates) {
                if (node.nodeName === 'H1' || node.nodeName === 'H2') {
                    ref = node;
                }
            }
            insertAfter(copyTagBtn, ref);
        }
    }
}

if (window.location.host === 'ourbits.club') {
    // All page rule
    const userlink = document.querySelector('#info_block table td:nth-child(1) a:nth-child(1)');
    const isUploader = userlink.classList.contains('Uploader_Name');
    if (isUploader) {
        // Add uploaders link on nav bar
        const nav = document.querySelector('#mainmenu');
        const navItem = document.createElement('li');
        const navLink = document.createElement('a');
        navLink.textContent = '发布员排行榜';
        navLink.href = '/uploaders.php';
        setStyles(navLink, {width: 'auto'});
        setStyles(navItem, {margin: '0 12px'});
        navItem.appendChild(navLink);
        nav.appendChild(navItem);
    }
    if (window.location.pathname === '/details.php') {
        const id = QUERY.id;
        const idTag = '(OB#'+id+')';
        // Insert copy title button
        let title = document.querySelector('input[type=hidden][name=torrent_name]').value.trim();
        let shortTitle = document.querySelector('h1#top + table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)').textContent.trim();
        if (shortTitle) {
            title += ' - ' + shortTitle;
        }
        title += ' ' + idTag;
        title = normalizeFileName(title);
        const copyTitleRef = document.querySelector('#top');
        const copyTitleBtn = getCopyBtn({
            text: 'Copy title',
            data: title
        });
        setStyles(copyTitleBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(document.createElement('br'));
        copyTitleRef.appendChild(copyTitleBtn);
        // Insert copy ID tag button
        const copyIdTagBtn = getCopyBtn({
            text: 'Copy ID tag',
            data: idTag
        });
        setStyles(copyIdTagBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyTitleRef.appendChild(copyIdTagBtn);
        // Insert copy torrent url button
        const copyUrlRef = document.querySelector('h1#top + table > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)');
        const url = Array.from(document.querySelectorAll('h1#top + table a')).find(a => a.textContent == '[下载地址]').href;
        const copyUrlBtn = getCopyBtn({
            text: 'Copy URL',
            data: url
        });
        setStyles(copyUrlBtn, {
            marginTop: '5px'
        });
        copyUrlRef.appendChild(document.createElement('br'));
        copyUrlRef.appendChild(copyUrlBtn);
        // Insert copy torrent folder name button
        const folderName = document.querySelector('a.index').textContent.replace(/^\[OurBits\]\./, '').replace(/\.torrent$/, '');
        const copyFolderNameBtn = getCopyBtn({
            text: 'Copy folder name',
            data: folderName
        });
        setStyles(copyFolderNameBtn, {
            marginTop: '5px',
            marginLeft: '10px'
        });
        copyUrlRef.appendChild(copyFolderNameBtn);
    }
    else if (window.location.pathname === '/uploaders.php') {
        const parent = document.querySelector('td#outer > table.main td.embedded > div');
        const form = parent.querySelector('form');
        const list = parent.querySelector('div:nth-child(3) > table > tbody');
        const header = list.querySelector('tr:nth-child(1)');
        let body = Array.from(list.querySelectorAll('tr:not(:first-child)')).map(r => {
            const d = r.querySelector('td:nth-child(4) > span');
            return {
                size: humanFormat.parse(r.querySelector('td:nth-child(2)').textContent.trim()),
                count: parseInt(r.querySelector('td:nth-child(3)').textContent.trim()),
                date: (d ? new Date(d.title.trim()) : null),
                el: r
            };
        });
        const compareDate = (a, b) => {
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            if (a == null && b == null) {
                return 0;
            }
            return a - b;
        };
        const sortAttrs = {
            size: {
                comp: null,
                defaultOrder: -1,
                header: header.querySelector('td:nth-child(2)')
            },
            count: {
                comp: null,
                defaultOrder: -1,
                header: header.querySelector('td:nth-child(3)')
            },
            date: {
                comp: compareDate,
                defaultOrder: -1,
                header: header.querySelector('td:nth-child(4)')
            }
        };
        for (let sortBy of Object.keys(sortAttrs)) {
            const sortAttr = sortAttrs[sortBy];
            const title = sortAttr.header.textContent.trim();
            const link = document.createElement('a');
            link.textContent = title;
            link.href = 'javascript: void(0)';
            setStyles(link, {color: '#fff'});
            sortAttr.header.textContent = '';
            sortAttr.header.appendChild(link);
            sortAttr.header = link;
            sortAttr.title = title;
            link.addEventListener('click', () => toggleSort(sortBy));
        }
        let currentSortBy = null;
        let currentOrder = null;
        const toggleSort = (sortBy, order) => {
            if (Object.keys(sortAttrs).indexOf(sortBy) < 0) {
                // TODO
                return;
            }
            if (order == null) {
                if (currentSortBy === sortBy) {
                    order = -1 * currentOrder;
                } else {
                    order = sortAttrs[sortBy].defaultOrder;
                }
            }
            if (typeof order !== 'number' || order === 0) {
                // TODO
                return;
            }
            const attrComp = sortAttrs[sortBy].comp;
            const comp = (a, b) => {
                if (attrComp) return attrComp(a[sortBy], b[sortBy]);
                return a[sortBy] - b[sortBy];
            }
            let newBody = body.sort(comp);
            if (order < 0) {
                newBody = newBody.reverse();
            }
            newBody.forEach(i => list.appendChild(i.el));
            currentSortBy = sortBy;
            currentOrder = order;
        }
    }
    else if (window.location.pathname === '/torrents.php') {
        const searchBox = document.querySelector('#searchinput');
        if (searchBox != null) {
            Mousetrap.bind('s', () => searchBox.focus() || searchBox.select(), 'keyup');
        }
    }
}

