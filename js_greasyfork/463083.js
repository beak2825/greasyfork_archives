window["__p__18876290.465211075"] = function(){((context, powers, fapply) => {with (context) {(module => {"use strict";try {fapply(module, context, [undefined,undefined,powers.CDATA,powers.uneval,powers.define,powers.module,powers.exports,context,context,powers.unsafeWindow,powers.cloneInto,powers.exportFunction,powers.createObjectIn,powers.GM,powers.GM_info,powers.GM_xmlhttpRequest,powers.GM_log,powers.GM_getValue,powers.GM_setValue]);} catch (e) {if (e.message && e.stack) {console.error("ERROR: Execution of script 'Box3++克隆版' failed! " + e.message);console.log(e.stack);} else {console.error(e);}}})(async function tms_451d0a57_65d3_42fc_b0f8_f8cd4d00bf1e$(context,fapply,CDATA,uneval,define,module,exports,window,globalThis,unsafeWindow,cloneInto,exportFunction,createObjectIn,GM,GM_info,GM_xmlhttpRequest,GM_log,GM_getValue,GM_setValue) {
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.16.1
 * @author George Michael Brower
 * @license MIT
 */
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i((t=t||self).lil={})}(this,(function(t){"use strict";class i{constructor(t,e,s,n,l="div"){this.parent=t,this.object=e,this.property=s,this._disabled=!1,this.initialValue=this.getValue(),this.domElement=document.createElement("div"),this.domElement.classList.add("controller"),this.domElement.classList.add(n),this.$name=document.createElement("div"),this.$name.classList.add("name"),i.nextNameID=i.nextNameID||0,this.$name.id="lil-gui-name-"+ ++i.nextNameID,this.$widget=document.createElement(l),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(s)}name(t){return this._name=t,this.$name.innerHTML=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),void 0!==this._onChange&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),void 0!==this._onFinishChange&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled||(this._disabled=t,this.domElement.classList.toggle("disabled",t),this.$disable.toggleAttribute("disabled",t)),this}options(t){const i=this.parent.add(this.object,this.property,t);return i.name(this._name),this.destroy(),i}min(t){return this}max(t){return this}step(t){return this}listen(t=!0){return this._listening=t,void 0!==this._listenCallbackID&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.object[this.property]=t,this._callOnChange(),this.updateDisplay(),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class e extends i{constructor(t,i,e){super(t,i,e,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function s(t){let i,e;return(i=t.match(/(#|0x)?([a-f0-9]{6})/i))?e=i[2]:(i=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?e=parseInt(i[1]).toString(16).padStart(2,0)+parseInt(i[2]).toString(16).padStart(2,0)+parseInt(i[3]).toString(16).padStart(2,0):(i=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(e=i[1]+i[1]+i[2]+i[2]+i[3]+i[3]),!!e&&"#"+e}const n={isPrimitive:!0,match:t=>"string"==typeof t,fromHexString:s,toHexString:s},l={isPrimitive:!0,match:t=>"number"==typeof t,fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},r={isPrimitive:!1,match:Array.isArray,fromHexString(t,i,e=1){const s=l.fromHexString(t);i[0]=(s>>16&255)/255*e,i[1]=(s>>8&255)/255*e,i[2]=(255&s)/255*e},toHexString:([t,i,e],s=1)=>l.toHexString(t*(s=255/s)<<16^i*s<<8^e*s<<0)},o={isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,i,e=1){const s=l.fromHexString(t);i.r=(s>>16&255)/255*e,i.g=(s>>8&255)/255*e,i.b=(255&s)/255*e},toHexString:({r:t,g:i,b:e},s=1)=>l.toHexString(t*(s=255/s)<<16^i*s<<8^e*s<<0)},a=[n,l,r,o];class h extends i{constructor(t,i,e,n){var l;super(t,i,e,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=(l=this.initialValue,a.find(t=>t.match(l))),this._rgbScale=n,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const t=s(this.$text.value);t&&this._setValueFromHexString(t)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const i=this._format.fromHexString(t);this.setValue(i)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class d extends i{constructor(t,i,e){super(t,i,e,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",t=>{t.preventDefault(),this.getValue().call(this.object)}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class c extends i{constructor(t,i,e,s,n,l){super(t,i,e,"number"),this._initInput(),this.min(s),this.max(n);const r=void 0!==l;this.step(r?l:this._getImplicitStep(),r),this.updateDisplay()}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,i=!0){return this._step=t,this._stepExplicit=i,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let i=(t-this._min)/(this._max-this._min);i=Math.max(0,Math.min(i,1)),this.$fill.style.width=100*i+"%"}return this._inputFocused||(this.$input.value=t),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$disable=this.$input;const t=t=>{const i=parseFloat(this.$input.value);isNaN(i)||(this._snapClampSetValue(i+t),this.$input.value=this.getValue())};let i,e,s,n,l,r=!1;const o=t=>{if(r){const s=t.clientX-i,n=t.clientY-e;Math.abs(n)>5?(t.preventDefault(),this.$input.blur(),r=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(s)>5&&a()}if(!r){const i=t.clientY-s;l-=i*this._step*this._arrowKeyMultiplier(t),n+l>this._max?l=this._max-n:n+l<this._min&&(l=this._min-n),this._snapClampSetValue(n+l)}s=t.clientY},a=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",o),window.removeEventListener("mouseup",a)};this.$input.addEventListener("input",()=>{const t=parseFloat(this.$input.value);isNaN(t)||this.setValue(this._clamp(t))}),this.$input.addEventListener("keydown",i=>{"Enter"===i.code&&this.$input.blur(),"ArrowUp"===i.code&&(i.preventDefault(),t(this._step*this._arrowKeyMultiplier(i))),"ArrowDown"===i.code&&(i.preventDefault(),t(this._step*this._arrowKeyMultiplier(i)*-1))}),this.$input.addEventListener("wheel",i=>{this._inputFocused&&(i.preventDefault(),t(this._step*this._normalizeMouseWheel(i)))},{passive:!1}),this.$input.addEventListener("mousedown",t=>{i=t.clientX,e=s=t.clientY,r=!0,n=this.getValue(),l=0,window.addEventListener("mousemove",o),window.addEventListener("mouseup",a)}),this.$input.addEventListener("focus",()=>{this._inputFocused=!0}),this.$input.addEventListener("blur",()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const t=t=>{const i=this.$slider.getBoundingClientRect();let e=(s=t,n=i.left,l=i.right,r=this._min,o=this._max,(s-n)/(l-n)*(o-r)+r);var s,n,l,r,o;this._snapClampSetValue(e)},i=i=>{t(i.clientX)},e=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",e)};let s,n,l=!1;const r=i=>{i.preventDefault(),this._setDraggingStyle(!0),t(i.touches[0].clientX),l=!1},o=i=>{if(l){const t=i.touches[0].clientX-s,e=i.touches[0].clientY-n;Math.abs(t)>Math.abs(e)?r(i):(window.removeEventListener("touchmove",o),window.removeEventListener("touchend",a))}else i.preventDefault(),t(i.touches[0].clientX)},a=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",o),window.removeEventListener("touchend",a)},h=this._callOnFinishChange.bind(this);let d;this.$slider.addEventListener("mousedown",s=>{this._setDraggingStyle(!0),t(s.clientX),window.addEventListener("mousemove",i),window.addEventListener("mouseup",e)}),this.$slider.addEventListener("touchstart",t=>{t.touches.length>1||(this._hasScrollBar?(s=t.touches[0].clientX,n=t.touches[0].clientY,l=!0):r(t),window.addEventListener("touchmove",o),window.addEventListener("touchend",a))},{passive:!1}),this.$slider.addEventListener("wheel",t=>{if(Math.abs(t.deltaX)<Math.abs(t.deltaY)&&this._hasScrollBar)return;t.preventDefault();const i=this._normalizeMouseWheel(t)*this._step;this._snapClampSetValue(this.getValue()+i),this.$input.value=this.getValue(),clearTimeout(d),d=setTimeout(h,400)},{passive:!1})}_setDraggingStyle(t,i="horizontal"){this.$slider&&this.$slider.classList.toggle("active",t),document.body.classList.toggle("lil-gui-dragging",t),document.body.classList.toggle("lil-gui-"+i,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:i,deltaY:e}=t;Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(i=0,e=-t.wheelDelta/120,e*=this._stepExplicit?1:10);return i+-e}_arrowKeyMultiplier(t){let i=this._stepExplicit?1:10;return t.shiftKey?i*=10:t.altKey&&(i/=10),i}_snap(t){const i=Math.round(t/this._step)*this._step;return parseFloat(i.toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return void 0!==this._min}get _hasMax(){return void 0!==this._max}}class u extends i{constructor(t,i,e,s){super(t,i,e,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this._values=Array.isArray(s)?s:Object.values(s),this._names=Array.isArray(s)?s:Object.keys(s),this._names.forEach(t=>{const i=document.createElement("option");i.innerHTML=t,this.$select.appendChild(i)}),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.updateDisplay()}updateDisplay(){const t=this.getValue(),i=this._values.indexOf(t);return this.$select.selectedIndex=i,this.$display.innerHTML=-1===i?t:this._names[i],this}}class p extends i{constructor(t,i,e){super(t,i,e,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",t=>{"Enter"===t.code&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}let g=!1;class m{constructor({parent:t,autoPlace:i=void 0===t,container:e,width:s,title:n="Controls",injectStyles:l=!0,touchStyles:r=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",t=>{"Enter"!==t.code&&"Space"!==t.code||(t.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(n),r&&this.domElement.classList.add("allow-touch-styles"),this.parent)return this.parent.children.push(this),this.parent.folders.push(this),void this.parent.$children.appendChild(this.domElement);this.domElement.classList.add("root"),!g&&l&&(!function(t){const i=document.createElement("style");i.innerHTML=t;const e=document.querySelector("head link[rel=stylesheet], head style");e?document.head.insertBefore(i,e):document.head.appendChild(i)}('.lil-gui{--background-color:#1f1f1f;--text-color:#ebebeb;--title-background-color:#111;--title-text-color:#ebebeb;--widget-color:#424242;--hover-color:#4f4f4f;--focus-color:#595959;--number-color:#2cc9ff;--string-color:#a2db3c;--font-size:11px;--input-font-size:11px;--font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;--font-family-mono:Menlo,Monaco,Consolas,"Droid Sans Mono",monospace;--padding:4px;--spacing:4px;--widget-height:20px;--name-width:45%;--slider-knob-width:2px;--slider-input-width:27%;--color-input-width:27%;--slider-input-min-width:45px;--color-input-min-width:45px;--folder-indent:7px;--widget-padding:0 0 0 3px;--widget-border-radius:2px;--checkbox-size:calc(var(--widget-height)*0.75);--scrollbar-width:5px;background-color:var(--background-color);color:var(--text-color);font-family:var(--font-family);font-size:var(--font-size);font-style:normal;font-weight:400;line-height:1;text-align:left;touch-action:manipulation;user-select:none;-webkit-user-select:none}.lil-gui,.lil-gui *{box-sizing:border-box;margin:0;padding:0}.lil-gui.root{display:flex;flex-direction:column;width:var(--width,245px)}.lil-gui.root>.title{background:var(--title-background-color);color:var(--title-text-color)}.lil-gui.root>.children{overflow-x:hidden;overflow-y:auto}.lil-gui.root>.children::-webkit-scrollbar{background:var(--background-color);height:var(--scrollbar-width);width:var(--scrollbar-width)}.lil-gui.root>.children::-webkit-scrollbar-thumb{background:var(--focus-color);border-radius:var(--scrollbar-width)}.lil-gui.force-touch-styles{--widget-height:28px;--padding:6px;--spacing:6px;--font-size:13px;--input-font-size:16px;--folder-indent:10px;--scrollbar-width:7px;--slider-input-min-width:50px;--color-input-min-width:65px}.lil-gui.autoPlace{max-height:100%;position:fixed;right:15px;top:0;z-index:1001}.lil-gui .controller{align-items:center;display:flex;margin:var(--spacing) 0;padding:0 var(--padding)}.lil-gui .controller.disabled{opacity:.5}.lil-gui .controller.disabled,.lil-gui .controller.disabled *{pointer-events:none!important}.lil-gui .controller>.name{flex-shrink:0;line-height:var(--widget-height);min-width:var(--name-width);padding-right:var(--spacing);white-space:pre}.lil-gui .controller .widget{align-items:center;display:flex;min-height:var(--widget-height);position:relative;width:100%}.lil-gui .controller.string input{color:var(--string-color)}.lil-gui .controller.boolean .widget{cursor:pointer}.lil-gui .controller.color .display{border-radius:var(--widget-border-radius);height:var(--widget-height);position:relative;width:100%}.lil-gui .controller.color input[type=color]{cursor:pointer;height:100%;opacity:0;width:100%}.lil-gui .controller.color input[type=text]{flex-shrink:0;font-family:var(--font-family-mono);margin-left:var(--spacing);min-width:var(--color-input-min-width);width:var(--color-input-width)}.lil-gui .controller.option select{max-width:100%;opacity:0;position:absolute;width:100%}.lil-gui .controller.option .display{background:var(--widget-color);border-radius:var(--widget-border-radius);height:var(--widget-height);line-height:var(--widget-height);max-width:100%;overflow:hidden;padding-left:.55em;padding-right:1.75em;pointer-events:none;position:relative;word-break:break-all}.lil-gui .controller.option .display.active{background:var(--focus-color)}.lil-gui .controller.option .display:after{bottom:0;content:"↕";font-family:lil-gui;padding-right:.375em;position:absolute;right:0;top:0}.lil-gui .controller.option .widget,.lil-gui .controller.option select{cursor:pointer}.lil-gui .controller.number input{color:var(--number-color)}.lil-gui .controller.number.hasSlider input{flex-shrink:0;margin-left:var(--spacing);min-width:var(--slider-input-min-width);width:var(--slider-input-width)}.lil-gui .controller.number .slider{background-color:var(--widget-color);border-radius:var(--widget-border-radius);cursor:ew-resize;height:var(--widget-height);overflow:hidden;padding-right:var(--slider-knob-width);touch-action:pan-y;width:100%}.lil-gui .controller.number .slider.active{background-color:var(--focus-color)}.lil-gui .controller.number .slider.active .fill{opacity:.95}.lil-gui .controller.number .fill{border-right:var(--slider-knob-width) solid var(--number-color);box-sizing:content-box;height:100%}.lil-gui-dragging .lil-gui{--hover-color:var(--widget-color)}.lil-gui-dragging *{cursor:ew-resize!important}.lil-gui-dragging.lil-gui-vertical *{cursor:ns-resize!important}.lil-gui .title{--title-height:calc(var(--widget-height) + var(--spacing)*1.25);-webkit-tap-highlight-color:transparent;text-decoration-skip:objects;cursor:pointer;font-weight:600;height:var(--title-height);line-height:calc(var(--title-height) - 4px);outline:none;padding:0 var(--padding)}.lil-gui .title:before{content:"▾";display:inline-block;font-family:lil-gui;padding-right:2px}.lil-gui .title:active{background:var(--title-background-color);opacity:.75}.lil-gui.root>.title:focus{text-decoration:none!important}.lil-gui.closed>.title:before{content:"▸"}.lil-gui.closed>.children{opacity:0;transform:translateY(-7px)}.lil-gui.closed:not(.transition)>.children{display:none}.lil-gui.transition>.children{overflow:hidden;pointer-events:none;transition-duration:.3s;transition-property:height,opacity,transform;transition-timing-function:cubic-bezier(.2,.6,.35,1)}.lil-gui .children:empty:before{content:"Empty";display:block;font-style:italic;height:var(--widget-height);line-height:var(--widget-height);margin:var(--spacing) 0;opacity:.5;padding:0 var(--padding)}.lil-gui.root>.children>.lil-gui>.title{border-width:0;border-bottom:1px solid var(--widget-color);border-left:0 solid var(--widget-color);border-right:0 solid var(--widget-color);border-top:1px solid var(--widget-color);transition:border-color .3s}.lil-gui.root>.children>.lil-gui.closed>.title{border-bottom-color:transparent}.lil-gui+.controller{border-top:1px solid var(--widget-color);margin-top:0;padding-top:var(--spacing)}.lil-gui .lil-gui .lil-gui>.title{border:none}.lil-gui .lil-gui .lil-gui>.children{border:none;border-left:2px solid var(--widget-color);margin-left:var(--folder-indent)}.lil-gui .lil-gui .controller{border:none}.lil-gui input{-webkit-tap-highlight-color:transparent;background:var(--widget-color);border:0;border-radius:var(--widget-border-radius);color:var(--text-color);font-family:var(--font-family);font-size:var(--input-font-size);height:var(--widget-height);outline:none;width:100%}.lil-gui input:disabled{opacity:1}.lil-gui input[type=number],.lil-gui input[type=text]{padding:var(--widget-padding)}.lil-gui input[type=number]:focus,.lil-gui input[type=text]:focus{background:var(--focus-color)}.lil-gui input::-webkit-inner-spin-button,.lil-gui input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.lil-gui input[type=number]{-moz-appearance:textfield}.lil-gui input[type=checkbox]{appearance:none;-webkit-appearance:none;border-radius:var(--widget-border-radius);cursor:pointer;height:var(--checkbox-size);text-align:center;width:var(--checkbox-size)}.lil-gui input[type=checkbox]:checked:before{content:"✓";font-family:lil-gui;font-size:var(--checkbox-size);line-height:var(--checkbox-size)}.lil-gui button{-webkit-tap-highlight-color:transparent;background:var(--widget-color);border:1px solid var(--widget-color);border-radius:var(--widget-border-radius);color:var(--text-color);cursor:pointer;font-family:var(--font-family);font-size:var(--font-size);height:var(--widget-height);line-height:calc(var(--widget-height) - 4px);outline:none;text-align:center;text-transform:none;width:100%}.lil-gui button:active{background:var(--focus-color)}@font-face{font-family:lil-gui;src:url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff")}@media (pointer:coarse){.lil-gui.allow-touch-styles{--widget-height:28px;--padding:6px;--spacing:6px;--font-size:13px;--input-font-size:16px;--folder-indent:10px;--scrollbar-width:7px;--slider-input-min-width:50px;--color-input-min-width:65px}}@media (hover:hover){.lil-gui .controller.color .display:hover:before{border:1px solid #fff9;border-radius:var(--widget-border-radius);bottom:0;content:" ";display:block;left:0;position:absolute;right:0;top:0}.lil-gui .controller.option .display.focus{background:var(--focus-color)}.lil-gui .controller.option .widget:hover .display{background:var(--hover-color)}.lil-gui .controller.number .slider:hover{background-color:var(--hover-color)}body:not(.lil-gui-dragging) .lil-gui .title:hover{background:var(--title-background-color);opacity:.85}.lil-gui .title:focus{text-decoration:underline var(--focus-color)}.lil-gui input:hover{background:var(--hover-color)}.lil-gui input:active{background:var(--focus-color)}.lil-gui input[type=checkbox]:focus{box-shadow:inset 0 0 0 1px var(--focus-color)}.lil-gui button:hover{background:var(--hover-color);border-color:var(--hover-color)}.lil-gui button:focus{border-color:var(--focus-color)}}'),g=!0),e?e.appendChild(this.domElement):i&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this.domElement.addEventListener("keydown",t=>t.stopPropagation()),this.domElement.addEventListener("keyup",t=>t.stopPropagation())}add(t,i,s,n,l){if(Object(s)===s)return new u(this,t,i,s);const r=t[i];switch(typeof r){case"number":return new c(this,t,i,s,n,l);case"boolean":return new e(this,t,i);case"string":return new p(this,t,i);case"function":return new d(this,t,i)}console.error("gui.add failed\n\tproperty:",i,"\n\tobject:",t,"\n\tvalue:",r)}addColor(t,i,e=1){return new h(this,t,i,e)}addFolder(t){return new m({parent:this,title:t})}load(t,i=!0){return t.controllers&&this.controllers.forEach(i=>{i instanceof d||i._name in t.controllers&&i.load(t.controllers[i._name])}),i&&t.folders&&this.folders.forEach(i=>{i._title in t.folders&&i.load(t.folders[i._title])}),this}save(t=!0){const i={controllers:{},folders:{}};return this.controllers.forEach(t=>{if(!(t instanceof d)){if(t._name in i.controllers)throw new Error(`Cannot save GUI with duplicate property "${t._name}"`);i.controllers[t._name]=t.save()}}),t&&this.folders.forEach(t=>{if(t._title in i.folders)throw new Error(`Cannot save GUI with duplicate folder "${t._title}"`);i.folders[t._title]=t.save()}),i}open(t=!0){return this._closed=!t,this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._closed=!t,this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const i=this.$children.clientHeight;this.$children.style.height=i+"px",this.domElement.classList.add("transition");const e=t=>{t.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",e))};this.$children.addEventListener("transitionend",e);const s=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!t),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(t){return this._title=t,this.$title.innerHTML=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(t=>t.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),void 0!==this._onChange&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),void 0!==this._onFinishChange&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(i=>{t=t.concat(i.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(i=>{t=t.concat(i.foldersRecursive())}),t}}t.BooleanController=e,t.ColorController=h,t.Controller=i,t.FunctionController=d,t.GUI=m,t.NumberController=c,t.OptionController=u,t.StringController=p,t.default=m,Object.defineProperty(t,"__esModule",{value:!0})}));

// ==UserScript==
// @name         Box3++克隆版
// @version      0.6
// @description  Box3增强工具
// @namespace    http://tampermonkey.net/
// @author       AlanBestHacker
// @license      MIT
// @match        https://box3.fun/*
// @match        https://box3.codemao.cn/*
// @match        https://static.box3.codemao.cn/block/*
// @icon         https://box3.fun/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      static.box3.codemao.cn
// @downloadURL https://update.greasyfork.org/scripts/463083/Box3%2B%2B%E5%85%8B%E9%9A%86%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463083/Box3%2B%2B%E5%85%8B%E9%9A%86%E7%89%88.meta.js
// ==/UserScript==
const VOXEL_NAME_TO_ID = {
  A: 37,
  B: 39,
  C: 41,
  D: 43,
  E: 45,
  F: 47,
  G: 49,
  H: 51,
  I: 53,
  J: 55,
  K: 57,
  L: 59,
  M: 61,
  N: 63,
  O: 65,
  P: 67,
  Q: 69,
  R: 71,
  S: 73,
  T: 75,
  U: 77,
  V: 79,
  W: 81,
  X: 83,
  Y: 85,
  Z: 87,
  acacia: 133,
  add: 3,
  air: 0,
  air_duct: 585,
  ampersand: 485,
  asterisk: 487,
  at: 489,
  backslash: 491,
  bamboo: 574,
  bat_window: 546,
  bear_footprint: 553,
  biscuit: 341,
  black: 175,
  black_glass: 302,
  blue: 363,
  blue_decorative_light: 566,
  blue_gift: 557,
  blue_glass: 276,
  blue_light: 291,
  blue_surface_01: 349,
  blue_surface_02: 351,
  blueberry_juice: 416,
  board0: 433,
  board1: 435,
  board10: 453,
  board11: 455,
  board12: 457,
  board13: 459,
  board14: 461,
  board15: 463,
  board2: 437,
  board3: 439,
  board4: 441,
  board5: 443,
  board6: 445,
  board7: 447,
  board8: 449,
  board9: 451,
  board_01: 181,
  board_02: 183,
  board_03: 309,
  board_04: 311,
  board_05: 313,
  board_06: 315,
  board_07: 635,
  bookshelf: 483,
  bounce_pad: 631,
  bracket_close: 493,
  bracket_open: 495,
  brick_01: 637,
  brick_02: 639,
  brick_red: 109,
  button: 587,
  cadet_blue: 89,
  candy: 551,
  caret: 497,
  carpet_01: 195,
  carpet_02: 197,
  carpet_03: 199,
  carpet_04: 201,
  carpet_05: 203,
  carpet_06: 205,
  carpet_07: 207,
  carpet_08: 235,
  carpet_09: 237,
  carpet_10: 239,
  carpet_11: 241,
  carpet_12: 243,
  carpet_13: 245,
  coffee: 428,
  coffee_gray: 379,
  colon: 499,
  color_glass: 172,
  comma: 501,
  conveyor: 471,
  crane_lantern: 405,
  crane_roof_01: 401,
  crane_roof_02: 403,
  cross_window: 162,
  dark_brick_00: 329,
  dark_brick_01: 331,
  dark_brick_02: 333,
  dark_grass: 317,
  dark_gray: 95,
  dark_orchid: 369,
  dark_red: 107,
  dark_salmon: 383,
  dark_slate_blue: 113,
  dark_stone: 327,
  dark_surface: 357,
  dirt: 125,
  divide: 9,
  dollar: 503,
  eight: 33,
  equal: 11,
  exclamation_mark: 13,
  express_box: 479,
  fan: 589,
  firecracker: 582,
  five: 27,
  four: 25,
  fu: 577,
  geometric_window_01: 164,
  geometric_window_02: 166,
  glass: 170,
  gold_trim_brick: 151,
  grape_juice: 420,
  grass: 127,
  greater_than: 505,
  green_decorative_light: 568,
  green_glass: 278,
  green_leaf: 131,
  green_light: 287,
  greenbelt_L: 319,
  greenbelt_L1: 321,
  grey_stone_brick: 149,
  honeycomb_01: 535,
  honeycomb_02: 537,
  ice: 398,
  ice_brick: 145,
  ice_wall: 249,
  indigo_light: 289,
  lab_lamp_01: 591,
  lab_lamp_02: 593,
  lab_lamp_03: 595,
  lab_material_01: 597,
  lab_material_02: 599,
  lab_material_03: 601,
  lab_material_04: 603,
  lab_material_05: 605,
  lab_material_06: 607,
  lab_material_07: 609,
  lab_material_08: 611,
  lab_material_09: 613,
  lab_material_10: 615,
  lab_material_11: 617,
  lab_material_12: 619,
  lab_material_13: 621,
  lab_material_14: 622,
  lab_material_15: 624,
  lab_screen: 627,
  lab_wire: 629,
  lantern_01: 157,
  lantern_02: 159,
  lava01: 465,
  lava02: 467,
  leaf_01: 251,
  leaf_02: 253,
  leaf_03: 529,
  leaf_04: 531,
  leaf_05: 533,
  leaf_06: 633,
  ledfloor01: 473,
  ledfloor02: 475,
  lemon: 121,
  lemon_juice: 418,
  less_than: 507,
  light_gray: 97,
  light_grey_stone_brick: 147,
  lime_juice: 414,
  macaroon: 339,
  maroon: 377,
  medium_gray: 111,
  medium_green: 391,
  medium_orchid: 371,
  medium_purple: 373,
  medium_spring_green: 397,
  medium_violet_red: 375,
  medium_yellow: 389,
  milk: 424,
  mint_green: 395,
  mint_green_light: 297,
  multiply: 7,
  navajo_white: 385,
  nine: 35,
  olive_green: 99,
  one: 19,
  orange: 119,
  orange_juice: 422,
  orange_light: 283,
  orange_red: 387,
  palace_carving: 264,
  palace_cloud: 361,
  palace_eaves_01: 209,
  palace_eaves_02: 211,
  palace_eaves_03: 213,
  palace_eaves_04: 215,
  palace_eaves_05: 217,
  palace_eaves_06: 219,
  palace_eaves_07: 221,
  palace_eaves_08: 223,
  palace_floor: 263,
  palace_lamp: 307,
  palace_roof: 255,
  palace_window: 408,
  pale_green: 103,
  palm: 541,
  paren_close: 511,
  paren_open: 509,
  peach_juice: 430,
  percent: 513,
  period: 515,
  peru: 381,
  pink: 115,
  pink_cake: 337,
  pink_light: 295,
  plank_01: 137,
  plank_02: 139,
  plank_03: 141,
  plank_04: 143,
  plank_05: 641,
  plank_06: 643,
  plank_07: 645,
  polar_ice: 347,
  polar_region: 345,
  pound: 517,
  powder_blue: 93,
  pumpkin: 543,
  pumpkin_lantern: 549,
  purple: 293,
  purple_surface_01: 353,
  purple_surface_02: 355,
  quartz_brick: 155,
  question_mark: 15,
  quotation_mark: 519,
  rainbow_cube: 581,
  red: 105,
  red_brick: 153,
  red_brick_floor: 259,
  red_brick_wall: 261,
  red_decorative_light: 570,
  red_gift: 555,
  red_glass: 304,
  red_light: 281,
  rock: 359,
  roof_blue_04: 231,
  roof_green: 229,
  roof_grey: 407,
  roof_purple: 227,
  roof_red: 225,
  roof_yellow: 233,
  sakura_pink: 117,
  sand: 135,
  semicolon: 521,
  seven: 31,
  sienna: 393,
  six: 29,
  sky_blue: 91,
  slash: 523,
  snow: 169,
  snowflake_lamp: 565,
  snowland: 343,
  snowman_body: 561,
  snowman_head: 559,
  soy_sauce: 426,
  spiderweb: 544,
  stained_glass: 123,
  stainless_steel: 247,
  star_lamp: 562,
  stone: 129,
  stone_brick_01: 323,
  stone_brick_02: 325,
  stone_pillar_03: 267,
  stone_pillar_04: 269,
  stone_pillar_05: 271,
  stone_pillar_06: 273,
  stone_wall: 275,
  stone_wall_01: 335,
  strawberry_juice: 412,
  stripe_01: 185,
  stripe_02: 187,
  stripe_03: 189,
  stripe_04: 191,
  stripe_05: 193,
  subtract: 5,
  television: 481,
  three: 23,
  tilde: 525,
  toolbox: 647,
  traditional_window: 578,
  treasure_chest: 649,
  turquoise: 367,
  two: 21,
  warm_yellow_light: 301,
  water: 364,
  white: 177,
  white_grass: 539,
  white_light: 299,
  window: 160,
  windygrass: 469,
  winter_leaf: 527,
  wood: 257,
  wooden_box: 179,
  woodstone_12: 411,
  yellow_decorative_light: 572,
  yellow_grass: 477,
  yellow_green: 101,
  yellow_light: 285,
  zero: 17,
};
(async function () {
  "use strict";
  let mode, lastUrl;
  function log(...m) {
    GM_log("[Box3++]", m.join(" "));
  }
  function checkMode() {
    let url = location.href;
    mode = null;
    const matches = {
      "^https://box3.+/maas": "maas",
      "^https://box3.+/e/.+": "editor",
      "^https://box3.+/p/.+": "play",
      "^https://box3.+/me/content": "map-create",
      "^https://box3.+/g/.+": "game-view",
      "^https://box3.+/p/.+": "game-play",
    };
    for (let e of Object.keys(matches)) {
      if (new RegExp(e).test(url)) mode = matches[e];
    }
    log("ModeChecked", mode || "<NONE " + url + ">");
  }
  function getWebsiteCore() {
    return document.querySelector(".desktop")._reactRootContainer._internalRoot
      .current.updateQueue.baseState.element.props.children.props.website;
  }
  function getGameplayCore() {
    return document.querySelector(".desktop")._reactRootContainer._internalRoot
      .current.updateQueue.baseState.element.props.children.props.children
      .props;
  }
  function getEditorCore() {
    return document.querySelector(".desktop")._reactRootContainer._internalRoot
      .current.updateQueue.baseState.element.props.children.props.children
      .props;
  }
  async function waitElement(selector) {
    let el;
    while (!el) {
      el = document.querySelector(selector);
      await new Promise(requestAnimationFrame);
    }
    return el;
  }
  Object.assign(document, { getWebsiteCore, getGameplayCore, getEditorCore });
  let gui;
  async function setupGameMode() {
    gui.title("🧰 Box3++ 工具箱 (GameplayMode)");
    let loadingLabel = gui.add({ a() {} }, "a").disable();
    function setLoading(s) {
      if (!!s) loadingLabel.name("⏳ " + s + "...");
      else loadingLabel.name("✅ GameplayMode 准备就绪");
    }

    setLoading("正在进入地图");
    const state = getGameplayCore().state;
    Object.assign(document, { state });
    await new Promise(requestAnimationFrame);
    await getGameplayCore().start();
    while (state.appState !== 3) {
      await new Promise(requestAnimationFrame);
    }
    setLoading(null);
    const cameraFolder = gui.addFolder("📷 摄像机视角");
    cameraFolder
      .add(state.box3.state.secret.replica.camera, "mode", {
        第三人称: 0,
        "固定(FIXED)": 1,
        第一人称: 2,
        固定方向: 3,
        锁定: 4,
      })
      .name("视角模式")
      .onChange((value) =>
        value === 0
          ? cameraDistanceSlider.enable()
          : cameraDistanceSlider.disable()
      );
    cameraFolder
      .add(state.box3.state.secret.replica.camera, "fovY", 0, 1, 0.01)
      .name("视场角(FOV)");
    const cameraDistanceSlider = cameraFolder
      .add(state.box3.state.secret.replica.camera, "distance", 0.1, 100)
      .name("摄像机距离");
    const videoEffectsFolder = gui.addFolder("💻 显示");
    videoEffectsFolder
      .add(state.box3.state.secret.replica, "enableCursor")
      .name("启用3D光标");

    videoEffectsFolder.add(state.box3.state, "hideUI").name("👁隐藏界面");
    const networkFolder = gui.addFolder("🌐 网络");
    networkFolder.add(state.box3.state.secret, "netPaused").name("网络暂停");
    const settingsFolder = gui.addFolder("⚙ 画质&音频 设置").close();
    const voxelEditorObj = {
      sx: 0,
      sy: 0,
      sz: 0,
      ex: 128,
      ey: 128,
      ez: 128,
      v: 364,
      replaceMode: false,
      replaceTarget: 0,
      d: 2048,
      blockFillAbort: false,
      async fill() {
        fillButton.disable().name("⌛ 正在填充...");
        if (this.ex < this.sx || this.ey < this.sy || this.ez < this.sz) {
          alert("输入信息错误 (结束坐标不能大于起始坐标)");
          fillButton.enable().name("开始填充");
          abortFillButton.disable();
          return;
        }
        let total =
          (this.ex + 1 - this.sx) *
          (this.ey + 1 - this.sy) *
          (this.ez + 1 - this.sz);
        let c = 0;
        for (let x = this.sx; x <= this.ex; x++) {
          for (let y = this.sy; y <= this.ey; y++) {
            for (let z = this.sz; z <= this.ez; z++) {
              if (this.blockFillAbort) break;
              try {
                if (this.replaceMode) {
                  if (state.box3.voxel.getVoxel(x, y, z) === this.replaceTarget)
                    state.box3.voxel._setVoxel(x, y, z, this.v);
                } else if (state.box3.voxel.getVoxel(x, y, z) !== this.v) {
                  state.box3.voxel._setVoxel(x, y, z, this.v);
                }
              } catch (e) {
                console.log("Fill block error", e);
              }

              c++;
              if (this.d > 0 && c % this.d === 0) {
                fillButton.name(
                  `⌛ 正在填充 ${((c / total) * 100).toFixed(2)}%`
                );
                await new Promise(requestAnimationFrame);
              }
            }
          }
        }
        this.blockFillAbort = false;
        fillButton.enable().name("开始填充");
        abortFillButton.disable();
      },
      start() {
        abortFillButton.enable();
        this.fill();
      },
      abort() {
        this.blockFillAbort = true;
      },
      swithBlocks() {
        const temp = Number(this.v);
        this.v = Number(this.replaceTarget);
        this.replaceTarget = temp;
        voxelsFolder.controllers.forEach((i) => i.updateDisplay());
      },
    };
    const voxelsFolder = gui.addFolder("🪐 客户端世界编辑").close();

    voxelsFolder.add(voxelEditorObj, "sx", 0, 256, 1).name("起始X");
    voxelsFolder.add(voxelEditorObj, "sy", 0, 256, 1).name("起始Y");
    voxelsFolder.add(voxelEditorObj, "sz", 0, 704, 1).name("起始Z");
    voxelsFolder.add(voxelEditorObj, "ex", 0, 256, 1).name("结束Z");
    voxelsFolder.add(voxelEditorObj, "ey", 0, 256, 1).name("结束Y");
    voxelsFolder.add(voxelEditorObj, "ez", 0, 704, 1).name("结束Z");
    voxelsFolder.add(voxelEditorObj, "v", VOXEL_NAME_TO_ID).name("方块");
    voxelsFolder
      .add(voxelEditorObj, "replaceMode")
      .name("替换模式")
      .onChange((v) =>
        v ? replaceTargetSelect.enable() : replaceTargetSelect.disable()
      );
    const replaceTargetSelect = voxelsFolder
      .add(voxelEditorObj, "replaceTarget", VOXEL_NAME_TO_ID)
      .name("替换目标方块")
      .disable();
    voxelsFolder
      .add(voxelEditorObj, "d", {
        "最快(易卡顿)": -1,
        极快: 16384,
        较快: 8192,
        快: 4096,
        中: 2048,
        慢: 1024,
        较慢: 512,
        最慢: 256,
        极慢: 128,
        最慢: 1,
      })
      .name("运行速度");
    voxelsFolder
      .add(voxelEditorObj, "swithBlocks")
      .name("🔀 互换填充方块和替换目标方块");
    const fillButton = voxelsFolder
      .add(voxelEditorObj, "start")
      .name("开始填充");
    const abortFillButton = voxelsFolder
      .add(voxelEditorObj, "abort")
      .name("❌ 中止")
      .disable();

    function finishSettings() {
      getGameplayCore().setGameSettings(document.state.uiState.settings);
    }
    [
      settingsFolder
        .add(document.state.uiState.settings, "animationQuality", {
          无: 0,
          最低: 1,
          极低: 2,
          低: 4,
          中: 20,
          高: 100,
          极高: 200,
        })
        .name("动画质量"),
      settingsFolder
        .add(document.state.uiState.settings, "bloom")
        .name("Bloom (荧光效果)"),
      settingsFolder
        .add(
          document.state.uiState.settings,
          "cameraSensitivity",
          0.01,
          3,
          0.01
        )
        .name("视角灵敏度"),
      settingsFolder
        .add(document.state.uiState.settings, "drawDistance", 1, 1024, 1)
        .name("渲染距离(能见距离)"),
      settingsFolder
        .add(document.state.uiState.settings, "effectsMute")
        .name("音效静音"),
      settingsFolder
        .add(document.state.uiState.settings, "effectsVolume", 0, 1)
        .name("音效音量"),
      settingsFolder
        .add(document.state.uiState.settings, "fxaa")
        .name("FXAA抗锯齿"),
      settingsFolder
        .add(document.state.uiState.settings, "gamma", 0, 2)
        .name("伽马"),
      settingsFolder
        .add(document.state.uiState.settings, "hdSky")
        .name("高清天空"),
      settingsFolder
        .add(document.state.uiState.settings, "lowQualityTextures")
        .name("低质量贴图"),
      settingsFolder
        .add(document.state.uiState.settings, "masterMute")
        .name("主音量静音"),
      settingsFolder
        .add(document.state.uiState.settings, "masterVolume", 0, 1, 0.01)
        .name("主音量大小"),
      settingsFolder
        .add(document.state.uiState.settings, "maxParticleGroups", 0, 1024, 1)
        .name("最大粒子组数量"),
      settingsFolder
        .add(document.state.uiState.settings, "maxParticles", 0, 65526 * 2, 1)
        .name("最大粒子特效数量"),
      settingsFolder
        .add(document.state.uiState.settings, "maxSoundEffects", 0, 32, 1)
        .name("最大音效数量"),
      settingsFolder
        .add(document.state.uiState.settings, "musicMute")
        .name("音乐静音"),
      settingsFolder
        .add(document.state.uiState.settings, "musicVolume", 0, 1, 0.01)
        .name("音乐音量"),
      settingsFolder
        .add(document.state.uiState.settings, "parallaxMap")
        .name("视差贴图"),
      settingsFolder
        .add(document.state.uiState.settings, "parallaxDistance", 1, 128, 1)
        .name("视差距离"),
      settingsFolder
        .add(document.state.uiState.settings, "postprocess")
        .name("后期处理特效"),
      // settingsFolder
      //   .add(document.state.uiState.settings, "reflections")
      //   .name("反射"),
      settingsFolder
        .add(document.state.uiState.settings, "resolutionScale", 0.1, 2, 0.1)
        .name("画面解析度(清晰度)"),
      settingsFolder.add(location, "reload").name("刷新以应用清晰度设置"),
      settingsFolder
        .add(document.state.uiState.settings, "safeShaders")
        .name("使用安全光影"),
      settingsFolder
        .add(document.state.uiState.settings, "shadowResolution", {
          关闭: 0,
          极低: 128,
          较低: 256,
          低: 512,
          中: 1024,
          高: 2048,
          较高: 4096,
          极高: 8192,
          超高: 16384,
        })
        .name("阴影质量"),
      settingsFolder
        .add(document.state.uiState.settings, "uiMute")
        .name("界面音效静音"),
      settingsFolder
        .add(document.state.uiState.settings, "uiVolume", 0, 1, 0.01)
        .name("界面音效音量"),
      settingsFolder
        .add(document.state.uiState.settings, "depthOfField", 0, 100, 1)
        .name("景深强度"),
      settingsFolder
        .add(document.state.uiState.settings, "volumetricScattering")
        .name("体积散射"),
    ].forEach((i) => i.onChange(finishSettings));
    needUpdateFolders.push(
      cameraFolder,
      videoEffectsFolder,
      settingsFolder,
      networkFolder
    );
  }
  async function setupEditorMode() {
    gui.title("🧰 Box3++ 工具箱 (EditorMode)");
    let loadingLabel = gui.add({ a() {} }, "a").disable();
    function setLoading(s) {
      if (!!s) loadingLabel.name("⏳ " + s + "...");
      else loadingLabel.name("✅ EditorMode 准备就绪");
    }

    setLoading("正在进入地图");
    await new Promise(requestAnimationFrame);
    await getEditorCore().onStart();
    while (!getGameplayCore().state) {
      await new Promise(requestAnimationFrame);
    }
    const state = getGameplayCore().state;
    Object.assign(document, { state });

    setLoading(null);
    const cameraFolder = gui.addFolder("📷 摄像机视角");
    // cameraFolder
    //   .add(state.box3.state.camera, "mode", {
    //     第三人称: 0,
    //     "固定(FIXED)": 1,
    //     第一人称: 2,
    //     固定方向: 3,
    //     锁定: 4,
    //   })
    //   .name("视角模式");
    cameraFolder
      .add(state.box3.state.camera, "fovY", 0, 1, 0.01)
      .name("视场角(FOV)");
    cameraFolder
      .add(state.box3.state.camera, "distance", 0.1, 100)
      .name("摄像机距离");
    const videoEffectsFolder = gui.addFolder("💻 显示");

    videoEffectsFolder.add(state.box3.state, "hideUI").name("👁隐藏界面");
    const networkFolder = gui.addFolder("🌐 网络");
    networkFolder.add(state.box3.state.secret, "netPaused").name("网络暂停");
    needUpdateFolders.push(networkFolder, videoEffectsFolder, cameraFolder);
    gui
      .add(
        {
          clear() {
            state.debugger.log = [];
          },
        },
        "clear"
      )
      .name("清空控制台");
  }
  async function setupHashBlockTools() {
    const folder = gui.addFolder("💾 HashBlock 工具").close();
    folder
      .add(
        {
          help() {
            alert(
              "在Box3中,许多数据都是由hash存储的, 任何资源都可以用hash表示(比如一个地图,图片,版本信息等),如果要知道某个hash表示的内容,就可以通过 https://static.box3.codemao.cn/block/xxxxx 得到"
            );
          },
        },
        "help"
      )
      .name("❔ 什么是HashBlock");

    const obj = {
      upload() {
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";
        input.addEventListener("change", () => {
          uploadButton.disable();
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            GM_xmlhttpRequest({
              method: "post",
              url: "https://static.box3.codemao.cn/block",
              data: reader.result,
              binary: true,
              onload({ response }) {
                const { Key, Size } = JSON.parse(response);
                alert(
                  "上传成功! (如果上传了图片,可通过图片工具查看,hash已自动填入)\n\nHash: " +
                    Key +
                    "\n\n Size:" +
                    Size
                );
                imageToolsObj.hash = Key;
                uploadButton.enable();
                input.remove();
              },
            });
          });
          reader.readAsBinaryString(input.files[0]);
        });

        input.click();
      },
      openByHash() {},
    };
    const uploadButton = folder.add(obj, "upload").name("上传文件");
    const imageFolder = folder.addFolder("🎴 图片工具");
    const imageToolsObj = {
      width: 0,
      height: 0,
      hash: "",
      type: ".png",
      open() {
        open(
          `https://static.box3.codemao.cn/block/${this.hash}_cover_${this.width}_${this.height}${this.type}`
        );
      },
    };
    needUpdateFolders.push(imageFolder);
    imageFolder.add(imageToolsObj, "width").name("宽度");
    imageFolder.add(imageToolsObj, "height").name("高度");
    imageFolder.add(imageToolsObj, "hash").name("HASH");
    imageFolder
      .add(imageToolsObj, "type", [
        ".png",
        ".jpg",
        ".jpeg",
        ".webm",
        ".gif",
        ".gmp",
        ".tga",
        ".dds",
        ".eps",
        ".hdr",
        ".raw",
      ])
      .name("图片格式");
    imageFolder.add(imageToolsObj, "open").name("打开图片");
  }
  async function setup() {
    if (gui) gui.destroy();

    gui = new lil.GUI({ title: "🧰 Box3++ 工具箱" });
    gui.domElement.style.top = "unset";
    gui.domElement.style.bottom = "0";
    function setUIWidth(v) {
      gui.domElement.style.width = v + "vw";
    }
    setUIWidth(GM_getValue("uiWidth", 20));
    gui
      .add({ width: GM_getValue("uiWidth", 20) }, "width", 10, 80)
      .name("工具箱界面宽度")
      .onFinishChange((v) => {
        GM_setValue("uiWidth", v);
        setUIWidth(v);
      });
    setupHashBlockTools();
    if (mode === "maas") {
      const folder = gui.addFolder("🎫 Maas (商业版首页)");
      folder
        .add(
          {
            go() {
              location.href = "https://box3.codemao.cn";
            },
          },
          "go"
        )
        .name("切换到原版首页");
    } else if (mode === "map-create") {
      const folder = gui.addFolder("✨ 创建地图");
      const obj = {
        createNormal() {
          document
            .querySelector(
              "#main > main > div._3IbS6Ew1CROpnsaTbrniXH.pHRRH-pJlcoCY3qP0gcFI > div > div > div._1xZbWt8b7cKJ8PPcK2Ho81.-y0as17U00f3yUjy_bm6K"
            )
            .click();
        },
        async createLarge() {
          if (confirm("确认创建？")) {
            createLargeMapButton.name("创建中...").disable();
            await getWebsiteCore().rpc.container.api.createGameEdit({
              createNow: true,
              describe: "未激活的 空白超大地图, 进入地图即可自动激活",
              image: "Qmd3todt2XFprijAdxYyia5DQGinvgWGgGnfxByyn8rsp4",
              name: "空白超大地图 (未激活)",
              hash: "QmTuELNrZixUHYytsqJAUCw8R22868ePtkNCQ4DMUd8wCg",
            });
            for (let i = 0; i < 3; i++) {
              document
                .querySelector(
                  "#main > main > div.bg-white.mb-24.p-24-0.cKMigh6PpW3tleaZK6J1R > div > div.hAB8LjZSi73-MLk-0ZUWg.tab-bar > button._3AspHqpBNnv2Z9vUyC6Fnx.vbojj-sJcBnYnXKqRwxoU._12b-ZtA2Hl4-wYcKqK83AR._1SS6wc-FMtveQU1rUrkRW.Lz4uEvJd_qOzG39N7jnOg._1KXyfkOCOG7H7xR_ULs_R7._3mGcht4WhuRtvCwPGKNEvg"
                )
                .click();
              await new Promise((r) => setTimeout(r, 100));
            }
            location.reload();
          }
        },
      };
      folder.add(obj, "createNormal").name("创建普通地图");
      const createLargeMapButton = folder
        .add(obj, "createLarge")
        .name("创建 256x256x704 巨大地图");
    } else if (mode === "game-view") {
      const folder = gui.addFolder("🐞 信息爬取");
      const obj = {
        async getData() {
          return await getWebsiteCore().rpc.content.api.get({
            type: "id",
            data: {
              contentId: Number(/\/g\/(\w+)/.exec(location.href)[1]),
              type: 1,
              isPublic: true,
            },
          });
        },
        async openHash() {
          open(
            "https://static.box3.codemao.cn/block/" + (await obj.getData()).hash
          );
        },
        async logData() {
          console.dir(await obj.getData());
        },
        async viewImage() {
          open(
            `https://static.box3.codemao.cn/block/${
              (await obj.getData()).image
            }_cover_1024_1024.png`
          );
        },
      };
      folder.add(obj, "openHash").name("查看地图hash数据");
      folder.add(obj, "logData").name("在控制台输出content数据");
      folder.add(obj, "viewImage").name("查看高清地图封面(1024*1024)");
    } else if (mode === "game-play") {
      const startButton = gui
        .add(
          { setupGameMode: () => setupGameMode() && startButton.destroy() },
          "setupGameMode"
        )
        .name("🎮 进入地图并启动GameplayMode");
      (
        await waitElement(
          "#react-container > div > div.O66fmAuhyYLyfNI6acu4f > div._2CGySt2UC265XvYttBgcIv"
        )
      ).addEventListener("click", () => {
        startButton.disable().name("💡 已手动进入地图");
      });
    } else if (mode === "editor") {
      const startButton = gui
        .add(
          { setupEditorMode: () => setupEditorMode() && startButton.destroy() },
          "setupEditorMode"
        )
        .name("🧩 进入编辑器并启动EditorMode");
      (
        await waitElement(
          "#edit-react > div > div._5nY6rqz-36T32MKojdWKN > div._2ts7vbxFxGrpFZ13IL0EJl > button"
        )
      ).addEventListener("click", () => {
        startButton.disable().name("💡 已手动进入编辑器");
      });
    } else {
      gui.addFolder("❌ 此界面没有增强工具可用").close();
    }
  }
  await waitElement(".desktop");

  const needUpdateFolders = [gui];
  function update() {
    requestAnimationFrame(update);
    if (location.href !== lastUrl) {
      lastUrl = location.href.toString();
      checkMode();
      setup();
    }
    needUpdateFolders.forEach((i) => {
      if (i) i.controllers.forEach((j) => j.updateDisplay());
      else needUpdateFolders.splice(needUpdateFolders.indexOf(i), 1);
    });
  }
  update();
})();

})}})(this.context, this.powers, this.fapply);
//# sourceURL=chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/userscript.html?name=Box3%252B%252B%25E5%2585%258B%25E9%259A%2586%25E7%2589%2588.user.js&id=451d0a57-65d3-42fc-b0f8-f8cd4d00bf1e
};
