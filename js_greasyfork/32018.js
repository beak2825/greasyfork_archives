// ==UserScript==
// @name         WykopowyPrzypominacz
// @version      1.3
// @description  Ustaw przypomnienie do danego znaleziska/wpisu, aby otrzymać o nim powiadomienie po ustalonym czasie. Pełni także formę listy "Do obejrzenia".
// @author       Rst
// @match        https://www.wykop.pl/*
// @namespace https://greasyfork.org/users/13380
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
/*jshint multistr: true */
// @downloadURL https://update.greasyfork.org/scripts/32018/WykopowyPrzypominacz.user.js
// @updateURL https://update.greasyfork.org/scripts/32018/WykopowyPrzypominacz.meta.js
// ==/UserScript==

$(function(){

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    var lsItem = 'wykop_r_reminder',
        url = '',
        isLogged = (wykop.params.logged) ? true : false,
        isNightTheme = ($('body').hasClass('night')) ? true : false;

    var Reminder = {

        init: function() {
            this.setStyles();
            this.addReminderButtons();
            this.addReminderListButton();
            this.handleReminderButton();
            this.handleReminderListButton();
            this.checkReminders();
            this.handleTabSwitch();
        },
        setStyles: function() {
            addGlobalStyle('.r-reminder label {display: inline-block; margin-right: 20px;}');
            addGlobalStyle('.r-reminder input {margin-right: 5px;}');
            addGlobalStyle('#zgloszenie.r-reminder .view {max-height: none;}');
            addGlobalStyle('.r-reminder__time {background: #fff;width: 110px;height: 30px;font-size: 15px;border: 2px solid #c1c1c1;padding: 0 10px;color: #000;}');
            addGlobalStyle('.night .r-reminder__time {background: #2c2c2c;border: 2px solid #777777;color: #fff;}');
            addGlobalStyle('.r-reminder input:focus {outline: none;}');
            addGlobalStyle('.r-reminder h4 { margin: 20px 0 10px 0; padding-bottom: 5px; }');
            addGlobalStyle('.r-reminder h4:first-child {margin-top: 0}');
            addGlobalStyle('.r-reminder__save-container { margin-top: 20px }');
            addGlobalStyle('.r-reminder__save-container button { margin-right: 10px }');
            addGlobalStyle('.r-reminder__list .r-reminder__delete { float: right; margin-top: -5px; }');
            addGlobalStyle('.r-reminder__data { float: right; margin-right: 10px; }');
            addGlobalStyle('.r-reminder__list ul.reason-list li a { max-width: 400px;max-height: 15px;display: inline-block;overflow: hidden; }');
            addGlobalStyle('.r-reminder__list ul.reason-list li { background: #f1f4f5; }');
            addGlobalStyle('.night .r-reminder__list ul.reason-list li { background: #3c3c3c; }');
        },
        openReminderWindow: function(data, type){
            var $this = this;
            data = data || '';

            $this.closeReminder();

            $('body').prepend($this.reminderHtml(data));

            setTimeout(function(){
                switch(type) {
                    case 'set':
                        $this.handleReminderSaveButton();
                        $this.afterOpenReminder();
                        break;
                    case 'get':
                        $this.handleReminderLaterButton();
                        $this.handleReminderOkButton();
                        $this.handleReminderOkRedirectButton();
                        break;
                    case 'list':
                        $this.fillReminderList();
                        break;
                }

                $('.r-reminder .close').on('click', function(e){
                    e.preventDefault();
                    $this.closeReminder();
                });
            }, 50);
        },
        closeReminder: function(){
            $('.r-reminder').remove();
            $('.overlay').remove();
        },
        handleReminderLaterButton: function(){
            var $this = this;
            $('.r-reminder__later').on('click', function(){
                var data = $this.getCurrentReminder();
                $this.markReminderAsRead(data);

                var newDate = data.date + 3600,
                    item = {link : data.link, date : newDate };


                if($this.setReminderItem(item)) {
                    $this.closeReminder();
                } else {
                    alert('Wystąpił błąd!');
                }
            });
        },
        handleReminderOkButton: function(){
            var $this = this;
            $('.r-reminder__ok').on('click', function(){
                var data = $this.getCurrentReminder();
                $this.markReminderAsRead(data);
                $this.closeReminder();
            });
        },
        handleReminderOkRedirectButton: function(){
            var $this = this;
            $('.r-reminder__ok-redirect').on('click', function(){
                var data = $this.getCurrentReminder();
                $this.markReminderAsRead(data);
                $this.closeReminder();
                window.location.href = data.link;
            });
        },
        markReminderAsRead: function(item){
            var data = this.getLocalStorageItem();

            for(i = 0; i < data.length; i++){
                if(data[i].link == item.link && data[i].date == item.date) {
                    data.splice(i, 1);

                    localStorage.setItem(lsItem, JSON.stringify(data));
                }
            }
        },
        getCurrentReminder: function(){
            var link = $('.r-reminder__link'),
                date = link.attr('data-date'),
                href = link.attr('href'),
                data = {};

            data.link = href;
            data.date = parseInt(date);

            return data;
        },
        afterOpenReminder: function() {
            this.setDefaultDateAndTime();
            this.toggleCustomDate();
            this.toggleNoDate();
        },
        setDefaultDateAndTime: function(){
            var hour = moment().hour(),
                hour = (hour < 10 ? '0' + hour : hour),
                minutes = moment().minutes(),
                minutes = (minutes < 10 ? '0' + minutes : minutes);
            $(".r-reminder__time")[0].defaultValue = hour + ':' + minutes;
        },
        toggleCustomDate: function() {
            var customDate = $('.r-reminder__custom-date');
            $('input[type=radio]').change(function() {
                if (this.value == '4') {
                    customDate.css({'display' : 'block'});
                } else {
                    customDate.css({'display' : 'none'});
                }
            });
        },
        toggleNoDate: function() {
            var time = $('.r-reminder__time-wrapper'),
                customDate = $('.r-reminder__custom-date');
            $('input[type=radio]').change(function() {
                if (this.value == '5') {
                    time.css({'display' : 'none'});
                    customDate.css({'display' : 'none'});
                } else {
                    time.css({'display' : 'block'});
                }
            });
        },
        addReminderButtons: function() {
            $('.responsive-menu').each(function(){
                $(this).append('<li><a href="#" class="affect hide r-reminder__set" style=""><i class="fa fa-plus"></i> ustaw przypomnienie</a></li>');
            });
            $('.article:not(.fullview)').each(function(){
                $(this).find('.elements a:first-child').after('<a class="affect r-reminder__set" href="#"><i class="fa fa-plus"></i> ustaw przypomnienie</a>');
            });
        },
        handleReminderButton: function() {
            var $this = this;

            $('.r-reminder__set').on('click', function(e){
                e.preventDefault();

                if($(this).parents('.article').length) {
                    var article = $(this).parents('.article');

                    if($(article).hasClass('fullview')){
                        url = window.location.href;
                    } else {
                        url = $(this).parents('.article').find('h2 a').attr('href');
                    }
                } else {
                    url = $(this).parents('.wblock').find('.author a:nth-child(2)').attr('href');
                }

                var template = $this.reminderSaveHtml();

                $this.openReminderWindow(template, 'set');
            });
        },
        addReminderListButton: function() {
            if(isLogged) {
                $('#nav .logged-user ul li:last-child').before('<li><a href="#" class="r-reminder__list-button"><i class="fa fa-list"></i> <span>przypomnienia</span></a></li>');
            } else {
                $('#openNaturalSearch').parent().before('<li><a href="#" class="r-reminder__list-button"><span>Przypomnienia</span></a></li>');
            }
        },
        handleReminderListButton: function() {
            var $this = this;

            $('.r-reminder__list-button').on('click', function(e){
                e.preventDefault();

                var template = $this.reminderListHtml();

                $this.openReminderWindow(template, 'list');
            });
        },
        fillReminderList: function(){
            var $this = this,
                list = $('.r-reminder__list .reason-list'),
                data = $this.getLocalStorageItem() || [];

            $(list).html('');

            if(data.length) {
                for(var i = 0; i < data.length; i++){
                    $(list).append($this.reminderListItemTemplate(data[i]));
                }
            } else {
                $(list).append('<p>Brak przypomnień</p>');
            }

            $this.handleDeleteButton();
        },
        handleDeleteButton: function(){
            var $this = this;

            $('.r-reminder__delete').off().on('click', function(e){
                var item = {},
                    parent = $(this).parent(),
                    link = parent.attr('data-link'),
                    date = parent.attr('data-date');

                item.link = link;
                item.date = date;

                $this.removeReminder(item);
                $this.fillReminderList();
            });
        },
        reminderListItemTemplate: function(item) {
            var link = item.link,
                shortLink = link.replace('https://www.wykop.pl', ''),
                date = item.date,
                isNoDate = this.isNoDate(date),
                htmlDate = (!isNoDate) ? '<span class="r-reminder__data">Data: ' + moment(date, 'X').format("DD.MM.YYYY HH:mm") + '</span>' : '';

            return '\
                <li>\
                     <div data-link="' + link + '" data-date="' + date + '">\
                          <button class="submit r-reminder__delete">Usuń</button>\
                          <p><a href="' + link + '">' + shortLink + '</a> ' + htmlDate + '</p>\
                     </div>\
                </li>\
';
        },
        returnDate: function() {
            var option = $('.r-reminder input[type="radio"]:checked').val(),
                date;

            switch(option) {
                case '1':
                    date = moment().format("YYYY-MM-DD");
                    break;
                case '2':
                    date = moment().add(1,'days').format("YYYY-MM-DD");
                    break;
                case '3':
                    date = moment().add(7,'days').format("YYYY-MM-DD");
                    break;
                case '4':
                    var customDate = $('.r-reminder__custom-date').val();
                    if(customDate) {
                        date = customDate;
                    } else {
                        date = moment().format("YYYY-MM-DD");
                    }
                    break;
                case '5':
                    date = moment().add(1000,'years').format("YYYY-MM-DD");
                    break;
            }

            return date;
        },
        isNoDate: function(date) {
            var dateLength = date.toString().length;

            if(dateLength >= 11) {
                return true;
            }
            return false;
        },
        returnTime: function() {
            var val = $('.r-reminder__time').val(),
                time;

            if(val) {
                time = val;
            } else {
                var hour = moment().hour(),
                hour = (hour < 10 ? '0' + hour : hour),
                minutes = moment().minutes(),
                minutes = (minutes < 10 ? '0' + minutes : minutes);

                time = hour + ':' + minutes;
            }

            return time;
        },
        handleReminderSaveButton: function() {
            var $this = this;

            $('.r-reminder__save').on('click', function(){
                var item = {
                    link: url,
                    date: parseInt($this.getReminderTimestamp())
                };

                if($this.setReminderItem(item)) {
                    alert('Przypomnienie zapisane poprawnie!');
                    $this.closeReminder();
                } else {
                    alert('Wystąpił błąd! Spróbuj ponownie!');
                }
            });
        },
        setReminderItem: function(item){
            var prev = this.getLocalStorageItem(),
                data = [];

            if(!isEmpty(prev)) {
                data = data.concat(prev);
            }
            data.push(item);

            localStorage.setItem(lsItem, JSON.stringify(data));

            return true;
        },
        getReminderTimestamp: function() {
            var date = this.returnDate(),
                time = this.returnTime(),
                timestamp = moment(date + ' ' + time).format('X');

            return timestamp;
        },
        getCurrentTimestamp: function() {
            return Math.floor(new Date().getTime() / 1000);
        },
        getLocalStorageItem: function() {
            var data = localStorage.getItem(lsItem);

            return JSON.parse(data);
        },
        checkReminders: function(){
            var $this = this,
                data = $this.getLocalStorageItem(),
                currentTimestamp = $this.getCurrentTimestamp();

            $this.closeReminder();

            if(data) {
                $.each(data, function(index, value){
                    if(value.date < currentTimestamp) {
                        $this.showReminder(value);
                        return false;
                    }
                });
            }
        },
        showReminder: function(data) {
            var template = this.reminderGetHtml(data);

            this.openReminderWindow(template, 'get');

        },
        removeReminder: function(item) {
            var data = this.getLocalStorageItem();

            for(var i = 0; i < data.length; i++) {
                if(data[i].link == item.link && data[i].date == item.date) {
                    data.splice(i, 1);
                    break;
                }
            }

            localStorage.setItem(lsItem, JSON.stringify(data));
        },
        handleTabSwitch: function(){
            var $this = this;
            document.addEventListener('visibilitychange', function(){
                $this.checkReminders();
            });
        },
        reminderListHtml: function(){
            return '<h4>Lista przypomnień:</h4>\
<div class="r-reminder__list"><ul class="reason-list"></ul></div>\
';
        },
        reminderSaveHtml: function(){
            return '<div class="r-reminder__options">\
<h4>Data:</h4>\
\
<label for="today">\
<input type="radio" name="date" id="today" value="1" checked>\
Dziś\
</label>\
<label for="tommorow">\
<input type="radio" name="date" id="tommorow" value="2">\
Jutro\
</label>\
<label for="nextweek">\
<input type="radio" name="date" id="nextweek" value="3">\
Za tydzień\
</label>\
<label for="customdate">\
<input type="radio" name="date" id="customdate" value="4" class="r-reminder__custom-date-input" >\
Ustaw datę\
</label>\
<label for="nodate">\
<input type="radio" name="date" id="nodate" value="5">\
Bez daty\
</label>\
<input type="date" id="date" class="r-reminder__custom-date" style="display: none;margin-top: 10px;">\
\
<div class="r-reminder__time-wrapper">\
<span></span>\
<h4>Godzina:</h4>\
\
<input type="time" name="time" class="r-reminder__time">\
</div>\
</div>\
<div class="r-reminder__save-container">\
<button class="submit r-reminder__save"><i class="fa fa-spinner fa-spin" style="display: none"></i> Ustaw przypomnienie</button>\
</div>\
</div>\
';
        },
        reminderGetHtml: function(data){
            return '<h4>Wpis:</h4>\
<a href="' + data.link + '" data-date="' + data.date + '" class="r-reminder__link">' + data.link + '</a>\
<div class="r-reminder__save-container">\
<button class="submit r-reminder__later">Przypomnij za godzinę</button>\
<button class="submit r-reminder__ok">Oznacz jako przeczytane</button>\
<button class="submit r-reminder__ok-redirect">Oznacz jako przeczytane i przekieruj</button>\
</div>\
';
        },
        reminderHtml: function(data) {
            return '<div class="overlay" style="display: block;"></div>\
<div id="zgloszenie" class="normal m-set-fullwidth m-reset-top m-reset-margin m-reset-left r-reminder">\
<div class="header">\
<a href="#" title="zamknij" class="fright close" style="top: 0;"><span class="icon inlblk mini closepreview"><i class="fa fa-times"></i></span></a>\
<span class="title">Przypominacz</span>\
</div>\
\
<div class="view">\
' + data + '\
</div>\
\
';
        },
    };

    Reminder.init();

});