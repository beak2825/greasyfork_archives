// ==UserScript==
// @name           Gaia Online API
// @description    Easy way to switch/manage accounts on Gaia Online.
// @include        http://www.gaiaonline.com/*
// @include        https://www.gaiaonline.com/*
// @version        2.10.29
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/187861
// @downloadURL https://update.greasyfork.org/scripts/368515/Gaia%20Online%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/368515/Gaia%20Online%20API.meta.js
// ==/UserScript==
window.gUtilities = function() {
   var self = this;
   self.md5 = function(string) {
      function f1(a, b) {
         var c, d, e, f, g;
         e = (a & 0x80000000), f = (b & 0x80000000), c = (a & 0x40000000), d = (b & 0x40000000), g = (a & 0x3FFFFFFF) + (b & 0x3FFFFFFF);
         return (((c & d) || (c | d)) ? ((c & d) ? (g ^ 0x80000000 ^ e ^ f) : (g & 0x40000000 ? (g ^ 0xC0000000 ^ e ^ f) : (g ^ 0x40000000 ^ e ^ f))) : (g ^ e ^ f));
      }
      function f2(a, b, c, d, e, f, g) {
         a = f1(a, f1(f1((b & c) | ((~b) & d), e), g));
         return f1((a << f) | (a >>> (32 - f)), b);
      }
      function f3(a, b, c, d, e, f, g) {
         a = f1(a, f1(f1((b & d) | (c & (~d)), e), g));
         return f1((a << f) | (a >>> (32 - f)), b);
      }
      function f4(a, b, c, d, e, f, g) {
         a = f1(a, f1(f1((b ^ c ^ d), e), g));
         return f1((a << f) | (a >>> (32 - f)), b);
      }
      function f5(a, b, c, d, e, f, g) {
         a = f1(a, f1(f1((c ^ (b | (~d))), e), g));
         return f1((a << f) | (a >>> (32 - f)), b);
      }
      function f6(a) {
         var b, c = a.length, d = c + 8, e = (d - (d % 64)) / 64, f = (e + 1) * 16, g = Array(f - 1), h = i = 0;
         while ( i < c ) {
            b = (i - (i % 4)) / 4, h = (i % 4) * 8, g[b] = (g[b] | (a.charCodeAt(i) << h)), i++;
         }
         b = (i - (i % 4)) / 4, h = (i % 4) * 8, g[b] = g[b] | (0x80 << h), g[f - 2] = c << 3, g[f - 1] = c >>> 29;
         return g;
      }
      function f7(a) {
         var b = '', c = '', d, e;
         for ( e = 0; e <= 3; e++ ) {
            d = (a >>> (e * 8)) & 255, c = '0' + d.toString(16), b = b + c.substr(c.length - 2, 2);
         }
         return b;
      }
      function f8(a) {
         a = a.replace(/\r\n/g, '\n'), b = '';
         for ( var c = 0; c < a.length; c++ ) {
            var d = a.charCodeAt(c);
            if ( d < 128 ) {
               b += String.fromCharCode(d);
            }
            else if ( (d > 127) && (d < 2048) ) {
               b += String.fromCharCode((d >> 6) | 192), b += String.fromCharCode((d & 63) | 128);
            }
            else {
               b += String.fromCharCode((d >> 12) | 224), b += String.fromCharCode(((d >> 6) & 63) | 128), b += String.fromCharCode((d & 63) | 128);
            }
         }
         return b;
      }
      var x = Array();
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11    = 7, S12 = 12, S13 = 17, S14 = 22;
      var S21    = 5, S22 = 9 , S23 = 14, S24 = 20;
      var S31    = 4, S32 = 11, S33 = 16, S34 = 23;
      var S41    = 6, S42 = 10, S43 = 15, S44 = 21;
      string     = f8(string), x = f6(string), a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;
      for ( k = 0; k < x.length; k += 16 ) {
         AA = a; BB = b; CC = c; DD = d;
         a = f2(a, b, c, d, x[k + 0],  S11, 0xD76AA478);
         d = f2(d, a, b, c, x[k + 1],  S12, 0xE8C7B756);
         c = f2(c, d, a, b, x[k + 2],  S13, 0x242070DB);
         b = f2(b, c, d, a, x[k + 3],  S14, 0xC1BDCEEE);
         a = f2(a, b, c, d, x[k + 4],  S11, 0xF57C0FAF);
         d = f2(d, a, b, c, x[k + 5],  S12, 0x4787C62A);
         c = f2(c, d, a, b, x[k + 6],  S13, 0xA8304613);
         b = f2(b, c, d, a, x[k + 7],  S14, 0xFD469501);
         a = f2(a, b, c, d, x[k + 8],  S11, 0x698098D8);
         d = f2(d, a, b, c, x[k + 9],  S12, 0x8B44F7AF);
         c = f2(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
         b = f2(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
         a = f2(a, b, c, d, x[k + 12], S11, 0x6B901122);
         d = f2(d, a, b, c, x[k + 13], S12, 0xFD987193);
         c = f2(c, d, a, b, x[k + 14], S13, 0xA679438E);
         b = f2(b, c, d, a, x[k + 15], S14, 0x49B40821);
         a = f3(a, b, c, d, x[k + 1],  S21, 0xF61E2562);
         d = f3(d, a, b, c, x[k + 6],  S22, 0xC040B340);
         c = f3(c, d, a, b, x[k + 11], S23, 0x265E5A51);
         b = f3(b, c, d, a, x[k + 0],  S24, 0xE9B6C7AA);
         a = f3(a, b, c, d, x[k + 5],  S21, 0xD62F105D);
         d = f3(d, a, b, c, x[k + 10], S22, 0x2441453);
         c = f3(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
         b = f3(b, c, d, a, x[k + 4],  S24, 0xE7D3FBC8);
         a = f3(a, b, c, d, x[k + 9],  S21, 0x21E1CDE6);
         d = f3(d, a, b, c, x[k + 14], S22, 0xC33707D6);
         c = f3(c, d, a, b, x[k + 3],  S23, 0xF4D50D87);
         b = f3(b, c, d, a, x[k + 8],  S24, 0x455A14ED);
         a = f3(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
         d = f3(d, a, b, c, x[k + 2],  S22, 0xFCEFA3F8);
         c = f3(c, d, a, b, x[k + 7],  S23, 0x676F02D9);
         b = f3(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
         a = f4(a, b, c, d, x[k + 5],  S31, 0xFFFA3942);
         d = f4(d, a, b, c, x[k + 8],  S32, 0x8771F681);
         c = f4(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
         b = f4(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
         a = f4(a, b, c, d, x[k + 1],  S31, 0xA4BEEA44);
         d = f4(d, a, b, c, x[k + 4],  S32, 0x4BDECFA9);
         c = f4(c, d, a, b, x[k + 7],  S33, 0xF6BB4B60);
         b = f4(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
         a = f4(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
         d = f4(d, a, b, c, x[k + 0],  S32, 0xEAA127FA);
         c = f4(c, d, a, b, x[k + 3],  S33, 0xD4EF3085);
         b = f4(b, c, d, a, x[k + 6],  S34, 0x4881D05);
         a = f4(a, b, c, d, x[k + 9],  S31, 0xD9D4D039);
         d = f4(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
         c = f4(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
         b = f4(b, c, d, a, x[k + 2],  S34, 0xC4AC5665);
         a = f5(a, b, c, d, x[k + 0],  S41, 0xF4292244);
         d = f5(d, a, b, c, x[k + 7],  S42, 0x432AFF97);
         c = f5(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
         b = f5(b, c, d, a, x[k + 5],  S44, 0xFC93A039);
         a = f5(a, b, c, d, x[k + 12], S41, 0x655B59C3);
         d = f5(d, a, b, c, x[k + 3],  S42, 0x8F0CCC92);
         c = f5(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
         b = f5(b, c, d, a, x[k + 1],  S44, 0x85845DD1);
         a = f5(a, b, c, d, x[k + 8],  S41, 0x6FA87E4F);
         d = f5(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
         c = f5(c, d, a, b, x[k + 6],  S43, 0xA3014314);
         b = f5(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
         a = f5(a, b, c, d, x[k + 4],  S41, 0xF7537E82);
         d = f5(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
         c = f5(c, d, a, b, x[k + 2],  S43, 0x2AD7D2BB);
         b = f5(b, c, d, a, x[k + 9],  S44, 0xEB86D391);
         a = f1(a, AA), b = f1(b, BB), c = f1(c, CC), d = f1(d, DD);
      }
      return f7(a) + f7(b) + f7(c) + f7(d);
   };
   self.queryString = function(object) {
      var query = '';
      for ( var key in object ) {
         query += key         + '=';
         query += object[key] + '&';
      }
      return query.slice(0, -1);
   };
   self.urlDecode = function(data) {
      data = data.replace(/\+/g, ' ');
      return decodeURIComponent(data);
   };
   self.httpRequest = function(method, url, headers, post, callback) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {
         (this.readyState == 4 && callback(this.responseText));
      };
      request.open(method, url, true);
      for ( var i = 0; i < headers.length; i += 2 ) {
         request.setRequestHeader(headers[i], headers[i + 1]);
      }
      request.send(post);
   };
   self.getRequest = function(url, callback) {
      self.httpRequest('GET', url, [], null, callback);
   };
   self.postRequest = function(url, post, callback) {
      self.httpRequest('POST', url, ['X-Requested-With', 'XMLHttpRequest', 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8'], post, callback);
   };
   self.stripWhitespace = function(string) {
      string = string.replace(/\s+/g, ' ');
      return string.trim();
   };
   self.parseNumber = function(number) {
      number = String(number);
      number = number.replace(/[^0-9]/g, '');
      return Number(number);
   };
   self.numberFormat = function(number) {
      number = String(number);
      return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   };
   self.shortenNumber = function(number, places) {
      number = self.parseNumber(number);
      if ( number >= 1e15 ) {
         number /= 1e15;
         return number.toFixed(places) + 'Q';
      }
      else if ( number >= 1e12 ) {
         number /= 1e12;
         return number.toFixed(places) + 'T';
      }
      else if ( number >= 1e9 ) {
         number /= 1e9;
         return number.toFixed(places) + 'B';
      }
      else if ( number >= 1e6 ) {
         number /= 1e6;
         return number.toFixed(places) + 'M';
      }
      else if ( number >= 1e3 ) {
         number /= 1e3;
         return number.toFixed(places) + 'K';
      }
      else {
         return number;
      }
   };
   self.createElement = function(tag, attributes, value) {
      var element       = document.createElement(tag);
      element.innerHTML = value || '';
      for ( var i = 0; attributes && i < attributes.length; i += 2 ) {
         element.setAttribute(attributes[i], attributes[i + 1]);
      }
      return element;
   };
   self.appendChildren = function(element, children) {
      for ( var i = 0; i < children.length; i++ ) {
         element.appendChild(children[i]);
      }
   };
   self.removeChildren = function(element) {
      while ( element.hasChildNodes() ) {
         element.removeChild(element.lastChild);
      }
   };
   self.findElementsBy = function(element, tag, attribute, pattern) {
      for ( var found = [], elements = element.getElementsByTagName(tag), i = 0; i < elements.length; i++ ) {
         if ( elements[i].hasAttribute(attribute) && elements[i].getAttribute(attribute).match(new RegExp(pattern)) ) {
            found.push(elements[i]);
         }
      }
      return found;
   };
   self.elementChildValue = function(element, tag, index, attribute) {
      var elements = element.getElementsByTagName(tag);
      var child    = elements[index] || false;
      if ( child ) {
         return self.stripWhitespace(attribute && child.hasAttribute(attribute) ? child.getAttribute(attribute) : child.innerText);
      }
   };
};
