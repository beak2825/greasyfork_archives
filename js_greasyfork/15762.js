// ==UserScript==
// @author      Jure (Edited by Machmet)
// @name           Memrise - Change word definition
// @namespace      machmet
// @description    Change original word definition to your own. Some words have weird definitions, sometimes you want to translate definition from english to your own language.
// @match          http://www.memrise.com/*/garden/*/
// @version        2.0.2
// @grant 	    GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// @grant       GM_openInTab
// @grant       GM_addStyle
// @grant 	    unsafeWindow
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/15762/Memrise%20-%20Change%20word%20definition.user.js
// @updateURL https://update.greasyfork.org/scripts/15762/Memrise%20-%20Change%20word%20definition.meta.js
// ==/UserScript==
console.log('Memrise - Start');
var machmet = {};
machmet.onLoad = function(){
    var h = '<div id="addToList" class="btn-group pull-right" style="position:absolute;top:130px;right:0px;">';
    h +=    '  <p><button class="btn btn-icos-active" id="editbutton">';
    h += '    <span class="ico ico-edit"></span>';
    h +=    '    Change translation';
    h += '  </button></p>';
    h += '  <p><button class="btn btn-icos-active" id="delitebutton">';
    h += '    <span class="ico ico-edit"></span>';
    h += '    Delete translation';
    h += '  </button><p>';
    h +=    '</div>';
    //Display info about adder aree
    console.log(unsafeWindow.$("#right-area"));
    unsafeWindow.$("#right-area").append(h);
    unsafeWindow.$(document).on('click','#editbutton',machmet.changeTranslation);
    unsafeWindow.$(document).on('click','#delitebutton',machmet.deleteTranslation);
    unsafeWindow.$(document).on('DOMSubtreeModified','#boxes',machmet.boxesDOMSubtreeModified);
};

machmet.changeTranslation = function(){
    var thing_id = unsafeWindow.MEMRISE.garden.box.box_dict.thing_id;
    var c = unsafeWindow.MEMRISE.garden.session_data.things[thing_id].columns;
    var pTitle = "Please enter new translation for: "+c[2].val;
    var pValue = GM_getValue("id" + thing_id, c[2].val);
    //var newvalue = unsafeWindow.prompt(pTitle, pValue);
    unsafeWindow.$.gDialog.prompt("Your Username", "jQueryScript",{title: "Prompt Dialog Box",required: true});
    return;
    console.log(c);
    console.log(pTitle);
    console.log(pValue);
    console.log(newvalue);
    console.log(unsafeWindow.prompt);
    
    if (newvalue !== null && newvalue !== "") {
        GM_setValue("id" + thing_id, newvalue);
        try {
            unsafeWindow.$("div.row.column.secondary").find(".row-value")[0].innerHTML = newvalue;
        }
        catch (err) { }
        var vpr = document.getElementsByClassName("qquestion qtext ");
        if (vpr.length) {
            vpr[0].innerHTML = newvalue;
        }

    }
};

machmet.deleteTranslation = function(){
    var thing_id = unsafeWindow.MEMRISE.garden.box.box_dict.thing_id;
    var c = unsafeWindow.MEMRISE.garden.session_data.things[thing_id].columns;
    //GM_deleteValue("id" + thing_id);
    var newvalue = GM_getValue("id" + thing_id, c[2].val);
    if (newvalue !== null && newvalue !== "") {
        try {
            unsafeWindow.$("div.row.column.secondary").find(".row-value")[0].innerHTML = newvalue;
        }
        catch (err) { }
        var vpr = document.getElementsByClassName("qquestion qtext ");
        if (vpr.length) {
            vpr[0].innerHTML = newvalue;
        }
    }
};

machmet.boxesDOMSubtreeModified = function(){
    var thing_id = unsafeWindow.MEMRISE.garden.box.box_dict.thing_id;
    var nova=GM_getValue("id" + thing_id, "");
    if (nova === ""){
        return;
    }
    var vpr = document.getElementsByClassName("qquestion qtext ");
    if (vpr.length){
        vpr[0].innerHTML = nova;
    }
    try {
        unsafeWindow.$("div.row.column.secondary").find(".row-value")[0].innerHTML = nova;
    }
    catch (err) { }
};

$(unsafeWindow.document).ready(function(){
    console.log('Memrise - Document Ready');
    machmet.onLoad();
});
/**
 * jquery.gDialog.js
 * @version: v0.1.0
 * @author: ogilvieira
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
$(unsafeWindow.document).ready(function(){
    var m = {};
 	var g = {};
    m.OPENING = false;
    m._OPTIONS = {
        title: false,
        animateIn : false,
        animateOut : false,
        onSubmit : false,
        onCancel : false,
        required: false,
    };

    m.tplBase = "<div class=\"gdialog-wrap\">";
    m.tplBase += "<div class=\"gdialog-container\">";
    m.tplBase += "{{HEADER}}";
    m.tplBase += "<div class=\"gdialog-content\">{{message}}{{INPUT}}</div>";
    m.tplBase += "<div class=\"gdialog-button-group\">{{BUTTON_CANCEL}} <button class=\"button button-ok\">Ok</button></div>";
    m.tplBase += "</div>";
    m.tplBase += "</div>";

    m.tplHeader = "<div class=\"gdialog-header\">{{title}}</div>";
    m.tplInput = "<div class=\"gdialog-field\"><input type=\"text\"></div>";

    m.getTeplate = function(type, message, options){
        var t = m.tplBase;
        if( type !== 'alert' ){
            t = t.replace("{{BUTTON_CANCEL}}", "<button class=\"button button-cancel\">Cancel</button>");
        } else {
            t = t.replace("{{BUTTON_CANCEL}}", "");
        }
        if( type == 'prompt' ){
            t = t.replace("{{INPUT}}", m.tplInput);
        } else {
            t = t.replace("{{INPUT}}", "");
        }
        if( options.title ){
            t = t.replace("{{HEADER}}", m.tplHeader.replace("{{title}}", options.title) );
        } else {
            t = t.replace("{{HEADER}}", "");
        }
        t = t.replace("{{message}}", message );
        return t;
    };

    m.clear = function(){
        if($('.gdialog-shadow').length  > 0) {$('.gdialog-shadow').remove();}
        if($('.gdialog-wrap').length) { $('.gdialog-wrap').remove();}
    };

    m.Dialog = function(){
        var that = this;
        that.close = function(){
            $('.gdialog-shadow').addClass("animated fadeOut");
            if( that.options.animateOut ){
                if( that.options.animateIn ){ that.container.find('.gdialog-container').removeClass(that.options.animateIn); }
                that.container.find('.gdialog-container').addClass('animated '+that.options.animateOut);
                setTimeout(function(){
                    that.container.removeClass('is-active');
                    that.container.remove();
                    m.OPENING = false;
                    $('.gdialog-shadow').remove();
                }, 800);
            }else {
                that.container.remove();
                m.OPENING = false;
                $('.gdialog-shadow').remove();
            }
        };

        that.addEvents = function(){
            that.btnOk.on("click", function(e){
                e.preventDefault();
                var res = false;
                if( that.field.length ){
                    if( that.options.required === true && (that.field.val().length === 0) ){
                        that.field.addClass('is-invalid');
                        return false;
                    } else {
                        that.field.removeClass('is-invalid');
                        res = that.field.val();
                    }
                } else {
                    res = true;
                }
                if( typeof that.options.onSubmit == 'function' ){
                    that.options.onSubmit(res);
                }
                that.close();
            });
            that.btnCancel.on("click", function(e){
                e.preventDefault();
                var res = false;
                if( that.field.length && that.field.val().length !== 0 ){
                    res = that.field.val();
                }
                if( typeof that.options.onCancel == 'function' ){
                    that.options.onCancel(res);
                }
                that.close();
            });
        };

        this.init = function(type, message, options, defaultValue){
            if( m.OPENING )
            {
                unsafeWindow.$('.gdialog-shadow, .gdialog-wrap').remove();
            }
            m.clear();

            that.options = m.getOptions(options);

            unsafeWindow.$('body').append("<div class=\"gdialog-shadow\"></div> "+m.getTeplate(type, message, that.options) );
            that.container = unsafeWindow.$('body').find('.gdialog-wrap');
            that.btnOk = that.container.find('.button-ok');
            that.btnCancel = that.container.find('.button-cancel');
            that.field = that.container.find('input');
            if( defaultValue && that.field.length ){
                that.field.val(defaultValue);
            }

            that.container.addClass('is-active').css({'top': $(window).scrollTop()+50});
            if( that.options.animateIn ){
                that.container.find('.gdialog-container').addClass('animated '+that.options.animateIn);
            }
            m.OPENING = true;

            that.addEvents();
        };
    };

    m.getOptions = function(options){
        var o = $.extend({}, m._OPTIONS);

        if( typeof options == 'object' ){
          $.each(options, function(key, val){
            if(o[key] !== undefined){
                o[key] = val;
            }
            else{
                console.error("The option \""+key+"\" not exist.");
            }
          });
        }
        return o;
    };

    //global functions
    g.alert = function(message, userOptions){
        var message1 = message || "";
        var userOptions1 = userOptions || {};
        var dialog1 = new m.Dialog();
        dialog1.init('alert', message1, userOptions1);
    };

    g.confirm = function(message, userOptions){
        var message1 = message || "";
        var userOptions1 = userOptions || {};
        var dialog1 = new m.Dialog();
        dialog1.init('confirm', message1, userOptions);
    };

    g.prompt = function(message, defaultValue, userOptions){
        var message1 = message || "";
        var userOptions1 = userOptions || {};
        var dialog1 = new m.Dialog();
        dialog1.init('prompt', message1, userOptions1, defaultValue);
    };

    g.config = function(options){
        if( typeof options !== 'object' ){ return false; }
        $.each(options, function(key, val){
            if(m._OPTIONS[key] !== undefined){
                m._OPTIONS[key] = val;
            }
            else{
                console.error("The option \""+key+"\" not exist.");
            }
        });
    };

     unsafeWindow.$.gDialog = $.gDialog || g;

    GM_addStyle(".gdialog-shadow { background-color: rgba(0, 0, 0, 0.8); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; font-size: 16px;}");
    GM_addStyle(".gdialog-wrap {width: 100%; height: auto; position: absolute; top: 0; left: 0; z-index: 10000; box-sizing: border-box; padding: 20px; background: transparent; display: none;}");
    GM_addStyle(".gdialog-wrap.is-active {display: block; }");
    GM_addStyle(".gdialog-wrap .gdialog-container { box-sizing: border-box; margin: 0 auto; width: 100%; height: auto; min-height: 100px; max-width: 500px; background-color: #FFF;  border-radius: 5px;    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);  overflow: hidden; }");
    GM_addStyle(".gdialog-wrap .gdialog-header {width: 100%;box-sizing: border-box;padding: 10px 20px;border-bottom: 1px solid rgba(0, 0, 0, 0.1);font-size: 1.2em;line-height: 1.4em;  font-family: 'Open Sans', 'Arial', sans-serif; color: #444;text-align: center;  cursor: default;-webkit-user-select: none; -moz-user-select: none;-ms-user-select: none; user-select: none;}");
    GM_addStyle(".gdialog-wrap .gdialog-content {width: 100%;min-height: 80px;clear: both;padding: 20px;font-family: 'Open Sans', 'Arial', sans-serif;  font-size: 1em;  line-height: 1.2em;color: #444;    box-sizing: border-box; }");
    GM_addStyle(".gdialog-wrap .gdialog-content .gdialog-field {width: 100%;clear: both;margin: 10px 0; width: 100%; }");
    GM_addStyle(".gdialog-wrap .gdialog-content .gdialog-field input {display: block; width: 100%;height: 37px;line-height: 37px;border: 1px solid rgba(0, 0, 0, 0.1); outline: none;color: #444;        font-family: 'Open Sans', 'Arial', sans-serif; font-size: .9em; padding: 0 10px; box-sizing: border-box; border-radius: 3px; box-shadow: none; box-shadow: inset 0 5px 15px rgba(0, 0, 0, 0.1);        background-image: none;background-color: #ecf0f1;}");
    GM_addStyle(".gdialog-wrap .gdialog-content .gdialog-field input.is-invalid {border-color: red; }");
    GM_addStyle(".gdialog-wrap .gdialog-button-group {width: 100%;box-sizing: border-box;overflow: hidden;clear: both; text-align: center;border-top: 1px solid rgba(0, 0, 0, 0.1); }");
    GM_addStyle(".gdialog-wrap .gdialog-button-group .button {display: block;width: 50%;height: 50px;float: left;background-color: transparent;margin: 0 auto;box-sizing: border-box;border-radius: 0;      font-family: 'Open Sans', 'Arial', sans-serif;font-size: 1em;text-transform: uppercase;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}");
    GM_addStyle(".gdialog-wrap .gdialog-button-group .button.button-ok {color: #2980b9;float: none;width: 100%; }");
    GM_addStyle(".gdialog-wrap .gdialog-button-group .button.button-cancel {color: #c0392b; }");
    GM_addStyle(".gdialog-wrap .gdialog-button-group .button.button-cancel + .button-ok {float: left;width: 50%; }");
    GM_addStyle(".gdialog-wrap .gdialog-button-group .button:active {background-color: whitesmoke; }");
    GM_addStyle("@media screen and (max-width: 480px) {.gdialog-wrap .gdialog-header {font-size: .9em;line-height: 1.4em; }.gdialog-wrap .gdialog-content {font-size: .8em;line-height: 1.2em; } .gdialog-wrap .gdialog-content .gdialog-field input { font-size: 1em; }gdialog-wrap .gdialog-button-group {  font-size: .8em; } }");
});
