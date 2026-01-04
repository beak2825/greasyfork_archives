// ==UserScript==
// @name        pixiv novel ranking filter
// @namespace   https://twitter.com/sugarAsalt
// @version     0.9.9.3
// @description pixiv小説のランキングを言語・タグでフィルタリングします。
// @author      sugarAsalt
// @license     MIT
// @match       https://www.pixiv.net/novel/ranking.php*
// @require     https://code.jquery.com/jquery-3.6.0.js
// @require     https://cdn.jsdelivr.net/npm/guesslanguage@0.2.0/lib/_languageData.js
// @require     https://cdn.jsdelivr.net/npm/guesslanguage@0.2.0/lib/guessLanguage.js
// @grant GM_setValue
// @grant GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/431424/pixiv%20novel%20ranking%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/431424/pixiv%20novel%20ranking%20filter.meta.js
// ==/UserScript==
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


const style = "<style>.flex-left{flex:5;} .flex-right{flex:2;} .check_box{display:block} #ranking-filter{font-size:20px;height:120%;max-width:200px;width:200px;}</style>"

$("._unit").attr("id","left");
$("#left").addClass("flex-left");
$(".layout-body").append(style+"<div class='_unit flex-right' id='ranking-filter'>\
<div>除外する言語</div>\
<div id='select-language'>\
<label class=\"check_box\">\
  <input type=\"checkbox\" data-val='ja' id=\"lang\">日本語\
</label>\
<label class=\"check_box\">\
  <input type=\"checkbox\" data-val='zh' id=\"lang\">中国語\
</label>\
</div>\
<div>除外するタグ</div>\
<div style=\"font-size:12px;\">半角区切りでいくつでも可</div>\
  <textarea id=\"ignore-tags\" style='font-size:20px;width:180px;height:60px;max-width:180px'></textarea>\
</div>")
$(".layout-body").css("display","flex")
$(".layout-body").css("width","1200px")
$("#wrapper").css("width","1200px")

var ignoreLanguage = {"ja":false,"zh":false}
var ignoreTag = []
var works


function parse_item(item){
    var obj = $(item)
    var class_ = obj.attr("class").split(" ")[1]
    var title = $(obj.find(".title")[0]).text().trim()
    var author = $(obj.find(".user")[0]).text().trim();
    var tags = obj.find(".tag-value").map(function(i,e){return $(e).text().trim()}).toArray()
    var caption = $(obj.find(".novel-caption")[0]).text().trim()
    var language = ""
    guessLanguage.detect(title+caption+tags.join(" "),function(result){language = result})
    if(tags.some(x=>x.match(/中文/))){language="zh"}
    if(tags.some(x=>x.match(/中国語/))){language="zh"}
    return {title:title, author:author,tags:tags,caption:caption,class:class_,language:language}
}

function update_view(){
    GM_setValue("pixiv-ranking-support-ignoreLanguage",ignoreLanguage)
    GM_setValue("pixiv-ranking-support-ignoreTags",ignoreTag)
    works.forEach(function(work){
        if(ignoreLanguage[work.language] || ignoreTag.some(tag => work.tags.includes(tag))){
            $("."+work.class).hide()
        }else{$("."+work.class).show()}
    }
    )
}



var rf = document.getElementById("ranking-filter");
window.addEventListener('scroll', _handleScroll, false);
function _handleScroll() {
  rf.style.top = +window.scrollY + "px";
}

$("#select-language").change(function(){
    $("input#lang").each(function(i,e){
        ignoreLanguage[$(e).data("val")]=$(e).prop("checked")
    })
    update_view()
})

$("#ignore-tags").keyup(function(){
    console.log($(this).val())
    ignoreTag = $(this).val().trim().split(" ")
    update_view()
})


function get_all_works(){
    var works = []
    var obj = $("._ranking-items").children("div")
    obj.each(function(){
        works.push(parse_item(this))
    })
    return works
}

function restore_view(){
    ignoreLanguage = GM_getValue("pixiv-ranking-support-ignoreLanguage",{"ja":false,"zh":false})
    ignoreTag = GM_getValue("pixiv-ranking-support-ignoreTags",[])
    $("input#lang").each(function(i,e){
        if(ignoreLanguage[$(e).data("val")]){$(e).prop("checked",true)}
        else{$(e).prop("checked",false)}
    })
    $("#ignore-tags").val(ignoreTag.join(" "))
}



works = get_all_works()

console.log(works)
restore_view()
update_view()