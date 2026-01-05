// ==UserScript==
// @name			WaniKani Lattice Extension
// @description		Extends the WaniKani lattice and allows to choose what data to display
// @namespace		irx.wanikani.lattice_extension
// @include			https://www.wanikani.com/
// @include			https://www.wanikani.com/dashboard
// @include			https://www.wanikani.com/review/session*
// @include			https://www.wanikani.com/lattice/radicals/meaning
// @include			https://www.wanikani.com/lattice/kanji/combined
// @include			https://www.wanikani.com/lattice/kanji/meaning
// @include			https://www.wanikani.com/lattice/kanji/reading
// @include			https://www.wanikani.com/lattice/vocabulary/combined
// @include			https://www.wanikani.com/lattice/vocabulary/meaning
// @include			https://www.wanikani.com/lattice/vocabulary/reading
// @version			3.0
// @copyright		2016, Ingo Radax
// @license			MIT; http://opensource.org/licenses/MIT
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/18636/WaniKani%20Lattice%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/18636/WaniKani%20Lattice%20Extension.meta.js
// ==/UserScript==

// LZString library from pieroxy
// http://pieroxy.net/blog/pages/lz-string/index.html
// Licence: WTFPL (http://www.wtfpl.net/)
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

var WaniKani = (function() {
	var local_storage_prefix = 'wk_toolkit_';
	
	var api_key = null;
	
	var radical_data = null;
	var kanji_data = null;
	var vocabulary_data = null;

	function log(msg) {
		console.log(msg);
	}
	
	function is_on_wanikani() {
		return (window.location.host == 'www.wanikani.com');
	}
	
	function is_on_dashboard() {
		return is_on_wanikani() && ((window.location.pathname == '/dashboard') || (window.location.pathname == '/'));
	}
	
	function is_on_review_session_page() {
		return is_on_wanikani() && (window.location.pathname == '/review/session');
	}
	
	function is_on_review_page() {
		return is_on_wanikani() && (window.location.pathname == '/review');
	}
	
	function is_on_lesson_session_page() {
		return is_on_wanikani() && (window.location.pathname == '/lesson/session');
	}
	
	function is_on_lesson_page() {
		return is_on_wanikani() && (window.location.pathname == '/lesson');
	}
	
	function is_on_lattice_radicals_meaning() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/radicals/meaning');
	}
	
	function is_on_lattice_radicals_progress() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/radicals/progress');
	}
	
	function is_on_lattice_kanji_combined() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/combined');
	}
	
	function is_on_lattice_kanji_meaning() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/meaning');
	}
	
	function is_on_lattice_kanji_reading() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/reading');
	}
	
	function is_on_lattice_kanji_progress() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/status');
	}
	
	function is_on_lattice_vocabulary_combined() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/combined');
	}
	
	function is_on_lattice_vocabulary_meaning() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/meaning');
	}
	
	function is_on_lattice_vocabulary_reading() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/reading');
	}
	
	function is_on_lattice_vocabulary_progress() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/status');
	}
	
	//-------------------------------------------------------------------
	// Try to parse the url and detect if it belongs to a single item.
	// e.g.	'https://www.wanikani.com/level/1/radicals/construction'
	//		will be parsed as 'radicals' and 'construction'
	//-------------------------------------------------------------------
	function parse_item_url(url) {
		url = decodeURI(url);
		var parsed = /.*\/(radicals|kanji|vocabulary)\/(.+)/.exec(url);
		if (parsed) {
			return {type:parsed[1], name:parsed[2]};
		}
		else {
			return null;
		}
	}
	
	function clear_local_storage() {
		localStorage.removeItem(local_storage_prefix + 'last_review_time');
		localStorage.removeItem(local_storage_prefix + 'next_review_time');
		localStorage.removeItem(local_storage_prefix + 'last_unlock_time');
		localStorage.removeItem(local_storage_prefix + 'api_key');
		localStorage.removeItem(local_storage_prefix + 'api_user_radicals');
		localStorage.removeItem(local_storage_prefix + 'api_user_radicals_fetch_time');
		localStorage.removeItem(local_storage_prefix + 'api_user_kanji');
		localStorage.removeItem(local_storage_prefix + 'api_user_kanji_fetch_time');
		localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary');
		localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary_fetch_time');
	}
		
	function track_times() {
		if (is_on_review_session_page()) {
			localStorage.setItem(local_storage_prefix + 'last_review_time', now());
			
			var lastUnlockTime = new Date($('.recent-unlocks time:nth(0)').attr('datetime'))/1000;
			localStorage.setItem(local_storage_prefix + 'last_unlock_time', now());
		}
		
		if (is_on_dashboard()) {
			var next_review = Number($('.review-status .timeago').attr('datetime'));
			// Workaround for "WaniKani Real Times" script, which deletes the element we were looking for above.
			if (isNaN(next_review)) {
				next_review = Number($('.review-status time1').attr('datetime'));
				// Conditional divide-by-1000, in case someone fixed this error in Real Times script.
				if (next_review > 10000000000) next_review /= 1000;
			}
			localStorage.setItem(local_storage_prefix + 'next_review_time', next_review);
		}
	}
	
	function get_last_review_time() {
		return Number(localStorage.getItem(local_storage_prefix + 'last_review_time') || 0);
	}
	
	function get_next_review_time() {
		return Number(localStorage.getItem(local_storage_prefix + 'next_review_time') || 0);
	}
	
	function get_last_unlock_time() {
		return Number(localStorage.getItem(local_storage_prefix + 'last_unlock_time') || 0);
	}

	function now() {
		return Math.floor(new Date() / 1000);
	}
	
	function ajax_retry(url, retries, timeout) {
		retries = retries || 2;
		timeout = timeout || 3000;
		function action(resolve, reject) {
			$.ajax({
				url: url,
				timeout: timeout
			})
			.done(function(data, status){
				if (status === 'success')
					resolve(data);
				else
					reject();
			})
			.fail(function(xhr, status, error){
				if (status === 'error' && --retries > 0)
					action(resolve, reject);
				else
					reject();
			});
		}
		return new Promise(action);
	}

	function get_api_key() {
		return new Promise(function(resolve, reject) {
			api_key = localStorage.getItem(local_storage_prefix + 'api_key');
			if (typeof api_key === 'string' && api_key.length == 32) {
				log("Already having API key");
				return resolve();	
			}
			
			log("Loading API key");
			
			ajax_retry('/account').then(function(page) {
				
				log("Loading API key ... SUCCESS");
				
				// --[ SUCCESS ]----------------------
				// Make sure what we got is a web page.
				if (typeof page !== 'string') {return reject();}

				// Extract the user name.
				page = $(page);
				
				// Extract the API key.
				api_key = page.find('#api-button').parent().find('input').attr('value');
				if (typeof api_key !== 'string' || api_key.length !== 32)  {return reject();}

				localStorage.setItem(local_storage_prefix + 'api_key', api_key);
				resolve();

			},function(result) {
				
				log("Loading API key ... ERROR");
				
				// --[ FAIL ]-------------------------
				reject(new Error('Failed to fetch API key!'));
				
			});
		});
	}
	
	function call_api_user_radicals() {
		return new Promise(function(resolve, reject) {
			log("Calling API: User radicals");
			$.getJSON('/api/user/' + api_key + '/radicals/', function(json){
				if (json.error && json.error.code === 'user_not_found') {
					log("Calling API: User radicals ... ERROR")
					localStorage.removeItem(local_storage_prefix + 'api_user_radicals');
					localStorage.removeItem(local_storage_prefix + 'api_user_radicals_fetch_time');
					localStorage.removeItem(local_storage_prefix + 'api_key');
					location.reload();
					reject();
					return;
				}

				log("Calling API: User radicals ... SUCCESS");
				
				localStorage.setItem(local_storage_prefix + 'api_user_radicals', JSON.stringify(json));
				localStorage.setItem(local_storage_prefix + 'api_user_radicals_fetch_time', now());
				
				radical_data = json;
				
				resolve();
			});
		});
	}
	
	function call_api_user_kanji() {
		return new Promise(function(resolve, reject) {
			log("Calling API: User kanji");
			$.getJSON('/api/user/' + api_key + '/kanji/', function(json){
				if (json.error && json.error.code === 'user_not_found') {
					log("Calling API: User kanji ... ERROR")
					localStorage.removeItem(local_storage_prefix + 'api_user_kanji');
					localStorage.removeItem(local_storage_prefix + 'api_user_kanji_fetch_time');
					localStorage.removeItem(local_storage_prefix + 'api_key');
					location.reload();
					reject();
					return;
				}

				log("Calling API: User kanji ... SUCCESS");
				
				localStorage.setItem(local_storage_prefix + 'api_user_kanji', JSON.stringify(json));
				localStorage.setItem(local_storage_prefix + 'api_user_kanji_fetch_time', now());
				
				kanji_data = json;
				
				resolve();
			});
		});
	}
	
	function call_api_user_vocabulary() {
		return new Promise(function(resolve, reject) {
			log("Calling API: User vocabulary");
			$.getJSON('/api/user/' + api_key + '/vocabulary/', function(json){
				if (json.error && json.error.code === 'user_not_found') {
					log("Calling API: User vocabulary ... ERROR")
					localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary');
					localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary_fetch_time');
					localStorage.removeItem(local_storage_prefix + 'api_key');
					location.reload();
					reject();
					return;
				}

				log("Calling API: User vocabulary ... SUCCESS");
				
				localStorage.setItem(local_storage_prefix + 'api_user_vocabulary', JSON.stringify(json));
				localStorage.setItem(local_storage_prefix + 'api_user_vocabulary_fetch_time', now());
				
				vocabulary_data = json;
				
				resolve();
			});
		});
	}
	
	function get_last_fetch_time_api_user_radicals() {
		return Number(localStorage.getItem(local_storage_prefix + 'api_user_radicals_fetch_time'));
	}
	
	function get_last_fetch_time_api_user_kanji() {
		return Number(localStorage.getItem(local_storage_prefix + 'api_user_kanji_fetch_time'));
	}
	
	function get_last_fetch_time_api_user_vocabulary() {
		return Number(localStorage.getItem(local_storage_prefix + 'api_user_vocabulary_fetch_time'));
	}
	
	function load_radical_data() {
        var next_review_time = get_next_review_time();
		var last_review_time = get_last_review_time();
		var last_unlock_time = get_last_unlock_time();
		var last_fetch_time = get_last_fetch_time_api_user_radicals();
        if ((last_fetch_time <= last_unlock_time) ||
			(last_fetch_time <= last_review_time) ||
			((next_review_time < now()) && (last_fetch_time <= (now() - 3600)))) {
			log("Clearing previous fetched radical data");
			radical_data = null;
			localStorage.removeItem(local_storage_prefix + 'api_user_radicals');
			localStorage.removeItem(local_storage_prefix + 'api_user_radicals_fetch_time');
		}
		
		if (radical_data == null) {
			var stringified = localStorage.getItem(local_storage_prefix + 'api_user_radicals');
			if (stringified != null) {
				log("Radical data loaded from local storage");
				radical_data = JSON.parse(stringified);
			}
		}
		
		if (radical_data != null) {
			log("Radical data already loaded");
			return Promise.resolve();
		}
		
		return new Promise(function(resolve, reject) {
			get_api_key()
				.then(call_api_user_radicals)
				.then(function() {
					resolve();
				});
		});
	}
	
	function load_kanji_data() {
        var next_review_time = get_next_review_time();
		var last_review_time = get_last_review_time();
		var last_unlock_time = get_last_unlock_time();
		var last_fetch_time = get_last_fetch_time_api_user_kanji();
        if ((last_fetch_time <= last_unlock_time) ||
			(last_fetch_time <= last_review_time) ||
			((next_review_time < now()) && (last_fetch_time <= (now() - 3600)))) {
			log("Clearing previous fetched kanji data");
			kanji_data = null;
			localStorage.removeItem(local_storage_prefix + 'api_user_kanji');
			localStorage.removeItem(local_storage_prefix + 'api_user_kanji_fetch_time');
		}
		
		if (kanji_data == null) {
			var stringified = localStorage.getItem(local_storage_prefix + 'api_user_kanji');
			if (stringified != null) {
				log("Kanji data loaded from local storage");
				kanji_data = JSON.parse(stringified);
			}
		}
		
		if (kanji_data != null) {
			log("Kanji data already loaded");
			return Promise.resolve();
		}
		
		return new Promise(function(resolve, reject) {
			get_api_key()
				.then(call_api_user_kanji)
				.then(function() {
					resolve();
				});
		});
	}
	
	function load_vocabulary_data() {
        var next_review_time = get_next_review_time();
		var last_review_time = get_last_review_time();
		var last_unlock_time = get_last_unlock_time();
		var last_fetch_time = get_last_fetch_time_api_user_vocabulary();
        if ((last_fetch_time <= last_unlock_time) ||
			(last_fetch_time <= last_review_time) ||
			((next_review_time < now()) && (last_fetch_time <= (now() - 3600)))) {
			log("Clearing previous fetched vocabulary data");
			vocabulary_data = null;
			localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary');
			localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary_fetch_time');
		}
		
		if (vocabulary_data == null) {
			var stringified = localStorage.getItem(local_storage_prefix + 'api_user_vocabulary');
			if (stringified != null) {
				log("Vocabulary data loaded from local storage");
				vocabulary_data = JSON.parse(stringified);
			}
		}
		
		if (vocabulary_data != null) {
			log("Vocabulary data already loaded");
			return Promise.resolve();
		}
		
		return new Promise(function(resolve, reject) {
			get_api_key()
				.then(call_api_user_vocabulary)
				.then(function() {
					resolve();
				});
		});
	}
	
	function get_radical_data() {
		return radical_data;
	}
	
	function get_kanji_data() {
		return kanji_data;
	}
	
	function get_vocabulary_data() {
		return vocabulary_data;
	}
	
	function find_radical(meaning) {
		if (radical_data ==  null) {
			return null;
		}
		
		var numRadicals = radical_data.requested_information.length;
		for (var i = 0; i < numRadicals; i++) {
			if (radical_data.requested_information[i].meaning == meaning) {
				return radical_data.requested_information[i];
			}
		}
		
		return null;
	}
	
	function find_kanji(character) {
		if (kanji_data ==  null) {
			return null;
		}
		
		var numKanji = kanji_data.requested_information.length;
		for (var i = 0; i < numKanji; i++) {
			if (kanji_data.requested_information[i].character == character) {
				return kanji_data.requested_information[i];
			}
		}
		
		return null;
	}
	
	function find_vocabulary(character) {
		if (vocabulary_data ==  null) {
			return null;
		}
		
		var numVocabulary = vocabulary_data.requested_information.general.length;
		for (var i = 0; i < numVocabulary; i++) {
			if (vocabulary_data.requested_information.general[i].character == character) {
				return vocabulary_data.requested_information.general[i];
			}
		}
		
		return null;
	}
	
	function find_item(type, name) {
		if (type == 'radicals') {
			return find_radical(name);
		}
		else if(type == 'kanji') {
			return find_kanji(name);
		}
		else if(type == 'vocabulary') {
			return find_vocabulary(name);
		}
		else {
			return null;
		}
	}
	
	return {
		is_on_wanikani: is_on_wanikani,
		is_on_dashboard: is_on_dashboard,
		is_on_review_session_page: is_on_review_session_page,
		is_on_review_page: is_on_review_page,
		is_on_lesson_session_page: is_on_lesson_session_page,
		is_on_lesson_page: is_on_lesson_page,
		is_on_lattice_radicals_meaning: is_on_lattice_radicals_meaning,
		is_on_lattice_radicals_progress: is_on_lattice_radicals_progress,
		is_on_lattice_kanji_combined: is_on_lattice_kanji_combined,
		is_on_lattice_kanji_meaning: is_on_lattice_kanji_meaning,
		is_on_lattice_kanji_reading: is_on_lattice_kanji_reading,
		is_on_lattice_kanji_progress: is_on_lattice_kanji_progress,
		is_on_lattice_vocabulary_combined: is_on_lattice_vocabulary_combined,
		is_on_lattice_vocabulary_meaning: is_on_lattice_vocabulary_meaning,
		is_on_lattice_vocabulary_reading: is_on_lattice_vocabulary_reading,
		is_on_lattice_vocabulary_progress: is_on_lattice_vocabulary_progress,
		parse_item_url: parse_item_url,
		clear_local_storage: clear_local_storage,
		track_times: track_times,
		get_last_review_time: get_last_review_time,
		get_next_review_time: get_next_review_time,
		load_radical_data: load_radical_data,
		get_radical_data: get_radical_data,
		find_radical: find_radical,
		load_kanji_data: load_kanji_data,
		get_kanji_data: get_kanji_data,
		find_kanji: find_kanji,
		load_vocabulary_data: load_vocabulary_data,
		get_vocabulary_data: get_vocabulary_data,
		find_vocabulary: find_vocabulary,
		find_item: find_item,
	};
})();

var UI = (function() {
	function addStyle(aCss) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (head) {
			style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.textContent = aCss;
			head.appendChild(style);
			return style;
		}
		return null;
	}
	
	function initCss() {
		var css =
			'#lattice_extension {' +
			'  display:none;' +
			'}' +
			'#lattice_extension h3 {' +
			'  height: 24px;' +
	        '  margin-top: 10px;' +
			'  margin-bottom: 0px;' +
			'  padding: 5px 20px;' +
			'  border-radius: 5px 5px 0 0;' +
	        '  background-color: seagreen;' +
	        '  color: white;' +
	        '  text-shadow: none;' +
			'}' +
			'#lattice_extension section {' +
			'  background-color: lightgrey;' +
			'}' +
			'#lattice_extension table {' +
			'}' +
			'#lattice_extension td {' +
			'  padding: 2px 8px;' +
			'}' + 
			'#lattice_extension .close_button {' +
			'  float: right;' +
			'  height: 24px;' +
			'}'
			;
		
		addStyle(css);
	}
	
	function buildIdAttr(id) {
		if (id && id != '')
			return 'id="' + id + '"';
		return '';
	}
	
	function addOnChangeListener(id, data, listener) {
		$('#' + id).off('change');
		$('#' + id).on('change', data, listener);
	}
	
	function addOnClickListener(id, data, listener) {
		$('#' + id).off('click');
		$('#' + id).on('click', data, listener);
	}
	
	function buildWindow(id, title) {
		var html =
			'<div ' + buildIdAttr(id) + ' class="container">' +
				'<div class="row">' +
					'<div class="span12" >' +
						'<section id="' + id + '_body">' +
							'<h3>' +
								title +
								'<button class="close_button" " ' + buildIdAttr(id + '_close_btn') + '>Close</button>' +
							'</h3>' +
						'</section>' +
					'</div>' +
				'</div>' +
			'</div>'
			;
		return html;
	}
	
	function buildTable(id) {
		var html = 
			'<table ' + buildIdAttr(id) + '>' +
				'<tbody ' + buildIdAttr(id + '_body') + '>' +
				'</tbody>' +
			'</table>';
		return html;
	}
	
	function buildTableRow(id, column1, column2, column3 = null) {
		var html =
			'<tr' + buildIdAttr(id) + '>' +
				'<td>' + column1 + '</td>' +
				'<td>' + column2 + '</td>' +
				(column3 == null ? '' : '<td>' + column3 + '</td>') +
			'</tr>';
		return html;
	}
	
	function buildSelection(id, tooltip) {
		var html =
			'<select ' + buildIdAttr(id) + ' class="input" name="' + id + '" title="' + tooltip + '" />';
		return html;
	}
	
	function addSelectionOption(selectId, value, label, selected) {
		$('#' + selectId).append(
				'<option value="' + value + '" ' + (selected ? 'selected' : '') + '>' +
					label +
				'</option>');
	}
	
	function buildCheckBox(id, checked) {
		var html =
			'<input ' + buildIdAttr(id) + ' type="checkbox" ' + (checked ? 'checked' : '') + '>';
		return html;
	}
	
	function buildButton(id, label) {
		var html =
			'<button ' + buildIdAttr(id) + '>' + label + '</button>';
		return html;
	}
	
	return {
		initCss: initCss,
		buildWindow: buildWindow,
		buildTable: buildTable,
		buildTableRow: buildTableRow,
		buildCheckBox: buildCheckBox,
		buildButton: buildButton,
		buildSelection: buildSelection,
		addSelectionOption: addSelectionOption,
		addOnChangeListener: addOnChangeListener,
		addOnClickListener: addOnClickListener,
	};
})();

(function(gobj) {
	
	var settingsWindowAdded = false;
	var dropDownMenuExtended = false;
	
	var localStoragePrefix = 'LatticeExtension_';
	
	var loaded_snapshot = {id:0};
	
	var snapshot_index = {
		next_id: 1,
		snapshots: []
	};
	
	var max_num_snapshots = 5;
	
	var statistics = {};
	
	var classification_thresholds = {};
	
	var radicals_data_labels = {
		meaning_percent_answered_correct: "Meaning (% correct)",
		meaning_correct: "Meaning (correct)",
		meaning_incorrect: "Meaning (incorrect)",
		meaning_total: "Meaning (correct + incorrect)",
		meaning_current_streak: "Meaning (current streak)",
		meaning_max_streak: "Meaning (max streak)",
	};
	
	var kanji_data_labels = {
		combined_percent_answered_correct: "Combined (% correct)",
		combined_correct: "Combined (correct)",
		combined_incorrect: "Combined (incorrect)",
		combined_total: "Combined (correct + incorrect)",
		meaning_percent_answered_correct: "Meaning (% correct)",
		meaning_correct: "Meaning (correct)",
		meaning_incorrect: "Meaning (incorrect)",
		meaning_total: "Meaning (correct + incorrect)",
		meaning_current_streak: "Meaning (current streak)",
		meaning_max_streak: "Meaning (max streak)",
		reading_percent_answered_correct: "Reading (% correct)",
		reading_correct: "Reading (correct)",
		reading_incorrect: "Reading (incorrect)",
		reading_total: "Reading (correct + incorrect)",
		reading_current_streak: "Reading (current streak)",
		reading_max_streak: "Reading (max streak)",
	};
	
	var vocabulary_data_labels = {
		combined_percent_answered_correct: "Combined (% correct)",
		combined_correct: "Combined (correct)",
		combined_incorrect: "Combined (incorrect)",
		combined_total: "Combined (correct + incorrect)",
		meaning_percent_answered_correct: "Meaning (% correct)",
		meaning_correct: "Meaning (correct)",
		meaning_incorrect: "Meaning (incorrect)",
		meaning_total: "Meaning (correct + incorrect)",
		meaning_current_streak: "Meaning (current streak)",
		meaning_max_streak: "Meaning (max streak)",
		reading_percent_answered_correct: "Reading (% correct)",
		reading_correct: "Reading (correct)",
		reading_incorrect: "Reading (incorrect)",
		reading_total: "Reading (correct + incorrect)",
		reading_current_streak: "Reading (current streak)",
		reading_max_streak: "Reading (max streak)",
	};
	
	var used_labels = null;
	
	function setupStatistics() {
		for(var key in used_labels){
			statistics[key] = {min: 10000, max:-10000};
		}
	}
	
	function removeText(jq_expression) {
		$(jq_expression).contents().filter(function () {
			return this.nodeType === 3; 
		}).remove();
	}
	
	function calculate_classification_thresholds(min, max) {
		if (max - min < 5) {
			if (max >= 4) {
				classification_thresholds = {
					t0: max - 4,
					t1: max - 4,
					t2: max - 3,
					t3: max - 2,
					t4: max - 1,
					t5: max,
				};
			}
			else {
				classification_thresholds = {
					t0: min,
					t1: min,
					t2: min + 1,
					t3: min + 2,
					t4: min + 3,
					t5: min + 4,
				};
			}
		}
		else {
			var len = (max - min) / 5;
			classification_thresholds = {
				t0: min,
				t1: Math.floor(min + len),
				t2: Math.floor(min + 2 * len),
				t3: Math.floor(min + 3 * len),
				t4: Math.floor(min + 4 * len),
				t5: max,
			};
		}
	}
	
	function classify_item(value) {
		var t = classification_thresholds;
		if (value <= t.t1)
			return 'percentage-0-20';
		else if ((value >= t.t1 + 1) && (value <= t.t2))
			return 'percentage-21-40';
		else if ((value >= t.t2 + 1) && (value <= t.t3))
			return 'percentage-41-60';
		else if ((value >= t.t3 + 1) && (value <= t.t4))
			return 'percentage-61-80';
		else
			return 'percentage-81-100';
	}
	
	function updateLegend() {
		var dataToDisplay = $('#data_to_display').val();
		var unit = dataToDisplay.includes('percent') ? '%' : '';;
		var t = classification_thresholds;
		$('aside.additional-info ul li:first div span:nth(0)').attr('data-original-title', t.t0 + unit + ' - ' + t.t1 + unit);
		$('aside.additional-info ul li:first div span:nth(1)').attr('data-original-title', (t.t1 + 1) + unit + ' - ' + t.t2 + unit);
		$('aside.additional-info ul li:first div span:nth(2)').attr('data-original-title', (t.t2 + 1) + unit + ' - ' + t.t3 + unit);
		$('aside.additional-info ul li:first div span:nth(3)').attr('data-original-title', (t.t3 + 1) + unit + ' - ' + t.t4 + unit);
		$('aside.additional-info ul li:first div span:nth(4)').attr('data-original-title', (t.t4 + 1) + unit + ' - ' + t.t5 + unit);
	}
	
	function updateKanji() {
		var dataToDisplay = $('#data_to_display').val();
	
		var zeroAsMinimum = $('#zero_as_minimum').is(':checked');
		if (zeroAsMinimum) {
			var max = statistics[dataToDisplay].max;
			calculate_classification_thresholds(0, max);
		}
		else {
			var min = statistics[dataToDisplay].min;
			var max = statistics[dataToDisplay].max;
			calculate_classification_thresholds(min, max);
		}
		
		updateLegend();
		
		var kanji = $('section.lattice-single-character a');
		kanji.each(function(i, item) {
			var isLocked = $(this).parent().attr('is_locked');
			if (isLocked == 'true') {
				return;
			}

			$(this).removeClass('percentage-0-20 percentage-21-40 percentage-41-60 percentage-61-80 percentage-81-100');
			
			var value = $(this).parent().attr('data_' + dataToDisplay);
			$(this).addClass(classify_item(value));
		});
	}
	
	function updateHtmlItems() {
		var dataToDisplay = $('#data_to_display').val();
	
		var zeroAsMinimum = $('#zero_as_minimum').is(':checked');
		if (zeroAsMinimum) {
			var max = statistics[dataToDisplay].max;
			calculate_classification_thresholds(0, max);
		}
		else {
			var min = statistics[dataToDisplay].min;
			var max = statistics[dataToDisplay].max;
			calculate_classification_thresholds(min, max);
		}
		
		updateLegend();
		
		var htmlItems = $('section.lattice-single-character a, section.lattice-multi-character a');
		htmlItems.each(function(i, item) {
			var isLocked = $(this).parent().attr('is_locked');
			if (isLocked != 'false') {
				return;
			}

			$(this).removeClass('percentage-0-20 percentage-21-40 percentage-41-60 percentage-61-80 percentage-81-100');
			
			var value = $(this).parent().attr('data_' + dataToDisplay);
			$(this).addClass(classify_item(value));
		});
	}
	
	function buildSelectBox() {
		var isOnLatticeCombined = WaniKani.is_on_lattice_kanji_combined() || WaniKani.is_on_lattice_vocabulary_combined();
		var isOnLatticeMeaning = WaniKani.is_on_lattice_kanji_meaning() || WaniKani.is_on_lattice_vocabulary_meaning();
		var isOnLatticeReading = WaniKani.is_on_lattice_kanji_reading() || WaniKani.is_on_lattice_vocabulary_reading();
		
		var selectBox = '<select id="data_to_display" class="input" name="data_to_display" title="Select what data to display.">';
		for(var key in used_labels){
			var selected = '';
			
			if (isOnLatticeCombined) {
				if (key == 'combined_percent_answered_correct') {
					selected = 'selected';
				}
			}
			else if (isOnLatticeMeaning) {
				if (key == 'meaning_percent_answered_correct') {
					selected = 'selected';
				}
			}
			else if (isOnLatticeReading) {
				if (key == 'reading_percent_answered_correct') {
					selected = 'selected';
				}
			}
			
			selectBox = selectBox + '<option value="' + key + '" ' + selected + '>' + used_labels[key] + '</option>';
		}
		selectBox = selectBox + '</select>'
		return selectBox;
	}
	
	function addToStatistics(attribute, value) {
		var currentMin = statistics[attribute].min;
		var currentMax = statistics[attribute].max;
		statistics[attribute].min = (currentMin < value) ? currentMin : value;
		statistics[attribute].max = (currentMax < value) ? value : currentMax;
	}
	
	function cleanUpItem(item) {
		var title = item.attr('data-original-title');
		var index = title.indexOf('<br />');
		if (index != -1) {
			title = title.substr(0, index);
			item.attr('data-original-title', title);
		}
	}
	
	function extendItem(value, item, dataAttr) {
		var newTitle = item.attr('data-original-title');
		
		var valueText;
		
		if (loaded_snapshot.id == 0) {
			valueText = value;
		}
		else {
			if (value < 0) {
				valueText = value;
			}
			else if (value > 0) {
				valueText = '+' + value;
			}
			else {
				valueText = 'no change';
			}
		}
		
		newTitle += '<br />' + used_labels[dataAttr] + ': ' + valueText;
		item.attr('data-original-title', newTitle);
		
		item.parent().attr('data_' + dataAttr, value);
		
		addToStatistics(dataAttr, value);
	}
	
	function calcPercentAnsweredCorrect(correct, incorrect) {
		if (correct + incorrect > 0)
			return Math.round(100 * correct / (correct + incorrect));
		else
			return 0;
	}
	
	function extendLatticeRadicals() {
		used_labels = radicals_data_labels;
		
		removeText('aside.additional-info ul li:first');
		
		$('aside.additional-info ul li:first').append(buildSelectBox());
		$('#data_to_display').on('change', function() { updateHtmlItems(); });
		
		$('aside.additional-info ul li:first').append('<br />');
		
		$('aside.additional-info ul li:first').append(UI.buildSelection('selected_snapshot', 'Snapshot to use'));
		UI.addSelectionOption('selected_snapshot', 'none', 'No comparison', true);
		
		for (var i = 0; i < snapshot_index.snapshots.length; i++) {
			var snapshot = snapshot_index.snapshots[i];
		
			var snapshot_label = 'Compare to snapshot [' + snapshot.id + "] - " + new Date(snapshot.date_taken).toLocaleString();
			UI.addSelectionOption('selected_snapshot', snapshot.id, snapshot_label, false);		
		}
		
		UI.addOnChangeListener('selected_snapshot',
				function()
				{
					var selected = $('#selected_snapshot').val();
					
					if (selected == 'none')
						resetLoadedSnapshot();
					else
						loadSnapshot(selected);
					
					extendRadicalItems();
					updateHtmlItems();
				});
		
		$('aside.additional-info ul li:first').append(
			'<br /><input id="zero_as_minimum" type="checkbox" name="zero_as_minimum" checked>Use 0 as minimum<br>');
		$('#zero_as_minimum').on('change', function() { updateHtmlItems(); });
	
		extendRadicalItems();
	}
	
	function extendRadicalItems() {
		setupStatistics();
		
		var htmlItems = $('section.lattice-single-character a');
		htmlItems.each(function(i, item) {
			var uri = WaniKani.parse_item_url($(this).attr('href'));
			var itemInfo = WaniKani.find_item(uri.type, uri.name);
			if ((itemInfo == null) || (itemInfo.user_specific == null)) {
				$(this).parent().attr('is_locked', 'true');
				return;
			}
			
			var meaning = itemInfo.meaning;
			itemInfo = itemInfo.user_specific;
			
			var snapshotInfo = {
					meaning_correct: 0,
					meaning_incorrect: 0,
					meaning_current_streak: 0,
					meaning_max_streak: 0
				};
			if (loaded_snapshot.id != 0) {
				var numRadicals = loaded_snapshot.radical_data.requested_information.length;
				for (var j = 0; j < numRadicals; j++) {
					if (loaded_snapshot.radical_data.requested_information[j].meaning == meaning) {
						if (loaded_snapshot.radical_data.requested_information[j].user_specific != null) {
							snapshotInfo = loaded_snapshot.radical_data.requested_information[j].user_specific;
						}
						break;
					}
				}
			}
			
			$(this).parent().attr('is_locked', 'false');
			
			cleanUpItem($(this));
			
			{
				var correct = itemInfo.meaning_correct;
				var incorrect = itemInfo.meaning_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.meaning_correct;
				var snapshotIncorrect = snapshotInfo.meaning_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect, $(this), 'meaning_percent_answered_correct');
				extendItem(total - snapshotTotal,									$(this), 'meaning_total');
			}
			
			extendItem(itemInfo.meaning_correct - snapshotInfo.meaning_correct,					$(this), 'meaning_correct');
			extendItem(itemInfo.meaning_incorrect - snapshotInfo.meaning_incorrect,				$(this), 'meaning_incorrect');
			extendItem(itemInfo.meaning_current_streak - snapshotInfo.meaning_current_streak,	$(this), 'meaning_current_streak');
			extendItem(itemInfo.meaning_max_streak - snapshotInfo.meaning_max_streak,			$(this), 'meaning_max_streak');
		});
	}
	
	function extendLatticeKanji() {
		used_labels = kanji_data_labels;
		
		removeText('aside.additional-info ul li:first');
		
		$('aside.additional-info ul li:first').append(buildSelectBox());
		$('#data_to_display').on('change', function() { updateHtmlItems(); });
		
		$('aside.additional-info ul li:first').append('<br />');
		
		$('aside.additional-info ul li:first').append(UI.buildSelection('selected_snapshot', 'Snapshot to use'));
		UI.addSelectionOption('selected_snapshot', 'none', 'No comparison', true);
		
		for (var i = 0; i < snapshot_index.snapshots.length; i++) {
			var snapshot = snapshot_index.snapshots[i];
		
			var snapshot_label = 'Compare to snapshot [' + snapshot.id + "] - " + new Date(snapshot.date_taken).toLocaleString();
			UI.addSelectionOption('selected_snapshot', snapshot.id, snapshot_label, false);		
		}
		
		UI.addOnChangeListener('selected_snapshot',
				function()
				{
					var selected = $('#selected_snapshot').val();
					
					if (selected == 'none')
						resetLoadedSnapshot();
					else
						loadSnapshot(selected);
					
					extendKanjiItems();
					updateHtmlItems();
				});
		
		$('aside.additional-info ul li:first').append(
			'<br /><input id="zero_as_minimum" type="checkbox" name="zero_as_minimum" checked>Use 0 as minimum<br>');
		$('#zero_as_minimum').on('change', function() { updateHtmlItems(); });
		
		extendKanjiItems();
	}
	
	function extendKanjiItems() {
		setupStatistics();
		
		var htmlItems = $('section.lattice-single-character a');
		htmlItems.each(function(i, item) {
			var uri = WaniKani.parse_item_url($(this).attr('href'));
			var itemInfo = WaniKani.find_item(uri.type, uri.name);
			if ((itemInfo == null) || (itemInfo.user_specific == null)) {
				$(this).parent().attr('is_locked', 'true');
				return;
			}
			
			var character = itemInfo.character;
			itemInfo = itemInfo.user_specific;
			
			var snapshotInfo = {
					meaning_correct: 0,
					meaning_incorrect: 0,
					meaning_current_streak: 0,
					meaning_max_streak: 0,
					reading_correct: 0,
					reading_incorrect: 0,
					reading_current_streak: 0,
					reading_max_streak: 0
				};
			if (loaded_snapshot.id != 0) {
				var numKanji = loaded_snapshot.kanji_data.requested_information.length;
				for (var j = 0; j < numKanji; j++) {
					if (loaded_snapshot.kanji_data.requested_information[j].character == character) {
						if (loaded_snapshot.kanji_data.requested_information[j].user_specific != null) {
							snapshotInfo = loaded_snapshot.kanji_data.requested_information[j].user_specific;
						}
						break;
					}
				}
			}
			
			$(this).parent().attr('is_locked', 'false');
			
			cleanUpItem($(this));
			
			{
				var correct = itemInfo.meaning_correct + itemInfo.reading_correct;
				var incorrect = itemInfo.meaning_incorrect + itemInfo.reading_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.meaning_correct + snapshotInfo.reading_correct;
				var snapshotIncorrect = snapshotInfo.meaning_incorrect + snapshotInfo.reading_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect,	$(this), 'combined_percent_answered_correct');
				extendItem(correct - snapshotCorrect,								$(this), 'combined_correct');
				extendItem(incorrect - snapshotIncorrect,							$(this), 'combined_incorrect');
				extendItem(total - snapshotTotal,									$(this), 'combined_total');
			}
			
			{
				var correct = itemInfo.meaning_correct;
				var incorrect = itemInfo.meaning_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.meaning_correct;
				var snapshotIncorrect = snapshotInfo.meaning_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect,	$(this), 'meaning_percent_answered_correct');
				extendItem(correct - snapshotCorrect,								$(this), 'meaning_correct');
				extendItem(incorrect - snapshotIncorrect,							$(this), 'meaning_incorrect');
				extendItem(total - snapshotTotal,									$(this), 'meaning_total');
			}
			
			{
				var correct = itemInfo.reading_correct;
				var incorrect = itemInfo.reading_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.reading_correct;
				var snapshotIncorrect = snapshotInfo.reading_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect,	$(this), 'reading_percent_answered_correct');
				extendItem(correct - snapshotCorrect,								$(this), 'reading_correct');
				extendItem(incorrect - snapshotIncorrect,							$(this), 'reading_incorrect');
				extendItem(total - snapshotTotal,									$(this), 'reading_total');
			}
			
			extendItem(itemInfo.meaning_correct - snapshotInfo.meaning_correct,					$(this), 'meaning_correct');
			extendItem(itemInfo.meaning_incorrect - snapshotInfo.meaning_incorrect,				$(this), 'meaning_incorrect');
			extendItem(itemInfo.meaning_current_streak - snapshotInfo.meaning_current_streak,	$(this), 'meaning_current_streak');
			extendItem(itemInfo.meaning_max_streak - snapshotInfo.meaning_max_streak,			$(this), 'meaning_max_streak');
			extendItem(itemInfo.reading_correct - snapshotInfo.reading_correct,					$(this), 'reading_correct');
			extendItem(itemInfo.reading_incorrect - snapshotInfo.reading_incorrect,				$(this), 'reading_incorrect');
			extendItem(itemInfo.reading_max_streak - snapshotInfo.reading_max_streak,			$(this), 'reading_max_streak');
			extendItem(itemInfo.reading_current_streak - snapshotInfo.reading_current_streak,	$(this), 'reading_current_streak');
		});
	}
	
	function extendLatticeVocabulary() {
		used_labels = vocabulary_data_labels;
		
		removeText('aside.additional-info ul li:first');
		
		$('aside.additional-info ul li:first').append(buildSelectBox());
		$('#data_to_display').on('change', function() { updateHtmlItems(); });
		
		$('aside.additional-info ul li:first').append('<br />');
		
		$('aside.additional-info ul li:first').append(UI.buildSelection('selected_snapshot', 'Snapshot to use'));
		UI.addSelectionOption('selected_snapshot', 'none', 'No comparison', true);
		
		for (var i = 0; i < snapshot_index.snapshots.length; i++) {
			var snapshot = snapshot_index.snapshots[i];
		
			var snapshot_label = 'Compare to snapshot [' + snapshot.id + "] - " + new Date(snapshot.date_taken).toLocaleString();
			UI.addSelectionOption('selected_snapshot', snapshot.id, snapshot_label, false);		
		}
		
		UI.addOnChangeListener('selected_snapshot',
				function()
				{
					var selected = $('#selected_snapshot').val();
					
					if (selected == 'none')
						resetLoadedSnapshot();
					else
						loadSnapshot(selected);
					
					extendVocabularyItems();
					updateHtmlItems();
				});
		
		$('aside.additional-info ul li:first').append(
			'<br /><input id="zero_as_minimum" type="checkbox" name="zero_as_minimum" checked>Use 0 as minimum<br>');
		$('#zero_as_minimum').on('change', function() { updateHtmlItems(); });
		
		extendVocabularyItems();
	}
	
	function extendVocabularyItems() {
		setupStatistics();
		
		var vocabulary = $('section.lattice-multi-character a');
		vocabulary.each(function(i, item) {
			var uri = WaniKani.parse_item_url($(this).attr('href'));
			var itemInfo = WaniKani.find_item(uri.type, uri.name);
			if ((itemInfo == null) || (itemInfo.user_specific == null)) {
				$(this).parent().attr('is_locked', 'true');
				return;
			}
			
			var character = itemInfo.character;
			itemInfo = itemInfo.user_specific;
			
			var snapshotInfo = {
					meaning_correct: 0,
					meaning_incorrect: 0,
					meaning_current_streak: 0,
					meaning_max_streak: 0,
					reading_correct: 0,
					reading_incorrect: 0,
					reading_current_streak: 0,
					reading_max_streak: 0
				};
			if (loaded_snapshot.id != 0) {
				var numVocabulary = loaded_snapshot.vocabulary_data.requested_information.general.length;
				for (var j = 0; j < numVocabulary; j++) {
					if (loaded_snapshot.vocabulary_data.requested_information.general[j].character == character) {
						if (loaded_snapshot.vocabulary_data.requested_information.general[j].user_specific != null) {
							snapshotInfo = loaded_snapshot.vocabulary_data.requested_information.general[j].user_specific;
						}
						break;
					}
				}
			}
			
			$(this).parent().attr('is_locked', 'false');
			
			cleanUpItem($(this));
			
			{
				var correct = itemInfo.meaning_correct + itemInfo.reading_correct;
				var incorrect = itemInfo.meaning_incorrect + itemInfo.reading_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.meaning_correct + snapshotInfo.reading_correct;
				var snapshotIncorrect = snapshotInfo.meaning_incorrect + snapshotInfo.reading_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect,	$(this), 'combined_percent_answered_correct');
				extendItem(correct - snapshotCorrect,								$(this), 'combined_correct');
				extendItem(incorrect - snapshotIncorrect,							$(this), 'combined_incorrect');
				extendItem(total - snapshotTotal,									$(this), 'combined_total');
			}
			
			{
				var correct = itemInfo.meaning_correct;
				var incorrect = itemInfo.meaning_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.meaning_correct;
				var snapshotIncorrect = snapshotInfo.meaning_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect,	$(this), 'meaning_percent_answered_correct');
				extendItem(correct - snapshotCorrect,								$(this), 'meaning_correct');
				extendItem(incorrect - snapshotIncorrect,							$(this), 'meaning_incorrect');
				extendItem(total - snapshotTotal,									$(this), 'meaning_total');
			}
			
			{
				var correct = itemInfo.reading_correct;
				var incorrect = itemInfo.reading_incorrect;
				var total = correct + incorrect;
				var percentAnsweredCorrect = calcPercentAnsweredCorrect(correct, incorrect);
				
				var snapshotCorrect = snapshotInfo.reading_correct;
				var snapshotIncorrect = snapshotInfo.reading_incorrect;
				var snapshotTotal = snapshotCorrect + snapshotIncorrect;
				var snapshotPercentAnsweredCorrect = calcPercentAnsweredCorrect(snapshotCorrect, snapshotIncorrect);
				
				extendItem(percentAnsweredCorrect - snapshotPercentAnsweredCorrect,	$(this), 'reading_percent_answered_correct');
				extendItem(correct - snapshotCorrect,								$(this), 'reading_correct');
				extendItem(incorrect - snapshotIncorrect,							$(this), 'reading_incorrect');
				extendItem(total - snapshotTotal,									$(this), 'reading_total');
			}
			
			extendItem(itemInfo.meaning_correct - snapshotInfo.meaning_correct,					$(this), 'meaning_correct');
			extendItem(itemInfo.meaning_incorrect - snapshotInfo.meaning_incorrect,				$(this), 'meaning_incorrect');
			extendItem(itemInfo.meaning_current_streak - snapshotInfo.meaning_current_streak,	$(this), 'meaning_current_streak');
			extendItem(itemInfo.meaning_max_streak - snapshotInfo.meaning_max_streak,			$(this), 'meaning_max_streak');
			extendItem(itemInfo.reading_correct - snapshotInfo.reading_correct,					$(this), 'reading_correct');
			extendItem(itemInfo.reading_incorrect - snapshotInfo.reading_incorrect,				$(this), 'reading_incorrect');
			extendItem(itemInfo.reading_max_streak - snapshotInfo.reading_max_streak,			$(this), 'reading_max_streak');
			extendItem(itemInfo.reading_current_streak - snapshotInfo.reading_current_streak,	$(this), 'reading_current_streak');
		});		
	}
	
	function extendDropDownMenu() {
		if (dropDownMenuExtended) {
			return;
		}
		
	    $('<li><a href="#lattice_extension">Lattice Extension</a></li>')
	    	.insertBefore($('.account .dropdown-menu .nav-header:eq(1)'))
	    	.on('click', toggleSettingsWindow);
	    
	    dropDownMenuExtended = true;
	}
	
	function buildSettingsWindow() {
		UI.initCss();
		
		var html;
		
		html = UI.buildWindow('lattice_extension', 'Lattice Extension');
		$(html).insertAfter($('.navbar'));
		
		updateSettingsWindow();
		
		UI.addOnClickListener('lattice_extension_close_btn', {},
				function(e)
				{
					toggleSettingsWindow(e);
				});
		
		settingsWindowAdded = true;
	}

	function updateSettingsWindow() {
		var html;
		
		$('#lattice_extension_settings').remove();
		
		html = UI.buildTable('lattice_extension_settings');
		$('#lattice_extension_body').append(html);
		
		if (snapshot_index.snapshots.length >= max_num_snapshots) {
			html = UI.buildTableRow(
					'',
					'',
					'Max. number of snapshots reached. Delete some to create new ones.');
					
			$('#lattice_extension_settings_body').append(html);
		}
		else {
			html = UI.buildTableRow(
					'',
					'',
					UI.buildButton('new_snapshot', 'Create new snapshot'));
					
			$('#lattice_extension_settings_body').append(html);
			
			UI.addOnClickListener('new_snapshot', {},
					function(e)
					{
						createSnapshot();
					});
		}
		
		for (var i = 0; i < snapshot_index.snapshots.length; i++) {
			var snapshot = snapshot_index.snapshots[i];
			
			var info = 'Radicals: ' + snapshot.num_radicals + ', Kanji: ' + snapshot.num_kanji + ', Vocabulary: ' + snapshot.num_vocabulary;
			
			html = UI.buildTableRow(
					'',
					'Snapshot [' + snapshot.id + "] - " + new Date(snapshot.date_taken).toLocaleString(),
					UI.buildButton('delete_snapshot_' + snapshot.id, 'Delete snapshot'),
					info);
			$('#lattice_extension_settings_body').append(html);
			
			UI.addOnClickListener('delete_snapshot_' + snapshot.id, {id: snapshot.id},
					function(e)
					{
						var selection = confirm('Are you sure you want to delete this snapshot?');
						if (selection == true) {
							deleteSnapshot(e.data.id);
						}
					});
		}
	}
	
	function createSnapshot() {
		$('#new_snapshot').remove();
		
		html = UI.buildTableRow(
					'',
					'<b>Please wait! A new snapshot is being created ...</b>',
					'');
		$('#lattice_extension_settings_body').append(html);
		
		alert('A new snapshot is being created!\n' +
			'Click now on OK and wait for the snapshot list to update.');
		
		WaniKani
			.load_radical_data()
			.then(WaniKani.load_kanji_data)
			.then(WaniKani.load_vocabulary_data)
			.then(createSnapshotDataLoaded);
	}
	
	function createSnapshotDataLoaded() {
		var new_id = snapshot_index.next_id;
		snapshot_index.next_id++;

		loaded_snapshot = {};
		loaded_snapshot.id = new_id;
		loaded_snapshot.date_taken = new Date();
		loaded_snapshot.radical_data = WaniKani.get_radical_data();
		loaded_snapshot.kanji_data = WaniKani.get_kanji_data();
		loaded_snapshot.vocabulary_data = WaniKani.get_vocabulary_data();
		
		var index_entry = {};
		index_entry.id = new_id;
		index_entry.date_taken = loaded_snapshot.date_taken;
		index_entry.num_radicals = loaded_snapshot.radical_data.requested_information.length;
		index_entry.num_kanji = loaded_snapshot.kanji_data.requested_information.length;
		index_entry.num_vocabulary = loaded_snapshot.vocabulary_data.requested_information.general.length;
		snapshot_index.snapshots.push(index_entry);
		
		var saved = saveLoadedSnapshot();
		
		if (saved) {
			saved = saveSnapshotIndex();
		}
		
		if (saved) {
			updateSettingsWindow();
		}
	}
	
	function deleteSnapshot(snapshot_id) {
		var index = snapshot_index.snapshots.findIndex(function(item) { return (item.id == snapshot_id); });
		if (index > -1) {
			snapshot_index.snapshots.splice(index, 1);
			
			var saved = saveSnapshotIndex();
			
			if (saved) {
				deleteLoadedSnapshot();
				updateSettingsWindow();
			}
		}
	}
	
	function resetLoadedSnapshot() {
		loaded_snapshot = {id:0};
	}
	
	function loadSnapshot(snapshot_id) {
		var loaded = localStorage.getItem(localStoragePrefix + 'snapshot' + snapshot_id);
		if (loaded != null) {
			var tmp = JSON.parse(LZString.decompressFromUTF16(loaded));
			
			if (tmp == null) {
				alert('Failed to load snapshot ' + snapshot_id);
			}
			else {
				loaded_snapshot = tmp;
			}
		}
	}
	
	function loadSnapshotIndex() {
		var loaded = localStorage.getItem(localStoragePrefix + 'snapshot_index');
		if (loaded != null) {
			snapshot_index = JSON.parse(LZString.decompressFromUTF16(loaded));
			
			if (snapshot_index == null) {
				alert('Failed to load snapshot index');
				return false;
			}
		}
		
		return true;
	}
	
	function saveSnapshotIndex() {
		try {
			var stringified = JSON.stringify(snapshot_index);
			var compressed = LZString.compressToUTF16(stringified);
			
			if (LZString.decompressFromUTF16(compressed) == null) {
				alert('Failed to save snapshot index: Compression error');
			}
			else {
				localStorage.setItem(localStoragePrefix + 'snapshot_index', compressed);
			}
		} catch (err) {
			alert(err.message);
			return false;
		}
		
		return true;
	}
	
	function saveLoadedSnapshot() {
		try {
			var stringified = JSON.stringify(loaded_snapshot);
			var compressed = LZString.compressToUTF16(stringified);
			
			if (LZString.decompressFromUTF16(compressed) == null) {
				alert('Failed to save snapshot ' + loaded_snapshot.id + ': Compression error');
			}
			else {
				localStorage.setItem(localStoragePrefix + 'snapshot' + loaded_snapshot.id, compressed);
			}
		} catch (err) {
			alert(err.message);
			return false;
		}
		
		return true;
	}
	
	function deleteLoadedSnapshot() {
		try {
			localStorage.removeItem(localStoragePrefix + 'snapshot' + loaded_snapshot.id);
			loaded_snapshot = {id: 0};
		} catch (err) {
			alert(err.message);
			return false;
		}
		
		return true;
	}
	
    function toggleSettingsWindow(e) {
        if (e !== undefined) e.preventDefault();

        // Add the manager if not already.
        if (!settingsWindowAdded) buildSettingsWindow();

        $('#lattice_extension').slideToggle();
        $('html, body').animate({scrollTop: 0}, 800);
    }
	
	//-------------------------------------------------------------------
	// Main function
	//-------------------------------------------------------------------
	function main() {
		console.log('START - WaniKani Lattice Extension');
		
		var indexLoaded = loadSnapshotIndex();
		
		if (indexLoaded) {
			extendDropDownMenu();
			
			WaniKani.track_times();
		
			if (WaniKani.is_on_lattice_radicals_meaning()) {
				WaniKani.load_radical_data().then(extendLatticeRadicals);
			}
			else if (WaniKani.is_on_lattice_kanji_combined() || WaniKani.is_on_lattice_kanji_meaning() || WaniKani.is_on_lattice_kanji_reading()) {
				WaniKani.load_kanji_data().then(extendLatticeKanji);
			}
			else if (WaniKani.is_on_lattice_vocabulary_combined() || WaniKani.is_on_lattice_vocabulary_meaning() || WaniKani.is_on_lattice_vocabulary_reading()) {
				WaniKani.load_vocabulary_data().then(extendLatticeVocabulary);
			}
		}
		
		console.log('END - WaniKani Lattice Extension');
	}
	window.addEventListener('load', main, false);

}());