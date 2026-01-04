// ==UserScript==
// @name        FormaFast
// @include     https://api.jquery.com/hide/
// @description шаблон веб-приложения поверх страницы браузера
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_addStyle
// @version      0.1
// @author       You
// @namespace https://greasyfork.org/users/414651
// @downloadURL https://update.greasyfork.org/scripts/433249/FormaFast.user.js
// @updateURL https://update.greasyfork.org/scripts/433249/FormaFast.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.

    Сценарии:
    1) Заполнить конец периода:
     а) Финансовая часть
     б) Квартира
     в) Инвестиционная

    2) Заполнить в любой момент периода:
     а) зп
     б) расходы
      1. Дата
      2. Категория
      3. Сумма
     в)



*/

var css = '{                                         \
        position:               fixed;                          \
        top:                    30%;                            \
        left:                   30%;                            \
        right:                  30%;                            \
        padding:                2em;                            \
        background:             powderblue;                     \
        border:                 3px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
    }                                                           \
    #ChageInPeriod button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        border:                 1px outset buttonface;          \
    } '

let date = new Date
let day = date.getDate()
let month = date.getMonth()+1
let year = date.getFullYear()
if (month.toLocaleString().length == 1) {
    month = '0'+month
}

FirstFunc()
function FirstFunc() {
//--- Use jQuery to add the form in a "popup" dialog.
    let Word = 'gmPopupContainer'
$("body").append ( '                                                          \
    <div id="gmPopupContainer">                                               \
    <form> \
        <div id="msg">1 window</div> \
        <button id="gmAddNumsBtn" type="button">Конец периода</button>  \
        <button id="gmAddNumsBtn1" type="button">В течение периода</button>         \
        <button id="gmCloseDlgBtn" type="button">Закрыть</button>         \
    </form>                                                                   \
    </div>                                                                    \
' );


//--- Use jQuery to activate the dialog buttons.
$("#gmAddNumsBtn").click ( function () {
    var A = EndOfPeriod()
    $("#gmPopupContainer").remove ()
} );

    $("#gmAddNumsBtn1").click ( function () {
    var B = ChageInPeriod()
    $("#gmPopupContainer").remove ()
} );


$("#gmCloseDlgBtn").click ( function () {
    $("#gmPopupContainer").hide ();
} );

//--- CSS styles make it work...
GM_addStyle ( `
    #${Word}${css}                                                `
            );

}

/////////////////////EndOfPeriod
//EndOfPeriod()
function EndOfPeriod() {
    let Word = 'EndOfPeriod'
    //$("#gmPopupContainer").hide ()
    $("body").append ( '                                                          \
    <div id="EndOfPeriod">                                               \
    <form> \
        <div id="msg">EndOfPeriod</div> \
        <button id="Finance" type="button">Финансы</button>  \
        <button id="Flat" type="button">Квартира</button>         \
        <button id="Invest" type="button">Инвестиции</button>         \
        <button id="EndOfPeriodClose" type="button">Назад</button>         \
    </form>                                                                   \
    </div>                                                                    \
' );

    $("#EndOfPeriodClose").click ( function () {
        $("#EndOfPeriod").remove ();
        FirstFunc();
} );

GM_addStyle ( `
    #${Word}${css}                                                `
            );

}

////////////////////////

function ChageInPeriod() {
    let Word = 'ChageInPeriod'
    $("#gmPopupContainer").hide ();
    $("body").append ( `                                                          \
    <div id=${Word }>                                               \
    <form> \
        <div id="msg">ChageInPeriod</div> \
        <button id="${Word}Salary" type="button">Зарплата</button>  \
        <button id="${Word}Expenses" type="button">Расходы</button>         \
        <button id="${Word}Close" type="button">Назад</button>            \
    </form>                                                                   \
    </div>                                                                    \
` );

    $(`#${Word}Close`).click ( function () {
        $(`#${Word}`).remove ();
        FirstFunc();
} );

        $(`#${Word}Salary`).click ( function () {
            $(`#${Word}`).remove ();
            Salary();
} );

            $(`#${Word}Expenses`).click ( function () {
            $(`#${Word}`).remove ();
            Expenses();
} );

GM_addStyle ( `
    #${Word}${css}                                                `
            );

}


function Salary() {
    let Word = 'ChageInPeriod'
    //$("#ChageInPeriod").hide ();
    $("body").append ( '                                                          \
    <div id="Salary">                                               \
    <form> \
        <div id="msg">1 window</div> \
        <input type="text" placeholder="Описание" id="SalaryDisc" value="">    \
        <input type="text" placeholder="Сумма" id="SalarySum" value="">    \
        <button id="SalaryOK" type="button">Принять</button>         \
        <button id="SalaryClose" type="button">Назад</button>            \
    </form>                                                                   \
    </div>                                                                    \
' );

    $("#SalaryClose").click ( function () {
        $("#Salary").remove ();
        ChageInPeriod();
} );

        $("#SalaryOK").click ( function () {
            //$("#ChageInPeriod").hide ();
            //Salary();
} );

            $("#Expenses").click ( function () {
            //$("#ChageInPeriod").hide ();
            //Expenses();
} );

GM_addStyle ( `
    #${Word}${css}                                                `
            );


}
function Expenses() {
    let Word = 'Expenses'
    $("body").append ( `                                                          \
    <div id="Expenses">                                               \
    <form> \
        <div id="msg">Expenses</div> \
        <input type="text" placeholder="2021-01-01" id="${Word}date" value="${year+'-'+month+'-'+day}">                           \
        <input type="text" placeholder="Продукты" id="${Word}Producti" value="">   \
        <button id="${Word}Restor" type="button">Еда внеш</button>         \
        <button id="${Word}Wear" type="button">Одежда</button>  \
        <button id="${Word}Transoport" type="button">Транспорт, связь</button>         \
        <button id="${Word}Done" type="button">Принять</button>            \
        <button id="${Word}Close" type="button">Назад</button>            \
    </form>                                                                   \
    </div>                                                                    \
` );

    $(`#${Word}Close`).click ( function () {
        $(`#${Word}`).remove ();
        ChageInPeriod();
} );

    $(`#${Word}Done`).click ( function () {
        alert('Продукты '+ $(`#${Word}date`).val() +' '+ $(`#${Word}Producti`).val() )
} );

        $(`#${Word}Producti`).click ( function () {
            //$(`#${Word}`).remove ();;
            //Expenses_Producti();
} );

            $(`#${Word}Restor`).click ( function () {
            $(`#${Word}`).remove ();;
           // Expenses();
} );

GM_addStyle ( `
    #${Word}${css}                                                `
            );


}

function Expenses_Producti() {
    let Word = 'Producti'
    $("body").append ( `                                                          \
    <div id=${Word }>                                               \
    <form> \
        <div id="msg">${Word}</div> \
        <button id="${Word}First" type="button">Зарплата</button>  \
        <button id="${Word}Secound" type="button">Расходы</button>         \
        <button id="${Word}Close" type="button">Назад</button>            \
    </form>                                                                   \
    </div>                                                                    \
` );

    $(`#${Word}Close`).click ( function () {
        $(`#${Word}`).remove ();
        Expenses();
} );

        $(`${Word}First`).click ( function () {
            $(`#${Word}`).remove ();
            //Salary();
} );

        $(`${Word}Secound`).click ( function () {
            $(`#${Word}`).remove ();
            //Expenses();
} );

GM_addStyle ( `
    #${Word}${css}                                                `
            );

}

///////////
/*
$("body").append ( '                                                          \
    <div id="gmPopupContainer">                                               \
    <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" --> \
        <input type="text" placeholder="Дата" id="myNumber1" value="">                           \
        <input type="text" placeholder="строка" id="myNumber2" value="">                           \
        <input type="text" placeholder="строка" id="myNumber11" value="">                           \
        <input type="text" placeholder="строка" id="myNumber21" value="">                           \
        <input type="text" placeholder="строка" id="myNumber12" value="">                           \
        <input type="text" placeholder="строка" id="myNumber22" value="">                           \
                                                                              \
        <p id="myNumberSum">&nbsp;</p>                                        \
        <button id="gmAddNumsBtn" type="button">Add the two numbers</button>  \
        <button id="gmCloseDlgBtn" type="button">Close popup</button>         \
    </form>                                                                   \
    </div>                                                                    \
' );


//--- Use jQuery to activate the dialog buttons.
$("#gmAddNumsBtn").click ( function () {
    var A   = $("#myNumber1").val ();
    var A1   = $("#myNumber11").val ();
    var A2   = $("#myNumber12").val ();
    var B   = $("#myNumber2").val ();
    var B1   = $("#myNumber21").val ();
    var B2   = $("#myNumber22").val ();
    var C   = parseInt(A, 10) + parseInt(B, 10);

    $("#myNumberSum").text ("The sum is: " + C);
} );

$("#gmCloseDlgBtn").click ( function () {
    $("#gmPopupContainer").hide ();
} );


//--- CSS styles make it work...
GM_addStyle ( "                                                 \
    #gmPopupContainer {                                         \
        position:               fixed;                          \
        top:                    30%;                            \
        left:                   30%;                            \
        right:                  30%;                            \
        padding:                2em;                            \
        background:             powderblue;                     \
        border:                 3px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        border:                 1px outset buttonface;          \
    }                                                           \
" );

*/