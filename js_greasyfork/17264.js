// ==UserScript==
// @name        New Easy UA Award Search
// @namespace   jasonvr
// @description Updated Easy UA Award Search for new UA website
// @include     http*://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd*
// @match       http://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd*
// @match       https://www.united.com/ual/en/us/flight-search/book-a-flight/results/awd*
// @version     2.3
// @grant	   GM_log
// @grant	   GM_deleteValue
// @grant	   GM_getValue
// @grant	   GM_setValue
// @grant	   GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/17264/New%20Easy%20UA%20Award%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/17264/New%20Easy%20UA%20Award%20Search.meta.js
// ==/UserScript==

//PER INSTRUCTIONS OF DEVELOPERS, IN ORDER TO BE CROSS BROWSER
//COMPATIBLE, THE FULL TEXT OF THE SCRIPT MUST BE INCLUDED
//IN THIS SCRIPT

/* Instructions
GM_config is now cross-browser compatible.

To use it in a Greasemonkey-only user script you can just @include it.

To use it in a cross-browser user script you will need to manually
include the code at the beginning of your user script. In this case
it is also very important you change the "storage" value below to
something unique to prevent collisions between scripts. Also remeber
that in this case that stored settings will only be accessable on
the same domain they were saved.
*/


/*
Copyright 2009-2010, GM_config Contributors
All rights reserved.

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

// The GM_config constructor
function GM_configStruct() {
  // call init() if settings were passed to constructor
  if (arguments.length)
    GM_configInit(this, arguments);
}

// This is the initializer function
function GM_configInit(config, args) {
  // Initialize instance variables
  if (typeof config.fields == "undefined") {
    config.fields = {};
    config.onInit = function() {};
    config.onOpen = function() {};
    config.onSave = function() {};
    config.onClose = function() {};
    config.onReset = function() {};
    config.isOpen = false;
    config.title = 'User Script Settings';
    config.css = {
      basic: "#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }"
             + '\n' + "#GM_config { background: #FFF; }"
             + '\n' + "#GM_config input[type='radio'] { margin-right: 8px; }"
             + '\n' + "#GM_config .indent40 { margin-left: 40%; }"
             + '\n' + "#GM_config .field_label { font-weight: bold; font-size: 12px; margin-right: 6px; }"
             + '\n' + "#GM_config .block { display: block; }"
             + '\n' + "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }"
             + '\n' + "#GM_config .reset, #GM_config .reset a,"
             + '\n' + "#GM_config_buttons_holder { text-align: right; color: #000; }"
             + '\n' + "#GM_config .config_header { font-size: 20pt; margin: 0; }"
             + '\n' + "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }"
             + '\n' + "#GM_config .center { text-align: center; }"
             + '\n' + "#GM_config .section_header_holder { margin-top: 8px; }"
             + '\n' + "#GM_config .config_var { margin: 0 0 4px; }"
             + '\n' + "#GM_config .section_header { font-size: 13pt; background: #414141; color: #FFF;"
             + '\n' +  "border: 1px solid #000; margin: 0; }"
             + '\n' + "#GM_config .section_desc { font-size: 9pt; background: #EFEFEF; color: #575757;"
             + '\n' + "border: 1px solid #CCC; margin: 0 0 6px; }",
      stylish: ""
    };
  }

  // Set a default id
  if (typeof config.id == "undefined")
    config.id = 'GM_config';

  var settings = null;
  // If the id has changed we must modify the default style
  if (config.id != 'GM_config')
    config.css.basic = config.css.basic.replace(/#GM_config/gm, '#' + config.id);

  // Save the previous initialize callback
  var oldInitCb = config.onInit;

  // loop through GM_config.init() arguments
  for (var i = 0, l = args.length, arg; i < l; ++i) {
    arg = args[i];

    // An element to use as the config window
    if (typeof arg.appendChild == "function") {
      config.frame = arg;
      continue;
    }

    switch (typeof arg) {
      case 'object':
        for (var j in arg) { // could be a callback functions or settings object
          if (typeof arg[j] != "function") { // we are in the settings object
            settings = arg; // store settings object
            break; // leave the loop
          } // otherwise it must be a callback function
          config["on" + j.charAt(0).toUpperCase() + j.slice(1)] = arg[j];
        }
        break;
      case 'function': // passing a bare function is set to open callback
        config.onOpen = arg;
        break;
      case 'string': // could be custom CSS or the title string
        if (arg.indexOf('{') != -1 && arg.indexOf('}') != -1)
          config.css.stylish = arg;
        else
          config.title = arg;
        break;
    }
  }

  if (settings) {
    var stored = config.read(); // read the stored settings

    for (var id in settings) // for each setting create a field object
      config.fields[id] = new GM_configField(settings[id], stored[id], id);
  }

  // Prevent infinite loops
  if (config.onInit === oldInitCb)
    config.onInit = function() {};

  // Call the previous init() callback function
  oldInitCb();
}

GM_configStruct.prototype = {
  // Support old method of initalizing
  init: function() { GM_configInit(this, arguments); },

  // call GM_config.open() from your script to open the menu
  open: function () {
    // Die if the menu is already open on this page
    // You can have multiple instances but they can't be open at the same time
    var match = document.getElementById(this.id);
    if (match && (match.tagName == "IFRAME" || match.childNodes.length > 0)) return;

    // Sometimes "this" gets overwritten so create an alias
    var config = this;

    // Function to build the mighty config window :)
    function buildConfigWin (body, head) {
      var create = config.create,
          fields = config.fields,
          configId = config.id,
          bodyWrapper = create('div', {id: configId + '_wrapper'});

      // Append the style which is our default style plus the user style
      head.appendChild(
        create('style', {
        type: 'text/css',
        textContent: config.css.basic + config.css.stylish
      }));

      // Add header and title
      bodyWrapper.appendChild(create('div', {
        id: configId + '_header',
        className: 'config_header block center',
        innerHTML: config.title
      }));

      // Append elements
      var section = bodyWrapper,
          secNum = 0; // Section count

      // loop through fields
      for (var id in fields) {
        var field = fields[id].settings;

        if (field.section) { // the start of a new section
          section = bodyWrapper.appendChild(create('div', {
              className: 'section_header_holder',
              id: configId + '_section_' + secNum
            }));

          if (typeof field.section[0] == "string")
            section.appendChild(create('div', {
              className: 'section_header center',
              id: configId + '_section_header_' + secNum,
              innerHTML: field.section[0]
            }));

          if (typeof field.section[1] == "string")
            section.appendChild(create('p', {
              className: 'section_desc center',
              id: configId + '_section_desc_' + secNum,
              innerHTML: field.section[1]
            }));
          ++secNum;
        }

        // Create field elements and append to current section
        section.appendChild(fields[id].toNode(configId));
      }

      // Add save and close buttons
      bodyWrapper.appendChild(create('div',
        {id: configId + '_buttons_holder'},

        create('button', {
          id: configId + '_saveBtn',
          textContent: 'Save',
          title: 'Save settings',
          className: 'saveclose_buttons',
          onclick: function () { config.save() }
        }),

        create('button', {
          id: configId + '_closeBtn',
          textContent: 'Close',
          title: 'Close window',
          className: 'saveclose_buttons',
          onclick: function () { config.close() }
        }),

        create('div',
          {className: 'reset_holder block'},

          // Reset link
          create('a', {
            id: configId + '_resetLink',
            textContent: 'Reset to defaults',
            href: '#',
            title: 'Reset fields to default values',
            className: 'reset',
            onclick: function(e) { e.preventDefault(); config.reset() }
          })
      )));

      body.appendChild(bodyWrapper); // Paint everything to window at once
      config.center(); // Show and center iframe
      window.addEventListener('resize', config.center, false); // Center frame on resize

      // Call the open() callback function
      config.onOpen(config.frame.contentDocument || config.frame.ownerDocument,
                    config.frame.contentWindow || window,
                    config.frame);

      // Close frame on window close
      window.addEventListener('beforeunload', function () {
          config.close();
      }, false);

      // Now that everything is loaded, make it visible
      config.frame.style.display = "block";
      config.isOpen = true;
    }

    // Either use the element passed to init() or create an iframe
    var defaultStyle = 'position:fixed; top:0; left:0; opacity:0; display:none; z-index:999;' +
                       'width:75%; height:75%; max-height:95%; max-width:95%;' +
                       'border:1px solid #000000; overflow:auto; bottom: auto;' +
                       'right: auto; margin: 0; padding: 0;';
    if (this.frame) {
      this.frame.id = this.id;
      this.frame.setAttribute('style', defaultStyle);
      buildConfigWin(this.frame, this.frame.ownerDocument.getElementsByTagName('head')[0]);
    } else {
      // Create frame
      document.body.appendChild((this.frame = this.create('iframe', {
        id: this.id,
        style: defaultStyle
      })));

      this.frame.src = 'about:blank'; // In WebKit src can't be set until it is added to the page
      // we wait for the iframe to load before we can modify it
      this.frame.addEventListener('load', function(e) {
          var frame = config.frame;
          var body = frame.contentDocument.getElementsByTagName('body')[0];
          body.id = config.id; // Allows for prefixing styles with "#GM_config"
          buildConfigWin(body, frame.contentDocument.getElementsByTagName('head')[0]);
      }, false);
    }
  },

  save: function () {
    var fields = this.fields;
    for (id in fields)
      if (fields[id].toValue() === null) // invalid value encountered
        return;

    this.write();
    this.onSave(); // Call the save() callback function
  },

  close: function() {
    // If frame is an iframe then remove it
    if (this.frame.contentDocument) {
      this.remove(this.frame);
      this.frame = null;
    } else { // else wipe its content
      this.frame.innerHTML = "";
      this.frame.style.display = "none";
    }

    // Null out all the fields so we don't leak memory
    var fields = this.fields;
    for (var id in fields)
      fields[id].node = null;

    this.onClose(); //  Call the close() callback function
    this.isOpen = false;
  },

  set: function (name, val) {
    this.fields[name].value = val;
  },

  get: function (name) {
    return this.fields[name].value;
  },

  write: function (store, obj) {
    if (!obj) {
      var values = {},
          fields = this.fields;

      for (var id in fields) {
        var field = fields[id];
        if (field.settings.type != "button")
          values[id] = field.value;
      }
    }
    try {
      this.setValue(store || this.id, this.stringify(obj || values));
    } catch(e) {
      this.log("GM_config failed to save settings!");
    }
  },

  read: function (store) {
    try {
      var rval = this.parser(this.getValue(store || this.id, '{}'));
    } catch(e) {
      this.log("GM_config failed to read saved settings!");
      var rval = {};
    }
    return rval;
  },

  reset: function () {
    var fields = this.fields,
        doc = this.frame.contentDocument || this.frame.ownerDocument,
        type;

    for (id in fields) {
      var node = fields[id].node,
          field = fields[id].settings,
          noDefault = typeof field['default'] == "undefined",
          type = field.type;

      switch (type) {
        case 'checkbox':
          node.checked = noDefault ? GM_configDefaultValue(type) : field['default'];
          break;
        case 'select':
          if (field['default']) {
            for (var i = 0, len = node.options.length; i < len; ++i)
              if (node.options[i].value == field['default'])
                node.selectedIndex = i;
          } else
            node.selectedIndex = 0;
          break;
        case 'radio':
          var radios = node.getElementsByTagName('input');
          for (var i = 0, len = radios.length; i < len; ++i)
            if (radios[i].value == field['default'])
              radios[i].checked = true;
          break;
        case 'button' :
          break;
        default:
          node.value = noDefault ? GM_configDefaultValue(type) : field['default'];
          break;
      }
    }

    this.onReset(); // Call the reset() callback function
  },

  create: function () {
    switch(arguments.length) {
      case 1:
        var A = document.createTextNode(arguments[0]);
        break;
      default:
        var A = document.createElement(arguments[0]),
            B = arguments[1];
        for (var b in B) {
          if (b.indexOf("on") == 0)
            A.addEventListener(b.substring(2), B[b], false);
          else if (",style,accesskey,id,name,src,href,which".indexOf("," +
                   b.toLowerCase()) != -1)
            A.setAttribute(b, B[b]);
          else
            A[b] = B[b];
        }
        for (var i = 2, len = arguments.length; i < len; ++i)
          A.appendChild(arguments[i]);
    }
    return A;
  },

  center: function () {
    var node = this.frame,
        style = node.style,
        beforeOpacity = style.opacity;
    if (style.display == 'none') style.opacity = '0';
    style.display = '';
    style.top = Math.floor((window.innerHeight / 2) - (node.offsetHeight / 2)) + 'px';
    style.left = Math.floor((window.innerWidth / 2) - (node.offsetWidth / 2)) + 'px';
    style.opacity = '1';
  },

  remove: function (el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  },
  
  
   //these functions are taken from GM_config Extender by the same authors
   /* =========================================[ Resize configuration window ]===
    * int width: new width
    * int height: new height */
   resizeFrame: function (wid,hei) {
     if(fid=this.frame.id) {
       this.frame.style.width = wid;
       this.frame.style.height = hei;
     }
   },
   
   
   /* ====================================[ Add a border to the config frame ]===
    * object spec { width (5px), style (ridge), color (#eae9e8) }
    */
   addBorder: function() {
     if(fid=this.frame.id) {
       spec = arguments[0] || {};
       this.frame.style.borderWidth = (spec.width || '5px');
       this.frame.style.borderStyle = (spec.style || 'ridge');
       this.frame.style.borderColor = (spec.color || '#999999');
     }
}   
   
   //end of the functions from GM_config Extender
  
  
  
  
};

// Define a bunch of API stuff
(function() {
  var isGM = typeof GM_getValue != 'undefined' &&
             typeof GM_getValue('a', 'b') != 'undefined',
      setValue, getValue, stringify, parser;

  // Define value storing and reading API
  if (!isGM) {
    setValue = function (name, value) {
      return localStorage.setItem(name, value);
    };
    getValue = function(name, def){
      var s = localStorage.getItem(name);
      return s == null ? def : s
    };

    // We only support JSON parser outside GM
    stringify = JSON.stringify;
    parser = JSON.parse;
  } else {
    setValue = GM_setValue;
    getValue = GM_getValue;
    stringify = typeof JSON == "undefined" ?
      function(obj) {
        return obj.toSource();
    } : JSON.stringify;
    parser = typeof JSON == "undefined" ?
      function(jsonData) {
        return (new Function('return ' + jsonData + ';'))();
    } : JSON.parse;
  }

  GM_configStruct.prototype.isGM = isGM;
  GM_configStruct.prototype.setValue = setValue;
  GM_configStruct.prototype.getValue = getValue;
  GM_configStruct.prototype.stringify = stringify;
  GM_configStruct.prototype.parser = parser;
  //GM_configStruct.prototype.log = isGM ? GM_log : (window.opera ? opera.postError : console.log);
  GM_configStruct.prototype.log = window.opera ? opera.postError : console.log;
})();

function GM_configDefaultValue(type) {
  var value;

  if (type.indexOf('unsigned ') == 0)
    type = type.substring(9);

  switch (type) {
    case 'radio': case 'select':
      value = settings.options[0];
      break;
    case 'checkbox':
      value = false;
      break;
    case 'int': case 'integer':
    case 'float': case 'number':
      value = 0;
      break;
    default:
      value = '';
  }

  return value;
}

function GM_configField(settings, stored, id) {
  // Store the field's settings
  this.settings = settings;
  this.id = id;

  // if a setting was passed to init but wasn't stored then
  //      if a default value wasn't passed through init() then
  //      use default value for type
  //      else use the default value passed through init()
  // else use the stored value
  var value = typeof stored == "undefined" ?
                typeof settings['default'] == "undefined" ?
                  GM_configDefaultValue(settings.type)
                : settings['default']
              : stored;

  // Store the field's value
  this.value = value;
}




GM_configField.prototype = {
  create: GM_configStruct.prototype.create,

  node: null,

  toNode: function(configId) {
    var field = this.settings,
        value = this.value,
        options = field.options,
        id = this.id,
        create = this.create;

    var retNode = create('div', { className: 'config_var',
          id: configId + '_' + this.id + '_var',
          title: field.title || '' }),
        firstProp;

    // Retrieve the first prop
    for (var i in field) { firstProp = i; break; }

    var label = create('span', {
      innerHTML: field.label,
      id: configId + '_' + this.id +'_field_label',
      className: 'field_label'
    });

    switch (field.type) {
      case 'textarea':
        retNode.appendChild((this.node = create('textarea', {
          id: configId + '_field_' + this.id,
          innerHTML: value,
          cols: (field.cols ? field.cols : 20),
          rows: (field.rows ? field.rows : 2)
        })));
        break;
      case 'radio':
        var wrap = create('div', {
          id: configId + '_field_' + id
        });
        this.node = wrap;

        for (var i = 0, len = options.length; i < len; ++i) {
          var radLabel = wrap.appendChild(create('span', {
            innerHTML: options[i]
          }));

          var rad = wrap.appendChild(create('input', {
            value: options[i],
            type: 'radio',
            name: id,
            checked: options[i] == value ? true : false
          }));

          if (firstProp == "options")
            wrap.insertBefore(radLabel, rad);
          else
            wrap.appendChild(radLabel);
        }

        retNode.appendChild(wrap);
        break;
      case 'select':
        var wrap = create('select', {
          id: configId + '_field_' + id
        });
        this.node = wrap;

        for (var i in options)
          wrap.appendChild(create('option', {
            innerHTML: options[i],
            value: i,
            selected: options[i] == value ? true : false
          }));

        retNode.appendChild(wrap);
        break;
      case 'checkbox':
        retNode.appendChild((this.node = create('input', {
          id: configId + '_field_' + id,
          type: 'checkbox',
          value: value,
          checked: value
        })));
        break;
      case 'button':
        var btn = create('input', {
          id: configId + '_field_' + id,
          type: 'button',
          value: field.label,
          size: (field.size ? field.size : 25),
          title: field.title || ''
        });
        this.node = btn;

        if (field.script)
          btn.addEventListener('click', function () {
            var scr = field.script;
            typeof scr == 'function' ? setTimeout(scr, 0) : eval(scr);
          }, false);

        retNode.appendChild(btn);
        break;
      case 'hidden':
        retNode.appendChild((this.node = create('input', {
          id: configId + '_field_' + id,
          type: 'hidden',
          value: value
        })));
        break;
      default:
        // type = text, int, or float
        retNode.appendChild((this.node = create('input', {
          id: configId + '_field_' + id,
          type: 'text',
          value: value,
          size: (field.size ? field.size : 25)
        })));
    }

    // If the label is passed first, insert it before the field
    // else insert it after
    if (field.type != "hidden" &&
        field.type != "button" &&
        typeof field.label == "string") {
      if (firstProp == "label")
        retNode.insertBefore(label, retNode.firstChild);
      else
        retNode.appendChild(label);
    }

    return retNode;
  },

  toValue: function() {
    var node = this.node,
        field = this.settings,
        type = field.type,
        unsigned = false,
        rval;

    if (type.indexOf('unsigned ') == 0) {
      type = type.substring(9);
      unsigned = true;
    }

    switch (type) {
      case 'checkbox':
        this.value = node.checked;
        break;
      case 'select':
        this.value = node[node.selectedIndex].value;
        break;
      case 'radio':
        var radios = node.getElementsByTagName('input');
        for (var i = 0, len = radios.length; i < len; ++i)
          if (radios[i].checked)
            this.value = radios[i].value;
        break;
      case 'button':
        break;
      case 'int': case 'integer':
        var num = Number(node.value);
        var warn = 'Field labeled "' + field.label + '" expects a' +
          (unsigned ? ' positive ' : 'n ') + 'integer value';
        if (isNaN(num) || Math.ceil(num) != Math.floor(num) ||
            (unsigned && num < 0)) {
          alert(warn + '.');
          return null;
        }
        if (!this._checkNumberRange(num, warn))
          return null;
        this.value = num;
        break;
      case 'float': case 'number':
        var num = Number(node.value);
        var warn = 'Field labeled "' + field.label + '" expects a ' +
          (unsigned ? 'positive ' : '') + 'number value';
        if (isNaN(num) || (unsigned && num < 0)) {
          alert(warn + '.');
          return null;
        }
        if (!this._checkNumberRange(num, warn))
          return null;
        this.value = num;
        break;
      default:
        this.value = node.value;
        break;
    }

    return this.value; // value read successfully
  },

  _checkNumberRange: function(num, warn) {
    var field = this.settings;
    if (typeof field.min == "number" && num < field.min) {
      alert(warn + ' greater than or equal to ' + field.min + '.');
      return null;
    }

    if (typeof field.max == "number" && num > field.max) {
      alert(warn + ' less than or equal to ' + field.max + '.');
      return null;
    }
    return true;
  }
};

// Create default instance of GM_config
var GM_config = new GM_configStruct();




//END OF GM_CONFIG 






//the next three functions are necessary to emulate greasemonkey functions in Chrome

// GM_addStyle()
// taken from actual greasemonkey source
if('undefined' == typeof GM_addStyle) 
{
  function GM_addStyle(css) 
  {
    var head = document.getElementsByTagName("head")[0];
    if (head) 
    {
      var style = document.createElement("style");
      style.textContent = css;
      style.type = "text/css";
      head.appendChild(style);
    }
    return style;
  }
}



if('undefined' == typeof GM_deleteValue) 
{

  // GM_setValue()
  function GM_setValue(name,value) 
  {
  	value = (typeof value)[0] + value;
        localStorage.setItem(name, value);
  }



  // GM_getValue()

  function GM_getValue(name,defaultValue) 
  {

	var value = localStorage.getItem(name);
        if (!value)
        	return defaultValue;
        var type = value[0];
        value = value.substring(1);
      	switch (type) 
      	{
      		case 'b':
              		return value == 'true';
            	case 'n':
                	return Number(value);
            	default:
                	return value;
	}
  }
}


function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function getElementsById(searchId, node, tag)
{
	var idElements = new Array();
	if( node == null )
		node = document;
	if( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchId+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].id) ) {
			idElements[j] = els[i];
			j++;
		}
	}
	return idElements;	
}

function getSearchOriginDestination()
{
	var address = window.location.href;
	var startOfOrigin = address.indexOf("?f=") + 3;
	var endOfOrigin = address.indexOf("&t=");
	var origin = address.substring(startOfOrigin, endOfOrigin);
	
	var startOfDest = address.indexOf("&t=") + 3;
	var endOfDest = address.indexOf("&d=");
	var dest = address.substring(startOfDest, endOfDest);
	
	origin = origin.toUpperCase();
	dest = dest.toUpperCase();
	
	var originDest = origin + "-" + dest;
	return originDest;
}


function getCurrentDateURL()
{
    var address = window.location.href;
    
    //console.log( address );
    
    
    return address;
}

function getPreviousDateURL()
{
	address = getCurrentDateURL();
    
    
    
    
	var startOfDateTag = address.indexOf("&d=") + 3;
	var endOfDateTag = address.indexOf("&tt", startOfDateTag );
	var date = address.substring( startOfDateTag, endOfDateTag );

    //console.log("Date = %s", date );

	var indexOfFirstDash = date.indexOf("-");

	var indexOfSecondDash = date.indexOf("-", indexOfFirstDash+1);
	var year = date.substring( 0, indexOfFirstDash );
    //console.log( "Year = %s", year);
	var month = date.substring( indexOfFirstDash+1, indexOfSecondDash );
	//console.log( "Month = %s", month);
    var day = date.substring( indexOfSecondDash+1 );
    //console.log( "Day = %s", day);
    
	var currentDay = new Date();
	currentDay.setFullYear( parseInt(year), parseInt(month)-1, parseInt(day) );
    //console.log( currentDay );
    

	var oneDayEarlier = new Date( currentDay.toString() );
	oneDayEarlier.setDate( oneDayEarlier.getDate()-1 );

	//var oneDayEarlierString = oneDayEarlier.getMonth()+1 + "/" + oneDayEarlier.getDate() + "/" + oneDayEarlier.getFullYear();
    var oneDayEarlierMonth = oneDayEarlier.getMonth()+1;
    var oneDayEarlierDay   = oneDayEarlier.getDate();
    
    var oneDayEarlierMonthString = (oneDayEarlierMonth < 10 ? '0' : '') + oneDayEarlierMonth;
    var oneDayEarlierDayString   = (oneDayEarlierDay < 10 ? '0' : '') + oneDayEarlierDay;
    
	var oneDayEarlierString = oneDayEarlier.getFullYear() + "-" + oneDayEarlierMonthString + "-" + oneDayEarlierDayString;
    //console.log( "One day earlier string = %s", oneDayEarlierString );
	
	var searchRE = new RegExp( date, 'g');

	address = address.replace( searchRE, oneDayEarlierString );    
    //console.log( "New address = %s", address );
    
    
    
    
    
    
    
	return address;
}

function getNextDateURL()
{
	address = getCurrentDateURL();
    
    
 	var startOfDateTag = address.indexOf("&d=") + 3;
	var endOfDateTag = address.indexOf("&tt=", startOfDateTag );
	var date = address.substring( startOfDateTag, endOfDateTag );


	var indexOfFirstDash = date.indexOf("-");

	var indexOfSecondDash = date.indexOf("-", indexOfFirstDash+1);
	var year = date.substring( 0, indexOfFirstDash );
	var month = date.substring( indexOfFirstDash+1, indexOfSecondDash );
	var day = date.substring( indexOfSecondDash+1 );

	var currentDay = new Date();
	currentDay.setFullYear( parseInt(year), parseInt(month)-1, parseInt(day) );

	var oneDayLater = new Date( currentDay.toString() );
	oneDayLater.setDate( oneDayLater.getDate()+1 );

    var oneDayLaterMonth = oneDayLater.getMonth()+1;
    var oneDayLaterDay   = oneDayLater.getDate();
    
    var oneDayLaterMonthString = (oneDayLaterMonth < 10 ? '0' : '') + oneDayLaterMonth;
    var oneDayLaterDayString   = (oneDayLaterDay < 10 ? '0' : '') + oneDayLaterDay;
    
	var oneDayLaterString = oneDayLater.getFullYear() + "-" + oneDayLaterMonthString + "-" + oneDayLaterDayString;
    //console.log( "One day later string = %s", oneDayLaterString );
	
	var searchRE = new RegExp( date, 'g');	
	
	address = address.replace( searchRE, oneDayLaterString );   
    

	return address;
}


var scrolldelayUp;
var scrolldelayDown;


function stopScrollUp() {
    	clearTimeout(scrolldelayUp);
}

function stopScrollDown() {
    	clearTimeout(scrolldelayDown);
}

function pageScrollDown() 
{

	stopScrollDown();
	window.scrollBy(0,100); // horizontal and vertical scroll increments
    	scrolldelayDown = setTimeout(pageScrollDown,100); // scrolls every 100 milliseconds
}

function pageScrollUp()
{
	stopScrollUp();
	window.scrollBy(0,-100); // horizontal and vertical scroll increments
    	scrolldelayUp = setTimeout(pageScrollUp,100); // scrolls every 100 milliseconds

}

function doInsertNavButtons()
{

	//console.log( "spot 0" );

	var mainElement = getElementsByClass( "container-trim", document, "div" );
	//console.log( "mainElement is %s", mainElement );
	//console.log( "mainElement.length is %d", mainElement.length );
	var target = mainElement[0];



	var divElement = document.createElement('div');
	divElement.setAttribute('style','margin-right:1em;float:right');
	divElement.setAttribute('id', 'jts_new_div');
	divElement.setAttribute('class', 'jts_div_new');

	var tableElement = document.createElement('table');
	divElement.appendChild( tableElement );

	var trElement = document.createElement('tr');
	tableElement.appendChild( trElement );

	var tdElement = document.createElement('td');
	trElement.appendChild( tdElement );
	
	
	//console.log( "spot 0.5" );
	
	var scrollUpButton = document.createElement('input');
	scrollUpButton.setAttribute('id','jts_scroll_up');
	scrollUpButton.setAttribute('type','button');
	scrollUpButton.setAttribute('style','margin:0.5em 0em 0em 0em');
	scrollUpButton.setAttribute('value','Scroll Up');
	scrollUpButton.setAttribute('name','jts_scroll_up');
	scrollUpButton.addEventListener("mousedown", pageScrollUp, false);
	scrollUpButton.addEventListener("mouseup", stopScrollUp, false );

	tdElement.appendChild( scrollUpButton );
	
	
	

	//console.log( "spot 1");

	var prevButtonElement = document.createElement('input');
	var nextButtonElement = document.createElement('input');

	prevButtonElement.setAttribute('id','jts_prev');
	nextButtonElement.setAttribute('id','jts_next');
	prevButtonElement.setAttribute('type','button');
	nextButtonElement.setAttribute('type','button');
	prevButtonElement.setAttribute('style','margin:0.5em 0em 0em 0em');
	nextButtonElement.setAttribute('style','margin:0.5em 0em 0em 0em');
	prevButtonElement.setAttribute('value','Previous');
	nextButtonElement.setAttribute('value','Next');
	prevButtonElement.setAttribute('name','jts_prev');
	nextButtonElement.setAttribute('name','jts_next');


	var location1 = getPreviousDateURL();
	var location2 = getNextDateURL();



	var location1Action = "window.location.replace(\"" + location1 + "\")";
	var location2Action = "window.location.replace(\"" + location2 + "\")";

	prevButtonElement.setAttribute('onclick',location1Action);
	nextButtonElement.setAttribute('onclick',location2Action);

	tdElement.appendChild( prevButtonElement );
	tdElement.appendChild( nextButtonElement );

	//console.log( "spot 3");


	var scrollDownButton = document.createElement('input');
	scrollDownButton.setAttribute('id','jts_scroll_down');
	scrollDownButton.setAttribute('type','button');
	scrollDownButton.setAttribute('style','margin:0.5em 0em 0em 0em');
	scrollDownButton.setAttribute('value','Scroll Down');
	scrollDownButton.setAttribute('name','jts_scroll_down');
	scrollDownButton.addEventListener("mousedown", pageScrollDown, false);
	scrollDownButton.addEventListener("mouseup", stopScrollDown, false );

	tdElement.appendChild( scrollDownButton );

	//console.log( "spot 4" );


	target.parentNode.insertBefore(divElement, target.nextSibling );


	GM_addStyle("#jts_prev { position: fixed; top: 50px; right: 60px; z-index: 222; background: yellow; }");
	GM_addStyle("#jts_next { position: fixed; top: 50px; right: 10px; z-index: 222; background: yellow; }");
	GM_addStyle("#jts_scroll_down { position: fixed; top: 80px; right: 25px; z-index: 222; background: yellow; }");
	GM_addStyle("#jts_scroll_up { position: fixed; top: 20px; right: 25px; z-index: 222; background: yellow; }");
}


function eventFire(el, etype){
	if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function findPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {	
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	return [curtop];
	}
}





var insertNavButtons = false;
var hideStdAwards = false;
var expandMixedCabin = false;
var showEconomyAwards = false;
var showBusinessAwards = false;
var showFirstAwards = false;
var autoScrollPastCalendar = false;
var sortByAwardType = 'Economy';


var filterStandardAwards = false;
var filterEconomyAwards = false;
var filterBusinessAwards = false;
var filterFirstAwards = false;

var sortOnFirstSaver = false;
var sortOnBusinessSaver = false;
var sortOnEconomy = false;




function readOptions()
{
	
	//only works in GreaseMonkey, not Chrome
	//var header = "Easy United Award Search Options v" + GM_info.script.version;

	GM_config.init( "New Easy United Award Search Options", 
	//GM_config.init( header, 
	/* Fields object */ 
	{
		'insertNavButtons':
		{
			'label': 'Insert Nav Buttons', // Appears next to field
			'type': 'checkbox', // Makes this setting a text field
			'default': true // Default value if user doesn't change it
		},
		



		//'expandMixedCabin':
		//{
		//	'label': 'Expand Mixed Cabin Info', // Appears next to field
		//	'type': 'checkbox', // Makes this setting a text field
		//	'default': true // Default value if user doesn't change it
		//},
		
		
		'autoScrollPastCalendar':
		{
			'label': 'Auto Scroll to Past Calendar', // Appears next to field
			'type': 'checkbox', // Makes this setting a text field
			'default': true // Default value if user doesn't change it
		},
		
		'sortByAwardType':
		{
			'label': 'Sort by award type',
			'type': 'radio',
			'options': ['None', 'Economy', 'Business', 'First'],
			'default': 'None'
		},
		
		'hideStdAwards':
		{
			'section': ['Hide These Award Types',''],
			'label': 'Hide Standard Awards', // Appears next to field
			'type': 'checkbox', // Makes this setting a text field
			'default': true // Default value if user doesn't change it
		},
		
		
		'hideEconomyAwards':
		{
			'label': 'Hide Economy Awards', 
			'type': 'checkbox',
			'default': false
		},
		
		'hideBusinessAwards':
		{
			'label': 'Hide Business/BusinessFirst/First (two-cabin) Awards',
			'type': 'checkbox',
			'default': false
		},
		
		'hideFirstAwards':
		{
			'label': 'Hide First (three-cabin) Awards',
			'type': 'checkbox',
			'default': false
		}
		
		
		
	} , ".indent40 { \
		    margin-left: auto !important; \
		    text-align: center !important; } \
		#config_header { \
		    font-size: 20pt !important; } \
		div.section_header_holder { \
		    margin-top: 0 !important; } \
		h2.section_header { \
		    text-align: left !important; } \
		.config_var .field_label { \
		    margin-left: 23px !important; } \
		.config_var input[type='checkbox'] { \
		    position: absolute !important; \
		    left: 5px !important; } \
		#field_customCSS{ \
		    display: block; \
		    font: 12px monospace; \
		    margin-left: 25px; }",
		{
		    save: function() {
		       location.reload();
		    },
		    open: function() {
		    	GM_config.addBorder();
		    	GM_config.resizeFrame('370px','320px'); // resize the config window
		    	GM_config.center();
		    }
		}	

	);
	
	insertNavButtons = GM_config.get('insertNavButtons');
	filterStandardAwards = GM_config.get('hideStdAwards');
	//expandMixedCabin = GM_config.get('expandMixedCabin');
	autoScrollPastCalendar = GM_config.get('autoScrollPastCalendar');
	filterEconomyAwards = GM_config.get('hideEconomyAwards');
	filterBusinessAwards = GM_config.get('hideBusinessAwards');
	filterFirstAwards = GM_config.get('hideFirstAwards');
	sortByAwardType = GM_config.get('sortByAwardType');	
	
	if( sortByAwardType == "Economy" )
	{
		sortOnEconomy = true;
	}
	else if( sortByAwardType == "Business" )
	{
		sortOnBusinessSaver = true;
	}
	else if( sortByAwardType == "First" )
	{
		sortOnFirstSaver = true;
	}
}


function openOptionsDialog()
{
	//console.log( "inside openOptionsDialog" );
	GM_config.open();
	//console.log( "done opening dialog");
}


function createOptionsButton()
{


	var mainElement = getElementsByClass( "container-trim", document, "div" );
	var target = mainElement[0];


	var optionsButton = document.createElement('input');
	optionsButton.setAttribute('id','jts_options');
	optionsButton.setAttribute('type','button');
	optionsButton.setAttribute('style','margin:0.5em 0em 0em 0em');
	optionsButton.setAttribute('value','Options');
	optionsButton.setAttribute('name','jts_options');
	optionsButton.addEventListener("click", openOptionsDialog, false);

	//tdElement.appendChild( optionsButton );


	target.parentNode.insertBefore(optionsButton, target.nextSibling );

	GM_addStyle("#jts_options { position: fixed; bottom: 10px; right: 25px; z-index: 222; background: yellow; }");


}








// configuration of the observer:
var config = { childList: true, subtree: true };

var columnsToRemove = [];
var origNumColumns = -1;
var finalNumColumns;

var economyHeaderId = "";
var businessHeaderId = "";
var firstHeaderId = "";
var haveSetColHeadersIDs = false;

function getColHeaderIDs()
{
    haveSetColHeadersIDs = true;
	var colHeadersWrap = getElementsByClass("fare-column-headers-wrap");
	
	var colHeaders = getElementsByClass("col-header", colHeadersWrap[0]);
	//console.log("number of column headers is %d", colHeaders.length);	
    
    if( colHeaders.length == 1 )
    {
        //console.log("Economy header id %s", colHeaders[0].id);
		economyHeaderId = colHeaders[0].id;
    }
    else if( colHeaders.length == 3 )
    {
        //console.log("Economy header id %s", colHeaders[0].id);
        //console.log("Business header id %s", colHeaders[1].id);
  		economyHeaderId = colHeaders[0].id;
		businessHeaderId = colHeaders[1].id;
     
    }
    else
    {
        //console.log("Economy header id %s", colHeaders[0].id);
        //console.log("Business header id %s", colHeaders[1].id);
        //console.log("First header id %s", colHeaders[3].id);
  		economyHeaderId = colHeaders[0].id;
		businessHeaderId = colHeaders[1].id;
		firstHeaderId = colHeaders[3].id;
        
    }
        
}

function getNumberOfColumnHeaders()
{
	var colHeadersWrap = getElementsByClass("fare-column-headers-wrap");
	
	var colHeaders = getElementsByClass("col-header", colHeadersWrap[0]);
	//console.log("number of column headers is %d", colHeaders.length);	
	
	return colHeaders.length;
}


function doRemoveAwardColumns()
{

	//console.log("Inside doRemoveAwardColumns");
	
	if( origNumColumns == -1 )
	{
		origNumColumns = getNumberOfColumnHeaders();
		
		if( origNumColumns == 5 )
		{
			finalNumColumns = origNumColumns;
			if( filterStandardAwards )
			{
				columnsToRemove.push(4);
				columnsToRemove.push(2);
				finalNumColumns -= 2;
			}
			
			if( filterFirstAwards )
			{
				finalNumColumns -= 1;
				columnsToRemove.push(3);
				if(!filterStandardAwards)
				{
					finalNumColumns -= 1;
					columnsToRemove.push(4);
				}
			}
			if( filterBusinessAwards )
			{
				finalNumColumns -= 1;
				columnsToRemove.push(1);
				if(!filterStandardAwards)
				{
					finalNumColumns -= 1;
					columnsToRemove.push(2);
				}
			}
			if( filterEconomyAwards )
			{
				finalNumColumns -= 1;
				columnsToRemove.push(0);
			}
			

		}
		else
		{
			finalNumColumns = origNumColumns;
			if( filterStandardAwards )
			{
				columnsToRemove.push(2);
				finalNumColumns -= 1;
			}
			
			if( filterBusinessAwards )
			{
				finalNumColumns -= 1;
				columnsToRemove.push(1);
				if(!filterStandardAwards)
				{
					finalNumColumns -= 1;
					columnsToRemove.push(2);
				}
			}
			if( filterEconomyAwards )
			{
				finalNumColumns -= 1;
				columnsToRemove.push(0);
			}
		}
		
		//console.log("finalNumColumns is %d", finalNumColumns);
		//console.log("columnsToRemove is ", columnsToRemove);
		
		columnsToRemove.sort();
		columnsToRemove.reverse();
		
		if( finalNumColumns == 0 )
		{
			//oops, all columns filtered
			//put economy back in
			columnsToRemove.pop();
			finalNumColumns++;
		}

	}
	
	if(getNumberOfColumnHeaders() != finalNumColumns )
	{
		//console.log("Current number of headers doesn't match final number, deleting columns headers");
		
		var parentOfHeaders = getElementsByClass("fare-column-headers");
		//console.log("parentOfHeaders is ", parentOfHeaders );
		

		var columnHeaders = getElementsByClass("col-header", parentOfHeaders[0]);
		
		//console.log("number of column headers found is %d", columnHeaders.length);
		
		for( var i = 0; i < columnsToRemove.length; ++i )
		{
			var child = columnHeaders[ columnsToRemove[i] ];
			child.remove();
		}
		

		var newClassName = "fare-column-headers columns_" + finalNumColumns;
		//console.log("New class name for column headers is ", newClassName);		
		parentOfHeaders[0].className = newClassName;
	}

	var tableElement = getElementsByClass( "flight-result-list", document, "ul" );
	//console.log( "tableElement.length = %d", tableElement.length );
	//console.log( "tableElement is");
	//console.log(tableElement);
	
	var needToFilter = filterStandardAwards || filterEconomyAwards || filterBusinessAwards || filterFirstAwards;
	
	if( tableElement.length != 0  )
	{





		//var rows = tableElement[0].getElementsByTagName( "li" );
		var rows = getElementsByClass( "flight-block", tableElement[0], "li" );
		//console.log( "number of rows is %d", rows.length );

		for( var row = rows.length-1 ; row >= 0; row-- )
		{
	
			//make sure we haven't already appended the details
			var myFlightDetails = getElementsByClass( "jtsDivFlightDetail", rows[row] );
			if( myFlightDetails.length == 0 )
			{
			
				var segments = getElementsByClass("segment", rows[row]);
				//console.log( "There are %d segments on row %d", segments.length, row+1 );
				var detailsString = "";
				
				for( var i = 0; i < segments.length; ++i )
				{
					var segmentMarketString = "";
					var segmentMarket = getElementsByClass("segment-market", segments[i]);
					if( segmentMarket.length > 0 )
					{
						//console.log(segmentMarket[0].innerHTML );
						segmentMarketString = segmentMarket[0].innerHTML;
						var searchRE = new RegExp( " to ", 'g');	
						segmentMarketString = segmentMarketString.replace( searchRE, "-" );				
						//console.log(segmentMarketString);
					}
					else
					{
						//must be a nonstop between the search points	
						segmentMarketString = getSearchOriginDestination();
					}
					
					var segmentFlightNumber = getElementsByClass("segment-flight-number", segments[i]);
					var flightNumberString = segmentFlightNumber[0].innerHTML;
					searchRE = new RegExp("<span class.*span>", 'g');
					flightNumberString = flightNumberString.replace( searchRE, "");
					flightNumberString = flightNumberString.trim();
					
					searchRE = new RegExp(" ", 'g');
					flightNumberString = flightNumberString.replace( searchRE, "");
					
					//console.log(flightNumberString);
					
					detailsString += flightNumberString;
					detailsString += " ";
					detailsString += segmentMarketString;
					if( (i+1) != segments.length )
					{
						detailsString += " / ";
					}
				}
				//console.log(detailsString);
				
				//now let's create a place to put the flight information
				var flightSummary = getElementsByClass("flight-summary", rows[row]);
				//console.log("Found %d flight-summary blocks", flightSummary.length);
				var divElement = document.createElement('div');
				divElement.setAttribute('id', 'jtsDivFlightDetail'+row);
				divElement.setAttribute('class', 'jtsDivFlightDetail');
				divElement.setAttribute('style', "position: absolute; bottom:0; width: 100%;" );
				divElement.innerHTML = detailsString;
				
				flightSummary[0].parentNode.appendChild( divElement );
			}

		}




		if( needToFilter )
		{

			//var rows = tableElement[0].getElementsByTagName( "li" );
			var rows = getElementsByClass( "flight-block", tableElement[0], "li" );
			//console.log( "number of rows is %d", rows.length );

			for( var row = rows.length-1 ; row >= 0; row-- )
			{
		
				if( filterStandardAwards )
				{
					//try to find the saver award text
					var saverEconomy = getElementsByClass("pp-discounted-fare", rows[row]);
					//console.log("saverEconomy is ", saverEconomy);
					//console.log("saverEconomy length is ", saverEconomy.length);
					if( saverEconomy.length == 0 )
					{
						//it's not saver, need to check if there is an award or not
						//if there isn't an award at all, do nothing
						//if there is an award, change whats shown
						var economyFare = getElementsById("product_MIN-ECONOMY-SURP-OR-DISP", rows[row]);
						if( economyFare.length > 0 )
						{
							//console.log("Found an standard economy fare");
							//console.log(economyFare);
							
							
							var divElement = document.createElement('div');
							divElement.setAttribute('class', 'fare-option fare-not-available');
							var divElement2 = document.createElement('div');
							divElement2.setAttribute('class', 'price-point-wrap');
							divElement2.innerHTML = "Not Available<br/>Standard Award Only";
							divElement.appendChild(divElement2);
							economyFare[0].parentNode.insertBefore(divElement, economyFare[0].nextSibling);
							
							economyFare[0].parentNode.removeChild( economyFare[0] );
							//console.log("Parent node is ", economyFare[0].parentNode);
						}
						
					}
				}
				
				//console.log( rows[row] );
				var fareClasses = getElementsByClass( "fare-option", rows[row] );
				//console.log( "Number of Fare Classes = %d", fareClasses.length );
				
				
				var parentNode = fareClasses[0].parentNode;
				var newResultClassName = "flight-block-fares-container columns_" + finalNumColumns;
				//console.log("New class name for fare element is ", newResultClassName);
				
				parentNode.className = newResultClassName;

				
				for( var i = 0; i < columnsToRemove.length; ++i)
				{
					if( fareClasses.length != finalNumColumns )
                    {
                        var element = fareClasses[ columnsToRemove[i] ];
                        //console.log("Element to remove is ", element);
                        element.remove();
                    }
				}
				
				var notAvailableClasses = getElementsByClass("fare-not-available", parentNode );
				//console.log( "Row %d has %d not available fares", row+1, notAvailableClasses.length);
				if( notAvailableClasses.length == finalNumColumns )
				{
					//console.log("All columns are not available");
					parentNode.parentNode.parentNode.removeChild(parentNode.parentNode);
				}
			}	
		}
	}
}

var observer;

function removeAwardColumnsFromDetails( row )
{
	
	

	//this is the table for each segment that list fare class, meals, etc
	var productDetails = getElementsByClass("product-details", row);
	//console.log("there are %d product-details", productDetails.length);

			
	//now clean up the details portion
	//there may be multiple segments
	for(var segment = productDetails.length-1; segment >= 0; --segment )
	{
		var tdElements = productDetails[segment].getElementsByTagName("td");
		//console.log("There are %d td elements", tdElements.length);
		
		for( var i = 0; i < columnsToRemove.length; ++i )
		{
			//tdElements[4].parentNode.removeChild( tdElements[4] );
			var element = tdElements[ columnsToRemove[i] ];
			element.remove();
		}
	}
}

function doSort()
{

	if( sortOnEconomy )
	{
		//eventFire(document.getElementById("column-MIN-ECONOMY-SURP-OR-DISP"),'click');
		eventFire(document.getElementById(economyHeaderId),'click');
	}
	else if( sortOnBusinessSaver )
	{
		if( document.getElementById(businessHeaderId) )
		{
			//try sorting by business initially
			//console.log("Attempting to click");
			eventFire(document.getElementById(businessHeaderId),'click');
		}
		else
		{
			eventFire(document.getElementById(economyHeaderId),'click');
		}
	}
	else if( sortOnFirstSaver )
	{
		//console.log( "First class header is ");
		//console.log( document.getElementById("column-FIRST-SURPLUS") );
		if( document.getElementById(firstHeaderId))
		{
			eventFire(document.getElementById(firstHeaderId),'click');
			eventFire(document.getElementById(firstHeaderId),'click');
		}
		else
		{
			eventFire(document.getElementById(businessHeaderId),'click');
		}
	}

}

var needToSort = true;

function doScroll()
{

	//var scrollToElem = getElementsByClass("fl-farewheel-disclaimer-container no-farewheel");
	var scrollToElem = getElementsByClass("fl-search-header-wrap");
	//console.log( "elem is ", scrollToElem[0]);
	
	var offset = findPos( scrollToElem[0] );
	//console.log( "offset is %d", offset );	
	
	window.scrollBy(0,-50000);
	window.scrollBy(0,offset);
}

function onEachMutation(mutation)
{
	//console.log("Mutation happening");
	//console.log("Mutation type is ", mutation.type);
	//console.log("Number of added nodes is ", mutation.addedNodes.length);
	//console.log("Number of deleted nodes is ", mutation.removedNodes.length);
	//console.log("Attribute name is ", mutation.attributeName);

	//console.log( mutation.target );
	//console.log( mutation.target.className );
	if( mutation.target.id == "fl-results" )
	{

		if( !haveSetColHeadersIDs)
        {
            getColHeaderIDs();
        }
				
		if( needToSort )
		{
			doSort();
			needToSort = false;
		}
		

		doRemoveAwardColumns();
		
		if( autoScrollPastCalendar )
		{
			doScroll();
		}

		
	}
	
	if( ( mutation.addedNodes.length > 0 ) &&
	    ( mutation.addedNodes[0].className ) &&
	    (!( mutation.addedNodes[0].className.includes("qtip") ) ) &&
	    ( mutation.target.className.indexOf("flight-search-results") > -1 ) )
	{
		//console.log("Inside scrolling block");
		//console.log("className contains qtip is ", (mutation.addedNodes[0].className.includes("qtip")));
		if( !needToSort && autoScrollPastCalendar )
		{
			doScroll();
		}
		else
		{
			window.scrollBy(0,-50000);
		}	
		

	}
	
	
	for( var i = 0; i < mutation.addedNodes.length; ++i )
	{	
		//console.log(mutation.addedNodes[i]);
		
		//console.log( mutation.addedNodes[i].tagName );
		if( mutation.addedNodes[i].tagName && mutation.addedNodes[i].tagName.toLowerCase() == "div" )
		{
			//console.log("Found a div tag");
			//console.log(mutation.addedNodes[i]);
			var dataModuleInfo = mutation.addedNodes[i].getAttribute("data-module-info");
			if( dataModuleInfo )
			{
				//console.log( dataModuleInfo);
				var pattern = new RegExp("show trip detail");
				if( pattern.test( dataModuleInfo ) )
				{
					//console.log(mutation.addedNodes[i]);
					//console.log("Flight Details added");
					removeAwardColumnsFromDetails(mutation.addedNodes[i]);
				}
			}
		}
	}
		
	
	
}

function observerFunction(mutations)
{
	mutations.forEach(onEachMutation);
}











createOptionsButton();

readOptions();


if( insertNavButtons )
{
	doInsertNavButtons();
}


// select the target node
var target = document;
 
// create an observer instance
observer = new MutationObserver(observerFunction);
 
 
// pass in the target node, as well as the observer options
observer.observe(target, config);	