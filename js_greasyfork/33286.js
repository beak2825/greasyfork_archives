// ==UserScript==
// @name postEditor
// @description:ru Доп меню в редакторе сообщений
// @namespace excelworld.ru
// @require https://code.jquery.com/jquery-1.12.4.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @include *.excelworld.ru/*
// @run-at document-start
// @version 0.1
// @description Доп меню в редакторе сообщений
// @downloadURL https://update.greasyfork.org/scripts/33286/postEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/33286/postEditor.meta.js
// ==/UserScript==
$(function() {
    if ($("textarea.postTextFl").length){
        var style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
        $("head").prepend(style);
/*
label - то, что отображается в диалоговом окошке
value - то, что вставляется в текстовое окошко сообщения
\n - перенос на следующую строку
*/
        var menu=[{
            label: "Прочитайте Правила форума",
            value: "Прочитайте [url=http://www.excelworld.ru/forum/2-20-1]Правила форума[/url]\n"
        },{
            label: "Исправьте название темы в соответствии с п2 Правил форума",
            value: "Исправьте название темы в соответствии с п2 Правил форума\n"
        },{
            label: "Оформите формулу тегами (кнопка fx)",
            value: "Оформите формулу тегами (кнопка [b]fx[/b])\n"
        },{
            label: "Оформите код тегами (кнопка #)",
            value: "Оформите код тегами (кнопка [b]#[/b])\n"
        }];

        var post = $("textarea.postTextFl").parents("span:first");
        post.before("<input type='button' id='myMenu' class='codeButtons' value='вставить фразу'>");
        var dialog = document.createElement("div");
        dialog.id="dialog";
        dialog.title = "Выбор фраз";
        post.before(dialog);
        $.each(menu, function(i, el){
            var chb = document.createElement("input"),
                lab = document.createElement("label");

            $(chb).attr("type","checkbox");
            $(chb).attr("id","el" + i);
            $(chb).val(el.value);
            $(lab).attr("for", "el" + i);
            $(lab).html(el.label);
            $( "#dialog" ).append(chb).append(lab).append("<br>");
        });

        $('#dialog').dialog({
            buttons: [{text: "OK", click: function() {
                var res ="";
                $('#dialog input').filter(":checked").each(function(){
                    res += $(this).val();
                });
                $("textarea.postTextFl").val($("textarea.postTextFl").val() + res);
                $('#dialog input').prop("checked", false);
                $(this).dialog("close");
            }}],
            autoOpen: false,
            resizable: false
        });

        $("#myMenu").click(function(){
            $("#dialog").dialog('open');
        });
    }
});