// ==UserScript==
// @name         Boolean formatter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://electronics-course.com/boolean-algebra
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423255/Boolean%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/423255/Boolean%20formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement("button");
    button.innerHTML = "GO";
    button.type = "button";

    var body = document.getElementsByClassName("form-group")[1];
    body.appendChild(button);

    let input = document.getElementById("expr");
    let text = document.getElementById("expr").value;

    input.addEventListener('change', updateValue);

    function updateValue(e) {
        text = e.target.value;
    }
    button.addEventListener ("click", function() {
        changejs(text);
    });




    function changejs(text){
        let number = text;
        let numbermul = [] ;
        console.log(number);
        let Step0 = '' ;
        let Cnumber = [];
        let CnumberStep1 = '' ;
        let brackets= 0;

        if(number.indexOf('-') >-1){
            alert('輸入格式錯誤');
            return;
        }

        if(number.indexOf('*') >-1){
            if(confirm("請不要輸入'*'，是否要進行自動去除'*' 號")){
                numbermul = number.split("*");
                number =numbermul.join('');
            }
        }

        for (let i = 0; i < number.length; i++) {
            if(number[i] == '('){
                brackets = Cnumber.length;
                document.getElementById("expr").value = brackets;
            }

            if(number[i] == "'"){
                if(number[i-1] == ')'){
                    Cnumber.splice(brackets, 0,'~')
                }else{
                    Cnumber.pop();
                    Cnumber.push('~');
                    Cnumber.push(number[i-1]);
                }
                if(number[i+1] == '(' || number[i+1] !== '+'){
                    if(i !== number.length - 1){
                        Cnumber.push('*');
                    }
                }
            }else if(number[i] == ')' && number[i+1] == '('){
                Cnumber.push(number[i]);
                Cnumber.push('*');
            }else if(number[i] == ')' && number[i+1] == "'" && number[i+2] == '('){
                Cnumber.push(number[i]);
                Cnumber.push('*');
            }else if(number[i] !== '+' && number[i+1] !== '+'){
                if(number[i+1] !== "'" && number[i] !== '(' && number[i+1] !== ')'){
                    Cnumber.push(number[i]);
                    if(i !== number.length - 1){
                        Cnumber.push('*');
                    }
                }else{
                    Cnumber.push(number[i]);
                }
            }else{
                Cnumber.push(number[i]);
            }
        }
        CnumberStep1 = Cnumber.join('');
        document.getElementById("expr").value = CnumberStep1;
    }
})();