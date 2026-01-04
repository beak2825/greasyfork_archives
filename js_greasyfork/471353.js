// ==UserScript==
// @name         h5st
// @namespace    http://tampermonkey/
// @version      0.1
// @description  Example of using CryptoJS in Tampermonkey script
// @match        https://jzt.jd.com/jdkc/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require     https://greasyfork.org/scripts/471352-fp/code/FP.user.js
// @downloadURL https://update.greasyfork.org/scripts/471353/h5st.user.js
// @updateURL https://update.greasyfork.org/scripts/471353/h5st.meta.js
// ==/UserScript==
const version = "3.1",
	appid = "8765b",
	timestamp = Date.now();
//随机生成fp浏览器指纹
var fp = Jh('vk1_8765b', 'dy_tk_s_8765b');
function main() {
  fetchToken()
    .then(h5st => {
      console.log(h5st);
    })
    .catch(error => {
      console.log(error);
    });
}

main();

function fetchToken() {
  return fetch("https://cactus.jd.com/request_algo?g_ty=ajax", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    body: JSON.stringify({
      version: version,
      fp: fp,
      appId: appid,
      timestamp: timestamp,
      platform: "web",
      expandParams: geteP()
    }),
    method: "POST",
    mode: "cors",
    credentials: "omit"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        const token = data.data.result.tk;
        const generateDate = nx(timestamp);
        const algo = eval(`(${data.data.result.algo})`);
        const 第一次加密结果 = algo(token, fp, generateDate, appid, CryptoJS).toString();
        console.log(`第一次加密前：${token}, ${fp}, ${generateDate}, ${appid}}`);
        console.log(`第一次加密后：${第一次加密结果}`);
        const 第二次加密结果 = CryptoJS.HmacSHA256('adGroupType:2&businessType:2&encryptSignApiAppId:encryptSignApiAppId', 第一次加密结果).toString(CryptoJS.enc.Hex);
        console.log(`第二次加密后：${第二次加密结果}`);
        const h5st = `${generateDate};${fp};${appid};${token};${第二次加密结果};${version};${timestamp};${getspf()}`;
        return h5st;
      } else {
        console.log("获取加密参数错误");
        throw new Error("获取加密参数错误");
      }
    });
}


//时间戳转年月日时分秒毫秒
function nx(time) {
	const date = new Date(time);
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		fractionalSecondDigits: 3
	};
	return date.toLocaleString('zh-CN', options)
		.replace(/[-:\s./]/g, '');
};

//生成获取第二步加密函数的eP请求参数
function geteP() {
	let obj = {
		"wc": 0,
		"wd": 0,
		"l": "zh-CN",
		"ls": "zh-CN,en,en-GB,en-US,zh-TW",
		"ml": 2,
		"pl": 5,
		"av": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
		"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
		"sua": "Windows NT 10.0; Win64; x64",
		"pp": {},
		"pp1": "",
		"pm": {
			"ps": "prompt",
			"np": "default"
		},
		"w": 1680,
		"h": 1050,
		"ow": 1680,
		"oh": 1010,
		"url": "",
		"og": "",
		"pr": 1,
		"re": "",
		"ai": appid,
		"fp": fp
	}
	const iv = "0102030405060708"
	const key = "wm0!@w-s#ll1flo("
	//AES.CBC.PKCS7加密obj
	return aesencryp(obj, iv, key);
};

//8、AES加密AES.CBC.PKCS7
function getspf() {
	// 定义要加密的对象
	let obj = {
		"sua": "Windows NT 10.0; Win64; x64",
		"pp": {},
		"fp": fp
	}
	// 定义初始化向量和密钥
	const iv = "0102030405060708"
	const key = "wm0!@w_s#ll1flo("
	return aesencryp(obj, iv, key)
};

//AES加密传参函数
function aesencryp(obj, iv, key) {
	// 将对象转换为字符串
	obj = JSON.stringify(obj, null, 2)
	// 使用AES.CBC.PKCS7加密方法对对象进行加密
	const encrypted = CryptoJS.AES.encrypt(obj, CryptoJS.enc.Utf8.parse(key), {
			iv: CryptoJS.enc.Utf8.parse(iv),
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		})
		.ciphertext.toString();
	console.log(`AES加密前：${obj}`);
	console.log(`AES加密后：${encrypted}`);
	return encrypted
};