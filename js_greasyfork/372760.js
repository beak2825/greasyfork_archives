// ==UserScript==
// @namespace     http://tampermonkey.net/
// @exclude       *

// ==UserLibrary==
// @name          GM_config_lz-string
// @description   ConfigLzString／Refactor GM_config, this version uses lz-string to access data for a Library script
// @author        avan
// @license       MIT
// @version       0.6

// ==/UserScript==

// ==/UserLibrary==
GM_configStruct.prototype.create = function() {
	switch (arguments.length) {
		case 1:
			var A = document.createTextNode(arguments[0]);
			break;
		default:
			var A = document.createElement(arguments[0]),
				B = arguments[1];
			for (var b in B) {
				if (b.indexOf("on") == 0)
					A.addEventListener(b.substring(2), B[b], false);
				//else if (",style,accesskey,id,name,src,href,which,for".indexOf("," + b.toLowerCase()) != -1)
				else if (b.match(/^(style|accesskey|id|name|src|href|which|for|data-)/i))
					A.setAttribute(b, B[b]);
				else
					A[b] = B[b];
			}
			if (typeof arguments[2] == "string")
				A.innerHTML = arguments[2];
			else
				for (var i = 2, len = arguments.length; i < len; ++i)
					A.appendChild(arguments[i]);
	}
	return A;
};
GM_configStruct.prototype.read = function (store) {
	var rval, cKey, dValue;
	try {
		cKey = LZString.compressToUTF16(store || this.id);
		dValue = LZString.decompressFromUTF16(this.getValue(cKey, '{}'));
		rval = this.parser(dValue);
	} catch(e) {
		this.log("GM_config failed to read saved settings!");
		rval = {};
	}
	return rval;
};
GM_configStruct.prototype.write = function (store, obj) {
	if (!obj) {
		var values = {},
			forgotten = {},
			fields = this.fields;

		for (var id in fields) {
			var field = fields[id];
			var value = field.toValue();

			if (field.save) {
				if (value !== null) {
					values[id] = value;
					field.value = value;
				} else
					values[id] = field.value;
			} else
				forgotten[id] = value;
		}
	}
	try {
		var cKey = LZString.compressToUTF16(store || this.id),
			cValue = LZString.compressToUTF16(this.stringify(obj || values));
		this.setValue(cKey, cValue);
	} catch(e) {
		this.log("GM_config failed to save settings!");
	}

	return forgotten;
};
GM_configField.prototype.create = GM_configStruct.prototype.create;
GM_configField.prototype.toNode = function() {
	var field = this.settings,
		value = this.value,
		options = field.options,
		type = field.type,
		className = field.class,
		style = field.style,
		id = this.id,
		configId = this.configId,
		labelPos = field.labelPos,
		create = this.create;
	function addLabel(pos, labelEl, parentNode, beforeEl) {
		if (!beforeEl) beforeEl = parentNode.firstChild;
		switch (pos) {
			case 'right':
			case 'below':
				if (pos == 'below')
					parentNode.appendChild(create('br', {}));
				parentNode.appendChild(labelEl);
				break;
			default:
				if (pos == 'above')
					parentNode.insertBefore(create('br', {}), beforeEl);
				parentNode.insertBefore(labelEl, beforeEl);
		}
	}
	var retNode = create('div', {
		className: 'config_var',
		id: configId + '_' + id + '_var',
		title: field.title || '',

	}),
		firstProp;
	// Retrieve the first prop
	for (var i in field) {
		firstProp = i;
		break;
	}
	var label = field.label && type != "button" ?
		create('label', {
			id: configId + '_' + id + '_field_label',
			for: configId + '_field_' + id,
			className: 'field_label'
		}, field.label) : null;
	var props = {className: className || '', style: style || ''};
	for (var key in field) {
		var val = field[key];
		if (key.match(/^data-/i) && !props[key]) props[key] = val;
	};
	switch (type) {
		case 'textarea':
			props.innerHTML = value;
			props.id = configId + '_field_' + id;
			props.className = (props.className ? props.className + ' ' : '') + 'block';
			props.cols = (field.cols ? field.cols : 20);
			props.rows = (field.rows ? field.rows : 2);
			retNode.appendChild((this.node = create('textarea', props)));
			break;
		case 'radio':
			props.id = configId + '_field_' + id;
			var wrap = create('div', props);
			this.node = wrap;
			for (var i = 0, len = options.length; i < len; ++i) {
				var radLabel = create('label', {
					className: 'radio_label'
				}, options[i]);
				var rad = wrap.appendChild(create('input', {
					value: options[i],
					type: 'radio',
					name: id,
					checked: options[i] == value
				}));
				var radLabelPos = labelPos &&
					(labelPos == 'left' || labelPos == 'right') ?
					labelPos : firstProp == 'options' ? 'left' : 'right';
				addLabel(radLabelPos, radLabel, wrap, rad);
			}
			retNode.appendChild(wrap);
			break;
		case 'select':
			props.id = configId + '_field_' + id;
			var wrap = create('select', props);
			this.node = wrap;
			for (var i = 0, len = options.length; i < len; ++i) {
				var option = options[i];
				wrap.appendChild(create('option', {
					value: option,
					selected: option == value
				}, option));
			}
			retNode.appendChild(wrap);
			break;
		default: // fields using input elements
			props.id = configId + '_field_' + id;
			props.type = type;
			props.value = type == 'button' ? field.label : value;
			switch (type) {
				case 'checkbox':
					props.checked = value;
					break;
				case 'button':
					props.size = field.size ? field.size : 25;
					if (field.script) field.click = field.script;
					if (field.click) props.onclick = field.click;
					break;
				case 'hidden':
					break;
				case 'password':
					props.size = field.size ? field.size : 25;
					break;
				default:
					// type = text, int, or float
					props.type = 'text';
					props.size = field.size ? field.size : 25;
			}
			retNode.appendChild((this.node = create('input', props)));
	}
	if (label) {
		// If the label is passed first, insert it before the field
		// else insert it after
		if (!labelPos)
			labelPos = firstProp == "label" || type == "radio" ?
				"left" : "right";
		addLabel(labelPos, label, retNode);
	}
	return retNode;
};
var ConfigLzString = function () {
	GM_configStruct.apply(this, arguments);
	if (arguments.length > 0 && arguments[0].src) {
		this.srcs = arguments[0].src.replace(/ *[ ;,]+ */g, ' ').split(/[ ;,]/);
	}
}
ConfigLzString.prototype = GM_configStruct.prototype;
ConfigLzString.prototype.open = function() {
	// Die if the menu is already open on this page
	// You can have multiple instances but you can't open the same instance twice
	var match = document.getElementById(this.id);
	if (match && (match.tagName == "IFRAME" || match.childNodes.length > 0)) return;
	// Sometimes "this" gets overwritten so create an alias
	var config = this;
	// Function to build the mighty config window :)
	function buildConfigWin(body, head) {
		var create = config.create,
			fields = config.fields,
			configId = config.id,
			bodyWrapper = create('div', {
				id: configId + '_wrapper'
			});
		// Append the style which is our default style plus the user style
		head.appendChild(
			create('style', {
				type: 'text/css',
				textContent: config.css.basic + config.css.stylish
			}));
		// Add header and title
		bodyWrapper.appendChild(create('div', {
			id: configId + '_header',
			className: 'config_header block center'
		}, config.title));
		// Append elements
		var section = bodyWrapper,
			secNum = 0; // Section count
		// loop through fields
		for (var id in fields) {
			var field = fields[id],
				settings = field.settings;
			if (settings.section) { // the start of a new section
				section = bodyWrapper.appendChild(create('div', {
					className: 'section_header_holder',
					id: configId + '_section_' + secNum
				}));
				if (Object.prototype.toString.call(settings.section) !== '[object Array]')
					settings.section = [settings.section];
				if (settings.section[0])
					section.appendChild(create('div', {
						className: 'section_header center',
						id: configId + '_section_header_' + secNum
					}, settings.section[0]));
				if (settings.section[1])
					section.appendChild(create('p', {
						className: 'section_desc center',
						id: configId + '_section_desc_' + secNum
					}, settings.section[1]));
				++secNum;
			}
			// Create field elements and append to current section
			section.appendChild((field.wrapper = field.toNode()));
		}
		// Add save and close buttons
		bodyWrapper.appendChild(
			create('div', {
				id: configId + '_buttons_holder'
			}, create('button', {
				id: configId + '_saveBtn',
				textContent: 'Save',
				title: 'Save settings',
				className: 'saveclose_buttons',
				onclick: function() {
					config.save()
				}
			}), create('button', {
				id: configId + '_closeBtn',
				textContent: 'Close',
				title: 'Close window',
				className: 'saveclose_buttons',
				onclick: function() {
					config.close()
				}
			}), create('div', {
				className: 'reset_holder block'
			}, create('a', { // Reset link
				id: configId + '_resetLink',
				textContent: 'Reset to defaults',
				href: '#',
				title: 'Reset fields to default values',
				className: 'reset',
				onclick: function(e) {
					e.preventDefault();
					config.reset()
				}
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
		window.addEventListener('beforeunload', function() {
			config.close();
		}, false);
		// Now that everything is loaded, make it visible
		config.frame.style.display = "block";
		config.isOpen = true;
	}
	// Change this in the onOpen callback using this.frame.setAttribute('style', '')
	var defaultStyle = 'bottom: auto; border: 1px solid #000; display: none; height: 75%;' +
		' left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0;' +
		' overflow: auto; padding: 0; position: fixed; right: auto; top: 0;' +
		' width: 75%; z-index: 9999;';
	// Either use the element passed to init() or create an iframe
	if (this.frame) {
		this.frame.id = this.id; // Allows for prefixing styles with the config id
		this.frame.setAttribute('style', defaultStyle);
		var head = this.frame.ownerDocument.getElementsByTagName('head')[0];
		if (this.srcs && this.srcs.length > 0 ) {
			this.srcs.forEach(function(src) {
				head.appendChild(this.create('script', {src: src}));
			})
		}
		buildConfigWin(this.frame, head);
	} else {
		// Create frame
		document.body.appendChild((this.frame = this.create('iframe', {
			id: this.id,
			style: defaultStyle
		})));
		// In WebKit src can't be set until it is added to the page
		this.frame.src = 'about:blank';
		// we wait for the iframe to load before we can modify it
		this.frame.addEventListener('load', function(e) {
			var frame = config.frame;
			var body = frame.contentDocument.getElementsByTagName('body')[0];
			body.id = config.id; // Allows for prefixing styles with the config id
			var head = frame.contentDocument.getElementsByTagName('head')[0];
			if (config.src) head.appendChild(config.create('script', {src: config.src}));
			if (config.srcs && config.srcs.length > 0 ) {
				config.srcs.forEach(function(src) {
					head.appendChild(config.create('script', {src: src}));
				})
			}
			buildConfigWin(body, head);
		}, false);
	}
};