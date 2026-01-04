// ==UserScript==
// @name         Автоматическое заполнение форм на ЛД/АП
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/*
// @icon         https://cdn-icons-png.flaticon.com/128/1828/1828918.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502022/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%20%D0%BD%D0%B0%20%D0%9B%D0%94%D0%90%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/502022/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%20%D0%BD%D0%B0%20%D0%9B%D0%94%D0%90%D0%9F.meta.js
// ==/UserScript==

(function() {
    const button_GOSS = document.createElement("a")
    const button_OPG = document.createElement("a")
    const button_AP = document.createElement("a")
    const button_A_OPG = document.createElement("a")
    const button_L_OPG = document.createElement("a")
    const button_B_OPG = document.createElement("a")
    const button_PRAVO = document.createElement("a")
    const button_CMI = document.createElement("a")
    const button_CB = document.createElement("a")
    const button_MO = document.createElement("a")
    const button_GIBDD = document.createElement("a")
    const button_YMVD = document.createElement("a")
    const button_FCB = document.createElement("a")
    const button_FCIN = document.createElement("a")

    const div_GOSS = document.createElement("div")
    const div_OPG = document.createElement("div")

    button_AP.className = "create_new_form"
    button_A_OPG.className = "create_new_form"
    button_L_OPG.className = "create_new_form"
    button_B_OPG.className = "create_new_form"
    button_PRAVO.className = "create_new_form"
    button_CMI.className = "create_new_form"
    button_CB.className = "create_new_form"
    button_MO.className = "create_new_form"
    button_GIBDD.className = "create_new_form"
    button_YMVD.className = "create_new_form"
    button_FCB.className = "create_new_form"
    button_FCIN.className = "create_new_form"
    button_GOSS.className = "create_new_form"
    button_OPG.className = "create_new_form"

    document.querySelector(".formSubmitRow-controls").style.paddingLeft = "0px"
    const panel = document.querySelector(".formSubmitRow-controls")

    var locked = 0;

    setTimeout(() => {
        const buttons = document.querySelectorAll(".create_new_form")
        for (var q = 0; q < buttons.length; q++) {
            buttons[q].style.height = "32px";
            buttons[q].style.background = "#212428";
            buttons[q].style.color = "#fff";
            buttons[q].style.border = "0px";
            buttons[q].style.cursor = "pointer";
            buttons[q].style.display = "inline-block"
            buttons[q].style.textDecoration = "none"

            buttons[q].style.marginLeft = "30px"

            buttons[q].style.paddingLeft = "10px";
            buttons[q].style.paddingRight = "10px";
            buttons[q].style.paddingTop = "5px";
        }
    }, 1);

    button_AP.style.borderRadius = "4px"
    button_GOSS.style.borderRadius = "4px";
    button_OPG.style.borderRadius = "4px";
    div_OPG.style.fontSize = "18px"
    div_GOSS.style.fontSize = "18px"

    button_AP.innerHTML = "АП"
    button_A_OPG.innerHTML = "А-ОПГ"
    button_L_OPG.innerHTML = "Л-ОПГ"
    button_B_OPG.innerHTML = "Б-ОПГ"
    button_PRAVO.innerHTML = "Правительство"
    button_CMI.innerHTML = "СМИ"
    button_CB.innerHTML = "ЦБ"
    button_MO.innerHTML = "МО"
    button_GIBDD.innerHTML = "ГИБДД"
    button_YMVD.innerHTML = "УМВД"
    button_FCB.innerHTML = "ФСБ"
    button_FCIN.innerHTML = "ФСИН"
    button_GOSS.innerHTML = "ГОСС"
    button_OPG.innerHTML = "ОПГ"

    panel.append(button_AP, button_GOSS, div_GOSS, button_OPG, div_OPG)
    div_GOSS.append(button_PRAVO, button_CMI, button_CB, button_MO, button_GIBDD, button_YMVD, button_FCB, button_FCIN)
    div_OPG.append(button_A_OPG, button_L_OPG, button_B_OPG)

    div_GOSS.style.display = "none"
    div_OPG.style.display = "none"

    button_GOSS.addEventListener('click', () => {
        if (div_GOSS.style.display == "inline-grid") {
            div_GOSS.style.display = "none"
        }
        else {
            div_GOSS.style.display = "inline-grid"
        }
    })

    button_OPG.addEventListener('click', () => {
        if (div_OPG.style.display == "inline-grid") {
            div_OPG.style.display = "none"
        }
        else {
            div_OPG.style.display = "inline-grid"
        }
    })

    const textarea = document.createElement("textarea")
    textarea.className = "Zayavka"
    textarea.style.marginLeft = "16px"
    textarea.style.maxWidth = "97%"
    textarea.style.minWidth = "97%"
    textarea.style.width = "97%"

    document.querySelector(".formRow").append(textarea)

    const button_for_create_new_form_AP = document.createElement("a")
    const button_for_create_new_form_A_OPG = document.createElement("a")
    const button_for_create_new_form_L_OPG = document.createElement("a")
    const button_for_create_new_form_B_OPG = document.createElement("a")
    const button_for_create_new_form_PRAVO = document.createElement("a")
    const button_for_create_new_form_CMI = document.createElement("a")
    const button_for_create_new_form_CB = document.createElement("a")
    const button_for_create_new_form_MO = document.createElement("a")
    const button_for_create_new_form_GIBDD = document.createElement("a")
    const button_for_create_new_form_YMVD = document.createElement("a")
    const button_for_create_new_form_FCB = document.createElement("a")
    const button_for_create_new_form_FCIN = document.createElement("a")

    button_for_create_new_form_AP.className = "save_new_form"
    button_for_create_new_form_A_OPG.className = "save_new_form"
    button_for_create_new_form_L_OPG.className = "save_new_form"
    button_for_create_new_form_B_OPG.className = "save_new_form"
    button_for_create_new_form_PRAVO.className = "save_new_form"
    button_for_create_new_form_CMI.className = "save_new_form"
    button_for_create_new_form_CB.className = "save_new_form"
    button_for_create_new_form_MO.className = "save_new_form"
    button_for_create_new_form_GIBDD.className = "save_new_form"
    button_for_create_new_form_YMVD.className = "save_new_form"
    button_for_create_new_form_FCB.className = "save_new_form"
    button_for_create_new_form_FCIN.className = "save_new_form"

    button_for_create_new_form_AP.innerHTML = "Создать новую форму для АП"
    button_for_create_new_form_A_OPG.innerHTML = "Создать новую форму для А-ОПГ"
    button_for_create_new_form_L_OPG.innerHTML = "Создать новую форму для Л-ОПГ"
    button_for_create_new_form_B_OPG.innerHTML = "Создать новую форму для Б-ОПГ"
    button_for_create_new_form_PRAVO.innerHTML = "Создать новую форму для Право"
    button_for_create_new_form_CMI.innerHTML = "Создать новую форму для СМИ"
    button_for_create_new_form_CB.innerHTML = "Создать новую форму для ЦБ"
    button_for_create_new_form_MO.innerHTML = "Создать новую форму для МО"
    button_for_create_new_form_GIBDD.innerHTML = "Создать новую форму для ГИБДД"
    button_for_create_new_form_YMVD.innerHTML = "Создать новую форму для УМВД"
    button_for_create_new_form_FCB.innerHTML = "Создать новую форму для ФСБ"
    button_for_create_new_form_FCIN.innerHTML = "Создал новую форму для ФСИН"

    setTimeout(() => {
        const buttons_save = document.querySelectorAll(".save_new_form")
        for (var qq = 0; qq < buttons_save.length; qq++) {
            buttons_save[qq].style.display = "inline-block";
            buttons_save[qq].style.margin = "15px";
            buttons_save[qq].style.marginLeft = "25px";
            buttons_save[qq].style.background = "#858080";
            buttons_save[qq].style.padding = "8px";
            buttons_save[qq].style.borderRadius = "7px";
            buttons_save[qq].style.cursor = "pointer";
        }
     }, 10)

    document.querySelector(".formRow").append(button_for_create_new_form_AP, button_for_create_new_form_A_OPG, button_for_create_new_form_L_OPG, button_for_create_new_form_B_OPG, button_for_create_new_form_PRAVO, button_for_create_new_form_CMI, button_for_create_new_form_CB, button_for_create_new_form_MO, button_for_create_new_form_GIBDD, button_for_create_new_form_YMVD, button_for_create_new_form_FCB, button_for_create_new_form_FCIN)

    button_for_create_new_form_AP.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
        localStorage.setItem("AP", document.querySelector(".Zayavka").value)

        if (localStorage.getItem("AP") == null || localStorage.getItem("AP") == "null") {
            console.log("нету ничего")
        }
        else {
            var temp = textarea.value.replace(/\n/g, "<br>")
            localStorage.setItem("AP", temp)
        }
    }
    })

    button_for_create_new_form_A_OPG.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
        localStorage.setItem("A_OPG", document.querySelector(".Zayavka").value)

        if (localStorage.getItem("A_OPG") == null || localStorage.getItem("A_OPG") == "null") {
            console.log("нету ничего")
        }
        else {
            var temp = textarea.value.replace(/\n/g, "<br>")
            localStorage.setItem("A_OPG", temp)
        }
    }
    })

    button_for_create_new_form_L_OPG.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("L_OPG", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("L_OPG") == null || localStorage.getItem("L_OPG") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("L_OPG", temp)
            }
        }
    })

    button_for_create_new_form_B_OPG.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("B_OPG", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("B_OPG") == null || localStorage.getItem("B_OPG") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("B_OPG", temp)
            }
        }
    })

    button_for_create_new_form_PRAVO.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("PRAVO", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("PRAVO") == null || localStorage.getItem("PRAVO") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("PRAVO", temp)
            }
        }
    })

    button_for_create_new_form_CMI.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("CMI", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("CMI") == null || localStorage.getItem("CMI") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("CMI", temp)
            }
        }
    })

    button_for_create_new_form_CB.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("CB", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("CB") == null || localStorage.getItem("CB") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("CB", temp)
            }
        }
    })

    button_for_create_new_form_MO.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("MO", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("MO") == null || localStorage.getItem("MO") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("MO", temp)
            }
        }
    })

    button_for_create_new_form_GIBDD.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("GIBDD", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("GIBDD") == null || localStorage.getItem("GIBDD") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("GIBDD", temp)
            }
        }
    })

    button_for_create_new_form_YMVD.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("AP", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("YMVD") == null || localStorage.getItem("YMVD") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("YMVD", temp)
            }
        }
    })

    button_for_create_new_form_FCB.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("FCB", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("FCB") == null || localStorage.getItem("FCB") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("FCB", temp)
            }
        }
    })

    button_for_create_new_form_FCIN.addEventListener('click', () => {
        if (confirm(`Вы действительно хотите это сохранить?

Если вы это сохраните скрипт будет отправлять именно это сообщение!`)) {
            localStorage.setItem("FCIN", document.querySelector(".Zayavka").value)

            if (localStorage.getItem("FCIN") == null || localStorage.getItem("FCIN") == "null") {
                console.log("нету ничего")
            }
            else {
                var temp = textarea.value.replace(/\n/g, "<br>")
                localStorage.setItem("FCIN", temp)
            }
        }
    })

    function all(){
        const prefix = document.querySelectorAll(".menuPrefix.label.label--red")
        const panel = document.querySelector(".formSubmitRow-controls")

        for (var i = 0; i < prefix.length; i++) {
            if (prefix[i].dataset.prefixId == "1") {
                prefix[i].click()
            }
        }

        const pin = document.querySelectorAll(".iconic input")

        if (locked == 0) {
            for (var ii = 0; ii < pin.length; ii++) {
                if (pin[ii].name == "sticky") {
                    pin[ii].click()
                    locked = 1;
                }
            }
        }
    }

    function AP() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность \"Агент Поддержки\""

        if (localStorage.getItem("AP") == null || localStorage.getItem("AP") == "null") {
        text.innerHTML = `[CENTER][SIZE=6][COLOR=red]!!!Администрация никогда не попросит ваш пароль, если Вам пишет с просьбой скинуть пароль, то блокируйте пользователя!!![/COLOR][/SIZE]<br><br><br>[SIZE=7][COLOR=rgb(255, 17, 0)][FONT=times new roman]Общие требования для должности агента поддержки[/FONT][/COLOR][/SIZE]<br><br>[IMG alt="1621526767066.png"]https://i.postimg.cc/26HXmBjc/1621526767066.png[/IMG]<br>[SIZE=5][FONT=times new roman]Подавать заявку на должность агента поддержки необходимо строго по форме представленной ниже, за игнорирование данных требований может последовать отказ в должности.[/FONT][/SIZE]<br>[IMG alt="1621526767066.png"]https://i.postimg.cc/26HXmBjc/1621526767066.png[/IMG]<br>[COLOR=rgb(255, 17, 0)][FONT=times new roman][SIZE=7]Требования к кандидату[/SIZE][/FONT][/COLOR]<br>[IMG alt="1621526767066.png"]https://i.postimg.cc/26HXmBjc/1621526767066.png[/IMG]<br>[SIZE=5][FONT=times new roman]- Иметь 8+ уровень;<br>- Знать правила серверов и правила агентов поддержки;<br>- Знать игровой процесс и игровые команды используемые в нем;<br>- Быть в возрасте от 15 лет (возможны исключения с 14);<br>- Иметь никнейм формата Имя_Фамилия;<br>- Иметь Discord и исправно работающий микрофон;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.[/FONT][/SIZE][/CENTER]<br>[LIST][*][CENTER][SIZE=5][FONT=times new roman]Примечание: запрещено занимать какие-либо должности на момент подачи заявки;[/FONT][/SIZE][/CENTER]<br>[*][CENTER][SIZE=5][FONT=times new roman]Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;[/FONT][/SIZE][/CENTER]<br>[*][CENTER][SIZE=5][FONT=times new roman]Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).[/FONT][/SIZE][/CENTER]<br>[/LIST][CENTER][IMG alt="1621526767066.png"]https://i.postimg.cc/26HXmBjc/1621526767066.png[/IMG]<br>[COLOR=rgb(255, 17, 0)][SIZE=7][FONT=times new roman]Форма подачи заявки[/FONT][/SIZE][/COLOR]<br>[IMG alt="1621526767066.png"]https://i.postimg.cc/26HXmBjc/1621526767066.png[/IMG]<br>[SIZE=5][FONT=times new roman]1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Ознакомлены ли вы с правилами серверов:<br>7. Ознакомлены ли вы с правилами агента поддержки:<br>
8. Ознакомлены ли вы с командами сервера:<br>9. Занимали ли вы данную должность на других проектах/серверах:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:<br>15. Город, в котором проживаете:[/FONT][/SIZE]<br><br>[IMG alt="1621526767066.png"]https://i.postimg.cc/26HXmBjc/1621526767066.png[/IMG]<br><br>[SIZE=5][FONT=times new roman][COLOR=rgb(255, 17, 0)]ВАЖНО |[/COLOR] Администрация не будет запрашивать ваши данные от аккаунта.[/FONT][/SIZE][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("AP")
        }
    }

    function A_OPG() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Арзамасской ОПГ\""

        if (localStorage.getItem("A_OPG") == null || localStorage.getItem("A_OPG") == "null") {
        text.innerHTML = `[CENTER][B][I][SIZE=6][COLOR=rgb(255, 0, 0)]WARNING![/COLOR][/SIZE][/I][/B]<br>[I][COLOR=rgb(255, 255, 255)][B][SIZE=5]Администрация проекта ни в коем случае не запрашивает пароли от аккаунтов, а также все обзвоны на должность проходят в официальных Discord серверах, где можно удостовериться в личности администратора и включить демонстрацию экрана.[/SIZE][/B][/COLOR][/I]<br><br>[COLOR=rgb(65, 168, 95)][I][B][SIZE=5]При одобрении заявки вам напишет:[/SIZE][/B][/I][/COLOR]<br>[SIZE=5][COLOR=rgb(65, 168, 95)][I][B][URL='https://vk.com/efrimovs'][I][B]Главный Следящий за ОПГ : - [/B][/I]*КЛИКАБЕЛЬНО*[/URL] [/B][/I][/COLOR][/SIZE]<br>[COLOR=rgb(65, 168, 95)][I][B][SIZE=5][URL='http://'][I][B]Заместитель Главного Следящего за ОПГ: - [/B][/I][/URL][I][B][URL='http://']*КЛИКАБЕЛЬНО*[/URL][/B][/I][/SIZE][/B][/I][/COLOR]<br><br>[I][COLOR=rgb(247, 218, 100)][B]Доброго времени
         суток, уважаемые игроки[/B][/COLOR][/I]<br>[COLOR=rgb(247, 218, 100)][B][I]Black Russia [/I][/B][/COLOR][COLOR=rgb(0, 168, 133)][B][I]KURSK[/I][/B][/COLOR][B][I][COLOR=#f7da64], пришло время открывать заявки на пост лидера [/COLOR][COLOR=rgb(65, 168, 95)]«Арзамаской ОПГ»[/COLOR][/I][/B]<br>[COLOR=rgb(247, 218, 100)][I][B]Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.[/B][/I][/COLOR]<br><br>[COLOR=rgb(250, 197, 28)][I][B]Требования к кандидату<br><br>- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь Discord и исправно работающий микрофон;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]-[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Быть в возрасте от 15 лет;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Не иметь действующих варнов/банов;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь никнейм формата Имя_Фамилия;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]-[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.[/B][/I][/COLOR]<br><br>[COLOR=rgb(184, 49, 47)][I][B]Примечание: [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]запрещено подавать заявки на должность лидера несколько организаций одновременно и только на
         одном сервере;[/B][/I][/COLOR]<br>[COLOR=rgb(184, 49, 47)][I][B]Примечание:[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;[/B][/I][/COLOR]<br>[COLOR=rgb(184, 49, 47)][I][B]Примечание: [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).[/B][/I][/COLOR]<br><br>[COLOR=rgb(251, 160, 38)][I][B]Форма подачи заявки[/B][/I][/COLOR]<br>[COLOR=rgb(243, 121, 52)][I][B]1.[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Никнейм:[/B][/I][/COLOR]<br>[B][I][COLOR=rgb(243, 121, 52)]2.[/COLOR][COLOR=rgb(209, 213, 216)] Игровой уровень:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]3. [/COLOR][COLOR=rgb(209, 213, 216)]Скриншот статистики аккаунта с /time:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]4.[/COLOR][COLOR=rgb(209, 213, 216)] Были ли варны/баны (если да, то за что):[/COLOR]<br>[COLOR=rgb(243, 121, 52)]5.[/COLOR][COLOR=rgb(209, 213, 216)] Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):[/COLOR]<br>[COLOR=rgb(243, 121, 52)]6.[/COLOR][COLOR=rgb(209, 213, 216)] Почему именно вы должны занять пост лидера?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]7.[/COLOR][COLOR=rgb(209, 213, 216)] Имеется ли опыт в данной организации?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]8. [/COLOR][COLOR=rgb(209, 213, 216)]Ссылка на одобренную RP биографию персонажа:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]9. [/COLOR][COLOR=rgb(209, 213, 216)]Были ли вы лидером любой другой организации?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]10. [/COLOR][COLOR=rgb(209, 213, 216)]Ваш часовой пояс:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]11. [/COLOR][COLOR=rgb(209, 213, 216)]Ссылка на страницу ВКонтакте:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]12. [/COLOR][COLOR=rgb(209, 213, 216)]Логин Discord аккаунта:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]13.[/COLOR][COLOR=rgb(209, 213, 216)] Ваше реальное имя:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]14. [/COLOR][COLOR=rgb(209, 213, 216)]Ваш реальный возраст:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]15. [/COLOR][COLOR=rgb(209, 213, 216)]Город, в котором проживаете:[/COLOR][/I][/B][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("A_OPG")
        }
    }

    function L_OPG() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Лыткаринской ОПГ\""

        if (localStorage.getItem("L_OPG") == null || localStorage.getItem("L_OPG") == "null") {
        text.innerHTML = `[CENTER][B][I][SIZE=6][COLOR=rgb(255, 0, 0)]WARNING![/COLOR][/SIZE][/I][/B]<br>[I][COLOR=rgb(255, 255, 255)][B][SIZE=5]Администрация проекта ни в коем случае не запрашивает пароли от аккаунтов, а также все обзвоны на должность проходят в официальных Discord серверах, где можно удостовериться в личности администратора и включить демонстрацию экрана.[/SIZE][/B][/COLOR][/I]<br><br>[COLOR=rgb(65, 168, 95)][I][B][SIZE=5]При одобрении заявки вам напишет:[/SIZE][/B][/I][/COLOR]<br>[SIZE=5][COLOR=rgb(65, 168, 95)][I][B][URL='https://vk.com/efrimovs'][I][B]Главный Следящий за ОПГ : - [/B][/I]*КЛИКАБЕЛЬНО*[/URL] [/B][/I][/COLOR][/SIZE]<br>[COLOR=rgb(65, 168, 95)][I][B][SIZE=5][URL='http://'][I][B]Заместитель Главного Следящего за ОПГ: - [/B][/I][/URL][I][B][URL='http://']*КЛИКАБЕЛЬНО*[/URL][/B][/I][/SIZE][/B][/I][/COLOR]<br><br>[I][COLOR=rgb(247, 218, 100)][B]Доброго времени суток, уважаемые игроки[/B][/COLOR][/I]<br>[COLOR=rgb(247, 218, 100)][B][I]Black Russia [/I][/B][/COLOR][COLOR=rgb(0, 168, 133)][B][I]KURSK[/I][/B][/COLOR][B][I][COLOR=#f7da64], пришло время открывать заявки на пост лидера [/COLOR][COLOR=#fba026]"Лыткаринской  ОПГ" [/COLOR][/I][/B]<br>[COLOR=rgb(247, 218, 100)][I][B]Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.[/B][/I][/COLOR]<br><br>[COLOR=rgb(250, 197, 28)][I][B]Требования к кандидату<br><br>- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь Discord и исправно работающий микрофон;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]-[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Быть в возрасте от 15 лет;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Не иметь действующих варнов/банов;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь никнейм формата Имя_Фамилия;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Занять должность лидера в организациях разрешается с
        8 уровня игрового аккаунта;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]-[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.[/B][/I][/COLOR]<br><br>[COLOR=rgb(184, 49, 47)][I][B]Примечание: [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;[/B][/I][/COLOR]<br>[COLOR=rgb(184, 49, 47)][I][B]Примечание:[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;[/B][/I][/COLOR]<br>[COLOR=rgb(184, 49, 47)][I][B]Примечание: [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).[/B][/I][/COLOR]<br><br>[COLOR=rgb(251, 160, 38)][I][B]Форма подачи заявки[/B][/I][/COLOR]<br>[COLOR=rgb(243, 121, 52)][I][B]1.[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Никнейм:[/B][/I][/COLOR]<br>[B][I][COLOR=rgb(243, 121, 52)]2.[/COLOR][COLOR=rgb(209, 213, 216)] Игровой уровень:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]3. [/COLOR][COLOR=rgb(209, 213, 216)]Скриншот статистики аккаунта с /time:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]4.[/COLOR][COLOR=rgb(209, 213, 216)] Были ли варны/баны (если да, то за что):[/COLOR]<br>[COLOR=rgb(243, 121, 52)]5.[/COLOR][COLOR=rgb(209, 213, 216)] Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):[/COLOR]<br>[COLOR=rgb(243, 121, 52)]6.[/COLOR][COLOR=rgb(209, 213, 216)] Почему именно вы должны занять пост лидера?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]7.[/COLOR][COLOR=rgb(209, 213, 216)] Имеется ли опыт в данной организации?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]8. [/COLOR][COLOR=rgb(209, 213, 216)]Ссылка на одобренную RP биографию персонажа:
        [/COLOR]<br>[COLOR=rgb(243, 121, 52)]9. [/COLOR][COLOR=rgb(209, 213, 216)]Были ли вы лидером любой другой организации?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]10. [/COLOR][COLOR=rgb(209, 213, 216)]Ваш часовой пояс:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]11. [/COLOR][COLOR=rgb(209, 213, 216)]Ссылка на страницу ВКонтакте:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]12. [/COLOR][COLOR=rgb(209, 213, 216)]Логин Discord аккаунта:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]13.[/COLOR][COLOR=rgb(209, 213, 216)] Ваше реальное имя:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]14. [/COLOR][COLOR=rgb(209, 213, 216)]Ваш реальный возраст:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]15. [/COLOR][COLOR=rgb(209, 213, 216)]Город, в котором проживаете:[/COLOR][/I][/B][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("L_OPG")
        }
    }

    function B_OPG() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Батыревской ОПГ\""

        if (localStorage.getItem("B_OPG") == null || localStorage.getItem("B_OPG") == "null") {
        text.innerHTML = `[CENTER][B][I][SIZE=6][COLOR=rgb(255, 0, 0)]WARNING![/COLOR][/SIZE][/I][/B]<br>[I][COLOR=rgb(255, 255, 255)][B][SIZE=5]Администрация проекта ни в коем случае не запрашивает пароли от аккаунтов, а также все обзвоны на должность проходят в официальных Discord серверах, где можно удостовериться в личности администратора и включить демонстрацию экрана.[/SIZE][/B][/COLOR][/I]<br><br>[COLOR=rgb(65, 168, 95)][I][B][SIZE=5]При одобрении заявки вам напишет:[/SIZE][/B][/I][/COLOR]<br>[SIZE=5][COLOR=rgb(65, 168, 95)][I][B][URL='https://vk.com/governmentpersona'][I][B]Главный Следящий за ОПГ : - [/B][/I]*КЛИКАБЕЛЬНО*[/URL] [/B][/I][/COLOR][/SIZE]<br>[COLOR=rgb(65, 168, 95)][I][B][SIZE=5][URL='https://vk.com/id718786052'][I][B]Заместитель Главного Следящего за ОПГ: - [/B][/I][/URL][I][B][URL='https://vk.com/id718786052']*КЛИКАБЕЛЬНО*[/URL][/B][/I][/SIZE][/B][/I][/COLOR]<br><br>[I][COLOR=rgb(247, 218, 100)][B]Доброго времени суток, уважаемые игроки[/B][/COLOR][/I]<br>[COLOR=rgb(247, 218, 100)][B][I]Black Russia [/I][/B][/COLOR][COLOR=rgb(0, 168, 133)][B][I]KURSK[/I][/B][/COLOR][B][I][COLOR=#f7da64], пришло время открывать заявки на пост лидера[/COLOR][COLOR=rgb(41, 105, 176)] «Батыревской ОПГ»[/COLOR][/I][/B]<br>[COLOR=rgb(247, 218, 100)][I][B]Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.[/B][/I][/COLOR]<br><br>[COLOR=rgb(250, 197, 28)][I][B]Требования к кандидату<br><br>- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь Discord и исправно работающий микрофон;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]-[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Быть в возрасте от 15 лет;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Не иметь действующих варнов/банов;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь никнейм формата Имя_Фамилия;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)]
        [I][B]Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]-[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;[/B][/I][/COLOR]<br>[COLOR=rgb(250, 197, 28)][I][B]- [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.[/B][/I][/COLOR]<br><br>[COLOR=rgb(184, 49, 47)][I][B]Примечание: [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;[/B][/I][/COLOR]<br>[COLOR=rgb(184, 49, 47)][I][B]Примечание:[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;[/B][/I][/COLOR]<br>[COLOR=rgb(184, 49, 47)][I][B]Примечание: [/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B]запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).[/B][/I][/COLOR]<br><br>[COLOR=rgb(251, 160, 38)][I][B]Форма подачи заявки[/B][/I][/COLOR]<br>[COLOR=rgb(243, 121, 52)][I][B]1.[/B][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][B] Никнейм:[/B][/I][/COLOR]<br>[B][I][COLOR=rgb(243, 121, 52)]2.[/COLOR][COLOR=rgb(209, 213, 216)] Игровой уровень:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]3. [/COLOR][COLOR=rgb(209, 213, 216)]Скриншот статистики аккаунта с /time:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]4.[/COLOR][COLOR=rgb(209, 213, 216)] Были ли варны/баны (если да, то за что):[/COLOR]<br>[COLOR=rgb(243, 121, 52)]5.[/COLOR][COLOR=rgb(209, 213, 216)] Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):[/COLOR]<br>[COLOR=rgb(243, 121, 52)]6.[/COLOR][COLOR=rgb(209, 213, 216)] Почему именно вы должны занять пост лидера?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]7.[/COLOR][COLOR=rgb(209, 213, 216)] Имеется ли опыт в данной организации?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]8. [/COLOR][COLOR=rgb(209
        , 213, 216)]Ссылка на одобренную RP биографию персонажа:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]9. [/COLOR][COLOR=rgb(209, 213, 216)]Были ли вы лидером любой другой организации?:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]10. [/COLOR][COLOR=rgb(209, 213, 216)]Ваш часовой пояс:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]11. [/COLOR][COLOR=rgb(209, 213, 216)]Ссылка на страницу ВКонтакте:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]12. [/COLOR][COLOR=rgb(209, 213, 216)]Логин Discord аккаунта:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]13.[/COLOR][COLOR=rgb(209, 213, 216)] Ваше реальное имя:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]14. [/COLOR][COLOR=rgb(209, 213, 216)]Ваш реальный возраст:[/COLOR]<br>[COLOR=rgb(243, 121, 52)]15. [/COLOR][COLOR=rgb(209, 213, 216)]Город, в котором проживаете:[/COLOR][/I][/B][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("B_OPG")
        }
    }

    function PRAVO() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Правительство\""

        if (localStorage.getItem("PRAVO") == null || localStorage.getItem("PRAVO") == "null") {
        text.innerHTML = `[CENTER][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "Правительство".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!!<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vc29yYV9sZXJvdXpl']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:<br>15. Город, в котором проживаете:[/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("PRAVO")
        }
    }

    function CMI() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"СМИ\""

        if (localStorage.getItem("CMI") == null || localStorage.getItem("CMI") == "null") {
        text.innerHTML = `[CENTER][B][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "СМИ".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!!<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://vk.com/sora_lerouze']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/B]<br>[I][B]15. Город, в котором проживаете:[/B][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("CMI")
        }
    }

    function CB() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Больница\""

        if (localStorage.getItem("CB") == null || localStorage.getItem("CB") == "null") {
        text.innerHTML = `[CENTER][B][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "Больница".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>[SIZE=6]Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!![/SIZE]<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://vk.com/sora_lerouze']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/B]<br>[I][B]15. Город, в котором проживаете:[/B][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("CB")
        }
    }

    function MO() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"МО\""

        if (localStorage.getItem("MO") == null || localStorage.getItem("MO") == "null") {
        text.innerHTML = `[CENTER][B][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "Воинская Часть".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>[SIZE=6]Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!![/SIZE]<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vc29yYV9sZXJvdXpl']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/B]<br>[I][B]15. Город, в котором проживаете:[/B][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("MO")
        }
    }

    function GIBDD() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Отдел Полиции №1 (ГИБДД)\""

        if (localStorage.getItem("GIBDD") == null || localStorage.getItem("GIBDD") == "null") {
        text.innerHTML = `[CENTER][B][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "ГИБДД".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>[SIZE=6]Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!![/SIZE]<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vc29yYV9sZXJvdXpl']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/B]<br>[I][B]15. Город, в котором проживаете:[/B][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("GIBDD")
        }
    }

    function YMVD() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"Отдел Полиции №2 (УМВД)\""

        if (localStorage.getItem("YMVD") == null || localStorage.getItem("YMVD") == "null") {
        text.innerHTML = `[CENTER][B][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "УМВД".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>[SIZE=6]Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!![/SIZE]<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vc29yYV9sZXJvdXpl']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/B]<br>[I][B]15. Город, в котором проживаете:[/B][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("YMVD")
        }
    }

    function FCB() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"ФСБ\""

        if (localStorage.getItem("FCB") == null || localStorage.getItem("FCB") == "null") {
        text.innerHTML = `[CENTER][I][FONT=tahoma]Доброго времени суток, уважаемые игроки[/FONT][/I]<br>[FONT=tahoma][I]Black Russia KURSK, пришло время открывать заявки на пост лидера "ФСБ".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>[SIZE=6]Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!![/SIZE]<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vdml0YWxpeV9leHRyZW1l']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vc29yYV9sZXJvdXpl']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/FONT]<br>[I][FONT=tahoma]15. Город, в котором проживаете:[/FONT][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("FCB")
        }
    }

    function FCIN() {
        all();
        const text = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
        const header = document.querySelector(".input.js-titleInput.input--title")

        header.textContent = "KURSK || Заявление на должность Лидера Организации \"ФСИН\""

        if (localStorage.getItem("FCIN") == null || localStorage.getItem("FCIN") == "null") {
            text.innerHTML = `[CENTER][B][I]Доброго времени суток, уважаемые игроки<br>Black Russia KURSK, пришло время открывать заявки на пост лидера "ФСИН".<br>Для того, что бы оставить заявку на пост лидера, в первую очередь вам нужно ознакомиться со всеми правилами сервера/лидера.<br><br>Важно: Администрация НИКОГДА НЕ ПОПРОСИТ ваш ПАРОЛЬ, если вам пишут и просят пароль, то кидайте их в ЧС, так как это мошенники!!!<br><br>Требования к кандидату<br><br>- Иметь Discord и исправно работающий микрофон;<br>- Быть в возрасте от 15 лет;<br>- Не иметь действующих варнов/банов;<br>- Иметь никнейм формата Имя_Фамилия;<br>- Занять должность лидера в организациях разрешается с 8 уровня игрового аккаунта;<br>- Быть ознакомленным с правилами серверов, лидеров, государственных и нелегальных организаций;<br>- Иметь подключенную дополнительную защиту к игровому аккаунту через Telegram, VK, почту.<br><br>Руководство Государственных Организаций (нажмите на ник и вас перекинет на VK страницу)<br><br>Главный Следящий - [URL='https://vk.com/vitaliy_extreme']Vitaliy_Extreme[/URL]<br>Зам. Главного Следящего - [URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vc29yYV9sZXJvdXpl']Sora_Lerouze[/URL]<br><br>Примечание: запрещено подавать заявки на должность лидера несколько организаций одновременно и только на одном сервере;<br>Примечание: скриншот статистики игрового аккаунта с /time принимается только в том случае, если он сделан после открытия заявок;<br>Примечание: запрещено предоставлять скриншот статистики игрового аккаунта загруженного в соц. сети (VK, Instagram).<br><br>Форма подачи заявки<br>1. Никнейм:<br>2. Игровой уровень:<br>3. Скриншот статистики аккаунта с /time:<br>4. Были ли варны/баны (если да, то за что):<br>5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):<br>6. Почему именно вы должны занять пост лидера?:<br>7. Имеется ли опыт в данной организации?:<br>8. Ссылка на одобренную RP биографию персонажа:<br>9. Были ли вы лидером любой другой организации?:<br>10. Ваш часовой пояс:<br>11. Ссылка на страницу ВКонтакте:<br>12. Логин Discord аккаунта:<br>13. Ваше реальное имя:<br>14. Ваш реальный возраст:[/I][/B]<br>[I][B]15. Город, в котором проживаете:[/B][/I][/CENTER]`
        }
        else {
            text.innerHTML = localStorage.getItem("FCIN")
        }
    }

    button_AP.addEventListener('click', () => {
            AP();
    })

    button_A_OPG.addEventListener('click', () => {
            A_OPG();
    })

    button_L_OPG.addEventListener('click', () => {
            L_OPG();
    })

    button_B_OPG.addEventListener('click', () => {
            B_OPG();
    })

    button_PRAVO.addEventListener('click', () => {
            PRAVO();
    })

    button_CMI.addEventListener('click', () => {
            CMI();
    })

    button_CB.addEventListener('click', () => {
            CB();
    })

    button_MO.addEventListener('click', () => {
            MO();
    })

    button_GIBDD.addEventListener('click', () => {
            GIBDD();
    })

    button_YMVD.addEventListener('click', () => {
            YMVD();
    })

    button_FCB.addEventListener('click', () => {
            FCB();
    })

    button_FCIN.addEventListener('click', () => {
            FCIN();
    })
})();