// ==UserScript==
// @name         Worldometers graph cosmetic fix and magnifier
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Improve graph view
// @author       Konsto
// @match        https://www.worldometers.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411601/Worldometers%20graph%20cosmetic%20fix%20and%20magnifier.user.js
// @updateURL https://update.greasyfork.org/scripts/411601/Worldometers%20graph%20cosmetic%20fix%20and%20magnifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Element.prototype.revStyleSet = function(name, value){
        this.stylez = this.stylez ? this.stylez : {};
        this.stylez[name] = this.style[name];
        this.style[name] = value;
    }

    Element.prototype.reverseTailored = function(){
        var thiz = this;
        if(this.stylez){
            var stylez = this.stylez;
            Object.keys(stylez).forEach(function(name) {
                thiz.style[name] = stylez[name];
            });
            this.stylez = null;
        }
    }

    Element.prototype.isTailored = function(){
        return !!this.stylez;
    }

    var rearrangeBars = function(gr){
        var bars = [];
        gr.querySelectorAll("g.highcharts-column-series > rect").forEach(function(bar){
            bars.push(bar);
        });
        var sum = 0;
        for(var i=1; i<bars.length-1; i++){
            var bar = bars[i];
            var prevX = parseFloat(bars[i-1].getAttribute("x"));
            var nextX = parseFloat(bars[i+1].getAttribute("x"));
            if(prevX < nextX){
                sum += (nextX-prevX);
                bar.setAttribute("x", (prevX+nextX)/2);
            }
        }
        var barWidth = Math.round(sum / bars.length * 0.25);
        barWidth = barWidth < 1 ? 1 : barWidth;
        bars.forEach(function(bar){
            bar.setAttribute("width", barWidth);
        });
    };

    window.addEventListener("load", function(){

        // Uncomment code below to remove annoying ads at right side
/*
        setInterval(function(){
            document.querySelectorAll("iframe").forEach(function(fr){
                fr.remove();
            });
        }, 250);
*/
        document.querySelectorAll(".highcharts-container").forEach(function(gr){

            if(!gr.querySelectorAll("input[type=checkbox]").length) return;

            rearrangeBars(gr);

            var open = document.createElement("span");

            open.style.zIndex = 100000;
            open.style.position = "absolute";
            open.style.right = "1vh";
            open.style.top = "1vh";
            open.style.backgroundColor = "blue";
            open.style.color = "white";
            open.style.cursor = "pointer";

            open.addEventListener("click", function(){
                rearrangeBars(gr);
                if(gr.isTailored()){
                    document.getElementById("totallyWhite").remove();
                    gr.reverseTailored();
                    open.innerText = "[+]";
                    return;
                }
                open.original = gr.cloneNode(true);
                var bg = document.createElement("span");
                bg.id = "totallyWhite";
                bg.style.position = "fixed";
                bg.style.left = 0;
                bg.style.top = 0;
                bg.style.color = "red";
                bg.style.backgroundColor = "white";
                bg.style.zIndex = 19;
                bg.style.opacity = 1;
                bg.innerText = "xxx";
                document.body.appendChild(bg);

                var kX = window.innerWidth/gr.offsetWidth;
                var kY = window.innerHeight/gr.offsetHeight;
                console.info(kX + "-" + kY);

                gr.revStyleSet("position", "fixed");
                gr.revStyleSet("left", "-" + window.innerWidth + "px");
                gr.revStyleSet("top", "0px");
                gr.revStyleSet("transform-origin", "left top");

                if(kX < kY){
                    gr.revStyleSet("transform", "scale(" + kX*2 + ", " + kX + ")");
                } else {
                    gr.revStyleSet("transform", "scale(" + kX*2 + ", " + kY + ")");
                }

                gr.revStyleSet("zIndex", 20);
                gr.revStyleSet("padding", 0);
                gr.revStyleSet("margin", 0);
                open.innerText = "[-]";
            });

            open.innerText = "[+]";
            gr.appendChild(open);
        });
    });
})();