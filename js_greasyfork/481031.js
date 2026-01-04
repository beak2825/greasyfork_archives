// ==UserScript==
// @name         無限動漫一頁式閱讀腳本 8Comic read on 1 screen
// @version      1.0
// @description  可在無限動漫的漫畫頁面中，一個頁面閱讀一整集漫畫
// @author       NanHH
// @include      /^http[s]?\:\/\/.*\/ReadComic\/\d+\/\d+\/.*\.html(\?p=\d+.*)?$/
// @grant        none
// @namespace 8Comic-read-on-1-screen
// @downloadURL https://update.greasyfork.org/scripts/481031/%E7%84%A1%E9%99%90%E5%8B%95%E6%BC%AB%E4%B8%80%E9%A0%81%E5%BC%8F%E9%96%B1%E8%AE%80%E8%85%B3%E6%9C%AC%208Comic%20read%20on%201%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/481031/%E7%84%A1%E9%99%90%E5%8B%95%E6%BC%AB%E4%B8%80%E9%A0%81%E5%BC%8F%E9%96%B1%E8%AE%80%E8%85%B3%E6%9C%AC%208Comic%20read%20on%201%20screen.meta.js
// ==/UserScript==

(function () {
    var getPage = function ($Page, $Chapter, $comicID) {
        var p = $Page
        var ch = $Chapter;
        var ti = $comicID;

        var imgUrl;
        for (var i = 0; i < 697; i++) {
            var re4ypfkw = lc(emvy7j1_(o6vfk4_, i * (i60bdax70 + 1) + 2, 2));
            var w3s6d056s_ = lc(emvy7j1_(o6vfk4_, i * (i60bdax70 + 1) + 4));
            var gkwo86j_1 = lc(emvy7j1_(o6vfk4_, i * (hx70kv5_0 - 2) + 44, 2));

            if (re4ypfkw == ch) {
                imgUrl = unescape(l0e8c0a_d3 + l0e8c0a_d3 + j86o0a501q(4) + emvy7j1_(gkwo86j_1, 0, 1) + e8r_ir0e + la_d3_ + j86o0a501q(3) + j86o0a501q(2) + j86o0a501q(3) + l0e8c0a_d3 + emvy7j1_(gkwo86j_1, 1, 1) + l0e8c0a_d3 + ti + l0e8c0a_d3 + re4ypfkw + l0e8c0a_d3 + nn(p) + l501qo + emvy7j1_(w3s6d056s_, mm(p), 3) + e8r_ir0e + j86o0a501q(1))
                break;
            }
        }

        return imgUrl;
    }

    // set image width 100% when click
    window['getFullSizeImg'] = function (e) {
        if (e.style['width'] == '') {
            e.style['width'] = '100%';
        } else {
            e.style['width'] = '';
        }
    }

    // reset Image for 100% and center
    var theTable = document.getElementById("TheTable");
    theTable.style['margin'] = '';
    theTable.style['width'] = '100%';
    theTable.style['textAlign'] = 'center';

    // get all images
    var regex = /^http[s]?\:\/\/.*\/ReadComic\/(\d+)\/(\d+)\/.*\.html(\?p=\d+.*)?$/;
    var comicInfo = location.href.match(regex);

    for (let page = 1; page <= ps; page++) {
        var row = theTable.insertRow(-1);
        row.insertCell(0);
        row.insertCell(1);
        row.insertCell(2);
        row.cells[1].innerHTML = "<img name='TheImg' class='controlimg' style='border: solid;max-width: 100%;' src='" + getPage(page, comicInfo[2], comicInfo[1]) + "' onClick=getFullSizeImg(this) alt='第" + page + "頁'><br /><label>第" + page + "頁</label>";
    }

    theTable.deleteRow(0);  // delete origin image

    document.getElementById('prev').outerHTML = document.getElementById('prev2').outerHTML = document.getElementById('prevvol').outerHTML;
    document.getElementById('next').outerHTML = document.getElementById('next2').outerHTML = document.getElementById('nextvol').outerHTML;
    document.getElementById('nav').style['display'] = document.getElementById('pagenum').style['display'] = 'none';

})();