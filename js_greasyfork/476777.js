// ==UserScript==
// @name         CoffeeMonsterz-Re-Ordering-Tool
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Re-order the things within orders
// @author       Sam Tang
// @match        https://admin.shopify.com/store/thecoffeemonsterzco/orders?inContextTimeframe=none
// @match        https://admin.shopify.com/store/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hayageek.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476777/CoffeeMonsterz-Re-Ordering-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/476777/CoffeeMonsterz-Re-Ordering-Tool.meta.js
// ==/UserScript==
// script starts
alert("script online");
// setup
var document = window.document;
var buttonList = document.getElementsByClassName("Uv4Dl YY2Og");
var itemList = document.getElementsByClassName("Polaris-VerticalStack_1fqes");
var wordList = [];
var updated = false;
//do not fiddle if you don't know what you're doing. regex matches here
var regexExp = [/E\d\d\d\d*[A-Z]?x \d/g, /E\d\d\d\d* [A-Z]?x \d/g, /HC\d\d\d\d*[A-Z]?x \d/g, /V\d\d\d\d*[A-Z]?x \d/g, /HW\d\d\d\d*[A-Z]?x \d/g];
var filterRegexExp = [/E\d\d\d\d*[A-Z]?x \d/g, /E\d\d\d\d* [A-Z]?x \d/g, /HC\d\d\d\d*[A-Z]?x \d/g, /V\d\d\d\d*[A-Z]?x \d/g, /HW\d\d\d\d*[A-Z]?x \d/g,
                     /E\d\d\d\d*[A-Z]?/g, /E\d\d\d\d* [A-Z]?/g, /HC\d\d\d\d*[A-Z]?/g, /V\d\d\d\d*[A-Z]?/g, /HW\d\d\d\d*[A-Z]?/g];
// stores indices like E001 A...

//[some Cap.Letters in 3-successions]
//[some hyphen]

// naming convention
// PD-TYPE-XXX...X-VAR
// BD-TYPE-XXX...X-VAR
// ex
// PD-V-001-A for some vinyl
// BD-E-0022-ABC for some bundle

//do not touch
var indexList = [];
var displayWordList = [];
var displayIndexList = [];

// list of entries copied from dropdown
var copyList = [];




window.onload = function(){
    console.log("page is fully loaded");
    update()
    //console.log(buttonList.length);
}

// constant update in .5sec

const interval = setInterval(function() {
    update();
 }, 500);



// check if any elem with cls as class is in the children of node. if yes, return the first occurrence. if no, return null.
function recurClassNameCheck(node, cls){
    if (node.className == cls){
        return node;
    }
    if (node.childNodes.length == 0){
        return null;
    }
    var returnNode = null;
    for(let subnode of node.childNodes){
        returnNode = null|recurClassNameCheck(subnode,cls);
        if (returnNode){
            return returnNode;
        }
    }
    return returnNode;
}


// update info every sec
function update(){
    //update onclick on every dropdown button
    updated=false;
    buttonList = document.getElementsByClassName("Uv4Dl YY2Og");
    buttonList.onclick = function(){onClickExt();};
    for (let i of buttonList){
       // console.log(i.nodeName);
        i.onclick = function(){onClickExt();}
    }
    copyList = [];
    // reset
    var raw = []
    // raw: [sorter, copiedSeg]

    if (document.getElementsByClassName("Polaris-VerticalStack_1fqes")[0]){
        for (let i of document.getElementsByClassName("Polaris-VerticalStack_1fqes")[0].children){


            var valNode = null;
            for(let j of i.children){
                if (j.className == "Polaris-HorizontalStack_dv6q6"){

                    valNode = j.cloneNode(true)
                    copyList.push(valNode);
                }
            }

            raw.push([i.textContent, valNode]);
            console.log(copyList);

            //Polaris-HorizontalStack_dv6q6

        }
        raw.splice(0,1);
    }else{
        raw = [];
    }

    //itemList = document.getElementsByClassName("Polaris-HorizontalStack_dv6q6");



    //console.log("raw word list here");
    //console.log(newWordList);
    if (raw.length > 0){
        var res = extract(raw);
        indexList = res[0];
        wordList = res[1];

    }
    if (raw.length == 0){
        indexList = [];
        wordList = [];
    }
    //console.log("sortCompare testing  " + sortCompare("E168x 1", "E1136x 2"));
    // the two things that we display
    indexList.sort(sortCompare);
    wordList.sort(sortFromPair);
    //console.log(wordList);
    //console.log(indexList);
    if (wordList.length != 0){
        displayWordList = wordList;
    }
    if (indexList.length != 0){
        displayIndexList = indexList;
    }
    updated = true
    //displayUI();
}
// displays UI
function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}
//           <li><input type="checkbox">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</li>
var msgHTMLa = `
<dialog id="#infoPanel" class="infoPanel">
<form method="dialog">
<button id="#closeModal">close tab</button>
      <header>list  </header>
      <nav>

      <div>Indexed Items</div>
        <ul id="#indexedItems">


        </ul>
      </nav>
      <div> Non-Indexed items</div>
      <nav>
        <ul id="#non-indexedItems">

        </ul>
      </nav>
</form>
    </dialog>
`; //html code
var msgCSS = `
.infoPanel
{
position: fixed;
max-width : 1600px;
max-height : 800px;
float:right;
z-index : 100;
min-width : 100px;
min-height : 100px;
display: inline-block;
word-wrap: break-word;
  overflow: hidden;
  overflow-y: scroll;
  resize:both;
}
`; // css code


function displayUI(indexList,wordList){
    if(document.getElementsByClassName("infoPanel").length == 0){
        var msgHTML = msgHTMLa;
        //console.log(msgHTML);
        var popup = create(msgHTML);
        var loc = document.getElementsByClassName("Polaris-Layout_sl20u")[0];
        //document.body.insertBefore(popup, document.body.childNodes[0]);
        //console.log(loc);
        loc.appendChild(popup);
        document.getElementById("app").style.zIndex = 0;
        var styleSheet = document.createElement("style");
        styleSheet.innerText = msgCSS;
        document.head.appendChild(styleSheet);
        document.getElementById("#infoPanel").width = "100px";


        //close modal
        document.getElementById("#closeModal").onclick = function(){
            console.log("close modal");
            document.getElementById("#infoPanel").style.display = "none";
        }


        document.getElementById("#infoPanel").style.display = "block";
        document.getElementById("#infoPanel").show();



    }else
    {

        var originalPos = document.getElementById("#infoPanel");


        //console.log(copyList);
        //originalPos.appendChild(copyList[0]);
        var insPt1 = document.getElementById("#indexedItems");
        var insPt2 = document.getElementById("#non-indexedItems");
        while (insPt1.firstChild) {
              insPt1.removeChild(insPt1.lastChild);
          }
        while (insPt2.firstChild){

            insPt2.removeChild(insPt2.lastChild);
        }
        // set inner text
        //document.getElementById("#customTextField").textContent = wordList + "\n\n" + indexList;

        for(let i of indexList){
            var li = `<input type="checkbox">` + i[1].innerHTML + ``;
            var liItem = document.createElement("li");
            liItem.innerHTML= li;
            liItem.style.borderStyle = "solid";
            insPt1.appendChild(liItem);
        }

        for (let j of wordList){
            var li2 = `<input type="checkbox">` + j[1].innerHTML + ``;
            //console.log(li2);
            var liItem2 = document.createElement("li");
            liItem2.innerHTML= li2;
            liItem2.style.borderStyle = "solid";
            insPt2.appendChild(liItem2);

        }

        //document.getElementById("#infoPanel").show();
        document.getElementById("#infoPanel").style.display = "block";
        document.getElementById("#infoPanel").show();
    }



}

// compare 2 ids.
function sortCompare(a,b){

    var aIndex = a[0];
    var bIndex = b[0];
    var strippedA = aIndex.replace(/\s+/g, '');
    var strippedB = bIndex.replace(/\s+/g, '');

    var aVal = parseInt(strippedA.match(/(\d+)/)[0], 10);
    var bVal = parseInt(strippedB.match(/(\d+)/)[0],10);
    var aPrefix = aIndex.match(/[A-Z][A-Z]*/)[0];
    var bPrefix = bIndex.match(/[A-Z][A-Z]*/)[0];

    var aType = aIndex.match(/[A-Z]+/)[1];
    var bType = bIndex.match(/[A-Z]+/)[1];

    if(aPrefix < bPrefix){
        return -1;
    }
    if (bPrefix < aPrefix){
        return 1;
    }

    if (aVal > bVal){
        return 1;
    }

    if (bVal > aVal){
        return -1;
    }

    if (aType > bType){
        return -1;
    }
    if (bType < aType){
        return 1;
    }
    return 0;
}
// compare [str, elem]
function sortFromPair(a,b){

    if (a[0] > b[0]){
        return 1;
    }
    if (a[0] == b[0]){
        return 0;
    }
    return -1;
}



// reusable fx CheckMatch
// source: string
// regexList: list of regexps
// functionality:check if anything inside regexList is within source string
function checkMatch(source, regexList){
    for (let regex of regexList){
        if (source.match(regex) != null){
            return true;
        }

    }
    return false;
}
function findMatch(source, regexList){
    for (let regex of regexList){
        if (source.match(regex) != null){
            return source.match(regex);
        }

    }
    return null;
}

// extract and del matched things
// non-reusable function, raw is specific to the website of interest where
// all of the text is at position 0
// and separate entries are at the other positions


/*
(12) ['ShippingAttention IncompleteUnfulfilledGrocery Emo…umpkin EmotisE859x 1Sweater Weather EmotisE451x 1', 'ShippingAttention IncompleteUnfulfilled', 'Grocery EmotisE639', 'Halloween Emoti Countdowns 2021Classic ColoursClassic ColoursE855C', 'Superheroes Emotis SamplerOriginal ColoursOriginal ColoursE462', 'Halloween Mug DoodlesE282', 'Halloween Decorative BoxesE697', 'Large Cozy Halloween DoodlesE1012', 'Autumn Mug DoodlesE689', 'Fall Bucket List EmotisE277', 'Pumpkin EmotisE859', 'Sweater Weather EmotisE451']
*/


//class="Polaris-Text--root_yj4ah Polaris-Text--bodyMd_jaf4s Polaris-Text--medium_oli4o Polaris-Text--subdued_17vaa" E...
//class="andSu" item ct
//get all child of 1fqes
//get all horizontal stacks
// returns two lists: wordList = list[str], indexList = list[[index:str, desc:str]]
// sort on condition: wordList : wordList[i], indexList: indexList[i][0]
// raw: a str list that contains both ones with indices and no indices
function extract(raw){
    var indices = []
    var words = []
    for (let item of raw){
        if (checkMatch(item[0], regexExp)){
            indices.push([findMatch(item[0], regexExp)[0],item[1]]); // [sorterVal, DocElem]
        }else{
            words.push(item); //[sorterVal, DocElem]
        }
    }

    console.log("new indices and words");
    console.log(indices);
    console.log(words)
    //console.log(Array.from("asfsadfsadfasdfE1002Aasdfasdfad".match(regexExp[0])));



    return [indices, words];
}

// update on button click. Main function
function onClickExt(){
    console.log("ext btn was clicked");

    setTimeout(function(){
        update();

        displayUI(indexList,wordList);

    }, 1000);
}





//TBD: printout
// space between items
// no repeats
// move # of items forward