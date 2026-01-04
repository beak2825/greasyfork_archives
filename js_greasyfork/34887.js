// ==UserScript==
// @name         		MerchantWords Copy Keywords to Clipboard in Bulk
// @name:zh-CN			MerchantWords批量复制关键词
// @version      		0.7
// @description  		Copy specific quantity of keywords to clipboard with one click. You can set a upper limit of words and change separator sign by modify the source code (at the first two lines)
// @description:zh-CN   可以批量复制特定的关键词或者批量复制前n个关键词，可选分隔符，可换行分隔
// @author       		QHS
// @include      		http*://www.merchantwords.com/search/*
// @grant        		GM_setClipboard
// @grant        		GM_addStyle
// @grant        		GM_setValue
// @grant        		GM_getValue
// @supportURL	 		https://greasyfork.org/scripts/34887
// @namespace    		https://greasyfork.org/users/155548
// @downloadURL https://update.greasyfork.org/scripts/34887/MerchantWords%20Copy%20Keywords%20to%20Clipboard%20in%20Bulk.user.js
// @updateURL https://update.greasyfork.org/scripts/34887/MerchantWords%20Copy%20Keywords%20to%20Clipboard%20in%20Bulk.meta.js
// ==/UserScript==

!
function() {
    function e() {
        GM_setValue("max_ammount", $("input#upper_limit").val()),
        GM_setValue("join_sign", $("input#join_sign").val()),
        a = $("input#upper_limit").val(),
        i = $("input#join_sign").val(),
        s = "" == i ? "\n": i;
    }
    function t() {
        o = 1,
        $(".table__content span a").each(function() {
            $(this).replaceWith('<font href="' + $(this).attr("href") + '">' + $(this).html() + "</font>");
        }),
        GM_setValue("element_a", 1);
    }
    function n() {
        o = 0,
        $(".table__content span font").each(function() {
            $(this).replaceWith('<a href="' + $(this).attr("href") + '">' + $(this).html() + "</a>");
        }),
        GM_setValue("element_a", 0);
    }
    var a = GM_getValue("max_ammount", 60),
    o = GM_getValue("element_a", 0),
    i = GM_getValue("join_sign", "");
    $("input#upper_limit").val(a),
    $("input#join_sign").val(i);
    var s = "" == i ? "\n": i;
    $('td[data-title="Amazon Search"]').prepend('<input type="checkbox" class="gm_check">');
    var c = Math.min(a, $(".table .table__content").length);
    GM_addStyle('._a{text-align:center;}.element_a{ transition: .3s; text-align: center; cursor: pointer; opacity: .7; background: #ffd4d4; }.element_a:hover{ background: #f8b8b8; }.table__content span a { padding-left: 6px; }.gm_check{float: left; width: 30px; height: 30px; margin-right: 0px; position: relative; left: -10px;}.section__head-aside{float:left;text-align:left!important;}#ammount2{margin-top: 7px; color: #aaa;}._save{transition:.3s;text-align: center; cursor: pointer;opacity:.7;}._saven{background: #d4d4ff; }._saved{background: #bbffc0;}p._saven:hover { opacity:1;}.win_setting{display: none; height: 217px; margin: 0 auto; position: fixed; width: 425px; background: #fff; z-index: 999; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 1px 2px 3px rgba(0,0,0,0.3); border-radius: 9px;}.win_setting header{margin: 10px 0; background: #EEE; font-size: 23px; padding-left: 13px; color: #aaaaaa; font-family: "Lato", sans-serif;}.win_setting p{margin: 10px;}.win_setting input{width: 50px; height: 25px; border: 1px #bebebe solid;}#_setting{float: left; margin-right: 20px; margin-top: 6px; font-size: 23px; cursor: pointer; color: #414141;}#ammount input{font-size: 10px; text-align: center; width: 60px;padding-left: 15px; border:1px transparent solid; border-radius: 5px; box-shadow: -1px 2px 3px rgba(0,0,0,0.1);transition:.4s}#ammount input:hover,#ammount input:focus{padding:0;width:75px;border:1px #a9d3e1 solid}.copied{background: #c8f8d0!important; color: #069d35!important; border-color: transparent!important; cursor: not-allowed;}.cannotcopy{background:#ffd3d3!important;border-color:transparent!important;}.cannotcopy:hover{background:#f80c0c!important; cursor: not-allowed;}'),
    $("body").prepend('<div class="win_setting"><header>Setting</header><p>Default number&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;<input id="upper_limit" value="' + a + '" type="number" max="1000" min="1"></p><p>Separator sign&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=&nbsp;&nbsp;&nbsp;&nbsp;<input value="' + i + '" id="join_sign"><font style="font-family:arial">&nbsp;&nbsp;←</font> join with newline if null</p><p class="_save _saven">Save</p><p class="element_a _a">Hide links for every keywords</p></div>'),
    $("div.section__head-actions").append('<br><span id="ammount" style="font-size: 16px;text-align: center;"><input value="' + c + '"type="number"min="' + (0 == c ? 0 : 1) + '"max="' + $(".table .table__content").length + '"><font class=_end> Keywords Total</font><i title="Setting" class="zmdi zmdi-settings-square"id="_setting"></i></span><span id="ammount2" style="display:none"></span>'),
    $(".btn.btn-white.js-btn-toggle").remove(),
    $("div.section__head-actions").prepend('<a class="btn btn-white coopy copyto' + (0 == c ? " cannotcopy": "") + '" href="javascript:;"> <span id="_icon"> <i class="zmdi zmdi-copy"></i> Copy top <font id="_quantity">' + a + "</font></span></a>"),
    $(".zmdi-download").parent().parent().remove(),
    $("div.section__head-actions").prepend('<a class="btn btn-white coopy copyselect cannotcopy" href="javascript:;"> <span id="_icon2"> <i class="zmdi zmdi-copy"></i> Copy selected </span></a>'),
    $("div.section__head-actions").on("mouseover mouseout", "#ammount input",
    function(e) {
        "mouseover" == e.type ? $("font._end").html(" To Copy") : "mouseout" == e.type && $("font._end").html(" Keywords Total");
    }),
    $("div.section__head-actions").on("change", "#ammount input",
    function() {
        0 == $(this).val() ? $(".copyto").addClass("cannotcopy") : $(".copyto").removeClass("cannotcopy");
    }),
    $("div.section__head-actions").on("click", ".copyto",
    function() {
        var e = $("#ammount input").val();
        if (0 == e) return ! 1;
        var t = "";
        $(".table .table__content").each(function(n) {
            if (! (n < e)) return ! 1;
            t += $(".table .table__content")[n].textContent.replace(" Search MerchantWordsSearch AmazonSearch Walmart", s);
        }),
        GM_setClipboard(t),
        setTimeout(function() {
            $("#ammount2").html(Math.min(e, $(".table .table__content").length) + " Keywords Copied To Clipboard!");
        },
        400),
        $("#ammount2").slideUp(300).delay(300).slideDown(300),
        $("#_icon .zmdi-copy").removeClass("zmdi-copy").addClass("zmdi-check-all"),
        $(".copyto").removeClass("copyto").addClass("copied"),
        $("#_icon").html(' <i class="zmdi zmdi-check-all"></i> Copied </span>');
    }),
    $("div.section__head-actions").on("click", ".copyselect",
    function() {
        var e = "";
        if ($(".gm_check:checked").length < 1) return ! 1;
        $(".gm_check:checked").parent("td").each(function(t) {
            e += $(this).text().replace(" Search MerchantWordsSearch AmazonSearch Walmart", s);
        }),
        GM_setClipboard(e),
        $("#_icon2 .zmdi-copy").removeClass("zmdi-copy").addClass("zmdi-check-all"),
        $(".copyselect").removeClass("copyselect").addClass("copied"),
        $("#_icon2").html(' <i class="zmdi zmdi-check-all"></i> Copied </span>');
    }),
    $("div.section__head-actions").on("change", "#ammount input",
    function() {
        $("#_icon").parent(".copied").addClass("copyto").removeClass("copied"),
        $("#_icon .zmdi-check-all").addClass("zmdi-copy").removeClass("zmdi-check-all"),
        $("#_icon").html(' <i class="zmdi zmdi-copy"></i> copy top ' + $("#ammount input").val() + "</span>");
    }),
    $("div.section__head-actions").on("click", "#_setting",
    function() {
        $(".win_setting").slideToggle(),
        $("._save").addClass("_saven").removeClass("_saved"),
        $("._save").html("Save"),
        $("input#upper_limit").val(a),
        $("input#join_sign").val(i),
        $("._a").addClass("element_a").removeClass("_saved"),
        1 == o ? $("._a").html("Resume all keywords with links") : 0 == o && $("._a").html("Hide links for every keywords");
    }),
    $("body").on("click", "._saven",
    function() {
        e(),
        $("._save").addClass("_saved").removeClass("_saven"),
        $("._save").html("Saved!"),
        setTimeout(function() {
            $(".win_setting").slideToggle();
        },
        500);
    }),
    $("body").on("click", ".element_a",
    function() {
        $(".element_a").html("OK!"),
        $(".element_a").addClass("_saved").removeClass("element_a"),
        1 == o ? n() : 0 == o && t(),
        setTimeout(function() {
            $(".win_setting").slideToggle();
        },
        500);
    }),
    1 == o && ($(".table__content span a").each(function() {
        $(this).replaceWith('<font href="' + $(this).attr("href") + '">' + $(this).html() + "</font>");
    }), $(".element_a").html("Resume all keywords with links")),
    0 == o && $(".table__content span a").removeAttr("href onclick"),
    $("body").on("change", ".gm_check",
    function() {
        $("#_icon2").parent(".copied").addClass("copyselect").removeClass("copied"),
        $("#_icon2").html(' <i class="zmdi zmdi-copy"></i> Copy selected </span>'),
        $("#_icon2 .zmdi-check-all").addClass("zmdi-copy").removeClass("zmdi-check-all"),
        $(".gm_check:checked").length < 1 ? $(".copyselect").addClass("cannotcopy") : $(".copyselect").removeClass("cannotcopy");
    });
} ();