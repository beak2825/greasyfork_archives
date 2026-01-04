// ==UserScript==
// @name           Virtonomica: фильтр по индикаторам
// @namespace      virtonomica
// @version        1.51
// @description    Дополнительный фильтр на страницах подразделений
// @include        *virtonomic*.*/*/main/company/view/*/unit_list
// @include        *virtonomic*.*/*/main/company/view/*
// @exclude        *virtonomic*.*/*/main/company/view/*/unit_list/equipment*
// @exclude        *virtonomic*.*/*/main/company/view/*/unit_list/employee*
// @author         cobr123
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/40815/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D0%B8%D0%BD%D0%B4%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/40815/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D0%B8%D0%BD%D0%B4%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%D0%B0%D0%BC.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;

    function showAll() {
        $('table > tbody > tr > td.alerts').each(function() {
            $(this).parent().show();
            var nextRow = $(this).parent().next('tr');
            if(nextRow.attr("class") == 'unit_comment'){
                nextRow.show();
            }
        });
    }
    function containsWord(haystack, needle) {
        return (" " + haystack + " ").indexOf(" " + needle + " ") !== -1;
    }
    function hideByCell(cell, imgSrc){
        var notFound = true;
        var row = cell.parent();
        var nextRow = row.next('tr');
        var childs = cell.children('img');
        if(childs.length > 0){
            childs.each(function() {
                if(notFound){
                    if($(this).attr('src') !== imgSrc){
                        row.hide();
                        if(containsWord(nextRow.attr("class"), 'unit_comment')){
                            nextRow.hide();
                        }
                    } else {
                        notFound = false;
                        row.show();
                        if(containsWord(nextRow.attr("class"), 'unit_comment')){
                            nextRow.show();
                        }
                    }
                }
            });
        } else {
            row.hide();
            if(containsWord(nextRow.attr("class"), 'unit_comment')){
                nextRow.hide();
            }
        }
        return notFound;
    }
    function showByImgSrc(imgSrc) {
        var notFound = true;
        $('table > tbody > tr > td.alerts').each(function() {
            var cell = $(this);
            notFound = hideByCell(cell, imgSrc);
            if(notFound){
                hideByCell(cell.parent().children('td.prod').eq(0), imgSrc);
            }
        });
    }
    //var container = $('#mainContent tr:first > td:first');
    var container = $("td.u-l").parent().parent();

    var panel = $("#indicator_filter");
    // добавить панель, если её еще нет
    var ext_panel = "<div style='padding: 2px; border: 1px solid #0184D0; border-radius: 4px 4px 4px 4px; float:left; white-space:nowrap; color:#0184D0; display:none;'  id=indicator_filter></div>";
    container.append( "<tr><td>" +ext_panel +"</td></tr>");
    readAlerts();

    function readAlerts(){
        $("#indicator_filter").empty();
        var alerts = {};
        function addAlert(img) {
            var imgSrc = img.attr('src');
            var imgTitle = img.attr('title');
            if (typeof alerts[imgSrc] !== 'undefined'){
                alerts[imgSrc].cnt = alerts[imgSrc].cnt + 1;
            }else{
                alerts[imgSrc] = {
                    cnt: 1,
                    src: imgSrc,
                    title: imgTitle
                }
            }
        }
        $('table > tbody > tr > td.alerts > img').each(function() {
            var img = $(this);
            addAlert(img);
        });
        $('table > tbody > tr > td.prod > img').each(function() {
            var img = $(this);
            addAlert(img);
        });
        var alertsExists = 0;
        $.each(alerts, function() {
            alertsExists = 1;
            var alertObj = this;
            var imgText = $('<i>',{
                title: alertObj.title,
                text: alertObj.cnt,
                click: function(){ showByImgSrc(alertObj.src);return false;},
            });
            var img = $('<img>',{
                title: alertObj.title,
                src: alertObj.src,
                width: 16
            });
            var input = imgText.append(img);
            $("#indicator_filter").append(input);
            $("#indicator_filter").append('&nbsp;');
        });

        if(alertsExists == 1){
            var showAllLink = $('<i>',{
                text: 'Сбросить фильтр',
                click: function(){ showAll();return false;}
            });
            $("#indicator_filter").append(showAllLink);
            //		$("#indicator_filter").show();
        }
        var findAlerts = $('<i>',{
            text: 'Считать фильтр',
            click: function(){ readAlerts();return false;}
        });
        $("#indicator_filter").append('&nbsp;').append(findAlerts);
        $("#indicator_filter").show();
    }
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}