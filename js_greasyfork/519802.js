// ==UserScript==
// @name         Hack for no red ink
// @namespace    
// @version      2.0
// @description  shows the answer to the questions in noredink.  When you get a question wrong it will be saved to the database, so the more people who use this script, the more accurate it will be.  currently supports multiple choice, highlighting, multi-highlighting, playground, outlinedraggable and punctuation question types and more will be added later
// @author       You
// @match        *://www.noredink.com/learn/quiz/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @resource     jqUI_CSS  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css
// @resource     IconSet1  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/images/ui-icons_222222_256x240.png
// @resource     IconSet2  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/images/ui-icons_454545_256x240.png
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519802/Hack%20for%20no%20red%20ink.user.js
// @updateURL https://update.greasyfork.org/scripts/519802/Hack%20for%20no%20red%20ink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    //https://stackoverflow.com/a/11532646
    var iconSet1 = GM_getResourceURL ("IconSet1");
    var iconSet2 = GM_getResourceURL ("IconSet2");
    var jqUI_CssSrc = GM_getResourceText ("jqUI_CSS");
    jqUI_CssSrc = jqUI_CssSrc.replace (/url\(images\/ui\-bg_.*00\.png\)/g, "");
    jqUI_CssSrc = jqUI_CssSrc.replace (/images\/ui-icons_222222_256x240\.png/g, iconSet1);
    jqUI_CssSrc = jqUI_CssSrc.replace (/images\/ui-icons_454545_256x240\.png/g, iconSet2);

    GM_addStyle (jqUI_CssSrc);
    //https://stackoverflow.com/a/25468928
    //--- For this to work well, we must also add-in the jQuery-UI CSS.
    //We add the CSS this way so that the embedded, relatively linked images load correctly.
    //(Use //ajax... so that https or http is selected as appropriate to avoid "mixed content".)

    $("head").append (
        '<link '
        //+ 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/le-frog/jquery-ui.min.css" '
        +'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css'
        + 'rel="stylesheet" type="text/css">'
    );
    //--- Add our custom dialog using jQuery.
    $("body").append (
        `<div id="gmOverlayDialog">
         <button type="button" id="hidedialogue" onclick="$(this).parent().hide();$('.ui-dialog').on('click','.ui-dialog-titlebar', ()=>{$(this).parent().show();$(this).parent().parent().width(300);$('span.ui-dialog-title').text('options');});$('span.ui-dialog-title').text('🇳🔧'); $(this).parent().parent().width(100);$('.ui-resizable-handle').hide();">hide window</button>
         <fieldset>
         <legend>get all wrong: </legend>
         <label for="radio-1">on</label>
         <input type="radio" name="radio-1" id="radio-1" value="on">
         <label for="radio-2">off</label>
         <input type="radio" name="radio-1" id="radio-2" value="off">
         </fieldset>
         <fieldset>
         <legend>on wrong question proceed: </legend>
         <label for="radio-1">instantly</label>
         <input type="radio" name="radio-2" id="radio-3" value="on">
         <label for="radio-2">delay</label>
         <input type="radio" name="radio-2" id="radio-4" value="off">
         </fieldset>
         <span id="questionInfo"></span>
         </div>`
    );

    //--- Activate the dialog.
    $("#gmOverlayDialog").dialog ( {
        closeOnEscape:false,
        modal:      false,
        title:      "options",
        //position:"relative",
        position:   {
            my: "left top",
            at: "left top",
            of: document
            , collision: "none"
        },
        //width:      "auto",
        width:300,
        minWidth:   300,
        minHeight:  200,
        zIndex:     3666,
        open: function(event, ui) {
            //$(this).hide();//hide it for now i guess
            //https://stackoverflow.com/a/897393
            $(".ui-dialog-titlebar-close", $(this).parent()).hide();
          //document.getElementById("hidedialogue").click();
        }
    } )
        .dialog ("widget").draggable ("option", "containment", "none");

    ////////////////////////////////////////////////////
    var settings_getAllWrong,settings_instantContinue;
    var url=window.location.href;
    var practiceID=url.indexOf("try_similar")==-1?url.split("/learn/quiz/")[1].split("/")[0]:url.split("/learn/quiz/")[1].split("/try_similar")[0];
    var userID;
    //var REST="https://rest-api-for-nri-userscript.herokuapp.com/api/";
    var REST="https://rest-api-for-userscript-1.lukec1.repl.co/api/";
    var question;
    var choice=[];
    var $keyElements=["html>body>div:eq(2)>div>div>div:eq(0)>header>h2"];//,"html>body>div:eq(2)>div>div:eq(0)>div:eq(0)>header>h2"];
    var $trySimilar="html>body>div:eq(3)>div:eq(1)>div>div>div>button";
    var numOfChoices=0;
    //var trysimilartype;
    ///////////////
    function addQuestion(id,question,answer,callback){
        $.get(REST+"addanswer/"+id+"/"+encodeURIComponent(question)+"/"+encodeURIComponent(answer), function(result){
            console.log(result);
            callback(result);
        });
    }
    function getQuestions(id,question){
        //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>div>img").attr("src","https://www.streamscheme.com/wp-content/uploads/2020/04/poggers.png");
        //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>div>img").hide();
        //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").text("loading question info...");
        document.body.getElementsByTagName("h2")[0].innerText="loading question info...";
        //for some reason normal jquery ajax doesnt work here
        GM.xmlHttpRequest({//https://wiki.greasespot.net/GM.xmlHttpRequest#GET_request
            method: "GET",
            url: REST+"search/"+id+"/"+question,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var responseXML = null;
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));
                if(response.responseText!=="no match"){
                    var question=JSON.parse(response.responseText).question;
                    var answer=JSON.parse(response.responseText).answer;
                    var confidence=JSON.parse(response.responseText).confidence;
                    console.log("answer: "+answer+"\nconfidence"+confidence);
                    //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").attr("style", "white-space: pre;");
                    document.body.getElementsByTagName("h2")[0].setAttribute("style","white-space: pre;");
                    //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").text("question: "+question+"\r\nanswer: "+answer+"\r\nconfidence: "+confidence);
                    document.body.getElementsByTagName("h2")[0].innerText="question: "+question+"\r\nanswer: "+answer+"\r\nconfidence: "+confidence;

                }else{
                    console.log(response.responseText);
                    //alert(encodeURIComponent(document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("p")[0].innerHtml));
                    //$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section:eq(1)>article>span:eq(0)>button>span>div>span").text(response.responseText);
                    document.body.getElementsByTagName("h2")[0].innerText=response.responseText;

                }

            }


        });
    }
  function getNumOfQuestion(id,callback){
        GM.xmlHttpRequest({//https://wiki.greasespot.net/GM.xmlHttpRequest#GET_request
            method: "GET",
            url: REST+"search/"+id+"/",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var responseXML = null;
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));
              callback((Object.keys(JSON.parse(response.responseText)).length>=1)?(Object.keys(JSON.parse(response.responseText)).length-1):0);

            }


        });
    }
    /*function findClosestStringInArray(array,_string){

        var a = FuzzySet();
        array.forEach((i)=>{a.add(i)});
        return a.get(_string);
    }*/
    function setUserSettings(userid,setting,value,callback){
        $.get(REST+"addanswer/"+userid+"/"+encodeURIComponent(setting)+"/"+encodeURIComponent(value), function(result){
            console.log(result);
            callback(result);
        });
    }
    function getUserSettings(userid,callback){
        GM.xmlHttpRequest({//https://wiki.greasespot.net/GM.xmlHttpRequest#GET_request
            method: "GET",
            url: REST+"search/user"+userid,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var responseXML = null;
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));

                callback(JSON.parse(response.responseText).getAllWrong,JSON.parse(response.responseText).instantContinue);//callback(get all wrong?, continue instantly on incorrect?)
            }
        });
    }
  
    function getTrySimilarQuestionType(callback){
        GM.xmlHttpRequest({//https://wiki.greasespot.net/GM.xmlHttpRequest#GET_request
            method: "GET",
            url: REST+"search/"+practiceID,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var responseXML = null;
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));

                callback(JSON.parse(response.responseText).type);
            }
        });
    }
  function getServerStatus(callback){
        GM.xmlHttpRequest({//https://wiki.greasespot.net/GM.xmlHttpRequest#GET_request
            method: "GET",
            url: REST+"test/",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var responseXML = null;
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));
                callback(response.responseText=="hello world!");
            }
        });
    }
    function getQuestionType(){
        var qType="error";
        /*if(document.getElementById("nri-yellow").length>-1){
            qType="highlighter"
        }
        else if($("html>body>div:eq(3)>div>div>div:eq(1)>div>section>div:eq(1)>section>section>button:eq(0)>span").length>-1){
            qType="multiplechoice";
        }*/
        if(url.indexOf("try_similar")==-1){//not trysimilar
            qType=JSON.parse(document.getElementById("quiz-question").getElementsByTagName("div")[0].getAttribute("data-data")).questionType;
            addQuestion(practiceID,"type",qType,(result)=>{console.log(result)});
        }else{
            //
        }
        return qType;
    }
    /*class jqWindow{
        constructor(_title,_id){
            this.title=_title;
            this.id=_id;
        }
        create(){
            var div=document.createElement("DIV");
            div.title=this.setAttribute("title",this.title);
            div.id=this.setAttribute("id",this.id);
            document.body.appendChild(div);
            $(div).dialog();
        }
    }*/
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    var waitForItToLoad=setInterval(()=>{
        $keyElements.forEach(i=>{if($(i).length>-1){//checks if one of the key elements have loaded aka the page finished loaded
            userID=document.head.getElementsByTagName("script")[2].innerHTML.split("id: ")[1].split(",")[0];
          
            //https://stackoverflow.com/a/13152970
            $('input[type=radio][name=radio-1]').change(function() {//getAllWrong
                if (this.value == 'on') {
                    //alert("on");
                    setUserSettings("user"+userID,"getAllWrong","on",(result)=>{console.log(result)});
                    setTimeout(()=>{$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section>article>div>button").click()},getRndInteger(100,500));//automatically click next button to get all wrong and collect data fast
                }
                else if (this.value == 'off') {
                    //alert("off");
                    setUserSettings("user"+userID,"getAllWrong","off",(result)=>{console.log(result)});
                }
            });
          $('input[type=radio][name=radio-2]').change(function() {//instantContinue
                if (this.value == 'on') {
                    //alert("on");
                    setUserSettings("user"+userID,"instantContinue","on",(result)=>{console.log(result)});
                    setTimeout(()=>{$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section>article>div>button").click()},getRndInteger(100,500));//automatically click next button to get all wrong and collect data fast
                }
                else if (this.value == 'off') {
                    //alert("off");
                    setUserSettings("user"+userID,"instantContinue","off",(result)=>{console.log(result)});
                }
            });
          //document.getElementById("hidedialogue").click();
            getUserSettings(userID,(gotAllWrong,instontContinue)=>{//get the users settings if saved
                //alert(gotAllWrong);
                $('input[type=radio][name=radio-1][value=on]').prop("checked",(gotAllWrong=="on"));
                $('input[type=radio][name=radio-1][value=off]').prop("checked",(gotAllWrong=="off"));
                settings_getAllWrong=gotAllWrong=="on";//true:false
                $('input[type=radio][name=radio-2][value=on]').prop("checked",(instontContinue=="on"));
                $('input[type=radio][name=radio-2][value=off]').prop("checked",(instontContinue=="off"));
                settings_instantContinue=instontContinue=="on";
                if(settings_getAllWrong)setTimeout(()=>{$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section>article>div>button").click();document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button")[getRndInteger(0,3)].click();},getRndInteger(100,500));
            });
            if(url.indexOf("try_similar")==-1){//not on try_similar page aka in a practice question
                //alert(getQuestionType());
                //var window=new jqWindow(10,10,"test","windowid");
                //window.create();
              getServerStatus((status)=>{getNumOfQuestion(practiceID,(numofquestions)=>{document.getElementById("questionInfo").innerText+="type: "+getQuestionType()+"\nquestion id: "+practiceID+"\nuser id: "+userID+"\nserver status: "+((status)?"up":"down");document.getElementById("questionInfo").innerText+="\n"+numofquestions+" answers are available for this practice so far.  ";})});
              
                if(getQuestionType()=="MultipleChoice"){
                    question=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("p")[0].innerText;
                    /*numOfChoices=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button").length;
                    for(var x=0;x<numOfChoices;x++){
                        choice[x]=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("button")[x].innerText;
                    };*/
                    //alert("q:"+question+"\nchoice:"+choice);
                    getQuestions(practiceID,question);

                }else if(getQuestionType()=="Highlighting"){
                    question="";
                    for(var x=0;x<document.getElementById("nri-yellow").getElementsByTagName("span").length-2;x++){
                        question+=document.getElementById("nri-yellow").getElementsByTagName("span")[x].innerText;
                    }
                    //alert(question);
                    getQuestions(practiceID,question);
                }
                else if(getQuestionType()=="OutlineDraggable"){
                  question=document.getElementsByClassName("Nri-Quiz-Layout-Question")[0].getElementsByTagName("p")[0].innerText;
                  getQuestions(practiceID,question);
                }
              else if(getQuestionType()=="Playground"){
                  question=JSON.parse(document.getElementById("quiz-question").getElementsByTagName("div")[0].getAttribute("data-data")).the_question.paragraphs[0].structures[0].sections[0].text;
                  getQuestions(practiceID,question);
                }
              else if(getQuestionType()=="Punctuation"){
                  var temmmmmmp=JSON.parse(document.getElementById("quiz-question").getElementsByTagName("div")[0].getAttribute("data-data")).the_question;
                var numberofthethings=(JSON.stringify(temmmmmmp.sentence)).match(/text/g).length;
                question="";
                  for(var x=0; x<numberofthethings;x++){
                    question+=temmmmmmp.sentence[x].text;
                  }
                //alert(temmmmmmp.the_question.sentence[0].text);
                //alert(question);
                getQuestions(practiceID,question);
                }
            }else if(url.indexOf("try_similar")>-1){//if on try_similar page aka they just got one wrong
                //alert(getQuestionType());
                getTrySimilarQuestionType((result)=>{
                  document.getElementById("questionInfo").innerText+="type: "+result+"\nquestion id: "+practiceID+"\nuser id: "+userID;
                    if(result=="MultipleChoice"){
                        document.getElementById("try-similar-problem").innerText="question data saved";
                        var Question,Answer;
                        var questionjsondata=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[1].getAttribute("data-data"));
                        Question=questionjsondata.sentence;
                        Answer=questionjsondata.correct_option;
                        //alert("q: "+Question+"\na: "+Answer);
                        addQuestion(practiceID,Question,Answer,(result)=>{console.log(result)});
                    }else if(result=="Highlighting"){
                        document.getElementById("try-similar-problem").innerText="question data saved";
                        var _Question="";
                        var _Answer;
                        for(var y=0;y<document.getElementsByClassName("remediation-answer-sentence")[0].getElementsByTagName("span").length/2;y++){
                            _Question+=document.getElementsByClassName("remediation-answer-sentence")[0].getElementsByTagName("span")[y].innerText;
                        }
                        _Answer=document.getElementsByClassName("answer-correct")[0].innerText;
                        //alert(_Answer);
                        //alert(_Question);
                        addQuestion(practiceID,_Question,_Answer,(result)=>{console.log(result)});
                    }else if(result=="OutlineDraggable"){
                        document.getElementById("try-similar-problem").innerText="question data saved";
                        var _answer="";
                      var __question=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[1].getAttribute("data-data")).outline[0].text;
                        var __answer;
                        //_Answer=$("[data-answer='correct']")[0].getElementsByTagName("p")[0].innerText;
                        __answer=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[1].getAttribute("data-data")).correctsByDropzone;
                      for(var corr in __answer){
                        _answer+= __answer[corr];
                      }
                      //alert(__question);
                        //alert(_Answer);
                        //alert(_Question);
                        addQuestion(practiceID,__question,_answer,(result)=>{console.log(result)});
                    }else if(result=="MultiHighlighter"){//WIP
                      /*var datadata=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[0].getAttribute("data-data")).correctAnswer;
                      var tmp="";
                      for(var x=0;x<datadata.length;x++){
                        if(datadata[x].highlighted=="Reasoning")tmp+=datadata[x].text
                      }
                    */
                  }else if(result=="Playground"){
                      //var datadata=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[0].getAttribute("data-data")).correctAnswer;
                  var aaaaanswer=JSON.parse(document.getElementsByClassName("comparison-paragraphs")[0].getElementsByTagName("div")[0].getAttribute("data-data")).comparison_paragraphs[1].playground.paragraphs[1].structures[0].sections[0].text;
                    var qqqqqquestion=JSON.parse(document.getElementsByClassName("comparison-paragraphs")[0].getElementsByTagName("div")[0].getAttribute("data-data")).comparison_paragraphs[1].playground.paragraphs[1].structures[0].sections[0].text;
                    addQuestion(practiceID,encodeURIComponent(qqqqqquestion),encodeURIComponent(aaaaanswer),(result)=>{console.log(result)});
                  }else if(result=="Punctuation"){
                      //var datadata=JSON.parse(document.getElementsByClassName("try-similar-container")[0].getElementsByTagName("div")[0].getAttribute("data-data")).correctAnswer;
                  var aaaaaanswer=document.getElementsByClassName("markdownified-quiz-engine-text markdownified")[1].innerText;
                    var qqqqqqquestion=document.getElementsByClassName("markdownified-quiz-engine-text markdownified")[1].innerText;
                    addQuestion(practiceID,encodeURIComponent(qqqqqqquestion),encodeURIComponent(aaaaaanswer),(result)=>{console.log(result)});
                }
                  
                });
            }else{
                alert("wtf");
            }
            //alert(JSON.Stringify(getQuestions()));

            //alert(question+"\n"+choice);
            clearInterval(waitForItToLoad);
        }});
        var timer=settings_instantContinue==false?3:0;var countdown=setInterval(()=>{if(!(typeof document.getElementById("try-similar-problem") == "undefined"||document.getElementById("try-similar-problem")==null)){document.getElementById("try-similar-problem").innerText="automatically continuing in "+timer+"...";timer--;}if(timer<=0){clearInterval(countdown);$($trySimilar).click();}},1000);
        //$($trySimilar).click();//click the continue button (if it is there)
        //if(settings_getAllWrong)setTimeout(()=>{$("html>body>div:eq(3)>div>div>div:eq(1)>div>section>section>article>div>button").click()},getRndInteger(100,500));//automatically click next button to get all wrong and collect data fast
    },500);
})();