// ==UserScript==
// @name         escgo! colors in webchat - legacy
// @version      0.7.6
// @description  Adds an option to make text bold/italic?/underlined/colorful in the escgo! chat. I tried to keep it as ES5-friendly as possible.
// @author       Andrei Felix
// @match        http://www.escgo.com/wp-content/uploads/euwebirc-master/static/qui.html
// @match        http://www.escgo.com/wp-content/uploads/euwebirc-master2/static/qui.html
// @match        http://webchat.euirc.net/
// @icon         http://www.escgo.com/wp-content/uploads/2017/04/cropped-escgologolarge-32x32.png
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/868721
// @downloadURL https://update.greasyfork.org/scripts/439681/escgo%21%20colors%20in%20webchat%20-%20legacy.user.js
// @updateURL https://update.greasyfork.org/scripts/439681/escgo%21%20colors%20in%20webchat%20-%20legacy.meta.js
// ==/UserScript==

(function() {
	// this function waits until it can find the box you type stuff in
	// couldn't risk using querySelector, apparently it's a 2013 thing
	function getTextBox(fn) {
		var result = document.getElementsByClassName("keyboard-input")[0];
		if (result === undefined) {
			window.setTimeout(function() { getTextBox(fn); }, 1000);
			return;
		}
		fn(result);
	}
	
	// this adds a style element containing everything needed for this script
	// TODO: check whether getComputedStyle works on older browsers
	// no template literals = :(
	function addCustomCss() {
		var ircStyle = getComputedStyle(document.getElementsByClassName("lines")[0]);
		var bgColor = ircStyle.backgroundColor;
		var fgColor = ircStyle.color;
		ircStyle = getComputedStyle(document.getElementsByClassName("bottomboundpanel")[0]);
		var bdColor = ircStyle.borderTopColor;
		ircStyle = getComputedStyle(document.getElementsByClassName("tab-selected")[0]);
		var btnColor = ircStyle.backgroundColor;
		var customCss = ".qwebirc-qui.bottomboundpanel form{padding-left:1.3em;padding-right:2px} " +
			".qwebirc-qui .input input.keyboard-input{padding-left:2px} " +
			"#formatArea{position:absolute;width:1.2em;height:1.2em;left:0;top:0;bottom:0;margin:0;padding:0} " +
			"#formatBtn{position:relative;width:100%;height:100%;left:0;top:0;text-align:center;" +
			"background:" + btnColor + ";font-weight:bold;font-style:italic;text-decoration:underline;color:cyan;cursor:default} " +
			"#formatMenu{display:none;position:absolute;top:auto;left:0;bottom:100%;padding:0.1em 0 0.1em 0.3em;" +
			"border:1px " + bdColor + " solid;background:" + bgColor + ";white-space:nowrap;font-size:85%;text-align:left} " +
			"#formatMenu .colourline{display:inline-block;white-space:nowrap} " +
			"#formatArea:focus #formatMenu,#formatArea:focus-within #formatMenu,#formatArea:hover #formatMenu,#formatMenu.forceOpen{display:block} " +
			".formatLabel{color:" + fgColor + ";margin-right:0.1em;margin-bottom:0.1em;line-height:1} " +
			".formatStyleBtn{display:inline-block;opacity:0.9;background:#cccccc;color:black;font-size:95%;text-align:center;" +
			"margin-right:0.3em;margin-bottom:0.1em;padding:0.2em;width:1.2em;height:1.2em;border:1px #666666 solid;user-select:none;" +
			"vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;cursor:default} " +
			".formatStyleBtn:hover{opacity:1;outline:2px " + fgColor + " solid;outline-offset:-1px} " +
			".formatStyleBtn:active{opacity:0.65} " +
			".colourline .formatStyleBtn{opacity:1} " +
			"#formatBoldBtn{font-weight:bold} " +
			"#formatItalicBtn{font-style:italic} " +
			"#formatUnderlineBtn{text-decoration:underline} " +
			"#formatMenu #formatColorAdvanced.colourline{display:none;padding-left:1.95em} " +
			"#formatColorPreview{padding:2px;width:8.87em;height:1.2em;border:1px #666666 solid;margin-right:0.3em;margin-bottom:0.1em;text-align:center} " +
			".formatColorPicked{background:transparent;outline:2px " + fgColor + " none;outline-offset: -1px} " +
			"#formatMenu .Xc99,#formatMenu .XcDef.XbcDef.invertDef{color:" + fgColor + "} " +
			"#formatMenu .Xbc99{background:transparent}" +
			"#formatMenu .XcDef{color:" + bgColor + "} " +
			"#formatMenu .XbcDef,#formatMenu #formatColorFg.Xbc99{background:" + fgColor + "} " +
			"#formatMenu .XcDef.XbcDef.invertDef{background:" + bgColor + "}";
		var cuCss = document.createElement("style");
		cuCss.innerHTML = customCss;
		document.head.appendChild(cuCss);
	}
	
	// this creates labels in my little formatting menu
	function createFormatMenuLabel(text, inline) {
		var label = document.createElement("div");
		label.className = "formatLabel";
		if (inline) label.style.display = "inline-block";
		label.textContent = text;
		return label;
	}
	
	// this is a template used for buttons that affect formatting in some way
	// can't use classList
	function createFormatStyleButton(textBox, text, tooltip, id, delim, param, classes, picker, pickerCompat) {
		var button = document.createElement("div");
		button.className = "formatStyleBtn";
		classes.forEach(function(cl) { button.className += " " + cl; });
		if (id) button.id = id;
		if (tooltip) button.title = tooltip;
		button.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (!pickerCompat || !e.shiftKey) { // buttons that are incompatible with the "picker" will cancel it
				picker.disable();
				var ss = textBox.selectionStart;
				var se = textBox.selectionEnd;
				var endTag = delim;
				if (ss == se) endTag = "";
				var currValue = textBox.value;
				textBox.value = currValue.slice(0, ss) + delim + param + currValue.slice(ss, se) + endTag + currValue.slice(se);
				textBox.selectionStart = textBox.selectionEnd = se + delim.length + param.length + endTag.length;
				textBox.focus();
			}
			else if (e.shiftKey) picker.setColor(parseInt(param));
		});
		button.textContent = text;
		return button;
	}
	
	// custom function because padStart is a fairly new addition to ECMAScript
	// I'm forcing double digits because they're more predictable,
	// especially when posting stuff that already begins with a number,
	// such as chat results
	// some linter told me "" + number was bad
	function compatiblePad2(number) {
		if (number < 10) return "0" + number;
		return String(number);
	}
	
	// advanced color selection UI ("picker") activated by holding Shift
	// this allows simultaneous entry of a foreground and a background color
	function advancedPicker(textBox, formatMenu) {
		var preview, okBtn, cancelBtn, fgShow, bgShow, that = this;
		var colorBoxClasses = "formatStyleBtn formatColorPicked";
		var defaultColorClasses = "formatStyleBtn XcDef XbcDef";
		
		// these properties describe the state of the "picker"
		this.selection = null;
		this.fg = null;
		this.bg = null;
		this.btn99 = null;
		
		// the following lines describe the UI for the "picker"
		this.DOM = document.createElement("div");
		this.DOM.id = "formatColorAdvanced";
		this.DOM.className = "colourline";
		this.DOM.appendChild(createFormatMenuLabel("Advanced:", false));
		
		okBtn = document.createElement("div");
		okBtn.className = "formatStyleBtn";
		okBtn.textContent = "OK";
		okBtn.style.width = "3.39em";
		this.DOM.appendChild(okBtn);
		
		cancelBtn = document.createElement("div");
		cancelBtn.className = "formatStyleBtn";
		cancelBtn.textContent = "Cancel";
		cancelBtn.style.width = "5em";
		this.DOM.appendChild(cancelBtn);
		
		preview = document.createElement("div");
		preview.id = "formatColorPreview";
		preview.textContent = "Preview";
		this.DOM.appendChild(preview);
		
		this.DOM.appendChild(createFormatMenuLabel("Fore:", true));
		
		fgShow = document.createElement("div");
		fgShow.className = colorBoxClasses;
		fgShow.id = "formatColorFg";
		this.DOM.appendChild(fgShow);
		
		this.DOM.appendChild(createFormatMenuLabel("Back:", true));
		
		bgShow = document.createElement("div");
		bgShow.className = colorBoxClasses;
		this.DOM.appendChild(bgShow);
		
		// the "picker" submits when releasing Shift
		// this is equivalent to clicking OK (while holding said Shift)
		// the "picker" can be canceled by clicking Cancel (as seen further down below)
		var shiftUpFn = function (e) {
			if (!e || e.key === "Shift" || e.which === 16) {
				var delim = "\x03";
				var param = compatiblePad2(that.fg);
				if (that.bg !== null) param += "," + compatiblePad2(that.bg);
				var ss = textBox.selectionStart;
				var se = textBox.selectionEnd;
				var endTag = delim;
				if (ss == se) endTag = "";
				var currValue = textBox.value;
				textBox.value = currValue.slice(0, ss) + delim + param + currValue.slice(ss, se) + endTag + currValue.slice(se);
				textBox.selectionStart = textBox.selectionEnd = se + delim.length + param.length + endTag.length;
				that.disable();
				textBox.focus();
			}
		}
		
		// the "picker" is canceled if the window loses focus
		var blurFn = function (e) { that.disable(); textBox.focus(); }
		
		this.set99 = function(button) { this.btn99 = button; }
		
		// this initializes the "picker" if it's not initialized
		this.enable = function() {
			if (this.selection === null) {
				this.DOM.style.display = "inline-block";
				this.selection = 1;
				formatMenu.className = "forceOpen";
				fgShow.style.outlineStyle = "solid";
				this.btn99.className = defaultColorClasses;
				window.addEventListener("keyup", shiftUpFn);
				window.addEventListener("blur", blurFn);
			}
		}
		
		// this restores the "picker" to its original state
		this.disable = function() {
			this.DOM.style.display = "";
			this.selection = this.fg = this.bg = null;
			formatMenu.className = "";
			fgShow.style.outlineStyle = "";
			fgShow.className = colorBoxClasses;
			bgShow.style.outlineStyle = "";
			bgShow.className = colorBoxClasses;
			preview.className = "";
			this.btn99.className = defaultColorClasses;
			window.removeEventListener("keyup", shiftUpFn);
			window.removeEventListener("blur", blurFn);
		}
		
		// normally, after choosing a foreground color,
		// the "picker" expects a background color,
		// but this allows users to set the focus back to the
		// foreground color if needed
		this.switch = function (boxIndex) {
			if (boxIndex == 1) {
				this.selection = 1;
				fgShow.style.outlineStyle = "solid";
				bgShow.style.outlineStyle = "";
				this.btn99.className = defaultColorClasses;
			}
			else {
				this.selection = 2;
				fgShow.style.outlineStyle = "";
				bgShow.style.outlineStyle = "solid";
				this.btn99.className = defaultColorClasses + " invertDef";
			}
			textBox.focus();
		}
		
		// this effectively registers a color selection
		this.setColor = function (color) {
			this.enable();
			if (this.selection == 1) {
				this.fg = color;
				fgShow.className = colorBoxClasses + " Xbc" + color;
				this.switch(2);
			}
			else {
				this.bg = color;
				bgShow.className = colorBoxClasses + " Xbc" + color;
				this.switch(1);
			}
			preview.className = "Xc" + this.fg + " Xbc" + this.bg;
		}
		
		// this makes the "picker" buttons work
		okBtn.addEventListener("click", function() { shiftUpFn(); });
		cancelBtn.addEventListener("click", function() { blurFn(); });
		fgShow.addEventListener("click", function() { that.switch(1); });
		bgShow.addEventListener("click", function() { that.switch(2); });
	}
	
	// this creates the formatting menu; it appears when hovering over the A
	function constructFormatMenu(textBox) {
		var formatMenu = document.createElement("div");
		formatMenu.id = "formatMenu";
		formatMenu.className = "dropdownmenu";
		var picker = new advancedPicker(textBox, formatMenu);
		
		// "B", "I", "U", "N" buttons; "N" negates every other tag
		// unlike the web chat, mIRC does recognize italic text
		// TODO: the status of "I" is subject to consideration, ask
		var fontStyleLabel = createFormatMenuLabel("Font style:", true);
		fontStyleLabel.style.width = "5.75em";
		formatMenu.appendChild(fontStyleLabel);
		formatMenu.appendChild(createFormatStyleButton(textBox, "B", "bold", "formatBoldBtn", "\x02", "", [], picker, false));
		formatMenu.appendChild(createFormatStyleButton(textBox, "I?", "italic?", "formatItalicBtn", "\x1D", "", [], picker, false));
		formatMenu.appendChild(createFormatStyleButton(textBox, "U", "underline", "formatUnderlineBtn", "\x1F", "", [], picker, false));
		formatMenu.appendChild(createFormatStyleButton(textBox, "N", "normal", undefined, "\x0F", "", [], picker, false));
		formatMenu.appendChild(document.createElement("br"));
		
		// I added tooltips because colors are confusing
		// "dark" gray is darker in mIRC, but lighter in browsers
		// the numbers help with readability
		// 0 = color code is shown in white
		// 1 = color code is shown in black
		var colors = [
			["white", 1],
			["black", 0],
			["dark blue", 0],
			["green", 0],
			["red", 0],
			["dark red", 0],
			["purple", 0],
			["orange", 1],
			["yellow", 1],
			["light green", 0],
			["teal", 0],
			["cyan", 1],
			["blue", 0],
			["fuchsia", 0],
			["\"dark\" gray", 1],
			["gray", 0]
		];
		
		// dummy element because I don't want to redefine the colors
		var dummyColourline = document.createElement("div");
		dummyColourline.className = "colourline";
		dummyColourline.appendChild(createFormatMenuLabel("Font colour:", false));
		
		// this is where the color buttons are actually created
		colors.forEach(function (color, back) {
			var desc = color[0], fore = color[1];
			if ((back != 0) && (back % 6 == 0)) dummyColourline.appendChild(document.createElement("br"));
			dummyColourline.appendChild(createFormatStyleButton(textBox, String(back), desc, undefined, "\x03", compatiblePad2(back), ["Xc" + fore, "Xbc" + back], picker, true));
		});
		
		// 2 extra buttons for default formatting + just the symbol
		var defaultStyleBtn = createFormatStyleButton(textBox, "99", "default", undefined, "\x03", "99", ["XcDef", "XbcDef"], picker, true);
		picker.set99(defaultStyleBtn);
		dummyColourline.appendChild(defaultStyleBtn);
		dummyColourline.appendChild(createFormatStyleButton(textBox, "\u2514", "reset/manual entry", undefined, "\x03", "", [], picker, false));
		
		formatMenu.appendChild(dummyColourline);
		formatMenu.appendChild(picker.DOM);
		return formatMenu;
	}
	
	// this adds the formatting menu to the DOM once the textbox is found
	getTextBox(function(textBox) {
		addCustomCss();
		
		var contForm = textBox.parentElement;
		var contDiv = contForm.parentElement;
		
		var formatArea = document.createElement("div");
		formatArea.id = "formatArea";
		
		var formatBtn = document.createElement("div");
		formatBtn.id = "formatBtn";
		formatBtn.textContent = "A";
		
		formatArea.appendChild(formatBtn);
		formatArea.appendChild(constructFormatMenu(textBox));
		
		contDiv.insertBefore(formatArea, contForm);
	});
})();