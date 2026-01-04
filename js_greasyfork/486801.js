// ==UserScript==
// @name         Kiko Pop Fix
// @license      GNU GPLv3
// @namespace    https://lel.wtf
// @version      1.07
// @description  Makes Kiko Pop Playable without Flash
// @author       Lamp
// @match        https://www.neopets.com/worlds/kiko/kpop/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/486801/Kiko%20Pop%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/486801/Kiko%20Pop%20Fix.meta.js
// ==/UserScript==

(function() {
    if (document.getElementById("difficultyForm")) {
        document.getElementById("difficultyForm").remove();
    }

    function kikoplay() {
        if (document.querySelector("#kikopop")) {
            document.querySelector("#kikopop").play()
        }
    }


    var kikofix = document.createElement("div");
    kikofix.id = "diffbuttons";
    kikofix.innerHTML = `<center>
  <div class="buttonfix" onclick="setDifficulty(1); prizebutton(1)" style="padding-top: 10px; margin: 0px auto 10px;">
    <b>EASY</b>
  </div>
  <div class="buttonfix" onclick="setDifficulty(2); prizebutton(2)" style="padding-top: 10px; margin: 0px auto 10px;">
    <b>MEDIUM</b>
  </div>
  <div class="buttonfix" onclick="setDifficulty(3); prizebutton(3)" style="padding-top: 10px; margin: 0px auto 10px;">
    <b>HARD</b>
  </div>
</center>

`;

    document.querySelector("#pageDesc").appendChild(kikofix);

    var script = document.createElement("script");

    script.type = "text/javascript";
    script.text = `
 function prizebutton(dif){
 document.getElementById('diffbuttons').remove();
                var kikofix = document.createElement('div');
                kikofix.id = "kikofix";
                kikofix.innerHTML = '<br><br><br><center><div class="buttonfix prizebutton" onclick="getResultfix('+dif+', true)" style="padding-top: 10px; margin: 0px auto 10px;"><b>GET PRIZE</b></div></center>';
                document.querySelector("#pageDesc").appendChild(kikofix);

    }

 function getResultfix(difficulty, hit) {
  document.getElementsByClassName('buttonfix')[0].remove();
		$.ajax({
				url: 'ajax/prize.php',
				data: { difficulty: difficulty },
				success: function(data) {
					if (data.success) {
						prize = data.prize;
						avatar = data.avatar;
						$('#prizeButton').show('fast');
					}
                    else{
                    alert("Sorry, you didn't win anything this time. :(");
                    }
				}
			});
}
`;

    document.head.appendChild(script);

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `

.buttonfix {

    width: 190px;
    height: 30px;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 9pt;
;
    background: url(https://images.neopets.com/games/dart/buttons/bg.png) -560px 0 no-repeat;
    cursor: pointer;
}

.prizebutton{
position:relative;
  top: 300px;
     left:500px;

}

     #kikofix{

     position: relative;
     z-index: 9;
     width: 190px;
     height: 39px;

}

     #diffbuttons{
  top: 300px;
     left:500px;
     position: relative;
     z-index: 9;
     width: 190px;
     height: 39px;

}

     #kikofix b, #diffbuttons b{

     color: black !important;

}

`;

    document.getElementsByTagName("html")[0].appendChild(style);

    setTimeout(kikoplay, 1500);
})();
