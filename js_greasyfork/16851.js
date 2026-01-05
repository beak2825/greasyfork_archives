// ==UserScript==
// @author         たかだか。 / TKDK.
// @name           Google Autocorrect Blocker
// @name:en        Google Autocorrect Blocker
// @namespace      https://twitter.com/djtkdk_086969
// @description    Googleの検索語句自動訂正を無効化します。
// @description:en Disables Google Search Autocorrect.
// @include        *://*.google.*/*
// @exclude        *tbm=shop*
// @exclude        *tbm=isch*
// @exclude        *tbm=vid*
// @exclude        *://plus.*
// @exclude        *://mail.*
// @exclude        *://productforums.*
// @exclude        *://maps.*
// @version        0.0.0.009
// @grant          none
// @compatible     firefox
// @compatible     chrome
// @downloadURL https://update.greasyfork.org/scripts/16851/Google%20Autocorrect%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/16851/Google%20Autocorrect%20Blocker.meta.js
// ==/UserScript==

(function() {
    console.log("GAB " + GM_info.script.version + " Started.");
    var targetSelector = [
        "#fprs *.Pqkn2e", 
        "p.sp_cnt > a.spell_orig",
        "#fprs > a.spell_orig"
    ];
    var spell_orig = null;
    if(targetSelector.some( (e) => {
        spell_orig = document.querySelector("#fprs > a.spell_orig, #fprs *.Pqkn2e a");
        return (spell_orig !== null);
    })) {
        console.log("GAB: Autocorrect detected!");
        var current_url_split = location.href.split("/");
        var autocorrect_orig_url = spell_orig.getAttribute("href");
        var new_url = current_url_split[0] + "//" + current_url_split[2] + autocorrect_orig_url;
        if(location.href.includes("#") ?
           (location.href.substr(location.href.search("#")+1).includes("nfpr=1")) :
           (location.href.includes("nfpr=1"))) {
            console.log("GAB: nfpr=1 is ineffective for this search keyword. Aborting.");
        } else {
            console.log("GAB: Redirecting to your original search query...");
            let e = document.createElement("span");
            e.textContent = "元の検索キーワードによる検索結果に移動しています...";
            spell_orig.parentElement.appendChild(e);
            location.href = new_url;
        }
    } else {
        console.log("GAB: The results for your original search query is shown.");    }
})();
