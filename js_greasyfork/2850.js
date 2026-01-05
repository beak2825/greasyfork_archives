// ==UserScript==
// @name           osu! Supporter Ranking
// @description    osu! Supporter Ranking for web
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http://osu.ppy.sh/b/*
// @include        https://osu.ppy.sh/b/*
// @include        http://osu.ppy.sh/s/*
// @include        https://osu.ppy.sh/s/*
// @include        http://osu.ppy.sh/p/beatmap?*
// @include        https://osu.ppy.sh/p/beatmap?*
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @version        1.2.0.8
// @namespace https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/2850/osu%21%20Supporter%20Ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/2850/osu%21%20Supporter%20Ranking.meta.js
// ==/UserScript==


(function(){Date.shortMonths=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];Date.longMonths=['January','February','March','April','May','June','July','August','September','October','November','December'];Date.shortDays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];Date.longDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var replaceChars={d:function(){return(this.getDate()<10?'0':'')+ this.getDate();},D:function(){return Date.shortDays[this.getDay()];},j:function(){return this.getDate();},l:function(){return Date.longDays[this.getDay()];},N:function(){return this.getDay()+ 1;},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')));},w:function(){return this.getDay();},z:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((this- d)/86400000);},W:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((((this- d)/86400000)+ d.getDay()+ 1)/7);},F:function(){return Date.longMonths[this.getMonth()];},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+ 1);},M:function(){return Date.shortMonths[this.getMonth()];},n:function(){return this.getMonth()+ 1;},t:function(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).getDate()},L:function(){var year=this.getFullYear();return(year%400==0||(year%100!=0&&year%4==0));},o:function(){var d=new Date(this.valueOf());d.setDate(d.getDate()-((this.getDay()+ 6)%7)+ 3);return d.getFullYear();},Y:function(){return this.getFullYear();},y:function(){return(''+ this.getFullYear()).substr(2);},a:function(){return this.getHours()<12?'am':'pm';},A:function(){return this.getHours()<12?'AM':'PM';},B:function(){return Math.floor((((this.getUTCHours()+ 1)%24)+ this.getUTCMinutes()/60+ this.getUTCSeconds()/3600)*1000/24);},g:function(){return this.getHours()%12||12;},G:function(){return this.getHours();},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12);},H:function(){return(this.getHours()<10?'0':'')+ this.getHours();},i:function(){return(this.getMinutes()<10?'0':'')+ this.getMinutes();},s:function(){return(this.getSeconds()<10?'0':'')+ this.getSeconds();},u:function(){var m=this.getMilliseconds();return(m<10?'00':(m<100?'0':''))+ m;},e:function(){return"Not Yet Supported";},I:function(){var DST=null;for(var i=0;i<12;++i){var d=new Date(this.getFullYear(),i,1);var offset=d.getTimezoneOffset();if(DST===null)DST=offset;else if(offset<DST){DST=offset;break;}else if(offset>DST)break;}
return(this.getTimezoneOffset()==DST)|0;},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00';},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':00';},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result;},Z:function(){return-this.getTimezoneOffset()*60;},c:function(){return this.format("Y-m-d\\TH:i:sP");},r:function(){return this.toString();},U:function(){return this.getTime()/1000;}};Date.prototype.format=function(format){var date=this;return format.replace(/(\\?)(.)/g,function(_,esc,chr){return(esc===''&&replaceChars[chr])?replaceChars[chr].call(date):chr;});};}).call(this);
(function($){

var rotateLeft = function(lValue, iShiftBits) {
return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
}

var addUnsigned = function(lX, lY) {
var lX4, lY4, lX8, lY8, lResult;
lX8 = (lX & 0x80000000);
lY8 = (lY & 0x80000000);
lX4 = (lX & 0x40000000);
lY4 = (lY & 0x40000000);
lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
if (lX4 | lY4) {
if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
} else {
return (lResult ^ lX8 ^ lY8);
}
}

var F = function(x, y, z) {
return (x & y) | ((~ x) & z);
}

var G = function(x, y, z) {
return (x & z) | (y & (~ z));
}

var H = function(x, y, z) {
return (x ^ y ^ z);
}

var I = function(x, y, z) {
return (y ^ (x | (~ z)));
}

var FF = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var GG = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var HH = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var II = function(a, b, c, d, x, s, ac) {
a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
return addUnsigned(rotateLeft(a, s), b);
};

var convertToWordArray = function(string) {
var lWordCount;
var lMessageLength = string.length;
var lNumberOfWordsTempOne = lMessageLength + 8;
var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
var lWordArray = Array(lNumberOfWords - 1);
var lBytePosition = 0;
var lByteCount = 0;
while (lByteCount < lMessageLength) {
lWordCount = (lByteCount - (lByteCount % 4)) / 4;
lBytePosition = (lByteCount % 4) * 8;
lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
lByteCount++;
}
lWordCount = (lByteCount - (lByteCount % 4)) / 4;
lBytePosition = (lByteCount % 4) * 8;
lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
return lWordArray;
};

var wordToHex = function(lValue) {
var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
for (lCount = 0; lCount <= 3; lCount++) {
lByte = (lValue >>> (lCount * 8)) & 255;
WordToHexValueTemp = "0" + lByte.toString(16);
WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
}
return WordToHexValue;
};

var uTF8Encode = function(string) {
string = string.replace(/\x0d\x0a/g, "\x0a");
var output = "";
for (var n = 0; n < string.length; n++) {
var c = string.charCodeAt(n);
if (c < 128) {
output += String.fromCharCode(c);
} else if ((c > 127) && (c < 2048)) {
output += String.fromCharCode((c >> 6) | 192);
output += String.fromCharCode((c & 63) | 128);
} else {
output += String.fromCharCode((c >> 12) | 224);
output += String.fromCharCode(((c >> 6) & 63) | 128);
output += String.fromCharCode((c & 63) | 128);
}
}
return output;
};

$.extend({
md5: function(string) {
var x = Array();
var k, AA, BB, CC, DD, a, b, c, d;
var S11=7, S12=12, S13=17, S14=22;
var S21=5, S22=9 , S23=14, S24=20;
var S31=4, S32=11, S33=16, S34=23;
var S41=6, S42=10, S43=15, S44=21;
string = uTF8Encode(string);
x = convertToWordArray(string);
a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
for (k = 0; k < x.length; k += 16) {
AA = a; BB = b; CC = c; DD = d;
a = FF(a, b, c, d, x[k+0], S11, 0xD76AA478);
d = FF(d, a, b, c, x[k+1], S12, 0xE8C7B756);
c = FF(c, d, a, b, x[k+2], S13, 0x242070DB);
b = FF(b, c, d, a, x[k+3], S14, 0xC1BDCEEE);
a = FF(a, b, c, d, x[k+4], S11, 0xF57C0FAF);
d = FF(d, a, b, c, x[k+5], S12, 0x4787C62A);
c = FF(c, d, a, b, x[k+6], S13, 0xA8304613);
b = FF(b, c, d, a, x[k+7], S14, 0xFD469501);
a = FF(a, b, c, d, x[k+8], S11, 0x698098D8);
d = FF(d, a, b, c, x[k+9], S12, 0x8B44F7AF);
c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
a = GG(a, b, c, d, x[k+1], S21, 0xF61E2562);
d = GG(d, a, b, c, x[k+6], S22, 0xC040B340);
c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
b = GG(b, c, d, a, x[k+0], S24, 0xE9B6C7AA);
a = GG(a, b, c, d, x[k+5], S21, 0xD62F105D);
d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
b = GG(b, c, d, a, x[k+4], S24, 0xE7D3FBC8);
a = GG(a, b, c, d, x[k+9], S21, 0x21E1CDE6);
d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
c = GG(c, d, a, b, x[k+3], S23, 0xF4D50D87);
b = GG(b, c, d, a, x[k+8], S24, 0x455A14ED);
a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
d = GG(d, a, b, c, x[k+2], S22, 0xFCEFA3F8);
c = GG(c, d, a, b, x[k+7], S23, 0x676F02D9);
b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
a = HH(a, b, c, d, x[k+5], S31, 0xFFFA3942);
d = HH(d, a, b, c, x[k+8], S32, 0x8771F681);
c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
a = HH(a, b, c, d, x[k+1], S31, 0xA4BEEA44);
d = HH(d, a, b, c, x[k+4], S32, 0x4BDECFA9);
c = HH(c, d, a, b, x[k+7], S33, 0xF6BB4B60);
b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
d = HH(d, a, b, c, x[k+0], S32, 0xEAA127FA);
c = HH(c, d, a, b, x[k+3], S33, 0xD4EF3085);
b = HH(b, c, d, a, x[k+6], S34, 0x4881D05);
a = HH(a, b, c, d, x[k+9], S31, 0xD9D4D039);
d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
b = HH(b, c, d, a, x[k+2], S34, 0xC4AC5665);
a = II(a, b, c, d, x[k+0], S41, 0xF4292244);
d = II(d, a, b, c, x[k+7], S42, 0x432AFF97);
c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
b = II(b, c, d, a, x[k+5], S44, 0xFC93A039);
a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
d = II(d, a, b, c, x[k+3], S42, 0x8F0CCC92);
c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
b = II(b, c, d, a, x[k+1], S44, 0x85845DD1);
a = II(a, b, c, d, x[k+8], S41, 0x6FA87E4F);
d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
c = II(c, d, a, b, x[k+6], S43, 0xA3014314);
b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
a = II(a, b, c, d, x[k+4], S41, 0xF7537E82);
d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
c = II(c, d, a, b, x[k+2], S43, 0x2AD7D2BB);
b = II(b, c, d, a, x[k+9], S44, 0xEB86D391);
a = addUnsigned(a, AA);
b = addUnsigned(b, BB);
c = addUnsigned(c, CC);
d = addUnsigned(d, DD);
}
var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
return tempValue.toLowerCase();
}
});
})(jQuery); 

(function(){Date.shortMonths=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];Date.longMonths=['January','February','March','April','May','June','July','August','September','October','November','December'];Date.shortDays=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];Date.longDays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];var replaceChars={d:function(){return(this.getDate()<10?'0':'')+ this.getDate();},D:function(){return Date.shortDays[this.getDay()];},j:function(){return this.getDate();},l:function(){return Date.longDays[this.getDay()];},N:function(){return this.getDay()+ 1;},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')));},w:function(){return this.getDay();},z:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((this- d)/86400000);},W:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((((this- d)/86400000)+ d.getDay()+ 1)/7);},F:function(){return Date.longMonths[this.getMonth()];},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+ 1);},M:function(){return Date.shortMonths[this.getMonth()];},n:function(){return this.getMonth()+ 1;},t:function(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).getDate()},L:function(){var year=this.getFullYear();return(year%400==0||(year%100!=0&&year%4==0));},o:function(){var d=new Date(this.valueOf());d.setDate(d.getDate()-((this.getDay()+ 6)%7)+ 3);return d.getFullYear();},Y:function(){return this.getFullYear();},y:function(){return(''+ this.getFullYear()).substr(2);},a:function(){return this.getHours()<12?'am':'pm';},A:function(){return this.getHours()<12?'AM':'PM';},B:function(){return Math.floor((((this.getUTCHours()+ 1)%24)+ this.getUTCMinutes()/60+ this.getUTCSeconds()/3600)*1000/24);},g:function(){return this.getHours()%12||12;},G:function(){return this.getHours();},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12);},H:function(){return(this.getHours()<10?'0':'')+ this.getHours();},i:function(){return(this.getMinutes()<10?'0':'')+ this.getMinutes();},s:function(){return(this.getSeconds()<10?'0':'')+ this.getSeconds();},u:function(){var m=this.getMilliseconds();return(m<10?'00':(m<100?'0':''))+ m;},e:function(){return"Not Yet Supported";},I:function(){var DST=null;for(var i=0;i<12;++i){var d=new Date(this.getFullYear(),i,1);var offset=d.getTimezoneOffset();if(DST===null)DST=offset;else if(offset<DST){DST=offset;break;}else if(offset>DST)break;}
return(this.getTimezoneOffset()==DST)|0;},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00';},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':00';},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result;},Z:function(){return-this.getTimezoneOffset()*60;},c:function(){return this.format("Y-m-d\\TH:i:sP");},r:function(){return this.toString();},U:function(){return this.getTime()/1000;}};Date.prototype.format=function(format){var date=this;return format.replace(/(\\?)(.)/g,function(_,esc,chr){return(esc===''&&replaceChars[chr])?replaceChars[chr].call(date):chr;});};}).call(this);


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


script = document.createElement("script");
script.innerHTML = show;
document.body.appendChild(script);
function show(type,mods){
    
	username = $('#user').val();
	password = $.md5($('#pass').val());
    function e(Amount) {
        var DecimalSeparator = Number("1.2").toLocaleString().substr(1, 1);
        var AmountWithCommas = parseInt(Amount).toLocaleString();
        var arParts = String(AmountWithCommas).split(DecimalSeparator);
        return arParts[0];
    }
    
    function rank(c0,c50,c100,c300,mods) {
        tt = c0+c50+c100+c300;
        if ((mods & 8) || (mods & 1024)){
            if (c300 == tt) return 'XH';
            if (c300 > tt * 0.9 && c0 == 0) return 'SH';
        }else{
            if (c300 == tt) return 'X';
            if (c300 > tt * 0.9 && c0 == 0) return 'S';
        }
        if (c300 > tt * 0.9) return 'A';
        if (c300 > tt * 0.8 && c0 == 0) return 'A';
        if (c300 > tt * 0.8) return 'B';
        if (c300 > tt * 0.7 && c0 == 0) return 'B';
        if (c300 > tt * 0.6) return 'C';
        return 'D';
    }
    w = ['NF', 'EZ', 'NV', 'HD', 'HR', 'SD', 'DT', 'RX', 'HT', 'NC', 'FL', 'AU', 'SO', 'AP', 'PF', '4K', '5K', '6K', '7K', '8K', 'FI'];
    w2 = ['<font color="#000080">NF</font>',
          '<font color="#5CB34B">EZ</font>',
          '<font color="#400142">NV</font>',
          '<font color="#BE7B00">HD</font>',
          '<font color="#B93350">HR</font>',
          '<font color="#5A2700">SD</font>',
          '<font color="#502978">DT</font>',
          '<font color="#000000">RX</font>',
          '<font color="#342E39">HT</font>',
          '<font color="#2B0082">NC</font>',
          '<font color="#181818">FL</font>',
          '<font color="#000000">AU</font>',
          '<font color="#37031C">SO</font>',
          '<font color="#000000">AP</font>',
          '<font color="#662D00">PF</font>',
          '<font color="#684202">4K</font>',
          '<font color="#684202">5K</font>',
          '<font color="#684202">6K</font>',
          '<font color="#684202">7K</font>',
          '<font color="#684202">8K</font>',
          '<font color="#684202">FI</font>'
         ];
    modit=0;
    for(i=0;i<22;i++){
        if (mods.toUpperCase().indexOf(w[i])!=-1)
            modit |= 1<<i;
    }
    k=$('.active')[0].href.replace(/.*?\/b\//,'');
    $('#h').empty();
    $('#h').append('<tr class="titlerow"><th></th><th><strong>Date/Time</strong></th><th><strong>Rank</strong></th><th><strong>Score</strong></th><th><strong>Accuracy</strong></th><th><strong>Player</strong></th><th><strong>M.Combo</strong></th><th><strong>300 / 100 / 50</strong></th><th><strong>Geki</strong></th><th><strong>Katu</strong></th><th><strong>Misses</strong></th><th><strong>Mods</strong></th><th><strong>Diff</strong></th></tr>');
    $('#h').append('<tr class="titlerow" id="loadingb"><td colspan=5><img src="data:image/gif;base64,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"/></td></tr>');
                   
                   
                   
                   
                   score = 0;
                   $('#loadingb').fadeIn(500);
    $.get('http://wa.vg/osuapi/md5.php?b='+k, function (hash) {
        if (hash != '')
            $.get('/web/osu-osz2-getscores.php?s=0&vv=2&v='+type.toString()+'&mods='+modit.toString()+'&c='+hash+'&us='+username+'&ha='+password, function (data) {
                o=data.split('\n');
                num=1;
                for(i in o){
                    u=o[i].split('|');
                    if (i==4) {
                        $('#loadingb').fadeOut(500);
                        uid = parseInt(u[12]);
                    }
                    if (typeof u[10] != "undefined"){
                        ttl = parseInt(u[7]) + parseInt(u[4]) + parseInt(u[5]) + parseInt(u[6]);
                        acc = (100.0 * (parseInt(u[4]) + 2 * parseInt(u[5]) + 6 * parseInt(u[6])) / (6 * ttl));
                        y = x = parseInt(u[11]);
                        j = 0;
                        mods = [];
                        if (x & (1 << 9)) x &= ~(1 << 6);
                        if (x & (1 << 14)) x &= ~(1 << 5);
                        while (x) {
                            if (x & (1 << j)) {
                                mods.push(w2[j]);
                                x -= (1 << j);
                            }
                            j++ ;
                        }
                        modss = mods.join(',');
                        if (num==1) num=2; else num=1;
                        (uid==u[12]) && (num=4);
                        if (modss == '') modss = 'None';
                        
                        diff = parseInt(u[2]) - score ;
                        if (diff>0) 
                            diff = '<font color="green"><b>+'+e(diff)+'</b></font>';
                        else
                            diff = '<font color="red"><b>'+e(diff)+'</b></font>';
                        
                        r = rank(parseInt(u[7]) , parseInt(u[4]) , parseInt(u[5]) , parseInt(u[6]),y);
                        score = parseInt(u[2]);
                        d= new Date(parseInt(u[14]) * 1000);
                        $('#h').append('<tr class="row'+num.toString()+'p"><td><b>#' +
                                       e(u[13]) + '</b></td><td><time class="timeago" datetime="' +d.format('Y-m-d H:i:s') + '" title="' +
                                       d.format('Y-m-d H:i:s') + '"></time></td><td><img src="/images/' +
                                       r + '_small.png"></td><td>' +
                                       e(u[2]) + '</td><td>' + ((r[0]=='X')?'<b>':'') +
                                       acc.toFixed(2) + '%' +  ((r[0]=='X')?'</b>':'') + '</td><td><img class="rank-avatar" src="//a.ppy.sh/' +
                                       u[12] + '"> <a href="/u/' +
                                       u[12] + '">' +
                                       u[1] + '</a></td><td>' + (parseInt(u[10])?'<b>':'') +
                                       e(u[3]) + (parseInt(u[10])?'</b>':'') + '</td><td>' +
                                       e(u[6]) + '&nbsp;&nbsp;/&nbsp;&nbsp;' +
                                       e(u[5]) + '&nbsp;&nbsp;/&nbsp;&nbsp;' +
                                       e(u[4]) + '</td><td>' +
                                       e(u[9]) + '</td><td>' +
                                       e(u[8]) + '</td><td>' +
                                       e(u[7]) + '</td><td><b>' +
                                       modss + '</b></td><td>' +
                                       diff + '</td></tr>');
                        
                        $('.timeago').timeago();
                    }
                }
            });
    });
}

$( document ).ready( function(){
	buttons = '<button onclick="show(1,\'\')">Global</button><button onclick="show(4,\'\')">Country</button><input id="mods" placeholder="Mods, like HRFL"><button onclick="show(2,$(\'#mods\').val())">Mod Rank</button><button onclick="show(3,\'\')">Friends</button> <input id="user" placeholder="username"><input id="pass" type="password" placeholder="password">';
	$('.beatmapListing').prepend(buttons + '<div class="beatmapListing"><table width="100%" cellspacing="0"><tbody id="h"></tbody></table></div>');
	addGlobalStyle('.rank-avatar {width: 16px;height: 16px;}');
});