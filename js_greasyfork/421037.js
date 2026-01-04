// ==UserScript==
// @name         Virtonomica: manage units
// @namespace    virtonomica
// @version      0.14
// @description  try to take over the world!
// @author       chippa
// @match        https://virtonomica.ru/vera/main/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421037/Virtonomica%3A%20manage%20units.user.js
// @updateURL https://update.greasyfork.org/scripts/421037/Virtonomica%3A%20manage%20units.meta.js
// ==/UserScript==
var run = function () {

    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    $.ajaxSetup({async: false});
    if (/user\/privat\/persondata\/quest\/list/.test(window.location.pathname))
    { // в главном меню настроек
        var $main = $("#mainContent");
        $main.html("");
        var company_id, company_name, company_asset;

        var link = "https://virtonomica.ru/api/vera/main/my/company";
        $.get(link, function (data) {
            company_id =  data.id;
            company_name = data.name;
            company_asset = data.asset_value.split(".")[0];

        });

        $main.html(company_id + " - " + company_name);


        // запостим в сервак инфу о размере активов. зачем-то
        $.ajax
        ({
            type: "POST",
            url: 'https://bmart.com.ua/content/export/virta/company.php',
            dataType: 'json',
            async: true,
            data: { "company_id": company_id, "company_asset" : company_asset },
            success: function (data) {

            }
        });
        $main.append('<br><hr><div id=\'group_log\'>Журнал здеся</div>');
        $main.append('<hr><div id=\'left_tasks\'>Осталось задач: хз</div><hr>');
        $main.append('<hr><div id=\'unit_list\'>Список подразделений</div><hr>');
        $main.append($('<input type=\'button\' value=\'Отправить список юнитов\' id=\'refresh_unit_list\' >'));
        var $refresh_unit_list = $('#refresh_unit_list');
        $refresh_unit_list.click(function () {
            // отправить на сервер список всех юнитов
            $('#group_log').html('Получаю список подразделений... ');
            link = "https://virtonomica.ru/api/vera/main/company/units?id="+company_id+"&pagesize=10000";
            $.get(link, function (data) {
                $('#group_log').append('Уфф списочек...');
                $.ajax
                ({
                    type: "POST",
                    url: 'https://bmart.com.ua/content/export/virta/units.php',
                    dataType: 'json',
                    async: false,
                    data: { "company_id": company_id, "json": JSON.stringify(data) },
                    complete: function () {
                        $('#group_log').html('Список подразделений обновлен!');
                    }
                });

            });
        });

        $main.append($('<input type=\'button\' value=\'Список юнитов\' id=\'get_unit_list\' >'));
        var $get_unit_list = $('#get_unit_list');
        $get_unit_list.click(function () {

            // отправить на сервер список всех юнитов
            $('#group_log').html('Получаю список подразделений... ');
            $('#unit_list').html("");
            link = "https://bmart.com.ua/content/export/virta/units.php?company_id="+company_id+"&command=get_group_list";
            $.get(link, function (data) {
                $('#unit_list').append(data);
            });
            $('#group_log').html('Список загружен!');
            $('a.unitgroup').each(function () {
                $(this).click(function(){ showUnits($(this).attr("data-unit-type")); });
            });

        });

        function showUnits(unit_type)
        {
            $('#group_log').html('Получаю список подразделений... ');
            link = "https://bmart.com.ua/content/export/virta/units.php?company_id="+company_id+"&command=get_unit_list&unit_type="+unit_type;
            $.get(link, function (data) {
                $('#td-'+unit_type).html(data);
            });
            $('#group_log').html('Список загружен!');
            $('span.task_button').each(function () {
                $(this).click(function(){ setTask($(this).attr("data-unit-id"), $(this).attr("data-task-type-id"), $(this)); });
            });
        }
        function setTask(unit_id, task_type_id, button)
        {
            link = "https://bmart.com.ua/content/export/virta/tasks.php?company_id="+company_id+"&unit_id="+unit_id+"&task_type_id="+task_type_id;
            $.get(link, function (data) {
                if(data == "OK")
                {
                    //               console.log(button.css("color"));
                    if(button.css("color") == "rgb(128, 128, 128)")
                    {
                        button.css("color", "green");
                    }else{
                        button.css("color", "grey");
                    }
                }
            });
        }
        $main.append($('<input type=\'button\' value=\'Выполнить все задачи\' id=\'do_one_task\' >'));
        var $do_one_task = $('#do_one_task');
        function click_one_task()
        {
            $do_one_task.click();
        }
        $do_one_task.click(function () {
            if(localStorage.getItem('virtonomica_manage_unit') != "") {
                $('#group_log').html('Еще что-то выполняю...');
                $('#left_tasks').html('Осталось задач: ' + JSON.parse(localStorage.getItem('virtonomica_manage_unit'))[5]);
                $('#unit_list').html(localStorage.getItem('virtonomica_manage_unit'));
                setTimeout(click_one_task, 1000);
                return false;
            }

            $('#group_log').html('Получаю одну задачу... ');
            $('#unit_list').html("");
            link = "https://bmart.com.ua/content/export/virta/tasks.php?company_id="+company_id+"&command=get_one_task";
            $.get(link, function (data) {
                $('#unit_list').append(data);

                if(JSON.parse(data)[0] !== "pause") {
                    $('#group_log').html('Пошел выполнять!');
                    window.open(JSON.parse(data)[0], '_blank');
                    localStorage.setItem('virtonomica_manage_unit', data);
                    setTimeout(click_one_task, 1000);
                }
                if(JSON.parse(data)[0] == "pause") {
                    // делать нефиг. ждем-с.
                    $('#group_log').html('Делать нефиг. жду.');
                    setTimeout(click_one_task, JSON.parse(data)[1] * 1000);
                }
            });



        });
        $main.append($('<input type=\'button\' value=\'Очистить\' id=\'clear_task\' >'));
        var $clear_task = $('#clear_task');
        $clear_task.click(function () {
            localStorage.setItem('virtonomica_manage_unit', "");
        });
    }else{
        // где-то на задании
        //        console.log("и шо тут надо сделать?");
        var task = JSON.parse(localStorage.getItem('virtonomica_manage_unit'));
        //        console.log(task[0]);
        //       console.log(window.location.href);
        if(task[0] == window.location.href)
        {
            // мы на странице, где нужно выполнить текущее задание
            eval(task[2]);
            //            console.log(task[1]);
        }
        if(task[1] == window.location.href)
        {
            // report to API
            link = "https://bmart.com.ua/content/export/virta/tasks.php?command=done_one_task&unit_id="+task[3]+"&task_id="+task[4];
            $.get(link, function (data) {
            });
            // clear cookie
            localStorage.setItem('virtonomica_manage_unit', "");
            // close window
            window.close();
        }
        //console.log(task[0]);

    }
}
if (window.top == window) {
    var script = document.createElement('script');
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}