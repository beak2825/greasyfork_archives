// ==UserScript==
// @name              Shoprite Coupon Clicker
// @namespace         shoprite-coupon-click
// @version           1.0
// @description       Click all the coupons on Shoprite
// @author            sleevetrick
// @match             https://www.shoprite.com/sm/pickup/rsid/*/digital-coupon?cfrom=*
// @downloadURL https://update.greasyfork.org/scripts/530044/Shoprite%20Coupon%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/530044/Shoprite%20Coupon%20Clicker.meta.js
// ==/UserScript==
// Donations not required, but gladly appreciated via https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=lexlieberman@gmail.com&item_name=For+Shoprite+Coupon+Clicker+GF
// This script is NOT automatic - you must click ONE coupon, grab the bearer token from Network tab and load it into the token variable and then execute the scripts by copy and pasting the entire content below

var token = '<PASTE TOKEN HERE>';
var storenum = window.location.href.toString().slice(window.location.href.toString().indexOf("rsid")+5, window.location.href.toString().indexOf("digital-")-1);

async function postData(url = '', data = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
'Accept-Encoding': 'gzip, deflate, br, zstd',
'Accept-Language': 'en-US,en;q=0.9,da;q=0.8',
'Authorization': 'Bearer ' + token,
'Cache-Control': 'no-cache',
'Connection': 'keep-alive',
'Content-Type': 'application/json',
'Host': 'shop-rite-web-prod.azurewebsites.net',
'Origin': 'https://shop-rite-web-prod.azurewebsites.net',
'Pragma': 'no-cache',
'Referer': 'https://shop-rite-web-prod.azurewebsites.net/?cfrom=homenavigation',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-origin',
'Sec-Fetch-Storage-Access': 'active',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'x-api-version': 'v4'
  },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

var getCoupons = fetch('https://shop-rite-web-prod.azurewebsites.net/proxy/shoprite/coupons/available?storeId=' + storenum, {
  method: 'GET', // or POST, PUT, DELETE, etc.
  headers: {
    'Accept': 'application/json, text/plain, */*',
'Accept-Encoding': 'gzip, deflate, br, zstd',
'Accept-Language': 'en-US,en;q=0.9,da;q=0.8',
'Authorization': 'Bearer ' + token,
'Cache-Control': 'no-cache',
'Connection': 'keep-alive',
'Content-Type': 'application/json',
'Host': 'shop-rite-web-prod.azurewebsites.net',
'Origin': 'https://shop-rite-web-prod.azurewebsites.net',
'Pragma': 'no-cache',
'Referer': 'https://shop-rite-web-prod.azurewebsites.net/?cfrom=homenavigation',
'Sec-Fetch-Dest': 'empty',
'Sec-Fetch-Mode': 'cors',
'Sec-Fetch-Site': 'same-origin',
'Sec-Fetch-Storage-Access': 'active',
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'x-api-version': 'v4'
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
    return response.json();
})
.then(data => {
    var coupons = data;
      console.log(data);
    const url = 'https://shop-rite-web-prod.azurewebsites.net/proxy/shoprite/coupons/clip';
    for (var i = 0; i < coupons.length; i++) {
    console.log("REMAINING " + i + " out of " + coupons.length);
	const data = {
  		clip_token: coupons[i].clip_token,
  		coupon_id: coupons[i].coupon_id
	};
	postData(url, data)
  		.then(response => {
    	console.log('Success:', response);
  	}).catch(error => {
    	console.error('Failed to post data:', error);
  	});
    }
})
.catch(error => {
  console.error('Fetch Error:', error);
});