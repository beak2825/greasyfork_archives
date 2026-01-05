// ==UserScript==
// @name         Yap helper
// @namespace    https://greasyfork.org/ru/scripts/12910-yap-helper
// @version      1.0.3
// @author       JusteG
// @description  Очищает ЯП от рекламы и улучшает внешний вид
// @match        http://www.yaplakal.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/locale/ru.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12910/Yap%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/12910/Yap%20helper.meta.js
// ==/UserScript==

moment.locale('ru');

var gotoElem = function(elem){
    $('html, body').animate({
        scrollTop: $(elem).offset().top
    }, 200)
}

key('right', function(){ $('.row3').last().find('b').next().get(0).click() });
key('left', function(){ $('.row3').last().find('b').prev().get(0).click() });
key('down', function(){
    var elems = $('table[id^=p_row]');
    var success = false;
    
    for(var i = 0; i < elems.length; i++){
        if ($(elems[i]).offset().top - $(window).scrollTop() > 10){
            gotoElem(elems[i]);
            success = true;
            break;
        }
    }
    
    if (!success)
        $('.row3').last().find('b').next().get(0).click()
});
key('up', function(){
    var elems = $('table[id^=p_row]');
    var success = false;
    
    for(var i = elems.length - 1; i >= 0; i--){
        if ($(window).scrollTop() - $(elems[i]).offset().top > 10){
            gotoElem(elems[i]);
            success = true;
            break;
        }
    }
    
    if (!success)
        $('.row3').last().find('b').prev().get(0).click()
});

String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var topic = function(header, body, footer){
    this.domHeader = header;
    this.domBody = body;
    this.domFooter = footer;
    this.domRaiting = this.domHeader.find(".rating-short-value");
    this.domAutor= this.domFooter.find(".icon-user");
    this.domDate= this.domFooter.find(".icon-date");

    this.header = this.domHeader.find(".subtitle").html();
    this.raiting = this.domRaiting.length == 0 ? undefined : parseInt(this.domRaiting.find("a").html());
    this.autor = this.domAutor.find("a").html();
    this.date = moment(this.domDate.html(), "D.MM.YYYY - HH:mm");
}

topic.prototype.DOM = function(){
    return this.domHeader.add(this.domBody).add(this.domFooter);
}

var headers = $(".newshead").closest("tr"), topics;
var topics = _.map(headers, function(item){
    var topicParts = $(item).nextAll(':lt(2)');
    return new topic($(item), topicParts.eq(0), topicParts.eq(1));
});

var sortBy = function(field){
    var sorted = _.sortBy(topics, function(topic){
        return topic[field];
    }).reverse();
    var tbody = sorted[0].domHeader.closest("tbody");

    tbody.empty();
    sorted.forEach(function(topic){
        tbody.append(topic.DOM());
    });
};

var collectGarbage = function(){
    var tbody = topics[0].domHeader.closest("tbody");
    tbody.empty();
    topics.forEach(function(topic){
        tbody.append(topic.DOM());
    });
};

var blockRules = {
        header: [ /москв/i, /росси/i, /украин/i ]
    };

topics.forEach(function(topic){
    if (topic.raiting === undefined){
        topic.DOM().remove();
        console.warn("Топик {0} [{1}, {2}] удален, причина - отсутствует рейтинг, спам!".f(topic.header, topic.autor, topic.date.format('LLL')));
        return;
    }

    for (rule in blockRules){
        blockRules[rule].forEach(function(regex){
            try{
                if (regex.test(topic[rule])){
                    topic.DOM().remove();
                    console.warn("Топик {0} [{1}, {2}] удален, причина - фильтрация по параметру \"{3}\"!".f(topic.header, topic.autor, topic.date.format('LLL'), rule));
                    return;
                }
            }catch(e){console.err(e)}
        })
    }

    topic.domHeader.hover(function(){
        //console.log("(" + topic.date.format('LLL') + ") - " + topic.autor + " [" + topic.raiting + "]")
    });

    //topic.domBody.hide();
    //topic.domFooter.hide();
});