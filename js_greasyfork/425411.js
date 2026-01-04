// ==UserScript==
// @name         Kuaikan Manhua AP Features
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.0.1
// @description  Gets full size vertical image for Kuaikan Manhua
// @author       Quin15
// @match        https://www.kuaikanmanhua.com/web/topic/*
// @icon         https://www.google.com/s2/favicons?domain=kuaikanmanhua.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425411/Kuaikan%20Manhua%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/425411/Kuaikan%20Manhua%20AP%20Features.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'GET',
    url:        'https://api.kkmh.com/v2/comic/detail/get?topic_id=' + location.pathname.replace(/\/$/, '').split('/').reverse()[0] + '&successive=1&converter=false&gender=0',
    onload:     function (responseDetails) {
        var responseText = responseDetails.responseText;
        var imgURL = JSON.parse(responseText).data.topic.vertical_image_url.replace(/webp.*/, 'webp') ;
        console.log(imgURL)
        addButtons(imgURL);
    }
});

var addButtons = function(imgURL) {
    var searchAP = document.createElement('div');
    searchAP.className = "follow btns fl";
    searchAP.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;line-height: inherit;cursor: pointer;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin:9px 0px 0px 7px;"><p style="overflow:visible;line-height:1;margin-top:10px;font-size:14px">Search on AP</p>`;
    document.querySelector('.btnListLeft.fl.cls').appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('.right.fl .title').innerText), "")});

    var coverImg = document.createElement('div');
    coverImg.className = "follow btns fl";
    coverImg.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;line-height: inherit;cursor: pointer;";
    coverImg.innerHTML = `<img src="` + imgURL + `-w320" style="float:left;height:30px;margin:9px 0px 0px 7px;"><p style="overflow:visible;line-height:1;margin-top:3px;font-size:14px">Open Cover Image</p>`;
    document.querySelector('.btnListLeft.fl.cls').appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(imgURL, "")});
};