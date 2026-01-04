// ==UserScript==
// @name         ゲーミングヤジリン
// @namespace    https://twitter.com/udop_
// @version      1.0
// @description  これ意味ある？
// @author       udop_
// @match        http://pzv.jp/p.html?yajilin/*
// @match        https://puzz.link/p.html?yajilin/*
// @match        https://puzz.link/p?yajilin/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/405674/%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%A4%E3%82%B8%E3%83%AA%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/405674/%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%A4%E3%82%B8%E3%83%AA%E3%83%B3.meta.js
// ==/UserScript==

(function($) {

    function setGaming(){
            let svgns = "http://www.w3.org/2000/svg"

            let bg = $("svg").find("path").eq(0)
            let w = parseInt(bg.attr("d").split(" ")[6])
            let h = parseInt(bg.attr("d").split(" ")[7])

            let fig = document.querySelector("svg")

            let defs = document.createElementNS(svgns,"defs")
            let lg = document.createElementNS(svgns,"linearGradient")
            lg.setAttribute("x1","0")
            lg.setAttribute("x2",w)
            lg.setAttribute("y1","0")
            lg.setAttribute("y2",h)
            lg.setAttribute("id","gaming")
            lg.setAttribute("gradientUnits","userSpaceOnUse")

            let colors = ["#e61919","#e5e619","#19e619","#19e6e6","#1919e6","#e619e5","#e61919"]
            for(let i=0; i<colors.length; i++){
                let per = Math.floor(i*100/(colors.length-1))
                let stop = document.createElementNS(svgns, "stop")
                stop.setAttribute("stop-color",colors[i])
                stop.setAttribute("offset",per+"%")
                lg.appendChild(stop)
            }
            defs.appendChild(lg)
            fig.appendChild(defs)

            lg = document.createElementNS(svgns,"linearGradient")
            lg.setAttribute("x1","0")
            lg.setAttribute("x2",w)
            lg.setAttribute("y1","0")
            lg.setAttribute("y2",h)
            lg.setAttribute("id","gaming_mv")
            lg.setAttribute("gradientUnits","userSpaceOnUse")

            colors = ["#e61919","#e5e619","#19e619","#19e6e6","#1919e6","#e619e5","#e61919"]
            for(let i=0; i<colors.length; i++){
                let per = Math.floor(i*100/(colors.length-1))
                let stop = document.createElementNS(svgns, "stop")
                stop.setAttribute("stop-color",colors[i])
                stop.setAttribute("offset",per+"%")

                let v = colors.slice(i).concat(colors.slice(0,i+1)).reverse().join(";")
                let animate = document.createElementNS(svgns, "animate")
                animate.setAttribute("attributeName","stop-color")
                animate.setAttribute("values",v)
                animate.setAttribute("dur","2s")
                animate.setAttribute("repeatCount","indefinite")

                stop.appendChild(animate)

                lg.appendChild(stop)

            }
            defs.appendChild(lg)
            fig.appendChild(defs)

            lg = document.createElementNS(svgns,"linearGradient")
            lg.setAttribute("x1","0")
            lg.setAttribute("x2","1")
            lg.setAttribute("y1","0")
            lg.setAttribute("y2","1")
            lg.setAttribute("id","mono")

            colors = ["#ccc","#000"]
            for(let i=0; i<colors.length; i++){
                let per = Math.floor(i*100/(colors.length-1))
                let stop = document.createElementNS(svgns, "stop")
                stop.setAttribute("stop-color",colors[i])
                stop.setAttribute("offset",per+"%")
                lg.appendChild(stop)
            }
            defs.appendChild(lg)
            fig.appendChild(defs)
        $("svg").find("g").eq(-2).find("path").each((i,e) =>{
            $(e).attr("style","fill: url(#gaming);")
        })

        let g_line = document.querySelectorAll("svg g")[6]
        var mo_l = new MutationObserver(function(records){
            for(let record of records){
                for(const node of Array.from(record.addedNodes)){
                    node.style = "fill: url(#gaming)"
                }
            }
        });
        mo_l.observe(g_line, {
            childList: true
        });

        let g_black = document.querySelectorAll("svg g")[1]
        var mo_b = new MutationObserver(function(records){
            for(let record of records){
                for(const node of Array.from(record.addedNodes)){
                    node.style = "fill: url(#gaming)"
                }
            }
        });
        mo_b.observe(g_black, {
            childList: true
        });
    }

    function move(){
        $("svg").find("g").eq(-2).find("path").each((i,e) =>{
            $(e).attr("style","fill: url(#gaming_mv);")
        })
        $("svg").find("g").eq(1).find("path").each((i,e) =>{
            $(e).attr("style","fill: url(#gaming_mv);")
        })
        $("svg").find("g").eq(6).find("path").each((i,e) =>{
            $(e).attr("style","fill: url(#gaming_mv);")
        })
    }


    $(function(){
        setTimeout(function(){
            setGaming()
        },1000)
        $(".btn-ok").click(function(){
            if($("#notification").html() == "正解です！" || $("#notification div").html() == "正解です！"){
                move()
            } else {
                console.log($("#notification div").html())
            }
        })
    })
    // Your code here...
})(jQuery);