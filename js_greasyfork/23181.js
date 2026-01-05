/*! This library combines:
 * - colors.js 
 * - colorPicker.data.js
 * - colorPicker.js
 * - javascript_implementation/jsColor.js
 * From latest commit 41d780c on May 31, 2016
 */
/** jsColor Picker (https://github.com/PitPik/colorPicker)
 * MIT license
 * This library contains the following files from that same repository:
 * - colors.js
 * - colorPicker.data.js
 * - colorPicker.js
 * - javascript_implementation/jsColor.js
 */
/*! colors.js */
;(function(window, undefined){
	"use strict"

	var _valueRanges = {
			rgb:   {r: [0, 255], g: [0, 255], b: [0, 255]},
			hsv:   {h: [0, 360], s: [0, 100], v: [0, 100]},
			hsl:   {h: [0, 360], s: [0, 100], l: [0, 100]},
			cmy:   {c: [0, 100], m: [0, 100], y: [0, 100]},
			cmyk:  {c: [0, 100], m: [0, 100], y: [0, 100], k: [0, 100]},
			Lab:   {L: [0, 100], a: [-128, 127], b: [-128, 127]},
			XYZ:   {X: [0, 100], Y: [0, 100], Z: [0, 100]},
			alpha: {alpha: [0, 1]},
			HEX:   {HEX: [0, 16777215]} // maybe we don't need this
		},

		_instance = {},
		_colors = {},

		// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html for more
		XYZMatrix = { // Observer = 2° (CIE 1931), Illuminant = D65
			X: [ 0.4124564,  0.3575761,  0.1804375],
			Y: [ 0.2126729,  0.7151522,  0.0721750],
			Z: [ 0.0193339,  0.1191920,  0.9503041],
			R: [ 3.2404542, -1.5371385, -0.4985314],
			G: [-0.9692660,  1.8760108,  0.0415560],
			B: [ 0.0556434, -0.2040259,  1.0572252]
		},
		grey = {r: 0.298954, g: 0.586434, b: 0.114612}, // CIE-XYZ 1931
		luminance = {r: 0.2126, g: 0.7152, b: 0.0722}, // W3C 2.0

		_math = window.Math,
		_parseint = window.parseInt,

		Colors = window.Colors = function(options) {
			this.colors = {RND: {}};
			this.options = {
				color: 'rgba(204, 82, 37, 0.8)', // init value(s)...
				XYZMatrix: XYZMatrix,
				// XYZReference: {},
				grey: grey,
				luminance: luminance,
				valueRanges: _valueRanges
				// customBG: '#808080'
				// convertCallback: undefined,
				// allMixDetails: false
			};
			initInstance(this, options || {});
		},
		initInstance = function(THIS, options) {
			var matrix,
				importColor,
				_options = THIS.options,
				customBG;

			focusInstance(THIS);
			for (var option in options) {
				if (options[option] !== undefined) _options[option] = options[option];
			}
			matrix = _options.XYZMatrix;
			if (!options.XYZReference) _options.XYZReference = {
				X: matrix.X[0] + matrix.X[1] + matrix.X[2],
				Y: matrix.Y[0] + matrix.Y[1] + matrix.Y[2],
				Z: matrix.Z[0] + matrix.Z[1] + matrix.Z[2]
			};
			customBG = _options.customBG;
			_options.customBG = (typeof customBG === 'string') ? ColorConverter.txt2color(customBG).rgb : customBG;
			_colors = setColor(THIS.colors, _options.color, undefined, true); // THIS.colors = _colors =
		},
		focusInstance = function(THIS) {
			if (_instance !== THIS) {
				_instance = THIS;
				_colors = THIS.colors;
			}
		};

	Colors.prototype.setColor = function(newCol, type, alpha) {
		focusInstance(this);
		if (newCol) {
			return setColor(this.colors, newCol, type, undefined, alpha);
		} else {
			if (alpha !== undefined) {
				this.colors.alpha = limitValue(alpha, 0, 1);
			}
			return convertColors(type);
		}
	};

	Colors.prototype.getColor = function(type) {
		var result = this.colors, n = 0;

		if (type) {
			type = type.split('.');
			while (result[type[n]]) {
				result = result[type[n++]];
			}
			if (type.length !== n) {
				result = undefined;
			}
		}
		return result;
	};

	Colors.prototype.setCustomBackground = function(col) { // wild gues,... check again...
		focusInstance(this); // needed???
		this.options.customBG = (typeof col === 'string') ? ColorConverter.txt2color(col).rgb : col;
		// return setColor(this.colors, this.options.customBG, 'rgb', true); // !!!!RGB
		return setColor(this.colors, undefined, 'rgb'); // just recalculate existing
	};

	Colors.prototype.saveAsBackground = function() { // alpha
		focusInstance(this); // needed???
		// return setColor(this.colors, this.colors.RND.rgb, 'rgb', true);
		return setColor(this.colors, undefined, 'rgb', true);
	};

	Colors.prototype.convertColor = function(color, type) {
		var convert = ColorConverter,
			ranges = _valueRanges,
			types = type.split('2'),
			fromType = types[0],
			toType = types[1],
			test = /(?:RG|HS|CM|LA)/,
			normalizeFrom = test.test(fromType),
			normalizeTo = test.test(toType),
			exceptions = {LAB: 'Lab'},
			normalize = function(color, type, reverse) {
				var result = {},
					Lab = type === 'Lab' ? 1 : 0;

				for (var n in color) { // faster (but bigger) way: if/else outside 2 for loops
					result[n] = reverse ?
						_math.round(color[n] * (Lab || ranges[type][n][1])) :
						color[n] / (Lab || ranges[type][n][1]);
				}

				return result;
			};

		fromType = ranges[fromType] ? fromType : exceptions[fromType] || fromType.toLowerCase();
		toType = ranges[toType] ? toType : exceptions[toType] || toType.toLowerCase();

		if (normalizeFrom && type !== 'RGB2HEX') { // from ABC to abc
			color = normalize(color, fromType);
		}
		color = fromType === toType ? color : ( // same type; returns same/normalized version
			convert[fromType + '2' + toType] ? convert[fromType + '2' + toType](color, true) : // existing converter
			toType === 'HEX' ? convert.RGB2HEX(type === 'RGB2HEX' ? color : normalize(fromType === 'rgb' ? color :
				convert[fromType + '2rgb'](color, true), 'rgb', true)) :
			convert['rgb2' + toType](convert[fromType + '2rgb'](color, true), true) // not in ColorConverter
		);
		if (normalizeTo) { // from abc to ABC
			color = normalize(color, toType, true);
		}

		return color;
	};

	Colors.prototype.toString = function(colorMode, forceAlpha) {
		return ColorConverter.color2text((colorMode || 'rgb').toLowerCase(), this.colors, forceAlpha);
	};


	// ------------------------------------------------------ //
	// ---------- Color calculation related stuff  ---------- //
	// -------------------------------------------------------//

	function setColor(colors, color, type, save, alpha) { // color only full range
		if (typeof color === 'string') {
			var color = ColorConverter.txt2color(color); // new object
			type = color.type;
			_colors[type] = color[type];
			alpha = alpha !== undefined ? alpha : color.alpha;
		} else if (color) {
			for (var n in color) {
				colors[type][n] = type === 'Lab' ?
				limitValue(color[n], _valueRanges[type][n][0], _valueRanges[type][n][1]) :
				limitValue(color[n] / _valueRanges[type][n][1], 0 , 1);
			}
		}
		if (alpha !== undefined) {
			colors.alpha = limitValue(+alpha, 0, 1);
		}
		return convertColors(type, save ? colors : undefined);
	}

	function saveAsBackground(RGB, rgb, alpha) {
		var grey = _instance.options.grey,
			color = {};

		color.RGB = {r: RGB.r, g: RGB.g, b: RGB.b};
		color.rgb = {r: rgb.r, g: rgb.g, b: rgb.b};
		color.alpha = alpha;
		// color.RGBLuminance = getLuminance(RGB);
		color.equivalentGrey = _math.round(grey.r * RGB.r + grey.g * RGB.g + grey.b * RGB.b);

		color.rgbaMixBlack = mixColors(rgb, {r: 0, g: 0, b: 0}, alpha, 1);
		color.rgbaMixWhite = mixColors(rgb, {r: 1, g: 1, b: 1}, alpha, 1);
		color.rgbaMixBlack.luminance = getLuminance(color.rgbaMixBlack, true);
		color.rgbaMixWhite.luminance = getLuminance(color.rgbaMixWhite, true);

		if (_instance.options.customBG) {
			color.rgbaMixCustom = mixColors(rgb, _instance.options.customBG, alpha, 1);
			color.rgbaMixCustom.luminance = getLuminance(color.rgbaMixCustom, true);
			_instance.options.customBG.luminance = getLuminance(_instance.options.customBG, true);
		}

		return color;
	}

	function convertColors(type, colorObj) {
		// console.time('convertColors');
		var _Math = _math,
			colors = colorObj || _colors,
			convert = ColorConverter,
			options = _instance.options,
			ranges = _valueRanges,
			RND = colors.RND,
			// type = colorType, // || _mode.type,
			modes, mode = '', from = '', // value = '',
			exceptions = {hsl: 'hsv', cmyk: 'cmy', rgb: type},
			RGB = RND.rgb, SAVE, SMART;

		if (type !== 'alpha') {
			for (var typ in ranges) {
				if (!ranges[typ][typ]) { // no alpha|HEX
					if (type !== typ && typ !== 'XYZ') {
						from = exceptions[typ] || 'rgb';
						colors[typ] = convert[from + '2' + typ](colors[from]);
					}

					if (!RND[typ]) RND[typ] = {};
					modes = colors[typ];
					for(mode in modes) {
						RND[typ][mode] = _Math.round(modes[mode] * (typ === 'Lab' ? 1 : ranges[typ][mode][1]));
					}
				}
			}
			if (type !== 'Lab') {
				delete colors._rgb;
			}

			RGB = RND.rgb;
			colors.HEX = convert.RGB2HEX(RGB);
			colors.equivalentGrey =
				options.grey.r * colors.rgb.r +
				options.grey.g * colors.rgb.g +
				options.grey.b * colors.rgb.b;
			colors.webSave = SAVE = getClosestWebColor(RGB, 51);
			// colors.webSave.HEX = convert.RGB2HEX(colors.webSave);
			colors.webSmart = SMART = getClosestWebColor(RGB, 17);
			// colors.webSmart.HEX = convert.RGB2HEX(colors.webSmart);
			colors.saveColor =
				RGB.r === SAVE.r && RGB.g === SAVE.g && RGB.b === SAVE.b  ? 'web save' :
				RGB.r === SMART.r && RGB.g === SMART.g && RGB.b === SMART.b  ? 'web smart' : '';
			colors.hueRGB = convert.hue2RGB(colors.hsv.h);

			if (colorObj) {
				colors.background = saveAsBackground(RGB, colors.rgb, colors.alpha);
			}
		} // else RGB = RND.rgb;

		var rgb = colors.rgb, // for better minification...
			alpha = colors.alpha,
			luminance = 'luminance',
			background = colors.background,
			rgbaMixBlack, rgbaMixWhite, rgbaMixCustom,
			rgbaMixBG, rgbaMixBGMixBlack, rgbaMixBGMixWhite, rgbaMixBGMixCustom,
			_mixColors = mixColors,
			_getLuminance = getLuminance,
			_getWCAG2Ratio = getWCAG2Ratio,
			_getHueDelta = getHueDelta;

		rgbaMixBlack = _mixColors(rgb, {r: 0, g: 0, b: 0}, alpha, 1);
		rgbaMixBlack[luminance] = _getLuminance(rgbaMixBlack, true);
		colors.rgbaMixBlack = rgbaMixBlack;

		rgbaMixWhite = _mixColors(rgb, {r: 1, g: 1, b: 1}, alpha, 1);
		rgbaMixWhite[luminance] = _getLuminance(rgbaMixWhite, true);
		colors.rgbaMixWhite = rgbaMixWhite;

		if (options.allMixDetails) {
			rgbaMixBlack.WCAG2Ratio = _getWCAG2Ratio(rgbaMixBlack[luminance], 0);
			rgbaMixWhite.WCAG2Ratio = _getWCAG2Ratio(rgbaMixWhite[luminance], 1);

			if (options.customBG) {
				rgbaMixCustom = _mixColors(rgb, options.customBG, alpha, 1);
				rgbaMixCustom[luminance] = _getLuminance(rgbaMixCustom, true);
				rgbaMixCustom.WCAG2Ratio = _getWCAG2Ratio(rgbaMixCustom[luminance], options.customBG[luminance]);
				colors.rgbaMixCustom = rgbaMixCustom;
			}

			rgbaMixBG = _mixColors(rgb, background.rgb, alpha, background.alpha);
			rgbaMixBG[luminance] = _getLuminance(rgbaMixBG, true); // ?? do we need this?
			colors.rgbaMixBG = rgbaMixBG;

			rgbaMixBGMixBlack = _mixColors(rgb, background.rgbaMixBlack, alpha, 1);
			rgbaMixBGMixBlack[luminance] = _getLuminance(rgbaMixBGMixBlack, true);
			rgbaMixBGMixBlack.WCAG2Ratio = _getWCAG2Ratio(rgbaMixBGMixBlack[luminance],
				background.rgbaMixBlack[luminance]);
			/* ------ */
			rgbaMixBGMixBlack.luminanceDelta = _Math.abs(
				rgbaMixBGMixBlack[luminance] - background.rgbaMixBlack[luminance]);
			rgbaMixBGMixBlack.hueDelta = _getHueDelta(background.rgbaMixBlack, rgbaMixBGMixBlack, true);
			/* ------ */
			colors.rgbaMixBGMixBlack = rgbaMixBGMixBlack;

			rgbaMixBGMixWhite = _mixColors(rgb, background.rgbaMixWhite, alpha, 1);
			rgbaMixBGMixWhite[luminance] = _getLuminance(rgbaMixBGMixWhite, true);
			rgbaMixBGMixWhite.WCAG2Ratio = _getWCAG2Ratio(rgbaMixBGMixWhite[luminance],
				background.rgbaMixWhite[luminance]);
			/* ------ */
			rgbaMixBGMixWhite.luminanceDelta = _Math.abs(
				rgbaMixBGMixWhite[luminance] - background.rgbaMixWhite[luminance]);
			rgbaMixBGMixWhite.hueDelta = _getHueDelta(background.rgbaMixWhite, rgbaMixBGMixWhite, true);
			/* ------ */
			colors.rgbaMixBGMixWhite = rgbaMixBGMixWhite;
		}

		if (options.customBG) {
			rgbaMixBGMixCustom = _mixColors(rgb, background.rgbaMixCustom, alpha, 1);
			rgbaMixBGMixCustom[luminance] = _getLuminance(rgbaMixBGMixCustom, true);
			rgbaMixBGMixCustom.WCAG2Ratio = _getWCAG2Ratio(rgbaMixBGMixCustom[luminance],
				background.rgbaMixCustom[luminance]);
			colors.rgbaMixBGMixCustom = rgbaMixBGMixCustom;
			/* ------ */
			rgbaMixBGMixCustom.luminanceDelta = _Math.abs(
				rgbaMixBGMixCustom[luminance] - background.rgbaMixCustom[luminance]);
			rgbaMixBGMixCustom.hueDelta = _getHueDelta(background.rgbaMixCustom, rgbaMixBGMixCustom, true);
			/* ------ */
		}

		colors.RGBLuminance = _getLuminance(RGB);
		colors.HUELuminance = _getLuminance(colors.hueRGB);

		// renderVars.readyToRender = true;
		if (options.convertCallback) {
			options.convertCallback(colors, type); //, convert); //, _mode);
		}

		// console.timeEnd('convertColors')
		// if (colorObj)
		return colors;
	}


	// ------------------------------------------------------ //
	// ------------------ color conversion ------------------ //
	// -------------------------------------------------------//

	var ColorConverter = {
		txt2color: function(txt) {
			var color = {},
				parts = txt.replace(/(?:#|\)|%)/g, '').split('('),
				values = (parts[1] || '').split(/,\s*/),
				type = parts[1] ? parts[0].substr(0, 3) : 'rgb',
				m = '';

			color.type = type;
			color[type] = {};
			if (parts[1]) {
				for (var n = 3; n--; ) {
					m = type[n] || type.charAt(n); // IE7
					color[type][m] = +values[n] / _valueRanges[type][m][1];
				}
			} else {
				color.rgb = ColorConverter.HEX2rgb(parts[0]);
			}
			// color.color = color[type];
			color.alpha = values[3] ? +values[3] : 1;

			return color;
		},

		color2text: function(colorMode, colors, forceAlpha) {
			var alpha = forceAlpha !== false && _math.round(colors.alpha * 100) / 100,
				hasAlpha = typeof alpha === 'number' &&
					forceAlpha !== false && (forceAlpha || alpha !== 1),
				RGB = colors.RND.rgb,
				HSL = colors.RND.hsl,
				shouldBeHex = colorMode === 'hex' && hasAlpha,
				isHex = colorMode === 'hex' && !shouldBeHex,
				isRgb = colorMode === 'rgb' || shouldBeHex,
				innerText = isRgb ? RGB.r + ', ' + RGB.g + ', ' + RGB.b :
					!isHex ? HSL.h + ', ' + HSL.s + '%, ' + HSL.l + '%' :
					'#' + colors.HEX;

			return isHex ? innerText : (shouldBeHex ? 'rgb' : colorMode) + 
					(hasAlpha ? 'a' : '') + '(' + innerText + (hasAlpha ? ', ' + alpha : '') + ')';
		},

		RGB2HEX: function(RGB) {
			return (
				(RGB.r < 16 ? '0' : '') + RGB.r.toString(16) +
				(RGB.g < 16 ? '0' : '') + RGB.g.toString(16) +
				(RGB.b < 16 ? '0' : '') + RGB.b.toString(16)
			).toUpperCase();
		},

		HEX2rgb: function(HEX) {
			HEX = HEX.split(''); // IE7
			return {
				r: +('0x' + HEX[0] + HEX[HEX[3] ? 1 : 0]) / 255,
				g: +('0x' + HEX[HEX[3] ? 2 : 1] + (HEX[3] || HEX[1])) / 255,
				b: +('0x' + (HEX[4] || HEX[2]) + (HEX[5] || HEX[2])) / 255
			};
		},

		hue2RGB: function(hue) {
			var _Math = _math,
				h = hue * 6,
				mod = ~~h % 6, // Math.floor(h) -> faster in most browsers
				i = h === 6 ? 0 : (h - mod);

			return {
				r: _Math.round([1, 1 - i, 0, 0, i, 1][mod] * 255),
				g: _Math.round([i, 1, 1, 1 - i, 0, 0][mod] * 255),
				b: _Math.round([0, 0, i, 1, 1, 1 - i][mod] * 255)
			};
		},

		// ------------------------ HSV ------------------------ //

		rgb2hsv: function(rgb) { // faster
			var _Math = _math,
				r = rgb.r,
				g = rgb.g,
				b = rgb.b,
				k = 0, chroma, min, s;

			if (g < b) {
				g = b + (b = g, 0);
				k = -1;
			}
			min = b;
			if (r < g) {
				r = g + (g = r, 0);
				k = -2 / 6 - k;
				min = _Math.min(g, b); // g < b ? g : b; ???
			}
			chroma = r - min;
			s = r ? (chroma / r) : 0;
			return {
				h: s < 1e-15 ? ((_colors && _colors.hsl && _colors.hsl.h) || 0) :
					chroma ? _Math.abs(k + (g - b) / (6 * chroma)) : 0,
				s: r ? (chroma / r) : ((_colors && _colors.hsv && _colors.hsv.s) || 0), // ??_colors.hsv.s || 0
				v: r
			};
		},

		hsv2rgb: function(hsv) {
			var h = hsv.h * 6,
				s = hsv.s,
				v = hsv.v,
				i = ~~h, // Math.floor(h) -> faster in most browsers
				f = h - i,
				p = v * (1 - s),
				q = v * (1 - f * s),
				t = v * (1 - (1 - f) * s),
				mod = i % 6;

			return {
				r: [v, q, p, p, t, v][mod],
				g: [t, v, v, q, p, p][mod],
				b: [p, p, t, v, v, q][mod]
			};
		},

		// ------------------------ HSL ------------------------ //

		hsv2hsl: function(hsv) {
			var l = (2 - hsv.s) * hsv.v,
				s = hsv.s * hsv.v;

			s = !hsv.s ? 0 : l < 1 ? (l ? s / l : 0) : s / (2 - l);

			return {
				h: hsv.h,
				s: !hsv.v && !s ? ((_colors && _colors.hsl && _colors.hsl.s) || 0) : s, // ???
				l: l / 2
			};
		},

		rgb2hsl: function(rgb, dependent) { // not used in Color
			var hsv = ColorConverter.rgb2hsv(rgb);

			return ColorConverter.hsv2hsl(dependent ? hsv : (_colors.hsv = hsv));
		},

		hsl2rgb: function(hsl) {
			var h = hsl.h * 6,
				s = hsl.s,
				l = hsl.l,
				v = l < 0.5 ? l * (1 + s) : (l + s) - (s * l),
				m = l + l - v,
				sv = v ? ((v - m) / v) : 0,
				sextant = ~~h, // Math.floor(h) -> faster in most browsers
				fract = h - sextant,
				vsf = v * sv * fract,
				t = m + vsf,
				q = v - vsf,
				mod = sextant % 6;

			return {
				r: [v, q, m, m, t, v][mod],
				g: [t, v, v, q, m, m][mod],
				b: [m, m, t, v, v, q][mod]
			};
		},

		// ------------------------ CMYK ------------------------ //
		// Quote from Wikipedia:
		// "Since RGB and CMYK spaces are both device-dependent spaces, there is no
		// simple or general conversion formula that converts between them.
		// Conversions are generally done through color management systems, using
		// color profiles that describe the spaces being converted. Nevertheless, the
		// conversions cannot be exact, since these spaces have very different gamuts."
		// Translation: the following are just simple RGB to CMY(K) and visa versa conversion functions.

		rgb2cmy: function(rgb) {
			return {
				c: 1 - rgb.r,
				m: 1 - rgb.g,
				y: 1 - rgb.b
			};
		},

		cmy2cmyk: function(cmy) {
			var _Math = _math,
				k = _Math.min(_Math.min(cmy.c, cmy.m), cmy.y),
				t = 1 - k || 1e-20;

			return { // regular
				c: (cmy.c - k) / t,
				m: (cmy.m - k) / t,
				y: (cmy.y - k) / t,
				k: k
			};
		},

		cmyk2cmy: function(cmyk) {
			var k = cmyk.k;

			return { // regular
				c: cmyk.c * (1 - k) + k,
				m: cmyk.m * (1 - k) + k,
				y: cmyk.y * (1 - k) + k
			};
		},

		cmy2rgb: function(cmy) {
			return {
				r: 1 - cmy.c,
				g: 1 - cmy.m,
				b: 1 - cmy.y
			};
		},

		rgb2cmyk: function(rgb, dependent) {
			var cmy = ColorConverter.rgb2cmy(rgb); // doppelt??

			return ColorConverter.cmy2cmyk(dependent ? cmy : (_colors.cmy = cmy));
		},

		cmyk2rgb: function(cmyk, dependent) {
			var cmy = ColorConverter.cmyk2cmy(cmyk); // doppelt??

			return ColorConverter.cmy2rgb(dependent ? cmy : (_colors.cmy = cmy));
		},

		// ------------------------ LAB ------------------------ //

		XYZ2rgb: function(XYZ, skip) {
			var _Math = _math,
				M = _instance.options.XYZMatrix,
				X = XYZ.X,
				Y = XYZ.Y,
				Z = XYZ.Z,
				r = X * M.R[0] + Y * M.R[1] + Z * M.R[2],
				g = X * M.G[0] + Y * M.G[1] + Z * M.G[2],
				b = X * M.B[0] + Y * M.B[1] + Z * M.B[2],
				N = 1 / 2.4;

			M = 0.0031308;

			r = (r > M ? 1.055 * _Math.pow(r, N) - 0.055 : 12.92 * r);
			g = (g > M ? 1.055 * _Math.pow(g, N) - 0.055 : 12.92 * g);
			b = (b > M ? 1.055 * _Math.pow(b, N) - 0.055 : 12.92 * b);

			if (!skip) { // out of gammut
				_colors._rgb = {r: r, g: g, b: b};
			}

			return {
				r: limitValue(r, 0, 1),
				g: limitValue(g, 0, 1),
				b: limitValue(b, 0, 1)
			};
		},

		rgb2XYZ: function(rgb) {
			var _Math = _math,
				M = _instance.options.XYZMatrix,
				r = rgb.r,
				g = rgb.g,
				b = rgb.b,
				N = 0.04045;

			r = (r > N ? _Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92);
			g = (g > N ? _Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92);
			b = (b > N ? _Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92);

			return {
				X: r * M.X[0] + g * M.X[1] + b * M.X[2],
				Y: r * M.Y[0] + g * M.Y[1] + b * M.Y[2],
				Z: r * M.Z[0] + g * M.Z[1] + b * M.Z[2]
			};
		},

		XYZ2Lab: function(XYZ) {
			var _Math = _math,
				R = _instance.options.XYZReference,
				X = XYZ.X / R.X,
				Y = XYZ.Y / R.Y,
				Z = XYZ.Z / R.Z,
				N = 16 / 116, M = 1 / 3, K = 0.008856, L = 7.787037;

			X = X > K ? _Math.pow(X, M) : (L * X) + N;
			Y = Y > K ? _Math.pow(Y, M) : (L * Y) + N;
			Z = Z > K ? _Math.pow(Z, M) : (L * Z) + N;

			return {
				L: (116 * Y) - 16,
				a: 500 * (X - Y),
				b: 200 * (Y - Z)
			};
		},

		Lab2XYZ: function(Lab) {
			var _Math = _math,
				R = _instance.options.XYZReference,
				Y = (Lab.L + 16) / 116,
				X = Lab.a / 500 + Y,
				Z = Y - Lab.b / 200,
				X3 = _Math.pow(X, 3),
				Y3 = _Math.pow(Y, 3),
				Z3 = _Math.pow(Z, 3),
				N = 16 / 116, K = 0.008856, L = 7.787037;

			return {
				X: (X3 > K ? X3 : (X - N) / L) * R.X,
				Y: (Y3 > K ? Y3 : (Y - N) / L) * R.Y,
				Z: (Z3 > K ? Z3 : (Z - N) / L) * R.Z
			};
		},

		rgb2Lab: function(rgb, dependent) {
			var XYZ = ColorConverter.rgb2XYZ(rgb);

			return ColorConverter.XYZ2Lab(dependent ? XYZ : (_colors.XYZ = XYZ));
		},

		Lab2rgb: function(Lab, dependent) {
			var XYZ = ColorConverter.Lab2XYZ(Lab);

			return ColorConverter.XYZ2rgb(dependent ? XYZ : (_colors.XYZ = XYZ), dependent);
		}
	};

	// ------------------------------------------------------ //
	// ------------------ helper functions ------------------ //
	// -------------------------------------------------------//

	function getClosestWebColor(RGB, val) {
		var out = {},
			tmp = 0,
			half = val / 2;

		for (var n in RGB) {
			tmp = RGB[n] % val; // 51 = 'web save', 17 = 'web smart'
			out[n] = RGB[n] + (tmp > half ? val - tmp : -tmp);
		}
		return out;
	}

	function getHueDelta(rgb1, rgb2, nominal) {
		var _Math = _math;

		return (_Math.max(rgb1.r - rgb2.r, rgb2.r - rgb1.r) +
				_Math.max(rgb1.g - rgb2.g, rgb2.g - rgb1.g) +
				_Math.max(rgb1.b - rgb2.b, rgb2.b - rgb1.b)) * (nominal ? 255 : 1) / 765;
	}

	function getLuminance(rgb, normalized) {
		var div = normalized ? 1 : 255,
			RGB = [rgb.r / div, rgb.g / div, rgb.b / div],
			luminance = _instance.options.luminance;

		for (var i = RGB.length; i--; ) {
			RGB[i] = RGB[i] <= 0.03928 ? RGB[i] / 12.92 : _math.pow(((RGB[i] + 0.055) / 1.055), 2.4);
		}
		return ((luminance.r * RGB[0]) + (luminance.g * RGB[1]) + (luminance.b * RGB[2]));
	}

	function mixColors(topColor, bottomColor, topAlpha, bottomAlpha) {
		var newColor = {},
			alphaTop = (topAlpha !== undefined ? topAlpha : 1),
			alphaBottom = (bottomAlpha !== undefined ? bottomAlpha : 1),
			alpha = alphaTop + alphaBottom * (1 - alphaTop); // 1 - (1 - alphaTop) * (1 - alphaBottom);

		for(var n in topColor) {
			newColor[n] = (topColor[n] * alphaTop + bottomColor[n] * alphaBottom * (1 - alphaTop)) / alpha;
		}
		newColor.a = alpha;
		return newColor;
	}

	function getWCAG2Ratio(lum1, lum2) {
		var ratio = 1;

		if (lum1 >= lum2) {
			ratio = (lum1 + 0.05) / (lum2 + 0.05);
		} else {
			ratio = (lum2 + 0.05) / (lum1 + 0.05);
		}
		return _math.round(ratio * 100) / 100;
	}

	function limitValue(value, min, max) {
		// return Math.max(min, Math.min(max, value)); // faster??
		return (value > max ? max : value < min ? min : value);
	}
})(window);

/*! colorPicker.data.js */
;(function(window, undefined){
	"use strict"

	// see colorPicker.html for the following encrypted variables... will only be used in buildView()
	var _html = ('^§app alpha-bg-w">^§slds">^§sldl-1">$^§sldl-2">$^§sldl-3">$^§curm">$^§sldr-1">$^§sldr-2">$^§sldr-4">$^§curl">$^§curr">$$^§opacity">|^§opacity-slider">$$$^§memo">^§raster">$^§raster-bg">$|$|$|$|$|$|$|$|$^§memo-store">$^§memo-cursor">$$^§panel">^§hsv">^hsl-mode §ß">$^hsv-h-ß §ß">H$^hsv-h-~ §~">-^§nsarrow">$$^hsl-h-@ §@">H$^hsv-s-ß §ß">S$^hsv-s-~ §~">-$^hsl-s-@ §@">S$^hsv-v-ß §ß">B$^hsv-v-~ §~">-$^hsl-l-@ §@">L$$^§hsl §hide">^hsv-mode §ß">$^hsl-h-ß §ß">H$^hsl-h-~ §~">-$^hsv-h-@ §@">H$^hsl-s-ß §ß">S$^hsl-s-~ §~">-$^hsv-s-@ §@">S$^hsl-l-ß §ß">L$^hsl-l-~ §~">-$^hsv-v-@ §@">B$$^§rgb">^rgb-r-ß §ß">R$^rgb-r-~ §~">-$^rgb-r-@ §ß">&nbsp;$^rgb-g-ß §ß">G$^rgb-g-~ §~">-$^rgb-g-@ §ß">&nbsp;$^rgb-b-ß §ß">B$^rgb-b-~ §~">-$^rgb-b-@ §ß">&nbsp;$$^§cmyk">^Lab-mode §ß">$^cmyk-c-ß §@">C$^cmyk-c-~ §~">-$^Lab-L-@ §@">L$^cmyk-m-ß §@">M$^cmyk-m-~ §~">-$^Lab-a-@ §@">a$^cmyk-y-ß §@">Y$^cmyk-y-~ §~">-$^Lab-b-@ §@">b$^cmyk-k-ß §@">K$^cmyk-k-~ §~">-$^Lab-x-@ §ß">&nbsp;$$^§Lab §hide">^cmyk-mode §ß">$^Lab-L-ß §@">L$^Lab-L-~ §~">-$^cmyk-c-@ §@">C$^Lab-a-ß §@">a$^Lab-a-~ §~">-$^cmyk-m-@ §@">M$^Lab-b-ß §@">b$^Lab-b-~ §~">-$^cmyk-y-@ §@">Y$^Lab-x-ß §@">&nbsp;$^Lab-x-~ §~">-$^cmyk-k-@ §@">K$$^§alpha">^alpha-ß §ß">A$^alpha-~ §~">-$^alpha-@ §ß">W$$^§HEX">^HEX-ß §ß">#$^HEX-~ §~">-$^HEX-@ §ß">M$$^§ctrl">^§raster">$^§cont">$^§cold">$^§col1">|&nbsp;$$^§col2">|&nbsp;$$^§bres">RESET$^§bsav">SAVE$$$^§exit">$^§resize">$^§resizer">|$$$').
			replace(/\^/g, '<div class="').replace(/\$/g, '</div>').replace(/~/g, 'disp').replace(/ß/g, 'butt').replace(/@/g, 'labl').replace(/\|/g, '<div>'),
		_cssFunc = ('är^1,äg^1,äb^1,öh^1,öh?1,öh?2,ös?1,öv?1,üh^1,üh?1,üh?2,üs?1,ül?1,.no-rgb-r är?2,.no-rgb-r är?3,.no-rgb-r är?4,.no-rgb-g äg?2,.no-rgb-g äg?3,.no-rgb-g äg?4,.no-rgb-b äb?2,.no-rgb-b äb?3,.no-rgb-b äb?4{visibility:hidden}är^2,är^3,äg^2,äg^3,äb^2,äb^3{@-image:url(_patches.png)}.§slds div{@-image:url(_vertical.png)}öh^2,ös^1,öv^1,üh^2,üs^1,ül^1{@-image:url(_horizontal.png)}ös?4,öv^3,üs?4,ül^3{@:#000}üs?3,ül^4{@:#fff}är?1{@-color:#f00}äg?1{@-color:#0f0}äb?1{@-color:#00f}är^2{@|-1664px 0}är^3{@|-896px 0}är?1,äg?1,äb?1,öh^3,ös^2,öv?2Ü-2432Öär?2Ü-2944Öär?3Ü-4480Öär?4Ü-3202Öäg^2Äöh^2{@|-640px 0}äg^3{@|-384px 0}äg?2Ü-4736Öäg?3Ü-3968Öäg?4Ü-3712Öäb^2{@|-1152px 0}äb^3{@|-1408px 0}äb?2Ü-3456Öäb?3Ü-4224Öäb?4Ü-2688Ööh^2Äär^3Ääb?4Ü0}öh?4,üh?4Ü-1664Öös^1,öv^1,üs^1,ül^1Ääg^3{@|-256px 0}ös^3,öv?4,üs^3,ül?4Ü-2176Öös?2,öv^2Ü-1920Öüh^2{@|-768px 0}üh^3,üs^2,ül?2Ü-5184Öüs?2,ül^2Ü-5824Ö.S är^2{@|-128px -128Ö.S är?1Ääg?1Ääb?1Äöh^3Äös^2Äöv?2Ü-1408Ö.S är?2Ääb^3Ü-128Ö.S är?3Ü-896Ö.S är?4Ü-256Ö.S äg^2{@|-256px -128Ö.S äg?2Ü-1024Ö.S äg?3Ü-640Ö.S äg?4Ü-512Ö.S äb^2{@|-128px 0}.S äb?2Ü-384Ö.S äb?3Ü-768Ö.S öh?4Äüh?4Ü-1536Ö.S ös^1Äöv^1Äüs^1Äül^1{@|-512px 0}.S ös^3Äöv?4Äüs^3Äül?4Ü-1280Ö.S ös?2Äöv^2Ü-1152Ö.S üh^2{@|-1024px 0}.S üh^3Äüs^2Äül?2Ü-5440Ö.S üs?2Äül^2Ü-5696Ö.XXS ös^2,.XXS öv?2Ü-5120Ö.XXS ös^3,.XXS öv?4,.XXS üs^3,.XXS ül^3,.XXS ül?4Ü-5056Ö.XXS ös?2,.XXS öv^2Ü-4992Ö.XXS üs^2,.XXS ül?2Ü-5568Ö.XXS üs?2,.XXS ül^2Ü-5632Ö').
			replace(/Ü/g, '{@|0 ').replace(/Ö/g, 'px}').replace(/Ä/g, ',.S ').replace(/\|/g, '-position:').replace(/@/g, 'background').replace(/ü/g, '.hsl-').replace(/ö/g, '.hsv-').replace(/ä/g, '.rgb-').replace(/~/g, ' .no-rgb-}').replace(/\?/g, ' .§sldr-').replace(/\^/g, ' .§sldl-'),
		_cssMain = ('∑{@#bbb;font-family:monospace, "Courier New", Courier, mono;font-size:12¥line-ä15¥font-weight:bold;cursor:default;~412¥ä323¥?top-left-radius:7¥?top-Ü-radius:7¥?bottom-Ü-radius:7¥?bottom-left-radius:7¥ö@#444}.S{~266¥ä177px}.XS{~158¥ä173px}.XXS{ä105¥~154px}.no-alpha{ä308px}.no-alpha .§opacity,.no-alpha .§alpha{display:none}.S.no-alpha{ä162px}.XS.no-alpha{ä158px}.XXS.no-alpha{ä90px}∑,∑ div{border:none;padding:0¥float:none;margin:0¥outline:none;box-sizing:content-box}∑ div{|absolute}^s .§curm,«§disp,«§nsarrow,∑ .§exit,∑ ø-cursor,∑ .§resize{öimage:url(_icons.png)}∑ .do-drag div{cursor:none}∑ .§opacity,ø .§raster-bg,∑ .§raster{öimage:url(_bgs.png)}∑ ^s{~287¥ä256¥top:10¥left:10¥overflow:hidden;cursor:crosshair}.S ^s{~143¥ä128¥left:9¥top:9px}.XS ^s{left:7¥top:7px}.XXS ^s{left:5¥top:5px}^s div{~256¥ä256¥left:0px}.S ^l-1,.S ^l-2,.S ^l-3,.S ^l-4{~128¥ä128px}.XXS ^s,.XXS ^s ^l-1,.XXS ^s ^l-2,.XXS ^s ^l-3,.XXS ^s ^l-4{ä64px}^s ^r-1,^s ^r-2,^s ^r-3,^s ^r-4{~31¥left:256¥cursor:default}.S ^r-1,.S ^r-2,.S ^r-3,.S ^r-4{~15¥ä128¥left:128px}^s .§curm{margin:-5¥~11¥ä11¥ö|-36px -30px}.light .§curm{ö|-7px -30px}^s .§curl,^s .§curr{~0¥ä0¥margin:-3px -4¥border:4px solid;cursor:default;left:auto;öimage:none}^s .§curl,∑ ^s .§curl-dark,.hue-dark div.§curl{Ü:27¥?@† † † #fff}.light .§curl,∑ ^s .§curl-light,.hue-light .§curl{?@† † † #000}.S ^s .§curl,.S ^s .§curr{?~3px}.S ^s .§curl-light,.S ^s .§curl{Ü:13px}^s .§curr,∑ ^s .§curr-dark{Ü:4¥?@† #fff † †}.light .§curr,∑ ^s .§curr-light{?@† #000 † †}∑ .§opacity{bottom:44¥left:10¥ä10¥~287¥ö|0 -87px}.S .§opacity{bottom:27¥left:9¥~143¥ö|0 -100px}.XS .§opacity{left:7¥bottom:25px}.XXS .§opacity{left:5¥bottom:23px}.§opacity div{~100%;ä16¥margin-top:-3¥overflow:hidden}.§opacity .§opacity-slider{margin:0 -4¥~0¥ä8¥?~4¥?style:solid;?@#eee †}∑ ø{bottom:10¥left:10¥~288¥ä31¥ö@#fff}.S ø{ä15¥~144¥left:9¥bottom:9px}.XS ø{left:7¥bottom:7px}.XXS ø{left:5¥bottom:5px}ø div{|relative;float:left;~31¥ä31¥margin-Ü:1px}.S ø div{~15¥ä15px}∑ .§raster,ø .§raster-bg,.S ø .§raster,.S ø .§raster-bg{|absolute;top:0¥Ü:0¥bottom:0¥left:0¥~100%}.S ø .§raster-bg{ö|0 -31px}∑ .§raster{opacity:0.2;ö|0 -49px}.alpha-bg-b ø{ö@#333}.alpha-bg-b .§raster{opacity:1}ø ø-cursor{|absolute;Ü:0¥ö|-26px -87px}∑ .light ø-cursor{ö|3px -87px}.S ø-cursor{ö|-34px -95px}.S .light ø-cursor{ö|-5px -95px}∑ .§panel{|absolute;top:10¥Ü:10¥bottom:10¥~94¥?~1¥?style:solid;?@#222 #555 #555 #222;overflow:hidden;ö@#333}.S .§panel{top:9¥Ü:9¥bottom:9px}.XS .§panel{display:none}.§panel div{|relative}«§hsv,«§hsl,«§rgb,«§cmyk,«§Lab,«§alpha,.no-alpha «§HEX,«§HEX{~86¥margin:-1px 0px 1px 4¥padding:1px 0px 3¥?top-~1¥?top-style:solid;?top-@#444;?bottom-~1¥?bottom-style:solid;?bottom-@#222;float:Ö«§hsv,«§hsl{padding-top:2px}.S .§hsv,.S .§hsl{padding-top:1px}«§HEX{?bottom-style:none;?top-~0¥margin-top:-4¥padding-top:0px}.no-alpha «§HEX{?bottom-style:none}«§alpha{?bottom-style:none}.S .rgb-r .§hsv,.S .rgb-g .§hsv,.S .rgb-b .§hsv,.S .rgb-r .§hsl,.S .rgb-g .§hsl,.S .rgb-b .§hsl,.S .hsv-h .§rgb,.S .hsv-s .§rgb,.S .hsv-v .§rgb,.S .hsl-h .§rgb,.S .hsl-s .§rgb,.S .hsl-l .§rgb,.S .§cmyk,.S .§Lab{display:none}«§butt,«§labl{float:left;~14¥ä14¥margin-top:2¥text-align:center;border:1px solid}«§butt{?@#555 #222 #222 #555}«§butt:active{ö@#444}«§labl{?@†}«Lab-mode,«cmyk-mode,«hsv-mode,«hsl-mode{|absolute;Ü:0¥top:1¥ä50px}«hsv-mode,«hsl-mode{top:2px}«cmyk-mode{ä68px}.hsl-h .hsl-h-labl,.hsl-s .hsl-s-labl,.hsl-l .hsl-l-labl,.hsv-h .hsv-h-labl,.hsv-s .hsv-s-labl,.hsv-v .hsv-v-labl{@#f90}«cmyk-mode,«hsv-mode,.rgb-r .rgb-r-butt,.rgb-g .rgb-g-butt,.rgb-b .rgb-b-butt,.hsv-h .hsv-h-butt,.hsv-s .hsv-s-butt,.hsv-v .hsv-v-butt,.hsl-h .hsl-h-butt,.hsl-s .hsl-s-butt,.hsl-l .hsl-l-butt,«rgb-r-labl,«rgb-g-labl,«rgb-b-labl,«alpha-butt,«HEX-butt,«Lab-x-labl{?@#222 #555 #555 #222;ö@#444}.no-rgb-r .rgb-r-labl,.no-rgb-g .rgb-g-labl,.no-rgb-b .rgb-b-labl,.mute-alpha .alpha-butt,.no-HEX .HEX-butt,.cmy-only .Lab-x-labl{?@#555 #222 #222 #555;ö@#333}.Lab-x-disp,.cmy-only .cmyk-k-disp,.cmy-only .cmyk-k-butt{visibility:hidden}«HEX-disp{öimage:none}«§disp{float:left;~48¥ä14¥margin:2px 2px 0¥cursor:text;text-align:left;text-indent:3¥?~1¥?style:solid;?@#222 #555 #555 #222}∑ .§nsarrow{|absolute;top:0¥left:-13¥~8¥ä16¥display:none;ö|-87px -23px}∑ .start-change .§nsarrow{display:block}∑ .do-change .§nsarrow{display:block;ö|-87px -36px}.do-change .§disp{cursor:default}«§hide{display:none}«§cont,«§cold{|absolute;top:-5¥left:0¥ä3¥border:1px solid #333}«§cold{z-index:1;ö@#c00}«§cont{margin-Ü:-1¥z-index:2}«contrast .§cont{z-index:1;ö@#ccc}«orange .§cold{ö@#f90}«green .§cold{ö@#4d0}«§ctrl{|absolute;bottom:0¥left:0¥~100%;ö@#fff}.alpha-bg-b .§ctrl,«§bres,«§bsav{ö@#333}«§col1,«§col2,«§bres,«§bsav{?~1¥?style:solid;?@#555 #222 #222 #555;float:left;~45¥line-ä28¥text-align:center;top:0px}.§panel div div{ä100%}.S .§ctrl div{line-ä25px}.S «§bres,.S «§bsav{line-ä26px}∑ .§exit,∑ .§resize{Ü:3¥top:3¥~15¥ä15¥ö|0 -52px}∑ .§resize{top:auto;bottom:3¥cursor:nwse-resize;ö|-15px -52px}.S .§exit{ö|1px -52px}.XS .§resize,.XS .§exit{~10¥ä10¥Ü:0¥öimage:none}.XS .§exit{top:0px}.XS .§resize{bottom:0px}∑ .§resizer,∑ .§resizer div{|absolute;border:1px solid #888;top:-1¥Ü:-1¥bottom:-1¥left:-1¥z-index:2;display:none;cursor:nwse-resize}∑ .§resizer div{border:1px dashed #333;opacity:0.3;display:block;ö@#bbb}').
			replace(/Ü/g, 'right').replace(/Ö/g, 'left}').replace(/∑/g, '.§app').replace(/«/g, '.§panel .').replace(/¥/g, 'px;').replace(/\|/g, 'position:').replace(/@/g, 'color:').replace(/ö/g, 'background-').replace(/ä/g, 'height:').replace(/ø/g, '.§memo').replace(/†/g, 'transparent').replace(/\~/g, 'width:').replace(/\?/g, 'border-').replace(/\^/g, '.§sld'),
		_horizontalPng = 'iVBORw0KGgoAAAANSUhEUgAABIAAAAABCAYAAACmC9U0AAABT0lEQVR4Xu2S3Y6CMBCFhyqIsjGBO1/B9/F5DC/pK3DHhVkUgc7Zqus2DVlGU/cnQZKTjznttNPJBABA149HyRf1iN//4mIBCg0jV4In+j9xJiuihly1V/Z9X88v//kNeDXVvyO/lK+IPR76B019+1Riab3H1zkmeqerKnL+Bzwxx6PAgZxaSQU8vB62T28pxcQeRQ2sHw6GxCOWHvP78zwHAARBABOfdYtd30rwxXOEPDF+dj2+91r6vV/id3k+/brrXmaGUkqKhX3i+ffSt16HQ/dorTGZTHrs7ev7Tl7XdZhOpzc651nfsm1bRFF0YRiGaJoGs9nsQuN/xafTCXEco65rzOdzHI9HJEmCqqqwXC6x3++RZRnKssRqtUJRFFiv19jtdthutyAi5Hl+Jo9VZg7+7f3yXuvZf5c3KaXYzByb+WIzO5ymKW82G/0BNcFhO/tOuuMAAAAASUVORK5CYII=',
		_verticalPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAABfACAYAAABn2KvYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHtJREFUeNrtnN9SqzAQxpOF1to6zuiVvoI+j6/gva/lA/kKeqUzjtX+QTi7SzSYBg49xdIzfL34+e1usoQQklCnmLwoCjImNwDQA2xRGMqNAYB+gPEH9IdCgIUA6Aem0P1fLoMQAPYNHYDoCKAv8OMHFgKgX2AjDPQDXn4t1l+gt/1fId//yWgE/hUJ+mAn8EyY5wCwXxhrbaHzn8E9iPlv79DdHxXTqciZ4KROnXRVZMF/6U2OPhcEavtAbZH1SM7wRDD7VoHZItCiyEQf4t6+MW9UOxaZybmdCGKqNrB9Eb5SfMg3wTyiagMtigTmWofiSDCOYNTSNz6sLDIoaCU9GWDd0tdhoMMsRm+r8U/EfB0GfjmLXiqzimDd0tdhoLMsI7la45+I+ToM/HIW0kfGVQTrlr7tA91kaUr//fxrKo8jUFB7VAn6AKpHJf+EKwAAAIYD/f7F7/8MVgMo7P+gBqDKr57Lf72V8x8AAMDgYIuvH4EAAAAMDQX6AACAQcI9GGMjDADA4MA/P2KlP8IEAAAYFCz6AACAgaLA8y8AAIN+CMYXoQAADA7u/UPYCAMAMDjI7z9S+SdwDFQX2C9Gh9GMEOWriz8/Pw1lWQZsi/L3R4czzP678Ve+P8f9nCv/C7hwLq99ah8NfKrU15zPB5pVcwtiJt9qGy0IfEE+jQa+Fn0VtI/fkxUPqBlEfRENeF+tqUpbGpi1iu8epwJzvV5XA4GpWC6XGz7F+/u766EgwJ+ckiTJKU3TnI6OjnI6OzvLZf6zMggt3dzckPhIoiTlSGpQ+eEsVegdz0fbCCi4fRs+Po+4yWdeDXiT+6pBSTeHple1pkz3FZ+avpyavoiPxgLN0B7yprY08PlyQTTm0+PWmkH7ynedNKraar4F/lRj1WpTtYh+ozL/cY2sAvZl0gcbZm0gSLBLvkxGoaogiy/HDXemQk2t5pUm8OAhH8/HH6e0mkJ9q9XKKQXfb07xfZnJbZrRxcVFVt6/t7e3Kc1ms5RGo1Eq5VIZuyl9fHw4k/M5xYeoKj64A7eqCt1ZeqWFVSl8NV9OTV3fmvP5qE9VmzSoEcsXpArK1UHen/hZbgL53BZSdyEXalGau/hU8TEW0u3VcoFPy3EDFrTgT+njydeZ0+l0UV7fu7u7iVzziQQmUm4iqRw4n/NxMxw4s/Mp1NSALxf4NEtQ10cjMDwSl+b+/j6hp6enVGb+jUvrn05iKobm6PboOt8vPISY5Pr6OqGXlxe3fOokoGtAbMUJZmqvYmaLQDP+sdrecOjtO/SXeH69P8Imutm5urqy9PDwYOny8tLS4+OjpfPzc0vPz8+WTk9PLb2+vlpZbCzN53NLx8fHVtYZS5PJxMoEZWWqsjKULY3HYytTi1Pex5OMldXKRVXxuLcy/20onmms3BBOxcr5qCrZtsrd45SPel8sGlOxGoGy0neynQ6VL9fsa1YtWlCrtj9G83G7PjdVush5n5q1iJWLZW6u21a1bUvbVnVzlru0pe3RdmlV1/23fZtbZv4Dx+7FBypx77kAAAAASUVORK5CYII=',
		_patchesPng = ('iVBORw0KGgo^NSUhEUgAAB4^EACAI#DdoPxz#L0UlEQVR4Xu3cQWrDQBREwR7FF8/BPR3wXktnQL+KvxfypuEhvLJXcp06d/bXd71OPt+trIw95zr33Z1bk1/fudEv79wa++7OfayZ59wrO2PBzklcGQmAZggAAOBYgAYBmpWRAGg^BGgRofAENgAAN#I0CBA6w8AG^ECABgEa/QH§AI0CNDoDwAY^QIAGAVp/AM§AjQI0OgPAAY^QoEGARn8Aw§CNAjQ+gMABg#BCgQYCmGQmABgAAEKBBgEZ/AM§AjQI0PoDAAY^QoEGARn8AM^IAADQI0+gMABg#BCgQYDWHwAw^gAANAjT6A4AB^BGgQoNEfAD^C#0CtP4AgAE^EaBCgaUYCoAE#RoEKDRHwAw^gAANArT+AIAB^BGgQoNEfAAw^gQIMAjf4AgAE^EaBCg9QcAD^CBAgwCN/gBg§EaBGj0BwAM^IECDAK0/AG§ARoEaJqRAGg^BGgRo9AcAD^CBAgwCtPwBg§EaBGj0BwAD^CNAgQKM/AG§ARoEaP0BAAM^I0CBAoz8AG^ECABgEa/QEAAw^jQIEDrDwAY^QIAGAZpmJACaBw^RoEKD1BwAM^IECDAK0/AG§ARoEaPQHAAw^gQIMArT8AY§BGgRo/QEAAw^jQIECjPwBg§EaBGj9AQAD^CNAgQOsPABg#BAgAYBGv0BAANwCwAAGB6gYeckmpEAa^AEaBGj0BwAM^IECDAK0/AG§ARoEaPQHAAM^I0CBAoz8AY§BGgRo/QEAAw^jQIECjPwAY^QIAGARr9AQAD^CNAgQOsPABg#BAgAYBmmYkABoAAECABgEa/QEAAw^jQIEDrDwAY^QIAGARr9Ac§AjQI0OgPABg#BAgAYBWn8Aw§CNAjQ6A8ABg#BCgQYBGfwD§AI0CND6AwAG^EKBBgKYZCYAG#QoEGARn8Aw§CNAjQ+gMABg#BCgQYBGfwAw^gAANAjT6AwAG^EKBBgNYfAD^C#0CNPoDgAE^EaBCg0R8AM^IAADQK0/gCAAQ^RoEKBpRgKgAQAABGgQoNEfAD^C#0CtP4AgAE^EaBCg0R8AD^CBAgwCN/gCAAQ^RoEKD1BwAM^IECDAI3+AG§ARoEaPQHAAw^gQIMArT8AY§BGgRomsMAM^IAADQK0/gCAAQ^RoEKDRHwAw^gAANO7fQHwAw^gAANArT+AIAB^BGgQoNEfAGg^BGgRo9AcAD^CBAgwCtPwBg§EaBGj0BwAD^RIB+Ntg5iea5AD^DAIwI0CND6AwAG^EKBBgEZ/AKAB#EaBCg0R8AM^IAADQK0/gCAAQ^RoEKDRHwAM^IECDAI3+AIAB^BGgQoPUHAAw^gQIMAjf4AY§BGgRo9AcAD^CBAgwCtPwBg§EaBGiakQBo^ARoEaPQHAAw^gQIMArT8AY§BGgRo9AcAAw^jQIECjPwBg§EaBGj9AQAD^CNAgQKM/ABg#BAgAYBGv0BAAM^I0CBA6w8AG^ECABgGaZiQAGgAAQIAGARr9AQAD^CNAgQOsPABg#BAgAYBGv0Bw§CNAjQ6A8AG^ECABgFafwD§AI0CNDoDwAG^EKBBgEZ/AM§AjQI0PoDAAY^QoEGApjkMAAM^I0CBA6w8AG^ECABgEa/QEAAw^jQsIP+AIAB^BGgQoPUHAAw^gQIMAjf4AgAE#Bea/fK+3P5/3PJOvh8t1cO4nflmQAQoAEAAF9Aw/7JHfQHAAw^gQIMArT8AY§BGvwHNPoDAA0AACBAgwCN/gCAAQ^RoEKD1BwAM^IECDAI3+AG§ARoEaPQHAAw^gQIMArT8AY§BGgRo9AcAAw^jQIECjPwBg§EaBGj9AQAD^CNAgQNOMBEAD#I0CBAoz8AY§BGgRo/QEAAw^jQIECjPwAY^QIAGARr9AQAD^CNAgQOsPABg#BAgAYBGv0Bw§CNAjQ6A8AG^ECABgFafwD§AI0CNA0IwHQ^AjQI0OgPABg#BAgAYBWn8Aw§CNAjQ6A8ABg#BCgQYBGfwD§AI0CND6AwAG^EKBBgEZ/AD^C#0CNPoDAAY^QoEGA1h8AM^IAADQI0DQAG^EKBBgEZ/AM§AjQI0PoDAAY^QoEGA1h8AM^IAADQI0+gMABg#BCgQYDWHwAw^gAANArT+AIAB^BGgQoNEfAD^C#0CtP4AgAE^EaBCg9QcAD^CBAgwCN/gCAAQ^RoEKD1BwAM^IECDAK0/AG§ARoEaPQHAAw^gQIMArT8AY§BGgRo/QEAAw^jQIECjPwBgACDhFgC#07t9AfAD^C#0CtP4AgAE^EaBCg0R8Aa^AEaBGj0BwAM^IECDAK0/AG§ARoEaPQHAAM^I0CBAoz8AY§BGgRo/QEAAw^jQIECjPwAY^QIAGARr9AQAD^CNAgQOsPABg#BAgAYBmmYkABoAAECABgEa/QEAAw^jQIEDrDwAY^QIAGARr9Ac§AjQI0OgPABg#BAgAYBWn8Aw§CNAjQ6A8ABg#BCgQYBGfwD§AI0CND6AwAG^EKBBgKYZCYAG#QoEGARn8Aw§CNAjQ+gMABg#BCgQYBGfwAw^gAANAjT6AwAG^EKBBgNYfAD^C#0CNPoDgAE^EaBCg0R8AM^IAADQK0/gCAAQ^RoEKBpRgKgAQAABGgQoNEfAD^C#0CtP4AgAE^EaBCg0R8AD^CBAgwCN/gCAAQ^RoEKD1BwAM^IECDAI3+AG§ARoEaPQHAAw^gQIMArT8AY§BGgRommEAM^CBAgwCN/gCAAQ^RoEKD1BwAM^IECDAI3+AIAB^ARoEaPQHAAw^gQIMArT8AY§BGgRo9AcAGgAAQICGCNBfRfNcABg#BgeICGnVvoDwAY^QIAGAVp/AM§AjQI0OgPADQAAIAADQI0+gMABg#BCgQYDWHwAw^gAANAjT6A4AB^BGgQoNEfAD^C#0CtP4AgAE^EaBCg0R8AD^CBAgwCN/gCAAQ^RoEKD1BwAM^IECDAE0zEgAN#gQIMAjf4AgAE^EaBCg9QcAD^CBAgwCN/gBg§EaBGj0BwAM^IECDAK0/AG§ARoEaPQHAAM^I0CBAoz8AY§BGgRo/QEAAw^jQIEDTjARAAwAACNAgQKM/AG§ARoEaP0BAAM^I0CBAoz8AG^ECABgEa/QEAAw^jQIEDrDwAY^QIAGARr9Ac§AjQI0OgPABg#BAgAYBWn8Aw§CNAjQNIcBY§BGgRo/QEAAw^jQIECjPwBg§EadtAfAD^C#0CtP4AgAE^EaBCgAQABGgAA+AO2TAbHupOgH^ABJRU5ErkJggg==').
			replace(/§/g, 'AAAAAA').replace(/\^/g, 'AAAA').replace(/#/g, 'AAA'),
		_iconsPng = 'iVBORw0KGgoAAAANSUhEUgAAAGEAAABDCAMAAAC7vJusAAAAkFBMVEUAAAAvLy9ERERubm7///8AAAD///9EREREREREREREREQAAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8AAAD///8cHBwkJCQnJycoKCgpKSkqKiouLi4vLy8/Pz9AQEBCQkJDQ0NdXV1ubm58fHykpKRERERVVVUzMzPx7Ab+AAAAHXRSTlMAAAAAAAQEBQ4QGR4eIyMtLUVFVVVqapKSnJy7u9JKTggAAAFUSURBVHja7dXbUoMwEAbgSICqLYeW88F6KIogqe//dpoYZ0W4AXbv8g9TwkxmvtndZMrEwlw/F8YIRjCCEYxgBCOsFmzqGMEI28J5zzmt0Pc9rdDL0NYgMxIYC5KiKpKAzZphWtZlGm4SjlnkOV6UHeeEUx77rh/npw1dCrI9k9lnwUwF+UG9D3m4ftJJxH4SJdPtaawXcbr+tBaeFrxiur309cIv19+4ytGCU0031a5euPVigLYGqjlAqM4ShOQ+QAYQUO80AMMAAkUGGfMfR9Ul+kmvPq2QGxXKOQBAKdjUgk0t2NiCGEVP+rHT3/iCUMBT90YrPMsKsIWP3x/VolaonJEETchHCS8AYAmaUICQQwaAQnjoXgHAES7jLkEFaHO4bdq/k25HAIpgWY34FwAE5xjCffM+D2DV8B0gRsAZT7hr5gE8wdrJcU+CJqhcqQD7Cx5L7Ph4WnrKAAAAAElFTkSuQmCC',
		_bgsPng = 'iVBORw0KGgoAAAANSUhEUgAAASAAAABvCAYAAABM+h2NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABORJREFUeNrs3VtTW1UYBuCEcxAI4YydWqTWdqr1V7T/2QsvvPDCCy9qjxZbamsrhZIQUHsCEtfafpmJe8qFjpUxfZ4Zuvt2feydJvAOARZUut1u5bRerl692nV913f99/f6QxWAU6KAAAUEKCAABQQoIAAFBCggAAUEKCAABQQoIAAFBCggAAUEKCAABQQoIEABASggQAEBKCBAAQEoIEABASggQAEBKCBAAQEoIGBQC+jatWvd07zxrv9+Xx8fAQEoIEABASggQAEBKCBAAQEoIEABAQoIQAEBCghAAQEKCEABAQOk2u36kS6AAgLetwJKL29toFRM1be+QrVq3rx58//KvM8BAadGAQEKCFBAAAoIGHwnfhneZ+/Nmzf/LufzrI+AAE/BAAUEoIAABQTwztgLZt68eXvBAE/BABQQoIAAFBAweOwFM2/evL1ggKdgAAoIUEAACggYPPaCmTdv3l4wwFMwAAUEKCAABQQMHnvBzJs3by8Y4CkYgAICFBCAAgIGz4lfBQNQQMDgFlCtVisaaHV1tThubW1VInciD0U+ysdnz54N5+PKysphOnRTHsvHlN9EHo/1l5FrkV9Enoz8W87b29tTOS8vLx9EnoncjlyPvBe5EbkZeT4fU96NvBDr2znv7Ows57y0tLQVeSXy08gf5mNfPhPrjyOfrVarlcXFxZ9yfv78+bl8TPlh5LU8n/KDyOuxfj/y+VjfyHl3d/dCKv28fi/yp/m4sLDwQ+SLke9GvhT5Tinfjnw5f4/F/Pz8rZybzeZn+ZjyzVK+EfnzUr4S+Xopf9/L+fxzc3M5d1qt1hf531Mu5k/IxzGf85VYL+fefHH+RqNRrO/t7RW3L+UbkS9Hvhk5/386Kd/qW8/5duRLMV/OdyJfzNebnZ0t7t92u53v/07K9yJfiLwROT9+ef7HyOux/iDyWuSHkT+K+eLtZX9//2xer9frjyOfyY9/Wn8S86v59qT1p7Ge315zLt4RU16K19+O9YXIu5HnYn435hux3opcj9yOPB3z+5E/iPXf43y1yMX778HBQS3f3pTz+28l5bHIr2N+LN3+zszMzGHkoh/S+mHMF98XlNaP8zHd/0W/pMe943NAwKlSQIACAhQQgAICFBCAAgIUEIACAhQQgAIC/n9GqtXqYbfbHa38+RtSu32llPdqdNL6aOSj+LfxyMVekLTem39Ryr/mPDQ0NBznzXtROikPRW6W8k7k3m9rzXthOsPDw73bUuylGRkZ6cR63nvTSfko8oPIr+Pnz96P/DLW816ezujoaN6DdtyX9+P8eS9QZ2xs7Hxf7qa8Xlr/JO6Ljcjrcf6cj1P+OO+N6V1/fHz8XLz+/Tjfubh+sZcorZ+N9Ycxfybyo8ircf6fc56YmFiJ1/8l8mLk7cjzkfP92U15Ns63G+u9nPcKdWq12lQ8Xu3Ixd6f9Pd8P3UmJycnUszzL2N9LM7/anNzs9V7Q2q32395w/q7ubdH6L/KrVbrpPxlKX9Vyl+X8jel/G0pf5f/aDabvXy9tH6ztH63lDdKebOUH5Xyk1LeKuWd/ry2tlap9P125Onp6Zf9eWpq6lW3b8f6zMzM6/71er3+ppSP+u/XNN/pz41Go+sjIMBTMEABASggQAEBKCBAAQEoIEABASggQAEB/CN/CDAAw78uW9AVDw4AAAAASUVORK5CYII=';

		window.ColorPicker = {
			_html: _html,
			_cssFunc: _cssFunc,
			_cssMain: _cssMain,
			_horizontalPng: _horizontalPng,
			_verticalPng: _verticalPng,
			_patchesPng: _patchesPng,
			_iconsPng: _iconsPng,
			_bgsPng: _bgsPng
		}
})(window);

/*! colorPicker.js */
;(function(window, undefined){
	"use strict"

	var _data = window.ColorPicker, // will be deleted in buildView() and holds:
		// window.ColorPicker = { // comes from colorPicker.data.js and will be overwritten.
		// 	_html: ..., // holds the HTML markup of colorPicker
		// 	_cssFunc: ..., // CSS for all the sliders
		// 	_cssMain: ..., // CSS of the GUI
		// 	_horizontalPng: ..., // horizontal background images for sliders
		// 	_verticalPng: ..., // vertical background images for sliders
		// 	_patchesPng: ..., // background images for square sliders in RGB mode
		// 	_iconsPng: ..., // some icon sprite images
		// 	_bgsPng: ..., // some more icon sprite images
		// }
		_devMode = !_data, // if no _data we assume that colorPicker.data.js is missing (for development)
		_isIE = false,
		_doesOpacity = false,
		// _isIE8 = _isIE && document.querySelectorAll,

		_valueRanges = {}, // will be assigned in initInstance() by Colors instance
		// _valueRanges = {
		// 	rgb:   {r: [0, 255], g: [0, 255], b: [0, 255]},
		// 	hsv:   {h: [0, 360], s: [0, 100], v: [0, 100]},
		// 	hsl:   {h: [0, 360], s: [0, 100], l: [0, 100]},
		// 	cmyk:  {c: [0, 100], m: [0, 100], y: [0, 100], k: [0, 100]},
		// 	cmy:   {c: [0, 100], m: [0, 100], y: [0, 100]},
		// 	XYZ:   {X: [0, 100], Y: [0, 100], Z: [0, 100]},
		// 	Lab:   {L: [0, 100], a: [-128, 127], b: [-128, 127]},
		// 	alpha: {alpha: [0, 1]},
		// 	HEX:   {HEX: [0, 16777215]}
		// },
		_bgTypes = {w: 'White', b: 'Black', c: 'Custom'},

		_mouseMoveAction, // current mouseMove handler assigned on mouseDown
		_action = '', // needed for action callback; needed due to minification of javaScript
		_mainTarget, // target on mouseDown, might be parent element though...
		_valueType, // check this variable; gets missused/polutet over time
		_delayState = 1, // mouseMove offset (y-axis) in display elements // same here...
		_startCoords = {},
		_targetOrigin = {},
		_renderTimer, // animationFrame/interval variable
		_newData = true,
		// _txt = {
		// 	selection: document.selection || window.getSelection(),
		// 	range: (document.createRange ? document.createRange() : document.body.createTextRange())
		// },

		_renderVars = {}, // used only in renderAll and convertColors
		_cashedVars = {}, // reset in initSliders

		_colorPicker,
		_previousInstance, // only used for recycling purposes in buildView()
		_colorInstance = {},
		_colors = {},
		_options = {},
		_nodes = {},

		_math = Math,

		animationFrame = 'AnimationFrame', // we also need this later
		requestAnimationFrame = 'request' + animationFrame,
		cancelAnimationFrame = 'cancel' + animationFrame,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		
		ColorPicker = function(options) { // as tiny as possible...
			this.options = {
				color: 'rgba(204, 82, 37, 0.8)',
				mode: 'rgb-b',
				fps: 60, // 1000 / 60 = ~16.7ms
				delayOffset: 8,
				CSSPrefix: 'cp-',
				allMixDetails: true,
				alphaBG: 'w',
				imagePath: ''
				// devPicker: false // uses existing HTML for development...
				// noAlpha: true,
				// customBG: '#808080'
				// size: 0,
				// cmyOnly: false,
				// initStyle: 'display: none',

				// memoryColors: "'rgba(82,80,151,1)','rgba(100,200,10,0.5)','rgba(100,0,0,1)','rgba(0,0,0,1)'"
				// memoryColors: [{r: 100, g: 200, b: 10, a: 0.5}] //  

				// opacityPositionRelative: undefined,
				// customCSS: undefined,
				// appendTo: document.body,
				// noRangeBackground: false,
				// textRight: false, ?????
				// noHexButton: false,
				// noResize: false,

				// noRGBr: false,
				// noRGBg: false,
				// noRGBb: false,

				// ------ CSSStrength: 'div.',
				// XYZMatrix: XYZMatrix,
				// XYZReference: {},
				// grey: grey,
				// luminance: luminance,

				// renderCallback: undefined,
				// actionCallback: undefined,
				// convertCallback: undefined,
			};
			initInstance(this, options || {});
		};

	window.ColorPicker = ColorPicker; // export differently
	ColorPicker.addEvent = addEvent;
	ColorPicker.removeEvent = removeEvent;
	ColorPicker.getOrigin = getOrigin;
	ColorPicker.limitValue = limitValue;
	ColorPicker.changeClass = changeClass;

	// ------------------------------------------------------ //

	ColorPicker.prototype.setColor = function(newCol, type, alpha, forceRender) {
		focusInstance(this);
		_valueType = true; // right cursor...
		// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
		preRenderAll(_colorInstance.setColor.apply(_colorInstance, arguments));
		if (forceRender) {
			this.startRender(true);
		}
	};

	ColorPicker.prototype.saveAsBackground = function() {
		focusInstance(this);
		return saveAsBackground(true);
	};

	ColorPicker.prototype.setCustomBackground = function(col) {
		focusInstance(this); // needed???
		return _colorInstance.setCustomBackground(col);
	};

	ColorPicker.prototype.startRender = function(oneTime) {
		focusInstance(this);
		if (oneTime) {
			_mouseMoveAction = false; // prevents window[requestAnimationFrame] in renderAll()
			renderAll();
			this.stopRender();
		} else {
			_mouseMoveAction = 1;
			_renderTimer = window[requestAnimationFrame](renderAll);
		}
	};

	ColorPicker.prototype.stopRender = function() {
		focusInstance(this); // check again
		window[cancelAnimationFrame](_renderTimer);
		if (_valueType) {
			// renderAll();
			_mouseMoveAction = 1;
			stopChange(undefined, 'external');
			// _valueType = undefined;
		}
	};

	ColorPicker.prototype.setMode = function(mode) { // check again ... right cursor
		focusInstance(this);
		setMode(mode);
		initSliders();
		renderAll();
	};

	ColorPicker.prototype.destroyAll = function() { // check this again...
		var html = this.nodes.colorPicker,
			destroyReferences = function(nodes) {
			for (var n in nodes) {
				if (nodes[n] && nodes[n].toString() === '[object Object]' || nodes[n] instanceof Array) {
					destroyReferences(nodes[n]);
				}
				nodes[n] = null;
				delete nodes[n];
			}
		};

		this.stopRender();
		installEventListeners(this, true);
		destroyReferences(this);
		html.parentNode.removeChild(html);
		html = null;
	};

	ColorPicker.prototype.renderMemory = function(memory) {
		var memos = this.nodes.memos,
			tmp = [];

		if (typeof memory === 'string') { // revisit!!!
			memory = memory.replace(/^'|'$/g, '').replace(/\s*/, '').split('\',\'');
		}
		for (var n = memos.length; n--; ) { // check again how to handle alpha...
			if (memory && typeof memory[n] === 'string') {
				tmp = memory[n].replace('rgba(', '').replace(')', '').split(',');
				memory[n] = {r: tmp[0], g: tmp[1], b: tmp[2], a: tmp[3]}
			}
			memos[n].style.cssText = 'background-color: ' + (memory && memory[n] !== undefined ?
				color2string(memory[n]) + ';' + getOpacityCSS(memory[n]['a'] || 1) : 'rgb(0,0,0);');
		}
	};

	// ------------------------------------------------------ //

	function initInstance(THIS, options) {
		var exporter, // do something here..
			mode = '',
			CSSPrefix = '',
			optionButtons;

		for (var option in options) { // deep copy ??
			THIS.options[option] = options[option];
		}
		_isIE = document.createStyleSheet !== undefined && document.getElementById || !!window.MSInputMethodContext;
		_doesOpacity = typeof document.body.style.opacity !== 'undefined';
		_colorInstance = new Colors(THIS.options);
		// We transfer the responsibility to the instance of Color (to save space and memory)
		delete THIS.options;
		_options = _colorInstance.options;
		_options.scale = 1;
		CSSPrefix = _options.CSSPrefix;

		THIS.color = _colorInstance; // check this again...
		_valueRanges = _options.valueRanges;
		THIS.nodes = _nodes = getInstanceNodes(buildView(THIS), THIS); // ha, ha,... make this different
		setMode(_options.mode);
		focusInstance(THIS);
		saveAsBackground();

		mode = ' ' + _options.mode.type + '-' + _options.mode.z;
		_nodes.slds.className += mode;
		_nodes.panel.className += mode;
		//_nodes.colorPicker.className += ' cmy-' + _options.cmyOnly;

		if (_options.noHexButton) {
			changeClass(_nodes.HEX_butt, CSSPrefix + 'butt', CSSPrefix + 'labl');
		}

		if (_options.size !== undefined) {
			resizeApp(undefined, _options.size);
		}

		optionButtons = {
			alphaBG: _nodes.alpha_labl,
			cmyOnly: _nodes.HEX_labl // test... take out
		};
		for (var n in optionButtons) {
			if (_options[n] !== undefined) {
				buttonActions({target: optionButtons[n], data: _options[n]});
			}
		}
		if (_options.noAlpha) {
			_nodes.colorPicker.className += ' no-alpha'; // IE6 ??? maybe for IE6 on document.body
		}

		THIS.renderMemory(_options.memoryColors);

		installEventListeners(THIS);
		
		_mouseMoveAction = true;
		stopChange(undefined, 'init');

		if (_previousInstance) {
			focusInstance(_previousInstance);
			renderAll();
		}
	}

	function focusInstance(THIS) {
		_newData = true;
		if (_colorPicker !== THIS) {
			_colorPicker = THIS;
			_colors = THIS.color.colors;
			_options = THIS.color.options;
			_nodes = THIS.nodes;
			_colorInstance = THIS.color;

			_cashedVars = {};
			preRenderAll(_colors);
		}
	}

	function getUISizes() {
		var sizes = ['L', 'S', 'XS', 'XXS'];
		_options.sizes = {};
		_nodes.testNode.style.cssText = 'position:absolute;left:-1000px;top:-1000px;';
		document.body.appendChild(_nodes.testNode);
		for (var n = sizes.length; n--; ) {
			_nodes.testNode.className = _options.CSSPrefix + 'app ' + sizes[n];
			_options.sizes[sizes[n]] = [_nodes.testNode.offsetWidth, _nodes.testNode.offsetHeight];
		}
		if (_nodes.testNode.removeNode) { // old IEs
			_nodes.testNode.removeNode(true);
		} else {
			document.body.removeChild(_nodes.testNode);
		}
	}

	function buildView(THIS) {
		var app = document.createElement('div'),
			prefix = _options.CSSPrefix,
			urlData = 'data:image/png;base64,',
			addStyleSheet = function(cssText, id) {
				var style = document.createElement('style');

				style.setAttribute('type', 'text/css');
				if (id) {
					style.setAttribute('id', id);
				}
				if (!style.styleSheet) {
					style.appendChild(document.createTextNode(cssText));
				}
				document.getElementsByTagName('head')[0].appendChild(style);
				if (style.styleSheet) { // IE compatible
					document.styleSheets[document.styleSheets.length-1].cssText = cssText;
				}
			},
			processCSS = function(doesBAS64){
				// CSS - system
				_data._cssFunc = _data._cssFunc.
					replace(/§/g, prefix).
					replace('_patches.png', doesBAS64 ? urlData + _data._patchesPng : _options.imagePath + '_patches.png').
					replace('_vertical.png', doesBAS64 ? urlData + _data._verticalPng : _options.imagePath + '_vertical.png').
					replace('_horizontal.png', doesBAS64 ? urlData + _data._horizontalPng :
						_options.imagePath + '_horizontal.png');
				addStyleSheet(_data._cssFunc, 'colorPickerCSS');
				// CSS - main
				if (!_options.customCSS) {
					_data._cssMain = _data._cssMain.
						replace(/§/g, prefix).
						replace('_bgs.png', doesBAS64 ? urlData + _data._bgsPng : _options.imagePath + '_bgs.png').
						replace('_icons.png', doesBAS64 ? urlData + _data._iconsPng : _options.imagePath + '_icons.png').
						// replace('"Courier New",', !_isIE ? '' : '"Courier New",').
						replace(/opacity:(\d*\.*(\d+))/g, function($1, $2){
							return !_doesOpacity ? '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=' +
							_math.round(+$2 * 100) + ')";filter: alpha(opacity=' + _math.round(+$2 * 100) + ')' :
							'-moz-opacity: ' + $2 + '; -khtml-opacity: ' + $2 + '; opacity: ' + $2;
						});
					// style.appendChild(document.createTextNode(_data._cssFunc));
					addStyleSheet(_data._cssMain);
				}
				// for (var n in _data) { // almost 25k of memory ;o)
				// 	_data[n] = null;
				// }
			},
			test = document.createElement('img');

		// development mode
		if (_devMode) {
			return THIS.color.options.devPicker;
		}

		// CSS
		if (!document.getElementById('colorPickerCSS')) { // only once needed
			test.onload = test.onerror = function(){
				if (_data._cssFunc) {
					processCSS(this.width === 1 && this.height === 1);
				}
				THIS.cssIsReady = true;
			};
			test.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		} else {
			THIS.cssIsReady = true;
		}

		// HTML
		if (_previousInstance = _colorPicker) {
			// we need to be careful with recycling HTML as slider calssNames might have been changed...
			initSliders();
		}
		// app.innerHTML = _colorPicker ? _colorPicker.nodes.colorPicker.outerHTML : _data._html.replace(/§/g, prefix);
		// faster ... FF8.0 (2011) though (but IE4)
		// outerHTML ... FF11 (2013)
		app.insertAdjacentHTML('afterbegin',
			_colorPicker ? _colorPicker.nodes.colorPicker.outerHTML ||
				new XMLSerializer().serializeToString(_colorPicker.nodes.colorPicker) : // FF before F11
				_data._html.replace(/§/g, prefix));
			// _colorPicker ? _colorPicker.nodes.colorPicker.parentNode.innerHTML : _data._html.replace(/§/g, prefix));
		// _data._html = null;

		app = app.children[0];
		app.style.cssText = _options.initStyle || ''; // for initial hiding...
		// get a better addClass for this....
		// app.className = app.className.split(' ')[0]; // cleanup for multy instances

		return (_options.appendTo || document.body).appendChild(app);
	}

	function getInstanceNodes(colorPicker, THIS) { // check nodes again... are they all needed?
		var all = colorPicker.getElementsByTagName('*'),
			nodes = {colorPicker: colorPicker}, // length ?? // rename nodes.colorPicker
			node,
			className,
			memoCounter = 0,
			regexp = new RegExp(_options.CSSPrefix);

		// nodes.displayStyles = {}; // not needed ... or change to CSS
		nodes.styles = {};
		// nodes.styles.displays = {};

		nodes.textNodes = {};
		nodes.memos = [];
		nodes.testNode = document.createElement('div');

		for (var n = 0, m = all.length; n < m; n++) {
			node = all[n];
			if ((className = node.className) && regexp.test(className)) {
				className = className.split(' ')[0].replace(_options.CSSPrefix, '').replace(/-/g, '_');
				if (/_disp/.test(className)) {
					className = className.replace('_disp', '');
					// nodes.styles.displays[className] = node.style;
					nodes.styles[className] = node.style;
					nodes.textNodes[className] = node.firstChild;
					node.contentEditable = true; // does this slow down rendering??
				} else {
					if (!(/(?:hs|cmyk|Lab).*?(?:butt|labl)/.test(className))) {
						nodes[className] = node;
					}
					if (/(?:cur|sld[^s]|opacity|cont|col)/.test(className)) {
						nodes.styles[className] = /(?:col\d)/.test(className) ? node.children[0].style : node.style;
					}
				}
			} else if (/memo/.test(node.parentNode.className)) {
				nodes.memos.push(node);
			}
		}

		// Chrome bug: focuses contenteditable on mouse over while dragging
		nodes.panelCover = nodes.panel.appendChild(document.createElement('div'));

		return nodes;
	}

	// ------------------------------------------------------ //
	// ---- Add event listners to colorPicker and window ---- //
	// -------------------------------------------------------//

	function installEventListeners(THIS, off) {
		var onOffEvent = off ? removeEvent : addEvent;

		onOffEvent(_nodes.colorPicker, 'mousedown', function(e) {
			var event = e || window.event,
				page = getPageXY(event),
				target = (event.button || event.which) < 2 ?
					(event.target || event.srcElement) : {},
				className = target.className;

			focusInstance(THIS);
			_mainTarget = target;
			stopChange(undefined, 'resetEventListener');
			_action = ''; // needed due to minification of javaScript

			if (target === _nodes.sldl_3 || target === _nodes.curm) {
				_mainTarget = _nodes.sldl_3;
				_mouseMoveAction = changeXYValue;
				_action = 'changeXYValue';
				changeClass(_nodes.slds, 'do-drag');
			} else if (/sldr/.test(className) || target === _nodes.curl || target === _nodes.curr) {
				_mainTarget = _nodes.sldr_4;
				_mouseMoveAction = changeZValue;
				_action = 'changeZValue';
			} else if (target === _nodes.opacity.children[0] || target === _nodes.opacity_slider) {
				_mainTarget = _nodes.opacity;
				_mouseMoveAction = changeOpacityValue;
				_action = 'changeOpacityValue';
			} else if (/-disp/.test(className) && !/HEX-/.test(className)) {
				_mouseMoveAction = changeInputValue;
				_action = 'changeInputValue';
				(target.nextSibling.nodeType === 3 ? target.nextSibling.nextSibling : target.nextSibling).
					appendChild(_nodes.nsarrow); // nextSibling for better text selection
				_valueType = className.split('-disp')[0].split('-');
				_valueType = {type: _valueType[0], z: _valueType[1] || ''};
				changeClass(_nodes.panel, 'start-change');
				_delayState = 0;
			} else if (target === _nodes.resize && !_options.noResize) {
				if (!_options.sizes) {
					getUISizes();
				}
				_mainTarget = _nodes.resizer;
				_mouseMoveAction = resizeApp;
				_action = 'resizeApp';
			} else {
				_mouseMoveAction = undefined;
			}

			if (_mouseMoveAction) {
				_startCoords = {pageX: page.X, pageY: page.Y};
				_mainTarget.style.display = 'block'; // for resizer...
				_targetOrigin = getOrigin(_mainTarget);
				_targetOrigin.width = _nodes.opacity.offsetWidth; // ???????
				_targetOrigin.childWidth = _nodes.opacity_slider.offsetWidth; // ???????
				_mainTarget.style.display = ''; // ??? for resizer...
				_mouseMoveAction(event);
				addEvent(_isIE ? document.body : window, 'mousemove', _mouseMoveAction);
				_renderTimer = window[requestAnimationFrame](renderAll);
			} else {
				// console.log(className)
				// console.log(THIS.nodes[className.split(' ')[0].replace('cp-', '').replace('-', '_')])
				// resize, button states, etc...
			}

			// if (_mouseMoveAction !== changeInputValue) preventDefault(event);
			if (!/-disp/.test(className)) {
				return preventDefault(event);
				// document.activeElement.blur();
			}
		});

		onOffEvent(_nodes.colorPicker, 'click', function(e) {
			focusInstance(THIS);
			buttonActions(e);
		});

		onOffEvent(_nodes.colorPicker, 'dblclick', buttonActions);

		onOffEvent(_nodes.colorPicker, 'keydown', function(e) {
			focusInstance(THIS);
			keyControl(e);
		});

		// keydown is before keypress and focuses already
		onOffEvent(_nodes.colorPicker, 'keypress', keyControl);
		// onOffEvent(_nodes.colorPicker, 'keyup', keyControl);

		onOffEvent(_nodes.colorPicker, 'paste', function(e) {
			e.target.firstChild.data = e.clipboardData.getData('Text');
			return preventDefault(e);
		});
	}

	addEvent(_isIE ? document.body : window, 'mouseup', stopChange);

	// ------------------------------------------------------ //
	// --------- Event listner's callback functions  -------- //
	// -------------------------------------------------------//

	function stopChange(e, action) {
		var mouseMoveAction = _mouseMoveAction;

		if (_mouseMoveAction) { // why??? please test again...
			// if (document.selection && _mouseMoveAction !== changeInputValue) {
			// 	//ie -> prevent showing the accelerator menu
			// 	document.selection.empty();
			// }
			window[cancelAnimationFrame](_renderTimer);
			removeEvent(_isIE ? document.body : window, 'mousemove', _mouseMoveAction);
			if (_delayState) { // hapens on inputs
				_valueType = {type: 'alpha'};
				renderAll();
			}
			// this is dirty... has to do with M|W|! button
			if (typeof _mouseMoveAction === 'function' || typeof _mouseMoveAction === 'number') {
				delete _options.webUnsave;
			}

			_delayState = 1;
			_mouseMoveAction = undefined;

			changeClass(_nodes.slds, 'do-drag', '');
			changeClass(_nodes.panel, '(?:start-change|do-change)', '');

			_nodes.resizer.style.cssText = '';
			_nodes.panelCover.style.cssText = '';

			_nodes.memo_store.style.cssText = 'background-color: ' +
				color2string(_colors.RND.rgb) + '; ' + getOpacityCSS(_colors.alpha);
			_nodes.memo.className = _nodes.memo.className.replace(/\s+(?:dark|light)/, '') +
				// (/dark/.test(_nodes.colorPicker.className) ? ' dark' : ' light');
				(_colors['rgbaMix' + _bgTypes[_options.alphaBG]].luminance < 0.22 ? ' dark' : ' light');
				// (_colors.rgbaMixCustom.luminance < 0.22 ? ' dark' : ' light')

			_valueType = undefined;

			resetCursors();

			if (_options.actionCallback) {
				_options.actionCallback(e, _action || mouseMoveAction.name || action || 'external');
			}
		}
	}

	function changeXYValue(e) {
		var event = e || window.event,
			scale = _options.scale,
			page = getPageXY(event),
			x = (page.X - _targetOrigin.left) * (scale === 4 ? 2 : scale),
			y = (page.Y - _targetOrigin.top) * scale,
			mode = _options.mode;

		_colors[mode.type][mode.x] = limitValue(x / 255, 0, 1);
		_colors[mode.type][mode.y] = 1 - limitValue(y / 255,  0, 1);
		convertColors();
		return preventDefault(event);
	}

	function changeZValue(e) { // make this part of changeXYValue
		var event = e || window.event,
			page = getPageXY(event),
			z = (page.Y - _targetOrigin.top) * _options.scale,
			mode = _options.mode;

		_colors[mode.type][mode.z] = 1 - limitValue(z / 255,  0, 1);
		convertColors();
		return preventDefault(event);
	}

	function changeOpacityValue(e) {
		var event = e || window.event,
			page = getPageXY(event);

		_newData = true;
		_colors.alpha = limitValue(_math.round(
			(page.X - _targetOrigin.left) / _targetOrigin.width * 100), 0, 100
		) / 100;
		convertColors('alpha');
		return preventDefault(event);
	}

	function changeInputValue(e) {
		var event = e || window.event,
			page = getPageXY(event),
			delta = _startCoords.pageY - page.Y,
			delayOffset = _options.delayOffset,
			type = _valueType.type,
			isAlpha = type === 'alpha',
			ranges;

		if (_delayState || _math.abs(delta) >= delayOffset) {
			if (!_delayState) {
				_delayState = (delta > 0 ? -delayOffset : delayOffset) +
					(+_mainTarget.firstChild.data) * (isAlpha ? 100 : 1);
				_startCoords.pageY += _delayState;
				delta += _delayState;
				_delayState = 1;
				changeClass(_nodes.panel, 'start-change', 'do-change');
				_nodes.panelCover.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0';
				// window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				document.activeElement.blur();
				_renderTimer = window[requestAnimationFrame](renderAll);
			}

			if (type === 'cmyk' && _options.cmyOnly) {
				type = 'cmy';
			}

			if (isAlpha) {
				_newData = true;
				_colors.alpha = limitValue(delta / 100, 0, 1);
			} else {
				ranges = _valueRanges[type][_valueType.z];
				_colors[type][_valueType.z] = type === 'Lab' ? limitValue(delta, ranges[0], ranges[1]) :
					limitValue(delta / ranges[1], 0, 1);
			}
			convertColors(isAlpha ? 'alpha' : type);
			// event.returnValue is deprecated. Please use the standard event.preventDefault() instead.
			// event.returnValue = false; // see: pauseEvent(event);
			return preventDefault(event);
		}
	}

	function keyControl(e) { // this is quite big for what it does...
		var event = e || window.event,
			keyCode =  event.which || event.keyCode,
			key = String.fromCharCode(keyCode),
			elm = document.activeElement,

			cln = elm.className.replace(_options.CSSPrefix, '').split('-'),
			type = cln[0],
			mode = cln[1],

			isAlpha = type === 'alpha',
			isHex = type === 'HEX',
			arrowKey = {k40: -1, k38: 1, k34: -10, k33: 10}['k' + keyCode] / (isAlpha ? 100 : 1),
			validKeys = {'HEX': /[0-9a-fA-F]/, 'Lab': /[\-0-9]/, 'alpha': /[\.0-9]/}[type] || /[0-9]/,
			valueRange = _valueRanges[type][type] || _valueRanges[type][mode], // let op!

			textNode = elm.firstChild, // chnge on TAB key
			rangeData = caret(elm),
			origValue = textNode.data, // do not change
			value,
			val = origValue === '0' && !isHex ? [] : origValue.split(''); // gefixt

		if (/^(?:27|13)$/.test(keyCode)) { // ENTER || ESC
			preventDefault(event);
			elm.blur();
		} else if (event.type === 'keydown') { // functional keys
			if (arrowKey) { // arrow/page keys
				value = limitValue(_math.round((+origValue + arrowKey) * 1e+6) / 1e+6, valueRange[0], valueRange[1]);
			} else if (/^(?:8|46)$/.test(keyCode)) { // DELETE / BACKSPACE
				if (!rangeData.range) {
					rangeData.range++;
					rangeData.start -= keyCode === 8 ? 1 : 0;
				}
				val.splice(rangeData.start, rangeData.range);
				value = val.join('') || '0'; // never loose elm.firstChild
			}

			if (value !== undefined) { // prevent keypress
				preventDefault(event, true);
			}
		} else if (event.type === 'keypress') {
			if (!/^(?:37|39|8|46|9)$/.test(keyCode)) { // left, right,DEL, BACK, TAB for FF
				preventDefault(event, true);
			}
			if (validKeys.test(key)) { // regular input
				val.splice(rangeData.start, rangeData.range, key);
				value = val.join('');
			}
			rangeData.start++;
		}

		if (keyCode === 13 && isHex) {
			if (textNode.data.length % 3 === 0 || textNode.data === '0') { // textNode.data.length && 
				return _colorPicker.setColor(textNode.data === '0' ? '000' : textNode.data, 'rgb', _colors.alpha, true);
			} else {
				preventDefault(event, true);
				return elm.focus();
			}
		}

		if (isHex && value !== undefined) {
			value = /^0+/.test(value) ? value : parseInt(''+value, 16) || 0;
		}

		if (value !== undefined && value !== '' && +value >= valueRange[0] && +value <= valueRange[1]) {
			if (isHex) {
				value = value.toString(16).toUpperCase() || '0';
			}
			if (isAlpha) {
				_colors[type] = +value;
			} else if (!isHex) {
				_colors[type][mode] = +value / (type === 'Lab' ? 1 : valueRange[1]);
			}
			convertColors(isAlpha ? 'alpha' : type);

			preRenderAll(_colors);
			_mouseMoveAction = true;
			stopChange(e, event.type);

			textNode.data = value; // if 
			caret(elm, _math.min(elm.firstChild.data.length, rangeData.start < 0 ? 0 : rangeData.start));
		}
	}

	function buttonActions(e) {
		var event = e || window.event,
			target = event.target || event.srcElement,
			targetClass = target.className,
			parent = target.parentNode,
			options = _options,
			RGB = _colors.RND.rgb,
			customBG, alphaBG,
			mode = _options.mode,
			newMode = '',
			prefix = options.CSSPrefix,
			isModeButton = /(?:hs|rgb)/.test(parent.className) && /^[HSBLRG]$/.test(
				target.firstChild ? target.firstChild.data : ''
			),
			isDblClick = /dblc/.test(event.type),
			buttonAction = ''; // think this over again....

		if (isDblClick && !isModeButton) {
			return;
		} else if (targetClass.indexOf('-labl ' + prefix + 'labl') !== -1) { // HSB -> HSL; CMYK -> Lab buttons
			changeClass(_nodes[targetClass.split('-')[0]], prefix + 'hide', '');
			changeClass(_nodes[parent.className.split('-')[1]], prefix + 'hide');
		} else if (targetClass.indexOf(prefix + 'butt') !== -1) { // BUTTONS
			if (isModeButton) { // set render modes
				if (isDblClick && _options.scale === 2) {
					newMode = /hs/.test(mode.type) ? 'rgb' : /hide/.test(_nodes.hsl.className) ? 'hsv' : 'hsl';
					newMode = newMode + '-' + newMode[mode.type.indexOf(mode.z)];
				}
				_colorPicker.setMode(newMode ? newMode : targetClass.replace('-butt', '').split(' ')[0]);
				buttonAction = 'modeChange';
			} else if (/^[rgb]/.test(targetClass)) { // no vertical slider rendering in RGB mode
				newMode = targetClass.split('-')[1];
				changeClass(_nodes.colorPicker, 'no-rgb-' + newMode,
					(options['noRGB' + newMode] = !options['noRGB' + newMode]) ? undefined : '');
				buttonAction = 'noRGB' + newMode;
				// preRenderAll();
			} else if (target === _nodes.alpha_labl) { // alpha button right (background of raster)
				customBG = options.customBG;
				alphaBG = options.alphaBG;
				changeClass(_nodes.colorPicker, 'alpha-bg-' + alphaBG, 'alpha-bg-' +
					(alphaBG = options.alphaBG = e.data || (alphaBG === 'w' ? (customBG ? 'c' : 'b') :
					alphaBG === 'c' ? 'b' : 'w')));
				target.firstChild.data = alphaBG.toUpperCase();
				_nodes.ctrl.style.backgroundColor = _nodes.memo.style.backgroundColor =
					alphaBG !== 'c' ? '' : 'rgb(' + _math.round(customBG.r * 255) + ', ' +
					_math.round(customBG.g * 255) + ', ' +
					_math.round(customBG.b * 255) + ')';
				_nodes.raster.style.cssText = _nodes.raster_bg.previousSibling.style.cssText =
					alphaBG !== 'c' ? '' : getOpacityCSS(customBG.luminance < 0.22 ? 0.5 : 0.4);
				buttonAction = 'alphaBackground';
			} else if (target === _nodes.alpha_butt) { // alpha button left (disable alpha rendering)
				changeClass(_nodes.colorPicker, 'mute-alpha', (options.muteAlpha = !options.muteAlpha) ? undefined : '');
				buttonAction = 'alphaState';
			} else if (target === _nodes.HEX_butt) { // make it on/off
				changeClass(_nodes.colorPicker, 'no-HEX', (options.HEXState = !options.HEXState) ? undefined : '');
				buttonAction = 'HEXState';
			} else if (target === _nodes.HEX_labl) { // web save state change
				var isWebSave = _colors.saveColor === 'web save';

				if (_colors.saveColor !== 'web smart' && !isWebSave) {
					options.webUnsave = copyColor(RGB);
					_colorPicker.setColor(_colors.webSmart, 'rgb');
				} else if (!isWebSave) {
					if (!options.webUnsave) {
						options.webUnsave = copyColor(RGB);
					}
					_colorPicker.setColor(_colors.webSave, 'rgb');
				} else {
					_colorPicker.setColor(options.webUnsave, 'rgb');
				}
				buttonAction = 'webColorState';
			} else if (/Lab-x-labl/.test(targetClass)) { //target === _nodes.cmyk_type) {
				// switch between CMYK and CMY
				changeClass(_nodes.colorPicker, 'cmy-only', (options.cmyOnly = !options.cmyOnly) ? undefined : '');
				buttonAction = 'cmykState';
			}
		} else if (target === _nodes.bsav) { // SAVE
			saveAsBackground();
			buttonAction = 'saveAsBackground';
		} else if (target === _nodes.bres) { // RESET
			var tmpColor = copyColor(RGB),
				tmpAlpha = _colors.alpha;

			// a bit heavy but... doesn't matter here
			// newCol, type, alpha, forceRender
			_colorPicker.setColor(options.color);
			saveAsBackground();
			_colorPicker.setColor(tmpColor, 'rgb', tmpAlpha);
			buttonAction = 'resetColor';
		} else if (parent === _nodes.col1) { // COLOR left
			// _colors.hsv.h = (_colors.hsv.h + 0.5) % 1; // not acurate
			_colors.hsv.h -= (_colors.hsv.h > 0.5 ? 0.5 : -0.5);
			convertColors('hsv');
			buttonAction = 'shiftColor';

		} else if (parent === _nodes.col2) { // COLOR right
			_colorPicker.setColor(target.style.backgroundColor, 'rgb', _colors.background.alpha);
			buttonAction = 'setSavedColor';
		} else if (parent === _nodes.memo) { // MEMORIES // revisit...
			var resetBlink = function() {
					if (_nodes.memos.blinker) _nodes.memos.blinker.style.cssText = _nodes.memos.cssText;
				},
				doBlink = function(elm) {
					_nodes.memos.blinker = elm;
					elm.style.cssText = 'background-color:' + (_colors.RGBLuminance > 0.22 ? '#333' : '#DDD');
					window.setTimeout(resetBlink, 200);
				};

			if (target === _nodes.memo_cursor) { // save color in memo
				resetBlink();
				_nodes.memos.blinker = undefined;
				_nodes.testNode.style.cssText = _nodes.memo_store.style.cssText;
				_nodes.memos.cssText = _nodes.testNode.style.cssText; // ...how browser sees css
				for (var n = _nodes.memos.length - 1; n--; ) { // check if color already exists
					if (_nodes.memos.cssText === _nodes.memos[n].style.cssText) {
						doBlink(_nodes.memos[n]); // sets _nodes.memos.blinker
						break;
					}
				}
				if (!_nodes.memos.blinker) { // right shift colors
					for (var n = _nodes.memos.length - 1; n--; ) {
						_nodes.memos[n + 1].style.cssText = _nodes.memos[n].style.cssText;
					}
					_nodes.memos[0].style.cssText = _nodes.memo_store.style.cssText;
				}
				buttonAction = 'toMemory';
			} else { // reset color from memo
				resetBlink();
				_colorPicker.setColor(target.style.backgroundColor, 'rgb', target.style.opacity || 1);
				_nodes.memos.cssText = target.style.cssText;
				doBlink(target);
				// this is dirty... has to do with M|W|! button
				_mouseMoveAction = 1;
				buttonAction = 'fromMemory';
			}

		}
		// think this over again, does this need to be like this??
		if (buttonAction) {
			preRenderAll(_colors);
			_mouseMoveAction = _mouseMoveAction || true; // !!!! search for: // this is dirty...
			stopChange(e, buttonAction);
		}
	}

	function resizeApp(e, size) {
		var event = e || window.event,
			page = event ? getPageXY(event) : {},
			isSize = size !== undefined,
			x = isSize ? size : page.X - _targetOrigin.left + 8,
			y = isSize ? size : page.Y - _targetOrigin.top + 8,
			values = [' S XS XXS', ' S XS', ' S', ''],
			sizes = _options.sizes, // from getUISizes();
			currentSize = isSize ? size :
				y < sizes.XXS[1] + 25 ? 0 :
				x < sizes.XS[0] + 25 ? 1 :
				x < sizes.S[0] + 25 || y < sizes.S[1] + 25 ? 2 : 3,
			value = values[currentSize],
			isXXS = false,
			mode,
			tmp = '';

		if (_cashedVars.resizer !== value) {
			isXXS = /XX/.test(value);
			mode = _options.mode;

			if (isXXS && (!/hs/.test(mode.type) || mode.z === 'h')) {
				tmp = mode.type + '-' + mode.z;
				_colorPicker.setMode(/hs/.test(mode.type) ? mode.type + '-s': 'hsv-s');
				_options.mode.original = tmp;
			} else if (mode.original) {
				// setMode(mode) creates a new object so mode.original gets deleted automatically
				_colorPicker.setMode(mode.original);
			}

			_nodes.colorPicker.className = _nodes.colorPicker.className.replace(/\s+(?:S|XS|XXS)/g, '') + value;
			_options.scale = isXXS ? 4 : /S/.test(value) ? 2 : 1;
			_options.currentSize = currentSize;

			_cashedVars.resizer = value;

			// fix this... from this point on inside if() ... convertColors();
			_newData = true;
			renderAll();
			resetCursors();
		}

		_nodes.resizer.style.cssText = 'display: block;' +
			'width: '  + (x > 10 ? x : 10) + 'px;' +
			'height: ' + (y > 10 ? y : 10) + 'px;';
	}

	// ------------------------------------------------------ //
	// --- Colors calculation and rendering related stuff  --- //
	// -------------------------------------------------------//

	function setMode(mode) {
		var ModeMatrix = {
			rgb_r : {x: 'b', y: 'g'},
			rgb_g : {x: 'b', y: 'r'},
			rgb_b : {x: 'r', y: 'g'},

			hsv_h : {x: 's', y: 'v'},
			hsv_s : {x: 'h', y: 'v'},
			hsv_v : {x: 'h', y: 's'},

			hsl_h : {x: 's', y: 'l'},
			hsl_s : {x: 'h', y: 'l'},
			hsl_l : {x: 'h', y: 's'}
		},
		key = mode.replace('-', '_'),
		regex = '\\b(?:rg|hs)\\w\\-\\w\\b'; // \\b\\w{3}\\-\\w\\b';

		// changeClass(_nodes.colorPicker, '(?:.*?)$', mode);
		// changeClass(_nodes.colorPicker, '\\b\\w{3}\\-\\w\\b', mode);
		// changeClass(_nodes.slds, '\\b\\w{3}\\-\\w\\b', mode);
		changeClass(_nodes.panel, regex, mode);
		changeClass(_nodes.slds, regex, mode);

		mode = mode.split('-');
		return _options.mode = {
			type: mode[0],
			x: ModeMatrix[key].x,
			y: ModeMatrix[key].y,
			z: mode[1]
		};
	}

	function initSliders() { // function name...
		var regex = /\s+(?:hue-)*(?:dark|light)/g,
			className = 'className'; // minification

		_nodes.curl[className] = _nodes.curl[className].replace(regex, ''); // .....
		_nodes.curr[className] = _nodes.curr[className].replace(regex, ''); // .....
		_nodes.slds[className] = _nodes.slds[className].replace(regex, '');
		// var sldrs = ['sldr_2', 'sldr_4', 'sldl_3'];
		// for (var n = sldrs.length; n--; ) {
		// 	_nodes[sldrs[n]][className] = _options.CSSPrefix + sldrs[n].replace('_', '-');
		// }
		_nodes.sldr_2[className] = _options.CSSPrefix + 'sldr-2';
		_nodes.sldr_4[className] = _options.CSSPrefix + 'sldr-4';
		_nodes.sldl_3[className] = _options.CSSPrefix + 'sldl-3';

		for (var style in _nodes.styles) {
			if (!style.indexOf('sld')) _nodes.styles[style].cssText = '';
		}
		_cashedVars = {};
	}

	function resetCursors() {
		// _renderVars.isNoRGB = undefined;
		_nodes.styles.curr.cssText = _nodes.styles.curl.cssText; // only coordinates
		_nodes.curl.className = _options.CSSPrefix + 'curl' + (
			_renderVars.noRGBZ ? ' ' + _options.CSSPrefix + 'curl-' +_renderVars.noRGBZ: '');
		_nodes.curr.className = _options.CSSPrefix + 'curr ' + _options.CSSPrefix + 'curr-' +
			(_options.mode.z === 'h' ? _renderVars.HUEContrast : _renderVars.noRGBZ ?
				_renderVars.noRGBZ : _renderVars.RGBLuminance);
	}

	function convertColors(type) {
		preRenderAll(_colorInstance.setColor(undefined, type || _options.mode.type));
		_newData = true;
	}

	function saveAsBackground(refresh) {
		_colorInstance.saveAsBackground();
		_nodes.styles.col2.cssText = 'background-color: ' + color2string(_colors.background.RGB) + ';' +
			getOpacityCSS(_colors.background.alpha);
		
		if (refresh) {
			preRenderAll(_colors);
			// renderAll();
		}
		return (_colors);
	}

	function preRenderAll(colors) {
		var _Math = _math,
			renderVars = _renderVars,
			bgType = _bgTypes[_options.alphaBG];

		renderVars.hueDelta = _Math.round(colors['rgbaMixBGMix' + bgType].hueDelta * 100);
		// renderVars.RGBLuminanceDelta = _Math.round(colors.RGBLuminanceDelta * 100);
		renderVars.luminanceDelta = _Math.round(colors['rgbaMixBGMix' + bgType].luminanceDelta * 100);
		renderVars.RGBLuminance = colors.RGBLuminance > 0.22 ? 'light' : 'dark';
		renderVars.HUEContrast = colors.HUELuminance > 0.22 ? 'light' : 'dark';
		// renderVars.contrast = renderVars.RGBLuminanceDelta > renderVars.hueDelta ? 'contrast' : '';
		renderVars.contrast = renderVars.luminanceDelta > renderVars.hueDelta ? 'contrast' : '';
		renderVars.readabiltiy =
			colors['rgbaMixBGMix' + bgType].WCAG2Ratio >= 7 ? 'green' :
			colors['rgbaMixBGMix' + bgType].WCAG2Ratio >= 4.5 ? 'orange': '';
		renderVars.noRGBZ = _options['no' + _options.mode.type.toUpperCase() + _options.mode.z] ?
			(_options.mode.z === 'g' && colors.rgb.g < 0.59 || _options.mode.z === 'b' || _options.mode.z === 'r' ?
			'dark' : 'light') : undefined;
	}

	function renderAll() { // maybe render alpha seperately...
		if (_mouseMoveAction) {
			// _renderTimer = window[requestAnimationFrame](renderAll);
			if (!_newData) return (_renderTimer = window[requestAnimationFrame](renderAll));
			_newData = false;
		}
		// console.time('renderAll');
		var options = _options,
			mode = options.mode,
			scale = options.scale,
			prefix = options.CSSPrefix,
			colors = _colors,
			nodes = _nodes,
			CSS = nodes.styles,
			textNodes = nodes.textNodes,
			valueRanges = _valueRanges,
			valueType = _valueType,
			renderVars = _renderVars,
			cashedVars = _cashedVars,

			_Math = _math,
			_getOpacityCSS = getOpacityCSS,
			_color2string = color2string,

			a = 0,
			b = 0,
			x  = colors[mode.type][mode.x],
			X = _Math.round(x * 255 / (scale === 4 ? 2 : scale)),
			y_ = colors[mode.type][mode.y],
			y = 1 - y_,
			Y = _Math.round(y * 255 / scale),
			z  = 1 - colors[mode.type][mode.z],
			Z = _Math.round(z * 255 / scale),
			coords = (1 === 1) ? [x, y_] : [0, 0], // (1 === 2) button label up

			isRGB = mode.type === 'rgb',
			isHue = mode.z === 'h',
			isHSL = mode.type === 'hsl',
			isHSL_S = isHSL && mode.z === 's',
			moveXY = _mouseMoveAction === changeXYValue,
			moveZ  = _mouseMoveAction === changeZValue,
			display, tmp, value, slider;

		if (isRGB) {
			if (coords[0] >= coords[1]) b = 1; else a = 1;
			if (cashedVars.sliderSwap !== a) {
				nodes.sldr_2.className = options.CSSPrefix + 'sldr-' + (3 - a);
				cashedVars.sliderSwap = a;
			}
		}
		if ((isRGB && !moveZ) || (isHue && !moveXY) || (!isHue && !moveZ)) {
			CSS[isHue ? 'sldl_2' : 'sldr_2'][isRGB ? 'cssText' : 'backgroundColor'] =
				isRGB ? _getOpacityCSS((coords[a] - coords[b]) / (1 - (coords[b]) || 0)) : _color2string(colors.hueRGB);
		}
		if (!isHue) {
			if (!moveZ)  CSS.sldr_4.cssText = _getOpacityCSS(isRGB ? coords[b] : isHSL_S ? _Math.abs(1 - y * 2) : y);
			if (!moveXY) CSS.sldl_3.cssText = _getOpacityCSS(isHSL && mode.z === 'l' ? _Math.abs(1 - z * 2) : z);
			if (isHSL) { // switch slider class name for black/white color half way through in HSL(S|L) mode(s)
				slider = isHSL_S ? 'sldr_4' : 'sldl_3';
				tmp = isHSL_S ? 'r-' : 'l-';
				value = isHSL_S ? (y > 0.5 ? 4 : 3) : (z > 0.5 ? 3 : 4);

				if (cashedVars[slider] !== value) {
					nodes[slider].className = options.CSSPrefix + 'sld' + tmp + value;
					cashedVars[slider] = value;
				}
			}
		}

		if (!moveZ) CSS.curm.cssText = 'left: ' + X + 'px; top: ' + Y + 'px;';
		if (!moveXY) CSS.curl.top = Z + 'px';
		if (valueType) CSS.curr.top = Z + 'px'; // && valueType.type !== mode.type
		if ((valueType && valueType.type === 'alpha') || _mainTarget === nodes.opacity) {
			CSS.opacity_slider.left = options.opacityPositionRelative ? (colors.alpha * (
				(_targetOrigin.width || nodes.opacity.offsetWidth) -
				(_targetOrigin.childWidth || nodes.opacity_slider.offsetWidth))) + 'px' :
				(colors.alpha * 100) + '%';
		}

		CSS.col1.cssText = 'background-color: ' + _color2string(colors.RND.rgb) + '; ' +
			(options.muteAlpha ? '' : _getOpacityCSS(colors.alpha));
		CSS.opacity.backgroundColor = _color2string(colors.RND.rgb);
		CSS.cold.width = renderVars.hueDelta + '%';
		CSS.cont.width = renderVars.luminanceDelta + '%';

		for (display in textNodes) {
			tmp = display.split('_');
			if (options.cmyOnly) {
				tmp[0] = tmp[0].replace('k', '');
			}
			value = tmp[1] ? colors.RND[tmp[0]][tmp[1]] : colors.RND[tmp[0]] || colors[tmp[0]];
			if (cashedVars[display] !== value) {
				cashedVars[display] = value;
				textNodes[display].data = value > 359.5 && display !== 'HEX' ? 0 : value;

				if (display !== 'HEX' && !options.noRangeBackground) {
					value = colors[tmp[0]][tmp[1]] !== undefined ? colors[tmp[0]][tmp[1]] : colors[tmp[0]];
					if (tmp[0] === 'Lab') {
						value = (value - valueRanges[tmp[0]][tmp[1]][0]) /
							(valueRanges[tmp[0]][tmp[1]][1] - valueRanges[tmp[0]][tmp[1]][0]);
					}
					CSS[display].backgroundPosition = _Math.round((1 - value) * 100) + '% 0%';
				}
			}
		}
		// Lab out of gammut
		tmp = colors._rgb ? [
			colors._rgb.r !== colors.rgb.r,
			colors._rgb.g !== colors.rgb.g,
			colors._rgb.b !== colors.rgb.b
		] : [];
		if (tmp.join('') !== cashedVars.outOfGammut) {
			nodes.rgb_r_labl.firstChild.data = tmp[0] ? '!' : ' ';
			nodes.rgb_g_labl.firstChild.data = tmp[1] ? '!' : ' ';
			nodes.rgb_b_labl.firstChild.data = tmp[2] ? '!' : ' ';
			cashedVars.outOfGammut = tmp.join('');
		}
		if (renderVars.noRGBZ) {
			if (cashedVars.noRGBZ !== renderVars.noRGBZ) {
				nodes.curl.className = prefix + 'curl ' + prefix + 'curl-' + renderVars.noRGBZ;
					
				if (!moveZ) {
					nodes.curr.className = prefix + 'curr ' + prefix + 'curr-' + renderVars.noRGBZ;
				}
				cashedVars.noRGBZ = renderVars.noRGBZ;
			}
		}
		if (cashedVars.HUEContrast !== renderVars.HUEContrast && mode.z === 'h') {
			nodes.slds.className = nodes.slds.className.replace(/\s+hue-(?:dark|light)/, '') +
				' hue-' + renderVars.HUEContrast;
			if (!moveZ) {
				nodes.curr.className = prefix + 'curr ' + prefix + 'curr-' + renderVars.HUEContrast;
			}
			cashedVars.HUEContrast = renderVars.HUEContrast;
		} else if (cashedVars.RGBLuminance !== renderVars.RGBLuminance) { // test for no else
			nodes.colorPicker.className = nodes.colorPicker.className.replace(/\s+(?:dark|light)/, '') +
				' ' + renderVars.RGBLuminance;
			if (!moveZ && mode.z !== 'h' && !renderVars.noRGBZ) {
				nodes.curr.className = prefix + 'curr ' + prefix + 'curr-' + renderVars.RGBLuminance;
			}
			cashedVars.RGBLuminance = renderVars.RGBLuminance;
		}

		if (cashedVars.contrast !== renderVars.contrast || cashedVars.readabiltiy !== renderVars.readabiltiy) {
			nodes.ctrl.className = nodes.ctrl.className.replace(' contrast', '').replace(/\s*(?:orange|green)/, '') +
				(renderVars.contrast ? ' ' + renderVars.contrast : '') +
				(renderVars.readabiltiy ? ' ' + renderVars.readabiltiy : '');
			cashedVars.contrast = renderVars.contrast;
			cashedVars.readabiltiy = renderVars.readabiltiy;
		}

		if (cashedVars.saveColor !== colors.saveColor) {
			nodes.HEX_labl.firstChild.data = !colors.saveColor ? '!' : colors.saveColor === 'web save' ? 'W' : 'M';
			cashedVars.saveColor = colors.saveColor;
		}

		if (options.renderCallback) {
			options.renderCallback(colors, mode); // maybe more parameters
		}

		if (_mouseMoveAction) {
			_renderTimer = window[requestAnimationFrame](renderAll);
		}

		// console.timeEnd('renderAll')
	}


	// ------------------------------------------------------ //
	// ------------------ helper functions ------------------ //
	// -------------------------------------------------------//

	function copyColor(color) {
		var newColor = {};

		for (var n in color) {
			newColor[n] = color[n];
		}
		return newColor;
	}

	// function color2string(color, type) {
	// 	var out = [],
	// 		n = 0;

	// 	type = type || 'rgb';
	// 	while (type.charAt(n)) { // IE7 // V8 type[n] || 
	// 		out.push(color[type.charAt(n)]);
	// 		n++;
	// 	}
	// 	return type + '(' + out.join(', ') + ')';
	// }

	function color2string(color, type) { // ~2 x faster on V8
		var out = '',
			t = (type || 'rgb').split(''),
			n = t.length;

		for ( ; n--; ) {
			out = ', ' + color[t[n]] + out;
		}
		return (type || 'rgb') + '(' + out.substr(2) + ')';
	}


	function limitValue(value, min, max) {
		// return Math.max(min, Math.min(max, value)); // faster??
		return (value > max ? max : value < min ? min : value);
	}

	function getOpacityCSS(value) {
		if (value === undefined) value = 1;

		if (_doesOpacity) {
			return 'opacity: ' + (_math.round(value * 10000000000) / 10000000000) + ';'; // value.toFixed(16) = 99% slower
			// some speed test:
			// return ['opacity: ', (Math.round(value * 1e+10) / 1e+10), ';'].join('');
		} else {
			return 'filter: alpha(opacity=' + _math.round(value * 100) + ');';
		}
	}

	function preventDefault(e, skip) {
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		if (!skip) window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		return false;
	}

	function changeClass(elm, cln, newCln) {
		return  !elm ? false : elm.className = (newCln !== undefined ?
			elm.className.replace(new RegExp('\\s+?' + cln, 'g'), newCln ? ' ' + newCln : '') :
			elm.className + ' ' + cln);
	}

	function getOrigin(elm) {
		var box = (elm.getBoundingClientRect) ? elm.getBoundingClientRect() : {top: 0, left: 0},
			doc = elm && elm.ownerDocument,
			body = doc.body,
			win = doc.defaultView || doc.parentWindow || window,
			docElem = doc.documentElement || body.parentNode,
			clientTop  = docElem.clientTop  || body.clientTop  || 0, // border on html or body or both
			clientLeft =  docElem.clientLeft || body.clientLeft || 0;

		return {
			left: box.left + (win.pageXOffset || docElem.scrollLeft) - clientLeft,
			top:  box.top  + (win.pageYOffset || docElem.scrollTop)  - clientTop
		};
	}

	function getPageXY(e) {
		var doc = window.document;

		return {
			X: e.pageX || e.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft,
			Y: e.pageY || e.clientY + doc.body.scrollTop + doc.documentElement.scrollTop
		};
	}

	function addEvent(obj, type, func) {
		addEvent.cache = addEvent.cache || {
			_get: function(obj, type, func, checkOnly) {
				var cache = addEvent.cache[type] || [];

				for (var n = cache.length; n--; ) {
					if (obj === cache[n].obj && '' + func === '' + cache[n].func) {
						func = cache[n].func;
						if (!checkOnly) {
							cache[n] = cache[n].obj = cache[n].func = null;
							cache.splice(n, 1);
						}
						return func;
					}
				}
			},
			_set: function(obj, type, func) {
				var cache = addEvent.cache[type] = addEvent.cache[type] || [];
				
				if (addEvent.cache._get(obj, type, func, true)) {
					return true;
				} else {
					cache.push({
						func: func,
						obj: obj
					});
				}
			}
		};

		if (!func.name && addEvent.cache._set(obj, type, func) || typeof func !== 'function') {
			return;
		}

		if (obj.addEventListener) obj.addEventListener(type, func, false);
		else obj.attachEvent('on' + type, func);
	}

	function removeEvent(obj, type, func) {
		if (typeof func !== 'function') return;
		if (!func.name) {
			func = addEvent.cache._get(obj, type, func) || func;
		}

		if (obj.removeEventListener) obj.removeEventListener(type, func, false);
		else obj.detachEvent('on' + type, func);
	}

	function caret(target, pos) { // only for contenteditable
		var out = {};

		if (pos === undefined) { // get
			if (window.getSelection) { // HTML5
				target.focus();
				var range1 = window.getSelection().getRangeAt(0),
					range2 = range1.cloneRange();
				range2.selectNodeContents(target);
				range2.setEnd(range1.endContainer, range1.endOffset);
				out = {
					end: range2.toString().length,
					range: range1.toString().length
				};
			} else { // IE < 9
				target.focus();
				var range1 = document.selection.createRange(),
					range2 = document.body.createTextRange();
				range2.moveToElementText(target);
				range2.setEndPoint('EndToEnd', range1);
				out = {
					end: range2.text.length,
					range: range1.text.length
				};
			}
			out.start = out.end - out.range;
			return out;
		}
		// set
		if (pos == -1) pos = target['text']().length;
		
		if (window.getSelection) { // HTML5
			target.focus();
			window.getSelection().collapse(target.firstChild, pos);
		} else { // IE < 9
			var range = document.body.createTextRange();
			range.moveToElementText(target);
			range.moveStart('character', pos);
			range.collapse(true);
			range.select();
		}
		return pos;
	}

	// ------------- requestAnimationFrame shim ------------- //
	// ---------- quite optimized for minification ---------- //

	for(var n = vendors.length; n-- && !window[requestAnimationFrame]; ) {
		window[requestAnimationFrame] = window[vendors[n] + 'Request' + animationFrame];
		window[cancelAnimationFrame]  = window[vendors[n] + 'Cancel'  + animationFrame] ||
			window[vendors[n] + 'CancelRequest' + animationFrame];
	}

	window[requestAnimationFrame] = window[requestAnimationFrame] || function(callback) {
		// this is good enough... and better than setTimeout
			return window.setTimeout(callback, 1000 / _options.fps);
		// return _renderTimer ? _renderTimer : window.setInterval(callback, 1000 / _options.fps);
	};

	window[cancelAnimationFrame] = window[cancelAnimationFrame] || function(id) {
		// console.log('OFF-', id + '-' + _renderTimer)
		window.clearTimeout(id);
		return _renderTimer = null;
	};

})(window);

/*! javascript_implementation/jsColor.js */
(function (window) {
	window.jsColorPicker = function(selectors, config) {
		var renderCallback = function(colors, mode) {
				var options = this,
					input = options.input,
					patch = options.patch,
					RGB = colors.RND.rgb,
					HSL = colors.RND.hsl,
					AHEX = options.isIE8 ? (colors.alpha < 0.16 ? '0' : '') +
						(Math.round(colors.alpha * 100)).toString(16).toUpperCase() + colors.HEX : '',
					RGBInnerText = RGB.r + ', ' + RGB.g + ', ' + RGB.b,
					RGBAText = 'rgba(' + RGBInnerText + ', ' + colors.alpha + ')',
					isAlpha = colors.alpha !== 1 && !options.isIE8,
					colorMode = input.getAttribute('data-colorMode');

				patch.style.cssText =
					'color:' + (colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd') + ';' + // Black...???
					'background-color:' + RGBAText + ';' +
					'filter:' + (options.isIE8 ? 'progid:DXImageTransform.Microsoft.gradient(' + // IE<9
						'startColorstr=#' + AHEX + ',' + 'endColorstr=#' + AHEX + ')' : '');

				input.value = (colorMode === 'HEX' && !isAlpha ? '#' + (options.isIE8 ? AHEX : colors.HEX) :
					colorMode === 'rgb' || (colorMode === 'HEX' && isAlpha) ?
					(!isAlpha ? 'rgb(' + RGBInnerText + ')' : RGBAText) :
					('hsl' + (isAlpha ? 'a(' : '(') + HSL.h + ', ' + HSL.s + '%, ' + HSL.l + '%' +
						(isAlpha ? ', ' + colors.alpha : '') + ')')
				);

				if (options.displayCallback) {
					options.displayCallback(colors, mode, options);
				}
			},
			extractValue = function(elm) {
				return elm.value || elm.getAttribute('value') || elm.style.backgroundColor || '#FFFFFF';
			},
			actionCallback = function(event, action) {
				var options = this,
					colorPicker = colorPickers.current;

				if (action === 'toMemory') {
					var memos = colorPicker.nodes.memos,
						backgroundColor = '',
						opacity = 0,
						cookieTXT = [];

					for (var n = 0, m = memos.length; n < m; n++) {
						backgroundColor = memos[n].style.backgroundColor;
						opacity = memos[n].style.opacity;
						opacity = Math.round((opacity === '' ? 1 : opacity) * 100) / 100;
						cookieTXT.push(backgroundColor.
							replace(/, /g, ',').
							replace('rgb(', 'rgba(').
							replace(')', ',' + opacity + ')')
						);
					}
					cookieTXT = '\'' + cookieTXT.join('\',\'') + '\'';
					ColorPicker.docCookies('colorPickerMemos' + (options.noAlpha ? 'NoAlpha' : ''), cookieTXT);
				} else if (action === 'resizeApp') {
					ColorPicker.docCookies('colorPickerSize', colorPicker.color.options.currentSize);
				} else if (action === 'modeChange') {
					var mode = colorPicker.color.options.mode;

					ColorPicker.docCookies('colorPickerMode', mode.type + '-' + mode.z);
				}
			},
			createInstance = function(elm, config) {
				var initConfig = {
						klass: window.ColorPicker,
						input: elm,
						patch: elm,
						isIE8: !!document.all && !document.addEventListener, // Opera???
						// *** animationSpeed: 200,
						// *** draggable: true,
						margin: {left: -1, top: 2},
						customBG: '#FFFFFF',
						// displayCallback: displayCallback,
						/* --- regular colorPicker options from this point --- */
						color: extractValue(elm),
						initStyle: 'display: none',
						mode: ColorPicker.docCookies('colorPickerMode') || 'hsv-h',
						// memoryColors: (function(colors, config) {
						// 	return config.noAlpha ?
						// 		colors.replace(/\,\d*\.*\d*\)/g, ',1)') : colors;
						// })($.docCookies('colorPickerMemos'), config || {}),
						memoryColors: ColorPicker.docCookies('colorPickerMemos' +
							((config || {}).noAlpha ? 'NoAlpha' : '')),
						size: ColorPicker.docCookies('colorPickerSize') || 1,
						renderCallback: renderCallback,
						actionCallback: actionCallback
					};

				for (var n in config) {
					initConfig[n] = config[n]; 
				}
				return new initConfig.klass(initConfig);
			},
			doEventListeners = function(elm, multiple, off) {
				var onOff = off ? 'removeEventListener' : 'addEventListener',
					focusListener = function(e) {
						var input = this,
							position = window.ColorPicker.getOrigin(input),
							index = multiple ? Array.prototype.indexOf.call(elms, this) : 0,
							colorPicker = colorPickers[index] ||
								(colorPickers[index] = createInstance(this, config)),
							options = colorPicker.color.options,
							colorPickerUI = colorPicker.nodes.colorPicker,
							appendTo = (options.appendTo || document.body),
							isStatic = /static/.test(window.getComputedStyle(appendTo).position),
							atrect = isStatic ? {left: 0, top: 0} : appendTo.getBoundingClientRect(),
							waitTimer = 0;

						options.color = extractValue(elm); // brings color to default on reset
						colorPickerUI.style.cssText = 
							'position: absolute;' + (!colorPickers[index].cssIsReady ? 'display: none;' : '') +
							'left:' + (position.left + options.margin.left - atrect.left) + 'px;' +
							'top:' + (position.top + +input.offsetHeight + options.margin.top - atrect.top) + 'px;';

						if (!multiple) {
							options.input = elm;
							options.patch = elm; // check again???
							colorPicker.setColor(extractValue(elm), undefined, undefined, true);
							colorPicker.saveAsBackground();
						}
						colorPickers.current = colorPickers[index];
						appendTo.appendChild(colorPickerUI);
						waitTimer = setInterval(function() { // compensating late style on onload in colorPicker
							if (colorPickers.current.cssIsReady) {
								waitTimer = clearInterval(waitTimer);
								colorPickerUI.style.display = 'block';
							}
						}, 10);
					},
					mousDownListener = function(e) {
						var colorPicker = colorPickers.current,
							colorPickerUI = (colorPicker ? colorPicker.nodes.colorPicker : undefined),
							animationSpeed = colorPicker ? colorPicker.color.options.animationSpeed : 0,
							isColorPicker = colorPicker && (function(elm) {
								while (elm) {
									if ((elm.className || '').indexOf('cp-app') !== -1) return elm;
									elm = elm.parentNode;
								}
								return false;
							})(e.target),
							inputIndex = Array.prototype.indexOf.call(elms, e.target);

						if (isColorPicker && Array.prototype.indexOf.call(colorPickers, isColorPicker)) {
							if (e.target === colorPicker.nodes.exit) {
								colorPickerUI.style.display = 'none';
								document.activeElement.blur();
							} else {
								// ...
							}
						} else if (inputIndex !== -1) {
							// ...
						} else if (colorPickerUI) {
							colorPickerUI.style.display = 'none';
						}
					};

				elm[onOff]('focus', focusListener);

				if (!colorPickers.evt || off) {
					colorPickers.evt = true; // prevent new eventListener for window

					window[onOff]('mousedown', mousDownListener);
				}
			},
			// this is a way to prevent data binding on HTMLElements
			colorPickers = window.jsColorPicker.colorPickers || [],
			elms = document.querySelectorAll(selectors),
			testColors = new window.Colors({customBG: config.customBG, allMixDetails: true});

		window.jsColorPicker.colorPickers = colorPickers;

		for (var n = 0, m = elms.length; n < m; n++) {
			var elm = elms[n];

			if (config === 'destroy') {
				doEventListeners(elm, (config && config.multipleInstances), true);
				if (colorPickers[n]) {
					colorPickers[n].destroyAll();
				}
			} else {
				var color = extractValue(elm);
				var value = color.split('(');

				testColors.setColor(color);
				if (config && config.init) {
					config.init(elm, testColors.colors);
				}
				elm.setAttribute('data-colorMode', value[1] ? value[0].substr(0, 3) : 'HEX');
				doEventListeners(elm, (config && config.multipleInstances), false);
				if (config && config.readOnly) {
					elm.readOnly = true;
				}
			}
		};

		return window.jsColorPicker.colorPickers;
	};

	window.ColorPicker.docCookies = function(key, val, options) {
		var encode = encodeURIComponent, decode = decodeURIComponent,
			cookies, n, tmp, cache = {},
			days;

		if (val === undefined) { // all about reading cookies
			cookies = document.cookie.split(/;\s*/) || [];
			for (n = cookies.length; n--; ) {
				tmp = cookies[n].split('=');
				if (tmp[0]) cache[decode(tmp.shift())] = decode(tmp.join('=')); // there might be '='s in the value...
			}

			if (!key) return cache; // return Json for easy access to all cookies
			else return cache[key]; // easy access to cookies from here
		} else { // write/delete cookie
			options = options || {};

			if (val === '' || options.expires < 0) { // prepare deleteing the cookie
				options.expires = -1;
				// options.path = options.domain = options.secure = undefined; // to make shure the cookie gets deleted...
			}

			if (options.expires !== undefined) { // prepare date if any
				days = new Date();
				days.setDate(days.getDate() + options.expires);
			}

			document.cookie = encode(key) + '=' + encode(val) +
				(days            ? '; expires=' + days.toUTCString() : '') +
				(options.path    ? '; path='    + options.path       : '') +
				(options.domain  ? '; domain='  + options.domain     : '') +
				(options.secure  ? '; secure'                        : '');
		}
	};
})(this);
