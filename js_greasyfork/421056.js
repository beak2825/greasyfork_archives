// ==UserScript==
// @name         Kino: Become the Star
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  Захвати мир Кино!
// @author       Anonimous
// @match        http://kinostar.evigames.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421056/Kino%3A%20Become%20the%20Star.user.js
// @updateURL https://update.greasyfork.org/scripts/421056/Kino%3A%20Become%20the%20Star.meta.js
// ==/UserScript==

(function() {
    'use strict';

/* CONFIG */

const INTERVAL = 60000; // 60000 - 1 MINUTE
const UPDATE_CHECK_INTERVAL = 1000; // 1000 1 SECOND
// Если нужна константа, то SCENARIO_MIN_ACTORS и SCENARIO_MAX_ACTORS должны совпадать, то есть если нужно 5, то SCENARIO_MAX_ACTORS = 5 и SCENARIO_MIN_ACTORS = 5
const SCENARIO_MIN_ACTORS = 1 // 2 - значит от двух включительно.
const SCENARIO_MAX_ACTORS = 5 // включительно

/*****************************/

function get_element_by_HTML(tag, HTML){
    var arr = document.getElementsByTagName(tag)
    for(var A of arr){
        if(A && A.innerHTML && A.innerHTML.indexOf(HTML) != -1){
            //console.log(`Element with \'${HTML}\' finded`)
            return A
        }
    }
    console.log(`Element \'${tag}\' \'${HTML}\' not finded!`)
}

function get_menu_by_name(menu_name){
    var menu_arr = document.getElementsByClassName("menu")
    //console.log(menu_arr.length)
    for(var menu of menu_arr) {
        var menu_html = menu.innerHTML
        //console.log(menu_html)
        if(menu_html == menu_name) {
            //console.log(`Menu \'${menu_name}\' finded succeful!`)
            return menu
        }
    }

}

function click_on_menu(menu_name){
    var A = get_menu_by_name(menu_name)
    A.click()
}

function click_on_link(HTML){
    click_on_element("A", HTML)
}


function click_on_element(tag, HTML){
    var A = get_element_by_HTML(tag, HTML)
    if (A){
        A.click()
    }
}

function kinostudio(){
    console.log("Киностудия")
    click_on_link("Приступить к съёмкам")
    click_on_link("Подготовить павильон к сцене")
    click_on_link("Отправить фильм в прокат")
    click_on_link("Подготовить павильон к съёмкам")
}
function buy_modificator(){
   var arr = document.getElementsByTagName("A")
   for(var A of arr){
       if(A && A.innerHTML && A.nextSibling && A.nextSibling.innerHTML && (A.nextSibling.innerHTML.indexOf("за <img src=") != -1)){
          A.click()
        }
    }
}

function actors(){
    console.log("Актёры")
    click_on_link("Прибрать рабочее место")
    click_on_link("Нанять актёра")
    buy_modificator()

}

function buy_actor(){
    console.log("Актёр на кастинге")
    click_on_link("Принять на работу")
}

function scenarists(){
    console.log("Сценаристы")
    click_on_link("Нанять сценариста")
    click_on_link("Прибрать рабочее место")
    click_on_link("дать задание")
    click_on_link("выбрать")
    click_on_link("Забрать сценарий")
    buy_modificator()
}

function buy_scenarist(){
    console.log("Свободный сценарист")
    click_on_link("Принять на работу")
}

function film_making(){
    console.log("Съёмки фильма")
    if(get_element_by_HTML("DIV", "У вас нет ни одного написанного сценария.")){
        //console.log("Нет сценариев!")

        //click_on_link("В отдел к сценаристам")
        return
    }
    var arr = document.getElementsByClassName("list small alpha")
    arr = arr[0].getElementsByTagName("a")
    arr[0].click()
}

function kinotheters(){
    console.log("Кинотеатры")
    click_on_link("Реклама фильма")
    click_on_link("Собрать прибыль")
}

function select_modificator(){
    var arr = document.getElementsByClassName("list small alpha")
    arr = arr[0].getElementsByTagName("a")
    if(document.getElementsByClassName("ic_bot")[0].innerHTML == "Предложить таблетку"){
        arr[0].click()
    }
    else {
        arr[arr.length-1].click()
    }
}

function write_scenario(){
    var header = document.getElementsByClassName("ic_bot")
    var A = document.getElementsByClassName("alpha")
    var alpha = A[0]
    //if(header[0].innerHTML.indexOf("Триллер") != -1){
    if((alpha.innerHTML.indexOf("Необходимо актёров:") != -1)){
        var AAA = alpha.innerHTML.slice(alpha.innerHTML.indexOf(" Необходимо актёров:"), alpha.innerHTML.indexOf(" чел"))
        console.log(AAA)
        var num_actors = parseInt(AAA.slice(AAA.indexOf(">", AAA.length)))
        if((alpha.innerHTML.indexOf("3D технология: <span class=\"color4\">используется</span>") != -1) && num_actors >= SCENARIO_MIN_ACTORS && num_actors <= SCENARIO_MAX_ACTORS ){
            click_on_link("Писать этот сценарий")
        }
        else {
            click_on_link("Придумать что-то новое")
    }
    }
    else {
        click_on_link("Придумать что-то новое")
    }
}

function check_update(menu_name){
    var A = get_menu_by_name(menu_name)
    if(A.nextSibling.nextSibling.innerHTML != "" && document.getElementsByClassName("ic_bot")[0].innerHTML != menu_name){
        A.click()
    }
}

function check_updates()
{
    var arr = ["Киностудия", "Актёры", "Сценаристы", "Кинотеатры"]
    for(var A of arr){
        check_update(A)
    }
}

function new_scenario_switch(){
    if(get_element_by_HTML("DIV", "Сценарием занимается")) {
        click_on_link("Придумать что-то новое")
}
    else{
        click_on_menu("Сценаристы")
    }
}

function exchanger(){
    var A = document.getElementsByClassName("list alpha")
    var alpha = A[1]
    var links = alpha.getElementsByTagName("A")
    var last_link
    for(var link of links){
        if(link && link.innerHTML && link.innerHTML.indexOf("Обменять") != -1){
            last_link = link
        }
    }
    if(last_link){
        last_link.click()
    }
    else{
        setTimeout(function(){click_on_menu("Киностудия")}, 60000)
    }

}

function main(){
    var d = new Date()
    var header = document.getElementsByClassName("ic_bot")
    if((d.getMinutes() % 30 == 0) && header[0].innerHTML != "Город" && header[0].innerHTML != "Обменный пункт"){
        click_on_link("Город")
    }
    switch(header[0].innerHTML){
        case "Обменный пункт":
            exchanger()
            break
        case "Город":
            click_on_link("Обменник")
            break
        case "Киностудия":
            kinostudio()
            break
        case "Съёмки фильма":
            film_making()
            break
        case "Актёры":
            actors()
            break
        case "Сценаристы":
            scenarists()
            break
        case "Кинотеатры":
            kinotheters()
            break
        case "Актёр на кастинге":
            buy_actor()
            break
        case "Свободный сценарист":
            buy_scenarist()
            break
        case "Вкусно накормить":
            select_modificator()
            break
        case "Новый сценарий":
            new_scenario_switch()
            break
        case "Вкусный напиток":
            select_modificator()
            break
        case "Предложить таблетку":
            select_modificator()
            break
        case "К съёмкам всё готово!":
            click_on_link("Продолжить")
            break
        default: {
            if(get_element_by_HTML("A", "Писать этот сценарий") != null){
                write_scenario()
                break
            }
            else{
                if(get_element_by_HTML("DIV", "У вас не хватает свободных актёров") == null) {
                    click_on_link("Назначить актёров автоматически")
                }
            }
        }
    }
    setTimeout(function(){check_updates()}, UPDATE_CHECK_INTERVAL)
    switch(header[0].innerHTML){
        case "Сценаристы":
            setTimeout(function(){click_on_menu("Киностудия")}, INTERVAL)
            break
        default:
            setTimeout(function(){click_on_menu("Сценаристы")}, INTERVAL)
            break
        }
    }



main()
})();