// ==UserScript==
// @name        EN reFRESH
// @namespace   http://tampermonkey.net/
// @version     0.939
// @author      Ton Lomakin [https://vk.com/lomakin.anton]
// @match       *.en.cx/gameengines/encounter/play/*
// @match       *.en.cx/admin/games/levels/preview/*
// @require	    https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle 
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/373851/EN%20reFRESH.user.js
// @updateURL https://update.greasyfork.org/scripts/373851/EN%20reFRESH.meta.js
// ==/UserScript==
function GM_configStruct(){arguments.length&&(GM_configInit(this,arguments),this.onInit())}function GM_configInit(a,c){if("undefined"==typeof a.fields&&(a.fields={},a.onInit=a.onInit||function(){},a.onOpen=a.onOpen||function(){},a.onSave=a.onSave||function(){},a.onClose=a.onClose||function(){},a.onReset=a.onReset||function(){},a.isOpen=!1,a.title="User Script Settings",a.css={basic:["#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }","#GM_config { background: #FFF; }","#GM_config input[type='radio'] { margin-right: 8px; }","#GM_config .indent40 { margin-left: 40%; }","#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }","#GM_config .radio_label { font-size: 12px; }","#GM_config .block { display: block; }","#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }","#GM_config .reset, #GM_config .reset a, #GM_config_buttons_holder { color: #000; text-align: right; }","#GM_config .config_header { font-size: 20pt; margin: 0; }","#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }","#GM_config .center { text-align: center; }","#GM_config .section_header_holder { margin-top: 8px; }","#GM_config .config_var { margin: 0 0 4px; }","#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;"," font-size: 13pt; margin: 0; }","#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757; font-size: 9pt; margin: 0 0 6px; }"].join("\n")+"\n",basicPrefix:"GM_config",stylish:""}),1==c.length&&"string"==typeof c[0].id&&"function"!=typeof c[0].appendChild)var d=c[0];else for(var h,d={},f=0,g=c.length;f<g;++f){if(h=c[f],"function"==typeof h.appendChild){d.frame=h;continue}switch(typeof h){case"object":for(var k in h){if("function"!=typeof h[k]){d.fields=h;break}d.events||(d.events={}),d.events[k]=h[k]}break;case"function":d.events={onOpen:h};break;case"string":/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(h)?d.css=h:d.title=h;}}if(d.id?a.id=d.id:"undefined"==typeof a.id&&(a.id="GM_config"),d.title&&(a.title=d.title),d.css&&(a.css.stylish=d.css),d.frame&&(a.frame=d.frame),d.events){var m=d.events;for(var n in m)a["on"+n.charAt(0).toUpperCase()+n.slice(1)]=m[n]}if(d.fields){var o=a.read(),p=d.fields,q=d.types||{},r=a.id;for(var t in p){var u=p[t];u?a.fields[t]=new GM_configField(u,o[t],t,q[u.type],r):a.fields[t]&&delete a.fields[t]}}a.id!=a.css.basicPrefix&&(a.css.basic=a.css.basic.replace(new RegExp("#"+a.css.basicPrefix,"gm"),"#"+a.id),a.css.basicPrefix=a.id)}GM_configStruct.prototype={init:function(){GM_configInit(this,arguments),this.onInit()},open:function(){function a(g,h){var k=d.create,m=d.fields,n=d.id,o=k("div",{id:n+"_wrapper"});h.appendChild(k("style",{type:"text/css",textContent:d.css.basic+d.css.stylish})),o.appendChild(k("div",{id:n+"_header",className:"config_header block center"},d.title));var p=o,q=0;for(var r in m){var t=m[r],u=t.settings;u.section&&(p=o.appendChild(k("div",{className:"section_header_holder",id:n+"_section_"+q})),"[object Array]"!==Object.prototype.toString.call(u.section)&&(u.section=[u.section]),u.section[0]&&p.appendChild(k("div",{className:"section_header center",id:n+"_section_header_"+q},u.section[0])),u.section[1]&&p.appendChild(k("p",{className:"section_desc center",id:n+"_section_desc_"+q},u.section[1])),++q),p.appendChild(t.wrapper=t.toNode())}o.appendChild(k("div",{id:n+"_buttons_holder"},k("button",{id:n+"_saveBtn",textContent:"Save",title:"Save settings",className:"saveclose_buttons",onclick:function(){d.save()}}),k("button",{id:n+"_closeBtn",textContent:"Close",title:"Close window",className:"saveclose_buttons",onclick:function(){d.close()}}),k("div",{className:"reset_holder block"},k("a",{id:n+"_resetLink",textContent:"Reset to defaults",href:"#",title:"Reset fields to default values",className:"reset",onclick:function(v){v.preventDefault(),d.reset()}})))),g.appendChild(o),d.center(),window.addEventListener("resize",d.center,!1),d.onOpen(d.frame.contentDocument||d.frame.ownerDocument,d.frame.contentWindow||window,d.frame),window.addEventListener("beforeunload",function(){d.close()},!1),d.frame.style.display="block",d.isOpen=!0}var c=document.getElementById(this.id);if(!(c&&("IFRAME"==c.tagName||0<c.childNodes.length))){var d=this,f="bottom: auto; border: 1px solid #000; display: none; height: 75%; left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0; overflow: auto; padding: 0; position: fixed; right: auto; top: 0; width: 75%; z-index: 9999;";this.frame?(this.frame.id=this.id,this.frame.setAttribute("style",f),a(this.frame,this.frame.ownerDocument.getElementsByTagName("head")[0])):(document.body.appendChild(this.frame=this.create("iframe",{id:this.id,style:f})),this.frame.src="about:blank",this.frame.addEventListener("load",function(){var h=d.frame,k=h.contentDocument.getElementsByTagName("body")[0];k.id=d.id,a(k,h.contentDocument.getElementsByTagName("head")[0])},!1))}},save:function(){var a=this.write();this.onSave(a)},close:function(){this.frame.contentDocument?(this.remove(this.frame),this.frame=null):(this.frame.innerHTML="",this.frame.style.display="none");var a=this.fields;for(var c in a){var d=a[c];d.wrapper=null,d.node=null}this.onClose(),this.isOpen=!1},set:function(a,c){this.fields[a].value=c,this.fields[a].node&&this.fields[a].reload()},get:function(a,c){var d=this.fields[a],f=null;return c&&d.node&&(f=d.toValue()),null==f?d.value:f},write:function(a,c){if(!c){var d={},f={},g=this.fields;for(var h in g){var k=g[h],m=k.toValue();k.save?null==m?d[h]=k.value:(d[h]=m,k.value=m):f[h]=m}}try{this.setValue(a||this.id,this.stringify(c||d))}catch(n){this.log("GM_config failed to save settings!")}return f},read:function(a){try{var c=this.parser(this.getValue(a||this.id,"{}"))}catch(d){this.log("GM_config failed to read saved settings!");var c={}}return c},reset:function(){var a=this.fields;for(var c in a)a[c].reset();this.onReset()},create:function(){switch(arguments.length){case 1:var a=document.createTextNode(arguments[0]);break;default:var a=document.createElement(arguments[0]),c=arguments[1];for(var d in c)0==d.indexOf("on")?a.addEventListener(d.substring(2),c[d],!1):-1==",style,accesskey,id,name,src,href,which,for".indexOf(","+d.toLowerCase())?a[d]=c[d]:a.setAttribute(d,c[d]);if("string"==typeof arguments[2])a.innerHTML=arguments[2];else for(var f=2,g=arguments.length;f<g;++f)a.appendChild(arguments[f]);}return a},center:function(){var a=this.frame;if(a){var c=a.style,d=c.opacity;"none"==c.display&&(c.opacity="0"),c.display="",c.top=Math.floor(window.innerHeight/2-a.offsetHeight/2)+"px",c.left=Math.floor(window.innerWidth/2-a.offsetWidth/2)+"px",c.opacity="1"}},remove:function(a){a&&a.parentNode&&a.parentNode.removeChild(a)}},function(){var c,d,f,g,a="undefined"!=typeof GM_getValue&&"undefined"!=typeof GM_getValue("a","b");a?(c=GM_setValue,d=GM_getValue,f="undefined"==typeof JSON?function(h){return h.toSource()}:JSON.stringify,g="undefined"==typeof JSON?function(h){return new Function("return "+h+";")()}:JSON.parse):(c=function(h,k){return localStorage.setItem(h,k)},d=function(h,k){var m=localStorage.getItem(h);return null==m?k:m},f=JSON.stringify,g=JSON.parse),GM_configStruct.prototype.isGM=a,GM_configStruct.prototype.setValue=c,GM_configStruct.prototype.getValue=d,GM_configStruct.prototype.stringify=f,GM_configStruct.prototype.parser=g,GM_configStruct.prototype.log=window.console?console.log:a&&"undefined"!=typeof GM_log?GM_log:window.opera?opera.postError:function(){}}();function GM_configDefaultValue(a,c){var d;return 0==a.indexOf("unsigned ")&&(a=a.substring(9)),d="radio"===a||"select"===a?c[0]:"checkbox"!==a&&("int"===a||"integer"===a||"float"===a||"number"===a?0:""),d}function GM_configField(a,c,d,f,g){this.settings=a,this.id=d,this.configId=g,this.node=null,this.wrapper=null,this.save=!("undefined"!=typeof a.save)||a.save,"button"==a.type&&(this.save=!1),this["default"]="undefined"==typeof a["default"]?f?f["default"]:GM_configDefaultValue(a.type,a.options):a["default"],this.value="undefined"==typeof c?this["default"]:c,f&&(this.toNode=f.toNode,this.toValue=f.toValue,this.reset=f.reset)}GM_configField.prototype={create:GM_configStruct.prototype.create,toNode:function(){function a(z,C,D,E){E||(E=D.firstChild),"right"===z||"below"===z?("below"==z&&D.appendChild(n("br",{})),D.appendChild(C)):("above"==z&&D.insertBefore(n("br",{}),E),D.insertBefore(C,E))}var p,c=this.settings,d=this.value,f=c.options,g=c.type,h=this.id,k=this.configId,m=c.labelPos,n=this.create,o=n("div",{className:"config_var",id:k+"_"+h+"_var",title:c.title||""});for(var q in c){p=q;break}var r=c.label&&"button"!=g?n("label",{id:k+"_"+h+"_field_label",for:k+"_field_"+h,className:"field_label"},c.label):null;let t;switch(g){case"textarea":o.appendChild(this.node=n("textarea",{innerHTML:d,id:k+"_field_"+h,className:"block",cols:c.cols?c.cols:20,rows:c.rows?c.rows:2}));break;case"radio":t=n("div",{id:k+"_field_"+h}),this.node=t;for(let z=0,C=f.length;z<C;++z){var u=n("label",{className:"radio_label"},f[z]),v=t.appendChild(n("input",{value:f[z],type:"radio",name:h,checked:f[z]==d})),w=m&&("left"==m||"right"==m)?m:"options"==p?"left":"right";a(w,u,t,v)}o.appendChild(t);break;case"select":t=n("select",{id:k+"_field_"+h}),this.node=t;for(let z=0,C=f.length;z<C;++z){var x=f[z];t.appendChild(n("option",{value:x,selected:x==d},x))}o.appendChild(t);break;default:var y={id:k+"_field_"+h,type:g,value:"button"==g?c.label:d};switch(g){case"checkbox":y.checked=d;break;case"button":y.size=c.size?c.size:25,c.script&&(c.click=c.script),c.click&&(y.onclick=c.click);break;case"hidden":break;default:y.type="text",y.size=c.size?c.size:25;}o.appendChild(this.node=n("input",y));}return r&&(!m&&(m="label"==p||"radio"==g?"left":"right"),a(m,r,o)),o},toValue:function(){var a=this.node,c=this.settings,d=c.type,f=!1,g=null;if(!a)return g;switch(0==d.indexOf("unsigned ")&&(d=d.substring(9),f=!0),d){case"checkbox":g=a.checked;break;case"select":g=a[a.selectedIndex].value;break;case"radio":for(var h=a.getElementsByTagName("input"),k=0,m=h.length;k<m;++k)h[k].checked&&(g=h[k].value);break;case"button":break;case"int":case"integer":case"float":case"number":var n=+a.value,o="Field labeled \""+c.label+"\" expects a"+(f?" positive ":"n ")+"integer value";if(isNaN(n)||"int"==d.substr(0,3)&&Math.ceil(n)!=Math.floor(n)||f&&0>n)return alert(o+"."),null;if(!this._checkNumberRange(n,o))return null;g=n;break;default:g=a.value;}return g},reset:function(){var a=this.node,c=this.settings,d=c.type;if(a)switch(d){case"checkbox":a.checked=this["default"];break;case"select":for(var f=0,g=a.options.length;f<g;++f)a.options[f].textContent==this["default"]&&(a.selectedIndex=f);break;case"radio":for(var h=a.getElementsByTagName("input"),f=0,g=h.length;f<g;++f)h[f].value==this["default"]&&(h[f].checked=!0);break;case"button":break;default:a.value=this["default"];}},remove:function(a){GM_configStruct.prototype.remove(a||this.wrapper),this.wrapper=null,this.node=null},reload:function(){var a=this.wrapper;if(a){var c=a.parentNode;c.insertBefore(this.wrapper=this.toNode(),a),this.remove(a)}},_checkNumberRange:function(a,c){var d=this.settings;return"number"==typeof d.min&&a<d.min?(alert(c+" greater than or equal to "+d.min+"."),null):"number"==typeof d.max&&a>d.max?(alert(c+" less than or equal to "+d.max+"."),null):!0}};var GM_config=new GM_configStruct;

let $=window.$, jQuery=window.jQuery;
(function($,jQuery) {
    'use strict';
    jQuery.browser = {};
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }

    window.onscroll = function (){
        let floatElement=$('body');
        if (window.scrollY > $('.content').offset().top) {
            if (!floatElement.hasClass('scroll')) {
                floatElement.addClass('scroll');
            }
        } else{
            if (floatElement.hasClass('scroll')) {
                floatElement.removeClass('scroll');
            }
        }
    };


    GM_config.init(
        {
            'title': 'Настройки',
            'id': 'MyConfig', // The id used for this instance of GM_config
            'fields': // Fields object
            {
                'association': {
                    'label': 'Поле поиска ассоциаций',
                    'type': 'checkbox',
                    'default': false
                },
                'Key': // This is the id of the field
                {
                    'label': 'Ключ от сервиса <a href="https://api.wordassociations.net/subscriptions/" target="_blank">https://api.wordassociations.net/subscriptions/</a>', // Appears next to field
                    'type': 'text', // Makes this setting a text field
                    'default': '' // Default value if user doesn't change it
                },
                'pos':{
                    'label':'<b>noun</b> — существительное; <b>adjective</b> — прилагательное; <b>verb</b> — глагол; <b>adverb</b> — наречие;<br>'
                    +'Если пусто то - <b>noun,adjective,verb,adverb</b>. Разделитель <b>запятая</b>.',
                    'type': 'text',
                    'default':'noun,adjective,verb,adverb'
                },
                'type':{
                    'label':'Тип возвращаемого результата.<br> '
                    +'<b>stimulus</b> — список слов-стимулов, которые чаще всего побуждают подумать о заданном слове-ответе;<br>'
                    +'<b>response</b> — список ассоциативных слов-ответов, которые приходят на ум для заданного слова-стимула.',

                    'options': ['stimulus', 'response'],
                    'type': 'radio',
                    'default': 'stimulus'
                },
                'tmp': // This is the id of the field
                {
                    'label': 'Поле для заметок', // Appears next to field
                    'type': 'textarea', // Makes this setting a text field
                    'default': '' // Default value if user doesn't change it
                }
            },
            'css':
            '#MyConfig .field_label { display: block;font-weight: normal; margin-top:15px; }'
            +'#MyConfig input[type=text]{ width:100%;}'
            +'#MyConfig textarea{ width:100%; height:150px;}'
        });

    const openConfig= ()=>{GM_config.open();};
    GM_registerMenuCommand( 'Open EN Config',  openConfig);

    let audio = {
        player: new Audio(),
        src:{
            correct:
            'data:audio/ogg;base64,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',
            new:'data:audio/ogg;base64,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'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uSxDkDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7ksQ5A8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqoh6gAB35UyhYjqOmkOpevAxhSTT0MAgUBvUey05ccvg7pc8wAwAy37MgIAEAgCGmlsE1F9l3y7btF1DAAACMAQAIwCwA2ho2GAAAECgAG9QToDxEAAYJ4I5QCcYFQKRgyAyGCgBQIwOzBvCNMH0B'+
            '0wgA7/+5LEOQPAAAGkAAAAIAAANIAAAAQDF5FPMgMAAyJjZDQGQIM2gigwJyiTQpUFNH8Wc07n2Dyft7ODsbc24rfj3w5GOaBrAx3k2TiZrBO0Og03PTZTGNQDM/8vExyw/wwxhxxywAAAAP8wLcA8MC'+
            'iAPTBfFdk7y3aT75ghYFSYACBPnGzk7Z2Q82r/mCSgUZgHACIZW2llGtbGNH+YkIKJhEBDGtbMMa5i8//5gCAEmCwBFGjh9UxMHY3UyfQtP//AwCBgTAMAwAEDARmPkDsZHwuhhNDNkxO3//+KABmA+B'+
            'KGARmBmBWRAVmJUDYYQAU5jJgqmDACiYb4EH///6dAKAbZg2mfmBmAqYDoBxgjgRpd0nP/////////PDedjef///////////9jedgThE//6AfAYeB8B//8PA+Aw8D4Lg6f////6ROFw+Jx4fE4HD8zpC'+
            'ETGaCGMtNcw0RqJzucsBOdhHM12Kjzrw8BP97N0yFSnTQpNQNJNEozPk9TTKTBNt448zbCUTG6CXMhc+wztFA7c9Y6bLIz9gAylB4ziGMz//uSxP+AF4CWKnWPAAPDnmLnP+AADWow4IQ0+JsyZVA0ND'+
            '4xgBcyvCgwADkxhNIy3B4wOBgwrDYw7AMxvB4weBEw7BkwPEAwcFYxLFkwhBwwaBEwyCcwnGYwtCcyBAQsBGCgiMLQiMHwRMNwyMFQaMcB5Eg6MIhQMhQgMPAWMPgyMZBaBIYBYMzBgUgsDphuEIKAAu'+
            'ExiHrPqGagaIanA2Zh6ndmHIQ8Y641JmZCBGjWRoYgi1RqptYGVkKsZKweJhIjumCUEuY/QNBkuAymEaGwYIIYhidjJHoIaa/UB3sKG9sSdIdpmZrnWkGcsE5oMCGpAIj0YLBxloFmkhODpkacDKKpjo'+
            'FGmCUHZczaGTdoCMYFsxYIysGmFBiIieYcJRglFmLweYfMRqMmgw1mSzkYHFRmUzGc1SaFBJkQMGSEGZtFhh0hGwDEZaKZjRJGeAWZeLBlwHEJSAImQ8QRqQZ4NRUlgzq5NRs88QmsNPCGuzeAjkk24G'+
            'GGMBYQFjE9gh8+ytelMt1PPDLkUOc01YtPMQwPNTNVifo0Bg8xMn5DWP/7ksTvg9rckxYd7oALIBHhwr3AATRminwwm0guOtJCM2eG4TMkkrOGgKgzfqrTBTbyM7cfs6djKzerdvMoZTs2jnMjmzVuOL'+
            'VAUxoFvDW+FGMd4hwz6y8TdtZwNZIoo9kECjOaEmN84pk0rDJDP4aVM5sss1CEiTEERnNBhdkxbGkDGXarOS0XY3wVHDZxEnN1Mv039CLjhJDxMX5dAzfD2TfmCCMJAksxJEYDHBcqOM5akxB0dzeKFL'+
            'MG0JUwBgBZOZrxZZl+sQmboJmYyIPxgGgTQIYx4mBitlOmRINyYSoAg4Aa03n//6/f///9//////9H7v////9IAAECCBvfEPSafO5BnAeOjxkfTcuYwmbhGhrmOB2EAYSaXEhDnA/sGJhJRp6YYQb7mE'+
            'ZhIxt9IjSazkIkmn7oEZpQArcYeAPPmQHDeJh3hbWZymNnmSOkWZi4QgyYIwFfmHMB15i+wPIZp2MsmNbEbJhmgkeZiKAOGENCTBh8AiuYQ8I7mJnBZ5i4AQ6ZoyPaGHGDHJhMhAQZ2oKemICDe5lcAP'+
            'wYOkP/+5LE5oAktLruGf8ABRMXXMs/8ADhGD2iSRgdANCYHgCrGGhiRRktIh6Ys4FlGirDS5iVQZcYqCbUGA/kZRiVweQYhuOGmRLDJ5jBwySYCgBMGE8hwxhroWEYIOESGEYgyxkvg12YFGKlmHxDWh'+
            'gUwA2QgEpEARmLRmIxjEQbcYaOGAmB+gBAUAShoAGMFLBcjBUwrAwscHuMDdAFkJreWP///9////2+twvb/3//+9JVdQFMjcDp8Y9XOO3kDYSgkHzOEU0ZDM2KwULJkqtMBFjKTAy0eAoWZwtm0MIs/N'+
            'lVO1RNsTGShp1RoQwWMmqWkxIxyU1i00x0yANkgNBGLHGPFLdQTKSCwUyBcyw9CgyKQ16weImJNGdLBhIRATEB0oQCSM2YRwMecNCaMiAYGAAoKCtcTGZ4AQhhwhb572UrFfm5j9WGX9h2W4Vjv//WCv'+
            '8Gga////iUFUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSxHeD1QCixD29AAAAADSAAAAEVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksQ5A8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVX/+5LEOQPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'+
            'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVAYGDXnwCANM+ORCNcIMK1OvpPLFAJ48uc5Y0zU482o7TgC'+
            'Hzn6T10wM+MQRNMPQVEAOGGAbGGAPBgCmCYSmFIRhARiEAwUAbB5+YawsI8oNAEwSAwaAQEgWYKguYIgKpUYEAkYJAUrkwIA4BAo10tWYA//uSxDkDwAABpAAAACAAADSAAAAEgCWbLxozGEQaGLIjgI'+
            'ajFQijKYpDIQRhCJ5kCUJmilZte7Z0pExrgBRrXLZ3DfJ7nOZmuuB2dzB+dtBzokhi8oRqMeBksLxicKBiUGxWCxgmFJhmGZhWDKECM5gSCJguCYYCYWAwwcCQwkBZAKYMA4DggCoGmC4MmCoDpzGBQK'+
            'GCwIDwAAwAC3j2PuztnblyN9Fjv8jwXIXonuYAgOJAOBAOMLQnFgrMFA2MShMMQAkCwKmHYnmJYRmCAlGTJJmNoRmEAyGRRLGRQzGFgAmIo1mN4ngEKjH8iTHMPwuExiYMBjILRiIFBQCBgGDZhiG5jg'+
            'JxgoEpjeUZlyWJkSHJhERRmgexnkWxhoIZmcbBlIGBiWVJmubpl2O5gKLhlgcBnMXRi0AZkITxkEHRgGJZjaOpjOI5gmBRh8LhjILChDAzFfhG0ykUnXMh/IVToGjtBk6JRiv4LmZIGECH10vJJyMbuc'+
            'W8hsyI4W4MKnDETH+nyMyH42easxMyfg6zLTIXOKCxE1NWvrl+wYAQTP/7ksT/gwAAAaQAAAAmvqqGCrXQABhLhqmF6AgZzZnJldnFmBEj1//wwygfjCcB6MGIGwwagLDGvN1MfEUExTBljB+H95n3uB'+
            'iZArGFOGWYN4BZhsgamDkEQYnhjZjmDpGTWDuZApNxg7A5/zv/4OB8MIoFQSAhV/DnDFmATMMYJcDB4AIDxy+GUqEHZlzg7eZoMPyG0nvNxuELIUbUqVFGf8GBJpWTK+bncr2mOAKkZpuB0SZ8MQvmRu'+
            'jbhhwYiyZPGRbGK8h/xgm4FAYqqXuGuY1QadGrZg1guGA2jeYRx6ZithFmpqXYY2xyRjCBjmP8G2YuZDhkxgzAAFYweBgDGhHaBgExh1iNGJKDEYzQFo0LmYeQKRi6BzmJ6IMYh4e5jciCGF4GgYKoWJ'+
            'g7g0GAWJiYKQMZhrAPmGcCiYK4ZAsHGYK4MJgrirAYLQxJwQDBQCPMD4I0w0ANzD7BOIARjDjEBMSwOYwghBjAbCgMF4BEwDQYTBSA4MAgDMwIAAwaAiwV/nWh7Koypi0jFCFvMT0w4xxgWzHeCpMckJ'+
            'oxtRL/+5LE7gAYTJ0QGf8ABAOTIMO/4ABzL3RWMuc8wyig2THeH3MAoYgwgwSjC9FXMG4L8wKAxzCyAZMQMWg3YXjY+EMUIowivDGZUBpdM4H8x4FDEpiCGIYsMhgIeGFBmY5HAUBAXIhgYGmTyCYVCp'+
            'k80BwsMSp4wqBgER0swaUwqfDBYEMZAMiZwoADAwCFjmYHBxMVwAOjDA3DjIYJIIQKjHARMWjcOBZisHmOxaIxyYPEpgUGhQkoKKQljTqdBhgjxiu5xlE6JtjDxmMcxknC5kEgRliWZrQIpnmbhjWuZh'+
            'SCIKF8wFBUACYYShUEGQAjSAVSgZsgBzSAGpnAZI4Bt14OVCLgEBgAHoGNWgZGUBrDoA6UFKAGtIhaECIiBqzIGTEAYteBnFoG4YAJQgaU6ACGAGlASnB7YGTNAa0KDVuFj4BBQDLkQNvDA0qgDQBgM6'+
            'fAyi4DRHAMEOAzgUAaMAcvQXAwYgCzwMHC3qgYcWCMuANVA2ZkDQjQvD//AaAADSAwuDZwPmDFIAxf//8AZOIQDQAscEDA2MCOA9EBgH////uSxNKAGCyRFhXuAAT4ReRDO0AA/4Ch8QoTYOCCcgbEBc'+
            '4J5DGYDRMXB////+LLENE7A2OA2OC7E5gWFi2CCYzIoILYBYoMf/////////jvBQGMENvGfFnBdQA0AGXOBvYyIbeILjHCAAEgAzY5lXA2Gw2EwkCgkLR+Px8DiJC4JeZZ/+CXDHCcml/x400QX2Z7/h'+
            'cDGAh0Xl/21TxR/Wk4Ub//R4TmU1Q3vajTw//+5bII6wVi8Ron2lUz///gYAQ8JQNhxfpGiDIlFnRlNT///801DMCQTEzQzoGM6CDKzUwAgSrWBLeg0QC4EqMu7////54sgB4k9WfMfowvYFHyJvB0sC'+
            'bJEGABIFGBwxAA+ZIBmNpBhpMYSAgoZ//////N5ijhjs7FrNPcTJpozYjOiHzl0k3Z8M/gDVFdtTCQ4EGpgQ+HGpipkYKLBUFL4KzGHhH//////+cegmzpJpEMFj84o9OHFzfm4wd0MmZzbxs3UhNcbj'+
            'F0825PEuYKCYUBUCQFBkelHUyFgi+QMEQsBqQLvMOVV//////////pLv/7ksSZACidv125nYAQAAA0g4AABF3t+xXq2rGF3t+xXq5WPVF9i9RMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+
            'qqqqpUQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
            'AAAAAAAAAAAAAAAAAAAAAA/w=='}
    };
    const soundPlay = (type)=>{
        audio.player.src = audio.src[type];
        audio.player.autoplay = true;
    };
    let style ='.imgWrap{position:relative;display: inline-block;}'+
        '.imgWrap .imgLnk{background:#fff;padding:0 5px;position: absolute;z-index: 10000;left: 0;top: 0;opacity: .4;}'+
        '.imgWrap .imgLnk:hover{opacity: 1;}'+
        '.imgWrap .imgLnk a{color:#000; font-size:12px;}'+

        '.aside {z-index: 1000; position: fixed; left: 0; top: 240px; width: 240px; height: 250px; background: rgb(29, 29, 29);'+
        ' padding: 30px 30px 10px 10px; border: 2px solid #007f01; border-left: none; border-radius: 0 10px 10px 0; overflow: hidden; }'+
        '.pane { height: auto; }'+
        '.blockageinfo{position: absolute!important;top: 2px;right: 5px;width: 97px;font-size: 10px;text-align: right;}'+
        '.aside form label { display: none! important; }'+
        '.aside form { display: flex; align-items: center; height: auto; margin-bottom:5px; }'+
        '.hidden { display: none! important; }'+
        'input#Answer, input#answ, input#BonusAnswer, #message { width: 200px; border-radius: 5px 0 0 5px; outline: none;}'+
        '.aside .submit { display: block ! important; width: 28px; border-radius: 0 10px 10px 0; border: 1px solid #707070; border-left: none; }'+
        '.history {height: 223px; font-size: 10px;line-height: 14px;}'+
        '.loaded{position:relative;}'+
        '.loaded:before{z-index:100;position: absolute; content:""; left:0; right:0; top:0; bottom:0; background:rgba(29, 29, 29, 0.5)}'+
        '.loaded:after{z-index:101;position: absolute; content:"";left:0; right:0; top:0; height: 300px;'+
        ' background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0i'+
        'VVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAv'+
        'c3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3L'+
        'nczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXd'+
        'Cb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNzUuNCAxMjYuNjNhMT'+
        'EuNDMgMTEuNDMgMCAwIDEtMi4xLTIyLjY1IDQwLjkgNDAuOSAwIDAgMCAzMC41LTMwLjYgMTEuNCAxMS40IDAgMS'+
        'AxIDIyLjI3IDQuODdoLjAyYTYzLjc3IDYzLjc3IDAgMCAxLTQ3LjggNDguMDV2LS4wMmExMS4zOCAxMS4zOCAwIDA'+
        'gMS0yLjkzLjM3eiIgZmlsbD0iI2ZmMDAwMCIgZmlsbC1vcGFjaXR5PSIxIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0c'+
        'mlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNjQgNjQiIHRvPSIzNjAgNjQgNjQiIGR1'+
        'cj0iNjAwbXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9nPjwvc3ZnPg==")  no-repeat center;'+
        '}'+
        '.chat, #ChatForm { display: none !important; }'+
        '#reloadLog{ cursor:pointer; position: absolute; left:10px; top:5px; display: inline-flex;align-items: center;}'+
        '#reloadPage{ cursor:pointer; position: absolute; left:70px; top:5px; display: inline-flex;align-items: center;}'+
        '.content {height: auto!important;min-height: 100%;}'+
        '.history .correct{ background:#023502;}'+
        '.history .color_correct{ background:#023502; color:#fff!important;}'+
        '#incorrect{ background:red; color:#fff;}'+
        '.header ul{display: flex;flex-direction: row;align-items: center;justify-content: flex-start;}'+
        '.history .my{ background:#1b354c;}'+
        '.rb{border-color: red !important;}'+
        '.gb{border-color: #06f706;}'+

        '#sendLog {z-index:10000;border:2px solid #007f01; padding: 5px; position: fixed; top: 100px; left: 0; width: 270px; max-height: 120px;overflow: auto;background: rgb(29, 29, 29);}'+
        '#sendLog span{ margin-left:5px;}'+
        '#sendLog ul{  line-height: 12px;display:flex; flex-wrap: wrap; list-style: none; padding: 0; margin: 0; font-size: 11px;}'+
        '#sendLog li:after{content:","; margin-right:5px;}'+
        '#sendLog li:last-child:after{display:none;}'+

        '.aside .submit{transition: all .1s ease;}'+
        '.aside .submit.state_1{background: #a70c28;}'+
        '.aside .submit.state_2{background: #845d13;}'+
        '.aside .submit.state_3{background: #134817;}'+
        '.aside .submit.state_4{background: #494949;}'+

        '#checkWord {z-index:10000;border:2px solid #007f01; padding: 5px; position: fixed; top: 540px; bottom:0; left: 0; width: 270px; overflow: auto;background: rgb(29, 29, 29);}'+

        '#checkWord ul{  line-height: 12px;display:flex; flex-wrap: wrap; list-style: none; padding: 0; margin: 0; font-size: 11px;}'+
        '#checkWord li:after{content:","; margin-right:5px;}'+
        '#checkWord li:last-child:after{display:none;}'+
        '#checkWord form { display: flex; align-items: center; height: auto; margin-bottom:5px; }'+
        '#checkWord input{border-radius: 3px 0 0 3px;width: 215px;}'+
        '#checkWord input[type="checkbox"]{width: 30px;height: 20px;min-width: 30px;}'+
        '#checkWord .check{ position:absolute; right: 0;top: 3px; display: flex;align-items: center;}'+
        '#checkWord .submit { display: block ! important; width: 28px; border-radius: 0 10px 10px 0; border: 1px solid #707070; border-left: none; }'+

        '::-webkit-scrollbar {width: 10px;height: 10px;} ::-webkit-scrollbar-thumb {-color: #545d68a8;border: 1px solid #4848484d;border-radius: 15px!important;} ::-webkit-scrollbar-track {background-color: transparent;} ::-webkit-scrollbar-thumb:hover {background: #282828c9;} ::-webkit-scrollbar-thumb:active {background: #181818;} ::-webkit-scrollbar-corner {background: #383838;}'+

        '.scroll .aside{top: 140px !important;}'+
        '.scroll #sendLog{top: 0 !important;}'+
        '.scroll #checkWord{top: 440px !important;}'+
        '#MyConfig{z-index: 1000000 !important;}'+
        '';

    GM_addStyle(style);

    $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons"rel="stylesheet">');
    // $('head').append('<script type="text/javascript" src="http://cdn.endata.cx/images/personal/578001/jquery.jscrollpane.min.js"></script>');
    $('.aside')
        .append('<div id="reloadLog">Лог <i class="material-icons">autorenew</i></div>'+
                '<div id="reloadPage">Контент <i class="material-icons">autorenew</i></div>' );
    let inpName='#answ';
    if($('#Answer').length>0){
        inpName='#Answer';
    }

    $('.container').append( '<div id="sendLog">В отправке<ul></ul></div>');
    let sendCount = $('#sendLog span'),
        sendList = $('#sendLog ul');
    const changeSendCnt = (key)=>{
        let send=true;
        if(key!=undefined){
            $.each(sendList.find('li'),(i,item)=>{
                let text=$(item).text().toLowerCase();
                if(text==key.toLowerCase()){
                    send=false;
                }
            });
            if(send){
                sendList.append('<li onClick="$(this).remove();">'+key+'</li>');
                $.each($('#checkWord ul li'),(i,item)=>{
                    let text=$(item).text().trim().toLowerCase().replace("ё", "е");
                    if(/([а-яёa-z\-_]+)/gim.test(key.toLowerCase().replace("ё", "е"))){
                        if(text==/([а-яёa-z\-_]+)/gim.exec(key.toLowerCase().replace("ё", "е"))[0].trim()){
                            $(item).remove();
                        }
                    }
                });
            }
        }
    };
    const delInSendList =(key)=>{
        if(key!=undefined){
            $.each(sendList.find('li'),(i,item)=>{
                let text=$(item).text().toLowerCase();
                if(text==key.toLowerCase()){
                    $(item).remove();
                }
            });
        }
    };

    if(GM_config.get('association')){

        let add='';
        if(GM_config.get('Key')!=''){
            add='<div class="check">soc <input id="sociation" type="checkbox" value="Y" checked title="Искать sociation"  >'+
                ' | world <input id="wordassociations" type="checkbox" value="Y" checked title="Искать wordassociations" ></div>';
        }
        $('.container').append( '<div id="checkWord">Ассоциации'+
                               '<form id="assocWorfForm">'+
                               '<input id="associationWord" autocomplete="off" placeholder="Подобрать ассоциацию">'+
                               '<input type="submit" class="submit" value=">>">'+
                               add +
                               '</form>'+
                               '<ul></ul></div>');
        let assocReq=null, assocService2=null;
        $('#assocWorfForm').on('submit',function(){
            if(assocReq!=null){
                assocReq.abort();
            }
            if(assocService2!=null){
                assocService2.abort();
            }
            $('#checkWord ul li').remove();
            $('#checkWord').addClass('loaded');


            let sociation=$('#sociation');
            if(sociation.length>0){sociation= $(sociation).prop('checked');}
            else {sociation=true;}

            let wordassociations=$('#wordassociations');
            if(wordassociations.length>0){ wordassociations= $(wordassociations).prop('checked');}
            else{ wordassociations=true;}

            if(sociation){
                assocReq=GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://sociation.org/ajax/word_associations/?word='+$('#associationWord').val(),
                    onload: function (results) {
                        $('#checkWord').removeClass('loaded');
                        try {
                            let inputed=[];
                            $.each($('.history li>span'),(i,item)=>{
                                inputed.push($(item).text().trim());
                            });
                            $.each(jQuery.parseJSON(results.responseText).associations,(i, item)=>{
                                if(inputed.indexOf(item.name.toLowerCase())==-1){
                                    $('#checkWord ul').append('<li onClick="$(this).remove();">'+item.name.toLowerCase()+'</li>');
                                }
                            });

                        }
                        catch (err) {}
                        assocReq=null;
                    },
                    onerror: function(res) { assocReq=null;}
                });
            }
            if(wordassociations){
                let apikey = GM_config.get('Key'),
                    pos= GM_config.get('pos'),
                    type=GM_config.get('type');

                if(apikey!="" && apikey!=false){
                    assocService2 = GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://api.wordassociations.net/associations/v1.0/json/search?apikey='+apikey+'&pos='+pos+'&type='+type+'&lang=ru&limit=300&text='+$('#associationWord').val(),
                        onload: function (results) {
                            $('#checkWord').removeClass('loaded');
                            try {

                                let inputed=[];
                                $.each($('.history li>span'),(i,item)=>{
                                    inputed.push($(item).text().trim());
                                });
                                $.each(jQuery.parseJSON(results.responseText).response[0].items,(i, item)=>{
                                    if(inputed.indexOf(item.item.toLowerCase())==-1){
                                        $('#checkWord ul').append('<li onClick="$(this).remove();">'+item.item.toLowerCase()+'</li>');
                                    }
                                });
                            }
                            catch (err) {}
                            assocReq=null;
                        },
                        onerror: function(res) { assocReq=null;}
                    });
                }
            }
            return false;
        });
    }
    let currentLogList = {
        'all':[],
        'correct':[],
        'world':[]
    };

    const getAnswers = ()=>{
        let answers=$('.history li>span');
        $.each(answers,(i,item)=>{
            let key=$(item).text().trim();
            if(currentLogList.all.indexOf(key)==-1){
                currentLogList.all.push(key);
            }
            if($(item).hasClass('color_bonus') && currentLogList.correct.indexOf(key)==-1){
                currentLogList.correct.push(key);
            }
            delInSendList(key);
        });
    };
    getAnswers();

    let userName=$('#ChatForm input[name="login"]').val();

    const highlightMy=(name)=>{
        let history=$('.history li a');
        $.each(history, (i, item)=>{
            if($(item).text()==name){
                $(item).parent().addClass('my');
            }
        });
    };
    highlightMy(userName);


    let bonusCount=$('.color_correct').length;
    $('<li><div style="text-align: center; ">Ответов<input type="text" disabled id="bonusCount" style="width: 60px;text-align: center;" value="'+ bonusCount+
      '"></div></li>').insertBefore('.header .refresh');
    const bonusCountUpdate = (where)=>{
        $('#bonusCount').val($(where).find('.color_correct').length);
    };

    let reloadTime = localStorage.getItem('reloadTime');
    if(reloadTime==false || reloadTime==NaN || reloadTime==null){
        reloadTime=20;
    }
    reloadTime=parseInt(reloadTime);

    $('<li><div style="text-align: center; ">Автообновление<input type="number" id="reloadTime" style="width: 40px;" value="'+reloadTime+
      '"></div></li>').insertBefore('.header .refresh');

    $('#reloadTime').on('change',function(){
        reloadTime=parseInt($(this).val());
        if(reloadTime<5) {
            reloadTime=5;
            $(this).val(5);
        }
        localStorage.setItem('reloadTime', reloadTime);
    });

    let currentLevel = $('.content>h2').text();
    let request=null ;
    const GetDate = (d)=>{
        if(request!=null){
            request.abort();
        }
        if(req!=null){
            req.abort();
        }
        request=GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href,
            onload: function (results) {
                try {
                    d.resolve(results.responseText);
                }
                catch (err) {d.reject();}
                request=null;
            },
            onerror: function(res) {
                alert("Ошибка получения данных, возможны проблемы с интернетом или авторизацией.");
                d.reject();
                request=null;
            }});
    };
    const imgLnkAdd = ()=>{
        let arImg=$('.content  img');
        $.each(arImg, function( index, img ) {
            img=$(img);
            let div='<div class="imgWrap"></div>';
            let src=img.prop('src');
            let block='<div class="imgLnk"  >'+
                '<a href="'+src+'" target="_blank">Source</a><br>'+
                '<a href="https://www.google.com/searchbyimage?image_url='+(src)+'" target="_blank">Гугл</a><br>'+
                '<a href="https://yandex.ru/images/search?rpt=imageview&cbird=1&img_url='+encodeURIComponent(src).replace(/%20/g,'+')+'" target="_blank">Яндекс</a>'+
                '</div>'
            $(div).insertBefore(img).append(img).append(block);
        });
    }
    const checkLogin = (data)=>{
        if($(data).find('#formMain').length>0) {
            window.location.href= '/Login.aspx?return='+encodeURIComponent(window.location.href).replace(/%20/g,'+');
        }
    };
    const insertData = (data, body, input)=>{
        let history=$(data).find('.history');
        $('.aside .history').removeClass('loaded').html(history.html());
        $('input[name="LevelId"]').val($(data).find('input[name="LevelId"]').val());
        $('input[name="LevelNumber"]').val($(data).find('input[name="LevelNumber"]').val());
        highlightMy(userName);
        getAnswers();
        if(body){
            let content=$(data).find('.content');
            $('.content').removeClass('loaded');
            $('.content').html($(content).html());
            imgLnkAdd();
        }
        bonusCountUpdate($(data).find('.content'));
    };
    const initDef = (why,input )=>{
        let d = $.Deferred();
        d.done(function (data){
            clearTimeout(timerId);
            checkLogin(data);
            let title=$(data).find('.content>h2').text();
            if(title!=currentLevel){
                why=true;
                currentLevel=title;
                soundPlay('new');
            }else{
                if($(data).find('.history>li.color_correct').length>0){
                    why=true;
                    soundPlay('correct');
                }
            }

            let kode=$(input).val();
            delInSendList(kode);

            insertData(data,why,input);
            timerId = setInterval(logLoad, reloadTime*1000);
        });
        d.fail(function (){
            clearTimeout(timerId);
            timerId = setInterval(logLoad, reloadTime*1000);
            $('.aside .history').removeClass('loaded');
            if(why){
                $('.content').removeClass('loaded');
            }
            bonusCountUpdate();
            let kode=$(input).val();
            delInSendList(kode);
        });
        return d;
    };
    const logLoad = ()=>{
        $('.aside .history').addClass('loaded');
        GetDate(initDef(false, false));
    };
    let timerId = setInterval(logLoad, reloadTime*1000);

    $('#reloadLog').on('click',function(){
        clearTimeout(timerId);
        logLoad();
        return false;
    });

    $('#reloadPage').on('click',function(){
        $('.content').addClass('loaded');
        clearTimeout(timerId);
        GetDate(initDef(true, false));
        return false;
    });
    let req =null;
    const sendData = (d,form)=>{
        if(request!=null){
            request.abort();
        }
        if(req!=null){
            req.abort();
        }

        let submit=$($(form).find('.submit'));
        submit.removeClass('state_1').removeClass('state_2').removeClass('state_3').removeClass('state_4');
        req = GM_xmlhttpRequest({
            method: 'POST',
            url: window.location.href,
            data:form.serialize() ,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onreadystatechange: function(res) {
                submit.removeClass('state_1').removeClass('state_2').removeClass('state_3').removeClass('state_4').addClass('state_'+res.readyState);
            },
            onload: function (results) {
                try {
                    d.resolve(results.responseText);
                }
                catch (err) {d.reject();}
                req=null;
            },
            onerror: function(res) {
                alert("Ошибка получения данных, возможны проблемы с интернетом или авторизацией.");
                d.reject();
                req=null;
            }});
    }

    let form,inputForm;
    if($('#Answer').length>0){
        form=$('#Answer').parent();
        inputForm=$('#Answer');
    }else{
        form=$('#answ').parent();
        inputForm=$('#answ');
    }
    let selectFieldStat='';
    if(localStorage.getItem('selectField')==true || localStorage.getItem('selectField')=='true'){ selectFieldStat=' checked '; }
    form.append('<input type="checkbox" value="Y" id="selectField" '+selectFieldStat+' title="Выделять текст сразу" style="width: 30px;height: 20px;min-width: 30px;">');

    $('#selectField').on('change',function(){
        localStorage.setItem('selectField', $(this).prop('checked'));
    });

    form.on('submit',function(){
        $('.content').addClass('loaded');
        $('.aside .history').addClass('loaded');
        clearTimeout(timerId);

        let input='#Answer';
        if($(input).length==0){
            input='#answ';
        }

        if($('#selectField').prop('checked')){
            $(input).select();
        }
        let kode=$(input).val();
        changeSendCnt(kode);

        sendData(initDef(true, input),form);
        return false;
    });

    let form2=$('#BonusAnswer').parent();;

    form2.on('submit',function(){
        $('.content').addClass('loaded');
        $('.aside .history').addClass('loaded');
        clearTimeout(timerId);
        if($('#selectField').prop('checked')){
            $('#BonusAnswer').select();
        }
        sendData(initDef(true, '#BonusAnswer'),form2);
        return false;
    });

    imgLnkAdd();

    inputForm.on('keyup',function(){
        //currentLogList
        if(currentLogList.all.indexOf($(this).val())!=-1){
            $(this).addClass('rb');
            $(this).removeClass('gb');
        }else{
            $(this).removeClass('rb');
            $(this).removeClass('gb');
        }

        if(currentLogList.correct.indexOf($(this).val())!=-1){
            $(this).removeClass('rb');
            $(this).addClass('gb');
        }else{
            $(this).removeClass('gb');
        }
    });

})($,jQuery);
try {
    $('#ChatFrame').remove();
    let history = $('.pane .history');
    $('.aside .pane').remove();
    $('.aside').append('<div class="pane"></div>');
    $('.pane').append(history);
}
catch (err) { }
