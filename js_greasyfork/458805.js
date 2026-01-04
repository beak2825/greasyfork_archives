// ==UserScript==
// @name         Vocabulary.com Answer Bot
// @namespace    http://tampermonkey.net/
// @version      3.01
// @description  The more questions you answer the smarter it will get. Features: spelling-assistance & auto - complete, definitions and examples, actively learning bot.
// @author       longkidkoolstar
// @match        https://www.vocabulary.com/*
// @icon         https://cdn1.iconfinder.com/data/icons/network-and-comminications-flat-square-rounded-sha/120/content__blog__media__articles__news__management__edit-512.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458805/Vocabularycom%20Answer%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/458805/Vocabularycom%20Answer%20Bot.meta.js
// ==/UserScript==

let url = window.location.href,list=url.split("/")[4],words_defs,lists,learned=[],incorrect=[],inProgress=false;
if(localStorage.getItem("lists")!==null){lists = JSON.parse(localStorage.getItem("lists"))}
else{lists = []}if(localStorage.getItem("words&defs")!==null){words_defs = JSON.parse(localStorage.getItem("words&defs"))}
else{words_defs = []}if(localStorage.getItem("learned")!==null){learned = JSON.parse(localStorage.getItem("learned"))}
if(localStorage.getItem("wrong")!==null){incorrect = JSON.parse(localStorage.getItem("wrong"))}
let dictionary = "https://api.dictionaryapi.dev/api/v2/entries/en/";

//console.log(list,lists,partsOfList(list,"words"),partsOfList(list,"defs"))

if(!url.includes("/practice")){
    setInterval(function(){
        if(document.getElementsByClassName("activity practice")[0]!==undefined){
            let practice = document.getElementsByClassName("activity practice")[0];
            if(!lists.includes(list)){
                practice.addEventListener("click",function(){
                    let enteries = document.getElementsByClassName("entry");
                    for(let i=0;i<enteries.length;i++){
                        let word = enteries[i].children[0].innerText.trim();
                        let def = enteries[i].children[1].innerText.trim();
                        words_defs.push({"word":word,"def":def,"list":list});
                        if(enteries.length-1==i){
                            localStorage.setItem("words&defs",JSON.stringify(words_defs));
                            lists.push(list);
                            localStorage.setItem("lists",JSON.stringify(lists));
                        }
                    }
                })
            }
            if(list.trim().length>0){
                practice.click();
            }
        }
    },1000)
}
else if(url.includes("/practice")){
    setTimeout(function(){
        if(!lists.includes(list)){
            location.href=url.split("/practice")[0];
        }
        else{
            bot()
        }
    },250)
}

if(url.includes("/play/")){
    bot();
}

function bot(){
    let bot = setInterval(function(){
        if(document.getElementsByClassName("challenge-history")[0].children[1].children!==undefined&&inProgress!==true){
            let arr = document.getElementsByClassName("challenge-history")[0].children[1].children;
            let currQuest = getQuest(arr);
            if(currQuest!==false){
                let questIndx = Number(currQuest.innerText-1)
                let questBox = document.getElementsByClassName("question")[questIndx];
                let quest_Type = questType(questBox);
                let nxt = document.getElementsByClassName("next")[0];
                if(quest_Type!==false){
                    inProgress = true;
                    if(quest_Type=="spell"){
                        answerSpelling(questBox,questIndx);
                    }
                    if(quest_Type=="choice1"){
                        answerMultChoice(questBox);
                    }
                    if(quest_Type=="choice2"){
                        answerMultChoice(questBox,2);
                    }
                }
                else{
                    console.log("Question type doesn't exist 🤨");
                    inProgress=false;
                }
                nxt.addEventListener("click",function(){
                    inProgress=false;
                    //console.log("inProgress = false!")
                })
            }
        }
    },500)
    }

setInterval(()=>{
    makeRoom();
    if(document.getElementsByClassName("next active")[0]!==undefined){
        document.getElementsByClassName("next active")[0].click();
    }
},250)

function makeRoom(){
    if(document.getElementsByClassName("vcom-challenge resizable large started")[0]!==undefined){
        document.getElementsByClassName("vcom-challenge resizable large started")[0].style.minHeight="2500px";
    }
}

function questType(quest){
    let type=false;
    let children = quest.children;
    for(let i=0;i<children.length;i++){
        if(children[i].className=="spelltheword"){
            type = "spell"
        }
        if(children[i].className=="choices"){
            if(children[1].childElementCount>0){
                type= "choice1";
            }
            else if(children[1].childElementCount==0){
                type="choice2";
            }
        }
    }
    console.log(type)
    return type;
}

function getQuest(arr){
    let result=false;
    for(let i=0;i<arr.length;i++){
        if(arr[i].classList[0]=="enabled"&&arr[i].classList[1]=="selected"&&arr[i].classList.value=="enabled selected"){
            result = arr[i];
        }
    }
    return result;
}


function partsOfList(listId,part){
    let words = [];
    let defs = [];
    let examples = [];
    for(let i=0;i<words_defs.length;i++){
        if(words_defs[i].list==listId){
            if(!words.includes(words_defs[i].word)){
                words.push(words_defs[i].word)
            }
            defs.push(words_defs[i].def);
            if(!examples.includes(words_defs[i].example)){
                examples.push(words_defs[i].example)
            }
        }
        if(words_defs.length-1==i){
            if(part=="words"){
                return words;
            }
            if(part=="defs"){
                return defs;
            }
            if(part=="examples"){
                return examples;
            }
        }
    }
}

function getChoices(arr){
    let temp=[];
    for(let i=0;i<arr.length;i++){
        temp.push(arr[i].innerText);
    }
    return temp;
}

function learn(word,choice,def){
    let present=false;
    for(let i=0;i<learned.length;i++){
        if(learned[i].word==word&&learned[i].choice==choice){
            present=true;
            console.log(`${word} is known 💡`)
        }
    }
    if(!present){
        learned.push({"word":word,"choice":choice});
        if(choice.split(" ").length==1){
            learned.push({"word":choice,"choice":def});
        }
        localStorage.setItem("learned",JSON.stringify(learned))
        console.log(`Learned ${word} 🧠`)
    }
    inProgress=false;
}

function getDef(word){
    let def = false;
    let words = partsOfList(list,"words");
    let defs = partsOfList(list,"defs");
    for(let i=0;i<words.length;i++){
        if(words[i].includes(word)||word.includes(words[i])){
            def = defs[i];
        }
    }
    return def;
}

function defineChoices(word,arr){
    for(let i=0;i<arr.length;i++){
        if(arr[i].innerText.split(" ").length==1){
            let def = getDef(arr[i].innerText);
            if(def!==false){
                arr[i].innerText += `: ${getDef(arr[i].innerText)} - (answer?)`;
                arr[i].style.color = "orange";
                arr[i].innerText+=" 🧠"
                clean(word,arr)
            }
        }
    }
}

function answerMultChoice(questBox,clause){
    let word,choiceBox,choices;
    if(clause==2){
        let chil = questBox.children[2].children;
        if(chil.length>1){
            for(let i=0;i<chil.length;i++){
                if(chil[i].tagName=="STRONG"){
                    word = chil[i].innerText
                }
            }
        }
        else{
            word = questBox.children[2].children[0].innerText;
        }
    }
    else if(clause==undefined){
        word = questBox.children[1].children[0].children[0].innerText;
    }
    choiceBox = questBox.children[3].children;
    choices = getChoices(choiceBox);
    defineChoices(word,choiceBox)
    let instruct = questBox.children[2];
    let words = partsOfList(list,"words");
    let defs = partsOfList(list,"defs");
    let def=false;
    deepSearch(word,questBox);
    //deepDef(word,choices,choiceBox);
    def = getDef(word);
    defAllChoices(choices,choiceBox,def)
    maybe(choices,choiceBox)
    if(def!==false){
        let answr = false;
        for(let i=0;i<choices.length;i++){
            if(choices[i].includes(def)||def.includes(choices[i])){
                answr = i;
            }
        }
        if(answr!==false){
            choiceBox[answr].style.color="springgreen";
            choiceBox[answr].innerText+=" 🧠"
            clean(word,choiceBox)
        }
        else{
            answr=false;
            if(learned.length>0){
                for(let i=0;i<learned.length;i++){
                    for(let j=0;j<choiceBox.length;j++){
                        if(learned[i].word.includes(word)||choiceBox[j].innerText.includes(learned[i].choice)||learned[i].choice.includes(choiceBox[j].innerText)||word.includes(learned[i].word)){
                            answr = learned[i].choice;
                        }
                    }
                }
            }
            if(answr!==false){
                for(let i=0;i<choices.length;i++){
                    if(choices[i].includes(answr)||answr.includes(choices[i])){
                        choiceBox[i].style.color="springgreen";
                        choiceBox[i].innerText+=" 🧠"
                        clean(word,choiceBox)
                    }
                }
            }
            else{
                //console.log("No answer found - normal way");
            }
        }
    }
    for(let i=0;i<choiceBox.length;i++){
        choiceBox[i].addEventListener("click",function(){
            setTimeout(function(){
                grabChoice(word,choiceBox,def);
            },250)
        })
    }
}


function grabChoice(word,choices,def){
    let correct = false;
    for(let i=0;i<choices.length;i++){
        if(choices[i].className=="correct"){
            learn(word,choices[i].innerText,def);
            correct = true;
        }
        if(correct){
            if(choices[i].className!=="correct"){
                wrong(word,choices[i].innerText)
            }
        }
        else{
            if(choices[i].className=="incorrect"){
                wrong(word,choices[i].innerText);
            }
        }
    }
}


function clean(word,choices){
    for(let j=0;j<choices.length;j++){
        for(let i=0;i<incorrect.length;i++){
            if(incorrect[i].word==word&&incorrect[i].choice==choices[j].innerText){
                choices[j].style.color="red";
            }
        }
    }
}

function wrong(word,choice){
    let present=false;
    for(let i=0;i<incorrect.length;i++){
        if(incorrect[i].word==word&&incorrect[i].choice==choice){
            present=true;
            console.log(`${word}'s choice is known as incorrect ❌`);
        }
    }
    if(!present){
        incorrect.push({"word":word,"choice":choice});
        localStorage.setItem("wrong",JSON.stringify(incorrect))
        console.log(`Learned ${word}'s incorrect choice 🧠`)
    }
    inProgress=false;
}

async function deepSearch(word,questBox){
    try{
        let api=`https://vocabulary.now.sh/words/${word}`;
        let api2=`https://vocabulary.now.sh/word/${word}`;
        let result=await fetch(api).then(data => data.json()).then(data => data.data[0]);
        let example=await fetch(api2).then(data => data.json()).then(data => data.data);
        let def = await result.description;
        let choiceBox = questBox.children[3].children;
        let choices = getChoices(questBox.children[3].children);
        let instruct = questBox.children[2];
        let content = questBox.children[1];
        let answr=false;
        for(let i=0;i<choices.length;i++){
            if(choices[i].includes(example)||choices[i].includes(def)||def.includes(choices[i])||example.includes(choices[i])){
                answr=i;
            }
        }
        if(answr!==false){
            choiceBox[answr].style.color="springgreen";
            choiceBox[answr].innerText+=" 🧠"
        }
        else{
            //console.log("DeepSearch failed. Will add correct answer to dataSet when answered. 🤔");
        }
        if(getDef(word)!==false){
            let set = false;
            let rep = false;
            if(content.children.length>0){
                rep = content;
            }
            if(instruct.children.length>0){
                rep = instruct;
            }
            if(rep!==false){
                if(!set){
                    set = true;
                    rep.style.overflowY="auto";
                    rep.style.height="fit-content";
                    rep.innerHTML+=`<hr><div style="margin-top:50px;"><b style="color:black;">${word}</b> means: ${getDef(word)} 🧠 <br><br> <span style="font-size:18px; margin-bottom:10px;"><b style="color:black;">Example:</b> ${example}</span></div><br>`;
                    questBox.style.marginTop="-45px";

                }
            }
        }
        for(let i=0;i<choices.length;i++){
            if(similarity(choices[i],def)||similarity(choices[i],example)/*||similar(def,choices[i])||similar(example,choices[i])*/){
                choiceBox[i].style.color="springgreen";
                choiceBox[i].innerText+=" 🧠"
            }
        }
    }
    catch(e){
        return false;
    }
}

function maybe(choices,choiceBox){
    for(let i=0;i<choices.length;i++){
        for(let j=0;j<learned.length;j++){
            if(choices[i].toLowerCase().includes(learned[j].word.toLowerCase())||learned[j].word.toLowerCase().includes(choices[i].toLowerCase())){
                if(!choiceBox[i].innerText.includes(" - maybe this...")){
                    choiceBox[i].innerText+=" - maybe this...";
                    choiceBox[i].style.color="orange";
                }
            }
        }
    }
}

function cleanUp(choices){
    for(let i=0;i<choices.length;i++){
        choices[i].style.color="#36588e";
    }
}

function answerSpelling(questBox,indx){
    let inp = questBox.children[1].children[1].children[1];
    let submit = questBox.children[1].children[2].children[0];
    let surrender = questBox.children[1].children[2].children[1];
    let status = document.getElementsByClassName("status")[indx];
    let speak = questBox.children[1].children[1].children[0];
    let label = questBox.children[1].children[0];
    let words = partsOfList(list,"words");
    speak.click();
    function auto(matches){
        inp.value=matches[0];
        inp.blur();
        setTimeout(function(){
            submit.click();
            inProgress = false;
        },350)
    }
    inp.addEventListener("keyup",function(evt){
        if(inp.value.trim().length>0){
            label.innerText = "Spell the word:";
            let input = inp.value;
            let matches=[];
            for(let i=0;i<words.length;i++){
                if(words[i].toLowerCase().includes(input.toLowerCase())||input.toLowerCase().includes(words[i].toLowerCase())){
                    matches.push(words[i]);
                }
            }
            if(matches.length>0){
                label.innerText = "Matches 😉:"
                let newLabel = document.createElement("div");
                label.append(newLabel);
                let max = 5;
                if(matches.length<5){
                    max = matches.length;
                }
                for(let i=0;i<max;i++){
                    newLabel.style="width:100%;height:fit-content;display:flex;align-items:center;justify-content:center;flex-direction:row;overflow:hidden;"
                    newLabel.innerHTML+=` <p style="cursor:pointer;margin:5px;" class = "spellGuess">${matches[i]}</p>`;
                    let guesses = document.getElementsByClassName("spellGuess");
                    for(let i=0;i<guesses.length;i++){
                        guesses[i].addEventListener("click",()=>{
                            inp.value = guesses[i].innerText;
                            setTimeout(()=>{
                                submit.click();
                                inProgress = false;
                            },350)
                        })
                    }
                }
                if(matches.length==1){
                    let auto_do = true;
                    if(status.children.length>0){
                        if(status.children[0].innerText.includes("again")){
                            auto_do = false;
                        }
                    }
                    if(auto_do){
                        auto(matches);
                    }
                }
            }
            else{
                label.innerText = "No matches 😟";
            }
        }
        else{
            label.innerText = "Spell the word:";
        }
    })
    inp.addEventListener("keydown",function(evt){
        if(evt.keyCode==13){
            if(inp.value.trim().length>0){
                inProgress=false;
            }
        }
    })
    submit.addEventListener("click",function(){
        inProgress=false;
    })
}



function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    if((longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)>0.5){
        return true;
    }
}
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similar(phrase,choice){
    let simScore1 = 0;
    let simScore2 = 0;
    phrase = cleanPunc(phrase).split(" ");
    choice = cleanPunc(choice).split(" ");
    for(let i=0;i<phrase.length;i++){
        for(let j=0;j<choice.length;j++){
            if(phrase[i].includes(choice[j])||choice[j].includes(phrase[i])){
                return true;
            }
        }
    }
    return false;
}

function cleanPunc(string){
    return string.replace(/[^A-Za-z0-9\s]/g,"").replace(/\s{2,}/g, " ");
}

/*
async function deepDef(word,choices,choiceBox){
    try{
        let api = dictionary+word;
        let dets = await fetch(api).then(data => data.json()).then(data=>data[0].meanings[0].definitions[0]);
        let synms = dets.synonyms;
        let antms = dets.antonyms;
        let def = dets.definition;
        for(let i=0;i<choices.length;i++){
            for(let j=0;j<synms.length;j++){
                if(choices[i].includes(synms[j])||synms[j].includes(choices[i])){
                    choiceBox[i].style.color="springgreen";
                    choiceBox[i].innerText+=" 🧠"
                }
            }
        }
    }
    catch(error){
        console.log("Can't find synonyms for this one. Not a big problem, I have other ways of dealing with this 😊")
    }
}
*/

async function defAllChoices(choices,choiceBox,def){
    for(let i=0;i<choices.length;i++){
        if(choices[i].split(" ").length==1){
            let api = dictionary+choices[i];
            let defs = await fetch(api).then(data => data.json()).then(data=>data[0].meanings[0].definitions);
            let temp=[];
            for(let j=0;j<defs.length;j++){
                if(defs[j]!==undefined){
                    temp.push(defs[j].definition);
                }
            }
            for(let x=0;x<temp.length;x++){
                choiceBox[i].innerText+=` - ${temp[x]}`;
            }
        }
    }
}












