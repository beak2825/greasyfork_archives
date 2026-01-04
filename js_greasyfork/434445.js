// ==UserScript==
// @name         autosckhoolFAST2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Упрощает прохождения тестов и внутреннего экзамена по ПДД
// @author       iku
// @match        https://education.auto-online.ru/my/trainings/*
// @icon         https://www.google.com/s2/favicons?domain=auto-online.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434445/autosckhoolFAST2.user.js
// @updateURL https://update.greasyfork.org/scripts/434445/autosckhoolFAST2.meta.js
// ==/UserScript==

let interval
let botint
let answers = []
let questions = []
let values = []
let turnoff

let a_correct_index
let correct_answer
let correct_value
let correct_question
let result_search

//https://coderoad.ru/14964035/%D0%9A%D0%B0%D0%BA-%D1%8D%D0%BA%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8E-%D0%BE-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D0%B5-JavaScript-%D0%B2-csv-%D0%BD%D0%B0-%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%BD%D0%B5-%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B0

button_start()
function button_start() {
    let wzNode = document.createElement ('div');
    wzNode.innerHTML = '<button id="wtm1_SearchBttn" type="button">Старт</button>';
    wzNode.setAttribute ('id', 'wtm1_btnContainer');
    wzNode.style.cssText = `cursor: pointer; position: fixed; top: 120px; left: 0px; font-size: 12.8px; border: 1.5px outset black; opacity: 0.9; z-index: 1100; padding: 0px; display: grid; grid-template-columns: 1fr;`
    document.body.appendChild (wzNode);
    let w1 = document.getElementById ("wtm1_SearchBttn");
    w1.addEventListener ("click", start);

    let ab = wzNode.insertAdjacentHTML('beforeend','<button id="wtm2_SearchBttn" type="button"> Стоп </button>');
    let w2 = document.getElementById ("wtm2_SearchBttn");
    w2.addEventListener ("click", end);

    let ab1 = wzNode.insertAdjacentHTML('beforeend','<button id="wtm3_SearchBttn" type="button"> Бот вкл </button>');
    let w3 = document.getElementById ("wtm3_SearchBttn");
    w3.addEventListener ("click", bot_start);

    let ab2 = wzNode.insertAdjacentHTML('beforeend','<button id="wtm4_SearchBttn" type="button"> Бот выкл </button>');
    let w4 = document.getElementById ("wtm4_SearchBttn");
    w4.addEventListener ("click", bot_stop);
}

function bot_stop() {
    turnoff = 0
}

function bot_start() {
    turnoff = 1
    bot()
}

function start() {
    //interval = setInterval(repeat,2500)
    new_sam()
}

function end() {
    clearInterval(interval)
}


function err() {
    document.querySelector('#modal-error > div > div.links > a').click()
}

function new_sam() {
    let check_correct = false
    let a = document.querySelectorAll('.answer')
    let length = document.querySelectorAll('.answer').length
    for (let i =0 ; i <length; i++) {
        document.querySelector(`#answer_${i}`).addEventListener('click',answer_and_next)
    }
    result_search = false
    console.log('new_sam')
    readcorrect()


    function readcorrect() {
        let question = document.querySelector('#test-content > div.qu').textContent
        let q_correct = localStorage.getItem('questions', questions);
        let a_correct = localStorage.getItem('answers', answers);
        let v_correct = localStorage.getItem('values', 'answer_'+values);
        q_correct = q_correct.split('%,')
        a_correct = a_correct.split('%,')
        v_correct = v_correct.split('%,')

        q_correct.forEach(searchIndexCorrectanswerInQuestion)
        console.log(q_correct.length+'new_sam11')

        function searchIndexCorrectanswerInQuestion(element, index, array) {
            //console.log('new_sam111')
            if (element == question && check_correct == false) {
                console.log('new_sam1')
                a_correct_index = index
                //console.log('First IF ' +a_correct_index)
                correct_question = element
                //console.log('q_correct '+element, index)
                a_correct.forEach(searchCorrectInAnswer)
                function searchCorrectInAnswer(element, index, array) {
                    if (a_correct_index == index) {
                        console.log('new_sam12')
                        sverka_correct_answer()
                        function sverka_correct_answer() {
                            for (let i =0 ; i <length; i++) {

                                if (a[i].outerText.slice(2) == element) {
                                    console.log('new_sam123')
                                    correct_answer = element
                                    a_correct_index = index
                                    //console.log('Second IF ' +a_correct_index)
                                    v_correct.forEach(searchCorrectInValue)
                                }
                            }
                            //console.log('a_correct '+element, index)
                        }
                    }


                    function searchCorrectInValue(element, index, array) {
                        if (a_correct_index == index) {
                            //for (let i =0 ; i <length; i++) {
                            //console.log(a[i].firstElementChild.value+ ' '+ element + ' '+ a_correct_index + ' ' + index)
                            //if (a[i].firstElementChild.value == element && a_correct_index == index) {result_search = false; console.log('Некорректный ответ');return}
                            //}
                            correct_value = element
                             console.log(`Лог: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index} Длина ${length}`)
                             try {
                                    if (document.querySelector(`#answer_${correct_value}`).parentElement.outerText.slice(2) !== correct_answer) {console.log('Некорректный ответ'); }
                                    else {console.log(`Корректный ответ: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index} Длина ${length}`);
                                          correct_value = element; result_search = true;
                                          check_correct = true
                                          cvet()
                                          return
                                         }
                                    //correct_value = element
                                    //console.log('v_correct '+element, index)
                                    //result_search = true
                                    //return
                                }
                                catch (e) {
                                    correct_value = element
                                     console.log(`${e} catch: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index} Длина ${length}`)
                                    //alert('catch')
                                    //setTimeout(alert('catch'), 20500)
                                    result_search = 'fromcatch'
document.querySelector(`#answer_${correct_value}`).parentElement.style.color = "red"

                                }


                            //console.log(document.querySelector(`#answer_${element}`).parentElement.outerText.slice(2) + ' AAA ' + a_correct[index] +' AAA '+ element )
                            //if (document.querySelector(`#answer_${element}`).parentElement.outerText.slice(2) !== a_correct[index]) {alert('Некорректный ответ')}
                            //correct_value = element
                            //console.log('v_correct '+element, index)
                            //result_search = true
                            //cvet()
                            //return

                        }
                    }
                    //result_search = true
                    //return
                }
            }
        }
    }


    function cvet() {
        if (result_search) {
            document.querySelector(`#answer_${correct_value}`).parentElement.style.color = "blue"
            //console.log(`check_on_correct_correct Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
        }
    }


    function answer_and_next() {
        document.querySelector('#test-content > form > div.bottom.links > span.link.l.bg-green.answer-link > input[type=submit]').click()
        sverka()
        /*
    setTimeout(continue1, 500)
    function continue1() {
        document.querySelector('#test-content > form > div.bottom.links > span.link.l.bg-red.answer-link > input[type=submit]').click()
        setTimeout(repeat, 500)
    }
    */
    }

    function sverka() {
        console.log(result_search)
        if (result_search) {
            //document.querySelector('#test-content > form > div.bottom.links > span.link.l.bg-green.answer-link > input[type=submit]').click() //Жму ответить
            //console.log(`Найден корректный ответ: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
            //Жму продолжить
            setTimeout(check_on_correct, 350)
            //check_on_correct()
            function check_on_correct() {
                for (let i =0 ; i <length; i++) {
                    if (a[i].outerText.slice(2).includes('Верный')) {
                        document.querySelector(`#answer_${correct_value}`).parentElement.style.color = "blue"
                        console.log(`check_on_correct_correct Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
                        document.querySelector('section#test-content span.link.l.bg-red.answer-link > input[type=\"submit\"]').click()
                        setTimeout(new_sam, 700)
                    }
                    if (a[i].outerText.slice(2).includes('Неверный')) {
                        document.querySelector(`#answer_${correct_value}`).parentElement.style.color = "red"
                        console.log(`check_on_correct_НЕВЕРНЫЙ Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
                        //document.querySelector('#modal-error > div > div.links > a').click() //Жму продолжить
                        //setTimeout(bot, 1200)
                        // Если неверный имеет смысл выполнить проверку ридкоррект еще раз!? 1118 280621
                    }
                }
            }

            //setTimeout(bot, 1400)
        }
        else {
            //document.querySelector(`#answer_${correct_value}`).parentElement.style.color = "blue"
            //document.querySelector('#test-content > form > div.bottom.links > span.link.l.bg-green.answer-link > input[type=submit]').click()
            //console.log(`Рандомный ответ: #answer_${rand} ${result_search}`)
            //write_correct_for_new_sam = false
            setTimeout(write_correct, 700) //1000
        }
    }

    function write_correct() {
        console.log('write_correct')

        let a = document.querySelectorAll('.answer')
        let length = document.querySelectorAll('.answer').length
        for (let i =0 ; i <length; i++) {
            //console.log(i)
            if (a[i].outerText.slice(2).includes('Верный')) {
                console.log('write_correct')
                let answer = a[i].outerText.slice(2,-13)
                let question = document.querySelector('#test-content > div.qu').textContent
                let value = a[i].firstElementChild.value

                localStorage.setItem('questions', localStorage.getItem('questions') + question+'%,')
                localStorage.setItem('answers', localStorage.getItem('answers') + answer+'%,')
                localStorage.setItem('values', localStorage.getItem('values') + value+'%,')

                document.querySelector('section#test-content span.link.l.bg-red.answer-link > input[type=\"submit\"]').click() //Жму продолжить
                setTimeout(new_sam, 1400)
            }

            if (a[i].outerText.slice(2).includes('Неверный')) {
                console.log('Неверный')
                document.querySelector('#modal-error > div > div.links > a').click() //Жму продолжить
                setTimeout(new_sam, 1400)
            }
        }
    }


}



function bot() {
    if (turnoff == 1) {
        let check_correct = false
        let a = document.querySelectorAll('.answer')
        let length = document.querySelectorAll('.answer').length
        let rand = Math.floor(Math.random() * (length)) //  ИЛИ Math.floor(Math.random() * (3 - 1) + 1) от 1до 2 (исправил тк правильные ответы только 1 или 2)
        result_search = false

        click()
        function click() {
            readcorrect()
            //setTimeout(readcorrect, 400)
console.log(result_search)
            //if (result_search == 'fromcatch') {console.log('fromcatch'); turnoff = 0; return}
            if (result_search || result_search == 'fromcatch') {
                console.log(correct_value+'AAAAA')
                //console.log(`Найден корректный ответ: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
                //if (document.querySelector(`#answer_${correct_value}`).parentElement.outerText.slice(2) !== correct_answer) {console.log('Некорректный ответ'); alert('awd')}
                document.querySelector(`#answer_${correct_value}`).click()
                document.querySelector('#test-content > form > div.bottom.links > span.link.l.bg-green.answer-link > input[type=submit]').click() //Жму ответить
                console.log(`Найден корректный ответ: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
                //Жму продолжить
                setTimeout(check_on_correct, 500)
                //check_on_correct()
                function check_on_correct() {
                    //console.log(result_search+'AAAA1')
                    for (let i =0 ; i <length; i++) {
                        if (a[i].outerText.slice(2).includes('Верный')) {
                            //console.log(result_search+'AAAA2')
                            console.log(`check_on_correct_correct Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
                            document.querySelector('section#test-content span.link.l.bg-red.answer-link > input[type=\"submit\"]').click()
                        }
                        if (a[i].outerText.slice(2).includes('Неверный')) {
                            //console.log(result_search+'AAAA3')
                            console.log(`check_on_correct_НЕВЕРНЫЙ Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index}`)
                            document.querySelector('#modal-error > div > div.links > a').click() //Жму продолжить
                            //setTimeout(bot, 1200)
                        }
                    }
                }

                setTimeout(bot, 700) //1400
            }
            else {
                document.querySelector(`#answer_${rand}`).click()
                document.querySelector('#test-content > form > div.bottom.links > span.link.l.bg-green.answer-link > input[type=submit]').click()
                console.log(`Рандомный ответ: #answer_${rand} ${result_search}`)
                setTimeout(write_correct, 700) //1400
            }

        }

        function write_correct() {
            //console.log('write_correct')

            let a = document.querySelectorAll('.answer')
            let length = document.querySelectorAll('.answer').length
            for (let i =0 ; i <length; i++) {
                //console.log(i)
                if (a[i].outerText.slice(2).includes('Верный')) {
                    console.log('write_correct')
                    let answer = a[i].outerText.slice(2,-13)
                    let question = document.querySelector('#test-content > div.qu').textContent
                    let value = a[i].firstElementChild.value

                    localStorage.setItem('questions', localStorage.getItem('questions') + question+'%,')
                    localStorage.setItem('answers', localStorage.getItem('answers') + answer+'%,')
                    localStorage.setItem('values', localStorage.getItem('values') + value+'%,')

                    document.querySelector('section#test-content span.link.l.bg-red.answer-link > input[type=\"submit\"]').click() //Жму продолжить
                    setTimeout(bot, 1000)
                }

                if (a[i].outerText.slice(2).includes('Неверный')) {
                    console.log('Неверный')
                    document.querySelector('#modal-error > div > div.links > a').click() //Жму продолжить
                    setTimeout(bot, 1000)
                }
            }
        }

        function readcorrect() {

            let question = document.querySelector('#test-content > div.qu').textContent
            let q_correct = localStorage.getItem('questions', questions);
            let a_correct = localStorage.getItem('answers', answers);
            let v_correct = localStorage.getItem('values', 'answer_'+values);
            q_correct = q_correct.split('%,')
            a_correct = a_correct.split('%,')
            v_correct = v_correct.split('%,')

            q_correct.forEach(searchIndexCorrectanswerInQuestion)

            function searchIndexCorrectanswerInQuestion(element, index, array) {
                if (element == question && check_correct == false) {
                    a_correct_index = index
                    console.log('First IF ' +a_correct_index)
                    correct_question = element
                    //console.log('q_correct '+element, index)
                    a_correct.forEach(searchCorrectInAnswer)
                    function searchCorrectInAnswer(element, index, array) {
                        if (a_correct_index == index) {
                            sverka_correct_answer()
                            function sverka_correct_answer() {
                                for (let i =0 ; i <length; i++) {

                                    if (a[i].outerText.slice(2) == element) {
                                        correct_answer = element
                                        a_correct_index = index
                                        console.log('Second IF ' +a_correct_index)
                                        v_correct.forEach(searchCorrectInValue)
                                    }
                                }
                                //console.log('a_correct '+element, index)
                            }
                        }


                        function searchCorrectInValue(element, index, array) {
                            if (a_correct_index == index) {
                                correct_value = element
                                console.log(`Лог: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index} Длина ${length}`)
                                try {
                                    if (document.querySelector(`#answer_${correct_value}`).parentElement.outerText.slice(2) !== correct_answer) {console.log('Некорректный ответ'); }
                                    else {console.log(`Корректный ответ: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index} Длина ${length}`);
                                          correct_value = element; result_search = true;
                                          check_correct = true
                                          return
                                         }
                                    //correct_value = element
                                    //console.log('v_correct '+element, index)
                                    //result_search = true
                                    //return
                                }
                                catch (e) {
                                     console.log(`${e} catch: Вопрос: ${correct_question} Ответ: ${correct_answer} Тэг: ${correct_value} Индекс: ${a_correct_index} Длина ${length}`)
                                    //alert('catch')
                                    //setTimeout(alert('catch'), 20500)
                                    result_search = 'fromcatch'


                                }
                            }
                        }

                        //result_search = true
                        //return
                    }
            }




        }
        }
    }
}