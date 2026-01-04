// ==UserScript==
// @license      GNU GPLv3
// @name         Poll Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try find'em all
// @author       Алексей Иващенко
// @include    /^https?:\/\/polls.tinkoff.ru.*/
// @match        file:///C:/Users/a.ivashchenko/Downloads/%D0%9F%D1%80%D0%BE%D0%B9%D0%B4%D0%B8%20%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B7%D0%BD%D0%B0%D0%BD%D0%B8%D0%B9%20%D0%B8%20%D1%83%D0%B7%D0%BD%D0%B0%D0%B9%20%D0%B8%D1%85%20%D1%82%D0%B5%D0%BA%D1%83%D1%89%D0%B8%D0%B9%20%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C%20_%20Tinkoff.ru.html
// @icon64       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACvUlEQVR4nO1ZzWsTQRR/foEiiqC19QMUEVra9zYtuXgTBC968hC/Lh49+FnrXagGQcSLVxGtXiweREvy3qYQoa1g8B9QECWHXlTQ6MWijewk2TZrq7szO6EJ+4M5ZDbz5vebee/N21mABAkSJOg8vEmvA6HbIPQRBD8A4y3V1zYQGgOhaqCNwYrCqwMbYKK/569+Hri6BPla854FMdHfo2y1DFVYBYxZYPxRJ1YGofsgNAxMj4BpfnkB6pm3O8P1MeV6/3cQvKFsW4fgxWUJmjbG8/YFME1bFDDVAgH4zqKAt/YFCM1aEyA0a5d8jnb/M0jN229wh3baIZ+nXhCasUi+WnMjmlZzxZcyB04A00vLK18NiJhXc+bxuFlqFbppgaALeTwKQk9CBnZWk7yzHRjnYiZfhme9m5R97/QV/BVCwBzkBrt0Vj8d++q7eMS3n0Mn9LiCMxRdQG7/ZhCqxCjgsW/7GqyOkBAq/q5FBuNILOQZPymXbMClS+HH4xXQxnhmDQiVzF2HTvk286m9teItFPnXioMRmE4brv7zZnvI4cc7J83IhxXAeEcFGuODQP9XdXo3IHRGe+esuZCX5ooH1y4EJz5d5AJnfVuT2A1CXyLuYMnMhUIHsXPIH6PyO82ok3TxKco0rumCI3rko6RRps9N9UuhbysUaJ//W/CYQRxV9NJo1IOM6b1ykyCKqS3GJXhB6yAb7NIoJUogzsYmO0z3jMgL/YRielt0AWpyzGpM+MIPPMbDxlUs0yhowwtClzIa5bRXJtwFoW9G5bRLGYgNXpDafKGXBnmciu+FJojJ1C7rr5T5vh1gFW39Ut8R1yrc/hdbFyy60Dn7ArzU6l3ELtT0tctdpssg+PC/l7texar+G7jcZbwOLUVxz/olS4eo1+uT2K1srSi0xQeOjv7ElCBBggQQEn8ASTRe8+xjoEgAAAAASUVORK5CYII=
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/496339/Poll%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/496339/Poll%20Tool.meta.js
// ==/UserScript==

(function() {
   'use strict';

   function addStyle(styleString) {
      const style = document.createElement('style');
      style.textContent = styleString;
      document.head.append(style);
   }

   window.markAnswers = function() {
    var questionsData = JSON.parse(JSON.stringify(window.__pollData.questions));


    for (var i = questionsData.length - 1; i >= 0; i--) {
        questionsData[i].data.answers = questionsData[i].data.answers.filter(function(item){
                return item.isCorrect == true;
            })
    }

    var classesArray = []
    var poll = document.getElementById("content")
    var allMains = poll.getElementsByTagName("main")

    for (var m = 0; m < allMains.length; m++) {
        var mainUl = allMains[m].getElementsByTagName("ul")[0]
        var lises = mainUl.getElementsByTagName("li")

        for (var l = 0 ; l < lises.length; l++) {
            var pText = lises[l].getElementsByTagName("p")[0]

            for (var q = questionsData.length - 1; q >= 0; q--) {
                var answers = questionsData[q].data.answers;
                for (var j = answers.length - 1; j >= 0; j--) {
                    if (answers[j].text.replace('\\','') == pText.innerText) {
                        var classString = "#content main:nth-of-type(" + (m + 1) + ") ul > li:nth-child(" + (l + 1) + ") p"
                        classesArray.push( classString );
                    }
                }
            }
        }

    }

       addStyle(
classesArray.toString()+`{
   color: #00b92d;
}
`);
   }

})();