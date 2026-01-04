// ==UserScript==
// @name         Wordle Unlimited - Word Reveal Hack (website closed)
// @namespace    q1k
// @version      2.5
// @description  The script shows the current word in a popup when hovering in the middle of the page over the title. Displays the word and a checkbox to toggle Auto Solving. Solve as many as you want. Brag to your friends that you can solve any word no matter the size on the first try. Auto solver included, turn on if you want, open the stats and watch the numbers go up. Now can edit statistics.
// @author       q1k
// @match        *://www.wordleunlimited.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439732/Wordle%20Unlimited%20-%20Word%20Reveal%20Hack%20%28website%20closed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439732/Wordle%20Unlimited%20-%20Word%20Reveal%20Hack%20%28website%20closed%29.meta.js
// ==/UserScript==

var popup = document.createElement("div");
popup.innerHTML=`
<div id='wordSettings'>
  <div id='wordSettingsModal'>
    <span id='settingsClose'>
      <svg viewBox='0 0 16 16' height='100%' width='100%' fill='#000' style='pointer-events:none;'>
        <path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/>
      </svg>
    </span>
    <div class='settingsTitle'>Change stats:</div>
    <div class='wordSettings-statistics'>
      <div class='wordSettings-stat-item'>
        <div>🎉</div>
        <div>Wins:</div>
        <div><input type='number' id='statsWins' class='settingsStats'></div>
      </div>
      <div class='wordSettings-stat-item'>
        <div>😖</div>
        <div>Losses:</div>
        <div><input type='number' id='statsLosses' class='settingsStats'></div>
      </div>
      <div class='wordSettings-stat-item'>
        <div>🔥</div>
        <div>Streak:</div>
        <div><input type='number' id='statsStreak' class='settingsStats'></div>
      </div>
      <div class='wordSettings-stat-item'>
        <div>🏆</div>
        <div>Max Streak:</div>
        <div><input type='number' id='statsMax' class='settingsStats'></div>
      </div>
    </div>
    <div class='settingsSecond'>Distribution:</div>
    <div class='wordSettings-distribution'>
      <div class='word-tries'>
        <div class='word-try'>1st try: <input type='number' id='statsWord1' class='settingsStats'></div>
        <div class='word-try'>2nd try: <input type='number' id='statsWord2' class='settingsStats'></div>
        <div class='word-try'>3rd try: <input type='number' id='statsWord3' class='settingsStats'></div>
      </div>
      <div class='word-tries'>
        <div class='word-try'>4th try: <input type='number' id='statsWord4' class='settingsStats'></div>
        <div class='word-try'>5th try: <input type='number' id='statsWord5' class='settingsStats'></div>
        <div class='word-try'>6th try: <input type='number' id='statsWord6' class='settingsStats'></div>
      </div>
    </div>
    <div class='settingsSecond'>Autosolve words per second:</div>
    <label> min=1, max=50 <input type='number' id='settingsSolvingWPS'></label>
    <div id='settingsSpacer'></div>
    <input type='button' id='settingsSave'value='Save'>
  </div>
</div>
<div id='currentWordHover'>
  <div class="how-to-info-text">hover here for hacks</div>
  <div class="dismiss-arrow arrow-up"><img src="https://i.imgur.com/pdG8rbL.png"></div>
  <div id='currentWordHolder'>
    <span id='wordSettingsButton'>
      <svg viewBox='0 0 16 16' width='100%' height='100%' fill='#000' style='pointer-events:none;'>
        <path d='M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z'></path>
        <path d='M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z'></path>
      </svg>
    </span>
    <span>Current word: </span><span id='currentWord'> </span><input type='checkbox' id='wordSolver'>
  </div>
</div>
<div id="how-to-info">
  <div id="dismiss-info">
    <div class="dismiss-arrow"><img src="https://i.imgur.com/y1afZVb.png"></div>
    <div class="dismiss-button"><input id="dismiss-button" type="button" value=" Click to dismiss  "></div>
    <div class="dismiss-forever"><label><input id="dismiss-forever-toggle" type="checkbox"> Never show again</label></div>
  </div>
  <div id="placeholder-word"></div>
</div>
`;

var popup_word = popup.querySelector("#currentWord");
var word_solve = popup.querySelector("#wordSolver");
var word_settings_button = popup.querySelector("#wordSettingsButton");
var word_settings = popup.querySelector("#wordSettings");
var word_settings_close = popup.querySelector("#settingsClose");
var words_per_second = popup.querySelector("#settingsSolvingWPS");
var save_stats = popup.querySelector("#settingsSave");
var popup_style = document.createElement("style");
popup_style.innerHTML = `
#wordSettings{position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000005;display:none;}
#wordSettingsModal{display:flex;flex-direction:column;align-items:flex-end;padding:1.75em;max-width:400px;max-width:fit-content;position:absolute;top:1em;left:50%;transform:translateX(-50%);border:1px solid;border-radius:0.3rem;background:white;box-shadow:0 0 10px;}
#wordSettingsModal label{display:flex;align-items:center;white-space:pre;}
#wordSettingsModal label input{max-width:10em;}
#settingsClose{cursor:pointer;position:absolute;top:0.5em;right:0.5em;height:1.5em;width:1.5em;padding:0.25em;display:flex;align-items:center;justify-content:center;border-radius:0.3rem;box-sizing:border-box;}
#settingsClose:hover{background:#ddd;}
.settingsTitle{width:100%;padding-bottom:0.65em;border-bottom:1px solid #555;margin-bottom:0.75em;font-weight:bold;}
.wordSettings-statistics{display:flex;text-align:center;}
.wordSettings-statistics>div:not(:last-child){margin-right:1em;}
.wordSettings-distribution{display:flex;justify-content:space-around;width:100%;}
.word-try{display:flex;justify-content:end;white-space:pre;}
.word-try input{margin-left:0.25em;}
.settingsStats{max-width:4em;}
#settingsSave{margin-top:1em;}
#currentWordHover{padding:0.25em;position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:1000000;}
#currentWordHover:hover #currentWordHolder{visibility:visible;top:0;}
#currentWordHolder{visibility:hidden;background:white;box-shadow:0 0 10px;padding:0.5em;display:flex;justify-content: center;align-items:center;top:-50px;position:relative;transition:all 0.05s ease-in-out;}
#wordSettingsButton{cursor:pointer;margin-right:0.75em;display:flex;justify-content:center;align-items:center;width:1.25em;height:1.25em;position:relative;}
#wordSettingsButton::before{content:'Click to Edit Stats';z-index:1000002;display:none;white-space:pre;position:absolute;right:calc(100% + 0.5em);bottom:50%;transform:translateY(50%);background:#555;color:#fff;border:1px solid #777;padding:3px 6px;font-size:105%;line-height:100%;pointer-events:none;}
#wordSettingsButton::after{content:'';z-index:1000001;display:none;position:absolute;right:calc(100% + 0.25em);bottom:50%;transform:translateY(50%) rotate(225deg);border-width:10px 0 0 10px;border-color:transparent transparent transparent #777;border-style:solid;pointer-events:none;}
#wordSettingsButton:hover::before,#wordSettingsButton:hover::after{display:block;}
#currentWord{padding:0 0.75em 0 0.5em;font-weight:bold;font-family:monospace}
#wordSolver{position:relative;cursor:pointer;}
#wordSolver::before{content:'Click to toggle Auto Solver (F1)';z-index:1000002;position: absolute;left:calc(100% + 0.5em);bottom:50%;transform:translateY(50%);display:none;white-space: pre;background:#555;color:#fff;border:1px solid #777;padding:3px 6px;font-size:105%;line-height:100%;pointer-events:none;}
#wordSolver::after{content:'';z-index:1000001;display:none;position:absolute;left:calc(100% + 0.25em);bottom:50%;transform:translateY(50%) rotate(45deg);border-width:10px 0 0 10px;border-color: transparent transparent transparent #777;border-style:solid;pointer-events:none;}
#wordSolver:hover::before,#wordSolver:hover::after{display:block;}
#settingsSpacer{width:100%;border-bottom:1px solid #555;padding-bottom:0.75em;}
.settingsSecond{width:100%;border-top:1px solid #555;padding-top:0.75em;margin-top:1em;font-weight:bold;}
#settingsSolvingWPS{max-width:5em !important;}
.margin-b{margin-bottom:0.65em;}
.margin-t{margin-top:0.65em;}
body.solving .confetti-loc{display:none;}
#how-to-info{display:none;background:rgba(0,0,0,0.75);position:fixed;top:0;left:0;width:100vw;height:100vh;}
#dismiss-info{display:flex;flex-direction:column;align-items:flex-end;position:absolute;bottom:0;right:0;margin:0 70px 35px 0;}
.dismiss-arrow{pointer-events:none;user-select:none;display:none;text-align:center;align-items:center;justify-content:center;color:white;position:absolute;right:50%;bottom:125%;transform:translateX(50%);}
.dismiss-arrow.arrow-up{top:100%;left:50%;bottom:auto;right:auto;transform:translateX(-50%);}
.dismiss-button input{font-weight:bold;}
.dismiss-forever{margin-top:1em;color:white;}
.how-to-info-text{box-shadow:0 0 2em 0.5em #ffeedd;pointer-events:none;background:#ffeedd;color:black;font-weight:bold;display:none;text-align:center;align-items:center;justify-content:center;position:absolute;width:100%;height:100%;top:0;left:0;}
.how-to-info-shown .how-to-info-text, .how-to-info-shown .dismiss-arrow{display:flex;}
.how-to-info-shown #how-to-info{display:block;}
/*.how-to-info-shown #currentWordHolder{pointer-events:none;}*/
.dismiss-arrow img {animation:MoveUpDown1 1.2s linear infinite;position:relative;}
.dismiss-arrow.arrow-up img {animation:MoveUpDown2 1.2s linear infinite;position:relative;}
@keyframes MoveUpDown{0%,100%{bottom:0px;}50%{bottom:50px;}}
@keyframes MoveUpDown2{0%,100%{top:0px;}50%{top:50px;}}
`;
document.body.appendChild(popup);
document.body.appendChild(popup_style);

//var wordbottom = document.createElement("div");
//wordbottom.setAttribute("id","word-reveal");
//var styles = document.createElement("style");
//styles.innerHTML="html,body{height:100%;width:100%;margin:0;padding:0;} body{display:flex;flex-direction:column;} #word-reveal{margin-top:auto;user-select: none;text-align:center;background:#555;color:#555;} #word-reveal:hover{color:white;}";
//document.body.appendChild(styles);
//document.body.appendChild(wordbottom);


//GM_deleteValue("how-to-info-shown");
var hotkeys_disabled=false;
if(GM_getValue("how-to-info-shown",true)){
    popup.classList.add("how-to-info-shown");
    hotkeys_disabled=true;
}

var dismiss_button = popup.querySelector("input#dismiss-button");
var dismiss_forever = popup.querySelector("input#dismiss-forever-toggle");

dismiss_button.addEventListener("click",(e)=>{
    if(dismiss_forever.checked){
        GM_setValue("how-to-info-shown",false);
    }
    hotkeys_disabled=false;
    popup.classList.remove("how-to-info-shown");
});

var current_word="";
var auto_solving=false;
var pause_solving=false;
function next_word(new_word){
    clearTimeout(word_solver_timer);
    if(current_word != new_word.toUpperCase() ){
//        wordbottom.innerText = "Current word: "+new_word.toUpperCase();//
        popup_word.innerText = new_word.toUpperCase();
        current_word = new_word.toUpperCase();
        autoSolve(new_word);
    }
}
var word_solver_timer;
var solvingWPS=1;
function autoSolve(word){
    if( pause_solving || (!auto_solving || word.length<2) ){ return; }
    word_solver_timer = setTimeout(function(){
        for(let i=0;i<word.length;i++){
            document.dispatchEvent(new KeyboardEvent('keydown',{ key: 'Backspace' }) );
        }
        for(let i=0;i<word.length;i++){
            document.dispatchEvent(new KeyboardEvent('keydown',{ key: word[i] }) );
        }
        document.dispatchEvent(new KeyboardEvent('keydown',{ key: 'Enter' }) );
        document.dispatchEvent(new KeyboardEvent('keydown',{ key: 'Enter' }) );
    },1000/solvingWPS);
}
window.addEventListener('keydown',(e)=>{
    if(hotkeys_disabled){ return; }
    if(e.which==112 || e.key=="F1"){
        e.preventDefault();
        word_solve.click();
    }
});
var solving_class_timer;
word_solve.addEventListener('change',(e)=>{
    if(hotkeys_disabled){
        word_solve.checked=false;
        return;
    }
    if(pause_solving){
        word_solve.checked=!word_solve.checked;
    }
    if(word_solve.checked){
        auto_solving=true;
        word_solve.checked=true;
        clearTimeout(solving_class_timer);
        document.body.classList.add("solving");
        autoSolve(current_word.toLowerCase());
    } else {
        auto_solving=false;
        word_solve.checked=false;
        solving_class_timer = setTimeout(function(){
            document.body.classList.remove("solving");
        },5000);
        clearTimeout(word_solver_timer);
    }
});
word_settings_button.addEventListener('click',(e)=>{
    clearTimeout(word_solver_timer);
    pause_solving=true;
    word_settings.querySelector("#statsWins").value = localStorage["won"];
    word_settings.querySelector("#statsLosses").value = localStorage["lost"];
    word_settings.querySelector("#statsStreak").value = localStorage["streak"];
    word_settings.querySelector("#statsMax").value = localStorage["best streak"];

    let guesses = JSON.parse(localStorage["guess distribution"]);
    word_settings.querySelector("#statsWord1").value = guesses[0].count;
    word_settings.querySelector("#statsWord2").value = guesses[1].count;
    word_settings.querySelector("#statsWord3").value = guesses[2].count;
    word_settings.querySelector("#statsWord4").value = guesses[3].count;
    word_settings.querySelector("#statsWord5").value = guesses[4].count;
    word_settings.querySelector("#statsWord6").value = guesses[5].count;

    save_stats.value="Save";
    words_per_second.value=solvingWPS;
    word_settings.style.display="block";
});
word_settings_close.addEventListener('click',(e)=>{
    if(pause_solving){
        pause_solving=false;
        if(auto_solving){
            auto_solving=true;
            word_solve.checked=true;
            autoSolve(current_word.toLowerCase());
        }
    }
    word_settings.style.display="none";
    save_stats.disabled=false;
});
save_stats.addEventListener('click',(e)=>{
    let wins = parseInt(word_settings.querySelector("#statsWins").value.toString());
    let loss = parseInt(word_settings.querySelector("#statsLosses").value.toString());
    let cstr = parseInt(word_settings.querySelector("#statsStreak").value.toString());
    let bstr = parseInt(word_settings.querySelector("#statsMax").value.toString());

    let word1 = parseInt(word_settings.querySelector("#statsWord1").value.toString());
    let word2 = parseInt(word_settings.querySelector("#statsWord2").value.toString());
    let word3 = parseInt(word_settings.querySelector("#statsWord3").value.toString());
    let word4 = parseInt(word_settings.querySelector("#statsWord4").value.toString());
    let word5 = parseInt(word_settings.querySelector("#statsWord5").value.toString());
    let word6 = parseInt(word_settings.querySelector("#statsWord6").value.toString());
    let guesses = JSON.parse(localStorage["guess distribution"]);
    let reload=false;
    if( !(parseInt(localStorage["won"])==wins && parseInt(localStorage["lost"])==loss && parseInt(localStorage["streak"])==cstr && parseInt(localStorage["best streak"])==bstr && parseInt(guesses[0].count)==word1 && parseInt(guesses[1].count)==word2 && parseInt(guesses[2].count)==word3 && parseInt(guesses[3].count)==word4 && parseInt(guesses[4].count)==word5 && parseInt(guesses[5].count)==word6) ){
        if (confirm("Save statistics and reload?") == false) {
            return;
        }
        reload=true;
        word_settings_close.style.pointerEvents="none";
    }
    localStorage["won"] = parseInt(isNaN(wins) ? "0" : wins);
    localStorage["lost"] = parseInt(isNaN(loss) ? "0" : loss);
    localStorage["streak"] = parseInt(isNaN(cstr) ? "0" : cstr);
    localStorage["best streak"] = parseInt(isNaN(bstr) ? "0" : bstr);
    guesses[0].count = parseInt(isNaN(word1) ? "0" : word1);
    guesses[1].count = parseInt(isNaN(word2) ? "0" : word2);
    guesses[2].count = parseInt(isNaN(word3) ? "0" : word3);
    guesses[3].count = parseInt(isNaN(word4) ? "0" : word4);
    guesses[4].count = parseInt(isNaN(word5) ? "0" : word5);
    guesses[5].count = parseInt(isNaN(word6) ? "0" : word6);
    localStorage["guess distribution"] = JSON.stringify(guesses);

    let wps = parseInt(words_per_second.value);
    if(wps<1 || wps>50){
        solvingWPS=1;
        words_per_second.value=solvingWPS;
    } else {
        solvingWPS=wps;
    }
    if(reload){
        save_stats.disabled=true;
        location.reload();
    } else {
        save_stats.value="Save";
    }
});
var inputs = popup.querySelectorAll("input.settingsStats");
inputs.forEach((e)=>{
    e.addEventListener('change',(d)=>{
        save_stats.value="Save and Reload";
        if(d.target.value<0){
            d.target.value=0;
        }
    });
});
var target = document.querySelector(".game-id");
var observer = new MutationObserver(function(mutations) {
    next_word( atob(document.querySelector(".game-id").childNodes[1].textContent) );
});
var config = { characterData: true, attributes: false, childList: false, subtree: true };
observer.observe(target, config);
next_word( atob(document.querySelector(".game-id").childNodes[1].textContent) );

