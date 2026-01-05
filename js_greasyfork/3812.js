// ==UserScript==
// @namespace   com.whoopsworkshop.hkgsherlock.userjs.pixiv_illust_full
// @id          com.whoopsworkshop.hkgsherlock.userjs.pixiv_illust_full
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAAA3NCSVQICAjb4U/gAAAAYnpUWHRSYXcgcHJvZmlsZSB0eXBlIEFQUDEAAHicVcixDYAwDADB3lN4hHccHDIOQgFFQoCyf0EBDVee7O1so696j2vrRxNVVVXPkmuuaQFmXgZuGAkoXy38TEQNDyseBiAPSLYUyXpQ8HMAAAUhSURBVFiF7ZltbBRFHMafmd29Xq9vh32lFNsCpYS38CZqFYtBG1FD0Eg0qBGNQQJBEZSgX/xmbUJCCKJGQxASEzQBCyRFECKQkFSFtOUKpWdbELgXoC29tne9u92d8cOVsne97W4LS/zAk/tyz8zO/G7mPzP/nSP46iiSSQSKbQJLWnZvUjiuyapeqaj7GNAe1X3MOtEH3+XIeghkpIdARtJdZcnFAcbBOHjsoykiBBSgBJSCWA3EOFQGhUEU3i4dN2981uTstNwMe6ZdEgXKOQ9GlM7+yJXu4Flvzw9tXZBVSAKEsZARvY1xUApDRFlUmLl6blFlWf7ER9LMNNp+s7f2vOeT+n/BOSRhVFg6QByQVTBeU1HyzuOl+ZmpCeVd/WFfYKA7FGWMO2xCXkZqSU768GZ+Pnvljd9aQAhEs8GaDEhWwbFrSdl7FVO0dlhWjzR7Drb497R1QuWg5O5PZxyMvzY5e9W8iS/NKor7aRwf7j/3tcsPhzR6IMYRkqsXlW5+fjoldwfaHxj48njLjibvYGQIOnPAOGQVIq1bNmvpzAnakoONV5cfOI8022iAIspj2Y7aNxcWOh3aGtv/uLThxD9wSBDMDTsHBuRV5bm7Vy7U2vUdt57c/SfSDZjoYBP90Z2VU/5atziBBsCOJi/SbWZpABDAIf3Y0bX4u9Na+4lJuYdXzEFINgJiHLLqWvPU2sqpMYvzuBpp5lG0koRTncH39/2t9V6eXbRpTiGUkZIaOjFF7Pv0uZkTxsW+1xy70Oy5PRaCZEy7Wm7+ftGr9ba+Mhcc4HrPgLrXL063D8b/lkNNW0602SXh/gABSJWqal0J3k9V5dBP0OhQ99VHL9Q0eEwuTrMigKIeafZovZULS6HqztpgfJxs9X9+5jLsozzazEgSdp29muBtmD1ej4kCUBl/9pcGOIw3ibGIkv2XuxO8F8rzoSSPI3o7FBUogcrv5Yg2ECFtN3u1xoxCJ5jOCG062AjAQhoAFJ6ekNYodDr0Fhrd3dEt1hxDigXRMyRC+sJx+yElBDT5GFCIVOUWj9BoRAHraTjPSh22YphOUFvMMtj3o/GZnbcnpDcKDwSIkuLsuPTN5bkNmrxr64EUtnHW+ATv8EU/RL2gtloR5YOKSVpDVtnOZr9ePmMxkMLeKs+dmp+l9b497Yak26+VQBxg/PsVC7ReTyj60cl26CcUlgFxIBRtXV2Raovre/ne+pGPcGMghetnU3pSGaLKpbWLEiZr44GGU7eCenu0WaCyjBSEZCgsMbfVQwlGXy9yBrdUlRfE0WyubdzW7IPNIPszPsJq361w3wj82nR9u8vnC4QhUFACQkDubPEc4ByMQ2GrpuVtqiwbSohjiijqq3vq67y9Zk7MYS+KYcW95umy/MyktfvCstsfuNId9AQGOkPRUFRlnKeniMVOx4yCrAWlOeKw6TjcdG3ZoWYIxOR7izHyN6fdVdMKpuRlAsiwS/NLcuaX5Jhpus51ff3x1o7eCFJE88elMdDWc9fXHXfDYftsRv4zpTkzC51F+lcOXf3hhqvdda03trl8AGATRpsWG9fOEGks868+76tu9EJl4JjstM8Z58hLk9JEIcp4IKK0BcJnbgWhMggUIhlzgmX6MYI7NxgCgPaI0u7r1aw7AgKkCLHSe9FYE8XYKrMgk/rf3TE+BDKSMRAf4WbAAsUDMY4BmcRHap/C8AD/hdEAMb68IKPni6WxTXlIlz9esu/F6SPcV9xf/QdhL+PXM2v0PQAAAABJRU5ErkJggg==
// @name        Pixiv illustration full size link converter
// @description Displaying and linking to the original picture on the thumbnail container, instead of a container layout. Especially a goodie for people who were benefitted with similar function provided by Pixiv++ (and maybe now, but if they want to use this as lightweight on another place).
// @author      hkgsherlock
// @version     201502100051+8
// @include		/^https?:\/\/www\.pixiv\.net\/member_illust\.php?.*mode=(medium|manga).*$/
// @grant       none
// @license     Public Domain for source code only.
// @downloadURL https://update.greasyfork.org/scripts/3812/Pixiv%20illustration%20full%20size%20link%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/3812/Pixiv%20illustration%20full%20size%20link%20converter.meta.js
// ==/UserScript==
//
// they changed the layout again lag, fack u
// YOU SEE ME TROLLIN', THEY HATIN'
//
// Well, just let users choose what they want. They're still your users even you're not creating a dynasty which controls how they behave. 
// And you're not even the Facebook.
//
function pixiv_illust_full() {};

pixiv_illust_full.prototype.addFullSizePageCSS = function() {
    var str = "";
    str += "img.fullsize.limit600 { max-width: 600px; max-height: 600px; } \r\n";
    str += "img.fullsize.limit1200 { max-width: 1200px; max-height: 1200px; } \r\n";
    var addStyle = document.createElement("style");
    addStyle.setAttribute('type', 'text/css');
    addStyle.innerHTML = str;
    document.head.appendChild(addStyle);
}

pixiv_illust_full.prototype.pageGrabDOM = function(url, uniqueSel, callback) {
    /*
	GM_xmlhttpRequest({
	  method: "GET",
	  url: url,
	  onload: function(response) {
	    var content = new DOMParser().parseFromString(response.responseText, "text/html");
	    callback(content.querySelector(uniqueSel));
	  }
	});
	*/
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var content = new DOMParser().parseFromString(xhr.responseText, "text/html");
            callback(content.querySelector(uniqueSel));
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
};

pixiv_illust_full.prototype.dropThumbPutFull = function(worksDisplay, src_full) {
    var thumb = worksDisplay.querySelector('._layout-thumbnail');
    var medium = thumb.querySelector('img');

    // creating new img for us
    var full = medium.cloneNode();
    full.classList.remove('medium');
    full.src = src_full;
    full.classList.add('fullsize');
    full.classList.add('limit600');
    //   full.style.maxWidth = '600px';
    //   full.style.maxHeight = '600px';

    // creating back the link
    var link = document.createElement('a');
    link.href = src_full;
    link.target = '_blank'
    link.appendChild(full);
    link.classList.add('_layout-thumbnail');

    // replace
    thumb.remove();
    worksDisplay.appendChild(link);
};

pixiv_illust_full.prototype.do = function() {
    // getting params as assoc arr for detecting mode
    var params = {};
    document.location.search.substr(1).split('&').forEach(function(x) {
        var arr = x.split('=');
        arr[1] && (params[arr[0]] = arr[1]);
    });

    if (params.mode === undefined) return;

    this.addFullSizePageCSS();

    if (params.mode === "medium") {
        // store references using
        var wksDisp = document.querySelector('div.works_display');
        if (wksDisp === null) return; // this script loads on iframe pages too! they don't have that DOM, don't waste time



        // if manga then is null
        var big = document.querySelector('.original-image');
        if (big !== null) { // submitted as a illustration
            // get the src(href) of the big (~full)
            var fSrc = big.src || big.attributes['data-src'].value;

            this.dropThumbPutFull(wksDisp, fSrc);
        } else { // submitted as manga
            var aManga = wksDisp.querySelector('a.manga:not(.multiple)');
            if (aManga === null) return; // if multi-page then quit
            var that = this; // trick
            this.pageGrabDOM(aManga.href, 'img:not(.user-icon)', function(ee) {
            	var imgUrl = /* aManga.classList.contains('manga') ? ee.attributes['data-src'].value : */ ee.src;
                that.dropThumbPutFull(wksDisp, imgUrl);
            });
        }
    } else if (params.mode === "manga") {
        var imgs = document.querySelectorAll('div.item-container');
        // if can't select then result.length == 0 --> not loop
        var that = this; // trick
        Array.forEach(imgs, function(e, i) {
            var apply = e.querySelector('img.image');
            var leftLargeLink = e.querySelector('a.full-size-container');
            if (apply === null) return;
            apply.attributes.removeNamedItem('data-src'); // remove first, prevent them from adding thumb back
            that.pageGrabDOM(e.querySelector('a.full-size-container').href, 'img', function(ee) {
                leftLargeLink.href = apply.src = ee.src;
                apply.classList.add('fullsize');
                apply.classList.add('limit1200');
            });
        });
    }
};

var pif = pif || new pixiv_illust_full();
pif.do();