// ==UserScript==
// @name         PunyCode Protection
// @namespace    PunyCode Protection
// @version      1.0.4
// @description  Warns on clicking links and arriving into sites which uses PunyCode.
// @author       jcunews
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/29176/PunyCode%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/29176/PunyCode%20Protection.meta.js
// ==/UserScript==

//URL to redirect when user rejected the prompt upon arriving to a possibly fake site.
var redirectURL = "about:blank";

//---------------------------punycode.js start
//source: https://github.com/bestiejs/punycode.js/blob/master/punycode.js
//modified to be compatible with ES5.1 and client-side scripting, and to remove comments.
var punycode = (function() {

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexPunycode = /^xn--/;
var regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;

function error(type) {
	throw new RangeError(errors[type]);
}

function map(array, fn) {
	var result = [];
	var length = array.length;

	while (length--) {
		result[length] = fn(array[length]);
	}

	return result;
}

function mapDomain(string, fn) {
	var parts = string.split('@');
	var result = '';
	if (parts.length > 1) {
		result = parts[0] + '@';
		string = parts[1];
	}
	string = string.replace(regexSeparators, '\x2E');
	var labels = string.split('.');
	var encoded = map(labels, fn).join('.');
	return result + encoded;
}

function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;

	while (counter < length) {
		var value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			var extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}

	return output;
}

//var ucs2encode = array => String.fromCodePoint(...array);
var ucs2encode = function(array) {
	return String.fromCodePoint.apply(String, array);
};

var basicToDigit = function(codePoint) {
	if (codePoint - 0x30 < 0x0A) {
		return codePoint - 0x16;
	}
	if (codePoint - 0x41 < 0x1A) {
		return codePoint - 0x41;
	}
	if (codePoint - 0x61 < 0x1A) {
		return codePoint - 0x61;
	}
	return base;
};

var digitToBasic = function(digit, flag) {
	return digit + 22 + 75 * (digit < 26) - ((flag !== 0) << 5);
};

var adapt = function(delta, numPoints, firstTime) {
	var k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);

	for (; delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor(delta / baseMinusTMin);
	}

	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

var decode = function(input) {
	var output = [];
	var inputLength = input.length;
	var i = 0;
	var n = initialN;
	var bias = initialBias;
	var basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (var j = 0; j < basic; ++j) {
		if (input.charCodeAt(j) >= 0x80) {
			error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	for (var index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
	  var oldi = i;

		for (var w = 1, k = base; ; k += base) {
			if (index >= inputLength) {
				error('invalid-input');
			}
			var digit = basicToDigit(input.charCodeAt(index++));
			if (digit >= base || digit > floor((maxInt - i) / w)) {
				error('overflow');
			}
			i += digit * w;
			var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
			if (digit < t) {
				break;
			}
			var baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) {
				error('overflow');
			}
			w *= baseMinusT;
		}

		var out = output.length + 1;
		bias = adapt(i - oldi, out, oldi === 0);
		if (floor(i / out) > maxInt - n) {
			error('overflow');
		}
		n += floor(i / out);
		i %= out;
		output.splice(i++, 0, n);
	}
//	return String.fromCodePoint(...output);
	return String.fromCodePoint.apply(String, output);
};

var encode = function(input) {
	var output = [];
	input = ucs2decode(input);
	var inputLength = input.length;
	var n = initialN;
	var delta = 0;
	var bias = initialBias;

	input.forEach(function(currentValue) {
		if (currentValue < 0x80) {
			output.push(stringFromCharCode(currentValue));
		}
	});

	var basicLength = output.length;
	var handledCPCount = basicLength;
	if (basicLength) {
		output.push(delimiter);
	}

	while (handledCPCount < inputLength) {
		var m = maxInt;

		input.forEach(function(currentValue) {
			if (currentValue >= n && currentValue < m) {
				m = currentValue;
			}
		});

		var handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			error('overflow');
		}
		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		input.forEach(function(currentValue) {
			if (currentValue < n && ++delta > maxInt) {
				error('overflow');
			}
			if (currentValue == n) {
				var q = delta;

				for (var k = base; ; k += base) {
					var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
					if (q < t) {
						break;
					}
					var qMinusT = q - t;
					var baseMinusT = base - t;
					output.push(
						stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
					);
					q = floor(qMinusT / baseMinusT);
				}

				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
				delta = 0;
				++handledCPCount;
			}
		});

		++delta;
		++n;
	}
	return output.join('');
};

var toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
	});
};

var toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
	});
};

return {
	'version': '2.1.0',
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};

})();
//---------------------------punycode.js end

var hostname;
window.pc=punycode;
function latinLike(s) {
	return punycode.ucs2.decode(s).some(function(code){
		return (
			//C1 Controls and Latin-1 Supplement; up to Cyrillic Supplement
			(code >= 0x0080) && (code <= 0x052f) ||
			//Cherokee
			(code >= 0x13a0) && (code <= 0x13ff) ||
			//Cyrillic Extended-C
			(code >= 0x1c80) && (code <= 0x1c8f) ||
			//Latin-2 supplement, Greek Extended
			(code >= 0x1d00) && (code <= 0x1eff) ||
			//Superscripts and Subscripts
			(code >= 0x2070) && (code <= 0x209f) ||
			//Letterlike Symbols
			(code >= 0x2100) && (code <= 0x214f) ||
			//Latin Extended-C, Coptic, Tifinagh
			(code >= 0x2c60) && (code <= 0x2d7f) ||
			//Cyrillic Extended-A
			(code >= 0x2de0) && (code <= 0x2dff) ||
			//Lisu
			(code >= 0xa4d0) && (code <= 0xa4ff) ||
			//Cyrillic Extended-B
			(code >= 0xa640) && (code <= 0xa69f) ||
			//Latin Extended-D
			(code >= 0xa720) && (code <= 0xa7ff) ||
			//Latin Extended-E, Cherokee Supplement
			(code >= 0xab30) && (code <= 0xabbf) ||
			//Halfwidth and Fullwidth Forms (letters only)
			(code >= 0xff00) && (code <= 0xff5a)
		);
	})
}
function checkHostName(ahostname, hn, suspicious) {
	suspicious = latinLike(ahostname);
	if (suspicious) {
		hn = punycode.toUnicode(ahostname);
		if (hn === ahostname) {
			hn = punycode.toASCII(ahostname);
			suspicious = hn !== ahostname;
		} else {
			hn = ahostname;
			suspicious = true;
		}
		hostname = hn;
	} else if (suspicious = ((hn = punycode.toUnicode(ahostname)) !== ahostname) && latinLike(hn)) hostname = ahostname;
	return suspicious;
}

//warn upon arriving to a possibly fake site
if (checkHostName(location.hostname) &&
		!confirm("Warning! This website real domain name is:\n\n" + hostname + "\n\nDo you want to proceed?")) {
	location.href = redirectURL;
}

//warn on clicking a link pointing to a possibly fake site
addEventListener("click", function(ev) {
  if (!ev.button && ev.target && (ev.target.tagName === "A") &&
			ev.target.hostname && (ev.target.hostname !== location.hostname)) {
    if (checkHostName(ev.target.hostname) &&
				!confirm("Warning! About to go to a web page whose real domain name is:\n\n" + hostname + "\n\nDo you want to proceed?")) {
      ev.preventDefault();
      if (ev.stopPropagation) ev.stopPropagation();
      if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      return false;
    }
  }
  return true;
}, true);

//hook window.open()
var _open = window.open;
window._open = window.open;
window.open = function(url) {
	if (checkHostName(url) &&
			!confirm("Warning! A script is about to open a web page whose real domain name is:\n\n" + hostname + "\n\nDo you want to proceed?")) {
		return null;
	}
	return _open.apply(window, arguments);
};
