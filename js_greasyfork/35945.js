// ==UserScript==
// @name         WaniKani Profile Beautifier
// @namespace    https://www.wanikani.com
// @version      0.2.5
// @description  Show numerical details instead of percentage on profile page
// @author       polv
// @match        https://www.wanikani.com/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35945/WaniKani%20Profile%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/35945/WaniKani%20Profile%20Beautifier.meta.js
// ==/UserScript==

var color = {
    apprentice : '#E64CA3',
    guru : '#933BAB',
    master : '#4764DD',
    enlighten : '#3E9AE5',
    burned : '#000000'
};

(function() {
    'use strict';

    var url = document.URL;
    $.ajax({ // ajax call starts
      url: 'https://www.wanikani.com/api/user/' + localStorage.apiKey + '/srs-distribution',
      dataType: 'json', // Choosing a JSON datatype
    })
    .done(function(data) {
        if(url.indexOf(data.user_information.username) != -1) {
            var total_count = 0;
            $.each(data.requested_information, function(key, value){
                total_count += value.kanji;
            });

            var html_array = [];
            $.each(data.requested_information, function(key, value){
                html_array.push('<div class="bar-supplemental" style="text-align: right; float:left; width: ' + value.kanji/$('.kanji-progress .total').text()*100 + '%; background-color:' + color[key] + '"><span class="beautifier_box"">'+ value.kanji + '</span></div>');
            });
            $('.kanji-progress .progress').html(html_array.reverse().join(''));
            //$('.kanji-progress .progress').html('<div class="bar-supplemental" style="text-align: right; float:left; width: ' + (total_count - data.requested_information.apprentice.kanji)/$('.kanji-progress .total').text()*100 + '%; background-color:black"><span class="beautifier_box"">'+ (total_count - data.requested_information.apprentice.kanji) + '</span></div>');
            $('.kanji-progress .chart').contents().filter(function(){
                return this.nodeType == 3;
            }).remove();
            $('.kanji-progress .chart').append('<br>');

            total_count = 0;
            $.each(data.requested_information, function(key, value){
                total_count += value.vocabulary;
            });
            html_array = [];
            $.each(data.requested_information, function(key, value){
                html_array.push('<div class="bar-supplemental" style="text-align: right; float:left; width: ' + value.vocabulary/$('.vocabulary-progress .total').text()*100 + '%; background-color:' + color[key] + '"><span class="beautifier_box"">'+ value.vocabulary + '</span></div>');
            });

            $('.vocabulary-progress .progress').html(html_array.reverse().join(''));
            //$('.vocabulary-progress .progress').html('<div class="bar-supplemental" style="text-align: right; float:left; width: ' + (total_count - data.requested_information.apprentice.vocabulary)/$('.vocabulary-progress .total').text()*100 + '%; background-color:black"><span class="beautifier_box"">'+ (total_count - data.requested_information.apprentice.vocabulary) + '</span></div>');
            $('.vocabulary-progress .chart').contents().filter(function(){
                return this.nodeType == 3;
            }).remove();

            $('.beautifier_box').css({
                'color':'white',
                'font-size':'12px',
                'margin': '0.5em',
                'text-shadow':'1px 1px black'
            });
        }

    }).fail(function(err) {
	  	alert(err.code);
	});
})();

function css(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

 // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}