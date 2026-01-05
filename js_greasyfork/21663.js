// ==UserScript==
// @name        Dimava's Public Beta
// @description Мой вариант реализации Публичной Беты
// @namespace   Dimava's Public Beta
// @include     https://ficbook.net/readfic/*/*
// @include     https://ficbook.net/home/myfics/*/parts/*
// @version     1.9.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21663/Dimava%27s%20Public%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/21663/Dimava%27s%20Public%20Beta.meta.js
// ==/UserScript==
function bug(e){console.info(e);}
span = null;
bugtext = '';
bugList = [];
failed = [];
window.bugs = function() {
    return bugList;
};
preparedPublicBetaData = null;
window.b = function() {
    return preparedPublicBetaData;
};
partId = location.pathname.split('/').pop();
initalText = $('.part_text').text();
initalHtml = $('.part_text').text();

keypressBugs=function(e) {
    if (partId != location.pathname.split('/').pop()) {
        loadBugs();
    }
    var s='';
    if (e.key == 'Enter') {
        if (span === null) {
            var r = rangy.getSelection();
            var t = r.anchorNode;
            if ($(t).closest('.part_text:not(.pboff)').length === 0) return;
            e.preventDefault();
            if (r.anchorNode != r.focusNode || r.anchorOffset == r.focusOffset) {
                toastr.warning('Выделенный текст содержит более одной textNode. Выделите меньше.');
                return;
            }
            var p1 = Math.min(r.anchorOffset, r.focusOffset);
            var p2 = Math.max(r.anchorOffset, r.focusOffset);
            var s0 = t.textContent;
            bugtext = s0.substring(p1, p2);
            if (initalText.indexOf(bugtext) != initalText.lastIndexOf(bugtext)) {
                toastr.warning('Выделенный текст повторяется. Выделите больше.');
                return;
            }
            if (bugtext.length > 255) {
                toastr.warning('Выделенный текст содержит более 255 символов. Выделите меньше.');
                return;
            }
            prepareSendBeta();
            s = s0.substring(0, p1) + '<pan class="newestbug"></pan>' + s0.substring(p2);
            var b = $('<b/>').html(s).contents().replaceAll(t);
            span = $('.newestbug');
            span.removeClass('newestbug').addClass('newbug').text(bugtext).attr('contenteditable', '');
        } else {
            e.preventDefault();
            span.removeClass('newbug').addClass('bug').removeAttr('contenteditable');
            if (span.text() == bugtext) {
                span.removeClass('bug');
                span = null;
                return;
            }
            bugList.push(bugtext);
            bugList.push(span.text());
            saveBugs();
            if ($('#pbsend').prop('checked'))
                sendBeta(bugtext, span.text());
            span = null;
        }
    }
    if (e.key == 'Escape') {
        span.removeClass('newbug').removeAttr('contenteditable');
        span = null;
    }
    if ((e.key == 'g' || e.key == 'п') && e.ctrlKey) {
        s = rangy.getSelection().text();
        if (s.length > 1) {
            e.preventDefault();
            window.open('https://encrypted.google.com/search?hl=ru&q=' + s);
        }
    }
};

if (!localStorage.DoNotPressDimavasPublicBeta) {
    $(document).keypress(keypressBugs);
}

function loadBugs() {
    bugList = JSON.parse(localStorage.getItem('Beta' + partId) || '[]');
    var c=String.fromCharCode(173);
    for(var i=0;i<bugList.length;i++){
        if(bugList[i].indexOf(c)>-1)
            if(!Cookies.get('text_justify3')||$('.part_text,textarea#content').is('textarea'))
            if(confirm('Список ошибок содержит \u00ad ("soft hyphen")\nЗаменить?')){
                for(i=0;i<bugList.length;i++){
                    bugList[i]=bugList[i].replace(/\xad/g,'');
                }
                saveBugs();
            }
    }
    if (bugList.length) //if (confirm('Найден список ошибок.\nИсправлений: ' + (bugList.length / 2) + '\nИспользовать?'))
        showBugs(bugList);
    printBugs();
}

function saveBugs() {
    localStorage.setItem('Beta' + partId, JSON.stringify(bugList));
    printBugs();
}
window.save = saveBugs;

function printBugs() {
    var log = $('#log');
    if (log.length === 0) {
        log=$('<small id="log"/>').click(function(e) {
            var s = rangy.getSelection();
            s.removeAllRanges();
            var r = rangy.createRange();
            var l = $('#log')[0];
            r.selectNode(l);
            s.addRange(r);
            document.execCommand('copy');
        }).insertAfter($('.part_text,textarea#content'));
        log.after('<br>');
        $('<small/>').html('<input type="checkbox" id="pbjsforcoms"><label for="pbjsforcoms">Скрипт для вставки в комментарии</label><br><br>').click(printBugs).insertBefore(log);
        if(!$('.part_text').length)
            log.prev().addBack().next().addBack().hide();
    }
    if (bugList.length === 0) {
        log.text('Скрипт замен пуст.');
        return;
    }
    var s = '',
        s1 = '',
        s2 = '',
        l = location.pathname.split('/'),
        l2 = l.pop(),
        l1 = l.pop();
    for (var i = 0; i < bugList.length; i += 2) {
        s1 = JSON.stringify(bugList[i].replace(/\xad/g,''));
        s2 = JSON.stringify(bugList[i + 1].replace(/\xad/g,''));
        s += s1 + (s1.length + s2.length < 80 ? ',' : ',\n') + s2 + (i + 2 < bugList.length ? ',\n' : '');
    }
    s = 'id="' + partId + '";function replaceBugs(ar){if(id!=location.pathname.split(\'/\').pop())return;\ne=$(\'.part_text,textarea#content\');b=e.is(\'textarea\');h=b?e.val():e.html();\n' +
        'for(i=0;i<ar.length;i+=2){h=h.replace(ar[i],(b?\'\':\'<span style="background-color:yellow;">\')+ar[i+1]+(b?\'\':\'</span>\'));}\n' +
        'if(b)e.val(h);else e.html(h);}ar=[\n' + s + '\n];if(window.addBugs)window.addBugs(ar,id);else replaceBugs(ar);' +
        '\n//работает в https://ficbook.net/home/myfics/' + l1 + '/parts/' + l2 + '\n//в консоли:  [F12],  {вкладка "консоль"},  {вставьте этот скрипт}:[ctrl]+[v],  {Нажмите "ввод"}:[Enter]';
    if ($('#pbjsforcoms').prop('checked')) s = '>' + s.replace(/\n/g, '\n>');
    log.text(s);
    log.html(log.html().replace(/\n/g, '<br>'));
}

function showBugs(ar) {
    var e = $('.part_text,textarea#content'),
        b = e.is('textarea'),
        h = b ? e.val() : e.html(),
        dup = 0,
        nop = 0,
        gut = 0;
    for (i = 0; i < ar.length; i += 2) {
        var bug = ar[i],
            rep = ar[i + 1],
            p1 = h.indexOf(bug),
            p2 = h.lastIndexOf(bug),
            i1 = initalText.indexOf(bug),
            i2 = initalText.lastIndexOf(bug);
        if (p1 == -1 || !b && i1 == -1) {
            nop++;
            failed.push(i);
        } else if (p1 != p2 || !b && i1 != i2) {
            dup++;
            failed.push(i);
        } else {
            gut++;
            h = h.replace(bug, (b ? '' : '<pan style="background-color:yellow;">') + rep + (b ? '' : '</pan>'));
        }
    }
    if (b) {
        e.val(h);
        $('#save_part').prop('disabled', !1);
    } else e.html(h);

    toastr.success('Удачно: ' + gut + '/' + (ar.length / 2));
    if (dup) toastr.warning('Повторяются: ' + dup);
    if (nop) toastr.error('Не найдено: ' + nop);

    if (dup + nop) {
        alert('Удачно: ' + gut + '/' + (ar.length / 2) + (dup ? '\nПовторяются: ' + dup : '') + (nop ? '\n Не найдено: ' + nop : ''));
        if (confirm('Удалить все неудачные замены?\n(рекомендуется)')) {
            toastr.info('Удалено исправлений: ' + failed.length);
            while (failed.length) {
                bugList.splice(failed.pop(), 2);
            }
            saveBugs();
        } else {
            var i=0,j=0;
            if (nop)
                if (confirm('Удалить ненайденные?')) {
                    j = 0;
                    for (i = 0; i < ar.length; i += 2)
                        if (initalText.indexOf(ar[i]) == -1) {
                            ar.splice(i, 2);
                            i -= 2;
                            j++;
                        }
                    toastr.info('Удалено исправлений: ' + j);
                    saveBugs();
                }
            if (dup)
                if (confirm('Удалить повторяющиеся в тексте?\n(они не работают)')) {
                    for (i = 0; i < ar.length; i += 2)
                        if (initalText.indexOf(ar[i]) != initalText.lastIndexOf(ar[i])) {
                            ar.splice(i, 2);
                            i -= 2;
                            j++;
                        }
                    toastr.info('Удалено исправлений: ' + j);
                    saveBugs();
                }
        }
    }
    if(b)
        alert('Изменения применены. Сохраните их.\nПри следующем посещении данной главы эти ошибки не будут найдены. Удалите их.');
}

function prepareSendBeta() {
    //////////////////// idk wtf it is
    function getData(e) {
        var t = jQuery('.public_beta,.part_text').get(0),
            n = rangy.createRange(),
            i = e.toHtml().replace(/(\xAD)/g, ''),
            o = void 0;
        n.selectNode(t);
        var r = e.cloneRange(),
            s = rangy.createClassApplier('grammar_error');
        return s.applyToRange(r),
            e.moveStart('character', -30), -1 === e.compareBoundaryPoints(e.START_TO_START, n) && e.setStart(t, 0),
            e.moveEnd('character', 30),
            1 === e.compareBoundaryPoints(e.END_TO_END, n) && e.setEnd(t, t.childNodes.length),
            o = e.toHtml(),
            o = '...' + o + '...',
            o = o.replace(/(\xAD)/g, ''),
            s.undoToRange(r),
            //new PublicBetaData(i, o)
            {
            selection: i,
            context: o
        };
    } //////////////////////////////////// idk wtf it is

    function openPublicBetaDialog(e) {
        preparedPublicBetaData = e;
    } ////////////////////// idk wtf it is

    function showDialog() {
        var e = rangy.getSelection();
        var t = e.getRangeAt(0),
            n = t.text();
        return n.length > 255 ? (toastr.error('>255'), !1) : 0 === n.length ? (toastr.error('=0'), !1) : void openPublicBetaDialog(getData(t));
    } ////////////////////////////// idk wtf it is

    showDialog();
}

function sendBeta(typo, comm) {
    if (!$('#pbsend').prop('checked')) return;
    var s = {
        selected_text: preparedPublicBetaData.selection.replace(/<\/?pan[^>]*>/g, ''),
        context: preparedPublicBetaData.context.replace(/<\/?pan[^>]*>/g, ''),
        comment: comm,
        part_id: location.pathname.split('/').pop()
    };
    toastr.success(s.comment);
    toastr.warning(s.context);
    //toastr.error(s.selected_text);
    console.log(s);
    window.s=s;
    $.post('https://ficbook.net/ajax/public_beta', s).done(function(o) {
        if (o) {
            console.log('Beta ansver: ', o);
            if (o.result) {
                toastr.success('Отправлено');
            } else {
                console.error('Ошибка отправки', o);
                toastr.error('Ошибка отправки<br>' + o.error);
            }
        }
    }).fail(function(o) {
        console.error('Сообщение не отправилось или не дошло');
        toastr.error('Сообщение не отправилось или не дошло');
    });
}

function parseBugs() {
    var s = prompt('Вставьте скрипт исправления');
    if (!s) return;
    var ars = s.match(/\[\s*("([^"]|\\")*",?\s*)+\s*\]/);
    if (ars === null) {
        toastr.warning('Скрипт не содержит массива замен.');
        return;
    }
    ar = JSON.parse(ars[0]);
    var ids = s.match(/id="(([^"]|\\")*)";/);
    var id;
    if (ids !== null) id = ids[1];
    else id = prompt('Скрипт не содержит id части.\nВведите номер части', partId);
    if (id === null) return;
    addBugs(ar, id);
}
window.parseBugs = parseBugs;

function addBugs(ar, id) {
    $('.part_text').addClass('pboff');
    var a = JSON.parse(localStorage.getItem('Beta' + partId) || '[]');
    for (i = 0; i < ar.length; i++) {
        a.push(ar[i]);
    }
    localStorage.setItem('Beta' + partId, JSON.stringify(a));
    $('#log').text('Бета выключилась, обновите страницу, чтобы включить.');
    toastr.warning('Добавлено ' + (ar.length / 2) + ' исправлений к главе №' + id + '<br>Бета выключилась, <br>обновите страницу, чтобы включить.');
}
function clearPageBugs(){
    localStorage.removeItem('Beta' + partId, JSON.stringify(bugList));
    alert('Все ошибки с этой страницы удалены.');
    location.reload();
}
window.addBugs = addBugs;
if (!localStorage.DoNotInitDimavasPublicBeta) {
    $('<style/>').html('pan{display:inline;} .newbug {  background-color: orange;}.bug {  background-color: yellow;}').appendTo(document.head);
    $('<button/>').html('Вставить скрипт исправления')
        .click(parseBugs).insertBefore($('.part_text,textarea#content'));
    $('<button/>').html('Вставить скрипт исправления')
        .click(parseBugs).insertAfter($('.part_text,textarea#content'));
    $('<button/>').html('Удалить все ощибки с этой страницы')
        .click(clearPageBugs).insertBefore($('.part_text,textarea#content'));
    $('<button/>').html('Удалить все ощибки с этой страницы')
        .click(clearPageBugs).insertAfter($('.part_text,textarea#content'));
    $('<div/>').html('<input type="checkbox" id="pbsend" ' + (+localStorage.pbsend ? 'checked' : '') +
                     '><label for="pbsend">Посылать исправление в ПБ</label><br>').contents().click(function() {
        setTimeout(function() {
            localStorage.pbsend = $('#pbsend').prop('checked') * 1;
            if (+localStorage.pbsend)
                toastr.warning('Исправления отправляются');
            else
                toastr.info('Исправления НЕ отправляются');
        }, 100);
    }).insertAfter($('#partStart'));
}
version = 1.9;
window.DimavasPublicBeta = this;
if (!localStorage.DoNotStartDimavasPublicBeta)
    loadBugs();
