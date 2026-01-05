// ==UserScript==
// @name         Youdao Dictionary Enhancer
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/creamidea/YoudaoDictionaryEnhancer
// @version      1.2.3
// @description  Search words in Celerity
// @author       creamidea
// @match        http://*.youdao.com/*
// @require      http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require      http://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js
// @resource     nprogress_css http://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css
// @resource     etymoline_css http://www.etymonline.com/style.css
// @resource     etymoline_font http://fonts.googleapis.com/css?family=Slabo+27px:400&lang=en
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @connect      www.etymonline.com
// @connect      www.google.com
// @downloadURL https://update.greasyfork.org/scripts/23200/Youdao%20Dictionary%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/23200/Youdao%20Dictionary%20Enhancer.meta.js
// ==/UserScript==

// changelog:
// version 1.2 add record of google define
// version 1.1 add translation function in etymoline area
// version 1.0 initial release

GM_addStyle(GM_getResourceText("nprogress_css"));
GM_addStyle('body{font-famile:"Hiragino Sans GB",STHeiti,"Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Micro Hei Mono","WenQuanYi Zen Hei","WenQuanYi Zen Hei Mono",LiGothicMed}');
GM_addStyle('.youdao-trans-icon {position: absolute;border-radius: 5px;padding: 3px; background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;height: 18px;width: 18px;z-index: 2147483647;border: 1px solid rgb(220, 220, 220);color: rgb(51, 51, 51);}');
GM_addStyle('.etymoline .hint {text-align: center;font-size: 24px;margin: 24px 0;color: rebeccapurple;}');
GM_addStyle('#container{background: #f6f4ec;border-radius: 6px;box-shadow: 2px 2px 9px 1px gray;padding-left: 16px;padding-right: 16px;padding-bottom: 26px;margin-top: 16px;}');
GM_addStyle('.c-topbar-wrapper.setTop{top:0 !important;box-shadow: 2px 2px 4px #e5e5e5;}');
GM_addStyle('#phrsListTab h2.wordbook-js{overflow: visible;}');
GM_addStyle('.keyword{font-family: Georgia,"Lucida Grande","Lucida Sans Unicode","Lucida Sans",Geneva,Arial,sans-serif; font-size: 39px;border-bottom: 2px gray dotted; line-height: 1;}');
GM_addStyle('#phrsListTab .trans-container>ul{font-size: 16px;} #phrsListTab .trans-container>ul>li{margin: 4px auto;}');
GM_addStyle('li .collinsMajorTrans{background: gainsboro !important;}');
GM_addStyle('.c-topbar-wrapper{box-shadow: 0 0 0 #fcfcfe;}');

(function () {
    'use strict';
    if (NProgress === undefined)
        NProgress = {
            set: function () { },
            start: function () { },
            inc: function () { },
            done: function () { },
            configure: function () { },
        };
    var ETYMONLINEHTTP = 'http://www.etymonline.com';
    var GOOGLEHTTP = 'https://www.google.com';
    var YOUDAOHTTP = $(location).attr('protocol') + '//' + $(location).attr('hostname');
    var $scontainer = $('#scontainer');
    var $query = $('#query');
    var $topImgAd = $('#topImgAd');
    var $webTrans = $('#webTrans');
    var injectEtymolineName = 'creamidea' + makeId(9); // make the name of injecting function is unique
    var openURLFunName = 'openurl' + makeId(9);
    var proxySelection = 'proxySelection' + makeId(9);
    var sltContainerName = 'selectionContainer' + makeId(9);
    var youdaoSearchButtonId = 'youdaoSearchButton' + makeId(9);
    var googleFrameId = 'googleResult' + makeId(9);

    // remove the ad
    $topImgAd.remove();
    $('#baidu-adv').remove();
    $('#follow').remove();

    // window global function. It is the callback in the iframe
    window[injectEtymolineName] = function (event) {
        // open the next page in the etymoline.com iframe
        event.preventDefault();
        var target = event.target;
        request(ETYMONLINEHTTP + target.attributes.href.value);
    };
    window[openURLFunName] = function (event) {
        event.preventDefault();
        location.href = event.target.attributes.href.value;
    };
    window[proxySelection] = function (event) {
        var sel = window.getSelection();
        var range = document.createRange();
        var targetSel = this.getSelection();
        var $sltContainer = $('#' + sltContainerName);
        var selectionText = encodeURIComponent(targetSel.toString());
        var $youdaoSearchButton = $('#' + youdaoSearchButtonId);
        if ($sltContainer.length === 0)
            $sltContainer = $('<div id=' + sltContainerName + ' />').appendTo('body');
        if ($youdaoSearchButton.length === 0)
            $youdaoSearchButton = $('<butotn id=' + youdaoSearchButtonId + ' class="youdao-trans-icon">').append('<a href="javascript: void(0)"><img src="http://shared.ydstatic.com/images/favicon.ico"></a>').appendTo('body');
        if (selectionText === "") {
            $youdaoSearchButton.css({ display: 'none' });
            return;
        }

        $sltContainer.css({ position: "absolute", zIndex: -1, top: "-1000px" }).text(selectionText);
        setTimeout(function () {
            $youdaoSearchButton.find('a').attr('href', YOUDAOHTTP + '/w/' + selectionText + '/')
                .end().css({ left: $('#' + injectEtymolineName).data('click-x'), top: $('#' + injectEtymolineName).data('click-y'), display: 'block' });
        }, 24);

        range.selectNode($sltContainer[0]);
        sel.removeAllRanges();
        sel.addRange(range);
        // range.setStart(targetSel.anchorNode, targetSel.anchorOffset);
        // range.setEnd(targetSel.focusNode, targetSel.focusOffset);
        // sel.removeAllRanges();
        // sel.empty();
        // sel.setBaseAndExtent(targetSel.anchorNode, targetSel.anchorOffset, targetSel.focusNode, targetSel.focusOffset);
        // window.getSelection().anchorNode.textContent.substring(this.getSelection().extentOffset, this.getSelection().anchorOffset);
    };

    // create the frame wrapper
    var $frameWrapper =
        $('<div id=' + injectEtymolineName + '-wrapper class="etymoline"/>').css({ border: 0, width: '100%' }).html(
            '<div class="hint">Etymoline.com ...</div>');
    // var $googleFrameWrapper =
    //    $('<div id=' + googleFrameId + '-wrapper class="google-frame"/>').css({ border: 0, width: '100%' }).html(
    //        '<div class="hint">google.com ...</div>');
    if ($webTrans.length === 0) return; // maybe no result :)

    $frameWrapper.insertBefore($webTrans);
    // $googleFrameWrapper.insertBefore($webTrans);

    // set NProgress
    NProgress.configure({ parent: '#' + injectEtymolineName + '-wrapper' });
    NProgress.set(0.7);
    NProgress.inc(0.2);

    // request the etymoline.com page
    var $phrsListTab = $('#phrsListTab');
    var queryWord;
    if ($phrsListTab.length > 0 && $phrsListTab.find('.keyword').length > 0)
        queryWord = $phrsListTab.find('.keyword').text();
    else
        queryWord = $query.val();
    setTimeout(function () { NProgress.start(); request(ETYMONLINEHTTP + '/index.php?term=' + encodeURIComponent(queryWord), etymolineHandler); }, 0);
    setTimeout(function () { request(GOOGLEHTTP + '/search?sclient=psy-ab&hl=en&fp=1&num=1&start=0&q=' + encodeURIComponent('define: ' + queryWord), googleHandler); }, 60);

    // set the default explanation
    $('#webTrans .tabs a').each(function (i, link) {
        if (link.innerText === '英英释义')
            link.click();
    });

    // from: http://stackoverflow.com/a/12444641/1925954
    var keys = {};
    function test_key(selkey) {
        var alias = {
            "Ctrl": 17,
            "Shift": 16,
            "/": 191,
            "a": 65,
            "e": 69
        };
        return keys[selkey] || keys[alias[selkey]];
    }
    function test_keys() {
        var i,
            keylist = arguments,
            status = true;
        for (i = 0; i < keylist.length; i++) {
            if (!test_key(keylist[i])) {
                // status = false;
                return false;
            }
        }
        return status;
    }
    function globalKeydown(event) {
        var keyCode = event.keyCode;
        keys[keyCode] = event.type === 'keydown';
        if (test_keys('Shift', 'e')) {
            if ($('.baav .voice-js')[0]) $('.baav .voice-js')[0].click();
            keys = {};
            return false;
        } else if (test_keys('Shift', 'a')) {
            if ($('.baav .voice-js')[1]) $('.baav .voice-js')[1].click();
            keys = {};
            return false;
        } else if (test_keys('Shift', '/')) {
            // ? => help
            toggleHelp();
            keys = {};
            return false;
        } else if (test_keys('/')) {
            $query.focus().select();
            keys = {};
            return false; // to avoid input '/' in inputbox.
        }
    }
    function globalKeyup(event) {
        var keyCode = event.keyCode;
        keys[keyCode] = false;
    }
    $(document).keydown(globalKeydown).keyup(globalKeyup);

    // adjust the youdao css
    // move top navigation
    $('#container').css({ width: "1000px" });
    $('#results').css({ width: "680px" });
    $('#ads').css({ width: "320px" });
    var transformToggle = [];
    $('#eTransform .tabs').children().each(function (index, elt) {
        transformToggle.push(elt.innerText);
    });
    $('#transformToggle').children().each(function (index, elt) {
        if (elt.id === 'wordGroup') return;
        var $clone = $(elt).clone();
        $clone.addClass('follow').removeClass('hide').css({ display: 'block' }).prepend('<p class="hd">' + transformToggle[index] + '</p>').next().css({ marginTop: "8px" });
        $clone.appendTo('#ads');
    });//.end().parent().remove();
    $('#doc>.c-topbar-wrapper').css({ height: "81px", top: "-42px" }).find('.c-subtopbar').remove();
    $scontainer.css({ marginTop: "42px" });

    function request(url, callback) {
        var xhr = new GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            // anonymous: true,
            onreadystatechange: function (resp) { onreadystatechange(resp, callback); }
        });
    }

    function onreadystatechange(resp, callback) {
        var readyState = resp.readyState;
        if (readyState === 0) {
            // Client has been created. open() not called yet.
        } else if (readyState === 1) {
            // open() has been called.
        } else if (readyState === 2) {
            // send() has been called, and headers and status are available.
        } else if (readyState === 3) {
            // Downloading; responseText holds partial data.
        } else if (readyState === 4) {
            switch (resp.status) {
                case 200:
                    // etymolineHandler(resp.responseText);
                    callback(resp.responseText);
                    break;
                default:
                    GM_log(['Ger Error: ', '\nState: ', resp.readyState, '\nMessage: ', resp.responseText].join(''));
            }
        }
    }

    function etymolineHandler(responseText) {
        var domParser = new DOMParser();
        var doc = domParser.parseFromString(responseText, 'text/html');
        var $dictionary = doc.querySelector('#dictionary');
        $dictionary.style.border = 0;
        $dictionary.style.marginBottom = 0;
        var $frame = $('#' + injectEtymolineName);
        if ($frame.length === 0) {
            $frame = $('<iframe id="' + injectEtymolineName + '" />').css({ border: 0, width: '100%', maxHeight: '240px' });
            $frameWrapper.append($frame);
            $frameWrapper.find('.hint').remove(); // remove the hint.
            $frame.contents().find("head")
                .append('<style>' + GM_getResourceText("etymoline_css") + '</style>')
                .append('<style>' + GM_getResourceText("etymoline_font") + '</style>')
                .append('<style>' +
                '.etymoline-footer {border: 0px;color: wheat;text-align: right;}' +
                '</style>');
            // $frame.contents().on('selectionchange', function () {debugger});
            $frame.contents()
                .on('selectionchange', parent[proxySelection])
                .on('mousemove', function (event) { $frame.data('click-x', $frame.offset().left + event.pageX); $frame.data('click-y', $frame.offset().top + event.pageY - 30); })
                .on('keydown', function (event) { globalKeydown(event); })
                .on('keyup', function (event) { globalKeyup(event); });
        }
        $frame.contents().find("body")
            .html($dictionary)
            .append('<footer class="etymoline-footer">From: <a href="http://www.etymonline.com/index.php" style="color: wheat;" target="_blank">The Online Etymology Dictionary</a></footer>');
        // Some fix
        $frame.ready(function () {
            $frame.css({ height: $frame.contents().find("html").height() });
            $frame.contents().find("body img").map(function (index, img) {
                // the resource path of dictionary png
                img.src = ETYMONLINEHTTP + '/graphics/dictionary.gif';
                return img;
            });
            $frame.contents().find("body a.dictionary").map(function (index, link) {
                // click the png
                link.target = '_blank';
                return link;
            });
            $frame.contents().find("body #dictionary dl a").not('.dictionary').map(function (index, link) {
                // click the word
                // link.onclick = parent[injectEtymolineName];
                var oLink = new URL(link.href);
                var term = oLink.search.slice(1).split('&').map(function (v) { var _v = v.split('='); return { key: _v[0], value: _v[1] }; }).filter(function (v) { if (v.key === 'term') return v; })[0];
                link.href = YOUDAOHTTP + '/w/' + term.value + '/';
                link.onclick = parent[openURLFunName];
                //link.href = link.href.replace(new RegExp(YOUDAOHTTP), ETYMONLINEHTTP);
                //link.target = '_blank';
                // link.href = 'javascript:void(0);';
                // link.style.cursor = 'default';
                return link;
            });
            $frame.contents().find("body .paging a").map(function (index, link) {
                // The code below is just for fun :P
                // var oLink = new URL(link.href);
                // var p = oLink.search.slice(1).split('&').map(function(v){var _v = v.split('=');return {key: _v[0], value: _v[1]}}).filter(function(v){if(v.key==='p')return v;})[0].value
                link.onclick = parent[injectEtymolineName];
                return link;
            });
        });
        NProgress.done();
    }

    function googleHandler(text) {
        // console.log(text);
        var googleDefinationHTML = parseJEAPI(text);
        var domParser = new DOMParser();
        var $doc = domParser.parseFromString(googleDefinationHTML, 'text/html');
        if (!$doc.querySelectorAll('.g.tpo.mod')) return; // has no defination

        var $googleFrame = $('#' + googleFrameId);
        if ($googleFrame.length === 0) $googleFrame = $('<iframe id=' + googleFrameId + ' />').css({ border: 0, width: '616px' }).appendTo('body');

        // trim doc
        // $doc.querySelector('.srg').remove();
        $doc.querySelector('.hd').remove();
        if ($doc.querySelector('hr')) $doc.querySelector('hr').remove();

        $googleFrame.contents().find('head').html($doc.head.innerHTML);
        $googleFrame.contents().find('body').html('<h1>被你发现了 XD</h1>' + $doc.body.innerHTML);
        $googleFrame.css({ height: $googleFrame.contents().height() });

        // after render the html, you can get these information.
        if ($googleFrame.contents().find('.vk_ans')[0] === undefined) return;
        var keyword = $googleFrame.contents().find('.vk_ans')[0].innerHTML;
        $('.keyword').html(keyword);

        // get the imags of "origin" and "use over time"
        $googleFrame.contents().find('.xpdxpnd img').closest('.xpdxpnd').each(function (index, elt) {
            var $elt = $(elt);
            $elt.find('img').attr('onload', '').end()
                .find('a').attr('onmousedown', '');
            if ($elt.find('.vk_sh.vk_gy').text().toUpperCase() === 'ORIGIN') {
                $elt.insertBefore('#webTrans');
            } else {
                //$elt.prependTo('#ads');
                $elt.appendTo('#ads');
            }
        });

        /*
        // get the changin of the speech
        var speechsContainer = [];
        var $phrsListTab = $('#phrsListTab');
        var $speechs = $googleFrame.contents().find('.lr_dct_sf_h');
        var $speechsDetail = $googleFrame.contents().find('.vk_gy');
        $speechs.each(function (index, $speech) {
            // speechsContainer.push([$speech, $speechsDetail[index]]);
            $phrsListTab.append($speech).append($speechsDetail[index]);
        });
        */
        return;
    }
    var googleJs = '!function(){window.google={},google.kHL="en",google.c={c:{a:!0}},google.time=function(){return(new Date).getTime()},google.timers={},google.startTick=function(o,e){var g=e&&google.timers[e].t?google.timers[e].t.start:google.time();google.timers[o]={t:{start:g},e:{},it:{},m:{}},(g=window.performance)&&g.now&&(google.timers[o].wsrt=Math.floor(g.now()))},google.tick=function(o,e,g){google.timers[o]||google.startTick(o),g=g||google.time(),e instanceof Array||(e=[e]);for(var t=0;t<e.length;++t)google.timers[o].t[e[t]]=g},google.afte=!0,google.aft=function(o){google.c.c.a&&google.afte&&google.tick("aft",o.id||o.src||o.name)}}();';
    function QS_kga(a) {
        QS_gda = a;
        QS_le(QS_7d, QS_9d) || google.dclc(QS_d(a, QS_7d, !0))
    }
    function QS_sga(a) {
        a = String(a);
        for (var b = ['"'], c = 0; c < a.length; c++) {
            var d = a.charAt(c), e = d.charCodeAt(0),
                f = c + 1, g;
            if (!(g = QS_kga[d])) {
                if (!(31 < e && 127 > e))
                    if (d in QS_jga)
                        d = QS_jga[d];
                    else if (d in QS_kga)
                        d = QS_jga[d] = QS_kga[d];
                    else {
                        g = d.charCodeAt(0);
                        if (31 < g && 127 > g)
                            e = d;
                        else {
                            if (256 > g) {
                                if (e = "\\x",
                                    16 > g || 256 < g)
                                    e += "0"
                            } else
                                e = "\\u",
                                    4096 > g && (e += "0");
                            e += g.toString(16).toUpperCase()
                        }
                        d = QS_jga[d] = e
                    }
                g = d
            }
            b[f] = g
        }
        b.push('"');
        return b.join("")
    }
    function parseJEAPI(a) {
        let e = a,
            f = [],
            g, l, m, n;

        for (g = l = 0; -1 != l && g >= l;) {
            l = e.indexOf("<script", g),
                -1 != l && (m = e.indexOf(">", l) + 1,
                    g = e.indexOf("\x3c/script>", m),
                    0 < m && g > m && f.push(e.substring(m, g)));
        }
        e = [];
        for (m = 0; m < f.length; ++m)
            g = f[m],
                g = g.replace(/location\.href/gi, QS_sga(l)),
                e.push(g);
        if (0 < e.length) {
            f = e.join(";");
            f = f.replace(/,"is":_loc/g, "");
            f = f.replace(/,"ss":_ss/g, "");
            f = f.replace(/,"fp":fp/g, "");
            f = f.replace(/,"r":dr/g, "");
            e = [];
            f = eval("var __r=[];var QS=function (){};QS.prototype.api=function(o){__r.push(o)};var je=new QS;" + f + ';__r;')
            for (let i = 0, max = f.length; i < max; i++) {
                if (f[i].i === 'search')
                    e.push(f[i].h)
                if (f[i].i === 'lfoot')
                    e.push(f[i].h)
            }
            return `<script>${googleJs}</script>` + e.join('')
        }
    }

    function makeId(len) {
        if (isNaN(parseInt(len))) len = 8;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function toggleHelp() {
        console.log('Message for help. Comming soon...');
    }

})();
