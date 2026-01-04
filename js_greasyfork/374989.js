// ==UserScript==
// @name         HaremHeroes GirlSorter
// @namespace    HH
// @version      1.03
// @description  Hm?
// @author       Dorten
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/374989/HaremHeroes%20GirlSorter.user.js
// @updateURL https://update.greasyfork.org/scripts/374989/HaremHeroes%20GirlSorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
    setTimeout(function(){ if (!$("#shops").length)
        return;
    function girl_select(index) {
        var list_g = [];
		var list_g_old=[];
		var ind=0;
        $("#girls_list .girl-ico").each(function() {
            var id_g = $(this).attr("id_girl");
            var $number = $('#girls_list .number[id_girl="' + id_g + '"]');
			let s=[id_g, $(this), $number];
            list_g.push(s);
			list_g_old.push(s);
            s[1].css("left", -145 + "px");
        });
	list_g.sort(function(a, b){
        var all=a[1].data('g')['Xp']['max']-a[1].data('g')['Xp']['min'];
        var bll=b[1].data('g')['Xp']['max']-b[1].data('g')['Xp']['min'];
        var aln=a[1].data('g')['Xp']['level'];
        var bln=b[1].data('g')['Xp']['level'];
        var ale=a[1].data('g')['Xp']['left'];
        var ble=b[1].data('g')['Xp']['left'];
        return aln-bln;//all==bll?(aln==bln?ale-ble:aln-bln):all-bll;
    });
        var g = 0;
        $girl = list_g[g][1];
        if (typeof index !== "undefined") {
            g = list_g.indexOf(list_g_old[index]);
        }
        update_girl_selection()
		$("#girls_list span[nav]").off('click');
        $("#girls_list span[nav]").click(function() {
            var nav = $(this).attr("nav");
            if (nav == "left") {
                if (g <= 0)
                    g = list_g.length;
                g--;
                var direction = "back"
            } else {
                if (g + 1 >= list_g.length)
                    g = -1;
                g++;
                var direction = "forward"
            }
            update_girl_selection(direction)
        });
        function update_girl_selection(direction) {
            $girl = list_g[g][1];
            $("#girls_list .girl-ico").addClass("not-selected");
            $girl.removeClass("not-selected");
            $("#girls_list>.level_target_squared>div>div").attr("chars", $girl.data("g")["level"].length);
            $("#girls_list>.level_target_squared>div>div").text($girl.data("g")["level"]);
            $("#girls_list>h3").text($girl.data("g")["Name"]);
            $("#girls_list>.icon").attr("carac", $girl.data("g")["class"]);
            $("#girls_list .number[id_girl]").removeClass("selected");
            list_g[g][2].addClass("selected");
            var gm = list_g.length;
            if (gm <= 3) {
                var $girls = [];
                for (var i in list_g) {
                    $girls.push(list_g[i][1])
                }
                $girls[g].css("left", "145px");
                if (g == 0)
                    $girls[1].css("left", 2 * 145 + "px");
                else if (g == 1)
                    $girls[0].css("left", "0px");
                if (gm == 3) {
                    if (g == 0)
                        $girls[2].css("left", 3 * 145 + "px");
                    else if (g == 1)
                        $girls[2].css("left", 2 * 145 + "px");
                    else {
                        $girls[0].css("left", -145 + "px");
                        $girls[1].css("left", "0px")
                    }
                }
                return
            }
            var $girls = {};
            for (var i = -2; i <= 2; i++) {
                if (i == -2 && (!direction || direction === "back"))
                    continue;
                if (i == 2 && (!direction || direction === "forward"))
                    continue;
                $girls[String(i)] = list_g[(gm + g + i) % gm][1]
            }
            if (typeof direction === "string") {
                if (direction == "forward") {
                    $girls["1"].css("left", 145 * 3 + "px")
                } else {
                    $girls["-1"].css("left", "-145px")
                }
                for (var i in $girls) {
                    var i2 = parseInt(i) + 1;
                    $girls[i].velocity({
                        p: {
                            left: i2 * 145 + "px"
                        },
                        o: {
                            duration: 200,
                            easing: "linear"
                        }
                    })
                }
            } else {
                //console.log('not moving');
                $girls["-1"].css("left", "0");
                $girls["0"].css("left", "145px");
                $girls["1"].css("left", "290px")
            }
        }
    }

    var id_girl = location.search.split("girl=")[1] ? location.search.split("girl=")[1] : "---";
    if (id_girl=="---")
    {
        girl_select();
    }
    else
    {
        var index = $(".g1 div").find('[id_girl="' + id_girl + '"]').index("div[id_girl]");
        girl_select(index);
    }
                         },500)
});

})();