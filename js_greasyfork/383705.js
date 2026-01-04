// ==UserScript==
// @name         AnimeList
// @version      2.0
// @author       Fenion
// @description  Список аниме-сериалов
// @match        https://anidub.tv/*
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js
// @namespace    https://greasyfork.org/ru/scripts/383705-animelist
// @downloadURL https://update.greasyfork.org/scripts/383705/AnimeList.user.js
// @updateURL https://update.greasyfork.org/scripts/383705/AnimeList.meta.js
// ==/UserScript==
var debug = false;
if(debug){
    var start = Date.now();
}
try{
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
}catch(e){
    alert('LocalStorage is not available. Terminating script.');
    return;
}
$(function(){
    $('body').append(`
    <div id="al"><a href="javascript: void(0)" class="mbtn"></a></div>
    <div id="anime-list">
       <div class="q"></div>
       <div class="list">
          <div class="animes">
             <a id="close" href="javascript: void(0)">X</a>
             <h1>Список просматриваемых аниме</h1>
             <hr>
          </div>
       </div>
    </div>`);
    $('body').append(`
    <style>
    .mbtn{
        width: 40px;
         height: 40px;
         opacity: 0.3;
         position: fixed;
         bottom: 50px;
         left: 150px;
         display: inline;
         z-index: 500;
         text-indent: -9999px;
         background: url("https://raw.githubusercontent.com/Fenion/AnimeList/master/icon.png") no-repeat;
    }
    a.addbtns {
        color: #fff;
         text-decoration: none;
         user-select: none;
         background: rgb(212,75,56);
         padding: .1em 1.5em;
         outline: none;
    }
    a.addbtns:hover {
         background: rgb(232,95,76);
    }
    a.addbtns:active {
         background: rgb(152,15,0);
    }
    .swal-overlay{
        background-color:rgba(43, 165, 137, 0.45)
    }
    .cnt {
        text-align: center;
    }
    .q {
        display: none;
         position: fixed;
         top: 0;
         left: 0;
         width: 100%;
         height: 100%;
         background: rgba(43, 165, 137, 0.45);
         opacity: 0.6;
         z-index: 150;
    }
    .list {
        display: none;
         position: fixed;
         top: 0;
         right: 0;
         bottom: 0;
         left: 0;
         text-align: center;
         padding: 20px;
         z-index: 1000;
    }
    .animes {
         display: none;
         border-radius: 5px;
         width: 100%;
         overflow-y: auto;
         max-height: 80%;
         min-width: 200px;
         position: relative;
         background-color: #FAFAFA;
         z-index: 300;
         padding: 60px 0;
    }
    .anime{
        position: relative;
         width: 100%;
         margin: 0px;
         padding-box: 0px;
         z-index: 400
    }
    .img{
        position: relative;
         width: 100%;
         height: 200px;
         padding: 0px;
    }
    .kartinka{
        position: absolute;
         height: 200px;
         left: 10px;
    }
    .nme{
        position: absolute;
         top: 10%;
         left: 200px;
         width: 80%;
    }
    .del{
        position: absolute;
         top: 45%;
         right: 10%;
         width: 115px;
         height: 15px;
         color: #fff;
         text-decoration: none;
         user-select: none;
         background: rgb(212,75,56);
         padding: .7em 1.5em;
         outline: none;
    }
    ::-webkit-scrollbar {
        width: 12px;
    }
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
         border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
         -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    #close{
        position: fixed;
         top: 30px;
         right: 40px;
         z-index: 1000;
         color: #fff;
         text-decoration: none;
         user-select: none;
         background: rgb(255, 82, 82);
         padding: .1em .5em;
         outline: none;
    }
    .srs{
        position: absolute;
         width: 100%;
         bottom: 20%;
    }
    .red{
        position: absolute;
         right: 38px;
         bottom: 10%;
         color: #fff;
         text-decoration: none;
         user-select: none;
         background: rgb(255,165,0);
         padding: .01em .3em;
         outline: none;
    }
    .plus{
        position: absolute;
         bottom: 10%;
         right: 1%;
         color: #fff;
         text-decoration: none;
         user-select: none;
         background: rgb(0,155,0);
         padding: .1em .5em;
         outline: none;
    }
    .min{
        position: absolute;
         bottom: 10%;
         left: 5%;
         color: #fff;
         text-decoration: none;
         user-select: none;
         background: rgb(212,75,56);
         padding: .1em .6em;
         outline: none;
    }
    .seriesbtn{
        position: relative;
         width: 40px;
         left: 49%;
         bottom: 19px;
    }</style>`);

    var imgMeta = getMeta('og:image'),
        animes = localStorage.getItem('animes'),
        url = window.location.href,
        restr = 100,
        wrap = $('#anime-list'),
        btn = $('.mbtn'),
        strg = localStorage,
        modal = $('.q, .list, .animes');

    function getMeta(metaName) {
        const metas = document.getElementsByTagName('meta');
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('property') === metaName) {
                return metas[i].getAttribute('content');
            }
        }
        return '';
    }
    function no_anime() {
        swal({
            icon: 'error',
            text: 'В вашем списке ещё нет аниме!',
            button: "Ok!",
        });
    }
    function addAnime() {
        if (animes >= restr) {
            swal({
                icon: 'error',
                text: 'Список аниме заполнен!',
                button: 'Ok!',
            });
        } else {
            let title = getMeta('og:title'),
                a = title.split(' ').splice(2),
                name = a.join(' '),
                r = title.match(/[^[\]]+(?=])/g).join(),
                t = Number(r.split(' ')[0]);
            for (var f = 1; f <= restr; f++) {
                let anime = strg.getItem('anime' + f);
                if (anime == null) {
                    localStorage.setItem('animes', ++animes);
                    strg.setItem('anime' + f, url + ' 0');
                    $('.animes').append(`
                    <div id="${f}" class="anime">
                        <a href="${url}">
                            <h3 class="srs">Просмотрено: 0 из ${t}</h3>
                            <div class="img">
                                <img src="${imgMeta}" class="kartinka" width="160"></img>
                            </div>
                            <div class="nme">
                                <h2>${name}</h2>
                            </div>
                        </a>
                        <a href="javascript: void(0)" class="del" id="${f}">Удалить</a>
                        <div class="seriesbtn">
                            <a href="javascript: void(0)" class="red" id="${f}">&#9998;</a>
                            <a href="javascript: void(0)" id="${f}" class="min" style="display: none;">-</a>
                            <a href="javascript: void(0)" id="${f}" class="plus">+</a>
                        </div>
                        <hr>
                    </div>`);
                    swal({
                        icon: 'success',
                        text: 'Аниме добавлено в список!',
                        button: 'Ok!',
                    });
                    if(debug){
                        console.log('%c' + title + ' added to the list successfully!', 'background: green; color: white;');
                    }
                    break;
                }
            }
        }
    }
    function delAnime(num) {
        strg.removeItem('anime' + num);
        strg.setItem('animes', --animes);
        let id = ('#' + num),
            anis = strg.getItem('animes');
        $('.anime' + id).remove();
        if(anis == 0){ modal.fadeOut(); }
        swal({
            icon: 'success',
            text: 'Аниме удалено из списка!',
            button: 'Ok!'
        });
        if(debug){
            console.log('%cAnime #' + num + ' deleted succesfully!', 'background: green; color: white;');
        }
    }
    function ajaxReq(a, q) {
        $.ajax({
            url: q,
            async: true,
            success: function(data, textStatus, jqXHR) {
                var title = $(data).filter("meta[property='og:title']").attr("content"),
                    img = $(data).find("meta[property='og:image']").attr("content"),
                    series = title.match(/[^[\]]+(?=])/g).join(),
                    h = Number(series.split(' ')[0]),
                    ttlArr = title.split(' ').splice(2),
                    name = ttlArr.join(' '),
                    sP = '',
                    sM = '';
                let s = strg.getItem('anime' + a).split(' ')[1];
                if(Number(s) >= Number(h[0])){
                    sP = 'style = "display:none;"';
                    sM = 'style = "display:auto;"';
                } else if(s == 0) {
                    sM = 'style = "display:none;"';
                    sP = 'style = "display:auto;"';
                } else if(s == 1) {
                    sM = 'style = "display:none;"';
                    sP = 'style = "display:auto;"';
                } else {
                    sP = 'style = "display:auto;"';
                    sM = 'style = "display:auto;"';
                }
                $('.animes').append(`
                <div id="${a}" class="anime">
                    <h3 class="srs">Просмотрено: ${s} из ${h}</h3>
                    <a href="${q}">
                        <div class="img">
                            <img src="${img}" class="kartinka" width="160"></img>
                        </div>
                        <div class="nme">
                            <h2>${name}</h2>
                        </div>
                    </a>
                    <a href="javascript: void(0)" class="del" id="${a}">Удалить</a>
                    <div class="seriesbtn">
                        <a href="javascript: void(0)" class="red" id="${a}">&#9998;</a>
                        <a href="javascript: void(0)" id="${a}" class="min" ${sM}>-</a>
                        <a href="javascript: void(0)" id="${a}" class="plus" ${sP}>+</a>
                    </div>
                    <hr>
                </div>`);
                if(debug){
                    console.log(`%cCool! Ajax request sent successfully! [${jqXHR.status}]`, 'background: green; color: white;');
                }
            },
            error: function(jqXHR) {
                console.log(`%cOops! Something went wrong with Ajax! [${q}][${jqXHR.status}]`, 'background: red; color: white;');
            }
        });
    }
    function update() {
        for(let i = 1; i <= restr; i++){
            let a = strg.getItem('src' + i),
                b = strg.getItem('series' + i);
            if(a == null) {} else {
                strg.setItem('anime' + i, a + ' ' + b);
                strg.removeItem('src' + i);
                strg.removeItem('series' + i);
            }
        }
        location.reload();
    }
    function redSeries(ser, aydi){
        var a = $('#' + aydi + '.anime').find(".srs"),
            b = $(a).html().split(' '),
            p = $('#' + aydi + '.anime').find('.plus'),
            m = $('#' + aydi + '.anime').find('.min');
        if(!ser){
        } else if(ser > Number(b[3])) {
        } else if (ser < 0) {
        } else if(Number(ser)){
            let c = b[1] = ser,
                d = b.join(' '),
                test = strg.getItem('anime' + aydi).split(' ');
            test[1] = ser;
            console.log(test);
            strg.setItem('anime' + aydi, test.join(' '));
            $(a).text(d);
            if(debug){
                console.log(d);
                console.log(ser);
                console.log(Number(b[1]));
            }
            if(c >= b[3]){
                p.css({'display':'none'});
                m.css({'display':'block'});
            } else if(c == 0) {
                m.css({'display':'none'});
                p.css({'display':'block'});
            } else if(c == 1) {
                m.css({'display':'none'});
                p.css({'display':'block'});
            } else {
                p.css({'display':'block'});
                m.css({'display':'block'});
            }
        } else {
            alert('Пожалуйста введите число!');
        }
    }
    if (!animes) {
        strg.setItem('animes', 0);
    } else if (animes == 0) {
    } else if (animes > 0) {
        for (var a = 1; a <= restr; a++) {
            var q = strg.getItem('anime' + a);
            if (q == null) {} else {
                ajaxReq(a, q.split(' ')[0]);
            }
        }
    }
    if (!imgMeta) {} else {
        $('.poster_img').append('<a href="javascript: void(0)" class="addbtns">Добавить в список</a>');
    }
    $('.addbtns').click(addAnime);
    btn.click(function() {
        if (animes == 0) {
            no_anime();
        } else if (!animes) {
            no_anime();
        } else {
            modal.fadeIn();
        }
    });
    $('#close').click(function() {
        modal.fadeOut();
    });
    $(document).on("click", ".del", function() {
        let id = $(this).attr("id");
        delAnime(id);
    });
    $(document).on('click','.red' ,function() {
        let id = $(this).attr('id');
        swal('Введите кол-во просмотренных серий', {
            content: "input",
        }).then((value) => {
            redSeries(Number(value), id);
        });
    });
    $(document).on('click', '.plus', function(){
        let id = $(this).attr('id'),
            d = strg.getItem('anime' + id).split(' ')[1],
            v = ++d;
        redSeries(v, id);
    });
    $(document).on('click', '.min', function(){
        let id = $(this).attr('id'),
            d = strg.getItem('anime' + id).split(' ')[1],
            v = --d;
        redSeries(v, id);
    });
    if(debug){
        var end = Date.now();
        var time = end - start;
        console.log('%cScript started in ' + time + 'ms', 'background: green; color: white;');
    }
    for(let i = 1; i <= restr; i++){
        if(strg.getItem('src' + i) != null){
            swal({
                icon: 'info',
                title: 'Внимание!',
                text: 'Скрипт перешёл на новый метод хранения информации! Чтобы сохранить список аниме, требуется обновить записи в локальном хранилище! Скрипт сделает это за вас, просто подтвердите действие!',
                buttons: {
                    cancel: 'Отмена',
                    confirm: 'Обновить'
                }
            }).then((value) => {
                console.log(value);
                if(value == true) {
                    update();
                }
            });
        }
    }
});
