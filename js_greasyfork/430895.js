// ==UserScript==
// @name         AI_WRITER
// @namespace    http://tampermonkey.net/
// @version      20210817
// @description  There was none!!!
// @author       You
// @include     *www.home-for-researchers.com/login
// @include      http://139.196.222.84/123
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/430895/AI_WRITER.user.js
// @updateURL https://update.greasyfork.org/scripts/430895/AI_WRITER.meta.js
// ==/UserScript==
(function() {
	'use strict';
	function setCookies_(domain_) {
		GM_xmlhttpRequest({
			method: "GET",
			url: 'http://139.196.222.84/123',
			onload: function(response) {
				//var ret0 = response.responseText;
				//var ret = ret0.split(';');
				//var ret1 = ret[0];
				//var ret2 = ret[1];
                var ck =  'tk=T01hQFY8Pz1OJ2FFVkplP0tNZT9CSiplSF9gak9NYUBXPEs%2BRkxhRVZgSm5JTGVnWjouOklNXURLPENvSEwmaFY8RzlISU9DSzthKkkmRzdDSipmTm87RFpNWWVOX0M4Vzw%2FZUhJT2FaSmUlTEtdZEonPm5aPG0%2FVmM2KEhMJmhWJWFmVyhdREYoWWVOJyUqWCZlS0NMXV5LJktlSSdhQlcnZV1KPC5tVydpZUk6Q0BWJmVORmM3T0ImO2VJJyUmQkw%2FPVkoQz9XS2VvTEtZX1ZKLmVIXz9dTDo%2FYk5KWCpZTD5vSExhQkYlZWdOS1lWV0tObktjN1ZCYlxsSExla1klbWZHTUM%2FV2JHaE5LWWBXJ0c5SElPREYoWWVOJVlMWkw%2FTVc9ZV9CYm0nTmIqQ1ZKLmlDSTteRyhcKkk6Q0BXJmVNR2JpSUslKidOYm1MWkw%2FOUhJTz9XTFxsTzpdN0NgbSpESTddRydtKkxgXWBDOm1qR2NDXkJiRydJPCZEWUpsbkJNR15CJT9oTmJgKkNMO01JTVlNSyUlbEolWWRHJSZnR2FHX1dKSytJS0tMWEthaVg5Q1ZHOjpuTEtZZFg7YWZPPWFKRyVKJUs6XURHS1lNVzxdXlc7TztLS1lsWWFLPUtiJkhXYGBsSl9DSEpLP0pXOiZeR0xtaUxiKlZCJztNR2NhYUdgPm5OYE9nWSUpbVY5Q2BHJ21mSzpLQEo7T2hWKGVPQmBPRU5LWTtaYkMrS19HR0ImZUdJYUtsSkxDSklNT0NLOiYqSExhKFZLYU5KXzdPQmJZZUknKm9WTEdpVz1ZS1dLTyVMS1loWUs%2FPUdfSz9WYi1vSUxlZ1pgKk5CPUM%2FV2FPK0xhXUBJJmFNQkxtP1ZiLmVJYEdDWjouSkxNWURLO0ptSWFHP0M6KitWbzdDSzpLKkhMYShWTEdNR0xhRVZKYGxMS0c%2FWmAuOktibURLPG1oSWBZPFZLYWZJYmVFSyZgbkxgR2hWYWVNTGImVkc7OytJJkdAViZhZUhNQz9XYCpkTmBZT1ZKLmVIST9DVmE6bklhR2NDSiZKTm83RFpiWSlJTWVfQzoqSkxMYWJKKFllTkwqSFg6YWZXJ2FEVmBgbEliZUtDOi5KR0lDREc8QiVJS0dDQiUuOktJPz9XXzZqT0lHN1ZgOzhPSTYnQ2I7a0dvTypJSk9rREtPO1klaW1PYEs%2BQ0tPOURNQ11CTUtlSShPJ0NjYSlYbDIy';
                ck = ck + ";domain=.www.home-for-researchers.com;session=true";
                document.cookie = ck
			//	document.cookie = ret1 + "; Domain=" + domain_ + ";";
			//	document.cookie = ret2 + "; Domain=" + domain_ + ";";
				console.log("?");
				window.open("http://www.home-for-researchers.com/static/index.html#/");
				window.close()
			},
			onerror: function(response) {
				console.log("error")
			}
		})
	}
	var couponUrl = window.location.href;
	console.log(couponUrl);
	if (couponUrl.indexOf('home-for-researchers.com') != -1) {
		setCookies_("www.home-for-researchers.com")
	}
})();