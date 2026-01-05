// ==UserScript==
// @name         Lyragosa's WoW Glossary Translation in NGA
// @namespace    https://github.com/lyragosa/LWGT
// @version      1.02 Beta
// @description  为NGA论坛帖子提供“划词翻译”功能，选中的部分如果是魔兽世界术语，则会给出对应的简，繁与英文内容。仅供NGA论坛使用
// @author       Lyragosa
// @license      MIT License
// @require      http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @include      /^http://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|bbs\.bigccq\.cn)/(read\.php)/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/24654/Lyragosa%27s%20WoW%20Glossary%20Translation%20in%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/24654/Lyragosa%27s%20WoW%20Glossary%20Translation%20in%20NGA.meta.js
// ==/UserScript==

var qC = {
    '1': "black",
    '2': "seagreen",
    '3': "royalblue",
    '4': "purple",
    '5': "orangered",
    '6': "burlywood",
    '7': "skyblue"
};

jQuery.noConflict();

console.log("Lyragosa's WoW Glossary Translation Addon Enable!");

GB2312UTF8 = {
    Dig2Dec: function (s) {
        var retV = 0;
        if (s.length == 4) {
            for (var i = 0; i < 4; i++) {
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    },

    Hex2Utf8: function (s) {
        var retS = "";
        var tempS = "";
        var ss = "";
        if (s.length == 16) {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10, 16);
            var sss = "0123456789ABCDEF";
            for (var i = 0; i < 3; i++) {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i) + 1) * 8);
                retS += sss.charAt(this.Dig2Dec(ss.substring(0, 4)));
                retS += sss.charAt(this.Dig2Dec(ss.substring(4, 8)));
            }
            return retS;
        }
        return "";
    },

    Dec2Dig: function (n1) {
        var s = "";
        var n2 = 0;
        for (var i = 0; i < 4; i++) {
            n2 = Math.pow(2, 3 - i);
            if (n1 >= n2) {
                s += '1';
                n1 = n1 - n2;
            }
            else
                s += '0';
        }
        return s;
    },

    Str2Hex: function (s) {
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for (var i = 0; i < s.length; i++) {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += this.Dec2Dig(eval(n));
        }
        return digS;
    },

    GB2312ToUTF8: function (s1) {
        var s = escape(s1);
        var sa = s.split("%");
        var retV = "";
        if (sa[0] != "") {
            retV = sa[0];
        }
        for (var i = 1; i < sa.length; i++) {
            if (sa[i].substring(0, 1) == "u") {
                //alert(this.Str2Hex(sa[i].substring(1,5)));
                retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1, 5)));
                if (sa[i].length) {
                    retV += sa[i].substring(5);
                }
            }
            else {
                retV += unescape("%" + sa[i]);
                if (sa[i].length) {
                    retV += sa[i].substring(5);
                }
            }
        }
        return retV;
    },

    UTF8ToGB2312: function (str1) {
        var substr = "";
        var a = "";
        var b = "";
        var c = "";
        var i = -1;
        i = str1.indexOf("%");
        if (i == -1) {
            return str1;
        }
        while (i != -1) {
            if (i < 3) {
                substr = substr + str1.substr(0, i - 1);
                str1 = str1.substr(i + 1, str1.length - i);
                a = str1.substr(0, 2);
                str1 = str1.substr(2, str1.length - 2);
                if (parseInt("0x" + a) & 0x80 == 0) {
                    substr = substr + String.fromCharCode(parseInt("0x" + a));
                }
                else if (parseInt("0x" + a) & 0xE0 == 0xC0) { //two byte
                    b = str1.substr(1, 2);
                    str1 = str1.substr(3, str1.length - 3);
                    var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                    widechar = widechar | (parseInt("0x" + b) & 0x3F);
                    substr = substr + String.fromCharCode(widechar);
                }
                else {
                    b = str1.substr(1, 2);
                    str1 = str1.substr(3, str1.length - 3);
                    c = str1.substr(1, 2);
                    str1 = str1.substr(3, str1.length - 3);
                    var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                    widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                    widechar = widechar | (parseInt("0x" + c) & 0x3F);
                    substr = substr + String.fromCharCode(widechar);
                }
            }
            else {
                substr = substr + str1.substring(0, i);
                str1 = str1.substring(i);
            }
            i = str1.indexOf("%");
        }

        return substr + str1;
    }
};


function getSelectionText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea" || activeElTagName == "input") &&
        /^(?:text|search|password|tel|url)jQuery/i.test(activeEl.type) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

jQuery("body").on("mouseup", "#LWGTWindow", function (e) {
    //nothing
    //console.log('DO NOT CLOSE');
    e.stopPropagation();
    return false;
});

jQuery("body").on("mouseup", function (e) {
    var txt = getSelectionText();
    if (txt.length > 0 && jQuery("#selectTextHintWindow").length >= 0 && jQuery(e.target).attr("id") != 'LWGTWindow') {
        jQuery("#LWGTWindow").remove();
        //console.log(txt);
        var kks = jQuery("#selectTextHintWindow").offset(); //TODO 这是一种很 **** 不稳定!!!**** 的 依靠 地精科技 的 做法，如果以后接盘者发现插件错误，请首先检查这里。
        var y = kks.top;
        var x = kks.left;
        if (y > 0 && x > 0) {
            //console.log( getSelectionCharOffsetsWithin(document.body).start );
            var xm = jQuery("<div class='urltip' id='LWGTWindow' style='margin: 0px; line-height: 16px; left: " + x + "px; top: " + (y + 25) + "px; display: block;'></div>");
            var fin = '<table id="" style="border-spacing:3px"><tr><td></td><td></td><td class="silver">zhCN</td><td class="silver">zhTW</td><td class="silver">enUS</td><td class="silver">链接</td></tr>';
            jQuery.getJSON("http://db.178.com/wow/api/mobile_api.php?func=getlangconv&s=" + GB2312UTF8.GB2312ToUTF8(txt), function (skt) {
                //console.log(skt);
                var nm = skt.data.length;
                for (var i in skt.data) {
                    var px = skt.data[i];
                    //console.log(px.type_cn);
                    var icc = px.icon ? '<img src="http://img.db.178.com/wow/icons/s/' + px.icon + '.jpg" />' : '';
                    var qcc = px.quality > -1 ? qC[px.quality] : '#10273f';
                    fin += "<tr height=22px><td style='text-align:right'><span class='teal'>" + px.type_cn + "</span></td> <td>" + icc + "</td> <td style='color:" + qcc + "'> " +
                        "" + px.name_cn + "</td><td style='color:" + qcc + "'> " +
                        "" + px.name_tw + "</td><td style='color:" + qcc + "'> " +
                        "" + px.name_en + '</td> ' +
                        "<td> <a href='http://db.178.com/wow/cn/" + px.type_en + '/' + px.id + ".html' target='_blank' class='silver'>[简]</a> <a href='http://db.178.com/wow/tw/" + px.type_en + '/' + px.id + ".html' target='_blank' class='silver'>[繁]</a> " + '</td></tr>';
                }
                var xkt = '';
                if (skt.allnum > 10) {
                    xkt = "<div class='silver'><center>还有 " + (skt.allnum - 10) + " 个结果未列出，<a href='http://db.178.com/wow/cn/search.html?name=" + GB2312UTF8.GB2312ToUTF8(skt.search_key) + "&wtf=1' target='_blank'>点此进行搜索</a></center></div>";
                }
                else {
                    xkt = '';
                }
                fin += "</table> " + xkt + "<div class='xtxt' style='float:right;color:#e0c19e'>MAKE NGA GREAT AGAIN</div>";
                xm.html(fin);
                if (nm) jQuery("body").append(xm);
            });
        }
    }
    else {
        if (jQuery(e.target).attr("id") != 'LWGTWindow')
            jQuery("#LWGTWindow").remove();
    }
});

function getSelectionCharOffsetsWithin(element) {
    var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
        (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return {
        start: start,
        end: end
    };
}