// ==UserScript==
// @name         HH Unlock Images
// @namespace    hhUnlock
// @version      2.06
// @license      MIT
// @description  This script unlocks images of both recruited girls and non-recruited girls.
// @author       YanDee
// @match        *://nutaku.haremheroes.com/harem*
// @match        *://*.hentaiheroes.com/harem*
// @match        *://*.gayharem.com/harem*
// @match        *://*.comixharem.com/harem*
// @match        *://*.hornyheroes.com/harem*
// @match        *://*.pornstarharem.com/harem*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/409837/HH%20Unlock%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/409837/HH%20Unlock%20Images.meta.js
// ==/UserScript==

(function(uW, $, girlsDataList, number_format_lang, number_reduce, GT) {
    if (document.visibilityState == "hidden" || typeof uW.Girl?.prototype?.showInRightOrig == "function"){
        return;
    }
    let YD_sheet = false;
    function YD_addStyle(rules_obj){
        if (!YD_sheet){
            let style = document.createElement("style");
            document.getElementsByTagName("head")[0].appendChild(style);
            YD_sheet = document.styleSheets[document.styleSheets.length - 1];
        }

        Object.entries(rules_obj).map(v => {
            YD_sheet.insertRule(v[0] + "{" + Object.entries(v[1]).map(
                s => s[0] + ":" + s[1] + ";"
            ).join("") + "}");
        });
    }

    let totalIncome = Math.round(Object.values(girlsDataList).reduce((t,v) => v.own? t + v.salary_per_hour : t, 0)),
        $girls_levels = $("#filter_girls").siblings(".girls_levels");
    $girls_levels.children().addClass("orig_node");
    $girls_levels.append(
        $("<span>", {class: "hudSC_mix_icn"}),
        $("<p>").append($("<span>", {class: "pompous_text", text: GT.design.haremdex_income})),
        $("<p>").append(
            $("<p>", {
                class: "focus_text",
                hh_title: number_format_lang(totalIncome) + " / " + GT.time.h,
                "tooltip-id": "tooltip_1",
                text: (totalIncome >= 1e6? number_reduce(totalIncome) : number_format_lang(totalIncome)) + " / " + GT.time.h
            }),
            $("<p>", {
                class: "focus_text",
                hh_title: number_format_lang(24 * totalIncome) + " / " + GT.time.d,
                "tooltip-id": "tooltip_1",
                text: (24 * totalIncome >= 1e6? number_reduce(24 * totalIncome) : number_format_lang(24 * totalIncome)) + " / " + GT.time.d
            })
        )
    );
    if (sessionStorage.haremLevDispMode != "default"){
        sessionStorage.haremLevDispMode = "income";
        $("div.girls_levels").addClass("show_income");
    }
    let styles = {
        "div.girls_levels": {"cursor": "pointer"},
        "#harem_left div.girls_levels.show_income>.orig_node": {"display": "none"},
        "#harem_left div.girls_levels:not(.show_income)>:not(.orig_node)": {"display": "none"},
        "#harem_left div.girls_levels p:not(.orig_node)": {"margin": "0"},
        "#harem_whole #harem_right img.avatar": {"filter": "none"},
        "#harem_whole #harem_right div.middle_part.missing_girl": {"margin-top": "0"},
        "#harem_right .diamond-bar .showing": {
            "box-shadow": "0 0 3px 5px rgba(20,255,0,0.75)",
            "opacity": "1"
        },
        "#harem_right .diamond-bar :not(.showing)": {"cursor": "pointer"},
        "div.diamond-bar>.diamond.anim:before": {"content": "'A'"}
    };
    YD_addStyle(styles);
    $("#harem_left").on("click", ".girls_levels", function(){
        this.classList.toggle("show_income");
        sessionStorage.haremLevDispMode = this.classList.contains("show_income")? "income" : "default";
    });
    $("#harem_right").on("click contextmenu", ".diamond-bar .diamond:not(.showing)", function(e){
        $(this).addClass("showing").siblings(".showing").removeClass("showing");
        changeSkin(this.getAttribute("grade"), $(this).closest("[girl]").attr("girl"));
        return e.type != "contextmenu";
    });

    function getDiamondBar(grade){
        let body = $("<div>", {class: "diamond-bar"});
        for (let i = 0; i < grade; i++) {
            $("<div>", {class: "diamond locked" + (i? "" : " showing"), grade: i}).appendTo(body);
        };
        return body;
    }

    function getHeader(g_id){
        let g_info = uW.girlsDataList[g_id] || {}, gem = g_info.element_data?.type, flavor = g_info.element_data?.flavor || "??";
        let body = $("<h3>", {text: g_info.ref?.full_name || g_info.name || "Unknown"});
        if (gem){
            body.append($("<span>", {
                class: gem + "_element_icn element_harem_details_icn domination-toggle",
                "data-src": g_info.element_data?.ico_url || uW.IMAGES_URL + "/pictures/girls_elements/" + flavor + ".png",
                "generic-tooltip": flavor
            }));
        }
        body.append($("<span>", {carac: "class" + g_info.class}));
        return [body, $("<p>", {class: "girl-rarity " + g_info.rarity, text: GT.design["girls_rarity_" + g_info.rarity]})];
    }

    function changeSkin(num, girl_id){
        let gData = uW.girlsDataList[girl_id], $box = $(".avatar-box", "#harem_right");
        if (typeof uW.girlAnimationInstance?.removeCurrentAnimation == "function"){
            uW.girlAnimationInstance.removeCurrentAnimation();
        }
        if (Array.isArray(gData?.animated_grades) && gData.animated_grades.includes(String(num)) && !uW.Hero.infos.no_pachinko_anim){
            $box.empty().append(
                $("<canvas>", {class: "animated-girl-display", id: "id_" + girl_id + "_grade_" + num + "_animated"})
            );
            uW.girlAnimationInstance = new uW.GirlAnimation;
            uW.girlAnimationInstance.initAnimation(girl_id, num);
            return;
        }
        let ava = (gData?.avatar || "").replace(/av(a|b)\d/g, "ava" + num).toImageUrl("ava");
        if ($box.length){
            $box.empty().append(
                $("<img>", {class: "avatar", src: ava})
            );
            return;
        }
        $("img.avatar:not([unappear])", "#harem_right").attr("src", ava);
    }

    function perform(){
        let $opened = $("#harem_right").children(".opened[girl]"),
            girl_id = $opened.attr("girl"),
            g_data = girlsDataList[girl_id];
        if (g_data?.own){
            $(".diamond-bar .diamond.selected", $opened).addClass("showing");
        }
        else {
            let grade = ((g_data?.graded2 || "").match(/<g[^>]*>[^<>]*<[^>]*\/g>/gi) || []).length + 1;
            $("img.avatar:not([unappear])", $opened).before(getHeader(girl_id)).after(getDiamondBar(grade));
            changeSkin(0, girl_id);
        }
        if (Array.isArray(g_data?.animated_grades)){
            $(".diamond-bar .diamond", $opened).each((i,d) => $(d).toggleClass("anim", g_data.animated_grades.includes(String(i))));
        }
    }

    uW.Girl.prototype.showInRightOrig = uW.Girl.prototype.showInRight;
    uW.Girl.prototype.showInRight = function(){
        this.showInRightOrig.apply(this);
        perform();
    };
    perform();
})(unsafeWindow, unsafeWindow.jQuery, unsafeWindow.girlsDataList, unsafeWindow.number_format_lang, unsafeWindow.number_reduce, unsafeWindow.GT);