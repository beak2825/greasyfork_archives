// ==UserScript==
// @name         Yajirin Customizer of pzpr
// @namespace    http://twitter.com/udop_/
// @version      0.1
// @description  ぱずぷれのヤジリンの数字の挙動を変更します。
// @author       udop_
// @match        http://pzv.jp/p.html?yajilin/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/392294/Yajirin%20Customizer%20of%20pzpr.user.js
// @updateURL https://update.greasyfork.org/scripts/392294/Yajirin%20Customizer%20of%20pzpr.meta.js
// ==/UserScript==

(function($) {

    var boardx, boardy,fig

    setTimeout(function(){
        ui.debug.filesave_pencilbox()
        var data = ui.debug.getTA().split("\n")
        boardy = data[0] -0
        boardx = data[1] -0

        fig = $("svg")
        var g = fig.find("text:first").closest("g")
        g.attr("id","original")
        var gg = g.clone().attr("id","clone").insertBefore(g)
        var boardw = parseInt(fig.find("path:first").attr("d").split(" ")[4])
        var boardh = parseInt(fig.find("path:first").attr("d").split(" ")[9])
        var cellw = boardw / boardx
        var cellh = boardh / boardy

        $("#clone text").each(function(i,e){
            let w = parseInt($(e).attr("x"))
            let h = parseInt($(e).attr("y"))
            let x = Math.floor(w / cellw)
            let y = Math.floor(h / cellh)
            $(e).attr("cx",x)
            $(e).attr("cy",y)
        });
        $("#clone path").each(function(i,e){
            let w = parseInt($(e).attr("d").split(" ")[1])
            let h = parseInt($(e).attr("d").split(" ")[2])
            let x = Math.floor(w / cellw)
            let y = Math.floor(h / cellh)
            $(e).attr("id",`allow_${x}_${y}`)
        });
        var style = $("<style></style>")
        style.html("#original path[fill=black], #original text{fill:transparent;}")
        style.appendTo($("head"))
        console.log(boardw,boardh,boardx,boardy,cellw,cellh)
    },200)

    $(document).on("click",function(){
        ui.debug.filesave_pencilbox()
        var data = ui.debug.getTA().split("\n")
        var board = []
        var color

        for(let y=0; y<boardy; y++){
            board.push(data[y+2].trim().split(" "))
        }
        $("#clone text").each(function(i,e){
            let cx = $(e).attr("cx") -0
            let cy = $(e).attr("cy") -0
            let d = Math.floor((board[cy][cx] - 0) / 16)
            let n = (board[cy][cx] - 0) % 16
            let tar,bn=0

            if( d==0 ){
                tar = board.map((b) => {return b[cx]}).slice(0,cy).reverse()
            } else if(d==1){
                tar = board[cy].slice(0,cx).reverse()
            } else if(d==2){
                tar = board.map((b) => {return b[cx]}).slice(cy+1)
            } else {
                tar = board[cy].slice(cx+1)
            }

            bn = tar.filter(c => c == "#").length
            $(e).text(n-bn)

            if(n-bn>0){
                color = "black"
            } else if(n-bn == 0){
                color = "gray"
            } else {
                color = "red"
            }
            $(e).attr("fill",color)
            $(`#allow_${cx}_${cy}`).attr("fill",color)
        });
    })
})(jQuery);