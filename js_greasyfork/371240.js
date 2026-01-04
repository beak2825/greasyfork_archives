// ==UserScript==
// @name         TagPro Userscript Library
// @description  Functions that any TagPro script could benefit from
// @author       Ko </u/Wilcooo> (https://greasyfork.org/users/152992)
// @version      4.13
// @license      MIT
// @match        *://*.koalabeast.com/*
// @match        *://*.jukejuice.com/*
// @match        *://*.newcompte.fr/*
// @downloadURL  https://raw.githubusercontent.com/wilcooo/TagPro-UserscriptLibrary/master/tpul.lib.js
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      koalabeast.com
// ==/UserScript==



// ==UserLibrary==
// @name         TagPro Userscript Library
// @description  Functions that any TagPro script could benefit from
// @version      4.12
// @license      MIT
// ==/UserLibrary==


var version = 4.12;
console.log('Loading TPUL (TagPro Userscript Library) version '+version);



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// To use this library, include these 5 lines in your userscripts' metadata block:

// @require      https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      koalabeast.com

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////






/* TODO

compatibility with SWJ (done I think)

Option to change the layout of the settings

Notify "options cancld" when scrolling away

margin beneath buttons on scoreboard

option to disable notifications.

ESC cancels, option to Save when canceld (scroll away, esc)

*/







var GM_configStruct = (function(){


////////////////////////////////////////////////////////////////
//    START OF ORIGINAL GM_CONFIG                             //
////////////////////////////////////////////////////////////////

/*
Copyright 2009+, GM_config Contributors (https://github.com/sizzlemctwizzle/GM_config)

GM_config Contributors:
    Mike Medley <medleymind@gmail.com>
    Joe Simmons
    Izzy Soft
    Marti Martz

GM_config is distributed under the terms of the GNU Lesser General Public License.

    GM_config is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function GM_configStruct(){if(arguments.length){GM_configInit(this,arguments);this.onInit()}}
function GM_configInit(config,args){if(typeof config.fields=="undefined"){config.fields={};config.onInit=config.onInit||function(){};config.onOpen=config.onOpen||function(){};config.onSave=config.onSave||function(){};config.onClose=config.onClose||function(){};config.onReset=config.onReset||function(){};config.isOpen=false;config.title="User Script Settings";config.css={basic:["#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }","#GM_config { background: #FFF; }","#GM_config input[type='radio'] { margin-right: 8px; }",
"#GM_config .indent40 { margin-left: 40%; }","#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }","#GM_config .radio_label { font-size: 12px; }","#GM_config .block { display: block; }","#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }","#GM_config .reset, #GM_config .reset a,"+" #GM_config_buttons_holder { color: #000; text-align: right; }","#GM_config .config_header { font-size: 20pt; margin: 0; }","#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
"#GM_config .center { text-align: center; }","#GM_config .section_header_holder { margin-top: 8px; }","#GM_config .config_var { margin: 0 0 4px; }","#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;"," font-size: 13pt; margin: 0; }","#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757;"+" font-size: 9pt; margin: 0 0 6px; }"].join("\n")+"\n",basicPrefix:"GM_config",stylish:""}}if(args.length==1&&typeof args[0].id=="string"&&typeof args[0].appendChild!=
"function")var settings=args[0];else{var settings={};for(var i=0,l=args.length,arg;i<l;++i){arg=args[i];if(typeof arg.appendChild=="function"){settings.frame=arg;continue}switch(typeof arg){case "object":for(var j in arg){if(typeof arg[j]!="function"){settings.fields=arg;break}if(!settings.events)settings.events={};settings.events[j]=arg[j]}break;case "function":settings.events={onOpen:arg};break;case "string":if(/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(arg))settings.css=arg;else settings.title=
arg;break}}}if(settings.id)config.id=settings.id;else if(typeof config.id=="undefined")config.id="GM_config";if(settings.title)config.title=settings.title;if(settings.css)config.css.stylish=settings.css;if(settings.frame)config.frame=settings.frame;if(settings.events){var events=settings.events;for(var e in events)config["on"+e.charAt(0).toUpperCase()+e.slice(1)]=events[e]}if(settings.fields){var stored=config.read(),fields=settings.fields,customTypes=settings.types||{},configId=config.id;for(var id in fields){var field=
fields[id];if(field)config.fields[id]=new GM_configField(field,stored[id],id,customTypes[field.type],configId);else if(config.fields[id])delete config.fields[id]}}if(config.id!=config.css.basicPrefix){config.css.basic=config.css.basic.replace(new RegExp("#"+config.css.basicPrefix,"gm"),"#"+config.id);config.css.basicPrefix=config.id}}
GM_configStruct.prototype={init:function(){GM_configInit(this,arguments);this.onInit()},open:function(){var match=document.getElementById(this.id);if(match&&(match.tagName=="IFRAME"||match.childNodes.length>0))return;var config=this;function buildConfigWin(body,head){var create=config.create,fields=config.fields,configId=config.id,bodyWrapper=create("div",{id:configId+"_wrapper"});head.appendChild(create("style",{type:"text/css",textContent:config.css.basic+config.css.stylish}));bodyWrapper.appendChild(create("div",
{id:configId+"_header",className:"config_header block center"},config.title));var section=bodyWrapper,secNum=0;for(var id in fields){var field=fields[id],settings=field.settings;if(settings.section){section=bodyWrapper.appendChild(create("div",{className:"section_header_holder",id:configId+"_section_"+secNum}));if(Object.prototype.toString.call(settings.section)!=="[object Array]")settings.section=[settings.section];if(settings.section[0])section.appendChild(create("div",{className:"section_header center",
id:configId+"_section_header_"+secNum},settings.section[0]));if(settings.section[1])section.appendChild(create("p",{className:"section_desc center",id:configId+"_section_desc_"+secNum},settings.section[1]));++secNum}section.appendChild(field.wrapper=field.toNode())}bodyWrapper.appendChild(create("div",{id:configId+"_buttons_holder"},create("button",{id:configId+"_saveBtn",textContent:"Save",title:"Save settings",className:"saveclose_buttons",onclick:function(){config.save()}}),create("button",{id:configId+
"_closeBtn",textContent:"Close",title:"Close window",className:"saveclose_buttons",onclick:function(){config.close()}}),create("div",{className:"reset_holder block"},create("a",{id:configId+"_resetLink",textContent:"Reset to defaults",href:"#",title:"Reset fields to default values",className:"reset",onclick:function(e){e.preventDefault();config.reset()}}))));body.appendChild(bodyWrapper);config.center();window.addEventListener("resize",config.center,false);config.onOpen(config.frame.contentDocument||
config.frame.ownerDocument,config.frame.contentWindow||window,config.frame);window.addEventListener("beforeunload",function(){config.close()},false);config.frame.style.display="block";config.isOpen=true}var defaultStyle="bottom: auto; border: 1px solid #000; display: none; height: 75%;"+" left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;"+" overflow: auto; padding: 0; position: fixed; right: auto; top: 0;"+" width: 75%; z-index: 9999;";if(this.frame){this.frame.id=this.id;this.frame.setAttribute("style",
defaultStyle);buildConfigWin(this.frame,this.frame.ownerDocument.getElementsByTagName("head")[0])}else{document.body.appendChild(this.frame=this.create("iframe",{id:this.id,style:defaultStyle}));this.frame.src="about:blank";this.frame.addEventListener("load",function(e){var frame=config.frame;var body=frame.contentDocument.getElementsByTagName("body")[0];body.id=config.id;buildConfigWin(body,frame.contentDocument.getElementsByTagName("head")[0])},false)}},save:function(){var forgotten=this.write();
this.onSave(forgotten)},close:function(){if(this.frame.contentDocument){this.remove(this.frame);this.frame=null}else{this.frame.innerHTML="";this.frame.style.display="none"}var fields=this.fields;for(var id in fields){var field=fields[id];field.wrapper=null;field.node=null}this.onClose();this.isOpen=false},set:function(name,val){this.fields[name].value=val;if(this.fields[name].node)this.fields[name].reload()},get:function(name,getLive){var field=this.fields[name],fieldVal=null;if(getLive&&field.node)fieldVal=
field.toValue();return fieldVal!=null?fieldVal:field.value},write:function(store,obj){if(!obj){var values={},forgotten={},fields=this.fields;for(var id in fields){var field=fields[id];var value=field.toValue();if(field.save)if(value!=null){values[id]=value;field.value=value}else values[id]=field.value;else forgotten[id]=value}}try{this.setValue(store||this.id,this.stringify(obj||values))}catch(e){this.log("GM_config failed to save settings!")}return forgotten},read:function(store){try{var rval=this.parser(this.getValue(store||
this.id,"{}"))}catch(e){this.log("GM_config failed to read saved settings!");var rval={}}return rval},reset:function(){var fields=this.fields;for(var id in fields)fields[id].reset();this.onReset()},create:function(){switch(arguments.length){case 1:var A=document.createTextNode(arguments[0]);break;default:var A=document.createElement(arguments[0]),B=arguments[1];for(var b in B)if(b.indexOf("on")==0)A.addEventListener(b.substring(2),B[b],false);else if(",style,accesskey,id,name,src,href,which,for".indexOf(","+
b.toLowerCase())!=-1)A.setAttribute(b,B[b]);else A[b]=B[b];if(typeof arguments[2]=="string")A.innerHTML=arguments[2];else for(var i=2,len=arguments.length;i<len;++i)A.appendChild(arguments[i])}return A},center:function(){var node=this.frame;if(!node)return;var style=node.style,beforeOpacity=style.opacity;if(style.display=="none")style.opacity="0";style.display="";style.top=Math.floor(window.innerHeight/2-node.offsetHeight/2)+"px";style.left=Math.floor(window.innerWidth/2-node.offsetWidth/2)+"px";
style.opacity="1"},remove:function(el){if(el&&el.parentNode)el.parentNode.removeChild(el)}};
(function(){var isGM=typeof GM_getValue!="undefined"&&typeof GM_getValue("a","b")!="undefined",setValue,getValue,stringify,parser;if(!isGM){setValue=function(name,value){return localStorage.setItem(name,value)};getValue=function(name,def){var s=localStorage.getItem(name);return s==null?def:s};stringify=JSON.stringify;parser=JSON.parse}else{setValue=GM_setValue;getValue=GM_getValue;stringify=typeof JSON=="undefined"?function(obj){return obj.toSource()}:JSON.stringify;parser=typeof JSON=="undefined"?
function(jsonData){return(new Function("return "+jsonData+";"))()}:JSON.parse}GM_configStruct.prototype.isGM=isGM;GM_configStruct.prototype.setValue=setValue;GM_configStruct.prototype.getValue=getValue;GM_configStruct.prototype.stringify=stringify;GM_configStruct.prototype.parser=parser;GM_configStruct.prototype.log=window.console?console.log:isGM&&typeof GM_log!="undefined"?GM_log:window.opera?opera.postError:function(){}})();
function GM_configDefaultValue(type,options){var value;if(type.indexOf("unsigned ")==0)type=type.substring(9);switch(type){case "radio":case "select":value=options[0];break;case "checkbox":value=false;break;case "int":case "integer":case "float":case "number":value=0;break;default:value=""}return value}
function GM_configField(settings,stored,id,customType,configId){this.settings=settings;this.id=id;this.configId=configId;this.node=null;this.wrapper=null;this.save=typeof settings.save=="undefined"?true:settings.save;if(settings.type=="button")this.save=false;this["default"]=typeof settings["default"]=="undefined"?customType?customType["default"]:GM_configDefaultValue(settings.type,settings.options):settings["default"];this.value=typeof stored=="undefined"?this["default"]:stored;if(customType){this.toNode=
customType.toNode;this.toValue=customType.toValue;this.reset=customType.reset}}
GM_configField.prototype={create:GM_configStruct.prototype.create,toNode:function(){var field=this.settings,value=this.value,options=field.options,type=field.type,id=this.id,configId=this.configId,labelPos=field.labelPos,create=this.create;function addLabel(pos,labelEl,parentNode,beforeEl){if(!beforeEl)beforeEl=parentNode.firstChild;switch(pos){case "right":case "below":if(pos=="below")parentNode.appendChild(create("br",{}));parentNode.appendChild(labelEl);break;default:if(pos=="above")parentNode.insertBefore(create("br",
{}),beforeEl);parentNode.insertBefore(labelEl,beforeEl)}}var retNode=create("div",{className:"config_var",id:configId+"_"+id+"_var",title:field.title||""}),firstProp;for(var i in field){firstProp=i;break}var label=field.label&&type!="button"?create("label",{id:configId+"_"+id+"_field_label","for":configId+"_field_"+id,className:"field_label"},field.label):null;switch(type){case "textarea":retNode.appendChild(this.node=create("textarea",{innerHTML:value,id:configId+"_field_"+id,className:"block",cols:field.cols?
field.cols:20,rows:field.rows?field.rows:2}));break;case "radio":var wrap=create("div",{id:configId+"_field_"+id});this.node=wrap;for(var i=0,len=options.length;i<len;++i){var radLabel=create("label",{className:"radio_label"},options[i]);var rad=wrap.appendChild(create("input",{value:options[i],type:"radio",name:id,checked:options[i]==value}));var radLabelPos=labelPos&&(labelPos=="left"||labelPos=="right")?labelPos:firstProp=="options"?"left":"right";addLabel(radLabelPos,radLabel,wrap,rad)}retNode.appendChild(wrap);
break;case "select":var wrap=create("select",{id:configId+"_field_"+id});this.node=wrap;for(var i=0,len=options.length;i<len;++i){var option=options[i];wrap.appendChild(create("option",{value:option,selected:option==value},option))}retNode.appendChild(wrap);break;default:var props={id:configId+"_field_"+id,type:type,value:type=="button"?field.label:value};switch(type){case "checkbox":props.checked=value;break;case "button":props.size=field.size?field.size:25;if(field.script)field.click=field.script;
if(field.click)props.onclick=field.click;break;case "hidden":break;default:props.type="text";props.size=field.size?field.size:25}retNode.appendChild(this.node=create("input",props))}if(label){if(!labelPos)labelPos=firstProp=="label"||type=="radio"?"left":"right";addLabel(labelPos,label,retNode)}return retNode},toValue:function(){var node=this.node,field=this.settings,type=field.type,unsigned=false,rval=null;if(!node)return rval;if(type.indexOf("unsigned ")==0){type=type.substring(9);unsigned=true}switch(type){case "checkbox":rval=
node.checked;break;case "select":rval=node[node.selectedIndex].value;break;case "radio":var radios=node.getElementsByTagName("input");for(var i=0,len=radios.length;i<len;++i)if(radios[i].checked)rval=radios[i].value;break;case "button":break;case "int":case "integer":case "float":case "number":var num=Number(node.value);var warn='Field labeled "'+field.label+'" expects a'+(unsigned?" positive ":"n ")+"integer value";if(isNaN(num)||type.substr(0,3)=="int"&&Math.ceil(num)!=Math.floor(num)||unsigned&&
num<0){alert(warn+".");return null}if(!this._checkNumberRange(num,warn))return null;rval=num;break;default:rval=node.value;break}return rval},reset:function(){var node=this.node,field=this.settings,type=field.type;if(!node)return;switch(type){case "checkbox":node.checked=this["default"];break;case "select":for(var i=0,len=node.options.length;i<len;++i)if(node.options[i].textContent==this["default"])node.selectedIndex=i;break;case "radio":var radios=node.getElementsByTagName("input");for(var i=0,len=
radios.length;i<len;++i)if(radios[i].value==this["default"])radios[i].checked=true;break;case "button":break;default:node.value=this["default"];break}},remove:function(el){GM_configStruct.prototype.remove(el||this.wrapper);this.wrapper=null;this.node=null},reload:function(){var wrapper=this.wrapper;if(wrapper){var fieldParent=wrapper.parentNode;fieldParent.insertBefore(this.wrapper=this.toNode(),wrapper);this.remove(wrapper)}},_checkNumberRange:function(num,warn){var field=this.settings;if(typeof field.min==
"number"&&num<field.min){alert(warn+" greater than or equal to "+field.min+".");return null}if(typeof field.max=="number"&&num>field.max){alert(warn+" less than or equal to "+field.max+".");return null}return true}};var GM_config=new GM_configStruct;


////////////////////////////////////////////////////////////////
//    END OF ORIGINAL GM_CONFIG                               //
////////////////////////////////////////////////////////////////




    // I'm going to edit GM_config slightly.
    // Mostly to get rid of the 'alerts' when something is wrong.
    // (alerts pause the window, which causes you to disconnect from a game)


    // This function will return true when no errors were found.

    GM_configStruct.prototype.valid = function() {


        for (var id in this.fields) {

            var node = this.fields[id].node;

            if (node.validity && !node.validity.valid) return false;

            /*
            var field = this.fields[id],
                type = field.settings.type,
                unsigned = false;

            if (type.indexOf('unsigned ') == 0) {
                type = type.substring(9);
                unsigned = true;
            }

            if (['int','integer','float','number'].includes(type)) {

                var num = Number(field.node.value);

                var warn = 'Field labeled "' + field.label + '" expects a' +
                    (unsigned ? ' positive ' : 'n ') + 'integer value';

                if (isNaN(num) ||
                    (type.substr(0, 3) == 'int' && Math.ceil(num) != Math.floor(num)) ||
                    (unsigned && num < 0)) {
                    // Add a few ways for scripters to know that there is an error
                    field.error = true;
                    field.wrapper.classList.add('error');
                    correct = false;
                }

                else if (typeof field.settings.min == "number" && num < field.settings.min) {
                    // Add a few ways for scripters to know that there is an error
                    field.error = true;
                    field.wrapper.classList.add('error');
                    correct = false;
                }

                else if (typeof field.settings.max == "number" && num > field.settings.max) {
                    // Add a few ways for scripters to know that there is an error
                    field.error = true;
                    field.wrapper.classList.add('error');
                    correct = false;
                }

                else {
                    // Add a few ways for scripters to know that there is NO error
                    field.error = false;
                    field.wrapper.classList.remove('error');
                }
            }*/
        }

        return true;
    };


    // Change the field prototype

    var org_toNode = GM_configField.prototype.toNode;

    GM_configField.prototype.toNode = function(){

        var retNode = org_toNode.apply(this, ...arguments);

        var unsigned = false,
            type = this.settings.type;

        if (type.indexOf('unsigned ') === 0) {
            type = type.substring(9);
            unsigned = true;
        }

        if (this.node.validity) {
            // Validity checks will work for ANY input, not only numbers.
            // For example, if you want a text field to have at least 3 characters,
            // manually set the 'minLength' tag to 3 and the rest will be done
            // automagically.

            // Immediately show a validity report while typing / clicking
            this.node.addEventListener('input', this.node.reportValidity);
            this.node.addEventListener('click', this.node.reportValidity);

            // The autocomplete covers the validity report (at least in Chrome)
            this.node.autocomplete = 'off';
        }

        if (['int','integer','float','number'].includes(type)) {

            // By default, GM_config makes most inputs a text field, even numbers.
            // Lets fix that, to be able to check min and max values better.

            this.node.type = 'number';

            if (this.settings.min) this.node.min = this.settings.min;
            if (this.settings.max) this.node.max = this.settings.max;

            // unsigned means non-negative
            if (unsigned) this.node.min = Math.max(0,this.settings.min);

            // integers are only whole numbers
            if (type.substr(0, 3) == 'int') this.node.step = 1;
        }

        if (!['radio','select','checkbox','button','hidden'].includes(type)) {
            // Disable TagPro's controls when typing inside a field you can type in
            // You can set tpul.rollingChat.enable = true to make the Arrow keys move your ball, even when typing text.
            this.node.addEventListener('focus', function(){typeof tagpro != 'undefined' && (tagpro.disableControls = true)});
            this.node.addEventListener('blur', function(){typeof tagpro != 'undefined' && (tagpro.disableControls = false)});
        }

        return retNode;
    };



    return GM_configStruct;
})();








var tpul = (function(){




    // =====STYLE SECTION=====



    // Create our own stylesheet to define the styles in:

    var style = document.getElementById('tpul-style') || document.createElement('style');
    document.head.appendChild(style);
    style.id = 'tpul-style';

    // Remove all existing rules of any previous TPUL version.

    var styleSheet = style.sheet;
    Array.from(styleSheet.cssRules).forEach(rule => styleSheet.deleteRule(rule));

    // THE SETTINGS MENU BUTTONS

    // Container for settings buttons
    styleSheet.insertRule(` #tpul-settings-menu {
text-align: center;
margin: 0 10%;
}`);

    // A settings button
    styleSheet.insertRule(` .tpul-settings-btn {
position: relative;
width: 64px;
height: 64px;
padding: 10px;
margin: 20px;
background-size: contain !important;
background-origin: content-box !important;
background-repeat: no-repeat !important;
outline: none;
}`);

    // Blue line around button when focussed
    styleSheet.insertRule(` .tpul-settings-btn:focus::after {
content: "";
position: absolute;
width: 100%;
height: 100%;
border: 2px solid Highlight;
top: 0;
left: 0;
}`);

    // Tooltip of button
    styleSheet.insertRule(` .tpul-settings-btn span {
position: absolute;
z-index: 1;
border-radius: 10px;
margin-top: 10px;
padding: 10px;
background: #0E8AE0;
border: 1px solid #095C96;
box-shadow: 0 3px #095C96;
font-size: small;
top: 100%;
left: 50%;
transform: translateX(-50%);
width: max-content;
min-width: 64px;
max-width: 128px;
overflow-wrap: break-word;
word-wrap: break-word;
pointer-events: none;
opacity: 0;
transition: opacity .3s;
}`);


    // Arrow of tooltip
    styleSheet.insertRule(` .tpul-settings-btn span::after {
content: "";
position: absolute;
left: 50%;
bottom: 100%;
margin-left: -20px;
border-width: 20px;
border-style: solid;
border-color: transparent transparent #0E8AE0 transparent;
}`);

    // Show tooltip when hovering/focussing
    styleSheet.insertRule(`.tpul-settings-btn:hover span, .tpul-settings-btn:focus span {
opacity: 1;
}`);



    // THE SETTINGS PANEL

    // The frame (gray, spans full page)
    styleSheet.insertRule(` .tpul-settings-frame {
position: fixed;
z-index: 1;
left: 0;
top: 0;
width: 100%;
height: 100%;
overflow: auto;
background-color: rgba(0,0,0,0.4);
scroll-behavior: smooth;

transition: opacity .5s;
opacity: 0;
pointer-events: none;
}`);

    // The frame when shown
    styleSheet.insertRule(`.tpul-settings-shown .tpul-settings-frame {
opacity: 1;
pointer-events: auto;
}`);

    // The settings window itself
    styleSheet.insertRule(` .tpul-settings-frame > div {
width: 80%;
max-width: 800px;
margin: auto;
margin-bottom: 10%;

position: relative;
padding: 20px;

border: 1px solid #888;
border-radius: 15px;
background: #353535;

font-size: 16px;

top: 200%;
transition: top .5s;
}`);

    styleSheet.insertRule(`.tpul-settings-shown .tpul-settings-frame         > div { top: 120%; }`);
    // In a game we want to have an 80% gap to be able to keep playing.
    styleSheet.insertRule(`.tpul-settings-shown .tpul-settings-frame.in-game > div { top: 180%; }`);


    styleSheet.insertRule(`.tpul-settings-frame .config_header {
font-size: 2em;
font-weight: bold;
}`);

    styleSheet.insertRule(`.tpul-settings-frame .section_header {
font-size: 1.5em;
font-weight: bold;
}`);

    styleSheet.insertRule(`.tpul-settings-frame .config_var {
}`);


    // ERRORS in fields:
    styleSheet.insertRule(`.tpul-settings-frame .config_var input:invalid {
box-shadow: inset 0 0 10px rgba(255,0,0,1), 0 0 10px rgba(255, 0, 0, 1);
}`);

    /*styleSheet.insertRule(`.tpul-settings-frame .config_var.error:before {
content: attr(data-min) ' - ' attr(data-max);
display: block;
text-align: right;
margin: 5px 20px;
color: #FFA9A2;
font-style: italic;
}`);*/

    styleSheet.insertRule(`.tpul-settings-frame .field_label {
font-weight: bold;
}`);
    styleSheet.insertRule(`.tpul-settings-frame .form-control {
background: #212121;
border-color: #5f5f5f;
}`);
    styleSheet.insertRule(`.tpul-settings-frame .form-control[type="checkbox"] {
width: auto;
}`);
    styleSheet.insertRule(`.tpul-settings-frame .btn-default {
border-color: #888888;
}`);
    styleSheet.insertRule(`.tpul-settings-frame textarea.form-control {
resize: vertical;
}`);

    styleSheet.insertRule(`.tpul-settings-frame .btn-primary {
margin-left: 10px;
}`);



    styleSheet.insertRule(`.tpul-settings-frame .tab-list {
border-bottom-color: #888888;
}`);
    styleSheet.insertRule(`.tpul-settings-frame .tab-list li {
cursor: pointer;
color: #8BC34A;
font-size: 1.5em;
}`);
    styleSheet.insertRule(`.tpul-settings-frame .tab-list li:hover {
color: #689F38;
}`);
    styleSheet.insertRule(`.tpul-settings-frame .tab-list li.active {
border-color: #888888;
border-bottom-color: transparent;
background-color: #353535;
}`);



    // save/close/etc buttons

    styleSheet.insertRule(`.tpul-settings-frame-buttons-holder {
height: 0;
text-align: right;
}`);

    styleSheet.insertRule(`.tpul-settings-frame-buttons-holder button {
padding: 4px .5em;
}`);


    styleSheet.insertRule(`@keyframes bounce {
0%, 20% {transform: translate(-50px,50%)scale(.06)}
10% {transform: translate(-50px,55%)scale(.06)}
}`);

    styleSheet.insertRule(`.tpul-settings-scroll-down-arrow {
position: fixed;
width: 80%;
max-width: 800px;
left: 50%;
transform: translate(-50px,50%)scale(.06);
bottom: 30px;
z-index: 1;
transition: opacity .5s;
animation-name: bounce;
animation-delay: 1s;
animation-duration: 3s;
animation-iteration-count: infinite;
animation-direction: alternate;
transition: opacity .5s;
cursor: pointer;
}`);

    styleSheet.insertRule(`
@media screen and (max-width: 1000) {
.tpul-settings-scroll-down-arrow {
right: calc(10% + 30px);
width: 5px;
}
}`);


    /*

    //Bad design notice:

    styleSheet.insertRule(` .tpul-settings-frame > div::after {
content: "Sorry for the bad design, I'm working on it!";
font-style: italic;
color: gray;
}`);

    */

    // Stop the body from scrolling when the settings panel is shown
    styleSheet.insertRule(`body.tpul-settings-shown {
overflow:hidden !important;
}`);




    // Notifications
    styleSheet.insertRule(` .tpul-notification-success {
border-color: #8BC34A;
background: #4C6D25;
color: black;
}`);

    styleSheet.insertRule(` .tpul-notification-error {
border-color: #BD0E0B;
background: #6B2121;
color: #FFA9A2;
}`);

    styleSheet.insertRule(` .tpul-notification-warning {
border-color: Olive;
background: DarkKhaki;
color: black;
}`);

    styleSheet.insertRule(` .tpul-notification {
position: fixed;
bottom: 0px;

padding: 10px;

width: 100%;

text-align: center;

cursor: pointer;
z-index: 2;

border-top: 1px solid #404040;
background: #353535;
color: #fff;

animation: slideUp 1s;
transform: translateY(0);
transition: transform 1s;
}`);

    styleSheet.insertRule(` .tpul-notification.vanish {
transform: translateY(100%);
}`);

    styleSheet.insertRule(` @keyframes slideUp {
0% { transform: translateY(100%); }
100% { transform: translateY(0%); }
}`);



    // =====NOITCES ELYTS=====





    // =====LOGIC SECTION=====



    var GM_storage = typeof GM_setValue === 'function' && typeof GM_getValue === 'function',
        all_settings = [],
        profileId = null,
        last_opened = null,
        rollingChatEnabled = false;


    // THE TPUL OBJECT!!

    var tpul = {
        get version(){return version},

        get noscript(){return typeof tagpro != 'object'},

        settings: {
            addSettings: function({id, title, fields, icon, tooltipText, buttonText}) {

                var config = arguments[0];

                if (config.allowLocal && !id && !GM_storage) throw "TPUL: A unique id is required, because localStorage will be used! By the way; it is better to @grant GM_getValue and GM_setValue and set 'allowLocal:false' to use private storage instead.";

                if (!config.allowLocal && !GM_storage) throw "TPUL: Please @grant GM_setValue and GM_getValue in your userscripts metadata (recommended) or use 'allowLocal:true' (not recommended)";


                if (arguments.length != 1 || typeof config != 'object')
                    throw Error("addSettings() takes one object as an argument! Example: addSettings( {id:'MySettings', title:'Hello World'} )");

                // Create a new GM_config instance
                let settings = new GM_configStruct({

                    frame: SettingsFrame,

                    ...config,

                    id: String(config.id) || 'defaultId',

                    events: {
                        ...(config.events||{}),

                        open: function(){

                            //Remove the default inline style of the GM_config frame
                            this.frame.setAttribute('style', '');

                            //Apply some TagPro/Bootstrap styles
                            SettingsFrame.firstChild.classList.add('form-horizontal');
                            for (let el of SettingsFrame.getElementsByClassName('config_header')) el.classList.add('header-title');
                            for (let el of SettingsFrame.getElementsByClassName('config_var')) el.classList.add('form-group');
                            for (let el of SettingsFrame.getElementsByClassName('field_label')) {
                                el.classList.add('col-xs-4');
                                el.classList.add('control-label');
                            }
                            for (let el of SettingsFrame.getElementsByClassName('radio_label')) el.classList.add('radio');
                            for (let el of [...SettingsFrame.getElementsByTagName('input'),
                                            ...SettingsFrame.getElementsByTagName('select'),
                                            ...SettingsFrame.getElementsByTagName('textarea')]) {

                                switch (el.type) {
                                    case 'radio':
                                        el.parentElement.classList.add('col-xs-8');
                                        el.parentElement.style.paddingLeft = '30px';
                                        el.nextElementSibling.prepend(el);
                                        continue;
                                    case 'button':
                                        el.classList.add('btn');
                                        el.classList.add('btn-default');
                                        break;
                                    default:
                                        el.classList.add('form-control');

                                }

                                var div = document.createElement('div');
                                el.parentElement.appendChild(div);
                                div.appendChild(el);

                                div.classList.add('col-xs-8');
                                div.classList.add('pull-right');
                            }

                            // The footer with the buttons:

                            var buttonsHolder = SettingsFrame.firstElementChild.lastElementChild;
                            buttonsHolder.classList.add('col-sm-12');
                            buttonsHolder.classList.add('tpul-settings-frame-buttons-holder');

                            // Place the "footer" on top
                            buttonsHolder.parentElement.insertBefore(buttonsHolder, buttonsHolder.parentElement.firstElementChild);

                            for (var btn of [...buttonsHolder.getElementsByClassName('saveclose_buttons'),
                                             ...buttonsHolder.getElementsByClassName('reset')]) {
                                btn.classList.add('btn');
                                btn.classList.add('btn-primary');
                            }

                            buttonsHolder.innerHTML = '';

                            for (var type of this.buttons || ['ok','cancel','reset']) {
                                var button = document.createElement('button');
                                button.className = 'btn btn-primary';
                                button.settings = settings;
                                buttonsHolder.appendChild(button);

                                switch(type.toLowerCase()) {
                                    case 'ok':
                                        button.onclick = function(){
                                            if(this.settings.valid()) {this.settings.save(); this.settings.close(); tpul.notify('Options saved!','success');}
                                            else {tpul.notify('Please fix any issues before saving', 'error');}
                                        };
                                        button.innerText = 'Ok';
                                        break;
                                    case 'cancel':
                                        button.onclick = function(){ this.settings.close(); tpul.notify('Options canceled','warning'); };
                                        button.innerText = 'Cancel';
                                        break;
                                    case 'reset':
                                        button.onclick = function(){ this.settings.reset(); tpul.notify('All options are reset to their defaults','');};
                                        button.innerText = 'Reset';
                                        break;
                                    case 'save':
                                        button.onclick = function(){
                                            if(this.settings.valid()) {this.settings.save(); tpul.notify('Options saved!','success');}
                                            else {tpul.notify('Please fix any issues before saving', 'error');}
                                        };
                                        button.innerText = 'Save';
                                        break;
                                    case 'close':
                                        button.onclick = function(){ this.settings.close(); tpul.notify('Options canceled','warning'); };
                                        button.innerText = 'Close';
                                        break;
                                }
                            }


                            if (this.tabs) {

                                var tablist = document.createElement('ul');
                                tablist.classList.add('tab-list');
                                SettingsFrame.firstElementChild.insertBefore(tablist, SettingsFrame.firstElementChild.lastElementChild);

                                var tabcontent = document.createElement('div');
                                tabcontent.classList.add('tab-content');
                                SettingsFrame.firstElementChild.insertBefore(tabcontent, SettingsFrame.firstElementChild.lastElementChild);

                                for (let el of [...SettingsFrame.getElementsByClassName('section_header_holder')]) {

                                    var header = el.getElementsByClassName('section_header')[0];

                                    tablist.innerHTML += '<li data-target="#'+el.id+'">' + header.innerText;

                                    tabcontent.appendChild(el);
                                    el.classList.add('tab-pane');

                                    el.removeChild(header);
                                }

                                tablist.firstElementChild.click();

                            } else {
                                for (let el of SettingsFrame.getElementsByClassName('section_header')) el.classList.add('header-title');
                            }

                            //Open the settings on our way (animated, blocking scroll of body etc.)
                            this.frame.style.display = '';
                            SettingsFrame.scrollTop = SettingsFrame.offsetHeight;
                            document.body.classList.add('tpul-settings-shown');

                            // Add an arrow, indicating the user to scroll down for more settings
                            var arrow = document.createElement('img');
                            arrow.classList.add("tpul-settings-scroll-down-arrow");
                            arrow.src = "https://raw.githubusercontent.com/wilcooo/TagPro-UserscriptLibrary/master/arrow.png";
                            this.frame.appendChild(arrow);
                            arrow.onclick = function(){
                                arrow.style.opacity = 0;
                                SettingsFrame.scrollTo(0,SettingsFrame.scrollHeight)
                            }

                            last_opened = settings;

                            // If the userscript adds an 'open' event as well, run it as well
                            if (this.events && typeof this.events.open == "function")
                                this.events.open.call(this,...arguments);
                        },

                        close: function(){
                            if(this.isOpen){}//TODO: Check whether unsaved?

                            //close the settings in our way (animated)
                            this.frame.style.display = '';
                            document.body.classList.remove('tpul-settings-shown');

                            if (this.events && typeof this.events.close == "function")
                                this.events.close.call(this,...arguments);
                        },
                    }
                });

                // Remove all other default styles of GM_config
                delete settings.css.basic;

                // Create a button using the function below
                var button = tpul.settings.addButton({
                    onclick: ()=>settings.open(),
                    icon: icon,
                    tooltipText: tooltipText,
                    buttonText: buttonText,
                });

                settings.button = button;

                for (let c in config) if(settings[c] === undefined) settings[c] = config[c];

                all_settings.push(settings);

                return settings;

            },
            addButton: function({onclick, icon, tooltipText, buttonText}) {

                if (!SettingsMenu) {
                    console.error('TPUL: Could not find a place to add the settings button for '+name);
                    return null;
                }

                var button = document.createElement('button');
                button.className = 'btn tpul-settings-btn';

                if (icon) {
                    if (icon.search(/^url\((.*)\)$/) == -1) icon = 'url("'+icon+'")';
                    button.style.backgroundImage = icon;
                    button.innerHTML = '&nbsp;';
                } else button.innerText = buttonText || '?';

                var tooltip = document.createElement('span');
                tooltip.innerText = tooltipText || "Configure this script's settings" ;
                button.appendChild(tooltip);

                SettingsMenu.appendChild(button);

                button.addEventListener('click',function(click){
                    button.blur();
                    onclick(click);
                });

                return button;
            },
            get parent() {return SettingsMenu.parentElement;},
            set parent(container) {

                if (container) console.warn('You are repositioning the tpul settings menu. This will affect all settings buttons, not only for your script!');

                container = container ||
                    document.getElementById('tpul-settings-container') || // Try to add it to a position pre-defined by another script (such as ModFather)
                    document.getElementById('userscript-top') || // Try to add it on top of any page on the server
                    document.getElementById('options'); // Try to add it to the scoreboard in-game

                if (container) {
                    container.classList.remove('hidden');
                    container.appendChild(SettingsMenu);
                } else console.error('Couldn\'t find a parent element.');

                return container;
            },
            get menu(){ return SettingsMenu; },
            set menu(_){ throw "You can't change the TPUL settings menu object. You might mean to change the tpul.settings.parent"; },
        },

        profile: {
            getId: function() {

                if (!tpul_promises.getProfileId) {
                    tpul_promises.getProfileId = new Promise(function(resolve,reject) {

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "http://"+document.location.hostname+"/",
                            onload: function(){
                                var match = this.responseText.match(/profile\/([0-9a-f]+)/i);
                                if (match) {
                                    profileId = match[1];
                                    resolve(profileId);
                                } else reject({error:"not logged in"});
                            },
                            onerror: ()=> reject({error:"request error", request:this}),
                        });
                    });
                }

                return tpul_promises.getProfileId;
            },

            getInfo: function() {

                if (!tpul_promises.getProfileInfo) {

                    tpul_promises.getProfileInfo = new Promise(function(resolve,reject) {

                        tpul.profile.getId().then( function(id){

                            GM_xmlhttpRequest({
                                method: "GET",
                                url: "http://"+document.location.hostname+"/profiles/"+id,
                                onload: function(r){
                                    // 'r' is the response that we get back from the TP server, lets do some error handling with it:

                                    var arr;
                                    try{  arr = JSON.parse(r.response);  }
                                    catch(e){  reject({error:"/profiles/ responded invalid JSON", request:this});  }

                                    if(arr.error) reject(arr);

                                    if(Array.isArray( arr ) && arr.length == 1) {
                                        resolve(arr[0]);
                                    }
                                    else reject({error:"unknown error", response:arr, request:this});
                                },
                                onerror: ()=> reject({error:"request error", request:this}),
                            });
                        });

                        tpul.profile.getId().catch( reject );

                    });
                }

                return tpul_promises.getProfileInfo;
            },

            getPage: function() {

                if (!tpul_promises.getProfilePage) {

                    tpul_promises.getProfilePage = new Promise(function(resolve,reject) {

                        tpul.profile.getId().then( function(id){

                            GM_xmlhttpRequest({
                                method: "GET",
                                url: "http://"+document.location.hostname+"/profile/"+id,
                                onload: function(r){
                                    // 'r' is the response that we get back from the TP server, lets do some error handling with it:
                                    if(r.response.error) reject(r.response);

                                    var match,
                                        profile = {
                                            settings: {
                                                allChat: undefined,
                                                teamChat: undefined,
                                                groupChat: undefined,
                                                systemChat: undefined,
                                                tutorialChat: undefined,

                                                names: undefined,
                                                degrees: undefined,
                                                matchState: undefined,
                                                performanceInfo: undefined,
                                                spectatorInfo: undefined,

                                                stats: undefined,
                                            },

                                            flair: [],
                                        };

                                    // If the 'settings' div cannot be found, assume to not be logged in.
                                    if( !/<div(?: [^>]*)? id="settings"/i.test(this.responseText) ) return reject({error:"not logged in", request:this});

                                    // Get the global settings
                                    // (ball spin, respawn warnings and video settings are NOT stored on the TP server,
                                    //     only in a cookie on your device)
                                    for (var setting in profile.settings) {
                                        match = RegExp('<input(?: [^>]*)? id="' +setting+ '"(?: [^>]*)? (checked)?', 'i').exec(this.responseText);
                                        if (match) {
                                            profile.settings[setting] = Boolean(match[1]);
                                        } else return reject({error:"unknown error", request:this});
                                    }

                                    // Get the 'Custom Team Names' setting (the only non-boolean setting)
                                    /*
                                    <select id="teamNames" name="teamNames" class="form-control">
                                        <option value="always" >Always</option>
                                        <option value="spectating" >When Spectating</option>
                                        <option value="never" selected>Never</option>
                                    </select>
                                    */

                                    var teamNamesOptions = /<select(?: [^>]*)? id="teamNames"(?: [^>]*)?>((?:\s*?.*?)*?)<\/select>/i.exec(this.responseText);
                                    if (teamNamesOptions) {
                                        var teamNamesOpt_rgx = /<option(?: [^>]*)? value="([^>]*)"(?: [^>]*)? (selected)?(?: [^>]*)?>/ig;
                                        while ( (match = teamNamesOpt_rgx.exec(teamNamesOptions[1])) ){

                                            if (match[2]) {
                                                profile.settings.teamNames = match[1];
                                                break;
                                            }
                                        }
                                    } else return reject({error:"unknown error", request:this});

                                    // Get both names
                                    for (var name of ['reservedName','displayedName']) {
                                        match = RegExp('<input(?: [^>]*)? id="' +name+ '"(?: [^>]*)? value="(.*?)"', 'i').exec(this.responseText);
                                        if (match) {
                                            profile[name] = match[1];
                                        } else return reject({error:"unknown error", request:this});
                                    }

                                    // Get your email
                                    match = /<span(?: [^>]*)? class="hidden-email"(?: [^>]*)?>[^<]*?\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b<\/span>/i.exec(this.responseText);
                                    if (match) {
                                        profile.email = match[1];
                                    } else return reject({error:"unknown error", request:this});

                                    // Get all flairs, and whether they are available, and which one is selected
                                    var flair_rgx = /<li class="(.*?)" data-flair="(.*?)">/ig;
                                    while ( (match = flair_rgx.exec(this.responseText)) ) {
                                        var i = profile.flair.push({
                                            id: match[2],
                                            selected: match[1].includes('selected'),
                                            available: match[1].includes('flair-available'),
                                        });
                                        if (profile.flair[i-1]) profile.selectedFlair = profile.flair[i-1];
                                    }

                                    // Remove duplicate flairs (because there are 3 tabs)
                                    var flair_ids = [];
                                    profile.flair = profile.flair.filter(flair => !flair_ids.includes(flair.id) && flair_ids.push(flair.id));

                                    resolve(profile);

                                },

                                onerror: ()=> reject({error:"request error", request:this}),
                            });
                        });

                        tpul.profile.getId().catch( reject );
                    });
                }

                return tpul_promises.getProfilePage;
            },

            getRolling: function() {

                if (!tpul_promises.getProfileRolling) {

                    tpul_promises.getProfileRolling = new Promise(function(resolve,reject) {

                        tpul.profile.getId().then( function(id){

                            GM_xmlhttpRequest({
                                method: "GET",
                                url: "http://"+document.location.hostname+"/profile_rolling/"+id,
                                onload: function(r){
                                    // 'r' is the response that we get back from the TP server, lets do some error handling with it:
                                    if(r.response.error) reject(r.response);
                                    if(Array.isArray( r.response )) {
                                        resolve(r.response);
                                    }
                                    else reject({error:"unknown error", request:this});
                                },
                                onerror: ()=> reject({error:"request error", request:this}),
                            });
                        });

                        tpul.profile.getId().catch( reject );

                    });
                }

                return tpul_promises.getProfileRolling;
            },

            getReservedName: function(fallbackTimeout=5e3) {

                /*

                Where to get the Reserved name from?

                    - in-game when auth
                    - getInfo /profiles/...
                    - getPage /profile/...

                Logic:

                    1. if getInfo was called before: use that
                    2. if getPage was called before: use that
                    3. if in-game and auth: get it that way
                    4. call getInfo() to get the name

                */

                if (!tpul_promises.getReservedName) {

                    tpul_promises.getReservedName = new Promise(function(resolve,reject) {

                        // The fallback: get the reserved name using getInfo()
                        var fallback = function(){

                            done = true;

                            tpul.profile.getInfo().then(function(profileInfo) {

                                resolve(profileInfo.reservedName);
                            });

                            tpul.profile.getInfo().catch( reject );
                        };

                        if (tpul_promises.getProfileInfo) {

                            tpul_promises.getProfileInfo.then(function(profileInfo){
                                resolve(profileInfo.reservedName);
                            });

                            tpul_promises.getProfileInfo.catch( reject );

                        } else if (tpul_promises.getProfilePage) {

                            tpul_promises.getProfilePage.then(function(profilePage){
                                resolve(profilePage.reservedName);
                            });

                            tpul_promises.getProfilePage.catch( reject );

                        } else if (typeof tagpro != 'undefined' && tagpro.ready) {
                            tagpro.ready(function(){

                                if (tagpro.players) {
                                    if (tagpro.players[tagpro.playerId]) {

                                        if (tagpro.players[tagpro.playerId].auth) {
                                            resolve (tagpro.players[tagpro.playerId].name);
                                        } else fallback();

                                    } else {

                                        tagpro.socket.on('p',function(playerId) {
                                            if (tagpro.players[tagpro.playerId]) {

                                                if (tagpro.players[tagpro.playerId].auth) {
                                                    resolve (tagpro.players[tagpro.playerId].name);
                                                } else fallback();

                                            }
                                        });

                                    }
                                } else fallback();
                            });
                        } else fallback();

                        var done = false;
                        setTimeout(function(){
                            tpul_promises.getReservedName.then(()=>done=true);
                        });

                        setTimeout( function() { if (!done) fallback(); }, fallbackTimeout );

                    });
                }

                return tpul_promises.getReservedName;
            },

            getDisplayedName: function(fallbackTimeout = 5e3) {

                 /*

                Where to get the Displayed name from?

                    - in-game
                    - getProfile /profile/...

                Logic:

                    1. if getPage was called before: use that
                    2. if in-game: get it that way
                    3. call getPage() to get the name

                */

                if (!tpul_promises.getDisplayedName) {

                    tpul_promises.getDisplayedName = new Promise(function(resolve,reject) {

                        // The fallback: get the displayed name using getPage()
                        var fallback = function(){

                            done = true;

                            tpul.profile.getPage().then(function(profilePage) {

                                resolve(profilePage.displayedName);
                            });

                            tpul.profile.getPage().catch( reject );
                        };

                        if (tpul_promises.getProfilePage) {

                            tpul_promises.getProfilePage.then(function(profilePage){
                                resolve(tpul_promises.getProfilePage.displayedName);
                            });

                            tpul_promises.getProfilePage.catch( reject );

                        } else if (typeof tagpro != 'undefined' && tagpro.ready) {
                            tagpro.ready(function(){

                                if (tagpro.players) {
                                    if (tagpro.players[tagpro.playerId]) {

                                        resolve (tagpro.players[tagpro.playerId].name);

                                    } else {

                                        tagpro.socket.on('p',function(playerId) {
                                            if (tagpro.players[tagpro.playerId]) {

                                                resolve (tagpro.players[tagpro.playerId].name);

                                            }
                                        });

                                    }
                                } else fallback();
                            });
                        } else fallback();

                        var done = false;
                        setTimeout(function(){
                            tpul_promises.getDisplayedName.then(()=>done=true);
                        });

                        setTimeout( function() { if (!done) fallback(); }, fallbackTimeout );

                    });
                }

                return tpul_promises.getDisplayedName;

            },

            getSettings: function(fallbackTimeout = 5e3) {

                /*

                Where to get the settings from?

                    - in-game
                    - getPage /profile/...

                Logic:

                    1. if in-game: get it that way
                    2. call getPage() to get the settings

                */

                var top_args = arguments;

                if (!tpul_promises.getProfileSettings) {

                    tpul_promises.getProfileSettings = new Promise(function(resolve,reject) {

                        var fallback = function(){

                            done = true;

                            tpul.profile.getPage().then(function(profilePage){
                                resolve(profilePage.settings);
                            });

                            tpul.profile.getPage().catch( reject );
                        };

                        if (top_args[0] && top_args[0].__settings) {
                            resolve(top_args[0].__settings);
                        } else if (tpul_promises.getProfilePage) {

                            tpul_promises.getProfilePage.then(function(profilePage){
                                resolve(profilePage.settings);
                            });

                            tpul_promises.getProfilePage.catch( reject );

                        } else if (typeof tagpro != 'undefined' && tagpro.ready) {
                            tagpro.ready(function(){

                                if (tagpro.socket && tagpro.socket.on) {

                                    tagpro.socket.on('settings', function(settings) {
                                        resolve(Object.assign(settings.ui, {stats:settings.stats}));
                                    });

                                } else fallback();
                            });
                        } else fallback();

                        var done = false;
                        setTimeout(function(){
                            tpul_promises.getProfileSettings.then(()=>done=true);
                        });

                        setTimeout( function() { if (!done) fallback(); }, fallbackTimeout );

                    });

                }

                return tpul_promises.getProfileSettings;

            },

            setSettings: function(newSettings, persistent=true, immediately=false) {

                if (immediately) console.warn("Most settings will NOT take effect immediately, I might add this functionality in the future. Only chat settings work at the moment.");

                return new Promise(function(resolve, reject){

                    // Step 1: set any local (cookie) settings
                    // These don't have to be send to the server, easy!

                    if (persistent) {

                        for (let setting in newSettings) {
                            if (['sound',
                                 'music',
                                 'volume',

                                 'textures',

                                 'disableBallSpin',
                                 'tileRespawnWarnings',
                                 'disableTutorialChat', // This cookie seems to be unused
                                 // Setting it anyway \(^.^)/

                                 'disableParticles',
                                 'forceCanvasRenderer',
                                 'disableViewportScaling',
                                ].includes(setting)) {

                                var expires = new Date(Date.now() + 31536e8).toUTCString(); // A century from now (same as TagPro uses)
                                document.cookie = setting + '=' + newSettings[setting] + '; expires='+expires+'; path=/; domain=.koalabeast.com';
                            }
                        }

                        // Step 2: send any server-sided settings to the server

                        if (['reservedName',
                             'displayedName',

                             'allChat',
                             'teamChat',
                             'groupChat',
                             'systemChat',
                             'tutorialChat',

                             'names',
                             'degrees',
                             'matchState',
                             'performanceInfo',
                             'spectatorInfo',

                             'teamNames',
                             'stats',
                            ].some( s => s in newSettings ) ){

                            // Call these to let them run in parallel
                            tpul.profile.getSettings();
                            tpul.profile.getReservedName();
                            tpul.profile.getDisplayedName();

                            tpul.profile.getSettings().then( function(settings){
                                tpul.profile.getReservedName().then( function(reservedName){
                                    tpul.profile.getDisplayedName().then( function(displayedName){

                                        console.log(param({reservedName: reservedName, // Your reservedName
                                                           displayedName: displayedName,  // Your displayedName
                                                           //...settings, // The current settings
                                                           //...newSettings}));
                                                          }));
                                        var req = GM_xmlhttpRequest({
                                            data: param(Object.assign({},
                                                                      settings, // The current settings
                                                                      {reservedName: reservedName, // Your reservedName
                                                                       displayedName: displayedName},  // Your displayedName
                                                                      newSettings // Overwrite with the settings that you want to edit.
                                                                     )),
                                            method: "POST",
                                            headers: {"Content-Type": "application/x-www-form-urlencoded"},
                                            url: "http://"+document.location.hostname+"/profile/update",
                                            onload: function(r){
                                                // 'r' is the response that we get back from the TP server, lets do some error handling with it:

                                                var arr;
                                                try{  arr = JSON.parse(r.response);  }
                                                catch(e){  reject({error:"/profile/update responded invalid JSON", request:this});  }

                                                if(arr.error) reject(arr);
                                                else if(arr.success) {
                                                    resolve(arr);
                                                } else reject({error:'unknown error',response: arr, request:this});
                                            },
                                            onerror: reject,
                                        });

                                    });
                                });
                            });

                        }

                    }

                    // Step 3: In case we are in-game, let the settings go into effect immediately.
                    // To update the reserved name, a refresh is required. TPUL won't do this!

                    if (typeof tagpro != 'undefined' && immediately) {
                        if (!tagpro.settings) tagpro.settings = {ui:{}};
                        if (!tagpro.settings.ui) tagpro.settings.ui = {};

                        for (let setting in newSettings) {
                            if (['allChat',
                                 'teamChat',
                                 'groupChat',
                                 'systemChat',
                                 'tutorialChat',
                                ].includes(setting)){

                                tagpro.settings.ui[setting] = newSettings[setting];
                            }
                        }

                        if (setting == 'tutorialChat') {
                            var tutorialButton = document.getElementById('tutorialButton');

                            if (tutorialButton) {
                                var action = tutorialButton.innerText === "Enable Tips";
                                if (newSettings[setting] == action) tutorialButton.click();
                            }
                        }


                    }

                });
            }

        },

        rollingChat: {

            _init: function initRollingChat(enable = false){

                if (typeof tagpro == 'undefined') return console.error( "The `tagpro` object does not exist. Is this a no-script match?" )

                // In case you don't want to load the full TPUL library,
                // You can add RollingChat to your own script by copying this function
                // Usage:
                //     initRollingChat(true);

                if (!tagpro.rollingChat) {

                    tagpro.rollingChat = {
                        enabled: false,
                        get handler() {
                            return function(event) {

                                // Return if not enabled
                                if (!tagpro.rollingChat.enabled) return;

                                // Whether you are releasing instead of pressing the key:
                                var releasing = event.type == 'keyup';

                                // Check if any modifier keys where held down during a keyDown
                                if (!releasing && (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)) return;

                                // The key that is pressed/released (undefined when it is any other key)
                                var arrow = ['left','up','right','down'][[37,38,39,40].indexOf(event.keyCode)];

                                // Only if the controls are disabled (usually while composing a message)
                                // AND the key is indeed an arrow (not undefined)
                                if (tagpro.disableControls && arrow) {

                                    // Prevent the 'default' thing to happen, which is the cursor moving through the message you are typing
                                    event.preventDefault();

                                    // Return if already pressed/released
                                    if (tagpro.players[tagpro.playerId].pressing[arrow] != releasing) return;

                                    // Send the key press/release to the server!
                                    tagpro.sendKeyPress(arrow, releasing);

                                    // Not necesarry, but useful for other scripts to 'hook onto'
                                    if (!releasing && tagpro.events.keyDown) tagpro.events.keyDown.forEach(f => f.keyDown(arrow));
                                    if (releasing && tagpro.events.keyUp) tagpro.events.keyUp.forEach(f => f.keyUp(arrow));
                                    if(tagpro.ping.avg)setTimeout(()=>(tagpro.players[tagpro.playerId][arrow]=!releasing),tagpro.ping.avg/2);
                                }
                            };
                        }
                    };

                    // intercept all key presses and releases:
                    document.addEventListener('keydown', tagpro.rollingChat.handler);
                    document.addEventListener('keyup', tagpro.rollingChat.handler);
                }

                if (enable) tagpro.rollingChat.enabled = true;
            },

            get enabled(){
                tpul.rollingChat._init();
                return tagpro.rollingChat.enabled;
            },

            set enabled(e){
                tpul.rollingChat._init( Boolean(e) );
                if (!e) console.warn('Disabling Rolling Chat! This will disable Rolling Chat for all scripts, not only yours! Please enable it again asap to not get users confused.');
            },
        },

        notify: function(text, type="message", timeout=Math.max(4000, 50*text.length) ){

            // Accepted types: message, success, error, warning
            //              (  white    green    red    yellow )
            // For more types, the only thing you need to add is some CSS

            var notification = document.createElement('div');
            notification.className = 'tpul-notification tpul-notification-' + type;
            notification.innerText = text;
            document.body.appendChild(notification);

            // Hide after a while (timeout)
            setTimeout(function(notification){
                if(notification)notification.classList.add('vanish');
            }, timeout, notification);

            // Hide on click
            notification.onclick = function(){ this.classList.add('vanish'); };

            // Clear up the DOM once the notification is vanished
            notification.addEventListener('transitionend',function(){ this.remove(); });

            // Return the element, for scripters to "play" with
            return notification;

        },

        groupcomm: {

            emit: function ( script, command, ...args ) {
                // Example: tpul.groupcomm.emit('gropro', 'desc', 'welcome to my awesome group')
                if (typeof tagpro != 'undefined' && tagpro.group && tagpro.group.socket) {

                    var full_command = "/" + [...arguments].map(a=>(a||"").replace(/([\^\/:;])/g,"^$1")).join("/") + ";";

                    tagpro.group.socket.emit( "touch", full_command.substr( 0,12 ) );
                    for (var i = 12; i < full_command.length; i += 11) {
                        tagpro.group.socket.emit( "touch", ":" + full_command.substr( i,11 ) );
                    }

                    tagpro.group.socket.emit( "touch", tagpro.group.socket.playerLocation );
                }
                else throw "Not connected to a group";
            },

            oncommand: function oncommand( callback ) {
                if (typeof tagpro != 'undefined' && tagpro.group && tagpro.group.socket) {
                    if (!tpul.groupcomm._active) tpul.groupcomm._init();
                    tpul.groupcomm._callbacks.push(callback);
                }
                else throw "Not connected to a group";
            },

            _callbacks: [],

            _commands: {},

            _active: false,

            _init: function (){

                if (tpul.groupcomm._active) return;

                tpul.groupcomm._active = true;

                tagpro.group.socket.on( "member", function(member) {

                    function handleCommand(command){
                        var args = [...command
                                    .replace(/\^(.)/g, "$1^")
                                    .match(/\/(.*);(?=(?:\^\^)*(?!\^))/,1)[1]
                                    .split(/\/(?=(?:\^\^)*(?!\^))/)
                                    .map(a=>a.replace(/(.)\^(?=(?:\^\^)*(?!\^))/g, "$1"))
                                   ];

                        for (var c in tpul.groupcomm._callbacks) {
                            var callback = tpul.groupcomm._callbacks[c];
                            try { callback({
                                member: member,
                                script: args.shift() || null,
                                command: args.shift() || null,
                                args: args,
                                raw:command } ); }
                            catch(e) {
                                console.error("Unhandled GroupComm error. Mod makers, handle your errors!", e);
                                tpul.groupcomm._callbacks.splice(c,1);
                            }
                        }
                    }

                    var raw = member.location,
                        commands = tpul.groupcomm._commands;

                    if (typeof raw !== "string") return;

                    // A full one-line command:  / ... ;
                    if ( raw.match(/^\/.*[^^];/) ) {
                        handleCommand( raw );
                        delete commands[member.id];
                    }

                    // The start of a multi-line command:  / ...
                    else if ( raw.match(/^\//) ) {
                        commands[member.id] = raw;
                    }

                    // The end of a multi-line command:  : ... ;
                    else if ( raw.match(/^:.*[^^];/) ) {
                        if (!commands[member.id]) throw "Did not receive start of command.";
                        var com = commands[member.id] + raw.slice(1);
                        handleCommand( com );
                        delete commands[member.id];
                    }

                    // A middle part of a multi-line command:  : ...
                    else if ( raw.match(/^:/) ) {
                        if (!commands[member.id]) throw "Did not receive start of command.";
                        commands[member.id] += raw.slice(1);
                    }

                    // Not a GroupComm command:
                    else delete commands[member.id];
                });
            }
        },

        chat: {

            emit: function(message, type='all'){
                // type: all/team/group/mod

                if (tpul.playerLocation != 'game') {
                    console.error( "TPUL wasn't able to send this chat, as we haven't joined a game", message )
                    throw "TPUL: can't send a chat when not in a game";
                }

                if (!tpul.noscript && tagpro.socket) {
                    // Method 1: Emit a message using the socket.
                    // Preferable since it has the most chance
                    // to work with other scripts.

                    if (type == 'group') tagpro.group && tagpro.group.socket.emit('chat', message);

                    else tagpro.socket.emit('chat',{
                        message:message,
                        toAll:type!='team',
                        asMod:type=='mod',
                    });

                } else if (typeof $ == 'function') {
                    // Method 2: Send a message "manually" (because no-script)
                    // This takes about 15ms on my computer (TagPro's chat function isn't really performant)
                    // So expect a frame or two to drop while sending a macro (still better than typing it out yourself though)
                    // On top of that, your input will be delayed by the same amount of time.
                    // Of course, THESE DELAYS WILL ONLY HAPPEN AT THE MOMENT YOU USE ONE OF YOUR MACROS!

                     // The chatbox and name input box
                    var chat = document.getElementById('chat'),
                        name = document.getElementById('name')

                    // Blur (unfocus) the 'name' input, in case you are in the middle of changing your name
                    if (name == document.activeElement) name.blur()

                    // Close the box in case it is already opened
                    if (chat.style.display != 'none' && chat.style.display != '' ) {
                        chat.value = ""
                        this._handler( { type: 'keydown', keyCode: 13, preventDefault: ()=>0 } )
                    }

                    // Trick the handler in opening the box
                    var keyCode = { team: 84, group: 71, mod: 77, all: 13 }[type]
                    this._handler( { type: 'keydown', keyCode: keyCode, preventDefault: ()=>0 } )

                    // Type out the message:
                    document.getElementById('chat').value = message;

                    // Trick the handler in closing the box and sending the message
                    this._handler( { type: 'keydown', keyCode: 13, preventDefault: ()=>0 } )

                } else console.error( "TPUL wasn't able to send the chat message", message )
            },

            get _handler(){ // Self-overwriting getter
                // Find the keydown handler that opens/closes the chat box
                delete this._handler;
                return this._handler = $._data( document, "events" ).keydown.find(
                    listener => listener.handler.toString().includes('tagpro.keys.chatToTeam')
                ).handler || function(){$(document).trigger(...arguments)};
            },
        },

        get playerLocation(){

            // This function seems to be pointless, but I'll make
            // sure it'll keep working even when the site architechture changes,
            // so that you don't have to update your script too often :)
            // (for example, when the SWJ got introduced)

            if ( location.pathname.startsWith('/games/find') ) return 'find';
            if ( location.pathname.match(/^\/groups\/[a-z]{8}$/) ) return 'group';
            var path = location.pathname.match(/\w+/);
            if (path) return path[0];
            if ( location.port ) return 'game';
            if ( location.pathname == '/' ) return 'home';

            throw 'Player location unknown';
        },

        /*events: {
            on: function(event, callback) {

                if( !tpul.events._listeners[event] ) tpul.events._listeners[event] = []
                tpul.events._listener.push(callback)

                //if (event in deepEvents) enableDeepEvents();
            },

            on: function(event, callback) {

                if (event == 'register') throw "You can't use 'register' as an event"

                if (typeof tagpro != 'undefined') {
                    if ( !tagpro.events ) tagpro.events = {}
                    if ( !tagpro.events[event] ) tagpro.events[event] = []


                if (!tagpro.events[event]) tagpro.events[event] = [];

                var eventFunc = {};
                eventFunc[event] = callback;
                tagpro.events[event].push(eventFunc);

                //if (event in deepEvents) enableDeepEvents();
            },

            emit: function(event, data) {

                if ( tpul.events._listeners[event] ) for (let callback of tpul.events._listeners[
                if (tagpro.events[event]) for (let listener of tagpro.events[event]) {
                    try { listener[event](data); }
                    catch (e) {
                        console.error("Unhandled tagpro.events.on('"+event+"') error. Mod makers, handle your errors!");
                        console.error(e);
                        console.error( listener[event]);
                    }
                }
            },

            _listeners: {}
        }*/
    };






    // =====DOM SECTION=====



    var SettingsMenu = document.getElementById('tpul-settings-menu') || document.createElement('div');
    SettingsMenu.id = 'tpul-settings-menu';

    var SettingsFrame = document.getElementsByClassName('tpul-settings-frame')[0] || document.createElement('div');
    SettingsFrame.className = 'tpul-settings-frame';
    if(tpul.playerLocation == 'game') SettingsFrame.classList.add('in-game');
    document.body.appendChild(SettingsFrame);


    if (!SettingsMenu.parentElement) tpul.settings.parent = null;

    // =====NOITCES MOD=====





    // OPENING AND CLOSING

    SettingsFrame.onclick = function(click) {

        // Close all settings when clicking outside the panel
        if (SettingsFrame == click.target) for (var settings of all_settings) settings.close();

    };

    SettingsFrame.addEventListener('wheel', function(wheel) {

        // Close all settings when scrolling up far enough
        setTimeout(function(){
            if (SettingsFrame.firstElementChild &&
                SettingsFrame.scrollTop + SettingsFrame.offsetHeight <= SettingsFrame.firstElementChild.offsetTop + 20)
                for (var settings of all_settings) settings.close();
        },200);

        // Open when scrolling down (only in game) DOESN'T WORK PROPERLY
        // if (tpul.playerLocation == 'game' && wheel.deltaY > 0 && last_opened && !last_opened.isOpen) last_opened.open();

        if (wheel.deltaY > 0) {
            // Hide the scrolldown arrow TODO
            for (var arrow of document.getElementsByClassName('tpul-settings-scroll-down-arrow')) {
                arrow.style.opacity = 0;
            }
        }
    })




    // Section tabs

    SettingsFrame.addEventListener('click', function(click) {
        var tablist = click.target.parentElement;
        if (tablist.classList.contains('tab-list')) {

            var scrollTop = SettingsFrame.scrollTop;
            console.log(scrollTop);

            for (let li of tablist.getElementsByTagName('li'))
                li.classList.remove('active');
            for (let pane of tablist.parentElement.getElementsByClassName('tab-pane'))
                pane.classList.remove('active');
            click.target.classList.add('active');
            document.querySelector(click.target.dataset.target).classList.add('active');

            SettingsFrame.scrollTop = scrollTop;
        }
    }, true);



    // Get settings from socket:

    if (typeof tagpro != 'undefined' && tagpro.ready) {
        tagpro.ready(function(){
            if (tagpro.socket && tagpro.socket.on) {
                tagpro.socket.on('settings', function(settings) {
                    // Don't try to tamper with this, or copy this in your own script.
                    // It will affect all scripts using TPUL.
                    tpul.profile.getSettings( {__settings:Object.assign(settings.ui, {stats: settings.stats})} );
                });
            }
        });
    }

    // Some helper function(s)

    function param(o){

        return Object.keys(o).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(o[k.replace(' ','+')]);
        }).join('&').replace(/%20/g, '+');
    }




    // =====NOITCES CIGOL=====





    if (typeof tpul_promises == 'undefined') {
        try{
            window.tpul_promises = {};
            unsafeWindow.tpul_promises = window.tpul_promises;
        }catch(e){}
    }

    var tpul_common = {}

    if (typeof tpul_common == 'undefined') {
        if (window) window.tpul_common = tpul_common
        if (unsafeWindow) unsaeWindow.tpul_common = tpul_common
    }


    // If running independently (not @required by another script)
    // only good for modders or while debugging
    if (typeof GM_info == 'undefined' || GM_info.script.name == 'TagPro Userscript Library') {
        if (typeof tagpro != 'undefined') tagpro.tpul = tpul;
        if (window) window.tpul = tpul;
        if (unsafeWindow) unsafeWindow.tpul = tpul;
    }

    return tpul;
})();