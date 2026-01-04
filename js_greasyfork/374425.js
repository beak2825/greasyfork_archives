// ==UserScript==
// @name        PubMedy
// @version     0.5.11
// @description Direct link to sci-hub; Show Imapct Factor(IF) on PubMed, citedby counts, full-text download and one-click to create citation
// @author      xsan
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js

// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/aes.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_setClipboard
// @grant       GM.setClipboard
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @match       *
// @icon        http://www.novopro.cn/favicon.ico
// @run-at      document-end

// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/374425/PubMedy.user.js
// @updateURL https://update.greasyfork.org/scripts/374425/PubMedy.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var $ = unsafeWindow.jQuery;
    var myScriptStyle = '@charset "utf-8";.novopro-impactfactor-container{display: block;background: #f3f9d2;border: 1px solid #cae8b6;-webkit-border-radius:3px;border-radius:3px;font-size: 14px;color:#08c;height: 20px;line-height: 14px;padding: 4px 30px 2px 30px;}.novopro-impactfactor-container img{width: 14px;}.novopro-impactfactor-container a{text-decoration: none;color:#08c;}.novopro-rtn-citation{font-size: 14px;}.novopro-highlight {background: #e3e4dd !important;border: 1px solid #eee;border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px;padding: 5px !important;}.novopro-impactfactor-container dl{height: 28px;line-height: 20px;overflow: hidden;margin: 0;}.novopro-impactfactor-container dt, .novopro-impactfactor-container dd{float: left;}.novopro-impactfactor-container dt{margin-left: 20px;color: #08c;}.novopro-impactfactor-container dd{margin-left: 5px !important;margin-right: 15px !important;font-weight: 600;color: #0076aa;}.novopro-impactfactor-container dd a{text-decoration: none;}.reveal-modal-bg { position: fixed; height: 100%;width: 100%;background: #000;background: rgba(0,0,0,.5);z-index: 100;display: none;top: 0;left: 0; }.reveal-modal {visibility: hidden;top: 100px; left: 50%;margin-left: -300px;width: 520px;position: absolute;z-index: 101;padding: 30px 40px 34px;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;-moz-box-shadow: 0 0 10px rgba(0,0,0,.4);-webkit-box-shadow: 0 0 10px rgba(0,0,0,.4);-box-shadow: 0 0 10px rgba(0,0,0,.4);}.reveal-modal.small { width: 200px; margin-left: -140px;}.reveal-modal.medium { width: 400px; margin-left: -240px;}.reveal-modal.large { width: 600px; margin-left: -340px;}.reveal-modal.xlarge { width: 800px; margin-left: -440px;}.reveal-modal .close-reveal-modal {font-size: 22px;line-height: .5;position: absolute;top: 8px;right: 11px;color: #aaa;text-shadow: 0 -1px 1px rbga(0,0,0,.6);font-weight: bold;cursor: pointer;} .novopro-cds-bg4{background: #33CC66;}.novopro-cds-bg2{background: #3399CC;}.novopro-cds-bg3{background: #CC334D;}.novopro-cds-bg1{background: #eb6864;}.novopro-cds-bg5{background: #CCB333;}.novopro-cds-bg6{background: #FF4D00;}.pubmedy-alert {display: none;position: fixed;top: 35%;left: 50%;min-width: 200px;margin-left: -100px;z-index: 99999;padding: 15px;border: 1px solid transparent;border-radius: 4px;}.pubmedy-alert-success {color: #3c763d;background-color: #dff0d8;border-color: #d6e9c6;}.pubmedy-alert-info {color: #31708f;background-color: #d9edf7;border-color: #bce8f1;}.pubmedy-alert-warning {color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;}.pubmedy-alert-danger {color: #ffffff;background-color: #e91e63;border-color: #e91e63;}.pmid-sci-hub, .cited-num{cursor: pointer;}#novopro-options-tab {width: 550px;border: 1px solid #eee;border-collapse: collapse;font-size: 14px;}#novopro-options-tab td {border: 1px solid #eee;border-collapse: collapse;}#novopro-options-tab th {width: 60%;font-weight: 500;color: #666;border: 1px solid #eee;border-collapse: collapse;}#novopro-btn-box {width: 50px;height: 20px;padding: 3px;border-radius: 30px;-webkit-border-radius: 30px;-moz-border-radius: 30px;background-color: #838383;position: relative;margin: 0 auto;}#novopro-btnn {width: 20px;height: 20px;-webkit-border-radius: 30px;-moz-border-radius: 30px;border-radius: 30px;background-color: #fff;position: absolute;}#novopro-options-tab input[type="text"] {width: 200px;height: 30px;border: 1px solid #00bcd4;padding: 2px 6px;margin: 10px;}#novopro-options-tab input[type="button"] {display: inline-block;font-weight: 400;line-height: 25px;white-space: nowrap;vertical-align: middle;cursor: pointer;border: 1px solid transparent;border-radius: 4px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;-o-user-select: none;user-select: none;background-color: #008CBA;border: none;color: #FFFFFF;text-align: center;-webkit-transition-duration: 0.4s;transition-duration: 0.4s;margin: 10px 0 !important;text-decoration: none;font-size: 16px;}#novopro-options-tab .center {text-align: center;}';
    GM_addStyle(myScriptStyle);
    // $("body").hide();
    var jrnl = new Array();
    var scihub = new Array();
    var pmids = new Array();
    var url = window.location.href;
    console.log(url);
    $.fn.reveal = function (options) {

        //console.log(options);
        var defaults = {
            animation: 'fadeAndPop',
            //fade, fadeAndPop, none
            animationspeed: 300,
            //how fast animtions are
            closeonbackgroundclick: true,
            //if you click background will modal close?
            dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
        };

        //Extend dem' options
        options = $.extend({}, defaults, options);

        return this.each(function () {

            var modal = $(this),
                topMeasure = parseInt(modal.css('top')),
                topOffset = modal.height() + topMeasure,
                locked = false,
                modalBG = $('.reveal-modal-bg');

            if (modalBG.length == 0) {
                modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
            }

            //Entrance Animations
            modal.bind('reveal:open', function () {
                modalBG.unbind('click.modalEvent');
                $('.' + options.dismissmodalclass).unbind('click.modalEvent');
                if (!locked) {
                    lockModal();
                    if (options.animation == "fadeAndPop") {
                        modal.css({
                            'top': $(document).scrollTop() - topOffset,
                            'opacity': 0,
                            'visibility': 'visible'
                        });
                        modalBG.fadeIn(options.animationspeed / 2);
                        modal.delay(options.animationspeed / 2).animate({
                            "top": $(document).scrollTop() + topMeasure + 'px',
                            "opacity": 1
                        }, options.animationspeed, unlockModal());
                    }
                    if (options.animation == "fade") {
                        modal.css({
                            'opacity': 0,
                            'visibility': 'visible',
                            'top': $(document).scrollTop() + topMeasure
                        });
                        modalBG.fadeIn(options.animationspeed / 2);
                        modal.delay(options.animationspeed / 2).animate({
                            "opacity": 1
                        }, options.animationspeed, unlockModal());
                    }
                    if (options.animation == "none") {
                        modal.css({
                            'visibility': 'visible',
                            'top': $(document).scrollTop() + topMeasure
                        });
                        modalBG.css({
                            "display": "block"
                        });
                        unlockModal()
                    }
                }
                modal.unbind('reveal:open');
            });

            //Closing Animation
            modal.bind('reveal:close', function () {
                if (!locked) {
                    lockModal();
                    if (options.animation == "fadeAndPop") {
                        modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                        modal.animate({
                            "top": $(document).scrollTop() - topOffset + 'px',
                            "opacity": 0
                        }, options.animationspeed / 2, function () {
                            modal.css({
                                'top': topMeasure,
                                'opacity': 1,
                                'visibility': 'hidden'
                            });
                            unlockModal();
                        });
                    }
                    if (options.animation == "fade") {
                        modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                        modal.animate({
                            "opacity": 0
                        }, options.animationspeed, function () {
                            modal.css({
                                'opacity': 1,
                                'visibility': 'hidden',
                                'top': topMeasure
                            });
                            unlockModal();
                        });
                    }
                    if (options.animation == "none") {
                        modal.css({
                            'visibility': 'hidden',
                            'top': topMeasure
                        });
                        modalBG.css({
                            'display': 'none'
                        });
                    }
                }
                modal.unbind('reveal:close');
            });

            //Open Modal Immediately
            modal.trigger('reveal:open')

            //Close Modal Listeners
            var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
                modal.trigger('reveal:close')
            });

            if (options.closeonbackgroundclick) {
                modalBG.css({
                    "cursor": "pointer"
                })
                modalBG.bind('click.modalEvent', function () {
                    modal.trigger('reveal:close')
                });
            }
            $('body').keyup(function (e) {
                if (e.which === 27) {
                    modal.trigger('reveal:close');
                } // 27 is the keycode for the Escape key
            });

            function unlockModal() {
                locked = false;
            }

            function lockModal() {
                locked = true;
            }

        }); //each call
    } //orbit plugin call
    
})();
//

/**
 * js aes加密
 * @param  {[type]} text [文本]
 * @param  {[type]} key  [密钥]
 * @param  {[type]} iv   [密钥向量]
 * @return {[type]}      [description]
 */
function js_aesEncode(text, key, iv) {
    var key_hash = CryptoJS.MD5(key);
    var key = CryptoJS.enc.Utf8.parse(key_hash);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted;
};
/**
 * js aes解密
 * @param  {[type]} text [文本]
 * @param  {[type]} key  [密钥]
 * @param  {[type]} iv   [密钥向量]
 * @return {[type]}      [description]
 */
function js_aesDecode(text, key, iv) {
    var key_hash = CryptoJS.MD5(key);
    var key = CryptoJS.enc.Utf8.parse(key_hash);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(text, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
};
function array_keys(hash) {
    keys = [];
    for (key in hash) {
        keys.push(key);
    }
    return keys;
}

function typeofpage() {
    if ($(".rprt_all .rprt.abstract").length > 0) {
        return 'single';
    } else {
        return 'list';
    }
}
function pdata2(key, iv) {
    var post_data;
    var str;
    var pdata;
    if (typeofpage() == 'list') {
        if ($(".rprt").length > 0) {
            $(".rprt:not(.abstract)").each(function () {
                var detail = $(this).find(".details")[0];
                // var jn = $(detail).children(".jrnl").attr("title");
                var jn = $(detail).children(".jrnl").text();
                jn = jn.replace(/(^\s*)|(\s*$)/g, "");
                // console.log(jn);
                jrnl[jn] = 1;
                var title = $(this).find(".title")[0];
                var a = $(title).children("a");

                var href = $(a).attr("href");
                var mm = href.match(/\/(\d+)$/);
                var pmid = mm[1];
                pmids.push(pmid);
                var txt = $(detail).text();
                // console.log(txt);
                var m = txt.match(/\s+doi:\s+(\S*)\./);
                if (m) {
                    scihub[pmid] = m[1];
                }
                // else{
                // 	var m = href.match(/^\/(.*)$/);
                // 	scihub[pmid] = m[1];
                // }
            });
            if (Object.keys(jrnl).length > 0) {
                post_data = {'url': url, 'jns': array_keys(jrnl), 'pmids': pmids};
                str = JSON.stringify(post_data);
                pdata = js_aesEncode(str, key, iv).toString();
                return pdata;
            }
        }
    } else {
        if ($(".rprt_all").length > 0) {
            var cit = $(".rprt_all .cit a:first");
            var jn = $(cit).attr("alterm");
            if (jn.match(/[^A-Z]\.$/)) {
                jn = jn.replace(/\.$/, '');
            }
            if (jn.length > 0) {
                jrnl[jn] = 1;
            }
            var rprtid = $(".rprt_all .aux .rprtid");
            var dt = $(rprtid).children(dt);
            var pmid = 0;
            var doi = '';
            $(dt).each(function (i, e) {
                if ($(this).text() == "PMID:") {
                    pmid = $(this).next().text();
                } else if ($(this).text() == 'DOI:') {
                    doi = $(this).next().text();
                }
            });
            if (pmid > 0) {
                pmids.push(pmid);
                if (doi.length) {
                    scihub[pmid] = doi;
                }
                // else{
                // 	scihub[pmid] = 'pubmed/' + pmid;
                // }
            }
            if (Object.keys(jrnl).length > 0 && pmid.length > 0) {
                post_data = {'url': url, 'jns': array_keys(jrnl), 'pmids': pmids};
                str = JSON.stringify(post_data);
                pdata = js_aesEncode(str, key, iv).toString();
                return pdata;
            }
        }
    }
    return '';
}

function isNumber(obj) {
    return typeof obj === 'number' && !isNaN(obj)
}
function setItem(name, data) {
    chrome.runtime.sendMessage({command: 'setItem', name: name, data: data});
}

function getItem(name) {
    chrome.runtime.sendMessage({command: 'getItem', name: name}, function (response) {
        // console.log(response);
        window.localStorage[name] = response;
    });
}

function showdata(data, key, iv) {
    var rtn_data = JSON.parse(js_aesDecode(data, key, iv));
    // console.log(rtn_data);
    // console.log(localStorage)
    getItem("serverURL");
    serverURL = localStorage.serverURL;
    // serverURL = serverURL.replace(/[\\\/]+$/, '')
    // serverURL = serverURL + "/"
    if (rtn_data.IF) {
        if (typeofpage() == 'list') {
            getItem('enabled');
            getItem('threshold');
            $(".rprt:not(.abstract)").each(function () {
                var title = $(this).find(".title")[0];
                var a = $(title).children("a");
                var href = $(a).attr("href");
                var mm = href.match(/\/(\d+)$/);
                var pmid = mm[1];
                var jn = $(this).find(".details").children('.jrnl').text();
                jn = jn.replace(/(^\s*)|(\s*$)/g, "");
                var html = "<div class='novopro-impactfactor-container'><dl><dd><a title='NovoPro Bioscience, Inc.' href='https://www.novoprolabs.com' target='_blank'>NovoPro</a></dd>";
                html += "<dt>Impact Factor:</dt><dd>";
                html += rtn_data['IF'][jn];
                html += "</dd><dt>Cited:</dt><dd class='cited-num' data-pmid='" + pmid + "'>";
                html += "<img src='" + chrome.extension.getURL("images/view19.png") + "'>";
                html += "</dd>";
                if (pmid in scihub) {
                    html += "<dd><a target='_blank' href='" + serverURL + scihub[pmid] + "'>Full Text(PDF)</a></dd>";
                } else {
                    html += "<dd><span class='pmid-sci-hub' data-pmid='" + pmid + "'>Full Text(PDF)</span></dd>";
                }
                html += "<dd>";
                html += "<a class='novopro-impactfactor-citation' href='#' data-id='" + encodeURI(encodeURI(js_aesEncode(pmid, key, iv).toString())) + "'>Citation</a>";
                html += "</dd></dl></div>";
                $(this).find(".aux").append(html);
                if (localStorage.enabled > 0 && localStorage.threshold > 0 && isNumber(parseFloat(rtn_data['IF'][jn])) && parseFloat(rtn_data['IF'][jn]) >= localStorage.threshold) {
                    $(this).addClass('novopro-highlight');
                }
            });
        } else {
            // console.log(scihub);
            if (pmids.length) {
                var pmid = pmids[0];
                var doi = scihub[pmid];
                var keys = array_keys(jrnl);
                var jn = keys[0];
                var html = "<div class='novopro-impactfactor-container'><dl><dd><a title='NovoPro Bioscience, Inc.' href='https://www.novoprolabs.com' target='_blank'>NovoPro</a></dd>";
                html += "<dt>Impact Factor:</dt><dd>";
                html += rtn_data['IF'][jn];
                html += "</dd><dt>Cited:</dt><dd class='cited-num' data-pmid='" + pmid + "'>";
                html += "Click to View";
                html += "</dd><dd>";
                if (pmid in scihub) {
                    html += "<a target='_blank' href='" + rtn_data['scihub'] + scihub[pmid] + "'>Full Text(PDF)</a>";
                } else {
                    html += "<dd><span class='pmid-sci-hub' data-pmid='" + pmid + "'>Full Text(PDF)</span></dd>";
                }
                html += "</dd><dd>";
                html += "<a class='novopro-impactfactor-citation' href='#' data-id='" + encodeURI(encodeURI(js_aesEncode(pmid, key, iv).toString())) + "'>Citation</a>";
                html += "</dd></dl></div>";
                $(".rprt_all").find(".aux").append(html);
            }
        }
    }
}

function showCitation(post_url) {
    $("a.novopro-impactfactor-citation").on('click', function (event) {
        event.preventDefault();
        var revealId = "novopro-citation-show"
        $('#' + revealId).remove();
        var loading = '<div id=' + revealId + ' class="reveal-modal">' + "<p class='novopro-rtn-citation'>Loading...</p><a class='close-reveal-modal'>×</a>" + '</div>';
        $('body').append(loading);
        $('#' + revealId).reveal({animation: "fade", revealId: revealId});
        $.get(post_url + "?id=" + $(this).attr('data-id'), function (data) {
            $('.novopro-rtn-citation').html(data);
            // $('#'+revealId).reveal({animation:"fade", revealId: revealId});
        });
    });
}

function getCitationNum(pmid, ele) {
    var url = "http://www.ebi.ac.uk/europepmc/webservices/rest/MED/" + pmid + "/citations/1/1/json";
    var num = 0;
    $.ajax({
        type: 'GET',
        url: url,
        cache: false,
        success: function (resp) {
            // var arr = eval('(' + resp + ')');
            if ('hitCount' in resp) {
                num = resp['hitCount'];
                $(ele).text(num);
            }
        }
    });
}

function newForm(action, pmid) {
    var form = $('<form></form>');
    form.attr('action', action);
    form.attr('method', 'post');
    // form的target属性决定form在哪个页面提交
    // _self -> 当前页面 _blank -> 新页面
    form.attr('target', "_blank");
    var request = $('<input type="hidden" name="request" />');
    request.attr('value', pmid);
    form.append(request);
    var plugChek = $('<input type="hidden" name="sci-hub-plugin-check" />');
    plugChek.attr('value', '');
    return form;
}

function parseGBF(gbf) {

    gbf = gbf.split('\n');

    for (var origin = 0; origin < gbf.length; ++origin)
        if (gbf[origin].indexOf('ORIGIN ') === 0)
            break;

    var record = {
        /* Collapse everything after the origin (the sequence) into a single
         * string, removing line numbers and spaces.
         */
        sequence: gbf.slice(origin + 1).map(function (line) {

            return line.trim().split(' ').slice(1).join('');

        }).join('')

    };

    /* Parse everything before the ORIGIN (the annotations) with parseFlatFile
     */
    parseFlatFile(gbf.slice(0, origin)).forEach(function (field) {

        switch (field.name) {
            case 'LOCUS':

                /* LOCUS       SCU49845                5028 bp    DNA     PLN 23-MAR-2010 */
                var locus = field.value[0].match(/([A-Z\d]+) +(\d+) bp +([A-Z]+) +([A-Z]+) +(\d\d-[A-Z]{3}-\d{4})/);

                if (locus !== null) {

                    record.locusName = locus[1];
                    record.sequenceLength = locus[2];
                    record.moleculeType = locus[3];
                    record.division = locus[4];
                    record.modified = locus[5];
                }

                /* LOCUS       SCU49845                5028 bp    DNA     linear   PLN 23-MAR-2010 */
                locus = field.value[0].match(/([A-Z\d]+) +(\d+) bp +([A-Z]+) +([a-z]+) +([A-Z]+) +(\d\d-[A-Z]{3}-\d{4})/);

                if (locus !== null) {

                    record.locusName = locus[1];
                    record.sequenceLength = locus[2];
                    record.moleculeType = locus[3];
                    record.moleculeTypeDisp = locus[4];
                    record.division = locus[5];
                    record.modified = locus[6];
                }


                break;

            case 'DEFINITION':

                record.definition = field.value.join(' ');
                break;

            case 'ACCESSION':

                record.accession = field.value.join(' ');
                break;

            case 'VERSION':

                record.version = field.value.join(' ');
                break;

            case 'KEYWORDS':

                if (field.value == '.')
                    break;

                /* TODO */

                break;

            case 'SOURCE':

                record.source = {
                    name: field.value.join(' ')
                };

                field.children.forEach(function (subfield) {

                    if (subfield.name == 'ORGANISM') {

                        record.source.organism = {

                            name: subfield.value[0],

                            lineage: subfield.value.slice(1).join(' ').split('; ').map(function (s) {

                                s = s.trim();

                                return s[s.length - 1] == '.' ? s.slice(0, s.length - 1) : s;
                            })
                        };
                    }
                });

                break;

            case 'REFERENCE':

                if (record.references === undefined)
                    record.references = [];

                var bases = field.value[0].match(/^([0-9]+) +\(bases ([0-9]+) to ([0-9]+)\)$/);

                var reference = bases !== null ? {

                    number: parseInt(bases[1]),
                    start: parseInt(bases[2]),
                    end: parseInt(bases[3])

                } : {};

                field.children.forEach(function (subfield) {
                    switch (subfield.name) {
                        case 'AUTHORS':
                            reference.authors = subfield.value.join(' ');
                            break;

                        case 'TITLE':
                            reference.title = subfield.value.join(' ');
                            break;

                        case 'JOURNAL':
                            reference.journal = subfield.value.join(' ');
                            break;

                        case 'PUBMED':
                            reference.pubmed = subfield.value.join(' ');
                            break;
                    }
                    ;
                });

                record.references.push(reference);

                break;

            case 'FEATURES':

                record.features = [];

                field.children.forEach(function (feature) {

                    var location = ''

                    for (var i = 0; i < feature.value.length; ++i) {

                        if (feature.value[i][0] === '/')
                            break

                        location += feature.value[i]
                    }

                    var f = {
                        key: feature.name,
                        location: parseLocation(location)
                    };

                    var qualifier;
                    var value;
                    /* TODO look for/process specific qualifiers?
                     */
                    for (; i < feature.value.length; ++i) {

                        var qualifierLine = feature.value[i];

                        if (qualifierLine[0] === '/') {

                            qualifier = qualifierLine.split('=')[0];

                            value = qualifierLine.split('"')[1];

                            if (!f[qualifier])
                                f[qualifier] = [value]
                            else
                                f[qualifier].push(value)

                        } else {

                            value = qualifierLine.split('"')[0];

                            if (qualifier !== '/translation')
                                value = ' ' + value

                            f[qualifier][f[qualifier].length - 1] += value
                        }

                    }

                    record.features.push(f);
                });
                // console.log(record.features);
                break;
        }
        ;
    });

    if (record.references) {

        record.references = record.references.sort(function (a, b) {
            return a.number - b.number;
        });
    }

    return record;
}


function parseLocation(location) {

    var match = location.match(/([a-z]+)\((.*)\)/)

    if (match !== null) {

        var modifier = match[1]

        if (modifier === 'complement') {

            var innerLocation = parseLocation(match[2])

            innerLocation.strand = 'complementary'

            return innerLocation

        } else if (modifier === 'join') {

            return match[2].split(',').map(parseLocation)

        } else {

            throw new Error('unknown modifier: ' + modifier)

        }

    } else {

        var partial3Prime = location.indexOf('<') !== -1;
        var partial5Prime = location.indexOf('>') !== -1;

        var startEndMatch = location.replace(/[<>]/g, '').match(/^([0-9]+)\.\.([0-9]+)$/);

        if (startEndMatch == null && location.match(/^([0-9]+)$/)) {
            return {
                start: parseInt(location),
                end: parseInt(location),
                partial3Prime: partial3Prime,
                partial5Prime: partial5Prime
            }
        } else {
            return {
                start: parseInt(startEndMatch[1]),
                end: parseInt(startEndMatch[2]),
                partial3Prime: partial3Prime,
                partial5Prime: partial5Prime
            }
        }
    }
}

function parseFlatFile(lines) {

    function getIndent(line) {

        for (var indent = 0; line[indent] == ' ';)
            ++indent;

        return indent;
    }

    function readFields(indent) {

        var fields = [],
            field,
            valueColumn;

        while (lines.length > 0) {

            var line = lines[0];

            var lineIndent = getIndent(line);

            if (lineIndent < indent)
                break;

            if (lineIndent > indent) {

                if (lineIndent != valueColumn) {

                    /* children of prev field
                     */
                    field.children = readFields(lineIndent);
                    continue;
                }

                /* continuation
                 */
                field.value.push(line.slice(lineIndent));
            }

            if (lineIndent == indent) {

                /* new field
                 */
                var delim = line.indexOf(' ', lineIndent);

                valueColumn = delim + getIndent(line.slice(delim));

                field = {
                    name: line.slice(lineIndent, delim),
                    value: [line.slice(valueColumn)]
                };

                fields.push(field);
            }

            lines = lines.slice(1);
        }

        return fields;
    }

    return readFields(0);
}
function findCDS(sample) {
    var gbf = parseGBF(sample);
    var sequence = gbf.sequence;
    var features = gbf.features;
    var cds = new Array();
    if (typeof(features) != 'undefined' && features.length > 0) {
        features.forEach(function (feat) {
            if (feat.key == "CDS") {
                var product = feat['/product'][0];
                var start = feat.location.start;
                var end = feat.location.end;
                cds[start] = product;
                cds[end] = '*-*';
            }
        });
    }
    var formated = formatstr(sequence, cds);
    return formated.join("\n");
}

function formatstr(str, cds) {
    var res = new Array();
    for (var i = 0; i < str.length; i = i + 60) {
        var no = i + 1;
        no = no.toString();
        var tmp = [new Array(9 - no.length).join(" "), no, " ", add_space_to_line(str.substring(i, i + 60))];
        res.push(tmp.join(''));
    }
    var clsn = 1;
    var chars = new Array();
    for (var loc in cds) {
        var x = loc % 60 == 0 ? parseInt(loc / 60) - 1 : parseInt(loc / 60);
        var y = loc - x * 60;
        var z = y % 10 == 0 ? parseInt(y / 10) - 1 : parseInt(y / 10);
        // console.log("x:"+x+", y:"+y+",z:"+z);
        y = y - 1;
        if (typeof(chars[x]) === "undefined") {
            chars[x] = res[x].split('');
        }
        if (cds[loc] == '*-*') {
            chars[x][9 + y + z] = chars[x][9 + y + z] + "</span>";
        } else {
            chars[x][9 + y + z] = '<span class="novopro-cds-bg' + (clsn % 7 == 0 ? 1 : clsn % 7) + '" title="' + cds[loc] + '">' + chars[x][9 + y + z];
            clsn++;
        }
    }
    for (var xx in chars) {
        res[xx] = chars[xx].join("");
    }
    return res;
}
function add_space_to_line(ln) {
    var res = new Array();
    for (var i = 0; i < ln.length; i = i + 10) {
        res.push(ln.substring(i, i + 10));
    }
    // console.log(res.join(" "));
    return res.join(" ");
}
// $.fn.wait = function (func, times, interval) {
//     var _times = times || -1, //100次
//         _interval = interval || 20, //20毫秒每次
//         _self = this,
//         _selector = this.selector, //选择器
//         _iIntervalID; //定时器id
//     if (this.length) { //如果已经获取到了，就直接执行函数
//         func && func.call(this);
//     } else {
//         _iIntervalID = setInterval(function () {
//             if (!_times) { //是0就退出
//                 clearInterval(_iIntervalID);
//             }
//             _times <= 0 || _times--; //如果是正数就 --
//
//             _self = $(_selector); //再次选择
//             if (_self.length) { //判断是否取到
//                 func && func.call(_self);
//                 clearInterval(_iIntervalID);
//             }
//         }, _interval);
//     }
//     return this;
// }
function copyToClipboard(element) {
    var temp = $("<input>");
    $("body").append(temp);
    temp.val($(element).text().replace(/[0-9 ]+/mg, '')).select();
    if (document.execCommand("copy")) {
        $('<div>').appendTo('body').addClass('pubmedy-alert pubmedy-alert-success').html('The CDS has been copied to clipboard').show().delay(1500).fadeOut();
    } else {
        $('<div>').appendTo('body').addClass('pubmedy-alert pubmedy-alert-warning').html('Copy Failed!').show().delay(1500).fadeOut();
    }
    temp.remove();
}

function prompt(message, style, time) {
    style = (style === undefined) ? 'pubmedy-alert-success' : style;
    time = (time === undefined) ? 1200 : time;
    $('<div>')
        .appendTo('body')
        .addClass('pubmedy-alert ' + style)
        .html(message)
        .show()
        .delay(time)
        .fadeOut();
};

// 成功提示
function success_prompt(message, time) {
    prompt(message, 'pubmedy-alert-success', time);
};

// 失败提示
function fail_prompt(message, time) {
    prompt(message, 'pubmedy-alert-danger', time);
};

// 提醒
function warning_prompt(message, time) {
    prompt(message, 'pubmedy-alert-warning', time);
};


// 信息提示
function info_prompt(message, time) {
    prompt(message, 'pubmedy-alert-info', time);
};


