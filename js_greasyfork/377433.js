// ==UserScript==
// @name        KURAHEN DLA NIEWIDOMYCH
// @namespace   karachan.org
// @description kurahenowy czytacz
// @version     1.0
// @match       *://*.karachan.org/*
// @exclude     http://www.karachan.org/*/src/*
// @exclude     https://www.karachan.org/*/src/*
// @exclude     http://karachan.org/*/src/*
// @exclude     https://karachan.org/*/src/*
// @downloadURL https://update.greasyfork.org/scripts/377433/KURAHEN%20DLA%20NIEWIDOMYCH.user.js
// @updateURL https://update.greasyfork.org/scripts/377433/KURAHEN%20DLA%20NIEWIDOMYCH.meta.js
// ==/UserScript==

var rv_script = document.createElement('script');
rv_script.setAttribute('src', 'https://code.responsivevoice.org/responsivevoice.js');
document.head.appendChild(rv_script);
 
function rv_speak_line_info(line) {
    line = rv_line_pre_normalize(line);

    if (line.startsWith('<')) {
        var el = $(line);
 
        if (el.hasClass('quotelink')) {
            var postNo = el.text().replace('>>', '');
 
            if (postNo.indexOf('OP') > 1) {
                postNo = 'opa';
            }
 
            return ['do posta ' + postNo, {pitch: 1}];
        }
 
        if (el.hasClass('postlink')) {
            var link = el.text().split('://')[1].split('/')[0];
            return ['link do strony ' + link, {pitch: 1}];
        }
 
        if (el.hasClass('quote')) {
            var text = el.text().replace('>', '');
 
            return [text, {pitch: (Math.random() * 1.6) + 0.3}];
        }
 
        if (el[0].tagName == 'IMG') {
            if (el.attr('src') == 'https://i.imgur.com/ohFvRES.gif') {
                return ['kul', {pitch: 1}];
            }
            if (el.attr('src') == 'https://i.imgur.com/gB7t8a3.gif') {
                return ['cześć', {pitch: 1}];
            }
 
            return ['obrazek', {pitch: 1}];
        }
 
        if (el[0].tagName == 'S') {
            return [el.text(), {pitch: 1}];
        }
 
        if (el[0].tagName == 'U') {
            return [el.text(), {pitch: 0.5}];
        }
 
        if (el[0].tagName == 'B') {
            return [el.text(), {volume: 1.5}];
        }
 
        return [el.text()];
    }
    else {
        return [line, {pitch: 1}];
    }
}
 
function rv_text_normalize(text) {
    return text
        .replace('<img src="https://i.imgur.com/ohFvRES.gif" border="0">', 'kul')
        .replace('<img src="https://i.imgur.com/gB7t8a3.gif">', 'cześć')
        .replace(/<(?:.|\n)*?>/gm, '')
        .replace('&gt;', '')
        .toLowerCase()
        .replace(':3', 'dwukropek trzy')
        .replace(';_;', 'płaku płaku')
        .replace('inb4', 'inbifor');
}
 
function rv_line_pre_normalize(line) {
    return line
        .replace('<i style="font-size:50px" class="wycop wycop-bartoszewski">', 'bartoszewski fejs')
        .replace('<i style="font-size:50px" class="wycop wycop-karachan">', 'ka ra czan')
        .replace('<i style="font-size:50px" class="wycop wycop-papiez">', 'papież fejs');
}
 
function rv_rec_speak(lines, voice) {
    if (lines.length == 0) {
        return;
    }
 
    var line = lines[0];
    var lineInfo = rv_speak_line_info(line);
    var text = rv_text_normalize(lineInfo[0]);
    var settings = lineInfo[1];
 
    if (text.length == 0) {
        rv_rec_speak(lines.slice(1, lines.length));
    }
 
    var params = Object.assign({}, {
        onend: function() {
            rv_rec_speak(lines.slice(1, lines.length), voice);
        }
    }, settings);
 
    responsiveVoice.speak(text, voice, params);
}
 
function rv_prepare(content, voice) {
    var lines = content.split('<br>');
    var newLines = [];
 
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > 1) {
            newLines.push(lines[i]);
        }
    }
 
    rv_rec_speak(newLines.slice(0, newLines.length - 1), voice);
}
 
function rv_add_links() {
    $('.post').each(function() {
        var postInfo = $(this).find('.postInfo').first();
 
        if (postInfo.find('a[data-rv]').length == 0) {
            postInfo.append('<span> [Czytaj: <a href="#" data-rv="male">M</a>/<a href="#" data-rv="female">F</a>]</span>');
        }
    });
}
 
function rv_init() {
    $('body').on('click', 'a[data-rv]', function(e) {
        e.preventDefault();
        var rv_content = $(this).parents('.post').find('.postMessage').html();
        var rv_voice = ($(this).attr('data-rv') == 'male') ? 'Polish Male' : 'Polish Female';
       
        rv_prepare(rv_content, rv_voice);
    });
 
    rv_add_links();
 
    window.setInterval(rv_add_links, 5000);
}
 
$(document).ready(rv_init);

$(window).load(function() {
    responsiveVoice.CHARACTER_LIMIT = 6000;
});