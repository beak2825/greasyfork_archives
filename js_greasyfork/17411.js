// ==UserScript==
// @name        Universal metric translator
// @namespace   https://bennyjacobs.nl/userscripts/Universal-metric-translator
// @description Automatically converts imperial units to metric units
// @license     BSD-3-Clause
// @include     about:addons
// @include     *
// @version     2.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17411/Universal%20metric%20translator.user.js
// @updateURL https://update.greasyfork.org/scripts/17411/Universal%20metric%20translator.meta.js
// ==/UserScript==

/*
BSD 3-Clause License

Copyright (c) 2017, Benny Jacobs
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Flags: global, insensitive
const createTransformationRegEx = (unit) => new RegExp(`(?:^|\\s)((\\d\\s)?[0-9]+(?:\\.[0-9]+)?(?:/[0-9]+(?:\\.[0-9]+)?)?)\\s*(${unit})\\b(?!(\\s\\[))`,"i");

// Sources:
// https://en.wikipedia.org/wiki/Imperial_units
// https://en.wikipedia.org/wiki/Metre
// https://en.wikipedia.org/wiki/Square_metre
// https://en.wikipedia.org/wiki/Litre
const tranformationTable = [

    // Temperature
    {
        from: '(?:F|fahrenheit|fahrenheits|degrees F|degrees fahrenheit)',
        to: '℃',
        convert: function(fahrenheits){
            return ((fahrenheits - 32) / 1.8).toFixed(2);
        }
    },

    // Distance
    {
        from: 'thou',
        to: 'm',
        convert: 25.4 * 1e-6,
    }, {
        from: '(?:inch(?:es|e)?)',
        to: 'm',
        convert: 25.4 * 1e-3,
    }, {
        from: '(?:(?:feets?|foot))',
        to: 'm',
        convert: 0.3048,
    }, {
        from: '(?:yards?|yd)',
        to: 'm',
        convert: 0.9144,
    }, {
        from: 'chains?',
        to: 'm',
        convert: 20.1168,
    }, {
        from: '(?:furlongs?|fur)',
        to: 'm',
        convert: 201.168,
    }, {
        from: 'miles?',
        to: 'm',
        convert: 1.609344 * 1e3,
    }, {
        from: 'leagues?',
        to: 'm',
        convert: 4.828032 * 1e3,
    },

    // Maritime distances
    {
        from: '(?:fathoms?|ftm)',
        to: 'm',
        convert: 1.853184,
    }, {
        from: 'cables?',
        to: 'm',
        convert: 185.3184,
    }, {
        from: 'nautical\\smiles?', // Note: two backslashes as we are escaping a javascript string
        to: 'm',
        convert: 1.853184 * 1e3,
    },

    // Gunter's survey units (17th century onwards)
    {
        from: 'link',
        to: 'm',
        convert: 0.201168,
    }, {
        from: 'rod',
        to: 'm',
        convert: 5.0292,
    }, {
        from: 'chain',
        to: 'm',
        convert: 20.1168,
    },

    // Area
    {
        from: 'acres?',
        to: 'km²',
        convert: 4.0468564224,
    },

    // Volume
    {
        from: '(?:fluid ounces?|fl oz)',
        to: 'L',
        convert: 28.4130625 * 1e-3,
    }, {
        from: 'gill?',
        to: 'L',
        convert: 142.0653125 * 1e-3,
    }, {
        from: '(?:pints?|pt)',
        to: 'L',
        convert: 0.56826125,
    }, {
        from: 'quarts?',
        to: 'L',
        convert: 1.1365225,
    }, {
        from: 'gal(?:lons?)?',
        to: 'L',
        convert: 4.54609,
    },

    //Weight
    {
        from: 'grains?',
        to: 'g',
        convert: 64.79891 * 1e-3,
    }, {
        from: 'drachm',
        to: 'g',
        convert: 1.7718451953125,
    }, {
        from: '(?:ounces?|oz)',
        to: 'g',
        convert: 28.349523125,
   }, {
       // from: 'lbs?|pounds?', // Pound is ambiguous. It can be a currency. Therefore we don't touch it.
       // Actually, since it would be displayed as
       //   "It costs 1 pound [453.59 g]."
       //   the metric translation can just be ignored by the reader.
       //   I'm leaving it out anyways. lbs is usually used in written text anyways so it covers most cases.
       from: 'lbs?',
       to: 'g',
       convert: 453.59,
   }, {
        from: 'stones?',
        to: 'g',
        convert: 6.35029318  * 1e3,
    }, {
        from: 'quarters?',
        to: 'g',
        convert: 12.70058636 * 1e3,
    }, {
        from: 'hundredweights?',
        to: 'g',
        convert: 50.80234544 * 1e3,
    },
    //  A 'ton' might belong here, but there exist a metric ton and a imperial ton.
    
    // Qon commment: A metric ton is sometimes spelled metric tonne or just tonne though. 
    // https://en.wikipedia.org/wiki/Ton
];

tranformationTable.forEach(function (transformationRule) {
    transformationRule.regex = createTransformationRegEx(transformationRule.from);
});

const replaceSubstring = function(originalText, index, length, replacement) {
    var before_substring = originalText.substring(0, index);
    var after_substring = originalText.substring(index+length);
    return before_substring + replacement + after_substring;
};

const round_number = (num, dec) => {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// The transformText function is idempotent.
// Repeated calls on the output will do nothing. Only the first invocation has any effect.
// The input will be returned on repeated calls.
const transformText = (text) => {
    tranformationTable.forEach((transformationRule) => {
       transformationRule.regex.lastIndex = 0;
        for(var match; match = transformationRule.regex.exec(text);) {

            // console.log(match, parseFloat(match[1], 10))
            var old_value, new_value;

            // if the number is written like 1 1/4 instead of 1.25 then:
            if(/\//.test(match[1])) {
                old_value = match[1].split(' ')
                if(old_value.length == 2)
                {
                    var a = old_value[1].split('/')
                    old_value[1] = parseFloat(a[0].replace(/,/g, ''), 10) / parseFloat(a[1].replace(/,/g, ''), 10)
                    old_value = parseFloat(old_value[0].replace(/,/g, ''), 10) + old_value[1]
                }
                else
                {
                    var a = old_value[0].split('/')
                    old_value = parseFloat(a[0].replace(/,/g, ''), 10) / parseFloat(a[1].replace(/,/g, ''), 10)
                }
            } else {
                old_value = parseFloat(match[1].replace(/,/g, ''), 10)
            }
            
            if(typeof transformationRule.convert == 'function') {
                new_value = transformationRule.convert(old_value);
            } else {
                new_value = old_value * transformationRule.convert;
            }
            
            var new_unit = transformationRule.to;
            if(new_unit === 'g' || new_unit === 'L' || new_unit === 'm')
            {
                if(new_value > 1e12) {
                    new_unit = 'T' + new_unit
                    new_value /= 1e12
                } else if (new_value > 1e9) {
                    new_unit = 'G' + new_unit
                    new_value /= 1e9
                } else if (new_value > 1e6) {
                    // if(new_unit === 'g') new_unit = 'tonne' else
                    new_unit = 'M' + new_unit
                    new_value /= 1e6
                } else if (new_value > 1e3) {
                    new_unit = 'k' + new_unit
                    new_value /= 1e3
                } else if (new_value < 1e-9) {
                    new_unit = 'p' + new_unit
                    new_value /= 1e-12
                } else if (new_value < 1e-6) {
                    new_unit = 'n' + new_unit
                    new_value /= 1e-9
                } else if (new_value < 1e-3) {
                    new_unit = 'µ' + new_unit
                    new_value /= 1e-6
                } else if (new_value < 1e-2) {
                    new_unit = 'm' + new_unit
                    new_value /= 1e-3
                } else if (new_value < 1 && (new_unit !== 'g')) {
                    new_unit = 'c' + new_unit
                    new_value /= 1e-2
                }
            }
            // function significantDigits(old, new) {
            //     old.replace(/^[^1-9]*/, '').replace(/\D/g, '').length
            // }
            new_value = round_number(new_value, 2)
            if(true) {
                var new_substring =
                      match[0]
                    + ' ['
                    + new_value
                    + " "
                    + new_unit
                    + ']'
            } else {
                var new_substring =
                      new_value
                    + " "
                    + new_unit
                    + ' ['
                    + match[0]
                    + ']'
            }

            text = replaceSubstring(text, match.index, match[0].length, new_substring );
            // Move the matching index past whatever we have replaced.
            // Note: The replacement can be shorter or longer.
            transformationRule.regex.lastIndex = transformationRule.regex.lastIndex + (new_substring.length - match[0].length);
        }
    });
    return text;
};

// conversation => convert. Because this has nothing to do with discussions.
// Rounding moved so it happens only immediatly before being inserted into
//  the document.
//  If it's done as the first step we lose a lot(!) of precision.
//  As an example 0.004 inches was rounded to 0, then converted to metric
//  (still 0) and then inserted. Extremely wrong.
//  Also 0.01497 miles gets rounded to 0.01 (33% less!) and then converted to
//  metric. The result is 0.01 * 1.609344 = 0.01609344, way more digits than
//  before we started! This looks extremely precise with 8 significant digits,
//  but it's actually only 1 since began by completely destroying our initial
//  number. Correct convertion should have the same number of significant
//  digits as the initial number (4). But some numbers, like 1 inch, might 
//  actually be exactly 1 inch, or 2.54 cm. Rounding 1 inch to 3 cm seems a 
//  bit wrong. It's unusual that 1 inch is written like "1.00 inches" even
//  if that precision is intended. So a flat rounding to 2 decimals after(!) 
//  choosing a good prefix (and scaling our number by the prefix) should work
//  for most cases.

const handleTextNode = (textNode) => {
    var transformedText = transformText(textNode.nodeValue);
    if(textNode.nodeValue != transformedText)
       textNode.nodeValue = transformedText;
};

// Travel the node(s) in a recursive fashion.
const walk = (node) => {
  var child, next;

  switch (node.nodeType) {
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;
    case 3: // Text node
      handleTextNode(node);
      break;
    default:
      break;
  }
};

const MutationObserver = (window.MutationObserver || window.WebKitMutationObserver);
var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if(mutation.type == 'childList') {
            for (var i = 0; i < mutation.addedNodes.length; ++i) {
               walk(mutation.addedNodes[i]);
            }
        } else if (mutation.type == 'characterData') {
            handleTextNode(mutation.target);
        }
    });
});

observer.observe(document, {
    childList: true,
    characterData: true,
    subtree: true,
});

walk(document.body);
