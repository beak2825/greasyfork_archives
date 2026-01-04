// ==UserScript==
// @name         Replace Footer for Vanced YouTube 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the footer on Vanced YouTube website.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471074/Replace%20Footer%20for%20Vanced%20YouTube%202.user.js
// @updateURL https://update.greasyfork.org/scripts/471074/Replace%20Footer%20for%20Vanced%20YouTube%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The new footer HTML you provided
    var newFooterHTML = '<div class="ctr-p" data-jiis="bp" id="footer"> <div id="footcnt"> <style>.fmulti{}._dQc{bottom:0;left:0;position:absolute;right:0}._GR{background:#f2f2f2;left:0;right:0;-webkit-text-size-adjust:none}.fbar p{display:inline}.fbar a,#fsettl{text-decoration:none;white-space:nowrap}.fbar{margin-left:-27px}._Gs{padding-left:27px;margin:0 !important}._eA{padding:0 !important;margin:0 !important}#fbarcnt{display:block}._E2 a:hover{text-decoration:underline}._HR img{margin-right:4px}._HR a,._GR #swml a{text-decoration:none}.fmulti{text-align:center}.fmulti #fsr{display:block;float:none}.fmulti #fuser{display:block;float:none}#fuserm{line-height:25px}#fsr{float:right;white-space:nowrap}#fsl{white-space:nowrap}#fsett{background:#fff;border:1px solid #999;bottom:30px;padding:10px 0;position:absolute;box-shadow:0 2px 4px rgba(0,0,0,0.2);-webkit-box-shadow:0 2px 4px rgba(0,0,0,0.2);text-align:left;z-index:104}#fsett a{display:block;line-height:44px;padding:0 20px;text-decoration:none;white-space:nowrap}._E2 #fsettl:hover{text-decoration:underline}._E2 #fsett a:hover{text-decoration:underline}._mk{color:#777}._Nh{color:#222;font-size:14px;font-weight:normal;-webkit-tap-highlight-color:rgba(0,0,0,0)}._Nh:hover,._Nh:active{color:#444}._Mo{display:inline-block;position:relative}._Nh ._Mo ._cuf{opacity:0.55}a._Nh:hover ._Mo ._cuf,a._Nh:active ._Mo ._cuf{opacity:1.0}._ri,._Wk{height:13px;width:8px}._cuf{border:8px solid rgba(255,255,255,0);border-radius:8px;position:absolute}._ri ._cuf{border-left:8px solid #777;left:1px}._Wk ._cuf{border-right:8px solid #777;left:-9px}._ri ._duf,._Wk ._duf{border:12px solid rgba(255,255,255,0);position:absolute;top:-4px}._ri ._duf{border-left:10px solid #f6f6f6;left:-4px}._Wk ._duf{border-right:10px solid #f6f6f6;left:-10px}._Nh{padding:8px 16px;margin-right:10px}._mk{margin:40px 0}._dD{margin-right:10px}._nW{margin-left:135px}#fbar{background:#f2f2f2;border-top:1px solid #e4e4e4;line-height:40px;min-width:980px}._xac{margin-left:135px}.fbar p,.fbar a,#fsettl,#fsett a{color:#777}.fbar a:hover,#fsett a:hover{color:#333}.fbar{font-size:small}#fuser{float:right}._HR{margin-left:135px;line-height:15px;}</style> <style>#fsl{margin-left:30px}#fsr{margin-right:30px}.fmulti #fsl{margin-left:0}.fmulti #fsr{margin-right:0}</style> <div class="_dQc _E2" id="fbar"> <div class="fbar">  <span id="fsr">  <a class="_Gs" href="//www.google.com/intl/en/policies/privacy/?fg=1">Privacy</a> <a class="_Gs" href="//www.google.com/intl/en/policies/terms/?fg=1">Terms</a>    <span style="display:inline-block;position:relative"> <a class="_Gs" href="https://www.google.com/preferences?hl=en" id="fsettl" aria-controls="fsett" aria-expanded="false" role="button" jsaction="foot.cst">Settings</a> <span id="fsett" style="display:none"> <a href="https://www.google.com/preferences?hl=en&amp;fg=1">Search settings</a> <span data-jibp="h" data-jiis="uc" id="advsl"> <a href="/advanced_search?hl=en&amp;fg=1">Advanced search</a> </span> <a href="/history/optout?hl=en&amp;fg=1">  History </a> <a href="//support.google.com/websearch/?p=ws_results_help&amp;hl=en&amp;fg=1">Search Help</a>  <a href="javascript:void(0)" data-bucket="websearch" id="_Yvd" target="_blank" jsaction="gf.sf" data-ved="0CAoQLmoVChMIrpSVkfrPxwIVgnU-Ch02ig9E">  Send feedback </a>  </span> </span>   </span> <span id="fsl"> <a class="_Gs" href="//www.google.com/intl/en/ads/?fg=1">Advertising</a> <a class="_Gs" href="//www.google.com/services/?fg=1">Business</a> <a class="_Gs" href="//www.google.com/intl/en/about.html?fg=1">About</a> </span> </div>  </div> </div>';

    // Find the existing footer element
    var existingFooter = document.getElementById('footer');
    if (existingFooter) {
        // Replace the existing footer with the new HTML
        existingFooter.outerHTML = newFooterHTML;
    }
})();
