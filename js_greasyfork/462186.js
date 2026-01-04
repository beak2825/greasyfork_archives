// ==UserScript==
// @name         科大教务验证码助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  科大教务助手，自动登录!
// @author       xinghehy
// @match        *://xsjw.imust.edu.cn/login*
// @icon         data:image/png;base64,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
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/462186/%E7%A7%91%E5%A4%A7%E6%95%99%E5%8A%A1%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462186/%E7%A7%91%E5%A4%A7%E6%95%99%E5%8A%A1%E9%AA%8C%E8%AF%81%E7%A0%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var username = ''; //学号
var password = ''; //密码
(function () {
    var password2 = hex_md5(password);
	console.log("MD5密码：" + password2);
	document.getElementById("input_username").value = username;
	document.getElementById("input_password").value = password.length == 0 ? "" : password;
	$("#loginButton").after('<br><br><span style="color: #7b0003;">如验证码识别错误 可刷新页面重新识别</span>');
	setTimeout(function () {
		var img = $("#captchaImg")[0];
		var dataURL = getBase64Image(img);
		console.log(dataURL);
		$.ajax({
			url: 'https://api.nn.ci/ocr/b64/json',
			type: "POST",
			dataType: "json",
			data: dataURL.substr(dataURL.indexOf(',') + 1),
			success: function (res) {
				// 将识别结果显示在文本框中
				console.log(res);
				document.getElementById('input_checkcode').value = res.result;
				$("#loginButton").before("<br>验证码识别成功<br>");
			},
			error: function (err) {
				$("#loginButton").before("<br>验证码自动识别失败，请自行填写<br>");
				console.log(err);
			},
		});
	}, 1000);
})();

/**
 * ⽹络图像⽂件转Base64
*/
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/" + ext);
	return dataURL;
}

/*
 * urp登录密码加密算法
*/
function hex_md5(string) {
	function md5_RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
	}
	function md5_AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
			}
		} else {
			return (lResult ^ lX8 ^ lY8)
		}
	}
	function md5_F(x, y, z) {
		return (x & y) | ((~x) & z)
	}
	function md5_G(x, y, z) {
		return (x & z) | (y & (~z))
	}
	function md5_H(x, y, z) {
		return (x ^ y ^ z)
	}
	function md5_I(x, y, z) {
		return (y ^ (x | (~z)))
	}
	function md5_FF(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	};
	function md5_GG(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	};
	function md5_HH(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	};
	function md5_II(a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	};
	function md5_ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray
	};
	function md5_WordToHex(lValue) {
		var WordToHexValue = "",
			WordToHexValue_temp = "",
			lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
		}
		return WordToHexValue
	};
	function md5_Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c)
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128)
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128)
			}
		}
		return utftext
	};
	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22;
	var S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20;
	var S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23;
	var S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;
	string = md5_Utf8Encode(string + "{Urp602019}");
	x = md5_ConvertToWordArray(string);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;
	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = md5_AddUnsigned(a, AA);
		b = md5_AddUnsigned(b, BB);
		c = md5_AddUnsigned(c, CC);
		d = md5_AddUnsigned(d, DD)
	}
	return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase()
}