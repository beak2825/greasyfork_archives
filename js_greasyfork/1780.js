// ==UserScript==
// @name        Prot.js
// @namespace   http://mdev.me/
// @description Helps neaten code without being a heavy library
// @include     http://*stackoverflow.com/questions/*
// @version     3
// @grant       none
// ==/UserScript==
/**
 * ||| Array wrapper for custom prototype functionality |||
 *
 * ----------------------------------------------------
 *  Usage: A(myArr).loop()  - or -  A([1,2,3]).loop()
 * ----------------------------------------------------
 *
 * Functions available:
 * =====================
 * A(a).getUnique() - - - - (array)		unique elements from the original array
 * A(a).contains(b) - - - - (bool)		whether b exists in a
 * A(a).has(b)  - - - - - - (bool)		alias for .contains()
 * A(a).loop(f) - - - - - - (mixed)		runs function f for every element in array a, passes params (value,key,array)
 * A(a).wrapAll() - - - - - (object)	makes any method from now on, that would have returned an array, return the array in this wrapper ( returns this for chained inst, e.g. var ar = A([]).wrapAll() )
 *
 * Plus polyfills for all new methods (every,forEach,some,map,filter,indexOf,lastIndexOf)
 */
Arr = function(a){this.a=a}
Arr.prototype = new Array;
Arr.prototype._ret = function(ret){return this._retWrap&&ret instanceof Array?A(ret).wrapAll():ret;}
Arr.prototype._retWrap = false;
Arr.prototype.concat = function() { return this.a.concat.apply(this.a,arguments); }
Arr.prototype.contains = function(b){return this.a.indexOf(b)>-1;}
Arr.prototype.every = function(func,that) {
	that=that||this.a;if(typeof this.a.every=="function") return this.a.every.apply(that,arguments);
	else{for(var i=0,c=this.a.length;i<c;i++){if(func.call(that,this.a[i],i,this.a)!==true)return false}return true;}
}
Arr.prototype.filter = function(func,that) {
	that=that||this.a;if(typeof this.a.filter=="function") return this._ret(this.a.filter.apply(that,arguments));
	else{var newA=[];for(var i=0,c=this.a.length;i<c;i++){if(func.call(that,this.a[i],i,this.a)===true)newA.push(this.a[i])}return this._ret(newA);}
}
Arr.prototype.forEach = function(func,that){that=that||this.a;if(typeof this.a.forEach=="function") this.a.forEach.apply(that,arguments);else this.loop(func,that);}
Arr.prototype.getUnique=function(){var a=[];this.loop(function(l){if(a.indexOf(l)>-1)return;a.push(l);});return this._ret(a);}
Arr.prototype.has = Arr.prototype.contains;
Arr.prototype.indexOf = function(searchElement/*,fromIndex*/) {
	if(typeof this.a.indexOf == "function") return this.a.indexOf.apply(this.a,arguments);
	else { if(this===null)throw new TypeError();var n=0,k,t=new Object(this.a),len=t.length>>>0;
		if(len === 0)return -1;if(arguments.length>1){n=Number(arguments[1]);if(n!==n)n=0;else if(n!==0&&n!==Infinity&&n!==-Infinity)n=(n>0||-1)*Math.floor(Math.abs(n));}
		if(n>=len)return -1;for(k=n>=0?n:Math.max(len-Math.abs(n),0);k<len;k++){if(t[k]&&t[k]===searchElement)return k;}return -1; }
}
Arr.prototype.join = function() { return this.a.join.apply(this.a,arguments); }
Arr.prototype.last = function() { return this.a[this.length-1]; }
Arr.prototype.lastIndexOf = function(searchElement/*,fromIndex*/) {
	if(typeof this.a.lastIndexOf == "function") return this.a.lastIndexOf.apply(this.a,arguments);
	else { if(this===null)throw new TypeError();var n,k,t=new Object(this.a),len=t.length>>>0;
		if(len === 0)return -1;n=len;if(arguments.length>1){n=Number(arguments[1]);if(n!==n)n=0;else if(n!==0&&n!==Infinity&&n!==-Infinity)n=(n>0||-1)*Math.floor(Math.abs(n));}
		for(k=n>=0?Math.min(n,len-1):len-Math.abs(n);k>=0;k--){if(t[k]&&t[k]===searchElement)return k;}return -1; }
}
Arr.prototype.loop = function(func,that) {
	for(var i=0,c=this.a.length;i<c;i++)
	{
		var r = null;
		if(that) r = func.apply(that,[this.a[i],i,this.a]);
		else r = func(this.a[i],i,this.a);
		if(typeof r != "undefined")
		{ if(r == '__continue') continue; else return r; }
	} return;
}
Arr.prototype.map = function(func,that) {
	that=that||this.a;
	if(typeof this.a.map == "function"){this.a=this.a.map.apply(that,arguments);return this._ret(this.a);}
	else{var bk=this.a;for(var i=0,c=this.a.length;i<c;i++){this.a[i]=func.call(that,this.a[i],i,bk)}return this._ret(this.a);}
}
Arr.prototype.pop = function() { return this.a.pop.apply(this.a,arguments); }
Arr.prototype.push = function() { return this.a.push.apply(this.a,arguments); }
Arr.prototype.reverse = function() { return this._ret(this.a.reverse.apply(this.a,arguments)); }
Arr.prototype.shift = function() { return this.a.shift.apply(this.a,arguments); }
Arr.prototype.slice = function() { return this._ret(this.a.slice.apply(this.a,arguments)); }
Arr.prototype.some = function(func,that) {
	that=that||this.a;
	if(typeof this.a.some=="function") return this.a.some.apply(that,arguments);
	else{for(var i=0,c=this.a.length;i<c;i++){if(func.call(that,this.a[i],i,this.a)===true)return true}return false;}
}
Arr.prototype.sort = function(f) {
	if(df(f,"function") || !df(f)) return this._ret(this.a.sort.apply(this.a,arguments));
	else if(df(f,"object"))
	{
		var settings={col:f.col||0,dir:f.dir||'asc'};if(settings.dir==-1)settings.dir='desc';if(settings.dir==1)settings.dir='asc';
		return this.sort(function(a,b) {
			if((a instanceof Array || a instanceof Object) && (b instanceof Array || b instanceof Object) && df(a[settings.col]) && df(b[settings.col]))
			{a = a[settings.col];b = b[settings.col];}return settings.dir=='desc'?(a<b?1:a>b?-1:0):(a>b?1:a<b?-1:0);
		});
	}else return false;
}
Arr.prototype.splice = function() { return this._ret(this.a.splice.apply(this.a,arguments)); }
Arr.prototype.toSource = function() { return this.a.toSource ? this.a.toSource.apply(this.a,arguments) : '['+this.a.toString.apply(this.a,arguments)+']'; }
Arr.prototype.toString = function() { return this.a.toString.apply(this.a,arguments); }
Arr.prototype.unshift = function() { return this.a.unshift.apply(this.a,arguments); }
Arr.prototype.vAdjust=function(v,prep){
	prep = df(prep)?prep:false;
	if(df(v,"number")) this.map(function(e){return e+v});
	else if(df(v,"string"))
	{
		var m=v.match(/^([*/])(\d+(\.\d+)?)$/);
		if(v.match(/^\\([*/])(\d+(\.\d+)?)$/)) v = v.substr(1);
		if(m!=null)
		{
			if(m[1]=='*') this.map(function(e){return e*m[2]});
			if(m[1]=='/') this.map(function(e){return e/m[2]});
		}
		else
		{
			var b=prep?v:'',a=prep?'':v;
			this.map(function(e){return b+e+a});
		}
	}
	else if(df(v,"function")) this.map(v);
	return this._ret(this.a);
}
Arr.prototype.valueOf=function(){return this.a.valueOf();}
Arr.prototype.wrapAll=function(r){this._retWrap=df(r,"boolean",true);return this;}

function A(a){if(arguments.length>1||!(a instanceof Array))a=Array.prototype.slice.call(arguments,0);return new Arr(a)}

/**
 * ||| Object wrapper for custom prototype functionality |||
 *
 * ----------------------------------------------------------
 *  Usage: O({foo:'bar'}).loop()  - or -  O(miscObj).loop()
 * ----------------------------------------------------------
 *
 * Functions available:
 * =====================
 * O(a).toArray() - - - - - (array)		an array of the object's values
 * O(a).loop(f) - - - - - - (mixed)		runs func f for every element in object a with params (value,key,object), 2nd param = thisObject, 3rd param true enumerates all properties
 * O(a).length()  - - - - - (number)	number of own properties
 * O(a).keys()  - - - - - - (array)		array of keys for the object's own properties
 */
Obj = function(o){this.o=o;this.length();}
Obj.prototype._ret = function(ret){return this._retWrap&&ret instanceof Object?O(ret).wrapAll():ret;}
Obj.prototype._retWrap = false;
Obj.prototype.hasProp=function(p){return Object.prototype.hasOwnProperty.call(this.o,p)}
Obj.prototype.keys=function(){var ks=[];this.loop(function(v,k){ks.push(k)});return ks;}
Obj.prototype.length=function(){var l=0;for(var i in this.o){if(this.o.hasOwnProperty(i))l++};this.len=l;return l;}
Obj.prototype.loop=function(func,that,enumAll){
	enumAll = df(enumAll,"boolean") ? enumAll : false;
	if(!df(func,"function")) return false;
	for(var i in this.o)
	{
		if((!enumAll && !this.hasProp(i) || i == 'length')) continue;
		var r = null;
		if(that) r=func.apply(that,[this.o[i],i,this.o]);
		else r=func(this.o[i],i,this.o);
		if(typeof r != "undefined"){if(r=='__continue')continue;else return r;}
	}
}
Obj.prototype.map=function(f){
	this.loop(function(v,i){
		this.o[i] = f(v);
	},this);
	return this._ret(this.o);
}
Obj.prototype.toArray=function(){
	var r=Array.prototype.slice.call(this.o,0);
	if(r.length==0&&this.length()>0){var vs=[];this.loop(function(v){vs.push(v)});return vs;}
	var retA = A(r);
	retA._retWrap = this._retWrap;
	return retA.filter(function(){return true;});
}
Obj.prototype.vAdjust=function(v,prep){
	prep = df(prep)?prep:false;
	if(df(v,"number")) this.map(function(e){return e+v});
	else if(df(v,"string"))
	{
		var m=v.match(/^([*/])(\d+(\.\d+)?)$/);
		if(v.match(/^\\([*/])(\d+(\.\d+)?)$/)) v = v.substr(1);
		if(m!=null)
		{
			if(m[1]=='*') this.map(function(e){return e*m[2]});
			if(m[1]=='/') this.map(function(e){return e/m[2]});
		}
		else
		{
			var b=prep?v:'',a=prep?'':v;
			this.map(function(e){return b+e+a});
		}
	}
	else if(df(v,"function")) this.map(v);
	return this._ret(this.o);
}
Obj.prototype.valueOf=function(){return this.o.valueOf();}
Obj.prototype.wrapAll=function(r){this._retWrap=df(r,"boolean",true);return this;}
function O(o){return new Obj(o)}

/**
 * ||| String wrapper for custom prototype functionality |||
 *
 * ----------------------------------------------------------
 *  Usage: S("my string").lower()  - or -  S(strVar).lower()
 * ----------------------------------------------------------
 *
 * Functions available:
 * =====================
 * S(a).lower() - - - - - - (string)	the string in full lowercase
 * S(a).matches(/regex/)  - (bool)		whether the string matches that regex
 * S(a).is(b) - - - - - - - (bool)		whether a equals b (case insensitive), 2nd param false = case sensitive, 3rd param true = strict (===) comparison
 * S(a).len(min,max)  - - - (bool/int)	whether string length between min & max (either optional with null - pass no args to retrieve length)
 * S(a).isIn(b) - - - - - - (bool)		whether b contains a
 * S(a).contains(b) - - - - (bool)		whether a contains b
 * S(a).has(b)  - - - - - - (bool)		alias for .contains
 * S(a).rereplace() - - - - (string)	simplifies code when chaining replaces ( instead of str.replace(a,b).replace(c,d).replace(e,f) do S(str).replace(a,b,c,d,e,f) )
 * S(a).trim()  - - - - - - (string)	the original string with all space characters trimmed from either side params 1&2 are bool for enabling left and right trim respectively. 3rd param is trim char list
 *
 * Includes polyfills for new methods such as quote,startsWith,endsWith,trimLeft,trimRight,toSource
 */
Str=function(s){this.s=s}
Str.prototype=new String;
Str.prototype._ret = function(ret){return this._retWrap&&typeof ret=='string'?S(ret).wrapAll():ret;}
Str.prototype._retWrap = false;
Str.prototype.contains=function(t,p){return this.s.indexOf(t,p)>-1}
Str.prototype.endsWith=function(str,pos){
	if(typeof this.s.endsWith=="function")return this.s.endsWith.call(this.s,str,pos);
	else{pos=pos||this.s.length;pos=pos-str.length;return this.lastIndexOf(str)==pos;}
}
Str.prototype.has=Str.prototype.contains;
Str.prototype.is=function(m,c,s){c=typeof c=="boolean"?c:true;if(m instanceof RegExp){return this.matches(m);}else{return c&&!s?this.lower()==S(m).lower():(s?this.s===m:this.s==m)}}
Str.prototype.isIn=function(ss){return ss.indexOf(this.s)>-1}
Str.prototype.len=function(n,x){if(!n&&!x)return this.s.length;n=n?this.s.length>=n:true;x=x?this.s.length<=x:true;return n&&x}
Str.prototype.log=function(){console.log(this.valueOf())}
Str.prototype.lower=function(){return this._ret(this.toLowerCase())}
Str.prototype.matches=function(r){return r.test(this)}
Str.prototype.quote=function(){
	if(typeof this.s.quote == "function") return this._ret(this.s.quote.call(this.s));
	else return this._ret('"'+this.rereplace(/(["\\])/g,'\\$1',/\r?\n/g,'\\n',/\t/g,'\\t')+'"');
}
Str.prototype.rereplace=function(){var s=this.s;A(O(arguments).toArray()).loop(function(r,i){if(i%2!=0||typeof this[i+1]=="undefined")return;s=s.replace(r,this[i+1]);},arguments);return this._ret(s)}
Str.prototype.startsWith=function(str,pos){
	if(typeof this.s.startsWith=="function")return this.s.startsWith.call(this.s,str,pos);
	else{pos=pos||0;return this.indexOf(str)==pos;}
}
Str.prototype.toSource=function(){return this._ret('"'+this.toString()+'"')}
Str.prototype.toString=function(){return this._ret(this.s ? this.s.toString() : '')}
Str.prototype.trim=function(l,r,c){c=c||'\\s';l=(typeof l)[0]=="u"||l===true?'^['+c+']*':'';r=(typeof r)[0]=="u"||r===true?'['+c+']*$':'';return this._ret(this.s.replace(new RegExp(l+'(.*?)'+r),'$1'))}
Str.prototype.trimLeft=function(c){return this._ret(this.trim(true,false,c))}
Str.prototype.trimRight=function(c){return this._ret(this.trim(false,true,c))}
Str.prototype.valueOf=function(){return this.s.valueOf();}
Str.prototype.wrapAll=function(r){this._retWrap=df(r,"boolean",true);return this;}
function S(s){return new Str(s)}

/**
 * ||| Node wrapper for custom prototype functionality |||
 *
 * ----------------------------------------------------------
 *  Usage: N('#title').remove()  - or -  N(myEl).remove()
 * ----------------------------------------------------------
 *
 * Functions available:
 * =====================
 * N(a).remove() - - - - - - (object)	The removed element
 * N(a).find(b)  - - - - - - (object)	The first matching element, or null if none found
 * N(a).findAll(b) - - - - - (object)	The first matching element, or null if none found
 * N(a).children() - - - - - (array)	The child nodes of a (elements only)
 * N(a).selectContents() - - (null)		Selects the contents of element
 * N(a).hasParent(b) - - - - (bool)		Whether or not a is a child of b
 * N(a).hasClass(b)  - - - - (bool)		Whether or not a has a class of b
 * N(a).isElement()  - - - - (bool)		Whether or not a is a valid element (rather than text/comment node)
 * N(a).index()  - - - - - - (int)		0-based index of a in respect to it's immediate parent node
 * N(a).prev(tag,class)  - - (object)	The previous sibling element with the specified tag and class (both optional for wildcard match)
 * N(a).next(tag,class)  - - (object)	The next sibling element with the specified tag and class (both optional for wildcard match)
 */
Nod=function(e){if(df(e,'string'))e=document.querySelector(e);this.n=e}
Nod.prototype.addClass=function(className){
	var classes = S(this.n.getAttribute('class') || '').trim();	var classNames = classes.replace(/^\s*(.*)\s*$/,'$1').split(' ');
	classNames = A(classNames).filter(function(v){return v!=''}); if(!this.hasClass(className)) classNames.push(className);
	this.n.setAttribute('class',classNames.join(' ')); return this.hasClass(className);
}
Nod.prototype.adj=function(tagName,className,dir) {
	tagName=tagName?tagName.toLowerCase():'';className=className?className:false;
	var nextTag='',happy=false,elem=this.n,dirProp=dir=='prev'?'previousSibling':'nextSibling';
	while(!happy)
	{
		elem=elem[dirProp];if(elem==null){elem=false;break;}nextTag=elem?N(elem).getTagName():'';
		if(nextTag=='')continue; if(tagName=='' || nextTag==tagName) happy = true;
		if(className !== false && happy === true){happy = N(elem).hasClass(className);}
	}
	return elem;
}
Nod.prototype.children=function(){var nodes = this.n.childNodes,ret = []; O(nodes).loop(function(n) { if(n.nodeType==1)ret.push(n); }); return ret;}
Nod.prototype.find=function(s){if(!this.isElement())return null;return this.n.querySelector(s);}
Nod.prototype.findAll=function(s){if(!this.isElement())return {};return this.n.querySelectorAll(s);}
Nod.prototype.getCompStyle=function(style){return this.n.currentStyle?this.n.currentStyle[style]:getComputedStyle(this.n,null)[style];}
Nod.prototype.getPos=function(){
	var posX = this.n.offsetLeft;
	var posY = this.n.offsetTop;
	while(this.n.offsetParent){
		if(this.n == document.getElementsByTagName('body')[0])break;
		else{posX=posX+this.n.offsetParent.offsetLeft;posY=posY+this.n.offsetParent.offsetTop;this.n=this.n.offsetParent;}
	}
	return [posX,posY];
}
Nod.prototype.getTagName=function(){return (!this.n.tagName ? '' : this.n.tagName.toLowerCase());};
Nod.prototype.hasClass=function(className){
	if(arguments.length==1) { return new RegExp('(^|\\s)'+className+'(\\s|$)').test(this.n.className);} else { return O(arguments).toArray().every(function(c){return this.hasClass(c)},this); }
}
Nod.prototype.hasParent=function hasParent(s,testThis)
{
	testThis = df(testThis,'boolean') ? testThis : false; if(df(s,'string')){var t = s.substr(0,1);if(t != '.' && t != '#') t = 'tag';s = s.replace(/^(\.|#)/,'');}
	else{var t = 'node';}var p = testThis ? this.n : this.n.parentNode;
	while(p != null){if(t=='#'&&p.id==s)return true;else if(t=='.'&&N(p).hasClass(s))return true;else if(t=='tag'&&N(p).getTagName()==s)return true;else if(t=='node'&&p==s)return true;p=p.parentNode;}
	return false;
}
Nod.prototype.hide = function() { this.n.style.display='none' }
Nod.prototype.html=function(h){return df(h)?this.n.innerHTML=h:this.n.innerHTML}
Nod.prototype.index=function(){return A(N(this.n.parentNode).children()).indexOf(this.n);}
Nod.prototype.isElement=function(){return this.n&&df(this.n.nodeType)&&this.n.nodeType==1&&this.n.tagName!=''}
Nod.prototype.next=function(tagName,className){return this.adj(tagName,className,'next');}
Nod.prototype.on=function(e,f){addEvent(this.n,e,f)}
Nod.prototype.parent=function(){return this.n.parentNode||false;}
Nod.prototype.prev=function(tagName,className){return this.adj(tagName,className,'prev');}
Nod.prototype.remove=function(){return this.n.parentNode.removeChild(this.n);}
Nod.prototype.removeClass=function(className){
	var classes = S(this.n.getAttribute('class') || '').trim(),i=-1; var classNames = classes.replace(/^\s*(.*)\s*$/,'$1').split(' ');
	classNames = A(classNames).filter(function(v){return v!=''}); if((i=classNames.indexOf(className))>-1) classNames.splice(i,1);
	this.n.setAttribute('class',classNames.join(' ')); return !this.hasClass(className);
}
Nod.prototype.selectContents=function(){
	if(document.body.createTextRange){
        var range = document.body.createTextRange(); range.moveToElementText(this.n);range.select();
    } else if (window.getSelection) { var selection = window.getSelection(),range = document.createRange();
		range.selectNodeContents(this.n);selection.removeAllRanges();selection.addRange(range); }
}
Nod.prototype.setStyles=function(styles){if(this.n.style && df(styles,'object') && O(styles).len>0) O(styles).loop(function(v,k){this.style[k] = v;},this.n,true);}
Nod.prototype.style=function(n,v){ return df(v) ? this.n.style[n]=v : this.getCompStyle(n)}
Nod.prototype.show = function() { this.n.style.display='' }
Nod.prototype.toString=function(){return this.n ? this.n.toString() : ''}
Nod.prototype.toggle=function(){this.n.style.display = (this.n.style.display=='none') ? '' : 'none';}
Nod.prototype.value=function(){return this.n.value;}
Nod.prototype.valueOf=function(){return this.n.valueOf();}
function N(n){return new Nod(n)}

/**
 * ||| Event wrapper for custom prototype functionality |||
 *
 * ----------------------------------------------------
 *  Usage: E(e).target  - or -  E(e).preventDefault()
 * ----------------------------------------------------
 *
 * Functions available:
 * =====================
 * E(e).target - - - - - - - (object)	The event's target element
 * E(e).kill(stopBubble) - - 			Prevent the event's default actions (1st param true stops bubbling)
 * E(e).stopBubble() - - - - 			Allow event's default actions but stop bubbling
 * E(e).which(test)  - - - - (int/bool)	Get the keyCode/button digit (int) - if first param is supplied the function will compare the return value to the test value (boolean)
 */
Evnt=function(e){this.e=e||window.event;this.getTarget();}
Evnt.prototype.target=null;
Evnt.prototype.getTarget=function(){this.target=this.e.srcElement||this.e.target;}
Evnt.prototype.kill=function(stopBubble){
	stopBubble=df(stopBubble,'boolean')?stopBubble:true;
	if(this.e.preventDefault)this.e.preventDefault();else this.e.returnValue=false;
	return stopBubble?this.stopBubble():true;
}
Evnt.prototype.stopBubble=function(){
	if(!this.e.stopPropagation){this.e.cancelBubble=true;return false;}
	else{this.e.stopPropagation();return true;}
}
Evnt.prototype.toString=function(){return this.e?this.e.toString():''}
Evnt.prototype.valueOf=function(){return this.e.valueOf();}
Evnt.prototype.which=function(test){
	if(df(this.e.which))var w=this.e.which;
	else{if(df(this.e.button)&&!(df(this.e.keyCode)&&this.e.keyCode>0)){var w=this.e.button;w=w==0||w==1?1:(w==4?2:3);}else var w=this.e.keyCode;}
	if(df(test)){
		if(df(test,"string")){
			var map = {esc:27,backspace:8,del:46,enter:13,home:36,end:35,pageup:33,pagedown:34,space:32,f1:112,f2:113,left:37,up:38,right:39,down:40};
			if(df(map[S(test).lower()],"number")) test=map[S(test).lower()]; else if(test.match(/^[a-z]$/)) test = 'abcdefghijklmnopqstuvwxyz'.indexOf(test)+65;
			else if(test.match(/^[0-9]$/)) test = parseInt(test)+48;
		}
		return w==test;
	}else return w;
}
function E(e){return new Evnt(e)}

/**
 * ||| Digit wrapper for custom prototype functionality |||
 *
 * ----------------------------------------------------
 *  Usage: D(mynum).round()  - or -  D(8).toPrecision()
 * ----------------------------------------------------
 *
 * Functions available:
 * =====================
 * D(d).isNaN()  - - - - - - (bool)		Whether or not the value is NaN
 * D(d).isFinite() - - - - - (bool)		Whether or not the value is finite
 * D(d).pad(l,s,d) - - - - - (string)	The number, padded to length l, with the string s (default '0'). Puts padding on left, unless d=='r'
 * D(d).round(n,d) - - - - - (number)	The number, rounded to the nearest multiple of n (default 10). Round direction can be forced with 1/'up' or -1/'down'
 * D(d).toPrecision(p) - - - (number)	The number (d) to the specified precision (p)
 */
Dig=function(d){this.d=d.valueOf()}
Dig.prototype = new Number;
Dig.prototype._ret = function(ret){return this._retWrap&&typeof ret=='number'?D(ret).wrapAll():ret;}
Dig.prototype._retWrap = true;
Dig.prototype.precision = 8;
Dig.prototype.isFinite=function(){return !isNaN(this.d)&&this.d!=Infinity&&this.d!=-Infinity&&typeof this.d=='number'}
Dig.prototype.isInteger=function(){return df(this.d.isInteger,'function')?this.d.isInteger():(typeof this.d=="number"&&this.isFinite()&&Math.floor(this.d)===this.d)}
Dig.prototype.isNaN=function(){return isNaN(this.d)}
Dig.prototype.pad=function(l,s,d){var r=this.toString(),s=s||'0';while(r.length<l){r=d=='r'?r+s:s+r}return r}
Dig.prototype.parseFloat=Dig.prototype.asFloat=function(){return this._ret(parseFloat(this.d))}
Dig.prototype.parseInt=Dig.prototype.asInt=function(r){return this._ret(parseInt(this.d,df(r,'number',10)))}
Dig.prototype.round=function(n,d){
	n=df(n,'number',10);d=[-1,1,'down','up'].indexOf(d)>-1?d:0;if(d==-1||d=='down')this.d=n*Math.floor(this.d/n);
	else if(d==1||d=='up')this.d=n*Math.ceil(this.d/n);else this.d=n*Math.round(this.d/n);return this._ret(this.d);
}
Dig.prototype.toInteger=Dig.prototype.toInt=function(){var ret=this.isFinite()?ret:this.asInt();return this._ret(D(ret).isNaN()?0:ret)}
Dig.prototype.toPrecision=function(p){p=df(p)?p:this.precision;return this._ret(this.d.toPrecision(p));}
Dig.prototype.toString=function(){return this.d.toString()}
Dig.prototype.valueOf=function(){return this.d.valueOf()}
Dig.prototype.wrapAll=function(r){this._retWrap=df(r,"boolean",true);return this;}
function D(d){return new Dig(d)}


//Generic instantiator
function P(v){if(v instanceof Array)return A(v);else if(v instanceof Object)return O(v);else if(typeof v == "string")return S(v);else if(v instanceof Node)return N(v);else if(v instanceof Event)return E(v);return null;}


function InheritFrom(o1,o2)
{
	if(typeof o2 == "function"){o1.prototype = new o2;o1.prototype.parent = o2.prototype;}
	else{o1.prototype = o2;o1.prototype.parent = o2;}
	o1.prototype.constructor = o1;
	o1.prototype.store = o1.prototype.constructor;
}
Function.prototype.inheritFrom=function(o){InheritFrom(this,o);}
Function.prototype._ext=function(){A(O(arguments).toArray()).loop(function(o){InheritFrom(o,this)},this);}
Function.prototype.throttle=function(w,i){var t,r=true,f=this,i=(typeof i)[0]=='b'?i:true;return function(){var c=this,a=arguments;if(r){if(i)f.apply(c,a);r=false;t=setTimeout(function(){r=true;if(!i)f.apply(c,a)},w)}}}
Function.prototype.debounce=function(b,c){var d,a=this;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}



/**
 * ||| Useful functions |||
 */
function addEvent(o,e,f){if(e instanceof Array){A(e).loop(function(a){addEvent(o,a,f)});return;}e=e.replace(/^on/,'');if(typeof f!=='function'){return false;}if(o.addEventListener){return o.addEventListener(e,f,false);}else return o.attachEvent("on"+e,f);}
function addOnload(myfunc){addEvent(window,'onload',myfunc);}
function df(v,t,d){var r=typeof t=="undefined"?typeof v!="undefined":typeof v==t;if(typeof d!=='undefined')return r?v:d;else return r;}
function getEvent(e){e=e||window.event;e.target=e.srcElement||e.target;return e;}