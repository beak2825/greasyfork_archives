// ==UserScript==
// @name         Steam 商店、社区点赞点踩以及奖励按钮隐藏
// @namespace    https://steamcommunity.com/id/GarenMorbid
// @version      1.1
// @description  让你不在担忧连坐封号的风险
// @author       Garen
// @match        https://steamcommunity.com/id/*/home/
// @match        https://steamcommunity.com/profiles/*/home/
// @match        https://store.steampowered.com/app/*/*
// @match        https://steamcommunity.com/id/*/recommended/*
// @match        https://steamcommunity.com/profiles/*/recommended/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431614/Steam%20%E5%95%86%E5%BA%97%E3%80%81%E7%A4%BE%E5%8C%BA%E7%82%B9%E8%B5%9E%E7%82%B9%E8%B8%A9%E4%BB%A5%E5%8F%8A%E5%A5%96%E5%8A%B1%E6%8C%89%E9%92%AE%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/431614/Steam%20%E5%95%86%E5%BA%97%E3%80%81%E7%A4%BE%E5%8C%BA%E7%82%B9%E8%B5%9E%E7%82%B9%E8%B8%A9%E4%BB%A5%E5%8F%8A%E5%A5%96%E5%8A%B1%E6%8C%89%E9%92%AE%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    var review_rate_bars = document.getElementsByClassName('review_rate_bar');
    for (const review_rate_bar of review_rate_bars) {
        review_rate_bar.style.display = "none";
    }

    var control_blocks = document.getElementsByClassName('control_block');
    for (const control_block of control_blocks) {
        control_block.style.display = "none";
    }

    var blotter_control_containers = document.getElementsByClassName('blotter_control_container');
    for (const blotter_control_container of blotter_control_containers) {
        blotter_control_container.style.display = "none";
    }

    var href = window.location.href;
    if(href.indexOf("home") != -1){
        var int=self.setInterval(function(){
            var blotter_control_containers = document.getElementsByClassName('blotter_control_container');
            for (const blotter_control_container of blotter_control_containers) {
                blotter_control_container.style.display = "none";
            }

            var control_blocks = document.getElementsByClassName('control_block');
            for (const control_block of control_blocks) {
                control_block.style.display = "none";
            }
        },1000);
    } else if (href.indexOf("app") != -1){
         var int2=self.setInterval(function(){
            var control_blocks = document.getElementsByClassName('control_block');
            for (const control_block of control_blocks) {
                control_block.style.display = "none";
            }
        },1000);
    }
})();