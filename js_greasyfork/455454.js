// ==UserScript==
// @name         Burunduk posting assister
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to post on fucking porasha!
// @author       sosach i ego podsos
// @license      MIT
// @match        https://2ch.hk/po/*
// @match        https://2ch.life/po/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455454/Burunduk%20posting%20assister.user.js
// @updateURL https://update.greasyfork.org/scripts/455454/Burunduk%20posting%20assister.meta.js
// ==/UserScript==


(function() {
    window.__Stage = null;
    Object.defineProperty(window, "Stage", {
        set: function (x) {
            window.__Stage = x;
        },
        get: function() {
            return function(name, id, type, cb) {
                if(id === 'postsumbit') return console.log(`Stage ${name} DISABLED`);
                window.__Stage(name, id, type, cb);
            }
        }
    });

    function init_burunduk_posting() {
        Stage('Обработка и отправка постов на сервер', 'burunduksumbit', Stage.DOMREADY, function(){
            if(!CFG.BOARD.NAME) return; //не запускаем на главной
            var request;
            var busy = false;
            var valid = false;
            var $qr = $('#qr');
            var $forms =  $('#postform,#qr-postform');
            var $submit_buttons = $('#qr-submit,#submit');
            let errCount = 0;
            //todo просмотреть, можно ли ускорить кешируя ссылки на $("qr-blabla") в переменную
            var sendForm = async function(form) {
                // копипаст макабы =========================================================================================================

                //@сафари
                if(FormFiles.vip) $('.filer__input').val('');
                formData = new FormData(form);

                busy = true;

                //эта пипка для подмены пикч, если из мультиселекта было что-то удалено
                if(FormFiles.vip) {
                    if (typeof formData.delete === "function") formData.delete('file[]');
                    for(var i=0, len=FormFiles.filtered.length; i<len; i++) {
                        formData.append('file[]', FormFiles.filtered[i]);
                    }
                }

                // конец копипаста макабы ==================================================================================================

                console.log('Posting like a burunduk');
                let referrer = String(window.location).replace('/po/', '/d/');
                let controller = new AbortController();
                request = {
                    abortController: controller,
                    abort: function() {
                        this.abortController.abort();
                    }
                }
                let response = await fetch("/user/posting?nc=1", {
                    "referrer": referrer,
                    "body": formData,
                    "method": "POST",
                    "mode": "cors",
                    "cache": "no-cache",
                    "signal": controller.signal
                });
                renderSending();
                if (response.ok) {
                    on_send_success(await response.json());
                } else {
                    on_send_error(response);
                }
            };
            window.sendForm = sendForm;

            var renderSending = function(){
                /*var inputs = forms.find('input,select,textarea').not('[type=submit]');
         inputs.attr('disabled','disabled');*/
                $submit_buttons.attr('value', 'Отправка...');
            };

            var renderSendingDone = function(){
                /*var inputs = forms.find('input,select,textarea').not('[type=submit]');
         inputs.removeAttr('disabled');*/
                $submit_buttons.attr('value', 'Отправить');
            };

            var progressHandling = function(e) {
                var percent = 100/e.total*e.loaded;
                if(percent >= 99) return $submit_buttons.attr('value', 'Обработка...');

                var bpercent = ( (Math.round(percent*100))/100 ).toString().split('.');
                if(!bpercent[1]) bpercent[1] = 0;
                bpercent = (bpercent[0].length==1?'0'+bpercent[0]:bpercent[0]) + '.' + (bpercent[1].length==1?bpercent[1]+'0':bpercent[1]);

                $('#qr-progress-bar').attr('value', e.loaded).attr('max', e.total);
                $submit_buttons.attr('value', bpercent + '%');
            };

            var on_send_error = function(request) {
                if(request.statusText == 'abort') {
                    $alert('Отправка сообщения отменена');
                }else{
                    $alert('Ошибка постинга: ' + request.statusText);
                }

                on_complete();
            };

            var on_send_success = function(data) {
                if(data.result == 1 ) {
                    if( data.num ) {
                        $alert('Сообщение успешно отправлено');
                        //console.log(data);
                        let curPosts;
                        var num;
                        //Favorites если тред && other.autowatchmyposts, то авто-подпись на пост
                        if(Store.get('other.autowatchmyposts', true) && CFG.BOARD.THREADID) {
                            if(!Favorites.isFavorited(CFG.BOARD.THREADID)) {
                                Favorites.add(CFG.BOARD.THREADID);
                            }
                            curPosts = Store.get('favorites.' + CFG.BOARD.THREADID + '.posts', false);
                            if(curPosts) {
                                Store.set('favorites.' + CFG.BOARD.THREADID + '.posts', curPosts.concat(data.num));
                            } else {
                                Store.set('favorites.' + CFG.BOARD.THREADID + '.posts', [data.num]);
                            }
                        }

                        //сохранить номер поста и тред, если включа настройка higlight_myposts
                        if(Store.get('other.higlight_myposts',true)) {
                            //не сработает если постилось в тред с нулевой при включенной опции "не перенаправлять в тред"
                            curPosts = Store.get('myposts.' + CFG.BOARD.NAME + '.' + CFG.BOARD.THREADID, []);
                            Store.set('myposts.' + CFG.BOARD.NAME + '.' + CFG.BOARD.THREADID, curPosts.concat(data.num));
                        }

                        if(Store.get('other.qr_close_on_send', true)) $('#qr').hide();

                        if(!CFG.BOARD.THREADID) { //костыль
                            const behavior = Store.get('other.on_reply_from_main', 1);
                            if(behavior == 1) {
                                window.location.href = '/' + CFG.BOARD.NAME + '/res/' + $('#qr-thread').val() + '.html#' + data.num;
                            }
                        }else{
                            const highlight_num = data.num;
                            PostF.updatePosts(function(data){
                                if(Favorites.isFavorited(CFG.BOARD.THREADID)) Favorites.setLastPost(data.data, CFG.BOARD.THREADID);
                                Post(highlight_num).highlight();
                            });
                        }
                        resetInputs();
                    } else {
                        console.log(data);
                        const num = data.thread;
                        $alert('Тред №' + num + ' успешно создан');

                        //костылик, при создании треда для автодобавления в избранное, если есть настройка autowatchmythreads
                        if(Store.get('other.autowatchmythreads', false)) Store.set('other.mythread_justcreated', true);

                        window.location.href = '/' + CFG.BOARD.NAME + '/res/' + num + '.html';
                    }

                } else {
                    //errror
                    // if(data.Id) {
                    //           $alert(data.Reason + '<br><a href="/ban?Id=' + data.Id + '" target="_blank">Подробнее</a>', 'wait');
                    //       }else{

                    if( data.error.code == -5 ) {
                        errCount++;
                        if (errCount >= 2) {
                            loadCaptcha2ch(true);
                            errCount = 0
                        }
                    }
                    $alert(`Ошибка! Код ${data.error.code}, ${data.error.message}`)
                }


                on_complete();
            };

            var on_complete = function() {
                busy = false;
                renderSendingDone();
            };

            var resetInputs = function() {
                $('#subject').val('');
                $('#shampoo, #qr-shampoo').val('');
                $('.postform__len').html(CFG.BOARD.MAXCOMMENT);
                if(window.FormFiles) window.FormFiles.reset();
                $('.oekaki-image').val(''); //очистка оекаки
                $('.oekaki-metadata').val(''); //очистка оекаки
                $('.oekaki-clear').prop('disabled', true);
                $('.postform__sticker-prev').html(''); // sticker
                $('.sticker-input').remove();
                loadCaptcha2ch(true);
            };

            var saveToStorage = function() {
                Store.set('thread.postform.name', $('#name').val());
                Store.set('thread.postform.email', $('#e-mail').val());
                var icon = $('.js-icon-select').val();
                if(icon) Store.set('thread.postform.icon.' + CFG.BOARD.NAME, icon);
            };

            var validator_error = window.postform_validator_error = function(id, msg) {
                var $el = $('#' + id);
                var $qr_el = $('#qr-' + id);

                if(msg) $alert(msg);

                $el.addClass('error');
                $qr_el.addClass('error');
                (activeForm.attr('id') == 'qr-shampoo') ? $qr_el.focus() : $el.focus();
            };

            var validateForm = function(is_qr) {
                var $c_id    = $('.captcha__key');
                var len = unescape(encodeURIComponent($('#shampoo').val())).length;
                var max_len = parseInt(CFG.BOARD.MAXCOMMENT);

                if($('input[name=thread]').val()=='0' && window.FormFiles && window.FormFiles.max && !window.FormFiles.count && !is_qr && !CFG.BOARD.OEKAKI) return $alert('Для создания треда загрузите картинку');
                if($('input[name=thread]').val()=='0' && $('input[name=subject]').val()=='' && CFG.BOARD.NAME == 'news') return $alert('Для создания треда заполните поле "Тема"');  //вкл. обязательное поле "тема" в news
                if($('input[name=thread]').val()=='0' && $('input[name=tags]').val()=='' && ( CFG.BOARD.NAME == 'vg' || CFG.BOARD.NAME == 'tv' )) return $alert('Для создания треда заполните поле "Теги"'); //вкл. обязательное поле "теги" в vg
                if(!len && window.FormFiles && window.FormFiles.max && !window.FormFiles.count && !FormFiles.oekaki && !FormFiles.sticker) return validator_error('shampoo', 'Вы ничего не ввели в сообщении'); //не проверять оекаки
                //if(!/[а-яё]/i.test($('#shampoo').val()) && CFG.BOARD.NAME == 'b') return $alert('Error occured');
                if(len > max_len) return validator_error('shampoo', 'Максимальная длина сообщения ' + max_len + ' <b>байт</b>, вы ввели ' + len);

                if(CFG.BOARD.NAME == 'news') {
                    if ( $('input[name=thread]').val()=='0' ) {
                        let s = $('input[name=subject]').val();
                        $('input[name=subject]').val(s.replace(/[^\x00-\u04FF]/g, ""));
                    }

                }

                return true;
            };

            var renderCaptchaResolve = function(){
                /*var inputs = forms.find('input,select,textarea').not('[type=submit]');
         inputs.attr('disabled','disabled');*/
                $submit_buttons.attr('value', 'Капча...');
            };

            $forms.on('submit', function(){
                if(typeof FormData == 'undefined') return; //старый браузер
                if(busy) {
                    request.abort();
                    return false;
                }
                //window.FormFiles.appendToForm(this);
                var form = $(this);

                saveToStorage();

                //if(validateForm(form.attr('id') == 'qr-postform')) sendForm(form[0]);
                try {
                    if(validateForm(form.attr('id') == 'qr-postform')) sendForm(form[0]);
                } catch(e) {
                    console.log(e)
                    $alert('Что-то пошло не так, перезагрузите страницу и попробуйте снова.')
                }

                return false;
            });

            $('#qr-cancel-upload').click(function(){
                request.abort();
            });
        });
    }

    var waitForStageInit = setInterval(function () {
    if (typeof window.__Stage != 'undefined') {

        init_burunduk_posting();

        clearInterval(waitForStageInit);
    }
}, 10);
})();