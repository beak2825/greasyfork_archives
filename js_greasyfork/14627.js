// ==UserScript==
// @name Filter Google Search Results by Language
// @name:en Filter Google Search Results by Language
// @description Support Chinese, Chinese (Simplified), Chinese (Traditional), Japanese, English.
// @description:en Support Chinese, Chinese (Simplified), Chinese (Traditional), Japanese, English.
// @version 20151208
// @include https://www.google.com/*
// @grant none
// @namespace https://greasyfork.org/users/22325
// @downloadURL https://update.greasyfork.org/scripts/14627/Filter%20Google%20Search%20Results%20by%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/14627/Filter%20Google%20Search%20Results%20by%20Language.meta.js
// ==/UserScript==

(function() {

    function get_form_lr(){

        var list = ['lang_zh-CN%7Clang_zh-TW', 'lang_zh-CN', 'lang_zh-TW', 'lang_ja', 'lang_en', ''];
        var strlist = ['中文', '中文 (简体)', '中文 (繁體)', '日本語', 'English', '不限语言'];

        var baseurl = document.location.href.replace(/lr=([^&]+)&?/, '');
        var current = (RegExp.$1)? RegExp.$1 : '';
        var generateOption = function(v) {
            var i;
            var valuestr;
            for( i = 0 ; i < list.length ; i++ ){
                if( v == list[i] ){
                    valuestr = strlist[i];
                }
            }
            return '<option value="' + v + '"' 
                 + ((v == current)? ' selected="1"' : '') + '>' + valuestr + '</option>';
        };
        var opts = list.map(generateOption).join("\n");

        var func =  "var baseurl = document.location.href.replace(/&+lr=([^&]+|)(&+|$)/, '&');" + 
                    "baseurl = baseurl.replace( /\\?lr=.+?&/ , '?' );" + 
                    "var url = baseurl.replace(/https:\\/\\/www\\.google\\.com\\/search\\?/, 'search?');" + 
                    "url = url + '&lr=' + this.options[ this.selectedIndex ].value;" + 
                    "location.href = url;";
        return '<select style="width:90px" size="1" name="lr5" onchange="' + func + '">' + opts + '</select>';

    }

	document.getElementById('logocont').innerHTML = document.getElementById('logocont').innerHTML + "<div style=\"position:fixed;margin-left:17px; margin-top:20px; display\"><form>" + get_form_lr() + "</form></div>";
})();