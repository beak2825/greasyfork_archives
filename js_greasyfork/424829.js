// ==UserScript==
// @name         AC.QQ Show Chapter Date
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      7.6.3
// @description  Fetches and displays the chapter dates for AC.QQ manhua
// @author       Quin15
// @include      https://ac.qq.com/comic/comicinfo/id/*
// @icon         https://www.google.com/s2/favicons?domain=ac.qq.com
// @grant        GM_xmlhttpRequest
// @connect      android.ac.qq.com
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.js
// @require      http://cdn.bootcss.com/crypto-js/3.1.2/components/core.js
// @require      http://cdn.bootcss.com/crypto-js/3.1.2/components/enc-base64.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.2/rollups/tripledes.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.2/components/mode-ecb.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.2/components/pad-nopadding.js


// @downloadURL https://update.greasyfork.org/scripts/424829/ACQQ%20Show%20Chapter%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/424829/ACQQ%20Show%20Chapter%20Date.meta.js
// ==/UserScript==

var URL = "https://android.ac.qq.com/9.1.6/Comic/comicDetail/comic_id/" + location.pathname.split('/').reverse()[0];
var URLElem = document.createElement ('a');
URLElem.href = URL;

var pathname = URLElem.pathname;
var host = URLElem.host;
var fakeduin = 0;
var qimei = "ad57da43453c391a18adb346100018e15406";
var localtime = Date.now();
var hashsalt = "4jo2YHMm0d2VGt59tVYndX9P7eFcw8TvRv5lMqFP1TT";
var tripleDESDecryptionKey = "babf73a94156d1d931e87f87";

var unhashed = pathname + host + fakeduin + qimei + localtime + hashsalt;
var sc = md5(unhashed);

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        URL,
    headers:    {"localtime": localtime, "imei": qimei, "qimei": qimei, "qimei36": qimei, "sc": sc},
    onload:     function (responseDetails) {
        var responseText = responseDetails.responseText;
        function decryptDesEbcPkcs7Padding(encryptedBody, key) {
            var keyWords = CryptoJS.enc.Utf8.parse(key);
            var decryptedBody = CryptoJS.TripleDES.decrypt({ciphertext: encryptedBody}, keyWords, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
            return decryptedBody.toString(CryptoJS.enc.Utf8);
        };

        var encryptedBodyb64Decoded = CryptoJS.enc.Base64.parse(responseText);
        var decryptedBody = decryptDesEbcPkcs7Padding(encryptedBodyb64Decoded, tripleDESDecryptionKey);
        var decryptedJSON = JSON.parse(decryptedBody);
        var chapDOMElemList = document.querySelectorAll('.works-chapter-item');

        console.log(decryptedJSON);

        var chapContainer = document.querySelector('div[class^="works-chapter-wr works-stack ui-wm"]');
        chapContainer.style.height = "350px";
        chapContainer.lastElementChild.style.height = "350px";
        chapContainer.lastElementChild.lastElementChild.style.height = "350px";
        chapContainer.lastElementChild.lastElementChild.lastElementChild.style.height = "350px";
        chapContainer.lastElementChild.lastElementChild.lastElementChild.lastElementChild.style.height = "350px";
        chapContainer.lastElementChild.lastElementChild.lastElementChild.firstElementChild.style.height = "350px";

        decryptedJSON.data.chapter_list.reverse();
        for (var i = 0; i < decryptedJSON.data.chapter_list.length; i++) {
            var dateElem = document.createElement('div');
            dateElem.style = "width: 100%; color: #888; font-size: 13px; display: inline-block";
            dateElem.innerText = "20" + decryptedJSON.data.chapter_list[i].update_date.replace('完结', 'END');
            var brelem = document.createElement('br');

            chapDOMElemList[i].appendChild(brelem);
            chapDOMElemList[i].appendChild(dateElem);
            chapDOMElemList[i].parentElement.style.height = "60px";
        };
        if (decryptedJSON.data.chapter_list.length > 20) {
            for (var i = decryptedJSON.data.chapter_list.length - 1; i > decryptedJSON.data.chapter_list.length - 21; i--) {
                var dateElem = document.createElement('div');
                dateElem.style = "width: 100%; color: #888; font-size: 13px; display: inline-block";
                dateElem.innerText = "20" + decryptedJSON.data.chapter_list[i].update_date.replace('完结', 'END');
                var brelem = document.createElement('br');

                chapDOMElemList[i+20].appendChild(brelem);
                chapDOMElemList[i+20].appendChild(dateElem);
                chapDOMElemList[i+20].parentElement.style.height = "60px";
            };
        };

        var searchAP = document.createElement('a');
        searchAP.className = "works-intro-view ui-btn-orange ui-radius3";
        searchAP.style = "margin-left:10px;";
        searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin:7px 0px 0px 7px;"><p style="overflow:visible;line-height:1;margin-top:8px;font-size:14px">Search on AP</p>`;
        document.querySelector('div[class^="works-intro-active"]').appendChild(searchAP);
        searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('h2[class^="works-intro-title ui-left"]').innerText), "")});

        var n = document.querySelector('div[class^="works-cover "] img').src.lastIndexOf('/');
        var coverImg = document.createElement('a');
        coverImg.className = "works-intro-view ui-btn-orange ui-radius3";
        coverImg.innerHTML = `<img src="` + document.querySelector('div[class^="works-cover "] img').src + `" style="float: left;height:30px;margin:7px 0px 0px 7px;"><p style="overflow:visible;line-height:1;margin-top:8px;font-size:14px">Open Cover Image</p>`;
        document.querySelector('div[class^="works-intro-active"]').appendChild(coverImg);
        coverImg.addEventListener("click", function() {open(document.querySelector('div[class^="works-cover "] img').src.substring(0, n) + "/0", "")});

        document.querySelector('.works-intro-opera div.ui-right').style = "top:-90px;display:block;position:relative;";
    }
});