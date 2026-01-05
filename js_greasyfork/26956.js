// ==UserScript==
// @name Dark Voice 
// @namespace golos.io 
// @description Темный скин golos.io с монитором активности пользователей из blockchain
// @description:ru Темный скин golos.io с монитором активности пользователей из blockchain
// @grant none
// @version 0.23
// @include https://golos.io/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26956/Dark%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/26956/Dark%20Voice.meta.js
// ==/UserScript==
// 
var myname = 'vik'; // Поменяйте на свое имя и переместите сокеты выше - будет работать быстрей :)
var socket = new WebSocket('wss://ws.golos.io'),
    account = myname;
startblock = 0;
socket.onopen = function(event) {
    socket.send(JSON.stringify({
        id: 1,
        method: 'get_dynamic_global_properties',
        'params': []
    }));
};
socket.onmessage = function(event) {
    data = JSON.parse(event.data);
    startblock = data.result.last_irreversible_block_num;
};


// Прописываем CSS и HTML
$('.Header__top-steemit').html('<a href="/@vik/">Dark Voice<span class="beta">@vik</span></a>');
var inlinecss = "<style>.Voting__button path,.Voting__button-down a:hover path{fill:#fff}#opclose,.svote a{vertical-align:middle}.Header,body{background-color:#36465d;color:#fff}.VerticalMenu>li>a,.menu a{color:#fff}.VerticalMenu>li>a:hover{color:#101823;line-height:1.5rem}.Header__sub-nav .active a,.Header__sub-nav li:hover a,.PostSummary__header>h2>a,.PostsIndex__topics,.PostsIndex__topics small a,.Topics__title{color:#fff}.Header__sub-nav li>a{color:#fff;border:0;line-height:1.2em;font-size:.9em;background-color:#101823}.Header__sub-nav li{padding:.5rem 0;position:relative;overflow:hidden}.menu .buttons{display:none}.Header__sub-nav li>a:after{content:'';width:0;height:2px;background:#fff;z-index:1;position:absolute;bottom:0;left:0;transition:.6s all ease}.Header__sub-nav li:hover>a:after{content:'';width:100%}.Header .menu,.Header__sub-nav,.Header__top{background-color:#101823;border-bottom:1px solid #0b1119}#content{background:#36465d}.PostsIndex__topics{border-radius:3px;padding:5px;transition:.4s all ease;height:35px;overflow:hidden;position:fixed;top:55px;border:0;right:-160px;background:#184e86;box-shadow:0 0 35px -10px #000;z-index:700}ul.Topics li a{background:#fff;padding:0 3px;border-radius:3px;margin:3px}.PostsIndex__topics:hover{box-shadow:0 0 75px -10px #000;height:450px;overflow:auto;right:-30px}img.PostSummary__image{width:100%;max-width:640px;height:auto;border:0;padding:0;float:none;display:block}.PostSummary{position:relative;margin:0 2% 50px 0;border-radius:3px;box-shadow:0 15px 50px -15px #000;max-width:580px;background:#101823}.PostSummary.with-image .PostSummary__content,.PostSummary.with-image .PostSummary__reblogged_by,.PostSummary__content{margin:.5rem}.PostSummary__collapse{position:absolute;right:5px;top:5px}.PostSummary__body.entry-content{white-space:normal;color:#a6acb5;margin:0 0 30px}.PostSummary__footer{color:#fff}.Voting__inner{border:0}.Voting__button circle{stroke:#fff}.Voting__button-up>a:hover circle,a.confirm_weight:hover circle{fill:#4ba2f2;stroke:#4ba2f2}.Voting__button-up .Icon{box-shadow:0 0 15px rgba(0,0,0,.7);border-radius:100%;transform:scale3d(1,1,1) rotate(0);transition:all 1s cubic-bezier(.4,0,0,1.67)}.PostSummary:hover span.usersg{position:relative;transition:1s all ease}.PostSummary:hover .Voting__button-up .Icon{box-shadow:0 0 25px rgba(0,0,0,.7);transform:scale3d(2.2,2.1,2.6) rotate(720deg)}.dropdown-pane{background:#101823;border:0;box-shadow:0 0 20px #000;transition:1s all ease;color:#fff}.vcard>strong a,span.Author{font-weight:200;text-shadow:none;border-radius:10px;color:#fff}#closeop,.ReplyEditor{box-shadow:0 0 30px -10px #000}.Voting__adjust_weight .weight-display,.Voting__adjust_weight_down .weight-display{margin-left:20px;color:#fff;font-size:1.5rem}.Voting__adjust_weight,.Voting__adjust_weight_down{padding:10px 5px;margin-right:0;width:400px;overflow:hidden}.vcard>strong a{background:#4ba2f2;padding:0 7px 1px}span.Author{position:relative;background:#484848;padding:1px 6px 2px 12px}.Reputation{font-size:.8rem;border:0;border-radius:5px;background:#ffae00;color:#fff;padding:0 6px 0 3px}.vcard>strong a:before{content:'#';font-size:.6rem;margin-right:3px;color:#fff}.PostSummary__time_author_category{font-size:.7rem;border:0}.VotesAndComments{float:right}.PostsIndex.row{max-width:100%}.Voting__inner{margin-right:0}.grid-item{float:left;transition:.4s all ease}.grid-item,.grid-sizer{width:22%}.gutter-sizer{width:4%}#showanswer{position:fixed;right:26px;top:118px;background:#063465;color:#fff;font-size:14px;border-radius:3px;padding:1px 15px;z-index:400}span.usersg{transition:all .4s ease;background:#009c64;padding:1px 5px 2px}#drkloader{width:auto;display:block;height:100%;overflow:auto;overflow-x:hidden}#drkwidget,.answerholder{position:fixed;width:50%}.ReplyEditor{background:#fff;padding:20px 0;border-radius:5px;color:#000}ul#drkstream{margin:0;padding:0 15px;background:rgba(1,14,31,.9);height:90%;overflow-x:auto;overflow-y:auto}#drkstream li{display:none;list-style-type:none;font-size:.8rem}.svote a{background:#5974ff;color:#fff;padding:1px 5px;border-radius:10px;line-height:0;overflow:hidden;font-size:11px;font-weight:700}.scomment i{background:green;font-style:normal;padding:0 4px;border-radius:15px}.Voting span{color:#1dd492;text-shadow:0 0 3px #19943e}.drklog p{line-height:1;margin:0;background:#184e86;padding:10px}.insertsila strong{font-size:20px;background:url(https://golos.io/images/golospower-badge.jpg) no-repeat #fff;background-size:contain;padding:0 15px 0 35px;color:#1b5d9d;border-radius:30px}.drklog{text-align:center}#drkwidget{z-index:100;display:none;background:url(https://s28.postimg.org/bvu4yda25/endless_3d_cube_gif.gif) no-repeat #184e86;background-size:cover;top:110px;right:15px;height:600px;height:calc(100vh - 180px);border-radius:3px;box-shadow:0 0 10px -1px #000;overflow:hidden}ul#drkstream li b{background:rgba(75,162,242,.14);padding:1px 8px;border-radius:10px;font-weight:200}ul#drkstream li strong{background:rgba(114,255,98,.51);padding:1px 8px;border-radius:10px}.scomment div,.svote div{font-size:.8rem;height:.8rem;overflow:hidden;vertical-align:middle;line-height:.8rem;max-width:200px;display:inline-block;color:#3b4a5a}#closeop,#drkmenu,#drkstory,.answertarget .Voting{display:none}#drkmenu{text-align:center}#post_overlay{color:#000}.answerholder{z-index:500;background:#101823;display:none;top:150px;padding:15px;right:14px}#closeop,#opclose{background:#063465;border-radius:3px;font-size:14px}.answertarget{overflow:auto;height:500px;width:740px}#opclose{position:absolute;left:20px;top:10px;padding:3px 15px 5px;line-height:14px}#closeop{z-index:400;position:fixed;top:150px;right:26px;padding:5px 10px}.beforeload{transition:1s all}#drkstream::-webkit-scrollbar,body::-webkit-scrollbar{width:7px;height:9px}#drkstream::-webkit-scrollbar-track,body::-webkit-scrollbar-track{background:#053363}#drkstream::-webkit-scrollbar-thumb,body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.4)}#drkstory{overflow:auto;height:100%;opacity:.98}#drkstory tbody,.UserWallet tbody{border:0!important;background:#101823}#drkstory table tbody tr:nth-child(even),.UserWallet table tbody tr:nth-child(even){background-color:#063465}.UserWallet__balance.row{background:#fff;padding:15px;color:#000;font-weight:700}.reveal.fade.in{background:#20242a;color:#fff;border:0;box-shadow:0 0 50px #000}a.go-top{position:fixed;background:#334258;bottom:10px;left:10px;color:#fff;padding:10px;box-shadow:0 0 20px #000;border-radius:3px}.answertarget .PostSummary{position:relative;margin:10px 0;border-radius:3px;box-shadow:0 15px 50px -15px #000;max-width:660px;background:#101823;color:#fff}.answertarget .PostSummary__body.entry-content{color:#fff;margin:0}.Comment .highlighted { background: #415879; padding: 5px; border-radius: 10px; }.Post a { color: #9cd0ff; }</style>";
var somehtml = '<a href="#0" class="go-top">Вверх</a><div id="drkwidget"><div class="drklog"><p id="silag"><span class="insertsila"><strong>Сила Голоса...</strong></span></p><span id="opclose">Закрыть</span><span id="currblock">Загружаем текущий блок...</span><span id="dwitness"></span></div><div id="drkmenu">Моя история</div><div id="drkstory"></div><ul id="drkstream"><li class="beforeload"><center>Подключаемся к ноде... Для корректной работы используйте только одну вкладку Голоса</center></li><li class="beforeload2"><center>В этой ноде идет трансляция действий пользователей: комментарии, голосование, упоминания, фолловинг и другое. При низком качестве подключения возможны потери событий из трансляции. Для минимизации потерь не открывайте несколько вкладок Голоса одновременно!</center></li></ul></div><div id="closeop">Мониторинг</div>';
$(inlinecss).appendTo("head"); // Устанавливаем CSS стили
$(somehtml).appendTo("body"); // Вставляем необходимые html элементы

// Меняем в постах маленькие фото на большие: 256x128 > 640x480 
function imgtoggle() {
    var tinyimg = new RegExp('/256x128/'), // Берем ссылки на маленькие превью
        bigimg = new RegExp('640x480'); // Меняем в ссылка значение разрешения фотографии, обращаясь к проксификатору по ссылке https://imgp.golos.io/640x480/
    $('img.PostSummary__image').each(function() {
        var image = $(this);
        image.attr('src', image.attr('src').replace(tinyimg, bigimg)); // Тут происходит ранее описанная замена 256x128 на 640x480
    });
}
imgtoggle();
setTimeout(function() {
    $('#drkwidget').slideDown();
}, 2000);
$('#opclose').on('click', function() {
    $('#drkwidget').slideUp();   $('.PostsIndex.row' ).css('max-width',' 80%');
    $('#closeop').slideDown();
});
$('#closeop').on('click', function() {
    $('#drkwidget').slideDown();
    $(this).slideUp(); $('.PostsIndex.row' ).css('max-width',' 100%');
});




function drkwait() {
    socket = new WebSocket('wss://ws.golos.io'); account = myname;
    var movementTotal, silaTotal;
    socket.onopen = function(event) {
        socket.send(JSON.stringify({
            id: 1,
            method: 'get_dynamic_global_properties',
            'params': []
        }));
    };
   socket.onmessage = function(event) {
        var silaGolosa, powerMovement, data = JSON.parse(event.data),
            stream = document.getElementById('drkstream');
        lastblock = startblock;
        merkle = data.result.transaction_merkle_root;
        if (merkle !== 0 && startblock > 100) {
            if (data.id === 1) {
                movementTotal = data.result.total_vesting_shares.split(' ')[0];
                silaTotal = data.result.total_vesting_fund_steem.split(' ')[0];

                socket.send(JSON.stringify({
                    id: 2,
                    method: 'get_accounts',
                    params: [
                        [account]
                    ]
                }));
                socket.send(JSON.stringify({
                    id: 3,
                    method: 'get_block',
                    'params': [lastblock]
                }));
                //  socket.send(JSON.stringify({ id: 4, method:'get_account_history', params: [ [account] ] })); История аккаунта
                document.getElementById('currblock').innerHTML = '<span class="insertblock"><strong>' + lastblock + '</strong> Последний блок. </span>';
            }
            if (data.id === 2) {
                powerMovement = data.result[0].vesting_shares.split(' ')[0];
                silaGolosa = silaTotal * (powerMovement / movementTotal);
                document.getElementById('silag').innerHTML = '<span class="insertsila"><strong>' + silaGolosa + '</strong></span>';
            }

            if (data.id === 3) {
                tx = data.result.transactions[0].operations[0][1];
                wtnss = data.result.witness;
                drkvoter = JSON.stringify(tx.voter);
                drkpower = JSON.stringify(tx.weight);
                drkauthor = JSON.stringify(tx.author);
                drklink = JSON.stringify(tx.permlink);
                drkcomm = JSON.stringify(tx.parent_author);
                drkbodycomm = JSON.stringify(tx.body);
                drknewbie = JSON.stringify(tx.new_account_name);
                drkfl = tx.json; // Фолловинг (подписки)
                mention = JSON.stringify(tx.to); // Mention упоминания
                mentmemo = JSON.stringify(tx.memo);
                document.getElementById('dwitness').innerHTML = '<span class="inserwtnss"> В ноде <strong>' + wtnss + '</strong></span>';
                if (typeof mentmemo !== "undefined") {
                    memocut = mentmemo.slice(26);
                    stream.insertAdjacentHTML('afterbegin', '<li class="sfollow"><b>' + mention + '</b> упомянул ' + memocut + '</li>');
                }
                if (typeof drknewbie !== "undefined") {

                    stream.insertAdjacentHTML('afterbegin', '<li class="snewbie">Новый пользователь > <strong>' + drknewbie + '</strong>!</li>');
                }
                if (typeof drkcomm !== "undefined" && typeof drkauthor !== "undefined") {
                    stream.insertAdjacentHTML('afterbegin', '<li class="scomment"><b>' + drkauthor + '</b> комментирует пост <strong>' + drkcomm + '</strong> <div>' + drklink + '</div></li>');
                }
                if (typeof drkvoter !== "undefined" && typeof drkauthor !== "undefined") {
                    stream.insertAdjacentHTML('afterbegin', '<li id=' + drkauthor + ' class="svote"><b>' + drkvoter + '</b>  <a title=' + drklink + ' href=' + drklink + '>></a>  голосует с силой ' + drkpower + ' за <strong>' + drkauthor + '</strong>    <div>' + drklink + '</div></li>');
                }
                if (typeof drkfl !== "undefined") {
                    df = JSON.parse(drkfl);
                    dfollower = df[1].follower;
                    dfollowin = df[1].following;
                    stream.insertAdjacentHTML('afterbegin', '<li class="sfollow"><b>' + dfollower + '</b> подписка на <strong>' + dfollowin + '</strong></li>');

                }
            }

        }



    };
}




// Получаем параметры, который пользователь может добавить в конец своей ссылки на аватар.  Синтаксис //domain.tld/img.jpg?css=[css стили] 
// Так же получаем юзернэйм для которого нужно показывать блок ответов
function waitfor() { // Внутри функции будем ждать полной загрузки страницы и проверять когда появятся необходимые нам ссылки

    var Upic = $('.Userpic');
    var userpicUrl = $('.Userpic img').attr('src'); // Проверяем ссылку на аватар
    var usernameUrl = Upic.parent().attr('href'); // Проеверяем ссылку на юзернэйм. Нам нужно получить из нее ник текущего пользователя, что бы ответы в виджет загружались именно для вас. 
    // Если ссылки уже доступны, выдираем только нужные нам параметры:  
    // Фильтруем и получаем параметры, который пользователь добавил в своем аккаунте в конец ссылки на аватар  например //вк.ком/рукалицо.jpg?css=[#content{background:black;}] сделает фон контента черным

    function getParameterByName(name, url) {
        if (!url) {
            url = userpicUrl;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&]*)|&||$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    // Функция с помощью который мы загрузим ответы в будущем.
    function answerupdate() {
        $('.answertarget').load(usernameUrl + '/recent-replies/ #posts_list');
    }
if (Upic.length) {
  
  myname = usernameUrl.slice(2);
 var isVisible = function(obj) {
            return obj.offsetWidth > 0 && obj.offsetHeight > 0;
        };
        var curry = function(uncurried) {
            var parameters = Array.prototype.slice.call(arguments, 1);
            return function() {
                return uncurried.apply(this, parameters.concat(Array.prototype.slice.call(arguments, 0)));
            };
        };
        var getAndAddToCallbacks = function(socket, callbacks, method, params, callback) {
            callbacks.push(callback);
            var data = {
                id: callbacks.length - 1,
                method: method,
                params: params
            };
            socket.send(JSON.stringify(data));
        };
        var runFun = function(funs, id, data) {
            funs[id](data);
        };
        var socket = new WebSocket('wss://ws.golos.io'),
            callbacks = [];
        var getResult = curry(getAndAddToCallbacks, socket, callbacks),
            runCallback = curry(runFun, callbacks);
        socket.onopen = function(event) {
            getResult('get_dynamic_global_properties', [], function(data) {
                var totalVestingShares = data.result.total_vesting_shares.split(' ')[0],
                    totalVestingFundSteem = data.result.total_vesting_fund_steem.split(' ')[0];
                var nodes = [].slice.call(document.querySelectorAll('[itemprop=author] strong')).reduce(function(nodes, node) {
                    if (!isVisible(node) || node.ssp__hasSp) {
                        return nodes;
                    }
                    nodes.push(node);
                    return nodes;
                }, []);
                var accounts = nodes.map(function(node) {
                    return node.innerHTML;
                });
                getResult('get_accounts', [accounts], function(data) {
                    data.result.forEach(function(account, i) {
                        var vestingShares = account.vesting_shares.split(' ')[0];
                        var steemPower = totalVestingFundSteem * (vestingShares / totalVestingShares);

                        var parent = nodes[i].parentNode;

                        console.log(account.name + ' ' + steemPower);
                        nodes[i].outerHTML = '' + account.name + ' <span class="usersg">' + Math.round(steemPower) + '</span>';
                        nodes[i].ssp__hasSp = true;


                    });
                    
                });
            });




        };
       socket.onmessage = function(event) {
            var data = JSON.parse(event.data);
            runCallback(data.id, data);
        };
       setInterval(function() {
            startblock++;
            drkwait();

            imgtoggle();
            $('#drkstream li,#drkmenu').slideDown();


        }, 5000); // Проверяем новые блоки. 



        $('.Header__top-steemit').html('<a href="/@vik/">Dark Voice<span class="beta">@vik</span></a>');
        $('.beforeload').css('opacity', '0');

       
      
        




        // Даем возможность обновлять ответы нажатием кнопки "Обновить ответы"
        $('<div class="answerholder"><p id="answerupdate">Обновить ответы</p><div class="answertarget">Загрузка...</div></div><div id="showanswer">Мои ответы</div>').appendTo("body");

        $('#answerupdate').on('click', function() {
            answerupdate();
        });

        // Даем возможность открывать/закрывать блок ответов
        var isActive = true;
        $('#showanswer').on('click', function() {
            if (isActive) {
                answerupdate();


                $('.answerholder').slideDown();
            } else {
                $('.answerholder').slideUp();
            }
            isActive = !isActive;

        });


        // моя история

        $('#answerupdate').on('click', function() {
            answerupdate();
        });

        // Даем возможность открывать/закрывать блок ответов
      
        $('#drkmenu').on('click', function() {
            if (isActive) {
                $('#drkstory').load(usernameUrl + '/transfers/ table'); // загрузка истории
                $('#drkstory').slideDown();
            } else {
                $('#drkstory').slideUp();
            }
            isActive = !isActive;

        });



        // Получаем то, что после ?css= и перед &  


        // Убираем квадратные скобки по бокам из переменной
        var cleaning = getParameterByName('css');

        if (cleaning !== null) {
            var stringcss = cleaning.substring(1, cleaning.length - 1);
            // Оборачиваем в теги стиля    

            // Если параметр существует 
            var cleanCSS = $('<style></style>').append(stringcss);
            // Подключаем наш кастом стиль. На данный момент он применяется только после полной загрузки страницы, но в следующей версии скрипта я это исправлю.
            cleanCSS.appendTo("head");
        }
        //C остальными пармаетрами проще. Можно получить параметр после каждого & в формате //вк.ком/рукалицо.jpg?option1=ON&option2=OFF&option3=BIG
        // Пока опции есть как пример и демо функционала, осталось придумать какие опции могуть быть нужны. Например фиксировать ли кнопки редактора или нет. Или отключить большинсво ненужных элементов. 
        // В качестве примера отключим топики - метки в сайдбаре 
        var notopics = getParameterByName('topics');
        if (notopics == 'OFF') {
            $('.PostsIndex__topics').slideUp(); // Топики улетают
            // Добавляем кнопку, по нажатию которой топики выпадут вниз
            $('<div id="slidetopics">Топики</div>').appendTo("body");

            $('#slidetopics').on('click', function() {
                if (isActive) {

                    $('.PostsIndex__topics').slideDown();
                } else {
                    $('.PostsIndex__topics').slideUp();
                }
                isActive = !isActive;
            });

        }
        // Для отключения топиков вставьте в ссылку аватара параметр &notopics=OFF 
        // В следующей версии скина будет больше параметров и настроек  


    }
    // Так как мы все еще внутри условия "Если аватарка уже загрузилась" , то если она не загрузилась - мы будем рекурсивно проверять и ждать ее каждую секунду   
    else {
        setTimeout(waitfor, 1000);
    }
}
waitfor();

// Добавляем кнопку-стрелку возвращения в начало страницы
$(document).ready(function() {
    // Show or hide the sticky footer button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('.go-top').fadeIn(200);

        } else {
            $('.go-top').fadeOut(200);
        }
    });

    // Animate the scroll to top
    $('.go-top').click(function(event) {
        event.preventDefault();


        $('html, body').animate({
            scrollTop: 0
        }, 300);
    });
});


// Сообщение в консоли браузера.
console.log('Вы установили userscript от golos.io/@vik и сейчас вы смотрите консоль :) ВНИМАНИЕ! Перед установкой этого или похожего скрипта убедитесь, что вы нашли его в надежном источнике! Если вы не уверены, что скрипт оригинальный - обратитесь к опытным пользователям и попросите проверить его на предмет внедрения вредного кода. Вы можете обратиться ко мне в голосе golos.io/@vik/ ');