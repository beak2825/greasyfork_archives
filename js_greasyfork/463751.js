// ==UserScript==
// @name         SCP-JP: Anti Alias M Plus for Black Highlighter
// @namespace    https://junjo-ponpo.com/
// @version      1.0.0
// @description  Black Highlighter における M Plus フォントのジャギーを解消します
// @author       BlueRayi
// @match        *://scp-jp.wikidot.com/*
// @icon         https://scp-wiki.wikidot.com/local--favicon/favicon.gif
// @grant        none
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/463751/SCP-JP%3A%20Anti%20Alias%20M%20Plus%20for%20Black%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/463751/SCP-JP%3A%20Anti%20Alias%20M%20Plus%20for%20Black%20Highlighter.meta.js
// ==/UserScript==

(function dartProgram(){function copyProperties(a,b){var t=Object.keys(a)
for(var s=0;s<t.length;s++){var r=t[s]
b[r]=a[r]}}function mixinPropertiesHard(a,b){var t=Object.keys(a)
for(var s=0;s<t.length;s++){var r=t[s]
if(!b.hasOwnProperty(r))b[r]=a[r]}}function mixinPropertiesEasy(a,b){Object.assign(b,a)}var z=function(){var t=function(){}
t.prototype={p:{}}
var s=new t()
if(!(s.__proto__&&s.__proto__.p===t.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var r=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(r))return true}}catch(q){}return false}()
function inherit(a,b){a.prototype.constructor=a
a.prototype["$i"+a.name]=a
if(b!=null){if(z){a.prototype.__proto__=b.prototype
return}var t=Object.create(b.prototype)
copyProperties(a.prototype,t)
a.prototype=t}}function inheritMany(a,b){for(var t=0;t<b.length;t++)inherit(b[t],a)}function mixinEasy(a,b){mixinPropertiesEasy(b.prototype,a.prototype)
a.prototype.constructor=a}function mixinHard(a,b){mixinPropertiesHard(b.prototype,a.prototype)
a.prototype.constructor=a}function lazyOld(a,b,c,d){var t=a
a[b]=t
a[c]=function(){a[c]=function(){A.dR(b)}
var s
var r=d
try{if(a[b]===t){s=a[b]=r
s=a[b]=d()}else s=a[b]}finally{if(s===r)a[b]=null
a[c]=function(){return this[b]}}return s}}function lazy(a,b,c,d){var t=a
a[b]=t
a[c]=function(){if(a[b]===t)a[b]=d()
a[c]=function(){return this[b]}
return a[b]}}function lazyFinal(a,b,c,d){var t=a
a[b]=t
a[c]=function(){if(a[b]===t){var s=d()
if(a[b]!==t)A.dS(b)
a[b]=s}var r=a[b]
a[c]=function(){return r}
return r}}function makeConstList(a){a.immutable$list=Array
a.fixed$length=Array
return a}function convertToFastObject(a){function t(){}t.prototype=a
new t()
return a}function convertAllToFastObject(a){for(var t=0;t<a.length;++t)convertToFastObject(a[t])}var y=0
function instanceTearOffGetter(a,b){var t=null
return a?function(c){if(t===null)t=A.bt(b)
return new t(c,this)}:function(){if(t===null)t=A.bt(b)
return new t(this,null)}}function staticTearOffGetter(a){var t=null
return function(){if(t===null)t=A.bt(a).prototype
return t}}var x=0
function tearOffParameters(a,b,c,d,e,f,g,h,i,j){if(typeof h=="number")h+=x
return{co:a,iS:b,iI:c,rC:d,dV:e,cs:f,fs:g,fT:h,aI:i||0,nDA:j}}function installStaticTearOff(a,b,c,d,e,f,g,h){var t=tearOffParameters(a,true,false,c,d,e,f,g,h,false)
var s=staticTearOffGetter(t)
a[b]=s}function installInstanceTearOff(a,b,c,d,e,f,g,h,i,j){c=!!c
var t=tearOffParameters(a,false,c,d,e,f,g,h,i,!!j)
var s=instanceTearOffGetter(c,t)
a[b]=s}function setOrUpdateInterceptorsByTag(a){var t=v.interceptorsByTag
if(!t){v.interceptorsByTag=a
return}copyProperties(a,t)}function setOrUpdateLeafTags(a){var t=v.leafTags
if(!t){v.leafTags=a
return}copyProperties(a,t)}function updateTypes(a){var t=v.types
var s=t.length
t.push.apply(t,a)
return s}function updateHolder(a,b){copyProperties(b,a)
return a}var hunkHelpers=function(){var t=function(a,b,c,d,e){return function(f,g,h,i){return installInstanceTearOff(f,g,a,b,c,d,[h],i,e,false)}},s=function(a,b,c,d){return function(e,f,g,h){return installStaticTearOff(e,f,a,b,c,[g],h,d)}}
return{inherit:inherit,inheritMany:inheritMany,mixin:mixinEasy,mixinHard:mixinHard,installStaticTearOff:installStaticTearOff,installInstanceTearOff:installInstanceTearOff,_instance_0u:t(0,0,null,["$0"],0),_instance_1u:t(0,1,null,["$1"],0),_instance_2u:t(0,2,null,["$2"],0),_instance_0i:t(1,0,null,["$0"],0),_instance_1i:t(1,1,null,["$1"],0),_instance_2i:t(1,2,null,["$2"],0),_static_0:s(0,null,["$0"],0),_static_1:s(1,null,["$1"],0),_static_2:s(2,null,["$2"],0),makeConstList:makeConstList,lazy:lazy,lazyFinal:lazyFinal,lazyOld:lazyOld,updateHolder:updateHolder,convertToFastObject:convertToFastObject,updateTypes:updateTypes,setOrUpdateInterceptorsByTag:setOrUpdateInterceptorsByTag,setOrUpdateLeafTags:setOrUpdateLeafTags}}()
function initializeDeferredHunk(a){x=v.types.length
a(hunkHelpers,v,w,$)}var A={bk:function bk(){},
dw(a,b,c){return a},
aT:function aT(a){this.a=a},
ac:function ac(a,b){var _=this
_.a=a
_.b=b
_.c=0
_.d=null},
ad:function ad(a,b){this.a=a
this.b=b},
ae:function ae(a,b){this.a=null
this.b=a
this.c=b},
ak:function ak(a,b){this.a=a
this.b=b},
al:function al(a,b){this.a=a
this.b=b},
cm(a){var t=v.mangledGlobalNames[a]
if(t!=null)return t
return"minified:"+a},
dI(a,b){var t
if(b!=null){t=b.x
if(t!=null)return t}return u.p.b(a)},
h(a){var t
if(typeof a=="string")return a
if(typeof a=="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
t=J.ay(a)
return t},
ag(a){var t,s=$.bQ
if(s==null)s=$.bQ=Symbol("identityHashCode")
t=a[s]
if(t==null){t=Math.random()*0x3fffffff|0
a[s]=t}return t},
aV(a){return A.cM(a)},
cM(a){var t,s,r,q
if(a instanceof A.j)return A.l(A.ax(a),null)
t=J.K(a)
if(t===B.o||t===B.r||u.o.b(a)){s=B.c(a)
if(s!=="Object"&&s!=="")return s
r=a.constructor
if(typeof r=="function"){q=r.name
if(typeof q=="string"&&q!=="Object"&&q!=="")return q}}return A.l(A.ax(a),null)},
bu(a,b){var t,s="index"
if(!A.cb(b))return new A.L(!0,b,s,null)
t=J.bh(a)
if(b<0||b>=t)return A.O(b,t,a,s)
return new A.ah(null,null,!0,b,s,"Value not in range")},
c(a){var t,s
if(a==null)a=new A.aU()
t=new Error()
t.dartException=a
s=A.dT
if("defineProperty" in Object){Object.defineProperty(t,"message",{get:s})
t.name=""}else t.toString=s
return t},
dT(){return J.ay(this.dartException)},
by(a){throw A.c(a)},
dQ(a){throw A.c(A.a6(a))},
dO(a){if(a==null||typeof a!="object")return J.bB(a)
else return A.ag(a)},
dz(a,b){var t,s=a.length
for(t=0;t<s;++t)b.B(0,a[t])
return b},
cE(a1){var t,s,r,q,p,o,n,m,l,k,j=a1.co,i=a1.iS,h=a1.iI,g=a1.nDA,f=a1.aI,e=a1.fs,d=a1.cs,c=e[0],b=d[0],a=j[c],a0=a1.fT
a0.toString
t=i?Object.create(new A.aX().constructor.prototype):Object.create(new A.M(null,null).constructor.prototype)
t.$initialize=t.constructor
if(i)s=function static_tear_off(){this.$initialize()}
else s=function tear_off(a2,a3){this.$initialize(a2,a3)}
t.constructor=s
s.prototype=t
t.$_name=c
t.$_target=a
r=!i
if(r)q=A.bI(c,a,h,g)
else{t.$static_name=c
q=a}t.$S=A.cA(a0,i,h)
t[b]=q
for(p=q,o=1;o<e.length;++o){n=e[o]
if(typeof n=="string"){m=j[n]
l=n
n=m}else l=""
k=d[o]
if(k!=null){if(r)n=A.bI(l,n,h,g)
t[k]=n}if(o===f)p=n}t.$C=p
t.$R=a1.rC
t.$D=a1.dV
return s},
cA(a,b,c){if(typeof a=="number")return a
if(typeof a=="string"){if(b)throw A.c("Cannot compute signature for static tearoff.")
return function(d,e){return function(){return e(this,d)}}(a,A.cy)}throw A.c("Error in functionType of tearoff")},
cB(a,b,c,d){var t=A.bH
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,t)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,t)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,t)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,t)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,t)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,t)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,t)}},
bI(a,b,c,d){var t,s
if(c)return A.cD(a,b,d)
t=b.length
s=A.cB(t,d,a,b)
return s},
cC(a,b,c,d){var t=A.bH,s=A.cz
switch(b?-1:a){case 0:throw A.c(new A.aW("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,s,t)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,s,t)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,s,t)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,s,t)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,s,t)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,s,t)
default:return function(e,f,g){return function(){var r=[g(this)]
Array.prototype.push.apply(r,arguments)
return e.apply(f(this),r)}}(d,s,t)}},
cD(a,b,c){var t,s
if($.bF==null)$.bF=A.bE("interceptor")
if($.bG==null)$.bG=A.bE("receiver")
t=b.length
s=A.cC(t,c,a,b)
return s},
bt(a){return A.cE(a)},
cy(a,b){return A.b7(v.typeUniverse,A.ax(a.a),b)},
bH(a){return a.a},
cz(a){return a.b},
bE(a){var t,s,r,q=new A.M("receiver","interceptor"),p=J.bL(Object.getOwnPropertyNames(q))
for(t=p.length,s=0;s<t;++s){r=p[s]
if(q[r]===a)return r}throw A.c(A.bD("Field name "+a+" not found."))},
dR(a){throw A.c(new A.aF(a))},
dC(a){return v.getIsolateTag(a)},
er(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
dK(a){var t,s,r,q,p,o=$.ci.$1(a),n=$.b9[o]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.be[o]
if(t!=null)return t
s=v.interceptorsByTag[o]
if(s==null){r=$.ce.$2(a,o)
if(r!=null){n=$.b9[r]
if(n!=null){Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}t=$.be[r]
if(t!=null)return t
s=v.interceptorsByTag[r]
o=r}}if(s==null)return null
t=s.prototype
q=o[0]
if(q==="!"){n=A.bf(t)
$.b9[o]=n
Object.defineProperty(a,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
return n.i}if(q==="~"){$.be[o]=t
return t}if(q==="-"){p=A.bf(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}if(q==="+")return A.ck(a,t)
if(q==="*")throw A.c(A.bX(o))
if(v.leafTags[o]===true){p=A.bf(t)
Object.defineProperty(Object.getPrototypeOf(a),v.dispatchPropertyName,{value:p,enumerable:false,writable:true,configurable:true})
return p.i}else return A.ck(a,t)},
ck(a,b){var t=Object.getPrototypeOf(a)
Object.defineProperty(t,v.dispatchPropertyName,{value:J.bx(b,t,null,null),enumerable:false,writable:true,configurable:true})
return b},
bf(a){return J.bx(a,!1,null,!!a.$iG)},
dM(a,b,c){var t=b.prototype
if(v.leafTags[a]===true)return A.bf(t)
else return J.bx(t,c,null,null)},
dF(){if(!0===$.bw)return
$.bw=!0
A.dG()},
dG(){var t,s,r,q,p,o,n,m
$.b9=Object.create(null)
$.be=Object.create(null)
A.dE()
t=v.interceptorsByTag
s=Object.getOwnPropertyNames(t)
if(typeof window!="undefined"){window
r=function(){}
for(q=0;q<s.length;++q){p=s[q]
o=$.cl.$1(p)
if(o!=null){n=A.dM(p,t[p],o)
if(n!=null){Object.defineProperty(o,v.dispatchPropertyName,{value:n,enumerable:false,writable:true,configurable:true})
r.prototype=o}}}}for(q=0;q<s.length;++q){p=s[q]
if(/^[A-Za-z_]/.test(p)){m=t[p]
t["!"+p]=m
t["~"+p]=m
t["-"+p]=m
t["+"+p]=m
t["*"+p]=m}}},
dE(){var t,s,r,q,p,o,n=B.h()
n=A.J(B.i,A.J(B.j,A.J(B.d,A.J(B.d,A.J(B.k,A.J(B.l,A.J(B.m(B.c),n)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){t=dartNativeDispatchHooksTransformer
if(typeof t=="function")t=[t]
if(t.constructor==Array)for(s=0;s<t.length;++s){r=t[s]
if(typeof r=="function")n=r(n)||n}}q=n.getTag
p=n.getUnknownTag
o=n.prototypeForTag
$.ci=new A.bb(q)
$.ce=new A.bc(p)
$.cl=new A.bd(o)},
J(a,b){return a(b)||b},
dP(a,b,c){var t=a.indexOf(b,c)
return t>=0},
C:function C(){},
aB:function aB(){},
aZ:function aZ(){},
aX:function aX(){},
M:function M(a,b){this.a=a
this.b=b},
aW:function aW(a){this.a=a},
bb:function bb(a){this.a=a},
bc:function bc(a){this.a=a},
bd:function bd(a){this.a=a},
bU(a,b){var t=b.c
return t==null?b.c=A.bq(a,b.y,!0):t},
bT(a,b){var t=b.c
return t==null?b.c=A.Y(a,"bJ",[b.y]):t},
bV(a){var t=a.x
if(t===6||t===7||t===8)return A.bV(a.y)
return t===12||t===13},
cN(a){return a.at},
dA(a){return A.br(v.typeUniverse,a,!1)},
w(a,b,c,a0){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d=b.x
switch(d){case 5:case 1:case 2:case 3:case 4:return b
case 6:t=b.y
s=A.w(a,t,c,a0)
if(s===t)return b
return A.c4(a,s,!0)
case 7:t=b.y
s=A.w(a,t,c,a0)
if(s===t)return b
return A.bq(a,s,!0)
case 8:t=b.y
s=A.w(a,t,c,a0)
if(s===t)return b
return A.c3(a,s,!0)
case 9:r=b.z
q=A.a0(a,r,c,a0)
if(q===r)return b
return A.Y(a,b.y,q)
case 10:p=b.y
o=A.w(a,p,c,a0)
n=b.z
m=A.a0(a,n,c,a0)
if(o===p&&m===n)return b
return A.bo(a,o,m)
case 12:l=b.y
k=A.w(a,l,c,a0)
j=b.z
i=A.dr(a,j,c,a0)
if(k===l&&i===j)return b
return A.c2(a,k,i)
case 13:h=b.z
a0+=h.length
g=A.a0(a,h,c,a0)
p=b.y
o=A.w(a,p,c,a0)
if(g===h&&o===p)return b
return A.bp(a,o,g,!0)
case 14:f=b.y
if(f<a0)return b
e=c[f-a0]
if(e==null)return b
return e
default:throw A.c(A.a5("Attempted to substitute unexpected RTI kind "+d))}},
a0(a,b,c,d){var t,s,r,q,p=b.length,o=A.b8(p)
for(t=!1,s=0;s<p;++s){r=b[s]
q=A.w(a,r,c,d)
if(q!==r)t=!0
o[s]=q}return t?o:b},
ds(a,b,c,d){var t,s,r,q,p,o,n=b.length,m=A.b8(n)
for(t=!1,s=0;s<n;s+=3){r=b[s]
q=b[s+1]
p=b[s+2]
o=A.w(a,p,c,d)
if(o!==p)t=!0
m.splice(s,3,r,q,o)}return t?m:b},
dr(a,b,c,d){var t,s=b.a,r=A.a0(a,s,c,d),q=b.b,p=A.a0(a,q,c,d),o=b.c,n=A.ds(a,o,c,d)
if(r===s&&p===q&&n===o)return b
t=new A.an()
t.a=r
t.b=p
t.c=n
return t},
dx(a){var t,s=a.$S
if(s!=null){if(typeof s=="number")return A.dD(s)
t=a.$S()
return t}return null},
cj(a,b){var t
if(A.bV(b))if(a instanceof A.C){t=A.dx(a)
if(t!=null)return t}return A.ax(a)},
ax(a){var t
if(a instanceof A.j){t=a.$ti
return t!=null?t:A.bs(a)}if(Array.isArray(a))return A.d6(a)
return A.bs(J.K(a))},
d6(a){var t=a[v.arrayRti],s=u.b
if(t==null)return s
if(t.constructor!==s.constructor)return s
return t},
p(a){var t=a.$ti
return t!=null?t:A.bs(a)},
bs(a){var t=a.constructor,s=t.$ccache
if(s!=null)return s
return A.df(a,t)},
df(a,b){var t=a instanceof A.C?a.__proto__.__proto__.constructor:b,s=A.d4(v.typeUniverse,t.name)
b.$ccache=s
return s},
dD(a){var t,s=v.types,r=s[a]
if(typeof r=="string"){t=A.br(v.typeUniverse,r,!1)
s[a]=t
return t}return r},
de(a){var t,s,r,q,p=this
if(p===u.K)return A.I(p,a,A.dj)
if(!A.u(p))if(!(p===u._))t=!1
else t=!0
else t=!0
if(t)return A.I(p,a,A.dn)
t=p.x
s=t===6?p.y:p
if(s===u.S)r=A.cb
else if(s===u.i||s===u.H)r=A.di
else if(s===u.N)r=A.dl
else r=s===u.y?A.c9:null
if(r!=null)return A.I(p,a,r)
if(s.x===9){q=s.y
if(s.z.every(A.dJ)){p.r="$i"+q
if(q==="cK")return A.I(p,a,A.dh)
return A.I(p,a,A.dm)}}else if(t===7)return A.I(p,a,A.dc)
return A.I(p,a,A.da)},
I(a,b,c){a.b=c
return a.b(b)},
dd(a){var t,s=this,r=A.d9
if(!A.u(s))if(!(s===u._))t=!1
else t=!0
else t=!0
if(t)r=A.d8
else if(s===u.K)r=A.d7
else{t=A.a2(s)
if(t)r=A.db}s.a=r
return s.a(a)},
aw(a){var t,s=a.x
if(!A.u(a))if(!(a===u._))if(!(a===u.A))if(s!==7)if(!(s===6&&A.aw(a.y)))t=s===8&&A.aw(a.y)||a===u.P||a===u.T
else t=!0
else t=!0
else t=!0
else t=!0
else t=!0
return t},
da(a){var t=this
if(a==null)return A.aw(t)
return A.e(v.typeUniverse,A.cj(a,t),null,t,null)},
dc(a){if(a==null)return!0
return this.y.b(a)},
dm(a){var t,s=this
if(a==null)return A.aw(s)
t=s.r
if(a instanceof A.j)return!!a[t]
return!!J.K(a)[t]},
dh(a){var t,s=this
if(a==null)return A.aw(s)
if(typeof a!="object")return!1
if(Array.isArray(a))return!0
t=s.r
if(a instanceof A.j)return!!a[t]
return!!J.K(a)[t]},
d9(a){var t,s=this
if(a==null){t=A.a2(s)
if(t)return a}else if(s.b(a))return a
A.c7(a,s)},
db(a){var t=this
if(a==null)return a
else if(t.b(a))return a
A.c7(a,t)},
c7(a,b){throw A.c(A.cU(A.bY(a,A.cj(a,b),A.l(b,null))))},
bY(a,b,c){var t=A.aJ(a)
return t+": type '"+A.l(b==null?A.ax(a):b,null)+"' is not a subtype of type '"+c+"'"},
cU(a){return new A.at("TypeError: "+a)},
k(a,b){return new A.at("TypeError: "+A.bY(a,null,b))},
dj(a){return a!=null},
d7(a){if(a!=null)return a
throw A.c(A.k(a,"Object"))},
dn(a){return!0},
d8(a){return a},
c9(a){return!0===a||!1===a},
ec(a){if(!0===a)return!0
if(!1===a)return!1
throw A.c(A.k(a,"bool"))},
ee(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.c(A.k(a,"bool"))},
ed(a){if(!0===a)return!0
if(!1===a)return!1
if(a==null)return a
throw A.c(A.k(a,"bool?"))},
ef(a){if(typeof a=="number")return a
throw A.c(A.k(a,"double"))},
eh(a){if(typeof a=="number")return a
if(a==null)return a
throw A.c(A.k(a,"double"))},
eg(a){if(typeof a=="number")return a
if(a==null)return a
throw A.c(A.k(a,"double?"))},
cb(a){return typeof a=="number"&&Math.floor(a)===a},
ei(a){if(typeof a=="number"&&Math.floor(a)===a)return a
throw A.c(A.k(a,"int"))},
ek(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.c(A.k(a,"int"))},
ej(a){if(typeof a=="number"&&Math.floor(a)===a)return a
if(a==null)return a
throw A.c(A.k(a,"int?"))},
di(a){return typeof a=="number"},
el(a){if(typeof a=="number")return a
throw A.c(A.k(a,"num"))},
en(a){if(typeof a=="number")return a
if(a==null)return a
throw A.c(A.k(a,"num"))},
em(a){if(typeof a=="number")return a
if(a==null)return a
throw A.c(A.k(a,"num?"))},
dl(a){return typeof a=="string"},
eo(a){if(typeof a=="string")return a
throw A.c(A.k(a,"String"))},
eq(a){if(typeof a=="string")return a
if(a==null)return a
throw A.c(A.k(a,"String"))},
ep(a){if(typeof a=="string")return a
if(a==null)return a
throw A.c(A.k(a,"String?"))},
cd(a,b){var t,s,r
for(t="",s="",r=0;r<a.length;++r,s=", ")t+=s+A.l(a[r],b)
return t},
dq(a,b){var t,s,r,q,p,o,n=a.y,m=a.z
if(""===n)return"("+A.cd(m,b)+")"
t=m.length
s=n.split(",")
r=s.length-t
for(q="(",p="",o=0;o<t;++o,p=", "){q+=p
if(r===0)q+="{"
q+=A.l(m[o],b)
if(r>=0)q+=" "+s[r];++r}return q+"})"},
c8(a2,a3,a4){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1=", "
if(a4!=null){t=a4.length
if(a3==null){a3=[]
s=null}else s=a3.length
r=a3.length
for(q=t;q>0;--q)a3.push("T"+(r+q))
for(p=u.X,o=u._,n="<",m="",q=0;q<t;++q,m=a1){n=B.a.S(n+m,a3[a3.length-1-q])
l=a4[q]
k=l.x
if(!(k===2||k===3||k===4||k===5||l===p))if(!(l===o))j=!1
else j=!0
else j=!0
if(!j)n+=" extends "+A.l(l,a3)}n+=">"}else{n=""
s=null}p=a2.y
i=a2.z
h=i.a
g=h.length
f=i.b
e=f.length
d=i.c
c=d.length
b=A.l(p,a3)
for(a="",a0="",q=0;q<g;++q,a0=a1)a+=a0+A.l(h[q],a3)
if(e>0){a+=a0+"["
for(a0="",q=0;q<e;++q,a0=a1)a+=a0+A.l(f[q],a3)
a+="]"}if(c>0){a+=a0+"{"
for(a0="",q=0;q<c;q+=3,a0=a1){a+=a0
if(d[q+1])a+="required "
a+=A.l(d[q+2],a3)+" "+d[q]}a+="}"}if(s!=null){a3.toString
a3.length=s}return n+"("+a+") => "+b},
l(a,b){var t,s,r,q,p,o,n=a.x
if(n===5)return"erased"
if(n===2)return"dynamic"
if(n===3)return"void"
if(n===1)return"Never"
if(n===4)return"any"
if(n===6){t=A.l(a.y,b)
return t}if(n===7){s=a.y
t=A.l(s,b)
r=s.x
return(r===12||r===13?"("+t+")":t)+"?"}if(n===8)return"FutureOr<"+A.l(a.y,b)+">"
if(n===9){q=A.dt(a.y)
p=a.z
return p.length>0?q+("<"+A.cd(p,b)+">"):q}if(n===11)return A.dq(a,b)
if(n===12)return A.c8(a,b,null)
if(n===13)return A.c8(a.y,b,a.z)
if(n===14){o=a.y
return b[b.length-1-o]}return"?"},
dt(a){var t=v.mangledGlobalNames[a]
if(t!=null)return t
return"minified:"+a},
d5(a,b){var t=a.tR[b]
for(;typeof t=="string";)t=a.tR[t]
return t},
d4(a,b){var t,s,r,q,p,o=a.eT,n=o[b]
if(n==null)return A.br(a,b,!1)
else if(typeof n=="number"){t=n
s=A.Z(a,5,"#")
r=A.b8(t)
for(q=0;q<t;++q)r[q]=s
p=A.Y(a,b,r)
o[b]=p
return p}else return n},
d2(a,b){return A.c5(a.tR,b)},
d1(a,b){return A.c5(a.eT,b)},
br(a,b,c){var t,s=a.eC,r=s.get(b)
if(r!=null)return r
t=A.c1(A.c_(a,null,b,c))
s.set(b,t)
return t},
b7(a,b,c){var t,s,r=b.Q
if(r==null)r=b.Q=new Map()
t=r.get(c)
if(t!=null)return t
s=A.c1(A.c_(a,b,c,!0))
r.set(c,s)
return s},
d3(a,b,c){var t,s,r,q=b.as
if(q==null)q=b.as=new Map()
t=c.at
s=q.get(t)
if(s!=null)return s
r=A.bo(a,b,c.x===10?c.z:[c])
q.set(t,r)
return r},
t(a,b){b.a=A.dd
b.b=A.de
return b},
Z(a,b,c){var t,s,r=a.eC.get(c)
if(r!=null)return r
t=new A.m(null,null)
t.x=b
t.at=c
s=A.t(a,t)
a.eC.set(c,s)
return s},
c4(a,b,c){var t,s=b.at+"*",r=a.eC.get(s)
if(r!=null)return r
t=A.cZ(a,b,s,c)
a.eC.set(s,t)
return t},
cZ(a,b,c,d){var t,s,r
if(d){t=b.x
if(!A.u(b))s=b===u.P||b===u.T||t===7||t===6
else s=!0
if(s)return b}r=new A.m(null,null)
r.x=6
r.y=b
r.at=c
return A.t(a,r)},
bq(a,b,c){var t,s=b.at+"?",r=a.eC.get(s)
if(r!=null)return r
t=A.cY(a,b,s,c)
a.eC.set(s,t)
return t},
cY(a,b,c,d){var t,s,r,q
if(d){t=b.x
if(!A.u(b))if(!(b===u.P||b===u.T))if(t!==7)s=t===8&&A.a2(b.y)
else s=!0
else s=!0
else s=!0
if(s)return b
else if(t===1||b===u.A)return u.P
else if(t===6){r=b.y
if(r.x===8&&A.a2(r.y))return r
else return A.bU(a,b)}}q=new A.m(null,null)
q.x=7
q.y=b
q.at=c
return A.t(a,q)},
c3(a,b,c){var t,s=b.at+"/",r=a.eC.get(s)
if(r!=null)return r
t=A.cW(a,b,s,c)
a.eC.set(s,t)
return t},
cW(a,b,c,d){var t,s,r
if(d){t=b.x
if(!A.u(b))if(!(b===u._))s=!1
else s=!0
else s=!0
if(s||b===u.K)return b
else if(t===1)return A.Y(a,"bJ",[b])
else if(b===u.P||b===u.T)return u.O}r=new A.m(null,null)
r.x=8
r.y=b
r.at=c
return A.t(a,r)},
d_(a,b){var t,s,r=""+b+"^",q=a.eC.get(r)
if(q!=null)return q
t=new A.m(null,null)
t.x=14
t.y=b
t.at=r
s=A.t(a,t)
a.eC.set(r,s)
return s},
X(a){var t,s,r,q=a.length
for(t="",s="",r=0;r<q;++r,s=",")t+=s+a[r].at
return t},
cV(a){var t,s,r,q,p,o=a.length
for(t="",s="",r=0;r<o;r+=3,s=","){q=a[r]
p=a[r+1]?"!":":"
t+=s+q+p+a[r+2].at}return t},
Y(a,b,c){var t,s,r,q=b
if(c.length>0)q+="<"+A.X(c)+">"
t=a.eC.get(q)
if(t!=null)return t
s=new A.m(null,null)
s.x=9
s.y=b
s.z=c
if(c.length>0)s.c=c[0]
s.at=q
r=A.t(a,s)
a.eC.set(q,r)
return r},
bo(a,b,c){var t,s,r,q,p,o
if(b.x===10){t=b.y
s=b.z.concat(c)}else{s=c
t=b}r=t.at+(";<"+A.X(s)+">")
q=a.eC.get(r)
if(q!=null)return q
p=new A.m(null,null)
p.x=10
p.y=t
p.z=s
p.at=r
o=A.t(a,p)
a.eC.set(r,o)
return o},
d0(a,b,c){var t,s,r="+"+(b+"("+A.X(c)+")"),q=a.eC.get(r)
if(q!=null)return q
t=new A.m(null,null)
t.x=11
t.y=b
t.z=c
t.at=r
s=A.t(a,t)
a.eC.set(r,s)
return s},
c2(a,b,c){var t,s,r,q,p,o=b.at,n=c.a,m=n.length,l=c.b,k=l.length,j=c.c,i=j.length,h="("+A.X(n)
if(k>0){t=m>0?",":""
h+=t+"["+A.X(l)+"]"}if(i>0){t=m>0?",":""
h+=t+"{"+A.cV(j)+"}"}s=o+(h+")")
r=a.eC.get(s)
if(r!=null)return r
q=new A.m(null,null)
q.x=12
q.y=b
q.z=c
q.at=s
p=A.t(a,q)
a.eC.set(s,p)
return p},
bp(a,b,c,d){var t,s=b.at+("<"+A.X(c)+">"),r=a.eC.get(s)
if(r!=null)return r
t=A.cX(a,b,c,s,d)
a.eC.set(s,t)
return t},
cX(a,b,c,d,e){var t,s,r,q,p,o,n,m
if(e){t=c.length
s=A.b8(t)
for(r=0,q=0;q<t;++q){p=c[q]
if(p.x===1){s[q]=p;++r}}if(r>0){o=A.w(a,b,s,0)
n=A.a0(a,c,s,0)
return A.bp(a,o,n,c!==n)}}m=new A.m(null,null)
m.x=13
m.y=b
m.z=c
m.at=d
return A.t(a,m)},
c_(a,b,c,d){return{u:a,e:b,r:c,s:[],p:0,n:d}},
c1(a){var t,s,r,q,p,o,n,m,l,k=a.r,j=a.s
for(t=k.length,s=0;s<t;){r=k.charCodeAt(s)
if(r>=48&&r<=57)s=A.cQ(s+1,r,k,j)
else if((((r|32)>>>0)-97&65535)<26||r===95||r===36||r===124)s=A.c0(a,s,k,j,!1)
else if(r===46)s=A.c0(a,s,k,j,!0)
else{++s
switch(r){case 44:break
case 58:j.push(!1)
break
case 33:j.push(!0)
break
case 59:j.push(A.v(a.u,a.e,j.pop()))
break
case 94:j.push(A.d_(a.u,j.pop()))
break
case 35:j.push(A.Z(a.u,5,"#"))
break
case 64:j.push(A.Z(a.u,2,"@"))
break
case 126:j.push(A.Z(a.u,3,"~"))
break
case 60:j.push(a.p)
a.p=j.length
break
case 62:q=a.u
p=j.splice(a.p)
A.bn(a.u,a.e,p)
a.p=j.pop()
o=j.pop()
if(typeof o=="string")j.push(A.Y(q,o,p))
else{n=A.v(q,a.e,o)
switch(n.x){case 12:j.push(A.bp(q,n,p,a.n))
break
default:j.push(A.bo(q,n,p))
break}}break
case 38:A.cR(a,j)
break
case 42:q=a.u
j.push(A.c4(q,A.v(q,a.e,j.pop()),a.n))
break
case 63:q=a.u
j.push(A.bq(q,A.v(q,a.e,j.pop()),a.n))
break
case 47:q=a.u
j.push(A.c3(q,A.v(q,a.e,j.pop()),a.n))
break
case 40:j.push(-3)
j.push(a.p)
a.p=j.length
break
case 41:A.cP(a,j)
break
case 91:j.push(a.p)
a.p=j.length
break
case 93:p=j.splice(a.p)
A.bn(a.u,a.e,p)
a.p=j.pop()
j.push(p)
j.push(-1)
break
case 123:j.push(a.p)
a.p=j.length
break
case 125:p=j.splice(a.p)
A.cT(a.u,a.e,p)
a.p=j.pop()
j.push(p)
j.push(-2)
break
case 43:m=k.indexOf("(",s)
j.push(k.substring(s,m))
j.push(-4)
j.push(a.p)
a.p=j.length
s=m+1
break
default:throw"Bad character "+r}}}l=j.pop()
return A.v(a.u,a.e,l)},
cQ(a,b,c,d){var t,s,r=b-48
for(t=c.length;a<t;++a){s=c.charCodeAt(a)
if(!(s>=48&&s<=57))break
r=r*10+(s-48)}d.push(r)
return a},
c0(a,b,c,d,e){var t,s,r,q,p,o,n=b+1
for(t=c.length;n<t;++n){s=c.charCodeAt(n)
if(s===46){if(e)break
e=!0}else{if(!((((s|32)>>>0)-97&65535)<26||s===95||s===36||s===124))r=s>=48&&s<=57
else r=!0
if(!r)break}}q=c.substring(b,n)
if(e){t=a.u
p=a.e
if(p.x===10)p=p.y
o=A.d5(t,p.y)[q]
if(o==null)A.by('No "'+q+'" in "'+A.cN(p)+'"')
d.push(A.b7(t,p,o))}else d.push(q)
return n},
cP(a,b){var t,s,r,q,p,o=null,n=a.u,m=b.pop()
if(typeof m=="number")switch(m){case-1:t=b.pop()
s=o
break
case-2:s=b.pop()
t=o
break
default:b.push(m)
s=o
t=s
break}else{b.push(m)
s=o
t=s}r=A.cO(a,b)
m=b.pop()
switch(m){case-3:m=b.pop()
if(t==null)t=n.sEA
if(s==null)s=n.sEA
q=A.v(n,a.e,m)
p=new A.an()
p.a=r
p.b=t
p.c=s
b.push(A.c2(n,q,p))
return
case-4:b.push(A.d0(n,b.pop(),r))
return
default:throw A.c(A.a5("Unexpected state under `()`: "+A.h(m)))}},
cR(a,b){var t=b.pop()
if(0===t){b.push(A.Z(a.u,1,"0&"))
return}if(1===t){b.push(A.Z(a.u,4,"1&"))
return}throw A.c(A.a5("Unexpected extended operation "+A.h(t)))},
cO(a,b){var t=b.splice(a.p)
A.bn(a.u,a.e,t)
a.p=b.pop()
return t},
v(a,b,c){if(typeof c=="string")return A.Y(a,c,a.sEA)
else if(typeof c=="number"){b.toString
return A.cS(a,b,c)}else return c},
bn(a,b,c){var t,s=c.length
for(t=0;t<s;++t)c[t]=A.v(a,b,c[t])},
cT(a,b,c){var t,s=c.length
for(t=2;t<s;t+=3)c[t]=A.v(a,b,c[t])},
cS(a,b,c){var t,s,r=b.x
if(r===10){if(c===0)return b.y
t=b.z
s=t.length
if(c<=s)return t[c-1]
c-=s
b=b.y
r=b.x}else if(c===0)return b
if(r!==9)throw A.c(A.a5("Indexed base must be an interface type"))
t=b.z
if(c<=t.length)return t[c-1]
throw A.c(A.a5("Bad index "+c+" for "+b.h(0)))},
e(a,b,c,d,e){var t,s,r,q,p,o,n,m,l,k
if(b===d)return!0
if(!A.u(d))if(!(d===u._))t=!1
else t=!0
else t=!0
if(t)return!0
s=b.x
if(s===4)return!0
if(A.u(b))return!1
if(b.x!==1)t=!1
else t=!0
if(t)return!0
r=s===14
if(r)if(A.e(a,c[b.y],c,d,e))return!0
q=d.x
t=b===u.P||b===u.T
if(t){if(q===8)return A.e(a,b,c,d.y,e)
return d===u.P||d===u.T||q===7||q===6}if(d===u.K){if(s===8)return A.e(a,b.y,c,d,e)
if(s===6)return A.e(a,b.y,c,d,e)
return s!==7}if(s===6)return A.e(a,b.y,c,d,e)
if(q===6){t=A.bU(a,d)
return A.e(a,b,c,t,e)}if(s===8){if(!A.e(a,b.y,c,d,e))return!1
return A.e(a,A.bT(a,b),c,d,e)}if(s===7){t=A.e(a,u.P,c,d,e)
return t&&A.e(a,b.y,c,d,e)}if(q===8){if(A.e(a,b,c,d.y,e))return!0
return A.e(a,b,c,A.bT(a,d),e)}if(q===7){t=A.e(a,b,c,u.P,e)
return t||A.e(a,b,c,d.y,e)}if(r)return!1
t=s!==12
if((!t||s===13)&&d===u.Z)return!0
if(q===13){if(b===u.g)return!0
if(s!==13)return!1
p=b.z
o=d.z
n=p.length
if(n!==o.length)return!1
c=c==null?p:p.concat(c)
e=e==null?o:o.concat(e)
for(m=0;m<n;++m){l=p[m]
k=o[m]
if(!A.e(a,l,c,k,e)||!A.e(a,k,e,l,c))return!1}return A.ca(a,b.y,c,d.y,e)}if(q===12){if(b===u.g)return!0
if(t)return!1
return A.ca(a,b,c,d,e)}if(s===9){if(q!==9)return!1
return A.dg(a,b,c,d,e)}t=s===11
if(t&&d===u.L)return!0
if(t&&q===11)return A.dk(a,b,c,d,e)
return!1},
ca(a2,a3,a4,a5,a6){var t,s,r,q,p,o,n,m,l,k,j,i,h,g,f,e,d,c,b,a,a0,a1
if(!A.e(a2,a3.y,a4,a5.y,a6))return!1
t=a3.z
s=a5.z
r=t.a
q=s.a
p=r.length
o=q.length
if(p>o)return!1
n=o-p
m=t.b
l=s.b
k=m.length
j=l.length
if(p+k<o+j)return!1
for(i=0;i<p;++i){h=r[i]
if(!A.e(a2,q[i],a6,h,a4))return!1}for(i=0;i<n;++i){h=m[i]
if(!A.e(a2,q[p+i],a6,h,a4))return!1}for(i=0;i<j;++i){h=m[n+i]
if(!A.e(a2,l[i],a6,h,a4))return!1}g=t.c
f=s.c
e=g.length
d=f.length
for(c=0,b=0;b<d;b+=3){a=f[b]
for(;!0;){if(c>=e)return!1
a0=g[c]
c+=3
if(a<a0)return!1
a1=g[c-2]
if(a0<a){if(a1)return!1
continue}h=f[b+1]
if(a1&&!h)return!1
h=g[c-1]
if(!A.e(a2,f[b+2],a6,h,a4))return!1
break}}for(;c<e;){if(g[c+1])return!1
c+=3}return!0},
dg(a,b,c,d,e){var t,s,r,q,p,o,n,m=b.y,l=d.y
for(;m!==l;){t=a.tR[m]
if(t==null)return!1
if(typeof t=="string"){m=t
continue}s=t[l]
if(s==null)return!1
r=s.length
q=r>0?new Array(r):v.typeUniverse.sEA
for(p=0;p<r;++p)q[p]=A.b7(a,b,s[p])
return A.c6(a,q,null,c,d.z,e)}o=b.z
n=d.z
return A.c6(a,o,null,c,n,e)},
c6(a,b,c,d,e,f){var t,s,r,q=b.length
for(t=0;t<q;++t){s=b[t]
r=e[t]
if(!A.e(a,s,d,r,f))return!1}return!0},
dk(a,b,c,d,e){var t,s=b.z,r=d.z,q=s.length
if(q!==r.length)return!1
if(b.y!==d.y)return!1
for(t=0;t<q;++t)if(!A.e(a,s[t],c,r[t],e))return!1
return!0},
a2(a){var t,s=a.x
if(!(a===u.P||a===u.T))if(!A.u(a))if(s!==7)if(!(s===6&&A.a2(a.y)))t=s===8&&A.a2(a.y)
else t=!0
else t=!0
else t=!0
else t=!0
return t},
dJ(a){var t
if(!A.u(a))if(!(a===u._))t=!1
else t=!0
else t=!0
return t},
u(a){var t=a.x
return t===2||t===3||t===4||t===5||a===u.X},
c5(a,b){var t,s,r=Object.keys(b),q=r.length
for(t=0;t<q;++t){s=r[t]
a[s]=b[s]}},
b8(a){return a>0?new Array(a):v.typeUniverse.sEA},
m:function m(a,b){var _=this
_.a=a
_.b=b
_.w=_.r=_.c=null
_.x=0
_.at=_.as=_.Q=_.z=_.y=null},
an:function an(){this.c=this.b=this.a=null},
b3:function b3(){},
at:function at(a){this.a=a},
bN(a){return new A.o(a.v("o<0>"))},
cJ(a){return new A.o(a.v("o<0>"))},
bO(a,b){return A.dz(a,new A.o(b.v("o<0>")))},
bm(){var t=Object.create(null)
t["<non-identifier-key>"]=t
delete t["<non-identifier-key>"]
return t},
bZ(a,b){var t=new A.T(a,b)
t.c=a.e
return t},
cG(a,b,c){var t,s
if(A.cc(a)){if(b==="("&&c===")")return"(...)"
return b+"..."+c}t=[]
$.a1.push(a)
try{A.dp(a,t)}finally{$.a1.pop()}s=A.bW(b,t,", ")+c
return s.charCodeAt(0)==0?s:s},
bj(a,b,c){var t,s
if(A.cc(a))return b+"..."+c
t=new A.aY(b)
$.a1.push(a)
try{s=t
s.a=A.bW(s.a,a,", ")}finally{$.a1.pop()}t.a+=c
s=t.a
return s.charCodeAt(0)==0?s:s},
cc(a){var t,s
for(t=$.a1.length,s=0;s<t;++s)if(a===$.a1[s])return!0
return!1},
dp(a,b){var t,s,r,q,p,o,n,m=a.gl(a),l=0,k=0
while(!0){if(!(l<80||k<3))break
if(!m.j())return
t=A.h(m.gk())
b.push(t)
l+=t.length+2;++k}if(!m.j()){if(k<=5)return
s=b.pop()
r=b.pop()}else{q=m.gk();++k
if(!m.j()){if(k<=4){b.push(A.h(q))
return}s=A.h(q)
r=b.pop()
l+=s.length+2}else{p=m.gk();++k
for(;m.j();q=p,p=o){o=m.gk();++k
if(k>100){while(!0){if(!(l>75&&k>3))break
l-=b.pop().length+2;--k}b.push("...")
return}}r=A.h(q)
s=A.h(p)
l+=s.length+r.length+4}}if(k>b.length+2){l+=5
n="..."}else n=null
while(!0){if(!(l>80&&b.length>3))break
l-=b.pop().length+2
if(n==null){l+=5
n="..."}}if(n!=null)b.push(n)
b.push(r)
b.push(s)},
o:function o(a){var _=this
_.a=0
_.f=_.e=_.d=_.c=_.b=null
_.r=0
_.$ti=a},
b6:function b6(a){this.a=a
this.c=this.b=null},
T:function T(a,b){var _=this
_.a=a
_.b=b
_.d=_.c=null},
ab:function ab(){},
A:function A(){},
S:function S(){},
aj:function aj(){},
as:function as(){},
U:function U(){},
W:function W(){},
a_:function a_(){},
cF(a){if(a instanceof A.C)return a.h(0)
return"Instance of '"+A.aV(a)+"'"},
cL(a,b,c){var t,s=J.bK(a)
if(a!==0&&!0)for(t=0;t<s.length;++t)s[t]=b
return s},
bP(a,b){var t,s=[]
for(t=a.gl(a);t.j();)s.push(t.gk())
if(b)return s
return J.bL(s)},
bW(a,b,c){var t=J.bg(b)
if(!t.j())return a
if(c.length===0){do a+=A.h(t.gk())
while(t.j())}else{a+=A.h(t.gk())
for(;t.j();)a=a+c+A.h(t.gk())}return a},
aJ(a){if(typeof a=="number"||A.c9(a)||a==null)return J.ay(a)
if(typeof a=="string")return JSON.stringify(a)
return A.cF(a)},
a5(a){return new A.az(a)},
bD(a){return new A.L(!1,null,null,a)},
bR(a,b,c,d,e){return new A.ah(b,c,!0,a,d,"Invalid value")},
bS(a,b){if(a<0)throw A.c(A.bR(a,0,null,b,null))
return a},
O(a,b,c,d){return new A.aN(b,!0,a,d,"Index out of range")},
bX(a){return new A.b_(a)},
a6(a){return new A.aC(a)},
aI:function aI(){},
az:function az(a){this.a=a},
aU:function aU(){},
L:function L(a,b,c,d){var _=this
_.a=a
_.b=b
_.c=c
_.d=d},
ah:function ah(a,b,c,d,e,f){var _=this
_.e=a
_.f=b
_.a=c
_.b=d
_.c=e
_.d=f},
aN:function aN(a,b,c,d,e){var _=this
_.f=a
_.a=b
_.b=c
_.c=d
_.d=e},
b_:function b_(a){this.a=a},
aC:function aC(a){this.a=a},
aF:function aF(a){this.a=a},
a8:function a8(){},
a9:function a9(){},
R:function R(){},
j:function j(){},
aY:function aY(a){this.a=a},
a:function a(){},
a3:function a3(){},
a4:function a4(){},
n:function n(){},
D:function D(){},
aE:function aE(){},
aG:function aG(){},
aH:function aH(){},
b1:function b1(a,b){this.a=a
this.b=b},
i:function i(){},
E:function E(){},
a7:function a7(){},
x:function x(){},
b0:function b0(a){this.a=a},
d:function d(){},
Q:function Q(){},
ai:function ai(){},
V:function V(){},
b2:function b2(a){this.a=a},
F:function F(){},
N:function N(a,b){var _=this
_.a=a
_.b=b
_.c=-1
_.d=null},
am:function am(){},
ao:function ao(){},
ap:function ap(){},
aq:function aq(){},
ar:function ar(){},
au:function au(){},
av:function av(){},
bi(){return window.navigator.userAgent},
aD:function aD(){},
aK:function aK(a){this.b=a},
aL:function aL(){},
aM:function aM(){},
b4:function b4(){},
aA:function aA(a){this.a=a},
b:function b(){},
dS(a){return A.by(new A.aT("Field '"+a+"' has been assigned during initialization."))},
dL(){var t,s=document.body
if(s==null)return
t=window.getComputedStyle(s,"")
if(B.a.t(t.getPropertyValue(B.e.J(t,"--body-font")),"M Plus"))A.cf(s)},
cf(a){var t,s,r=u.N,q=A.bO(["h1","h2","h3","h4","h5","h6","table","p"],r),p=A.bO(["collapsible-block-link","footnote-footer","top-left-box","top-right-box","class-category","class-text","wikisys--template-dialog","fonts-display"],r)
if(q.t(0,a.tagName.toLowerCase())||A.cJ(r).t(0,a.id)||J.cx(a).q().a_(p).a!==0){t=$.ct().a1()?"0.05deg":"-0.05deg"
r=a.style
s=B.e.J(r,"transform")
r.setProperty(s,"rotate("+t+")","")}else{r=J.cw(a)
r.D(r,A.du())}}},J={
bx(a,b,c,d){return{i:a,p:b,e:c,x:d}},
ba(a){var t,s,r,q,p,o=a[v.dispatchPropertyName]
if(o==null)if($.bw==null){A.dF()
o=a[v.dispatchPropertyName]}if(o!=null){t=o.p
if(!1===t)return o.i
if(!0===t)return a
s=Object.getPrototypeOf(a)
if(t===s)return o.i
if(o.e===s)throw A.c(A.bX("Return interceptor for "+A.h(t(a,o))))}r=a.constructor
if(r==null)q=null
else{p=$.b5
if(p==null)p=$.b5=v.getIsolateTag("_$dart_js")
q=r[p]}if(q!=null)return q
q=A.dK(a)
if(q!=null)return q
if(typeof a=="function")return B.q
t=Object.getPrototypeOf(a)
if(t==null)return B.f
if(t===Object.prototype)return B.f
if(typeof r=="function"){p=$.b5
if(p==null)p=$.b5=v.getIsolateTag("_$dart_js")
Object.defineProperty(r,p,{value:B.b,enumerable:false,writable:true,configurable:true})
return B.b}return B.b},
bK(a){if(a<0)throw A.c(A.bD("Length must be a non-negative integer: "+a))
return new Array(a)},
bL(a){a.fixed$length=Array
return a},
bM(a){if(a<256)switch(a){case 9:case 10:case 11:case 12:case 13:case 32:case 133:case 160:return!0
default:return!1}switch(a){case 5760:case 8192:case 8193:case 8194:case 8195:case 8196:case 8197:case 8198:case 8199:case 8200:case 8201:case 8202:case 8232:case 8233:case 8239:case 8287:case 12288:case 65279:return!0
default:return!1}},
cH(a,b){var t,s
for(t=a.length;b<t;){s=B.a.K(a,b)
if(s!==32&&s!==13&&!J.bM(s))break;++b}return b},
cI(a,b){var t,s
for(;b>0;b=t){t=b-1
s=B.a.P(a,t)
if(s!==32&&s!==13&&!J.bM(s))break}return b},
K(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.aP.prototype
return J.aQ.prototype}if(typeof a=="string")return J.y.prototype
if(a==null)return J.aa.prototype
if(typeof a=="boolean")return J.aO.prototype
if(a.constructor==Array)return J.q.prototype
if(typeof a!="object"){if(typeof a=="function")return J.r.prototype
return a}if(a instanceof A.j)return a
return J.ba(a)},
cg(a){if(typeof a=="string")return J.y.prototype
if(a==null)return a
if(a.constructor==Array)return J.q.prototype
if(typeof a!="object"){if(typeof a=="function")return J.r.prototype
return a}if(a instanceof A.j)return a
return J.ba(a)},
bv(a){if(a==null)return a
if(a.constructor==Array)return J.q.prototype
if(typeof a!="object"){if(typeof a=="function")return J.r.prototype
return a}if(a instanceof A.j)return a
return J.ba(a)},
dB(a){if(typeof a=="string")return J.y.prototype
if(a==null)return a
if(!(a instanceof A.j))return J.H.prototype
return a},
ch(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.r.prototype
return a}if(a instanceof A.j)return a
return J.ba(a)},
cu(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.K(a).u(a,b)},
cv(a,b){if(typeof b==="number")if(a.constructor==Array||A.dI(a,a[v.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.bv(a).p(a,b)},
bA(a,b){return J.bv(a).m(a,b)},
cw(a){return J.ch(a).gN(a)},
cx(a){return J.ch(a).gO(a)},
bB(a){return J.K(a).gn(a)},
bg(a){return J.bv(a).gl(a)},
bh(a){return J.cg(a).gi(a)},
ay(a){return J.K(a).h(a)},
bC(a){return J.dB(a).a3(a)},
P:function P(){},
aO:function aO(){},
aa:function aa(){},
f:function f(){},
z:function z(){},
af:function af(){},
H:function H(){},
r:function r(){},
q:function q(){},
aS:function aS(){},
B:function B(a,b){var _=this
_.a=a
_.b=b
_.c=0
_.d=null},
aR:function aR(){},
aP:function aP(){},
aQ:function aQ(){},
y:function y(){}},B={}
var w=[A,J,B]
var $={}
A.bk.prototype={}
J.P.prototype={
u(a,b){return a===b},
gn(a){return A.ag(a)},
h(a){return"Instance of '"+A.aV(a)+"'"}}
J.aO.prototype={
h(a){return String(a)},
gn(a){return a?519018:218159}}
J.aa.prototype={
u(a,b){return null==b},
h(a){return"null"},
gn(a){return 0}}
J.f.prototype={}
J.z.prototype={
gn(a){return 0},
h(a){return String(a)}}
J.af.prototype={}
J.H.prototype={}
J.r.prototype={
h(a){var t=a[$.co()]
if(t==null)return this.U(a)
return"JavaScript function for "+J.ay(t)}}
J.q.prototype={
D(a,b){var t,s=a.length
for(t=0;t<s;++t){b.$1(a[t])
if(a.length!==s)throw A.c(A.a6(a))}},
m(a,b){return a[b]},
h(a){return A.bj(a,"[","]")},
gl(a){return new J.B(a,a.length)},
gn(a){return A.ag(a)},
gi(a){return a.length}}
J.aS.prototype={}
J.B.prototype={
gk(){var t=this.d
return t==null?A.p(this).c.a(t):t},
j(){var t,s=this,r=s.a,q=r.length
if(s.b!==q)throw A.c(A.dQ(r))
t=s.c
if(t>=q){s.d=null
return!1}s.d=r[t]
s.c=t+1
return!0}}
J.aR.prototype={
h(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
gn(a){var t,s,r,q,p=a|0
if(a===p)return p&536870911
t=Math.abs(a)
s=Math.log(t)/0.6931471805599453|0
r=Math.pow(2,s)
q=t<1?t/r:r/t
return((q*9007199254740992|0)+(q*3542243181176521|0))*599197+s*1259&536870911}}
J.aP.prototype={}
J.aQ.prototype={}
J.y.prototype={
P(a,b){if(b<0)throw A.c(A.bu(a,b))
if(b>=a.length)A.by(A.bu(a,b))
return a.charCodeAt(b)},
K(a,b){if(b>=a.length)throw A.c(A.bu(a,b))
return a.charCodeAt(b)},
S(a,b){return a+b},
a3(a){var t,s,r,q=a.trim(),p=q.length
if(p===0)return q
if(this.K(q,0)===133){t=J.cH(q,1)
if(t===p)return""}else t=0
s=p-1
r=this.P(q,s)===133?J.cI(q,s):p
if(t===0&&r===p)return q
return q.substring(t,r)},
C(a,b,c){var t=a.length
if(c>t)throw A.c(A.bR(c,0,t,null,null))
return A.dP(a,b,c)},
t(a,b){return this.C(a,b,0)},
h(a){return a},
gn(a){var t,s,r
for(t=a.length,s=0,r=0;r<t;++r){s=s+a.charCodeAt(r)&536870911
s=s+((s&524287)<<10)&536870911
s^=s>>6}s=s+((s&67108863)<<3)&536870911
s^=s>>11
return s+((s&16383)<<15)&536870911},
gi(a){return a.length},
$ibl:1}
A.aT.prototype={
h(a){return"LateInitializationError: "+this.a}}
A.ac.prototype={
gk(){var t=this.d
return t==null?A.p(this).c.a(t):t},
j(){var t,s=this,r=s.a,q=J.cg(r),p=q.gi(r)
if(s.b!==p)throw A.c(A.a6(r))
t=s.c
if(t>=p){s.d=null
return!1}s.d=q.m(r,t);++s.c
return!0}}
A.ad.prototype={
gl(a){return new A.ae(J.bg(this.a),this.b)},
gi(a){return J.bh(this.a)},
m(a,b){return this.b.$1(J.bA(this.a,b))}}
A.ae.prototype={
j(){var t=this,s=t.b
if(s.j()){t.a=t.c.$1(s.gk())
return!0}t.a=null
return!1},
gk(){var t=this.a
return t==null?A.p(this).z[1].a(t):t}}
A.ak.prototype={
gl(a){return new A.al(J.bg(this.a),this.b)}}
A.al.prototype={
j(){var t,s
for(t=this.a,s=this.b;t.j();)if(s.$1(t.gk()))return!0
return!1},
gk(){return this.a.gk()}}
A.C.prototype={
h(a){var t=this.constructor,s=t==null?null:t.name
return"Closure '"+A.cm(s==null?"unknown":s)+"'"},
ga4(){return this},
$C:"$1",
$R:1,
$D:null}
A.aB.prototype={$C:"$2",$R:2}
A.aZ.prototype={}
A.aX.prototype={
h(a){var t=this.$static_name
if(t==null)return"Closure of unknown static method"
return"Closure '"+A.cm(t)+"'"}}
A.M.prototype={
u(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof A.M))return!1
return this.$_target===b.$_target&&this.a===b.a},
gn(a){return(A.dO(this.a)^A.ag(this.$_target))>>>0},
h(a){return"Closure '"+this.$_name+"' of "+("Instance of '"+A.aV(this.a)+"'")}}
A.aW.prototype={
h(a){return"RuntimeError: "+this.a}}
A.bb.prototype={
$1(a){return this.a(a)}}
A.bc.prototype={
$2(a,b){return this.a(a,b)}}
A.bd.prototype={
$1(a){return this.a(a)}}
A.m.prototype={
v(a){return A.b7(v.typeUniverse,this,a)},
a5(a){return A.d3(v.typeUniverse,this,a)}}
A.an.prototype={}
A.b3.prototype={
h(a){return this.a}}
A.at.prototype={}
A.o.prototype={
Y(){return new A.o(A.p(this).v("o<1>"))},
gl(a){var t=new A.T(this,this.r)
t.c=this.e
return t},
gi(a){return this.a},
t(a,b){var t,s
if(typeof b=="string"&&b!=="__proto__"){t=this.b
if(t==null)return!1
return t[b]!=null}else if(typeof b=="number"&&(b&1073741823)===b){s=this.c
if(s==null)return!1
return s[b]!=null}else return this.W(b)},
W(a){var t=this.d
if(t==null)return!1
return this.M(t[this.L(a)],a)>=0},
B(a,b){var t,s,r=this
if(typeof b=="string"&&b!=="__proto__"){t=r.b
return r.I(t==null?r.b=A.bm():t,b)}else if(typeof b=="number"&&(b&1073741823)===b){s=r.c
return r.I(s==null?r.c=A.bm():s,b)}else return r.V(b)},
V(a){var t,s,r=this,q=r.d
if(q==null)q=r.d=A.bm()
t=r.L(a)
s=q[t]
if(s==null)q[t]=[r.G(a)]
else{if(r.M(s,a)>=0)return!1
s.push(r.G(a))}return!0},
I(a,b){if(a[b]!=null)return!1
a[b]=this.G(b)
return!0},
X(){this.r=this.r+1&1073741823},
G(a){var t,s=this,r=new A.b6(a)
if(s.e==null)s.e=s.f=r
else{t=s.f
t.toString
r.c=t
s.f=t.b=r}++s.a
s.X()
return r},
L(a){return J.bB(a)&1073741823},
M(a,b){var t,s
if(a==null)return-1
t=a.length
for(s=0;s<t;++s)if(J.cu(a[s].a,b))return s
return-1}}
A.b6.prototype={}
A.T.prototype={
gk(){var t=this.d
return t==null?A.p(this).c.a(t):t},
j(){var t=this,s=t.c,r=t.a
if(t.b!==r.r)throw A.c(A.a6(r))
else if(s==null){t.d=null
return!1}else{t.d=s.a
t.c=s.b
return!0}}}
A.ab.prototype={}
A.A.prototype={
gl(a){return new A.ac(a,this.gi(a))},
m(a,b){return this.p(a,b)},
D(a,b){var t,s=this.gi(a)
for(t=0;t<s;++t){b.$1(this.p(a,t))
if(s!==this.gi(a))throw A.c(A.a6(a))}},
gR(a){return this.gi(a)===0},
a2(a){var t,s,r,q,p=this
if(p.gR(a)){t=J.bK(0)
return t}s=p.p(a,0)
r=A.cL(p.gi(a),s,!0)
for(q=1;q<p.gi(a);++q)r[q]=p.p(a,q)
return r},
h(a){return A.bj(a,"[","]")}}
A.S.prototype={
h(a){return A.bj(this,"{","}")},
a0(a,b){var t,s,r,q=this.gl(this)
if(!q.j())return""
if(b===""){t=A.p(q).c
s=""
do{r=q.d
s+=A.h(r==null?t.a(r):r)}while(q.j())
t=s}else{t=q.d
t=""+A.h(t==null?A.p(q).c.a(t):t)
for(s=A.p(q).c;q.j();){r=q.d
t=t+b+A.h(r==null?s.a(r):r)}}return t.charCodeAt(0)==0?t:t},
m(a,b){var t,s,r,q,p="index"
A.dw(b,p,u.S)
A.bS(b,p)
for(t=this.gl(this),s=A.p(t).c,r=0;t.j();){q=t.d
if(q==null)q=s.a(q)
if(b===r)return q;++r}throw A.c(A.O(b,r,this,p))}}
A.aj.prototype={}
A.as.prototype={
a_(a){var t,s,r,q=this.Y()
for(t=A.bZ(this,this.r),s=A.p(t).c;t.j();){r=t.d
if(r==null)r=s.a(r)
if(a.t(0,r))q.B(0,r)}return q}}
A.U.prototype={}
A.W.prototype={}
A.a_.prototype={}
A.aI.prototype={}
A.az.prototype={
h(a){var t=this.a
if(t!=null)return"Assertion failed: "+A.aJ(t)
return"Assertion failed"}}
A.aU.prototype={
h(a){return"Throw of null."}}
A.L.prototype={
gF(){return"Invalid argument"+(!this.a?"(s)":"")},
gE(){return""},
h(a){var t=this,s=t.c,r=s==null?"":" ("+s+")",q=t.d,p=q==null?"":": "+q,o=t.gF()+r+p
if(!t.a)return o
return o+t.gE()+": "+A.aJ(t.gH())},
gH(){return this.b}}
A.ah.prototype={
gH(){return this.b},
gF(){return"RangeError"},
gE(){var t,s=this.e,r=this.f
if(s==null)t=r!=null?": Not less than or equal to "+A.h(r):""
else if(r==null)t=": Not greater than or equal to "+A.h(s)
else if(r>s)t=": Not in inclusive range "+A.h(s)+".."+A.h(r)
else t=r<s?": Valid value range is empty":": Only valid value is "+A.h(s)
return t}}
A.aN.prototype={
gH(){return this.b},
gF(){return"RangeError"},
gE(){if(this.b<0)return": index must not be negative"
var t=this.f
if(t===0)return": no indices are valid"
return": index should be less than "+t},
gi(a){return this.f}}
A.b_.prototype={
h(a){return"UnimplementedError: "+this.a}}
A.aC.prototype={
h(a){var t=this.a
if(t==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+A.aJ(t)+"."}}
A.aF.prototype={
h(a){return"Reading static variable '"+this.a+"' during its initialization"}}
A.a8.prototype={
gi(a){var t,s=this.gl(this)
for(t=0;s.j();)++t
return t},
m(a,b){var t,s,r
A.bS(b,"index")
for(t=this.gl(this),s=0;t.j();){r=t.gk()
if(b===s)return r;++s}throw A.c(A.O(b,s,this,"index"))},
h(a){return A.cG(this,"(",")")}}
A.a9.prototype={}
A.R.prototype={
gn(a){return A.j.prototype.gn.call(this,this)},
h(a){return"null"}}
A.j.prototype={$ij:1,
u(a,b){return this===b},
gn(a){return A.ag(this)},
h(a){return"Instance of '"+A.aV(this)+"'"},
toString(){return this.h(this)}}
A.aY.prototype={
gi(a){return this.a.length},
h(a){var t=this.a
return t.charCodeAt(0)==0?t:t}}
A.a.prototype={}
A.a3.prototype={
h(a){return String(a)}}
A.a4.prototype={
h(a){return String(a)}}
A.n.prototype={
gi(a){return a.length}}
A.D.prototype={
J(a,b){var t=$.cn(),s=t[b]
if(typeof s=="string")return s
s=this.Z(a,b)
t[b]=s
return s},
Z(a,b){var t
if(b.replace(/^-ms-/,"ms-").replace(/-([\da-z])/ig,function(c,d){return d.toUpperCase()}) in a)return b
t=$.cp()+b
if(t in a)return t
return b},
gi(a){return a.length}}
A.aE.prototype={}
A.aG.prototype={
h(a){return String(a)}}
A.aH.prototype={
gi(a){return a.length}}
A.b1.prototype={
gR(a){return this.a.firstElementChild==null},
gi(a){return this.b.length},
p(a,b){return u.h.a(this.b[b])},
gl(a){var t=this.a2(this)
return new J.B(t,t.length)}}
A.i.prototype={
gN(a){return new A.b1(a,a.children)},
gO(a){return new A.b2(a)},
h(a){return a.localName},
$ii:1}
A.E.prototype={}
A.a7.prototype={
gi(a){return a.length}}
A.x.prototype={
gi(a){return a.length},
p(a,b){var t=a.length
if(b>>>0!==b||b>=t)throw A.c(A.O(b,t,a,null))
return a[b]},
m(a,b){return a[b]},
$iG:1}
A.b0.prototype={
gl(a){var t=this.a.childNodes
return new A.N(t,t.length)},
gi(a){return this.a.childNodes.length},
p(a,b){return this.a.childNodes[b]}}
A.d.prototype={
h(a){var t=a.nodeValue
return t==null?this.T(a):t},
$id:1}
A.Q.prototype={
gi(a){return a.length},
p(a,b){var t=a.length
if(b>>>0!==b||b>=t)throw A.c(A.O(b,t,a,null))
return a[b]},
m(a,b){return a[b]},
$iG:1}
A.ai.prototype={
gi(a){return a.length}}
A.V.prototype={
gi(a){return a.length},
p(a,b){var t=a.length
if(b>>>0!==b||b>=t)throw A.c(A.O(b,t,a,null))
return a[b]},
m(a,b){return a[b]},
$iG:1}
A.b2.prototype={
q(){var t,s,r,q,p=A.bN(u.N)
for(t=this.a.className.split(" "),s=t.length,r=0;r<s;++r){q=J.bC(t[r])
if(q.length!==0)p.B(0,q)}return p},
gi(a){return this.a.classList.length}}
A.F.prototype={
gl(a){return new A.N(a,this.gi(a))}}
A.N.prototype={
j(){var t=this,s=t.c+1,r=t.b
if(s<r){t.d=J.cv(t.a,s)
t.c=s
return!0}t.d=null
t.c=r
return!1},
gk(){var t=this.d
return t==null?A.p(this).c.a(t):t}}
A.am.prototype={}
A.ao.prototype={}
A.ap.prototype={}
A.aq.prototype={}
A.ar.prototype={}
A.au.prototype={}
A.av.prototype={}
A.aD.prototype={
h(a){return this.q().a0(0," ")},
gl(a){var t=this.q()
return A.bZ(t,t.r)},
gi(a){return this.q().a},
m(a,b){return this.q().m(0,b)}}
A.aK.prototype={
gA(){return new A.ad(new A.ak(this.b,new A.aL()),new A.aM())},
D(a,b){B.p.D(A.bP(this.gA(),!1),b)},
gi(a){return J.bh(this.gA().a)},
p(a,b){var t=this.gA()
return t.b.$1(J.bA(t.a,b))},
gl(a){var t=A.bP(this.gA(),!1)
return new J.B(t,t.length)}}
A.aL.prototype={
$1(a){return u.h.b(a)}}
A.aM.prototype={
$1(a){return u.h.a(a)}}
A.b4.prototype={
a1(){return Math.random()<0.5}}
A.aA.prototype={
q(){var t,s,r,q,p=this.a.getAttribute("class"),o=A.bN(u.N)
if(p==null)return o
for(t=p.split(" "),s=t.length,r=0;r<s;++r){q=J.bC(t[r])
if(q.length!==0)o.B(0,q)}return o}}
A.b.prototype={
gO(a){return new A.aA(a)},
gN(a){return new A.aK(new A.b0(a))}};(function aliases(){var t=J.P.prototype
t.T=t.h
t=J.z.prototype
t.U=t.h})();(function installTearOffs(){var t=hunkHelpers._static_1
t(A,"du","cf",0)})();(function inheritance(){var t=hunkHelpers.mixin,s=hunkHelpers.inherit,r=hunkHelpers.inheritMany
s(A.j,null)
r(A.j,[A.bk,J.P,J.B,A.aI,A.ac,A.a8,A.a9,A.C,A.m,A.an,A.a_,A.b6,A.T,A.U,A.A,A.S,A.W,A.R,A.aY,A.aE,A.F,A.N,A.b4])
r(J.P,[J.aO,J.aa,J.f,J.q,J.aR,J.y])
r(J.f,[J.z,A.E,A.am,A.aG,A.aH,A.ao,A.aq,A.au])
r(J.z,[J.af,J.H,J.r])
s(J.aS,J.q)
r(J.aR,[J.aP,J.aQ])
r(A.aI,[A.aT,A.aW,A.b3,A.az,A.aU,A.L,A.b_,A.aC,A.aF])
r(A.a8,[A.ad,A.ak])
r(A.a9,[A.ae,A.al])
r(A.C,[A.aB,A.aZ,A.bb,A.bd,A.aL,A.aM])
r(A.aZ,[A.aX,A.M])
s(A.bc,A.aB)
s(A.at,A.b3)
s(A.as,A.a_)
s(A.o,A.as)
s(A.ab,A.U)
s(A.aj,A.W)
r(A.L,[A.ah,A.aN])
s(A.d,A.E)
r(A.d,[A.i,A.n])
r(A.i,[A.a,A.b])
r(A.a,[A.a3,A.a4,A.a7,A.ai])
s(A.D,A.am)
r(A.ab,[A.b1,A.b0,A.aK])
s(A.ap,A.ao)
s(A.x,A.ap)
s(A.ar,A.aq)
s(A.Q,A.ar)
s(A.av,A.au)
s(A.V,A.av)
s(A.aD,A.aj)
r(A.aD,[A.b2,A.aA])
t(A.U,A.A)
t(A.W,A.S)
t(A.a_,A.S)
t(A.am,A.aE)
t(A.ao,A.A)
t(A.ap,A.F)
t(A.aq,A.A)
t(A.ar,A.F)
t(A.au,A.A)
t(A.av,A.F)})()
var v={typeUniverse:{eC:new Map(),tR:{},eT:{},tPV:{},sEA:[]},mangledGlobalNames:{dH:"int",dy:"double",dN:"num",bl:"String",dv:"bool",R:"Null",cK:"List"},mangledNames:{},types:["~(i)"],interceptorsByTag:null,leafTags:null,arrayRti:Symbol("$ti")}
A.d2(v.typeUniverse,JSON.parse('{"af":"z","H":"z","r":"z","dU":"b","e5":"b","dV":"a","e9":"a","e6":"d","e3":"d","dW":"n","eb":"n","e8":"i","e7":"x","y":{"bl":[]},"i":{"d":[]},"a":{"i":[],"d":[]},"a3":{"i":[],"d":[]},"a4":{"i":[],"d":[]},"n":{"d":[]},"a7":{"i":[],"d":[]},"x":{"G":["d"]},"Q":{"G":["d"]},"ai":{"i":[],"d":[]},"V":{"G":["d"]},"b":{"i":[],"d":[]}}'))
A.d1(v.typeUniverse,JSON.parse('{"q":1,"aS":1,"B":1,"ac":1,"ad":2,"ae":2,"ak":1,"al":1,"T":1,"ab":1,"A":1,"S":1,"aj":1,"as":1,"U":1,"W":1,"a_":1,"a8":1,"a9":1,"F":1,"N":1}'))
var u=(function rtii(){var t=A.dA
return{h:t("i"),Z:t("e4"),b:t("q<@>"),T:t("aa"),g:t("r"),p:t("G<@>"),P:t("R"),K:t("j"),L:t("ea"),N:t("bl"),o:t("H"),y:t("dv"),i:t("dy"),S:t("dH"),A:t("0&*"),_:t("j*"),O:t("bJ<R>?"),X:t("j?"),H:t("dN")}})();(function constants(){B.e=A.D.prototype
B.o=J.P.prototype
B.p=J.q.prototype
B.a=J.y.prototype
B.q=J.r.prototype
B.r=J.f.prototype
B.f=J.af.prototype
B.b=J.H.prototype
B.c=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
B.h=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (self.HTMLElement && object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof navigator == "object";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
B.m=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var ua = navigator.userAgent;
    if (ua.indexOf("DumpRenderTree") >= 0) return hooks;
    if (ua.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
B.i=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
B.j=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
B.l=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
B.k=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
B.d=function(hooks) { return hooks; }

B.n=new A.b4()})();(function staticFields(){$.b5=null
$.bQ=null
$.bG=null
$.bF=null
$.ci=null
$.ce=null
$.cl=null
$.b9=null
$.be=null
$.bw=null
$.a1=[]})();(function lazyInitializers(){var t=hunkHelpers.lazyFinal
t($,"dY","co",()=>A.dC("_$dart_dartClosure"))
t($,"dX","cn",()=>({}))
t($,"e1","bz",()=>B.a.C(A.bi(),"Opera",0))
t($,"e0","cr",()=>!$.bz()&&B.a.C(A.bi(),"Trident/",0))
t($,"e_","cq",()=>B.a.C(A.bi(),"Firefox",0))
t($,"dZ","cp",()=>"-"+$.cs()+"-")
t($,"e2","cs",()=>{if($.cq())var s="moz"
else if($.cr())s="ms"
else s=$.bz()?"o":"webkit"
return s})
t($,"es","ct",()=>B.n)})();(function nativeSupport(){!function(){var t=function(a){var n={}
n[a]=1
return Object.keys(hunkHelpers.convertToFastObject(n))[0]}
v.getIsolateTag=function(a){return t("___dart_"+a+v.isolateTag)}
var s="___dart_isolate_tags_"
var r=Object[s]||(Object[s]=Object.create(null))
var q="_ZxYxX"
for(var p=0;;p++){var o=t(q+"_"+p+"_")
if(!(o in r)){r[o]=1
v.isolateTag=o
break}}v.dispatchPropertyName=v.getIsolateTag("dispatch_record")}()
hunkHelpers.setOrUpdateInterceptorsByTag({ApplicationCacheErrorEvent:J.f,DOMError:J.f,ErrorEvent:J.f,Event:J.f,InputEvent:J.f,SubmitEvent:J.f,MediaError:J.f,Navigator:J.f,NavigatorConcurrentHardware:J.f,NavigatorUserMediaError:J.f,OverconstrainedError:J.f,PositionError:J.f,GeolocationPositionError:J.f,SensorErrorEvent:J.f,SpeechRecognitionError:J.f,HTMLAudioElement:A.a,HTMLBRElement:A.a,HTMLBaseElement:A.a,HTMLBodyElement:A.a,HTMLButtonElement:A.a,HTMLCanvasElement:A.a,HTMLContentElement:A.a,HTMLDListElement:A.a,HTMLDataElement:A.a,HTMLDataListElement:A.a,HTMLDetailsElement:A.a,HTMLDialogElement:A.a,HTMLDivElement:A.a,HTMLEmbedElement:A.a,HTMLFieldSetElement:A.a,HTMLHRElement:A.a,HTMLHeadElement:A.a,HTMLHeadingElement:A.a,HTMLHtmlElement:A.a,HTMLIFrameElement:A.a,HTMLImageElement:A.a,HTMLInputElement:A.a,HTMLLIElement:A.a,HTMLLabelElement:A.a,HTMLLegendElement:A.a,HTMLLinkElement:A.a,HTMLMapElement:A.a,HTMLMediaElement:A.a,HTMLMenuElement:A.a,HTMLMetaElement:A.a,HTMLMeterElement:A.a,HTMLModElement:A.a,HTMLOListElement:A.a,HTMLObjectElement:A.a,HTMLOptGroupElement:A.a,HTMLOptionElement:A.a,HTMLOutputElement:A.a,HTMLParagraphElement:A.a,HTMLParamElement:A.a,HTMLPictureElement:A.a,HTMLPreElement:A.a,HTMLProgressElement:A.a,HTMLQuoteElement:A.a,HTMLScriptElement:A.a,HTMLShadowElement:A.a,HTMLSlotElement:A.a,HTMLSourceElement:A.a,HTMLSpanElement:A.a,HTMLStyleElement:A.a,HTMLTableCaptionElement:A.a,HTMLTableCellElement:A.a,HTMLTableDataCellElement:A.a,HTMLTableHeaderCellElement:A.a,HTMLTableColElement:A.a,HTMLTableElement:A.a,HTMLTableRowElement:A.a,HTMLTableSectionElement:A.a,HTMLTemplateElement:A.a,HTMLTextAreaElement:A.a,HTMLTimeElement:A.a,HTMLTitleElement:A.a,HTMLTrackElement:A.a,HTMLUListElement:A.a,HTMLUnknownElement:A.a,HTMLVideoElement:A.a,HTMLDirectoryElement:A.a,HTMLFontElement:A.a,HTMLFrameElement:A.a,HTMLFrameSetElement:A.a,HTMLMarqueeElement:A.a,HTMLElement:A.a,HTMLAnchorElement:A.a3,HTMLAreaElement:A.a4,CDATASection:A.n,CharacterData:A.n,Comment:A.n,ProcessingInstruction:A.n,Text:A.n,CSSStyleDeclaration:A.D,MSStyleCSSProperties:A.D,CSS2Properties:A.D,DOMException:A.aG,DOMTokenList:A.aH,MathMLElement:A.i,Element:A.i,Window:A.E,DOMWindow:A.E,EventTarget:A.E,HTMLFormElement:A.a7,HTMLCollection:A.x,HTMLFormControlsCollection:A.x,HTMLOptionsCollection:A.x,Document:A.d,DocumentFragment:A.d,HTMLDocument:A.d,ShadowRoot:A.d,XMLDocument:A.d,Attr:A.d,DocumentType:A.d,Node:A.d,NodeList:A.Q,RadioNodeList:A.Q,HTMLSelectElement:A.ai,NamedNodeMap:A.V,MozNamedAttrMap:A.V,SVGAElement:A.b,SVGAnimateElement:A.b,SVGAnimateMotionElement:A.b,SVGAnimateTransformElement:A.b,SVGAnimationElement:A.b,SVGCircleElement:A.b,SVGClipPathElement:A.b,SVGDefsElement:A.b,SVGDescElement:A.b,SVGDiscardElement:A.b,SVGEllipseElement:A.b,SVGFEBlendElement:A.b,SVGFEColorMatrixElement:A.b,SVGFEComponentTransferElement:A.b,SVGFECompositeElement:A.b,SVGFEConvolveMatrixElement:A.b,SVGFEDiffuseLightingElement:A.b,SVGFEDisplacementMapElement:A.b,SVGFEDistantLightElement:A.b,SVGFEFloodElement:A.b,SVGFEFuncAElement:A.b,SVGFEFuncBElement:A.b,SVGFEFuncGElement:A.b,SVGFEFuncRElement:A.b,SVGFEGaussianBlurElement:A.b,SVGFEImageElement:A.b,SVGFEMergeElement:A.b,SVGFEMergeNodeElement:A.b,SVGFEMorphologyElement:A.b,SVGFEOffsetElement:A.b,SVGFEPointLightElement:A.b,SVGFESpecularLightingElement:A.b,SVGFESpotLightElement:A.b,SVGFETileElement:A.b,SVGFETurbulenceElement:A.b,SVGFilterElement:A.b,SVGForeignObjectElement:A.b,SVGGElement:A.b,SVGGeometryElement:A.b,SVGGraphicsElement:A.b,SVGImageElement:A.b,SVGLineElement:A.b,SVGLinearGradientElement:A.b,SVGMarkerElement:A.b,SVGMaskElement:A.b,SVGMetadataElement:A.b,SVGPathElement:A.b,SVGPatternElement:A.b,SVGPolygonElement:A.b,SVGPolylineElement:A.b,SVGRadialGradientElement:A.b,SVGRectElement:A.b,SVGScriptElement:A.b,SVGSetElement:A.b,SVGStopElement:A.b,SVGStyleElement:A.b,SVGElement:A.b,SVGSVGElement:A.b,SVGSwitchElement:A.b,SVGSymbolElement:A.b,SVGTSpanElement:A.b,SVGTextContentElement:A.b,SVGTextElement:A.b,SVGTextPathElement:A.b,SVGTextPositioningElement:A.b,SVGTitleElement:A.b,SVGUseElement:A.b,SVGViewElement:A.b,SVGGradientElement:A.b,SVGComponentTransferFunctionElement:A.b,SVGFEDropShadowElement:A.b,SVGMPathElement:A.b})
hunkHelpers.setOrUpdateLeafTags({ApplicationCacheErrorEvent:true,DOMError:true,ErrorEvent:true,Event:true,InputEvent:true,SubmitEvent:true,MediaError:true,Navigator:true,NavigatorConcurrentHardware:true,NavigatorUserMediaError:true,OverconstrainedError:true,PositionError:true,GeolocationPositionError:true,SensorErrorEvent:true,SpeechRecognitionError:true,HTMLAudioElement:true,HTMLBRElement:true,HTMLBaseElement:true,HTMLBodyElement:true,HTMLButtonElement:true,HTMLCanvasElement:true,HTMLContentElement:true,HTMLDListElement:true,HTMLDataElement:true,HTMLDataListElement:true,HTMLDetailsElement:true,HTMLDialogElement:true,HTMLDivElement:true,HTMLEmbedElement:true,HTMLFieldSetElement:true,HTMLHRElement:true,HTMLHeadElement:true,HTMLHeadingElement:true,HTMLHtmlElement:true,HTMLIFrameElement:true,HTMLImageElement:true,HTMLInputElement:true,HTMLLIElement:true,HTMLLabelElement:true,HTMLLegendElement:true,HTMLLinkElement:true,HTMLMapElement:true,HTMLMediaElement:true,HTMLMenuElement:true,HTMLMetaElement:true,HTMLMeterElement:true,HTMLModElement:true,HTMLOListElement:true,HTMLObjectElement:true,HTMLOptGroupElement:true,HTMLOptionElement:true,HTMLOutputElement:true,HTMLParagraphElement:true,HTMLParamElement:true,HTMLPictureElement:true,HTMLPreElement:true,HTMLProgressElement:true,HTMLQuoteElement:true,HTMLScriptElement:true,HTMLShadowElement:true,HTMLSlotElement:true,HTMLSourceElement:true,HTMLSpanElement:true,HTMLStyleElement:true,HTMLTableCaptionElement:true,HTMLTableCellElement:true,HTMLTableDataCellElement:true,HTMLTableHeaderCellElement:true,HTMLTableColElement:true,HTMLTableElement:true,HTMLTableRowElement:true,HTMLTableSectionElement:true,HTMLTemplateElement:true,HTMLTextAreaElement:true,HTMLTimeElement:true,HTMLTitleElement:true,HTMLTrackElement:true,HTMLUListElement:true,HTMLUnknownElement:true,HTMLVideoElement:true,HTMLDirectoryElement:true,HTMLFontElement:true,HTMLFrameElement:true,HTMLFrameSetElement:true,HTMLMarqueeElement:true,HTMLElement:false,HTMLAnchorElement:true,HTMLAreaElement:true,CDATASection:true,CharacterData:true,Comment:true,ProcessingInstruction:true,Text:true,CSSStyleDeclaration:true,MSStyleCSSProperties:true,CSS2Properties:true,DOMException:true,DOMTokenList:true,MathMLElement:true,Element:false,Window:true,DOMWindow:true,EventTarget:false,HTMLFormElement:true,HTMLCollection:true,HTMLFormControlsCollection:true,HTMLOptionsCollection:true,Document:true,DocumentFragment:true,HTMLDocument:true,ShadowRoot:true,XMLDocument:true,Attr:true,DocumentType:true,Node:false,NodeList:true,RadioNodeList:true,HTMLSelectElement:true,NamedNodeMap:true,MozNamedAttrMap:true,SVGAElement:true,SVGAnimateElement:true,SVGAnimateMotionElement:true,SVGAnimateTransformElement:true,SVGAnimationElement:true,SVGCircleElement:true,SVGClipPathElement:true,SVGDefsElement:true,SVGDescElement:true,SVGDiscardElement:true,SVGEllipseElement:true,SVGFEBlendElement:true,SVGFEColorMatrixElement:true,SVGFEComponentTransferElement:true,SVGFECompositeElement:true,SVGFEConvolveMatrixElement:true,SVGFEDiffuseLightingElement:true,SVGFEDisplacementMapElement:true,SVGFEDistantLightElement:true,SVGFEFloodElement:true,SVGFEFuncAElement:true,SVGFEFuncBElement:true,SVGFEFuncGElement:true,SVGFEFuncRElement:true,SVGFEGaussianBlurElement:true,SVGFEImageElement:true,SVGFEMergeElement:true,SVGFEMergeNodeElement:true,SVGFEMorphologyElement:true,SVGFEOffsetElement:true,SVGFEPointLightElement:true,SVGFESpecularLightingElement:true,SVGFESpotLightElement:true,SVGFETileElement:true,SVGFETurbulenceElement:true,SVGFilterElement:true,SVGForeignObjectElement:true,SVGGElement:true,SVGGeometryElement:true,SVGGraphicsElement:true,SVGImageElement:true,SVGLineElement:true,SVGLinearGradientElement:true,SVGMarkerElement:true,SVGMaskElement:true,SVGMetadataElement:true,SVGPathElement:true,SVGPatternElement:true,SVGPolygonElement:true,SVGPolylineElement:true,SVGRadialGradientElement:true,SVGRectElement:true,SVGScriptElement:true,SVGSetElement:true,SVGStopElement:true,SVGStyleElement:true,SVGElement:true,SVGSVGElement:true,SVGSwitchElement:true,SVGSymbolElement:true,SVGTSpanElement:true,SVGTextContentElement:true,SVGTextElement:true,SVGTextPathElement:true,SVGTextPositioningElement:true,SVGTitleElement:true,SVGUseElement:true,SVGViewElement:true,SVGGradientElement:true,SVGComponentTransferFunctionElement:true,SVGFEDropShadowElement:true,SVGMPathElement:true})})()
convertAllToFastObject(w)
convertToFastObject($);(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!="undefined"){a(document.currentScript)
return}var t=document.scripts
function onLoad(b){for(var r=0;r<t.length;++r)t[r].removeEventListener("load",onLoad,false)
a(b.target)}for(var s=0;s<t.length;++s)t[s].addEventListener("load",onLoad,false)})(function(a){v.currentScript=a
var t=A.dL
if(typeof dartMainRunner==="function")dartMainRunner(t,[])
else t([])})})()