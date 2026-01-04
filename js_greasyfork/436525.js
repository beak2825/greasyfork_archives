// ==UserScript==
// @name         2048 Editor
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Lol so one day i was walking in the park and I saw this sick stick
// @author       EpicOreo
// @match        https://play2048.co/
// @icon         https://drive.google.com/uc?id=1x007yz5PTByJqQde6ZrfS7wybc-2ZkXb
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/436525/2048%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/436525/2048%20Editor.meta.js
// ==/UserScript==

(function() {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'https://drive.google.com/uc?id=1x007yz5PTByJqQde6ZrfS7wybc-2ZkXb';

    //game-explanation-container
    let styleSheet = `
.astext {
    background:none;
    border:none;
    margin:0;
    padding:0;
    cursor: pointer;
}
.test {
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    font-size: 25px;
    font-weight: bold;
    color: white;
    text-align: center;
}
.game-explanation-container {
   display: flex;
   flex-direction: column-reverse;
   flex-wrap: wrap;
   height:200px;
}

.input1{
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 2px solid #8f7a66;
  width: 15%;

}


.optionsButton {
  //margin:0 auto;
  //margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  //display:block;
  background: #8f7a66;
  border: none;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  cursor: pointer;
  text-align: center;
  flex-shrink: 0;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  font-weight: bold;

}
.flashButton {
  //margin:0 auto;
  margin-left: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  //display:block;
  background: #8f7a66;
  border: none;
  border-radius: 3px;
  padding: 0 20px;
  text-decoration: none;
  color: #f9f6f2;
  height: 40px;
  line-height: 42px;
  cursor: pointer;
  text-align: center;
  flex-shrink: 0;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  font-weight: bold;

}
`;
    //game-explanation
    // Add in the css
    let s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);

    let mode = 0
    let gameExplanation = document.getElementsByClassName("game-explanation-container")[0];
    document.getElementsByClassName("title")[0].textContent = "2o48"
    let z = document.getElementsByClassName("above-game")[0];
    let ob = document.createElement("button");
    ob.innerHTML = "Edit";
    ob.className = "optionsButton";
    let backup = gameExplanation.innerHTML
    ob.onclick = () => {
        if (mode == 0){
            mode = 1;
            gameExplanation.innerText = "";
            enable_edit()

        } else {
            mode = 0;
            gameExplanation.innerHTML = backup;
        }
        //console.log(mode);

    }

    let lolnerd = document.getElementsByClassName("best-container")[0]

    lolnerd.innerHTML = '<button class="astext test" id="buttonClickId">' + lolnerd.textContent + '</button>'

    document.getElementById('buttonClickId').removeEventListener('click', ()=>{
    }
                                                                );

    document.getElementById('buttonClickId').addEventListener("click", ()=>{
        var lolnerd10 = prompt("New Score?");
        if (lolnerd10 != null) {
            localStorage.bestScore = lolnerd10;
            document.location.reload(true);
        }
    }
                                                             );



    function enable_edit() {

        let instaWinButton = document.createElement("BUTTON");
        instaWinButton.innerHTML = "Insta Win";
        instaWinButton.className = "flashButton"
        instaWinButton.onclick = () => {
            let poopnerd = JSON.parse(localStorage.gameState);
            poopnerd["won"] = true;
            localStorage.gameState = JSON.stringify(poopnerd);
            document.location.reload(true);
        }



        let test = document.getElementsByClassName("under-board-container")[0]
        let scoreButton = document.createElement("button");
        scoreButton.innerHTML = "Change HS";
        scoreButton.className = "flashButton";
        scoreButton.onclick = () => {
          var tmp10 = prompt("New Score?");
          if (tmp10 != null){
              localStorage.bestScore = tmp10;
              document.location.reload(true);
          }

        }

        let flash_button = document.createElement("button");
        flash_button.innerHTML = "Flash";
        flash_button.className = "flashButton";
        flash_button.onclick = () => {
            let sel1 = 0
            let sel2 = 0
            let bonk = 0
            let tmp4
            let values = [b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16]
            let dat = JSON.parse(localStorage.gameState);

            let tmp3 = dat["grid"]["cells"]
            for (let x in values){
                //console.log(values[x].value)
                if (values[bonk].value != ""){
                    tmp4 = {"value":values[bonk].value, "position":{"x":sel1,"y":sel2}}
                } else {
                    tmp4 = null
                }
                console.log(tmp4)
                tmp3[sel1][sel2] = tmp4
                //console.log(tmp3[sel1][sel2])

                if (sel2 < 3){
                    sel2++;
                } else {
                    sel2 = 0;
                    sel1++;
                }
                bonk++;
                console.log(tmp3);
                dat["grid"]["cells"] = tmp3;


            }
            localStorage.gameState = JSON.stringify(dat);
            document.location.reload(true);

            //console.log(dat["grid"]["cells"]);
            //console.log(b16.value)
            //console.log(b1.value)
        }
        //gameExplanation.insertBefore(flash_button, gameExplanation.childNodes[0]);
        //instaWinButton
        gameExplanation.appendChild(flash_button, test.childNodes[0]);
        gameExplanation.appendChild(scoreButton, test.childNodes[0]);
        gameExplanation.appendChild(instaWinButton, test.childNodes[0]);

        // row 4
        //gameExplanation.insertBefore(document.createElement("div"), gameExplanation.childNodes[0]);

        var b13 = document.createElement("INPUT");
        b13.setAttribute("type", "text");
        b13.className = "input1";
        gameExplanation.insertBefore(b13, gameExplanation.childNodes[0]);

        var b14 = document.createElement("INPUT");
        b14.setAttribute("type", "text");
        b14.className = "input1";
        gameExplanation.insertBefore(b14, gameExplanation.childNodes[0]);

        var b15 = document.createElement("INPUT");
        b15.setAttribute("type", "text");
        b15.className = "input1";
        gameExplanation.insertBefore(b15, gameExplanation.childNodes[0]);

        var b16 = document.createElement("INPUT");
        b16.setAttribute("type", "text");
        b16.className = "input1";

        gameExplanation.insertBefore(b16, gameExplanation.childNodes[0]);




        // row 3
        //gameExplanation.insertBefore(document.createElement("br"), gameExplanation.childNodes[0]);

        var b9 = document.createElement("INPUT");
        b9.setAttribute("type", "text");
        b9.className = "input1";
        gameExplanation.insertBefore(b9, gameExplanation.childNodes[0]);

        var b10 = document.createElement("INPUT");
        b10.setAttribute("type", "text");
        b10.className = "input1";
        gameExplanation.insertBefore(b10, gameExplanation.childNodes[0]);

        var b11 = document.createElement("INPUT");
        b11.setAttribute("type", "text");
        b11.className = "input1";
        gameExplanation.insertBefore(b11, gameExplanation.childNodes[0]);

        var b12 = document.createElement("INPUT");
        b12.setAttribute("type", "text");
        b12.className = "input1";
        gameExplanation.insertBefore(b12, gameExplanation.childNodes[0]);




        // row 2
        //gameExplanation.insertBefore(document.createElement("br"), gameExplanation.childNodes[0]);

        var b5 = document.createElement("INPUT");
        b5.setAttribute("type", "text");
        b5.className = "input1";
        gameExplanation.insertBefore(b5, gameExplanation.childNodes[0]);

        var b6 = document.createElement("INPUT");
        b6.setAttribute("type", "text");
        b6.className = "input1";
        gameExplanation.insertBefore(b6, gameExplanation.childNodes[0]);

        var b7 = document.createElement("INPUT");
        b7.setAttribute("type", "text");
        b7.className = "input1";
        gameExplanation.insertBefore(b7, gameExplanation.childNodes[0]);

        var b8 = document.createElement("INPUT");
        b8.setAttribute("type", "text");
        b8.className = "input1";
        gameExplanation.insertBefore(b8, gameExplanation.childNodes[0]);




        // row 1
        //gameExplanation.insertBefore(document.createElement("br"), gameExplanation.childNodes[0]);

        var b1 = document.createElement("INPUT");
        b1.setAttribute("type", "text");
        b1.className = "input1";
        gameExplanation.insertBefore(b1, gameExplanation.childNodes[0]);

        var b2 = document.createElement("INPUT");
        b2.setAttribute("type", "text");
        b2.className = "input1";
        gameExplanation.insertBefore(b2, gameExplanation.childNodes[0]);

        var b3 = document.createElement("INPUT");
        b3.setAttribute("type", "text");
        b3.className = "input1";
        gameExplanation.insertBefore(b3, gameExplanation.childNodes[0]);

        var b4 = document.createElement("INPUT");
        b4.setAttribute("type", "text");
        b4.className = "input1";
        gameExplanation.insertBefore(b4, gameExplanation.childNodes[0]);

        let values = [b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16]
        let lolnerdxd = 0
        let bru = JSON.parse(localStorage.gameState)["grid"]["cells"];
        for (let dumpX in bru){
            for (let dumpY in bru[dumpX]){
                try {
                   values[lolnerdxd].value = bru[dumpX][dumpY]["value"]
                }
                catch(TypeError) {
                  console.log("Exception")
                }
                lolnerdxd++;
            }

        }


}




z.insertBefore(ob, z.childNodes[0]);
})();