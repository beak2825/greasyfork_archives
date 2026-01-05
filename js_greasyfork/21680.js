// ==UserScript==
// @name         AdRemover [RU]
// @version      0.43.20
// @description  Блокирует некоторую нескрываемую адблоком рекламу. Не дублирует функционал RU Adlist JS/CSS Fixes.
// @author       NeoCortex
// @license      GPLv3
// @include      *://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-start
// @namespace    https://greasyfork.org/users/12790
// @downloadURL https://update.greasyfork.org/scripts/21680/AdRemover%20%5BRU%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/21680/AdRemover%20%5BRU%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Нумерация версий: X.Y.Z. X - версия скрипта, Y - версия класса, Z - версия правил
    // Всякие полезные переменные.
    var logging = true;  // Отключает или включает сообщения в логе. Понадобится тем, кто хочет чистую консоль.
    var win = unsafeWindow || window;  // unsafeWindow
    var dhead = document.head;         // Для удобства
    var dbody = document.body;
    var ust = '^(https?:\/\/)?(www\.)?';  // Регулярка для отсеивания http/https и www
    
    // Бэкпортируем фичу из jQuery
    if (typeof HTMLElement.prototype.rmClass !== "function") HTMLElement.prototype.rmClass = function(remove) {
        this.className = this.className.replace(remove,'').trim().replace(/\s+/g,' ');
    };

    if (typeof HTMLElement.prototype.addClass !== "function") HTMLElement.prototype.addClass = function(add) {
        this.className = this.className + " " + add;
    };
    
    /* Служебный класс, помогает писать правила. Всякие функции, упрощающие работу с элементами.
       jQuery есть не везде, а стили так вообще проще вставлять средствами GM API. 
       arc - ad remover class, если непонятно. */
    var arc = {
    
    // Для логгирования
    pLoad: false,
    rulesApplied: 0,
    pLoadRulesApplied: 0,
        
    // Добавляет новый элемент. Синтаксис: F(parent - object, tag name, innerHTML, [['attr1','attr'], ['attr2','attr']])
    addNewEl: function(parent, tagname, innerhtmlvar, attrs) { 
        var NewObject = document.createElement(tagname);
        for(var i=0;i<attrs.length;i++) NewObject.setAttribute(attrs[i][0],attrs[i][1]);
        NewObject.innerHTML = innerhtmlvar;
        document.querySelector(parent).appendChild(NewObject);
    },
    
    // Добавляет стиль на страницу. Функция универсальна. Работает даже если GM API отсутствует.
    addStyle: function(cssText) {
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(cssText);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(cssText);
        } else if (typeof addStyle != "undefined") {
            addStyle(cssText);
        } else {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(cssText));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node); 
            } else {
                document.documentElement.appendChild(node);
            }
        }
    },
    
    /* Обёртки для предыдущей функции, но с пресетами.
       Правила такого рода встречаются чаще всего.  */
    hide: function(css) {this.addStyle(css+'{display:none!important}');},
    hideBg: function(css) {this.addStyle(css+'{background:none!important}');},
    
    /* Выполняет переданную функцию если URL соответствует одной или нескольким регуляркам. Часть регулярки - в начале.
       Создать правило для нескольких сайтов очень просто! Надо либо передать регулярку вида '(example\.com|domain\.ru).*',
       либо передать массив регулярок вот так: ['example\.com.*','domain\.ru.*']. Лучше использовать первый вариант когда
       возможно, т.к. второй вариант не страдает оптимизацией. Это будет поправлено позже.  */
    applyRule: function(regexpr, func){
        var rflag = false;
        if(Object.prototype.toString.call(regexpr) === '[object Array]')
          for(var i=0;i<regexpr.length;i++)  {
              if(rflag) break;
              if((new RegExp(ust+regexpr[i])).test(window.location.toString())) rflag = true; 
          }
        else rflag = (new RegExp(ust+regexpr)).test(window.location.toString());
        if(rflag) {
            this.cLog('Applying'+(this.pLoad ? ' post-load' : '')+' rule for '+(this.onTop() ? '[top]' : '[iframe]')+': '+win.location.toString());
            this.pLoad ? this.pLoadRulesApplied++ : this.rulesApplied++;
            func();
        }
    },
    
    // Обёртка для document.querySelector
    qSel: function(sel){return document.querySelector(sel);},
        
    // querySelector, но возвращает элемент если его содержимое соответствует регулярке (здесь она полная).
    qSelByHtml: function(sel,regexpr){
        var obj = this.qSel(sel);
        if(!obj) return null;
        if(regexpr.test(obj.innerHTML)) return obj;
        else return null;
    },
        
    // Выполняет метод для объекта по селектору. Например qSelProc('a', 'remove();') удалит самую первую ссылку в DOM
    // Внимание: в eval можно впихнуть ВСЁ ЧТО УГОДНО. Например '.remove(); document.body.remove();'.
    qSelProc: function(sel, proc) {
        var myObject = this.qSel(sel);
        if(myObject) eval('myObject.'+proc);
    },
    
    // Выполняет метод для объекта по селектору, но если содержимое соответствует регулярке. В остальном - аналог предыдущего.
    qSelProcByHtml: function(sel, proc, regexpr) {
        var myObject = this.qSel(sel);
        if(myObject) if(regexpr.test(myObject.innerHTML)) eval('myObject.'+proc);
    },
    
    // Обёртка для document.querySelectorAll
    qSelAll: function(sel){return document.querySelectorAll(sel);},
    
    // Аналог qSelByHtml, но для всех элементов по селектору.
    qSelAllByHtml: function(sel, regexpr) {
        var objarr = this.qSelAll(sel);
        var nobjarr = [];
        for(var i=0;i<objarr.length;i++) if(objarr[i]) if(regexpr.test(objarr[i].innerHTML))
            nobjarr.push(objarr[i]);
        return nobjarr;
    },
    
    // Аналогично qSelProc, но для всех элементов по селектору.
    qSelAllProc: function(sel, proc) {
        var objarr = this.qSelAll(sel);
        for(var i=0;i<objarr.length;i++) if(objarr[i]) eval('objarr['+i+'].'+proc);
    },
    
    // Аналог qSelProcByHtml, но для всех элементов по селектору.
    qSelAllProcByHtml: function(sel, proc, regexpr) {
        var objarr = this.qSelAll(sel);
        for(var i=0;i<objarr.length;i++) if(objarr[i]) if(regexpr.test(objarr[i].innerHTML))
            eval('objarr['+i+'].'+proc);
    },
    
    // Функция лога. Автоматом подставляет заголовок и стили к тексту. Вырубается если logging = false;
    cLog: function(message) {
        logging&&arc.onTop() ? console.log(
        '%c('+GM_info.script.name+' v'+GM_info.script.version+'):%c '+message,
        'background:#222;color:#0c0', 'background:#fff;color:#000'
        ) : console.log('('+GM_info.script.name+' v'+GM_info.script.version+'): '+message);},
        
    // Возвращает true если юзерскрипт выполняется не в iframe.
    onTop: function(){return (win.self === win.top);},
        
    // Редиректит страницу на about:blank (пустая страница).
    winkill: function(){arc.cLog('Intercepted '+(arc.onTop() ? '[top]' : '[iframe]')+': '+win.location.toString());
             win.location.assign('about:blank');},
        
    };  // Необходимо протестировать некоторые функции! 
    
    arc.cLog('Script started '+(arc.onTop() ? 'on top' : 'in iframe')+', location: '+win.location.toString());
    
    
    // Здесь начинаются правила для разных сайтов.
    arc.applyRule('muzofon\.pro.+', 
        function(){arc.hideBg('body');});
        
    arc.applyRule('2ip\.ru.*', 
        function(){window.qwerty = { on: function() { return { onNotDetected: function() {} }; } };});
        
    arc.applyRule('hdrezka\.me.*', function(){
        dbody.rmClass('active-brand');
        arc.hideBg('body > div.skin-block');
        var cText = '#main > div.b-container.b-wrapper > div > div.b-content__columns.pdt.clearfix > div.b-content__main > div:nth-child(6), ';
        cText += '#main > DIV.b-container.b-wrapper:nth-child(4) > DIV.b-post > DIV.b-content__columns.pdt.clearfix:last-child > DIV.b-content__main:first-child > DIV:nth-child(7), ';
        cText += 'a[href*="stabctbv.hdrezka.me"], ';
        cText += '#main > DIV.b-container.b-wrapper:nth-child(4) > DIV.b-post > DIV.b-content__columns.pdt.clearfix:last-child > DIV.b-content__main:first-child > DIV:nth-child(6), ';
        cText += '#main > DIV.b-container.b-wrapper:nth-child(4) > DIV.b-post > DIV.b-content__columns.pdt.clearfix:last-child > DIV:last-child > DIV:nth-child(2)';
        arc.hide(cText);
    });
    
    arc.applyRule('4pda\.ru.*', function(){
        if(win.location.toString().indexOf('/forum')>-1) { arc.cLog('This is forum, skip it.'); return; }
        var css = '.slider-news + section[id] > article[id][class="fix-post"] + aside[id] > div:nth-child(5), ';
        css += 'img[src^="http://s.4pda.to/"][height="90"][alt][title][border="0"], ';
        css += '.sidebar_border_content > a, .sidebar_border_content > iframe[src*="s.4pda.to"], div[id^="yandex_ad_R"], ';
        css += '.slider-news + section[id] > aside[id] > div[class][id][style]';
        arc.hide(css);
        arc.qSelProc('img[src^="http://s.4pda.to/"][height="90"][alt][title][border="0"]','closest(\'div\').remove();');
    });
    
    arc.applyRule('softportal\.com.*', 
        function(){arc.hide('.TblTopBanCLR, div.mfp-bg.mfp-ready, div.mfp-bg.mfp-ready + div');});
        
    arc.applyRule('kg-portal.ru.*',function(){arc.addStyle('div.des_front{height:170px!important}');});
    
    arc.applyRule('avito\.ru.*', 
        function(){arc.addStyle('.item_table.item-highlight .item-description-title-link{background-color:#fff!important;color:#434c94!important}');});
   
    arc.applyRule('(nnmclub.to|nnm-club.me).*', 
        function(){arc.hide('.branding, body > noindex > style + div');arc.hideBg('body');arc.addStyle('body{padding-top:0px!important}');});
        
    arc.applyRule('(new\.)?vk\.com.*', 
        function(){arc.hide('#ads_left,.ads_ads_news_wrap,*[data-ad-view],*[data-ad]');});
    
    arc.applyRule('pikabu\.ru.*', function(){arc.hide('.stories_perm > div:first-child');});
    
    arc.applyRule('(pb\.wtf|piratbit\.org).*', function(){
        win.ag = false;
        arc.hide('#main_content > div[id] > div[style="padding-right: 7px;"] > div[id], #in > div > a[href^="/exit"],\
        div[style="padding-right: 7px;"] > div[id], div[class][style="width: 24.1%;"] > a[href^="/exit/"],\
        td[style="background: #F9D2D9;padding-left: 10px;"], div[style="float: right;position: absolute;right: 6px;"],\
        .topic_wrap > table:first-child');
    });
    
    arc.applyRule('rustorka\.com', function(){
        var vid = setInterval( function(){
        if(typeof utg_target === 'object') {
            clearInterval(vid);
            utg_target = undefined;
            document.onmouseup = undefined;
        }}, 100);
        function add_amrfh() { return; };
        function are_cookies_enabled() { return; };
        var pidar = 1;
        arc.hide('#logo > table > tbody > tr > td + td > div + div, \
        #logo > table > tbody > tr > td:nth-child(2) > div:nth-child(4), \
        #page_content + div + script + center + style + div');
    });
    
    arc.applyRule('cyberforum\.ru.*', function(){
        arc.addStyle('div[style="min-width: 900px; margin: 320px auto 0px auto; max-width: 1200px; position: relative; z-index: 10;"] \
        {max-width:100%!important; margin: 0px auto!important}body, html {background: #fff!important}');
    });
    
    // Правила для фреймов
    arc.applyRule('googleads\.[a-z]\.doubleclick\.net\.*', arc.winkill);
    arc.applyRule('static[a-z]{2}\.facebook\.com\/connect\/.*', arc.winkill);
    
    function window_onload_handler() {arc.pLoad = true; arc.cLog('Post-load handler executed for '+(arc.onTop() ? '[top]' : '[iframe]')+': '+win.location.toString());
        
        // Правила после загрузки
        arc.applyRule('pikabu\.ru.*', function(){
            arc.qSelAllProc('.story__sponsor,.story__gag-nice,div[data-story-id="_"]', 'closest(\'.story\').remove();');
            $(document).ajaxComplete(function(){arc.qSelAllProc('.story__sponsor,.story__gag-nice,div[data-story-id="_"]', 'closest(\'.story\').remove();');});
        });
        arc.applyRule('4pda\.ru.*', function(){
            if(win.location.toString().indexOf('/forum')>-1) { arc.cLog('This is forum, skip it.'); return; }
            arc.qSelProc('img[src^="http://s.4pda.to/"][height="90"][alt][title][border="0"]','closest(\'div\').remove();');
            arc.qSelProc('.sidebar_border_content > a[href^="http://4pda.ru/"][target="_blank"]','closest(\'div:not(.sidebar_border_content)\').remove();');
            arc.qSelProc('.sidebar_border_content > iframe[src*="s.4pda.to"]','closest(\'div:not(.sidebar_border_content)\').remove();');
            arc.qSelAllProcByHtml('h2', 'parentElement.remove();', /AppPromo/);
        });
        arc.applyRule('(pb\.wtf|piratbit\.org).*', function(){
            arc.qSelAllProc('#in > div > a[href^="/exit"]', 'closest(\'div\').remove();');
            arc.qSelAllProc('img[src^="/t3zer"]', 'closest(\'div\').remove();');
            arc.qSelAllProcByHtml('.btn-group', 'remove();', /рубасиков/);
        });
        // Конец правил после загрузки                              
        
    arc.cLog('Basic rules applied: ' + arc.rulesApplied + ', post-load rules applied: ' + arc.pLoadRulesApplied + '.');
    arc.cLog('Script ended on '+(arc.onTop() ? '[top]' : '[iframe]')+': '+win.location.toString());
    }
    // Здесь правила заканчиваются. Совсем.
    
    
    win.addEventListener ("load", window_onload_handler);

})();