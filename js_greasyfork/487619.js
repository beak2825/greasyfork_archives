// ==UserScript==
// @name         JAV cover picture + video preview
// @description   yase.one、JavDB、JavBus、JavLibrary avmoo.cyou、JAV cover picture + video preview
// @include      *javbus.com/*
// @include      *javdb.com/*
// @include      *avmoo.cyou/*
// @include      *javlibrary.com/*
// @include      /^.*(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\..*$/
// @include      /^.*(javdb)[0-9]*\..*$/
// @include      /^.*(avmoo)\..*$/
// @match        https://yase.one/*
// @match        *://www.javbus.com/*
// @match        *://www.javdb.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_setClipboard
// @connect *
// @version 4.1
// @namespace https://greasyfork.org/users/852660
// @downloadURL https://update.greasyfork.org/scripts/487619/JAV%20cover%20picture%20%2B%20video%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/487619/JAV%20cover%20picture%20%2B%20video%20preview.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // @require      https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.8.2/dist/lazyload.min.js
    !function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(n="undefined"!=typeof globalThis?globalThis:n||self).LazyLoad=t()}(this,(function(){"use strict";function n(){return n=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},n.apply(this,arguments)}var t="undefined"!=typeof window,e=t&&!("onscroll"in window)||"undefined"!=typeof navigator&&/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),i=t&&"IntersectionObserver"in window,o=t&&"classList"in document.createElement("p"),a=t&&window.devicePixelRatio>1,r={elements_selector:".lazy",container:e||t?document:null,threshold:300,thresholds:null,data_src:"src",data_srcset:"srcset",data_sizes:"sizes",data_bg:"bg",data_bg_hidpi:"bg-hidpi",data_bg_multi:"bg-multi",data_bg_multi_hidpi:"bg-multi-hidpi",data_bg_set:"bg-set",data_poster:"poster",class_applied:"applied",class_loading:"loading",class_loaded:"loaded",class_error:"error",class_entered:"entered",class_exited:"exited",unobserve_completed:!0,unobserve_entered:!1,cancel_on_exit:!0,callback_enter:null,callback_exit:null,callback_applied:null,callback_loading:null,callback_loaded:null,callback_error:null,callback_finish:null,callback_cancel:null,use_native:!1,restore_on_error:!1},c=function(t){return n({},r,t)},l=function(n,t){var e,i="LazyLoad::Initialized",o=new n(t);try{e=new CustomEvent(i,{detail:{instance:o}})}catch(n){(e=document.createEvent("CustomEvent")).initCustomEvent(i,!1,!1,{instance:o})}window.dispatchEvent(e)},u="src",s="srcset",d="sizes",f="poster",_="llOriginalAttrs",g="data",v="loading",b="loaded",m="applied",p="error",h="native",E="data-",I="ll-status",y=function(n,t){return n.getAttribute(E+t)},k=function(n){return y(n,I)},w=function(n,t){return function(n,t,e){var i="data-ll-status";null!==e?n.setAttribute(i,e):n.removeAttribute(i)}(n,0,t)},A=function(n){return w(n,null)},L=function(n){return null===k(n)},O=function(n){return k(n)===h},x=[v,b,m,p],C=function(n,t,e,i){n&&(void 0===i?void 0===e?n(t):n(t,e):n(t,e,i))},N=function(n,t){o?n.classList.add(t):n.className+=(n.className?" ":"")+t},M=function(n,t){o?n.classList.remove(t):n.className=n.className.replace(new RegExp("(^|\\s+)"+t+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")},z=function(n){return n.llTempImage},T=function(n,t){if(t){var e=t._observer;e&&e.unobserve(n)}},R=function(n,t){n&&(n.loadingCount+=t)},G=function(n,t){n&&(n.toLoadCount=t)},j=function(n){for(var t,e=[],i=0;t=n.children[i];i+=1)"SOURCE"===t.tagName&&e.push(t);return e},D=function(n,t){var e=n.parentNode;e&&"PICTURE"===e.tagName&&j(e).forEach(t)},H=function(n,t){j(n).forEach(t)},V=[u],F=[u,f],B=[u,s,d],J=[g],P=function(n){return!!n[_]},S=function(n){return n[_]},U=function(n){return delete n[_]},$=function(n,t){if(!P(n)){var e={};t.forEach((function(t){e[t]=n.getAttribute(t)})),n[_]=e}},q=function(n,t){if(P(n)){var e=S(n);t.forEach((function(t){!function(n,t,e){e?n.setAttribute(t,e):n.removeAttribute(t)}(n,t,e[t])}))}},K=function(n,t,e){N(n,t.class_applied),w(n,m),e&&(t.unobserve_completed&&T(n,t),C(t.callback_applied,n,e))},Q=function(n,t,e){N(n,t.class_loading),w(n,v),e&&(R(e,1),C(t.callback_loading,n,e))},W=function(n,t,e){e&&n.setAttribute(t,e)},X=function(n,t){W(n,d,y(n,t.data_sizes)),W(n,s,y(n,t.data_srcset)),W(n,u,y(n,t.data_src))},Y={IMG:function(n,t){D(n,(function(n){$(n,B),X(n,t)})),$(n,B),X(n,t)},IFRAME:function(n,t){$(n,V),W(n,u,y(n,t.data_src))},VIDEO:function(n,t){H(n,(function(n){$(n,V),W(n,u,y(n,t.data_src))})),$(n,F),W(n,f,y(n,t.data_poster)),W(n,u,y(n,t.data_src)),n.load()},OBJECT:function(n,t){$(n,J),W(n,g,y(n,t.data_src))}},Z=["IMG","IFRAME","VIDEO","OBJECT"],nn=function(n,t){!t||function(n){return n.loadingCount>0}(t)||function(n){return n.toLoadCount>0}(t)||C(n.callback_finish,t)},tn=function(n,t,e){n.addEventListener(t,e),n.llEvLisnrs[t]=e},en=function(n,t,e){n.removeEventListener(t,e)},on=function(n){return!!n.llEvLisnrs},an=function(n){if(on(n)){var t=n.llEvLisnrs;for(var e in t){var i=t[e];en(n,e,i)}delete n.llEvLisnrs}},rn=function(n,t,e){!function(n){delete n.llTempImage}(n),R(e,-1),function(n){n&&(n.toLoadCount-=1)}(e),M(n,t.class_loading),t.unobserve_completed&&T(n,e)},cn=function(n,t,e){var i=z(n)||n;on(i)||function(n,t,e){on(n)||(n.llEvLisnrs={});var i="VIDEO"===n.tagName?"loadeddata":"load";tn(n,i,t),tn(n,"error",e)}(i,(function(o){!function(n,t,e,i){var o=O(t);rn(t,e,i),N(t,e.class_loaded),w(t,b),C(e.callback_loaded,t,i),o||nn(e,i)}(0,n,t,e),an(i)}),(function(o){!function(n,t,e,i){var o=O(t);rn(t,e,i),N(t,e.class_error),w(t,p),C(e.callback_error,t,i),e.restore_on_error&&q(t,B),o||nn(e,i)}(0,n,t,e),an(i)}))},ln=function(n,t,e){!function(n){return Z.indexOf(n.tagName)>-1}(n)?function(n,t,e){!function(n){n.llTempImage=document.createElement("IMG")}(n),cn(n,t,e),function(n){P(n)||(n[_]={backgroundImage:n.style.backgroundImage})}(n),function(n,t,e){var i=y(n,t.data_bg),o=y(n,t.data_bg_hidpi),r=a&&o?o:i;r&&(n.style.backgroundImage='url("'.concat(r,'")'),z(n).setAttribute(u,r),Q(n,t,e))}(n,t,e),function(n,t,e){var i=y(n,t.data_bg_multi),o=y(n,t.data_bg_multi_hidpi),r=a&&o?o:i;r&&(n.style.backgroundImage=r,K(n,t,e))}(n,t,e),function(n,t,e){var i=y(n,t.data_bg_set);if(i){var o=i.split("|"),a=o.map((function(n){return"image-set(".concat(n,")")}));n.style.backgroundImage=a.join(),""===n.style.backgroundImage&&(a=o.map((function(n){return"-webkit-image-set(".concat(n,")")})),n.style.backgroundImage=a.join()),K(n,t,e)}}(n,t,e)}(n,t,e):function(n,t,e){cn(n,t,e),function(n,t,e){var i=Y[n.tagName];i&&(i(n,t),Q(n,t,e))}(n,t,e)}(n,t,e)},un=function(n){n.removeAttribute(u),n.removeAttribute(s),n.removeAttribute(d)},sn=function(n){D(n,(function(n){q(n,B)})),q(n,B)},dn={IMG:sn,IFRAME:function(n){q(n,V)},VIDEO:function(n){H(n,(function(n){q(n,V)})),q(n,F),n.load()},OBJECT:function(n){q(n,J)}},fn=function(n,t){(function(n){var t=dn[n.tagName];t?t(n):function(n){if(P(n)){var t=S(n);n.style.backgroundImage=t.backgroundImage}}(n)})(n),function(n,t){L(n)||O(n)||(M(n,t.class_entered),M(n,t.class_exited),M(n,t.class_applied),M(n,t.class_loading),M(n,t.class_loaded),M(n,t.class_error))}(n,t),A(n),U(n)},_n=["IMG","IFRAME","VIDEO"],gn=function(n){return n.use_native&&"loading"in HTMLImageElement.prototype},vn=function(n,t,e){n.forEach((function(n){return function(n){return n.isIntersecting||n.intersectionRatio>0}(n)?function(n,t,e,i){var o=function(n){return x.indexOf(k(n))>=0}(n);w(n,"entered"),N(n,e.class_entered),M(n,e.class_exited),function(n,t,e){t.unobserve_entered&&T(n,e)}(n,e,i),C(e.callback_enter,n,t,i),o||ln(n,e,i)}(n.target,n,t,e):function(n,t,e,i){L(n)||(N(n,e.class_exited),function(n,t,e,i){e.cancel_on_exit&&function(n){return k(n)===v}(n)&&"IMG"===n.tagName&&(an(n),function(n){D(n,(function(n){un(n)})),un(n)}(n),sn(n),M(n,e.class_loading),R(i,-1),A(n),C(e.callback_cancel,n,t,i))}(n,t,e,i),C(e.callback_exit,n,t,i))}(n.target,n,t,e)}))},bn=function(n){return Array.prototype.slice.call(n)},mn=function(n){return n.container.querySelectorAll(n.elements_selector)},pn=function(n){return function(n){return k(n)===p}(n)},hn=function(n,t){return function(n){return bn(n).filter(L)}(n||mn(t))},En=function(n,e){var o=c(n);this._settings=o,this.loadingCount=0,function(n,t){i&&!gn(n)&&(t._observer=new IntersectionObserver((function(e){vn(e,n,t)}),function(n){return{root:n.container===document?null:n.container,rootMargin:n.thresholds||n.threshold+"px"}}(n)))}(o,this),function(n,e){t&&(e._onlineHandler=function(){!function(n,t){var e;(e=mn(n),bn(e).filter(pn)).forEach((function(t){M(t,n.class_error),A(t)})),t.update()}(n,e)},window.addEventListener("online",e._onlineHandler))}(o,this),this.update(e)};return En.prototype={update:function(n){var t,o,a=this._settings,r=hn(n,a);G(this,r.length),!e&&i?gn(a)?function(n,t,e){n.forEach((function(n){-1!==_n.indexOf(n.tagName)&&function(n,t,e){n.setAttribute("loading","lazy"),cn(n,t,e),function(n,t){var e=Y[n.tagName];e&&e(n,t)}(n,t),w(n,h)}(n,t,e)})),G(e,0)}(r,a,this):(o=r,function(n){n.disconnect()}(t=this._observer),function(n,t){t.forEach((function(t){n.observe(t)}))}(t,o)):this.loadAll(r)},destroy:function(){this._observer&&this._observer.disconnect(),t&&window.removeEventListener("online",this._onlineHandler),mn(this._settings).forEach((function(n){U(n)})),delete this._observer,delete this._settings,delete this._onlineHandler,delete this.loadingCount,delete this.toLoadCount},loadAll:function(n){var t=this,e=this._settings;hn(n,e).forEach((function(n){T(n,t),ln(n,e,t)}))},restoreAll:function(){var n=this._settings;mn(n).forEach((function(t){fn(t,n)}))}},En.load=function(n,t){var e=c(t);ln(n,e)},En.resetStatus=function(n){A(n)},t&&function(n,t){if(t)if(t.length)for(var e,i=0;e=t[i];i+=1)l(n,e);else l(n,t)}(En,window.lazyLoadOptions),En}));

    let statusDefault = {
        autoPage: false,
        copyBtn :true,
        toolBar: true,
        avInfo:true,
        halfImg:false,
        fullTitle:false,
        waterfallWidth:100,
        columnNumFull:3,
        columnNumHalf:4,
        menutoTop : false
    };
    const SCREENSHOT_SUFFIX = "-screenshot-tag";
    const AVINFO_SUFFIX = "-avInfo-tag";
    const blogjavSelector= "h2.entry-title>a";
    const fullImgCSS=`width: 100%!important;height:100%!important;`;
    const halfImgCSS=`position: relative;left: -112%;width: 212% !important;height: 100% !important;max-width: 212%;`;

    const copy_Svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"  width="16" height="16" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></svg>`;
    const download_Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="tool-svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/></svg>`;
    const picture_Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  class="tool-svg" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>`;
    const magnet_Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  class="tool-svg" x="0px" y="0px" viewBox="0 0 1000 1000" ><g><g transform="translate(0.000000,460.000000) scale(0.100000,-0.100000)"><path d="M4171.6,3994c-183.9-13.4-515.3-67.1-706.9-113c-770.2-187.7-1448.4-563.3-2021.2-1118.8c-707-685.9-1130.3-1494.4-1299-2481c-59.4-358.3-59.4-1002,0-1360.2c157.1-923.4,546-1705.1,1172.5-2354.6c695.4-722.3,1534.6-1159.1,2548.1-1325.7c174.4-28.7,388.9-34.5,1643.8-40.2l1440.7-7.7v1302.8v1302.8l-1354.5,7.6c-1207,5.7-1369.8,9.6-1480.9,40.2c-448.3,116.9-785.5,335.3-1036.5,666.7c-252.9,339.1-364,666.7-364,1088.2s111.1,749.1,364,1088.2c241.4,318,595.8,551.8,1000.1,659.1c157.1,40.2,191.6,42.1,1517.3,47.9l1354.5,7.7v1302.8v1300.9l-1344.9-3.8C4863.3,4001.6,4219.5,3997.8,4171.6,3994z"/><path d="M7620.1,2704.6V1401.8h1139.9H9900v1302.8v1302.8H8760.1H7620.1V2704.6z"/><path d="M7620.1-3502.7v-1302.8h1139.9H9900v1302.8v1302.8H8760.1H7620.1V-3502.7z"/></g></g></svg>`;

    const LOCALE = {
       
        en: {
            menuText :'Settings',
            menu_autoPage:'auto Next Page',
            menu_copyBtn:'copy icon',
            menu_toolBar:'tools icon',
            menu_avInfo:'actors and sample images in pop-ups',
            menu_halfImg:'Vertical image mode',
            menu_fullTitle:'Full Title',
            menu_columnNum:'columns',
            menu_menutoTop:'Move the left menu to the top',
            copyButton:'Copy',
            copySuccess:'Copy successful',
            getAvImg_norespond:'blogjav.net is temporarily unable to respond',
            getAvImg_none:'Not found',
            tool_magnetTip:'Magnet',
            tool_downloadTip:'Download cover',
            tool_pictureTip:'Video screenshot from blogjav.net',
            scrollerPlugin_end:'End'
        }
    }
    let getlanguage = () => {
        let local= navigator.language;
        local = local.toLowerCase().replace('_', '-');
        if (local in LOCALE){
            return LOCALE[local];
        }else if (local.split('-')[0] in LOCALE){
            return LOCALE[local.split('-')[0]];
        }else {
            return LOCALE.en;
        }
    }
    let lang = getlanguage();

    
    let showAlert = (msg,close) => {
        let $alert=$(`<div  class="alert-zdy" >${msg}</div>`);
        if(close){
            let $close = $(`<div style="display: inline-block;padding: 0 10px;cursor: pointer;">X</div>`);
            $alert.append($close);
            $close.on("click",()=>$alert.hide());
        }
        $('body').append($alert);
        $alert.show({start:function(){
            $(this).css({'margin-top': -$(this).height() / 2  ,'margin-left': -$(this).width() / 2 });
        }});
        if(!close){$alert.delay(3000).fadeOut()};
    }

    
    let imgCallback =  (img)=> {
        if (Status.isHalfImg()) {
            if(img.height < img.width){
                img.style= halfImgCSS ;
            }else{
                img.style= fullImgCSS ;
            }
        }else{
            
            if(img.height/img.width>=0.7){
                img.style= `width:${img.width*67.25/img.height}%;` ;
            }else{
                img.style= fullImgCSS ;
            }
        }
    }

    let Status = {
        halfImg_block:false,
        set : function(key,value){
            if(key=="columnNum") {
                key=key+(this.isHalfImg()?"Half":"Full");
            }else if(key=="waterfallWidth"){
                key=key+"_"+currentWeb;
            }
            return GM_setValue(key, value);
        },
        get : function(key){
            return GM_getValue(key=="waterfallWidth"?(key+"_"+currentWeb):key, statusDefault[key]);
        },
        
        isHalfImg: function () {
            return this.get("halfImg") && (!this.halfImg_block);
        },
        
        getColumnNum: function () {
            var key= 'columnNum'+(this.isHalfImg()?"Half":"Full");
            return this.get(key);
        }
    };
    
    class Popover{
        show(){
            document.documentElement.classList.add("scrollBarHide");
            this.element.show({duration:0,start:function(){
                var t=$(this).find('#modal-div');
                t.css({'margin-top': Math.max(0, ($(window).height() - t.height()) / 2) });
            }});
        }
        hide(){
            document.documentElement.classList.remove("scrollBarHide");
            this.element.hide();
            this.element.find('.pop-up-tag').hide();
        }
        init(){
            var me=this;
            me.element = $('<div  id="myModal"><div  id="modal-div" > </div></div>');
            me.element.on('click',function(e){
                if($(e.target).closest("#modal-div").length==0){
                    me.hide();
                }
            });
            me.scrollBarWidth = me.getScrollBarWidth();
            GM_addStyle('.scrollBarHide{ padding-right: ' + me.scrollBarWidth + 'px;overflow:hidden;}');
            $('body').append(me.element);
            
            if(currentWeb=="javbus"){
                me.element.magnificPopup({
                    delegate: 'a.sample-box-zdy:visible',
                    type: 'image',
                    closeOnContentClick: false,
                    closeBtnInside: false,
                    mainClass: 'mfp-with-zoom mfp-img-mobile',
                    image: {verticalFit: true},
                    gallery: { enabled: true},
                    zoom: {enabled: true,duration: 300,opener: function (element) {return element.find('img');}}
                });
            }
        }
        append(elem){
            if(!this.element){ this.init();}
            this.element.find("#modal-div").append(elem);
            return this;
        }
        
        getScrollBarWidth() {
            var el = document.createElement("p");
            var styles = {width: "100px",height: "100px",overflowY: "scroll" };
            for (var i in styles) {
                el.style[i] = styles[i];
            }
            document.body.appendChild(el);
            var scrollBarWidth = el.offsetWidth - el.clientWidth;
            el.remove();
            return scrollBarWidth;
        }
    }
    class SettingMenu {
        onChange = {
            autoPage: function() {
                if (scroller) {
                    scroller.destroy();scroller = null;
                } else {
                    scroller = new ScrollerPlugin($('#grid-b'), lazyLoad);
                }
            },
            copyBtn: function() {
                $("#grid-b .copy-span").toggle();
            },
            toolBar: function() {
                $("#grid-b .toolbar-b").toggle();
            },
            halfImg: function() {
                let me = this;
                $("#grid-b .box-b img.loaded").each(function(index, el) {
                    imgCallback(el);
                });
                var columnNum = Status.getColumnNum();
                GM_addStyle(`#grid-b .item-b{ width: ${100/columnNum}%;}`);
                $("#columnNum_range").val(columnNum);
                $("#columnNum_range+span").text(columnNum);
            },
            fullTitle: function() {
                $("#grid-b a[name='av-title']").toggleClass("titleNowrap");
            },
            avInfo: function() {},
            menutoTop : function() {location.reload();},
            columnNum: function(columnNum) {
                GM_addStyle(`#grid-b .item-b{ width: ${100/columnNum}%;}`);
            },
            waterfallWidth: function(width) {
                $(currentObj.widthSelector).css({"width":`${width}%`,"margin": `0 ${width>100?(100-width)/2+"%":"auto"}`});
            }
        }
        constructor() {
            let columnNum = Status.getColumnNum();
            let $menu = $('<div  id="menu-div" ></div>');
            $menu.append(this.creatCheckbox("autoPage", lang.menu_autoPage));
            $menu.append(this.creatCheckbox("copyBtn", lang.menu_copyBtn));
            $menu.append(this.creatCheckbox("toolBar", lang.menu_toolBar));
            $menu.append(this.creatCheckbox("halfImg", lang.menu_halfImg, Status.halfImg_block));
            $menu.append(this.creatCheckbox("fullTitle", lang.menu_fullTitle));
            if (["javbus", "javdb"].includes(currentWeb)) {
                $menu.append(this.creatCheckbox("avInfo", lang.menu_avInfo));
            }
            if (currentWeb == 'javlibrary') {
                $menu.append(this.creatCheckbox("menutoTop", lang.menu_menutoTop));
            }
            $menu.append(this.creatRange("columnNum", lang.menu_columnNum, columnNum, 8));
            $menu.append(this.creatRange("waterfallWidth", '%', Status.get("waterfallWidth") , currentObj.maxWidth ? currentObj.maxWidth : 100));
            let $circle = $(`<div style="position: ${currentWeb=="javlibrary"?"absolute":"fixed"};z-index: 1030;left:0;top:${currentWeb=="javlibrary"?"36px":"0px"};"><div style="width: 40px;height: 40px;background-color: rgb(208 176 176 / 90%);border-radius: 20px;"></div></div>`);
            $circle.append($menu);
            $circle.mouseenter(() => $menu.show()).mouseleave(() => $menu.hide());
            $("body").append($circle);
            if(!Status.get("notice")){
                $menu.slideDown();Status.set("notice",true);
            }
        }
        creatCheckbox(tagName, name, disabled) {
            let me =this;
            let $checkbox = $(`<div class="switch-div"><input ${disabled?'disabled="disabled"':''} type="checkbox" id="${tagName}_checkbox" /><label  for="${tagName}_checkbox" >${name}</label></div>`);
            $checkbox.find("input")[0].checked = Status.get(tagName);
            $checkbox.find("input").eq(0).click(function() {
                Status.set(tagName, this.checked);
                me.onChange[tagName]();
            });
            return $checkbox;
        }
        creatRange(tagName, name, value, max) {
            let me =this;
            let $range = $(`<div  class="range-div"><input type="range" id="${tagName}_range"  min="1" max="${max}" step="1" value="${value}"  /><span name="value">${value}</span><span>${name}</span></div>`);
            $range.bind('input propertychange', function() {
                var val = $(this).find("input").eq(0).val();
                $(this).find("span[name=value]").html(val);
                Status.set(tagName, val);
                me.onChange[tagName](val);
            });
            return $range;
        }
    }

    function showMagnetTable(itemID,avid,href,elem) {
        if ($(elem).hasClass("span-loading")) {return;}
        let tagName = `${itemID}${AVINFO_SUFFIX}`;
        let $el=$(`.pop-up-tag[name='${tagName}']`);
        if ($el.length > 0) {
            $el.show();myModal.show();
        } else {
            $(elem).addClass("span-loading");
            Promise.resolve().then(()=>{
                switch(currentWeb) {
                    case "javbus": {
                        return getMagnet4JavBus(href,tagName)
                    }
                    case "javdb": {
                        return getMagnet4JavDB(href,tagName,itemID)
                    }
                }
            }).then((dom)=>{
                myModal.append(dom).show();
            }).catch(err=>alert(err)).then(()=>$(elem).removeClass("span-loading"));
        }
    }
    
async function getMagnet4JavDB(href, tagName, itemID) {
    let doc = await fetch(href).then(response => response.text());
    let $doc = $($.parseHTML(doc));
    let info = $(`<div class="pop-up-tag" name="${tagName}"></div>`);
    if (Status.get("avInfo")) {
        let actors = $doc.find("div.video-meta-panel .panel-block").toArray().find(el => $(el).find("a[href^='/actors/']").length > 0);
        $(actors).find("a").attr("target", "_blank");
        let preview_images = $doc.find(".columns").toArray().find(el => $(el).find("div.tile-images.preview-images").length > 0);
        let $preview_images = $(preview_images);
        $preview_images.find(".preview-video-container").attr("href", `#preview-video-${itemID}`);
        $preview_images.find("#preview-video").attr("id", `preview-video-${itemID}`);
        $preview_images.find("img[data-src]").each((i, el) => $(el).attr("src", $(el).attr("data-src")));
        info.append(actors);
        info.append(preview_images);
    }
    let magnetTable = $doc.find(`div.columns[data-controller="movie-tab"]`);
    magnetTable.find("div.top-meta").remove(); 
    info.append(magnetTable);



    return info;

    };
    
    async function getMagnet4JavBus(href, tagName) {
        let {gid,dom} = await avInfofetch(href,tagName);
        
        let uc_code = location.pathname.search(/(uncensored|mod=uc)/) < 1 ? 0 : 1;
        let url = `${location.protocol}//${location.hostname}/ajax/uncledatoolsbyajax.php?gid=${gid}&lang=zh&img=&uc=${uc_code}&floor=` + Math.floor(Math.random() * 1e3 + 1);
        let doc = await fetch(url).then(response => response.text());
        let table_html = doc.substring(0, doc.indexOf('<script')).trim();
        let table_tag = $(`<table class="table pop-up-tag" name="${tagName}" style="background-color:#FFFFFF;" ></table>`);
        table_tag.append($(table_html));
        table_tag.find("tr").each(function (i) { 
            let $a = $(this).find('a');
            if ($a.length) {
               let magent_url = $a[0].href;
               $(this).prepend(creatCopybutton(magent_url));
            }
        });
        dom.push(table_tag);
        return dom;
    };
    


function creatCopybutton(text) {
  let $copyButton = $(`<td><button class="center-block">${lang.copyButton}</button></td>`);
 
  let $authButton = createAuthorizationButton();

  $copyButton.find("button").click(function () {
    GM_setClipboard(text);
    showAlert(lang.copySuccess);
  });


  return [$copyButton];
}




   
    async function avInfofetch(href,tagName) {
        let doc = await fetch(href).then(response => response.text())
        let str = /var\s+gid\s+=\s+(\d{1,})/.exec(doc);
        let avInfo = {gid:str[1],dom:[]};
        if(Status.get("avInfo")){
            let sample_waterfall = $($.parseHTML(doc)).find("#sample-waterfall");
            let avatar_waterfall = $($.parseHTML(doc)).find("#avatar-waterfall");
            if(avatar_waterfall.length>0){
                avatar_waterfall[0].id = "";
                avatar_waterfall.addClass("pop-up-tag");
                avatar_waterfall.attr("name",tagName);
                avatar_waterfall.find("a.avatar-box span").each((i,el)=> {
                    let $copySvg = $(`<div style="width:24px;height:24px;display: flex;align-items: center;justify-content: center;">${copy_Svg}</div>`);
                    $copySvg.click(function () {
                        GM_setClipboard($(el).text());
                        showAlert(lang.copySuccess);
                        return false;
                    });
                    $(el).prepend($copySvg);
                });
                avatar_waterfall.find("a.avatar-box").attr("target","_blank").removeClass("avatar-box").addClass("avatar-box-zdy");
                avInfo.dom.push(avatar_waterfall);
            }
            if(sample_waterfall.length>0){
                sample_waterfall[0].id = "";
                sample_waterfall.addClass("pop-up-tag");
                sample_waterfall.attr("name",tagName);
                sample_waterfall.find(".sample-box").removeClass("sample-box").addClass("sample-box-zdy");
                avInfo.dom.push(sample_waterfall);
            }
        }
        return avInfo;
    };

   
    function showBigImg(itemID,avid,elem) {
        if ($(elem).hasClass("span-loading")) {return;}
        let tagName = `${itemID}${SCREENSHOT_SUFFIX}`;
        let $selector = $(`.pop-up-tag[name='${tagName}']`);
        if ($selector.length > 0) {
            $selector.show();
            myModal.show();
        } else {
            $(elem).addClass("span-loading");
            getAvImg(avid,tagName).then(($img)=>{
                myModal.append($img).show();
            }).catch(err=>err && showAlert(err)).then(()=>{
                $(elem).removeClass("span-loading");
            });
        }
    }
    const getRequest = (url) => {
        return new Promise((resolve, reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 20000,
                onload: (r)=>resolve(r),
                onerror : (r)=> reject(`error`),
                ontimeout : (r)=> reject(`timeout`)
            });
        })
    }
    //
    async function getAvImg(avid,tagName) {
        const r = await getRequest(`https://blogjav.net/?s=${avid}`);
        if(r.status == 503){
            showAlert(`blogjav.net has an anti-attack mechanism, <a target="_blank" href="https://blogjav.net">Click to jump</a> to release `,`close`);
            return Promise.reject();
        }else if(r.status != 200){
            return Promise.reject(lang.getAvImg_norespond);
        }
        let resultList = $($.parseHTML(r.responseText)).find(blogjavSelector).toArray().map((v)=> {return {title:v.innerHTML,href:v.href} });
        if(resultList.length==0) {
           return Promise.reject(lang.getAvImg_none);
        }
        let $img = new ScreenshotPanel(tagName,resultList,avid);
        let findIndex = resultList.findIndex(v=> v.title.search(/FHD/i)>0);
        let index_show = findIndex>-1?findIndex:0;
        $img.find(`li.imgResult-li[index=${index_show}]`).trigger('click');
        return $img;
    };
    class ScreenshotPanel{
        constructor(tagName,resultList,avid){
            let me =this;
            let $img = $(`<div name="${tagName}" class="pop-up-tag" style="min-height:${$(window).height()}px;">
                        <ul style="${resultList.length==1?'display:none':''}">
                        ${resultList.map((v,i)=>`<li class="imgResult-li" index=${i} data="${v.href}">${v.title}</li>`).join('')}</ul>
                        <span class="download-icon" >${download_Svg}</span>
                        ${resultList.map((v,i)=>`<img index=${i}  name="screenshot" style="display:none;width:100%" />`).join('')}
                        </div>`);
            $img.find("li.imgResult-li").click(function(){
                if ($(this).hasClass("imgResult-loading")) {return;}
                let index_to = $(this).attr('index');
                let index_from =  $img.find("img:visible").attr(`index`);
                if( index_to != index_from){
                    $img.find("li.imgResult-li.imgResult-Current").removeClass('imgResult-Current');
                    $(this).addClass(`imgResult-loading`).addClass("imgResult-Current");
                    $img.find("img").hide();
                    let $img_to = $img.find(`img[index=${index_to}]`);
                    $img_to.show();
                    Promise.resolve().then(()=>{
                        if($img_to.attr(`src`)){
                            return true;
                        }else{
                            return me.getScreenshotUrl($(this).attr('data')).then((r)=>{
                                $img_to.attr(`src`,r);
                            });
                        }
                    }).catch((err)=>{showAlert(err)}).then((r)=>{$(this).removeClass(`imgResult-loading`);});
                }
            })
            $img.find("span.download-icon").click(function(){
                if ($(this).hasClass("span-loading")) {return;}
                $(this).addClass("span-loading");
                Promise.resolve({
                    then :(resolve,reject)=>{
                        GM_download({
                            url :$img.find("img:visible").attr(`src`),
                            name: `${avid || "screenshot"}.jpg`,
                            onerror  :r => reject("error"),
                            ontimeout :r => reject("timeout"),
                            onload :() => resolve()
                        });
                    }
                }).catch(err=>err && showAlert(err)).then(()=>$(this).removeClass("span-loading"));
            });
            return $img;
        }
        async getScreenshotUrl(imgUrl){
            const result = await getRequest(imgUrl);
            let img_src = /<noscript>.*src="(.*pixhost.to\/thumbs[\S]+)".*<\/noscript>/.exec(result.responseText);
            let src = img_src[1].replace('thumbs', 'images').replace('//t', '//img').replace('"', '');
            console.log(src);
            return src;
        }
    }

    let lazyLoad;
    let scroller;
    let myModal;//
    let currentWeb = "javbus";
    let currentObj ;//
   
    let ConstCode = {
        javbus: {
            domainReg: /(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\./i,
            excludePages: ['/actresses', 'mdl=favor&sort=1', 'mdl=favor&sort=2', 'mdl=favor&sort=3', 'mdl=favor&sort=4', 'searchstar'],
            halfImg_block_Pages:['/uncensored','javbus.one','mod=uc','javbus.red'],
            gridSelector: 'div#waterfall',
            itemSelector: 'div#waterfall div.item',
            widthSelector : '#grid-b',
            pageNext:'a#next',
            pageSelector:'.pagination',
            getAvItem: function (elem) {
                var photoDiv = elem.find("div.photo-frame")[0];
                var href = elem.find("a")[0].href;
                var img = $(photoDiv).children("img")[0];
                var src = img.src;
                if (src.match(/pics.dmm.co.jp/)) {
                    src = src.replace(/ps.jpg/, "pl.jpg");
                } else {
                    src = src.replace(/thumbs/, "cover").replace(/thumb/, "cover").replace(/.jpg/, "_b.jpg");
                }
                var title = img.title;
                var AVID = elem.find("date").eq(0).text();
                var date = elem.find("date").eq(1).text();
                var itemTag = "";elem.find("div.photo-info .btn").toArray().forEach( x=> itemTag+=x.outerHTML);
                return {AVID,href,src,title,date,itemTag};
            }
        },
        javdb: {
            domainReg: /(javdb)[0-9]*\./i,
            excludePages: ['/users/'],
            halfImg_block_Pages:['/uncensored','/western','/video_uncensored','/video_western'],
            gridSelector: 'div.movie-list.h',
            itemSelector: 'div.movie-list.h>div.item',
            widthSelector : '#grid-b',
            pageNext: 'a.pagination-next',
            pageSelector:'.pagination-list',
            init_Style: function(){
                GM_addStyle(`#grid-b .info-bottom-two{flex-grow:1}
                [data-theme=light] .pop-up-tag[name$='${AVINFO_SUFFIX}'] {background-color: rgb(255 255 255 / 90%);}
                [data-theme=dark] .scroll-request span{background:white;}
                [data-theme=dark] #grid-b .box-b a:link {color : inherit;}
                [data-theme=dark] #grid-b  .box-b{background-color:#222;}
                [data-theme=dark] .alert-zdy {color: black;background-color: rgb(255 255 255 / 90%);}
                #myModal #modal-div article.message {margin-bottom: 0}`);
            },
            maxWidth: 150,//
            getAvItem: function (elem) {
                var href = elem.find("a")[0].href;
                var src = elem.find("div.cover>img").eq(0).attr("src");
                var title = elem.find("a")[0].title;
                var AVID = elem.find("div.video-title>strong").eq(0).text();
                var date = elem.find("div.meta").eq(0).text();
                var score = elem.find("div.score").html();
                var itemTag = elem.find(".tags.has-addons").html();
                return {AVID,href,src,title,date,itemTag,score};
            }
            //init: function(){ if(location.href.includes("/users/")){ this.widthSelector="div.section";} }
        },
        avmoo: {
            domainReg: /avmoo\./i,
            excludePages: ['/actresses'],
            gridSelector: 'div#waterfall',
            itemSelector: 'div#waterfall div.item',
            widthSelector : '#grid-b',
            pageNext: 'a[name="nextpage"]',
            pageSelector:'.pagination',
            getAvItem: function (elem) {
                var photoDiv = elem.find("div.photo-frame")[0];
                var href = elem.find("a")[0].href;
                var img = $(photoDiv).children("img")[0];
                var src = img.src.replace(/ps.jpg/, "pl.jpg");
                var title = img.title;
                var AVID = elem.find("date").eq(0).text();
                var date = elem.find("date").eq(1).text();
                var itemTag = "";elem.find("div.photo-info .btn").toArray().forEach( x=> itemTag+=x.outerHTML);
                return {AVID,href,src,title,date,itemTag};
            }
        },
        javlibrary: {
            domainReg: /javlibrary\./i,
            gridSelector: 'div.videothumblist',
            itemSelector: 'div.videos div.video',
            widthSelector : '#grid-b',
            pageNext: 'a.page.next',
            pageSelector:'.page_selector',
            getAvItem: function (elem) {
                var href = elem.find("a")[0].href;
                var src = elem.find("img")[0].src;
                if(src.indexOf("pixhost")<0){//
                    src= src.replace(/ps.jpg/, "pl.jpg");
                }
                var title = elem.find("div.title").eq(0).text();
                var AVID = elem.find("div.id").eq(0).text();
                return {AVID,href,src,title,date: '',itemTag:''};
            },
            init_Style: function(){
                GM_addStyle(`${Status.get("menutoTop")?`
                #leftmenu {width : 100%;float: none;}
                #leftmenu>table { display : none;}
                #leftmenu .menul1,#leftmenu .menul1>ul{display: flex;align-items: center;justify-content: center;flex-wrap: wrap;}
                #leftmenu .menul1{padding: 5px;}
                #rightcolumn{margin: 0 5px;padding : 10px 5px;}`:``}
                #grid-b div{box-sizing: border-box;}`);
            },
        }
    };

    
    function oldDriverBlock(){
        if(['javbus','avmoo'].includes(currentWeb)){ //
            if ($('.masonry').length > 0) {
                $('.masonry').removeClass("masonry");
            }
            let $waterfall = $('#waterfall');
            if($waterfall.length){
                $waterfall.get(0).id = "waterfall-destroy";
            }
            if($waterfall.find("#waterfall").length){ //j
                $waterfall.find("#waterfall").get(0).id = "";
            }
           
            if ($('#waterfall_h.row').length > 0) {
                $('#waterfall_h.row').removeAttr("id");
            }
            let $waterfall_h= $('#waterfall_h');
            if ($waterfall_h.length) {
                $waterfall_h.get(0).id = "waterfall-destroy";
            }
            if(location.pathname.search(/search/) > 0){//
                $('body').append('<div id="waterfall"></div>');
            }
            currentObj.gridSelector = "#waterfall-destroy";
        }
        if(['javlibrary'].includes(currentWeb)){ //
            let $waterfall = $('div.videothumblist');
            if($waterfall.length){
                $waterfall.removeClass("videothumblist");
                $waterfall.find(".videos").removeClass("videos");
                $waterfall.get(0).id = "waterfall-destroy";
            }
            currentObj.gridSelector = "#waterfall-destroy";
        }
    }
    class Page{
         constructor(){
            for (let key in ConstCode) {
                let domainReg = ConstCode[key].domainReg;
                if (domainReg && domainReg.test(location.href)) {
                    currentWeb = key;//
                    break;
                }
            }
            currentObj = ConstCode[currentWeb];
           
            if (currentObj.excludePages) {
                for (let page of currentObj.excludePages) {
                    if (location.pathname.includes(page)) return;
                }
            }
            
            if (currentObj.halfImg_block_Pages) {
                for (let blockPage of currentObj.halfImg_block_Pages) {
                    if (location.href.includes(blockPage)) {
                        Status.halfImg_block = true;
                        break;
                    };
                }
            }
            this.render();
         }
         render(){
            let $items = $(currentObj.itemSelector);
            if ($items.length<1) return;
            oldDriverBlock();
            addStyle();
            currentObj.init_Style?.();
            let menu = new SettingMenu();
           
            lazyLoad = new LazyLoad({
                callback_loaded: function (img) {
                    $(img).removeClass("minHeight-200");
                    imgCallback(img);
                }
            });
            let gridPanel = new GridPanel($items,lazyLoad);
            myModal = new Popover();//
            if(Status.get("autoPage") && $(currentObj.pageSelector).length ){
                scroller=new ScrollerPlugin(gridPanel.$dom,lazyLoad);
            }
         }
    }
    class GridPanel{
        constructor($items,lazyLoad){
            this.$dom=$(`<div id= 'grid-b'></div>`);
            $(currentObj.gridSelector).hide().eq(0).before(this.$dom);
            let $elems = this.constructor.parseItems($items);
            this.$dom.append($elems);
            lazyLoad.update();
        }
        static parseItems(elems){
            let elemsHtml = "";
            let {imgStyle,getAvItem,toolBar,copyBtn,fullTitle,magnet,magnetTip,downloadTip,pictureTip} = {
                imgStyle: Status.isHalfImg() ? halfImgCSS : fullImgCSS,
                getAvItem: currentObj.getAvItem,
                toolBar: Status.get("toolBar")?'':'hidden-b',
                copyBtn: Status.get("copyBtn")?'':'hidden-b',
                fullTitle: Status.get("fullTitle")?'':'titleNowrap',
                magnet: ['javbus','javdb'].includes(currentWeb)?'':'hidden-b',
                magnetTip : lang.tool_magnetTip,
                downloadTip: lang.tool_downloadTip,
                pictureTip: lang.tool_pictureTip,
            };
            for (let i = 0; i < elems.length; i++) {
                let tag = elems.eq(i);
                let html = "";
                
                if (currentWeb!="javdb" && tag.find(".avatar-box").length) {
                    tag.find(".avatar-box").addClass("avatar-box-b").removeClass("avatar-box");
                    html = `<div class='item-b'>${tag.html()}</div>`;
                }else{
                    let AvItem = getAvItem(tag);
                    html = `<div class="item-b">
                                <div class="box-b">
                                <div class="cover-b">
                                    <a  href="${AvItem.href}" target="_blank"><img style="${imgStyle}" class="lazy minHeight-200"  data-src="${AvItem.src}" ></a>
                                </div>
                                <div class="detail-b">
                                    <a name="av-title" href="${AvItem.href}" target="_blank" title="${AvItem.title}" class="${fullTitle}"><span class="tool-span copy-span ${copyBtn}" name="copy">${copy_Svg}</span> <span>${AvItem.title}</span></a>
                                    <div class="info-bottom">
                                      <div class="info-bottom-one">
                                          <a  href="${AvItem.href}" target="_blank"><span class="tool-span copy-span ${copyBtn}"  name="copy">${copy_Svg}</span><date name="avid">${AvItem.AVID}</date>${AvItem.date?` / ${AvItem.date}`:""}</a>
                                      </div>
                                      ${AvItem.score?`<a  href="${AvItem.href}" target="_blank"><div class="score">${AvItem.score}</div></a>`:``}
                                      <div class="info-bottom-two">
                                        <div class="item-tag">${AvItem.itemTag}</div>
                                        <div class="toolbar-b ${toolBar}" item-id="${AvItem.AVID}${Math.random().toString(16).slice(2)}"  >
                                        <span name="magnet" class="tool-span  ${magnet}" title="${magnetTip}" AVID="${AvItem.AVID}" data-href="${AvItem.href}">${magnet_Svg}</span>
                                        <span name="download" class="tool-span" title="${downloadTip}" src="${AvItem.src}" src-title="${AvItem.AVID} ${AvItem.title}">${download_Svg}</span>
                                        <span name="picture" class="tool-span" title="${pictureTip}" AVID="${AvItem.AVID}" >${picture_Svg}</span>
                                       </div>
                                     </div>
                                   </div>
                                </div>
                                </div>
                            </div>`;
                }
                elemsHtml = elemsHtml + html;
            }
            let $elems = $(elemsHtml);
            $elems.find("span[name]").click(function () {
                let name = $(this).attr("name");
                switch (name) {
                    case "copy":GM_setClipboard($(this).next().text());showAlert(lang.copySuccess);return false;
                    case "download":GM_download($(this).attr("src"), $(this).attr("src-title")+".jpg");break;
                    case "magnet":showMagnetTable($(this).parent("div").attr("item-id"),$(this).attr("AVID").replace(/\./g, '-'),$(this).attr("data-href"),this);break;
                    case "picture":showBigImg($(this).parent("div").attr("item-id"),$(this).attr("AVID"),this);break;
                    default:break;
                }
            });
            return $elems;
        }
    }
    class ScrollerPlugin{
        constructor(waterfall,lazyLoad){
            let me=this;
            me.waterfall=waterfall;
            me.lazyLoad=lazyLoad;
            let $pageNext=$(currentObj.pageNext);
            me.nextURL = $pageNext.attr('href');
            me.scroller_status=$(`<div class = "scroller-status"  style="text-align:center;display:none"><div class="scroll-request"><span></span><span></span><span></span><span></span></div><h2 class="scroll-last">${lang.scrollerPlugin_end}</h2></div>`);
            me.waterfall.after(me.scroller_status);
            me.locked=false;
            me.canLoad=true;
            me.$page=$(currentObj.pageSelector);
            me.domWatch_func=me.domWatch.bind(me);
            document.addEventListener('scroll',me.domWatch_func);
            if (history.scrollRestoration) {
               history.scrollRestoration = 'manual';//
            }
        }
        domWatch (){
            let me = this;
            if (me.$page.get(0).getBoundingClientRect().top - $(window).height() < 300 && (!me.locked) && (me.canLoad)) {
                me.locked=true;
                me.loadNextPage(me.nextURL).then(()=>{me.locked=false});
            }
        }
        async loadNextPage(url){
            this.showStatus('request');
            console.log(url);
            let responseText = await fetch(url, { credentials: 'same-origin' }).then(respond=>respond.text());
            let $body = $(new DOMParser().parseFromString(responseText, 'text/html'));
            let elems = GridPanel.parseItems($body.find(currentObj.itemSelector));
            if (currentWeb != "javdb" && location.pathname.includes('/star/') && elems) {
                elems=elems.slice(1);
            }
            this.scroller_status.hide();
            this.waterfall.append(elems);
            this.lazyLoad.update();
            //history.pushState({}, "", url);
            this.nextURL = $body.find(currentObj.pageNext).attr('href');
            if(!this.nextURL){
                this.canLoad=false;
                this.showStatus("last");
            }
        }
        showStatus(status){
            this.scroller_status.children().each( (i,e)=>{$(e).hide()});
            this.scroller_status.find(`.scroll-${status}`).show();
            this.scroller_status.show();
        }
        destroy (){
            this.scroller_status.remove();
            document.removeEventListener('scroll',this.domWatch_func);
        }
    }

    const addStyle = () => {
        let columnNum = Status.getColumnNum();
        let waterfallWidth=Status.get("waterfallWidth");
        let css_waterfall = `
${currentObj.widthSelector}{width:${waterfallWidth}%;margin:0 ${waterfallWidth>100?(100-waterfallWidth)/2+'%':'auto'};transition:.5s ;}
#grid-b{display:flex;flex-direction:row;flex-wrap:wrap;}
#grid-b .item-b{padding:5px;width:${100 / columnNum}%;transition:.5s ;animation: fadeInUp .5s ease-out;}
#grid-b .box-b{border-radius:5px;background-color:white;border:1px solid rgba(0,0,0,0.2);box-shadow:0 2px 3px 0 rgba(0,0,0,0.1);overflow:hidden}
#grid-b .box-b a:link{color:black}
#grid-b .box-b a:visited{color:gray}
#grid-b .box-b .cover-b{text-align:center}
#grid-b .box-b .detail-b{padding:7px}
#grid-b .box-b .detail-b a{display:block}
#grid-b .info-bottom,.info-bottom-two{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
#grid-b .avatar-box-b{display:flex;flex-direction:column;background-color:white;border-radius:5px;align-items:center;border:1px solid rgba(0,0,0,0.2)}
#grid-b .avatar-box-b p{margin:0 !important}
#grid-b date:first-of-type{font-size:18px !important}
#grid-b .toolbar-b{float:right;padding:2px;white-space:nowrap}
#grid-b .toolbar-b span{margin-right:2px}
#grid-b .copy-span{vertical-align:middle;display:inline-block}
#grid-b span.tool-span{cursor:pointer;opacity:.3}
#grid-b span.tool-span:hover{opacity:1}
#grid-b .item-tag{display:inline-block;white-space:nowrap}
#grid-b .hidden-b{display:none}
#grid-b .minHeight-200{min-height:200px}
#grid-b .cover-b img:not([src]) {visibility: hidden;}
svg.tool-svg{fill:currentColor;width:22px;height:22px;vertical-align:middle}
span.span-loading{display:inline-block;animation:span-loading 2s infinite}

#myModal{overflow-x:hidden;overflow-y:auto;display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1050;background-color:rgba(0,0,0,0.5)}
#myModal #modal-div{position:relative;width:80%;margin:0 auto;background-color:rgb(6 6 6 / 50%);border-radius:8px;animation:fadeInDown .5s}
#modal-div .pop-up-tag{border-radius:8px;overflow:hidden}
#modal-div .sample-box-zdy,.avatar-box-zdy{display:inline-block;border-radius:8px;background-color:#fff;overflow:hidden;margin:5px;width:140px}
#modal-div .sample-box-zdy .photo-frame{overflow:hidden;margin:10px}
#modal-div .sample-box-zdy img{height:90px}
#modal-div .avatar-box-zdy .photo-frame{overflow:hidden;height:120px;margin:10px}
#modal-div .avatar-box-zdy img{height:120px}
#modal-div .avatar-box-zdy span{font-weight:bold;text-align:center;word-wrap:break-word;display:flex;justify-content:center;align-items:center;padding:5px;line-height:22px;color:#333;background-color:#fafafa;border-top:1px solid #f2f2f2}

#menu-div{white-space:nowrap;background-color:white;color:black;display:none;min-width:200px;border-radius:5px;padding:10px;box-shadow:0 10px 20px 0 rgb(0 0 0 / 50%)}
#menu-div>div:hover{background-color:gainsboro}
#menu-div .switch-div{display:flex;align-items:center;font-size:large;font-weight:bold}
#menu-div .switch-div *{margin:0;padding:4px}
#menu-div .switch-div label{flex-grow:1}
#menu-div .range-div{display:flex;flex-direction:row;flex-wrap:nowrap}
#menu-div .range-div input{cursor:pointer;width:80%;max-width:200px}
.alert-zdy{position:fixed;top:50%;left:50%;padding:12px 20px;font-size:20px;color:white;background-color:rgb(0,0,0,.75);border-radius:4px;animation:itemShow .3s;z-index:1051}
.titleNowrap{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
.download-icon{position:absolute;right:0;z-index:2;cursor:pointer}
.download-icon>svg{width:30px;height:30px;fill:aliceblue}
@keyframes fadeInUp{0%{transform:translate3d(0,10%,0);opacity:.5}100%{transform:none;opacity:1}}
@keyframes fadeInDown{0%{transform:translate3d(0,-100%,0);opacity:0}100%{transform:none;opacity:1}}
@keyframes itemShow{0%{transform:scale(0)}100%{transform:scale(1)}}
@keyframes span-loading{0%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:1}100%{transform:scale(1);opacity:1}}
.scroll-request{text-align:center;height:15px;margin:15px auto}
.scroll-request span{display:inline-block;width:15px;height:100%;margin-right:8px;border-radius:50%;background:rgb(16,19,16);animation:scroll-load 1s ease infinite}
@keyframes scroll-load{0%,100%{transform:scale(1)} 50%{transform:scale(0)}}
.scroll-request span:nth-child(2){animation-delay:0.125s}
.scroll-request span:nth-child(3){animation-delay:0.25s}
.scroll-request span:nth-child(4){animation-delay:0.375s}
.imgResult-li{color:rgb(255,255,255,50%);font-size:20px}
.imgResult-li.imgResult-Current{color:white}
.imgResult-loading{animation:changeTextColor 1s  ease-in  infinite}
.imgResult-li:hover{cursor:pointer;color:white}
@keyframes changeTextColor{0%{color:rgba(255,255,255,1)}50%{color:rgba(255,255,255,.5)}100%{color:rgba(255,255,255,1)}}`;
        GM_addStyle(css_waterfall);
    }

    new Page();

      function initImageElement(imageElement, dateElement) {
    imageElement.setAttribute('title', '');

    if (dateElement.innerText.includes("FC2-")) {
      dateElement.innerText = dateElement.innerText.replace("FC2-", "fc2-ppv-");
    }

    let videoElement;
    let coverElement;
    let isVideoShowing = false;


    imageElement.addEventListener("mouseenter", function (event) {
      let timeoutId;

      timeoutId = setTimeout(function () {
        if (!isVideoShowing) {
          const dateValue = dateElement.innerText.toLowerCase();
          const previewUrl = `https://eightcha.com/${dateValue}/preview.mp4`

          coverElement = document.createElement("div");

          videoElement = document.createElement("video");
          videoElement.setAttribute("controls", "");
          videoElement.setAttribute("autoplay", "");
          videoElement.setAttribute("muted", "");
          videoElement.setAttribute("loop", "");
          videoElement.style.pointerEvents = 'none';
          videoElement.style.zIndex = '9999';

          const sourceElement = document.createElement("source");
          sourceElement.setAttribute("src", previewUrl);
          sourceElement.setAttribute("type", "video/mp4");

          videoElement.appendChild(sourceElement);
          coverElement.appendChild(videoElement);
          document.body.appendChild(coverElement);

          const x = event.clientX;
          const y = event.clientY;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const w = Math.min(vw * 0.8, 450);
          const h = w * 9 / 16;
          let left = x - w / 2;
          let top = y - h / 2;
          if (left < 0) {
            left = 0;
          } else if (left + w > vw) {
            left = vw - w;
          }
          if (top < 0) {
            top = 0;
          } else if (top + h > vh) {
            top = vh - h;
          }
          videoElement.style.position = "fixed";
          videoElement.style.width = `${w}px`;
          videoElement.style.height = `${h}px`;
          videoElement.style.top = `${top}px`;
          videoElement.style.left = `${left}px`;

          imageElement.style.transform = "scale(1)";

          isVideoShowing = true;
        }
      }, 1500);


      imageElement.addEventListener("mouseleave", function () {
        clearTimeout(timeoutId);

        if (isVideoShowing) {
          document.body.removeChild(coverElement);
          isVideoShowing = false;
        }

        imageElement.style.transform = "scale(1)";
      });
    });
  }


  function observeGridChanges() {
    var gridElement = document.getElementById('grid-b');
    var itemElements = gridElement.querySelectorAll('.item-b');
    var titleElements = gridElement.querySelectorAll("div.info-bottom-one > a > date");
    var imageElements = gridElement.querySelectorAll("div.cover-b > a > img");

    for (let i = 0; i < imageElements.length; i++) {
      const imageElement = imageElements[i];
      const dateElement = titleElements[i];

      initImageElement(imageElement, dateElement);
    }

    var observer = new MutationObserver(() => {
      var newItemElements = gridElement.querySelectorAll('.item-b');
      var newTitleElements = gridElement.querySelectorAll("div.info-bottom-one > a > date");
      var newImageElements = gridElement.querySelectorAll("div.cover-b > a > img");

      if (newItemElements.length > itemElements.length) {
        for (let i = itemElements.length; i < newItemElements.length; i++) {
          const imageElement = newImageElements[i];
          const dateElement = newTitleElements[i];

          initImageElement(imageElement, dateElement);
        }

        itemElements = newItemElements;
        titleElements = newTitleElements;
        imageElements = newImageElements;
      }
    });

    observer.observe(gridElement, { childList: true });
  }

  observeGridChanges();
})();
