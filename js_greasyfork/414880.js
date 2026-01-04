// ==UserScript==
// @name         GDPR 188bet.astute-elearning.com
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  自動highlight答案
// @author       You
// @match        https://188bet.astute-elearning.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @downloadURL https://update.greasyfork.org/scripts/414880/GDPR%20188betastute-elearningcom.user.js
// @updateURL https://update.greasyfork.org/scripts/414880/GDPR%20188betastute-elearningcom.meta.js
// ==/UserScript==

(function() {
    setInterval(clickContinueButton, 3000);
    getAnswerList();

})();

//取得答案列表
function getAnswerList(){
    var match =  /(.*)index\.html/.exec(window.location.href);
    var answerJson = match[1]+'course/en/components.json';
    console.log("json網址:"+answerJson);
    $.getJSON( answerJson , function( data ) {
        //console.log(data);
        window.answerComponent = data.filter(function (obj){
            return obj._component==='mcq' || obj._component==='matching';
        });
        //setInterval(displayAnswer, 1000);
        waitForKeyElements('.mcq__item-input',displayAnswer);
    });
}

function displayAnswer(){
    console.log("執行displayAnswer");
         $(window.answerComponent).each(function() {
             var question = this;
             //顯示radio button,input的答案
             if(question._component ==="mcq"){
               displayInputAnswer(question);
             }
             else{
                 //顯示下拉選單的答案
                 displayDropDownAnswer(question);
             }
       });
}

function displayInputAnswer(question){
             var answer = question._items.filter(function (obj){
                 return obj._shouldBeSelected===true;
             });
             $(answer).each(function(){

                $('div[data-adapt-id="'+question._id+'"]').find(".mcq__item-text-inner:contains('"+this.text+"')").css("background-color","red").text("This is Answer");
             });

}

function displayDropDownAnswer(questions){
            //dropdown的questionComponent，底下會有好幾個question，再裡面才是dropdown的選項
            $(questions._items).each(function(){
                var question = this
                var dropdownTitle = question.text;

                $(question).each(function(){
                    var dropdownSelection = this._options;
                    var correctSelection = dropdownSelection.filter(function (obj){
                        return obj._isCorrect===true;
                    });
                    console.log(questions._id + "  dropDownTitle:"+ dropdownTitle+"  answer:"+correctSelection[0].text);
                    $('div[data-adapt-id="'+questions._id+'"]').find(".matching__item-title_inner:contains('"+dropdownTitle+"')").closest(".matching__item").find("li[text='"+correctSelection[0].text+"']").css("background-color","red").text("This is Answer");
                });

             });
}

function clickContinueButton(){

}