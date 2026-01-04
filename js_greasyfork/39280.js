// ==UserScript==
// @name         Quick upgrade - Aznatf
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bounds keys to builds
// @author       La Faucheuse
// @match        *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39280/Quick%20upgrade%20-%20Aznatf.user.js
// @updateURL https://update.greasyfork.org/scripts/39280/Quick%20upgrade%20-%20Aznatf.meta.js
// ==/UserScript==




(function() {
    function permutator(inputArr) {
        var results = [];
        function permute(arr, memo) {
            var cur, memo = memo || [];
            for (var i = 0; i < arr.length; i++) {
                cur = arr.splice(i, 1);
                if (arr.length === 0) {
                    results.push(memo.concat(cur));
                }
                permute(arr.slice(), memo.concat(cur));
                arr.splice(i, 0, cur[0]);
            }
            return results;
        }
        return permute(inputArr);
    }

    Rotation=[0,9,16,18];
    Colors_index=["3","5","4","6"];
    b=" 0x00B1DE"; //blue color
    r=" 0xF14E54"; //red color
    p=" 0xBF7FF5"; //purple color
    g=" 0x00E16E"; //green color
    Colors=[b,p,r,g];
    Permutations=permutator(Colors);
    R=0;
    P=0;
    UI=true;
    document.body.onkeyup=function(e){

		//Build keys
		//Go to http://keycode.info/ if you want to reassign keys and then change the number after "e.keyCode==="

        //00157776 = "F key"
        if(e.keyCode===70){
            input.execute("game_stats_build 565656565656567747474747473888888");
        }
        //00167775 = "G key"
        if(e.keyCode===71){
            input.execute("game_stats_build 565656565656564747474747477388888");
        }
        //00157767 = "V key"
        if(e.keyCode===86){
            input.execute("game_stats_build 565656565656567474747474738888888");
        }
        //01277727 = "M key"
        if(e.keyCode===77){
            input.execute("game_stats_build 456456456456456456456888888832377");
        }

        //Colors switch
        else if(e.keyCode===80){
            P=Math.floor(Math.random() * 23);
            for (i = 0; i < 4; i++) {
                input.execute("net_replace_color "+Colors_index[i]+Permutations[P][i]);
            }
            input.execute("net_replace_color 2"+Permutations[P][0]);
            input.execute("net_replace_color 15"+Permutations[P][2]);
        }
        else if(e.keyCode===81){
            R=(R+1)*(R<3);
            for (i = 0; i < 4; i++) {
                input.execute("net_replace_color "+Colors_index[i]+Permutations[Rotation[R]][i]);
            }
            input.execute("net_replace_color 2"+Permutations[0][0]);
            input.execute("net_replace_color 15"+Permutations[0][2]);
        }
        else if(e.keyCode===82){
            R=(R-1)*(R>0)+3*(R==0);
            for (i = 0; i < 4; i++) {
                input.execute("net_replace_color "+Colors_index[i]+Permutations[Rotation[R]][i]);
            }
            input.execute("net_replace_color 2"+Permutations[0][0]);
            input.execute("net_replace_color 15"+Permutations[0][2]);
        }

        //toggle UI
        else if(e.keyCode===90){
            UI=!UI;
            input.set_convar("ren_ui", UI);
        }
        //usefull stuffs = "L key"
        else if(e.keyCode===76){
            input.set_convar("ren_minimap_viewport", true);
            setInterval(function(){input.keyDown(76);},150);
            input.set_convar("ren_fps", true);
        }
    };
})();