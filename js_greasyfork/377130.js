// ==UserScript==
// @name       jawz str11223344 Price Find
// @version    1.03
// @author	   jawz
// @description  Eric Chizzle
// @match      https://engine.cloudengine1.com/Hit/Price*
// @match      https://www.amazon.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/377130/jawz%20str11223344%20Price%20Find.user.js
// @updateURL https://update.greasyfork.org/scripts/377130/jawz%20str11223344%20Price%20Find.meta.js
// ==/UserScript==

var CLICKSOUND = 'https://www.freesound.org/data/previews/215/215772_4027196-lq.mp3';

if (document.URL.indexOf("engine.cloudengine1.com") >= 0) {
    GM_setValue("str11223344", true);

    var url = $('a:contains("Search on Amazon.com")').attr('href');
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    var popupX = window.open(url,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);

    var timer = setInterval(function(){ listenFor(); }, 250);
    window.onbeforeunload = function (e) {
        popupX.close();
        GM_deleteValue("str11223344");
    }

    function listenFor() {
        if (GM_getValue("Msg")) {
            var data = GM_getValue("Msg");
            $( "input[name='price']" ).val(data[0]);
            document.getElementById('pricehelper').textContent = data[0];
            $( "input[name='link']" ).val(data[1]);
            GM_deleteValue("Msg");
            $( "input[name='price']" ).click();
        }
    }

    var original, mathType, result;
    $( "input[name='price']" ).keydown(function(e) {
        if (e.keyCode == 111) {
            original = $( "input[name='price']" ).val();
            $( "input[name='price']" ).val("");
            mathType = "divide";
        }
        if (e.keyCode == 106) {
            original = $( "input[name='price']" ).val();
            $( "input[name='price']" ).val("");
            mathType = "multiply";
        }
        if (e.keyCode == 107) {
            var divideBy = $( "input[name='price']" ).val();
            if (mathType === "divide")
                result = original / divideBy;
            if (mathType === "multiply")
                result = original * divideBy;
            $( "input[name='price']" ).val(result.toFixed(2));
        }
    });
}

if (document.URL.indexOf("www.amazon") >= 0) {
    if (GM_getValue("str11223344")) {

            document.body.style.backgroundColor = "#E4E4E4";
            var mDingSound = new Audio(CLICKSOUND);
        	mDingSound.play();

            var price, price1, price2, price3, price4;
            $('body').on('click', 'a', function(e) {
                e.preventDefault();
                if (this.textContent.indexOf('$') >= 0) {
                    price1 = this.textContent.split('   ')[0];

                    if (price1.indexOf('-') >= 0)
                        price1 = price1.split('+')[0].split('-')[1];
                        price2 = price1.split('(')[0];
                        price3 = price2.replace("CDN", "").replace("$", "").trim();

                    if (this.nextSibling) {
                        if (this.nextSibling.nextSibling.textContent.indexOf('$') >= 0 && this.nextSibling.nextSibling.textContent.indexOf('+') < 0) {
                            price1 = this.nextSibling.nextSibling.textContent.split('   ')[0];
                            price2 = price1.split('-')[0].split('(')[0];
                            price3 = price2.replace("CDN", "").replace("$", "").trim();
                        }
                    }
                    GM_setValue("Msg", [price3, this.href]);
                    setTimeout(function(){ GM_deleteValue("Msg"); }, 1000);
                }
            });
        }
}