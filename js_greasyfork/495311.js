// ==UserScript==
// @name            ReYGGTools
// @namespace       ReYGGTools
// @version         1.0.190
// @description     Ajout d'améliorations pour le site YGG (reprise de YGGTools by FERVEX)
// @author          Invincible812, Fervex, Esperlu&te
// @supportURL      https://www.ygg.re/profile/9385666-invincible813
// @compatible      firefox Violentmonkey
// @compatible      chrome Violentmonkey
// @compatible      brave Violentmonkey
// @compatible      opera Violentmonkey
// @icon            https://i.ibb.co/dJ0kSQq/Re-YGGTools.png
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM.xmlHttpRequest
// @include         https://*.ygg.*
// @include         https://*.yggtorrent.*
// @include         https://ygg.*
// @include         https://yggtorrent.*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @ressource       https://cdn.datatables.net/v/bs4/dt-2.0.7/cr-2.0.2/r-3.0.2/rr-1.5.0/datatables.min.css
// @downloadURL https://update.greasyfork.org/scripts/495311/ReYGGTools.user.js
// @updateURL https://update.greasyfork.org/scripts/495311/ReYGGTools.meta.js
// ==/UserScript==

/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs4/dt-2.0.7/cr-2.0.2/r-3.0.2/rr-1.5.0
 *
 * Included libraries:
 *  DataTables 2.0.7, ColReorder 2.0.2, Responsive 3.0.2, RowReorder 1.5.0
 */

/*! DataTables 2.0.7
 * © SpryMedia Ltd - datatables.net/license
 */
!function(n){"use strict";var a;"function"==typeof define&&define.amd?define(["jquery"],function(t){return n(t,window,document)}):"object"==typeof exports?(a=require("jquery"),"undefined"==typeof window?module.exports=function(t,e){return t=t||window,e=e||a(t),n(e,t,t.document)}:module.exports=n(a,window,window.document)):window.DataTable=n(jQuery,window,document)}(function(V,q,_){"use strict";function g(t){var e=parseInt(t,10);return!isNaN(e)&&isFinite(t)?e:null}function o(t,e,n){var a=typeof t,r="string"==a;return"number"==a||"bigint"==a||!!y(t)||(e&&r&&(t=R(t,e)),n&&r&&(t=t.replace(P,"")),!isNaN(parseFloat(t))&&isFinite(t))}function l(t,e,n){var a;return!!y(t)||("string"!=typeof t||!t.match(/<(input|select)/i))&&(y(a=t)||"string"==typeof a)&&!!o(I(t),e,n)||null}function m(t,e,n,a){var r=[],o=0,i=e.length;if(void 0!==a)for(;o<i;o++)t[e[o]][n]&&r.push(t[e[o]][n][a]);else for(;o<i;o++)t[e[o]]&&r.push(t[e[o]][n]);return r}function h(t,e){var n,a=[];void 0===e?(e=0,n=t):(n=e,e=t);for(var r=e;r<n;r++)a.push(r);return a}function b(t){for(var e=[],n=0,a=t.length;n<a;n++)t[n]&&e.push(t[n]);return e}var C,U,e,t,$=function(t,H){var W,X,B;return $.factory(t,H)?$:this instanceof $?V(t).DataTable(H):(X=void 0===(H=t),B=(W=this).length,X&&(H={}),this.api=function(){return new U(this)},this.each(function(){var n=1<B?Zt({},H,!0):H,a=0,t=this.getAttribute("id"),r=!1,e=$.defaults,o=V(this);if("table"!=this.nodeName.toLowerCase())Z(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{V(this).trigger("options.dt",n),nt(e),at(e.column),z(e,e,!0),z(e.column,e.column,!0),z(e,V.extend(n,o.data()),!0);for(var i=$.settings,a=0,l=i.length;a<l;a++){var s=i[a];if(s.nTable==this||s.nTHead&&s.nTHead.parentNode==this||s.nTFoot&&s.nTFoot.parentNode==this){var E=(void 0!==n.bRetrieve?n:e).bRetrieve,k=(void 0!==n.bDestroy?n:e).bDestroy;if(X||E)return s.oInstance;if(k){new $.Api(s).destroy();break}return void Z(s,0,"Cannot reinitialise DataTable",3)}if(s.sTableId==this.id){i.splice(a,1);break}}null!==t&&""!==t||(t="DataTables_Table_"+$.ext._unique++,this.id=t);var u=V.extend(!0,{},$.models.oSettings,{sDestroyWidth:o[0].style.width,sInstance:t,sTableId:t,colgroup:V("<colgroup>").prependTo(this),fastData:function(t,e,n){return G(u,t,e,n)}}),t=(u.nTable=this,u.oInit=n,i.push(u),u.api=new U(u),u.oInstance=1===W.length?W:o.dataTable(),nt(n),n.aLengthMenu&&!n.iDisplayLength&&(n.iDisplayLength=Array.isArray(n.aLengthMenu[0])?n.aLengthMenu[0][0]:V.isPlainObject(n.aLengthMenu[0])?n.aLengthMenu[0].value:n.aLengthMenu[0]),n=Zt(V.extend(!0,{},e),n),Q(u.oFeatures,n,["bPaginate","bLengthChange","bFilter","bSort","bSortMulti","bInfo","bProcessing","bAutoWidth","bSortClasses","bServerSide","bDeferRender"]),Q(u,n,["ajax","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","iStateDuration","bSortCellsTop","iTabIndex","sDom","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId","caption","layout",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"]]),Q(u.oScroll,n,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]),Q(u.oLanguage,n,"fnInfoCallback"),K(u,"aoDrawCallback",n.fnDrawCallback),K(u,"aoStateSaveParams",n.fnStateSaveParams),K(u,"aoStateLoadParams",n.fnStateLoadParams),K(u,"aoStateLoaded",n.fnStateLoaded),K(u,"aoRowCallback",n.fnRowCallback),K(u,"aoRowCreatedCallback",n.fnCreatedRow),K(u,"aoHeaderCallback",n.fnHeaderCallback),K(u,"aoFooterCallback",n.fnFooterCallback),K(u,"aoInitComplete",n.fnInitComplete),K(u,"aoPreDrawCallback",n.fnPreDrawCallback),u.rowIdFn=J(n.rowId),u),c=($.__browser||(P={},$.__browser=P,j=V("<div/>").css({position:"fixed",top:0,left:-1*q.pageXOffset,height:1,width:1,overflow:"hidden"}).append(V("<div/>").css({position:"absolute",top:1,left:1,width:100,overflow:"scroll"}).append(V("<div/>").css({width:"100%",height:10}))).appendTo("body"),p=j.children(),O=p.children(),P.barWidth=p[0].offsetWidth-p[0].clientWidth,P.bScrollbarLeft=1!==Math.round(O.offset().left),j.remove()),V.extend(t.oBrowser,$.__browser),t.oScroll.iBarWidth=$.__browser.barWidth,u.oClasses),d=(V.extend(c,$.ext.classes,n.oClasses),o.addClass(c.table),u.oFeatures.bPaginate||(n.iDisplayStart=0),void 0===u.iInitDisplayStart&&(u.iInitDisplayStart=n.iDisplayStart,u._iDisplayStart=n.iDisplayStart),u.oLanguage),f=(V.extend(!0,d,n.oLanguage),d.sUrl?(V.ajax({dataType:"json",url:d.sUrl,success:function(t){z(e.oLanguage,t),V.extend(!0,d,t,u.oInit.oLanguage),tt(u,null,"i18n",[u],!0),Et(u)},error:function(){Z(u,0,"i18n file loading error",21),Et(u)}}),r=!0):tt(u,null,"i18n",[u]),[]),h=this.getElementsByTagName("thead"),p=It(u,h[0]);if(n.aoColumns)f=n.aoColumns;else if(p.length)for(l=p[a=0].length;a<l;a++)f.push(null);for(a=0,l=f.length;a<l;a++)rt(u);var g,v,m,b,y,D,x,S=u,T=n.aoColumnDefs,w=f,M=p,_=function(t,e){ot(u,t,e)},C=S.aoColumns;if(w)for(g=0,v=w.length;g<v;g++)w[g]&&w[g].name&&(C[g].sName=w[g].name);if(T)for(g=T.length-1;0<=g;g--){var I=void 0!==(x=T[g]).target?x.target:void 0!==x.targets?x.targets:x.aTargets;for(Array.isArray(I)||(I=[I]),m=0,b=I.length;m<b;m++){var A=I[m];if("number"==typeof A&&0<=A){for(;C.length<=A;)rt(S);_(A,x)}else if("number"==typeof A&&A<0)_(C.length+A,x);else if("string"==typeof A)for(y=0,D=C.length;y<D;y++)"_all"===A?_(y,x):-1!==A.indexOf(":name")?C[y].sName===A.replace(":name","")&&_(y,x):M.forEach(function(t){t[y]&&(t=V(t[y].cell),A.match(/^[a-z][\w-]*$/i)&&(A="."+A),t.is(A))&&_(y,x)})}}if(w)for(g=0,v=w.length;g<v;g++)_(g,w[g]);var L,F,N,j,P=o.children("tbody").find("tr").eq(0),R=(P.length&&(L=function(t,e){return null!==t.getAttribute("data-"+e)?e:null},V(P[0]).children("th, td").each(function(t,e){var n,a=u.aoColumns[t];a||Z(u,0,"Incorrect column count",18),a.mData===t&&(n=L(e,"sort")||L(e,"order"),e=L(e,"filter")||L(e,"search"),null===n&&null===e||(a.mData={_:t+".display",sort:null!==n?t+".@data-"+n:void 0,type:null!==n?t+".@data-"+n:void 0,filter:null!==e?t+".@data-"+e:void 0},a._isArrayHost=!0,ot(u,t)))})),u.oFeatures),O=function(){if(void 0===n.aaSorting){var t=u.aaSorting;for(a=0,l=t.length;a<l;a++)t[a][1]=u.aoColumns[a].asSorting[0]}Yt(u),K(u,"aoDrawCallback",function(){(u.bSorted||"ssp"===et(u)||R.bDeferRender)&&Yt(u)});var e=o.children("caption"),e=(u.caption&&(e=0===e.length?V("<caption/>").appendTo(o):e).html(u.caption),e.length&&(e[0]._captionSide=e.css("caption-side"),u.captionNode=e[0]),0===h.length&&(h=V("<thead/>").appendTo(o)),u.nTHead=h[0],V("tr",h).addClass(c.thead.row),o.children("tbody")),e=(0===e.length&&(e=V("<tbody/>").insertAfter(h)),u.nTBody=e[0],o.children("tfoot"));if(0===e.length&&(e=V("<tfoot/>").appendTo(o)),u.nTFoot=e[0],V("tr",e).addClass(c.tfoot.row),n.aaData)for(a=0;a<n.aaData.length;a++)Y(u,n.aaData[a]);else"dom"==et(u)&&ut(u,V(u.nTBody).children("tr"));u.aiDisplay=u.aiDisplayMaster.slice(),!(u.bInitialised=!0)===r&&Et(u)};K(u,"aoDrawCallback",Gt),n.bStateSave?(R.bStateSave=!0,N=O,(F=u).oFeatures.bStateSave?void 0!==(j=F.fnStateLoadCallback.call(F.oInstance,F,function(t){Jt(F,t,N)}))&&Jt(F,j,N):N()):O()}}),W=null,this)},c=($.ext=C={buttons:{},classes:{},builder:"bs4/dt-2.0.7/cr-2.0.2/r-3.0.2/rr-1.5.0",errMode:"alert",feature:[],features:{},search:[],selector:{cell:[],column:[],row:[]},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{className:{},detect:[],render:{},search:{},order:{}},_unique:0,fnVersionCheck:$.fnVersionCheck,iApiIndex:0,sVersion:$.version},V.extend(C,{afnFiltering:C.search,aTypes:C.type.detect,ofnSearch:C.type.search,oSort:C.type.order,afnSortData:C.order,aoFeatures:C.feature,oStdClasses:C.classes,oPagination:C.pager}),V.extend($.ext.classes,{container:"dt-container",empty:{row:"dt-empty"},info:{container:"dt-info"},length:{container:"dt-length",select:"dt-input"},order:{canAsc:"dt-orderable-asc",canDesc:"dt-orderable-desc",isAsc:"dt-ordering-asc",isDesc:"dt-ordering-desc",none:"dt-orderable-none",position:"sorting_"},processing:{container:"dt-processing"},scrolling:{body:"dt-scroll-body",container:"dt-scroll",footer:{self:"dt-scroll-foot",inner:"dt-scroll-footInner"},header:{self:"dt-scroll-head",inner:"dt-scroll-headInner"}},search:{container:"dt-search",input:"dt-input"},table:"dataTable",tbody:{cell:"",row:""},thead:{cell:"",row:""},tfoot:{cell:"",row:""},paging:{active:"current",button:"dt-paging-button",container:"dt-paging",disabled:"disabled"}}),{}),d=/[\r\n\u2028]/g,L=/<([^>]*>)/g,F=Math.pow(2,28),N=/^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/,j=new RegExp("(\\"+["/",".","*","+","?","|","(",")","[","]","{","}","\\","$","^","-"].join("|\\")+")","g"),P=/['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi,y=function(t){return!t||!0===t||"-"===t},R=function(t,e){return c[e]||(c[e]=new RegExp(Pt(e),"g")),"string"==typeof t&&"."!==e?t.replace(/\./g,"").replace(c[e],"."):t},f=function(t,e,n){var a=[],r=0,o=t.length;if(void 0!==n)for(;r<o;r++)t[r]&&t[r][e]&&a.push(t[r][e][n]);else for(;r<o;r++)t[r]&&a.push(t[r][e]);return a},I=function(t){if(t.length>F)throw new Error("Exceeded max str len");var e;for(t=t.replace(L,"");(t=(e=t).replace(/<script/i,""))!==e;);return e},u=function(t){return"string"==typeof(t=Array.isArray(t)?t.join(","):t)?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):t},O=function(t,e){var n;return"string"!=typeof t?t:(n=t.normalize("NFD")).length!==t.length?(!0===e?t+" ":"")+n.replace(/[\u0300-\u036f]/g,""):n},x=function(t){if(Array.from&&Set)return Array.from(new Set(t));if(function(t){if(!(t.length<2))for(var e=t.slice().sort(),n=e[0],a=1,r=e.length;a<r;a++){if(e[a]===n)return!1;n=e[a]}return!0}(t))return t.slice();var e,n,a,r=[],o=t.length,i=0;t:for(n=0;n<o;n++){for(e=t[n],a=0;a<i;a++)if(r[a]===e)continue t;r.push(e),i++}return r},E=function(t,e){if(Array.isArray(e))for(var n=0;n<e.length;n++)E(t,e[n]);else t.push(e);return t};function D(e,t){t&&t.split(" ").forEach(function(t){t&&e.classList.add(t)})}function k(e){var n,a,r={};V.each(e,function(t){(n=t.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(n[1]+" ")&&(a=t.replace(n[0],n[2].toLowerCase()),r[a]=t,"o"===n[1])&&k(e[t])}),e._hungarianMap=r}function z(e,n,a){var r;e._hungarianMap||k(e),V.each(n,function(t){void 0===(r=e._hungarianMap[t])||!a&&void 0!==n[r]||("o"===r.charAt(0)?(n[r]||(n[r]={}),V.extend(!0,n[r],n[t]),z(e[r],n[r],a)):n[r]=n[t])})}$.util={diacritics:function(t,e){if("function"!=typeof t)return O(t,e);O=t},debounce:function(n,a){var r;return function(){var t=this,e=arguments;clearTimeout(r),r=setTimeout(function(){n.apply(t,e)},a||250)}},throttle:function(a,t){var r,o,i=void 0!==t?t:200;return function(){var t=this,e=+new Date,n=arguments;r&&e<r+i?(clearTimeout(o),o=setTimeout(function(){r=void 0,a.apply(t,n)},i)):(r=e,a.apply(t,n))}},escapeRegex:function(t){return t.replace(j,"\\$1")},set:function(a){var f;return V.isPlainObject(a)?$.util.set(a._):null===a?function(){}:"function"==typeof a?function(t,e,n){a(t,"set",e,n)}:"string"!=typeof a||-1===a.indexOf(".")&&-1===a.indexOf("[")&&-1===a.indexOf("(")?function(t,e){t[a]=e}:(f=function(t,e,n){for(var a,r,o,i,l=ft(n),n=l[l.length-1],s=0,u=l.length-1;s<u;s++){if("__proto__"===l[s]||"constructor"===l[s])throw new Error("Cannot set prototype values");if(a=l[s].match(dt),r=l[s].match(p),a){if(l[s]=l[s].replace(dt,""),t[l[s]]=[],(a=l.slice()).splice(0,s+1),i=a.join("."),Array.isArray(e))for(var c=0,d=e.length;c<d;c++)f(o={},e[c],i),t[l[s]].push(o);else t[l[s]]=e;return}r&&(l[s]=l[s].replace(p,""),t=t[l[s]](e)),null!==t[l[s]]&&void 0!==t[l[s]]||(t[l[s]]={}),t=t[l[s]]}n.match(p)?t[n.replace(p,"")](e):t[n.replace(dt,"")]=e},function(t,e){return f(t,e,a)})},get:function(r){var o,f;return V.isPlainObject(r)?(o={},V.each(r,function(t,e){e&&(o[t]=$.util.get(e))}),function(t,e,n,a){var r=o[e]||o._;return void 0!==r?r(t,e,n,a):t}):null===r?function(t){return t}:"function"==typeof r?function(t,e,n,a){return r(t,e,n,a)}:"string"!=typeof r||-1===r.indexOf(".")&&-1===r.indexOf("[")&&-1===r.indexOf("(")?function(t){return t[r]}:(f=function(t,e,n){var a,r,o;if(""!==n)for(var i=ft(n),l=0,s=i.length;l<s;l++){if(d=i[l].match(dt),a=i[l].match(p),d){if(i[l]=i[l].replace(dt,""),""!==i[l]&&(t=t[i[l]]),r=[],i.splice(0,l+1),o=i.join("."),Array.isArray(t))for(var u=0,c=t.length;u<c;u++)r.push(f(t[u],e,o));var d=d[0].substring(1,d[0].length-1);t=""===d?r:r.join(d);break}if(a)i[l]=i[l].replace(p,""),t=t[i[l]]();else{if(null===t||null===t[i[l]])return null;if(void 0===t||void 0===t[i[l]])return;t=t[i[l]]}}return t},function(t,e){return f(t,e,r)})},stripHtml:function(t){var e=typeof t;if("function"!=e)return"string"==e?I(t):t;I=t},escapeHtml:function(t){var e=typeof t;if("function"!=e)return"string"==e||Array.isArray(t)?u(t):t;u=t},unique:x};var r=function(t,e,n){void 0!==t[e]&&(t[n]=t[e])};function nt(t){r(t,"ordering","bSort"),r(t,"orderMulti","bSortMulti"),r(t,"orderClasses","bSortClasses"),r(t,"orderCellsTop","bSortCellsTop"),r(t,"order","aaSorting"),r(t,"orderFixed","aaSortingFixed"),r(t,"paging","bPaginate"),r(t,"pagingType","sPaginationType"),r(t,"pageLength","iDisplayLength"),r(t,"searching","bFilter"),"boolean"==typeof t.sScrollX&&(t.sScrollX=t.sScrollX?"100%":""),"boolean"==typeof t.scrollX&&(t.scrollX=t.scrollX?"100%":"");var e=t.aoSearchCols;if(e)for(var n=0,a=e.length;n<a;n++)e[n]&&z($.models.oSearch,e[n]);t.serverSide&&!t.searchDelay&&(t.searchDelay=400)}function at(t){r(t,"orderable","bSortable"),r(t,"orderData","aDataSort"),r(t,"orderSequence","asSorting"),r(t,"orderDataType","sortDataType");var e=t.aDataSort;"number"!=typeof e||Array.isArray(e)||(t.aDataSort=[e])}function rt(t){var e=$.defaults.column,n=t.aoColumns.length,e=V.extend({},$.models.oColumn,e,{aDataSort:e.aDataSort||[n],mData:e.mData||n,idx:n,searchFixed:{},colEl:V("<col>").attr("data-dt-column",n)}),e=(t.aoColumns.push(e),t.aoPreSearchCols);e[n]=V.extend({},$.models.oSearch,e[n])}function ot(t,e,n){function a(t){return"string"==typeof t&&-1!==t.indexOf("@")}var r=t.aoColumns[e],o=(null!=n&&(at(n),z($.defaults.column,n,!0),void 0===n.mDataProp||n.mData||(n.mData=n.mDataProp),n.sType&&(r._sManualType=n.sType),n.className&&!n.sClass&&(n.sClass=n.className),e=r.sClass,V.extend(r,n),Q(r,n,"sWidth","sWidthOrig"),e!==r.sClass&&(r.sClass=e+" "+r.sClass),void 0!==n.iDataSort&&(r.aDataSort=[n.iDataSort]),Q(r,n,"aDataSort")),r.mData),i=J(o);r.mRender&&Array.isArray(r.mRender)&&(n=(e=r.mRender.slice()).shift(),r.mRender=$.render[n].apply(q,e)),r._render=r.mRender?J(r.mRender):null;r._bAttrSrc=V.isPlainObject(o)&&(a(o.sort)||a(o.type)||a(o.filter)),r._setter=null,r.fnGetData=function(t,e,n){var a=i(t,e,void 0,n);return r._render&&e?r._render(a,e,t,n):a},r.fnSetData=function(t,e,n){return v(o)(t,e,n)},"number"==typeof o||r._isArrayHost||(t._rowReadObject=!0),t.oFeatures.bSort||(r.bSortable=!1)}function M(t){var e=t;if(e.oFeatures.bAutoWidth){var n,a,r=e.nTable,o=e.aoColumns,i=e.oScroll,l=i.sY,s=i.sX,i=i.sXInner,u=X(e,"bVisible"),c=r.getAttribute("width"),d=r.parentNode,f=r.style.width,f=(f&&-1!==f.indexOf("%")&&(c=f),tt(e,null,"column-calc",{visible:u},!1),V(r.cloneNode()).css("visibility","hidden").removeAttr("id")),h=(f.append("<tbody>"),V("<tr/>").appendTo(f.find("tbody")));for(f.append(V(e.nTHead).clone()).append(V(e.nTFoot).clone()),f.find("tfoot th, tfoot td").css("width",""),f.find("thead th, thead td").each(function(){var t=lt(e,this,!0,!1);t?(this.style.width=t,s&&V(this).append(V("<div/>").css({width:t,margin:0,padding:0,border:0,height:1}))):this.style.width=""}),n=0;n<u.length;n++){p=u[n],a=o[p];var p=function(t,e){var n=t.aoColumns[e];if(!n.maxLenString){for(var a,r="",o=-1,i=0,l=t.aiDisplayMaster.length;i<l;i++){var s=t.aiDisplayMaster[i],s=mt(t,s)[e],s=s&&"object"==typeof s&&s.nodeType?s.innerHTML:s+"";s=s.replace(/id=".*?"/g,"").replace(/name=".*?"/g,""),(a=I(s).replace(/&nbsp;/g," ")).length>o&&(r=s,o=a.length)}n.maxLenString=r}return n.maxLenString}(e,p),g=C.type.className[a.sType],v=p+a.sContentPadding,p=-1===p.indexOf("<")?_.createTextNode(v):v;V("<td/>").addClass(g).addClass(a.sClass).append(p).appendTo(h)}V("[name]",f).removeAttr("name");var m=V("<div/>").css(s||l?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(f).appendTo(d),b=(s&&i?f.width(i):s?(f.css("width","auto"),f.removeAttr("width"),f.width()<d.clientWidth&&c&&f.width(d.clientWidth)):l?f.width(d.clientWidth):c&&f.width(c),0),y=f.find("tbody tr").eq(0).children();for(n=0;n<u.length;n++){var D=y[n].getBoundingClientRect().width;b+=D,o[u[n]].sWidth=A(D)}r.style.width=A(b),m.remove(),c&&(r.style.width=A(c)),!c&&!s||e._reszEvt||(V(q).on("resize.DT-"+e.sInstance,$.util.throttle(function(){e.bDestroying||M(e)})),e._reszEvt=!0)}for(var x=t,S=x.aoColumns,T=0;T<S.length;T++){var w=lt(x,[T],!1,!1);S[T].colEl.css("width",w)}i=t.oScroll;""===i.sY&&""===i.sX||Xt(t),tt(t,null,"column-sizing",[t])}function H(t,e){t=X(t,"bVisible");return"number"==typeof t[e]?t[e]:null}function T(t,e){t=X(t,"bVisible").indexOf(e);return-1!==t?t:null}function W(t){var e=t.aoHeader,n=t.aoColumns,a=0;if(e.length)for(var r=0,o=e[0].length;r<o;r++)n[r].bVisible&&"none"!==V(e[0][r].cell).css("display")&&a++;return a}function X(t,n){var a=[];return t.aoColumns.map(function(t,e){t[n]&&a.push(e)}),a}function B(t){for(var e,n,a,r,o,i,l,s=t.aoColumns,u=t.aoData,c=$.ext.type.detect,d=0,f=s.length;d<f;d++){if(l=[],!(o=s[d]).sType&&o._sManualType)o.sType=o._sManualType;else if(!o.sType){for(e=0,n=c.length;e<n;e++){for(a=0,r=u.length;a<r;a++)if(u[a]){if(void 0===l[a]&&(l[a]=G(t,a,d,"type")),!(i=c[e](l[a],t))&&e!==c.length-2)break;if("html"===i&&!y(l[a]))break}if(i){o.sType=i;break}}o.sType||(o.sType="string")}var h=C.type.className[o.sType],h=(h&&(it(t.aoHeader,d,h),it(t.aoFooter,d,h)),C.type.render[o.sType]);if(h&&!o._render){o._render=$.util.get(h),p=b=m=v=g=void 0;for(var p,g=t,v=d,m=g.aoData,b=0;b<m.length;b++)m[b].nTr&&(p=G(g,b,v,"display"),m[b].displayData[v]=p,ct(m[b].anCells[v],p))}}}function it(t,e,n){t.forEach(function(t){t[e]&&t[e].unique&&D(t[e].cell,n)})}function lt(t,e,n,a){Array.isArray(e)||(e=st(e));for(var r,o=0,i=t.aoColumns,l=0,s=e.length;l<s;l++){var u=i[e[l]],c=n?u.sWidthOrig:u.sWidth;if(a||!1!==u.bVisible){if(null==c)return null;"number"==typeof c?(r="px",o+=c):(u=c.match(/([\d\.]+)([^\d]*)/))&&(o+=+u[1],r=3===u.length?u[2]:"px")}}return o+r}function st(t){t=V(t).closest("[data-dt-column]").attr("data-dt-column");return t?t.split(",").map(function(t){return+t}):[]}function Y(t,e,n,a){for(var r=t.aoData.length,o=V.extend(!0,{},$.models.oRow,{src:n?"dom":"data",idx:r}),i=(o._aData=e,t.aoData.push(o),t.aoColumns),l=0,s=i.length;l<s;l++)i[l].sType=null;t.aiDisplayMaster.push(r);e=t.rowIdFn(e);return void 0!==e&&(t.aIds[e]=o),!n&&t.oFeatures.bDeferRender||bt(t,r,n,a),r}function ut(n,t){var a;return(t=t instanceof V?t:V(t)).map(function(t,e){return a=vt(n,e),Y(n,a.data,e,a.cells)})}function G(t,e,n,a){"search"===a?a="filter":"order"===a&&(a="sort");var r=t.aoData[e];if(r){var o=t.iDraw,i=t.aoColumns[n],r=r._aData,l=i.sDefaultContent,s=i.fnGetData(r,a,{settings:t,row:e,col:n});if(void 0===(s="display"!==a&&s&&"object"==typeof s&&s.nodeName?s.innerHTML:s))return t.iDrawError!=o&&null===l&&(Z(t,0,"Requested unknown parameter "+("function"==typeof i.mData?"{function}":"'"+i.mData+"'")+" for row "+e+", column "+n,4),t.iDrawError=o),l;if(s!==r&&null!==s||null===l||void 0===a){if("function"==typeof s)return s.call(r)}else s=l;return null===s&&"display"===a?"":s="filter"===a&&(e=$.ext.type.search)[i.sType]?e[i.sType](s):s}}function ct(t,e){e&&"object"==typeof e&&e.nodeName?V(t).empty().append(e):t.innerHTML=e}var dt=/\[.*?\]$/,p=/\(\)$/;function ft(t){return(t.match(/(\\.|[^.])+/g)||[""]).map(function(t){return t.replace(/\\\./g,".")})}var J=$.util.get,v=$.util.set;function ht(t){return f(t.aoData,"_aData")}function pt(t){t.aoData.length=0,t.aiDisplayMaster.length=0,t.aiDisplay.length=0,t.aIds={}}function gt(t,e,n,a){var r,o,i=t.aoData[e];if(i._aSortData=null,i._aFilterData=null,i.displayData=null,"dom"!==n&&(n&&"auto"!==n||"dom"!==i.src)){var l=i.anCells,s=mt(t,e);if(l)if(void 0!==a)ct(l[a],s[a]);else for(r=0,o=l.length;r<o;r++)ct(l[r],s[r])}else i._aData=vt(t,i,a,void 0===a?void 0:i._aData).data;var u=t.aoColumns;if(void 0!==a)u[a].sType=null,u[a].maxLenString=null;else{for(r=0,o=u.length;r<o;r++)u[r].sType=null,u[r].maxLenString=null;yt(t,i)}}function vt(t,e,n,a){function r(t,e){var n;"string"==typeof t&&-1!==(n=t.indexOf("@"))&&(n=t.substring(n+1),v(t)(a,e.getAttribute(n)))}function o(t){void 0!==n&&n!==d||(l=f[d],s=t.innerHTML.trim(),l&&l._bAttrSrc?(v(l.mData._)(a,s),r(l.mData.sort,t),r(l.mData.type,t),r(l.mData.filter,t)):h?(l._setter||(l._setter=v(l.mData)),l._setter(a,s)):a[d]=s),d++}var i,l,s,u=[],c=e.firstChild,d=0,f=t.aoColumns,h=t._rowReadObject;a=void 0!==a?a:h?{}:[];if(c)for(;c;)"TD"!=(i=c.nodeName.toUpperCase())&&"TH"!=i||(o(c),u.push(c)),c=c.nextSibling;else for(var p=0,g=(u=e.anCells).length;p<g;p++)o(u[p]);var e=e.firstChild?e:e.nTr;return e&&(e=e.getAttribute("id"))&&v(t.rowId)(a,e),{data:a,cells:u}}function mt(t,e){var n=t.aoData[e],a=t.aoColumns;if(!n.displayData){n.displayData=[];for(var r=0,o=a.length;r<o;r++)n.displayData.push(G(t,e,r,"display"))}return n.displayData}function bt(t,e,n,a){var r,o,i,l,s,u,c=t.aoData[e],d=c._aData,f=[],h=t.oClasses.tbody.row;if(null===c.nTr){for(r=n||_.createElement("tr"),c.nTr=r,c.anCells=f,D(r,h),r._DT_RowIndex=e,yt(t,c),l=0,s=t.aoColumns.length;l<s;l++){i=t.aoColumns[l],(o=(u=!n||!a[l])?_.createElement(i.sCellType):a[l])||Z(t,0,"Incorrect column count",18),o._DT_CellIndex={row:e,column:l},f.push(o);var p=mt(t,e);!u&&(!i.mRender&&i.mData===l||V.isPlainObject(i.mData)&&i.mData._===l+".display")||ct(o,p[l]),i.bVisible&&u?r.appendChild(o):i.bVisible||u||o.parentNode.removeChild(o),i.fnCreatedCell&&i.fnCreatedCell.call(t.oInstance,o,G(t,e,l),d,e,l)}tt(t,"aoRowCreatedCallback","row-created",[r,d,e,f])}else D(c.nTr,h)}function yt(t,e){var n=e.nTr,a=e._aData;n&&((t=t.rowIdFn(a))&&(n.id=t),a.DT_RowClass&&(t=a.DT_RowClass.split(" "),e.__rowc=e.__rowc?x(e.__rowc.concat(t)):t,V(n).removeClass(e.__rowc.join(" ")).addClass(a.DT_RowClass)),a.DT_RowAttr&&V(n).attr(a.DT_RowAttr),a.DT_RowData)&&V(n).data(a.DT_RowData)}function Dt(t,e){var n,a=t.oClasses,r=t.aoColumns,o="header"===e?t.nTHead:t.nTFoot,i="header"===e?"sTitle":e;if(o){if(("header"===e||f(t.aoColumns,i).join(""))&&1===(n=(n=V("tr",o)).length?n:V("<tr/>").appendTo(o)).length)for(var l=V("td, th",n).length,s=r.length;l<s;l++)V("<th/>").html(r[l][i]||"").appendTo(n);var u=It(t,o,!0);"header"===e?t.aoHeader=u:t.aoFooter=u,V(o).children("tr").attr("role","row"),V(o).children("tr").children("th, td").each(function(){te(t,e)(t,V(this),a)})}}function xt(t,e,n){var a,r,o,i,l,s=[],u=[],c=t.aoColumns,t=c.length;if(e){for(n=n||h(t).filter(function(t){return c[t].bVisible}),a=0;a<e.length;a++)s[a]=e[a].slice().filter(function(t,e){return n.includes(e)}),u.push([]);for(a=0;a<s.length;a++)for(r=0;r<s[a].length;r++)if(l=i=1,void 0===u[a][r]){for(o=s[a][r].cell;void 0!==s[a+i]&&s[a][r].cell==s[a+i][r].cell;)u[a+i][r]=null,i++;for(;void 0!==s[a][r+l]&&s[a][r].cell==s[a][r+l].cell;){for(var d=0;d<i;d++)u[a+d][r+l]=null;l++}var f=V("span.dt-column-title",o);u[a][r]={cell:o,colspan:l,rowspan:i,title:(f.length?f:V(o)).html()}}return u}}function St(t,e){for(var n,a,r=xt(t,e),o=0;o<e.length;o++){if(n=e[o].row)for(;a=n.firstChild;)n.removeChild(a);for(var i=0;i<r[o].length;i++){var l=r[o][i];l&&V(l.cell).appendTo(n).attr("rowspan",l.rowspan).attr("colspan",l.colspan)}}}function S(t,e){if(r="ssp"==et(s=t),void 0!==(i=s.iInitDisplayStart)&&-1!==i&&(s._iDisplayStart=!r&&i>=s.fnRecordsDisplay()?0:i,s.iInitDisplayStart=-1),-1!==tt(t,"aoPreDrawCallback","preDraw",[t]).indexOf(!1))w(t,!1);else{var l,n=[],a=0,r="ssp"==et(t),o=t.aiDisplay,i=t._iDisplayStart,s=t.fnDisplayEnd(),u=t.aoColumns,c=V(t.nTBody);if(t.bDrawing=!0,r){if(!t.bDestroying&&!e)return 0===t.iDraw&&c.empty().append(Tt(t)),(l=t).iDraw++,w(l,!0),void At(l,function(e){function n(t,e){return"function"==typeof a[t][e]?"function":a[t][e]}var a=e.aoColumns,t=e.oFeatures,r=e.oPreviousSearch,o=e.aoPreSearchCols;return{draw:e.iDraw,columns:a.map(function(e,t){return{data:n(t,"mData"),name:e.sName,searchable:e.bSearchable,orderable:e.bSortable,search:{value:o[t].search,regex:o[t].regex,fixed:Object.keys(e.searchFixed).map(function(t){return{name:t,term:e.searchFixed[t].toString()}})}}}),order:$t(e).map(function(t){return{column:t.col,dir:t.dir,name:n(t.col,"sName")}}),start:e._iDisplayStart,length:t.bPaginate?e._iDisplayLength:-1,search:{value:r.search,regex:r.regex,fixed:Object.keys(e.searchFixed).map(function(t){return{name:t,term:e.searchFixed[t].toString()}})}}}(l),function(t){var e=l,n=Lt(e,t=t),a=Ft(e,"draw",t),r=Ft(e,"recordsTotal",t),t=Ft(e,"recordsFiltered",t);if(void 0!==a){if(+a<e.iDraw)return;e.iDraw=+a}n=n||[],pt(e),e._iRecordsTotal=parseInt(r,10),e._iRecordsDisplay=parseInt(t,10);for(var o=0,i=n.length;o<i;o++)Y(e,n[o]);e.aiDisplay=e.aiDisplayMaster.slice(),S(e,!0),kt(e),w(e,!1)})}else t.iDraw++;if(0!==o.length)for(var d=r?t.aoData.length:s,f=r?0:i;f<d;f++){for(var h=o[f],p=t.aoData[h],g=(null===p.nTr&&bt(t,h),p.nTr),v=0;v<u.length;v++){var m=u[v],b=p.anCells[v];D(b,C.type.className[m.sType]),D(b,m.sClass),D(b,t.oClasses.tbody.cell)}tt(t,"aoRowCallback",null,[g,p._aData,a,f,h]),n.push(g),a++}else n[0]=Tt(t);tt(t,"aoHeaderCallback","header",[V(t.nTHead).children("tr")[0],ht(t),i,s,o]),tt(t,"aoFooterCallback","footer",[V(t.nTFoot).children("tr")[0],ht(t),i,s,o]),c[0].replaceChildren?c[0].replaceChildren.apply(c[0],n):(c.children().detach(),c.append(V(n))),V(t.nTableWrapper).toggleClass("dt-empty-footer",0===V("tr",t.nTFoot).length),tt(t,"aoDrawCallback","draw",[t],!0),t.bSorted=!1,t.bFiltered=!1,t.bDrawing=!1}}function s(t,e,n){var a=t.oFeatures,r=a.bSort,a=a.bFilter;void 0!==n&&!0!==n||(r&&zt(t),a?Nt(t,t.oPreviousSearch):t.aiDisplay=t.aiDisplayMaster.slice()),!0!==e&&(t._iDisplayStart=0),t._drawHold=e,S(t),t._drawHold=!1}function Tt(t){var e=t.oLanguage,n=e.sZeroRecords,a=et(t);return t.iDraw<1&&"ssp"===a||t.iDraw<=1&&"ajax"===a?n=e.sLoadingRecords:e.sEmptyTable&&0===t.fnRecordsTotal()&&(n=e.sEmptyTable),V("<tr/>").append(V("<td />",{colSpan:W(t),class:t.oClasses.empty.row}).html(n))[0]}function wt(t,e,n){for(var i={},a=(V.each(e,function(t,e){if(null!==e){var t=t.replace(/([A-Z])/g," $1").split(" "),n=(i[t[0]]||(i[t[0]]={}),1===t.length?"full":t[1].toLowerCase()),a=i[t[0]],r=function(e,n){V.isPlainObject(n)?Object.keys(n).map(function(t){e.push({feature:t,opts:n[t]})}):e.push(n)};if(a[n]&&a[n].contents||(a[n]={contents:[]}),Array.isArray(e))for(var o=0;o<e.length;o++)r(a[n].contents,e[o]);else r(a[n].contents,e);Array.isArray(a[n].contents)||(a[n].contents=[a[n].contents])}}),Object.keys(i).map(function(t){return 0!==t.indexOf(n)?null:{name:t,val:i[t]}}).filter(function(t){return null!==t})),r=(a.sort(function(t,e){t=+t.name.replace(/[^0-9]/g,"");return+e.name.replace(/[^0-9]/g,"")-t}),"bottom"===n&&a.reverse(),[]),o=0,l=a.length;o<l;o++)a[o].val.full&&(r.push({full:a[o].val.full}),_t(t,r[r.length-1]),delete a[o].val.full),Object.keys(a[o].val).length&&(r.push(a[o].val),_t(t,r[r.length-1]));return r}function _t(o,i){function l(t,e){return C.features[t]||Z(o,0,"Unknown feature: "+t),C.features[t].apply(this,[o,e])}V.each(i,function(t){for(var e,n=i[t].contents,a=0,r=n.length;a<r;a++)n[a]&&("string"==typeof n[a]?n[a]=l(n[a],null):V.isPlainObject(n[a])?n[a]=l(n[a].feature,n[a].opts):"function"==typeof n[a].node?n[a]=n[a].node(o):"function"==typeof n[a]&&(e=n[a](o),n[a]="function"==typeof e.node?e.node():e))})}function Ct(e){var a,t=e.oClasses,n=V(e.nTable),r=V("<div/>").attr({id:e.sTableId+"_wrapper",class:t.container}).insertBefore(n);if(e.nTableWrapper=r[0],e.sDom)for(var o,i,l,s,u,c,d=e,t=e.sDom,f=r,h=t.match(/(".*?")|('.*?')|./g),p=0;p<h.length;p++)o=null,"<"==(i=h[p])?(l=V("<div/>"),"'"!=(s=h[p+1])[0]&&'"'!=s[0]||(s=s.replace(/['"]/g,""),u="",-1!=s.indexOf(".")?(c=s.split("."),u=c[0],c=c[1]):"#"==s[0]?u=s:c=s,l.attr("id",u.substring(1)).addClass(c),p++),f.append(l),f=l):">"==i?f=f.parent():"t"==i?o=Wt(d):$.ext.feature.forEach(function(t){i==t.cFeature&&(o=t.fnInit(d))}),o&&f.append(o);else{var n=wt(e,e.layout,"top"),t=wt(e,e.layout,"bottom"),g=te(e,"layout");n.forEach(function(t){g(e,r,t)}),g(e,r,{full:{table:!0,contents:[Wt(e)]}}),t.forEach(function(t){g(e,r,t)})}var n=e,t=n.nTable,v=""!==n.oScroll.sX||""!==n.oScroll.sY;n.oFeatures.bProcessing&&(a=V("<div/>",{id:n.sTableId+"_processing",class:n.oClasses.processing.container,role:"status"}).html(n.oLanguage.sProcessing).append("<div><div></div><div></div><div></div><div></div></div>"),v?a.prependTo(V("div.dt-scroll",n.nTableWrapper)):a.insertBefore(t),V(t).on("processing.dt.DT",function(t,e,n){a.css("display",n?"block":"none")}))}function It(t,e,n){for(var a,r,o,i,l,s,u=t.aoColumns,c=V(e).children("tr"),d=e&&"thead"===e.nodeName.toLowerCase(),f=[],h=0,p=c.length;h<p;h++)f.push([]);for(h=0,p=c.length;h<p;h++)for(r=(a=c[h]).firstChild;r;){if("TD"==r.nodeName.toUpperCase()||"TH"==r.nodeName.toUpperCase()){var g,v,m,b,y,D=[];for(b=(b=+r.getAttribute("colspan"))&&0!=b&&1!=b?b:1,y=(y=+r.getAttribute("rowspan"))&&0!=y&&1!=y?y:1,l=function(t,e,n){for(var a=t[e];a[n];)n++;return n}(f,h,0),s=1==b,n&&(s&&(ot(t,l,V(r).data()),g=u[l],v=r.getAttribute("width")||null,(m=r.style.width.match(/width:\s*(\d+[pxem%]+)/))&&(v=m[1]),g.sWidthOrig=g.sWidth||v,d?(null===g.sTitle||g.autoTitle||(r.innerHTML=g.sTitle),!g.sTitle&&s&&(g.sTitle=I(r.innerHTML),g.autoTitle=!0)):g.footer&&(r.innerHTML=g.footer),g.ariaTitle||(g.ariaTitle=V(r).attr("aria-label")||g.sTitle),g.className)&&V(r).addClass(g.className),0===V("span.dt-column-title",r).length&&V("<span>").addClass("dt-column-title").append(r.childNodes).appendTo(r),d)&&0===V("span.dt-column-order",r).length&&V("<span>").addClass("dt-column-order").appendTo(r),i=0;i<b;i++){for(o=0;o<y;o++)f[h+o][l+i]={cell:r,unique:s},f[h+o].row=a;D.push(l+i)}r.setAttribute("data-dt-column",x(D).join(","))}r=r.nextSibling}return f}function At(n,t,a){function e(t){var e=n.jqXHR?n.jqXHR.status:null;(null===t||"number"==typeof e&&204==e)&&Lt(n,t={},[]),(e=t.error||t.sError)&&Z(n,0,e),n.json=t,tt(n,null,"xhr",[n,t,n.jqXHR],!0),a(t)}var r,o=n.ajax,i=n.oInstance,l=(V.isPlainObject(o)&&o.data&&(l="function"==typeof(r=o.data)?r(t,n):r,t="function"==typeof r&&l?l:V.extend(!0,t,l),delete o.data),{url:"string"==typeof o?o:"",data:t,success:e,dataType:"json",cache:!1,type:n.sServerMethod,error:function(t,e){-1===tt(n,null,"xhr",[n,null,n.jqXHR],!0).indexOf(!0)&&("parsererror"==e?Z(n,0,"Invalid JSON response",1):4===t.readyState&&Z(n,0,"Ajax error",7)),w(n,!1)}});V.isPlainObject(o)&&V.extend(l,o),n.oAjaxData=t,tt(n,null,"preXhr",[n,t,l],!0),"function"==typeof o?n.jqXHR=o.call(i,t,e,n):""===o.url?(i={},$.util.set(o.dataSrc)(i,[]),e(i)):(n.jqXHR=V.ajax(l),r&&(o.data=r))}function Lt(t,e,n){var a="data";if(V.isPlainObject(t.ajax)&&void 0!==t.ajax.dataSrc&&("string"==typeof(t=t.ajax.dataSrc)||"function"==typeof t?a=t:void 0!==t.data&&(a=t.data)),!n)return"data"===a?e.aaData||e[a]:""!==a?J(a)(e):e;v(a)(e,n)}function Ft(t,e,n){var t=V.isPlainObject(t.ajax)?t.ajax.dataSrc:null;return t&&t[e]?J(t[e])(n):(t="","draw"===e?t="sEcho":"recordsTotal"===e?t="iTotalRecords":"recordsFiltered"===e&&(t="iTotalDisplayRecords"),void 0!==n[t]?n[t]:n[e])}function Nt(n,t){var e=n.aoPreSearchCols;if(B(n),"ssp"!=et(n)){for(var a,r,o,i,l,s=n,u=s.aoColumns,c=s.aoData,d=0;d<c.length;d++)if(c[d]&&!(l=c[d])._aFilterData){for(o=[],a=0,r=u.length;a<r;a++)u[a].bSearchable?"string"!=typeof(i=null===(i=G(s,d,a,"filter"))?"":i)&&i.toString&&(i=i.toString()):i="",i.indexOf&&-1!==i.indexOf("&")&&(Rt.innerHTML=i,i=Ot?Rt.textContent:Rt.innerText),i.replace&&(i=i.replace(/[\r\n\u2028]/g,"")),o.push(i);l._aFilterData=o,l._sFilterRow=o.join("  "),0}n.aiDisplay=n.aiDisplayMaster.slice(),jt(n.aiDisplay,n,t.search,t),V.each(n.searchFixed,function(t,e){jt(n.aiDisplay,n,e,{})});for(var f=0;f<e.length;f++){var h=e[f];jt(n.aiDisplay,n,h.search,h,f),V.each(n.aoColumns[f].searchFixed,function(t,e){jt(n.aiDisplay,n,e,{},f)})}for(var p,g,v=n,m=$.ext.search,b=v.aiDisplay,y=0,D=m.length;y<D;y++){for(var x=[],S=0,T=b.length;S<T;S++)g=b[S],p=v.aoData[g],m[y](v,p._aFilterData,g,p._aData,S)&&x.push(g);b.length=0,b.push.apply(b,x)}}n.bFiltered=!0,tt(n,null,"search",[n])}function jt(t,e,n,a,r){if(""!==n){for(var o=0,i=[],l="function"==typeof n?n:null,s=n instanceof RegExp?n:l?null:function(t,e){var a=[],e=V.extend({},{boundary:!1,caseInsensitive:!0,exact:!1,regex:!1,smart:!0},e);"string"!=typeof t&&(t=t.toString());if(t=O(t),e.exact)return new RegExp("^"+Pt(t)+"$",e.caseInsensitive?"i":"");{var n,r,o;t=e.regex?t:Pt(t),e.smart&&(n=(t.match(/!?["\u201C][^"\u201D]+["\u201D]|[^ ]+/g)||[""]).map(function(t){var e,n=!1;return"!"===t.charAt(0)&&(n=!0,t=t.substring(1)),'"'===t.charAt(0)?t=(e=t.match(/^"(.*)"$/))?e[1]:t:"“"===t.charAt(0)&&(t=(e=t.match(/^\u201C(.*)\u201D$/))?e[1]:t),n&&(1<t.length&&a.push("(?!"+t+")"),t=""),t.replace(/"/g,"")}),r=a.length?a.join(""):"",o=e.boundary?"\\b":"",t="^(?=.*?"+o+n.join(")(?=.*?"+o)+")("+r+".)*$")}return new RegExp(t,e.caseInsensitive?"i":"")}(n,a),o=0;o<t.length;o++){var u=e.aoData[t[o]],c=void 0===r?u._sFilterRow:u._aFilterData[r];(l&&l(c,u._aData,t[o],r)||s&&s.test(c))&&i.push(t[o])}for(t.length=i.length,o=0;o<i.length;o++)t[o]=i[o]}}var Pt=$.util.escapeRegex,Rt=V("<div>")[0],Ot=void 0!==Rt.textContent;function Et(n){var a,t,e,r,o,i,l=n.iInitDisplayStart;n.bInitialised?(Dt(n,"header"),Dt(n,"footer"),St(n,n.aoHeader),St(n,n.aoFooter),Ct(n),e=(t=n).nTHead,i=e.querySelectorAll("tr"),r=t.bSortCellsTop,o=':not([data-dt-order="disable"]):not([data-dt-order="icon-only"])',!0===r?e=i[0]:!1===r&&(e=i[i.length-1]),Vt(t,e,e===t.nTHead?"tr"+o+" th"+o+", tr"+o+" td"+o:"th"+o+", td"+o),Ut(t,r=[],t.aaSorting),t.aaSorting=r,Bt(n),w(n,!0),tt(n,null,"preInit",[n],!0),s(n),"ssp"!=(i=et(n))&&("ajax"==i?At(n,{},function(t){var e=Lt(n,t);for(a=0;a<e.length;a++)Y(n,e[a]);n.iInitDisplayStart=l,s(n),w(n,!1),kt(n)}):(kt(n),w(n,!1)))):setTimeout(function(){Et(n)},200)}function kt(t){var e;t._bInitComplete||(e=[t,t.json],t._bInitComplete=!0,M(t),tt(t,null,"plugin-init",e,!0),tt(t,"aoInitComplete","init",e,!0))}function Mt(t,e){e=parseInt(e,10);t._iDisplayLength=e,Kt(t),tt(t,null,"length",[t,e])}function Ht(t,e,n){var a=t._iDisplayStart,r=t._iDisplayLength,o=t.fnRecordsDisplay();if(0===o||-1===r)a=0;else if("number"==typeof e)o<(a=e*r)&&(a=0);else if("first"==e)a=0;else if("previous"==e)(a=0<=r?a-r:0)<0&&(a=0);else if("next"==e)a+r<o&&(a+=r);else if("last"==e)a=Math.floor((o-1)/r)*r;else{if("ellipsis"===e)return;Z(t,0,"Unknown paging action: "+e,5)}o=t._iDisplayStart!==a;t._iDisplayStart=a,tt(t,null,o?"page":"page-nc",[t]),o&&n&&S(t)}function w(t,e){tt(t,null,"processing",[t,e])}function Wt(t){var e,n,a,r,o,i,l,s,u,c,d,f,h,p=V(t.nTable),g=t.oScroll;return""===g.sX&&""===g.sY?t.nTable:(e=g.sX,n=g.sY,a=t.oClasses.scrolling,o=(r=t.captionNode)?r._captionSide:null,u=V(p[0].cloneNode(!1)),i=V(p[0].cloneNode(!1)),c=function(t){return t?A(t):null},(l=p.children("tfoot")).length||(l=null),u=V(s="<div/>",{class:a.container}).append(V(s,{class:a.header.self}).css({overflow:"hidden",position:"relative",border:0,width:e?c(e):"100%"}).append(V(s,{class:a.header.inner}).css({"box-sizing":"content-box",width:g.sXInner||"100%"}).append(u.removeAttr("id").css("margin-left",0).append("top"===o?r:null).append(p.children("thead"))))).append(V(s,{class:a.body}).css({position:"relative",overflow:"auto",width:c(e)}).append(p)),l&&u.append(V(s,{class:a.footer.self}).css({overflow:"hidden",border:0,width:e?c(e):"100%"}).append(V(s,{class:a.footer.inner}).append(i.removeAttr("id").css("margin-left",0).append("bottom"===o?r:null).append(p.children("tfoot"))))),c=u.children(),d=c[0],f=c[1],h=l?c[2]:null,V(f).on("scroll.DT",function(){var t=this.scrollLeft;d.scrollLeft=t,l&&(h.scrollLeft=t)}),V("th, td",d).on("focus",function(){var t=d.scrollLeft;f.scrollLeft=t,l&&(f.scrollLeft=t)}),V(f).css("max-height",n),g.bCollapse||V(f).css("height",n),t.nScrollHead=d,t.nScrollBody=f,t.nScrollFoot=h,t.aoDrawCallback.push(Xt),u[0])}function Xt(e){var t=e.oScroll.iBarWidth,n=V(e.nScrollHead).children("div"),a=n.children("table"),r=e.nScrollBody,o=V(r),i=V(e.nScrollFoot).children("div"),l=i.children("table"),s=V(e.nTHead),u=V(e.nTable),c=e.nTFoot&&V("th, td",e.nTFoot).length?V(e.nTFoot):null,d=e.oBrowser,f=r.scrollHeight>r.clientHeight;if(e.scrollBarVis!==f&&void 0!==e.scrollBarVis)e.scrollBarVis=f,M(e);else{if(e.scrollBarVis=f,u.children("thead, tfoot").remove(),(f=s.clone().prependTo(u)).find("th, td").removeAttr("tabindex"),f.find("[id]").removeAttr("id"),c&&(v=c.clone().prependTo(u)).find("[id]").removeAttr("id"),e.aiDisplay.length)for(var h=u.children("tbody").eq(0).children("tr").eq(0).children("th, td").map(function(t){return{idx:H(e,t),width:V(this).outerWidth()}}),p=0;p<h.length;p++){var g=e.aoColumns[h[p].idx].colEl[0];g.style.width.replace("px","")!==h[p].width&&(g.style.width=h[p].width+"px")}a.find("colgroup").remove(),a.append(e.colgroup.clone()),c&&(l.find("colgroup").remove(),l.append(e.colgroup.clone())),V("th, td",f).each(function(){V(this.childNodes).wrapAll('<div class="dt-scroll-sizing">')}),c&&V("th, td",v).each(function(){V(this.childNodes).wrapAll('<div class="dt-scroll-sizing">')});var s=Math.floor(u.height())>r.clientHeight||"scroll"==o.css("overflow-y"),f="padding"+(d.bScrollbarLeft?"Left":"Right"),v=u.outerWidth();a.css("width",A(v)),n.css("width",A(v)).css(f,s?t+"px":"0px"),c&&(l.css("width",A(v)),i.css("width",A(v)).css(f,s?t+"px":"0px")),u.children("colgroup").prependTo(u),o.trigger("scroll"),!e.bSorted&&!e.bFiltered||e._drawHold||(r.scrollTop=0)}}function A(t){return null===t?"0px":"number"==typeof t?t<0?"0px":t+"px":t.match(/\d$/)?t+"px":t}function Bt(t){var e=t.aoColumns;for(t.colgroup.empty(),a=0;a<e.length;a++)e[a].bVisible&&t.colgroup.append(e[a].colEl)}function Vt(o,t,e,i,l){Qt(t,e,function(t){var e=!1,n=void 0===i?st(t.target):[i];if(n.length){for(var a=0,r=n.length;a<r;a++)if(!1!==function(t,e,n,a){function r(t,e){var n=t._idx;return(n=void 0===n?s.indexOf(t[1]):n)+1<s.length?n+1:e?null:0}var o,i=t.aoColumns[e],l=t.aaSorting,s=i.asSorting;if(!i.bSortable)return!1;"number"==typeof l[0]&&(l=t.aaSorting=[l]);(a||n)&&t.oFeatures.bSortMulti?-1!==(i=f(l,"0").indexOf(e))?null===(o=null===(o=r(l[i],!0))&&1===l.length?0:o)?l.splice(i,1):(l[i][1]=s[o],l[i]._idx=o):(a?l.push([e,s[0],0]):l.push([e,l[0][1],0]),l[l.length-1]._idx=0):l.length&&l[0][0]==e?(o=r(l[0]),l.length=1,l[0][1]=s[o],l[0]._idx=o):(l.length=0,l.push([e,s[0]]),l[0]._idx=0)}(o,n[a],a,t.shiftKey)&&(e=!0),1===o.aaSorting.length&&""===o.aaSorting[0][1])break;e&&(w(o,!0),setTimeout(function(){zt(o),qt(o,o.aiDisplay),w(o,!1),s(o,!1,!1),l&&l()},0))}})}function qt(t,e){if(!(e.length<2)){for(var n=t.aiDisplayMaster,a={},r={},o=0;o<n.length;o++)a[n[o]]=o;for(o=0;o<e.length;o++)r[e[o]]=a[e[o]];e.sort(function(t,e){return r[t]-r[e]})}}function Ut(n,a,t){function e(t){var e;V.isPlainObject(t)?void 0!==t.idx?a.push([t.idx,t.dir]):t.name&&-1!==(e=f(n.aoColumns,"sName").indexOf(t.name))&&a.push([e,t.dir]):a.push(t)}if(V.isPlainObject(t))e(t);else if(t.length&&"number"==typeof t[0])e(t);else if(t.length)for(var r=0;r<t.length;r++)e(t[r])}function $t(t){var e,n,a,r,o,i,l,s=[],u=$.ext.type.order,c=t.aoColumns,d=t.aaSortingFixed,f=V.isPlainObject(d),h=[];if(t.oFeatures.bSort)for(Array.isArray(d)&&Ut(t,h,d),f&&d.pre&&Ut(t,h,d.pre),Ut(t,h,t.aaSorting),f&&d.post&&Ut(t,h,d.post),e=0;e<h.length;e++)if(c[l=h[e][0]])for(n=0,a=(r=c[l].aDataSort).length;n<a;n++)i=c[o=r[n]].sType||"string",void 0===h[e]._idx&&(h[e]._idx=c[o].asSorting.indexOf(h[e][1])),h[e][1]&&s.push({src:l,col:o,dir:h[e][1],index:h[e]._idx,type:i,formatter:u[i+"-pre"],sorter:u[i+"-"+h[e][1]]});return s}function zt(t,e,n){var a,r,o,i,l,c,d=[],s=$.ext.type.order,f=t.aoData,u=t.aiDisplayMaster;for(B(t),void 0!==e?(l=t.aoColumns[e],c=[{src:e,col:e,dir:n,index:0,type:l.sType,formatter:s[l.sType+"-pre"],sorter:s[l.sType+"-"+n]}],u=u.slice()):c=$t(t),a=0,r=c.length;a<r;a++){i=c[a],S=x=D=g=p=h=y=b=m=v=void 0;var h,p,g,v=t,m=i.col,b=v.aoColumns[m],y=$.ext.order[b.sSortDataType];y&&(h=y.call(v.oInstance,v,m,T(v,m)));for(var D=$.ext.type.order[b.sType+"-pre"],x=v.aoData,S=0;S<x.length;S++)x[S]&&((p=x[S])._aSortData||(p._aSortData=[]),p._aSortData[m]&&!y||(g=y?h[S]:G(v,S,m,"sort"),p._aSortData[m]=D?D(g,v):g))}if("ssp"!=et(t)&&0!==c.length){for(a=0,o=u.length;a<o;a++)d[a]=a;c.length&&"desc"===c[0].dir&&d.reverse(),u.sort(function(t,e){for(var n,a,r,o,i=c.length,l=f[t]._aSortData,s=f[e]._aSortData,u=0;u<i;u++)if(n=l[(o=c[u]).col],a=s[o.col],o.sorter){if(0!==(r=o.sorter(n,a)))return r}else if(0!==(r=n<a?-1:a<n?1:0))return"asc"===o.dir?r:-r;return(n=d[t])<(a=d[e])?-1:a<n?1:0})}else 0===c.length&&u.sort(function(t,e){return t<e?-1:e<t?1:0});return void 0===e&&(t.bSorted=!0,tt(t,null,"order",[t,c])),u}function Yt(t){var e,n,a,r=t.aLastSort,o=t.oClasses.order.position,i=$t(t),l=t.oFeatures;if(l.bSort&&l.bSortClasses){for(e=0,n=r.length;e<n;e++)a=r[e].src,V(f(t.aoData,"anCells",a)).removeClass(o+(e<2?e+1:3));for(e=0,n=i.length;e<n;e++)a=i[e].src,V(f(t.aoData,"anCells",a)).addClass(o+(e<2?e+1:3))}t.aLastSort=i}function Gt(n){var t;n._bLoadingState||(t={time:+new Date,start:n._iDisplayStart,length:n._iDisplayLength,order:V.extend(!0,[],n.aaSorting),search:V.extend({},n.oPreviousSearch),columns:n.aoColumns.map(function(t,e){return{visible:t.bVisible,search:V.extend({},n.aoPreSearchCols[e])}})},n.oSavedState=t,tt(n,"aoStateSaveParams","stateSaveParams",[n,t]),n.oFeatures.bStateSave&&!n.bDestroying&&n.fnStateSaveCallback.call(n.oInstance,n,t))}function Jt(n,t,e){var a,r,o=n.aoColumns,i=(n._bLoadingState=!0,n._bInitComplete?new $.Api(n):null);if(t&&t.time){var l=n.iStateDuration;if(0<l&&t.time<+new Date-1e3*l)n._bLoadingState=!1;else if(-1!==tt(n,"aoStateLoadParams","stateLoadParams",[n,t]).indexOf(!1))n._bLoadingState=!1;else if(t.columns&&o.length!==t.columns.length)n._bLoadingState=!1;else{if(n.oLoadedState=V.extend(!0,{},t),tt(n,null,"stateLoadInit",[n,t],!0),void 0!==t.length&&(i?i.page.len(t.length):n._iDisplayLength=t.length),void 0!==t.start&&(null===i?(n._iDisplayStart=t.start,n.iInitDisplayStart=t.start):Ht(n,t.start/n._iDisplayLength)),void 0!==t.order&&(n.aaSorting=[],V.each(t.order,function(t,e){n.aaSorting.push(e[0]>=o.length?[0,e[1]]:e)})),void 0!==t.search&&V.extend(n.oPreviousSearch,t.search),t.columns){for(a=0,r=t.columns.length;a<r;a++){var s=t.columns[a];void 0!==s.visible&&(i?i.column(a).visible(s.visible,!1):o[a].bVisible=s.visible),void 0!==s.search&&V.extend(n.aoPreSearchCols[a],s.search)}i&&i.columns.adjust()}n._bLoadingState=!1,tt(n,"aoStateLoaded","stateLoaded",[n,t])}}else n._bLoadingState=!1;e()}function Z(t,e,n,a){if(n="DataTables warning: "+(t?"table id="+t.sTableId+" - ":"")+n,a&&(n+=". For more information about this error, please see https://datatables.net/tn/"+a),e)q.console&&console.log&&console.log(n);else{e=$.ext,e=e.sErrMode||e.errMode;if(t&&tt(t,null,"dt-error",[t,a,n],!0),"alert"==e)alert(n);else{if("throw"==e)throw new Error(n);"function"==typeof e&&e(t,a,n)}}}function Q(n,a,t,e){Array.isArray(t)?V.each(t,function(t,e){Array.isArray(e)?Q(n,a,e[0],e[1]):Q(n,a,e)}):(void 0===e&&(e=t),void 0!==a[t]&&(n[e]=a[t]))}function Zt(t,e,n){var a,r;for(r in e)Object.prototype.hasOwnProperty.call(e,r)&&(a=e[r],V.isPlainObject(a)?(V.isPlainObject(t[r])||(t[r]={}),V.extend(!0,t[r],a)):n&&"data"!==r&&"aaData"!==r&&Array.isArray(a)?t[r]=a.slice():t[r]=a);return t}function Qt(t,e,n){V(t).on("click.DT",e,function(t){n(t)}).on("keypress.DT",e,function(t){13===t.which&&(t.preventDefault(),n(t))}).on("selectstart.DT",e,function(){return!1})}function K(t,e,n){n&&t[e].push(n)}function tt(e,t,n,a,r){var o=[];return t&&(o=e[t].slice().reverse().map(function(t){return t.apply(e.oInstance,a)})),null!==n&&(t=V.Event(n+".dt"),n=V(e.nTable),t.dt=e.api,n[r?"trigger":"triggerHandler"](t,a),r&&0===n.parents("body").length&&V("body").trigger(t,a),o.push(t.result)),o}function Kt(t){var e=t._iDisplayStart,n=t.fnDisplayEnd(),a=t._iDisplayLength;n<=e&&(e=n-a),e-=e%a,t._iDisplayStart=e=-1===a||e<0?0:e}function te(t,e){var t=t.renderer,n=$.ext.renderer[e];return V.isPlainObject(t)&&t[e]?n[t[e]]||n._:"string"==typeof t&&n[t]||n._}function et(t){return t.oFeatures.bServerSide?"ssp":t.ajax?"ajax":"dom"}function ee(t,e,n){var a=t.fnFormatNumber,r=t._iDisplayStart+1,o=t._iDisplayLength,i=t.fnRecordsDisplay(),l=t.fnRecordsTotal(),s=-1===o;return e.replace(/_START_/g,a.call(t,r)).replace(/_END_/g,a.call(t,t.fnDisplayEnd())).replace(/_MAX_/g,a.call(t,l)).replace(/_TOTAL_/g,a.call(t,i)).replace(/_PAGE_/g,a.call(t,s?1:Math.ceil(r/o))).replace(/_PAGES_/g,a.call(t,s?1:Math.ceil(i/o))).replace(/_ENTRIES_/g,t.api.i18n("entries","",n)).replace(/_ENTRIES-MAX_/g,t.api.i18n("entries","",l)).replace(/_ENTRIES-TOTAL_/g,t.api.i18n("entries","",i))}var ne=[],n=Array.prototype;U=function(t,e){if(!(this instanceof U))return new U(t,e);function n(t){t=t,e=$.settings,a=f(e,"nTable");var n,e,a,r=t?t.nTable&&t.oFeatures?[t]:t.nodeName&&"table"===t.nodeName.toLowerCase()?-1!==(r=a.indexOf(t))?[e[r]]:null:t&&"function"==typeof t.settings?t.settings().toArray():("string"==typeof t?n=V(t).get():t instanceof V&&(n=t.get()),n?e.filter(function(t,e){return n.includes(a[e])}):void 0):[];r&&o.push.apply(o,r)}var o=[];if(Array.isArray(t))for(var a=0,r=t.length;a<r;a++)n(t[a]);else n(t);this.context=1<o.length?x(o):o,e&&this.push.apply(this,e),this.selector={rows:null,cols:null,opts:null},U.extend(this,this,ne)},$.Api=U,V.extend(U.prototype,{any:function(){return 0!==this.count()},context:[],count:function(){return this.flatten().length},each:function(t){for(var e=0,n=this.length;e<n;e++)t.call(this,this[e],e,this);return this},eq:function(t){var e=this.context;return e.length>t?new U(e[t],this[t]):null},filter:function(t){t=n.filter.call(this,t,this);return new U(this.context,t)},flatten:function(){var t=[];return new U(this.context,t.concat.apply(t,this.toArray()))},get:function(t){return this[t]},join:n.join,includes:function(t){return-1!==this.indexOf(t)},indexOf:n.indexOf,iterator:function(t,e,n,a){var r,o,i,l,s,u,c,d,f=[],h=this.context,p=this.selector;for("string"==typeof t&&(a=n,n=e,e=t,t=!1),o=0,i=h.length;o<i;o++){var g=new U(h[o]);if("table"===e)void 0!==(r=n.call(g,h[o],o))&&f.push(r);else if("columns"===e||"rows"===e)void 0!==(r=n.call(g,h[o],this[o],o))&&f.push(r);else if("every"===e||"column"===e||"column-rows"===e||"row"===e||"cell"===e)for(c=this[o],"column-rows"===e&&(u=he(h[o],p.opts)),l=0,s=c.length;l<s;l++)d=c[l],void 0!==(r="cell"===e?n.call(g,h[o],d.row,d.column,o,l):n.call(g,h[o],d,o,l,u))&&f.push(r)}return f.length||a?((t=(a=new U(h,t?f.concat.apply([],f):f)).selector).rows=p.rows,t.cols=p.cols,t.opts=p.opts,a):this},lastIndexOf:n.lastIndexOf,length:0,map:function(t){t=n.map.call(this,t,this);return new U(this.context,t)},pluck:function(t){var e=$.util.get(t);return this.map(function(t){return e(t)})},pop:n.pop,push:n.push,reduce:n.reduce,reduceRight:n.reduceRight,reverse:n.reverse,selector:null,shift:n.shift,slice:function(){return new U(this.context,this)},sort:n.sort,splice:n.splice,toArray:function(){return n.slice.call(this)},to$:function(){return V(this)},toJQuery:function(){return V(this)},unique:function(){return new U(this.context,x(this.toArray()))},unshift:n.unshift}),q.__apiStruct=ne,U.extend=function(t,e,n){if(n.length&&e&&(e instanceof U||e.__dt_wrapper))for(var a,r=0,o=n.length;r<o;r++)"__proto__"!==(a=n[r]).name&&(e[a.name]="function"===a.type?function(e,n,a){return function(){var t=n.apply(e||this,arguments);return U.extend(t,t,a.methodExt),t}}(t,a.val,a):"object"===a.type?{}:a.val,e[a.name].__dt_wrapper=!0,U.extend(t,e[a.name],a.propExt))},U.register=e=function(t,e){if(Array.isArray(t))for(var n=0,a=t.length;n<a;n++)U.register(t[n],e);else for(var r=t.split("."),o=ne,i=0,l=r.length;i<l;i++){var s,u,c=function(t,e){for(var n=0,a=t.length;n<a;n++)if(t[n].name===e)return t[n];return null}(o,u=(s=-1!==r[i].indexOf("()"))?r[i].replace("()",""):r[i]);c||o.push(c={name:u,val:{},methodExt:[],propExt:[],type:"object"}),i===l-1?(c.val=e,c.type="function"==typeof e?"function":V.isPlainObject(e)?"object":"other"):o=s?c.methodExt:c.propExt}},U.registerPlural=t=function(t,e,n){U.register(t,n),U.register(e,function(){var t=n.apply(this,arguments);return t===this?this:t instanceof U?t.length?Array.isArray(t[0])?new U(t.context,t[0]):t[0]:void 0:t})};function ae(t,e){var n,a;return Array.isArray(t)?(n=[],t.forEach(function(t){t=ae(t,e);n.push.apply(n,t)}),n.filter(function(t){return t})):"number"==typeof t?[e[t]]:(a=e.map(function(t){return t.nTable}),V(a).filter(t).map(function(){var t=a.indexOf(this);return e[t]}).toArray())}function re(r,o,t){var e,n;t&&(e=new U(r)).one("draw",function(){t(e.ajax.json())}),"ssp"==et(r)?s(r,o):(w(r,!0),(n=r.jqXHR)&&4!==n.readyState&&n.abort(),At(r,{},function(t){pt(r);for(var e=Lt(r,t),n=0,a=e.length;n<a;n++)Y(r,e[n]);s(r,o),kt(r),w(r,!1)}))}function oe(t,e,n,a,r){for(var o,i,l,s,u=[],c=typeof e,d=0,f=(e=e&&"string"!=c&&"function"!=c&&void 0!==e.length?e:[e]).length;d<f;d++)for(l=0,s=(i=e[d]&&e[d].split&&!e[d].match(/[[(:]/)?e[d].split(","):[e[d]]).length;l<s;l++)(o=(o=n("string"==typeof i[l]?i[l].trim():i[l])).filter(function(t){return null!=t}))&&o.length&&(u=u.concat(o));var h=C.selector[t];if(h.length)for(d=0,f=h.length;d<f;d++)u=h[d](a,r,u);return x(u)}function ie(t){return(t=t||{}).filter&&void 0===t.search&&(t.search=t.filter),V.extend({search:"none",order:"current",page:"all"},t)}function le(t){var e=new U(t.context[0]);return t.length&&e.push(t[0]),e.selector=t.selector,e.length&&1<e[0].length&&e[0].splice(1),e}e("tables()",function(t){return null!=t?new U(ae(t,this.context)):this}),e("table()",function(t){var t=this.tables(t),e=t.context;return e.length?new U(e[0]):t}),[["nodes","node","nTable"],["body","body","nTBody"],["header","header","nTHead"],["footer","footer","nTFoot"]].forEach(function(e){t("tables()."+e[0]+"()","table()."+e[1]+"()",function(){return this.iterator("table",function(t){return t[e[2]]},1)})}),[["header","aoHeader"],["footer","aoFooter"]].forEach(function(n){e("table()."+n[0]+".structure()",function(t){var t=this.columns(t).indexes().flatten(),e=this.context[0];return xt(e,e[n[1]],t)})}),t("tables().containers()","table().container()",function(){return this.iterator("table",function(t){return t.nTableWrapper},1)}),e("tables().every()",function(n){var a=this;return this.iterator("table",function(t,e){n.call(a.table(e),e)})}),e("caption()",function(r,o){var t,e=this.context;return void 0===r?(t=e[0].captionNode)&&e.length?t.innerHTML:null:this.iterator("table",function(t){var e=V(t.nTable),n=V(t.captionNode),a=V(t.nTableWrapper);n.length||(n=V("<caption/>").html(r),t.captionNode=n[0],o)||(e.prepend(n),o=n.css("caption-side")),n.html(r),o&&(n.css("caption-side",o),n[0]._captionSide=o),(a.find("div.dataTables_scroll").length?(t="top"===o?"Head":"Foot",a.find("div.dataTables_scroll"+t+" table")):e).prepend(n)},1)}),e("caption.node()",function(){var t=this.context;return t.length?t[0].captionNode:null}),e("draw()",function(e){return this.iterator("table",function(t){"page"===e?S(t):s(t,!1===(e="string"==typeof e?"full-hold"!==e:e))})}),e("page()",function(e){return void 0===e?this.page.info().page:this.iterator("table",function(t){Ht(t,e)})}),e("page.info()",function(){var t,e,n,a,r;if(0!==this.context.length)return e=(t=this.context[0])._iDisplayStart,n=t.oFeatures.bPaginate?t._iDisplayLength:-1,a=t.fnRecordsDisplay(),{page:(r=-1===n)?0:Math.floor(e/n),pages:r?1:Math.ceil(a/n),start:e,end:t.fnDisplayEnd(),length:n,recordsTotal:t.fnRecordsTotal(),recordsDisplay:a,serverSide:"ssp"===et(t)}}),e("page.len()",function(e){return void 0===e?0!==this.context.length?this.context[0]._iDisplayLength:void 0:this.iterator("table",function(t){Mt(t,e)})}),e("ajax.json()",function(){var t=this.context;if(0<t.length)return t[0].json}),e("ajax.params()",function(){var t=this.context;if(0<t.length)return t[0].oAjaxData}),e("ajax.reload()",function(e,n){return this.iterator("table",function(t){re(t,!1===n,e)})}),e("ajax.url()",function(e){var t=this.context;return void 0===e?0===t.length?void 0:(t=t[0],V.isPlainObject(t.ajax)?t.ajax.url:t.ajax):this.iterator("table",function(t){V.isPlainObject(t.ajax)?t.ajax.url=e:t.ajax=e})}),e("ajax.url().load()",function(e,n){return this.iterator("table",function(t){re(t,!1===n,e)})});function se(o,i,t,e){function l(t,e){var n;if(Array.isArray(t)||t instanceof V)for(var a=0,r=t.length;a<r;a++)l(t[a],e);else t.nodeName&&"tr"===t.nodeName.toLowerCase()?(t.setAttribute("data-dt-row",i.idx),s.push(t)):(n=V("<tr><td></td></tr>").attr("data-dt-row",i.idx).addClass(e),V("td",n).addClass(e).html(t)[0].colSpan=W(o),s.push(n[0]))}var s=[];l(t,e),i._details&&i._details.detach(),i._details=V(s),i._detailsShow&&i._details.insertAfter(i.nTr)}function ue(t,e){var n=t.context;if(n.length&&t.length){var a=n[0].aoData[t[0]];if(a._details){(a._detailsShow=e)?(a._details.insertAfter(a.nTr),V(a.nTr).addClass("dt-hasChild")):(a._details.detach(),V(a.nTr).removeClass("dt-hasChild")),tt(n[0],null,"childRow",[e,t.row(t[0])]);var i=n[0],r=new U(i),a=".dt.DT_details",e="draw"+a,t="column-sizing"+a,a="destroy"+a,l=i.aoData;if(r.off(e+" "+t+" "+a),f(l,"_details").length>0){r.on(e,function(t,e){if(i!==e)return;r.rows({page:"current"}).eq(0).each(function(t){var e=l[t];if(e._detailsShow)e._details.insertAfter(e.nTr)})});r.on(t,function(t,e){if(i!==e)return;var n,a=W(e);for(var r=0,o=l.length;r<o;r++){n=l[r];if(n&&n._details)n._details.each(function(){var t=V(this).children("td");if(t.length==1)t.attr("colspan",a)})}});r.on(a,function(t,e){if(i!==e)return;for(var n=0,a=l.length;n<a;n++)if(l[n]&&l[n]._details)ve(r,n)})}ge(n)}}}function ce(t,e,n,a,r,o){for(var i=[],l=0,s=r.length;l<s;l++)i.push(G(t,r[l],e,o));return i}function de(t,e,n){var a=t.aoHeader;return a[void 0!==n?n:t.bSortCellsTop?0:a.length-1][e].cell}function fe(e,n){return function(t){return y(t)||"string"!=typeof t||(t=t.replace(d," "),e&&(t=I(t)),n&&(t=O(t,!1))),t}}var he=function(t,e){var n,a=[],r=t.aiDisplay,o=t.aiDisplayMaster,i=e.search,l=e.order;if("current"==e.page)for(u=t._iDisplayStart,c=t.fnDisplayEnd();u<c;u++)a.push(r[u]);else if("current"==l||"applied"==l){if("none"==i)a=o.slice();else if("applied"==i)a=r.slice();else if("removed"==i){for(var s={},u=0,c=r.length;u<c;u++)s[r[u]]=null;o.forEach(function(t){Object.prototype.hasOwnProperty.call(s,t)||a.push(t)})}}else if("index"==l||"original"==l)for(u=0,c=t.aoData.length;u<c;u++)t.aoData[u]&&("none"==i||-1===(n=r.indexOf(u))&&"removed"==i||0<=n&&"applied"==i)&&a.push(u);else if("number"==typeof l){var d=zt(t,l,"asc");if("none"===i)a=d;else for(u=0;u<d.length;u++)(-1===(n=r.indexOf(d[u]))&&"removed"==i||0<=n&&"applied"==i)&&a.push(d[u])}return a},pe=(e("rows()",function(n,a){void 0===n?n="":V.isPlainObject(n)&&(a=n,n=""),a=ie(a);var t=this.iterator("table",function(t){return e=oe("row",e=n,function(n){var t=g(n),a=r.aoData;if(null!==t&&!o)return[t];if(i=i||he(r,o),null!==t&&-1!==i.indexOf(t))return[t];if(null==n||""===n)return i;if("function"==typeof n)return i.map(function(t){var e=a[t];return n(t,e._aData,e.nTr)?t:null});if(n.nodeName)return t=n._DT_RowIndex,e=n._DT_CellIndex,void 0!==t?a[t]&&a[t].nTr===n?[t]:[]:e?a[e.row]&&a[e.row].nTr===n.parentNode?[e.row]:[]:(t=V(n).closest("*[data-dt-row]")).length?[t.data("dt-row")]:[];if("string"==typeof n&&"#"===n.charAt(0)){var e=r.aIds[n.replace(/^#/,"")];if(void 0!==e)return[e.idx]}t=b(m(r.aoData,i,"nTr"));return V(t).filter(n).map(function(){return this._DT_RowIndex}).toArray()},r=t,o=a),"current"!==o.order&&"applied"!==o.order||qt(r,e),e;var r,e,o,i},1);return t.selector.rows=n,t.selector.opts=a,t}),e("rows().nodes()",function(){return this.iterator("row",function(t,e){return t.aoData[e].nTr||void 0},1)}),e("rows().data()",function(){return this.iterator(!0,"rows",function(t,e){return m(t.aoData,e,"_aData")},1)}),t("rows().cache()","row().cache()",function(n){return this.iterator("row",function(t,e){t=t.aoData[e];return"search"===n?t._aFilterData:t._aSortData},1)}),t("rows().invalidate()","row().invalidate()",function(n){return this.iterator("row",function(t,e){gt(t,e,n)})}),t("rows().indexes()","row().index()",function(){return this.iterator("row",function(t,e){return e},1)}),t("rows().ids()","row().id()",function(t){for(var e=[],n=this.context,a=0,r=n.length;a<r;a++)for(var o=0,i=this[a].length;o<i;o++){var l=n[a].rowIdFn(n[a].aoData[this[a][o]]._aData);e.push((!0===t?"#":"")+l)}return new U(n,e)}),t("rows().remove()","row().remove()",function(){return this.iterator("row",function(t,e){var n=t.aoData,a=n[e],r=t.aiDisplayMaster.indexOf(e),r=(-1!==r&&t.aiDisplayMaster.splice(r,1),0<t._iRecordsDisplay&&t._iRecordsDisplay--,Kt(t),t.rowIdFn(a._aData));void 0!==r&&delete t.aIds[r],n[e]=null}),this}),e("rows.add()",function(o){var t=this.iterator("table",function(t){for(var e,n=[],a=0,r=o.length;a<r;a++)(e=o[a]).nodeName&&"TR"===e.nodeName.toUpperCase()?n.push(ut(t,e)[0]):n.push(Y(t,e));return n},1),e=this.rows(-1);return e.pop(),e.push.apply(e,t),e}),e("row()",function(t,e){return le(this.rows(t,e))}),e("row().data()",function(t){var e,n=this.context;return void 0===t?n.length&&this.length&&this[0].length?n[0].aoData[this[0]]._aData:void 0:((e=n[0].aoData[this[0]])._aData=t,Array.isArray(t)&&e.nTr&&e.nTr.id&&v(n[0].rowId)(t,e.nTr.id),gt(n[0],this[0],"data"),this)}),e("row().node()",function(){var t=this.context;if(t.length&&this.length&&this[0].length){t=t[0].aoData[this[0]];if(t&&t.nTr)return t.nTr}return null}),e("row.add()",function(e){e instanceof V&&e.length&&(e=e[0]);var t=this.iterator("table",function(t){return e.nodeName&&"TR"===e.nodeName.toUpperCase()?ut(t,e)[0]:Y(t,e)});return this.row(t[0])}),V(_).on("plugin-init.dt",function(t,e){var a=new U(e);a.on("stateSaveParams.DT",function(t,e,n){for(var a=e.rowIdFn,r=e.aiDisplayMaster,o=[],i=0;i<r.length;i++){var l=r[i],l=e.aoData[l];l._detailsShow&&o.push("#"+a(l._aData))}n.childRows=o}),a.on("stateLoaded.DT",function(t,e,n){pe(a,n)}),pe(a,a.state.loaded())}),function(t,e){e&&e.childRows&&t.rows(e.childRows.map(function(t){return t.replace(/([^:\\]*(?:\\.[^:\\]*)*):/g,"$1\\:")})).every(function(){tt(t.settings()[0],null,"requestChild",[this])})}),ge=$.util.throttle(function(t){Gt(t[0])},500),ve=function(t,e){var n=t.context;n.length&&(e=n[0].aoData[void 0!==e?e:t[0]])&&e._details&&(e._details.remove(),e._detailsShow=void 0,e._details=void 0,V(e.nTr).removeClass("dt-hasChild"),ge(n))},me="row().child",be=me+"()",ye=(e(be,function(t,e){var n=this.context;return void 0===t?n.length&&this.length&&n[0].aoData[this[0]]?n[0].aoData[this[0]]._details:void 0:(!0===t?this.child.show():!1===t?ve(this):n.length&&this.length&&se(n[0],n[0].aoData[this[0]],t,e),this)}),e([me+".show()",be+".show()"],function(){return ue(this,!0),this}),e([me+".hide()",be+".hide()"],function(){return ue(this,!1),this}),e([me+".remove()",be+".remove()"],function(){return ve(this),this}),e(me+".isShown()",function(){var t=this.context;return t.length&&this.length&&t[0].aoData[this[0]]._detailsShow||!1}),/^([^:]+):(name|title|visIdx|visible)$/),be=(e("columns()",function(n,a){void 0===n?n="":V.isPlainObject(n)&&(a=n,n=""),a=ie(a);var t=this.iterator("table",function(t){return e=n,l=a,s=(i=t).aoColumns,u=f(s,"sName"),c=f(s,"sTitle"),t=$.util.get("[].[].cell")(i.aoHeader),d=x(E([],t)),oe("column",e,function(n){var a,t=g(n);if(""===n)return h(s.length);if(null!==t)return[0<=t?t:s.length+t];if("function"==typeof n)return a=he(i,l),s.map(function(t,e){return n(e,ce(i,e,0,0,a),de(i,e))?e:null});var r="string"==typeof n?n.match(ye):"";if(r)switch(r[2]){case"visIdx":case"visible":var e,o=parseInt(r[1],10);return o<0?[(e=s.map(function(t,e){return t.bVisible?e:null}))[e.length+o]]:[H(i,o)];case"name":return u.map(function(t,e){return t===r[1]?e:null});case"title":return c.map(function(t,e){return t===r[1]?e:null});default:return[]}return n.nodeName&&n._DT_CellIndex?[n._DT_CellIndex.column]:(t=V(d).filter(n).map(function(){return st(this)}).toArray()).length||!n.nodeName?t:(t=V(n).closest("*[data-dt-column]")).length?[t.data("dt-column")]:[]},i,l);var i,e,l,s,u,c,d},1);return t.selector.cols=n,t.selector.opts=a,t}),t("columns().header()","column().header()",function(n){return this.iterator("column",function(t,e){return de(t,e,n)},1)}),t("columns().footer()","column().footer()",function(n){return this.iterator("column",function(t,e){return t.aoFooter.length?t.aoFooter[void 0!==n?n:0][e].cell:null},1)}),t("columns().data()","column().data()",function(){return this.iterator("column-rows",ce,1)}),t("columns().render()","column().render()",function(o){return this.iterator("column-rows",function(t,e,n,a,r){return ce(t,e,0,0,r,o)},1)}),t("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(t,e){return t.aoColumns[e].mData},1)}),t("columns().cache()","column().cache()",function(o){return this.iterator("column-rows",function(t,e,n,a,r){return m(t.aoData,r,"search"===o?"_aFilterData":"_aSortData",e)},1)}),t("columns().init()","column().init()",function(){return this.iterator("column",function(t,e){return t.aoColumns[e]},1)}),t("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(t,e,n,a,r){return m(t.aoData,r,"anCells",e)},1)}),t("columns().titles()","column().title()",function(n,a){return this.iterator("column",function(t,e){"number"==typeof n&&(a=n,n=void 0);e=V("span.dt-column-title",this.column(e).header(a));return void 0!==n?(e.html(n),this):e.html()},1)}),t("columns().types()","column().type()",function(){return this.iterator("column",function(t,e){e=t.aoColumns[e].sType;return e||B(t),e},1)}),t("columns().visible()","column().visible()",function(n,a){var e=this,r=[],t=this.iterator("column",function(t,e){if(void 0===n)return t.aoColumns[e].bVisible;!function(t,e,n){var a,r,o=t.aoColumns,i=o[e],l=t.aoData;if(void 0===n)return i.bVisible;if(i.bVisible===n)return!1;if(n)for(var s=f(o,"bVisible").indexOf(!0,e+1),u=0,c=l.length;u<c;u++)l[u]&&(r=l[u].nTr,a=l[u].anCells,r)&&r.insertBefore(a[e],a[s]||null);else V(f(t.aoData,"anCells",e)).detach();return i.bVisible=n,Bt(t),!0}(t,e,n)||r.push(e)});return void 0!==n&&this.iterator("table",function(t){St(t,t.aoHeader),St(t,t.aoFooter),t.aiDisplay.length||V(t.nTBody).find("td[colspan]").attr("colspan",W(t)),Gt(t),e.iterator("column",function(t,e){r.includes(e)&&tt(t,null,"column-visibility",[t,e,n,a])}),r.length&&(void 0===a||a)&&e.columns.adjust()}),t}),t("columns().widths()","column().width()",function(){var t=this.columns(":visible").count(),t=V("<tr>").html("<td>"+Array(t).join("</td><td>")+"</td>"),n=(V(this.table().body()).append(t),t.children().map(function(){return V(this).outerWidth()}));return t.remove(),this.iterator("column",function(t,e){t=T(t,e);return null!==t?n[t]:0},1)}),t("columns().indexes()","column().index()",function(n){return this.iterator("column",function(t,e){return"visible"===n?T(t,e):e},1)}),e("columns.adjust()",function(){return this.iterator("table",function(t){M(t)},1)}),e("column.index()",function(t,e){var n;if(0!==this.context.length)return n=this.context[0],"fromVisible"===t||"toData"===t?H(n,e):"fromData"===t||"toVisible"===t?T(n,e):void 0}),e("column()",function(t,e){return le(this.columns(t,e))}),e("cells()",function(g,t,v){var a,r,o,i,l,s,e;return V.isPlainObject(g)&&(void 0===g.row?(v=g,g=null):(v=t,t=null)),V.isPlainObject(t)&&(v=t,t=null),null==t?this.iterator("table",function(t){return a=t,t=g,e=ie(v),d=a.aoData,f=he(a,e),n=b(m(d,f,"anCells")),h=V(E([],n)),p=a.aoColumns.length,oe("cell",t,function(t){var e,n="function"==typeof t;if(null==t||n){for(o=[],i=0,l=f.length;i<l;i++)for(r=f[i],s=0;s<p;s++)u={row:r,column:s},(!n||(c=d[r],t(u,G(a,r,s),c.anCells?c.anCells[s]:null)))&&o.push(u);return o}return V.isPlainObject(t)?void 0!==t.column&&void 0!==t.row&&-1!==f.indexOf(t.row)?[t]:[]:(e=h.filter(t).map(function(t,e){return{row:e._DT_CellIndex.row,column:e._DT_CellIndex.column}}).toArray()).length||!t.nodeName?e:(c=V(t).closest("*[data-dt-row]")).length?[{row:c.data("dt-row"),column:c.data("dt-column")}]:[]},a,e);var a,e,r,o,i,l,s,u,c,d,f,n,h,p}):(e=v?{page:v.page,order:v.order,search:v.search}:{},a=this.columns(t,e),r=this.rows(g,e),e=this.iterator("table",function(t,e){var n=[];for(o=0,i=r[e].length;o<i;o++)for(l=0,s=a[e].length;l<s;l++)n.push({row:r[e][o],column:a[e][l]});return n},1),e=v&&v.selected?this.cells(e,v):e,V.extend(e.selector,{cols:t,rows:g,opts:v}),e)}),t("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(t,e,n){t=t.aoData[e];return t&&t.anCells?t.anCells[n]:void 0},1)}),e("cells().data()",function(){return this.iterator("cell",function(t,e,n){return G(t,e,n)},1)}),t("cells().cache()","cell().cache()",function(a){return a="search"===a?"_aFilterData":"_aSortData",this.iterator("cell",function(t,e,n){return t.aoData[e][a][n]},1)}),t("cells().render()","cell().render()",function(a){return this.iterator("cell",function(t,e,n){return G(t,e,n,a)},1)}),t("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(t,e,n){return{row:e,column:n,columnVisible:T(t,n)}},1)}),t("cells().invalidate()","cell().invalidate()",function(a){return this.iterator("cell",function(t,e,n){gt(t,e,a,n)})}),e("cell()",function(t,e,n){return le(this.cells(t,e,n))}),e("cell().data()",function(t){var e,n,a,r,o,i=this.context,l=this[0];return void 0===t?i.length&&l.length?G(i[0],l[0].row,l[0].column):void 0:(e=i[0],n=l[0].row,a=l[0].column,r=e.aoColumns[a],o=e.aoData[n]._aData,r.fnSetData(o,t,{settings:e,row:n,col:a}),gt(i[0],l[0].row,"data",l[0].column),this)}),e("order()",function(e,t){var n=this.context,a=Array.prototype.slice.call(arguments);return void 0===e?0!==n.length?n[0].aaSorting:void 0:("number"==typeof e?e=[[e,t]]:1<a.length&&(e=a),this.iterator("table",function(t){t.aaSorting=Array.isArray(e)?e.slice():e}))}),e("order.listener()",function(e,n,a){return this.iterator("table",function(t){Vt(t,e,{},n,a)})}),e("order.fixed()",function(e){var t;return e?this.iterator("table",function(t){t.aaSortingFixed=V.extend(!0,{},e)}):(t=(t=this.context).length?t[0].aaSortingFixed:void 0,Array.isArray(t)?{pre:t}:t)}),e(["columns().order()","column().order()"],function(n){var a=this;return n?this.iterator("table",function(t,e){t.aaSorting=a[e].map(function(t){return[t,n]})}):this.iterator("column",function(t,e){for(var n=$t(t),a=0,r=n.length;a<r;a++)if(n[a].col===e)return n[a].dir;return null},1)}),t("columns().orderable()","column().orderable()",function(n){return this.iterator("column",function(t,e){t=t.aoColumns[e];return n?t.asSorting:t.bSortable},1)}),e("processing()",function(e){return this.iterator("table",function(t){w(t,e)})}),e("search()",function(e,n,a,r){var t=this.context;return void 0===e?0!==t.length?t[0].oPreviousSearch.search:void 0:this.iterator("table",function(t){t.oFeatures.bFilter&&Nt(t,"object"==typeof n?V.extend(t.oPreviousSearch,n,{search:e}):V.extend(t.oPreviousSearch,{search:e,regex:null!==n&&n,smart:null===a||a,caseInsensitive:null===r||r}))})}),e("search.fixed()",function(e,n){var t=this.iterator(!0,"table",function(t){t=t.searchFixed;return e?void 0===n?t[e]:(null===n?delete t[e]:t[e]=n,this):Object.keys(t)});return void 0!==e&&void 0===n?t[0]:t}),t("columns().search()","column().search()",function(a,r,o,i){return this.iterator("column",function(t,e){var n=t.aoPreSearchCols;if(void 0===a)return n[e].search;t.oFeatures.bFilter&&("object"==typeof r?V.extend(n[e],r,{search:a}):V.extend(n[e],{search:a,regex:null!==r&&r,smart:null===o||o,caseInsensitive:null===i||i}),Nt(t,t.oPreviousSearch))})}),e(["columns().search.fixed()","column().search.fixed()"],function(n,a){var t=this.iterator(!0,"column",function(t,e){t=t.aoColumns[e].searchFixed;return n?void 0===a?t[n]:(null===a?delete t[n]:t[n]=a,this):Object.keys(t)});return void 0!==n&&void 0===a?t[0]:t}),e("state()",function(t,e){var n;return t?(n=V.extend(!0,{},t),this.iterator("table",function(t){!1!==e&&(n.time=+new Date+100),Jt(t,n,function(){})})):this.context.length?this.context[0].oSavedState:null}),e("state.clear()",function(){return this.iterator("table",function(t){t.fnStateSaveCallback.call(t.oInstance,t,{})})}),e("state.loaded()",function(){return this.context.length?this.context[0].oLoadedState:null}),e("state.save()",function(){return this.iterator("table",function(t){Gt(t)})}),$.use=function(t,e){"lib"===e||t.fn?V=t:"win"==e||t.document?_=(q=t).document:"datetime"!==e&&"DateTime"!==t.type||($.DateTime=t)},$.factory=function(t,e){var n=!1;return t&&t.document&&(_=(q=t).document),e&&e.fn&&e.fn.jquery&&(V=e,n=!0),n},$.versionCheck=function(t,e){for(var n,a,r=(e||$.version).split("."),o=t.split("."),i=0,l=o.length;i<l;i++)if((n=parseInt(r[i],10)||0)!==(a=parseInt(o[i],10)||0))return a<n;return!0},$.isDataTable=function(t){var r=V(t).get(0),o=!1;return t instanceof $.Api||(V.each($.settings,function(t,e){var n=e.nScrollHead?V("table",e.nScrollHead)[0]:null,a=e.nScrollFoot?V("table",e.nScrollFoot)[0]:null;e.nTable!==r&&n!==r&&a!==r||(o=!0)}),o)},$.tables=function(e){var t=!1,n=(V.isPlainObject(e)&&(t=e.api,e=e.visible),$.settings.filter(function(t){return!(e&&!V(t.nTable).is(":visible"))}).map(function(t){return t.nTable}));return t?new U(n):n},$.camelToHungarian=z,e("$()",function(t,e){e=this.rows(e).nodes(),e=V(e);return V([].concat(e.filter(t).toArray(),e.find(t).toArray()))}),V.each(["on","one","off"],function(t,n){e(n+"()",function(){var t=Array.prototype.slice.call(arguments),e=(t[0]=t[0].split(/\s/).map(function(t){return t.match(/\.dt\b/)?t:t+".dt"}).join(" "),V(this.tables().nodes()));return e[n].apply(e,t),this})}),e("clear()",function(){return this.iterator("table",function(t){pt(t)})}),e("error()",function(e){return this.iterator("table",function(t){Z(t,0,e)})}),e("settings()",function(){return new U(this.context,this.context)}),e("init()",function(){var t=this.context;return t.length?t[0].oInit:null}),e("data()",function(){return this.iterator("table",function(t){return f(t.aoData,"_aData")}).flatten()}),e("trigger()",function(e,n,a){return this.iterator("table",function(t){return tt(t,null,e,n,a)}).flatten()}),e("ready()",function(t){var e=this.context;return t?this.tables().every(function(){this.context[0]._bInitComplete?t.call(this):this.on("init",function(){t.call(this)})}):e.length?e[0]._bInitComplete||!1:null}),e("destroy()",function(c){return c=c||!1,this.iterator("table",function(t){var e=t.oClasses,n=t.nTable,a=t.nTBody,r=t.nTHead,o=t.nTFoot,i=V(n),a=V(a),l=V(t.nTableWrapper),s=t.aoData.map(function(t){return t?t.nTr:null}),u=e.order,o=(t.bDestroying=!0,tt(t,"aoDestroyCallback","destroy",[t],!0),c||new U(t).columns().visible(!0),l.off(".DT").find(":not(tbody *)").off(".DT"),V(q).off(".DT-"+t.sInstance),n!=r.parentNode&&(i.children("thead").detach(),i.append(r)),o&&n!=o.parentNode&&(i.children("tfoot").detach(),i.append(o)),t.colgroup.remove(),t.aaSorting=[],t.aaSortingFixed=[],Yt(t),V("th, td",r).removeClass(u.canAsc+" "+u.canDesc+" "+u.isAsc+" "+u.isDesc).css("width",""),a.children().detach(),a.append(s),t.nTableWrapper.parentNode),r=t.nTableWrapper.nextSibling,u=c?"remove":"detach",a=(i[u](),l[u](),!c&&o&&(o.insertBefore(n,r),i.css("width",t.sDestroyWidth).removeClass(e.table)),$.settings.indexOf(t));-1!==a&&$.settings.splice(a,1)})}),V.each(["column","row","cell"],function(t,s){e(s+"s().every()",function(a){var r,o=this.selector.opts,i=this,l=0;return this.iterator("every",function(t,e,n){r=i[s](e,o),"cell"===s?a.call(r,r[0][0].row,r[0][0].column,n,l):a.call(r,e,n,l),l++})})}),e("i18n()",function(t,e,n){var a=this.context[0],t=J(t)(a.oLanguage);return"string"==typeof(t=V.isPlainObject(t=void 0===t?e:t)?void 0!==n&&void 0!==t[n]?t[n]:t._:t)?t.replace("%d",n):t}),$.version="2.0.7",$.settings=[],$.models={},$.models.oSearch={caseInsensitive:!0,search:"",regex:!1,smart:!0,return:!1},$.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,src:null,idx:-1,displayData:null},$.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null,maxLenString:null,searchFixed:null},$.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],bAutoWidth:!0,bDeferRender:!0,bDestroy:!1,bFilter:!0,bInfo:!0,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:null,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(t){return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnStateLoadCallback:function(t){try{return JSON.parse((-1===t.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+t.sInstance+"_"+location.pathname))}catch(t){return{}}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(t,e){try{(-1===t.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+t.sInstance+"_"+location.pathname,JSON.stringify(e))}catch(t){}},fnStateSaveParams:null,iStateDuration:7200,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{orderable:": Activate to sort",orderableReverse:": Activate to invert sorting",orderableRemove:": Activate to remove sorting",paginate:{first:"First",last:"Last",next:"Next",previous:"Previous"}},oPaginate:{sFirst:"«",sLast:"»",sNext:"›",sPrevious:"‹"},entries:{_:"entries",1:"entry"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ _ENTRIES-TOTAL_",sInfoEmpty:"Showing 0 to 0 of 0 _ENTRIES-TOTAL_",sInfoFiltered:"(filtered from _MAX_ total _ENTRIES-MAX_)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"_MENU_ _ENTRIES_ per page",sLoadingRecords:"Loading...",sProcessing:"",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:V.extend({},$.models.oSearch),layout:{topStart:"pageLength",topEnd:"search",bottomStart:"info",bottomEnd:"paging"},sDom:null,searchDelay:null,sPaginationType:"full_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null,rowId:"DT_RowId",caption:null},k($.defaults),$.defaults.column={aDataSort:null,iDataSort:-1,ariaTitle:"",asSorting:["asc","desc",""],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null},k($.defaults.column),$.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:!0,bLengthChange:!0,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollbarLeft:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},searchFixed:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",pagingControls:0,iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,bAjaxDataGet:!0,jqXHR:null,json:void 0,oAjaxData:void 0,sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==et(this)?+this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==et(this)?+this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var t=this._iDisplayLength,e=this._iDisplayStart,n=e+t,a=this.aiDisplay.length,r=this.oFeatures,o=r.bPaginate;return r.bServerSide?!1===o||-1===t?e+a:Math.min(e+t,this._iRecordsDisplay):!o||a<n||-1===t?a:n},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null,caption:"",captionNode:null,colgroup:null},$.ext.pager);V.extend(be,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},numbers:function(){return["numbers"]},simple_numbers:function(){return["previous","numbers","next"]},full_numbers:function(){return["first","previous","numbers","next","last"]},first_last:function(){return["first","last"]},first_last_numbers:function(){return["first","numbers","last"]},_numbers:Ne,numbers_length:7}),V.extend(!0,$.ext.renderer,{pagingButton:{_:function(t,e,n,a,r){var t=t.oClasses.paging,o=[t.button];return a&&o.push(t.active),r&&o.push(t.disabled),{display:a="ellipsis"===e?V('<span class="ellipsis"></span>').html(n)[0]:V("<button>",{class:o.join(" "),role:"link",type:"button"}).html(n),clicker:a}}},pagingContainer:{_:function(t,e){return e}}});function De(t){return t.replace(/[\W]/g,"_")}function xe(t,e,n,a,r){return q.moment?t[e](r):q.luxon?t[n](r):a?t[a](r):t}var Se=!1;function Te(t,e,n){var a;if(q.moment){if(!(a=q.moment.utc(t,e,n,!0)).isValid())return null}else if(q.luxon){if(!(a=e&&"string"==typeof t?q.luxon.DateTime.fromFormat(t,e):q.luxon.DateTime.fromISO(t)).isValid)return null;a.setLocale(n)}else e?(Se||alert("DataTables warning: Formatted date without Moment.js or Luxon - https://datatables.net/tn/17"),Se=!0):a=new Date(t);return a}function we(s){return function(a,r,o,i){0===arguments.length?(o="en",a=r=null):1===arguments.length?(o="en",r=a,a=null):2===arguments.length&&(o=r,r=a,a=null);var l="datetime"+(r?"-"+De(r):"");return $.ext.type.order[l]||$.type(l,{detect:function(t){return t===l&&l},order:{pre:function(t){return t.valueOf()}},className:"dt-right"}),function(t,e){var n;return null==t&&(t="--now"===i?(n=new Date,new Date(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate(),n.getHours(),n.getMinutes(),n.getSeconds()))):""),"type"===e?l:""===t?"sort"!==e?"":Te("0000-01-01 00:00:00",null,o):!(null===r||a!==r||"sort"===e||"type"===e||t instanceof Date)||null===(n=Te(t,a,o))?t:"sort"===e?n:(t=null===r?xe(n,"toDate","toJSDate","")[s]():xe(n,"format","toFormat","toISOString",r),"display"===e?u(t):t)}}}var _e=",",Ce=".";if(void 0!==q.Intl)try{for(var Ie=(new Intl.NumberFormat).formatToParts(100000.1),a=0;a<Ie.length;a++)"group"===Ie[a].type?_e=Ie[a].value:"decimal"===Ie[a].type&&(Ce=Ie[a].value)}catch(t){}$.datetime=function(n,a){var r="datetime-detect-"+De(n);a=a||"en",$.ext.type.order[r]||$.type(r,{detect:function(t){var e=Te(t,n,a);return!(""!==t&&!e)&&r},order:{pre:function(t){return Te(t,n,a)||0}},className:"dt-right"})},$.render={date:we("toLocaleDateString"),datetime:we("toLocaleString"),time:we("toLocaleTimeString"),number:function(r,o,i,l,s){return null==r&&(r=_e),null==o&&(o=Ce),{display:function(t){if("number"!=typeof t&&"string"!=typeof t)return t;if(""===t||null===t)return t;var e=t<0?"-":"",n=parseFloat(t),a=Math.abs(n);if(1e11<=a||a<1e-4&&0!==a)return(a=n.toExponential(i).split(/e\+?/))[0]+" x 10<sup>"+a[1]+"</sup>";if(isNaN(n))return u(t);n=n.toFixed(i),t=Math.abs(n);a=parseInt(t,10),n=i?o+(t-a).toFixed(i).substring(2):"";return(e=0===a&&0===parseFloat(n)?"":e)+(l||"")+a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,r)+n+(s||"")}}},text:function(){return{display:u,filter:u}}};var i=$.ext.type,Ae=($.type=function(a,t,e){if(!t)return{className:i.className[a],detect:i.detect.find(function(t){return t.name===a}),order:{pre:i.order[a+"-pre"],asc:i.order[a+"-asc"],desc:i.order[a+"-desc"]},render:i.render[a],search:i.search[a]};function n(t,e){i[t][a]=e}function r(n){function t(t,e){return!0===(t=n(t,e))?a:t}Object.defineProperty(t,"name",{value:a});var e=i.detect.findIndex(function(t){return t.name===a});-1===e?i.detect.unshift(t):i.detect.splice(e,1,t)}function o(t){i.order[a+"-pre"]=t.pre,i.order[a+"-asc"]=t.asc,i.order[a+"-desc"]=t.desc}void 0===e&&(e=t,t=null),"className"===t?n("className",e):"detect"===t?r(e):"order"===t?o(e):"render"===t?n("render",e):"search"===t?n("search",e):t||(e.className&&n("className",e.className),void 0!==e.detect&&r(e.detect),e.order&&o(e.order),void 0!==e.render&&n("render",e.render),void 0!==e.search&&n("search",e.search))},$.types=function(){return i.detect.map(function(t){return t.name})},$.type("string",{detect:function(){return"string"},order:{pre:function(t){return y(t)?"":"string"==typeof t?t.toLowerCase():t.toString?t.toString():""}},search:fe(!1,!0)}),$.type("html",{detect:function(t){return y(t)||"string"==typeof t&&-1!==t.indexOf("<")?"html":null},order:{pre:function(t){return y(t)?"":t.replace?I(t).trim().toLowerCase():t+""}},search:fe(!0,!0)}),$.type("date",{className:"dt-type-date",detect:function(t){var e;return(!t||t instanceof Date||N.test(t))&&(null!==(e=Date.parse(t))&&!isNaN(e)||y(t))?"date":null},order:{pre:function(t){t=Date.parse(t);return isNaN(t)?-1/0:t}}}),$.type("html-num-fmt",{className:"dt-type-numeric",detect:function(t,e){e=e.oLanguage.sDecimal;return l(t,e,!0)?"html-num-fmt":null},order:{pre:function(t,e){e=e.oLanguage.sDecimal;return Ae(t,e,L,P)}},search:fe(!0,!0)}),$.type("html-num",{className:"dt-type-numeric",detect:function(t,e){e=e.oLanguage.sDecimal;return l(t,e)?"html-num":null},order:{pre:function(t,e){e=e.oLanguage.sDecimal;return Ae(t,e,L)}},search:fe(!0,!0)}),$.type("num-fmt",{className:"dt-type-numeric",detect:function(t,e){e=e.oLanguage.sDecimal;return o(t,e,!0)?"num-fmt":null},order:{pre:function(t,e){e=e.oLanguage.sDecimal;return Ae(t,e,P)}}}),$.type("num",{className:"dt-type-numeric",detect:function(t,e){e=e.oLanguage.sDecimal;return o(t,e)?"num":null},order:{pre:function(t,e){e=e.oLanguage.sDecimal;return Ae(t,e)}}}),function(t,e,n,a){var r;return 0===t||t&&"-"!==t?"number"==(r=typeof t)||"bigint"==r?t:+(t=(t=e?R(t,e):t).replace&&(n&&(t=t.replace(n,"")),a)?t.replace(a,""):t):-1/0});V.extend(!0,$.ext.renderer,{footer:{_:function(t,e,n){e.addClass(n.tfoot.cell)}},header:{_:function(d,f,h){f.addClass(h.thead.cell),d.oFeatures.bSort||f.addClass(h.order.none);var t=d.bSortCellsTop,e=f.closest("thead").find("tr"),n=f.parent().index();"disable"===f.attr("data-dt-order")||"disable"===f.parent().attr("data-dt-order")||!0===t&&0!==n||!1===t&&n!==e.length-1||V(d.nTable).on("order.dt.DT",function(t,e,n){var a,r,o,i,l,s,u,c;d===e&&(a=h.order,c=e.api.columns(f),r=d.aoColumns[c.flatten()[0]],o=c.orderable().includes(!0),i="",u=c.indexes(),l=c.orderable(!0).flatten(),s=","+n.map(function(t){return t.col}).join(",")+",",f.removeClass(a.isAsc+" "+a.isDesc).toggleClass(a.none,!o).toggleClass(a.canAsc,o&&l.includes("asc")).toggleClass(a.canDesc,o&&l.includes("desc")),-1!==(l=s.indexOf(","+u.toArray().join(",")+","))&&(s=c.order(),f.addClass(s.includes("asc")?a.isAsc:""+s.includes("desc")?a.isDesc:"")),0===l?(u=n[0],c=r.asSorting,f.attr("aria-sort","asc"===u.dir?"ascending":"descending"),i=c[u.index+1]?"Reverse":"Remove"):f.removeAttr("aria-sort"),f.attr("aria-label",o?r.ariaTitle+e.api.i18n("oAria.orderable"+i):r.ariaTitle),o)&&(f.find(".dt-column-title").attr("role","button"),f.attr("tabindex",0))})}},layout:{_:function(t,e,n){var a=V("<div/>").addClass("dt-layout-row").appendTo(e);V.each(n,function(t,e){t=e.table?"":"dt-"+t+" ";e.table&&a.addClass("dt-layout-table"),V("<div/>").attr({id:e.id||null,class:"dt-layout-cell "+t+(e.className||"")}).append(e.contents).appendTo(a)})}}}),$.feature={},$.feature.register=function(t,e,n){$.ext.features[t]=e,n&&C.feature.push({cFeature:n,fnInit:e})},$.feature.register("info",function(t,s){var e,n,u;return t.oFeatures.bInfo?(e=t.oLanguage,n=t.sTableId,u=V("<div/>",{class:t.oClasses.info.container}),s=V.extend({callback:e.fnInfoCallback,empty:e.sInfoEmpty,postfix:e.sInfoPostFix,search:e.sInfoFiltered,text:e.sInfo},s),t.aoDrawCallback.push(function(t){var e=s,n=u,a=t._iDisplayStart+1,r=t.fnDisplayEnd(),o=t.fnRecordsTotal(),i=t.fnRecordsDisplay(),l=i?e.text:e.empty;i!==o&&(l+=" "+e.search),l+=e.postfix,l=ee(t,l),e.callback&&(l=e.callback.call(t.oInstance,t,a,r,o,i,l)),n.html(l),tt(t,null,"info",[t,n[0],l])}),t._infoEl||(u.attr({"aria-live":"polite",id:n+"_info",role:"status"}),V(t.nTable).attr("aria-describedby",n+"_info"),t._infoEl=u),u):null},"i");var Le=0;function Fe(t,e,n,a){var r=t.oLanguage.oPaginate,o={display:"",active:!1,disabled:!1};switch(e){case"ellipsis":o.display="&#x2026;",o.disabled=!0;break;case"first":o.display=r.sFirst,0===n&&(o.disabled=!0);break;case"previous":o.display=r.sPrevious,0===n&&(o.disabled=!0);break;case"next":o.display=r.sNext,0!==a&&n!==a-1||(o.disabled=!0);break;case"last":o.display=r.sLast,0!==a&&n!==a-1||(o.disabled=!0);break;default:"number"==typeof e&&(o.display=t.fnFormatNumber(e+1),n===e)&&(o.active=!0)}return o}function Ne(t,e,n,a){var r=[],o=Math.floor(n/2),i=a?2:1,l=a?1:0;return e<=n?r=h(0,e):1===n?r=[t]:3===n?t<=1?r=[0,1,"ellipsis"]:e-2<=t?(r=h(e-2,e)).unshift("ellipsis"):r=["ellipsis",t,"ellipsis"]:t<=o?((r=h(0,n-i)).push("ellipsis"),a&&r.push(e-1)):e-1-o<=t?((r=h(e-(n-i),e)).unshift("ellipsis"),a&&r.unshift(0)):((r=h(t-o+i,t+o-l)).push("ellipsis"),r.unshift("ellipsis"),a&&(r.push(e-1),r.unshift(0))),r}$.feature.register("search",function(n,t){var e,a,r,o,i,l,s,u,c,d;return n.oFeatures.bFilter?(e=n.oClasses.search,a=n.sTableId,c=n.oLanguage,r=n.oPreviousSearch,o='<input type="search" class="'+e.input+'"/>',-1===(t=V.extend({placeholder:c.sSearchPlaceholder,text:c.sSearch},t)).text.indexOf("_INPUT_")&&(t.text+="_INPUT_"),t.text=ee(n,t.text),c=t.text.match(/_INPUT_$/),s=t.text.match(/^_INPUT_/),i=t.text.replace(/_INPUT_/,""),l="<label>"+t.text+"</label>",s?l="_INPUT_<label>"+i+"</label>":c&&(l="<label>"+i+"</label>_INPUT_"),(s=V("<div>").addClass(e.container).append(l.replace(/_INPUT_/,o))).find("label").attr("for","dt-search-"+Le),s.find("input").attr("id","dt-search-"+Le),Le++,u=function(t){var e=this.value;r.return&&"Enter"!==t.key||e!=r.search&&(r.search=e,Nt(n,r),n._iDisplayStart=0,S(n))},c=null!==n.searchDelay?n.searchDelay:0,d=V("input",s).val(r.search).attr("placeholder",t.placeholder).on("keyup.DT search.DT input.DT paste.DT cut.DT",c?$.util.debounce(u,c):u).on("mouseup.DT",function(t){setTimeout(function(){u.call(d[0],t)},10)}).on("keypress.DT",function(t){if(13==t.keyCode)return!1}).attr("aria-controls",a),V(n.nTable).on("search.dt.DT",function(t,e){n===e&&d[0]!==_.activeElement&&d.val("function"!=typeof r.search?r.search:"")}),s):null},"f"),$.feature.register("paging",function(t,e){if(!t.oFeatures.bPaginate)return null;(e=V.extend({buttons:$.ext.pager.numbers_length,type:t.sPaginationType,boundaryNumbers:!0},e)).numbers&&(e.buttons=e.numbers);function n(){!function t(e,n,a){if(!e._bInitComplete)return;var r=$.ext.pager[a.type],o=e.oLanguage.oAria.paginate||{},i=e._iDisplayStart,l=e._iDisplayLength,s=e.fnRecordsDisplay(),u=-1===l,c=u?0:Math.ceil(i/l),d=u?1:Math.ceil(s/l),f=r().map(function(t){return"numbers"===t?Ne(c,d,a.buttons,a.boundaryNumbers):t}).flat();var h=[];for(var p=0;p<f.length;p++){var g=f[p],v=Fe(e,g,c,d),m=te(e,"pagingButton")(e,g,v.display,v.active,v.disabled);V(m.clicker).attr({"aria-controls":e.sTableId,"aria-disabled":v.disabled?"true":null,"aria-current":v.active?"page":null,"aria-label":o[g],"data-dt-idx":g,tabIndex:v.disabled?-1:e.iTabIndex}),"number"!=typeof g&&V(m.clicker).addClass(g),Qt(m.clicker,{action:g},function(t){t.preventDefault(),Ht(e,t.data.action,!0)}),h.push(m.display)}i=te(e,"pagingContainer")(e,h);u=n.find(_.activeElement).data("dt-idx");n.empty().append(i);void 0!==u&&n.find("[data-dt-idx="+u+"]").trigger("focus");h.length&&1<a.numbers&&V(n).height()>=2*V(h[0]).outerHeight()-10&&t(e,n,V.extend({},a,{numbers:a.numbers-2}))}(t,a,e)}var a=V("<div/>").addClass(t.oClasses.paging.container+" paging_"+e.type);return t.aoDrawCallback.push(n),V(t.nTable).on("column-sizing.dt.DT",n),a},"p");var je=0;return $.feature.register("pageLength",function(a,t){var e=a.oFeatures;if(!e.bPaginate||!e.bLengthChange)return null;t=V.extend({menu:a.aLengthMenu,text:a.oLanguage.sLengthMenu},t);var e=a.oClasses.length,n=a.sTableId,r=t.menu,o=[],i=[];if(Array.isArray(r[0]))o=r[0],i=r[1];else for(p=0;p<r.length;p++)V.isPlainObject(r[p])?(o.push(r[p].value),i.push(r[p].label)):(o.push(r[p]),i.push(r[p]));for(var l=t.text.match(/_MENU_$/),s=t.text.match(/^_MENU_/),u=t.text.replace(/_MENU_/,""),t="<label>"+t.text+"</label>",c=(s?t="_MENU_<label>"+u+"</label>":l&&(t="<label>"+u+"</label>_MENU_"),V("<div/>").addClass(e.container).append(t.replace("_MENU_","<span></span>"))),d=[],f=(c.find("label")[0].childNodes.forEach(function(t){t.nodeType===Node.TEXT_NODE&&d.push({el:t,text:t.textContent})}),function(e){d.forEach(function(t){t.el.textContent=ee(a,t.text,e)})}),h=V("<select/>",{name:n+"_length","aria-controls":n,class:e.select}),p=0;p<o.length;p++)h[0][p]=new Option("number"==typeof i[p]?a.fnFormatNumber(i[p]):i[p],o[p]);return c.find("label").attr("for","dt-length-"+je),h.attr("id","dt-length-"+je),je++,c.find("span").replaceWith(h),V("select",c).val(a._iDisplayLength).on("change.DT",function(){Mt(a,V(this).val()),S(a)}),V(a.nTable).on("length.dt.DT",function(t,e,n){a===e&&(V("select",c).val(n),f(n))}),f(a._iDisplayLength),c},"l"),((V.fn.dataTable=$).$=V).fn.dataTableSettings=$.settings,V.fn.dataTableExt=$.ext,V.fn.DataTable=function(t){return V(this).dataTable(t).api()},V.each($,function(t,e){V.fn.DataTable[t]=e}),$});

/*! DataTables Bootstrap 4 integration
 * © SpryMedia Ltd - datatables.net/license
 */
!function(n){var o,r;"function"==typeof define&&define.amd?define(["jquery","datatables.net"],function(e){return n(e,window,document)}):"object"==typeof exports?(o=require("jquery"),r=function(e,t){t.fn.dataTable||require("datatables.net")(e,t)},"undefined"==typeof window?module.exports=function(e,t){return e=e||window,t=t||o(e),r(e,t),n(t,0,e.document)}:(r(window,o),module.exports=n(o,window,window.document))):n(jQuery,window,document)}(function(d,e,t){"use strict";var n=d.fn.dataTable;return d.extend(!0,n.defaults,{renderer:"bootstrap"}),d.extend(!0,n.ext.classes,{container:"dt-container dt-bootstrap4",search:{input:"form-control form-control-sm"},length:{select:"custom-select custom-select-sm form-control form-control-sm"},processing:{container:"dt-processing card"}}),n.ext.renderer.pagingButton.bootstrap=function(e,t,n,o,r){var a=["dt-paging-button","page-item"],o=(o&&a.push("active"),r&&a.push("disabled"),d("<li>").addClass(a.join(" ")));return{display:o,clicker:d("<a>",{href:r?null:"#",class:"page-link"}).html(n).appendTo(o)}},n.ext.renderer.pagingContainer.bootstrap=function(e,t){return d("<ul/>").addClass("pagination").append(t)},n.ext.renderer.layout.bootstrap=function(e,t,n){var o=d("<div/>",{class:n.full?"row justify-content-md-center":"row justify-content-between"}).appendTo(t);d.each(n,function(e,t){e=t.table?"col-12":"start"===e?"col-md-auto mr-auto":"end"===e?"col-md-auto ml-auto":"col-md";d("<div/>",{id:t.id||null,class:e+" "+(t.className||"")}).append(t.contents).appendTo(o)})},n});

/*! ColReorder 2.0.2
 * © SpryMedia Ltd - datatables.net/license
 */
!function(o){var r,n;"function"==typeof define&&define.amd?define(["jquery","datatables.net"],function(t){return o(t,window,document)}):"object"==typeof exports?(r=require("jquery"),n=function(t,e){e.fn.dataTable||require("datatables.net")(t,e)},"undefined"==typeof window?module.exports=function(t,e){return t=t||window,e=e||r(t),n(t,e),o(e,0,t.document)}:(n(window,r),module.exports=o(r,window,window.document))):o(jQuery,window,document)}(function(c,t,h){"use strict";var n=c.fn.dataTable;function f(t,e,o,r){var n=t.splice(e,o);n.unshift(0),n.unshift(r<e?r:r-o+1),t.splice.apply(t,n)}function a(t){t.rows().invalidate("data"),t.column(0).visible(t.column(0).visible()),t.columns.adjust();var e=t.colReorder.order();t.trigger("columns-reordered",[{order:e,mapping:g(e)}])}function s(t){return t.settings()[0].aoColumns.map(function(t){return t._crOriginalIdx})}function p(t,e,o,r){for(var n=[],s=0;s<t.length;s++){var i=t[s];f(i,o[0],o.length,r);for(var a=0;a<i.length;a++){var l,d=i[a].cell;n.includes(d)||(l=d.getAttribute("data-dt-column").split(",").map(function(t){return e[t]}).join(","),d.setAttribute("data-dt-column",l),n.push(d))}}}function i(t){t.columns().iterator("column",function(t,e){t=t.aoColumns;void 0===t[e]._crOriginalIdx&&(t[e]._crOriginalIdx=e)})}function g(t){for(var e=[],o=0;o<t.length;o++)e[t[o]]=o;return e}function l(t,e,o){var r,n=t.settings()[0],s=n.aoColumns,i=s.map(function(t,e){return e});if(!e.includes(o)){f(i,e[0],e.length,o);var a=g(i);for(f(s,e[0],e.length,o),r=0;r<n.aoData.length;r++){var l=n.aoData[r];if(l){var d=l.anCells;if(d)for(f(d,e[0],e.length,o),c=0;c<d.length;c++)l.nTr&&d[c]&&s[c].bVisible&&l.nTr.appendChild(d[c]),d[c]&&d[c]._DT_CellIndex&&(d[c]._DT_CellIndex.column=c)}}for(r=0;r<s.length;r++){for(var u=s[r],c=0;c<u.aDataSort.length;c++)u.aDataSort[c]=a[u.aDataSort[c]];u.idx=a[u.idx],u.bVisible&&n.colgroup.append(u.colEl)}p(n.aoHeader,a,e,o),p(n.aoFooter,a,e,o),f(n.aoPreSearchCols,e[0],e.length,o),m(a,n.aaSorting),Array.isArray(n.aaSortingFixed)?m(a,n.aaSortingFixed):(n.aaSortingFixed.pre||n.aaSortingFixed.post)&&m(a,n.aaSortingFixed.pre),n.aLastSort.forEach(function(t){t.src=a[t.src]}),t.trigger("column-reorder",[t.settings()[0],{from:e,to:o,mapping:a}])}}function m(t,e){for(var o=0;o<e.length;o++){var r=e[o];"number"==typeof r?e[o]=t[r]:c.isPlainObject(r)&&void 0!==r.idx?r.idx=t[r.idx]:Array.isArray(r)&&"number"==typeof r[0]&&(r[0]=t[r[0]])}}function d(t,e,o){var r=!1;if(e.length!==t.columns().count())t.error("ColReorder - column count mismatch");else{for(var n=g(e=o?u(t,e,"toCurrent"):e),s=0;s<n.length;s++){var i=n.indexOf(s);s!==i&&(f(n,i,1,s),l(t,[i],s),r=!0)}r&&a(t)}}function u(t,e,o){var r=t.colReorder.order(),n=t.settings()[0].aoColumns;return"toCurrent"===o||"fromOriginal"===o?Array.isArray(e)?e.map(function(t){return r.indexOf(t)}):r.indexOf(e):Array.isArray(e)?e.map(function(t){return n[t]._crOriginalIdx}):n[e]._crOriginalIdx}function v(t,e,o){var r=t.columns().count();return!(e[0]<o&&o<e[e.length]||e[0]<0&&e[e.length-1]>r||o<0&&r<o||!e.includes(o)&&(!y(t.table().header.structure(),e,o)||!y(t.table().footer.structure(),e,o)))}function y(t,e,o){for(var r=function(t){for(var e=[],o=0;o<t.length;o++){e.push([]);for(var r=0;r<t[o].length;r++){var n=t[o][r];if(n)for(var s=0;s<n.rowspan;s++){e[o+s]||(e[o+s]=[]);for(var i=0;i<n.colspan;i++)e[o+s][r+i]=n.cell}}}return e}(t),n=0;n<r.length;n++)f(r[n],e[0],e.length,o);for(n=0;n<r.length;n++)for(var s=[],i=0;i<r[n].length;i++){var a=r[n][i];if(s.includes(a)){if(s[s.length-1]!==a)return}else s.push(a)}return 1}_.prototype.disable=function(){return this.c.enable=!1,this},_.prototype.enable=function(t){return!1===(t=void 0===t?!0:t)?this.disable():(this.c.enable=!0,this)},_.prototype._addListener=function(t){var e=this;c(t).on("selectstart.colReorder",function(){return!1}).on("mousedown.colReorder touchstart.colReorder",function(t){"mousedown"===t.type&&1!==t.which||e.c.enable&&e._mouseDown(t,this)})},_.prototype._createDragNode=function(){var t=this.s.mouse.target,e=t.parent(),o=e.parent(),r=o.parent(),n=t.clone();this.dom.drag=c(r[0].cloneNode(!1)).addClass("dtcr-cloned").append(c(o[0].cloneNode(!1)).append(c(e[0].cloneNode(!1)).append(n[0]))).css({position:"absolute",top:0,left:0,width:c(t).outerWidth(),height:c(t).outerHeight()}).appendTo("body")},_.prototype._cursorPosition=function(t,e){return(-1!==t.type.indexOf("touch")?t.originalEvent.touches[0]:t)[e]},_.prototype._mouseDown=function(t,e){for(var o=this,r=c(t.target).closest("th, td"),n=r.offset(),s=this.dt.columns(this.c.columns).indexes().toArray(),i=c(e).attr("data-dt-column").split(",").map(function(t){return parseInt(t,10)}),a=0;a<i.length;a++)if(!s.includes(i[a]))return!1;this.s.mouse.start.x=this._cursorPosition(t,"pageX"),this.s.mouse.start.y=this._cursorPosition(t,"pageY"),this.s.mouse.offset.x=this._cursorPosition(t,"pageX")-n.left,this.s.mouse.offset.y=this._cursorPosition(t,"pageY")-n.top,this.s.mouse.target=r,this.s.mouse.targets=i;for(var l=0;l<i.length;l++){var d=this.dt.cells(null,i[l],{page:"current"}).nodes().to$(),u="dtcr-moving";0===l&&(u+=" dtcr-moving-first"),l===i.length-1&&(u+=" dtcr-moving-last"),d.addClass(u)}this._regions(i),this._scrollRegions(),c(h).on("mousemove.colReorder touchmove.colReorder",function(t){o._mouseMove(t)}).on("mouseup.colReorder touchend.colReorder",function(t){o._mouseUp(t)})},_.prototype._mouseMove=function(t){if(null===this.dom.drag){if(Math.pow(Math.pow(this._cursorPosition(t,"pageX")-this.s.mouse.start.x,2)+Math.pow(this._cursorPosition(t,"pageY")-this.s.mouse.start.y,2),.5)<5)return;c(h.body).addClass("dtcr-dragging"),this._createDragNode()}this.dom.drag.css({left:this._cursorPosition(t,"pageX")-this.s.mouse.offset.x,top:this._cursorPosition(t,"pageY")-this.s.mouse.offset.y});var e=c(this.dt.table().node()).offset().left,o=this._cursorPosition(t,"pageX")-e,e=this.s.dropZones.find(function(t){return t.left<=o&&o<=t.left+t.width});this.s.mouse.absLeft=this._cursorPosition(t,"pageX"),e&&!e.self&&this._move(e,o)},_.prototype._mouseUp=function(t){c(h).off(".colReorder"),c(h.body).removeClass("dtcr-dragging"),this.dom.drag&&(this.dom.drag.remove(),this.dom.drag=null),this.s.scrollInterval&&clearInterval(this.s.scrollInterval),this.dt.cells(".dtcr-moving").nodes().to$().removeClass("dtcr-moving dtcr-moving-first dtcr-moving-last")},_.prototype._move=function(t,e){var o,r,n=this,t=(this.dt.colReorder.move(this.s.mouse.targets,t.colIdx),this.s.mouse.targets=c(this.s.mouse.target).attr("data-dt-column").split(",").map(function(t){return parseInt(t,10)}),this._regions(this.s.mouse.targets),this.s.dropZones.find(function(t){return t.colIdx===n.s.mouse.targets[0]})),s=this.s.dropZones.indexOf(t);t.left>e&&(r=t.left-e,o=this.s.dropZones[s-1],t.left-=r,t.width+=r,o)&&(o.width-=r),(t=this.s.dropZones.find(function(t){return t.colIdx===n.s.mouse.targets[n.s.mouse.targets.length-1]})).left+t.width<e&&(o=e-(t.left+t.width),r=this.s.dropZones[s+1],t.width+=o,r)&&(r.left+=o,r.width-=o)},_.prototype._regions=function(n){var s=this,i=[],a=0,l=0,d=this.dt.columns(this.c.columns).indexes().toArray(),u=this.dt.columns().widths();this.dt.columns().every(function(t,e,o){var r;this.visible()&&(r=u[t],d.includes(t)&&(v(s.dt,n,t)?i.push({colIdx:t,left:a-l,self:n[0]<=t&&t<=n[n.length-1],width:r+l}):t<n[0]?i.length&&(i[i.length-1].width+=r):t>n[n.length-1]&&(l+=r)),a+=r)}),this.s.dropZones=i},_.prototype._isScrolling=function(){return this.dt.table().body().parentNode!==this.dt.table().header().parentNode},_.prototype._scrollRegions=function(){var e,o,r,n;this._isScrolling()&&(o=c((e=this).dt.table().container()).position().left,r=c(this.dt.table().container()).outerWidth(),n=this.dt.table().body().parentElement.parentElement,this.s.scrollInterval=setInterval(function(){var t=e.s.mouse.absLeft;t<o+75&&n.scrollLeft?n.scrollLeft-=5:o+r-75<t&&n.scrollLeft<n.scrollWidth&&(n.scrollLeft+=5)},25))},_.defaults={columns:"",enable:!0,order:null},_.version="2.0.2";
/*! ColReorder 2.0.2
 * © SpryMedia Ltd - datatables.net/license
 */var b=_;function _(r,t){this.dom={drag:null},this.c={columns:null,enable:null,order:null},this.s={dropZones:[],mouse:{absLeft:-1,offset:{x:-1,y:-1},start:{x:-1,y:-1},target:null,targets:[]},scrollInterval:null};var e,o=this;r.settings()[0]._colReorder||((r.settings()[0]._colReorder=this).dt=r,c.extend(this.c,_.defaults,t),i(r),r.on("stateSaveParams",function(t,e,o){o.colReorder=s(r)}),r.on("destroy",function(){r.off(".colReorder"),r.colReorder.reset()}),t=r.state.loaded(),e=this.c.order,(e=t&&t.colReorder?t.colReorder:e)&&r.ready(function(){d(r,e,!0)}),r.table().header.structure().forEach(function(t){for(var e=0;e<t.length;e++)t[e]&&t[e].cell&&o._addListener(t[e].cell)}))}return n.Api.register("colReorder.enable()",function(e){return this.iterator("table",function(t){t._colReorder&&t._colReorder.enable(e)})}),n.Api.register("colReorder.disable()",function(){return this.iterator("table",function(t){t._colReorder&&t._colReorder.disable()})}),n.Api.register("colReorder.move()",function(t,e){return i(this),v(this,t=Array.isArray(t)?t:[t],e)?this.tables().every(function(){l(this,t,e),a(this)}):(this.error("ColReorder - invalid move"),this)}),n.Api.register("colReorder.order()",function(t,e){return i(this),t?this.tables().every(function(){d(this,t,e)}):this.context.length?s(this):null}),n.Api.register("colReorder.reset()",function(){return i(this),this.tables().every(function(){var t=this.columns().every(function(t){return t}).flatten().toArray();d(this,t,!0)})}),n.Api.register("colReorder.transpose()",function(t,e){return i(this),u(this,t,e=e||"toCurrent")}),n.ColReorder=b,c(h).on("stateLoadInit.dt",function(t,e,o){if("dt"===t.namespace){t=new n.Api(e);if(o.colReorder)if(t.ready())d(t,o.colReorder,!0);else{m(g(o.colReorder),o.order);for(var r=0;r<o.columns.length;r++)o.columns[r]._cr_sort=o.colReorder[r];o.columns.sort(function(t,e){return t._cr_sort-e._cr_sort})}}}),c(h).on("preInit.dt",function(t,e){var o,r;"dt"===t.namespace&&(t=e.oInit.colReorder,r=n.defaults.colReorder,t||r)&&(o=c.extend({},r,t),!1!==t)&&(r=new n.Api(e),new b(r,o))}),n});

/*! Bootstrap 4 styling wrapper for ColReorder
 * © SpryMedia Ltd - datatables.net/license
 */
!function(t){var o,d;"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-colreorder"],function(e){return t(e,window,document)}):"object"==typeof exports?(o=require("jquery"),d=function(e,n){n.fn.dataTable||require("datatables.net-bs4")(e,n),n.fn.dataTable.ColReorder||require("datatables.net-colreorder")(e,n)},"undefined"==typeof window?module.exports=function(e,n){return e=e||window,n=n||o(e),d(e,n),t(n,0,e.document)}:(d(window,o),module.exports=t(o,window,window.document))):t(jQuery,window,document)}(function(e,n,t){"use strict";return e.fn.dataTable});

/*! Responsive 3.0.2
 * © SpryMedia Ltd - datatables.net/license
 */
!function(n){var i,r;"function"==typeof define&&define.amd?define(["jquery","datatables.net"],function(e){return n(e,window,document)}):"object"==typeof exports?(i=require("jquery"),r=function(e,t){t.fn.dataTable||require("datatables.net")(e,t)},"undefined"==typeof window?module.exports=function(e,t){return e=e||window,t=t||i(e),r(e,t),n(t,e,e.document)}:(r(window,i),module.exports=n(i,window,window.document))):n(jQuery,window,document)}(function(b,y,d){"use strict";function a(e,t){if(!i.versionCheck||!i.versionCheck("2"))throw"DataTables Responsive requires DataTables 2 or newer";this.s={childNodeStore:{},columns:[],current:[],dt:new i.Api(e)},this.s.dt.settings()[0].responsive||(t&&"string"==typeof t.details?t.details={type:t.details}:t&&!1===t.details?t.details={type:!1}:t&&!0===t.details&&(t.details={type:"inline"}),this.c=b.extend(!0,{},a.defaults,i.defaults.responsive,t),(e.responsive=this)._constructor())}var i=b.fn.dataTable,e=(b.extend(a.prototype,{_constructor:function(){var o=this,r=this.s.dt,t=b(y).innerWidth(),e=(r.settings()[0]._responsive=this,b(y).on("orientationchange.dtr",i.util.throttle(function(){var e=b(y).innerWidth();e!==t&&(o._resize(),t=e)})),r.on("row-created.dtr",function(e,t,n,i){-1!==b.inArray(!1,o.s.current)&&b(">td, >th",t).each(function(e){e=r.column.index("toData",e);!1===o.s.current[e]&&b(this).css("display","none").addClass("dtr-hidden")})}),r.on("destroy.dtr",function(){r.off(".dtr"),b(r.table().body()).off(".dtr"),b(y).off("resize.dtr orientationchange.dtr"),r.cells(".dtr-control").nodes().to$().removeClass("dtr-control"),b(r.table().node()).removeClass("dtr-inline collapsed"),b.each(o.s.current,function(e,t){!1===t&&o._setColumnVis(e,!0)})}),this.c.breakpoints.sort(function(e,t){return e.width<t.width?1:e.width>t.width?-1:0}),this._classLogic(),this._resizeAuto(),this.c.details);!1!==e.type&&(o._detailsInit(),r.on("column-visibility.dtr",function(){o._timer&&clearTimeout(o._timer),o._timer=setTimeout(function(){o._timer=null,o._classLogic(),o._resizeAuto(),o._resize(!0),o._redrawChildren()},100)}),r.on("draw.dtr",function(){o._redrawChildren()}),b(r.table().node()).addClass("dtr-"+e.type)),r.on("column-reorder.dtr",function(e,t,n){o._classLogic(),o._resizeAuto(),o._resize(!0)}),r.on("column-sizing.dtr",function(){o._resizeAuto(),o._resize()}),r.on("column-calc.dt",function(e,t){for(var n=o.s.current,i=0;i<n.length;i++){var r=t.visible.indexOf(i);!1===n[i]&&0<=r&&t.visible.splice(r,1)}}),r.on("preXhr.dtr",function(){var e=[];r.rows().every(function(){this.child.isShown()&&e.push(this.id(!0))}),r.one("draw.dtr",function(){o._resizeAuto(),o._resize(),r.rows(e).every(function(){o._detailsDisplay(this,!1)})})}),r.on("draw.dtr",function(){o._controlClass()}).on("init.dtr",function(e,t,n){"dt"===e.namespace&&(o._resizeAuto(),o._resize())}),this._resize()},_colGroupAttach:function(e,t,n){var i=null;if(t[n].get(0).parentNode!==e[0]){for(var r=n+1;r<t.length;r++)if(e[0]===t[r].get(0).parentNode){i=r;break}null!==i?t[n].insertBefore(t[i][0]):e.append(t[n])}},_childNodes:function(e,t,n){var i=t+"-"+n;if(this.s.childNodeStore[i])return this.s.childNodeStore[i];for(var r=[],o=e.cell(t,n).node().childNodes,s=0,d=o.length;s<d;s++)r.push(o[s]);return this.s.childNodeStore[i]=r},_childNodesRestore:function(e,t,n){var i=t+"-"+n;if(this.s.childNodeStore[i]){var r=e.cell(t,n).node(),e=this.s.childNodeStore[i];if(0<e.length){for(var o=e[0].parentNode.childNodes,s=[],d=0,a=o.length;d<a;d++)s.push(o[d]);for(var l=0,c=s.length;l<c;l++)r.appendChild(s[l])}this.s.childNodeStore[i]=void 0}},_columnsVisiblity:function(n){for(var i=this.s.dt,e=this.s.columns,t=e.map(function(e,t){return{columnIdx:t,priority:e.priority}}).sort(function(e,t){return e.priority!==t.priority?e.priority-t.priority:e.columnIdx-t.columnIdx}),r=b.map(e,function(e,t){return!1===i.column(t).visible()?"not-visible":(!e.auto||null!==e.minWidth)&&(!0===e.auto?"-":-1!==b.inArray(n,e.includeIn))}),o=0,s=0,d=r.length;s<d;s++)!0===r[s]&&(o+=e[s].minWidth);var a=i.settings()[0].oScroll,a=a.sY||a.sX?a.iBarWidth:0,l=i.table().container().offsetWidth-a-o;for(s=0,d=r.length;s<d;s++)e[s].control&&(l-=e[s].minWidth);var c=!1;for(s=0,d=t.length;s<d;s++){var u=t[s].columnIdx;"-"===r[u]&&!e[u].control&&e[u].minWidth&&(c||l-e[u].minWidth<0?r[u]=!(c=!0):r[u]=!0,l-=e[u].minWidth)}var h=!1;for(s=0,d=e.length;s<d;s++)if(!e[s].control&&!e[s].never&&!1===r[s]){h=!0;break}for(s=0,d=e.length;s<d;s++)e[s].control&&(r[s]=h),"not-visible"===r[s]&&(r[s]=!1);return-1===b.inArray(!0,r)&&(r[0]=!0),r},_classLogic:function(){function d(e,t,n,i){var r,o,s;if(n){if("max-"===n)for(r=a._find(t).width,o=0,s=l.length;o<s;o++)l[o].width<=r&&u(e,l[o].name);else if("min-"===n)for(r=a._find(t).width,o=0,s=l.length;o<s;o++)l[o].width>=r&&u(e,l[o].name);else if("not-"===n)for(o=0,s=l.length;o<s;o++)-1===l[o].name.indexOf(i)&&u(e,l[o].name)}else c[e].includeIn.push(t)}var a=this,l=this.c.breakpoints,c=this.s.dt.columns().eq(0).map(function(e){var e=this.column(e),t=e.header().className,n=e.init().responsivePriority,e=e.header().getAttribute("data-priority");return void 0===n&&(n=null==e?1e4:+e),{className:t,includeIn:[],auto:!1,control:!1,never:!!t.match(/\b(dtr\-)?never\b/),priority:n}}),u=function(e,t){e=c[e].includeIn;-1===b.inArray(t,e)&&e.push(t)};c.each(function(e,r){for(var t=e.className.split(" "),o=!1,n=0,i=t.length;n<i;n++){var s=t[n].trim();if("all"===s||"dtr-all"===s)return o=!0,void(e.includeIn=b.map(l,function(e){return e.name}));if("none"===s||"dtr-none"===s||e.never)return void(o=!0);if("control"===s||"dtr-control"===s)return o=!0,void(e.control=!0);b.each(l,function(e,t){var n=t.name.split("-"),i=new RegExp("(min\\-|max\\-|not\\-)?("+n[0]+")(\\-[_a-zA-Z0-9])?"),i=s.match(i);i&&(o=!0,i[2]===n[0]&&i[3]==="-"+n[1]?d(r,t.name,i[1],i[2]+i[3]):i[2]!==n[0]||i[3]||d(r,t.name,i[1],i[2]))})}o||(e.auto=!0)}),this.s.columns=c},_controlClass:function(){var e,t,n;"inline"===this.c.details.type&&(e=this.s.dt,t=this.s.current,n=b.inArray(!0,t),e.cells(null,function(e){return e!==n},{page:"current"}).nodes().to$().filter(".dtr-control").removeClass("dtr-control"),e.cells(null,n,{page:"current"}).nodes().to$().addClass("dtr-control"))},_detailsDisplay:function(t,n){function e(e){b(t.node()).toggleClass("dtr-expanded",!1!==e),b(o.table().node()).triggerHandler("responsive-display.dt",[o,t,e,n])}var i,r=this,o=this.s.dt,s=this.c.details;s&&!1!==s.type&&(i="string"==typeof s.renderer?a.renderer[s.renderer]():s.renderer,"boolean"==typeof(s=s.display(t,n,function(){return i.call(r,o,t[0][0],r._detailsObj(t[0]))},function(){e(!1)})))&&e(s)},_detailsInit:function(){var n=this,i=this.s.dt,e=this.c.details,r=("inline"===e.type&&(e.target="td.dtr-control, th.dtr-control"),i.on("draw.dtr",function(){n._tabIndexes()}),n._tabIndexes(),b(i.table().body()).on("keyup.dtr","td, th",function(e){13===e.keyCode&&b(this).data("dtr-keyboard")&&b(this).click()}),e.target),e="string"==typeof r?r:"td, th";void 0===r&&null===r||b(i.table().body()).on("click.dtr mousedown.dtr mouseup.dtr",e,function(e){if(b(i.table().node()).hasClass("collapsed")&&-1!==b.inArray(b(this).closest("tr").get(0),i.rows().nodes().toArray())){if("number"==typeof r){var t=r<0?i.columns().eq(0).length+r:r;if(i.cell(this).index().column!==t)return}t=i.row(b(this).closest("tr"));"click"===e.type?n._detailsDisplay(t,!1):"mousedown"===e.type?b(this).css("outline","none"):"mouseup"===e.type&&b(this).trigger("blur").css("outline","")}})},_detailsObj:function(n){var i=this,r=this.s.dt;return b.map(this.s.columns,function(e,t){if(!e.never&&!e.control)return{className:r.settings()[0].aoColumns[t].sClass,columnIndex:t,data:r.cell(n,t).render(i.c.orthogonal),hidden:r.column(t).visible()&&!i.s.current[t],rowIndex:n,title:r.column(t).title()}})},_find:function(e){for(var t=this.c.breakpoints,n=0,i=t.length;n<i;n++)if(t[n].name===e)return t[n]},_redrawChildren:function(){var n=this,i=this.s.dt;i.rows({page:"current"}).iterator("row",function(e,t){n._detailsDisplay(i.row(t),!0)})},_resize:function(n){for(var e,i=this,r=this.s.dt,t=b(y).innerWidth(),o=this.c.breakpoints,s=o[0].name,d=this.s.columns,a=this.s.current.slice(),l=o.length-1;0<=l;l--)if(t<=o[l].width){s=o[l].name;break}var c=this._columnsVisiblity(s),u=(this.s.current=c,!1);for(l=0,e=d.length;l<e;l++)if(!1===c[l]&&!d[l].never&&!d[l].control&&!1==!r.column(l).visible()){u=!0;break}b(r.table().node()).toggleClass("collapsed",u);var h=!1,p=0,f=r.settings()[0],m=b(r.table().node()).children("colgroup"),v=f.aoColumns.map(function(e){return e.colEl});r.columns().eq(0).each(function(e,t){r.column(e).visible()&&(!0===c[t]&&p++,!n&&c[t]===a[t]||(h=!0,i._setColumnVis(e,c[t])),c[t]?i._colGroupAttach(m,v,t):v[t].detach())}),h&&(r.columns.adjust(),this._redrawChildren(),b(r.table().node()).trigger("responsive-resize.dt",[r,this._responsiveOnlyHidden()]),0===r.page.info().recordsDisplay)&&b("td",r.table().body()).eq(0).attr("colspan",p),i._controlClass()},_resizeAuto:function(){var t=this.s.dt,n=this.s.columns,r=this,o=t.columns().indexes().filter(function(e){return t.column(e).visible()});if(this.c.auto&&-1!==b.inArray(!0,b.map(n,function(e){return e.auto}))){for(var e=t.table().node().cloneNode(!1),i=b(t.table().header().cloneNode(!1)).appendTo(e),s=b(t.table().footer().cloneNode(!1)).appendTo(e),d=b(t.table().body()).clone(!1,!1).empty().appendTo(e),a=(e.style.width="auto",t.table().header.structure(o).forEach(e=>{e=e.filter(function(e){return!!e}).map(function(e){return b(e.cell).clone(!1).css("display","table-cell").css("width","auto").css("min-width",0)});b("<tr/>").append(e).appendTo(i)}),b("<tr/>").appendTo(d)),l=0;l<o.count();l++)a.append("<td/>");t.rows({page:"current"}).every(function(n){var i,e=this.node();e&&(i=e.cloneNode(!1),t.cells(n,o).every(function(e,t){t=r.s.childNodeStore[n+"-"+t];(t?b(this.node().cloneNode(!1)).append(b(t).clone()):b(this.node()).clone(!1)).appendTo(i)}),d.append(i))}),d.find("th, td").css("display",""),t.table().footer.structure(o).forEach(e=>{e=e.filter(function(e){return!!e}).map(function(e){return b(e.cell).clone(!1).css("display","table-cell").css("width","auto").css("min-width",0)});b("<tr/>").append(e).appendTo(s)}),"inline"===this.c.details.type&&b(e).addClass("dtr-inline collapsed"),b(e).find("[name]").removeAttr("name"),b(e).css("position","relative");e=b("<div/>").css({width:1,height:1,overflow:"hidden",clear:"both"}).append(e);e.insertBefore(t.table().node()),a.children().each(function(e){e=t.column.index("fromVisible",e);n[e].minWidth=this.offsetWidth||0}),e.remove()}},_responsiveOnlyHidden:function(){var n=this.s.dt;return b.map(this.s.current,function(e,t){return!1===n.column(t).visible()||e})},_setColumnVis:function(e,t){var n=this,i=this.s.dt,r=t?"":"none";this._setHeaderVis(e,t,i.table().header.structure()),this._setHeaderVis(e,t,i.table().footer.structure()),i.column(e).nodes().to$().css("display",r).toggleClass("dtr-hidden",!t),b.isEmptyObject(this.s.childNodeStore)||i.cells(null,e).indexes().each(function(e){n._childNodesRestore(i,e.row,e.column)})},_setHeaderVis:function(n,i,e){var r=this,o=i?"":"none";e.forEach(function(e){if(e[n])b(e[n].cell).css("display",o).toggleClass("dtr-hidden",!i);else for(var t=n;0<=t;){if(e[t]){e[t].cell.colSpan=r._colspan(e,t);break}t--}})},_colspan:function(e,t){for(var n=1,i=t+1;i<e.length;i++)if(null===e[i]&&this.s.current[i])n++;else if(e[i])break;return n},_tabIndexes:function(){var e=this.s.dt,t=e.cells({page:"current"}).nodes().to$(),n=e.settings()[0],i=this.c.details.target;t.filter("[data-dtr-keyboard]").removeData("[data-dtr-keyboard]"),("number"==typeof i?e.cells(null,i,{page:"current"}).nodes().to$():b(i="td:first-child, th:first-child"===i?">td:first-child, >th:first-child":i,e.rows({page:"current"}).nodes())).attr("tabIndex",n.iTabIndex).data("dtr-keyboard",1)}}),a.defaults={breakpoints:a.breakpoints=[{name:"desktop",width:1/0},{name:"tablet-l",width:1024},{name:"tablet-p",width:768},{name:"mobile-l",width:480},{name:"mobile-p",width:320}],auto:!0,details:{display:(a.display={childRow:function(e,t,n){var i=b(e.node());return t?i.hasClass("dtr-expanded")?(e.child(n(),"child").show(),!0):void 0:i.hasClass("dtr-expanded")?(e.child(!1),!1):!1!==(t=n())&&(e.child(t,"child").show(),!0)},childRowImmediate:function(e,t,n){var i=b(e.node());return!t&&i.hasClass("dtr-expanded")||!e.responsive.hasHidden()?(e.child(!1),!1):!1!==(t=n())&&(e.child(t,"child").show(),!0)},modal:function(s){return function(e,t,n,i){n=n();if(!1===n)return!1;if(t){if(!(o=b("div.dtr-modal-content")).length||e.index()!==o.data("dtr-row-idx"))return null;o.empty().append(n)}else{var r=function(){o.remove(),b(d).off("keypress.dtr"),b(e.node()).removeClass("dtr-expanded"),i()},o=b('<div class="dtr-modal"/>').append(b('<div class="dtr-modal-display"/>').append(b('<div class="dtr-modal-content"/>').data("dtr-row-idx",e.index()).append(n)).append(b('<div class="dtr-modal-close">&times;</div>').click(function(){r()}))).append(b('<div class="dtr-modal-background"/>').click(function(){r()})).appendTo("body");b(e.node()).addClass("dtr-expanded"),b(d).on("keyup.dtr",function(e){27===e.keyCode&&(e.stopPropagation(),r())})}return s&&s.header&&b("div.dtr-modal-content").prepend("<h2>"+s.header(e)+"</h2>"),!0}}}).childRow,renderer:(a.renderer={listHiddenNodes:function(){return function(i,e,t){var r=this,o=b('<ul data-dtr-index="'+e+'" class="dtr-details"/>'),s=!1;return b.each(t,function(e,t){var n;t.hidden&&(n=t.className?'class="'+t.className+'"':"",b("<li "+n+' data-dtr-index="'+t.columnIndex+'" data-dt-row="'+t.rowIndex+'" data-dt-column="'+t.columnIndex+'"><span class="dtr-title">'+t.title+"</span> </li>").append(b('<span class="dtr-data"/>').append(r._childNodes(i,t.rowIndex,t.columnIndex))).appendTo(o),s=!0)}),!!s&&o}},listHidden:function(){return function(e,t,n){n=b.map(n,function(e){var t=e.className?'class="'+e.className+'"':"";return e.hidden?"<li "+t+' data-dtr-index="'+e.columnIndex+'" data-dt-row="'+e.rowIndex+'" data-dt-column="'+e.columnIndex+'"><span class="dtr-title">'+e.title+'</span> <span class="dtr-data">'+e.data+"</span></li>":""}).join("");return!!n&&b('<ul data-dtr-index="'+t+'" class="dtr-details"/>').append(n)}},tableAll:function(i){return i=b.extend({tableClass:""},i),function(e,t,n){n=b.map(n,function(e){return"<tr "+(e.className?'class="'+e.className+'"':"")+' data-dt-row="'+e.rowIndex+'" data-dt-column="'+e.columnIndex+'"><td>'+e.title+":</td> <td>"+e.data+"</td></tr>"}).join("");return b('<table class="'+i.tableClass+' dtr-details" width="100%"/>').append(n)}}}).listHidden(),target:0,type:"inline"},orthogonal:"display"},b.fn.dataTable.Api);return e.register("responsive()",function(){return this}),e.register("responsive.index()",function(e){return{column:(e=b(e)).data("dtr-index"),row:e.parent().data("dtr-index")}}),e.register("responsive.rebuild()",function(){return this.iterator("table",function(e){e._responsive&&e._responsive._classLogic()})}),e.register("responsive.recalc()",function(){return this.iterator("table",function(e){e._responsive&&(e._responsive._resizeAuto(),e._responsive._resize())})}),e.register("responsive.hasHidden()",function(){var e=this.context[0];return!!e._responsive&&-1!==b.inArray(!1,e._responsive._responsiveOnlyHidden())}),e.registerPlural("columns().responsiveHidden()","column().responsiveHidden()",function(){return this.iterator("column",function(e,t){return!!e._responsive&&e._responsive._responsiveOnlyHidden()[t]},1)}),a.version="3.0.2",b.fn.dataTable.Responsive=a,b.fn.DataTable.Responsive=a,b(d).on("preInit.dt.dtr",function(e,t,n){"dt"===e.namespace&&(b(t.nTable).hasClass("responsive")||b(t.nTable).hasClass("dt-responsive")||t.oInit.responsive||i.defaults.responsive)&&!1!==(e=t.oInit.responsive)&&new a(t,b.isPlainObject(e)?e:{})}),i});

/*! Bootstrap 4 integration for DataTables' Responsive
 * © SpryMedia Ltd - datatables.net/license
 */
!function(n){var a,t;"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-responsive"],function(e){return n(e,window,document)}):"object"==typeof exports?(a=require("jquery"),t=function(e,d){d.fn.dataTable||require("datatables.net-bs4")(e,d),d.fn.dataTable.Responsive||require("datatables.net-responsive")(e,d)},"undefined"==typeof window?module.exports=function(e,d){return e=e||window,d=d||a(e),t(e,d),n(d,0,e.document)}:(t(window,a),module.exports=n(a,window,window.document))):n(jQuery,window,document)}(function(s,e,l){"use strict";var d=s.fn.dataTable,n=d.Responsive.display,u=n.modal,m=s('<div class="modal fade dtr-bs-modal" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"/></div></div></div>');return n.modal=function(r){return function(e,d,n,a){if(s.fn.modal){var t,o,i=n();if(!1===i)return!1;if(d){if(!s.contains(l,m[0])||e.index()!==m.data("dtr-row-idx"))return null;m.find("div.modal-body").empty().append(i)}else r&&r.header&&(o=(t=m.find("div.modal-header")).find("button").detach(),t.empty().append('<h4 class="modal-title">'+r.header(e)+"</h4>").append(o)),m.find("div.modal-body").empty().append(i),m.data("dtr-row-idx",e.index()).one("hidden.bs.modal",a).appendTo("body").modal();return!0}return u(e,d,n,a)}},d});

/*! RowReorder 1.5.0
 * © SpryMedia Ltd - datatables.net/license
 */
!function(o){var r,n;"function"==typeof define&&define.amd?define(["jquery","datatables.net"],function(t){return o(t,window,document)}):"object"==typeof exports?(r=require("jquery"),n=function(t,e){e.fn.dataTable||require("datatables.net")(t,e)},"undefined"==typeof window?module.exports=function(t,e){return t=t||window,e=e||r(t),n(t,e),o(e,t,t.document)}:(n(window,r),module.exports=o(r,window,window.document))):o(jQuery,window,document)}(function(v,d,l){"use strict";function s(t,e){if(!i.versionCheck||!i.versionCheck("1.11"))throw"DataTables RowReorder requires DataTables 1.11 or newer";if(this.c=v.extend(!0,{},i.defaults.rowReorder,s.defaults,e),this.s={bodyTop:null,dt:new i.Api(t),getDataFn:i.util.get(this.c.dataSrc),middles:null,scroll:{},scrollInterval:null,setDataFn:i.util.set(this.c.dataSrc),start:{top:0,left:0,offsetTop:0,offsetLeft:0,nodes:[],rowIndex:0},windowHeight:0,documentOuterHeight:0,domCloneOuterHeight:0,dropAllowed:!0},this.dom={clone:null,cloneParent:null,dtScroll:v("div.dataTables_scrollBody, div.dt-scroll-body",this.s.dt.table().container())},e=this.s.dt.settings()[0],t=e.rowreorder)return t;this.dom.dtScroll.length||(this.dom.dtScroll=v(this.s.dt.table().container(),"tbody")),(e.rowreorder=this)._constructor()}var i=v.fn.dataTable,t=(v.extend(s.prototype,{_constructor:function(){var r=this,n=this.s.dt,t=v(n.table().node());"static"===t.css("position")&&t.css("position","relative"),v(n.table().container()).on("mousedown.rowReorder touchstart.rowReorder",this.c.selector,function(t){var e,o;if(r.c.enable)return!!v(t.target).is(r.c.excludedChildren)||(e=v(this).closest("tr"),(o=n.row(e)).any()?(r._emitEvent("pre-row-reorder",{node:o.node(),index:o.index()}),r._mouseDown(t,e),!1):void 0)}),n.on("destroy.rowReorder",function(){v(n.table().container()).off(".rowReorder"),n.off(".rowReorder")}),this._keyup=this._keyup.bind(this)},_cachePositions:function(){var t=this.s.dt,r=v(t.table().node()).find("thead").outerHeight(),e=v.unique(t.rows({page:"current"}).nodes().toArray()),e=v.map(e,function(t,e){var o=v(t).position().top-r;return(o+o+v(t).outerHeight())/2});this.s.middles=e,this.s.bodyTop=v(t.table().body()).offset().top,this.s.windowHeight=v(d).height(),this.s.documentOuterHeight=v(l).outerHeight(),this.s.bodyArea=this._calcBodyArea()},_clone:function(t){var e=this.s.dt,e=v(e.table().node().cloneNode(!1)).addClass("dt-rowReorder-float").append("<tbody/>").append(t.clone(!1)),o=t.outerWidth(),r=t.outerHeight(),n=v(v(this.s.dt.table().node()).parent()),s=n.width(),n=n.scrollLeft(),i=t.children().map(function(){return v(this).width()}),t=(e.width(o).height(r).find("tr").children().each(function(t){this.style.width=i[t]+"px"}),v("<div>").addClass("dt-rowReorder-float-parent").width(s).append(e).appendTo("body").scrollLeft(n));this.dom.clone=e,this.dom.cloneParent=t,this.s.domCloneOuterHeight=e.outerHeight()},_clonePosition:function(t){var e=this.s.start,o=this._eventToPage(t,"Y")-e.top,t=this._eventToPage(t,"X")-e.left,r=this.c.snapX,o=o+e.offsetTop,r=!0===r?e.offsetLeft:"number"==typeof r?e.offsetLeft+r:t+e.offsetLeft+this.dom.cloneParent.scrollLeft();o<0?o=0:o+this.s.domCloneOuterHeight>this.s.documentOuterHeight&&(o=this.s.documentOuterHeight-this.s.domCloneOuterHeight),this.dom.cloneParent.css({top:o,left:r})},_emitEvent:function(o,r){var n;return this.s.dt.iterator("table",function(t,e){t=v(t.nTable).triggerHandler(o+".dt",r);void 0!==t&&(n=t)}),n},_eventToPage:function(t,e){return(-1!==t.type.indexOf("touch")?t.originalEvent.touches[0]:t)["page"+e]},_mouseDown:function(t,e){var o=this,r=this.s.dt,n=this.s.start,s=this.c.cancelable,i=e.offset(),i=(n.top=this._eventToPage(t,"Y"),n.left=this._eventToPage(t,"X"),n.offsetTop=i.top,n.offsetLeft=i.left,n.nodes=v.unique(r.rows({page:"current"}).nodes().toArray()),this._cachePositions(),this._clone(e),this._clonePosition(t),this._eventToPage(t,"Y")-this.s.bodyTop),r=(n.rowIndex=this._calcRowIndexByPos(i),(this.dom.target=e).addClass("dt-rowReorder-moving"),v(l).on("mouseup.rowReorder touchend.rowReorder",function(t){o._mouseUp(t)}).on("mousemove.rowReorder touchmove.rowReorder",function(t){o._mouseMove(t)}),v(d).width()===v(l).width()&&v(l.body).addClass("dt-rowReorder-noOverflow"),this.dom.dtScroll);this.s.scroll={windowHeight:v(d).height(),windowWidth:v(d).width(),dtTop:r.length?r.offset().top:null,dtLeft:r.length?r.offset().left:null,dtHeight:r.length?r.outerHeight():null,dtWidth:r.length?r.outerWidth():null},s&&v(l).on("keyup",this._keyup)},_mouseMove:function(t){this._clonePosition(t);for(var e,o,r=this.s.start,n=this.c.cancelable,s=(n&&(e=this.s.bodyArea,o=this._calcCloneParentArea(),this.s.dropAllowed=this._rectanglesIntersect(e,o),this.s.dropAllowed?v(this.dom.cloneParent).removeClass("drop-not-allowed"):v(this.dom.cloneParent).addClass("drop-not-allowed")),this._eventToPage(t,"Y")-this.s.bodyTop),i=this.s.middles,d=null,l=0,a=i.length;l<a;l++)if(s<i[l]){d=l;break}null===d&&(d=i.length),n&&(this.s.dropAllowed||(d=r.rowIndex>this.s.lastInsert?r.rowIndex+1:r.rowIndex),this.dom.target.toggleClass("dt-rowReorder-moving",this.s.dropAllowed)),this._moveTargetIntoPosition(d),this._shiftScroll(t)},_mouseUp:function(t){var e=this,o=this.s.dt,r=this.c.dataSrc;if(this.s.dropAllowed){for(var n,s,i,d=this.s.start.nodes,l=v.unique(o.rows({page:"current"}).nodes().toArray()),a={},c=[],h=[],u=this.s.getDataFn,f=this.s.setDataFn,w=0,p=d.length;w<p;w++)d[w]!==l[w]&&(n=o.row(l[w]).id(),s=o.row(l[w]).data(),i=o.row(d[w]).data(),n&&(a[n]=u(i)),c.push({node:l[w],oldData:u(s),newData:u(i),newPosition:w,oldPosition:v.inArray(l[w],d)}),h.push(l[w]));var g,m=[c,{dataSrc:r,nodes:h,values:a,triggerRow:o.row(this.dom.target),originalEvent:t}];!1===this._emitEvent("row-reorder",m)?e._cancel():(this._cleanupDragging(),g=function(){if(e.c.update){for(w=0,p=c.length;w<p;w++){var t=o.row(c[w].node).data();f(t,c[w].newData),o.columns().every(function(){this.dataSrc()===r&&o.cell(c[w].node,this.index()).invalidate("data")})}e._emitEvent("row-reordered",m),o.draw(!1)}},this.c.editor?(this.c.enable=!1,this.c.editor.edit(h,!1,v.extend({submit:"changed"},this.c.formOptions)).multiSet(r,a).one("preSubmitCancelled.rowReorder",function(){e.c.enable=!0,e.c.editor.off(".rowReorder"),o.draw(!1)}).one("submitUnsuccessful.rowReorder",function(){o.draw(!1)}).one("submitSuccess.rowReorder",function(){g()}).one("submitComplete",function(){e.c.enable=!0,e.c.editor.off(".rowReorder")}).submit()):g())}else e._cancel()},_moveTargetIntoPosition:function(t){var e,o,r=this.s.dt;null!==this.s.lastInsert&&this.s.lastInsert===t||(e=v.unique(r.rows({page:"current"}).nodes().toArray()),o="",o=t>this.s.lastInsert?(this.dom.target.insertAfter(e[t-1]),"after"):(this.dom.target.insertBefore(e[t]),"before"),this._cachePositions(),this.s.lastInsert=t,this._emitEvent("row-reorder-changed",{insertPlacement:o,insertPoint:t,row:r.row(this.dom.target)}))},_cleanupDragging:function(){var t=this.c.cancelable;this.dom.clone.remove(),this.dom.cloneParent.remove(),this.dom.clone=null,this.dom.cloneParent=null,this.dom.target.removeClass("dt-rowReorder-moving"),v(l).off(".rowReorder"),v(l.body).removeClass("dt-rowReorder-noOverflow"),clearInterval(this.s.scrollInterval),this.s.scrollInterval=null,t&&v(l).off("keyup",this._keyup)},_shiftScroll:function(t){var e,o,r=this,n=this.s.scroll,s=!1,i=t.pageY-l.body.scrollTop;i<v(d).scrollTop()+65?e=-5:i>n.windowHeight+v(d).scrollTop()-65&&(e=5),null!==n.dtTop&&t.pageY<n.dtTop+65?o=-5:null!==n.dtTop&&t.pageY>n.dtTop+n.dtHeight-65&&(o=5),e||o?(n.windowVert=e,n.dtVert=o,s=!0):this.s.scrollInterval&&(clearInterval(this.s.scrollInterval),this.s.scrollInterval=null),!this.s.scrollInterval&&s&&(this.s.scrollInterval=setInterval(function(){var t;n.windowVert&&(t=v(l).scrollTop(),v(l).scrollTop(t+n.windowVert),t!==v(l).scrollTop())&&(t=parseFloat(r.dom.cloneParent.css("top")),r.dom.cloneParent.css("top",t+n.windowVert)),n.dtVert&&(t=r.dom.dtScroll[0],n.dtVert)&&(t.scrollTop+=n.dtVert)},20))},_calcBodyArea:function(t){var e=this.s.dt,o=v(e.table().body()).offset();return{left:o.left,top:o.top,right:o.left+v(e.table().body()).width(),bottom:o.top+v(e.table().body()).height()}},_calcCloneParentArea:function(t){var e=v(this.dom.cloneParent).offset();return{left:e.left,top:e.top,right:e.left+v(this.dom.cloneParent).width(),bottom:e.top+v(this.dom.cloneParent).height()}},_rectanglesIntersect:function(t,e){return!(t.left>=e.right||e.left>=t.right||t.top>=e.bottom||e.top>=t.bottom)},_calcRowIndexByPos:function(r){var t=this.s.dt,e=v.unique(t.rows({page:"current"}).nodes().toArray()),n=-1,s=v(t.table().node()).find("thead").outerHeight();return v.each(e,function(t,e){var o=v(e).position().top-s,e=o+v(e).outerHeight();o<=r&&r<=e&&(n=t)}),n},_keyup:function(t){this.c.cancelable&&27===t.which&&(t.preventDefault(),this._cancel())},_cancel:function(){var t=this.s.start,t=t.rowIndex>this.s.lastInsert?t.rowIndex+1:t.rowIndex;this._moveTargetIntoPosition(t),this._cleanupDragging(),this._emitEvent("row-reorder-canceled",[this.s.start.rowIndex])}}),s.defaults={dataSrc:0,editor:null,enable:!0,formOptions:{},selector:"td:first-child",snapX:!1,update:!0,excludedChildren:"a",cancelable:!1},v.fn.dataTable.Api);return t.register("rowReorder()",function(){return this}),t.register("rowReorder.enable()",function(e){return void 0===e&&(e=!0),this.iterator("table",function(t){t.rowreorder&&(t.rowreorder.c.enable=e)})}),t.register("rowReorder.disable()",function(){return this.iterator("table",function(t){t.rowreorder&&(t.rowreorder.c.enable=!1)})}),s.version="1.5.0",v.fn.dataTable.RowReorder=s,v.fn.DataTable.RowReorder=s,v(l).on("init.dt.dtr",function(t,e,o){var r,n;"dt"===t.namespace&&(t=e.oInit.rowReorder,r=i.defaults.rowReorder,t||r)&&(n=v.extend({},t,r),!1!==t)&&new s(e,n)}),i});

/*! Bootstrap 4 styling wrapper for RowReorder
 * © SpryMedia Ltd - datatables.net/license
 */
!function(t){var o,r;"function"==typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-rowreorder"],function(e){return t(e,window,document)}):"object"==typeof exports?(o=require("jquery"),r=function(e,n){n.fn.dataTable||require("datatables.net-bs4")(e,n),n.fn.dataTable.RowReorder||require("datatables.net-rowreorder")(e,n)},"undefined"==typeof window?module.exports=function(e,n){return e=e||window,n=n||o(e),r(e,n),t(n,0,e.document)}:(r(window,o),module.exports=t(o,window,window.document))):t(jQuery,window,document)}(function(e,n,t){"use strict";return e.fn.dataTable});

var ferveX = jQuery.noConflict(true);
ferveX(document).ready(function() {
  var url = document.location.href;
  const BASE_URL = document.location.origin;
  const COOKIE_DOMAIN = document.location.hostname.match(/([^\.]+\.[^\.]+)$/)[0] || document.location.hostname;
  const SIZE_UNITS = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
  var styleBouton = "margin:15px 8px 0; display:inline-block; border-radius:25px; padding:8px 15px; text-transform:uppercase; background:#4e5c6f; color:#fff; font-size:13px; font-weight:700; transition:background 0.5s ease;";
  var styleBoutonF = "margin:15px 8px 0; display:inline-block; border-radius:25px; padding:8px 15px; text-transform:uppercase; background:#267bbb; color:#fff; font-size:13px; font-weight:700; transition:background 0.5s ease;";
  var styleBoutonS = "margin:15px 8px 0; display:inline-block; border-radius:25px; padding:8px 15px; text-transform:uppercase; background:#885599; color:#fff; font-size:13px; font-weight:700; transition:background 0.5s ease;";
  ferveX("head link[rel='stylesheet']").last().after('<style type="text/css">#top_panel{z-index: 1000}.promo-container{display:none!important}body #middle .search-criteria td button.solo{width:180px!important}.w65{width:65px}.f16{font-size:16px;vertical-align:text-top;}.butonFervexHover{background:#22282f!important;color:#fff!important;text-decoration:none!important}.focus-wrap-nav .p-navEl-link[data-nav-id=moncompte]:before{content:"\\f007"}.focus-wrap-nav .p-navEl-link[data-nav-id=messagerie]:before{content:"\\f0e0"}.focus-wrap-nav .p-navEl-link[data-nav-id=uploadtorrent]:before{content:"\\f093"}.focus-wrap-nav .p-navEl-link[data-nav-id=chercheCopain]:before{content:"\\f002"}.focus-wrap-nav .p-navEl-link[data-nav-id=voirfavoris]:before{content:"\\f02e"}.fervexTools{box-shadow:0px 0px 4px rgba(0,0,0,.5)!important;border:solid 1px #777;z-index:999999;background:#dff0d8;}.fervexTools:hover{box-shadow:0px 3px 10px rgba(0,0,0,.6)!important}.fervexTools1{position:fixed;padding:2px 3px;border-radius:4px;font-size:12px}.fervexTools2{position:absolute;padding:4px 3px 4px 5px;border-radius:50%;width:25px;height:25px;line-height:1.15}.fervexTime{position:absolute;top:35px;width:100%;text-align:center;color:#eee;}.fervexTime .badge{font-size:100%}.fervexTime .badge span{color:#6cded4}#fervextip{position:fixed;z-index:1070;display:inline-block;font-size:.875rem;text-transform:none;font-weight:400;font-style:normal;}#fervextip .tipBody{display:inline-block;max-width:200px;padding:3px 8px;color:#fff;text-align:center;background-color:#000;border-radius:.25rem;}.config-recherche-bas,.config-recherche-popup,.config-recherche-date-desc,.config-recherche-date-asc,.config-sidebar-on,.config-sidebar-off,.config-notifs-on,.config-notifs-off,.config-notifs-total-on,.config-notifs-total-off,.config-preview-on,.config-preview-off,.config-preview2-on,.config-preview2-off{padding:4px 6px;font-size:0.875em;text-transform:inherit;font-weight:400;font-family:inherit} #nfoModal .modal-body pre{white-space: pre-wrap}.results .dataTables_info {display: inherit!important}.m-2{margin:0.5rem}.ico_spin {animation: spin-animation 1s infinite;animation-timing-function: linear;}@keyframes spin-animation {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}#middle .content table.notif td{padding:6px 10px!important;font-size:12px;}#middle table.notif tbody td .btn{margin-top:0;}#middle table.notif td:first-child {width:130px}.block-outer-main+.block-outer-main {margin-left:15px;}</style>');
  ferveX("body").prepend('<div class="fervexTools fervexTools1" style="display:none"><a href="#" style="text-decoration:none" title="Recherche torrent sur YGG" target="_blank">Recherche</a></ul>');
  /* cookies & backup */
  function setCookie(name, value, days, domain = COOKIE_DOMAIN) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + ";domain=." + domain + ";path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function setBackup(name, value) {
    GM_setValue(name + "_backup", value);
  }

  function getBackup(name) {
    return GM_getValue(name + "_backup", null);
  }

  function setValue(name, value, days) {
    setCookie(name, value, days, COOKIE_DOMAIN);
    setBackup(name, value);
  }

  function getValue(name, days) {
    var value = getCookie(name);
    if (value === null) {
      value = getBackup(name);
      if (value !== null) {
        setCookie(name, value, days, COOKIE_DOMAIN);
      }
    } else {
      setBackup(name, value);
    }
    return value;
  }
  /* fonction conversion octets */
  function formatOctets(bytes, decimals = 2) {
    if (bytes === 0) return '~0';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + SIZE_UNITS[i];
  }

  function sizeStringToByteNumber(sizeString) {
    const sizeUnit = sizeString.substring(sizeString.length - 2);
    const sizeUnitIndex = SIZE_UNITS.findIndex((si) => (si === sizeUnit));
    const size = Number.parseFloat(sizeString.slice(0, -2));
    if (sizeUnitIndex >= 1) {
      return size * Math.pow(1024, sizeUnitIndex);
    }
    return size;
  }
  /* calcul avancement */
  ferveX(document).ready(function() {
    var up = ferveX('#top_panel .ct li:first-child strong:first-child').text().trim();
    var down = ferveX('#top_panel .ct li:first-child strong:nth-child(2)').text().trim();
    if (!up || !down) {
      return;
    }
    var avancement = sizeStringToByteNumber(up) - sizeStringToByteNumber(down);
    ferveX('#top_panel .ct li:first-child').after('<li><strong>Δ ' + (avancement < 0 ? '<1 !' : formatOctets(avancement)) + '</strong></li>');
  });
  /* Sélecteur pour Recherche dynamique */
  if (!window.x) {
    x = {};
  }
  x.Selector = {};
  x.Selector.getSelected = function() {
    var t = '';
    if (window.getSelection) {
      t = window.getSelection();
    } else if (document.getSelection) {
      t = document.getSelection();
    } else if (document.selection) {
      t = document.selection.createRange().text;
    }
    return t;
  }
  var pageX;
  var pageY;
  var fervexTemp = '0';
  /* Icone recherche dynamique */
  var iconeRecherche = 'ico_search';
  if (url.indexOf("/forum/") > -1) {
    iconeRecherche = 'fa fa-search';
  }
  const sidebar = (getValue('fervex_sidebar') == 'on') ? " checked" : "";
  const notifs = (getValue('fervex_notifs') == 'off') ? "" : " checked";
  const notifs_total = (getValue('fervex_notifs_total') == 'off') ? "" : " checked";
  const preview = (getValue('fervex_preview') == 'on') ? " checked" : "";
  const preview_delai = (getValue('fervex_preview_delai') !== null) ? getValue('fervex_preview_delai') : 400;
  const preview_height = (getValue('fervex_preview_height') !== null) ? getValue('fervex_preview_height') : 300;
  const preview2 = (getValue('fervex_preview2') == 'on') ? " checked" : "";
  const darkmode = (getValue('re_darkmode') == 'on') ? " checked" : "";
  const scroll = (getValue('re_scroll') == 'on') ? " checked" : "";
  ferveX("body")
    .prepend('<div id="fervexConf" style="display:none;position:fixed;right:10px;top:10px;background:#21242b;z-index:999999;border:1px solid #777;color:#ddd;text-align:center;font-size: 13px; max-height:90vh;  overflow-x:auto;">' +
      '    <div style="border-bottom:1px solid #777; padding:8px; background:#222; cursor:move" id="fervexConfMenu">' +
      '        <b>ReYGGTools</b>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Mode sombre (Dark Mode)</p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-darkmode-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-darkmode-off">Non</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Recherche sur sélection</p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-recherche-bas">Bas de l\'écran</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-recherche-popup">Popup</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Recherche par défaut</p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-recherche-date-desc">Plus récent</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-recherche-date-asc">Plus ancien</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Afficher la sidebar ?</p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-sidebar-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-sidebar-off">Non</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Afficher lien "notifications" si 0 notif ?</p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-notifs-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-notifs-off">Non</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Afficher compteur notifs total ?</p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-notifs-total-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-notifs-total-off">Non</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Afficher preview (survol) ?</p>' +
      '        <p style="margin-bottom:10px">' +
      '            <button type="button" class="btn btn-sm btn-primary config-preview-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-preview-off">Non</button>' +
      '        </p>' +
      '        <p style="margin-bottom:10px">' +
      '            <input type="range" class="height_preview" min="100" max="600" step="10" value="' + preview_height + '"><br>' +
      '            Hauteur image : <span class="height_preview_value">' + preview_height + '</span> px' +
      '        </p>' +
      '        <p style="margin-bottom:0">' +
      '            <input type="range" class="tempo_preview" min="100" max="1000" step="100" value="' + preview_delai + '"><br>' +
      '            Délai : <span class="tempo_preview_value">' + preview_delai + '</span> ms' +
      '        </p>' +
      '    </div>' +
      '    <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Afficher preview (fixe) ?<br><em style="color:#ccc;font-size:11px">[expérimental]</em></p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-preview2-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-preview2-off">Non</button>' +
      '        </p>' +
      '    </div>' +
      '        <div style="border-bottom:1px solid #777; padding:10px 10px 12px">' +
      '        <p style="margin: 0 0 7px">Infinite Scroll ?<br><em style="color:#ccc;font-size:11px">[expérimental]</em></p>' +
      '        <p style="margin-bottom:0">' +
      '            <button type="button" class="btn btn-sm btn-primary config-scroll-on">Oui</button> ' +
      '            <button type="button" class="btn btn-sm btn-primary config-scroll-off">Non</button>' +
      '        </p>' +
      '    </div>' +
      '    <div style="padding:8px; background:#222; cursor: pointer;" id="close_menu_reyggtools">Fermer</div>' +
      '</div>'
    );
  ferveX('#update-settings')
    .append('<h2>Paramètres ReYGGTools</h2>' +
      '<table>' +
      '	<tbody>' +
      '		<tr>' +
      '			<td style="width:240px">' +
      '				<a type="button" class="my-1 mr-1 btn btn-sm btn-primary config-recherche-bas">Bas de l\'écran</a>' +
      '				<a type="button" class="my-1 btn btn-sm btn-primary config-recherche-popup">En popup</a>' +
      '			</td>' +
      '			<td><strong>Recherche sur sélection de texte</strong> <small>&nbsp; (Affiche un bouton en bas d\écran ou en popup pour lancer une recherche torrent du texte sélectionné)</small></td>' +
      '		<tr>' +
      '		<tr>' +
      '			<td>' +
      '				<a type="button" class="my-1 mr-1 btn btn-sm btn-primary config-recherche-date-desc">Plus récent</a>' +
      '				<a type="button" class="my-1 btn btn-sm btn-primary config-recherche-date-asc">Plus ancien</a>' +
      '			</td>' +
      '			<td><strong>Tri du moteur de recherche par défaut</strong> <small>&nbsp; (Affiche les torrents plus récents/anciens en premier)</small></td>' +
      '		<tr>' +
      '		<tr>' +
      '			<td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" id="config_sidebar"' + sidebar + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td><strong>Afficher la sidebar</strong> <small>&nbsp; (Afficher la barre latérale de gauche contenant les catégories des torrents)</small></td>' +
      '   <tr>' +
      '   <td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" id="config_darkmode"' + darkmode + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td><strong>Afficher en mode sombre (YGGDark)</strong> <small>&nbsp; (Affichage de YGG et de son forum dans un thème sombre)</small></td>' +
      '		<tr>' +
      '		<tr>' +
      '			<td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" id="config_notifs"' + notifs + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td><strong>Afficher le lien "notifications" si 0 notif</strong> <small>&nbsp; (Afficher le lien "notifications" dans le menu en haut de page même si aucun notif reçue)</small></td>' +
      '		<tr>' +
      '		<tr>' +
      '			<td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" id="config_notifs_total"' + notifs_total + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td><strong>Afficher le compteur de notifs total</strong> <small>&nbsp; (Afficher la bulle verte dans le menu en haut de page)</small></td>' +
      '		<tr>' +
      '		<tr>' +
      '			<td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" class="my-1" id="config_preview"' + preview + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td>' +
      '				<p class="mb-2"><strong>Afficher les prévisualisations de jaquettes sur les torrents au survol de la souris</strong></p>' +
      '				<p class="mb-2"><input type="range" class="height_preview" min="100" max="600" step="10" value="' + preview_height + '"> Hauteur image : <span class="height_preview_value">' + preview_height + '</span> px</p>' +
      '				<p><input type="range" class="tempo_preview" min="100" max="1000" step="100" value="' + preview_delai + '"> Délai : <span class="tempo_preview_value">' + preview_delai + '</span> ms</p>' +
      '			</td>' +
      '		<tr>' +
      '		<tr>' +
      '			<td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" class="my-1" id="config_preview2"' + preview2 + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td><strong>Afficher les miniatures des jaquettes dans les listes de torrents</strong></td>' +
      '		<tr>' +
      '     <tr>' +
      '			<td>' +
      '				<div class="pretty p-default">' +
      '					<input type="checkbox" class="my-1" id="config_scroll"' + scroll + '>' +
      '					<div class="state"><label></label></div>' +
      '				</div>' +
      '			</td>' +
      '			<td><strong>Afficher les torrents à l\'infini lors de la recherche et dans la liste exclu (Infinite Scroll)</strong></td>' +
      '		<tr>' +
      '	</tbody>' +
      '</table>');

  function TheDarkSide() {
    function addGlobalStyle(css) {
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
    var url = window.location.href;
    if (url.indexOf("/team/") === -1) {
      if (url.indexOf("/forum/") === -1) {
        addGlobalStyle(`
            #middle .default a {
              color: #cdcdcd!important
            }
            .modal-body {
              background-color: #333333!important;
              color: #ffffff!important;
            }
            .description-header {
              background: #2C343F!important;
            }
            .text-dark {
              color: white!important;
            }
            .text-left {
              color: white!important;
            }
            .font-italic {
              color: white!important;
            }
            .text-justify {
              color: white!important;
            }
            .border-dark {
              border-color: white!important;
            }
            .form-control {
              background: #1a2028!important;
              color: white!important;
            }
            .alert-dark {
              background-color: #252C35!important;
              color: white!important;
            }
            ::selection {
              background-color: rgba(149, 152, 157, 0.5);
            }
            .modal-footer {
              background-color: #2C343F!important;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #575a5c ;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb {
              background: #1b3544;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #2b2f31;
            }

            #middle .default,
            #middle .detail-account {
              background: #2a313a!important;
              color: #cdcdcd!important;
            }
            #middle .default .date, #middle #description .date {
              background: #2a313a!important;
              border-top: none!important;
            }

            form label {
              color: #aaa;
              margin-top: 2px;
            }

            .results {
              box-shadow: 0 0 10px rgb(0 0 0 / 15%)!important;
              background: #2a313a!important;
            }
            .results thead th {
              color: #ddd!important;
              background: #1d232a!important;
            }
            results tr:nth-child(odd) td,
            #middle table.notif tbody tr:nth-child(odd) td {
              background: #2a313a!important;
            }

            .results td,
            #middle table.notif tbody td,
            #middle table td {
              background: #252c35!important;
              color: #aaa;
              border: 1px solid transparent!important;
              border-right: 1px solid #212121!important;
              border-bottom: 1px solid #212121!important;
              font-size: 12px;
            }
            #middle .results table tbody tr:nth-child(odd) td {
              background: #2a313a!important;
            }
            #torrents .results #DataTables_Table_0_filter > label > input {
              background: #1d232a;
              color: #fff;
            }

            #middle .search-criteria,
            #middle .notifications {
              background: #1d232a!important;
            }
            #middle .search-criteria td,
            #middle .detail-account td{
              background: #1d232a!important;
              padding: 9px 8px!important;
              border-right: 1px solid transparent!important;
              border-bottom: 1px solid transparent!important;
            }

            #middle table td a:not(.text-warning):not(.text-danger) {
              color: #eee!important;
            }
            #middle .detail-account td a {
              color: #7191bd!important;
            }

            #middle table td a.butt {
              border-radius: 8px;
              border: 2px solid #5ad9a4;
              top: 0px;
              font-weight: 500;
              text-transform: inherit;
              font-size: 12px;
              padding: 4px 6px;
              color: #ffffff!important;
            }

            #middle .search-criteria td.adv_search_option, #middle .search-criteria td:first-child {
              background: #1d232a!important;
            }

            .search-criteria tr:first-child{
              padding-top:5px!important;
            }
            .search-criteria tr:last-child{
              padding-bottom:5px!important;
            }

            #middle .search-criteria tr td:first-child,.search-criteria tr td:first-child, .search-criteria td.adv_search_option {
              color: #bbb!important;
            }
            #middle .search-criteria td .input-table {
              border: none!important;
              background-color: rgba(250,250,250,.03)!important;
              color: #ddd!important;
            }
            #middle .search-criteria td.alone {
              background: #1d232a!important
            }

            .select2-container--bootstrap .select2-selection {
              background-color: rgba(250,250,250,.03)!important;
              border: none!important;
            }
            .select2-selection__rendered, .select2-selection__rendered {
              color: #555555!important;
              background-color: unset!important;
              border: none!important;
            }
            .select2-container--bootstrap .select2-selection--single .select2-selection__rendered {
              color: #ddd!important;
              padding: 0!important;
            }
            .select2-dropdown {
              color: #aaa;
              background-color: #242a31;
              border: 1px solid #1b1e24;
            }
            .select2-container--bootstrap .select2-search--dropdown .select2-search__field {
              background-color: #1d232a;
              border: 1px solid #2b2f31;
              color: #aaa;
            }
            .select2-container--bootstrap .select2-results__option[aria-selected=true] {
              background-color: #1d232a;
              color: #ebebeb;
            }

            select.form-control:not([size]):not([multiple]):not(.select-tracker) {
              height: 40px!important;
              background: #1d232a!important;
              color: #aaa!important;
            }
            #upload-torrent input[type=text]{
              background: #1d232a!important;
            }
            #middle #upload-torrent .default input,
            #middle #torrent_description {
              background: #1d232a!important;
              color: #aaa!important;
            }

            #middle .pagination {
              background: #2a313a!important;
            }
            #middle .pagination li {
              border-left: 1px solid #1d232a!important;
            }
            #middle .pagination li a {
              background: #343c46!important;
              color: #999!important;
            }

            #middle .content .results .dataTables_wrapper {
              margin-bottom: 28px!important;
            }
            #middle .content .results .dataTables_info {
              color: #777!important;
            }

            #middle .add-comment, #middle .add-note {
              background: #2b2f31;
              border-bottom: 3px solid #2b2f31;
            }

            #middle .add-comment textarea, #middle .add-note textarea {
              color: #aaa;
            }

            .wysibb {
              border: 1px solid #1c1c1c;
              position: relative;
              background: #1f2224;
              font-size: 13px;
            }

            @media screen and (min-width: 992px) {
              .wysibb .wysibb-toolbar {
                background: #222;
                border-bottom: 1px solid #1c1c1c;
              }

              .wysibb .wysibb-toolbar .wysibb-toolbar-container {
                margin: 0;
                border-right: 1px solid #1c1c1c;
                padding: 0;
                display: inline-block;
              }

              .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn .wbb-list {
                border: 1px solid #1f2224;
                box-shadow: 0 3px 20px #111;
                background: #2a313c;
                color: #aaa;
              }

              .wbb-list .sc {
                border: 0;
              }
            }

            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn .fonticon,
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn span.btn-inner,
            .wbb-select .val {
              color: #aaa;
              text-shadow: none;
            }
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn:hover,
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.wbb-select:hover,
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.wbb-dropdown:hover {
              background: #111;
            }
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.wbb-select.on,
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn.wbb-select.on:active {
              border: 1px solid #333;
              background: #111;
              box-shadow: none;
            }
            .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn:hover .fonticon {
              color: #aaa;
            }

            .wysibb .wysibb-text {
              color: #aaa;
              font-size: 13px;
            }

            #commentary {
              background: #2a313c;
            }
            #middle .comment h4, #middle #commentary h4 {
              color: #ddd;
            }
            #commentary li {
              border-top: 0;
            }
            #commentary li .left {
              border: 1px solid #1f2224;
              border-radius: 8px;
              background: #22282f;
            }
            #commentary li .left .rang {
              padding: 4px;
              border-radius: 0;
            }
            #commentary li .left .name {
              font-size: 12px;
              padding: 6px 0;
              color: #aaa;
            }
            #commentary li .left .ratio {
              font-size: 9.8px;
              padding: 6px 0;
              border-top: 1px solid #1f2224;
            }
            #commentary li .message {
              color: #aaa;
              background: #22282f;
              border: 1px solid #1f2224;
              font-size: 13px;
              border-radius: 6px;
            }
            #commentary li .message a {
              font-weight: 600;
              color: #7191bd;
            }
            #commentary li .message .add {
              font-size: 13px;
              color: #dfdfdf;
              padding-bottom: 10px;
              margin-bottom: 10px;
              border-bottom: 1px solid #1f2224;
            }
            #commentary li .message:before {
              border-right: 15px solid #22282f;
            }
            #commentary li .message:after {
              border-right: 16px solid #1f2224;
            }

            a.sender-badge {
              background: #222222!important;
            }
            a.btn.grey {
              background: #575a5c!important;
              border: 2px solid transparent;
              color: #fff!important;
            }
            a.btn.grey:hover {
              background: #4b4d4f!important;
            }
            .table-bordered, .table-bordered td, .table-bordered th {
              border-color: #222!important;
              background-color: #252C35!important;
            }
            .text-danger {
              background-color: #252C35!important;
            }
            .results td:nth-child(8) {
              color: #01ca01!important;
            }
            .results td:nth-child(9) {
              color: #fd1111!important;
            }


            .card {
              background-color: #2a313a!important;
              color: #cdcdcd;
            }
            .card-footer {
              color: rgba(255,255,255,.4)!important;
              border-top: 1px solid rgba(255,255,255,.1)!important;
              background: #2a313a!important;
            }

            #feeds .table thead th {
              border-bottom: 1px solid #191919!important;
              border-top: 1px solid #191919!important;
              background: #1d232a!important;
            }
          `);
      } else {
        addGlobalStyle(`
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #575a5c ;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb {
              background: #1b3544;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #2b2f31;
            }

            html {
              color: #aaa;
              background-image: none!important;
              background-color: #1f2224!important;
            }

            a {
              color: #ececec;
              text-decoration: none
            }

            a:hover {
              color: #6bb2df
            }

            svg {
              fill: currentColor
            }

            .u-concealed,.u-concealed a,.u-cloaked,.u-cloaked a,.u-concealed--icon,.u-concealed--icon a {
              text-decoration: inherit !important;
              color: inherit !important
            }

            a.u-concealed:hover,.u-concealed a:hover {
              text-decoration: underline !important
            }

            a.u-concealed:hover .fa,.u-concealed a:hover .fa {
              color: #6bb2df
            }

            a.u-concealed--icon:hover .fa,.u-concealed--icon a:hover .fa {
              color: #6bb2df
            }

            .u-textColor {
              color: #aaa
            }

            .u-dimmed {
              color: #969696
            }

            .u-muted {
              color: #818181
            }

            .u-dimmed a,.u-muted a,.u-faint a {
              color: inherit;
              text-decoration: none
            }

            .u-featuredText {
              color: #49a1d8
            }

            .u-accentText {
              color: #49a1d8
            }

            .u-accentText a {
              color: #49a1d8
            }

            .pairs.pairs--plainLabel>dt {
              color: inherit
            }

            .pairs>dt {
              color: #818181
            }

            .categoryList-itemDesc {
              color: #818181;
            }

            .categoryList-header {
              color: #49a1d8;
            }

            .categoryList-header.categoryList-header--muted {
              color: #818181
            }

            .categoryList-header a {
              color: inherit;
              text-decoration: none
            }

            .categoryList-link {
              color: inherit
            }

            .categoryList-toggler {
              color: inherit
            }

            .siropuShoutboxHeader {
              border-bottom: none;
              color: #aaa
            }
            .siropuShoutbox form {
              margin-bottom: 20px;
            }

            .blocks-header {
              color: #818181
            }

            .blocks-header.blocks-header--strong {
              color: #969696
            }

            .blocks-header.blocks-header--strong .blocks-desc {
              color: #818181
            }

            .block-outer .block-outer-hint {
              color: #818181
            }

            .block-container, .block--messages .message {
              color: #aaa;
              background: #22282f;
              border: 1px solid #1e1f1f;
            }

            html:not(.focus-grid) .node-body {
              padding: 0
            }

            .node+.node {
              border-top: 1px solid #191b1c
            }

            #nfo {
                background: #2e2e2e; /* Couleur de fond gris foncé */
                color: #ffffff; /* Couleur de texte blanche */
            }
            pre {
                background: inherit; /* Assure que le fond de l'élément <pre> hérite du fond de #nfo */
                color: inherit; /* Assure que la couleur du texte de l'élément <pre> hérite de la couleur du texte de #nfo */
            }

            .block--messages .message, .block--messages .block-row {
              color: inherit;
              background: #22282f;
              border: 1px solid #202020;
              border-radius: 4px;
            }

            .message-cell.message-cell--user {
              padding: 10px;
            }

            .message-cell.message-cell--user, .message-cell.message-cell--action {
              background: #2a313c;
              border-right: 1px solid #1f2224;
            }

            .message-cell.message-cell--main {
              padding-left: 0;
            }

            .message-cell {
              padding: 10px 0;
            }

            .message-cell.message-cell--alert {
              color: #e8ebed;
              background: #16435e;
              padding-left: 10px;
            }

            message-cell.message-cell--alert a {
              color: #6bb2df;
            }

            .message-attribution {
              border-bottom: 1px solid #1f2224;
              padding: 0 12px 8px;
            }

            .message-content {
              margin-bottom: 10px;
              padding: 0 12px;
            }

            .message-content a {
              text-decoration: none;
            }

            .message-footer {
              border-top: 1px solid #1f2224;
              padding: 0 12px;
            }

            .message-signature {
              border-top: 1px solid #1f2224;
              padding-top: 6px;
              color: #777;
            }

            .message-actionBar .actionBar-set {
              margin-top: 8px;
            }

            .editorSmilies {
              border: 1px solid #1c1c1c;
              background: #22282f;
            }

            .message-editorWrapper {
              padding: 0 10px;
            }

            .attachment {
              background: #1f2224;
              border: 1px solid #383b3d;
            }

            .fr-toolbar {
              color: #f5f5f5;
              background: #222;
              border-radius: 2px;
              -moz-border-radius: 2px;
              -webkit-border-radius: 2px;
              border: 1px solid #1c1c1c;
              border-top: 1px solid #1c1c1c;
            }

            .fr-toolbar .fr-command.fr-btn, .fr-popup .fr-command.fr-btn {
              background: transparent;
              color: #aaa;
            }

            .fr-command.fr-btn+.fr-dropdown-menu .fr-dropdown-wrapper {
              background: #2b2f31!important;
              border: 1px solid #444;
            }

            .fr-command.fr-btn+.fr-dropdown-menu .fr-dropdown-wrapper .fr-dropdown-content ul.fr-dropdown-list li {
              font-size: inherit;
            }

            .fr-separator {
              background: #1c1c1c;
            }

            .fr-box.fr-basic .fr-wrapper {
              background: #1f2224;
              border: 1px solid #1c1c1c;
              border-top: 0;
              top: 0;
              left: 0;
            }

            .fr-box.fr-basic .fr-element {
              color: #aaa;
            }

            .block--category .block-body {
              color: #aaa;
              background: #22282f;
              border-width:0;
              border-radius: 0;
              border-bottom-left-radius: 3px;
              border-bottom-right-radius: 3px;
              box-shadow: rgb(0 0 0 / 8%) 0px 1px 4px;
              border-color: #191b1c;
            }

            .block-container.block-container--none {
              background: none;
              color: #aaa;
            }

            .block-header {
              color: #fff;
              background: #16435e;
              border-bottom: 1px solid #1e1f1f;
              border-radius: 0;
              border-top-left-radius: 3px;
              border-top-right-radius: 3px;
              margin: 0!important
            }

            .block-header .block-desc {
              color: rgba(255,255,255,0.7)
            }

            .block-header .block-desc a {
              color: inherit;
              text-decoration: underline
            }

            .block-minorHeader {
              border-radius: 4px 4px 0 0!important;
              box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px inset;
              color: #fff;
              background: #1b3544;
            }

            .block-tabHeader {
              color: #969696;
              background: #2b2f31;
            }

            .block-tabHeader .tabs-tab:hover {
              color: #969696;
              background: #34393c
            }

            .block-tabHeader .tabs-tab.is-active {
              color: #fff;
              background: #16435e;
            }

            .block-tabHeader .hScroller-action {
              color: #969696
            }

            .block-tabHeader .hScroller-action:hover {
              color: #fff
            }

            .block-tabHeader .hScroller-action.hScroller-action--start {
              background: #2b2f31;
              background: linear-gradient(to right, #2b2f31 66%, rgba(43,47,49,0) 100%)
            }

            .block-tabHeader .hScroller-action.hScroller-action--end {
              background: #2b2f31;
              background: linear-gradient(to right, rgba(43,47,49,0) 0%, #2b2f31 33%)
            }

            .block-minorTabHeader {
              color: #969696;
              background: #2f3336;
            }

            .block-minorTabHeader .tabs-tab {
              color: #969696;
            }

            .block-minorTabHeader .tabs-tab:hover {
              background: #34393c
            }

            .block-minorTabHeader .tabs-tab.is-active {
              color: #6bb2df;
              background: #34393c;
            }

            .block-minorTabHeader .hScroller-action {
              color: #969696
            }

            .block-minorTabHeader .hScroller-action:hover {
              color: #6bb2df
            }

            .block-minorTabHeader .hScroller-action.hScroller-action--start {
              background: #2f3336;
              background: linear-gradient(to right, #2f3336 66%, rgba(47,51,54,0) 100%)
            }

            .block-minorTabHeader .hScroller-action.hScroller-action--end {
              background: #2f3336;
              background: linear-gradient(to right, rgba(47,51,54,0) 0%, #2f3336 33%)
            }

            .block-filterBar {
              color: #fff;
              background: #16435e;
              border-bottom: 1px solid #1f2224;
            }

            .block-filterBar .filterBar-filterToggle {
              background: #357ca9
            }

            .block-filterBar .filterBar-listToggle,.block-filterBar .filterBar-filterToggle,.block-filterBar .filterBar-menuTrigger {
              color: #fff;
            }

            .block-filterBar .filterBar-listToggle:hover,.block-filterBar .filterBar-filterToggle:hover,.block-filterBar .filterBar-menuTrigger:hover {
              color: #fff;
              text-decoration: underline;
              background: transparent
            }

            .block-textHeader a {
              color: inherit;
              text-decoration: none
            }

            .block-textHeader a:hover {
              text-decoration: underline
            }

            .block-textHeader .block-textHeader-highlight {
              color: #aaa
            }

            .block-textHeader .block-desc a {
              color: inherit;
              text-decoration: underline
            }

            .block-formSectionHeader {
              text-decoration: none;
              color: #fff;
            }

            .block-formSectionHeader a {
              color: inherit;
              text-decoration: none
            }

            .block-formSectionHeader a:hover {
              text-decoration: underline
            }

            .block-formSectionHeader .block-desc a {
              color: inherit;
              text-decoration: underline
            }

            .block-row {
              background: inherit;
            }

            .p-body-sidebar .block-row:not(:last-child) {
              border-bottom: 1px solid #1e1f1f;
            }

            .block-row.block-row--highlighted {
              color: #aaa;
              background: #34393c
            }

            .block-row.block-row--clickable:hover {
              color: #aaa;
              background: #34393c
            }

            .block-row.block-row--alt {
              color: inherit;
              background: inherit;
            }

            .block-row.block-row--separated+.block-row {
              border-top: 1px solid #1f2224;
            }

            .block-row.is-mod-selected {
              background: #34393c
            }

            .block-footer {
              color: #969696;
              background: #2f3336;
            }

            .block-rowMessage.block-rowMessage--highlight {
              color: #aaa;
              background: #34393c
            }

            .block-rowMessage.block-rowMessage--important {
              color: #49a1d8;
              background: #2b2f31;
            }

            .block-rowMessage.block-rowMessage--important a {
              color: #49a1d8
            }

            .block-rowMessage--important.block-rowMessage--iconic:before {
              color: #49a1d8
            }

            .block-rowMessage.block-rowMessage--alt {
              color: #aaa;
              background: #2f3336
            }

            .block-rowMessage.block-rowMessage--success {
              background: #daf3d8;
              color: #3d793f
            }

            .block-rowMessage.block-rowMessage--success a {
              color: inherit;
              text-decoration: underline
            }

            .block-rowMessage--success.block-rowMessage--iconic:before {
              color: #63b265
            }

            .block-rowMessage.block-rowMessage--warning {
              background: #fbf7e2;
              color: #84653d
            }

            .block-rowMessage.block-rowMessage--warning a {
              color: inherit;
              text-decoration: underline
            }

            .block-rowMessage--warning.block-rowMessage--iconic:before {
              color: #dcda54
            }

            .block-rowMessage.block-rowMessage--error {
              background: #fde9e9;
              color: #c84448
            }

            .block-rowMessage.block-rowMessage--error a {
              color: inherit;
              text-decoration: underline
            }

            .block-rowMessage--error.block-rowMessage--iconic:before {
              color: #c84448
            }

            .blockMessage {
              color: #aaa;
              background: #2b2f31;
            }

            .blockMessage.blockMessage--none {
              background: none;
              color: #aaa;
            }

            .blockMessage.blockMessage--highlight {
              color: #aaa;
              background: #34393c
            }

            .blockMessage.blockMessage--important {
              color: #49a1d8;
              background: #2b2f31;
            }

            .blockMessage.blockMessage--important a {
              color: #49a1d8
            }

            .blockMessage--important.blockMessage--iconic:before {
              color: #49a1d8
            }

            .blockMessage.blockMessage--alt {
              color: #aaa;
              background: #2f3336
            }

            .blockMessage.blockMessage--success {
              background: #daf3d8;
              color: #3d793f
            }

            .blockMessage.blockMessage--success a {
              color: inherit;
              text-decoration: underline
            }

            .blockMessage--success.blockMessage--iconic:before {
              color: #63b265
            }

            .blockMessage.blockMessage--warning {
              background: #fbf7e2;
              color: #84653d
            }

            .blockMessage.blockMessage--warning a {
              color: inherit;
              text-decoration: underline
            }

            .blockMessage--warning.blockMessage--iconic:before {
              color: #dcda54
            }

            .blockMessage.blockMessage--error {
              background: #fde9e9;
              color: #c84448
            }

            .blockMessage.blockMessage--error a {
              color: inherit;
              text-decoration: underline
            }

            .blockMessage--error.blockMessage--iconic:before {
              color: #c84448
            }

            .blockStatus {
              color: #aaa;
              background: #2f3336;
            }

            .blockStatus-message:before {
              color: #49a1d8
            }

            .blockLink {
              color: #aaa;
              text-decoration: none;
            }

            .blockLink.is-selected {
              color: #6bb2df;
              background: #34393c;
            }

            .blockLink:hover {
              background: #34393c;
              text-decoration: inherit
            }

            .blockLink-desc {
              color: #818181;
            }

            .blockLinkSplitToggle {
              text-decoration: none;
            }

            .blockLinkSplitToggle.is-selected {
              color: #6bb2df;
              background: #34393c
            }

            .blockLinkSplitToggle:hover {
              background: #34393c;
              text-decoration: inherit
            }

            .fixedMessageBar {
              color: #969696;
              background: #2b2f31
            }

            .fixedMessageBar-close {
              color: inherit
            }

            .fixedMessageBar-close:hover {
              text-decoration: none;
              color: #afafaf
            }

            .button,a.button {
              text-decoration: none;
              color: #ffffff;
              background: #16435e;
              border-color: #131516
            }

            .button a,a.button a {
              color: inherit;
              border-color: #1f2224;
              text-decoration: none
            }

            .button.button--primary, a.button.button--primary {
              color: #f5f5f5;
              background: #009688;
              border-color: #2b2f31
            }

            .button.button--cta,a.button.button--cta {
              color: #ffffff;
              background: #16435e;
              border-color: #131516
            }

            .button.button--cta:hover,a.button.button--cta:hover,.button.button--cta:active,a.button.button--cta:active,.button.button--cta:focus,a.button.button--cta:focus {
              text-decoration: none;
              color: #ffffff;
              background: #3ba8da
            }

            .button.button--link,a.button.button--link {
              background: #2b2f31;
              color: #fff;
              border-color: #aaa
            }

            .button.button--link:hover,a.button.button--link:hover,.button.button--link:active,a.button.button--link:active,.button.button--link:focus,a.button.button--link:focus {
              text-decoration: none;
              background: #34393c
            }

            .button.button--plain,a.button.button--plain {
              background: none;
              color: #fff
            }

            .button.button--plain:hover,a.button.button--plain:hover,.button.button--plain:active,a.button.button--plain:active,.button.button--plain:focus,a.button.button--plain:focus {
              text-decoration: none;
              background: none
            }

            .button.button--alt,a.button.button--alt {
              background-color: #8cc3e6;
              color: #fff;
            }

            .button.button--alt:hover,a.button.button--alt:hover,.button.button--alt:active,a.button.button--alt:active,.button.button--alt:focus,a.button.button--alt:focus {
              background-color: #8cc3e6;
              color: #fff
            }

            .button.is-disabled,a.button.is-disabled {
              color: #4e4e4e;
              background: #34393c;
            }

            .button.is-disabled:hover,a.button.is-disabled:hover,.button.is-disabled:active,a.button.is-disabled:active,.button.is-disabled:focus,a.button.is-disabled:focus {
              background: #34393c !important
            }

            .button.button--scroll,a.button.button--scroll {
              background: rgba(35,113,162,0.75);
            }

            .button.button--icon--bookmark.is-bookmarked .button-text:before,a.button.button--icon--bookmark.is-bookmarked .button-text:before {
              color: #49a1d8
            }

            .button.button--provider--facebook,a.button.button--provider--facebook {
              color: #fff;
              background-color: #3b5998;
            }

            .button.button--provider--facebook:hover,a.button.button--provider--facebook:hover,.button.button--provider--facebook:active,a.button.button--provider--facebook:active,.button.button--provider--facebook:focus,a.button.button--provider--facebook:focus {
              background-color: #466ab5
            }

            .button.button--provider--twitter,a.button.button--provider--twitter {
              color: #fff;
              background-color: #1da1f3;
            }

            .button.button--provider--twitter:hover,a.button.button--provider--twitter:hover,.button.button--provider--twitter:active,a.button.button--provider--twitter:active,.button.button--provider--twitter:focus,a.button.button--provider--twitter:focus {
              background-color: #44b1f5
            }

            .button.button--provider--google,a.button.button--provider--google {
              color: #444;
              background-color: #fff;
            }

            .button.button--provider--google:hover,a.button.button--provider--google:hover,.button.button--provider--google:active,a.button.button--provider--google:active,.button.button--provider--google:focus,a.button.button--provider--google:focus {
              background-color: #fff
            }

            .button.button--provider--github,a.button.button--provider--github {
              color: #fff;
              background-color: #666;
            }

            .button.button--provider--github:hover,a.button.button--provider--github:hover,.button.button--provider--github:active,a.button.button--provider--github:active,.button.button--provider--github:focus,a.button.button--provider--github:focus {
              background-color: #7a7a7a
            }

            .button.button--provider--linkedin,a.button.button--provider--linkedin {
              color: #fff;
              background-color: #0077b5;
            }

            .button.button--provider--linkedin:hover,a.button.button--provider--linkedin:hover,.button.button--provider--linkedin:active,a.button.button--provider--linkedin:active,.button.button--provider--linkedin:focus,a.button.button--provider--linkedin:focus {
              background-color: #0092de
            }

            .button.button--provider--microsoft,a.button.button--provider--microsoft {
              color: #fff;
              background-color: #00bcf2;
            }

            .button.button--provider--microsoft:hover,a.button.button--provider--microsoft:hover,.button.button--provider--microsoft:active,a.button.button--provider--microsoft:active,.button.button--provider--microsoft:focus,a.button.button--provider--microsoft:focus {
              background-color: #1cccff
            }

            .button.button--provider--yahoo,a.button.button--provider--yahoo {
              color: #fff;
              background-color: #410093;
            }

            .button.button--provider--yahoo:hover,a.button.button--provider--yahoo:hover,.button.button--provider--yahoo:active,a.button.button--provider--yahoo:active,.button.button--provider--yahoo:focus,a.button.button--provider--yahoo:focus {
              background-color: #5300bc
            }

            .button.button--splitTrigger button.button-text,a.button.button--splitTrigger button.button-text {
              background: transparent;
              color: inherit
            }

            .button.button--splitTrigger>.button-menu:after,a.button.button--splitTrigger>.button-menu:after {
              unicode-bidi: isolate;
            }

            .toggleButton>span {
              color: #4e4e4e;
              background: #34393c;
            }

            .toggleButton>input:checked+span {
              color: #ffffff;
              background: #16435e;
            }

            .toggleButton>input:checked+span:not(.button--splitTrigger):hover,.toggleButton>input:checked+span.button--splitTrigger>.button-text:hover,.toggleButton>input:checked+span.button--splitTrigger>.button-menu:hover,.toggleButton>input:checked+span:not(.button--splitTrigger):focus,.toggleButton>input:checked+span.button--splitTrigger>.button-text:focus,.toggleButton>input:checked+span.button--splitTrigger>.button-menu:focus,.toggleButton>input:checked+span:not(.button--splitTrigger):active,.toggleButton>input:checked+span.button--splitTrigger>.button-text:active,.toggleButton>input:checked+span.button--splitTrigger>.button-menu:active {
              background-color: #2a88c4
            }

            .memberHeader-main {
              background: #2a313c;
              border-bottom: none;
            }

            .memberHeader-separator {
              border-top: 1px solid #131516;
            }

            .block-tabHeader .tabs-tab.is-active {
              color: #fff;
              background: #242729;
              border-color: #131516;
            }

            .message-avatar-wrapper .avatar.avatar--m{
              width: auto;
              height: auto;
            }

            .avatar.avatar--separated {
              border: 1px solid #131516;
            }

            .p-nav .focus-wrap-search {
              padding-bottom: 0;
            }

            .focus-search {
              background-color: #242729;
              background-image: none;
              color: #aaa;
            }

            .input {
              color: #aaa;
              background: #242729;
              border-width: 1px;
              border-color: #1e1f1f;
              padding: 10px 8px;
            }
            .input::-webkit-input-placeholder {
              color: rgba(170,170,170,0.7)
            }

            .input::-moz-placeholder {
              color: rgba(170,170,170,0.7)
            }

            .input:-moz-placeholder {
              color: rgba(170,170,170,0.7)
            }

            .input:-ms-input-placeholder {
              color: rgba(170,170,170,0.7)
            }

            .input:focus,.input.is-focused {
              outline: 0;
              background: #1d1f21;
            }

            .input:focus::-webkit-input-placeholder,.input.is-focused::-webkit-input-placeholder {
              color: rgba(170,170,170,0.5)
            }

            .input:focus::-moz-placeholder,.input.is-focused::-moz-placeholder {
              color: rgba(170,170,170,0.5)
            }

            .input:focus:-moz-placeholder,.input.is-focused:-moz-placeholder {
              color: rgba(170,170,170,0.5)
            }

            .input:focus:-ms-input-placeholder,.input.is-focused:-ms-input-placeholder {
              color: rgba(170,170,170,0.5)
            }

            .input[readonly],.input.is-readonly {
              color: #7c7c7c;
              background: #2c3033
            }

            .input[disabled] {
              color: #4e4e4e;
              background: #34393c;
            }

            select.input[size],.input.input--select[size],select.input[multiple],.input.input--select[multiple] {
              background-image: none !important;
            }

            .iconic>input:focus+i:before,.iconic>input:focus+i:after {
              outline: Highlight solid 2px;
              -moz-outline-radius: 5px
            }

            .formRow .iconic>i,.inputGroup .iconic>i,.inputChoices .iconic>i,.block-footer .iconic>i,.dataList-cell .iconic>i,.message-cell--extra .iconic>i,.formRow.dataList-cell--fa>a>i,.inputGroup.dataList-cell--fa>a>i,.inputChoices.dataList-cell--fa>a>i,.block-footer.dataList-cell--fa>a>i,.dataList-cell.dataList-cell--fa>a>i,.message-cell--extra.dataList-cell--fa>a>i,.formRow .iconic svg,.inputGroup .iconic svg,.inputChoices .iconic svg,.block-footer .iconic svg,.dataList-cell .iconic svg,.message-cell--extra .iconic svg,.formRow.dataList-cell--fa>a svg,.inputGroup.dataList-cell--fa>a svg,.inputChoices.dataList-cell--fa>a svg,.block-footer.dataList-cell--fa>a svg,.dataList-cell.dataList-cell--fa>a svg,.message-cell--extra.dataList-cell--fa>a svg {
              color: #969696;
              fill: currentColor
            }

            .formRow .iconic:hover>i,.inputGroup .iconic:hover>i,.inputChoices .iconic:hover>i,.block-footer .iconic:hover>i,.dataList-cell .iconic:hover>i,.message-cell--extra .iconic:hover>i,.formRow.dataList-cell--fa>a:hover>i,.inputGroup.dataList-cell--fa>a:hover>i,.inputChoices.dataList-cell--fa>a:hover>i,.block-footer.dataList-cell--fa>a:hover>i,.dataList-cell.dataList-cell--fa>a:hover>i,.message-cell--extra.dataList-cell--fa>a:hover>i,.formRow .iconic:hover svg,.inputGroup .iconic:hover svg,.inputChoices .iconic:hover svg,.block-footer .iconic:hover svg,.dataList-cell .iconic:hover svg,.message-cell--extra .iconic:hover svg,.formRow.dataList-cell--fa>a:hover svg,.inputGroup.dataList-cell--fa>a:hover svg,.inputChoices.dataList-cell--fa>a:hover svg,.block-footer.dataList-cell--fa>a:hover svg,.dataList-cell.dataList-cell--fa>a:hover svg,.message-cell--extra.dataList-cell--fa>a:hover svg {
              color: #6bb2df;
              fill: currentColor
            }

            .inputGroup.inputGroup--joined .inputGroup-text {
              background: #242729;
            }

            .inputGroup.inputGroup--joined .inputGroup-text.inputGroup-text--disabled,.inputGroup.inputGroup--joined .inputGroup-text.is-disabled,.inputGroup.inputGroup--joined .inputGroup-text[disabled] {
              color: #4e4e4e;
              background: #34393c;
            }

            .inputNumber-button {
              color: #969696;
            }

            .inputGroup.inputGroup--joined .inputNumber-button:hover,.inputGroup.inputGroup--joined .inputNumber-button:active,.inputGroup.inputGroup--joined .inputNumber-button:focus {
              background-color: #96cef1;
              color: #6bb2df
            }

            .input.input--number[readonly]~.inputNumber-button {
              color: #7c7c7c;
              background: #2c3033
            }

            .input.input--number[disabled]~.inputNumber-button {
              color: #4e4e4e;
              background: #34393c;
            }

            .inputDate .inputDate-icon {
              color: #fff;
            }

            .inputUploadButton {
              color: #969696;
            }

            .inputGroup.inputGroup--joined .inputUploadButton:hover,.inputGroup.inputGroup--joined .inputUploadButton:active,.inputGroup.inputGroup--joined .inputUploadButton:focus {
              background-color: #96cef1;
              color: #6bb2df
            }

            .inputChoices .inputChoices-label {
              color: #818181
            }

            .inputChoices-heading {
              color: #818181;
            }

            .inputChoices-explain {
              color: #818181
            }

            .inputChoices-explain a {
              color: inherit;
              text-decoration: underline
            }

            .inputValidationError {
              background: #fde9e9;
              color: #c84448;
            }

            .inputValidationError a {
              color: inherit;
              text-decoration: underline
            }

            .formRow>dt {
              background: #2f3336;
            }

            .formRow.formRow--fullWidth>dt,.menu .formRow>dt {
              background: none;
            }

            .formRow .formRow-error {
              color: #84653d;
            }

            .formRow .formRow-explain {
              color: #818181
            }

            .formRow .formRow-explain a {
              color: inherit;
              text-decoration: underline
            }
            .formRow .formRow-hint {
              color: #818181
            }

            .formRow .formRow-hint a {
              color: inherit;
              text-decoration: underline
            }

            .formRow .formRow-hint .formRow-hint-featured {
              color: #49a1d8
            }

            .formSubmitRow-bar {
              background: rgba(52,57,60,0.9);
            }

            .badge,.badgeContainer:after {
              color: #ffffff;
              background: #16435e;
            }

            .badge.badge--highlighted,.badgeContainer.badgeContainer--highlighted:after {
              color: #ffffff;
              background: #16435e;
            }

            .tooltip.tooltip--basic a {
              color: inherit;
              text-decoration: underline
            }

            .tooltip.tooltip--selectToQuote a {
              color: inherit;
              text-decoration: none
            }

            .tooltip.tooltip--selectToQuote a:hover {
              text-decoration: underline
            }

            .tooltip--basic .tooltip-content {
              color: #fff;
              background: #16435e;
            }

            .tooltip--member .tooltip-content{
              color: #aaa;
              background: #2b2f31;
              border: 1px solid #575a5c;
            }

            .tooltip--member.tooltip--top .tooltip-arrow {
              border-top-color: #575a5c;
            }

            .tooltip--member.tooltip--top .tooltip-arrow:after {
              border-top-color: #2b2f31;
            }

            .tooltip--member.tooltip--bottom .tooltip-arrow {
              border-bottom-color: #8c8c8c;
            }

            .tooltip--member.tooltip--bottom .tooltip-arrow:after {
              border-bottom-color: #1f2224;
            }

            .tooltip--preview .tooltip-content,
            .tooltip--bookmark .tooltip-content,
            .tooltip--share .tooltip-content,
            .tooltip--reaction .tooltip-content {
              color: #aaa;
              background: #2b2f31;
            }

            .tooltip--preview .tooltip-content-inner .tooltip-content-cover {
              background: transparent;
              background: linear-gradient(to bottom, rgba(43,47,49,0) 160px, #2b2f31 200px)
            }

            .memberTooltip-header {
              background: #1f2224!important;
              border-bottom: 1px solid #131516!important;
            }

            .memberTooltip-separator {
              border-top: none!important;
            }

            .memberTooltip-name {
              font-size: 20px!important;
              color: #cbcbcb!important;
            }
            .memberTooltip-name a:hover {
              text-decoration: none;
              color: #fff;
            }

            .userBanner.userBanner--blue {
              background: #204fb9;
              border-color: #3564cf;
            }

            .menu-arrow {
              border: none;
            }

            .menu-linkRow {
              background: inherit;
            }

            .menu-content {
              color: #aaa;
              background: #2b2f31;
              border-top: 0;
              /* border: 1px solid #818181; */
            }

            .menu-separator {
              border-top: 1px solid #131516;
              margin-top: 1px!important;
            }

            .menu-header {
              text-decoration: none;
              color: #fff;
              background: #16435e;
              border-bottom: none
            }

            .menu-header a {
              color: inherit;
              text-decoration: none
            }

            .menu-header a:hover {
              text-decoration: underline
            }

            .menu-header .menu-desc {
              color: rgba(255,255,255,0.7)
            }

            .menu-header .menu-desc a {
              color: inherit;
              text-decoration: underline
            }
            .menu-tabHeader {
              text-decoration: none;
              color: #fff;
              background: #16435e;
            }

            .menu-tabHeader .tabs-tab:hover {
              color: #6bb2df
            }

            .menu-tabHeader .tabs-tab.is-active {
              color: inherit;
            }

            .menu-tabHeader .hScroller-action {
              color: #fff
            }

            .menu-tabHeader .hScroller-action:hover {
              color: #6bb2df
            }

            .menu-tabHeader .hScroller-action.hScroller-action--start {
              background: #16435e;
              background: linear-gradient(to right, #16435e 66%, rgba(35,113,162,0) 100%)
            }

            .menu-tabHeader .hScroller-action.hScroller-action--end {
              background: #16435e;
              background: linear-gradient(to right, rgba(35,113,162,0) 0%, #16435e 33%)
            }

            .menu-row.menu-row--alt {
              color: #aaa;
              background: #23272a
            }

            .menu-row.menu-row--highlighted {
              color: #aaa;
              background: #34393c
            }

            .menu-row.menu-row--clickable:hover {
              background: #34393c
            }

            .menu-row.menu-row--separated+.menu-row {
              border-top: 1px solid #131516;
            }

            .menu-linkRow {
              color: #aaa;
              text-decoration: none
            }

            .menu-linkRow.menu-linkRow--alt {
              color: #aaa;
              background: #2f3336
            }

            .menu-linkRow.is-selected,.menu-linkRow:hover,.menu-linkRow:focus {
              color: #6bb2df;
              text-decoration: none;
              background: #34393c;
            }

            .menu-linkRow.is-selected:focus,.menu-linkRow:hover:focus,.menu-linkRow:focus:focus {
              outline: 0
            }

            .menu-linkRow:hover i[aria-hidden=true]:after {
              color: #6bb2df
            }

            .menu-linkRow-hint {
              color: #818181;
            }

            .menu-footer {
              color: #969696;
              background: #2f3336;
              border-top: 1px solid #131516;
            }

            .menu .block .block-container {
              color: inherit;
              background: none;
              border-color: #202020;
            }

            .menu {
              box-shadow: 0 5px 30px 0 rgb(0 0 0 / 25%), rgb(0 0 0 / 15%) 0px 3px 5px!important;
              border: 1px solid #131516;
            }

            .offCanvasMenu .offCanvasMenu-closer {
              text-decoration: none;
            }

            .offCanvasMenu .offCanvasMenu-closer:hover {
              text-decoration: none
            }

            .offCanvasMenu-backdrop {
              background: rgba(0,0,0,0.25);
            }

            .offCanvasMenu-header a {
              color: inherit;
              text-decoration: none
            }

            .offCanvasMenu-header a:hover {
              text-decoration: underline
            }

            .offCanvasMenu-link {
              text-decoration: inherit
            }

            .offCanvasMenu-link:hover {
              text-decoration: inherit
            }

            .offCanvasMenu-link.offCanvasMenu-link--splitToggle {
              text-decoration: inherit
            }

            .offCanvasMenu-linkHolder.is-selected a {
              color: inherit
            }

            .offCanvasMenu-linkHolder .offCanvasMenu-link:hover {
              background: none
            }

            .offCanvasMenu--blocks .offCanvasMenu-content {
              background: #131516;
              background-attachment: fixed;
              background-size: cover;
              color: #aaa
            }

            .offCanvasMenu--blocks .offCanvasMenu-header {
              color: #49a1d8;
              background: #34393c;
            }

            .offCanvasMenu--nav .offCanvasMenu-content {
              color: #aaa;
              background: #2b2f31;
            }

            .offCanvasMenu--nav .offCanvasMenu-content a {
              color: inherit
            }

            .offCanvasMenu--nav .offCanvasMenu-header {
              background: rgba(19,21,22,0.15);
            }

            .offCanvasMenu--nav .offCanvasMenu-linkHolder {
              text-decoration: none
            }

            .offCanvasMenu--nav .offCanvasMenu-linkHolder:hover {
              background: rgba(19,21,22,0.09)
            }

            .offCanvasMenu--nav .offCanvasMenu-linkHolder.is-selected {
              color: #fff;
              background: #34393c
            }

            .offCanvasMenu--nav .offCanvasMenu-subList {
              background: rgba(19,21,22,0.15)
            }

            .offCanvasMenu--nav .offCanvasMenu-subList .offCanvasMenu-link:hover {
              text-decoration: none;
              background: rgba(19,21,22,0.15)
            }

            .offCanvasMenu--nav .offCanvasMenu-installBanner {
              background: rgba(19,21,22,0.15);
            }

            .tabs-tab {
              color: inherit;
              text-decoration: none;
            }

            .tabs-tab:hover {
              text-decoration: none
            }

            .tabs-extra a {
              color: inherit;
              text-decoration: none;
            }

            .tabs--standalone {
              color: #aaa;
              background: #2b2f31;
              border: 1px solid #131516;
            }

            .tabs--standalone .tabs-tab:hover {
              color: #ffffff
            }

            .tabs--standalone .tabs-tab.is-active {
              color: #ffffff;
              background: #16435e;
              border-color: transparent;
            }

            .tabs--standalone .hScroller-action {
              color: #aaa
            }

            .tabs--standalone .hScroller-action:hover {
              color: #fff
            }

            .tabs--standalone .hScroller-action.hScroller-action--start {
              background: #2b2f31;
              background: linear-gradient(to right, #2b2f31 66%, rgba(43,47,49,0) 100%)
            }

            .tabs--standalone .hScroller-action.hScroller-action--end {
              background: #2b2f31;
              background: linear-gradient(to right, rgba(43,47,49,0) 0%, #2b2f31 33%)
            }

            .overlay-container {
              background: rgba(19,21,22,0.4);
            }

            .overlay {
              background: #131516;
              background-attachment: fixed;
              background-size: cover;
              color: #aaa;
              border: 1px solid #575a5c;
              outline: none
            }

            .overlay-title {
              color: #fff;
              background: #16435e;
              border-bottom: 1px solid #575a5c;
            }
            .overlay-content .block-row.block-row--separated+.block-row {
              border-top: 1px solid #575a5c;
            }

            .globalAction-bar {
              background: #49a1d8;
            }

            .globalAction-block i {
              background-color: #49a1d8;
            }

            .avatar img {
              background-color: #2b2f31
            }

            .avatar.avatar--default.avatar--default--dynamic,
            .avatar.avatar--default.avatar--default--text {
              text-decoration: none !important;
            }

            .avatar.avatar--default.avatar--default--text {
              width: 96px;
              max-width: 100%;
              height: auto;
              color: #818181 !important;
              background: #404345 !important
            }

            .avatar.avatar--default.avatar--default--text.avatar--s {
              width: 48px;
              height: 48px;
            }

            .avatar.avatar--default.avatar--default--text.avatar--xxs,
            .menu-row .avatar.avatar--default.avatar--default--text,
            .p-body-sidebar .avatar.avatar--default.avatar--default--text {
              width: 24px;
              height: 24px;
            }

            .avatar.avatar--default.avatar--default--image {
              background-color: #2b2f31;
              background-image: url();
              background-size: cover
            }

            .avatar:hover {
              text-decoration: none
            }

            .avatar-update {
              background: #000;
              background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
            }

            .avatar-update a {
              color: inherit;
              text-decoration: none
            }

            .avatar-update a:hover {
              text-decoration: underline
            }

            .avatar-update a {
              text-shadow: 0 0 2px rgba(0,0,0,0.6);
              color: #fff
            }

            .avatar-update a:hover {
              text-decoration: none
            }

            .avatarWrapper-update {
              color: #fff;
              text-decoration: none;
            }

            .avatarWrapper-update:before {
              background: #000;
              background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.9) 100%);
            }

            .avatarWrapper-update:hover {
              color: #fff;
              text-decoration: none
            }

            .dataList-row:hover:not(.dataList-row--noHover):not(.dataList-row--header):not(.is-spHovered),.is-spActive .dataList-row.is-spChecked {
              background: rgba(52,57,60,0.5)
            }

            .is-spActive .dataList-row.is-spHovered {
              background: rgba(52,57,60,0.75)
            }

            .is-spActive .dataList-row:not(.dataList-row--noHover):not(.dataList-row--header):not(.is-spChecked) * {
              color: #818181
            }

            .dataList-row.dataList-row--header .dataList-cell a {
              color: inherit;
              text-decoration: underline
            }

            .dataList-row.dataList-row--subSection .dataList-cell {
              color: #fff;
              background: #16435e;
            }

            .dataList-row.dataList-row--subSection .dataList-cell a {
              color: inherit
            }

            .dataList-row.dataList-row--subSection:hover:not(.dataList-row--noHover) .dataList-cell {
              background: #16435e
            }

            .dataList-row.dataList-row--custom .dataList-cell--link a {
              color: red
            }

            .dataList-row.dataList-row--parentCustom .dataList-cell--link a {
              color: orange
            }

            .dataList-row.dataList-row--disabled .dataList-cell--link a {
              color: #818181;
            }

            .dataList-cell.dataList-cell--alt,.dataList-cell.dataList-cell--action {
              background: #2f3336
            }

            .dataList-cell.dataList-cell--highlighted {
              background: #34393c
            }

            .dataList-cell.dataList-cell--action,.dataList-cell.dataList-cell--link {
              text-decoration: none
            }

            .dataList-cell.dataList-cell--action.dataList-cell--alt:hover,.dataList-cell.dataList-cell--link.dataList-cell--alt:hover,.dataList-cell.dataList-cell--action.dataList-cell--action:hover,.dataList-cell.dataList-cell--link.dataList-cell--action:hover {
              background: #34393c
            }

            .dataList-cell.dataList-cell--action a,.dataList-cell.dataList-cell--link a,.dataList-cell.dataList-cell--action label,.dataList-cell.dataList-cell--link label,.dataList-cell.dataList-cell--action .dataList-blockLink,.dataList-cell.dataList-cell--link .dataList-blockLink {
              text-decoration: none;
            }

            .dataList-cell.dataList-cell--attachment {
              background: center / cover #2f3336 no-repeat;
            }

            .dataList-cell.dataList-cell--hint,.dataList-row--subSection .dataList-cell.dataList-cell--hint {
              color: #818181
            }
            .dataList-cell .is-match {
              text-decoration: underline;
              color: red
            }

            .dataList-hint,.dataList-subRow {
              color: #818181;
            }

            .dataList-row--footer .dataList-cell {
              color: #969696;
              background: #2f3336;
            }

            .dataList--responsive .dataList-cell[data-cell-label]:before {
              word-break: normal;
            }

            .filterBlock {
              color: #aaa;
              background: #2b2f31;
            }

            .quickFilter .js-filterClear {
              color: #969696
            }

            .filterBar-filterToggle {
              text-decoration: none;
              color: inherit;
            }

            .filterBar-filterToggle:hover {
              text-decoration: none
            }

            .filterBar-menuTrigger {
              text-decoration: none;
            }

            .contentRow.is-deleted .contentRow-header,.contentRow.is-deleted .contentRow-title {
              text-decoration: line-through
            }

            .contentRow-figureIcon {
              color: #49a1d8
            }

            .contentRow-muted {
              color: #818181
            }

            .contentRow-fader {
              background: transparent;
              background: linear-gradient(to bottom, rgba(43,47,49,0) 0%, #2b2f31 80%)
            }

            .contentRow-minor {
              color: #818181
            }

            .contentRow-minor.contentRow-minor--hideLinks a {
              color: inherit;
              text-decoration: none
            }

            .contentRow-minor.contentRow-minor--hideLinks a:hover {
              text-decoration: underline
            }

            .contentRow-extra.contentRow-extra--small {
              color: #818181
            }

            .contentRow-extra.contentRow-extra--normal {
              color: #818181
            }

            .contentRow-extra.contentRow-extra--large {
              color: #818181
            }

            .contentRow-extra.contentRow-extra--larger {
              color: #818181
            }

            .contentRow-extra.contentRow-extra--largest {
              color: #818181
            }

            .pageNav-jump {
              background: linear-gradient(0deg, #34393c, #2d3134);
              color: #aaa;
              background: #2f3336;
            }

            .pageNav-jump, .pageNav-page {
              border: 1px solid #131516;
              border-color: #131516;
            }

            .pageNav-jump:hover,.pageNav-jump:active {
              text-decoration: none;
              color: #ffffff;
              background: #16435e;
            }

            .pageNav-page {
              background: linear-gradient(0deg, #34393c, #2d3134);
              color: #aaa;
              background: #2f3336;
            }

            .pageNav-page:not(:first-child) {
              border-left-color: #131516;
            }

            .pageNav-page:hover,.pageNav-page:active {
              text-decoration: none;
              color: #ffffff;
              background: #16435e;
            }

            .pageNav-page>a {
              text-decoration: none;
              color: inherit
            }

            .pageNav-page.pageNav-page--current {
              color: #ffffff;
              background: #16435e;
              border-color: #131516;
            }

            .pageNavSimple-el.pageNavSimple-el--current {
              color: #49a1d8;
              background: #2b2f31;
            }

            .pageNavSimple-el.pageNavSimple-el--current:hover,.pageNavSimple-el.pageNavSimple-el--current:active {
              background: #323739;
              text-decoration: none
            }

            .pageNavSimple-el.pageNavSimple-el--prev,.pageNavSimple-el.pageNavSimple-el--next {
              background: linear-gradient(0deg, #34393c, #2d3134);
              color: #fff;
            }

            .pageNavSimple-el.pageNavSimple-el--prev:hover,.pageNavSimple-el.pageNavSimple-el--next:hover,.pageNavSimple-el.pageNavSimple-el--prev:active,.pageNavSimple-el.pageNavSimple-el--next:active {
              background: #3b4144;
              text-decoration: none
            }

            .pageNavSimple-el.pageNavSimple-el--first,.pageNavSimple-el.pageNavSimple-el--last {
              color: rgba(255,255,255,0.6)
            }

            .pageNavSimple-el.pageNavSimple-el--first:hover,.pageNavSimple-el.pageNavSimple-el--last:hover,.pageNavSimple-el.pageNavSimple-el--first:active,.pageNavSimple-el.pageNavSimple-el--last:active {
              background: #3b4144;
              color: #fff;
              text-decoration: none
            }

            .pageNavSimple-el.is-disabled {
              background: none;
              color: #818181;
              text-decoration: none;
            }

            .pageNavSimple-el.is-disabled:hover {
              background: none;
              color: #818181
            }

            .flashMessage {
              color: #202020;
              background: rgba(226,226,226,0.9);
            }

            .autoCompleteList {
              color: #aaa;
              background: #2b2f31;
            }

            .autoCompleteList li.is-selected {
              background: #34393c
            }

            .tagItem {
              color: #969696;
              background: #2f3336;
              border: 1px solid #131415;
            }

            a.tagItem:hover {
              text-decoration: none;
              color: #969696;
              background: #2b2f31
            }

            .likesBar {
              background: #2f3336;
              border: 1px solid #383b3d;
              border-left: 2px solid #49a1d8;
              padding: 10px;
            }

            .likeIcon:before {
              color: #49a1d8
            }

            .attachUploadList {
              color: #888;
              background: rgba(0,0,0,.14);
              border: 1px solid #383b3d;
            }

            .bbCodeBlock-expandLink {
              background: linear-gradient(to bottom, rgba(42,42,42,0) 0%, #1f2224 90%);
            }

            .bbCodeBlock-title {
              padding: 8px 10px;
              font-size: 12px;
              color: #6e7c91;
              background: #2a313c!important;
              border-bottom: 1px solid #383b3d;
            }

            .bbCodeBlock {
              background: #2f3336!important;
              border: 1px solid #383b3d!important;
              border-left: 2px solid #49a1d8!important;
            }
            .reactionsBar {
              background: #2f3336;
            }

            .reactionSummary>li {
              background: #2b2f31;
            }

            .reactionsBar .reactionSummary>li,.message-responseRow .reactionSummary>li {
              background: #2f3336
            }

            .colorChip-inner {
              background-color: transparent;
            }

            .bookmarkLink.bookmarkLink--highlightable.is-bookmarked {
              color: #49a1d8
            }

            .bookmarkLink.bookmarkLink--highlightable.is-bookmarked:hover {
              color: #49a1d8
            }

            .solutionIcon {
              color: #818181;
            }

            a.solutionIcon {
              color: #818181;
              text-decoration: none
            }

            .solutionIcon.is-solution {
              color: #63b265;
            }

            .actionBar-action.actionBar-action--inlineMod label {
              color: #fff;
            }

            .actionBar-action.actionBar-action--mq.is-selected {
              background-color: #34393c;
            }

            .actionBar-action.actionBar-action--postLink {
              text-decoration: inherit !important;
              color: inherit !important
            }

            .actionBar-action.actionBar-action--reaction:not(.has-reaction) .reaction-text {
              color: inherit
            }

            .actionBar-action.actionBar-action--view {
              background: #2b2f31;
              color: #fff;
            }

            .actionBar-action.actionBar-action--view:hover,.actionBar-action.actionBar-action--view:active,.actionBar-action.actionBar-action--view:focus {
              text-decoration: none;
              background: #34393c
            }

            .actionBar-set.actionBar-set--internal a.actionBar-action {
              color: #ddd;
            }

            .actionBar-set.actionBar-set--external .actionBar-action {
              border-color: #575a5c;
            }

            .label.label--subtle {
              color: #818181;
              background: #2f3336;
            }

            a.label.label--subtle:hover,a:hover .label.label--subtle {
              background: #383e41;
            }

            .label.label--primary {
              color: #fff;
              background: #34393c;
            }

            a.label.label--primary:hover,a:hover .label.label--primary {
              background: #3e4347;
            }

            .label.label--accent {
              color: #49a1d8;
              background: #2b2f31;
            }

            a.label.label--accent:hover,a:hover .label.label--accent {
              background: #34393c;
            }

            .label.label--red {
              color: #fff;
              background: #e20000;
            }

            a.label.label--red:hover,a:hover .label.label--red {
              background: #f60000;
            }

            .label.label--green {
              color: #fff;
              background: #008000;
            }

            a.label.label--green:hover,a:hover .label.label--green {
              background: #009400;
            }

            .label.label--olive {
              color: #fff;
              background: #808000;
            }

            a.label.label--olive:hover,a:hover .label.label--olive {
              background: #949400;
            }

            .label.label--lightGreen {
              color: #000;
              background: #ccf9c8;
            }

            a.label.label--lightGreen:hover,a:hover .label.label--lightGreen {
              background: #ddfbda;
            }

            .label.label--blue {
              color: #fff;
              background: #0008e3;
            }

            a.label.label--blue:hover,a:hover .label.label--blue {
              background: #0009f7;
            }

            .label.label--royalBlue {
              color: #fff;
              background: #4169e1;
            }

            a.label.label--royalBlue:hover,a:hover .label.label--royalBlue {
              background: #5377e4;
            }

            .label.label--skyBlue {
              color: #fff;
              background: #7cc3e0;
            }

            a.label.label--skyBlue:hover,a:hover .label.label--skyBlue {
              background: #8ccbe4;
            }

            .label.label--gray {
              color: #fff;
              background: #808080;
            }

            a.label.label--gray:hover,a:hover .label.label--gray {
              background: #8a8a8a;
            }

            .label.label--silver {
              color: #000;
              background: #c0c0c0;
            }

            a.label.label--silver:hover,a:hover .label.label--silver {
              background: #cacaca;
            }

            .label.label--yellow {
              color: #000;
              background: #ffff91;
            }

            a.label.label--yellow:hover,a:hover .label.label--yellow {
              background: #ffffa5;
            }

            .label.label--orange {
              color: #000;
              background: #ffcb00;
            }

            a.label.label--orange:hover,a:hover .label.label--orange {
              background: #ffcf14;
            }

            .label.label--error {
              color: #c84448;
              background: #fde9e9;
            }

            a.label.label--error:hover,a:hover .label.label--error {
              background: #fffcfc;
            }

            .reactionScore {
              color: #969696;
              background: #2f3336;
            }

            .reactionScore:hover {
              background: #2b2f31
            }

            .reaction-text::after {
              color: transparent;
            }

            .reaction--1 .reaction-text {
              color: #fff
            }

            .reaction--2 .reaction-text {
              color: #E81C27
            }

            .reaction--3 .reaction-text {
              color: #FDCA47
            }

            .reaction--4 .reaction-text {
              color: #FDCA47
            }

            .reaction--5 .reaction-text {
              color: #FDCA47
            }

            .reaction--6 .reaction-text {
              color: #FF4D4D
            }

            .bbMediaWrapper-fallback {
              background: #2f3336;
            }

            .bbOembed .embedly-card {
              background: white
            }

            .bbTable>table>thead>tr>th,.bbTable>table>tbody>tr>th {
              background: #8cc3e6;
            }

            .bbTable>table>thead>tr>td,.bbTable>table>tbody>tr>td {
              background: #2b2f31;
            }

            .bbWrapper .contentBox {
              color: #aaa;
              background: #2b2f31
            }

            .bbWrapper .accentBox {
              color: #49a1d8;
              background: #2b2f31;
            }

            .bbWrapper .accentBox a {
              color: #49a1d8
            }

            .bbWrapper .highlightBox {
              color: #aaa;
              background: #34393c
            }

            .bbWrapper .imgBar {
              color: #fff;
              background-repeat: no-repeat;
              background-size: cover
            }

            .blockLink.is-selected {
              color: #6bb2df;
              background: #34393c;
            }

            .blockLink:hover {
              background: #34393c
            }

            .dataList-row {
              background: #2b2f31
            }

            .dataListAltRows .dataList-row:nth-of-type(even) {
              background: #2f3336
            }

            .dataList-row:hover:not(.dataList-row--noHover):not(.dataList-row--header):not(.is-spHovered),.is-spActive .dataList-row.is-spChecked {
              background: #2f3336
            }

            .is-spActive .dataList-row.is-spHovered {
              background: #2f3336
            }

            .dataList-cell.dataList-cell--alt,.dataList-cell.dataList-cell--action {
              background: #2f3336
            }

            .dataList-cell.dataList-cell--action.dataList-cell--alt:hover,.dataList-cell.dataList-cell--link.dataList-cell--alt:hover,.dataList-cell.dataList-cell--action.dataList-cell--action:hover,.dataList-cell.dataList-cell--link.dataList-cell--action:hover {
              background: #34393c
            }

            .contentRow-lesser {
              color: #818181
            }

            .contentRow-header a,.contentRow-title a {
              color: inherit
            }

            .contentRow-header a:hover,.contentRow-title a:hover {
              color: #6bb2df
            }

            .inputGroup.inputGroup--joined .inputGroup-text {
              color: #aaa;
              background: #2f3336;
            }

            .inputGroup.inputGroup--joined .inputGroup-text:hover,.inputGroup.inputGroup--joined .inputGroup-text:active,.inputGroup.inputGroup--joined .inputGroup-text:focus {
              background: #34393c
            }

            .inputGroup.inputGroup--joined .inputNumber-button:hover,.inputGroup.inputGroup--joined .inputNumber-button:active,.inputGroup.inputGroup--joined .inputNumber-button:focus {
              background: #34393c
            }

            .focus-content {
              background: #1f2224;
            }

            .p-breadcrumbs {
              color: inherit;
              background-color: #2b2f31;
              background-image: none;
              box-shadow: none;
            }

            .focus-width .p-body-inner {
              padding-left: 0;
              padding-right: 0;
            }

            .p-body-header {
              color: #aaa;
              background: #1f2224;
              border: 1px solid #d8d8d8;
              border-radius: 4px;
              box-shadow: rgb(0 0 0 / 8%) 0px 1px 4px;
              border-color: transparent;
              margin-bottom: 0;
            }

            .p-body-main input[type="checkbox"],.p-body-main input[type="radio"] {
              color: #969696
            }

            .p-body-main input[type="checkbox"]~span.iconic-label,.p-body-main input[type="radio"]~span.iconic-label {
              color: #969696
            }

            .p-body-main input[type="checkbox"]:checked~span.iconic-label,.p-body-main input[type="radio"]:checked~span.iconic-label {
              color: #aaa
            }

            .p-body-main input[type="checkbox"]:checked+i,.p-body-main input[type="radio"]:checked+i {
              color: #6bb2df
            }

            .label.label--primary {
              color: #8cc3e6;
              background: #16435e;
            }

            a.label.label--primary:hover,a:hover .label.label--primary {
              background: #419cd6;
            }

            .menu-tabHeader .tabs-tab:hover:not(.is-active) {
              color: inherit;
              background: #1a5478
            }

            .tabs--standalone .tabs-tab:hover:not(.is-active) {
              background: #34393c
            }

            .button:hover,a.button:hover,.button:active,a.button:active,.button:focus,a.button:focus {
              text-decoration: none;
              color: #ffffff;
              background: #2c8ecc
            }

            .button.button--primary:hover,a.button.button--primary:hover,.button.button--primary:active,a.button.button--primary:active,.button.button--primary:focus,a.button.button--primary:focus {
              text-decoration: none;
              color: #ffffff;
              background: #2c8ecc
            }

            .button.button--link,a.button.button--link {
              color: #aaa;
              background: #2f3336;
              border-color: #575a5c;
            }

            .button.button--link:hover,a.button.button--link:hover,.button.button--link:active,a.button.button--link:active,.button.button--link:focus,a.button.button--link:focus {
              text-decoration: none;
              background: #34393c
            }

            .avatar.avatar--productIconDefault {
              color: #818181 !important;
              background: #404345 !important;
            }

            .xfmgThumbnail.xfmgThumbnail--noThumb {
              color: #aaa;
              background: #2f3336
            }

            .xfmgThumbnail-icon {
              color: #818181;
            }

            .avatar.avatar--resourceIconDefault {
              color: #818181 !important;
              background: #404345 !important;
            }

            .structItem {
              border-top: 1px solid #131516;
            }

            .structItem-title {
              font-size: 13px;
            }

            .structItem-minor {
              font-size: 12px;
              color: #9a9a9a;
            }

            .structItem-parts>li:nth-child(even) {
              color: inherit;
            }

            .structItem ul.structItem-parts::after {
              content: "⚡";
              font-size: 12px;
              color: #235f83;
              opacity: 0.1;
            }

            .structItem.is-unread ul.structItem-parts::after {
              opacity: 1;
            }

            .structItem.is-unread .structItem-title {
              color: #bbb;
            }

            .fervexTime .badge {
              color: #ffffff;
              background: #383b3d;
              padding: 6px 8px;
            }

          `);
      }
    }
  }

  function addMention() {
    const chatInput = document.querySelector('input[name="shout"]');

    function addAtSymbol(messageElement) {
      const usernameElement = messageElement.querySelector('.username');
      if (usernameElement) {
        const username = usernameElement.textContent;
        const atSymbol = document.createElement('ping');
        atSymbol.className = 'at-symbol';
        atSymbol.textContent = '@';
        atSymbol.style.cursor = 'pointer';
        atSymbol.style.marginLeft = '2px';
        atSymbol.style.fontWeight = 'bold';
        atSymbol.addEventListener('click', () => {
          chatInput.value += `@${username} `;
          chatInput.focus();
        });
        usernameElement.after(atSymbol);
      }
    }
    const messages = document.querySelectorAll('.siropuShoutboxShouts li');
    messages.forEach(addAtSymbol);
    const shoutbox = document.querySelector('.siropuShoutboxShouts');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.matches('li')) {
            addAtSymbol(node);
          }
        });
      });
    });
    observer.observe(shoutbox, {
      childList: true
    });
  }

  function correctToolbar() {
    function adjustToolbarHeight() {
      let toolbar = document.querySelector('.wysibb-toolbar');
      if (toolbar) {
        toolbar.style.maxHeight = '100px';
      }
    }
    window.addEventListener('load', adjustToolbarHeight);
    let observer = new MutationObserver(adjustToolbarHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  correctToolbar()
  ferveX("#fervexConfMenu").on("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();
    var elmnt = ferveX("#fervexConf")[0];
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    pos3 = e.clientX;
    pos4 = e.clientY;
    ferveX(document).on("mouseup", closeDragElement);
    ferveX(document).on("mousemove", elementDrag);

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      var newRight = parseInt(ferveX(elmnt).css("right")) + pos1;
      ferveX(elmnt).css("top", (elmnt.offsetTop - pos2) + "px");
      ferveX(elmnt).css("right", newRight + "px");
    }

    function closeDragElement() {
      ferveX(document).off("mouseup", closeDragElement);
      ferveX(document).off("mousemove", elementDrag);
    }
  }
  ferveX('.panel-menu-list').first().append('<li><a href="#" id="open_menu_reyggtools" rel="fervextip" title="Raccourci : CTRL+E">Paramètres ReYGGTools</a></li>');
  var showMenu = 0;

  function showMenuReYGGTools() {
    if (showMenu) {
      ferveX('#fervexConf').slideUp(500);
      showMenu = 0;
    } else {
      ferveX('#fervexConf').slideDown(500);
      showMenu = 1;
    }
  }
  /* config */
  document.addEventListener("keyup", (event) => {
    // Handle Firefox's events during IME composition
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    // Ctrl+E
    if (event.ctrlKey && event.keyCode === 69) {
      showMenuReYGGTools();
    }
  });
  ferveX('#open_menu_reyggtools').click(function(e) {
    e.preventDefault();
    showMenuReYGGTools();
  });
  ferveX('#close_menu_reyggtools').click(function(e) {
    e.preventDefault();
    showMenuReYGGTools();
  });
  ferveX('#close_menu_reyggtools').on('mouseenter', function(e) {
    ferveX(this).addClass('bg-danger');
  }).on('mouseleave', function(e) {
    ferveX(this).removeClass('bg-danger');
  });
  ferveX(document).on('click', '.config-recherche-bas', function(e) {
    setValue('fervex_recherche', 'classique', 365);
    ferveX('.config-recherche-bas').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-recherche-popup').removeClass('btn-success').addClass('btn-primary');
  });
  ferveX(document).on('click', '.config-recherche-popup', function(e) {
    setValue('fervex_recherche', 'bulle', 365);
    ferveX('.config-recherche-popup').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-recherche-bas').removeClass('btn-success').addClass('btn-primary');
  });
  ferveX(document).on('click', '.config-recherche-date-desc', function(e) {
    setValue('fervex_recherche_date', 'desc', 365);
    ferveX('.config-recherche-date-desc').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-recherche-date-asc').removeClass('btn-success').addClass('btn-primary');
  });
  ferveX(document).on('click', '.config-recherche-date-asc', function(e) {
    setValue('fervex_recherche_date', 'asc', 365);
    ferveX('.config-recherche-date-asc').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-recherche-date-desc').removeClass('btn-success').addClass('btn-primary');
  });
  ferveX(document).on('click', '.config-darkmode-on', function(e) {
    setValue('re_darkmode', 'on', 365);
    ferveX('.config-darkmode-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-darkmode-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_darkmode').prop('checked', true);
  });
  ferveX(document).on('click', '.config-darkmode-off', function(e) {
    setValue('re_darkmode', 'off', 365);
    ferveX('.config-darkmode-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-darkmode-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_darkmode').prop('checked', false);
  });
  ferveX(document).on('click', '.config-scroll-on', function(e) {
    setValue('re_scroll', 'on', 365);
    ferveX('.config-scroll-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-scroll-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_scroll').prop('checked', true);
  });
  ferveX(document).on('click', '.config-scroll-off', function(e) {
    setValue('re_scroll', 'off', 365);
    ferveX('.config-scroll-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-scroll-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_scroll').prop('checked', false);
  });
  ferveX(document).on('click', '.config-sidebar-on', function(e) {
    setValue('fervex_sidebar', 'on', 365);
    ferveX('#cat').addClass('active');
    ferveX('.config-sidebar-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-sidebar-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_sidebar').prop('checked', true);
  });
  ferveX(document).on('click', '.config-sidebar-off', function(e) {
    setValue('fervex_sidebar', 'off', 365);
    ferveX('#cat').removeClass('active');
    ferveX('.config-sidebar-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-sidebar-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_sidebar').prop('checked', false);
  });
  ferveX(document).on('change', '#config_sidebar', function() {
    if (ferveX(this).is(':checked')) {
      setValue('fervex_sidebar', 'on', 365);
      ferveX('#cat').addClass('active');
      ferveX('.config-sidebar-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-sidebar-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('fervex_sidebar', 'off', 365);
      ferveX('#cat').removeClass('active');
      ferveX('.config-sidebar-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-sidebar-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('change', '#config_darkmode', function() {
    if (ferveX(this).is(':checked')) {
      setValue('re_darkmode', 'on', 365);
      ferveX('.config-darkmode-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-darmode-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('re_darkmode', 'off', 365);
      ferveX('.config-darkmode-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-darkmode-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('change', '#config_scroll', function() {
    if (ferveX(this).is(':checked')) {
      setValue('re_scroll', 'on', 365);
      ferveX('.config-scroll-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-scroll-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('re_scroll', 'off', 365);
      ferveX('.config-scroll-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-scroll-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('click', '.config-notifs-on', function(e) {
    setValue('fervex_notifs', 'on', 365);
    ferveX('#top_panel a[href="' + BASE_URL + '/user/notifications"]').parent().show();
    ferveX('.config-notifs-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-notifs-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_notifs').prop('checked', true);
  });
  ferveX(document).on('click', '.config-notifs-off', function(e) {
    setValue('fervex_notifs', 'off', 365);
    ferveX('#top_panel a[href="' + BASE_URL + '/user/notifications"]').parent().hide();
    ferveX('.config-notifs-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-notifs-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_notifs').prop('checked', false);
  });
  ferveX(document).on('change', '#config_notifs', function() {
    if (ferveX(this).is(':checked')) {
      setValue('fervex_notifs', 'on', 365);
      ferveX('#top_panel a[href="' + BASE_URL + '/user/notifications"]').parent().show();
      ferveX('.config-notifs-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-notifs-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('fervex_notifs', 'off', 365);
      ferveX('#top_panel a[href="' + BASE_URL + '/user/notifications"]').parent().hide();
      ferveX('.config-notifs-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-notifs-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('click', '.config-notifs-total-on', function(e) {
    setValue('fervex_notifs_total', 'on', 365);
    ferveX('.bulle+.bulle').show();
    ferveX('.config-notifs-total-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-notifs-total-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_notifs_total').prop('checked', true);
  });
  ferveX(document).on('click', '.config-notifs-total-off', function(e) {
    setValue('fervex_notifs_total', 'off', 365);
    ferveX('.bulle+.bulle').hide();
    ferveX('.config-notifs-total-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-notifs-total-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_notifs_total').prop('checked', false);
  });
  ferveX(document).on('change', '#config_notifs_total', function() {
    if (ferveX(this).is(':checked')) {
      setValue('fervex_notifs_total', 'on', 365);
      ferveX('.bulle+.bulle').show();
      ferveX('.config-notifs-total-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-notifs-total-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('fervex_notifs_total', 'off', 365);
      ferveX('.bulle+.bulle').hide();
      ferveX('.config-notifs-total-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-notifs-total-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('click', '.config-preview-on', function(e) {
    setValue('fervex_preview', 'on', 365);
    addPreview();
    ferveX('.config-preview-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-preview-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_preview').prop('checked', true);
  });
  ferveX(document).on('click', '.config-preview-off', function(e) {
    setValue('fervex_preview', 'off', 365);
    removePreview();
    ferveX("a[id^='torrent_name'], a[href^='" + BASE_URL + "/torrent/']").unbind('mouseenter mouseleave');
    ferveX('.config-preview-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-preview-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_preview').prop('checked', false);
  });
  ferveX(document).on('change', '#config_preview', function() {
    if (ferveX(this).is(':checked')) {
      setValue('fervex_preview', 'on', 365);
      setTimeout(function() {
        addPreview();
      }, 600);
      ferveX('.config-preview-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-preview-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('fervex_preview', 'off', 365);
      removePreview();
      ferveX('.config-preview-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-preview-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('click', '.config-preview2-on', function(e) {
    setValue('fervex_preview2', 'on', 365);
    getPreview();
    ferveX('.config-preview2-on').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-preview2-off').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_preview2').prop('checked', true);
  });
  ferveX(document).on('click', '.config-preview2-off', function(e) {
    setValue('fervex_preview2', 'off', 365);
    ferveX('.config-preview2-off').removeClass('btn-primary').addClass('btn-success');
    ferveX('.config-preview2-on').removeClass('btn-success').addClass('btn-primary');
    ferveX('#config_preview2').prop('checked', false);
  });
  ferveX(document).on('change', '#config_preview2', function() {
    if (ferveX(this).is(':checked')) {
      setValue('fervex_preview2', 'on', 365);
      getPreview();
      ferveX('.config-preview2-on').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-preview2-off').removeClass('btn-success').addClass('btn-primary');
    } else {
      setValue('fervex_preview2', 'off', 365);
      ferveX('.config-preview2-off').removeClass('btn-primary').addClass('btn-success');
      ferveX('.config-preview2-on').removeClass('btn-success').addClass('btn-primary');
    }
  });
  ferveX(document).on('input', '.tempo_preview', function() {
    removePreview();
    var newDelai = ferveX('.tempo_preview').val();
    ferveX('.tempo_preview').val(ferveX('.tempo_preview').val());
    ferveX('.tempo_preview_value').html(newDelai);
    setValue('fervex_preview_delai', newDelai, 365);
    addPreview();
  });
  ferveX(document).on('input', '.height_preview', function() {
    removePreview();
    var newHeight = ferveX('.height_preview').val();
    ferveX('.height_preview').val(ferveX('.height_preview').val());
    ferveX('.height_preview_value').html(newHeight);
    setValue('fervex_preview_height', newHeight, 365);
    addPreview();
  });
  var reDarkmode = getValue('re_darkmode');
  if (reDarkmode == "on") {
    TheDarkSide();
    ferveX('.config-darkmode-on').toggleClass('btn-primary btn-success');
    ferveX('#config_darkmode').prop('checked', true);
  } else {
    ferveX('.config-darkmode-off').toggleClass('btn-primary btn-success');
    ferveX('#config_darkmode').prop('checked', false);
  }
  var reScroll = getValue('re_scroll');
  if (reScroll == "on") {
    ferveX('.config-scroll-on').toggleClass('btn-primary btn-success');
    ferveX('#config_scroll').prop('checked', true);
  } else {
    ferveX('.config-scroll-off').toggleClass('btn-primary btn-success');
    ferveX('#config_scroll').prop('checked', false);
  }
  var fervexSearch = getValue('fervex_recherche');
  if (fervexSearch == "bulle") {
    ferveX('.fervexTools').toggleClass('fervexTools1 fervexTools2');
    ferveX('.config-recherche-popup').toggleClass('btn-primary btn-success');
  } else {
    ferveX('.config-recherche-bas').toggleClass('btn-primary btn-success');
  }
  var fervexSearchDate = getValue('fervex_recherche_date');
  if (fervexSearchDate == null || fervexSearchDate == "desc") {
    ferveX('<input>').attr({
      name: 'order',
      type: 'hidden',
      value: 'desc'
    }).appendTo("form[action='" + BASE_URL + "/engine/search']");
    ferveX('<input>').attr({
      name: 'sort',
      type: 'hidden',
      value: 'publish_date'
    }).appendTo("form[action='" + BASE_URL + "/engine/search']");
    ferveX('.config-recherche-date-desc').toggleClass('btn-primary btn-success');
  } else if (fervexSearchDate == "asc") {
    ferveX('<input>').attr({
      name: 'order',
      type: 'hidden',
      value: 'asc'
    }).appendTo("form[action='" + BASE_URL + "/engine/search']");
    ferveX('<input>').attr({
      name: 'sort',
      type: 'hidden',
      value: 'publish_date'
    }).appendTo("form[action='" + BASE_URL + "/engine/search']");
    ferveX('.config-recherche-date-asc').toggleClass('btn-primary btn-success');
  }
  /* sidebar */
  var fervexSidebar = getValue('fervex_sidebar');
  if (fervexSidebar == "on") {
    ferveX('.config-sidebar-on').toggleClass('btn-primary btn-success');
    ferveX('#config_sidebar').prop('checked', true);
  } else {
    ferveX('.config-sidebar-off').toggleClass('btn-primary btn-success');
    ferveX('#config_sidebar').prop('checked', false);
  }
  /* notifs reçues */
  var fervexNotifsNb = ferveX('.bulle:first-child').text();
  if (fervexNotifsNb == 0) {
    ferveX('.bulle:first-child').hide();
    var fervexNotifs = getValue('fervex_notifs');
    if (fervexNotifs == "off") {
      ferveX('#top_panel a[href="' + BASE_URL + '/user/notifications"]').parent().hide();
      ferveX('.config-notifs-off').toggleClass('btn-primary btn-success');
      ferveX('#config_notifs').prop('checked', false);
    } else {
      ferveX('.config-notifs-on').toggleClass('btn-primary btn-success');
      ferveX('#config_notifs').prop('checked', true);
    }
  }
  /* notifs total */
  var fervexNotifsTotal = getValue('fervex_notifs_total');
  if (fervexNotifsTotal == "off") {
    ferveX('.bulle+.bulle').hide();
    ferveX('.config-notifs-total-off').toggleClass('btn-primary btn-success');
    ferveX('#config_notifs_total').prop('checked', false);
  } else {
    ferveX('.config-notifs-total-on').toggleClass('btn-primary btn-success');
    ferveX('#config_notifs_total').prop('checked', true);
  }
  /* preview des images torrents au survol */
  var fervexPreview = getValue('fervex_preview');
  if (fervexPreview == null || fervexPreview == "on") {
    setTimeout(function() {
      addPreview();
    }, 600);
    ferveX('.config-preview-on').toggleClass('btn-primary btn-success');
    ferveX('#config_preview').prop('checked', true);
  } else {
    ferveX('.config-preview-off').toggleClass('btn-primary btn-success');
    ferveX('#config_preview').prop('checked', false);
  }
  /* preview des images torrents dans la table (experimental) */
  var fervexPreview2 = getValue('fervex_preview2');
  if (fervexPreview2 == "on") {
    setTimeout(function() {
      getPreview();
    }, 600);
    ferveX('.config-preview2-on').toggleClass('btn-primary btn-success');
    ferveX('#config_preview2').prop('checked', true);
  } else {
    ferveX('.config-preview2-off').toggleClass('btn-primary btn-success');
    ferveX('#config_preview2').prop('checked', false);
  }
  ferveX('#config_preview2').on('change', function() {
    if (ferveX(this).is(':checked')) {
      getPreview();
      ferveX('.config-preview-on').toggleClass('btn-primary btn-success');
      setValue('fervex_preview2', 'on', 365);
    } else {
      removePreview();
      ferveX('.config-preview-off').toggleClass('btn-primary btn-success');
      setValue('fervex_preview2', 'off', 365);
    }
  });
  /* fallback des previews pour les torrents ajoutés dynamiquement */
  ferveX('td[id^=display-more]').click(function(e) {
    var fervexPreview = getValue('fervex_preview');
    if (fervexPreview == null || fervexPreview == "on") {
      setTimeout(function() {
        removePreview();
        addPreview();
      }, 800);
    }
    var fervexPreview2 = getValue('fervex_preview2');
    if (fervexPreview2 == "on") {
      setTimeout(function() {
        getPreview();
      }, 800);
    }
  });

  function addPreview() {
    // Décalage horizontal et vertical
    var xOffset = 20;
    var yOffset = 15;
    // Hauteur fixe de l'image
    var imageHeight;
    var fervexImageHeight = getValue('fervex_preview_height');
    if (fervexImageHeight == null) {
      imageHeight = 300;
    } else {
      imageHeight = fervexImageHeight;
    }
    // compteur
    var compteur;
    var delai;
    ferveX("a[id^='torrent_name'], a[href^='" + BASE_URL + "/torrent/']").on("mouseenter", function(e) {
      ferveX("#preview").remove();
      var href = ferveX(this).attr('href');
      delai = (getValue('fervex_preview_delai') !== null) ? getValue('fervex_preview_delai') : 400;
      compteur = setTimeout(function() {
        ferveX.get(href, function(data, status) {
          var targetSection = ferveX(data).find('#send-comment').prev('.content');
          if (targetSection.length === 0) {
            targetSection = ferveX(data).find('.content').eq(1);
          }
          var imgSrc = targetSection.find('img:first').attr('src');
          // Créer une nouvelle instance d'image
          var image = new Image();
          // Attacher un gestionnaire d'événement pour détecter quand l'image est chargée
          image.onload = function() {
            var imageRatio = image.height / image.width;
            if (imageRatio < 0.38) {
              image = targetSection.find('img:eq(1)')[0];
              imgSrc = image.src;
            }
            if (typeof imgSrc !== 'undefined' && imgSrc.match("^http")) {
              var previewHtml = "<div id='preview' style='position:absolute;z-index:9999;border:1px solid #000;box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.7);display:none'><img src='" + imgSrc + "' alt='Image preview' style='max-height:" + imageHeight + "px'></div>";
              ferveX("body").append(previewHtml);
              var mouseY = e.pageY - ferveX(window).scrollTop(); // Coordonnée Y du curseur par rapport à la fenêtre visible
              var totalHeight = mouseY + yOffset + imageHeight;
              var windowHeight = ferveX(window).height();
              var availableSpace = windowHeight - mouseY - yOffset;
              if (totalHeight > windowHeight && availableSpace < imageHeight) {
                // Le curseur est en bas de l'écran et l'espace disponible en haut est insuffisant pour l'image
                ferveX("#preview")
                  .css("top", (e.pageY - yOffset - imageHeight) + "px")
                  .css("bottom", "auto")
                  .css("left", (e.pageX + xOffset) + "px");
              } else {
                // Le curseur est en haut de l'écran ou l'espace disponible en haut est suffisant pour l'image
                ferveX("#preview")
                  .css("top", (e.pageY + yOffset + 8) + "px")
                  .css("bottom", "auto")
                  .css("left", (e.pageX + xOffset + 6) + "px");
              }
              ferveX("#preview").fadeIn("fast");
            }
          };
          // Charger l'image
          image.src = imgSrc;
        }, 'html');
      }, delai);
    }).on("mouseleave", function(e) {
      clearTimeout(compteur);
      ferveX("#preview").remove();
    });
    ferveX("a[id^='torrent_name'], a[href^='" + BASE_URL + "/torrent/']").on("mousemove", function(e) {
      var mouseY = e.pageY - ferveX(window).scrollTop(); // Coordonnée Y du curseur par rapport à la fenêtre visible
      var totalHeight = mouseY + yOffset + imageHeight;
      var windowHeight = ferveX(window).height();
      var availableSpace = windowHeight - mouseY - yOffset;
      if (totalHeight > windowHeight && availableSpace < imageHeight) {
        // Le curseur est en bas de l'écran et l'espace disponible en haut est insuffisant pour l'image
        ferveX("#preview")
          .css("top", (e.pageY - yOffset - imageHeight) + "px")
          .css("bottom", "auto")
          .css("left", (e.pageX + xOffset) + "px");
      } else {
        // Le curseur est en haut de l'écran ou l'espace disponible en haut est suffisant pour l'image
        ferveX("#preview")
          .css("top", (e.pageY + yOffset + 8) + "px")
          .css("bottom", "auto")
          .css("left", (e.pageX + xOffset + 6) + "px");
      }
    });
    ferveX("a[id^='torrent_name'], a[href^='" + BASE_URL + "/torrent/']").on("mouseout", function(e) {
      ferveX("#preview").remove();
    });
  }
  /* retrait de l'image de preview en cliquant dessus */
  ferveX(document).on("click", "#preview", function(e) {
    ferveX("#preview").remove();
  });
  /* retrait de l'image de preview en appuyant sur échap */
  ferveX(document).keyup(function(e) {
    if (e.key === "Escape") {
      ferveX("#preview").remove();
    }
  });

  function removePreview() {
    ferveX("a[id^='torrent_name'], a[href^='" + BASE_URL + "/torrent/']").off("mouseenter").off("mouseleave");
  }

  function getPreview() {
    if (url.indexOf("/forum/") == -1) {
      ferveX("a[id^='torrent_name'], a[href^='" + BASE_URL + "/torrent/']").not('.image-preview').each(function() {
        var that = ferveX(this);
        var href = that.attr('href');
        ferveX.get(href, function(data, status) {
          var targetSection = ferveX(data).find('#send-comment').prev('.content');
          if (targetSection.length === 0) {
            targetSection = ferveX(data).find('.content').eq(1);
          }
          var imgSrc = targetSection.find('img:first').attr('src');
          // Créer une nouvelle instance d'image
          var image = new Image();
          // Attacher un gestionnaire d'événement pour détecter quand l'image est chargée
          image.onload = function() {
            var imageRatio = image.height / image.width;
            if (imageRatio < 0.38) {
              image = targetSection.find('img:eq(1)')[0];
              imgSrc = image.src;
            }
            if (typeof imgSrc !== 'undefined' && imgSrc.match("^http")) {
              that.parent('td').prev().append('<img src="' + imgSrc + '" style="max-width:80px;height:auto;" class="image-preview">');
            }
          };
          // Charger l'image
          image.src = imgSrc;
        });
      });
    }
  }
  /* Recherche dynamique site+fofo */
  ferveX(document).bind("mouseup", function() {
    var texteSelection = x.Selector.getSelected();
    if ((texteSelection != '') && (fervexTemp != '1')) {
      if (fervexSearch == 'bulle') {
        ferveX('.fervexTools').css({
          'left': pageX + 5,
          'top': pageY - 50
        }).fadeIn(200);
        ferveX(".fervexTools a").html("<i class=\'" + iconeRecherche + "\'></i>");
      } else {
        ferveX('.fervexTools').css({
          'right': 10,
          'bottom': 6
        }).fadeIn(200);
        ferveX(".fervexTools a").html("<i class=\'" + iconeRecherche + "\'></i> Rechercher sur YGG");
      }
      ferveX(".fervexTools a").attr("href", BASE_URL + "/engine/search?name=" + texteSelection + "&do=search");
      ferveX(".fervexTools a").attr("title", "Rechercher : " + texteSelection);
      fervexTemp = '1';
    } else {
      ferveX('.fervexTools').fadeOut(200);
      fervexTemp = '0';
    }
    /* actualisation position du curseur */
    ferveX(document).on("mousedown", function(e) {
      pageX = e.pageX;
      pageY = e.pageY;
    });
  });
  /* fervextip */
  ferveX(document).on('mouseenter', '[rel=fervextip]', function(e) {
    if (ferveX(this).attr('title') == "") {
      ferveX(this).attr('title', ferveX('.tipBody').html());
      ferveX(this).children('#fervextip').remove();
    }
    var tip = ferveX(this).attr('title');
    ferveX(this).attr('title', '');
    ferveX(this).append('<div id="fervextip"><div class="tipBody">' + tip + '</div></div>');
    ferveX('#fervextip').css('top', e.clientY + 10);
    ferveX('#fervextip').css('left', e.clientX + 20);
    ferveX('#fervextip').fadeIn('500');
  }).on("mousemove", '[rel=fervextip]', function(e) {
    ferveX('#fervextip').css('top', e.clientY + 10);
    ferveX('#fervextip').css('left', e.clientX + 20);
  }).on("mouseleave", '[rel=fervextip]', function(e) {
    ferveX(this).attr('title', ferveX('.tipBody').html());
    ferveX(this).children('#fervextip').remove();
  });
  var rechercheF = '';
  var rechercheU = '';
  var baseUrl = '';
  if (url.indexOf("/forum/") > -1) {
    ferveX(document).ready(function() {
      if (document.location.search === '') {
        addMention();
      }
      ferveX('.p-nav .focus-wrap-nav ul.p-nav-list li').last().after('<li><div class="p-navEl"><a href="/user/account" class="p-navEl-link" data-nav-id="moncompte">Mon compte</a></div></li>');
      ferveX('.p-nav .focus-wrap-nav ul.p-nav-list li').last().after('<li><div class="p-navEl"><a href="/user/messages" class="p-navEl-link" data-nav-id="messagerie">Messagerie</a></div></li>');
      ferveX('.p-nav .focus-wrap-nav ul.p-nav-list li').last().after('<li><div class="p-navEl"><a href="/user/upload_torrent" class="p-navEl-link" data-nav-id="uploadtorrent">Upload torrent</a></div></li>');
      ferveX('.p-nav .focus-wrap-nav ul.p-nav-list li').last().after('<li><div class="p-navEl"><a href="/engine/search_users?nickname=" class="p-navEl-link" data-nav-id="chercheCopain" id="chercheCopain" title="Recherche un utilisateur sur YGG"></a></div></li>');
      ferveX('.p-nav .focus-wrap-nav ul.p-nav-list li').last().after('<li><div class="p-navEl"><a href="" class="p-navEl-link" data-nav-id="voirfavoris" id="voirfavoris" title="Afficher ses favoris enregistrés"></a></div></li>');
      ferveX("body").prepend('<div class="fervexTime d-flex align-items-center justify-content-center"><span class="badge">FR : <span id="hfr"></span> ↔ QC : <span id="hqc"></span></span></div>');
      ferveX('.block-outer-opposite').first().before('<div class="block-outer-main"><a href="" class="button--link button ajout-favoris" title="Ajouter aux Favoris"><i class="fa fa-bookmark"></i> En Favoris</a></div>')
      /* Favoris */
      ferveX(".ajout-favoris").click(function(e) {
        e.preventDefault();
        const that = ferveX(this);
        const currentDate = new Date();
        const temps = currentDate.getTime()
        const favTitre = ferveX("h1.p-title-value").text();
        const favUrl = ferveX(location).attr('href');
        localStorage.setItem('FAV_' + temps + '_titre', favTitre);
        localStorage.setItem('FAV_' + temps + '_lien', favUrl);
        that.text('Ajouté !');
        setTimeout(function() {
          that.remove();
        }, 800);
      });
      ferveX('#voirfavoris').click(function(e) {
        e.preventDefault();
        if (!ferveX(".fervexpop-styles").length) {
          const modalStyles = `
					<style class="fervexpop-styles">
						.fervexpop-overlay {
							display: none;
							position: fixed;
							z-index: 1000;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							background-color: rgba(0, 0, 0, 0.5);
						}
						.fervexpop {
							position: fixed;
							top: -100%;
							left: 50%;
							transform: translate(-50%, 0);
							color: #aaa;
							background-color: #22282f;
							width: 100%;
							max-width: 680px;
							box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
						}
						.fervexpop a {
							color: #aaa;
						}
						.fervexpop-content {
							padding: 20px;
						}
						.fervexpop-content .fa{
							color: #e74c3c;
						}
						.fervexpop-close {
							float: right;
							font-size: 28px;
							font-weight: bold;
							cursor: pointer;
						}
						.fervexpop-close:hover {
							color: #FFF;
						}
					</style>
					`;
          ferveX("head").append(modalStyles);
        }
        const favListe = [];
        for (const key in localStorage) {
          if (key.startsWith('FAV_') && key.endsWith('_titre')) {
            const titre = localStorage[key];
            const lienKey = key.replace('_titre', '_lien');
            const lien = localStorage[lienKey];
            if (lien) {
              favListe.push(`
								<li>
									<a href="${lien}">${titre}</a>
									&nbsp; <a href="#" class="del-favoris" data-titre-key="${key}" data-lien-key="${lienKey}"><i class="fa fa-trash"></i></a>
								</li>
							`);
            }
          }
        }
        const modalContent = `
					<div class="fervexpop-overlay">
						<div class="fervexpop">
							<div class="fervexpop-content">
								<span class="fervexpop-close">&times;</span>
								<h2>Mes Favoris</h2>
								<ul>${favListe.join("")}</ul>
							</div>
						</div>
					</div>
				`;
        ferveX("body").append(modalContent);
        ferveX(".fervexpop-overlay").fadeIn(300, function() {
          ferveX(".fervexpop").animate({
            top: "20%"
          }, 300);
        });
        if (favListe.length === 0) {
          ferveX(".fervexpop ul").html("Pas de favoris");
        }
        ferveX(".del-favoris").click(function(event) {
          event.preventDefault();
          localStorage.removeItem(ferveX(this).data("titre-key"));
          localStorage.removeItem(ferveX(this).data("lien-key"));
          ferveX(this).parent().remove();
          if (ferveX(".fervexpop ul").children().length === 0) {
            ferveX(".fervexpop ul").html("Plus de favoris");
          }
        });
        ferveX(".fervexpop-close").click(function() {
          ferveX(".fervexpop-overlay").fadeOut(300, function() {
            ferveX(this).remove();
          });
        });
      });
      /* Horloge */
      horloge("#hfr", "Europe/Paris");
      horloge("#hqc", "America/Montreal");

      function horloge(elementSelector, timeZone = "UTC", locale = "fr-FR") {
        const actualiser = () => {
          const dateElement = document.querySelector(elementSelector);
          const currentDate = new Date();
          dateElement.innerText = currentDate.toLocaleTimeString(locale, {
            timeZone
          });
        };
        actualiser();
        setInterval(actualiser, 1000);
      }
      /* Recherche copain */
      ferveX('#chercheCopain').click(function(e) {
        e.preventDefault();
        var s = prompt('Recherche un utilisateur sur YGG :', '');
        //if (!(!s || s=='')) {window.location = '/engine/search_users?nickname='+s+'&do=search'};
        //if (!(!s || s=='')) {window.open(window.location.protocol+'//'+window.location.host+'/engine/search_users?nickname='+s+'&do=search')};
        if (!(!s || s == '')) {
          ferveX('<a href="' + window.location.protocol + '//' + window.location.host + '/engine/search_users?nickname=' + s + '&do=search" target="blank"></a>')[0].click();
        };
      });
      // Mes demandes d'upload
      var demandesUpload = ferveX('<button>', {
        id: 'demandesUpload',
        class: 'button button--icon button--icon--search',
        text: ""
      });
      var demandesUploadContent = "<span class='button-text'>Demandes d'upload où j'ai réagi</span>";
      var username = ferveX('.avatar').next('.p-navgroup-linkText').first().text();
      demandesUpload.on('click', function() {
        ferveX.get("/forum/index.php?search/&type=post", function(pageSource) {
          var xfTokenElement = ferveX('input[name="_xfToken"]', pageSource);
          if (xfTokenElement.length > 0) {
            var xfTokenValue = xfTokenElement.val();
            var form = ferveX('<form>', {
              action: "/forum/index.php?search/search",
              method: "POST"
            });
            form.append('<input type="hidden" name="c[users]" value="' + username + '">');
            form.append('<input type="hidden" name="c[nodes][]" value="123">');
            form.append('<input type="hidden" name="c[child_nodes]" value="1">');
            form.append('<input type="hidden" name="search_type" value="post">');
            form.append('<input type="hidden" name="grouped" value="1">');
            form.append('<input type="hidden" name="_xfToken" value="' + xfTokenValue + '">');
            ferveX('body').append(form);
            form.submit();
          }
        });
      });
      ferveX('.p-title-pageAction').append(demandesUpload);
      ferveX('#demandesUpload').append(demandesUploadContent);
      // ajout d'un filtre pour nos créations de post uniquement
      if (url.indexOf("/index.php?search/") > -1) {
        var demandesUploadUser = ferveX('<button>', {
          id: 'demandesUploadUser',
          class: 'button button--icon button--icon--search',
          text: ""
        });
      }
      var demandesUploadUserContent = "<span class='button-text'>Filtrer uniquement mes demandes</span>";
      ferveX('.p-body-header .p-title').append(demandesUploadUser);
      ferveX('#demandesUploadUser').append(demandesUploadUserContent);

      function getLastPageNumberdemandesUpload() {
        var lastPageLink = ferveX('.pageNav-main li.pageNav-page:last-child a');
        return lastPageLink.length ? parseInt(lastPageLink.text()) : 1;
      }

      function getElementsFromPagedemandesUpload(pageNumber) {
        var url = window.location.href + '&page=' + pageNumber;
        var response = ferveX.ajax({
          url: url,
          type: 'GET',
          async: false,
        }).responseText;
        var doc = ferveX.parseHTML(response);
        return ferveX(doc).find('.block-row[data-author="' + username + '"]');
      }
      ferveX('#demandesUploadUser').on("click", function(e) {
        var lastPage = getLastPageNumberdemandesUpload();
        var allElements = [];
        for (var i = 1; i <= lastPage; i++) {
          var elementsFromPage = getElementsFromPagedemandesUpload(i);
          allElements = allElements.concat(Array.from(elementsFromPage));
        }
        var filteredElements = allElements.filter(function(element) {
          return element.getAttribute('data-author') === username;
        });
        var resultList = ferveX('.block-body');
        resultList.empty();
        ferveX.each(filteredElements, function(_, element) {
          resultList.append(element);
        });
        var pagination = ferveX('.pageNavWrapper');
        if (pagination.length) {
          pagination.remove();
        }
      });
      /* affichage du nb messages qu'on a écrits par post */
      if (ferveX('body').data('template') === "whats_new_posts" || ferveX('body').data('template') === "forum_view") {
        ferveX('.structItem').each(function() {
          var title = ferveX(this).find('.structItem-title');
          var liste = ferveX(this).find('.structItem-statuses');
          if (!liste.length) {
            title.before("<ul class='structItem-statuses'></ul>")
          }
          liste = ferveX(this).find('.structItem-statuses');
          var structItemCellMetaElement = ferveX(this).find('.structItem-cell--meta');
          if (structItemCellMetaElement.length) {
            var structItemCellMeta = structItemCellMetaElement.attr('title');
            if (structItemCellMeta.includes('Premier message apprécié:')) {
              var messageCount2 = parseInt(structItemCellMeta.split(':')[1].trim());
              if (messageCount2 !== 0) {
                var messageText2 = 'Le premier message<br>a reçu ' + messageCount2 + ' j\'aime !';
                var messageElement2 = ferveX('<li style="font-size:12px; cursor: help" rel="fervextip" title="' + messageText2 + '">' + messageCount2 + ' 🎔 </li>');
                liste.prepend(messageElement2);
              }
            }
          }
          var secondaryTitleElement = ferveX(this).find('.structItem-secondaryIcon');
          if (secondaryTitleElement.length) {
            var secondaryTitle = secondaryTitleElement.attr('title');
            if (secondaryTitle.includes('Vous avez envoyé')) {
              var messageCount = parseInt(secondaryTitle.match(/\d+/)[0]);
              var messageText = (messageCount === 1) ? 'Vous avez écrit ' + messageCount + ' message' : 'Vous avez écrit ' + messageCount + ' messages';
              var messageElement = ferveX('<li style="font-size:12px; cursor: help" rel="fervextip" title="' + messageText + '">' + messageCount + ' 🗨</li>');
              liste.prepend(messageElement);
            }
          }
        });
      }
      /* Création lien profil YGG */
      ferveX(".message-userDetails .message-name .username").each(function() {
        var userPseudo = ferveX.trim(ferveX(this).text());
        var userSection = ferveX(this).closest(".message-user");
        var userProfil, userInbox, userRatio, userUp, userUpOctet, userDown, userDownOctet, userDelta;
        var urlSearch = BASE_URL + "/engine/search_users?nickname=" + encodeURIComponent(userPseudo);
        // Requête pour charger le contenu HTML de la recherche user
        fetch(urlSearch)
          .then(response => response.text())
          .then(responseText => {
            var doc = ferveX(responseText);
            var usersFound = ferveX(doc).find(".card-title");
            usersFound.each(function() {
              var userFound = ferveX(this).text().trim();
              if (userFound === userPseudo) {
                userProfil = ferveX(this).parent().prev().attr("href");
                userUp = ferveX(this).parent().next().find(".pull-left strong").first().text();
                userDown = ferveX(this).parent().next().find(".pull-left strong").eq(1).text();
                if (!userUp || !userDown) {
                  return false;
                }
                userUpOctet = sizeStringToByteNumber(userUp);
                userDownOctet = sizeStringToByteNumber(userDown);
                userDelta = userUpOctet - userDownOctet;
                userRatio = userUpOctet / userDownOctet;
                return false;
              }
            });
            if (userProfil) {
              userSection.append(
                '<div style="text-align:center; margin-top:12px; padding:5px 0; cursor: default;">' +
                '    <div><i class="fa fa-user"></i> <a href="' + userProfil + '">Profil YGG</a></div>' +
                '    <div style="padding: 5px 5px 0 5px;">' + (userUp ?
                  '        <span class="userBanner userBanner--green message-userBanner" style="display:inline-block;background:#28a745;border-color:#28a745;" rel="fervextip" title="Quantité envoyée"><i class="fa fa-upload"></i> ' + userUp.replace(/(\D+)$/, ' $1') + '</span>' : '') + (userDown ?
                  '        <span class="userBanner userBanner--red message-userBanner" style="display:inline-block;background:#dc3545;border-color:#dc3545;" rel="fervextip" title="Quantité téléchargée"><i class="fa fa-download"></i> ' + userDown.replace(/(\D+)$/, ' $1') + '</span>' : '') +
                '    </div>' +
                '    <div style="padding: 0 5px 5px 5px;">' + (userRatio ?
                  '        <span class="userBanner userBanner--blue message-userBanner" style="display:inline-block;background:#808ba0;border-color:#808ba0;" rel="fervextip" title="Téléchargement restant">Δ ' + (userDelta < 0 ? '<1 !' : formatOctets(userDelta).replace(/(\D+)$/, ' $1')) + '</span>' : '') + (userDelta ?
                  '        <span class="userBanner userBanner--white message-userBanner" style="display:inline-block;background:#ffffff;border-color:#ffffff;" rel="fervextip" title="Ratio"><i class="fa fa-balance-scale"></i> ' + userRatio.toFixed(3) + '</span>' : '') +
                '    </div>' +
                '</div>'
              );
              ferveX(this).attr("data-profilygg", userProfil);
            }
          })
      });
      ferveX(document).on('mouseenter', 'a[data-xf-init=member-tooltip]', function(e) {
        var urlTemp = ferveX(this).attr('href');
        var regex = /members\/([^\/.]+)/;
        var match = urlTemp.match(regex);
        if (match !== null) {
          var userPseudo = match[1];
          var userProfil;
          var urlSearch = BASE_URL + "/engine/search_users?nickname=" + encodeURIComponent(userPseudo);
          fetch(urlSearch)
            .then(response => response.text())
            .then(responseText => {
              var doc = ferveX(responseText);
              var usersFound = ferveX(doc).find(".card-title");
              usersFound.each(function() {
                var userFound = ferveX(this).text().trim();
                if (userFound.toUpperCase() === userPseudo.toUpperCase()) {
                  userProfil = ferveX(this).parent().prev().attr("href");
                  return false;
                }
              });
              if (userProfil) {
                setTimeout(function() {
                  ferveX('.tooltip--member').each(function() {
                    if (ferveX(this).find('.buttonGroup .profil-ygg').length === 0) {
                      ferveX(this).find('.buttonGroup').append('<a href="' + userProfil + '" class="button--link button profil-ygg">Profil YGG</a>');
                    };
                  });
                }, 1000);
              }
            })
        }
      })
      if (url.indexOf("/forum/index.php?members/") > -1) {
        var userPseudo = ferveX('.memberHeader-name .username').text().trim();
        var userProfil;
        var urlSearch = BASE_URL + "/engine/search_users?nickname=" + encodeURIComponent(userPseudo);
        fetch(urlSearch)
          .then(response => response.text())
          .then(responseText => {
            var doc = ferveX(responseText);
            var usersFound = ferveX(doc).find(".card-title");
            usersFound.each(function() {
              var userFound = ferveX(this).text().trim();
              if (userFound === userPseudo) {
                userProfil = ferveX(this).parent().prev().attr("href");
                return false;
              }
            });
            if (userProfil) ferveX('.memberHeader-buttons').append('<a href="' + userProfil + '" class="button button--link">Profil YGG</a>');
          })
      };
    });
  } else {
    ferveX(document).ready(function() {
      /* Antipub */
      if (ferveX('#top nav li.color').is(':contains("Regarder la télé")')) {
        ferveX('#top nav li.color:contains("Regarder la télé")').remove();
        ferveX('#top nav li.color').css("width", "12.5%");
      }
      if (ferveX('#cat ul li').is(':contains("Télécharger en illimité")')) {
        ferveX('#cat ul li:contains("Télécharger en illimité")').remove();
      }
      if (ferveX('#cat ul li').is(':contains("Utiliser un VPN")')) {
        ferveX('#cat ul li:contains("Utiliser un VPN")').remove();
      }
      ferveX('header a.donate').remove();
      /* Fermeture Sidebar gauche */
      var fervexSidebar = getValue('fervex_sidebar');
      if (fervexSidebar == null || fervexSidebar == "off") {
        if (ferveX('#cat').hasClass('active')) {
          ferveX('.open').click();
        }
      } else {
        if (!ferveX('#cat').hasClass('active')) {
          ferveX('.open').click();
        }
      }
      /* Agrandissement modal NFO */
      if (ferveX('#nfoModal .modal-dialog').hasClass('modal-sm')) {
        ferveX('#nfoModal .modal-dialog').toggleClass('modal-sm modal-lg');
      }
      /* Zupimages */
      if (url.indexOf("/user/upload_torrent") > -1) {
        ferveX('<div style="position:absolute;right:20px;top:-95px;" class="p-2 bg-light border"><iframe src="https://www.zupimages.net/api/index.php?background=transparent&amp;color=000000&amp;header=yes&amp;lastimage=yes" width="210" height="120" frameborder="no" scrolling="no"></iframe></div>').appendTo('#upload-torrent > div > div.row:nth-child(8)');
      }
      /* Sauvegarde Prez (édition) */
      if (url.indexOf("/user/edit_torrent") > -1) {
        /* titre torrent */
        ferveX('#edit-torrent>div>div:nth-child(5)>div.col-md-2.field-label-responsive>label').after('<div style="margin-top: -5px;"><a href="" id="save-titre">Sauvegarder</a></div>');
        ferveX("#save-titre").click(function(e) {
          e.preventDefault();
          var titreperso = ferveX("#edit-torrent input#name").val();
          localStorage.setItem("titreperso", titreperso);
        });
        /* contenu prez */
        ferveX('#edit-torrent>div>div:nth-child(6)>div.col-md-2.field-label-responsive>label').after('<button class="btn btn-secondary my-2" id="save-prez">Sauvegarder la prez</button>');
        ferveX("#save-prez").click(function(e) {
          e.preventDefault();
          var prez = ferveX('.wysibb-text-editor').html();
          localStorage.setItem('prezperso', prez);
        });
      }
      /* Stockage Prez (création) */
      if (url.indexOf("/user/upload_torrent") > -1) {
        /* titre torrent */
        if (localStorage.getItem("titreperso") !== null && localStorage.getItem("titreperso") !== "") {
          ferveX('#upload-torrent>div>div:nth-child(8)>div.col-md-2.field-label-responsive>label').after('<div style="margin-top: -5px;"><a href="" id="save-titre">Sauvegarder</a> | <a href="" id="get-titre">Restaurer</a></div>');
        } else {
          ferveX('#upload-torrent>div>div:nth-child(8)>div.col-md-2.field-label-responsive>label').after('<div style="margin-top: -5px;"><a href="" id="save-titre">Sauvegarder</a></div>');
        }
        ferveX("#save-titre").click(function(e) {
          e.preventDefault();
          var titreperso = ferveX("#upload-torrent input#name").val();
          localStorage.setItem("titreperso", titreperso);
        });
        ferveX("#get-titre").click(function(e) {
          e.preventDefault();
          var titreperso = localStorage.getItem("titreperso");
          ferveX("#upload-torrent input#name").val(titreperso);
        });
        /* contenu prez */
        if (localStorage.getItem("prezperso") !== null && localStorage.getItem("prezperso") !== "") {
          ferveX('#upload-torrent button[type=submit]').after('<button class="btn btn-secondary mx-1" id="get-prez">Restaurer la prez sauvegardée</button>');
        }
        ferveX('#upload-torrent button[type=submit]').after('<button class="btn btn-secondary mx-1" id="save-prez">Sauvegarder la prez</button>');
        ferveX("#save-prez").click(function(e) {
          e.preventDefault();
          var prez = ferveX('.wysibb-text-editor').html();
          localStorage.setItem('prezperso', prez);
        });
        ferveX("#get-prez").click(function(e) {
          e.preventDefault();
          var prez = localStorage.getItem("prezperso");
          ferveX(".wysibb-text-editor").html(prez);
        });
      }
      /* Boutons de recherche */
      ferveX('.search-criteria button.solo')
        .after(' <a href="" class="recherche-fervex" id="recherche-seriesD" style="' + styleBoutonS + '"><img src="https://i.ibb.co/yh7pQYZ/serie.png" class="pr-1" style="padding-bottom: 2px;"> Séries (Date)</a>')
        .after(' <a href="" class="recherche-fervex" id="recherche-seriesP" style="' + styleBoutonS + '"><img src="https://i.ibb.co/yh7pQYZ/serie.png" class="pr-1" style="padding-bottom: 2px;"> Séries (Poids)</a>')
        .after(' <a href="" class="recherche-fervex" id="recherche-filmD"   style="' + styleBoutonF + '"><img src="https://i.ibb.co/pQ6ksRg/film.png" class="pr-1" style="padding-bottom: 2px;"> Films (Date)</a>')
        .after(' <a href="" class="recherche-fervex" id="recherche-filmP"   style="' + styleBoutonF + '"><img src="https://i.ibb.co/pQ6ksRg/film.png" class="pr-1" style="padding-bottom: 2px;"> Films (Poids)</a>')
        .after('<a href="" class="recherche-fervex w65" rel="fervextip" id="recherche-ok" style="' + styleBouton + '" title="Ajouter les guillemets automatiquement !"><i class="ico_quote-left"></i> <i class="ico_quote-right"></i></a>');
      ferveX('#recherche-ok').after(' <div style="width:100%;height:10px;display:block"> </div>');
      ferveX('.search-criteria button.solo').css({
        "display": "inline-block",
        "font-size": "16px"
      });
      ferveX('.search-criteria .alone').css('text-align', 'center');
      ferveX(".bulle").css({
        "border-radius": "16px",
        "min-width": "16px",
        "width": "auto",
        "padding": "0 5px"
      });
      ferveX('.recherche-fervex, .search-criteria button.solo').hover(function() {
        ferveX(this).addClass('butonFervexHover');
      }, function() {
        ferveX(this).removeClass('butonFervexHover');
      });
      var rechercheGuillemet = false;
      ferveX('#recherche-ok').click(function(e) {
        e.preventDefault();
        if (rechercheGuillemet) {
          var temp = ferveX(".search-criteria input[name='name']").val().replace(/"/g, '');
          ferveX(".search-criteria input[name='name']").val(temp);
          ferveX(this).css('background', '#4e5c6f');
          rechercheGuillemet = false;
        } else {
          var temp = ferveX(".search-criteria input[name='name']").val().replace(/"/g, ' ').trim();
          if (temp != '') {
            temp = temp.split(" ").join("\" \"");
            ferveX(".search-criteria input[name='name']").val('"' + temp + '"');
            ferveX(this).css('background', '#30353c');
            rechercheGuillemet = true;
          }
        }
      });
      if (url.indexOf("/engine/search") > -1) {
        let recherchePrecedente = new URLSearchParams(document.location.search.substring(1));
        let recherchePrecedenteValeur = recherchePrecedente.get("name");
        if (recherchePrecedenteValeur != null) {
          ferveX(".search-criteria input[name='name']").val(recherchePrecedenteValeur);
        }
      }
      ferveX('#recherche-filmP').click(function(e) {
        e.preventDefault();
        rechercheF = ferveX(".search-criteria input[name='name']").val();
        rechercheU = ferveX(".search-criteria input[name='uploader']").val();
        window.location = baseUrl + 'search?name=' + rechercheF + '&description=&file=&uploader=' + rechercheU + '&category=2145&sub_category=2183&do=search&order=desc&sort=size';
      });
      ferveX('#recherche-filmD').click(function(e) {
        e.preventDefault();
        rechercheF = ferveX(".search-criteria input[name='name']").val();
        rechercheU = ferveX(".search-criteria input[name='uploader']").val();
        window.location = baseUrl + 'search?name=' + rechercheF + '&description=&file=&uploader=' + rechercheU + '&category=2145&sub_category=2183&do=search&order=desc&sort=publish_date';
      });
      ferveX('#recherche-seriesP').click(function(e) {
        e.preventDefault();
        rechercheF = ferveX(".search-criteria input[name='name']").val();
        rechercheU = ferveX(".search-criteria input[name='uploader']").val();
        window.location = baseUrl + 'search?name=' + rechercheF + '&description=&file=&uploader=' + rechercheU + '&category=2145&sub_category=2184&do=search&order=desc&sort=size';
      });
      ferveX('#recherche-seriesD').click(function(e) {
        e.preventDefault();
        rechercheF = ferveX(".search-criteria input[name='name']").val();
        rechercheU = ferveX(".search-criteria input[name='uploader']").val();
        window.location = baseUrl + 'search?name=' + rechercheF + '&description=&file=&uploader=' + rechercheU + '&category=2145&sub_category=2184&do=search&order=desc&sort=publish_date';
      });
      /* bouton DL torrent */
      function gettorrent() {
        ferveX('a[id^=get_nfo]').not('.ico-dl').each(function() {
          var that = ferveX(this);
          that.parent('td').css("white-space", "nowrap");
          var torrent = that.attr('target');
          var href = that.parent('td').prev().find('a').attr('href');
          that.before('<a href="/engine/download_torrent?id=' + torrent + '" rel="fervextip" title="Télécharger le torrent" class="py-1 pr-2 mr-2 fervexDL" style="border-right:1px solid #ccc;"><span class="ico_download text-primary"></span></a>');
          that.before('<a href="#" data-refresh="' + href + '" rel="fervextip" title="Stats du torrent en temps réel" class="py-1 pr-2 mr-2 fervexRefresh" style="border-right:1px solid #ccc;"><span class="ico_refresh text-success"></span></a>');
          that.addClass('ico-dl');
          var link = ferveX('<span>', {
            'data-lastcom': href,
            rel: 'fervextip',
            title: 'Afficher les derniers commentaires',
            class: 'fervexLastCom',
            style: 'cursor:pointer'
          });
          that.parent('td').next().wrapInner(link);
        });
        ferveX('.fervexDL span, .fervexRefresh span, .fervexLastCom').hover(function() {
          ferveX(this).addClass('text-danger');
        }, function() {
          ferveX(this).removeClass('text-danger');
        });
        ferveX("[data-lastcom]").on("click", function(e) {
          e.preventDefault();
          var that = ferveX(this);
          var href = that.data("lastcom");
          ferveX.get(href, function(data, status) {
            var comms = ferveX(data).find("#comm").html();
            ferveX('body').prepend('<div class="modal fade" id="lastComModal" tabindex="-1" role="dialog" aria-labelledby="lastComModalLabel" aria-hidden="true">' +
              '  <div class="modal-dialog modal-lg" role="document">' +
              '    <div class="modal-content">' +
              '      <div class="modal-header border-dark">' +
              '        <h5 class="modal-title pr-3" id="lastComModalLabel">Derniers commentaires du torrent</h5>' +
              '        <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">' +
              '          <span aria-hidden="true">&times;</span>' +
              '        </button>' +
              '      </div>' +
              '      <div class="modal-body p-0">' +
              '          <div>' + comms + '</div>' +
              '      </div>' +
              '    </div>' +
              '  </div>' +
              '</div>');
            const lastComModal = new bootstrap.Modal(document.getElementById('lastComModal'));
            lastComModal.show();
          });
        });
        ferveX("a[data-refresh]").on("click", function(e) {
          e.preventDefault();
          var that = ferveX(this);
          that.find('span').addClass("ico_spin");
          var href = that.data("refresh");
          ferveX.get(href, function(data, status) {
            var stats = (ferveX(data).find("#register").length > 0) ? 1 : 0;
            var hashTorrent = ferveX(data).find("#informationsContainer > div > table > tbody > tr:nth-child(5) > td:nth-child(2)").text();
            var random = Math.random().toString(36).slice(2);
            var getStats = 'https://yggland.fr/FAQ-Tutos/info-torrent.php?hash=' + hashTorrent + '&seeders&leechers&completed&random';
            ferveX('#statsModal').remove();
            ferveX.get(getStats, function(data2, status) {
              var statsTorrent = data2.split('|');
              ferveX('body').prepend('<div class="modal fade" id="statsModal" tabindex="-1" role="dialog" aria-labelledby="statsModalLabel" aria-hidden="true">' +
                '  <div class="modal-dialog" style="max-width: fit-content" role="document">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header border-dark">' +
                '        <h5 class="modal-title pr-3" id="statsModalLabel">Stats torrent en temps réel</h5>' +
                '        <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">' +
                '          <span aria-hidden="true">&times;</span>' +
                '        </button>' +
                '      </div>' +
                '      <div class="modal-body p-0">' +
                '        <table class="table table-bordered dark bg-dark text-light text-center m-0">' +
                '          <tbody>' +
                '            <tr>' +
                '              <td class="border-black" width="115">Seeders</th>' +
                '              <td class="border-black" width="115">Leechers</th>' +
                '              <td class="border-black" width="115">Complétés</th>' +
                '            </tr>' +
                '            <tr>' +
                '              <td class="border-black text-success text-bold">' + statsTorrent[0] + '</td>' +
                '              <td class="border-black text-danger text-bold">' + statsTorrent[1] + '</td>' +
                '              <td class="border-black text-light text-bold">' + statsTorrent[2] + '</td>' +
                '            </tr>' +
                '          </tbody>' +
                '        </table>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>');
              const statsModal = new bootstrap.Modal(document.getElementById('statsModal'));
              statsModal.show();
              that.find('span').removeClass("ico_spin");
            });
          });
        });
      }
      if (url.indexOf("/engine/search") > -1) {
        gettorrent();
      } else {
        setTimeout(gettorrent, 800);
      }
      ferveX('td[id^=display-more]').click(function(e) {
        setTimeout(gettorrent, 800);
      });

      function InfiniteScroll(nb) {
        let currentPage = 0;
        let loading = false;
        let table;

        function loadMoreTorrents() {
          if (loading) return;
          loading = true;
          currentPage += nb;
          let url = document.location.href;
          GM.xmlHttpRequest({
            method: "GET",
            url: nb === 50 ? `${url}&page=${currentPage}` : `${url}?page=${currentPage}`,
            headers: {
              "Cookie": document.cookie
            },
            onload: function(response) {
              let parser = new DOMParser();
              let temp = parser.parseFromString(response.responseText, "text/html");
              let torrents = temp.querySelectorAll('div.table-responsive.results table tr');
              if (torrents && torrents.length > 0) {
                appendTorrents(torrents);
              } else {
                ferveX(window).off('scroll', handleScroll);
              }
              loading = false;
            },
            onerror: function() {
              console.error('Failed to load more torrents.');
              loading = false;
            }
          });
        }

        function initializeDataTable() {
          table = ferveX('.results .table').DataTable({
            dom: "<'row'<'col-12 text-center mt-3'f>>" +
              "<'row'<'col-12'tr>>" +
              "<'row'<'col-12 text-center my-3'i>>",
            stateSave: false,
            autoWidth: false,
            order: [],
            ordering: false,
            paging: false,
            language: {
              processing: "Traitement en cours...",
              search: "",
              searchPlaceholder: "Filtrer la page en cours",
              lengthMenu: "_MENU_ torrents par page",
              info: "_END_ torrents affichés ",
              infoEmpty: "Aucun torrent",
              infoFiltered: "(filtrés sur _MAX_ torrents de la page)",
              infoPostFix: "",
              loadingRecords: "Chargement...",
              zeroRecords: "Aucun torrent à afficher",
              emptyTable: "Aucune donnée disponible",
              paginate: {
                first: "Premier",
                previous: "<i class='fas fa-chevron-left'></i>",
                next: "<i class='fas fa-chevron-right'></i>",
                last: "Dernier"
              },
              aria: {
                sortAscending: ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
              },
              select: {
                rows: {
                  _: "%d lignes sélectionnées",
                  0: "Aucune ligne sélectionnée",
                  1: "1 ligne sélectionnée"
                }
              },
              buttons: {
                colvis: 'Colonnes',
                copy: 'Copier',
                print: 'Imprimer'
              }
            }
          });
        }

        function appendTorrents(torrents) {
          const rows = [];
          torrents.forEach((torrent, index) => {
            if (index > 0) { // Ignorer le premier élément
              const rowHtml = torrent.outerHTML;
              const rowNode = ferveX(rowHtml)[0];
              rows.push(rowNode);
            }
          });
          if (table) {
            table.rows.add(rows).draw();
          }
          attachClickHandlers();
        }

        function handleScroll() {
          const scrollTop = ferveX(window).scrollTop();
          const windowHeight = ferveX(window).height();
          const documentHeight = ferveX(document).height();
          const scrollPercentage = scrollTop / (documentHeight - windowHeight);
          if (scrollPercentage >= 0.75) {
            loadMoreTorrents();
          }
        }

        function attachClickHandlers() {
          var fervexPreview = getValue('fervex_preview');
          if (fervexPreview == null || fervexPreview == "on") {
            setTimeout(function() {
              removePreview();
              addPreview();
            }, 800);
          }
          var fervexPreview2 = getValue('fervex_preview2');
          if (fervexPreview2 == "on") {
            setTimeout(function() {
              getPreview();
            }, 800);
          }
          setTimeout(gettorrent, 300);
          //initializeDataTable()
        }
        ferveX(window).on('scroll', handleScroll);
        loadMoreTorrents();
        initializeDataTable();
        attachClickHandlers();
      }
      if (url.indexOf("/search") > -1 && scroll) {
        InfiniteScroll(50);
      } else if (url.indexOf("/torrents/exclus") > -1 && scroll) {
        InfiniteScroll(25);
      }
      /* notif */
      if (url.indexOf("/user/notifications") > -1) {
        var notifNonLues = parseInt(ferveX('#top_panel [data-balloon="Notifications non lues"]').text());
        var rows = ferveX("table.notifications tr");
        var rowCount = rows.length;
        for (var i = 0; i < rowCount; i++) {
          var row = ferveX(rows[i]);
          var td1 = row.find('td:first-child()');
          var td2 = td1.next();
          var td3 = td2.next();
          var hrefuser = td2.find('strong').eq(0).text();
          var hreftorrent = td2.find('strong').eq(1).text();
          var hrefstatus = td2.find('font').eq(0).text();
          var hrefpending = td2.find('font').eq(1).text();
          var link = row.attr("onclick");
          var hrefval = link.substring(link.indexOf("'") + 1, link.lastIndexOf("'"));
          var replacementHtml = '';
          if (hreftorrent.length) {
            replacementHtml = '<b>' + hrefuser + '</b> a commenté <a href="' + hrefval + '" class="text-primary"><b>' + hreftorrent + '</b></a>';
            td3
              .prepend('<i class="ico_eye text-primary get-notif mr-1" style="cursor:pointer" data-url="' + hrefval + '"></i> ')
              .addClass("text-nowrap");
          } else if (hrefstatus.length) {
            var typepending = (hrefstatus === "approuvé") ? "success" : (hrefstatus === "supprimé") ? "danger" : "warning";
            replacementHtml = '<b>' + hrefuser + '</b><br><span class="text-' + typepending + '">' + hrefstatus + '</span> par la TP &rarr; <a href="' + hrefval + '" class="text-' + typepending + '"><b>' + hrefpending + '</b></a>';
          } else {
            replacementHtml = '<a href="' + hrefval + '" class="text-primary"><b>' + td2.html() + '</b></a>';
          }
          if (replacementHtml) {
            td2.html(replacementHtml);
          }
          row
            .prop("onclick", null)
            .removeAttr("onclick")
            .off("click")
            .css('cursor', 'default');
          if (i < notifNonLues) {
            td1.append(' ⚡');
          }
        }
        ferveX(".get-notif").on("click", function(e) {
          e.preventDefault();
          var that = ferveX(this);
          var href = that.data("url");
          ferveX.get(href, function(data, status) {
            var comm = ferveX(data).find("#focusedComment").html();
            ferveX('body').prepend('<div class="modal fade" id="getNotifModal" tabindex="-1" role="dialog" aria-labelledby="getNotifModalLabel" aria-hidden="true">' +
              '  <div class="modal-dialog modal-lg" style="max-width:800px!important" role="document">' +
              '    <div class="modal-content">' +
              '      <div class="modal-header border-dark">' +
              '        <h5 class="modal-title pr-3" id="getNotifModalLabel">Commentaire reçu</h5>' +
              '        <button type="button" class="close text-light" data-dismiss="modal" aria-label="Close">' +
              '          <span aria-hidden="true">&times;</span>' +
              '        </button>' +
              '      </div>' +
              '      <div class="modal-body p-0">' +
              '          <div>' + comm + '</div>' +
              '      </div>' +
              '    </div>' +
              '  </div>' +
              '</div>');
            const NotifModal = new bootstrap.Modal(document.getElementById('getNotifModal'));
            NotifModal.show();
          });
        });
        ferveX('.get-notif').hover(function() {
          ferveX(this).addClass('text-danger');
        }, function() {
          ferveX(this).removeClass('text-danger');
        });
      }
      if (url.indexOf("/engine/search") > -1 || url.indexOf("/torrents/exclus") > -1 || url.indexOf("/user/my_torrents") > -1) {
        if (!scroll) {
          var table = ferveX('.results .table').DataTable({
            dom: "<'row'<'col-12 text-center mt-3'f>>" +
              "<'row'<'col-12'tr>>" +
              "<'row'<'col-12 text-center my-3'i>>",
            stateSave: false,
            autoWidth: false,
            order: [],
            ordering: false,
            paging: false,
            language: {
              processing: "Traitement en cours...",
              search: "",
              searchPlaceholder: "Filtrer la page en cours",
              lengthMenu: "_MENU_ torrents par page",
              info: "_END_ torrents affichés ",
              infoEmpty: "Aucun torrent",
              infoFiltered: "(filtrés sur _MAX_ torrents de la page)",
              infoPostFix: "",
              loadingRecords: "Chargement...",
              zeroRecords: "Aucun torrent à afficher",
              emptyTable: "Aucune donnée disponible",
              paginate: {
                first: "Premier",
                previous: "<i class='fas fa-chevron-left'></i>",
                next: "<i class='fas fa-chevron-right'></i>",
                last: "Dernier"
              },
              aria: {
                sortAscending: ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
              },
              select: {
                rows: {
                  _: "%d lignes sélectionnées",
                  0: "Aucune ligne sélectionnée",
                  1: "1 ligne sélectionnée"
                }
              },
              buttons: {
                colvis: 'Colonnes',
                copy: 'Copier',
                print: 'Imprimer'
              }
            }
          });
        }
      }
      /* filtrage Downloads */
      if (url.indexOf("/user/downloads") > -1) {
        ferveX('<div class="text-center pt-2"><label><input type="search" class="form-control form-control-sm" id="rechercheDL" placeholder="Filtrer les torrents"></label></div>').insertAfter("#middle main .inbox");
        ferveX("#rechercheDL").on("keyup", function() {
          var value = ferveX(this).val().toLowerCase();
          ferveX("#middle main .inbox tr").filter(function() {
            ferveX(this).toggle(ferveX(this).find("td:eq(1)").text().toLowerCase().indexOf(value) > -1)
          });
        });
      }
      /* test torrent via le hash */
      if (url.indexOf("/torrent/") > -1) {
        var hashtorrent = ferveX("#informationsContainer > div > table > tbody > tr:nth-child(5) > td:nth-child(2)").text();
        ferveX("#informationsContainer > div > table > tbody > tr:nth-child(5) > td:nth-child(2)").append('<a href="https://yggland.fr/FAQ-Tutos/test-torrent-tracker-ygg.php?hash=' + hashtorrent + '" class="btn btn-success ml-2" target="_blank" style="padding: 2px 6px">Tester</a>');
      }
      /* Correction liens sur le profil */
      if (url.indexOf('/user/account') > -1) {
        var username = ferveX('.detail-account tbody tr:first-child td:nth-child(2) strong').text().trim();
        var urlTorrents = '/engine/search?name=&description=&file=&uploader=' + username + '&category=all&sub_category=&do=search';
        var profile = ferveX('.card-footer a').attr('href');
        var urlComments = profile + '?action=show_comments';
        ferveX('.detail-account tbody tr:nth-child(4) a').attr('href', urlTorrents);
        ferveX('.detail-account tbody tr:nth-child(5) a').attr('href', urlComments);
      }
      /* Seed a zéro dans ses propres torrents */
      if (url.indexOf('/user/my_torrents') > -1) {
        async function getAllTableData() {
          let allTableData = [];
          let currentPage = 0;
          let totalNumberOfPages = 0;
          const lastPaginationLink = ferveX('ul.pagination li:last-child a');
          if (lastPaginationLink.attr('data-ci-pagination-page')) {
            totalNumberOfPages = parseInt(lastPaginationLink.attr('data-ci-pagination-page'));
          }
          console.log('Total number of pages:', totalNumberOfPages);
          while (true) {
            let pageData = await getTableData(currentPage);
            if (pageData.length === 0) {
              break;
            }
            allTableData = allTableData.concat(pageData);
            currentPage++;
            updateProgressBar(currentPage, totalNumberOfPages);
          }
          return allTableData;
        }
        async function getTableData(pageNumber) {
          let url = `${BASE_URL}/user/my_torrents?page=${pageNumber * 50}`;
          let response = await ferveX.ajax({
            url
          });
          let tempDiv = ferveX('<div>');
          tempDiv.html(response);
          let tableRows = tempDiv.find('.results table tbody tr');
          return tableRows.toArray();
        }

        function filterRowsWithZero(data) {
          return data.filter(row => {
            let avantDerniereColonne = row.cells[row.cells.length - 3];
            return avantDerniereColonne.textContent.trim() === "0";
          });
        }

        function displayFilteredTable(filteredData) {
          ferveX('.table-responsive.results').remove();
          let newTableHTML = '<table class="table">';
          newTableHTML += '<thead>';
          newTableHTML += '<tr>';
          newTableHTML += '<th class="no">Type</th>';
          newTableHTML += '<th class="no">Nom</th>';
          newTableHTML += '<th class="no">NFO</th>';
          newTableHTML += '<th class="no">Comm.</th>';
          newTableHTML += '<th class="no">Age</th>';
          newTableHTML += '<th class="no">Taille</th>';
          newTableHTML += '<th class="no">Compl.</th>';
          newTableHTML += '<th class="no">Seed</th>';
          newTableHTML += '<th class="no">Leech</th>';
          newTableHTML += '<th class="no"></th>';
          newTableHTML += '</tr>';
          newTableHTML += '</thead>';
          newTableHTML += '<tbody>';
          filteredData.forEach(row => {
            newTableHTML += '<tr torrent-id="' + ferveX(row).attr('torrent-id') + '">';
            ferveX(row).children('td').each(function() {
              newTableHTML += '<td>' + ferveX(this).html() + '</td>';
            });
            newTableHTML += '</tr>';
          });
          newTableHTML += '</tbody>';
          newTableHTML += '</table>';
          ferveX('<div class="table-responsive results" style="width: 100%">').html(newTableHTML).insertAfter('#btnFilter');
          ferveX('#btnFilter').replaceWith('<h2 class="mb-3">' + filteredData.length + ' Torrent(s) sans Seed :</h2>');
        }
        ferveX('.table-responsive.results').before('<button class="btn btn-success p-1 mb-3" id="btnFilter" style="text-transform:none">Filtrer torrents sans Seed</button>');

        function updateProgressBar(currentPage, totalNumberOfPages) {
          const progressPercentage = Math.floor((currentPage / totalNumberOfPages) * 100);
          const progressBar = ferveX('#progressBar .progress-bar');
          progressBar.css('width', progressPercentage + '%');
          progressBar.text(progressPercentage + '%');
        }
        ferveX('#btnFilter').on('click', async function() {
          try {
            ferveX('#progressBar').remove();
            ferveX('.table-responsive.results')
              .before('<div class="progress mb-3" id="progressBar" style="height: 22px;">' +
                '<div class="progress-bar d-flex flex-column justify-content-center h-100" role="progress-bar" style="width: 0%;font-size:0.9rem" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>' +
                '</div>');
            const allData = await getAllTableData();
            const filteredData = filterRowsWithZero(allData);
            const totalNumberOfPages = Math.ceil(allData.length / 50);
            displayFilteredTable(filteredData);
            ferveX('ul.pagination').parent('section').parent().parent('section').remove();
            updateProgressBar(totalNumberOfPages, totalNumberOfPages);
            gettorrent();
            var fervexPreview = getValue('fervex_preview');
            if (fervexPreview == null || fervexPreview == 'on') {
              setTimeout(function() {
                removePreview();
                addPreview();
              }, 400);
            }
            ferveX(document).on('click', 'a#remove', function() {
              var self = this;
              var conf = confirm("Confirmez-vous la suppression de ce torrent ?");
              if (conf) {
                var tr = self.closest('tr');
                var t_id = tr.getAttribute('torrent-id');
                var xhr = new XMLHttpRequest();
                xhr.open('POST', BASE_URL + '/user/remove_torrent', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      tr.style.transition = 'opacity 0.5s ease';
                      tr.style.opacity = '0';
                      setTimeout(function() {
                        tr.style.display = 'none';
                      }, 500);
                    } else {
                      alert(xhr.responseText);
                    }
                  }
                };
                xhr.send('id=' + encodeURIComponent(t_id));
              }
            });
            ferveX('#progressBar').remove();
          } catch (error) {
            console.error('Une erreur s\'est produite:', error);
          }
        });
      }
    });
  }
});