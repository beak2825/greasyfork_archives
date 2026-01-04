// ==UserScript==
// @name         serial evaluator
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @license MIT
// @match     https://missav.com/*
// @match     https://njav.tv/*
// @match     https://gist.github.com/*
// @match     http://www.jav777.cc/*
// @match     https://madou.club/*
// @match     http*://avmoo.click/*
// @match     http*://avsox.click/*
// @match     https://*.sehuatang.net/*
// @match     https://sehuatang.net/*
// @match     https://madouqu.com*
// @match     https://javdb.com/*
// @match     https://javdb*.com/*
// @match     https://btsow.click/*
// @match     https://a4.com*
// @match     https://www.javbus.in/*
// @match     http*://www.141jav.com*
// @match     *btgongchang.info*
// @match     https://erovi.jp*
// @match     http://go2av.com*
// @match     http*://*.javlibrary.com/*

// @match     http://*.playno1.com*
// @match     https://www.javhoo.com*
// @match     http://ccba.me/*
// @match     http://www.sis001.com/*
// @match     http://www.at-mania.com/*
// @match     http://www.xvideos.com/*
// @match     https://www.jkforum.net/thread*
// @match     https://hpjav.com/*
// @match     https://hpjav.tv/*
// @match     http://www.eyny.com/thread*
// @match     http://lust18.cc/web/mvpage.php?spcode=*
// @match     http://www.eyny.com/*
// @match     http://www.dmm.co.jp/*/detail/*
// @match     http://www.gifjia.com/*
// @match     http://av9.bonbonme.com*
// @match     http://23aee.com*
// @match     http://www.72upp.com*
// @match     http://x5rh.com*
// @match     https://filesdownloader.com*
// @match     http://avgirlblog.me*
// @match     http://141hongkong.com/thread*
// @require     http://libs.baidu.com/jquery/1.9.0/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.2.0/js/iziToast.min.js
// @resource iziToast https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.2.0/css/iziToast.min.css
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/451183/serial%20evaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/451183/serial%20evaluator.meta.js
// ==/UserScript==


var search_apis = { censor: "https://avmoo.click/cn/search/", uncensor: "https://avsox.click/cn/search/" };
var bt_api = { btso: "https://btsow.click/search/" };
var kitty_api = { kitty: "http://btdig.com/search?q="};
var javlib_api = { url: "http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=" };
var javdb_api = { url: "https://javdb.com/search?q=" };

var selectorConfig = {
    'javkey': 'body > div.container > h3',
    'javmoo': 'body > div.container > h3',
    '141jav': 'body > div.wrapper > div.content-container > h3'
};
// auto copy
var highlights = ["<span style='background:rgb(39,79,120)' >{0}</span>", "{0}", ];
var changed = false;
var it = cycle(highlights);

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

function get(selector) {
    return document.querySelectorAll(selector);
}

function cycle(array) {
    var nextIndex = 0;

    return {
        next: function() {
            var index = nextIndex % array.length;
            nextIndex++;
            return array[index];
        }
    };
}

function getSiteKey() {
    var hostname = location.hostname;
    var sp = hostname.split('.');
    return sp[sp.length - 2];
}

function extractSerial(fname) {
    function clean(str) {

        str = str.replace(/im\-520@/gi, ' ');
        str = str.replace(/zhangr\-525|kitee\-88/gi, ' ');
        str = str.replace(/sis001|ses-23|sexinsex|\.net|\.com|\.cc|sex8\.cc|hv-520\.com|sav-88\.com/gi, ' ');
        str = str.replace(/[^\s\)\]】\d]*@/gi, ' '); // remove .*@
        str = str.replace(/[\[\]\(\)【】]/gi, ' ');
        str = str.replace(/tokyo|hot/gi, ' ');
        str = str.replace(/1pondo/gi, ' ');
        str = str.replace(/carib|Caribbean|boy999\.co|\.com|www\./gi, ' ');
        str = str.replace(/mp4|mkv|avi/i, ' ');
        str = str.replace(/\s{2,}/g, ' ');
        return str;
    }

    function trimLeft(str) {
        var i = 0;
        while (str[i] == '0') {
            i += 1;
        }
        return str.substring(i);
    }

    var cleaned = clean(fname); // 先去掉无关字符

    var predefined = [/([^\da-zA-Z]+|^)(stars|dvdms|cmv|sdms|dvdps|iesp|vikg|bbi|bnsps|iptd|nhdta|dandy|svdvd|nhdtb|dvdes|shkd|rbd|adn|jufd|bagbd|mxsps|gshrb|hunta|vandr|vspds|t28|pgd)[\s|\-|_]*(\d{3})/i]; // 有码优先规则 xxx-ddd
    predefined.push(/([^\da-zA-Z]+|^)(AOZ)[\s|\-|_]*(\d{3}z)/i); // aoz-dddz
    predefined.push(/([^\da-zA-Z]+|^)(VNDS)[\s|\-|_]*(\d{4})/i); // xxx-dddd
    predefined.push(/([^\da-zA-Z]+|^)(parathd)[\s|\-|_]*(\d{3,5})/i); // xxx-dddd
    predefined.push(/([^\da-zA-Z]+|^)(luxu|259luxu|gana)[\s|\-|_]*(\d{3,})/i); // luxu-ddd, gana-ddd
    //predefined.push(/([^\da-zA-Z]+|^)(\d{3,})[\s|\-|_]*(\d{3,4})/i); // ***


    var general = [/([^\da-zA-Z]+|^)([a-zA-Z]{2,4})[\s|\-|_]*(\d{2,5})/i]; // 有码通用规则

    var predefined_uncensor = [/([^\da-zA-Z]+|^)(skyhd)[\s|\-|_]*(\d{3})/i]; // 无码优先规则
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(FC2PPV)\-(\d{7})/i); // mkd|mkbd-sddd
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(mkd|mkbd)[\s|\-|_]*(s\d{2,3})/i); // mkd|mkbd-sddd
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(smd|smbd|cwp|cwpbd|laf|lafbd)[\s|\-|_]*([1-9]\d{1,2})/i); // smd|smbd|cwp|cwpbd|laf|lafbd-ddd
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(mcdv|SM3D2DBD|drg|drgbd)[\s|\-|_]*([1-9]\d{1,2})/i); // mcdv|SM3D2DBD|DRG|DRGBD
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(bt|pt)[\s|\-|_]*([1-9]\d{1,2})/i); // pt-dd|ddd
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(n|k|Roselip|heyzo)[\s|\-|_]*(\d{4})/i); // xxx-dddd
    predefined_uncensor.push(/([^\da-zA-Z]+|^)(\d{6}|dsam)[\-|_](\d{2,3})/i); // dddddd-dd

    var general_uncensor = [/([^\da-zA-Z]+|^)([a-zA-Z]{2,5})[\s|\-|_]*(\d{2,5})/i]; // 无码通用规则

    var censor = { 'predefined': predefined, 'general': general };

    var uncensor = { 'predefined': predefined_uncensor, 'general': general_uncensor };

    var rules = { 'censor': censor, 'uncensor': uncensor };

    var preserial = ''; // abp
    var postserial = ''; // 133
    var type = '';
    var keys = ['predefined', 'general'];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var matches = null;
        var types = Object.keys(rules);
        var found = false;
        for (var n = 0; n < types.length; n++) {
            type = types[n];
            var regexs = rules[type][key];
            for (var j = 0; j < regexs.length; j++) {

                matches = cleaned.match(regexs[j]);
                if (matches && matches.length >= 4) {
                    break;
                }
            }
            if (matches && matches.length >= 4) {
                preserial = matches[2];
                // postserial = trimLeft(matches[2]);
                postserial = matches[3];
                found = true;
                break;
            }
        }
        if (found) {
            break;
        }
    }
    var serial = '';
    if (preserial == 'k' || preserial == 'n') {
        serial = preserial + postserial;
    } else {
        if (postserial.length == 5) {
            postserial = trimLeft(postserial);
        }
        if (preserial.toLowerCase() == 'sero' && postserial.length == 4) {
            postserial = postserial.substring(1);
        }
        serial = preserial.toLocaleLowerCase() + ' ' + postserial.toLocaleLowerCase();
    }
    var rv = "";
    if (found) {
        var descmap = { 'censor': 'censor', 'uncensor': 'uncensor' };
        var msg = "番号：{0}, 类型：{1}".format(serial, descmap[type]);
        console.log(serial)
        if (serial.toLowerCase().startsWith('fc2ppv ')) {
            serial=serial.slice(7);
        }
        var rv = { 'type': descmap[type], 'serial': serial };
    }
    return rv;
}


var tooltipTemplate = `
    <div class="gm-se-tooltiptext">
        <ul>
            <li><a href="{1}" target="_blank">
            {0}
            </a></li>
            <li><a href="{5}" target="_blank">
            {4}
            </a></li>
            <li><a href="{9}" target="_blank">
            {8}
            </a></li>
            <li><a href="{3}" target="_blank">
            {2}
            </a></li>
            <li><a href="{7}" target="_blank">
            {6}
            </a></li>
            <li><a href="{11}" target="_blank">
            {10}
            </a></li>
            <li><a href="{13}" target="_blank">
            {12}
            </a></li>
        </ul>
    </div>
`;

function attachLink(text, serial, type) {
    var node = window.getSelection().anchorNode.parentNode;
    var uid = getDomPath(node).join('_').replace(':','_').replace('(','-').replace(')','-');
    if ($(".{0}".format(uid)).length) {
        return;
    }
    var api = search_apis[type];
    var link = api + serial;
    var btLink = bt_api.btso + serial;
    var kittyLink = kitty_api.kitty + serial;
    var liblink=javlib_api.url + serial;
    var javdblink=javdb_api.url+serial.replace(' ','-');
    console.log(search_apis);
    console.log(type);

    var missavLink = 'https://missav.com/search/' + serial.replace(' ', '-');
    var njavLink = 'https://njav.tv/zh/search?keyword=' + serial.replace(' ', '-');
    var tooltip = tooltipTemplate.format(serial, link, "bt1", btLink, "javlib", liblink, "bt2", kittyLink,'javdb', javdblink, "missav", missavLink, 'njav', njavLink);
    $(node).addClass("gm-se-tooltip");
    $(node).addClass(uid);
    $(node).append(tooltip);
}

function getDomPath(el) {
  var stack = [];
  while ( el.parentNode != null ) {
    console.log(el.nodeName);
    var sibCount = 0;
    var sibIndex = 0;
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1 ) {
      stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }

  return stack.slice(1); // removes the html element
}

function changeHighlight(text, node, left, right) {
    if (typeof node == 'undefined') {
        node = window.getSelection().anchorNode.parentNode;
    }
    var style = it.next();
    var raw = node.innerHTML;
    if (typeof left == 'undefined') {
        left = raw.indexOf(text);
        right = raw.indexOf(text) + text.length;
        left = raw.slice(0, left);
        right = raw.slice(right);
    }
    node.innerHTML = '{0}{1}{2}'.format(left, style.format(text), right);
    changed = true;
    return function() {
        changeHighlight(text, node, left, right);
        changed = false;
    };
};

function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

function evalSerial() {
    if (changed) {
        return;
    }
    var selection = getSelectionText().trim();
    if (selection == "" || selection.indexOf("magnet") > -1 || selection.indexOf("115://") > -1 ) {
        return;
    }
    var rv = extractSerial(selection);
    if (rv != "") {
        GM_setClipboard(rv.serial);
        attachLink(selection, rv.serial, rv.type);
        iziToast.success({
            title: 'OK',
            message: "{0}, {1}".format(rv.serial, rv.type),
        });
        // restore = changeHighlight(selection);
        // setTimeout(function() {
        //     restore();
        // }, 2000);
    } else {
        iziToast.warning({
            title: 'Error',
            message: "nothing matched",
        });
    }
}

function setupManualCopy() {
    var key = getSiteKey();
    if (key in selectorConfig) {
        var selector = selectorConfig[key];
        var elems = get(selector);
        if (elems.length > 0) {
            var text = elems[0].textContent;
            var rv = extractSerial(text);
            var btnHtml = `
                <div id="se-menu" style="position:fixed; top: 200px; right: 10px;">
                    <div id="ddd-menu" class="fixed-action-btn horizontal">
                        <a class="btn-floating btn-large red">
                            <i class="material-icons">menu</i>
                        </a>
                        <ul id="ddd-items">
                            <li><a id="se-mode" class="btn-floating bleu"><i class="material-icons">M</i></a></li>
                            <li><a id="se-copy" class="btn-floating green"><i class="material-icons">C</i></a></li>
                        </ul>
                    </div>
                </div>
            `;

            $("body").append(btnHtml);
            var copyCallback = function() {
                iziToast.success({
                    title: 'OK',
                    message: "{0}, {1}".format(rv.serial, rv.type),
                });
            };

            $("#se-copy").on("click", function() {
                GM_setClipboard(rv.serial);
                copyCallback();
            });
            $('#se-mode').on('click', function() {
                localStorage._appendCopy = !(localStorage._appendCopy === 'true');
            });

            setupShortcut(rv.serial, copyCallback);
        }
    }
}

function setupShortcut(serial, callback) {
    document.body.addEventListener("keydown", function(e) {
        e = e || window.event;
        var key = e.which || e.keyCode; // keyCode detection
        var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false); // ctrl detection

        if (getSelectionText().trim() == "" && key == 67 && ctrl) {
            GM_setClipboard(serial);
            callback();
        }

    }, false);
}

function main() {
    document.onmouseup = function() {
        evalSerial();
    };
    // manually copy
    setupManualCopy();
}

var tooltipCss = `
    .gm-se-tooltip {
        position: relative;
        display: inline-block;

    }

    .gm-se-tooltip .gm-se-tooltiptext {
        visibility: hidden;

        background-color: black;
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 5px 0;
        /* Position the tooltip */
        position: absolute;
        z-index: 99999999;

    }

    .gm-se-tooltiptext > ul {
        list-style-type: none !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background-color: #333333 !important;
    }


    .gm-se-tooltiptext li {
        float: left !important;
        list-style-type: none !important;
        margin: 0;
    }

    .gm-se-tooltiptext li a {
        display: block !important;
        color: white !important;
        text-align: center !important;
        padding: 16px !important;
        text-decoration: none !important;
    }

    .gm-se-tooltiptext li a:hover {
        background-color: #111111 !important;
    }

    .gm-se-tooltip:hover .gm-se-tooltiptext {
        visibility: visible;
    }
`;
var jgrwolCustomCss = `
    .j-warn {
        background-color: #6d050c !important;
    }

    .j-info {
        background-color: #116b02 !important;
    }
`;

GM_addStyle(tooltipCss);

function setupToast() {
    $('body').prepend('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.2.0/css/iziToast.min.css">')
    iziToast.settings({
        position: 'bottomRight',
        layout: 2,
        // buttons: [
        //     ['<button>Ok</button>', function (instance, toast) {
        //         alert("Hello world!");
        //     }, true],
        //     ['<a href="www.baidu.com">baidu</a>', function (instance, toast) {
        //         $(this).unbind('click').click()
        //     }],
        // ]
    });
}

setupToast();
main();