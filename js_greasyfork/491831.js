// ==UserScript==
// @name			Gleam.io Winning Chance
// @name:ja			Gleam.io かちのチャンス
// @name:zh-TW			Gleam.io 勝率顯示
// @name:zh-CN			Gleam.io 胜率显示
// @license			CC-BY-NC-SA-4.0
// @namespace			Gleam.io
// @version			1.2
// @description			Let's show the odds of winning.
// @description:ja		勝算を示そう。
// @description:zh-TW		展示勝率。
// @description:zh-CN		展示胜率。
// @author			Royalgamer06 & albertopasqualetto & Misha
// @icon			https://gleam.io/assets/content/logo-icon-d03a2d45d7b2b59f244530b3e64cf310afee9825ea81a7de0a98877bb0f9b8ca.svg
// @match			*gleam.io/*
// @grant			none
// @supportURL			https://github.com/Mishasama/UserScript/issues
// @homepageURL			https://github.com/Mishasama/UserScript/raw/master/Misha's%20US/Gleam.io%20Winning%20Chance
// @contributionURL		https://ko-fi.com/mishasama
// @contributionAmount		1$
// @compatible			edge
// @compatible			chrome
// @downloadURL https://update.greasyfork.org/scripts/491831/Gleamio%20Winning%20Chance.user.js
// @updateURL https://update.greasyfork.org/scripts/491831/Gleamio%20Winning%20Chance.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (document.getElementById("current-entries") !== null) {
        $('.span4.blue-square.ng-scope').after('<div class="span4 green-square ng-scope"> <span class="square-describe mont"> <span class="status small"> <span class="current ng-binding" id="winning_chance">NaN</span> </span> <span class="description ng-binding">Winning Chance</span> </span> </div>');
        var elems = document.querySelectorAll("div.square-row.row-fluid.center.ng-scope > .span4");

        for (var i = 0; i < elems.length; i++) {
            elems[i].setAttribute("style", "width:25%;");
        }

        var gleam = setInterval(function() {
            if (document.querySelector(".status.ng-binding") !== null) {
                var own = parseInt(document.querySelector(".status.ng-binding").innerHTML);
		var total = parseInt(document.querySelector(".current.ng-binding").textContent.replace(/[,.]/,''));
                var chance = Math.round(100000 * own / total ) / 1000;
                document.getElementById("winning_chance").innerHTML = chance + "%";
		console.log("[Gleam W.C.] Your winning chance is " + chance + "%!");
                clearInterval(gleam);
            }
        }, 500);
    }
})();
