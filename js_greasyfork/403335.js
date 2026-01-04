// ==UserScript==
// @name         Picking Songs in iirose
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Support music.163.com and Xiami.com now!
// @author       Keane
// @match        https://iirose.com/messages.html
// @match        https://emumo.xiami.com/radio/play/*
// @match        https://www.xiami.com/*
// @match        https://music.163.com/
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/403335/Picking%20Songs%20in%20iirose.user.js
// @updateURL https://update.greasyfork.org/scripts/403335/Picking%20Songs%20in%20iirose.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //get url of current page
    var url = window.location.href;
    GM.setValue("song", -5);//default to be -5 means null
    var autoPicking = true;
    var XMPicking = true;
    var WYPicking = true;
    //save a shuffled song list and current pointer
    var shuffledSongList = [];
    var shufflePointer = 0;

    var WYMutationNode;
    var WYConfig = {attributes: true, childList: true, subtree: true};
    var WYCurrentURL = "";
    //mutation observer callback function
    const WYcallback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            //console.log("網易音乐切换了");
            if (mutation.type === 'childList') {
                //console.log('The child attribute was modified.');
                if(WYCurrentURL != document.getElementsByClassName("f-thide name fc1 f-fl")[0].getAttribute("href")){
                    WYCurrentURL = document.getElementsByClassName("f-thide name fc1 f-fl")[0].getAttribute("href");
                    console.log('The new song URL is '+WYCurrentURL);
                    SendMessage(WYMusicParser(WYCurrentURL));
                }
            }
        }
    };
    const WYobserver = new MutationObserver(WYcallback);


    //for xiami radio page
    if (url.search("xiami.com/radio")>=0){
        var timerXiami = setInterval(function(){

            if(document.getElementsByClassName("artist_info fl")[0]!=undefined){
                clearInterval(timerXiami);

                xiami_old();
            }
        }, 1000);
    }
    //for iirose
    else if (url.search("iirose.com")>=0){
        iirose();
    }
    //for xiami new view
    else if (url.search("xiami.com")>=0){
        xiami_new();
    }
    //for 163 music
    else if (url.search("music.163.com/")>=0){
        console.log(document.getElementsByClassName("f-thide name fc1 f-fl")[0].innerHTML);
        WYMusic();

    }
    else {
        console.log("Failed to match the website!");
    }

    //a quick shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    //a simple sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //xiami Collection starts
    function xiamiCollection(){
        //generate a button

        console.log("51");

        var parentDiv = document.getElementById("element_r");
        var newNode = document.createElement ('div');
        newNode.innerHTML='<form style="font-size:16px">'
            +'<br><br>给蔷薇花园点歌！<br><br>'
            +'从：<input type="number" name="startNum" max="50" style="border: 2px solid red;font-size: 16px;"> <br><br>到：<input type="number" name="endNum" style="border: 2px solid red;font-size: 16px;"><br><br>'
            +'点：<input type="number" name="pickNum" min="1" max="10" style="border: 2px solid red;font-size: 16px;"> 首<br><br>'
            +'<input type="checkbox" name="random" value="random" style="border: 2px solid red;font-size: 16px;">   随机播放<br><br>'
            +'<input id="pick!" type="button" style="background-color: #4CAF50;font-size: 16px;text-align:center;" value="  点歌！ "> <br><br>'
            +'<input id="pickFive!" type="button" style="background-color: #4CAF50;font-size: 16px;text-align:center;" value="  点五首歌！ "> </form>';
        parentDiv.appendChild (newNode);
        document.getElementById("pick!").addEventListener("click", pickCollection);
        document.getElementById("pickFive!").addEventListener("click", pickCollectionFive);
        /*
            <form>
            从：
            <input type="number" name="startNum" min="1" max="5">
            到：
            <input type="number" name="endNum" min="1" max="5">
            <br>
            点
            <input type="number" name="pickNum" min="1" max="5">
            首
            <br>
            <input type="checkbox" name="random" value="random"> 随机播放<br>
            <input type="submit">
            </form>
            */

    }
    async function pickCollection(){
        //for xiami collection        
        var songList = getSongList();
        console.log("song size is "+songList.length);
        var pickList = [];
        var startP = document.getElementsByName("startNum")[0].value;
        var endP = document.getElementsByName("endNum")[0].value;
        var range = document.getElementsByName("pickNum")[0].value;
        var random = document.getElementsByName("random")[0].checked;
        console.log("new89"+startP+endP+range+random);
        if (isNaN(startP)){ startP=0;
                          }
        if (isNaN(endP)){ endP=50;
                        }
        if (isNaN(range)){ range=5;
                         }
        startP = parseInt(startP);endP = parseInt(endP);range = parseInt(range);
        if (range>endP-startP){startP=1;endP=50;
                              }
        pickList = songList.slice(startP, endP);

        if (random){
            shuffleArray(pickList);
        }

        var song;
        var count = 1;
        await sleep(2000);
        for (song of pickList){
            if (count>range){break;}
            song.replace( /\s\s+/g, ' ' );
            GM.setValue("song", song);
            console.log("sended "+song);
            count += 1;
            await sleep(2000);
        }

    }
    async function pickCollectionFive(){
        //for xiami collection
        if (shuffledSongList.length==0){
            shuffledSongList = getSongList();
            shuffleArray(shuffledSongList);
        }

        console.log("song size is "+shuffledSongList.length);
        var pickList = [];
        var range = 5;
        console.log("ShufflePointer (before):"+shufflePointer);
        if (shufflePointer+range+1>shuffledSongList.length){
            pickList=shuffledSongList.slice(shufflePointer).concat(shuffledSongList.slice(0, shufflePointer+range-shuffledSongList.length));
            shufflePointer=shufflePointer+range-shuffledSongList.length;
        }
        else {
            pickList = shuffledSongList.slice(shufflePointer, shufflePointer+range);
            shufflePointer=shufflePointer+range;
        }
        console.log("ShufflePointer (after):"+shufflePointer);

        var song;
        var count = 1;
        await sleep(2000);
        for (song of pickList){
            song.replace( /\s\s+/g, ' ' );
            GM.setValue("song", song);
            console.log("sended "+song);

            await sleep(2000);
        }


    }
    function getSongList(){
        var list = document.getElementsByClassName("song_name");
        var listSize = list.length;
        var tempNode;
        var songList = [];
        for (tempNode of list){
            var songNameList=tempNode.innerText.split("-—")[0].split(" "); // like ["Return", "Of", "The", "Mack", "(...", ""]
            var tempSoneNameNode;
            var songName="";
            for (tempSoneNameNode of songNameList){
                if (tempSoneNameNode.search(/\.\.\./)>=0){
                    //console.log("99"+tempSoneNameNode);
                    break;
                }
                tempSoneNameNode=tempSoneNameNode.replace('(','').replace(')','');
                songName += tempSoneNameNode;
                songName += ' ';
            }
            var artisitList=tempNode.innerText.split("-—")[1].split(";");//like [" Dale Castell", "Tamia"]
            var lastWord = artisitList[artisitList.length-1].split(' ').slice(-1)[0];
            if (lastWord=='MV'){
                //console.log('before: '+artisitList);
                artisitList[artisitList.length-1]=artisitList[artisitList.length-1].split(' ').slice(0,-1).join(' ');
                //console.log('after: '+artisitList);
            }
            var artisitName=artisitList.join(' ');
            songList.push(songName+'|'+artisitName);
            //console.log(songName+'|'+artisitName);
        }
        return songList;
    }


    //163 music starts here
    function WYMusic(){
        WYMutationNode = document.getElementsByClassName("j-flag words")[0];
        WYCurrentURL = document.getElementsByClassName("f-thide name fc1 f-fl")[0].getAttribute("href");
        WYobserver.observe(WYMutationNode, WYConfig);
        console.log("observer starts");
    }

    function WYMusicParser(url){
        var songID = url.split("=")[1];
        var msgString = "WY|"+songID;
        return msgString;
    }

    //xiami music starts here
    function xiami_old(){
        //send first message to iirose

        xiamiInfoParser(false);

        //an api that can be used to monitor changes in the webpage
        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                //console.log(mutation);

                //send message whenever it observers a change
                xiamiInfoParser(false);

            });
        });

        //it focuses on the title of the page
        mutationObserver.observe(document.querySelector('title'), {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });


    }
    function xiami_new(){
        sleep(200);
        //send first message to iirose, or not
        //xiamiSendMessage(xiamiInfoParser(false));
        addXMLRequestCallback( function( xhr ) {
            //check if is getPlayInfo request
            if (xhr.__sufei_url.search("getPlayInfo")>-1){
                var songID = xhr.__sufei_url.split('[')[1].split(']')[0];
                console.log("the new song's ID is "+songID.toString());
                xiamiInfoParser(true, songID);
            }
        });

    }
    //add a hook to XML requests
    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }
    //get music info to send to iirose
    function xiamiInfoParser(isnew, songID=""){
        if(isnew){
            console.log("sending " + songID.toString());
            SendMessage("xm|"+songID);
        }
        else{
            var timerXiamiMessage = setInterval(function () {
                //this timer waits for the page to load every 0.1s
                //if the artist info is loaded we assume the page finished loading cuz that's what we need.
                if(document.getElementsByClassName("artist_info fl")[0]!=null){
                    clearInterval(timerXiamiMessage);

                    //get song name and artist name
                    var songName = document.title.split("——")[0];
                    var artistName = document.getElementsByClassName("artist_info fl")[0].getElementsByTagName("strong")[0].innerHTML;
                    var message = songName+"|"+artistName;

                    SendMessage( message);

                    //set the "song" value with the above info

                }
            }, 100);}
    }

    //send info to iirose
    function SendMessage(msg){
        GM.setValue("song", msg);
        console.log("sended "+msg);

    }

    //play with iirose
    async function iirose(){
        //this timer checks if the window has loaded. Do checking every 3 seconds.
        createBtns();
        if (autoPicking){
            var timer = setInterval(function () {
                if(document.getElementById("moveinput")!=null){
                    clearInterval(timer);

                    //current song info
                    var tempSong=-5;

                    //this timer checks if there is a new message from xiami
                    var pickTimer = setInterval(async function () {

                        //get value from xiami. If not changed, do nothing and wait
                        var realSong = await GM.getValue("song", -5);
                        if(realSong!=tempSong){

                            //changed! pick the real song here
                            console.log("successfully recieve message "+realSong);
                            await pickingSong(realSong);

                            //update tempSong
                            tempSong = realSong;
                        }


                        //console.log("one more loop in iirose");
                    }, 500);
                }

            }, 3000);
        }
        return;
    }

    //pick a song with the sring
    //pick with songID
    function XMDirectPicking(url) {
        var t = url.trim();
        if (t) {
            var o = t.match(Variable.regexp.assets.getLink);
            o ? ("[" == t[0] && (o[0] = t.replace(Variable.regexp.pregmedia.linkSpaceAround2, "$1")),
                 Utils.service.moveinputDo("<> " + o[0])) : "#" == t[0] ? Utils.service.moveinputDo(t) : (-1 < Constant.Shortcuts.all.indexOf("@" + t) && (t += " "),
                                                                                                          Utils.service.moveinputDo("@" + (" " == e[0] ? " " : "") + t))
        }
    }
    function WYDirectPicking(url){
        var t = url.trim();
        if (t) {
            var o = t.match(Variable.regexp.assets.getLink);
            o ? ("[" == t[0] && (o[0] = t.replace(Variable.regexp.pregmedia.linkSpaceAround2, "$1")),
                 Utils.service.moveinputDo("<> " + o[0])) : "#" == t[0] ? Utils.service.moveinputDo(t) : (-1 < Constant.Shortcuts.all.indexOf("@" + t) && (t += " "),
                                                                                                          Utils.service.moveinputDo("@" + (" " == e[0] ? " " : "") + t))
        }
    }
    //pick with song name & artisit name (old version)
    function pickingSong(songInfo){
        if (songInfo=='-5') return;
        var inputArray = songInfo.split("|");

        if(!isNaN(inputArray[1])){
            if (inputArray[0]=='xm'){
                if (!XMPicking){console.log("虾米点歌功能已关闭");return;}
                console.log('recieved Xiami songID '+inputArray[1]);
                var url = "https://www.xiami.com/song/"+inputArray[1].toString();
                XMDirectPicking(url);
            }
            else if (inputArray[0]=='WY'){
                if (!WYPicking){console.log("网易云点歌功能已关闭");return;}
                console.log('recieved 163 songID '+inputArray[1]);
                url = "https://music.163.com/#/song?id="+inputArray[1].toString();
                WYDirectPicking(url);
            }
        }
        else{
            var str = songInfo.replace("|"," ");
            inputString("@"+str);

            //this timer checks whether the search results have loaded
            var timer2 = setInterval(function () {

                //if find nothing OR have found some songs, end the timer
                if((document.getElementsByClassName("emptyShow")[0]!=null)||(document.getElementsByClassName("demandHolderPlayBtn")[0]!=null)){

                    //if find something
                    if(document.getElementsByClassName("emptyShow")[0]==null){
                        var songList = document.getElementsByClassName("demandHolderPlayBtn");
                        //console.log(songList[0]);


                        if(songList[0].getElementsByClassName("mainColor")[0].getElementsByClassName("buttonText")[0]!=null){
                            clearInterval(timer2);
                            //if successfully pick a song
                            var flag = 0;

                            //loop until one button can be clicked
                            for (var i = 0; i < songList.length; i++) {

                                var node = null;
                                for (var j = 0; j < songList[i].childNodes.length; j++) {
                                    if (songList[i].childNodes[j].className == "mainColor") {
                                        node = songList[i].childNodes[j];
                                        break;
                                    }
                                }

                                //check if clickable
                                if (node.hasAttribute("onclick")){
                                    node.click();
                                    console.log("pick "+i);
                                    flag=1;
                                    break;
                                }
                                console.log("cannot pick "+i);
                            }

                            //no button was clicked. Go back
                            if (flag==0){
                                //click return
                                console.log("failed");
                                //document.getElementsByClassName("footerItemBgShape_pointer")[0].onclick.apply();
                                Objs.demandHolder.function.event.call(this,0);
                                inputString("点歌失败，因为没有 "+str+" 的版权。");
                            }
                        }
                    }
                    //if find nothing
                    else {

                        //这里有bug!!
                        clearInterval(timer2);
                        Objs.demandHolder.function.event.call(this,0);
                        //document.getElementsByClassName("footerItemBgShape_pointer")[0].onclick.apply();
                        var strList=songInfo.split("|");
                        if (strList.length>1){
                            inputString("点歌失败，因为搜索不到 "+str+"。尝试模糊搜索 "+strList[0]);
                            setTimeout(function(){pickingSong(strList[0]);}, 1000)
                        }
                        else{
                            inputString("模糊搜索也失败了。");
                            //location.reload();
                        }

                    }





                }
                //
            }, 800);

            //var newSize = songlist.length;//for future use
        }

    }

    //some tools
    //create a set of buttons in menu
    function createBtns(){
        var headerDiv;
        if (!document.getElementById("customHeader")) {
            var heziDiv = document.getElementsByClassName("functionButton functionButtonGroup")[7];
            headerDiv = document.getElementsByClassName("functionButton functionButtonGroup")[7].cloneNode(true);
            headerDiv.children[0].className = "functionBtnIcon mdi-lightbulb-on";
            headerDiv.children[1].innerHTML = "自定义";
            headerDiv.id = "customHeader";
            heziDiv.parentNode.insertBefore(headerDiv, heziDiv);
        }
        headerDiv = document.getElementById("customHeader");
        var btnHolderDiv;
        if (!document.getElementById("customBox")) {
            btnHolderDiv = document.createElement("div");
            btnHolderDiv.id = "customBox";
            btnHolderDiv.className = "functionItemBox";
            headerDiv.parentNode.insertBefore(btnHolderDiv, headerDiv.nextSibling);
        }
        btnHolderDiv = document.getElementById("customBox");

        var XnewNodeSpan0 = document.createElement("span");
        var XnewNodeSpan1 = document.createElement("span");
        var XnewNodeDiv = document.createElement("div");
        var WnewNodeSpan0 = document.createElement("span");
        var WnewNodeSpan1 = document.createElement("span");
        var WnewNodeDiv = document.createElement("div");
        var style = document.createElement('style');

        XnewNodeSpan0.className = "functionBtnIcon mdi-music";
        XnewNodeSpan0.id = "xiami-music";
        XnewNodeSpan1.className = "functionBtnFont";
        XnewNodeSpan1.id = "XiamiText";
        XnewNodeSpan1.innerHTML = " 虾米自动点歌    ： 开启";
        XnewNodeDiv.className = "functionButton";
        XnewNodeDiv.id = "XiamiBtn";
        XnewNodeDiv.onclick = function(){togglePicking("xiami")};
        XnewNodeDiv.append(XnewNodeSpan0);
        XnewNodeDiv.append(XnewNodeSpan1);
        btnHolderDiv.append(XnewNodeDiv);

        WnewNodeSpan0.className = "functionBtnIcon mdi-music";
        WnewNodeSpan0.id = "wangyi-music";
        WnewNodeSpan1.className = "functionBtnFont";
        WnewNodeSpan1.id = "WangyiText";
        WnewNodeSpan1.innerHTML = "网易云自动点歌： 开启";
        WnewNodeDiv.className = "functionButton";
        WnewNodeDiv.id = "WangyiBtn";
        WnewNodeDiv.onclick = function(){togglePicking("wangyi")};
        WnewNodeDiv.append(WnewNodeSpan0);
        WnewNodeDiv.append(WnewNodeSpan1);
        btnHolderDiv.append(WnewNodeDiv);

    }
    function togglePicking(website){
        if (website=='xiami'){
            var Xnode = document.getElementById("xiami-music");
            if (XMPicking) {
                Xnode.className = "functionBtnIcon mdi-music-off";
                document.getElementById("XiamiText").innerHTML = " 虾米自动点歌    ： 关闭";
                _alert("虾米自动点歌已暂停");
            }
            else {
                Xnode.className = "functionBtnIcon mdi-music";
                document.getElementById("XiamiText").innerHTML = " 虾米自动点歌    ： 开启";
                _alert("虾米自动点歌已开始");
            }
            XMPicking = !XMPicking;

        }
        else if (website=='wangyi'){
            var Wnode = document.getElementById("wangyi-music");
            if (WYPicking) {
                Wnode.className = "functionBtnIcon mdi-music-off";
                document.getElementById("WangyiText").innerHTML = "网易云自动点歌： 关闭";
                _alert("网易云自动点歌已暂停");
            }
            else {
                Wnode.className = "functionBtnIcon mdi-music";
                document.getElementById("WangyiText").innerHTML = "网易云自动点歌： 开启";
                _alert("网易云自动点歌已开始");
                 }
            WYPicking = !WYPicking;
        }
        else {
            _alert("Error: Invalid Input.");
        }

    }
    //this method types and submit a string in the typearea
    function inputString(str){
        /*
        var inputBox = document.getElementById("moveinput");
        var originText = inputBox.value;
        var submit = document.getElementsByClassName("moveinputSendBtn")[0];
        inputBox.value = str;
        submit.click();
        inputBox.value = originText;
        */
        Utils.service.moveinputDo(str);
    }

    //this method add a script to html so that u can use the script in console
    function addScript(scriptText){
        var scriptElem = document.createElement('script');
        scriptElem.innerHTML = scriptText;
        document.body.appendChild(scriptElem);
    }

    // Your code here...
})();
