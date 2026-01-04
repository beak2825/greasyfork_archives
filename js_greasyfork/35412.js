// ==UserScript==
// @name viewZee
// @namespace rynee
// @author hugosoft
// @version 1.0
// @include http://www.munzee.com/*
// @include http://statzee.munzee.com/*
// @include https://www.munzee.com/*
// @include https://statzee.munzee.com/*
// @grant unsafeWindow
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @description Easily See Additional PLayer and Clan Stats
// @downloadURL https://update.greasyfork.org/scripts/35412/viewZee.user.js
// @updateURL https://update.greasyfork.org/scripts/35412/viewZee.meta.js
// ==/UserScript==
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function go() {
    var version = "1.7";

    var baseURL = "https://www.munzee.com";
    var playerStatsURL = "https://statzee.munzee.com/player/stats";

    var apiServer = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=";

    var mile2km = 1.60934;


    var statzeeIFrame = "callback=iframe";

    var currentURL = null;
    var username = null;
    var logonUsername = null;



    //QR-Code Generator:
    //https://github.com/jeromeetienne/jquery-qrcode
    (function(r){r.fn.qrcode=function(h){var s;function u(a){this.mode=s;this.data=a}function o(a,c){this.typeNumber=a;this.errorCorrectLevel=c;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[]}function q(a,c){if(void 0==a.length)throw Error(a.length+"/"+c);for(var d=0;d<a.length&&0==a[d];)d++;this.num=Array(a.length-d+c);for(var b=0;b<a.length-d;b++)this.num[b]=a[b+d]}function p(a,c){this.totalCount=a;this.dataCount=c}function t(){this.buffer=[];this.length=0}u.prototype={getLength:function(){return this.data.length},
write:function(a){for(var c=0;c<this.data.length;c++)a.put(this.data.charCodeAt(c),8)}};o.prototype={addData:function(a){this.dataList.push(new u(a));this.dataCache=null},isDark:function(a,c){if(0>a||this.moduleCount<=a||0>c||this.moduleCount<=c)throw Error(a+","+c);return this.modules[a][c]},getModuleCount:function(){return this.moduleCount},make:function(){if(1>this.typeNumber){for(var a=1,a=1;40>a;a++){for(var c=p.getRSBlocks(a,this.errorCorrectLevel),d=new t,b=0,e=0;e<c.length;e++)b+=c[e].dataCount;
for(e=0;e<this.dataList.length;e++)c=this.dataList[e],d.put(c.mode,4),d.put(c.getLength(),j.getLengthInBits(c.mode,a)),c.write(d);if(d.getLengthInBits()<=8*b)break}this.typeNumber=a}this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17;this.modules=Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=Array(this.moduleCount);for(var b=0;b<this.moduleCount;b++)this.modules[d][b]=null}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-
7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a,c);7<=this.typeNumber&&this.setupTypeNumber(a);null==this.dataCache&&(this.dataCache=o.createData(this.typeNumber,this.errorCorrectLevel,this.dataList));this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,c){for(var d=-1;7>=d;d++)if(!(-1>=a+d||this.moduleCount<=a+d))for(var b=-1;7>=b;b++)-1>=c+b||this.moduleCount<=c+b||(this.modules[a+d][c+b]=
0<=d&&6>=d&&(0==b||6==b)||0<=b&&6>=b&&(0==d||6==d)||2<=d&&4>=d&&2<=b&&4>=b?!0:!1)},getBestMaskPattern:function(){for(var a=0,c=0,d=0;8>d;d++){this.makeImpl(!0,d);var b=j.getLostPoint(this);if(0==d||a>b)a=b,c=d}return c},createMovieClip:function(a,c,d){a=a.createEmptyMovieClip(c,d);this.make();for(c=0;c<this.modules.length;c++)for(var d=1*c,b=0;b<this.modules[c].length;b++){var e=1*b;this.modules[c][b]&&(a.beginFill(0,100),a.moveTo(e,d),a.lineTo(e+1,d),a.lineTo(e+1,d+1),a.lineTo(e,d+1),a.endFill())}return a},
setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(a=8;a<this.moduleCount-8;a++)null==this.modules[6][a]&&(this.modules[6][a]=0==a%2)},setupPositionAdjustPattern:function(){for(var a=j.getPatternPosition(this.typeNumber),c=0;c<a.length;c++)for(var d=0;d<a.length;d++){var b=a[c],e=a[d];if(null==this.modules[b][e])for(var f=-2;2>=f;f++)for(var i=-2;2>=i;i++)this.modules[b+f][e+i]=-2==f||2==f||-2==i||2==i||0==f&&0==i?!0:!1}},setupTypeNumber:function(a){for(var c=
j.getBCHTypeNumber(this.typeNumber),d=0;18>d;d++){var b=!a&&1==(c>>d&1);this.modules[Math.floor(d/3)][d%3+this.moduleCount-8-3]=b}for(d=0;18>d;d++)b=!a&&1==(c>>d&1),this.modules[d%3+this.moduleCount-8-3][Math.floor(d/3)]=b},setupTypeInfo:function(a,c){for(var d=j.getBCHTypeInfo(this.errorCorrectLevel<<3|c),b=0;15>b;b++){var e=!a&&1==(d>>b&1);6>b?this.modules[b][8]=e:8>b?this.modules[b+1][8]=e:this.modules[this.moduleCount-15+b][8]=e}for(b=0;15>b;b++)e=!a&&1==(d>>b&1),8>b?this.modules[8][this.moduleCount-
b-1]=e:9>b?this.modules[8][15-b-1+1]=e:this.modules[8][15-b-1]=e;this.modules[this.moduleCount-8][8]=!a},mapData:function(a,c){for(var d=-1,b=this.moduleCount-1,e=7,f=0,i=this.moduleCount-1;0<i;i-=2)for(6==i&&i--;;){for(var g=0;2>g;g++)if(null==this.modules[b][i-g]){var n=!1;f<a.length&&(n=1==(a[f]>>>e&1));j.getMask(c,b,i-g)&&(n=!n);this.modules[b][i-g]=n;e--; -1==e&&(f++,e=7)}b+=d;if(0>b||this.moduleCount<=b){b-=d;d=-d;break}}}};o.PAD0=236;o.PAD1=17;o.createData=function(a,c,d){for(var c=p.getRSBlocks(a,
c),b=new t,e=0;e<d.length;e++){var f=d[e];b.put(f.mode,4);b.put(f.getLength(),j.getLengthInBits(f.mode,a));f.write(b)}for(e=a=0;e<c.length;e++)a+=c[e].dataCount;if(b.getLengthInBits()>8*a)throw Error("code length overflow. ("+b.getLengthInBits()+">"+8*a+")");for(b.getLengthInBits()+4<=8*a&&b.put(0,4);0!=b.getLengthInBits()%8;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*a);){b.put(o.PAD0,8);if(b.getLengthInBits()>=8*a)break;b.put(o.PAD1,8)}return o.createBytes(b,c)};o.createBytes=function(a,c){for(var d=
0,b=0,e=0,f=Array(c.length),i=Array(c.length),g=0;g<c.length;g++){var n=c[g].dataCount,h=c[g].totalCount-n,b=Math.max(b,n),e=Math.max(e,h);f[g]=Array(n);for(var k=0;k<f[g].length;k++)f[g][k]=255&a.buffer[k+d];d+=n;k=j.getErrorCorrectPolynomial(h);n=(new q(f[g],k.getLength()-1)).mod(k);i[g]=Array(k.getLength()-1);for(k=0;k<i[g].length;k++)h=k+n.getLength()-i[g].length,i[g][k]=0<=h?n.get(h):0}for(k=g=0;k<c.length;k++)g+=c[k].totalCount;d=Array(g);for(k=n=0;k<b;k++)for(g=0;g<c.length;g++)k<f[g].length&&
(d[n++]=f[g][k]);for(k=0;k<e;k++)for(g=0;g<c.length;g++)k<i[g].length&&(d[n++]=i[g][k]);return d};s=4;for(var j={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,
78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var c=a<<10;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G15);)c^=j.G15<<j.getBCHDigit(c)-j.getBCHDigit(j.G15);return(a<<10|c)^j.G15_MASK},getBCHTypeNumber:function(a){for(var c=a<<12;0<=j.getBCHDigit(c)-
j.getBCHDigit(j.G18);)c^=j.G18<<j.getBCHDigit(c)-j.getBCHDigit(j.G18);return a<<12|c},getBCHDigit:function(a){for(var c=0;0!=a;)c++,a>>>=1;return c},getPatternPosition:function(a){return j.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,c,d){switch(a){case 0:return 0==(c+d)%2;case 1:return 0==c%2;case 2:return 0==d%3;case 3:return 0==(c+d)%3;case 4:return 0==(Math.floor(c/2)+Math.floor(d/3))%2;case 5:return 0==c*d%2+c*d%3;case 6:return 0==(c*d%2+c*d%3)%2;case 7:return 0==(c*d%3+(c+d)%2)%2;default:throw Error("bad maskPattern:"+
a);}},getErrorCorrectPolynomial:function(a){for(var c=new q([1],0),d=0;d<a;d++)c=c.multiply(new q([1,l.gexp(d)],0));return c},getLengthInBits:function(a,c){if(1<=c&&10>c)switch(a){case 1:return 10;case 2:return 9;case s:return 8;case 8:return 8;default:throw Error("mode:"+a);}else if(27>c)switch(a){case 1:return 12;case 2:return 11;case s:return 16;case 8:return 10;default:throw Error("mode:"+a);}else if(41>c)switch(a){case 1:return 14;case 2:return 13;case s:return 16;case 8:return 12;default:throw Error("mode:"+
a);}else throw Error("type:"+c);},getLostPoint:function(a){for(var c=a.getModuleCount(),d=0,b=0;b<c;b++)for(var e=0;e<c;e++){for(var f=0,i=a.isDark(b,e),g=-1;1>=g;g++)if(!(0>b+g||c<=b+g))for(var h=-1;1>=h;h++)0>e+h||c<=e+h||0==g&&0==h||i==a.isDark(b+g,e+h)&&f++;5<f&&(d+=3+f-5)}for(b=0;b<c-1;b++)for(e=0;e<c-1;e++)if(f=0,a.isDark(b,e)&&f++,a.isDark(b+1,e)&&f++,a.isDark(b,e+1)&&f++,a.isDark(b+1,e+1)&&f++,0==f||4==f)d+=3;for(b=0;b<c;b++)for(e=0;e<c-6;e++)a.isDark(b,e)&&!a.isDark(b,e+1)&&a.isDark(b,e+
2)&&a.isDark(b,e+3)&&a.isDark(b,e+4)&&!a.isDark(b,e+5)&&a.isDark(b,e+6)&&(d+=40);for(e=0;e<c;e++)for(b=0;b<c-6;b++)a.isDark(b,e)&&!a.isDark(b+1,e)&&a.isDark(b+2,e)&&a.isDark(b+3,e)&&a.isDark(b+4,e)&&!a.isDark(b+5,e)&&a.isDark(b+6,e)&&(d+=40);for(e=f=0;e<c;e++)for(b=0;b<c;b++)a.isDark(b,e)&&f++;a=Math.abs(100*f/c/c-50)/5;return d+10*a}},l={glog:function(a){if(1>a)throw Error("glog("+a+")");return l.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;256<=a;)a-=255;return l.EXP_TABLE[a]},EXP_TABLE:Array(256),
LOG_TABLE:Array(256)},m=0;8>m;m++)l.EXP_TABLE[m]=1<<m;for(m=8;256>m;m++)l.EXP_TABLE[m]=l.EXP_TABLE[m-4]^l.EXP_TABLE[m-5]^l.EXP_TABLE[m-6]^l.EXP_TABLE[m-8];for(m=0;255>m;m++)l.LOG_TABLE[l.EXP_TABLE[m]]=m;q.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var c=Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++)for(var b=0;b<a.getLength();b++)c[d+b]^=l.gexp(l.glog(this.get(d))+l.glog(a.get(b)));return new q(c,0)},mod:function(a){if(0>
this.getLength()-a.getLength())return this;for(var c=l.glog(this.get(0))-l.glog(a.get(0)),d=Array(this.getLength()),b=0;b<this.getLength();b++)d[b]=this.get(b);for(b=0;b<a.getLength();b++)d[b]^=l.gexp(l.glog(a.get(b))+c);return(new q(d,0)).mod(a)}};p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],
[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,
116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,
43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,
3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,
55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,
45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];p.getRSBlocks=function(a,c){var d=p.getRsBlockTable(a,c);if(void 0==d)throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+c);for(var b=d.length/3,e=[],f=0;f<b;f++)for(var h=d[3*f+0],g=d[3*f+1],j=d[3*f+2],l=0;l<h;l++)e.push(new p(g,j));return e};p.getRsBlockTable=function(a,c){switch(c){case 1:return p.RS_BLOCK_TABLE[4*(a-1)+0];case 0:return p.RS_BLOCK_TABLE[4*(a-1)+1];case 3:return p.RS_BLOCK_TABLE[4*
(a-1)+2];case 2:return p.RS_BLOCK_TABLE[4*(a-1)+3]}};t.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,c){for(var d=0;d<c;d++)this.putBit(1==(a>>>c-d-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var c=Math.floor(this.length/8);this.buffer.length<=c&&this.buffer.push(0);a&&(this.buffer[c]|=128>>>this.length%8);this.length++}};"string"===typeof h&&(h={text:h});h=r.extend({},{render:"canvas",width:256,height:256,typeNumber:-1,
correctLevel:2,background:"#ffffff",foreground:"#000000"},h);return this.each(function(){var a;if("canvas"==h.render){a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();var c=document.createElement("canvas");c.width=h.width;c.height=h.height;for(var d=c.getContext("2d"),b=h.width/a.getModuleCount(),e=h.height/a.getModuleCount(),f=0;f<a.getModuleCount();f++)for(var i=0;i<a.getModuleCount();i++){d.fillStyle=a.isDark(f,i)?h.foreground:h.background;var g=Math.ceil((i+1)*b)-Math.floor(i*b),
j=Math.ceil((f+1)*b)-Math.floor(f*b);d.fillRect(Math.round(i*b),Math.round(f*e),g,j)}}else{a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();c=r("<table></table>").css("width",h.width+"px").css("height",h.height+"px").css("border","0px").css("border-collapse","collapse").css("background-color",h.background);d=h.width/a.getModuleCount();b=h.height/a.getModuleCount();for(e=0;e<a.getModuleCount();e++){f=r("<tr></tr>").css("height",b+"px").appendTo(c);for(i=0;i<a.getModuleCount();i++)r("<td></td>").css("width",
d+"px").css("background-color",a.isDark(e,i)?h.foreground:h.background).appendTo(f)}}a=c;jQuery(a).appendTo(this)})}})(jQuery);

    /**
     * is value numeric?
     */
    function isNumeric(val){
        return !isNaN(val);
    }

    console.log("viewZee Version: " + version);


    var mouseActionAllowed = true;
    var timeoutId;

    Number.decPoint = '.';
    Number.thousand_sep = ',';

    Number.prototype.format = function(k, fixLength) {
        if(!k) k = 0;
        var neu = '';
        var sign = this < 0 ? '-' : '';

        // Runden
        var f = Math.pow(10, k);
        var zahl = Math.abs(this);
        zahl = '' + parseInt(zahl * f + 0.5 ) / f ;

        // Komma ermittlen
        var idx = zahl.indexOf('.');
        // fehlende Nullen einfuegen
        if(fixLength && k) {
             zahl += (idx == -1 ? '.' : '' ) + f.toString().substring(1);
        }

        // Nachkommastellen ermittlen
        idx = zahl.indexOf('.');
        if(idx == -1) {
            idx = zahl.length;
        }
        else neu = Number.decPoint + zahl.substr(idx + 1, k);

        // Tausendertrennzeichen
        while(idx > 0) {
            if(idx - 3 > 0) {
            	neu = Number.thousand_sep + zahl.substring( idx - 3, idx) + neu;
            } else {
            	neu = zahl.substring(0, idx) + neu;
            }
            idx -= 3;
        }
        return sign + neu;
    };

    /**
     * endsWith
     */
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    /**
     * startsWith
     * */
    String.prototype.startsWith = function( prefix ) {
    	return this.substring( 0, prefix.length ) === prefix;
  	};

    /**
     * replaceAll
     */
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };

    /**
     * extract logonUsername from profile link
     * */
    function getLogonUsername() {
        try {
            //search menu (ul)
            var container = $($(".user-menu"));
            //first li
            container = $(container.children().first());
            //first a
            container = $(container.children().first());
            //attribute href
            container = container.attr('href');
            //console.log(container);
            //token with username in href
            var res = container.split("/");
            //console.log(res);
            var logonUsername = res[res.length-2];
            return logonUsername;
        } catch (e) {
            console.log(e);
        }
    }


    $(document).ready(function() {
        //checkForUpdate();
        currentURL = document.URL;
        if (!currentURL.endsWith("/")) {
            currentURL = currentURL + "/";
        }

        username = $(".avatar-username").text();
        if (username===undefined || username.length<1) {
            username = null;
        }

        logonUsername = getLogonUsername();
        if (logonUsername===undefined || logonUsername.length<1) {
            logonUsername = null;
        }

        //copy navigation to top
        if($( ".pager" )!==undefined && $( ".pager" ).length==1) {
            $( ".pager" ).clone().appendTo( ".page-header" );
        }

        //credits only currentUser=logonUser
        if (username!==null && logonUsername==username && currentURL.toLowerCase().endsWith(username.toLowerCase() + "/")) {
            appendCredits();
        }

        //append feed to user-details-page
        if (username!==null && currentURL.toLowerCase().endsWith(username.toLowerCase() + "/")) {
            appendUserFeed();
            if (logonUsername==username) {
            	countMaintenanceNeeded();
            }
            //appendClanInfos();
        }

        //append clan-menu to sub-menu if exists
        if (username!==null && $("#sub-menu")!==null) {
            appendMedals();
            appendClanMenu();
        }

        //count specials only on specials-page
        if (username!==null && currentURL.endsWith(username + "/specials/")) {
            countSpecials();
        }

        //count blasts
        if (username!==null && currentURL.endsWith(username + "/blasts/")) {
            enhanceBalasts($(this));
        }

        //battles of clan
        if (currentURL.indexOf("/clans/") != -1 && currentURL.endsWith("/results/")) {
			enhanceBattlesOfClan($(this));
        }

        //stats of clan
        /*if (currentURL.indexOf("/clans/") != -1 && currentURL.endsWith("/stats/")) {
            readJsonRequirementsAndShowStats();
        }*/


        //append menu item for clan comparison
        if (currentURL.indexOf("/clans/") != -1 && !currentURL.endsWith("/clans/")) {
            appendClanComparisonLink();
        }

        //showQRcode
        if (currentURL.toLowerCase().endsWith("/admin/print/")) {
            if ($(".col-lg-12")!==undefined && $(".col-lg-12")[1]!==undefined) {
                var container = $($(".col-lg-12")[1]);
                var idx = container.text().indexOf("http");
                var qrCode = container.text().substring(idx).trim();

				//Link to API-Server
                container.html(container.html() + "<p><a href='" + apiServer + qrCode + "' target='_blank'>" + qrCode + "</a></p>");

                //container for qr
                container.append('<div id="output"></div>');
                //generate qr
                $("#output").qrcode(qrCode);
            }
        }

        //convert miles to km
        var fitbitLeaderboardURL = baseURL + "/leaderboard/fitbit/";
        var kennelLeaderboardURL = baseURL + "/leaderboard/rovers/";
        var kennelTransportedURL = baseURL + "/m/" + username + "/kennel/transported/";
        var kennelPackURL = baseURL + "/m/" + username + "/kennel/";

        //leaderboard fitbit
		if (currentURL.endsWith(fitbitLeaderboardURL)) {
            $(".panel tr").each(function () {
                $(this).find('td').each (function(index) {
                    if (index==2 || index==3) {
                        $(this).html($(this).text() + '<br>' + toKM($(this).text(), true));
                    }
				});
            });
		}

        //transported rover
        if (currentURL.startsWith(kennelTransportedURL)) {
            $(".table tr").each(function () {
                $(this).find('td').each (function(index) {
                    if (index==1 || index==2) {
                        $(this).html($(this).text() + ' mi<br>' + toKM($(this).text(), false));
                    }
				});
            });
        } else if (currentURL.startsWith(kennelPackURL)) {
            //kennel
            $(".table tr").each(function () {
                $(this).find('td').each (function(index) {
                    if (index==1) {
                        $(this).html($(this).text() + ' mi<br>' + toKM($(this).text(), false));
                    }
				});
            });
        }

        //leaderboard rover
        if (currentURL.endsWith(kennelLeaderboardURL)) {
            $(".table tr").each(function () {
                $(this).find('td').each (function(index) {
                    if (index==2) {
                        $(this).html($(this).text() + ' mi<br>' + toKM($(this).text(), false));
                    }
				});
            });
        }

        //tooltips
        /*$( "a" ).mouseover(function(event) {
            if (mouseActionAllowed) {
                mouseActionAllowed = false;
                mouseOverAnchor($(this), event);
            } else {
                console.log("wait" + $(this).attr("href"));
            }
        }) .mouseout(function() {
            $( 'div.mytooltip' ).hide();
            $( 'div.mytooltip' ).remove();
            //console.log(document.querySelectorAll('body .mytooltip').length);
        });*/
    });

/*
    function mouseOverAnchor(element, event) {
        try {
            //if (!timeoutId) {
            //    timeoutId = window.setTimeout(function() {
                    //timeoutId = null;

                    var url = element.attr("href");
                    if (url.indexOf("/m/") >= 0) {
                        var arr = url.split('/');
                        //console.log(arr);
                        if (arr.length==5 && arr[1]=='m' && isNumeric(arr[3])) {
                            console.log("munzee:: " + url);
                            createTooltip(event, url);
                        }
                        if (arr.length==4 && arr[1]=='m' && arr[3]=="") {
                            //console.log("player:: " + url);
                            createTooltip(event, url);
                        }
                    }
            //    }, 100);
            //}
         } catch(err) {
            console.log("ERROR:: " + err.message);
         }
    }

    function createTooltip(event, url) {
        $('<div class="mytooltip">loading... (' + baseURL + url + ')</div>').appendTo('body');
        positionTooltip(event);
        $.ajax({
            url: url,
            //invokeData: clanContainer,
            success: function(data){
                var isHidden = $('div.mytooltip').is(':hidden');
                if (!isHidden) {
                    var content="<ul>";
                    $(data).find(".user-stat").each(function(index) {
                        content += "<li>" + $( this ).text() + "</li>";
                    });
                    content += "</ul>"
                    $('div.mytooltip').html(content);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            },
            complete: function(data) {
                clearTimeout(timeoutId);
                console.log("ready for next");
                mouseActionAllowed=true;
            }
        }); //$.ajax
    }
*/
    function positionTooltip(event){
        var tPosX = event.pageX + 15;
        var tPosY = event.pageY + 15;
        $('div.mytooltip').css({'position': 'absolute', 'top': tPosY, 'left': tPosX, 'background-color' : 'White', 'z-index' : '1001', 'border': '2px solid #016930', 'border-radius': '15px', 'padding': '10px'});
    }


    /** summiere scores */
    function sumTable(arr) {
        var rc = 0;
        $.each(arr, function( index, value ) {
            score = Number(value.score.replaceAll(",", ""));
            rc += score;
		});
        return rc;
    }

    /**
     * remove all letters etc.
     * */
    function toNumber(value) {
        value = value.replace(/[A-Za-z$-]/g, "");
        value = value.replaceAll(",", "");
        value = value.replaceAll("#", "");
        return value;
    }

    /**
     * convert mile->km
     * */
    function toKM(value, decimalPlace) {
        value = value.replace(/[A-Za-z$-]/g, "");
        value = value.replaceAll(",", "");
        if (isNumeric(value.trim())) {
            value = value*mile2km;
            if (decimalPlace) {
            	value = Math.round(value * 100) / 100;
                value = value.format(2,true);
            } else {
                value = Math.round(value);
                value = value.format(0,false);
            }
        }
        return value + ' km';
    }


    /**
     * enhance BattlesOfClan page
     * sum, min, max, avg
     * */
    function enhanceBattlesOfClan(page) {
        var results = page.find(".table");
        var sumCapturePoints=0;
        var sumDeployPoints=0;
        var sumCaptureOnPoints=0;
        var sumTotalPoints=0;

        var maxCapturePoints = Number.MIN_VALUE;
        var maxDeployPoints = Number.MIN_VALUE;
        var maxCaptureOnPoints = Number.MIN_VALUE;
        var maxTotalPoints = Number.MIN_VALUE;

        var minPos = Number.MAX_VALUE;
        var maxPos = Number.MIN_VALUE;

        var iAnzahl=-1;
        $(results).find('tr').each(function (i, row) {
            iAnzahl++;
            $(row).find('td').each(function (j, col) {
                //show date
                if(j==0) {
                    var datum = $(col).children().first().attr('data-original-title');
                    $(col).children().first().html($(col).children().first().html()+ "<br/>" + datum).change();
                    //console.log($(col).children().first().html() + " " + datum);
                }
                if(j==2) {
                    var tokens = $(col).text().split("/");
                    var position = Number(toNumber(tokens[0]));
                    if (position < minPos) {minPos=position;}
                    if (position > maxPos) {maxPos=position;}
                }
                if(j==3) {
                    sumCapturePoints += Number(toNumber($(col).text()));
                    if (Number(toNumber($(col).text()))>maxCapturePoints) {maxCapturePoints=Number(toNumber($(col).text()));}
                }
                if(j==4) {
                    sumDeployPoints += Number(toNumber($(col).text()));
                    if (Number(toNumber($(col).text()))>maxDeployPoints) {maxDeployPoints=Number(toNumber($(col).text()));}
                }
                if(j==5) {
                    sumCaptureOnPoints += Number(toNumber($(col).text()));
                    if (Number(toNumber($(col).text()))>maxCaptureOnPoints) {maxCaptureOnPoints=Number(toNumber($(col).text()));}
                }
                if(j==6) {
                    sumTotalPoints += Number(toNumber($(col).text()));
                    if (Number(toNumber($(col).text()))>maxTotalPoints) {maxTotalPoints=Number(toNumber($(col).text()));}
                }
            });
        });

        if (iAnzahl>0) {
            $(results).append('<tr><td><b>Total: '+ iAnzahl +'</b></td>' +
                              '<td></td><td><b>best:' + minPos + '<br/>worst:' + maxPos + '</b></td>' +
                              '<td><b>'+ sumCapturePoints.format(0,false) + '<br/>Max:' + maxCapturePoints.format(0,false) + '<br/>Avg:' + (sumCapturePoints/iAnzahl).format(0,false) + '</b></td>' +
                              '<td><b>'+ sumDeployPoints.format(0,false) + '<br/>Max:' + maxDeployPoints.format(0,false) + '<br/>Avg:' + (sumDeployPoints/iAnzahl).format(0,false) + '</b></td>' +
                              '<td><b>'+ sumCaptureOnPoints.format(0,false) + '<br/>Max:' + maxCaptureOnPoints.format(0,false) + '<br/>Avg:' + (sumCaptureOnPoints/iAnzahl).format(0,false) + '</b></td>' +
                              '<td><b>'+ sumTotalPoints.format(0,false) + '<br/>Max:' + maxTotalPoints.format(0,false) + '<br/>Avg:' + (sumTotalPoints/iAnzahl).format(0,false) + '</b></td></tr>');
            //console.log(iAnzahl + " " + countCaptures + " " + countPoints);
            var medals = getMedals(page);
            medals = "<div style='float:right;padding-top:10px'>" + medals + "</div>";

            //($(results).parent()).append(medals);
            $(page).find(".avatar").parent().append(medals);
        }
    }

    /** count medals and return html-code for cups or best position*/
    function getMedals(page) {
        var badgeSuccess = page.find(".badge-success");
        var currentPos = 0;
        var maxClans = 0;
        if (badgeSuccess!=undefined && badgeSuccess!=null && badgeSuccess.length>1) {
            currentPos = ($((badgeSuccess)[0]).text());
            maxClans = ($((badgeSuccess)[1]).text());
        }

		var results = page.find(".table");
        var minPos = Number.MAX_VALUE;
        var maxPos = Number.MIN_VALUE;

        var countP1=0;
        var countP2=0;
        var countP3=0;
        var countParticipate=0;
        $(results).find('tr').each(function (i, row) {
            $(row).find('td').each(function (j, col) {
                if(j==2) {
                    var inProgress = $(col).prev().hasClass( "shadow" );
                    if (!inProgress) {
                        var tokens = $(col).text().split("/");
                        var position = Number(toNumber(tokens[0]));
                        if (position < minPos) {minPos=position;}
                        if (position > maxPos) {maxPos=position;}
                        if (position==1) {countP1++};
                        if (position==2) {countP2++};
                        if (position==3) {countP3++};
                        if (position>3) {countParticipate++;}
                    }
                }
            });
        });

		var imgURL = "https://munzee.global.ssl.fastly.net/images/site/clan";
        var medals = '<div style="text-align:center;width:200px">';
        if (countP1>0)
            medals += '<div style="float:left"><img src="' + imgURL + '/1st.png" width=40 height=40><br><small>'+countP1+'</small></div>';
        if (countP2>0)
            medals += '<div style="float:left"><img src="' + imgURL + '/2nd.png" width=40 height=40><br><small>'+countP2+'</small></div>';
        if (countP3>0)
            medals += '<div style="float:left"><img src="' + imgURL + '/3rd.png" width=40 height=40><br><small>'+countP3+'</small></div>';
        if (countParticipate>0)
            medals += '<div style="float:left"><img src="' + imgURL + '/participate.png" width=40 height=40><br><small>'+countParticipate+'</small></div>';
        if (currentPos>0 && maxClans>0) {
            medals +="<div style='clear:both;text-align:left'>current battle:" + currentPos + " / " + maxClans + "</div>";
        }
		medals +="</div>";

        return medals;
    }

    /**
     * enhance blasts page
     * sum, min, max, avg and Date
     * */
    function enhanceBalasts(page) {
        var minCaps=Number.MAX_VALUE;
        var minPoints=Number.MAX_VALUE;

        var maxCaps=Number.MIN_VALUE;
        var maxPoints=Number.MIN_VALUE;

        var countCaptures = 0;
        var countPoints = 0;
        var iAnzahl = -1;
        //get dom of div of blasts-table
        var blasts = page.find("#munzee-holder");
        //the blasts-table
        blasts = blasts.children().first();
        $(blasts).find('tr').each(function (i, row) {
            iAnzahl++;
            $(row).find('td').each(function (j, col) {
                //show date
                if(j==0) {
                    var datum = $(col).children().first().attr('title');
                    $(col).children().first().text($(col).children().first().text()+ " (" + datum + ")").change();
                    //console.log($(col).children().first().text() + " " + datum);
                }

                //count captures
                if(j==1) {
                    var val=$(col).text();
                    if (isNumeric(val)) {
                        val = Number(val);
                        countCaptures+=val;
                        if (val<minCaps) minCaps=val;
                        if (val>maxCaps) maxCaps=val;
                    }
                }

                //count points
                if(j==2) {
                    var val=$(col).text();
                    if (isNumeric(val)) {
                        val = Number(val);
                        countPoints+=val;
                        if (val<minPoints) minPoints=val;
                        if (val>maxPoints) maxPoints=val;
                    }
                }
            });
        });

        if (iAnzahl>0) {
            blasts.append('<tr><td><b>Total: '+ iAnzahl +'</b></td>' +
                          '<td><b>'+ countCaptures +'<br/>min: '+ minCaps + ' max: ' +maxCaps + ' avg: ' + Math.round(countCaptures/iAnzahl) + '</b></td>' +
                          '<td><b>'+ countPoints +'<br/>min: '+ minPoints + ' max: '+ maxPoints + ' avg: ' + Math.round(countPoints/iAnzahl) + '</b></td></tr>');
            //console.log(iAnzahl + " " + countCaptures + " " + countPoints);
        }
    }

    /**
     * new Menu-Item: Compare Clam Member
     * */
    function appendClanComparisonLink() {
        //first h2 is clanname, id would be nice ;-)
        var clanName = $($("h2").get()[0]).text();
        var playersURL = "http://statzee.munzee.com/player/stats";
        var playersFound = false;
        $(".table").find("a").each(function( index ) {
            //console.log($(this).text());
            if ($(this).text().length>0 && !$(this).text().startsWith('#')) {
                //console.log( index + ": " + $(this).text().trim() );
                playersURL = playersURL + "/" + $(this).text().trim();
                playersFound = true;
            }
        });
        if (playersFound) {
            //$(".navbar-nav")
            $($($("#sub-menu")).find(".navbar-nav")).append('<li><a href="' + playersURL + '" target="_blank">Compare Players</a>');
        }
    }


    /**
     * append Medals to page
     * */
    function appendMedals() {
		var clanContainer = $($("h2").get()[1]);
        if (clanContainer!==undefined && clanContainer!==null) {
            var clanURL = $(clanContainer.html()).get()[3];
            var clanName = $(clanURL).text();
            var url =  $(clanURL).attr('href') + "results/";
            //invokeData just a param for anonymous success function
            $.ajax({
                url: url,
                invokeData: clanContainer,
                success: function(data){
                    var medals = getMedals($(data));
                    $(this.invokeData).parent().append(medals);
                }
            }); //$.ajax
        }
    }

    /**
     * new Menu incl. SubMenu for Clan Details of User
     * */
    function appendClanMenu() {
        var clanURL = $($("h2").get()[1]).html();
        if (clanURL!==undefined && clanURL!==null) {
            clanURL = $(clanURL).get()[3];
            var clanName = $(clanURL).text();
            clanURL =  $(clanURL).attr('href');
            //console.log(clanName);
            clanName = clanName.trim();
            var subMenuClans;
            /*
            subMenuClans =  '<li class="dropdown"><a class="dropdown-toggle " data-toggle="dropdown">Clan<b class="caret"></b></a>';
            subMenuClans += '     <ul class="dropdown-menu"><li><a href="/clans/" target="_blank">Central</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + '" target="_blank">' + clanName + '</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'feed/" target="_blank">Feed</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'results/" target="_blank">Results</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'stats/" target="_blank">Stats</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'messages/" target="_blank">Messages</a></li>';
            subMenuClans += '     </ul>';
            subMenuClans += '</li>';
            $($($("#sub-menu")).find(".navbar-nav")).append(subMenuClans);
            */
            subMenuClans =  '<li class="dropdown">';
            subMenuClans += '     <a data-toggle="dropdown" class="dropdown-toggle">';
            subMenuClans += '     <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAXCAMAAABd273TAAAAB3RJTUUH4AoWCTYAY58LOgAAAAlwSFlzAAALEgAACxIB0t1+/AAAAwBQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdqYJtgAAAAF0Uk5TAEDm2GYAAABtSURBVHjalZLRDYAwCEQZz/jhEK4oA2qIIhxXsfxwzbuUQhF5QxVFDtUbuKjcgAvGL+Ci4eB4qETXsH59B/DiQI53VJ4dlg+sHxyW9g9DFhtrJDhW3qgflp+DkOEo08DZZ0x95/TC9CvXLy2PE0jd9IrYpZ0hAAAAAElFTkSuQmCC" title="Clan ' + clanName + '" /> <i class="fa fa-caret-down"></i>';
            subMenuClans += '     </a>';
            subMenuClans += '     <ul class="dropdown-menu">';
            subMenuClans += '        <li><a href="/clans/" target="_blank">Central</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + '" target="_blank">' + clanName + '</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'feed/" target="_blank">Feed</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'results/" target="_blank">Results</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'stats/" target="_blank">Stats</a></li>';
            subMenuClans += '        <li><a href="' + clanURL + 'messages/" target="_blank">Messages</a></li>';

            //subMenuClans += '        <li class="divider"></li>';
            //subMenuClans += '        <li><a href="https://munzee.ruja.dk/stats/?' + clanName + '" target="_blank">ruja (external link)</a></li>';
            //subMenuClans += '        <li><a href="http://eeznum.co.uk/clans/medals.php" target="_blank">eeznum (external link)</a></li>';

            subMenuClans += '      </ul>';
            subMenuClans += '    </li>';
            subMenuClans += '</li>';

            $($($(".navbar-fixed-top")).find(".navbar-right")).append(subMenuClans);
        }
    }






    /**
     * count specials
     */
    function countSpecials() {
        var container = $(".specials-count").get();
        var specials = $(container).find(".badge");

        var sum=0;

        var differentSpecials = 0;

        //inspect each section
        for ( var i = 0; i < specials.length; i++ ) {
            var val = $(specials[i]).text();
            //console.log($(specials[i]).text());
            if (isNumeric(val)) {
                sum+=Number(val);
                differentSpecials+=1;
            }
        }
        //append sum
        $('.page-header').children().append('<small> - Total:'+sum+'</small> <small>Types:' + differentSpecials + '</small>');
    } // countSpecials




    /**
     * count Maintenance, append Menu-Item
     * */
    function countMaintenanceNeeded() {
        var maintenanceURL = new String(document.URL);
        if (!maintenanceURL.endsWith("/")) {
            maintenanceURL += "/maintenance/";
        } else {
            maintenanceURL += "maintenance/";
        }
		$.ajax({
            url: maintenanceURL,
            success: function(data){
                //get dom of maintenance
                var maintenance = $(data).find("#munzee-holder");
                var specials = $(maintenance).find(".munzee-name");
                var anzahl = specials.length;
                var replaced = $("#sub-menu").html().replace('Maintenance Needed','Maintenance (' + anzahl + ')');
				$("#sub-menu").html(replaced).change();
                //console.log(replaced);
            }
        }); //$.ajax
    }

    /**
     * show Credits on User-Page
     * */
    function appendCredits() {
        var creditsURL = new String(baseURL + "/credits/");
        //read credits using ajax
        $.ajax({
            url: creditsURL,
            success: function(data){
                //get dom of credits
                var credits = $(data).find("#munzee-holder");

                var creditsHtml = $(credits).html();
                //some replacements
                creditsHtml = creditsHtml.replaceAll("col-lg-2","col-lg-1");
                creditsHtml = creditsHtml.replaceAll("<h3",'<div style="width:30px; padding-top:5px; text-align: center; font-size: 12px"');
                creditsHtml = creditsHtml.replaceAll("</h3","</div");
                creditsHtml = '<ul class="list-inline tooltip-holder text-center">' + creditsHtml + '</ul>';
                creditsHtml = '<div class="clearfix"></div> <div class="panel-heading" style="margin:15px;background-color:#333">Credits for ' + logonUsername + '</div><div style="margin:30px">' + creditsHtml + '</div>'; 

                //append credits in new container
                $($(".col-md-12")[2]).append( creditsHtml ).change();
            }
        }); //$.ajax
    }



    /**
     * append User Feed on User-Page
     */
    function appendUserFeed() {
        var feedURL = new String(document.URL);
        if (!feedURL.endsWith("/")) {
            feedURL += "/feed";
        } else {
            feedURL += "feed";
        }
        //console.log(feedURL);

        //read feed using ajax
        $.ajax({
            url: feedURL,
            success: function(data){
                //get dom of user-feed
                var feed = $(data).find("#user-feed");

                //replace timings using original function
                $(feed).find('.captured-at').each(function( index ) {
                    $(this).html( moment( $(this).data('captured-at') ).fromNow( ) );
                });
                $(feed).find('.wrote-at').each(function( index ) {
                    $(this).html( moment( $(this).data('wrote-at') ).fromNow( ) );
                });
                $(feed).find('.deployed-at').each(function( index ) {
                    $(this).html( moment( $(this).data('deployed-at') ).fromNow( ) );
                });
                $(feed).find('.last-updated-at').each(function( index ) {
                    $(this).html( moment( $(this).data('last-updated-at') ).fromNow( ) );
                });


                $(feed).find(".page-header").remove();
                var feedHtml = $(feed).html();

                //pin-size
                feedHtml = feedHtml.replaceAll('class="pin"','class="pin" style="width:64px"');
                feedHtml = feedHtml.replaceAll('<div class="subtext deploytext pin-holder pull-left hidden-xs">', '<div class="subtext deploytext pin-holder pull-left hidden-xs" style="padding-top:0px">');

                //new header
                tableHeader = "Activity Feed latest activities for " + username;
                feedHtml = '<div class="clearfix"></div> <div class="panel-heading" style="margin:15px;background-color:#333">' + tableHeader + '</div><div style="margin:30px">' + feedHtml + '</div>'; 

                //append user-feed in new container
                $($(".col-md-12")[2]).append(feedHtml).change();

                //$($(".col-md-12")[2]).append('<div class="panel-heading" style="margin:15px;background-color:#333">Extended Stats for ' + username + '</div>');
                //$($(".col-md-12")[2]).append('<iframe id="iframe" src="http://statzee.munzee.com/player/stats/' + username + '/?' + statzeeIFrame + '" style="border:none;width:100%;height:500px"></iframe>');
                //console.log($('#iframe').contents().find('html').html());

                //mouseover for new links
                /*$( "a" ).mouseover(function(event) {
                    if (mouseActionAllowed) {
                        mouseActionAllowed = false;
                        mouseOverAnchor($(this), event);
                    } else {
                        console.log("wait" + $(this).attr("href"));
                    }
                }) .mouseout(function() {
                    $( 'div.mytooltip' ).hide();
                    $( 'div.mytooltip' ).remove();
                    //console.log(document.querySelectorAll('body .mytooltip').length);
                });*/
            }
        }); //$.ajax
    }



    /**
     * append clan Infos
     * @deprecated
     */
    function appendClanInfos() {
        //console.log($(".clan").find('a')[0]);
        if ($(".clan").find('a')[0]!=null) {
            var clanAnchor = $($(".clan").find('a')[0]);
            var clanURL = baseURL + $(clanAnchor).attr('href');
            //console.log(clanURL);
            var clanName = $(clanAnchor).text();
            $.ajax({
                url: clanURL,
                success: function(data){
                    //get dom of clan-page
                    var clanData = $(data).find(".row")[2];
                    var clandDataHtml = $(clanData).html();
                    clandDataHtml = clandDataHtml.replaceAll('Clan Weapons', 'Clan ' + clanName + '<br>Weapons');
                    $($(".col-md-12")[2]).append(clandDataHtml);

                    //console.log($("#weappons"));
                    appendUserFeed();
                    //console.log(clanData);
                }
            }); //$.ajax
        } else {
            appendUserFeed();
        }
    }

} // end go



// jQuery workaround for Chrome
// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
}
// load jQuery and execute
addJQuery(go);