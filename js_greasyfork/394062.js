// ==UserScript==
// @name         penpa-editタイマー
// @namespace    https://twitter.com/udoP_
// @version      1.1
// @description  早解き勢御用達？
// @author       udop_
// @match        https://opt-pan.github.io/penpa-edit/?m=solve&p=*
// @grant        none
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/394062/penpa-edit%E3%82%BF%E3%82%A4%E3%83%9E%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/394062/penpa-edit%E3%82%BF%E3%82%A4%E3%83%9E%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function maketime(t){
        let h = Math.floor(t / 60)
        let m = t % 60
        let hh = ("00"+h).slice(-2)
        let mm = ("00"+m).slice(-2)
        return "" + hh + ":" + mm
    }

    let time = 0, solvetime = 0, solveflg = false
    //let solution = pu.solution

    let timer = document.createElement("div")
    timer.setAttribute("style","position:fixed;top:0;left:0;width:100%;text-align:right;")
    timer.setAttribute("id","time")
    timer.innerHTML = "経過時間 00:00"
    document.body.appendChild(timer)

    setInterval(function(){
        let solution = pu ? pu.solution : null
        if(solution && !solveflg){
            if(solution  === JSON.stringify(pu.make_solution())){
                solveflg = true
                solvetime = maketime(time)
            }
        }

        time++
        let text = ""
        if(solveflg){
            text = text + "<span style='color:green'>解答時間 " + solvetime + "</span>"
        }
        if(!solution){
            text += "解答×"
        }
        text = text + " 経過時間 " + maketime(time)
        document.getElementById("time").innerHTML = text
    },1000)
    // Your code here...
})();