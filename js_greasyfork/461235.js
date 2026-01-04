// ==UserScript==
// @name         茶杯狐
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  茶杯狐去除广告
// @author       啦A多梦
// @license      MIT
// @match        https://www.cupfox.app/*
// @match        https://cupfox.app/*
// @match        https://www.6080dy3.com/*
// @match        https://jx1.idcdr.com/*
// @match        https://www.hdmoli.com/*
// @match        https://*.hdmoli.com/*
// @match        https://www.ylwt33.com/*
// @match        https://player.fuxiafood.com/*
// @match        https://jx1.idcdr.com/*
// @match        https://cdn10.hdzyk-cdn.com/*
// @match        https://www.smdyy1.cc/*
// @match        https://player.021huaying.com/*
// @match        https://*.freeok.vip/*
// @match        https://player.freeok.vip/*
// @match        https://*.rrets.cc/*
// @match        https://www.dm718.com/*
// @match        https://jx.wujinkk.com/*
// @match        https://www.333ys.tv/*
// @match        https://player.yaplayer.one/*
// @match        https://jx1.xn--9sw0lnkz85j.xn--fiqs8s/*
// @match        https://www.3wyy.com/*
// @match        https://*/player/555/*
// @match        https://player.qifuda.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461235/%E8%8C%B6%E6%9D%AF%E7%8B%90.user.js
// @updateURL https://update.greasyfork.org/scripts/461235/%E8%8C%B6%E6%9D%AF%E7%8B%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var style = document.createElement("style");
    style.innerHTML = "#wBefdn, #adv_wrap_hh, .tips-box, #adv_wrap_hh, .is_pc_flex, .is_mb, .is_pc, #popup, .ec-ad, .player-news, #player_pic, .ads, .ad, .stui-pannel, #HMcoupletDivleft, #HMcoupletDivright, .cupfox-img, #index_banner, .dplayer-menu, #note, #mhbottom_ad_box, #adv, #bfad1, #bfad2, #bfad3, #bfad4, #bfad5, #bfad6, #xqad1, #xqad2, #xqad3, #xqad4, #xqad5, #xqad6, #fix_bottom_dom, #ad, .ads_w, .tips, #HMRichBox, #buffer, #adv_wrap_hh, .tips-box, .head-guide>.banner, .main > .cupfox-box, .border-shadow > div > .cupfox-box {display: none !important}";
    document.head.appendChild(style);
    // 去除人人影视右下角广告
    if(window.location.href.indexOf("rrets") != -1){
        try{
            document.querySelector("#close1").parentElement.style.display = 'none';
        } catch(err){}
    }

    //获取m3u8地址去广告
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        if (url.indexOf(".m3u8") != -1) {
            console.log("捕获m3u8地址->",url);
            // console.log(this.readyState);
            this.addEventListener("readystatechange", function () {
                if(this.readyState == 4){
                    var _responsetext = this.responseText;
                    // console.log(_responsetext);
                    Object.defineProperty(this, "responseText",{
                        writable: true,
                    });
                    if(url.indexOf("lz-cdn4") != -1||url.indexOf("ffzy-online1") != -1){
                        console.log("lz-cdn4");
                        this.responseText = _responsetext.replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY\n#EXTINF:.*\n.*1o([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts");
                    }else{
                        this.responseText = _responsetext.replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts");
                    }
                    console.log(this.responseText);
                }
            })
        }

        return open.apply(this, arguments);
    }
// 修改HDmoli播放器
    var fpathname = window.location.pathname;
    var fsearc = window.location.search;
    if (fpathname == '/js/player/videojs/videojs.html') {
        window.location = '/js/player/dplayer/dplayer.html' + fsearc;
    }

    function changeplayer() {
        if (fpathname == '/js/player/dplayer/dplayer.html') {
            // 秒数转时间格式
            function vdoleng(val){
                if(val <=0 ){return "00:00"};
                let hour = Math.floor(val / 3600);
                let min = Math.floor(val % 3600 / 60);
                // let sec = Math.round(val % 60); //四舍五入计算秒
                let sec = Math.floor(val % 60); //向下取整数
                let vlength = ""
                if(hour.toString().length < 2){
                    hour = '0' + hour.toString();
                }
                if(min.toString().length < 2){
                    min = '0' + min.toString();
                }
                if(sec.toString().length < 2){
                    sec = '0' + sec.toString();
                }
                if(hour > 0){
                    vlength = hour + ":" + min + ":" + sec;
                }else{
                    vlength = min + ":" + sec;
                }
                return vlength;
            }

            var myv = document.querySelector("video");
            var timetip = document.createElement("div");
            var jindu = document.createElement("div");
            jindu.innerText = vdoleng(myv.duration);
            jindu.style.position = "absolute";
            jindu.style.display = "none";
            jindu.style.top = myv.clientHeight / 2 - jindu.clientHeight / 2 + "px";
            jindu.style.left = myv.clientWidth / 2 - jindu.clientWidth / 2 + "px";
            jindu.style.padding = "5px";
            jindu.style.borderRadius = "5px";
            jindu.style.background = "rgb(48 48 48 / 50%)";
            jindu.style.textAlign = "center";
            jindu.style.color = "white";

            timetip.style.position = "absolute";
            timetip.style.display = "none";
            timetip.style.top = 0;
            timetip.style.left = 0;
            timetip.innerText = "00:00:00";
            timetip.style.padding = "5px";
            timetip.style.borderRadius = "5px";
            timetip.style.background = "rgb(48 48 48 / 50%)";
            timetip.style.textAlign = "center";
            timetip.style.color = "white";
            myv.parentElement.parentElement.appendChild(timetip);
            myv.parentElement.parentElement.appendChild(jindu);
            document.querySelector(".dplayer-comment").style.display = "inline-block";
            document.querySelector(".dplayer-comment").children[0].children[0].innerText = "T";
            document.querySelector(".dplayer-comment").children[0].children[0].style.color = "#fff";
            document.querySelector(".dplayer-comment").ontouchend = function () {
                timetip.style.display == "none" ? timetip.style.display = "block" : timetip.style.display = "none";
            }
            setInterval(function(){
                var nowtime = new Date();
                timetip.innerText = nowtime.toLocaleTimeString()
            }, 1000);

            var dbtouch = 0;//双击计数
            var currplaytime = 0;
            var playtime = 0;
            var startX = 0;
            var tmv = 0, beisu;
            myv.addEventListener("touchstart", function (event) {
                startX = event.targetTouches[0].pageX;
                playtime = myv.currentTime;
                dbtouch++;
                setTimeout(function () {
                    dbtouch = 0;
                }, 800);
                beisu = setTimeout(function(){
                    if(!myv.paused){
                        navigator.vibrate(100);
                        myv.playbackRate = 3;
                        jindu.style.display = "block";
                        jindu.innerText = '快进X3';
                        jindu.style.top = myv.clientHeight / 2 - jindu.clientHeight / 2 + "px";
                        jindu.style.left = myv.clientWidth / 2 - jindu.clientWidth / 2 + "px";
                    }
                }, 800);
            })
            myv.addEventListener("touchmove", function (e) {
                currplaytime = playtime + ((e.targetTouches[0].pageX - startX) / 2);
                tmv++;
                jindu.style.display = "block";
                jindu.innerText = vdoleng(currplaytime);
                jindu.style.top = myv.clientHeight / 2 - jindu.clientHeight / 2 + "px";
                jindu.style.left = myv.clientWidth / 2 - jindu.clientWidth / 2 + "px";
            })
            myv.addEventListener("touchend", function () {
                if (dbtouch >= 2) {
                    myv.paused ? myv.play() : myv.pause();
                    dbtouch = 0;
                }
                if (tmv >= 1 && Math.abs(currplaytime - myv.currentTime) > 10) {
                    myv.currentTime = currplaytime;
                }
                tmv = 0;
                currplaytime = 0;
                playtime = 0;
                startX = 0;
                jindu.style.display = "none";
                clearTimeout(beisu);
                myv.playbackRate = 1;
            })
        }
    }

    setTimeout(changeplayer, 5000);

    //对中文域名进行Punycode编码函数-------------------------------------------------------------
    ;(function(w) {
        var PunycodeModule = function () {

            function IdnMapping() {
                this.utf16 = {
                    decode: function (input) {
                        var output = [], i = 0, len = input.length, value, extra;
                        while (i < len) {
                            value = input.charCodeAt(i++);
                            if ((value & 0xF800) === 0xD800) {
                                extra = input.charCodeAt(i++);
                                if (((value & 0xFC00) !== 0xD800) || ((extra & 0xFC00) !== 0xDC00)) {
                                    throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
                                }
                                value = ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
                            }
                            output.push(value);
                        }
                        return output;
                    },
                    encode: function (input) {
                        var output = [], i = 0, len = input.length, value;
                        while (i < len) {
                            value = input[i++];
                            if ((value & 0xF800) === 0xD800) {
                                throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
                            }
                            if (value > 0xFFFF) {
                                value -= 0x10000;
                                output.push(String.fromCharCode(((value >>> 10) & 0x3FF) | 0xD800));
                                value = 0xDC00 | (value & 0x3FF);
                            }
                            output.push(String.fromCharCode(value));
                        }
                        return output.join("");
                    }
                }

                var initial_n = 0x80;
                var initial_bias = 72;
                var delimiter = "\x2D";
                var base = 36;
                var damp = 700;
                var tmin = 1;
                var tmax = 26;
                var skew = 38;
                var maxint = 0x7FFFFFFF;

                function decode_digit(cp) {
                    return cp - 48 < 10 ? cp - 22 : cp - 65 < 26 ? cp - 65 : cp - 97 < 26 ? cp - 97 : base;
                }

                function encode_digit(d, flag) {
                    return d + 22 + 75 * (d < 26) - ((flag != 0) << 5);

                }
                function adapt(delta, numpoints, firsttime) {
                    var k;
                    delta = firsttime ? Math.floor(delta / damp) : (delta >> 1);
                    delta += Math.floor(delta / numpoints);

                    for (k = 0; delta > (((base - tmin) * tmax) >> 1) ; k += base) {
                        delta = Math.floor(delta / (base - tmin));
                    }
                    return Math.floor(k + (base - tmin + 1) * delta / (delta + skew));
                }


                function encode_basic(bcp, flag) {
                    bcp -= (bcp - 97 < 26) << 5;
                    return bcp + ((!flag && (bcp - 65 < 26)) << 5);
                }

                this.decode = function (input, preserveCase) {
                    // Dont use utf16
                    var output = [];
                    var case_flags = [];
                    var input_length = input.length;

                    var n, out, i, bias, basic, j, ic, oldi, w, k, digit, t, len;

                    // Initialize the state:

                    n = initial_n;
                    i = 0;
                    bias = initial_bias;

                    // Handle the basic code points: Let basic be the number of input code
                    // points before the last delimiter, or 0 if there is none, then
                    // copy the first basic code points to the output.

                    basic = input.lastIndexOf(delimiter);
                    if (basic < 0) basic = 0;

                    for (j = 0; j < basic; ++j) {
                        if (preserveCase) case_flags[output.length] = (input.charCodeAt(j) - 65 < 26);
                        if (input.charCodeAt(j) >= 0x80) {
                            throw new RangeError("Illegal input >= 0x80");
                        }
                        output.push(input.charCodeAt(j));
                    }

                    // Main decoding loop: Start just after the last delimiter if any
                    // basic code points were copied; start at the beginning otherwise.

                    for (ic = basic > 0 ? basic + 1 : 0; ic < input_length;) {

                        // ic is the index of the next character to be consumed,

                        // Decode a generalized variable-length integer into delta,
                        // which gets added to i. The overflow checking is easier
                        // if we increase i as we go, then subtract off its starting
                        // value at the end to obtain delta.
                        for (oldi = i, w = 1, k = base; ; k += base) {
                            if (ic >= input_length) {
                                throw RangeError("punycode_bad_input(1)");
                            }
                            digit = decode_digit(input.charCodeAt(ic++));

                            if (digit >= base) {
                                throw RangeError("punycode_bad_input(2)");
                            }
                            if (digit > Math.floor((maxint - i) / w)) {
                                throw RangeError("punycode_overflow(1)");
                            }
                            i += digit * w;
                            t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                            if (digit < t) { break; }
                            if (w > Math.floor(maxint / (base - t))) {
                                throw RangeError("punycode_overflow(2)");
                            }
                            w *= (base - t);
                        }

                        out = output.length + 1;
                        bias = adapt(i - oldi, out, oldi === 0);

                        // i was supposed to wrap around from out to 0,
                        // incrementing n each time, so we'll fix that now:
                        if (Math.floor(i / out) > maxint - n) {
                            throw RangeError("punycode_overflow(3)");
                        }
                        n += Math.floor(i / out);
                        i %= out;

                        // Insert n at position i of the output:
                        // Case of last character determines uppercase flag:
                        if (preserveCase) { case_flags.splice(i, 0, input.charCodeAt(ic - 1) - 65 < 26); }

                        output.splice(i, 0, n);
                        i++;
                    }
                    if (preserveCase) {
                        for (i = 0, len = output.length; i < len; i++) {
                            if (case_flags[i]) {
                                output[i] = (String.fromCharCode(output[i]).toUpperCase()).charCodeAt(0);
                            }
                        }
                    }
                    return this.utf16.encode(output);
                };


                this.encode = function (input, preserveCase) {
                    //** Bias adaptation function **

                    var n, delta, h, b, bias, j, m, q, k, t, ijv, case_flags;

                    if (preserveCase) {
                        // Preserve case, step1 of 2: Get a list of the unaltered string
                        case_flags = this.utf16.decode(input);
                    }
                    // Converts the input in UTF-16 to Unicode
                    input = this.utf16.decode(input.toLowerCase());

                    var input_length = input.length; // Cache the length

                    if (preserveCase) {
                        // Preserve case, step2 of 2: Modify the list to true/false
                        for (j = 0; j < input_length; j++) {
                            case_flags[j] = input[j] != case_flags[j];
                        }
                    }

                    var output = [];


                    // Initialize the state:
                    n = initial_n;
                    delta = 0;
                    bias = initial_bias;

                    // Handle the basic code points:
                    for (j = 0; j < input_length; ++j) {
                        if (input[j] < 0x80) {
                            output.push(
                                String.fromCharCode(
                                    case_flags ? encode_basic(input[j], case_flags[j]) : input[j]
                                )
                            );
                        }
                    }

                    h = b = output.length;

                    // h is the number of code points that have been handled, b is the
                    // number of basic code points

                    if (b > 0) output.push(delimiter);

                    // Main encoding loop:
                    //
                    while (h < input_length) {
                        // All non-basic code points < n have been
                        // handled already. Find the next larger one:

                        for (m = maxint, j = 0; j < input_length; ++j) {
                            ijv = input[j];
                            if (ijv >= n && ijv < m) m = ijv;
                        }

                        // Increase delta enough to advance the decoder's
                        // <n,i> state to <m,0>, but guard against overflow:

                        if (m - n > Math.floor((maxint - delta) / (h + 1))) {
                            throw RangeError("punycode_overflow (1)");
                        }
                        delta += (m - n) * (h + 1);
                        n = m;

                        for (j = 0; j < input_length; ++j) {
                            ijv = input[j];

                            if (ijv < n) {
                                if (++delta > maxint) return Error("punycode_overflow(2)");
                            }

                            if (ijv == n) {
                                // Represent delta as a generalized variable-length integer:
                                for (q = delta, k = base; ; k += base) {
                                    t = k <= bias ? tmin : k >= bias + tmax ? tmax : k - bias;
                                    if (q < t) break;
                                    output.push(String.fromCharCode(encode_digit(t + (q - t) % (base - t), 0)));
                                    q = Math.floor((q - t) / (base - t));
                                }
                                output.push(String.fromCharCode(encode_digit(q, preserveCase && case_flags[j] ? 1 : 0)));
                                bias = adapt(delta, h + 1, h == b);
                                delta = 0;
                                ++h;
                            }
                        }

                        ++delta, ++n;
                    }
                    return output.join("");
                }
            }

            this.toASCII = function (domain) {
                var idn = new IdnMapping();
                var domainarray = domain.split(".");
                var out = [];
                for (var i = 0; i < domainarray.length; ++i) {
                    var s = domainarray[i];
                    out.push(
                        s.match(/[^A-Za-z0-9-]/) ?
                            "xn--" + idn.encode(s) :
                            s
                    );
                }
                return out.join(".");
            }

            this.toUnicode = function (domain) {
                var idn = new IdnMapping();
                var domainarray = domain.split(".");
                var out = [];
                for (var i = 0; i < domainarray.length; ++i) {
                    var s = domainarray[i];
                    out.push(
                        s.match(/^xn--/) ?
                        idn.decode(s.slice(4)) :
                            s
                    );
                }
                return out.join(".");
            }
        }

        w.idnMapping =  PunycodeModule;
    })(window);

    window.onload = function(){
        try{
            var zurl = document.querySelector("#playleft").firstChild.src;
            var zhost = zurl.match(/https:\/\/(jx1.*?)\//)[1];
            if(zhost.charCodeAt(zhost.length-1)>255){
                var idn = new idnMapping();
                var str = idn.toASCII(zhost);
                document.querySelector("#playleft").firstChild.src = zurl.replace(zhost, str);
                console.log("change zurl address");
            }
        }catch{}
    }
    //对中文域名进行Punycode编码函数-----------------------END--------------------------------------

})();