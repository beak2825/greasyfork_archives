// ==UserScript==
// @name         HWM_DisableArtsDiscarding
// @namespace    Небылица
// @version      1.1
// @description  Удаление кнопок выброса артов + более внятное окно подтверждения
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/inventory\.php/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/382910/HWM_DisableArtsDiscarding.user.js
// @updateURL https://update.greasyfork.org/scripts/382910/HWM_DisableArtsDiscarding.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function freezeConfirmationButton(time){ // Ставит заморозку на time мс на кнопку подтверждения после её появления (3 секунды по умолчанию)
        if (!time){time = 3000};

        var discardingAs = document.querySelectorAll("a[href='/inventory.php'][onclick^='javascript: inv_sweet_']"),
            confirmationButton;
        discardingAs.forEach(function(a){
            a.parentNode.addEventListener("click", function(){
                confirmationButton = document.querySelector("button[class='confirm']");
                confirmationButton.disabled = true;
                window.setTimeout(function(){confirmationButton.disabled = false;}, time);
            });
        });
    }
    function setDiscardingButtonsVisibility(visibility){ // Прячет (false), либо показывает (true) кнопки выброса на текущей вкладке
        var discardingAs = document.querySelectorAll("a[href='/inventory.php'][onclick^='javascript: inv_sweet_']");
        discardingAs.forEach(function(a){
            a.parentNode.hidden = !visibility;
        });
    }
    function setupVisibilityResetting(){ // Привязка перевыставления видимости кнопок выброса и заморозки кнопки подтверждения к смене выборки артов (по актуальным на момент смены настройкам))
        var artsDiv = document.getElementById("test"),
            observer = new MutationObserver(function(mutations){
                mutations.forEach(function(mutation){
                    setDiscardingButtonsVisibility(GM_getValue("enableDiscarding" + plIdSubKey));
                    freezeConfirmationButton();
                });
            }),
            config = {characterData: false, attributes: false, childList: true, subtree: false};
        observer.observe(artsDiv, config);
    }
    function setEnableDiscardingCheckboxTitle(enableDiscardingCheckbox, checked){ // Выставляет подпись для чекбокса настройки в зависимости от переданного состояния
        var title = (checked) ? "Отключить выброс артов" : "Включить выброс артов";
        enableDiscardingCheckbox.title = title;
    }
    function insertAfter(newNode, referenceNode){ // Вставка newNode после referenceNode
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    String.prototype.replaceLast = function(searchValue, newValue){ // Заменяет последнее вхождение searchValue в строке на newValue
        var lastIndex = this.lastIndexOf(searchValue);
        if (lastIndex !== -1){
            return this.substring(0, lastIndex) + newValue + this.substring(lastIndex + searchValue.length, this.length);
        }
    };
    //


    // получаем id текущего персонажа и кусок ключа по нему
    var plId = document.querySelector("li > a[href^='pl_hunter_stat.php']").getAttribute("href").split("id=")[1],
        plIdSubKey = "|#" + plId;

    // дефолтно убираем кнопки выброса
    if (GM_getValue("enableDiscarding" + plIdSubKey) === undefined){GM_setValue("enableDiscarding" + plIdSubKey, false);}

    // показываем/отключаем кнопки в зависимости от настройки
    setDiscardingButtonsVisibility(GM_getValue("enableDiscarding" + plIdSubKey));

    // привязываем перевыставление видимости кнопок выброса и заморозку кнопки подтверждения к смене выборки артов (по актуальным на момент смены настройкам)
    setupVisibilityResetting();

    // отрисовываем чекбокс настройки
    var enableDiscardingCheckboxSpan = document.createElement("span"),
        enableDiscardingCheckbox = document.createElement("input"),
        questionMarkElement = document.querySelector("a[title^='(доступно']");

    enableDiscardingCheckboxSpan.setAttribute("id", "enableDiscardingCheckboxSpan");
    enableDiscardingCheckboxSpan.innerHTML = " ";

    enableDiscardingCheckbox.setAttribute("type", "checkbox");
    enableDiscardingCheckbox.setAttribute("id", "enableDiscardingCheckbox");
    enableDiscardingCheckbox.style.margin = "0px";

    // выставляем галочку и подпись
    if (GM_getValue("enableDiscarding" + plIdSubKey)){
        enableDiscardingCheckbox.checked = true;
    }
    setEnableDiscardingCheckboxTitle(enableDiscardingCheckbox, enableDiscardingCheckbox.checked);

    // вставляем в страницу
    enableDiscardingCheckboxSpan.appendChild(enableDiscardingCheckbox);
    insertAfter(enableDiscardingCheckboxSpan, questionMarkElement);

    // записываем и применяем настройку по изменению чекбокса (переспрашиваем, если включили выброс)
    enableDiscardingCheckbox.onchange = function(){
        if (enableDiscardingCheckbox.checked){
            if (confirm("Включить выброс артов?")){
                GM_setValue("enableDiscarding" + plIdSubKey, true);
                setEnableDiscardingCheckboxTitle(enableDiscardingCheckbox, true);
                setDiscardingButtonsVisibility(true);
            } else{
                enableDiscardingCheckbox.checked = false;
            }
        } else{
            GM_setValue("enableDiscarding" + plIdSubKey, false);
            setEnableDiscardingCheckboxTitle(enableDiscardingCheckbox, false);
            setDiscardingButtonsVisibility(false);
        }
    };


    // перерисовываем окошко подтверждения
    var changeConfirmationAlertsScript = document.createElement("script");
    changeConfirmationAlertsScript.type = "text/javascript";

    changeConfirmationAlertsScript.innerHTML =
        "var drop_str = '';" +
        "function inv_sweet_prompt(del_name, link){" +
        "    return swal(" +
        "        {" +
        "        title: del_name.replaceLast('[', '[<text style=\"color: red;\"\>').replaceLast(']', '</text>]')," +
        "        text: 'Выбросить этот предмет? Введите ник для подтверждения'," +
        "        type: 'input'," +
        "        confirmButtonColor: '#DD6B55'," +
        "        cancelButtonText: 'Отмена'," +
        "        showCancelButton: true," +
        "        closeOnConfirm: false," +
        "        html: true," +
        "        inputPlaceholder: 'Введите ваш ник'" +
        "        }," +
        "        function(inputValue){" +
        "            if (inputValue === false) return false;" +
        "            if (inputValue === '') {swal.showInputError('Чтобы выбросить предмет, вы должны ввести ник!');return false}" +
        "            if (inputValue.toLowerCase() != player_nick) {swal.showInputError('Ник не совпадает');return false}" +
        "            swal.close(); window.location.href = 'inventory.php?sell=' + link + '&sign=' + sign;" +
        "        }" +
        "    );" +
        "}" +

        "function inv_sweet_confirm(del_name, link){" +
        "     return swal(" +
        "        {" +
        "        title: del_name.replaceLast('[', '[<text style=\"color: red;\"\>').replaceLast(']', '</text>]') + '</b>'," +
        "        text: 'Выбросить этот предмет?'," +
        "        type: 'warning'," +
        "        confirmButtonColor: '#DD6B55'," +
        "        cancelButtonText: 'Отмена'," +
        "        confirmButtonText: 'Да, выбросить!'," +
        "        showCancelButton: true," +
        "        closeOnConfirm: false," +
        "        html: true" +
        "        }," +
        "        function(){" +
        "            swal.close(); window.location.href = 'inventory.php?sell=' + link + '&sign=' + sign;" +
        "        }" +
        "    );" +
        "}";

    document.getElementsByTagName("body")[0].appendChild(changeConfirmationAlertsScript);

    // ставим фриз на кнопку подтверждения
    freezeConfirmationButton();
})();