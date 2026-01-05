// ==UserScript==
// @name       KAT - Sort Translators
// @namespace  SortTranslators
// @version    2.02
// @description  Groups translators by language (only sorts by default)
// @include       https://*kat.cr/people/translators/
// @downloadURL https://update.greasyfork.org/scripts/3273/KAT%20-%20Sort%20Translators.user.js
// @updateURL https://update.greasyfork.org/scripts/3273/KAT%20-%20Sort%20Translators.meta.js
// ==/UserScript==

var info = [];
$('.firstColl:first > ul > li').each(function()
{                                   
    var all = $(this).html();
    var span = $(this).children("span");
    $(span).remove();
    var language = $(this).html();
    info.push({"html":all, "lang":language});
    $(this).remove();
});

var columnLimit = info.length;
var current = 0;

$('.secondColl:first > ul > li').each(function()
{                                   
    var all = $(this).html();
    var span = $(this).children("span");
    $(span).remove();
    var language = $(this).html();
    info.push({"html":all, "lang":language});
    $(this).remove();
});

info.sort(function(a, b) {
    return a.lang.localeCompare(b.lang);;
});

for (i = 0; i < info.length; i++)
{
    if (current < columnLimit) { $('.firstColl:first > ul').append('<li>' + info[i].html + '</li>'); }
    else { $('.secondColl:first > ul').append('<li>' + info[i].html + '</li>'); }
    current++;
}

info = [];
$('.thirdColl:first > ul > li').each(function()
{                                   
    var all = $(this).html();
    var span = $(this).children("span");
    $(span).remove();
    var language = $(this).html();
    info.push({"html":all, "lang":language});
    $(this).remove();
});

info.sort(function(a, b) {
    return a.lang.localeCompare(b.lang);;
});

for (i = 0; i < info.length; i++)
{
   $('.thirdColl:first > ul').append('<li>' + info[i].html + '</li>');
}

var langs = [];
	
var items = $("div[class$='Coll']:lt(2) > ul > li").contents().filter(function() { return this.nodeType === 3;});
items = items.map(function() {
    var text = $(this).text();
    text = text.substring(2, text.length - 1);
    return text;
  });

function unique(array) {
    return $.grep(array, function(el, index) {
        return index === $.inArray(el, array);
    });
}

items = unique(items);

items.sort();

$.map(items, function(val)
      {
          langs[val] = [];
      });
langs["All"] = [];

var option = '<option value="All">All - ' + $("div[class$='Coll']:lt(2) > ul > li").length + ' translator(s)</option>';

$("div[class$='Coll']:lt(2) > ul > li").each(function()
{
    var html = '<li><span class="badgeInline">' + $(this).contents().filter(function() { return this.nodeType != 3;}).html() + '</span></li>';
    var language = $(this).contents().filter(function() { return this.nodeType === 3;}).text();
    language = language.substring(2, language.length - 1);
    langs[language].push(html);
});
langs["All"].push($(".firstColl ul").html());
langs["All"].push($(".secondColl").html());

console.log(langs);
console.log("There is currently " + $("div[class$='Coll']:lt(2) > ul > li").length + " translators working on " + items.length + " languages");

for (var i=0;i<items.length;i++)
{
    option += '<option value="'+ items[i] + '">' + items[i] + ' - ' + langs[items[i]].length + ' translator(s)</option>';
}
$('<hr /><select id="translatorLang">' + option + "</select>").prependTo(".firstColl");

$("#translatorLang").change(function()
{
    var langChosen = $("#translatorLang option:selected").val();
    if (langChosen == "All")
    {
        $(".firstColl ul").html(langs["All"][0]);
        $('<div class="secondColl"><hr style="margin-bottom:27px">' + langs["All"][1] + '</p></div>').insertAfter(".firstColl");
    }
    else
    {
        $(".firstColl ul").html(langs[langChosen]);
        $(".secondColl").remove();
    }
});

$(".secondColl").remove();
$("#translatorLang").trigger("change");

// FORMER TRANSLATORS

var langs_former = [];
var items_former = $(".thirdColl > ul > li").contents().filter(function() { return this.nodeType === 3;});
items_former = items_former.map(function() {
    var text = $(this).text();
    text = text.substring(2, text.length - 1);
    return text;
  });

function unique(array) {
    return $.grep(array, function(el, index) {
        return index === $.inArray(el, array);
    });
}

items_former = unique(items_former);
items_former.sort();

$.map(items_former, function(val)
      {
          langs_former[val] = [];
      });

var option_former = '<option value="All">All - ' + $(".thirdColl > ul > li").length + ' translator(s)</option>';

$(".thirdColl > ul > li").each(function()
{
    var html = '<li><span class="badgeInline">' + $(this).contents().filter(function() { return this.nodeType != 3;}).html() + '</span></li>';
    var language = $(this).contents().filter(function() { return this.nodeType === 3;}).text();
    language = language.substring(2, language.length - 1);
    langs_former[language].push(html);
});

langs_former["All"] = $(".thirdColl ul").html();

console.log(langs_former);
console.log($(".thirdColl > ul > li").length + " translators previously worked on " + items_former.length + " languages");

for (var i=0;i<items_former.length;i++)
{
    option_former += '<option value="'+ items_former[i] + '">' + items_former[i] + ' - ' + langs_former[items_former[i]].length + ' translator(s)</option>';
}
$('<hr /><select id="formerTranslatorLang">' + option_former + "</select>").prependTo(".thirdColl");

$("#formerTranslatorLang").change(function()
{
    var langChosen = $("#formerTranslatorLang option:selected").val();
    $(".thirdColl ul").html(langs_former[langChosen]);
});

$("#formerTranslatorLang").trigger("change");