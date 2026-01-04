// ==UserScript==
// @name         Google Images Blocklist
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Blocks domains from showing up on google images search results
// @author       Unnoen
// @match        https://www.google.ac/search?*tbm=isch*
// @match        https://www.google.ad/search?*tbm=isch*
// @match        https://www.google.ae/search?*tbm=isch*
// @match        https://www.google.com.af/search?*tbm=isch*
// @match        https://www.google.com.ag/search?*tbm=isch*
// @match        https://www.google.com.ai/search?*tbm=isch*
// @match        https://www.google.al/search?*tbm=isch*
// @match        https://www.google.am/search?*tbm=isch*
// @match        https://www.google.co.ao/search?*tbm=isch*
// @match        https://www.google.com.ar/search?*tbm=isch*
// @match        https://www.google.as/search?*tbm=isch*
// @match        https://www.google.at/search?*tbm=isch*
// @match        https://www.google.com.au/search?*tbm=isch*
// @match        https://www.google.az/search?*tbm=isch*
// @match        https://www.google.ba/search?*tbm=isch*
// @match        https://www.google.com.bd/search?*tbm=isch*
// @match        https://www.google.be/search?*tbm=isch*
// @match        https://www.google.bf/search?*tbm=isch*
// @match        https://www.google.bg/search?*tbm=isch*
// @match        https://www.google.com.bh/search?*tbm=isch*
// @match        https://www.google.bi/search?*tbm=isch*
// @match        https://www.google.bj/search?*tbm=isch*
// @match        https://www.google.com.bn/search?*tbm=isch*
// @match        https://www.google.com.bo/search?*tbm=isch*
// @match        https://www.google.com.br/search?*tbm=isch*
// @match        https://www.google.bs/search?*tbm=isch*
// @match        https://www.google.bt/search?*tbm=isch*
// @match        https://www.google.co.bw/search?*tbm=isch*
// @match        https://www.google.by/search?*tbm=isch*
// @match        https://www.google.com.bz/search?*tbm=isch*
// @match        https://www.google.ca/search?*tbm=isch*
// @match        https://www.google.com.kh/search?*tbm=isch*
// @match        https://www.google.cc/search?*tbm=isch*
// @match        https://www.google.cd/search?*tbm=isch*
// @match        https://www.google.cf/search?*tbm=isch*
// @match        https://www.google.cat/search?*tbm=isch*
// @match        https://www.google.cg/search?*tbm=isch*
// @match        https://www.google.ch/search?*tbm=isch*
// @match        https://www.google.ci/search?*tbm=isch*
// @match        https://www.google.co.ck/search?*tbm=isch*
// @match        https://www.google.cl/search?*tbm=isch*
// @match        https://www.google.cm/search?*tbm=isch*
// @match        https://www.google.cn/search?*tbm=isch*
// @match        https://www.google.com.co/search?*tbm=isch*
// @match        https://www.google.co.cr/search?*tbm=isch*
// @match        https://www.google.com.cu/search?*tbm=isch*
// @match        https://www.google.cv/search?*tbm=isch*
// @match        https://www.google.com.cy/search?*tbm=isch*
// @match        https://www.google.cz/search?*tbm=isch*
// @match        https://www.google.de/search?*tbm=isch*
// @match        https://www.google.dj/search?*tbm=isch*
// @match        https://www.google.dk/search?*tbm=isch*
// @match        https://www.google.dm/search?*tbm=isch*
// @match        https://www.google.com.do/search?*tbm=isch*
// @match        https://www.google.dz/search?*tbm=isch*
// @match        https://www.google.com.ec/search?*tbm=isch*
// @match        https://www.google.ee/search?*tbm=isch*
// @match        https://www.google.com.eg/search?*tbm=isch*
// @match        https://www.google.es/search?*tbm=isch*
// @match        https://www.google.com.et/search?*tbm=isch*
// @match        https://www.google.fi/search?*tbm=isch*
// @match        https://www.google.com.fj/search?*tbm=isch*
// @match        https://www.google.fm/search?*tbm=isch*
// @match        https://www.google.fr/search?*tbm=isch*
// @match        https://www.google.ga/search?*tbm=isch*
// @match        https://www.google.ge/search?*tbm=isch*
// @match        https://www.google.gf/search?*tbm=isch*
// @match        https://www.google.gg/search?*tbm=isch*
// @match        https://www.google.com.gh/search?*tbm=isch*
// @match        https://www.google.com.gi/search?*tbm=isch*
// @match        https://www.google.gl/search?*tbm=isch*
// @match        https://www.google.gm/search?*tbm=isch*
// @match        https://www.google.gp/search?*tbm=isch*
// @match        https://www.google.gr/search?*tbm=isch*
// @match        https://www.google.com.gt/search?*tbm=isch*
// @match        https://www.google.gy/search?*tbm=isch*
// @match        https://www.google.com.hk/search?*tbm=isch*
// @match        https://www.google.hn/search?*tbm=isch*
// @match        https://www.google.hr/search?*tbm=isch*
// @match        https://www.google.ht/search?*tbm=isch*
// @match        https://www.google.hu/search?*tbm=isch*
// @match        https://www.google.co.id/search?*tbm=isch*
// @match        https://www.google.iq/search?*tbm=isch*
// @match        https://www.google.ie/search?*tbm=isch*
// @match        https://www.google.co.il/search?*tbm=isch*
// @match        https://www.google.im/search?*tbm=isch*
// @match        https://www.google.co.in/search?*tbm=isch*
// @match        https://www.google.io/search?*tbm=isch*
// @match        https://www.google.is/search?*tbm=isch*
// @match        https://www.google.it/search?*tbm=isch*
// @match        https://www.google.je/search?*tbm=isch*
// @match        https://www.google.com.jm/search?*tbm=isch*
// @match        https://www.google.jo/search?*tbm=isch*
// @match        https://www.google.co.jp/search?*tbm=isch*
// @match        https://www.google.co.ke/search?*tbm=isch*
// @match        https://www.google.ki/search?*tbm=isch*
// @match        https://www.google.kg/search?*tbm=isch*
// @match        https://www.google.co.kr/search?*tbm=isch*
// @match        https://www.google.com.kw/search?*tbm=isch*
// @match        https://www.google.kz/search?*tbm=isch*
// @match        https://www.google.la/search?*tbm=isch*
// @match        https://www.google.com.lb/search?*tbm=isch*
// @match        https://www.google.com.lc/search?*tbm=isch*
// @match        https://www.google.li/search?*tbm=isch*
// @match        https://www.google.lk/search?*tbm=isch*
// @match        https://www.google.co.ls/search?*tbm=isch*
// @match        https://www.google.lt/search?*tbm=isch*
// @match        https://www.google.lu/search?*tbm=isch*
// @match        https://www.google.lv/search?*tbm=isch*
// @match        https://www.google.com.ly/search?*tbm=isch*
// @match        https://www.google.co.ma/search?*tbm=isch*
// @match        https://www.google.md/search?*tbm=isch*
// @match        https://www.google.me/search?*tbm=isch*
// @match        https://www.google.mg/search?*tbm=isch*
// @match        https://www.google.mk/search?*tbm=isch*
// @match        https://www.google.ml/search?*tbm=isch*
// @match        https://www.google.com.mm/search?*tbm=isch*
// @match        https://www.google.mn/search?*tbm=isch*
// @match        https://www.google.ms/search?*tbm=isch*
// @match        https://www.google.com.mt/search?*tbm=isch*
// @match        https://www.google.mu/search?*tbm=isch*
// @match        https://www.google.mv/search?*tbm=isch*
// @match        https://www.google.mw/search?*tbm=isch*
// @match        https://www.google.com.mx/search?*tbm=isch*
// @match        https://www.google.com.my/search?*tbm=isch*
// @match        https://www.google.co.mz/search?*tbm=isch*
// @match        https://www.google.com.na/search?*tbm=isch*
// @match        https://www.google.ne/search?*tbm=isch*
// @match        https://www.google.com.nf/search?*tbm=isch*
// @match        https://www.google.com.ng/search?*tbm=isch*
// @match        https://www.google.com.ni/search?*tbm=isch*
// @match        https://www.google.nl/search?*tbm=isch*
// @match        https://www.google.no/search?*tbm=isch*
// @match        https://www.google.com.np/search?*tbm=isch*
// @match        https://www.google.nr/search?*tbm=isch*
// @match        https://www.google.nu/search?*tbm=isch*
// @match        https://www.google.co.nz/search?*tbm=isch*
// @match        https://www.google.com.om/search?*tbm=isch*
// @match        https://www.google.com.pk/search?*tbm=isch*
// @match        https://www.google.com.pa/search?*tbm=isch*
// @match        https://www.google.com.pe/search?*tbm=isch*
// @match        https://www.google.com.ph/search?*tbm=isch*
// @match        https://www.google.pl/search?*tbm=isch*
// @match        https://www.google.com.pg/search?*tbm=isch*
// @match        https://www.google.pn/search?*tbm=isch*
// @match        https://www.google.com.pr/search?*tbm=isch*
// @match        https://www.google.ps/search?*tbm=isch*
// @match        https://www.google.pt/search?*tbm=isch*
// @match        https://www.google.com.py/search?*tbm=isch*
// @match        https://www.google.com.qa/search?*tbm=isch*
// @match        https://www.google.ro/search?*tbm=isch*
// @match        https://www.google.rs/search?*tbm=isch*
// @match        https://www.google.ru/search?*tbm=isch*
// @match        https://www.google.rw/search?*tbm=isch*
// @match        https://www.google.com.sa/search?*tbm=isch*
// @match        https://www.google.com.sb/search?*tbm=isch*
// @match        https://www.google.sc/search?*tbm=isch*
// @match        https://www.google.se/search?*tbm=isch*
// @match        https://www.google.com.sg/search?*tbm=isch*
// @match        https://www.google.sh/search?*tbm=isch*
// @match        https://www.google.si/search?*tbm=isch*
// @match        https://www.google.sk/search?*tbm=isch*
// @match        https://www.google.com.sl/search?*tbm=isch*
// @match        https://www.google.sn/search?*tbm=isch*
// @match        https://www.google.sm/search?*tbm=isch*
// @match        https://www.google.so/search?*tbm=isch*
// @match        https://www.google.st/search?*tbm=isch*
// @match        https://www.google.sr/search?*tbm=isch*
// @match        https://www.google.com.sv/search?*tbm=isch*
// @match        https://www.google.td/search?*tbm=isch*
// @match        https://www.google.tg/search?*tbm=isch*
// @match        https://www.google.co.th/search?*tbm=isch*
// @match        https://www.google.com.tj/search?*tbm=isch*
// @match        https://www.google.tk/search?*tbm=isch*
// @match        https://www.google.tl/search?*tbm=isch*
// @match        https://www.google.tm/search?*tbm=isch*
// @match        https://www.google.to/search?*tbm=isch*
// @match        https://www.google.tn/search?*tbm=isch*
// @match        https://www.google.com.tr/search?*tbm=isch*
// @match        https://www.google.tt/search?*tbm=isch*
// @match        https://www.google.com.tw/search?*tbm=isch*
// @match        https://www.google.co.tz/search?*tbm=isch*
// @match        https://www.google.com.ua/search?*tbm=isch*
// @match        https://www.google.co.ug/search?*tbm=isch*
// @match        https://www.google.co.uk/search?*tbm=isch*
// @match        https://www.google.com/search?*tbm=isch*
// @match        https://www.google.com.uy/search?*tbm=isch*
// @match        https://www.google.co.uz/search?*tbm=isch*
// @match        https://www.google.com.vc/search?*tbm=isch*
// @match        https://www.google.co.ve/search?*tbm=isch*
// @match        https://www.google.vg/search?*tbm=isch*
// @match        https://www.google.co.vi/search?*tbm=isch*
// @match        https://www.google.com.vn/search?*tbm=isch*
// @match        https://www.google.vu/search?*tbm=isch*
// @match        https://www.google.ws/search?*tbm=isch*
// @match        https://www.google.co.za/search?*tbm=isch*
// @match        https://www.google.co.zm/search?*tbm=isch*
// @match        https://www.google.co.zw/search?*tbm=isch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37739/Google%20Images%20Blocklist.user.js
// @updateURL https://update.greasyfork.org/scripts/37739/Google%20Images%20Blocklist.meta.js
// ==/UserScript==

/*  Enter the domains you want to block into the following list, enclosed in parentheses and separated by commas
    THIS BLOCKS ALL SUBDOMAINS ON THAT DOMAIN TOO (entering "example.com" blocks images on "img.example.com" too)
    pinterest domains are:
    "pinterest.com", "pinterest.co.uk"
*/

var blocked_domains = [
    "example1.com", "example2.com"
];

(function() {
    setInterval(function(){
        var imgWrapper = document.getElementById("rg").children[0];
        var maxSize = imgWrapper.children.length;
        for(var i = 0; i < maxSize;){
            if(typeof imgWrapper.children[i].getElementsByClassName("rg_meta notranslate")[0] !== "undefined"){
                var img_domain = JSON.parse(imgWrapper.children[i].getElementsByClassName("rg_meta notranslate")[0].innerText).isu;
                while(img_domain.indexOf(".") != img_domain.lastIndexOf(".")){
                    img_domain = img_domain.substring(img_domain.indexOf(".") + 1);
                }
                if(blocked_domains.includes(img_domain)){
                    maxSize--;
                    imgWrapper.removeChild(imgWrapper.children[i]);
                }else{
                    i++;
                }
            }else{
                i++;
            }
        }
    }, 2000);
})();