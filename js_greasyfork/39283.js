// ==UserScript==
// @name         Wrong of the Day
// @namespace    WrongoftheDay
// @version      0.3
// @description  Wrong of the Day  description  
// @description
// @author       zdennis
// @match        https://www.wanikani.com/review
// @match        https://www.wanikani.com/review/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39283/Wrong%20of%20the%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/39283/Wrong%20of%20the%20Day.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(JSON.stringify(a[i]) === JSON.stringify(a[j]))
                a.splice(j--, 1);
        }
    }

    return a;
};
    window.WrongOfTheDayRender = function(){

        if (localStorage["WrongOfTheDay"] == undefined)
            localStorage.setItem("WrongOfTheDay", '{"kanji":[],"radicals":[],"vocabulary":[]}');

        var WrongOfTheDay = JSON.parse(localStorage["WrongOfTheDay"]);

        WrongOfTheDay.radicals = WrongOfTheDay.radicals.concat(summaryData.incorrect.radicals).unique();
        WrongOfTheDay.kanji =  WrongOfTheDay.kanji.concat(summaryData.incorrect.kanji).unique();
        WrongOfTheDay.vocabulary = WrongOfTheDay.vocabulary.concat(summaryData.incorrect.vocabulary).unique();

        localStorage.setItem("WrongOfTheDay", JSON.stringify(WrongOfTheDay));
        var count = WrongOfTheDay.radicals.length + WrongOfTheDay.kanji.length + WrongOfTheDay.vocabulary.length;

        var items = "";
        for (var i = 0;i<WrongOfTheDay.radicals.length;i++){
            var item = WrongOfTheDay.radicals[i];
            items += '<li class="radicals WrongOfTheDay" data-en="'+item.en +'" data-ja="'+item.ja +'" data-mc="??" data-rc="??">' +
                '<a lang="ja" href="/radicals/'+item.rad +'">'+item.rad +'</a>'+
                '<div class="hover up-arrow left-side" style="display:none;position: absolute;">' +
                '<ul><li>'+item.en +'</li><li></li><li></li><li></li></ul></div></li>';
        }
        for (var i = 0;i<WrongOfTheDay.kanji.length;i++){
            var item = WrongOfTheDay.kanji[i];
            items += '<li class="kanji WrongOfTheDay" data-en="'+item.en +'" data-ja="'+item.ja +'" data-mc="??" data-rc="??">' +
                '<a lang="ja" href="/kanji/'+item.slug +'">'+item.slug +'</a>'+
                '<div class="hover up-arrow left-side" style="display:none;position: absolute;">' +
                '<ul><li>'+item.en +'</li><li>'+item.ja +'</li><li></li><li></li></ul></div></li>';
        }
        for (var i = 0;i<WrongOfTheDay.vocabulary.length;i++){
            var item = WrongOfTheDay.vocabulary[i];
            items += '<li class="vocabulary WrongOfTheDay" data-en="'+item.en +'" data-ja="'+item.ja +'" data-mc="??" data-rc="??">' +
                '<a lang="ja" href="/vocabulary/'+item.slug +'">'+item.slug +'</a>'+
                '<div class="hover up-arrow left-side" style="display:none;position: absolute;">' +
                '<ul><li>'+item.en +'</li><li>'+item.ja +'</li><li></li><li></li></ul></div></li>';
        }

        jQuery("#incorrect").append('<div id="WrongOfTheDay" class="apprentice active"> ' +
                                    '<h3><span style="padding-right: 40px;"><strong title="Items in this group">'+ count +'</strong> Wrong of the Day' +
                                    '<img onclick="window.WrongOfTheDayReset()" style="outline: 1px solid;height: 19px;position: absolute;background-color: #eee;margin-left: 8px;cursor: pointer;" src="data:image/png;base64,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"></img>' +
                                    '</span></h3>'+
                                    '<ul>' +items +'</ul>' +
                                    '</div>');

        $('.WrongOfTheDay').hover(function(){
            $(this).find(".hover").show();

        }, function() {
            $(this).find(".hover").hide();
        }).mousemove(function(e) {
            var mousex = e.clientX - 13; //Get X coordinates
            var mousey = e.clientY + 20; //Get Y coordinates
            $(this).find(".hover")
                .css({ top: 32 });
        });
    };

        window.WrongOfTheDayRender();
jQuery("#incorrect:hidden").show().parent().show();

    window.WrongOfTheDayReset = function(){
        if (confirm("Are you sure you want to reset Wrong of the Day items?") ) {

            jQuery("#WrongOfTheDay").remove();
            localStorage.setItem("WrongOfTheDay", '{"kanji":[],"radicals":[],"vocabulary":[]}');
            window.WrongOfTheDayRender();
        } else {
        }
    };

    // Your code here...
})();