// ==UserScript==
// @name       DK1Gold
// @version    0.15
// @description  scrape DK page and put stock trades in header
// @match      https://twitter.com/CTLTrading1
// @copyright  2012+, You
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/12083
// @downloadURL https://update.greasyfork.org/scripts/13042/DK1Gold.user.js
// @updateURL https://update.greasyfork.org/scripts/13042/DK1Gold.meta.js
// ==/UserScript==



var sideBar = $('.ProfileHeaderCard-bio');
var div = document.createElement('div');

div.id = 'dkDiv';
var table = document.createElement('table');
sideBar.prepend(div);

//debugger;

var divNote = document.createElement('div');
divNote.id = 'dkNote';
divNote.setAttribute('style',"display:none;position:fixed; left:60px;top:60px;background-color:white;z-index:50;border-style:solid;border-width:3px");
$(divNote).mousedown(function(event){hideNote(event)});
div.appendChild(divNote);

var thead = document.createElement('thead');
var tr = document.createElement('tr');
var td = document.createElement('td');
table.id = 'dkTickers';
td.textContent = 'Sym';
$(td).click(function(){saveLocalStorage()});
tr.appendChild(td);
thead.appendChild(tr);
table.appendChild(thead);
div.appendChild(table);

var tbody = document.createElement('tbody');
table.appendChild(tbody);


//var ol = document.getElementsByClassName('stream profile-stream')[0];
//var tweets = ol.getElementsByTagName('li');
var re = /\$[A-z0-9_\/]{1,6}/g
var re2 = /[A-z]/


//https://twitter.com/i/profiles/show/CTLTrading1/timeline?include_available_features=1&include_entities=1&last_note_ts=1444231770&max_position=652476771917516800&reset_error_state=false

//var tickers = [];
//var notes = [];
var noteSelected = -1;
var tweetDic = [];
var tableRows = [];
var currentSort = true;
var today = new Date();
today = new Date(today.getFullYear(),today.getMonth(),today.getDate(),3,0);
today = today.getTime();
loadLocalStorage();
checkTweets2();
makeTable();

function loadLocalStorage(){
    for (var i = 0; i < localStorage.length; i++){
        if(!isNaN(+localStorage.key(i))){
            var arr = JSON.parse(localStorage.getItem(localStorage.key(i)));
            var tweetText = arr[1];
            var TS = arr[0];
            var ticker = tweetText.match(re);
            var row = findIndex(ticker[0])
            var twt = new dkTweet(TS,tweetText);

            if(row >= 0){//ticker exists in list

                var sym = tweetDic[row];
                sym.add(twt);
                if(TS > sym.lastUpdate)
                    sym.lastUpdate = TS;
                if(checkTrade(twt)){
                    sym.tradeToday = true;
                    makeSound = true;
                }


            }else{

                tweetDic.push(new tweetSym(ticker[0],twt));
           
            }
        }
    }

}


window.onbeforeunload = confirmExit;
function confirmExit(){
    saveLocalStorage();
    return null;
}

function saveLocalStorage(){
    var numTweets = 0;
    for(var i = 0; i < tweetDic.length;i++){
        var sym = tweetDic[i];
        var tweetOrder = sym.tweetOrder;

        for(var j = 0; j < tweetOrder.length;j++){
            if(tweetOrder[j].tweetText.indexOf('*') >= 0){//only store trades and updates.
                localStorage.setItem(numTweets++,JSON.stringify([tweetOrder[j].TS,tweetOrder[j].tweetText]));
            }
        }

    }
}



function hideNote(e){//user click on note it will hide

    if(e.which ==2){
        e.preventDefault();
        divNote.style.display = 'none';
    }

}


function checkNewTweet(){
    $(".new-tweets-bar").click()
    //need to make sound or something...
    if(checkTweets2()){
        blah = 1;
    }

    makeTable();
}

//link to table and update table / sort table by TS or ticker


function findIndex(s){
    for(var i = 0; i < tweetDic.length;i++){
        if(tweetDic[i].symbol == s) return i;
    }
    return -1;
}


function makeTable(){//false = alphabetical, true = TS
    $(tbody).empty();//remove rows
    var sortOrder = [];
    if(currentSort) tweetDic.sort(sortLastUpdate);
    else tweetDic.sort(sortSym);

    for(var i = 0; i < tweetDic.length;i++){
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.setAttribute('num',i);
        $(td).click(function(){ showNote2(this)});
        //console.log(tLen);

        if(tweetDic[i].tradeToday){
            td.innerHTML = "<strong>" + tweetDic[i].symbol + "</strong>";
        }else{
            td.textContent = tweetDic[i].symbol;
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function showNote2(me){
    var num = +me.getAttribute('num');
    divNote.innerHTML = tweetDic[num].getTweets();
    divNote.style.display = '';
    noteSelected = num;
}


function sortLastUpdate(a,b){
    return b.lastUpdate - a.lastUpdate;
}

function sortSym(a,b){
    //debugger;
    return a.symbol < b.symbol;
}



function tweetSym(symbol,twt){
    this.symbol = symbol;
    this.tweetOrder= [twt];
    this.lastUpdate = twt.TS;
    this.tradeToday = checkTrade(twt);


    this.removeDuplicates = function(){
        for(var i = this.tweetOrder.length-1; i > 0;i--){
            if(this.tweetOrder[i].TS == this.tweetOrder[i-1].TS){//if 2 tweets have the same TS get rid of one of them
                this.tweetOrder.splice(i,1);
            }
        }
    }

    this.add = function(tweet){
        this.tweetOrder.push(tweet);
    }

    this.sortTweets = function(){
        this.tweetOrder.sort(sortLogic);
        this.removeDuplicates();
    }

    this.getTweets = function(){
        var str = "<p style='white-space:pre'>";
        for(var i = 0; i < this.tweetOrder.length;i++){
            var d = new Date(this.tweetOrder[i].TS)
            var min = d.getMinutes();
            min = min < 10 ? "0" + min : min;
            var date = (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + min;
            str += this.tweetOrder[i].tweetText + "         " + date + "<br>";
        }
        str += "</p>"
        return str;
    }


}

function dkTweet(ts,txt){//this object will need save in localStorage
    this.TS = +ts;
    this.tweetText = txt
}

function sortLogic(a,b){
    return a.TS - b.TS;
}



function checkTrade(twt){
    if(twt.TS > today && twt.tweetText.indexOf('**') >= 0){
        return true;
    }else return false;

}



function checkTweets2(){
    var tweets = document.getElementsByClassName('tweet-text');
    var makeSound = false;
    for(var i = 0; i < tweets.length;i++){
        var tweet = tweets[i];
        if(tweet != undefined && !tweet.hasAttribute('newTweet')){
            var tweetText = tweet.textContent
            var foundTweet = -1;
            //check if has stock / future trade
            if (tweetText.indexOf('$') > -1) {
                var ticker = tweetText.match(re);
                if(ticker != null){//found some matches and not just numbers
                    for(j = 0; j < ticker.length;j++){
                        //console.log(ticker[j]);
                        if(re2.test(ticker[j])){//not just numbers in ticker

                            var TS = $(tweet.previousElementSibling).find('span._timestamp')[0].getAttribute('data-time-ms')

                            var row = findIndex(ticker[j])
                            var twt = new dkTweet(TS,tweetText);
                            foundTweet = row;
                            if(row >= 0){//ticker exists in list

                                var sym = tweetDic[row];
                                sym.add(twt);
                                if(TS > sym.lastUpdate)
                                    sym.lastUpdate = TS;
                                if(checkTrade(twt)){
                                    sym.tradeToday = true;
                                    makeSound = true;
                                }


                            }else{

                                tweetDic.push(new tweetSym(ticker[j],twt));
                                if(tweetDic[tweetDic.length-1].tradeToday){
                                    makeSound = true;
                                }
                            }


                        }
                    }

                }
            }
        }

        tweets[i].setAttribute('newTweet',1);
        if(foundTweet >= 0){
            tweetDic[row].sortTweets();
        }
    }
    return makeSound;
}


(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        //console.log('request started!');
        this.addEventListener('load', function() {
            //console.log('request completed!');
            //console.log(this.readyState); //will always be 4 (ajax is completed successfully)
            //console.log(this.responseText); //whatever the response was

            if(this.responseURL.substring(0,36) == "https://twitter.com/i/profiles/show/"){//loading more pages
                var tweets_html = JSON.parse(this.responseText)
                if(tweets_html.inner != undefined && tweets_html.inner.new_tweets_bar_html != undefined)
                    setTimeout(function(){checkNewTweet()},250);
                else{
                    checkTweets2();//scroll down page
                    makeTable();
                }
            }
        });
        origOpen.apply(this, arguments);
    };
})();

