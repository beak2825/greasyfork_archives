// ==UserScript==
// @name            Syntax-Highlight-Style
// @namespace       https://github.com/Amourspirit/Syntax-Highlight-Style
// @version         1.1.2
// @description     Adds extra code highlighting frormating options ot syntaxhighlight.in
// @author          Paul Moss
// @match           http://syntaxhighlight.in/
// @license         MIT
// @homepageURL     http://amourspirit.github.io/Syntax-Highlight-Style/
// @update          https://github.com/Amourspirit/Syntax-Highlight-Style/raw/master/syntax-highlight-style.user.js
// @contributionURL http://amourspirit.github.io/Syntax-Highlight-Style/#donate
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/16658/Syntax-Highlight-Style.user.js
// @updateURL https://update.greasyfork.org/scripts/16658/Syntax-Highlight-Style.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
// #nsregion BIGBYTE
var BIGBYTE = BIGBYTE || {};
if (typeof(BIGBYTE.createNS) == 'undefined') {
    BIGBYTE.createNS = function(namespace) {
        var nsparts = namespace.split(".");
        var parent = BIGBYTE;

        // we want to be able to include or exclude the root namespace so we strip
        // it if it's in the namespace))
        if (nsparts[0] === "BIGBYTE") {
            nsparts = nsparts.slice(1);
        }

        // loop through the parts and create a nested namespace if necessary
        for (var i = 0; i < nsparts.length; i++) {
            var partname = nsparts[i];
            // check if the current parent already has the namespace declared
            // if it isn't, then create it
            if (typeof parent[partname] === "undefined") {
                parent[partname] = {};
            }
            // get a reference to the deepest element in the hierarchy so far
            parent = parent[partname];
        }
        // the parent is now constructed with empty namespaces and can be used.
        // we return the outermost namespace
        return parent;
    };
}
if (typeof(BIGBYTE.isjquery) == 'undefined') {
    BIGBYTE.isjquery = function(data) {
        // If data is already a jQuery object
        if (data instanceof jQuery) {
            // Do nothing different
            data = data;
            // Otherwise            
        } else {
            // Convert to jQuery object
            data = jQuery(data);
        }
        // Return jQuery object     
        return data;
    };
}

// #endnsregion BIGBYTE
// #nsregion BIGBYTE.USERSCRIPT.DOCUMENT

var bbDoc = BIGBYTE.createNS("BIGBYTE.USERSCRIPT.DOCUMENT");
bbDoc.ns = 'BIGBYTE.USERSCRIPT.DOCUMENT';
// #region LoadScripts
if (typeof(bbDoc.loadScript) == 'undefined') {
    bbDoc.loadScript = function(scriptItm) {
        var lib = this;
        if (typeof(scriptItm.count) == 'undefined') {
            scriptItm.count = 0;
        }
        if (typeof(scriptItm.loaded) == 'undefined') {
            scriptItm.loaded = false;
        }
        if (typeof(scriptItm.text) == 'undefined') {
            scriptItm.text = ''; // timeout in seconds
        }
        if (typeof(scriptItm.timeout) == 'undefined') {
            scriptItm.timeout = 30; // timeout in seconds
        }

        var bbScriptLoadedEvent = new CustomEvent(
            "bbScriptLoaded", {
                detail: {
                    message: "Script Loaded",
                    time: new Date(),
                    scriptItm: scriptItm
                },
                bubbles: true,
                cancelable: false
            }
        );

        switch (scriptItm.type) {
            case 'linkedjs':
                var skipTest = false;
                if (typeof(scriptItm.testMethod) == 'undefined' || (scriptItm.testMethod.length == 0)) {
                    skipTest = true;
                }
                if (skipTest) {
                    // there is no test for this item so we will and assume
                    // all is fine/
                    scriptItm.loaded = true;
                    lib.addJS_Node(scriptItm.text, scriptItm.src);
                    // trigger event for loaded

                    //jQuery(document).trigger("bbScriptLoaded", scriptItm);
                    document.dispatchEvent(bbScriptLoadedEvent);
                    return;
                }
                scriptItm.count++;
                var maxCount = scriptItm.timeout * 10; // multply by 10 to convert into 10th of seconds

                if (scriptItm.count > maxCount) {
                    console.error('unable to load script, Aborting: ', scriptItm.src);
                    return;
                }
                var testmethod;
                try {
                    testmethod = eval(scriptItm.testMethod);
                } catch (e) {
                    testmethod = undefined;
                }
                if (typeof(testmethod) == 'undefined') {
                    if (!scriptItm.loaded) {
                        scriptItm.loaded = true;
                        lib.addJS_Node(scriptItm.text, scriptItm.src);
                    }
                    setTimeout(function() {
                        lib.loadScript(scriptItm);
                    }, 100);
                } else {
                    // script item is loaded trigger an evert
                    //jQuery(document).trigger("bbScriptLoaded", scriptItm);
                    document.dispatchEvent(bbScriptLoadedEvent);
                }
                break;
            case 'css':
                if (typeof(scriptItm.tag) == 'undefined') {
                    scriptItm.tag = 'body'; // timeout in seconds
                }
                lib.addCss_Node(scriptItm.src, scriptItm.tag);
                //jQuery(document).trigger("bbScriptLoaded", scriptItm);
                document.dispatchEvent(bbScriptLoadedEvent);
                break;
            case 'csslink':
                lib.addLink_Node(scriptItm.src);
                //jQuery(document).trigger("bbScriptLoaded", scriptItm);
                document.dispatchEvent(bbScriptLoadedEvent);
                break;
            default:
                // statements_def
                break;
        }


    }
}

// #endregion LoadScripts
// #region BIGBYTE.USERSCRIPT.DOCUMENT Methods
// gneric document related
if (typeof(bbDoc.addJS_Node) == 'undefined') {
    bbDoc.addJS_Node = function(text, s_URL, funcToRun, runOnLoad) {
        var D = document;
        var scriptNode = D.createElement('script');
        if (runOnLoad) {
            scriptNode.addEventListener("load", runOnLoad, false);
        }
        scriptNode.type = "text/javascript";
        if (text) scriptNode.textContent = text;
        if (s_URL) scriptNode.src = s_URL;
        if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild(scriptNode);
    };
}
if (typeof(bbDoc.addJS_NodeToBody) == 'undefined') {
    bbDoc.addJS_NodeToBody = function(text, s_URL, funcToRun, runOnLoad) {
        var D = document;
        var scriptNode = D.createElement('script');
        if (runOnLoad) {
            scriptNode.addEventListener("load", runOnLoad, false);
        }
        scriptNode.type = "text/javascript";
        if (text) scriptNode.textContent = text;
        if (s_URL) scriptNode.src = s_URL;
        if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
        targ.appendChild(scriptNode);
    };
}
if (typeof(bbDoc.addCss_Node) == 'undefined') {
    bbDoc.addCss_Node = function(text, element) {
        element = typeof element !== 'undefined' ? element : 'head';
        var D = document;
        var scriptNode = D.createElement('style');
        scriptNode.type = "text/css";
        if (text) scriptNode.textContent = text;

        var targ = D.getElementsByTagName(element)[0] || D.body || D.documentElement;
        targ.appendChild(scriptNode);
    };
}
if (typeof(bbDoc.addLink_Node) == 'undefined') {
    bbDoc.addLink_Node = function(href, type, rel) {
        type = typeof type !== 'undefined' ? type : "text/css";
        rel = typeof rel !== 'undefined' ? rel : "stylesheet";
        var D = document;
        var scriptNode = D.createElement('link');
        scriptNode.type = type;
        scriptNode.href = href;
        if (rel) scriptNode.rel = rel;

        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild(scriptNode);
    };
}

if (typeof(bbDoc.addHtml_Node) == 'undefined') {
    bbDoc.addHtml_Node = function(html) {
        var D = document;
        var targ = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
        targ.insertAdjacentHTML('beforeend', html);
    };
}
// #endregion BIGBYTE.USERSCRIPT.DOCUMENT Methods

// #endnsregion BIGBYTE.USERSCRIPT.DOCUMENT"

// #nsregion BIGBYTE.USERSCRIPT.UTIL
var bbusu = BIGBYTE.createNS("BIGBYTE.USERSCRIPT.UTIL");
bbusu.ns = 'BIGBYTE.USERSCRIPT.UTIL';
// #region Methods
if(typeof(bbusu.extend) == 'undefined') {
    /**
     * Extends an object to contain new Properties
     * @return {[Object]} the new merged oject
     */
    bbusu.extend = function () {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    };
}

// #endregion Methods
// #endnsregion BIGBYTE.USERSCRIPT.UTIL

// #nsregion BIGBYTE.USERSCRIPT.CLIPBOARD
// #region Create NS
var bbClip = BIGBYTE.createNS("BIGBYTE.USERSCRIPT.CLIPBOARD");
bbClip.ns = 'BIGBYTE.USERSCRIPT.CLIPBOARD';
// #endregion Create NS
// #region Properties
bbClip.scriptOutputted = false;
// #endregion Properties
// #endnsregion BIGBYTE.USERSCRIPT.CLIPBOARD

// #nsregion BIGBYTE.STRING
// #region Create NS
var bbString = BIGBYTE.createNS("BIGBYTE.STRING");
bbString.ns = 'BIGBYTE.STRING';
// #endregion Create NS
// #region Init
if (typeof(bbString.pad) == 'undefined') {
    bbString.pad = function pad(str, max, padChar) {
        padChar = padChar || '0';
        str = str.toString();
        return str.length < max ? this.pad(padChar + str, max, padChar) : str;
    }
}
// #endregion Init
// #endnsregion BIGBYTE.STRING

// #nsregion BIGBYTE.USERSCRIPT.STHL
// #region Create NS
var sthl = BIGBYTE.createNS("BIGBYTE.USERSCRIPT.STHL");
sthl.ns = 'BIGBYTE.USERSCRIPT.STHL';
// #endregion Create ns
// #region Button methods

/**
 * Toggles Buttons enabled or disabled
 * @param  {[boolean]} enabled If true buttons will be enable; Otherwise disabled
 */
sthl.toggleButtons = function(enabled, forceRedraw) {
    enabled = (typeof(enabled) == 'undefined') ? false : enabled;
    forceRedraw = (typeof(forceRedraw) == 'undefined') ? false : forceRedraw;
    var $ = jQuery;
    if (enabled) {
        $('#gmconvert').attr("disabled", false);
        $('#gmcopy').attr("disabled", false);
        $('#gmcopytbl').attr("disabled", false);
        $('#gmtable').attr("disabled", false);
    } else {
        $('#gmconvert').attr("disabled", 'disabled');
        $('#gmcopy').attr("disabled", 'disabled');
        $('#gmcopytbl').attr("disabled", 'disabled');
        $('#gmtable').attr("disabled", 'disabled');
    }
    if (forceRedraw) {
        $('#gmconvert').hide().show(0);
        $('#gmcopy').hide().show(0);
        $('#gmcopytbl').hide().show(0);
        $('#gmtable').hide().show(0);
    }
};

sthl.getConvertedList = function() {
    var $ = jQuery;
    var $sourceCode = $('pre.snippet-formatted.sh_sourceCode');
    $sourceCode.makeCssInlineCode(false);
    var contentHtml = '';
    if ($sourceCode.length) {
        var $wrapper = $('<div />');
        $wrapper.assignStyleFrom($sourceCode).css({
            width: 'auto',
            height: 'auto',
            animation: '',
            clip: '',
            direction: '',
            fill: '',
            filter: '',
            flex: '',
            isolation: '',
            orphans: '',
            position: '',
            r: '',
            resize: '',
            rx: '',
            ry: '',
            speak: '',
            stroke: '',
            top: '',
            transform: '',
            transition: '',
            visibility: '',
            widows: '',
            x: '',
            y: '',
            zoom: '',
            //background: '',
            opacity: '',
            order: '',
            clear: '',
            cx: '',
            cy: '',
            float: '',
            mask: '',
            motion: ''
        });
        // $sourceCode.removeAttrib('class', true);
        $sourceCode.wrapInner($wrapper);
        contentHtml = $sourceCode.spaceReplace(true)[0].outerHTML;
    }
    return contentHtml;
};

sthl.getConvertedTable = function() {
    var $ = jQuery;

    var $sourceCode = $('pre.snippet-formatted.sh_sourceCode');

    $sourceCode.find('li').each(function(index, li) {
        // convert li spaces to \u00a0
        $(li).spaceReplace(false); // do not recurse
    });

    $sourceCode.makeCssInlineCode(true); // generates for html Table
    var contentHtml = '';
    if ($sourceCode.length) {
        contentHtml = this.toTable($sourceCode)[0].outerHTML;
    }
    return contentHtml;
};


/*
 * Button click to convert ordered list of the code output to inline styled ordered list
 */
sthl.convertClick = function(btn) {

    var $ = jQuery;
    var lib = BIGBYTE.USERSCRIPT.STHL;
    lib.toggleButtons(false, true);
    $.event.trigger({
        type: 'codeConversionStart',
        message: 'convert_list_start',
        time: new Date(),
        source: 'convertClick'
    });
    this.windowScrollPos = $('body').scrollTop();
    $('html, body').animate({
        scrollTop: 0
    }, 'slow');
    $(document).disableScroll('html, body');
    
    var $btn = BIGBYTE.isjquery(btn); // convert to jquery obj
    var libTmce = BIGBYTE.USERSCRIPT.STHL.TMCE;
    if ($btn.data('converted')) {
        $btn.data('converted', 0);
    } else {
        $btn.data('converted', 1);

    }
    var contentHtml = this.getConvertedList();
    if (libTmce.fullscreen) {
        tinyMCE.get('gminput').execCommand('mceFullScreen');
    }
    tinyMCE.get('gminput').setContent(contentHtml);
    $('.gmbackdrop, .gmbox').animate({
        'opacity': '.50'
    }, 300, 'linear');
    $('.gmbox').animate({
        'opacity': '1.00'
    }, 300, 'linear');
    $('.gmbackdrop, .gmbox').css('display', 'block');

    $.event.trigger({
        type: 'codeConversionFinish',
        message: 'convert_list_end',
        time: new Date(),
        source: 'convertClick',
        html: contentHtml
    });

};


/*
 * Button click to convert ordered list of the code output to html table
 */
sthl.convertTable = function(btn) {
    var $ = jQuery;
    $.event.trigger({
        type: 'codeConversionStart',
        message: 'convert_table_start',
        time: new Date(),
        source: 'convertTable'
    });

    var libTmce = BIGBYTE.USERSCRIPT.STHL.TMCE;
    this.windowScrollPos = $('body').scrollTop();
    $('html, body').animate({
        scrollTop: 0
    }, 'slow');
    $(document).disableScroll('html, body');

    var contentHtml = this.getConvertedTable();
    if (libTmce.fullscreen) {
        tinyMCE.get('gminput').execCommand('mceFullScreen');
    }
    tinyMCE.get('gminput').setContent(contentHtml);
    $('.gmbackdrop, .gmbox').animate({
        'opacity': '.50'
    }, 300, 'linear');
    $('.gmbox').animate({
        'opacity': '1.00'
    }, 300, 'linear');
    $('.gmbackdrop, .gmbox').css('display', 'block');

    $.event.trigger({
        type: 'codeConversionFinish',
        message: 'convert_table_end',
        time: new Date(),
        source: 'convertTable',
        html: contentHtml
    });
};
// #endregion Button methods
// #region Init
/**
 * Init for the main script
 */
sthl.init = function(pluginSrc) {
    var tinyMceVer = BIGBYTE.USERSCRIPT.STHL.TMCE.version;
    //var tinyMceVer = '4.3.2';
    pluginSrc = typeof(pluginSrc) == 'undefined' ? '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js' : pluginSrc;

    // no jquery at this point use pure javascript events
    if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
        document.addEventListener("bbScriptLoaded", BIGBYTE.USERSCRIPT.STHL.onBbScriptLoaded);
    } else if (document.attachEvent) { // For IE 8 and earlier versions
        document.attachEvent("onbbScriptLoaded", BIGBYTE.USERSCRIPT.STHL.onBbScriptLoaded);
    }

    if (document.addEventListener) { // For all major browsers, except IE 8 and earlier
        document.addEventListener("allScriptsLoaded", BIGBYTE.USERSCRIPT.STHL.onAllScriptsLoaded);
    } else if (document.attachEvent) { // For IE 8 and earlier versions
        document.attachEvent("onallScriptsLoaded", BIGBYTE.USERSCRIPT.STHL.onAllScriptsLoaded);
    }

    // only add jquery if we need it.
    if (typeof(jQuery) == 'undefined') {
        this.addScript('jquery', pluginSrc, 'linkedjs', 'jQuery');
    }
    if ((typeof(jQuery) == 'undefined') || (typeof(jQuery.cookei) == 'undefined')) {
        this.addScript('cookie', '//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js', 'linkedjs', 'jQuery.cookie');
    }
    if (typeof(Clipboard) == 'undefined') {
        this.addScript('clipboard', '//cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.5/clipboard.min.js', 'linkedjs', 'Clipboard');
    }
    this.addScript('icons-css', '//cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/foundation-icons.css', 'csslink');
    // tiny mce 
    this.addScript('tinyMceJs', '//cdnjs.cloudflare.com/ajax/libs/tinymce/' + tinyMceVer + '/tinymce.min.js', 'linkedjs', 'tinyMCE');
    this.addScript('tinyMceCss', '//cdnjs.cloudflare.com/ajax/libs/tinymce/' + tinyMceVer + '/skins/lightgray/skin.min.css', 'csslink');

    //this.addScript('tinymce_advanced_theme', '//cdnjs.cloudflare.com/ajax/libs/tinymce/' + tinyMceVer + '/themes/advanced/theme.min.js','linkedjs') // no checking required
    this.loadScripts();
};
/*
 * Load scripts will load one script only at a time.
 * When the script is loaded the next if any script will be
 * load via the onScripLoadeEvent
 * the onScriptLoaded Event calle this function over and over untll all the scripts are loaded
 */
sthl.loadScripts = function() {

    var count = 0;
    for (var key in this.scripts) {
        count++;
        if (count > 1) {
            return;
        }
        BIGBYTE.USERSCRIPT.DOCUMENT.loadScript(this.scripts[key]);
    }
};
/*
 * Array to hold all the scripts that are to be loaded
 */
sthl.scripts = [];
/*
 * Adds script item to the BIGBYTE.USERSCRIPT.STHL.scripts array
 * these are scripts tha will be loaded when the BIGBYTE.USERSCRIPT.STHL.init() is fired
 */
sthl.addScript = function(name, src, type, testMethod, args) {
    var newItm = {
        name: name,
        src: src,
        type: type,
        testMethod: testMethod
    };
    if(typeof(args) === undefined) {
        this.scripts[name] = newItm;
    } else {
        var extended = BIGBYTE.USERSCRIPT.UTIL.extend(newItm, args);
        this.scripts[name] = extended;
    }
};

/*
 * Function to check and see if there are any scripts left to be loaded
 * @returns boolean, true if all the scripts are loaded; Otherwise false
 */
sthl.isScriptsLoaded = function() {
    var lib = BIGBYTE.USERSCRIPT.STHL;
    for (var key in lib.scripts) {
        if (!lib.scripts[key].loaded) {
            return false
        }
    }
    return true;
};



// #endregion init
// #region Properties
sthl.scriptOutputted = false;
sthl.windowScrollPos = 0;
sthl.includeLineNumbers = true;
/**
 * Property that is set to true if the code has had style added to it
 * @type {Boolean}
 */
sthl.isCodeStyled = false;

// light box related
sthl.lightBoxCss = '.gmbackdrop,.gmbox{position:absolute;display:none}.gmbackdrop{top:0;left:0;width:100%;height:100%;background:#000;opacity:0;';
sthl.lightBoxCss += 'filter:alpha(opacity=0);z-index:201}.gmbox{background:#fff;z-index:202;padding:10px;';
sthl.lightBoxCss += '-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;-moz-box-shadow:0 0 5px #444;-webkit-box-shadow:0 0 5px #444;';
sthl.lightBoxCss += 'box-shadow:0 0 5px #444}.gmclose{float:right;margin-right:6px;cursor:pointer}.mce-panel{border:none}div.gmbox .mce-panel{border:';
sthl.lightBoxCss += ' 0 solid rgba(0,0,0,.2)}div.mce-tinymce.mce-container.mce-panel{margin-top:2em}div.mce-tinymce.mce-container.mce-panel.mce-fullscreen';
sthl.lightBoxCss += '{margin-top:0}#gm-edit-btn{font-size:1.6em;color:#ABABAB}#gm-edit-btn:hover{color:#2DBE60}';
sthl.lightBoxCss += '.gmbox-window{top:50%;left:50%;transform: translate(-50%, -50%);position: absolute;';
sthl.lightBoxCss += 'width:650px;height:450px;}';
// #endregion Properties
// #region Init Methods
/*
 * internal method to add buttons to the toolbar of the page.
 * method alos hooks up some of the buttons. Method is called on document.ready
 */
sthl.initToolbar = function($) {
    var lib = this;
    var $btndiv = $('.buttons:first');
    $btndiv.append('<button id="gmconvert" type="button" data-clipboard-text="" data-converted="0" disabled="disabled">Popup List</button>');
    $btndiv.append('<button id="gmtable" type="button" disabled="disabled">Popup Table</button>');
    $btndiv.append('<button id="gmcopy" type="button" disabled="disabled">Copy List</button>');
    $btndiv.append('<button id="gmcopytbl" type="button" disabled="disabled">Copy Table</button>');


    $('button#gmconvert').click(function() {
        lib.convertClick(this);
    });
    $('#gmtable').click(function() {
        lib.convertTable(this);
    });
};
/*
 *
 * Inits the line number to hook page line number checkbox
 * @param $ optional jQuery object
 * @desc called from main init
 */

sthl.initLineNumbers = function($) {
    $ = $ || jQuery;
    //label#checkBox.bfc selected
    //includeLineNumbers
    var lib = this;
    $('input#lineNumber').click(function() {
        if ($(this).parent('label').hasClass('selected')) {
            lib.includeLineNumbers = true;
        } else {
            lib.includeLineNumbers = false;

        }
    });
};
// #endregion Init Methods
// #region Methods
/*
 * resets the lightbox back to hidden state
 */
sthl.lightBoxReset = function() {
    jQuery('.gmbackdrop, .gmbox').animate({
        'opacity': '0'
    }, 300, 'linear', function() {
        jQuery('.gmbackdrop, .gmbox').css('display', 'none');
    });
    jQuery('textarea#gminput').val(''); // clean up textarea
};

/**
 * Converts a list (ul, ol) elements into a table
 * @parm el an element containing the the ul or ol item
 * @parm includeNum optional, if true then line numnbers will be incldued; Otherwise false.
 * default value is the value the page is currently set to with the line numbers checkbox
 */
sthl.toTable = function(el, includeNum, tableClass) {
    var $ = jQuery;
    var lib = this;
    //debugger;
    tableClass = tableClass || '';
    includeNum = includeNum || this.includeLineNumbers;

    var $tbl;
    if (tableClass) {
        $tbl = $('<table />');
    } else {
        $tbl = $('<table class="' + tableClass + '" />');
    }
    var count = 0;
    el.find('li').each(function(index, li) {
        var $li = BIGBYTE.isjquery(li);
        var box = $li.hasClass('box');
        var boxTop = $li.hasClass('box-top');
        var boxMid = $li.hasClass('box-mid');
        var boxBot = $li.hasClass('box-bot');
        var boxBg = $li.hasClass('box-bg');
        count++;
        var $row = $('<tr/>');
        if (includeNum) {
            var $cellNum = $('<td/>').css({
                paddingLeft: '5px',
                width: '35px',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                paddingRight: '5px'
            });
            if (box) {
                $cellNum.css({
                    border: $li.css('border'),
                    borderColor: $li.css('border-color'),
                    borderRight: '0'
                });
                if (boxTop) {
                    $cellNum.css({
                        borderTop: $li.css('border-top'),
                        borderLeft: $li.css('border-left'),
                        borderLeftColor: $li.css('border-left-color')
                    });
                }
                if (boxMid) {
                    $cellNum.css({
                        borderLeft: $li.css('border-left'),
                        borderLeftColor: $li.css('border-left-color')
                    });
                }
                if (boxBot) {
                    $cellNum.css({
                        borderBottom: $li.css('border-bottom'),
                        borderBottomColor: $li.css('border-bottom-color'),
                        borderLeft: $li.css('border-left'),
                        borderLeftColor: $li.css('border-left-color')
                    });
                }
                if (boxBg) {
                    $cellNum.css({
                        backgroundColor: $li.css('background-color')
                    });
                }
            }
            $cellNum.html(BIGBYTE.STRING.pad(count, 2) + '.');
            $row.append($cellNum);

        }
        var $cellMain = $('<td/>');
        $cellMain = lib._copyCss($cellMain, li);
        $cellMain.css({
            listStyle: '',
            //wordWrap: 'normal',
            lineHeight: '',
            fontSize: '',
            fontFamily: '',
            'word-wrap': 'break-word'
        });
        if (includeNum) {
            $cellMain.css({
                width: '100%'
            });
        } else {
            $cellMain.css({
                width: '100%',
                paddingLeft: '10px'
            });
        }

        if (box) {
            $cellMain.css({
                border: $li.css('border'),
                borderColor: $li.css('border-color'),
                borderLeft: (includeNum ? '0' : $li.css('border-left'))
            });
            if (boxTop) {
                if (includeNum) {
                    $cellMain.css({
                        borderTop: $li.css('border-top'),
                        borderLeft: '0',
                        borderRight: $li.css('border-right'),
                        borderRightColor: $li.css('border-Right-color')
                    });
                } else {
                    $cellMain.css({
                        borderTop: $li.css('border-top'),
                        borderLeft: $li.css('border-left'),
                        borderLeftColor: $li.css('border-left-color'),
                        borderRight: $li.css('border-right'),
                        borderRightColor: $li.css('border-Right-color')
                    });
                }

            }
            if (boxMid) {
                if (includeNum) {
                    $cellMain.css({
                        borderLeft: '0',
                        borderRight: $li.css('border-right'),
                        borderRightColor: $li.css('border-Right-color')
                    });
                } else {
                    $cellMain.css({
                        borderLeft: $li.css('border-left'),
                        borderLeftColor: $li.css('border-left-color'),
                        borderRight: $li.css('border-right'),
                        borderRightColor: $li.css('border-Right-color')
                    });
                }

            }
            if (boxBot) {
                if (includeNum) {
                    $cellMain.css({
                        borderBottom: $li.css('border-bottom'),
                        borderBottomColor: $li.css('border-bottom-color'),
                        borderLeft: '0',
                        borderRight: $li.css('border-right'),
                        borderRightColor: $li.css('border-Right-color')
                    });
                } else {
                    $cellMain.css({
                        borderBottom: $li.css('border-bottom'),
                        borderBottomColor: $li.css('border-bottom-color'),
                        borderLeft: $li.css('border-left'),
                        borderLeftColor: $li.css('border-left-color'),
                        borderRight: $li.css('border-right'),
                        borderRightColor: $li.css('border-Right-color')
                    });
                }
            }
            if (boxBg) {
                $cellMain.css({
                    backgroundColor: $li.css('background-color')
                });
            }
        }
        $cellMain.html($(this).html());
        $row.append($cellMain);
        $tbl.append($row);
    });
    // set the default css styles
    $tbl = this._copyCss($tbl, el);
    // corrected css styles
    $tbl.css({
        whiteSpace: 'nowrap',
        listStyle: '',
        wordWrap: 'normal',
        'border-collapse': 'collapse',
        'table-layout': 'fixed',
        width: '100%'
    });
    return $tbl;
}
sthl.createToggleButton = function() {
    var $ = jQuery;
    if ($('btncustomtoggle').length === 0) {
        $('<div id="customtoggle"><button id="btncustomtoggle" type="buton" style="display: none">Toggle</button></div>').insertBefore('#htmlToCopy');
        $('#btncustomtoggle').click(function() {
            tinyMCE.execCommand('mceToggleEditor', true, 'htmlToCopy');
        });
    }

};
/*
 * internal copies specifice class files from toEl to el.
 */

sthl._copyCss = function(toEl, el) {
    var $toEl = BIGBYTE.isjquery(toEl);
    var $el = BIGBYTE.isjquery(el);

    $toEl.css({
        paddingLeft: $el.css('padding-left'),
        listStyle: $el.css('list-style'),
        backgroundColor: $el.css('background-color'),
        lineHeight: $el.css('line-height'),
        borderLeft: $el.css('border-left'),
        color: $el.css('color'),
        fontWeight: $el.css('font-weight'),
        fontStyle: $el.css('font-style'),
        fontSize: $el.css('font-size'),
        fontFamily: $el.css('font-family'),
        textAlign: $el.css('text-align'),
        whiteSpace: $el.css('white-space'),
        wordWrap: $el.css('word-wrap')
    })
    return $toEl;
};

sthl.lightBoxAddCss = function() {
    var bdoc = BIGBYTE.USERSCRIPT.DOCUMENT;
    bdoc.addCss_Node(this.lightBoxCss, 'body');
};

sthl.getLightBoxHtml = function(id, title) {
    id = typeof id !== 'undefined' ? id : 'gminput';
    title = typeof title !== 'undefined' ? title : '';
    var h = '<div class="gmbackdrop"></div>';
    h += '<div id="tinybox" class="gmbox gmbox-window"><div class="gmclose"><i class="fi-x" style="color:black"></i></div>';
    h += title;
    h += '<textarea id="' + id + '" rows="18" cols="68"></textarea>';
    h += '</div></div>';
    return h;
}

sthl.writeLightBox = function(id, title) {
    var html = this.getLightBoxHtml(id, title);
    var bdoc = BIGBYTE.USERSCRIPT.DOCUMENT;
    bdoc.addHtml_Node(html);
};

/**
 * Init that fires when Clibporad Lib is loaded
 */
sthl.clipboardInit = function() {

    var clipboard = new Clipboard('#gmcopy', {
        text: function(trigger) {
            var $ = jQuery;
            $.event.trigger({
                type: 'codeConversionStart',
                message: 'convert_list_start',
                time: new Date(),
                source: 'gmcopy'
            });

            var contentHtml;
            try {
                contentHtml = BIGBYTE.USERSCRIPT.STHL.getConvertedList();
            } catch (e) {
                // statements
                console.log(e);
            }
            $.event.trigger({
                type: 'codeConversionFinish',
                message: 'convert_list_end',
                time: new Date(),
                source: 'gmcopy',
                html: contentHtml
            });
            return contentHtml;
        }
    });
    var clipboardTbl = new Clipboard('#gmcopytbl', {
        text: function(trigger) {
            var $ = jQuery;
            $.event.trigger({
                type: 'codeConversionStart',
                message: 'convert_table_start',
                time: new Date(),
                source: 'gmcopytbl'
            });
            var contentHtml;
            try {
                contentHtml = BIGBYTE.USERSCRIPT.STHL.getConvertedTable();
            } catch (e) {
                // statements
                console.log(e);
            }

            $.event.trigger({
                type: 'codeConversionFinish',
                message: 'convert_table_end',
                time: new Date(),
                source: 'gmcopytbl',
                html: contentHtml
            });
            return contentHtml;

        }
    });

    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        //console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        alert('Data as been copied to the clipboard');
    });

    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
        alert('Unable to copy data to the clipboard');
    });

    clipboardTbl.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Trigger:', e.trigger);
        alert('Data as been copied to the clipboard');
    });

    clipboardTbl.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
        alert('Unable to copy data to the clipboard');
    });
};

/**
 * Calls page like method to relaod the code from the origiona source
 * @return {[boolean]} returns true if the code was reset; Otherwise false
 */
sthl.reHighlight = function() {
    if ($("#dropZone").val() == "") {
        $(".doneButton").attr("disabled", true);
        return false;
    }
    $("#theWholeEnchilada").html('<pre class="shi_pre"></pre>');
    $("#theWholeEnchilada .shi_pre").text($("#dropZone").val());
    languageSelected = $("#language_selected option:selected").val();
    styleSelected = $("#style_selected option:selected").val();
    lineNumber = $("#lineNumber").is(":checked");
    collapsing = ($("#collapsing").is(":checked") || $("#startCollapsing").is(":checked"));
    startCollapsing = $("#startCollapsing").is(":checked");
    boxStyling = $("#boxStyling").val();
    boxColorStyling = $("#boxColorStyling").val();
    boxFillStyling = $("#boxFillStyling").val();
    $("pre.shi_pre").snippet(languageSelected, {
        style: styleSelected,
        showNum: lineNumber,
        collapse: collapsing,
        startCollapsed: startCollapsing,
        box: boxStyling,
        boxColor: boxColorStyling,
        boxFill: boxFillStyling
    })
    return true;
};

/**
 * Set the page control value select elements if there are cookie value
 * otherwise save the cookie values
 */
sthl.setFromCookies = function() {
    if (typeof($.cookie('language_selected_val')) == 'undefined') {
        $.cookie('language_selected_val', $("#language_selected option").filter(":selected").val(), {
            expires: 14
        });
    } else {
        $("#language_selected").val($.cookie('language_selected_val'));
    }

    if (typeof($.cookie('style_selected_val')) == 'undefined') {
        $.cookie('style_selected_val', $("#style_selected option").filter(":selected").val(), {
            expires: 14
        });
    } else {
        $("#style_selected").val($.cookie('style_selected_val'));
    }
};

// #endregion Methods
// #region ensure Methods
sthl.ensurePlugins = function($) {
    if (typeof($.fn.enableScroll) == 'undefined') {
        $.extend($.fn, {
            enableScroll: function(selector, height) {
                height = height || 'auto';
                if ((typeof(selector) == 'undefined') || (selector == null)) {
                    $(this).css({
                        'overflow': 'auto',
                        'height': height
                    });

                } else {
                    $(this).find(selector).css({
                        'overflow': 'auto',
                        'height': height
                    });
                }
            }
        });
    }
    if (typeof($.fn.disableScroll) == 'undefined') {
        $.extend($.fn, {
            disableScroll: function(selector, height) {
                height = height || '100%';
                if ((typeof(selector) == 'undefined') || (selector == null)) {
                    $(this).css({
                        'overflow': 'hidden',
                        'height': height
                    });

                } else {
                    $(this).find(selector).css({
                        'overflow': 'hidden',
                        'height': height
                    });
                }
            }
        });
    }
    if (typeof($.fn.spaceReplace) == 'undefined') {
        $.extend($.fn, {
            spaceReplace: function(recurse) {
                recurse = typeof(recurse) == 'undefined' ? false : recurse;

                if (recurse) {
                    return this.find('*').each(function(index, value) {
                        try {
                            if (typeof(value) == 'undefined') {
                                return;
                            }
                            $(value)._spaceRepaceSingle();
                        } catch (e) {
                            console.log('spaceReplace error:', e);
                        }

                    });
                } else {
                    return this._spaceRepaceSingle();
                }

            },
            _spaceRepaceSingle: function() {
                this.contents().filter(function() {
                    return this.nodeType == 3; // Text node
                }).each(function() {
                    this.data = this.data.replace(/ /g, '\u00a0');
                });
                return this;
            }
        });
    }
    if (typeof($.fn.removeAttrib) == 'undefined') {
        $.extend($.fn, {
            removeAttrib: function(attributeName, recurse) {
                recurse = typeof(recurse) == 'undefined' ? false : recurse;

                if (recurse) {
                    return $(this).find('*').each(function(index, value) {
                        try {
                            if (typeof(value) == 'undefined') {
                                return;
                            }
                            $(value).removeAttr(attributeName);
                        } catch (e) {
                            // statements
                            console.log('error:', e);
                        }

                    });
                } else {
                    return $(this).removeAttr(attributeName);
                }
            }
        });
    }
};

/*
 * internal method that creates/loads makeCssInlineCode jQuery plugin
 * this plugin converts specific the css style of the element and child elemets into inline css style
 */
sthl.ensureMakeCssInlineCodePlugin = function($) {
    if (typeof($.fn.makeCssInlineCode) == 'undefined') {
        $.extend($.fn, {
            makeCssInlineCode: function(forTable) {
                // forTable if true then will generate css a little diffferently for html table 
                forTable = typeof(forTable) == 'undefined' ? false : forTable;

                this.each(function(idx, el) {
                    var $this = $(el);
                    var tagName = $this.tagName(true);
                    if ($this.attr('class')) {
                        // if element has a class then set the styles
                        $this.css({
                            color: $this.css('color'),
                            fontWeight: $this.css('font-weight'),
                            fontStyle: $this.css('font-style'),
                            //fontSize: $this.css('font-size'),
                            //fontFamily: $this.css('font-family'),
                            textAlign: $this.css('text-align'),
                            //whiteSpace: $this.css('white-space'),
                            //wordWrap: $this.css('word-wrap')
                        });
                    }
                    // get tagname in lowercase format;
                    switch (tagName) {
                        case 'li':
                            $this.css({
                                paddingLeft: $this.css('padding-left'),
                                listStyle: $this.css('list-style'),
                                backgroundColor: $this.css('background-color'),
                                lineHeight: $this.css('line-height'),
                                //borderLeft: $this.css('border-left'),
                                borderTop: $this.css('border-top'),
                                borderRight: $this.css('border-right'),
                                borderBottom: $this.css('border-bottom'),
                                borderLeftColor: $this.css('border-left-color'),
                                borderTopColor: $this.css('border-top-color'),
                                borderRightColor: $this.css('border-right-color'),
                                borderBottomColor: $this.css('border-bottom-color'),
                                borderLeft: $this.css('border-left'),
                                color: $this.css('color'),
                                fontWeight: $this.css('font-weight'),
                                fontStyle: $this.css('font-style'),
                                //fontSize: $this.css('font-size'),
                                //fontFamily: $this.css('font-family'),
                                textAlign: $this.css('text-align'),
                                whiteSpace: $this.css('white-space'),
                                wordWrap: $this.css('word-wrap'),
                                margin: $this.css('margin'),
                                'list-style-position': $this.css('list-style-position')

                            });
                            break;
                        case 'ol': // line numbers
                            var padding = $this.css('-webkit-padding-start');
                            $this.css({
                                'list-style-type': 'decimal',
                                display: 'block',
                                '-webkit-margin-before': '1em',
                                '-moz-margin-before': '1em',
                                '-khtml-margin-before': '1em',
                                '-o-margin-before': '1em',

                                '-webkit-margin-after': '1em',
                                '-moz-margin-after': '1em',
                                '-khtml-margin-after': '1em',
                                '-o-margin-after': '1em',

                                '-webkit-margin-start': '0px',
                                '-moz-margin-start': '0px',
                                '-khtml-margin-start': '0px',
                                '-o-margin-start': '0px',

                                '-webkit-margin-end': '0px',
                                '-moz-margin-end': '0px',
                                '-khtml-margin-end': '0px',
                                '-o-margin-end': '0px',

                                '-moz-padding-start': padding,
                                '-khtml-padding-start': padding,
                                '-o-padding-start': padding,
                                'padding-start': padding,
                                'padding-left': padding
                            });

                            break;
                        case 'ul': // no line numbers
                            $this.css({
                                'list-style-type': 'decimal',
                                display: 'block',
                                '-webkit-margin-before': '1em',
                                '-moz-margin-before': '1em',
                                '-khtml-margin-before': '1em',
                                '-o-margin-before': '1em',

                                '-webkit-margin-after': '1em',
                                '-moz-margin-after': '1em',
                                '-khtml-margin-after': '1em',
                                '-o-margin-after': '1em',

                                '-webkit-margin-start': '0px',
                                '-moz-margin-start': '0px',
                                '-khtml-margin-start': '0px',
                                '-o-margin-start': '0px',
                                '-webkit-margin-end': '0px',
                                '-moz-margin-end': '0px',
                                '-khtml-margin-end': '0px',
                                '-o-margin-end': '0px',

                                '-moz-padding-start': '0',
                                '-khtml-padding-start': '0',
                                '-o-padding-start': '0',
                                'padding-start': '0',
                                'padding-left': '0'
                            });
                            break;
                        case 'span':
                            if ((!forTable) && ($this.hasClass('box-sp'))) {
                                $this.css({
                                    display: $this.css('display'),
                                    width: $this.css('width')
                                });
                            } else {
                                $this.css({
                                    display: '',
                                    width: ''
                                });
                            }
                            break;
                        default:
                            // statements_def
                            break;
                    }

                    //var style = el.style;
                    //$this.removeAttr('class'); // remove class from element
                    $this.children().makeCssInlineCode(forTable);
                });
            }
        });
    }
};
/*
 * internal method that creates/loads makeCssInline jQuery plugin
 * this plugin converts all the css style of the element and child elemets into inline css style
 */
sthl.ensureMakeCssInlinePlugin = function($) {
    if (typeof($.fn.makeCssInline) == 'undefined') {
        $.extend($.fn, {
            makeCssInline: function(recurse) {
                recurse = typeof(recurse) == 'undefined' ? false : recurse;
                if (recurse) {
                    return this.find('*').each(function(index, value) {
                        try {
                            if (typeof(value) == 'undefined') {
                                return;
                            }
                            $(value)._makeCssInlineSingle();
                        } catch (e) {
                            console.log('makeCssInline error:', e);
                        }

                    });
                } else {
                    return this.each(function(index, value) {
                        $(value)._makeCssInlineSingle();
                    })
                }
            },
            _makeCssInlineSingle: function() {

                var el = this[0];

                var style = el.style;
                var properties = [];
                for (var property in style) {
                    if (this.css(property)) {
                        properties.push(property + ':' + this.css(property));
                    }
                }

                el.style.cssText = properties.join(';');
                return this;
            }
        });
    }

    if (typeof($.fn.assignStyleFrom) == 'undefined') {
        /**
         * Assigns style of one jQuery Object to current object
         * @param  {[jQuery]} el) A jQuery object or dom element
         * @return {[jQuery]}     jQuery object with the new style assigned
         */
        $.extend($.fn, {
            assignStyleFrom: function(el) {
                if (typeof(el) == 'undefined') {
                    return this;
                }
                var $el;
                if (el instanceof jQuery) {
                    $el = el;
                } else {
                    $el = jQuery(el);
                }
                if ($el.length === 0) {
                    return this;
                }
                var style = $el[0].style;
                var properties = [];
                for (var property in style) {
                    if ($el.css(property)) {
                        properties.push(property + ':' + $el.css(property));
                    }
                }
                this[0].style.cssText = properties.join(';');
                return this;
            }
        });
    }
};

// #endregion enusre Methods
// #region Events
/*
 * Event Handler that is fired when a script is loaded
 * This event fires each time a script is loaded.
 */
sthl.onBbScriptLoaded = function(e) {
    var lib = BIGBYTE.USERSCRIPT.STHL;
    // delete the added script

    delete lib.scripts[e.detail.scriptItm.name];
    var done = lib.isScriptsLoaded();
    if (done) {
        var allScriptsLoaded = new CustomEvent(
            "allScriptsLoaded", {
                detail: {
                    message: "All Scripts Loaded",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: false
            }
        );
        document.dispatchEvent(allScriptsLoaded);
        //jQuery(document).trigger("allScriptsLoaded");
    } else {
        // add the next script
        lib.loadScripts();
    }
}

/*
 * Event Handler that fires when all scripts are loaded
 * this is main loading point for the script.
 */
sthl.onAllScriptsLoaded = function(e) {
    console.log('all scripts have been loaded.');
    jQuery(function($, undefined) {
        var lib = BIGBYTE.USERSCRIPT.STHL;

        if (typeof($.fn.tagName) == 'undefined') {
            // in older version of jquery tagname was retturned in uppercase but now is in lowercase
            $.fn.tagName = function(toLower) {
                var tn = this.prop("tagName");
                if (toLower) {
                    tn = tn.toLowerCase();
                }
                return tn;
            };
        }

        // hide the intro section of the webpage
        $('#intro').hide();

        $(document).on("tinymceInit", lib.onTinymceInit);
        $(document).on("tinymceCancel", lib.onTinymceCancel);
        $(document).on("codeConversionStart", lib.onCodeConversionStart);
        $(document).on("codeConversionFinish", lib.onCodeConversionFinish);
        // $(document).on("clipboardLoaded", lib.clipboardInit);
        lib.clipboardInit();
        $('button.startOver').on('click', lib.onStartOverClick);
        $('button.doneButton').unbind('click').on('click', lib.onDoneButtonClick);

        // load the values from cookies and set page controls
        lib.setFromCookies();

        // events for page change
        $('#dropZone').on('change', {
            source: 'dropZone',
            type: 'textarea'
        }, lib.onPageMainChanged);
        $('select#language_selected').on("change", {
            source: 'language_selected',
            type: 'dropdown'
        }, lib.onPageMainChanged);
        $('select#style_selected').on('change', {
            source: 'style_selected',
            type: 'dropdown'
        }, lib.onPageMainChanged);
        $('input#lineNumber').on('change', {
            source: 'lineNumber',
            type: 'checkbox'
        }, lib.onPageMainChanged);
        $('input#boxColorStyling').on('change', {
            source: 'boxColorStyling',
            type: 'input'
        }, lib.onPageMainChanged);
        $('input#boxFillStyling').on('change', {
            source: 'boxFillStyling',
            type: 'input'
        }, lib.onPageMainChanged);
        $('button.startOver').on('click', {
            source: 'button.startOver',
            type: 'button'
        }, lib.onPageReset);

        $(document).on('tinymceFullScreen', lib.onTinyMceFulllscreen);

        $('body').append('<input id="gmhidden" type="hidden" value="" />');

        lib.ensureMakeCssInlinePlugin($);
        lib.ensureMakeCssInlineCodePlugin($);
        lib.ensurePlugins($);
        lib.initToolbar($);
        lib.lightBoxAddCss();
        lib.writeLightBox();
        lib.createToggleButton(); // create the toggle button to toggle tinymce
        lib.TMCE.init();

        sthl.initLineNumbers($);

        $('.gmclose').click(function() {
            $.event.trigger({
                type: "tinymceCancel",
                message: 'cancel',
                time: new Date(),
                tinyMceId: 'gminput'
            });
        });


    });
};
/**
 * Event that fires when the page code elements have changed
 */
sthl.onPageMainChanged = function(e) {
    var lib = BIGBYTE.USERSCRIPT.STHL;
    var $ = jQuery;
    if ($("#dropZone").val() == "") {
        lib.toggleButtons(false);
    } else {
        lib.toggleButtons(true);
    }

    switch (e.data.source) {
        case 'language_selected': // dropeown language has been changed
            $.cookie('language_selected_val', $("#language_selected option").filter(":selected").val(), {
                expires: 14
            });
            break;
        case 'style_selected':
            $.cookie('style_selected_val', $("#style_selected option").filter(":selected").val(), {
                expires: 14
            });
            break;
        default:
            // statements_def
            break;
    }
};

/**
 * Event that fire when the page reset takes place
 * @param  {[objece]} e event args
 */
sthl.onPageReset = function(e) {
    var lib = BIGBYTE.USERSCRIPT.STHL;
    lib.toggleButtons(false);
    lib.isCodeStyled = false;
    // set elements from cookies
    lib.setFromCookies();
};

sthl.onDoneButtonClick = function(e) {

    if ($("#dropZone").val() == "") {
        return
    }
    var lib = BIGBYTE.USERSCRIPT.STHL;
    // highlight the code again if it has been styled
    if (lib.isCodeStyled == true) {

        lib.reHighlight();
        lib.isCodeStyled == false;
    }

    if ($("#step4:visible")) {
        $("#step4").slideToggle()
    }
    $("#step5").slideToggle();
    $(this).parents(".wrapper").slideToggle();
    $("#theWholeEnchilada").css("height", "0");
    $("#htmlToCopy").val($("#theWholeEnchilada").html());
    document.getElementById($("#style_selected").val()).style.display = "block"

    // add tiny mce toggle option on top of the 
    // formated source code window
    var nsTmce = BIGBYTE.USERSCRIPT.STHL.TMCE;
    jQuery('#btncustomtoggle').show();
    nsTmce.initHtmlTocopy();
    tinyMCE.execCommand('mceToggleEditor', true, 'htmlToCopy');

};
sthl.onStartOverClick = function(e) {
    var $ = jQuery;
    var lib = BIGBYTE.USERSCRIPT.STHL;
    tinyMCE.execCommand('mceRemoveEditor', true, 'htmlToCopy');
    $('btncustomtoggle').hide();
    // fixes issue with theWholeEnchilada have a height of auto after reset
    // this fix is only needed due to this script making a chnage somewhere
    // along the way
    $('#theWholeEnchilada').css({
        height: 'auto'
    });
    lib.isCodeStyled = false;

};
sthl.onCodeConversionStart = function(e) {
    var lib = BIGBYTE.USERSCRIPT.STHL;
    if (lib.reHighlight()) {
        //console.log('code is rewritten');
    } else {
        //console.log('unable to rewrite code');
    }
};
sthl.onCodeConversionFinish = function(e) {
    var lib = BIGBYTE.USERSCRIPT.STHL;
    lib.toggleButtons(true);
    // set the property that indicates
    // if the colorized code has had syyles added to it
    lib.isCodeStyled = true;
};


/**
 * Event that fire when TinyMce is initiated
 */
sthl.onTinymceInit = function(e) {
    //console.log('Tiny Mce Init was triggered');
};
/**
 * Event that fire when TinyMce save is clicked
 */
sthl.onTinymceSave = function(e) {
    var $ = jQuery;
    if (e.tinyMceId == 'gminput') {
        //console.log('Tiny Mce save was triggered');
        BIGBYTE.USERSCRIPT.STHL.lightBoxReset();
        var libTmce = BIGBYTE.USERSCRIPT.STHL.TMCE;
        if ($('body').hasClass('mce-fullscreen')) {
            $('body').removeClass('mce-fullscreen');
        }
        $(document).enableScroll('html, body');
        // $('body').animate({ scrollTop: this.windowScrollPos}, 'slow');
        $('body').scrollTop(this.windowScrollPos);
    }

};
/**
 * Event that fire when TinyMce close is clicked
 */
sthl.onTinymceCancel = function(e) {
    var $ = jQuery;
    if (e.tinyMceId == 'gminput') {
        BIGBYTE.USERSCRIPT.STHL.lightBoxReset();
        tinymce.get('gminput').setContent(''); // clean up tinymce
        var libTmce = BIGBYTE.USERSCRIPT.STHL.TMCE;
        if ($('body').hasClass('mce-fullscreen')) {
            $('body').removeClass('mce-fullscreen');
        }
        $(document).enableScroll('html, body');
        $('body').scrollTop(this.windowScrollPos);
    }

};
sthl.onTinyMceFulllscreen = function(e) {
    var $ = jQuery;
    if (e.tinyMceId == 'gminput') {
        if (e.state) {
            if ($('#tinybox').hasClass('gmbox-window')) {
                $('#tinybox').removeClass('gmbox-window');
            }
        } else {
            if (!$('#tinybox').hasClass('gmbox-window')) {
                $('#tinybox').addClass('gmbox-window');
            }
        }
    }
};
// #endregion Events
// #endnsregion
// #nsregion BIGBYTE.USERSCRIPT.STHL.TMCE
// #region Create NS
var tmce = BIGBYTE.createNS("BIGBYTE.USERSCRIPT.STHL.TMCE");
tmce.ns = 'BIGBYTE.USERSCRIPT.STHL.TMCE';
// #endregion Create ns
// #region Properties
tmce.scriptOutputted = false;
tmce.fullscreen = false;
tmce.loopcount = 0;
tmce.version = '4.3.4';
// #endregion Properties
// #region init
if (typeof(tmce.init) == 'undefined') {
    tmce.init = function() {
        var ver = this.version;
        var id = 'gminput';
        tinyMCE.init({
            selector: 'textarea#' + id,
            visual: false, // turn off visual aids by default
            //entity_encoding: 'named',
            //entities: '160,nbsp',
            init_instance_callback: function() {
                jQuery('.mce-i-mysave').addClass('fi-save').css({
                    color: 'black'
                });
                // add x icon to button
                jQuery('.mce-i-myexit').addClass('fi-x').css({
                    color: 'black'
                });
                jQuery.event.trigger({
                    type: "tinymceInit",
                    message: 'init',
                    time: new Date(),
                    tinyMceId: id
                });
            },
            height: 260,
            // extended_valid_elements : "span[!class]",
            inline: false,
            browser_spellcheck: true,
            plugins: "",
            menubar: "edit insert format view tools table",
            toolbar1: 'mysave myexit insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
            toolbar2: 'fullscreen print preview media | forecolor backcolor | insertdatetime table searchreplace code',
            external_plugins: {
                'fullscreen': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/fullscreen/plugin.min.js',
                'textcolor': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/textcolor/plugin.min.js',
                'nonbreaking': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/nonbreaking/plugin.min.js',
                'insertdatetime': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/insertdatetime/plugin.min.js',
                'code': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/code/plugin.min.js',
                'hr': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/hr/plugin.min.js',
                'searchreplace': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/searchreplace/plugin.min.js',
                'table': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/table/plugin.min.js'
            },
            //valid_elements: 'ol ul',
            //extended_valid_elements: 'ol[|class|style] ul[class|style]',
            keep_styles: false,
            setup: function(ed) {
                // Add a custom button
                ed.on('FullscreenStateChanged', function(e) {
                    this.fullscreen = e.state;
                    jQuery.event.trigger({
                        type: "tinymceFullScreen",
                        message: 'fullscreen toogle',
                        time: new Date(),
                        state: e.state,
                        tinyMceId: id
                        
                    });

                });
                ed.addButton('myexit', {
                    title: 'Close',
                    onclick: function() {
                        jQuery.event.trigger({
                            type: "tinymceCancel",
                            message: 'cancel',
                            time: new Date(),
                            tinyMceId: id
                        });
                    }
                });

            }
        });

    };
}
if (typeof(tmce.initHtmlTocopy) == 'undefined') {
    tmce.initHtmlTocopy = function() {
        var ver = this.version;
        var id = 'htmlToCopy'
        tinyMCE.init({
            selector: 'textarea#' + id,
            visual: false, // turn off visual aids by default
            init_instance_callback: function() {
                jQuery.event.trigger({
                    type: "tinymceInit",
                    message: 'initHtmlTocopy',
                    time: new Date(),
                    tinyMceId: id
                });
            },
            height: 260,
            // extended_valid_elements : "span[!class]",
            inline: false,
            browser_spellcheck: true,
            plugins: "",
            menubar: "edit insert format view tools table",
            toolbar1: 'myexit insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
            toolbar2: 'fullscreen print preview media | forecolor backcolor | insertdatetime table searchreplace code',
            external_plugins: {
                'fullscreen': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/fullscreen/plugin.min.js',
                'textcolor': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/textcolor/plugin.min.js',
                'nonbreaking': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/nonbreaking/plugin.min.js',
                'insertdatetime': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/insertdatetime/plugin.min.js',
                'code': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/code/plugin.min.js',
                'hr': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/hr/plugin.min.js',
                'searchreplace': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/searchreplace/plugin.min.js',
                'table': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/table/plugin.min.js'
            },
            //theme : "advanced",
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            theme_advanced_statusbar_location: "bottom",
            theme_advanced_resizing: true,
            content_css: 'shi/css/shi_default.min.css',
            setup: function(ed) {
                // Add a custom button
                ed.on('FullscreenStateChanged', function(e) {

                    jQuery.event.trigger({
                        type: "tinymceFullScreen",
                        message: 'fullscreen toogle',
                        time: new Date(),
                        state: e.state,
                        tinyMceId: id
                    });

                });
            }
            //theme_advanced_styles : "Header 1=header1;Header 2=header2;Header 3=header3;Table Row=tableRow1"

        });
    };
}

// #endregion init
// #endnsregion BIGBYTE.USERSCRIPT.STHL.TMCE

// init the lib objects.
sthl.init();
