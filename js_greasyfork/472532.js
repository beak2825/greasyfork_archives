// ==UserScript==
// @name         dekzeh pokemon calc utilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quality of life for a pokemon calc
// @author       ForwardFeed
// @license      GNU
// @match        https://dekzeh.github.io/calc/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472532/dekzeh%20pokemon%20calc%20utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/472532/dekzeh%20pokemon%20calc%20utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';
    replace_clearset();
    button_reset();
    attach_last_time_trainer();
    set_last_time_trainer();
    import_QoL();
})();

//get back to the truck
function button_reset(){
    let wrapper = document.body.children[0];
    let reset = document.createElement("button");
    reset.innerText="reset trainer";
    reset.id="reset-trainer";
    reset.onclick = set_first_trainer;
    wrapper.appendChild(reset);
}

//attach the feature to the button next or previous trainer or reset
function attach_last_time_trainer(){
    //local apply
    let lapply = (n)=>{
        n.addEventListener("click", save_current_trainer);
    }
    let prev = document.getElementById("previous-trainer");
    lapply(prev);
    let next = document.getElementById("next-trainer");
    lapply(next);
    let reset = document.getElementById("reset-trainer");
    lapply(reset);
}
//save the current trainer
function save_current_trainer(){
    let current = document.getElementById("p2").children[2].value;
    localStorage.setItem("lasttimetrainer", current);
}
//fetch from localstorage, the last trainer you faced before closing the app
function set_last_time_trainer(){
    let last = localStorage.getItem("lasttimetrainer");
    if (last != ""){
        set_trainer(last);
    }
}

//specific call to set
function set_first_trainer(){
    set_trainer("Poochyena (Youngster Calvin)")
}

//replace the right panel to the selected trainer
function set_trainer(trainer){
    let input = document.getElementById("p2").children[2];
    input.value = trainer;
    let event = new Event('change');
    input.dispatchEvent(event);
}

//replace the function that ask with the alert("annoying") with one which force
function replace_clearset(){
    var els = document.querySelectorAll("[id='clearSets']");
    for (let i=0; i<els.length; i++){
        let el = els[i];
        let new_btn = document.createElement("button");
        new_btn.innerText = "force clear & reload";
        new_btn.onclick=no_confirm_clearset;
        //because of the event listener it's quicker to just replace the node than remove the event listener
        el.parentNode.replaceChild(new_btn, el);
    }
}
// clear the sets and reload the window.
function no_confirm_clearset(event){
    localStorage.removeItem("customsets");
    window.location.reload(false);
    event.stopPropagation()
}

//don't notify for importing
//add a button for importing from clip boar
function import_QoL(){
    let old = document.getElementById("import");
    let onclick = ()=>{
        var pokes = document.getElementsByClassName("import-team-text")[0].value;
        var name = document.getElementsByClassName("import-name-text")[0].value.trim() === "" ? "Custom Set" : document.getElementsByClassName("import-name-text")[0].value;
        window.addSets(pokes, name);
    }
    let neew = document.createElement("button");
    neew.innerText = "Import";
    neew.onclick = onclick;
    neew.className = "bs-btn bs-btn-default";
    old.parentNode.replaceChild(neew, old);

    if (typeof navigator.clipboard.readText == "undefined") {
        //probably firefox, it won't work
        //check https://stackoverflow.com/questions/67440036/navigator-clipboard-readtext-is-not-working-in-firefox
        return
    }
    //add a import from clipboard feature
    let from_clickboard = ()=>{
        navigator.clipboard
            .readText()
            .then(
            (clipText) => {
                var name = document.getElementsByClassName("import-name-text")[0].value.trim() === "" ? "Custom Set" : document.getElementsByClassName("import-name-text")[0].value;
                window.addSets(clipText, name);
            }
        );
    }
    let clip = document.createElement("button");
    clip.innerText = "Import from clipboard";
    clip.onclick = from_clickboard;
    clip.className = "bs-btn bs-btn-default";
    neew.parentNode.appendChild(clip)
}
