// ==UserScript==
// @name         Better Classroom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dark Mode, Show Hide Class, more update soon...
// @author       Rafif
// @match        *://classroom.google.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/439846/Better%20Classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/439846/Better%20Classroom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var darkstyle= `:root{color-scheme: dark} body { background: #2c2c2c; color: #fff; }  /* help btn */ .K2mXPb { color: #fff; fill: #fff; }  /* links */ a { color: dodgerblue; } a:visited { color: mediumorchid; }  /* top bar */ .joJglb { background: #3c3c3c; border-bottom: none; } .joJglb, .joJglb.kLHn3 { box-shadow: 0px 0px 6px 4px rgba(28, 28, 28, .4); }  /* google apps */ .gb_qa svg, .gb_C[aria-expanded=\'true\'] .gb_Ve { fill: #fff; }  /* icons */ .IqJTee, .ViCi4, .xSP5ic, .cjq2Db { color: #fff; }  /* classroom elems */ .Aopndd { background: #3c3c3c; border-color: #5c5c5c; } .SZ0kZe { border-top: none !important; } .apFsO.onkcGd, .apFsO.onkcGd:visited { color: #fff; } .oBSRLe { color: #fff; } .JPdR6b { background: #3c3c3c; box-shadow: 0px 0px 2px 1px rgba(28, 28, 28, .4); }  /* nav menu */ .asQXV { color: #fff; } .dDKhVc, .iLjzDc { color: #afafaf; } .kCtYwe { border-color: #4c4c4c !important; } .ETRkCe { background-color: #3c3c3c !important; } .DShyMc-AaTFfe .Xi8cpb.qs41qe .LlcfK, .bFjUmb-Ysl7Fe, .VUoKZ { background-color: #4c4c4c !important; } .Xi8cpb:hover .LlcfK { background-color: rgba(76, 76, 76, .5) !important; }  /* calendar */ .Evt7cb, .Evt7cb:visited, .fKz7Od .TpQm9d { color: #fff !important; } .BOW64 { border-color: #5c5c5c !important; } .wQuPk .JsqLM.N4XV7d { color: #afafaf !important; } .ybOdnf .OA0qNb .LMgvRb[aria-selected=\'true\'] { background-color: rgba(76, 76, 76, .5) !important; } .ncFHed .MocG8c.KKjvXb { background-color: #4c4c4c !important; }  /* todo page */ .Xp0OCe, .ncFHed { background-color: #3c3c3c !important; } .Xp0OCe { border: none !important; } .HZ3kWc, .WOPwXe, .gJk24c, .asQXV-FGzYL { color: #fff; } .MHxtic:not(:last-child), .LKqFXc { border-color: #4c4c4c !important; } .MHxtic:hover { box-shadow: none !important; background-color: #4c4c4c; }  /* class page */ .d4Fe0d { background-color: #3c3c3c !important; border-color: #4c4c4c !important; } .EZrbnd, .A6dC2c, .O98Lj, .rpo4wf, .tLDEHd, .cSyPgb, .wZTANe .J1raN:hover, .udxSmc, .lziZub, .lziZub:visited { color: #fff !important; } .sdDCme, .K6Ovqd, .T8rTjd, .Lzdwhd-BrZSOd, .onkcGd, .onkcGd:visited, .wZTANe .J1raN { color: #ccc; } .VnOHwf-Tvm9db, .BEAGS:not(.RDPZE), .VnOHwf-Wvd9Cc, .CJXzee a:active, .CJXzee a:focus, .CJXzee a:hover, .sdDCme, .K6Ovqd, .vnnr5e .snByac, .vnnr5e .Aworge, .XpxsVb .Aworge, .UQuaGc, .wCDkmf, .ksaOtd { color: #fff !important; } .MymH0d:hover .VBEdtc-Wvd9Cc, .l3F1ye:not(.RDPZE), .IMvYId, .IMvYId:visited, .nRLOzd:hover, .nRLOzd:hover *, .O98Lj, .Lzdwhd-BrZSOd { color: #ccc !important; } .GWZ7yf, .hgjBDc, .vnnr5e .CIy9F, .qk0lee:focus::after { background-color: #3c3c3c !important; box-shadow: none !important; } .vnnr5e .I9OJHe { background-color: #3c3c3c !important; } .ndcsBf.cjzpkc-Wvd9Cc { border-color: #5c5c5c; } .Y5FYJe.RDPZE { fill: #ccc; color: #ccc; } .OZ6W0d:not(.RDPZE), .l3F1ye:not(.RDPZE) .TpQm9d, .wwnMtb:not(.RDPZE) { fill: #fff !important; color: #fff !important; } .ZoT1D:hover.idtp4e, .tUJKGd:not(.xp2dJ):not(.rZXyy):hover .idtp4e, .tUJKGd:not(.xp2dJ).ndcsBf .idtp4e, .V8apv, .P3W0Dd-Ysl7Fe:focus { background-color: #4c4c4c !important; } .Niache, .QTD2uf { border-color: #3c3c3c !important; } .UISY8d-Ysl7Fe:hover { background-color: #3c3c3c !important; color: #ccc; } .eumXzf:after { border-color: #fff !important; } .tUJKGd:not(:first-child), .ySjuvd .eqqrO, .s2g3Xd, .oleV8d, .ZNE4y, .PeGHgb.Q8U8uc .Ono85c+.oh9CFb, .O9YpHb, .u73Apc, .d6CWTd { border-color: #4c4c4c !important; } .lXuxY { -webkit-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75); -moz-box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75); box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75) } .BEAGS, .P02DYb, .ycbm1d { border-color: #4c4c4c !important; } .Y5sE8d:not(.RDPZE) { background-color: #2c2c2c !important; } .Y5sE8d:not(.RDPZE):hover { box-shadow: none !important; } .ksaOtd { color: #1e8e3e; } .uO32ac { border-color: #5c5c5c !important; } .uQ3ESd { background-color: #3c3c3c !important; }  /* dialog */ .iph-dialog { background-color: #4c4c4c !important; } .iph-dialog-title, .iph-dialog-content { color: #fff !important; }  /* join classroom */ .gKkZCe, .D3oBEe .n9IS1:before, .AeAAkf { border-color: #4c4c4c; } .D3oBEe .qTs5Xc { background-color: #3c3c3c; } .qTs5Xc, .poFWNe, .z3vRcc, .z80M1 { color: #fff; } .I7OXgf.ZEeHrd, .NZ9wdc, .i5sehe, .kox42c { background-color: #2c2c2c !important; }`;
    var elem = document.createElement('style');elem.innerText = darkstyle;elem.setAttribute("id", "darkmode");document.head.appendChild(elem);
    var customstyle= `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap');body{font-family: 'Poppins'}.classtoggle svg{ transform: rotate(180deg)}`;
    var cstyle = document.createElement('style');cstyle.innerText = customstyle;document.head.appendChild(cstyle);
    setInterval(function(){
       if (document.querySelector("#darktoggle") == null) {
           var x = '<a class="Xi8cpb cd29Sd" tabindex="-1" aria-label="';
           var y = ' Mode" role="menuitem" id="darktoggle" onclick=" var darkstyle = `'
           var z = '`;if(document.querySelector(`#darkmode`) == null){var dark = document.createElement(`style`);dark.innerText = darkstyle;dark.setAttribute(`id`, `darkmode`);document.head.appendChild(dark); $(`#darktoggle .kXvNXe div`).html(`Dark Mode`)}else{$(`#darkmode`).remove(); $(`#darktoggle .kXvNXe div`).html(`Light Mode`)}"><div class="LlcfK"><div class="p1KYTc"></div></div><div class="JDxyrc xSP5ic"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="24" height="24" class=" NMm5M" viewBox="0 0 384 512"><path d="M224 0H336C362.5 0 384 21.49 384 48V256H0V48C0 21.49 21.49 0 48 0H64L96 64L128 0H160L192 64L224 0zM384 288V320C384 355.3 355.3 384 320 384H256V448C256 483.3 227.3 512 192 512C156.7 512 128 483.3 128 448V384H64C28.65 384 0 355.3 0 320V288H384zM192 464C200.8 464 208 456.8 208 448C208 439.2 200.8 432 192 432C183.2 432 176 439.2 176 448C176 456.8 183.2 464 192 464z"/></svg></div><div class="kXvNXe"><div class="nhassd asQXV YVvGBb">';
           var v = 'Mode</div></div></a><li role="separator" class="VfPpkd-rymPhb-clz4Ic e6pQl yCa5be"></li>';
           if(document.querySelector(`#darkmode`) == null){
               $(".vhK44c .ETRkCe .OX4Vcb").prepend(x + 'Light' + y + darkstyle + z + 'Light ' + v);
           } else {
               $(".vhK44c .ETRkCe .OX4Vcb").prepend(x + 'Dark' + y + darkstyle + z + 'Dark ' + v);
           }
       }
       if (document.querySelector("#classtoggle") == null) {
           $('[role="section"] .pkktJb').attr("onclick", "$(this).toggleClass('classtoggle'); $('[role=\"section\"][aria-label]').children('a').toggle();");
           $('[role="section"] .pkktJb').css("cursor", "pointer");
           $('[role="section"][aria-label] .pkktJb').append('<svg id="classtoggle" focusable="false" width="24" height="24" viewBox="0 0 24 24" class=" NMm5M"><path d="M12 16.41l-6.71-6.7 1.42-1.42 5.29 5.3 5.29-5.3 1.42 1.42z"></path></svg>');
       }
    },0);
})();
