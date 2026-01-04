// ==UserScript==
// @name         Case360 script editor
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       P. Wasilewski
// @collaborator B. Bergs
// @collaborator J. Elsen
// @description  Try to take over the world and make it a better place!
// @match        */sonora/Admin?op=i
// @supportURL   https://github.com/pwasilewski/Case360-editor
// @updateURL    https://raw.githubusercontent.com/pwasilewski/Case360-editor/master/Case360%20script%20editor.user.js
// @downloadURL  https://raw.githubusercontent.com/pwasilewski/Case360-editor/master/Case360%20script%20editor.user.js
// @resource     functions       https://raw.githubusercontent.com/pwasilewski/Case360-editor/master/functions.json
// @resource     caseMethods     https://raw.githubusercontent.com/pwasilewski/Case360-editor/master/methods.json
// @resource     staticFunctions https://raw.githubusercontent.com/pwasilewski/Case360-editor/master/static_functions.json
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/35458/Case360%20script%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/35458/Case360%20script%20editor.meta.js
// ==/UserScript==

const ACE_CONFIG = '{ "id":"GM_config", "title":"Case360 script editor config", "fields":{ "repository":{ "label":"Ace repository", "type":"text", "default":"ace/" }, "theme":{ "label":"Theme", "type":"select", "default":"piwi", "options":[ "ambiance", "chaos", "chrome", "clouds", "clouds_midnight", "cobalt", "crimson_editor", "dawn", "dracula", "dreamweaver", "eclipse", "github", "gob", "gruvbox", "idle_fingers", "iplastic", "katzenmilch", "kr_theme", "kuroir", "merbivore", "merbivore_soft", "monokai", "mono_industrial", "notepad", "pastel_on_dark", "piwi", "solarized_dark", "solarized_light", "sqlserver", "terminal", "textmate", "tomorrow", "tomorrow_night", "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties", "twilight", "vibrant_ink", "xcode" ] }, "hline":{ "label":"Show horizontal line", "type":"checkbox", "default":true }, "showSnippets":{ "label":"Show snippets", "type":"checkbox", "default":true }, "showScriptCompleter":{ "label":"Show scripts completer", "type":"checkbox", "default":true }, "showFunctionCompleter":{ "label":"Show functions completer", "type":"checkbox", "default":true }, "showStaticFunctionCompleter":{ "label":"Show static functions completer", "type":"checkbox", "default":true }, "showMethodCompleter":{ "label":"Show methods completer", "type":"checkbox", "default":true } } }';

GM_config.init($.parseJSON (ACE_CONFIG));

GM_registerMenuCommand("Configure Case360 script editor", function(){
  GM_config.open();
});

const CASE_EDITOR_ID          = "Script";
const CASE_EDITOR_SELECTOR    = "#" + CASE_EDITOR_ID;
const URL_AJAX_COMPILE_SCRIPT = "CaseAjax?method=ScriptsHelper.compileScript";

const ACE_REPOSITORY          = GM_config.get("repository");
const ACE_CDN_URL             = ACE_REPOSITORY + "ace.js";
const ACE_LANG_CDN_URL        = ACE_REPOSITORY + "ext-language_tools.js";
const ACE_EDITOR_ID           = "editor";
const ACE_EDITOR_SELECTOR     = "#" + ACE_EDITOR_ID;
const ACE_MODE                = "ace/mode/case";
const ACE_THEME               = "ace/theme/" + GM_config.get("theme");

var scriptName = "";
var editor;
var ace_loaded = false;
var autocomplete_loaded = false;

function GM_compileScript() {
    var ScriptSource = encodeURIComponent(removeCR(editor.getSession().getValue()));
    var nodeId = document.getElementById("scriptNodeId");
    if (nodeId !== null) {
        var requestUrl = URL_AJAX_COMPILE_SCRIPT;
        var params = "nodeID=" + encodeURIComponent(nodeId.value) + "&scriptSource=" + ScriptSource;
        getASyncAjaxResponse(requestUrl, params, GM_getCompileResults);
    }
}

function GM_getCompileResults(objRequestHttp) {
    if (objRequestHttp.readyState == 4 || objRequestHttp.readyState == "complete") {
        if (objRequestHttp.status == 200) {
            var responseXML = objRequestHttp.responseXML;
            GM_showCompileResults(responseXML);
        }
    }
}

function GM_showCompileResults(responseXML) {
    if (responseXML !== null) {
        var errorMsg = responseXML.getElementsByTagName("errormsg");
        var errorNode = errorMsg.item(0).firstChild;
        if (errorNode !== null) {
            var offsetPos = errorNode.nodeValue.lastIndexOf("near offset ");
            var offset = 0;
            var line = 0;
            var linePos = errorNode.nodeValue.lastIndexOf(" in line ");
            if (linePos == -1) {
                if (offsetPos != -1) {
                    offset = parseInt(errorNode.nodeValue.substring(offsetPos + 12));
                }
                line = 1;
            } else {
                if (offsetPos != -1) {
                    offset = parseInt(errorNode.nodeValue.substring(offsetPos + 12, linePos));
                }
                line = parseInt(errorNode.nodeValue.substring(linePos + 9));
            }

            editor.getSession().setAnnotations([{
                row: line-1,
                column: offset,
                text: errorNode.nodeValue,
                type: "error"
            }]);
        } else {
            editor.getSession().clearAnnotations();
        }
    }
}

function GM_wait() {
    if(!ace_loaded)
    { window.setTimeout(GM_wait,100); }
    else {
        if(!autocomplete_loaded) {
            GM_appendAutoCompleteScript();

            if(!autocomplete_loaded)
            { window.setTimeout(GM_wait,100); }

        } else {
            GM_initializeEditor();
        }
    }
}

function GM_appendAceScript() {
    if($("script[src$='ace.js']").length === 0) {
        var ace      = document.createElement('script');
            ace.src  = ACE_CDN_URL;
            ace.type = 'text/javascript';
            ace.onload = function() {
                ace_loaded = true;
            };

        document.getElementsByTagName('head')[0].appendChild(ace);
    }
}

function GM_appendAutoCompleteScript() {
    if($("script[src$='ext-language_tools.js']").length === 0) {
        var ace_lang      = document.createElement('script');
            ace_lang.src  = ACE_LANG_CDN_URL;
            ace_lang.type = 'text/javascript';
            ace_lang.onload = function() {
                autocomplete_loaded = true;
            };

        document.getElementsByTagName('head')[0].appendChild(ace_lang);
    }
}

function GM_initializeEditor() {
    var GM_EDITOR       = document.createElement('div');
        GM_EDITOR.id    = ACE_EDITOR_ID;
    $(GM_EDITOR).insertBefore(CASE_EDITOR_SELECTOR);

    var langTools = ace.require("ace/ext/language_tools");
    editor = ace.edit(ACE_EDITOR_ID);
    editor.getSession().setMode(ACE_MODE);
    editor.setTheme(ACE_THEME);

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets : GM_config.get("showSnippets"),
        showPrintMargin : GM_config.get("hline")
    });

    editor.commands.addCommand({
        name: "replace",
        bindKey: {win: "Ctrl-S", mac: "Command-S"},
        exec: function(editor) {
            updateSource(false);
        }
    });

    var textarea = $('textarea[id="' + CASE_EDITOR_ID + '"]');
    $(GM_EDITOR).width("100%");
    $(GM_EDITOR).height($("#rightpane").height()-58);
    textarea.hide();

    editor.getSession().setValue(textarea.val());
    editor.getSession().on('change', function(e){
        textarea.val(editor.getSession().getValue());
        scriptChanges();
    });

    editor.getSession().selection.on('changeCursor', function(e, o) {
        compileScript();
        GM_compileScript();
    });

    if(GM_config.get("showScriptCompleter")){
        langTools.addCompleter(scriptsCompleter);
    }
    if(GM_config.get("showFunctionCompleter")){
        langTools.addCompleter(functionsCompleter);
    }
    if(GM_config.get("showMethodCompleter")){
        langTools.addCompleter(methodsCompleter);
    }
    if(GM_config.get("showStaticFunctionCompleter")){
        langTools.addCompleter(staticFunctionsCompleter);
    }
}

$('#rightpane').bind('DOMSubtreeModified', function() {
    var script = $('#scriptlocation').val();
    if($(CASE_EDITOR_SELECTOR).length !== 0 && scriptName != script) {

        scriptName = script;

        GM_appendAceScript();

        GM_wait();
    }
});

// ### UTIL FUNCTIONS ###

/**
 * Function to format the list of params and remove useless extension.
 *
 * E.g.: TST.updateActor(Object.PropertyManager.RepositoryObject.FormData actorFormdata, Object.PropertyManager.FmsRow updatedRow)
 *
 * @param {String} methodName The method name (e.g.: TST.updateActor)
 * @param {String} argumentsString The list of arguments (e.g.: Object.PropertyManager.RepositoryObject.FormData actorFormdata, Object.PropertyManager.FmsRow updatedRow)
 *
 * @return {String} The format string. (e.g.: TST.updateActor(FormData actorFormdata, FmsRow updatedRow))
 */
function getSimplifiedMethodFormat(methodName, argumentsString) {
    var result = [];
    var simplified = [];
    var args = argumentsString.split(",");

    $.each( args, function( index, value ) {
        var splitedArg = value.match(/(.+)\s+(.+)/);
        if(splitedArg !== null) {
            simplified.push(splitedArg[1].split('.').pop() + ' ' + splitedArg[2]);
        } else {
            simplified.push(value.trim());
        }
    });

    result.push(methodName, "(", simplified.join(", ") ,")");
    return result.join("");
}

/**
 * Function to format the list of params allowing snippets and remove useless extension.
 *
 * E.g.: TST.updateActor(Object.PropertyManager.RepositoryObject.FormData actorFormdata, Object.PropertyManager.FmsRow updatedRow)
 *
 * @param {String} methodName The method name (e.g.: TST.updateActor)
 * @param {String} argumentsString The list of arguments (e.g.: Object.PropertyManager.RepositoryObject.FormData actorFormdata, Object.PropertyManager.FmsRow updatedRow)
 *
 * @return {String} The format string. (e.g.: TST.updateActor(${1:actorFormdata}, ${2:updatedRow}))
 */
function getSnippetMethodFormat(methodName, argumentsString) {
    var result = [];
    var snippet = [];
    var args = argumentsString.split(",");

    $.each( args, function( index, value ) {
        var splitedArg = value.match(/(.+)\s+(.+)/);
        if(splitedArg !== null) {
            snippet.push('${' + (index+1) + ':' + splitedArg[2] + '}');
        } else {
            snippet.push('${' + (index+1) + ':' + value.trim() + '}');
        }
    });

    result.push(methodName, "(", snippet.join(", ") ,")");
    return result.join("");
}

function buildMethod(prefix, signature) {
    if( ! prefix.endsWith(".") ) {
        prefix += ".";
    }

    return prefix + signature;
}

function getMethodName(fullsignature) {
    return fullsignature.split('(')[0];
}

function getMethodArgs(fullsignature) {
    return fullsignature.match(/\((.*?)\)/)[1];
}

function countNumberDots(text) {
    return (text.match(/\./g)||[]).length;
}

function hasDots(text) {
    return countNumberDots(text) > 0;
}

function getPrefix(text) {
    return text.substring(0, text.lastIndexOf("."));
}

// ### COMPLETERS ###

/**
 * Fill in the completer with scripts like :
 *
 * DAMO.Log.log(...) or DAMO.Util.getEnvironment(...)
 *
 * Firstly, the function will be executed if and only if the prefix has at least 1 dot.
 * Secondly, it will make an ajax call to retrieve a list of script based on the prefix.
 *
 * If both conditions are met, the function will format the output and will add it to the completers.
 * If not, nothing will happen.
 */
var scriptsCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if(! hasDots(prefix) ) return;

        prefix = getPrefix(prefix);

        $.ajax({
            type: "GET",
            url: "CaseAjax?getmethods=" + prefix,
            dataType: "xml",
            success: function(xml){
                var completers = [];
                if($(xml).find("responseXML").length == 1) {
                    $(xml).find("class").each(function(){
                        $(this).children().each(function(){
                            var method		= buildMethod(prefix, $(this).text());
                            var methodName 	= getMethodName(method);
                            var args		= getMethodArgs(method);

                            simplifiedMethod = getSimplifiedMethodFormat(methodName, args);
                            snippetMethod    = getSnippetMethodFormat(methodName, args);
                            completers.push({definition : simplifiedMethod, value : simplifiedMethod, snippet: snippetMethod, score : 1000, meta : 'script', type: 'script'});
                        });
                    });
                }

                callback(null, completers); return ;
            }
        });
    },
    getDocTooltip: function(item) {
        if (item.type == 'script' && !item.docHTML) {
            var scriptIcon = "<span style=\"background: red;display: inline-block;border-radius: 50%;height: 13px;width: 13px;font-size: 11px;line-height: 14px;text-align: center;color: white;\"><i>s</i></span>";
            item.docHTML = "<h5 style=\"margin:0px;\">" + scriptIcon + " <i>Scripts</i> - " + item.definition + "</h5>";
        }
    }
};

/**
 * Fill in the completer with functions like :
 *
 * optional(...) or doQuery(...)
 *
 * Firstly, the function will be executed if and only if the prefix doesn't contain any dots.
 *
 * If the condition is met, the function will format the output and will add it to the completers based on the ressource file.
 * If not, nothing will happen.
 */
var functionsCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if( hasDots(prefix) ) return;

        var ressourceFile = GM_getResourceText("functions", "json");

        callback(null, JSON.parse(ressourceFile).functions.map(function(func) {
            var method		= func.signature;
            var methodName 	= getMethodName(method);
            var args		= getMethodArgs(method);

            simplifiedMethod = getSimplifiedMethodFormat(methodName, args);
            snippetMethod    = getSnippetMethodFormat(methodName, args);
            return {definition: func.definition, value: simplifiedMethod, snippet: snippetMethod, score: 1000, meta : 'function', type: 'function'};
        }));
    },
    getDocTooltip: function(item) {
        if (item.type == 'function' && !item.docHTML) {
            var functionIcon = "<span style=\"background: #7c7;display: inline-block;border-radius: 50%;height: 13px;width: 13px;font-size: 11px;line-height: 14px;text-align: center;color: white;\"><i>f</i></span>";
            item.docHTML = "<h5 style=\"margin:0px;\">" + functionIcon + " <i>Function</i> - " + item.value + "</h5> <p style=\"margin:0px;word-wrap:break-word;\">" + item.definition + "</p>";
        }
    }
};

/**
 * Fill in the completer with Case360's built-in methods like :
 *
 * prefix.saveChanges(...) or prefix.add(...)
 *
 * Firstly, the function will be executed if and only if the prefix has at least 1 dot.
 * Secondly, it checks if the user is not looking for a case scripts. (e.g.: DAMO.Log.)
 *
 * If both conditions are met, the function will format the output and will add it to the completers based on the ressource file.
 * If not, nothing will happen.
 */
var methodsCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if(! hasDots(prefix) ) return;

        prefix = getPrefix(prefix);

        var isScriptSearch = false;
        $.ajax({
            type: "GET",
            url: "CaseAjax?getmethods=" + prefix,
            dataType: "xml",
            async: false,
            success: function(xml){
                isScriptSearch = $(xml).find("responseXML").length == 1;
            }
        });

        if(isScriptSearch) return;

        var ressourceFile = GM_getResourceText("caseMethods", "json");

        callback(null, JSON.parse(ressourceFile).methods.map(function(met) {
            var method		= buildMethod(prefix, met.signature);
            var methodName 	= getMethodName(method);
            var args		= getMethodArgs(method);

            simplifiedMethod = getSimplifiedMethodFormat(methodName, args);
            snippetMethod    = getSnippetMethodFormat(methodName, args);
            return {definition: met.definition, value: simplifiedMethod, snippet: snippetMethod, score: 1000, meta : met.meta, type: 'method'};
        }));
    },
    getDocTooltip: function(item) {
        if (item.type == 'method' && !item.docHTML) {
            var methodIcon = "<span style=\"background: #CC00CC;display: inline-block;border-radius: 50%;height: 13px;width: 13px;font-size: 11px;line-height: 14px;text-align: center;color: white;\"><i>m</i></span>";
            item.docHTML = "<h5 style=\"margin:0px;\">" + methodIcon + " <i>" + item.meta + "</i> - " + item.value + "</h5> <p style=\"margin:0px;word-wrap:break-word;\">" + item.definition + "</p>";
        }
    }
};

/**
 * Fill in the completer with static functions/methods like :
 *
 * WorkItem.find(...) or User.find(...)
 *
 * Firstly, the function will be executed if and only if the prefix has 1 dot.
 * Secondly, it checks if the prefix exists as key in the ressource file.
 *
 * If both conditions are met, the function will format the output and will add it to the completers.
 * If not, nothing will happen.
 */
var staticFunctionsCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        if( countNumberDots(prefix) !== 1 ) return;

        prefix = getPrefix(prefix);

        var ressourceFile = GM_getResourceText("staticFunctions", "json");
        var jsonString = JSON.parse(ressourceFile);

        if(jsonString.hasOwnProperty(prefix.toLowerCase())) {
            callback(null, jsonString[prefix.toLowerCase()].map(function(func) {
                var method		= buildMethod(prefix, func.signature);
                var methodName 	= getMethodName(method);
                var args		= getMethodArgs(method);

                simplifiedMethod = getSimplifiedMethodFormat(methodName, args);
                snippetMethod    = getSnippetMethodFormat(methodName, args);
                return {definition: func.definition, value: simplifiedMethod, snippet: snippetMethod, score: 2000, meta : func.meta, type: 'staticFunction'};
            }));
        }
    },
    getDocTooltip: function(item) {
        if (item.type == 'staticFunction' && !item.docHTML) {
            var functionIcon = "<span style=\"background: #ffae19;display: inline-block;border-radius: 50%;height: 13px;width: 13px;font-size: 11px;line-height: 14px;text-align: center;color: white;\"><i>f</i></span>";
            item.docHTML = "<h5 style=\"margin:0px;\">" + functionIcon + " <i>" + item.meta + "</i> - " + item.value + "</h5> <p style=\"margin:0px;word-wrap:break-word;\">" + item.definition + "</p>";
        }
    }
};
