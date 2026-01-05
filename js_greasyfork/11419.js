// ==UserScript==
// @name         Forum Post HIT Finder
// @namespace    thatdudegrim.gmail.com
// @version      0.14
// @description  vBulletin Forum Post Compressor for finding HITs
// @author       thatdudegrim
// @match        http://mturkforum.com/showthread.php*
// @match        http://www.mturkforum.com/showthread.php*
// @match        http://turkernation.com/showthread.php*
// @match        http://www.turkernation.com/showthread.php*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/11419/Forum%20Post%20HIT%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/11419/Forum%20Post%20HIT%20Finder.meta.js
// ==/UserScript==

$(function () {
    var mmzp = (location.search.match(/(?:\&|\?)p=(\d+)/)||"=")[0].split("=")[1]
    var mmz = {};
    mmz.IgnoreQuotes = 1; // set to 1 if you want to ignore HITs in quotes.
    mmz.FilterMode = 0; // 0 hides the entire post body, 1 shows a scrollable preview
    mmz.compressor = 0;
    
    var firstrun = 1;

    if (typeof(Storage) !== "undefined") {
        mmz = (localStorage.getItem("mmz") === null ? mmz : JSON.parse(localStorage.getItem("mmz")));
    }
    
    $("head").append("<style>\
.crunchtime {display: none;}\
.crunchhalf {max-height: 200px;overflow-y: auto;}\
#compressor_div {position: fixed; z-index: 1000; top: 200px; right: 0px; background-color: white; padding: 5px}\
#compressor_div input {display: block; width: 160px; height: 40px; margin-bottom: 10px;}\
a[href^='https:\/\/www.mturk.com\/mturk\/preview?']::before {color: black; text-decornation: none;content: 'Preview - '}\
a[href^='https:\/\/www.mturk.com\/mturk\/previewandaccept?']::before {color: black; text-decornation: none;content: 'Panda - '}<\/style>")
    var pcontent;
    
    $("li.postcontainer").click(function(e) {
        var $etarget = $(e.target);
        console.log($etarget)
        if($etarget.is("li, span.postdate, div.posthead")) $(this).find(".postdetails, li").toggleClass(filtername);
    })

    function toggleposts () {
        $("#Compressor_ToggleComp").val((mmz.compressor ? "Show All Posts" : "Show Only HITs"))
        $("."+filtername).removeClass(filtername);
        $("li.postcontainer").each(function() {
            pcontent = $(this).find(".postdetails")
            var pclone = pcontent.clone()
            pclone.find(".signature").remove()
            if (mmz.IgnoreQuotes == 1) {
                pclone.find(".bbcode_quote").remove();
            }
            if (firstrun) {
                $(this).find(".postdate.old, .postdate.new").append(" by " + pcontent.find(".username:eq(0)").text().trim())
                $(this).append($(this).next())
            }
            
            if (!(pclone.html().match(/https:\/\/(?:www\.)?mturk.com\/mturk\/preview(andaccept)?\?[\S]*?groupId=[a-zA-Z0-9]+[\S]*?/) || this.id == ("post_" + mmzp) || pclone.find(".userinfo").html().match(/(?:mod.png|staff\.fw\.png|Community Manager|Moderator|Admin\b)/))) {
                $(this).find(".postdetails, li").removeClass("crunchtime crunchhalf").addClass(filtername);
            }
        });
        
        if (firstrun && mmzp.length) window.scrollTo($('#post_'+mmzp).offset().left,$('#post_'+mmzp).offset().top);
        firstrun = 0;
    }
    
    $("body").append("<div id=\"compressor_div\"><div id=\"compressor_title\" style=\"position:absolute; left: -30px; width: 22px; text-align: center; background-color: darkblue; color: white; padding: 5px\">C<br>o<br>m<br>p<br>r<br>e<br>s<br>s<br>o<br>r<\/div><div id=\"compressor_controls\" style=\"display: none\"><\/div><\/div>")
    $("#compressor_controls").append("<input type='button' id='Compressor_ToggleComp' value='" + (mmz.compressor ? "Show All Posts" : "Show Only HITs") + "'>")
    $("#compressor_controls").append("<input type='button' id='Compressor_IgnoreQuotes' value='" + (mmz.IgnoreQuotes ? "Show HITs in Quotes" : "Ignore HITs in Quotes") + "'>")
    $("#compressor_controls").append("<input type='button' id='Compressor_FilterMode' value='" + (!mmz.FilterMode ? "Full Hide Non-HIT Posts" : "Minimize Non-HIT Posts") + "'>")
    
    $(document).on("click","#compressor_title",function() {
        $("#compressor_controls").toggle()
    })
    
    $(document).on("click","#Compressor_ToggleComp",function() {
        ToggleComp()
        localStorage.setItem("mmz", JSON.stringify(mmz));
        if (mmz.compressor) toggleposts()
    })
    
    $(document).on("click","#Compressor_IgnoreQuotes",function() {
        mmz.IgnoreQuotes = !mmz.IgnoreQuotes
        $("#Compressor_IgnoreQuotes").val((mmz.IgnoreQuotes ? "Show HITs in Quotes" : "Ignore HITs in Quotes"))
        localStorage.setItem("mmz", JSON.stringify(mmz));
        if (mmz.compressor) toggleposts()
    })
    
    $(document).on("click","#Compressor_FilterMode",function() {
        mmz.FilterMode = !mmz.FilterMode
        $("#Compressor_FilterMode").val((!mmz.FilterMode ? "Full Hide Non-HIT Posts" : "Minimize Non-HIT Posts"))
        localStorage.setItem("mmz", JSON.stringify(mmz));
        FilterToggle();
        if (mmz.compressor) toggleposts()
    })
    
    function FilterToggle() {
        if (mmz.FilterMode) {
            filtername = "crunchtime";
        } else {
            filtername = "crunchhalf";
        }
    }
    FilterToggle();
    
    function ToggleComp() {
        if (mmz.compressor == 0) {
            mmz.compressor = 1
        } else {
            mmz.compressor = 0
            $("."+filtername).removeClass(filtername);
            $("#Compressor_ToggleComp").val("Show only HITs")
        }
    }
    if (window.location.href.match(/showthread\.php/i) && mmz.compressor == 1) {
        toggleposts()
    }
})