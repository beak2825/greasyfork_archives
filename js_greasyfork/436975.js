// ==UserScript==
// @name         Jstris Parity Script
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  calculates difference between white and black blocks
// @author       frey and truebulge (mostly frey)
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436975/Jstris%20Parity%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/436975/Jstris%20Parity%20Script.meta.js
// ==/UserScript==

/**************************
   Parity Script
**************************/
(function() {
    window.addEventListener('load', function(){

        var rect = holdCanvas.getBoundingClientRect();
        var p = document.createElement("div");
        p.id = "pace"
        p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+100)+"px;left:"+(rect.left-50)+"px")
        p.innerHTML = `
	<table style='width:100%;height:100%;table-layout:fixed;'>
	  <tr>
	    <th style='text-align:center' colspan="2">Parity:</th>
	  </tr>
	  <tr>
	    <td id='parity'>0</td>
	  </tr>
	</table>
	`
        document.body.appendChild(p);
        let repActive = true

        if(typeof Replayer != "undefined"){
            const styleTag = document.createElement("style");
            styleTag.innerText = "#BG_only{background-color:#000000;background-size:auto;}";
            let head = document.querySelector("head");
            head.appendChild(styleTag);

            Replayer.prototype.checkParity = function(){
                if(!repActive)return
                var parity = document.getElementById('parity');
                let board = this.matrix
                let whites = 0
                let blacks = 0
                for(let col in board[0]){
                    for(let row =-1; row< board.length; row++){
                        let b = this.deadline[col]
                        if(row>=0)b = board[row][col]
                        if(b==0)continue
                        if(col%2==0)whites+=1
                        else blacks+=1
                    }
                }
                let vert = whites-blacks
                whites = 0
                blacks = 0
                for(let row =-1; row< board.length; row++){
                    for(let col in board[0]){
                        let b = this.deadline[col]
                        if(row>=0)b = board[row][col]
                        if(b==0)continue
                        if(row%2==0)whites+=1
                        else blacks+=1
                    }
                }
                let horiz = whites - blacks
                blacks = 0
                whites = 0
                for(let row in board){
                    for(let col in board){
                        if(row%2==col%2){
                            whites += board[row][col]!=0
                        }
                        else{
                            blacks +=board[row][col]!=0
                        }
                    }
                }
                for(let col = 0; col < this.deadline.length; col++){
                    if(col%2==0)blacks+= this.deadline[col]!=0
                    else whites+= this.deadline[col]!=0
                }
                let check = whites - blacks
                parity.innerHTML= "vert " + vert + " horiz " + horiz + " check " + check
            }
            let replayer_next_block = Replayer.prototype.getNextBlock;
            Replayer.prototype.getNextBlock = function() {
                let val = replayer_next_block.apply(this, arguments);
                this.checkParity();
                return val
            };

            let replayer_add_garbage = Replayer.prototype.addGarbage;
            Replayer.prototype.addGarbage = function() {
                let val = replayer_add_garbage.apply(this, arguments);
                this.checkParity();
                return val
            };
        }



        if(typeof Game != "undefined"){
            repActive = false
            const styleTag = document.createElement("style");
            styleTag.innerText = "#BG_only{background-color:#000000;background-size:auto;}";
            let head = document.querySelector("head");
            head.appendChild(styleTag);


            Game.prototype.checkParity = function(){
                var parity = document.getElementById('parity');
                let board = this.matrix
                let whites = 0
                let blacks = 0
                for(let col in board[0]){
                    for(let row =-1; row< board.length; row++){
                        let b = this.deadline[col]
                        if(row>=0)b = board[row][col]
                        if(b==0)continue
                        if(col%2==0)whites+=1
                        else blacks+=1
                    }
                }
                let vert = whites-blacks
                whites = 0
                blacks = 0
                for(let row =-1; row< board.length; row++){
                    for(let col in board[0]){
                        let b = this.deadline[col]
                        if(row>=0)b = board[row][col]
                        if(b==0)continue
                        if(row%2==0)whites+=1
                        else blacks+=1
                    }
                }
                let horiz = whites - blacks
                blacks = 0
                whites = 0
                for(let row in board){
                    for(let col in board){
                        if(row%2==col%2){
                            whites += board[row][col]!=0
                        }
                        else{
                            blacks +=board[row][col]!=0
                        }
                    }
                }
                for(let col = 0; col < this.deadline.length; col++){
                    if(col%2==0)blacks+= this.deadline[col]!=0
                    else whites+= this.deadline[col]!=0
                }
                let check = whites - blacks
                parity.innerHTML= "vert " + vert + " horiz " + horiz + " check " + check
            }
            let game_next_block = Game.prototype.getNextBlock;
            Game.prototype.getNextBlock = function() {
                let val = game_next_block.apply(this, arguments);
                this.checkParity();
                return val
            };

            let game_add_garbage = Game.prototype.addGarbage;
            Game.prototype.addGarbage = function() {
                let val = game_add_garbage.apply(this, arguments);
                this.checkParity();
                return val
            };
        }



    }

                           );
})();